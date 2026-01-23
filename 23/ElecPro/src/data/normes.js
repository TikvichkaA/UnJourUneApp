// NF C 15-100 - Données pédagogiques structurées
// Sources: Guide ABB (janvier 2025) + Guide Legrand

export const normes = {
  version: "2024 (Amendement A5)",
  structure: "21 normes de la série NF C 15-100",

  categories: [
    {
      id: "equipements-pieces",
      titre: "Équipements par pièce",
      icon: "🏠",
      description: "Nombre minimum d'équipements par local",
      fiches: [
        {
          id: "chambre",
          titre: "Chambre",
          surface: "≥ 9m²",
          equipements: [
            { type: "Prises de courant 16A", min: 3, note: "Dont 1 à proximité de l'interrupteur" },
            { type: "Prises RJ45", min: 1, note: "Communication Grade 2TV minimum" },
            { type: "Point d'éclairage", min: 1, note: "En plafond ou applique, commandé par interrupteur" }
          ],
          regles: [
            "Pas de prise dans un rayon de 20cm d'un point d'eau",
            "Interrupteur à hauteur 0.90m à 1.30m",
            "Prises à hauteur 5cm minimum du sol fini"
          ]
        },
        {
          id: "sejour",
          titre: "Séjour / Salon",
          surface: "Variable",
          equipements: [
            { type: "Prises de courant 16A", min: 5, note: "1 par tranche de 4m² (min 5)" },
            { type: "Prises RJ45", min: 2, note: "Communication" },
            { type: "Prise TV", min: 1, note: "Coaxiale ou RJ45 selon grade" },
            { type: "Point d'éclairage", min: 1, note: "Commandé" }
          ],
          regles: [
            "1 socle supplémentaire par tranche de 4m² au-delà de 20m²",
            "Alimentation possible pour climatisation (recommandé)"
          ]
        },
        {
          id: "cuisine",
          titre: "Cuisine",
          surface: "Variable",
          equipements: [
            { type: "Prises plan de travail", min: 4, note: "Si surface > 4m², sinon 3" },
            { type: "Circuit spécialisé cuisson", min: 1, note: "32A mono ou 20A tri" },
            { type: "Circuits spécialisés", min: 3, note: "Lave-vaisselle, lave-linge, sèche-linge, four, congélateur..." },
            { type: "Point d'éclairage", min: 1, note: "Commandé" }
          ],
          regles: [
            "Prises plan de travail à 8cm min au-dessus du plan",
            "Pas de prise au-dessus évier/plaques",
            "Circuit cuisson en 6mm² protégé 32A",
            "Circuits spécialisés en 2.5mm² protégé 20A"
          ]
        },
        {
          id: "sdb",
          titre: "Salle de bain",
          surface: "Variable",
          equipements: [
            { type: "Prise de courant", min: 1, note: "Hors volumes 0, 1 et 2" },
            { type: "Point d'éclairage", min: 1, note: "Commandé, IP selon volume" }
          ],
          volumes: [
            {
              volume: 0,
              description: "Intérieur baignoire/douche",
              ip: "IPX7",
              tension: "TBTS 12V max",
              appareils: "Uniquement TBTS ≤12V"
            },
            {
              volume: 1,
              description: "Au-dessus baignoire/douche jusqu'à 2.25m",
              ip: "IPX5 (jets) ou IPX4",
              tension: "TBTS 12V ou classe II",
              appareils: "Chauffe-eau instantané, luminaire TBTS"
            },
            {
              volume: 2,
              description: "60cm autour volume 1",
              ip: "IPX4 (IPX5 si jets)",
              tension: "230V classe II avec DDR 30mA",
              appareils: "Luminaires classe II, prises rasoir, sèche-serviettes"
            },
            {
              volume: "Hors volumes",
              description: "Au-delà des volumes 0, 1, 2",
              ip: "Selon local (IPX1 min)",
              tension: "230V avec DDR 30mA",
              appareils: "Tous appareils avec DDR 30mA"
            }
          ],
          regles: [
            "DDR 30mA obligatoire pour tous les circuits",
            "Liaison équipotentielle supplémentaire (LES)",
            "Pas d'appareillage dans volumes 0 et 1",
            "Interrupteur hors volumes (ou IP adapté avec tirette)"
          ]
        },
        {
          id: "couloir",
          titre: "Couloir / Dégagement",
          surface: "> 4m²",
          equipements: [
            { type: "Prise de courant 16A", min: 1, note: "Si surface > 4m²" },
            { type: "Point d'éclairage", min: 1, note: "Commandé, va-et-vient si >2 accès" }
          ],
          regles: [
            "Détecteur de fumée dans circulation menant aux chambres",
            "Va-et-vient ou télérupteur si plusieurs accès"
          ]
        },
        {
          id: "exterieur",
          titre: "Extérieur",
          surface: "Variable",
          equipements: [
            { type: "Point d'éclairage", min: 1, note: "Entrée principale" },
            { type: "Prise de courant", min: 1, note: "Recommandé, IP44 minimum" }
          ],
          regles: [
            "IP44 minimum pour prises et luminaires",
            "DDR 30mA obligatoire",
            "Câbles enterrés à 50cm min (85cm sous voie carrossable)"
          ]
        }
      ]
    },
    {
      id: "protections",
      titre: "Protections",
      icon: "🛡️",
      description: "Dimensionnement des protections",
      fiches: [
        {
          id: "sections-circuits",
          titre: "Sections et protections par circuit",
          tableau: [
            { circuit: "Éclairage", section: "1.5 mm²", protection: "10A ou 16A", nbPoints: "8 points max" },
            { circuit: "Prises 16A", section: "1.5 mm²", protection: "16A", nbPoints: "5 prises max" },
            { circuit: "Prises 16A", section: "2.5 mm²", protection: "20A", nbPoints: "8 prises max" },
            { circuit: "Chauffe-eau", section: "2.5 mm²", protection: "20A", nbPoints: "Circuit dédié" },
            { circuit: "Lave-linge", section: "2.5 mm²", protection: "20A", nbPoints: "Circuit dédié" },
            { circuit: "Lave-vaisselle", section: "2.5 mm²", protection: "20A", nbPoints: "Circuit dédié" },
            { circuit: "Sèche-linge", section: "2.5 mm²", protection: "20A", nbPoints: "Circuit dédié" },
            { circuit: "Four", section: "2.5 mm²", protection: "20A", nbPoints: "Circuit dédié" },
            { circuit: "Congélateur", section: "2.5 mm²", protection: "20A", nbPoints: "Circuit dédié" },
            { circuit: "Plaque cuisson", section: "6 mm²", protection: "32A", nbPoints: "Circuit dédié" },
            { circuit: "Volets roulants", section: "1.5 mm²", protection: "16A", nbPoints: "Groupement possible" },
            { circuit: "VMC", section: "1.5 mm²", protection: "2A", nbPoints: "Circuit dédié" },
            { circuit: "Chauffage ≤3500W", section: "1.5 mm²", protection: "16A", nbPoints: "Selon puissance" },
            { circuit: "Chauffage ≤4500W", section: "2.5 mm²", protection: "20A", nbPoints: "Selon puissance" },
            { circuit: "Chauffage ≤5750W", section: "4 mm²", protection: "25A", nbPoints: "Selon puissance" },
            { circuit: "Chauffage ≤7250W", section: "6 mm²", protection: "32A", nbPoints: "Selon puissance" },
            { circuit: "IRVE Mode 2", section: "2.5 mm²", protection: "20A", nbPoints: "Circuit dédié" },
            { circuit: "IRVE Mode 3 mono", section: "6 mm² ou 10 mm²", protection: "32A ou 40A", nbPoints: "Circuit dédié" }
          ]
        },
        {
          id: "ddr",
          titre: "Interrupteurs différentiels (DDR)",
          description: "Protection contre les contacts indirects",
          types: [
            {
              type: "Type AC",
              sensibilite: "30mA",
              usage: "Circuits résistifs classiques",
              symbole: "~",
              applications: ["Éclairage incandescent", "Chauffage résistif", "Prises standard"]
            },
            {
              type: "Type A",
              sensibilite: "30mA",
              usage: "Circuits avec composantes continues",
              symbole: "~ avec demi-onde",
              applications: ["Lave-linge", "Plaques induction", "Informatique", "Éclairage LED"]
            },
            {
              type: "Type F",
              sensibilite: "30mA",
              usage: "Circuits avec variateurs et onduleurs",
              symbole: "F",
              applications: ["Climatisation inverter", "Pompes à chaleur", "Certaines IRVE"]
            },
            {
              type: "Type B",
              sensibilite: "30mA",
              usage: "Courants continus lisses",
              symbole: "B ou ≡",
              applications: ["IRVE avec redresseur", "Photovoltaïque sans transfo"]
            }
          ],
          regles: [
            "2 DDR 30mA minimum par logement",
            "1 Type A obligatoire (plaques, lave-linge)",
            "8 circuits max par DDR 40A, 8 circuits max par DDR 63A",
            "Répartir les circuits entre les DDR"
          ]
        },
        {
          id: "afdd",
          titre: "Détecteur d'arc (AFDD)",
          description: "Protection contre les incendies d'origine électrique",
          principe: "Détecte les arcs électriques dangereux (série et parallèle)",
          obligatoire: [
            "Locaux à sommeil (chambres) - recommandé/obligatoire selon amendement",
            "Locaux avec risque d'incendie"
          ],
          fonctionnement: [
            "Analyse la signature électrique du courant",
            "Détecte les arcs série (fil coupé) et parallèle",
            "Différencie arcs dangereux des arcs normaux (moteur, interrupteur)"
          ]
        }
      ]
    },
    {
      id: "mise-a-terre",
      titre: "Mise à la terre",
      icon: "⚡",
      description: "Régimes de neutre et liaisons équipotentielles",
      fiches: [
        {
          id: "regimes-neutre",
          titre: "Régimes de neutre",
          types: [
            {
              regime: "TT",
              description: "Neutre à la terre, masses à la terre",
              usage: "Habitat, petit tertiaire (distribution publique)",
              protection: "DDR obligatoire"
            },
            {
              regime: "TN",
              description: "Neutre à la terre, masses au neutre",
              usage: "Industrie, gros tertiaire",
              protection: "Protection par disjoncteur"
            },
            {
              regime: "IT",
              description: "Neutre isolé, masses à la terre",
              usage: "Industrie (continuité de service)",
              protection: "CPI + DDR"
            }
          ]
        },
        {
          id: "liaisons-equipotentielles",
          titre: "Liaisons équipotentielles",
          types: [
            {
              type: "LEP - Liaison Équipotentielle Principale",
              section: "6mm² Cu min (ou 25mm² si aluminium)",
              elements: [
                "Canalisation d'eau",
                "Canalisation de gaz",
                "Chauffage central",
                "Structures métalliques du bâtiment"
              ]
            },
            {
              type: "LES - Liaison Équipotentielle Supplémentaire",
              section: "2.5mm² Cu (protégé) ou 4mm² (non protégé)",
              elements: [
                "Huisseries métalliques salle de bain",
                "Canalisations métalliques",
                "Baignoire/receveur métallique",
                "Tous éléments conducteurs accessibles"
              ],
              local: "Obligatoire en salle de bain"
            }
          ]
        },
        {
          id: "prise-terre",
          titre: "Prise de terre",
          methodes: [
            {
              type: "Boucle fond de fouille",
              description: "Câble nu 25mm² Cu dans fondations",
              resistance: "Viser < 100Ω avec DDR 500mA, < 50Ω recommandé"
            },
            {
              type: "Piquet(s)",
              description: "Piquet(s) acier galvanisé ou cuivre",
              resistance: "Ajouter piquets si résistance trop élevée"
            }
          ],
          controle: "Mesure obligatoire, valeur notée sur le CONSUEL"
        }
      ]
    },
    {
      id: "gtl-etel",
      titre: "GTL et ETEL",
      icon: "📦",
      description: "Gaine technique et espace technique électrique",
      fiches: [
        {
          id: "gtl",
          titre: "GTL - Gaine Technique Logement",
          description: "Contient l'ensemble des équipements de puissance et communication",
          contenu: [
            "Panneau de contrôle (disjoncteur de branchement)",
            "Tableau de répartition",
            "Coffret de communication",
            "Équipements de gestion d'énergie",
            "Autres équipements courants faibles"
          ],
          dimensions: {
            largeur: "600mm minimum",
            profondeur: "200mm minimum",
            hauteur: "Du sol au plafond recommandé"
          },
          regles: [
            "Obligatoire dans logements neufs et rénovations totales",
            "Emplacement accessible en permanence",
            "Éclairage dédié recommandé"
          ]
        },
        {
          id: "etel",
          titre: "ETEL - Espace Technique Électrique du Logement",
          description: "Zone réservée devant la GTL",
          dimensions: {
            largeur: "600mm",
            profondeur: "600mm (dégagement devant GTL)"
          },
          regles: [
            "Aucune canalisation d'eau ou gaz ne doit traverser",
            "Doit rester accessible en permanence",
            "Protection mécanique si nécessaire"
          ]
        }
      ]
    },
    {
      id: "irve",
      titre: "IRVE - Recharge VE",
      icon: "🔌",
      description: "Infrastructure de Recharge pour Véhicules Électriques",
      fiches: [
        {
          id: "modes-charge",
          titre: "Modes de charge",
          modes: [
            {
              mode: "Mode 1",
              description: "Prise domestique standard",
              puissance: "≤ 2.3kW (10A)",
              protection: "Non recommandé - risque d'échauffement",
              usage: "Dépannage uniquement"
            },
            {
              mode: "Mode 2",
              description: "Prise renforcée avec boîtier de contrôle",
              puissance: "≤ 3.7kW (16A)",
              protection: "DDR Type A + disjoncteur 20A",
              section: "2.5mm²",
              usage: "Charge lente à domicile"
            },
            {
              mode: "Mode 3",
              description: "Borne de recharge dédiée (Wallbox)",
              puissance: "3.7kW à 22kW",
              protection: "DDR Type A/F/B selon borne + disjoncteur adapté",
              section: "6mm² (mono 32A) à 10mm² (tri)",
              usage: "Installation recommandée"
            },
            {
              mode: "Mode 4",
              description: "Charge rapide DC",
              puissance: "> 22kW DC",
              usage: "Stations publiques"
            }
          ]
        },
        {
          id: "installation-irve",
          titre: "Installation IRVE habitat",
          regles: [
            "Circuit dédié depuis le tableau",
            "DDR Type A minimum (Type F pour certaines bornes)",
            "Coupure d'urgence accessible",
            "Parafoudre recommandé si zone AQ2"
          ],
          dimensionnement: {
            mono7kW: "Section 6mm², disjoncteur 32A, DDR 40A",
            mono22kW: "Section 10mm², disjoncteur 40A, DDR 63A",
            tri22kW: "Section 6mm² 5G, disjoncteur 32A tri, DDR 40A"
          }
        }
      ]
    },
    {
      id: "communication",
      titre: "Réseau communication",
      icon: "📡",
      description: "Infrastructure de communication du logement",
      fiches: [
        {
          id: "grades",
          titre: "Grades de câblage",
          grades: [
            {
              grade: "Grade 2TV",
              description: "Minimum obligatoire en neuf",
              cable: "Câble F/UTP Cat6 + coaxial",
              services: "Téléphone, Internet 1Gbit/s, TV"
            },
            {
              grade: "Grade 3TV",
              description: "Recommandé pour préparer l'avenir",
              cable: "Câble F/FTP Cat6a + coaxial",
              services: "Téléphone, Internet 10Gbit/s, TV, multimédia"
            },
            {
              grade: "Grade 4",
              description: "Haute performance",
              cable: "Fibre optique",
              services: "Tous services très haut débit"
            }
          ]
        },
        {
          id: "coffret-communication",
          titre: "Coffret de communication",
          contenu: [
            "DTI (Dispositif de Terminaison Intérieure)",
            "Répartiteur RJ45",
            "Répartiteur TV (si distribution coaxiale)",
            "Switch Ethernet (optionnel)",
            "Box Internet (emplacement prévu)"
          ],
          regles: [
            "Minimum 2 prises RJ45 par pièce principale",
            "1 prise RJ45 à côté de chaque prise TV",
            "Toutes les prises RJ45 câblées en étoile vers coffret"
          ]
        }
      ]
    },
    {
      id: "parafoudre",
      titre: "Parafoudre",
      icon: "⛈️",
      description: "Protection contre les surtensions atmosphériques",
      fiches: [
        {
          id: "zones",
          titre: "Zones AQ (niveau kéraunique)",
          zones: [
            { zone: "AQ1", description: "Niveau faible < 25 jours d'orage/an", obligation: "Recommandé" },
            { zone: "AQ2", description: "Niveau élevé ≥ 25 jours d'orage/an", obligation: "Obligatoire" }
          ],
          casObligatoires: [
            "Bâtiment équipé de paratonnerre",
            "Alimentation par ligne aérienne en zone AQ2",
            "Équipements sensibles (informatique, domotique)"
          ]
        },
        {
          id: "types-parafoudre",
          titre: "Types de parafoudre",
          types: [
            { type: "Type 1", usage: "En tête d'installation avec paratonnerre", courant: "25-100kA" },
            { type: "Type 2", usage: "Protection standard tableau", courant: "20-40kA" },
            { type: "Type 3", usage: "Protection rapprochée (prises)", courant: "5-10kA" }
          ]
        }
      ]
    }
  ]
}

export default normes
