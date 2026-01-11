/**
 * Script pour mettre à jour les noms des commissions avec les vrais sujets
 * depuis les données de l'Assemblée Nationale
 */

import { createClient } from '@supabase/supabase-js';
import { existsSync } from 'fs';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Utiliser les données déjà extraites des députés
const ORGANES_DIR = './temp_deputes_an/json/organe';

async function updateCommissionNames() {
    console.log('=== Mise à jour des noms de commissions ===\n');

    try {
        if (!existsSync(ORGANES_DIR)) {
            console.log('Répertoire organes non trouvé. Lancez d\'abord import-commissions-an.js');
            return;
        }

        const files = await readdir(ORGANES_DIR);
        console.log(`${files.length} fichiers d'organes trouvés`);

        // Charger les commissions actuelles
        const { data: commissions, error } = await supabase
            .from('commissions')
            .select('id, external_id, name');

        if (error) {
            console.error('Erreur:', error.message);
            return;
        }

        console.log(`${commissions.length} commissions en base\n`);

        // Créer une map des IDs externes vers les commissions
        const commissionMap = new Map();
        for (const com of commissions) {
            if (com.external_id?.startsWith('an_')) {
                const anId = com.external_id.replace('an_', '');
                commissionMap.set(anId, com);
            }
        }

        let updated = 0;

        // Parcourir les fichiers organes
        for (const file of files) {
            if (!file.endsWith('.json')) continue;

            try {
                const content = await readFile(join(ORGANES_DIR, file), 'utf-8');
                const data = JSON.parse(content);
                const organe = data.organe;

                if (!organe) continue;

                const uid = organe.uid;
                const commission = commissionMap.get(uid);

                if (!commission) continue;

                // Extraire le vrai nom et le type
                const newName = organe.libelle;
                const shortName = organe.libelleAbrege || organe.libelleAbrev || null;
                const codeType = organe.codeType;

                // Déterminer le type de commission
                let commissionType = 'autre';
                if (codeType === 'COMPER') {
                    commissionType = 'permanente';
                } else if (codeType === 'GE') {
                    commissionType = 'enquête';
                } else if (codeType === 'COMSPAM') {
                    commissionType = 'spéciale';
                }

                if (newName) {
                    const { error: updateError } = await supabase
                        .from('commissions')
                        .update({
                            name: newName,
                            short_name: shortName,
                            type: commissionType
                        })
                        .eq('id', commission.id);

                    if (!updateError) {
                        console.log(`✓ [${commissionType}] ${newName.substring(0, 60)}...`);
                        updated++;
                    }
                }

            } catch (e) {
                // Ignorer les erreurs de parsing
            }
        }

        console.log(`\n=== ${updated} commissions mises à jour ===`);

    } catch (err) {
        console.error('Erreur:', err);
        process.exit(1);
    }
}

updateCommissionNames();
