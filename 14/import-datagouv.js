/**
 * Import Data.Gouv.fr - Candidatures Municipales 2026
 * ====================================================
 * Importe les listes officielles depuis les données publiques
 *
 * Usage:
 *   node import-datagouv.js --check           # Vérifier si les données sont dispo
 *   node import-datagouv.js --download        # Télécharger le fichier
 *   node import-datagouv.js --import <file>   # Importer un CSV
 *   node import-datagouv.js --filter-ed       # Filtrer candidats ED seulement
 *   node import-datagouv.js --communes        # Importer pour communes existantes
 *
 * Calendrier:
 *   - Dépôt des candidatures: 26/02/2026 à 18h
 *   - Publication data.gouv: quelques jours après
 *   - 1er tour: 15/03/2026
 *   - 2nd tour: 22/03/2026
 */

const { SUPABASE_CONFIG } = require('./config.js');
const fs = require('fs');

let fetch;
try {
    fetch = require('node-fetch');
} catch (e) {
    console.log('Exécute: npm install node-fetch@2');
    process.exit(1);
}

const HEADERS = {
    'apikey': SUPABASE_CONFIG.anonKey,
    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

// ============================================
// CONFIGURATION DATA.GOUV.FR
// ============================================

// URL du dataset (à mettre à jour quand disponible)
const DATAGOUV_DATASET_URL = 'https://www.data.gouv.fr/fr/datasets/elections-municipales-2026-candidatures/';

// Nuances politiques ED à surveiller
const NUANCES_ED = [
    'LRN',  // Rassemblement National
    'LREC', // Reconquête
    'LUDR', // Union des droites (Ciotti)
    'LEXD', // Extrême droite
    'LDVD', // Divers droite (parfois allié ED)
];

// Nuances à exclure (gauche, centre, etc.)
const NUANCES_EXCLUES = [
    'LNUP', 'LSOC', 'LCOM', 'LECO', 'LDVG', // Gauche
    'LREM', 'LMDM', 'LHOR', // Centre
];

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function parseCSV(content, delimiter = ';') {
    const lines = content.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter).map(v => v.trim().replace(/"/g, ''));
        const row = {};
        headers.forEach((h, idx) => row[h] = values[idx] || '');
        rows.push(row);
    }

    return rows;
}

function normalizeNuance(nuance) {
    // Normalise les différentes écritures de nuances
    const n = (nuance || '').toUpperCase().trim();
    if (n.includes('RN') || n.includes('RASSEMBLEMENT')) return 'LRN';
    if (n.includes('REC') || n.includes('RECONQ')) return 'LREC';
    if (n.includes('UDR') || n.includes('CIOTTI')) return 'LUDR';
    if (n.includes('EXD') || n.includes('EXTR')) return 'LEXD';
    return n;
}

function isED(nuance) {
    const n = normalizeNuance(nuance);
    return NUANCES_ED.includes(n);
}

// ============================================
// VÉRIFICATION DISPONIBILITÉ
// ============================================

async function checkDataset() {
    console.log('\n=== VÉRIFICATION DATASET DATA.GOUV.FR ===\n');
    console.log(`URL attendue: ${DATAGOUV_DATASET_URL}\n`);

    try {
        // Chercher via l'API data.gouv.fr
        const searchUrl = 'https://www.data.gouv.fr/api/1/datasets/?q=municipales+2026+candidatures&page_size=5';
        const res = await fetch(searchUrl);
        const data = await res.json();

        if (data.data && data.data.length > 0) {
            console.log('Datasets trouvés:\n');
            for (const ds of data.data) {
                console.log(`  - ${ds.title}`);
                console.log(`    ID: ${ds.id}`);
                console.log(`    Dernière MAJ: ${ds.last_modified}`);
                console.log(`    URL: https://www.data.gouv.fr/fr/datasets/${ds.slug}/`);
                if (ds.resources && ds.resources.length > 0) {
                    console.log(`    Ressources:`);
                    for (const r of ds.resources.slice(0, 3)) {
                        console.log(`      • ${r.title} (${r.format})`);
                    }
                }
                console.log();
            }
        } else {
            console.log('Aucun dataset trouvé pour "municipales 2026 candidatures".');
            console.log('\nLes données seront disponibles après le dépôt des candidatures (26/02/2026).');
        }

        // Vérifier les données 2020 comme référence
        console.log('\n--- Référence: Municipales 2020 ---\n');
        const ref2020 = 'https://www.data.gouv.fr/api/1/datasets/elections-municipales-2020-candidatures/';
        const res2020 = await fetch(ref2020);
        if (res2020.ok) {
            const data2020 = await res2020.json();
            console.log(`Dataset 2020: ${data2020.title}`);
            console.log(`Ressources: ${data2020.resources?.length || 0}`);
            if (data2020.resources) {
                const csvRes = data2020.resources.find(r => r.format === 'csv');
                if (csvRes) {
                    console.log(`\nExemple CSV 2020:\n  ${csvRes.url}`);
                    console.log(`\nColonnes attendues pour 2026 (basé sur 2020):`);
                    console.log(`  - Code commune, Libellé commune`);
                    console.log(`  - Numéro tour, Numéro panneau`);
                    console.log(`  - N° candidat, Sexe, Nom, Prénom`);
                    console.log(`  - Nationalité, Candidat sortant`);
                    console.log(`  - Nuance liste`);
                }
            }
        }

    } catch (error) {
        console.error(`Erreur: ${error.message}`);
    }
}

// ============================================
// TÉLÉCHARGEMENT
// ============================================

async function downloadDataset() {
    console.log('\n=== TÉLÉCHARGEMENT DATASET ===\n');

    // Rechercher le dataset 2026
    const searchUrl = 'https://www.data.gouv.fr/api/1/datasets/?q=municipales+2026+candidatures&page_size=5';
    const res = await fetch(searchUrl);
    const data = await res.json();

    const ds = data.data?.find(d =>
        d.title.toLowerCase().includes('municipales') &&
        d.title.includes('2026') &&
        d.title.toLowerCase().includes('candidat')
    );

    if (!ds) {
        console.log('Dataset 2026 non encore disponible.');
        console.log('Réessayez après le 26/02/2026.\n');
        return null;
    }

    const csvRes = ds.resources?.find(r => r.format?.toLowerCase() === 'csv');
    if (!csvRes) {
        console.log('Fichier CSV non trouvé dans le dataset.');
        return null;
    }

    console.log(`Téléchargement: ${csvRes.title}`);
    console.log(`URL: ${csvRes.url}\n`);

    const csvResponse = await fetch(csvRes.url);
    const content = await csvResponse.text();

    const filename = `candidatures-municipales-2026-${new Date().toISOString().split('T')[0]}.csv`;
    fs.writeFileSync(filename, content);
    console.log(`Fichier sauvegardé: ${filename}`);
    console.log(`Taille: ${(content.length / 1024).toFixed(1)} Ko`);

    return filename;
}

// ============================================
// IMPORT EN BASE
// ============================================

async function getCommunes() {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/communes?select=id,nom,code_dept`, {
        headers: HEADERS
    });
    return await res.json();
}

async function getCommunesMap() {
    const communes = await getCommunes();
    const map = {};
    communes.forEach(c => {
        map[c.nom.toLowerCase()] = c.id;
    });
    return map;
}

async function getCommunesCodes() {
    // Pour matcher par code INSEE si disponible dans le CSV
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/communes?select=id,nom,code_insee`, {
        headers: HEADERS
    });
    const communes = await res.json();
    const map = {};
    communes.forEach(c => {
        if (c.code_insee) map[c.code_insee] = c.id;
    });
    return map;
}

