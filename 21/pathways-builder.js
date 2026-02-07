/**
 * PATHWAYS BUILDER - Dynamic Trajectory Construction Tool
 * Visualisation interactive des trajectoires d'adaptation
 */

// =============================================
// DATA: Actions Library
// =============================================

const ACTIONS_DATABASE = [
    // GREEN ACTIONS - Nature-based solutions
    {
        id: 'veg-massive',
        name: 'Végétalisation massive',
        type: 'green',
        icon: '🌳',
        cost: 180,
        delay: 5,
        riskReduction: 15,
        serviceImpact: 10,
        description: 'Plantation intensive d\'arbres et création de corridors verts dans toute la ville',
        cobenefits: ['Biodiversité', 'Qualité air', 'Bien-être'],
        minYear: 2025,
        maxYear: 2060
    },
    {
        id: 'toits-verts',
        name: 'Toitures végétalisées',
        type: 'green',
        icon: '🏠',
        cost: 120,
        delay: 3,
        riskReduction: 8,
        serviceImpact: 5,
        description: 'Programme de végétalisation des toits sur bâtiments publics et privés',
        cobenefits: ['Isolation', 'Biodiversité', 'Rétention eau'],
        minYear: 2025,
        maxYear: 2070
    },
    {
        id: 'parcs-fraicheur',
        name: 'Parcs de fraîcheur',
        type: 'green',
        icon: '🌲',
        cost: 90,
        delay: 4,
        riskReduction: 10,
        serviceImpact: 8,
        description: 'Création de grands parcs urbains avec plans d\'eau et zones ombragées',
        cobenefits: ['Loisirs', 'Biodiversité', 'Social'],
        minYear: 2025,
        maxYear: 2080
    },
    {
        id: 'corridors-eco',
        name: 'Corridors écologiques',
        type: 'green',
        icon: '🦋',
        cost: 60,
        delay: 6,
        riskReduction: 5,
        serviceImpact: 3,
        description: 'Connexion des espaces verts pour permettre la circulation de la faune',
        cobenefits: ['Biodiversité', 'Résilience éco'],
        minYear: 2030,
        maxYear: 2080
    },

    // BLUE ACTIONS - Water management
    {
        id: 'gestion-eau',
        name: 'Gestion intégrée eau',
        type: 'blue',
        icon: '💧',
        cost: 220,
        delay: 5,
        riskReduction: 18,
        serviceImpact: 12,
        description: 'Système intégré de récupération, stockage et réutilisation des eaux',
        cobenefits: ['Économies', 'Résilience', 'Qualité'],
        minYear: 2025,
        maxYear: 2060
    },
    {
        id: 'desimpermeabilisation',
        name: 'Désimperméabilisation',
        type: 'blue',
        icon: '🌊',
        cost: 150,
        delay: 4,
        riskReduction: 12,
        serviceImpact: 8,
        description: 'Suppression des surfaces imperméables et création de sols drainants',
        cobenefits: ['Infiltration', 'Végétation', 'Fraîcheur'],
        minYear: 2025,
        maxYear: 2070
    },
    {
        id: 'bassins-retention',
        name: 'Bassins de rétention',
        type: 'blue',
        icon: '🏊',
        cost: 180,
        delay: 6,
        riskReduction: 15,
        serviceImpact: 10,
        description: 'Construction de bassins pour absorber les pics de précipitations',
        cobenefits: ['Inondations', 'Loisirs', 'Biodiversité'],
        minYear: 2025,
        maxYear: 2080
    },
    {
        id: 'fontaines-brumisateurs',
        name: 'Fontaines & brumisateurs',
        type: 'blue',
        icon: '⛲',
        cost: 45,
        delay: 2,
        riskReduction: 5,
        serviceImpact: 6,
        description: 'Installation de points d\'eau et systèmes de rafraîchissement urbain',
        cobenefits: ['Confort', 'Social', 'Esthétique'],
        minYear: 2025,
        maxYear: 2050
    },

    // GREY ACTIONS - Infrastructure
    {
        id: 'renovation-thermique',
        name: 'Rénovation thermique',
        type: 'grey',
        icon: '🏗️',
        cost: 450,
        delay: 10,
        riskReduction: 20,
        serviceImpact: 15,
        description: 'Programme massif de rénovation énergétique des bâtiments',
        cobenefits: ['Énergie', 'Confort', 'Précarité'],
        minYear: 2025,
        maxYear: 2050
    },
    {
        id: 'infrastructures-resilientes',
        name: 'Infrastructures résilientes',
        type: 'grey',
        icon: '🔧',
        cost: 320,
        delay: 8,
        riskReduction: 18,
        serviceImpact: 14,
        description: 'Renforcement des réseaux (électricité, transport) face aux aléas',
        cobenefits: ['Fiabilité', 'Sécurité'],
        minYear: 2025,
        maxYear: 2070
    },
    {
        id: 'climatisation-passive',
        name: 'Climatisation passive',
        type: 'grey',
        icon: '❄️',
        cost: 200,
        delay: 5,
        riskReduction: 12,
        serviceImpact: 10,
        description: 'Systèmes de rafraîchissement sans énergie (géothermie, puits canadiens)',
        cobenefits: ['Énergie', 'Autonomie'],
        minYear: 2025,
        maxYear: 2060
    },
    {
        id: 'ilots-fraicheur',
        name: 'Îlots de fraîcheur',
        type: 'grey',
        icon: '🏛️',
        cost: 85,
        delay: 3,
        riskReduction: 8,
        serviceImpact: 7,
        description: 'Aménagement de lieux frais accessibles (musées, bibliothèques, centres)',
        cobenefits: ['Social', 'Santé', 'Culture'],
        minYear: 2025,
        maxYear: 2040
    },

    // ORG ACTIONS - Organizational
    {
        id: 'plan-canicule',
        name: 'Plan canicule renforcé',
        type: 'org',
        icon: '📋',
        cost: 25,
        delay: 1,
        riskReduction: 10,
        serviceImpact: 5,
        description: 'Protocoles d\'urgence et systèmes d\'alerte améliorés',
        cobenefits: ['Santé', 'Communication'],
        minYear: 2025,
        maxYear: 2040
    },
    {
        id: 'formation-agents',
        name: 'Formation des agents',
        type: 'org',
        icon: '👥',
        cost: 15,
        delay: 2,
        riskReduction: 5,
        serviceImpact: 3,
        description: 'Programme de formation des agents publics aux enjeux climatiques',
        cobenefits: ['Compétences', 'Anticipation'],
        minYear: 2025,
        maxYear: 2035
    },
    {
        id: 'urbanisme-adaptatif',
        name: 'Urbanisme adaptatif',
        type: 'org',
        icon: '📐',
        cost: 30,
        delay: 3,
        riskReduction: 12,
        serviceImpact: 8,
        description: 'Révision du PLU avec critères climatiques stricts',
        cobenefits: ['Long terme', 'Cohérence'],
        minYear: 2025,
        maxYear: 2035
    },
    {
        id: 'sensibilisation',
        name: 'Sensibilisation citoyenne',
        type: 'org',
        icon: '📢',
        cost: 20,
        delay: 2,
        riskReduction: 5,
        serviceImpact: 4,
        description: 'Campagnes de communication et implication citoyenne',
        cobenefits: ['Adhésion', 'Comportements'],
        minYear: 2025,
        maxYear: 2050
    },
    {
        id: 'partenariats',
        name: 'Partenariats territoriaux',
        type: 'org',
        icon: '🤝',
        cost: 10,
        delay: 2,
        riskReduction: 6,
        serviceImpact: 4,
        description: 'Coopération avec communes voisines et métropole',
        cobenefits: ['Synergie', 'Mutualisation'],
        minYear: 2025,
        maxYear: 2040
    },
    {
        id: 'suivi-indicateurs',
        name: 'Suivi des indicateurs',
        type: 'org',
        icon: '📊',
        cost: 8,
        delay: 1,
        riskReduction: 3,
        serviceImpact: 2,
        description: 'Mise en place d\'un tableau de bord de suivi climatique',
        cobenefits: ['Pilotage', 'Adaptation'],
        minYear: 2025,
        maxYear: 2030
    }
];

