/**
 * MatchChat - Application principale
 * Version narrative et subtile
 */
(function() {
    'use strict';

    const elements = {
        dropZone: document.getElementById('drop-zone'),
        fileInput: document.getElementById('file-input'),
        uploadSection: document.getElementById('upload-section'),
        loadingSection: document.getElementById('loading-section'),
        resultsSection: document.getElementById('results-section'),
        participantsAvatars: document.getElementById('participants-avatars'),
        synthesisHeadline: document.getElementById('synthesis-headline'),
        synthesisPortrait: document.getElementById('synthesis-portrait'),
        synthesisDynamic: document.getElementById('synthesis-dynamic'),
        synthesisRhythm: document.getElementById('synthesis-rhythm'),
        dynamicsSection: document.getElementById('dynamics-section'),
        dynamicsList: document.getElementById('dynamics-list'),
        btnNew: document.getElementById('btn-new'),
        btnShare: document.getElementById('btn-share'),
        toast: document.getElementById('toast')
    };

    const parser = new WhatsAppParser();
    const analyzer = new CompatibilityAnalyzer();
    let currentResults = null;

    function init() {
        setupDropZone();
        setupButtons();
    }

    function setupDropZone() {
        const { dropZone, fileInput } = elements;

        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleFile(file);
            fileInput.value = '';
        });
    }

    function setupButtons() {
        elements.btnNew.addEventListener('click', resetApp);
        elements.btnShare.addEventListener('click', shareResults);
    }

    async function handleFile(file) {
        if (!file.name.endsWith('.txt')) {
            showToast('Veuillez selectionner un fichier .txt exporte de WhatsApp', 'error');
            return;
        }

        showSection('loading');

        try {
            const content = await readFile(file);
            const data = parser.parse(content);

            if (data.messages.length < 10) {
                showToast('La conversation doit contenir au moins 10 messages', 'error');
                showSection('upload');
                return;
            }

            const results = analyzer.analyze(data);
            currentResults = { ...results, data };

            setTimeout(() => {
                displayResults(results, data);
                showSection('results');
            }, 600);

        } catch (error) {
            console.error('Erreur:', error);
            showToast(error.message || 'Erreur lors de l\'analyse du fichier', 'error');
            showSection('upload');
        }
    }

    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Impossible de lire le fichier'));
            reader.readAsText(file, 'UTF-8');
        });
    }

    function displayResults(results, data) {
        displaySynthesis(results);
        displayNarrativeCards(results);
        displayDynamics(results);
    }

    function displaySynthesis(results) {
        const { synthesis, participants } = results;

        // Avatars
        elements.participantsAvatars.innerHTML = participants.map((p, i) => `
            <div class="participant-avatar p${i + 1}">${getInitials(p.name)}</div>
        `).join('');

        // Textes
        elements.synthesisHeadline.textContent = synthesis.headline;
        elements.synthesisPortrait.textContent = synthesis.portrait;
        elements.synthesisDynamic.textContent = synthesis.dynamic;
        elements.synthesisRhythm.textContent = synthesis.rhythm;
    }

    function displayNarrativeCards(results) {
        const types = ['friendship', 'romantic', 'intimate', 'professional'];

        types.forEach(type => {
            const narrative = results.narratives[type];
            const score = results.scores[type];

            // Titre
            document.getElementById(`title-${type}`).textContent = narrative.title;

            // Badge avec indicateur textuel
            const badgeEl = document.getElementById(`badge-${type}`);
            badgeEl.textContent = getScoreIndicator(score);

            // Description
            document.getElementById(`desc-${type}`).textContent = narrative.description;

            // Traits
            const traitsEl = document.getElementById(`traits-${type}`);
            if (narrative.traits.length > 0) {
                traitsEl.innerHTML = narrative.traits.map(t => `<li>${escapeHtml(t)}</li>`).join('');
            } else {
                traitsEl.innerHTML = '';
            }

            // Chimie
            const chemistryEl = document.getElementById(`chemistry-${type}`);
            chemistryEl.textContent = narrative.chemistry || '';
        });
    }

    function displayDynamics(results) {
        const { dynamics } = results;

        if (dynamics.length === 0) {
            elements.dynamicsSection.style.display = 'none';
            return;
        }

        elements.dynamicsSection.style.display = 'block';
        elements.dynamicsList.innerHTML = dynamics.map(d => `
            <div class="dynamic-item">
                <p class="dynamic-text">${escapeHtml(d.text)}</p>
                <p class="dynamic-detail">${escapeHtml(d.detail)}</p>
            </div>
        `).join('');
    }

    function getScoreIndicator(score) {
        // Indicateurs subtils sans pourcentage brut
        if (score >= 80) return 'Tres fort';
        if (score >= 65) return 'Fort';
        if (score >= 50) return 'Modere';
        if (score >= 35) return 'Leger';
        return 'Faible';
    }

    function getInitials(name) {
        return name
            .split(' ')
            .map(w => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showSection(section) {
        elements.uploadSection.style.display = section === 'upload' ? 'flex' : 'none';
        elements.loadingSection.style.display = section === 'loading' ? 'flex' : 'none';
        elements.resultsSection.style.display = section === 'results' ? 'flex' : 'none';
    }

    function resetApp() {
        currentResults = null;
        showSection('upload');
    }

    async function shareResults() {
        if (!currentResults) return;

        const { narratives, synthesis, participants } = currentResults;

        const text = `MatchChat - Analyse de compatibilite

${participants[0].name} & ${participants[1].name}
${synthesis.headline}

Amicale : ${narratives.friendship.title}
Romantique : ${narratives.romantic.title}
Intime : ${narratives.intimate.title}
Professionnelle : ${narratives.professional.title}

${synthesis.portrait}

Analysez vos conversations sur MatchChat`;

        if (navigator.share) {
            try {
                await navigator.share({ title: 'MatchChat', text });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    copyToClipboard(text);
                }
            }
        } else {
            copyToClipboard(text);
        }
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Resultats copies dans le presse-papier', 'success');
        } catch (err) {
            showToast('Impossible de copier les resultats', 'error');
        }
    }

    function showToast(message, type = 'info') {
        const { toast } = elements;
        toast.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    init();
})();
