// ===== CONFIGURATION TS COMPAGNON =====

const CONFIG = {
    // Mode de données : 'demo' | 'supabase'
    // Passer à 'supabase' quand la connexion sera configurée
    dataMode: 'demo',

    // Configuration Supabase (à remplir avec les vraies valeurs)
    supabase: {
        url: '', // Ex: 'https://xxxxx.supabase.co'
        anonKey: '', // Clé publique anon
        // Tables utilisées
        tables: {
            femmesIsolees: 'femmes_isolees',
            familles: 'familles',
            ts: 'travailleurs_sociaux'
        }
    },

    // Options de synchronisation
    sync: {
        // Intervalle de sync en ms (5 min par défaut)
        interval: 5 * 60 * 1000,
        // Activer la sync automatique
        autoSync: false,
        // Dernière sync
        lastSync: null
    },

    // Version de l'app
    version: '1.0.0',

    // Debug mode
    debug: true
};

// Ne pas modifier ci-dessous - Chargement dynamique des credentials
// Les credentials seront chargés depuis .env.local ou localStorage
(function loadCredentials() {
    // Essayer de charger depuis localStorage (pour dev)
    const savedConfig = localStorage.getItem('ts_supabase_config');
    if (savedConfig) {
        try {
            const parsed = JSON.parse(savedConfig);
            if (parsed.url) CONFIG.supabase.url = parsed.url;
            if (parsed.anonKey) CONFIG.supabase.anonKey = parsed.anonKey;
            if (parsed.url && parsed.anonKey) {
                CONFIG.dataMode = 'supabase';
                console.log('[Config] Credentials Supabase chargés depuis localStorage');
            }
        } catch (e) {
            console.warn('[Config] Erreur parsing config:', e);
        }
    }
})();

// Fonction utilitaire pour configurer Supabase (utilisable depuis la console)
function configureSupabase(url, anonKey) {
    if (!url || !anonKey) {
        console.error('Usage: configureSupabase("https://xxx.supabase.co", "votre-anon-key")');
        return;
    }

    CONFIG.supabase.url = url;
    CONFIG.supabase.anonKey = anonKey;
    CONFIG.dataMode = 'supabase';

    localStorage.setItem('ts_supabase_config', JSON.stringify({ url, anonKey }));

    console.log('[Config] Supabase configuré. Rechargez la page pour appliquer.');
    return true;
}

// Fonction pour revenir en mode démo
function useDemo() {
    CONFIG.dataMode = 'demo';
    localStorage.removeItem('ts_supabase_config');
    console.log('[Config] Mode démo activé. Rechargez la page pour appliquer.');
}
