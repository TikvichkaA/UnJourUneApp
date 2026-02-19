/**
 * SubTracker - Module Découverte AAP
 * (migré depuis sources.js + supabase-aaps.js)
 */
var DiscoveryModule = (function() {
  'use strict';

  var results = [];
  var selectedAap = null;
  var containerEl = null;
  var recoMode = false;

  // Demo data (fallback)
  var DEMO_DATA = [
    { id: 'demo-1', titre: 'Transition écologique des associations', description: "Soutien aux associations pour la transition écologique.", financeur: 'ADEME', financeurType: 'etat', secteur: 'environnement', montantMin: 5000, montantMax: 50000, dateOuverture: '2025-01-01', dateCloture: '2025-06-30', lien: '#', territoires: ['National'], beneficiaires: ['Associations'], isAppelProjet: true, source: 'demo' },
    { id: 'demo-2', titre: 'Fonds culturels de proximité', description: "Projets culturels locaux.", financeur: 'Ministère de la Culture', financeurType: 'etat', secteur: 'culture', montantMin: 2000, montantMax: 20000, dateOuverture: '2025-01-15', dateCloture: '2025-07-15', lien: '#', territoires: ['National'], beneficiaires: ['Associations'], isAppelProjet: true, source: 'demo' },
    { id: 'demo-3', titre: 'Sport pour tous', description: "Financement clubs sportifs associatifs.", financeur: 'Agence nationale du Sport', financeurType: 'etat', secteur: 'sport', montantMin: 1000, montantMax: 15000, dateOuverture: '2025-02-01', dateCloture: '2025-05-31', lien: '#', territoires: ['National'], beneficiaires: ['Associations sportives'], isAppelProjet: false, source: 'demo' }
  ];

  async function render(container) {
    containerEl = container;

    container.innerHTML =
      '<div class="page-header">' +
        '<div class="page-header-row">' +
          '<div>' +
            '<h1 class="page-title">Découvrir des AAP</h1>' +
            '<p class="page-subtitle">Appels à projets et dispositifs de financement</p>' +
          '</div>' +
          '<div style="display:flex;gap:0.5rem">' +
            '<button class="btn ' + (recoMode ? 'btn-primary' : 'btn-secondary') + ' btn-sm" id="toggleReco">Recommandations IA</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="page-body">' +
        '<div class="search-bar">' +
          '<div class="search-input-wrap">' +
            '<span class="search-input-icon">&#128269;</span>' +
            '<input type="text" class="form-input" id="discoverySearch" placeholder="Rechercher un AAP...">' +
          '</div>' +
          '<button class="btn btn-primary" id="discoverySearchBtn">Rechercher</button>' +
        '</div>' +
        '<div class="filters-row" style="margin-bottom:1rem">' +
          '<select class="filter-select" id="filterSecteur"><option value="">Secteur</option>' +
            '<option value="culture">Culture</option><option value="environnement">Environnement</option>' +
            '<option value="social">Social</option><option value="education">Éducation</option>' +
            '<option value="sante">Santé</option><option value="sport">Sport</option>' +
            '<option value="solidarite">Solidarité</option><option value="numerique">Numérique</option>' +
          '</select>' +
          '<select class="filter-select" id="filterFinanceur"><option value="">Financeur</option>' +
            '<option value="etat">État</option><option value="region">Région</option>' +
            '<option value="departement">Département</option><option value="commune">Commune</option>' +
            '<option value="europe">Europe</option><option value="fondation">Fondation</option>' +
          '</select>' +
          '<select class="filter-select" id="filterStatut"><option value="">Statut</option>' +
            '<option value="ouvert">Ouvert</option><option value="bientot">Clôture proche</option>' +
          '</select>' +
        '</div>' +
        '<div id="discoveryResults"><div class="loading-spinner"></div></div>' +
      '</div>';

    // Bind events
    var searchBtn = container.querySelector('#discoverySearchBtn');
    var searchInput = container.querySelector('#discoverySearch');
    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') doSearch(); });
    container.querySelector('#toggleReco').addEventListener('click', function() {
      recoMode = !recoMode;
      this.className = 'btn ' + (recoMode ? 'btn-primary' : 'btn-secondary') + ' btn-sm';
      if (results.length > 0) displayResults();
    });

    // Initial search
    await doSearch();
  }

  async function doSearch() {
    var query = containerEl.querySelector('#discoverySearch').value.trim();
    var filters = {
      secteur: containerEl.querySelector('#filterSecteur').value,
      financeur: containerEl.querySelector('#filterFinanceur').value,
      statut: containerEl.querySelector('#filterStatut').value
    };

    var resultsEl = document.getElementById('discoveryResults');
    resultsEl.innerHTML = '<div class="loading-spinner"></div>';

    try {
      results = await searchAAPs(query, filters);

      if (recoMode && typeof Recommendation !== 'undefined') {
        var profile = Auth.getProfile();
        if (profile) {
          results = Recommendation.enrichWithScores(results, profile);
          results = Recommendation.sortByRelevance(results);
        }
      }

      displayResults();
    } catch (err) {
      console.warn('[Discovery] Fallback vers demo:', err);
      results = DEMO_DATA;
      displayResults();
    }
  }

  async function searchAAPs(query, filters) {
    var q = supabaseClient.from('aaps').select('*');
    if (query) {
      q = q.or('titre.ilike.%' + query + '%,description.ilike.%' + query + '%,financeur.ilike.%' + query + '%');
    }
    if (filters.secteur) q = q.eq('secteur', filters.secteur);
    if (filters.financeur) q = q.eq('financeur_type', filters.financeur);

    var now = new Date().toISOString().split('T')[0];
    if (filters.statut === 'ouvert') {
      q = q.or('date_cloture.gte.' + now + ',date_cloture.is.null');
    } else if (filters.statut === 'bientot') {
      var in30 = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
      q = q.gte('date_cloture', now).lte('date_cloture', in30);
    }

    q = q.order('date_cloture', { ascending: true, nullsFirst: false }).limit(200);
    var res = await q;
    if (res.error) throw res.error;
    return (res.data || []).map(transformAAP);
  }

  function transformAAP(row) {
    return {
      id: row.id,
      titre: row.titre,
      description: row.description || '',
      descriptionComplete: row.description_complete || '',
      financeur: row.financeur || 'Non précisé',
      financeurType: row.financeur_type || 'autre',
      secteur: row.secteur || 'autre',
      montantMin: row.montant_min,
      montantMax: row.montant_max,
      subventionRate: row.subvention_rate,
      dateOuverture: row.date_ouverture,
      dateCloture: row.date_cloture,
      lien: row.lien || '#',
      lienCandidature: row.lien_candidature,
      territoires: row.territoires || ['National'],
      beneficiaires: row.beneficiaires || [],
      isAppelProjet: row.is_appel_projet || false,
      contact: row.contact,
      source: row.source || 'supabase'
    };
  }

  function displayResults() {
    var el = document.getElementById('discoveryResults');
    if (!el) return;

    if (results.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128269;</div>' +
        '<div class="empty-state-title">Aucun résultat</div>' +
        '<div class="empty-state-text">Essayez d\'élargir votre recherche.</div></div>';
      return;
    }

    var html = '<div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.75rem">' + results.length + ' résultats</div>';
    html += '<div class="discovery-list">';

    for (var i = 0; i < results.length; i++) {
      var aap = results[i];
      var deadline = DateUtils.getDeadlineStatus(aap.dateCloture);
      var montant = formatMontant(aap.montantMin, aap.montantMax, aap.subventionRate);
      var scoreHtml = '';
      if (aap.matchScore) {
        var scoreClass = aap.matchScore >= 70 ? 'badge-accordee' : aap.matchScore >= 40 ? 'badge-instruction' : 'badge-piste';
        scoreHtml = '<span class="badge ' + scoreClass + '">' + Math.round(aap.matchScore) + '%</span>';
      }

      html += '<div class="discovery-card" data-idx="' + i + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem">' +
          '<h3 style="font-size:0.92rem;font-weight:600;line-height:1.3;flex:1">' + App.escapeHtml(aap.titre) + '</h3>' +
          '<span class="badge badge-deadline-' + deadline.class + '">' + deadline.label + '</span>' +
        '</div>' +
        '<p style="font-size:0.82rem;color:var(--text-secondary);margin:0.35rem 0">' + App.escapeHtml(aap.description.substring(0, 150)) + '</p>' +
        '<div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;font-size:0.78rem;color:var(--text-muted)">' +
          '<span>' + App.escapeHtml(aap.financeur) + '</span>' +
          '<span>' + montant + '</span>' +
          '<span class="badge badge-preparation">' + App.escapeHtml(aap.secteur) + '</span>' +
          scoreHtml +
        '</div>' +
        '<div style="margin-top:0.5rem">' +
          '<button class="btn btn-primary btn-sm add-to-pipeline-btn" data-idx="' + i + '">+ Ajouter au pipeline</button>' +
          (aap.lien && aap.lien !== '#' ? ' <a href="' + App.escapeHtml(aap.lien) + '" target="_blank" class="btn btn-ghost btn-sm">Voir l\'AAP</a>' : '') +
        '</div>' +
      '</div>';
    }
    html += '</div>';
    el.innerHTML = html;

    // Bind add-to-pipeline
    var addBtns = el.querySelectorAll('.add-to-pipeline-btn');
    for (var j = 0; j < addBtns.length; j++) {
      addBtns[j].addEventListener('click', function(e) {
        e.stopPropagation();
        var idx = parseInt(this.getAttribute('data-idx'));
        addToPipeline(results[idx]);
      });
    }
  }

  async function addToPipeline(aap) {
    try {
      // Find or create the financeur from the AAP data
      var financeur = await DataService.findOrCreateFinanceur(aap.financeur, aap.financeurType);
      await DataService.createFinancement({
        name: aap.titre,
        financeur_id: financeur ? financeur.id : null,
        amount_requested: aap.montantMax || aap.montantMin || 0,
        aap_id: aap.id,
        aap_data: aap,
        status: 'piste',
        dates: {
          deadline: aap.dateCloture || null
        }
      });
      App.toast('Ajoute au pipeline des financements', 'success');
    } catch (err) {
      if (err.message && err.message.indexOf('duplicate') !== -1) {
        App.toast('Deja dans votre pipeline', 'warning');
      } else {
        App.toast('Erreur: ' + err.message, 'error');
      }
    }
  }

  function formatMontant(min, max, rate) {
    if (min && max) return CurrencyUtils.format(min) + ' - ' + CurrencyUtils.format(max);
    if (max) return "Jusqu'à " + CurrencyUtils.format(max);
    if (min) return 'À partir de ' + CurrencyUtils.format(min);
    if (rate) return rate + '% du projet';
    return 'Variable';
  }

  return {
    render: render
  };
})();
