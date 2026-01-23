// Habilitations électriques - UTE C18-510
// Source: Support de formation habilitation électrique

export const habilitations = {
  source: "NF C18-510",
  description: "Recueil d'instructions de sécurité d'ordre électrique",

  domainesTension: [
    {
      domaine: "TBT",
      nom: "Très Basse Tension",
      limites: {
        alternatif: "≤ 50V",
        continu: "≤ 120V"
      },
      risques: "Risque d'électrisation réduit mais non nul"
    },
    {
      domaine: "BT",
      nom: "Basse Tension",
      limites: {
        alternatif: "50V < U ≤ 1000V",
        continu: "120V < U ≤ 1500V"
      },
      risques: "Risque d'électrocution",
      symbole: "B"
    },
    {
      domaine: "HTA",
      nom: "Haute Tension A",
      limites: {
        alternatif: "1000V < U ≤ 50 000V",
        continu: "1500V < U ≤ 75 000V"
      },
      risques: "Risque mortel - amorçage possible",
      symbole: "H"
    },
    {
      domaine: "HTB",
      nom: "Haute Tension B",
      limites: {
        alternatif: "> 50 000V",
        continu: "> 75 000V"
      },
      risques: "Risque mortel - grands réseaux de transport",
      symbole: "H"
    }
  ],

  symboles: {
    premiere: {
      B: "Basse Tension et Très Basse Tension",
      H: "Haute Tension (HTA et HTB)"
    },
    deuxieme: {
      "0": "Non électricien - Travaux non électriques",
      "1": "Électricien exécutant",
      "2": "Chargé de travaux (électricien)",
      C: "Chargé de consignation",
      R: "Chargé d'intervention générale (BT uniquement)",
      S: "Chargé d'intervention élémentaire (BT uniquement)",
      E: "Chargé d'opérations spécifiques",
      P: "Opérations sur installations photovoltaïques"
    },
    attributs: {
      V: "Travaux au voisinage",
      T: "Travaux sous tension",
      N: "Travaux de nettoyage sous tension",
      X: "Opération spéciale (définie par instruction)"
    }
  },

  niveaux: [
    {
      id: "b0",
      symbole: "B0",
      titre: "Non électricien en BT",
      description: "Exécutant de travaux non électriques dans un environnement électrique BT",
      activites: [
        "Travaux de maçonnerie à proximité d'installations",
        "Peinture près de tableaux électriques",
        "Nettoyage de locaux électriques"
      ],
      competences: [
        "Identifier les risques électriques",
        "Connaître les zones et distances de sécurité",
        "Appliquer les consignes de sécurité données"
      ],
      prerequis: "Aucun prérequis électrique",
      dureeFormation: "1 jour",
      tpElectricien: false
    },
    {
      id: "b1",
      symbole: "B1",
      titre: "Électricien exécutant BT",
      description: "Exécute des travaux électriques hors tension sous la direction d'un B2",
      activites: [
        "Câblage de tableaux",
        "Tirage de câbles",
        "Raccordement d'appareillages",
        "Pose de chemins de câbles"
      ],
      competences: [
        "Réaliser des travaux électriques hors tension",
        "Respecter les instructions du chargé de travaux",
        "Identifier la zone de travail",
        "Utiliser les EPI adaptés"
      ],
      prerequis: "Compétences en électricité",
      dureeFormation: "2 jours",
      tpElectricien: true,
      attributPossible: ["V"]
    },
    {
      id: "b1v",
      symbole: "B1V",
      titre: "Électricien exécutant BT avec voisinage",
      description: "Exécute des travaux hors tension au voisinage de pièces nues sous tension",
      activites: [
        "Travaux dans armoire partiellement consignée",
        "Intervention à proximité de jeux de barres sous tension",
        "Câblage près de circuits sous tension"
      ],
      competences: [
        "Toutes compétences B1",
        "Identifier les pièces nues sous tension",
        "Respecter les distances de voisinage",
        "Mettre en place des protections (nappes, écrans)"
      ],
      prerequis: "B1 + formation voisinage",
      dureeFormation: "2-3 jours",
      tpElectricien: true
    },
    {
      id: "b2",
      symbole: "B2",
      titre: "Chargé de travaux BT",
      description: "Dirige et surveille les travaux électriques, assure la sécurité de l'équipe",
      activites: [
        "Organiser et diriger un chantier électrique",
        "Réceptionner une consignation",
        "Délimiter la zone de travail",
        "Encadrer les exécutants"
      ],
      competences: [
        "Toutes compétences B1V",
        "Analyser les risques du chantier",
        "Rédiger les documents de travail",
        "Assurer la sécurité collective",
        "Communiquer avec le chargé de consignation"
      ],
      prerequis: "B1V + expérience terrain",
      dureeFormation: "3 jours",
      tpElectricien: true,
      attributPossible: ["V", "Essai"]
    },
    {
      id: "br",
      symbole: "BR",
      titre: "Chargé d'intervention générale BT",
      description: "Réalise des interventions de dépannage, connexion/déconnexion en BT",
      activites: [
        "Dépannage et recherche de pannes",
        "Remplacement de fusibles, disjoncteurs",
        "Raccordement de nouveaux circuits",
        "Mise en service d'équipements"
      ],
      competences: [
        "Réaliser une consignation pour son propre compte",
        "Effectuer des mesures et essais",
        "Intervenir sur circuits terminaux ≤ 63A et 400V",
        "Analyser les schémas et installations"
      ],
      prerequis: "Formation électricien + expérience",
      dureeFormation: "3 jours",
      tpElectricien: true,
      limites: "Circuits ≤ 63A et ≤ 400V entre phases"
    },
    {
      id: "bc",
      symbole: "BC",
      titre: "Chargé de consignation BT",
      description: "Réalise les opérations de consignation et déconsignation",
      activites: [
        "Séparer l'ouvrage des sources",
        "Condamner les organes de séparation",
        "Vérifier l'absence de tension (VAT)",
        "Mettre à la terre et en court-circuit",
        "Délivrer l'attestation de consignation"
      ],
      competences: [
        "Maîtriser les procédures de consignation",
        "Identifier tous les organes de coupure",
        "Utiliser le matériel de VAT",
        "Rédiger les documents de consignation"
      ],
      prerequis: "Connaissances approfondies BT",
      dureeFormation: "2 jours (souvent avec BR)",
      tpElectricien: true
    },
    {
      id: "bs",
      symbole: "BS",
      titre: "Chargé d'intervention élémentaire BT",
      description: "Réalise des interventions simples de remplacement et raccordement",
      activites: [
        "Remplacement à l'identique (prises, interrupteurs, fusibles)",
        "Raccordement de matériels simples",
        "Réarmement de protections"
      ],
      competences: [
        "Identifier les risques électriques",
        "Mettre hors tension pour son intervention",
        "Effectuer des remplacements simples",
        "Vérifier le bon fonctionnement"
      ],
      prerequis: "Formation courte - non électricien",
      dureeFormation: "1-2 jours",
      tpElectricien: false,
      limites: "Remplacement à l'identique uniquement, circuits ≤ 400V"
    },
    {
      id: "be",
      symbole: "BE",
      titre: "Chargé d'opérations spécifiques BT",
      description: "Réalise des opérations spécifiques (mesures, essais, vérifications)",
      attributs: [
        { code: "Mesurage", description: "Mesures électriques" },
        { code: "Vérification", description: "Contrôles et vérifications" },
        { code: "Essai", description: "Essais fonctionnels" },
        { code: "Manœuvre", description: "Manœuvres d'exploitation" }
      ],
      prerequis: "Selon opération spécifique",
      dureeFormation: "1-2 jours",
      tpElectricien: false
    },
    {
      id: "h0",
      symbole: "H0",
      titre: "Non électricien en HT",
      description: "Accès à un local HT pour travaux non électriques",
      activites: [
        "Travaux de génie civil en poste HT",
        "Nettoyage de locaux HT"
      ],
      competences: [
        "Identifier les zones à risque HT",
        "Respecter les distances de sécurité HT",
        "Appliquer strictement les consignes"
      ],
      prerequis: "Aucun prérequis électrique",
      dureeFormation: "1 jour",
      tpElectricien: false
    }
  ],

  distancesSecurite: {
    BT: {
      DMA: "0.3m (Distance Minimale d'Approche)",
      DLVS: "0.3m (Distance Limite de Voisinage Simple)",
      DLVR: "0.3m (Distance Limite de Voisinage Renforcé)"
    },
    HTA: {
      DMA: "0.6m",
      DLVS: "2m",
      DLVR: "0.6m"
    },
    HTB: {
      DMA: "Variable selon tension",
      DLVS: "Variable selon tension",
      calcul: "t + 0.005 × Un (kV)"
    }
  },

  zones: [
    {
      numero: 0,
      nom: "Zone d'investigation",
      description: "Zone éloignée des pièces sous tension",
      acces: "Tout personnel (pas d'habilitation requise)"
    },
    {
      numero: 1,
      nom: "Zone de voisinage simple",
      description: "Entre la limite de zone 0 et la DLVS",
      acces: "Personnel habilité ou surveillé"
    },
    {
      numero: 2,
      nom: "Zone de voisinage renforcé HT",
      description: "Entre DLVS et DLVR (HT uniquement)",
      acces: "Personnel habilité H1V, H2V"
    },
    {
      numero: 3,
      nom: "Zone des travaux sous tension HT",
      description: "Entre DLVR et DMA",
      acces: "Personnel TST habilité"
    },
    {
      numero: 4,
      nom: "Zone de travaux sous tension BT",
      description: "À moins de DMA en BT",
      acces: "Personnel habilité BT"
    }
  ],

  epiObligatoires: [
    {
      categorie: "Protection de la tête",
      equipements: ["Casque isolant ou écran facial anti-UV"]
    },
    {
      categorie: "Protection des yeux",
      equipements: ["Lunettes ou écran facial anti-UV/arc"]
    },
    {
      categorie: "Protection des mains",
      equipements: [
        "Gants isolants classe 00 (500V)",
        "Gants isolants classe 0 (1000V)",
        "Gants isolants classe 1-4 (HT)"
      ]
    },
    {
      categorie: "Protection du corps",
      equipements: ["Vêtements de travail non fondants", "Combinaison anti-arc si nécessaire"]
    },
    {
      categorie: "Protection des pieds",
      equipements: ["Chaussures de sécurité isolantes"]
    }
  ],

  consignation: {
    etapes: [
      {
        numero: 1,
        nom: "Séparation",
        description: "Isoler l'ouvrage de toutes sources d'énergie",
        actions: ["Ouvrir l'organe de séparation", "Vérifier la séparation visible ou position certaine"]
      },
      {
        numero: 2,
        nom: "Condamnation",
        description: "Bloquer l'organe de séparation en position ouverte",
        actions: ["Verrouiller par cadenas", "Apposer pancarte \"Défense de manœuvrer\"", "Retirer clé"]
      },
      {
        numero: 3,
        nom: "Identification",
        description: "S'assurer que l'installation consignée est bien celle à travailler",
        actions: ["Vérifier concordance avec schémas", "Identifier visuellement l'ouvrage"]
      },
      {
        numero: 4,
        nom: "VAT + MALT/CCT",
        description: "Vérifier l'Absence de Tension puis Mise À La Terre et Court-Circuit",
        actions: [
          "Vérifier le VAT avant et après utilisation",
          "Effectuer la VAT sur tous les conducteurs actifs",
          "Mettre à la terre et en court-circuit (si nécessaire)"
        ]
      }
    ],
    documents: [
      "Attestation de consignation",
      "Autorisation de travail",
      "Avis de fin de travail",
      "Attestation de déconsignation"
    ]
  },

  accidentElectrique: {
    conduite: [
      {
        etape: "Protéger",
        actions: [
          "Couper l'alimentation si possible",
          "Ne pas toucher la victime si elle est encore en contact",
          "Baliser la zone"
        ]
      },
      {
        etape: "Alerter",
        actions: [
          "Appeler le 15 (SAMU) ou 18 (Pompiers) ou 112",
          "Donner localisation précise",
          "Décrire l'état de la victime"
        ]
      },
      {
        etape: "Secourir",
        actions: [
          "Ne pas déplacer sauf danger immédiat",
          "Si inconscient mais respire : PLS",
          "Si arrêt respiratoire : RCP + DAE",
          "Couvrir la victime (choc)"
        ]
      }
    ],
    lesions: [
      "Brûlures (externes et internes)",
      "Tétanisation musculaire",
      "Fibrillation cardiaque",
      "Lésions neurologiques"
    ]
  }
}

export default habilitations
