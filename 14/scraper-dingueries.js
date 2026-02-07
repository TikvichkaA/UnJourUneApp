/**
 * Scraper Dingueries - Veille Municipales 2026
 * =============================================
 * Extraction des propos problématiques depuis les articles de presse
 *
 * Sources supportées:
 *   - StreetPress (liste des 109 candidats)
 *   - Les Jours (brebis galeuses)
 *   - Basta Media
 *   - France 3 Régions
 *
 * Usage:
 *   node scraper-dingueries.js                    # Scraper toutes les sources
 *   node scraper-dingueries.js --source streetpress
 *   node scraper-dingueries.js --output dingueries.json
 *   node scraper-dingueries.js --dry-run          # Test sans import
 *
 * Dépendances: npm install node-fetch@2 cheerio
 */

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

// Configuration Supabase (optionnel)
let SUPABASE_CONFIG;
try {
    SUPABASE_CONFIG = require('./config.js').SUPABASE_CONFIG;
} catch (e) {
    SUPABASE_CONFIG = null;
}

// ============================================
// GESTION DU LOG DE SCRAPING
// ============================================

const SCRAPING_LOG_PATH = path.join(__dirname, 'scraping-log.json');

function loadScrapingLog() {
    try {
        if (fs.existsSync(SCRAPING_LOG_PATH)) {
            return JSON.parse(fs.readFileSync(SCRAPING_LOG_PATH, 'utf-8'));
        }
    } catch (e) {}
    return { sources_utilisees: [], sources_a_scraper: [] };
}

function saveScrapingLog(log) {
    log.meta = log.meta || {};
    log.meta.last_updated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(SCRAPING_LOG_PATH, JSON.stringify(log, null, 2), 'utf-8');
}

function isSourceAlreadyScraped(url, log) {
    return log.sources_utilisees?.some(s => s.url === url);
}

function addSourceToLog(log, url, type, nbDingueries) {
    if (!log.sources_utilisees) log.sources_utilisees = [];

    // Éviter les doublons
    const existing = log.sources_utilisees.find(s => s.url === url);
    if (existing) {
        existing.date_scrape = new Date().toISOString().split('T')[0];
        existing.nb_dingueries = (existing.nb_dingueries || 0) + nbDingueries;
    } else {
        log.sources_utilisees.push({
            url,
            date_scrape: new Date().toISOString().split('T')[0],
            type,
            donnees_extraites: ['dingueries'],
            nb_dingueries: nbDingueries
        });
    }
}

// ============================================
// SOURCES À SCRAPER
// ============================================

