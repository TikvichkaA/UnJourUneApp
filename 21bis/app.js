// ============================================
// MathOral - Application Logic
// Moteur d'exercices interactifs pour oraux prepa
// ============================================

// State
let currentView = 'home';
let currentExercise = null;
let currentStep = 0;
let currentMethode = null;
let expressTimer = null;
let expressTimeLeft = 300; // 5 minutes
let expressCorrect = 0;
let expressTotal = 0;
let expressQuestionIndex = 0;

// Steps for exercise
const STEPS = ['enonce', 'reconnaissance', 'strategie', 'indices', 'oral', 'debrief'];

// ============================================
// PROGRESSION SYSTEM (localStorage)
// ============================================
const STORAGE_KEY = 'mathoral_progress';

// Default progress structure
const DEFAULT_PROGRESS = {
    exercises: {}, // { exerciseId: { status: 'completed'|'in_progress'|'started', lastStep: 0, attempts: 1, score: 0, date: timestamp } }
    express: {
        sessions: [], // [{ date, score, total, time, percentage }]
        bestScore: 0,
        totalQuestions: 0,
        correctAnswers: 0
    },
    themes: {}, // { themeId: { exercisesDone: 0, expressCorrect: 0, expressTotal: 0 } }
    stats: {
        totalTime: 0, // in seconds
        exercisesCompleted: 0,
        expressSessions: 0,
        streak: 0,
        lastVisit: null
    }
};

// Load progress from localStorage
function loadProgress() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Merge with defaults to handle new fields
            return {
                ...DEFAULT_PROGRESS,
                ...parsed,
                express: { ...DEFAULT_PROGRESS.express, ...parsed.express },
                stats: { ...DEFAULT_PROGRESS.stats, ...parsed.stats }
            };
        }
    } catch (e) {
        console.warn('Failed to load progress:', e);
    }
    return { ...DEFAULT_PROGRESS };
}

// Save progress to localStorage
function saveProgress(progress) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
        console.warn('Failed to save progress:', e);
    }
}

// Get current progress (cached)
let userProgress = loadProgress();

// Update streak on visit
function updateStreak() {
    const now = new Date();
    const today = now.toDateString();
    const lastVisit = userProgress.stats.lastVisit;

    if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const lastDateStr = lastDate.toDateString();
        const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

        if (lastDateStr !== today) {
            if (diffDays === 1) {
                // Consecutive day
                userProgress.stats.streak++;
            } else if (diffDays > 1) {
                // Streak broken
                userProgress.stats.streak = 1;
            }
        }
    } else {
        userProgress.stats.streak = 1;
    }

    userProgress.stats.lastVisit = now.toISOString();
    saveProgress(userProgress);
}

// Track exercise start
function trackExerciseStart(exerciseId) {
    if (!userProgress.exercises[exerciseId]) {
        userProgress.exercises[exerciseId] = {
            status: 'started',
            lastStep: 0,
            attempts: 1,
            score: 0,
            date: new Date().toISOString()
        };
    } else {
        userProgress.exercises[exerciseId].attempts++;
        userProgress.exercises[exerciseId].date = new Date().toISOString();
    }
    saveProgress(userProgress);
}

// Track exercise step progress
function trackExerciseStep(exerciseId, step) {
    if (userProgress.exercises[exerciseId]) {
        userProgress.exercises[exerciseId].lastStep = Math.max(
            userProgress.exercises[exerciseId].lastStep,
            step
        );
        if (step > 0) {
            userProgress.exercises[exerciseId].status = 'in_progress';
        }
        saveProgress(userProgress);
    }
}

// Track exercise completion
function trackExerciseComplete(exerciseId, score = 100) {
    const exercise = EXERCICES.find(e => e.id === exerciseId);

    if (userProgress.exercises[exerciseId]) {
        userProgress.exercises[exerciseId].status = 'completed';
        userProgress.exercises[exerciseId].score = score;
        userProgress.exercises[exerciseId].lastStep = STEPS.length - 1;
    }

    // Update theme stats
    if (exercise) {
        if (!userProgress.themes[exercise.theme]) {
            userProgress.themes[exercise.theme] = { exercisesDone: 0, expressCorrect: 0, expressTotal: 0 };
        }
        userProgress.themes[exercise.theme].exercisesDone++;
    }

    // Update global stats
    userProgress.stats.exercisesCompleted++;

    saveProgress(userProgress);
}

// Track Express session
function trackExpressSession(correct, total, timeSpent) {
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Add session
    userProgress.express.sessions.push({
        date: new Date().toISOString(),
        score: correct,
        total: total,
        time: timeSpent,
        percentage: percentage
    });

    // Keep only last 20 sessions
    if (userProgress.express.sessions.length > 20) {
        userProgress.express.sessions = userProgress.express.sessions.slice(-20);
    }

    // Update totals
    userProgress.express.totalQuestions += total;
    userProgress.express.correctAnswers += correct;
    userProgress.express.bestScore = Math.max(userProgress.express.bestScore, percentage);

    // Update global stats
    userProgress.stats.expressSessions++;

    saveProgress(userProgress);
}

// Track Express question by theme
function trackExpressQuestion(theme, isCorrect) {
    if (!userProgress.themes[theme]) {
        userProgress.themes[theme] = { exercisesDone: 0, expressCorrect: 0, expressTotal: 0 };
    }
    userProgress.themes[theme].expressTotal++;
    if (isCorrect) {
        userProgress.themes[theme].expressCorrect++;
    }
    // Don't save on each question, save at end of session
}

// Get exercise status
function getExerciseStatus(exerciseId) {
    return userProgress.exercises[exerciseId]?.status || null;
}

// Get theme mastery percentage
function getThemeMastery(themeId) {
    const themeExercises = EXERCICES.filter(e => e.theme === themeId);
    const completed = themeExercises.filter(e =>
        userProgress.exercises[e.id]?.status === 'completed'
    ).length;

    const expressStats = userProgress.themes[themeId];
    const expressPercent = expressStats && expressStats.expressTotal > 0
        ? (expressStats.expressCorrect / expressStats.expressTotal) * 100
        : 0;

    const exercisePercent = themeExercises.length > 0
        ? (completed / themeExercises.length) * 100
        : 0;

    // Weighted average: 60% exercises, 40% express
    return Math.round(exercisePercent * 0.6 + expressPercent * 0.4);
}

// Get weak themes (mastery < 50%)
function getWeakThemes() {
    return Object.keys(THEMES)
        .map(themeId => ({
            id: themeId,
            name: THEMES[themeId].name,
            mastery: getThemeMastery(themeId)
        }))
        .filter(t => t.mastery < 50)
        .sort((a, b) => a.mastery - b.mastery);
}

