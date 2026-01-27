// ============================================
// BETA-TRAJ - Application JavaScript
// Version 2.0 - Trajectoire Climatique Paris
// ============================================

// ============================================
// PASSWORD PROTECTION
// ============================================

const SITE_PASSWORD = 'VilleDeParis2025!';
const AUTH_KEY = 'betatraj_authenticated';

function checkPassword(event) {
    event.preventDefault();
    const input = document.getElementById('password-input');
    const error = document.getElementById('password-error');

    if (input.value === SITE_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, 'true');
        document.getElementById('password-overlay').style.display = 'none';
        error.style.display = 'none';
        return false;
    } else {
        error.style.display = 'block';
        input.value = '';
        input.focus();
        return false;
    }
}

function checkAuthentication() {
    if (sessionStorage.getItem(AUTH_KEY) === 'true') {
        document.getElementById('password-overlay').style.display = 'none';
    }
}

// Check auth on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', checkAuthentication);
}

// ============================================
// DATA - Climate Scenarios (TRACC 2023)
// ============================================

const scenarios = {
    ref: {
        temp: "Ref", tempNum: 0, color: "#3b82f6", year: "1976-2005",
        // Climat moyen
        avgTemp: 12.4, avgSummer: 19, avgWinter: 5, summerRain: 161, winterRain: 148, frostDays: 22,
        // Extrêmes
        maxTemp: 34, tropicalNights: 8, tropicalNightsICU: 8, days30: 9, days35: 1, days40: 0,
        cooling: 62, heating: 2332, fireRisk: 2, droughtDays: 23, extremeRainDays: 3
    },
    "2030": {
        temp: "+2°C", tempNum: 2, color: "#f59e0b", year: "2030",
        // Climat moyen (estimations basées sur +2°C)
        avgTemp: 14.4, avgSummer: 21, avgWinter: 7, summerRain: 154, winterRain: 155, frostDays: 14,
        // Extrêmes
        maxTemp: 36.2, tropicalNights: 17, tropicalNightsICU: 32, days30: 15, days35: 2.2, days40: 0.2,
        cooling: 106, heating: 2023, fireRisk: 3.3, droughtDays: 28, extremeRainDays: 4
    },
    "2050": {
        temp: "+2,7°C", tempNum: 2.7, color: "#ef4444", year: "2050",
        // Climat moyen (estimations basées sur +2,7°C)
        avgTemp: 15.1, avgSummer: 22, avgWinter: 8, summerRain: 155, winterRain: 160, frostDays: 11,
        // Extrêmes
        maxTemp: 37.4, tropicalNights: 26, tropicalNightsICU: 48, days30: 22, days35: 4.1, days40: 0.4,
        cooling: 163, heating: 1893, fireRisk: 8, droughtDays: 32, extremeRainDays: 5
    },
    "2100": {
        temp: "+4°C", tempNum: 4, color: "#991b1b", year: "2100",
        // Climat moyen (estimations basées sur +4°C)
        avgTemp: 16.4, avgSummer: 24, avgWinter: 9, summerRain: 141, winterRain: 165, frostDays: 7,
        // Extrêmes
        maxTemp: 39.9, tropicalNights: 42, tropicalNightsICU: 63, days30: 33, days35: 8, days40: 1.5,
        cooling: 250, heating: 1627, fireRisk: 9.3, droughtDays: 38, extremeRainDays: 6
    }
};

// ============================================
// DATA - Indicator Definitions
// ============================================

const indicatorDefinitions = {
    tropicalNights: {
        title: "Nuits tropicales",
        unit: "nuits/an",
        definition: "Nuit ou la temperature minimale ne descend pas en dessous de 20°C.",
        intervals: { ref: [5, 12], "2030": [10, 23], "2050": [19, 34], "2100": [32, 54] }
    },
    days30: {
        title: "Jours > 30°C",
        unit: "jours/an",
        definition: "Nombre de jours ou la temperature maximale depasse 30°C.",
        intervals: { ref: [5, 14], "2030": [10, 22], "2050": [16, 29], "2100": [25, 42] }
    },
    days35: {
        title: "Jours > 35°C",
        unit: "jours/an",
        definition: "Nombre de jours ou la temperature maximale depasse 35°C.",
        intervals: { ref: [0, 2], "2030": [1, 6], "2050": [2, 7], "2100": [5, 12] }
    },
    days40: {
        title: "Jours > 40°C",
        unit: "jours/an",
        definition: "Nombre de jours ou la temperature maximale depasse 40°C.",
        intervals: { ref: [0, 0], "2030": [0, 0.5], "2050": [0, 1], "2100": [0.5, 3] }
    },
    cooling: {
        title: "Besoin climatisation",
        unit: "DJ",
        definition: "Degres-jours de climatisation (seuil 22°C).",
        intervals: { ref: [45, 82], "2030": [78, 140], "2050": [120, 210], "2100": [190, 320] }
    },
    heating: {
        title: "Besoin chauffage",
        unit: "DJ",
        definition: "Degres-jours de chauffage (seuil 18°C).",
        intervals: { ref: [2200, 2450], "2030": [1900, 2150], "2050": [1750, 2050], "2100": [1450, 1800] }
    },
    frostDays: {
        title: "Jours de gel",
        unit: "jours/an",
        definition: "Nombre de jours ou la temperature minimale descend sous 0°C.",
        intervals: { ref: [17, 28], "2030": [10, 19], "2050": [7, 16], "2100": [4, 11] }
    },
    fireRisk: {
        title: "Risque incendie",
        unit: "jours/an",
        definition: "Jours ou l'Indice Feu Meteo depasse le seuil de risque eleve (IFM > 40).",
        intervals: { ref: [1, 4], "2030": [2, 5], "2050": [5, 12], "2100": [6, 14] }
    },
    maxTemp: {
        title: "Temp. max record",
        unit: "°C",
        definition: "Temperature maximale journaliere la plus elevee de l'annee.",
        intervals: { ref: [32, 36], "2030": [34, 38], "2050": [35, 40], "2100": [38, 43] }
    }
};

// ============================================
// DATA - Tipping Points
// ============================================

const tippingPointsVersionA = [
    { icon: "&#x1F9CA;", title: "Calotte Groenland", thresholdMin: 0.8, thresholdMax: 3.0, desc: "Fonte irreversible : +7m niveau mers", color: "#06b6d4", location: "Groenland" },
    { icon: "&#x1F30A;", title: "Circulation AMOC", thresholdMin: 1.4, thresholdMax: 8.0, desc: "Effondrement du Gulf Stream", color: "#3b82f6", location: "Atlantique Nord" },
    { icon: "&#x1F333;", title: "Foret amazonienne", thresholdMin: 2.0, thresholdMax: 6.0, desc: "Transformation en savane", color: "#22c55e", location: "Amerique du Sud" },
    { icon: "&#x2744;", title: "Permafrost", thresholdMin: 1.0, thresholdMax: 2.3, desc: "Degel : liberation de carbone", color: "#a855f7", location: "Siberie / Canada" },
    { icon: "&#x1F9CA;", title: "Antarctique Ouest", thresholdMin: 1.0, thresholdMax: 3.0, desc: "Effondrement : +3m niveau mers", color: "#60a5fa", location: "Antarctique" },
    { icon: "&#x2744;", title: "Banquise arctique", thresholdMin: 1.5, thresholdMax: 2.0, desc: "Disparition estivale", color: "#e0f2fe", location: "Ocean Arctique" }
];

const tippingPointsVersionB = [
    { id: "arctic", title: "Banquise arctique", x: 50, y: 6, thresholdMin: 1.5, thresholdMax: 2.0, icon: "&#x2744;", desc: "Disparition estivale", color: "#e0f2fe" },
    { id: "greenland", title: "Calotte Groenland", x: 40, y: 18, thresholdMin: 0.8, thresholdMax: 3.0, icon: "&#x1F9CA;", desc: "Fonte irreversible", color: "#06b6d4" },
    { id: "antarctica-west", title: "Antarctique Ouest", x: 35, y: 88, thresholdMin: 1.0, thresholdMax: 3.0, icon: "&#x1F9CA;", desc: "Effondrement", color: "#60a5fa" },
    { id: "amoc", title: "Circulation AMOC", x: 30, y: 38, thresholdMin: 1.4, thresholdMax: 8.0, icon: "&#x1F30A;", desc: "Effondrement Gulf Stream", color: "#3b82f6" },
    { id: "amazon", title: "Foret amazonienne", x: 28, y: 58, thresholdMin: 2.0, thresholdMax: 6.0, icon: "&#x1F333;", desc: "Deperissement", color: "#22c55e" },
    { id: "permafrost", title: "Permafrost", x: 68, y: 15, thresholdMin: 1.0, thresholdMax: 2.3, icon: "&#x2744;", desc: "Degel massif", color: "#a855f7" },
    { id: "coral", title: "Recifs coralliens", x: 82, y: 62, thresholdMin: 1.0, thresholdMax: 1.5, icon: "&#x1F41A;", desc: "Blanchissement", color: "#ec4899" }
];

const globalImpactsData = {
    ref: { sea: "0 cm", refugees: "~0", species: "Ref", coral: "70%", arctic: "Avec glace" },
    "2030": { sea: "+20 cm", refugees: "140M", species: "-8%", coral: "50%", arctic: "Ete sans glace rare" },
    "2050": { sea: "+40 cm", refugees: "200M", species: "-15%", coral: "30%", arctic: "Ete sans glace freq." },
    "2100": { sea: "+1m", refugees: "500M+", species: "-30%", coral: "~0%", arctic: "Sans glace" }
};

const cityAnalogues = {
    ref: { city: "Paris", temp: "12.4°C", desc: "Climat de reference" },
    "2030": { city: "Bordeaux", temp: "13.8°C", desc: "A +2°C, Paris aura le climat actuel de Bordeaux" },
    "2050": { city: "Montpellier", temp: "14.2°C", desc: "A +2,7°C, Paris aura le climat actuel de Montpellier" },
    "2100": { city: "Seville", temp: "18.6°C", desc: "A +4°C, Paris aura le climat actuel de Seville (Espagne)" }
};

