/**
 * Scraper - Veille Municipales 2026
 * ==================================
 * Script Node.js pour récupérer les candidats ED et leurs dingueries
 *
 * Usage: node scraper.js
 *
 * Dépendances: npm install node-fetch cheerio
 */

const { SUPABASE_CONFIG, SupabaseClient } = require('./config.js');

// Vérifier si les dépendances sont installées
let fetch, cheerio;
try {
    fetch = require('node-fetch');
    cheerio = require('cheerio');
} catch (e) {
    console.log('Installation des dépendances...');
    console.log('Exécute: npm install node-fetch@2 cheerio');
    process.exit(1);
}

// Client Supabase
const supabase = new SupabaseClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// ============================================
// SOURCES À SCRAPER
// ============================================

const SOURCES = {
    streetpress_rn: {
        name: 'StreetPress - RN',
        url: 'https://www.streetpress.com/rubriques/rassemblement-national',
        type: 'article_list'
    },
    streetpress_municipales: {
        name: 'StreetPress - Municipales',
        url: 'https://www.streetpress.com/rubriques/municipales',
        type: 'article_list'
    },
    basta_candidats: {
        name: 'Basta! - Candidats RN',
        url: 'https://basta.media/racistes-homophobes-complotistes-pro-poutine-antisemites-candidats-rn',
        type: 'article'
    }
};

// ============================================
// FONCTIONS DE SCRAPING
// ============================================

/**
 * Récupère le HTML d'une page
 */
async function fetchPage(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.text();
    } catch (error) {
        console.error(`Erreur fetch ${url}:`, error.message);
        return null;
    }
}

/**
 * Scrape les articles StreetPress
 */
async function scrapeStreetPress(url) {
    console.log(`\nScraping StreetPress: ${url}`);

    const html = await fetchPage(url);
    if (!html) return [];

    const $ = cheerio.load(html);
    const articles = [];

    // Sélecteurs StreetPress (structure Nuxt.js)
    $('section.article-preview-simple').each((i, el) => {
        const titleEl = $(el).find('.title a').first();
        const title = titleEl.text().trim();
        const link = titleEl.attr('href');
        const excerpt = $(el).find('.level-right .txt').text().trim();
        const date = $(el).find('.date-rub').text().trim();

        if (title && link) {
            articles.push({
                title,
                url: link.startsWith('http') ? link : `https://www.streetpress.com${link}`,
                excerpt,
                date,
                source: 'StreetPress'
            });
        }
    });

    console.log(`  -> ${articles.length} articles trouvés`);
    return articles;
}

/**
 * Extrait les noms de candidats d'un texte
 */
function extractCandidatNames(text) {
    const candidats = [];

    // Patterns pour détecter les noms de candidats RN
    const patterns = [
        /(?:candidat[e]?|député[e]?|élu[e]?)\s+(?:RN|Rassemblement\s+national)[^,]*?([A-Z][a-zéèêë]+(?:\s+[A-Z][a-zéèêë]+)+)/gi,
        /([A-Z][a-zéèêë]+(?:\s+[A-Z][a-zéèêë]+)+)\s*,?\s*(?:candidat|député|élu)[e]?\s+(?:RN|du\s+Rassemblement)/gi,
        /([A-Z][a-zéèêë]+\s+[A-Z][a-zéèêë\-]+)\s*\(RN\)/g
    ];

    patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const name = match[1].trim();
            if (name.length > 5 && name.length < 50 && !candidats.includes(name)) {
                candidats.push(name);
            }
        }
    });

    return candidats;
}

/**
 * Extrait les citations/dingueries d'un texte
 */
function extractDingueries(text, auteur = 'Inconnu') {
    const dingueries = [];

    // Patterns pour détecter des citations
    const quotePatterns = [
        /«\s*([^»]+)\s*»/g,
        /"([^"]+)"/g,
        /a\s+(?:déclaré|écrit|tweeté|publié)\s*:\s*[«"]([^»"]+)[»"]/gi
    ];

    // Mots-clés problématiques
    const keywords = [
        'racis', 'islam', 'arabe', 'maghréb', 'noir', 'immigr', 'étranger',
        'juif', 'sion', 'antisém', 'shoah', 'hitler',
        'homosex', 'gay', 'pd', 'lgbt',
        'femme', 'avortement', 'ivg',
        'remplace', 'invasion', 'grand remplacement'
    ];

    quotePatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const citation = match[1].trim();

            // Vérifier si la citation contient des mots-clés problématiques
            const isProblematic = keywords.some(kw =>
                citation.toLowerCase().includes(kw)
            );

            if (isProblematic && citation.length > 20 && citation.length < 500) {
                dingueries.push({
                    auteur,
                    citation,
                    type: detectType(citation)
                });
            }
        }
    });

    return dingueries;
}

/**
 * Détecte le type de propos
 */
