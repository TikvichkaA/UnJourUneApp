// État de l'application
let currentUser = null;
let currentUserId = null; // Ajout de l'ID utilisateur
let users = [];
let usersMap = {}; // Map pour retrouver les noms depuis les IDs
let predictions = [];
let resolutions = []; // Bonnes résolutions
let currentCategory = 'all';
let currentGroup = null;

// Date limite pour voter (31 janvier 2026 à 23:59:59)
const VOTE_DEADLINE = new Date('2026-01-31T23:59:59');

// Récupérer le groupe depuis l'URL
function getGroupFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('group');
}

// Collections Firestore (avec préfixe groupe si défini)
function getCollection(name) {
    if (currentGroup) {
        return db.collection('groups').doc(currentGroup).collection(name);
    }
    return db.collection(name);
}

// Catégories disponibles
const CATEGORIES = {
    politique: { label: 'Politique', emoji: '🏛️' },
    sport: { label: 'Sport', emoji: '⚽' },
    tech: { label: 'Tech', emoji: '💻' },
    perso: { label: 'Perso', emoji: '👥' },
    autre: { label: 'Autre', emoji: '🔮' }
};

// Éléments DOM
const userSelectionScreen = document.getElementById('user-selection');
const predictionsScreen = document.getElementById('predictions-screen');
const userListEl = document.getElementById('user-list');
const newUserNameInput = document.getElementById('new-user-name');
const addUserBtn = document.getElementById('add-user-btn');
const currentUserNameEl = document.getElementById('current-user-name');
const changeUserBtn = document.getElementById('change-user-btn');
const predictionsListEl = document.getElementById('predictions-list');
const resultsListEl = document.getElementById('results-list');
const noPredictionsEl = document.getElementById('no-predictions');
const newPredictionText = document.getElementById('new-prediction-text');
const newPredictionCategory = document.getElementById('new-prediction-category');
const addPredictionBtn = document.getElementById('add-prediction-btn');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const categoryBtns = document.querySelectorAll('.category-btn');
const resolutionsListEl = document.getElementById('resolutions-list');
const newResolutionText = document.getElementById('new-resolution-text');
const addResolutionBtn = document.getElementById('add-resolution-btn');

// Initialisation
document.addEventListener('DOMContentLoaded', init);

async function init() {
    // Récupérer le groupe depuis l'URL
    currentGroup = getGroupFromURL();

    // Afficher le nom du groupe dans le header
    if (currentGroup) {
        // Mettre en majuscule la première lettre
        const groupName = currentGroup.charAt(0).toUpperCase() + currentGroup.slice(1);
        document.querySelector('header h1').textContent = `🔮 ${groupName} edition`;
        document.querySelector('.subtitle').textContent = `Prédictions 2026`;
    }

    // Récupérer l'utilisateur sauvegardé (par groupe)
    const storageKey = currentGroup ? `currentUser_${currentGroup}` : 'currentUser';
    const storageKeyId = currentGroup ? `currentUserId_${currentGroup}` : 'currentUserId';
    const savedUser = localStorage.getItem(storageKey);
    const savedUserId = localStorage.getItem(storageKeyId);
    if (savedUser && savedUserId) {
        currentUser = savedUser;
        currentUserId = savedUserId;
    }

    await loadUsers();
    await loadPredictions();
    await loadResolutions();
    setupEventListeners();

    if (currentUser && currentUserId && users.includes(currentUser)) {
        showPredictionsScreen();
    } else {
        showUserSelection();
    }
}

function setupEventListeners() {
    addUserBtn.addEventListener('click', addNewUser);
    newUserNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewUser();
    });

    changeUserBtn.addEventListener('click', () => {
        currentUser = null;
        currentUserId = null;
        const storageKey = currentGroup ? `currentUser_${currentGroup}` : 'currentUser';
        const storageKeyId = currentGroup ? `currentUserId_${currentGroup}` : 'currentUserId';
        localStorage.removeItem(storageKey);
        localStorage.removeItem(storageKeyId);
        showUserSelection();
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Filtres de catégorie
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderPredictions();
        });
    });

    addPredictionBtn.addEventListener('click', addNewPrediction);

    // Résolutions
    addResolutionBtn.addEventListener('click', addNewResolution);
    newResolutionText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewResolution();
    });
}

// === GESTION DES UTILISATEURS ===

async function loadUsers() {
    try {
        const snapshot = await getCollection('users').orderBy('name').get();
        users = snapshot.docs.map(doc => doc.data().name);
        // Créer une map ID -> nom pour retrouver les noms depuis les IDs
        usersMap = {};
        snapshot.docs.forEach(doc => {
            usersMap[doc.id] = doc.data().name;
        });
        renderUserList();
    } catch (error) {
        console.error('Erreur chargement utilisateurs:', error);
        users = [];
        usersMap = {};
    }
}

function renderUserList() {
    const snapshot = getCollection('users').orderBy('name').get();
    snapshot.then(snap => {
        userListEl.innerHTML = snap.docs.map(doc => `
            <button class="user-btn" data-id="${doc.id}" data-name="${doc.data().name}">${doc.data().name}</button>
        `).join('');

        userListEl.querySelectorAll('.user-btn').forEach(btn => {
            btn.addEventListener('click', () => selectUser(btn.dataset.id, btn.dataset.name));
        });
    });
}

