// Script pour corriger les votes en double où le même utilisateur vote plusieurs fois (via différents IDs)
// Usage: node fix-duplicate-user-votes.js [--group=nom] [--dry-run] [--fix]

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
    console.error('Usage: node fix-duplicate-user-votes.js --group=kenopotes [--fix]');
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
        return { vote: voteField.booleanValue, confidence: null };
    }
    
    if (voteField.mapValue && voteField.mapValue.fields) {
        const fields = voteField.mapValue.fields;
        return {
            vote: fields.vote?.booleanValue ?? null,
            confidence: fields.confidence?.integerValue ? parseInt(fields.confidence.integerValue) : null
        };
    }
    
    return null;
}

async function fixDuplicateUserVotes() {
    console.log(`\n🔍 Recherche des votes en double par utilisateur dans le groupe "${currentGroup}"...\n`);
    
    // Charger les utilisateurs
    const userDocs = await listDocs('users');
    const usersMap = {}; // ID -> nom
    const namesToIds = {}; // nom -> [IDs]
    
    userDocs.forEach(doc => {
        const id = doc.name.split('/').pop();
        const name = doc.fields?.name?.stringValue || '';
        if (name) {
            usersMap[id] = name;
            if (!namesToIds[name]) {
                namesToIds[name] = [];
            }
            namesToIds[name].push(id);
        }
    });
    
    // Charger les prédictions
    const predDocs = await listDocs('predictions');
    console.log(`Prédictions: ${predDocs.length}\n`);
    
    let totalFixed = 0;
    const issues = [];
    
    for (const doc of predDocs) {
        const docId = doc.name.split('/').pop();
        const text = doc.fields?.text?.stringValue || '';
        const votesField = doc.fields?.votes?.mapValue?.fields || {};
        
        // Grouper les votes par nom d'utilisateur
        const votesByUserName = {}; // nom -> [{userId, voteData}]
        
        for (const [userId, voteField] of Object.entries(votesField)) {
            const userName = usersMap[userId];
            if (userName) {
                if (!votesByUserName[userName]) {
                    votesByUserName[userName] = [];
                }
                const voteData = parseFirestoreVote(voteField);
                votesByUserName[userName].push({ userId, voteData, originalField: voteField });
            }
        }
        
        // Trouver les utilisateurs avec plusieurs votes
        const usersWithMultipleVotes = Object.entries(votesByUserName)
            .filter(([name, votes]) => votes.length > 1);
        
        if (usersWithMultipleVotes.length > 0) {
            const cleanedVotes = {};
            const duplicatesToRemove = [];
            
            // Pour chaque utilisateur avec plusieurs votes, garder le meilleur
            for (const [userId, voteField] of Object.entries(votesField)) {
                const userName = usersMap[userId];
                
                if (!userName) {
                    // Garder les votes des IDs inconnus
                    cleanedVotes[userId] = voteField;
                    continue;
                }
                
                const userVotes = votesByUserName[userName];
                if (userVotes.length === 1) {
                    // Pas de doublon pour cet utilisateur
                    cleanedVotes[userId] = voteField;
                } else {
                    // Plusieurs votes pour cet utilisateur
                    // Trouver le vote à garder (celui avec confiance la plus élevée, ou le premier)
                    const votes = userVotes;
                    let bestVote = votes[0];
                    let bestVoteIndex = 0;
                    
                    for (let i = 1; i < votes.length; i++) {
                        const currentConf = votes[i].voteData?.confidence || 0;
                        const bestConf = bestVote.voteData?.confidence || 0;
                        if (currentConf > bestConf) {
                            bestVote = votes[i];
                            bestVoteIndex = i;
                        }
                    }
                    
                    // Garder seulement le meilleur vote
                    if (bestVote.userId === userId) {
                        cleanedVotes[userId] = voteField;
                    } else {
                        // Marquer comme à supprimer
                        duplicatesToRemove.push({ userId, userName, voteData: votes.find(v => v.userId === userId)?.voteData });
                    }
                }
            }
            
            issues.push({
                id: docId,
                text,
                usersWithMultipleVotes: usersWithMultipleVotes.map(([name, votes]) => ({
                    name,
                    votesCount: votes.length,
                    keptVote: votes.reduce((best, v) => {
                        const bestConf = best?.voteData?.confidence || 0;
                        const vConf = v.voteData?.confidence || 0;
                        return vConf > bestConf ? v : best;
                    }).userId,
                    removedVotes: votes.filter(v => v.userId !== votes.reduce((best, v) => {
                        const bestConf = best?.voteData?.confidence || 0;
                        const vConf = v.voteData?.confidence || 0;
                        return vConf > bestConf ? v : best;
                    }).userId).map(v => v.userId)
                })),
                cleanedVotes
            });
        }
    }
    
    if (issues.length === 0) {
        console.log('✅ Aucun vote en double par utilisateur trouvé !\n');
        return;
    }
    
    console.log(`⚠️  ${issues.length} prédiction(s) avec des votes en double par utilisateur:\n`);
    
    for (const issue of issues) {
        console.log(`📋 "${issue.text.substring(0, 60)}${issue.text.length > 60 ? '...' : ''}"`);
        console.log(`   ID: ${issue.id}`);
        issue.usersWithMultipleVotes.forEach(({name, votesCount, keptVote, removedVotes}) => {
            console.log(`   ${name}: ${votesCount} votes, garde ID ${keptVote}, supprime ${removedVotes.join(', ')}`);
        });
        
        if (fixMode) {
            try {
                // Convertir cleanedVotes en format Firestore
                const cleanedVotesField = {};
                for (const [userId, voteField] of Object.entries(issue.cleanedVotes)) {
                    cleanedVotesField[userId] = voteField;
                }
                
                await updateDoc('predictions', issue.id, { votes: cleanedVotesField });
                console.log(`   ✅ Corrigé`);
                totalFixed++;
            } catch (error) {
                console.error(`   ❌ Erreur: ${error.message}`);
            }
        }
        console.log('');
    }
    
    if (fixMode) {
        console.log(`\n✅ ${totalFixed} prédiction(s) corrigée(s) !\n`);
    } else {
        console.log(`\n🔍 Mode dry-run - ${issues.length} prédiction(s) seraient corrigées\n`);
        console.log('Pour corriger, relancez avec --fix:');
        console.log(`  node fix-duplicate-user-votes.js --group=${currentGroup} --fix\n`);
    }
}

fixDuplicateUserVotes().catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
});





