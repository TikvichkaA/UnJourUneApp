// Données Courants Faibles - VDI, Communication, Alarmes

export const courantsFaiblesData = {
  categories: [
    {
      id: "coffret-communication",
      titre: "Coffret de communication",
      icon: "📦",
      color: "blue",
      description: "DTI, répartiteur RJ45, switch, emplacement box"
    },
    {
      id: "vdi",
      titre: "Infrastructure VDI",
      icon: "🔗",
      color: "purple",
      description: "Grades de câblage, types de câbles, certifications"
    },
    {
      id: "rj45",
      titre: "Câblage RJ45",
      icon: "🔌",
      color: "green",
      description: "Schémas T568A/B, raccordement, tests"
    },
    {
      id: "tv",
      titre: "Distribution TV",
      icon: "📺",
      color: "red",
      description: "Coaxial, amplificateurs, répartiteurs"
    },
    {
      id: "interphonie",
      titre: "Interphonie",
      icon: "🔔",
      color: "amber",
      description: "Interphone, visiophone, gâche électrique"
    },
    {
      id: "alarme",
      titre: "Systèmes d'alarme",
      icon: "🚨",
      color: "rose",
      description: "Intrusion, incendie, détecteurs"
    },
    {
      id: "fibre",
      titre: "Fibre optique",
      icon: "💎",
      color: "cyan",
      description: "PTO, ONT, raccordement FTTH"
    }
  ],

  fiches: {
    "coffret-communication": {
      titre: "Le Coffret de Communication",
      intro: "Le coffret de communication est le point central de l'infrastructure VDI du logement. Il regroupe tous les équipements nécessaires à la distribution des services de communication.",
      emplacement: {
        titre: "Emplacement",
        regles: [
          "Obligatoirement dans la GTL (Gaine Technique Logement)",
          "À proximité du tableau électrique",
          "Accessible pour maintenance",
          "Hauteur recommandée : entre 0,50 m et 1,30 m du sol"
        ]
      },
      elements: [
        {
          id: "dti",
          nom: "DTI - Dispositif de Terminaison Intérieure",
          description: "Point de démarcation entre le réseau opérateur et l'installation privée du logement.",
          role: [
            "Permet le test de la ligne téléphonique",
            "Séparation de responsabilité opérateur/abonné",
            "Point de coupure en cas de problème"
          ],
          emplacement: "En partie haute du coffret",
          conseil: "Ne jamais modifier le câblage côté opérateur"
        },
        {
          id: "repartiteur",
          nom: "Répartiteur RJ45 (Panneau de brassage)",
          description: "Panneau permettant de centraliser et distribuer toutes les connexions RJ45 du logement.",
          role: [
            "Centralise toutes les prises RJ45",
            "Permet le brassage (attribution des services)",
            "Facilite les tests et la maintenance"
          ],
          dimensionnement: "Prévoir 1 port par prise + 20% de réserve",
          conseil: "Étiqueter chaque port avec le numéro de prise correspondant"
        },
        {
          id: "switch",
          nom: "Switch Ethernet",
          description: "Commutateur réseau permettant de multiplier les connexions Ethernet actives.",
          role: [
            "Multiplie les ports réseau disponibles",
            "Permet à plusieurs appareils d'accéder au réseau",
            "Gère le trafic entre les appareils"
          ],
          caracteristiques: [
            "Minimum 5 ports recommandé",
            "Gigabit (1000 Mbps) obligatoire",
            "Alimentation POE optionnelle (caméras IP, téléphones)"
          ],
          conseil: "Choisir un switch administrable pour les installations complexes"
        },
        {
          id: "box",
          nom: "Emplacement Box Internet",
          description: "Espace réservé pour la box de l'opérateur (Livebox, Freebox, etc.).",
          role: [
            "Centralise l'accès Internet",
            "Fournit le WiFi",
            "Gère la téléphonie IP"
          ],
          exigences: [
            "Prise électrique dédiée à proximité",
            "Ventilation suffisante (éviter la surchauffe)",
            "Accès facile pour redémarrage"
          ]
        },
        {
          id: "ampli-tv",
          nom: "Amplificateur/Répartiteur TV",
          description: "Équipement pour distribuer le signal TV vers plusieurs prises.",
          role: [
            "Amplifie le signal TNT ou satellite",
            "Répartit vers les différentes prises TV",
            "Compense les pertes en ligne"
          ],
          conseil: "Un amplificateur n'est nécessaire que si plus de 2 prises TV"
        }
      ],
      schema: {
        description: "Organisation type d'un coffret de communication",
        zones: [
          { nom: "Zone haute", contenu: "DTI, arrivée opérateur" },
          { nom: "Zone centrale", contenu: "Répartiteur RJ45, switch" },
          { nom: "Zone basse", contenu: "Box Internet, alimentation" },
          { nom: "Zone latérale", contenu: "Distribution TV (si applicable)" }
        ]
      }
    },

    "vdi": {
      titre: "Infrastructure VDI",
      intro: "VDI = Voix Données Images. L'infrastructure VDI permet de distribuer tous les services de communication sur un câblage unique et évolutif.",
      grades: [
        {
          grade: "Grade 1",
          description: "Téléphone analogique uniquement",
          cable: "Paire torsadée simple (câble téléphonique)",
          debit: "Jusqu'à 100 Mbit/s théorique",
          services: ["Téléphone RTC"],
          obsolete: true,
          commentaire: "Ne plus installer, obsolète depuis 2016"
        },
        {
          grade: "Grade 2TV",
          description: "Minimum obligatoire en construction neuve depuis 2016",
          cable: "F/UTP Cat6 + câble coaxial",
          debit: "1 Gbit/s",
          services: [
            "Téléphone (analogique ou IP)",
            "Internet Gigabit",
            "TV TNT/Satellite (via coaxial)"
          ],
          obligatoire: true,
          commentaire: "Standard actuel pour le résidentiel neuf"
        },
        {
          grade: "Grade 3TV",
          description: "Recommandé pour préparer l'avenir",
          cable: "F/FTP Cat6a + câble coaxial",
          debit: "10 Gbit/s",
          services: [
            "Tous services Grade 2TV",
            "Streaming 4K/8K simultané",
            "Domotique IP avancée",
            "Multi-gamer sans latence"
          ],
          obligatoire: false,
          commentaire: "Investissement recommandé pour 10+ ans"
        },
        {
          grade: "Grade 4",
          description: "Très haut débit fibre optique",
          cable: "Fibre optique multimode ou monomode",
          debit: "10+ Gbit/s (évolutif)",
          services: [
            "Tous services sans limitation",
            "Future-proof pour décennies"
          ],
          obligatoire: false,
          commentaire: "Pour installations haut de gamme ou tertiaire"
        }
      ],
      typesDesCables: [
        {
          type: "UTP",
          nom: "Unshielded Twisted Pair",
          description: "Paires torsadées non blindées",
          usage: "Environnement résidentiel standard",
          avantages: ["Moins cher", "Plus souple"],
          inconvenients: ["Sensible aux perturbations"]
        },
        {
          type: "F/UTP",
          nom: "Foiled UTP",
          description: "Écran global en feuillard aluminium",
          usage: "Grade 2TV standard",
          avantages: ["Bonne protection CEM", "Prix raisonnable"],
          inconvenients: ["Nécessite mise à la terre de l'écran"]
        },
        {
          type: "F/FTP",
          nom: "Foiled Foiled Twisted Pair",
          description: "Écran global + écran par paire",
          usage: "Grade 3TV, environnements perturbés",
          avantages: ["Excellente immunité", "10 Gbit/s certifié"],
          inconvenients: ["Plus rigide", "Plus cher"]
        },
        {
          type: "S/FTP",
          nom: "Shielded Foiled Twisted Pair",
          description: "Tresse + écran par paire",
          usage: "Environnements industriels",
          avantages: ["Protection maximale"],
          inconvenients: ["Très rigide", "Installation délicate"]
        }
      ],
      reglesInstallation: [
        "Câblage en étoile depuis le coffret de communication",
        "Longueur maximale : 90 m entre coffret et prise",
        "Rayon de courbure : minimum 4x le diamètre du câble",
        "Séparation des courants forts : 30 cm minimum (50 cm recommandé)",
        "Pas de raccord intermédiaire (liaison point à point)",
        "Tester chaque liaison après installation"
      ]
    },

    "rj45": {
      titre: "Câblage RJ45",
      intro: "Le connecteur RJ45 (8P8C) est le standard pour les connexions Ethernet et téléphoniques VDI. La qualité du raccordement est cruciale pour les performances.",
      schemas: [
        {
          id: "t568a",
          nom: "T568A (Standard France/Europe)",
          description: "Standard recommandé en France pour les installations résidentielles",
          couleurs: [
            { pin: 1, couleur: "blanc-vert", paire: 3 },
            { pin: 2, couleur: "vert", paire: 3 },
            { pin: 3, couleur: "blanc-orange", paire: 2 },
            { pin: 4, couleur: "bleu", paire: 1 },
            { pin: 5, couleur: "blanc-bleu", paire: 1 },
            { pin: 6, couleur: "orange", paire: 2 },
            { pin: 7, couleur: "blanc-marron", paire: 4 },
            { pin: 8, couleur: "marron", paire: 4 }
          ],
          usage: "Installation résidentielle neuve en France"
        },
        {
          id: "t568b",
          nom: "T568B (Standard américain)",
          description: "Standard américain, courant en informatique d'entreprise",
          couleurs: [
            { pin: 1, couleur: "blanc-orange", paire: 2 },
            { pin: 2, couleur: "orange", paire: 2 },
            { pin: 3, couleur: "blanc-vert", paire: 3 },
            { pin: 4, couleur: "bleu", paire: 1 },
            { pin: 5, couleur: "blanc-bleu", paire: 1 },
            { pin: 6, couleur: "vert", paire: 3 },
            { pin: 7, couleur: "blanc-marron", paire: 4 },
            { pin: 8, couleur: "marron", paire: 4 }
          ],
          usage: "Réseaux informatiques, datacenters"
        }
      ],
      couleursCode: {
        "blanc-orange": "#FED7AA",
        "orange": "#F97316",
        "blanc-vert": "#BBF7D0",
        "vert": "#22C55E",
        "blanc-bleu": "#BFDBFE",
        "bleu": "#3B82F6",
        "blanc-marron": "#D6D3D1",
        "marron": "#78716C"
      },
      reglesCablage: [
        "Toujours utiliser le même schéma (T568A ou B) aux deux extrémités",
        "Détorsader le moins possible (max 13 mm pour Cat6)",
        "Respecter l'ordre des paires",
        "Couper proprement les conducteurs à la même longueur",
        "Vérifier le bon encliquetage dans le connecteur",
        "Tester avec un testeur de câblage"
      ],
      erreursFrequentes: [
        "Mélanger T568A et T568B sur une même liaison",
        "Détorsader excessivement les paires",
        "Inverser des fils au sein d'une paire (split pair)",
        "Endommager les conducteurs lors du sertissage",
        "Ne pas respecter le rayon de courbure"
      ],
      outillage: [
        { nom: "Pince à sertir RJ45", usage: "Sertissage des connecteurs mâles" },
        { nom: "Outil d'insertion (punch down)", usage: "Raccordement sur prises et panneaux" },
        { nom: "Testeur de câblage", usage: "Vérification de la continuité et du schéma" },
        { nom: "Dénudeur de câble", usage: "Retirer la gaine sans abîmer les paires" },
        { nom: "Pince coupante flush", usage: "Couper proprement les conducteurs" }
      ]
    },

    "tv": {
      titre: "Distribution TV",
      intro: "La distribution TV utilise le câble coaxial pour acheminer les signaux TNT, satellite ou câble vers les différentes prises du logement.",
      composants: [
        {
          id: "cable-coax",
          nom: "Câble coaxial",
          description: "Câble blindé pour transmission des signaux RF",
          types: [
            { ref: "17 VATC", usage: "Distribution intérieure standard", impedance: "75 Ω" },
            { ref: "19 VATC", usage: "Liaisons extérieures, descente antenne", impedance: "75 Ω" },
            { ref: "17 PATC", usage: "Distribution satellite individuelle", impedance: "75 Ω" }
          ]
        },
        {
          id: "prise-tv",
          nom: "Prise TV",
          description: "Point de connexion pour le téléviseur",
          types: [
            { type: "Simple", usage: "TNT uniquement" },
            { type: "Étoile", usage: "TNT + Satellite ou Câble" },
            { type: "Terminale", usage: "Dernière prise d'une ligne" },
            { type: "Passage", usage: "Prise intermédiaire sur une ligne" }
          ]
        },
        {
          id: "repartiteur",
          nom: "Répartiteur (splitter)",
          description: "Divise le signal vers plusieurs sorties",
          pertes: [
            { sorties: 2, perte: "4 dB" },
            { sorties: 3, perte: "6 dB" },
            { sorties: 4, perte: "8 dB" }
          ],
          conseil: "Utiliser un amplificateur si plus de 2 sorties"
        },
        {
          id: "amplificateur",
          nom: "Amplificateur",
          description: "Compense les pertes de signal",
          types: [
            { type: "Amplificateur d'intérieur", gain: "10-20 dB", usage: "Distribution 3-4 prises" },
            { type: "Amplificateur de mât", gain: "20-35 dB", usage: "Zone de réception faible" }
          ],
          conseil: "Ne pas sur-amplifier : risque de saturation"
        }
      ],
      topologies: [
        {
          type: "Étoile",
          description: "Chaque prise a son câble dédié depuis le coffret",
          avantages: ["Indépendance des prises", "Facilité de dépannage"],
          inconvenients: ["Plus de câble", "Répartiteur nécessaire"]
        },
        {
          type: "Cascade",
          description: "Les prises sont reliées en série",
          avantages: ["Moins de câble"],
          inconvenients: ["Pertes cumulées", "Panne affecte les prises suivantes"]
        }
      ],
      regles: [
        "Privilégier le câblage en étoile",
        "Utiliser des connecteurs F pour les raccordements",
        "Blindage obligatoire pour éviter les perturbations",
        "Séparer du câblage électrique (30 cm minimum)",
        "Prévoir une prise TV près de chaque prise RJ45"
      ]
    },

    "interphonie": {
      titre: "Interphonie",
      intro: "Les systèmes d'interphonie permettent la communication et le contrôle d'accès entre l'extérieur et l'intérieur du logement.",
      types: [
        {
          type: "Interphone audio",
          description: "Communication vocale uniquement",
          composants: ["Platine de rue", "Combiné intérieur", "Alimentation"],
          cablage: "2 fils minimum (audio + commun)",
          avantages: ["Simple", "Économique"],
          limites: ["Pas d'identification visuelle"]
        },
        {
          type: "Visiophone",
          description: "Communication audio + vidéo",
          composants: ["Platine de rue avec caméra", "Moniteur intérieur", "Alimentation"],
          cablage: "4 fils (vidéo, audio, masse, alimentation) ou 2 fils (bus)",
          avantages: ["Identification visuelle", "Enregistrement possible"],
          technologies: ["Analogique", "IP (sur réseau Ethernet)"]
        },
        {
          type: "Visiophone IP",
          description: "Visiophone connecté au réseau",
          composants: ["Platine IP", "Moniteur IP ou smartphone", "Switch POE"],
          cablage: "Câble Ethernet Cat5e minimum",
          avantages: ["Réponse à distance via smartphone", "Pas de limite de moniteurs"],
          prerequis: ["Connexion Internet", "Application mobile"]
        }
      ],
      gacheElectrique: {
        description: "Dispositif de déverrouillage de porte commandé électriquement",
        types: [
          { type: "À émission", description: "Déverrouille quand alimentée", securite: "Porte verrouillée si coupure" },
          { type: "À rupture", description: "Déverrouille quand coupée", securite: "Porte déverrouillée si coupure (sécurité incendie)" }
        ],
        alimentation: "12V AC/DC ou 24V selon modèle",
        conseil: "Prévoir un bouton poussoir de sortie côté intérieur"
      },
      cablage: {
        regles: [
          "Câble spécifique interphonie ou câble téléphonique",
          "Section minimale 0,6 mm² pour les distances courtes",
          "Gaine protectrice en extérieur",
          "Passage séparé du 230V",
          "Prévoir une alimentation dédiée"
        ],
        distances: "Consulter la notice constructeur (généralement 50 à 100 m max)"
      }
    },

    "alarme": {
      titre: "Systèmes d'alarme",
      intro: "Les systèmes d'alarme assurent la sécurité des biens et des personnes contre l'intrusion et l'incendie.",
      types: [
        {
          type: "Alarme intrusion",
          description: "Protection contre les cambriolages",
          composants: [
            { nom: "Centrale d'alarme", role: "Cerveau du système, traite les informations" },
            { nom: "Détecteur d'ouverture", role: "Surveille portes et fenêtres" },
            { nom: "Détecteur de mouvement", role: "Détecte les présences (IR, micro-ondes)" },
            { nom: "Sirène intérieure", role: "Alerte sonore dissuasive" },
            { nom: "Sirène extérieure", role: "Alerte le voisinage" },
            { nom: "Clavier/télécommande", role: "Armement/désarmement" },
            { nom: "Transmetteur", role: "Alerte à distance (GSM, IP)" }
          ]
        },
        {
          type: "Détection incendie",
          description: "Protection contre les risques de feu",
          composants: [
            { nom: "DAAF", role: "Détecteur Autonome Avertisseur de Fumée (obligatoire)" },
            { nom: "Détecteur de chaleur", role: "Pour les cuisines (évite fausses alertes)" },
            { nom: "Détecteur de CO", role: "Monoxyde de carbone (recommandé si combustion)" }
          ],
          obligations: "Au moins 1 DAAF par étage depuis mars 2015"
        }
      ],
      technologiesFil: {
        filaire: {
          avantages: ["Fiabilité maximale", "Pas de piles à changer", "Insensible aux perturbations radio"],
          inconvenients: ["Installation lourde", "Peu adapté à la rénovation"],
          cablage: "Câble alarme 4, 6 ou 8 conducteurs selon besoins"
        },
        sansFil: {
          avantages: ["Installation rapide", "Idéal en rénovation", "Évolutif"],
          inconvenients: ["Piles à surveiller", "Portée limitée", "Risque de brouillage"],
          technologies: ["433 MHz", "868 MHz (meilleur)", "Bidirectionnel recommandé"]
        },
        hybride: {
          description: "Centrale filaire + détecteurs sans fil",
          avantages: ["Flexibilité", "Fiabilité de la centrale"],
          usage: "Compromis idéal pour la plupart des installations"
        }
      },
      zonesProtection: [
        { zone: "Périmétrique", description: "Détection sur le périmètre (portes, fenêtres)", niveau: "Première ligne" },
        { zone: "Volumétrique", description: "Détection de mouvement intérieur", niveau: "Deuxième ligne" },
        { zone: "Ponctuelle", description: "Protection d'objets spécifiques (coffre)", niveau: "Protection ciblée" }
      ],
      conseilsInstallation: [
        "Détecteurs de mouvement : hauteur 2,10 m, angle de vue dégagé",
        "Éviter l'exposition directe au soleil (fausses alertes)",
        "Centrale dans un endroit discret mais accessible",
        "Sirène extérieure en hauteur (3 m minimum)",
        "Prévoir une alimentation secourue (batterie)"
      ]
    },

    "fibre": {
      titre: "Fibre Optique (FTTH)",
      intro: "La fibre optique FTTH (Fiber To The Home) est le standard actuel pour l'accès Internet très haut débit. L'électricien peut être amené à préparer l'infrastructure.",
      composants: [
        {
          id: "pto",
          nom: "PTO - Point de Terminaison Optique",
          description: "Prise où arrive la fibre dans le logement",
          role: [
            "Point de livraison de l'opérateur",
            "Séparation réseau opérateur / installation privée",
            "Emplacement de la soudure ou du connecteur"
          ],
          emplacement: "Dans la GTL, à proximité du coffret de communication",
          types: [
            { type: "PTO simple", usage: "1 opérateur, 1 fibre" },
            { type: "PTO 4 fibres", usage: "Multi-opérateurs, immeuble" }
          ]
        },
        {
          id: "ont",
          nom: "ONT - Optical Network Terminal",
          description: "Convertisseur optique/électrique (modem fibre)",
          role: [
            "Convertit le signal optique en signal électrique",
            "Fournit une sortie Ethernet vers la box ou le routeur"
          ],
          note: "Souvent intégré dans les box modernes (Livebox, Freebox)"
        },
        {
          id: "cable-fibre",
          nom: "Câble fibre optique",
          types: [
            { type: "Monomode (SM)", usage: "Longues distances, FTTH", couleur: "Jaune" },
            { type: "Multimode (MM)", usage: "Courtes distances, datacenter", couleur: "Orange/Aqua" }
          ],
          precautions: [
            "Très fragile : ne pas plier",
            "Rayon de courbure minimum : 30 mm",
            "Ne pas regarder l'extrémité (laser dangereux)",
            "Propreté absolue des connecteurs"
          ]
        }
      ],
      installationInterieure: {
        titre: "Rôle de l'électricien",
        taches: [
          "Poser le fourreau entre PM (palier) et GTL",
          "Prévoir l'emplacement du PTO dans la GTL",
          "Anticiper l'espace pour l'ONT/box fibre",
          "Ne PAS tirer la fibre (opérateur uniquement)"
        ],
        normes: [
          "Fourreau dédié (pas de mélange avec autres câbles)",
          "Diamètre minimum 10 mm",
          "Rayon de courbure respecté",
          "Repérage du fourreau"
        ]
      },
      connecteurs: [
        { type: "SC/APC", couleur: "Vert", usage: "Standard FTTH France" },
        { type: "SC/UPC", couleur: "Bleu", usage: "Réseaux data" },
        { type: "LC", usage: "Équipements actifs, haute densité" }
      ],
      glossaire: [
        { terme: "FTTH", definition: "Fiber To The Home - Fibre jusqu'à l'abonné" },
        { terme: "PM", definition: "Point de Mutualisation - Armoire de rue" },
        { terme: "PBO", definition: "Point de Branchement Optique - Boîtier immeuble/poteau" },
        { terme: "NRO", definition: "Nœud de Raccordement Optique - Central opérateur" }
      ]
    }
  }
}

// Fonctions utilitaires
export function getCategoryById(id) {
  return courantsFaiblesData.categories.find(cat => cat.id === id)
}

export function getFicheById(id) {
  return courantsFaiblesData.fiches[id]
}

export function getAllCategories() {
  return courantsFaiblesData.categories
}
