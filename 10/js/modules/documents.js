/**
 * SubTracker - Module Documents (upload/gestion fichiers)
 */
var DocumentsModule = (function() {
  'use strict';

  async function renderDocumentsList(container, opts) {
    opts = opts || {};

    try {
      var docs = await DataService.getDocuments(opts);

      var html = '<div class="slide-panel-section">' +
        '<div class="slide-panel-section-title">Documents</div>';

      // Upload zone
      html += '<div id="docUploadZone" style="margin-bottom:1rem"></div>';

      // Category filter + list
      if (docs.length === 0) {
        html += '<p style="font-size:0.82rem;color:var(--text-muted)">Aucun document</p>';
      } else {
        html += '<div class="doc-list">';
        for (var i = 0; i < docs.length; i++) {
          var doc = docs[i];
          var catLabel = getCategoryLabel(doc.category);
          var size = doc.file_size ? formatFileSize(doc.file_size) : '';
          html += '<div class="doc-item">' +
            '<div class="doc-item-icon">&#128196;</div>' +
            '<div class="doc-item-info">' +
              '<div class="doc-item-name">' + App.escapeHtml(doc.name) + '</div>' +
              '<div class="doc-item-meta">' + catLabel + (size ? ' — ' + size : '') + '</div>' +
            '</div>' +
            '<div class="doc-item-actions">' +
              '<button class="btn btn-ghost btn-sm" data-download-doc="' + doc.id + '" data-path="' + App.escapeHtml(doc.file_path) + '" title="Télécharger">&#8595;</button>' +
              '<button class="btn btn-ghost btn-sm" data-delete-doc="' + doc.id + '" data-path="' + App.escapeHtml(doc.file_path) + '" title="Supprimer">&#10007;</button>' +
            '</div>' +
          '</div>';
        }
        html += '</div>';
      }

      html += '</div>';
      container.innerHTML = html;

      // Init dropzone
      var uploadZone = container.querySelector('#docUploadZone');
      FileUploadComponent.render(uploadZone, {
        onUpload: function(file) {
          handleUpload(file, opts, container);
        }
      });

      // Bind download
      var dlBtns = container.querySelectorAll('[data-download-doc]');
      for (var d = 0; d < dlBtns.length; d++) {
        dlBtns[d].addEventListener('click', function() {
          var path = this.getAttribute('data-path');
          handleDownload(path);
        });
      }

      // Bind delete
      var delBtns = container.querySelectorAll('[data-delete-doc]');
      for (var x = 0; x < delBtns.length; x++) {
        delBtns[x].addEventListener('click', (function(docId, path) {
          return async function() {
            var ok = await App.confirmDialog('Supprimer ce document ?');
            if (!ok) return;
            try {
              await StorageService.remove(path);
              await DataService.deleteDocument(docId);
              App.toast('Document supprimé', 'success');
              renderDocumentsList(container, opts);
            } catch (err) {
              App.toast('Erreur: ' + err.message, 'error');
            }
          };
        })(delBtns[x].getAttribute('data-delete-doc'), delBtns[x].getAttribute('data-path')));
      }
    } catch (err) {
      container.innerHTML = '<p style="color:var(--color-red)">Erreur de chargement des documents</p>';
    }
  }

  async function handleUpload(file, opts, container) {
    // Ask for category
    var catOptions = '';
    for (var i = 0; i < DataService.DOCUMENT_CATEGORIES.length; i++) {
      var cat = DataService.DOCUMENT_CATEGORIES[i];
      catOptions += '<option value="' + cat.key + '">' + cat.label + '</option>';
    }

    var html =
      '<div class="modal-header">' +
        '<h3 class="modal-title">Ajouter un document</h3>' +
        '<button class="modal-close" onclick="App.hideModal()">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<p style="font-size:0.85rem;margin-bottom:1rem">Fichier : <strong>' + App.escapeHtml(file.name) + '</strong> (' + formatFileSize(file.size) + ')</p>' +
        '<div class="form-group"><label class="form-label">Catégorie</label><select class="form-select" id="docCategory">' + catOptions + '</select></div>' +
        '<button class="btn btn-primary" style="width:100%" id="docUploadConfirm">Envoyer</button>' +
      '</div>';

    App.showModal(html, { maxWidth: '400px' });

    document.getElementById('docUploadConfirm').addEventListener('click', async function() {
      var category = document.getElementById('docCategory').value;
      this.disabled = true;
      this.textContent = 'Envoi en cours...';

      try {
        var subPath = opts.financement_id ? 'financements/' + opts.financement_id :
                      opts.project_id ? 'projects/' + opts.project_id : 'general';
        var result = await StorageService.upload(file, subPath);

        await DataService.createDocument({
          name: file.name,
          file_path: result.path,
          file_size: file.size,
          mime_type: file.type,
          category: category,
          financement_id: opts.financement_id || null,
          project_id: opts.project_id || null
        });

        App.toast('Document ajouté', 'success');
        App.hideModal();
        renderDocumentsList(container, opts);
      } catch (err) {
        App.toast('Erreur upload: ' + err.message, 'error');
        this.disabled = false;
        this.textContent = 'Envoyer';
      }
    });
  }

  async function handleDownload(path) {
    try {
      var url = await StorageService.getSignedUrl(path);
      window.open(url, '_blank');
    } catch (err) {
      App.toast('Erreur téléchargement: ' + err.message, 'error');
    }
  }

  function getCategoryLabel(key) {
    for (var i = 0; i < DataService.DOCUMENT_CATEGORIES.length; i++) {
      if (DataService.DOCUMENT_CATEGORIES[i].key === key) return DataService.DOCUMENT_CATEGORIES[i].label;
    }
    return 'Autre';
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
  }

  return {
    renderDocumentsList: renderDocumentsList
  };
})();
