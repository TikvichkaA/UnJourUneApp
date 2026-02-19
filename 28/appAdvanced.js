// KartApp - Advanced Methods for A2-B2 Content
// This file extends and overrides KartApp methods to include dynamic data

// Store original methods
const originalRenderVocabulary = KartApp.prototype.renderVocabulary;
const originalRenderGrammar = KartApp.prototype.renderGrammar;
const originalRenderUnits = KartApp.prototype.renderUnits;

// Override renderVocabulary to include lexicon data
KartApp.prototype.renderVocabulary = function(filter = 'all') {
    const list = document.getElementById('vocabularyList');
    list.innerHTML = '';

    const levelMap = { 'beginner': 1, 'elementary': 2, 'intermediate': 3 };
    const userLevelNum = levelMap[this.userProfile.level] || 1;

    // Get original vocabulary from GEO_DATA
    let allWords = [];
    Object.keys(GEO_DATA.vocabulary).forEach(category => {
        GEO_DATA.vocabulary[category].forEach(word => {
            allWords.push({ ...word, category, source: 'basic' });
        });
    });

    // Add vocabulary from lexicon.json if loaded
    if (dataService.loaded && dataService.lexicon) {
        // Add verbs
        dataService.getVerbs().forEach(verb => {
            const baseForm = verb.conjugation?.present?.['3sg'] || verb.family?.base || verb.root;
            allWords.push({
                geo: baseForm,
                translit: '',
                meaning: verb.meaning,
                level: verb.level === 'A2' ? 2 : verb.level === 'B1' ? 3 : verb.level === 'B2' ? 4 : 2,
                category: 'verbs',
                source: 'lexicon',
                type: 'verb',
                verbId: verb.id
            });
        });

        // Add nouns
        dataService.getNouns().forEach(noun => {
            allWords.push({
                geo: noun.nominative,
                translit: '',
                meaning: noun.meaning,
                level: noun.level === 'A2' ? 2 : noun.level === 'B1' ? 3 : noun.level === 'B2' ? 4 : 2,
                category: 'nouns',
                source: 'lexicon',
                type: 'noun',
                nounId: noun.id
            });
        });

        // Add adjectives
        dataService.getAdjectives().forEach(adj => {
            allWords.push({
                geo: adj.base,
                translit: '',
                meaning: adj.meaning,
                level: adj.level === 'A2' ? 2 : adj.level === 'B1' ? 3 : adj.level === 'B2' ? 4 : 2,
                category: 'adjectives',
                source: 'lexicon',
                type: 'adjective'
            });
        });

        // Add postpositions
        dataService.getPostpositions().forEach(post => {
            allWords.push({
                geo: post.form,
                translit: '',
                meaning: post.meaning,
                level: 2,
                category: 'postpositions',
                source: 'lexicon',
                type: 'postposition'
            });
        });

        // Add conjunctions
        dataService.getConjunctions().forEach(conj => {
            allWords.push({
                geo: conj.geo,
                translit: '',
                meaning: conj.meaning,
                level: conj.level === 'A2' ? 2 : conj.level === 'B1' ? 3 : conj.level === 'B2' ? 4 : 2,
                category: 'conjunctions',
                source: 'lexicon',
                type: 'conjunction'
            });
        });

        // Add adverbs
        dataService.getAdverbs().forEach(adv => {
            allWords.push({
                geo: adv.geo,
                translit: '',
                meaning: adv.meaning,
                level: adv.level === 'A2' ? 2 : adv.level === 'B1' ? 3 : adv.level === 'B2' ? 4 : 2,
                category: 'adverbs',
                source: 'lexicon',
                type: 'adverb'
            });
        });
    }

    // Remove duplicates (prefer lexicon version)
    const seen = new Set();
    allWords = allWords.filter(word => {
        if (seen.has(word.geo)) return false;
        seen.add(word.geo);
        return true;
    });

    // Apply filters
    if (filter === 'learned') {
        allWords = allWords.filter(w => this.progress.learnedWords.includes(w.geo));
    } else if (filter === 'review') {
        allWords = allWords.filter(w => this.progress.wordsToReview.includes(w.geo));
    } else if (filter === 'new') {
        allWords = allWords.filter(w => !this.progress.learnedWords.includes(w.geo));
    }

    // Sort by level
    allWords.sort((a, b) => (a.level || 1) - (b.level || 1));

    if (allWords.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px;">Aucun mot dans cette catégorie.</p>';
        return;
    }

    allWords.forEach(word => {
        const card = document.createElement('div');
        card.className = 'vocab-card';

        // Add level badge for advanced vocabulary
        const levelBadge = word.source === 'lexicon' ?
            `<span class="vocab-level-badge">${word.level === 2 ? 'A2' : word.level === 3 ? 'B1' : 'B2'}</span>` : '';

        // Add type indicator
        const typeIndicator = word.type ?
            `<span class="vocab-type">${this.getTypeLabel(word.type)}</span>` : '';

        card.innerHTML = `
            <div class="vocab-main">
                <span class="vocab-geo">${word.geo}</span>
                ${word.translit ? `<span class="vocab-translit">${word.translit}</span>` : ''}
            </div>
            <div class="vocab-details">
                <span class="vocab-meaning">${word.meaning}</span>
                ${levelBadge}
                ${typeIndicator}
            </div>
            <button class="vocab-audio" onclick="event.stopPropagation(); app.playWord('${word.geo}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
            </button>
        `;

        // Click handler - show detail for lexicon items, toggle learned for basic
        card.addEventListener('click', () => {
            if (word.source === 'lexicon' && word.verbId) {
                this.showVerbDetail(word.verbId);
            } else if (word.source === 'lexicon' && word.nounId) {
                this.showNounDetail(word.nounId);
            } else {
                this.toggleWordLearned(word.geo);
            }
        });

        list.appendChild(card);
    });
};

