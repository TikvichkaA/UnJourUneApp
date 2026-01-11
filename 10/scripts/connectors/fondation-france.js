/**
 * Connecteur Fondation de France
 * Source: Scraping du site web (pas d'API publique)
 *
 * NOTE: Ce connecteur necessite un travail de scraping.
 * Pour l'instant, il retourne des donnees de demo.
 * TODO: Implementer le scraping avec puppeteer/cheerio
 */

const BaseConnector = require('./base');

class FondationFranceConnector extends BaseConnector {
  constructor() {
    super('fondation-france', {
      baseUrl: 'https://www.fondationdefrance.org',
      searchUrl: 'https://www.fondationdefrance.org/fr/chercher-un-financement'
    });
  }

  async fetch() {
    this.log('Fetching from Fondation de France...');
    this.log('NOTE: Scraping not implemented yet, returning demo data');

    // TODO: Implementer le scraping
    // Options:
    // 1. puppeteer pour naviguer le site JS
    // 2. cheerio si le HTML est statique
    // 3. API interne si on la trouve

    const demoData = this.getDemoData();
    this.stats.fetched = demoData.length;

    return demoData;
  }

  normalize(raw) {
    return this.createAAP({
      source_id: raw.id,
      titre: raw.titre,
      description: raw.description,
      description_complete: raw.description,
      financeur: 'Fondation de France',
      financeur_type: 'fondation',
      secteur: raw.secteur || 'autre',
      montant_min: raw.montant_min,
      montant_max: raw.montant_max,
      date_ouverture: raw.date_ouverture,
      date_cloture: raw.date_cloture,
      lien: raw.lien,
      territoires: ['National'],
      beneficiaires: ['Associations', 'Fondations'],
      is_appel_projet: true,
      tags: raw.tags || []
    });
  }

  getDemoData() {
    // Donnees de demo basees sur des appels reels de la FdF
    const demos = [
      {
        id: 'fdf-enviro-2025',
        titre: 'Appel a projets Environnement 2025',
        description: 'Soutien aux initiatives locales en faveur de la biodiversite et de la transition ecologique.',
        secteur: 'environnement',
        montant_min: 5000,
        montant_max: 30000,
        date_cloture: '2025-09-30',
        lien: 'https://www.fondationdefrance.org/fr/environnement'
      },
      {
        id: 'fdf-solidarite-2025',
        titre: 'Agir contre l\'exclusion',
        description: 'Appel a projets pour lutter contre toutes les formes d\'exclusion et favoriser le lien social.',
        secteur: 'social',
        montant_min: 3000,
        montant_max: 20000,
        date_cloture: '2025-06-30',
        lien: 'https://www.fondationdefrance.org/fr/solidarites'
      },
      {
        id: 'fdf-culture-2025',
        titre: 'Acces a la culture pour tous',
        description: 'Soutien aux projets favorisant l\'acces a la culture des publics eloignes.',
        secteur: 'culture',
        montant_min: 2000,
        montant_max: 15000,
        date_cloture: null, // Permanent
        lien: 'https://www.fondationdefrance.org/fr/culture'
      }
    ];

    return demos.map(d => this.normalize(d));
  }
}

module.exports = FondationFranceConnector;
