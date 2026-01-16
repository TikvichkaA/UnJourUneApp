/**
 * Scraper - Veille Municipales 2026
 * ==================================
 * Extraction automatique de candidats depuis les articles de presse
 *
 * Usage:
 *   node scraper.js <url>              # Scraper une URL
 *   node scraper.js --source france3   # Scraper une source prédéfinie
 *   node scraper.js --batch urls.txt   # Scraper plusieurs URLs
 *   node scraper.js --output data.json # Sauvegarder en JSON
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
// SOURCES PRÉDÉFINIES
// ============================================

const SOURCES = {
    france3_paca: 'https://france3-regions.franceinfo.fr/provence-alpes-cote-d-azur/alpes-maritimes/elections-municipales-2026-le-rassemblement-national-presente-ses-14-candidats-dans-les-alpes-maritimes-3266135.html',
    france3_lens: 'https://france3-regions.franceinfo.fr/hauts-de-france/pas-calais/lens/municipales-2026-la-ville-est-prenable-le-rn-reve-de-conquerir-lens-bastion-socialiste-du-bassin-minier-3279527.html',
    nicepresse_06: 'https://nicepresse.com/municipales-2026-le-rn-en-mode-conquete-voici-les-candidats-investis-dans-ces-communes-autour-de-nice/',
    horizon_62: 'https://www.horizonactu.fr/actualite-45951-municipales-2026-le-rn-annonce-six-tetes-de-liste-dans-le-lensois',
};

// ============================================
// PATTERNS D'EXTRACTION
// ============================================

// Patterns pour extraire les candidats RN
const CANDIDATE_PATTERNS = [
    // "Nom Prénom, candidat RN à Commune"
    /([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)\s*,?\s*(?:candidat|investi|tête de liste|soutenu)(?:\s+par)?\s*(?:le\s+)?(?:RN|Rassemblement\s+national|UDR)(?:\s+à|\s+pour|\s+sur)?\s*([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:[- ][a-zà-ÿA-ZÀ-Ÿ\-]+)*)?/gi,

    // "le RN investit Nom Prénom à Commune"
    /(?:RN|Rassemblement\s+national)\s+(?:investit|présente|soutient)\s+([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)(?:\s+à|\s+pour|\s+sur)?\s*([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:[- ][a-zà-ÿA-ZÀ-Ÿ\-]+)*)?/gi,

    // "Nom Prénom (RN)"
    /([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)\s*\((?:RN|Rassemblement national)\)/gi,

    // "À Commune : Nom Prénom"
    /[ÀA]\s+([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:[- ][a-zà-ÿA-ZÀ-Ÿ\-]+)*)\s*:\s*([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)/gi,

    // Format liste "Commune : Nom Prénom, age ans, profession"
    /([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:[- ][a-zà-ÿA-ZÀ-Ÿ\-]+)*)\s*:\s*([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)\s*,\s*\d+\s*ans/gi,

    // "député RN Nom Prénom" / "conseiller RN Nom Prénom"
    /(?:député|conseiller|sénateur|eurodéputé)[e]?\s+(?:RN|du\s+Rassemblement)\s+([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)/gi,
];

// Mots à exclure (faux positifs fréquents)
const EXCLUDE_WORDS = [
    'Rassemblement National', 'Marine Le', 'Jordan Bardella', 'Eric Ciotti',
    'Assemblée Nationale', 'Conseil Municipal', 'France Info', 'Nice Matin',
    'La Voix', 'France Bleu', 'Le Monde', 'Le Figaro', 'Ouest France',
    'Alpes Maritimes', 'Bouches Rhône', 'Hauts France', 'Provence Alpes',
    'Seine Saint', 'Pas Calais', 'Côte Azur'
];

// ============================================
// FONCTIONS DE SCRAPING
// ============================================

async function fetchPage(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
            },
            timeout: 15000
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
    } catch (error) {
        console.error(`Erreur fetch: ${error.message}`);
        return null;
    }
}

function extractCandidates(text) {
    const candidates = new Map(); // nom -> {nom, commune, details}

    // Nettoyer le texte
    const cleanText = text
        .replace(/\s+/g, ' ')
        .replace(/\n/g, ' ');

    // Appliquer chaque pattern
    for (const pattern of CANDIDATE_PATTERNS) {
        pattern.lastIndex = 0;
        let match;

        while ((match = pattern.exec(cleanText)) !== null) {
            let nom, commune;

            // Selon le pattern, l'ordre nom/commune varie
            if (match[0].match(/^[ÀA]\s+/i)) {
                // Pattern "À Commune : Nom"
                commune = match[1]?.trim();
                nom = match[2]?.trim();
            } else if (match[0].match(/:\s*[A-Z]/)) {
                // Pattern "Commune : Nom"
                commune = match[1]?.trim();
                nom = match[2]?.trim();
            } else {
                nom = match[1]?.trim();
                commune = match[2]?.trim();
            }

            // Valider le nom
            if (!nom || nom.length < 5 || nom.length > 50) continue;
            if (EXCLUDE_WORDS.some(w => nom.includes(w))) continue;
            if (nom.match(/^\d/) || nom.match(/^[a-z]/)) continue;

            // Extraire prénom/nom
            const parts = nom.split(' ').filter(p => p.length > 1);
            if (parts.length < 2) continue;

            const key = nom.toLowerCase();
            if (!candidates.has(key)) {
                candidates.set(key, {
                    nom_complet: nom,
                    prenom: parts.slice(0, -1).join(' '),
                    nom: parts.slice(-1)[0],
                    commune: commune || null,
                    parti: 'RN'
                });
            } else if (commune && !candidates.get(key).commune) {
                candidates.get(key).commune = commune;
            }
        }
    }

    return Array.from(candidates.values());
}

async function scrapeUrl(url) {
    console.log(`\nScraping: ${url}\n`);

    const html = await fetchPage(url);
    if (!html) {
        return { url, error: 'Impossible de charger la page', candidats: [] };
    }

    const $ = cheerio.load(html);

    // Extraire le titre
    const title = $('h1').first().text().trim() ||
                  $('title').text().trim() ||
                  'Sans titre';

    // Extraire le contenu principal
    const contentSelectors = [
        'article',
        '.article-content',
        '.post-content',
        '.entry-content',
        'main',
        '.content',
        '[role="main"]'
    ];

    let content = '';
    for (const selector of contentSelectors) {
        const el = $(selector);
        if (el.length > 0) {
            content = el.text();
            break;
        }
    }

    if (!content) {
        content = $('body').text();
    }

    // Extraire les candidats
    const candidats = extractCandidates(content);

    console.log(`Titre: ${title.substring(0, 80)}...`);
    console.log(`Candidats trouvés: ${candidats.length}\n`);

    candidats.forEach(c => {
        console.log(`  - ${c.nom_complet}${c.commune ? ` (${c.commune})` : ''}`);
    });

    return {
        url,
        title,
        candidats,
        scrapedAt: new Date().toISOString()
    };
}

// ============================================
// FONCTIONS D'EXPORT
// ============================================

function exportToJson(data, filepath) {
    const output = {
        _comment: 'Export scraper - Veille Municipales 2026',
        _generated: new Date().toISOString(),
        candidats: data.flatMap(d => d.candidats.map(c => ({
            nom: `${c.prenom} ${c.nom}`,
            commune: c.commune || '',
            parti: c.parti,
            source: d.url
        })))
    };

    fs.writeFileSync(filepath, JSON.stringify(output, null, 2));
    console.log(`\nExport JSON: ${filepath}`);
    console.log(`Total: ${output.candidats.length} candidats`);
}

async function importToDB(candidats) {
    console.log('\n--- Import en base de données ---\n');

    // Récupérer les communes existantes
    const communes = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/communes?select=id,nom`, {
        headers: HEADERS
    }).then(r => r.json());

    const communeMap = {};
    communes.forEach(c => communeMap[c.nom.toLowerCase()] = c.id);

    let added = 0, skipped = 0;

    for (const c of candidats) {
        const communeId = c.commune ? communeMap[c.commune.toLowerCase()] : null;

        const data = {
            nom: c.nom,
            prenom: c.prenom,
            commune_id: communeId,
            parti: c.parti || 'RN',
            role: 'tete'
        };

        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/candidats`, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify(data)
        });

        if (res.ok) {
            console.log(`  + ${c.prenom} ${c.nom}`);
            added++;
        } else {
            const err = await res.text();
            if (err.includes('duplicate')) {
                skipped++;
            } else {
                console.log(`  ! ${c.prenom} ${c.nom}: erreur`);
            }
        }
    }

    console.log(`\nRésultat: +${added} ajoutés, ${skipped} existants`);
}

// ============================================
// MAIN
// ============================================

async function main() {
    const args = process.argv.slice(2);

    console.log('='.repeat(60));
    console.log('SCRAPER - Veille Municipales 2026');
    console.log('='.repeat(60));

    if (args.length === 0) {
        console.log(`
Usage:
  node scraper.js <url>                    # Scraper une URL
  node scraper.js --source <nom>           # Source prédéfinie
  node scraper.js --batch <fichier.txt>    # URLs depuis fichier
  node scraper.js --output <fichier.json>  # Exporter en JSON
  node scraper.js --import                 # Importer en BDD

Sources prédéfinies:
${Object.entries(SOURCES).map(([k, v]) => `  ${k}: ${v.substring(0, 60)}...`).join('\n')}

Exemple workflow:
  1. node scraper.js https://... --output candidats.json
  2. Vérifier/éditer candidats.json
  3. node veille.js import candidats.json
        `);
        return;
    }

    const results = [];
    let outputFile = null;
    let doImport = false;

    // Parser les arguments
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === '--source' && args[i + 1]) {
            const sourceName = args[++i];
            if (SOURCES[sourceName]) {
                const result = await scrapeUrl(SOURCES[sourceName]);
                results.push(result);
            } else {
                console.log(`Source inconnue: ${sourceName}`);
            }
        } else if (arg === '--output' && args[i + 1]) {
            outputFile = args[++i];
        } else if (arg === '--import') {
            doImport = true;
        } else if (arg === '--batch' && args[i + 1]) {
            const batchFile = args[++i];
            if (fs.existsSync(batchFile)) {
                const urls = fs.readFileSync(batchFile, 'utf-8')
                    .split('\n')
                    .map(l => l.trim())
                    .filter(l => l && l.startsWith('http'));

                for (const url of urls) {
                    const result = await scrapeUrl(url);
                    results.push(result);
                    await new Promise(r => setTimeout(r, 1000)); // Pause 1s
                }
            }
        } else if (arg.startsWith('http')) {
            const result = await scrapeUrl(arg);
            results.push(result);
        }
    }

    // Export ou import
    if (results.length > 0) {
        if (outputFile) {
            exportToJson(results, outputFile);
        }

        if (doImport) {
            const allCandidats = results.flatMap(r => r.candidats);
            await importToDB(allCandidats);
        }

        if (!outputFile && !doImport) {
            console.log('\nPour sauvegarder: --output fichier.json');
            console.log('Pour importer en BDD: --import');
        }
    }

    console.log('\n' + '='.repeat(60));
}

main().catch(console.error);
