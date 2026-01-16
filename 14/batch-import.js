/**
 * Batch Import - Veille Municipales 2026
 * ======================================
 * Import rapide de communes et candidats
 *
 * Usage:
 *   node batch-import.js              # Exécute l'import prédéfini
 *   node batch-import.js --dry-run    # Affiche sans importer
 */

const { SUPABASE_CONFIG } = require('./config.js');
const fetch = require('node-fetch');

const HEADERS = {
    'apikey': SUPABASE_CONFIG.anonKey,
    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

// ============================================
// DONNÉES À IMPORTER
// ============================================

// Nouvelles communes à ajouter
const NOUVELLES_COMMUNES = [
    // Grandes villes ciblées par le RN
    { nom: 'Marseille', departement: '13' },
    { nom: 'Lyon', departement: '69' },
    { nom: 'Lille', departement: '59' },
    { nom: 'Rouen', departement: '76' },
    { nom: 'Caen', departement: '14' },
    { nom: 'Paris', departement: '75' },

    // Seine-Saint-Denis
    { nom: 'Rosny-sous-Bois', departement: '93' },
    { nom: 'Stains', departement: '93' },
    { nom: 'Villemomble', departement: '93' },

    // Hérault
    { nom: 'Montpellier', departement: '34' },
    { nom: 'Frontignan', departement: '34' },
    { nom: 'Sète', departement: '34' },

    // Aude
    { nom: 'Carcassonne', departement: '11' },
    { nom: 'Castelnaudary', departement: '11' },
    { nom: 'Leucate', departement: '11' },
    { nom: 'Gruissan', departement: '11' },
    { nom: 'Bram', departement: '11' },

    // Pyrénées-Orientales
    { nom: 'Cabestany', departement: '66' },

    // Var (compléments)
    { nom: 'La Seyne-sur-Mer', departement: '83' },
    { nom: 'Draguignan', departement: '83' },
    { nom: 'Six-Fours-les-Plages', departement: '83' },
    { nom: 'Sanary-sur-Mer', departement: '83' },

    // Nord
    { nom: 'Dunkerque', departement: '59' },
    { nom: 'Valenciennes', departement: '59' },
    { nom: 'Roubaix', departement: '59' },
    { nom: 'Tourcoing', departement: '59' },

    // Petites communes Alpes-Maritimes (14 candidats RN)
    { nom: 'Conségudes', departement: '06' },
    { nom: 'Roquebrune-Cap-Martin', departement: '06' },
    { nom: 'Toudon', departement: '06' },
    { nom: 'Peymeinade', departement: '06' },
];

// Nouveaux candidats à ajouter
const NOUVEAUX_CANDIDATS = [
    // Grandes villes
    { nom: 'Matthieu Valet', commune: 'Lille', parti: 'RN', detail: 'Eurodéputé RN, objectif score à deux chiffres' },
    { nom: 'Grégoire Houdan', commune: 'Rouen', parti: 'RN', detail: 'Tête de liste RN-UDR, candidature officielle 28/11/2025' },
    { nom: 'Brice Desrettes', commune: 'Caen', parti: 'RN', detail: 'Candidat RN officiel' },
    { nom: 'Thierry Mariani', commune: 'Paris', parti: 'RN', detail: 'Eurodéputé RN, candidature annoncée 2023' },

    // Hérault
    { nom: 'Cédric Delapierre', commune: 'Frontignan', parti: 'RN', detail: 'Conseiller régional, soutenu par le RN' },

    // Aude - Christophe Barthès déjà en base (Carcassonne)

    // Alpes-Maritimes (compléments 14 candidats annoncés)
    { nom: 'Andréa Orabona', commune: 'Conségudes', parti: 'RN', detail: '25 ans, 1er adjoint actuel' },
    { nom: 'Guillaume Contesse', commune: 'Roquebrune-Cap-Martin', parti: 'RN', detail: '51 ans, promoteur immobilier' },
    { nom: 'Virginie Escalier', commune: 'Toudon', parti: 'RN', detail: '49 ans, conseillère régionale' },
    { nom: 'Brigitte Vidal', commune: 'Peymeinade', parti: 'RN', detail: 'Investie par le RN 06' },
];

// ============================================
// FONCTIONS
// ============================================

async function getExistingCommunes() {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/communes?select=id,nom`, {
        headers: HEADERS
    });
    return res.json();
}

async function getExistingCandidats() {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/candidats?select=id,nom,prenom`, {
        headers: HEADERS
    });
    return res.json();
}

