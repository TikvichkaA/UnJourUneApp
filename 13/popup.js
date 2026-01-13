// SecondMain - Extension Chrome pour trouver des produits en seconde main
// Un Jour Une App - Jour 13

document.addEventListener('DOMContentLoaded', init);

// Configuration des sources
const SOURCES = {
  leboncoin: {
    name: 'Le Bon Coin',
    baseUrl: 'https://www.leboncoin.fr/recherche',
    buildUrl: (query, location) => {
      const params = new URLSearchParams({
        text: query,
        locations: getLocationCode(location, 'leboncoin')
      });
      return `https://www.leboncoin.fr/recherche?${params}`;
    }
  },
  vinted: {
    name: 'Vinted',
    baseUrl: 'https://www.vinted.fr/catalog',
    buildUrl: (query) => {
      return `https://www.vinted.fr/catalog?search_text=${encodeURIComponent(query)}`;
    }
  },
  facebook: {
    name: 'FB Marketplace',
    baseUrl: 'https://www.facebook.com/marketplace',
    buildUrl: (query) => {
      return `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(query)}`;
    }
  },
  paruvendu: {
    name: 'ParuVendu',
    baseUrl: 'https://www.paruvendu.fr',
    buildUrl: (query) => {
      return `https://www.paruvendu.fr/pa/recherche/?kw=${encodeURIComponent(query)}`;
    }
  }
};

// Codes de localisation pour Le Bon Coin
const LOCATION_CODES = {
  idf: 'r_12',
  '75': 'd_75',
  '92': 'd_92',
  '93': 'd_93',
  '94': 'd_94',
  '77': 'd_77',
  '78': 'd_78',
  '91': 'd_91',
  '95': 'd_95',
  france: ''
};

function getLocationCode(location, source) {
  if (source === 'leboncoin') {
    return LOCATION_CODES[location] || '';
  }
  return location;
}

// État global
let state = {
  detectedProduct: null,
  referencePrice: null,
  isSearching: false
};

async function init() {
  // Charger les préférences sauvegardées
  await loadPreferences();

  // Tenter de détecter un produit sur la page active
  detectProductFromPage();

  // Event listeners
  document.getElementById('search-btn').addEventListener('click', performSearch);
  document.getElementById('product-search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
  document.getElementById('use-detected').addEventListener('click', useDetectedProduct);

  // Sauvegarder les préférences quand elles changent
  document.querySelectorAll('select, input[type="checkbox"]').forEach(el => {
    el.addEventListener('change', savePreferences);
  });
}

async function loadPreferences() {
  try {
    const prefs = await chrome.storage.local.get(['location', 'radius', 'sources', 'minSavings']);
    if (prefs.location) document.getElementById('location').value = prefs.location;
    if (prefs.radius) document.getElementById('radius').value = prefs.radius;
    if (prefs.minSavings) document.getElementById('min-savings').value = prefs.minSavings;
    if (prefs.sources) {
      document.querySelectorAll('.source-checkbox input').forEach(cb => {
        cb.checked = prefs.sources.includes(cb.value);
      });
    }
  } catch (e) {
    console.log('Pas de préférences sauvegardées');
  }
}

async function savePreferences() {
  const sources = Array.from(document.querySelectorAll('.source-checkbox input:checked'))
    .map(cb => cb.value);

  try {
    await chrome.storage.local.set({
      location: document.getElementById('location').value,
      radius: document.getElementById('radius').value,
      minSavings: document.getElementById('min-savings').value,
      sources: sources
    });
  } catch (e) {
    console.log('Erreur sauvegarde préférences');
  }
}

async function detectProductFromPage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.id) return;

    // Envoyer un message au content script
    chrome.tabs.sendMessage(tab.id, { action: 'getProductInfo' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Pas de content script sur cette page');
        return;
      }

      if (response && response.productName) {
        state.detectedProduct = response.productName;
        state.referencePrice = response.price;
        showDetectedProduct(response.productName, response.price);
      }
    });
  } catch (e) {
    console.log('Erreur détection produit:', e);
  }
}

function showDetectedProduct(name, price) {
  const container = document.getElementById('detected-product');
  const nameEl = document.getElementById('detected-name');

  let displayText = name;
  if (price) {
    displayText += ` (${price}€ en neuf)`;
  }

  nameEl.textContent = displayText;
  container.style.display = 'flex';
}

function useDetectedProduct() {
  if (state.detectedProduct) {
    document.getElementById('product-search').value = state.detectedProduct;
    performSearch();
  }
}

async function performSearch() {
  const query = document.getElementById('product-search').value.trim();
  if (!query) {
    document.getElementById('product-search').focus();
    return;
  }

  const sources = getSelectedSources();
  if (sources.length === 0) {
    alert('Sélectionnez au moins une source de recherche');
    return;
  }

  showLoading(true);

  // Simuler un délai de recherche
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Générer des résultats simulés
  const results = generateSimulatedResults(query, sources);

  showLoading(false);
  displayResults(results, query);
}

function getSelectedSources() {
  return Array.from(document.querySelectorAll('.source-checkbox input:checked'))
    .map(cb => cb.value);
}

function showLoading(show) {
  document.getElementById('loading-section').style.display = show ? 'block' : 'none';
  document.getElementById('results-section').style.display = show ? 'none' : 'block';
  state.isSearching = show;
}

