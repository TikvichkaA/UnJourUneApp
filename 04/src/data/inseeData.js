// ============================================
// DONNEES INSEE - Profils de villes types
// Sources: INSEE 2022-2023, Filosofi, RP
// ============================================

// Statistiques nationales de reference
export const STATS_FRANCE = {
  population: 67760000,
  tauxChomage: 11.7,        // % 15-64 ans, RP 2022
  tauxPauvrete: 14.4,       // % sous seuil 60% median, 2021
  revenuMedian: 23080,      // EUR/an/UC, 2021
  prixM2Moyen: 3200,        // EUR/m2 logement ancien
  partLocataires: 40.3,     // %
  partProprietaires: 57.5,  // %
  partHLM: 14.7,            // % du parc locatif
  tauxDiplomeSup: 33.3,     // % pop 15+ non scolarisee
  tailleMenuage: 2.15,      // personnes/menage
  tauxEmploi: 66.3,         // % 15-64 ans
  source: 'INSEE RP 2022, Filosofi 2021'
}

// Profils de villes types pour simulation
export const VILLES_TYPES = {
  // === GRANDE METROPOLE ===
  metropole_riche: {
    id: 'metropole_riche',
    nom: 'Grande metropole (type Paris/Lyon)',
    description: 'Centre economique dynamique mais inegalitaire',
    population: 500000,
    stats: {
      tauxChomage: 9.5,
      tauxPauvrete: 16.8,      // Pauvrete elevee malgre richesse
      revenuMedian: 26500,
      prixM2: 6500,            // Logement tres cher
      partHLM: 18.2,
      tauxDiplomeSup: 48.5,
      densite: 8500,           // hab/km2
      partCadres: 32.4
    },
    indicateursInitiaux: {
      economie: 65,
      environnement: 35,       // Pollution elevee
      cohesion: 40,            // Inegalites fortes
      energie: 45
    },
    hidden: {
      pollution: 35,
      tension: 30,
      housingCapacity: 450,    // Tension logement
      health: 50,
      education: 55,
      mobility: 45,
      inequality: 0.45         // Indice Gini eleve
    },
    populationInitiale: {
      poor: 400,
      middle: 350,
      rich: 250
    },
    defis: ['Logement inabordable', 'Pollution atmospherique', 'Gentrification'],
    source: 'Inspire de Paris intra-muros, INSEE 2022'
  },

  // === VILLE MOYENNE INDUSTRIELLE ===
  ville_industrielle: {
    id: 'ville_industrielle',
    nom: 'Ville industrielle en reconversion',
    description: 'Ancienne ville ouvriere en transition',
    population: 80000,
    stats: {
      tauxChomage: 15.8,       // Chomage eleve
      tauxPauvrete: 22.5,
      revenuMedian: 18200,
      prixM2: 1400,
      partHLM: 28.5,           // Parc social important
      tauxDiplomeSup: 22.1,
      densite: 2800,
      partOuvriers: 24.3
    },
    indicateursInitiaux: {
      economie: 35,
      environnement: 40,
      cohesion: 50,            // Solidarite ouvriere
      energie: 35
    },
    hidden: {
      pollution: 30,
      tension: 35,
      housingCapacity: 95,
      health: 35,
      education: 30,
      mobility: 25,
      inequality: 0.28
    },
    populationInitiale: {
      poor: 550,
      middle: 380,
      rich: 70
    },
    defis: ['Chomage structurel', 'Desindustrialisation', 'Deserts medicaux'],
    source: 'Inspire de Lens/Denain, INSEE 2022'
  },

  // === VILLE MOYENNE EQUILIBREE ===
  ville_equilibree: {
    id: 'ville_equilibree',
    nom: 'Ville moyenne equilibree',
    description: 'Chef-lieu de departement typique',
    population: 45000,
    stats: {
      tauxChomage: 10.2,
      tauxPauvrete: 13.8,
      revenuMedian: 21500,
      prixM2: 2100,
      partHLM: 16.4,
      tauxDiplomeSup: 31.2,
      densite: 1800,
      partRetraites: 28.5
    },
    indicateursInitiaux: {
      economie: 50,
      environnement: 50,
      cohesion: 55,
      energie: 45
    },
    hidden: {
      pollution: 18,
      tension: 20,
      housingCapacity: 105,
      health: 45,
      education: 42,
      mobility: 30,
      inequality: 0.30
    },
    populationInitiale: {
      poor: 450,
      middle: 420,
      rich: 130
    },
    defis: ['Vieillissement', 'Attractivite economique', 'Mobilites'],
    source: 'Inspire de Chartres/Auxerre, INSEE 2022'
  },

  // === BANLIEUE POPULAIRE ===
  banlieue_populaire: {
    id: 'banlieue_populaire',
    nom: 'Banlieue populaire',
    description: 'Commune de premiere couronne, quartiers prioritaires',
    population: 35000,
    stats: {
      tauxChomage: 18.5,
      tauxPauvrete: 32.4,      // Pauvrete tres elevee
      revenuMedian: 15800,
      prixM2: 2800,            // Prix eleves malgre precarite
      partHLM: 45.2,           // Tres fort taux HLM
      tauxDiplomeSup: 18.7,
      densite: 6200,
      partMoins25ans: 38.5
    },
    indicateursInitiaux: {
      economie: 30,
      environnement: 35,
      cohesion: 40,
      energie: 40
    },
    hidden: {
      pollution: 28,
      tension: 45,             // Tensions sociales
      housingCapacity: 85,
      health: 32,
      education: 28,
      mobility: 35,
      inequality: 0.35
    },
    populationInitiale: {
      poor: 600,
      middle: 320,
      rich: 80
    },
    defis: ['Precarite', 'Discriminations', 'Enclavement', 'Services publics degrades'],
    source: 'Inspire de Sevran/Vaulx-en-Velin, INSEE 2022'
  },

  // === VILLE COTIERE TOURISTIQUE ===
  ville_touristique: {
    id: 'ville_touristique',
    nom: 'Ville cotiere touristique',
    description: 'Station balneaire avec forte saisonnalite',
    population: 28000,
    stats: {
      tauxChomage: 13.2,
      tauxPauvrete: 17.5,
      revenuMedian: 20100,
      prixM2: 4200,            // Pression immobiliere
      partHLM: 8.5,            // Peu de social
      tauxDiplomeSup: 28.4,
      densite: 1200,
      partResidSecondaires: 42.3
    },
    indicateursInitiaux: {
      economie: 55,
      environnement: 55,
      cohesion: 45,
      energie: 50
    },
    hidden: {
      pollution: 15,
      tension: 25,
      housingCapacity: 65,     // Crise logement
      health: 42,
      education: 38,
      mobility: 20,
      tourism: 45,
      inequality: 0.38
    },
    populationInitiale: {
      poor: 380,
      middle: 400,
      rich: 220
    },
    defis: ['Logement saisonnier', 'Emplois precaires', 'Surfréquentation'],
    source: 'Inspire de La Rochelle/Arcachon, INSEE 2022'
  },

  // === COMMUNE RURALE PERIURBAINE ===
  commune_rurale: {
    id: 'commune_rurale',
    nom: 'Commune rurale periurbaine',
    description: 'Village en croissance pres d\'une agglomeration',
    population: 8000,
    stats: {
      tauxChomage: 7.8,
      tauxPauvrete: 9.2,
      revenuMedian: 24200,
      prixM2: 2400,
      partHLM: 4.2,
      tauxDiplomeSup: 35.8,
      densite: 180,
      partFamilles: 68.5
    },
    indicateursInitiaux: {
      economie: 55,
      environnement: 65,
      cohesion: 60,
      energie: 35              // Dependance voiture
    },
    hidden: {
      pollution: 12,
      tension: 12,
      housingCapacity: 115,
      health: 38,              // Eloignement services
      education: 40,
      mobility: 15,            // Dependance auto
      inequality: 0.26
    },
    populationInitiale: {
      poor: 300,
      middle: 550,
      rich: 150
    },
    defis: ['Dependance automobile', 'Services de proximite', 'Artificialisation'],
    source: 'Inspire communes periurbaines, INSEE 2022'
  }
}

