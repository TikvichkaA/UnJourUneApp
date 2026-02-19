// KartApp - Georgian Learning PWA Application

class KartApp {
    constructor() {
        this.currentView = 'homeView';
        this.viewHistory = [];
        this.showTranslit = true;
        this.autoAudio = false;
        this.currentUnit = null;
        this.currentLesson = null;
        this.currentExerciseIndex = 0;
        this.exerciseAnswered = false;

        // Onboarding state
        this.onboardingStep = 1;
        this.userProfile = this.loadUserProfile();
        this.placementTestIndex = 0;
        this.placementScore = 0;

        // User progress
        this.progress = this.loadProgress();

        this.init();
    }

    async init() {
        // Load dynamic data from JSON files
        await dataService.loadAll();
        this.bindEvents();
        this.renderAlphabet();
        this.renderUnits();
        this.renderVocabulary();
        this.renderGrammar();
        this.renderAdvancedGrammar();
        this.updateProgressDisplay();
        this.loadSettings();
        this.registerServiceWorker();
        this.migrateLegacyProgress();
        this.checkOnboarding();
        this.loadDailyArticle();
    }

    // ========== Onboarding ==========

    checkOnboarding() {
        if (!this.userProfile.onboardingCompleted) {
            document.getElementById('onboardingOverlay').classList.remove('hidden');
        } else {
            document.getElementById('onboardingOverlay').classList.add('hidden');
        }
    }