// Get suggested exercises (not completed, prioritize weak themes)
function getSuggestedExercises(limit = 5) {
    const weakThemes = getWeakThemes().map(t => t.id);

    // Get incomplete exercises
    const incomplete = EXERCICES.filter(e =>
        userProgress.exercises[e.id]?.status !== 'completed'
    );

    // Sort: weak themes first, then by difficulty
    incomplete.sort((a, b) => {
        const aWeak = weakThemes.indexOf(a.theme);
        const bWeak = weakThemes.indexOf(b.theme);
        if (aWeak !== -1 && bWeak === -1) return -1;
        if (bWeak !== -1 && aWeak === -1) return 1;
        if (aWeak !== -1 && bWeak !== -1) return aWeak - bWeak;
        return a.difficulty - b.difficulty;
    });

    return incomplete.slice(0, limit);
}

// Get recent exercises (last worked on)
function getRecentExercises(limit = 5) {
    return Object.entries(userProgress.exercises)
        .filter(([id, data]) => data.status !== 'completed')
        .sort((a, b) => new Date(b[1].date) - new Date(a[1].date))
        .slice(0, limit)
        .map(([id]) => EXERCICES.find(e => e.id === id))
        .filter(Boolean);
}

// Reset progress (for testing)
function resetProgress() {
    if (confirm('Es-tu sur de vouloir reinitialiser toute ta progression ?')) {
        userProgress = { ...DEFAULT_PROGRESS };
        saveProgress(userProgress);
        location.reload();
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Update streak on visit
    updateStreak();

    // Render KaTeX
    if (typeof renderMathInElement !== 'undefined') {
        setTimeout(() => {
            renderAllMath();
        }, 100);
    }

    // Populate home
    populateHome();

    // Populate exercises
    populateExercises();

    // Populate methodes
    populateMethodes();

    // Populate carte
    populateCarte();

    // Update stats
    updateStats();
}

function renderAllMath() {
    if (typeof renderMathInElement === 'undefined') return;

    document.querySelectorAll('.view.active, .exercise-content, .methode-content, .express-question').forEach(el => {
        renderMathInElement(el, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    });
}

function updateStats() {
    document.getElementById('stat-exercices').textContent = EXERCICES.length;
    document.getElementById('stat-methodes').textContent = METHODES.length;
    document.getElementById('stat-oraux').textContent = Math.floor(EXERCICES.length / 3);
}

// ============================================
// NAVIGATION
// ============================================
function switchView(viewId) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.toggle('active', view.id === `view-${viewId}`);
    });

    currentView = viewId;

    // Populate specific views
    if (viewId === 'fiches') {
        populateFiches();
    }
    if (viewId === 'profil') {
        populateProfil();
    }

    // Render math in new view
    setTimeout(renderAllMath, 50);
}

function goHome() {
    switchView('home');
}

// ============================================
// HOME VIEW
// ============================================
function populateHome() {
    // Suggested exercises - prioritize weak themes and incomplete
    const suggestedContainer = document.getElementById('suggested-exercises');
    const suggested = getSuggestedExercises(4);

    if (suggested.length === 0) {
        suggestedContainer.innerHTML = '<p class="empty-state">Bravo ! Tu as complete tous les exercices.</p>';
    } else {
        suggestedContainer.innerHTML = suggested.map(ex => {
            const status = getExerciseStatus(ex.id);
            const statusIcon = status === 'completed' ? '✓' : status === 'in_progress' ? '◐' : '';
            const statusClass = status ? `status-${status}` : '';
            return `
                <div class="exercise-item ${statusClass}" onclick="openExercise('${ex.id}')">
                    <span class="exercise-item-tag">${ex.concours}</span>
                    <span class="exercise-item-title">${ex.title}</span>
                    ${statusIcon ? `<span class="exercise-item-status">${statusIcon}</span>` : ''}
                    <span class="exercise-item-arrow">→</span>
                </div>
            `;
        }).join('');
    }

    // Theme grid with mastery percentage
    const themeGrid = document.getElementById('theme-grid');
    const themeCounts = {};
    EXERCICES.forEach(ex => {
        themeCounts[ex.theme] = (themeCounts[ex.theme] || 0) + 1;
    });

    themeGrid.innerHTML = Object.entries(THEMES).map(([key, theme]) => {
        const mastery = getThemeMastery(key);
        const completedCount = EXERCICES.filter(e => e.theme === key && getExerciseStatus(e.id) === 'completed').length;
        const totalCount = themeCounts[key] || 0;

        return `
            <div class="theme-card" onclick="filterByTheme('${key}')" style="--theme-color: ${theme.color}">
                <div class="theme-card-header">
                    <div class="theme-card-name">${theme.name}</div>
                    <div class="theme-card-mastery" style="color: ${mastery >= 70 ? 'var(--success)' : mastery >= 40 ? 'var(--warning)' : 'var(--text-muted)'}">${mastery}%</div>
                </div>
                <div class="theme-card-progress">
                    <div class="theme-progress-bar">
                        <div class="theme-progress-fill" style="width: ${mastery}%; background: ${theme.color}"></div>
                    </div>
                </div>
                <div class="theme-card-count">${completedCount}/${totalCount} exercices</div>
            </div>
        `;
    }).join('');

    // Update hero stats with personal progress
    updateHomeStats();
}

function updateHomeStats() {
    const completed = userProgress.stats.exercisesCompleted;
    const total = EXERCICES.length;
    const streak = userProgress.stats.streak;
    const expressBest = userProgress.express.bestScore;

    // Update the stat values
    document.getElementById('stat-exercices').textContent = `${completed}/${total}`;
    document.getElementById('stat-methodes').textContent = METHODES.length;

    // Update third stat to show streak or express best
    const orauxStat = document.getElementById('stat-oraux');
    if (streak > 1) {
        orauxStat.textContent = streak;
        orauxStat.parentElement.querySelector('.stat-label').textContent = 'Jours de suite';
    } else if (expressBest > 0) {
        orauxStat.textContent = `${expressBest}%`;
        orauxStat.parentElement.querySelector('.stat-label').textContent = 'Meilleur Express';
    } else {
        orauxStat.textContent = Math.floor(total / 3);
        orauxStat.parentElement.querySelector('.stat-label').textContent = 'Oraux types';
    }
}

function filterByTheme(theme) {
    document.getElementById('filter-theme').value = theme;
    switchView('exercices');
    filterExercises();
}

// ============================================
// EXERCISES VIEW
// ============================================
function populateExercises() {
    // Populate methode filter
    const methodeFilter = document.getElementById('filter-methode');
    methodeFilter.innerHTML = '<option value="all">Toutes</option>' +
        METHODES.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

    // Initial display
    filterExercises();
}

function filterExercises() {
    const theme = document.getElementById('filter-theme').value;
    const concours = document.getElementById('filter-concours').value;
    const methode = document.getElementById('filter-methode').value;

    let filtered = EXERCICES;

    if (theme !== 'all') {
        filtered = filtered.filter(ex => ex.theme === theme);
    }
    if (concours !== 'all') {
        filtered = filtered.filter(ex => ex.concours === concours);
    }
    if (methode !== 'all') {
        filtered = filtered.filter(ex => ex.methodes.includes(methode));
    }

    renderExercises(filtered);
}

