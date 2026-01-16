/**
 * Veille Municipales 2026 - Système de surveillance des candidatures
 * ==================================================================
 *
 * Usage:
 *   node veille.js check              # Vérifier les nouvelles candidatures
 *   node veille.js sources            # Lister les sources surveillées
 *   node veille.js add-source <url>   # Ajouter une source à surveiller
 *   node veille.js parse <url>        # Parser une URL spécifique
 *   node veille.js import <fichier>   # Importer depuis un fichier JSON structuré
 *
 * Dépendances: npm install node-fetch@2 cheerio
 */

const { SUPABASE_CONFIG } = require('./config.js');
const fs = require('fs');
const path = require('path');

let fetch, cheerio;
try {
    fetch = require('node-fetch');
    cheerio = require('cheerio');
} catch (e) {
    console.log('Exécute: npm install node-fetch@2 cheerio');
    process.exit(1);
}

const HEADERS = {
    'apikey': SUPABASE_CONFIG.anonKey,
    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

// ============================================
// SOURCES DE VEILLE
// ============================================

const SOURCES_VEILLE = {
    // Presse nationale
    'france3_paca': {
        name: 'France 3 PACA - Municipales',
        url: 'https://france3-regions.franceinfo.fr/provence-alpes-cote-d-azur/elections/elections-municipales',
        type: 'rss_like',
        region: 'PACA'
    },
    'france3_hauts': {
        name: 'France 3 Hauts-de-France',
        url: 'https://france3-regions.franceinfo.fr/hauts-de-france/elections/elections-municipales',
        type: 'rss_like',
        region: 'Hauts-de-France'
    },
    'france3_occitanie': {
        name: 'France 3 Occitanie',
        url: 'https://france3-regions.franceinfo.fr/occitanie/elections/elections-municipales',
        type: 'rss_like',
        region: 'Occitanie'
    },

    // Sites RN officiels
    'rn_federations': {
        name: 'RN - Fédérations',
        url: 'https://rassemblementnational.fr/federations',
        type: 'federation_list'
    },

    // Presse locale
    'francebleu_var': {
        name: 'France Bleu Var',
        url: 'https://www.francebleu.fr/provence-alpes-cote-dazur/var-83/elections',
        type: 'local_press'
    },
    'francebleu_nord': {
        name: 'France Bleu Nord',
        url: 'https://www.francebleu.fr/hauts-de-france/pas-de-calais-62/elections',
        type: 'local_press'
    },
    'francebleu_herault': {
        name: 'France Bleu Hérault',
        url: 'https://www.francebleu.fr/occitanie/herault-34/elections',
        type: 'local_press'
    },

    // Agrégateurs
    'candidator': {
        name: 'Candidator.fr',
        url: 'https://www.candidator.fr/municipales2026/',
        type: 'aggregator'
    }
};

// Communes prioritaires à surveiller
const COMMUNES_PRIORITAIRES = [
    'Toulon', 'Perpignan', 'Hénin-Beaumont', 'Fréjus', 'Orange', 'Béziers',
    'Marignane', 'Calais', 'Lens', 'Vitrolles', 'Menton', 'Hyères',
    'Narbonne', 'Boulogne-sur-Mer', 'Carpentras', 'Montauban', 'Martigues',
    'Agde', 'Nice', 'Cannes', 'Antibes', 'Grasse', 'Cagnes-sur-Mer'
];

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

async function fetchPage(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
    } catch (error) {
        console.error(`  Erreur fetch ${url}: ${error.message}`);
        return null;
    }
}

// Récupérer les candidats existants
async function getCandidatsExistants() {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/candidats?select=id,nom,prenom`, {
        headers: HEADERS
    });
    return res.json();
}

// Récupérer les communes
async function getCommunes() {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/communes?select=id,nom`, {
        headers: HEADERS
    });
    return res.json();
}