// Donnees de fact-checking (valeurs reelles pour verification)
export const FACTS_INSEE = {
  logement: {
    prixM2Paris: { value: 10200, unit: 'EUR/m2', source: 'Notaires de France 2023', margin: 0.1 },
    prixM2Province: { value: 2400, unit: 'EUR/m2', source: 'Notaires de France 2023', margin: 0.15 },
    loyerHLM: { value: 6.2, unit: 'EUR/m2/mois', source: 'USH 2023', margin: 0.1 },
    loyerPrive: { value: 13.5, unit: 'EUR/m2/mois', source: 'Clameur 2023', margin: 0.15 },
    partEligiblesHLM: { value: 0.66, unit: '%', source: 'USH 2023', margin: 0.05 },
    logementsVacants: { value: 3100000, unit: 'logements', source: 'INSEE RP 2022', margin: 0.1 },
    passoires: { value: 5200000, unit: 'logements', source: 'ONRE 2023', margin: 0.1 }
  },
  emploi: {
    smic: { value: 1766.92, unit: 'EUR brut/mois', source: 'INSEE 2024', margin: 0.01 },
    salaireMedian: { value: 2091, unit: 'EUR net/mois', source: 'INSEE 2022', margin: 0.05 },
    tauxChomage: { value: 7.3, unit: '%', source: 'INSEE T3 2024', margin: 0.1 },
    tauxChomageJeunes: { value: 17.2, unit: '%', source: 'INSEE T3 2024', margin: 0.1 }
  },
  sante: {
    esperanceVie: { value: 82.3, unit: 'ans', source: 'INSEE 2023', margin: 0.02 },
    densiteMedecins: { value: 3.3, unit: 'pour 1000 hab', source: 'DREES 2023', margin: 0.1 },
    communesSansMedecin: { value: 9000, unit: 'communes', source: 'DREES 2023', margin: 0.15 }
  },
  energie: {
    prixElectricite: { value: 0.2516, unit: 'EUR/kWh', source: 'Eurostat 2024', margin: 0.1 },
    partRenouvelable: { value: 22.2, unit: '%', source: 'RTE 2023', margin: 0.05 },
    coutIsolation: { value: 22000, unit: 'EUR/logement', source: 'ADEME 2023', margin: 0.2 }
  },
  transport: {
    prixAbonnementTC: { value: 50, unit: 'EUR/mois moyen', source: 'GART 2023', margin: 0.2 },
    partModalVoiture: { value: 63, unit: '%', source: 'INSEE 2022', margin: 0.1 },
    coutKmVelo: { value: 0.08, unit: 'EUR/km', source: 'ADEME 2023', margin: 0.2 },
    coutKmVoiture: { value: 0.35, unit: 'EUR/km', source: 'ADEME 2023', margin: 0.15 }
  },
  social: {
    seuilPauvrete: { value: 1158, unit: 'EUR/mois', source: 'INSEE 2021', margin: 0.02 },
    tauxPauvrete: { value: 14.4, unit: '%', source: 'INSEE 2021', margin: 0.05 },
    allocatairesRSA: { value: 1900000, unit: 'foyers', source: 'CNAF 2023', margin: 0.1 },
    sansAbri: { value: 330000, unit: 'personnes', source: 'INSEE 2023', margin: 0.15 }
  }
}

// Helper pour obtenir une ville par ID
export const getVilleById = (id) => VILLES_TYPES[id]

// Helper pour lister toutes les villes
export const getAllVilles = () => Object.values(VILLES_TYPES)

// Helper pour fact-checking
export const checkFact = (category, key, claimedValue) => {
  const fact = FACTS_INSEE[category]?.[key]
  if (!fact) return { valid: null, reason: 'Donnee non disponible' }

  const margin = fact.value * fact.margin
  const min = fact.value - margin
  const max = fact.value + margin

  if (claimedValue >= min && claimedValue <= max) {
    return {
      valid: true,
      reason: `Correct (valeur reelle: ${fact.value} ${fact.unit})`,
      source: fact.source
    }
  }

  return {
    valid: false,
    reason: `Inexact. Valeur reelle: ${fact.value} ${fact.unit}`,
    source: fact.source,
    ecart: Math.abs(claimedValue - fact.value) / fact.value
  }
}
