// ============================================
// DATA - Climate Scenarios
// ============================================

const scenarios = {
    ref: {
        temp: "Ref", tempNum: 0, color: "#3b82f6", year: "1976-2005",
        markerPos: 0, mercuryHeight: 10,
        maxTemp: 34, tropicalNights: 8, tropicalNightsICU: 8, days30: 9, days35: 1, days40: 0,
        cooling: 62, heating: 2332, fireRisk: 2, summerRain: 161, frostDays: 22,
        droughtDays: 23, extremeRainDays: 3
    },
    "2030": {
        temp: "+2°C", tempNum: 2, color: "#f97316", year: "2030",
        markerPos: 140, mercuryHeight: 45,
        maxTemp: 36.2, tropicalNights: 17, tropicalNightsICU: 32, days30: 15, days35: 2.2, days40: 0.2,
        cooling: 106, heating: 2023, fireRisk: 3.3, summerRain: 154, frostDays: 14,
        droughtDays: 28, extremeRainDays: 4
    },
    "2050": {
        temp: "+2.7°C", tempNum: 2.7, color: "#ef4444", year: "2050",
        markerPos: 190, mercuryHeight: 60,
        maxTemp: 37.4, tropicalNights: 26, tropicalNightsICU: 48, days30: 22, days35: 4.1, days40: 0.4,
        cooling: 163, heating: 1893, fireRisk: 8, summerRain: 155, frostDays: 11,
        droughtDays: 32, extremeRainDays: 5
    },
    "2100": {
        temp: "+4°C", tempNum: 4, color: "#991b1b", year: "2100",
        markerPos: 240, mercuryHeight: 85,
        maxTemp: 39.9, tropicalNights: 42, tropicalNightsICU: 63, days30: 33, days35: 8, days40: 1.5,
        cooling: 250, heating: 1627, fireRisk: 9.3, summerRain: 141, frostDays: 7,
        droughtDays: 38, extremeRainDays: 6
    }
};

// ============================================
// DATA - Indicator Definitions (for tooltips)
// ============================================

const indicatorDefinitions = {
    tropicalNights: {
        icon: "&#x1F319;",
        title: "Nuits tropicales",
        unit: "nuits/an",
        definition: "Nuit ou la temperature minimale ne descend pas en dessous de 20°C. Ces nuits empechent le corps de recuperer de la chaleur diurne.",
        intervals: { ref: [5, 12], "2030": [10, 23], "2050": [19, 34], "2100": [32, 54] },
        variability: "La variabilite interannuelle peut faire varier ce chiffre de ±30% d'une annee a l'autre selon les conditions meteorologiques.",
        impact: "Troubles du sommeil, surmortalite chez les personnes agees"
    },
    days30: {
        icon: "&#x1F321;&#xFE0F;",
        title: "Jours > 30°C",
        unit: "jours/an",
        definition: "Nombre de jours ou la temperature maximale depasse 30°C. Seuil de vigilance pour les activites exterieures.",
        intervals: { ref: [5, 14], "2030": [10, 22], "2050": [16, 29], "2100": [25, 42] },
        variability: "Forte variabilite selon les etes. Un ete caniculaire peut doubler ce chiffre.",
        impact: "Productivite reduite, stress thermique"
    },
    days35: {
        icon: "&#x1F622;",
        title: "Jours > 35°C",
        unit: "jours/an",
        definition: "Nombre de jours ou la temperature maximale depasse 35°C. Seuil de danger pour la sante.",
        intervals: { ref: [0, 2], "2030": [1, 6], "2050": [2, 7], "2100": [5, 12] },
        variability: "Evenements rares mais leur frequence augmente significativement.",
        impact: "Risque vital pour les personnes vulnerables"
    },
    days40: {
        icon: "&#x1F975;",
        title: "Jours > 40°C",
        unit: "jours/an",
        definition: "Nombre de jours ou la temperature maximale depasse 40°C. Seuil de danger extreme, jamais atteint historiquement a Paris.",
        intervals: { ref: [0, 0], "2030": [0, 0.5], "2050": [0, 1], "2100": [0.5, 3] },
        variability: "Evenements exceptionnels qui deviennent possibles avec le rechauffement.",
        impact: "Conditions potentiellement mortelles, saturation des urgences"
    },
    cooling: {
        icon: "&#x2744;&#xFE0F;",
        title: "Besoin en climatisation",
        unit: "DJ",
        definition: "Indicateur du besoin en climatisation (degres-jours). Somme des ecarts entre temperature moyenne journaliere et 22°C quand celle-ci est depassee.",
        intervals: { ref: [45, 82], "2030": [78, 140], "2050": [120, 210], "2100": [190, 320] },
        variability: "Varie selon l'ensoleillement et les vagues de chaleur estivales.",
        impact: "Augmentation facture energetique, pics de consommation"
    },
    heating: {
        icon: "&#x1F3E0;",
        title: "Besoin en chauffage",
        unit: "DJ",
        definition: "Indicateur du besoin en chauffage (degres-jours). Somme des ecarts entre 18°C et la temperature moyenne journaliere quand celle-ci est inferieure.",
        intervals: { ref: [2200, 2450], "2030": [1900, 2150], "2050": [1750, 2050], "2100": [1450, 1800] },
        variability: "Varie selon la rigueur des hivers. Tendance a la baisse.",
        impact: "Economies de chauffage mais isolation toujours necessaire"
    },
    frostDays: {
        icon: "&#x1F9CA;",
        title: "Jours de gel",
        unit: "jours/an",
        definition: "Nombre de jours ou la temperature minimale descend sous 0°C.",
        intervals: { ref: [17, 28], "2030": [10, 19], "2050": [7, 16], "2100": [4, 11] },
        variability: "Diminution progressive mais des hivers rigoureux restent possibles.",
        impact: "Moins de chauffage, mais risques pour certaines cultures"
    },
    fireRisk: {
        icon: "&#x1F6A8;",
        title: "Jours risque incendie",
        unit: "jours/an",
        definition: "Nombre de jours ou l'Indice Feu Meteo (IFM) depasse le seuil de risque eleve. Combine temperature, humidite, vent et secheresse.",
        intervals: { ref: [1, 4], "2030": [2, 5], "2050": [5, 12], "2100": [6, 14] },
        variability: "Tres dependant des conditions de secheresse accumulee au printemps.",
        impact: "Risque pour les forets periurbaines, qualite de l'air degradee"
    },
    summerRain: {
        icon: "&#x1F4A7;",
        title: "Precipitations estivales",
        unit: "mm",
        definition: "Cumul des precipitations sur juin, juillet et aout. Indicateur de secheresse estivale.",
        intervals: { ref: [140, 185], "2030": [130, 180], "2050": [130, 182], "2100": [115, 170] },
        variability: "Grande variabilite naturelle. Tendance a la baisse mais avec des episodes intenses.",
        impact: "Stress hydrique pour la vegetation, restrictions d'eau possibles"
    },
    maxTemp: {
        icon: "&#x1F321;&#xFE0F;",
        title: "Temperature max record",
        unit: "°C",
        definition: "Temperature maximale journaliere la plus elevee de l'annee en moyenne. Indicateur d'intensite des vagues de chaleur.",
        intervals: { ref: [32, 36], "2030": [34, 38], "2050": [35, 40], "2100": [38, 43] },
        variability: "Peut varier de plusieurs degres selon la presence ou non de canicule.",
        impact: "Seuil critique pour la sante publique et les infrastructures"
    }
};