// Trouver une commune par nom
async function findCommune(nom) {
    const communes = await getCommunes();
    const found = communes.find(c =>
        c.nom.toLowerCase().includes(nom.toLowerCase()) ||
        nom.toLowerCase().includes(c.nom.toLowerCase())
    );
    return found ? found.id : null;
}

// Vérifier si un candidat existe déjà
async function candidatExiste(nom, prenom) {
    const candidats = await getCandidatsExistants();
    return candidats.some(c =>
        c.nom.toLowerCase() === nom.toLowerCase() &&
        (!prenom || !c.prenom || c.prenom.toLowerCase() === prenom.toLowerCase())
    );
}

// Ajouter un candidat
async function addCandidat(data) {
    // Vérifier si existe déjà
    if (await candidatExiste(data.nom, data.prenom)) {
        console.log(`  = Existe déjà: ${data.prenom} ${data.nom}`);
        return null;
    }

    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/candidats`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(data)
    });

    if (res.ok) {
        const result = await res.json();
        console.log(`  + Ajouté: ${data.prenom} ${data.nom} (ID: ${result[0].id})`);
        return result[0];
    } else {
        const error = await res.text();
        if (!error.includes('duplicate')) {
            console.error(`  Erreur: ${error.substring(0, 100)}`);
        }
        return null;
    }
}

// ============================================
// PARSERS SPÉCIFIQUES PAR TYPE DE SOURCE
// ============================================

// Parser générique pour les articles de presse
function parseArticlePresse(html, commune) {
    const $ = cheerio.load(html);
    const candidats = [];

    // Patterns pour détecter les candidats
    const patterns = [
        // "X candidat RN à Y"
        /([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)\s*(?:,\s*)?(candidat|tête de liste|investi|soutenu)\s+(?:par\s+)?(?:le\s+)?(?:RN|Rassemblement national)/gi,
        // "le RN investit X"
        /(?:RN|Rassemblement national)\s+(?:investit|présente|soutient)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)/gi,
        // "X (RN)"
        /([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)\s*\(RN\)/gi
    ];

    const text = $('article, .article-content, main, .content').text();

    patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const fullName = match[1].trim();
            if (fullName.length > 5 && fullName.length < 60) {
                const parts = fullName.split(' ');
                candidats.push({
                    nom: parts.slice(-1)[0],
                    prenom: parts.slice(0, -1).join(' '),
                    commune: commune || null,
                    source: 'presse'
                });
            }
        }
    });

    return candidats;
}

// Parser pour les listes officielles (ex: site mairie, préfecture)
function parseListeOfficielle(html) {
    const $ = cheerio.load(html);
    const candidats = [];

    // Chercher les tableaux de candidats
    $('table tr, .candidat, .elu, li').each((i, el) => {
        const text = $(el).text();
        // Pattern: "Nom Prénom - RN" ou "Nom Prénom (RN)"
        const match = text.match(/([A-ZÀ-Ÿ][A-ZÀ-Ÿa-zà-ÿ\-\s]+)\s*[-–(]\s*(?:RN|Rassemblement)/i);
        if (match) {
            const parts = match[1].trim().split(/\s+/);
            if (parts.length >= 2) {
                candidats.push({
                    nom: parts.slice(-1)[0],
                    prenom: parts.slice(0, -1).join(' ')
                });
            }
        }
    });

    return candidats;
}

// ============================================
// COMMANDES PRINCIPALES
// ============================================

// Lister les sources
function listSources() {
    console.log('\n=== SOURCES DE VEILLE ===\n');

    Object.entries(SOURCES_VEILLE).forEach(([key, source]) => {
        console.log(`  [${key}]`);
        console.log(`    ${source.name}`);
        console.log(`    ${source.url}`);
        console.log(`    Type: ${source.type}`);
        if (source.region) console.log(`    Région: ${source.region}`);
        console.log('');
    });

    console.log('\n=== COMMUNES PRIORITAIRES ===\n');
    console.log(`  ${COMMUNES_PRIORITAIRES.join(', ')}`);
}

// Parser une URL spécifique
async function parseUrl(url, commune = null) {
    console.log(`\nParsing: ${url}`);

    const html = await fetchPage(url);
    if (!html) return [];

    const candidats = parseArticlePresse(html, commune);

    console.log(`  -> ${candidats.length} candidats potentiels trouvés`);
    candidats.forEach(c => {
        console.log(`     - ${c.prenom} ${c.nom}${c.commune ? ` (${c.commune})` : ''}`);
    });

    return candidats;
}

// Importer depuis un fichier JSON structuré
async function importFromJson(filepath) {
    console.log(`\nImport depuis ${filepath}...\n`);

    const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    let added = 0;

    if (data.candidats) {
        for (const c of data.candidats) {
            const communeId = c.commune ? await findCommune(c.commune) : null;

            const candidat = {
                nom: c.nom.split(' ').slice(-1)[0],
                prenom: c.nom.split(' ').slice(0, -1).join(' ') || c.prenom,
                commune_id: communeId,
                parti: c.parti || 'RN',
                detail: c.detail || '',
                role: c.role || 'tete'
            };

            const result = await addCandidat(candidat);
            if (result) added++;
        }
    }

    console.log(`\n✓ ${added} candidats ajoutés`);
}

// Vérifier les nouvelles candidatures
async function checkNouvelles() {
    console.log('\n=== VÉRIFICATION DES NOUVELLES CANDIDATURES ===\n');

    const candidatsActuels = await getCandidatsExistants();
    console.log(`Candidats actuels en base: ${candidatsActuels.length}\n`);

    // Pour chaque commune prioritaire, chercher des infos
    for (const commune of COMMUNES_PRIORITAIRES.slice(0, 5)) { // Limité pour le test
        console.log(`\n--- ${commune} ---`);

        // Construire une recherche
        const searchUrl = `https://www.google.com/search?q=candidat+RN+municipales+2026+${encodeURIComponent(commune)}`;
        console.log(`  Recherche: municipales 2026 ${commune} RN`);

        // Note: En production, utiliser une API de recherche ou scraper les sources directement
    }

    console.log('\n\nPour ajouter des candidats manuellement:');
    console.log('  node import-data.js candidat "Prénom Nom" "Commune" "RN" "Détails"');
    console.log('\nPour importer depuis un fichier JSON:');
    console.log('  node veille.js import candidats.json');
}

