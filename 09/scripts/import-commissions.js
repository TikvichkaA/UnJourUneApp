/**
 * Script d'import des commissions depuis NosDéputés.fr
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

async function importCommissions() {
    console.log('=== Import des commissions depuis NosDéputés.fr ===\n');

    try {
        // Récupérer les organismes (commissions)
        const data = await fetchJSON(`${NOSDEPUTES_API}/organismes/commission/json`);
        const commissions = data.organismes || [];

        console.log(`${commissions.length} commissions trouvées\n`);

        let commissionsImported = 0;
        let membershipsImported = 0;

        for (const { organisme } of commissions) {
            try {
                // Déterminer le type de commission
                let type = 'permanente';
                const nameLower = organisme.nom.toLowerCase();
                if (nameLower.includes('enquête')) type = 'enquête';
                else if (nameLower.includes('spéciale')) type = 'spéciale';
                else if (nameLower.includes('mission')) type = 'mission';

                // Préparer les données
                const commissionData = {
                    external_id: `nosdeputes_org_${organisme.id}`,
                    name: organisme.nom,
                    short_name: organisme.acronyme || null,
                    description: organisme.type || null,
                    type: type
                };

                // Upsert la commission
                const { data: insertedCom, error: comError } = await supabase
                    .from('commissions')
                    .upsert(commissionData, { onConflict: 'external_id' })
                    .select('id')
                    .single();

                if (comError) {
                    console.error(`Erreur commission ${organisme.nom}: ${comError.message}`);
                    continue;
                }

                commissionsImported++;
                const commissionId = insertedCom.id;

                // Récupérer les membres de la commission
                try {
                    const membersData = await fetchJSON(
                        `${NOSDEPUTES_API}/organisme/${organisme.slug}/json`
                    );

                    const membres = membersData.organisme?.membres || [];

                    for (const membre of membres) {
                        const deputeId = membre.id;
                        const externalId = `nosdeputes_${deputeId}`;
                        const politicianId = await getPoliticianByExternalId(externalId);

                        if (politicianId) {
                            // Déterminer le rôle
                            let role = 'membre';
                            if (membre.fonction) {
                                const fonctionLower = membre.fonction.toLowerCase();
                                if (fonctionLower.includes('président')) role = 'président';
                                else if (fonctionLower.includes('vice')) role = 'vice-président';
                                else if (fonctionLower.includes('secrétaire')) role = 'secrétaire';
                            }

                            const membershipData = {
                                politician_id: politicianId,
                                commission_id: commissionId,
                                role: role,
                                start_date: membre.debut || null,
                                end_date: membre.fin || null
                            };

                            const { error: memberError } = await supabase
                                .from('politician_commissions')
                                .upsert(membershipData, {
                                    onConflict: 'politician_id,commission_id'
                                });

                            if (!memberError) {
                                membershipsImported++;
                            }
                        }
                    }

                    console.log(`Commission: ${organisme.nom} (${membres.length} membres)`);

                } catch (memberErr) {
                    console.warn(`Membres non disponibles pour ${organisme.nom}`);
                }

            } catch (err) {
                console.error(`Erreur commission: ${err.message}`);
            }
        }

        console.log(`\n=== Import terminé ===`);
        console.log(`Commissions importées: ${commissionsImported}`);
        console.log(`Membres importés: ${membershipsImported}`);

    } catch (err) {
        console.error('Erreur fatale:', err);
        process.exit(1);
    }
}

// Exécuter
importCommissions();
