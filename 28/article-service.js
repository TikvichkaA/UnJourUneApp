// Article Service - Fetches real Georgian articles and extracts vocabulary
// Uses RSS feeds from Georgian news sources

const https = require('https');
const http = require('http');

// Georgian news RSS feeds
const NEWS_SOURCES = [
    {
        name: 'Radio Free Europe - Georgian',
        url: 'https://www.radiotavisupleba.ge/api/z-pqpiev-qpp',
        type: 'rferl',
        language: 'ka'
    },
    {
        name: 'BBC Georgian',
        url: 'https://feeds.bbci.co.uk/georgian/rss.xml',
        type: 'rss',
        language: 'ka'
    }
];

// Vocabulary dictionary for matching (Georgian -> French translation + info)
const VOCABULARY_DICTIONARY = {
    // Common words that appear in news
    'საქართველო': { meaning: 'Géorgie', translit: 'sakartvelo', level: 1 },
    'თბილისი': { meaning: 'Tbilissi', translit: 'tbilisi', level: 1 },
    'მთავრობა': { meaning: 'gouvernement', translit: 'mtavroba', level: 2 },
    'პრეზიდენტი': { meaning: 'président', translit: 'prezidenti', level: 2 },
    'პარლამენტი': { meaning: 'parlement', translit: 'parlamenti', level: 2 },
    'მინისტრი': { meaning: 'ministre', translit: 'ministri', level: 2 },
    'კანონი': { meaning: 'loi', translit: 'kanoni', level: 3 },
    'არჩევნები': { meaning: 'élections', translit: 'archevnebi', level: 3 },
    'ხალხი': { meaning: 'peuple', translit: 'khalkhi', level: 2 },
    'ქვეყანა': { meaning: 'pays', translit: 'kveqana', level: 2 },
    'დღეს': { meaning: 'aujourd\'hui', translit: 'dghes', level: 1 },
    'ხვალ': { meaning: 'demain', translit: 'khval', level: 1 },
    'გუშინ': { meaning: 'hier', translit: 'gushin', level: 1 },
    'წელი': { meaning: 'année', translit: 'tseli', level: 2 },
    'თვე': { meaning: 'mois', translit: 'tve', level: 2 },
    'კვირა': { meaning: 'semaine', translit: 'kvira', level: 2 },
    'ადამიანი': { meaning: 'personne/humain', translit: 'adamiani', level: 2 },
    'ქალაქი': { meaning: 'ville', translit: 'kalaki', level: 2 },
    'სოფელი': { meaning: 'village', translit: 'sopeli', level: 2 },
    'სახლი': { meaning: 'maison', translit: 'sakhli', level: 1 },
    'მუშაობა': { meaning: 'travail', translit: 'mushaoba', level: 2 },
    'სკოლა': { meaning: 'école', translit: 'skola', level: 1 },
    'უნივერსიტეტი': { meaning: 'université', translit: 'universiteti', level: 2 },
    'სტუდენტი': { meaning: 'étudiant', translit: 'studenti', level: 2 },
    'ექიმი': { meaning: 'médecin', translit: 'ekimi', level: 2 },
    'პოლიცია': { meaning: 'police', translit: 'politsia', level: 2 },
    'ომი': { meaning: 'guerre', translit: 'omi', level: 3 },
    'მშვიდობა': { meaning: 'paix', translit: 'mshvidoba', level: 2 },
    'ეკონომიკა': { meaning: 'économie', translit: 'ekonomika', level: 3 },
    'ბიზნესი': { meaning: 'business', translit: 'biznesi', level: 2 },
    'ფული': { meaning: 'argent', translit: 'puli', level: 1 },
    'ბანკი': { meaning: 'banque', translit: 'banki', level: 2 },
    'მაღაზია': { meaning: 'magasin', translit: 'maghazia', level: 1 },
    'რესტორანი': { meaning: 'restaurant', translit: 'restorani', level: 1 },
    'სასტუმრო': { meaning: 'hôtel', translit: 'sastumro', level: 2 },
    'აეროპორტი': { meaning: 'aéroport', translit: 'aeroporti', level: 2 },
    'მანქანა': { meaning: 'voiture', translit: 'mankana', level: 1 },
    'ავტობუსი': { meaning: 'bus', translit: 'avtobusi', level: 1 },
    'მატარებელი': { meaning: 'train', translit: 'matarebeli', level: 2 },
    'თვითმფრინავი': { meaning: 'avion', translit: 'tvitmprinavi', level: 2 },
    'ზღვა': { meaning: 'mer', translit: 'zghva', level: 1 },
    'მთა': { meaning: 'montagne', translit: 'mta', level: 1 },
    'მდინარე': { meaning: 'rivière', translit: 'mdinare', level: 2 },
    'ტყე': { meaning: 'forêt', translit: 'tqe', level: 2 },
    'ამინდი': { meaning: 'temps/météo', translit: 'amindi', level: 2 },
    'მზე': { meaning: 'soleil', translit: 'mze', level: 1 },
    'წვიმა': { meaning: 'pluie', translit: 'tsvima', level: 2 },
    'თოვლი': { meaning: 'neige', translit: 'tovli', level: 2 },
    'კულტურა': { meaning: 'culture', translit: 'kultura', level: 2 },
    'ხელოვნება': { meaning: 'art', translit: 'khelovneba', level: 3 },
    'მუსიკა': { meaning: 'musique', translit: 'musika', level: 1 },
    'ფილმი': { meaning: 'film', translit: 'pilmi', level: 1 },
    'წიგნი': { meaning: 'livre', translit: 'tsigni', level: 1 },
    'სპორტი': { meaning: 'sport', translit: 'sporti', level: 1 },
    'ფეხბურთი': { meaning: 'football', translit: 'pekhburti', level: 1 },
    'გუნდი': { meaning: 'équipe', translit: 'gundi', level: 2 },
    'თამაში': { meaning: 'jeu/match', translit: 'tamashi', level: 2 },
    'გამარჯვება': { meaning: 'victoire', translit: 'gamarjveba', level: 2 },
    'პრობლემა': { meaning: 'problème', translit: 'problema', level: 2 },
    'გადაწყვეტილება': { meaning: 'décision', translit: 'gadatsqvetileba', level: 3 },
    'შეხვედრა': { meaning: 'réunion/rencontre', translit: 'shekhvedra', level: 2 },
    'კონფერენცია': { meaning: 'conférence', translit: 'konperentsia', level: 3 },
    'ინფორმაცია': { meaning: 'information', translit: 'inpormatsia', level: 2 },
    'ახალი': { meaning: 'nouveau', translit: 'akhali', level: 1 },
    'ძველი': { meaning: 'ancien/vieux', translit: 'dzveli', level: 2 },
    'დიდი': { meaning: 'grand', translit: 'didi', level: 1 },
    'პატარა': { meaning: 'petit', translit: 'patara', level: 1 },
    'კარგი': { meaning: 'bon', translit: 'kargi', level: 1 },
    'ცუდი': { meaning: 'mauvais', translit: 'tsudi', level: 1 },
    'მნიშვნელოვანი': { meaning: 'important', translit: 'mnishvnelovani', level: 3 },
    'საინტერესო': { meaning: 'intéressant', translit: 'saintereso', level: 2 },
    'ევროპა': { meaning: 'Europe', translit: 'evropa', level: 2 },
    'ამერიკა': { meaning: 'Amérique', translit: 'amerika', level: 2 },
    'რუსეთი': { meaning: 'Russie', translit: 'ruseti', level: 2 },
    'თურქეთი': { meaning: 'Turquie', translit: 'turketi', level: 2 },
    'სომხეთი': { meaning: 'Arménie', translit: 'somkheti', level: 2 },
    'აზერბაიჯანი': { meaning: 'Azerbaïdjan', translit: 'azerbaijani', level: 2 }
};

