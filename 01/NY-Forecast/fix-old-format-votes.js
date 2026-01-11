// Script pour supprimer les votes avec des noms comme IDs (ancien format) et garder seulement les votes avec les vrais IDs
// Usage: node fix-old-format-votes.js --group=nom [--fix]

const PROJECT_ID = 'cc-forecast-88580';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const args = process.argv.slice(2);
let currentGroup = null;
let fixMode = false;

args.forEach(arg => {
    if (arg.startsWith('--group=')) {
        currentGroup = arg.split('=')[1];
    } else if (arg === '--fix') {
        fixMode = true;
    }
});

if (!currentGroup) {
    console.error('❌ Erreur: vous devez spécifier un groupe avec --group=nom');
    console.error('Usage: node fix-old-format-votes.js --group=kenopotes [--fix]');
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

async function fixOldFormatVotes() {
    console.log(`\n🔍 Recherche des votes avec ancien format (nom comme ID) dans le groupe "${currentGroup}"...\n`);
    
    // Charger les utilisateurs pour obtenir les vrais IDs
    const userDocs = await listDocs('users');
    const usersMap = {}; // ID -> nom
    const validIds = new Set(); // IDs Firestore valides
    
    userDocs.forEach(doc => {
        const id = doc.name.split('/').pop();
        const name = doc.fields?.name?.stringValue || '';
        if (name) {
            usersMap[id] = name;
            validIds.add(id);
        }
    });
    
    console.log(`Utilisateurs valides: ${validIds.size}\n`);
    
    // Charger les prédictions
    const predDocs = await listDocs('predictions');
    console.log(`Prédictions: ${predDocs.length}\n`);
    
    let totalFixed = 0;
    const issues = [];
    
    for (const doc of predDocs) {
        const docId = doc.name.split('/').pop();
        const text = doc.fields?.text?.stringValue || '';
        const votesField = doc.fields?.votes?.mapValue?.fields || {};
        
        // Séparer les votes valides (avec IDs Firestore) et invalides (avec noms)
        const validVotes = {};
        const invalidVotes = [];
        
        for (const [voteId, voteField] of Object.entries(votesField)) {
            if (validIds.has(voteId)) {
                // C'est un ID Firestore valide
                validVotes[voteId] = voteField;
            } else {
                // C'est probablement un nom comme ID (ancien format)
                invalidVotes.push({
                    voteId,
                    voteField,
                    userName: usersMap[voteId] || voteId
                });
            }
        }
        
        if (invalidVotes.length > 0) {
            issues.push({
                id: docId,
                text,
                invalidVotes,
                validVotes,
                validVotesCount: Object.keys(validVotes).length,
                invalidVotesCount: invalidVotes.length
            });
        }
    }
    
    if (issues.length === 0) {
        console.log('✅ Aucun vote avec ancien format trouvé !\n');
        return;
    }
    
    console.log(`⚠️  ${issues.length} prédiction(s) avec des votes en ancien format:\n`);
    
    for (const issue of issues) {
        console.log(`📋 "${issue.text.substring(0, 60)}${issue.text.length > 60 ? '...' : ''}"`);
        console.log(`   ID: ${issue.id}`);
        console.log(`   Votes valides: ${issue.validVotesCount}, votes invalides à supprimer: ${issue.invalidVotesCount}`);
        issue.invalidVotes.forEach(({voteId}) => {
            console.log(`     - ${voteId}`);
        });
        
        if (fixMode) {
            try {
                // Convertir validVotes en format Firestore pour la mise à jour
                await updateDoc('predictions', issue.id, { votes: issue.validVotes });
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
        console.log(`  node fix-old-format-votes.js --group=${currentGroup} --fix\n`);
    }
}

fixOldFormatVotes().catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
});

