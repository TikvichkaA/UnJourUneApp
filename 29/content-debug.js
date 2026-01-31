/**
 * Traducteur Antifasciste - Content Script (VERSION DEBUG)
 * Affiche un panneau avec toutes les détections
 */

(function() {
  'use strict';

  // État de l'extension
  let isEnabled = true;
  let processedNodes = new WeakSet();
  let tooltipElement = null;
  let debugPanel = null;
  let detectionLog = [];

  // Créer le regex de détection à partir du dictionnaire
  function buildRegex() {
    const patterns = TRANSLATIONS.map(t =>
      t.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    return new RegExp(`\\b(${patterns.join('|')})\\b`, 'gi');
  }

  const detectionRegex = buildRegex();

  // Trouver la traduction correspondante
  function findTranslation(text) {
    const lowerText = text.toLowerCase();
    return TRANSLATIONS.find(t => t.original.toLowerCase() === lowerText);
  }

  // ==================== DEBUG PANEL ====================

  function createDebugPanel() {
    if (debugPanel) return;

    debugPanel = document.createElement('div');
    debugPanel.id = 'trad-antifa-debug';
    debugPanel.innerHTML = `
      <div class="debug-header">
        <span class="debug-title">DEBUG - Traducteur Antifasciste</span>
        <div class="debug-controls">
          <button class="debug-btn" id="debug-toggle-panel">_</button>
          <button class="debug-btn" id="debug-close">X</button>
        </div>
      </div>
      <div class="debug-content">
        <div class="debug-tabs">
          <button class="debug-tab active" data-tab="detections">Détections</button>
          <button class="debug-tab" data-tab="dictionary">Dictionnaire</button>
          <button class="debug-tab" data-tab="regex">Regex</button>
        </div>
        <div class="debug-tab-content active" id="debug-detections">
          <div class="debug-stats">
            <span id="debug-count">0</span> expressions détectées
          </div>
          <div class="debug-list" id="debug-detection-list"></div>
        </div>
        <div class="debug-tab-content" id="debug-dictionary">
          <div class="debug-stats">
            ${TRANSLATIONS.length} expressions dans le dictionnaire
          </div>
          <div class="debug-search">
            <input type="text" id="debug-search-input" placeholder="Rechercher...">
          </div>
          <div class="debug-list" id="debug-dict-list"></div>
        </div>
        <div class="debug-tab-content" id="debug-regex">
          <div class="debug-regex-display">
            <code>${detectionRegex.toString().slice(0, 500)}...</code>
          </div>
        </div>
      </div>
    `;

    // Styles du panneau debug
    const style = document.createElement('style');
    style.textContent = `
      #trad-antifa-debug {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 420px;
        max-height: 500px;
        background: #1a1a1a;
        border: 2px solid #dc2626;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
        font-size: 12px;
        color: #fff;
        z-index: 2147483647;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        display: flex;
        flex-direction: column;
      }
      #trad-antifa-debug.minimized .debug-content {
        display: none;
      }
      #trad-antifa-debug.minimized {
        max-height: auto;
      }
      .debug-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        background: #dc2626;
        border-radius: 6px 6px 0 0;
        cursor: move;
      }
      .debug-title {
        font-weight: 700;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .debug-controls {
        display: flex;
        gap: 6px;
      }
      .debug-btn {
        width: 20px;
        height: 20px;
        border: none;
        background: rgba(255,255,255,0.2);
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        line-height: 1;
      }
      .debug-btn:hover {
        background: rgba(255,255,255,0.3);
      }
      .debug-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .debug-tabs {
        display: flex;
        border-bottom: 1px solid #333;
      }
      .debug-tab {
        flex: 1;
        padding: 8px;
        border: none;
        background: transparent;
        color: #888;
        cursor: pointer;
        font-size: 11px;
        transition: all 0.2s;
      }
      .debug-tab:hover {
        color: #fff;
        background: #2a2a2a;
      }
      .debug-tab.active {
        color: #dc2626;
        border-bottom: 2px solid #dc2626;
      }
      .debug-tab-content {
        display: none;
        flex: 1;
        overflow: hidden;
        flex-direction: column;
      }
      .debug-tab-content.active {
        display: flex;
      }
      .debug-stats {
        padding: 10px 12px;
        background: #2a2a2a;
        font-weight: 600;
        color: #dc2626;
      }
      .debug-stats #debug-count {
        font-size: 16px;
      }
      .debug-search {
        padding: 8px;
        background: #222;
      }
      .debug-search input {
        width: 100%;
        padding: 8px;
        border: 1px solid #444;
        background: #1a1a1a;
        color: #fff;
        border-radius: 4px;
        font-size: 12px;
      }
      .debug-list {
        flex: 1;
        overflow-y: auto;
        max-height: 300px;
      }
      .debug-item {
        padding: 10px 12px;
        border-bottom: 1px solid #2a2a2a;
        transition: background 0.2s;
      }
      .debug-item:hover {
        background: #2a2a2a;
      }
      .debug-item-original {
        color: #fff;
        font-weight: 600;
        margin-bottom: 4px;
      }
      .debug-item-translation {
        color: #dc2626;
        font-size: 11px;
      }
      .debug-item-meta {
        color: #666;
        font-size: 10px;
        margin-top: 4px;
      }
      .debug-item-context {
        color: #888;
        font-size: 10px;
        margin-top: 4px;
        padding: 4px 6px;
        background: #222;
        border-radius: 3px;
        max-height: 40px;
        overflow: hidden;
      }
      .debug-item-count {
        display: inline-block;
        background: #dc2626;
        color: #fff;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 10px;
        margin-left: 8px;
      }
      .debug-regex-display {
        padding: 12px;
        overflow: auto;
        max-height: 350px;
      }
      .debug-regex-display code {
        color: #888;
        word-break: break-all;
        font-size: 10px;
      }
      .debug-highlight {
        animation: debug-flash 0.5s ease;
      }
      @keyframes debug-flash {
        0%, 100% { background: transparent; }
        50% { background: rgba(220, 38, 38, 0.3); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(debugPanel);

    // Event listeners
    setupDebugEvents();
    populateDictionary();
  }

  function setupDebugEvents() {
    // Tabs
    debugPanel.querySelectorAll('.debug-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        debugPanel.querySelectorAll('.debug-tab').forEach(t => t.classList.remove('active'));
        debugPanel.querySelectorAll('.debug-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('debug-' + tab.dataset.tab).classList.add('active');
      });
    });

    // Toggle minimize
    document.getElementById('debug-toggle-panel').addEventListener('click', () => {
      debugPanel.classList.toggle('minimized');
    });

    // Close
    document.getElementById('debug-close').addEventListener('click', () => {
      debugPanel.style.display = 'none';
    });

    // Search
    document.getElementById('debug-search-input').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      filterDictionary(query);
    });

    // Make draggable
    let isDragging = false;
    let offsetX, offsetY;
    const header = debugPanel.querySelector('.debug-header');

    header.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('debug-btn')) return;
      isDragging = true;
      offsetX = e.clientX - debugPanel.offsetLeft;
      offsetY = e.clientY - debugPanel.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      debugPanel.style.left = (e.clientX - offsetX) + 'px';
      debugPanel.style.top = (e.clientY - offsetY) + 'px';
      debugPanel.style.right = 'auto';
      debugPanel.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  function populateDictionary() {
    const list = document.getElementById('debug-dict-list');
    list.innerHTML = TRANSLATIONS.map((t, i) => `
      <div class="debug-item" data-index="${i}">
        <div class="debug-item-original">${t.original}</div>
        <div class="debug-item-translation">${t.translation}</div>
        <div class="debug-item-meta">Catégorie: ${t.category}</div>
      </div>
    `).join('');
  }

  function filterDictionary(query) {
    const items = document.querySelectorAll('#debug-dict-list .debug-item');
    items.forEach((item, i) => {
      const t = TRANSLATIONS[i];
      const matches = t.original.toLowerCase().includes(query) ||
                      t.translation.toLowerCase().includes(query) ||
                      t.category.toLowerCase().includes(query);
      item.style.display = matches ? 'block' : 'none';
    });
  }

  function logDetection(originalText, translation, context) {
    const entry = {
      original: originalText,
      translation: translation.translation,
      category: translation.category,
      context: context.slice(0, 100),
      timestamp: Date.now()
    };

    detectionLog.push(entry);
    updateDetectionList();

    // Console log
    console.log(
      '%c[TraductoFash] %cDétecté: %c' + originalText + '%c → %c' + translation.translation,
      'color: #dc2626; font-weight: bold',
      'color: #888',
      'color: #fff; font-weight: bold',
      'color: #888',
      'color: #dc2626'
    );
  }

  function updateDetectionList() {
    const list = document.getElementById('debug-detection-list');
    const count = document.getElementById('debug-count');

    if (!list || !count) return;

    // Grouper par expression
    const grouped = {};
    detectionLog.forEach(entry => {
      const key = entry.original.toLowerCase();
      if (!grouped[key]) {
        grouped[key] = { ...entry, count: 0, contexts: [] };
      }
      grouped[key].count++;
      if (grouped[key].contexts.length < 3) {
        grouped[key].contexts.push(entry.context);
      }
    });

    const sorted = Object.values(grouped).sort((a, b) => b.count - a.count);

    count.textContent = detectionLog.length;

    list.innerHTML = sorted.map(item => `
      <div class="debug-item debug-highlight">
        <div class="debug-item-original">
          ${item.original}
          <span class="debug-item-count">${item.count}x</span>
        </div>
        <div class="debug-item-translation">${item.translation}</div>
        <div class="debug-item-context">"...${item.contexts[0]}..."</div>
      </div>
    `).join('');
  }

  // ==================== FIN DEBUG PANEL ====================

  // Créer l'élément tooltip
  function createTooltip() {
    if (tooltipElement) return;

    tooltipElement = document.createElement('div');
    tooltipElement.className = 'trad-antifa-tooltip';
    tooltipElement.setAttribute('role', 'tooltip');
    tooltipElement.innerHTML = `
      <div class="trad-antifa-tooltip-header">Traduction politique explicite</div>
      <div class="trad-antifa-tooltip-content"></div>
      <div class="trad-antifa-tooltip-original"></div>
    `;
    document.body.appendChild(tooltipElement);
  }

  // Afficher le tooltip
  function showTooltip(element, translation) {
    if (!tooltipElement) createTooltip();

    const rect = element.getBoundingClientRect();
    const content = tooltipElement.querySelector('.trad-antifa-tooltip-content');
    const original = tooltipElement.querySelector('.trad-antifa-tooltip-original');

    content.textContent = translation.translation;
    original.textContent = `"${translation.original}"`;

    tooltipElement.style.display = 'block';

    const tooltipRect = tooltipElement.getBoundingClientRect();
    let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top + window.scrollY - tooltipRect.height - 8;

    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < window.scrollY + 10) {
      top = rect.bottom + window.scrollY + 8;
    }

    tooltipElement.style.left = `${left}px`;
    tooltipElement.style.top = `${top}px`;
  }

  function hideTooltip() {
    if (tooltipElement) {
      tooltipElement.style.display = 'none';
    }
  }

  function createAnnotation(originalText, translation, context) {
    // LOG DEBUG
    logDetection(originalText, translation, context);

    const wrapper = document.createElement('span');
    wrapper.className = 'trad-antifa-wrapper';
    wrapper.setAttribute('data-original', originalText);
    wrapper.setAttribute('data-translation', translation.translation);
    wrapper.setAttribute('data-category', translation.category);

    const mark = document.createElement('mark');
    mark.className = 'trad-antifa-mark';
    mark.textContent = originalText;

    wrapper.appendChild(mark);

    wrapper.addEventListener('mouseenter', () => {
      showTooltip(wrapper, translation);
    });
    wrapper.addEventListener('mouseleave', hideTooltip);
    wrapper.addEventListener('focus', () => {
      showTooltip(wrapper, translation);
    });
    wrapper.addEventListener('blur', hideTooltip);

    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('role', 'button');
    wrapper.setAttribute('aria-label', `${originalText}: ${translation.translation}`);

    return wrapper;
  }

  function processTextNode(textNode) {
    if (!isEnabled) return;
    if (processedNodes.has(textNode)) return;

    const text = textNode.textContent;
    if (!detectionRegex.test(text)) return;

    detectionRegex.lastIndex = 0;

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    while ((match = detectionRegex.exec(text)) !== null) {
      const matchedText = match[0];
      const translation = findTranslation(matchedText);

      if (!translation) continue;

      if (match.index > lastIndex) {
        fragment.appendChild(
          document.createTextNode(text.slice(lastIndex, match.index))
        );
      }

      // Passer le contexte pour le debug
      const contextStart = Math.max(0, match.index - 30);
      const contextEnd = Math.min(text.length, match.index + matchedText.length + 30);
      const context = text.slice(contextStart, contextEnd);

      fragment.appendChild(createAnnotation(matchedText, translation, context));

      lastIndex = match.index + matchedText.length;
    }

    if (lastIndex < text.length) {
      fragment.appendChild(
        document.createTextNode(text.slice(lastIndex))
      );
    }

    if (lastIndex > 0) {
      processedNodes.add(textNode);
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  }

  function walkDOM(node) {
    if (!isEnabled) return;

    const ignoredTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'TEXTAREA', 'INPUT', 'CODE', 'PRE'];
    if (ignoredTags.includes(node.nodeName)) return;

    if (node.classList && node.classList.contains('trad-antifa-wrapper')) return;
    if (node.classList && node.classList.contains('trad-antifa-tooltip')) return;
    if (node.id === 'trad-antifa-debug') return;

    if (node.nodeType === Node.TEXT_NODE) {
      processTextNode(node);
      return;
    }

    const children = Array.from(node.childNodes);
    for (const child of children) {
      walkDOM(child);
    }
  }

  function setupObserver() {
    const observer = new MutationObserver((mutations) => {
      if (!isEnabled) return;

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            walkDOM(node);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return observer;
  }

  function removeAllAnnotations() {
    const annotations = document.querySelectorAll('.trad-antifa-wrapper');
    annotations.forEach(wrapper => {
      const originalText = wrapper.getAttribute('data-original');
      const textNode = document.createTextNode(originalText);
      wrapper.parentNode.replaceChild(textNode, wrapper);
    });

    if (tooltipElement) {
      tooltipElement.remove();
      tooltipElement = null;
    }

    processedNodes = new WeakSet();
    detectionLog = [];
    updateDetectionList();
  }

  function reprocessPage() {
    processedNodes = new WeakSet();
    detectionLog = [];
    walkDOM(document.body);
  }

  function init() {
    console.log('%c[TraductoFash DEBUG] Initialisation...', 'color: #dc2626; font-weight: bold');
    console.log('%c[TraductoFash DEBUG] ' + TRANSLATIONS.length + ' expressions dans le dictionnaire', 'color: #888');

    // Créer le panneau debug
    createDebugPanel();

    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['enabled'], (result) => {
        isEnabled = result.enabled !== false;
        if (isEnabled) {
          createTooltip();
          walkDOM(document.body);
          setupObserver();
        }
      });

      chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync' && changes.enabled) {
          isEnabled = changes.enabled.newValue;
          if (isEnabled) {
            createTooltip();
            reprocessPage();
          } else {
            removeAllAnnotations();
          }
        }
      });
    } else {
      createTooltip();
      walkDOM(document.body);
      setupObserver();
    }
  }

  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'getCount') {
        const count = document.querySelectorAll('.trad-antifa-wrapper').length;
        sendResponse({ count: count });
      }
      return true;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
