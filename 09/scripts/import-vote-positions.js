/**
 * Script d'import des positions de vote uniquement
 * Utilise les scrutins déjà en base et les fichiers JSON extraits
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

const SCRUTINS_URL = 'https://data.assemblee-nationale.fr/static/openData/repository/17/loi/scrutins/Scrutins.json.zip';
const TEMP_DIR = './temp_scrutins';
const ZIP_FILE = './temp_scrutins.zip';

// Cache des politiciens
const politicianCache = new Map();

// Pré-charger tous les politiciens avec IDs AN
async function loadPoliticianCache() {
    console.log('Chargement du cache des politiciens...');

    const { data, error } = await supabase
        .from('politicians')
        .select('id, external_id')
        .like('external_id', 'an_%');

    if (error) {
        console.error('Erreur chargement:', error.message);
        return;
    }

    for (const pol of data) {
        // external_id est "an_PA841605", on veut indexer par "PA841605"
        const anId = pol.external_id.replace('an_', '');
        politicianCache.set(anId, pol.id);
    }

    console.log(`${politicianCache.size} politiciens avec ID AN chargés`);
}

async function downloadAndExtract() {
    if (existsSync(join(TEMP_DIR, 'json'))) {
        console.log('Fichiers déjà extraits, on continue...');
        return;
    }

    console.log('Téléchargement des scrutins...');
    const response = await fetch(SCRUTINS_URL);
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

async function processVotants(votants, voteId, position) {
    if (!votants) return 0;

    const list = Array.isArray(votants) ? votants : [votants];
    let count = 0;

    for (const votant of list) {
        if (!votant?.acteurRef) continue;

        const polId = politicianCache.get(votant.acteurRef);
        if (polId) {
            await supabase.from('politician_votes').upsert({
                politician_id: polId,
                vote_id: voteId,
                position: position
            }, { onConflict: 'politician_id,vote_id' });
            count++;
        }
    }

    return count;
}

async function importPositions() {
    console.log('\nImport des positions de vote...\n');

    // Charger les votes existants
    const { data: votes, error } = await supabase
        .from('votes')
        .select('id, external_id')
        .like('external_id', 'an_%');

    if (error) {
        console.error('Erreur chargement votes:', error.message);
        return;
    }

    console.log(`${votes.length} scrutins en base`);

    // Créer un index par external_id
    const voteIndex = new Map();
    for (const v of votes) {
        // external_id est "an_VTANR5L17V209"
        const uid = v.external_id.replace('an_', '');
        voteIndex.set(uid, v.id);
    }

    // Lire les fichiers JSON
    const jsonDir = join(TEMP_DIR, 'json');
    const files = await readdir(jsonDir);

    let totalPositions = 0;
    let processedFiles = 0;
    const limit = parseInt(process.argv[2]) || 200;

    for (const file of files.slice(0, limit)) {
        if (!file.endsWith('.json')) continue;

        try {
            const content = await readFile(join(jsonDir, file), 'utf-8');
            const data = JSON.parse(content);
            const scrutin = data.scrutin;

            if (!scrutin) continue;

            const uid = scrutin.uid;
            const voteId = voteIndex.get(uid);

            if (!voteId) {
                // Le scrutin n'est pas encore en base, on l'ajoute
                const voteData = {
                    external_id: `an_${uid}`,
                    title: (scrutin.titre || scrutin.objet?.libelle || `Scrutin n°${scrutin.numero}`).substring(0, 500),
                    vote_date: scrutin.dateScrutin,
                    type: scrutin.typeVote?.codeTypeVote || 'ordinaire',
                    result: scrutin.sort?.code || 'inconnu',
                    pour: parseInt(scrutin.syntheseVote?.decompte?.pour) || 0,
                    contre: parseInt(scrutin.syntheseVote?.decompte?.contre) || 0,
                    abstention: parseInt(scrutin.syntheseVote?.decompte?.abstentions) || 0
                };

                const { data: inserted, error: insertError } = await supabase
                    .from('votes')
                    .upsert(voteData, { onConflict: 'external_id' })
                    .select('id')
                    .single();

                if (insertError) continue;
                voteIndex.set(uid, inserted.id);
            }

            const currentVoteId = voteIndex.get(uid);

            // Traiter les groupes de votes
            const groupes = scrutin.ventilationVotes?.organe?.groupes?.groupe;
            if (!groupes || !Array.isArray(groupes)) continue;

            for (const groupe of groupes) {
                const decompte = groupe.vote?.decompteNominatif;
                if (!decompte) continue;

                totalPositions += await processVotants(decompte.pours?.votant, currentVoteId, 'pour');
                totalPositions += await processVotants(decompte.contres?.votant, currentVoteId, 'contre');
                totalPositions += await processVotants(decompte.abstentions?.votant, currentVoteId, 'abstention');
            }

            processedFiles++;
            if (processedFiles % 20 === 0) {
                console.log(`${processedFiles} scrutins traités, ${totalPositions} positions...`);
            }

        } catch (e) {
            // Ignorer les erreurs
        }
    }

    console.log(`\n=== Import terminé ===`);
    console.log(`Scrutins traités: ${processedFiles}`);
    console.log(`Positions de vote: ${totalPositions}`);
}

async function main() {
    console.log('=== Import des positions de vote ===\n');

    try {
        await loadPoliticianCache();
        await downloadAndExtract();
        await importPositions();
    } catch (err) {
        console.error('Erreur:', err);
        process.exit(1);
    }
}

main();
