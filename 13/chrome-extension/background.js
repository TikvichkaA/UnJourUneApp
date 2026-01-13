// SecondMain - Background Service Worker
// Recherche en arrière-plan sur Le Bon Coin

// Configuration
const LEBONCOIN_SEARCH_URL = 'https://www.leboncoin.fr/recherche';
const MIN_SAVINGS_PERCENT = 20; // Économie minimum pour notifier

// Écouter les messages du content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'searchSecondHand') {
    searchAndNotify(request.productName, request.price, sender.tab.id);
    sendResponse({ status: 'searching' });
  }
  if (request.action === 'getProductInfo') {
    sendResponse({ status: 'ok' });
  }
  return true;
});

// Recherche sur Le Bon Coin et notifie si résultats intéressants
async function searchAndNotify(productName, referencePrice, tabId) {
  try {
    // Simplifier le nom du produit pour la recherche
    const searchQuery = simplifyProductName(productName);

    // Construire l'URL de recherche Le Bon Coin
    const searchUrl = `${LEBONCOIN_SEARCH_URL}?text=${encodeURIComponent(searchQuery)}&locations=r_12`;

    // Faire la requête
    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
      }
    });

    if (!response.ok) {
      console.log('SecondMain: Erreur recherche', response.status);
      return;
    }

    const html = await response.text();

    // Parser les résultats
    const results = parseLesBonCoinResults(html, referencePrice);

    if (results.length > 0) {
      // Stocker les résultats pour le popup
      await chrome.storage.local.set({
        lastResults: results,
        lastProduct: productName,
        lastPrice: referencePrice,
        lastSearch: Date.now(),
        tabId: tabId
      });

      // Afficher une notification
      showNotification(productName, results, tabId);

      // Mettre à jour le badge
      chrome.action.setBadgeText({ text: String(results.length), tabId: tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#10b981', tabId: tabId });
    }

  } catch (error) {
    console.log('SecondMain: Erreur', error.message);
  }
}

// Simplifier le nom du produit pour une meilleure recherche
function simplifyProductName(name) {
  // Retirer les mots inutiles et garder les mots clés
  const stopWords = ['le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'ou', 'pour', 'avec', 'sans', 'dans'];

  let simplified = name
    .toLowerCase()
    .replace(/[^\w\sàâäéèêëïîôùûüç-]/g, ' ') // Garder lettres, chiffres, accents
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
    .slice(0, 5) // Garder les 5 premiers mots significatifs
    .join(' ');

  return simplified;
}

// Parser les résultats de Le Bon Coin depuis le HTML
function parseLesBonCoinResults(html, referencePrice) {
  const results = [];

  // Chercher les prix dans le HTML (pattern simplifié)
  // Le Bon Coin utilise des data attributes et du JSON dans la page

  // Méthode 1: Chercher les prix dans les balises
  const priceMatches = html.matchAll(/(\d{1,4})\s*€/g);
  const prices = [];

  for (const match of priceMatches) {
    const price = parseInt(match[1]);
    if (price > 5 && price < 10000) { // Prix réalistes
      prices.push(price);
    }
  }

  // Méthode 2: Chercher dans le JSON embarqué
  const jsonMatch = html.match(/"ads":\s*\[([\s\S]*?)\]/);
  if (jsonMatch) {
    try {
      // Essayer de parser les annonces
      const adsText = '[' + jsonMatch[1] + ']';
      // Parser prudemment car le JSON peut être malformé
    } catch (e) {
      // Ignorer les erreurs de parsing
    }
  }

  // Si on a un prix de référence, filtrer les bonnes affaires
  if (referencePrice && prices.length > 0) {
    const validPrices = prices.filter(p => {
      const savings = ((referencePrice - p) / referencePrice) * 100;
      return savings >= MIN_SAVINGS_PERCENT && p < referencePrice;
    });

    // Créer des résultats simulés basés sur les prix trouvés
    const uniquePrices = [...new Set(validPrices)].sort((a, b) => a - b).slice(0, 5);

    uniquePrices.forEach((price, i) => {
      const savings = Math.round(((referencePrice - price) / referencePrice) * 100);
      results.push({
        price: price,
        savings: savings,
        source: 'leboncoin',
        title: `Annonce ${i + 1}`,
        url: `https://www.leboncoin.fr/recherche?text=${encodeURIComponent(simplifyProductName(''))}`
      });
    });
  } else if (prices.length > 0) {
    // Sans prix de référence, juste indiquer qu'il y a des résultats
    results.push({
      price: Math.min(...prices),
      savings: null,
      source: 'leboncoin',
      title: `${prices.length} annonces trouvées`,
      url: LEBONCOIN_SEARCH_URL
    });
  }

  return results;
}

// Afficher une notification système
function showNotification(productName, results, tabId) {
  const bestResult = results[0];
  const savingsText = bestResult.savings
    ? `Économie de ${bestResult.savings}% possible !`
    : `${results.length} annonces trouvées`;

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: '♻️ SecondMain - Bonne affaire !',
    message: `${productName.substring(0, 50)}...\n${savingsText}\nÀ partir de ${bestResult.price}€`,
    priority: 2,
    buttons: [
      { title: 'Voir les annonces' }
    ]
  }, (notificationId) => {
    // Stocker l'association notification -> tab
    chrome.storage.local.set({ [`notif_${notificationId}`]: tabId });
  });
}

// Gérer le clic sur la notification
chrome.notifications.onClicked.addListener((notificationId) => {
  // Ouvrir Le Bon Coin avec la dernière recherche
  chrome.storage.local.get(['lastProduct'], (data) => {
    if (data.lastProduct) {
      const searchQuery = simplifyProductName(data.lastProduct);
      const url = `https://www.leboncoin.fr/recherche?text=${encodeURIComponent(searchQuery)}&locations=r_12`;
      chrome.tabs.create({ url: url });
    }
  });
  chrome.notifications.clear(notificationId);
});

// Gérer le clic sur les boutons de notification
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    chrome.storage.local.get(['lastProduct'], (data) => {
      if (data.lastProduct) {
        const searchQuery = simplifyProductName(data.lastProduct);
        const url = `https://www.leboncoin.fr/recherche?text=${encodeURIComponent(searchQuery)}&locations=r_12`;
        chrome.tabs.create({ url: url });
      }
    });
  }
  chrome.notifications.clear(notificationId);
});

// Nettoyer le badge quand on change d'onglet
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.action.setBadgeText({ text: '', tabId: activeInfo.tabId });
});
