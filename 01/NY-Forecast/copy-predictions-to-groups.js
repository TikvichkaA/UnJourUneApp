// Script pour copier les prédictions non-perso vers tous les groupes
// Usage: node copy-predictions-to-groups.js

const PROJECT_ID = 'cc-forecast-88580';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const TARGET_GROUPS = ['cc', 'kenopotes', 'famille', 'linkee'];

async function listDocs(collection, group = null) {
    const collPath = group ? `groups/${group}/${collection}` : collection;
    const response = await fetch(`${BASE_URL}/${collPath}`);
    const data = await response.json();
    return data.documents || [];
}

// Normaliser le texte pour la comparaison
function normalizeText(text) {
    return text.toLowerCase().trim();
}

async function copyPredictionsToGroups() {
    console.log('🔄 Récupération des prédictions globales...\n');
    
    // Récupérer toutes les prédictions globales
    const predictions = await listDocs('predictions');
    console.log(`Trouvé ${predictions.length} prédictions globales`);
    
    // Filtrer les prédictions non-perso
    const nonPersonalPredictions = predictions.filter(doc => {
        const category = doc.fields?.category?.stringValue || 'autre';
        return category !== 'perso';
    });
    
    console.log(`${nonPersonalPredictions.length} prédictions non-perso à copier\n`);
    
    // Copier vers chaque groupe
    for (const group of TARGET_GROUPS) {
        console.log(`📁 Copie vers le groupe "${group}"...`);
        
        // Récupérer les prédictions existantes du groupe pour éviter les doublons
        const existingDocs = await listDocs('predictions', group);
        const existingTexts = new Set(
            existingDocs.map(doc => normalizeText(doc.fields?.text?.stringValue || ''))
        );
        
        let copied = 0;
        let skipped = 0;
        
        for (const doc of nonPersonalPredictions) {
            const text = doc.fields?.text?.stringValue || '';
            const category = doc.fields?.category?.stringValue || 'autre';
            
            if (!text) continue;
            
            // Vérifier si une prédiction avec le même texte existe déjà
            const normalizedText = normalizeText(text);
            if (existingTexts.has(normalizedText)) {
                skipped++;
                console.log(`  ⏭️  [${category}] "${text.substring(0, 50)}..." (déjà présente, ignorée)`);
                continue;
            }
            
            const collPath = `groups/${group}/predictions`;
            
            try {
                await fetch(`${BASE_URL}/${collPath}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fields: doc.fields })
                });
                
                existingTexts.add(normalizedText); // Ajouter à la liste pour éviter les doublons dans cette session
                copied++;
                console.log(`  ✓ [${category}] ${text.substring(0, 50)}...`);
            } catch (error) {
                console.error(`  ✗ Erreur pour "${text.substring(0, 30)}...": ${error.message}`);
            }
        }
        
        console.log(`  ✅ Groupe "${group}" terminé (${copied} copiées, ${skipped} déjà présentes)\n`);
    }
    
    console.log('🎉 Copie terminée pour tous les groupes !');
    console.log('\nVérifiez avec:');
    TARGET_GROUPS.forEach(g => {
        console.log(`  node firebase-admin.js --group=${g} list`);
    });
}

copyPredictionsToGroups().catch(console.error);