function detectType(text) {
    const lower = text.toLowerCase();

    if (lower.match(/juif|sion|antisém|shoah|hitler|faurisson|coston/)) {
        return 'antisemitisme';
    }
    if (lower.match(/islam|musulman|mosquée|voile|halal/)) {
        return 'islamophobie';
    }
    if (lower.match(/homosex|gay|pd|lgbt|trans/)) {
        return 'homophobie';
    }
    if (lower.match(/femme|avortement|ivg|fémin/)) {
        return 'sexisme';
    }
    if (lower.match(/racis|noir|arabe|maghréb|immigr|étranger|remplace/)) {
        return 'racisme';
    }
    if (lower.match(/complot|vaccin|covid|plandém|5g|pédophile|deep state/)) {
        return 'complotisme';
    }

    return 'autre';
}

/**
 * Scrape un article complet pour extraire les données
 */
async function scrapeArticle(url, source) {
    console.log(`  Scraping article: ${url}`);

    const html = await fetchPage(url);
    if (!html) return null;

    const $ = cheerio.load(html);

    // Extraire le contenu principal
    const content = $('article, .article-content, .post-content, main').text();
    const title = $('h1').first().text().trim();

    // Extraire candidats et dingueries
    const candidats = extractCandidatNames(content);
    const dingueries = extractDingueries(content);

    return {
        title,
        url,
        source,
        candidats,
        dingueries,
        scrapedAt: new Date().toISOString()
    };
}

// ============================================
// FONCTIONS BASE DE DONNÉES (fetch direct)
// ============================================

const SUPABASE_HEADERS = {
    'apikey': SUPABASE_CONFIG.anonKey,
    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

/**
 * Sauvegarde un candidat dans Supabase
 */
async function saveCandidat(candidat) {
    try {
        const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/candidats`, {
            method: 'POST',
            headers: SUPABASE_HEADERS,
            body: JSON.stringify(candidat)
        });

        if (response.ok) {
            const result = await response.json();
            console.log(`  + Candidat ajouté: ${candidat.nom}`);
            return result[0];
        } else {
            const error = await response.text();
            // Ignorer les doublons (code 23505)
            if (error.includes('duplicate') || error.includes('23505')) {
                console.log(`  = Candidat existe: ${candidat.nom}`);
                return null;
            }
            console.error(`  Erreur candidat:`, error.substring(0, 100));
            return null;
        }
    } catch (error) {
        console.error(`  Erreur sauvegarde candidat:`, error.message);
        return null;
    }
}

/**
 * Sauvegarde une dinguerie dans Supabase
 */
async function saveDinguerie(dinguerie) {
    try {
        const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/dingueries`, {
            method: 'POST',
            headers: SUPABASE_HEADERS,
            body: JSON.stringify(dinguerie)
        });

        if (response.ok) {
            const result = await response.json();
            console.log(`  + Dinguerie ajoutée: ${dinguerie.auteur}`);
            return result[0];
        } else {
            const error = await response.text();
            console.error(`  Erreur dinguerie:`, error.substring(0, 100));
            return null;
        }
    } catch (error) {
        console.error(`  Erreur sauvegarde dinguerie:`, error.message);
        return null;
    }
}

// ============================================
// MAIN
// ============================================

async function main() {
    console.log('='.repeat(50));
    console.log('SCRAPER - Veille Municipales 2026');
    console.log('='.repeat(50));

    // Vérifier la configuration
    if (SUPABASE_CONFIG.anonKey === 'REMPLACER_PAR_TA_CLE_ANON') {
        console.log('\n⚠️  ATTENTION: Configure ta clé Supabase dans config.js');
        console.log('   Trouve-la dans: Settings > API > anon public key\n');

        // Mode démo sans base de données
        console.log('Mode démo (sans sauvegarde en base)...\n');
    }

    // Scraper les sources
    for (const [key, source] of Object.entries(SOURCES)) {
        console.log(`\n--- ${source.name} ---`);

        if (source.type === 'article_list') {
            const articles = await scrapeStreetPress(source.url);

            // Scraper les 5 premiers articles
            for (const article of articles.slice(0, 5)) {
                const data = await scrapeArticle(article.url, source.name);

                if (data) {
                    console.log(`  Titre: ${data.title}`);
                    console.log(`  Candidats trouvés: ${data.candidats.length}`);
                    console.log(`  Dingueries trouvées: ${data.dingueries.length}`);

                    // Sauvegarder en base si configuré
                    if (SUPABASE_CONFIG.anonKey !== 'REMPLACER_PAR_TA_CLE_ANON') {
                        for (const nom of data.candidats) {
                            await saveCandidat({
                                nom: nom.split(' ').slice(-1)[0], // Nom de famille
                                prenom: nom.split(' ').slice(0, -1).join(' '),
                                parti: 'RN',
                                detail: `Mentionné dans: ${data.title}`
                            });
                        }

                        for (const ding of data.dingueries) {
                            await saveDinguerie({
                                ...ding,
                                source_url: data.url,
                                source_media: source.name
                            });
                        }
                    }
                }

                // Pause pour éviter de surcharger le serveur
                await new Promise(r => setTimeout(r, 1000));
            }
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('Scraping terminé !');
    console.log('='.repeat(50));
}

// Exécuter
main().catch(console.error);
