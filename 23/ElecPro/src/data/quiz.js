// Questions de quiz - Préparation TP Électricien
// Catégories: normes, habilitations, referentiel, calculs

export const quizData = {
  categories: [
    {
      id: "normes",
      titre: "NF C 15-100",
      description: "Questions sur la norme d'installation électrique",
      icon: "📋",
      color: "blue"
    },
    {
      id: "habilitations",
      titre: "Habilitations",
      description: "Questions sur la sécurité électrique",
      icon: "🛡️",
      color: "amber"
    },
    {
      id: "pratique",
      titre: "Pratique terrain",
      description: "Mises en situation professionnelles",
      icon: "🔧",
      color: "green"
    },
    {
      id: "calculs",
      titre: "Calculs",
      description: "Dimensionnement et calculs",
      icon: "🧮",
      color: "purple"
    }
  ],

  questions: [
    // ===== NORMES NF C 15-100 =====
    {
      id: "n1",
      category: "normes",
      question: "Quelle est la section minimale pour un circuit prises 16A protégé par un disjoncteur 20A ?",
      options: ["1.5 mm²", "2.5 mm²", "4 mm²", "6 mm²"],
      correct: 1,
      explication: "Un circuit prises protégé par un disjoncteur 20A nécessite une section de 2.5 mm² minimum et peut alimenter jusqu'à 8 prises."
    },
    {
      id: "n2",
      category: "normes",
      question: "Combien de prises de courant minimum faut-il dans une chambre de 12m² ?",
      options: ["2", "3", "4", "5"],
      correct: 1,
      explication: "La NF C 15-100 impose minimum 3 prises de courant dans une chambre, dont une à proximité de l'interrupteur de commande."
    },
    {
      id: "n3",
      category: "normes",
      question: "Quel type de DDR est obligatoire pour le circuit lave-linge ?",
      options: ["Type AC", "Type A", "Type B", "Type F"],
      correct: 1,
      explication: "Le DDR Type A détecte les courants de défaut à composante continue pulsée, présents dans les lave-linge avec variateur électronique."
    },
    {
      id: "n4",
      category: "normes",
      question: "Quelle est la section du circuit plaque de cuisson ?",
      options: ["2.5 mm²", "4 mm²", "6 mm²", "10 mm²"],
      correct: 2,
      explication: "Le circuit plaque/cuisson doit être en 6 mm² protégé par un disjoncteur 32A (ou 10 mm² pour 40A)."
    },
    {
      id: "n5",
      category: "normes",
      question: "Dans quel volume de la salle de bain peut-on installer une prise de courant standard ?",
      options: ["Volume 0", "Volume 1", "Volume 2", "Hors volumes uniquement"],
      correct: 3,
      explication: "Les prises de courant (hors rasoir) ne sont autorisées que hors volumes, c'est-à-dire au-delà de 60cm du volume 1."
    },
    {
      id: "n6",
      category: "normes",
      question: "Quel est l'indice de protection minimum en volume 1 de salle de bain ?",
      options: ["IP21", "IP44", "IPX4 ou IPX5", "IP65"],
      correct: 2,
      explication: "En volume 1, l'IP minimum est IPX4 (protection contre projections), ou IPX5 si présence de jets d'eau (douches à jets)."
    },
    {
      id: "n7",
      category: "normes",
      question: "Combien de circuits maximum peut-on raccorder sur un DDR 40A ?",
      options: ["4", "6", "8", "10"],
      correct: 2,
      explication: "Un interrupteur différentiel 40A peut protéger jusqu'à 8 circuits. Pour un ID 63A, c'est également 8 circuits maximum."
    },
    {
      id: "n8",
      category: "normes",
      question: "Quelle est la largeur minimale de la GTL ?",
      options: ["450 mm", "500 mm", "600 mm", "700 mm"],
      correct: 2,
      explication: "La Gaine Technique Logement doit avoir une largeur minimale de 600 mm et une profondeur de 200 mm minimum."
    },
    {
      id: "n9",
      category: "normes",
      question: "Quel grade de câblage communication est obligatoire en construction neuve ?",
      options: ["Grade 1", "Grade 2TV", "Grade 3TV", "Grade 4"],
      correct: 1,
      explication: "Le Grade 2TV (câble F/UTP Cat6 + coaxial) est le minimum obligatoire pour les logements neufs depuis 2016."
    },
    {
      id: "n10",
      category: "normes",
      question: "À quelle hauteur minimum doit être installé le bord inférieur d'une prise de courant ?",
      options: ["0 cm", "5 cm", "10 cm", "15 cm"],
      correct: 1,
      explication: "Le bord inférieur des socles de prises doit être à 5 cm minimum du sol fini (ou 12 cm pour les prises à éclipses)."
    },
    {
      id: "n11",
      category: "normes",
      question: "Quel est le nombre minimum de prises de courant sur le plan de travail d'une cuisine > 4m² ?",
      options: ["2", "3", "4", "6"],
      correct: 2,
      explication: "Pour une cuisine de surface > 4m², il faut minimum 4 prises sur le plan de travail. Si ≤ 4m², 3 prises suffisent."
    },
    {
      id: "n12",
      category: "normes",
      question: "Quelle section pour un circuit de chauffage électrique de 4000W en 230V ?",
      options: ["1.5 mm²", "2.5 mm²", "4 mm²", "6 mm²"],
      correct: 1,
      explication: "4000W en 230V = 17.4A. Un circuit en 2.5 mm² protégé 20A convient (≤ 4500W). Au-delà, passer en 4 mm² / 25A."
    },
    {
      id: "n13",
      category: "normes",
      question: "Quel type de DDR pour une borne IRVE Mode 3 avec redresseur intégré ?",
      options: ["Type AC", "Type A", "Type F", "Type A ou B selon borne"],
      correct: 3,
      explication: "Pour les bornes IRVE, le type de DDR dépend de la borne : Type A minimum, Type F pour certaines, Type B si redresseur sans isolation galvanique."
    },
    {
      id: "n14",
      category: "normes",
      question: "La liaison équipotentielle supplémentaire (LES) est obligatoire dans quelle pièce ?",
      options: ["Cuisine", "Chambre", "Salle de bain", "Garage"],
      correct: 2,
      explication: "La LES est obligatoire dans les salles de bain. Elle relie tous les éléments conducteurs (tuyaux, huisseries métalliques, baignoire...)."
    },
    {
      id: "n15",
      category: "normes",
      question: "Quelle est la sensibilité maximale du DDR en amont d'une VMC ?",
      options: ["10 mA", "30 mA", "100 mA", "300 mA"],
      correct: 3,
      explication: "La VMC peut être protégée par un DDR 300mA si le circuit est dédié. Sinon, elle doit être sous DDR 30mA comme tout circuit."
    },

    // ===== HABILITATIONS =====
    {
      id: "h1",
      category: "habilitations",
      question: "Quelle est la limite haute de la Basse Tension (BT) en courant alternatif ?",
      options: ["50V", "400V", "1000V", "1500V"],
      correct: 2,
      explication: "En courant alternatif, la BT va de 50V à 1000V. Au-delà, c'est la Haute Tension (HTA jusqu'à 50kV, HTB au-delà)."
    },
    {
      id: "h2",
      category: "habilitations",
      question: "Que signifie le symbole B1V ?",
      options: [
        "Électricien exécutant BT avec voisinage",
        "Chargé de travaux BT",
        "Non électricien BT",
        "Chargé de consignation BT"
      ],
      correct: 0,
      explication: "B1V = B (Basse Tension) + 1 (exécutant électricien) + V (attribut voisinage : travaux à proximité de pièces nues sous tension)."
    },
    {
      id: "h3",
      category: "habilitations",
      question: "Quelle habilitation permet de réaliser une consignation ?",
      options: ["B1V", "BR", "BC", "B2"],
      correct: 2,
      explication: "Seul le BC (Chargé de Consignation) est habilité à réaliser les opérations de consignation et délivrer l'attestation."
    },
    {
      id: "h4",
      category: "habilitations",
      question: "Quelles sont les 4 étapes de la consignation dans l'ordre ?",
      options: [
        "VAT, Séparation, Condamnation, MALT",
        "Séparation, Condamnation, Identification, VAT+MALT",
        "Condamnation, Séparation, VAT, MALT",
        "Identification, Séparation, VAT, Condamnation"
      ],
      correct: 1,
      explication: "L'ordre est : 1. Séparation (couper), 2. Condamnation (verrouiller), 3. Identification (vérifier le bon circuit), 4. VAT puis MALT/CCT si nécessaire."
    },
    {
      id: "h5",
      category: "habilitations",
      question: "Quelle est la Distance Minimale d'Approche (DMA) en BT ?",
      options: ["0.15 m", "0.30 m", "0.60 m", "2 m"],
      correct: 1,
      explication: "En Basse Tension, la DMA est de 0.30 m (30 cm). C'est la distance en dessous de laquelle il y a risque de contact ou d'amorçage."
    },
    {
      id: "h6",
      category: "habilitations",
      question: "L'habilitation BR permet d'intervenir sur des circuits de quelle intensité maximum ?",
      options: ["32A", "40A", "63A", "100A"],
      correct: 2,
      explication: "Le BR (chargé d'intervention générale) peut intervenir sur des circuits terminaux ≤ 63A et ≤ 400V entre phases."
    },
    {
      id: "h7",
      category: "habilitations",
      question: "Quelles habilitations sont requises pour le TP Électricien d'Équipement ?",
      options: [
        "B0, BS",
        "B1V, BR, H0",
        "B2, BC",
        "H1, HC"
      ],
      correct: 1,
      explication: "Le référentiel RNCP36441 exige les habilitations B1(V), BR et H0 pour exercer le métier d'électricien d'équipement."
    },
    {
      id: "h8",
      category: "habilitations",
      question: "Que doit faire en premier une personne témoin d'un accident électrique ?",
      options: [
        "Appeler les secours",
        "Pratiquer un massage cardiaque",
        "Protéger et couper l'alimentation",
        "Mettre la victime en PLS"
      ],
      correct: 2,
      explication: "L'ordre est : 1. PROTÉGER (couper le courant, baliser), 2. ALERTER (15/18/112), 3. SECOURIR (PLS, RCP si nécessaire)."
    },
    {
      id: "h9",
      category: "habilitations",
      question: "Quel EPI est obligatoire pour travailler au voisinage de pièces nues sous tension ?",
      options: [
        "Casque de chantier standard",
        "Gants isolants adaptés à la tension",
        "Gilet haute visibilité",
        "Harnais antichute"
      ],
      correct: 1,
      explication: "Les gants isolants (classe adaptée à la tension) sont obligatoires pour tout travail au voisinage. Écran facial recommandé également."
    },
    {
      id: "h10",
      category: "habilitations",
      question: "Quelle est la différence entre BS et BR ?",
      options: [
        "BS est pour la HT, BR pour la BT",
        "BS = interventions élémentaires, BR = interventions générales",
        "BS = travaux, BR = consignation",
        "Aucune différence"
      ],
      correct: 1,
      explication: "BS permet uniquement des interventions élémentaires (remplacement à l'identique). BR permet des interventions générales (dépannage, modification)."
    },
    {
      id: "h11",
      category: "habilitations",
      question: "Dans quelle zone se trouve-t-on à 50cm d'un conducteur nu sous tension en BT ?",
      options: ["Zone 0", "Zone 1", "Zone 4", "Hors zone"],
      correct: 2,
      explication: "En BT, la zone 4 (travaux sous tension) commence à la DMA (30cm). À 50cm, on est au-delà de la DMA mais dans la zone de voisinage (zone 1 en BT)."
    },
    {
      id: "h12",
      category: "habilitations",
      question: "Qui délivre l'habilitation électrique ?",
      options: [
        "L'organisme de formation",
        "L'inspection du travail",
        "L'employeur",
        "Le CONSUEL"
      ],
      correct: 2,
      explication: "L'habilitation est délivrée par l'employeur, sur la base d'une formation et de la reconnaissance des compétences du salarié."
    },

    // ===== PRATIQUE TERRAIN =====
    {
      id: "p1",
      category: "pratique",
      question: "Avant de câbler un tableau, quelle est la première vérification ?",
      options: [
        "Vérifier la présence du matériel",
        "S'assurer que l'installation est hors tension",
        "Lire les schémas",
        "Préparer les outils"
      ],
      correct: 1,
      explication: "La sécurité d'abord ! Avant toute intervention, vérifier l'absence de tension avec un VAT, même si l'installation est \"neuve\"."
    },
    {
      id: "p2",
      category: "pratique",
      question: "Comment vérifier la continuité du conducteur de protection (PE) ?",
      options: [
        "Avec un multimètre en mode tension",
        "Avec un multimètre en mode continuité ou ohmmètre",
        "Avec un mégohmmètre",
        "Visuellement"
      ],
      correct: 1,
      explication: "La continuité du PE se mesure avec un ohmmètre ou multimètre en mode continuité. La résistance doit être < 2Ω sur toute la longueur."
    },
    {
      id: "p3",
      category: "pratique",
      question: "Quelle tension utiliser pour mesurer l'isolement d'une installation domestique ?",
      options: ["230V AC", "250V DC", "500V DC", "1000V DC"],
      correct: 2,
      explication: "L'isolement d'une installation BT se mesure avec un mégohmmètre à 500V DC. La résistance doit être > 0.5 MΩ (500 kΩ)."
    },
    {
      id: "p4",
      category: "pratique",
      question: "Un DDR 30mA se déclenche intempestivement. Quelle est la méthode de diagnostic ?",
      options: [
        "Remplacer le DDR",
        "Déconnecter les circuits un par un pour isoler le défaut",
        "Augmenter la sensibilité du DDR",
        "Court-circuiter le DDR"
      ],
      correct: 1,
      explication: "Pour localiser un défaut d'isolement, déconnecter les circuits un par un (disjoncteurs ouverts) jusqu'à identifier le circuit fautif."
    },
    {
      id: "p5",
      category: "pratique",
      question: "Lors de la mise en service, dans quel ordre procéder ?",
      options: [
        "Fermer le disjoncteur général, puis les divisionnaires",
        "Fermer tous les disjoncteurs simultanément",
        "Fermer les divisionnaires, puis le général",
        "L'ordre n'a pas d'importance"
      ],
      correct: 0,
      explication: "On ferme d'abord le disjoncteur général (AGCP) pour alimenter le tableau, puis les divisionnaires un par un en vérifiant le bon fonctionnement."
    },
    {
      id: "p6",
      category: "pratique",
      question: "Comment tester le bon fonctionnement d'un DDR ?",
      options: [
        "En créant un court-circuit",
        "En utilisant le bouton test + contrôleur de DDR",
        "En débranchant le neutre",
        "En mesurant la tension"
      ],
      correct: 1,
      explication: "Utiliser le bouton test (vérifie le mécanisme) ET un contrôleur de DDR (vérifie le seuil et temps de déclenchement à In et 5×In)."
    },
    {
      id: "p7",
      category: "pratique",
      question: "Quelle est la bonne méthode pour raccorder un conducteur sur un bornier à vis ?",
      options: [
        "Serrer à fond jusqu'à déformer le conducteur",
        "Serrer modérément puis vérifier le maintien",
        "Serrer au couple préconisé par le constructeur",
        "Peu importe le serrage"
      ],
      correct: 2,
      explication: "Le serrage doit être effectué au couple préconisé (généralement 0.8 à 2.5 Nm selon les borniers). Un mauvais serrage = échauffement = incendie."
    },
    {
      id: "p8",
      category: "pratique",
      question: "Un client signale des disjonctions fréquentes de son circuit prises cuisine. Que vérifier en priorité ?",
      options: [
        "La puissance totale des appareils branchés",
        "La longueur des câbles",
        "La marque des prises",
        "L'orientation du tableau"
      ],
      correct: 0,
      explication: "Vérifier d'abord si la somme des puissances (bouilloire + four + micro-ondes...) ne dépasse pas le calibre du disjoncteur (20A = 4600W max)."
    },

    // ===== CALCULS =====
    {
      id: "c1",
      category: "calculs",
      question: "Un four de 3000W est branché en 230V. Quelle est l'intensité absorbée ?",
      options: ["10A", "13A", "15A", "20A"],
      correct: 1,
      explication: "I = P / U = 3000 / 230 = 13.04A. Un circuit en 2.5mm² protégé 20A convient parfaitement."
    },
    {
      id: "c2",
      category: "calculs",
      question: "Quelle chute de tension pour un circuit de 30m en 2.5mm² alimentant 3000W en 230V ? (ρ Cu = 0.0225 Ω.mm²/m)",
      options: ["1.5%", "2.8%", "4.5%", "6%"],
      correct: 1,
      explication: "ΔU = 2 × ρ × L × I / S = 2 × 0.0225 × 30 × 13 / 2.5 = 7V → 7/230 = 3% environ. Limite acceptable (3% éclairage, 5% autres)."
    },
    {
      id: "c3",
      category: "calculs",
      question: "Quelle section minimale pour un circuit de 25m alimentant 7000W en 230V monophasé ?",
      options: ["4 mm²", "6 mm²", "10 mm²", "16 mm²"],
      correct: 1,
      explication: "I = 7000/230 = 30.4A → disjoncteur 32A → section 6mm² minimum. Vérifier aussi la chute de tension selon la longueur."
    },
    {
      id: "c4",
      category: "calculs",
      question: "Un logement dispose de 6kVA. Quel est le courant maximum disponible ?",
      options: ["20A", "26A", "32A", "40A"],
      correct: 1,
      explication: "En monophasé : I = P / U = 6000 / 230 = 26A. Le disjoncteur de branchement sera réglé à 30A (calibre normalisé supérieur)."
    },
    {
      id: "c5",
      category: "calculs",
      question: "Quelle puissance maximum pour un circuit chauffage en 1.5mm² protégé 16A ?",
      options: ["2300W", "3680W", "4600W", "5000W"],
      correct: 1,
      explication: "P max = U × I = 230 × 16 = 3680W. Donc un circuit 1.5mm²/16A convient pour un radiateur jusqu'à 3500W."
    },
    {
      id: "c6",
      category: "calculs",
      question: "Pour une borne IRVE 7kW en monophasé, quelle section et protection ?",
      options: [
        "2.5mm², 20A",
        "4mm², 25A",
        "6mm², 32A",
        "10mm², 40A"
      ],
      correct: 2,
      explication: "7kW = 7000/230 = 30.4A → disjoncteur 32A → section 6mm² minimum. DDR Type A minimum, dédié à la borne."
    },
    {
      id: "c7",
      category: "calculs",
      question: "Un circuit triphasé 400V alimente une charge de 15kW équilibrée. Quelle intensité par phase ?",
      options: ["22A", "25A", "38A", "65A"],
      correct: 0,
      explication: "I = P / (√3 × U) = 15000 / (1.732 × 400) = 21.6A ≈ 22A par phase."
    },
    {
      id: "c8",
      category: "calculs",
      question: "Quel calibre de disjoncteur de branchement pour un logement tout électrique de 12kVA tri ?",
      options: ["15/45A", "20/60A", "30/90A", "60/90A"],
      correct: 0,
      explication: "12kVA tri = 12000 / (√3 × 400) = 17.3A par phase. Calibre 15/45A convient (réglable de 15A à 45A)."
    }
  ]
}

// Fonction pour mélanger les questions
export function shuffleQuestions(questions) {
  const shuffled = [...questions]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Fonction pour obtenir des questions par catégorie
export function getQuestionsByCategory(categoryId, count = 10) {
  const categoryQuestions = quizData.questions.filter(q => q.category === categoryId)
  return shuffleQuestions(categoryQuestions).slice(0, count)
}

// Fonction pour obtenir un mix de toutes les catégories
export function getMixedQuestions(count = 20) {
  return shuffleQuestions(quizData.questions).slice(0, count)
}

export default quizData