// Helper for type labels
KartApp.prototype.getTypeLabel = function(type) {
    const labels = {
        verb: 'Verbe',
        noun: 'Nom',
        adjective: 'Adj.',
        postposition: 'Post.',
        conjunction: 'Conj.',
        adverb: 'Adv.'
    };
    return labels[type] || type;
};

// Override renderGrammar to include rules.json
KartApp.prototype.renderGrammar = function() {
    const list = document.getElementById('grammarList');
    list.innerHTML = '';

    // First add original GEO_DATA grammar
    GEO_DATA.grammar.forEach(rule => {
        const card = document.createElement('button');
        card.className = 'grammar-card';
        card.innerHTML = `
            <h3>${rule.title}</h3>
            <p>${rule.shortDesc}</p>
        `;
        card.addEventListener('click', () => this.showGrammarDetail(rule));
        list.appendChild(card);
    });

    // Then add rules from rules.json grouped by level
    if (dataService.loaded) {
        const rules = dataService.getRules();
        if (rules.length > 0) {
            // Add separator
            const separator = document.createElement('div');
            separator.className = 'grammar-separator';
            separator.innerHTML = '<h3>Grammaire avancée (A2-B2)</h3>';
            list.appendChild(separator);

            // Group by level
            const byLevel = { 'A2': [], 'B1': [], 'B2': [] };
            rules.forEach(rule => {
                if (byLevel[rule.level]) byLevel[rule.level].push(rule);
            });

            Object.entries(byLevel).forEach(([level, levelRules]) => {
                if (levelRules.length === 0) return;

                const levelHeader = document.createElement('div');
                levelHeader.className = 'grammar-level-header';
                levelHeader.innerHTML = `<h4>${level}</h4>`;
                list.appendChild(levelHeader);

                levelRules.forEach(rule => {
                    const card = document.createElement('button');
                    card.className = 'grammar-card advanced';
                    card.innerHTML = `
                        <div class="grammar-card-header">
                            <span class="grammar-level-badge">${rule.level}</span>
                            <h3>${rule.title}</h3>
                        </div>
                        <p>${rule.content.substring(0, 100)}...</p>
                    `;
                    card.addEventListener('click', () => this.showAdvancedRuleDetail(rule));
                    list.appendChild(card);
                });
            });
        }
    }
};