// Priority Services
const PRIORITY_SERVICES = [
    { id: 'sante', name: 'Santé publique', icon: '🏥', impact: 'Critique' },
    { id: 'education', name: 'Éducation', icon: '🎓', impact: 'Élevé' },
    { id: 'transport', name: 'Transports collectifs', icon: '🚇', impact: 'Élevé' },
    { id: 'eau', name: 'Eau potable', icon: '🚰', impact: 'Critique' },
    { id: 'energie', name: 'Énergie (base)', icon: '⚡', impact: 'Critique' },
    { id: 'dechets', name: 'Gestion déchets', icon: '♻️', impact: 'Modéré' },
    { id: 'securite', name: 'Sécurité civile', icon: '🚒', impact: 'Élevé' },
    { id: 'social', name: 'Services sociaux', icon: '🤲', impact: 'Élevé' }
];

// Trajectory Presets
const TRAJECTORY_PRESETS = {
    maintain: {
        name: 'Maintien intégral',
        description: 'Maintenir tous les niveaux de service actuels quelles que soient les conditions climatiques.',
        color: '#10b981',
        actions: ['renovation-thermique', 'infrastructures-resilientes', 'gestion-eau', 'veg-massive', 'plan-canicule']
    },
    degrade: {
        name: 'Dégradation ponctuelle',
        description: 'Accepter des dégradations temporaires lors des événements extrêmes.',
        color: '#f59e0b',
        actions: ['plan-canicule', 'ilots-fraicheur', 'sensibilisation', 'fontaines-brumisateurs']
    },
    transform: {
        name: 'Transformation',
        description: 'Accepter une transformation profonde avec priorisation des services essentiels.',
        color: '#3b82f6',
        actions: ['urbanisme-adaptatif', 'partenariats', 'corridors-eco', 'formation-agents']
    }
};

