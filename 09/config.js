// Configuration de l'application
// Mode: 'local' (données simulées) ou 'supabase' (base de données)

const CONFIG = {
    // Changer à 'supabase' une fois le projet configuré
    mode: 'supabase',

    // Configuration Supabase
    supabase: {
        url: 'https://xumftpwenxrseczpwvng.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bWZ0cHdlbnhyc2VjenB3dm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMjgyNzIsImV4cCI6MjA4MzcwNDI3Mn0.rF4nqRgCOXnq_tEMm1vm_jKRSRGBJ5F98Vd5R9myxRU'
    }
};

// Ne pas modifier ci-dessous
const USE_SUPABASE = CONFIG.mode === 'supabase';
