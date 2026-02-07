/**
 * Import nouvelles communes et candidats
 * Usage: node import-nouvelles-communes.js
 */

const { SUPABASE_CONFIG } = require('./config.js');
const fs = require('fs');

let fetch;
try {
    fetch = require('node-fetch');
} catch (e) {
    console.log('npm install node-fetch@2');
    process.exit(1);
}

const HEADERS = {
    'apikey': SUPABASE_CONFIG.anonKey,
    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

async function getCommunesExistantes() {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/communes?select=id,nom`, {
        headers: HEADERS
    });
    const communes = await res.json();
    const map = {};
    communes.forEach(c => map[c.nom.toLowerCase()] = c.id);
    return map;
}

async function getCandidatsExistants() {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/candidats?select=nom,prenom`, {
        headers: HEADERS
    });
    const candidats = await res.json();
    const set = new Set();
    candidats.forEach(c => {
        set.add(`${c.prenom?.toLowerCase() || ''} ${c.nom?.toLowerCase() || ''}`.trim());
    });
    return set;
}

async function addCommune(commune) {
    const data = {
        nom: commune.nom,
        departement: commune.departement,
        code_dept: commune.code_dept,
        population: commune.population,
        score: commune.score,
        maire_actuel: commune.maire_actuel,
        detail: commune.detail
    };

    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/communes`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(data)
    });

    if (res.ok) {
        const [result] = await res.json();
        return result.id;
    }
    return null;
}

async function addCandidat(candidat, communeId) {
    const parts = candidat.nom.split(' ');
    const prenom = parts.slice(0, -1).join(' ');
    const nom = parts[parts.length - 1];

    const data = {
        nom: nom,
        prenom: prenom,
        commune_id: communeId,
        parti: candidat.parti,
        role: candidat.role || 'tete',
        detail: [candidat.detail, candidat.secteur ? `Secteur: ${candidat.secteur}` : null, `Source: ${candidat.source}`]
            .filter(Boolean).join('. ')
    };

    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/candidats`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(data)
    });

    return res.ok;
}

async function main() {
    console.log('='.repeat(50));
    console.log('IMPORT NOUVELLES COMMUNES & CANDIDATS');
    console.log('='.repeat(50));

    const data = JSON.parse(fs.readFileSync('nouvelles-communes-candidats.json', 'utf-8'));
    const communesExistantes = await getCommunesExistantes();
    const candidatsExistants = await getCandidatsExistants();

    let statsCommunes = { added: 0, existing: 0 };
    let statsCandidats = { added: 0, existing: 0, noCommune: 0 };

    // 1. Ajouter les nouvelles communes
    console.log('\n--- COMMUNES ---\n');

    for (const commune of data.communes) {
        if (communesExistantes[commune.nom.toLowerCase()]) {
            console.log(`  = ${commune.nom} (existe déjà)`);
            statsCommunes.existing++;
        } else {
            const id = await addCommune(commune);
            if (id) {
                console.log(`  + ${commune.nom} → id ${id}`);
                communesExistantes[commune.nom.toLowerCase()] = id;
                statsCommunes.added++;
            } else {
                console.log(`  ! ${commune.nom} (erreur)`);
            }
        }
    }

    console.log(`\nCommunes: +${statsCommunes.added} ajoutées, ${statsCommunes.existing} existantes`);

    // 2. Ajouter les candidats
    console.log('\n--- CANDIDATS ---\n');

    for (const candidat of data.candidats) {
        const nomComplet = candidat.nom.toLowerCase();

        if (candidatsExistants.has(nomComplet)) {
            console.log(`  = ${candidat.nom} (existe déjà)`);
            statsCandidats.existing++;
            continue;
        }

        const communeId = communesExistantes[candidat.commune.toLowerCase()];
        if (!communeId) {
            console.log(`  ? ${candidat.nom} - commune "${candidat.commune}" non trouvée`);
            statsCandidats.noCommune++;
            continue;
        }

        const ok = await addCandidat(candidat, communeId);
        if (ok) {
            console.log(`  + ${candidat.nom} (${candidat.parti}) → ${candidat.commune}`);
            statsCandidats.added++;
            candidatsExistants.add(nomComplet);
        } else {
            console.log(`  ! ${candidat.nom} (erreur)`);
        }
    }

    console.log(`\nCandidats: +${statsCandidats.added} ajoutés, ${statsCandidats.existing} existants, ${statsCandidats.noCommune} sans commune`);
    console.log('\n' + '='.repeat(50));
}

main().catch(console.error);