// =============================================
// STATE
// =============================================

let state = {
    constraints: {
        budget: 2.5,
        horizon: 2050,
        climate: 2.7,
        social: 3,
        technical: 3,
        risk: 3
    },
    placedActions: [],
    selectedTrajectory: 'custom',
    selectedPriorities: ['sante', 'education', 'transport', 'eau'],
    currentView: 'pathways',
    zoom: 1,
    draggedAction: null,
    selectedActionForModal: null
};

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeActions();
    initializePriorities();
    initializeDecisions();
    initializeDragAndDrop();
    initializeCanvas();
    updateVisualization();
});

function initializeActions() {
    const container = document.getElementById('actions-list');
    if (!container) return;

    container.innerHTML = ACTIONS_DATABASE.map(action => `
        <div class="action-item"
             data-id="${action.id}"
             data-type="${action.type}"
             draggable="true">
            <div class="action-icon">${action.icon}</div>
            <div class="action-info">
                <div class="action-name">${action.name}</div>
                <div class="action-meta">
                    <span>${action.cost} M€</span>
                    <span>${action.delay} ans</span>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.action-item').forEach(item => {
        item.addEventListener('click', () => {
            const actionId = item.dataset.id;
            openActionModal(actionId);
        });
    });
}

function initializePriorities() {
    const container = document.getElementById('priority-list');
    if (!container) return;

    container.innerHTML = PRIORITY_SERVICES.map(service => `
        <div class="priority-item ${state.selectedPriorities.includes(service.id) ? 'selected' : ''}"
             data-id="${service.id}"
             onclick="togglePriority('${service.id}')">
            <div class="priority-checkbox"></div>
            <span class="priority-name">${service.icon} ${service.name}</span>
            <span class="priority-impact">${service.impact}</span>
        </div>
    `).join('');
}

function initializeDecisions() {
    const container = document.getElementById('decisions-list');
    if (!container) return;

    const decisions = [
        { year: 2025, title: 'Choix initial', desc: 'Définition de la trajectoire cible' },
        { year: 2030, title: 'Premier bilan', desc: 'Évaluation et ajustements' },
        { year: 2050, title: 'Point critique', desc: 'Révision majeure possible' }
    ];

    container.innerHTML = decisions.map(d => `
        <div class="decision-item" onclick="highlightDecisionPoint(${d.year})">
            <span class="decision-year">${d.year}</span>
            <div class="decision-content">
                <div class="decision-title">${d.title}</div>
                <div class="decision-desc">${d.desc}</div>
            </div>
        </div>
    `).join('');
}

// =============================================
// DRAG AND DROP
// =============================================

function initializeDragAndDrop() {
    const actionsList = document.getElementById('actions-list');
    const canvasContainer = document.getElementById('canvas-container');

    // Drag start
    actionsList?.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('action-item')) {
            state.draggedAction = e.target.dataset.id;
            e.target.classList.add('dragging');
            showDropZones();
        }
    });

    // Drag end
    actionsList?.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('action-item')) {
            e.target.classList.remove('dragging');
            hideDropZones();
            state.draggedAction = null;
        }
    });

    // Canvas drop handling
    canvasContainer?.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    canvasContainer?.addEventListener('drop', (e) => {
        e.preventDefault();
        if (state.draggedAction) {
            const rect = canvasContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const year = calculateYearFromPosition(x, rect.width);

            openActionModalWithYear(state.draggedAction, year);
        }
        hideDropZones();
    });
}

function showDropZones() {
    const container = document.getElementById('canvas-container');
    container?.classList.add('drop-active');
}

function hideDropZones() {
    const container = document.getElementById('canvas-container');
    container?.classList.remove('drop-active');
}

function calculateYearFromPosition(x, width) {
    const padding = 40;
    const effectiveWidth = width - (padding * 2);
    const ratio = Math.max(0, Math.min(1, (x - padding) / effectiveWidth));
    const year = Math.round(2025 + (ratio * 75)); // 2025 to 2100
    return Math.max(2025, Math.min(2100, year));
}

function calculatePositionFromYear(year, width) {
    const padding = 40;
    const effectiveWidth = width - (padding * 2);
    const ratio = (year - 2025) / 75;
    return padding + (ratio * effectiveWidth);
}

// =============================================
// ACTIONS MANAGEMENT
// =============================================

function openActionModal(actionId) {
    openActionModalWithYear(actionId, 2030);
}

function openActionModalWithYear(actionId, year) {
    const action = ACTIONS_DATABASE.find(a => a.id === actionId);
    if (!action) return;

    state.selectedActionForModal = action;

    const modal = document.getElementById('action-modal');
    document.getElementById('modal-icon').textContent = action.icon;
    document.getElementById('modal-action-name').textContent = action.name;
    document.getElementById('modal-category').textContent = getTypeLabel(action.type);
    document.getElementById('modal-description').textContent = action.description;
    document.getElementById('modal-cost').textContent = `${action.cost} M€`;
    document.getElementById('modal-delay').textContent = `${action.delay} ans`;
    document.getElementById('modal-impact').textContent = `-${action.riskReduction}% risque`;
    document.getElementById('modal-cobenefits').textContent = action.cobenefits.join(', ');

    const startYear = Math.max(action.minYear, year);
    const endYear = Math.min(action.maxYear, startYear + action.delay);
    document.getElementById('modal-start-year').value = startYear;
    document.getElementById('modal-end-year').value = endYear;

    modal.style.display = 'flex';
}

function closeActionModal() {
    document.getElementById('action-modal').style.display = 'none';
    state.selectedActionForModal = null;
}

function confirmPlaceAction() {
    if (!state.selectedActionForModal) return;

    const startYear = parseInt(document.getElementById('modal-start-year').value);
    const endYear = parseInt(document.getElementById('modal-end-year').value);

    const placedAction = {
        ...state.selectedActionForModal,
        startYear,
        endYear,
        placedAt: Date.now()
    };

    state.placedActions.push(placedAction);

    closeActionModal();
    updatePlacedActionsList();
    updateVisualization();
    updateMetrics();
    updateAlerts();
}

function removeAction(actionId, placedAt) {
    state.placedActions = state.placedActions.filter(
        a => !(a.id === actionId && a.placedAt === placedAt)
    );
    updatePlacedActionsList();
    updateVisualization();
    updateMetrics();
    updateAlerts();
}

function clearAllActions() {
    state.placedActions = [];
    updatePlacedActionsList();
    updateVisualization();
    updateMetrics();
    updateAlerts();
}

function updatePlacedActionsList() {
    const container = document.getElementById('placed-list');
    const countEl = document.getElementById('actions-count');

    if (!container) return;

    countEl.textContent = state.placedActions.length;

    if (state.placedActions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
                <p>Glissez des actions sur la timeline</p>
            </div>
        `;
        return;
    }

    // Sort by start year
    const sorted = [...state.placedActions].sort((a, b) => a.startYear - b.startYear);

    container.innerHTML = sorted.map(action => `
        <div class="placed-list-item" data-type="${action.type}">
            <div class="item-info">
                <div class="item-name">${action.icon} ${action.name}</div>
                <div class="item-timing">${action.startYear} - ${action.endYear}</div>
            </div>
            <button class="item-remove" onclick="removeAction('${action.id}', ${action.placedAt})">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `).join('');
}

