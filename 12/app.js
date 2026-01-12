// Configuration
const CONFIG = {
    cycleStart: new Date('2025-01-01'),
    cycleLength: 42,
    siteName: 'Babinski'
};

// Jours fériés 2026
const FERIES_2026 = [
    '2026-01-01', // Nouvel an
    '2026-04-06', // Lundi de Pâques
    '2026-05-01', // Fête du travail
    '2026-05-08', // Victoire 1945
    '2026-05-14', // Ascension
    '2026-05-25', // Lundi de Pentecôte
    '2026-07-14', // Fête nationale
    '2026-08-15', // Assomption
    '2026-11-01', // Toussaint
    '2026-11-11', // Armistice
    '2026-12-25'  // Noël
];

// Codes de shift avec leurs descriptions et catégories
const SHIFT_CODES = {
    // Jour - Accueil
    '12j': { desc: 'Accueil jour 12h (8h-20h)', hours: 12, type: 'jour', category: 'accueil' },
    '9,2j': { desc: 'Accueil jour 9h20 (13h45-23h)', hours: 9.33, type: 'jour', category: 'accueil' },
    '7,5a': { desc: 'Accueil admin 7h30 (6h45-14h15)', hours: 7.5, type: 'jour', category: 'accueil' },
    '7a': { desc: 'Accueil admin 7h', hours: 7, type: 'jour', category: 'accueil' },

    // Nuit - Accueil
    '12n': { desc: 'Accueil nuit 12h (20h-8h)', hours: 12, type: 'nuit', category: 'accueil' },
    '8,2n': { desc: 'Accueil nuit 8h20 (22h45-7h)', hours: 8.33, type: 'nuit', category: 'accueil' },

    // Restauration
    '8,5ra': { desc: 'Restauration A 8h30', hours: 8.5, type: 'jour', category: 'restauration' },
    '8,5rb': { desc: 'Restauration B 8h30', hours: 8.5, type: 'jour', category: 'restauration' },
    '8,5rm': { desc: 'Restauration M 8h30', hours: 8.5, type: 'jour', category: 'restauration' },
    '7rc': { desc: 'Restauration C 7h', hours: 7, type: 'jour', category: 'restauration' },
    '7rd': { desc: 'Restauration D 7h', hours: 7, type: 'jour', category: 'restauration' },
    '9rs': { desc: 'Restauration S 9h', hours: 9, type: 'jour', category: 'restauration' },
    '10,5rm': { desc: 'Restauration M 10h30', hours: 10.5, type: 'jour', category: 'restauration' },

    // Entretien
    '8ea': { desc: 'Entretien A 8h', hours: 8, type: 'jour', category: 'entretien' },
    '8eb': { desc: 'Entretien B 8h', hours: 8, type: 'jour', category: 'entretien' },
    '8ec': { desc: 'Entretien C 8h', hours: 8, type: 'jour', category: 'entretien' },
    '8ed': { desc: 'Entretien D 8h', hours: 8, type: 'jour', category: 'entretien' },
    '8e.1': { desc: 'Entretien 1 8h', hours: 8, type: 'jour', category: 'entretien' },
    '8e.2': { desc: 'Entretien 2 8h', hours: 8, type: 'jour', category: 'entretien' },
    '8w': { desc: 'Entretien W 8h', hours: 8, type: 'jour', category: 'entretien' },
    '8W': { desc: 'Entretien W 8h', hours: 8, type: 'jour', category: 'entretien' },
    '8T': { desc: 'Polyvalent T 8h', hours: 8, type: 'jour', category: 'entretien' },

    // Standard
    'P': { desc: 'Présent', hours: 7, type: 'present', category: 'admin' },
    '7': { desc: 'Journée 7h', hours: 7, type: 'jour', category: 'admin' },

    // Absences et congés
    'CP': { desc: 'Congé payé', hours: 0, type: 'conge', category: 'absence' },
    'Am': { desc: 'Arrêt maladie', hours: 0, type: 'absent', category: 'absence' },
    'ABS': { desc: 'Absent', hours: 0, type: 'absent', category: 'absence' },
    'Abs': { desc: 'Absent', hours: 0, type: 'absent', category: 'absence' },
    'FOR': { desc: 'Formation', hours: 7, type: 'formation', category: 'formation' },
    'For': { desc: 'Formation', hours: 7, type: 'formation', category: 'formation' },
    'FS': { desc: 'Formation syndicale', hours: 7, type: 'formation', category: 'formation' },
    'F': { desc: 'Férié', hours: 0, type: 'ferie', category: 'ferie' },
    'tp': { desc: 'Temps partiel', hours: 0, type: 'repos', category: 'repos' }
};

