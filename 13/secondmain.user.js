// ==UserScript==
// @name         SecondMain - Trouve en occasion
// @namespace    https://github.com/epmusic/secondmain
// @version      1.0.0
// @description  Compare les prix avec les annonces seconde main sur Le Bon Coin, Vinted, et plus encore !
// @author       Emmanuel Pinglier
// @match        https://www.leroymerlin.fr/*
// @match        https://www.castorama.fr/*
// @match        https://www.bricomarche.com/*
// @match        https://www.ikea.com/fr/*
// @match        https://www.amazon.fr/*
// @match        https://www.cdiscount.com/*
// @match        https://www.fnac.com/*
// @match        https://www.darty.com/*
// @match        https://www.boulanger.com/*
// @match        https://www.manomano.fr/*
// @match        https://www.but.fr/*
// @match        https://www.conforama.fr/*
// @icon         data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%2310b981' width='100' height='100' rx='20'/><text x='50' y='65' text-anchor='middle' fill='white' font-size='50' font-weight='bold'>€</text></svg>
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================

    const SOURCES = {
        leboncoin: {
            name: 'Le Bon Coin',
            color: '#f56b2a',
            buildUrl: (query, location) => {
                const params = new URLSearchParams({ text: query });
                if (location && location !== 'france') {
                    params.append('locations', getLocationCode(location));
                }
                return `https://www.leboncoin.fr/recherche?${params}`;
            }
        },
        vinted: {
            name: 'Vinted',
            color: '#09b1ba',
            buildUrl: (query) => `https://www.vinted.fr/catalog?search_text=${encodeURIComponent(query)}`
        },
        facebook: {
            name: 'FB Marketplace',
            color: '#1877f2',
            buildUrl: (query) => `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(query)}`
        },
        paruvendu: {
            name: 'ParuVendu',
            color: '#e4003a',
            buildUrl: (query) => `https://www.paruvendu.fr/pa/recherche/?kw=${encodeURIComponent(query)}`
        },
        ebay: {
            name: 'eBay',
            color: '#e53238',
            buildUrl: (query) => `https://www.ebay.fr/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_PrefLoc=1`
        }
    };

    const LOCATION_CODES = {
        idf: 'r_12', '75': 'd_75', '92': 'd_92', '93': 'd_93', '94': 'd_94',
        '77': 'd_77', '78': 'd_78', '91': 'd_91', '95': 'd_95'
    };

    function getLocationCode(loc) {
        return LOCATION_CODES[loc] || '';
    }

    // ==================== DETECTION PRODUIT ====================

    const SITE_SELECTORS = {
        'leroymerlin.fr': {
            name: ['h1[data-testid="product-title"]', '.pdp-title h1', 'h1.product-title', 'h1[itemprop="name"]', 'h1'],
            price: ['[data-testid="product-price"] .price', '.pdp-price', '[itemprop="price"]', '.product-price']
        },
        'castorama.fr': {
            name: ['h1.product-title', '.product-detail h1', 'h1[itemprop="name"]', 'h1'],
            price: ['.product-price', '[itemprop="price"]', '.price-value']
        },
        'ikea.com': {
            name: ['.pip-header-section h1', 'h1.pip-header-section__title--big', 'h1'],
            price: ['.pip-temp-price__integer', '.pip-price__integer', '.product-price']
        },
        'amazon.fr': {
            name: ['#productTitle', '#title', 'h1'],
            price: ['.a-price .a-offscreen', '#priceblock_ourprice', '.a-price-whole']
        },
        'cdiscount.com': {
            name: ['h1.fpTName', '.fpDesCol h1', 'h1[itemprop="name"]', 'h1'],
            price: ['.fpPrice', '.fpMPrice', '[itemprop="price"]']
        },
        'fnac.com': {
            name: ['h1.f-productHeader-Title', '.product-title h1', 'h1'],
            price: ['.f-productHeader-Price', '.userPrice .f-priceBox-price']
        },
        'darty.com': {
            name: ['h1.product_title', '.product-title h1', 'h1'],
            price: ['.product-price .price', '.darty_prix']
        },
        'boulanger.com': {
            name: ['h1.product-title', '.product-name h1', 'h1'],
            price: ['.product-price', '.price-value']
        },
        'manomano.fr': {
            name: ['h1[data-testid="product-title"]', 'h1.product-title', 'h1'],
            price: ['[data-testid="price"]', '.product-price']
        },
        'but.fr': {
            name: ['h1.product-title', 'h1[itemprop="name"]', 'h1'],
            price: ['.product-price', '[itemprop="price"]']
        },
        'conforama.fr': {
            name: ['h1.product-title', 'h1[itemprop="name"]', 'h1'],
            price: ['.product-price', '[itemprop="price"]']
        },
        'bricomarche.com': {
            name: ['h1.product-title', '.product-detail h1', 'h1'],
            price: ['.product-price', '.price']
        }
    };

    function getCurrentSite() {
        const hostname = window.location.hostname;
        for (const site of Object.keys(SITE_SELECTORS)) {
            if (hostname.includes(site)) return site;
        }
        return null;
    }

    function findElement(selectors) {
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el && el.textContent.trim()) return el;
        }
        return null;
    }

    function extractPrice(text) {
        if (!text) return null;
        const match = text.replace(/\s/g, '').match(/(\d+(?:[.,]\d{1,2})?)/);
        return match ? parseFloat(match[1].replace(',', '.')) : null;
    }

    function cleanProductName(text) {
        if (!text) return null;
        return text.replace(/\s+/g, ' ').trim().substring(0, 100);
    }

    function getProductInfo() {
        const site = getCurrentSite();
        if (!site) return { productName: document.title, price: null };

        const selectors = SITE_SELECTORS[site];
        const nameEl = findElement(selectors.name);
        const priceEl = findElement(selectors.price);

        return {
            productName: cleanProductName(nameEl?.textContent) || document.title.split('-')[0].trim(),
            price: extractPrice(priceEl?.textContent)
        };
    }

    // ==================== STYLES ====================

    GM_addStyle(`
        #secondmain-fab {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
            z-index: 2147483646;
            transition: all 0.3s ease;
            border: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #secondmain-fab:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
        }
        #secondmain-fab.has-panel {
            border-radius: 16px 16px 0 0;
            width: auto;
            padding: 0 20px;
            bottom: auto;
        }

        #secondmain-panel {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 360px;
            max-height: 500px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: none;
            flex-direction: column;
            overflow: hidden;
        }
        #secondmain-panel.open { display: flex; }

        .sm-header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .sm-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .sm-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sm-close:hover { background: rgba(255,255,255,0.3); }

        .sm-content {
            padding: 16px 20px;
            overflow-y: auto;
        }

        .sm-product {
            background: #f0fdf4;
            border-radius: 10px;
            padding: 12px;
            margin-bottom: 16px;
        }
        .sm-product-label {
            font-size: 11px;
            color: #059669;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 4px;
        }
        .sm-product-name {
            font-size: 14px;
            color: #1e293b;
            font-weight: 500;
            line-height: 1.4;
        }
        .sm-product-price {
            font-size: 13px;
            color: #64748b;
            margin-top: 4px;
        }

        .sm-search-input {
            width: 100%;
            padding: 12px 14px;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            font-size: 14px;
            margin-bottom: 16px;
            transition: border-color 0.2s;
        }
        .sm-search-input:focus {
            outline: none;
            border-color: #10b981;
        }

        .sm-filters {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 16px;
        }
        .sm-filter {
            display: flex;
            flex-direction: column;
        }
        .sm-filter label {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 4px;
        }
        .sm-filter select {
            padding: 8px 10px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 13px;
            background: white;
        }

        .sm-sources-title {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .sm-sources {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .sm-source-btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 14px;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            color: #1e293b;
        }
        .sm-source-btn:hover {
            border-color: #10b981;
            transform: translateX(4px);
        }
        .sm-source-name {
            font-size: 14px;
            font-weight: 500;
        }
        .sm-source-arrow {
            color: #10b981;
            font-size: 18px;
        }

        .sm-open-all {
            width: 100%;
            padding: 14px;
            margin-top: 16px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .sm-open-all:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .sm-footer {
            padding: 12px 20px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            font-size: 11px;
            color: #94a3b8;
            text-align: center;
        }
        .sm-footer a {
            color: #10b981;
            text-decoration: none;
        }
    `);

    // ==================== UI ====================

    function createUI() {
        // Bouton flottant
        const fab = document.createElement('button');
        fab.id = 'secondmain-fab';
        fab.innerHTML = '♻️';
        fab.title = 'Chercher en seconde main';
        fab.addEventListener('click', togglePanel);
        document.body.appendChild(fab);

        // Panel
        const panel = document.createElement('div');
        panel.id = 'secondmain-panel';
        panel.innerHTML = `
            <div class="sm-header">
                <h3>♻️ SecondMain</h3>
                <button class="sm-close">×</button>
            </div>
            <div class="sm-content">
                <div class="sm-product">
                    <div class="sm-product-label">Produit detecte</div>
                    <div class="sm-product-name" id="sm-product-name">Chargement...</div>
                    <div class="sm-product-price" id="sm-product-price"></div>
                </div>

                <input type="text" class="sm-search-input" id="sm-search" placeholder="Modifier la recherche...">

                <div class="sm-filters">
                    <div class="sm-filter">
                        <label>Localisation</label>
                        <select id="sm-location">
                            <option value="idf">Ile-de-France</option>
                            <option value="75">Paris (75)</option>
                            <option value="92">Hauts-de-Seine (92)</option>
                            <option value="93">Seine-Saint-Denis (93)</option>
                            <option value="94">Val-de-Marne (94)</option>
                            <option value="77">Seine-et-Marne (77)</option>
                            <option value="78">Yvelines (78)</option>
                            <option value="91">Essonne (91)</option>
                            <option value="95">Val-d'Oise (95)</option>
                            <option value="france">France entiere</option>
                        </select>
                    </div>
                    <div class="sm-filter">
                        <label>Ouvrir dans</label>
                        <select id="sm-target">
                            <option value="_blank">Nouvel onglet</option>
                            <option value="_self">Meme onglet</option>
                        </select>
                    </div>
                </div>

                <div class="sm-sources-title">Rechercher sur :</div>
                <div class="sm-sources" id="sm-sources"></div>

                <button class="sm-open-all" id="sm-open-all">Ouvrir toutes les recherches</button>
            </div>
            <div class="sm-footer">
                Un Jour Une App - Jour 13 |
                <a href="https://www.linkedin.com/in/emmanuel-pinglier-449988151/" target="_blank">Emmanuel Pinglier</a>
            </div>
        `;
        document.body.appendChild(panel);

        // Events
        panel.querySelector('.sm-close').addEventListener('click', togglePanel);
        document.getElementById('sm-open-all').addEventListener('click', openAllSources);
        document.getElementById('sm-search').addEventListener('input', updateSourceLinks);
        document.getElementById('sm-location').addEventListener('change', () => {
            GM_setValue('location', document.getElementById('sm-location').value);
            updateSourceLinks();
        });

        // Charger les preferences
        const savedLocation = GM_getValue('location', 'idf');
        document.getElementById('sm-location').value = savedLocation;

        // Generer les boutons de sources
        generateSourceButtons();
    }

    function generateSourceButtons() {
        const container = document.getElementById('sm-sources');
        container.innerHTML = Object.entries(SOURCES).map(([key, source]) => `
            <a href="#" class="sm-source-btn" data-source="${key}" target="_blank">
                <span class="sm-source-name" style="color: ${source.color}">${source.name}</span>
                <span class="sm-source-arrow">→</span>
            </a>
        `).join('');

        container.querySelectorAll('.sm-source-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const sourceKey = btn.dataset.source;
                const query = document.getElementById('sm-search').value;
                const location = document.getElementById('sm-location').value;
                const target = document.getElementById('sm-target').value;
                const url = SOURCES[sourceKey].buildUrl(query, location);
                window.open(url, target);
            });
        });
    }

    function updateSourceLinks() {
        const query = document.getElementById('sm-search').value;
        const location = document.getElementById('sm-location').value;

        document.querySelectorAll('.sm-source-btn').forEach(btn => {
            const sourceKey = btn.dataset.source;
            btn.href = SOURCES[sourceKey].buildUrl(query, location);
        });
    }

    function togglePanel() {
        const panel = document.getElementById('secondmain-panel');
        const isOpen = panel.classList.toggle('open');

        if (isOpen) {
            const info = getProductInfo();
            document.getElementById('sm-product-name').textContent = info.productName;
            document.getElementById('sm-product-price').textContent = info.price
                ? `Prix neuf : ${info.price.toFixed(2)}€`
                : '';
            document.getElementById('sm-search').value = info.productName;
            updateSourceLinks();
        }
    }

    function openAllSources() {
        const query = document.getElementById('sm-search').value;
        const location = document.getElementById('sm-location').value;

        Object.values(SOURCES).forEach(source => {
            window.open(source.buildUrl(query, location), '_blank');
        });
    }

    // ==================== NOTIFICATION AUTO ====================

    const CART_BUTTON_SELECTORS = [
        // Leroy Merlin
        '[data-testid="add-to-cart"]',
        'button[class*="add-to-cart"]',
        '.add-to-cart-button',
        // Castorama
        '.product-add-to-cart button',
        '[data-testid="pdp-add-to-cart"]',
        // IKEA
        '.pip-buy-module__button',
        '[data-testid="add-to-bag"]',
        // Amazon
        '#add-to-cart-button',
        '#buy-now-button',
        '[name="submit.add-to-cart"]',
        // Cdiscount
        '.btGreen',
        '#fpAddBsk',
        // Fnac
        '.f-buyBox-cta-addToCart',
        '[data-automation-id="add-to-basket"]',
        // Darty
        '.add-to-cart',
        '.product-buy-button',
        // Boulanger
        '.product-buy button',
        '.btn-add-to-cart',
        // Generique
        'button[class*="panier"]',
        'button[class*="basket"]',
        'button[class*="cart"]',
        '[class*="add-to-cart"]',
        '[class*="addToCart"]',
        '[class*="ajout-panier"]'
    ];

    let notificationShown = false;
    let notificationDismissed = false;

    GM_addStyle(`
        #secondmain-notif {
            position: fixed;
            bottom: 100px;
            right: 24px;
            width: 340px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            animation: sm-slide-in 0.4s ease-out;
            overflow: hidden;
        }

        @keyframes sm-slide-in {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes sm-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .sm-notif-header {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 14px 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .sm-notif-header-icon {
            font-size: 24px;
            animation: sm-pulse 2s infinite;
        }

        .sm-notif-header-text {
            flex: 1;
        }

        .sm-notif-header h4 {
            font-size: 15px;
            font-weight: 600;
            margin: 0 0 2px 0;
        }

        .sm-notif-header p {
            font-size: 12px;
            opacity: 0.9;
            margin: 0;
        }

        .sm-notif-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 14px;
        }

        .sm-notif-body {
            padding: 16px;
        }

        .sm-notif-product {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 12px;
            padding: 10px;
            background: #f8fafc;
            border-radius: 8px;
        }

        .sm-notif-product strong {
            color: #1e293b;
            display: block;
            margin-bottom: 4px;
        }

        .sm-notif-alternatives {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .sm-notif-alt {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            text-decoration: none;
            color: #1e293b;
            transition: all 0.2s;
        }

        .sm-notif-alt:hover {
            background: #dcfce7;
            transform: translateX(4px);
        }

        .sm-notif-alt-source {
            font-size: 13px;
            font-weight: 500;
        }

        .sm-notif-alt-action {
            font-size: 12px;
            color: #10b981;
            font-weight: 600;
        }

        .sm-notif-footer {
            padding: 12px 16px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 8px;
        }

        .sm-notif-btn {
            flex: 1;
            padding: 10px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
        }

        .sm-notif-btn-secondary {
            background: #e2e8f0;
            color: #64748b;
        }

        .sm-notif-btn-secondary:hover {
            background: #cbd5e1;
        }

        .sm-notif-btn-primary {
            background: #10b981;
            color: white;
        }

        .sm-notif-btn-primary:hover {
            background: #059669;
        }

        .sm-notif-reminder {
            font-size: 11px;
            color: #94a3b8;
            text-align: center;
            padding: 8px;
            border-top: 1px solid #e2e8f0;
        }
    `);

    function showCartNotification() {
        if (notificationShown || notificationDismissed) return;
        notificationShown = true;

        const info = getProductInfo();
        if (!info.productName || info.productName.length < 5) return;

        const notif = document.createElement('div');
        notif.id = 'secondmain-notif';

        const location = GM_getValue('location', 'idf');

        notif.innerHTML = `
            <div class="sm-notif-header">
                <span class="sm-notif-header-icon">💡</span>
                <div class="sm-notif-header-text">
                    <h4>Avant d'acheter...</h4>
                    <p>Ce produit existe peut-etre en occasion !</p>
                </div>
                <button class="sm-notif-close" id="sm-notif-close">×</button>
            </div>
            <div class="sm-notif-body">
                <div class="sm-notif-product">
                    <strong>${info.productName.substring(0, 60)}${info.productName.length > 60 ? '...' : ''}</strong>
                    ${info.price ? `Prix neuf : ${info.price.toFixed(2)}€` : 'Verifiez les prix en occasion'}
                </div>
                <div class="sm-notif-alternatives">
                    <a href="${SOURCES.leboncoin.buildUrl(info.productName, location)}" target="_blank" class="sm-notif-alt">
                        <span class="sm-notif-alt-source" style="color: #f56b2a;">🟠 Le Bon Coin</span>
                        <span class="sm-notif-alt-action">Voir →</span>
                    </a>
                    <a href="${SOURCES.vinted.buildUrl(info.productName)}" target="_blank" class="sm-notif-alt">
                        <span class="sm-notif-alt-source" style="color: #09b1ba;">🔵 Vinted</span>
                        <span class="sm-notif-alt-action">Voir →</span>
                    </a>
                    <a href="${SOURCES.facebook.buildUrl(info.productName)}" target="_blank" class="sm-notif-alt">
                        <span class="sm-notif-alt-source" style="color: #1877f2;">🔷 FB Marketplace</span>
                        <span class="sm-notif-alt-action">Voir →</span>
                    </a>
                </div>
            </div>
            <div class="sm-notif-footer">
                <button class="sm-notif-btn sm-notif-btn-secondary" id="sm-notif-dismiss">Non merci</button>
                <button class="sm-notif-btn sm-notif-btn-primary" id="sm-notif-all">Tout ouvrir</button>
            </div>
            <div class="sm-notif-reminder">
                ♻️ SecondMain - Economisez et recyclez
            </div>
        `;

        document.body.appendChild(notif);

        // Events
        document.getElementById('sm-notif-close').addEventListener('click', dismissNotification);
        document.getElementById('sm-notif-dismiss').addEventListener('click', dismissNotification);
        document.getElementById('sm-notif-all').addEventListener('click', () => {
            Object.values(SOURCES).forEach(source => {
                window.open(source.buildUrl(info.productName, location), '_blank');
            });
            dismissNotification();
        });

        // Auto-dismiss après 30 secondes
        setTimeout(() => {
            if (document.getElementById('secondmain-notif')) {
                dismissNotification();
            }
        }, 30000);
    }

    function dismissNotification() {
        const notif = document.getElementById('secondmain-notif');
        if (notif) {
            notif.style.animation = 'sm-slide-in 0.3s ease-in reverse';
            setTimeout(() => notif.remove(), 300);
        }
        notificationDismissed = true;
    }

    function setupCartInterception() {
        // Observer pour détecter les boutons ajoutés dynamiquement
        const observer = new MutationObserver(() => {
            attachCartListeners();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Attacher les listeners initiaux
        setTimeout(attachCartListeners, 1000);
        setTimeout(attachCartListeners, 3000);
    }

    function attachCartListeners() {
        CART_BUTTON_SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(button => {
                if (button.dataset.smListenerAttached) return;
                button.dataset.smListenerAttached = 'true';

                button.addEventListener('click', (e) => {
                    // Ne pas bloquer l'action, juste afficher la notif
                    showCartNotification();
                }, true);

                // Aussi sur mouseenter pour anticiper
                button.addEventListener('mouseenter', () => {
                    // Afficher après 2 secondes de survol
                    const hoverTimeout = setTimeout(() => {
                        showCartNotification();
                    }, 2000);

                    button.addEventListener('mouseleave', () => {
                        clearTimeout(hoverTimeout);
                    }, { once: true });
                }, { once: true });
            });
        });
    }

    // ==================== INIT ====================

    // Attendre que la page soit chargée
    function init() {
        // Vérifier qu'on est sur une page produit (pas la home)
        const path = window.location.pathname;
        if (path === '/' || path === '/fr/' || path === '/fr/fr/') {
            return; // Ne pas afficher sur la page d'accueil
        }

        createUI();
        setupCartInterception();

        // Après un délai, vérifier si un produit est détecté
        setTimeout(() => {
            const info = getProductInfo();
            if (info.productName && info.productName.length > 3) {
                document.getElementById('secondmain-fab').style.display = 'flex';
            }
        }, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
