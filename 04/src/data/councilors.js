// ============================================
// CONSEILLERS MUNICIPAUX
// 10 personnages avec personnalites distinctes
// ============================================

export const COUNCILORS = [
  // === GAUCHE (3 conseillers) ===
  {
    id: 'elena_martinez',
    name: 'Elena Martinez',
    title: 'Conseillère déléguée aux affaires sociales',
    alignment: 'gauche',
    traits: ['empathique', 'idéaliste'],
    emoji: '👩‍⚕️',
    description: 'Ancienne infirmière, elle défend les services publics avec passion.',
    priorities: ['cohesion', 'health', 'education', 'tension'],
    biases: {
      social: 1.4,
      logement: 1.3,
      ecologie: 1.2,
      services: 1.3,
      culture: 1.1,
      fiscalite_gauche: 1.2,
      securite: 0.7,
      ordre: 0.5,
      identite: 0.4,
      fiscalite_droite: 0.6,
      gestion: 0.8,
      attractivite: 0.9
    },
    baseSupport: 50,
    volatility: 0.2,
    factSensitivity: 0.8,
    catchphrases: {
      pro: "C'est une question de dignite humaine.",
      con: "Et les plus fragiles, on en fait quoi ?",
      vote_pour: "Je vote pour, c'est une evidence.",
      vote_contre: "Je ne peux pas cautionner ca."
    }
  },
  {
    id: 'jean_luc_dupont',
    name: 'Jean-Luc Dupont',
    title: 'Délégué syndical CGT',
    alignment: 'gauche',
    traits: ['combatif', 'loyal'],
    emoji: '👷',
    description: 'Ancien ouvrier, il porte la voix des travailleurs au conseil.',
    priorities: ['tension', 'housingCapacity', 'liberty', 'pollution'],
    biases: {
      social: 1.5,
      logement: 1.4,
      transports: 1.2,
      fiscalite_gauche: 1.3,
      ecologie: 1.1,
      fiscalite_droite: 0.4,
      gestion: 0.5,
      attractivite: 0.6,
      securite: 0.7,
      ordre: 0.5,
      identite: 0.3
    },
    baseSupport: 45,
    volatility: 0.15,
    factSensitivity: 0.6,
    catchphrases: {
      pro: "Enfin une mesure pour les travailleurs !",
      con: "C'est du patronat déguisé, ça.",
      vote_pour: "Solidarité ! Je vote pour.",
      vote_contre: "Jamais ! C'est contre mes valeurs."
    }
  },
  {
    id: 'fatima_benali',
    name: 'Fatima Benali',
    title: 'Presidente d\'association',
    alignment: 'gauche',
    traits: ['pragmatique', 'rassembleuse'],
    emoji: '👩‍🏫',
    description: 'Elle dirige une association d\'aide aux devoirs depuis 15 ans.',
    priorities: ['education', 'culture', 'cohesion', 'tension'],
    biases: {
      culture: 1.4,
      services: 1.3,
      social: 1.2,
      ecologie: 1.1,
      ordre: 0.5,
      identite: 0.3,
      securite: 0.8,
      fiscalite_droite: 0.7
    },
    baseSupport: 55,
    volatility: 0.25,
    factSensitivity: 0.85,
    catchphrases: {
      pro: "Ça va dans le bon sens pour nos quartiers.",
      con: "On divise au lieu de rassembler...",
      vote_pour: "Pour l'avenir de nos enfants, oui.",
      vote_contre: "Non, ça va à l'encontre de nos valeurs."
    }
  },

  // === DROITE (3 conseillers) ===
  {
    id: 'philippe_bertrand',
    name: 'Philippe Bertrand',
    title: 'Chef d\'entreprise',
    alignment: 'droite',
    traits: ['pragmatique', 'calculateur'],
    emoji: '👔',
    description: 'PDG d\'une PME locale, il veut une gestion "en bon pere de famille".',
    priorities: ['economie', 'innovation', 'debt', 'tourism'],
    biases: {
      attractivite: 1.4,
      fiscalite_droite: 1.3,
      gestion: 1.3,
      securite: 1.1,
      social: 0.6,
      fiscalite_gauche: 0.5,
      ecologie: 0.8,
      logement: 0.7
    },
    baseSupport: 50,
    volatility: 0.2,
    factSensitivity: 0.9,
    catchphrases: {
      pro: "Ça, c'est bon pour l'économie locale.",
      con: "Qui va payer ? Les contribuables !",
      vote_pour: "C'est un investissement rentable.",
      vote_contre: "Non, c'est de la dépense inutile."
    }
  },
  {
    id: 'marie_duval',
    name: 'Marie Duval',
    title: 'Notaire',
    alignment: 'droite',
    traits: ['conservatrice', 'rigoureuse'],
    emoji: '👩‍⚖️',
    description: 'Issue d\'une famille d\'élus, elle incarne la droite traditionnelle.',
    priorities: ['security', 'debt', 'economie', 'liberty'],
    biases: {
      securite: 1.3,
      gestion: 1.3,
      fiscalite_droite: 1.2,
      attractivite: 1.1,
      identite: 1.0,
      ecologie: 0.7,
      transports: 0.8,
      social: 0.6,
      fiscalite_gauche: 0.5
    },
    baseSupport: 45,
    volatility: 0.15,
    factSensitivity: 0.75,
    catchphrases: {
      pro: "C'est conforme a nos traditions.",
      con: "On ne peut pas se le permettre.",
      vote_pour: "Par responsabilite, j'accepte.",
      vote_contre: "C'est irresponsable, je refuse."
    }
  },
  {
    id: 'xavier_moreau',
    name: 'Xavier Moreau',
    title: 'Commercant',
    alignment: 'droite',
    traits: ['populaire', 'opportuniste'],
    emoji: '🏪',
    description: 'Il tient le cafe de la place depuis 30 ans, il connait tout le monde.',
    priorities: ['economie', 'mobility', 'tourism', 'security'],
    biases: {
      attractivite: 1.3,
      localisme: 1.2,
      securite: 1.1,
      gestion: 1.0,
      transports: 0.7, // Préfère les voitures pour ses clients
      ecologie: 0.8,
      social: 0.8,
      fiscalite_gauche: 0.7
    },
    baseSupport: 50,
    volatility: 0.3,
    factSensitivity: 0.7,
    catchphrases: {
      pro: "Mes clients en parlent, ils sont pour !",
      con: "Ça va faire fuir les gens du centre-ville.",
      vote_pour: "Allez, on tente le coup.",
      vote_contre: "Non, c'est mauvais pour le commerce."
    }
  },

  // === EXTREME DROITE (1 conseiller) ===
  {
    id: 'bernard_lambert',
    name: 'Bernard Lambert',
    title: 'Ancien militaire',
    alignment: 'extreme_droite',
    traits: ['autoritaire', 'nostalgique'],
    emoji: '🎖️',
    description: 'Colonel à la retraite, il prône l\'ordre et la fermeté.',
    priorities: ['security', 'liberty', 'tension', 'culture'],
    biases: {
      ordre: 1.5,
      identite: 1.4,
      securite: 1.4,
      localisme: 1.2,
      culture: 0.5,
      social: 0.3,
      ecologie: 0.6,
      fiscalite_gauche: 0.3,
      logement: 0.5
    },
    baseSupport: 40,
    volatility: 0.1, // Très stable dans ses positions
    factSensitivity: 0.4,
    catchphrases: {
      pro: "Enfin du bon sens !",
      con: "C'est du laxisme, encore et toujours.",
      vote_pour: "Pour une fois, je suis d'accord.",
      vote_contre: "Certainement pas. C'est inacceptable."
    }
  },

  // === CENTRE (3 conseillers) ===
  {
    id: 'sophie_leroux',
    name: 'Sophie Leroux',
    title: 'Médecin généraliste',
    alignment: 'centre',
    traits: ['modérée', 'pragmatique'],
    emoji: '⚕️',
    description: 'Elle cherche le consensus et s\'appuie sur les données.',
    priorities: ['health', 'education', 'cohesion', 'pollution'],
    biases: {
      social: 1.1,
      securite: 1.0,
      ecologie: 1.1,
      attractivite: 1.0,
      services: 1.2,
      culture: 1.0,
      gestion: 1.0,
      ordre: 0.8,
      identite: 0.7
    },
    baseSupport: 55,
    volatility: 0.25,
    factSensitivity: 0.95, // Très sensible aux faits
    catchphrases: {
      pro: "Les études montrent que ça marche.",
      con: "Je voudrais voir les données d'abord.",
      vote_pour: "C'est rationnel, je vote pour.",
      vote_contre: "Sans preuves, je m'abstiens... ou contre."
    }
  },
  {
    id: 'antoine_perrin',
    name: 'Antoine Perrin',
    title: 'Architecte urbaniste',
    alignment: 'centre',
    traits: ['visionnaire', 'technocrate'],
    emoji: '📐',
    description: 'Il rêve d\'une ville moderne, verte et connectée.',
    priorities: ['environnement', 'innovation', 'mobility', 'pollution'],
    biases: {
      ecologie: 1.3,
      attractivite: 1.2,
      transports: 1.2,
      gestion: 1.1,
      ordre: 0.7,
      identite: 0.6,
      social: 0.9,
      localisme: 0.8
    },
    baseSupport: 50,
    volatility: 0.2,
    factSensitivity: 0.85,
    catchphrases: {
      pro: "C'est la ville de demain qu'on construit !",
      con: "On fait du saupoudrage sans vision.",
      vote_pour: "Pour l'avenir, évidemment.",
      vote_contre: "Non, on peut faire mieux."
    }
  },
  {
    id: 'claire_martin',
    name: 'Claire Martin',
    title: 'Enseignante retraitée',
    alignment: 'centre',
    traits: ['sage', 'indépendante'],
    emoji: '📚',
    description: 'Respectée de tous, elle vote selon sa conscience.',
    priorities: ['education', 'culture', 'liberty', 'cohesion'],
    biases: {
      services: 1.2,
      culture: 1.3,
      social: 1.0,
      ecologie: 1.0,
      ordre: 0.6,
      identite: 0.5,
      securite: 0.9,
      attractivite: 0.9
    },
    baseSupport: 50,
    volatility: 0.2,
    factSensitivity: 0.9,
    catchphrases: {
      pro: "C'est ce que j'aurais voulu pour mes élèves.",
      con: "On oublie l'essentiel : l'humain.",
      vote_pour: "Avec conviction, oui.",
      vote_contre: "Ma conscience me dit non."
    }
  }
]

