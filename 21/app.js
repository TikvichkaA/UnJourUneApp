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
        maxTemp: 34, tropicalNights: 8, tropicalNightsICU: 8, days30: 9, days35: 1, days40: 0,
        cooling: 62, heating: 2332, fireRisk: 2, summerRain: 161, frostDays: 22,
        droughtDays: 23, extremeRainDays: 3
    },
    "2030": {
        temp: "+2°C", tempNum: 2, color: "#f59e0b", year: "2030",
        maxTemp: 36.2, tropicalNights: 17, tropicalNightsICU: 32, days30: 15, days35: 2.2, days40: 0.2,
        cooling: 106, heating: 2023, fireRisk: 3.3, summerRain: 154, frostDays: 14,
        droughtDays: 28, extremeRainDays: 4
    },
    "2050": {
        temp: "+2,7°C", tempNum: 2.7, color: "#ef4444", year: "2050",
        maxTemp: 37.4, tropicalNights: 26, tropicalNightsICU: 48, days30: 22, days35: 4.1, days40: 0.4,
        cooling: 163, heating: 1893, fireRisk: 8, summerRain: 155, frostDays: 11,
        droughtDays: 32, extremeRainDays: 5
    },
    "2100": {
        temp: "+4°C", tempNum: 4, color: "#991b1b", year: "2100",
        maxTemp: 39.9, tropicalNights: 42, tropicalNightsICU: 63, days30: 33, days35: 8, days40: 1.5,
        cooling: 250, heating: 1627, fireRisk: 9.3, summerRain: 141, frostDays: 7,
        droughtDays: 38, extremeRainDays: 6
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
                desc: "Risques sanitaires accrus, notamment pour les personnes vulnerables (personnes agees, enfants, malades chroniques). Les nuits chaudes empechent la recuperation.",
                data: { label: "Nuits tropicales", ref: 8, "2030": 17, "2050": 26, "2100": 42 }
            },
            {
                title: "Surchauffe des batiments",
                icon: "&#x1F3EB;",
                desc: "Tous les batiments seront a risque, surtout les batiments anciens ou mal isoles : ecoles, creches, EHPAD, logements, accueil du public.",
                data: { label: "Besoin climatisation (DJ)", ref: 62, "2030": 106, "2050": 163, "2100": 250 }
            },
            {
                title: "Baisse de l'attractivite",
                icon: "&#x1F3DB;",
                desc: "Avec des etes caniculaires et une ville peu adaptee, baisse de l'attractivite touristique et economique, risques sanitaires dans l'espace public.",
                data: null
            },
            {
                title: "Stress thermique vegetation",
                icon: "&#x1F333;",
                desc: "La surchauffe impacte fortement les espaces verts et la biodiversite urbaine, reduisant leur capacite de rafraichissement.",
                data: null
            },
            {
                title: "Perturbation des reseaux",
                icon: "&#x26A1;",
                desc: "La chaleur augmente les dommages sur certains reseaux (electrique, transports), renforces par l'augmentation de la demande de climatisation.",
                data: null
            }
        ]
    },
    inondations: {
        title: "Inondations",
        color: "#3b82f6",
        icon: "&#x1F30A;",
        impacts: [
            {
                title: "Dommages aux infrastructures",
                icon: "&#x1F687;",
                desc: "Les infrastructures souterraines (metro, parkings, reseaux) et de transport sont particulierement vulnerables aux inondations.",
                data: null
            },
            {
                title: "Perturbation economique",
                icon: "&#x1F4BC;",
                desc: "Interruption des activites economiques, pertes pour les commerces et entreprises, couts de reparation.",
                data: null
            },
            {
                title: "Perturbation services publics",
                icon: "&#x1F3E5;",
                desc: "Ecoles, hopitaux, services administratifs peuvent etre inaccessibles ou dysfonctionnels.",
                data: null
            },
            {
                title: "Saturation assainissement",
                icon: "&#x1F6B0;",
                desc: "Les reseaux d'assainissement peuvent etre satures lors d'evenements pluvieux intenses.",
                data: { label: "Jours precip. extremes", ref: 3, "2030": 4, "2050": 5, "2100": 6 }
            },
            {
                title: "Risques sanitaires",
                icon: "&#x26A0;",
                desc: "Pollution des eaux, risques de contamination, problemes d'hygiene post-inondation.",
                data: null
            },
            {
                title: "Gestion de crise",
                icon: "&#x1F6A8;",
                desc: "Necessite d'evacuation de populations, mobilisation des services d'urgence, hebergement temporaire.",
                data: null
            }
        ]
    },
    eau: {
        title: "Rarefaction de l'eau",
        color: "#06b6d4",
        icon: "&#x1F4A7;",
        impacts: [
            {
                title: "Tension approvisionnement",
                icon: "&#x1F6B0;",
                desc: "Difficultes croissantes pour assurer l'approvisionnement en eau potable en periode de secheresse.",
                data: { label: "Jours de secheresse", ref: 23, "2030": 28, "2050": 32, "2100": 38 }
            },
            {
                title: "Baisse des nappes",
                icon: "&#x2B07;",
                desc: "Les nappes phreatiques se rechargent moins, affectant les reserves strategiques.",
                data: null
            },
            {
                title: "Conflits d'usages",
                icon: "&#x1F91D;",
                desc: "Competition accrue entre usages : eau potable, agriculture, industrie, espaces verts, loisirs.",
                data: null
            }
        ]
    },
    biodiversite: {
        title: "Alteration biodiversite",
        color: "#22c55e",
        icon: "&#x1F33F;",
        impacts: [
            {
                title: "Mortalite des especes",
                icon: "&#x1F3F4;",
                desc: "Augmentation des especes malades ou mourant a cause du stress thermique et hydrique.",
                data: null
            },
            {
                title: "Especes invasives",
                icon: "&#x1F41C;",
                desc: "Proliferation d'especes invasives et de ravageurs favorises par le rechauffement.",
                data: null
            },
            {
                title: "Desequilibre Seine",
                icon: "&#x1F41F;",
                desc: "Desequilibre de l'ecosysteme de la Seine : temperature de l'eau, oxygenation, especes.",
                data: null
            },
            {
                title: "Perte services ecosystemiques",
                icon: "&#x1F343;",
                desc: "Diminution des services rendus par la nature : rafraichissement, regulation, pollinisation.",
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
        title: "Trajectoire face a la surchauffe",
        color: "#ef4444",
        icon: "&#x1F321;",
        risques: [
            { horizon: "2030", niveau: 2, label: "Canicules plus frequentes" },
            { horizon: "2050", niveau: 3, label: "Canicules intenses et longues" },
            { horizon: "2100", niveau: 4, label: "Etes caniculaires chroniques" }
        ],
        actions: [
            { type: "verte", label: "Vegetalisation des cours d'ecoles", status: "en_cours" },
            { type: "verte", label: "Plan Arbre (170 000 arbres)", status: "en_cours" },
            { type: "bleue", label: "Fontaines et brumisateurs", status: "en_cours" },
            { type: "grise", label: "Renovation thermique des batiments", status: "en_cours" },
            { type: "orga", label: "Plan canicule", status: "operationnel" },
            { type: "orga", label: "Ilots de fraicheur", status: "en_cours" }
        ]
    },
    inondations: {
        title: "Trajectoire face aux inondations",
        color: "#3b82f6",
        icon: "&#x1F30A;",
        risques: [
            { horizon: "2030", niveau: 2, label: "Crues et ruissellement accrus" },
            { horizon: "2050", niveau: 3, label: "Evenements pluvieux intenses" },
            { horizon: "2100", niveau: 4, label: "Risque inondation majeur" }
        ],
        actions: [
            { type: "bleue", label: "Desimpermeabilisation des sols", status: "en_cours" },
            { type: "bleue", label: "Bassins de retention", status: "en_cours" },
            { type: "grise", label: "Renforcement reseaux assainissement", status: "planifie" },
            { type: "orga", label: "Plan de Prevention des Risques", status: "operationnel" },
            { type: "orga", label: "Exercices de crise", status: "en_cours" }
        ]
    },
    eau: {
        title: "Trajectoire face a la rarefaction de l'eau",
        color: "#06b6d4",
        icon: "&#x1F4A7;",
        risques: [
            { horizon: "2030", niveau: 2, label: "Tensions ponctuelles" },
            { horizon: "2050", niveau: 3, label: "Stress hydrique frequent" },
            { horizon: "2100", niveau: 4, label: "Penurie recurrente" }
        ],
        actions: [
            { type: "bleue", label: "Recuperation eaux de pluie", status: "en_cours" },
            { type: "bleue", label: "Reseau d'eau non potable", status: "en_cours" },
            { type: "orga", label: "Plan secheresse", status: "operationnel" },
            { type: "orga", label: "Sensibilisation eco-gestes", status: "en_cours" }
        ]
    },
    biodiversite: {
        title: "Trajectoire face a l'alteration de la biodiversite",
        color: "#22c55e",
        icon: "&#x1F33F;",
        risques: [
            { horizon: "2030", niveau: 2, label: "Stress des especes" },
            { horizon: "2050", niveau: 3, label: "Disparition d'especes locales" },
            { horizon: "2100", niveau: 4, label: "Ecosystemes degrades" }
        ],
        actions: [
            { type: "verte", label: "Corridors ecologiques", status: "en_cours" },
            { type: "verte", label: "Gestion differenciee des espaces verts", status: "operationnel" },
            { type: "verte", label: "Plan Biodiversite", status: "operationnel" },
            { type: "orga", label: "Choix d'especes adaptees", status: "en_cours" }
        ]
    }
};

const contraintesData = [
    {
        id: "financieres",
        title: "Contraintes financieres",
        icon: "&#x1F4B0;",
        color: "#f59e0b",
        desc: "Certaines solutions d'adaptation necessitent des volumes financiers tres significatifs. Enjeu de perennisation de budgets encore incertains."
    },
    {
        id: "techniques",
        title: "Contraintes techniques",
        icon: "&#x1F527;",
        color: "#6366f1",
        desc: "Questions de faisabilite et de complexite technique pour certaines solutions innovantes."
    },
    {
        id: "organisationnelles",
        title: "Contraintes organisationnelles",
        icon: "&#x1F4CB;",
        color: "#ec4899",
        desc: "Certaines solutions sont complexes a mettre en oeuvre. Ex: renover les ecoles necessite de les fermer plus d'un an, reloger les enfants, gerer les canicules pendant les travaux."
    },
    {
        id: "coordination",
        title: "Contraintes de coordination",
        icon: "&#x1F91D;",
        color: "#14b8a6",
        desc: "Necessite d'actions coherentes entre acteurs, synergies a construire, arbitrages entre objectifs parfois contraires (ex: ABF vs adaptation des toits)."
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
let isNightMode = false;
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
// NIGHT MODE (Mode nuit = donnees mondiales)
// ============================================

function toggleNightMode() {
    isNightMode = !isNightMode;
    document.body.classList.toggle('night-mode', isNightMode);

    const nightIcon = document.getElementById('night-icon');
    if (nightIcon) {
        // Switch between moon and sun SVG
        if (isNightMode) {
            nightIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
        } else {
            nightIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
        }
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
            title: "Indicateurs d'extremes climatiques",
            subtitle: "Evenements meteorologiques intenses",
            indicators: [
                { key: 'days30', label: 'Jours > 30°C', value: s.days30, color: '#f97316' },
                { key: 'days35', label: 'Jours > 35°C', value: s.days35, color: '#dc2626' },
                { key: 'days40', label: 'Jours > 40°C', value: s.days40, color: '#7f1d1d' },
                { key: 'tropicalNights', label: 'Nuits tropicales', value: s.tropicalNights, color: '#ef4444' },
                { key: 'maxTemp', label: 'Temp. max record', value: s.maxTemp, unit: '°C', color: '#991b1b' },
                { key: 'fireRisk', label: 'Risque incendie', value: s.fireRisk, color: '#ea580c' }
            ]
        },
        {
            title: "Confort thermique des batiments",
            subtitle: "Evolution des besoins energetiques",
            indicators: [
                { key: 'cooling', label: 'Besoin climatisation', value: s.cooling, unit: 'DJ', color: '#0ea5e9' },
                { key: 'heating', label: 'Besoin chauffage', value: s.heating, unit: 'DJ', color: '#f59e0b' },
                { key: 'frostDays', label: 'Jours de gel', value: s.frostDays, color: '#3b82f6' }
            ]
        }
    ];

    const container = document.getElementById('indicators-section');
    if (!container) return;

    let html = '';

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

    // Global impacts section (night mode only)
    html += `
        <div class="global-interdependencies night-only">
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
                <p>Impacts associes a la menace - Scenario ${s.temp}</p>
            </div>
        </div>
        <div class="impacts-grid">
    `;

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
        html += `
            <div class="contrainte-card" style="--contrainte-color: ${contrainte.color}">
                <div class="contrainte-icon">${contrainte.icon}</div>
                <div class="contrainte-content">
                    <h4 class="contrainte-title">${contrainte.title}</h4>
                    <p class="contrainte-desc">${contrainte.desc}</p>
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
        verte: { label: "Solution verte", color: "#22c55e" },
        bleue: { label: "Solution bleue", color: "#3b82f6" },
        grise: { label: "Solution grise", color: "#64748b" },
        orga: { label: "Organisationnel", color: "#a855f7" }
    };

    const statusLabels = {
        operationnel: "Operationnel",
        en_cours: "En cours",
        planifie: "Planifie"
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

    let html = `
        <div class="trajectoire-card" style="--traj-color: ${traj.color}">
            <div class="trajectoire-header">
                <span class="trajectoire-icon">${traj.icon}</span>
                <h3 class="trajectoire-title">${traj.title}</h3>
            </div>
            <div class="trajectoire-content">
                <div class="trajectoire-frise">
                    <div class="frise-legend-top">
                        <span class="frise-legend-label">Intensite du risque</span>
                        <span class="frise-legend-scale">
                            <span class="scale-low">Faible</span>
                            <span class="scale-arrow">→</span>
                            <span class="scale-high">Eleve</span>
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
                <div class="trajectoire-actions">
                    <h4 class="actions-title">Actions engagees</h4>
                    <p class="actions-note">Actions non datees - objectifs a definir</p>
                    <div class="actions-list">
    `;

    // Group actions by type
    traj.actions.forEach(action => {
        const type = actionTypes[action.type];
        html += `
            <div class="action-item">
                <span class="action-type-dot" style="background: ${type.color}"></span>
                <span class="action-label">${action.label}</span>
                <span class="action-status status-${action.status}">${statusLabels[action.status]}</span>
            </div>
        `;
    });

    html += `
                    </div>
                    <div class="actions-legend">
                        <span class="legend-item"><span class="legend-dot" style="background: #22c55e"></span> Verte</span>
                        <span class="legend-item"><span class="legend-dot" style="background: #3b82f6"></span> Bleue</span>
                        <span class="legend-item"><span class="legend-dot" style="background: #64748b"></span> Grise</span>
                        <span class="legend-item"><span class="legend-dot" style="background: #a855f7"></span> Orga</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    return html;
}
