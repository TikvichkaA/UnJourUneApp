/**
 * SubTracker - Composant Kanban (drag-and-drop HTML5)
 */
var KanbanComponent = (function() {
  'use strict';

  var draggedItem = null;
  var draggedId = null;

  function render(container, columns, items, opts) {
    opts = opts || {};
    var onStatusChange = opts.onStatusChange || function() {};
    var onItemClick = opts.onItemClick || function() {};
    var renderCard = opts.renderCard || defaultRenderCard;

    var board = document.createElement('div');
    board.className = 'kanban-board';

    for (var c = 0; c < columns.length; c++) {
      var col = columns[c];
      var colItems = filterItems(items, col.key);

      var colEl = document.createElement('div');
      colEl.className = 'kanban-column';
      colEl.setAttribute('data-status', col.key);

      var headerEl = document.createElement('div');
      headerEl.className = 'kanban-column-header';
      headerEl.innerHTML =
        '<span class="kanban-column-title">' +
          '<span class="badge ' + (col.badge || '') + '">' + App.escapeHtml(col.label) + '</span>' +
        '</span>' +
        '<span class="kanban-column-count">' + colItems.length + '</span>';
      colEl.appendChild(headerEl);

      var listEl = document.createElement('div');
      listEl.className = 'kanban-list';
      listEl.setAttribute('data-status', col.key);

      // Drop zone events
      listEl.addEventListener('dragover', handleDragOver);
      listEl.addEventListener('dragenter', handleDragEnter);
      listEl.addEventListener('dragleave', handleDragLeave);
      listEl.addEventListener('drop', (function(status, cb) {
        return function(e) { handleDrop(e, status, cb); };
      })(col.key, onStatusChange));

      for (var i = 0; i < colItems.length; i++) {
        var item = colItems[i];
        var cardEl = document.createElement('div');
        cardEl.className = 'kanban-card';
        cardEl.setAttribute('draggable', 'true');
        cardEl.setAttribute('data-id', item.id);
        cardEl.innerHTML = renderCard(item);

        cardEl.addEventListener('dragstart', handleDragStart);
        cardEl.addEventListener('dragend', handleDragEnd);
        cardEl.addEventListener('click', (function(it, cb) {
          return function() { cb(it); };
        })(item, onItemClick));

        listEl.appendChild(cardEl);
      }

      colEl.appendChild(listEl);
      board.appendChild(colEl);
    }

    container.innerHTML = '';
    container.appendChild(board);
  }

  function filterItems(items, status) {
    var result = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].status === status) result.push(items[i]);
    }
    return result;
  }

  function defaultRenderCard(item) {
    var amount = CurrencyUtils.formatCompact(item.amount_requested);
    var financeur = (item.financeurs && item.financeurs.name) || item.financeur || '';
    return '<div class="kanban-card-title">' + App.escapeHtml(item.name) + '</div>' +
           '<div class="kanban-card-meta">' +
             (financeur ? '<span>' + App.escapeHtml(financeur) + '</span>' : '') +
             '<span>' + amount + '</span>' +
           '</div>';
  }

  function handleDragStart(e) {
    draggedItem = this;
    draggedId = this.getAttribute('data-id');
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedId);
  }

  function handleDragEnd() {
    this.classList.remove('dragging');
    draggedItem = null;
    draggedId = null;
    var cols = document.querySelectorAll('.kanban-list');
    for (var i = 0; i < cols.length; i++) {
      cols[i].classList.remove('drag-over');
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
  }

  function handleDragLeave() {
    this.classList.remove('drag-over');
  }

  function handleDrop(e, newStatus, callback) {
    e.preventDefault();
    this.classList.remove('drag-over');
    var id = e.dataTransfer.getData('text/plain');
    if (id && callback) {
      callback(id, newStatus);
    }
  }

  return {
    render: render
  };
})();