// Catégories d'employés
const CATEGORIES = {
    responsables: { name: 'Responsables Site/CHU', icon: '👔', color: '#1a56db' },
    coordination: { name: 'Coordination Site/CHU', icon: '📋', color: '#7c3aed' },
    maintenance: { name: 'Agent Maintenance/Log', icon: '🔧', color: '#059669' },
    administratif: { name: 'Agent Administratif', icon: '📝', color: '#d97706' },
    restauration: { name: 'Agent de Restauration', icon: '🍽️', color: '#dc2626' },
    accueil: { name: 'Agent d\'Accueil', icon: '🏠', color: '#0891b2' },
    entretien: { name: 'Agent d\'Entretien', icon: '🧹', color: '#65a30d' },
    polyvalent: { name: 'Agent Polyvalent', icon: '⚡', color: '#be185d' }
};

// Données des employés avec leur planning de janvier 2026
let EMPLOYEES = [
    // Responsables
    {
        id: 1,
        name: 'Nicolas Boyer',
        category: 'responsables',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F','P',null,null,'P','P','P','P','P',null,null,'P','P','P','P','P',null,null,'P','P','P','P','P',null,null,'P','P','P','P','P',null]
        }
    },
    {
        id: 2,
        name: 'Lizzeth Vazquez',
        category: 'responsables',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F','P',null,null,'P','P','P','P','P',null,null,'P','P','P','P','P',null,null,'P','P','P','P','P',null,null,'P','P','P','P','P',null]
        }
    },
    // Coordination
    {
        id: 3,
        name: 'Pamela Breter',
        category: 'coordination',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F','P','P',null,null,'P','P','P','P','P',null,null,'P','P','P','P','P',null,null,'P','P','P','P','P',null,'P','P','P','P','P',null]
        }
    },
    // Maintenance
    {
        id: 4,
        name: 'Farid Mojahed',
        category: 'maintenance',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F','P',null,null,'P','P','P','P','P',null,null,'P','P','P','P','P',null,null,'P','P','P','P','P','12j',null,'P','P','P','P','P',null]
        }
    },
    // Administratif
    {
        id: 5,
        name: 'Angélique Gomis',
        category: 'administratif',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F','P',null,null,'P','P','P','P','P',null,null,'P','P','P','P','P',null,null,'P','ABS','P','P','P',null,null,'P','P','P','P','P',null]
        }
    },
    // Restauration
    {
        id: 6,
        name: 'Léonie Laza-Manzambi',
        category: 'restauration',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F',null,null,null,'7rd','7rc',null,null,'8,5ra','10,5rm','10,5rm',null,null,'8,5ra','8,5rb','7rc',null,null,'8,5ra','8,5rb','7rd',null,null,'8,5rm','8,5rm','7rc','7rd',null,null,'8,5rb','9rs']
        }
    },
    {
        id: 7,
        name: 'Elise Mbappe',
        category: 'restauration',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F','7rc',null,null,'8,5ra','8,5rb','7rd','7rc',null,null,null,'7rc','7rd','FS',null,'8,5ra','9rs','9rs',null,null,'8,5rb','8,5ra','7rc',null,null,'8,5rb','8,5ra','7rd','FOR',null,'8,5rm']
        }
    },
    {
        id: 8,
        name: 'Kamel Ben Slimen',
        category: 'restauration',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F','8,5rb','9rs','9rs',null,null,'8,5ra','8,5rb','7rc',null,null,'8,5ra','8,5rb','7rc','7rd',null,null,null,'7rc','7rd',null,null,'8,5ra','10,5rm','10,5rm','FOR',null,'8,5ra','8,5rb','7rc',null]
        }
    },
    {
        id: 9,
        name: 'Hakim Haddag',
        category: 'restauration',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F',null,'8,5rm','8,5rm','7rc','7rd',null,'FS','8,5rb','9rs','9rs',null,null,'8,5rb','8,5ra','7rd',null,null,'8,5rb','8,5ra','7rc','7rd',null,null,'9rs','7rd','7rc',null,null,'8,5ra','10,5rm']
        }
    },
    {
        id: 10,
        name: 'Papy Bokekete',
        category: 'restauration',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F','7rd',null,null,'8,5rb','8,5ra','7rc',null,null,'8,5rm','8,5rm','7rd','7rc',null,null,'8,5rb','10,5rm','10,5rm',null,null,'8,5ra','8,5rb','7rd',null,null,'8,5ra','8,5rb','7rc','7rd',null,null]
        }
    },
    {
        id: 11,
        name: 'Flora Bertille',
        category: 'restauration',
        type: 'vacataire',
        planning: {
            '2026-01': [null,'F','8,5ra','10,5rm','tp',null,null,'tp','8,5ra','tp',null,null,'tp','8,5ra','tp',null,null,'tp','8,5rm','tp','7rc',null,null,'8,5rb','9rs','tp',null,null,'tp','8,5ra','tp',null]
        }
    },
    // Accueil
    {
        id: 12,
        name: 'Rosa Rodriguez',
        category: 'accueil',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F','9,2j',null,null,'9,2j','9,2j',null,null,null,'12j','12j',null,null,'9,2j','9,2j','9,2j',null,null,'9,2j','9,2j',null,null,null,'12j','12j',null,null,'9,2j','9,2j','9,2j',null]
        }
    },
    {
        id: 13,
        name: 'Junior Kafinga',
        category: 'accueil',
        type: 'interimaire',
        planning: {
            '2026-01': [null,'F',null,'12j','12j',null,null,'9,2j','9,2j','9,2j',null,null,'9,2j','9,2j',null,null,null,'12j','12j',null,null,'9,2j','9,2j','9,2j',null,null,'9,2j','9,2j',null,null,null,'12j']
        }
    },
    {
        id: 14,
        name: 'Christophe Marchandise',
        category: 'accueil',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F','7,5a',null,null,'7,5a','7,5a','7,5a','7,5a','7,5a',null,null,'7,5a','7,5a','7,5a','7,5a','7,5a',null,null,'7,5a','7,5a','7,5a','7,5a','7,5a',null,null,'7,5a','7,5a','7,5a','7,5a','7,5a',null]
        }
    },
    {
        id: 15,
        name: 'Ali Ziani',
        category: 'accueil',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F','8,2n',null,null,'8,2n','8,2n',null,null,null,'12n','12n',null,null,'8,2n','8,2n','8,2n',null,null,'8,2n','8,2n',null,null,null,'12n','12n',null,null,'8,2n','8,2n','8,2n',null]
        }
    },
    {
        id: 16,
        name: 'Andreea Bancos',
        category: 'accueil',
        type: 'interimaire',
        planning: {
            '2026-01': [null,'F',null,'12n','12n',null,null,'8,2n','8,2n','8,2n',null,null,'8,2n','8,2n',null,null,null,'12n','12n',null,null,'8,2n','8,2n','8,2n',null,null,'8,2n','8,2n',null,null,null,'12n']
        }
    },
    // Entretien
    {
        id: 17,
        name: 'Claudine Kisonga',
        category: 'entretien',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F',null,'8e.1','8e.2','8eb',null,null,'8ed','8ea',null,null,'8eb','8ea','8ed','8ec','8ed',null,null,'8ec','8ec','8ed',null,null,'8e.1','8e.2','8eb',null,null,'8ed','8ea',null]
        }
    },
    {
        id: 18,
        name: 'Ewere Unuagbon',
        category: 'entretien',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F','8ec',null,null,'8ea','8eb','8ea','8ec','8ed',null,null,'8ea','8eb',null,null,'8eb','8e.1','8e.2',null,null,'8ec','8ed','8ec',null,null,'8ea','8eb','8ea','8ec','8ed',null]
        }
    },
    {
        id: 19,
        name: 'Ansumane Conte',
        category: 'entretien',
        type: 'vacataire',
        planning: {
            '2026-01': [null,'F','8ed',null,null,'8ed','8ea','8eb',null,null,'8e.1','8e.2',null,null,'8ec','8ed','8ec',null,null,'8ea','8eb','8ea','8ec','8ed',null,null,'8ed','8ea','8eb','8eb',null,'8e.1']
        }
    },
    {
        id: 20,
        name: 'Aminata Sanogo',
        category: 'entretien',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F','8eb','8e.2','8e.1',null,null,'8ec','8eb','8ec',null,null,'8ed','8ed','8ea','8eb','8ea',null,null,'8eb','8ea',null,null,'8eb','8e.2','8e.1',null,null,'8ec','8eb','8ec',null]
        }
    },
    {
        id: 21,
        name: 'Henda Sissoko',
        category: 'entretien',
        type: 'permanent',
        planning: {
            '2026-01': [null,'F','8ea',null,null,'8ec','8ec','8ed','8ea','8eb',null,null,'8ec','8ec','8eb',null,null,'8e.2','8e.1',null,null,'8eb','8eb','8ea',null,null,'8ec','8ec','8ed','8ea','8eb',null]
        }
    },
    // Polyvalent
    {
        id: 22,
        name: 'Ousmane Ba',
        category: 'polyvalent',
        type: 'interimaire',
        planning: {
            '2026-01': [null,'F',null,null,null,'8T','8ed','8T',null,null,'8w','8w','8T','8T','8T',null,null,'8W','8W',null,null,'8T','8ea','8T',null,null,'8T','8ed','8T','8T','8T',null]
        }
    }
];

