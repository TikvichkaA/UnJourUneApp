// SecondMain - Service Worker (Background Script)
// Gère les événements en arrière-plan

// Écouter les messages du content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openSearch') {
    // Stocker les infos du produit pour le popup
    chrome.storage.local.set({
      pendingSearch: {
        productName: request.productName,
        price: request.price,
        timestamp: Date.now()
      }
    });

    // Ouvrir le popup n'est pas possible directement depuis le background
    // On pourrait ouvrir une nouvelle fenêtre à la place
    // Mais le mieux est que l'utilisateur clique sur l'icône de l'extension
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
      sources: ['leboncoin', 'vinted']
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
