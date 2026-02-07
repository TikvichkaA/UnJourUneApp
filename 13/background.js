// SecondMain - Service Worker (Background Script)
// Gère les événements en arrière-plan

// Configuration des sources de recherche
const SOURCES = {
  leboncoin: (query) => `https://www.leboncoin.fr/recherche?text=${encodeURIComponent(query)}`,
  vinted: (query) => `https://www.vinted.fr/catalog?search_text=${encodeURIComponent(query)}`,
  facebook: (query) => `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(query)}`,
  paruvendu: (query) => `https://www.paruvendu.fr/pa/recherche/?kw=${encodeURIComponent(query)}`,
  envie: (query) => `https://www.envie.org/acheter/?s=${encodeURIComponent(query)}`,
  emmaus: (query) => `https://www.label-emmaus.co/fr/recherche/?q=${encodeURIComponent(query)}`
};

// Écouter les messages du content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openSearch') {
    // Récupérer les sources sélectionnées et ouvrir les recherches
    chrome.storage.local.get(['sources'], (prefs) => {
      const selectedSources = prefs.sources || ['leboncoin', 'vinted', 'envie', 'emmaus'];
      const query = request.productName;

      // Ouvrir un onglet pour chaque source sélectionnée
      selectedSources.forEach(source => {
        if (SOURCES[source]) {
          chrome.tabs.create({
            url: SOURCES[source](query),
            active: false
          });
        }
      });
    });
  }
});

// À l'installation de l'extension
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Initialiser les préférences par défaut
    chrome.storage.local.set({
      location: 'idf',
      radius: '30',
      minSavings: '20',
      sources: ['leboncoin', 'vinted', 'envie', 'emmaus']
    });

    // Optionnel : ouvrir une page de bienvenue
    // chrome.tabs.create({ url: 'welcome.html' });
  }
});

// Optionnel : Afficher un badge sur l'icône quand on est sur un site supporté
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const supportedSites = [
      'leroymerlin.fr',
      'castorama.fr',
      'ikea.com',
      'amazon.fr',
      'cdiscount.com',
      'fnac.com',
      'darty.com',
      'boulanger.com',
      'bricomarche.com'
    ];

    const isSupported = supportedSites.some(site => tab.url.includes(site));

    if (isSupported) {
      chrome.action.setBadgeText({ text: '!', tabId: tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#10b981', tabId: tabId });
    } else {
      chrome.action.setBadgeText({ text: '', tabId: tabId });
    }
  }
});
