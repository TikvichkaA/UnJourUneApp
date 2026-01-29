// ============================================
// CONFIGURATION BETA-TRAJ
// Modifier ces valeurs selon votre environnement
// ============================================

const CONFIG = {
    // === AUTHENTIFICATION ===
    // Mot de passe pour accéder à l'application
    SITE_PASSWORD: 'VilleDeParis2025!',

    // === EMAIL (pour l'envoi des modifications) ===
    // Adresse email destinataire des modifications
    EMAIL_DESTINATAIRE: 'em.pinglier@gmail.com',

    // Sujet de l'email
    EMAIL_SUJET: 'modifications code Trajectoire',

    // Mode d'envoi: 'api' (Netlify/Resend) ou 'download' (téléchargement fichier)
    EMAIL_MODE: 'api',

    // URL de l'API d'envoi (si mode 'api')
    // - Netlify: '/.netlify/functions/send-email'
    // - Serveur custom: '/api/send-email'
    EMAIL_API_URL: '/.netlify/functions/send-email',

    // === DISPLAY ===
    // Nom de l'application affiché
    APP_TITLE: 'beta-traj',
    APP_SUBTITLE: 'Trajectoire Climatique de Paris',

    // === VERSION ===
    VERSION: '2.0',
    BUILD_DATE: '2025-01-28'
};

// Ne pas modifier ci-dessous
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
