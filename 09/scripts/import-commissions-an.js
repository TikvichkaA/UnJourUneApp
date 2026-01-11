/**
 * Script d'import des commissions depuis l'Assemblée Nationale
 * Utilise les données des députés qui contiennent leurs mandats
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { createWriteStream, createReadStream, existsSync, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import { Extract } from 'unzipper';
import { readdir, readFile, rm } from 'fs/promises';
import { join } from 'path';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const ORGANES_URL = 'https://data.assemblee-nationale.fr/static/openData/repository/17/amo/organes/AMO20_organes.json.zip';
const DEPUTES_URL = 'https://data.assemblee-nationale.fr/static/openData/repository/17/amo/deputes_actifs_mandats_actifs_organes/AMO10_deputes_actifs_mandats_actifs_organes.json.zip';

// Cache des politiciens
const politicianCache = new Map();

// Cache des commissions
const commissionCache = new Map();

async function loadPoliticianCache() {
    console.log('Chargement des politiciens...');

    const { data, error } = await supabase
        .from('politicians')
        .select('id, external_id');

    if (error) {
        console.error('Erreur:', error.message);
        return;
    }

    for (const pol of data) {
        if (pol.external_id?.startsWith('an_')) {
            const anId = pol.external_id.replace('an_', '');
            politicianCache.set(anId, pol.id);
        }
    }

    console.log(`${politicianCache.size} politiciens avec ID AN chargés`);
}

async function downloadAndExtract(url, zipFile, tempDir) {
    console.log(`Téléchargement de ${url}...`);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const fileStream = createWriteStream(zipFile);
    await pipeline(response.body, fileStream);

    console.log('Extraction...');
    if (!existsSync(tempDir)) {
        mkdirSync(tempDir, { recursive: true });
    }

    await new Promise((resolve, reject) => {
        createReadStream(zipFile)
            .pipe(Extract({ path: tempDir }))
            .on('close', resolve)
            .on('error', reject);
    });

    console.log('Extraction terminée.');
}

async function importCommissionsFromDeputes() {
    console.log('\nImport des commissions depuis les mandats des députés...');

    const zipFile = './temp_deputes_an.zip';
    const tempDir = './temp_deputes_an';

    // Vérifier si déjà extrait
    if (!existsSync(join(tempDir, 'json'))) {
        await downloadAndExtract(DEPUTES_URL, zipFile, tempDir);
    }

    const jsonDir = join(tempDir, 'json', 'acteur');
    if (!existsSync(jsonDir)) {
        console.log('Répertoire acteurs non trouvé');
        return;
    }

    const files = await readdir(jsonDir);
    const commissionsFound = new Map(); // Pour dédupliquer

    // Première passe : extraire toutes les commissions uniques
    for (const file of files) {
        if (!file.endsWith('.json')) continue;

        try {
            const content = await readFile(join(jsonDir, file), 'utf-8');
            const data = JSON.parse(content);
            const acteur = data.acteur;

            if (!acteur?.mandats?.mandat) continue;

            const mandats = Array.isArray(acteur.mandats.mandat)
                ? acteur.mandats.mandat
                : [acteur.mandats.mandat];

            for (const mandat of mandats) {
                const typeOrgane = mandat.typeOrgane;

                if (!['COMPER', 'GE', 'COMSPAM', 'CNPS'].includes(typeOrgane)) continue;

                const organeRef = mandat.organes?.organeRef;
                if (!organeRef || commissionsFound.has(organeRef)) continue;

                // Essayer de récupérer le nom de la commission depuis l'organe
                // On utilisera un nom générique basé sur le type pour l'instant
                commissionsFound.set(organeRef, {
                    uid: organeRef,
                    type: typeOrgane
                });
            }
        } catch (e) {}
    }

    console.log(`${commissionsFound.size} commissions uniques trouvées`);

    // Créer les commissions
    const commissionNames = {
        'COMPER': 'Commission permanente',
        'GE': 'Commission d\'enquête',
        'COMSPAM': 'Commission spéciale',
        'CNPS': 'Commission nationale'
    };

    let imported = 0;

    for (const [uid, info] of commissionsFound) {
        const commissionType = info.type === 'GE' ? 'enquête' :
                               info.type === 'COMSPAM' ? 'spéciale' : 'permanente';

        const commissionData = {
            external_id: `an_${uid}`,
            name: `${commissionNames[info.type] || 'Commission'} (${uid})`,
            type: commissionType
        };

        const { data: inserted, error } = await supabase
            .from('commissions')
            .upsert(commissionData, { onConflict: 'external_id' })
            .select('id')
            .single();

        if (!error && inserted) {
            commissionCache.set(uid, inserted.id);
            imported++;
        }
    }

    console.log(`${imported} commissions importées`);
}

async function importMemberships() {
    console.log('\nImport des appartenances aux commissions...');

    const zipFile = './temp_deputes_an.zip';
    const tempDir = './temp_deputes_an';

    // Vérifier si déjà extrait
    if (!existsSync(join(tempDir, 'json'))) {
        await downloadAndExtract(DEPUTES_URL, zipFile, tempDir);
    }

    const jsonDir = join(tempDir, 'json', 'acteur');
    if (!existsSync(jsonDir)) {
        console.log('Répertoire acteurs non trouvé');
        return;
    }

    const files = await readdir(jsonDir);
    let imported = 0;

    for (const file of files) {
        if (!file.endsWith('.json')) continue;

        try {
            const content = await readFile(join(jsonDir, file), 'utf-8');
            const data = JSON.parse(content);
            const acteur = data.acteur;

            if (!acteur) continue;

            const acteurUid = acteur.uid?.['#text'] || acteur.uid;
            const politicianId = politicianCache.get(acteurUid);

            if (!politicianId) continue;

            // Parcourir les mandats
            const mandats = acteur.mandats?.mandat;
            if (!mandats) continue;

            const mandatList = Array.isArray(mandats) ? mandats : [mandats];

            for (const mandat of mandatList) {
                const typeOrgane = mandat.typeOrgane;

                // Commissions permanentes ou d'enquête
                if (!['COMPER', 'GE', 'COMSPAM', 'CNPS'].includes(typeOrgane)) continue;

                const organeRef = mandat.organes?.organeRef;
                if (!organeRef) continue;

                const commissionId = commissionCache.get(organeRef);
                if (!commissionId) continue;

                // Déterminer le rôle
                let role = 'membre';
                const qualite = mandat.infosQualite?.codeQualite?.toLowerCase() || '';

                if (qualite.includes('président') && !qualite.includes('vice')) {
                    role = 'président';
                } else if (qualite.includes('vice')) {
                    role = 'vice-président';
                } else if (qualite.includes('secrétaire')) {
                    role = 'secrétaire';
                }

                const { error } = await supabase
                    .from('politician_commissions')
                    .upsert({
                        politician_id: politicianId,
                        commission_id: commissionId,
                        role: role,
                        start_date: mandat.dateDebut || null,
                        end_date: mandat.dateFin || null
                    }, { onConflict: 'politician_id,commission_id' });

                if (!error) imported++;
            }

        } catch (e) {
            // Ignorer les erreurs
        }
    }

    console.log(`${imported} appartenances importées`);
}

async function main() {
    console.log('=== Import des commissions depuis l\'Assemblée Nationale ===\n');

    try {
        await loadPoliticianCache();
        await importCommissionsFromDeputes();
        await importMemberships();

        console.log('\n=== Import terminé ===');

    } catch (err) {
        console.error('Erreur:', err);
        process.exit(1);
    }
}

main();
