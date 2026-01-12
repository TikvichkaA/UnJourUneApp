/**
 * Connecteur Region Ile-de-France
 * Source: API Open Data Ile-de-France
 * https://data.iledefrance.fr/
 */

const BaseConnector = require('./base');

class RegionIdfConnector extends BaseConnector {
  constructor() {
    super('region-idf', {
      baseUrl: 'https://data.iledefrance.fr',
      apiUrl: 'https://data.iledefrance.fr/api/explore/v2.1/catalog/datasets/aides-appels-a-projets/records',
      siteUrl: 'https://www.iledefrance.fr/aides-et-appels-a-projets'
    });

    // Mapping des themes IDF vers nos secteurs
    this.themeMapping = {
      'culture': 'culture',
      'patrimoine': 'culture',
      'environnement': 'environnement',
      'transition ecologique': 'environnement',
      'energie': 'environnement',
      'biodiversite': 'environnement',
      'social': 'social',
      'solidarite': 'social',
      'sante': 'sante',
      'education': 'education',
      'formation': 'education',
      'apprentissage': 'education',
      'lycees': 'education',
      'sport': 'sport',
      'emploi': 'insertion',
      'insertion': 'insertion',
      'economie': 'autre',
      'numerique': 'numerique',
      'innovation': 'numerique',
      'mobilite': 'autre',
      'transport': 'autre',
      'amenagement': 'autre',
      'logement': 'autre'
    };
  }

  async fetch() {
    this.log('Fetching from Region Ile-de-France Open Data...');

    const allRecords = [];
    let offset = 0;
    const limit = 100;

    // Paginer pour recuperer tous les records
    while (true) {
      const url = `${this.config.apiUrl}?limit=${limit}&offset=${offset}`;
      this.log(`Fetching page offset=${offset}...`);

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const records = data.results || [];

      if (records.length === 0) break;

      allRecords.push(...records);
      offset += limit;

      // Securite: max 1000 records
      if (offset >= 1000) break;
    }

    this.log(`Total records fetched: ${allRecords.length}`);

    // Filtrer les aides actives (non closes)
    const now = new Date();
    const activeRecords = allRecords.filter(record => {
      // Si pas de date de cloture, c'est permanent
      if (!record.date_cloture) return true;
      return new Date(record.date_cloture) >= now;
    });

    this.log(`Active aids: ${activeRecords.length}`);

    // Normaliser
    const normalized = activeRecords.map(record => this.normalize(record)).filter(Boolean);
    this.stats.fetched = normalized.length;

    return normalized;
  }

  normalize(raw) {
    try {
      // Determiner le secteur depuis le theme (theme est un array)
      let secteur = 'autre';
      const themes = Array.isArray(raw.theme) ? raw.theme : (raw.theme ? [raw.theme] : []);
      const themeText = themes.join(' ').toLowerCase();
      for (const [keyword, sec] of Object.entries(this.themeMapping)) {
        if (themeText.includes(keyword)) {
          secteur = sec;
          break;
        }
      }

      // Extraire les montants du champ modalite
      const montantInfo = this.extractMontant(raw.modalite || '');

      // Beneficiaires
      const beneficiaires = this.extractBeneficiaires(raw);

      // URL de l'aide
      const lien = raw.reference_administrative
        ? `${this.config.siteUrl}/${raw.reference_administrative}`
        : `${this.config.siteUrl}/${raw.id_aide}`;

      // Description nettoyee
      const description = this.stripHtml(raw.chapo_txt || raw.objectif || '');

      // Tags depuis les mots-cles (mots_cles est un array)
      const rawTags = Array.isArray(raw.mots_cles) ? raw.mots_cles : [];
      const tags = rawTags.map(t => String(t).trim()).filter(Boolean);

      return this.createAAP({
        source_id: raw.id_aide || raw.reference_administrative,
        titre: raw.nom || 'Sans titre',
        description: description.substring(0, 500),
        description_complete: this.stripHtml(raw.objectif || '') + '\n\n' + this.stripHtml(raw.modalite || ''),
        financeur: 'Region Ile-de-France',
        financeur_type: 'region',
        secteur: secteur,
        montant_min: montantInfo.min,
        montant_max: montantInfo.max,
        subvention_rate: montantInfo.rate,
        date_ouverture: raw.date_ouverture || null,
        date_cloture: raw.date_cloture || null,
        lien: lien,
        lien_candidature: raw.lien_demarche || null,
        territoires: ['Ile-de-France'],
        beneficiaires: beneficiaires,
        is_appel_projet: this.isAppelProjet(raw),
        contact: raw.contact || null,
        tags: tags
      });

    } catch (error) {
      this.error(`Failed to normalize aid ${raw.id_aide}: ${error.message}`);
      return null;
    }
  }

  extractMontant(text) {
    const result = { min: null, max: null, rate: null };
    if (!text) return result;

    // Chercher le taux de financement
    const rateMatch = text.match(/(\d{1,3})\s*%\s*(?:maximum|max)?/i);
    if (rateMatch) {
      result.rate = `${rateMatch[1]}%`;
    }

    // Chercher montant max
    const maxMatch = text.match(/(?:jusqu.{0,3}[aà]|maximum|max\.?|plafond|plafonn[ée])\s*[:\s]*(\d[\d\s.,]*)\s*(?:€|euros?)/i);
    if (maxMatch) {
      result.max = this.parseAmount(maxMatch[1]);
    }

    // Chercher montant simple
    if (!result.max) {
      const amountMatch = text.match(/(\d[\d\s.,]*)\s*(?:€|euros?)/i);
      if (amountMatch) {
        result.max = this.parseAmount(amountMatch[1]);
      }
    }

    return result;
  }

  parseAmount(str) {
    // Nettoyer: "350.000" ou "350 000" ou "350,000" -> 350000
    const cleaned = str.replace(/[\s.,]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? null : num;
  }

  extractBeneficiaires(raw) {
    const beneficiaires = [];
    const text = (raw.qui_peut_en_beneficier || '') + ' ' + (raw.id_publics || '');
    const textLower = text.toLowerCase();

    if (textLower.includes('association')) beneficiaires.push('Associations');
    if (textLower.includes('commune') || textLower.includes('collectivit')) beneficiaires.push('Communes');
    if (textLower.includes('entreprise') || textLower.includes('pme') || textLower.includes('tpe')) beneficiaires.push('Entreprises');
    if (textLower.includes('particulier') || textLower.includes('citoyen')) beneficiaires.push('Particuliers');
    if (textLower.includes('etablissement') || textLower.includes('lycee') || textLower.includes('college')) beneficiaires.push('Etablissements');

    return beneficiaires.length > 0 ? beneficiaires : ['Non precise'];
  }

  isAppelProjet(raw) {
    const nom = (raw.nom || '').toLowerCase();
    const chapo = (raw.chapo_txt || '').toLowerCase();
    return nom.includes('appel') || chapo.includes('appel a projet') || chapo.includes('appel à projet');
  }
}

module.exports = RegionIdfConnector;
