import { create } from 'zustand'
import { COUNCILORS, COUNCIL_COMPOSITION, COMMISSIONS, initializeCouncilors, getCouncilorOpinion } from '../data/councilors'
import { ACTION_ARGUMENTS, COUNCIL_THRESHOLD, getArgumentsForAction } from '../data/arguments'
import { getVilleById } from '../data/inseeData'

// ============================================
// CONFIGURATION DES ACTIONS - Inspiré du NFP
// ============================================

const ACTIONS = [
  // === URGENCE SOCIALE ===
  {
    id: 'salaire_agents',
    name: 'Revaloriser les agents',
    category: 'social',
    cost: 18,
    oneShot: true, // Une seule fois
    desc: 'Hausse des salaires des agents municipaux et contractuels.',
    realWorld: 'Les agents territoriaux (ATSEM, cantiniers, agents techniques) gagnent en moyenne 1 800EUR nets/mois. Une revalorisation de 5-10% coûte environ 500KEUR/an pour une ville de 10 000 habitants, mais réduit le turnover et améliore les services.',
    effects: { cohesion: 8 },
    hidden: { tension: -15 },
    jobs: { middle: 20 },
    unlocks: ['ccas'], // Débloque le renforcement CCAS
    delayed: [{ turns: 2, effect: { cohesion: 5 }, reason: 'Services publics de meilleure qualité' }]
  },
  {
    id: 'aide_loyer',
    name: 'Aide municipale loyer',
    category: 'social',
    cost: 14,
    repeatable: 2, // Peut être fait 2 fois max
    desc: 'Complément municipal aux aides au logement.',
    realWorld: 'Le Fonds de Solidarité Logement (FSL) aide les ménages en difficulté à payer loyer et charges. Paris verse 150-400EUR/mois. Le coût pour la commune : 200-500KEUR/an selon la taille.',
    effects: { cohesion: 8 },
    hidden: { tension: -12, housingCapacity: 50 },
    delayed: [{ turns: 2, effect: { cohesion: 4 }, reason: 'Moins d\'expulsions' }]
  },
  {
    id: 'cantine_gratuite',
    name: 'Cantine gratuite',
    category: 'social',
    cost: 14,
    oneShot: true,
    desc: 'Gratuité des cantines scolaires.',
    realWorld: 'À Rennes, Grenoble ou Montpellier, la cantine coûte 0-3EUR selon le quotient familial. La gratuité totale coûte environ 3EUR/repas/enfant soit 500EUR/an par élève. Réduit les inégalités nutritionnelles.',
    effects: { cohesion: 10 },
    hidden: { education: 10, health: 5 },
    population: { poorClass: 30 },
    unlocks: ['tarification_solidaire'] // Débloque la tarification solidaire
  },
  {
    id: 'sante_publique',
    name: 'Centres de santé',
    category: 'social',
    cost: 22,
    recurringCost: 5, // Coût de fonctionnement annuel
    repeatable: 3, // On peut en construire plusieurs
    desc: 'Centres de santé municipaux contre les déserts médicaux.',
    realWorld: 'Un centre de santé municipal emploie 5-10 soignants salariés. Coût: 500K-1MEUR/an mais pas de dépassements d\'honoraires. Exemple: les centres de santé de Paris ou du Blanc-Mesnil.',
    effects: { cohesion: 12 },
    hidden: { health: 25, tension: -8 },
    population: { growth: 40 }
  },
  {
    id: 'petite_enfance',
    name: 'Crèches publiques',
    category: 'social',
    cost: 20,
    recurringCost: 4, // Salaires du personnel
    repeatable: 2,
    desc: 'Service public de la petite enfance.',
    realWorld: 'Une place en crèche municipale coûte 12 000-15 000EUR/an à la collectivité (dont 50% CAF). Les familles paient 0,5 à 3EUR/h selon revenus. Les crèches permettent aux parents de travailler.',
    effects: { cohesion: 8 },
    hidden: { education: 8 },
    jobs: { middle: 40 },
    delayed: [{ turns: 4, populationShift: { poorToMiddle: 20 }, reason: 'Parents libérés pour travailler' }]
  },

  // === LOGEMENT ===
  {
    id: 'hlm',
    name: 'Construction HLM',
    category: 'logement',
    cost: 20,
    repeatable: 5, // On peut construire plusieurs fois
    desc: 'Relance massive du logement social.',
    realWorld: 'Construire 100 logements sociaux coûte 15-20 MEUR. La loi SRU impose 25% de logements sociaux. 70% des Français sont éligibles au HLM. Le loyer moyen est de 6EUR/m2 contre 15EUR dans le privé.',
    effects: { cohesion: 10, environnement: 2 },
    population: { poorClass: 100, middleClass: 40 },
    hidden: { housingCapacity: 200, tension: -15 },
    jobs: { poor: 50, middle: 30 },
    unlocks: ['renovation_thermique'] // Débloque la rénovation
  },
  {
    id: 'encadrement_loyers',
    name: 'Encadrer les loyers',
    category: 'logement',
    cost: 5,
    oneShot: true,
    excludes: ['attractivite_entreprises'], // Incompatible avec politique pro-business
    desc: 'Encadrement obligatoire dans les zones tendues.',
    realWorld: 'Paris, Lyon, Lille encadrent les loyers : un plafond selon le quartier et la taille. Réduit les loyers de 5-15% en moyenne. Les propriétaires peuvent demander un complément de 20% max.',
    effects: { cohesion: 12, economie: -3 },
    hidden: { tension: -20 },
    unlocks: ['requisition'], // Débloque la réquisition
    delayed: [{ turns: 3, populationEffect: { richLeave: 15 }, reason: 'Investisseurs mécontents' }]
  },
  {
    id: 'requisition',
    name: 'Réquisition logements',
    category: 'logement',
    cost: 8,
    oneShot: true,
    requires: ['encadrement_loyers'], // Nécessite l'encadrement d'abord
    desc: 'Réquisition des logements vides pour les sans-abris.',
    realWorld: 'La loi de 1945 permet aux préfets de réquisitionner les logements vides depuis plus de 2 ans. Peu utilisée : 200 réquisitions en 2023 à Paris. Concerne 1,1 million de logements vacants en France.',
    effects: { cohesion: 8, economie: -5 },
    hidden: { housingCapacity: 80, tension: -25 },
    population: { poorClass: 60 }
  },

  // === TRANSITION ECOLOGIQUE ===
  {
    id: 'renovation_thermique',
    name: 'Rénovation thermique',
    category: 'ecologie',
    cost: 28,
    repeatable: 2,
    desc: 'Isolation complète des logements.',
    realWorld: 'Isoler un logement coûte 15-30 KEUR. MaPrimeRénov finance jusqu\'à 90% pour les modestes. 5 millions de passoires thermiques en France. Une bonne isolation réduit la facture de 50-70%.',
    effects: { environnement: 12, energie: 8 },
    hidden: { pollution: -15, greenInvest: 20 },
    jobs: { poor: 40, middle: 30 },
    unlocks: ['energie_renouvelable'],
    delayed: [{ turns: 3, effect: { economie: 5 }, reason: 'Économies d\'énergie' }]
  },
  {
    id: 'energie_renouvelable',
    name: 'Énergies renouvelables',
    category: 'ecologie',
    cost: 30,
    oneShot: true,
    excludes: ['transition_moderee'], // Incompatible avec demi-mesures
    desc: 'Filières françaises d\'énergies renouvelables.',
    realWorld: 'Une régie publique d\'électricité permet des tarifs 10-20% moins chers (ex: Grenoble). Le solaire coûte 1000EUR/kWc installé. Retour sur investissement : 8-12 ans. Crée des emplois locaux non-délocalisables.',
    effects: { energie: 20, environnement: 10, economie: -5 },
    hidden: { greenInvest: 30, pollution: -20 },
    jobs: { middle: 50 },
    unlocks: ['stockage_energie'],
    delayed: [{ turns: 4, effect: { energie: 10, economie: 10 }, reason: 'Indépendance énergétique' }]
  },
  {
    id: 'solaire_toitures',
    name: 'Solaire sur toitures',
    category: 'ecologie',
    cost: 12,
    repeatable: 3,
    desc: 'Panneaux solaires sur les batiments municipaux.',
    realWorld: 'Installer des panneaux solaires sur les écoles, mairies et gymnases coûte 8-12K EUR par bâtiment mais produit de l\'électricité gratuite pendant 25 ans. Économies de 30-50% sur les factures.',
    effects: { energie: 8, environnement: 4 },
    hidden: { greenInvest: 10 },
    delayed: [{ turns: 2, effect: { economie: 3 }, reason: 'Économies sur les factures' }]
  },
  {
    id: 'reseau_chaleur',
    name: 'Reseau de chaleur',
    category: 'ecologie',
    cost: 18,
    oneShot: true,
    desc: 'Reseau de chaleur urbain pour chauffer les logements.',
    realWorld: 'Les reseaux de chaleur urbains utilisent la geothermie, biomasse ou recuperation de chaleur industrielle. 500 reseaux en France. Cout : 10-30M EUR mais -30% sur les factures de chauffage.',
    effects: { energie: 12, environnement: 6, cohesion: 4 },
    hidden: { greenInvest: 15, pollution: -10 },
    delayed: [{ turns: 3, effect: { energie: 5 }, reason: 'Economies de chauffage' }]
  },
  {
    id: 'stockage_energie',
    name: 'Stockage d\'energie',
    category: 'ecologie',
    cost: 15,
    oneShot: true,
    requires: ['energie_renouvelable'],
    desc: 'Batteries communales pour stocker l\'energie renouvelable.',
    realWorld: 'Les batteries communautaires permettent de stocker l\'energie solaire/eolienne. Cout : 500-1000 EUR/kWh. Permet l\'autoconsommation collective et la resilience face aux coupures.',
    effects: { energie: 10 },
    hidden: { greenInvest: 20 },
    delayed: [{ turns: 2, effect: { energie: 8 }, reason: 'Stockage operationnel' }]
  },
  {
    id: 'eau_publique',
    name: 'Eau 100% publique',
    category: 'ecologie',
    cost: 15,
    oneShot: true,
    excludes: ['privatisation_partielle'], // Incompatible avec privatisations
    desc: 'Gestion publique de l\'eau en regies locales.',
    realWorld: 'A Paris, le retour en regie (2010) a fait baisser le prix de l\'eau de 8%. Les premiers m3 peuvent etre gratuits (Montpellier). Le prive verse 5-10% de dividendes preleves sur les usagers.',
    effects: { cohesion: 8, environnement: 5 },
    hidden: { health: 10, tension: -5 }
  },
  {
    id: 'biodiversite',
    name: 'Protection biodiversite',
    category: 'ecologie',
    cost: 12,
    repeatable: 3,
    desc: 'Zones naturelles protegees, forets.',
    realWorld: 'Creer un parc urbain coute 500-2000EUR/m2. Les espaces verts reduisent les ilots de chaleur de 2-8 degres. Ils augmentent aussi la valeur immobiliere des alentours de 10-20%.',
    effects: { environnement: 15, cohesion: 3 },
    hidden: { pollution: -12, health: 5 }
  },

  // === TRANSPORTS ===
  {
    id: 'transports_gratuits',
    name: 'Transports gratuits',
    category: 'transports',
    cost: 25,
    recurringCost: 8, // Manque a gagner billetterie
    oneShot: true,
    excludes: ['parking_centre'], // Incompatible avec politique pro-voiture
    desc: 'Gratuite ciblee (jeunes, precaires).',
    realWorld: 'Dunkerque, Montpellier, Aubagne ont rendu leurs transports gratuits. Cout: 10-50 MEUR/an selon la ville. La frequentation augmente de 50-100%. Finance par le versement mobilite des entreprises.',
    effects: { cohesion: 12, environnement: 8, energie: -8 },
    hidden: { mobility: 25, pollution: -15 },
    unlocks: ['plan_rail']
  },
  {
    id: 'plan_rail',
    name: 'Plan rail & fret',
    category: 'transports',
    cost: 30,
    oneShot: true,
    desc: 'Reouverture des petites lignes, fret ferroviaire.',
    realWorld: '4 000 km de petites lignes fermees depuis 2000. Rouvrir une ligne coute 500KEUR-2MEUR/km. Le train emet 50x moins de CO2 que l\'avion. Le fret ferroviaire ne represente que 9% du transport en France.',
    effects: { environnement: 10, economie: 5 },
    hidden: { mobility: 20, pollution: -20 },
    jobs: { middle: 40 },
    delayed: [{ turns: 5, effect: { economie: 12 }, reason: 'Desenclavement territorial' }]
  },
  {
    id: 'velo',
    name: 'Plan velo',
    category: 'transports',
    cost: 10,
    repeatable: 2,
    desc: 'Pistes cyclables, velos en libre-service.',
    realWorld: 'Une piste cyclable securisee coute 200-500 KEUR/km. Amsterdam compte 400 km de pistes. Chaque EUR investi dans le velo rapporte 5-8 EUR en sante et productivite. 60% des trajets font moins de 5 km.',
    effects: { environnement: 6, cohesion: 4 },
    hidden: { health: 8, pollution: -8, mobility: 10 }
  },

  // === FISCALITE LOCALE PROGRESSIVE ===
  {
    id: 'taxe_fonciere_progressive',
    name: 'Taxe fonciere modulee',
    category: 'fiscalite_gauche',
    cost: 0,
    desc: 'Majoration pour residences secondaires et logements vides.',
    realWorld: 'Surtaxe residences secondaires (competence municipale)',
    effects: { cohesion: 8 },
    hidden: { tension: -10, housingCapacity: 30 },
    budgetGain: 18,
    delayed: [{ turns: 3, effect: { cohesion: 5 }, reason: 'Plus de logements disponibles' }]
  },
  {
    id: 'taxe_logements_vacants',
    name: 'Taxe logements vides',
    category: 'fiscalite_gauche',
    cost: 0,
    desc: 'Forte taxation des logements laisses vacants.',
    realWorld: 'Taxe sur les logements vacants (TLV municipale)',
    effects: { cohesion: 6 },
    hidden: { tension: -8, housingCapacity: 50 },
    budgetGain: 12
  },
  {
    id: 'tarification_solidaire',
    name: 'Tarification solidaire',
    category: 'fiscalite_gauche',
    cost: 8,
    desc: 'Tarifs des services municipaux selon les revenus.',
    realWorld: 'Quotient familial pour cantine, periscolaire, sport',
    effects: { cohesion: 12 },
    hidden: { tension: -15, education: 5 },
    delayed: [{ turns: 2, effect: { cohesion: 6 }, reason: 'Acces aux services pour tous' }]
  },

  // === SERVICES PUBLICS MUNICIPAUX ===
  {
    id: 'periscolaire',
    name: 'Periscolaire renforce',
    category: 'services',
    cost: 18,
    recurringCost: 4, // Animateurs et locaux
    desc: 'Activites educatives, aide aux devoirs, sport.',
    realWorld: 'Accueil periscolaire de qualite (competence municipale)',
    effects: { cohesion: 10 },
    hidden: { education: 20, tension: -10 },
    jobs: { middle: 40 },
    delayed: [
      { turns: 4, effect: { cohesion: 8 }, reason: 'Reussite scolaire amelioree' },
      { turns: 5, populationShift: { poorToMiddle: 30 }, reason: 'Mobilite sociale' }
    ]
  },
  {
    id: 'ccas',
    name: 'Renforcer le CCAS',
    category: 'services',
    cost: 20,
    recurringCost: 5, // Personnel et aides versees
    desc: 'Centre communal d\'action sociale : aides, accompagnement.',
    realWorld: 'CCAS renforce (aide alimentaire, urgence sociale)',
    effects: { cohesion: 12 },
    hidden: { health: 15, tension: -15 },
    jobs: { middle: 35 },
    delayed: [{ turns: 2, effect: { cohesion: 6 }, reason: 'Filet de securite social' }]
  },
  {
    id: 'emplois_aides',
    name: 'Emplois aides',
    category: 'services',
    cost: 15,
    desc: 'Emplois aides pour associations.',
    realWorld: 'Relancer la creation d\'emplois aides pour associations',
    effects: { cohesion: 8 },
    hidden: { culture: 15, tension: -12 },
    jobs: { poor: 60 }
  },

  // === CULTURE ===
  {
    id: 'culture_1pct',
    name: 'Culture a 1% du PIB',
    category: 'culture',
    cost: 18,
    desc: 'Budget culture renforce.',
    realWorld: 'Porter le budget culture a 1% du PIB',
    effects: { cohesion: 10, economie: 3 },
    hidden: { culture: 25, tourism: 15, tension: -8 }
  },
  {
    id: 'musees_gratuits',
    name: 'Musees gratuits',
    category: 'culture',
    cost: 8,
    desc: 'Gratuite dans les musees nationaux.',
    realWorld: 'Etendre la gratuite dans tous les musees nationaux',
    effects: { cohesion: 6 },
    hidden: { culture: 15, education: 5 }
  },

  // =============================================
  // === POLITIQUES DE DROITE (LR / liberale) ===
  // =============================================

  {
    id: 'videosurveillance',
    name: 'Videosurveillance',
    category: 'securite',
    cost: 15,
    repeatable: 2,
    desc: 'Deploiement massif de cameras dans l\'espace public.',
    realWorld: 'Nice compte 4 000 cameras pour 340 000 habitants. Une camera coute 15-30 KEUR installee. Les etudes montrent un effet limite sur la delinquance (-5%) mais un deplacement vers les zones non surveillees.',
    effects: { cohesion: 3 },
    hidden: { security: 15, tension: -5, liberty: -10 },
    unlocks: ['smart_city'], // Debloque la smart city
    delayed: [{ turns: 3, effect: { cohesion: -3 }, reason: 'Sentiment de surveillance' }]
  },
  {
    id: 'police_municipale',
    name: 'Police municipale +',
    category: 'securite',
    cost: 18,
    recurringCost: 4, // Salaires et equipements
    repeatable: 2,
    desc: 'Augmentation des effectifs et armement.',
    realWorld: 'Un policier municipal coute 50-70 KEUR/an charges comprises. Armer la police municipale (decide par le maire) est autorise depuis 1999. 60% des PM sont armees en 2023. N\'ont pas les memes pouvoirs que la police nationale.',
    effects: { cohesion: 5 },
    hidden: { security: 20, tension: -8 },
    jobs: { middle: 25 },
    unlocks: ['couvre_feu_mineurs'] // Ouvre la voie aux mesures d'ordre
  },
  {
    id: 'gel_impots',
    name: 'Gel des impots',
    category: 'fiscalite_droite',
    cost: 0,
    oneShot: true,
    excludes: ['taxe_fonciere_progressive', 'taxe_logements_vacants', 'tarification_solidaire'], // Incompatible avec fiscalite progressive
    desc: 'Aucune hausse de fiscalite locale.',
    realWorld: 'Charte RN : s\'opposer a toute hausse de fiscalite',
    effects: { economie: 5 },
    hidden: { infrastructureDebt: 15 },
    budgetGain: -10,
    delayed: [{ turns: 4, effect: { cohesion: -5 }, reason: 'Services publics degrades' }]
  },
  {
    id: 'attractivite_entreprises',
    name: 'Attractivite entreprises',
    category: 'attractivite',
    cost: 20,
    oneShot: true,
    excludes: ['encadrement_loyers'], // Incompatible avec encadrement loyers
    desc: 'Exonerations et facilites pour attirer les entreprises.',
    realWorld: 'Zones franches, exonerations fiscales locales',
    effects: { economie: 12 },
    hidden: { innovation: 10 },
    jobs: { middle: 40, rich: 15 },
    population: { richClass: 30 },
    unlocks: ['incubateur'],
    delayed: [{ turns: 3, effect: { environnement: -5 }, reason: 'Pression immobiliere' }]
  },
  {
    id: 'privatisation_partielle',
    name: 'Delegation de service',
    category: 'gestion',
    cost: 0,
    oneShot: true,
    excludes: ['eau_publique', 'ccas'], // Incompatible avec services publics
    desc: 'Confier certains services au prive.',
    realWorld: 'Delegation de service public (eau, dechets, parking)',
    effects: { economie: 8 },
    hidden: { tension: 10 },
    budgetGain: 20,
    delayed: [
      { turns: 2, effect: { cohesion: -8 }, reason: 'Hausse des tarifs' },
      { turns: 4, effect: { economie: -5 }, reason: 'Profits extraits du territoire' }
    ]
  },
  {
    id: 'reduction_effectifs',
    name: 'Optimisation RH',
    category: 'gestion',
    cost: 0,
    oneShot: true,
    excludes: ['salaire_agents', 'emplois_aides'], // Incompatible avec politique sociale
    desc: 'Reduction des effectifs municipaux.',
    realWorld: 'Non-remplacement des departs, mutualisation',
    effects: {},
    hidden: { tension: 12 },
    budgetGain: 25,
    delayed: [{ turns: 2, effect: { cohesion: -10 }, reason: 'Services degrades' }]
  },
  {
    id: 'parking_centre',
    name: 'Parkings centre-ville',
    category: 'attractivite',
    cost: 22,
    oneShot: true,
    excludes: ['transports_gratuits', 'velo'], // Incompatible avec mobilite douce
    desc: 'Construction de parkings pour les commercants.',
    realWorld: 'Politique pro-voiture des centres-villes',
    effects: { economie: 8 },
    hidden: { pollution: 15, mobility: 5 },
    population: { richClass: 20 }
  },

  // =============================================
  // === POLITIQUES D'EXTREME DROITE (RN) ===
  // =============================================

  {
    id: 'localisme_cantines',
    name: 'Cantines locales',
    category: 'localisme',
    cost: 12,
    oneShot: true,
    desc: 'Approvisionnement 100% local pour les cantines.',
    realWorld: 'Charte RN : favoriser le localisme dans les cantines',
    effects: { cohesion: 6, environnement: 3 },
    hidden: { health: 5 }
  },
  {
    id: 'patrimoine_local',
    name: 'Patrimoine local',
    category: 'identite',
    cost: 15,
    repeatable: 2,
    desc: 'Restauration du patrimoine historique local.',
    realWorld: 'Charte RN : proteger et valoriser le patrimoine',
    effects: { cohesion: 8, economie: 3 },
    hidden: { culture: 10, tourism: 15 }
  },
  {
    id: 'anti_intercommunalite',
    name: 'Souverainete communale',
    category: 'identite',
    cost: 5,
    oneShot: true,
    excludes: ['plan_rail'], // Incompatible avec projets intercommunaux
    desc: 'Refus des transferts de competences.',
    realWorld: 'Charte RN : s\'opposer aux transferts aux intercos',
    effects: { cohesion: 4 },
    hidden: { tension: 5, infrastructureDebt: 10 },
    delayed: [{ turns: 3, effect: { economie: -5 }, reason: 'Perte de mutualisations' }]
  },
  {
    id: 'couvre_feu_mineurs',
    name: 'Couvre-feu mineurs',
    category: 'ordre',
    cost: 8,
    oneShot: true,
    requires: ['police_municipale'], // Necessite police renforcee
    excludes: ['periscolaire'], // Incompatible avec politique jeunesse
    desc: 'Interdiction de sortie nocturne pour les mineurs.',
    realWorld: 'Beziers, Perpignan ont instaure des couvre-feux pour mineurs (22h-6h en ete). Legalite contestee par les tribunaux. Effet sur la delinquance non demontre. Cree des tensions avec les familles.',
    effects: { cohesion: -5 },
    hidden: { security: 10, tension: -5, liberty: -15 },
    unlocks: ['mendicite_interdite'],
    delayed: [{ turns: 2, effect: { cohesion: -5 }, reason: 'Tensions familiales' }]
  },
  {
    id: 'mendicite_interdite',
    name: 'Anti-mendicite',
    category: 'ordre',
    cost: 5,
    oneShot: true,
    excludes: ['ccas', 'aide_loyer'], // Incompatible avec politique sociale
    desc: 'Arretes anti-mendicite dans le centre.',
    realWorld: 'Les arretes anti-mendicite sont souvent annules par les tribunaux (liberte d\'aller et venir). Ils deplacent le probleme sans le resoudre. 300 000 personnes sans domicile en France.',
    effects: { economie: 3 },
    hidden: { tension: 15, liberty: -20 },
    populationEffect: { poorLeave: 30 }
  },
  {
    id: 'creche_traditionnelle',
    name: 'Creche de Noel',
    category: 'identite',
    cost: 2,
    oneShot: true,
    desc: 'Installation d\'une creche dans les batiments publics.',
    realWorld: 'Debat recurrent sur la laicite (mairies RN)',
    effects: { cohesion: 3 },
    hidden: { tension: 8, culture: -5 }
  },
  {
    id: 'subventions_selectionnees',
    name: 'Subventions ciblees',
    category: 'identite',
    cost: 0,
    oneShot: true,
    excludes: ['culture_1pct', 'emplois_aides'], // Incompatible avec soutien asso
    desc: 'Suppression de subventions a certaines associations.',
    realWorld: 'Coupe des subventions aux assos jugees "militantes"',
    effects: {},
    hidden: { tension: 20, culture: -15 },
    budgetGain: 10,
    delayed: [{ turns: 2, effect: { cohesion: -8 }, reason: 'Tissu associatif affaibli' }]
  },

  // =============================================
  // === POLITIQUES CENTRISTES ===
  // =============================================

  {
    id: 'ppp_equipement',
    name: 'Partenariat public-prive',
    category: 'gestion',
    cost: 10,
    repeatable: 2,
    excludes: ['hlm'], // Moins de logements publics si PPP
    desc: 'Construction d\'equipements via PPP.',
    realWorld: 'Partenariats public-prive pour equipements',
    effects: { economie: 5 },
    hidden: { debt: 20 },
    jobs: { middle: 20 },
    delayed: [{ turns: 5, effect: { economie: -8 }, reason: 'Loyers PPP eleves' }]
  },
  {
    id: 'smart_city',
    name: 'Ville intelligente',
    category: 'attractivite',
    cost: 25,
    oneShot: true,
    requires: ['videosurveillance'], // Necessite infrastructure surveillance
    desc: 'Capteurs, applis, donnees pour gerer la ville.',
    realWorld: 'Smart city, open data, e-administration',
    effects: { economie: 8 },
    hidden: { innovation: 20, liberty: -5 },
    population: { middleClass: 30, richClass: 20 }
  },
  {
    id: 'incubateur',
    name: 'Incubateur startups',
    category: 'attractivite',
    cost: 18,
    oneShot: true,
    desc: 'Espace et accompagnement pour entrepreneurs.',
    realWorld: 'French Tech, incubateurs municipaux',
    effects: { economie: 10 },
    hidden: { innovation: 25 },
    jobs: { middle: 30 },
    population: { middleClass: 25 }
  },
  {
    id: 'transition_moderee',
    name: 'Transition pragmatique',
    category: 'ecologie',
    cost: 15,
    oneShot: true,
    excludes: ['energie_renouvelable', 'biodiversite'], // Incompatible avec vraie transition
    desc: 'Mesures ecologiques sans contrainte forte.',
    realWorld: 'Ecologie incitative, pas punitive',
    effects: { environnement: 5, economie: 2 },
    hidden: { greenInvest: 8, pollution: -5 }
  },
  {
    id: 'mobilite_douce_optionnelle',
    name: 'Mobilites alternatives',
    category: 'transports',
    cost: 12,
    oneShot: true,
    desc: 'Encourager sans contraindre (trottinettes, velos).',
    realWorld: 'Pistes cyclables + maintien acces voiture',
    effects: { environnement: 4, cohesion: 3 },
    hidden: { mobility: 15, pollution: -8 }
  },

  // === ATTENDRE ===
  {
    id: 'nothing',
    name: 'Ne rien faire',
    category: 'autre',
    cost: 0,
    desc: 'Le statu quo a aussi un cout.',
    realWorld: 'Inaction politique',
    effects: {},
    hidden: { tension: 8, infrastructureDebt: 10 }
  }
]