function renderExercises(exercises) {
    const grid = document.getElementById('exercises-grid');

    grid.innerHTML = exercises.map(ex => {
        const status = getExerciseStatus(ex.id);
        const statusClass = status ? `status-${status}` : '';
        const statusIcon = status === 'completed' ? '✓' : status === 'in_progress' ? '◐' : '';

        return `
            <div class="exercise-card ${statusClass}" onclick="openExercise('${ex.id}')">
                ${status ? `<div class="exercise-status-badge ${status}">${statusIcon}</div>` : ''}
                <div class="exercise-card-header">
                    <div class="exercise-card-tags">
                        <span class="tag tag-concours">${ex.concours}</span>
                        <span class="tag tag-theme">${THEMES[ex.theme].name}</span>
                    </div>
                    <div class="exercise-card-difficulty">
                        ${[1,2,3].map(i => `<span class="difficulty-dot ${i <= ex.difficulty ? 'filled' : ''}"></span>`).join('')}
                    </div>
                </div>
                <h3>${ex.title}</h3>
                <p class="exercise-card-preview">${truncate(ex.enonce, 100)}</p>
                <div class="exercise-card-methodes">
                    ${ex.methodes.slice(0, 2).map(mid => {
                        const m = METHODES.find(x => x.id === mid);
                        return m ? `<span class="methode-badge">${m.name}</span>` : '';
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');

    setTimeout(renderAllMath, 50);
}

function truncate(str, len) {
    // Remove LaTeX for preview
    const clean = str.replace(/\$\$[\s\S]*?\$\$/g, '[formule]').replace(/\$[^$]+\$/g, '[expr]');
    if (clean.length <= len) return clean;
    return clean.substring(0, len) + '...';
}

// ============================================
// EXERCISE DETAIL VIEW
// ============================================
function openExercise(exerciseId) {
    currentExercise = EXERCICES.find(ex => ex.id === exerciseId);
    if (!currentExercise) return;

    currentStep = 0;

    // Track exercise start
    trackExerciseStart(exerciseId);

    // Update header
    document.getElementById('exercise-concours').textContent = currentExercise.concours;
    document.getElementById('exercise-year').textContent = currentExercise.year;
    document.getElementById('exercise-title').textContent = currentExercise.title;
    document.getElementById('exercise-theme-breadcrumb').textContent = THEMES[currentExercise.theme].name;

    // Reset progress
    updateProgress();

    // Show exercise view
    switchView('exercise');

    // Render first step
    renderStep();
}

function updateProgress() {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, i) => {
        step.classList.remove('active', 'completed');
        if (i < currentStep) step.classList.add('completed');
        if (i === currentStep) step.classList.add('active');
    });

    const fill = document.getElementById('exercise-progress-fill');
    fill.style.width = `${(currentStep / (STEPS.length - 1)) * 100}%`;

    // Update nav buttons
    document.getElementById('btn-prev').disabled = currentStep === 0;

    const nextBtn = document.getElementById('btn-next');
    if (currentStep === 0) {
        nextBtn.innerHTML = 'Je me lance <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>';
    } else if (currentStep === STEPS.length - 1) {
        nextBtn.innerHTML = 'Terminer <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>';
    } else {
        nextBtn.innerHTML = 'Suivant <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>';
    }
}

function renderStep() {
    const content = document.getElementById('exercise-content');
    const step = STEPS[currentStep];

    switch(step) {
        case 'enonce':
            content.innerHTML = renderEnonce();
            break;
        case 'reconnaissance':
            content.innerHTML = renderReconnaissance();
            break;
        case 'strategie':
            content.innerHTML = renderStrategie();
            break;
        case 'indices':
            content.innerHTML = renderIndices();
            break;
        case 'oral':
            content.innerHTML = renderOral();
            break;
        case 'debrief':
            content.innerHTML = renderDebrief();
            break;
    }

    setTimeout(renderAllMath, 50);
}

function renderEnonce() {
    return `
        <div class="enonce-content">
            ${currentExercise.enonce.split('\n').map(line => `<p>${line}</p>`).join('')}
        </div>
    `;
}

function renderReconnaissance() {
    const reco = currentExercise.reconnaissance;
    return `
        <div class="reconnaissance-content">
            <h3>Phase 1 : Reconnaissance</h3>
            <p>${reco.question}</p>
            <div class="options-list" id="reco-options">
                ${reco.options.map((opt, i) => `
                    <div class="option-item" data-index="${i}" data-correct="${opt.correct}" onclick="selectOption(this)">
                        <div class="option-radio"></div>
                        <span class="option-text">${opt.text}</span>
                    </div>
                `).join('')}
            </div>
            <button class="validate-btn" onclick="validateReconnaissance()" disabled>Valider</button>
            <div id="reco-feedback"></div>
        </div>
    `;
}

function selectOption(el) {
    const container = el.closest('.options-list');
    container.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('selected'));
    el.classList.add('selected');

    // Enable validate button
    const validateBtn = el.closest('.reconnaissance-content, .strategie-content')?.querySelector('.validate-btn');
    if (validateBtn) validateBtn.disabled = false;
}

function validateReconnaissance() {
    const selected = document.querySelector('.option-item.selected');
    if (!selected) return;

    const isCorrect = selected.dataset.correct === 'true';
    const reco = currentExercise.reconnaissance;

    // Show feedback
    document.querySelectorAll('.option-item').forEach(opt => {
        if (opt.dataset.correct === 'true') {
            opt.classList.add('correct');
        } else if (opt.classList.contains('selected')) {
            opt.classList.add('incorrect');
        }
    });

    const feedbackDiv = document.getElementById('reco-feedback');
    feedbackDiv.innerHTML = `
        <div class="feedback ${isCorrect ? 'success' : 'error'}">
            <h4>${isCorrect ? 'Correct !' : 'Pas tout a fait...'}</h4>
            <p>${isCorrect ? reco.feedback.correct : reco.feedback.incorrect}</p>
        </div>
    `;

    // Disable further clicks
    document.querySelectorAll('.option-item').forEach(opt => {
        opt.onclick = null;
        opt.style.cursor = 'default';
    });
    document.querySelector('.validate-btn').style.display = 'none';

    setTimeout(renderAllMath, 50);
}

function renderStrategie() {
    const strat = currentExercise.strategie;
    return `
        <div class="strategie-content">
            <h3>Phase 2 : Strategie</h3>
            <p>${strat.question}</p>
            <textarea class="strategie-input" placeholder="Decris ta strategie en 2-3 etapes..." id="strategie-input"></textarea>
            <button class="validate-btn" onclick="showStrategieExemple()">Voir une approche type</button>
            <div id="strategie-exemple"></div>
        </div>
    `;
}

function showStrategieExemple() {
    const strat = currentExercise.strategie;
    const exempleDiv = document.getElementById('strategie-exemple');

    exempleDiv.innerHTML = `
        <div class="strategie-exemple">
            <h4>Strategie attendue</h4>
            <p>${strat.attendu}</p>
            <h4 style="margin-top: 1rem;">Exemple de plan</h4>
            <p>${strat.exemple.split('\n').map(l => l.trim()).filter(l => l).join('<br>')}</p>
        </div>
    `;

    document.querySelector('.validate-btn').style.display = 'none';
    setTimeout(renderAllMath, 50);
}

function renderIndices() {
    const indices = currentExercise.indices;
    return `
        <div class="indices-content">
            <h3>Phase 3 : Indices progressifs</h3>
            <p>Deverrouille les indices si besoin. Essaie d'abord sans !</p>
            <div class="indices-list">
                ${indices.map((indice, i) => `
                    <div class="indice-item">
                        <div class="indice-header" onclick="toggleIndice(${i})">
                            <h4>
                                <span class="indice-badge">Indice ${i + 1}</span>
                                ${indice.title}
                            </h4>
                            <button class="indice-toggle" id="indice-btn-${i}">Reveler</button>
                        </div>
                        <div class="indice-content" id="indice-content-${i}">
                            ${indice.content}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function toggleIndice(index) {
    const content = document.getElementById(`indice-content-${index}`);
    const btn = document.getElementById(`indice-btn-${index}`);

    if (content.classList.contains('revealed')) {
        content.classList.remove('revealed');
        btn.textContent = 'Reveler';
    } else {
        content.classList.add('revealed');
        btn.textContent = 'Masquer';
        setTimeout(renderAllMath, 50);
    }
}

function renderOral() {
    const oral = currentExercise.oral;
    return `
        <div class="oral-content">
            <h3>Phase 4 : Oralisation</h3>
            <div class="oral-prompt">
                <p>"${oral.prompt}"</p>
            </div>
            <div class="oral-tips">
                <h4>Conseils pour l'oral</h4>
                <ul>
                    ${oral.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function renderDebrief() {
    const debrief = currentExercise.debrief;
    return `
        <div class="debrief-content">
            <h3>Phase 5 : Debrief concours</h3>

            <div class="debrief-section">
                <h4>Ce que le jury attend</h4>
                <p>${debrief.attendu}</p>
            </div>

            <div class="debrief-section">
                <h4>Erreurs eliminatoires</h4>
                <ul>
                    ${debrief.erreurs.map(e => `<li>${e}</li>`).join('')}
                </ul>
            </div>

            <div class="debrief-section">
                <h4>Variantes possibles</h4>
                <ul>
                    ${debrief.variantes.map(v => `<li>${v}</li>`).join('')}
                </ul>
            </div>

            <div class="debrief-links">
                <h4>Liens transversaux</h4>
                <div class="link-list">
                    ${debrief.liens.methodes.map(mid => {
                        const m = METHODES.find(x => x.id === mid);
                        return m ? `<span class="link-item" onclick="openMethode('${mid}')">Methode: ${m.name}</span>` : '';
                    }).join('')}
                    ${debrief.liens.exercices.map(eid => {
                        const e = EXERCICES.find(x => x.id === eid);
                        return e ? `<span class="link-item" onclick="openExercise('${eid}')">Exo: ${e.title}</span>` : '';
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

function nextStep() {
    if (currentStep < STEPS.length - 1) {
        currentStep++;
        // Track step progress
        trackExerciseStep(currentExercise.id, currentStep);
        updateProgress();
        renderStep();

        // If reached debrief (last step), mark as completed
        if (currentStep === STEPS.length - 1) {
            trackExerciseComplete(currentExercise.id);
        }
    } else {
        // Finished - refresh exercises list and go back
        populateExercises();
        populateHome();
        switchView('exercices');
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        updateProgress();
        renderStep();
    }
}

// ============================================
// METHODES VIEW
// ============================================
function populateMethodes() {
    const grid = document.getElementById('methodes-grid');

    grid.innerHTML = METHODES.map(m => `
        <div class="methode-card" onclick="openMethode('${m.id}')">
            <div class="methode-card-header">
                <div class="methode-card-icon">${m.icon}</div>
                <h3>${m.name}</h3>
            </div>
            <div class="methode-card-trigger">
                <p>${m.trigger}</p>
            </div>
            <div class="methode-card-examples">
                ${m.examples.length} exercices lies
            </div>
        </div>
    `).join('');

    setTimeout(renderAllMath, 50);
}

function openMethode(methodeId) {
    currentMethode = METHODES.find(m => m.id === methodeId);
    if (!currentMethode) return;

    document.getElementById('methode-title-breadcrumb').textContent = currentMethode.name;

    const content = document.getElementById('methode-content');
    content.innerHTML = `
        <h1>${currentMethode.name}</h1>

        <div class="trigger-box">
            <p>${currentMethode.trigger}</p>
        </div>

        <section>
            <h2>Contextes d'application</h2>
            <ul>
                ${currentMethode.contexts.map(c => `<li>${c}</li>`).join('')}
            </ul>
        </section>

        <section>
            <h2>Strategie type</h2>
            <ul>
                ${currentMethode.strategies.map(s => `<li>${s}</li>`).join('')}
            </ul>
        </section>

        <section>
            <h2>Outils mobilisables</h2>
            <ul>
                ${currentMethode.tools.map(t => `<li>${t}</li>`).join('')}
            </ul>
        </section>

        <section>
            <h2>Pieges classiques</h2>
            <ul>
                ${currentMethode.traps.map(t => `<li>${t}</li>`).join('')}
            </ul>
        </section>

        <section>
            <h2>Exercices emblematiques</h2>
            <div class="examples-grid">
                ${currentMethode.examples.map(eid => {
                    const ex = EXERCICES.find(e => e.id === eid);
                    return ex ? `
                        <div class="example-card" onclick="openExercise('${eid}')">
                            <strong>${ex.title}</strong>
                            <span style="font-size: 0.8rem; color: var(--text-secondary)">${ex.concours} ${ex.year}</span>
                        </div>
                    ` : '';
                }).join('')}
            </div>
        </section>
    `;

    switchView('methode');
    setTimeout(renderAllMath, 50);
}

// ============================================
// CARTE VIEW - Visual Interactive Graph
// ============================================
let carteSelectedNotion = null;
let carteDragging = null;
let carteOffset = { x: 0, y: 0 };
let carteZoom = 1;
let cartePan = { x: 0, y: 0 };

function populateCarte() {
    const notionList = document.getElementById('notion-list');
    const carteMain = document.getElementById('carte-main');

    // Build sidebar list grouped by theme
    const notionsByTheme = {};
    NOTIONS.forEach(n => {
        if (!notionsByTheme[n.theme]) notionsByTheme[n.theme] = [];
        notionsByTheme[n.theme].push(n);
    });

    notionList.innerHTML = Object.entries(THEMES).map(([themeId, theme]) => {
        const notions = notionsByTheme[themeId] || [];
        if (notions.length === 0) return '';
        return `
            <div class="notion-theme-group">
                <div class="notion-theme-header" style="color: ${theme.color}">${theme.name}</div>
                ${notions.map(n => `
                    <div class="notion-item" data-notion="${n.id}" onclick="selectNotion('${n.id}')">
                        <span class="notion-dot" style="background: ${THEMES[n.theme].color}"></span>
                        ${n.name}
                    </div>
                `).join('')}
            </div>
        `;
    }).join('');

    // Create SVG canvas for the graph
    carteMain.innerHTML = `
        <div class="carte-graph-container" id="carte-graph-container">
            <div class="carte-controls">
                <button class="carte-control-btn" onclick="carteZoomIn()" title="Zoom +">+</button>
                <button class="carte-control-btn" onclick="carteZoomOut()" title="Zoom -">-</button>
                <button class="carte-control-btn" onclick="carteReset()" title="Reset">R</button>
            </div>
            <svg id="carte-svg" class="carte-svg">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-muted)" />
                    </marker>
                </defs>
                <g id="carte-group">
                    <g id="carte-links"></g>
                    <g id="carte-nodes"></g>
                </g>
            </svg>
            <div id="carte-tooltip" class="carte-tooltip"></div>
        </div>
        <div id="carte-detail" class="carte-detail"></div>
    `;

    // Render the graph
    renderCarteGraph();

    // Setup interactions
    setupCarteInteractions();
}

function renderCarteGraph() {
    const linksGroup = document.getElementById('carte-links');
    const nodesGroup = document.getElementById('carte-nodes');

    if (!linksGroup || !nodesGroup) return;

    // Build position map
    const positions = {};
    NOTIONS.forEach(n => {
        positions[n.id] = { x: n.x, y: n.y };
    });

    // Render links (edges)
    linksGroup.innerHTML = CARTE_LIENS.map(link => {
        const source = positions[link.source];
        const target = positions[link.target];
        if (!source || !target) return '';

        // Calculate line with some curve
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 0.5;

        return `
            <path class="carte-link"
                d="M${source.x},${source.y} Q${(source.x + target.x)/2 + dy*0.1},${(source.y + target.y)/2 - dx*0.1} ${target.x},${target.y}"
                data-source="${link.source}"
                data-target="${link.target}"/>
        `;
    }).join('');

    // Render nodes
    nodesGroup.innerHTML = NOTIONS.map(n => {
        const theme = THEMES[n.theme];
        const exerciseCount = EXERCICES.filter(ex => ex.theme === n.theme).length;

        return `
            <g class="carte-node" data-notion="${n.id}" transform="translate(${n.x}, ${n.y})">
                <circle class="carte-node-circle" r="30" fill="${theme.color}" />
                <circle class="carte-node-ring" r="35" fill="none" stroke="${theme.color}" stroke-width="2" opacity="0.3" />
                <text class="carte-node-label" dy="50" text-anchor="middle">${n.name}</text>
                <text class="carte-node-count" dy="5" text-anchor="middle">${exerciseCount}</text>
            </g>
        `;
    }).join('');

    // Add click handlers to nodes
    document.querySelectorAll('.carte-node').forEach(node => {
        node.addEventListener('click', (e) => {
            e.stopPropagation();
            selectNotion(node.dataset.notion);
        });
        node.addEventListener('mouseenter', (e) => showCarteTooltip(e, node.dataset.notion));
        node.addEventListener('mouseleave', hideCarteTooltip);
    });
}

function setupCarteInteractions() {
    const container = document.getElementById('carte-graph-container');
    const svg = document.getElementById('carte-svg');
    const group = document.getElementById('carte-group');

    if (!container || !svg || !group) return;

    let isPanning = false;
    let startPoint = { x: 0, y: 0 };

    // Pan with mouse drag
    svg.addEventListener('mousedown', (e) => {
        if (e.target === svg || e.target.classList.contains('carte-link')) {
            isPanning = true;
            startPoint = { x: e.clientX - cartePan.x, y: e.clientY - cartePan.y };
            svg.style.cursor = 'grabbing';
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (isPanning) {
            cartePan.x = e.clientX - startPoint.x;
            cartePan.y = e.clientY - startPoint.y;
            updateCarteTransform();
        }
    });

    window.addEventListener('mouseup', () => {
        isPanning = false;
        svg.style.cursor = 'grab';
    });

    // Zoom with wheel
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        carteZoom = Math.max(0.3, Math.min(3, carteZoom * delta));
        updateCarteTransform();
    });

    // Initial transform
    updateCarteTransform();
}

function updateCarteTransform() {
    const group = document.getElementById('carte-group');
    if (group) {
        group.setAttribute('transform', `translate(${cartePan.x}, ${cartePan.y}) scale(${carteZoom})`);
    }
}

function carteZoomIn() {
    carteZoom = Math.min(3, carteZoom * 1.2);
    updateCarteTransform();
}

function carteZoomOut() {
    carteZoom = Math.max(0.3, carteZoom / 1.2);
    updateCarteTransform();
}

function carteReset() {
    carteZoom = 1;
    cartePan = { x: 50, y: 50 };
    updateCarteTransform();
}

function showCarteTooltip(e, notionId) {
    const tooltip = document.getElementById('carte-tooltip');
    const notion = NOTIONS.find(n => n.id === notionId);
    if (!tooltip || !notion) return;

    const theme = THEMES[notion.theme];
    const exerciseCount = EXERCICES.filter(ex => ex.theme === notion.theme).length;
    const relatedLinks = CARTE_LIENS.filter(l => l.source === notionId || l.target === notionId);

    tooltip.innerHTML = `
        <strong style="color: ${theme.color}">${notion.name}</strong>
        <div style="font-size: 0.8rem; margin-top: 0.25rem;">
            ${theme.name} - ${exerciseCount} exercices
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
            ${relatedLinks.length} connexions
        </div>
    `;

    const rect = e.target.closest('.carte-node').getBoundingClientRect();
    const containerRect = document.getElementById('carte-graph-container').getBoundingClientRect();

    tooltip.style.left = `${rect.left - containerRect.left + rect.width/2}px`;
    tooltip.style.top = `${rect.top - containerRect.top - 10}px`;
    tooltip.classList.add('visible');
}

function hideCarteTooltip() {
    const tooltip = document.getElementById('carte-tooltip');
    if (tooltip) tooltip.classList.remove('visible');
}

function selectNotion(notionId) {
    carteSelectedNotion = notionId;

    // Update sidebar
    document.querySelectorAll('.notion-item').forEach(item => {
        item.classList.toggle('active', item.dataset.notion === notionId);
    });

    // Highlight node in graph
    document.querySelectorAll('.carte-node').forEach(node => {
        node.classList.toggle('selected', node.dataset.notion === notionId);
    });

    // Highlight connected links
    document.querySelectorAll('.carte-link').forEach(link => {
        const isConnected = link.dataset.source === notionId || link.dataset.target === notionId;
        link.classList.toggle('highlighted', isConnected);
    });

    // Show detail panel
    const notion = NOTIONS.find(n => n.id === notionId);
    if (!notion) return;

    const theme = THEMES[notion.theme];
    const relatedExercises = EXERCICES.filter(ex => ex.theme === notion.theme);
    const relatedMethodes = METHODES.filter(m =>
        relatedExercises.some(ex => ex.methodes.includes(m.id))
    );

    // Find connected notions
    const connectedNotions = CARTE_LIENS
        .filter(l => l.source === notionId || l.target === notionId)
        .map(l => l.source === notionId ? l.target : l.source)
        .map(id => NOTIONS.find(n => n.id === id))
        .filter(Boolean);

    const detailPanel = document.getElementById('carte-detail');
    if (detailPanel) {
        detailPanel.innerHTML = `
            <div class="carte-detail-header" style="border-left-color: ${theme.color}">
                <h2>${notion.name}</h2>
                <span class="carte-detail-theme" style="background: ${theme.color}">${theme.name}</span>
            </div>

            ${connectedNotions.length > 0 ? `
                <div class="carte-detail-section">
                    <h3>Notions liees</h3>
                    <div class="carte-connected-notions">
                        ${connectedNotions.map(cn => `
                            <span class="carte-connected-notion"
                                style="border-color: ${THEMES[cn.theme].color}"
                                onclick="selectNotion('${cn.id}')">
                                ${cn.name}
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="carte-detail-section">
                <h3>Exercices (${relatedExercises.length})</h3>
                <div class="carte-exercises-list">
                    ${relatedExercises.slice(0, 6).map(ex => `
                        <div class="carte-exercise-item" onclick="openExercise('${ex.id}')">
                            <span class="carte-exercise-tag">${ex.concours}</span>
                            <span class="carte-exercise-title">${ex.title}</span>
                            <span class="carte-exercise-diff">
                                ${'●'.repeat(ex.difficulty)}${'○'.repeat(3-ex.difficulty)}
                            </span>
                        </div>
                    `).join('')}
                    ${relatedExercises.length > 6 ? `
                        <div class="carte-more-link" onclick="filterByTheme('${notion.theme}')">
                            Voir les ${relatedExercises.length - 6} autres...
                        </div>
                    ` : ''}
                </div>
            </div>

            ${relatedMethodes.length > 0 ? `
                <div class="carte-detail-section">
                    <h3>Methodes</h3>
                    <div class="carte-methodes-list">
                        ${relatedMethodes.slice(0, 4).map(m => `
                            <div class="carte-methode-item" onclick="openMethode('${m.id}')">
                                <span class="carte-methode-icon">${m.icon}</span>
                                <span class="carte-methode-name">${m.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        detailPanel.classList.add('visible');
    }
}

// ============================================
// FICHES VIEW - Memo, Erreurs, Questions Jury
// ============================================
function populateFiches() {
    populateFichesMemo();
    populateErreurs();
    populateJuryQuestions();
}

function switchFichesTab(tab) {
    // Update tabs
    document.querySelectorAll('.fiches-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });

    // Update content
    document.querySelectorAll('.fiches-content').forEach(c => {
        c.classList.remove('active');
    });
    document.getElementById(`tab-${tab}`).classList.add('active');

    // Render math
    setTimeout(renderAllMath, 50);
}

function populateFichesMemo() {
    const grid = document.getElementById('fiches-memo-grid');
    if (!grid) return;

    grid.innerHTML = FICHES_MEMO.map(fiche => {
        const theme = THEMES[fiche.theme];
        return `
            <div class="fiche-card" onclick="openFiche('${fiche.id}')">
                <div class="fiche-card-icon" style="background: ${theme?.color || 'var(--accent)'}">${fiche.icon}</div>
                <div class="fiche-card-content">
                    <h3>${fiche.title}</h3>
                    <p>${fiche.formulas.length} formules - ${fiche.tips.length} conseils</p>
                    <span class="fiche-card-theme" style="color: ${theme?.color || 'var(--accent)'}">${theme?.name || fiche.theme}</span>
                </div>
            </div>
        `;
    }).join('');
}

function openFiche(ficheId) {
    const fiche = FICHES_MEMO.find(f => f.id === ficheId);
    if (!fiche) return;

    const theme = THEMES[fiche.theme];
    const modal = document.getElementById('fiche-modal');
    const body = document.getElementById('fiche-modal-body');

    body.innerHTML = `
        <div class="fiche-detail">
            <div class="fiche-detail-header" style="border-left-color: ${theme?.color || 'var(--accent)'}">
                <span class="fiche-icon" style="background: ${theme?.color || 'var(--accent)'}">${fiche.icon}</span>
                <div>
                    <h2>${fiche.title}</h2>
                    <span class="fiche-theme">${theme?.name || fiche.theme}</span>
                </div>
            </div>

            <div class="fiche-formulas">
                ${fiche.formulas.map(f => `
                    <div class="fiche-formula">
                        <span class="formula-name">${f.name}</span>
                        <span class="formula-content">${f.formula}</span>
                    </div>
                `).join('')}
            </div>

            <div class="fiche-tips">
                <h3>Conseils</h3>
                <ul>
                    ${fiche.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    modal.classList.add('active');
    setTimeout(renderAllMath, 50);
}

function closeFicheModal() {
    document.getElementById('fiche-modal').classList.remove('active');
}

function populateErreurs() {
    // Populate theme filter
    const themeFilter = document.getElementById('erreurs-theme-filter');
    if (themeFilter) {
        const themes = [...new Set(ERREURS_FREQUENTES.map(e => e.theme))];
        themeFilter.innerHTML = `
            <option value="all">Tous les themes</option>
            ${themes.map(t => `<option value="${t}">${THEMES[t]?.name || t}</option>`).join('')}
        `;
    }

    filterErreurs();
}

function filterErreurs() {
    const themeFilter = document.getElementById('erreurs-theme-filter')?.value || 'all';
    const severityFilter = document.getElementById('erreurs-severity-filter')?.value || 'all';

    const filtered = ERREURS_FREQUENTES.filter(e => {
        if (themeFilter !== 'all' && e.theme !== themeFilter) return false;
        if (severityFilter !== 'all' && e.severity !== severityFilter) return false;
        return true;
    });

    const list = document.getElementById('erreurs-list');
    if (!list) return;

    list.innerHTML = filtered.map(err => {
        const theme = THEMES[err.theme];
        return `
            <div class="erreur-card ${err.severity}">
                <div class="erreur-header">
                    <span class="erreur-severity ${err.severity}">${err.severity === 'haute' ? 'Critique' : 'Attention'}</span>
                    <span class="erreur-theme" style="color: ${theme?.color || 'var(--accent)'}">${theme?.name || err.theme}</span>
                </div>
                <h3>${err.title}</h3>
                <p class="erreur-description">${err.description}</p>

                <div class="erreur-exemple">
                    <div class="erreur-faux">
                        <span class="erreur-label">Erreur :</span>
                        <span>${err.exemple.faux}</span>
                    </div>
                    <div class="erreur-correct">
                        <span class="erreur-label">Correct :</span>
                        <span>${err.exemple.correct}</span>
                    </div>
                </div>

                <div class="erreur-conseil">
                    <strong>Conseil :</strong> ${err.conseil}
                </div>
            </div>
        `;
    }).join('');

    setTimeout(renderAllMath, 50);
}

function populateJuryQuestions() {
    // Populate theme filter
    const themeFilter = document.getElementById('jury-theme-filter');
    if (themeFilter) {
        const themes = [...new Set(QUESTIONS_JURY.map(q => q.theme))];
        themeFilter.innerHTML = `
            <option value="all">Tous les themes</option>
            ${themes.map(t => `<option value="${t}">${t === 'general' ? 'Questions generales' : (THEMES[t]?.name || t)}</option>`).join('')}
        `;
    }

    // Populate type filter
    const typeFilter = document.getElementById('jury-type-filter');
    if (typeFilter) {
        const types = [...new Set(QUESTIONS_JURY.map(q => q.type))];
        typeFilter.innerHTML = `
            <option value="all">Tous</option>
            ${types.map(t => `<option value="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('')}
        `;
    }

    filterJuryQuestions();
}

function filterJuryQuestions() {
    const themeFilter = document.getElementById('jury-theme-filter')?.value || 'all';
    const typeFilter = document.getElementById('jury-type-filter')?.value || 'all';

    const filtered = QUESTIONS_JURY.filter(q => {
        if (themeFilter !== 'all' && q.theme !== themeFilter) return false;
        if (typeFilter !== 'all' && q.type !== typeFilter) return false;
        return true;
    });

    const list = document.getElementById('jury-list');
    if (!list) return;

    list.innerHTML = filtered.map(q => {
        const theme = THEMES[q.theme];
        const themeLabel = q.theme === 'general' ? 'General' : (theme?.name || q.theme);
        const themeColor = theme?.color || 'var(--accent)';

        return `
            <div class="jury-card">
                <div class="jury-header">
                    <span class="jury-type">${q.type}</span>
                    <span class="jury-theme" style="color: ${themeColor}">${themeLabel}</span>
                </div>
                <div class="jury-question">"${q.question}"</div>
                <div class="jury-details">
                    <div class="jury-conseil">
                        <strong>Conseil :</strong> ${q.conseil}
                    </div>
                    <div class="jury-reponse">
                        <strong>Type de reponse attendue :</strong> ${q.reponseType}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    setTimeout(renderAllMath, 50);
}

// ============================================
// ORAUX VIEW
// ============================================
function startOral(type) {
    // For now, just open a random exercise in oral mode
    const randomEx = EXERCICES[Math.floor(Math.random() * EXERCICES.length)];
    openExercise(randomEx.id);

    // Could add timer overlay for 'standard' mode
    if (type === 'standard') {
        showModal('Oral standard', `
            <p>Tu as 30 minutes pour preparer l'exercice suivant.</p>
            <p><strong>${randomEx.title}</strong></p>
            <p style="margin-top: 1rem; color: var(--text-secondary)">Un chronometre sera affiche. Bonne chance !</p>
            <button class="validate-btn" style="margin-top: 1rem;" onclick="closeModal()">Commencer</button>
        `);
    }
}

// ============================================
// EXPRESS MODE
// ============================================
function startExpressMode() {
    expressTimeLeft = 300;
    expressCorrect = 0;
    expressTotal = 0;
    expressQuestionIndex = 0;

    switchView('express');

    // Shuffle questions
    EXPRESS_QUESTIONS.sort(() => Math.random() - 0.5);

    // Start timer
    updateExpressTimer();
    expressTimer = setInterval(() => {
        expressTimeLeft--;
        updateExpressTimer();

        if (expressTimeLeft <= 0) {
            endExpressMode();
        }
    }, 1000);

    // Show first question
    showExpressQuestion();
}

function updateExpressTimer() {
    const mins = Math.floor(expressTimeLeft / 60);
    const secs = expressTimeLeft % 60;
    document.getElementById('express-time').textContent =
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function showExpressQuestion() {
    if (expressQuestionIndex >= EXPRESS_QUESTIONS.length) {
        expressQuestionIndex = 0; // Loop
    }

    const q = EXPRESS_QUESTIONS[expressQuestionIndex];

    document.getElementById('express-question').innerHTML = `
        <h3>${q.type.charAt(0).toUpperCase() + q.type.slice(1)}</h3>
        <p>${q.question}</p>
    `;

    document.getElementById('express-actions').innerHTML = q.options.map((opt, i) => `
        <button class="express-option" data-index="${i}" onclick="answerExpress(${i}, ${q.correct})">
            ${opt}
        </button>
    `).join('');

    document.getElementById('express-correct').textContent = expressCorrect;
    document.getElementById('express-total').textContent = expressTotal;

    setTimeout(renderAllMath, 50);
}

function answerExpress(selected, correct) {
    expressTotal++;

    const buttons = document.querySelectorAll('.express-option');
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === correct) {
            btn.classList.add('correct');
        } else if (i === selected && selected !== correct) {
            btn.classList.add('incorrect');
        }
    });

    if (selected === correct) {
        expressCorrect++;
    }

    document.getElementById('express-correct').textContent = expressCorrect;
    document.getElementById('express-total').textContent = expressTotal;

    // Next question after delay
    setTimeout(() => {
        expressQuestionIndex++;
        showExpressQuestion();
    }, 1000);
}

function quitExpress() {
    endExpressMode();
}

function endExpressMode() {
    if (expressTimer) {
        clearInterval(expressTimer);
        expressTimer = null;
    }

    const timeSpent = 300 - expressTimeLeft;
    const score = expressTotal > 0 ? Math.round((expressCorrect / expressTotal) * 100) : 0;

    // Track session in localStorage
    trackExpressSession(expressCorrect, expressTotal, timeSpent);
    saveProgress(userProgress); // Save theme stats too

    // Get personal best
    const bestScore = userProgress.express.bestScore;
    const isNewBest = score === bestScore && score > 0;

    showModal('Session terminee !', `
        <div style="text-align: center;">
            <p style="font-size: 3rem; font-weight: 700; color: var(--accent);">${score}%</p>
            ${isNewBest ? '<p style="color: var(--success); font-weight: 600; margin-bottom: 0.5rem;">Nouveau record !</p>' : ''}
            <p style="margin-bottom: 1rem;">${expressCorrect} / ${expressTotal} bonnes reponses</p>
            <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                ${score >= 80 ? 'Excellent ! Tu maitrises les reflexes.' :
                  score >= 60 ? 'Bien ! Continue a t\'entrainer.' :
                  'Revois les methodes et recommence !'}
            </p>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
                Meilleur score : ${bestScore}% | Sessions : ${userProgress.stats.expressSessions}
            </p>
            <button class="validate-btn" style="margin-top: 1.5rem;" onclick="closeModal(); populateHome(); switchView('home');">Retour</button>
        </div>
    `);
}

// ============================================
// MODAL
// ============================================
function showModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-content').innerHTML = content;
    document.getElementById('modal-overlay').classList.add('active');
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.getElementById('modal').classList.remove('active');
}

// ============================================
// PROFIL VIEW
// ============================================
function populateProfil() {
    // Update overview stats
    const totalExercises = EXERCICES.length;
    const completedExercises = userProgress.stats.exercisesCompleted;
    document.getElementById('profil-exercises-done').textContent = `${completedExercises}/${totalExercises}`;
    document.getElementById('profil-streak').textContent = userProgress.stats.streak;
    document.getElementById('profil-express-sessions').textContent = userProgress.stats.expressSessions;
    document.getElementById('profil-best-score').textContent = `${userProgress.express.bestScore}%`;

    // Populate theme mastery
    populateProfilThemes();

    // Populate express history
    populateExpressHistory();

    // Populate recent activity
    populateRecentActivity();
}

function populateProfilThemes() {
    const container = document.getElementById('profil-themes');
    if (!container) return;

    container.innerHTML = Object.entries(THEMES).map(([themeId, theme]) => {
        const mastery = getThemeMastery(themeId);
        const themeExercises = EXERCICES.filter(e => e.theme === themeId);
        const completed = themeExercises.filter(e =>
            userProgress.exercises[e.id]?.status === 'completed'
        ).length;
        const inProgress = themeExercises.filter(e =>
            userProgress.exercises[e.id]?.status === 'in_progress'
        ).length;

        const expressStats = userProgress.themes[themeId];
        const expressPercent = expressStats && expressStats.expressTotal > 0
            ? Math.round((expressStats.expressCorrect / expressStats.expressTotal) * 100)
            : null;

        return `
            <div class="profil-theme-card">
                <div class="profil-theme-header">
                    <div class="profil-theme-name" style="color: ${theme.color}">${theme.name}</div>
                    <div class="profil-theme-mastery ${mastery >= 70 ? 'high' : mastery >= 40 ? 'medium' : 'low'}">${mastery}%</div>
                </div>
                <div class="profil-theme-progress">
                    <div class="profil-theme-bar">
                        <div class="profil-theme-fill" style="width: ${mastery}%; background: ${theme.color}"></div>
                    </div>
                </div>
                <div class="profil-theme-details">
                    <span class="profil-theme-stat">
                        <span class="stat-completed">${completed}</span>/${themeExercises.length} exercices
                    </span>
                    ${inProgress > 0 ? `<span class="profil-theme-stat in-progress">${inProgress} en cours</span>` : ''}
                    ${expressPercent !== null ? `<span class="profil-theme-stat express">Express: ${expressPercent}%</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function populateExpressHistory() {
    const container = document.getElementById('profil-express-history');
    if (!container) return;

    const sessions = userProgress.express.sessions;

    if (sessions.length === 0) {
        container.innerHTML = '<p class="empty-state">Aucune session Express pour le moment. Lance-toi !</p>';
        return;
    }

    // Show last 10 sessions
    const recentSessions = sessions.slice(-10).reverse();

    container.innerHTML = `
        <div class="express-history-chart">
            ${recentSessions.map((session, i) => {
                const height = Math.max(10, session.percentage);
                const date = new Date(session.date);
                const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                return `
                    <div class="express-history-bar" style="--height: ${height}%">
                        <div class="bar-fill ${session.percentage >= 80 ? 'high' : session.percentage >= 60 ? 'medium' : 'low'}"></div>
                        <span class="bar-value">${session.percentage}%</span>
                        <span class="bar-date">${dateStr}</span>
                    </div>
                `;
            }).join('')}
        </div>
        <div class="express-history-summary">
            <div class="summary-stat">
                <span class="summary-value">${userProgress.express.totalQuestions}</span>
                <span class="summary-label">questions au total</span>
            </div>
            <div class="summary-stat">
                <span class="summary-value">${userProgress.express.correctAnswers}</span>
                <span class="summary-label">bonnes reponses</span>
            </div>
            <div class="summary-stat">
                <span class="summary-value">${userProgress.express.totalQuestions > 0 ? Math.round((userProgress.express.correctAnswers / userProgress.express.totalQuestions) * 100) : 0}%</span>
                <span class="summary-label">taux global</span>
            </div>
        </div>
    `;
}

function populateRecentActivity() {
    const container = document.getElementById('profil-recent');
    if (!container) return;

    // Get recent exercise activity
    const recentExercises = Object.entries(userProgress.exercises)
        .filter(([id, data]) => data.date)
        .sort((a, b) => new Date(b[1].date) - new Date(a[1].date))
        .slice(0, 8);

    if (recentExercises.length === 0) {
        container.innerHTML = '<p class="empty-state">Aucune activite recente. Commence par un exercice !</p>';
        return;
    }

    container.innerHTML = `
        <div class="recent-activity-list">
            ${recentExercises.map(([id, data]) => {
                const exercise = EXERCICES.find(e => e.id === id);
                if (!exercise) return '';
                const date = new Date(data.date);
                const dateStr = date.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                const statusIcon = data.status === 'completed' ? '✓' :
                                   data.status === 'in_progress' ? '◐' : '○';
                const statusClass = data.status;

                return `
                    <div class="recent-activity-item ${statusClass}" onclick="openExercise('${id}')">
                        <span class="recent-status ${statusClass}">${statusIcon}</span>
                        <div class="recent-info">
                            <span class="recent-title">${exercise.title}</span>
                            <span class="recent-meta">${exercise.concours} - ${THEMES[exercise.theme]?.name || exercise.theme}</span>
                        </div>
                        <span class="recent-date">${dateStr}</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// ============================================
// UTILITIES
// ============================================
// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (currentView === 'exercise') {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
            if (currentStep < STEPS.length - 1) nextStep();
        }
        if (e.key === 'ArrowLeft') {
            if (currentStep > 0) prevStep();
        }
    }
    if (e.key === 'Escape') {
        if (document.getElementById('modal').classList.contains('active')) {
            closeModal();
        }
    }
});
