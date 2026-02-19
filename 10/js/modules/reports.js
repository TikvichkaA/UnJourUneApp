/**
 * SubTracker - Module Rapports (Export PDF/CSV)
 */
var ReportsModule = (function() {
  'use strict';

  var subs = [];
  var projects = [];
  var expenses = [];

  async function render(container) {
    container.innerHTML =
      '<div class="page-header">' +
        '<div class="page-header-row">' +
          '<div>' +
            '<h1 class="page-title">Rapports</h1>' +
            '<p class="page-subtitle">Exports et synthèses</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="page-body" id="reportsContent"><div class="loading-spinner"></div></div>';

    try {
      var results = await Promise.all([
        DataService.getFinancements(),
        DataService.getProjects(),
        DataService.getExpenses()
      ]);
      subs = results[0];
      projects = results[1];
      expenses = results[2];
      renderReportOptions();
    } catch (err) {
      App.toast('Erreur de chargement', 'error');
    }
  }

  function renderReportOptions() {
    var el = document.getElementById('reportsContent');
    if (!el) return;

    el.innerHTML =
      '<div class="projects-grid">' +
        reportCard('Synthèse subventions', 'Tableau récapitulatif de toutes les subventions avec statuts, montants et financeurs.', 'exportSubventionsPDF', 'exportSubventionsCSV') +
        reportCard('Bilan financier', 'Vue d\'ensemble : demandé, accordé, reçu, taux de succès, répartition par financeur.', 'exportBilanPDF', null) +
        reportCard('Rapport par projet', 'Détail par projet : budget, couverture, subventions liées, dépenses.', 'exportProjectsPDF', 'exportProjectsCSV') +
        reportCard('Export dépenses', 'Liste détaillée de toutes les dépenses pour justification comptable.', null, 'exportExpensesCSV') +
      '</div>';

    // Bind
    bindBtn(el, 'exportSubventionsPDF', exportSubventionsPDF);
    bindBtn(el, 'exportSubventionsCSV', exportSubventionsCSV);
    bindBtn(el, 'exportBilanPDF', exportBilanPDF);
    bindBtn(el, 'exportProjectsPDF', exportProjectsPDF);
    bindBtn(el, 'exportProjectsCSV', exportProjectsCSV);
    bindBtn(el, 'exportExpensesCSV', exportExpensesCSV);
  }

  function reportCard(title, description, pdfId, csvId) {
    return '<div class="card">' +
      '<div class="card-body">' +
        '<h3 style="font-size:1rem;font-weight:600;margin-bottom:0.5rem">' + title + '</h3>' +
        '<p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:1rem">' + description + '</p>' +
        '<div style="display:flex;gap:0.5rem">' +
          (pdfId ? '<button class="btn btn-primary btn-sm" id="' + pdfId + '">PDF</button>' : '') +
          (csvId ? '<button class="btn btn-secondary btn-sm" id="' + csvId + '">CSV</button>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function bindBtn(el, id, fn) {
    var btn = el.querySelector('#' + id);
    if (btn) btn.addEventListener('click', fn);
  }

  // ---- PDF Exports ----

  function exportSubventionsPDF() {
    var doc = PDFExport.createDoc('Synthese des financements');
    var columns = [
      { label: 'Nom', key: 'name' },
      { label: 'Financeur', value: function(r) { return (r.financeurs && r.financeurs.name) || r.financeur || ''; } },
      { label: 'Statut', value: function(r) { return DataService.getStatusLabel(r.status); } },
      { label: 'Demandé', value: function(r) { return CurrencyUtils.format(r.amount_requested); } },
      { label: 'Accordé', value: function(r) { return r.amount_granted ? CurrencyUtils.format(r.amount_granted) : '—'; } },
      { label: 'Reçu', value: function(r) { return CurrencyUtils.format(r.amount_received); } }
    ];
    PDFExport.addTable(doc, columns, subs);
    PDFExport.save(doc, 'subtracker-subventions.pdf');
    App.toast('PDF généré', 'success');
  }

  function exportBilanPDF() {
    var doc = PDFExport.createDoc('Bilan financier');
    var y = PDFExport.addKPIs(doc, [
      { label: 'Total demandé', value: CurrencyUtils.formatCompact(Calculations.totalRequested(subs)) },
      { label: 'Total accordé', value: CurrencyUtils.formatCompact(Calculations.totalGranted(subs)) },
      { label: 'Total reçu', value: CurrencyUtils.formatCompact(Calculations.totalReceived(subs)) },
      { label: 'Taux de succès', value: CurrencyUtils.formatPercent(Calculations.successRate(subs)) }
    ]);

    // Status breakdown
    var counts = Calculations.countByStatus(subs);
    var statusRows = [];
    for (var i = 0; i < DataService.SUBVENTION_STATUSES.length; i++) {
      var s = DataService.SUBVENTION_STATUSES[i];
      if (counts[s.key] > 0) {
        statusRows.push({ label: s.label, count: counts[s.key] });
      }
    }
    PDFExport.addTable(doc, [
      { label: 'Statut', key: 'label' },
      { label: 'Nombre', key: 'count' }
    ], statusRows, y);

    PDFExport.save(doc, 'subtracker-bilan.pdf');
    App.toast('PDF généré', 'success');
  }

  function exportProjectsPDF() {
    var doc = PDFExport.createDoc('Rapport par projet');
    var rows = projects.map(function(p) {
      var coverage = Calculations.projectBudgetCoverage(p, subs);
      var burn = Calculations.burnRate(p, expenses);
      return {
        name: p.name,
        budget: CurrencyUtils.format(p.budget_total),
        coverage: CurrencyUtils.formatPercent(coverage),
        burn: CurrencyUtils.formatPercent(burn),
        status: p.status
      };
    });

    PDFExport.addTable(doc, [
      { label: 'Projet', key: 'name' },
      { label: 'Budget', key: 'budget' },
      { label: 'Couverture', key: 'coverage' },
      { label: 'Consommation', key: 'burn' },
      { label: 'Statut', key: 'status' }
    ], rows);

    PDFExport.save(doc, 'subtracker-projets.pdf');
    App.toast('PDF généré', 'success');
  }

  // ---- CSV Exports ----

  function exportSubventionsCSV() {
    CSVExport.exportData(subs, [
      { label: 'Nom', key: 'name' },
      { label: 'Financeur', value: function(r) { return (r.financeurs && r.financeurs.name) || r.financeur || ''; } },
      { label: 'Type financeur', value: function(r) { return (r.financeurs && r.financeurs.type) || r.financeur_type || ''; } },
      { label: 'Statut', value: function(r) { return DataService.getStatusLabel(r.status); } },
      { label: 'Montant demandé', key: 'amount_requested' },
      { label: 'Montant accordé', key: 'amount_granted' },
      { label: 'Montant reçu', key: 'amount_received' },
      { label: 'Référence', key: 'reference' },
      { label: 'Notes', key: 'notes' }
    ], 'subtracker-subventions.csv');
    App.toast('CSV exporté', 'success');
  }

  function exportProjectsCSV() {
    CSVExport.exportData(projects.map(function(p) {
      return Object.assign({}, p, {
        coverage: Math.round(Calculations.projectBudgetCoverage(p, subs)),
        burn: Math.round(Calculations.burnRate(p, expenses))
      });
    }), [
      { label: 'Nom', key: 'name' },
      { label: 'Budget', key: 'budget_total' },
      { label: 'Couverture (%)', key: 'coverage' },
      { label: 'Consommation (%)', key: 'burn' },
      { label: 'Statut', key: 'status' },
      { label: 'Date début', key: 'start_date' },
      { label: 'Date fin', key: 'end_date' }
    ], 'subtracker-projets.csv');
    App.toast('CSV exporté', 'success');
  }

  function exportExpensesCSV() {
    CSVExport.exportData(expenses, [
      { label: 'Date', key: 'date' },
      { label: 'Libellé', key: 'label' },
      { label: 'Montant', key: 'amount' },
      { label: 'Catégorie', key: 'category' },
      { label: 'Projet', value: function(r) { return r.projects ? r.projects.name : ''; } },
      { label: 'Financement', value: function(r) { return r.financements ? r.financements.name : ''; } },
      { label: 'Notes', key: 'notes' }
    ], 'subtracker-depenses.csv');
    App.toast('CSV exporté', 'success');
  }

  return {
    render: render
  };
})();