// Categories avec couleurs par orientation
const CATEGORIES = {
  // Gauche (NFP)
  social: { name: 'Urgence sociale', color: '#E63946', icon: '✊', orientation: 'gauche' },
  logement: { name: 'Droit au logement', color: '#E63946', icon: '🏠', orientation: 'gauche' },
  ecologie: { name: 'Transition ecologique', color: '#2D6A4F', icon: '🌿', orientation: 'gauche' },
  transports: { name: 'Transports publics', color: '#2D6A4F', icon: '🚃', orientation: 'gauche' },
  fiscalite_gauche: { name: 'Justice fiscale', color: '#9B5DE5', icon: '⚖️', orientation: 'gauche' },
  services: { name: 'Services publics', color: '#F4A261', icon: '🏛️', orientation: 'gauche' },
  culture: { name: 'Culture pour tous', color: '#F4A261', icon: '🎭', orientation: 'gauche' },
  // Droite
  securite: { name: 'Securite', color: '#1E3A5F', icon: '🛡️', orientation: 'droite' },
  attractivite: { name: 'Attractivite', color: '#1E3A5F', icon: '💼', orientation: 'droite' },
  fiscalite_droite: { name: 'Fiscalite allegee', color: '#2C5282', icon: '📉', orientation: 'droite' },
  gestion: { name: 'Bonne gestion', color: '#2C5282', icon: '📊', orientation: 'droite' },
  // Extreme droite
  identite: { name: 'Identite locale', color: '#4A2C2A', icon: '🏛️', orientation: 'extreme_droite' },
  ordre: { name: 'Ordre public', color: '#5D3A3A', icon: '⚔️', orientation: 'extreme_droite' },
  localisme: { name: 'Localisme', color: '#4A2C2A', icon: '🌾', orientation: 'extreme_droite' },
  // Autre
  autre: { name: 'Autre', color: '#6c757d', icon: '⏸️', orientation: 'neutre' }
}