// Override renderUnits to include course_plan.json units
KartApp.prototype.renderUnits = function() {
    const list = document.getElementById('unitsList');
    list.innerHTML = '';

    console.log('renderUnits called, dataService.loaded:', dataService.loaded);
    console.log('Advanced units count:', dataService.getAdvancedUnits().length);

    const unlockedUnits = this.userProfile.unlockedUnits || [1];
    const userLevel = this.getUserLevelNumber();

    const getBelowLevelUnits = () => {
        if (userLevel >= 3) return [1, 2];
        if (userLevel >= 2) return [1];
        return [];
    };
    const belowLevelUnits = getBelowLevelUnits();

    // Render original GEO_DATA units first
    GEO_DATA.units.forEach((unit, index) => {
        const previousUnitCompleted = index === 0 || this.progress.completedUnits.includes(GEO_DATA.units[index - 1].id);
        const isUnlockedByProfile = unlockedUnits.includes(unit.id);
        const isLocked = !isUnlockedByProfile && !previousUnitCompleted;
        const isCompleted = this.progress.completedUnits.includes(unit.id);
        const isBelowLevel = belowLevelUnits.includes(unit.id) && !isCompleted;
        const unitProgress = this.getUnitProgress(unit.id);

        const card = document.createElement('button');
        card.className = 'unit-card';
        if (isLocked) card.classList.add('locked');
        if (isCompleted) card.classList.add('completed');
        if (isBelowLevel) card.classList.add('below-level');

        const levelLabel = isBelowLevel ? '<span class="unit-level-tag">Niveau inférieur</span>' : '';

        card.innerHTML = `
            <div class="unit-header">
                <div class="unit-number">${unit.id}</div>
                <div class="unit-title">
                    <h3>${unit.title}</h3>
                    <p>${unit.description}</p>
                </div>
            </div>
            <div class="unit-progress">
                <div class="unit-progress-bar" style="width: ${unitProgress}%"></div>
            </div>
            ${levelLabel}
        `;

        if (!isLocked) {
            card.addEventListener('click', () => this.openUnit(unit));
        }

        list.appendChild(card);
    });

    // Add advanced units from course_plan.json
    if (dataService.loaded) {
        const advancedUnits = dataService.getAdvancedUnits();
        if (advancedUnits.length > 0) {
            // Add separator
            const separator = document.createElement('div');
            separator.className = 'units-separator';
            separator.innerHTML = '<h3>Cours avancé (A2-B2)</h3>';
            list.appendChild(separator);

            advancedUnits.forEach(unit => {
                const card = document.createElement('button');
                card.className = 'unit-card advanced';

                card.innerHTML = `
                    <div class="unit-header">
                        <div class="unit-level-badge">${unit.level}</div>
                        <div class="unit-title">
                            <h3>${unit.title}</h3>
                            <p>${unit.description}</p>
                        </div>
                    </div>
                    <div class="unit-focus-preview">
                        ${unit.focus.slice(0, 2).map(f => `<span class="focus-tag">${f}</span>`).join('')}
                    </div>
                `;

                card.addEventListener('click', () => this.openAdvancedUnit(unit.id));
                list.appendChild(card);
            });
        }
    }
};

