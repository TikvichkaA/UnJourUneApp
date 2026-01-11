// Script pour inspecter en détail les votes d'une prédiction
// Usage: node inspect-votes.js --group=kenopotes [--text="texte de la prédiction"]

const PROJECT_ID = 'cc-forecast-88580';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const args = process.argv.slice(2);
let currentGroup = null;
let searchText = null;

args.forEach(arg => {
    if (arg.startsWith('--group=')) {
        currentGroup = arg.split('=')[1];
    } else if (arg.startsWith('--text=')) {
        searchText = arg.split('=')[1].toLowerCase();
    }
});

if (!currentGroup) {
    console.error('❌ Erreur: vous devez spécifier un groupe avec --group=nom');
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

async function inspectVotes() {
    console.log(`\n🔍 Inspection des votes dans le groupe "${currentGroup}"...\n`);
    
    // Charger les utilisateurs
    const userDocs = await listDocs('users');
    const usersMap = {}; // ID -> nom
    
    userDocs.forEach(doc => {
        const id = doc.name.split('/').pop();
        const name = doc.fields?.name?.stringValue || '';
        if (name) {
            usersMap[id] = name;
        }
    });
    
    // Charger les prédictions
    const predDocs = await listDocs('predictions');
    
    // Filtrer par texte si spécifié
    const filtered = searchText 
        ? predDocs.filter(doc => {
            const text = doc.fields?.text?.stringValue || '';
            return text.toLowerCase().includes(searchText);
        })
        : predDocs;
    
    console.log(`Prédictions à inspecter: ${filtered.length}\n`);
    
    for (const doc of filtered) {
        const docId = doc.name.split('/').pop();
        const text = doc.fields?.text?.stringValue || '';
        const votesField = doc.fields?.votes?.mapValue?.fields || {};
        
        console.log(`\n📋 "${text}"`);
        console.log(`   ID: ${docId}`);
        console.log(`   Nombre de votes (clés): ${Object.keys(votesField).length}`);
        
        const votesByUserName = {};
        const voteDetails = [];
        
        for (const [userId, voteField] of Object.entries(votesField)) {
            const userName = usersMap[userId] || `[ID inconnu: ${userId}]`;
            const voteData = parseFirestoreVote(voteField);
            
            voteDetails.push({
                userId,
                userName,
                vote: voteData?.vote,
                confidence: voteData?.confidence
            });
            
            if (usersMap[userId]) {
                if (!votesByUserName[userName]) {
                    votesByUserName[userName] = [];
                }
                votesByUserName[userName].push({ userId, voteData });
            }
        }
        
        console.log(`\n   Votes détaillés:`);
        voteDetails.forEach(({userId, userName, vote, confidence}) => {
            const voteStr = vote === true ? 'Oui' : vote === false ? 'Non' : '?';
            const confStr = confidence ? ` (${confidence}★)` : '';
            console.log(`     - ${userName} [${userId}]: ${voteStr}${confStr}`);
        });
        
        // Vérifier les doublons par nom
        const duplicates = Object.entries(votesByUserName).filter(([name, votes]) => votes.length > 1);
        if (duplicates.length > 0) {
            console.log(`\n   ⚠️  DOUBLONS DÉTECTÉS:`);
            duplicates.forEach(([name, votes]) => {
                console.log(`     ${name}: ${votes.length} votes`);
                votes.forEach(v => {
                    const voteStr = v.voteData?.vote === true ? 'Oui' : v.voteData?.vote === false ? 'Non' : '?';
                    const confStr = v.voteData?.confidence ? ` (${v.voteData.confidence}★)` : '';
                    console.log(`       - ID ${v.userId}: ${voteStr}${confStr}`);
                });
            });
        } else {
            console.log(`\n   ✅ Pas de doublons par nom d'utilisateur`);
        }
    }
    
    console.log('');
}

inspectVotes().catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
});