// État de l'application
let state = {
    currentDate: new Date(),
    currentView: 'month',
    filters: {
        category: 'all',
        type: 'all',
        search: ''
    },
    darkMode: localStorage.getItem('darkMode') === 'true',
    editingShift: null,
    collapsedCategories: new Set(),
    nextId: 23
};

// Noms des mois en français
const MONTHS_FR = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Noms des jours en français
const DAYS_FR = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Appliquer le mode sombre si sauvegardé
    if (state.darkMode) {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('dark-mode-icon').textContent = '☀️';
    }

    // Charger les données sauvegardées
    loadSavedData();

    // Générer la légende
    generateLegend();

    // Afficher le planning
    renderPlanning();

    // Mettre à jour les stats
    updateStats();
}

function loadSavedData() {
    const saved = localStorage.getItem('planning-babinski');
    if (saved) {
        try {
            const data = JSON.parse(saved);

            // Mettre à jour le nextId
            if (data.nextId) {
                state.nextId = data.nextId;
            }

            // Fusionner les données sauvegardées avec les données par défaut
            data.employees?.forEach(savedEmp => {
                const existingEmp = EMPLOYEES.find(e => e.id === savedEmp.id);
                if (existingEmp) {
                    // Mettre à jour l'employé existant
                    if (savedEmp.planning) {
                        existingEmp.planning = { ...existingEmp.planning, ...savedEmp.planning };
                    }
                    if (savedEmp.type) existingEmp.type = savedEmp.type;
                    if (savedEmp.startDate) existingEmp.startDate = savedEmp.startDate;
                    if (savedEmp.endDate) existingEmp.endDate = savedEmp.endDate;
                } else if (savedEmp.id >= 23) {
                    // Ajouter un nouvel employé créé par l'utilisateur
                    EMPLOYEES.push({
                        id: savedEmp.id,
                        name: savedEmp.name,
                        category: savedEmp.category,
                        type: savedEmp.type || 'permanent',
                        startDate: savedEmp.startDate || null,
                        endDate: savedEmp.endDate || null,
                        planning: savedEmp.planning || {}
                    });
                }
            });
        } catch (e) {
            console.error('Erreur chargement données:', e);
        }
    }
}

