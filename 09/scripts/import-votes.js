/**
 * Script d'import des votes/scrutins depuis NosDéputés.fr
 * API: https://www.nosdeputes.fr/api
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const NOSDEPUTES_API = 'https://www.nosdeputes.fr';

async function fetchJSON(url) {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${url}`);
    }
    return response.json();
}

async function getPoliticianByExternalId(externalId) {
    const { data } = await supabase
        .from('politicians')
        .select('id')
        .eq('external_id', externalId)
        .single();
    return data?.id;
}

async function importScrutins(limit = 50) {
    console.log('=== Import des scrutins depuis NosDéputés.fr ===\n');

    try {
        // Récupérer les scrutins récents
        const data = await fetchJSON(`${NOSDEPUTES_API}/scrutins/json`);
        const scrutins = data.scrutins.slice(0, limit);

        console.log(`${scrutins.length} scrutins à importer\n`);

        let votesImported = 0;
        let positionsImported = 0;

        for (const { scrutin } of scrutins) {
            try {
                // Préparer les données du scrutin
                const voteData = {
                    external_id: `nosdeputes_scrutin_${scrutin.numero}`,
                    title: scrutin.titre || `Scrutin n°${scrutin.numero}`,
                    description: scrutin.demandeurs || null,
                    vote_date: scrutin.date,
                    type: scrutin.type_scrutin || 'ordinaire',
                    result: scrutin.sort === 'adopté' ? 'adopté' : 'rejeté',
                    pour: parseInt(scrutin.pour) || 0,
                    contre: parseInt(scrutin.contre) || 0,
                    abstention: parseInt(scrutin.abstention) || 0,
                    source_url: `${NOSDEPUTES_API}/scrutin/${scrutin.numero}`
                };

                // Upsert le scrutin
                const { data: insertedVote, error: voteError } = await supabase
                    .from('votes')
                    .upsert(voteData, { onConflict: 'external_id' })
                    .select('id')
                    .single();

                if (voteError) {
                    console.error(`Erreur scrutin ${scrutin.numero}: ${voteError.message}`);
                    continue;
                }

                votesImported++;
                const voteId = insertedVote.id;

                // Récupérer les détails du scrutin pour les positions individuelles
                try {
                    const detailData = await fetchJSON(
                        `${NOSDEPUTES_API}/scrutin/${scrutin.numero}/json`
                    );

                    const positions = detailData.scrutin?.positions || {};

                    // Traiter chaque groupe de positions
                    for (const [position, groupes] of Object.entries(positions)) {
                        if (!groupes) continue;

                        for (const [groupe, deputes] of Object.entries(groupes)) {
                            if (!Array.isArray(deputes)) continue;

                            for (const dep of deputes) {
                                const externalId = `nosdeputes_${dep.id}`;
                                const politicianId = await getPoliticianByExternalId(externalId);

                                if (politicianId) {
                                    const positionData = {
                                        politician_id: politicianId,
                                        vote_id: voteId,
                                        position: position // pour, contre, abstention, absent
                                    };

                                    await supabase
                                        .from('politician_votes')
                                        .upsert(positionData, {
                                            onConflict: 'politician_id,vote_id'
                                        });

                                    positionsImported++;
                                }
                            }
                        }
                    }
                } catch (detailErr) {
                    console.warn(`Détails non disponibles pour scrutin ${scrutin.numero}`);
                }

                console.log(`Scrutin ${scrutin.numero}: ${scrutin.titre?.substring(0, 50)}...`);

            } catch (err) {
                console.error(`Erreur scrutin ${scrutin.numero}: ${err.message}`);
            }
        }

        console.log(`\n=== Import terminé ===`);
        console.log(`Scrutins importés: ${votesImported}`);
        console.log(`Positions importées: ${positionsImported}`);

    } catch (err) {
        console.error('Erreur fatale:', err);
        process.exit(1);
    }
}

// Exécuter (par défaut: 50 derniers scrutins)
const limit = parseInt(process.argv[2]) || 50;
importScrutins(limit);
