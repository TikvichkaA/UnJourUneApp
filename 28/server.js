// KartApp - Daily Words Backend Server
// Simple Express server for serving daily vocabulary based on themes/news

const express = require('express');
const cors = require('cors');
const { fetchDailyArticle, VOCABULARY_DICTIONARY } = require('./article-service');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Extended vocabulary bank organized by themes and difficulty
const VOCABULARY_BANK = {
    // Actualités / News themes
    news: [
        { geo: 'ახალი ამბები', translit: 'akhali ambebi', meaning: 'actualités/nouvelles', level: 2, theme: 'news' },
        { geo: 'პოლიტიკა', translit: 'politika', meaning: 'politique', level: 2, theme: 'news' },
        { geo: 'ეკონომიკა', translit: 'ekonomika', meaning: 'économie', level: 2, theme: 'news' },
        { geo: 'მთავრობა', translit: 'mtavroba', meaning: 'gouvernement', level: 3, theme: 'news' },
        { geo: 'პარლამენტი', translit: 'parlamenti', meaning: 'parlement', level: 3, theme: 'news' },
        { geo: 'არჩევნები', translit: 'archevnebi', meaning: 'élections', level: 3, theme: 'news' },
        { geo: 'პრეზიდენტი', translit: 'prezidenti', meaning: 'président', level: 2, theme: 'news' },
        { geo: 'კანონი', translit: 'kanoni', meaning: 'loi', level: 3, theme: 'news' },
        { geo: 'შეთანხმება', translit: 'shetankheba', meaning: 'accord', level: 3, theme: 'news' },
        { geo: 'კონფლიქტი', translit: 'konflikti', meaning: 'conflit', level: 3, theme: 'news' }
    ],

    // Culture géorgienne
    culture: [
        { geo: 'სუფრა', translit: 'supra', meaning: 'festin géorgien', level: 2, theme: 'culture' },
        { geo: 'თამადა', translit: 'tamada', meaning: 'maître de cérémonie', level: 2, theme: 'culture' },
        { geo: 'საქართველო', translit: 'sakartvelo', meaning: 'Géorgie', level: 1, theme: 'culture' },
        { geo: 'ხინკალი', translit: 'khinkali', meaning: 'raviolis géorgiens', level: 1, theme: 'culture' },
        { geo: 'ხაჭაპური', translit: 'khachapuri', meaning: 'pain au fromage', level: 1, theme: 'culture' },
        { geo: 'ქორწილი', translit: 'kortsili', meaning: 'mariage', level: 2, theme: 'culture' },
        { geo: 'ტრადიცია', translit: 'traditsia', meaning: 'tradition', level: 2, theme: 'culture' },
        { geo: 'ფოლკლორი', translit: 'folklori', meaning: 'folklore', level: 2, theme: 'culture' },
        { geo: 'პოლიფონია', translit: 'polifonia', meaning: 'polyphonie', level: 3, theme: 'culture' },
        { geo: 'ცეკვა', translit: 'tsekva', meaning: 'danse', level: 1, theme: 'culture' }
    ],

    // Voyage / Tourisme
    travel: [
        { geo: 'მოგზაურობა', translit: 'mogzauroba', meaning: 'voyage', level: 2, theme: 'travel' },
        { geo: 'აეროპორტი', translit: 'aeroporti', meaning: 'aéroport', level: 2, theme: 'travel' },
        { geo: 'სასტუმრო', translit: 'sastumro', meaning: 'hôtel', level: 2, theme: 'travel' },
        { geo: 'რესტორანი', translit: 'restorani', meaning: 'restaurant', level: 1, theme: 'travel' },
        { geo: 'მუზეუმი', translit: 'muzeumi', meaning: 'musée', level: 2, theme: 'travel' },
        { geo: 'ეკლესია', translit: 'eklesia', meaning: 'église', level: 2, theme: 'travel' },
        { geo: 'მთა', translit: 'mta', meaning: 'montagne', level: 1, theme: 'travel' },
        { geo: 'ზღვა', translit: 'zghva', meaning: 'mer', level: 1, theme: 'travel' },
        { geo: 'ბილეთი', translit: 'bileti', meaning: 'billet', level: 2, theme: 'travel' },
        { geo: 'პასპორტი', translit: 'pasporti', meaning: 'passeport', level: 2, theme: 'travel' }
    ],

    // Vie quotidienne
    daily: [
        { geo: 'საუზმე', translit: 'sauzme', meaning: 'petit-déjeuner', level: 2, theme: 'daily' },
        { geo: 'სადილი', translit: 'sadili', meaning: 'déjeuner', level: 2, theme: 'daily' },
        { geo: 'ვახშამი', translit: 'vakhshami', meaning: 'dîner', level: 2, theme: 'daily' },
        { geo: 'სამუშაო', translit: 'samushao', meaning: 'travail', level: 2, theme: 'daily' },
        { geo: 'შეხვედრა', translit: 'shekhvedra', meaning: 'réunion/rencontre', level: 2, theme: 'daily' },
        { geo: 'მაღაზია', translit: 'maghazia', meaning: 'magasin', level: 1, theme: 'daily' },
        { geo: 'ბაზარი', translit: 'bazari', meaning: 'marché', level: 1, theme: 'daily' },
        { geo: 'ფასი', translit: 'pasi', meaning: 'prix', level: 2, theme: 'daily' },
        { geo: 'ფული', translit: 'puli', meaning: 'argent', level: 1, theme: 'daily' },
        { geo: 'ლარი', translit: 'lari', meaning: 'lari (monnaie)', level: 1, theme: 'daily' }
    ],

    // Nature / Environnement
    nature: [
        { geo: 'ბუნება', translit: 'buneba', meaning: 'nature', level: 2, theme: 'nature' },
        { geo: 'ტყე', translit: 'tqe', meaning: 'forêt', level: 2, theme: 'nature' },
        { geo: 'მდინარე', translit: 'mdinare', meaning: 'rivière', level: 2, theme: 'nature' },
        { geo: 'ტბა', translit: 'tba', meaning: 'lac', level: 2, theme: 'nature' },
        { geo: 'მზე', translit: 'mze', meaning: 'soleil', level: 1, theme: 'nature' },
        { geo: 'მთვარე', translit: 'mtvare', meaning: 'lune', level: 2, theme: 'nature' },
        { geo: 'ვარსკვლავი', translit: 'varskvlavi', meaning: 'étoile', level: 2, theme: 'nature' },
        { geo: 'ამინდი', translit: 'amindi', meaning: 'temps/météo', level: 2, theme: 'nature' },
        { geo: 'წვიმა', translit: 'tsvima', meaning: 'pluie', level: 2, theme: 'nature' },
        { geo: 'თოვლი', translit: 'tovli', meaning: 'neige', level: 2, theme: 'nature' }
    ],

    // Technologie
    tech: [
        { geo: 'კომპიუტერი', translit: 'kompiuteri', meaning: 'ordinateur', level: 2, theme: 'tech' },
        { geo: 'ტელეფონი', translit: 'teleponi', meaning: 'téléphone', level: 1, theme: 'tech' },
        { geo: 'ინტერნეტი', translit: 'interneti', meaning: 'internet', level: 1, theme: 'tech' },
        { geo: 'აპლიკაცია', translit: 'aplikatsia', meaning: 'application', level: 2, theme: 'tech' },
        { geo: 'პროგრამა', translit: 'programa', meaning: 'programme', level: 2, theme: 'tech' },
        { geo: 'მონაცემები', translit: 'monatsemebi', meaning: 'données', level: 3, theme: 'tech' },
        { geo: 'ხელოვნური ინტელექტი', translit: 'khelovnuri intelekti', meaning: 'intelligence artificielle', level: 3, theme: 'tech' },
        { geo: 'სოციალური ქსელი', translit: 'sotsialuri kseli', meaning: 'réseau social', level: 2, theme: 'tech' },
        { geo: 'ვებგვერდი', translit: 'vebgverdi', meaning: 'site web', level: 2, theme: 'tech' },
        { geo: 'პაროლი', translit: 'paroli', meaning: 'mot de passe', level: 2, theme: 'tech' }
    ],

    // Sport
    sport: [
        { geo: 'სპორტი', translit: 'sporti', meaning: 'sport', level: 1, theme: 'sport' },
        { geo: 'ფეხბურთი', translit: 'pekhburti', meaning: 'football', level: 1, theme: 'sport' },
        { geo: 'კალათბურთი', translit: 'kalatburti', meaning: 'basketball', level: 2, theme: 'sport' },
        { geo: 'ჭიდაობა', translit: 'chidaoba', meaning: 'lutte géorgienne', level: 2, theme: 'sport' },
        { geo: 'გუნდი', translit: 'gundi', meaning: 'équipe', level: 2, theme: 'sport' },
        { geo: 'მატჩი', translit: 'matchi', meaning: 'match', level: 2, theme: 'sport' },
        { geo: 'გამარჯვება', translit: 'gamarjveba', meaning: 'victoire', level: 2, theme: 'sport' },
        { geo: 'წაგება', translit: 'tsageba', meaning: 'défaite', level: 2, theme: 'sport' },
        { geo: 'ჩემპიონი', translit: 'chempioni', meaning: 'champion', level: 2, theme: 'sport' },
        { geo: 'ოლიმპიადა', translit: 'olimpiada', meaning: 'olympiades', level: 2, theme: 'sport' }
    ],

    // Expressions utiles
    expressions: [
        { geo: 'რა თქმა უნდა', translit: 'ra tkma unda', meaning: 'bien sûr', level: 2, theme: 'expressions' },
        { geo: 'უკაცრავად', translit: 'ukatsravad', meaning: 'excusez-moi', level: 1, theme: 'expressions' },
        { geo: 'თუ შეიძლება', translit: 'tu sheidzleba', meaning: 's\'il vous plaît', level: 1, theme: 'expressions' },
        { geo: 'არ მესმის', translit: 'ar mesmis', meaning: 'je ne comprends pas', level: 1, theme: 'expressions' },
        { geo: 'დამეხმარეთ', translit: 'damekhmaret', meaning: 'aidez-moi', level: 2, theme: 'expressions' },
        { geo: 'რა ღირს?', translit: 'ra ghirs?', meaning: 'combien ça coûte?', level: 1, theme: 'expressions' },
        { geo: 'სად არის...?', translit: 'sad aris...?', meaning: 'où est...?', level: 1, theme: 'expressions' },
        { geo: 'მომწონს', translit: 'momtsons', meaning: 'j\'aime (ça me plaît)', level: 2, theme: 'expressions' },
        { geo: 'ძალიან კარგი', translit: 'dzalian kargi', meaning: 'très bien', level: 1, theme: 'expressions' },
        { geo: 'წარმატებები', translit: 'tsarmatebebi', meaning: 'bonne chance', level: 2, theme: 'expressions' }
    ],

    // Verbes avancés
    verbs_advanced: [
        { geo: 'ვფიქრობ', translit: 'vpikrob', meaning: 'je pense', level: 2, theme: 'verbs' },
        { geo: 'მჯერა', translit: 'mjera', meaning: 'je crois', level: 2, theme: 'verbs' },
        { geo: 'ვეთანხმები', translit: 'vetankhmbi', meaning: 'je suis d\'accord', level: 2, theme: 'verbs' },
        { geo: 'მინდა', translit: 'minda', meaning: 'je veux', level: 1, theme: 'verbs' },
        { geo: 'შემიძლია', translit: 'shemidzlia', meaning: 'je peux', level: 2, theme: 'verbs' },
        { geo: 'უნდა', translit: 'unda', meaning: 'il faut/doit', level: 2, theme: 'verbs' },
        { geo: 'ვმუშაობ', translit: 'vmushob', meaning: 'je travaille', level: 2, theme: 'verbs' },
        { geo: 'ვსწავლობ', translit: 'vstsvavlob', meaning: 'j\'apprends', level: 2, theme: 'verbs' },
        { geo: 'ვმოგზაურობ', translit: 'vmogzaurob', meaning: 'je voyage', level: 2, theme: 'verbs' },
        { geo: 'ვხარშავ', translit: 'vkharshav', meaning: 'je cuisine', level: 2, theme: 'verbs' }
    ]
};

