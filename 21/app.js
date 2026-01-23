// ============================================
// DATA - Climate Scenarios
// ============================================

const scenarios = {
    ref: {
        temp: "Ref", tempNum: 0, color: "#3b82f6", year: "1976-2005",
        gradientStart: "#3b82f6", gradientEnd: "#1d4ed8",
        maxTemp: 34.1, tropicalNights: 8, days30: 9, days35: 0.7, days40: 0,
        cooling: 62, heating: 2332, fireRisk: 2.3, summerRain: 162, frostDays: 22
    },
    "2030": {
        temp: "+2°C", tempNum: 2, color: "#f97316", year: "2030",
        gradientStart: "#f97316", gradientEnd: "#ea580c",
        maxTemp: 36.2, tropicalNights: 17, days30: 15, days35: 2.2, days40: 0.2,
        cooling: 106, heating: 2023, fireRisk: 3.3, summerRain: 154, frostDays: 14
    },
    "2050": {
        temp: "+2.7°C", tempNum: 2.7, color: "#ef4444", year: "2050",
        gradientStart: "#ef4444", gradientEnd: "#dc2626",
        maxTemp: 37.4, tropicalNights: 26, days30: 22, days35: 4.1, days40: 0.4,
        cooling: 163, heating: 1893, fireRisk: 8, summerRain: 155, frostDays: 11
    },
    "2100": {
        temp: "+4°C", tempNum: 4, color: "#991b1b", year: "2100",
        gradientStart: "#991b1b", gradientEnd: "#7f1d1d",
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
        impact: "Impact sante: troubles du sommeil, surmortalite chez les personnes agees"
    },
    days30: {
        icon: "&#x1F321;&#xFE0F;",
        title: "Jours > 30°C",
        unit: "jours/an",
        definition: "Nombre de jours ou la temperature maximale depasse 30°C. Seuil de vigilance pour les activites exterieures.",
        intervals: { ref: [5, 14], "2030": [10, 21], "2050": [16, 29], "2100": [25, 42] },
        variability: "Forte variabilite selon les etes. Un ete caniculaire peut doubler ce chiffre.",
        impact: "Impact: productivite reduite, stress thermique, augmentation de la consommation d'energie"
    },
    days35: {
        icon: "&#x1F525;",
        title: "Jours > 35°C",
        unit: "jours/an",
        definition: "Nombre de jours ou la temperature maximale depasse 35°C. Seuil de danger pour la sante.",
        intervals: { ref: [0, 2], "2030": [1, 4], "2050": [2, 7], "2100": [5, 12] },
        variability: "Ces evenements extremes sont rares mais leur frequence augmente significativement.",
        impact: "Impact: risque vital pour les personnes vulnerables, arret des chantiers exterieurs"
    },
    days40: {
        icon: "&#x1F975;",
        title: "Jours > 40°C",
        unit: "jours/an",
        definition: "Nombre de jours ou la temperature maximale depasse 40°C. Seuil de danger extreme.",
        intervals: { ref: [0, 0], "2030": [0, 1], "2050": [0, 1], "2100": [1, 3] },
        variability: "Evenements exceptionnels qui deviennent possibles avec le rechauffement.",
        impact: "Impact: conditions potentiellement mortelles, saturation des services d'urgence"
    },
    cooling: {
        icon: "&#x2744;&#xFE0F;",
        title: "Degres-jours de climatisation",
        unit: "DJ",
        definition: "Indicateur du besoin en climatisation. Somme des ecarts entre temperature moyenne journaliere et 24°C quand celle-ci est depassee.",
        intervals: { ref: [45, 82], "2030": [78, 140], "2050": [120, 210], "2100": [190, 320] },
        variability: "Varie selon l'ensoleillement et les vagues de chaleur estivales.",
        impact: "Impact: augmentation de la facture energetique, pics de consommation electrique"
    },
    frostDays: {
        icon: "&#x1F9CA;",
        title: "Jours de gel",
        unit: "jours/an",
        definition: "Nombre de jours ou la temperature minimale descend sous 0°C.",
        intervals: { ref: [17, 28], "2030": [10, 19], "2050": [7, 16], "2100": [4, 11] },
        variability: "Diminution progressive mais des hivers rigoureux restent possibles.",
        impact: "Impact positif: moins de chauffage, mais aussi risques pour certaines cultures et ecosystemes"
    },
    fireRisk: {
        icon: "&#x1F6A8;",
        title: "Jours a risque incendie",
        unit: "jours/an",
        definition: "Nombre de jours ou l'indice Feu Meteo (IFM) depasse le seuil de risque eleve. Combine temperature, humidite, vent et secheresse.",
        intervals: { ref: [1, 4], "2030": [2, 5], "2050": [5, 12], "2100": [6, 14] },
        variability: "Tres dependant des conditions de secheresse accumulee au printemps.",
        impact: "Impact: risque pour les forets periurbaines, qualite de l'air degradee"
    },
    summerRain: {
        icon: "&#x1F4A7;",
        title: "Precipitations estivales",
        unit: "mm",
        definition: "Cumul des precipitations sur les mois de juin, juillet et aout.",
        intervals: { ref: [140, 185], "2030": [130, 180], "2050": [130, 182], "2100": [115, 170] },
        variability: "Grande variabilite naturelle. La tendance est a la baisse mais avec des episodes intenses.",
        impact: "Impact: stress hydrique pour la vegetation, restrictions d'eau possibles"
    }
};