function selectUser(userId, name) {
    currentUser = name;
    currentUserId = userId;
    const storageKey = currentGroup ? `currentUser_${currentGroup}` : 'currentUser';
    const storageKeyId = currentGroup ? `currentUserId_${currentGroup}` : 'currentUserId';
    localStorage.setItem(storageKey, name);
    localStorage.setItem(storageKeyId, userId);
    showPredictionsScreen();
    // Animation mascotte: joie à la connexion
    if (typeof OracleMascot !== 'undefined') {
        OracleMascot.onUserLogin();
    }
}

async function addNewUser() {
    const name = newUserNameInput.value.trim();
    if (!name) return;

    if (users.includes(name)) {
        alert('Ce prénom existe déjà !');
        return;
    }

    try {
        const docRef = await getCollection('users').add({ name, createdAt: new Date() });
        users.push(name);
        usersMap[docRef.id] = name;
        renderUserList();
        newUserNameInput.value = '';
        selectUser(docRef.id, name);
    } catch (error) {
        console.error('Erreur ajout utilisateur:', error);
        alert('Erreur lors de l\'ajout. Vérifie ta connexion.');
    }
}

// === GESTION DES ÉCRANS ===

function showUserSelection() {
    userSelectionScreen.classList.remove('hidden');
    predictionsScreen.classList.add('hidden');
}

function showPredictionsScreen() {
    userSelectionScreen.classList.add('hidden');
    predictionsScreen.classList.remove('hidden');
    currentUserNameEl.textContent = currentUser;
    renderPredictions();
    renderResults();
}

function switchTab(tabName) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    tabContents.forEach(tc => {
        tc.classList.toggle('active', tc.id === `tab-${tabName}`);
        tc.classList.toggle('hidden', tc.id !== `tab-${tabName}`);
    });

    if (tabName === 'results') {
        renderResults();
    }
    if (tabName === 'resolutions') {
        renderResolutions();
    }

    // Animation mascotte selon l'onglet
    if (typeof OracleMascot !== 'undefined') {
        if (tabName === 'market') {
            OracleMascot.onMarketView();
        } else {
            OracleMascot.setIdle();
        }
    }
}

// === GESTION DES PRÉDICTIONS ===

async function loadPredictions() {
    try {
        const snapshot = await getCollection('predictions').orderBy('createdAt', 'desc').get();
        predictions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        renderPredictions();
        renderResults();
    } catch (error) {
        console.error('Erreur chargement prédictions:', error);
        predictions = [];
    }

    getCollection('predictions').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        predictions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        renderPredictions();
        renderResults();
    });
}

// Filtrer et trier les prédictions
function getFilteredSortedPredictions() {
    let filtered = predictions;

    // Filtrer par catégorie
    if (currentCategory !== 'all') {
        filtered = predictions.filter(p => p.category === currentCategory);
    }

    // Trier : non-répondues en premier (en utilisant l'ID utilisateur)
    return [...filtered].sort((a, b) => {
        const aAnswered = a.votes && a.votes[currentUserId] !== undefined;
        const bAnswered = b.votes && b.votes[currentUserId] !== undefined;
        if (aAnswered === bAnswered) return 0;
        return aAnswered ? 1 : -1;
    });
}

// Extraire vote et confiance d'un vote
function parseVote(voteData) {
    if (voteData === undefined || voteData === null) return null;
    if (typeof voteData === 'boolean') {
        return { vote: voteData, confidence: null };
    }
    if (typeof voteData === 'object') {
        return { vote: voteData.vote, confidence: voteData.confidence || null };
    }
    return null;
}

function getCategoryBadge(category) {
    const cat = CATEGORIES[category] || CATEGORIES.autre;
    return `<span class="category-badge category-${category}">${cat.emoji} ${cat.label}</span>`;
}

function getResolutionBadge(resolution) {
    if (resolution === 'realized') {
        return '<span class="resolution-badge realized">✓ Réalisée</span>';
    } else if (resolution === 'not-realized') {
        return '<span class="resolution-badge not-realized">✗ Non réalisée</span>';
    }
    return '<span class="resolution-badge pending">⏳ En attente</span>';
}

