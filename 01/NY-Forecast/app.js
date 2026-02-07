// ===========================================
// BETWEEN FRIENDS - Paris entre amis
// ===========================================

// État de l'application
let currentUser = null;
let currentUserId = null;
let currentGroup = null;
let currentGroupData = null;
let myGroups = [];
let members = [];
let predictions = [];
let bets = [];
let userBalance = 0;
let currentCategory = 'all';

// Configuration
const INITIAL_BALANCE = 1000;
const INITIAL_LIQUIDITY = 100; // Liquidité initiale pour chaque côté du pool

// Catégories disponibles
const CATEGORIES = {
    politique: { label: 'Politique', emoji: '🏛️' },
    sport: { label: 'Sport', emoji: '⚽' },
    tech: { label: 'Tech', emoji: '💻' },
    perso: { label: 'Perso', emoji: '👥' },
    autre: { label: 'Autre', emoji: '🔮' }
};

// Éléments DOM
const homeScreen = document.getElementById('home-screen');
const userSelectionScreen = document.getElementById('user-selection');
const predictionsScreen = document.getElementById('predictions-screen');
const myGroupsList = document.getElementById('my-groups-list');
const noGroupsEl = document.getElementById('no-groups');

// Modals
const createGroupModal = document.getElementById('create-group-modal');
const joinGroupModal = document.getElementById('join-group-modal');
const shareGroupModal = document.getElementById('share-group-modal');
const betModal = document.getElementById('bet-modal');
const resolveModal = document.getElementById('resolve-modal');

// ===========================================
// INITIALISATION
// ===========================================

document.addEventListener('DOMContentLoaded', init);

async function init() {
    // Vérifier si on arrive via un lien d'invitation
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');

    if (joinCode) {
        // Afficher le modal de rejoindre avec le code pré-rempli
        showJoinGroupModal(joinCode);
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    await loadMyGroups();
    setupEventListeners();
    showHomeScreen();
}

function setupEventListeners() {
    // Boutons accueil
    document.getElementById('create-group-btn').addEventListener('click', showCreateGroupModal);
    document.getElementById('join-group-btn').addEventListener('click', () => showJoinGroupModal());

    // Modal création groupe
    document.getElementById('cancel-create-group').addEventListener('click', hideAllModals);
    document.getElementById('confirm-create-group').addEventListener('click', createGroup);

    // Modal rejoindre groupe
    document.getElementById('cancel-join-group').addEventListener('click', hideAllModals);
    document.getElementById('confirm-join-group').addEventListener('click', joinGroup);

    // Modal partage
    document.getElementById('copy-link-btn').addEventListener('click', copyShareLink);
    document.getElementById('close-share-modal').addEventListener('click', () => {
        hideAllModals();
        enterGroup(currentGroup);
    });

    // Navigation
    document.getElementById('back-to-home')?.addEventListener('click', showHomeScreen);
    document.getElementById('back-to-groups-btn')?.addEventListener('click', showHomeScreen);
    document.getElementById('change-user-btn')?.addEventListener('click', showUserSelection);

    // Sélection utilisateur
    document.getElementById('add-user-btn')?.addEventListener('click', addNewMember);
    document.getElementById('new-user-name')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewMember();
    });

    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Filtres catégories
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderPredictions();
        });
    });

    // Ajouter prédiction
    document.getElementById('add-prediction-btn')?.addEventListener('click', addNewPrediction);

    // Modal pari
    document.getElementById('cancel-bet')?.addEventListener('click', hideAllModals);
    document.getElementById('confirm-bet')?.addEventListener('click', confirmBet);
    document.getElementById('bet-yes-btn')?.addEventListener('click', () => selectBetSide('yes'));
    document.getElementById('bet-no-btn')?.addEventListener('click', () => selectBetSide('no'));
    document.getElementById('bet-amount-input')?.addEventListener('input', updateBetPreview);

    // Quick amounts
    document.querySelectorAll('.quick-amount-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = btn.dataset.amount;
            const input = document.getElementById('bet-amount-input');
            if (amount === 'all') {
                input.value = userBalance;
            } else {
                input.value = Math.min(parseInt(amount), userBalance);
            }
            updateBetPreview();
        });
    });

    // Modal résolution
    document.getElementById('cancel-resolve')?.addEventListener('click', hideAllModals);
    document.getElementById('resolve-yes-btn')?.addEventListener('click', () => resolvePrediction('yes'));
    document.getElementById('resolve-no-btn')?.addEventListener('click', () => resolvePrediction('no'));
}