// ============================================
// DATA - Impacts par menace
// ============================================

const impactsData = {
    surchauffe: {
        title: "Surchauffe urbaine",
        color: "#ef4444",
        icon: "&#x1F321;",
        impacts: [
            {
                title: "Intensification des canicules",
                icon: "&#x1F321;",
                desc: "Risques sanitaires accrus, notamment pour les personnes vulnérables (personnes âgées, enfants, malades chroniques). Les nuits chaudes empêchent la récupération.",
                data: { label: "Nuits tropicales", ref: 8, "2030": 17, "2050": 26, "2100": 42 }
            },
            {
                title: "Augmentation des besoins de rafraîchissement",
                icon: "&#x2744;",
                desc: "Recours de plus en plus fréquent et généralisé à la climatisation en raison de l'augmentation de périodes de fortes chaleurs et leurs implications sur le confort thermique et la santé des Parisiens et des personnels.",
                data: { label: "Degrés-jours climatisation", ref: 62, "2030": 106, "2050": 163, "2100": 250 }
            },
            {
                title: "Risque sur la santé",
                icon: "&#x1F3E5;",
                desc: "Coups de chaud voire hyperthermie, déshydratation, fatigue, troubles du sommeil, maladies cardio-vasculaires, respiratoires, infectieuses etc. Certains publics sont particulièrement vulnérables : personnes âgées, nourrissons, enfants, malades ou sous certains traitements, personnes précaires, travailleurs exposés.",
                data: null
            },
            {
                title: "Surchauffe des bâtiments",
                icon: "&#x1F3EB;",
                desc: "Tous les bâtiments seront à risque, surtout les bâtiments anciens ou mal isolés : écoles, crèches, EHPAD, logements, accueil du public.",
                data: null
            },
            {
                title: "Perturbation des réseaux énergétiques",
                icon: "&#x26A1;",
                desc: "Augmentation des dommages et risques de dysfonctionnements sur certains réseaux : montées de charges en cas de surconsommation de climatisation, défaillance de certains composants sensibles à la chaleur, dysfonctionnement en cas de dépassement de seuil de température (34°C de l'air), voire risques d'incendies, coupures d'électricité pour des quartiers entiers. Ces dysfonctionnements peuvent avoir des effets en cascade et impacter des services essentiels : hôpitaux, EHPAD, écoles dont les groupes électrogènes peuvent eux-mêmes être défaillants.",
                data: { label: "Temp. max moyenne", ref: 34, "2030": 36.2, "2050": 37.4, "2100": 39.9 }
            },
            {
                title: "Perturbation des transports",
                icon: "&#x1F687;",
                desc: "Réseau de transport parisien fragilisé face à la surchauffe des infrastructures, des pannes techniques et des ralentissements, notamment sur les réseaux ferroviaires et routiers. Les activités extérieures, la marche et le vélo sont également plus éprouvants et risqués pour la santé. Les épisodes caniculaires imposent une adaptation de l'organisation et de l'exploitation du réseau (horaires, maintenance, gestion de crise), entraînant des coûts supplémentaires.",
                data: null
            },
            {
                title: "Baisse de l'attractivité",
                icon: "&#x1F3DB;",
                desc: "Avec des étés caniculaires et une ville peu adaptée, baisse de l'attractivité touristique et économique, risques sanitaires dans l'espace public.",
                data: null
            },
            {
                title: "Stress thermique végétation",
                icon: "&#x1F333;",
                desc: "La surchauffe impacte fortement les espaces verts et la biodiversité urbaine, réduisant leur capacité de rafraîchissement.",
                data: null
            }
        ]
    },
    inondations: {
        title: "Inondations",
        color: "#3b82f6",
        icon: "&#x1F30A;",
        stats: [
            { value: "14/20", label: "arrondissements en zone inondable" },
            { value: "110 000", label: "Parisiens en zone inondable" },
            { value: "150 000", label: "salariés en zone inondable" },
            { value: "280 000", label: "Parisiens impactés indirectement" },
            { value: "30 Mds€", label: "dégâts estimés en IDF (OCDE)" }
        ],
        impacts: [
            {
                title: "Dommages aux infrastructures",
                icon: "&#x1F687;",
                desc: "Les infrastructures souterraines (métro, parkings, réseaux) et de transport sont particulièrement vulnérables aux inondations.",
                data: null
            },
            {
                title: "Perturbation des réseaux énergétiques",
                icon: "&#x26A1;",
                desc: "Les inondations peuvent endommager les infrastructures énergétiques, comme les postes électriques, sous-stations ou réseaux de chaleur, provoquant pannes, courts-circuits et interruptions de service. Les opérations de réparation peuvent s'avérer très complexes. Ces dysfonctionnements ont des effets en cascade sur d'autres services essentiels, tels que l'eau, l'assainissement, les transports et les bâtiments.",
                data: null
            },
            {
                title: "Perturbation économique",
                icon: "&#x1F4BC;",
                desc: "Interruption des activités économiques, pertes pour les commerces et entreprises, coûts de réparation.",
                data: null
            },
            {
                title: "Perturbation services publics",
                icon: "&#x1F3E5;",
                desc: "Écoles, hôpitaux, services administratifs peuvent être inaccessibles ou dysfonctionnels.",
                data: null
            },
            {
                title: "Saturation assainissement",
                icon: "&#x1F6B0;",
                desc: "Les réseaux d'assainissement peuvent être saturés lors d'événements pluvieux intenses.",
                data: { label: "Jours précip. extrêmes", ref: 3, "2030": 4, "2050": 5, "2100": 6 }
            },
            {
                title: "Risques sanitaires",
                icon: "&#x26A0;",
                desc: "Pollution des eaux, risques de contamination, problèmes d'hygiène post-inondation.",
                data: null
            },
            {
                title: "Gestion de crise",
                icon: "&#x1F6A8;",
                desc: "Nécessité d'évacuation de populations, mobilisation des services d'urgence, hébergement temporaire.",
                data: null
            }
        ]
    },
    eau: {
        title: "Raréfaction de l'eau",
        color: "#06b6d4",
        icon: "&#x1F4A7;",
        impacts: [
            {
                title: "Tension approvisionnement",
                icon: "&#x1F6B0;",
                desc: "Difficultés croissantes pour assurer l'approvisionnement en eau potable en période de sécheresse.",
                data: { label: "Jours de sécheresse", ref: 23, "2030": 28, "2050": 32, "2100": 38 }
            },
            {
                title: "Risque sanitaire",
                icon: "&#x1F9EA;",
                desc: "Dégradation de la qualité sanitaire de la ressource en eau avec le développement de microbes et l'augmentation de la concentration en polluants.",
                data: null
            },
            {
                title: "Baisse des nappes",
                icon: "&#x2B07;",
                desc: "Les nappes phréatiques se rechargent moins, affectant les réserves stratégiques.",
                data: null
            },
            {
                title: "Effets dominos",
                icon: "&#x1F4A5;",
                desc: "Un dysfonctionnement des réseaux d'eau peut générer des effets domino sur de nombreux systèmes urbains interdépendants, notamment les réseaux énergétiques (réseau de froid, production électrique), les espaces verts, les dispositifs de rafraîchissement de l'espace public (fontaines, brumisateurs), les bâtiments et leurs usagers (climatisation, hygiène), l'alimentation des lacs et rivières, la navigation, les écosystèmes ainsi que certains services essentiels comme la santé, la lutte contre les incendies ou l'assainissement.",
                data: null
            },
            {
                title: "Conflits d'usages",
                icon: "&#x1F91D;",
                desc: "La raréfaction de l'eau entraîne une compétition accrue entre les usages – eau potable, arrosage des espaces verts, loisirs, industries, systèmes énergétiques, agriculture etc. – renforçant les tensions sur la gestion de la ressource. En cas de raréfaction, l'utilisation des eaux souterraines peut générer des conflits entre les besoins urbains, agricoles et environnementaux. Le réseau d'eau non potable présente une vulnérabilité élevée, car il n'est pas considéré comme prioritaire en période de tension.",
                data: null
            }
        ]
    },
    biodiversite: {
        title: "Altération biodiversité",
        color: "#22c55e",
        icon: "&#x1F33F;",
        impacts: [
            {
                title: "Mortalité des espèces",
                icon: "&#x1F3F4;",
                desc: "Augmentation des espèces malades ou mourant à cause du stress thermique et hydrique.",
                data: null
            },
            {
                title: "Espèces invasives",
                icon: "&#x1F41C;",
                desc: "Prolifération d'espèces invasives et de ravageurs favorisés par le réchauffement.",
                data: null
            },
            {
                title: "Déséquilibre des milieux aquatiques",
                icon: "&#x1F41F;",
                desc: "Dégradation de la qualité de l'eau de la Seine, des canaux et des plans d'eau des Parcs et Jardins, augmentation de la température de l'eau, oxygénation, dégradation de l'habitat de certaines espèces etc.",
                data: null
            },
            {
                title: "Dégradation des habitats",
                icon: "&#x1F3DE;",
                desc: "Fragmentation des habitats naturels impactant les déplacements et les lieux de reproduction, diminution des ressources alimentaires, augmentation des pollutions.",
                data: null
            },
            {
                title: "Perte services écosystémiques",
                icon: "&#x1F343;",
                desc: "Diminution des services rendus par la nature : rafraîchissement, régulation, pollinisation.",
                data: null
            }
        ]
    }
};

// ============================================
// DATA - Trajectoire tendancielle
// ============================================

