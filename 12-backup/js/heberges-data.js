/**
 * Données des hébergés - CHU Babinski
 * Fichier séparé pour éviter les conflits avec le code applicatif
 */

// Re-exporter les données depuis heberges.js si elles existent déjà,
// sinon ce fichier sera chargé avant heberges.js dans finances.html
if (typeof FEMMES_ISOLEES === 'undefined') {
    // Les données seront chargées par heberges.js
    console.log('heberges-data.js: En attente du chargement des données depuis heberges.js');
}
