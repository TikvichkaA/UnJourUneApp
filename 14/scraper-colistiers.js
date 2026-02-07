/**
 * Scraper Colistiers - Veille Municipales 2026
 * =============================================
 * Extraction étendue : têtes de liste + colistiers + équipes complètes
 *
 * Usage:
 *   node scraper-colistiers.js --all           # Scraper toutes les sources
 *   node scraper-colistiers.js --source <nom>  # Une source spécifique
 *   node scraper-colistiers.js --url <url>     # URL personnalisée
 *   node scraper-colistiers.js --import        # Importer en BDD
 *   node scraper-colistiers.js --datagouv      # Préparer import data.gouv
 *
 * Dépendances: npm install node-fetch@2 cheerio
 */

const { SUPABASE_CONFIG } = require('./config.js');
const fs = require('fs');

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
// SOURCES ENRICHIES - Avec colistiers
// ============================================

const SOURCES = {
    // Articles avec listes complètes
    marseille_rn: {
        url: 'https://www.francebleu.fr/provence-alpes-cote-d-azur/bouches-du-rhone-13/marseille/municipales-2026-a-marseille-le-rn-devoile-ses-tetes-de-listes-par-secteur-4904960',
        type: 'liste_secteurs',
        commune: 'Marseille',
        parti: 'RN'
    },
    nice_udr: {
        url: 'https://nicepresse.com/municipales-2026-a-nice-eric-ciotti-devoile-les-premiers-noms-de-sa-liste-et-lorganisation-de-son-equipe-de-campagne-face-a-christian-estrosi/',
        type: 'equipe',
        commune: 'Nice',
        parti: 'UDR'
    },
    lyon_rn_udr: {
        url: 'https://www.lyonpeople.com/actualites-lyon/actualites-politiques/lyon-qui-sont-les-candidats-de-lalliance-udr-rn-dans-les-arrondissements-de-lyon-2026-01-27.html',
        type: 'liste_arrondissements',
        commune: 'Lyon',
        parti: 'RN-UDR'
    },
    toulon_rn: {
        url: 'https://www.varmatin.com/vie-locale/municipales-2026-a-toulon-laure-lavalette-presente-ses-colistiers',
        type: 'equipe',
        commune: 'Toulon',
        parti: 'RN'
    },
    // France Bleu régionales
    nantes_rn: {
        url: 'https://www.francebleu.fr/infos/politique/municipales-a-nantes-le-rn-devoile-sa-tete-de-liste-2815467',
        type: 'article',
        commune: 'Nantes',
        parti: 'RN-UDR'
    },
    // Reconquête
    reconquete_pdf: {
        url: 'https://assets.ericzemmour.fr/document/Dossier+presse+municipales+2026.pdf',
        type: 'pdf',
        parti: 'Reconquete'
    },
    // Presse locale diverse
    france3_paca: {
        url: 'https://france3-regions.franceinfo.fr/provence-alpes-cote-d-azur/alpes-maritimes/elections-municipales-2026-le-rassemblement-national-presente-ses-14-candidats-dans-les-alpes-maritimes-3266135.html',
        type: 'liste',
        parti: 'RN'
    },
    bordeaux_reconquete: {
        url: 'https://www.cnews.fr/france/2026-01-28/municipales-2026-qui-sont-les-candidats-la-mairie-de-bordeaux-1765861',
        type: 'article',
        commune: 'Bordeaux',
        parti: 'multi'
    }
};

// ============================================
// PATTERNS ENRICHIS - Colistiers inclus
// ============================================