// Fetch URL content
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;

        const request = client.get(url, {
            headers: {
                'User-Agent': 'KartApp/1.0 (Georgian Learning App)',
                'Accept': 'application/rss+xml, application/xml, text/xml, */*'
            }
        }, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                // Handle redirect
                return fetchUrl(response.headers.location).then(resolve).catch(reject);
            }

            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve(data));
        });

        request.on('error', reject);
        request.setTimeout(10000, () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

// Parse RSS feed and extract articles
function parseRSS(xml) {
    const articles = [];

    // Simple RSS parsing (works for most feeds)
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
        const item = match[1];

        const title = extractTag(item, 'title');
        const description = extractTag(item, 'description');
        const link = extractTag(item, 'link');
        const pubDate = extractTag(item, 'pubDate');

        if (title || description) {
            articles.push({
                title: cleanHtml(title),
                description: cleanHtml(description),
                link,
                pubDate: pubDate ? new Date(pubDate) : new Date(),
                content: cleanHtml(title + ' ' + description)
            });
        }
    }

    return articles;
}

// Extract content from XML tag
function extractTag(xml, tag) {
    const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? (match[1] || match[2] || '').trim() : '';
}

// Clean HTML tags and entities
function cleanHtml(text) {
    if (!text) return '';
    return text
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(num))
        .replace(/\s+/g, ' ')
        .trim();
}