const trajectoiresData = {
    surchauffe: {
        title: "Trajectoire face à la surchauffe",
        color: "#ef4444",
        icon: "&#x1F321;",
        risques: [
            { horizon: "2030", niveau: 2, label: "Canicules plus fréquentes" },
            { horizon: "2050", niveau: 3, label: "Canicules intenses et longues" },
            { horizon: "2100", niveau: 4, label: "Étés caniculaires chroniques" }
        ],
        actionsDatées: [
            // 2026
            { shortName: "40 000 m² de toitures réfléchissantes", fullName: "Poser une peinture réfléchissante sur 40 000 m² de toitures pour les établissements accueillant du public", horizon: "2026", type: "gris" },
            { shortName: "3 forêts urbaines créées", fullName: "Créer 3 forêts urbaines", horizon: "2026", type: "vert" },
            // 2030
            { shortName: "Protections solaires 100% bâtiments sensibles", fullName: "Équiper 100 % des bâtiments municipaux sensibles de protections solaires", horizon: "2030", type: "gris" },
            { shortName: "100 % des résidences seniors adaptées", fullName: "Rénover et adapter à la chaleur 100 % des résidences senior du CASVP", horizon: "2030", type: "gris" },
            { shortName: "100% des crèches et écoles adaptées", fullName: "Protéger 100 % des crèches et écoles de la chaleur", horizon: "2030", type: "gris" },
            { shortName: "Cours Oasis généralisées", fullName: "Cours Oasis dans toutes les crèches, écoles et collèges", horizon: "2030", type: "vert" },
            { shortName: "Espaces refuge dans les crèches et écoles", fullName: "Créer des espaces de refuge contre la chaleur dans les crèches et écoles", horizon: "2030", type: "gris" },
            { shortName: "1 000 toits anti-surchauffe", fullName: "Développer un programme « 1 000 toits anti surchauffe »", horizon: "2030", type: "gris" },
            { shortName: "170 000 arbres plantés", fullName: "Planter 170 000 arbres", horizon: "2030", type: "vert" },
            { shortName: "Ombrages dans l'espace public renforcés", fullName: "Renforcer les dispositifs d'ombrage artificiel dans l'espace public", horizon: "2030", type: "gris" },
            { shortName: "120 fontaines brumisantes", fullName: "Installer 120 nouvelles fontaines brumisantes", horizon: "2030", type: "bleu" },
            { shortName: "Observatoire thermique pour l'ICU", fullName: "Développer un observatoire thermique pour modéliser l'îlot de chaleur urbain", horizon: "2030", type: "orga" },
            // 2040
            { shortName: "+300 ha d'espaces verts", fullName: "Ouvrir au public 300 ha d'espaces verts supplémentaires", horizon: "2040", type: "vert" },
            { shortName: "20 % de végétation minimum dans les secteurs déficitaires", fullName: "Végétaliser prioritairement les secteurs déficitaires pour atteindre 20 % de végétation minimum", horizon: "2040", type: "vert" },
            { shortName: "10 nouveaux parcs urbains", fullName: "Créer 10 parcs urbains dans les opérations d'aménagement", horizon: "2040", type: "vert" },
            { shortName: "Réseau électrique résilient", fullName: "Investissements d'Enedis dans la résilience du réseau aux fortes chaleurs", horizon: "2040", type: "gris" },
            // 2050
            { shortName: "100% toits frais équipements municipaux", fullName: "Atteindre 100 % de toits frais pour les équipements municipaux", horizon: "2050", type: "gris" },
            { shortName: "40 % du territoire désimperméabilisé", fullName: "40 % du territoire désimperméabilisé", horizon: "2050", type: "gris" },
            { shortName: "Communication canicule renforcée", fullName: "Renforcer la communication de la Ville en cas de canicule", horizon: "2050", type: "orga" }
        ],
        actionsSansÉchéance: [
            { shortName: "Ouvrir les piscines et les parcs", fullName: "Ouvrir une vingtaine de grands parcs parisiens toute la nuit & adapter les horaires des piscines", type: "orga" },
            { shortName: "Programme Copr'Oasis", fullName: "Développer le programme Copr'Oasis", type: "gris" },
            { shortName: "Stores, brasseurs d'air etc.", fullName: "Solutions légères de rafraîchissement du bâti (stores, brasseurs d'air)", type: "gris" },
            { shortName: "Plan Canicule", fullName: "Plan Canicule", type: "orga" },
            { shortName: "Exercice de crise", fullName: "Exercices de simulation de canicule et ses répercussions : coupures électriques etc.", type: "orga" },
            { shortName: "Changements de pratique", fullName: "Changements de pratiques plus ou moins planifiés pour faire face : école dehors, climatiseurs mobiles etc.", type: "orga" }
        ]
    },
    inondations: {
        title: "Trajectoire face aux inondations",
        color: "#3b82f6",
        icon: "&#x1F30A;",
        risques: [
            { horizon: "2030", niveau: 2, label: "Crues et ruissellement accrus" },
            { horizon: "2050", niveau: 3, label: "Événements pluvieux intenses" },
            { horizon: "2100", niveau: 4, label: "Risque inondation majeur" }
        ],
        actionsDatées: [
            // 2030
            { shortName: "30 % de surfaces non imperméabilisées", fullName: "Atteindre 30 % de surfaces non imperméabilisées", horizon: "2030", type: "gris" },
            { shortName: "Déconnecter 5 % des surfaces des égouts", fullName: "Déconnecter 5 % des surfaces des égouts", horizon: "2030", type: "gris" },
            // 2050
            { shortName: "40 % de surfaces non imperméabilisées", fullName: "Atteindre 40 % de surfaces non imperméabilisées", horizon: "2050", type: "gris" },
            { shortName: "Déconnecter 15 % des surfaces des égouts", fullName: "Déconnecter 15 % des surfaces des égouts", horizon: "2050", type: "gris" }
        ],
        actionsSansÉchéance: [
            { shortName: "Application du PPRI et du PLUb", fullName: "Suivi des dispositions du PPRI et du PLUb", type: "orga" },
            { shortName: "Sécurisation des quais de Seine", fullName: "Fermeture et sécurisation des quais bas en cas de crue", type: "orga" },
            { shortName: "Protections amovibles", fullName: "Mise en place de protections amovibles types batardeau ou murettes anti-crue", type: "orga" },
            { shortName: "Sensibilisation aux risques", fullName: "Actions de sensibilisation aux bons gestes", type: "orga" },
            { shortName: "Exercices de gestion de crise", fullName: "Exercices de crise", type: "orga" },
            { shortName: "Gestion des crues (EPTB SGL)", fullName: "Actions de soutien d'étiage et de gestion des crues grâce aux 4 grands lacs-réservoirs de l'EPTB Seine Grands Lacs", type: "bleu" },
            { shortName: "Surveillance du niveau de l'eau", fullName: "Pour les crues, 80 stations permettant de suivre les variations des hauteurs d'eau sur la Seine et sur ses affluents", type: "orga" }
        ]
    },
    biodiversite: {
        title: "Trajectoire face à l'altération de la biodiversité",
        color: "#22c55e",
        icon: "&#x1F33F;",
        risques: [
            { horizon: "2030", niveau: 2, label: "Stress des espèces" },
            { horizon: "2050", niveau: 3, label: "Disparition d'espèces locales" },
            { horizon: "2100", niveau: 4, label: "Écosystèmes dégradés" }
        ],
        actionsDatées: [
            // 2030
            { shortName: "Réseau de haies renforcé", fullName: "Augmenter les linéaires de haies afin d'atteindre 500 m à plusieurs km par arrondissement", horizon: "2030", type: "vert" },
            { shortName: "40 espaces refuges de biodiversité", fullName: "Créer 40 nouveaux espaces refuges de biodiversité sur l'espace public", horizon: "2030", type: "vert" },
            { shortName: "30 % de surfaces non imperméabilisées et végétalisées", fullName: "30 % de surface non imperméabilisées et végétalisées", horizon: "2030", type: "vert" },
            { shortName: "20 nouvelles zones humides", fullName: "Réaliser 20 nouvelles zones humides, notamment dans les parcs et jardins de moins d'un hectare qui n'en disposent pas avec un maillage de 250 m et avec une palette végétale composée de 100% d'espèces régionales", horizon: "2030", type: "bleu" }
        ],
        actionsSansÉchéance: [
            { shortName: "Renaturation des bois parisiens", fullName: "Poursuivre la renaturation du bois de Vincennes et du Bois de Boulogne", type: "vert" },
            { shortName: "Essences d'arbres résilientes", fullName: "Choix des essences d'arbres adaptées aux chaleurs et au piétinement", type: "orga" }
        ]
    },
    eau: {
        title: "Trajectoire face à la raréfaction de l'eau",
        color: "#06b6d4",
        icon: "&#x1F4A7;",
        risques: [
            { horizon: "2030", niveau: 2, label: "Tensions ponctuelles" },
            { horizon: "2050", niveau: 3, label: "Stress hydrique fréquent" },
            { horizon: "2100", niveau: 4, label: "Pénurie récurrente" }
        ],
        actionsDatées: [
            // 2030
            { shortName: "–15 % de prélèvements en eau", fullName: "Réduire les prélèvements en eau de 15 %", horizon: "2030", type: "bleu" },
            // 2050
            { shortName: "40 % du territoire désimperméabilisé", fullName: "40 % du territoire désimperméabilisé via des opérations de débitumisation", horizon: "2050", type: "vert" }
        ],
        actionsSansÉchéance: [
            { shortName: "Réduction des fuites réseau", fullName: "Réduire les fuites sur le réseau d'eau potable", type: "orga" },
            { shortName: "Optimisation de l'eau non potable", fullName: "Réduire de 20 % les prélèvements d'eau non potable", type: "orga" },
            { shortName: "Qualité de l'eau et baignade", fullName: "Améliorer la qualité de l'eau de la Seine et permettre la baignade", type: "bleu" },
            { shortName: "Récupération d'eau de pluie", fullName: "Déployer des récupérateurs d'eau de pluie dans les équipements municipaux", type: "orga" },
            { shortName: "Sobriété en eau potable", fullName: "Favoriser l'eau de pluie et l'eau non potable pour l'arrosage", type: "orga" },
            { shortName: "Gestion étiage et crues", fullName: "Actions de soutien d'étiage et de gestion des crues par l'EPTB Seine Grands Lacs", type: "bleu" },
            { shortName: "Paiements pour services environnementaux", fullName: "Actions préventives de paiement pour services environnementaux sur les aires de captages par Eau de Paris", type: "orga" }
        ]
    }
};

