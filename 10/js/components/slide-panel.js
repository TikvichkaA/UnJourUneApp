/**
 * SubTracker - Panneau latéral glissant réutilisable
 */
var SlidePanel = (function() {
  'use strict';

  var panelEl = null;
  var overlayEl = null;
  var contentEl = null;
  var isOpen = false;

  function init() {
    panelEl = document.getElementById('slidePanel');
    overlayEl = document.getElementById('slidePanelOverlay');
    contentEl = document.getElementById('slidePanelContent');

    if (overlayEl) {
      overlayEl.addEventListener('click', close);
    }
  }

  function open(html) {
    if (!panelEl) init();
    contentEl.innerHTML = html;
    panelEl.classList.add('open');
    overlayEl.classList.add('visible');
    isOpen = true;
  }

  function close() {
    if (!panelEl) return;
    panelEl.classList.remove('open');
    overlayEl.classList.remove('visible');
    isOpen = false;
    setTimeout(function() {
      if (!isOpen) contentEl.innerHTML = '';
    }, 300);
  }

  function getContentEl() {
    if (!contentEl) init();
    return contentEl;
  }

  function isVisible() {
    return isOpen;
  }

  // Auto-init
  document.addEventListener('DOMContentLoaded', init);

  return {
    open: open,
    close: close,
    getContentEl: getContentEl,
    isVisible: isVisible
  };
})();
