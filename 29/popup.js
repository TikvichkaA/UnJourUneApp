/**
 * Traducteur Antifasciste - Popup Script
 */

document.addEventListener('DOMContentLoaded', async () => {
  const enableToggle = document.getElementById('enableToggle');
  const expressionCount = document.getElementById('expressionCount');
  const pageCount = document.getElementById('pageCount');
  const connectionDot = document.getElementById('connectionDot');
  const connectionText = document.getElementById('connectionText');

  // Charger l'état actuel
  chrome.storage.sync.get(['enabled'], (result) => {
    enableToggle.checked = result.enabled !== false;
  });

  // Sauvegarder les changements
  enableToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ enabled: enableToggle.checked });
  });

  // Vérifier la connexion et charger les stats
  try {
    const stats = await TranslationsAPI.getStats();

    expressionCount.textContent = stats.totalTranslations;

    if (stats.online) {
      connectionDot.classList.add('online');
      connectionText.textContent = 'Connecté au dictionnaire collaboratif';
    } else {
      connectionDot.classList.add('offline');
      connectionText.textContent = CONFIG.ONLINE_MODE
        ? 'Mode hors ligne (cache local)'
        : 'Mode local (Supabase non configuré)';
    }
  } catch (error) {
    expressionCount.textContent = TRANSLATIONS ? TRANSLATIONS.length : '--';
    connectionDot.classList.add('offline');
    connectionText.textContent = 'Mode local';
  }

  // Compter les annotations sur la page active
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'getCount' },
        (response) => {
          if (chrome.runtime.lastError) {
            pageCount.textContent = '-';
          } else if (response && typeof response.count === 'number') {
            pageCount.textContent = response.count;
          } else {
            pageCount.textContent = '0';
          }
        }
      );
    }
  });
});
