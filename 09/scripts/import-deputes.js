/**
 * Script d'import des députés depuis NosDéputés.fr
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

// Mapping des groupes parlementaires vers les partis
const GROUPE_TO_PARTY = {
    'Renaissance': 'Renaissance',
    'RE': 'Renaissance',
    'La France insoumise - Nouveau Front Populaire': 'La France Insoumise',
    'LFI-NFP': 'La France Insoumise',
    'Rassemblement National': 'Rassemblement National',
    'RN': 'Rassemblement National',
    'Les Républicains': 'Les Républicains',
    'LR': 'Les Républicains',
    'Écologiste et Social': 'Europe Écologie Les Verts',
    'Socialistes et apparentés': 'Parti Socialiste',
    'SOC': 'Parti Socialiste',
    'Démocrate (MoDem et Indépendants)': 'MoDem',
    'DEM': 'MoDem',
    'Horizons et apparentés': 'Horizons',
    'HOR': 'Horizons',
    'Gauche Démocrate et Républicaine': 'Parti Communiste',
    'GDR': 'Parti Communiste',
    'Libertés, Indépendants, Outre-mer et Territoires': 'Libertés, Indépendants, Outre-mer et Territoires',
    'LIOT': 'Libertés, Indépendants, Outre-mer et Territoires'
};

async function fetchJSON(url) {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${url}`);
    }
    return response.json();
}

async function getPartyId(partyName) {
    if (!partyName) return null;

    const { data, error } = await supabase
        .from('parties')
        .select('id')
        .eq('name', partyName)
        .single();

    if (error || !data) {
        console.warn(`Parti non trouvé: ${partyName}`);
        return null;
    }
    return data.id;
}

async function importDeputes() {
    console.log('=== Import des députés depuis NosDéputés.fr ===\n');

    try {
        // Récupérer la liste des députés actifs
        const data = await fetchJSON(`${NOSDEPUTES_API}/deputes/json`);
        const deputes = data.deputes;

        console.log(`${deputes.length} députés trouvés\n`);

        let imported = 0;
        let errors = 0;

        for (const { depute } of deputes) {
            try {
                // Trouver le parti correspondant
                const partyName = GROUPE_TO_PARTY[depute.groupe_sigle] ||
                                  GROUPE_TO_PARTY[depute.parti_ratt_financier] ||
                                  null;

                const partyId = await getPartyId(partyName);

                // Construire l'URL de la photo
                const photoUrl = depute.slug
                    ? `${NOSDEPUTES_API}/depute/photo/${depute.slug}/100`
                    : null;

                // Préparer les données
                const politicianData = {
                    external_id: `nosdeputes_${depute.id}`,
                    first_name: depute.prenom,
                    last_name: depute.nom,
                    party_id: partyId,
                    role: `Député${depute.sexe === 'F' ? 'e' : ''} de ${depute.nom_circo} (${depute.num_circo})`,
                    photo_url: photoUrl,
                    twitter_handle: depute.twitter || null,
                    birth_date: depute.date_naissance || null,
                    profession: depute.profession || null,
                    legislature: 17,
                    is_active: true
                };

                // Upsert dans Supabase
                const { error } = await supabase
                    .from('politicians')
                    .upsert(politicianData, {
                        onConflict: 'external_id'
                    });

                if (error) {
                    console.error(`Erreur pour ${depute.nom}: ${error.message}`);
                    errors++;
                } else {
                    imported++;
                    if (imported % 50 === 0) {
                        console.log(`${imported} députés importés...`);
                    }
                }
            } catch (err) {
                console.error(`Erreur pour ${depute.nom}: ${err.message}`);
                errors++;
            }
        }

        console.log(`\n=== Import terminé ===`);
        console.log(`Importés: ${imported}`);
        console.log(`Erreurs: ${errors}`);

    } catch (err) {
        console.error('Erreur fatale:', err);
        process.exit(1);
    }
}

// Exécuter
importDeputes();
