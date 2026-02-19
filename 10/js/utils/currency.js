/**
 * SubTracker - Utilitaires monétaires
 */
var CurrencyUtils = (function() {
  'use strict';

  var formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  var formatterCents = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  var numberFormatter = new Intl.NumberFormat('fr-FR');

  function format(amount) {
    if (amount === null || amount === undefined) return '—';
    return formatter.format(amount);
  }

  function formatCents(amount) {
    if (amount === null || amount === undefined) return '—';
    return formatterCents.format(amount);
  }

  function formatCompact(amount) {
    if (amount === null || amount === undefined) return '—';
    if (amount >= 1000000) return (amount / 1000000).toFixed(1).replace('.0', '') + ' M€';
    if (amount >= 1000) return (amount / 1000).toFixed(1).replace('.0', '') + ' k€';
    return amount + ' €';
  }

  function formatNumber(n) {
    if (n === null || n === undefined) return '—';
    return numberFormatter.format(n);
  }

  function formatPercent(value, decimals) {
    if (value === null || value === undefined) return '—';
    var d = decimals !== undefined ? decimals : 0;
    return value.toFixed(d) + ' %';
  }

  function parseAmount(str) {
    if (!str) return 0;
    var cleaned = String(str).replace(/[^\d,.\-]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  }

  return {
    format: format,
    formatCents: formatCents,
    formatCompact: formatCompact,
    formatNumber: formatNumber,
    formatPercent: formatPercent,
    parseAmount: parseAmount
  };
})();
