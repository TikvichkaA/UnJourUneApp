/**
 * SubTracker - Utilitaires dates
 */
const DateUtils = (function() {
  'use strict';

  const MONTHS_FR = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const MONTHS_SHORT_FR = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
  ];

  const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.getDate() + ' ' + MONTHS_SHORT_FR[d.getMonth()] + ' ' + d.getFullYear();
  }

  function formatDateLong(dateStr) {
    if (!dateStr) return '—';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.getDate() + ' ' + MONTHS_FR[d.getMonth()] + ' ' + d.getFullYear();
  }

  function formatDateISO(date) {
    var d = date instanceof Date ? date : new Date(date);
    return d.toISOString().split('T')[0];
  }

  function daysUntil(dateStr) {
    if (!dateStr) return null;
    var target = new Date(dateStr);
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  }

  function daysSince(dateStr) {
    if (!dateStr) return null;
    var d = daysUntil(dateStr);
    return d !== null ? -d : null;
  }

  function getDeadlineStatus(dateStr) {
    var days = daysUntil(dateStr);
    if (days === null) return { label: 'Permanent', class: 'ok', days: null };
    if (days <= 0) return { label: 'Clos', class: 'closed', days: days };
    if (days <= 7) return { label: days + 'j restants', class: 'urgent', days: days };
    if (days <= 30) return { label: days + 'j restants', class: 'soon', days: days };
    return { label: days + 'j', class: 'ok', days: days };
  }

  function getMonthName(month) {
    return MONTHS_FR[month];
  }

  function getMonthShort(month) {
    return MONTHS_SHORT_FR[month];
  }

  function getDayName(day) {
    return DAYS_FR[day];
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    var day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday-first
  }

  function isToday(date) {
    var today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  function isSameDay(d1, d2) {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }

  function relativeDate(dateStr) {
    var days = daysUntil(dateStr);
    if (days === null) return '—';
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Demain';
    if (days === -1) return 'Hier';
    if (days > 0 && days <= 7) return 'Dans ' + days + ' jours';
    if (days < 0 && days >= -7) return 'Il y a ' + (-days) + ' jours';
    return formatDate(dateStr);
  }

  return {
    formatDate: formatDate,
    formatDateLong: formatDateLong,
    formatDateISO: formatDateISO,
    daysUntil: daysUntil,
    daysSince: daysSince,
    getDeadlineStatus: getDeadlineStatus,
    getMonthName: getMonthName,
    getMonthShort: getMonthShort,
    getDayName: getDayName,
    getDaysInMonth: getDaysInMonth,
    getFirstDayOfMonth: getFirstDayOfMonth,
    isToday: isToday,
    isSameDay: isSameDay,
    relativeDate: relativeDate,
    MONTHS_FR: MONTHS_FR,
    MONTHS_SHORT_FR: MONTHS_SHORT_FR,
    DAYS_FR: DAYS_FR
  };
})();