function renderPredictions() {
    const sorted = getFilteredSortedPredictions();

    if (sorted.length === 0) {
        predictionsListEl.innerHTML = '';
        noPredictionsEl.classList.remove('hidden');
        noPredictionsEl.textContent = currentCategory === 'all'
            ? 'Aucune prédiction pour le moment. Ajoute-en une !'
            : 'Aucune prédiction dans cette catégorie.';
        return;
    }

    noPredictionsEl.classList.add('hidden');

    // Compter les non-répondues (en utilisant l'ID utilisateur)
    const unanswered = sorted.filter(p => !p.votes || p.votes[currentUserId] === undefined).length;

    let html = '';
    if (unanswered > 0) {
        html += `<div class="unanswered-banner">${unanswered} prédiction${unanswered > 1 ? 's' : ''} en attente de ta réponse</div>`;
    }

    html += sorted.map(pred => {
        const userVoteData = parseVote(pred.votes?.[currentUserId]);
        const hasVoted = userVoteData !== null;
        const userVote = userVoteData?.vote;
        const userConfidence = userVoteData?.confidence;

        const yesSelected = userVote === true ? 'selected' : '';
        const noSelected = userVote === false ? 'selected' : '';
        const notAnsweredClass = !hasVoted ? 'not-answered' : '';
        const resolvedClass = pred.resolution ? 'resolved' : '';
        const votingClosed = !isVotingOpen();
        const disabledClass = votingClosed ? 'disabled' : '';

        return `
            <div class="prediction-card ${notAnsweredClass} ${resolvedClass}" data-id="${pred.id}">
                <div class="prediction-header">
                    ${getCategoryBadge(pred.category || 'autre')}
                    ${getResolutionBadge(pred.resolution)}
                </div>
                <p class="prediction-text">${escapeHtml(pred.text)}</p>
                <p class="prediction-meta">Ajoutée par ${escapeHtml(pred.author)}</p>
                <div class="vote-section">
                    <div class="vote-buttons">
                        <button class="vote-btn yes ${yesSelected} ${disabledClass}" data-vote="true" ${votingClosed ? 'disabled' : ''}>Oui</button>
                        <button class="vote-btn no ${noSelected} ${disabledClass}" data-vote="false" ${votingClosed ? 'disabled' : ''}>Non</button>
                    </div>
                    <div class="confidence-section ${hasVoted ? 'visible' : ''}">
                        <span class="confidence-label">Confiance :</span>
                        <div class="confidence-stars" data-confidence="${userConfidence || 0}">
                            ${[1,2,3,4,5].map(n => `
                                <span class="star ${userConfidence >= n ? 'filled' : ''}" data-value="${n}">★</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    predictionsListEl.innerHTML = html;

    // Events pour les votes
    predictionsListEl.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const card = e.target.closest('.prediction-card');
            const predId = card.dataset.id;
            const vote = e.target.dataset.vote === 'true';
            await submitVote(predId, vote, null);
            card.querySelector('.confidence-section').classList.add('visible');
        });
    });

    // Events pour les étoiles de confiance
    predictionsListEl.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', async (e) => {
            const card = e.target.closest('.prediction-card');
            const predId = card.dataset.id;
            const confidence = parseInt(e.target.dataset.value);
            const pred = predictions.find(p => p.id === predId);
            const currentVoteData = parseVote(pred?.votes?.[currentUserId]);
            if (currentVoteData) {
                await submitVote(predId, currentVoteData.vote, confidence);
            }
        });
    });
}

// === CALCUL DES SCORES ===

function calculateScores() {
    const userScores = {};

    // Initialiser les scores pour les utilisateurs du groupe actuel uniquement
    users.forEach(u => {
        userScores[u] = { points: 0, correct: 0, total: 0 };
    });

    // Calculer les points pour chaque prédiction résolue
    predictions.forEach(pred => {
        if (!pred.resolution) return; // Ignorer les non-résolues

        const isRealized = pred.resolution === 'realized';
        const votes = pred.votes || {};

        for (const [voter, voteData] of Object.entries(votes)) {
            // Convertir l'ID en nom
            const voterName = usersMap[voter] || voter;
            // Ignorer les votes des utilisateurs qui ne sont pas dans le groupe actuel
            if (!users.includes(voterName)) continue;
            
            if (!userScores[voterName]) {
                userScores[voterName] = { points: 0, correct: 0, total: 0 };
            }

            const parsed = parseVote(voteData);
            if (!parsed) continue;

            const votedYes = parsed.vote === true;
            const confidence = parsed.confidence || 0;
            const isCorrect = (votedYes && isRealized) || (!votedYes && !isRealized);

            userScores[voterName].total++;

            if (isCorrect) {
                // Vote correct: +1 point de base + 0.2 par étoile de confiance
                userScores[voterName].correct++;
                userScores[voterName].points += 1 + (confidence * 0.2);
            } else {
                // Vote incorrect: -0.1 par étoile de confiance
                userScores[voterName].points -= confidence * 0.1;
            }
        }
    });

    // Convertir en tableau et trier par points
    const scoresArray = Object.entries(userScores)
        .filter(([name, data]) => data.total > 0) // Seulement ceux qui ont voté sur des résolues
        .map(([name, data]) => ({
            name,
            points: Math.round(data.points * 10) / 10, // Arrondir à 1 décimale
            correct: data.correct,
            total: data.total,
            percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
        }))
        .sort((a, b) => b.points - a.points); // Trier par points décroissants

    return scoresArray;
}