// Orientations politiques pour le recap
const ORIENTATIONS = {
  gauche: { name: 'Gauche / NFP', color: '#E63946', desc: 'Politiques sociales et ecologiques' },
  droite: { name: 'Droite / LR', color: '#1E3A5F', desc: 'Securite et attractivite economique' },
  extreme_droite: { name: 'Extreme droite / RN', color: '#4A2C2A', desc: 'Identite et ordre' },
  centre: { name: 'Centre', color: '#F0A500', desc: 'Pragmatisme et equilibre' },
  neutre: { name: 'Neutre', color: '#6c757d', desc: 'Sans orientation marquee' }
}

// ============================================
// CONFIGURATION DES SAISONS
// ============================================

const SEASONS = {
  spring: {
    name: 'Printemps',
    icon: '🌸',
    effects: { environnement: 3, cohesion: 2 },
    modifiers: { energyDemand: 0.9, pollutionDecay: 1.2 },
    events: ['flooding', 'festival']
  },
  summer: {
    name: 'Ete',
    icon: '☀️',
    effects: { economie: 4, energie: -5 },
    modifiers: { energyDemand: 1.3, tourism: 1.5 },
    events: ['heatwave', 'tourism_boom']
  },
  autumn: {
    name: 'Automne',
    icon: '🍂',
    effects: { cohesion: -2 },
    modifiers: { energyDemand: 1.0, pollutionDecay: 0.8 },
    events: ['harvest', 'rentree_sociale']
  },
  winter: {
    name: 'Hiver',
    icon: '❄️',
    effects: { energie: -5, cohesion: -2 },
    modifiers: { energyDemand: 1.3, health: 0.8 },
    events: ['cold_snap', 'solidarity']
  }
}

// ============================================
// CONFIGURATION DES EVENEMENTS
// ============================================