// Générer un template JSON pour import manuel
function generateTemplate() {
    const template = {
        "_comment": "Template pour import de candidats - Veille Municipales 2026",
        "_usage": "node veille.js import ce_fichier.json",
        "candidats": [
            {
                "nom": "Prénom Nom",
                "commune": "Ville",
                "parti": "RN",
                "role": "tete",
                "detail": "Député, conseiller municipal, etc."
            },
            {
                "nom": "Autre Candidat",
                "commune": "Autre Ville",
                "parti": "RN",
                "role": "colistier",
                "detail": "Adjoint, conseiller, etc."
            }
        ]
    };

    const filepath = path.join(__dirname, 'template-candidats.json');
    fs.writeFileSync(filepath, JSON.stringify(template, null, 2));
    console.log(`\n✓ Template généré: ${filepath}`);
    console.log('\nModifie ce fichier et importe-le avec:');
    console.log('  node veille.js import template-candidats.json');
}

// Charger la configuration des sources
function loadSourcesConfig() {
    const filepath = path.join(__dirname, 'sources-communes.json');
    if (fs.existsSync(filepath)) {
        return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    }
    return null;
}

// Afficher les URLs à surveiller pour une commune
function watchCommune(communeName) {
    const config = loadSourcesConfig();
    if (!config) {
        console.log('Fichier sources-communes.json non trouvé');
        return;
    }

    const commune = config.communes[communeName];
    if (!commune) {
        console.log(`Commune "${communeName}" non trouvée dans la configuration.`);
        console.log('\nCommunes disponibles:');
        Object.keys(config.communes).forEach(c => console.log(`  - ${c}`));
        return;
    }

    console.log(`\n=== SOURCES POUR ${communeName.toUpperCase()} ===\n`);

    console.log('Wikipedia:');
    console.log(`  ${commune.wikipedia}\n`);

    console.log('Presse locale:');
    commune.presse.forEach(url => console.log(`  ${url}`));

    console.log('\nCandidats déjà en base:');
    commune.candidats_connus.forEach(c => console.log(`  - ${c}`));

    console.log('\n--- Actions suggérées ---');
    console.log(`1. Ouvrir la page Wikipedia et chercher de nouveaux noms`);
    console.log(`2. Consulter la presse locale pour les annonces récentes`);
    console.log(`3. Si nouveaux candidats, créer un JSON et importer:\n`);
    console.log(`   node veille.js import nouveau.json`);
}