// Navigation
function previousMonth() {
    state.currentDate.setMonth(state.currentDate.getMonth() - 1);
    renderPlanning();
    updateStats();
}

function nextMonth() {
    state.currentDate.setMonth(state.currentDate.getMonth() + 1);
    renderPlanning();
    updateStats();
}

function goToToday() {
    state.currentDate = new Date();
    renderPlanning();
    updateStats();
}

// Filtres
function applyFilters() {
    state.filters.category = document.getElementById('filter-category').value;
    state.filters.type = document.getElementById('filter-type').value;
    state.filters.search = document.getElementById('search-employee').value.toLowerCase();
    renderPlanning();
}

function setView(view) {
    state.currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    renderPlanning();
}

// Rendu du planning
function renderPlanning() {
    const year = state.currentDate.getFullYear();
    const month = state.currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

    // Mettre à jour l'affichage du mois
    document.getElementById('month-name').textContent = MONTHS_FR[month];
    document.getElementById('year').textContent = year;

    // Définir la variable CSS pour le nombre de jours
    document.documentElement.style.setProperty('--days', daysInMonth);

    // Générer l'en-tête des jours
    renderHeader(year, month, daysInMonth);

    // Générer le corps du planning
    renderBody(monthKey, daysInMonth, year, month);
}

