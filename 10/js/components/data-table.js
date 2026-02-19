/**
 * SubTracker - Table de données triable/filtrable
 */
var DataTable = (function() {
  'use strict';

  function render(container, config) {
    var columns = config.columns || [];
    var data = config.data || [];
    var onRowClick = config.onRowClick || null;
    var emptyText = config.emptyText || 'Aucune donnée';
    var sortCol = config.sortCol || null;
    var sortDir = config.sortDir || 'asc';

    if (sortCol !== null) {
      data = sortData(data, columns[sortCol], sortDir);
    }

    var table = document.createElement('div');
    table.className = 'data-table-wrap';

    if (data.length === 0) {
      table.innerHTML =
        '<div class="empty-state" style="padding:2rem">' +
          '<div class="empty-state-text">' + App.escapeHtml(emptyText) + '</div>' +
        '</div>';
      container.innerHTML = '';
      container.appendChild(table);
      return;
    }

    var html = '<table class="data-table"><thead><tr>';
    for (var h = 0; h < columns.length; h++) {
      var col = columns[h];
      var sortIcon = '';
      if (h === sortCol) {
        sortIcon = sortDir === 'asc' ? ' &#9650;' : ' &#9660;';
      }
      var sortable = col.sortable !== false ? ' data-table-sortable' : '';
      html += '<th class="data-table-th' + sortable + '" data-col="' + h + '">' +
              App.escapeHtml(col.label) + sortIcon + '</th>';
    }
    html += '</tr></thead><tbody>';

    for (var r = 0; r < data.length; r++) {
      var row = data[r];
      var clickable = onRowClick ? ' class="data-table-row-clickable"' : '';
      html += '<tr' + clickable + ' data-id="' + (row.id || r) + '">';
      for (var c = 0; c < columns.length; c++) {
        var cellFn = columns[c].render;
        var cellVal = cellFn ? cellFn(row) : (row[columns[c].key] || '');
        html += '<td class="data-table-td">' + cellVal + '</td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table>';

    table.innerHTML = html;
    container.innerHTML = '';
    container.appendChild(table);

    // Bind row clicks
    if (onRowClick) {
      var rows = table.querySelectorAll('.data-table-row-clickable');
      for (var i = 0; i < rows.length; i++) {
        rows[i].addEventListener('click', (function(rowData) {
          return function() { onRowClick(rowData); };
        })(data[i]));
      }
    }

    // Bind sort
    var ths = table.querySelectorAll('[data-table-sortable]');
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