// ============================================
// DATA - Tipping Points & Global Impacts
// ============================================

// Version A - 6 points de bascule (style The Conversation)
const tippingPointsVersionA = [
    {
        icon: "&#x1F9CA;",
        title: "Calotte du Groenland",
        thresholdMin: 0.8, thresholdMax: 3.0,
        desc: "Fonte irreversible : +7m niveau des mers sur plusieurs siecles",
        color: "#06b6d4",
        location: "Groenland"
    },
    {
        icon: "&#x1F30A;",
        title: "Circulation AMOC",
        thresholdMin: 1.4, thresholdMax: 8.0,
        desc: "Effondrement du Gulf Stream : refroidissement brutal de l'Europe",
        color: "#3b82f6",
        location: "Atlantique Nord"
    },
    {
        icon: "&#x1F333;",
        title: "Foret amazonienne",
        thresholdMin: 2.0, thresholdMax: 6.0,
        desc: "Transformation en savane : liberation de 200 Gt de CO2",
        color: "#22c55e",
        location: "Amerique du Sud"
    },
    {
        icon: "&#x2744;&#xFE0F;",
        title: "Permafrost",
        thresholdMin: 1.0, thresholdMax: 2.3,
        desc: "Degel : liberation de 1500 Gt de carbone (methane et CO2)",
        color: "#a855f7",
        location: "Siberie / Canada"
    },
    {
        icon: "&#x1F98B;",
        title: "Antarctique Ouest",
        thresholdMin: 1.0, thresholdMax: 3.0,
        desc: "Effondrement : +3m niveau des mers sur plusieurs siecles",
        color: "#60a5fa",
        location: "Antarctique"
    },
    {
        icon: "&#x2600;&#xFE0F;",
        title: "Banquise arctique",
        thresholdMin: 1.5, thresholdMax: 2.0,
        desc: "Disparition en ete : acceleration du rechauffement (albedo)",
        color: "#f0f9ff",
        location: "Ocean Arctique"
    }
];

// Version B - Points avec position sur carte (enrichie)
const tippingPointsVersionB = [
    // Poles et glaces
    { id: "arctic", title: "Banquise arctique", x: 50, y: 6, thresholdMin: 1.5, thresholdMax: 2.0, icon: "&#x2744;&#xFE0F;", desc: "Disparition estivale, acceleration rechauffement", color: "#e0f2fe" },
    { id: "greenland", title: "Calotte Groenland", x: 40, y: 18, thresholdMin: 0.8, thresholdMax: 3.0, icon: "&#x1F9CA;", desc: "Fonte irreversible : +7m niveau mers", color: "#06b6d4" },
    { id: "antarctica-west", title: "Antarctique Ouest", x: 35, y: 88, thresholdMin: 1.0, thresholdMax: 3.0, icon: "&#x1F9CA;", desc: "Effondrement : +3m niveau mers", color: "#60a5fa" },
    { id: "antarctica-east", title: "Antarctique Est", x: 65, y: 88, thresholdMin: 3.0, thresholdMax: 5.0, icon: "&#x1F9CA;", desc: "Sous-bassins instables : +2m", color: "#93c5fd" },
    // Oceans et courants
    { id: "amoc", title: "Circulation AMOC", x: 30, y: 38, thresholdMin: 1.4, thresholdMax: 8.0, icon: "&#x1F30A;", desc: "Effondrement Gulf Stream", color: "#3b82f6" },
    { id: "coral-caribbean", title: "Coraux Caraibes", x: 24, y: 48, thresholdMin: 1.0, thresholdMax: 1.5, icon: "&#x1F41A;", desc: "Blanchissement massif irreversible", color: "#f472b6" },
    { id: "coral-pacific", title: "Grande Barriere", x: 82, y: 62, thresholdMin: 1.0, thresholdMax: 1.5, icon: "&#x1F41A;", desc: "Mort des recifs coralliens", color: "#ec4899" },
    // Forets et ecosystemes
    { id: "amazon", title: "Foret amazonienne", x: 28, y: 58, thresholdMin: 2.0, thresholdMax: 6.0, icon: "&#x1F333;", desc: "Deperissement : 200 Gt CO2", color: "#22c55e" },
    { id: "boreal-canada", title: "Foret boreale Canada", x: 22, y: 22, thresholdMin: 1.4, thresholdMax: 5.0, icon: "&#x1F332;", desc: "Incendies et insectes", color: "#15803d" },
    { id: "boreal-siberia", title: "Foret boreale Siberie", x: 75, y: 20, thresholdMin: 1.4, thresholdMax: 5.0, icon: "&#x1F332;", desc: "Mega-feux, liberation CO2", color: "#166534" },
    // Permafrost
    { id: "permafrost-siberia", title: "Permafrost Siberie", x: 68, y: 15, thresholdMin: 1.0, thresholdMax: 2.3, icon: "&#x2744;&#xFE0F;", desc: "Degel : methane et CO2", color: "#a855f7" },
    { id: "permafrost-canada", title: "Permafrost Canada", x: 18, y: 15, thresholdMin: 1.0, thresholdMax: 2.3, icon: "&#x2744;&#xFE0F;", desc: "1500 Gt carbone pieges", color: "#9333ea" },
    // Moussons et climat regional
    { id: "sahel", title: "Sahel", x: 48, y: 48, thresholdMin: 2.0, thresholdMax: 3.5, icon: "&#x1F3DC;&#xFE0F;", desc: "Desertification acceleree", color: "#fbbf24" },
    { id: "monsoon-india", title: "Mousson indienne", x: 72, y: 48, thresholdMin: 1.5, thresholdMax: 3.0, icon: "&#x1F327;&#xFE0F;", desc: "Perturbation cycle mousson", color: "#0ea5e9" }
];

