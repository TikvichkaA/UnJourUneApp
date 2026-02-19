/**
 * SubTracker - Vue calendrier mois (custom, sans lib externe)
 */
var CalendarViewModule = (function() {
  'use strict';

  var currentYear = new Date().getFullYear();
  var currentMonth = new Date().getMonth();
  var events = [];
  var containerEl = null;

  async function render(container) {
    containerEl = container;
    container.innerHTML =
      '<div class="page-header">' +
        '<div class="page-header-row">' +
          '<div>' +
            '<h1 class="page-title">Calendrier</h1>' +
            '<p class="page-subtitle">Échéances et événements</p>' +
          '</div>' +
          '<button class="btn btn-primary" id="btnAddEvent">+ Événement</button>' +
        '</div>' +
      '</div>' +
      '<div class="page-body">' +
        '<div class="calendar-nav" id="calendarNav"></div>' +
        '<div id="calendarGrid"></div>' +
        '<div id="calendarDayDetail" style="margin-top:1rem"></div>' +
      '</div>';

    container.querySelector('#btnAddEvent').addEventListener('click', function() { showEventForm(); });
    await loadEvents();
  }

  async function loadEvents() {
    try {
      var firstDay = new Date(currentYear, currentMonth, 1);
      var lastDay = new Date(currentYear, currentMonth + 1, 0);
      events = await DataService.getCalendarEvents({
        from: DateUtils.formatDateISO(firstDay),
        to: DateUtils.formatDateISO(lastDay)
      });
      renderCalendar();
    } catch (err) {
      App.toast('Erreur de chargement', 'error');
    }
  }

  function renderCalendar() {
    // Navigation
    var navEl = document.getElementById('calendarNav');
    if (navEl) {
      navEl.innerHTML =
        '<button class="btn btn-ghost" id="calPrev">&#9664;</button>' +
        '<span class="calendar-month-title">' + DateUtils.getMonthName(currentMonth) + ' ' + currentYear + '</span>' +
        '<button class="btn btn-ghost" id="calNext">&#9654;</button>' +
        '<button class="btn btn-secondary btn-sm" id="calToday" style="margin-left:1rem">Aujourd\'hui</button>';

      document.getElementById('calPrev').addEventListener('click', function() { changeMonth(-1); });
      document.getElementById('calNext').addEventListener('click', function() { changeMonth(1); });
      document.getElementById('calToday').addEventListener('click', function() {
        currentYear = new Date().getFullYear();
        currentMonth = new Date().getMonth();
        loadEvents();
      });
    }

    // Grid
    var gridEl = document.getElementById('calendarGrid');
    if (!gridEl) return;

    var daysInMonth = DateUtils.getDaysInMonth(currentYear, currentMonth);
    var firstDayOfWeek = DateUtils.getFirstDayOfMonth(currentYear, currentMonth);

    var html = '<div class="calendar-grid">';

    // Headers
    var dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    for (var d = 0; d < 7; d++) {
      html += '<div class="calendar-day-header">' + dayNames[d] + '</div>';
    }

    // Empty cells before month start
    for (var e = 0; e < firstDayOfWeek; e++) {
      html += '<div class="calendar-day empty"></div>';
    }

    // Days
    var today = new Date();
    for (var day = 1; day <= daysInMonth; day++) {
      var date = new Date(currentYear, currentMonth, day);
      var isToday = DateUtils.isToday(date);
      var dayEvents = getEventsForDay(day);
      var cls = 'calendar-day' + (isToday ? ' today' : '') + (dayEvents.length > 0 ? ' has-events' : '');

      html += '<div class="' + cls + '" data-day="' + day + '">';
      html += '<span class="calendar-day-number">' + day + '</span>';

      if (dayEvents.length > 0) {
        html += '<div class="calendar-day-dots">';
        for (var i = 0; i < dayEvents.length && i < 3; i++) {
          var color = DataService.getEventTypeColor(dayEvents[i].type);
          html += '<span class="calendar-dot" style="background:' + color + '" title="' + App.escapeHtml(dayEvents[i].title) + '"></span>';
        }
        if (dayEvents.length > 3) {
          html += '<span class="calendar-dot-more">+' + (dayEvents.length - 3) + '</span>';
        }
        html += '</div>';
      }
      html += '</div>';
    }

    html += '</div>';
    gridEl.innerHTML = html;

    // Bind day clicks
    var dayCells = gridEl.querySelectorAll('.calendar-day:not(.empty)');
    for (var j = 0; j < dayCells.length; j++) {
      dayCells[j].addEventListener('click', function() {
        var dayNum = parseInt(this.getAttribute('data-day'));
        showDayDetail(dayNum);
      });
    }
  }

  function getEventsForDay(day) {
    var dateStr = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    var result = [];
    for (var i = 0; i < events.length; i++) {
      if (events[i].date === dateStr) result.push(events[i]);
    }
    return result;
  }

  function showDayDetail(day) {
    var detailEl = document.getElementById('calendarDayDetail');
    if (!detailEl) return;

    var dayEvents = getEventsForDay(day);
    var dateStr = day + ' ' + DateUtils.getMonthName(currentMonth) + ' ' + currentYear;

    if (dayEvents.length === 0) {
      detailEl.innerHTML = '<div class="card"><div class="card-body" style="text-align:center;color:var(--text-muted)">' +
        dateStr + ' — Aucun événement</div></div>';
      return;
    }

    var html = '<div class="card"><div class="card-header"><span class="card-title">' + dateStr + ' (' + dayEvents.length + ')</span></div>' +
      '<div class="card-body"><ul class="deadlines-list">';

    for (var i = 0; i < dayEvents.length; i++) {
      var ev = dayEvents[i];
      var color = DataService.getEventTypeColor(ev.type);
      var subName = ev.financements ? ev.financements.name : '';
      html += '<li class="deadline-item">' +
        '<div class="deadline-dot" style="background:' + color + '"></div>' +
        '<div class="deadline-info">' +
          '<div class="deadline-title">' + App.escapeHtml(ev.title) + '</div>' +
          '<div class="deadline-sub">' + DataService.getEventTypeLabel(ev.type) +
            (subName ? ' — ' + App.escapeHtml(subName) : '') + '</div>' +
        '</div>' +
        '<div style="display:flex;gap:0.25rem">' +
          '<button class="btn btn-ghost btn-sm" data-toggle-event="' + ev.id + '" title="' + (ev.is_done ? 'Marquer non fait' : 'Marquer fait') + '">' +
            (ev.is_done ? '&#10003;' : '&#9675;') + '</button>' +
          '<button class="btn btn-ghost btn-sm" data-delete-event="' + ev.id + '" title="Supprimer">&#10007;</button>' +
        '</div>' +
      '</li>';
    }
    html += '</ul></div></div>';
    detailEl.innerHTML = html;

    // Bind toggle / delete
    var toggleBtns = detailEl.querySelectorAll('[data-toggle-event]');
    for (var t = 0; t < toggleBtns.length; t++) {
      toggleBtns[t].addEventListener('click', (function(evId, isDone) {
        return async function() {
          await DataService.updateCalendarEvent(evId, { is_done: !isDone });
          await loadEvents();
          showDayDetail(day);
        };
      })(toggleBtns[t].getAttribute('data-toggle-event'), dayEvents[t].is_done));
    }

    var delBtns = detailEl.querySelectorAll('[data-delete-event]');
    for (var d = 0; d < delBtns.length; d++) {
      delBtns[d].addEventListener('click', (function(evId) {
        return async function() {
          var ok = await App.confirmDialog('Supprimer cet événement ?');
          if (!ok) return;
          await DataService.deleteCalendarEvent(evId);
          App.toast('Événement supprimé', 'success');
          await loadEvents();
        };
      })(delBtns[d].getAttribute('data-delete-event')));
    }
  }

  function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    loadEvents();
  }

  async function showEventForm(prefill) {
    prefill = prefill || {};
    var financementsList = [];
    try { financementsList = await DataService.getFinancements(); } catch (e) {}

    var subOptions = '<option value="">— Aucun —</option>';
    for (var i = 0; i < financementsList.length; i++) {
      var sel = prefill.financement_id === financementsList[i].id ? ' selected' : '';
      subOptions += '<option value="' + financementsList[i].id + '"' + sel + '>' + App.escapeHtml(financementsList[i].name) + '</option>';
    }

    var typeOptions = '';
    for (var t = 0; t < DataService.EVENT_TYPES.length; t++) {
      var et = DataService.EVENT_TYPES[t];
      typeOptions += '<option value="' + et.key + '"' + (prefill.type === et.key ? ' selected' : '') + '>' + et.label + '</option>';
    }

    var html =
      '<div class="modal-header">' +
        '<h3 class="modal-title">Nouvel événement</h3>' +
        '<button class="modal-close" onclick="App.hideModal()">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<form id="eventForm">' +
          '<div class="form-group"><label class="form-label">Titre *</label><input type="text" class="form-input" name="title" required></div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label class="form-label">Date *</label><input type="date" class="form-input" name="date" value="' + DateUtils.formatDateISO(new Date()) + '" required></div>' +
            '<div class="form-group"><label class="form-label">Type</label><select class="form-select" name="type">' + typeOptions + '</select></div>' +
          '</div>' +
          '<div class="form-group"><label class="form-label">Financement lie</label><select class="form-select" name="financement_id">' + subOptions + '</select></div>' +
          '<div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" name="notes" rows="2"></textarea></div>' +
          '<button type="submit" class="btn btn-primary" style="width:100%">Créer</button>' +
        '</form>' +
      '</div>';

    App.showModal(html);
    document.getElementById('eventForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      var form = e.target;
      try {
        await DataService.createCalendarEvent({
          title: form.title.value.trim(),
          date: form.date.value,
          type: form.type.value,
          financement_id: form.financement_id.value || null,
          notes: form.notes.value.trim() || null
        });
        App.toast('Événement créé', 'success');
        App.hideModal();
        await loadEvents();
      } catch (err) {
        App.toast('Erreur: ' + err.message, 'error');
      }
    });
  }

  return {
    render: render,
    showEventForm: showEventForm
  };
})();
