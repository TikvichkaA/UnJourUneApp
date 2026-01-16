// SecondMain - Content Script
// Détecte les produits et déclenche la recherche en arrière-plan

(function () {
  'use strict';

  // Stocker les résultats pour les utiliser lors du clic panier
  let savedResults = null;
  let searchQuery = '';

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

    // Essayer d'obtenir la géolocalisation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Avec géolocalisation
          chrome.runtime.sendMessage({
            action: 'searchSecondHand',
            productName: productInfo.productName,
            price: productInfo.price,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
        },
        () => {
          // Sans géolocalisation (refusée ou erreur)
          chrome.runtime.sendMessage({
            action: 'searchSecondHand',
            productName: productInfo.productName,
            price: productInfo.price,
            location: null
          });
        },
        { timeout: 5000, maximumAge: 300000 }
      );
    } else {
      // Navigateur sans géolocalisation
      chrome.runtime.sendMessage({
        action: 'searchSecondHand',
        productName: productInfo.productName,
        price: productInfo.price,
        location: null
      });
    }
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

  // Écouter les messages du popup et du background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getProductInfo') {
      sendResponse(getProductInfo());
    }
    if (request.action === 'resultsFound') {
      console.log('SecondMain: Résultats reçus', request.results);
      savedResults = request.results;
      updateFloatingButtonWithResults(request.results, request.count);
      interceptCartButton();
    }
    if (request.action === 'noResults') {
      console.log('SecondMain: Aucun résultat pertinent');
      savedResults = null;
      updateFloatingButtonNoResults();
    }
    return true;
  });

  // Simplifier le nom du produit pour la recherche
  function simplifyProductName(name) {
    const stopWords = ['le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'ou', 'pour', 'avec', 'sans', 'dans'];
    return name
      .toLowerCase()
      .replace(/[^\w\sàâäéèêëïîôùûüç-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 5)
      .join(' ');
  }

  // Intercepter le clic sur le bouton panier
  function interceptCartButton() {
    const site = getCurrentSite();
    if (!site || !savedResults || savedResults.length === 0) return;

    const selectors = SITE_SELECTORS[site];
    if (!selectors.cart) return;

    selectors.cart.forEach(selector => {
      document.querySelectorAll(selector).forEach(btn => {
        if (btn.dataset.secondmainIntercepted) return;
        btn.dataset.secondmainIntercepted = 'true';

        btn.addEventListener('click', (e) => {
          if (savedResults && savedResults.length > 0) {
            e.preventDefault();
            e.stopPropagation();
            showCartInterceptModal(btn);
          }
        }, true);
      });
    });
  }

  // Afficher la modal d'interception
  function showCartInterceptModal(originalButton) {
    // Ne pas afficher si déjà présente
    if (document.getElementById('secondmain-modal')) return;

    const info = getProductInfo();
    const query = simplifyProductName(info?.productName || '');

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'secondmain-modal';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: '2147483647',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    });

    // Modal
    const modal = document.createElement('div');
    Object.assign(modal.style, {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '400px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    });

    // Contenu des résultats
    let resultsHtml = savedResults.map(r => {
      const locationText = r.distance !== null
        ? `📍 ${r.distance} km`
        : (r.location ? `📍 ${r.location}` : '');
      const sourceColor = r.source === 'vinted' ? '#09b1ba' : '#f56b2a';
      const sourceName = r.source === 'vinted' ? 'Vinted' : 'LBC';
      return `
        <a href="${r.url}" target="_blank" style="
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          margin-bottom: 8px;
          background: #f8fafc;
          border-radius: 10px;
          text-decoration: none;
          color: inherit;
          transition: background 0.2s;
        " onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='#f8fafc'">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-size: 10px; background: ${sourceColor}; color: white; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${sourceName}</span>
            </div>
            <div style="font-size: 13px; color: #1e293b; line-height: 1.4;">
              ${r.title.substring(0, 50)}${r.title.length > 50 ? '...' : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px;">
              ${r.price ? `<span style="font-size: 15px; color: #10b981; font-weight: 600;">${r.price}€</span>` : ''}
              ${locationText ? `<span style="font-size: 12px; color: #94a3b8;">${locationText}</span>` : ''}
            </div>
          </div>
          <div style="color: #94a3b8;">→</div>
        </a>
      `;
    }).join('');

    // Compter les sources
    const lbcCount = savedResults.filter(r => r.source === 'leboncoin').length;
    const vintedCount = savedResults.filter(r => r.source === 'vinted').length;
    let sourcesText = [];
    if (lbcCount > 0) sourcesText.push(`${lbcCount} Le Bon Coin`);
    if (vintedCount > 0) sourcesText.push(`${vintedCount} Vinted`);

    modal.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 40px; margin-bottom: 12px;">♻️</div>
        <h2 style="font-size: 20px; color: #1e293b; margin: 0 0 8px 0;">
          Et en occasion ?
        </h2>
        <p style="font-size: 14px; color: #64748b; margin: 0;">
          ${savedResults.length} annonce${savedResults.length > 1 ? 's' : ''} trouvée${savedResults.length > 1 ? 's' : ''} (${sourcesText.join(', ')})
        </p>
      </div>

      <div style="margin-bottom: 20px;">
        ${resultsHtml}
      </div>

      <div style="display: flex; gap: 10px;">
        <button id="secondmain-see-all" style="
          flex: 1;
          padding: 14px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        ">
          Voir toutes les annonces
        </button>
        <button id="secondmain-continue" style="
          flex: 1;
          padding: 14px;
          background: #f1f5f9;
          color: #64748b;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        ">
          Acheter neuf
        </button>
      </div>

      <p style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 16px;">
        SecondMain - Trouve moins cher en occasion
      </p>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Fermer au clic sur l'overlay
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    // Bouton "Voir toutes les annonces"
    document.getElementById('secondmain-see-all').addEventListener('click', () => {
      const url = `https://www.leboncoin.fr/recherche?text=${encodeURIComponent(query)}`;
      window.open(url, '_blank');
      overlay.remove();
    });

    // Bouton "Acheter neuf" - continuer l'action originale
    document.getElementById('secondmain-continue').addEventListener('click', () => {
      overlay.remove();
      // Désactiver l'interception temporairement et re-cliquer
      savedResults = null;
      originalButton.click();
    });
  }

  // Mettre à jour le bouton quand pas de résultats pertinents
  function updateFloatingButtonNoResults() {
    const container = document.getElementById('secondmain-fab');
    if (!container) return;

    const preview = container.querySelector('.secondmain-preview');
    if (!preview) return;

    const info = getProductInfo();
    const searchQuery = simplifyProductName(info?.productName || '');

    preview.innerHTML = `
      <div style="font-size: 12px; color: #64748b; text-align: center;">
        <div style="margin-bottom: 8px;">😕</div>
        <div style="margin-bottom: 10px;">Pas d'annonce similaire trouvée</div>
        <div style="font-size: 11px; color: #10b981;">
          Cliquez pour chercher manuellement
        </div>
      </div>
    `;
  }

  // Mettre à jour le bouton avec les résultats Le Bon Coin
  function updateFloatingButtonWithResults(results, totalCount) {
    const container = document.getElementById('secondmain-fab');
    if (!container) return;

    const button = container.querySelector('.secondmain-button');
    const badge = container.querySelector('.secondmain-badge');
    const preview = container.querySelector('.secondmain-preview');

    if (!button || !badge || !preview) return;

    // Afficher le badge avec le nombre de résultats
    badge.style.display = 'flex';
    badge.textContent = String(Math.min(results.length, 9));

    // Mettre à jour le contenu de l'aperçu avec les résultats
    const info = getProductInfo();
    const searchQuery = simplifyProductName(info?.productName || '');

    let resultsHtml = results.map(r => {
      const locationText = r.distance !== null
        ? `📍 ${r.distance} km`
        : (r.location ? `📍 ${r.location}` : '');
      const sourceColor = r.source === 'vinted' ? '#09b1ba' : '#f56b2a';
      const sourceName = r.source === 'vinted' ? 'Vinted' : 'LBC';
      return `
        <a href="${r.url}" target="_blank" style="
          display: block;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
          text-decoration: none;
          color: inherit;
        ">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
            <span style="font-size: 9px; background: ${sourceColor}; color: white; padding: 2px 5px; border-radius: 3px; font-weight: 600;">${sourceName}</span>
            <span style="font-size: 12px; color: #1e293b; line-height: 1.3;">
              ${r.title.substring(0, 40)}${r.title.length > 40 ? '...' : ''}
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 2px;">
            ${r.price ? `<span style="font-size: 13px; color: #10b981; font-weight: 600;">${r.price}€</span>` : ''}
            ${locationText ? `<span style="font-size: 11px; color: #94a3b8;">${locationText}</span>` : ''}
          </div>
        </a>
      `;
    }).join('');

    preview.innerHTML = `
      <div style="font-size: 10px; color: #ef4444; font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">
        🎉 ${results.length} annonce${results.length > 1 ? 's' : ''} trouvée${results.length > 1 ? 's' : ''}
      </div>
      <div style="max-height: 200px; overflow-y: auto;">
        ${resultsHtml}
      </div>
      <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e2e8f0;">
        <div style="font-size: 11px; color: #64748b; text-align: center;">
          Cliquez pour voir toutes les annonces
        </div>
      </div>
    `;

    // Stocker la query pour le clic
    container.dataset.searchQuery = searchQuery;
  }

  // Ajouter le bouton flottant (sans résultats au départ)
  function addFloatingButton() {
    const info = getProductInfo();
    if (!info || !info.productName) return;

    // Ne pas ajouter si déjà présent
    if (document.getElementById('secondmain-fab')) return;

    const searchQuery = simplifyProductName(info.productName);

    // Container principal
    const container = document.createElement('div');
    container.id = 'secondmain-fab';
    container.dataset.searchQuery = searchQuery;
    Object.assign(container.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: '2147483647',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    });

    // Bouton principal
    const button = document.createElement('div');
    button.className = 'secondmain-button';
    Object.assign(button.style, {
      width: '56px',
      height: '56px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative'
    });
    button.innerHTML = '♻️';

    // Badge rouge (caché par défaut)
    const badge = document.createElement('div');
    badge.className = 'secondmain-badge';
    Object.assign(badge.style, {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      width: '20px',
      height: '20px',
      background: '#ef4444',
      borderRadius: '50%',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 'bold',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    });
    button.appendChild(badge);

    // Panneau d'aperçu (caché par défaut)
    const preview = document.createElement('div');
    preview.className = 'secondmain-preview';
    Object.assign(preview.style, {
      position: 'absolute',
      bottom: '65px',
      right: '0',
      width: '300px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      padding: '16px',
      opacity: '0',
      transform: 'translateY(10px)',
      transition: 'opacity 0.2s, transform 0.2s',
      pointerEvents: 'none'
    });

    preview.innerHTML = `
      <div style="font-size: 12px; color: #64748b; text-align: center;">
        <div style="margin-bottom: 8px;">🔍</div>
        Recherche en cours sur Le Bon Coin...
      </div>
    `;

    // Effet hover
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
      button.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.5)';
      preview.style.opacity = '1';
      preview.style.transform = 'translateY(0)';
      preview.style.pointerEvents = 'auto';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
      preview.style.opacity = '0';
      preview.style.transform = 'translateY(10px)';
      preview.style.pointerEvents = 'none';
    });

    // Clic : ouvrir Le Bon Coin
    button.addEventListener('click', () => {
      const query = container.dataset.searchQuery || searchQuery;
      const url = `https://www.leboncoin.fr/recherche?text=${encodeURIComponent(query)}`;
      window.open(url, '_blank');
    });

    container.appendChild(preview);
    container.appendChild(button);
    document.body.appendChild(container);
  }

  // Initialisation
  function init() {
    // Ne pas s'activer sur la page d'accueil
    const path = window.location.pathname;
    if (path === '/' || path === '/fr/' || path === '/fr/fr/') return;

    // Attendre que la page soit chargée
    setTimeout(() => {
      watchCartButton();
      addFloatingButton();

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
