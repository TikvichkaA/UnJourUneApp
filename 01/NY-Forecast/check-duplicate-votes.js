// Script pour détecter et corriger les votes en double dans les prédictions
// Usage: node check-duplicate-votes.js [--group=nom] [--dry-run] [--fix]

const PROJECT_ID = 'cc-forecast-88580';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Récupérer les arguments
const args = process.argv.slice(2);
let currentGroup = null;
let dryRun = true;
let fixMode = false;

args.forEach(arg => {
    if (arg.startsWith('--group=')) {
        currentGroup = arg.split('=')[1];
    } else if (arg === '--fix') {
        dryRun = false;
        fixMode = true;
    }
});

if (!currentGroup) {
    console.error('❌ Erreur: vous devez spécifier un groupe avec --group=nom');
    console.error('Usage: node check-duplicate-votes.js --group=cc [--fix]');
    process.exit(1);
}

function getCollectionPath(name) {
    if (currentGroup) {
        return `groups/${currentGroup}/${name}`;
    }
    return name;
}

async function listDocs(collection) {
    const collPath = getCollectionPath(collection);
    const response = await fetch(`${BASE_URL}/${collPath}`);
    const data = await response.json();
    return data.documents || [];
}

async function updateDoc(collection, docId, updates) {
    const fields = {};
    
    // Convertir les valeurs en format Firestore
    function convertValue(value) {
        if (value === null || value === undefined) {
            return { nullValue: null };
        } else if (typeof value === 'string') {
            return { stringValue: value };
        } else if (typeof value === 'boolean') {
            return { booleanValue: value };
        } else if (typeof value === 'number') {
            return { integerValue: value.toString() };
        } else if (value instanceof Date) {
            return { timestampValue: value.toISOString() };
        } else if (typeof value === 'object' && !Array.isArray(value)) {
            // Pour les objets (comme votes), on doit convertir récursivement
            const mapFields = {};
            for (const [k, v] of Object.entries(value)) {
                mapFields[k] = convertValue(v);
            }
            return { mapValue: { fields: mapFields } };
        }
        return { nullValue: null };
    }
    
    for (const [key, value] of Object.entries(updates)) {
        fields[key] = convertValue(value);
    }

    const updateMask = Object.keys(updates).map(k => `updateMask.fieldPaths=${k}`).join('&');
    const collPath = getCollectionPath(collection);
    const url = `${BASE_URL}/${collPath}/${docId}?${updateMask}`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
    }

    return await response.json();
}

// Convertir un vote Firestore en format JavaScript
function parseFirestoreVote(voteField) {
    if (!voteField) return null;
    
    if (voteField.booleanValue !== undefined) {
        return voteField.booleanValue;
    }
    
    if (voteField.mapValue && voteField.mapValue.fields) {
        const fields = voteField.mapValue.fields;
        const result = {
            vote: fields.vote?.booleanValue ?? null,
            confidence: fields.confidence?.integerValue ? parseInt(fields.confidence.integerValue) : null
        };
        return result;
    }
    
    return null;
}

async function checkDuplicateVotes() {
    console.log(`\n🔍 Recherche des votes en double dans le groupe "${currentGroup}"...\n`);
    
    const docs = await listDocs('predictions');
    console.log(`Total: ${docs.length} prédictions\n`);
    
    let totalIssues = 0;
    let totalFixed = 0;
    
    for (const doc of docs) {
        const docId = doc.name.split('/').pop();
        const text = doc.fields?.text?.stringValue || '';
        const votesField = doc.fields?.votes?.mapValue?.fields || {};
        
        if (!votesField || Object.keys(votesField).length === 0) {
            continue;
        }
        
        // Extraire les votes et détecter les doublons
        const votes = {};
        const seenUserIds = new Set();
        const duplicateUserIds = new Set();
        
        for (const [userId, voteData] of Object.entries(votesField)) {
            if (seenUserIds.has(userId)) {
                duplicateUserIds.add(userId);
            } else {
                seenUserIds.add(userId);
                votes[userId] = parseFirestoreVote(voteData);
            }
        }
        
        if (duplicateUserIds.size > 0) {
            totalIssues++;
            console.log(`⚠️  Prédiction: "${text.substring(0, 60)}${text.length > 60 ? '...' : ''}"`);
            console.log(`   ID: ${docId}`);
            console.log(`   Votes en double pour: ${Array.from(duplicateUserIds).join(', ')}`);
            
            // Compter les votes actuels vs après nettoyage
            const currentVoteCount = Object.keys(votesField).length;
            const cleanedVoteCount = Object.keys(votes).length;
            console.log(`   Votes avant: ${currentVoteCount}, après: ${cleanedVoteCount}`);
            
            if (fixMode) {
                try {
                    // Convertir votes en format Firestore pour la mise à jour
                    const cleanedVotesField = {};
                    for (const [userId, voteValue] of Object.entries(votes)) {
                        if (typeof voteValue === 'boolean') {
                            cleanedVotesField[userId] = { booleanValue: voteValue };
                        } else if (voteValue && typeof voteValue === 'object') {
                            cleanedVotesField[userId] = {
                                mapValue: {
                                    fields: {
                                        vote: { booleanValue: voteValue.vote },
                                        confidence: voteValue.confidence !== null 
                                            ? { integerValue: voteValue.confidence.toString() }
                                            : { nullValue: null }
                                    }
                                }
                            };
                        }
                    }
                    
                    await updateDoc('predictions', docId, { votes: cleanedVotesField });
                    console.log(`   ✅ Corrigé`);
                    totalFixed++;
                } catch (error) {
                    console.error(`   ❌ Erreur lors de la correction: ${error.message}`);
                }
            }
            console.log('');
        }
    }
    
    if (totalIssues === 0) {
        console.log('✅ Aucun vote en double trouvé !\n');
    } else {
        console.log(`\n${dryRun ? '🔍 Mode dry-run - ' : ''}${totalIssues} prédiction(s) avec des votes en double`);
        if (fixMode) {
            console.log(`${totalFixed} prédiction(s) corrigée(s)`);
        } else {
            console.log('\nPour corriger, relancez avec --fix:');
            console.log(`  node check-duplicate-votes.js --group=${currentGroup} --fix`);
        }
    }
}

checkDuplicateVotes().catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
});





