/**
 * SubTracker - Composant upload de fichiers (dropzone drag-and-drop)
 */
var FileUploadComponent = (function() {
  'use strict';

  function render(container, opts) {
    opts = opts || {};
    var onUpload = opts.onUpload || function() {};
    var accept = opts.accept || '*';
    var maxSize = opts.maxSize || 10 * 1024 * 1024; // 10MB

    var html =
      '<div class="file-dropzone" id="fileDropzone">' +
        '<div class="file-dropzone-content">' +
          '<div class="file-dropzone-icon">&#128206;</div>' +
          '<div class="file-dropzone-text">Glissez un fichier ici ou <label for="fileInput" class="file-dropzone-link">parcourir</label></div>' +
          '<div class="file-dropzone-hint">Max ' + Math.round(maxSize / 1024 / 1024) + ' Mo</div>' +
        '</div>' +
        '<input type="file" id="fileInput" accept="' + accept + '" style="display:none">' +
      '</div>';

    container.innerHTML = html;

    var dropzone = container.querySelector('#fileDropzone');
    var fileInput = container.querySelector('#fileInput');

    dropzone.addEventListener('dragover', function(e) {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', function() {
      dropzone.classList.remove('dragover');
    });
    dropzone.addEventListener('drop', function(e) {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      var files = e.dataTransfer.files;
      if (files.length > 0) processFile(files[0], maxSize, onUpload);
    });
    fileInput.addEventListener('change', function() {
      if (this.files.length > 0) processFile(this.files[0], maxSize, onUpload);
      this.value = '';
    });
  }

  function processFile(file, maxSize, callback) {
    if (file.size > maxSize) {
      App.toast('Fichier trop volumineux (max ' + Math.round(maxSize / 1024 / 1024) + ' Mo)', 'error');
      return;
    }
    callback(file);
  }

  return {
    render: render
  };
})();