async function importFromCSV(filepath, options = {}) {
    console.log(`\n=== IMPORT: ${filepath} ===\n`);

    if (!fs.existsSync(filepath)) {
        console.log('Fichier non trouvé.');
        return;
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    const rows = parseCSV(content);
    console.log(`Lignes trouvées: ${rows.length}`);

    if (rows.length === 0) {
        console.log('Fichier vide ou format invalide.');
        return;
    }

    // Afficher les colonnes
    console.log('Colonnes:', Object.keys(rows[0]).join(', '));

    // Récupérer les communes de notre base
    const communesMap = await getCommunesMap();
    const communesCodes = await getCommunesCodes();
    const nosCommunes = new Set(Object.keys(communesMap));

    // Filtrer selon options
    let filtered = rows;

    if (options.edOnly) {
        filtered = filtered.filter(r => {
            const nuance = r['Nuance liste'] || r['Nuance'] || r['nuance_liste'] || '';
            return isED(nuance);
        });
        console.log(`Après filtre ED: ${filtered.length} candidats`);
    }

    if (options.communesOnly) {
        filtered = filtered.filter(r => {
            const commune = (r['Libellé commune'] || r['commune'] || '').toLowerCase();
            const codeInsee = r['Code commune'] || r['code_commune'] || '';
            return communesMap[commune] || communesCodes[codeInsee];
        });
        console.log(`Après filtre communes existantes: ${filtered.length} candidats`);
    }

    // Grouper par liste
    const listes = {};
    for (const row of filtered) {
        const commune = row['Libellé commune'] || row['commune'] || '';
        const panneau = row['Numéro panneau'] || row['num_panneau'] || '';
        const key = `${commune}|${panneau}`;

        if (!listes[key]) {
            listes[key] = {
                commune,
                panneau,
                nuance: row['Nuance liste'] || row['nuance_liste'] || '',
                candidats: []
            };
        }

        listes[key].candidats.push({
            position: parseInt(row['N° candidat'] || row['num_candidat'] || '0'),
            nom: row['Nom'] || '',
            prenom: row['Prénom'] || row['Prenom'] || '',
            sexe: row['Sexe'] || '',
            sortant: (row['Candidat sortant'] || '').toLowerCase() === 'oui'
        });
    }

    console.log(`Listes trouvées: ${Object.keys(listes).length}\n`);

    // Préparer l'import
    let stats = { added: 0, skipped: 0, noCommune: 0 };

    for (const [key, liste] of Object.entries(listes)) {
        const communeId = communesMap[liste.commune.toLowerCase()];

        if (!communeId) {
            if (options.verbose) console.log(`  ? Commune non trouvée: ${liste.commune}`);
            stats.noCommune++;
            continue;
        }

        // Trier par position
        liste.candidats.sort((a, b) => a.position - b.position);

        // La tête de liste = position 1
        for (const c of liste.candidats) {
            const role = c.position === 1 ? 'tete' : 'colistier';
            const parti = normalizeNuance(liste.nuance).replace('L', ''); // LRN -> RN

            if (options.dryRun) {
                console.log(`  [DRY] ${c.prenom} ${c.nom} (${role}, ${parti}) → ${liste.commune}`);
                continue;
            }

            const data = {
                nom: c.nom,
                prenom: c.prenom,
                commune_id: communeId,
                parti: parti,
                role: role,
                detail: `Position ${c.position} sur liste. Source: data.gouv.fr`
            };

            const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/candidats`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify(data)
            });

            if (res.ok) {
                console.log(`  + ${c.prenom} ${c.nom} (${role}) → ${liste.commune}`);
                stats.added++;
            } else {
                const err = await res.text();
                if (err.includes('duplicate')) {
                    stats.skipped++;
                } else if (options.verbose) {
                    console.log(`  ! ${c.prenom} ${c.nom}: ${err.substring(0, 40)}`);
                }
            }
        }
    }

    console.log(`\n=== RÉSULTAT ===`);
    console.log(`Ajoutés: ${stats.added}`);
    console.log(`Existants: ${stats.skipped}`);
    console.log(`Communes non trouvées: ${stats.noCommune}`);

    return stats;
}

// ============================================
// MAIN
// ============================================

async function main() {
    const args = process.argv.slice(2);

    console.log('='.repeat(60));
    console.log('IMPORT DATA.GOUV.FR - Municipales 2026');
    console.log('='.repeat(60));

    if (args.length === 0 || args.includes('--help')) {
        console.log(`
Usage:
  node import-datagouv.js --check              # Vérifier disponibilité dataset
  node import-datagouv.js --download           # Télécharger le CSV officiel
  node import-datagouv.js --import <file.csv>  # Importer un fichier CSV
  node import-datagouv.js --import <file.csv> --filter-ed      # Filtrer ED seulement
  node import-datagouv.js --import <file.csv> --communes       # Nos communes seulement
  node import-datagouv.js --import <file.csv> --dry-run        # Simulation
  node import-datagouv.js --import <file.csv> --verbose        # Mode verbeux

Calendrier:
  - Dépôt candidatures: 26/02/2026 à 18h
  - Publication data.gouv: fin février / début mars 2026
  - 1er tour: 15/03/2026
  - 2nd tour: 22/03/2026

Nuances ED surveillées: ${NUANCES_ED.join(', ')}
        `);
        return;
    }

    if (args.includes('--check')) {
        await checkDataset();
    }

    if (args.includes('--download')) {
        await downloadDataset();
    }

    if (args.includes('--import')) {
        const idx = args.indexOf('--import');
        const file = args[idx + 1];

        if (!file || file.startsWith('--')) {
            console.log('Fichier CSV requis: --import <fichier.csv>');
            return;
        }

        const options = {
            edOnly: args.includes('--filter-ed'),
            communesOnly: args.includes('--communes'),
            dryRun: args.includes('--dry-run'),
            verbose: args.includes('--verbose')
        };

        await importFromCSV(file, options);
    }

    console.log('\n' + '='.repeat(60));
}

main().catch(console.error);