// ===========================================
// GESTION DES ÉCRANS
// ===========================================

function showHomeScreen() {
    currentGroup = null;
    currentGroupData = null;
    hideAllScreens();
    homeScreen.classList.remove('hidden');
    loadMyGroups();
}

function showUserSelection() {
    hideAllScreens();
    userSelectionScreen.classList.remove('hidden');
    renderMembersList();
}

function showPredictionsScreen() {
    hideAllScreens();
    predictionsScreen.classList.remove('hidden');
    document.getElementById('current-group-name').textContent = currentGroupData?.name || 'Groupe';
    document.getElementById('current-group-code').textContent = currentGroupData?.code || '';
    document.getElementById('current-user-name').textContent = currentUser;
    updateBalanceDisplay();
    renderPredictions();
}

function hideAllScreens() {
    homeScreen.classList.add('hidden');
    userSelectionScreen.classList.add('hidden');
    predictionsScreen.classList.add('hidden');
}

function hideAllModals() {
    createGroupModal.classList.add('hidden');
    joinGroupModal.classList.add('hidden');
    shareGroupModal.classList.add('hidden');
    betModal.classList.add('hidden');
    resolveModal.classList.add('hidden');
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    document.querySelectorAll('.tab-content').forEach(tc => {
        tc.classList.toggle('active', tc.id === `tab-${tabName}`);
        tc.classList.toggle('hidden', tc.id !== `tab-${tabName}`);
    });

    if (tabName === 'portfolio') {
        renderPortfolio();
    } else if (tabName === 'leaderboard') {
        renderLeaderboard();
    }
}

// ===========================================
// GESTION DES GROUPES
// ===========================================

function generateGroupCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

async function loadMyGroups() {
    try {
        // Charger tous les groupes où l'utilisateur est membre
        // On stocke les groupes rejoints en localStorage
        const joinedGroupIds = JSON.parse(localStorage.getItem('joinedGroups') || '[]');

        myGroups = [];
        for (const groupId of joinedGroupIds) {
            try {
                const groupDoc = await db.collection('groups').doc(groupId).get();
                if (groupDoc.exists) {
                    const data = groupDoc.data();
                    // Compter les membres
                    const membersSnapshot = await db.collection('groups').doc(groupId).collection('members').get();
                    const predictionsSnapshot = await db.collection('groups').doc(groupId).collection('predictions').get();

                    myGroups.push({
                        id: groupId,
                        ...data,
                        memberCount: membersSnapshot.size,
                        predictionCount: predictionsSnapshot.size
                    });
                }
            } catch (e) {
                console.error('Erreur chargement groupe:', groupId, e);
            }
        }

        renderGroupsList();
    } catch (error) {
        console.error('Erreur chargement groupes:', error);
    }
}

function renderGroupsList() {
    if (myGroups.length === 0) {
        myGroupsList.innerHTML = '';
        noGroupsEl.classList.remove('hidden');
        return;
    }

    noGroupsEl.classList.add('hidden');
    myGroupsList.innerHTML = myGroups.map(group => `
        <div class="group-card" data-id="${group.id}">
            <div class="group-card-header">
                <span class="group-card-name">${escapeHtml(group.name)}</span>
                <span class="group-card-code">${group.code}</span>
            </div>
            <div class="group-card-stats">
                <span class="group-card-stat">👥 ${group.memberCount} membres</span>
                <span class="group-card-stat">🎲 ${group.predictionCount} paris</span>
            </div>
        </div>
    `).join('');

    // Event listeners
    myGroupsList.querySelectorAll('.group-card').forEach(card => {
        card.addEventListener('click', () => enterGroup(card.dataset.id));
    });
}

function showCreateGroupModal() {
    hideAllModals();
    document.getElementById('group-name-input').value = '';
    document.getElementById('creator-name-input').value = '';
    createGroupModal.classList.remove('hidden');
}

function showJoinGroupModal(code = '') {
    hideAllModals();
    document.getElementById('group-code-input').value = code;
    document.getElementById('joiner-name-input').value = '';
    joinGroupModal.classList.remove('hidden');
}