// Ancien format pour compatibilite (sera remplace)
const tippingPoints = tippingPointsVersionA;

const globalImpactsData = {
    ref: { sea: "0 cm", refugees: "~0", species: "Ref", coral: "70%", arctic: "Avec glace" },
    "2030": { sea: "+20 cm", refugees: "140M", species: "-8%", coral: "50%", arctic: "Ete sans glace rare" },
    "2050": { sea: "+40 cm", refugees: "200M", species: "-15%", coral: "30%", arctic: "Ete sans glace freq." },
    "2100": { sea: "+1m", refugees: "500M+", species: "-30%", coral: "~0%", arctic: "Sans glace" }
};

const cityAnalogues = {
    ref: {
        city: "Paris",
        icon: "&#x1F5FC;",
        temp: "12.4°C",
        desc: "Climat de reference"
    },
    "2030": {
        city: "Bordeaux",
        icon: "&#x1F347;",
        temp: "13.8°C",
        desc: "A +2°C, Paris aura le climat actuel de Bordeaux"
    },
    "2050": {
        city: "Montpellier",
        icon: "&#x1F3D6;&#xFE0F;",
        temp: "14.2°C",
        desc: "A +2,7°C, Paris aura le climat actuel de Montpellier"
    },
    "2100": {
        city: "Seville",
        icon: "&#x1F1EA;&#x1F1F8;",
        temp: "18.6°C",
        desc: "A +4°C, Paris aura le climat actuel de Seville (Espagne)"
    }
};

// ============================================
// STATE
// ============================================

let currentScenario = "2030";
let isDarkMode = false;
let chart = null;
let currentChart = "tropical";

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    selectScenario(currentScenario);
    initChart();
    renderTippingPoints();
});

// ============================================
// MAIN SCENARIO SELECTOR
// ============================================

function selectScenario(id) {
    currentScenario = id;
    const s = scenarios[id];

    // Update scenario cards
    document.querySelectorAll('.scenario-card').forEach(card => {
        card.classList.toggle('active', card.dataset.scenario === id);
    });

    // Update thermometer
    document.getElementById('thermo-mercury').style.height = s.mercuryHeight + '%';
    document.getElementById('thermo-marker').style.bottom = s.markerPos + 'px';
    document.getElementById('thermo-marker').textContent = s.temp;
    document.getElementById('thermo-marker').style.borderColor = s.color;
    document.getElementById('thermo-marker').style.color = s.color;
    document.getElementById('thermo-bulb').style.background = s.color;
    document.getElementById('bulb-temp').textContent = s.temp;
    document.documentElement.style.setProperty('--current-color', s.color);

    // Update weather scene
    updateWeatherScene(s);

    // Update all sections
    renderCalendar();
    renderGauges();
    renderCityComparison();
    updateIllustrations();
    updateTippingPoints();
    renderGlobalImpacts();
    if (chart) updateChart();
}

// ============================================
// WEATHER SCENE
// ============================================

function updateWeatherScene(s) {
    const scene = document.getElementById('weather-scene');
    scene.className = 'weather-scene';
    if (s.tempNum >= 4) scene.classList.add('extreme');
    else if (s.tempNum >= 2.7) scene.classList.add('very-hot');
    else if (s.tempNum >= 2) scene.classList.add('hot');

    const sun = document.getElementById('sun');
    sun.className = 'sun';
    if (s.tempNum >= 4) sun.classList.add('extreme');
    else if (s.tempNum >= 2) sun.classList.add('intense');

    document.getElementById('weather-temp').textContent = s.maxTemp.toFixed(1) + '°C';
    document.getElementById('weather-desc').textContent = getWeatherDesc(s.tempNum);
    document.getElementById('tropical-nights').textContent = Math.round(s.tropicalNights) + ' nuits tropicales';
    document.getElementById('summer-rain').textContent = Math.round(s.summerRain) + ' mm de pluie';
    document.getElementById('fire-risk').textContent = s.fireRisk.toFixed(1) + ' jours risque feu';
}

function getWeatherDesc(temp) {
    if (temp >= 4) return "Chaleur extreme - conditions dangereuses";
    if (temp >= 2.7) return "Canicules frequentes - stress thermique";
    if (temp >= 2) return "Etes plus chauds - adaptation necessaire";
    return "Ete typique parisien";
}

// ============================================
// CALENDAR HEATMAP
// ============================================