const EVENTS = {
  // === CRISES SOCIALES ===
  greve_generale: {
    icon: '✊',
    title: 'Mouvement social',
    desc: 'Les inegalites provoquent une mobilisation massive. La population demande des changements.',
    effects: { economie: -8 },
    type: 'crisis',
    choices: [
      { label: 'Negocier et ceder', effects: { cohesion: 12, economie: -5 }, hidden: { tension: -25 } },
      { label: 'Ignorer', effects: { cohesion: -15 }, hidden: { tension: 30 } }
    ]
  },
  crise_logement: {
    icon: '🏚️',
    title: 'Crise du logement',
    desc: 'Les loyers explosent. Des familles se retrouvent a la rue.',
    effects: { cohesion: -12 },
    hidden: { tension: 20 },
    type: 'crisis',
    choices: [
      { label: 'Requisitionner des logements', effects: { cohesion: 10 }, hidden: { housingCapacity: 100, tension: -15 }, cost: 15 },
      { label: 'Construire en urgence', effects: { cohesion: 5 }, hidden: { housingCapacity: 50 }, cost: 25 }
    ]
  },
  deserts_medicaux: {
    icon: '🏥',
    title: 'Deserts medicaux',
    desc: 'Des territoires entiers n\'ont plus acces aux soins.',
    effects: { cohesion: -10 },
    type: 'crisis',
    choices: [
      { label: 'Centres de sante publics', effects: { cohesion: 8 }, hidden: { health: 20 }, cost: 20 },
      { label: 'Incitations privees', effects: { economie: -5 }, hidden: { health: 10 }, cost: 15 }
    ]
  },
  pollution_crisis: {
    icon: '☠️',
    title: 'Pic de pollution',
    desc: 'La qualite de l\'air atteint des niveaux critiques.',
    effects: { cohesion: -10 },
    populationEffect: { deaths: 80 },
    type: 'crisis',
    choices: [
      { label: 'Circulation alternee', effects: { environnement: 5 }, hidden: { pollution: -15, mobility: -10 } },
      { label: 'Fermer les usines', effects: { environnement: 10, economie: -15 }, hidden: { pollution: -25 } }
    ]
  },

  // === CATASTROPHES ===
  heatwave: {
    icon: '🌡️',
    title: 'Canicule',
    desc: 'Vague de chaleur extreme. Les personnes agees sont en danger.',
    effects: { energie: -15, cohesion: -5 },
    populationEffect: { deaths: 60 },
    type: 'disaster',
    seasonal: 'summer'
  },
  flooding: {
    icon: '🌊',
    title: 'Inondations',
    desc: 'Des pluies torrentielles submergent plusieurs quartiers.',
    effects: { economie: -10, environnement: -5 },
    type: 'disaster',
    seasonal: 'spring'
  },
  cold_snap: {
    icon: '🥶',
    title: 'Vague de froid',
    desc: 'Temperatures glaciales. Les sans-abris sont en danger.',
    effects: { energie: -20, cohesion: -8 },
    populationEffect: { deaths: 40 },
    type: 'disaster',
    seasonal: 'winter',
    condition: (state) => state.hidden.housingCapacity < state.population.total
  },

  // === OPPORTUNITES ===
  transition_reussie: {
    icon: '🌱',
    title: 'Transition ecologique',
    desc: 'Vos investissements verts portent leurs fruits. La ville devient un modele.',
    effects: { economie: 15, environnement: 10 },
    population: { middleClass: 80, richClass: 20 },
    type: 'opportunity'
  },
  festival: {
    icon: '🎉',
    title: 'Fete populaire',
    desc: 'Un evenement festif rassemble les habitants.',
    effects: { cohesion: 15 },
    hidden: { tension: -20, culture: 10 },
    type: 'opportunity',
    seasonal: 'spring'
  },
  solidarity: {
    icon: '🤝',
    title: 'Elan de solidarite',
    desc: 'Face au froid, les habitants s\'entraident.',
    effects: { cohesion: 10 },
    hidden: { tension: -15 },
    type: 'opportunity',
    seasonal: 'winter'
  },
  tourism_boom: {
    icon: '🎭',
    title: 'Afflux touristique',
    desc: 'La reputation culturelle attire les visiteurs.',
    effects: { economie: 12, cohesion: 3 },
    type: 'opportunity',
    seasonal: 'summer',
    condition: (state) => state.hidden.culture > 30
  },
  rentree_sociale: {
    icon: '📚',
    title: 'Rentree solidaire',
    desc: 'Les mesures de gratuite scolaire sont saluees.',
    effects: { cohesion: 8 },
    hidden: { education: 10 },
    type: 'opportunity',
    seasonal: 'autumn',
    condition: (state) => state.hidden.education > 40
  },

  // === DILEMMES ===
  multinationale: {
    icon: '🏭',
    title: 'Proposition industrielle',
    desc: 'Une multinationale veut s\'installer. Emplois promis, mais conditions floues...',
    type: 'dilemma',
    choices: [
      {
        label: 'Accepter avec conditions',
        effects: { economie: 10 },
        hidden: { pollution: 15 },
        jobs: { poor: 60, middle: 20 }
      },
      {
        label: 'Refuser',
        effects: { environnement: 5 },
        hidden: { tension: 5 }
      },
      {
        label: 'Negocier des garanties strictes',
        effects: { economie: 5 },
        hidden: { pollution: 5 },
        jobs: { middle: 30 },
        cost: 10
      }
    ]
  },
  gentrification: {
    icon: '🏗️',
    title: 'Projet immobilier',
    desc: 'Des promoteurs veulent "revaloriser" un quartier populaire.',
    type: 'dilemma',
    choices: [
      {
        label: 'Autoriser',
        effects: { economie: 12 },
        population: { richClass: 40 },
        populationEffect: { poorLeave: 100 },
        hidden: { tension: 20 }
      },
      {
        label: 'Bloquer',
        effects: { cohesion: 10 },
        hidden: { tension: -10 }
      },
      {
        label: 'Imposer 50% de logements sociaux',
        effects: { cohesion: 8, economie: 3 },
        population: { middleClass: 30, poorClass: 30 },
        cost: 12
      }
    ]
  },
  austerite_imposee: {
    icon: '✂️',
    title: 'Pressions budgetaires',
    desc: 'On vous demande de reduire les depenses. Ou couper ?',
    type: 'dilemma',
    choices: [
      {
        label: 'Services sociaux',
        effects: { cohesion: -15 },
        hidden: { health: -15, education: -10, tension: 20 },
        budgetGain: 35
      },
      {
        label: 'Culture et sport',
        effects: { cohesion: -8 },
        hidden: { culture: -20 },
        budgetGain: 20
      },
      {
        label: 'Refuser l\'austerite',
        effects: { cohesion: 5 },
        hidden: { debt: 30 }
      }
    ]
  }
}

// ============================================
// NARRATIFS
// ============================================

const NARRATIVES = {
  crisis: [
    "La ville souffre. Le temps des choix difficiles est venu.",
    "Les habitants expriment leur colere. Il faut agir.",
    "La situation se degrade. Chaque decision compte."
  ],
  declining: [
    "Des tensions apparaissent sous la surface.",
    "La ville tient, mais pour combien de temps ?",
    "Les inegalites se creusent silencieusement."
  ],
  stable: [
    "Un equilibre fragile s'est installe.",
    "La vie continue, ni pire ni meilleure.",
    "Le calme avant... quoi exactement ?"
  ],
  thriving: [
    "Les indicateurs sont encourageants.",
    "L'optimisme gagne du terrain.",
    "Les investissements portent leurs fruits."
  ],
  progressive: [
    "Les politiques sociales transforment la ville.",
    "La transition est en marche.",
    "Un autre modele est possible, et il fonctionne."
  ]
}

const HINTS = {
  pollution: "L'air devient irrespirable dans certains quartiers...",
  tension: "Des affiches contestataires fleurissent sur les murs.",
  energy: "Les coupures d'electricite se multiplient.",
  housing: "Des tentes apparaissent sous les ponts.",
  health: "Les files d'attente s'allongent aux urgences.",
  education: "Les classes sont surchargees.",
  inequality: "Le contraste entre quartiers devient saisissant.",
  green: "Les panneaux solaires brillent sur les toits.",
  culture: "La ville bouillonne de creativite.",
  progress: "Les services publics se renforcent.",
  default: "Les habitants vaquent a leurs occupations."
}

// ============================================
// HELPERS
// ============================================

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const getSeasonIndex = (turn) => Math.floor((turn - 1) / 5) % 4
const getSeasonKey = (turn) => ['spring', 'summer', 'autumn', 'winter'][getSeasonIndex(turn)]

// ============================================
// ETAT INITIAL
// ============================================

const initialState = {
  turn: 1,
  maxTurns: 24,
  gameOver: false,

  economie: 45,
  environnement: 40,
  cohesion: 45,
  energie: 40,
  budget: 80,

  population: {
    poor: 500,
    middle: 400,
    rich: 100,
    get total() { return this.poor + this.middle + this.rich }
  },

  hidden: {
    pollution: 20,
    tension: 25,
    greenInvest: 0,
    housingCapacity: 900,
    health: 40,
    education: 35,
    culture: 20,
    mobility: 20,
    tourism: 10,
    debt: 0,
    infrastructureDebt: 10,
    innovation: 10,
    security: 30,
    liberty: 60
  },

  season: 'spring',
  seasonTurn: 1,
  delayedEffects: [],
  currentEvent: null,

  narrative: {
    main: "Une ville en difficulte. Les services publics sont degrades, les inegalites se creusent. A vous de changer les choses.",
    hint: "Les habitants attendent des decisions fortes.",
    hintType: 'default'
  },

  // Deltas pour feedback visuel
  indicatorDeltas: {
    economie: 0,
    environnement: 0,
    cohesion: 0,
    energie: 0
  },
  lastActionName: null,

  history: [],

  // Tracking des orientations politiques pour le recap
  actionHistory: [], // { turn, actionId, name, category, orientation, effects }
  indicatorHistory: [], // { turn, economie, environnement, cohesion, energie, population }
  orientationScore: { gauche: 0, droite: 0, extreme_droite: 0, centre: 0, neutre: 0 },

  // Systeme d'embranchements
  usedActions: {}, // { actionId: nombreDeFoisUtilise }
  unlockedActions: [], // actions debloquees par d'autres actions
  excludedActions: [], // actions devenues indisponibles

  // Gestion budgetaire
  recurringCosts: 0, // Couts de fonctionnement cumules

  cityElements: {
    buildings: [],
    factories: [],
    parks: [],
    solarPanels: [],
    trees: [],
    hospitals: [],
    schools: [],
    trains: []
  },

  // Conseil municipal
  councilMeeting: null,

  // Conseillers permanents (initialises au demarrage)
  councilors: null,
  commissions: COMMISSIONS,
  councilHistory: [] // Historique des votes au conseil
}

// ============================================
// STORE
// ============================================

