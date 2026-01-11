// Script pour détecter et supprimer les doublons de prédictions dans les groupes
// Usage: node remove-duplicates.js [--group=nom] [--dry-run]
// --dry-run: affiche les doublons sans les supprimer

const PROJECT_ID = 'cc-forecast-88580';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Récupérer les arguments
const args = process.argv.slice(2);
let currentGroup = null;
let dryRun = false;

args.forEach(arg => {
    if (arg.startsWith('--group=')) {
        currentGroup = arg.split('=')[1];
    } else if (arg === '--dry-run') {
        dryRun = true;
    }
});

if (!currentGroup) {
    console.error('❌ Erreur: vous devez spécifier un groupe avec --group=nom');
    console.error('Usage: node remove-duplicates.js --group=cc [--dry-run]');
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

async function deleteDoc(collection, docId) {
    const collPath = getCollectionPath(collection);
    const url = `${BASE_URL}/${collPath}/${docId}`;
    
    const response = await fetch(url, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${await response.text()}`);
    }
}

// Normaliser le texte pour la comparaison (minuscules, trim)
function normalizeText(text) {
    return text.toLowerCase().trim();
}

async function removeDuplicates() {
    console.log(`\n🔍 Recherche des doublons dans le groupe "${currentGroup}"...\n`);
    
    const docs = await listDocs('predictions');
    console.log(`Total: ${docs.length} prédictions\n`);
    
    // Grouper par texte normalisé
    const byText = {};
    
    docs.forEach(doc => {
        const id = doc.name.split('/').pop();
        const text = doc.fields?.text?.stringValue || '';
        const normalizedText = normalizeText(text);
        const category = doc.fields?.category?.stringValue || 'autre';
        const author = doc.fields?.author?.stringValue || '';
        const votes = doc.fields?.votes?.mapValue?.fields || {};
        const resolution = doc.fields?.resolution?.stringValue || null;
        const createdAt = doc.fields?.createdAt?.timestampValue || '';
        
        // Compter le nombre de votes
        const voteCount = Object.keys(votes).length;
        
        if (!byText[normalizedText]) {
            byText[normalizedText] = [];
        }
        
        byText[normalizedText].push({
            id,
            text,
            category,
            author,
            voteCount,
            resolution,
            createdAt,
            doc
        });
    });
    
    // Trouver les doublons (groupes avec plus d'un élément)
    const duplicates = Object.entries(byText)
        .filter(([text, items]) => items.length > 1)
        .map(([text, items]) => items);
    
    if (duplicates.length === 0) {
        console.log('✅ Aucun doublon trouvé !\n');
        return;
    }
    
    console.log(`⚠️  ${duplicates.length} groupe(s) de doublons trouvé(s)\n`);
    
    let totalToDelete = 0;
    
    for (const group of duplicates) {
        console.log(`\n📋 Doublons trouvés pour: "${group[0].text.substring(0, 60)}${group[0].text.length > 60 ? '...' : ''}"`);
        console.log(`   Catégorie: ${group[0].category}`);
        console.log(`   Nombre de copies: ${group.length}\n`);
        
        // Trier par priorité : on garde celle qui a le plus de votes,
        // puis la plus récente, puis celle avec une résolution
        group.sort((a, b) => {
            // Priorité 1: résolution
            if (a.resolution && !b.resolution) return -1;
            if (!a.resolution && b.resolution) return 1;
            
            // Priorité 2: nombre de votes
            if (a.voteCount !== b.voteCount) return b.voteCount - a.voteCount;
            
            // Priorité 3: date (plus récente en premier)
            if (a.createdAt && b.createdAt) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            
            return 0;
        });
        
        const toKeep = group[0];
        const toDelete = group.slice(1);
        
        console.log(`   ✅ À conserver: ${toKeep.id}`);
        console.log(`      Votes: ${toKeep.voteCount}, Résolution: ${toKeep.resolution || 'aucune'}, Auteur: ${toKeep.author}`);
        
        for (const dup of toDelete) {
            console.log(`   ❌ À supprimer: ${dup.id}`);
            console.log(`      Votes: ${dup.voteCount}, Résolution: ${dup.resolution || 'aucune'}, Auteur: ${dup.author}`);
            
            if (!dryRun) {
                try {
                    await deleteDoc('predictions', dup.id);
                    console.log(`      ✓ Supprimé`);
                    totalToDelete++;
                } catch (error) {
                    console.error(`      ✗ Erreur: ${error.message}`);
                }
            } else {
                totalToDelete++;
            }
        }
    }
    
    console.log(`\n${dryRun ? '🔍 Mode dry-run - ' : ''}${totalToDelete} doublon(s) ${dryRun ? 'seraient supprimés' : 'supprimé(s)'}`);
    
    if (dryRun) {
        console.log('\nPour supprimer réellement, relancez sans --dry-run:');
        console.log(`  node remove-duplicates.js --group=${currentGroup}`);
    } else {
        console.log(`\n✅ Nettoyage terminé pour le groupe "${currentGroup}" !\n`);
    }
}

removeDuplicates().catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
});





