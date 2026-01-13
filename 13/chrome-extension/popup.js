// SecondMain - Popup Script

document.addEventListener('DOMContentLoaded', init);

function simplifyProductName(name) {
  const stopWords = ['le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'ou', 'pour', 'avec'];
  return name
    .toLowerCase()
    .replace(/[^\w\sàâäéèêëïîôùûüç-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
    .slice(0, 5)
    .join(' ');
}

async function init() {
  const loading = document.getElementById('loading');
  const productSection = document.getElementById('product-section');
  const noProduct = document.getElementById('no-product');
  const resultsSection = document.getElementById('results-section');
  const noResults = document.getElementById('no-results');

  try {
    // Récupérer l'onglet actif
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.id) {
      showNoProduct();
      return;
    }

    // Demander les infos produit au content script
    chrome.tabs.sendMessage(tab.id, { action: 'getProductInfo' }, async (response) => {
      loading.style.display = 'none';

      if (chrome.runtime.lastError || !response || !response.productName) {
        showNoProduct();
        return;
      }

      // Afficher les infos produit
      document.getElementById('product-name').textContent = response.productName;
      if (response.price) {
        document.getElementById('product-price').textContent = `Prix neuf : ${response.price.toFixed(2)}€`;
      }
      productSection.style.display = 'block';

      // Construire les URLs de recherche
      const searchQuery = simplifyProductName(response.productName);
      const encodedQuery = encodeURIComponent(searchQuery);

      document.getElementById('search-leboncoin').href =
        `https://www.leboncoin.fr/recherche?text=${encodedQuery}&locations=r_12`;
      document.getElementById('link-vinted').href =
        `https://www.vinted.fr/catalog?search_text=${encodedQuery}`;
      document.getElementById('link-facebook').href =
        `https://www.facebook.com/marketplace/search/?query=${encodedQuery}`;
      document.getElementById('link-ebay').href =
        `https://www.ebay.fr/sch/i.html?_nkw=${encodedQuery}&LH_PrefLoc=1`;
      document.getElementById('link-paruvendu').href =
        `https://www.paruvendu.fr/pa/recherche/?kw=${encodedQuery}`;

      // Vérifier s'il y a des résultats en cache
      const stored = await chrome.storage.local.get(['lastResults', 'lastProduct', 'lastSearch']);

      if (stored.lastResults &&
        stored.lastProduct &&
        stored.lastProduct.includes(searchQuery.split(' ')[0]) &&
        Date.now() - stored.lastSearch < 300000) { // Moins de 5 minutes

        displayResults(stored.lastResults, response.price);
      } else {
        noResults.style.display = 'block';
      }
    });

  } catch (error) {
    console.error('Erreur popup:', error);
    showNoProduct();
  }
}

function showNoProduct() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('no-product').style.display = 'block';
}

function displayResults(results, referencePrice) {
  if (!results || results.length === 0) {
    document.getElementById('no-results').style.display = 'block';
    return;
  }

  const resultsSection = document.getElementById('results-section');
  const resultsList = document.getElementById('results-list');
  const resultsCount = document.getElementById('results-count');

  resultsCount.textContent = results.length;
  document.getElementById('no-results').style.display = 'none';
  resultsSection.style.display = 'block';

  resultsList.innerHTML = results.map(r => `
    <div class="result-item">
      <span class="result-price">${r.price}€</span>
      ${r.savings ? `<span class="result-savings">-${r.savings}%</span>` : ''}
    </div>
  `).join('');
}
