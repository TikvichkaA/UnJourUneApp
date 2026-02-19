/**
 * SubTracker - Module Projets (cartes + détail + budget)
 */
var ProjectsModule = (function() {
  'use strict';

  var projectsList = [];
  var subventions = [];
  var expenses = [];
  var containerEl = null;

  async function render(container) {
    containerEl = container;
    container.innerHTML =
      '<div class="page-header">' +
        '<div class="page-header-row">' +
          '<div>' +
            '<h1 class="page-title">Projets</h1>' +
            '<p class="page-subtitle">Gérez vos projets et leurs budgets</p>' +
          '</div>' +
          '<div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap">' +
            '<button class="btn btn-ghost btn-sm" id="btnTableauProjects" title="Vue tableau">&#9638; Tableau</button>' +
            '<button class="btn btn-primary" id="btnAddProject">+ Nouveau projet</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="page-body" id="projectsContent"><div class="loading-spinner"></div></div>';

    container.querySelector('#btnAddProject').addEventListener('click', function() { showForm(); });
    container.querySelector('#btnTableauProjects').addEventListener('click', function() { App.navigate('tableaux', ['projets']); });
    await loadData();
  }

  async function loadData() {
    try {
      var results = await Promise.all([
        DataService.getProjects(),
        DataService.getFinancements(),
        DataService.getExpenses()
      ]);
      projectsList = results[0];
      subventions = results[1];
      expenses = results[2];
      renderContent();
    } catch (err) {
      App.toast('Erreur de chargement', 'error');
    }
  }

  function renderContent() {
    var el = document.getElementById('projectsContent');
    if (!el) return;

    if (projectsList.length === 0) {
      el.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state-icon">&#9881;</div>' +
          '<div class="empty-state-title">Aucun projet</div>' +
          '<div class="empty-state-text">Créez un projet pour organiser vos subventions et dépenses.</div>' +
          '<button class="btn btn-primary" onclick="ProjectsModule.showForm()">+ Nouveau projet</button>' +
        '</div>';
      return;
    }

    var html = '<div class="projects-grid">';
    for (var i = 0; i < projectsList.length; i++) {
      var p = projectsList[i];
      var coverage = Calculations.projectBudgetCoverage(p, subventions);
      var burn = Calculations.burnRate(p, expenses);
      var subCount = countProjectSubventions(p.id);
      var budget = CurrencyUtils.format(p.budget_total);

      html += '<div class="card project-card" data-id="' + p.id + '">' +
        '<div class="card-header">' +
          '<span class="card-title">' + App.escapeHtml(p.name) + '</span>' +
          '<span class="badge badge-' + (p.status === 'active' ? 'accordee' : 'abandonnee') + '">' + (p.status === 'active' ? 'Actif' : p.status === 'completed' ? 'Terminé' : 'Archivé') + '</span>' +
        '</div>' +
        '<div class="card-body">' +
          (p.description ? '<p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.75rem">' + App.escapeHtml(p.description.substring(0, 120)) + '</p>' : '') +
          '<div style="display:flex;gap:1.5rem;margin-bottom:0.75rem">' +
            '<div><div class="detail-field-label">Budget</div><div style="font-weight:600">' + budget + '</div></div>' +
            '<div><div class="detail-field-label">Subventions</div><div style="font-weight:600">' + subCount + '</div></div>' +
          '</div>' +
          '<div style="margin-bottom:0.5rem">' +
            '<div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--text-muted);margin-bottom:0.25rem">' +
              '<span>Couverture budget</span><span>' + CurrencyUtils.formatPercent(coverage) + '</span>' +
            '</div>' +
            '<div class="progress-bar"><div class="progress-fill" style="width:' + Math.min(coverage, 100) + '%;background:var(--accent-primary)"></div></div>' +
          '</div>' +
          '<div>' +
            '<div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--text-muted);margin-bottom:0.25rem">' +
              '<span>Consommation</span><span>' + CurrencyUtils.formatPercent(burn) + '</span>' +
            '</div>' +
            '<div class="progress-bar"><div class="progress-fill" style="width:' + Math.min(burn, 100) + '%;background:' + (burn > 90 ? 'var(--color-red)' : 'var(--color-blue)') + '"></div></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }
    html += '</div>';

    el.innerHTML = html;

    var cards = el.querySelectorAll('.project-card');
    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener('click', (function(proj) {
        return function() { showDetail(proj); };
      })(projectsList[j]));
    }
  }

  function countProjectSubventions(projectId) {
    var count = 0;
    for (var i = 0; i < subventions.length; i++) {
      if (subventions[i].project_id === projectId) count++;
    }
    return count;
  }

  function showDetail(project) {
    var projectSubs = subventions.filter(function(s) { return s.project_id === project.id; });
    var projectExps = expenses.filter(function(e) { return e.project_id === project.id; });
    var coverage = Calculations.projectBudgetCoverage(project, subventions);
    var totalExp = Calculations.totalExpenses(projectExps);
    var totalGranted = 0;
    for (var i = 0; i < projectSubs.length; i++) {
      var st = projectSubs[i].status;
      if (st === 'accordee' || st === 'conventionnee' || st === 'versee_partiel' || st === 'versee') {
        totalGranted += parseFloat(projectSubs[i].amount_granted) || 0;
      }
    }

    var subsHtml = '';
    for (var s = 0; s < projectSubs.length; s++) {
      var sub = projectSubs[s];
      subsHtml += '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--border-color)">' +
        '<div><div style="font-weight:600;font-size:0.85rem">' + App.escapeHtml(sub.name) + '</div>' +
        '<div style="font-size:0.72rem;color:var(--text-muted)">' + App.escapeHtml((sub.financeurs && sub.financeurs.name) || sub.financeur || '') + '</div></div>' +
        '<span class="badge ' + DataService.getStatusBadgeClass(sub.status) + '">' + DataService.getStatusLabel(sub.status) + '</span>' +
      '</div>';
    }

    var html =
      '<div class="slide-panel-header">' +
        '<h3 class="slide-panel-title">' + App.escapeHtml(project.name) + '</h3>' +
        '<button class="slide-panel-close" onclick="SlidePanel.close()">&times;</button>' +
      '</div>' +
      '<div class="slide-panel-body">' +
        '<div class="slide-panel-section">' +
          '<div class="slide-panel-section-title">Budget</div>' +
          '<div class="detail-row">' +
            '<div class="detail-field"><div class="detail-field-label">Budget total</div><div class="detail-field-value amount">' + CurrencyUtils.format(project.budget_total) + '</div></div>' +
            '<div class="detail-field"><div class="detail-field-label">Subventions accordées</div><div class="detail-field-value amount">' + CurrencyUtils.format(totalGranted) + '</div></div>' +
          '</div>' +
          '<div class="detail-row">' +
            '<div class="detail-field"><div class="detail-field-label">Dépenses</div><div class="detail-field-value">' + CurrencyUtils.format(totalExp) + '</div></div>' +
            '<div class="detail-field"><div class="detail-field-label">Couverture</div><div class="detail-field-value">' + CurrencyUtils.formatPercent(coverage) + '</div></div>' +
          '</div>' +
        '</div>' +
        (project.description ? '<div class="slide-panel-section"><div class="slide-panel-section-title">Description</div><p style="font-size:0.85rem;color:var(--text-secondary)">' + App.escapeHtml(project.description) + '</p></div>' : '') +
        '<div class="slide-panel-section">' +
          '<div class="slide-panel-section-title">Subventions (' + projectSubs.length + ')</div>' +
          (subsHtml || '<p style="font-size:0.82rem;color:var(--text-muted)">Aucune subvention liée</p>') +
        '</div>' +
      '</div>' +
      '<div class="slide-panel-footer">' +
        '<button class="btn btn-ghost btn-sm" onclick="ProjectsModule.showForm(' + JSON.stringify(project).replace(/"/g, '&quot;') + ')">Modifier</button>' +
        '<button class="btn btn-danger btn-sm" onclick="ProjectsModule.removeProject(\'' + project.id + '\')">Supprimer</button>' +
      '</div>';

    SlidePanel.open(html);
  }

  function showForm(prefill) {
    prefill = prefill || {};
    var html =
      '<div class="modal-header">' +
        '<h3 class="modal-title">' + (prefill.id ? 'Modifier le projet' : 'Nouveau projet') + '</h3>' +
        '<button class="modal-close" onclick="App.hideModal()">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<form id="projectForm">' +
          '<div class="form-group"><label class="form-label">Nom *</label><input type="text" class="form-input" name="name" value="' + App.escapeHtml(prefill.name || '') + '" required></div>' +
          '<div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" name="description" rows="3">' + App.escapeHtml(prefill.description || '') + '</textarea></div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label class="form-label">Budget total</label><input type="number" class="form-input" name="budget_total" value="' + (prefill.budget_total || '') + '" min="0" step="1"></div>' +
            '<div class="form-group"><label class="form-label">Statut</label>' +
              '<select class="form-select" name="status">' +
                '<option value="active"' + (prefill.status === 'active' || !prefill.status ? ' selected' : '') + '>Actif</option>' +
                '<option value="completed"' + (prefill.status === 'completed' ? ' selected' : '') + '>Terminé</option>' +
                '<option value="archived"' + (prefill.status === 'archived' ? ' selected' : '') + '>Archivé</option>' +
              '</select></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label class="form-label">Date début</label><input type="date" class="form-input" name="start_date" value="' + (prefill.start_date || '') + '"></div>' +
            '<div class="form-group"><label class="form-label">Date fin</label><input type="date" class="form-input" name="end_date" value="' + (prefill.end_date || '') + '"></div>' +
          '</div>' +
          (prefill.id ? '<input type="hidden" name="id" value="' + prefill.id + '">' : '') +
          '<button type="submit" class="btn btn-primary" style="width:100%">' + (prefill.id ? 'Enregistrer' : 'Créer') + '</button>' +
        '</form>' +
      '</div>';

    App.showModal(html);
    document.getElementById('projectForm').addEventListener('submit', handleSubmit);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var data = {
      name: form.name.value.trim(),
      description: form.description.value.trim() || null,
      budget_total: parseFloat(form.budget_total.value) || 0,
      status: form.status.value,
      start_date: form.start_date.value || null,
      end_date: form.end_date.value || null
    };

    var existingId = form.querySelector('[name="id"]');
    try {
      if (existingId) {
        await DataService.updateProject(existingId.value, data);
        App.toast('Projet mis à jour', 'success');
      } else {
        await DataService.createProject(data);
        App.toast('Projet créé', 'success');
      }
      App.hideModal();
      SlidePanel.close();
      await loadData();
    } catch (err) {
      App.toast('Erreur: ' + err.message, 'error');
    }
  }

  async function removeProject(id) {
    var ok = await App.confirmDialog('Supprimer ce projet et dissocier ses subventions ?');
    if (!ok) return;
    try {
      await DataService.deleteProject(id);
      App.toast('Projet supprimé', 'success');
      SlidePanel.close();
      await loadData();
    } catch (err) {
      App.toast('Erreur: ' + err.message, 'error');
    }
  }

  return {
    render: render,
    showForm: showForm,
    removeProject: removeProject
  };
})();