// =============================================
// CONSTRAINTS
// =============================================

function updateConstraint(type, value) {
    state.constraints[type] = parseFloat(value);

    // Update display
    const valueEl = document.getElementById(`${type}-value`);
    if (valueEl) {
        switch (type) {
            case 'budget':
                valueEl.textContent = `${value} Mds€`;
                break;
            case 'horizon':
                valueEl.textContent = value;
                break;
            case 'climate':
                valueEl.textContent = `+${value}°C`;
                break;
            case 'social':
                valueEl.textContent = getSocialLabel(value);
                break;
            case 'technical':
                valueEl.textContent = getTechnicalLabel(value);
                break;
            case 'risk':
                valueEl.textContent = getRiskLabel(value);
                break;
        }
    }

    updateVisualization();
    updateMetrics();
    updateAlerts();
}

function getSocialLabel(value) {
    const labels = ['Très faible', 'Faible', 'Moyenne', 'Bonne', 'Excellente'];
    return labels[value - 1] || 'Moyenne';
}

function getTechnicalLabel(value) {
    const labels = ['Limitée', 'Basique', 'Moyenne', 'Bonne', 'Avancée'];
    return labels[value - 1] || 'Moyenne';
}

function getRiskLabel(value) {
    const labels = ['Très averse', 'Averse', 'Modérée', 'Tolérant', 'Très tolérant'];
    return labels[value - 1] || 'Modérée';
}

