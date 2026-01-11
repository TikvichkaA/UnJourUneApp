/**
 * Script principal d'import de toutes les données
 * Exécute les imports dans l'ordre correct
 */

import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import 'dotenv/config';

// Vérifier la configuration
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('❌ Configuration manquante!');
    console.error('Copiez .env.example vers .env et renseignez vos identifiants Supabase.');
    process.exit(1);
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function runScript(scriptName) {
    return new Promise((resolve, reject) => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Exécution de ${scriptName}...`);
        console.log('='.repeat(60) + '\n');

        const child = spawn('node', [scriptName], {
            stdio: 'inherit',
            cwd: process.cwd()
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`${scriptName} a échoué avec le code ${code}`));
            }
        });

        child.on('error', reject);
    });
}

async function testConnection() {
    console.log('Test de connexion à Supabase...');

    const { data, error } = await supabase
        .from('parties')
        .select('count')
        .limit(1);

    if (error) {
        console.error('❌ Impossible de se connecter à Supabase:', error.message);
        console.error('\nVérifiez:');
        console.error('1. Que SUPABASE_URL est correct');
        console.error('2. Que SUPABASE_SERVICE_KEY est la clé "service_role"');
        console.error('3. Que le schéma SQL a été exécuté dans Supabase');
        process.exit(1);
    }

    console.log('✅ Connexion réussie!\n');
}

async function main() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     IMPORT DES DONNÉES - LIENS D\'INTÉRÊT POLITICIENS       ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Tester la connexion
    await testConnection();

    const startTime = Date.now();

    try {
        // 1. Importer les députés (doit être fait en premier)
        await runScript('import-deputes.js');

        // 2. Importer les commissions et les appartenances
        await runScript('import-commissions.js');

        // 3. Importer les votes récents
        await runScript('import-votes.js');

        const duration = Math.round((Date.now() - startTime) / 1000);

        console.log('\n' + '='.repeat(60));
        console.log('✅ IMPORT COMPLET!');
        console.log(`Durée totale: ${duration} secondes`);
        console.log('='.repeat(60));

        // Afficher les statistiques
        await showStats();

    } catch (err) {
        console.error('\n❌ ERREUR:', err.message);
        process.exit(1);
    }
}

async function showStats() {
    console.log('\n📊 Statistiques de la base de données:\n');

    const tables = [
        { name: 'politicians', label: 'Politiciens' },
        { name: 'commissions', label: 'Commissions' },
        { name: 'votes', label: 'Scrutins' },
        { name: 'politician_commissions', label: 'Appartenances commissions' },
        { name: 'politician_votes', label: 'Votes individuels' }
    ];

    for (const table of tables) {
        const { count } = await supabase
            .from(table.name)
            .select('*', { count: 'exact', head: true });

        console.log(`  ${table.label}: ${count || 0}`);
    }
}

main();