const contraintesData = [
    {
        id: "techniques",
        title: "Contraintes techniques / connaissance",
        icon: "&#x1F527;",
        color: "#6366f1",
        items: [
            "Absence d'indicateur sur l'habitabilité du bâti existant",
            "Manque de maîtrise de certaines solutions techniques pour le confort d'été encore peu déployables",
            "Contraintes associées aux réhabilitations et le tout ou rien quand il est difficile d'intervenir (par exemple sur une verrière)"
        ]
    },
    {
        id: "financieres",
        title: "Financement et besoins humains",
        icon: "&#x1F4B0;",
        color: "#f59e0b",
        items: [
            "Incertitudes sur la continuité stratégique et financière de certains dispositifs comme ERP+",
            "Besoins humains insuffisants pour la rénovation de l'ensemble du parc"
        ]
    },
    {
        id: "coordination",
        title: "Coordination interne et externe",
        icon: "&#x1F91D;",
        color: "#14b8a6",
        items: [
            "Enjeux patrimoniaux (ABF) quand façade extérieure pour confort d'été par exemple avec les stores",
            "Temporalité longue et complexité des projets de rénovation globale : dialogue, démographie, études travaux",
            "Marché : disponibilité des matériaux, manque d'attractivité des marchés publics de la Ville"
        ]
    },
    {
        id: "pratiques",
        title: "Contraintes de pratiques",
        icon: "&#x1F3EB;",
        color: "#ec4899",
        items: [
            "Le « rythme » de l'école, dans lequel à chaque classe d'élèves correspond une classe / pièce dédiée, freine le recours aux classes plus fraîches"
        ]
    }
];

const besoinsData = [
    {
        id: "connaissances",
        title: "Renforcement des connaissances",
        icon: "&#x1F52C;",
        color: "#8b5cf6",
        items: [
            "Inondations par ruissellement",
            "Pratiques d'adaptation dans un bati en surchauffe"
        ]
    },
    {
        id: "planification",
        title: "Strategies et planification",
        icon: "&#x1F3D7;",
        color: "#f97316",
        items: [
            "Strategie d'adaptation du patrimoine bati (dont doctrine climatisation)",
            "Strategie de gestion de la ressource en eau a moyen/long terme",
            "Adaptation de l'espace public et enjeux d'ombrage"
        ]
    },
    {
        id: "crises",
        title: "Preparation aux crises",
        icon: "&#x1F6A8;",
        color: "#ef4444",
        items: [
            "Strategie de communication et sensibilisation (population, agents)",
            "Developpement d'espaces refuges"
        ]
    }
];

const impactsVille = [
    {
        title: "Augmentation des couts",
        icon: "&#x1F4B0;",
        desc: "Prise en charge des populations vulnerables, hausse des depenses energetiques, astreintes d'agents, dommages materiels, mesures de protection et reparation, assurances.",
        color: "#f59e0b"
    },
    {
        title: "Perturbation des services",
        icon: "&#x1F3DB;",
        desc: "Infrastructures et bati endommages, perturbation de l'accueil des enfants, EHPAD, sante au travail des agents en exterieur, espace public dangereux.",
        color: "#ef4444"
    },
    {
        title: "Tensions ressources critiques",
        icon: "&#x1F4E6;",
        desc: "Tensions sur l'eau, l'energie, l'alimentation et leurs logistiques d'approvisionnement.",
        color: "#3b82f6"
    },
    {
        title: "Effet ciseau des crises",
        icon: "&#x1F4C9;",
        desc: "Baisse des recettes simultanee a l'augmentation des depenses lors des evenements climatiques.",
        color: "#a855f7"
    }
];

// ============================================
// STATE
// ============================================

let currentScenario = "2030";
let currentTab = "aleas";
let isPedagogyMode = false;
let chart = null;
let currentChart = "tropical";
let tippingVersion = 'A';
let currentThreat = "surchauffe";

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    selectScenario(currentScenario);
    initChart();
    renderIndicators();
    renderCityComparison();
    renderTippingPoints();
    renderGlobalImpacts();
    renderImpactsTab();
    renderTrajectoireTab();
});

// ============================================
// TAB NAVIGATION
// ============================================

