// Module Moteurs electriques - Theorie, couplages, demarrage, protection

export const moteursCategories = [
  { id: 'general', nom: 'Principes généraux', icon: '⚙️', color: 'blue',
    description: 'Fonctionnement, constitution, formules de base' },
  { id: 'monophase', nom: 'Moteurs monophasés', icon: '🔌', color: 'amber',
    description: 'Condensateur, types, applications domestiques' },
  { id: 'triphase', nom: 'Moteurs triphasés', icon: '⚡', color: 'violet',
    description: 'Caractéristiques, couplage, démarrage, protection' }
]

export const moteursFiches = {
  'general': {
    titre: 'Principes des moteurs électriques',
    intro: 'Un moteur électrique convertit l\'énergie électrique en énergie mécanique grâce à l\'interaction entre un champ magnétique et un courant électrique.',
    sections: [
      {
        titre: 'Constitution d\'un moteur',
        contenu: [
          { element: 'Stator', description: 'Partie fixe, crée le champ magnétique tournant grâce aux enroulements' },
          { element: 'Rotor', description: 'Partie mobile (cage d\'écureuil ou bobiné), entraîne l\'arbre moteur' },
          { element: 'Entrefer', description: 'Espace d\'air entre stator et rotor (0.3 à 2mm)' },
          { element: 'Paliers', description: 'Roulements à billes ou rouleaux supportant l\'arbre' },
          { element: 'Ventilateur', description: 'Refroidissement du moteur, côté opposé à l\'arbre' },
          { element: 'Boîte à bornes', description: 'Plaque à bornes pour le raccordement électrique' }
        ]
      },
      {
        titre: 'Champ magnétique tournant',
        contenu: 'En triphasé, les 3 enroulements décalés de 120° créent un champ magnétique tournant à la vitesse de synchronisme. Ce champ induit des courants dans le rotor (loi de Lenz) qui créent une force entraînant la rotation. Le rotor tourne toujours moins vite que le champ (glissement).'
      },
      {
        titre: 'Formules fondamentales',
        formules: [
          { nom: 'Vitesse de synchronisme', formule: 'Ns = 60 × f / p', description: 'f = fréquence (50Hz), p = nombre de paires de pôles' },
          { nom: 'Glissement', formule: 'g = (Ns - N) / Ns', description: 'N = vitesse réelle du rotor, g typique = 3 à 5%' },
          { nom: 'Couple', formule: 'C = P / Ω', description: 'P = puissance en W, Ω = vitesse angulaire (rad/s)' },
          { nom: 'Puissance absorbée', formule: 'Pa = √3 × U × I × cos φ', description: 'Pour moteur triphasé' },
          { nom: 'Rendement', formule: 'η = Pu / Pa', description: 'Pu = puissance utile mécanique' }
        ]
      },
      {
        titre: 'Vitesses de synchronisme (50Hz)',
        tableau: [
          { poles: 2, paires: 1, vitesse: '3000 tr/min' },
          { poles: 4, paires: 2, vitesse: '1500 tr/min' },
          { poles: 6, paires: 3, vitesse: '1000 tr/min' },
          { poles: 8, paires: 4, vitesse: '750 tr/min' }
        ]
      },
      {
        titre: 'Classes d\'isolation',
        contenu: [
          { classe: 'B', description: 'Température max 130°C', usage: 'Usage courant' },
          { classe: 'F', description: 'Température max 155°C', usage: 'Standard industrie' },
          { classe: 'H', description: 'Température max 180°C', usage: 'Environnements difficiles' }
        ]
      }
    ]
  },

  'monophase': {
    titre: 'Moteurs monophasés',
    intro: 'Les moteurs monophasés sont utilisés pour les petites puissances (< 3kW) en absence de réseau triphasé : électroménager, outillage, ventilation, pompes domestiques.',
    sections: [
      {
        titre: 'Problème du monophasé',
        contenu: 'Un enroulement unique alimenté en monophasé crée un champ pulsant, pas tournant. Le moteur ne peut pas démarrer seul. Il faut créer artificiellement une 2ème phase décalée pour obtenir un champ tournant au démarrage.'
      },
      {
        titre: 'Types de moteurs monophasés',
        contenu: [
          { type: 'À condensateur permanent', description: 'Condensateur toujours en circuit avec l\'enroulement auxiliaire. Simple, couple constant.', puissance: '< 1kW' },
          { type: 'À condensateur de démarrage', description: 'Gros condensateur + interrupteur centrifuge qui déconnecte après démarrage. Fort couple de démarrage.', puissance: '< 2kW' },
          { type: 'À double condensateur', description: 'Un pour le démarrage (fort), un permanent (faible). Performances optimales.', puissance: '< 3kW' },
          { type: 'À spire de Frager', description: 'Spire en court-circuit décalée, très simple mais faible rendement. Petits ventilateurs.', puissance: '< 100W' }
        ]
      },
      {
        titre: 'Rôle du condensateur',
        contenu: 'Le condensateur crée un déphasage d\'environ 90° entre l\'enroulement principal et l\'enroulement auxiliaire, simulant un système diphasé qui génère un champ tournant.'
      },
      {
        titre: 'Dimensionnement condensateur',
        formules: [
          { nom: 'Condensateur permanent', formule: 'C ≈ 70 × P (kW) en µF', description: 'Approximation pour moteur 230V standard' },
          { nom: 'Condensateur démarrage', formule: 'C ≈ 250 × P (kW) en µF', description: 'Valeur 3-4× plus élevée, usage temporaire' }
        ]
      },
      {
        titre: 'Inversion de sens',
        contenu: 'Pour inverser le sens de rotation d\'un moteur monophasé, il faut inverser le branchement de l\'enroulement auxiliaire (celui avec le condensateur) par rapport à l\'enroulement principal.',
        regles: [
          'Repérer l\'enroulement auxiliaire (souvent fils marron/noir)',
          'Inverser les 2 fils de cet enroulement',
          'Ne jamais inverser les fils du condensateur seul'
        ]
      },
      {
        titre: 'Pannes courantes',
        contenu: [
          { element: 'Condensateur HS', description: 'Le moteur grogne mais ne démarre pas, ou démarre difficilement. Tester avec un capacimètre.' },
          { element: 'Centrifuge bloqué', description: 'Le moteur ne prend pas sa vitesse ou chauffe. Vérifier que le contacteur centrifuge s\'ouvre.' },
          { element: 'Enroulement coupé', description: 'Mesurer la continuité des enroulements à l\'ohmmètre.' }
        ]
      }
    ]
  },

  'triphase': {
    titre: 'Moteurs triphasés asynchrones',
    intro: 'Le moteur asynchrone triphasé (MAS) est le plus répandu dans l\'industrie grâce à sa robustesse, son faible coût et sa facilité d\'entretien. Cette fiche couvre les caractéristiques, le couplage, le démarrage et la protection.',
    sections: [
      {
        titre: 'Caractéristiques nominales',
        contenu: [
          { param: 'Puissance nominale (Pn)', description: 'Puissance mécanique sur l\'arbre en kW' },
          { param: 'Tension nominale (Un)', description: 'Tensions étoile/triangle (ex: 400V/690V ou 230V/400V)' },
          { param: 'Intensité nominale (In)', description: 'Courant absorbé en régime nominal' },
          { param: 'Vitesse nominale (Nn)', description: 'Vitesse en tr/min sous charge nominale (ex: 1450 tr/min)' },
          { param: 'Facteur de puissance (cos φ)', description: 'Typiquement 0.80 à 0.85 à pleine charge' },
          { param: 'Rendement (η)', description: 'Rapport puissance mécanique/électrique, 75% à 95% selon taille' }
        ]
      },
      {
        titre: 'Lecture plaque signalétique',
        contenu: 'La plaque indique les 2 tensions possibles (ex: 230V/400V) et les courants correspondants. La petite tension correspond au couplage triangle, la grande au couplage étoile.',
        regles: [
          'Moteur 230V/400V sur réseau 400V → Couplage ÉTOILE',
          'Moteur 230V/400V sur réseau 230V → Couplage TRIANGLE',
          'Moteur 400V/690V sur réseau 400V → Couplage TRIANGLE',
          'Moteur 400V/690V sur réseau 690V → Couplage ÉTOILE'
        ]
      },
      {
        titre: 'Couplage ÉTOILE (Y)',
        contenu: [
          { point: 'Connexion', description: 'Les 3 fins d\'enroulements (U2, V2, W2) sont reliées ensemble au point neutre' },
          { point: 'Tension enroulement', description: 'Chaque enroulement reçoit U/√3 (230V pour réseau 400V)' },
          { point: 'Courant', description: 'I ligne = I enroulement' },
          { point: 'Barrettes', description: 'Positionnées verticalement en bas de la plaque à bornes' }
        ]
      },
      {
        titre: 'Couplage TRIANGLE (Δ)',
        contenu: [
          { point: 'Connexion', description: 'Chaque fin d\'enroulement reliée au début du suivant (U1-W2, V1-U2, W1-V2)' },
          { point: 'Tension enroulement', description: 'Chaque enroulement reçoit la tension composée U (400V)' },
          { point: 'Courant', description: 'I ligne = √3 × I enroulement' },
          { point: 'Barrettes', description: 'Positionnées horizontalement sur la plaque à bornes' }
        ]
      },
      {
        titre: 'Démarrage direct',
        contenu: [
          { avantage: 'Simple, économique, couple maximal disponible' },
          { inconvenient: 'Pointe de courant 5 à 8 × In au démarrage' },
          { inconvenient: 'Chute de tension sur le réseau, perturbations' },
          { limite: 'Réservé aux moteurs < 5.5 kW environ' }
        ]
      },
      {
        titre: 'Démarrage étoile-triangle (Y/Δ)',
        contenu: [
          { phase: '1. Étoile', description: 'Tension réduite U/√3, courant et couple divisés par 3' },
          { phase: '2. Commutation', description: 'Temporisation 3-10s, passage en triangle' },
          { phase: '3. Triangle', description: 'Fonctionnement normal pleine puissance' },
          { avantage: 'Courant de démarrage divisé par 3' },
          { inconvenient: 'Couple divisé par 3 aussi (démarrage à vide ou faible charge)' },
          { condition: 'Le moteur doit fonctionner en triangle sur le réseau (ex: 400V/690V sur réseau 400V)' }
        ]
      },
      {
        titre: 'Autres démarrages',
        contenu: [
          { type: 'Démarreur progressif', description: 'Thyristors augmentant progressivement la tension. Pas d\'à-coup, courant limité réglable.', puissance: 'Toutes' },
          { type: 'Variateur de fréquence', description: 'Variation de fréquence et tension. Démarrage parfait + variation de vitesse + économies d\'énergie.', puissance: 'Toutes' }
        ]
      },
      {
        titre: 'Protection thermique',
        contenu: [
          { dispositif: 'Relais thermique', description: 'Bilames chauffées par le courant. Régler sur In du moteur.', reglage: 'Classe 10 (normal), 20 ou 30 (démarrage lourd)' },
          { dispositif: 'Sonde PTC', description: 'Thermistance dans les enroulements, mesure directe de température', avantage: 'Protection optimale contre échauffement' },
          { dispositif: 'Sonde PT100', description: 'Sonde de précision pour surveillance continue sur gros moteurs' }
        ]
      },
      {
        titre: 'Protection court-circuit',
        contenu: [
          { dispositif: 'Fusibles aM', description: 'Type "accompagnement Moteur", supportent le courant de démarrage sans fondre' },
          { dispositif: 'Disjoncteur moteur', description: 'Magnétique (court-circuit) + thermique (surcharge) intégrés. Solution compacte.' }
        ]
      },
      {
        titre: 'Règles de câblage',
        regles: [
          'Section des conducteurs selon intensité nominale',
          'Longueur de câble limitée (chute de tension < 3%)',
          'Disjoncteur ou fusibles en tête de ligne',
          'Contacteur dimensionné selon catégorie AC3',
          'Relais thermique réglé sur In (pas sur Id)',
          'Mise à la terre obligatoire (borne PE)'
        ]
      }
    ]
  }
}

export function getCategoryById(id) {
  return moteursCategories.find(c => c.id === id)
}

export function getFicheById(id) {
  return moteursFiches[id]
}

export function getAllCategories() {
  return moteursCategories
}
