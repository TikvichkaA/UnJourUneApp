// ============================================
// I18N.JS - Internationalisation
// ============================================

const I18N = {
  // Langue courante
  currentLang: 'fr',

  // Traductions
  translations: {
    fr: {
      // Header
      title: "Shu le Chien qui Aboie",
      subtitle: "Petit chien, GRANDE voix ?",

      // Shu section
      shuAlt: "Shu le petit chien blanc",
      shuName: "Shu",
      shuDescription: "Petit chien blanc, grande personnalite",

      // Button
      barkButtonLabel: "Faire aboyer Shu le chien",
      barkButtonText: "Faire Aboyer Shu !",
      barkButtonAgain: "Encore !",

      // Stats
      statBarks: "Aboiements",
      statWins: "Victoires",
      statRate: "Taux",

      // Credits
      credits: "Fait avec ❤️ pour Shu",

      // Results
      victory: "Victoire",
      defeat: "Defaite",
      draw: "Egalite"
    },
    en: {
      // Header
      title: "Shu the Barking Dog",
      subtitle: "Small dog, BIG voice?",

      // Shu section
      shuAlt: "Shu the little white dog",
      shuName: "Shu",
      shuDescription: "Little white dog, big personality",

      // Button
      barkButtonLabel: "Make Shu the dog bark",
      barkButtonText: "Make Shu Bark!",
      barkButtonAgain: "Again!",

      // Stats
      statBarks: "Barks",
      statWins: "Wins",
      statRate: "Rate",

      // Credits
      credits: "Made with ❤️ for Shu",

      // Results
      victory: "Victory",
      defeat: "Defeat",
      draw: "Draw"
    }
  },

  // Detecter la langue du navigateur
  detectLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    // Si la langue commence par 'fr', utiliser le francais, sinon anglais
    return browserLang.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  },

  // Initialiser
  init() {
    this.currentLang = this.detectLanguage();
    this.applyTranslations();
    // Mettre a jour l'attribut lang du HTML
    document.documentElement.lang = this.currentLang;
  },

  // Obtenir une traduction
  t(key) {
    return this.translations[this.currentLang][key] || this.translations['fr'][key] || key;
  },

  // Appliquer les traductions aux elements avec data-i18n
  applyTranslations() {
    // Titre de la page
    document.title = this.t('title') + ' !';

    // Elements avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });

    // Elements avec data-i18n-alt (pour les images)
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      el.alt = this.t(key);
    });

    // Elements avec data-i18n-label (pour aria-label)
    document.querySelectorAll('[data-i18n-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-label');
      el.setAttribute('aria-label', this.t(key));
    });

    // Elements avec data-i18n-html (pour innerHTML avec entites HTML)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = this.t(key);
    });
  }
};

// Initialiser quand le DOM est pret
document.addEventListener('DOMContentLoaded', () => {
  I18N.init();
});
