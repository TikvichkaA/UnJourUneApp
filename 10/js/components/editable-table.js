/**
 * SubTracker - Editable Table (spreadsheet-style inline editing)
 */
var EditableTable = (function() {
  'use strict';

  function render(container, config) {
    var columns = config.columns || [];
    var data = config.data || [];
    var onSave = config.onSave || null;
    var onDelete = config.onDelete || null;
    var sortCol = config.sortCol !== undefined ? config.sortCol : null;
    var sortDir = config.sortDir || 'asc';
    var emptyText = config.emptyText || 'Aucune donnée';

    if (sortCol !== null) {
      data = sortData(data, columns[sortCol], sortDir);
    }

    var wrap = document.createElement('div');
    wrap.className = 'editable-table-wrap';

    if (data.length === 0) {
      wrap.innerHTML =
        '<div class="empty-state" style="padding:2rem">' +
          '<div class="empty-state-text">' + App.escapeHtml(emptyText) + '</div>' +
        '</div>';
      container.innerHTML = '';
      container.appendChild(wrap);
      return;
    }

    // Build header
    var html = '<table class="editable-table"><thead><tr>';
    for (var h = 0; h < columns.length; h++) {
      var col = columns[h];
      var sortIcon = '';
      if (h === sortCol) {
        sortIcon = sortDir === 'asc' ? ' &#9650;' : ' &#9660;';
      }
      var sortClass = col.sortable !== false ? ' sortable' : '';
      html += '<th class="' + sortClass + '" data-col="' + h + '">' +
              App.escapeHtml(col.label) + sortIcon + '</th>';
    }
    if (onDelete) {
      html += '<th style="width:40px"></th>';
    }
    html += '</tr></thead><tbody>';

    // Build rows
    for (var r = 0; r < data.length; r++) {
      var row = data[r];
      html += '<tr data-id="' + (row.id || r) + '">';

      for (var c = 0; c < columns.length; c++) {
        var colDef = columns[c];
        var cellValue = row[colDef.key];
        var displayVal = '';

        if (colDef.type === 'readonly' && colDef.render) {
          displayVal = colDef.render(row);
          html += '<td><div class="editable-cell readonly">' + displayVal + '</div></td>';
        } else if (colDef.type === 'badge' || (colDef.type === 'select' && colDef.badge)) {
          displayVal = renderBadgeValue(cellValue, colDef);
          html += '<td><div class="editable-cell" data-key="' + colDef.key + '" data-type="select" data-col-idx="' + c + '">' + displayVal + '</div></td>';
        } else {
          if (cellValue === null || cellValue === undefined) cellValue = '';
          if (colDef.type === 'number' && cellValue !== '') {
            displayVal = formatNumber(cellValue);
          } else if (colDef.type === 'select') {
            displayVal = getLabelForValue(cellValue, colDef.options);
          } else {
            displayVal = App.escapeHtml(String(cellValue));
          }
          html += '<td><div class="editable-cell" data-key="' + colDef.key + '" data-type="' + (colDef.type || 'text') + '" data-col-idx="' + c + '">' + displayVal + '</div></td>';
        }
      }

      if (onDelete) {
        html += '<td class="cell-actions"><button class="btn-delete-row" title="Supprimer">&#128465;</button></td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table>';

    wrap.innerHTML = html;
    container.innerHTML = '';
    container.appendChild(wrap);

    // Bind cell clicks for editing
    var cells = wrap.querySelectorAll('.editable-cell:not(.readonly)');
    for (var i = 0; i < cells.length; i++) {
      cells[i].addEventListener('click', (function(cellEl) {
        return function(e) {
          if (cellEl.classList.contains('editing')) return;
          startEdit(cellEl, columns, data, onSave, container, config);
        };
      })(cells[i]));
    }

    // Bind delete buttons
    if (onDelete) {
      var delBtns = wrap.querySelectorAll('.btn-delete-row');
      for (var d = 0; d < delBtns.length; d++) {
        delBtns[d].addEventListener('click', (function(rowData) {
          return function() {
            App.confirmDialog('Supprimer cet élément ?').then(function(ok) {
              if (!ok) return;
              onDelete(rowData.id).then(function() {
                render(container, Object.assign({}, config, {
                  data: config.data.filter(function(item) { return item.id !== rowData.id; })
                }));
              }).catch(function(err) {
                App.toast('Erreur: ' + err.message, 'error');
              });
            });
          };
        })(data[d]));
      }
    }

    // Bind sort headers
    var ths = wrap.querySelectorAll('th.sortable');
    for (var t = 0; t < ths.length; t++) {
      ths[t].addEventListener('click', (function(colIdx, cfg) {
        return function() {
          var newDir = (cfg.sortCol === colIdx && cfg.sortDir === 'asc') ? 'desc' : 'asc';
          cfg.sortCol = colIdx;
          cfg.sortDir = newDir;
          render(container, cfg);
        };
      })(parseInt(ths[t].getAttribute('data-col')), config));
    }
  }

  function startEdit(cellEl, columns, data, onSave, container, config) {
    var key = cellEl.getAttribute('data-key');
    var type = cellEl.getAttribute('data-type');
    var colIdx = parseInt(cellEl.getAttribute('data-col-idx'));
    var colDef = columns[colIdx];
    var tr = cellEl.closest('tr');
    var rowId = tr.getAttribute('data-id');
    var rowData = findRow(data, rowId);
    var originalValue = rowData ? rowData[key] : '';
    if (originalValue === null || originalValue === undefined) originalValue = '';

    cellEl.classList.add('editing');
    var inputEl;

    if (type === 'select') {
      inputEl = document.createElement('select');
      var options = colDef.options || [];
      for (var i = 0; i < options.length; i++) {
        var opt = document.createElement('option');
        var optVal = typeof options[i] === 'object' ? options[i].key : options[i];
        var optLabel = typeof options[i] === 'object' ? options[i].label : options[i];
        opt.value = optVal;
        opt.textContent = optLabel;
        if (String(optVal) === String(originalValue)) opt.selected = true;
        inputEl.appendChild(opt);
      }
    } else {
      inputEl = document.createElement('input');
      inputEl.type = type === 'number' ? 'number' : type === 'date' ? 'date' : 'text';
      inputEl.value = originalValue;
      if (type === 'number') {
        inputEl.step = 'any';
        inputEl.min = '0';
      }
      if (colDef.required) inputEl.required = true;
    }

    cellEl.innerHTML = '';
    cellEl.appendChild(inputEl);
    inputEl.focus();
    if (inputEl.select && type !== 'select' && type !== 'date') inputEl.select();

    function commitEdit() {
      var newValue = inputEl.value;
      if (type === 'number') {
        newValue = newValue === '' ? null : parseFloat(newValue);
      }

      // No change
      if (String(newValue || '') === String(originalValue || '')) {
        cancelEdit();
        return;
      }

      if (colDef.required && (newValue === '' || newValue === null)) {
        cellEl.classList.remove('editing');
        cellEl.classList.add('error');
        restoreDisplay(cellEl, originalValue, colDef);
        setTimeout(function() { cellEl.classList.remove('error'); }, 1000);
        return;
      }

      cellEl.classList.remove('editing');
      cellEl.classList.add('saving');
      restoreDisplay(cellEl, newValue, colDef);

      if (onSave) {
        onSave(rowId, key, newValue).then(function() {
          cellEl.classList.remove('saving');
          cellEl.classList.add('saved');
          // Update local data
          if (rowData) rowData[key] = newValue;
          setTimeout(function() { cellEl.classList.remove('saved'); }, 800);
        }).catch(function(err) {
          cellEl.classList.remove('saving');
          cellEl.classList.add('error');
          restoreDisplay(cellEl, originalValue, colDef);
          App.toast('Erreur: ' + err.message, 'error');
          setTimeout(function() { cellEl.classList.remove('error'); }, 1000);
        });
      }
    }

    function cancelEdit() {
      cellEl.classList.remove('editing');
      restoreDisplay(cellEl, originalValue, colDef);
    }

    // Event handlers
    inputEl.addEventListener('blur', function() {
      setTimeout(commitEdit, 50);
    });

    inputEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        inputEl.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        inputEl.removeEventListener('blur', arguments.callee);
        cancelEdit();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        inputEl.removeEventListener('blur', arguments.callee);
        commitEdit();
        // Move to next editable cell
        setTimeout(function() {
          var nextCell = findNextEditableCell(cellEl, e.shiftKey);
          if (nextCell) nextCell.click();
        }, 100);
      }
    });
  }

  function restoreDisplay(cellEl, value, colDef) {
    var displayVal = '';
    if (colDef.type === 'badge' || (colDef.type === 'select' && colDef.badge)) {
      displayVal = renderBadgeValue(value, colDef);
    } else if (colDef.type === 'number' && value !== '' && value !== null) {
      displayVal = formatNumber(value);
    } else if (colDef.type === 'select') {
      displayVal = getLabelForValue(value, colDef.options);
    } else {
      displayVal = App.escapeHtml(String(value || ''));
    }
    cellEl.innerHTML = displayVal;
  }

  function renderBadgeValue(value, colDef) {
    if (!value) return '';
    var label = getLabelForValue(value, colDef.options);
    var badgeClass = '';
    if (colDef.badgeClass) {
      badgeClass = colDef.badgeClass(value);
    } else {
      badgeClass = DataService.getStatusBadgeClass(value);
    }
    return '<span class="badge ' + badgeClass + '">' + App.escapeHtml(label) + '</span>';
  }

  function getLabelForValue(value, options) {
    if (!options) return String(value || '');
    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      if (typeof opt === 'object' && String(opt.key) === String(value)) return opt.label;
      if (typeof opt === 'string' && opt === value) return opt;
    }
    return String(value || '');
  }

  function formatNumber(val) {
    var n = parseFloat(val);
    if (isNaN(n)) return String(val);
    return n.toLocaleString('fr-FR');
  }

  function findRow(data, id) {
    for (var i = 0; i < data.length; i++) {
      if (String(data[i].id) === String(id)) return data[i];
    }
    return null;
  }

  function findNextEditableCell(currentCell, reverse) {
    var allCells = currentCell.closest('.editable-table-wrap')
      .querySelectorAll('.editable-cell:not(.readonly)');
    var arr = Array.prototype.slice.call(allCells);
    var idx = arr.indexOf(currentCell);
    if (idx === -1) return null;
    var nextIdx = reverse ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= arr.length) return null;
    return arr[nextIdx];
  }

  function sortData(data, col, dir) {
    var key = col.key;
    var sorted = data.slice();
    sorted.sort(function(a, b) {
      var va = a[key];
      var vb = b[key];
      if (va === null || va === undefined) va = '';
      if (vb === null || vb === undefined) vb = '';
      if (typeof va === 'number' && typeof vb === 'number') {
        return dir === 'asc' ? va - vb : vb - va;
      }
      va = String(va).toLowerCase();
      vb = String(vb).toLowerCase();
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }

  return {
    render: render
  };
})();