async function createGroup() {
    const name = document.getElementById('group-name-input').value.trim();
    const creatorName = document.getElementById('creator-name-input').value.trim();

    if (!name) {
        alert('Entre un nom pour le groupe');
        return;
    }
    if (!creatorName) {
        alert('Entre ton prénom');
        return;
    }

    try {
        const code = generateGroupCode();

        // Créer le groupe
        const groupRef = await db.collection('groups').add({
            name,
            code,
            createdAt: new Date(),
            initialBalance: INITIAL_BALANCE
        });

        currentGroup = groupRef.id;

        // Ajouter le créateur comme membre
        const memberRef = await db.collection('groups').doc(currentGroup).collection('members').add({
            name: creatorName,
            balance: INITIAL_BALANCE,
            joinedAt: new Date()
        });

        currentUser = creatorName;
        currentUserId = memberRef.id;

        // Sauvegarder localement
        saveLocalSession();
        addGroupToLocal(currentGroup);

        // Charger les données du groupe
        currentGroupData = { name, code };

        // Afficher le modal de partage
        document.getElementById('share-code-display').textContent = code;
        document.getElementById('share-link-input').value = `${window.location.origin}${window.location.pathname}?join=${code}`;

        hideAllModals();
        shareGroupModal.classList.remove('hidden');

    } catch (error) {
        console.error('Erreur création groupe:', error);
        alert('Erreur lors de la création du groupe');
    }
}

async function joinGroup() {
    const code = document.getElementById('group-code-input').value.trim().toUpperCase();
    const joinerName = document.getElementById('joiner-name-input').value.trim();

    if (!code || code.length !== 6) {
        alert('Entre un code à 6 caractères');
        return;
    }
    if (!joinerName) {
        alert('Entre ton prénom');
        return;
    }

    try {
        // Chercher le groupe par code
        const snapshot = await db.collection('groups')
            .where('code', '==', code)
            .limit(1)
            .get();

        if (snapshot.empty) {
            alert('Code invalide. Vérifie le code et réessaie.');
            return;
        }

        const groupDoc = snapshot.docs[0];
        currentGroup = groupDoc.id;
        currentGroupData = groupDoc.data();

        // Vérifier si l'utilisateur existe déjà
        const membersSnapshot = await db.collection('groups').doc(currentGroup).collection('members')
            .where('name', '==', joinerName)
            .limit(1)
            .get();

        if (!membersSnapshot.empty) {
            // L'utilisateur existe déjà, le connecter
            currentUserId = membersSnapshot.docs[0].id;
            currentUser = joinerName;
        } else {
            // Créer le nouveau membre
            const memberRef = await db.collection('groups').doc(currentGroup).collection('members').add({
                name: joinerName,
                balance: currentGroupData.initialBalance || INITIAL_BALANCE,
                joinedAt: new Date()
            });

            currentUserId = memberRef.id;
            currentUser = joinerName;
        }

        // Sauvegarder localement
        saveLocalSession();
        addGroupToLocal(currentGroup);

        hideAllModals();
        await loadGroupData();
        showPredictionsScreen();

    } catch (error) {
        console.error('Erreur rejoindre groupe:', error);
        alert('Erreur lors de la connexion au groupe');
    }
}

async function enterGroup(groupId) {
    currentGroup = groupId;

    // Charger les données du groupe
    const groupDoc = await db.collection('groups').doc(groupId).get();
    if (!groupDoc.exists) {
        alert('Ce groupe n\'existe plus');
        removeGroupFromLocal(groupId);
        loadMyGroups();
        return;
    }

    currentGroupData = groupDoc.data();

    // Vérifier si on a une session locale pour ce groupe
    const session = getLocalSession(groupId);
    if (session) {
        currentUser = session.userName;
        currentUserId = session.odId;
        await loadGroupData();
        showPredictionsScreen();
    } else {
        // Charger les membres et afficher la sélection
        await loadMembers();
        showUserSelection();
    }
}

function copyShareLink() {
    const input = document.getElementById('share-link-input');
    input.select();
    navigator.clipboard.writeText(input.value);

    const btn = document.getElementById('copy-link-btn');
    btn.textContent = 'Copié !';
    setTimeout(() => btn.textContent = 'Copier le lien', 2000);
}

// ===========================================
// GESTION DES MEMBRES
// ===========================================