const SOURCES = {
    // StreetPress - Articles principaux
    streetpress_109: {
        name: 'StreetPress - 109 candidats épinglés',
        url: 'https://www.streetpress.com/sujet/1720200623-propos-racistes-homophobes-complotistes-liste-candidats-rassemblement-national-epingles-extreme-droite-bardella-deputes-assemblee',
        type: 'liste'
    },
    streetpress_pecher: {
        name: 'StreetPress - Louis-Joseph Pecher',
        url: 'https://www.streetpress.com/sujet/1718813377-louis-joseph-pecher-ciotti-juif-antisemite-racisme-sexisme-homophobe-candidat-rassemblement-national-rn-bardella',
        type: 'article'
    },
    streetpress_liban: {
        name: 'StreetPress - Josseline Liban (Caen)',
        url: 'https://www.streetpress.com/sujet/1719935581-caen-nouvelle-candidate-rassemblement-national-raciste-complotiste-josseline-liban-elections-legislatives-calvados',
        type: 'article'
    },
    streetpress_bernard: {
        name: 'StreetPress - Brice Bernard (quenelle)',
        url: 'https://www.streetpress.com/sujet/1719574820-brice-bernard-candidat-rassemblement-national-quenelle-racisme-neofasciste-chatillon-extreme-droite',
        type: 'article'
    },
    streetpress_perez: {
        name: 'StreetPress - Christian Pérez (Finistère)',
        url: 'https://www.streetpress.com/sujet/1720017546-finistere-candidat-rassemblement-national-joueurs-equipe-france-clandestins-legislatives',
        type: 'article'
    },
    streetpress_koutseff: {
        name: 'StreetPress - Nicolas Koutseff (tweets racistes)',
        url: 'https://www.streetpress.com/sujet/1746464175-attache-parlementaire-vire-tweets-racistes-deputee-rassemblement-national-var-laure-lavalette-nicolas-koutseff',
        type: 'article'
    },
    streetpress_daoudi: {
        name: 'StreetPress - Ludivine Daoudi (casquette nazie)',
        url: 'https://www.streetpress.com/sujet/1719915854-rn-casquette-nazie-membre-parti-france-raciste-antisemite-petainiste-rassemblement-national-le-pen-bardella-calvados',
        type: 'article'
    },

    // Basta Media
    basta_candidats: {
        name: 'Basta - Candidats RN problématiques',
        url: 'https://basta.media/racistes-homophobes-complotistes-pro-poutine-antisemites-candidats-rn',
        type: 'liste'
    },

    // Les Jours - Obsession RN (articles ouverts)
    lesjours_pichon: {
        name: 'Les Jours - Julio Pichon (Saint-Nazaire)',
        url: 'https://lesjours.fr/obsessions/rn-derniere-marche-2/ep13-julio-pichon/',
        type: 'article'
    },
    lesjours_deputes: {
        name: 'Les Jours - 26 députés RN têtes de liste',
        url: 'https://lesjours.fr/obsessions/rn-derniere-marche-2/ep19-deputes-brebis-galeuses-municipales/',
        type: 'liste'
    },

    // France 3 Régions
    france3_belfort: {
        name: 'France 3 - Quentin Macullo (Belfort)',
        url: 'https://france3-regions.franceinfo.fr/bourgogne-franche-comte/territoire-de-belfort/belfort/un-candidat-rn-aux-municipales-2026-a-belfort-epingle-pour-des-propos-racistes-et-homophobes-3268043.html',
        type: 'article'
    },

    // L'insoumission
    insoumission_pichon: {
        name: 'L\'insoumission - Julio Pichon RN',
        url: 'https://linsoumission.fr/2026/01/16/rn-saint-nazaire-municipales-racisme/',
        type: 'article'
    },

    // Times of Israel
    timesofisrael: {
        name: 'Times of Israel - Candidats RN antisémites',
        url: 'https://fr.timesofisrael.com/les-candidats-du-rn-qui-font-tache-leurs-propos-antisemites-racistes-et-complotistes/',
        type: 'liste'
    }
};

// ============================================
// CLASSIFICATION DES PROPOS
// ============================================

const TYPES_PROPOS = {
    raciste: ['racis', 'négro', 'arabe', 'maghrébin', 'noir', 'blanc', 'race', 'étranger', 'immigration', 'clandestin', 'remigration', 'sauvage', 'singe', 'bestial', 'primitif', 'tribu'],
    antisemite: ['juif', 'antisém', 'sémite', 'sioniste', 'israel', 'shoah', 'holocauste', 'rothschild', 'quenelle', 'dieudo'],
    homophobe: ['homo', 'gay', 'lgbt', 'pédé', 'gouine', 'travelo', 'trans', 'sodomite', 'lobby gay'],
    islamophobe: ['islam', 'musulman', 'mosquée', 'voile', 'halal', 'coran', 'allah', 'islamis'],
    sexiste: ['femme', 'féministe', 'avortement', 'ivg', 'genre', 'salope', 'pute'],
    complotiste: ['complot', 'vaccin', 'covid', 'big pharma', 'great reset', 'davos', 'mondialiste', 'soros', 'nouvel ordre', 'manipulation'],
    violent: ['tuer', 'mort', 'fusil', 'arme', 'violence', 'pendre', 'guillotine', 'exterminer', 'éliminer', 'nettoyer'],
    revisionniste: ['vichy', 'pétain', 'nazi', 'reich', 'négationniste', 'chambre à gaz', 'untermensch', 'ss', 'hitler', 'fascis', 'mussolini', 'heil', 'white power', 'white pride', 'suprémaciste']
};

function classifyPropos(text) {
    const textLower = text.toLowerCase();
    const types = [];

    for (const [type, keywords] of Object.entries(TYPES_PROPOS)) {
        if (keywords.some(kw => textLower.includes(kw))) {
            types.push(type);
        }
    }

    return types.length > 0 ? types : ['autre'];
}

// ============================================
// FONCTIONS D'EXTRACTION
// ============================================

