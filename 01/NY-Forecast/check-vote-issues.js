// Script pour détecter les problèmes de votes : utilisateurs avec plusieurs IDs, votes multiples, etc.
// Usage: node check-vote-issues.js [--group=nom]

const PROJECT_ID = 'cc-forecast-88580';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Récupérer les arguments
const args = process.argv.slice(2);
let currentGroup = null;

args.forEach(arg => {
    if (arg.startsWith('--group=')) {
        currentGroup = arg.split('=')[1];
    }
});

if (!currentGroup) {
    console.error('❌ Erreur: vous devez spécifier un groupe avec --group=nom');
    console.error('Usage: node check-vote-issues.js --group=kenopotes');
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

async function checkVoteIssues() {
    console.log(`\n🔍 Analyse des votes dans le groupe "${currentGroup}"...\n`);
    
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
    
    console.log(`Utilisateurs trouvés: ${Object.keys(usersMap).length} IDs pour ${Object.keys(namesToIds).length} noms uniques\n`);
    
    // Vérifier les utilisateurs avec plusieurs IDs
    const duplicateUsers = Object.entries(namesToIds).filter(([name, ids]) => ids.length > 1);
    if (duplicateUsers.length > 0) {
        console.log('⚠️  Utilisateurs avec plusieurs IDs:');
        duplicateUsers.forEach(([name, ids]) => {
            console.log(`   ${name}: ${ids.length} IDs (${ids.join(', ')})`);
        });
        console.log('');
    }
    
    // Charger les prédictions
    const predDocs = await listDocs('predictions');
    console.log(`Prédictions: ${predDocs.length}\n`);
    
    // Analyser les votes
    const votesByUserName = {}; // nom -> nombre de votes
    const votesByUserId = {}; // ID -> nombre de votes
    const predictionsWithIssues = [];
    
    predDocs.forEach(doc => {
        const docId = doc.name.split('/').pop();
        const text = doc.fields?.text?.stringValue || '';
        const votesField = doc.fields?.votes?.mapValue?.fields || {};
        
        const voteCounts = {}; // nom -> nombre de votes dans cette prédiction
        const userIdsByUserName = {}; // nom -> [IDs qui ont voté]
        
        for (const [userId, voteData] of Object.entries(votesField)) {
            const userName = usersMap[userId];
            
            // Compter par ID
            votesByUserId[userId] = (votesByUserId[userId] || 0) + 1;
            
            // Compter par nom (seulement si l'ID correspond à un utilisateur connu)
            if (userName) {
                votesByUserName[userName] = (votesByUserName[userName] || 0) + 1;
                voteCounts[userName] = (voteCounts[userName] || 0) + 1;
                if (!userIdsByUserName[userName]) {
                    userIdsByUserName[userName] = [];
                }
                userIdsByUserName[userName].push(userId);
            }
        }
        
        // Vérifier si un utilisateur a plusieurs votes (via différents IDs)
        const usersWithMultipleVotes = Object.entries(voteCounts).filter(([name, count]) => count > 1);
        if (usersWithMultipleVotes.length > 0) {
            predictionsWithIssues.push({
                id: docId,
                text,
                usersWithMultipleVotes: usersWithMultipleVotes.map(([name, count]) => ({
                    name,
                    count,
                    ids: userIdsByUserName[name] || []
                }))
            });
        }
    });
    
    if (predictionsWithIssues.length > 0) {
        console.log('⚠️  Prédictions avec utilisateurs ayant plusieurs votes (via différents IDs):\n');
        predictionsWithIssues.forEach(pred => {
            console.log(`📋 "${pred.text.substring(0, 60)}${pred.text.length > 60 ? '...' : ''}"`);
            console.log(`   ID: ${pred.id}`);
            pred.usersWithMultipleVotes.forEach(({name, count, ids}) => {
                console.log(`   ${name}: ${count} votes (IDs: ${ids.join(', ')})`);
            });
            console.log('');
        });
    }
    
    // Résumé
    console.log('\n📊 Résumé:');
    console.log(`   Total votes par ID: ${Object.values(votesByUserId).reduce((a, b) => a + b, 0)}`);
    console.log(`   Total votes par nom: ${Object.values(votesByUserName).reduce((a, b) => a + b, 0)}`);
    
    if (duplicateUsers.length > 0) {
        console.log(`\n⚠️  ${duplicateUsers.length} utilisateur(s) avec plusieurs IDs`);
        console.log('   Cela peut causer des votes comptés plusieurs fois si l\'utilisateur a voté avec différents IDs');
    }
    
    if (predictionsWithIssues.length > 0) {
        console.log(`\n⚠️  ${predictionsWithIssues.length} prédiction(s) avec des votes multiples pour le même utilisateur`);
    }
    
    if (duplicateUsers.length === 0 && predictionsWithIssues.length === 0) {
        console.log('\n✅ Aucun problème détecté avec les votes !');
    }
    
    console.log('');
}

checkVoteIssues().catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
});