async function loadMembers() {
    try {
        const snapshot = await db.collection('groups').doc(currentGroup).collection('members').orderBy('name').get();
        members = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        renderMembersList();
    } catch (error) {
        console.error('Erreur chargement membres:', error);
        members = [];
    }
}

function renderMembersList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = members.map(member => `
        <button class="user-btn" data-id="${member.id}" data-name="${escapeHtml(member.name)}">${escapeHtml(member.name)}</button>
    `).join('');

    userList.querySelectorAll('.user-btn').forEach(btn => {
        btn.addEventListener('click', () => selectMember(btn.dataset.id, btn.dataset.name));
    });
}

async function selectMember(memberId, name) {
    currentUser = name;
    currentUserId = memberId;
    saveLocalSession();
    await loadGroupData();
    showPredictionsScreen();
}

async function addNewMember() {
    const name = document.getElementById('new-user-name').value.trim();
    if (!name) return;

    // Vérifier si le nom existe déjà
    if (members.some(m => m.name.toLowerCase() === name.toLowerCase())) {
        alert('Ce prénom existe déjà dans le groupe');
        return;
    }

    try {
        const memberRef = await db.collection('groups').doc(currentGroup).collection('members').add({
            name,
            balance: currentGroupData?.initialBalance || INITIAL_BALANCE,
            joinedAt: new Date()
        });

        currentUser = name;
        currentUserId = memberRef.id;
        document.getElementById('new-user-name').value = '';

        saveLocalSession();
        addGroupToLocal(currentGroup);
        await loadGroupData();
        showPredictionsScreen();

    } catch (error) {
        console.error('Erreur ajout membre:', error);
        alert('Erreur lors de l\'ajout');
    }
}

// ===========================================
// GESTION DES DONNÉES DU GROUPE
// ===========================================

async function loadGroupData() {
    await Promise.all([
        loadMembers(),
        loadPredictions(),
        loadBets(),
        loadUserBalance()
    ]);

    // Écoute temps réel
    setupRealtimeListeners();
}

function setupRealtimeListeners() {
    // Écouter les changements de prédictions
    db.collection('groups').doc(currentGroup).collection('predictions')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            predictions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            renderPredictions();
        });

    // Écouter les changements de solde
    db.collection('groups').doc(currentGroup).collection('members').doc(currentUserId)
        .onSnapshot(doc => {
            if (doc.exists) {
                userBalance = doc.data().balance || 0;
                updateBalanceDisplay();
            }
        });

    // Écouter les paris
    db.collection('groups').doc(currentGroup).collection('bets')
        .where('odId', '==', currentUserId)
        .onSnapshot(snapshot => {
            bets = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            if (document.querySelector('.tab[data-tab="portfolio"]').classList.contains('active')) {
                renderPortfolio();
            }
        });
}

async function loadPredictions() {
    try {
        const snapshot = await db.collection('groups').doc(currentGroup)
            .collection('predictions')
            .orderBy('createdAt', 'desc')
            .get();

        predictions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erreur chargement prédictions:', error);
        predictions = [];
    }
}

async function loadBets() {
    try {
        const snapshot = await db.collection('groups').doc(currentGroup)
            .collection('bets')
            .where('odId', '==', currentUserId)
            .get();

        bets = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erreur chargement paris:', error);
        bets = [];
    }
}

async function loadUserBalance() {
    try {
        const memberDoc = await db.collection('groups').doc(currentGroup)
            .collection('members').doc(currentUserId).get();

        if (memberDoc.exists) {
            userBalance = memberDoc.data().balance || 0;
        }
    } catch (error) {
        console.error('Erreur chargement solde:', error);
    }
}

function updateBalanceDisplay() {
    const balanceEl = document.getElementById('user-balance');
    if (balanceEl) {
        balanceEl.textContent = Math.floor(userBalance);
    }
}

// ===========================================
// AMM - MARKET MAKER
// ===========================================

function calculatePrices(pool) {
    const total = pool.yes + pool.no;
    if (total === 0) return { yes: 0.5, no: 0.5 };

    return {
        yes: pool.no / total,  // Plus il y a de NO, plus le OUI est cher
        no: pool.yes / total   // Plus il y a de YES, plus le NON est cher
    };
}

