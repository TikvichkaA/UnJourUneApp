// Liste complète des ARS de France avec leurs identifiants URL
const ARS_LIST = [
    { id: 'auvergne-rhone-alpes', name: 'Auvergne-Rhône-Alpes' },
    { id: 'bourgogne-franche-comte', name: 'Bourgogne-Franche-Comté' },
    { id: 'bretagne', name: 'Bretagne' },
    { id: 'centre-val-de-loire', name: 'Centre-Val de Loire' },
    { id: 'corse', name: 'Corse' },
    { id: 'grand-est', name: 'Grand Est' },
    { id: 'guadeloupe', name: 'Guadeloupe' },
    { id: 'guyane', name: 'Guyane' },
    { id: 'hauts-de-france', name: 'Hauts-de-France' },
    { id: 'iledefrance', name: 'Île-de-France' },
    { id: 'martinique', name: 'Martinique' },
    { id: 'mayotte', name: 'Mayotte' },
    { id: 'normandie', name: 'Normandie' },
    { id: 'nouvelle-aquitaine', name: 'Nouvelle-Aquitaine' },
    { id: 'occitanie', name: 'Occitanie' },
    { id: 'pays-de-la-loire', name: 'Pays de la Loire' },
    { id: 'provence-alpes-cote-dazur', name: "Provence-Alpes-Côte d'Azur" },
    { id: 'la-reunion', name: 'La Réunion' },
    // ARS nationale
    { id: 'national', name: 'National (ARS)', isNational: true }
];

// Mots-clés par défaut pour la veille soins palliatifs
const DEFAULT_KEYWORDS = [
    'palliatif',
    'palliative',
    'fin de vie',
    'accompagnement',
    'soins de support',
    'douleur chronique',
    'HAD',
    'EMSP',
    'USP',
    'LISP'
];

// Proxies CORS (fallback si le premier échoue)
const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
];

// État de l'application
let state = {
    keywords: [...DEFAULT_KEYWORDS],
    results: [],
    filteredResults: [],
    arsStatus: {},
    darkMode: localStorage.getItem('darkMode') === 'true',
    currentProxy: 0,
    lastVisit: null,
    newSinceLastVisit: 0
};

// ============================================
// Abonnement aux alertes email
// ============================================

const SUBSCRIPTION_TYPE = 'veille_ars';
let isSubscribed = false;
let subscriptionLoading = false;
let authMode = 'login';

// Initialiser l'authentification
async function initAuth() {
    // Verifier si Auth est disponible (supabase-auth.js charge)
    if (typeof Auth === 'undefined') {
        return;
    }

    try {
        await Auth.init();
        Auth.onAuthChange((user, profile) => {
            updateAuthUI(user);
            if (user) {
                checkSubscription();
            } else {
                isSubscribed = false;
                updateSubscribeButton();
            }
        });
    } catch (error) {
        console.error('Erreur init auth:', error);
    }
}

function updateAuthUI(user) {
    const loginPrompt = document.getElementById('btnLoginPrompt');
    const subscribeBtn = document.getElementById('btnSubscribe');

    if (!loginPrompt || !subscribeBtn) return;

    if (user) {
        loginPrompt.classList.add('hidden');
        subscribeBtn.classList.remove('hidden');
    } else {
        loginPrompt.classList.remove('hidden');
        subscribeBtn.classList.add('hidden');
    }
}

async function checkSubscription() {
    if (typeof Auth === 'undefined') return;

    const user = Auth.getUser();
    if (!user) return;

    try {
        const { data, error } = await supabaseClient
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('type', SUBSCRIPTION_TYPE)
            .eq('is_active', true)
            .maybeSingle();

        isSubscribed = !error && data;
        updateSubscribeButton();
    } catch (error) {
        console.error('Erreur check subscription:', error);
    }
}

function updateSubscribeButton() {
    const btn = document.getElementById('btnSubscribe');
    const icon = document.getElementById('subscribe-icon');
    const text = document.getElementById('subscribe-text');

    if (subscriptionLoading) {
        icon.textContent = '...';
        text.textContent = 'Chargement...';
        btn.disabled = true;
        return;
    }

    btn.disabled = false;

    if (isSubscribed) {
        btn.classList.add('subscribed');
        icon.textContent = '✅';
        text.textContent = 'Abonne';
    } else {
        btn.classList.remove('subscribed');
        icon.textContent = '📧';
        text.textContent = "S'abonner";
    }
}

