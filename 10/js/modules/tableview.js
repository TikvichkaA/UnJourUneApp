/**
 * SubTracker - Module Tableaux (spreadsheet inline editing)
 */
var TableViewModule = (function() {
  'use strict';

  var containerEl = null;
  var activeTab = 'financements';
  var cachedData = {};

  var PROJECT_STATUSES = [
    { key: 'active', label: 'Actif' },
    { key: 'completed', label: 'Terminé' },
    { key: 'archived', label: 'Archivé' }
  ];

  var TAB_MAP = { financements: true, financeurs: true, projets: true };

  async function render(container, params) {
    containerEl = container;
    // Accept tab from route params: #tableaux/financeurs
    if (params && params[0] && TAB_MAP[params[0]]) {
      activeTab = params[0];
    }
    container.innerHTML =
      '<div class="page-header">' +
        '<div class="page-header-row">' +
          '<div>' +
            '<h1 class="page-title">Tableaux</h1>' +
            '<p class="page-subtitle">Editez vos données en mode tableur</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="page-body">' +
        '<div class="tableview-tabs" id="tableviewTabs">' +
          '<button class="tableview-tab' + (activeTab === 'financements' ? ' active' : '') + '" data-tab="financements">Financements</button>' +
          '<button class="tableview-tab' + (activeTab === 'financeurs' ? ' active' : '') + '" data-tab="financeurs">Financeurs</button>' +
          '<button class="tableview-tab' + (activeTab === 'projets' ? ' active' : '') + '" data-tab="projets">Projets</button>' +
        '</div>' +
        '<div id="tableviewContent"><div class="loading-spinner"></div></div>' +
      '</div>';

    // Bind tab clicks
    var tabs = container.querySelectorAll('.tableview-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function(e) {
        var tab = e.target.getAttribute('data-tab');
        if (tab === activeTab) return;
        activeTab = tab;
        var allTabs = containerEl.querySelectorAll('.tableview-tab');
        for (var j = 0; j < allTabs.length; j++) {
          allTabs[j].classList.toggle('active', allTabs[j].getAttribute('data-tab') === tab);
        }
        renderActiveTab();
      });
    }

    await loadAllData();
  }

  async function loadAllData() {
    try {
      var results = await Promise.all([
        DataService.getFinancements(),
        DataService.getFinanceurs(),
        DataService.getProjects()
      ]);
      cachedData.financements = results[0];
      cachedData.financeurs = results[1];
      cachedData.projets = results[2];
      updateTabCounts();
      renderActiveTab();
    } catch (err) {
      App.toast('Erreur de chargement', 'error');
    }
  }

  function updateTabCounts() {
    var tabs = containerEl.querySelectorAll('.tableview-tab');
    var counts = {
      financements: cachedData.financements ? cachedData.financements.length : 0,
      financeurs: countUserFinanceurs(),
      projets: cachedData.projets ? cachedData.projets.length : 0
    };
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      var tabKey = tab.getAttribute('data-tab');
      var existing = tab.querySelector('.tableview-count');
      if (existing) existing.remove();
      var span = document.createElement('span');
      span.className = 'tableview-count';
      span.textContent = '(' + counts[tabKey] + ')';
      tab.appendChild(span);
    }
  }

  function countUserFinanceurs() {
    if (!cachedData.financeurs) return 0;
    var userId = Auth.getUser() ? Auth.getUser().id : null;
    var count = 0;
    for (var i = 0; i < cachedData.financeurs.length; i++) {
      var f = cachedData.financeurs[i];
      if (f.created_by === userId && !f.is_verified) count++;
    }
    return count;
  }

  function renderActiveTab() {
    var contentEl = document.getElementById('tableviewContent');
    if (!contentEl) return;

    if (activeTab === 'financements') {
      renderFinancementsTab(contentEl);
    } else if (activeTab === 'financeurs') {
      renderFinanceursTab(contentEl);
    } else if (activeTab === 'projets') {
      renderProjetsTab(contentEl);
    }
  }

  // ---- Financements Tab ----
  function renderFinancementsTab(contentEl) {
    var columns = [
      { key: 'name', label: 'Nom', type: 'text', required: true },
      {
        key: 'financeur_name', label: 'Financeur', type: 'readonly',
        render: function(row) {
          return App.escapeHtml((row.financeurs && row.financeurs.name) || '—');
        }
      },
      {
        key: 'status', label: 'Statut', type: 'select', badge: true,
        options: DataService.SUBVENTION_STATUSES
      },
      { key: 'amount_requested', label: 'Demandé', type: 'number' },
      { key: 'amount_granted', label: 'Accordé', type: 'number' },
      { key: 'amount_received', label: 'Reçu', type: 'number' },
      {
        key: 'project_name', label: 'Projet', type: 'readonly',
        render: function(row) {
          return App.escapeHtml((row.projects && row.projects.name) || '—');
        }
      },
      { key: 'reference', label: 'Référence', type: 'text' }
    ];

    EditableTable.render(contentEl, {
      columns: columns,
      data: cachedData.financements || [],
      emptyText: 'Aucun financement',
      onSave: function(id, key, value) {
        var update = {};
        update[key] = value;
        return DataService.updateFinancement(id, update);
      },
      onDelete: function(id) {
        return DataService.deleteFinancement(id).then(function() {
          cachedData.financements = cachedData.financements.filter(function(f) { return f.id !== id; });
          updateTabCounts();
          App.toast('Financement supprimé', 'success');
        });
      }
    });
  }

  // ---- Financeurs Tab ----
  function renderFinanceursTab(contentEl) {
    var userId = Auth.getUser() ? Auth.getUser().id : null;
    var userFinanceurs = (cachedData.financeurs || []).filter(function(f) {
      return f.created_by === userId && !f.is_verified;
    });

    var columns = [
      { key: 'name', label: 'Nom', type: 'text', required: true },
      {
        key: 'type', label: 'Type', type: 'select',
        options: DataService.FINANCEUR_TYPES
      },
      { key: 'ville', label: 'Ville', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'telephone', label: 'Téléphone', type: 'text' },
      { key: 'site_web', label: 'Site web', type: 'text' }
    ];

    EditableTable.render(contentEl, {
      columns: columns,
      data: userFinanceurs,
      emptyText: 'Aucun financeur personnel',
      onSave: function(id, key, value) {
        var update = {};
        update[key] = value;
        return DataService.updateFinanceur(id, update);
      },
      onDelete: null
    });
  }

  // ---- Projets Tab ----
  function renderProjetsTab(contentEl) {
    var columns = [
      { key: 'name', label: 'Nom', type: 'text', required: true },
      { key: 'budget_total', label: 'Budget', type: 'number' },
      {
        key: 'status', label: 'Statut', type: 'select', badge: true,
        options: PROJECT_STATUSES,
        badgeClass: function(val) {
          if (val === 'active') return 'badge-accordee';
          if (val === 'completed') return 'badge-versee';
          return 'badge-abandonnee';
        }
      },
      { key: 'start_date', label: 'Début', type: 'date' },
      { key: 'end_date', label: 'Fin', type: 'date' },
      { key: 'description', label: 'Description', type: 'text' }
    ];

    EditableTable.render(contentEl, {
      columns: columns,
      data: cachedData.projets || [],
      emptyText: 'Aucun projet',
      onSave: function(id, key, value) {
        var update = {};
        update[key] = value;
        return DataService.updateProject(id, update);
      },
      onDelete: function(id) {
        return DataService.deleteProject(id).then(function() {
          cachedData.projets = cachedData.projets.filter(function(p) { return p.id !== id; });
          updateTabCounts();
          App.toast('Projet supprimé', 'success');
        });
      }
    });
  }

  return {
    render: render
  };
})();