function calculateSharesForBuy(pool, side, amount) {
    if (amount <= 0) return { shares: 0, newPool: pool, avgPrice: 0 };

    const k = pool.yes * pool.no;
    const otherSide = side === 'yes' ? 'no' : 'yes';

    // L'utilisateur achète des shares d'un côté
    // Il met ses coins dans le pool de l'autre côté
    const newOther = pool[otherSide] + amount;
    const newSide = k / newOther;
    const shares = pool[side] - newSide;

    return {
        shares: Math.max(0, shares),
        newPool: {
            yes: side === 'yes' ? newSide : newOther,
            no: side === 'no' ? newSide : newOther
        },
        avgPrice: shares > 0 ? amount / shares : 0
    };
}

function calculateOdds(price) {
    if (price <= 0) return Infinity;
    if (price >= 1) return 1;
    return 1 / price;
}

// ===========================================
// RENDU DES PRÉDICTIONS
// ===========================================

function renderPredictions() {
    const listEl = document.getElementById('predictions-list');
    const noPredEl = document.getElementById('no-predictions');

    // Filtrer par catégorie
    let filtered = predictions;
    if (currentCategory !== 'all') {
        filtered = predictions.filter(p => p.category === currentCategory);
    }

    // Séparer résolues et non résolues
    const active = filtered.filter(p => !p.resolution);
    const resolved = filtered.filter(p => p.resolution);

    if (filtered.length === 0) {
        listEl.innerHTML = '';
        noPredEl.classList.remove('hidden');
        return;
    }

    noPredEl.classList.add('hidden');

    const renderCard = (pred) => {
        const pool = pred.pool || { yes: INITIAL_LIQUIDITY, no: INITIAL_LIQUIDITY };
        const prices = calculatePrices(pool);
        const yesPrice = Math.round(prices.yes * 100);
        const noPrice = Math.round(prices.no * 100);
        const totalVolume = (pred.totalVolume || 0);

        const resolvedClass = pred.resolution ? `resolved resolved-${pred.resolution}` : '';
        const cat = CATEGORIES[pred.category] || CATEGORIES.autre;

        // Vérifier si l'utilisateur a déjà parié
        const userBets = bets.filter(b => b.predictionId === pred.id);
        const hasYesBet = userBets.some(b => b.side === 'yes');
        const hasNoBet = userBets.some(b => b.side === 'no');

        let deadlineText = '';
        if (pred.deadline) {
            const deadline = pred.deadline.toDate ? pred.deadline.toDate() : new Date(pred.deadline);
            deadlineText = `${deadline.toLocaleDateString('fr-FR')}`;
        }

        return `
            <div class="bet-card ${resolvedClass}" data-id="${pred.id}">
                <div class="bet-card-header">
                    <span class="bet-card-category">${cat.emoji} ${cat.label}</span>
                    ${deadlineText ? `<span class="bet-card-deadline">Fin: ${deadlineText}</span>` : ''}
                </div>
                <p class="bet-card-text">${escapeHtml(pred.text)}</p>
                <p class="bet-card-author">Par ${escapeHtml(pred.author)}</p>
                ${pred.resolution ? `
                    <div class="resolution-result ${pred.resolution}">
                        ${pred.resolution === 'yes' ? '✓ OUI - C\'est arrivé' : '✗ NON - Pas arrivé'}
                    </div>
                ` : `
                    <div class="bet-card-prices">
                        <button class="bet-price-btn yes ${hasYesBet ? 'has-bet' : ''}" data-id="${pred.id}" data-side="yes">
                            <span class="bet-price-label">OUI</span>
                            <span class="bet-price-value">${yesPrice}%</span>
                        </button>
                        <button class="bet-price-btn no ${hasNoBet ? 'has-bet' : ''}" data-id="${pred.id}" data-side="no">
                            <span class="bet-price-label">NON</span>
                            <span class="bet-price-value">${noPrice}%</span>
                        </button>
                    </div>
                    <div class="bet-card-volume">${totalVolume} coins pariés</div>
                    ${pred.authorId === currentUserId || pred.author === currentUser ? `
                        <button class="btn btn-small resolve-prediction-btn" data-id="${pred.id}" style="margin-top: 10px; width: 100%;">
                            Résoudre
                        </button>
                    ` : ''}
                `}
            </div>
        `;
    };

    let html = '';

    if (active.length > 0) {
        html += active.map(renderCard).join('');
    }

    if (resolved.length > 0) {
        html += `<h3 class="section-title" style="margin-top: 30px;">Paris résolus</h3>`;
        html += resolved.map(renderCard).join('');
    }

    listEl.innerHTML = html;

    // Event listeners pour les boutons de pari
    listEl.querySelectorAll('.bet-price-btn').forEach(btn => {
        btn.addEventListener('click', () => openBetModal(btn.dataset.id, btn.dataset.side));
    });

    // Event listeners pour résoudre
    listEl.querySelectorAll('.resolve-prediction-btn').forEach(btn => {
        btn.addEventListener('click', () => openResolveModal(btn.dataset.id));
    });
}