function renderCalendar() {
    const s = scenarios[currentScenario];
    const months = ['Juin', 'Juillet', 'Aout'];
    const daysInMonth = [30, 31, 31];

    let html = '';

    months.forEach((month, mi) => {
        html += `<div class="calendar-month"><div class="month-name">${month}</div><div class="month-grid">`;

        for (let d = 1; d <= daysInMonth[mi]; d++) {
            const rand = Math.random();
            let cls = 'normal';
            const hotProb = s.days30 / 92;
            const veryHotProb = s.days35 / 92;
            const extremeProb = s.days40 / 92;
            const tropicalProb = s.tropicalNights / 92;

            if (rand < extremeProb) cls = 'extreme';
            else if (rand < extremeProb + veryHotProb) cls = 'very-hot';
            else if (rand < extremeProb + veryHotProb + hotProb) cls = 'hot';
            else if (rand < 0.5) cls = 'warm';

            const tropical = Math.random() < tropicalProb ? ' tropical-night' : '';

            html += `<div class="day-cell ${cls}${tropical}" title="Jour ${d}">${d}</div>`;
        }

        html += '</div></div>';
    });

    document.getElementById('calendar-months').innerHTML = html;

    // Stats with tooltips
    document.getElementById('calendar-stats').innerHTML = `
        <div class="calendar-stat" data-indicator="days30">
            <div class="stat-value" style="color: #f97316">${Math.round(s.days30)}</div>
            <div class="stat-label">jours > 30°C</div>
        </div>
        <div class="calendar-stat" data-indicator="days35">
            <div class="stat-value" style="color: #ef4444">${s.days35.toFixed(1)}</div>
            <div class="stat-label">jours > 35°C</div>
        </div>
        <div class="calendar-stat">
            <div class="stat-value" style="color: #991b1b">${s.days40.toFixed(1)}</div>
            <div class="stat-label">jours > 40°C</div>
        </div>
        <div class="calendar-stat" data-indicator="tropicalNights">
            <div class="stat-value" style="color: #7c3aed">${Math.round(s.tropicalNights)}</div>
            <div class="stat-label">nuits tropicales</div>
        </div>
    `;
}

// ============================================
// CIRCULAR GAUGES WITH TOOLTIPS
// ============================================

