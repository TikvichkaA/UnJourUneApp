/**
 * SubTracker - Export CSV
 */
var CSVExport = (function() {
  'use strict';

  function exportData(rows, columns, filename) {
    filename = filename || 'export.csv';

    var headerLine = columns.map(function(c) { return '"' + c.label.replace(/"/g, '""') + '"'; }).join(';');
    var lines = [headerLine];

    for (var i = 0; i < rows.length; i++) {
      var vals = [];
      for (var j = 0; j < columns.length; j++) {
        var val = columns[j].value ? columns[j].value(rows[i]) : (rows[i][columns[j].key] || '');
        vals.push('"' + String(val).replace(/"/g, '""') + '"');
      }
      lines.push(vals.join(';'));
    }

    var csvContent = '\uFEFF' + lines.join('\r\n'); // BOM for Excel FR
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return {
    exportData: exportData
  };
})();
