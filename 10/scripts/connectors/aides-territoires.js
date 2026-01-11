/**
 * Connecteur Aides-territoires
 * Source: Fichier JSON public sur data.gouv.fr
 */

const BaseConnector = require('./base');

class AidesTerritoiresConnector extends BaseConnector {
  constructor() {
    super('aides-territoires', {
      url: 'https://aides-territoires-prod.s3.fr-par.scw.cloud/aides-territoires-prod/aids/all-aids.json',
      filterAssociations: true
    });

    // Mapping categories vers secteurs
    this.categoryMapping = {
      'culture': 'culture',
      'environnement': 'environnement',
      'nature-environnement': 'environnement',
      'developpement-durable': 'environnement',
      'eau-et-assainissement': 'environnement',
      'energie': 'environnement',
      'social': 'social',
      'solidarites': 'social',
      'cohesion-sociale': 'social',
      'education': 'education',
      'education-et-formation': 'education',
      'sante': 'sante',
      'sport': 'sport',
      'emploi': 'insertion',
      'insertion-professionnelle': 'insertion',
      'numerique': 'numerique',
      'urbanisme': 'autre',
      'mobilite': 'autre'
    };

    // Mapping audiences
    this.audienceMapping = {
      'association': 'Associations',
      'commune': 'Communes',
      'epci': 'EPCI',
      'department': 'Departements',
      'region': 'Regions',
      'public-org': 'Etablissements publics',
      'private-sector': 'Entreprises',
      'farmer': 'Agriculteurs'
    };
  }

  async fetch() {
    this.log('Fetching from data.gouv.fr JSON...');

    const response = await fetch(this.config.url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Le fichier peut etre un array ou un objet avec results
    let aids = Array.isArray(data) ? data : (data.results || data.aids || []);

    this.log(`Total aids in file: ${aids.length}`);

    // Filtrer pour les associations si demande
    if (this.config.filterAssociations) {
      aids = aids.filter(aid => this.isForAssociations(aid));
      this.log(`Aids for associations: ${aids.length}`);
    }

    // Filtrer les aides actives (non closes)
    const now = new Date().toISOString().split('T')[0];
    aids = aids.filter(aid => {
      if (!aid.submission_deadline) return true; // Permanent
      return aid.submission_deadline >= now;
    });
    this.log(`Active aids: ${aids.length}`);

    // Normaliser
    const normalized = aids.map(aid => this.normalize(aid)).filter(Boolean);
    this.stats.fetched = normalized.length;

    return normalized;
  }

  isForAssociations(aid) {
    const audiences = aid.targeted_audiences || [];
    return audiences.some(a => {
      const slug = typeof a === 'string' ? a : (a.slug || a.name || '');
      return slug.toLowerCase().includes('association');
    });
  }

  normalize(raw) {
    try {
      // Determiner le secteur
      let secteur = 'autre';
      if (raw.categories && raw.categories.length > 0) {
        const cat = raw.categories[0];
        const catSlug = typeof cat === 'string' ? cat : (cat.slug || '');
        secteur = this.categoryMapping[catSlug] || 'autre';
      }

      // Determiner le type de financeur
      let financeurType = 'etat';
      const financerName = (raw.financers && raw.financers[0]?.name) || '';
      if (financerName.toLowerCase().includes('region')) {
        financeurType = 'region';
      } else if (financerName.toLowerCase().includes('departement')) {
        financeurType = 'departement';
      } else if (financerName.toLowerCase().includes('europe') || financerName.toLowerCase().includes('ue')) {
        financeurType = 'europe';
      } else if (financerName.toLowerCase().includes('fondation')) {
        financeurType = 'fondation';
      }

      // Beneficiaires
      const beneficiaires = (raw.targeted_audiences || []).map(a => {
        const slug = typeof a === 'string' ? a : (a.slug || '');
        return this.audienceMapping[slug] || slug;
      }).filter(Boolean);

      // Territoires
      const territoires = [];
      if (raw.perimeter) {
        territoires.push(raw.perimeter.name || 'France');
      } else {
        territoires.push('National');
      }

      return this.createAAP({
        source_id: raw.id || raw.slug,
        titre: raw.name || raw.short_title || 'Sans titre',
        description: this.stripHtml(raw.description || '').substring(0, 500),
        description_complete: raw.description || '',
        financeur: financerName || 'Non precise',
        financeur_type: financeurType,
        secteur: secteur,
        montant_min: null,
        montant_max: null,
        subvention_rate: raw.subvention_rate || null,
        date_ouverture: raw.start_date || null,
        date_cloture: raw.submission_deadline || null,
        lien: raw.origin_url || raw.application_url || `https://aides-territoires.beta.gouv.fr/aides/${raw.slug}/`,
        lien_candidature: raw.application_url || null,
        territoires: territoires,
        beneficiaires: beneficiaires.length > 0 ? beneficiaires : ['Associations'],
        is_appel_projet: raw.is_call_for_project || false,
        contact: raw.contact || null,
        tags: (raw.categories || []).map(c => typeof c === 'string' ? c : c.name).filter(Boolean)
      });

    } catch (error) {
      this.error(`Failed to normalize aid: ${error.message}`);
      return null;
    }
  }
}

module.exports = AidesTerritoiresConnector;