// ===========================================
// MODAL DE PARI
// ===========================================

let currentBetPrediction = null;
let currentBetSide = null;

function openBetModal(predictionId, side) {
    const pred = predictions.find(p => p.id === predictionId);
    if (!pred) return;

    currentBetPrediction = pred;
    currentBetSide = side;

    const pool = pred.pool || { yes: INITIAL_LIQUIDITY, no: INITIAL_LIQUIDITY };
    const prices = calculatePrices(pool);

    document.getElementById('bet-modal-prediction').textContent = pred.text;
    document.getElementById('bet-yes-price').textContent = Math.round(prices.yes * 100) + '%';
    document.getElementById('bet-no-price').textContent = Math.round(prices.no * 100) + '%';
    document.getElementById('bet-yes-odds').textContent = 'x' + calculateOdds(prices.yes).toFixed(2);
    document.getElementById('bet-no-odds').textContent = 'x' + calculateOdds(prices.no).toFixed(2);

    document.getElementById('bet-amount-input').value = '';
    document.getElementById('bet-potential-win').textContent = '0 coins';
    document.getElementById('confirm-bet').disabled = true;

    selectBetSide(side);

    betModal.classList.remove('hidden');
}

function selectBetSide(side) {
    currentBetSide = side;

    document.getElementById('bet-yes-btn').classList.toggle('selected', side === 'yes');
    document.getElementById('bet-no-btn').classList.toggle('selected', side === 'no');

    updateBetPreview();
}

function updateBetPreview() {
    const amount = parseInt(document.getElementById('bet-amount-input').value) || 0;
    const pred = currentBetPrediction;
    const side = currentBetSide;

    if (!pred || !side || amount <= 0) {
        document.getElementById('bet-potential-win').textContent = '0 coins';
        document.getElementById('confirm-bet').disabled = true;
        return;
    }

    if (amount > userBalance) {
        document.getElementById('bet-potential-win').textContent = 'Solde insuffisant';
        document.getElementById('confirm-bet').disabled = true;
        return;
    }

    const pool = pred.pool || { yes: INITIAL_LIQUIDITY, no: INITIAL_LIQUIDITY };
    const { shares } = calculateSharesForBuy(pool, side, amount);

    document.getElementById('bet-potential-win').textContent = Math.floor(shares) + ' coins';
    document.getElementById('confirm-bet').disabled = false;
}

async function confirmBet() {
    const amount = parseInt(document.getElementById('bet-amount-input').value) || 0;
    const pred = currentBetPrediction;
    const side = currentBetSide;

    if (!pred || !side || amount <= 0 || amount > userBalance) {
        return;
    }

    try {
        document.getElementById('confirm-bet').disabled = true;
        document.getElementById('confirm-bet').textContent = 'En cours...';

        const pool = pred.pool || { yes: INITIAL_LIQUIDITY, no: INITIAL_LIQUIDITY };
        const { shares, newPool } = calculateSharesForBuy(pool, side, amount);

        const batch = db.batch();

        // Mettre à jour le solde du membre
        const memberRef = db.collection('groups').doc(currentGroup).collection('members').doc(currentUserId);
        batch.update(memberRef, {
            balance: firebase.firestore.FieldValue.increment(-amount)
        });

        // Mettre à jour le pool de la prédiction
        const predRef = db.collection('groups').doc(currentGroup).collection('predictions').doc(pred.id);
        batch.update(predRef, {
            pool: newPool,
            totalVolume: firebase.firestore.FieldValue.increment(amount)
        });

        // Créer le pari
        const betRef = db.collection('groups').doc(currentGroup).collection('bets').doc();
        batch.set(betRef, {
            odId: currentUserId,
            odName: currentUser,
            predictionId: pred.id,
            side,
            amount,
            shares,
            price: amount / shares,
            createdAt: new Date()
        });

        await batch.commit();

        hideAllModals();

    } catch (error) {
        console.error('Erreur pari:', error);
        alert('Erreur lors du pari. Réessaie.');
    } finally {
        document.getElementById('confirm-bet').disabled = false;
        document.getElementById('confirm-bet').textContent = 'Parier';
    }
}

