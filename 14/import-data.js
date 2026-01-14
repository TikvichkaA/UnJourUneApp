/**
 * Import de données - Veille Municipales 2026
 * ============================================
 *
 * Usage:
 *   node import-data.js candidat "Nom Prénom" "Commune" "RN" "Détails"
 *   node import-data.js dinguerie "Auteur" "Citation" "type" "https://source.com" "Contexte"
 *   node import-data.js fichier data.json
 */

const { SUPABASE_CONFIG } = require('./config.js');
const fetch = require('node-fetch');

const HEADERS = {
    'apikey': SUPABASE_CONFIG.anonKey,
    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

// Récupérer les communes
async function getCommunes() {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/communes?select=id,nom`, {
        headers: HEADERS
    });
    return res.json();
}

// Trouver une commune par nom
async function findCommune(nom) {
    const communes = await getCommunes();
    const found = communes.find(c =>
        c.nom.toLowerCase().includes(nom.toLowerCase()) ||
        nom.toLowerCase().includes(c.nom.toLowerCase())
    );
    return found ? found.id : null;
}

// Ajouter un candidat
async function addCandidat(nom, commune, parti, detail) {
    const communeId = await findCommune(commune);

    const parts = nom.trim().split(' ');
    const prenom = parts.slice(0, -1).join(' ');
    const nomFamille = parts.slice(-1)[0];

    const data = {
        nom: nomFamille,
        prenom: prenom,
        commune_id: communeId,
        parti: parti || 'RN',
        detail: detail || ''
    };

    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/candidats`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(data)
    });

    if (res.ok) {
        const result = await res.json();
        console.log(`✓ Candidat ajouté: ${nom} (ID: ${result[0].id})`);
        return result[0];
    } else {
        console.error(`✗ Erreur:`, await res.text());
        return null;
    }
}

// Ajouter une dinguerie
async function addDinguerie(auteur, citation, type, source, contexte, commune) {
    const communeId = commune ? await findCommune(commune) : null;

    const data = {
        auteur: auteur,
        citation: citation,
        type: type || 'autre',
        source_url: source,
        contexte: contexte || '',
        commune_id: communeId
    };

    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/dingueries`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(data)
    });

    if (res.ok) {
        const result = await res.json();
        console.log(`✓ Dinguerie ajoutée: ${auteur} - "${citation.substring(0, 50)}..." (ID: ${result[0].id})`);
        return result[0];
    } else {
        console.error(`✗ Erreur:`, await res.text());
        return null;
    }
}

// Importer depuis un fichier JSON
async function importFromFile(filepath) {
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

    console.log(`\nImport de ${filepath}...\n`);

    if (data.candidats) {
        console.log(`--- Candidats (${data.candidats.length}) ---`);
        for (const c of data.candidats) {
            await addCandidat(c.nom, c.commune || '', c.parti || 'RN', c.detail || '');
        }
    }

    if (data.dingueries) {
        console.log(`\n--- Dingueries (${data.dingueries.length}) ---`);
        for (const d of data.dingueries) {
            await addDinguerie(
                d.auteur,
                d.citation,
                d.type || 'autre',
                d.source,
                d.contexte || '',
                d.commune || ''
            );
        }
    }

    console.log('\n✓ Import terminé!');
}

// Supprimer par ID
async function deleteById(table, id) {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${table}?id=eq.${id}`, {
        method: 'DELETE',
        headers: HEADERS
    });
    if (res.ok) {
        console.log(`✓ Supprimé: ${table} #${id}`);
    } else {
        console.error(`✗ Erreur suppression:`, await res.text());
    }
}

