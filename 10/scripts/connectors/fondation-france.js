/**
 * Connecteur Fondation de France
 * Source: Scraping du site web (pas d'API publique)
 */

const BaseConnector = require('./base');
const cheerio = require('cheerio');

class FondationFranceConnector extends BaseConnector {
  constructor() {
    super('fondation-france', {
      baseUrl: 'https://www.fondationdefrance.org',
      listUrl: 'https://www.fondationdefrance.org/fr/appels-a-projets'
    });

    // Mapping des thematiques FdF vers nos secteurs
    this.themeMapping = {
      'sante': 'sante',
      'recherche': 'sante',
      'solidarite': 'social',
      'vulnerabilite': 'social',
      'enfance': 'education',
      'jeunesse': 'education',
      'education': 'education',
      'culture': 'culture',
      'savoirs': 'culture',
      'climat': 'environnement',
      'biodiversite': 'environnement',
      'environnement': 'environnement',
      'territoires': 'autre',
      'urgences': 'autre'
    };

    // Mapping des mois francais
    this.monthMapping = {
      'janvier': '01', 'fevrier': '02', 'février': '02', 'mars': '03',
      'avril': '04', 'mai': '05', 'juin': '06', 'juillet': '07',
      'aout': '08', 'août': '08', 'septembre': '09', 'octobre': '10',
      'novembre': '11', 'decembre': '12', 'décembre': '12'
    };
  }

  async fetch() {
    this.log('Fetching from Fondation de France website...');

    // 1. Recuperer la page liste
    const listHtml = await this.fetchPage(this.config.listUrl);
    const $ = cheerio.load(listHtml);

    // 2. Extraire les liens vers les appels a projets
    const aapLinks = [];

    // Les appels sont dans des liens vers /fr/appels-a-projets/[slug]
    $('a[href*="/fr/appels-a-projets/"]').each((i, el) => {
      const href = $(el).attr('href');
      // Filtrer le lien de la page liste elle-meme
      if (href && href !== '/fr/appels-a-projets' && !href.includes('#')) {
        const fullUrl = href.startsWith('http') ? href : `${this.config.baseUrl}${href}`;
        if (!aapLinks.includes(fullUrl)) {
          aapLinks.push(fullUrl);
        }
      }
    });

    this.log(`Found ${aapLinks.length} appels a projets links`);

    // 3. Scraper chaque page de detail
    const aaps = [];
    for (const url of aapLinks) {
      try {
        const aap = await this.scrapeDetail(url);
        if (aap) {
          aaps.push(aap);
        }
        // Petit delai pour ne pas surcharger le serveur
        await this.delay(500);
      } catch (error) {
        this.error(`Failed to scrape ${url}: ${error.message}`);
      }
    }

    // 4. Filtrer les appels clos
    const now = new Date();
    const activeAaps = aaps.filter(aap => {
      if (!aap.date_cloture) return true; // Permanent
      return new Date(aap.date_cloture) >= now;
    });

    this.log(`Active appels: ${activeAaps.length}/${aaps.length}`);
    this.stats.fetched = activeAaps.length;

    return activeAaps;
  }

