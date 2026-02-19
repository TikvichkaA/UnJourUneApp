/**
 * SubTracker - Export PDF (jsPDF)
 */
var PDFExport = (function() {
  'use strict';

  function createDoc(title) {
    var jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
    var doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setTextColor(5, 150, 105);
    doc.text('SubTracker', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text(title, 14, 30);

    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text('Généré le ' + new Date().toLocaleDateString('fr-FR'), 14, 36);

    doc.setDrawColor(229, 231, 235);
    doc.line(14, 38, 196, 38);

    return doc;
  }

  function addTable(doc, columns, rows, startY) {
    startY = startY || 44;
    doc.autoTable({
      head: [columns.map(function(c) { return c.label; })],
      body: rows.map(function(row) {
        return columns.map(function(c) {
          return c.value ? c.value(row) : (row[c.key] || '');
        });
      }),
      startY: startY,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249, 250, 251] }
    });
    return doc.lastAutoTable.finalY + 10;
  }

  function addKPIs(doc, kpis, startY) {
    startY = startY || 44;
    var x = 14;
    doc.setFontSize(9);
    for (var i = 0; i < kpis.length; i++) {
      doc.setTextColor(156, 163, 175);
      doc.text(kpis[i].label, x, startY);
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(14);
      doc.text(kpis[i].value, x, startY + 7);
      doc.setFontSize(9);
      x += 46;
      if (x > 180 && i < kpis.length - 1) {
        x = 14;
        startY += 18;
      }
    }
    return startY + 18;
  }

  function save(doc, filename) {
    doc.save(filename || 'subtracker-rapport.pdf');
  }

  return {
    createDoc: createDoc,
    addTable: addTable,
    addKPIs: addKPIs,
    save: save
  };
})();