// Supprimer par condition
async function deleteWhere(table, field, condition, value) {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${table}?${field}=${condition}.${encodeURIComponent(value)}`, {
        method: 'DELETE',
        headers: HEADERS
    });
    if (res.ok) {
        console.log(`✓ Supprimé de ${table} où ${field} ${condition} ${value}`);
    } else {
        console.error(`✗ Erreur:`, await res.text());
    }
}

// Nettoyer les données polluées
async function cleanData() {
    console.log('\n--- Nettoyage des données polluées ---\n');

    // Récupérer tous les candidats et filtrer côté JS
    const allCandidats = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/candidats?select=id,nom,prenom`,
        { headers: HEADERS }
    ).then(r => r.json());

    const invalidPatterns = ['Seine', 'exerce', 'arrivée', 'Test', 'enfin', 'galement', 'collaboratrice'];
    const invalidCandidats = allCandidats.filter(c =>
        invalidPatterns.some(p =>
            (c.nom && c.nom.includes(p)) ||
            (c.prenom && c.prenom.includes(p)) ||
            (c.nom && c.nom.length <= 2)
        )
    );

    for (const c of invalidCandidats) {
        console.log(`  Suppression candidat: ${c.prenom} ${c.nom} (ID: ${c.id})`);
        await deleteById('candidats', c.id);
    }

    // Supprimer les dingueries "Inconnu"
    const allDingueries = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/dingueries?select=id,auteur`,
        { headers: HEADERS }
    ).then(r => r.json());

    const invalidDingueries = allDingueries.filter(d => d.auteur === 'Inconnu');

    for (const d of invalidDingueries) {
        console.log(`  Suppression dinguerie: Inconnu (ID: ${d.id})`);
        await deleteById('dingueries', d.id);
    }

    console.log('\n✓ Nettoyage terminé!');
}

// Lister les données actuelles
async function listData() {
    console.log('\n=== COMMUNES À RISQUE ===\n');
    const communes = await getCommunes();
    communes.forEach(c => console.log(`  [${c.id}] ${c.nom}`));

    console.log('\n=== CANDIDATS ===\n');
    const candidats = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/candidats?select=id,nom,prenom,parti,commune_id`, {
        headers: HEADERS
    }).then(r => r.json());
    candidats.forEach(c => console.log(`  [${c.id}] ${c.prenom} ${c.nom} (${c.parti})`));

    console.log('\n=== DINGUERIES ===\n');
    const dingueries = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/dingueries?select=id,auteur,type&limit=30`, {
        headers: HEADERS
    }).then(r => r.json());
    dingueries.forEach(d => console.log(`  [${d.id}] ${d.auteur} - ${d.type}`));
}

// Main
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    console.log('='.repeat(50));
    console.log('IMPORT - Veille Municipales 2026');
    console.log('='.repeat(50));

    switch (command) {
        case 'candidat':
            await addCandidat(args[1], args[2] || '', args[3] || 'RN', args[4] || '');
            break;

        case 'dinguerie':
            await addDinguerie(args[1], args[2], args[3] || 'autre', args[4], args[5] || '', args[6] || '');
            break;

        case 'fichier':
        case 'file':
            await importFromFile(args[1]);
            break;

        case 'list':
        case 'liste':
            await listData();
            break;

        case 'clean':
        case 'nettoyer':
            await cleanData();
            break;

        case 'delete':
        case 'supprimer':
            await deleteById(args[1], args[2]);
            break;

        default:
            console.log(`
Usage:
  node import-data.js candidat "Nom Prénom" "Commune" "Parti" "Détails"
  node import-data.js dinguerie "Auteur" "Citation" "type" "https://source" "Contexte"
  node import-data.js fichier data.json
  node import-data.js list
  node import-data.js clean              # Nettoyer les données polluées
  node import-data.js delete candidats 15   # Supprimer par ID

Types de dingueries: racisme, islamophobie, homophobie, sexisme, antisemitisme, complotisme, autre

Exemple fichier JSON:
{
  "candidats": [
    { "nom": "Jean Dupont", "commune": "Toulon", "parti": "RN", "detail": "Député" }
  ],
  "dingueries": [
    { "auteur": "Jean Dupont", "citation": "Propos raciste", "type": "racisme", "source": "https://...", "contexte": "Débat TV" }
  ]
}
            `);
    }
}

main().catch(console.error);