async function fetchPage(url) {
    try {
        console.log(`  Fetching: ${url.substring(0, 60)}...`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
            },
            timeout: 20000
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
    } catch (error) {
        console.error(`  Erreur: ${error.message}`);
        return null;
    }
}

// Extraire les citations entre guillemets
function extractQuotes(text) {
    const quotes = [];

    // Guillemets français « »
    const frenchQuotes = text.match(/«\s*([^»]+)\s*»/g) || [];
    quotes.push(...frenchQuotes.map(q => q.replace(/[«»]/g, '').trim()));

    // Guillemets anglais " "
    const englishQuotes = text.match(/"([^"]+)"/g) || [];
    quotes.push(...englishQuotes.map(q => q.replace(/"/g, '').trim()));

    // Guillemets typographiques " "
    const typoQuotes = text.match(/"\s*([^"]+)\s*"/g) || [];
    quotes.push(...typoQuotes.map(q => q.replace(/[""]/g, '').trim()));

    return quotes.filter(q => q.length > 20 && q.length < 500);
}

// Noms à exclure (faux positifs fréquents)
const EXCLUDE_NAMES = [
    // Politiques nationaux / leaders
    'Rassemblement National', 'Marine Le', 'Jordan Bardella', 'Eric Ciotti',
    'Emmanuel Macron', 'Jean-Luc Mélenchon', 'François Hollande', 'Nicolas Sarkozy',
    'Gérard Larcher', 'Front National', 'Nouveau Front',

    // Personnalités publiques (faux positifs)
    'Vladimir Poutine', 'Adolf Hitler', 'Jacques Attali', 'Daniel Craig',
    'Zoé Sagan', 'Arthur Delaporte', 'Dieudonné',

    // Médias et institutions
    'France Info', 'Le Monde', 'Le Figaro', 'Libération', 'Mediapart',
    'Sleeping Giants', 'Valeurs Actuelles', 'CNews', 'BFM TV', 'StreetPress',
    'Les Jours', 'Basta Media', 'France Bleu', 'France Inter',
    'Assemblée Nationale', 'Conseil Municipal', 'Sénat Gérard',

    // Partis et mouvements
    'Parti Socialiste', 'Les Républicains', 'White Pride', 'Black Lives',

    // Régions / lieux (faux positifs)
    'Hauts France', 'Île France', 'Nouvelle Aquitaine', 'Bouches Rhône',
    'Seine Denis', 'Val Marne', 'République', 'Sur Facebook', 'Sur Twitter',

    // Erreurs de parsing courantes
    'éniste', 'iste ', 'Si Louis', 'Les électeurs', 'Les candidats',
    'Le candidat', 'La candidate', 'En janvier', 'En février', 'En mars',
    'Cette semaine', 'Ce lundi', 'Ce mardi'
];

// Extraire le nom d'un candidat depuis le contexte
function extractCandidateName(context) {
    // Pattern plus précis : Prénom Nom ou Prénom-Prénom Nom
    const patterns = [
        // Format "Jean-Marie Le Pen" ou "Jean Le Pen"
        /\b([A-ZÀ-Ÿ][a-zà-ÿ]+(?:-[A-ZÀ-Ÿ][a-zà-ÿ]+)?\s+(?:[A-ZÀ-Ÿ][a-zà-ÿ]+\s+)?[A-ZÀ-Ÿ][a-zà-ÿ]+)\b/,
        // Format "DUPONT Jean" (nom en majuscules)
        /\b([A-ZÀ-Ÿ]{2,}(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)+)\b/,
    ];

    for (const pattern of patterns) {
        const matches = context.match(new RegExp(pattern.source, 'g')) || [];
        for (const match of matches) {
            const name = match.trim();
            if (name.length >= 8 && name.length <= 40) {
                // Vérifier que ce n'est pas un faux positif
                if (!EXCLUDE_NAMES.some(e => name.toLowerCase().includes(e.toLowerCase()))) {
                    // Vérifier qu'il y a au moins 2 mots
                    const words = name.split(/\s+/);
                    if (words.length >= 2) {
                        return name;
                    }
                }
            }
        }
    }
    return null;
}

// Extraire la circonscription/commune
function extractLocation(context) {
    const patterns = [
        /(?:à|de|dans)\s+(?:la\s+)?(\d+e?\s+circonscription\s+(?:de\s+)?[A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:[- ][A-Za-zà-ÿ\-]+)*)/i,
        /\(([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:[- ]\d+)?)\)/,
        /(?:élu|député|candidat)[e]?\s+(?:de|à|dans)\s+(?:la\s+)?([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:[- ][A-Za-zà-ÿ\-]+)*)/i,
    ];

    for (const pattern of patterns) {
        const match = context.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// ============================================
// SCRAPERS SPÉCIFIQUES PAR SOURCE
// ============================================

async function scrapeStreetpressListe(url) {
    const html = await fetchPage(url);
    if (!html) return [];

    const $ = cheerio.load(html);
    const dingueries = [];

    // StreetPress structure: sections par candidat avec h2/h3/strong pour le nom
    // Format typique: "Nom Prénom | Xe circonscription Département"
    let currentCandidat = null;
    let currentCirco = null;

    // Parcourir tous les éléments du contenu principal
    $('article, .article-body, .format_body').find('h2, h3, h4, strong, p').each((i, el) => {
        const $el = $(el);
        const text = $el.text().trim();
        const tagName = el.tagName?.toLowerCase();

        // Détecter un nouveau candidat (titre ou strong avec nom + circonscription)
        if (tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || tagName === 'strong') {
            // Pattern: "Prénom Nom | Xe circonscription Département" ou "Prénom Nom (Département)"
            const candidatMatch = text.match(/^([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ\-]+)+)\s*(?:\||–|-)?\s*(\d+e?\s+circonscription\s+[A-Za-zÀ-ÿ\-\s]+)?/);
            if (candidatMatch && candidatMatch[1]) {
                const potentialName = candidatMatch[1].trim();
                if (!EXCLUDE_NAMES.some(e => potentialName.toLowerCase().includes(e.toLowerCase()))) {
                    currentCandidat = potentialName;
                    currentCirco = candidatMatch[2]?.trim() || extractLocation(text);
                }
            }
        }

        // Extraire les citations des paragraphes
        if (tagName === 'p' && currentCandidat) {
            const quotes = extractQuotes(text);

            quotes.forEach(quote => {
                // Classification
                const types = classifyPropos(quote);

                // Source originale mentionnée (Libération, Le Monde, etc.)
                let sourceOriginale = null;
                const sourcePatterns = [
                    /(?:selon|source\s*:?|rapporté par|révélé par|dans)\s+([A-Za-zÀ-ÿ\s]+?)(?:\.|,|$)/i,
                    /\(([A-Za-zÀ-ÿ\s]+?)\)$/,
                ];
                for (const pattern of sourcePatterns) {
                    const match = text.match(pattern);
                    if (match) {
                        sourceOriginale = match[1].trim();
                        break;
                    }
                }

                if (quote.length > 20) {
                    dingueries.push({
                        auteur: currentCandidat,
                        citation: quote,
                        types: types,
                        source: url,
                        source_originale: sourceOriginale,
                        lieu: currentCirco,
                        contexte: text.substring(0, 200),
                        scraped_at: new Date().toISOString()
                    });
                }
            });
        }
    });

    // Si pas de structure par titres, fallback sur l'ancienne méthode
    if (dingueries.length === 0) {
        $('article p, .article-body p, .format_body p').each((i, el) => {
            const $el = $(el);
            const text = $el.text();

            // Chercher les noms en gras
            const boldNames = [];
            $el.find('strong, b').each((j, bold) => {
                const name = $(bold).text().trim();
                if (name.length > 5 && name.length < 50) {
                    if (!EXCLUDE_NAMES.some(e => name.toLowerCase().includes(e.toLowerCase()))) {
                        boldNames.push(name);
                    }
                }
            });

            const quotes = extractQuotes(text);

            quotes.forEach(quote => {
                let auteur = boldNames[0] || extractCandidateName(text);
                const types = classifyPropos(quote);

                if (auteur && quote.length > 20) {
                    dingueries.push({
                        auteur: auteur,
                        citation: quote,
                        types: types,
                        source: url,
                        lieu: extractLocation(text),
                        contexte: text.substring(0, 200),
                        scraped_at: new Date().toISOString()
                    });
                }
            });
        });
    }

    return dingueries;
}

async function scrapeStreetpressArticle(url) {
    const html = await fetchPage(url);
    if (!html) return [];

    const $ = cheerio.load(html);
    const dingueries = [];

    // Titre pour identifier le candidat principal
    const title = $('h1').first().text();
    const mainCandidat = extractCandidateName(title);

    // Parcourir tous les paragraphes
    $('article p, .article-body p, .format_body p').each((i, el) => {
        const text = $(el).text();
        const quotes = extractQuotes(text);

        quotes.forEach(quote => {
            const auteur = extractCandidateName(text) || mainCandidat;
            const types = classifyPropos(quote);

            if (auteur && quote.length > 20) {
                dingueries.push({
                    auteur: auteur,
                    citation: quote,
                    types: types,
                    source: url,
                    lieu: extractLocation(text),
                    contexte: text.substring(0, 200),
                    scraped_at: new Date().toISOString()
                });
            }
        });
    });

    return dingueries;
}

async function scrapeBasta(url) {
    const html = await fetchPage(url);
    if (!html) return [];

    const $ = cheerio.load(html);
    const dingueries = [];

    // Basta utilise une structure similaire
    $('article p, .article-content p, .post-content p').each((i, el) => {
        const text = $(el).text();
        const quotes = extractQuotes(text);

        quotes.forEach(quote => {
            const auteur = extractCandidateName(text);
            const types = classifyPropos(quote);

            if (auteur && quote.length > 20) {
                dingueries.push({
                    auteur: auteur,
                    citation: quote,
                    types: types,
                    source: url,
                    lieu: extractLocation(text),
                    contexte: text.substring(0, 200),
                    scraped_at: new Date().toISOString()
                });
            }
        });
    });

    return dingueries;
}

// Scraper générique pour articles de presse
async function scrapeGenericArticle(url) {
    const html = await fetchPage(url);
    if (!html) return [];

    const $ = cheerio.load(html);
    const dingueries = [];

    // Titre pour identifier le candidat principal
    const title = $('h1').first().text();
    const mainCandidat = extractCandidateName(title);

    // Sélecteurs communs pour le contenu
    const contentSelectors = [
        'article p',
        '.article-body p',
        '.article-content p',
        '.post-content p',
        '.entry-content p',
        '.content p',
        'main p'
    ];

    $(contentSelectors.join(', ')).each((i, el) => {
        const text = $(el).text();
        const quotes = extractQuotes(text);

        quotes.forEach(quote => {
            const auteur = extractCandidateName(text) || mainCandidat;
            const types = classifyPropos(quote);

            if (auteur && quote.length > 20) {
                dingueries.push({
                    auteur: auteur,
                    citation: quote,
                    types: types,
                    source: url,
                    lieu: extractLocation(text),
                    contexte: text.substring(0, 200),
                    scraped_at: new Date().toISOString()
                });
            }
        });
    });

    return dingueries;
}

// Scraper pour Les Jours (structure spécifique)
async function scrapeLesJours(url) {
    const html = await fetchPage(url);
    if (!html) return [];

    const $ = cheerio.load(html);
    const dingueries = [];

    // Les Jours a souvent un paywall, on extrait ce qu'on peut
    const title = $('h1').first().text();
    const mainCandidat = extractCandidateName(title);

    // Chapô et contenu visible
    $('.article-chapo, .chapo, .article-body, .episode-content, article p').each((i, el) => {
        const text = $(el).text();
        const quotes = extractQuotes(text);

        quotes.forEach(quote => {
            const auteur = extractCandidateName(text) || mainCandidat;
            const types = classifyPropos(quote);

            if (auteur && quote.length > 20) {
                dingueries.push({
                    auteur: auteur,
                    citation: quote,
                    types: types,
                    source: url,
                    lieu: extractLocation(text),
                    contexte: text.substring(0, 200),
                    scraped_at: new Date().toISOString()
                });
            }
        });
    });

    return dingueries;
}

// Scraper pour France 3 Régions
async function scrapeFrance3(url) {
    const html = await fetchPage(url);
    if (!html) return [];

    const $ = cheerio.load(html);
    const dingueries = [];

    const title = $('h1').first().text();
    const mainCandidat = extractCandidateName(title);

    // France 3 utilise des classes spécifiques
    $('.article__paragraph, .c-body p, article p, .a-content p').each((i, el) => {
        const text = $(el).text();
        const quotes = extractQuotes(text);

        quotes.forEach(quote => {
            const auteur = extractCandidateName(text) || mainCandidat;
            const types = classifyPropos(quote);

            if (auteur && quote.length > 20) {
                dingueries.push({
                    auteur: auteur,
                    citation: quote,
                    types: types,
                    source: url,
                    lieu: extractLocation(text),
                    contexte: text.substring(0, 200),
                    scraped_at: new Date().toISOString()
                });
            }
        });
    });

    return dingueries;
}

// ============================================
// DÉDUPLICATION
// ============================================

function deduplicateDingueries(dingueries) {
    const seen = new Map();

    return dingueries.filter(d => {
        // Hash basé sur citation + auteur
        const key = `${d.auteur?.toLowerCase()}_${d.citation?.substring(0, 50).toLowerCase()}`;

        if (seen.has(key)) {
            return false;
        }
        seen.set(key, true);
        return true;
    });
}

// ============================================
// EXPORT
// ============================================

function exportToJson(dingueries, filepath) {
    const output = {
        _meta: {
            description: 'Propos problématiques de candidats - Veille Municipales 2026',
            generated: new Date().toISOString(),
            total: dingueries.length,
            sources: [...new Set(dingueries.map(d => d.source))]
        },
        stats: {
            by_type: {},
            by_auteur: {}
        },
        dingueries: dingueries
    };

    // Stats par type
    dingueries.forEach(d => {
        d.types.forEach(t => {
            output.stats.by_type[t] = (output.stats.by_type[t] || 0) + 1;
        });
        if (d.auteur) {
            output.stats.by_auteur[d.auteur] = (output.stats.by_auteur[d.auteur] || 0) + 1;
        }
    });

    fs.writeFileSync(filepath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`\nExport: ${filepath}`);
    console.log(`Total: ${dingueries.length} dingueries`);

    return output;
}

async function importToSupabase(dingueries) {
    if (!SUPABASE_CONFIG) {
        console.log('Config Supabase non disponible, import ignoré');
        return;
    }

    console.log('\n--- Import Supabase ---\n');

    const headers = {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    };

    let added = 0, errors = 0;

    for (const d of dingueries) {
        const data = {
            auteur: d.auteur,
            citation: d.citation,
            type: d.types[0] || 'autre',
            types_all: d.types,
            source: d.source,
            contexte: d.contexte,
            lieu: d.lieu
        };

        try {
            const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/dingueries`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            });

            if (res.ok) {
                added++;
                console.log(`  + ${d.auteur}: "${d.citation.substring(0, 40)}..."`);
            } else {
                const err = await res.text();
                if (!err.includes('duplicate')) {
                    errors++;
                }
            }
        } catch (e) {
            errors++;
        }
    }

    console.log(`\nRésultat: +${added} ajoutées, ${errors} erreurs`);
}

// ============================================
// MAIN
// ============================================

async function main() {
    const args = process.argv.slice(2);

    console.log('='.repeat(60));
    console.log('SCRAPER DINGUERIES - Veille Municipales 2026');
    console.log('='.repeat(60));

    // Charger le log existant
    const scrapingLog = loadScrapingLog();

    let sourcesToScrape = Object.keys(SOURCES);
    let outputFile = 'dingueries-scrape.json';
    let dryRun = false;
    let doImport = false;
    let forceRescrape = false;

    // Parser arguments
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--source' && args[i + 1]) {
            const name = args[++i];
            if (SOURCES[name]) {
                sourcesToScrape = [name];
            } else {
                console.log(`Source inconnue: ${name}`);
                console.log(`Sources disponibles: ${Object.keys(SOURCES).join(', ')}`);
                return;
            }
        } else if (args[i] === '--output' && args[i + 1]) {
            outputFile = args[++i];
        } else if (args[i] === '--dry-run') {
            dryRun = true;
        } else if (args[i] === '--import') {
            doImport = true;
        } else if (args[i] === '--force') {
            forceRescrape = true;
        } else if (args[i] === '--help') {
            console.log(`
Usage:
  node scraper-dingueries.js                      # Scraper toutes les sources (nouvelles uniquement)
  node scraper-dingueries.js --source <nom>       # Une source spécifique
  node scraper-dingueries.js --output <file.json> # Fichier de sortie
  node scraper-dingueries.js --dry-run            # Test sans export
  node scraper-dingueries.js --import             # Import direct Supabase
  node scraper-dingueries.js --force              # Forcer re-scraping des sources déjà faites

Sources disponibles:
${Object.entries(SOURCES).map(([k, v]) => `  ${k}: ${v.name}`).join('\n')}
            `);
            return;
        }
    }

    // Filtrer les sources déjà scrapées (sauf si --force)
    if (!forceRescrape) {
        const originalCount = sourcesToScrape.length;
        sourcesToScrape = sourcesToScrape.filter(key => {
            const url = SOURCES[key].url;
            const alreadyDone = isSourceAlreadyScraped(url, scrapingLog);
            if (alreadyDone) {
                console.log(`  [Skip] ${key} - déjà scrapé`);
            }
            return !alreadyDone;
        });
        if (sourcesToScrape.length < originalCount) {
            console.log(`\n  ${originalCount - sourcesToScrape.length} source(s) ignorée(s) (déjà scrapées)`);
            console.log(`  Utilisez --force pour re-scraper`);
        }
    }

    console.log(`\nSources à scraper: ${sourcesToScrape.length}`);
    console.log(`Output: ${outputFile}`);
    console.log(`Mode: ${dryRun ? 'dry-run' : 'normal'}\n`);

    const allDingueries = [];

    for (const sourceKey of sourcesToScrape) {
        const source = SOURCES[sourceKey];
        console.log(`\n--- ${source.name} ---`);

        let dingueries = [];

        // Sélectionner le bon scraper selon la source
        if (source.url.includes('streetpress')) {
            if (source.type === 'liste') {
                dingueries = await scrapeStreetpressListe(source.url);
            } else {
                dingueries = await scrapeStreetpressArticle(source.url);
            }
        } else if (source.url.includes('basta')) {
            dingueries = await scrapeBasta(source.url);
        } else if (source.url.includes('lesjours')) {
            dingueries = await scrapeLesJours(source.url);
        } else if (source.url.includes('france3') || source.url.includes('franceinfo')) {
            dingueries = await scrapeFrance3(source.url);
        } else {
            // Scraper générique pour les autres sources
            dingueries = await scrapeGenericArticle(source.url);
        }

        console.log(`  Trouvé: ${dingueries.length} dingueries`);
        allDingueries.push(...dingueries);

        // Mettre à jour le log (sauf dry-run)
        if (!dryRun && dingueries.length > 0) {
            addSourceToLog(scrapingLog, source.url, source.type, dingueries.length);
        }

        // Pause entre les requêtes
        await new Promise(r => setTimeout(r, 1500));
    }

    // Sauvegarder le log (sauf dry-run)
    if (!dryRun && allDingueries.length > 0) {
        saveScrapingLog(scrapingLog);
        console.log('\nLog de scraping mis à jour.');
    }

    // Dédupliquer
    const uniqueDingueries = deduplicateDingueries(allDingueries);
    console.log(`\n--- Résumé ---`);
    console.log(`Total brut: ${allDingueries.length}`);
    console.log(`Après dédup: ${uniqueDingueries.length}`);

    // Stats par type
    const typeStats = {};
    uniqueDingueries.forEach(d => {
        d.types.forEach(t => {
            typeStats[t] = (typeStats[t] || 0) + 1;
        });
    });
    console.log(`\nPar type:`);
    Object.entries(typeStats).sort((a, b) => b[1] - a[1]).forEach(([t, c]) => {
        console.log(`  ${t}: ${c}`);
    });

    // Export
    if (!dryRun) {
        const outputPath = path.join(__dirname, outputFile);
        exportToJson(uniqueDingueries, outputPath);

        if (doImport) {
            await importToSupabase(uniqueDingueries);
        }
    } else {
        console.log('\n[Dry-run] Pas d\'export');
        // Afficher quelques exemples
        console.log('\nExemples:');
        uniqueDingueries.slice(0, 5).forEach(d => {
            console.log(`\n  ${d.auteur} (${d.types.join(', ')}):`);
            console.log(`  "${d.citation.substring(0, 80)}..."`);
        });
    }

    console.log('\n' + '='.repeat(60));
}

main().catch(console.error);