function renderHeader(year, month, daysInMonth) {
    const header = document.getElementById('planning-header');
    const today = new Date();

    let html = '<div class="employee-header">Employé</div>';

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        const dateStr = formatDateISO(date);
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isToday = date.toDateString() === today.toDateString();
        const isFerie = FERIES_2026.includes(dateStr);

        let classes = ['day-header'];
        if (isWeekend) classes.push('weekend');
        if (isToday) classes.push('today');
        if (isFerie) classes.push('ferie');

        html += `
            <div class="${classes.join(' ')}">
                <span class="day-num">${day}</span>
                <span class="day-name">${DAYS_FR[dayOfWeek]}</span>
            </div>
        `;
    }

    header.innerHTML = html;
}

function renderBody(monthKey, daysInMonth, year, month) {
    const body = document.getElementById('planning-body');
    const today = new Date();

    // Grouper les employés par catégorie
    const grouped = {};
    Object.keys(CATEGORIES).forEach(cat => grouped[cat] = []);

    EMPLOYEES.forEach(emp => {
        if (grouped[emp.category]) {
            grouped[emp.category].push(emp);
        }
    });

    let html = '';

    Object.entries(grouped).forEach(([catKey, employees]) => {
        if (employees.length === 0) return;

        const cat = CATEGORIES[catKey];
        const isCollapsed = state.collapsedCategories.has(catKey);

        // Filtrer les employés
        let filteredEmployees = employees;

        // Filtre par catégorie
        if (state.filters.category !== 'all') {
            if (state.filters.category === 'vacataire') {
                filteredEmployees = employees.filter(emp => emp.type === 'vacataire');
            } else if (state.filters.category === 'interimaire') {
                filteredEmployees = employees.filter(emp => emp.type === 'interimaire');
            } else if (state.filters.category !== catKey) {
                return;
            }
        }

        // Filtre par type de contrat
        if (state.filters.type !== 'all') {
            filteredEmployees = filteredEmployees.filter(emp => emp.type === state.filters.type);
        }

        // Filtre par recherche
        if (state.filters.search) {
            filteredEmployees = filteredEmployees.filter(emp =>
                emp.name.toLowerCase().includes(state.filters.search)
            );
        }

        if (filteredEmployees.length === 0) return;

        html += `
            <div class="category-group" data-category="${catKey}">
                <div class="category-header ${isCollapsed ? 'collapsed' : ''}" onclick="toggleCategory('${catKey}')">
                    <span><span class="toggle-icon">▼</span> ${cat.icon} ${cat.name} (${filteredEmployees.length})</span>
                </div>
        `;

        filteredEmployees.forEach(emp => {
            const planning = emp.planning[monthKey] || [];
            const initials = emp.name.split(' ').map(n => n[0]).join('').toUpperCase();
            const typeBadge = emp.type !== 'permanent' ?
                `<span class="employee-type-badge ${emp.type}">${emp.type === 'vacataire' ? 'VAC' : 'INT'}</span>` : '';

            html += `
                <div class="employee-row ${isCollapsed ? 'hidden' : ''}" data-employee="${emp.id}">
                    <div class="employee-name" onclick="showEmployeeDetail(${emp.id})">
                        <span class="employee-avatar" style="background: ${cat.color}">${initials}</span>
                        <span>${emp.name}</span>
                        ${typeBadge}
                        <button class="employee-delete" onclick="event.stopPropagation(); deleteEmployee(${emp.id})" title="Supprimer">🗑️</button>
                    </div>
            `;

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dayOfWeek = date.getDay();
                const dateStr = formatDateISO(date);
                const shift = planning[day] || null;
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const isFerie = FERIES_2026.includes(dateStr);
                const isToday = date.toDateString() === today.toDateString();

                const shiftInfo = shift ? (SHIFT_CODES[shift] || { type: 'autre' }) : null;
                let classes = ['shift-cell'];

                if (isWeekend && !shift) classes.push('weekend');
                if (shiftInfo) classes.push(shiftInfo.type);
                if (isToday) classes.push('today');

                html += `
                    <div class="${classes.join(' ')}"
                         onclick="editShift(${emp.id}, '${dateStr}')"
                         title="${shift ? (SHIFT_CODES[shift]?.desc || shift) : 'Repos'}">
                        ${shift || ''}
                    </div>
                `;
            }

            html += '</div>';
        });

        html += '</div>';
    });

    body.innerHTML = html;
}