function getTypeLabel(type) {
    const labels = {
        green: 'Solution verte',
        blue: 'Gestion de l\'eau',
        grey: 'Infrastructure',
        org: 'Organisationnel'
    };
    return labels[type] || type;
}

// =============================================
// PRIORITIES
// =============================================

function togglePriority(id) {
    const index = state.selectedPriorities.indexOf(id);
    if (index > -1) {
        state.selectedPriorities.splice(index, 1);
    } else {
        state.selectedPriorities.push(id);
    }
    initializePriorities();
    updateVisualization();
}

// =============================================
// TRAJECTORY SELECTION
// =============================================

function selectTrajectory(type) {
    state.selectedTrajectory = type;

    document.querySelectorAll('.traj-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.traj === type);
    });

    const descEl = document.getElementById('trajectory-description');
    if (type === 'custom') {
        descEl.innerHTML = '<p>Construisez votre propre trajectoire en plaçant des actions sur la timeline et en ajustant les contraintes.</p>';
    } else {
        const preset = TRAJECTORY_PRESETS[type];
        descEl.innerHTML = `<p>${preset.description}</p>`;
    }

    updateVisualization();
}

function applyPreset(type) {
    const preset = TRAJECTORY_PRESETS[type];
    if (!preset) return;

    // Clear existing and add preset actions
    state.placedActions = [];

    preset.actions.forEach((actionId, index) => {
        const action = ACTIONS_DATABASE.find(a => a.id === actionId);
        if (action) {
            const startYear = 2025 + (index * 5);
            state.placedActions.push({
                ...action,
                startYear,
                endYear: startYear + action.delay,
                placedAt: Date.now() + index
            });
        }
    });

    updatePlacedActionsList();
    updateVisualization();
    updateMetrics();
}

// =============================================
// CANVAS VISUALIZATION
// =============================================

function initializeCanvas() {
    const canvas = document.getElementById('pathways-canvas');
    if (!canvas) return;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    drawPathways();
}

function resizeCanvas() {
    const canvas = document.getElementById('pathways-canvas');
    const container = document.getElementById('canvas-container');
    if (!canvas || !container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight - 60; // Subtract time axis height

    drawPathways();
}

function drawPathways() {
    const canvas = document.getElementById('pathways-canvas');
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    drawGrid(ctx, width, height);

    // Draw service level zones
    drawServiceZones(ctx, width, height);

    // Draw trajectories based on constraints and actions
    drawTrajectoryPaths(ctx, width, height);

    // Draw placed actions on canvas
    drawPlacedActionsOnCanvas(ctx, width, height);

    // Draw decision points
    drawDecisionPoints(ctx, width, height);
}

function drawGrid(ctx, width, height) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    // Vertical lines (time)
    const timePoints = [2025, 2030, 2040, 2050, 2075, 2100];
    timePoints.forEach(year => {
        const x = calculatePositionFromYear(year, width);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    });

    // Horizontal lines (service levels)
    for (let i = 0; i < 5; i++) {
        const y = (height / 5) * i + (height / 10);
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(width - 40, y);
        ctx.stroke();
    }
}

function drawServiceZones(ctx, width, height) {
    const zones = [
        { label: 'Optimal', color: 'rgba(16, 185, 129, 0.1)' },
        { label: 'Bon', color: 'rgba(34, 197, 94, 0.08)' },
        { label: 'Dégradé', color: 'rgba(245, 158, 11, 0.08)' },
        { label: 'Critique', color: 'rgba(249, 115, 22, 0.08)' },
        { label: 'Défaillance', color: 'rgba(239, 68, 68, 0.08)' }
    ];

    const zoneHeight = height / zones.length;

    zones.forEach((zone, i) => {
        ctx.fillStyle = zone.color;
        ctx.fillRect(40, i * zoneHeight, width - 80, zoneHeight);

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(zone.label, 50, i * zoneHeight + 20);
    });
}

