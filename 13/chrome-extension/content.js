// SecondMain - Content Script
// Détecte les produits et déclenche la recherche en arrière-plan

(function () {
  'use strict';

  // Sélecteurs pour différents sites
  const SITE_SELECTORS = {
    'leroymerlin.fr': {
      name: ['h1[data-testid="product-title"]', '.pdp-title h1', 'h1.product-title', 'h1[itemprop="name"]', 'h1'],
      price: ['[data-testid="product-price"]', '.pdp-price', '[itemprop="price"]', '.product-price', '.price'],
      cart: ['[data-testid="add-to-cart"]', 'button[class*="add-to-cart"]', '.add-to-cart-button', '#add-to-cart']
    },
    'castorama.fr': {
      name: ['h1.product-title', '.product-detail h1', 'h1[itemprop="name"]', 'h1'],
      price: ['.product-price', '[itemprop="price"]', '.price-value'],
      cart: ['.product-add-to-cart button', '[data-testid="add-to-cart"]']
    },
    'ikea.com': {
      name: ['.pip-header-section h1', 'h1.pip-header-section__title--big', 'h1'],
      price: ['.pip-temp-price__integer', '.pip-price__integer', '.product-price'],
      cart: ['.pip-buy-module__button', '[data-testid="add-to-bag"]']
    },
    'amazon.fr': {
      name: ['#productTitle', '#title', 'h1'],
      price: ['.a-price .a-offscreen', '#priceblock_ourprice', '.a-price-whole'],
      cart: ['#add-to-cart-button', '#buy-now-button']
    },
    'fnac.com': {
      name: ['h1.f-productHeader-Title', '.product-title h1', 'h1'],
      price: ['.f-productHeader-Price', '.userPrice .f-priceBox-price'],
      cart: ['.f-buyBox-cta-addToCart', '[data-automation-id="add-to-basket"]']
    },
    'darty.com': {
      name: ['h1.product_title', '.product-title h1', 'h1'],
      price: ['.product-price .price', '.darty_prix'],
      cart: ['.add-to-cart', '.product-buy-button']
    },
    'boulanger.com': {
      name: ['h1.product-title', '.product-name h1', 'h1'],
      price: ['.product-price', '.price-value'],
      cart: ['.product-buy button', '.btn-add-to-cart']
    },
    'cdiscount.com': {
      name: ['h1.fpTName', '.fpDesCol h1', 'h1[itemprop="name"]', 'h1'],
      price: ['.fpPrice', '.fpMPrice', '[itemprop="price"]'],
      cart: ['.btGreen', '#fpAddBsk']
    },
    'manomano.fr': {
      name: ['h1[data-testid="product-title"]', 'h1.product-title', 'h1'],
      price: ['[data-testid="price"]', '.product-price'],
      cart: ['[data-testid="add-to-cart"]', '.add-to-cart']
    }
  };

  let hasSearched = false;
  let productInfo = null;

  // Détecter le site actuel
  function getCurrentSite() {
    const hostname = window.location.hostname;
    for (const site of Object.keys(SITE_SELECTORS)) {
      if (hostname.includes(site)) return site;
    }
    return null;
  }

  // Trouver un élément avec plusieurs sélecteurs
  function findElement(selectors) {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el && el.textContent.trim()) return el;
    }
    return null;
  }

  // Extraire le prix d'un texte
  function extractPrice(text) {
    if (!text) return null;
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/(\d+(?:[.,]\d{1,2})?)/);
    return match ? parseFloat(match[1].replace(',', '.')) : null;
  }

  // Récupérer les infos du produit
  function getProductInfo() {
    const site = getCurrentSite();
    if (!site) return null;

    const selectors = SITE_SELECTORS[site];
    const nameEl = findElement(selectors.name);
    const priceEl = findElement(selectors.price);

    if (!nameEl) return null;

    return {
      productName: nameEl.textContent.replace(/\s+/g, ' ').trim().substring(0, 150),
      price: extractPrice(priceEl?.textContent),
      site: site
    };
  }

  // Déclencher la recherche en arrière-plan
  function triggerBackgroundSearch() {
    if (hasSearched) return;

    productInfo = getProductInfo();
    if (!productInfo || !productInfo.productName) return;

    hasSearched = true;

    // Envoyer au background script pour recherche
    chrome.runtime.sendMessage({
      action: 'searchSecondHand',
      productName: productInfo.productName,
      price: productInfo.price
    });
  }

  // Surveiller le bouton panier pour recherche anticipée
  function watchCartButton() {
    const site = getCurrentSite();
    if (!site) return;

    const selectors = SITE_SELECTORS[site];
    if (!selectors.cart) return;

    // Observer pour les boutons ajoutés dynamiquement
    const observer = new MutationObserver(() => {
      selectors.cart.forEach(selector => {
        document.querySelectorAll(selector).forEach(btn => {
          if (btn.dataset.secondmainWatched) return;
          btn.dataset.secondmainWatched = 'true';

          // Recherche au survol du bouton panier
          btn.addEventListener('mouseenter', () => {
            triggerBackgroundSearch();
          }, { once: true });
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Premier passage
    setTimeout(() => {
      selectors.cart.forEach(selector => {
        document.querySelectorAll(selector).forEach(btn => {
          if (btn.dataset.secondmainWatched) return;
          btn.dataset.secondmainWatched = 'true';

          btn.addEventListener('mouseenter', () => {
            triggerBackgroundSearch();
          }, { once: true });
        });
      });
    }, 2000);
  }

  // Écouter les messages du popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getProductInfo') {
      sendResponse(getProductInfo());
    }
    return true;
  });

  // Initialisation
  function init() {
    // Ne pas s'activer sur la page d'accueil
    const path = window.location.pathname;
    if (path === '/' || path === '/fr/' || path === '/fr/fr/') return;

    // Attendre que la page soit chargée
    setTimeout(() => {
      watchCartButton();

      // Déclencher la recherche après 5 secondes sur la page produit
      setTimeout(triggerBackgroundSearch, 5000);
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