// Afficher toutes les sources à surveiller
function watchAll() {
    const config = loadSourcesConfig();
    if (!config) {
        console.log('Fichier sources-communes.json non trouvé');
        return;
    }

    console.log('\n=== TOUTES LES SOURCES À SURVEILLER ===\n');

    console.log('--- PRÉFECTURES (listes officielles après le 9 février) ---\n');
    Object.entries(config.prefectures).forEach(([dept, url]) => {
        console.log(`  ${dept}:`);
        console.log(`    ${url}\n`);
    });

    console.log('--- SOURCES NATIONALES ---\n');
    config.sources_nationales.forEach(s => {
        console.log(`  ${s.nom} (${s.type}):`);
        console.log(`    ${s.url}\n`);
    });

    console.log('--- COMMUNES PRIORITAIRES ---\n');
    Object.entries(config.communes).forEach(([nom, data]) => {
        console.log(`  ${nom}: ${data.candidats_connus.length} candidats connus`);
    });

    console.log('\nPour voir les détails d\'une commune:');
    console.log('  node veille.js watch <commune>');
}

// Afficher les stats actuelles
async function showStats() {
    console.log('\n=== STATISTIQUES BASE DE DONNÉES ===\n');

    const candidats = await getCandidatsExistants();
    const communes = await getCommunes();

    const dingueries = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/dingueries?select=id`,
        { headers: HEADERS }
    ).then(r => r.json());

    console.log(`  Communes à risque:  ${communes.length}`);
    console.log(`  Candidats:          ${candidats.length}`);
    console.log(`  Dingueries:         ${dingueries.length}`);

    // Stats par parti
    const candidatsFull = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/candidats?select=parti`,
        { headers: HEADERS }
    ).then(r => r.json());

    const partiStats = {};
    candidatsFull.forEach(c => {
        partiStats[c.parti] = (partiStats[c.parti] || 0) + 1;
    });

    console.log('\n  Par parti:');
    Object.entries(partiStats)
        .sort((a, b) => b[1] - a[1])
        .forEach(([parti, count]) => {
            console.log(`    ${parti}: ${count}`);
        });
}