// ============================================
// DATA - Narratives per scenario
// ============================================

const narratives = {
    ref: {
        icon: "&#x2744;&#xFE0F;",
        title: "La periode de reference",
        text: "Entre 1976 et 2005, Paris connaissait un climat tempere oceanique avec des etes agreables et des hivers frais. Les vagues de chaleur etaient rares et les nuits tropicales exceptionnelles."
    },
    "2030": {
        icon: "&#x2600;&#xFE0F;",
        title: "Dans un futur a +2°C...",
        text: "Paris connaitra des etes nettement plus chauds, avec des vagues de chaleur plus frequentes et plus intenses. Les nuits tropicales, ou la temperature ne descend pas sous 20°C, deviendront courantes. C'est la limite fixee par l'Accord de Paris."
    },
    "2050": {
        icon: "&#x1F525;",
        title: "Dans un futur a +2.7°C...",
        text: "Le climat parisien ressemblera a celui de Lyon ou Montpellier aujourd'hui. Les canicules seront frequentes, les nuits tropicales nombreuses. Les besoins en climatisation auront presque triple. C'est la trajectoire actuelle si les engagements ne sont pas tenus."
    },
    "2100": {
        icon: "&#x1F975;",
        title: "Dans un futur a +4°C...",
        text: "Paris aura un climat comparable a Seville en Espagne. Les etes seront eprouvants avec plus d'un mois de jours au-dessus de 30°C et des temperatures depassant parfois 40°C. Les ecosystemes et la sante publique seront severement impactes."
    }
};

// ============================================
// DATA - Tipping Points
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
    renderReferenceSection();
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

    // Update horizon buttons
    document.querySelectorAll('.horizon-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.scenario === id);
    });

    // Update CSS variables for scenario color
    document.documentElement.style.setProperty('--scenario-color', s.color);
    document.documentElement.style.setProperty('--scenario-gradient-start', s.gradientStart);
    document.documentElement.style.setProperty('--scenario-gradient-end', s.gradientEnd);

    // Update narrative transition
    updateNarrative();

    // Update comparison indicators
    renderComparisonGrid();

    // Update illustrations
    updateIllustrations();

    // Update city comparison
    renderCityComparison();

    // Update tipping points
    updateTippingPoints();
    renderGlobalImpacts();

    // Update chart
    if (chart) updateChart();
}

// ============================================
// REFERENCE SECTION
// ============================================

