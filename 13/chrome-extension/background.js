// SecondMain - Background Service Worker
// Recherche sur Le Bon Coin et Vinted, notifie si des résultats sont trouvés

console.log('SecondMain: Service Worker démarré');

// Sources de recherche
const SOURCES = {
  LEBONCOIN: 'leboncoin',
  VINTED: 'vinted'
};

// Écouter les messages du content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('SecondMain: Message reçu', request.action);

  if (request.action === 'searchSecondHand') {
    console.log('SecondMain: Produit détecté -', request.productName);
    console.log('SecondMain: Localisation utilisateur -', request.location);
    searchAllSources(request.productName, request.price, sender.tab.id, request.location);
    sendResponse({ status: 'searching' });
  }
  if (request.action === 'getProductInfo') {
    sendResponse({ status: 'ok' });
  }
  return true;
});

// Calculer la distance entre deux points (formule Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

// Rechercher sur toutes les sources en parallèle
async function searchAllSources(productName, referencePrice, tabId, userLocation) {
  console.log('SecondMain: Recherche sur toutes les sources...');

  const searchQuery = simplifyProductName(productName);
  const searchWords = searchQuery.toLowerCase().split(' ').filter(w => w.length > 2);

  // Lancer les recherches en parallèle
  const [lbcResults, vintedResults] = await Promise.all([
    searchLeBonCoin(searchQuery, searchWords, userLocation),
    searchVinted(searchQuery, searchWords)
  ]);

  // Combiner les résultats
  let allResults = [...lbcResults, ...vintedResults];

  // Trier par distance si disponible, sinon mélanger les sources
  if (userLocation) {
    allResults = allResults.sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
  }

  // Limiter à 5 résultats
  allResults = allResults.slice(0, 5);

  console.log('SecondMain: Résultats combinés:', allResults.length);

  if (allResults.length > 0) {
    // Stocker les résultats
    await chrome.storage.local.set({
      lastProduct: productName,
      lastPrice: referencePrice,
      lastSearch: Date.now(),
      searchQuery: searchQuery,
      results: allResults,
      tabId: tabId
    });

    // Notifier le content script des résultats
    chrome.tabs.sendMessage(tabId, {
      action: 'resultsFound',
      results: allResults,
      count: allResults.length
    });

    // Mettre à jour le badge
    chrome.action.setBadgeText({ text: String(allResults.length), tabId: tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444', tabId: tabId });

    console.log('SecondMain: Résultats envoyés');
  } else {
    console.log('SecondMain: Aucun résultat trouvé');
    chrome.tabs.sendMessage(tabId, { action: 'noResults' });
  }
}

// Rechercher sur Vinted
async function searchVinted(searchQuery, searchWords) {
  console.log('SecondMain: Recherche Vinted...');
  try {
    const response = await fetch(`https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=10&search_text=${encodeURIComponent(searchQuery)}&order=relevance`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.log('SecondMain: Erreur API Vinted', response.status);
      return [];
    }

    const data = await response.json();
    const items = data.items || [];

    console.log('SecondMain: Vinted - annonces brutes:', items.length);

    // Filtrer les résultats pertinents
    const relevantItems = items.filter(item => {
      const title = (item.title || '').toLowerCase();
      const matchingWords = searchWords.filter(word => title.includes(word));
      return matchingWords.length >= 2;
    });

    console.log('SecondMain: Vinted - annonces pertinentes:', relevantItems.length);

    // Formater les résultats
    return relevantItems.slice(0, 3).map(item => ({
      title: item.title || 'Sans titre',
      price: item.price ? parseFloat(item.price) : null,
      url: item.url ? `https://www.vinted.fr${item.url}` : `https://www.vinted.fr/items/${item.id}`,
      image: item.photo?.url || null,
      location: item.user?.city || null,
      distance: null,
      source: SOURCES.VINTED
    }));

  } catch (error) {
    console.log('SecondMain: Erreur Vinted', error.message);
    return [];
  }
}

// Rechercher sur Le Bon Coin via leur API
async function searchLeBonCoin(searchQuery, searchWords, userLocation) {
  console.log('SecondMain: Recherche Le Bon Coin...');
  try {
    // Construire les filtres avec localisation si disponible
    const filters = {
      keywords: {
        text: searchQuery
      }
    };

    // Ajouter la localisation si disponible (rayon de 50km)
    if (userLocation && userLocation.lat && userLocation.lng) {
      filters.location = {
        area: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          radius: 50000 // 50km en mètres
        }
      };
      console.log('SecondMain: LBC - Recherche avec localisation, rayon 50km');
    }

    // Appel à l'API Le Bon Coin avec le bon format
    const response = await fetch('https://api.leboncoin.fr/finder/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        limit: 20,
        filters: filters,
        sort_by: userLocation ? 'distance' : 'relevance',
        sort_order: 'asc'
      })
    });

    if (!response.ok) {
      console.log('SecondMain: Erreur API LBC', response.status);
      return [];
    }

    const data = await response.json();
    console.log('SecondMain: LBC - Réponse API, total:', data.total);

    const ads = data.ads || [];
    console.log('SecondMain: LBC - annonces brutes:', ads.length);

    // Filtrer les résultats pertinents (au moins 2 mots en commun)
    const relevantAds = ads.filter(ad => {
      const title = (ad.subject || '').toLowerCase();
      const matchingWords = searchWords.filter(word => title.includes(word));
      return matchingWords.length >= 2;
    });

    console.log('SecondMain: LBC - annonces pertinentes:', relevantAds.length);

    // Extraire les infos des annonces pertinentes avec distance
    return relevantAds.slice(0, 3).map(ad => {
      const adLat = ad.location?.lat;
      const adLng = ad.location?.lng;
      let distance = null;

      // Calculer la distance si on a les deux positions
      if (userLocation && userLocation.lat && adLat && adLng) {
        distance = calculateDistance(userLocation.lat, userLocation.lng, adLat, adLng);
      }

      return {
        title: ad.subject || 'Sans titre',
        price: ad.price?.[0] || null,
        url: ad.url || `https://www.leboncoin.fr/ad/${ad.list_id}`,
        image: ad.images?.thumb_url || null,
        location: ad.location?.city || ad.location?.department_name || null,
        distance: distance,
        source: SOURCES.LEBONCOIN
      };
    });

  } catch (error) {
    console.log('SecondMain: Erreur LBC', error.message);
    return [];
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

// Nettoyer le badge quand on change d'onglet
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.action.setBadgeText({ text: '', tabId: activeInfo.tabId });
});