// Show advanced rule detail
KartApp.prototype.showAdvancedRuleDetail = function(rule) {
    const container = document.getElementById('grammarDetail');

    let examplesHtml = '';
    if (rule.examples && rule.examples.length > 0) {
        examplesHtml = `
            <div class="rule-examples">
                <h4>Exemples</h4>
                ${rule.examples.map(ex => `
                    <div class="rule-example">
                        <span class="example-geo">${ex.geo}</span>
                        <span class="example-fr">${ex.fr}</span>
                        ${ex.gloss ? `<span class="example-gloss">${ex.gloss}</span>` : ''}
                        ${ex.note ? `<span class="example-note">${ex.note}</span>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    let vocabularyHtml = '';
    if (rule.vocabulary && rule.vocabulary.length > 0) {
        vocabularyHtml = `
            <div class="rule-vocabulary">
                <h4>Vocabulaire</h4>
                ${rule.vocabulary.map(v => `
                    <div class="vocab-item">
                        <span class="geo">${v.geo}</span>
                        <span class="fr">${v.fr}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    let pedagogyHtml = '';
    if (rule.pedagogyNotes && rule.pedagogyNotes.length > 0) {
        pedagogyHtml = `
            <div class="rule-pedagogy">
                <h4>Notes pédagogiques</h4>
                <ul>
                    ${rule.pedagogyNotes.map(note => `<li>${note}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    let warningHtml = rule.warning ?
        `<div class="rule-warning"><strong>Attention :</strong> ${rule.warning}</div>` : '';

    container.innerHTML = `
        <div class="rule-header">
            <span class="rule-level-badge">${rule.level}</span>
            <h2>${rule.title}</h2>
        </div>
        <div class="rule-content">
            <p>${rule.content}</p>
        </div>
        ${warningHtml}
        ${examplesHtml}
        ${vocabularyHtml}
        ${pedagogyHtml}
    `;

    this.navigateTo('grammarDetailView');
};

// Show verb detail view
KartApp.prototype.showVerbDetail = function(verbId) {
    const verb = dataService.getVerbById(verbId);
    if (!verb) return;

    const container = document.getElementById('grammarDetail');

    let conjugationHtml = '';
    if (verb.conjugation) {
        Object.entries(verb.conjugation).forEach(([tense, forms]) => {
            const tenseLabel = tense === 'present' ? 'Présent' : tense === 'aorist' ? 'Aoriste' : tense;
            conjugationHtml += `
                <div class="conjugation-section">
                    <h4>${tenseLabel}</h4>
                    <table class="conjugation-table">
                        ${Object.entries(forms).filter(([k]) => k !== 'note').map(([person, form]) => `
                            <tr><td>${person}</td><td class="geo">${form}</td></tr>
                        `).join('')}
                    </table>
                    ${forms.note ? `<p class="conjugation-note">${forms.note}</p>` : ''}
                </div>
            `;
        });
    }

    let familyHtml = '';
    if (verb.family && verb.family.withPreverbs) {
        familyHtml = `
            <div class="verb-family">
                <h4>Famille verbale</h4>
                <div class="verb-base">Base : <span class="geo">${verb.family.base}</span></div>
                <div class="preverb-list">
                    ${verb.family.withPreverbs.map(pv => `
                        <div class="preverb-item">
                            <span class="geo">${pv.form}</span>
                            <span class="preverb">${pv.preverb}</span>
                            <span class="meaning">${pv.meaning}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    let examplesHtml = '';
    if (verb.examples && verb.examples.length > 0) {
        examplesHtml = `
            <div class="verb-examples">
                <h4>Exemples</h4>
                ${verb.examples.map(ex => `
                    <div class="verb-example">
                        <span class="geo">${ex.geo}</span>
                        <span class="fr">${ex.fr}</span>
                        ${ex.gloss ? `<span class="gloss">${ex.gloss}</span>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    container.innerHTML = `
        <div class="verb-header">
            <span class="level-badge">${verb.level}</span>
            <h2>${verb.meaning}</h2>
            <div class="verb-info">
                <span class="verb-root">Racine : <span class="geo">${verb.root}</span></span>
                <span class="verb-class">${verb.class}</span>
                ${verb.doubleMarking ? '<span class="verb-tag">Double marquage</span>' : ''}
                ${verb.note ? `<p class="verb-note">${verb.note}</p>` : ''}
            </div>
        </div>
        ${familyHtml}
        ${conjugationHtml}
        ${examplesHtml}
    `;

    this.navigateTo('grammarDetailView');
};

// Show noun detail view with declensions
KartApp.prototype.showNounDetail = function(nounId) {
    const noun = dataService.getNounById(nounId);
    if (!noun) return;

    const container = document.getElementById('grammarDetail');

    const caseLabels = {
        nominative: 'Nominatif',
        ergative: 'Ergatif',
        dative: 'Datif',
        genitive: 'Génitif',
        instrumental: 'Instrumental',
        adverbial: 'Adverbial',
        vocative: 'Vocatif'
    };

    let declensionHtml = '';
    if (noun.declension) {
        declensionHtml = `
            <div class="declension-section">
                <h4>Déclinaison (7 cas)</h4>
                <table class="declension-table">
                    ${Object.entries(noun.declension).map(([caseName, form]) => `
                        <tr>
                            <td>${caseLabels[caseName] || caseName}</td>
                            <td class="geo">${form}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;
    }

    let postpositionsHtml = '';
    if (noun.withPostpositions && noun.withPostpositions.length > 0) {
        postpositionsHtml = `
            <div class="postpositions-section">
                <h4>Avec postpositions</h4>
                ${noun.withPostpositions.map(p => `
                    <div class="postposition-example">
                        <span class="geo">${p.form}</span>
                        <span class="post">${p.postposition}</span>
                        <span class="meaning">${p.meaning}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    let examplesHtml = '';
    if (noun.examples && noun.examples.length > 0) {
        examplesHtml = `
            <div class="noun-examples">
                <h4>Exemples</h4>
                ${noun.examples.map(ex => `
                    <div class="noun-example">
                        <span class="geo">${ex.geo}</span>
                        <span class="fr">${ex.fr}</span>
                        ${ex.case ? `<span class="case-tag">${ex.case}</span>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    container.innerHTML = `
        <div class="noun-header">
            <span class="level-badge">${noun.level}</span>
            <h2>${noun.meaning}</h2>
            <div class="noun-info">
                <span class="noun-nominative geo">${noun.nominative}</span>
                <span class="noun-gender">${noun.gender === 'animate' ? 'Animé' : 'Inanimé'}</span>
            </div>
        </div>
        ${declensionHtml}
        ${postpositionsHtml}
        ${examplesHtml}
    `;

    this.navigateTo('grammarDetailView');
};

// Open advanced unit (A2-B2) from course_plan.json
KartApp.prototype.openAdvancedUnit = function(unitId) {
    const unit = dataService.getUnitById(unitId);
    if (!unit) return;

    this.currentAdvancedUnit = unit;
    const container = document.getElementById('lessonContent');

    // Get associated rules
    const rules = dataService.getRulesForUnit(unitId);

    let lessonsHtml = '';
    if (unit.lessons && unit.lessons.length > 0) {
        lessonsHtml = `
            <div class="unit-lessons">
                <h4>Leçons</h4>
                ${unit.lessons.map((lesson, i) => `
                    <button class="lesson-card" onclick="app.showAdvancedLesson(${i})">
                        <h5>${lesson.title}</h5>
                        <p>${lesson.content.substring(0, 60)}...</p>
                    </button>
                `).join('')}
            </div>
        `;
    }

    let rulesHtml = '';
    if (rules.length > 0) {
        rulesHtml = `
            <div class="unit-rules">
                <h4>Règles de grammaire</h4>
                ${rules.map(r => `
                    <button class="rule-link" onclick="app.showAdvancedRuleDetail(dataService.getRuleById('${r.id}'))">
                        ${r.title}
                    </button>
                `).join('')}
            </div>
        `;
    }

    let exercisesHtml = '';
    if (unit.exercises && unit.exercises.length > 0) {
        exercisesHtml = `
            <div class="unit-exercises-preview">
                <h4>Exercices (${unit.exercises.length})</h4>
                <button class="btn btn-primary" onclick="app.startAdvancedExercises()">
                    Commencer les exercices
                </button>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="lesson-header">
            <span class="unit-level-badge">${unit.level}</span>
            <h2>${unit.title}</h2>
            <p>${unit.description}</p>
        </div>
        <div class="lesson-body">
            <div class="unit-focus">
                <h4>Points clés</h4>
                <ul>
                    ${unit.focus.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>
            ${rulesHtml}
            ${lessonsHtml}
            ${exercisesHtml}
        </div>
    `;

    this.navigateTo('lessonView');
};

// Show advanced lesson
KartApp.prototype.showAdvancedLesson = function(lessonIndex) {
    if (!this.currentAdvancedUnit || !this.currentAdvancedUnit.lessons) return;

    const lesson = this.currentAdvancedUnit.lessons[lessonIndex];
    if (!lesson) return;

    const container = document.getElementById('lessonContent');

    let examplesHtml = '';
    if (lesson.examples && lesson.examples.length > 0) {
        examplesHtml = `
            <div class="lesson-examples">
                <h4>Exemples</h4>
                ${lesson.examples.map(ex => `
                    <div class="lesson-example">
                        <span class="geo">${ex.geo}</span>
                        <span class="fr">${ex.fr}</span>
                        ${ex.gloss ? `<span class="gloss">${ex.gloss}</span>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    let tableHtml = '';
    if (lesson.table) {
        tableHtml = `
            <div class="lesson-table">
                <h4>${lesson.table.title || 'Tableau'}</h4>
                <table class="grammar-table">
                    <thead><tr>${lesson.table.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                    <tbody>
                        ${lesson.table.rows.map(row => `
                            <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="lesson-header">
            <h2>${lesson.title}</h2>
            <p>${this.currentAdvancedUnit.title} - ${this.currentAdvancedUnit.level}</p>
        </div>
        <div class="lesson-body">
            <div class="lesson-content-text">
                <p>${lesson.content}</p>
            </div>
            ${tableHtml}
            ${examplesHtml}
        </div>
        <div class="lesson-nav">
            <button class="btn btn-secondary" onclick="app.openAdvancedUnit('${this.currentAdvancedUnit.id}')">
                Retour à l'unité
            </button>
        </div>
    `;
};

// Start exercises for advanced unit
KartApp.prototype.startAdvancedExercises = function() {
    if (!this.currentAdvancedUnit || !this.currentAdvancedUnit.exercises) {
        this.showToast('Pas d\'exercices disponibles');
        return;
    }

    this.currentUnit = this.currentAdvancedUnit;
    this.currentExerciseIndex = 0;
    this.showExercise();
};

// Store original showExercise
const originalShowExercise = KartApp.prototype.showExercise;

// Override showExercise to handle advanced exercise types
KartApp.prototype.showExercise = function() {
    const exercises = this.currentUnit.exercises;
    if (this.currentExerciseIndex >= exercises.length) {
        this.completeUnit();
        return;
    }

    const exercise = exercises[this.currentExerciseIndex];
    this.exerciseAnswered = false;
    const container = document.getElementById('exerciseContainer');

    const progress = ((this.currentExerciseIndex) / exercises.length) * 100;

    let exerciseHtml = '';

    // Map advanced exercise types to their render method
    const choiceTypes = [
        'choice',
        'mcq_case',
        'identify_agent_patient',
        'contrast_case',
        'fill_postposition',
        'micro_conjugation',
        'mcq_tense',
        'morphology_parse',
        'slot_fill_roles',
        'fill_conjunction',
        'meaning_shift',
        'mcq_grammar',
        'family_recognition'
    ];

    if (choiceTypes.includes(exercise.type)) {
        exerciseHtml = this.renderChoiceExercise(exercise);
    } else if (exercise.type === 'reorder') {
        exerciseHtml = this.renderReorderExercise(exercise);
    } else {
        // Fallback: treat as choice if it has options
        if (exercise.options && exercise.options.length > 0) {
            exerciseHtml = this.renderChoiceExercise(exercise);
        } else {
            exerciseHtml = `<p style="color: var(--text-muted);">Type d'exercice non pris en charge : ${exercise.type}</p>`;
        }
    }

    // Build prompt section with optional meaning
    let promptHtml = '';
    if (exercise.prompt) {
        promptHtml = `
            <div class="exercise-prompt">${exercise.prompt}</div>
            ${exercise.promptTranslit ? `<p class="exercise-prompt-translit">${exercise.promptTranslit}</p>` : ''}
            ${exercise.meaning ? `<p class="exercise-prompt-meaning">${exercise.meaning}</p>` : ''}
        `;
    }

    container.innerHTML = `
        <div class="exercise-progress">
            <div class="exercise-progress-bar">
                <div class="exercise-progress-fill" style="width: ${progress}%"></div>
            </div>
            <span class="exercise-progress-text">${this.currentExerciseIndex + 1}/${exercises.length}</span>
        </div>
        <div class="exercise-question">
            <h3>${exercise.question}</h3>
            ${promptHtml}
        </div>
        ${exerciseHtml}
        <div class="feedback" id="exerciseFeedback"></div>
        <button class="btn btn-primary" id="nextExerciseBtn" style="display: none;" onclick="app.nextExercise()">
            Continuer
        </button>
    `;

    this.navigateTo('exerciseView');
};

// Add renderAdvancedGrammar as a no-op since we integrated it into renderGrammar
KartApp.prototype.renderAdvancedGrammar = function() {
    // Already integrated into renderGrammar()
};

// ========== Vocabulary Flashcards ==========

KartApp.prototype.startVocabFlashcards = function() {
    // Collect all vocabulary (both from GEO_DATA and lexicon)
    let allWords = [];

    // From GEO_DATA
    if (typeof GEO_DATA !== 'undefined' && GEO_DATA.vocabulary) {
        Object.keys(GEO_DATA.vocabulary).forEach(category => {
            GEO_DATA.vocabulary[category].forEach(word => {
                allWords.push({
                    geo: word.geo,
                    translit: word.translit || '',
                    meaning: word.meaning,
                    type: category,
                    source: 'basic'
                });
            });
        });
    }

    // From lexicon
    if (dataService.loaded && dataService.lexicon) {
        dataService.getVerbs().forEach(verb => {
            const baseForm = verb.conjugation?.present?.['3sg'] || verb.family?.base || verb.root;
            allWords.push({
                geo: baseForm,
                translit: '',
                meaning: verb.meaning,
                type: 'verbe',
                source: 'lexicon',
                verbId: verb.id
            });
        });

        dataService.getNouns().forEach(noun => {
            allWords.push({
                geo: noun.nominative,
                translit: '',
                meaning: noun.meaning,
                type: 'nom',
                source: 'lexicon',
                nounId: noun.id
            });
        });

        dataService.getAdjectives().forEach(adj => {
            allWords.push({
                geo: adj.base,
                translit: '',
                meaning: adj.meaning,
                type: 'adjectif',
                source: 'lexicon'
            });
        });
    }

    // Remove duplicates
    const seen = new Set();
    allWords = allWords.filter(word => {
        if (seen.has(word.geo)) return false;
        seen.add(word.geo);
        return true;
    });

    // Filter out already learned words (optional: only review new/to-review)
    const unlearnedWords = allWords.filter(w => !this.progress.learnedWords.includes(w.geo));

    // Use unlearned words if available, otherwise use all words
    this.flashcardWords = unlearnedWords.length > 0 ? unlearnedWords : allWords;

    // Shuffle
    this.flashcardWords = this.flashcardWords.sort(() => Math.random() - 0.5);

    // Limit to 20 words per session
    this.flashcardWords = this.flashcardWords.slice(0, 20);

    if (this.flashcardWords.length === 0) {
        this.showToast('Aucun mot à réviser');
        return;
    }

    this.flashcardIndex = 0;
    this.flashcardResults = [];
    this.showVocabFlashcard();
    this.navigateTo('flashcardView');
};

KartApp.prototype.showVocabFlashcard = function() {
    if (this.flashcardIndex >= this.flashcardWords.length) {
        this.showVocabFlashcardResults();
        return;
    }

    const word = this.flashcardWords[this.flashcardIndex];
    const card = document.getElementById('flashcardCard');

    // Reset flip state
    card.classList.remove('flipped');

    // Update content
    document.getElementById('flashcardGeo').textContent = word.geo;
    document.getElementById('flashcardTranslit').textContent = word.translit || '';
    document.getElementById('flashcardMeaning').textContent = word.meaning;
    document.getElementById('flashcardTheme').textContent = this.getTypeLabel(word.type) || 'Vocabulaire';

    // Update progress
    const progress = (this.flashcardIndex / this.flashcardWords.length) * 100;
    document.getElementById('flashcardProgressFill').style.width = `${progress}%`;
    document.getElementById('flashcardProgressText').textContent = `${this.flashcardIndex + 1}/${this.flashcardWords.length}`;

    // Afficher les intervalles SRS prévisionnels
    if (this.updateSRSIntervalLabels) {
        this.updateSRSIntervalLabels(word.geo);
    }

    // Add click to flip
    card.onclick = () => card.classList.toggle('flipped');
};

// Override flashcardResponse to work with vocab flashcards (SRS: quality 1-4)
const originalFlashcardResponse = KartApp.prototype.flashcardResponse;
KartApp.prototype.flashcardResponse = function(quality) {
    const word = this.flashcardWords[this.flashcardIndex];
    const correct = quality >= 2;

    this.flashcardResults.push({
        word: word,
        correct: correct,
        quality: quality
    });

    // Mettre à jour le SRS
    this.calculateSRS(word.geo, quality);

    // Si oublié, remettre le mot à la fin
    if (quality === 1) {
        this.flashcardWords.push(word);
    }

    this.saveProgress();

    // Next card
    this.flashcardIndex++;
    setTimeout(() => {
        if (this.flashcardIndex < this.flashcardWords.length) {
            this.showVocabFlashcard();
        } else {
            this.showVocabFlashcardResults();
        }
    }, 200);
};

KartApp.prototype.showVocabFlashcardResults = function() {
    const correct = this.flashcardResults.filter(r => r.correct).length;
    const wrong = this.flashcardResults.filter(r => !r.correct).length;

    document.getElementById('flashcardCorrect').textContent = correct;
    document.getElementById('flashcardWrong').textContent = wrong;
    document.getElementById('flashcardResultsDate').textContent = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    // Build results list
    const listHtml = this.flashcardResults.map(r => `
        <div class="results-word">
            <div class="results-word-status ${r.correct ? 'correct' : 'wrong'}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${r.correct
                        ? '<path d="M20 6L9 17l-5-5"/>'
                        : '<path d="M18 6L6 18M6 6l12 12"/>'}
                </svg>
            </div>
            <div class="results-word-info">
                <span class="results-word-geo">${r.word.geo}</span>
                <span class="results-word-meaning">${r.word.meaning}</span>
            </div>
        </div>
    `).join('');

    document.getElementById('flashcardResultsList').innerHTML = listHtml;

    // Show/hide retry button
    const retryBtn = document.querySelector('#flashcardResultsView .btn-primary');
    if (retryBtn) {
        retryBtn.style.display = wrong > 0 ? 'block' : 'none';
        retryBtn.onclick = () => this.retryVocabFlashcards();
    }

    this.navigateTo('flashcardResultsView');
    this.updateProgressDisplay();
};

KartApp.prototype.retryVocabFlashcards = function() {
    // Retry only the wrong ones
    this.flashcardWords = this.flashcardResults
        .filter(r => !r.correct)
        .map(r => r.word);

    if (this.flashcardWords.length === 0) {
        this.navigateTo('vocabularyView');
        return;
    }

    this.flashcardIndex = 0;
    this.flashcardResults = [];
    this.showVocabFlashcard();
    this.navigateTo('flashcardView');
};
