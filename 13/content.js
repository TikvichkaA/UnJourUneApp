// SecondMain - Content Script
// Détecte les informations produit sur les sites de distributeurs

(function() {
  'use strict';

  // Sélecteurs pour différents sites
  const SITE_SELECTORS = {
    'leroymerlin.fr': {
      name: [
        'h1.product-title',
        '[data-testid="product-title"]',
        '.pdp-title h1',
        'h1[itemprop="name"]'
      ],
      price: [
        '[data-testid="product-price"]',
        '.product-price .price',
        '.pdp-price',
        '[itemprop="price"]'
      ]
    },
    'castorama.fr': {
      name: [
        'h1.product-title',
        '.product-detail h1',
        '[data-testid="product-name"]'
      ],
      price: [
        '.product-price',
        '[data-testid="product-price"]',
        '.price-value'
      ]
    },
    'ikea.com': {
      name: [
        '.pip-header-section h1',
        '[data-testid="product-name"]',
        '.product-name'
      ],
      price: [
        '.pip-temp-price__integer',
        '[data-testid="product-price"]',
        '.product-price'
      ]
    },
    'amazon.fr': {
      name: [
        '#productTitle',
        '#title',
        'h1.product-title-word-break'
      ],
      price: [
        '.a-price .a-offscreen',
        '#priceblock_ourprice',
        '#priceblock_dealprice',
        '.a-price-whole'
      ]
    },
    'cdiscount.com': {
      name: [
        'h1.fpTName',
        '.fpDesCol h1',
        '[itemprop="name"]'
      ],
      price: [
        '.fpPrice',
        '.fpMPrice',
        '[itemprop="price"]'
      ]
    },
    'fnac.com': {
      name: [
        'h1.f-productHeader-Title',
        '.product-title h1',
        '[data-testid="product-title"]'
      ],
      price: [
        '.f-productHeader-Price',
        '.userPrice .f-priceBox-price',
        '.product-price'
      ]
    },
    'darty.com': {
      name: [
        'h1.product_title',
        '.product-title h1',
        '[itemprop="name"]'
      ],
      price: [
        '.product-price .price',
        '.darty_prix',
        '[itemprop="price"]'
      ]
    },
    'boulanger.com': {
      name: [
        'h1.product-title',
        '.product-name h1',
        '[itemprop="name"]'
      ],
      price: [
        '.product-price',
        '.price-value',
        '[itemprop="price"]'
      ]
    },
    'bricomarche.com': {
      name: [
        'h1.product-title',
        '.product-detail h1'
      ],
      price: [
        '.product-price',
        '.price'
      ]
    }
  };

  // Détecte le site actuel
  function getCurrentSite() {
    const hostname = window.location.hostname;
    for (const site of Object.keys(SITE_SELECTORS)) {
      if (hostname.includes(site)) {
        return site;
      }
    }
    return null;
  }

  // Trouve un élément avec plusieurs sélecteurs
  function findElement(selectors) {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
    }
    return null;
  }

  // Extrait le prix d'un texte
  function extractPrice(text) {
    if (!text) return null;
    // Nettoyer le texte et extraire le nombre
    const cleaned = text.replace(/[^\d,.\s]/g, '').trim();
    const match = cleaned.match(/(\d+(?:[.,]\d{1,2})?)/);
    if (match) {
      return parseFloat(match[1].replace(',', '.'));
    }
    return null;
  }

  // Nettoie le nom du produit
  function cleanProductName(text) {
    if (!text) return null;
    return text
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/g, '')
      .replace(/\n/g, ' ')
      .substring(0, 100); // Limiter la longueur
  }

  // Récupère les infos du produit
  function getProductInfo() {
    const site = getCurrentSite();

    if (!site) {
      // Essayer une détection générique
      return getGenericProductInfo();
    }

    const selectors = SITE_SELECTORS[site];
    const nameElement = findElement(selectors.name);
    const priceElement = findElement(selectors.price);

    const productName = cleanProductName(nameElement?.textContent);
    const price = extractPrice(priceElement?.textContent);

    return {
      productName: productName,
      price: price,
      site: site,
      url: window.location.href
    };
  }

  // Détection générique pour les sites non listés
  function getGenericProductInfo() {
    // Essayer des sélecteurs courants
    const genericNameSelectors = [
      'h1',
      '[itemprop="name"]',
      '.product-title',
      '.product-name',
      '#product-title'
    ];

    const genericPriceSelectors = [
      '[itemprop="price"]',
      '.product-price',
      '.price',
      '#price'
    ];

    const nameElement = findElement(genericNameSelectors);
    const priceElement = findElement(genericPriceSelectors);

    return {
      productName: cleanProductName(nameElement?.textContent),
      price: extractPrice(priceElement?.textContent),
      site: 'generic',
      url: window.location.href
    };
  }

  // Écouter les messages du popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getProductInfo') {
      const info = getProductInfo();
      sendResponse(info);
    }
    return true; // Indique qu'on va répondre de manière asynchrone
  });

  // Optionnel : Ajouter un bouton flottant pour rechercher rapidement
  function addFloatingButton() {
    const site = getCurrentSite();
    if (!site) return;

    const info = getProductInfo();
    if (!info.productName) return;

    const button = document.createElement('div');
    button.id = 'secondmain-fab';
    button.innerHTML = '♻️';
    button.title = 'Chercher en seconde main avec SecondMain';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
      z-index: 999999;
      transition: transform 0.2s, box-shadow 0.2s;
    `;

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
      button.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.5)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
    });

    button.addEventListener('click', () => {
      // Envoyer un message pour ouvrir le popup avec le produit pré-rempli
      chrome.runtime.sendMessage({
        action: 'openSearch',
        productName: info.productName,
        price: info.price
      });
    });

    document.body.appendChild(button);
  }

  // Attendre que la page soit chargée avant d'ajouter le bouton
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFloatingButton);
  } else {
    // Petit délai pour s'assurer que les éléments dynamiques sont chargés
    setTimeout(addFloatingButton, 1500);
  }
})();
