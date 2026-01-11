/**
 * Classe de base pour les connecteurs de sources AAP
 * Chaque source doit etendre cette classe
 */

class BaseConnector {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.lastSync = null;
    this.stats = { fetched: 0, errors: 0 };
  }

  /**
   * Recupere tous les AAP de cette source
   * @returns {Promise<Array>} Liste des AAP au format normalise
   */
  async fetch() {
    throw new Error(`fetch() must be implemented by ${this.name}`);
  }

  /**
   * Normalise un AAP vers le format standard
   * @param {Object} raw - Donnees brutes de la source
   * @returns {Object} AAP normalise
   */
  normalize(raw) {
    throw new Error(`normalize() must be implemented by ${this.name}`);
  }

  /**
   * Format standard d'un AAP
   */
  static get SCHEMA() {
    return {
      id: null,              // String unique (ex: "at-123", "fdf-456")
      source: null,          // String identifiant la source
      source_id: null,       // ID original dans la source
      titre: null,           // String
      description: null,     // String (texte court)
      description_complete: null, // String (HTML ou texte long)
      financeur: null,       // String
      financeur_type: null,  // enum: etat, region, departement, commune, europe, fondation, autre
      secteur: null,         // enum: culture, environnement, social, education, sante, sport, insertion, numerique, autre
      montant_min: null,     // Number ou null
      montant_max: null,     // Number ou null
      subvention_rate: null, // String (ex: "80%")
      date_ouverture: null,  // Date ISO ou null
      date_cloture: null,    // Date ISO ou null
      lien: null,            // URL
      lien_candidature: null,// URL ou null
      territoires: [],       // Array de strings
      beneficiaires: [],     // Array de strings
      is_appel_projet: false,// Boolean
      contact: null,         // String ou null
      tags: [],              // Array de strings (mots-cles)
      raw_data: null         // Object original pour debug
    };
  }

  /**
   * Helper pour creer un AAP normalise
   */
  createAAP(data) {
    return {
      ...BaseConnector.SCHEMA,
      ...data,
      id: `${this.name}-${data.source_id}`,
      source: this.name,
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Mapping des secteurs (a surcharger si besoin)
   */
  static SECTEUR_MAPPING = {
    'culture': 'culture',
    'environnement': 'environnement',
    'social': 'social',
    'education': 'education',
    'sante': 'sante',
    'sport': 'sport',
    'insertion': 'insertion',
    'numerique': 'numerique'
  };

  /**
   * Helper pour determiner le secteur
   */
  mapSecteur(value) {
    if (!value) return 'autre';
    const normalized = value.toLowerCase().trim();
    return BaseConnector.SECTEUR_MAPPING[normalized] || 'autre';
  }

  /**
   * Helper pour nettoyer le HTML
   */
  stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Log helper
   */
  log(message) {
    console.log(`[${this.name}] ${message}`);
  }

  error(message) {
    console.error(`[${this.name}] ERROR: ${message}`);
    this.stats.errors++;
  }
}

module.exports = BaseConnector;