export const useGameStore = create((set, get) => ({
  ...initialState,
  actions: ACTIONS,
  seasons: SEASONS,
  categories: CATEGORIES,
  orientations: ORIENTATIONS,

  // Verification de disponibilite d'une action
  isActionAvailable: (actionId) => {
    const state = get()
    const action = ACTIONS.find(a => a.id === actionId)
    if (!action) return { available: false, reason: 'Action inconnue' }

    const usedActions = state.usedActions || {}
    const excludedActions = state.excludedActions || []

    // Budget insuffisant
    if (state.budget < action.cost) return { available: false, reason: 'Budget insuffisant' }

    // Action exclue par une autre
    if (excludedActions.includes(actionId)) {
      return { available: false, reason: 'Incompatible avec une autre politique' }
    }

    // Action one-shot deja utilisee
    if (action.oneShot && usedActions[actionId]) {
      return { available: false, reason: 'Deja effectue' }
    }

    // Action repeatable avec limite atteinte
    if (action.repeatable && usedActions[actionId] >= action.repeatable) {
      return { available: false, reason: `Maximum atteint (${action.repeatable}x)` }
    }

    // Action necessite un prerequis non rempli
    if (action.requires && action.requires.length > 0) {
      const unmetRequires = action.requires.filter(req => !usedActions[req])
      if (unmetRequires.length > 0) {
        const reqAction = ACTIONS.find(a => a.id === unmetRequires[0])
        return { available: false, reason: `Necessite: ${reqAction?.name || unmetRequires[0]}`, locked: true }
      }
    }

    return { available: true }
  },

  executeAction: (actionId) => {
    const state = get()
    if (state.gameOver || state.currentEvent || state.councilMeeting?.isActive) return

    const action = ACTIONS.find(a => a.id === actionId)
    if (!action) return

    // Verifier la disponibilite
    const availability = get().isActionAvailable(actionId)
    if (!availability.available) return

    // Verifier si le conseil municipal est necessaire (actions couteuses)
    if (action.cost >= COUNCIL_THRESHOLD && ACTION_ARGUMENTS[actionId]) {
      get().initCouncilMeeting(actionId)
      return
    }

    const updates = {}
    updates.budget = state.budget - action.cost + (action.budgetGain || 0)

    // Calculer les deltas pour feedback visuel
    const deltas = { economie: 0, environnement: 0, cohesion: 0, energie: 0 }

    for (const [key, value] of Object.entries(action.effects || {})) {
      if (state[key] !== undefined) {
        updates[key] = clamp(state[key] + value, 0, 100)
        if (deltas[key] !== undefined) {
          deltas[key] = value
        }
      }
    }

    updates.indicatorDeltas = deltas
    updates.lastActionName = action.name

    if (action.population) {
      const newPop = { ...state.population }
      if (action.population.growth) newPop.middle += action.population.growth
      if (action.population.poorClass) newPop.poor += action.population.poorClass
      if (action.population.middleClass) newPop.middle += action.population.middleClass
      if (action.population.richClass) newPop.rich += action.population.richClass
      updates.population = newPop
    }

    if (action.jobs) {
      const newPop = updates.population || { ...state.population }
      if (action.jobs.middle) {
        const shift = Math.min(newPop.poor, action.jobs.middle * 0.4)
        newPop.poor -= shift
        newPop.middle += shift
      }
      if (action.jobs.poor) {
        newPop.poor += action.jobs.poor * 0.3
      }
      updates.population = newPop
    }

    if (action.hidden) {
      const newHidden = { ...state.hidden }
      for (const [key, value] of Object.entries(action.hidden)) {
        newHidden[key] = Math.max(0, (newHidden[key] || 0) + value)
      }
      updates.hidden = newHidden
    }

    if (action.delayed) {
      const newDelayed = [...state.delayedEffects]
      for (const d of action.delayed) {
        newDelayed.push({
          triggerTurn: state.turn + d.turns,
          effect: d.effect,
          populationShift: d.populationShift,
          populationEffect: d.populationEffect,
          reason: d.reason
        })
      }
      updates.delayedEffects = newDelayed
    }

    // Visuels
    const newCity = { ...state.cityElements }
    if (actionId === 'hlm' || actionId === 'requisition') {
      newCity.buildings = [...newCity.buildings, { id: Date.now(), x: 50 + Math.random() * 600, type: 'hlm' }]
    } else if (actionId === 'energie_renouvelable') {
      for (let i = 0; i < 4; i++) {
        newCity.solarPanels = [...newCity.solarPanels, { id: Date.now() + i, x: 50 + newCity.solarPanels.length * 40 }]
      }
    } else if (actionId === 'biodiversite') {
      newCity.parks = [...newCity.parks, { id: Date.now(), x: 50 + Math.random() * 600 }]
      for (let i = 0; i < 5; i++) {
        newCity.trees = [...newCity.trees, { id: Date.now() + i, x: 30 + Math.random() * 700, type: 'round' }]
      }
    } else if (actionId === 'sante_publique' || actionId === 'hopital') {
      newCity.hospitals = [...(newCity.hospitals || []), { id: Date.now(), x: 100 + Math.random() * 500 }]
    } else if (actionId === 'education') {
      newCity.schools = [...(newCity.schools || []), { id: Date.now(), x: 100 + Math.random() * 500 }]
    } else if (actionId === 'plan_rail') {
      newCity.trains = [...(newCity.trains || []), { id: Date.now() }]
    }
    updates.cityElements = newCity

    updates.history = [...state.history, `Tour ${state.turn}: ${action.name}`]

    // === Tracking des embranchements ===
    const newUsedActions = { ...state.usedActions }
    newUsedActions[actionId] = (newUsedActions[actionId] || 0) + 1
    updates.usedActions = newUsedActions

    // Ajouter les couts recurrents
    if (action.recurringCost) {
      updates.recurringCosts = (state.recurringCosts || 0) + action.recurringCost
    }

    // Debloquer les actions
    if (action.unlocks && action.unlocks.length > 0) {
      const newUnlocked = [...state.unlockedActions]
      for (const unlockId of action.unlocks) {
        if (!newUnlocked.includes(unlockId)) newUnlocked.push(unlockId)
      }
      updates.unlockedActions = newUnlocked
    }

    // Exclure les actions incompatibles
    if (action.excludes && action.excludes.length > 0) {
      const newExcluded = [...state.excludedActions]
      for (const excludeId of action.excludes) {
        if (!newExcluded.includes(excludeId)) newExcluded.push(excludeId)
      }
      updates.excludedActions = newExcluded
    }

    // Tracking orientation politique
    const category = CATEGORIES[action.category]
    const orientation = category?.orientation || 'neutre'
    const newOrientationScore = { ...state.orientationScore }
    newOrientationScore[orientation] = (newOrientationScore[orientation] || 0) + 1
    updates.orientationScore = newOrientationScore

    // Historique detaille des actions
    updates.actionHistory = [...state.actionHistory, {
      turn: state.turn,
      actionId: action.id,
      name: action.name,
      category: action.category,
      orientation,
      cost: action.cost,
      effects: action.effects,
      desc: action.desc
    }]

    set(updates)
    get().nextTurn()
  },

  nextTurn: () => {
    const state = get()
    const newTurn = state.turn + 1
    const updates = { turn: newTurn }

    const seasonKey = getSeasonKey(newTurn)
    const season = SEASONS[seasonKey]
    updates.season = seasonKey
    updates.seasonTurn = ((newTurn - 1) % 5) + 1

    const popFactor = Math.log10(state.population.total) * 8
    const taxBase = state.population.poor * 0.02 + state.population.middle * 0.05 + state.population.rich * 0.12
    const recurringCosts = state.recurringCosts || 0
    updates.budget = Math.round(15 + state.economie * 0.4 + taxBase - (state.hidden.debt || 0) * 0.15 - recurringCosts)

    let newEco = state.economie
    let newEnv = state.environnement
    let newCoh = state.cohesion
    let newEne = state.energie
    const newHidden = { ...state.hidden }
    const newPop = { ...state.population }

    if (season.effects) {
      newEco = clamp(newEco + (season.effects.economie || 0), 0, 100)
      newEnv = clamp(newEnv + (season.effects.environnement || 0), 0, 100)
      newCoh = clamp(newCoh + (season.effects.cohesion || 0), 0, 100)
      newEne = clamp(newEne + (season.effects.energie || 0), 0, 100)
    }

    // Effets systemiques - Consommation d'energie basee sur la population
    const baseDemand = Math.floor(state.population.total / 800) // Reduit de /500 a /800
    const energyDemand = Math.max(1, baseDemand) * (season.modifiers?.energyDemand || 1)
    newEne = clamp(newEne - energyDemand, 0, 100)

    // === CERCLES VERTUEUX DES POLITIQUES SOCIALES ===

    // Investissements verts = production d'energie renouvelable passive
    if (newHidden.greenInvest > 10) {
      const greenEnergyBonus = Math.floor(newHidden.greenInvest / 15) // +1 energie par 15 pts d'investissement vert
      newEne = clamp(newEne + greenEnergyBonus, 0, 100)
    }

    // Investissements verts = moins de pollution + economie verte
    if (newHidden.greenInvest > 15) {
      newHidden.pollution = Math.max(0, newHidden.pollution - 5)
      if (newHidden.greenInvest > 35) newEco = clamp(newEco + 2, 0, 100) // Economie verte
    }

    // Services publics de qualite = cercle vertueux
    if (newHidden.education > 45 && newHidden.health > 45) {
      newCoh = clamp(newCoh + 3, 0, 100)
      newHidden.tension = Math.max(0, newHidden.tension - 5)
    }

    // Education = mobilite sociale + innovation
    if (newHidden.education > 50 && Math.random() < 0.35) {
      const shift = Math.min(30, newPop.poor * 0.08)
      newPop.poor -= shift
      newPop.middle += shift
      if (newHidden.innovation < 80) newHidden.innovation += 3
    }

    // Culture = cohesion + attractivite
    if (newHidden.culture > 30) {
      newHidden.tension = Math.max(0, newHidden.tension - 5)
      if (newHidden.culture > 50) newPop.middle += 10 // Attractivite culturelle
    }

    // Sante = population en meilleure forme
    if (newHidden.health > 50) {
      newPop.middle += 15
      newCoh = clamp(newCoh + 1, 0, 100)
    }

    // === CERCLES VICIEUX DES POLITIQUES ANTISOCIALES ===

    // Pollution = sante + environnement
    if (newHidden.pollution > 30) {
      newEnv = clamp(newEnv - newHidden.pollution * 0.05, 0, 100)
      newHidden.health = Math.max(0, newHidden.health - 3)
      if (newHidden.pollution > 50) newPop.poor = Math.max(0, newPop.poor - 10) // Les pauvres partent
    }

    // Libertes restreintes = tension + fuite des classes moyennes
    if (newHidden.liberty < 40) {
      newHidden.tension += 5
      if (newHidden.liberty < 25) {
        newPop.middle = Math.max(0, newPop.middle - 15)
        newCoh = clamp(newCoh - 3, 0, 100)
      }
    }

    // Securitarisme sans resultats = frustration
    if (newHidden.security > 50 && newHidden.liberty < 35) {
      newHidden.tension += 4 // Securite sans liberte = malaise
    }

    // Dette d'infrastructure = degradation services
    if (newHidden.infrastructureDebt > 25) {
      newCoh = clamp(newCoh - newHidden.infrastructureDebt * 0.1, 0, 100)
      if (newHidden.infrastructureDebt > 40) {
        newHidden.health = Math.max(0, newHidden.health - 3)
        newHidden.education = Math.max(0, newHidden.education - 2)
      }
    }

    // Dette PPP = budget contraint
    if (newHidden.debt > 30) {
      newEco = clamp(newEco - 2, 0, 100)
    }

    // === MECANISMES DE BASE ===

    if (newEnv < 30) newCoh = clamp(newCoh - 3, 0, 100)
    if (newEco < 25) newHidden.tension += 10
    if (newHidden.tension > 30) newCoh = clamp(newCoh - newHidden.tension * 0.12, 0, 100)
    if (newCoh < 25) newEco = clamp(newEco - 3, 0, 100)

    // Inegalites = tensions sociales
    const inequality = (state.population.rich / (state.population.poor + 1))
    if (inequality > 0.3) newHidden.tension += inequality * 8
    if (inequality > 0.5) newCoh = clamp(newCoh - 5, 0, 100) // Inegalites visibles

    // Crise du logement
    if (state.population.total > newHidden.housingCapacity) {
      newCoh = clamp(newCoh - 8, 0, 100)
      newHidden.tension += 12
      newPop.poor = Math.max(0, newPop.poor - 20) // SDF, expulsions
    }

    // Attractivite si tout va bien
    if (newEco > 55 && newCoh > 55 && newEnv > 45) {
      newPop.middle += 20
      newPop.poor += 10
    }

    // Fuite si ca va mal
    if (newEco < 20 || newCoh < 20) {
      newPop.rich = Math.max(0, newPop.rich - 20)
      newPop.middle = Math.max(0, newPop.middle - 30)
    }

    updates.economie = newEco
    updates.environnement = newEnv
    updates.cohesion = newCoh
    updates.energie = newEne
    updates.hidden = newHidden
    updates.population = newPop

    // Historique des indicateurs pour graphiques
    updates.indicatorHistory = [...state.indicatorHistory, {
      turn: newTurn,
      economie: newEco,
      environnement: newEnv,
      cohesion: newCoh,
      energie: newEne,
      population: newPop.poor + newPop.middle + newPop.rich,
      inequality: newPop.rich / (newPop.poor + 1)
    }]

    set(updates)
    get().applyDelayedEffects()
    get().checkEvents()
    get().updateNarrative()
    get().checkGameOver()
  },

  applyDelayedEffects: () => {
    const state = get()
    const triggered = state.delayedEffects.filter(d => d.triggerTurn === state.turn)
    if (triggered.length === 0) return

    const updates = {}
    let newPop = { ...state.population }
    let history = [...state.history]

    for (const delayed of triggered) {
      if (delayed.effect) {
        for (const [key, value] of Object.entries(delayed.effect)) {
          if (state[key] !== undefined) {
            updates[key] = clamp((updates[key] || state[key]) + value, 0, 100)
          }
        }
      }

      if (delayed.populationShift?.poorToMiddle) {
        const shift = Math.min(newPop.poor, delayed.populationShift.poorToMiddle)
        newPop.poor -= shift
        newPop.middle += shift
      }

      if (delayed.populationEffect?.richLeave) {
        newPop.rich = Math.max(0, newPop.rich - delayed.populationEffect.richLeave)
      }

      if (delayed.reason) history.push(`↳ ${delayed.reason}`)
    }

    updates.population = newPop
    updates.history = history
    updates.delayedEffects = state.delayedEffects.filter(d => d.triggerTurn !== state.turn)
    set(updates)
  },

  checkEvents: () => {
    const state = get()
    if (state.currentEvent) return

    const possibleEvents = []

    if (state.hidden.tension > 50 && Math.random() < 0.4) possibleEvents.push('greve_generale')
    if (state.hidden.pollution > 40 && Math.random() < 0.3) possibleEvents.push('pollution_crisis')
    if (state.population.total > state.hidden.housingCapacity * 1.1 && Math.random() < 0.35) possibleEvents.push('crise_logement')
    if (state.hidden.health < 25 && Math.random() < 0.3) possibleEvents.push('deserts_medicaux')

    if (state.hidden.greenInvest > 40 && state.environnement > 60 && Math.random() < 0.2) possibleEvents.push('transition_reussie')

    const seasonEvents = SEASONS[state.season]?.events || []
    for (const eventId of seasonEvents) {
      if (EVENTS[eventId] && Math.random() < 0.12) {
        const event = EVENTS[eventId]
        if (!event.condition || event.condition(state)) {
          possibleEvents.push(eventId)
        }
      }
    }

    if (Math.random() < 0.06) {
      const dilemmas = ['multinationale', 'gentrification', 'austerite_imposee']
      possibleEvents.push(dilemmas[Math.floor(Math.random() * dilemmas.length)])
    }

    if (possibleEvents.length > 0) {
      const eventId = possibleEvents[Math.floor(Math.random() * possibleEvents.length)]
      get().triggerEvent(eventId)
    }
  },

  triggerEvent: (eventId) => {
    const event = EVENTS[eventId]
    if (!event) return

    set({
      currentEvent: { id: eventId, ...event },
      history: [...get().history, `⚡ ${event.title}`]
    })

    if (!event.choices) get().applyEventEffects(event)
  },

  applyEventEffects: (event, choice = null) => {
    const state = get()
    const effects = choice ? choice : event
    const updates = {}

    if (effects.effects) {
      for (const [key, value] of Object.entries(effects.effects)) {
        if (state[key] !== undefined) {
          updates[key] = clamp(state[key] + value, 0, 100)
        }
      }
    }

    if (effects.cost) updates.budget = state.budget - effects.cost
    if (effects.budgetGain) updates.budget = (updates.budget || state.budget) + effects.budgetGain

    const newPop = { ...state.population }
    if (effects.population) {
      if (effects.population.poorClass) newPop.poor += effects.population.poorClass
      if (effects.population.middleClass) newPop.middle += effects.population.middleClass
      if (effects.population.richClass) newPop.rich += effects.population.richClass
    }
    if (effects.populationEffect) {
      if (effects.populationEffect.deaths) {
        const deaths = effects.populationEffect.deaths
        newPop.poor = Math.max(0, newPop.poor - Math.floor(deaths * 0.6))
        newPop.middle = Math.max(0, newPop.middle - Math.floor(deaths * 0.3))
        newPop.rich = Math.max(0, newPop.rich - Math.floor(deaths * 0.1))
      }
      if (effects.populationEffect.poorLeave) newPop.poor = Math.max(0, newPop.poor - effects.populationEffect.poorLeave)
      if (effects.populationEffect.richLeave) newPop.rich = Math.max(0, newPop.rich - effects.populationEffect.richLeave)
    }
    updates.population = newPop

    if (effects.hidden) {
      const newHidden = { ...state.hidden }
      for (const [key, value] of Object.entries(effects.hidden)) {
        newHidden[key] = Math.max(0, (newHidden[key] || 0) + value)
      }
      updates.hidden = newHidden
    }

    if (effects.jobs) {
      const pop = updates.population || { ...state.population }
      if (effects.jobs.middle) {
        const shift = Math.min(pop.poor, effects.jobs.middle * 0.4)
        pop.poor -= shift
        pop.middle += shift
      }
      updates.population = pop
    }

    set(updates)
  },

  makeEventChoice: (choiceIndex) => {
    const state = get()
    if (!state.currentEvent || !state.currentEvent.choices) return

    const choice = state.currentEvent.choices[choiceIndex]
    if (choice) get().applyEventEffects(state.currentEvent, choice)
    set({ currentEvent: null })
  },

  dismissEvent: () => set({ currentEvent: null }),

  updateNarrative: () => {
    const state = get()
    const avg = (state.economie + state.environnement + state.cohesion) / 3
    const hasProgressivePolicies = state.hidden.greenInvest > 20 || state.hidden.education > 50 || state.hidden.health > 50

    let context = 'stable'
    if (avg < 25) context = 'crisis'
    else if (avg < 40) context = 'declining'
    else if (avg > 65 && hasProgressivePolicies) context = 'progressive'
    else if (avg > 60) context = 'thriving'

    const narratives = NARRATIVES[context]
    const main = narratives[Math.floor(Math.random() * narratives.length)]

    let hint = HINTS.default
    let hintType = 'default'

    if (state.hidden.pollution > 35) { hint = HINTS.pollution; hintType = 'warning' }
    else if (state.hidden.tension > 40) { hint = HINTS.tension; hintType = 'warning' }
    else if (state.energie < 25) { hint = HINTS.energy; hintType = 'warning' }
    else if (state.population.total > state.hidden.housingCapacity) { hint = HINTS.housing; hintType = 'warning' }
    else if (state.hidden.health < 30) { hint = HINTS.health; hintType = 'warning' }
    else if (state.hidden.education < 30) { hint = HINTS.education; hintType = 'warning' }
    else if (state.hidden.greenInvest > 35) { hint = HINTS.green; hintType = 'positive' }
    else if (state.hidden.culture > 40) { hint = HINTS.culture; hintType = 'positive' }
    else if (state.hidden.health > 60 && state.hidden.education > 50) { hint = HINTS.progress; hintType = 'positive' }

    set({ narrative: { main, hint, hintType } })
  },

  checkGameOver: () => {
    const state = get()
    if (state.turn > state.maxTurns) { set({ gameOver: true }); return }
    if (state.population.total < 150) { set({ gameOver: true }); return }
    if (state.economie < 5 && state.cohesion < 10) set({ gameOver: true })
  },

  getScore: () => {
    const state = get()
    const indicators = (state.economie + state.environnement + state.cohesion + state.energie) / 4
    const popScore = Math.min(20, Math.log10(state.population.total) * 8)
    const equalityBonus = Math.max(0, 15 - (state.population.rich / (state.population.poor + 1)) * 20)
    const progressBonus = (state.hidden.greenInvest + state.hidden.education + state.hidden.health) / 10
    const penaltyHidden = (state.hidden.pollution + state.hidden.tension + state.hidden.debt) / 20

    return Math.round(Math.max(0, Math.min(100, indicators + popScore + equalityBonus + progressBonus - penaltyHidden)))
  },

  getVerdict: () => {
    const score = get().getScore()
    const state = get()
    const inequality = state.population.rich / (state.population.poor + 1)
    const hasProgress = state.hidden.greenInvest > 30 && state.hidden.education > 45

    if (score > 75 && inequality < 0.3 && hasProgress) {
      return { title: "Modele de transition", desc: "Services publics repares, inegalites reduites, transition ecologique amorcee. La preuve qu'un autre modele est possible." }
    }
    if (score > 70 && hasProgress) {
      return { title: "Progres social", desc: "Les politiques progressistes ont porte leurs fruits. La ville va mieux, mais le chemin est encore long." }
    }
    if (score > 65) {
      return { title: "Equilibre fragile", desc: "La ville fonctionne, mais les defis structurels demeurent." }
    }
    if (score > 50) {
      return { title: "Statu quo", desc: "Ni progres ni recul majeur. Les inegalites persistent." }
    }
    if (score > 35) {
      return { title: "Crise larvee", desc: "Les tensions s'accumulent. Sans changement de cap, la situation va empirer." }
    }
    return { title: "Echec systemique", desc: "L'inaction ou les mauvais choix ont conduit la ville dans l'impasse." }
  },

  clearDeltas: () => {
    set({
      indicatorDeltas: { economie: 0, environnement: 0, cohesion: 0, energie: 0 },
      lastActionName: null
    })
  },

  // ============================================
  // CONSEIL MUNICIPAL
  // ============================================

  initCouncilMeeting: (actionId) => {
    const state = get()
    const action = ACTIONS.find(a => a.id === actionId)
    if (!action) return

    // Calculer le soutien initial de chaque conseiller
    const councilorsWithSupport = COUNCILORS.map(c => ({
      ...c,
      currentSupport: get().calculateCouncilorSupport(c, action)
    }))

    // Selectionner les arguments pertinents
    const selectedArguments = get().selectArgumentsForDebate(actionId)

    set({
      councilMeeting: {
        isActive: true,
        phase: 'intro',
        proposal: {
          actionId,
          action,
          cost: action.cost
        },
        councilors: councilorsWithSupport,
        selectedArguments,
        argumentsPresented: [],
        playerResponses: [],
        factCheckResults: [],
        votes: { pour: [], contre: [], abstention: [] },
        result: null,
        meetingHistory: state.councilMeeting?.meetingHistory || []
      }
    })
  },

  calculateCouncilorSupport: (councilor, action) => {
    const state = get()
    let support = councilor.baseSupport
    const category = action.category
    const orientation = CATEGORIES[category]?.orientation || 'neutre'

    // Bias categoriel
    const bias = councilor.biases?.[category] || 1.0
    support *= bias

    // Bonus/malus d'alignement politique
    if (councilor.alignment === orientation) {
      support += 15
    } else if (
      (councilor.alignment === 'gauche' && orientation === 'extreme_droite') ||
      (councilor.alignment === 'extreme_droite' && orientation === 'gauche')
    ) {
      support -= 20
    } else if (councilor.alignment !== orientation && orientation !== 'neutre') {
      support -= 5
    }

    // Effets sur les priorites du conseiller
    councilor.priorities?.forEach(priority => {
      if (action.hidden?.[priority]) {
        const effect = action.hidden[priority]
        support += effect > 0 ? 5 : effect < 0 ? -5 : 0
      }
      if (action.effects?.[priority]) {
        const effect = action.effects[priority]
        support += effect > 0 ? 5 : effect < 0 ? -5 : 0
      }
    })

    // Contexte budgetaire
    if (councilor.priorities?.includes('debt') && state.budget < 30) {
      support -= action.cost * 0.3
    }

    // Historique politique - bonus si le joueur a deja fait des actions alignees
    const alignedActions = state.actionHistory?.filter(
      a => CATEGORIES[a.category]?.orientation === councilor.alignment
    ).length || 0
    support += alignedActions * 2

    return Math.max(0, Math.min(100, Math.round(support)))
  },

  selectArgumentsForDebate: (actionId) => {
    const state = get()
    const args = getArgumentsForAction(actionId, state)
    if (!args) return []

    const selected = []

    // Ajouter quelques arguments pro (2-3)
    const proAlignments = ['gauche', 'centre', 'droite']
    proAlignments.forEach(align => {
      const proArgs = args.pro[align] || []
      if (proArgs.length > 0) {
        const arg = proArgs[Math.floor(Math.random() * proArgs.length)]
        selected.push({ ...arg, type: 'pro', alignment: align })
      }
    })

    // Ajouter quelques arguments con (2-3)
    const conAlignments = ['droite', 'extreme_droite', 'gauche']
    conAlignments.forEach(align => {
      const conArgs = args.con[align] || []
      if (conArgs.length > 0) {
        const arg = conArgs[Math.floor(Math.random() * conArgs.length)]
        selected.push({ ...arg, type: 'con', alignment: align })
      }
    })

    // Ajouter les arguments contextuels
    args.contextual?.forEach(ctx => {
      selected.push({ ...ctx.argument, type: ctx.type, alignment: 'contexte' })
    })

    // Melanger et limiter a 5-6 arguments
    return selected.sort(() => Math.random() - 0.5).slice(0, 6)
  },

  advanceCouncilPhase: (phase) => {
    const state = get()
    if (!state.councilMeeting?.isActive) return

    set({
      councilMeeting: {
        ...state.councilMeeting,
        phase
      }
    })
  },

  cancelCouncilMeeting: () => {
    set({ councilMeeting: null })
  },

  presentArgument: (argument) => {
    const state = get()
    if (!state.councilMeeting?.isActive) return

    // L'argument peut influencer le soutien des conseillers
    const updatedCouncilors = state.councilMeeting.councilors.map(c => {
      let delta = 0

      // Les arguments pro augmentent le soutien des conseillers alignes
      if (argument.type === 'pro') {
        if (c.alignment === argument.alignment) delta += 5
        else if (argument.strength === 'strong' || argument.strength === 'critical') delta += 2
      }
      // Les arguments con diminuent le soutien
      if (argument.type === 'con') {
        if (c.alignment === argument.alignment) delta -= 2 // Meme camp, moins d'impact
        else delta -= 4 // Camp oppose, plus d'impact
        if (argument.strength === 'strong' || argument.strength === 'critical') delta -= 2
      }

      // Les conseillers sensibles aux faits sont plus influences
      if (argument.factBased) {
        delta *= c.factSensitivity || 0.8
      }

      return {
        ...c,
        currentSupport: Math.max(0, Math.min(100, c.currentSupport + delta))
      }
    })

    set({
      councilMeeting: {
        ...state.councilMeeting,
        councilors: updatedCouncilors,
        argumentsPresented: [...state.councilMeeting.argumentsPresented, argument]
      }
    })
  },

  // Presenter un argument du joueur (maire) pour influencer les conseillers
  presentPlayerArgument: (playerArg) => {
    const state = get()
    if (!state.councilMeeting?.isActive) return
    if (state.councilMeeting.playerArgumentUsed) return // Un seul argument par session

    const updatedCouncilors = state.councilMeeting.councilors.map(c => {
      // Appliquer l'effet selon l'alignement du conseiller
      const effectValue = playerArg.effect[c.alignment] || 0

      return {
        ...c,
        currentSupport: Math.max(0, Math.min(100, c.currentSupport + effectValue))
      }
    })

    set({
      councilMeeting: {
        ...state.councilMeeting,
        councilors: updatedCouncilors,
        playerArgumentUsed: true,
        playerArgumentPresented: playerArg
      }
    })
  },

  executeCouncilVote: (voteResult) => {
    const state = get()
    if (!state.councilMeeting?.isActive) return

    set({
      councilMeeting: {
        ...state.councilMeeting,
        phase: 'result',
        votes: {
          pour: voteResult.pour,
          contre: voteResult.contre,
          abstention: voteResult.abstention || []
        },
        result: {
          passed: voteResult.passed,
          margin: voteResult.margin
        }
      }
    })
  },

  finalizeCouncilMeeting: () => {
    const state = get()
    if (!state.councilMeeting?.isActive) return

    const meeting = state.councilMeeting
    const passed = meeting.result?.passed

    // Sauvegarder dans l'historique
    const meetingRecord = {
      turn: state.turn,
      actionId: meeting.proposal.actionId,
      actionName: meeting.proposal.action.name,
      passed,
      votes: meeting.votes,
      margin: meeting.result?.margin
    }

    if (passed) {
      // Executer l'action directement sans repasser par executeAction
      get().executeActionDirect(meeting.proposal.actionId)
    }

    // Fermer le modal
    set({
      councilMeeting: {
        ...meeting,
        isActive: false,
        meetingHistory: [...(meeting.meetingHistory || []), meetingRecord]
      }
    })

    // Petit delai puis nettoyer
    setTimeout(() => {
      set({ councilMeeting: null })
    }, 100)
  },

  // ============================================
  // GESTION DES CONSEILLERS PERMANENTS
  // ============================================

  // Consulter un conseiller sur un theme
  consultCouncilor: (councilorId, theme) => {
    const state = get()
    if (!state.councilors) return null

    const councilor = state.councilors.find(c => c.id === councilorId)
    if (!councilor) return null

    // Marquer comme consulte ce tour
    const updatedCouncilors = state.councilors.map(c =>
      c.id === councilorId
        ? { ...c, consultedThisTurn: true, recentInteractions: [...c.recentInteractions.slice(-4), { turn: state.turn, theme }] }
        : c
    )

    set({ councilors: updatedCouncilors })

    // Retourner l'opinion du conseiller
    const opinion = councilor.opinions?.[theme]
    return {
      councilor,
      opinion: opinion || { position: getCouncilorOpinion(councilor, theme), priority: 'medium', quote: null },
      relationship: councilor.relationship
    }
  },

  // Ameliorer la relation avec un conseiller
  improveRelationship: (councilorId, amount = 5) => {
    const state = get()
    if (!state.councilors) return

    const updatedCouncilors = state.councilors.map(c =>
      c.id === councilorId
        ? { ...c, relationship: Math.min(100, c.relationship + amount) }
        : c
    )
    set({ councilors: updatedCouncilors })
  },

  // Degrader la relation avec un conseiller
  degradeRelationship: (councilorId, amount = 5) => {
    const state = get()
    if (!state.councilors) return

    const updatedCouncilors = state.councilors.map(c =>
      c.id === councilorId
        ? { ...c, relationship: Math.max(0, c.relationship - amount) }
        : c
    )
    set({ councilors: updatedCouncilors })
  },

  // Mettre a jour le mood d'un conseiller apres une action
  updateCouncilorMood: (councilorId, mood) => {
    const state = get()
    if (!state.councilors) return

    const updatedCouncilors = state.councilors.map(c =>
      c.id === councilorId ? { ...c, mood } : c
    )
    set({ councilors: updatedCouncilors })
  },

  // Reset des consultations au debut de chaque tour
  resetCouncilorConsultations: () => {
    const state = get()
    if (!state.councilors) return

    const updatedCouncilors = state.councilors.map(c => ({
      ...c,
      consultedThisTurn: false
    }))
    set({ councilors: updatedCouncilors })
  },

  // Obtenir les conseillers d'une commission
  getCommissionMembers: (commissionId) => {
    const state = get()
    if (!state.councilors) return []

    // Chaque conseiller peut etre dans 1-2 commissions selon ses biases
    const commissionMapping = {
      finances: ['philippe_bertrand', 'marie_duval', 'jean_luc_dupont'],
      social: ['elena_martinez', 'fatima_benali', 'claire_martin'],
      urbanisme: ['antoine_perrin', 'xavier_moreau', 'philippe_bertrand'],
      securite: ['bernard_lambert', 'marie_duval', 'xavier_moreau'],
      environnement: ['antoine_perrin', 'sophie_leroux', 'elena_martinez'],
      culture: ['fatima_benali', 'claire_martin', 'sophie_leroux']
    }

    const memberIds = commissionMapping[commissionId] || []
    return state.councilors.filter(c => memberIds.includes(c.id))
  },

  // Execution directe d'une action (sans verification conseil)
  executeActionDirect: (actionId) => {
    const state = get()
    const action = ACTIONS.find(a => a.id === actionId)
    if (!action) return

    const updates = {}
    updates.budget = state.budget - action.cost + (action.budgetGain || 0)

    const deltas = { economie: 0, environnement: 0, cohesion: 0, energie: 0 }

    for (const [key, value] of Object.entries(action.effects || {})) {
      if (state[key] !== undefined) {
        updates[key] = clamp(state[key] + value, 0, 100)
        if (deltas[key] !== undefined) {
          deltas[key] = value
        }
      }
    }

    updates.indicatorDeltas = deltas
    updates.lastActionName = action.name

    if (action.population) {
      const newPop = { ...state.population }
      if (action.population.growth) newPop.middle += action.population.growth
      if (action.population.poorClass) newPop.poor += action.population.poorClass
      if (action.population.middleClass) newPop.middle += action.population.middleClass
      if (action.population.richClass) newPop.rich += action.population.richClass
      updates.population = newPop
    }

    if (action.jobs) {
      const newPop = updates.population || { ...state.population }
      if (action.jobs.middle) {
        const shift = Math.min(newPop.poor, action.jobs.middle * 0.4)
        newPop.poor -= shift
        newPop.middle += shift
      }
      if (action.jobs.poor) {
        newPop.poor += action.jobs.poor * 0.3
      }
      updates.population = newPop
    }

    if (action.hidden) {
      const newHidden = { ...state.hidden }
      for (const [key, value] of Object.entries(action.hidden)) {
        newHidden[key] = Math.max(0, (newHidden[key] || 0) + value)
      }
      updates.hidden = newHidden
    }

    if (action.delayed) {
      const newDelayed = [...state.delayedEffects]
      for (const d of action.delayed) {
        newDelayed.push({
          triggerTurn: state.turn + d.turns,
          effect: d.effect,
          populationShift: d.populationShift,
          populationEffect: d.populationEffect,
          reason: d.reason
        })
      }
      updates.delayedEffects = newDelayed
    }

    // Visuels
    const newCity = { ...state.cityElements }
    if (actionId === 'hlm' || actionId === 'requisition') {
      newCity.buildings = [...newCity.buildings, { id: Date.now(), x: 50 + Math.random() * 600, type: 'hlm' }]
    } else if (actionId === 'energie_renouvelable') {
      for (let i = 0; i < 4; i++) {
        newCity.solarPanels = [...newCity.solarPanels, { id: Date.now() + i, x: 50 + newCity.solarPanels.length * 40 }]
      }
    } else if (actionId === 'biodiversite') {
      newCity.parks = [...newCity.parks, { id: Date.now(), x: 50 + Math.random() * 600 }]
      for (let i = 0; i < 5; i++) {
        newCity.trees = [...newCity.trees, { id: Date.now() + i, x: 30 + Math.random() * 700, type: 'round' }]
      }
    } else if (actionId === 'sante_publique' || actionId === 'hopital') {
      newCity.hospitals = [...(newCity.hospitals || []), { id: Date.now(), x: 100 + Math.random() * 500 }]
    } else if (actionId === 'education') {
      newCity.schools = [...(newCity.schools || []), { id: Date.now(), x: 100 + Math.random() * 500 }]
    } else if (actionId === 'plan_rail') {
      newCity.trains = [...(newCity.trains || []), { id: Date.now() }]
    }
    updates.cityElements = newCity

    updates.history = [...state.history, `Tour ${state.turn}: ${action.name} (vote)`]

    // Tracking des embranchements
    const newUsedActions = { ...state.usedActions }
    newUsedActions[actionId] = (newUsedActions[actionId] || 0) + 1
    updates.usedActions = newUsedActions

    if (action.recurringCost) {
      updates.recurringCosts = (state.recurringCosts || 0) + action.recurringCost
    }

    if (action.unlocks && action.unlocks.length > 0) {
      const newUnlocked = [...state.unlockedActions]
      for (const unlockId of action.unlocks) {
        if (!newUnlocked.includes(unlockId)) newUnlocked.push(unlockId)
      }
      updates.unlockedActions = newUnlocked
    }

    if (action.excludes && action.excludes.length > 0) {
      const newExcluded = [...state.excludedActions]
      for (const excludeId of action.excludes) {
        if (!newExcluded.includes(excludeId)) newExcluded.push(excludeId)
      }
      updates.excludedActions = newExcluded
    }

    // Tracking orientation
    const category = CATEGORIES[action.category]
    const orientation = category?.orientation || 'neutre'
    const newOrientationScore = { ...state.orientationScore }
    newOrientationScore[orientation] = (newOrientationScore[orientation] || 0) + 1
    updates.orientationScore = newOrientationScore

    updates.actionHistory = [...state.actionHistory, {
      turn: state.turn,
      actionId: action.id,
      name: action.name,
      category: action.category,
      orientation,
      cost: action.cost,
      effects: action.effects,
      desc: action.desc
    }]

    set(updates)
    get().nextTurn()
  },

  reset: () => {
    set({
      ...initialState,
      population: { poor: 500, middle: 400, rich: 100, get total() { return this.poor + this.middle + this.rich } },
      hidden: { ...initialState.hidden },
      cityElements: { buildings: [], factories: [], parks: [], solarPanels: [], trees: [], hospitals: [], schools: [], trains: [] },
      delayedEffects: [],
      history: [],
      actionHistory: [],
      indicatorHistory: [],
      orientationScore: { gauche: 0, droite: 0, extreme_droite: 0, centre: 0, neutre: 0 },
      usedActions: {},
      unlockedActions: [],
      excludedActions: [],
      indicatorDeltas: { economie: 0, environnement: 0, cohesion: 0, energie: 0 },
      lastActionName: null,
      recurringCosts: 0,
      councilMeeting: null
    })
  },

  // Initialisation avec une ville specifique (donnees INSEE)
  initializeWithVille: (villeId) => {
    const ville = getVilleById(villeId)
    if (!ville) return

    const { indicateursInitiaux, hidden, populationInitiale } = ville

    set({
      // Indicateurs principaux adaptes a la ville
      economie: indicateursInitiaux.economie,
      environnement: indicateursInitiaux.environnement,
      cohesion: indicateursInitiaux.cohesion,
      energie: indicateursInitiaux.energie,

      // Population adaptee
      population: {
        poor: populationInitiale.poor,
        middle: populationInitiale.middle,
        rich: populationInitiale.rich,
        get total() { return this.poor + this.middle + this.rich }
      },

      // Variables cachees adaptees
      hidden: {
        pollution: hidden.pollution || 20,
        tension: hidden.tension || 25,
        greenInvest: 0,
        housingCapacity: hidden.housingCapacity || 900,
        health: hidden.health || 40,
        education: hidden.education || 35,
        culture: 20,
        mobility: hidden.mobility || 20,
        tourism: hidden.tourism || 10,
        debt: 0,
        infrastructureDebt: 10,
        innovation: 10,
        security: 30,
        liberty: 60
      },

      // Narrative initiale adaptee
      narrative: {
        main: `Bienvenue a ${ville.nom}. ${ville.description}. Les defis vous attendent : ${ville.defis.slice(0, 2).join(', ')}.`,
        hint: "Les habitants attendent vos premieres decisions.",
        hintType: 'default'
      },

      // Stocker les infos de la ville pour reference
      currentVille: {
        id: ville.id,
        nom: ville.nom,
        stats: ville.stats,
        source: ville.source
      },

      // Initialiser les conseillers permanents
      councilors: initializeCouncilors(),
      councilHistory: []
    })
  },

  // Analyse de fin de partie
  getRecapData: () => {
    const state = get()
    const totalActions = Object.values(state.orientationScore).reduce((a, b) => a + b, 0)

    // Calcul du profil politique dominant
    let dominantOrientation = 'neutre'
    let maxScore = 0
    for (const [orient, score] of Object.entries(state.orientationScore)) {
      if (score > maxScore) {
        maxScore = score
        dominantOrientation = orient
      }
    }

    // Moments cles (changements importants)
    const keyMoments = []
    for (let i = 1; i < state.indicatorHistory.length; i++) {
      const prev = state.indicatorHistory[i - 1]
      const curr = state.indicatorHistory[i]
      const action = state.actionHistory[i - 1]

      // Detecter les grands changements
      const cohesionDelta = curr.cohesion - prev.cohesion
      const ecoDelta = curr.economie - prev.economie
      const envDelta = curr.environnement - prev.environnement

      if (Math.abs(cohesionDelta) >= 8 || Math.abs(ecoDelta) >= 8 || Math.abs(envDelta) >= 8) {
        keyMoments.push({
          turn: curr.turn,
          action: action?.name || 'Evenement',
          impact: cohesionDelta > 0 ? 'positif' : cohesionDelta < 0 ? 'negatif' : 'neutre',
          delta: { cohesion: cohesionDelta, economie: ecoDelta, environnement: envDelta }
        })
      }
    }

    // Analyse causale
    const causalAnalysis = []
    const h = state.hidden

    if (h.tension > 40) causalAnalysis.push({ cause: 'Tensions sociales elevees', effect: 'Baisse de cohesion', severity: 'warning' })
    if (h.pollution > 35) causalAnalysis.push({ cause: 'Pollution importante', effect: 'Degradation environnement et sante', severity: 'danger' })
    if (h.liberty < 30) causalAnalysis.push({ cause: 'Libertes restreintes', effect: 'Mecontentement latent', severity: 'warning' })
    if (h.greenInvest > 30) causalAnalysis.push({ cause: 'Investissements verts', effect: 'Transition ecologique amorcee', severity: 'positive' })
    if (h.education > 50) causalAnalysis.push({ cause: 'Investissement educatif', effect: 'Mobilite sociale', severity: 'positive' })
    if (h.health > 50) causalAnalysis.push({ cause: 'Services de sante', effect: 'Qualite de vie', severity: 'positive' })
    if (h.security > 50 && h.liberty < 40) causalAnalysis.push({ cause: 'Securitarisme', effect: 'Securite au prix des libertes', severity: 'warning' })
    if (h.infrastructureDebt > 30) causalAnalysis.push({ cause: 'Sous-investissement', effect: 'Services publics degrades', severity: 'danger' })
    if (h.debt > 40) causalAnalysis.push({ cause: 'Endettement PPP', effect: 'Budget contraint', severity: 'warning' })

    return {
      totalActions,
      orientationScore: state.orientationScore,
      dominantOrientation,
      orientationInfo: ORIENTATIONS[dominantOrientation],
      actionHistory: state.actionHistory,
      indicatorHistory: state.indicatorHistory,
      keyMoments,
      causalAnalysis,
      finalState: {
        economie: state.economie,
        environnement: state.environnement,
        cohesion: state.cohesion,
        energie: state.energie,
        population: state.population,
        hidden: state.hidden
      }
    }
  }
}))