    loadUserProfile() {
        const saved = localStorage.getItem('kartapp_profile');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            onboardingCompleted: false,
            level: 'beginner',
            alphabetKnowledge: 'none',
            goals: [],
            placementScore: 0,
            unlockedUnits: [1]
        };
    }

    saveUserProfile() {
        localStorage.setItem('kartapp_profile', JSON.stringify(this.userProfile));
    }

    goToOnboardingStep(step) {
        this.onboardingStep = step;

        // Update steps visibility
        document.querySelectorAll('.onboarding-step').forEach(s => {
            s.classList.remove('active');
            if (parseInt(s.dataset.step) === step) {
                s.classList.add('active');
            }
        });

        // Update progress dots
        document.querySelectorAll('.progress-dot').forEach(dot => {
            const dotStep = parseInt(dot.dataset.step);
            dot.classList.remove('active', 'done');
            if (dotStep === step) {
                dot.classList.add('active');
            } else if (dotStep < step) {
                dot.classList.add('done');
            }
        });
    }

    onboardingNext() {
        this.goToOnboardingStep(this.onboardingStep + 1);
    }

    selectLevel(level) {
        this.userProfile.level = level;

        // Visual feedback
        document.querySelectorAll('[data-step="2"] .onboarding-option').forEach(opt => {
            opt.classList.remove('selected');
            if (opt.dataset.level === level) {
                opt.classList.add('selected');
            }
        });

        // Auto-advance after short delay
        setTimeout(() => this.onboardingNext(), 300);
    }

    selectAlphabetLevel(level) {
        this.userProfile.alphabetKnowledge = level;

        // Visual feedback
        document.querySelectorAll('[data-step="3"] .onboarding-option').forEach(opt => {
            opt.classList.remove('selected');
            if (opt.dataset.alphabet === level) {
                opt.classList.add('selected');
            }
        });

        // Auto-advance
        setTimeout(() => this.onboardingNext(), 300);
    }

    startPlacementTest() {
        this.placementTestIndex = 0;
        this.placementScore = 0;
        this.goToOnboardingStep(6);
        this.renderPlacementQuestion();
    }

    skipPlacementTest() {
        this.calculateLevel();
        this.goToOnboardingStep(7);
        this.renderResults();
    }

    renderPlacementQuestion() {
        const questions = this.getPlacementQuestions();
        if (this.placementTestIndex >= questions.length) {
            this.calculateLevel();
            this.goToOnboardingStep(7);
            this.renderResults();
            return;
        }

        const q = questions[this.placementTestIndex];
        const container = document.getElementById('placementTest');

        container.innerHTML = `
            <div class="placement-progress">
                ${questions.map((_, i) => `
                    <span class="placement-dot ${i < this.placementTestIndex ? 'done' : ''} ${i === this.placementTestIndex ? 'active' : ''}"></span>
                `).join('')}
            </div>
            <h3>${q.question}</h3>
            <div class="placement-question">
                ${q.prompt ? `<div class="placement-prompt">${q.prompt}</div>` : ''}
                <div class="placement-options">
                    ${q.options.map((opt, i) => `
                        <button class="placement-option" onclick="app.answerPlacement(${i}, ${opt.correct})">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    answerPlacement(index, isCorrect) {
        if (isCorrect) {
            this.placementScore++;
        }

        // Visual feedback
        document.querySelectorAll('.placement-option').forEach((opt, i) => {
            if (i === index) {
                opt.classList.add('selected');
            }
        });

        // Next question
        setTimeout(() => {
            this.placementTestIndex++;
            this.renderPlacementQuestion();
        }, 400);
    }

    getPlacementQuestions() {
        return [
            {
                question: 'Reconnaissez-vous cette lettre ?',
                prompt: 'ა',
                options: [
                    { text: 'a', correct: true },
                    { text: 'o', correct: false },
                    { text: 'e', correct: false },
                    { text: 'Je ne sais pas', correct: false }
                ]
            },
            {
                question: 'Que signifie ce mot ?',
                prompt: 'გამარჯობა',
                options: [
                    { text: 'Bonjour', correct: true },
                    { text: 'Merci', correct: false },
                    { text: 'Au revoir', correct: false },
                    { text: 'Je ne sais pas', correct: false }
                ]
            },
            {
                question: 'Comment dit-on "je suis" en géorgien ?',
                options: [
                    { text: 'ვარ (var)', correct: true },
                    { text: 'ხარ (khar)', correct: false },
                    { text: 'არის (aris)', correct: false },
                    { text: 'Je ne sais pas', correct: false }
                ]
            },
            {
                question: 'Quel est l\'ordre des mots en géorgien ?',
                options: [
                    { text: 'Sujet - Objet - Verbe (SOV)', correct: true },
                    { text: 'Sujet - Verbe - Objet (SVO)', correct: false },
                    { text: 'Verbe - Sujet - Objet (VSO)', correct: false },
                    { text: 'Je ne sais pas', correct: false }
                ]
            },
            {
                question: 'Que signifie "დედა" (deda) ?',
                prompt: 'დედა',
                options: [
                    { text: 'Mère', correct: true },
                    { text: 'Père', correct: false },
                    { text: 'Enfant', correct: false },
                    { text: 'Je ne sais pas', correct: false }
                ]
            }
        ];
    }

    calculateLevel() {
        // Combine self-assessment and test score
        let level = 'beginner';
        let unlockedUnits = [1];

        // Based on self-assessment
        if (this.userProfile.level === 'intermediate') {
            level = 'intermediate';
            unlockedUnits = [1, 2, 3, 4, 5];
        } else if (this.userProfile.level === 'elementary') {
            level = 'elementary';
            unlockedUnits = [1, 2, 3];
        }

        // Adjust based on placement test
        if (this.placementScore >= 4) {
            level = 'intermediate';
            unlockedUnits = [1, 2, 3, 4, 5];
        } else if (this.placementScore >= 2) {
            level = 'elementary';
            unlockedUnits = [1, 2, 3];
        }

        // Alphabet knowledge adjustments
        if (this.userProfile.alphabetKnowledge === 'full') {
            if (!unlockedUnits.includes(2)) unlockedUnits.push(2);
            // Mark alphabet letters as partially learned
            GEO_DATA.alphabet.forEach(l => {
                if (!this.progress.learnedLetters.includes(l.letter)) {
                    this.progress.learnedLetters.push(l.letter);
                }
            });
        } else if (this.userProfile.alphabetKnowledge === 'partial') {
            // Mark vowels as learned
            ['ა', 'ე', 'ი', 'ო', 'უ'].forEach(l => {
                if (!this.progress.learnedLetters.includes(l)) {
                    this.progress.learnedLetters.push(l);
                }
            });
        }

        this.userProfile.level = level;
        this.userProfile.unlockedUnits = unlockedUnits;
        this.userProfile.placementScore = this.placementScore;

        this.saveProgress();
    }

    renderResults() {
        // Collect goals
        const goalCheckboxes = document.querySelectorAll('.goal-option input:checked');
        this.userProfile.goals = Array.from(goalCheckboxes).map(cb => cb.value);

        const levelLabels = {
            beginner: { name: 'Débutant', code: 'A0' },
            elementary: { name: 'Élémentaire', code: 'A1' },
            intermediate: { name: 'Intermédiaire', code: 'A2' }
        };

        const levelInfo = levelLabels[this.userProfile.level] || levelLabels.beginner;

        document.querySelector('#resultLevel .level-badge').textContent = levelInfo.name;
        document.querySelector('#resultLevel p').textContent = `Niveau ${levelInfo.code}`;

        // Build summary
        const summaryItems = [];

        if (this.userProfile.alphabetKnowledge === 'full') {
            summaryItems.push('Alphabet Mkhedruli maîtrisé');
        } else if (this.userProfile.alphabetKnowledge === 'partial') {
            summaryItems.push('Quelques lettres connues');
        } else {
            summaryItems.push('Apprentissage de l\'alphabet dès le début');
        }

        summaryItems.push(`${this.userProfile.unlockedUnits.length} unités débloquées`);

        if (this.placementScore > 0) {
            summaryItems.push(`${this.placementScore}/5 au test de placement`);
        }

        const summaryHtml = `
            <h4>Votre parcours</h4>
            <ul>
                ${summaryItems.map(item => `
                    <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        ${item}
                    </li>
                `).join('')}
            </ul>
        `;

        document.getElementById('resultSummary').innerHTML = summaryHtml;
    }

    finishOnboarding() {
        this.userProfile.onboardingCompleted = true;
        this.saveUserProfile();
        this.saveProgress();

        // Hide onboarding
        document.getElementById('onboardingOverlay').classList.add('hidden');

        // Refresh UI
        this.renderAlphabet();
        this.renderUnits();
        this.updateProgressDisplay();

        this.showToast('Bienvenue dans KartApp !');
    }

    // ========== SRS Engine (Spaced Repetition System) ==========

    // Niveaux de maîtrise
    getMasteryInfo(level) {
        const levels = {
            0: { label: 'Nouveau', color: '#9E9E9E', key: 'new' },
            1: { label: 'Découvert', color: '#F44336', key: 'learning' },
            2: { label: 'Familier', color: '#FF9800', key: 'familiar' },
            3: { label: 'En progrès', color: '#FFC107', key: 'practiced' },
            4: { label: 'Appris', color: '#4CAF50', key: 'learned' },
            5: { label: 'Maîtrisé', color: '#FFD700', key: 'mastered' }
        };
        return levels[level] || levels[0];
    }

    // Obtenir les données SRS d'un mot (ou les créer)
    getWordSRS(wordGeo) {
        if (!this.progress.srsData) {
            this.progress.srsData = {};
        }
        if (!this.progress.srsData[wordGeo]) {
            this.progress.srsData[wordGeo] = {
                easeFactor: 2.5,
                interval: 0,
                consecutiveCorrect: 0,
                nextReviewDate: null,
                totalReviews: 0,
                totalCorrect: 0,
                lastReviewedDate: null
            };
        }
        return this.progress.srsData[wordGeo];
    }

    // Calculer le prochain intervalle SRS (basé sur SM-2)
    // quality: 1=oublié, 2=difficile, 3=bien, 4=facile
    calculateSRS(wordGeo, quality) {
        const card = this.getWordSRS(wordGeo);
        const today = new Date().toISOString().split('T')[0];

        card.totalReviews++;
        card.lastReviewedDate = today;

        if (quality === 1) {
            // OUBLIÉ : reset
            card.consecutiveCorrect = 0;
            card.interval = 0;
            card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);
            // Revoir dans 10 minutes (même session), puis demain
            card.nextReviewDate = today;
        } else if (quality === 2) {
            // DIFFICILE : petit progrès
            card.consecutiveCorrect++;
            card.totalCorrect++;
            card.easeFactor = Math.max(1.3, card.easeFactor - 0.15);
            if (card.consecutiveCorrect <= 1) {
                card.interval = 1;
            } else {
                card.interval = Math.max(1, Math.round(card.interval * 1.2));
            }
            card.nextReviewDate = this.addDays(today, card.interval);
        } else if (quality === 3) {
            // BIEN : progrès standard
            card.consecutiveCorrect++;
            card.totalCorrect++;
            if (card.consecutiveCorrect === 1) {
                card.interval = 1;
            } else if (card.consecutiveCorrect === 2) {
                card.interval = 3;
            } else {
                card.interval = Math.round(card.interval * card.easeFactor);
            }
            card.nextReviewDate = this.addDays(today, card.interval);
        } else if (quality === 4) {
            // FACILE : progrès rapide
            card.consecutiveCorrect++;
            card.totalCorrect++;
            card.easeFactor = Math.min(3.0, card.easeFactor + 0.15);
            if (card.consecutiveCorrect === 1) {
                card.interval = 3;
            } else if (card.consecutiveCorrect === 2) {
                card.interval = 7;
            } else {
                card.interval = Math.round(card.interval * card.easeFactor * 1.3);
            }
            card.nextReviewDate = this.addDays(today, card.interval);
        }

        // Intervalle minimum de 1 jour (sauf oublié = même jour)
        if (quality > 1) {
            card.interval = Math.max(1, card.interval);
        }

        this.progress.srsData[wordGeo] = card;

        // Mettre à jour learnedWords (rétro-compatibilité)
        if (quality >= 2 && !this.progress.learnedWords.includes(wordGeo)) {
            this.progress.learnedWords.push(wordGeo);
        }

        this.saveProgress();
        return card;
    }

    // Calculer le niveau de maîtrise d'un mot
    getMasteryLevel(wordGeo) {
        const card = this.getWordSRS(wordGeo);
        if (card.totalReviews === 0) return 0;             // Nouveau
        if (card.consecutiveCorrect < 3) return 1;          // Découvert
        if (card.consecutiveCorrect < 5) return 2;          // Familier
        if (card.consecutiveCorrect < 8 || card.interval < 14) return 3;  // En progrès
        if (card.consecutiveCorrect < 10 || card.interval < 30) return 4; // Appris
        return 5;                                            // Maîtrisé
    }

    // Obtenir les mots à réviser aujourd'hui
    getDueWords() {
        if (!this.progress.srsData) return [];
        const today = new Date().toISOString().split('T')[0];
        const dueWords = [];

        for (const [wordGeo, card] of Object.entries(this.progress.srsData)) {
            if (card.nextReviewDate && card.nextReviewDate <= today && card.totalReviews > 0) {
                dueWords.push({
                    geo: wordGeo,
                    ...card,
                    mastery: this.getMasteryLevel(wordGeo)
                });
            }
        }

        // Trier : les plus en retard d'abord, puis par niveau de maîtrise (plus faible d'abord)
        dueWords.sort((a, b) => {
            if (a.nextReviewDate !== b.nextReviewDate) {
                return a.nextReviewDate.localeCompare(b.nextReviewDate);
            }
            return a.mastery - b.mastery;
        });

        return dueWords;
    }

    // Ajouter des jours à une date ISO
    addDays(dateStr, days) {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    }

    // Migration : convertir les anciens learnedWords en données SRS
    migrateLegacyProgress() {
        if (!this.progress.srsData) {
            this.progress.srsData = {};
        }
        // Migrer les mots déjà appris qui n'ont pas de données SRS
        const today = new Date().toISOString().split('T')[0];
        let migrated = false;
        for (const wordGeo of (this.progress.learnedWords || [])) {
            if (!this.progress.srsData[wordGeo]) {
                this.progress.srsData[wordGeo] = {
                    easeFactor: 2.5,
                    interval: 3,
                    consecutiveCorrect: 2,
                    nextReviewDate: today,
                    totalReviews: 2,
                    totalCorrect: 2,
                    lastReviewedDate: today
                };
                migrated = true;
            }
        }
        if (migrated) this.saveProgress();
    }

    // Lancer une session de révision SRS
    startSRSReview() {
        const dueWords = this.getDueWords();
        if (dueWords.length === 0) {
            this.showToast('Aucun mot à réviser pour le moment !');
            return;
        }

        // Trouver les infos complètes des mots à réviser
        const dictionary = this.getVocabularyDictionary();
        const articleWords = this.progress.articleLearnedWords || [];

        this.flashcardWords = dueWords.slice(0, 20).map(dueWord => {
            // Chercher dans le dictionnaire
            if (dictionary[dueWord.geo]) {
                const info = dictionary[dueWord.geo];
                return { geo: dueWord.geo, meaning: info.meaning, translit: info.translit, level: info.level, theme: 'review' };
            }
            // Chercher dans les mots d'articles
            const artWord = articleWords.find(w => w.geo === dueWord.geo);
            if (artWord) {
                return { geo: artWord.geo, meaning: artWord.meaning, translit: artWord.translit, level: artWord.level, theme: 'review' };
            }
            // Chercher dans GEO_DATA.vocabulary
            for (const category of Object.values(GEO_DATA.vocabulary)) {
                const found = category.find(w => w.geo === dueWord.geo);
                if (found) return { ...found, theme: 'review' };
            }
            return { geo: dueWord.geo, meaning: '?', translit: '', level: 1, theme: 'review' };
        });

        this.flashcardIndex = 0;
        this.flashcardResults = [];
        this.flashcardMode = 'srs';
        this.showFlashcard();
        this.navigateTo('flashcardView');
    }

    // ========== Daily Words & Flashcards ==========

    async loadDailyArticle() {
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = 'kartapp_daily_article';
        const learnedWords = this.progress.learnedWords || [];

        // Vérifier le cache du jour
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const cachedData = JSON.parse(cached);
                if (cachedData.date === today) {
                    // Re-filtrer les mots déjà appris (a pu changer depuis le cache)
                    if (cachedData.originalWords) {
                        cachedData.words = cachedData.originalWords.filter(w => !learnedWords.includes(w.geo));
                    }
                    this.dailyArticle = cachedData;
                    this.renderDailyArticle();
                    return;
                }
            } catch (e) { /* cache invalide, on continue */ }
        }

        const apiUrl = this.getApiUrl();
        const userLevel = this.getUserLevelNumber();
        const excludeParam = learnedWords.length > 0 ? `&exclude=${encodeURIComponent(learnedWords.join(','))}` : '';

        try {
            const response = await fetch(`${apiUrl}/api/daily-article?level=${userLevel}${excludeParam}`);
            if (response.ok) {
                this.dailyArticle = await response.json();
            } else {
                this.dailyArticle = this.generateLocalArticle();
            }
        } catch (error) {
            console.log('Using local article (offline mode)');
            this.dailyArticle = this.generateLocalArticle();
        }

        // Sauvegarder les mots originaux pour pouvoir re-filtrer plus tard
        if (this.dailyArticle && this.dailyArticle.words) {
            this.dailyArticle.originalWords = [...this.dailyArticle.words];
            // Filtrer les mots déjà connus
            this.dailyArticle.words = this.dailyArticle.words.filter(w => !learnedWords.includes(w.geo));
        }

        // Mettre en cache avec la date
        this.dailyArticle.date = today;
        localStorage.setItem(cacheKey, JSON.stringify(this.dailyArticle));

        this.renderDailyArticle();
    }

    getApiUrl() {
        return 'http://localhost:3000';
    }

    getUserLevelNumber() {
        const levels = { beginner: 1, elementary: 2, intermediate: 3 };
        return levels[this.userProfile.level] || 1;
    }

    getArticlePool() {
        return [
            { title: 'საქართველოში ტურიზმი იზრდება', description: 'თბილისი - საქართველოში ტურიზმი სწრაფად ვითარდება. ქვეყანა პოპულარული ხდება ტურისტებში. მთავრობა ახალ პროგრამებს ამზადებს. სასტუმრო და რესტორანი იხსნება ყოველდღე.' },
            { title: 'თბილისში ახალი მუზეუმი გაიხსნა', description: 'დღეს თბილისში ახალი მუზეუმი გაიხსნა. ქალაქი ცენტრში მდებარე მუზეუმი ქართულ კულტურა და ხელოვნება წარმოადგენს. ბევრი ადამიანი მოვიდა.' },
            { title: 'სპორტი საქართველოში', description: 'ფეხბურთი საქართველოში პოპულარულია. გუნდი კარგი თამაში აჩვენა და გამარჯვება მოიპოვა. ხალხი სტადიონზე ბედნიერია.' },
            { title: 'კარგი ამინდი მოდის', description: 'ამინდი საქართველოში კარგი იქნება ამ კვირა. მზე ანათებს. ზღვა და მთა ბევრ ადამიანი იზიდავს. ტყე ლამაზია.' },
            { title: 'ეკონომიკა იზრდება', description: 'საქართველოში ეკონომიკა კარგი ტემპით ვითარდება. ბიზნესი და ბანკი ახალ პროგრამებს ქმნის. ფული ქვეყანა ეკონომიკაში ბრუნდება.' },
            { title: 'სტუდენტი თბილისში', description: 'უნივერსიტეტი თბილისში ახალ წელი იწყებს. სტუდენტი სკოლა და უნივერსიტეტი ბრუნდება. მუშაობა და სწავლა ერთად მიდის.' },
            { title: 'მუსიკა და კულტურა', description: 'დღეს თბილისში დიდი მუსიკა ფესტივალი გაიმართა. ხალხი ახალი ფილმი ნახა და წიგნი იყიდა. კულტურა საქართველოში საინტერესო და მნიშვნელოვანი.' },
            { title: 'ახალი სახლი სოფელში', description: 'სოფელი საქართველოში ლამაზია. ადამიანი ახალ სახლი აშენებს. ძველი სახლი რეკონსტრუქციას გადის. პატარა სოფელი დიდი ისტორიით.' },
            { title: 'მშვიდობა და თანამშრომლობა', description: 'საქართველო მშვიდობა სურს მეზობლებთან. თურქეთი და სომხეთი მნიშვნელოვანი პარტნიორებია. ევროპა თან თანამშრომლობა იზრდება. შეხვედრა გაიმართა.' },
            { title: 'პარლამენტი ახალ კანონი იღებს', description: 'პარლამენტი დღეს ახალ კანონი მიიღო. მინისტრი ინფორმაცია გააცნო ხალხი. პრეზიდენტი გადაწყვეტილება მიიღო.' },
            { title: 'ტრანსპორტი საქართველოში', description: 'მანქანა, ავტობუსი და მატარებელი - ტრანსპორტი საქართველოში ვითარდება. აეროპორტი თბილისში ახალ ტერმინალს იღებს. ქალაქი უკეთესი ხდება.' },
            { title: 'წვიმა და თოვლი მოდის', description: 'ამინდი იცვლება. წვიმა მოდის ქალაქში და თოვლი მთა ფარავს. მზე ხვალ გამოვა. კვირა ბოლოს კარგი ამინდი იქნება.' },
            { title: 'ფეხბურთი: დიდი თამაში', description: 'ფეხბურთი გუნდი დიდი თამაში ითამაშა. გამარჯვება მოიპოვეს. სპორტი საქართველოში პოპულარულია. ხალხი ბედნიერია.' },
            { title: 'ბაზრობა თბილისში', description: 'დღეს მაღაზია და ბაზარი სავსეა. ხალხი ფული ხარჯავს. ახალი პროდუქტები გამოჩნდა. ფასი კარგი.' },
            { title: 'მდინარე მტკვარი', description: 'მდინარე მტკვარი თბილისში გადის. ქალაქი ლამაზია მდინარე პირას. ძველი და ახალი ხიდები აკავშირებს. ტყე და ბუნება ახლოსაა.' },
            { title: 'კონფერენცია თბილისში', description: 'კონფერენცია თბილისში გაიმართა. ევროპა და საქართველო თანამშრომლობაზე ისაუბრეს. ინფორმაცია გაცვალეს. შეხვედრა საინტერესო იყო.' },
            { title: 'ექიმი და ჯანმრთელობა', description: 'ახალი საავადმყოფო გაიხსნა. ექიმი კარგი მუშაობა ასრულებს. ადამიანი ჯანმრთელობას უფრთხილდება. პრობლემა მცირდება.' },
            { title: 'პოლიცია და უსაფრთხოება', description: 'პოლიცია ქალაქში კარგად მუშაობს. ახალი მანქანა მიიღეს. უსაფრთხოება მნიშვნელოვანი. ადამიანი თავს დაცულად გრძნობს.' },
            { title: 'ზღვა და დასვენება', description: 'ზღვა ბათუმში ლამაზია. სასტუმრო სავსეა ტურისტებით. რესტორანი გემრიელ საჭმელს გთავაზობს. მზე ანათებს და ამინდი კარგი.' },
            { title: 'მთა ყაზბეგი', description: 'მთა ყაზბეგი საქართველოში ერთ-ერთი ყველაზე ლამაზია. ტურიზმი აქ ძალიან პოპულარულია. თოვლი მწვერვალზე ყოველთვის არის. ადამიანი ბევრი მოდის.' },
            { title: 'ახალი ფილმი', description: 'ახალი ქართული ფილმი გამოვიდა. კულტურა და ხელოვნება ვითარდება. მუსიკა ფილმში კარგი. ხალხი კინოთეატრში მიდის.' },
            { title: 'წიგნი ფესტივალი', description: 'წიგნი ფესტივალი თბილისში გაიმართა. ახალი წიგნი გამოვიდა. სტუდენტი და ადამიანი ბევრი მოვიდა. კულტურა და განათლება მნიშვნელოვანი.' },
            { title: 'ბიზნესი საქართველოში', description: 'ახალი ბიზნესი იხსნება ყოველდღე. ბანკი ახალ პროგრამას სთავაზობს. ეკონომიკა იზრდება. ფული ქვეყანაში ბრუნდება.' },
            { title: 'არჩევნები მოახლოვდა', description: 'არჩევნები ქვეყანაში მოახლოვდა. პარლამენტი მზად არის. ხალხი გადაწყვეტილება მიიღებს. ინფორმაცია ყველასთვის ხელმისაწვდომია.' },
            { title: 'სკოლა ახალ წელს იწყებს', description: 'სკოლა ახალ სასწავლო წელი იწყებს. პატარა ბავშვები სკოლაში მიდიან. სახლი დან სკოლა მანქანა ან ავტობუსი მიდიან.' },
            { title: 'საქართველო და ევროპა', description: 'საქართველო ევროპა ინტეგრაციას აგრძელებს. მთავრობა ახალ გადაწყვეტილება მიიღო. კონფერენცია გაიმართა. მნიშვნელოვანი თვე დადგა.' },
            { title: 'გუშინ და ხვალ', description: 'გუშინ ცუდი ამინდი იყო. დღეს კარგი. ხვალ მზე იქნება. კვირა საინტერესო იქნება ყველასთვის.' },
            { title: 'დიდი შეხვედრა', description: 'დიდი შეხვედრა გაიმართა თბილისში. მინისტრი და პრეზიდენტი ისაუბრეს. პრობლემა განიხილეს. გადაწყვეტილება მიიღეს.' },
            { title: 'ტყე და ბუნება', description: 'ტყე საქართველოში ლამაზია. მდინარე ტყეში მიედინება. მთა და ტყე ადამიანი იზიდავს. ბუნება მნიშვნელოვანი ქვეყანა.' },
            { title: 'მატარებელი თბილისი-ბათუმი', description: 'ახალი მატარებელი თბილისი-ბათუმი დაინიშნა. ავტობუსი და მანქანა ალტერნატივაა. აეროპორტი თან კავშირი კარგი. ზღვა სწრაფად მისვლა შეიძლება.' },
            { title: 'ძველი თბილისი', description: 'ძველი თბილისი ძალიან ლამაზია. ქალაქი ისტორიით სავსეა. მუზეუმი და რესტორანი ყველგან არის. ტურიზმი აქ აყვავდა.' }
        ];
    }

    getDayOfYear(date = new Date()) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    generateLocalArticle() {
        const today = new Date().toISOString().split('T')[0];
        const articles = this.getArticlePool();
        const dayOfYear = this.getDayOfYear();
        const articleIndex = dayOfYear % articles.length;
        const article = articles[articleIndex];

        // Filtrer les mots déjà appris
        const learnedWords = this.progress.learnedWords || [];
        const allWords = this.findVocabularyInText(article.title + ' ' + article.description, learnedWords);

        // Si tous les mots de cet article sont déjà connus, chercher un article avec des mots nouveaux
        if (allWords.length === 0) {
            for (let offset = 1; offset < articles.length; offset++) {
                const altIndex = (articleIndex + offset) % articles.length;
                const altArticle = articles[altIndex];
                const altWords = this.findVocabularyInText(altArticle.title + ' ' + altArticle.description, learnedWords);
                if (altWords.length > 0) {
                    return {
                        success: true,
                        source: 'Article du jour',
                        fallback: true,
                        article: { title: altArticle.title, description: altArticle.description, link: null, date: today },
                        words: altWords.slice(0, 5),
                        totalWordsFound: altWords.length
                    };
                }
            }
        }

        return {
            success: true,
            source: 'Article du jour',
            fallback: true,
            article: { title: article.title, description: article.description, link: null, date: today },
            words: allWords.slice(0, 5),
            totalWordsFound: allWords.length
        };
    }

    // Dictionnaire global de vocabulaire pour la détection dans les articles
    getVocabularyDictionary() {
        return {
            'საქართველო': { meaning: 'Géorgie', translit: 'sakartvelo', level: 1 },
            'თბილისი': { meaning: 'Tbilissi', translit: 'tbilisi', level: 1 },
            'მთავრობა': { meaning: 'gouvernement', translit: 'mtavroba', level: 2 },
            'პრეზიდენტი': { meaning: 'président', translit: 'prezidenti', level: 2 },
            'პარლამენტი': { meaning: 'parlement', translit: 'parlamenti', level: 2 },
            'მინისტრი': { meaning: 'ministre', translit: 'ministri', level: 2 },
            'კანონი': { meaning: 'loi', translit: 'kanoni', level: 3 },
            'არჩევნები': { meaning: 'élections', translit: 'archevnebi', level: 3 },
            'ტურიზმი': { meaning: 'tourisme', translit: 'turizmi', level: 2 },
            'ქვეყანა': { meaning: 'pays', translit: 'kveqana', level: 2 },
            'ქალაქი': { meaning: 'ville', translit: 'kalaki', level: 2 },
            'სოფელი': { meaning: 'village', translit: 'sopeli', level: 2 },
            'მუზეუმი': { meaning: 'musée', translit: 'muzeumi', level: 2 },
            'კულტურა': { meaning: 'culture', translit: 'kultura', level: 2 },
            'ადამიანი': { meaning: 'personne', translit: 'adamiani', level: 2 },
            'სასტუმრო': { meaning: 'hôtel', translit: 'sastumro', level: 2 },
            'რესტორანი': { meaning: 'restaurant', translit: 'restorani', level: 1 },
            'დღეს': { meaning: "aujourd'hui", translit: 'dghes', level: 1 },
            'ხვალ': { meaning: 'demain', translit: 'khval', level: 1 },
            'გუშინ': { meaning: 'hier', translit: 'gushin', level: 1 },
            'წელი': { meaning: 'année', translit: 'tseli', level: 2 },
            'თვე': { meaning: 'mois', translit: 'tve', level: 2 },
            'კვირა': { meaning: 'semaine', translit: 'kvira', level: 2 },
            'ახალი': { meaning: 'nouveau', translit: 'akhali', level: 1 },
            'ძველი': { meaning: 'ancien', translit: 'dzveli', level: 2 },
            'კარგი': { meaning: 'bon', translit: 'kargi', level: 1 },
            'ცუდი': { meaning: 'mauvais', translit: 'tsudi', level: 1 },
            'დიდი': { meaning: 'grand', translit: 'didi', level: 1 },
            'პატარა': { meaning: 'petit', translit: 'patara', level: 1 },
            'მნიშვნელოვანი': { meaning: 'important', translit: 'mnishvnelovani', level: 3 },
            'საინტერესო': { meaning: 'intéressant', translit: 'saintereso', level: 2 },
            'სახლი': { meaning: 'maison', translit: 'sakhli', level: 1 },
            'სკოლა': { meaning: 'école', translit: 'skola', level: 1 },
            'უნივერსიტეტი': { meaning: 'université', translit: 'universiteti', level: 2 },
            'სტუდენტი': { meaning: 'étudiant', translit: 'studenti', level: 2 },
            'ექიმი': { meaning: 'médecin', translit: 'ekimi', level: 2 },
            'მუშაობა': { meaning: 'travail', translit: 'mushaoba', level: 2 },
            'ეკონომიკა': { meaning: 'économie', translit: 'ekonomika', level: 3 },
            'ბიზნესი': { meaning: 'business', translit: 'biznesi', level: 2 },
            'ფული': { meaning: 'argent', translit: 'puli', level: 1 },
            'ბანკი': { meaning: 'banque', translit: 'banki', level: 2 },
            'მაღაზია': { meaning: 'magasin', translit: 'maghazia', level: 1 },
            'აეროპორტი': { meaning: 'aéroport', translit: 'aeroporti', level: 2 },
            'მანქანა': { meaning: 'voiture', translit: 'mankana', level: 1 },
            'ავტობუსი': { meaning: 'bus', translit: 'avtobusi', level: 1 },
            'მატარებელი': { meaning: 'train', translit: 'matarebeli', level: 2 },
            'ზღვა': { meaning: 'mer', translit: 'zghva', level: 1 },
            'მთა': { meaning: 'montagne', translit: 'mta', level: 1 },
            'მდინარე': { meaning: 'rivière', translit: 'mdinare', level: 2 },
            'ტყე': { meaning: 'forêt', translit: 'tqe', level: 2 },
            'ამინდი': { meaning: 'météo', translit: 'amindi', level: 2 },
            'მზე': { meaning: 'soleil', translit: 'mze', level: 1 },
            'წვიმა': { meaning: 'pluie', translit: 'tsvima', level: 2 },
            'თოვლი': { meaning: 'neige', translit: 'tovli', level: 2 },
            'ხელოვნება': { meaning: 'art', translit: 'khelovneba', level: 3 },
            'მუსიკა': { meaning: 'musique', translit: 'musika', level: 1 },
            'ფილმი': { meaning: 'film', translit: 'pilmi', level: 1 },
            'წიგნი': { meaning: 'livre', translit: 'tsigni', level: 1 },
            'სპორტი': { meaning: 'sport', translit: 'sporti', level: 1 },
            'ფეხბურთი': { meaning: 'football', translit: 'pekhburti', level: 1 },
            'გუნდი': { meaning: 'équipe', translit: 'gundi', level: 2 },
            'თამაში': { meaning: 'jeu/match', translit: 'tamashi', level: 2 },
            'გამარჯვება': { meaning: 'victoire', translit: 'gamarjveba', level: 2 },
            'ხალხი': { meaning: 'peuple', translit: 'khalkhi', level: 2 },
            'მშვიდობა': { meaning: 'paix', translit: 'mshvidoba', level: 2 },
            'შეხვედრა': { meaning: 'rencontre', translit: 'shekhvedra', level: 2 },
            'ინფორმაცია': { meaning: 'information', translit: 'inpormatsia', level: 2 },
            'პრობლემა': { meaning: 'problème', translit: 'problema', level: 2 },
            'ევროპა': { meaning: 'Europe', translit: 'evropa', level: 2 },
            'თურქეთი': { meaning: 'Turquie', translit: 'turketi', level: 2 },
            'სომხეთი': { meaning: 'Arménie', translit: 'somkheti', level: 2 },
            'პოლიცია': { meaning: 'police', translit: 'politsia', level: 2 },
            'კონფერენცია': { meaning: 'conférence', translit: 'konperentsia', level: 3 },
            'გადაწყვეტილება': { meaning: 'décision', translit: 'gadatsqvetileba', level: 3 }
        };
    }

    findVocabularyInText(text, excludeWords = []) {
        const dictionary = this.getVocabularyDictionary();
        const foundWords = [];
        const userLevel = this.getUserLevelNumber();

        for (const [word, info] of Object.entries(dictionary)) {
            if (info.level <= userLevel + 1 && text.includes(word) && !excludeWords.includes(word)) {
                foundWords.push({
                    geo: word,
                    meaning: info.meaning,
                    translit: info.translit,
                    level: info.level
                });
            }
        }

        return foundWords.sort((a, b) => a.level - b.level);
    }

    renderDailyArticle() {
        if (!this.dailyArticle) return;

        const contentEl = document.getElementById('articleContent');
        const vocabListEl = document.getElementById('articleVocabList');
        const sourceEl = document.getElementById('articleSource');
        const learnBtn = document.getElementById('articleLearnBtn');

        const article = this.dailyArticle.article;
        const words = this.dailyArticle.words || [];

        sourceEl.textContent = this.dailyArticle.source || '';

        let highlightedTitle = article.title;
        let highlightedDesc = article.description;

        words.forEach(word => {
            const regex = new RegExp(`(${word.geo})`, 'g');
            highlightedTitle = highlightedTitle.replace(regex, '<span class="vocab-highlight" data-word="$1">$1</span>');
            highlightedDesc = highlightedDesc.replace(regex, '<span class="vocab-highlight" data-word="$1">$1</span>');
        });

        contentEl.innerHTML = `
            <h3 class="article-title">${highlightedTitle}</h3>
            <p class="article-text">${highlightedDesc}</p>
            ${article.link ? `
                <a href="${article.link}" target="_blank" class="article-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Lire l'article complet
                </a>
            ` : ''}
        `;

        if (words.length > 0) {
            vocabListEl.innerHTML = words.map(word => `
                <div class="vocab-item">
                    <span class="vocab-item-word">${word.geo}</span>
                    <div class="vocab-item-info">
                        <div class="vocab-item-translit">${word.translit}</div>
                        <div class="vocab-item-meaning">${word.meaning}</div>
                    </div>
                    <span class="vocab-item-level">Niv. ${word.level}</span>
                </div>
            `).join('');

            learnBtn.style.display = 'flex';
            document.getElementById('articleVocabulary').style.display = 'block';
        } else {
            vocabListEl.innerHTML = '<p style="color: var(--text-muted);">Tous les mots de cet article sont déjà appris !</p>';
            learnBtn.style.display = 'none';
            document.getElementById('articleVocabulary').style.display = 'block';
        }

        contentEl.querySelectorAll('.vocab-highlight').forEach(el => {
            el.addEventListener('click', () => {
                const word = words.find(w => w.geo === el.dataset.word);
                if (word) {
                    this.showWordTooltip(el, word);
                }
            });
        });

        this.dailyWords = { words };
    }

    showWordTooltip(element, word) {
        document.querySelectorAll('.word-tooltip').forEach(t => t.remove());

        const tooltip = document.createElement('div');
        tooltip.className = 'word-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-word">${word.geo}</div>
            <div class="tooltip-translit">${word.translit}</div>
            <div class="tooltip-meaning">${word.meaning}</div>
        `;

        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 8) + 'px';

        document.body.appendChild(tooltip);

        setTimeout(() => {
            document.addEventListener('click', function handler(e) {
                if (!tooltip.contains(e.target)) {
                    tooltip.remove();
                    document.removeEventListener('click', handler);
                }
            });
        }, 100);
    }

    startArticleFlashcards() {
        if (!this.dailyWords || !this.dailyWords.words || this.dailyWords.words.length === 0) {
            this.showToast('Aucun mot disponible');
            return;
        }

        // Filter out already learned words for today
        const today = new Date().toISOString().split('T')[0];
        const todayLearned = this.progress.dailyWordsCompleted?.[today] || [];
        this.flashcardWords = this.dailyWords.words.filter(w => !todayLearned.includes(w.geo));

        if (this.flashcardWords.length === 0) {
            this.showToast('Tous les mots du jour sont déjà appris !');
            return;
        }

        this.flashcardIndex = 0;
        this.flashcardResults = [];
        this.showFlashcard();
        this.navigateTo('flashcardView');
    }

    showFlashcard() {
        if (this.flashcardIndex >= this.flashcardWords.length) {
            this.showFlashcardResults();
            return;
        }

        const word = this.flashcardWords[this.flashcardIndex];
        const card = document.getElementById('flashcardCard');

        // Reset flip state
        card.classList.remove('flipped');

        // Update content
        document.getElementById('flashcardGeo').textContent = word.geo;
        document.getElementById('flashcardTranslit').textContent = word.translit;
        document.getElementById('flashcardMeaning').textContent = word.meaning;
        document.getElementById('flashcardTheme').textContent = this.getThemeLabel(word.theme);

        // Update progress
        const total = this.flashcardWords.length;
        const progress = ((this.flashcardIndex) / total) * 100;
        document.getElementById('flashcardProgressFill').style.width = `${progress}%`;
        document.getElementById('flashcardProgressText').textContent = `${this.flashcardIndex + 1}/${total}`;

        // Afficher les intervalles SRS prévisionnels sur les boutons
        this.updateSRSIntervalLabels(word.geo);

        // Add click to flip
        card.onclick = () => card.classList.toggle('flipped');
    }

    // Prévisualiser les intervalles SRS pour chaque bouton
    updateSRSIntervalLabels(wordGeo) {
        const card = this.getWordSRS(wordGeo);
        const formatInterval = (days) => {
            if (days <= 0) return '<1j';
            if (days === 1) return '1j';
            if (days < 7) return `${days}j`;
            if (days < 30) return `${Math.round(days / 7)}sem`;
            return `${Math.round(days / 30)}mois`;
        };

        // Simuler les intervalles pour chaque qualité
        const simHard = card.consecutiveCorrect <= 0 ? 1 : Math.max(1, Math.round(card.interval * 1.2));
        const simGood = card.consecutiveCorrect === 0 ? 1 : card.consecutiveCorrect === 1 ? 3 : Math.round(card.interval * card.easeFactor);
        const simEasy = card.consecutiveCorrect === 0 ? 3 : card.consecutiveCorrect === 1 ? 7 : Math.round(card.interval * card.easeFactor * 1.3);

        const hardEl = document.getElementById('srsHardInterval');
        const goodEl = document.getElementById('srsGoodInterval');
        const easyEl = document.getElementById('srsEasyInterval');
        if (hardEl) hardEl.textContent = formatInterval(simHard);
        if (goodEl) goodEl.textContent = formatInterval(simGood);
        if (easyEl) easyEl.textContent = formatInterval(simEasy);
    }

    getThemeLabel(theme) {
        const labels = {
            greetings: 'Salutations',
            pronouns: 'Pronoms',
            family: 'Famille',
            numbers: 'Nombres',
            common: 'Mots courants',
            verbs: 'Verbes',
            news: 'Actualités',
            culture: 'Culture',
            travel: 'Voyage',
            daily: 'Quotidien',
            nature: 'Nature',
            tech: 'Technologie',
            sport: 'Sport',
            expressions: 'Expressions',
            mixed: 'Mixte'
        };
        return labels[theme] || theme || 'Vocabulaire';
    }

    playFlashcardAudio() {
        const word = this.flashcardWords[this.flashcardIndex];
        if (word) {
            this.playWord(word.geo);
        }
    }

    // quality: 1=oublié, 2=difficile, 3=bien, 4=facile
    flashcardResponse(quality) {
        const word = this.flashcardWords[this.flashcardIndex];
        const correct = quality >= 2;

        this.flashcardResults.push({
            word: word,
            correct: correct,
            quality: quality
        });

        // Mettre à jour le SRS
        this.calculateSRS(word.geo, quality);

        if (correct) {
            // Mark as learned for today
            const today = new Date().toISOString().split('T')[0];
            if (!this.progress.dailyWordsCompleted) {
                this.progress.dailyWordsCompleted = {};
            }
            if (!this.progress.dailyWordsCompleted[today]) {
                this.progress.dailyWordsCompleted[today] = [];
            }
            if (!this.progress.dailyWordsCompleted[today].includes(word.geo)) {
                this.progress.dailyWordsCompleted[today].push(word.geo);
            }

            // Sauvegarder le mot complet dans la base d'articles appris
            if (!this.progress.articleLearnedWords) {
                this.progress.articleLearnedWords = [];
            }
            const alreadySaved = this.progress.articleLearnedWords.some(w => w.geo === word.geo);
            if (!alreadySaved) {
                this.progress.articleLearnedWords.push({
                    geo: word.geo,
                    meaning: word.meaning,
                    translit: word.translit,
                    level: word.level || 1,
                    learnedDate: today,
                    source: 'article'
                });
            }

            this.saveProgress();
        }

        // Si oublié, remettre le mot à la fin du paquet
        if (quality === 1) {
            this.flashcardWords.push(word);
        }

        // Next card
        this.flashcardIndex++;
        setTimeout(() => this.showFlashcard(), 200);
    }

    showFlashcardResults() {
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
        if (wrong > 0) {
            retryBtn.style.display = 'block';
        } else {
            retryBtn.style.display = 'none';
        }

        this.navigateTo('flashcardResultsView');
        this.updateProgressDisplay();

        // Rafraîchir l'article pour mettre à jour les mots restants
        if (this.dailyArticle && this.dailyArticle.originalWords) {
            const learnedWords = this.progress.learnedWords || [];
            this.dailyArticle.words = this.dailyArticle.originalWords.filter(w => !learnedWords.includes(w.geo));
            // Mettre à jour le cache
            localStorage.setItem('kartapp_daily_article', JSON.stringify(this.dailyArticle));
            this.renderDailyArticle();
        }
    }

    retryFlashcards() {
        // Retry only the wrong ones
        this.flashcardWords = this.flashcardResults
            .filter(r => !r.correct)
            .map(r => r.word);

        if (this.flashcardWords.length === 0) {
            this.navigateTo('homeView');
            return;
        }

        this.flashcardIndex = 0;
        this.flashcardResults = [];
        this.showFlashcard();
        this.navigateTo('flashcardView');
    }

    // ========== Navigation ==========

    bindEvents() {
        // Back button
        document.getElementById('backBtn').addEventListener('click', () => this.goBack());

        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => this.navigateTo('settingsView'));

        // Main navigation cards
        document.querySelectorAll('.nav-card').forEach(card => {
            card.addEventListener('click', () => {
                const section = card.dataset.section;
                this.navigateTo(`${section}View`);
            });
        });

        // Review options
        document.querySelectorAll('.review-card').forEach(card => {
            card.addEventListener('click', () => this.startReview(card.dataset.type));
        });

        // Vocabulary filter
        document.getElementById('vocabFilter').addEventListener('change', (e) => {
            this.renderVocabulary(e.target.value);
        });

        // Transliteration toggle in vocabulary
        document.getElementById('toggleTranslit').addEventListener('click', () => {
            this.toggleTransliteration();
        });

        // Settings toggles
        document.getElementById('settingTranslit').addEventListener('change', (e) => {
            this.showTranslit = e.target.checked;
            this.saveSettings();
            this.applyTransliteration();
        });

        document.getElementById('settingAutoAudio').addEventListener('change', (e) => {
            this.autoAudio = e.target.checked;
            this.saveSettings();
        });

        // Reset progress
        document.getElementById('resetProgress').addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir réinitialiser toute votre progression ?')) {
                this.resetProgress();
            }
        });
    }

    navigateTo(viewId) {
        // Save current view to history
        if (this.currentView !== viewId) {
            this.viewHistory.push(this.currentView);
        }

        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

        // Show target view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewId;
        }

        // Update back button visibility
        const backBtn = document.getElementById('backBtn');
        if (viewId === 'homeView') {
            backBtn.classList.add('hidden');
        } else {
            backBtn.classList.remove('hidden');
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }

    goBack() {
        if (this.viewHistory.length > 0) {
            const previousView = this.viewHistory.pop();
            this.navigateTo(previousView);
            // Remove the duplicate entry added by navigateTo
            this.viewHistory.pop();
        } else {
            this.navigateTo('homeView');
        }
    }

    // ========== Alphabet ==========

    renderAlphabet() {
        const grid = document.getElementById('alphabetGrid');
        grid.innerHTML = '';

        GEO_DATA.alphabet.forEach((item, index) => {
            const card = document.createElement('button');
            card.className = 'letter-card';
            if (this.progress.learnedLetters.includes(item.letter)) {
                card.classList.add('learned');
            }
            card.innerHTML = `
                <span class="letter-geo">${item.letter}</span>
                <span class="letter-translit">${item.translit}</span>
            `;
            card.addEventListener('click', () => this.showLetterDetail(index));
            grid.appendChild(card);
        });
    }

    showLetterDetail(index) {
        const letter = GEO_DATA.alphabet[index];
        const container = document.getElementById('letterDetail');

        let examplesHtml = '';
        if (letter.examples && letter.examples.length > 0) {
            examplesHtml = `
                <div class="letter-examples">
                    <h4>Exemples</h4>
                    ${letter.examples.map(ex => `
                        <div class="example-word">
                            <span class="example-geo">${ex.geo}</span>
                            <span class="example-translit">${ex.translit}</span>
                            <span class="example-meaning">${ex.meaning}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        container.innerHTML = `
            <div class="letter-display">${letter.letter}</div>
            <div class="letter-info-grid">
                <div class="letter-info-item">
                    <span class="letter-info-label">Romanisation</span>
                    <span class="letter-info-value">${letter.translit}</span>
                </div>
                <div class="letter-info-item">
                    <span class="letter-info-label">Nom</span>
                    <span class="letter-info-value">${letter.name}</span>
                </div>
            </div>
            <button class="audio-btn" onclick="app.playLetterSound('${letter.letter}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
                Écouter
            </button>
            <div class="info-box">
                <h4>Prononciation</h4>
                <p>${letter.sound}</p>
            </div>
            ${examplesHtml}
            <div class="lesson-nav">
                <button class="btn btn-secondary" onclick="app.markLetterLearned('${letter.letter}')">
                    ${this.progress.learnedLetters.includes(letter.letter) ? 'Apprise ✓' : 'Marquer comme apprise'}
                </button>
            </div>
        `;

        this.navigateTo('letterView');
    }

    markLetterLearned(letter) {
        if (!this.progress.learnedLetters.includes(letter)) {
            this.progress.learnedLetters.push(letter);
            this.saveProgress();
            this.renderAlphabet();
            this.updateProgressDisplay();
            this.showToast('Lettre marquée comme apprise !');
        }
        this.goBack();
    }

    playLetterSound(letter) {
        // For now, use Web Speech API as fallback
        // In production, you'd use actual audio files
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(letter);
            utterance.lang = 'ka-GE'; // Georgian
            utterance.rate = 0.7;
            speechSynthesis.speak(utterance);
        }
    }

    // ========== Units & Lessons ==========

    renderUnits() {
        const list = document.getElementById('unitsList');
        list.innerHTML = '';

        // Get unlocked units from profile (based on onboarding)
        const unlockedUnits = this.userProfile.unlockedUnits || [1];
        const userLevel = this.getUserLevelNumber();

        // Determine which units are "below level" (too easy based on placement)
        // For intermediate users, units 1-2 are considered too basic
        // For elementary users, unit 1 is considered too basic
        const getBelowLevelUnits = () => {
            if (userLevel >= 3) return [1, 2]; // Intermediate: units 1-2 are too easy
            if (userLevel >= 2) return [1];    // Elementary: unit 1 is too easy
            return [];                          // Beginner: nothing is too easy
        };
        const belowLevelUnits = getBelowLevelUnits();

        GEO_DATA.units.forEach((unit, index) => {
            // Unit is unlocked if:
            // 1. It's in the unlockedUnits array (from onboarding), OR
            // 2. Previous unit is completed
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

            // Add level indicator
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
    }

    getUnitProgress(unitId) {
        const unitProgress = this.progress.unitProgress[unitId];
        if (!unitProgress) return 0;
        const unit = GEO_DATA.units.find(u => u.id === unitId);
        if (!unit) return 0;
        const totalExercises = unit.exercises ? unit.exercises.length : 0;
        const completed = unitProgress.exercisesCompleted || 0;
        return totalExercises > 0 ? Math.round((completed / totalExercises) * 100) : 0;
    }

    openUnit(unit) {
        this.currentUnit = unit;
        const lesson = unit.lessons[0];
        this.showLesson(lesson, unit);
    }

    showLesson(lesson, unit) {
        this.currentLesson = lesson;
        const container = document.getElementById('lessonContent');

        let lettersSection = '';
        if (lesson.letters && lesson.letters.length > 0) {
            lettersSection = `
                <div class="lesson-section">
                    <h3>Lettres à apprendre</h3>
                    <div class="alphabet-grid" style="margin-top: 12px;">
                        ${lesson.letters.map(letter => {
                            const letterData = GEO_DATA.alphabet.find(l => l.letter === letter);
                            return `
                                <div class="letter-card" onclick="app.showLetterDetail(${GEO_DATA.alphabet.indexOf(letterData)})">
                                    <span class="letter-geo">${letter}</span>
                                    <span class="letter-translit">${letterData ? letterData.translit : ''}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        let vocabSection = '';
        if (lesson.vocabulary && lesson.vocabulary.length > 0) {
            vocabSection = `
                <div class="lesson-section">
                    <h3>Vocabulaire</h3>
                    <div class="lesson-examples">
                        ${lesson.vocabulary.map(word => `
                            <div class="lesson-example">
                                <span class="example-georgian">${word.geo}</span>
                                <div class="example-details">
                                    <span class="translit">${word.translit}</span>
                                    <span class="meaning">${word.meaning}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="lesson-header">
                <h2>${lesson.title}</h2>
                <p>Unité ${unit.id} : ${unit.concept}</p>
            </div>
            <div class="lesson-body">
                ${lesson.content}
                ${lettersSection}
                ${vocabSection}
            </div>
            <div class="lesson-nav">
                <button class="btn btn-primary" onclick="app.startExercises()">
                    Commencer les exercices
                </button>
            </div>
        `;

        this.navigateTo('lessonView');
    }

    // ========== Exercises ==========

    startExercises() {
        if (!this.currentUnit || !this.currentUnit.exercises) {
            this.showToast('Pas d\'exercices disponibles');
            return;
        }

        this.currentExerciseIndex = 0;
        this.showExercise();
    }

    showExercise() {
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
        if (exercise.type === 'choice') {
            exerciseHtml = this.renderChoiceExercise(exercise);
        } else if (exercise.type === 'reorder') {
            exerciseHtml = this.renderReorderExercise(exercise);
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
                ${exercise.prompt ? `
                    <div class="exercise-prompt">${exercise.prompt}</div>
                    ${exercise.promptTranslit ? `<p class="exercise-prompt-translit">${exercise.promptTranslit}</p>` : ''}
                ` : ''}
            </div>
            ${exerciseHtml}
            <div class="feedback" id="exerciseFeedback"></div>
            <button class="btn btn-primary" id="nextExerciseBtn" style="display: none;" onclick="app.nextExercise()">
                Continuer
            </button>
        `;

        this.navigateTo('exerciseView');
    }

    renderChoiceExercise(exercise) {
        return `
            <div class="exercise-options">
                ${exercise.options.map((option, index) => `
                    <button class="option-btn" data-index="${index}" data-correct="${option.correct}" onclick="app.selectOption(this, ${option.correct})">
                        ${option.text}
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderReorderExercise(exercise) {
        // Shuffle words
        const shuffled = [...exercise.words].sort(() => Math.random() - 0.5);
        this.reorderWords = shuffled;
        this.reorderAnswer = [];
        this.correctOrder = exercise.correctOrder;

        return `
            <div class="reorder-answer" id="reorderAnswer" onclick="app.removeFromAnswer(event)"></div>
            <div class="reorder-container" id="reorderContainer">
                ${shuffled.map((word, index) => `
                    <button class="reorder-word" data-index="${index}" onclick="app.addToAnswer(this, '${word}')">
                        ${word}
                    </button>
                `).join('')}
            </div>
            <button class="btn btn-secondary" onclick="app.checkReorder()" style="margin-top: 16px;">
                Vérifier
            </button>
        `;
    }

    addToAnswer(btn, word) {
        if (btn.classList.contains('placed')) return;

        btn.classList.add('placed');
        this.reorderAnswer.push(word);

        const answerContainer = document.getElementById('reorderAnswer');
        const wordBtn = document.createElement('button');
        wordBtn.className = 'reorder-word';
        wordBtn.textContent = word;
        wordBtn.dataset.word = word;
        answerContainer.appendChild(wordBtn);
    }

    removeFromAnswer(event) {
        if (!event.target.classList.contains('reorder-word')) return;

        const word = event.target.dataset.word;
        event.target.remove();

        this.reorderAnswer = this.reorderAnswer.filter(w => w !== word);

        // Re-enable the source button
        const sourceContainer = document.getElementById('reorderContainer');
        const sourceButtons = sourceContainer.querySelectorAll('.reorder-word');
        sourceButtons.forEach(btn => {
            if (btn.textContent.trim() === word && btn.classList.contains('placed')) {
                btn.classList.remove('placed');
            }
        });
    }

    checkReorder() {
        if (this.exerciseAnswered) return;

        const isCorrect = JSON.stringify(this.reorderAnswer) === JSON.stringify(this.correctOrder);
        this.showFeedback(isCorrect, this.currentUnit.exercises[this.currentExerciseIndex].feedback);
    }

    selectOption(btn, isCorrect) {
        if (this.exerciseAnswered) return;

        // Mark selection
        btn.classList.add('selected');

        // Show correct/incorrect
        document.querySelectorAll('.option-btn').forEach(b => {
            if (b.dataset.correct === 'true') {
                b.classList.add('correct');
            } else if (b === btn && !isCorrect) {
                b.classList.add('incorrect');
            }
        });

        this.showFeedback(isCorrect, this.currentUnit.exercises[this.currentExerciseIndex].feedback);
    }

    showFeedback(isCorrect, feedback) {
        this.exerciseAnswered = true;

        const feedbackEl = document.getElementById('exerciseFeedback');
        feedbackEl.className = `feedback show ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackEl.innerHTML = `
            <h4>${isCorrect ? 'Correct !' : 'Pas tout à fait...'}</h4>
            <p>${isCorrect ? feedback.correct : feedback.incorrect}</p>
        `;

        document.getElementById('nextExerciseBtn').style.display = 'block';

        // Update progress
        if (isCorrect) {
            if (!this.progress.unitProgress[this.currentUnit.id]) {
                this.progress.unitProgress[this.currentUnit.id] = { exercisesCompleted: 0 };
            }
            this.progress.unitProgress[this.currentUnit.id].exercisesCompleted = this.currentExerciseIndex + 1;
            this.saveProgress();
        }
    }

    nextExercise() {
        this.currentExerciseIndex++;
        this.showExercise();
    }

    completeUnit() {
        if (!this.progress.completedUnits.includes(this.currentUnit.id)) {
            this.progress.completedUnits.push(this.currentUnit.id);
            this.saveProgress();
        }

        const container = document.getElementById('exerciseContainer');
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🎉</div>
                <h2 style="color: var(--success); margin-bottom: 12px;">Unité terminée !</h2>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">
                    Félicitations ! Vous avez complété l'unité "${this.currentUnit.title}".
                </p>
                <button class="btn btn-primary" onclick="app.navigateTo('unitsView'); app.renderUnits(); app.updateProgressDisplay();">
                    Continuer
                </button>
            </div>
        `;
    }

    // ========== Vocabulary ==========

    renderVocabulary(filter = 'all') {
        const list = document.getElementById('vocabularyList');
        list.innerHTML = '';

        // Get user's minimum level threshold
        const levelMap = { 'beginner': 1, 'elementary': 2, 'intermediate': 3 };
        const userLevelNum = levelMap[this.userProfile.level] || 1;

        // Flatten all vocabulary from GEO_DATA
        let allWords = [];
        const seenGeo = new Set();
        Object.keys(GEO_DATA.vocabulary).forEach(category => {
            GEO_DATA.vocabulary[category].forEach(word => {
                if (!seenGeo.has(word.geo)) {
                    seenGeo.add(word.geo);
                    allWords.push({ ...word, category });
                }
            });
        });

        // Ajouter les mots appris via les articles (qui ne sont pas déjà dans GEO_DATA)
        const articleWords = this.progress.articleLearnedWords || [];
        articleWords.forEach(word => {
            if (!seenGeo.has(word.geo)) {
                seenGeo.add(word.geo);
                allWords.push({
                    geo: word.geo,
                    meaning: word.meaning,
                    translit: word.translit,
                    level: word.level || 1,
                    category: 'articles'
                });
            }
        });

        // Apply level filter for 'all' and 'new' (filter out too basic vocabulary)
        if (filter === 'all' || filter === 'new') {
            allWords = allWords.filter(w => (w.level || 1) >= userLevelNum);
        }

        // Apply category filter
        if (filter === 'learned') {
            allWords = allWords.filter(w => this.progress.learnedWords.includes(w.geo));
        } else if (filter === 'review') {
            allWords = allWords.filter(w => this.progress.wordsToReview.includes(w.geo));
        } else if (filter === 'new') {
            allWords = allWords.filter(w => !this.progress.learnedWords.includes(w.geo));
        }

        if (allWords.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px;">Aucun mot dans cette catégorie.</p>';
            return;
        }

        allWords.forEach(word => {
            const isFromArticle = word.category === 'articles';
            const mastery = this.getMasteryLevel(word.geo);
            const masteryInfo = this.getMasteryInfo(mastery);
            const srsData = this.getWordSRS(word.geo);
            const nextReview = srsData.nextReviewDate;
            const today = new Date().toISOString().split('T')[0];
            const isDue = nextReview && nextReview <= today && srsData.totalReviews > 0;

            const card = document.createElement('div');
            card.className = 'vocab-card' + (mastery >= 4 ? ' learned' : '') + (isDue ? ' due' : '');
            card.innerHTML = `
                <div class="vocab-mastery-dot" style="background:${masteryInfo.color}" title="${masteryInfo.label}"></div>
                <div class="vocab-main">
                    <span class="vocab-geo">${word.geo}</span>
                    <span class="vocab-translit">${word.translit}</span>
                </div>
                <div class="vocab-right">
                    <span class="vocab-meaning">${word.meaning}${isFromArticle ? ' <small style="opacity:0.6">📰</small>' : ''}</span>
                    <span class="vocab-mastery-label" style="color:${masteryInfo.color}">${masteryInfo.label}${isDue ? ' · à réviser' : ''}</span>
                </div>
                <button class="vocab-audio" onclick="event.stopPropagation(); app.playWord('${word.geo}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </svg>
                </button>
            `;

            card.addEventListener('click', () => this.toggleWordLearned(word.geo));
            list.appendChild(card);
        });
    }

    toggleWordLearned(word) {
        const index = this.progress.learnedWords.indexOf(word);
        if (index === -1) {
            this.progress.learnedWords.push(word);
            this.showToast('Mot ajouté aux mots appris');
        } else {
            this.progress.learnedWords.splice(index, 1);
            this.showToast('Mot retiré des mots appris');
        }
        this.saveProgress();
        this.updateProgressDisplay();
    }

    playWord(word) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'ka-GE';
            utterance.rate = 0.7;
            speechSynthesis.speak(utterance);
        }
    }

    toggleTransliteration() {
        this.showTranslit = !this.showTranslit;
        const toggle = document.querySelector('#toggleTranslit .toggle-switch');
        toggle.classList.toggle('active', this.showTranslit);
        this.applyTransliteration();
        this.saveSettings();
    }

    applyTransliteration() {
        document.body.classList.toggle('no-translit', !this.showTranslit);
    }

    // ========== Grammar ==========

    renderGrammar() {
        const list = document.getElementById('grammarList');
        list.innerHTML = '';

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
    }

    showGrammarDetail(rule) {
        const container = document.getElementById('grammarDetail');
        container.innerHTML = `
            <h2>${rule.title}</h2>
            ${rule.content}
        `;
        this.navigateTo('grammarDetailView');
    }

    // ========== Review ==========

    startReview(type) {
        this.showToast(`Mode révision : ${type}`);
        // For now, redirect to appropriate section
        if (type === 'alphabet') {
            this.navigateTo('alphabetView');
        } else if (type === 'vocabulary') {
            this.navigateTo('vocabularyView');
        } else if (type === 'grammar') {
            this.navigateTo('grammarView');
        }
    }

    // ========== Progress ==========

    loadProgress() {
        const saved = localStorage.getItem('kartapp_progress');
        if (saved) {
            const progress = JSON.parse(saved);
            if (!progress.articleLearnedWords) progress.articleLearnedWords = [];
            if (!progress.srsData) progress.srsData = {};
            return progress;
        }
        return {
            learnedLetters: [],
            learnedWords: [],
            wordsToReview: [],
            completedUnits: [],
            unitProgress: {},
            articleLearnedWords: [],
            srsData: {}
        };
    }

    saveProgress() {
        localStorage.setItem('kartapp_progress', JSON.stringify(this.progress));
    }

    resetProgress() {
        // Reset progress
        this.progress = {
            learnedLetters: [],
            learnedWords: [],
            wordsToReview: [],
            completedUnits: [],
            unitProgress: {},
            articleLearnedWords: [],
            srsData: {}
        };
        this.saveProgress();
        // Supprimer le cache d'article quotidien
        localStorage.removeItem('kartapp_daily_article');

        // Reset profile and show onboarding again
        this.userProfile = {
            onboardingCompleted: false,
            level: 'beginner',
            alphabetKnowledge: 'none',
            goals: [],
            placementScore: 0,
            unlockedUnits: [1]
        };
        this.saveUserProfile();

        // Reset onboarding state
        this.onboardingStep = 1;
        this.placementTestIndex = 0;
        this.placementScore = 0;

        // Refresh UI
        this.renderAlphabet();
        this.renderUnits();
        this.renderVocabulary();
        this.updateProgressDisplay();

        // Reset onboarding UI
        this.goToOnboardingStep(1);
        document.querySelectorAll('.onboarding-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelectorAll('.goal-option input').forEach(cb => cb.checked = false);

        // Show onboarding
        this.checkOnboarding();

        this.showToast('Progression réinitialisée');
    }

    updateProgressDisplay() {
        // Overall progress (simplified: based on units)
        const totalUnits = GEO_DATA.units.length;
        const completedUnits = this.progress.completedUnits.length;
        const percentage = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

        document.getElementById('overallProgress').textContent = `${percentage}%`;
        document.getElementById('wordsLearned').textContent = this.progress.learnedWords.length;

        // Afficher la section de révision SRS si des mots sont à réviser
        const dueWords = this.getDueWords();
        const srsSection = document.getElementById('srsReviewSection');
        const srsCount = document.getElementById('srsReviewCount');
        if (srsSection && srsCount) {
            if (dueWords.length > 0) {
                srsSection.style.display = 'block';
                srsCount.textContent = dueWords.length;
            } else {
                srsSection.style.display = 'none';
            }
        }
    }

    // ========== Settings ==========

    loadSettings() {
        const saved = localStorage.getItem('kartapp_settings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.showTranslit = settings.showTranslit !== false;
            this.autoAudio = settings.autoAudio === true;
        }

        document.getElementById('settingTranslit').checked = this.showTranslit;
        document.getElementById('settingAutoAudio').checked = this.autoAudio;
        document.querySelector('#toggleTranslit .toggle-switch').classList.toggle('active', this.showTranslit);
        this.applyTransliteration();
    }

    saveSettings() {
        localStorage.setItem('kartapp_settings', JSON.stringify({
            showTranslit: this.showTranslit,
            autoAudio: this.autoAudio
        }));
    }

    // ========== Utilities ==========

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed:', err));
        }
    }
}

// Initialize app after all scripts loaded
let app;
document.addEventListener("DOMContentLoaded", () => { app = new KartApp(); });
