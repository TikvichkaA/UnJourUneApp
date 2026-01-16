/**
 * Import JSON complet (communes + candidats)
 * Usage: node import-json.js <fichier.json>
 */

const { SUPABASE_CONFIG } = require('./config.js');
const fetch = require('node-fetch');
const fs = require('fs');

const HEADERS = {
    'apikey': SUPABASE_CONFIG.anonKey,
    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

async function importJson(filepath) {
    console.log('='.repeat(60));
    console.log('IMPORT JSON - Veille Municipales 2026');
    console.log('='.repeat(60));

    const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

    // Récupérer les données existantes
    const existingCommunes = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/communes?select=id,nom`,
        { headers: HEADERS }
    ).then(r => r.json());

    const existingCandidats = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/candidats?select=id,nom,prenom`,
        { headers: HEADERS }
    ).then(r => r.json());

    const communeMap = {};
    existingCommunes.forEach(c => communeMap[c.nom.toLowerCase()] = c.id);

    const candidatSet = new Set(
        existingCandidats.map(c => `${c.prenom} ${c.nom}`.toLowerCase().trim())
    );

    console.log(`\nÉtat initial: ${existingCommunes.length} communes, ${existingCandidats.length} candidats\n`);

    // Phase 1: Communes
    if (data.communes && data.communes.length > 0) {
        console.log('--- COMMUNES ---\n');
        let added = 0, skipped = 0;

        for (const commune of data.communes) {
            if (communeMap[commune.nom.toLowerCase()]) {
                skipped++;
                continue;
            }

            const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/communes`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({ nom: commune.nom, departement: commune.departement })
            });

            if (res.ok) {
                const result = await res.json();
                communeMap[commune.nom.toLowerCase()] = result[0].id;
                console.log(`  + ${commune.nom}`);
                added++;
            }
        }

        console.log(`\n  Résultat: +${added} ajoutées, ${skipped} existantes\n`);
    }

    // Phase 2: Candidats
    if (data.candidats && data.candidats.length > 0) {
        console.log('--- CANDIDATS ---\n');
        let added = 0, skipped = 0, errors = 0;

        for (const c of data.candidats) {
            const key = c.nom.toLowerCase().trim();
            if (candidatSet.has(key)) {
                console.log(`  = ${c.nom} (existe)`);
                skipped++;
                continue;
            }

            const parts = c.nom.trim().split(' ');
            const prenom = parts.slice(0, -1).join(' ');
            const nom = parts.slice(-1)[0];

            const communeId = c.commune ? communeMap[c.commune.toLowerCase()] : null;

            const candidat = {
                nom,
                prenom,
                commune_id: communeId,
                parti: c.parti || 'RN',
                detail: c.detail || '',
                role: c.role || 'tete'
            };

            const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/candidats`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify(candidat)
            });

            if (res.ok) {
                console.log(`  + ${c.nom} -> ${c.commune || 'Sans commune'}`);
                added++;
            } else {
                const err = await res.text();
                if (!err.includes('duplicate')) {
                    console.log(`  ! ${c.nom}: erreur`);
                    errors++;
                } else {
                    skipped++;
                }
            }
        }

        console.log(`\n  Résultat: +${added} ajoutés, ${skipped} existants, ${errors} erreurs\n`);
    }

    // Stats finales
    const finalCommunes = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/communes?select=id`,
        { headers: HEADERS }
    ).then(r => r.json());

    const finalCandidats = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/candidats?select=id`,
        { headers: HEADERS }
    ).then(r => r.json());

    console.log('='.repeat(60));
    console.log(`TOTAL: ${finalCommunes.length} communes, ${finalCandidats.length} candidats`);
    console.log('='.repeat(60));
}

const filepath = process.argv[2];
if (!filepath) {
    console.log('Usage: node import-json.js <fichier.json>');
    process.exit(1);
}

importJson(filepath).catch(console.error);