async function toggleSubscription() {
    if (typeof Auth === 'undefined') {
        showAuthModal();
        return;
    }

    const user = Auth.getUser();
    if (!user) {
        showAuthModal();
        return;
    }

    subscriptionLoading = true;
    updateSubscribeButton();

    try {
        if (isSubscribed) {
            // Desabonner
            const { error } = await supabaseClient
                .from('subscriptions')
                .delete()
                .eq('user_id', user.id)
                .eq('type', SUBSCRIPTION_TYPE);

            if (error) throw error;
            isSubscribed = false;
            showToast('Desabonne des alertes email');
        } else {
            // Abonner
            const { error } = await supabaseClient
                .from('subscriptions')
                .upsert({
                    user_id: user.id,
                    type: SUBSCRIPTION_TYPE,
                    is_active: true
                }, { onConflict: 'user_id,type' });

            if (error) throw error;
            isSubscribed = true;
            showToast('Abonne aux alertes email quotidiennes');
        }
    } catch (error) {
        console.error('Erreur subscription:', error);
        showToast('Erreur: ' + error.message);
    }

    subscriptionLoading = false;
    updateSubscribeButton();
}

// ============================================
// Modal authentification
// ============================================

function showAuthModal() {
    document.getElementById('auth-modal').classList.add('active');
    document.getElementById('auth-email').focus();
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
    document.getElementById('auth-form').reset();
    document.getElementById('auth-error').classList.add('hidden');
}

function toggleAuthMode() {
    authMode = authMode === 'login' ? 'signup' : 'login';
    const title = document.getElementById('auth-modal-title');
    const submit = document.getElementById('auth-submit');
    const switchText = document.getElementById('auth-switch-text');
    const switchBtn = document.getElementById('auth-switch-btn');

    if (authMode === 'login') {
        title.textContent = 'Connexion';
        submit.textContent = 'Se connecter';
        switchText.textContent = 'Pas de compte ?';
        switchBtn.textContent = 'Creer un compte';
    } else {
        title.textContent = 'Inscription';
        submit.textContent = 'Creer un compte';
        switchText.textContent = 'Deja un compte ?';
        switchBtn.textContent = 'Se connecter';
    }
}