function renderGauges() {
    const s = scenarios[currentScenario];
    const ref = scenarios.ref;

    // Sections d'indicateurs structurees
    const sections = [
        {
            title: "Indicateurs du climat classique",
            subtitle: "Temperature, pluviometrie et gel",
            gauges: [
                { key: 'frostDays', label: 'Jours de gel', value: s.frostDays, max: 30, unit: '/an', color: '#3b82f6' },
                { key: 'summerRain', label: 'Pluie ete', value: s.summerRain, max: 200, unit: 'mm', color: '#06b6d4' }
            ]
        },
        {
            title: "Indicateurs d'extremes climatiques",
            subtitle: "Evenements meteorologiques intenses",
            gauges: [
                { key: 'days30', label: 'Jours > 30°C', value: s.days30, max: 45, unit: '/an', color: '#f97316' },
                { key: 'days35', label: 'Jours > 35°C', value: s.days35, max: 15, unit: '/an', color: '#dc2626' },
                { key: 'days40', label: 'Jours > 40°C', value: s.days40, max: 5, unit: '/an', color: '#7f1d1d' },
                { key: 'tropicalNights', label: 'Nuits tropicales', value: s.tropicalNights, max: 60, unit: '/an', color: '#ef4444' },
                { key: 'maxTemp', label: 'Temp. max record', value: s.maxTemp, max: 45, unit: '°C', color: '#991b1b' },
                { key: 'fireRisk', label: 'Risque incendie', value: s.fireRisk, max: 15, unit: 'j/an', color: '#ea580c' }
            ]
        },
        {
            title: "Confort thermique des batiments",
            subtitle: "Evolution des besoins energetiques",
            gauges: [
                { key: 'cooling', label: 'Besoin en climatisation', value: s.cooling, max: 300, unit: 'DJ', color: '#0ea5e9' },
                { key: 'heating', label: 'Besoin en chauffage', value: s.heating, max: 2500, unit: 'DJ', color: '#f59e0b' }
            ]
        }
    ];

    let html = '';

    sections.forEach(section => {
        html += `<div class="gauges-category">`;
        html += `<h3 class="gauges-category-title">${section.title}</h3>`;
        html += `<p class="gauges-category-subtitle">${section.subtitle}</p>`;
        html += `<div class="gauges-grid">`;

        html += section.gauges.map(g => {
            const def = indicatorDefinitions[g.key];
            const refVal = ref[g.key];
            const pct = Math.min(g.value / g.max * 100, 100);
            const circumference = 2 * Math.PI * 70;
            const offset = circumference - (pct / 100) * circumference;
            const change = refVal !== 0 ? ((g.value - refVal) / refVal * 100) : 0;
            const decreaseIsGood = ['frostDays', 'heating', 'summerRain'].includes(g.key);
            const changeClass = decreaseIsGood ? (change < 0 ? 'down' : 'up') : (change > 0 ? 'up' : 'down');
            const changeSign = change > 0 ? '+' : '';
            const interval = def.intervals[currentScenario] || def.intervals.ref;

            return `
                <div class="gauge-card">
                    <div class="gauge-container">
                        <svg class="gauge-svg" width="180" height="180" viewBox="0 0 180 180">
                            <circle class="gauge-bg" cx="90" cy="90" r="70"/>
                            <circle class="gauge-fill" cx="90" cy="90" r="70" stroke="${g.color}"
                                stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
                        </svg>
                        <div class="gauge-center">
                            <div class="gauge-value" style="color: ${g.color}">${g.value.toFixed(g.value < 10 ? 1 : 0)}</div>
                            <div class="gauge-unit">${g.unit}</div>
                        </div>
                    </div>
                    <div class="gauge-title">${g.label}</div>
                    ${currentScenario !== 'ref' ? `<span class="gauge-change ${changeClass}">${changeSign}${change.toFixed(0)}%</span>` : ''}

                    <div class="tooltip">
                        <div class="tooltip-title">${def.icon} ${def.title}</div>
                        <div class="tooltip-section">
                            <div class="tooltip-label">Definition</div>
                            <div class="tooltip-definition">${def.definition}</div>
                        </div>
                        <div class="tooltip-section">
                            <div class="tooltip-label">Intervalle de confiance (${scenarios[currentScenario].temp})</div>
                            <span class="tooltip-interval">[${interval[0]} - ${interval[1]}] ${def.unit}</span>
                        </div>
                        <div class="tooltip-section">
                            <div class="tooltip-note">
                                <span class="tooltip-note-icon">&#x26A0;&#xFE0F;</span>
                                <span>${def.variability}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        html += `</div></div>`;
    });

    // Focus Nuits Tropicales avec ICU
    if (currentScenario !== 'ref') {
        const icuValue = s.tropicalNightsICU;
        const normalValue = s.tropicalNights;
        html += `
            <div class="icu-focus-section">
                <h3 class="icu-focus-title">&#x1F3D9;&#xFE0F; Focus : Effet ilot de chaleur urbain (ICU)</h3>
                <p class="icu-focus-subtitle">Les nuits tropicales sont amplifiees en ville par l'effet d'ilot de chaleur urbain</p>
                <div class="icu-comparison">
                    <div class="icu-card">
                        <div class="icu-value">${normalValue}</div>
                        <div class="icu-label">Nuits tropicales<br><small>Sans effet ICU</small></div>
                    </div>
                    <div class="icu-arrow">&#x27A1;</div>
                    <div class="icu-card highlight">
                        <div class="icu-value">${icuValue}</div>
                        <div class="icu-label">Nuits tropicales<br><small>Avec effet ICU</small></div>
                    </div>
                    <div class="icu-diff">+${icuValue - normalValue} nuits</div>
                </div>
            </div>
        `;
    }

    document.getElementById('gauges-section').innerHTML = html;
}

// ============================================
// ILLUSTRATIONS
// ============================================

function updateIllustrations() {
    const s = scenarios[currentScenario];
    const earth = document.getElementById('earth-illustration');
    const river = document.getElementById('river-illustration');
    const ice = document.getElementById('ice-illustration');
    const forest = document.getElementById('forest-illustration');

    // Reset classes
    earth.className = 'earth';
    river.className = 'illustration-container river-scene';
    ice.className = 'illustration-container ice-scene';
    forest.className = 'illustration-container forest-scene';

    // Earth
    const earthDesc = document.getElementById('earth-desc');
    const earthStatus = document.getElementById('earth-status');
    if (s.tempNum >= 4) {
        earth.classList.add('burning');
        earthDesc.textContent = 'Ecosystemes en crise majeure';
        earthStatus.textContent = 'Critique';
        earthStatus.className = 'illustration-status critical';
    } else if (s.tempNum >= 2.7) {
        earth.classList.add('hot');
        earthDesc.textContent = 'Stress ecosystemique generalise';
        earthStatus.textContent = 'Degradation';
        earthStatus.className = 'illustration-status danger';
    } else if (s.tempNum >= 2) {
        earth.classList.add('warming');
        earthDesc.textContent = 'Premiers signes de stress';
        earthStatus.textContent = 'Rechauffement';
        earthStatus.className = 'illustration-status warning';
    } else {
        earthDesc.textContent = 'Ecosystemes en equilibre';
        earthStatus.textContent = 'Stable';
        earthStatus.className = 'illustration-status ok';
    }

    // River
    const riverDesc = document.getElementById('river-desc');
    const riverStatus = document.getElementById('river-status');
    if (s.tempNum >= 4) {
        river.classList.add('cracked');
        riverDesc.textContent = 'Assechement total, sols fissures';
        riverStatus.textContent = 'Asseche';
        riverStatus.className = 'illustration-status critical';
    } else if (s.tempNum >= 2.7) {
        river.classList.add('very-dry');
        riverDesc.textContent = 'Secheresse severe, vegetation fletrie';
        riverStatus.textContent = 'Secheresse';
        riverStatus.className = 'illustration-status danger';
    } else if (s.tempNum >= 2) {
        river.classList.add('dry');
        riverDesc.textContent = 'Baisse du debit, stress hydrique';
        riverStatus.textContent = 'En baisse';
        riverStatus.className = 'illustration-status warning';
    } else {
        riverDesc.textContent = 'Debit normal, vegetation saine';
        riverStatus.textContent = 'Normal';
        riverStatus.className = 'illustration-status ok';
    }

    // Ice
    const iceDesc = document.getElementById('ice-desc');
    const iceStatus = document.getElementById('ice-status');
    if (s.tempNum >= 4) {
        ice.classList.add('gone');
        iceDesc.textContent = 'Banquise disparue, especes menacees';
        iceStatus.textContent = 'Disparue';
        iceStatus.className = 'illustration-status critical';
    } else if (s.tempNum >= 2.7) {
        ice.classList.add('critical');
        iceDesc.textContent = 'Fonte acceleree, habitat reduit';
        iceStatus.textContent = 'Fonte rapide';
        iceStatus.className = 'illustration-status danger';
    } else if (s.tempNum >= 2) {
        ice.classList.add('melting');
        iceDesc.textContent = 'Fonte progressive des glaces';
        iceStatus.textContent = 'En fonte';
        iceStatus.className = 'illustration-status warning';
    } else {
        iceDesc.textContent = 'Glaces stables, habitat preserve';
        iceStatus.textContent = 'Preservee';
        iceStatus.className = 'illustration-status ok';
    }

    // Forest
    const forestDesc = document.getElementById('forest-desc');
    const forestStatus = document.getElementById('forest-status');
    if (s.tempNum >= 4) {
        forest.classList.add('burning');
        forestDesc.textContent = 'Mega-feux, devastation';
        forestStatus.textContent = 'En flammes';
        forestStatus.className = 'illustration-status critical';
    } else if (s.tempNum >= 2.7) {
        forest.classList.add('danger');
        forestDesc.textContent = 'Risque incendie extreme';
        forestStatus.textContent = 'Danger';
        forestStatus.className = 'illustration-status danger';
    } else if (s.tempNum >= 2) {
        forest.classList.add('warning');
        forestDesc.textContent = 'Stress hydrique, feuillage jauni';
        forestStatus.textContent = 'Stress';
        forestStatus.className = 'illustration-status warning';
    } else {
        forestDesc.textContent = 'Vegetation luxuriante';
        forestStatus.textContent = 'Saines';
        forestStatus.className = 'illustration-status ok';
    }
}

// ============================================
// CITY COMPARISON
// ============================================

function renderCityComparison() {
    const analogue = cityAnalogues[currentScenario];
    const paris = cityAnalogues.ref;

    let html = '';

    if (currentScenario === 'ref') {
        html = `
            <div class="city-analogue-single">
                <div class="city-visual highlight">
                    <div class="city-visual-icon">${paris.icon}</div>
                    <div class="city-visual-name">${paris.city}</div>
                    <div class="city-visual-temp">${paris.temp}</div>
                </div>
                <p class="city-analogue-desc">${paris.desc}</p>
            </div>
        `;
    } else {
        html = `
            <div class="city-analogue-comparison">
                <div class="city-visual from">
                    <div class="city-visual-icon">${paris.icon}</div>
                    <div class="city-visual-name">${paris.city}</div>
                    <div class="city-visual-temp">${paris.temp}</div>
                    <div class="city-visual-label">Aujourd'hui</div>
                </div>
                <div class="city-arrow-container">
                    <span class="city-arrow">&#x27A1;</span>
                    <span class="city-arrow-label">${scenarios[currentScenario].temp}</span>
                </div>
                <div class="city-visual to highlight">
                    <div class="city-visual-icon">${analogue.icon}</div>
                    <div class="city-visual-name">${analogue.city}</div>
                    <div class="city-visual-temp">${analogue.temp}</div>
                    <div class="city-visual-label">Climat futur de Paris</div>
                </div>
            </div>
            <p class="city-analogue-desc">${analogue.desc}</p>
        `;
    }

    document.getElementById('city-comparison').innerHTML = html;
}

// ============================================
// CHART
// ============================================

function initChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: getChartData(),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: 'rgba(0,0,0,0.1)' } },
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } }
            }
        }
    });
}

function getChartData() {
    const labels = ['Reference', '+2°C (2030)', '+2.7°C (2050)', '+4°C (2100)'];
    const keys = ['ref', '2030', '2050', '2100'];

    const dataMap = {
        tropical: { data: keys.map(k => scenarios[k].tropicalNights), color: '#ef4444', label: 'Nuits tropicales' },
        hot30: { data: keys.map(k => scenarios[k].days30), color: '#f97316', label: 'Jours > 30°C' },
        hot35: { data: keys.map(k => scenarios[k].days35), color: '#dc2626', label: 'Jours > 35°C' },
        cooling: { data: keys.map(k => scenarios[k].cooling), color: '#0ea5e9', label: 'Besoin en climatisation (DJ)' }
    };

    const d = dataMap[currentChart];
    const currentIdx = keys.indexOf(currentScenario);

    return {
        labels,
        datasets: [{
            data: d.data,
            borderColor: d.color,
            backgroundColor: d.color + '20',
            fill: true,
            tension: 0.4,
            pointRadius: labels.map((_, i) => i === currentIdx ? 12 : 6),
            pointBackgroundColor: labels.map((_, i) => i === currentIdx ? d.color : '#fff'),
            pointBorderColor: d.color,
            pointBorderWidth: 3
        }]
    };
}

function changeChart(type) {
    currentChart = type;
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.toggle('active', t.dataset.chart === type));
    updateChart();
}

function updateChart() {
    chart.data = getChartData();
    chart.update();
}

// ============================================
// TIPPING POINTS
// ============================================

let tippingVersion = 'A'; // 'A' ou 'B'

function switchTippingVersion(version) {
    tippingVersion = version;
    document.querySelectorAll('.tipping-version-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.version === version);
    });
    renderTippingPoints();
}

function renderTippingPoints() {
    if (tippingVersion === 'A') {
        renderTippingPointsVersionA();
    } else {
        renderTippingPointsVersionB();
    }
}

// Version A - Graphique de seuils style The Conversation
function renderTippingPointsVersionA() {
    const currentTemp = scenarios[currentScenario].tempNum;

    let html = `
        <div class="tipping-threshold-chart">
            <div class="threshold-scale">
                <div class="threshold-axis">
                    <span class="axis-label" style="left: 0%">0°C</span>
                    <span class="axis-label" style="left: 25%">1°C</span>
                    <span class="axis-label" style="left: 50%">2°C</span>
                    <span class="axis-label" style="left: 75%">3°C</span>
                    <span class="axis-label" style="left: 100%">4°C</span>
                </div>
                <div class="current-temp-marker" style="left: ${(currentTemp / 4) * 100}%">
                    <span class="current-temp-label">${scenarios[currentScenario].temp}</span>
                </div>
            </div>
    `;

    html += tippingPointsVersionA.map(tp => {
        const leftPos = (tp.thresholdMin / 4) * 100;
        const width = ((tp.thresholdMax - tp.thresholdMin) / 4) * 100;
        const isTriggered = currentTemp >= tp.thresholdMin;
        const isPastMax = currentTemp >= tp.thresholdMax;

        return `
            <div class="tipping-row">
                <div class="tipping-row-label">
                    <span class="tipping-row-icon">${tp.icon}</span>
                    <span class="tipping-row-title">${tp.title}</span>
                </div>
                <div class="tipping-row-bar">
                    <div class="tipping-range ${isTriggered ? 'triggered' : ''} ${isPastMax ? 'critical' : ''}"
                         style="left: ${leftPos}%; width: ${width}%; background: ${tp.color}">
                    </div>
                </div>
                <div class="tipping-row-info">
                    <span class="tipping-range-label">${tp.thresholdMin}-${tp.thresholdMax}°C</span>
                </div>
            </div>
        `;
    }).join('');

    html += `</div>
        <div class="tipping-legend-a">
            <p class="tipping-legend-text">Les barres indiquent la plage de rechauffement ou le point de bascule peut etre declenche. Plus le scenario est chaud, plus le risque augmente.</p>
        </div>
        <div class="tipping-details-grid">
    `;

    html += tippingPointsVersionA.map(tp => {
        const isTriggered = currentTemp >= tp.thresholdMin;
        return `
            <div class="tipping-detail-card ${isTriggered ? 'at-risk' : ''}">
                <div class="tipping-detail-header" style="border-color: ${tp.color}">
                    <span class="tipping-detail-icon">${tp.icon}</span>
                    <span class="tipping-detail-title">${tp.title}</span>
                </div>
                <p class="tipping-detail-desc">${tp.desc}</p>
                <div class="tipping-detail-location">${tp.location}</div>
            </div>
        `;
    }).join('');

    html += `</div>`;

    document.getElementById('tipping-grid').innerHTML = html;
}

// Version B - Carte mondiale avec points de bascule
function renderTippingPointsVersionB() {
    const currentTemp = scenarios[currentScenario].tempNum;

    // SVG de carte du monde simplifie (projection equirectangulaire)
    const worldMapSVG = `
        <svg viewBox="0 0 1000 500" class="world-map-svg">
            <defs>
                <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#1e3a5f"/>
                    <stop offset="100%" style="stop-color:#0f172a"/>
                </linearGradient>
            </defs>
            <!-- Ocean -->
            <rect width="1000" height="500" fill="url(#oceanGradient)"/>
            <!-- Grille -->
            <g stroke="rgba(255,255,255,0.1)" stroke-width="0.5">
                <line x1="0" y1="125" x2="1000" y2="125"/>
                <line x1="0" y1="250" x2="1000" y2="250"/>
                <line x1="0" y1="375" x2="1000" y2="375"/>
                <line x1="250" y1="0" x2="250" y2="500"/>
                <line x1="500" y1="0" x2="500" y2="500"/>
                <line x1="750" y1="0" x2="750" y2="500"/>
            </g>
            <!-- Continents simplifies -->
            <g fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1">
                <!-- Amerique du Nord -->
                <path d="M50,80 L180,60 L220,100 L250,80 L270,120 L250,180 L200,200 L180,280 L120,280 L100,240 L60,200 L50,140 Z"/>
                <!-- Amerique du Sud -->
                <path d="M180,280 L220,290 L260,320 L280,400 L260,450 L220,460 L180,420 L160,350 L170,300 Z"/>
                <!-- Europe -->
                <path d="M420,80 L500,60 L540,80 L560,120 L540,160 L480,180 L440,160 L420,120 Z"/>
                <!-- Afrique -->
                <path d="M420,180 L500,180 L560,220 L580,300 L540,380 L480,400 L420,380 L400,300 L420,220 Z"/>
                <!-- Asie -->
                <path d="M560,60 L700,40 L850,60 L900,100 L920,180 L880,240 L800,260 L720,280 L640,260 L580,220 L560,160 L540,100 Z"/>
                <!-- Inde -->
                <path d="M680,220 L720,200 L760,240 L740,300 L700,320 L660,280 Z"/>
                <!-- Asie du Sud-Est -->
                <path d="M780,280 L840,260 L880,300 L860,340 L800,360 L760,320 Z"/>
                <!-- Australie -->
                <path d="M780,360 L880,340 L920,380 L900,440 L820,460 L760,420 L780,380 Z"/>
                <!-- Groenland -->
                <path d="M320,30 L400,20 L420,60 L400,100 L340,100 L310,60 Z"/>
                <!-- Antarctique -->
                <path d="M100,480 L400,470 L600,475 L900,480 L850,500 L150,500 Z"/>
            </g>
            <!-- Arctique (cercle polaire) -->
            <ellipse cx="500" cy="30" rx="400" ry="20" fill="rgba(224,242,254,0.2)" stroke="none"/>
        </svg>
    `;

    let html = `
        <div class="tipping-map-container">
            <div class="world-map">
                ${worldMapSVG}
                <div class="map-overlay">
    `;

    html += tippingPointsVersionB.map(tp => {
        const isTriggered = currentTemp >= tp.thresholdMin;
        const isPastMax = currentTemp >= tp.thresholdMax;
        const statusClass = isPastMax ? 'critical' : (isTriggered ? 'triggered' : 'safe');
        return `
            <div class="map-point ${statusClass}"
                 style="left: ${tp.x}%; top: ${tp.y}%;"
                 data-id="${tp.id}"
                 onclick="highlightTippingPoint('${tp.id}')">
                <span class="map-point-icon">${tp.icon}</span>
                <div class="map-point-pulse"></div>
                <div class="map-point-tooltip">
                    <div class="tooltip-header" style="border-color: ${tp.color}">
                        <span>${tp.icon}</span> <strong>${tp.title}</strong>
                    </div>
                    <p class="tooltip-desc">${tp.desc}</p>
                    <div class="tooltip-threshold">
                        <span class="threshold-bar" style="--min: ${tp.thresholdMin}; --max: ${tp.thresholdMax}; --current: ${currentTemp}"></span>
                        <span class="threshold-text">Seuil: ${tp.thresholdMin} - ${tp.thresholdMax}°C</span>
                    </div>
                    <div class="tooltip-status ${statusClass}">
                        ${isPastMax ? 'Zone critique depassee' : (isTriggered ? 'Seuil potentiellement atteint' : 'Seuil non atteint')}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    html += `
                </div>
            </div>
            <div class="map-info-bar">
                <div class="map-temp-indicator">
                    Scenario actuel: <strong style="color: ${scenarios[currentScenario].color}">${scenarios[currentScenario].temp}</strong>
                </div>
                <div class="map-legend">
                    <div class="map-legend-item">
                        <span class="map-legend-dot safe"></span>
                        <span>Non atteint</span>
                    </div>
                    <div class="map-legend-item">
                        <span class="map-legend-dot triggered"></span>
                        <span>Seuil atteint</span>
                    </div>
                    <div class="map-legend-item">
                        <span class="map-legend-dot critical"></span>
                        <span>Zone critique</span>
                    </div>
                </div>
            </div>
            <div class="map-stats">
                <div class="map-stat">
                    <span class="map-stat-value">${tippingPointsVersionB.filter(tp => currentTemp >= tp.thresholdMin).length}</span>
                    <span class="map-stat-label">Points a risque</span>
                </div>
                <div class="map-stat">
                    <span class="map-stat-value">${tippingPointsVersionB.filter(tp => currentTemp >= tp.thresholdMax).length}</span>
                    <span class="map-stat-label">Zones critiques</span>
                </div>
                <div class="map-stat">
                    <span class="map-stat-value">${tippingPointsVersionB.length}</span>
                    <span class="map-stat-label">Points surveilles</span>
                </div>
            </div>
        </div>
        <div class="tipping-cards-b" id="tipping-cards-list">
    `;

    // Grouper par categorie
    const categories = {
        ice: { title: "Glaces et poles", points: [] },
        ocean: { title: "Oceans et courants", points: [] },
        forest: { title: "Forets et ecosystemes", points: [] },
        climate: { title: "Climat regional", points: [] }
    };

    tippingPointsVersionB.forEach(tp => {
        if (tp.id.includes('arctic') || tp.id.includes('greenland') || tp.id.includes('antarctica') || tp.id.includes('permafrost')) {
            categories.ice.points.push(tp);
        } else if (tp.id.includes('amoc') || tp.id.includes('coral')) {
            categories.ocean.points.push(tp);
        } else if (tp.id.includes('amazon') || tp.id.includes('boreal')) {
            categories.forest.points.push(tp);
        } else {
            categories.climate.points.push(tp);
        }
    });

    Object.values(categories).forEach(cat => {
        if (cat.points.length > 0) {
            html += `<div class="tipping-category-b"><span class="tipping-category-title">${cat.title}</span><div class="tipping-category-cards">`;
            html += cat.points.map(tp => {
                const isTriggered = currentTemp >= tp.thresholdMin;
                const isPastMax = currentTemp >= tp.thresholdMax;
                return `
                    <div class="tipping-card-b ${isPastMax ? 'critical' : (isTriggered ? 'at-risk' : '')}"
                         data-id="${tp.id}"
                         onclick="highlightTippingPoint('${tp.id}')">
                        <span class="tipping-card-icon">${tp.icon}</span>
                        <div class="tipping-card-content">
                            <strong>${tp.title}</strong>
                            <span class="tipping-card-threshold">${tp.thresholdMin}-${tp.thresholdMax}°C</span>
                        </div>
                    </div>
                `;
            }).join('');
            html += `</div></div>`;
        }
    });

    html += `</div>`;

    document.getElementById('tipping-grid').innerHTML = html;
}

// Fonction pour mettre en surbrillance un point de bascule
function highlightTippingPoint(id) {
    // Reset tous les points
    document.querySelectorAll('.map-point').forEach(p => p.classList.remove('highlighted'));
    document.querySelectorAll('.tipping-card-b').forEach(c => c.classList.remove('highlighted'));

    // Highlight le point selectionne
    const point = document.querySelector(`.map-point[data-id="${id}"]`);
    const card = document.querySelector(`.tipping-card-b[data-id="${id}"]`);

    if (point) {
        point.classList.add('highlighted');
        // Scroll vers le point si hors vue
    }
    if (card) {
        card.classList.add('highlighted');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function updateTippingPoints() {
    renderTippingPoints();
}

// Ancienne fonction conservee pour reference
function updateTippingPointsOld() {
    tippingPoints.forEach(tp => {
        const prob = tp.probs ? tp.probs[currentScenario] : 0;
        const circumference = 2 * Math.PI * 28;
        const offset = circumference - (prob / 100) * circumference;

        const circle = document.querySelector(`circle[data-tp="${tp.title}"]`);
        const text = document.querySelector(`span[data-tp-val="${tp.title}"]`);
        if (circle) circle.style.strokeDashoffset = offset;
        if (text) text.textContent = prob + '%';
    });
}

function renderGlobalImpacts() {
    const g = globalImpactsData[currentScenario];
    document.getElementById('global-impacts').innerHTML = `
        <div class="global-impact">
            <div class="global-impact-icon">&#x1F30A;</div>
            <div class="global-impact-value" style="color: #3b82f6">${g.sea}</div>
            <div class="global-impact-label">Niveau des mers</div>
        </div>
        <div class="global-impact">
            <div class="global-impact-icon">&#x1F6B6;</div>
            <div class="global-impact-value" style="color: #ef4444">${g.refugees}</div>
            <div class="global-impact-label">Refugies climatiques</div>
        </div>
        <div class="global-impact">
            <div class="global-impact-icon">&#x1F98B;</div>
            <div class="global-impact-value" style="color: #22c55e">${g.species}</div>
            <div class="global-impact-label">Especes</div>
        </div>
        <div class="global-impact">
            <div class="global-impact-icon">&#x1F41A;</div>
            <div class="global-impact-value" style="color: #06b6d4">${g.coral}</div>
            <div class="global-impact-label">Coraux restants</div>
        </div>
        <div class="global-impact">
            <div class="global-impact-icon">&#x2744;</div>
            <div class="global-impact-value" style="color: #a855f7">${g.arctic}</div>
            <div class="global-impact-label">Arctique</div>
        </div>
    `;
}

// ============================================
// DARK MODE
// ============================================

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.getElementById('dark-icon').innerHTML = isDarkMode ? '&#x2600;' : '&#x1F319;';
}
