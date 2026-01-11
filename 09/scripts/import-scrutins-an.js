/**
 * Script d'import des scrutins depuis data.assemblee-nationale.fr
 * Télécharge le ZIP des votes et importe dans Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { createWriteStream, createReadStream, unlinkSync, existsSync, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import { createUnzip } from 'zlib';
import { Extract } from 'unzipper';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const SCRUTINS_URL = 'https://data.assemblee-nationale.fr/static/openData/repository/17/loi/scrutins/Scrutins.json.zip';
const TEMP_DIR = './temp_scrutins';
const ZIP_FILE = './temp_scrutins.zip';

// Cache des politiciens pour éviter les requêtes répétées
const politicianCache = new Map();

async function downloadFile(url, dest) {
    console.log(`Téléchargement de ${url}...`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const fileStream = createWriteStream(dest);
    await pipeline(response.body, fileStream);
    console.log('Téléchargement terminé.');
}

async function extractZip(zipPath, destDir) {
    console.log('Extraction du ZIP...');
    if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
    }

    await new Promise((resolve, reject) => {
        createReadStream(zipPath)
            .pipe(Extract({ path: destDir }))
            .on('close', resolve)
            .on('error', reject);
    });
    console.log('Extraction terminée.');
}

async function getPoliticianIdByActeurRef(acteurRef) {
    // acteurRef est de la forme "PA794562"
    // external_id dans notre base est "nosdeputes_XXX" mais on peut chercher par le numéro

    if (politicianCache.has(acteurRef)) {
        return politicianCache.get(acteurRef);
    }

    // Chercher par l'ID dans external_id ou par correspondance
    // L'acteurRef de l'AN correspond à l'id_origine dans HATVP
    const numId = acteurRef.replace('PA', '');

    // Chercher dans notre base - on a importé les députés avec nosdeputes_XXX
    // Il faut créer une correspondance ou mettre à jour les external_id

    // Pour l'instant, on cherche par nom si possible via une table de mapping
    // Ou on stocke l'acteurRef comme clé secondaire

    const { data } = await supabase
        .from('politicians')
        .select('id')
        .or(`external_id.eq.an_${acteurRef},external_id.ilike.%${numId}%`)
        .limit(1)
        .single();

    const id = data?.id || null;
    politicianCache.set(acteurRef, id);
    return id;
}

async function updatePoliticianExternalIds() {
    console.log('Mise à jour des IDs AN pour les politiciens...');

    // Télécharger la liste des acteurs AN
    const response = await fetch('https://data.assemblee-nationale.fr/static/openData/repository/17/amo/deputes_actifs_mandats_actifs_organes_divises/AMO10_deputes_actifs_mandats_actifs_organes_divises.json.zip');

    if (!response.ok) {
        console.log('Impossible de télécharger la liste des acteurs AN');
        return;
    }

    const actorsZip = './temp_actors.zip';
    const actorsDir = './temp_actors';

    const fileStream = createWriteStream(actorsZip);
    await pipeline(response.body, fileStream);

    if (!existsSync(actorsDir)) {
        mkdirSync(actorsDir, { recursive: true });
    }

    await new Promise((resolve, reject) => {
        createReadStream(actorsZip)
            .pipe(Extract({ path: actorsDir }))
            .on('close', resolve)
            .on('error', reject);
    });

    // Lire les fichiers JSON des acteurs
    const jsonDir = join(actorsDir, 'json', 'acteur');
    if (!existsSync(jsonDir)) {
        console.log('Répertoire acteurs non trouvé');
        return;
    }

    const files = await readdir(jsonDir);
    let updated = 0;

    for (const file of files.slice(0, 700)) { // Limiter pour le test
        if (!file.endsWith('.json')) continue;

        try {
            const content = await readFile(join(jsonDir, file), 'utf-8');
            const data = JSON.parse(content);
            const acteur = data.acteur;

            if (!acteur) continue;

            const uid = acteur.uid?.['#text'] || acteur.uid;
            const civilite = acteur.etatCivil?.ident?.civ;
            const prenom = acteur.etatCivil?.ident?.prenom;
            const nom = acteur.etatCivil?.ident?.nom;

            if (!uid || !prenom || !nom) continue;

            // Mettre à jour le politicien correspondant
            const { error } = await supabase
                .from('politicians')
                .update({ external_id: `an_${uid}` })
                .eq('first_name', prenom)
                .eq('last_name', nom);

            if (!error) {
                updated++;
                politicianCache.set(uid, true); // Marquer comme trouvé
            }
        } catch (e) {
            // Ignorer les erreurs de parsing
        }
    }

    console.log(`${updated} politiciens mis à jour avec leurs IDs AN`);

    // Nettoyer
    try {
        unlinkSync(actorsZip);
    } catch (e) {}
}

async function importScrutin(scrutinData) {
    const scrutin = scrutinData.scrutin;
    if (!scrutin) return null;

    const uid = scrutin.uid;
    const numero = scrutin.numero;
    const dateScrutin = scrutin.dateScrutin;
    const titre = scrutin.titre || scrutin.objet?.libelle || `Scrutin n°${numero}`;
    const sort = scrutin.sort?.code || 'inconnu';
    const synthese = scrutin.syntheseVote;

    // Insérer le scrutin
    const voteData = {
        external_id: `an_${uid}`,
        title: titre.substring(0, 500),
        description: scrutin.demandeur?.texte || null,
        vote_date: dateScrutin,
        type: scrutin.typeVote?.codeTypeVote || 'ordinaire',
        result: sort,
        pour: parseInt(synthese?.decompte?.pour) || 0,
        contre: parseInt(synthese?.decompte?.contre) || 0,
        abstention: parseInt(synthese?.decompte?.abstentions) || 0,
        source_url: `https://www.assemblee-nationale.fr/dyn/17/scrutins/${uid}`
    };

    const { data: insertedVote, error: voteError } = await supabase
        .from('votes')
        .upsert(voteData, { onConflict: 'external_id' })
        .select('id')
        .single();

    if (voteError) {
        console.error(`Erreur scrutin ${numero}: ${voteError.message}`);
        return null;
    }

    return { voteId: insertedVote.id, scrutin };
}

async function importVotePositions(voteId, scrutin) {
    const groupes = scrutin.ventilationVotes?.organe?.groupes?.groupe;
    if (!groupes || !Array.isArray(groupes)) return 0;

    let imported = 0;

    for (const groupe of groupes) {
        const decompte = groupe.vote?.decompteNominatif;
        if (!decompte) continue;

        // Traiter les votes "pour"
        const pours = decompte.pours?.votant;
        if (pours) {
            const poursList = Array.isArray(pours) ? pours : [pours];
            for (const votant of poursList) {
                if (votant?.acteurRef) {
                    const polId = await getPoliticianIdByActeurRef(votant.acteurRef);
                    if (polId) {
                        await supabase.from('politician_votes').upsert({
                            politician_id: polId,
                            vote_id: voteId,
                            position: 'pour'
                        }, { onConflict: 'politician_id,vote_id' });
                        imported++;
                    }
                }
            }
        }

        // Traiter les votes "contre"
        const contres = decompte.contres?.votant;
        if (contres) {
            const contresList = Array.isArray(contres) ? contres : [contres];
            for (const votant of contresList) {
                if (votant?.acteurRef) {
                    const polId = await getPoliticianIdByActeurRef(votant.acteurRef);
                    if (polId) {
                        await supabase.from('politician_votes').upsert({
                            politician_id: polId,
                            vote_id: voteId,
                            position: 'contre'
                        }, { onConflict: 'politician_id,vote_id' });
                        imported++;
                    }
                }
            }
        }

        // Traiter les abstentions
        const abstentions = decompte.abstentions?.votant;
        if (abstentions) {
            const abstList = Array.isArray(abstentions) ? abstentions : [abstentions];
            for (const votant of abstList) {
                if (votant?.acteurRef) {
                    const polId = await getPoliticianIdByActeurRef(votant.acteurRef);
                    if (polId) {
                        await supabase.from('politician_votes').upsert({
                            politician_id: polId,
                            vote_id: voteId,
                            position: 'abstention'
                        }, { onConflict: 'politician_id,vote_id' });
                        imported++;
                    }
                }
            }
        }
    }

    return imported;
}

async function main() {
    console.log('=== Import des scrutins depuis l\'Assemblée Nationale ===\n');

    try {
        // 1. Télécharger et extraire le ZIP
        await downloadFile(SCRUTINS_URL, ZIP_FILE);
        await extractZip(ZIP_FILE, TEMP_DIR);

        // 2. Mettre à jour les IDs AN des politiciens
        await updatePoliticianExternalIds();

        // 3. Lire les fichiers JSON
        const jsonDir = join(TEMP_DIR, 'json');
        const files = await readdir(jsonDir);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        console.log(`\n${jsonFiles.length} scrutins à importer\n`);

        let scrutinsImported = 0;
        let positionsImported = 0;
        const limit = parseInt(process.argv[2]) || 100; // Limiter par défaut

        for (const file of jsonFiles.slice(0, limit)) {
            try {
                const content = await readFile(join(jsonDir, file), 'utf-8');
                const data = JSON.parse(content);

                const result = await importScrutin(data);
                if (result) {
                    scrutinsImported++;
                    const positions = await importVotePositions(result.voteId, result.scrutin);
                    positionsImported += positions;

                    if (scrutinsImported % 10 === 0) {
                        console.log(`${scrutinsImported} scrutins importés...`);
                    }
                }
            } catch (e) {
                console.error(`Erreur fichier ${file}: ${e.message}`);
            }
        }

        console.log(`\n=== Import terminé ===`);
        console.log(`Scrutins importés: ${scrutinsImported}`);
        console.log(`Positions de vote: ${positionsImported}`);

        // Nettoyage
        try {
            unlinkSync(ZIP_FILE);
        } catch (e) {}

    } catch (err) {
        console.error('Erreur fatale:', err);
        process.exit(1);
    }
}

main();
