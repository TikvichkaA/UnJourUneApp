/**
 * SubTracker - Module Financeurs (annuaire CRM)
 */
var FinanceursModule = (function() {
  'use strict';

  var financeurs = [];
  var financements = [];
  var containerEl = null;
  var currentFilter = '';

  async function render(container) {
    containerEl = container;
    container.innerHTML =
      '<div class="page-header">' +
        '<div class="page-header-row">' +
          '<div>' +
            '<h1 class="page-title">Financeurs</h1>' +
            '<p class="page-subtitle">Annuaire des organismes de financement</p>' +
          '</div>' +
          '<div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap">' +
            '<button class="btn btn-ghost btn-sm" id="btnTableauFinanceurs" title="Vue tableau">&#9638; Tableau</button>' +
            '<button class="btn btn-primary" id="btnAddFinanceur">+ Nouveau financeur</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="page-body">' +
        '<div class="search-bar" style="margin-bottom:1rem">' +
          '<div class="search-input-wrap">' +
            '<span class="search-input-icon">&#128269;</span>' +
            '<input type="text" class="form-input" id="financeurSearch" placeholder="Rechercher un financeur...">' +
          '</div>' +
          '<select class="filter-select" id="filterFinanceurType">' +
            '<option value="">Tous les types</option>' +
          '</select>' +
        '</div>' +
        '<div id="financeursContent"><div class="loading-spinner"></div></div>' +
      '</div>';

    // Populate type filter
    var filterSelect = container.querySelector('#filterFinanceurType');
    for (var i = 0; i < DataService.FINANCEUR_TYPES.length; i++) {
      var ft = DataService.FINANCEUR_TYPES[i];
      filterSelect.innerHTML += '<option value="' + ft.key + '">' + ft.label + '</option>';
    }

    // Bind events
    container.querySelector('#btnAddFinanceur').addEventListener('click', function() { showForm(); });
    container.querySelector('#btnTableauFinanceurs').addEventListener('click', function() { App.navigate('tableaux', ['financeurs']); });
    container.querySelector('#financeurSearch').addEventListener('input', debounce(function() {
      loadData();
    }, 300));
    filterSelect.addEventListener('change', function() {
      currentFilter = this.value;
      loadData();
    });

    await loadData();
  }

  async function loadData() {
    try {
      var searchTerm = containerEl.querySelector('#financeurSearch').value.trim();
      var opts = {};
      if (searchTerm) opts.search = searchTerm;
      if (currentFilter) opts.type = currentFilter;

      var results = await Promise.all([
        DataService.getFinanceurs(opts),
        DataService.getFinancements()
      ]);
      financeurs = results[0];
      financements = results[1];
      renderContent();
    } catch (err) {
      console.error('[Financeurs]', err);
      App.toast('Erreur de chargement', 'error');
    }
  }

  function renderContent() {
    var el = document.getElementById('financeursContent');
    if (!el) return;

    if (financeurs.length === 0) {
      el.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state-icon">&#127970;</div>' +
          '<div class="empty-state-title">Aucun financeur</div>' +
          '<div class="empty-state-text">Ajoutez votre premier financeur ou ils seront crees automatiquement depuis vos financements.</div>' +
          '<button class="btn btn-primary" onclick="FinanceursModule.showForm()">+ Nouveau financeur</button>' +
        '</div>';
      return;
    }

    var html = '<div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.75rem">' + financeurs.length + ' financeur' + (financeurs.length > 1 ? 's' : '') + '</div>';
    html += '<div class="financeurs-grid">';

    for (var i = 0; i < financeurs.length; i++) {
      var f = financeurs[i];
      var finCount = countFinancementsForFinanceur(f.id);
      var aapCount = 0; // AAPs seront comptees cote serveur si besoin
      var initial = f.name.charAt(0).toUpperCase();
      var typeLabel = DataService.getFinanceurTypeLabel(f.type);
      var colorClass = getTypeColorClass(f.type);

      html += '<div class="financeur-card card" data-id="' + f.id + '">' +
        '<div class="card-body">' +
          '<div class="financeur-card-header">' +
            '<div class="financeur-avatar ' + colorClass + '">' + initial + '</div>' +
            '<div class="financeur-card-info">' +
              '<div class="financeur-card-name">' + App.escapeHtml(f.name) + '</div>' +
              '<span class="badge badge-preparation">' + App.escapeHtml(typeLabel) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="financeur-card-stats">' +
            '<div class="financeur-stat">' +
              '<div class="financeur-stat-value">' + finCount + '</div>' +
              '<div class="financeur-stat-label">Financement' + (finCount > 1 ? 's' : '') + '</div>' +
            '</div>' +
            (f.secteurs && f.secteurs.length > 0 ?
              '<div class="financeur-stat">' +
                '<div class="financeur-stat-value">' + f.secteurs.length + '</div>' +
                '<div class="financeur-stat-label">Secteur' + (f.secteurs.length > 1 ? 's' : '') + '</div>' +
              '</div>' : '') +
          '</div>' +
          (f.website ? '<div class="financeur-card-link"><a href="' + App.escapeHtml(f.website) + '" target="_blank" onclick="event.stopPropagation()">Site web &#8599;</a></div>' : '') +
        '</div>' +
      '</div>';
    }
    html += '</div>';

    el.innerHTML = html;

    // Bind card clicks
    var cards = el.querySelectorAll('.financeur-card');
    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener('click', (function(financeur) {
        return function() { showDetail(financeur); };
      })(financeurs[j]));
    }
  }

  function countFinancementsForFinanceur(financeurId) {
    var count = 0;
    for (var i = 0; i < financements.length; i++) {
      if (financements[i].financeur_id === financeurId) count++;
    }
    return count;
  }

  function getTypeColorClass(type) {
    var map = {
      'etat': 'avatar-blue', 'region': 'avatar-green', 'departement': 'avatar-purple',
      'commune': 'avatar-orange', 'intercommunalite': 'avatar-teal',
      'europe': 'avatar-indigo', 'fondation': 'avatar-pink', 'entreprise': 'avatar-amber'
    };
    return map[type] || 'avatar-gray';
  }

  // ---- Detail ----

  function showDetail(financeur) {
    var finList = financements.filter(function(f) { return f.financeur_id === financeur.id; });
    var typeLabel = DataService.getFinanceurTypeLabel(financeur.type);

    var html =
      '<div class="slide-panel-header">' +
        '<h3 class="slide-panel-title">' + App.escapeHtml(financeur.name) + '</h3>' +
        '<button class="slide-panel-close" onclick="SlidePanel.close()">&times;</button>' +
      '</div>' +
      '<div class="slide-panel-body">' +
        '<div class="slide-panel-section">' +
          '<div class="slide-panel-section-title">Informations</div>' +
          '<div class="detail-row">' +
            '<div class="detail-field"><div class="detail-field-label">Type</div><div class="detail-field-value"><span class="badge badge-preparation">' + App.escapeHtml(typeLabel) + '</span></div></div>' +
            '<div class="detail-field"><div class="detail-field-label">Statut</div><div class="detail-field-value">' + (financeur.is_verified ? 'Verifie' : 'Non verifie') + '</div></div>' +
          '</div>' +
          '<div class="detail-row">' +
            '<div class="detail-field"><div class="detail-field-label">Ville</div><div class="detail-field-value">' + App.escapeHtml(financeur.city || '—') + '</div></div>' +
            '<div class="detail-field"><div class="detail-field-label">Code postal</div><div class="detail-field-value">' + App.escapeHtml(financeur.postal_code || '—') + '</div></div>' +
          '</div>' +
          (financeur.address ? '<div class="detail-row"><div class="detail-field"><div class="detail-field-label">Adresse</div><div class="detail-field-value">' + App.escapeHtml(financeur.address) + '</div></div></div>' : '') +
          '<div class="detail-row">' +
            '<div class="detail-field"><div class="detail-field-label">Email</div><div class="detail-field-value">' + App.escapeHtml(financeur.email || '—') + '</div></div>' +
            '<div class="detail-field"><div class="detail-field-label">Telephone</div><div class="detail-field-value">' + App.escapeHtml(financeur.phone || '—') + '</div></div>' +
          '</div>' +
          (financeur.contact_name ? '<div class="detail-row"><div class="detail-field"><div class="detail-field-label">Contact</div><div class="detail-field-value">' + App.escapeHtml(financeur.contact_name) + '</div></div></div>' : '') +
          (financeur.website ? '<div class="detail-row"><div class="detail-field"><div class="detail-field-label">Site web</div><div class="detail-field-value"><a href="' + App.escapeHtml(financeur.website) + '" target="_blank">' + App.escapeHtml(financeur.website) + '</a></div></div></div>' : '') +
          (financeur.description ? '<div class="detail-row"><div class="detail-field"><div class="detail-field-label">Description</div><div class="detail-field-value" style="white-space:pre-wrap">' + App.escapeHtml(financeur.description) + '</div></div></div>' : '') +
          (financeur.secteurs && financeur.secteurs.length > 0 ?
            '<div class="detail-row"><div class="detail-field"><div class="detail-field-label">Secteurs</div><div class="detail-field-value">' +
            financeur.secteurs.map(function(s) { return '<span class="badge badge-preparation" style="margin-right:0.25rem">' + App.escapeHtml(s) + '</span>'; }).join('') +
            '</div></div></div>' : '') +
        '</div>' +

        '<div class="slide-panel-section">' +
          '<div class="slide-panel-section-title">Financements lies (' + finList.length + ')</div>';

    if (finList.length === 0) {
      html += '<p style="font-size:0.82rem;color:var(--text-muted)">Aucun financement lie</p>';
    } else {
      for (var i = 0; i < finList.length; i++) {
        var fin = finList[i];
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--border-color)">' +
          '<div><div style="font-weight:600;font-size:0.85rem">' + App.escapeHtml(fin.name) + '</div>' +
          '<div style="font-size:0.72rem;color:var(--text-muted)">' + CurrencyUtils.format(fin.amount_requested) + '</div></div>' +
          '<span class="badge ' + DataService.getStatusBadgeClass(fin.status) + '">' + DataService.getStatusLabel(fin.status) + '</span>' +
        '</div>';
      }
    }

    html += '</div>' +
        '<div class="slide-panel-section">' +
          '<button class="btn btn-primary btn-sm" onclick="FinanceursModule.newFinancementWith(\'' + financeur.id + '\')">+ Nouveau financement avec ' + App.escapeHtml(financeur.name) + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="slide-panel-footer">' +
        '<button class="btn btn-ghost btn-sm" onclick="FinanceursModule.showForm(' + JSON.stringify(financeur).replace(/"/g, '&quot;') + ')">Modifier</button>' +
        (!financeur.is_verified ? '<button class="btn btn-danger btn-sm" onclick="FinanceursModule.removeFinanceur(\'' + financeur.id + '\')">Supprimer</button>' : '') +
      '</div>';

    SlidePanel.open(html);
  }

  // ---- Create / Edit Form ----

  function showForm(prefill) {
    prefill = prefill || {};

    var typeOptions = '<option value="">—</option>';
    for (var i = 0; i < DataService.FINANCEUR_TYPES.length; i++) {
      var ft = DataService.FINANCEUR_TYPES[i];
      typeOptions += '<option value="' + ft.key + '"' + (prefill.type === ft.key ? ' selected' : '') + '>' + ft.label + '</option>';
    }

    var secteursHtml = '';
    var sectors = ['culture', 'environnement', 'social', 'education', 'sante', 'sport', 'solidarite', 'insertion', 'numerique'];
    var prefillSecteurs = prefill.secteurs || [];
    for (var s = 0; s < sectors.length; s++) {
      var checked = prefillSecteurs.indexOf(sectors[s]) !== -1 ? ' checked' : '';
      secteursHtml += '<label class="form-check"><input type="checkbox" name="secteurs" value="' + sectors[s] + '"' + checked + '> ' +
        sectors[s].charAt(0).toUpperCase() + sectors[s].slice(1) + '</label>';
    }

    var html =
      '<div class="modal-header">' +
        '<h3 class="modal-title">' + (prefill.id ? 'Modifier le financeur' : 'Nouveau financeur') + '</h3>' +
        '<button class="modal-close" onclick="App.hideModal()">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<form id="financeurForm">' +
          '<div class="form-group"><label class="form-label">Nom *</label><input type="text" class="form-input" name="name" value="' + App.escapeHtml(prefill.name || '') + '" required></div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label class="form-label">Type</label><select class="form-select" name="type">' + typeOptions + '</select></div>' +
            '<div class="form-group"><label class="form-label">Site web</label><input type="url" class="form-input" name="website" value="' + App.escapeHtml(prefill.website || '') + '"></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" name="email" value="' + App.escapeHtml(prefill.email || '') + '"></div>' +
            '<div class="form-group"><label class="form-label">Telephone</label><input type="tel" class="form-input" name="phone" value="' + App.escapeHtml(prefill.phone || '') + '"></div>' +
          '</div>' +
          '<div class="form-group"><label class="form-label">Contact (nom)</label><input type="text" class="form-input" name="contact_name" value="' + App.escapeHtml(prefill.contact_name || '') + '"></div>' +
          '<div class="form-group"><label class="form-label">Adresse</label><input type="text" class="form-input" name="address" value="' + App.escapeHtml(prefill.address || '') + '"></div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label class="form-label">Ville</label><input type="text" class="form-input" name="city" value="' + App.escapeHtml(prefill.city || '') + '"></div>' +
            '<div class="form-group"><label class="form-label">Code postal</label><input type="text" class="form-input" name="postal_code" value="' + App.escapeHtml(prefill.postal_code || '') + '"></div>' +
          '</div>' +
          '<div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" name="description" rows="3">' + App.escapeHtml(prefill.description || '') + '</textarea></div>' +
          '<div class="form-group"><label class="form-label">Secteurs</label><div style="display:flex;flex-wrap:wrap;gap:0.5rem">' + secteursHtml + '</div></div>' +
          (prefill.id ? '<input type="hidden" name="id" value="' + prefill.id + '">' : '') +
          '<button type="submit" class="btn btn-primary" style="width:100%">' + (prefill.id ? 'Enregistrer' : 'Creer') + '</button>' +
        '</form>' +
      '</div>';

    App.showModal(html);
    document.getElementById('financeurForm').addEventListener('submit', handleFormSubmit);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    var form = e.target;

    var secteurCheckboxes = form.querySelectorAll('[name="secteurs"]:checked');
    var secteurs = [];
    for (var i = 0; i < secteurCheckboxes.length; i++) {
      secteurs.push(secteurCheckboxes[i].value);
    }

    var data = {
      name: form.name.value.trim(),
      type: form.type.value || 'autre',
      website: form.website.value.trim() || null,
      email: form.email.value.trim() || null,
      phone: form.phone.value.trim() || null,
      contact_name: form.contact_name.value.trim() || null,
      address: form.address.value.trim() || null,
      city: form.city.value.trim() || null,
      postal_code: form.postal_code.value.trim() || null,
      description: form.description.value.trim() || null,
      secteurs: secteurs
    };

    var existingId = form.querySelector('[name="id"]');

    try {
      if (existingId) {
        await DataService.updateFinanceur(existingId.value, data);
        App.toast('Financeur mis a jour', 'success');
      } else {
        await DataService.createFinanceur(data);
        App.toast('Financeur cree', 'success');
      }
      App.hideModal();
      SlidePanel.close();
      await loadData();
    } catch (err) {
      if (err.message && err.message.indexOf('duplicate') !== -1) {
        App.toast('Ce financeur existe deja', 'warning');
      } else {
        App.toast('Erreur: ' + err.message, 'error');
      }
    }
  }

  async function removeFinanceur(id) {
    var ok = await App.confirmDialog('Supprimer ce financeur ? Les financements lies ne seront pas supprimes.');
    if (!ok) return;
    try {
      await supabaseClient.from('financeurs').delete().eq('id', id);
      App.toast('Financeur supprime', 'success');
      SlidePanel.close();
      await loadData();
    } catch (err) {
      App.toast('Erreur: ' + err.message, 'error');
    }
  }

  function newFinancementWith(financeurId) {
    SlidePanel.close();
    // Navigate to subventions and prefill
    App.navigate('subventions');
    setTimeout(function() {
      if (typeof SubventionsModule !== 'undefined') {
        SubventionsModule.showCreateForm({ financeur_id: financeurId });
      }
    }, 300);
  }

  // ---- Utility ----

  function debounce(fn, delay) {
    var timer = null;
    return function() {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() { fn.apply(context, args); }, delay);
    };
  }

  return {
    render: render,
    showForm: showForm,
    removeFinanceur: removeFinanceur,
    newFinancementWith: newFinancementWith
  };
})();
