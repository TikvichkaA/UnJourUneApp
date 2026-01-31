/**
 * Configuration Supabase
 *
 * INSTRUCTIONS :
 * 1. Créer un projet sur https://supabase.com
 * 2. Exécuter le script supabase/schema.sql dans l'éditeur SQL
 * 3. Copier l'URL et la clé anon depuis Settings > API
 * 4. Remplacer les valeurs ci-dessous
 */

const CONFIG = {
  // URL de votre projet Supabase (Settings > API > Project URL)
  SUPABASE_URL: 'https://hwunkojdzodcutewkfet.supabase.co',

  // Clé publique anon (Settings > API > anon public)
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dW5rb2pkem9kY3V0ZXdrZmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTMzNTAsImV4cCI6MjA4Mzk2OTM1MH0.Zpe-QqzKDIpx3pTa6_e9ysfI-Rprl3SXANM8b2pqXU0',

  // Activer le mode en ligne (false = utilise le dictionnaire local)
  ONLINE_MODE: true,

  // Durée du cache local (en millisecondes) - 1 heure par défaut
  CACHE_DURATION: 60 * 60 * 1000,

  // Catégories disponibles
  CATEGORIES: [
    { id: 'immigration', label: 'Immigration' },
    { id: 'ordre', label: 'Ordre & Répression' },
    { id: 'tradition', label: 'Valeurs & Tradition' },
    { id: 'economie', label: 'Économie & Social' },
    { id: 'medias', label: 'Médias & Démocratie' },
    { id: 'nationalisme', label: 'Nationalisme' },
    { id: 'general', label: 'Général' }
  ]
};

// Ne pas modifier ci-dessous
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
