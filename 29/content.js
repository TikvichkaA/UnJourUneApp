/**
 * Traducteur Antifasciste - Content Script
 * Détecte et annote les expressions euphémisantes dans les pages web
 */

(function() {
  'use strict';

  // État de l'extension
  let isEnabled = true;
  let processedNodes = new WeakSet();
  let tooltipElement = null;

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

    // Positionner le tooltip
    const tooltipRect = tooltipElement.getBoundingClientRect();
    let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top + window.scrollY - tooltipRect.height - 8;

    // Ajuster si hors écran
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

  // Cacher le tooltip
  function hideTooltip() {
    if (tooltipElement) {
      tooltipElement.style.display = 'none';
    }
  }

  // Créer un élément d'annotation
  function createAnnotation(originalText, translation) {
    const wrapper = document.createElement('span');
    wrapper.className = 'trad-antifa-wrapper';
    wrapper.setAttribute('data-original', originalText);
    wrapper.setAttribute('data-translation', translation.translation);
    wrapper.setAttribute('data-category', translation.category);

    const mark = document.createElement('mark');
    mark.className = 'trad-antifa-mark';
    mark.textContent = originalText;

    wrapper.appendChild(mark);

    // Événements pour le tooltip
    wrapper.addEventListener('mouseenter', () => {
      showTooltip(wrapper, translation);
    });

    wrapper.addEventListener('mouseleave', hideTooltip);

    wrapper.addEventListener('focus', () => {
      showTooltip(wrapper, translation);
    });

    wrapper.addEventListener('blur', hideTooltip);

    // Rendre focusable pour accessibilité
    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('role', 'button');
    wrapper.setAttribute('aria-label', `${originalText}: ${translation.translation}`);

    return wrapper;
  }

  // Traiter un noeud texte
  function processTextNode(textNode) {
    if (!isEnabled) return;
    if (processedNodes.has(textNode)) return;

    const text = textNode.textContent;
    if (!detectionRegex.test(text)) return;

    // Réinitialiser le regex
    detectionRegex.lastIndex = 0;

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    while ((match = detectionRegex.exec(text)) !== null) {
      const matchedText = match[0];
      const translation = findTranslation(matchedText);

      if (!translation) continue;

      // Texte avant le match
      if (match.index > lastIndex) {
        fragment.appendChild(
          document.createTextNode(text.slice(lastIndex, match.index))
        );
      }

      // L'annotation
      fragment.appendChild(createAnnotation(matchedText, translation));

      lastIndex = match.index + matchedText.length;
    }

    // Texte restant
    if (lastIndex < text.length) {
      fragment.appendChild(
        document.createTextNode(text.slice(lastIndex))
      );
    }

    // Remplacer le noeud texte si on a trouvé des matches
    if (lastIndex > 0) {
      processedNodes.add(textNode);
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  }

  // Parcourir le DOM
  function walkDOM(node) {
    if (!isEnabled) return;

    // Ignorer certains éléments
    const ignoredTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'TEXTAREA', 'INPUT', 'CODE', 'PRE'];
    if (ignoredTags.includes(node.nodeName)) return;

    // Ignorer les éléments déjà traités par l'extension
    if (node.classList && node.classList.contains('trad-antifa-wrapper')) return;
    if (node.classList && node.classList.contains('trad-antifa-tooltip')) return;

    // Traiter les noeuds texte
    if (node.nodeType === Node.TEXT_NODE) {
      processTextNode(node);
      return;
    }

    // Parcourir les enfants
    const children = Array.from(node.childNodes);
    for (const child of children) {
      walkDOM(child);
    }
  }

  // Observer les mutations du DOM
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

  // Supprimer toutes les annotations
  function removeAllAnnotations() {
    const annotations = document.querySelectorAll('.trad-antifa-wrapper');
    annotations.forEach(wrapper => {
      const originalText = wrapper.getAttribute('data-original');
      const textNode = document.createTextNode(originalText);
      wrapper.parentNode.replaceChild(textNode, wrapper);
    });

    // Supprimer le tooltip
    if (tooltipElement) {
      tooltipElement.remove();
      tooltipElement = null;
    }

    // Réinitialiser les noeuds traités
    processedNodes = new WeakSet();
  }

  // Retraiter la page
  function reprocessPage() {
    processedNodes = new WeakSet();
    walkDOM(document.body);
  }

  // Initialisation
  function init() {
    // Charger l'état depuis le storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['enabled'], (result) => {
        isEnabled = result.enabled !== false;
        if (isEnabled) {
          createTooltip();
          walkDOM(document.body);
          setupObserver();
        }
      });

      // Écouter les changements de configuration
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
      // Mode sans storage (pour tests)
      createTooltip();
      walkDOM(document.body);
      setupObserver();
    }
  }

  // Écouter les messages du popup
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'getCount') {
        const count = document.querySelectorAll('.trad-antifa-wrapper').length;
        sendResponse({ count: count });
      }
      return true;
    });
  }

  // Lancer quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