// Helpers pour accéder aux conseillers
export const getCouncilorById = (id) => COUNCILORS.find(c => c.id === id)
export const getCouncilorsByAlignment = (alignment) => COUNCILORS.filter(c => c.alignment === alignment)

// Répartition politique du conseil
export const COUNCIL_COMPOSITION = {
  gauche: 3,
  droite: 3,
  extreme_droite: 1,
  centre: 3,
  total: 10,
  majorite: 6 // Pour faire passer une mesure (majorité)
}

// ============================================
// COMMISSIONS THEMATIQUES
// ============================================
export const COMMISSIONS = {
  finances: {
    id: 'finances',
    name: 'Commission des Finances',
    icon: '💰',
    description: 'Budget, fiscalité, investissements',
    themes: ['budget', 'impôts', 'dette', 'subventions']
  },
  social: {
    id: 'social',
    name: 'Commission Sociale',
    icon: '🤝',
    description: 'Solidarité, logement, santé',
    themes: ['logement', 'santé', 'pauvreté', 'petite_enfance']
  },
  urbanisme: {
    id: 'urbanisme',
    name: 'Commission Urbanisme',
    icon: '🏗️',
    description: 'Aménagement, construction, transports',
    themes: ['construction', 'transports', 'voirie', 'espaces_verts']
  },
  securite: {
    id: 'securite',
    name: 'Commission Sécurité',
    icon: '🛡️',
    description: 'Police municipale, prévention',
    themes: ['police', 'prévention', 'incivilités', 'vidéo_surveillance']
  },
  environnement: {
    id: 'environnement',
    name: 'Commission Environnement',
    icon: '🌿',
    description: 'Écologie, énergie, déchets',
    themes: ['pollution', 'énergie', 'déchets', 'biodiversité']
  },
  culture: {
    id: 'culture',
    name: 'Commission Culture et Éducation',
    icon: '🎭',
    description: 'Écoles, culture, sport, associations',
    themes: ['écoles', 'bibliothèques', 'sport', 'associations']
  }
}

