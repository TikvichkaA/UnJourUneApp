/**
 * SubTracker - Module Dashboard (KPIs + graphiques)
 */
var DashboardModule = (function() {
  'use strict';

  async function render(container) {
    container.innerHTML =
      '<div class="page-header">' +
        '<div class="page-header-row">' +
          '<div>' +
            '<h1 class="page-title">Tableau de bord</h1>' +
            '<p class="page-subtitle">Vue d\'ensemble de vos subventions</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="page-body" id="dashboardContent"><div class="loading-spinner"></div></div>';

    try {
      var results = await Promise.all([
        DataService.getFinancements(),
        DataService.getProjects(),
        DataService.getExpenses(),
        DataService.getCalendarEvents({ from: DateUtils.formatDateISO(new Date()) })
      ]);

      var subs = results[0];
      var projects = results[1];
      var expenses = results[2];
      var events = results[3];

      renderDashboard(subs, projects, expenses, events);
    } catch (err) {
      console.error('[Dashboard]', err);
      document.getElementById('dashboardContent').innerHTML =
        '<div class="empty-state"><div class="empty-state-text">Erreur de chargement</div></div>';
    }
  }

  function renderDashboard(subs, projects, expenses, events) {
    var el = document.getElementById('dashboardContent');
    if (!el) return;

    ChartsComponent.destroyAll();

    var requested = Calculations.totalRequested(subs);
    var granted = Calculations.totalGranted(subs);
    var received = Calculations.totalReceived(subs);
    var rate = Calculations.successRate(subs);
    var counts = Calculations.countByStatus(subs);
    var byType = Calculations.countByFinanceurType(subs);
    var upcoming = Calculations.upcomingDeadlines(events, 30);

    // KPIs
    var html = '<div class="kpi-grid" style="margin-bottom:1.5rem">' +
      kpiCard('Total demandé', CurrencyUtils.formatCompact(requested), 'rgba(59,130,246,0.1)', '#3b82f6') +
      kpiCard('Total accordé', CurrencyUtils.formatCompact(granted), 'rgba(5,150,105,0.1)', '#059669') +
      kpiCard('Total reçu', CurrencyUtils.formatCompact(received), 'rgba(139,92,246,0.1)', '#8b5cf6') +
      kpiCard('Taux de succès', CurrencyUtils.formatPercent(rate), 'rgba(245,158,11,0.1)', '#f59e0b') +
    '</div>';

    // Charts grid
    html += '<div class="dashboard-grid">';

    // Bar chart - by status
    html += '<div class="card"><div class="card-header"><span class="card-title">Pipeline par statut</span></div>' +
      '<div class="card-body" id="chartStatus"></div></div>';

    // Pie chart - by funder type
    html += '<div class="card"><div class="card-header"><span class="card-title">Par type de financeur</span></div>' +
      '<div class="card-body" id="chartType"></div></div>';

    // Line chart - cash flow
    html += '<div class="card full-width"><div class="card-header"><span class="card-title">Cash Flow (12 mois)</span></div>' +
      '<div class="card-body" id="chartCashFlow"></div></div>';

    // Project coverage (horizontal bars)
    if (projects.length > 0) {
      html += '<div class="card"><div class="card-header"><span class="card-title">Couverture projets</span></div>' +
        '<div class="card-body" id="chartCoverage"></div></div>';
    }

    // Upcoming deadlines
    html += '<div class="card"><div class="card-header"><span class="card-title">Prochaines échéances</span></div>' +
      '<div class="card-body" id="deadlinesList"></div></div>';

    html += '</div>'; // end dashboard-grid

    el.innerHTML = html;

    // Render charts
    renderStatusChart(counts);
    renderTypeChart(byType);
    renderCashFlowChart(subs, expenses);
    if (projects.length > 0) renderCoverageChart(projects, subs);
    renderDeadlines(upcoming);
  }

  function kpiCard(label, value, bgColor, iconColor) {
    return '<div class="kpi-card">' +
      '<div class="kpi-icon" style="background:' + bgColor + ';color:' + iconColor + '">&#8364;</div>' +
      '<div class="kpi-label">' + label + '</div>' +
      '<div class="kpi-value">' + value + '</div>' +
    '</div>';
  }

  function renderStatusChart(counts) {
    var el = document.getElementById('chartStatus');
    if (!el) return;
    var labels = [];
    var data = [];
    var colors = ['#9ca3af', '#3b82f6', '#6366f1', '#f59e0b', '#059669', '#06b6d4', '#ec4899', '#059669', '#ef4444', '#d1d5db'];
    for (var i = 0; i < DataService.SUBVENTION_STATUSES.length; i++) {
      var s = DataService.SUBVENTION_STATUSES[i];
      if (counts[s.key] > 0) {
        labels.push(s.label);
        data.push(counts[s.key]);
      }
    }
    if (data.length === 0) {
      el.innerHTML = '<div class="empty-state" style="padding:1rem"><div class="empty-state-text">Aucune donnée</div></div>';
      return;
    }
    ChartsComponent.bar(el, 'chartStatusCanvas', labels, [{
      data: data,
      backgroundColor: colors.slice(0, data.length),
      borderRadius: 4
    }], { height: 220 });
  }

  function renderTypeChart(byType) {
    var el = document.getElementById('chartType');
    if (!el) return;
    var labels = [];
    var data = [];
    var typeLabels = { etat: 'État', region: 'Région', departement: 'Département', commune: 'Commune', europe: 'Europe', fondation: 'Fondation', autre: 'Autre' };
    var colors = ['#3b82f6', '#059669', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#9ca3af'];

    for (var key in byType) {
      if (byType.hasOwnProperty(key)) {
        labels.push(typeLabels[key] || key);
        data.push(byType[key]);
      }
    }
    if (data.length === 0) {
      el.innerHTML = '<div class="empty-state" style="padding:1rem"><div class="empty-state-text">Aucune donnée</div></div>';
      return;
    }
    ChartsComponent.pie(el, 'chartTypeCanvas', labels, data, colors, { height: 220 });
  }

  function renderCashFlowChart(subs, expenses) {
    var el = document.getElementById('chartCashFlow');
    if (!el) return;
    var cashFlow = Calculations.cashFlowByMonth(subs, expenses);
    var labels = [];
    var received = [];
    var spent = [];

    for (var key in cashFlow) {
      if (cashFlow.hasOwnProperty(key)) {
        var parts = key.split('-');
        labels.push(DateUtils.getMonthShort(parseInt(parts[1]) - 1));
        received.push(cashFlow[key].received);
        spent.push(cashFlow[key].spent);
      }
    }

    ChartsComponent.line(el, 'chartCashFlowCanvas', labels, [
      { label: 'Reçu', data: received, borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', fill: true },
      { label: 'Dépensé', data: spent, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true }
    ], { height: 220 });
  }

  function renderCoverageChart(projects, subs) {
    var el = document.getElementById('chartCoverage');
    if (!el) return;
    var labels = [];
    var data = [];
    for (var i = 0; i < projects.length && i < 8; i++) {
      labels.push(projects[i].name.substring(0, 20));
      data.push(Math.round(Calculations.projectBudgetCoverage(projects[i], subs)));
    }
    ChartsComponent.horizontalBar(el, 'chartCoverageCanvas', labels, [{
      data: data,
      backgroundColor: data.map(function(v) { return v >= 80 ? '#059669' : v >= 50 ? '#f59e0b' : '#ef4444'; }),
      borderRadius: 4
    }], { height: Math.max(120, projects.length * 35) });
  }

  function renderDeadlines(upcoming) {
    var el = document.getElementById('deadlinesList');
    if (!el) return;
    if (upcoming.length === 0) {
      el.innerHTML = '<div class="empty-state" style="padding:1rem"><div class="empty-state-text">Aucune échéance proche</div></div>';
      return;
    }
    var html = '<ul class="deadlines-list">';
    for (var i = 0; i < upcoming.length && i < 10; i++) {
      var ev = upcoming[i];
      var color = DataService.getEventTypeColor(ev.type);
      html += '<li class="deadline-item">' +
        '<div class="deadline-dot" style="background:' + color + '"></div>' +
        '<div class="deadline-info">' +
          '<div class="deadline-title">' + App.escapeHtml(ev.title) + '</div>' +
          '<div class="deadline-sub">' + DataService.getEventTypeLabel(ev.type) +
            (ev.financements ? ' - ' + App.escapeHtml(ev.financements.name) : '') + '</div>' +
        '</div>' +
        '<div class="deadline-date">' + DateUtils.relativeDate(ev.date) + '</div>' +
      '</li>';
    }
    html += '</ul>';
    el.innerHTML = html;
  }

  return {
    render: render
  };
})();