function renderResults() {
    if (predictions.length === 0) {
        resultsListEl.innerHTML = '<p class="empty-message">Aucune prédiction pour le moment.</p>';
        return;
    }

    // Dashboard stats
    const totalPredictions = predictions.length;
    const totalVotes = predictions.reduce((sum, p) => sum + Object.keys(p.votes || {}).length, 0);
    const resolved = predictions.filter(p => p.resolution).length;
    const realized = predictions.filter(p => p.resolution === 'realized').length;

    // Votes par utilisateur (seulement les utilisateurs du groupe)
    const votesByUser = {};
    users.forEach(u => votesByUser[u] = 0);
    predictions.forEach(p => {
        Object.keys(p.votes || {}).forEach(voterId => {
            // Convertir l'ID en nom
            const voterName = usersMap[voterId] || voterId;
            // Compter seulement les votes des utilisateurs du groupe actuel
            if (users.includes(voterName)) {
                votesByUser[voterName] = (votesByUser[voterName] || 0) + 1;
            }
        });
    });

    // === CALCUL DES SCORES ===
    const scores = calculateScores();

    // Stats par catégorie
    const byCategory = {};
    Object.keys(CATEGORIES).forEach(cat => {
        byCategory[cat] = predictions.filter(p => (p.category || 'autre') === cat).length;
    });

    let html = `
        <div class="dashboard-stats">
            <div class="stat-card">
                <div class="stat-number">${totalPredictions}</div>
                <div class="stat-label">Prédictions</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${resolved}</div>
                <div class="stat-label">Résolues</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${realized}</div>
                <div class="stat-label">Réalisées</div>
            </div>
        </div>

        ${resolved > 0 ? `
        <div class="leaderboard-section">
            <h3>🏆 Classement</h3>
            <div class="leaderboard">
                ${scores.map((s, i) => {
                    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
                    const pointsClass = s.points >= 0 ? 'positive' : 'negative';
                    return `
                        <div class="leaderboard-row ${i < 3 ? 'top-3' : ''}">
                            <span class="leaderboard-rank">${medal || (i + 1)}</span>
                            <span class="leaderboard-name">${escapeHtml(s.name)}</span>
                            <span class="leaderboard-stats">
                                <span class="leaderboard-correct">${s.correct}/${s.total} correct</span>
                                <span class="leaderboard-pct">(${s.percentage}%)</span>
                            </span>
                            <span class="leaderboard-points ${pointsClass}">${s.points > 0 ? '+' : ''}${s.points} pts</span>
                        </div>
                    `;
                }).join('')}
            </div>
            <p class="leaderboard-hint">Points = +1 si correct, +0.2/★ bonus si correct, -0.1/★ malus si faux</p>
        </div>
        ` : '<div class="leaderboard-section"><h3>🏆 Classement</h3><p class="empty-message">Résous des prédictions pour voir le classement !</p></div>'}

        <div class="category-stats">
            <h3>Par catégorie</h3>
            <div class="category-bars">
                ${Object.entries(byCategory).map(([cat, count]) => `
                    <div class="category-stat-row">
                        <span class="category-stat-label">${CATEGORIES[cat].emoji} ${CATEGORIES[cat].label}</span>
                        <span class="category-stat-count">${count}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="participation-section">
            <h3>Participation</h3>
            <div class="participation-bars">
                ${users.map(u => {
                    const pct = Math.round((votesByUser[u] / totalPredictions) * 100);
                    return `
                        <div class="participation-row">
                            <span class="participant-name">${escapeHtml(u)}</span>
                            <div class="participation-bar-bg">
                                <div class="participation-bar-fill" style="width: ${pct}%"></div>
                            </div>
                            <span class="participation-pct">${pct}%</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>

        <h3>Détail des prédictions</h3>
    `;

    html += predictions.map(pred => {
        const votes = pred.votes || {};
        const yesVoters = [];
        const noVoters = [];

        for (const [voter, voteData] of Object.entries(votes)) {
            // Afficher seulement les votes des utilisateurs du groupe actuel
            // Convertir l'ID en nom
            const voterName = usersMap[voter] || voter; // Fallback au nom si pas dans la map
            if (!users.includes(voterName)) continue;
            
            const parsed = parseVote(voteData);
            if (!parsed) continue;

            const confidenceStars = parsed.confidence
                ? ` <span class="mini-stars">${'★'.repeat(parsed.confidence)}${'☆'.repeat(5-parsed.confidence)}</span>`
                : '';

            if (parsed.vote === true) {
                yesVoters.push({ name: voterName, confidence: parsed.confidence, display: voterName + confidenceStars });
            } else if (parsed.vote === false) {
                noVoters.push({ name: voterName, confidence: parsed.confidence, display: voterName + confidenceStars });
            }
        }

        const total = yesVoters.length + noVoters.length;
        const yesPercent = total > 0 ? Math.round((yesVoters.length / total) * 100) : 50;
        const noPercent = 100 - yesPercent;

        // Confiance moyenne par côté
        const yesConfidences = yesVoters.filter(v => v.confidence).map(v => v.confidence);
        const noConfidences = noVoters.filter(v => v.confidence).map(v => v.confidence);
        const yesAvgConf = yesConfidences.length > 0
            ? (yesConfidences.reduce((a,b) => a+b, 0) / yesConfidences.length).toFixed(1)
            : null;
        const noAvgConf = noConfidences.length > 0
            ? (noConfidences.reduce((a,b) => a+b, 0) / noConfidences.length).toFixed(1)
            : null;

        const yesConfDisplay = yesAvgConf ? ` (${yesAvgConf}★)` : '';
        const noConfDisplay = noAvgConf ? ` (${noAvgConf}★)` : '';

        // Classe selon résolution
        const resolutionClass = pred.resolution ? `resolution-${pred.resolution}` : '';

        return `
            <div class="prediction-card result-card ${resolutionClass}" data-id="${pred.id}">
                <div class="prediction-header">
                    ${getCategoryBadge(pred.category || 'autre')}
                    ${getResolutionBadge(pred.resolution)}
                </div>
                <p class="prediction-text">${escapeHtml(pred.text)}</p>
                <div class="results-bar">
                    <div class="results-yes" style="width: ${yesPercent}%">
                        ${yesVoters.length > 0 ? `Oui ${yesPercent}%${yesConfDisplay}` : ''}
                    </div>
                    <div class="results-no" style="width: ${noPercent}%">
                        ${noVoters.length > 0 ? `Non ${noPercent}%${noConfDisplay}` : ''}
                    </div>
                </div>
                <div class="results-details">
                    ${yesVoters.length > 0 ? `
                        <div class="voters-row yes">
                            <span class="vote-label">Oui :</span>
                            ${yesVoters.map(v => `<span class="voter-name">${v.display}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${noVoters.length > 0 ? `
                        <div class="voters-row no">
                            <span class="vote-label">Non :</span>
                            ${noVoters.map(v => `<span class="voter-name">${v.display}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${total === 0 ? '<div class="no-votes">Aucun vote pour le moment</div>' : ''}
                </div>
                ${!pred.resolution ? `
                    <div class="resolution-buttons">
                        <span class="resolution-label">Résoudre :</span>
                        <button class="resolve-btn realized" data-resolution="realized">✓ Réalisée</button>
                        <button class="resolve-btn not-realized" data-resolution="not-realized">✗ Non réalisée</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    resultsListEl.innerHTML = html;

    // Events pour les boutons de résolution
    resultsListEl.querySelectorAll('.resolve-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const card = e.target.closest('.prediction-card');
            const predId = card.dataset.id;
            const resolution = e.target.dataset.resolution;
            await resolvePrediction(predId, resolution);
        });
    });
}

async function submitVote(predictionId, vote, confidence) {
    if (!isVotingOpen()) {
        alert('Les votes sont fermés depuis le 31 janvier !');
        return;
    }

    try {
        const voteData = confidence !== null
            ? { vote, confidence }
            : vote;

        // Utiliser l'ID utilisateur au lieu du nom
        await getCollection('predictions').doc(predictionId).update({
            [`votes.${currentUserId}`]: voteData
        });
        // Animation mascotte: prédiction lors du vote
        if (typeof OracleMascot !== 'undefined') {
            OracleMascot.onVote();
        }
    } catch (error) {
        console.error('Erreur vote:', error);
        alert('Erreur lors du vote. Réessaie.');
    }
}

async function resolvePrediction(predictionId, resolution) {
    try {
        await getCollection('predictions').doc(predictionId).update({
            resolution: resolution,
            resolvedAt: new Date(),
            resolvedBy: currentUser
        });
    } catch (error) {
        console.error('Erreur résolution:', error);
        alert('Erreur lors de la résolution. Réessaie.');
    }
}

async function addNewPrediction() {
    if (!isVotingOpen()) {
        alert('Les votes sont fermés depuis le 31 janvier ! Tu ne peux plus ajouter de prédictions.');
        return;
    }

    const text = newPredictionText.value.trim();
    const category = newPredictionCategory.value;

    if (!text) {
        alert('Écris une prédiction !');
        return;
    }

    try {
        await getCollection('predictions').add({
            text,
            author: currentUser,
            category: category,
            votes: {},
            resolution: null,
            createdAt: new Date()
        });
        newPredictionText.value = '';
        // Animation mascotte: joie lors de l'ajout d'une prédiction
        if (typeof OracleMascot !== 'undefined') {
            OracleMascot.onPredictionAdded();
        }
        switchTab('vote');
    } catch (error) {
        console.error('Erreur ajout prédiction:', error);
        alert('Erreur lors de l\'ajout. Réessaie.');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// === GESTION DES RÉSOLUTIONS ===

async function loadResolutions() {
    try {
        const snapshot = await getCollection('resolutions').orderBy('createdAt', 'desc').get();
        resolutions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        renderResolutions();
    } catch (error) {
        console.error('Erreur chargement résolutions:', error);
        resolutions = [];
    }

    // Écoute en temps réel
    getCollection('resolutions').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        resolutions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        renderResolutions();
    });
}

function renderResolutions() {
    if (!resolutionsListEl) return;

    if (resolutions.length === 0) {
        resolutionsListEl.innerHTML = '<p class="empty-message">Aucune résolution pour le moment. Sois le premier à en ajouter !</p>';
        return;
    }

    // Grouper les résolutions par utilisateur
    const byUser = {};
    resolutions.forEach(r => {
        const userName = r.authorName || 'Anonyme';
        if (!byUser[userName]) {
            byUser[userName] = [];
        }
        byUser[userName].push(r);
    });

    // Trier pour que l'utilisateur actuel soit en premier
    const sortedUsers = Object.keys(byUser).sort((a, b) => {
        if (a === currentUser) return -1;
        if (b === currentUser) return 1;
        return a.localeCompare(b);
    });

    let html = '';

    sortedUsers.forEach(userName => {
        const userResolutions = byUser[userName];
        const isCurrentUser = userName === currentUser;
        const userClass = isCurrentUser ? 'current-user' : '';

        html += `
            <div class="user-resolutions ${userClass}">
                <div class="user-resolutions-header">
                    <span class="user-resolutions-name">${escapeHtml(userName)}</span>
                    <span class="user-resolutions-count">${userResolutions.length} résolution${userResolutions.length > 1 ? 's' : ''}</span>
                </div>
                <ul class="resolutions-items">
                    ${userResolutions.map(r => `
                        <li class="resolution-item ${r.completed ? 'completed' : ''}" data-id="${r.id}">
                            <span class="resolution-text">${escapeHtml(r.text)}</span>
                            ${isCurrentUser ? `
                                <div class="resolution-actions">
                                    <button class="resolution-toggle" title="${r.completed ? 'Marquer non tenue' : 'Marquer tenue'}">
                                        ${r.completed ? '✓' : '○'}
                                    </button>
                                    <button class="resolution-delete" title="Supprimer">×</button>
                                </div>
                            ` : `
                                ${r.completed ? '<span class="resolution-status">✓ Tenue</span>' : ''}
                            `}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    });

    resolutionsListEl.innerHTML = html;

    // Events pour les boutons de l'utilisateur actuel
    resolutionsListEl.querySelectorAll('.resolution-toggle').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const item = e.target.closest('.resolution-item');
            const resId = item.dataset.id;
            const resolution = resolutions.find(r => r.id === resId);
            if (resolution) {
                await toggleResolution(resId, !resolution.completed);
            }
        });
    });

    resolutionsListEl.querySelectorAll('.resolution-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const item = e.target.closest('.resolution-item');
            const resId = item.dataset.id;
            if (confirm('Supprimer cette résolution ?')) {
                await deleteResolution(resId);
            }
        });
    });
}