// Patterns pour têtes de liste
const TETE_PATTERNS = [
    /tête\s+de\s+liste\s*[:\-]?\s*([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)/gi,
    /([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)\s*,?\s*tête\s+de\s+liste/gi,
    /mènera?\s+la\s+liste\s*[:\-]?\s*([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)/gi,
    /chef\s+de\s+file\s*[:\-]?\s*([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)/gi,
];

// Patterns pour colistiers / équipiers
const COLISTIER_PATTERNS = [
    // "ses colistiers : Nom1, Nom2, Nom3"
    /(?:ses|les|parmi\s+les)\s+colistiers?\s*[:\-]?\s*((?:[A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+(?:\s*,\s*)?)+)/gi,
    // "colistier : Nom Prénom"
    /colistière?\s*[:\-]?\s*([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)/gi,
    // "Nom Prénom, colistier"
    /([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)\s*,?\s*colistière?/gi,
    // "Nom Prénom (adjoint)" ou "Nom Prénom, adjoint"
    /([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)\s*[,\(]\s*(?:1er\s+)?adjoint/gi,
    // "sur sa liste : Nom1, Nom2"
    /sur\s+(?:sa|la)\s+liste\s*[:\-]?\s*((?:[A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+(?:\s*,\s*)?)+)/gi,
    // "l'équipe de Nom comprend Nom1, Nom2"
    /(?:équipe|liste)\s+(?:de\s+)?[A-ZÀ-Ÿ][a-zà-ÿ\-]+\s+comprend\s+((?:[A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+(?:\s*,\s*)?)+)/gi,
    // Format tableau "N° - Nom Prénom - fonction"
    /\d+\s*[\-–]\s*([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)\s*[\-–]/gi,
    // Liste numérotée "1. Nom Prénom"
    /^\s*\d+[\.\)]\s*([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)/gim,
];

// Patterns pour secteurs/arrondissements
const SECTEUR_PATTERNS = [
    // "secteur 1 : Nom Prénom" ou "1er secteur : Nom"
    /(?:secteur|arrondissement)\s*(?:\d+[eè]?r?|[IVX]+)\s*[:\-]?\s*([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)/gi,
    // "1er et 7e arr. : Nom"
    /(\d+[eè]?r?\s*(?:et\s*\d+[eè]?r?)?\s*arr(?:ondissements?)?\.?)\s*[:\-]?\s*([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)/gi,
];

// Mots à exclure (faux positifs)
const EXCLUDE_WORDS = [
    'Rassemblement National', 'Marine Le', 'Jordan Bardella', 'Eric Ciotti',
    'Assemblée Nationale', 'Conseil Municipal', 'France Info', 'Nice Matin',
    'La Voix', 'France Bleu', 'Le Monde', 'Le Figaro', 'Ouest France',
    'Alpes Maritimes', 'Bouches Rhône', 'Hauts France', 'Provence Alpes',
    'Seine Saint', 'Pas Calais', 'Côte Azur', 'Eric Zemmour', 'Sarah Knafo'
];

// ============================================
// FONCTIONS DE SCRAPING
// ============================================

async function fetchPage(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'fr-FR,fr;q=0.9'
            },
            timeout: 15000
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
    } catch (error) {
        console.error(`Erreur fetch ${url}: ${error.message}`);
        return null;
    }
}

function isValidName(name) {
    if (!name || name.length < 4 || name.length > 60) return false;
    if (EXCLUDE_WORDS.some(w => name.toLowerCase().includes(w.toLowerCase()))) return false;
    if (name.match(/^\d/) || name.match(/^[a-z]/)) return false;
    // Doit avoir au moins 2 mots
    const parts = name.split(/\s+/).filter(p => p.length > 1);
    if (parts.length < 2) return false;
    return true;
}

function splitNames(text) {
    // Sépare une liste de noms "Nom1, Nom2 et Nom3"
    return text
        .split(/\s*(?:,|et|;)\s*/g)
        .map(n => n.trim())
        .filter(n => isValidName(n));
}

function extractCandidats(text, defaultCommune = null, defaultParti = 'RN') {
    const candidats = new Map();
    const cleanText = text.replace(/\s+/g, ' ');

    // 1. Extraire les têtes de liste
    for (const pattern of TETE_PATTERNS) {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(cleanText)) !== null) {
            const nom = match[1]?.trim();
            if (isValidName(nom)) {
                const key = nom.toLowerCase();
                if (!candidats.has(key)) {
                    candidats.set(key, {
                        nom_complet: nom,
                        role: 'tete',
                        commune: defaultCommune,
                        parti: defaultParti,
                        secteur: null
                    });
                }
            }
        }
    }

    // 2. Extraire les colistiers
    for (const pattern of COLISTIER_PATTERNS) {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(cleanText)) !== null) {
            const noms = splitNames(match[1] || '');
            for (const nom of noms) {
                const key = nom.toLowerCase();
                if (!candidats.has(key)) {
                    candidats.set(key, {
                        nom_complet: nom,
                        role: 'colistier',
                        commune: defaultCommune,
                        parti: defaultParti,
                        secteur: null
                    });
                }
            }
        }
    }

    // 3. Extraire les candidats par secteur/arrondissement
    for (const pattern of SECTEUR_PATTERNS) {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(cleanText)) !== null) {
            const secteur = match[1]?.trim();
            const nom = match[2]?.trim();
            if (isValidName(nom)) {
                const key = nom.toLowerCase();
                if (!candidats.has(key)) {
                    candidats.set(key, {
                        nom_complet: nom,
                        role: 'tete', // tête de liste de secteur
                        commune: defaultCommune,
                        parti: defaultParti,
                        secteur: secteur
                    });
                } else if (secteur) {
                    candidats.get(key).secteur = secteur;
                }
            }
        }
    }

    return Array.from(candidats.values());
}

async function scrapeSource(sourceName, sourceConfig) {
    console.log(`\n--- Scraping: ${sourceName} ---`);
    console.log(`URL: ${sourceConfig.url}`);

    if (sourceConfig.type === 'pdf') {
        console.log('(PDF non supporté en scraping direct - utiliser les données manuelles)');
        return { source: sourceName, candidats: [], error: 'PDF' };
    }

    const html = await fetchPage(sourceConfig.url);
    if (!html) {
        return { source: sourceName, candidats: [], error: 'fetch failed' };
    }

    const $ = cheerio.load(html);

    // Extraire le contenu principal
    const selectors = ['article', '.article-content', 'main', '.content', 'body'];
    let content = '';
    for (const sel of selectors) {
        const el = $(sel);
        if (el.length) {
            content = el.text();
            break;
        }
    }

    const candidats = extractCandidats(
        content,
        sourceConfig.commune || null,
        sourceConfig.parti || 'RN'
    );

    console.log(`Candidats trouvés: ${candidats.length}`);
    candidats.forEach(c => {
        console.log(`  ${c.role === 'tete' ? '★' : '○'} ${c.nom_complet}${c.secteur ? ` [${c.secteur}]` : ''}`);
    });

    return {
        source: sourceName,
        url: sourceConfig.url,
        commune: sourceConfig.commune,
        parti: sourceConfig.parti,
        candidats,
        scrapedAt: new Date().toISOString()
    };
}

// ============================================
// DONNÉES MANUELLES (sources PDF, vérifiées)
// ============================================

const CANDIDATS_MANUELS = [
    // Marseille - RN (France Bleu, janvier 2026)
    { nom: 'Clémence Parodi', commune: 'Marseille', parti: 'RN', role: 'tete', secteur: '1er & 7e arr.', source: 'France Bleu' },
    { nom: 'Marie Bermejo', commune: 'Marseille', parti: 'RN', role: 'tete', secteur: '2e & 3e arr.', source: 'France Bleu' },
    { nom: 'Thomas Battesti', commune: 'Marseille', parti: 'RN', role: 'tete', secteur: '4e & 5e arr.', source: 'France Bleu' },
    { nom: 'Jean-Baptiste Rivoallan', commune: 'Marseille', parti: 'RN', role: 'tete', secteur: '6e & 8e arr.', source: 'France Bleu' },
    { nom: 'Eléonore Bez', commune: 'Marseille', parti: 'RN', role: 'tete', secteur: '9e & 10e arr.', source: 'France Bleu' },
    { nom: 'Olivier Rioult', commune: 'Marseille', parti: 'RN', role: 'tete', secteur: '11e & 12e arr.', source: 'France Bleu' },
    { nom: 'Sandrine D\'Angio', commune: 'Marseille', parti: 'RN', role: 'tete', secteur: '13e & 14e arr.', source: 'France Bleu' },
    { nom: 'Thibault Charpentier', commune: 'Marseille', parti: 'RN', role: 'tete', secteur: '15e & 16e arr.', source: 'France Bleu' },
    { nom: 'Franck Allisio', commune: 'Marseille', parti: 'RN', role: 'tete', secteur: 'Mairie centrale', source: 'France Bleu' },

    // Nice - UDR (Nice Presse, 2025-2026)
    { nom: 'Eric Ciotti', commune: 'Nice', parti: 'UDR', role: 'tete', source: 'Nice Presse' },
    { nom: 'Bernard Chaix', commune: 'Nice', parti: 'UDR', role: 'colistier', detail: 'Directeur de campagne, député 3e circo', source: 'Nice Presse' },
    { nom: 'Jean-Pierre Rivère', commune: 'Nice', parti: 'UDR', role: 'colistier', detail: 'Ancien président OGC Nice, 1er adjoint', source: 'Nice Presse' },

    // Lyon - RN-UDR (Lyon People, janvier 2026)
    { nom: 'Alexandre Dupalais', commune: 'Lyon', parti: 'UDR', role: 'tete', detail: 'Avocat, 34 ans', source: 'Lyon People' },

    // Nantes - RN-UDR (France Bleu)
    { nom: 'Jean-Claude Hulot', commune: 'Nantes', parti: 'RN', role: 'tete', detail: 'Haut fonctionnaire, conseiller M. Le Pen', source: 'France Bleu' },

    // Toulon - RN (Var Matin)
    { nom: 'Laure Lavalette', commune: 'Toulon', parti: 'RN', role: 'tete', detail: 'Liste sans étiquette soutenue RN', source: 'Var Matin' },

    // Reconquête (dossier presse août 2025)
    { nom: 'Jean Messiha', commune: 'Évreux', parti: 'Reconquete', role: 'tete', detail: 'Porte-parole Reconquête, énarque', source: 'Reconquête' },
    { nom: 'Virginie Bonthoux Tournay', commune: 'Bordeaux', parti: 'Reconquete', role: 'tete', detail: 'Ancienne LR', source: 'CNews' },
    { nom: 'Jean-Christophe Letierce', commune: 'Troyes', parti: 'Reconquete', role: 'tete', detail: 'Entrepreneur', source: 'Reconquête' },
    { nom: 'Kevin Olivares', commune: 'Saint-Priest', parti: 'Reconquete', role: 'tete', source: 'Lyon Mag' },
    { nom: 'Benoît de Boysson', commune: 'Bourg-en-Bresse', parti: 'Reconquete', role: 'tete', detail: 'Avocat, union LR-Reconquête', source: 'Public Sénat' },
    { nom: 'Sarah Knafo', commune: 'Paris 16e', parti: 'Reconquete', role: 'tete', detail: 'Eurodéputée', source: 'Reconquête' },

    // UDR autres villes
    { nom: 'Freddy Roy', commune: 'La Roche-sur-Yon', parti: 'UDR', role: 'tete', detail: 'Soutenu par RN', source: 'France Bleu' },
    { nom: 'Jean-Louis Geiger', commune: 'Aix-en-Provence', parti: 'RN', role: 'tete', detail: 'Désigné RN-UDR', source: 'Made in Marseille' },
    { nom: 'Philippe Schreck', commune: 'Draguignan', parti: 'RN', role: 'tete', detail: 'Liste RN-UDR', source: 'Var Matin' },
    { nom: 'Thierry Tesson', commune: 'Douai', parti: 'RN', role: 'tete', detail: 'Liste RN-UDR', source: 'France Bleu' },
];

// ============================================
// IMPORT EN BASE DE DONNÉES
// ============================================

async function getCommunes() {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/communes?select=id,nom`, {
        headers: HEADERS
    });
    const communes = await res.json();
    const map = {};
    communes.forEach(c => map[c.nom.toLowerCase()] = c.id);
    return map;
}

async function getCandidatsExistants() {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/candidats?select=nom,prenom,commune_id`, {
        headers: HEADERS
    });
    const candidats = await res.json();
    const set = new Set();
    candidats.forEach(c => {
        set.add(`${c.prenom?.toLowerCase() || ''} ${c.nom?.toLowerCase() || ''}`.trim());
    });
    return set;
}

function parseNomComplet(nomComplet) {
    const parts = nomComplet.split(/\s+/);
    if (parts.length >= 2) {
        // Heuristique: dernier mot = nom de famille
        return {
            prenom: parts.slice(0, -1).join(' '),
            nom: parts[parts.length - 1]
        };
    }
    return { prenom: '', nom: nomComplet };
}

async function importCandidats(candidats) {
    console.log('\n=== IMPORT EN BASE DE DONNÉES ===\n');

    const communeMap = await getCommunes();
    const existants = await getCandidatsExistants();

    let added = 0, skipped = 0, noCommune = 0;

    for (const c of candidats) {
        const { prenom, nom } = parseNomComplet(c.nom_complet || c.nom);
        const key = `${prenom.toLowerCase()} ${nom.toLowerCase()}`.trim();

        if (existants.has(key)) {
            console.log(`  ○ ${prenom} ${nom} - déjà existant`);
            skipped++;
            continue;
        }

        const communeId = c.commune ? communeMap[c.commune.toLowerCase()] : null;
        if (c.commune && !communeId) {
            console.log(`  ? ${prenom} ${nom} - commune "${c.commune}" non trouvée`);
            noCommune++;
            continue;
        }

        const data = {
            nom: nom,
            prenom: prenom,
            commune_id: communeId,
            parti: c.parti || 'RN',
            role: c.role || 'tete',
            detail: [c.detail, c.secteur ? `Secteur: ${c.secteur}` : null, `Source: ${c.source || 'scraper'}`]
                .filter(Boolean).join('. ')
        };

        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/candidats`, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify(data)
        });

        if (res.ok) {
            console.log(`  + ${prenom} ${nom} (${c.role}) → ${c.commune || 'sans commune'}`);
            added++;
            existants.add(key);
        } else {
            const err = await res.text();
            console.log(`  ! ${prenom} ${nom}: ${err.substring(0, 50)}`);
        }
    }

    console.log(`\nRésultat: +${added} ajoutés, ${skipped} existants, ${noCommune} commune non trouvée`);
    return { added, skipped, noCommune };
}

// ============================================
// FORMAT DATA.GOUV.FR
// ============================================

function prepareDataGouv() {
    // Structure attendue pour les candidatures officielles
    // https://www.data.gouv.fr/fr/datasets/elections-municipales-2020-candidatures/
    console.log(`
=== PRÉPARATION IMPORT DATA.GOUV.FR ===

Quand les candidatures officielles seront publiées (après le 26/02/2026),
le fichier sera disponible sur:
https://www.data.gouv.fr/fr/datasets/elections-municipales-2026-candidatures/

Colonnes attendues:
- Code commune
- Libellé commune
- Numéro de tour
- Numéro panneau
- Numéro candidat sur la liste
- Sexe
- Nom
- Prénom
- Nationalité
- Candidat sortant
- Nuance liste

Script d'import à lancer:
  node scraper-colistiers.js --datagouv-import <fichier.csv>
`);
}

// ============================================
// MAIN
// ============================================

async function main() {
    const args = process.argv.slice(2);

    console.log('='.repeat(60));
    console.log('SCRAPER COLISTIERS - Veille Municipales 2026');
    console.log('='.repeat(60));

    if (args.length === 0 || args.includes('--help')) {
        console.log(`
Usage:
  node scraper-colistiers.js --all              # Scraper toutes les sources
  node scraper-colistiers.js --source <nom>     # Une source spécifique
  node scraper-colistiers.js --manuels          # Afficher données manuelles
  node scraper-colistiers.js --import           # Importer en BDD
  node scraper-colistiers.js --import-manuels   # Importer données manuelles
  node scraper-colistiers.js --datagouv         # Info data.gouv.fr
  node scraper-colistiers.js --export <file>    # Exporter en JSON

Sources disponibles:
${Object.keys(SOURCES).map(k => `  ${k}`).join('\n')}

Candidats manuels: ${CANDIDATS_MANUELS.length} entrées vérifiées
        `);
        return;
    }

    let results = [];

    if (args.includes('--all')) {
        for (const [name, config] of Object.entries(SOURCES)) {
            const result = await scrapeSource(name, config);
            results.push(result);
            await new Promise(r => setTimeout(r, 1500)); // pause
        }
    }

    if (args.includes('--source')) {
        const idx = args.indexOf('--source');
        const name = args[idx + 1];
        if (SOURCES[name]) {
            const result = await scrapeSource(name, SOURCES[name]);
            results.push(result);
        } else {
            console.log(`Source inconnue: ${name}`);
        }
    }

    if (args.includes('--manuels')) {
        console.log('\n=== CANDIDATS MANUELS VÉRIFIÉS ===\n');
        const byCommune = {};
        CANDIDATS_MANUELS.forEach(c => {
            const key = c.commune || 'Sans commune';
            if (!byCommune[key]) byCommune[key] = [];
            byCommune[key].push(c);
        });
        for (const [commune, candidats] of Object.entries(byCommune)) {
            console.log(`\n${commune} (${candidats.length}):`);
            candidats.forEach(c => {
                console.log(`  ${c.role === 'tete' ? '★' : '○'} ${c.nom} (${c.parti})${c.secteur ? ` [${c.secteur}]` : ''}`);
            });
        }
    }

    if (args.includes('--import-manuels')) {
        await importCandidats(CANDIDATS_MANUELS.map(c => ({
            nom_complet: c.nom,
            commune: c.commune,
            parti: c.parti,
            role: c.role,
            secteur: c.secteur,
            detail: c.detail,
            source: c.source
        })));
    }

    if (args.includes('--import') && results.length > 0) {
        const allCandidats = results.flatMap(r => r.candidats);
        await importCandidats(allCandidats);
    }

    if (args.includes('--datagouv')) {
        prepareDataGouv();
    }

    if (args.includes('--export')) {
        const idx = args.indexOf('--export');
        const file = args[idx + 1] || 'candidats-export.json';
        const data = {
            _comment: 'Export scraper-colistiers - Municipales 2026',
            _generated: new Date().toISOString(),
            sources: Object.keys(SOURCES),
            candidats_manuels: CANDIDATS_MANUELS,
            candidats_scrapes: results.flatMap(r => r.candidats)
        };
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        console.log(`\nExport: ${file}`);
    }

    console.log('\n' + '='.repeat(60));
}

main().catch(console.error);