// Synchroniser sources-communes.json avec la base de données
async function syncConfig() {
    console.log('\n=== SYNCHRONISATION CONFIG ↔ BASE ===\n');

    const config = loadSourcesConfig();
    if (!config) {
        console.log('Fichier sources-communes.json non trouvé');
        return;
    }

    // Récupérer tous les candidats avec leur commune
    const candidatsDB = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/candidats?select=id,nom,prenom,communes(nom)`,
        { headers: HEADERS }
    ).then(r => r.json());

    // Organiser par commune
    const candidatsParCommune = {};
    candidatsDB.forEach(c => {
        const communeNom = c.communes?.nom || 'Sans commune';
        if (!candidatsParCommune[communeNom]) {
            candidatsParCommune[communeNom] = [];
        }
        candidatsParCommune[communeNom].push(`${c.prenom} ${c.nom}`);
    });

    let modified = false;

    // Mettre à jour la config
    for (const [communeNom, communeData] of Object.entries(config.communes)) {
        const candidatsActuels = candidatsParCommune[communeNom] || [];
        const candidatsConfig = communeData.candidats_connus || [];

        // Trouver les différences
        const nouveaux = candidatsActuels.filter(c => !candidatsConfig.includes(c));
        const manquants = candidatsConfig.filter(c => !candidatsActuels.includes(c));

        if (nouveaux.length > 0 || manquants.length > 0) {
            console.log(`${communeNom}:`);
            if (nouveaux.length > 0) {
                console.log(`  + Nouveaux en BDD: ${nouveaux.join(', ')}`);
            }
            if (manquants.length > 0) {
                console.log(`  - Pas en BDD: ${manquants.join(', ')}`);
            }

            // Mettre à jour avec les candidats de la BDD
            config.communes[communeNom].candidats_connus = candidatsActuels;
            modified = true;
        }
    }

    if (modified) {
        config._updated = new Date().toISOString().split('T')[0];
        const filepath = path.join(__dirname, 'sources-communes.json');
        fs.writeFileSync(filepath, JSON.stringify(config, null, 2));
        console.log('\n✓ sources-communes.json mis à jour');
    } else {
        console.log('✓ Déjà synchronisé');
    }
}

// Comparer config avec base de données (sans modifier)
async function diffConfig() {
    console.log('\n=== DIFFÉRENCES CONFIG ↔ BASE ===\n');

    const config = loadSourcesConfig();
    if (!config) {
        console.log('Fichier sources-communes.json non trouvé');
        return;
    }

    // Récupérer tous les candidats avec leur commune
    const candidatsDB = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/candidats?select=id,nom,prenom,communes(nom)`,
        { headers: HEADERS }
    ).then(r => r.json());

    // Organiser par commune
    const candidatsParCommune = {};
    candidatsDB.forEach(c => {
        const communeNom = c.communes?.nom || 'Sans commune';
        if (!candidatsParCommune[communeNom]) {
            candidatsParCommune[communeNom] = [];
        }
        candidatsParCommune[communeNom].push(`${c.prenom} ${c.nom}`);
    });

    let hasChanges = false;

    for (const [communeNom, communeData] of Object.entries(config.communes)) {
        const candidatsActuels = candidatsParCommune[communeNom] || [];
        const candidatsConfig = communeData.candidats_connus || [];

        const nouveaux = candidatsActuels.filter(c => !candidatsConfig.includes(c));
        const manquants = candidatsConfig.filter(c => !candidatsActuels.includes(c));

        if (nouveaux.length > 0 || manquants.length > 0) {
            hasChanges = true;
            console.log(`${communeNom}:`);
            console.log(`  Config: ${candidatsConfig.length} | BDD: ${candidatsActuels.length}`);
            if (nouveaux.length > 0) {
                nouveaux.forEach(n => console.log(`    + ${n} (en BDD, pas config)`));
            }
            if (manquants.length > 0) {
                manquants.forEach(m => console.log(`    - ${m} (en config, pas BDD)`));
            }
            console.log('');
        }
    }

    // Communes en BDD mais pas dans config
    const communesConfig = Object.keys(config.communes);
    const communesBDD = Object.keys(candidatsParCommune).filter(c => c !== 'Sans commune');
    const communesNonSuivies = communesBDD.filter(c => !communesConfig.includes(c));

    if (communesNonSuivies.length > 0) {
        hasChanges = true;
        console.log('--- Communes en BDD non suivies dans config ---');
        communesNonSuivies.forEach(c => {
            console.log(`  ${c}: ${candidatsParCommune[c].length} candidats`);
        });
    }

    if (!hasChanges) {
        console.log('✓ Aucune différence détectée');
    } else {
        console.log('\nPour synchroniser: node veille.js sync');
    }
}

