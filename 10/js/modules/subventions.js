/**
 * SubTracker - Module Subventions / Financements (Kanban + Liste + Detail + CRUD)
 */
var SubventionsModule = (function() {
  'use strict';

  var currentView = 'kanban'; // 'kanban' | 'list'
  var subventions = [];
  var projects = [];
  var containerEl = null;

  async function render(container) {
    containerEl = container;
    container.innerHTML =
      '<div class="page-header">' +
        '<div class="page-header-row">' +
          '<div>' +
            '<h1 class="page-title">Financements</h1>' +
            '<p class="page-subtitle">Pipeline de suivi de vos demandes</p>' +
          '</div>' +
          '<div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap">' +
            '<div class="view-toggle">' +
              '<button class="view-toggle-btn ' + (currentView === 'kanban' ? 'active' : '') + '" data-view="kanban">Kanban</button>' +
              '<button class="view-toggle-btn ' + (currentView === 'list' ? 'active' : '') + '" data-view="list">Liste</button>' +
              '<button class="view-toggle-btn" data-view="tableau">Tableau</button>' +
            '</div>' +
            '<button class="btn btn-primary" id="btnAddSubvention">+ Nouvelle</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="page-body" id="subventionsContent"><div class="loading-spinner"></div></div>';

    // Bind
    container.querySelector('#btnAddSubvention').addEventListener('click', function() { showCreateForm(); });
    var viewBtns = container.querySelectorAll('.view-toggle-btn');
    for (var i = 0; i < viewBtns.length; i++) {
      viewBtns[i].addEventListener('click', function() {
        var view = this.getAttribute('data-view');
        if (view === 'tableau') {
          App.navigate('tableaux', ['financements']);
          return;
        }
        currentView = view;
        render(containerEl);
      });
    }

    await loadData();
  }

  async function loadData() {
    try {
      var results = await Promise.all([
        DataService.getFinancements(),
        DataService.getProjects()
      ]);
      subventions = results[0];
      projects = results[1];
      renderContent();
    } catch (err) {
      console.error('[Subventions]', err);
      App.toast('Erreur de chargement', 'error');
    }
  }

  function getFinanceurName(item) {
    if (item.financeurs && item.financeurs.name) return item.financeurs.name;
    if (item.financeur) return item.financeur;
    return '';
  }

  function renderContent() {
    var contentEl = document.getElementById('subventionsContent');
    if (!contentEl) return;

    if (subventions.length === 0) {
      contentEl.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state-icon">&#8364;</div>' +
          '<div class="empty-state-title">Aucun financement</div>' +
          '<div class="empty-state-text">Creez votre premier financement pour commencer le suivi.</div>' +
          '<button class="btn btn-primary" onclick="SubventionsModule.showCreateForm()">+ Nouveau financement</button>' +
        '</div>';
      return;
    }

    if (currentView === 'kanban') {
      renderKanban(contentEl);
    } else {
      renderList(contentEl);
    }
  }

  function renderKanban(contentEl) {
    KanbanComponent.render(contentEl, DataService.SUBVENTION_STATUSES, subventions, {
      onStatusChange: handleStatusChange,
      onItemClick: showDetail,
      renderCard: function(item) {
        var amount = CurrencyUtils.formatCompact(item.amount_requested);
        var projectName = item.projects ? item.projects.name : '';
        var financeur = getFinanceurName(item);
        return '<div class="kanban-card-title">' + App.escapeHtml(item.name) + '</div>' +
               '<div class="kanban-card-meta">' +
                 (financeur ? '<span>' + App.escapeHtml(financeur) + '</span>' : '') +
                 '<span>' + amount + '</span>' +
               '</div>' +
               (projectName ? '<div style="font-size:0.68rem;color:var(--text-muted);margin-top:0.25rem">' + App.escapeHtml(projectName) + '</div>' : '');
      }
    });
  }

  function renderList(contentEl) {
    DataTable.render(contentEl, {
      columns: [
        { key: 'name', label: 'Nom', sortable: true, render: function(r) {
          return '<strong>' + App.escapeHtml(r.name) + '</strong>';
        }},
        { key: 'financeur', label: 'Financeur', sortable: true, render: function(r) {
          return App.escapeHtml(getFinanceurName(r) || '—');
        }},
        { key: 'status', label: 'Statut', sortable: true, render: function(r) {
          return '<span class="badge ' + DataService.getStatusBadgeClass(r.status) + '">' +
                 DataService.getStatusLabel(r.status) + '</span>';
        }},
        { key: 'amount_requested', label: 'Demande', sortable: true, render: function(r) {
          return CurrencyUtils.format(r.amount_requested);
        }},
        { key: 'amount_granted', label: 'Accorde', sortable: true, render: function(r) {
          return r.amount_granted ? CurrencyUtils.format(r.amount_granted) : '—';
        }},
        { key: 'projects', label: 'Projet', render: function(r) {
          return r.projects ? App.escapeHtml(r.projects.name) : '—';
        }}
      ],
      data: subventions,
      onRowClick: showDetail,
      emptyText: 'Aucun financement',
      sortCol: 0,
      sortDir: 'asc'
    });
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await DataService.updateFinancementStatus(id, newStatus);
      // Update local
      for (var i = 0; i < subventions.length; i++) {
        if (subventions[i].id === id) {
          subventions[i].status = newStatus;
          break;
        }
      }
      renderContent();
      App.toast('Statut mis a jour', 'success');
    } catch (err) {
      App.toast('Erreur: ' + err.message, 'error');
    }
  }

  // ---- Detail ----

  function showDetail(item) {
    var dates = item.dates || {};
    var financeurName = getFinanceurName(item);
    var financeurType = (item.financeurs && item.financeurs.type) ? DataService.getFinanceurTypeLabel(item.financeurs.type) : (item.financeur_type || '—');

    var html =
      '<div class="slide-panel-header">' +
        '<h3 class="slide-panel-title">' + App.escapeHtml(item.name) + '</h3>' +
        '<button class="slide-panel-close" onclick="SlidePanel.close()">&times;</button>' +
      '</div>' +
      '<div class="slide-panel-body">' +
        '<div class="slide-panel-section">' +
          '<div class="slide-panel-section-title">Statut</div>' +
          '<div class="status-timeline">' + renderStatusTimeline(item.status) + '</div>' +
        '</div>' +
        '<div class="slide-panel-section">' +
          '<div class="slide-panel-section-title">Informations</div>' +
          '<div class="detail-row">' +
            '<div class="detail-field"><div class="detail-field-label">Financeur</div><div class="detail-field-value">' + App.escapeHtml(financeurName || '—') + '</div></div>' +
            '<div class="detail-field"><div class="detail-field-label">Type</div><div class="detail-field-value">' + App.escapeHtml(financeurType) + '</div></div>' +
          '</div>' +
          '<div class="detail-row">' +
            '<div class="detail-field"><div class="detail-field-label">Montant demande</div><div class="detail-field-value amount">' + CurrencyUtils.format(item.amount_requested) + '</div></div>' +
            '<div class="detail-field"><div class="detail-field-label">Montant accorde</div><div class="detail-field-value amount">' + (item.amount_granted ? CurrencyUtils.format(item.amount_granted) : '—') + '</div></div>' +
          '</div>' +
          '<div class="detail-row">' +
            '<div class="detail-field"><div class="detail-field-label">Montant recu</div><div class="detail-field-value amount">' + CurrencyUtils.format(item.amount_received) + '</div></div>' +
            '<div class="detail-field"><div class="detail-field-label">Projet</div><div class="detail-field-value">' + (item.projects ? App.escapeHtml(item.projects.name) : '—') + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="slide-panel-section">' +
          '<div class="slide-panel-section-title">Dates</div>' +
          '<div class="detail-row">' +
            '<div class="detail-field"><div class="detail-field-label">Date depot</div><div class="detail-field-value">' + DateUtils.formatDate(dates.depot) + '</div></div>' +
            '<div class="detail-field"><div class="detail-field-label">Date reponse</div><div class="detail-field-value">' + DateUtils.formatDate(dates.reponse) + '</div></div>' +
          '</div>' +
          '<div class="detail-row">' +
            '<div class="detail-field"><div class="detail-field-label">Convention</div><div class="detail-field-value">' + DateUtils.formatDate(dates.convention) + '</div></div>' +
            '<div class="detail-field"><div class="detail-field-label">Versement prevu</div><div class="detail-field-value">' + DateUtils.formatDate(dates.versement_date) + '</div></div>' +
          '</div>' +
        '</div>' +
        (item.notes ? '<div class="slide-panel-section"><div class="slide-panel-section-title">Notes</div><p style="font-size:0.85rem;color:var(--text-secondary);white-space:pre-wrap">' + App.escapeHtml(item.notes) + '</p></div>' : '') +
        (item.reference ? '<div class="slide-panel-section"><div class="slide-panel-section-title">Reference</div><p style="font-size:0.85rem">' + App.escapeHtml(item.reference) + '</p></div>' : '') +
      '</div>' +
      '<div class="slide-panel-footer">' +
        '<button class="btn btn-ghost btn-sm" onclick="SubventionsModule.editSubvention(\'' + item.id + '\')">Modifier</button>' +
        '<button class="btn btn-danger btn-sm" onclick="SubventionsModule.removeSubvention(\'' + item.id + '\')">Supprimer</button>' +
      '</div>';

    SlidePanel.open(html);

    // Bind status change in timeline
    var badges = SlidePanel.getContentEl().querySelectorAll('.status-timeline .badge');
    for (var i = 0; i < badges.length; i++) {
      badges[i].addEventListener('click', (function(statusKey, itemId) {
        return function() {
          handleStatusChange(itemId, statusKey);
          SlidePanel.close();
        };
      })(DataService.SUBVENTION_STATUSES[i].key, item.id));
    }
  }

  function renderStatusTimeline(currentStatus) {
    var html = '';
    for (var i = 0; i < DataService.SUBVENTION_STATUSES.length; i++) {
      var s = DataService.SUBVENTION_STATUSES[i];
      var isCurrent = s.key === currentStatus ? ' current' : '';
      html += '<span class="badge ' + s.badge + isCurrent + '" title="' + s.label + '">' + s.label + '</span>';
    }
    return html;
  }

  // ---- Create / Edit ----

  function showCreateForm(prefill) {
    prefill = prefill || {};
    var projectOptions = '<option value="">— Aucun —</option>';
    for (var i = 0; i < projects.length; i++) {
      var sel = prefill.project_id === projects[i].id ? ' selected' : '';
      projectOptions += '<option value="' + projects[i].id + '"' + sel + '>' + App.escapeHtml(projects[i].name) + '</option>';
    }

    // Get prefill financeur name from relation or text field
    var prefillFinanceurName = '';
    var prefillFinanceurId = prefill.financeur_id || '';
    if (prefill.financeurs && prefill.financeurs.name) {
      prefillFinanceurName = prefill.financeurs.name;
    } else if (prefill.financeur) {
      prefillFinanceurName = prefill.financeur;
    }

    var html =
      '<div class="modal-header">' +
        '<h3 class="modal-title">' + (prefill.id ? 'Modifier' : 'Nouveau financement') + '</h3>' +
        '<button class="modal-close" onclick="App.hideModal()">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<form id="subventionForm">' +
          '<div class="form-group"><label class="form-label">Nom *</label><input type="text" class="form-input" name="name" value="' + App.escapeHtml(prefill.name || '') + '" required></div>' +
          '<div class="form-group">' +
            '<label class="form-label">Financeur</label>' +
            '<div class="autocomplete-wrap">' +
              '<input type="text" class="form-input" id="financeurAutocomplete" placeholder="Rechercher un financeur..." value="' + App.escapeHtml(prefillFinanceurName) + '" autocomplete="off">' +
              '<input type="hidden" name="financeur_id" id="financeurIdInput" value="' + prefillFinanceurId + '">' +
              '<div id="financeurDropdown" class="autocomplete-dropdown" style="display:none"></div>' +
            '</div>' +
            '<div id="financeurSelectedTag">' +
              (prefillFinanceurName && prefillFinanceurId ?
                '<div class="autocomplete-selected-tag">' + App.escapeHtml(prefillFinanceurName) + ' <button type="button" onclick="SubventionsModule.clearFinanceur()">&times;</button></div>' : '') +
            '</div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label class="form-label">Montant demande</label><input type="number" class="form-input" name="amount_requested" value="' + (prefill.amount_requested || '') + '" min="0" step="1"></div>' +
            '<div class="form-group"><label class="form-label">Montant accorde</label><input type="number" class="form-input" name="amount_granted" value="' + (prefill.amount_granted || '') + '" min="0" step="1"></div>' +
          '</div>' +
          '<div class="form-group"><label class="form-label">Projet</label><select class="form-select" name="project_id">' + projectOptions + '</select></div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label class="form-label">Date depot</label><input type="date" class="form-input" name="date_depot" value="' + ((prefill.dates || {}).depot || '') + '"></div>' +
            '<div class="form-group"><label class="form-label">Date reponse</label><input type="date" class="form-input" name="date_reponse" value="' + ((prefill.dates || {}).reponse || '') + '"></div>' +
          '</div>' +
          '<div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" name="notes" rows="3">' + App.escapeHtml(prefill.notes || '') + '</textarea></div>' +
          '<div class="form-group"><label class="form-label">Reference / N dossier</label><input type="text" class="form-input" name="reference" value="' + App.escapeHtml(prefill.reference || '') + '"></div>' +
          (prefill.id ? '<input type="hidden" name="id" value="' + prefill.id + '">' : '') +
          '<button type="submit" class="btn btn-primary" style="width:100%">' + (prefill.id ? 'Enregistrer' : 'Creer') + '</button>' +
        '</form>' +
      '</div>';

    App.showModal(html);
    document.getElementById('subventionForm').addEventListener('submit', handleFormSubmit);
    initFinanceurAutocomplete();
  }

  // ---- Financeur Autocomplete ----

  var autocompleteTimer = null;

  function initFinanceurAutocomplete() {
    var input = document.getElementById('financeurAutocomplete');
    var dropdown = document.getElementById('financeurDropdown');
    if (!input || !dropdown) return;

    input.addEventListener('input', function() {
      var term = this.value.trim();
      clearTimeout(autocompleteTimer);
      if (term.length < 2) {
        dropdown.style.display = 'none';
        return;
      }
      autocompleteTimer = setTimeout(function() {
        searchAndShowDropdown(term);
      }, 300);
    });

    input.addEventListener('blur', function() {
      setTimeout(function() { dropdown.style.display = 'none'; }, 200);
    });

    input.addEventListener('focus', function() {
      if (this.value.trim().length >= 2) {
        searchAndShowDropdown(this.value.trim());
      }
    });
  }

  async function searchAndShowDropdown(term) {
    var dropdown = document.getElementById('financeurDropdown');
    if (!dropdown) return;

    try {
      var results = await DataService.searchFinanceurs(term);
      var html = '';

      for (var i = 0; i < results.length; i++) {
        var f = results[i];
        var typeLabel = DataService.getFinanceurTypeLabel(f.type);
        html += '<div class="autocomplete-item" data-id="' + f.id + '" data-name="' + App.escapeHtml(f.name) + '">' +
          '<span class="autocomplete-item-name">' + App.escapeHtml(f.name) + '</span>' +
          '<span class="autocomplete-item-type">' + App.escapeHtml(typeLabel) + '</span>' +
        '</div>';
      }

      // Option to create new
      html += '<div class="autocomplete-item autocomplete-item-create" data-create="true" data-name="' + App.escapeHtml(term) + '">' +
        '+ Creer "' + App.escapeHtml(term) + '"' +
      '</div>';

      dropdown.innerHTML = html;
      dropdown.style.display = 'block';

      // Bind clicks
      var items = dropdown.querySelectorAll('.autocomplete-item');
      for (var j = 0; j < items.length; j++) {
        items[j].addEventListener('mousedown', function(e) {
          e.preventDefault();
          if (this.getAttribute('data-create') === 'true') {
            handleCreateFinanceurFromAutocomplete(this.getAttribute('data-name'));
          } else {
            selectFinanceur(this.getAttribute('data-id'), this.getAttribute('data-name'));
          }
        });
      }
    } catch (err) {
      console.error('[Autocomplete]', err);
    }
  }

  function selectFinanceur(id, name) {
    var input = document.getElementById('financeurAutocomplete');
    var hiddenInput = document.getElementById('financeurIdInput');
    var tagEl = document.getElementById('financeurSelectedTag');
    var dropdown = document.getElementById('financeurDropdown');

    if (input) input.value = '';
    if (hiddenInput) hiddenInput.value = id;
    if (tagEl) {
      tagEl.innerHTML = '<div class="autocomplete-selected-tag">' + App.escapeHtml(name) + ' <button type="button" onclick="SubventionsModule.clearFinanceur()">&times;</button></div>';
    }
    if (dropdown) dropdown.style.display = 'none';
  }

  function clearFinanceur() {
    var input = document.getElementById('financeurAutocomplete');
    var hiddenInput = document.getElementById('financeurIdInput');
    var tagEl = document.getElementById('financeurSelectedTag');

    if (input) input.value = '';
    if (hiddenInput) hiddenInput.value = '';
    if (tagEl) tagEl.innerHTML = '';
  }

  async function handleCreateFinanceurFromAutocomplete(name) {
    try {
      var financeur = await DataService.createFinanceur({ name: name, type: 'autre' });
      selectFinanceur(financeur.id, financeur.name);
      App.toast('Financeur cree', 'success');
    } catch (err) {
      if (err.message && err.message.indexOf('duplicate') !== -1) {
        // Try to find existing
        var slug = DataService.generateSlug(name);
        var existing = await DataService.getFinanceurBySlug(slug);
        if (existing) {
          selectFinanceur(existing.id, existing.name);
        }
      } else {
        App.toast('Erreur: ' + err.message, 'error');
      }
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var data = {
      name: form.name.value.trim(),
      financeur_id: form.financeur_id.value || null,
      amount_requested: parseFloat(form.amount_requested.value) || 0,
      amount_granted: form.amount_granted.value ? parseFloat(form.amount_granted.value) : null,
      project_id: form.project_id.value || null,
      notes: form.notes.value.trim() || null,
      reference: form.reference.value.trim() || null,
      dates: {
        depot: form.date_depot.value || null,
        reponse: form.date_reponse.value || null
      }
    };

    var existingId = form.querySelector('[name="id"]');

    try {
      if (existingId) {
        await DataService.updateFinancement(existingId.value, data);
        App.toast('Financement mis a jour', 'success');
      } else {
        await DataService.createFinancement(data);
        App.toast('Financement cree', 'success');
      }
      App.hideModal();
      SlidePanel.close();
      await loadData();
    } catch (err) {
      App.toast('Erreur: ' + err.message, 'error');
    }
  }

  async function editSubvention(id) {
    try {
      var sub = await DataService.getFinancement(id);
      SlidePanel.close();
      showCreateForm(sub);
    } catch (err) {
      App.toast('Erreur: ' + err.message, 'error');
    }
  }

  async function removeSubvention(id) {
    var ok = await App.confirmDialog('Supprimer ce financement ?');
    if (!ok) return;
    try {
      await DataService.deleteFinancement(id);
      App.toast('Financement supprime', 'success');
      SlidePanel.close();
      await loadData();
    } catch (err) {
      App.toast('Erreur: ' + err.message, 'error');
    }
  }

  return {
    render: render,
    showCreateForm: showCreateForm,
    editSubvention: editSubvention,
    removeSubvention: removeSubvention,
    clearFinanceur: clearFinanceur
  };
})();
