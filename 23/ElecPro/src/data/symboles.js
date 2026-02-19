// Données des symboles électriques NF C 15-100

export const symbolesData = {
  categories: [
    {
      id: "protection",
      titre: "Appareils de protection",
      icon: "🛡️",
      color: "blue",
      description: "Disjoncteurs, différentiels, fusibles"
    },
    {
      id: "eclairage",
      titre: "Éclairage",
      icon: "💡",
      color: "amber",
      description: "Points lumineux, DCL, détecteurs"
    },
    {
      id: "prises",
      titre: "Prises de courant",
      icon: "🔌",
      color: "green",
      description: "Prises 2P+T, spécialisées"
    },
    {
      id: "commandes",
      titre: "Commandes",
      icon: "🔘",
      color: "purple",
      description: "Interrupteurs, boutons poussoirs"
    },
    {
      id: "appareillage",
      titre: "Appareillage modulaire",
      icon: "📦",
      color: "cyan",
      description: "Télérupteur, contacteur, minuterie"
    },
    {
      id: "cablage",
      titre: "Câblage et repérage",
      icon: "🔗",
      color: "gray",
      description: "Conducteurs, connexions, terre"
    }
  ],

  symboles: [
    // === PROTECTION ===
    {
      id: "disjoncteur",
      category: "protection",
      nom: "Disjoncteur divisionnaire",
      description: "Protège un circuit contre les surcharges et courts-circuits",
      utilisation: "1 par circuit, calibre adapté (10A, 16A, 20A, 32A...)",
      astuce: "Le trait oblique indique la fonction de sectionnement",
      normeRef: "NF C 15-100"
    },
    {
      id: "disjoncteur-differentiel",
      category: "protection",
      nom: "Disjoncteur différentiel",
      description: "Combine protection magnéto-thermique et différentielle",
      utilisation: "Protection individuelle de circuits sensibles",
      astuce: "Le triangle Δ symbolise la fonction différentielle",
      normeRef: "NF C 15-100"
    },
    {
      id: "interrupteur-differentiel",
      category: "protection",
      nom: "Interrupteur différentiel",
      description: "Protection des personnes contre les contacts indirects",
      utilisation: "En tête de rangée, 30mA pour l'habitat",
      astuce: "Type A pour plaques/lave-linge, Type AC pour le reste",
      normeRef: "NF C 15-100"
    },
    {
      id: "fusible",
      category: "protection",
      nom: "Fusible (coupe-circuit)",
      description: "Protection par fusion d'un élément calibré",
      utilisation: "Remplacé par les disjoncteurs dans les installations modernes",
      astuce: "Symbole rectangulaire avec trait central",
      normeRef: "NF C 15-100"
    },
    {
      id: "parafoudre",
      category: "protection",
      nom: "Parafoudre",
      description: "Protection contre les surtensions atmosphériques",
      utilisation: "Obligatoire dans certaines zones (AQ2)",
      astuce: "Symbole avec flèche représentant la foudre",
      normeRef: "NF C 15-100"
    },
    {
      id: "disjoncteur-branchement",
      category: "protection",
      nom: "Disjoncteur de branchement",
      description: "Disjoncteur général d'abonné (AGCP)",
      utilisation: "En tête d'installation, différentiel 500mA sélectif",
      astuce: "Appelé aussi disjoncteur d'abonné ou DB",
      normeRef: "NF C 14-100"
    },

    // === ÉCLAIRAGE ===
    {
      id: "point-lumineux",
      category: "eclairage",
      nom: "Point lumineux (lampe)",
      description: "Symbole général d'un point d'éclairage",
      utilisation: "Représente tout type de luminaire",
      astuce: "Cercle avec croix à l'intérieur",
      normeRef: "NF C 15-100"
    },
    {
      id: "dcl",
      category: "eclairage",
      nom: "DCL (Dispositif de Connexion Luminaire)",
      description: "Boîte de connexion pour luminaire avec douille DCL",
      utilisation: "Obligatoire pour les points lumineux au plafond",
      astuce: "Permet le raccordement rapide des luminaires",
      normeRef: "NF C 15-100"
    },
    {
      id: "applique",
      category: "eclairage",
      nom: "Applique murale",
      description: "Point lumineux fixé au mur",
      utilisation: "Éclairage d'ambiance, couloirs",
      astuce: "Symbole lampe avec trait représentant le mur",
      normeRef: "NF C 15-100"
    },
    {
      id: "spot-encastre",
      category: "eclairage",
      nom: "Spot encastré",
      description: "Luminaire encastré dans le plafond",
      utilisation: "Faux-plafonds, éclairage directionnel",
      astuce: "Symbole lampe avec rectangle représentant l'encastrement",
      normeRef: "NF C 15-100"
    },
    {
      id: "detecteur-presence",
      category: "eclairage",
      nom: "Détecteur de présence",
      description: "Capteur infrarouge commandant l'éclairage",
      utilisation: "Couloirs, escaliers, extérieur",
      astuce: "Symbole avec secteur représentant la zone de détection",
      normeRef: "NF C 15-100"
    },
    {
      id: "sonnerie",
      category: "eclairage",
      nom: "Sonnerie",
      description: "Avertisseur sonore électrique",
      utilisation: "Entrée, portillon, signalisation",
      astuce: "Symbole en demi-cercle évoquant une cloche",
      normeRef: "NF C 15-100"
    },
    {
      id: "voyant",
      category: "eclairage",
      nom: "Voyant lumineux",
      description: "Témoin lumineux de signalisation",
      utilisation: "Indication d'état (marche/arrêt), signalisation tableau",
      astuce: "Petit cercle plein ou symbole lampe barré de flèches",
      normeRef: "NF C 15-100"
    },
    {
      id: "chauffage-electrique",
      category: "eclairage",
      nom: "Chauffage électrique",
      description: "Radiateur ou convecteur électrique",
      utilisation: "Chauffage des pièces, circuit dédié par radiateur ou zone",
      astuce: "Symbole rectangulaire avec zigzag de résistance",
      normeRef: "NF C 15-100"
    },
    {
      id: "hublot",
      category: "eclairage",
      nom: "Hublot",
      description: "Luminaire étanche pour l'extérieur ou pièces humides",
      utilisation: "Cave, garage, extérieur, salle de bain",
      astuce: "Indice IP adapté au local (IP44 minimum en extérieur)",
      normeRef: "NF C 15-100"
    },

    // === PRISES ===
    {
      id: "prise-2p-t",
      category: "prises",
      nom: "Prise 2P+T 16A",
      description: "Prise de courant standard avec terre",
      utilisation: "Usage général, circuit en 2,5mm² protégé par 20A",
      astuce: "Demi-cercle avec 2 traits horizontaux + 1 trait vertical (terre)",
      normeRef: "NF C 15-100"
    },
    {
      id: "prise-commandee",
      category: "prises",
      nom: "Prise commandée",
      description: "Prise dont l'alimentation est coupée par un interrupteur",
      utilisation: "Lampe de chevet, lampadaire",
      astuce: "Reliée au circuit éclairage, pas au circuit prises",
      normeRef: "NF C 15-100"
    },
    {
      id: "prise-20a",
      category: "prises",
      nom: "Prise 20A spécialisée",
      description: "Prise pour appareil de forte puissance",
      utilisation: "Four, lave-vaisselle (circuit dédié)",
      astuce: "Un circuit = un appareil",
      normeRef: "NF C 15-100"
    },
    {
      id: "prise-32a",
      category: "prises",
      nom: "Sortie de câble 32A",
      description: "Alimentation directe pour plaque de cuisson",
      utilisation: "Plaque de cuisson, câble 6mm²",
      astuce: "Pas de prise, câble en attente avec domino",
      normeRef: "NF C 15-100"
    },
    {
      id: "bloc-3-prises",
      category: "prises",
      nom: "Bloc de 3 prises 16A",
      description: "3 prises de courant regroupées dans un même boîtier",
      utilisation: "Plan de travail cuisine, bureau, multimédia",
      astuce: "Montées en dérivation, un seul circuit protégé par 20A",
      normeRef: "NF C 15-100"
    },
    {
      id: "bloc-4-prises",
      category: "prises",
      nom: "Bloc de 4 prises 16A",
      description: "4 prises de courant regroupées dans un même boîtier",
      utilisation: "Bureau, multimédia, plan de travail",
      astuce: "Montées en dérivation, comptent pour 1 socle dans le calcul NF C 15-100",
      normeRef: "NF C 15-100"
    },
    {
      id: "prise-rj45",
      category: "prises",
      nom: "Prise RJ45",
      description: "Prise réseau informatique/téléphone",
      utilisation: "Communication Grade 2TV minimum",
      astuce: "Câblage en étoile depuis le coffret de communication",
      normeRef: "NF C 15-100"
    },
    {
      id: "prise-tv",
      category: "prises",
      nom: "Prise TV",
      description: "Prise coaxiale pour télévision",
      utilisation: "TNT, satellite, câble",
      astuce: "Prévoir à côté de chaque prise RJ45 principale",
      normeRef: "NF C 15-100"
    },

    // === COMMANDES ===
    {
      id: "interrupteur-simple",
      category: "commandes",
      nom: "Interrupteur simple allumage",
      description: "Commande ON/OFF d'un point lumineux",
      utilisation: "1 interrupteur = 1 ou plusieurs lampes",
      astuce: "Cercle avec trait oblique",
      normeRef: "NF C 15-100"
    },
    {
      id: "interrupteur-double",
      category: "commandes",
      nom: "Interrupteur double allumage",
      description: "2 commandes indépendantes dans un même boîtier",
      utilisation: "Commander 2 circuits d'éclairage séparément",
      astuce: "2 traits obliques partant du même point",
      normeRef: "NF C 15-100"
    },
    {
      id: "va-et-vient",
      category: "commandes",
      nom: "Va-et-vient",
      description: "Commande d'un point lumineux depuis 2 endroits",
      utilisation: "Couloir, escalier, grande pièce avec 2 accès",
      astuce: "2 interrupteurs avec fils navettes (orange/violet)",
      normeRef: "NF C 15-100"
    },
    {
      id: "bouton-poussoir",
      category: "commandes",
      nom: "Bouton poussoir",
      description: "Contact momentané (retour automatique)",
      utilisation: "Avec télérupteur, minuterie, sonnette",
      astuce: "Symbole avec flèche indiquant le rappel",
      normeRef: "NF C 15-100"
    },
    {
      id: "interrupteur-voyant",
      category: "commandes",
      nom: "Interrupteur simple allumage avec voyant",
      description: "Interrupteur avec témoin lumineux intégré",
      utilisation: "Indique l'état de la lumière dans une pièce éloignée (cave, grenier)",
      astuce: "Cercle avec trait oblique et un point lumineux",
      normeRef: "NF C 15-100"
    },
    {
      id: "bouton-poussoir-lumineux",
      category: "commandes",
      nom: "Bouton poussoir lumineux",
      description: "Bouton poussoir avec voyant de signalisation",
      utilisation: "Repérage dans l'obscurité (couloirs, escaliers)",
      astuce: "Comme le bouton poussoir avec un point lumineux en plus",
      normeRef: "NF C 15-100"
    },
    {
      id: "interrupteur-bipolaire",
      category: "commandes",
      nom: "Interrupteur bipolaire",
      description: "Coupe simultanément la phase et le neutre",
      utilisation: "Chauffe-eau, radiateurs, sécurité renforcée",
      astuce: "2 pôles coupés ensemble, trait reliant les 2 leviers",
      normeRef: "NF C 15-100"
    },
    {
      id: "interrupteur-vmc",
      category: "commandes",
      nom: "Interrupteur VMC",
      description: "Commande de vitesse de la VMC",
      utilisation: "Petite/grande vitesse de la ventilation",
      astuce: "Souvent dans la cuisine",
      normeRef: "NF C 15-100"
    },
    {
      id: "interrupteur-volet",
      category: "commandes",
      nom: "Interrupteur volet roulant",
      description: "Commande montée/descente du volet",
      utilisation: "1 interrupteur par volet, montée/arrêt/descente",
      astuce: "Peut être centralisé ou individuel",
      normeRef: "NF C 15-100"
    },
    {
      id: "variateur",
      category: "commandes",
      nom: "Variateur",
      description: "Réglage de l'intensité lumineuse",
      utilisation: "Éclairage d'ambiance, compatible LED dimmables",
      astuce: "Vérifier la compatibilité avec les ampoules",
      normeRef: "NF C 15-100"
    },

    // === APPAREILLAGE MODULAIRE ===
    {
      id: "telerupteur",
      category: "appareillage",
      nom: "Télérupteur",
      description: "Relais bistable commandé par boutons poussoirs",
      utilisation: "Commande d'éclairage depuis 3 points ou plus",
      astuce: "Bobine A1-A2, contacts 1-2",
      normeRef: "NF C 15-100"
    },
    {
      id: "minuterie",
      category: "appareillage",
      nom: "Minuterie",
      description: "Temporisation de l'extinction de l'éclairage",
      utilisation: "Parties communes, couloirs, escaliers",
      astuce: "Réglage du temps, avec ou sans préavis",
      normeRef: "NF C 15-100"
    },
    {
      id: "contacteur",
      category: "appareillage",
      nom: "Contacteur",
      description: "Interrupteur de puissance commandé électriquement",
      utilisation: "Commande de charges importantes",
      astuce: "Bobine + contacts de puissance",
      normeRef: "NF C 15-100"
    },
    {
      id: "contacteur-jour-nuit",
      category: "appareillage",
      nom: "Contacteur jour/nuit",
      description: "Contacteur piloté par le signal heures creuses EDF",
      utilisation: "Chauffe-eau, programmation tarifaire",
      astuce: "3 positions: Auto/0/Marche forcée",
      normeRef: "NF C 15-100"
    },
    {
      id: "horloge",
      category: "appareillage",
      nom: "Horloge programmable",
      description: "Commande temporisée selon programme",
      utilisation: "Chauffage, éclairage extérieur, arrosage",
      astuce: "Journalière ou hebdomadaire",
      normeRef: "NF C 15-100"
    },
    {
      id: "delesteur",
      category: "appareillage",
      nom: "Délesteur",
      description: "Coupe les circuits non prioritaires en cas de surcharge",
      utilisation: "Évite le déclenchement du disjoncteur d'abonné",
      astuce: "Gère les priorités entre circuits",
      normeRef: "NF C 15-100"
    },
    {
      id: "thermostat",
      category: "appareillage",
      nom: "Thermostat",
      description: "Régulation de la température ambiante",
      utilisation: "Commande du chauffage central ou électrique",
      astuce: "Symbole avec θ (thêta) pour la température",
      normeRef: "NF C 15-100"
    },
    {
      id: "transformateur",
      category: "appareillage",
      nom: "Transformateur",
      description: "Convertit la tension (ex: 230V vers 12V ou 24V)",
      utilisation: "Sonnerie, éclairage basse tension, circuits de commande",
      astuce: "2 bobines couplées, symbolisées par 2 enroulements face à face",
      normeRef: "NF C 15-100"
    },

    // === CÂBLAGE ET REPÉRAGE ===
    {
      id: "arrivee-reseau",
      category: "cablage",
      nom: "Arrivée du réseau électrique",
      description: "Point d'entrée de l'alimentation EDF dans l'installation",
      utilisation: "En amont du disjoncteur de branchement (AGCP)",
      astuce: "3 traits obliques pour Ph, N, PE",
      normeRef: "NF C 14-100"
    },
    {
      id: "terre",
      category: "cablage",
      nom: "Prise de terre",
      description: "Connexion à la terre de l'installation",
      utilisation: "Sécurité des personnes, évacuation des défauts",
      astuce: "3 traits horizontaux décroissants",
      normeRef: "NF C 15-100"
    },
    {
      id: "liaison-equipotentielle",
      category: "cablage",
      nom: "Liaison équipotentielle",
      description: "Interconnexion des masses métalliques",
      utilisation: "Salle de bain, cuisine (canalisations)",
      astuce: "Fil vert/jaune 2,5mm² ou 4mm²",
      normeRef: "NF C 15-100"
    },
    {
      id: "boite-derivation",
      category: "cablage",
      nom: "Boîte de dérivation",
      description: "Point de jonction des conducteurs",
      utilisation: "Dérivations, raccordements",
      astuce: "Doit rester accessible après travaux",
      normeRef: "NF C 15-100"
    },
    {
      id: "conducteur-phase",
      category: "cablage",
      nom: "Conducteur de phase",
      description: "Fil sous tension (230V)",
      utilisation: "Alimentation des appareils",
      astuce: "Couleur: rouge, marron ou noir (jamais bleu ni vert/jaune)",
      normeRef: "NF C 15-100"
    },
    {
      id: "conducteur-neutre",
      category: "cablage",
      nom: "Conducteur de neutre",
      description: "Retour du courant vers le réseau",
      utilisation: "Toujours associé à la phase",
      astuce: "Couleur: BLEU obligatoirement",
      normeRef: "NF C 15-100"
    },
    {
      id: "conducteur-terre",
      category: "cablage",
      nom: "Conducteur de protection",
      description: "Mise à la terre des masses",
      utilisation: "Sécurité, doit être continu",
      astuce: "Couleur: VERT/JAUNE obligatoirement",
      normeRef: "NF C 15-100"
    },
    {
      id: "cable-encastre",
      category: "cablage",
      nom: "Câble encastré",
      description: "Câble passant dans les murs/cloisons",
      utilisation: "Installation encastrée standard",
      astuce: "Représenté par un trait continu",
      normeRef: "NF C 15-100"
    },
    {
      id: "cable-apparent",
      category: "cablage",
      nom: "Câble apparent",
      description: "Câble visible, en saillie",
      utilisation: "Rénovation, caves, garages",
      astuce: "Représenté par un trait pointillé",
      normeRef: "NF C 15-100"
    }
  ]
}

// Fonctions utilitaires
export function getSymbolesByCategory(categoryId) {
  return symbolesData.symboles.filter(s => s.category === categoryId)
}

export function getSymboleById(id) {
  return symbolesData.symboles.find(s => s.id === id)
}

export function getCategoryById(id) {
  return symbolesData.categories.find(c => c.id === id)
}

export function getAllSymboles() {
  return symbolesData.symboles
}

export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Progression localStorage
const PROGRESS_KEY = 'elecpro_symboles_progress'

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveProgress(symbolId, known) {
  const progress = getProgress()
  progress[symbolId] = {
    known,
    lastReview: Date.now(),
    reviewCount: (progress[symbolId]?.reviewCount || 0) + 1
  }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function getProgressStats() {
  const progress = getProgress()
  const total = symbolesData.symboles.length
  const reviewed = Object.keys(progress).length
  const known = Object.values(progress).filter(p => p.known).length

  return { total, reviewed, known, toReview: reviewed - known }
}