  async fetchPage(url) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }

    return response.text();
  }

  async scrapeDetail(url) {
    this.log(`Scraping: ${url}`);
    const html = await this.fetchPage(url);
    const $ = cheerio.load(html);

    // Extraire le slug depuis l'URL
    const slug = url.split('/').pop();

    // Titre - souvent dans h1 ou og:title
    const titre = $('h1').first().text().trim() ||
                  $('meta[property="og:title"]').attr('content') ||
                  slug.replace(/-/g, ' ');

    // Description - meta description ou premier paragraphe
    let description = $('meta[name="description"]').attr('content') ||
                      $('meta[property="og:description"]').attr('content') || '';

    // Description complete - contenu principal de la page
    let descriptionComplete = '';
    $('article, .content, main').find('p').each((i, el) => {
      descriptionComplete += $(el).text().trim() + '\n';
    });
    descriptionComplete = descriptionComplete.trim() || description;

    // Date limite - chercher dans le texte
    const pageText = $('body').text();
    const dateCloture = this.extractDate(pageText);

    // Montant - chercher dans le texte
    const montantInfo = this.extractMontant(pageText);

    // Thematique - depuis l'URL ou le contenu
    const secteur = this.detectSecteur(titre + ' ' + description);

    // Lien candidature - chercher un lien vers la plateforme
    let lienCandidature = null;
    $('a[href*="appel-a-projets.fondationdefrance.org"]').each((i, el) => {
      lienCandidature = $(el).attr('href');
    });

    // Contact - chercher email
    const emailMatch = pageText.match(/[\w.-]+@fondationdefrance\.org/i);
    const contact = emailMatch ? emailMatch[0] : null;

    // Tags depuis le contenu
    const tags = this.extractTags(titre + ' ' + description);

    return this.normalize({
      id: slug,
      titre: titre,
      description: description.substring(0, 500),
      description_complete: descriptionComplete.substring(0, 5000),
      secteur: secteur,
      date_cloture: dateCloture,
      montant_min: montantInfo.min,
      montant_max: montantInfo.max,
      lien: url,
      lien_candidature: lienCandidature,
      contact: contact,
      tags: tags
    });
  }

  extractDate(text) {
    // Pattern: "18 février 2025" ou "18/02/2025"
    const patterns = [
      // Format: 18 février 2025
      /(\d{1,2})\s+(janvier|fevrier|février|mars|avril|mai|juin|juillet|aout|août|septembre|octobre|novembre|decembre|décembre)\s+(\d{4})/gi,
      // Format: limite : 18/02/2025
      /limite[^:]*:\s*(\d{2})\/(\d{2})\/(\d{4})/i,
      // Format ISO-like
      /(\d{4})-(\d{2})-(\d{2})/
    ];

    // Chercher les mots-cles indiquant une date limite
    const limitKeywords = ['date limite', 'cloture', 'clôture', 'avant le', 'jusqu\'au', 'deadline'];
    const lowerText = text.toLowerCase();

    for (const keyword of limitKeywords) {
      const idx = lowerText.indexOf(keyword);
      if (idx !== -1) {
        // Chercher une date dans les 100 caracteres suivants
        const snippet = text.substring(idx, idx + 100);

        // Pattern francais
        const frMatch = snippet.match(/(\d{1,2})\s+(janvier|fevrier|février|mars|avril|mai|juin|juillet|aout|août|septembre|octobre|novembre|decembre|décembre)\s+(\d{4})/i);
        if (frMatch) {
          const day = frMatch[1].padStart(2, '0');
          const month = this.monthMapping[frMatch[2].toLowerCase()];
          const year = frMatch[3];
          return `${year}-${month}-${day}`;
        }

        // Pattern numerique
        const numMatch = snippet.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (numMatch) {
          return `${numMatch[3]}-${numMatch[2]}-${numMatch[1]}`;
        }
      }
    }

    // Fallback: premiere date trouvee dans le texte
    const frMatch = text.match(/(\d{1,2})\s+(janvier|fevrier|février|mars|avril|mai|juin|juillet|aout|août|septembre|octobre|novembre|decembre|décembre)\s+(\d{4})/i);
    if (frMatch) {
      const day = frMatch[1].padStart(2, '0');
      const month = this.monthMapping[frMatch[2].toLowerCase()];
      const year = frMatch[3];
      return `${year}-${month}-${day}`;
    }

    return null;
  }

  extractMontant(text) {
    const result = { min: null, max: null };

    // Patterns pour les montants
    const patterns = [
      // "jusqu'à 200 000 €" ou "maximum 200000€"
      /(?:jusqu.{0,3}[aà]|maximum|max\.?|plafond)\s*[:\s]*(\d[\d\s]*)\s*€/gi,
      // "de 5 000 à 30 000 €"
      /de\s+(\d[\d\s]*)\s*(?:€|euros?)?\s*[àa]\s*(\d[\d\s]*)\s*€/gi,
      // "200 000 €" seul
      /(\d[\d\s]{2,})\s*€/g
    ];

    // Chercher montant max
    const maxMatch = text.match(/(?:jusqu.{0,3}[aà]|maximum|max\.?|plafond)\s*[:\s]*(\d[\d\s]*)\s*€/i);
    if (maxMatch) {
      result.max = parseInt(maxMatch[1].replace(/\s/g, ''), 10);
    }

    // Chercher fourchette
    const rangeMatch = text.match(/de\s+(\d[\d\s]*)\s*(?:€|euros?)?\s*[àa]\s*(\d[\d\s]*)\s*€/i);
    if (rangeMatch) {
      result.min = parseInt(rangeMatch[1].replace(/\s/g, ''), 10);
      result.max = parseInt(rangeMatch[2].replace(/\s/g, ''), 10);
    }

    return result;
  }

  detectSecteur(text) {
    const lowerText = text.toLowerCase();

    for (const [keyword, secteur] of Object.entries(this.themeMapping)) {
      if (lowerText.includes(keyword)) {
        return secteur;
      }
    }

    return 'autre';
  }

  extractTags(text) {
    const tags = [];
    const keywords = [
      'recherche', 'sante', 'santé', 'cancer', 'handicap', 'solidarite', 'solidarité',
      'environnement', 'climat', 'biodiversite', 'biodiversité', 'culture', 'education',
      'éducation', 'jeunesse', 'enfance', 'aidants', 'rural', 'territoires', 'urgences'
    ];

    const lowerText = text.toLowerCase();
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        tags.push(keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
      }
    }

    return [...new Set(tags)];
  }

  normalize(raw) {
    return this.createAAP({
      source_id: raw.id,
      titre: raw.titre,
      description: raw.description || '',
      description_complete: raw.description_complete || raw.description || '',
      financeur: 'Fondation de France',
      financeur_type: 'fondation',
      secteur: raw.secteur || 'autre',
      montant_min: raw.montant_min,
      montant_max: raw.montant_max,
      date_ouverture: null,
      date_cloture: raw.date_cloture,
      lien: raw.lien,
      lien_candidature: raw.lien_candidature,
      territoires: ['National'],
      beneficiaires: ['Associations', 'Fondations'],
      is_appel_projet: true,
      contact: raw.contact,
      tags: raw.tags || []
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = FondationFranceConnector;