// Opinions des conseillers par thème (base, peut évoluer)
export const COUNCILOR_OPINIONS = {
  elena_martinez: {
    logement: { position: 80, priority: 'high', quote: "Le logement est un droit, pas un privilège." },
    santé: { position: 90, priority: 'high', quote: "La santé doit être accessible à tous." },
    budget: { position: 40, priority: 'low', quote: "L'équilibre budgétaire ne doit pas primer sur l'humain." },
    sécurité: { position: 30, priority: 'low', quote: "La sécurité passe par le social, pas par la répression." }
  },
  jean_luc_dupont: {
    logement: { position: 85, priority: 'high', quote: "Les travailleurs méritent un toit décent." },
    transports: { position: 75, priority: 'medium', quote: "Les transports gratuits, c'est du pouvoir d'achat." },
    budget: { position: 35, priority: 'low', quote: "Les riches peuvent payer plus." },
    entreprises: { position: 25, priority: 'medium', quote: "Assez de cadeaux au patronat !" }
  },
  fatima_benali: {
    éducation: { position: 90, priority: 'high', quote: "L'éducation est la clé de tout." },
    culture: { position: 85, priority: 'high', quote: "La culture rapproche les gens." },
    sécurité: { position: 45, priority: 'medium', quote: "La prévention vaut mieux que la répression." }
  },
  philippe_bertrand: {
    entreprises: { position: 85, priority: 'high', quote: "Les entreprises créent l'emploi." },
    budget: { position: 75, priority: 'high', quote: "On doit gérer la ville comme une entreprise." },
    impôts: { position: 25, priority: 'high', quote: "Trop d'impôts tue l'impôt." },
    logement: { position: 35, priority: 'low', quote: "Le marché doit s'autoréguler." }
  },
  marie_duval: {
    sécurité: { position: 80, priority: 'high', quote: "L'ordre est le fondement de la société." },
    budget: { position: 85, priority: 'high', quote: "Pas de dépenses inutiles." },
    tradition: { position: 75, priority: 'medium', quote: "Respectons notre patrimoine." }
  },
  xavier_moreau: {
    commerce: { position: 90, priority: 'high', quote: "Le centre-ville doit vivre !" },
    parking: { position: 80, priority: 'high', quote: "Sans voiture, plus de clients." },
    sécurité: { position: 65, priority: 'medium', quote: "Mes clients veulent se sentir en sécurité." }
  },
  bernard_lambert: {
    sécurité: { position: 95, priority: 'high', quote: "Il faut de la fermeté !" },
    immigration: { position: 10, priority: 'high', quote: "La France aux Français." },
    tradition: { position: 85, priority: 'medium', quote: "On a perdu nos repères." },
    budget: { position: 60, priority: 'medium', quote: "L'armée et la police d'abord." }
  },
  sophie_leroux: {
    santé: { position: 85, priority: 'high', quote: "La prévention sauve des vies." },
    éducation: { position: 75, priority: 'medium', quote: "Éduquer pour prévenir." },
    environnement: { position: 70, priority: 'medium', quote: "La santé et l'environnement sont liés." }
  },
  antoine_perrin: {
    urbanisme: { position: 85, priority: 'high', quote: "La ville doit se réinventer." },
    transports: { position: 80, priority: 'high', quote: "Moins de voitures, plus de vie." },
    environnement: { position: 80, priority: 'high', quote: "Une ville verte est une ville saine." },
    innovation: { position: 75, priority: 'medium', quote: "Embrassons le futur." }
  },
  claire_martin: {
    éducation: { position: 85, priority: 'high', quote: "L'école forme les citoyens de demain." },
    culture: { position: 80, priority: 'high', quote: "La culture élève les esprits." },
    social: { position: 65, priority: 'medium', quote: "N'oublions personne." }
  }
}

// Fonction pour initialiser les conseillers avec leur état dynamique
export const initializeCouncilors = () => {
  return COUNCILORS.map(c => ({
    ...c,
    // État dynamique
    relationship: 50, // Relation avec le maire (0-100)
    mood: 'neutral', // neutral, happy, angry, worried
    recentInteractions: [],
    opinions: COUNCILOR_OPINIONS[c.id] || {},
    votingHistory: [],
    consultedThisTurn: false
  }))
}

// Fonction pour obtenir l'avis d'un conseiller sur un theme
export const getCouncilorOpinion = (councilor, theme) => {
  const opinion = councilor.opinions?.[theme]
  if (!opinion) {
    // Opinion par défaut basée sur l'alignement
    const defaultByAlignment = {
      gauche: { social: 80, securite: 30, budget: 40 },
      droite: { social: 35, securite: 75, budget: 80 },
      extreme_droite: { social: 20, securite: 90, budget: 50 },
      centre: { social: 55, securite: 55, budget: 60 }
    }
    return defaultByAlignment[councilor.alignment]?.[theme] || 50
  }
  return opinion.position
}