function toggleCategory(catKey) {
    if (state.collapsedCategories.has(catKey)) {
        state.collapsedCategories.delete(catKey);
    } else {
        state.collapsedCategories.add(catKey);
    }
    renderPlanning();
}

// Statistiques
function updateStats() {
    const today = new Date();
    const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const dayOfMonth = today.getDate();

    let present = 0;
    let absent = 0;
    let conge = 0;
    const total = EMPLOYEES.length;

    EMPLOYEES.forEach(emp => {
        const planning = emp.planning[monthKey] || [];
        const shift = planning[dayOfMonth];

        if (!shift || shift === 'tp') {
            // Repos
        } else if (['CP', 'Am', 'ABS', 'Abs'].includes(shift)) {
            if (shift === 'CP') conge++;
            else absent++;
        } else if (shift === 'F') {
            // Férié
        } else {
            present++;
        }
    });

    document.getElementById('stat-present').textContent = present;
    document.getElementById('stat-absent').textContent = absent;
    document.getElementById('stat-conge').textContent = conge;
    document.getElementById('stat-total').textContent = total;
}

// Légende
function generateLegend() {
    const legendJour = document.getElementById('legend-jour');
    const legendNuit = document.getElementById('legend-nuit');
    const legendRestauration = document.getElementById('legend-restauration');
    const legendEntretien = document.getElementById('legend-entretien');
    const legendSpecial = document.getElementById('legend-special');

    Object.entries(SHIFT_CODES).forEach(([code, info]) => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
            <span class="code ${info.type}">${code}</span>
            <span class="desc">${info.desc}</span>
        `;

        if (info.category === 'restauration') {
            legendRestauration.appendChild(item);
        } else if (info.category === 'entretien') {
            legendEntretien.appendChild(item);
        } else if (['absence', 'ferie', 'formation', 'repos'].includes(info.category)) {
            legendSpecial.appendChild(item);
        } else if (info.type === 'nuit') {
            legendNuit.appendChild(item);
        } else {
            legendJour.appendChild(item);
        }
    });
}

function showLegend() {
    document.getElementById('legend-modal').classList.add('active');
}

function closeLegend() {
    document.getElementById('legend-modal').classList.remove('active');
}

// Détail employé
function showEmployeeDetail(empId) {
    const emp = EMPLOYEES.find(e => e.id === empId);
    if (!emp) return;

    const cat = CATEGORIES[emp.category];
    const monthKey = `${state.currentDate.getFullYear()}-${String(state.currentDate.getMonth() + 1).padStart(2, '0')}`;
    const planning = emp.planning[monthKey] || [];

    // Calculer les stats
    let heures = 0;
    let jours = 0;
    let nuits = 0;

    planning.forEach((shift, i) => {
        if (shift && SHIFT_CODES[shift]) {
            const info = SHIFT_CODES[shift];
            heures += info.hours || 0;
            if (info.type === 'nuit') nuits++;
            else if (info.hours > 0) jours++;
        }
    });

    document.getElementById('employee-name').textContent = `${cat.icon} ${emp.name}`;
    document.getElementById('employee-category').textContent = cat.name;
    document.getElementById('emp-heures').textContent = Math.round(heures);
    document.getElementById('emp-jours').textContent = jours;
    document.getElementById('emp-nuits').textContent = nuits;

    // Mini calendrier
    renderMiniCalendar(emp, monthKey);

    document.getElementById('employee-modal').classList.add('active');
}

function renderMiniCalendar(emp, monthKey) {
    const container = document.getElementById('employee-calendar');
    const planning = emp.planning[monthKey] || [];
    const year = state.currentDate.getFullYear();
    const month = state.currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    let html = '';

    // En-têtes
    DAYS_FR.forEach(d => {
        html += `<div class="mini-day" style="font-weight:600;background:var(--primary);color:white;">${d[0].toUpperCase()}</div>`;
    });

    // Jours vides avant le 1er
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="mini-day"></div>';
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
        const shift = planning[day];
        const type = shift && SHIFT_CODES[shift] ? SHIFT_CODES[shift].type : '';
        html += `<div class="mini-day ${type}" title="${shift || 'Repos'}">${day}</div>`;
    }

    container.innerHTML = html;
}

function closeEmployeeModal() {
    document.getElementById('employee-modal').classList.remove('active');
}

// Édition de shift
function editShift(empId, dateStr) {
    const emp = EMPLOYEES.find(e => e.id === empId);
    if (!emp) return;

    state.editingShift = { empId, dateStr };

    const date = new Date(dateStr);
    document.getElementById('edit-info').textContent = `${emp.name} - ${date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}`;

    // Générer les boutons de shift
    generateShiftButtons();

    document.getElementById('edit-modal').classList.add('active');
}

function generateShiftButtons() {
    const shiftJour = document.getElementById('shift-jour');
    const shiftNuit = document.getElementById('shift-nuit');
    const shiftSpecial = document.getElementById('shift-special');

    shiftJour.innerHTML = '';
    shiftNuit.innerHTML = '';
    shiftSpecial.innerHTML = '';

    Object.entries(SHIFT_CODES).forEach(([code, info]) => {
        const btn = document.createElement('button');
        btn.className = `shift-btn ${info.type}`;
        btn.textContent = code;
        btn.onclick = () => setShift(code);

        if (info.type === 'nuit') {
            shiftNuit.appendChild(btn);
        } else if (['conge', 'absent', 'formation', 'ferie'].includes(info.type)) {
            shiftSpecial.appendChild(btn);
        } else {
            shiftJour.appendChild(btn);
        }
    });
}

function setShift(code) {
    if (!state.editingShift) return;

    const { empId, dateStr } = state.editingShift;
    const emp = EMPLOYEES.find(e => e.id === empId);
    if (!emp) return;

    const date = new Date(dateStr);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const day = date.getDate();

    if (!emp.planning[monthKey]) {
        emp.planning[monthKey] = [];
    }

    emp.planning[monthKey][day] = code;

    saveData();
    renderPlanning();
    updateStats();
    closeEditModal();
    showToast(`Shift modifié: ${code}`);
}

function clearShift() {
    if (!state.editingShift) return;

    const { empId, dateStr } = state.editingShift;
    const emp = EMPLOYEES.find(e => e.id === empId);
    if (!emp) return;

    const date = new Date(dateStr);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const day = date.getDate();

    if (emp.planning[monthKey]) {
        emp.planning[monthKey][day] = null;
    }

    saveData();
    renderPlanning();
    updateStats();
    closeEditModal();
    showToast('Shift effacé');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('active');
    state.editingShift = null;
}

// Mode sombre
function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.body.setAttribute('data-theme', state.darkMode ? 'dark' : '');
    document.getElementById('dark-mode-icon').textContent = state.darkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', state.darkMode);
}

// Export
function exportPlanning() {
    const monthKey = `${state.currentDate.getFullYear()}-${String(state.currentDate.getMonth() + 1).padStart(2, '0')}`;
    const monthName = MONTHS_FR[state.currentDate.getMonth()];
    const year = state.currentDate.getFullYear();

    let csv = `Planning ${monthName} ${year} - Site Babinski\n\n`;
    csv += 'Employé,Catégorie,';

    const daysInMonth = new Date(year, state.currentDate.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
        csv += `${d},`;
    }
    csv += 'Total Heures\n';

    EMPLOYEES.forEach(emp => {
        const cat = CATEGORIES[emp.category];
        const planning = emp.planning[monthKey] || [];
        let totalHours = 0;

        csv += `"${emp.name}","${cat.name}",`;

        for (let d = 1; d <= daysInMonth; d++) {
            const shift = planning[d] || '';
            csv += `${shift},`;
            if (shift && SHIFT_CODES[shift]) {
                totalHours += SHIFT_CODES[shift].hours || 0;
            }
        }

        csv += `${Math.round(totalHours)}\n`;
    });

    // Télécharger le fichier
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `planning-babinski-${monthKey}.csv`;
    link.click();

    showToast('Planning exporté');
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Utilitaires
function formatDateISO(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Fermer les modals avec Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLegend();
        closeEmployeeModal();
        closeEditModal();
        closeAddEmployeeModal();
    }
});

// Fermer les modals en cliquant à l'extérieur
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Gestion des employés
function showAddEmployeeModal() {
    document.getElementById('add-employee-modal').classList.add('active');
    document.getElementById('emp-name').focus();
}

function closeAddEmployeeModal() {
    document.getElementById('add-employee-modal').classList.remove('active');
    document.getElementById('emp-name').value = '';
    document.getElementById('emp-category').value = '';
    document.getElementById('emp-type').value = 'permanent';
    document.getElementById('emp-start').value = '';
    document.getElementById('emp-end').value = '';
}

function addEmployee(event) {
    event.preventDefault();

    const name = document.getElementById('emp-name').value.trim();
    const category = document.getElementById('emp-category').value;
    const type = document.getElementById('emp-type').value;
    const startDate = document.getElementById('emp-start').value;
    const endDate = document.getElementById('emp-end').value;

    if (!name || !category) {
        showToast('Veuillez remplir les champs obligatoires');
        return;
    }

    const newEmployee = {
        id: state.nextId++,
        name: name,
        category: category,
        type: type,
        startDate: startDate || null,
        endDate: endDate || null,
        planning: {}
    };

    EMPLOYEES.push(newEmployee);
    saveData();
    renderPlanning();
    updateStats();
    closeAddEmployeeModal();
    showToast(`${name} ajouté(e) avec succès`);
}

function deleteEmployee(empId) {
    const emp = EMPLOYEES.find(e => e.id === empId);
    if (!emp) return;

    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${emp.name} ?`)) {
        return;
    }

    const index = EMPLOYEES.findIndex(e => e.id === empId);
    if (index > -1) {
        EMPLOYEES.splice(index, 1);
        saveData();
        renderPlanning();
        updateStats();
        showToast(`${emp.name} supprimé(e)`);
    }
}

// Mise à jour de la sauvegarde pour inclure tous les employés
function saveData() {
    const data = {
        employees: EMPLOYEES.map(emp => ({
            id: emp.id,
            name: emp.name,
            category: emp.category,
            type: emp.type || 'permanent',
            startDate: emp.startDate || null,
            endDate: emp.endDate || null,
            planning: emp.planning
        })),
        nextId: state.nextId,
        lastUpdate: new Date().toISOString()
    };
    localStorage.setItem('planning-babinski', JSON.stringify(data));
}
