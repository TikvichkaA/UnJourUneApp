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
    },
    {
      id: "courants-faibles",
      titre: "Courants Faibles",
      description: "VDI, RJ45, communication",
      icon: "📡",
      color: "cyan"
    },
    {
      id: "raccordements",
      titre: "Raccordements",
      description: "Câblage et montages",
      icon: "🔌",
      color: "rose"
    },
    {
      id: "moteurs",
      titre: "Moteurs",
      description: "Couplage, démarrage, protection",
      icon: "⚙️",
      color: "violet"
    },
    {
      id: "erp-securite",
      titre: "Sécurité ERP",
      description: "BAES, SSI, secours",
      icon: "🏢",
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
    },

    // ===== COURANTS FAIBLES - VDI =====
    {
      id: "cf1",
      category: "courants-faibles",
      question: "Quelle est la norme de câblage RJ45 la plus utilisée en France ?",
      options: ["T568A", "T568B", "EIA/TIA 568", "ISO 11801"],
      correct: 0,
      explication: "En France, la norme T568A est privilégiée. Elle définit l'ordre des paires : blanc-vert/vert (1-2), blanc-orange/bleu (3-4), blanc-bleu/orange (5-6), blanc-marron/marron (7-8)."
    },
    {
      id: "cf2",
      category: "courants-faibles",
      question: "Combien de paires torsadées contient un câble RJ45 Cat6 ?",
      options: ["2 paires", "3 paires", "4 paires", "8 paires"],
      correct: 2,
      explication: "Un câble RJ45 contient toujours 4 paires torsadées (8 fils). Le Cat6 permet des débits jusqu'à 10 Gbit/s sur courte distance."
    },
    {
      id: "cf3",
      category: "courants-faibles",
      question: "Que signifie F/UTP pour un câble réseau ?",
      options: [
        "Fibre / Ultra Thin Protocol",
        "Foil / Unshielded Twisted Pair",
        "Fast / Unshielded Transfer Protocol",
        "Full / Universal Twisted Pair"
      ],
      correct: 1,
      explication: "F/UTP = Foiled/Unshielded Twisted Pair : câble avec écran général (feuille aluminium) mais paires non blindées individuellement."
    },
    {
      id: "cf4",
      category: "courants-faibles",
      question: "Quel est le grade VDI minimum obligatoire en logement neuf ?",
      options: ["Grade 1", "Grade 2TV", "Grade 3TV", "Grade 4"],
      correct: 1,
      explication: "Le Grade 2TV (câble F/UTP Cat6 + coaxial 17 VATC) est le minimum obligatoire depuis 2016 pour les logements neufs (arrêté du 3 août 2016)."
    },
    {
      id: "cf5",
      category: "courants-faibles",
      question: "Qu'est-ce que le DTI dans un coffret de communication ?",
      options: [
        "Distributeur Téléphonique Intérieur",
        "Dispositif de Terminaison Intérieur",
        "Détecteur de Transmission Internet",
        "Disjoncteur Télécom Individuel"
      ],
      correct: 1,
      explication: "Le DTI (Dispositif de Terminaison Intérieur) est le point de démarcation entre le réseau de l'opérateur et l'installation privée."
    },
    {
      id: "cf6",
      category: "courants-faibles",
      question: "Quelle est la longueur maximale d'un lien RJ45 permanent selon la norme ?",
      options: ["50 m", "90 m", "100 m", "150 m"],
      correct: 1,
      explication: "Le lien permanent (du coffret à la prise murale) est limité à 90 m. Avec les cordons de brassage (10 m max), le canal complet fait 100 m max."
    },
    {
      id: "cf7",
      category: "courants-faibles",
      question: "Quelle catégorie de câble est requise pour le Grade 3TV ?",
      options: ["Cat5e", "Cat6", "Cat6a", "Cat7"],
      correct: 2,
      explication: "Le Grade 3TV nécessite un câble Cat6a (ou supérieur) pour supporter le 10 Gbit/s sur 100m. Il n'utilise plus de câble coaxial."
    },
    {
      id: "cf8",
      category: "courants-faibles",
      question: "Combien de prises RJ45 minimum dans une chambre selon la NF C 15-100 ?",
      options: ["0", "1", "2", "3"],
      correct: 1,
      explication: "Chaque pièce principale (chambre, séjour, bureau) doit avoir au minimum 1 prise RJ45. Le séjour en nécessite 2 minimum."
    },
    {
      id: "cf9",
      category: "courants-faibles",
      question: "Quel est le rôle du répartiteur dans le coffret de communication ?",
      options: [
        "Amplifier le signal TV",
        "Distribuer les connexions RJ45 vers les différentes prises",
        "Filtrer les parasites ADSL",
        "Convertir la fibre en cuivre"
      ],
      correct: 1,
      explication: "Le répartiteur (ou bandeau de brassage) permet de connecter les câbles venant des prises murales aux équipements actifs (box, switch)."
    },
    {
      id: "cf10",
      category: "courants-faibles",
      question: "Quel type de câble coaxial est utilisé pour la TV en Grade 2TV ?",
      options: ["RG6", "17 VATC", "RG59", "75 ohms standard"],
      correct: 1,
      explication: "Le câble 17 VATC (17 mm, blindé, 75 ohms) est le standard pour la distribution TV terrestre et satellite en installation domestique."
    },
    {
      id: "cf11",
      category: "courants-faibles",
      question: "Qu'est-ce qu'un PTO en installation fibre optique ?",
      options: [
        "Point de Terminaison Optique",
        "Prise Télécom Obligatoire",
        "Protection Technique Opérateur",
        "Passage Technique Optique"
      ],
      correct: 0,
      explication: "Le PTO (Point de Terminaison Optique) est la prise fibre installée chez l'abonné, point de raccordement entre le réseau opérateur et la box."
    },
    {
      id: "cf12",
      category: "courants-faibles",
      question: "Quel est l'ordre des couleurs des fils en T568A (paires 1-2 et 3-6) ?",
      options: [
        "Orange-Vert-Bleu-Marron",
        "Vert-Orange-Bleu-Marron",
        "Bleu-Vert-Orange-Marron",
        "Vert-Bleu-Orange-Marron"
      ],
      correct: 1,
      explication: "T568A : pins 1-2 = blanc-vert/vert, pins 3-6 = blanc-orange/orange. La différence avec T568B est l'inversion des paires orange et verte."
    },
    {
      id: "cf13",
      category: "courants-faibles",
      question: "Quelle est la fonction d'un ONT dans une installation fibre ?",
      options: [
        "Amplifier le signal optique",
        "Convertir le signal optique en signal électrique",
        "Distribuer la fibre dans le logement",
        "Filtrer les longueurs d'onde"
      ],
      correct: 1,
      explication: "L'ONT (Optical Network Terminal) convertit le signal lumineux de la fibre en signal électrique utilisable par la box et les équipements."
    },
    {
      id: "cf14",
      category: "courants-faibles",
      question: "Quelle est la différence entre un interphone et un visiophone ?",
      options: [
        "L'interphone est sans fil",
        "Le visiophone intègre une caméra vidéo",
        "L'interphone est pour l'extérieur uniquement",
        "Aucune différence technique"
      ],
      correct: 1,
      explication: "Le visiophone (ou vidéophone) ajoute une caméra à la platine de rue, permettant de voir le visiteur en plus de l'entendre."
    },
    {
      id: "cf15",
      category: "courants-faibles",
      question: "Combien de fils minimum pour un interphone audio simple ?",
      options: ["2 fils", "4 fils", "6 fils", "8 fils"],
      correct: 0,
      explication: "Un interphone audio basique fonctionne avec 2 fils (bus). Les systèmes plus complexes (vidéo, plusieurs postes) nécessitent plus de fils ou du bus numérique."
    },

    // ===== RACCORDEMENTS =====
    {
      id: "r1",
      category: "raccordements",
      question: "Dans un va-et-vient, comment sont reliés les deux interrupteurs ?",
      options: [
        "Par un seul fil de phase",
        "Par deux fils navettes",
        "Par un fil de neutre",
        "Par trois fils : phase, neutre, terre"
      ],
      correct: 1,
      explication: "Les deux interrupteurs va-et-vient sont reliés par 2 fils navettes (généralement violet ou orange). La phase arrive sur l'un, le retour lampe part de l'autre."
    },
    {
      id: "r2",
      category: "raccordements",
      question: "Sur un télérupteur, à quoi servent les bornes A1 et A2 ?",
      options: [
        "Alimentation de la lampe",
        "Raccordement des boutons poussoirs",
        "Alimentation de la bobine de commande",
        "Mise à la terre"
      ],
      correct: 2,
      explication: "A1 et A2 sont les bornes de la bobine du télérupteur. A1 reçoit le retour des boutons poussoirs, A2 est relié au neutre."
    },
    {
      id: "r3",
      category: "raccordements",
      question: "Quelle est la couleur normalisée du fil de retour lampe ?",
      options: [
        "Bleu",
        "Vert/jaune",
        "Toute couleur sauf bleu et vert/jaune",
        "Obligatoirement rouge"
      ],
      correct: 2,
      explication: "Le retour lampe peut être de n'importe quelle couleur sauf bleu (réservé neutre) et vert/jaune (réservé terre). Orange ou violet sont souvent utilisés."
    },
    {
      id: "r4",
      category: "raccordements",
      question: "Dans un montage simple allumage, où arrive la phase ?",
      options: [
        "Directement sur la lampe",
        "Sur la borne L de l'interrupteur",
        "Sur le neutre",
        "Sur la boîte de dérivation uniquement"
      ],
      correct: 1,
      explication: "La phase arrive toujours sur la borne L (ou P) de l'interrupteur. C'est l'interrupteur qui coupe la phase, jamais le neutre."
    },
    {
      id: "r5",
      category: "raccordements",
      question: "Comment sont câblés les boutons poussoirs sur un télérupteur ?",
      options: [
        "En série",
        "En parallèle",
        "En étoile",
        "En triangle"
      ],
      correct: 1,
      explication: "Les boutons poussoirs sont câblés en parallèle : tous alimentés par la phase, et toutes les sorties reliées ensemble vers A1 du télérupteur."
    },
    {
      id: "r6",
      category: "raccordements",
      question: "Sur une minuterie, quelle borne reçoit le retour des boutons poussoirs ?",
      options: [
        "Borne 1 (phase)",
        "Borne 2 (neutre)",
        "Borne 3 (commande)",
        "Borne 4 (sortie)"
      ],
      correct: 2,
      explication: "La borne 3 de la minuterie reçoit le retour des BP. La borne 1 = phase, borne 2 = neutre (alim), borne 4 = sortie vers lampe."
    },
    {
      id: "r7",
      category: "raccordements",
      question: "Dans un contacteur jour/nuit, qu'est-ce qui commande la bobine ?",
      options: [
        "Un interrupteur manuel",
        "Le signal du compteur (contact C1-C2)",
        "Un thermostat",
        "Une horloge interne"
      ],
      correct: 1,
      explication: "Le compteur électrique envoie un signal via le contact sec C1-C2 pendant les heures creuses, qui active la bobine du contacteur."
    },
    {
      id: "r8",
      category: "raccordements",
      question: "Quel disjoncteur protège la bobine du contacteur jour/nuit ?",
      options: [
        "Le même que le chauffe-eau (20A)",
        "Un disjoncteur dédié 2A",
        "Le disjoncteur général",
        "Pas de protection nécessaire"
      ],
      correct: 1,
      explication: "La bobine du contacteur est protégée par un disjoncteur 2A séparé (circuit de commande), distinct du 20A qui protège le chauffe-eau (circuit de puissance)."
    },
    {
      id: "r9",
      category: "raccordements",
      question: "Dans un double allumage, combien de fils de retour lampe ?",
      options: ["1", "2", "3", "4"],
      correct: 1,
      explication: "Un interrupteur double a 2 sorties (1 et 2), donc 2 fils de retour lampe : un pour chaque circuit d'éclairage commandé."
    },
    {
      id: "r10",
      category: "raccordements",
      question: "Quelle est la particularité du câblage d'une prise commandée ?",
      options: [
        "Elle nécessite une section de 4mm²",
        "Elle est câblée comme un simple allumage",
        "Elle doit avoir sa propre terre",
        "Elle nécessite un DDR dédié"
      ],
      correct: 1,
      explication: "La prise commandée se câble exactement comme un simple allumage : phase → interrupteur → prise. Le neutre va directement à la prise."
    },
    {
      id: "r11",
      category: "raccordements",
      question: "Pourquoi utiliser un télérupteur plutôt qu'un va-et-vient ?",
      options: [
        "C'est moins cher",
        "Pour commander depuis plus de 2 points",
        "Pour les fortes puissances uniquement",
        "C'est obligatoire en tertiaire"
      ],
      correct: 1,
      explication: "Le télérupteur permet de commander un éclairage depuis un nombre illimité de points (boutons poussoirs). Le va-et-vient est limité à 2 points."
    },
    {
      id: "r12",
      category: "raccordements",
      question: "Sur un interrupteur va-et-vient, combien de bornes ?",
      options: ["2 bornes", "3 bornes", "4 bornes", "5 bornes"],
      correct: 1,
      explication: "Un interrupteur va-et-vient a 3 bornes : L (commun) et 1, 2 (les deux positions). C'est un inverseur."
    },
    {
      id: "r13",
      category: "raccordements",
      question: "Quel est le rôle du permutateur dans un montage d'éclairage ?",
      options: [
        "Remplacer le télérupteur",
        "Commander depuis un 3ème point avec des va-et-vient",
        "Inverser phase et neutre",
        "Protéger contre les surtensions"
      ],
      correct: 1,
      explication: "Le permutateur s'intercale entre 2 va-et-vient pour ajouter un 3ème (ou plus) point de commande. Il croise les navettes."
    },
    {
      id: "r14",
      category: "raccordements",
      question: "Dans un circuit de volet roulant, combien de fils entre l'interrupteur et le moteur ?",
      options: ["2 fils", "3 fils", "4 fils", "5 fils"],
      correct: 2,
      explication: "Un volet roulant nécessite 4 fils : phase montée, phase descente, neutre commun, et terre. L'interrupteur envoie la phase sur montée OU descente."
    },
    {
      id: "r15",
      category: "raccordements",
      question: "Comment vérifier qu'un montage va-et-vient fonctionne correctement ?",
      options: [
        "Mesurer la tension aux bornes de la lampe",
        "Tester toutes les combinaisons des 2 interrupteurs",
        "Mesurer la résistance des navettes",
        "Vérifier uniquement un interrupteur"
      ],
      correct: 1,
      explication: "Il faut tester les 4 combinaisons possibles (les 2 interrupteurs ont chacun 2 positions) : la lampe doit changer d'état à chaque action."
    },

    // ===== QUESTIONS SUPPLÉMENTAIRES SCHEMAS/SYMBOLES =====
    {
      id: "s11",
      category: "schemas",
      question: "Quel symbole représente un interrupteur différentiel ?",
      options: [
        "Rectangle avec zigzag",
        "Rectangle avec symbole Δ (delta)",
        "Cercle avec croix",
        "Carré avec diagonale"
      ],
      correct: 1,
      explication: "L'interrupteur différentiel est représenté par un rectangle avec le symbole Δ et sa sensibilité (30mA, 300mA). Le disjoncteur différentiel ajoute le symbole thermique/magnétique."
    },
    {
      id: "s12",
      category: "schemas",
      question: "Comment est représenté un bouton poussoir sur un schéma ?",
      options: [
        "Cercle plein",
        "Contact avec flèche de rappel",
        "Rectangle avec P",
        "Triangle pointant vers le bas"
      ],
      correct: 1,
      explication: "Le bouton poussoir est représenté par un contact avec une flèche indiquant le rappel automatique (retour à la position repos)."
    },
    {
      id: "s13",
      category: "schemas",
      question: "Quel symbole représente un conducteur de protection (terre) ?",
      options: [
        "Ligne continue",
        "Ligne pointillée",
        "Ligne avec tirets verts et jaunes",
        "Trois traits horizontaux décroissants"
      ],
      correct: 3,
      explication: "Le symbole de la terre est composé de trois traits horizontaux de taille décroissante, parfois avec un trait vertical. Sur les schémas, le PE peut aussi être en tirets."
    },
    {
      id: "s14",
      category: "schemas",
      question: "Comment différencier un disjoncteur d'un interrupteur sectionneur sur un schéma ?",
      options: [
        "Le disjoncteur a un rectangle, pas le sectionneur",
        "Le sectionneur a un trait oblique (coupure visible)",
        "Ils ont le même symbole",
        "Le disjoncteur est toujours en rouge"
      ],
      correct: 1,
      explication: "Le sectionneur (ou interrupteur-sectionneur) a un trait oblique traversant le symbole, indiquant une coupure visible et un isolement garanti."
    },
    {
      id: "s15",
      category: "schemas",
      question: "Que représente un cercle avec un X à l'intérieur ?",
      options: [
        "Une prise de courant",
        "Un point lumineux (lampe)",
        "Un moteur",
        "Un transformateur"
      ],
      correct: 1,
      explication: "Le cercle avec une croix (X ou +) représente un point lumineux. C'est le symbole standard pour les lampes et luminaires sur les plans."
    },
    {
      id: "s16",
      category: "schemas",
      question: "Comment est représentée une minuterie sur un schéma ?",
      options: [
        "Horloge simple",
        "Rectangle avec symbole de temporisation et bobine",
        "Cercle avec M",
        "Triangle avec flèche"
      ],
      correct: 1,
      explication: "La minuterie est représentée par un rectangle contenant le symbole de temporisation (arc de cercle avec flèche) et parfois une bobine."
    },
    {
      id: "s17",
      category: "schemas",
      question: "Quel est le symbole d'un parafoudre ?",
      options: [
        "Éclair dans un cercle",
        "Rectangle avec symbole de varistance (2 traits opposés)",
        "Triangle avec P",
        "Carré avec zigzag"
      ],
      correct: 1,
      explication: "Le parafoudre est représenté par le symbole de la varistance : deux traits se faisant face, parfois dans un rectangle avec le symbole terre."
    },
    {
      id: "s18",
      category: "schemas",
      question: "Comment représente-t-on un contacteur sur un schéma ?",
      options: [
        "Simple contact",
        "Rectangle avec bobine (zigzag) et contacts séparés",
        "Cercle avec C",
        "Double rectangle"
      ],
      correct: 1,
      explication: "Le contacteur est représenté avec sa bobine (symbole zigzag avec bornes A1/A2) et ses contacts de puissance séparés (avec numérotation 1-2, 3-4...)."
    },

    // ===== QUESTIONS PRATIQUES SUPPLÉMENTAIRES =====
    {
      id: "p16",
      category: "pratique",
      question: "Comment identifier un défaut d'isolement sur une installation ?",
      options: [
        "Avec un voltmètre entre phase et terre",
        "Avec un mégohmmètre sous 500V DC",
        "En observant les disjoncteurs",
        "Avec un tournevis testeur"
      ],
      correct: 1,
      explication: "Le mégohmmètre applique une tension continue (500V en BT) et mesure la résistance d'isolement. Elle doit être > 0.5 MΩ (500 kΩ)."
    },
    {
      id: "p17",
      category: "pratique",
      question: "Quelle est la valeur de résistance de terre maximale en schéma TT avec DDR 30mA ?",
      options: ["50 Ω", "100 Ω", "500 Ω", "1667 Ω"],
      correct: 3,
      explication: "En TT, R × I∆n ≤ 50V (tension limite de sécurité). Avec un DDR 30mA : R ≤ 50/0.03 = 1667 Ω. En pratique, on vise < 100 Ω."
    },
    {
      id: "p18",
      category: "pratique",
      question: "Qu'est-ce qu'un contact direct en électricité ?",
      options: [
        "Contact entre deux phases",
        "Contact avec une partie normalement sous tension",
        "Contact entre neutre et terre",
        "Contact avec un appareil en défaut"
      ],
      correct: 1,
      explication: "Un contact direct est le contact d'une personne avec un conducteur normalement sous tension (phase, neutre). La protection = isolation, éloignement, obstacles."
    },
    {
      id: "p19",
      category: "pratique",
      question: "Le DDR protège contre quel type de contact ?",
      options: [
        "Contact direct uniquement",
        "Contact indirect uniquement",
        "Contacts directs et indirects",
        "Ni l'un ni l'autre"
      ],
      correct: 2,
      explication: "Le DDR 30mA protège contre les contacts indirects (défaut d'isolement) ET les contacts directs (courant de fuite à travers le corps)."
    },
    {
      id: "p20",
      category: "pratique",
      question: "Quelle est la tension de contact limite conventionnelle en local sec ?",
      options: ["12V", "25V", "50V", "120V"],
      correct: 2,
      explication: "La tension limite UL est de 50V en conditions normales (local sec). Elle descend à 25V en local humide et 12V en local immergé."
    },

    // ===== QUESTIONS NORMES SUPPLÉMENTAIRES =====
    {
      id: "n26",
      category: "normes",
      question: "Quel schéma de liaison à la terre est utilisé en France pour les logements ?",
      options: ["TT", "TN-C", "TN-S", "IT"],
      correct: 0,
      explication: "En France, le régime TT (Terre-Terre) est utilisé : le neutre est mis à la terre au niveau du transformateur, et les masses sont reliées à une terre locale."
    },
    {
      id: "n27",
      category: "normes",
      question: "Que signifie le sigle AGCP ?",
      options: [
        "Appareil Général de Commande Principale",
        "Appareil Général de Coupure et de Protection",
        "Alimentation Générale Courant Principal",
        "Armoire Générale de Contrôle Puissance"
      ],
      correct: 1,
      explication: "L'AGCP (Appareil Général de Coupure et de Protection) est le disjoncteur de branchement fourni par Enedis, situé en limite de propriété ou dans la GTL."
    },
    {
      id: "n28",
      category: "normes",
      question: "Le tableau électrique doit être installé à quelle hauteur (manette du disjoncteur de branchement) ?",
      options: [
        "Entre 0.50m et 1.30m",
        "Entre 0.90m et 1.80m",
        "Entre 1.00m et 1.80m",
        "Entre 1.30m et 2.00m"
      ],
      correct: 1,
      explication: "La manette de l'AGCP doit être entre 0.90m et 1.80m du sol (NF C 15-100). Cette plage assure l'accessibilité en cas d'urgence."
    },
    {
      id: "n29",
      category: "normes",
      question: "Quel pourcentage de la surface d'un logement doit être accessible aux PMR concernant les prises ?",
      options: ["50%", "75%", "100%", "Ce n'est pas une exigence"],
      correct: 2,
      explication: "Toutes les prises doivent être accessibles (entre 5cm et 1.30m du sol). L'axe des prises de courant doit être à minimum 5cm du sol fini."
    },
    {
      id: "n30",
      category: "normes",
      question: "Quelle est la puissance maximale d'un convecteur raccordable sur un circuit 1.5mm² / 16A ?",
      options: ["2000W", "2500W", "3000W", "3500W"],
      correct: 3,
      explication: "P max = 230V × 16A = 3680W. En pratique, on limite à 3500W pour un seul convecteur. Au-delà, utiliser du 2.5mm² / 20A."
    },

    // ===== QUESTIONS HABILITATIONS SUPPLÉMENTAIRES =====
    {
      id: "h21",
      category: "habilitations",
      question: "Quelle est la définition d'un local réservé aux électriciens ?",
      options: [
        "Un local avec du matériel électrique",
        "Un local où l'accès est interdit aux non-habilités",
        "Un local avec un tableau électrique",
        "Tout local technique"
      ],
      correct: 1,
      explication: "Un local réservé aux électriciens est un local dont l'accès est réservé aux personnes habilitées, généralement signalé par un panneau d'interdiction."
    },
    {
      id: "h22",
      category: "habilitations",
      question: "Le titre d'habilitation doit comporter quelles informations obligatoires ?",
      options: [
        "Nom et prénom uniquement",
        "Symboles d'habilitation et signature employeur",
        "Numéro de sécurité sociale",
        "Photo d'identité uniquement"
      ],
      correct: 1,
      explication: "Le titre doit indiquer : identité, employeur, symboles d'habilitation, champ d'application, date de délivrance, signature de l'employeur."
    },
    {
      id: "h23",
      category: "habilitations",
      question: "Un B2V peut-il effectuer des travaux sous tension ?",
      options: [
        "Oui, c'est sa fonction",
        "Non, il dirige des travaux hors tension avec voisinage",
        "Uniquement en TBT",
        "Seulement avec autorisation spéciale"
      ],
      correct: 1,
      explication: "B2V est un chargé de travaux (dirige une équipe) pour des travaux HORS TENSION avec attribut Voisinage. Les TST nécessitent une habilitation spécifique (T)."
    },
    {
      id: "h24",
      category: "habilitations",
      question: "Que doit faire un B1V avant de commencer les travaux ?",
      options: [
        "Réaliser la consignation",
        "Recevoir les instructions du chargé de travaux et vérifier l'absence de tension",
        "Rédiger l'attestation de consignation",
        "Former les autres intervenants"
      ],
      correct: 1,
      explication: "L'exécutant B1V reçoit ses instructions du B2 (chargé de travaux), vérifie l'absence de tension sur son lieu de travail, et respecte le périmètre défini."
    },
    {
      id: "h25",
      category: "habilitations",
      question: "Seuil de courant dangereux traversant le corps humain ?",
      options: ["10 mA", "30 mA", "50 mA", "100 mA"],
      correct: 1,
      explication: "À partir de 30 mA traversant le cœur, il y a risque de fibrillation ventriculaire. C'est pourquoi les DDR 30mA sont dits \"haute sensibilité\"."
    },
    {
      id: "h26",
      category: "habilitations",
      question: "Quelle est la zone 0 en BT ?",
      options: ["Zone de contact direct", "Zone de voisinage simple", "Zone d'investigation (eloignee)", "Zone de travaux sous tension"],
      correct: 2,
      explication: "La zone 0 est la zone d'investigation, eloignee des pieces sous tension. Aucune habilitation n'est requise pour y acceder."
    },
    {
      id: "h27",
      category: "habilitations",
      question: "Quelle classe de gants isolants pour travailler en BT (1000V AC) ?",
      options: ["Classe 00", "Classe 0", "Classe 1", "Classe 2"],
      correct: 1,
      explication: "Les gants classe 0 sont prevus pour des tensions jusqu'a 1000V AC. La classe 00 est limitee a 500V."
    },
    {
      id: "h28",
      category: "habilitations",
      question: "Que signifie MALT lors de la consignation ?",
      options: ["Mesure Apres Lecture Tension", "Mise A La Terre", "Mesure Avant Liaison Travaux", "Mode Arret Longue Temporisation"],
      correct: 1,
      explication: "MALT = Mise A La Terre. Apres la VAT, on realise la MALT et le CCT si necessaire."
    },
    {
      id: "h29",
      category: "habilitations",
      question: "Quelle distance correspond a la DLVS en BT ?",
      options: ["0.3 m", "0.5 m", "1 m", "3 m"],
      correct: 3,
      explication: "En BT, la DLVS (Distance Limite de Voisinage Simple) est de 3 m. C'est la limite entre zone 0 et zone 1."
    },
    {
      id: "h30",
      category: "habilitations",
      question: "Quel document delivre le BC au B2 avant les travaux ?",
      options: ["Ordre de travail", "Attestation de consignation", "Permis de feu", "Fiche de poste"],
      correct: 1,
      explication: "Le BC delivre l'attestation de consignation au B2, qui peut alors commencer les travaux."
    },
    {
      id: "h31",
      category: "habilitations",
      question: "Quelle est la validite maximale d'une habilitation ?",
      options: ["1 an", "2 ans", "3 ans", "5 ans"],
      correct: 2,
      explication: "L'habilitation doit etre revisee tous les 3 ans maximum, ou plus tot si changement de situation."
    },

    // ===== TÂCHES PRATIQUES - SCÉNARIOS TERRAIN =====
    {
      id: "tp1",
      category: "pratique",
      question: "TÂCHE : Vous devez installer une prise dans une salle de bain à 2m du bord de la baignoire. Quelle protection est obligatoire ?",
      options: [
        "Disjoncteur 16A seul",
        "DDR 30mA + disjoncteur 16A",
        "Interrupteur différentiel 300mA",
        "Aucune protection spéciale"
      ],
      correct: 1,
      explication: "En volume 3 (au-delà de 60cm du bord de baignoire), une prise est autorisée mais DOIT être protégée par un DDR 30mA. La section sera de 2.5mm²."
    },
    {
      id: "tp2",
      category: "pratique",
      question: "TÂCHE : Client signale que le DDR 30mA déclenche quand il branche son sèche-linge. Votre première action ?",
      options: [
        "Remplacer le DDR par un modèle plus puissant",
        "Vérifier que le sèche-linge est sur circuit dédié protégé par DDR type A",
        "Augmenter la section du câble",
        "Shunter le DDR temporairement"
      ],
      correct: 1,
      explication: "Le sèche-linge nécessite un circuit dédié avec DDR type A (détecte les courants à composante continue). Vérifiez aussi l'état de l'appareil (défaut isolement)."
    },
    {
      id: "tp3",
      category: "pratique",
      question: "TÂCHE : Vous réceptionnez un tableau électrique neuf. Quelle vérification effectuez-vous en premier ?",
      options: [
        "Mesurer l'isolement de tous les circuits",
        "Vérifier la continuité des conducteurs PE",
        "Contrôler le serrage de toutes les connexions",
        "Toutes ces vérifications sont nécessaires"
      ],
      correct: 3,
      explication: "La réception d'un tableau implique : vérification des serrages (couple), continuité PE, mesure d'isolement, test des DDR, conformité à la NF C 15-100."
    },
    {
      id: "tp4",
      category: "pratique",
      question: "TÂCHE : Vous devez câbler un va-et-vient. Combien de fils arrivent à chaque interrupteur ?",
      options: [
        "2 fils à chaque interrupteur",
        "3 fils à chaque interrupteur",
        "4 fils à chaque interrupteur",
        "2 fils au premier, 3 au second"
      ],
      correct: 1,
      explication: "Chaque interrupteur va-et-vient reçoit 3 fils : 1 navette entrante, 1 navette sortante, et la phase (premier inter) ou le retour lampe (second inter)."
    },
    {
      id: "tp5",
      category: "pratique",
      question: "TÂCHE : Vous mesurez 0,8Ω entre la prise de terre et la barre de terre du tableau. L'installation est-elle conforme ?",
      options: [
        "Oui, c'est excellent",
        "Non, la résistance est trop élevée",
        "Dépend du type de DDR installé",
        "Impossible à déterminer sans plus d'infos"
      ],
      correct: 0,
      explication: "Avec un DDR 30mA, la résistance de terre doit être ≤ 100Ω (500V/30mA = 16Ω théorique, 100Ω accepté). 0,8Ω est une excellente valeur."
    },
    {
      id: "tp6",
      category: "pratique",
      question: "TÂCHE : Installer un tableau divisionnaire à 15m du tableau principal. Section du câble d'alimentation ?",
      options: [
        "2.5 mm² suffit jusqu'à 20A",
        "Calcul de chute de tension obligatoire",
        "10 mm² minimum obligatoire",
        "Même section que le disjoncteur de branchement"
      ],
      correct: 1,
      explication: "Pour un tableau divisionnaire, il faut calculer la chute de tension (max 3% en éclairage, 5% autres usages) en fonction de la puissance et de la longueur."
    },
    {
      id: "tp7",
      category: "pratique",
      question: "TÂCHE : Vous devez raccorder une VMC. Sur quel type de circuit et protection ?",
      options: [
        "Circuit éclairage, disjoncteur 10A",
        "Circuit dédié, disjoncteur 2A",
        "Circuit prises, disjoncteur 16A",
        "N'importe quel circuit avec fusible"
      ],
      correct: 1,
      explication: "La VMC doit avoir un circuit dédié en 1.5mm², protégé par un disjoncteur 2A (ou 16A selon NF C 15-100 art. 10.1.5.1.2). Le circuit doit être non coupé."
    },
    {
      id: "tp8",
      category: "pratique",
      question: "TÂCHE : Identifier l'erreur - Tableau avec : DDR 63A Type AC en tête, dessous : 1 disj 32A (plaque), 1 disj 20A (lave-linge).",
      options: [
        "Le DDR est sous-dimensionné",
        "Le DDR Type AC ne convient pas pour ces circuits",
        "Le disjoncteur plaque devrait être 40A",
        "Aucune erreur"
      ],
      correct: 1,
      explication: "La plaque et le lave-linge nécessitent un DDR Type A (courants à composante continue pulsée). Le Type AC ne détecte que les courants alternatifs purs."
    },
    {
      id: "tp9",
      category: "pratique",
      question: "TÂCHE : Mesure de continuité PE : vous trouvez 25Ω entre prise et tableau. Diagnostic ?",
      options: [
        "Conforme si câble > 50m",
        "Défaut de continuité - connexion à vérifier",
        "Normal pour du 1.5mm²",
        "Mesure à refaire sous tension"
      ],
      correct: 1,
      explication: "La continuité PE doit être proche de 0Ω (typiquement < 2Ω). 25Ω indique un mauvais contact, une connexion desserrée ou un fil endommagé."
    },
    {
      id: "tp10",
      category: "pratique",
      question: "TÂCHE : Le client veut ajouter un point lumineux commandé par télérupteur. Où placer le télérupteur ?",
      options: [
        "Obligatoirement dans le tableau électrique",
        "À proximité du premier bouton poussoir",
        "Au tableau ou sur le trajet des canalisations",
        "Directement dans la boîte du luminaire"
      ],
      correct: 2,
      explication: "Le télérupteur peut être au tableau (rail DIN) ou en saillie/encastré sur le trajet. Le placer au tableau facilite la maintenance et le repérage."
    },
    {
      id: "tp11",
      category: "schemas",
      question: "TÂCHE : Sur un schéma unifilaire, vous voyez le symbole ⏚. De quoi s'agit-il ?",
      options: [
        "Prise de courant",
        "Prise de terre",
        "Borne de raccordement",
        "Point de mesure"
      ],
      correct: 1,
      explication: "Le symbole ⏚ (trois traits horizontaux décroissants) représente la prise de terre ou connexion à la terre selon la norme CEI 60617."
    },
    {
      id: "tp12",
      category: "schemas",
      question: "TÂCHE : Lire ce schéma - Un trait avec 3 barres obliques représente :",
      options: [
        "Un câble triphasé",
        "Un câble avec 3 conducteurs",
        "Une liaison en parallèle",
        "Un défaut d'isolement"
      ],
      correct: 1,
      explication: "Les barres obliques sur un trait indiquent le nombre de conducteurs. 3 barres = 3 conducteurs (ex: phase, neutre, PE pour un circuit monophasé)."
    },
    {
      id: "tp13",
      category: "pratique",
      question: "TÂCHE : Mise en service tableau neuf - Le test DDR au bouton test fonctionne, mais le DDR ne déclenche pas avec un testeur 30mA. Cause probable ?",
      options: [
        "DDR défectueux - à remplacer",
        "Testeur mal calibré",
        "Le neutre n'est pas raccordé au DDR",
        "Normal, le bouton test suffit"
      ],
      correct: 2,
      explication: "Si le bouton test fonctionne mais pas le test réel, c'est souvent que le neutre n'est pas connecté au DDR (erreur de câblage fréquente)."
    },
    {
      id: "tp14",
      category: "pratique",
      question: "TÂCHE : Rénovation - vous trouvez des fils sans repérage de couleur (tous gris). Comment identifier la terre ?",
      options: [
        "C'est forcément le plus gros fil",
        "Mesure de continuité avec la barrette de terre",
        "Le fil relié à la carcasse métallique",
        "Impossible sans destructuration"
      ],
      correct: 1,
      explication: "Sans repérage couleur, on identifie la terre par continuité avec la barrette de terre du tableau. La phase se trouve avec un VAT ou testeur de phase."
    },
    {
      id: "tp15",
      category: "pratique",
      question: "TÂCHE : Installer un circuit extérieur pour éclairage jardin. Protection obligatoire ?",
      options: [
        "Disjoncteur 10A suffit",
        "DDR 30mA obligatoire + disjoncteur adapté",
        "Protection IP44 des luminaires suffit",
        "Fusible 10A avec boîtier étanche"
      ],
      correct: 1,
      explication: "Tout circuit extérieur doit être protégé par un DDR 30mA haute sensibilité. Les luminaires doivent avoir un IP adapté (IP44 minimum en extérieur)."
    },
    {
      id: "tp16",
      category: "calculs",
      question: "TÂCHE CALCUL : Circuit prises 20A, longueur 25m, section 2.5mm². Chute de tension approximative (cosφ=1, Cu=56) ?",
      options: [
        "Environ 3.5%",
        "Environ 7%",
        "Environ 1.7%",
        "Calcul impossible sans puissance"
      ],
      correct: 0,
      explication: "ΔU = (2×L×I)/(γ×S) = (2×25×20)/(56×2.5) = 7.14V soit 3.1% sur 230V. Proche de la limite des 3% pour éclairage, OK pour prises (5%)."
    },
    {
      id: "tp17",
      category: "pratique",
      question: "TÂCHE : Client demande l'installation d'une borne de recharge véhicule électrique 7kW. Prérequis ?",
      options: [
        "Simple prise 32A suffit",
        "Circuit dédié 10mm², DDR type A ou F, disjoncteur 40A",
        "Raccordement direct au compteur",
        "Extension du tableau principal obligatoire"
      ],
      correct: 1,
      explication: "Une borne 7kW (32A mono) nécessite : circuit dédié 10mm², DDR Type A ou F (selon borne), disjoncteur 40A. Déclaration CONSUEL si puissance > 3.7kW."
    },
    {
      id: "tp18",
      category: "pratique",
      question: "TÂCHE : Vérifier l'équilibrage des phases d'un tableau triphasé. Écart maximum toléré entre phases ?",
      options: [
        "5% de la charge totale",
        "10% de la charge totale",
        "Pas de limite normative stricte, bon sens",
        "15% maximum"
      ],
      correct: 2,
      explication: "La NF C 15-100 n'impose pas de % précis, mais un bon équilibrage limite le courant dans le neutre et optimise l'installation. Viser < 10-15% d'écart."
    },
    {
      id: "tp19",
      category: "pratique",
      question: "TÂCHE : Identifier le défaut - Circuit éclairage : l'ampoule reste faiblement allumée même interrupteur éteint.",
      options: [
        "Court-circuit",
        "Courant de fuite par l'interrupteur ou câblage",
        "Ampoule défectueuse",
        "Surtension réseau"
      ],
      correct: 1,
      explication: "Une LED restant faiblement allumée indique souvent un courant de fuite : interrupteur avec voyant, proximité de câbles, ou neutre coupé avant la phase."
    },
    {
      id: "tp20",
      category: "pratique",
      question: "TÂCHE : Pose d'un interrupteur. Quel fil raccorder sur la borne L ?",
      options: [
        "Le neutre bleu",
        "La phase (rouge/marron/noir)",
        "Le retour lampe",
        "La terre"
      ],
      correct: 1,
      explication: "La borne L (Line) reçoit la phase. Le retour lampe part de la borne 1 ou ↑. Le neutre va directement au luminaire, jamais par l'interrupteur."
    },
    {
      id: "tp21",
      category: "schemas",
      question: "TÂCHE : Sur schéma, rectangle avec symbole ~ à l'intérieur. Signification ?",
      options: [
        "Transformateur",
        "Source de courant alternatif / Générateur AC",
        "Moteur asynchrone",
        "Onduleur"
      ],
      correct: 1,
      explication: "Le rectangle avec ~ représente une source AC (générateur, réseau). Le moteur serait un cercle avec ~. Le transformateur a deux bobines couplées."
    },
    {
      id: "tp22",
      category: "pratique",
      question: "TÂCHE : Dépannage - Le disjoncteur de branchement déclenche mais pas les DDR ni disjoncteurs divisionnaires. Diagnostic ?",
      options: [
        "Surcharge globale de l'installation",
        "Court-circuit en amont des DDR",
        "DDR défectueux",
        "Problème chez le fournisseur"
      ],
      correct: 1,
      explication: "Si seul le DB déclenche, le défaut est entre le DB et le premier DDR/disjoncteur (borniers, peigne, câbles du tableau). Vérifier visuellement."
    },
    {
      id: "tp23",
      category: "pratique",
      question: "TÂCHE : Passage de câble dans une cloison. Distance minimale d'un ouvrant (porte/fenêtre) ?",
      options: [
        "Aucune distance imposée",
        "5 cm minimum",
        "10 cm minimum",
        "20 cm minimum"
      ],
      correct: 0,
      explication: "La NF C 15-100 n'impose pas de distance minimale par rapport aux ouvrants. Les zones de passage sont définies par rapport aux angles (20cm) et hauteurs."
    },
    {
      id: "tp24",
      category: "pratique",
      question: "TÂCHE : Test d'isolement d'un circuit. Valeur minimale acceptable selon NF C 15-100 ?",
      options: [
        "0.25 MΩ",
        "0.5 MΩ",
        "1 MΩ",
        "Dépend de la tension"
      ],
      correct: 1,
      explication: "Pour une installation BT, l'isolement minimum est de 0.5 MΩ (500 kΩ) mesuré sous 500V DC. En pratique, on attend > 1 MΩ pour une installation neuve."
    },
    {
      id: "tp25",
      category: "pratique",
      question: "TÂCHE : Raccordement coffret de communication. Quel câble entre le coffret et les prises RJ45 ?",
      options: [
        "Câble téléphonique 4 paires",
        "Câble Grade 2TV ou Grade 3 (Cat 6)",
        "Câble coaxial",
        "Câble 3G2.5mm²"
      ],
      correct: 1,
      explication: "Les prises RJ45 résidentielles doivent être câblées en Grade 2TV minimum (Cat 5e + coax) ou Grade 3 (Cat 6a + coax). Le câble 4 paires téléphonique est obsolète."
    },

    // ===== MOTEURS =====
    {
      id: "mot1",
      category: "moteurs",
      question: "Quelle partie du moteur est fixe ?",
      options: ["Le rotor", "Le stator", "L'arbre"],
      correct: 1,
      explication: "Le stator est la partie fixe du moteur, il crée le champ magnétique tournant. Le rotor est la partie mobile."
    },
    {
      id: "mot2",
      category: "moteurs",
      question: "Quelle est la vitesse de synchronisme d'un moteur 4 pôles à 50Hz ?",
      options: ["3000 tr/min", "1500 tr/min", "750 tr/min"],
      correct: 1,
      explication: "Ns = 60×f/p = 60×50/2 = 1500 tr/min. Un moteur 4 pôles a 2 paires de pôles."
    },
    {
      id: "mot3",
      category: "moteurs",
      question: "Pourquoi utilise-t-on un condensateur sur un moteur monophasé ?",
      options: ["Pour stocker l'énergie", "Pour créer un déphasage", "Pour protéger le moteur"],
      correct: 1,
      explication: "Le condensateur crée un déphasage (~90°) entre les enroulements pour simuler un champ tournant biphasé."
    },
    {
      id: "mot4",
      category: "moteurs",
      question: "Que signifie MAS ?",
      options: ["Moteur A Synchrone", "Moteur Asynchrone", "Machine A Stator"],
      correct: 1,
      explication: "MAS = Moteur Asynchrone. C'est le type de moteur le plus répandu dans l'industrie."
    },
    {
      id: "mot5",
      category: "moteurs",
      question: "Un moteur 400/690V sur réseau 400V se couple en ?",
      options: ["Étoile", "Triangle", "Les deux possibles"],
      correct: 0,
      explication: "La petite tension (400V) correspond au triangle. Donc sur réseau 400V, on couple en étoile pour que chaque enroulement reçoive 230V."
    },
    {
      id: "mot6",
      category: "moteurs",
      question: "En étoile, la tension aux bornes d'un enroulement est ?",
      options: ["U", "U/√3", "U×√3"],
      correct: 1,
      explication: "En couplage étoile, chaque enroulement reçoit la tension simple U/√3 (230V sur réseau 400V)."
    },
    {
      id: "mot7",
      category: "moteurs",
      question: "Combien de bornes sur une plaque à bornes moteur standard ?",
      options: ["3", "6", "9"],
      correct: 1,
      explication: "La plaque à bornes standard comporte 6 bornes : U1, V1, W1 (débuts) et U2, V2, W2 (fins des enroulements)."
    },
    {
      id: "mot8",
      category: "moteurs",
      question: "En démarrage étoile-triangle, le courant de démarrage est divisé par ?",
      options: ["2", "3", "√3"],
      correct: 1,
      explication: "Le démarrage étoile-triangle divise le courant par 3 (et le couple aussi). C'est l'intérêt principal de cette méthode."
    },
    {
      id: "mot9",
      category: "moteurs",
      question: "Quel démarrage permet la variation de vitesse ?",
      options: ["Direct", "Étoile-triangle", "Variateur de fréquence"],
      correct: 2,
      explication: "Seul le variateur de fréquence permet de faire varier la vitesse du moteur en modifiant la fréquence d'alimentation."
    },
    {
      id: "mot10",
      category: "moteurs",
      question: "Un soft starter utilise quel composant principal ?",
      options: ["Condensateurs", "Thyristors", "Relais"],
      correct: 1,
      explication: "Le démarreur progressif (soft starter) utilise des thyristors pour augmenter progressivement la tension."
    },
    {
      id: "mot11",
      category: "moteurs",
      question: "Un fusible aM est conçu pour ?",
      options: ["L'éclairage", "Les moteurs", "L'électronique"],
      correct: 1,
      explication: "Les fusibles aM (accompagnement Moteur) supportent le courant de démarrage élevé des moteurs."
    },
    {
      id: "mot12",
      category: "moteurs",
      question: "Sur quoi règle-t-on le relais thermique ?",
      options: ["Sur Id (courant de démarrage)", "Sur In (courant nominal)", "Sur Pn (puissance nominale)"],
      correct: 1,
      explication: "Le relais thermique se règle sur le courant nominal In indiqué sur la plaque signalétique du moteur."
    },
    {
      id: "mot13",
      category: "moteurs",
      question: "Une sonde PTC mesure ?",
      options: ["Le courant", "La tension", "La température"],
      correct: 2,
      explication: "Les sondes PTC (thermistances) mesurent directement la température des enroulements pour une protection optimale."
    },
    {
      id: "mot14",
      category: "moteurs",
      question: "La classe de démarrage 10 signifie ?",
      options: ["Démarrage en 10 secondes max", "10 démarrages par heure", "Moteur 10 pôles"],
      correct: 0,
      explication: "La classe 10 correspond à un temps de démarrage normal (< 10s). Classe 20 pour démarrage lourd, classe 30 pour très lourd."
    },
    {
      id: "mot15",
      category: "moteurs",
      question: "Un moteur asynchrone tourne toujours ?",
      options: ["À la vitesse de synchronisme", "Plus lentement que la vitesse de synchronisme", "Plus vite que la vitesse de synchronisme"],
      correct: 1,
      explication: "Le rotor tourne toujours un peu moins vite que le champ tournant (glissement). C'est le principe du moteur asynchrone."
    },

    // ===== SÉCURITÉ ERP =====
    {
      id: "erp1",
      category: "erp-securite",
      question: "Quelle est l'autonomie minimale d'un BAES d'évacuation ?",
      options: ["30 minutes", "1 heure", "5 heures"],
      correct: 1,
      explication: "Les BAES d'évacuation doivent avoir une autonomie minimale d'1 heure. Les BAEH (établissements de soins) ont 5 heures."
    },
    {
      id: "erp2",
      category: "erp-securite",
      question: "À quelle fréquence doit-on tester les BAES avec la télécommande ?",
      options: ["Tous les jours", "Tous les mois", "Tous les ans"],
      correct: 1,
      explication: "Test fonctionnel mensuel avec télécommande. Test d'autonomie semestriel. Vérification complète annuelle."
    },
    {
      id: "erp3",
      category: "erp-securite",
      question: "Que signifie SSI ?",
      options: ["Système de Sécurité Incendie", "Signal de Sécurité Intérieur", "Service de Surveillance Incendie"],
      correct: 0,
      explication: "SSI = Système de Sécurité Incendie. Il regroupe la détection, l'alarme et la mise en sécurité."
    },
    {
      id: "erp4",
      category: "erp-securite",
      question: "Combien de catégories de SSI existe-t-il ?",
      options: ["3 (A, B, C)", "5 (A à E)", "4 (1 à 4)"],
      correct: 1,
      explication: "Il existe 5 catégories de SSI : A (détection automatique complète) à E (alarme simple)."
    },
    {
      id: "erp5",
      category: "erp-securite",
      question: "Quel type d'onduleur offre une protection sans coupure ?",
      options: ["Off-line", "Line-interactive", "On-line (double conversion)"],
      correct: 2,
      explication: "L'onduleur on-line (double conversion) alimente en permanence la charge via l'onduleur. Aucun temps de commutation."
    },
    {
      id: "erp6",
      category: "erp-securite",
      question: "Les ERP de 1ère catégorie accueillent ?",
      options: ["Moins de 300 personnes", "Plus de 1500 personnes", "Entre 701 et 1500 personnes"],
      correct: 1,
      explication: "1ère catégorie : > 1500 personnes. 2ème : 701-1500. 3ème : 301-700. 4ème : ≤ 300. 5ème : selon seuils par type."
    },
    {
      id: "erp7",
      category: "erp-securite",
      question: "Un détecteur de fumée optique fonctionne par ?",
      options: ["Mesure de température", "Diffusion de lumière par les particules", "Analyse des gaz"],
      correct: 1,
      explication: "Le détecteur optique (photoélectrique) détecte la diffusion de la lumière par les particules de fumée."
    },
    {
      id: "erp8",
      category: "erp-securite",
      question: "L'éclairage d'ambiance doit fournir ?",
      options: ["45 lumens minimum", "5 lumens par m² minimum", "100 lux minimum"],
      correct: 1,
      explication: "L'éclairage d'ambiance (anti-panique) doit fournir 5 lumens par m² sur toute la surface."
    },
    {
      id: "erp9",
      category: "erp-securite",
      question: "Un groupe électrogène en ERP doit démarrer en ?",
      options: ["30 secondes maximum", "15 secondes maximum", "1 minute maximum"],
      correct: 1,
      explication: "Le groupe électrogène doit être opérationnel en 15 secondes maximum pour assurer la continuité des équipements de sécurité."
    },
    {
      id: "erp10",
      category: "erp-securite",
      question: "Quel type d'alarme ERP comporte 2 niveaux (restreinte puis générale) ?",
      options: ["Type 1", "Type 2a", "Type 4"],
      correct: 1,
      explication: "L'alarme type 2a comporte 2 signaux : alarme restreinte (personnel) puis alarme générale (évacuation)."
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
