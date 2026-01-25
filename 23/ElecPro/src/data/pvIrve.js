// Données Photovoltaïque et IRVE (Bornes de recharge VE)

export const pvIrveData = {
  categories: [
    {
      id: "pv-bases",
      titre: "Bases du photovoltaïque",
      icon: "☀️",
      color: "yellow",
      description: "Principes, cellules, rendement"
    },
    {
      id: "pv-composants",
      titre: "Composants PV",
      icon: "🔌",
      color: "orange",
      description: "Onduleur, coffrets, parafoudre"
    },
    {
      id: "pv-installation",
      titre: "Installation PV",
      icon: "🔧",
      color: "amber",
      description: "Raccordement, protections, normes"
    },
    {
      id: "irve-modes",
      titre: "Modes de charge IRVE",
      icon: "🚗",
      color: "blue",
      description: "Mode 1 à 4, puissances"
    },
    {
      id: "irve-installation",
      titre: "Installation IRVE",
      icon: "⚡",
      color: "green",
      description: "Câblage, protections, normes"
    },
    {
      id: "irve-collectif",
      titre: "IRVE en collectif",
      icon: "🏢",
      color: "purple",
      description: "Copropriété, droit à la prise"
    }
  ],

  fiches: {
    "pv-bases": {
      titre: "Principes du Photovoltaïque",
      intro: "Le photovoltaïque transforme l'énergie lumineuse en électricité grâce à l'effet photoélectrique. C'est une source d'énergie renouvelable en plein essor.",
      principes: {
        titre: "Principe de fonctionnement",
        etapes: [
          "Les photons de lumière frappent les cellules photovoltaïques",
          "Les électrons sont libérés dans le matériau semi-conducteur (silicium)",
          "Un champ électrique interne dirige les électrons",
          "Un courant continu (DC) est produit",
          "L'onduleur convertit le DC en courant alternatif (AC 230V)"
        ]
      },
      typesCellules: [
        {
          type: "Monocristallin",
          description: "Cellules en silicium pur, couleur noire uniforme",
          rendement: "18-22%",
          avantages: ["Meilleur rendement", "Esthétique", "Longue durée de vie"],
          inconvenients: ["Plus cher", "Sensible à la chaleur"],
          couleur: "#1a1a2e"
        },
        {
          type: "Polycristallin",
          description: "Cellules en silicium fondu, aspect bleuté marbré",
          rendement: "15-18%",
          avantages: ["Moins cher", "Bon rapport qualité/prix"],
          inconvenients: ["Rendement inférieur", "Moins esthétique"],
          couleur: "#1e3a5f"
        },
        {
          type: "Couche mince (Thin Film)",
          description: "Fine couche de matériau semi-conducteur sur support",
          rendement: "10-13%",
          avantages: ["Flexible", "Léger", "Moins sensible à l'ombrage"],
          inconvenients: ["Faible rendement", "Nécessite plus de surface"],
          couleur: "#4a4a4a"
        }
      ],
      typesInstallations: [
        {
          type: "Autoconsommation totale",
          description: "Toute la production est consommée sur place",
          avantages: ["Pas de démarches de vente", "Maximum d'économies"],
          conditions: "Dimensionner selon la consommation de base"
        },
        {
          type: "Autoconsommation avec vente surplus",
          description: "Le surplus non consommé est vendu au réseau",
          avantages: ["Revenu complémentaire", "Pas de perte"],
          conditions: "Contrat avec EDF OA, compteur communicant"
        },
        {
          type: "Vente totale",
          description: "Toute la production est injectée et vendue",
          avantages: ["Tarif garanti", "Revenus prévisibles"],
          conditions: "Installation dédiée, compteur de production"
        }
      ],
      unites: [
        { unite: "Wc (Watt-crête)", description: "Puissance maximale dans conditions standard (1000W/m², 25°C)" },
        { unite: "kWh", description: "Énergie produite (puissance × temps)" },
        { unite: "kWc", description: "1000 Wc, unité courante pour installations résidentielles" }
      ],
      conseil: "En France, 1 kWc produit environ 900 à 1400 kWh/an selon la région et l'orientation."
    },

    "pv-composants": {
      titre: "Composants d'une Installation PV",
      intro: "Une installation photovoltaïque comprend plusieurs composants essentiels pour produire, convertir et sécuriser l'électricité.",
      composants: [
        {
          id: "panneaux",
          nom: "Panneaux photovoltaïques",
          description: "Convertissent la lumière en électricité DC",
          caracteristiques: [
            "Puissance typique : 300-450 Wc par panneau",
            "Tension : 30-40V DC par panneau",
            "Durée de vie : 25-30 ans garantis",
            "Surface : environ 1.7 m² par panneau"
          ],
          conseil: "Vérifier la garantie produit (10-12 ans) et la garantie de performance (25 ans à 80%)"
        },
        {
          id: "onduleur",
          nom: "Onduleur",
          description: "Convertit le courant continu (DC) en courant alternatif (AC 230V)",
          types: [
            { type: "Onduleur central", description: "Un seul onduleur pour tous les panneaux", avantage: "Coût réduit", inconvenient: "Sensible à l'ombrage partiel" },
            { type: "Micro-onduleurs", description: "Un onduleur par panneau", avantage: "Optimisation individuelle", inconvenient: "Coût plus élevé" },
            { type: "Onduleur string", description: "Un onduleur par chaîne de panneaux", avantage: "Bon compromis", inconvenient: "Configuration rigide" }
          ],
          conseil: "Durée de vie onduleur : 10-15 ans. Prévoir son remplacement."
        },
        {
          id: "coffret-dc",
          nom: "Coffret DC (côté panneaux)",
          description: "Protection et sectionnement côté courant continu",
          elements: [
            "Interrupteur-sectionneur DC",
            "Parafoudre DC Type 2",
            "Fusibles DC (si plusieurs strings)",
            "Connecteurs MC4"
          ],
          norme: "UTE C 15-712-1"
        },
        {
          id: "coffret-ac",
          nom: "Coffret AC (côté réseau)",
          description: "Protection et comptage côté courant alternatif",
          elements: [
            "Disjoncteur différentiel (selon schéma)",
            "Parafoudre AC Type 2",
            "Compteur de production (si vente)",
            "Interrupteur de coupure générale"
          ],
          norme: "NF C 15-100"
        },
        {
          id: "parafoudres",
          nom: "Parafoudres",
          description: "Protection contre les surtensions atmosphériques",
          types: [
            { cote: "DC", type: "Type 2 DC", emplacement: "Coffret DC, proche des panneaux" },
            { cote: "AC", type: "Type 2 AC", emplacement: "Tableau principal ou coffret AC" }
          ],
          obligatoire: "Obligatoires si bâtiment équipé de paratonnerre ou en zone à risque (AQ2)"
        },
        {
          id: "cables",
          nom: "Câbles solaires",
          description: "Câbles spécifiques pour courant continu PV",
          caracteristiques: [
            "Double isolation",
            "Résistance UV",
            "Température de service : -40°C à +90°C",
            "Section courante : 4 à 6 mm²"
          ],
          norme: "Câbles H1Z2Z2-K ou équivalent"
        }
      ]
    },

    "pv-installation": {
      titre: "Installation et Raccordement PV",
      intro: "L'installation photovoltaïque doit respecter des normes strictes pour la sécurité et le raccordement au réseau.",
      etapesInstallation: [
        { etape: 1, titre: "Étude de faisabilité", description: "Orientation, ombrage, surface disponible, consommation" },
        { etape: 2, titre: "Dimensionnement", description: "Calcul de puissance selon besoins et contraintes" },
        { etape: 3, titre: "Déclarations", description: "Mairie (DP ou PC), CONSUEL, gestionnaire réseau" },
        { etape: 4, titre: "Pose des panneaux", description: "Fixation sur toiture, respect étanchéité" },
        { etape: 5, titre: "Câblage DC", description: "Raccordement panneaux, coffret DC, onduleur" },
        { etape: 6, titre: "Câblage AC", description: "Onduleur vers coffret AC et tableau" },
        { etape: 7, titre: "Mise en service", description: "Tests, attestation CONSUEL, mise en service réseau" }
      ],
      schemasRaccordement: [
        {
          type: "Autoconsommation sans injection",
          description: "Production utilisée uniquement en interne",
          points: [
            "Pas de compteur de production nécessaire",
            "Protection par disjoncteur différentiel dédié",
            "Onduleur avec anti-îlotage obligatoire"
          ]
        },
        {
          type: "Autoconsommation avec injection",
          description: "Surplus injecté sur le réseau",
          points: [
            "Compteur Linky bidirectionnel",
            "Contrat avec EDF OA",
            "Attestation CONSUEL obligatoire"
          ]
        },
        {
          type: "Vente totale",
          description: "Compteur de production séparé",
          points: [
            "Deux compteurs distincts",
            "Tarif d'achat garanti 20 ans",
            "Installation indépendante"
          ]
        }
      ],
      protections: {
        titre: "Protections obligatoires",
        liste: [
          { element: "Côté DC", protection: "Interrupteur-sectionneur DC + fusibles si nécessaire" },
          { element: "Parafoudres DC", protection: "Type 2 obligatoire si paratonnerre ou zone AQ2" },
          { element: "Onduleur", protection: "Fonction anti-îlotage intégrée (arrêt si coupure réseau)" },
          { element: "Côté AC", protection: "Disjoncteur adapté à la puissance onduleur" },
          { element: "Parafoudres AC", protection: "Type 2 si paratonnerre ou zone AQ2" }
        ]
      },
      normes: [
        { norme: "UTE C 15-712-1", objet: "Installation PV raccordée au réseau" },
        { norme: "NF C 15-100", objet: "Installation électrique basse tension" },
        { norme: "NF C 14-100", objet: "Raccordement au réseau de distribution" },
        { norme: "Guide CONSUEL", objet: "Attestation de conformité" }
      ],
      conseilsTerrain: [
        "Vérifier l'orientation : idéal plein sud, 30-35° d'inclinaison",
        "Étudier les ombrages sur la journée et les saisons",
        "Prévoir l'accès pour maintenance (nettoyage, remplacement)",
        "Câbles DC : trajets les plus courts possibles",
        "Étanchéité toiture : respecter les règles de l'art"
      ]
    },

    "irve-modes": {
      titre: "Modes de Charge IRVE",
      intro: "L'Infrastructure de Recharge pour Véhicule Électrique (IRVE) se décline en 4 modes de charge, du plus simple au plus rapide.",
      modes: [
        {
          mode: "Mode 1",
          titre: "Prise domestique standard",
          description: "Charge sur prise domestique classique 2P+T",
          puissance: "2.3 kW max (10A)",
          temps: "20-30h pour une charge complète",
          protection: "Disjoncteur 16A + DDR 30mA",
          avantages: ["Pas d'installation", "Universel"],
          inconvenients: ["Très lent", "Risque d'échauffement", "Non recommandé"],
          conseil: "Usage occasionnel uniquement, câble fourni avec le véhicule"
        },
        {
          mode: "Mode 2",
          titre: "Prise renforcée avec boîtier",
          description: "Prise dédiée avec boîtier de contrôle (ICCB)",
          puissance: "3.7 kW (16A) à 7.4 kW (32A)",
          temps: "8-15h selon puissance",
          protection: "Circuit dédié + DDR Type A",
          avantages: ["Installation simple", "Sécurité améliorée"],
          inconvenients: ["Vitesse moyenne", "Nécessite prise dédiée"],
          conseil: "Solution de secours, prise Green'Up ou équivalent"
        },
        {
          mode: "Mode 3",
          titre: "Borne de recharge (Wallbox)",
          description: "Borne communicante avec protection intégrée",
          puissance: "7.4 kW (mono) à 22 kW (tri)",
          temps: "2-8h selon puissance et batterie",
          protection: "Circuit dédié + DDR Type A ou F",
          avantages: ["Rapide", "Sécurisé", "Programmable"],
          inconvenients: ["Coût installation", "Nécessite qualification IRVE"],
          conseil: "Solution recommandée pour usage quotidien"
        },
        {
          mode: "Mode 4",
          titre: "Charge rapide DC",
          description: "Borne à courant continu haute puissance",
          puissance: "50 kW à 350 kW",
          temps: "20-45 min pour 80%",
          protection: "Installation spécifique HTA/BT",
          avantages: ["Très rapide", "Stations-service"],
          inconvenients: ["Coût élevé", "Usage professionnel"],
          conseil: "Hors périmètre électricien résidentiel"
        }
      ],
      tableauComparatif: {
        titre: "Comparatif des modes",
        colonnes: ["Mode", "Puissance", "Temps 50kWh", "Installation"],
        lignes: [
          ["Mode 1", "2.3 kW", "~22h", "Existante"],
          ["Mode 2", "3.7-7.4 kW", "7-14h", "Prise renforcée"],
          ["Mode 3", "7-22 kW", "2-7h", "Borne Wallbox"],
          ["Mode 4", "50-350 kW", "15-60min", "Station DC"]
        ]
      }
    },

    "irve-installation": {
      titre: "Installation Borne de Recharge",
      intro: "L'installation d'une borne IRVE nécessite une qualification spécifique et le respect de normes précises.",
      prerequis: [
        "Qualification IRVE obligatoire pour toute installation > 3.7 kW",
        "Vérification de la puissance disponible (abonnement)",
        "Étude de l'installation existante",
        "Choix de l'emplacement (intérieur/extérieur)",
        "Longueur du câble d'alimentation"
      ],
      dimensionnement: {
        titre: "Dimensionnement du circuit",
        circuits: [
          { puissance: "3.7 kW (16A mono)", section: "2.5 mm²", protection: "Disj 20A", ddr: "Type A 30mA" },
          { puissance: "7.4 kW (32A mono)", section: "6 mm²", protection: "Disj 40A", ddr: "Type A 30mA" },
          { puissance: "11 kW (16A tri)", section: "2.5 mm²", protection: "Disj 20A 3P", ddr: "Type A 30mA" },
          { puissance: "22 kW (32A tri)", section: "6 mm²", protection: "Disj 40A 3P", ddr: "Type A 30mA" }
        ],
        note: "Sections indicatives pour longueur < 20m. Calculer la chute de tension pour grandes longueurs."
      },
      protections: {
        titre: "Protections spécifiques",
        elements: [
          {
            element: "DDR Type A",
            description: "Obligatoire minimum - détecte les courants à composante continue pulsée",
            conseil: "Certaines bornes intègrent la protection DC"
          },
          {
            element: "DDR Type B ou F",
            description: "Recommandé si la borne ne l'intègre pas - détecte les courants DC lisses",
            conseil: "Vérifier les spécifications de la borne"
          },
          {
            element: "Disjoncteur courbe C",
            description: "Adapté aux courants d'appel modérés",
            conseil: "Calibre selon la puissance de charge"
          },
          {
            element: "Parafoudre Type 2",
            description: "Recommandé pour installation extérieure ou en zone à risque",
            conseil: "Protection de la borne et du véhicule"
          }
        ]
      },
      etapesInstallation: [
        { etape: 1, description: "Diagnostic installation existante et faisabilité" },
        { etape: 2, description: "Choix et commande de la borne adaptée" },
        { etape: 3, description: "Tirage du câble depuis le tableau" },
        { etape: 4, description: "Installation du circuit dédié au tableau" },
        { etape: 5, description: "Fixation et raccordement de la borne" },
        { etape: 6, description: "Tests et mise en service" },
        { etape: 7, description: "Remise de l'attestation de conformité" }
      ],
      normes: [
        { norme: "NF C 15-100 § 14.3", objet: "Alimentation des véhicules électriques" },
        { norme: "IEC 61851", objet: "Système de charge pour VE" },
        { norme: "Décret IRVE 2017", objet: "Qualification obligatoire > 3.7 kW" }
      ],
      aides: [
        { aide: "ADVENIR", description: "Jusqu'à 960€ pour borne résidentielle individuelle" },
        { aide: "Crédit d'impôt", description: "75% du coût, plafond 300€ par point de charge" },
        { aide: "TVA réduite", description: "5.5% ou 10% selon conditions" }
      ]
    },

    "irve-collectif": {
      titre: "IRVE en Habitat Collectif",
      intro: "L'installation de bornes en copropriété obéit à des règles spécifiques : droit à la prise, infrastructure collective, ou déploiement sur parties communes.",
      droitPrise: {
        titre: "Droit à la prise",
        description: "Tout occupant peut demander l'installation d'une borne sur sa place de parking",
        etapes: [
          "Notification au syndic par lettre recommandée",
          "Le syndic a 3 mois pour s'opposer (motifs légitimes)",
          "Sans opposition, les travaux peuvent débuter",
          "Installation à la charge du demandeur"
        ],
        conditions: [
          "Place de stationnement couverte ou d'accès sécurisé",
          "Installation par professionnel qualifié IRVE",
          "Compteur individuel obligatoire"
        ]
      },
      typesInstallation: [
        {
          type: "Raccordement individuel",
          description: "Câble tiré depuis le compteur individuel",
          avantages: ["Facturation directe", "Indépendance"],
          inconvenients: ["Coût du câblage", "Complexité si distance importante"],
          conseil: "Solution adaptée si proximité avec le compteur"
        },
        {
          type: "Infrastructure collective",
          description: "Câblage commun avec compteurs divisionnaires",
          avantages: ["Mutualisation des coûts", "Évolutif"],
          inconvenients: ["Décision d'AG nécessaire", "Investissement initial"],
          conseil: "Solution d'avenir recommandée par la loi LOM"
        },
        {
          type: "Opérateur de services",
          description: "Installation et gestion par un opérateur tiers",
          avantages: ["Pas d'investissement", "Maintenance incluse"],
          inconvenients: ["Engagement contractuel", "Dépendance opérateur"],
          conseil: "Solution clé en main pour copropriétés"
        }
      ],
      loiLom: {
        titre: "Loi LOM - Obligations",
        description: "Loi d'Orientation des Mobilités (2019)",
        obligations: [
          "Pré-équipement obligatoire dans les parkings neufs (depuis 2017)",
          "Droit à la prise facilité (plus de vote en AG)",
          "Objectif 2025 : 100 000 bornes publiques",
          "Audit énergétique obligatoire pour les copropriétés > 50 lots"
        ]
      },
      conseilsPratiques: [
        "Anticiper : prévoir une infrastructure collective même si peu de demandes",
        "Puissance : vérifier la puissance disponible en parties communes",
        "Délestage : envisager un pilotage intelligent pour éviter le dépassement",
        "Communication : informer les copropriétaires des aides disponibles"
      ]
    }
  }
}

// Fonctions utilitaires
export function getCategoryById(categoryId) {
  return pvIrveData.categories.find(c => c.id === categoryId)
}

export function getFicheById(categoryId) {
  return pvIrveData.fiches[categoryId]
}

export default pvIrveData