async function handleAuth(event) {
    event.preventDefault();

    if (typeof Auth === 'undefined') {
        showToast('Erreur: module auth non charge');
        return;
    }

    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');
    const submitBtn = document.getElementById('auth-submit');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Chargement...';

    try {
        if (authMode === 'login') {
            await Auth.signIn(email, password);
            showToast('Connecte !');
        } else {
            await Auth.signUp(email, password);
            showToast('Compte cree ! Verifiez votre email.');
        }
        closeAuthModal();
    } catch (error) {
        errorEl.textContent = error.message || 'Erreur de connexion';
        errorEl.classList.remove('hidden');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = authMode === 'login' ? 'Se connecter' : 'Creer un compte';
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Charger les mots-clés sauvegardés
    const savedKeywords = localStorage.getItem('veille-keywords');
    if (savedKeywords) {
        state.keywords = JSON.parse(savedKeywords);
    }

    // Charger la date de dernière visite
    const lastVisitStr = localStorage.getItem('veille-last-visit');
    if (lastVisitStr) {
        state.lastVisit = new Date(lastVisitStr);
    }

    // Mode sombre
    if (state.darkMode) {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('dark-mode-icon').textContent = '☀️';
    }

    // Afficher la dernière visite
    updateLastVisitDisplay();

    // Initialiser l'UI
    renderKeywords();
    populateRegionFilter();
    renderARSGrid();

    // Initialiser l'authentification (pour les abonnements email)
    initAuth();

    // Lancer le scan
    refreshFeeds();

    // Sauvegarder la date de visite actuelle (après un délai pour voir les nouveautés)
    setTimeout(() => {
        localStorage.setItem('veille-last-visit', new Date().toISOString());
    }, 5000);
}

function updateLastVisitDisplay() {
    const statusText = document.getElementById('status-text');
    if (state.lastVisit) {
        const diff = Math.floor((new Date() - state.lastVisit) / (1000 * 60 * 60 * 24));
        if (diff === 0) {
            statusText.textContent = 'Vu aujourd\'hui';
        } else if (diff === 1) {
            statusText.textContent = 'Vu hier';
        } else {
            statusText.textContent = `Vu il y a ${diff}j`;
        }
    } else {
        statusText.textContent = 'Première visite';
    }
}

function renderKeywords() {
    const container = document.getElementById('keywords-list');
    container.innerHTML = state.keywords.map((kw, index) => `
        <span class="keyword-tag">
            ${kw}
            <button onclick="removeKeyword(${index})" title="Supprimer">×</button>
        </span>
    `).join('');
}

function populateRegionFilter() {
    const select = document.getElementById('filter-region');
    ARS_LIST.forEach(ars => {
        const option = document.createElement('option');
        option.value = ars.id;
        option.textContent = ars.name;
        select.appendChild(option);
    });
}

function renderARSGrid() {
    const grid = document.getElementById('ars-grid');
    grid.innerHTML = ARS_LIST.map(ars => `
        <div class="ars-item" id="ars-${ars.id}" data-status="pending">
            <span class="status-icon">⏳</span>
            <span class="ars-name">${ars.name}</span>
            <span class="ars-count" style="display: none;">0</span>
        </div>
    `).join('');
}

async function refreshFeeds() {
    state.results = [];
    state.arsStatus = {};

    // Reset UI
    document.getElementById('loading-state').style.display = 'flex';
    document.getElementById('status-dot').className = 'status-dot loading';
    document.getElementById('status-text').textContent = 'Scan en cours...';
    document.getElementById('stat-total').textContent = '-';
    document.getElementById('stat-recent').textContent = '-';
    document.getElementById('refresh-icon').style.animation = 'spin 1s linear infinite';

    // Reset ARS grid
    ARS_LIST.forEach(ars => {
        const el = document.getElementById(`ars-${ars.id}`);
        if (el) {
            el.dataset.status = 'loading';
            el.classList.add('loading');
            el.querySelector('.status-icon').textContent = '⏳';
            el.querySelector('.ars-count').style.display = 'none';
        }
    });

    let completedCount = 0;

    // Fetch tous les flux en parallèle
    const promises = ARS_LIST.map(async (ars) => {
        try {
            const items = await fetchARSFeed(ars);
            state.arsStatus[ars.id] = { success: true, count: items.length };
            state.results.push(...items);

            // Mettre à jour l'UI pour cette ARS
            updateARSStatus(ars.id, 'success', items.length);
        } catch (error) {
            console.error(`Erreur ARS ${ars.name}:`, error);
            state.arsStatus[ars.id] = { success: false, error: error.message };
            updateARSStatus(ars.id, 'error', 0);
        }

        completedCount++;
        document.getElementById('loading-detail').textContent =
            `${completedCount}/${ARS_LIST.length} ARS scannées...`;
        document.getElementById('stat-ars').textContent = completedCount;
    });

    await Promise.all(promises);

    // Finaliser
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('refresh-icon').style.animation = '';

    const successCount = Object.values(state.arsStatus).filter(s => s.success).length;
    if (successCount === ARS_LIST.length) {
        document.getElementById('status-dot').className = 'status-dot success';
        document.getElementById('status-text').textContent = 'Scan terminé';
    } else if (successCount > 0) {
        document.getElementById('status-dot').className = 'status-dot success';
        document.getElementById('status-text').textContent = `${successCount}/${ARS_LIST.length} ARS`;
    } else {
        document.getElementById('status-dot').className = 'status-dot error';
        document.getElementById('status-text').textContent = 'Erreur';
    }

    // Filtrer et afficher
    applyFilters();
    showToast(`${state.results.length} appels à projets trouvés`);
}

function updateARSStatus(arsId, status, count) {
    const el = document.getElementById(`ars-${arsId}`);
    if (!el) return;

    el.classList.remove('loading');
    el.dataset.status = status;

    if (status === 'success') {
        el.querySelector('.status-icon').textContent = '✅';
        const countEl = el.querySelector('.ars-count');
        countEl.textContent = count;
        countEl.style.display = count > 0 ? 'inline' : 'none';
    } else {
        el.querySelector('.status-icon').textContent = '❌';
        el.classList.add('error');
    }
}

async function fetchARSFeed(ars) {
    const baseUrl = ars.isNational
        ? 'https://www.ars.sante.fr'
        : `https://www.${ars.id}.ars.sante.fr`;

    const feedUrl = `${baseUrl}/rss.xml?type=ars_appel_projet_ou_candidature`;

    // Essayer les différents proxies CORS
    let lastError;
    for (let i = 0; i < CORS_PROXIES.length; i++) {
        const proxyIndex = (state.currentProxy + i) % CORS_PROXIES.length;
        const proxy = CORS_PROXIES[proxyIndex];

        try {
            const response = await fetch(proxy + encodeURIComponent(feedUrl), {
                signal: AbortSignal.timeout(15000)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const text = await response.text();
            const items = parseRSSFeed(text, ars);

            // Ce proxy fonctionne, le mémoriser
            state.currentProxy = proxyIndex;
            return items;
        } catch (error) {
            lastError = error;
            continue;
        }
    }

    throw lastError || new Error('Tous les proxies ont échoué');
}

function parseRSSFeed(xmlText, ars) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
        throw new Error('XML invalide');
    }

    const items = [];
    const itemElements = doc.querySelectorAll('item');

    itemElements.forEach(item => {
        const title = item.querySelector('title')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';

        // Vérifier si le contenu correspond aux mots-clés
        const fullText = `${title} ${description}`.toLowerCase();
        const matchedKeywords = state.keywords.filter(kw =>
            fullText.includes(kw.toLowerCase())
        );

        items.push({
            title: cleanText(title),
            link,
            description: cleanText(description),
            pubDate: pubDate ? new Date(pubDate) : null,
            ars: ars,
            matchedKeywords,
            isRelevant: matchedKeywords.length > 0
        });
    });

    return items;
}

function cleanText(text) {
    return text
        .replace(/<[^>]*>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

function applyFilters() {
    const period = document.getElementById('filter-period').value;
    const region = document.getElementById('filter-region').value;
    const status = document.getElementById('filter-status').value;
    const search = document.getElementById('search').value.toLowerCase();
    const sortBy = document.getElementById('sort-by').value;

    const now = new Date();
    const periodDays = {
        'week': 7,
        'month': 30,
        'quarter': 90,
        'all': Infinity
    };

    let filtered = state.results.filter(item => {
        // Filtre période
        if (period !== 'all' && item.pubDate) {
            const daysDiff = (now - item.pubDate) / (1000 * 60 * 60 * 24);
            if (daysDiff > periodDays[period]) return false;
        }

        // Filtre région
        if (region !== 'all' && item.ars.id !== region) return false;

        // Filtre recherche
        if (search) {
            const searchText = `${item.title} ${item.description}`.toLowerCase();
            if (!searchText.includes(search)) return false;
        }

        return true;
    });

    // Tri
    filtered.sort((a, b) => {
        if (sortBy === 'date-desc') {
            return (b.pubDate || 0) - (a.pubDate || 0);
        } else if (sortBy === 'date-asc') {
            return (a.pubDate || 0) - (b.pubDate || 0);
        } else if (sortBy === 'region') {
            return a.ars.name.localeCompare(b.ars.name);
        }
        return 0;
    });

    state.filteredResults = filtered;
    renderResults();

    // Stats
    document.getElementById('stat-total').textContent = filtered.length;

    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const recentCount = state.results.filter(item =>
        item.pubDate && item.pubDate > weekAgo
    ).length;
    document.getElementById('stat-recent').textContent = recentCount;
}

function renderResults() {
    const container = document.getElementById('results-list');
    const loadingState = document.getElementById('loading-state');

    if (state.filteredResults.length === 0) {
        loadingState.style.display = 'none';
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">🔍</div>
                <h3>Aucun résultat</h3>
                <p>Essayez de modifier vos filtres ou d'ajouter des mots-clés</p>
            </div>
        `;
        return;
    }

    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    container.innerHTML = state.filteredResults.map(item => {
        const isNew = item.pubDate && item.pubDate > weekAgo;
        const dateStr = item.pubDate
            ? item.pubDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Date inconnue';

        // Surligner les mots-clés dans le titre et la description
        let highlightedTitle = item.title;
        let highlightedDesc = item.description.slice(0, 200);

        if (item.matchedKeywords.length > 0) {
            item.matchedKeywords.forEach(kw => {
                const regex = new RegExp(`(${escapeRegex(kw)})`, 'gi');
                highlightedTitle = highlightedTitle.replace(regex, '<mark>$1</mark>');
                highlightedDesc = highlightedDesc.replace(regex, '<mark>$1</mark>');
            });
        }

        return `
            <div class="result-item" data-relevant="${item.isRelevant}">
                <div class="result-header">
                    <a href="${item.link}" target="_blank" rel="noopener" class="result-title">
                        ${highlightedTitle}
                    </a>
                    <div class="result-badges">
                        <span class="badge badge-region">${item.ars.name}</span>
                        ${isNew ? '<span class="badge badge-new">Nouveau</span>' : ''}
                    </div>
                </div>
                <p class="result-excerpt">${highlightedDesc}${item.description.length > 200 ? '...' : ''}</p>
                <div class="result-meta">
                    <span>📅 ${dateStr}</span>
                    ${item.matchedKeywords.length > 0
                        ? `<span>🏷️ ${item.matchedKeywords.join(', ')}</span>`
                        : '<span>📋 Tous appels</span>'}
                    <span><a href="${item.link}" target="_blank" rel="noopener">🔗 Voir l'appel</a></span>
                </div>
            </div>
        `;
    }).join('');
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Gestion des mots-clés
function showAddKeywordModal() {
    document.getElementById('keyword-modal').classList.add('active');
    document.getElementById('new-keyword').focus();
}

function closeKeywordModal() {
    document.getElementById('keyword-modal').classList.remove('active');
    document.getElementById('new-keyword').value = '';
}

function addKeyword(event) {
    event.preventDefault();
    const input = document.getElementById('new-keyword');
    const keyword = input.value.trim().toLowerCase();

    if (keyword && !state.keywords.includes(keyword)) {
        state.keywords.push(keyword);
        localStorage.setItem('veille-keywords', JSON.stringify(state.keywords));
        renderKeywords();
        closeKeywordModal();
        showToast(`Mot-clé "${keyword}" ajouté`);

        // Re-analyser les résultats existants
        reanalyzeResults();
    }
}

function removeKeyword(index) {
    const removed = state.keywords.splice(index, 1)[0];
    localStorage.setItem('veille-keywords', JSON.stringify(state.keywords));
    renderKeywords();
    showToast(`Mot-clé "${removed}" supprimé`);
    reanalyzeResults();
}

function reanalyzeResults() {
    // Ré-analyser les résultats avec les nouveaux mots-clés
    state.results.forEach(item => {
        const fullText = `${item.title} ${item.description}`.toLowerCase();
        item.matchedKeywords = state.keywords.filter(kw =>
            fullText.includes(kw.toLowerCase())
        );
        item.isRelevant = item.matchedKeywords.length > 0;
    });
    applyFilters();
}

// Export
function exportResults() {
    if (state.filteredResults.length === 0) {
        showToast('Aucun résultat à exporter');
        return;
    }

    let csv = 'Titre,Région,Date,Mots-clés,Lien\n';
    state.filteredResults.forEach(item => {
        const date = item.pubDate
            ? item.pubDate.toLocaleDateString('fr-FR')
            : '';
        csv += `"${item.title.replace(/"/g, '""')}","${item.ars.name}","${date}","${item.matchedKeywords.join('; ')}","${item.link}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `veille-soins-palliatifs-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    showToast('Export CSV téléchargé');
}

// Dark mode
function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.body.setAttribute('data-theme', state.darkMode ? 'dark' : '');
    document.getElementById('dark-mode-icon').textContent = state.darkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', state.darkMode);
}

// Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Fermer modals avec Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeKeywordModal();
        closeAuthModal();
    }
});

// Fermer modal en cliquant à l'extérieur
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});
