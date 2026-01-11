/**
 * SubVeille - Main Application
 * Outil de veille pour appels a projets
 */

(function() {
  'use strict';

  // Elements DOM
  const elements = {
    // Search
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    filterSecteur: document.getElementById('filterSecteur'),
    filterFinanceur: document.getElementById('filterFinanceur'),
    filterStatut: document.getElementById('filterStatut'),
    filterMontant: document.getElementById('filterMontant'),

    // Results
    resultsList: document.getElementById('resultsList'),
    resultsCount: document.getElementById('resultsCount'),
    resultsPlaceholder: document.getElementById('resultsPlaceholder'),
    resultsContainer: document.querySelector('.results-container'),

    // Detail
    detailPanel: document.getElementById('detailPanel'),
    detailPanelContent: document.getElementById('detailPanelContent'),
    detailPanelClose: document.getElementById('detailPanelClose'),

    // Loading & Toast
    loadingOverlay: document.getElementById('loadingOverlay'),
    toastContainer: document.getElementById('toastContainer'),

    // User Menu
    btnLogin: document.getElementById('btnLogin'),
    userLogged: document.getElementById('userLogged'),
    btnMyAaps: document.getElementById('btnMyAaps'),
    btnUser: document.getElementById('btnUser'),
    dropdownMenu: document.getElementById('dropdownMenu'),
    btnProfile: document.getElementById('btnProfile'),
    btnLogout: document.getElementById('btnLogout'),
    userAvatar: document.getElementById('userAvatar'),
    badgeCount: document.getElementById('badgeCount'),

    // Tabs
    tabsContainer: document.getElementById('tabsContainer'),
    tabSearch: document.getElementById('tabSearch'),
    tabSaved: document.getElementById('tabSaved'),
    tabBadge: document.getElementById('tabBadge'),

    // Saved View
    savedContainer: document.getElementById('savedContainer'),
    savedList: document.getElementById('savedList'),
    savedPlaceholder: document.getElementById('savedPlaceholder'),
    filterSavedStatus: document.getElementById('filterSavedStatus'),
    statTotal: document.getElementById('statTotal'),
    statSaved: document.getElementById('statSaved'),
    statApplied: document.getElementById('statApplied'),
    statAccepted: document.getElementById('statAccepted'),

    // Auth Modal
    authModal: document.getElementById('authModal'),
    authModalClose: document.getElementById('authModalClose'),
    authModalTitle: document.getElementById('authModalTitle'),
    authForm: document.getElementById('authForm'),
    authEmail: document.getElementById('authEmail'),
    authPassword: document.getElementById('authPassword'),
    authError: document.getElementById('authError'),
    authSubmit: document.getElementById('authSubmit'),
    authSwitchText: document.getElementById('authSwitchText'),
    authSwitchBtn: document.getElementById('authSwitchBtn'),

    // Profile Modal
    profileModal: document.getElementById('profileModal'),
    profileModalClose: document.getElementById('profileModalClose'),
    profileForm: document.getElementById('profileForm'),
    profileError: document.getElementById('profileError'),

    // Recommendation
    filterRecoGroup: document.getElementById('filterRecoGroup'),
    btnReco: document.getElementById('btnReco'),
    btnSmartReco: document.getElementById('btnSmartReco')
  };

  // Etat
  let currentResults = [];
  let selectedId = null;
  let currentTab = 'search';
  let isSignUpMode = false;
  let recoModeActive = false;

  /**
   * Initialisation
   */
  async function init() {
    setupEventListeners();

    // Initialiser l'authentification
    await Auth.init();

    // Ecouter les changements d'auth
    Auth.onAuthChange(handleAuthChange);

    // Charger les resultats par defaut (ouverts)
    performSearch();
  }

  /**
   * Configure les evenements
   */
  function setupEventListeners() {
    // Recherche
    elements.searchBtn.addEventListener('click', performSearch);
    elements.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') performSearch();
    });

    // Filtres (recherche automatique au changement)
    elements.filterSecteur.addEventListener('change', performSearch);
    elements.filterFinanceur.addEventListener('change', performSearch);
    elements.filterStatut.addEventListener('change', performSearch);
    elements.filterMontant.addEventListener('change', performSearch);

    // Detail panel
    elements.detailPanelClose.addEventListener('click', closeDetailPanel);

    // User menu
    elements.btnLogin.addEventListener('click', openAuthModal);
    elements.btnMyAaps.addEventListener('click', () => switchTab('saved'));
    elements.btnUser.addEventListener('click', toggleDropdown);
    elements.btnProfile.addEventListener('click', openProfileModal);
    elements.btnLogout.addEventListener('click', handleLogout);

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!elements.btnUser.contains(e.target) && !elements.dropdownMenu.contains(e.target)) {
        elements.dropdownMenu.classList.add('hidden');
      }
    });

    // Tabs
    elements.tabSearch.addEventListener('click', () => switchTab('search'));
    elements.tabSaved.addEventListener('click', () => switchTab('saved'));

    // Saved filter
    elements.filterSavedStatus.addEventListener('change', displaySavedAaps);

    // Auth modal
    elements.authModalClose.addEventListener('click', closeAuthModal);
    elements.authModal.addEventListener('click', (e) => {
      if (e.target === elements.authModal) closeAuthModal();
    });
    elements.authForm.addEventListener('submit', handleAuthSubmit);
    elements.authSwitchBtn.addEventListener('click', toggleAuthMode);

    // Profile modal
    elements.profileModalClose.addEventListener('click', closeProfileModal);
    elements.profileModal.addEventListener('click', (e) => {
      if (e.target === elements.profileModal) closeProfileModal();
    });
    elements.profileForm.addEventListener('submit', handleProfileSubmit);

    // Recommendation toggle
    elements.btnReco.addEventListener('click', toggleRecoMode);
    elements.btnSmartReco.addEventListener('click', loadSmartRecommendations);
  }

  /**
   * Gere les changements d'authentification
   */
  async function handleAuthChange(user, profile) {
    if (user) {
      // Utilisateur connecte
      elements.btnLogin.classList.add('hidden');
      elements.userLogged.classList.remove('hidden');
      elements.tabsContainer.classList.remove('hidden');
      elements.filterRecoGroup.classList.remove('hidden');

      // Avatar
      const initial = (profile?.nom_association || user.email || 'U').charAt(0).toUpperCase();
      elements.userAvatar.textContent = initial;

      // Charger les AAP sauvegardes
      await SavedAaps.loadAll();
      updateSavedBadge();

      // Verifier les deadlines urgentes
      checkUrgentDeadlines();

      // Activer le mode reco si profil complet
      if (isProfileComplete(profile)) {
        recoModeActive = true;
        elements.btnReco.classList.add('active');
      }

      // Rafraichir l'affichage si on est sur les resultats
      if (currentTab === 'search' && currentResults.length > 0) {
        displayResults(currentResults);
      }

    } else {
      // Utilisateur deconnecte
      elements.btnLogin.classList.remove('hidden');
      elements.userLogged.classList.add('hidden');
      elements.tabsContainer.classList.add('hidden');
      elements.filterRecoGroup.classList.add('hidden');
      recoModeActive = false;
      elements.btnReco.classList.remove('active');

      // Retour a la recherche
      if (currentTab === 'saved') {
        switchTab('search');
      }
    }
  }

  /**
   * Verifie si le profil est suffisamment complet pour les recommandations
   */
  function isProfileComplete(profile) {
    if (!profile) return false;
    return (profile.secteurs && profile.secteurs.length > 0) || profile.code_postal;
  }

  /**
   * Toggle le mode recommandation
   */
  function toggleRecoMode() {
    const profile = Auth.getProfile();

    if (!isProfileComplete(profile)) {
      showToast('Completez votre profil pour les recommandations', 'error');
      openProfileModal();
      return;
    }

    recoModeActive = !recoModeActive;
    elements.btnReco.classList.toggle('active', recoModeActive);

    if (recoModeActive) {
      showToast('Mode recommandations active');
    }

    // Rafraichir l'affichage
    if (currentResults.length > 0) {
      displayResults(currentResults);
    }
  }

  /**
   * Charge les recommandations intelligentes (prefiltre + IA)
   */
  async function loadSmartRecommendations() {
    const profile = Auth.getProfile();

    if (!profile?.description || profile.description.length < 20) {
      showToast('Ajoutez une description a votre profil pour les recommandations IA', 'error');
      openProfileModal();
      return;
    }

    elements.btnSmartReco.classList.add('loading');
    elements.btnSmartReco.disabled = true;
    showLoading();

    try {
      // 1. Charger tous les AAP
      const allAaps = await DataSources.search('', {});

      // 2. Prefiltre avec le scoring local (top 30)
      const enriched = Recommendation.enrichWithScores(allAaps, profile);
      const sorted = Recommendation.sortByRelevance(enriched);
      const top30 = sorted.slice(0, 30);

      // 3. Scoring IA semantique sur les 30 meilleurs
      const result = await AIService.getSmartRecommendations(top30);

      // 4. Afficher les resultats
      displaySmartRecommendations(result);

    } catch (error) {
      console.error('[Smart Reco Error]', error);
      showToast('Erreur IA - verifiez que le serveur est demarre', 'error');
    }

    hideLoading();
    elements.btnSmartReco.classList.remove('loading');
    elements.btnSmartReco.disabled = false;
  }

  /**
   * Affiche les recommandations intelligentes
   */
  function displaySmartRecommendations(result) {
    const { aaps, hasAiScoring } = result;

    // Mettre a jour le titre
    elements.resultsCount.innerHTML = `
      <span class="ai-badge" style="margin-right: 0.5rem;">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:10px;height:10px">
          <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4a2 2 0 0 1-2-2 4 4 0 0 1 4-4z"/>
        </svg>
        IA
      </span>
      Top ${aaps.length} recommandations pour vous
    `;

    // Vider la liste
    const cards = elements.resultsList.querySelectorAll('.result-card, .profile-alert, .smart-reco-header');
    cards.forEach(c => c.remove());

    elements.resultsPlaceholder.classList.add('hidden');

    // Header explicatif
    const headerHtml = `
      <div class="smart-reco-header">
        <div class="smart-reco-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4a2 2 0 0 1-2-2 4 4 0 0 1 4-4z"/>
            <path d="M8 8v8a4 4 0 0 0 8 0V8"/>
          </svg>
          Recommandations personnalisees
        </div>
        <p class="smart-reco-subtitle">
          ${hasAiScoring
            ? 'Bases sur votre profil et analyse semantique IA'
            : 'Ajoutez une description pour activer le matching IA'}
        </p>
      </div>
    `;
    elements.resultsList.insertAdjacentHTML('afterbegin', headerHtml);

    // Creer les cartes avec score IA
    aaps.forEach((aap, index) => {
      const card = createSmartRecoCard(aap, index + 1);
      elements.resultsList.appendChild(card);
    });
  }

  /**
   * Cree une carte de recommandation IA
   */
  function createSmartRecoCard(aap, rank) {
    const deadline = DataSources.getDeadlineStatus(aap.dateCloture);
    const montant = DataSources.formatMontant(aap.montantMin, aap.montantMax, aap.subventionRate);
    const isSaved = Auth.isLoggedIn() && SavedAaps.isSaved(aap.id);

    const card = document.createElement('div');
    card.className = 'result-card smart-reco-card';
    card.dataset.id = aap.id;

    // Score combine
    const scoreClass = aap.combinedScore >= 60 ? 'score-high' :
                       aap.combinedScore >= 40 ? 'score-medium' : 'score-low';

    // Bouton save
    const saveBtn = `<button class="save-btn ${isSaved ? 'saved' : ''}" data-id="${aap.id}" onclick="event.stopPropagation()">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
           <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
         </svg>
       </button>`;

    card.innerHTML = `
      <div class="smart-reco-rank">#${rank}</div>
      <span class="match-score ${scoreClass}">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4a2 2 0 0 1-2-2 4 4 0 0 1 4-4z"/>
        </svg>
        ${aap.combinedScore}%
      </span>
      <div class="result-card-header">
        <h3 class="result-card-title">${escapeHtml(aap.titre)}</h3>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="result-card-deadline ${deadline.class}">${deadline.label}</span>
          ${saveBtn}
        </div>
      </div>
      <div class="result-card-meta">
        <span class="meta-tag tag-secteur">${capitalize(aap.secteur)}</span>
        <span class="meta-tag tag-financeur">${escapeHtml(truncate(aap.financeur, 30))}</span>
        <span class="meta-tag tag-montant">${montant}</span>
      </div>
      ${aap.aiMotif ? `
        <div class="ai-motif">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4a2 2 0 0 1-2-2 4 4 0 0 1 4-4z"/>
          </svg>
          ${escapeHtml(aap.aiMotif)}
        </div>
      ` : ''}
    `;

    // Click on card
    card.addEventListener('click', () => showDetail(aap.id));

    // Click on save button
    const saveBtnEl = card.querySelector('.save-btn');
    if (saveBtnEl) {
      saveBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSave(aap, saveBtnEl);
      });
    }

    return card;
  }

  /**
   * Met a jour le badge du nombre de sauvegardes
   */
  function updateSavedBadge() {
    const stats = SavedAaps.getStats();
    const count = stats.total;

    elements.badgeCount.textContent = count;
    elements.tabBadge.textContent = count;

    if (count > 0) {
      elements.badgeCount.classList.remove('hidden');
      elements.tabBadge.classList.remove('hidden');
    } else {
      elements.badgeCount.classList.add('hidden');
      elements.tabBadge.classList.add('hidden');
    }
  }

  /**
   * Verifie les deadlines urgentes
   */
  function checkUrgentDeadlines() {
    const urgent = SavedAaps.getUrgentDeadlines();
    if (urgent.length === 0) return;

    // Afficher une alerte
    const alertDiv = document.createElement('div');
    alertDiv.className = 'deadline-alert';
    alertDiv.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span class="deadline-alert-text">
        <strong>${urgent.length} AAP</strong> avec deadline dans moins de 7 jours !
      </span>
      <button class="deadline-alert-close" onclick="this.parentElement.remove()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    `;

    // Inserer apres les filtres
    const searchSection = document.querySelector('.search-section');
    searchSection.parentNode.insertBefore(alertDiv, searchSection.nextSibling);
  }

  /**
   * Change d'onglet
   */
  function switchTab(tab) {
    currentTab = tab;

    // Update tabs
    elements.tabSearch.classList.toggle('active', tab === 'search');
    elements.tabSaved.classList.toggle('active', tab === 'saved');

    // Show/hide views
    if (tab === 'search') {
      elements.resultsContainer.classList.remove('hidden');
      elements.savedContainer.classList.add('hidden');
      document.querySelector('.search-section').classList.remove('hidden');
    } else {
      elements.resultsContainer.classList.add('hidden');
      elements.savedContainer.classList.remove('hidden');
      document.querySelector('.search-section').classList.add('hidden');
      displaySavedAaps();
    }

    // Close detail panel
    closeDetailPanel();
  }

  /**
   * Lance une recherche
   */
  async function performSearch() {
    const query = elements.searchInput.value.trim();

    const filters = {
      secteur: elements.filterSecteur.value,
      financeur: elements.filterFinanceur.value,
      statut: elements.filterStatut.value,
      montant: elements.filterMontant.value
    };

    showLoading();

    try {
      // Simuler un delai reseau
      await new Promise(resolve => setTimeout(resolve, 300));

      currentResults = await DataSources.search(query, filters);
      displayResults(currentResults);

    } catch (error) {
      console.error('Erreur recherche:', error);
      showToast('Erreur lors de la recherche', 'error');
    }

    hideLoading();
  }

  /**
   * Affiche les resultats
   */
  function displayResults(results) {
    let displayData = results;

    // Si mode recommandation actif, enrichir avec les scores et trier
    if (recoModeActive && Auth.isLoggedIn()) {
      const profile = Auth.getProfile();
      displayData = Recommendation.enrichWithScores(results, profile);
      displayData = Recommendation.sortByRelevance(displayData);
    }

    // Mettre a jour le compteur
    const countText = recoModeActive
      ? `${displayData.length} resultat${displayData.length > 1 ? 's' : ''} (tries par pertinence)`
      : `${displayData.length} resultat${displayData.length > 1 ? 's' : ''}`;
    elements.resultsCount.textContent = countText;

    // Vider la liste (sauf placeholder)
    const cards = elements.resultsList.querySelectorAll('.result-card');
    cards.forEach(c => c.remove());

    // Supprimer l'alerte profil precedente
    const oldAlert = elements.resultsList.querySelector('.profile-alert');
    if (oldAlert) oldAlert.remove();

    if (displayData.length === 0) {
      elements.resultsPlaceholder.classList.remove('hidden');
      elements.resultsPlaceholder.querySelector('.placeholder-text').textContent =
        'Aucun appel a projet ne correspond a vos criteres';
      return;
    }

    elements.resultsPlaceholder.classList.add('hidden');

    // Afficher alerte si profil incomplet et mode reco
    if (recoModeActive && !isProfileComplete(Auth.getProfile())) {
      const alertHtml = `
        <div class="profile-alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          <div class="profile-alert-text">
            <strong>Profil incomplet</strong>
            Completez votre profil pour des recommandations plus precises.
            <a href="#" class="profile-alert-link" id="alertProfileLink">Completer maintenant</a>
          </div>
        </div>
      `;
      elements.resultsList.insertAdjacentHTML('afterbegin', alertHtml);
      document.getElementById('alertProfileLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        openProfileModal();
      });
    }

    // Creer les cartes
    displayData.forEach(result => {
      const card = createResultCard(result);
      elements.resultsList.appendChild(card);
    });
  }

  /**
   * Cree une carte de resultat
   */
  function createResultCard(result) {
    const deadline = DataSources.getDeadlineStatus(result.dateCloture);
    const montant = DataSources.formatMontant(result.montantMin, result.montantMax, result.subventionRate);
    const isSaved = Auth.isLoggedIn() && SavedAaps.isSaved(result.id);

    const card = document.createElement('div');
    card.className = 'result-card';
    card.dataset.id = result.id;

    // Badge appel a projet si applicable
    const appelProjetBadge = result.isAppelProjet
      ? '<span class="meta-tag tag-appel">Appel a projet</span>'
      : '';

    // Tronquer la description
    const descTrunc = truncate(result.description, 150);

    // Bouton save (seulement si connecte)
    const saveBtn = Auth.isLoggedIn()
      ? `<button class="save-btn ${isSaved ? 'saved' : ''}" data-id="${result.id}" onclick="event.stopPropagation()">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
           </svg>
         </button>`
      : '';

    // Badge score de matching (si mode reco actif)
    let matchScoreBadge = '';
    let matchDetailsHtml = '';

    if (recoModeActive && result.matchScore !== undefined) {
      const scoreClass = result.matchScore >= 60 ? 'score-high' :
                         result.matchScore >= 30 ? 'score-medium' : 'score-low';

      matchScoreBadge = `
        <span class="match-score ${scoreClass}">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          ${result.matchScore}%
        </span>
      `;

      // Details du matching
      if (result.matchDetails && result.matchDetails.length > 0) {
        const matchTags = result.matchDetails.map(m => `
          <span class="match-tag match-${m.type}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            ${m.label}
          </span>
        `).join('');

        matchDetailsHtml = `<div class="match-details">${matchTags}</div>`;
      }
    }

    card.innerHTML = `
      ${matchScoreBadge}
      <div class="result-card-header">
        <h3 class="result-card-title">${escapeHtml(result.titre)}</h3>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="result-card-deadline ${deadline.class}">${deadline.label}</span>
          ${saveBtn}
        </div>
      </div>
      <div class="result-card-meta">
        ${appelProjetBadge}
        <span class="meta-tag tag-secteur">${capitalize(result.secteur)}</span>
        <span class="meta-tag tag-financeur">${escapeHtml(truncate(result.financeur, 30))}</span>
        <span class="meta-tag tag-montant">${montant}</span>
      </div>
      <p class="result-card-description">${escapeHtml(descTrunc)}</p>
      ${matchDetailsHtml}
    `;

    // Click on card
    card.addEventListener('click', () => showDetail(result.id));

    // Click on save button
    const saveBtnEl = card.querySelector('.save-btn');
    if (saveBtnEl) {
      saveBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSave(result, saveBtnEl);
      });
    }

    return card;
  }

  /**
   * Toggle save/unsave
   */
  async function toggleSave(result, btnEl) {
    if (!Auth.isLoggedIn()) {
      openAuthModal();
      return;
    }

    try {
      if (SavedAaps.isSaved(result.id)) {
        await SavedAaps.remove(result.id);
        btnEl.classList.remove('saved');
        showToast('AAP retire des favoris');
      } else {
        await SavedAaps.save(result);
        btnEl.classList.add('saved');
        showToast('AAP sauvegarde !');
      }
      updateSavedBadge();
    } catch (error) {
      console.error('Erreur save:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  }

  /**
   * Affiche les AAP sauvegardes
   */
  function displaySavedAaps() {
    const statusFilter = elements.filterSavedStatus.value;
    let items = SavedAaps.getAll();

    // Filtrer par statut
    if (statusFilter) {
      items = items.filter(item => item.status === statusFilter);
    }

    // Mettre a jour les stats
    const stats = SavedAaps.getStats();
    elements.statTotal.textContent = stats.total;
    elements.statSaved.textContent = stats.saved;
    elements.statApplied.textContent = stats.applied;
    elements.statAccepted.textContent = stats.accepted;

    // Vider la liste
    const cards = elements.savedList.querySelectorAll('.result-card');
    cards.forEach(c => c.remove());

    if (items.length === 0) {
      elements.savedPlaceholder.classList.remove('hidden');
      return;
    }

    elements.savedPlaceholder.classList.add('hidden');

    // Creer les cartes
    items.forEach(item => {
      const result = item.aap_data;
      const card = createSavedCard(item, result);
      elements.savedList.appendChild(card);
    });
  }

  /**
   * Cree une carte pour AAP sauvegarde
   */
  function createSavedCard(item, result) {
    const deadline = DataSources.getDeadlineStatus(result.dateCloture);
    const montant = DataSources.formatMontant(result.montantMin, result.montantMax, result.subventionRate);

    const card = document.createElement('div');
    card.className = 'result-card';
    card.dataset.id = result.id;

    // Status badge
    const statusLabels = {
      saved: 'Sauvegarde',
      applied: 'Candidature envoyee',
      accepted: 'Accepte',
      rejected: 'Rejete'
    };

    const statusBadge = `<span class="status-badge status-${item.status}">${statusLabels[item.status]}</span>`;

    card.innerHTML = `
      <div class="result-card-header">
        <h3 class="result-card-title">${escapeHtml(result.titre)}</h3>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="result-card-deadline ${deadline.class}">${deadline.label}</span>
          <button class="save-btn saved" data-id="${result.id}" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="result-card-meta">
        ${statusBadge}
        <span class="meta-tag tag-secteur">${capitalize(result.secteur)}</span>
        <span class="meta-tag tag-financeur">${escapeHtml(truncate(result.financeur, 30))}</span>
        <span class="meta-tag tag-montant">${montant}</span>
      </div>
      ${item.notes ? `<p class="result-card-description"><em>Note:</em> ${escapeHtml(truncate(item.notes, 100))}</p>` : ''}
    `;

    // Click on card
    card.addEventListener('click', () => showSavedDetail(item));

    // Click on save button (to remove)
    const saveBtnEl = card.querySelector('.save-btn');
    saveBtnEl.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        await SavedAaps.remove(result.id);
        showToast('AAP retire des favoris');
        updateSavedBadge();
        displaySavedAaps();
      } catch (error) {
        showToast('Erreur', 'error');
      }
    });

    return card;
  }

  /**
   * Tronque un texte
   */
  function truncate(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Affiche le detail d'un appel a projet
   */
  async function showDetail(id) {
    // Trouver dans les resultats actuels d'abord (evite un appel API)
    let result = currentResults.find(r => r.id === id);

    // Sinon charger via API
    if (!result) {
      result = await DataSources.getDetail(id);
    }

    if (!result) return;

    selectedId = id;
    const deadline = DataSources.getDeadlineStatus(result.dateCloture);
    const montant = DataSources.formatMontant(result.montantMin, result.montantMax, result.subventionRate);
    const isSaved = Auth.isLoggedIn() && SavedAaps.isSaved(result.id);

    // Badge source
    const sourceBadge = result.source === 'aides-territoires'
      ? '<span class="detail-source">Source : Aides-territoires</span>'
      : '';

    // Badge appel a projet
    const appelBadge = result.isAppelProjet
      ? '<span class="detail-badge appel">Appel a projet</span>'
      : '';

    // Contact si disponible
    const contactSection = result.contact
      ? `<div class="detail-section">
          <div class="detail-section-title">Contact</div>
          <div class="detail-section-content">${result.contact}</div>
        </div>`
      : '';

    // Lien candidature si different
    const candidatureBtn = result.lienCandidature && result.lienCandidature !== result.lien
      ? `<a href="${result.lienCandidature}" target="_blank" rel="noopener" class="detail-cta secondary">
          Candidater directement
        </a>`
      : '';

    // Bouton save
    const saveSection = Auth.isLoggedIn()
      ? `<button class="detail-cta ${isSaved ? 'secondary' : ''}" id="detailSaveBtn">
           ${isSaved ? 'Retirer des favoris' : 'Sauvegarder cet AAP'}
         </button>`
      : '';

    // Section IA (si connecte)
    const aiSection = Auth.isLoggedIn()
      ? `<div class="ai-section">
           <button class="btn-ai" id="btnAiAnalyze">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4a2 2 0 0 1-2-2 4 4 0 0 1 4-4z"/>
               <path d="M8 8v8a4 4 0 0 0 8 0V8"/>
               <path d="M12 16v6"/>
             </svg>
             Analyser avec l'IA
           </button>
           <button class="btn-ai" id="btnAiDraft" style="margin-left: 0.5rem;">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
               <polyline points="14 2 14 8 20 8"/>
               <line x1="16" y1="13" x2="8" y2="13"/>
               <line x1="16" y1="17" x2="8" y2="17"/>
             </svg>
             Generer brouillon
           </button>
         </div>
         <div id="aiAnalysisContainer"></div>`
      : '';

    const html = `
      <h2>${escapeHtml(result.titre)}</h2>
      ${sourceBadge}
      ${appelBadge}

      ${aiSection}

      <div class="detail-section">
        <div class="detail-section-title">Financeur</div>
        <div class="detail-section-content">
          <strong>${escapeHtml(result.financeur)}</strong>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">Description</div>
        <div class="detail-section-content">
          ${escapeHtml(result.description)}
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">Financement</div>
        <div class="detail-section-content">
          ${montant}
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">Dates</div>
        <div class="detail-section-content">
          ${result.dateOuverture ? `<div>Ouverture : ${formatDate(result.dateOuverture)}</div>` : ''}
          <div>Cloture : <strong class="${deadline.class}">${result.dateCloture ? formatDate(result.dateCloture) : 'Permanent'}</strong></div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">Beneficiaires eligibles</div>
        <div class="detail-section-content">
          ${Array.isArray(result.beneficiaires) ? result.beneficiaires.join(', ') : result.beneficiaires}
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">Territoires</div>
        <div class="detail-section-content">
          ${Array.isArray(result.territoires) ? result.territoires.join(', ') : result.territoires}
        </div>
      </div>

      ${contactSection}

      ${saveSection}
      <a href="${result.lien}" target="_blank" rel="noopener" class="detail-cta">
        Voir le detail de l'aide
      </a>
      ${candidatureBtn}
    `;

    elements.detailPanelContent.innerHTML = html;
    elements.detailPanel.classList.remove('hidden');

    // Save button handler
    const detailSaveBtn = document.getElementById('detailSaveBtn');
    if (detailSaveBtn) {
      detailSaveBtn.addEventListener('click', async () => {
        await toggleSave(result, detailSaveBtn);
        // Update button text
        const nowSaved = SavedAaps.isSaved(result.id);
        detailSaveBtn.textContent = nowSaved ? 'Retirer des favoris' : 'Sauvegarder cet AAP';
        detailSaveBtn.classList.toggle('secondary', nowSaved);
      });
    }

    // AI button handlers
    const btnAiAnalyze = document.getElementById('btnAiAnalyze');
    const btnAiDraft = document.getElementById('btnAiDraft');
    const aiContainer = document.getElementById('aiAnalysisContainer');

    if (btnAiAnalyze) {
      btnAiAnalyze.addEventListener('click', async () => {
        btnAiAnalyze.classList.add('loading');
        btnAiAnalyze.disabled = true;

        try {
          const analysis = await AIService.analyzeMatch(result);
          displayAiAnalysis(analysis, aiContainer);
        } catch (error) {
          console.error('[AI Error]', error);
          showToast('Erreur IA - verifiez que le serveur est demarre', 'error');
        }

        btnAiAnalyze.classList.remove('loading');
        btnAiAnalyze.disabled = false;
      });
    }

    if (btnAiDraft) {
      btnAiDraft.addEventListener('click', async () => {
        btnAiDraft.classList.add('loading');
        btnAiDraft.disabled = true;

        try {
          const draft = await AIService.generateDraft(result);
          showDraftModal(draft, result);
        } catch (error) {
          console.error('[AI Error]', error);
          showToast('Erreur IA - verifiez que le serveur est demarre', 'error');
        }

        btnAiDraft.classList.remove('loading');
        btnAiDraft.disabled = false;
      });
    }

    // Surligner la carte
    document.querySelectorAll('.result-card').forEach(c => {
      c.style.borderColor = c.dataset.id === id ? 'var(--accent-primary)' : '';
    });
  }

  /**
   * Affiche le detail d'un AAP sauvegarde (avec actions de statut)
   */
  function showSavedDetail(item) {
    const result = item.aap_data;
    selectedId = result.id;

    const deadline = DataSources.getDeadlineStatus(result.dateCloture);
    const montant = DataSources.formatMontant(result.montantMin, result.montantMax, result.subventionRate);

    const html = `
      <h2>${escapeHtml(result.titre)}</h2>

      <div class="detail-section">
        <div class="detail-section-title">Financeur</div>
        <div class="detail-section-content">
          <strong>${escapeHtml(result.financeur)}</strong>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">Description</div>
        <div class="detail-section-content">
          ${escapeHtml(result.description)}
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">Financement</div>
        <div class="detail-section-content">
          ${montant}
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">Dates</div>
        <div class="detail-section-content">
          <div>Cloture : <strong class="${deadline.class}">${result.dateCloture ? formatDate(result.dateCloture) : 'Permanent'}</strong></div>
        </div>
      </div>

      <div class="status-actions">
        <button class="status-btn btn-applied ${item.status === 'applied' ? 'active' : ''}" data-status="applied">
          Candidature envoyee
        </button>
        <button class="status-btn btn-accepted ${item.status === 'accepted' ? 'active' : ''}" data-status="accepted">
          Accepte
        </button>
        <button class="status-btn btn-rejected ${item.status === 'rejected' ? 'active' : ''}" data-status="rejected">
          Rejete
        </button>
      </div>

      <div class="notes-section">
        <div class="detail-section-title">Notes personnelles</div>
        <textarea class="notes-textarea" id="notesTextarea" placeholder="Ajoutez vos notes ici...">${item.notes || ''}</textarea>
      </div>

      <a href="${result.lien}" target="_blank" rel="noopener" class="detail-cta">
        Voir le detail de l'aide
      </a>
    `;

    elements.detailPanelContent.innerHTML = html;
    elements.detailPanel.classList.remove('hidden');

    // Status button handlers
    document.querySelectorAll('.status-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const newStatus = btn.dataset.status;
        try {
          await SavedAaps.updateStatus(result.id, newStatus);
          document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          showToast('Statut mis a jour');
          displaySavedAaps();
        } catch (error) {
          showToast('Erreur', 'error');
        }
      });
    });

    // Notes handler (save on blur)
    const notesTextarea = document.getElementById('notesTextarea');
    notesTextarea.addEventListener('blur', async () => {
      try {
        await SavedAaps.updateNotes(result.id, notesTextarea.value);
        displaySavedAaps();
      } catch (error) {
        console.error('Erreur notes:', error);
      }
    });

    // Surligner la carte
    document.querySelectorAll('.result-card').forEach(c => {
      c.style.borderColor = c.dataset.id === result.id ? 'var(--accent-primary)' : '';
    });
  }

  /**
   * Ferme le panel de detail
   */
  function closeDetailPanel() {
    elements.detailPanel.classList.add('hidden');
    selectedId = null;

    document.querySelectorAll('.result-card').forEach(c => {
      c.style.borderColor = '';
    });
  }

  /**
   * Toggle dropdown menu
   */
  function toggleDropdown() {
    elements.dropdownMenu.classList.toggle('hidden');
  }

  // ============================================
  // Auth Modal
  // ============================================

  function openAuthModal() {
    elements.authModal.classList.remove('hidden');
    elements.authEmail.focus();
  }

  function closeAuthModal() {
    elements.authModal.classList.add('hidden');
    elements.authForm.reset();
    elements.authError.classList.add('hidden');
  }

  function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;

    if (isSignUpMode) {
      elements.authModalTitle.textContent = 'Creer un compte';
      elements.authSubmit.textContent = 'S\'inscrire';
      elements.authSwitchText.textContent = 'Deja un compte ?';
      elements.authSwitchBtn.textContent = 'Se connecter';
    } else {
      elements.authModalTitle.textContent = 'Connexion';
      elements.authSubmit.textContent = 'Se connecter';
      elements.authSwitchText.textContent = 'Pas encore de compte ?';
      elements.authSwitchBtn.textContent = 'Creer un compte';
    }
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();

    const email = elements.authEmail.value.trim();
    const password = elements.authPassword.value;

    elements.authSubmit.disabled = true;
    elements.authError.classList.add('hidden');

    try {
      if (isSignUpMode) {
        await Auth.signUp(email, password);
        showToast('Compte cree ! Verifiez votre email.');
      } else {
        await Auth.signIn(email, password);
        showToast('Connexion reussie !');
      }
      closeAuthModal();
    } catch (error) {
      console.error('Auth error:', error);
      elements.authError.textContent = error.message || 'Erreur de connexion';
      elements.authError.classList.remove('hidden');
    }

    elements.authSubmit.disabled = false;
  }

  async function handleLogout() {
    try {
      await Auth.signOut();
      elements.dropdownMenu.classList.add('hidden');
      showToast('Deconnexion reussie');
    } catch (error) {
      showToast('Erreur de deconnexion', 'error');
    }
  }

  // ============================================
  // Profile Modal
  // ============================================

  function openProfileModal() {
    elements.dropdownMenu.classList.add('hidden');
    elements.profileModal.classList.remove('hidden');

    // Charger les donnees existantes
    const profile = Auth.getProfile();
    if (profile) {
      document.getElementById('profileNom').value = profile.nom_association || '';
      document.getElementById('profileSiret').value = profile.siret || '';
      document.getElementById('profileDescription').value = profile.description || '';
      document.getElementById('profileAdresse').value = profile.adresse || '';
      document.getElementById('profileCP').value = profile.code_postal || '';
      document.getElementById('profileVille').value = profile.ville || '';
      document.getElementById('profileEmail').value = profile.email_contact || '';
      document.getElementById('profileTel').value = profile.telephone || '';
      document.getElementById('profileBudget').value = profile.budget_annuel || '';
      document.getElementById('profileSalaries').value = profile.nb_salaries || '';

      // Secteurs
      const secteurs = profile.secteurs || [];
      document.querySelectorAll('#profileSecteurs input').forEach(cb => {
        cb.checked = secteurs.includes(cb.value);
      });
    }
  }

  function closeProfileModal() {
    elements.profileModal.classList.add('hidden');
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();

    const secteurs = [];
    document.querySelectorAll('#profileSecteurs input:checked').forEach(cb => {
      secteurs.push(cb.value);
    });

    const profileData = {
      nom_association: document.getElementById('profileNom').value,
      siret: document.getElementById('profileSiret').value,
      description: document.getElementById('profileDescription').value,
      adresse: document.getElementById('profileAdresse').value,
      code_postal: document.getElementById('profileCP').value,
      ville: document.getElementById('profileVille').value,
      email_contact: document.getElementById('profileEmail').value,
      telephone: document.getElementById('profileTel').value,
      budget_annuel: parseInt(document.getElementById('profileBudget').value) || null,
      nb_salaries: parseInt(document.getElementById('profileSalaries').value) || null,
      secteurs
    };

    try {
      await Auth.updateProfile(profileData);
      showToast('Profil enregistre !');
      closeProfileModal();

      // Mettre a jour l'avatar
      const initial = (profileData.nom_association || Auth.getUser()?.email || 'U').charAt(0).toUpperCase();
      elements.userAvatar.textContent = initial;

    } catch (error) {
      console.error('Profile error:', error);
      elements.profileError.textContent = error.message || 'Erreur';
      elements.profileError.classList.remove('hidden');
    }
  }

  // ============================================
  // Utilitaires
  // ============================================

  function showLoading() {
    elements.loadingOverlay.classList.remove('hidden');
  }

  function hideLoading() {
    elements.loadingOverlay.classList.add('hidden');
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // ============================================
  // Fonctions IA
  // ============================================

  /**
   * Affiche l'analyse IA dans le container
   */
  function displayAiAnalysis(analysis, container) {
    const reasonsHtml = analysis.reasons
      .map(r => `<li>${escapeHtml(r)}</li>`)
      .join('');

    container.innerHTML = `
      <div class="ai-analysis">
        <div class="ai-analysis-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4a2 2 0 0 1-2-2 4 4 0 0 1 4-4z"/>
            <path d="M8 8v8a4 4 0 0 0 8 0V8"/>
          </svg>
          Analyse IA
        </div>
        <div class="ai-score-big">${analysis.score}% de pertinence</div>
        <ul class="ai-reasons">${reasonsHtml}</ul>
        <div class="ai-conseil">
          <strong>Conseil :</strong> ${escapeHtml(analysis.conseil)}
        </div>
      </div>
    `;
  }

  /**
   * Affiche la modale avec le brouillon genere
   */
  function showDraftModal(draft, aap) {
    // Creer la modale si elle n'existe pas
    let modal = document.getElementById('draftModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'draftModal';
      modal.className = 'modal-overlay hidden';
      document.body.appendChild(modal);
    }

    const sectionsHtml = Object.entries(draft.sections)
      .filter(([key, value]) => value)
      .map(([key, value]) => {
        const titles = {
          presentation: 'Presentation de l\'association',
          projet: 'Description du projet',
          objectifs: 'Objectifs',
          budget: 'Budget previsionnel',
          calendrier: 'Calendrier'
        };
        const highlighted = value.replace(/\[A COMPLETER\]/g, '<mark>[A COMPLETER]</mark>');
        return `
          <div class="draft-section">
            <div class="draft-section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              ${titles[key] || key}
            </div>
            <div class="draft-content">${highlighted}</div>
            <button class="btn-copy" data-section="${key}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copier
            </button>
          </div>
        `;
      })
      .join('');

    const conseilsHtml = (draft.conseils || [])
      .map(c => `<li>${escapeHtml(c)}</li>`)
      .join('');

    modal.innerHTML = `
      <div class="modal modal-large draft-modal">
        <button class="modal-close" id="draftModalClose">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div class="modal-header">
          <h2 class="modal-title">
            <span class="ai-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4a2 2 0 0 1-2-2 4 4 0 0 1 4-4z"/>
              </svg>
              IA
            </span>
            Brouillon de candidature
          </h2>
          <p class="modal-subtitle">Pour : ${escapeHtml(aap.titre)}</p>
        </div>

        <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
          ${sectionsHtml}

          ${conseilsHtml ? `
            <div class="draft-section">
              <div class="draft-section-title">Conseils</div>
              <ul class="ai-reasons">${conseilsHtml}</ul>
            </div>
          ` : ''}
        </div>

        <div class="draft-actions">
          <button class="btn-primary" id="copyAllDraft">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;margin-right:0.5rem">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copier tout le brouillon
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    // Event handlers
    document.getElementById('draftModalClose').addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });

    // Copy buttons
    modal.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        const text = draft.sections[section];
        navigator.clipboard.writeText(text);
        showToast('Section copiee !');
      });
    });

    document.getElementById('copyAllDraft').addEventListener('click', () => {
      const allText = Object.entries(draft.sections)
        .filter(([k, v]) => v)
        .map(([k, v]) => `## ${k.toUpperCase()}\n\n${v}`)
        .join('\n\n---\n\n');
      navigator.clipboard.writeText(allText);
      showToast('Brouillon complet copie !');
    });
  }

  // Demarrer
  document.addEventListener('DOMContentLoaded', init);
})();