async function addNewResolution() {
    const text = newResolutionText.value.trim();

    if (!text) {
        alert('Écris une résolution !');
        return;
    }

    try {
        await getCollection('resolutions').add({
            text,
            authorId: currentUserId,
            authorName: currentUser,
            completed: false,
            createdAt: new Date()
        });
        newResolutionText.value = '';
    } catch (error) {
        console.error('Erreur ajout résolution:', error);
        alert('Erreur lors de l\'ajout. Réessaie.');
    }
}

async function toggleResolution(resolutionId, completed) {
    try {
        await getCollection('resolutions').doc(resolutionId).update({
            completed: completed
        });
    } catch (error) {
        console.error('Erreur mise à jour résolution:', error);
        alert('Erreur lors de la mise à jour. Réessaie.');
    }
}

async function deleteResolution(resolutionId) {
    try {
        await getCollection('resolutions').doc(resolutionId).delete();
    } catch (error) {
        console.error('Erreur suppression résolution:', error);
        alert('Erreur lors de la suppression. Réessaie.');
    }
}

// === GESTION DU COUNTDOWN ET BLOCAGE ===

function isVotingOpen() {
    return new Date() < VOTE_DEADLINE;
}

function updateCountdown() {
    const banner = document.getElementById('countdown-banner');
    const now = new Date();
    const diff = VOTE_DEADLINE - now;

    if (diff <= 0) {
        banner.innerHTML = '🔒 Les votes sont fermés depuis le 31 janvier';
        banner.className = 'countdown-banner closed';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let timeStr = '';
    if (days > 0) {
        timeStr = `${days}j ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        timeStr = `${hours}h ${minutes}m ${seconds}s`;
    } else {
        timeStr = `${minutes}m ${seconds}s`;
    }

    banner.innerHTML = `⏱️ <strong>${timeStr}</strong> avant la fin des votes`;
    banner.className = 'countdown-banner open';
}

// Mettre à jour le countdown toutes les secondes
setInterval(updateCountdown, 1000);
updateCountdown();

// ===========================================
// INTERFACE MARCHÉ / TRADING
// ===========================================

let marketSort = 'price';
let voteHistory = {}; // Historique des votes par prédiction

// Éléments DOM du marché
const marketListEl = document.getElementById('market-list');
const topMoversEl = document.getElementById('top-movers');
const marketIndexValueEl = document.getElementById('market-index-value');
const marketIndexChangeEl = document.getElementById('market-index-change');
const statTotalVolumeEl = document.getElementById('stat-total-volume');
const statAvgSentimentEl = document.getElementById('stat-avg-sentiment');
const statVolatilityEl = document.getElementById('stat-volatility');

// Charger l'historique des votes depuis Firebase
async function loadVoteHistory() {
    try {
        const snapshot = await getCollection('voteHistory').get();
        voteHistory = {};
        snapshot.docs.forEach(doc => {
            voteHistory[doc.id] = doc.data().history || [];
        });
    } catch (error) {
        console.error('Erreur chargement historique:', error);
        voteHistory = {};
    }
}

// Sauvegarder un snapshot de vote dans l'historique
async function saveVoteSnapshot(predictionId) {
    const pred = predictions.find(p => p.id === predictionId);
    if (!pred) return;

    const votes = pred.votes || {};
    let yesCount = 0;
    let totalCount = 0;

    for (const [voter, voteData] of Object.entries(votes)) {
        const voterName = usersMap[voter] || voter;
        if (!users.includes(voterName)) continue;

        const parsed = parseVote(voteData);
        if (parsed) {
            totalCount++;
            if (parsed.vote === true) yesCount++;
        }
    }

    const price = totalCount > 0 ? Math.round((yesCount / totalCount) * 100) : 50;
    const timestamp = Date.now();

    try {
        const historyRef = getCollection('voteHistory').doc(predictionId);
        const doc = await historyRef.get();

        let history = doc.exists ? (doc.data().history || []) : [];

        // Ajouter le nouveau point
        history.push({ price, timestamp, volume: totalCount });

        // Garder les 50 derniers points max
        if (history.length > 50) {
            history = history.slice(-50);
        }

        await historyRef.set({ history });
        voteHistory[predictionId] = history;
    } catch (error) {
        console.error('Erreur sauvegarde historique:', error);
    }
}

// Calculer les métriques de marché pour une prédiction
function calculateMarketMetrics(pred) {
    const votes = pred.votes || {};
    let yesCount = 0;
    let noCount = 0;
    let totalConfidence = 0;
    let confidenceCount = 0;

    for (const [voter, voteData] of Object.entries(votes)) {
        const voterName = usersMap[voter] || voter;
        if (!users.includes(voterName)) continue;

        const parsed = parseVote(voteData);
        if (parsed) {
            if (parsed.vote === true) yesCount++;
            else noCount++;

            if (parsed.confidence) {
                totalConfidence += parsed.confidence;
                confidenceCount++;
            }
        }
    }

    const totalVotes = yesCount + noCount;
    const price = totalVotes > 0 ? Math.round((yesCount / totalVotes) * 100) : 50;
    const avgConfidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0;

    // Calculer la variation depuis l'historique
    const history = voteHistory[pred.id] || [];
    let change = 0;
    let changePercent = 0;

    if (history.length >= 2) {
        const oldPrice = history[0].price;
        change = price - oldPrice;
        changePercent = oldPrice > 0 ? ((price - oldPrice) / oldPrice * 100) : 0;
    }

    // Calculer la volatilité (écart-type des prix)
    let volatility = 0;
    if (history.length >= 3) {
        const prices = history.map(h => h.price);
        const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
        const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
        volatility = Math.sqrt(variance);
    }

    // Tendance (bullish/bearish/neutral)
    let trend = 'neutral';
    if (history.length >= 2) {
        const recentPrices = history.slice(-5).map(h => h.price);
        const firstHalf = recentPrices.slice(0, Math.floor(recentPrices.length / 2));
        const secondHalf = recentPrices.slice(Math.floor(recentPrices.length / 2));
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length || 0;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length || 0;

        if (secondAvg > firstAvg + 3) trend = 'bullish';
        else if (secondAvg < firstAvg - 3) trend = 'bearish';
    }

    return {
        price,
        change,
        changePercent: Math.round(changePercent * 10) / 10,
        volume: totalVotes,
        sentiment: avgConfidence,
        volatility: Math.round(volatility * 10) / 10,
        trend,
        yesCount,
        noCount,
        history
    };
}

// Calculer l'indice global du marché
function calculateGlobalIndex() {
    if (predictions.length === 0) return { value: 0, change: 0 };

    let totalPrice = 0;
    let totalChange = 0;
    let count = 0;

    predictions.forEach(pred => {
        const metrics = calculateMarketMetrics(pred);
        if (metrics.volume > 0) {
            totalPrice += metrics.price;
            totalChange += metrics.changePercent;
            count++;
        }
    });

    const avgPrice = count > 0 ? totalPrice / count : 50;
    const avgChange = count > 0 ? totalChange / count : 0;

    // Convertir en indice style bourse (base 1000)
    const indexValue = Math.round(avgPrice * 10 + 500);

    return {
        value: indexValue,
        change: Math.round(avgChange * 10) / 10
    };
}

// Générer une sparkline SVG
function generateSparklineSVG(history, isPositive) {
    if (!history || history.length < 2) {
        return '<svg class="sparkline" viewBox="0 0 100 30"><line x1="0" y1="15" x2="100" y2="15" stroke="rgba(255,255,255,0.2)" stroke-width="1"/></svg>';
    }

    const prices = history.map(h => h.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;

    const width = 100;
    const height = 30;
    const padding = 2;

    const points = prices.map((price, i) => {
        const x = (i / (prices.length - 1)) * (width - padding * 2) + padding;
        const y = height - padding - ((price - min) / range) * (height - padding * 2);
        return `${x},${y}`;
    });

    const lineClass = isPositive ? 'positive' : 'negative';
    const pathD = `M ${points.join(' L ')}`;
    const areaD = `M ${padding},${height - padding} L ${points.join(' L ')} L ${width - padding},${height - padding} Z`;

    return `
        <svg class="sparkline" viewBox="0 0 ${width} ${height}">
            <path class="sparkline-area ${lineClass}" d="${areaD}"/>
            <path class="sparkline-line ${lineClass}" d="${pathD}"/>
        </svg>
    `;
}

// Générer l'indicateur de volatilité
function generateVolatilityIndicator(volatility) {
    const level = Math.min(5, Math.ceil(volatility / 5));
    let bars = '';
    for (let i = 1; i <= 5; i++) {
        const height = i * 3;
        const isActive = i <= level ? 'active' : '';
        bars += `<div class="volatility-bar ${isActive}" style="height: ${height}px"></div>`;
    }
    return `<div class="volatility-indicator">${bars}</div>`;
}

// Rendre l'interface marché
function renderMarket() {
    if (!marketListEl) return;

    // Calculer les métriques pour toutes les prédictions
    const marketData = predictions.map(pred => ({
        ...pred,
        metrics: calculateMarketMetrics(pred)
    }));

    // Calculer l'indice global
    const globalIndex = calculateGlobalIndex();

    // Mettre à jour l'en-tête
    if (marketIndexValueEl) {
        marketIndexValueEl.textContent = globalIndex.value.toFixed(2);
    }
    if (marketIndexChangeEl) {
        const changeClass = globalIndex.change > 0 ? 'positive' : globalIndex.change < 0 ? 'negative' : 'neutral';
        const changeSign = globalIndex.change > 0 ? '+' : '';
        marketIndexChangeEl.textContent = `${changeSign}${globalIndex.change}%`;
        marketIndexChangeEl.className = `index-change ${changeClass}`;
    }

    // Stats globales
    const totalVolume = marketData.reduce((sum, d) => sum + d.metrics.volume, 0);
    const avgSentiment = marketData.reduce((sum, d) => sum + d.metrics.sentiment, 0) / (marketData.length || 1);
    const avgVolatility = marketData.reduce((sum, d) => sum + d.metrics.volatility, 0) / (marketData.length || 1);

    if (statTotalVolumeEl) statTotalVolumeEl.textContent = totalVolume;
    if (statAvgSentimentEl) {
        const sentimentLabel = avgSentiment >= 3.5 ? 'Bullish' : avgSentiment >= 2.5 ? 'Neutre' : 'Bearish';
        statAvgSentimentEl.textContent = sentimentLabel;
    }
    if (statVolatilityEl) {
        const volLabel = avgVolatility >= 15 ? 'Haute' : avgVolatility >= 8 ? 'Moyenne' : 'Basse';
        statVolatilityEl.textContent = volLabel;
    }

    // Top Movers (plus grandes variations)
    const movers = [...marketData]
        .filter(d => d.metrics.volume > 0)
        .sort((a, b) => Math.abs(b.metrics.changePercent) - Math.abs(a.metrics.changePercent))
        .slice(0, 3);

    if (topMoversEl) {
        if (movers.length === 0) {
            topMoversEl.innerHTML = '<p class="market-empty">Pas encore assez de données</p>';
        } else {
            topMoversEl.innerHTML = movers.map((pred, i) => {
                const m = pred.metrics;
                const direction = m.changePercent >= 0 ? 'bullish' : 'bearish';
                const changeSign = m.changePercent >= 0 ? '+' : '';
                const changeClass = m.changePercent >= 0 ? 'positive' : 'negative';

                return `
                    <div class="mover-card ${direction}">
                        <span class="mover-rank">#${i + 1}</span>
                        <span class="mover-change ${changeClass}">${changeSign}${m.changePercent}%</span>
                        <span class="mover-text">${escapeHtml(pred.text)}</span>
                        <span class="mover-price">${m.price}</span>
                    </div>
                `;
            }).join('');
        }
    }

    // Trier selon le filtre actif
    const sortedData = [...marketData].sort((a, b) => {
        switch (marketSort) {
            case 'price':
                return b.metrics.price - a.metrics.price;
            case 'change':
                return Math.abs(b.metrics.changePercent) - Math.abs(a.metrics.changePercent);
            case 'volume':
                return b.metrics.volume - a.metrics.volume;
            case 'volatility':
                return b.metrics.volatility - a.metrics.volatility;
            default:
                return 0;
        }
    });

    // Liste principale
    if (marketListEl) {
        if (sortedData.length === 0) {
            marketListEl.innerHTML = `
                <div class="market-empty">
                    <div class="market-empty-icon">📊</div>
                    <p>Aucune prédiction pour le moment</p>
                </div>
            `;
        } else {
            marketListEl.innerHTML = sortedData.map(pred => {
                const m = pred.metrics;
                const changeClass = m.changePercent >= 0 ? 'positive' : 'negative';
                const changeSign = m.changePercent >= 0 ? '+' : '';
                const trendClass = m.trend;
                const cat = CATEGORIES[pred.category] || CATEGORIES.autre;
                const sparkline = generateSparklineSVG(m.history, m.changePercent >= 0);
                const volIndicator = generateVolatilityIndicator(m.volatility);

                return `
                    <div class="trading-card" data-id="${pred.id}">
                        <div class="trading-card-header">
                            <span class="trading-card-title">${escapeHtml(pred.text)}</span>
                            <span class="trading-card-category">${cat.emoji} ${cat.label}</span>
                        </div>
                        <div class="trading-card-metrics">
                            <div class="metric">
                                <span class="metric-value">${m.price}</span>
                                <span class="metric-label">Prix</span>
                            </div>
                            <div class="metric">
                                <span class="metric-value ${changeClass}">${changeSign}${m.changePercent}%</span>
                                <span class="metric-label">Variation</span>
                            </div>
                            <div class="metric">
                                <span class="metric-value">${m.volume}</span>
                                <span class="metric-label">Volume</span>
                            </div>
                            <div class="metric">
                                ${volIndicator}
                                <span class="metric-label">Volatilité</span>
                            </div>
                        </div>
                        <div class="sentiment-bar">
                            <div class="sentiment-fill ${trendClass}" style="width: ${m.price}%"></div>
                        </div>
                        <div class="trading-card-chart">
                            ${sparkline}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

// Setup des event listeners pour le marché
function setupMarketListeners() {
    // Filtres de tri
    document.querySelectorAll('.market-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.market-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            marketSort = btn.dataset.sort;
            renderMarket();
        });
    });
}

// Modifier submitVote pour enregistrer l'historique
const originalSubmitVote = submitVote;
submitVote = async function(predictionId, vote, confidence) {
    await originalSubmitVote(predictionId, vote, confidence);
    // Attendre un peu que Firebase se mette à jour
    setTimeout(() => saveVoteSnapshot(predictionId), 500);
};

// Charger l'historique et setup au démarrage
document.addEventListener('DOMContentLoaded', async () => {
    await loadVoteHistory();
    setupMarketListeners();
});

// Modifier switchTab pour inclure le marché
const originalSwitchTab = switchTab;
switchTab = function(tabName) {
    originalSwitchTab(tabName);
    if (tabName === 'market') {
        renderMarket();
    }
};
