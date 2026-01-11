/**
 * Script pour mettre à jour les external_id des politiciens avec les IDs AN
 * Crée la correspondance entre nosdeputes et l'Assemblée Nationale
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { createWriteStream, createReadStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { pipeline } from 'stream/promises';
import { Extract } from 'unzipper';
import { readdir, readFile, rm } from 'fs/promises';
import { join } from 'path';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const DEPUTES_URL = 'https://data.assemblee-nationale.fr/static/openData/repository/17/amo/deputes_actifs_mandats_actifs_organes/AMO10_deputes_actifs_mandats_actifs_organes.json.zip';
const ZIP_FILE = './temp_deputes_an.zip';
const TEMP_DIR = './temp_deputes_an';

async function downloadAndExtract() {
    console.log('Téléchargement de la liste des députés AN...');

    const response = await fetch(DEPUTES_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const fileStream = createWriteStream(ZIP_FILE);
    await pipeline(response.body, fileStream);

    console.log('Extraction...');
    if (!existsSync(TEMP_DIR)) {
        mkdirSync(TEMP_DIR, { recursive: true });
    }

    await new Promise((resolve, reject) => {
        createReadStream(ZIP_FILE)
            .pipe(Extract({ path: TEMP_DIR }))
            .on('close', resolve)
            .on('error', reject);
    });

    console.log('Extraction terminée.');
}

function normalizeString(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
        .replace(/[^a-z]/g, ''); // Garder seulement les lettres
}

async function updatePoliticianIds() {
    console.log('\nMise à jour des IDs AN...\n');

    const jsonDir = join(TEMP_DIR, 'json', 'acteur');
    if (!existsSync(jsonDir)) {
        console.error('Répertoire acteurs non trouvé');
        return;
    }

    // Charger tous les politiciens de la base
    const { data: politicians, error } = await supabase
        .from('politicians')
        .select('id, first_name, last_name, external_id');

    if (error) {
        console.error('Erreur chargement politiciens:', error.message);
        return;
    }

    console.log(`${politicians.length} politiciens en base`);

    // Créer un index par nom normalisé
    const polIndex = new Map();
    for (const pol of politicians) {
        const key = normalizeString(pol.first_name) + '_' + normalizeString(pol.last_name);
        polIndex.set(key, pol);
    }

    // Lire les fichiers acteurs AN
    const files = await readdir(jsonDir);
    console.log(`${files.length} acteurs AN trouvés\n`);

    let updated = 0;
    let notFound = 0;

    for (const file of files) {
        if (!file.endsWith('.json')) continue;

        try {
            const content = await readFile(join(jsonDir, file), 'utf-8');
            const data = JSON.parse(content);
            const acteur = data.acteur;

            if (!acteur) continue;

            const uid = acteur.uid?.['#text'] || acteur.uid;
            const prenom = acteur.etatCivil?.ident?.prenom;
            const nom = acteur.etatCivil?.ident?.nom;

            if (!uid || !prenom || !nom) continue;

            const key = normalizeString(prenom) + '_' + normalizeString(nom);
            const pol = polIndex.get(key);

            if (pol) {
                // Mettre à jour avec l'ID AN
                const newExternalId = `an_${uid}`;

                const { error: updateError } = await supabase
                    .from('politicians')
                    .update({ external_id: newExternalId })
                    .eq('id', pol.id);

                if (!updateError) {
                    updated++;
                    if (updated % 50 === 0) {
                        console.log(`${updated} politiciens mis à jour...`);
                    }
                }
            } else {
                notFound++;
            }
        } catch (e) {
            // Ignorer les erreurs de parsing
        }
    }

    console.log(`\n=== Mise à jour terminée ===`);
    console.log(`Mis à jour: ${updated}`);
    console.log(`Non trouvés: ${notFound}`);
}

async function cleanup() {
    try {
        unlinkSync(ZIP_FILE);
        await rm(TEMP_DIR, { recursive: true, force: true });
    } catch (e) {}
}

async function main() {
    console.log('=== Mise à jour des IDs AN pour les politiciens ===\n');

    try {
        await downloadAndExtract();
        await updatePoliticianIds();
        await cleanup();
    } catch (err) {
        console.error('Erreur:', err);
        process.exit(1);
    }
}

main();
