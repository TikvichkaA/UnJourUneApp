// Questions de quiz - Préparation TP Électricien
// Catégories: normes, habilitations, pratique, calculs, schemas, outillage

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
    },
    {
      id: "schemas",
      titre: "Schémas",
      description: "Lecture de schémas et symboles",
      icon: "📐",
      color: "indigo"
    },
    {
      id: "outillage",
      titre: "Outillage",
      description: "Outils et appareils de mesure",
      icon: "🔨",
      color: "orange"
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
    {
      id: "n16",
      category: "normes",
      question: "Combien de points d'éclairage maximum sur un circuit protégé 16A ?",
      options: ["5", "8", "10", "12"],
      correct: 1,
      explication: "Un circuit d'éclairage en 1.5mm² protégé 16A peut alimenter jusqu'à 8 points d'éclairage maximum."
    },
    {
      id: "n17",
      category: "normes",
      question: "Quelle est la hauteur recommandée pour un interrupteur de commande ?",
      options: ["0.50 à 0.80m", "0.90 à 1.30m", "1.30 à 1.50m", "1.50 à 1.80m"],
      correct: 1,
      explication: "Les interrupteurs doivent être installés entre 0.90m et 1.30m du sol fini, pour être accessibles aux personnes à mobilité réduite."
    },
    {
      id: "n18",
      category: "normes",
      question: "Le DAAF (Détecteur Autonome Avertisseur de Fumée) est obligatoire dans quel type de local ?",
      options: ["Uniquement les ERP", "Tous les logements", "Uniquement les maisons", "Uniquement les immeubles"],
      correct: 1,
      explication: "Le DAAF est obligatoire dans tous les logements depuis 2015. Il doit être installé dans la circulation menant aux chambres."
    },
    {
      id: "n19",
      category: "normes",
      question: "Quelle est la profondeur minimale d'enfouissement d'un câble électrique sous une allée piétonne ?",
      options: ["30 cm", "50 cm", "65 cm", "85 cm"],
      correct: 1,
      explication: "La profondeur minimale est de 50cm sous allée piétonne. Elle passe à 85cm sous voie carrossable."
    },
    {
      id: "n20",
      category: "normes",
      question: "Combien de DDR 30mA minimum dans un logement ?",
      options: ["1", "2", "3", "4"],
      correct: 1,
      explication: "Il faut minimum 2 DDR 30mA par logement, dont au moins un de Type A pour les circuits avec électronique (lave-linge, plaques...)."
    },
    {
      id: "n21",
      category: "normes",
      question: "Le parafoudre est obligatoire dans quelle zone ?",
      options: ["Zone AQ1 uniquement", "Zone AQ2", "Toutes les zones", "Jamais obligatoire"],
      correct: 1,
      explication: "Le parafoudre est obligatoire en zone AQ2 (≥25 jours d'orage/an) et si l'alimentation est par ligne aérienne ou si paratonnerre."
    },
    {
      id: "n22",
      category: "normes",
      question: "Quelle section pour la liaison équipotentielle principale (LEP) ?",
      options: ["2.5 mm² Cu", "4 mm² Cu", "6 mm² Cu minimum", "10 mm² Cu"],
      correct: 2,
      explication: "La LEP doit avoir une section de 6mm² Cu minimum (ou 25mm² si aluminium). Elle relie les canalisations métalliques à la terre."
    },
    {
      id: "n23",
      category: "normes",
      question: "Quel est le courant de fuite maximum acceptable pour un DDR 30mA ?",
      options: ["10 mA", "15 mA", "20 mA", "30 mA"],
      correct: 1,
      explication: "Le DDR se déclenche entre 15mA et 30mA. Le courant de fuite permanent ne doit pas dépasser 15mA pour éviter les déclenchements intempestifs."
    },
    {
      id: "n24",
      category: "normes",
      question: "Combien de prises RJ45 minimum dans un séjour ?",
      options: ["1", "2", "3", "4"],
      correct: 1,
      explication: "Le séjour doit avoir minimum 2 prises RJ45. Chaque pièce principale (chambre, séjour, bureau) doit avoir au moins 1 prise RJ45."
    },
    {
      id: "n25",
      category: "normes",
      question: "L'AFDD (détecteur d'arc) est recommandé/obligatoire pour quels locaux ?",
      options: ["Cuisines uniquement", "Salles de bain", "Locaux à sommeil (chambres)", "Garages"],
      correct: 2,
      explication: "L'AFDD est recommandé voire obligatoire (selon amendement) dans les locaux à sommeil (chambres) pour prévenir les incendies d'origine électrique."
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
    {
      id: "h13",
      category: "habilitations",
      question: "Quelle est la limite de la TBT (Très Basse Tension) en alternatif ?",
      options: ["12V", "25V", "50V", "120V"],
      correct: 2,
      explication: "La TBT va jusqu'à 50V en alternatif et 120V en continu. Au-delà, c'est la BT."
    },
    {
      id: "h14",
      category: "habilitations",
      question: "Quelle classe de gants isolants pour travailler en BT ?",
      options: ["Classe 00 (500V)", "Classe 0 (1000V)", "Classe 1 (7500V)", "Classe 2 (17000V)"],
      correct: 1,
      explication: "Pour la BT (jusqu'à 1000V AC), les gants classe 0 (1000V) sont adaptés. Classe 00 pour 500V max."
    },
    {
      id: "h15",
      category: "habilitations",
      question: "Que signifie MALT dans la procédure de consignation ?",
      options: [
        "Mise À La Terre",
        "Mesure Avant Le Travail",
        "Maintien Après Les Travaux",
        "Mode Automatique Longue Tension"
      ],
      correct: 0,
      explication: "MALT = Mise À La Terre (et en court-circuit). Elle protège contre toute réalimentation accidentelle."
    },
    {
      id: "h16",
      category: "habilitations",
      question: "Quelle est la durée de validité recommandée d'une habilitation électrique ?",
      options: ["1 an", "3 ans", "5 ans", "Illimitée"],
      correct: 1,
      explication: "L'habilitation doit être révisée au moins tous les 3 ans (recyclage). Elle peut être retirée ou modifiée à tout moment par l'employeur."
    },
    {
      id: "h17",
      category: "habilitations",
      question: "L'habilitation H0 permet de :",
      options: [
        "Travailler sous tension en HT",
        "Accéder aux locaux HT pour travaux non électriques",
        "Réaliser des consignations en HT",
        "Diriger des travaux en HT"
      ],
      correct: 1,
      explication: "H0 = Non électricien pouvant accéder aux locaux HT pour effectuer des travaux non électriques (peinture, ménage...)."
    },
    {
      id: "h18",
      category: "habilitations",
      question: "Que signifie VAT ?",
      options: [
        "Voltmètre À Tension",
        "Vérification Absence de Tension",
        "Validation Avant Travaux",
        "Verrouillage Automatique Tableau"
      ],
      correct: 1,
      explication: "VAT = Vérification d'Absence de Tension. Elle doit être réalisée avec un appareil conforme (VAT) et non un simple multimètre."
    },
    {
      id: "h19",
      category: "habilitations",
      question: "La DMA en HTA (jusqu'à 50kV) est de :",
      options: ["0.30 m", "0.60 m", "2 m", "3 m"],
      correct: 1,
      explication: "En HTA, la DMA est de 0.60m. La DLVS (distance limite voisinage simple) est de 2m."
    },
    {
      id: "h20",
      category: "habilitations",
      question: "Quel document le BC remet-il au B2 après consignation ?",
      options: [
        "Bon de travail",
        "Attestation de consignation",
        "Ordre de mission",
        "Permis de feu"
      ],
      correct: 1,
      explication: "Le BC remet une attestation de consignation au B2, qui confirme que l'ouvrage est consigné et peut être travaillé."
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
    {
      id: "p9",
      category: "pratique",
      question: "Comment repérer la phase avec un tournevis testeur ?",
      options: [
        "La lampe s'allume au contact de la phase",
        "La lampe s'allume au contact du neutre",
        "Le tournevis vibre",
        "Le tournevis chauffe"
      ],
      correct: 0,
      explication: "Le tournevis testeur s'allume (lampe néon) quand on touche la phase tout en ayant le doigt sur l'extrémité métallique du manche."
    },
    {
      id: "p10",
      category: "pratique",
      question: "Quel est le code couleur du conducteur de protection (terre) ?",
      options: [
        "Bleu",
        "Vert",
        "Jaune",
        "Vert/Jaune"
      ],
      correct: 3,
      explication: "Le conducteur de protection (PE/terre) est toujours bicolore vert/jaune. Le bleu est réservé au neutre."
    },
    {
      id: "p11",
      category: "pratique",
      question: "Une prise de courant chauffe anormalement. Quelle est la cause la plus probable ?",
      options: [
        "Tension trop élevée",
        "Mauvais serrage des connexions",
        "Section de câble trop importante",
        "DDR défectueux"
      ],
      correct: 1,
      explication: "L'échauffement est généralement dû à un mauvais contact (serrage insuffisant ou oxydation), qui crée une résistance et donc un échauffement."
    },
    {
      id: "p12",
      category: "pratique",
      question: "Comment réaliser un va-et-vient avec 2 interrupteurs ?",
      options: [
        "2 interrupteurs simples en parallèle",
        "2 interrupteurs simples en série",
        "2 interrupteurs va-et-vient reliés par navettes",
        "1 télérupteur et 2 boutons poussoirs"
      ],
      correct: 2,
      explication: "Un va-et-vient utilise 2 interrupteurs spéciaux (va-et-vient) reliés par 2 fils navettes. La phase arrive sur l'un, le retour lampe part de l'autre."
    },
    {
      id: "p13",
      category: "pratique",
      question: "Le CONSUEL a refusé votre installation. Que faire ?",
      options: [
        "Changer de fournisseur d'électricité",
        "Corriger les anomalies et demander une contre-visite",
        "Contester la décision au tribunal",
        "Faire appel à un autre organisme"
      ],
      correct: 1,
      explication: "Il faut corriger les anomalies signalées sur le rapport, puis demander une contre-visite au CONSUEL pour obtenir l'attestation de conformité."
    },
    {
      id: "p14",
      category: "pratique",
      question: "Comment raccorder un fil souple (multibrins) sur un bornier à vis ?",
      options: [
        "Directement sans préparation",
        "Avec une cosse à sertir ou embout",
        "En torsadant puis étamant à la soudure",
        "En coupant les brins qui dépassent"
      ],
      correct: 1,
      explication: "Les fils souples doivent être équipés d'embouts de câblage (cosses) pour éviter l'écrasement des brins et assurer un bon contact."
    },
    {
      id: "p15",
      category: "pratique",
      question: "Un circuit d'éclairage fonctionne par intermittence. Que vérifier ?",
      options: [
        "La puissance des lampes",
        "Les connexions et serrages",
        "Le compteur électrique",
        "La section des câbles"
      ],
      correct: 1,
      explication: "Un fonctionnement intermittent indique généralement un faux contact. Vérifier toutes les connexions, boîtes de dérivation et serrages."
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
      question: "Quelle chute de tension pour un circuit de 30m en 2.5mm² alimentant 3000W en 230V ?",
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
    },
    {
      id: "c9",
      category: "calculs",
      question: "Un radiateur de 2000W fonctionne 8h/jour pendant 30 jours. Quelle consommation en kWh ?",
      options: ["160 kWh", "480 kWh", "600 kWh", "1600 kWh"],
      correct: 1,
      explication: "E = P × t = 2 kW × 8h × 30 jours = 480 kWh."
    },
    {
      id: "c10",
      category: "calculs",
      question: "Résistance d'un câble cuivre de 50m, section 2.5mm² (ρ=0.0175 Ω.mm²/m) ?",
      options: ["0.175 Ω", "0.35 Ω", "0.70 Ω", "1.75 Ω"],
      correct: 1,
      explication: "R = ρ × L / S = 0.0175 × 50 / 2.5 = 0.35Ω. Attention : pour un aller-retour (circuit), multiplier par 2."
    },
    {
      id: "c11",
      category: "calculs",
      question: "Quelle est la puissance réactive d'un moteur 5kW avec cos φ = 0.8 ?",
      options: ["2.5 kvar", "3.75 kvar", "4 kvar", "6.25 kvar"],
      correct: 1,
      explication: "Q = P × tan φ. Avec cos φ = 0.8, sin φ = 0.6, tan φ = 0.75. Donc Q = 5 × 0.75 = 3.75 kvar."
    },
    {
      id: "c12",
      category: "calculs",
      question: "Un chauffe-eau 200L, 2400W met combien de temps pour chauffer de 15°C à 65°C ?",
      options: ["2h30", "4h40", "6h", "8h"],
      correct: 1,
      explication: "E = m × c × ΔT = 200 × 1.16 × 50 = 11600 Wh = 11.6 kWh. Temps = 11600/2400 = 4.83h ≈ 4h50."
    },
    {
      id: "c13",
      category: "calculs",
      question: "Quelle est l'impédance d'un circuit RL série (R=30Ω, XL=40Ω) ?",
      options: ["35 Ω", "50 Ω", "70 Ω", "1200 Ω"],
      correct: 1,
      explication: "Z = √(R² + XL²) = √(900 + 1600) = √2500 = 50Ω (triangle rectangle 3-4-5)."
    },
    {
      id: "c14",
      category: "calculs",
      question: "Un délesteur doit couper à partir de quelle intensité pour un abonnement 9kVA mono ?",
      options: ["32A", "40A", "45A", "60A"],
      correct: 1,
      explication: "9kVA mono = 9000/230 = 39A. Le délesteur est réglé légèrement en dessous du disjoncteur de branchement (40A → délestage vers 38-40A)."
    },
    {
      id: "c15",
      category: "calculs",
      question: "Facteur de puissance d'une installation absorbant 10kW actif et 5kvar réactif ?",
      options: ["0.5", "0.67", "0.89", "0.95"],
      correct: 2,
      explication: "S = √(P² + Q²) = √(100 + 25) = 11.18 kVA. cos φ = P/S = 10/11.18 = 0.89."
    },

    // ===== SCHÉMAS =====
    {
      id: "s1",
      category: "schemas",
      question: "Comment est représenté un interrupteur différentiel sur un schéma unifilaire ?",
      options: [
        "Un rectangle avec un trait oblique",
        "Un rectangle avec le symbole Δ et la sensibilité",
        "Un cercle avec une croix",
        "Un carré avec deux traits parallèles"
      ],
      correct: 1,
      explication: "L'interrupteur différentiel est représenté par un rectangle contenant le symbole Δ (delta) et sa sensibilité (30mA, 300mA...)."
    },
    {
      id: "s2",
      category: "schemas",
      question: "Quel symbole représente une prise de courant 2P+T ?",
      options: [
        "Cercle avec un point",
        "Demi-cercle avec deux traits horizontaux",
        "Rectangle avec trois traits",
        "Triangle avec un point"
      ],
      correct: 1,
      explication: "La prise 2P+T est représentée par un demi-cercle (côté mur) avec deux traits horizontaux pour les pôles et un trait pour la terre."
    },
    {
      id: "s3",
      category: "schemas",
      question: "Comment distinguer un fil de phase d'un fil de neutre sur un schéma développé ?",
      options: [
        "La phase est en trait plein, le neutre en pointillés",
        "La phase est au-dessus, le neutre en dessous",
        "Aucune différence graphique, seule la lettre change (L/N)",
        "La phase est en rouge, le neutre en bleu"
      ],
      correct: 2,
      explication: "Sur un schéma en noir et blanc, phase et neutre ont le même tracé. Ils sont identifiés par les lettres L (phase) et N (neutre)."
    },
    {
      id: "s4",
      category: "schemas",
      question: "Quel est le symbole d'un télérupteur ?",
      options: [
        "Un rectangle avec deux bobines",
        "Un rectangle avec une bobine et un contact",
        "Un cercle avec une flèche",
        "Un triangle avec un trait"
      ],
      correct: 1,
      explication: "Le télérupteur est représenté par un rectangle contenant une bobine (symbole zigzag) et un contact impulsionnel."
    },
    {
      id: "s5",
      category: "schemas",
      question: "Comment est représenté un point lumineux commandé (DCL) ?",
      options: [
        "Un cercle plein",
        "Un cercle avec une croix à l'intérieur",
        "Un cercle avec un X",
        "Un carré avec un point"
      ],
      correct: 1,
      explication: "Le point lumineux est représenté par un cercle avec une croix (+) à l'intérieur. Le DCL (Dispositif de Connexion Luminaire) suit ce symbole."
    },
    {
      id: "s6",
      category: "schemas",
      question: "Que signifie le trait oblique sur le symbole d'un disjoncteur ?",
      options: [
        "Disjoncteur différentiel",
        "Fonction de coupure (sectionneur)",
        "Disjoncteur télécommandé",
        "Disjoncteur magnétique seul"
      ],
      correct: 1,
      explication: "Le trait oblique traversant le symbole indique une fonction de coupure visible (sectionneur). C'est une fonction de sécurité pour isoler."
    },
    {
      id: "s7",
      category: "schemas",
      question: "Sur un schéma multifilaire, combien de traits pour un circuit triphasé + neutre + terre ?",
      options: ["3 traits", "4 traits", "5 traits", "6 traits"],
      correct: 2,
      explication: "Un circuit triphasé complet comporte : 3 phases (L1, L2, L3) + 1 neutre (N) + 1 terre (PE) = 5 conducteurs, donc 5 traits."
    },
    {
      id: "s8",
      category: "schemas",
      question: "Comment représente-t-on un câble enterré sur un plan d'implantation ?",
      options: [
        "Trait continu épais",
        "Trait pointillé ou tirets",
        "Double trait",
        "Trait ondulé"
      ],
      correct: 1,
      explication: "Les canalisations enterrées ou encastrées sont généralement représentées en pointillés ou tirets pour les différencier des canalisations apparentes."
    },
    {
      id: "s9",
      category: "schemas",
      question: "Quel est le symbole d'un contacteur jour/nuit ?",
      options: [
        "Un rectangle avec une horloge",
        "Un rectangle avec une bobine et contacts, relié au compteur",
        "Un cercle avec J/N",
        "Un carré avec une lune"
      ],
      correct: 1,
      explication: "Le contacteur J/N est un contacteur classique (bobine + contacts) dont la commande vient du signal tarifaire du compteur (contact C1/C2)."
    },
    {
      id: "s10",
      category: "schemas",
      question: "Comment est représentée la terre sur un schéma électrique ?",
      options: [
        "Un cercle",
        "Un triangle",
        "Trois traits horizontaux décroissants",
        "Une croix"
      ],
      correct: 2,
      explication: "La terre est représentée par trois traits horizontaux de taille décroissante (comme un râteau inversé), parfois accompagnés d'un trait vertical."
    },

    // ===== OUTILLAGE =====
    {
      id: "o1",
      category: "outillage",
      question: "Quel outil utilise-t-on pour mesurer la résistance d'isolement ?",
      options: ["Multimètre", "Mégohmmètre", "Pince ampèremétrique", "VAT"],
      correct: 1,
      explication: "Le mégohmmètre (ou contrôleur d'isolement) applique une tension DC (250V, 500V ou 1000V) pour mesurer la résistance d'isolement en MΩ."
    },
    {
      id: "o2",
      category: "outillage",
      question: "À quoi sert une pince ampèremétrique ?",
      options: [
        "Mesurer la tension",
        "Mesurer le courant sans ouvrir le circuit",
        "Couper les câbles",
        "Sertir les cosses"
      ],
      correct: 1,
      explication: "La pince ampèremétrique mesure le courant par induction, en entourant un seul conducteur. Elle permet de mesurer sans interrompre le circuit."
    },
    {
      id: "o3",
      category: "outillage",
      question: "Quelle est la particularité d'un VAT (Vérificateur d'Absence de Tension) ?",
      options: [
        "Il affiche la valeur exacte de la tension",
        "Il indique uniquement présence/absence de tension avec seuils définis",
        "Il mesure aussi le courant",
        "Il fonctionne sans piles"
      ],
      correct: 1,
      explication: "Le VAT est un appareil normé qui indique la présence ou absence de tension entre des seuils définis. Il n'affiche pas la valeur exacte."
    },
    {
      id: "o4",
      category: "outillage",
      question: "Quel outil permet de dénuder un câble sans abîmer les conducteurs ?",
      options: [
        "Cutter",
        "Pince à dénuder automatique",
        "Cisaille",
        "Tournevis"
      ],
      correct: 1,
      explication: "La pince à dénuder automatique ajuste sa coupe à la section du câble et enlève proprement la gaine sans entailler les conducteurs."
    },
    {
      id: "o5",
      category: "outillage",
      question: "Pour sertir une cosse sur un câble, quel outil utiliser ?",
      options: [
        "Pince coupante",
        "Pince à sertir adaptée",
        "Marteau",
        "Tournevis"
      ],
      correct: 1,
      explication: "Une pince à sertir avec les mâchoires adaptées à la cosse et à la section du câble assure un sertissage conforme et durable."
    },
    {
      id: "o6",
      category: "outillage",
      question: "Un testeur de DDR permet de vérifier :",
      options: [
        "La tension du réseau",
        "Le seuil et le temps de déclenchement du DDR",
        "La continuité des câbles",
        "La résistance de terre"
      ],
      correct: 1,
      explication: "Le testeur de DDR injecte un courant de défaut calibré (15mA, 30mA, 150mA...) et mesure le temps de déclenchement du différentiel."
    },
    {
      id: "o7",
      category: "outillage",
      question: "Comment mesurer la résistance de la prise de terre ?",
      options: [
        "Avec un multimètre entre phase et terre",
        "Avec un telluromètre et piquets auxiliaires",
        "Avec un mégohmmètre",
        "Avec une pince ampèremétrique"
      ],
      correct: 1,
      explication: "Le telluromètre utilise des piquets auxiliaires plantés dans le sol pour mesurer la résistance de terre par méthode de chute de potentiel."
    },
    {
      id: "o8",
      category: "outillage",
      question: "À quoi sert un tire-fil électricien ?",
      options: [
        "À couper les fils",
        "À passer les câbles dans les gaines",
        "À mesurer la longueur des fils",
        "À dénuder les fils"
      ],
      correct: 1,
      explication: "Le tire-fil (ou aiguille d'électricien) est un fil rigide en nylon ou acier utilisé pour guider les câbles dans les gaines et conduits."
    },
    {
      id: "o9",
      category: "outillage",
      question: "Quel appareil permet de localiser un câble sous tension derrière un mur ?",
      options: [
        "Multimètre",
        "Détecteur de métaux/câbles",
        "Mégohmmètre",
        "Oscilloscope"
      ],
      correct: 1,
      explication: "Le détecteur de câbles (ou scanner mural) repère les canalisations électriques, métaux et parfois le bois derrière les cloisons."
    },
    {
      id: "o10",
      category: "outillage",
      question: "Pour percer du béton, quel type de foret utiliser ?",
      options: [
        "Foret HSS",
        "Foret béton à plaquette carbure",
        "Foret bois",
        "Foret inox"
      ],
      correct: 1,
      explication: "Les forets béton ont une plaquette en carbure de tungstène et sont conçus pour le perçage à percussion dans les matériaux durs."
    },
    {
      id: "o11",
      category: "outillage",
      question: "Quelle est la fonction d'un niveau laser ?",
      options: [
        "Mesurer la distance",
        "Tracer des lignes horizontales et verticales de référence",
        "Détecter les fuites",
        "Mesurer la température"
      ],
      correct: 1,
      explication: "Le niveau laser projette des lignes parfaitement horizontales et/ou verticales pour aligner les appareillages et équipements."
    },
    {
      id: "o12",
      category: "outillage",
      question: "Un contrôleur de rotation de phases sert à :",
      options: [
        "Mesurer la tension triphasée",
        "Vérifier l'ordre des phases (sens de rotation)",
        "Contrôler l'équilibre des charges",
        "Mesurer le déphasage"
      ],
      correct: 1,
      explication: "Le contrôleur de rotation indique l'ordre des phases (direct ou inverse), essentiel pour le branchement correct des moteurs triphasés."
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