// Find vocabulary words in text, excluding already-known words
function findVocabularyInText(text, userLevel = 3, excludeWords = []) {
    const foundWords = [];

    for (const [word, info] of Object.entries(VOCABULARY_DICTIONARY)) {
        if (info.level <= userLevel + 1 && text.includes(word) && !excludeWords.includes(word)) {
            // Find position in text
            const index = text.indexOf(word);

            // Extract context (surrounding sentence)
            const start = Math.max(0, text.lastIndexOf('.', index) + 1);
            const end = text.indexOf('.', index + word.length);
            const context = text.substring(start, end > 0 ? end + 1 : undefined).trim();

            foundWords.push({
                geo: word,
                meaning: info.meaning,
                translit: info.translit,
                level: info.level,
                context: context.substring(0, 200), // Limit context length
                position: index
            });
        }
    }

    // Sort by position in text, then by level (easier words first)
    foundWords.sort((a, b) => a.level - b.level || a.position - b.position);

    return foundWords;
}

// Fetch articles from all sources and find vocabulary
async function fetchDailyArticle(userLevel = 1, excludeWords = []) {
    const errors = [];

    for (const source of NEWS_SOURCES) {
        try {
            console.log(`Fetching from ${source.name}...`);
            const xml = await fetchUrl(source.url);
            const articles = parseRSS(xml);

            if (articles.length === 0) continue;

            // Find article with most NEW vocabulary matches
            let bestArticle = null;
            let bestWords = [];

            for (const article of articles.slice(0, 10)) { // Check first 10 articles
                const words = findVocabularyInText(article.content, userLevel, excludeWords);

                if (words.length >= 3 && words.length > bestWords.length) {
                    bestArticle = article;
                    bestWords = words;
                }
            }

            if (bestArticle && bestWords.length >= 3) {
                return {
                    success: true,
                    source: source.name,
                    article: {
                        title: bestArticle.title,
                        description: bestArticle.description,
                        link: bestArticle.link,
                        date: bestArticle.pubDate.toISOString().split('T')[0]
                    },
                    words: bestWords.slice(0, 5), // Return top 5 words
                    totalWordsFound: bestWords.length
                };
            }
        } catch (error) {
            console.error(`Error fetching from ${source.name}:`, error.message);
            errors.push({ source: source.name, error: error.message });
        }
    }

    // Fallback: return a curated article if no live articles found
    return getFallbackArticle(userLevel, excludeWords);
}

// Fallback articles when live fetch fails
function getFallbackArticle(userLevel, excludeWords = []) {
    const fallbackArticles = [
        {
            title: 'საქართველოში ტურიზმი იზრდება',
            description: 'თბილისი - საქართველოში ტურიზმი სწრაფად ვითარდება. ქვეყანა სულ უფრო პოპულარული ხდება უცხოელ ტურისტებში. მთავრობა ახალ პროგრამებს ამზადებს ტურიზმის განვითარებისთვის. სასტუმროები და რესტორნები იხსნება ყოველდღე.',
            link: 'https://example.com/tourism',
            date: new Date().toISOString().split('T')[0],
            source: 'Article du jour'
        },
        {
            title: 'თბილისში ახალი მუზეუმი გაიხსნა',
            description: 'დღეს თბილისში ახალი მუზეუმი გაიხსნა. ქალაქის ცენტრში მდებარე მუზეუმი ქართულ კულტურას და ხელოვნებას წარმოადგენს. ადამიანები ბევრი მოვიდნენ გახსნაზე.',
            link: 'https://example.com/museum',
            date: new Date().toISOString().split('T')[0],
            source: 'Article du jour'
        },
        {
            title: 'კარგი ამინდი მოდის საქართველოში',
            description: 'ამინდი საქართველოში კარგი იქნება ამ კვირაში. მზე ანათებს და თბილია. ზღვაზე და მთაში ბევრი ადამიანი წავა. ტყეში სეირნობა კარგი იდეაა.',
            link: 'https://example.com/weather',
            date: new Date().toISOString().split('T')[0],
            source: 'Article du jour'
        }
    ];

    // Pick article based on day
    const dayIndex = new Date().getDay() % fallbackArticles.length;
    const article = fallbackArticles[dayIndex];
    const words = findVocabularyInText(article.title + ' ' + article.description, userLevel, excludeWords);

    return {
        success: true,
        source: article.source,
        fallback: true,
        article: {
            title: article.title,
            description: article.description,
            link: article.link,
            date: article.date
        },
        words: words.slice(0, 5),
        totalWordsFound: words.length
    };
}

module.exports = {
    fetchDailyArticle,
    findVocabularyInText,
    VOCABULARY_DICTIONARY,
    NEWS_SOURCES
};
