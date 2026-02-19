/**
 * SubTracker - Module Dépenses (utilisé dans les vues projets/subventions)
 */
var ExpensesModule = (function() {
  'use strict';

  async function renderExpensesList(container, opts) {
    opts = opts || {};
    try {
      var expenses = await DataService.getExpenses(opts);
      var projects = await DataService.getProjects();
      var subventions = await DataService.getFinancements();

      if (expenses.length === 0) {
        container.innerHTML =
          '<div class="empty-state" style="padding:1.5rem">' +
            '<div class="empty-state-text">Aucune dépense enregistrée</div>' +
            '<button class="btn btn-primary btn-sm" id="btnAddExpense">+ Ajouter une dépense</button>' +
          '</div>';
        container.querySelector('#btnAddExpense').addEventListener('click', function() {
          showForm({ project_id: opts.project_id, financement_id: opts.financement_id }, projects, subventions);
        });
        return;
      }

      var total = Calculations.totalExpenses(expenses);
      var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">' +
        '<div><strong>Total :</strong> ' + CurrencyUtils.format(total) + '</div>' +
        '<button class="btn btn-primary btn-sm" id="btnAddExpense">+ Depense</button>' +
      '</div>';

      html += '<div class="data-table-wrap"><table class="data-table"><thead><tr>' +
        '<th class="data-table-th">Date</th>' +
        '<th class="data-table-th">Libellé</th>' +
        '<th class="data-table-th">Catégorie</th>' +
        '<th class="data-table-th">Montant</th>' +
        '<th class="data-table-th"></th>' +
      '</tr></thead><tbody>';

      for (var i = 0; i < expenses.length; i++) {
        var exp = expenses[i];
        html += '<tr>' +
          '<td class="data-table-td">' + DateUtils.formatDate(exp.date) + '</td>' +
          '<td class="data-table-td">' + App.escapeHtml(exp.label) + '</td>' +
          '<td class="data-table-td"><span class="badge badge-preparation">' + App.escapeHtml(exp.category || 'autre') + '</span></td>' +
          '<td class="data-table-td" style="font-weight:600">' + CurrencyUtils.format(exp.amount) + '</td>' +
          '<td class="data-table-td"><button class="btn btn-ghost btn-sm" data-delete-expense="' + exp.id + '">&#10007;</button></td>' +
        '</tr>';
      }
      html += '</tbody></table></div>';

      container.innerHTML = html;

      container.querySelector('#btnAddExpense').addEventListener('click', function() {
        showForm({ project_id: opts.project_id, financement_id: opts.financement_id }, projects, subventions);
      });

      var delBtns = container.querySelectorAll('[data-delete-expense]');
      for (var d = 0; d < delBtns.length; d++) {
        delBtns[d].addEventListener('click', (function(expId) {
          return async function(e) {
            e.stopPropagation();
            var ok = await App.confirmDialog('Supprimer cette dépense ?');
            if (!ok) return;
            await DataService.deleteExpense(expId);
            App.toast('Dépense supprimée', 'success');
            renderExpensesList(container, opts);
          };
        })(delBtns[d].getAttribute('data-delete-expense')));
      }
    } catch (err) {
      App.toast('Erreur: ' + err.message, 'error');
    }
  }

  function showForm(prefill, projects, subventionsList) {
    prefill = prefill || {};
    var projectOptions = '<option value="">— Aucun —</option>';
    if (projects) {
      for (var i = 0; i < projects.length; i++) {
        var sel = prefill.project_id === projects[i].id ? ' selected' : '';
        projectOptions += '<option value="' + projects[i].id + '"' + sel + '>' + App.escapeHtml(projects[i].name) + '</option>';
      }
    }

    var subOptions = '<option value="">— Aucun —</option>';
    if (subventionsList) {
      for (var j = 0; j < subventionsList.length; j++) {
        var selS = prefill.financement_id === subventionsList[j].id ? ' selected' : '';
        subOptions += '<option value="' + subventionsList[j].id + '"' + selS + '>' + App.escapeHtml(subventionsList[j].name) + '</option>';
      }
    }

    var catOptions = '';
    for (var k = 0; k < DataService.EXPENSE_CATEGORIES.length; k++) {
      var cat = DataService.EXPENSE_CATEGORIES[k];
      catOptions += '<option value="' + cat + '"' + (prefill.category === cat ? ' selected' : '') + '>' + cat.charAt(0).toUpperCase() + cat.slice(1) + '</option>';
    }

    var html =
      '<div class="modal-header">' +
        '<h3 class="modal-title">Nouvelle dépense</h3>' +
        '<button class="modal-close" onclick="App.hideModal()">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<form id="expenseForm">' +
          '<div class="form-group"><label class="form-label">Libellé *</label><input type="text" class="form-input" name="label" required></div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label class="form-label">Montant *</label><input type="number" class="form-input" name="amount" min="0" step="0.01" required></div>' +
            '<div class="form-group"><label class="form-label">Date</label><input type="date" class="form-input" name="date" value="' + DateUtils.formatDateISO(new Date()) + '"></div>' +
          '</div>' +
          '<div class="form-group"><label class="form-label">Catégorie</label><select class="form-select" name="category">' + catOptions + '</select></div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label class="form-label">Projet</label><select class="form-select" name="project_id">' + projectOptions + '</select></div>' +
            '<div class="form-group"><label class="form-label">Financement</label><select class="form-select" name="financement_id">' + subOptions + '</select></div>' +
          '</div>' +
          '<div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" name="notes" rows="2"></textarea></div>' +
          '<button type="submit" class="btn btn-primary" style="width:100%">Ajouter</button>' +
        '</form>' +
      '</div>';

    App.showModal(html);
    document.getElementById('expenseForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      var form = e.target;
      try {
        await DataService.createExpense({
          label: form.label.value.trim(),
          amount: parseFloat(form.amount.value),
          date: form.date.value || null,
          category: form.category.value,
          project_id: form.project_id.value || null,
          financement_id: form.financement_id.value || null,
          notes: form.notes.value.trim() || null
        });
        App.toast('Dépense ajoutée', 'success');
        App.hideModal();
        // Refresh current route
        var parsed = App.getRouteFromHash();
        window.location.hash = '#' + parsed.route;
      } catch (err) {
        App.toast('Erreur: ' + err.message, 'error');
      }
    });
  }

  return {
    renderExpensesList: renderExpensesList,
    showForm: showForm
  };
})();