function renderReferenceSection() {
    const ref = scenarios.ref;
    const stats = [
        { key: 'tropicalNights', value: ref.tropicalNights, label: 'Nuits tropicales' },
        { key: 'days30', value: ref.days30, label: 'Jours > 30°C' },
        { key: 'days35', value: ref.days35, label: 'Jours > 35°C' },
        { key: 'frostDays', value: ref.frostDays, label: 'Jours de gel' },
        { key: 'cooling', value: ref.cooling, label: 'Climatisation (DJ)' },
        { key: 'fireRisk', value: ref.fireRisk, label: 'Risque feu (j)' }
    ];

    document.getElementById('reference-stats').innerHTML = stats.map(stat => {
        const def = indicatorDefinitions[stat.key];
        return `
            <div class="ref-stat">
                <div class="ref-stat-value">${stat.value.toFixed(stat.value < 10 ? 1 : 0)}</div>
                <div class="ref-stat-label">${stat.label}</div>
                <div class="tooltip">
                    <div class="tooltip-title">${def.icon} ${def.title}</div>
                    <div class="tooltip-section">
                        <div class="tooltip-label">Definition</div>
                        <div class="tooltip-definition">${def.definition}</div>
                    </div>
                    <div class="tooltip-section">
                        <div class="tooltip-label">Intervalle de confiance</div>
                        <span class="tooltip-interval">[${def.intervals.ref[0]} - ${def.intervals.ref[1]}] ${def.unit}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// NARRATIVE TRANSITION
// ============================================

function updateNarrative() {
    const narrative = narratives[currentScenario];
    const s = scenarios[currentScenario];

    document.getElementById('narrative-icon').innerHTML = narrative.icon;
    document.getElementById('narrative-title').textContent = narrative.title;
    document.getElementById('narrative-text').textContent = narrative.text;
    document.getElementById('narrative-horizon').textContent = currentScenario === 'ref' ? 'Reference 1976-2005' : `Horizon ${s.year}`;

    // Update transition background color via CSS variable
    const transition = document.getElementById('narrative-transition');
    transition.style.setProperty('--scenario-gradient-start', s.gradientStart);
    transition.style.setProperty('--scenario-gradient-end', s.gradientEnd);
}

// ============================================
// COMPARISON GRID WITH TOOLTIPS
// ============================================

function renderComparisonGrid() {
    const ref = scenarios.ref;
    const current = scenarios[currentScenario];

    const indicators = [
        { key: 'tropicalNights', refVal: ref.tropicalNights, futureVal: current.tropicalNights },
        { key: 'days30', refVal: ref.days30, futureVal: current.days30 },
        { key: 'days35', refVal: ref.days35, futureVal: current.days35 },
        { key: 'days40', refVal: ref.days40, futureVal: current.days40 },
        { key: 'cooling', refVal: ref.cooling, futureVal: current.cooling },
        { key: 'frostDays', refVal: ref.frostDays, futureVal: current.frostDays },
        { key: 'fireRisk', refVal: ref.fireRisk, futureVal: current.fireRisk },
        { key: 'summerRain', refVal: ref.summerRain, futureVal: current.summerRain }
    ];

    document.getElementById('comparison-grid').innerHTML = indicators.map(ind => {
        const def = indicatorDefinitions[ind.key];
        const change = ind.refVal !== 0 ? ((ind.futureVal - ind.refVal) / ind.refVal * 100) : 0;
        const isIncrease = ind.futureVal > ind.refVal;
        const changeClass = (ind.key === 'frostDays' || ind.key === 'summerRain')
            ? (isIncrease ? 'decrease' : 'increase')
            : (isIncrease ? 'increase' : 'decrease');
        const changeText = change >= 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;
        const interval = def.intervals[currentScenario] || def.intervals.ref;

        return `
            <div class="comparison-card">
                ${currentScenario !== 'ref' ? `<span class="comparison-change ${changeClass}">${changeText}</span>` : ''}
                <div class="comparison-header">
                    <span class="comparison-icon">${def.icon}</span>
                    <span class="comparison-title">${def.title}</span>
                </div>
                <div class="comparison-values">
                    <div class="comparison-ref">
                        <div class="comparison-ref-value">${ind.refVal.toFixed(ind.refVal < 10 ? 1 : 0)}</div>
                        <div class="comparison-ref-label">Reference</div>
                    </div>
                    <span class="comparison-arrow">&#x27A1;</span>
                    <div class="comparison-future">
                        <div class="comparison-future-value">${ind.futureVal.toFixed(ind.futureVal < 10 ? 1 : 0)}</div>
                        <div class="comparison-future-label">${scenarios[currentScenario].temp}</div>
                    </div>
                </div>
                <!-- Tooltip -->
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