// Daily themes rotation (one theme per day of week + news integration)
const DAILY_THEMES = ['culture', 'travel', 'daily', 'nature', 'tech', 'sport', 'expressions'];

// Generate a seed from date for consistent daily selection
function getDaySeed(date = new Date()) {
    const dateStr = date.toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        const char = dateStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// Shuffle array with seed for reproducible randomness
function seededShuffle(array, seed) {
    const shuffled = [...array];
    let currentIndex = shuffled.length;

    // Simple seeded random
    const seededRandom = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    while (currentIndex > 0) {
        const randomIndex = Math.floor(seededRandom() * currentIndex);
        currentIndex--;
        [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }

    return shuffled;
}

// Get daily words based on date and user level
function getDailyWords(date = new Date(), userLevel = 1, count = 5) {
    const seed = getDaySeed(date);
    const dayOfWeek = date.getDay();

    // Select theme for the day
    const mainTheme = DAILY_THEMES[dayOfWeek % DAILY_THEMES.length];

    // Collect words from main theme + news (always include some news words)
    let candidates = [];

    // Add main theme words
    if (VOCABULARY_BANK[mainTheme]) {
        candidates.push(...VOCABULARY_BANK[mainTheme].filter(w => w.level <= userLevel + 1));
    }

    // Add some news words (always relevant)
    candidates.push(...VOCABULARY_BANK.news.filter(w => w.level <= userLevel + 1));

    // Add advanced verbs for higher levels
    if (userLevel >= 2) {
        candidates.push(...VOCABULARY_BANK.verbs_advanced.filter(w => w.level <= userLevel + 1));
    }

    // Shuffle and select
    const shuffled = seededShuffle(candidates, seed);
    const selected = shuffled.slice(0, count);

    return {
        date: date.toISOString().split('T')[0],
        theme: mainTheme,
        themeLabel: getThemeLabel(mainTheme),
        words: selected
    };
}

function getThemeLabel(theme) {
    const labels = {
        news: 'Actualités',
        culture: 'Culture géorgienne',
        travel: 'Voyage',
        daily: 'Vie quotidienne',
        nature: 'Nature',
        tech: 'Technologie',
        sport: 'Sport',
        expressions: 'Expressions utiles',
        verbs: 'Verbes'
    };
    return labels[theme] || theme;
}

// API Endpoints

// Get today's 5 words
app.get('/api/daily-words', (req, res) => {
    const userLevel = parseInt(req.query.level) || 1;
    const result = getDailyWords(new Date(), userLevel, 5);
    res.json(result);
});

// Get words for a specific date
app.get('/api/daily-words/:date', (req, res) => {
    const date = new Date(req.params.date);
    if (isNaN(date.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
    }
    const userLevel = parseInt(req.query.level) || 1;
    const result = getDailyWords(date, userLevel, 5);
    res.json(result);
});

// Get all vocabulary for a theme
app.get('/api/vocabulary/:theme', (req, res) => {
    const theme = req.params.theme;
    const userLevel = parseInt(req.query.level) || 3;

    if (!VOCABULARY_BANK[theme]) {
        return res.status(404).json({ error: 'Theme not found' });
    }

    const words = VOCABULARY_BANK[theme].filter(w => w.level <= userLevel);
    res.json({ theme, themeLabel: getThemeLabel(theme), words });
});

// Get all themes
app.get('/api/themes', (req, res) => {
    const themes = Object.keys(VOCABULARY_BANK).map(key => ({
        id: key,
        label: getThemeLabel(key),
        wordCount: VOCABULARY_BANK[key].length
    }));
    res.json(themes);
});

// Get daily article with vocabulary from real web sources
app.get('/api/daily-article', async (req, res) => {
    try {
        const userLevel = parseInt(req.query.level) || 1;
        const result = await fetchDailyArticle(userLevel);
        res.json(result);
    } catch (error) {
        console.error('Error fetching daily article:', error);
        res.status(500).json({ error: 'Failed to fetch article', message: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`KartApp API server running on port ${PORT}`);
    console.log(`Daily words endpoint: http://localhost:${PORT}/api/daily-words`);
});

module.exports = { getDailyWords, VOCABULARY_BANK };