// Rapport détaillé par commune
async function reportCommune(communeName) {
    console.log(`\n=== RAPPORT ${communeName.toUpperCase()} ===\n`);

    const config = loadSourcesConfig();
    const communeConfig = config?.communes[communeName];

    // Récupérer la commune en BDD
    const communes = await getCommunes();
    const commune = communes.find(c => c.nom.toLowerCase() === communeName.toLowerCase());

    if (!commune) {
        console.log(`Commune "${communeName}" non trouvée en base de données`);
        return;
    }

    // Récupérer les candidats de cette commune
    const candidats = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/candidats?select=id,nom,prenom,parti,role,detail&commune_id=eq.${commune.id}`,
        { headers: HEADERS }
    ).then(r => r.json());

    // Récupérer les dingueries liées
    const dingueries = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/dingueries?select=id,auteur,type,citation&commune_id=eq.${commune.id}`,
        { headers: HEADERS }
    ).then(r => r.json());

    console.log(`Candidats (${candidats.length}):`);
    candidats.forEach(c => {
        const role = c.role === 'tete' ? '[TÊTE]' : c.role === 'colistier' ? '[colistier]' : '';
        console.log(`  ${role} ${c.prenom} ${c.nom} (${c.parti})`);
        if (c.detail) console.log(`      ${c.detail}`);
    });

    if (dingueries.length > 0) {
        console.log(`\nDingueries (${dingueries.length}):`);
        dingueries.forEach(d => {
            console.log(`  [${d.type}] ${d.auteur}:`);
            console.log(`    "${d.citation.substring(0, 80)}..."`);
        });
    }

    if (communeConfig) {
        console.log('\n--- Sources à surveiller ---');
        console.log(`Wikipedia: ${communeConfig.wikipedia}`);
        console.log('Presse:');
        communeConfig.presse.forEach(url => console.log(`  ${url}`));
    }
}

// ============================================
// MAIN
// ============================================

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    console.log('='.repeat(50));
    console.log('VEILLE - Municipales 2026');
    console.log('='.repeat(50));

    switch (command) {
        case 'sources':
            listSources();
            break;

        case 'parse':
            if (!args[1]) {
                console.log('Usage: node veille.js parse <url> [commune]');
                break;
            }
            await parseUrl(args[1], args[2]);
            break;

        case 'import':
            if (!args[1]) {
                console.log('Usage: node veille.js import <fichier.json>');
                break;
            }
            await importFromJson(args[1]);
            break;

        case 'check':
            await checkNouvelles();
            break;

        case 'template':
            generateTemplate();
            break;

        case 'stats':
            await showStats();
            break;

        case 'watch':
            if (args[1]) {
                watchCommune(args[1]);
            } else {
                watchAll();
            }
            break;

        case 'sync':
            await syncConfig();
            break;

        case 'diff':
            await diffConfig();
            break;

        case 'report':
            if (!args[1]) {
                console.log('Usage: node veille.js report <commune>');
                break;
            }
            await reportCommune(args[1]);
            break;

        default:
            console.log(`
Usage:
  node veille.js sources            # Lister les sources surveillées
  node veille.js stats              # Afficher les statistiques
  node veille.js watch              # Voir toutes les sources à surveiller
  node veille.js watch <commune>    # Sources pour une commune spécifique
  node veille.js report <commune>   # Rapport détaillé d'une commune
  node veille.js diff               # Comparer config avec base de données
  node veille.js sync               # Synchroniser config avec BDD
  node veille.js check              # Vérifier les nouvelles candidatures
  node veille.js parse <url>        # Parser une URL spécifique
  node veille.js import <fichier>   # Importer depuis un fichier JSON
  node veille.js template           # Générer un template JSON

Workflow recommandé:
  1. node veille.js watch          # Consulter les sources à surveiller
  2. Ouvrir les URLs manuellement (Wikipedia, presse locale, etc.)
  3. Créer un fichier JSON avec les nouveaux candidats trouvés
  4. node veille.js import nouveau.json
  5. node veille.js sync           # Mettre à jour la config

Exemple de fichier JSON:
{
  "candidats": [
    { "nom": "Jean Dupont", "commune": "Toulon", "parti": "RN", "detail": "Adjoint" },
    { "nom": "Marie Martin", "commune": "Lens", "parti": "RN", "role": "colistier" }
  ]
}
            `);
    }
}

main().catch(console.error);