function switchTab(tabId) {
    currentTab = tabId;

    // Update tab buttons
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabId}`);
    });
}

// ============================================
// PEDAGOGY MODE (Mode pedagogique = explications detaillees)
// ============================================

function togglePedagogyMode() {
    isPedagogyMode = !isPedagogyMode;
    document.body.classList.toggle('pedagogy-mode', isPedagogyMode);

    const btn = document.getElementById('pedagogy-btn');
    if (btn) {
        btn.classList.toggle('active', isPedagogyMode);
    }

    // Elements a masquer/afficher
    const mainNav = document.querySelector('.main-nav');
    const sidebar = document.querySelector('.sidebar');
    const tabContents = document.querySelectorAll('.tab-content');
    const pedagogyView = document.getElementById('pedagogy-view');

    if (isPedagogyMode) {
        // Masquer la navigation et les onglets normaux
        if (mainNav) mainNav.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
        tabContents.forEach(tab => tab.style.display = 'none');

        // Afficher la vue pedagogique
        if (pedagogyView) {
            pedagogyView.style.display = 'block';
            // Animation d'apparition
            pedagogyView.style.opacity = '0';
            pedagogyView.style.transform = 'translateY(20px)';
            setTimeout(() => {
                pedagogyView.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                pedagogyView.style.opacity = '1';
                pedagogyView.style.transform = 'translateY(0)';
            }, 10);
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } else {
        // Restaurer la navigation et les onglets
        if (mainNav) mainNav.style.display = '';
        if (sidebar) sidebar.style.display = '';

        // Masquer la vue pedagogique
        if (pedagogyView) pedagogyView.style.display = 'none';

        // IMPORTANT: Supprimer les styles inline sur les tab-content
        // pour que les classes CSS reprennent le controle
        tabContents.forEach(tab => {
            tab.style.display = '';
        });

        // Restaurer l'onglet actif
        const activeTab = document.querySelector('.nav-tab.active');
        if (activeTab) {
            const tabId = activeTab.getAttribute('data-tab');
            switchTab(tabId);
        } else {
            // Par defaut, afficher le premier onglet
            switchTab('aleas');
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ============================================
// SCENARIO SELECTOR
// ============================================

function selectScenario(id) {
    currentScenario = id;

    // Update scenario buttons
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.scenario === id);
    });

    // Update all dynamic sections
    renderIndicators();
    renderCityComparison();
    renderTippingPoints();
    renderGlobalImpacts();
    renderImpactsList();
    renderParisMapIcons();

    if (chart) updateChart();
}

// ============================================
// INDICATORS RENDERING
// ============================================

function renderIndicators() {
    const s = scenarios[currentScenario];
    const ref = scenarios.ref;

    const categories = [
        {
            title: "Indicateurs d'extrêmes climatiques",
            subtitle: "Événements météorologiques intenses",
            indicators: [
                { key: 'days30', label: 'Jours > 30°C', value: s.days30, color: '#f97316' },
                { key: 'days35', label: 'Jours > 35°C', value: s.days35, color: '#dc2626' },
                { key: 'tropicalNights', label: 'Nuits tropicales', value: s.tropicalNights, color: '#ef4444' },
                { key: 'maxTemp', label: 'Temp. max record', value: s.maxTemp, unit: '°C', color: '#991b1b' },
                { key: 'fireRisk', label: 'Risque incendie', value: s.fireRisk, color: '#ea580c' }
            ]
        },
        {
            title: "Confort thermique des bâtiments",
            subtitle: "Évolution des besoins énergétiques",
            indicators: [
                { key: 'cooling', label: 'Besoin climatisation', value: s.cooling, unit: 'DJ', color: '#0ea5e9' },
                { key: 'heating', label: 'Besoin chauffage', value: s.heating, unit: 'DJ', color: '#f59e0b' }
            ]
        }
    ];

    const container = document.getElementById('indicators-section');
    if (!container) return;

    let html = '';

    // Encadré "Climat moyen" pour les scénarios futurs
    if (currentScenario !== 'ref') {
        const avgTempChange = (s.avgTemp - ref.avgTemp).toFixed(1);
        const avgSummerChange = (s.avgSummer - ref.avgSummer).toFixed(0);
        const avgWinterChange = (s.avgWinter - ref.avgWinter).toFixed(0);
        const frostChange = ((s.frostDays - ref.frostDays) / ref.frostDays * 100).toFixed(0);

        html += `
            <div class="indicator-category climat-moyen-category" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.02)); border-left: 4px solid #3b82f6;">
                <h3 class="indicator-category-title" style="color: #3b82f6;">Climat moyen à ${s.temp}</h3>
                <p class="indicator-category-subtitle">Évolution des moyennes climatiques par rapport à la période de référence</p>
                <div class="indicators-grid">
                    <div class="indicator-card">
                        <div class="indicator-value" style="color: #ef4444">${s.avgTemp}°C</div>
                        <div class="indicator-label">Température moyenne</div>
                        <span class="indicator-change up">+${avgTempChange}°C</span>
                    </div>
                    <div class="indicator-card">
                        <div class="indicator-value" style="color: #f97316">${s.avgSummer}°C</div>
                        <div class="indicator-label">Moyenne été</div>
                        <span class="indicator-change up">+${avgSummerChange}°C</span>
                    </div>
                    <div class="indicator-card">
                        <div class="indicator-value" style="color: #3b82f6">${s.avgWinter}°C</div>
                        <div class="indicator-label">Moyenne hiver</div>
                        <span class="indicator-change up">+${avgWinterChange}°C</span>
                    </div>
                    <div class="indicator-card">
                        <div class="indicator-value" style="color: #06b6d4">${s.summerRain} mm</div>
                        <div class="indicator-label">Pluie été</div>
                    </div>
                    <div class="indicator-card">
                        <div class="indicator-value" style="color: #6366f1">${s.winterRain} mm</div>
                        <div class="indicator-label">Pluie hiver</div>
                    </div>
                    <div class="indicator-card">
                        <div class="indicator-value" style="color: #0ea5e9">${s.frostDays}</div>
                        <div class="indicator-label">Jours de gel</div>
                        <span class="indicator-change down">${frostChange}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    categories.forEach(cat => {
        html += `
            <div class="indicator-category">
                <h3 class="indicator-category-title">${cat.title}</h3>
                <p class="indicator-category-subtitle">${cat.subtitle}</p>
                <div class="indicators-grid">
        `;

        cat.indicators.forEach(ind => {
            const def = indicatorDefinitions[ind.key];
            const refVal = ref[ind.key];
            const change = refVal !== 0 ? ((ind.value - refVal) / refVal * 100) : 0;
            const decreaseIsGood = ['frostDays', 'heating'].includes(ind.key);
            const changeClass = decreaseIsGood ? (change < 0 ? 'down' : 'up') : (change > 0 ? 'up' : 'down');
            const changeSign = change > 0 ? '+' : '';
            const displayValue = ind.value < 10 ? ind.value.toFixed(1) : Math.round(ind.value);
            const unit = ind.unit || '/an';

            // Build rich tooltip
            let tooltip = def ? def.definition : '';
            if (def && def.intervals && def.intervals[currentScenario]) {
                const interval = def.intervals[currentScenario];
                tooltip += ` | Intervalle de confiance: ${interval[0]} - ${interval[1]}`;
            }
            if (currentScenario !== 'ref') {
                tooltip += ` | Reference: ${refVal}`;
            }

            html += `
                <div class="indicator-card" data-tooltip="${tooltip}">
                    <div class="indicator-value" style="color: ${ind.color}">${displayValue}</div>
                    <div class="indicator-unit">${unit}</div>
                    <div class="indicator-label">${ind.label}</div>
                    ${currentScenario !== 'ref' ? `<span class="indicator-change ${changeClass}">${changeSign}${change.toFixed(0)}%</span>` : ''}
                </div>
            `;
        });

        html += '</div></div>';
    });

    // ICU Focus for tropical nights
    if (currentScenario !== 'ref') {
        const icuValue = s.tropicalNightsICU;
        const normalValue = s.tropicalNights;
        html += `
            <div class="indicator-category" style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(139, 92, 246, 0.02)); border-left: 4px solid #7c3aed;">
                <h3 class="indicator-category-title" style="color: #7c3aed;">Focus : Effet ilot de chaleur urbain (ICU)</h3>
                <p class="indicator-category-subtitle">Les nuits tropicales sont amplifiees en ville par l'effet d'ilot de chaleur</p>
                <div class="indicators-grid" style="justify-content: center;">
                    <div class="indicator-card">
                        <div class="indicator-value">${normalValue}</div>
                        <div class="indicator-label">Nuits tropicales<br><small>Sans effet ICU</small></div>
                    </div>
                    <div class="indicator-card" style="background: linear-gradient(135deg, #7c3aed, #a855f7); color: white;">
                        <div class="indicator-value" style="color: white;">${icuValue}</div>
                        <div class="indicator-label" style="color: rgba(255,255,255,0.9);">Nuits tropicales<br><small>Avec effet ICU</small></div>
                    </div>
                    <div class="indicator-card">
                        <div class="indicator-value" style="color: #ef4444;">+${icuValue - normalValue}</div>
                        <div class="indicator-label">Nuits supplementaires<br><small>dues a l'ICU</small></div>
                    </div>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

// ============================================
// CITY COMPARISON
// ============================================

function renderCityComparison() {
    const analogue = cityAnalogues[currentScenario];
    const paris = cityAnalogues.ref;
    const container = document.getElementById('city-comparison');
    if (!container) return;

    let html = '';

    if (currentScenario === 'ref') {
        html = `
            <div class="city-card highlight">
                <div class="city-name">${paris.city}</div>
                <div class="city-temp">${paris.temp}</div>
            </div>
            <p class="equivalence-desc">${paris.desc}</p>
        `;
    } else {
        html = `
            <div class="city-card">
                <div class="city-name">${paris.city}</div>
                <div class="city-temp" style="color: var(--color-ref);">${paris.temp}</div>
                <div class="city-label">Aujourd'hui</div>
            </div>
            <div class="city-arrow">&rarr;</div>
            <div class="city-card highlight">
                <div class="city-name">${analogue.city}</div>
                <div class="city-temp">${analogue.temp}</div>
                <div class="city-label">Climat futur de Paris</div>
            </div>
            <p class="equivalence-desc" style="width: 100%;">${analogue.desc}</p>
        `;
    }

    container.innerHTML = html;
}

// ============================================
// CHART
// ============================================

function initChart() {
    const canvas = document.getElementById('mainChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: getChartData(),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { color: '#666666' }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { color: '#666666' }
                }
            }
        }
    });
}

function getChartData() {
    const labels = ['Reference', '+2°C (2030)', '+2,7°C (2050)', '+4°C (2100)'];
    const keys = ['ref', '2030', '2050', '2100'];

    const dataMap = {
        tropical: { data: keys.map(k => scenarios[k].tropicalNights), color: '#ef4444', label: 'Nuits tropicales' },
        hot30: { data: keys.map(k => scenarios[k].days30), color: '#f97316', label: 'Jours > 30°C' },
        hot35: { data: keys.map(k => scenarios[k].days35), color: '#dc2626', label: 'Jours > 35°C' },
        cooling: { data: keys.map(k => scenarios[k].cooling), color: '#0ea5e9', label: 'Besoin climatisation (DJ)' }
    };

    const d = dataMap[currentChart];
    const currentIdx = keys.indexOf(currentScenario);

    return {
        labels,
        datasets: [{
            data: d.data,
            borderColor: d.color,
            backgroundColor: d.color + '15',
            fill: true,
            tension: 0.4,
            pointRadius: labels.map((_, i) => i === currentIdx ? 10 : 5),
            pointBackgroundColor: labels.map((_, i) => i === currentIdx ? d.color : '#fff'),
            pointBorderColor: d.color,
            pointBorderWidth: 2
        }]
    };
}

function changeChart(type) {
    currentChart = type;
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.toggle('active', t.dataset.chart === type));
    updateChart();
}

function updateChart() {
    if (!chart) return;
    chart.data = getChartData();
    chart.update();
}

// ============================================
// TIPPING POINTS
// ============================================

function switchTippingVersion(version) {
    tippingVersion = version;
    document.querySelectorAll('.tipping-toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.version === version);
    });
    renderTippingPoints();
}

function renderTippingPoints() {
    const container = document.getElementById('tipping-grid');
    if (!container) return;

    if (tippingVersion === 'A') {
        renderTippingPointsVersionA(container);
    } else {
        renderTippingPointsVersionB(container);
    }
}

function renderTippingPointsVersionA(container) {
    const currentTemp = scenarios[currentScenario].tempNum;

    // Count triggered tipping points
    const triggeredCount = tippingPointsVersionA.filter(tp => currentTemp >= tp.thresholdMin).length;

    let html = `
        <div class="tipping-threshold-chart">
            <div class="tipping-explanation">
                <p><strong>Comment lire ce graphique :</strong> Chaque barre coloree represente la plage de temperature a laquelle un point de bascule peut etre declenche. La ligne blanche indique le scenario selectionne (${scenarios[currentScenario].temp}).</p>
            </div>
            <div class="threshold-scale-container">
                <div class="threshold-scale">
                    <div class="current-temp-marker" style="left: ${(currentTemp / 4) * 100}%">
                        <span class="current-temp-label">${scenarios[currentScenario].temp}</span>
                    </div>
                </div>
                <div class="threshold-axis">
                    <span class="axis-label" style="left: 0%">0°C</span>
                    <span class="axis-label" style="left: 25%">+1°C</span>
                    <span class="axis-label" style="left: 50%">+2°C</span>
                    <span class="axis-label" style="left: 75%">+3°C</span>
                    <span class="axis-label" style="left: 100%">+4°C</span>
                </div>
            </div>
            <div class="tipping-rows-header">
                <span>Point de bascule</span>
                <span>Plage de declenchement</span>
                <span>Seuil</span>
            </div>
            <div class="tipping-rows">
    `;

    tippingPointsVersionA.forEach(tp => {
        const leftPos = (tp.thresholdMin / 4) * 100;
        const width = ((tp.thresholdMax - tp.thresholdMin) / 4) * 100;
        const isTriggered = currentTemp >= tp.thresholdMin;

        html += `
                <div class="tipping-row ${isTriggered ? 'row-triggered' : ''}" title="${tp.desc}">
                    <div class="tipping-row-label">
                        <span class="tipping-row-icon">${tp.icon}</span>
                        <div class="tipping-row-info">
                            <span class="tipping-row-title">${tp.title}</span>
                            <span class="tipping-row-desc">${tp.desc}</span>
                        </div>
                    </div>
                    <div class="tipping-row-bar">
                        <div class="tipping-range ${isTriggered ? 'triggered' : ''}"
                             style="left: ${leftPos}%; width: ${width}%; background: ${tp.color}">
                        </div>
                    </div>
                    <span class="tipping-range-label ${isTriggered ? 'label-triggered' : ''}">${tp.thresholdMin}-${tp.thresholdMax}°C</span>
                </div>
        `;
    });

    html += `
            </div>
            <div class="tipping-summary">
                <div class="tipping-stat">
                    <span class="tipping-stat-value">${triggeredCount}</span>
                    <span class="tipping-stat-label">sur ${tippingPointsVersionA.length} points de bascule potentiellement atteints a ${scenarios[currentScenario].temp}</span>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

function renderTippingPointsVersionB(container) {
    const currentTemp = scenarios[currentScenario].tempNum;

    // Count triggered and critical tipping points
    const triggeredCount = tippingPointsVersionB.filter(tp => currentTemp >= tp.thresholdMin).length;
    const criticalCount = tippingPointsVersionB.filter(tp => currentTemp >= tp.thresholdMax).length;

    const worldMapSVG = `
        <svg viewBox="0 0 1000 500" class="world-map-svg">
            <defs>
                <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#1e3a5f"/>
                    <stop offset="100%" style="stop-color:#0f172a"/>
                </linearGradient>
            </defs>
            <rect width="1000" height="500" fill="url(#oceanGradient)"/>
            <g stroke="rgba(255,255,255,0.1)" stroke-width="0.5">
                <line x1="0" y1="125" x2="1000" y2="125"/>
                <line x1="0" y1="250" x2="1000" y2="250"/>
                <line x1="0" y1="375" x2="1000" y2="375"/>
                <line x1="250" y1="0" x2="250" y2="500"/>
                <line x1="500" y1="0" x2="500" y2="500"/>
                <line x1="750" y1="0" x2="750" y2="500"/>
            </g>
            <g fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1">
                <path d="M50,80 L180,60 L220,100 L250,80 L270,120 L250,180 L200,200 L180,280 L120,280 L100,240 L60,200 L50,140 Z"/>
                <path d="M180,280 L220,290 L260,320 L280,400 L260,450 L220,460 L180,420 L160,350 L170,300 Z"/>
                <path d="M420,80 L500,60 L540,80 L560,120 L540,160 L480,180 L440,160 L420,120 Z"/>
                <path d="M420,180 L500,180 L560,220 L580,300 L540,380 L480,400 L420,380 L400,300 L420,220 Z"/>
                <path d="M560,60 L700,40 L850,60 L900,100 L920,180 L880,240 L800,260 L720,280 L640,260 L580,220 L560,160 L540,100 Z"/>
                <path d="M780,360 L880,340 L920,380 L900,440 L820,460 L760,420 L780,380 Z"/>
                <path d="M320,30 L400,20 L420,60 L400,100 L340,100 L310,60 Z"/>
                <path d="M100,480 L400,470 L600,475 L900,480 L850,500 L150,500 Z"/>
            </g>
        </svg>
    `;

    let html = `
        <div class="tipping-map-container">
            <div class="tipping-explanation">
                <p><strong>Comment lire cette carte :</strong> Chaque point represente un systeme climatique majeur pouvant basculer de maniere irreversible. Les points s'animent lorsque le scenario selectionne atteint leur seuil de declenchement.</p>
            </div>
            <div class="world-map">
                ${worldMapSVG}
                <div class="map-overlay">
    `;

    tippingPointsVersionB.forEach(tp => {
        const isTriggered = currentTemp >= tp.thresholdMin;
        const isPastMax = currentTemp >= tp.thresholdMax;
        const statusClass = isPastMax ? 'critical' : (isTriggered ? 'triggered' : 'safe');

        html += `
            <div class="map-point ${statusClass}" style="left: ${tp.x}%; top: ${tp.y}%;">
                <span class="map-point-icon">${tp.icon}</span>
                <div class="map-point-pulse"></div>
            </div>
        `;
    });

    html += `
                </div>
            </div>
            <div class="map-info-bar">
                <div>Scenario: <strong style="color: ${scenarios[currentScenario].color}">${scenarios[currentScenario].temp}</strong></div>
                <div class="map-legend">
                    <div class="map-legend-item"><span class="map-legend-dot safe"></span> Non atteint</div>
                    <div class="map-legend-item"><span class="map-legend-dot triggered"></span> Seuil atteint</div>
                    <div class="map-legend-item"><span class="map-legend-dot critical"></span> Zone critique</div>
                </div>
            </div>
            <div class="map-points-list">
                <h4>Points de bascule sur la carte :</h4>
                <div class="map-points-grid">
    `;

    tippingPointsVersionB.forEach(tp => {
        const isTriggered = currentTemp >= tp.thresholdMin;
        const isPastMax = currentTemp >= tp.thresholdMax;
        const statusClass = isPastMax ? 'critical' : (isTriggered ? 'triggered' : 'safe');

        html += `
                    <div class="map-point-item ${statusClass}">
                        <span class="map-point-item-icon">${tp.icon}</span>
                        <div class="map-point-item-info">
                            <span class="map-point-item-title">${tp.title}</span>
                            <span class="map-point-item-desc">${tp.desc}</span>
                        </div>
                        <span class="map-point-item-threshold">${tp.thresholdMin}-${tp.thresholdMax}°C</span>
                    </div>
        `;
    });

    html += `
                </div>
            </div>
            <div class="tipping-summary">
                <div class="tipping-stat">
                    <span class="tipping-stat-value">${triggeredCount}</span>
                    <span class="tipping-stat-label">sur ${tippingPointsVersionB.length} points de bascule potentiellement atteints a ${scenarios[currentScenario].temp}</span>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ============================================
// GLOBAL IMPACTS
// ============================================

function renderGlobalImpacts() {
    const g = globalImpactsData[currentScenario];
    const container = document.getElementById('global-impacts');
    if (!container) return;

    container.innerHTML = `
        <div class="global-impact">
            <div class="global-impact-value" style="color: #3b82f6">${g.sea}</div>
            <div class="global-impact-label">Niveau mers</div>
        </div>
        <div class="global-impact">
            <div class="global-impact-value" style="color: #ef4444">${g.refugees}</div>
            <div class="global-impact-label">Refugies climatiques</div>
        </div>
        <div class="global-impact">
            <div class="global-impact-value" style="color: #22c55e">${g.species}</div>
            <div class="global-impact-label">Especes</div>
        </div>
        <div class="global-impact">
            <div class="global-impact-value" style="color: #06b6d4">${g.coral}</div>
            <div class="global-impact-label">Coraux</div>
        </div>
        <div class="global-impact">
            <div class="global-impact-value" style="color: #a855f7">${g.arctic}</div>
            <div class="global-impact-label">Arctique</div>
        </div>
    `;
}

// ============================================
// RESOURCE PANEL
// ============================================

function openResource(resourceId) {
    const panel = document.getElementById('resource-panel');
    const title = document.getElementById('resource-title');
    const content = document.getElementById('resource-content');

    // Update sidebar buttons
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.resource === resourceId);
    });

    const resources = {
        sources: {
            title: 'Sources et Methodologie',
            content: `
                <h3>Sources des donnees</h3>
                <p>Les donnees climatiques proviennent de la TRACC 2023 (Trajectoire de rechauffement de reference pour l'adaptation au changement climatique).</p>
                <h3>Plans analyses</h3>
                <ul>
                    <li>Plan National d'Adaptation (PNACC-3)</li>
                    <li>Plan Climat Air Energie Territorial de Paris</li>
                    <li>Strategie de resilience de Paris</li>
                </ul>
                <p class="placeholder-note">Note methodologique complete a venir.</p>
            `
        },
        suivi: {
            title: 'Suivi de la trajectoire',
            content: `
                <h3>Phase actuelle : Construction</h3>
                <p>2025-2026 : Phase de construction de la trajectoire d'adaptation.</p>
                <div class="placeholder-note">Frise chronologique detaillee a venir.</div>
            `
        },
        science: {
            title: 'Que dit la science',
            content: `
                <h3>Paroles de chercheurs</h3>
                <p>Extraits et citations de la communaute scientifique sur les enjeux climatiques parisiens.</p>
                <p class="placeholder-note">Contenu en cours de preparation.</p>
            `
        },
        acteurs: {
            title: 'Acteurs',
            content: `
                <h3>Services de la Ville</h3>
                <p>Cartographie des services municipaux impliques.</p>
                <h3>Acteurs exterieurs</h3>
                <p>Operateurs, gestionnaires, acteurs economiques et institutions.</p>
                <p class="placeholder-note">Cartographies en cours de preparation.</p>
            `
        }
    };

    const resource = resources[resourceId];
    if (resource) {
        title.textContent = resource.title;
        content.innerHTML = resource.content;
        panel.classList.add('open');
    }
}

function closeResource() {
    const panel = document.getElementById('resource-panel');
    panel.classList.remove('open');

    // Deselect sidebar buttons
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// ============================================
// IMPACTS TAB
// ============================================

function selectThreat(threatId) {
    currentThreat = threatId;

    // Update threat buttons
    document.querySelectorAll('.threat-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.threat === threatId);
    });

    renderImpactsList();
}

function renderImpactsTab() {
    const container = document.getElementById('impacts-content');
    if (!container) return;

    // Build scenario selector (same as in Aléas tab)
    let html = `
        <div class="scenario-section">
            <label class="scenario-label">Scenario de rechauffement :</label>
            <div class="scenario-selector impacts-scenario-selector">
                <button class="scenario-btn ${currentScenario === 'ref' ? 'active' : ''}" data-scenario="ref" onclick="selectScenario('ref')">
                    <span class="scenario-temp">Ref</span>
                    <span class="scenario-period">1976-2005</span>
                </button>
                <button class="scenario-btn ${currentScenario === '2030' ? 'active' : ''}" data-scenario="2030" onclick="selectScenario('2030')">
                    <span class="scenario-temp">+2°C</span>
                    <span class="scenario-period">Horizon 2030</span>
                </button>
                <button class="scenario-btn ${currentScenario === '2050' ? 'active' : ''}" data-scenario="2050" onclick="selectScenario('2050')">
                    <span class="scenario-temp">+2,7°C</span>
                    <span class="scenario-period">Horizon 2050</span>
                </button>
                <button class="scenario-btn ${currentScenario === '2100' ? 'active' : ''}" data-scenario="2100" onclick="selectScenario('2100')">
                    <span class="scenario-temp">+4°C</span>
                    <span class="scenario-period">Horizon 2100</span>
                </button>
            </div>
        </div>
    `;

    // Build threat selector
    html += `
        <div class="threat-section">
            <label class="threat-label-header">Type de menace climatique :</label>
            <div class="threat-selector">
    `;

    Object.keys(impactsData).forEach(key => {
        const threat = impactsData[key];
        const isActive = key === currentThreat;
        html += `
            <button class="threat-btn ${isActive ? 'active' : ''}"
                    data-threat="${key}"
                    onclick="selectThreat('${key}')"
                    style="--threat-color: ${threat.color}">
                <span class="threat-icon">${threat.icon}</span>
                <span class="threat-label">${threat.title}</span>
            </button>
        `;
    });

    html += `</div></div>`;

    // Impacts list container
    html += `<div class="impacts-list-container" id="impacts-list"></div>`;

    // Paris simplified map visualization
    html += `
        <div class="paris-map-section">
            <h3 class="section-title">Vue synthetique des impacts sur Paris</h3>
            <div class="paris-map-container">
                <svg viewBox="0 0 400 300" class="paris-map-svg">
                    <!-- Paris simplified shape -->
                    <ellipse cx="200" cy="150" rx="180" ry="130" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
                    <!-- Seine river -->
                    <path d="M30,180 Q100,140 200,160 Q300,180 370,140" fill="none" stroke="#3b82f6" stroke-width="8" stroke-linecap="round"/>
                    <!-- Eiffel Tower marker -->
                    <g transform="translate(120, 180)">
                        <path d="M10,0 L15,30 L5,30 Z" fill="#64748b"/>
                        <rect x="6" y="30" width="8" height="5" fill="#64748b"/>
                    </g>
                    <!-- Notre Dame marker -->
                    <g transform="translate(220, 155)">
                        <rect x="0" y="5" width="15" height="12" fill="#94a3b8"/>
                        <path d="M0,5 L7.5,0 L15,5 Z" fill="#94a3b8"/>
                    </g>
                </svg>
                <div class="paris-map-overlay" id="paris-impact-icons">
                    <!-- Icons rendered by JS -->
                </div>
            </div>
            <p class="paris-map-note">Carte simplifiee a vocation illustrative</p>
        </div>
    `;

    // Section impacts Ville de Paris
    html += `
        <div class="ville-impacts-section">
            <div class="section-header">
                <h2 class="section-title">Impacts pour la Ville de Paris</h2>
                <p class="section-subtitle">Consequences specifiques pour la collectivite</p>
            </div>
            <div class="ville-impacts-grid">
    `;

    impactsVille.forEach(impact => {
        html += `
            <div class="ville-impact-card" style="--impact-color: ${impact.color}">
                <div class="ville-impact-icon">${impact.icon}</div>
                <div class="ville-impact-content">
                    <h4 class="ville-impact-title">${impact.title}</h4>
                    <p class="ville-impact-desc">${impact.desc}</p>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    // Global impacts section (pedagogy mode only)
    html += `
        <div class="global-interdependencies pedagogy-only">
            <div class="section-header">
                <h2 class="section-title">Impacts globaux et interdependances</h2>
                <p class="section-subtitle">Consequences a l'echelle planetaire</p>
            </div>
            <div class="global-interdep-grid">
                <div class="global-interdep-card">
                    <span class="global-interdep-icon">&#x1F4A7;</span>
                    <span class="global-interdep-title">Tensions sur l'eau</span>
                    <span class="global-interdep-desc">Stress hydrique generalise</span>
                </div>
                <div class="global-interdep-card">
                    <span class="global-interdep-icon">&#x1F525;</span>
                    <span class="global-interdep-title">Incendies</span>
                    <span class="global-interdep-desc">Augmentation mondiale</span>
                </div>
                <div class="global-interdep-card">
                    <span class="global-interdep-icon">&#x1F3D9;</span>
                    <span class="global-interdep-title">Villes submergees</span>
                    <span class="global-interdep-desc">La Haye, Miami, Shanghai...</span>
                </div>
                <div class="global-interdep-card">
                    <span class="global-interdep-icon">&#x1F6B6;</span>
                    <span class="global-interdep-title">Migrations</span>
                    <span class="global-interdep-desc">Deplacements de populations</span>
                </div>
                <div class="global-interdep-card">
                    <span class="global-interdep-icon">&#x1F33F;</span>
                    <span class="global-interdep-title">Biodiversite</span>
                    <span class="global-interdep-desc">Destruction d'habitats</span>
                </div>
                <div class="global-interdep-card">
                    <span class="global-interdep-icon">&#x26A1;</span>
                    <span class="global-interdep-title">Conditions extremes</span>
                    <span class="global-interdep-desc">Populations exposees</span>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Now render the impacts list for current threat
    renderImpactsList();
    renderParisMapIcons();
}

function renderImpactsList() {
    const container = document.getElementById('impacts-list');
    if (!container) return;

    const threat = impactsData[currentThreat];
    const s = scenarios[currentScenario];
    const ref = scenarios.ref;

    let html = `
        <div class="impacts-header" style="border-left-color: ${threat.color}">
            <span class="impacts-header-icon">${threat.icon}</span>
            <div class="impacts-header-text">
                <h3>${threat.title}</h3>
                <p>Impacts associés à la menace - Scénario ${s.temp}</p>
            </div>
        </div>
    `;

    // Afficher les statistiques si disponibles (pour inondations)
    if (threat.stats && threat.stats.length > 0) {
        html += `
            <div class="impacts-stats-banner">
                <h4 class="impacts-stats-title">Chiffres clés</h4>
                <div class="impacts-stats-grid">
        `;
        threat.stats.forEach(stat => {
            html += `
                <div class="impacts-stat-item">
                    <span class="impacts-stat-value">${stat.value}</span>
                    <span class="impacts-stat-label">${stat.label}</span>
                </div>
            `;
        });
        html += `</div></div>`;
    }

    html += `<div class="impacts-grid">`;

    threat.impacts.forEach(impact => {
        let dataHtml = '';
        if (impact.data) {
            const refVal = impact.data.ref;
            const currentVal = impact.data[currentScenario] || refVal;
            const change = refVal !== 0 ? Math.round(((currentVal - refVal) / refVal) * 100) : 0;
            dataHtml = `
                <div class="impact-data">
                    <span class="impact-data-label">${impact.data.label}</span>
                    <span class="impact-data-value">${currentVal}</span>
                    ${currentScenario !== 'ref' ? `<span class="impact-data-change">+${change}% vs ref.</span>` : ''}
                </div>
            `;
        }

        html += `
            <div class="impact-card">
                <div class="impact-card-header">
                    <span class="impact-card-icon">${impact.icon}</span>
                    <h4 class="impact-card-title">${impact.title}</h4>
                </div>
                <p class="impact-card-desc">${impact.desc}</p>
                ${dataHtml}
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function renderParisMapIcons() {
    const container = document.getElementById('paris-impact-icons');
    if (!container) return;

    // Position icons based on current threat
    const positions = {
        surchauffe: [
            { x: 30, y: 25, icon: "&#x1F321;", label: "Canicules" },
            { x: 65, y: 20, icon: "&#x1F3EB;", label: "Batiments" },
            { x: 50, y: 60, icon: "&#x1F333;", label: "Vegetation" },
            { x: 80, y: 50, icon: "&#x26A1;", label: "Reseaux" }
        ],
        inondations: [
            { x: 25, y: 55, icon: "&#x1F30A;", label: "Crues" },
            { x: 55, y: 50, icon: "&#x1F687;", label: "Metro" },
            { x: 75, y: 40, icon: "&#x1F3E5;", label: "Services" }
        ],
        eau: [
            { x: 35, y: 30, icon: "&#x1F6B0;", label: "Approvisionnement" },
            { x: 60, y: 45, icon: "&#x2B07;", label: "Nappes" },
            { x: 70, y: 70, icon: "&#x1F91D;", label: "Usages" }
        ],
        biodiversite: [
            { x: 40, y: 35, icon: "&#x1F333;", label: "Arbres" },
            { x: 55, y: 55, icon: "&#x1F41F;", label: "Seine" },
            { x: 75, y: 25, icon: "&#x1F41C;", label: "Invasifs" }
        ]
    };

    const icons = positions[currentThreat] || [];
    const threat = impactsData[currentThreat];

    let html = '';
    icons.forEach(icon => {
        html += `
            <div class="paris-map-icon" style="left: ${icon.x}%; top: ${icon.y}%; --icon-color: ${threat.color}">
                <span class="paris-icon-symbol">${icon.icon}</span>
                <span class="paris-icon-label">${icon.label}</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ============================================
// TRAJECTOIRE TENDANCIELLE TAB
// ============================================

function renderTrajectoireTab() {
    const container = document.getElementById('trajectoire-content');
    if (!container) return;

    let html = '';

    // Section frises chronologiques par menace
    html += `
        <div class="trajectoires-section">
            <div class="section-header">
                <h2 class="section-title">Frises chronologiques par menace</h2>
                <p class="section-subtitle">Evolution des risques et actions d'adaptation engagees de 2025 a 2100</p>
            </div>
    `;

    // Render each trajectory
    Object.keys(trajectoiresData).forEach(key => {
        const traj = trajectoiresData[key];
        html += renderTrajectoireFrise(key, traj);
    });

    // Placeholder for future trajectories
    html += `
        <div class="trajectoire-placeholder">
            <span class="trajectoire-placeholder-icon">+</span>
            <span class="trajectoire-placeholder-text">Autres trajectoires a definir...</span>
        </div>
    `;

    html += `</div>`;

    // Section Contraintes
    html += `
        <div class="contraintes-section">
            <div class="section-header">
                <h2 class="section-title">Les contraintes qui emergent</h2>
                <p class="section-subtitle">Obstacles identifies pour la mise en oeuvre des actions d'adaptation</p>
            </div>
            <div class="contraintes-grid">
    `;

    contraintesData.forEach(contrainte => {
        let itemsHtml = '';
        if (contrainte.items && contrainte.items.length > 0) {
            itemsHtml = `<ul class="contrainte-items">` +
                contrainte.items.map(item => `<li>${item}</li>`).join('') +
                `</ul>`;
        } else if (contrainte.desc) {
            itemsHtml = `<p class="contrainte-desc">${contrainte.desc}</p>`;
        }
        html += `
            <div class="contrainte-card" style="--contrainte-color: ${contrainte.color}">
                <div class="contrainte-icon">${contrainte.icon}</div>
                <div class="contrainte-content">
                    <h4 class="contrainte-title">${contrainte.title}</h4>
                    ${itemsHtml}
                </div>
            </div>
        `;
    });

    html += `</div></div>`;

    // Section Besoins prioritaires
    html += `
        <div class="besoins-section">
            <div class="section-header">
                <h2 class="section-title">Besoins et pistes de chantiers prioritaires</h2>
                <p class="section-subtitle">Axes de travail identifies pour renforcer l'adaptation</p>
            </div>
            <div class="besoins-grid">
    `;

    besoinsData.forEach(besoin => {
        html += `
            <div class="besoin-card" style="--besoin-color: ${besoin.color}">
                <div class="besoin-header">
                    <span class="besoin-icon">${besoin.icon}</span>
                    <h4 class="besoin-title">${besoin.title}</h4>
                </div>
                <ul class="besoin-list">
                    ${besoin.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    });

    html += `</div></div>`;

    // Section Couts financiers
    html += `
        <div class="couts-section">
            <div class="couts-banner">
                <span class="couts-icon">&#x1F4B0;</span>
                <div class="couts-content">
                    <h3 class="couts-title">Chiffrage des couts</h3>
                    <p class="couts-desc">Un travail de chiffrage financier du cout de l'inaction et de l'action est en cours de realisation et sera integre dans cette section.</p>
                </div>
                <span class="couts-badge">A venir</span>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function renderTrajectoireFrise(key, traj) {
    const actionTypes = {
        vert: { label: "Solution verte", color: "#22c55e" },
        bleu: { label: "Solution bleue", color: "#3b82f6" },
        gris: { label: "Solution grise", color: "#64748b" },
        orga: { label: "Organisationnel", color: "#a855f7" }
    };

    // Build risk cards for timeline
    let risqueCards = '';
    traj.risques.forEach((risque, idx) => {
        const intensity = risque.niveau;
        risqueCards += `
            <div class="frise-risque-card" data-intensity="${intensity}">
                <div class="risque-card-header">
                    <span class="risque-horizon">${risque.horizon}</span>
                    <span class="risque-intensity">
                        ${'<span class="intensity-dot filled"></span>'.repeat(intensity)}${'<span class="intensity-dot"></span>'.repeat(4 - intensity)}
                    </span>
                </div>
                <div class="risque-card-label">${risque.label}</div>
            </div>
        `;
    });

    // Group actions by horizon
    const horizons = ['2026', '2030', '2040', '2050'];
    const actionsByHorizon = {};
    horizons.forEach(h => actionsByHorizon[h] = []);

    if (traj.actionsDatées) {
        traj.actionsDatées.forEach(action => {
            if (actionsByHorizon[action.horizon]) {
                actionsByHorizon[action.horizon].push(action);
            }
        });
    }

    // Build actions timeline section
    let actionsTimelineHtml = '';
    horizons.forEach(horizon => {
        const actions = actionsByHorizon[horizon];
        if (actions.length > 0) {
            actionsTimelineHtml += `
                <div class="actions-horizon-group">
                    <div class="actions-horizon-header">
                        <span class="actions-horizon-year">${horizon}</span>
                        <span class="actions-horizon-count">${actions.length} action${actions.length > 1 ? 's' : ''}</span>
                    </div>
                    <div class="actions-horizon-list">
            `;
            actions.forEach(action => {
                const type = actionTypes[action.type];
                actionsTimelineHtml += `
                    <div class="action-chip" style="--action-color: ${type.color}" title="${action.fullName}">
                        <span class="action-chip-dot" style="background: ${type.color}"></span>
                        <span class="action-chip-label">${action.shortName}</span>
                    </div>
                `;
            });
            actionsTimelineHtml += `</div></div>`;
        }
    });

    // Build sans échéance section
    let sansEcheanceHtml = '';
    if (traj.actionsSansÉchéance && traj.actionsSansÉchéance.length > 0) {
        sansEcheanceHtml = `
            <div class="actions-sans-echeance">
                <div class="actions-sans-echeance-header">
                    <span class="actions-sans-echeance-icon">⏳</span>
                    <span class="actions-sans-echeance-title">Actions sans échéance</span>
                    <span class="actions-sans-echeance-count">${traj.actionsSansÉchéance.length}</span>
                </div>
                <div class="actions-sans-echeance-list">
        `;
        traj.actionsSansÉchéance.forEach(action => {
            const type = actionTypes[action.type];
            sansEcheanceHtml += `
                <div class="action-chip action-chip-muted" style="--action-color: ${type.color}" title="${action.fullName}">
                    <span class="action-chip-dot" style="background: ${type.color}"></span>
                    <span class="action-chip-label">${action.shortName}</span>
                </div>
            `;
        });
        sansEcheanceHtml += `</div></div>`;
    }

    let html = `
        <div class="trajectoire-card" style="--traj-color: ${traj.color}">
            <div class="trajectoire-header">
                <span class="trajectoire-icon">${traj.icon}</span>
                <h3 class="trajectoire-title">${traj.title}</h3>
            </div>
            <div class="trajectoire-content">
                <div class="trajectoire-frise">
                    <div class="frise-legend-top">
                        <span class="frise-legend-label">Intensité du risque</span>
                        <span class="frise-legend-scale">
                            <span class="scale-low">Faible</span>
                            <span class="scale-arrow">→</span>
                            <span class="scale-high">Élevé</span>
                        </span>
                    </div>
                    <div class="frise-timeline-container">
                        <div class="frise-timeline">
                            <div class="frise-bar" style="background: linear-gradient(90deg, ${traj.color}33 0%, ${traj.color}66 33%, ${traj.color}99 66%, ${traj.color} 100%);"></div>
                            <div class="frise-markers">
                                <div class="frise-marker start" style="left: 0%">
                                    <span class="frise-marker-dot current"></span>
                                    <span class="frise-marker-year">2025</span>
                                    <span class="frise-marker-label">Aujourd'hui</span>
                                </div>
                                <div class="frise-marker" style="left: 6.7%">
                                    <span class="frise-marker-dot"></span>
                                    <span class="frise-marker-year">2030</span>
                                    <span class="frise-marker-temp">+2°C</span>
                                </div>
                                <div class="frise-marker" style="left: 33.3%">
                                    <span class="frise-marker-dot"></span>
                                    <span class="frise-marker-year">2050</span>
                                    <span class="frise-marker-temp">+2.7°C</span>
                                </div>
                                <div class="frise-marker end" style="left: 100%">
                                    <span class="frise-marker-dot"></span>
                                    <span class="frise-marker-year">2100</span>
                                    <span class="frise-marker-temp">+4°C</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="frise-risques-cards">
                        ${risqueCards}
                    </div>
                </div>

                <!-- Séquences d'actions par horizon -->
                <div class="trajectoire-actions-timeline">
                    <h4 class="actions-timeline-title">Séquences d'actions par horizon</h4>
                    <div class="actions-timeline-grid">
                        ${actionsTimelineHtml}
                    </div>
                </div>

                <!-- Actions sans échéance -->
                ${sansEcheanceHtml}

                <!-- Légende des types d'adaptation -->
                <div class="actions-legend">
                    <span class="legend-item"><span class="legend-dot" style="background: #22c55e"></span> Vert</span>
                    <span class="legend-item"><span class="legend-dot" style="background: #3b82f6"></span> Bleu</span>
                    <span class="legend-item"><span class="legend-dot" style="background: #64748b"></span> Gris</span>
                    <span class="legend-item"><span class="legend-dot" style="background: #a855f7"></span> Organisationnel</span>
                </div>
            </div>
        </div>
    `;

    return html;
}

// ============================================
// EXPORT PDF - Page Decideurs
// ============================================

function exportDecideursPDF() {
    // Pour l'instant, on utilise la fonction print du navigateur
    // Une vraie implementation utiliserait une librairie comme jsPDF ou html2pdf

    // Sauvegarder l'etat actuel
    const originalTitle = document.title;

    // Changer le titre pour le PDF
    document.title = 'Resume Decideurs - Trajectoire Climatique Paris - ' + new Date().toLocaleDateString('fr-FR');

    // Ajouter une classe pour le mode impression
    document.body.classList.add('print-mode');

    // Ouvrir la boite de dialogue d'impression
    window.print();

    // Restaurer l'etat
    document.body.classList.remove('print-mode');
    document.title = originalTitle;
}

// Style d'impression pour la page decideurs
const printStyles = document.createElement('style');
printStyles.textContent = `
    @media print {
        body.print-mode .header,
        body.print-mode .main-nav,
        body.print-mode .sidebar,
        body.print-mode .footer,
        body.print-mode .decideurs-export-btn,
        body.print-mode .pedagogy-toggle {
            display: none !important;
        }

        body.print-mode .app-layout {
            display: block !important;
        }

        body.print-mode .main-content {
            margin: 0 !important;
            padding: 0 !important;
        }

        body.print-mode .decideurs-page {
            max-width: 100% !important;
            padding: 20px !important;
        }

        body.print-mode .decideurs-header {
            background: #1e1b4b !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        body.print-mode .decideurs-kpi {
            background: rgba(255, 255, 255, 0.1) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        body.print-mode .decideurs-grid {
            grid-template-columns: 1fr 1fr !important;
        }

        body.print-mode .timeline-line {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        body.print-mode .progress-fill,
        body.print-mode .budget-bar,
        body.print-mode .opinion-bar {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    }
`;
document.head.appendChild(printStyles);