// Génération de résultats simulés (en production, ce serait des vraies requêtes API)
function generateSimulatedResults(query, sources) {
  const maxPrice = parseInt(document.getElementById('max-price').value) || Infinity;
  const minSavings = parseInt(document.getElementById('min-savings').value) || 0;
  const referencePrice = state.referencePrice || estimateReferencePrice(query);

  const results = [];
  const queryLower = query.toLowerCase();

  // Mots-clés pour générer des résultats pertinents
  const isCarrelage = queryLower.includes('carrelage') || queryLower.includes('carreau');
  const isPeinture = queryLower.includes('peinture');
  const isOutillage = queryLower.includes('perceuse') || queryLower.includes('visseuse') || queryLower.includes('outil');
  const isElectro = queryLower.includes('frigo') || queryLower.includes('lave') || queryLower.includes('four');
  const isMeuble = queryLower.includes('meuble') || queryLower.includes('table') || queryLower.includes('chaise') || queryLower.includes('armoire');

  // Nombre aléatoire de résultats par source
  sources.forEach(source => {
    const numResults = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < numResults; i++) {
      const savings = minSavings + Math.floor(Math.random() * (70 - minSavings));
      const price = Math.round(referencePrice * (1 - savings / 100));

      if (price > maxPrice) continue;

      const result = {
        id: `${source}-${i}`,
        source: source,
        title: generateTitle(query, i),
        price: price,
        savings: savings,
        referencePrice: referencePrice,
        location: generateLocation(),
        date: generateDate(),
        image: generateImagePlaceholder(query),
        url: SOURCES[source].buildUrl(query, document.getElementById('location').value)
      };

      results.push(result);
    }
  });

  // Trier par économie décroissante
  results.sort((a, b) => b.savings - a.savings);

  return results;
}

function estimateReferencePrice(query) {
  // Estimation grossière du prix neuf basée sur le type de produit
  const q = query.toLowerCase();

  if (q.includes('carrelage')) return Math.floor(Math.random() * 30) + 20;
  if (q.includes('peinture')) return Math.floor(Math.random() * 40) + 25;
  if (q.includes('perceuse') || q.includes('visseuse')) return Math.floor(Math.random() * 150) + 50;
  if (q.includes('parquet')) return Math.floor(Math.random() * 50) + 30;
  if (q.includes('robinet')) return Math.floor(Math.random() * 100) + 40;
  if (q.includes('meuble')) return Math.floor(Math.random() * 200) + 100;

  return Math.floor(Math.random() * 100) + 30;
}

function generateTitle(baseQuery, index) {
  const variations = [
    `${baseQuery} - Excellent état`,
    `${baseQuery} - Jamais utilisé`,
    `${baseQuery} - Reste de chantier`,
    `${baseQuery} - Surplus travaux`,
    `${baseQuery} - Comme neuf`,
    `${baseQuery} - À saisir`,
    `Lot ${baseQuery}`,
    `${baseQuery} - Prix négociable`
  ];

  return variations[index % variations.length];
}

function generateLocation() {
  const locations = [
    'Paris 11e', 'Montreuil', 'Vincennes', 'Créteil',
    'Boulogne', 'Nanterre', 'Saint-Denis', 'Ivry',
    'Versailles', 'Argenteuil', 'Vitry', 'Aubervilliers'
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

function generateDate() {
  const days = Math.floor(Math.random() * 14);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Hier';
  return `Il y a ${days} jours`;
}

function generateImagePlaceholder(query) {
  // En production, on aurait les vraies images des annonces
  const colors = ['10b981', 'f59e0b', '3b82f6', 'ef4444', '8b5cf6'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const text = encodeURIComponent(query.substring(0, 10));
  return `https://via.placeholder.com/120x120/${color}/ffffff?text=${text}`;
}

function displayResults(results, query) {
  const resultsSection = document.getElementById('results-section');
  const resultsList = document.getElementById('results-list');
  const resultsCount = document.getElementById('results-count');
  const noResults = document.getElementById('no-results');

  resultsSection.style.display = 'block';

  if (results.length === 0) {
    resultsList.style.display = 'none';
    noResults.style.display = 'block';
    resultsCount.textContent = '0 annonces';
    return;
  }

  noResults.style.display = 'none';
  resultsList.style.display = 'flex';
  resultsCount.textContent = `${results.length} annonces`;

  resultsList.innerHTML = results.map(result => `
    <div class="result-card" data-url="${result.url}" onclick="openResult('${result.url}')">
      <img class="result-image" src="${result.image}" alt="${result.title}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%2310b981%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2212%22>Image</text></svg>'">
      <div class="result-info">
        <div class="result-title" title="${result.title}">${result.title}</div>
        <div class="result-meta">
          <span class="result-source ${result.source}">${SOURCES[result.source].name}</span>
          <span>${result.location}</span>
          <span>${result.date}</span>
        </div>
        <div class="result-prices">
          <span class="result-price">${result.price}€</span>
          <span class="result-savings">-${result.savings}%</span>
        </div>
      </div>
    </div>
  `).join('');

  // Ajouter un bouton pour ouvrir toutes les recherches
  const openAllBtn = document.createElement('button');
  openAllBtn.className = 'btn-open-all';
  openAllBtn.innerHTML = '&#128279; Ouvrir les recherches sur les sites';
  openAllBtn.style.cssText = `
    width: 100%;
    padding: 12px;
    margin-top: 12px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    font-weight: 500;
    font-size: 13px;
  `;
  openAllBtn.onclick = () => openAllSearches(query);
  resultsList.appendChild(openAllBtn);
}

// Fonction globale pour ouvrir un résultat
window.openResult = function(url) {
  chrome.tabs.create({ url: url });
};

function openAllSearches(query) {
  const sources = getSelectedSources();
  const location = document.getElementById('location').value;

  sources.forEach(source => {
    const url = SOURCES[source].buildUrl(query, location);
    chrome.tabs.create({ url: url, active: false });
  });
}