// ===========================================
// RÉSOLUTION
// ===========================================

let currentResolvePrediction = null;

function openResolveModal(predictionId) {
    const pred = predictions.find(p => p.id === predictionId);
    if (!pred) return;

    currentResolvePrediction = pred;
    document.getElementById('resolve-modal-prediction').textContent = pred.text;
    resolveModal.classList.remove('hidden');
}

async function resolvePrediction(outcome) {
    const pred = currentResolvePrediction;
    if (!pred) return;

    try {
        // Récupérer tous les paris gagnants
        const betsSnapshot = await db.collection('groups').doc(currentGroup)
            .collection('bets')
            .where('predictionId', '==', pred.id)
            .where('side', '==', outcome)
            .get();

        const batch = db.batch();

        // Marquer comme résolu
        const predRef = db.collection('groups').doc(currentGroup).collection('predictions').doc(pred.id);
        batch.update(predRef, {
            resolution: outcome,
            resolvedAt: new Date(),
            resolvedBy: currentUser
        });

        // Payer les gagnants (1 share = 1 coin)
        for (const betDoc of betsSnapshot.docs) {
            const bet = betDoc.data();
            const memberRef = db.collection('groups').doc(currentGroup).collection('members').doc(bet.odId);
            batch.update(memberRef, {
                balance: firebase.firestore.FieldValue.increment(bet.shares)
            });
        }

        await batch.commit();

        hideAllModals();

    } catch (error) {
        console.error('Erreur résolution:', error);
        alert('Erreur lors de la résolution');
    }
}

// ===========================================
// AJOUTER UNE PRÉDICTION
// ===========================================

async function addNewPrediction() {
    const text = document.getElementById('new-prediction-text').value.trim();
    const category = document.getElementById('new-prediction-category').value;
    const deadlineInput = document.getElementById('new-prediction-deadline').value;

    if (!text) {
        alert('Écris une prédiction');
        return;
    }

    try {
        await db.collection('groups').doc(currentGroup).collection('predictions').add({
            text,
            author: currentUser,
            authorId: currentUserId,
            category,
            pool: { yes: INITIAL_LIQUIDITY, no: INITIAL_LIQUIDITY },
            totalVolume: 0,
            resolution: null,
            deadline: deadlineInput ? new Date(deadlineInput) : null,
            createdAt: new Date()
        });

        document.getElementById('new-prediction-text').value = '';
        document.getElementById('new-prediction-deadline').value = '';

        switchTab('bet');

    } catch (error) {
        console.error('Erreur ajout prédiction:', error);
        alert('Erreur lors de l\'ajout');
    }
}

// ===========================================
// PORTFOLIO
// ===========================================

