/**
 * SubVeille - Moteur de Recommandation AAP
 * Calcule la pertinence des AAP pour une association
 */

const Recommendation = (function() {
  'use strict';

  // Poids des criteres de matching
  const WEIGHTS = {
    secteur: 40,        // Match secteur d'activite
    territoire: 25,     // Match localisation
    montant: 20,        // Coherence budget
    beneficiaire: 15    // Type de structure
  };

  // Mapping des secteurs vers mots-cles
  const SECTEUR_KEYWORDS = {
    'culture': ['culture', 'art', 'patrimoine', 'musee', 'spectacle', 'musique', 'theatre', 'cinema', 'livre', 'lecture'],
    'sport': ['sport', 'sportif', 'athletisme', 'football', 'handball', 'basket', 'natation', 'cyclisme'],
    'social': ['social', 'solidarite', 'insertion', 'inclusion', 'pauvrete', 'precarite', 'aide', 'accompagnement'],
    'education': ['education', 'formation', 'apprentissage', 'jeunesse', 'scolaire', 'pedagogique', 'enseignement'],
    'environnement': ['environnement', 'ecologie', 'biodiversite', 'climat', 'transition', 'energie', 'durable', 'vert'],
    'sante': ['sante', 'medical', 'prevention', 'handicap', 'bien-etre', 'therapeutique', 'soins'],
    'economie': ['economie', 'emploi', 'entreprise', 'innovation', 'numerique', 'digital', 'startup'],
    'international': ['international', 'cooperation', 'humanitaire', 'developpement', 'solidarite internationale'],
    'citoyennete': ['citoyennete', 'democratie', 'participation', 'civique', 'engagement', 'benevolat']
  };

  // Mapping des departements vers regions
  const DEPT_TO_REGION = {
    '75': 'ile-de-france', '77': 'ile-de-france', '78': 'ile-de-france', '91': 'ile-de-france',
    '92': 'ile-de-france', '93': 'ile-de-france', '94': 'ile-de-france', '95': 'ile-de-france',
    '13': 'provence-alpes-cote-d-azur', '83': 'provence-alpes-cote-d-azur', '84': 'provence-alpes-cote-d-azur',
    '06': 'provence-alpes-cote-d-azur', '04': 'provence-alpes-cote-d-azur', '05': 'provence-alpes-cote-d-azur',
    '69': 'auvergne-rhone-alpes', '01': 'auvergne-rhone-alpes', '38': 'auvergne-rhone-alpes',
    '42': 'auvergne-rhone-alpes', '73': 'auvergne-rhone-alpes', '74': 'auvergne-rhone-alpes',
    '63': 'auvergne-rhone-alpes', '03': 'auvergne-rhone-alpes', '15': 'auvergne-rhone-alpes',
    '43': 'auvergne-rhone-alpes', '07': 'auvergne-rhone-alpes', '26': 'auvergne-rhone-alpes',
    '33': 'nouvelle-aquitaine', '40': 'nouvelle-aquitaine', '64': 'nouvelle-aquitaine',
    '24': 'nouvelle-aquitaine', '47': 'nouvelle-aquitaine', '87': 'nouvelle-aquitaine',
    '19': 'nouvelle-aquitaine', '23': 'nouvelle-aquitaine', '16': 'nouvelle-aquitaine',
    '17': 'nouvelle-aquitaine', '79': 'nouvelle-aquitaine', '86': 'nouvelle-aquitaine',
    '31': 'occitanie', '32': 'occitanie', '65': 'occitanie', '09': 'occitanie',
    '12': 'occitanie', '46': 'occitanie', '81': 'occitanie', '82': 'occitanie',
    '34': 'occitanie', '11': 'occitanie', '66': 'occitanie', '30': 'occitanie', '48': 'occitanie',
    '44': 'pays-de-la-loire', '49': 'pays-de-la-loire', '53': 'pays-de-la-loire',
    '72': 'pays-de-la-loire', '85': 'pays-de-la-loire',
    '35': 'bretagne', '22': 'bretagne', '29': 'bretagne', '56': 'bretagne',
    '59': 'hauts-de-france', '62': 'hauts-de-france', '80': 'hauts-de-france',
    '60': 'hauts-de-france', '02': 'hauts-de-france',
    '67': 'grand-est', '68': 'grand-est', '57': 'grand-est', '54': 'grand-est',
    '55': 'grand-est', '88': 'grand-est', '51': 'grand-est', '52': 'grand-est',
    '08': 'grand-est', '10': 'grand-est',
    '76': 'normandie', '27': 'normandie', '14': 'normandie', '50': 'normandie', '61': 'normandie',
    '21': 'bourgogne-franche-comte', '71': 'bourgogne-franche-comte', '58': 'bourgogne-franche-comte',
    '89': 'bourgogne-franche-comte', '25': 'bourgogne-franche-comte', '39': 'bourgogne-franche-comte',
    '70': 'bourgogne-franche-comte', '90': 'bourgogne-franche-comte',
    '45': 'centre-val-de-loire', '28': 'centre-val-de-loire', '41': 'centre-val-de-loire',
    '37': 'centre-val-de-loire', '36': 'centre-val-de-loire', '18': 'centre-val-de-loire',
    '2A': 'corse', '2B': 'corse', '20': 'corse'
  };

  /**
   * Calcule le score de matching pour un AAP
   */
  function calculateScore(aap, profile) {
    if (!profile) return { score: 0, matches: [], total: 0 };

    const matches = [];
    let totalScore = 0;

    // 1. Match Secteur
    const secteurScore = calculateSecteurMatch(aap, profile);
    if (secteurScore.score > 0) {
      matches.push({
        type: 'secteur',
        label: secteurScore.reason,
        score: secteurScore.score,
        weight: WEIGHTS.secteur
      });
      totalScore += secteurScore.score * WEIGHTS.secteur / 100;
    }

    // 2. Match Territoire
    const territoireScore = calculateTerritoireMatch(aap, profile);
    if (territoireScore.score > 0) {
      matches.push({
        type: 'territoire',
        label: territoireScore.reason,
        score: territoireScore.score,
        weight: WEIGHTS.territoire
      });
      totalScore += territoireScore.score * WEIGHTS.territoire / 100;
    }

    // 3. Match Montant
    const montantScore = calculateMontantMatch(aap, profile);
    if (montantScore.score > 0) {
      matches.push({
        type: 'montant',
        label: montantScore.reason,
        score: montantScore.score,
        weight: WEIGHTS.montant
      });
      totalScore += montantScore.score * WEIGHTS.montant / 100;
    }

    // 4. Match Beneficiaire (type structure)
    const beneficiaireScore = calculateBeneficiaireMatch(aap, profile);
    if (beneficiaireScore.score > 0) {
      matches.push({
        type: 'beneficiaire',
        label: beneficiaireScore.reason,
        score: beneficiaireScore.score,
        weight: WEIGHTS.beneficiaire
      });
      totalScore += beneficiaireScore.score * WEIGHTS.beneficiaire / 100;
    }

    return {
      score: Math.round(totalScore),
      matches,
      total: matches.reduce((sum, m) => sum + m.score * m.weight / 100, 0)
    };
  }

  /**
   * Match sur le secteur d'activite
   */
  function calculateSecteurMatch(aap, profile) {
    if (!profile.secteurs || profile.secteurs.length === 0) {
      return { score: 0, reason: '' };
    }

    const aapText = [
      aap.titre || '',
      aap.description || '',
      aap.secteur || ''
    ].join(' ').toLowerCase();

    let bestMatch = { score: 0, secteur: '' };

    for (const secteur of profile.secteurs) {
      const keywords = SECTEUR_KEYWORDS[secteur.toLowerCase()] || [secteur.toLowerCase()];
      let matchCount = 0;

      for (const keyword of keywords) {
        if (aapText.includes(keyword)) {
          matchCount++;
        }
      }

      const score = Math.min(100, matchCount * 25);
      if (score > bestMatch.score) {
        bestMatch = { score, secteur };
      }
    }

    if (bestMatch.score > 0) {
      return {
        score: bestMatch.score,
        reason: `Correspond a votre secteur ${bestMatch.secteur}`
      };
    }

    return { score: 0, reason: '' };
  }

  /**
   * Match sur le territoire
   */
  function calculateTerritoireMatch(aap, profile) {
    if (!profile.code_postal) {
      return { score: 0, reason: '' };
    }

    const dept = profile.code_postal.substring(0, 2);
    const region = DEPT_TO_REGION[dept];
    const territoires = aap.territoires || [];

    // Verifier si national
    const isNational = territoires.some(t =>
      t.toLowerCase().includes('france') ||
      t.toLowerCase().includes('national') ||
      t.toLowerCase().includes('metropole')
    );

    if (isNational) {
      return { score: 80, reason: 'Ouvert a toute la France' };
    }

    // Verifier region
    if (region && territoires.some(t => t.toLowerCase().includes(region))) {
      return { score: 100, reason: `Disponible dans votre region` };
    }

    // Verifier departement
    if (territoires.some(t => t.includes(dept))) {
      return { score: 100, reason: `Disponible dans votre departement (${dept})` };
    }

    // Si pas de territoire specifie, considerer comme national
    if (territoires.length === 0) {
      return { score: 60, reason: 'Pas de restriction territoriale' };
    }

    return { score: 0, reason: '' };
  }

  /**
   * Match sur le montant (coherence avec budget association)
   */
  function calculateMontantMatch(aap, profile) {
    if (!profile.budget_annuel) {
      return { score: 50, reason: 'Budget non renseigne' };
    }

    const budget = profile.budget_annuel;
    const montantMax = aap.montantMax || aap.montant_max;
    const montantMin = aap.montantMin || aap.montant_min;

    // Si pas de montant specifie
    if (!montantMax && !montantMin) {
      return { score: 50, reason: 'Montant a determiner' };
    }

    // Verifier coherence (subvention < 80% budget en general)
    if (montantMax && montantMax > budget * 2) {
      return { score: 30, reason: 'Subvention importante - verifier eligibilite' };
    }

    if (montantMax && montantMax <= budget) {
      return { score: 100, reason: `Montant coherent avec votre budget` };
    }

    if (montantMin && montantMin > budget) {
      return { score: 20, reason: 'Montant minimum eleve' };
    }

    return { score: 70, reason: 'Montant dans une fourchette acceptable' };
  }

  /**
   * Match sur le type de beneficiaire
   */
  function calculateBeneficiaireMatch(aap, profile) {
    const beneficiaires = aap.beneficiaires || [];

    // Si pas de restriction
    if (beneficiaires.length === 0) {
      return { score: 60, reason: 'Ouvert a tous types de structures' };
    }

    // Verifier si associations sont eligibles
    const assoKeywords = ['association', 'asso', 'loi 1901', 'but non lucratif', 'organisme'];
    const isAssoEligible = beneficiaires.some(b =>
      assoKeywords.some(k => b.toLowerCase().includes(k))
    );

    if (isAssoEligible) {
      return { score: 100, reason: 'Ouvert aux associations' };
    }

    // Verifier si explicitement exclu
    const excluded = beneficiaires.every(b =>
      b.toLowerCase().includes('entreprise') ||
      b.toLowerCase().includes('commune') ||
      b.toLowerCase().includes('collectivite')
    );

    if (excluded) {
      return { score: 0, reason: '' };
    }

    return { score: 40, reason: 'Eligibilite a verifier' };
  }

  /**
   * Enrichit une liste d'AAP avec les scores de matching
   */
  function enrichWithScores(aaps, profile) {
    return aaps.map(aap => {
      const matching = calculateScore(aap, profile);
      return {
        ...aap,
        matchScore: matching.score,
        matchDetails: matching.matches
      };
    });
  }

  /**
   * Trie les AAP par pertinence
   */
  function sortByRelevance(aaps) {
    return [...aaps].sort((a, b) => {
      // D'abord par score
      const scoreDiff = (b.matchScore || 0) - (a.matchScore || 0);
      if (scoreDiff !== 0) return scoreDiff;

      // Puis par date de cloture (plus proche en premier)
      const dateA = a.dateCloture || a.date_cloture;
      const dateB = b.dateCloture || b.date_cloture;
      if (dateA && dateB) {
        return new Date(dateA) - new Date(dateB);
      }
      return 0;
    });
  }

  /**
   * Filtre les AAP avec un score minimum
   */
  function filterByMinScore(aaps, minScore = 30) {
    return aaps.filter(aap => (aap.matchScore || 0) >= minScore);
  }

  /**
   * Genere un resume des recommandations
   */
  function generateSummary(aaps, profile) {
    const withScores = enrichWithScores(aaps, profile);
    const sorted = sortByRelevance(withScores);

    const excellent = sorted.filter(a => a.matchScore >= 70);
    const good = sorted.filter(a => a.matchScore >= 40 && a.matchScore < 70);
    const possible = sorted.filter(a => a.matchScore >= 20 && a.matchScore < 40);

    return {
      excellent: excellent.length,
      good: good.length,
      possible: possible.length,
      top5: sorted.slice(0, 5),
      byCategory: groupByCategory(sorted)
    };
  }

  /**
   * Groupe les AAP par categorie de matching
   */
  function groupByCategory(aaps) {
    return {
      secteur: aaps.filter(a => a.matchDetails?.some(m => m.type === 'secteur' && m.score >= 50)),
      territoire: aaps.filter(a => a.matchDetails?.some(m => m.type === 'territoire' && m.score >= 80)),
      urgent: aaps.filter(a => {
        const date = a.dateCloture || a.date_cloture;
        if (!date) return false;
        const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
        return days > 0 && days <= 14;
      })
    };
  }

  /**
   * Obtient les meilleures recommandations
   */
  async function getRecommendations(limit = 10) {
    const profile = Auth.getProfile();
    const aaps = await AAPSources.search({});

    const enriched = enrichWithScores(aaps, profile);
    const sorted = sortByRelevance(enriched);

    return sorted.slice(0, limit);
  }

  return {
    calculateScore,
    enrichWithScores,
    sortByRelevance,
    filterByMinScore,
    generateSummary,
    getRecommendations,
    WEIGHTS
  };
})();