function drawTrajectoryPaths(ctx, width, height) {
    const padding = 40;
    const effectiveHeight = height - 40;

    // Calculate trajectory based on constraints and actions
    const trajectory = calculateTrajectory();

    // Draw uncertainty envelope
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.beginPath();

    trajectory.forEach((point, i) => {
        const x = calculatePositionFromYear(point.year, width);
        const yUpper = 60 + (point.levelUpper / 100) * (effectiveHeight - 60);
        const yLower = 60 + (point.levelLower / 100) * (effectiveHeight - 60);

        if (i === 0) {
            ctx.moveTo(x, yUpper);
        } else {
            ctx.lineTo(x, yUpper);
        }
    });

    for (let i = trajectory.length - 1; i >= 0; i--) {
        const point = trajectory[i];
        const x = calculatePositionFromYear(point.year, width);
        const yLower = 60 + (point.levelLower / 100) * (effectiveHeight - 60);
        ctx.lineTo(x, yLower);
    }

    ctx.closePath();
    ctx.fill();

    // Draw main trajectory line
    const trajColor = state.selectedTrajectory === 'custom'
        ? '#ec4899'
        : TRAJECTORY_PRESETS[state.selectedTrajectory]?.color || '#3b82f6';

    ctx.strokeStyle = trajColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    trajectory.forEach((point, i) => {
        const x = calculatePositionFromYear(point.year, width);
        const y = 60 + (point.level / 100) * (effectiveHeight - 60);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Draw current position marker
    const currentX = calculatePositionFromYear(2025, width);
    ctx.fillStyle = trajColor;
    ctx.beginPath();
    ctx.arc(currentX, 60 + (trajectory[0].level / 100) * (effectiveHeight - 60), 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function calculateTrajectory() {
    const baseLevel = 10; // Starting at optimal
    const years = [2025, 2030, 2040, 2050, 2075, 2100];

    return years.map(year => {
        // Base degradation from climate
        let degradation = ((year - 2025) / 75) * (state.constraints.climate / 4) * 50;

        // Mitigation from actions
        const activeActions = state.placedActions.filter(
            a => a.startYear <= year && a.endYear >= year
        );

        const mitigation = activeActions.reduce((sum, a) => sum + a.riskReduction, 0);
        degradation = Math.max(0, degradation - mitigation);

        // Budget constraint
        const totalCost = state.placedActions.reduce((sum, a) => sum + a.cost, 0);
        const budgetFactor = totalCost > (state.constraints.budget * 1000) ? 1.2 : 1;
        degradation *= budgetFactor;

        // Risk tolerance affects uncertainty
        const uncertainty = (5 - state.constraints.risk) * 5;

        const level = Math.min(90, baseLevel + degradation);

        return {
            year,
            level,
            levelUpper: Math.min(95, level + uncertainty),
            levelLower: Math.max(5, level - uncertainty)
        };
    });
}

function drawPlacedActionsOnCanvas(ctx, width, height) {
    const container = document.getElementById('placed-actions');
    if (!container) return;

    container.innerHTML = '';

    state.placedActions.forEach(action => {
        const x = calculatePositionFromYear(action.startYear, width);
        const trajectory = calculateTrajectory();
        const trajPoint = trajectory.find(t => t.year >= action.startYear) || trajectory[0];
        const y = 60 + (trajPoint.level / 100) * (height - 120);

        const el = document.createElement('div');
        el.className = 'placed-action';
        el.dataset.type = action.type;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.innerHTML = `
            <div class="action-title">${action.icon} ${action.name}</div>
            <div class="action-year">${action.startYear}-${action.endYear}</div>
            <button class="remove-btn" onclick="removeAction('${action.id}', ${action.placedAt})">&times;</button>
        `;
        container.appendChild(el);
    });
}

function drawDecisionPoints(ctx, width, height) {
    const decisionYears = [2030, 2050];
    const trajectory = calculateTrajectory();

    decisionYears.forEach(year => {
        const x = calculatePositionFromYear(year, width);
        const trajPoint = trajectory.find(t => t.year >= year) || trajectory[0];
        const y = 60 + (trajPoint.level / 100) * (height - 120);

        // Diamond shape for decision point
        ctx.fillStyle = '#1e40af';
        ctx.beginPath();
        ctx.moveTo(x, y - 10);
        ctx.lineTo(x + 10, y);
        ctx.lineTo(x, y + 10);
        ctx.lineTo(x - 10, y);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function updateVisualization() {
    drawPathways();
}

// =============================================
// METRICS
// =============================================

function updateMetrics() {
    const totalCost = state.placedActions.reduce((sum, a) => sum + a.cost, 0);
    const totalRiskReduction = state.placedActions.reduce((sum, a) => sum + a.riskReduction, 0);
    const avgServiceImpact = state.placedActions.length > 0
        ? state.placedActions.reduce((sum, a) => sum + a.serviceImpact, 0) / state.placedActions.length
        : 0;

    // Update displays
    document.getElementById('total-cost').textContent = `${totalCost} M€`;
    document.getElementById('risk-reduction').textContent = `${Math.min(100, totalRiskReduction)}%`;

    const serviceLevel = calculateServiceLevel(totalRiskReduction);
    document.getElementById('service-level').textContent = serviceLevel.label;

    const viability = calculateViability();
    document.getElementById('viability').textContent = viability.label;

    // Update bars
    const budgetMax = state.constraints.budget * 1000;
    document.getElementById('cost-bar').style.width = `${Math.min(100, (totalCost / budgetMax) * 100)}%`;
    document.getElementById('risk-bar').style.width = `${Math.min(100, totalRiskReduction)}%`;
    document.getElementById('service-bar').style.width = `${serviceLevel.percent}%`;
    document.getElementById('viability-bar').style.width = `${viability.percent}%`;
}

function calculateServiceLevel(riskReduction) {
    const climateImpact = state.constraints.climate * 15;
    const netLevel = 100 - climateImpact + riskReduction;

    if (netLevel >= 80) return { label: 'Optimal', percent: 90 };
    if (netLevel >= 60) return { label: 'Bon', percent: 70 };
    if (netLevel >= 40) return { label: 'Dégradé', percent: 50 };
    if (netLevel >= 20) return { label: 'Critique', percent: 30 };
    return { label: 'Défaillant', percent: 10 };
}

function calculateViability() {
    const totalCost = state.placedActions.reduce((sum, a) => sum + a.cost, 0);
    const budgetMax = state.constraints.budget * 1000;
    const riskReduction = state.placedActions.reduce((sum, a) => sum + a.riskReduction, 0);

    let score = 50;

    // Budget compliance
    if (totalCost <= budgetMax) score += 20;
    else if (totalCost <= budgetMax * 1.2) score += 10;
    else score -= 10;

    // Risk coverage
    const neededReduction = state.constraints.climate * 15;
    if (riskReduction >= neededReduction) score += 20;
    else if (riskReduction >= neededReduction * 0.7) score += 10;

    // Diversity of actions
    const types = new Set(state.placedActions.map(a => a.type));
    score += types.size * 5;

    if (score >= 80) return { label: 'Robuste', percent: 90 };
    if (score >= 60) return { label: 'Viable', percent: 70 };
    if (score >= 40) return { label: 'Fragile', percent: 45 };
    return { label: 'Critique', percent: 20 };
}

// =============================================
// ALERTS
// =============================================

function updateAlerts() {
    const container = document.getElementById('alerts-list');
    if (!container) return;

    const alerts = [];

    // Budget check
    const totalCost = state.placedActions.reduce((sum, a) => sum + a.cost, 0);
    const budgetMax = state.constraints.budget * 1000;

    if (totalCost > budgetMax * 1.2) {
        alerts.push({
            type: 'danger',
            text: `Budget dépassé de ${Math.round(((totalCost / budgetMax) - 1) * 100)}%. Réduisez les actions ou augmentez le budget.`
        });
    } else if (totalCost > budgetMax) {
        alerts.push({
            type: 'warning',
            text: `Budget légèrement dépassé. Arbitrages nécessaires.`
        });
    }

    // Climate vs actions check
    const riskReduction = state.placedActions.reduce((sum, a) => sum + a.riskReduction, 0);
    const neededReduction = state.constraints.climate * 15;

    if (riskReduction < neededReduction * 0.5) {
        alerts.push({
            type: 'danger',
            text: `Couverture des risques insuffisante pour le scénario ${state.constraints.climate}°C.`
        });
    } else if (riskReduction < neededReduction) {
        alerts.push({
            type: 'warning',
            text: `Actions supplémentaires recommandées pour ce scénario climatique.`
        });
    }

    // Missing action types
    const types = new Set(state.placedActions.map(a => a.type));
    if (!types.has('org') && state.placedActions.length > 2) {
        alerts.push({
            type: 'info',
            text: `Pensez à ajouter des actions organisationnelles pour renforcer la gouvernance.`
        });
    }

    // Success message
    if (alerts.length === 0 && state.placedActions.length > 0) {
        alerts.push({
            type: 'success',
            text: `Trajectoire cohérente avec les contraintes définies.`
        });
    }

    if (alerts.length === 0) {
        alerts.push({
            type: 'info',
            text: `Ajustez les contraintes et placez des actions pour voir les alertes.`
        });
    }

    container.innerHTML = alerts.map(alert => `
        <div class="alert-item ${alert.type}">
            <span class="alert-icon">${alert.type === 'success' ? '✓' : alert.type === 'danger' ? '!' : 'i'}</span>
            <span class="alert-text">${alert.text}</span>
        </div>
    `).join('');
}

// =============================================
// VIEW SWITCHING
// =============================================

function switchView(view) {
    state.currentView = view;

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    // For now, all views use the same canvas
    // Future: implement timeline and sankey views
    drawPathways();
}

// =============================================
// ZOOM CONTROLS
// =============================================

function zoomIn() {
    state.zoom = Math.min(2, state.zoom + 0.1);
    updateVisualization();
}

function zoomOut() {
    state.zoom = Math.max(0.5, state.zoom - 0.1);
    updateVisualization();
}

function fitToView() {
    state.zoom = 1;
    updateVisualization();
}

// =============================================
// UTILITIES
// =============================================

function toggleSection(section) {
    const content = document.getElementById(`${section}-content`);
    const btn = content?.previousElementSibling?.querySelector('.collapse-btn');

    if (content) {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
        btn?.classList.toggle('collapsed');
    }
}

function filterActions(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    document.querySelectorAll('.action-item').forEach(item => {
        if (filter === 'all' || item.dataset.type === filter) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function highlightDecisionPoint(year) {
    // Scroll canvas to show decision point
    console.log('Highlight decision point:', year);
}

function resetAll() {
    state.placedActions = [];
    state.selectedTrajectory = 'custom';
    state.constraints = {
        budget: 2.5,
        horizon: 2050,
        climate: 2.7,
        social: 3,
        technical: 3,
        risk: 3
    };

    // Reset sliders
    document.getElementById('budget-slider').value = 2.5;
    document.getElementById('horizon-slider').value = 2050;
    document.getElementById('climate-slider').value = 2.7;
    document.getElementById('social-slider').value = 3;
    document.getElementById('technical-slider').value = 3;
    document.getElementById('risk-slider').value = 3;

    // Update displays
    Object.keys(state.constraints).forEach(key => {
        updateConstraint(key, state.constraints[key]);
    });

    selectTrajectory('custom');
    updatePlacedActionsList();
    updateVisualization();
    updateMetrics();
    updateAlerts();
}

function exportScenario() {
    const data = {
        constraints: state.constraints,
        actions: state.placedActions.map(a => ({
            id: a.id,
            name: a.name,
            startYear: a.startYear,
            endYear: a.endYear,
            cost: a.cost
        })),
        priorities: state.selectedPriorities,
        trajectory: state.selectedTrajectory,
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trajectoire-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function saveScenario() {
    const data = {
        constraints: state.constraints,
        actions: state.placedActions,
        priorities: state.selectedPriorities,
        trajectory: state.selectedTrajectory
    };

    localStorage.setItem('pathways-builder-scenario', JSON.stringify(data));
    alert('Scénario sauvegardé localement');
}

// Load saved scenario on init
function loadSavedScenario() {
    const saved = localStorage.getItem('pathways-builder-scenario');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            state.constraints = data.constraints || state.constraints;
            state.placedActions = data.actions || [];
            state.selectedPriorities = data.priorities || state.selectedPriorities;
            state.selectedTrajectory = data.trajectory || 'custom';
        } catch (e) {
            console.error('Error loading saved scenario:', e);
        }
    }
}

// Export global functions
window.updateConstraint = updateConstraint;
window.togglePriority = togglePriority;
window.selectTrajectory = selectTrajectory;
window.filterActions = filterActions;
window.toggleSection = toggleSection;
window.openActionModal = openActionModal;
window.closeActionModal = closeActionModal;
window.confirmPlaceAction = confirmPlaceAction;
window.removeAction = removeAction;
window.clearAllActions = clearAllActions;
window.switchView = switchView;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.fitToView = fitToView;
window.resetAll = resetAll;
window.exportScenario = exportScenario;
window.saveScenario = saveScenario;
window.highlightDecisionPoint = highlightDecisionPoint;
