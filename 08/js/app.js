/**
 * EntreGraphe - Main Application
 * Orchestration de l'application
 */

(function() {
  'use strict';

  // ============================================
  // Cache API pour reduire les appels
  // ============================================
  const APICache = {
    data: new Map(),
    maxAge: 30 * 60 * 1000, // 30 minutes

    get(key) {
      const cached = this.data.get(key);
      if (!cached) return null;
      if (Date.now() - cached.timestamp > this.maxAge) {
        this.data.delete(key);
        return null;
      }
      return cached.value;
    },

    set(key, value) {
      this.data.set(key, {
        value,
        timestamp: Date.now()
      });
    },

    getStats() {
      return {
        entries: this.data.size,
        hits: this._hits || 0,
        misses: this._misses || 0
      };
    },

    recordHit() { this._hits = (this._hits || 0) + 1; },
    recordMiss() { this._misses = (this._misses || 0) + 1; }
  };

  // Elements DOM
  const elements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    searchSuggestions: document.getElementById('searchSuggestions'),
    apiKeyToggle: document.getElementById('apiKeyToggle'),
    apiKeyForm: document.getElementById('apiKeyForm'),
    apiKeyInput: document.getElementById('apiKeyInput'),
    apiKeySave: document.getElementById('apiKeySave'),
    graphContainer: document.getElementById('graphContainer'),
    graphPlaceholder: document.getElementById('graphPlaceholder'),
    graphSvg: document.getElementById('graphSvg'),
    infoPanel: document.getElementById('infoPanel'),
    infoPanelContent: document.getElementById('infoPanelContent'),
    infoPanelClose: document.getElementById('infoPanelClose'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    toastContainer: document.getElementById('toastContainer'),
    statsPanel: document.getElementById('statsPanel')
  };

  // Etat de l'application
  let currentEntreprise = null;
  let searchTimeout = null;

  /**
   * Initialisation de l'application
   */
  function init() {
    // Initialiser le graphe avec les callbacks
    GraphViz.init(elements.graphSvg, handleNodeClick, handleNodeExpand);

    // Configurer les evenements
    setupEventListeners();

    // Verifier si une cle API est deja configuree
    if (PappersAPI.hasApiKey()) {
      elements.apiKeyInput.value = '********';
    }

    // Focus sur la recherche
    elements.searchInput.focus();
  }

  /**
   * Configure les ecouteurs d'evenements
   */
  function setupEventListeners() {
    // Recherche
    elements.searchInput.addEventListener('input', handleSearchInput);
    elements.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
    elements.searchBtn.addEventListener('click', performSearch);

    // Cle API
    elements.apiKeyToggle.addEventListener('click', toggleApiKeyForm);
    elements.apiKeySave.addEventListener('click', saveApiKey);
    elements.apiKeyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveApiKey();
      }
    });

    // Panel d'info
    elements.infoPanelClose.addEventListener('click', closeInfoPanel);

    // Clic en dehors des suggestions
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        hideSuggestions();
      }
    });
  }

  /**
   * Gere la saisie dans la recherche
   */
  function handleSearchInput(e) {
    const query = e.target.value.trim();

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (query.length < 2) {
      hideSuggestions();
      return;
    }

    // Debounce de 400ms (augmente pour reduire les appels)
    searchTimeout = setTimeout(() => {
      fetchSuggestions(query);
    }, 400);
  }

  /**
   * Recupere les suggestions d'autocompletion (avec cache)
   */
  async function fetchSuggestions(query) {
    if (!PappersAPI.hasApiKey()) {
      showToast('Veuillez configurer votre cle API Pappers', 'error');
      return;
    }

    // Verifier le cache
    const cacheKey = `search_${query.toLowerCase()}`;
    const cached = APICache.get(cacheKey);
    if (cached) {
      APICache.recordHit();
      displaySuggestions(cached);
      return;
    }

    try {
      APICache.recordMiss();
      const results = await PappersAPI.searchEntreprises(query, 5);
      APICache.set(cacheKey, results);
      displaySuggestions(results);
    } catch (error) {
      console.error('Erreur suggestions:', error);
    }
  }

  /**
   * Affiche les suggestions
   */
  function displaySuggestions(results) {
    if (results.length === 0) {
      hideSuggestions();
      return;
    }

    elements.searchSuggestions.innerHTML = results.map(r => `
      <div class="suggestion-item" data-siren="${r.siren}">
        <div class="suggestion-name">${escapeHtml(r.nom_entreprise || r.denomination || 'Entreprise')}</div>
        <div class="suggestion-info">
          SIREN: ${r.siren || 'N/A'} | ${r.siege?.ville || r.ville || 'France'}
        </div>
      </div>
    `).join('');

    // Evenements sur les suggestions
    elements.searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const siren = item.dataset.siren;
        elements.searchInput.value = item.querySelector('.suggestion-name').textContent;
        hideSuggestions();
        loadEntreprise(siren);
      });
    });

    elements.searchSuggestions.classList.add('active');
  }

  /**
   * Cache les suggestions
   */
  function hideSuggestions() {
    elements.searchSuggestions.classList.remove('active');
    elements.searchSuggestions.innerHTML = '';
  }

  /**
   * Lance une recherche
   */
  async function performSearch() {
    const query = elements.searchInput.value.trim();

    if (!query) {
      showToast('Veuillez saisir un nom ou SIREN', 'error');
      return;
    }

    if (!PappersAPI.hasApiKey()) {
      showToast('Veuillez configurer votre cle API Pappers', 'error');
      elements.apiKeyForm.classList.remove('hidden');
      return;
    }

    hideSuggestions();
    showLoading();

    try {
      const results = await PappersAPI.searchEntreprises(query, 1);

      if (results.length === 0) {
        showToast('Aucune entreprise trouvee', 'error');
        hideLoading();
        return;
      }

      const siren = results[0].siren;
      await loadEntreprise(siren);
    } catch (error) {
      showToast(error.message, 'error');
      hideLoading();
    }
  }

  /**
   * Charge et affiche le graphe pour une entreprise (avec cache)
   */
  async function loadEntreprise(siren) {
    showLoading();

    // Verifier le cache
    const cacheKey = `graph_${siren}`;
    let graphData = APICache.get(cacheKey);

    try {
      if (graphData) {
        APICache.recordHit();
        showToast('Donnees du cache', 'success');
      } else {
        APICache.recordMiss();
        graphData = await PappersAPI.buildRelationsGraph(siren);
        APICache.set(cacheKey, graphData);
      }

      currentEntreprise = graphData.mainEntreprise;

      // Cacher le placeholder
      elements.graphPlaceholder.classList.add('hidden');

      // Afficher le graphe
      GraphViz.render(graphData);

      // Afficher le panel d'info
      showInfoPanel(graphData.mainEntreprise, true);

      // Mettre a jour les stats
      updateStats();

      hideLoading();
    } catch (error) {
      console.error('Erreur chargement:', error);
      showToast(error.message, 'error');
      hideLoading();
    }
  }

  /**
   * Gere le clic sur un noeud du graphe
   */
  function handleNodeClick(node) {
    GraphViz.highlightNode(node.id);
    showInfoPanel(node.data, node.type === 'company', node);
  }

  /**
   * Gere l'expansion d'un noeud (bouton +)
   */
  async function handleNodeExpand(node) {
    showLoading();

    try {
      const existingNodeIds = GraphViz.getNodeIds();

      if (node.type === 'company' && node.siren) {
        // Etendre une entreprise
        const cacheKey = `expand_${node.siren}`;
        let result = APICache.get(cacheKey);

        if (result) {
          APICache.recordHit();
        } else {
          APICache.recordMiss();
          result = await PappersAPI.expandCompanyRelations(node.siren, existingNodeIds);
          APICache.set(cacheKey, result);
        }

        if (result.newNodes.length === 0) {
          showToast('Aucune nouvelle relation trouvee', 'info');
        } else {
          GraphViz.addNodes(result.newNodes, result.newLinks);
          GraphViz.markExpanded(node.id);
          showToast(`+${result.newNodes.length} noeuds ajoutes`, 'success');
        }

      } else if (node.type === 'person') {
        // Trouver les autres mandats de la personne
        const nom = node.data.nom || '';
        const prenom = node.data.prenom || '';
        const cacheKey = `mandates_${nom}_${prenom}`;

        let result = APICache.get(cacheKey);

        if (result) {
          APICache.recordHit();
        } else {
          APICache.recordMiss();
          result = await PappersAPI.getPersonMandatesGraph(nom, prenom, node.id, existingNodeIds);
          APICache.set(cacheKey, result);
        }

        if (result.newNodes.length === 0) {
          showToast('Aucune autre entreprise trouvee', 'info');
        } else {
          GraphViz.addNodes(result.newNodes, result.newLinks);
          GraphViz.markExpanded(node.id);
          showToast(`+${result.newNodes.length} entreprises trouvees`, 'success');
        }
      }

      updateStats();
      hideLoading();

    } catch (error) {
      console.error('Erreur expansion:', error);
      showToast(error.message, 'error');
      hideLoading();
    }
  }

  /**
   * Affiche le panel d'information
   */
  function showInfoPanel(data, isCompany, node = null) {
    let html = '';

    if (isCompany) {
      // Affichage entreprise
      const nom = data.nom_entreprise || data.denomination || 'Entreprise';
      const siren = data.siren || 'N/A';
      const siege = data.siege || {};

      html = `
        <h2>${escapeHtml(nom)}</h2>
        <div class="info-siren">SIREN: ${siren}</div>

        <div class="info-section">
          <div class="info-section-title">Informations generales</div>
          ${data.forme_juridique ? `
            <div class="info-item">
              <div class="info-item-label">Forme juridique</div>
              <div class="info-item-value">${escapeHtml(data.forme_juridique)}</div>
            </div>
          ` : ''}
          ${data.date_creation ? `
            <div class="info-item">
              <div class="info-item-label">Date de creation</div>
              <div class="info-item-value">${formatDate(data.date_creation)}</div>
            </div>
          ` : ''}
          ${data.capital ? `
            <div class="info-item">
              <div class="info-item-label">Capital social</div>
              <div class="info-item-value">${formatMoney(data.capital)}</div>
            </div>
          ` : ''}
          <div class="info-item">
            <div class="info-item-label">Statut</div>
            <div class="info-item-value">
              <span class="info-badge ${data.entreprise_cessee ? 'inactive' : 'active'}">
                ${data.entreprise_cessee ? 'Cessee' : 'En activite'}
              </span>
            </div>
          </div>
        </div>

        ${siege.adresse ? `
          <div class="info-section">
            <div class="info-section-title">Siege social</div>
            <div class="info-item">
              <div class="info-item-value">
                ${escapeHtml(siege.adresse)}<br>
                ${siege.code_postal || ''} ${escapeHtml(siege.ville || '')}
              </div>
            </div>
          </div>
        ` : ''}

        ${data.activite_principale ? `
          <div class="info-section">
            <div class="info-section-title">Activite</div>
            <div class="info-item">
              <div class="info-item-label">Code NAF: ${data.code_naf || 'N/A'}</div>
              <div class="info-item-value">${escapeHtml(data.activite_principale)}</div>
            </div>
          </div>
        ` : ''}

        ${node && !node.isMain && data.siren ? `
          <button class="explore-btn" onclick="App.exploreCompany('${data.siren}')">
            Nouvelle recherche sur cette entreprise
          </button>
        ` : ''}

        ${node && node.isBridge ? `
          <div class="info-bridge-badge">
            Noeud-pont : connecte plusieurs entreprises
          </div>
        ` : ''}
      `;
    } else {
      // Affichage personne
      const nom = data.nom || '';
      const prenom = data.prenom || '';
      const qualite = data.qualite || 'N/A';

      html = `
        <h2>${escapeHtml(prenom)} ${escapeHtml(nom)}</h2>

        ${node && node.isBridge ? `
          <div class="info-bridge-badge">
            Noeud-pont : present dans plusieurs entreprises
          </div>
        ` : ''}

        <div class="info-section">
          <div class="info-section-title">Role</div>
          <div class="info-item">
            <div class="info-item-value">${escapeHtml(qualite)}</div>
          </div>
          ${data.date_prise_de_poste ? `
            <div class="info-item">
              <div class="info-item-label">Depuis le</div>
              <div class="info-item-value">${formatDate(data.date_prise_de_poste)}</div>
            </div>
          ` : ''}
        </div>

        ${data.nationalite ? `
          <div class="info-section">
            <div class="info-section-title">Informations</div>
            <div class="info-item">
              <div class="info-item-label">Nationalite</div>
              <div class="info-item-value">${escapeHtml(data.nationalite)}</div>
            </div>
          </div>
        ` : ''}

        ${data.pourcentage_parts ? `
          <div class="info-section">
            <div class="info-section-title">Participation</div>
            <div class="info-item">
              <div class="info-item-label">Parts detenues</div>
              <div class="info-item-value">${data.pourcentage_parts}%</div>
            </div>
            ${data.pourcentage_votes ? `
              <div class="info-item">
                <div class="info-item-label">Droits de vote</div>
                <div class="info-item-value">${data.pourcentage_votes}%</div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <p class="info-hint">
          Cliquez sur le bouton + sur le noeud pour voir les autres entreprises
        </p>
      `;
    }

    elements.infoPanelContent.innerHTML = html;
    elements.infoPanel.classList.remove('hidden');
  }

  /**
   * Ferme le panel d'information
   */
  function closeInfoPanel() {
    elements.infoPanel.classList.add('hidden');
    GraphViz.clearHighlight();
  }

  /**
   * Toggle le formulaire de cle API
   */
  function toggleApiKeyForm() {
    elements.apiKeyForm.classList.toggle('hidden');
    if (!elements.apiKeyForm.classList.contains('hidden')) {
      elements.apiKeyInput.focus();
    }
  }

  /**
   * Sauvegarde la cle API
   */
  function saveApiKey() {
    const key = elements.apiKeyInput.value.trim();

    if (!key || key === '********') {
      showToast('Veuillez saisir une cle API valide', 'error');
      return;
    }

    PappersAPI.setApiKey(key);
    elements.apiKeyInput.value = '********';
    elements.apiKeyForm.classList.add('hidden');
    showToast('Cle API sauvegardee', 'success');
  }

  /**
   * Explore une entreprise liee (nouvelle recherche)
   */
  function exploreCompany(siren) {
    elements.searchInput.value = siren;
    loadEntreprise(siren);
  }

  /**
   * Met a jour les statistiques affichees
   */
  function updateStats() {
    const nodes = GraphViz.getNodes();
    const links = GraphViz.getLinks();
    const cache = APICache.getStats();

    const companies = nodes.filter(n => n.type === 'company').length;
    const persons = nodes.filter(n => n.type === 'person').length;
    const bridges = nodes.filter(n => n.isBridge).length;

    // Mettre a jour le panel de stats s'il existe
    if (elements.statsPanel) {
      elements.statsPanel.innerHTML = `
        <span>${companies} entreprises</span>
        <span>${persons} personnes</span>
        <span>${bridges} ponts</span>
        <span>${links.length} liens</span>
        <span title="Cache hits/misses">Cache: ${cache.hits}/${cache.misses}</span>
      `;
    }
  }

  /**
   * Affiche l'overlay de chargement
   */
  function showLoading() {
    elements.loadingOverlay.classList.remove('hidden');
  }

  /**
   * Cache l'overlay de chargement
   */
  function hideLoading() {
    elements.loadingOverlay.classList.add('hidden');
  }

  /**
   * Affiche un toast
   */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<p class="toast-message">${escapeHtml(message)}</p>`;

    elements.toastContainer.appendChild(toast);

    // Supprimer apres 3 secondes
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Echappe le HTML
   */
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Formate une date
   */
  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  /**
   * Formate un montant
   */
  function formatMoney(amount) {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Exposer les fonctions necessaires globalement
  window.App = {
    exploreCompany
  };

  // Demarrer l'application
  document.addEventListener('DOMContentLoaded', init);
})();
