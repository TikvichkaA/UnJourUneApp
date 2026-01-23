// ============================================
// DATA - Climate Scenarios
// ============================================

const scenarios = {
    ref: {
        temp: "Ref", tempNum: 0, color: "#3b82f6", year: "1976-2005",
        markerPos: 0, mercuryHeight: 10,
        maxTemp: 34.1, tropicalNights: 8, days30: 9, days35: 0.7, days40: 0,
        cooling: 62, heating: 2332, fireRisk: 2.3, summerRain: 162, frostDays: 22
    },
    "2030": {
        temp: "+2°C", tempNum: 2, color: "#f97316", year: "2030",
        markerPos: 140, mercuryHeight: 45,
        maxTemp: 36.2, tropicalNights: 17, days30: 15, days35: 2.2, days40: 0.2,
        cooling: 106, heating: 2023, fireRisk: 3.3, summerRain: 154, frostDays: 14
    },
    "2050": {
        temp: "+2.7°C", tempNum: 2.7, color: "#ef4444", year: "2050",
        markerPos: 190, mercuryHeight: 60,
        maxTemp: 37.4, tropicalNights: 26, days30: 22, days35: 4.1, days40: 0.4,
        cooling: 163, heating: 1893, fireRisk: 8, summerRain: 155, frostDays: 11
    },
    "2100": {
        temp: "+4°C", tempNum: 4, color: "#991b1b", year: "2100",
        markerPos: 240, mercuryHeight: 85,
        maxTemp: 39.9, tropicalNights: 42, days30: 33, days35: 8, days40: 1.5,
        cooling: 250, heating: 1627, fireRisk: 9.3, summerRain: 141, frostDays: 7
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
        intervals: { ref: [5, 12], "2030": [12, 23], "2050": [19, 34], "2100": [32, 54] },
        variability: "La variabilite interannuelle peut faire varier ce chiffre de ±30% d'une annee a l'autre selon les conditions meteorologiques.",
        impact: "Troubles du sommeil, surmortalite chez les personnes agees"
    },
    days30: {
        icon: "&#x1F321;&#xFE0F;",
        title: "Jours > 30°C",
        unit: "jours/an",
        definition: "Nombre de jours ou la temperature maximale depasse 30°C. Seuil de vigilance pour les activites exterieures.",
        intervals: { ref: [5, 14], "2030": [10, 21], "2050": [16, 29], "2100": [25, 42] },
        variability: "Forte variabilite selon les etes. Un ete caniculaire peut doubler ce chiffre.",
        impact: "Productivite reduite, stress thermique"
    },
    days35: {
        icon: "&#x1F525;",
        title: "Jours > 35°C",
        unit: "jours/an",
        definition: "Nombre de jours ou la temperature maximale depasse 35°C. Seuil de danger pour la sante.",
        intervals: { ref: [0, 2], "2030": [1, 4], "2050": [2, 7], "2100": [5, 12] },
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
        title: "Degres-jours climatisation",
        unit: "DJ",
        definition: "Indicateur du besoin en climatisation. Somme des ecarts entre temperature moyenne journaliere et 24°C quand celle-ci est depassee.",
        intervals: { ref: [45, 82], "2030": [78, 140], "2050": [120, 210], "2100": [190, 320] },
        variability: "Varie selon l'ensoleillement et les vagues de chaleur estivales.",
        impact: "Augmentation facture energetique, pics de consommation"
    },
    heating: {
        icon: "&#x1F525;",
        title: "Degres-jours chauffage",
        unit: "DJ",
        definition: "Indicateur du besoin en chauffage. Somme des ecarts entre 18°C et la temperature moyenne journaliere quand celle-ci est inferieure.",
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

const tippingPoints = [
    { icon: "&#x1F30A;", title: "Effondrement AMOC", threshold: "+1.5°C", critical: false, desc: "Gulf Stream - refroidissement Europe", color: "#3b82f6", probs: { ref: 10, "2030": 25, "2050": 40, "2100": 60 } },
    { icon: "&#x1F9CA;", title: "Fonte Groenland", threshold: "+1.5°C", critical: true, desc: "+7m niveau mers sur plusieurs siecles", color: "#06b6d4", probs: { ref: 15, "2030": 35, "2050": 55, "2100": 80 } },
    { icon: "&#x1F333;", title: "Amazonie > Savane", threshold: "+2°C", critical: false, desc: "200 Gt CO2 liberes", color: "#22c55e", probs: { ref: 5, "2030": 15, "2050": 35, "2100": 60 } },
    { icon: "&#x1F525;", title: "Mega-feux Med.", threshold: "+2°C", critical: false, desc: "80% forets brulables", color: "#f97316", probs: { ref: 20, "2030": 50, "2050": 70, "2100": 90 } },
    { icon: "&#x2744;", title: "Fonte Permafrost", threshold: "+1.5°C", critical: true, desc: "1500 Gt carbone libere", color: "#a855f7", probs: { ref: 30, "2030": 55, "2050": 75, "2100": 95 } },
    { icon: "&#x1F33E;", title: "Crise agricole", threshold: "+2°C", critical: false, desc: "-30% rendements", color: "#84cc16", probs: { ref: 10, "2030": 30, "2050": 55, "2100": 80 } }
];

const globalImpactsData = {
    ref: { sea: "0 cm", refugees: "~0", species: "Ref", coral: "70%", arctic: "Avec glace" },
    "2030": { sea: "+20 cm", refugees: "140M", species: "-8%", coral: "50%", arctic: "Ete sans glace rare" },
    "2050": { sea: "+40 cm", refugees: "200M", species: "-15%", coral: "30%", arctic: "Ete sans glace freq." },
    "2100": { sea: "+1m", refugees: "500M+", species: "-30%", coral: "~0%", arctic: "Sans glace" }
};

const cityAnalogues = {
    ref: [{ name: "Paris", icon: "&#x1F5FC;", temp: "12.4°C", highlight: true }],
    "2030": [{ name: "Paris", icon: "&#x1F5FC;", temp: "12.4°C" }, { name: "Bordeaux", icon: "&#x1F347;", temp: "13.8°C", highlight: true }],
    "2050": [{ name: "Paris", icon: "&#x1F5FC;", temp: "12.4°C" }, { name: "Lyon", icon: "&#x1F981;", temp: "12.5°C" }, { name: "Montpellier", icon: "&#x1F3D6;&#xFE0F;", temp: "14.2°C", highlight: true }],
    "2100": [{ name: "Paris", icon: "&#x1F5FC;", temp: "12.4°C" }, { name: "Marseille", icon: "&#x26F5;", temp: "15.5°C", highlight: true }, { name: "Seville", icon: "&#x1F1EA;&#x1F1F8;", temp: "18.6°C", highlight: true }]
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

    const gauges = [
        // Chaleur
        { key: 'tropicalNights', label: 'Nuits tropicales', value: s.tropicalNights, max: 60, unit: '/an', color: '#ef4444' },
        { key: 'days30', label: 'Jours > 30°C', value: s.days30, max: 45, unit: '/an', color: '#f97316' },
        { key: 'days35', label: 'Jours > 35°C', value: s.days35, max: 15, unit: '/an', color: '#dc2626' },
        { key: 'days40', label: 'Jours > 40°C', value: s.days40, max: 5, unit: '/an', color: '#7f1d1d' },
        { key: 'maxTemp', label: 'Temp. max record', value: s.maxTemp, max: 45, unit: '°C', color: '#991b1b' },
        // Energie
        { key: 'cooling', label: 'Climatisation', value: s.cooling, max: 300, unit: 'DJ', color: '#0ea5e9' },
        { key: 'heating', label: 'Chauffage', value: s.heating, max: 2500, unit: 'DJ', color: '#f59e0b' },
        // Froid
        { key: 'frostDays', label: 'Jours de gel', value: s.frostDays, max: 30, unit: '/an', color: '#3b82f6' },
        // Risques
        { key: 'fireRisk', label: 'Risque incendie', value: s.fireRisk, max: 15, unit: 'j/an', color: '#ea580c' },
        { key: 'summerRain', label: 'Pluie ete', value: s.summerRain, max: 200, unit: 'mm', color: '#06b6d4' }
    ];

    // Section title
    let html = '<h2 class="section-title" style="grid-column: 1/-1; margin-bottom: 0.5rem;">Indicateurs climatiques detailles</h2>';
    html += '<p class="section-subtitle" style="grid-column: 1/-1; margin-bottom: 1.5rem;">Survolez chaque indicateur pour plus de details techniques</p>';

    html += gauges.map(g => {
        const def = indicatorDefinitions[g.key];
        const refVal = ref[g.key];
        const pct = Math.min(g.value / g.max * 100, 100);
        const circumference = 2 * Math.PI * 70;
        const offset = circumference - (pct / 100) * circumference;
        const change = refVal !== 0 ? ((g.value - refVal) / refVal * 100) : 0;
        // Pour certains indicateurs, une baisse est positive (chauffage, gel, pluie)
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

                <!-- Tooltip pedagogique -->
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
    const cities = cityAnalogues[currentScenario];
    let html = '';

    cities.forEach((city, i) => {
        if (i > 0) html += '<span class="city-arrow">&#x27A1;</span>';
        html += `
            <div class="city-visual ${city.highlight ? 'highlight' : ''}">
                <div class="city-visual-icon">${city.icon}</div>
                <div class="city-visual-name">${city.name}</div>
                <div class="city-visual-temp">${city.temp}</div>
            </div>
        `;
    });

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
        cooling: { data: keys.map(k => scenarios[k].cooling), color: '#0ea5e9', label: 'Climatisation (DJ)' }
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

function renderTippingPoints() {
    document.getElementById('tipping-grid').innerHTML = tippingPoints.map(tp => {
        const prob = tp.probs[currentScenario];
        const circumference = 2 * Math.PI * 28;
        const offset = circumference - (prob / 100) * circumference;

        return `
            <div class="tipping-card">
                <div class="tipping-icon">${tp.icon}</div>
                <div class="tipping-title">${tp.title}</div>
                <span class="tipping-threshold ${tp.critical ? 'critical' : ''}">Seuil ${tp.threshold}</span>
                <p class="tipping-desc">${tp.desc}</p>
                <div class="probability-visual">
                    <div class="probability-circle">
                        <svg width="70" height="70" viewBox="0 0 70 70">
                            <circle class="probability-bg" cx="35" cy="35" r="28"/>
                            <circle class="probability-fill" cx="35" cy="35" r="28" stroke="${tp.color}"
                                style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset}" data-tp="${tp.title}"/>
                        </svg>
                        <span class="probability-text" data-tp-val="${tp.title}">${prob}%</span>
                    </div>
                    <span class="probability-label">Probabilite de declenchement</span>
                </div>
            </div>
        `;
    }).join('');
}

function updateTippingPoints() {
    tippingPoints.forEach(tp => {
        const prob = tp.probs[currentScenario];
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