async function addCommune(commune) {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/communes`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(commune)
    });
    if (res.ok) {
        const result = await res.json();
        return { success: true, id: result[0].id };
    }
    const err = await res.text();
    if (err.includes('duplicate')) {
        return { success: false, reason: 'exists' };
    }
    return { success: false, reason: err };
}

async function addCandidat(candidat, communeId) {
    const parts = candidat.nom.split(' ');
    const prenom = parts.slice(0, -1).join(' ');
    const nom = parts.slice(-1)[0];

    const data = {
        nom,
        prenom,
        commune_id: communeId,
        parti: candidat.parti || 'RN',
        detail: candidat.detail || '',
        role: candidat.role || 'tete'
    };

    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/candidats`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(data)
    });

    if (res.ok) {
        const result = await res.json();
        return { success: true, id: result[0].id };
    }
    const err = await res.text();
    if (err.includes('duplicate')) {
        return { success: false, reason: 'exists' };
    }
    return { success: false, reason: err };
}

async function main() {
    const dryRun = process.argv.includes('--dry-run');

    console.log('='.repeat(60));
    console.log('BATCH IMPORT - Veille Municipales 2026');
    console.log(dryRun ? '(MODE DRY-RUN - aucune modification)' : '');
    console.log('='.repeat(60));

    // Récupérer les données existantes
    const existingCommunes = await getExistingCommunes();
    const existingCandidats = await getExistingCandidats();

    const communeMap = {};
    existingCommunes.forEach(c => communeMap[c.nom.toLowerCase()] = c.id);

    const candidatSet = new Set(
        existingCandidats.map(c => `${c.prenom} ${c.nom}`.toLowerCase())
    );

    console.log(`\nÉtat actuel: ${existingCommunes.length} communes, ${existingCandidats.length} candidats\n`);

    // ========== PHASE 1: Communes ==========
    console.log('--- PHASE 1: COMMUNES ---\n');

    let communesAdded = 0;
    let communesSkipped = 0;

    for (const commune of NOUVELLES_COMMUNES) {
        if (communeMap[commune.nom.toLowerCase()]) {
            if (dryRun) console.log(`  = ${commune.nom} (existe)`);
            communesSkipped++;
            continue;
        }

        if (dryRun) {
            console.log(`  + ${commune.nom} (${commune.departement})`);
            communesAdded++;
        } else {
            const result = await addCommune(commune);
            if (result.success) {
                console.log(`  + ${commune.nom} (ID: ${result.id})`);
                communeMap[commune.nom.toLowerCase()] = result.id;
                communesAdded++;
            } else if (result.reason === 'exists') {
                console.log(`  = ${commune.nom} (existe)`);
                communesSkipped++;
            } else {
                console.log(`  ! ${commune.nom}: ${result.reason.substring(0, 50)}`);
            }
        }
    }

    console.log(`\n  Résultat: +${communesAdded} ajoutées, ${communesSkipped} existantes\n`);

    // Rafraîchir la map si pas dry-run
    if (!dryRun) {
        const updated = await getExistingCommunes();
        updated.forEach(c => communeMap[c.nom.toLowerCase()] = c.id);
    }

    // ========== PHASE 2: Candidats ==========
    console.log('--- PHASE 2: CANDIDATS ---\n');

    let candidatsAdded = 0;
    let candidatsSkipped = 0;
    let candidatsError = 0;

    for (const candidat of NOUVEAUX_CANDIDATS) {
        const candidatKey = candidat.nom.toLowerCase();

        if (candidatSet.has(candidatKey)) {
            if (dryRun) console.log(`  = ${candidat.nom} (existe)`);
            candidatsSkipped++;
            continue;
        }

        const communeId = communeMap[candidat.commune.toLowerCase()];
        if (!communeId && !dryRun) {
            console.log(`  ! ${candidat.nom}: commune ${candidat.commune} non trouvée`);
            candidatsError++;
            continue;
        }

        if (dryRun) {
            console.log(`  + ${candidat.nom} -> ${candidat.commune} (${candidat.parti})`);
            candidatsAdded++;
        } else {
            const result = await addCandidat(candidat, communeId);
            if (result.success) {
                console.log(`  + ${candidat.nom} -> ${candidat.commune} (ID: ${result.id})`);
                candidatsAdded++;
            } else if (result.reason === 'exists') {
                console.log(`  = ${candidat.nom} (existe)`);
                candidatsSkipped++;
            } else {
                console.log(`  ! ${candidat.nom}: ${result.reason.substring(0, 50)}`);
                candidatsError++;
            }
        }
    }

    console.log(`\n  Résultat: +${candidatsAdded} ajoutés, ${candidatsSkipped} existants, ${candidatsError} erreurs\n`);

    // ========== RÉSUMÉ ==========
    console.log('='.repeat(60));
    if (dryRun) {
        console.log('DRY-RUN terminé. Pour exécuter: node batch-import.js');
    } else {
        const finalCommunes = await getExistingCommunes();
        const finalCandidats = await getExistingCandidats();
        console.log(`TOTAL: ${finalCommunes.length} communes, ${finalCandidats.length} candidats`);
    }
    console.log('='.repeat(60));
}

main().catch(console.error);
