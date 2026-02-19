/**
 * SubTracker - Calculs financiers
 */
var Calculations = (function() {
  'use strict';

  function totalRequested(subventions) {
    var total = 0;
    for (var i = 0; i < subventions.length; i++) {
      total += parseFloat(subventions[i].amount_requested) || 0;
    }
    return total;
  }

  function totalGranted(subventions) {
    var total = 0;
    for (var i = 0; i < subventions.length; i++) {
      var s = subventions[i];
      if (s.status === 'accordee' || s.status === 'conventionnee' ||
          s.status === 'versee_partiel' || s.status === 'versee') {
        total += parseFloat(s.amount_granted) || 0;
      }
    }
    return total;
  }

  function totalReceived(subventions) {
    var total = 0;
    for (var i = 0; i < subventions.length; i++) {
      total += parseFloat(subventions[i].amount_received) || 0;
    }
    return total;
  }

  function successRate(subventions) {
    var decided = 0;
    var won = 0;
    for (var i = 0; i < subventions.length; i++) {
      var st = subventions[i].status;
      if (st === 'accordee' || st === 'conventionnee' || st === 'versee_partiel' || st === 'versee') {
        decided++;
        won++;
      } else if (st === 'refusee') {
        decided++;
      }
    }
    return decided > 0 ? (won / decided) * 100 : 0;
  }

  function countByStatus(subventions) {
    var counts = {};
    for (var i = 0; i < DataService.SUBVENTION_STATUSES.length; i++) {
      counts[DataService.SUBVENTION_STATUSES[i].key] = 0;
    }
    for (var j = 0; j < subventions.length; j++) {
      var st = subventions[j].status;
      counts[st] = (counts[st] || 0) + 1;
    }
    return counts;
  }

  function countByFinanceurType(subventions) {
    var counts = {};
    for (var i = 0; i < subventions.length; i++) {
      var ft = (subventions[i].financeurs && subventions[i].financeurs.type) || subventions[i].financeur_type || 'autre';
      counts[ft] = (counts[ft] || 0) + 1;
    }
    return counts;
  }

  function projectBudgetCoverage(project, subventions) {
    var budget = parseFloat(project.budget_total) || 0;
    if (budget === 0) return 0;
    var granted = 0;
    for (var i = 0; i < subventions.length; i++) {
      var s = subventions[i];
      if (s.project_id === project.id) {
        if (s.status === 'accordee' || s.status === 'conventionnee' ||
            s.status === 'versee_partiel' || s.status === 'versee') {
          granted += parseFloat(s.amount_granted) || 0;
        }
      }
    }
    return (granted / budget) * 100;
  }

  function totalExpenses(expenses) {
    var total = 0;
    for (var i = 0; i < expenses.length; i++) {
      total += parseFloat(expenses[i].amount) || 0;
    }
    return total;
  }

  function expensesByCategory(expenses) {
    var cats = {};
    for (var i = 0; i < expenses.length; i++) {
      var cat = expenses[i].category || 'autre';
      cats[cat] = (cats[cat] || 0) + (parseFloat(expenses[i].amount) || 0);
    }
    return cats;
  }

  function burnRate(project, expenses) {
    var budget = parseFloat(project.budget_total) || 0;
    if (budget === 0) return 0;
    var spent = 0;
    for (var i = 0; i < expenses.length; i++) {
      if (expenses[i].project_id === project.id) {
        spent += parseFloat(expenses[i].amount) || 0;
      }
    }
    return (spent / budget) * 100;
  }

  function cashFlowByMonth(subventions, expenses) {
    var months = {};
    for (var i = 0; i < 12; i++) {
      var d = new Date();
      d.setMonth(d.getMonth() - 11 + i);
      var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      months[key] = { received: 0, spent: 0 };
    }

    for (var j = 0; j < subventions.length; j++) {
      var s = subventions[j];
      var dates = s.dates || {};
      if (dates.versement_date) {
        var mk = dates.versement_date.substring(0, 7);
        if (months[mk]) months[mk].received += parseFloat(s.amount_received) || 0;
      }
    }

    for (var k = 0; k < expenses.length; k++) {
      var e = expenses[k];
      if (e.date) {
        var ek = e.date.substring(0, 7);
        if (months[ek]) months[ek].spent += parseFloat(e.amount) || 0;
      }
    }

    return months;
  }

  function upcomingDeadlines(events, days) {
    days = days || 30;
    var now = new Date();
    var cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    var upcoming = [];
    for (var i = 0; i < events.length; i++) {
      var evDate = new Date(events[i].date);
      if (evDate >= now && evDate <= cutoff && !events[i].is_done) {
        upcoming.push(events[i]);
      }
    }
    return upcoming;
  }

  return {
    totalRequested: totalRequested,
    totalGranted: totalGranted,
    totalReceived: totalReceived,
    successRate: successRate,
    countByStatus: countByStatus,
    countByFinanceurType: countByFinanceurType,
    projectBudgetCoverage: projectBudgetCoverage,
    totalExpenses: totalExpenses,
    expensesByCategory: expensesByCategory,
    burnRate: burnRate,
    cashFlowByMonth: cashFlowByMonth,
    upcomingDeadlines: upcomingDeadlines
  };
})();