function renderPortfolio() {
    const listEl = document.getElementById('positions-list');
    const noPositionsEl = document.getElementById('no-positions');
    const totalValueEl = document.getElementById('portfolio-total-value');
    const pnlEl = document.getElementById('portfolio-pnl');

    // Grouper les paris par prédiction
    const positionsByPred = {};
    bets.forEach(bet => {
        if (!positionsByPred[bet.predictionId]) {
            positionsByPred[bet.predictionId] = { yes: 0, no: 0, invested: 0 };
        }
        positionsByPred[bet.predictionId][bet.side] += bet.shares;
        positionsByPred[bet.predictionId].invested += bet.amount;
    });

    // Calculer la valeur actuelle
    let totalValue = 0;
    let totalInvested = 0;

    const positions = [];

    for (const [predId, position] of Object.entries(positionsByPred)) {
        const pred = predictions.find(p => p.id === predId);
        if (!pred) continue;

        const pool = pred.pool || { yes: INITIAL_LIQUIDITY, no: INITIAL_LIQUIDITY };
        const prices = calculatePrices(pool);

        // Valeur des positions
        const yesValue = position.yes * prices.yes;
        const noValue = position.no * prices.no;
        const currentValue = yesValue + noValue;

        totalValue += currentValue;
        totalInvested += position.invested;

        if (position.yes > 0) {
            positions.push({
                pred,
                side: 'yes',
                shares: position.yes,
                value: yesValue,
                invested: position.invested * (position.yes / (position.yes + position.no)),
                resolved: pred.resolution
            });
        }
        if (position.no > 0) {
            positions.push({
                pred,
                side: 'no',
                shares: position.no,
                value: noValue,
                invested: position.invested * (position.no / (position.yes + position.no)),
                resolved: pred.resolution
            });
        }
    }

    // Ajouter le solde actuel
    totalValue += userBalance;

    const pnl = totalValue - INITIAL_BALANCE;

    totalValueEl.textContent = Math.floor(totalValue);
    pnlEl.textContent = (pnl >= 0 ? '+' : '') + Math.floor(pnl);
    pnlEl.className = 'portfolio-stat-value ' + (pnl >= 0 ? 'positive' : 'negative');

    if (positions.length === 0) {
        listEl.innerHTML = '';
        noPositionsEl.classList.remove('hidden');
        return;
    }

    noPositionsEl.classList.add('hidden');

    listEl.innerHTML = positions.map(pos => {
        const gainLoss = pos.value - pos.invested;
        const gainClass = gainLoss >= 0 ? 'positive' : 'negative';

        return `
            <div class="position-card ${pos.side}">
                <div class="position-header">
                    <span class="position-prediction">${escapeHtml(pos.pred.text)}</span>
                    <span class="position-side ${pos.side}">${pos.side.toUpperCase()}</span>
                </div>
                <div class="position-details">
                    <span class="position-shares">${Math.floor(pos.shares)} shares</span>
                    <span class="position-value ${gainClass}">
                        ${gainLoss >= 0 ? '+' : ''}${Math.floor(gainLoss)} coins
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// ===========================================
// CLASSEMENT
// ===========================================

async function renderLeaderboard() {
    const listEl = document.getElementById('leaderboard-list');

    try {
        // Charger tous les membres
        const membersSnapshot = await db.collection('groups').doc(currentGroup)
            .collection('members')
            .get();

        const leaderboard = membersSnapshot.docs.map(doc => {
            const data = doc.data();
            const pnl = data.balance - INITIAL_BALANCE;
            return {
                id: doc.id,
                name: data.name,
                balance: data.balance,
                pnl
            };
        }).sort((a, b) => b.balance - a.balance);

        listEl.innerHTML = leaderboard.map((member, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
            const pnlClass = member.pnl >= 0 ? 'positive' : 'negative';
            const isMe = member.id === currentUserId;

            return `
                <div class="leaderboard-row ${i < 3 ? 'top-3' : ''} ${isMe ? 'is-me' : ''}">
                    <span class="leaderboard-rank">${medal || (i + 1)}</span>
                    <span class="leaderboard-name">${escapeHtml(member.name)}</span>
                    <span class="leaderboard-balance">${Math.floor(member.balance)} coins</span>
                    <span class="leaderboard-pnl ${pnlClass}">
                        ${member.pnl >= 0 ? '+' : ''}${Math.floor(member.pnl)}
                    </span>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Erreur classement:', error);
        listEl.innerHTML = '<p class="empty-message">Erreur de chargement</p>';
    }
}

// ===========================================
// UTILITAIRES
// ===========================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function saveLocalSession() {
    if (!currentGroup || !currentUserId || !currentUser) return;

    const sessions = JSON.parse(localStorage.getItem('groupSessions') || '{}');
    sessions[currentGroup] = {
        odId: currentUserId,
        userName: currentUser
    };
    localStorage.setItem('groupSessions', JSON.stringify(sessions));
}

function getLocalSession(groupId) {
    const sessions = JSON.parse(localStorage.getItem('groupSessions') || '{}');
    return sessions[groupId];
}

function addGroupToLocal(groupId) {
    const groups = JSON.parse(localStorage.getItem('joinedGroups') || '[]');
    if (!groups.includes(groupId)) {
        groups.push(groupId);
        localStorage.setItem('joinedGroups', JSON.stringify(groups));
    }
}

function removeGroupFromLocal(groupId) {
    let groups = JSON.parse(localStorage.getItem('joinedGroups') || '[]');
    groups = groups.filter(g => g !== groupId);
    localStorage.setItem('joinedGroups', JSON.stringify(groups));
}
