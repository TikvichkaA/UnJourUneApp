// ===== APPLICATION TS COMPAGNON =====

const app = {
    currentPage: 'home',
    pageHistory: [],
    currentItem: null,
    currentItemType: null,
    favorites: [],
    notes: [],
    recent: [],
    settings: {
        textSize: 'medium'
    },

    // ===== PROFIL TS =====
    currentTs: null,           // Nom de la TS connectée
    currentSuivi: null,        // Personne suivie actuellement consultée
    suivisFilter: 'all',       // Filtre actif (all, femme_isolee, famille)

    // ===== ÉTAT ASSISTANT =====
    assistant: {
        currentQuestion: 'start',
        history: [],           // Historique des questions/réponses
        answers: {},           // Réponses données
        selectedPerson: null   // Personne liée (projet 12)
    },

    // ===== INITIALISATION =====
    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.renderHome();
        this.applySettings();
        this.updateFavoriteBadge();
        document.getElementById('content-version').textContent = DATA.version;
        document.getElementById('last-sync').textContent = this.formatDate(DATA.updated_at);
    },

    loadFromStorage() {
        try {
            this.favorites = JSON.parse(localStorage.getItem('ts_favorites')) || [];
            this.notes = JSON.parse(localStorage.getItem('ts_notes')) || [];
            this.recent = JSON.parse(localStorage.getItem('ts_recent')) || [];
            this.settings = JSON.parse(localStorage.getItem('ts_settings')) || { textSize: 'medium' };
            this.currentTs = localStorage.getItem('ts_current_profile') || null;
        } catch (e) {
            console.error('Erreur chargement localStorage:', e);
        }
    },

    saveToStorage() {
        try {
            localStorage.setItem('ts_favorites', JSON.stringify(this.favorites));
            localStorage.setItem('ts_notes', JSON.stringify(this.notes));
            localStorage.setItem('ts_recent', JSON.stringify(this.recent));
            localStorage.setItem('ts_settings', JSON.stringify(this.settings));
            if (this.currentTs) {
                localStorage.setItem('ts_current_profile', this.currentTs);
            }
        } catch (e) {
            console.error('Erreur sauvegarde localStorage:', e);
        }
    },

    applySettings() {
        document.body.classList.remove('text-small', 'text-medium', 'text-large');
        document.body.classList.add('text-' + this.settings.textSize);

        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === this.settings.textSize);
        });
    },

    // ===== ÉVÉNEMENTS =====
    bindEvents() {
        // Navigation bottom
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                this.showPage(page);
            });
        });

        // Recherche globale
        const globalSearch = document.getElementById('global-search');
        const searchClear = document.getElementById('search-clear');
        const searchResults = document.getElementById('search-results');

        globalSearch.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            searchClear.hidden = query.length === 0;
            if (query.length >= 2) {
                this.performSearch(query);
                searchResults.hidden = false;
            } else {
                searchResults.hidden = true;
            }
        });

        globalSearch.addEventListener('focus', () => {
            if (globalSearch.value.trim().length >= 2) {
                searchResults.hidden = false;
            }
        });

        searchClear.addEventListener('click', () => {
            globalSearch.value = '';
            searchResults.hidden = true;
            searchClear.hidden = true;
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.hidden = true;
            }
        });

        // Recherche glossaire
        const glossaireSearch = document.getElementById('glossaire-search');
        if (glossaireSearch) {
            glossaireSearch.addEventListener('input', (e) => {
                this.filterGlossaire(e.target.value.trim());
            });
        }

        // Tabs catégories
        document.querySelectorAll('.category-tabs').forEach(tabs => {
            tabs.addEventListener('click', (e) => {
                if (e.target.classList.contains('tab-btn')) {
                    tabs.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    const category = e.target.dataset.category;
                    this.filterByCategory(category, tabs.id);
                }
            });
        });

        // Tags glossaire
        document.getElementById('glossaire-tags')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag-btn')) {
                document.querySelectorAll('#glossaire-tags .tag-btn').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.filterGlossaireByTag(e.target.dataset.tag);
            }
        });

        // Filtres
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('active');
                this.applyFilters();
            });
        });

        // Favoris tabs
        document.querySelectorAll('.favoris-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.favoris-tabs .tab-btn').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.dataset.tab;
                document.querySelectorAll('#page-favoris .tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById('tab-' + tab)?.classList.add('active');
            });
        });

        // Taille texte
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.settings.textSize = btn.dataset.size;
                this.applySettings();
                this.saveToStorage();
            });
        });

        // Sections accordéon
        document.addEventListener('click', (e) => {
            if (e.target.closest('.section-header')) {
                const header = e.target.closest('.section-header');
                const body = header.nextElementSibling;
                header.classList.toggle('open');
                body?.classList.toggle('open');
            }
        });

        // Check-lists cochables
        document.addEventListener('click', (e) => {
            const li = e.target.closest('.checklist li');
            if (li) {
                li.classList.toggle('checked');
            }
        });

        // Bouton scroll-to-top
        const scrollTopBtn = document.getElementById('scroll-top-btn');
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrolled = window.scrollY > 300;
                scrollTopBtn.classList.toggle('visible', scrolled);
            }, 50);
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    // ===== BADGE FAVORIS =====
    updateFavoriteBadge() {
        const favNavBtn = document.querySelector('.nav-btn[data-page="favoris"]');
        if (!favNavBtn) return;

        let badge = favNavBtn.querySelector('.badge');
        if (this.favorites.length > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'badge';
                favNavBtn.appendChild(badge);
            }
            badge.textContent = this.favorites.length;
        } else if (badge) {
            badge.remove();
        }
    },

    // ===== NAVIGATION =====
    showPage(pageId) {
        // Mettre à jour l'historique
        if (this.currentPage !== pageId) {
            this.pageHistory.push(this.currentPage);
        }

        // Masquer toutes les pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        // Afficher la page demandée
        const page = document.getElementById('page-' + pageId);
        if (page) {
            page.classList.add('active');
            this.currentPage = pageId;
        }

        // Mettre à jour la navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === pageId);
        });

        // Charger le contenu selon la page
        switch (pageId) {
            case 'home':
                this.renderHome();
                break;
            case 'mes-suivis':
                this.renderMesSuivis();
                break;
            case 'suivi-detail':
                this.renderSuiviDetail();
                break;
            case 'assistant':
                this.initAssistant();
                break;
            case 'droits-sociaux':
                this.renderDispositifs();
                break;
            case 'droits-bancaires':
                this.renderBancaire();
                break;
            case 'glossaire':
                this.renderGlossaire();
                break;
            case 'fiches':
                this.renderFiches();
                break;
            case 'favoris':
                this.renderFavoris();
                break;
        }

        // Scroll to top
        window.scrollTo(0, 0);
    },

    goBack() {
        if (this.pageHistory.length > 0) {
            const previousPage = this.pageHistory.pop();
            this.showPage(previousPage);
            this.pageHistory.pop(); // Éviter doublon
        } else {
            this.showPage('home');
        }
    },

    // ===== RENDU ACCUEIL =====
    renderHome() {
        this.renderRecent();
    },

    renderRecent() {
        const container = document.getElementById('recent-list');
        const section = document.getElementById('recent-section');

        if (this.recent.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        container.innerHTML = this.recent.slice(0, 5).map(item => {
            const data = this.getItemById(item.type, item.id);
            if (!data) return '';
            return `
                <div class="recent-item" onclick="app.showDetail('${item.type}', '${item.id}')">
                    <span class="recent-icon">${data.icon || '📄'}</span>
                    <div class="recent-content">
                        <div class="recent-title">${data.title || data.term}</div>
                        <div class="recent-type">${this.getTypeName(item.type)}</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // ===== RENDU LISTES =====
    renderDispositifs() {
        const container = document.getElementById('dispositifs-list');
        container.innerHTML = DATA.dispositifs.map(d => this.renderCard(d, 'dispositif')).join('');
    },

    renderBancaire() {
        const container = document.getElementById('bancaire-list');
        const items = [...DATA.bancaire, ...DATA.modeles.filter(m => m.category === 'bancaire')];
        container.innerHTML = items.map(d => {
            const type = d.type ? 'modele' : 'bancaire';
            return this.renderCard(d, type);
        }).join('');
    },

    renderGlossaire() {
        const container = document.getElementById('glossaire-list');
        const sorted = [...DATA.glossaire].sort((a, b) => a.term.localeCompare(b.term));
        container.innerHTML = sorted.map(g => `
            <div class="glossaire-item" onclick="app.showDetail('glossaire', '${g.id}')">
                <div class="glossaire-term">${g.term}</div>
                <div class="glossaire-expanded">${g.expanded}</div>
                <div class="glossaire-short">${g.definition_short}</div>
            </div>
        `).join('');
    },

    renderFiches() {
        const container = document.getElementById('fiches-list');
        container.innerHTML = DATA.fiches.map(f => this.renderCard(f, 'fiche')).join('');
    },

    renderCard(item, type) {
        const tags = item.tags || [];
        const tagsHtml = tags.map(t => {
            const cls = t === 'urgence' ? 'urgence' : (t === 'frequent' ? 'frequent' : '');
            return `<span class="card-tag ${cls}">${t}</span>`;
        }).join('');

        const isFav = this.isFavorite(type, item.id);
        const favClass = isFav ? ' is-favorite' : '';

        return `
            <div class="card-item${favClass}" onclick="app.showDetail('${type}', '${item.id}')">
                <span class="card-icon">${item.icon || '📄'}</span>
                <div class="card-content">
                    <div class="card-title">${item.title || item.term}</div>
                    <div class="card-subtitle">${item.summary || item.definition_short || item.context || ''}</div>
                    ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}
                </div>
                <span class="card-arrow">›</span>
            </div>
        `;
    },

    // ===== FILTRES =====
    filterByCategory(category, tabsId) {
        let items, container, type;

        if (tabsId === 'social-tabs') {
            items = DATA.dispositifs;
            container = document.getElementById('dispositifs-list');
            type = 'dispositif';
        } else if (tabsId === 'bancaire-tabs') {
            if (category === 'modeles') {
                items = DATA.modeles.filter(m => m.category === 'bancaire');
                type = 'modele';
            } else {
                items = category === 'all'
                    ? [...DATA.bancaire, ...DATA.modeles.filter(m => m.category === 'bancaire')]
                    : DATA.bancaire.filter(d => d.category === category);
                type = 'bancaire';
            }
            container = document.getElementById('bancaire-list');
        } else if (tabsId === 'fiches-tabs') {
            items = DATA.fiches;
            container = document.getElementById('fiches-list');
            type = 'fiche';
        }

        if (category !== 'all' && category !== 'modeles') {
            items = items.filter(d => d.category === category);
        }

        container.innerHTML = items.map(d => {
            const itemType = d.type ? 'modele' : type;
            return this.renderCard(d, itemType);
        }).join('');
    },

    filterGlossaire(query) {
        const container = document.getElementById('glossaire-list');
        let items = DATA.glossaire;

        if (query) {
            const q = query.toLowerCase();
            items = items.filter(g =>
                g.term.toLowerCase().includes(q) ||
                g.expanded.toLowerCase().includes(q) ||
                g.definition_short.toLowerCase().includes(q)
            );
        }

        items = items.sort((a, b) => a.term.localeCompare(b.term));
        container.innerHTML = items.map(g => `
            <div class="glossaire-item" onclick="app.showDetail('glossaire', '${g.id}')">
                <div class="glossaire-term">${g.term}</div>
                <div class="glossaire-expanded">${g.expanded}</div>
                <div class="glossaire-short">${g.definition_short}</div>
            </div>
        `).join('');
    },

    filterGlossaireByTag(tag) {
        const container = document.getElementById('glossaire-list');
        let items = DATA.glossaire;

        if (tag !== 'all') {
            items = items.filter(g => g.tags && g.tags.includes(tag));
        }

        items = items.sort((a, b) => a.term.localeCompare(b.term));
        container.innerHTML = items.map(g => `
            <div class="glossaire-item" onclick="app.showDetail('glossaire', '${g.id}')">
                <div class="glossaire-term">${g.term}</div>
                <div class="glossaire-expanded">${g.expanded}</div>
                <div class="glossaire-short">${g.definition_short}</div>
            </div>
        `).join('');
    },

    applyFilters() {
        const activeFilters = Array.from(document.querySelectorAll('.filter-chip.active'))
            .map(c => c.dataset.filter);

        let items = DATA.dispositifs;

        if (activeFilters.length > 0) {
            items = items.filter(d => {
                return activeFilters.some(f => d.tags && d.tags.includes(f));
            });
        }

        const container = document.getElementById('dispositifs-list');
        container.innerHTML = items.map(d => this.renderCard(d, 'dispositif')).join('');
    },

    // ===== RECHERCHE =====
    performSearch(query) {
        const q = query.toLowerCase();
        const results = {
            dispositifs: [],
            bancaire: [],
            glossaire: [],
            fiches: [],
            modeles: []
        };

        // Recherche dans les dispositifs
        DATA.dispositifs.forEach(d => {
            if (this.matchSearch(d, q)) {
                results.dispositifs.push(d);
            }
        });

        // Recherche dans bancaire
        DATA.bancaire.forEach(d => {
            if (this.matchSearch(d, q)) {
                results.bancaire.push(d);
            }
        });

        // Recherche dans glossaire (+ alias)
        DATA.glossaire.forEach(g => {
            if (g.term.toLowerCase().includes(q) ||
                g.expanded.toLowerCase().includes(q) ||
                g.definition_short.toLowerCase().includes(q)) {
                results.glossaire.push(g);
            }
        });

        // Recherche dans fiches
        DATA.fiches.forEach(f => {
            if (f.title.toLowerCase().includes(q) ||
                f.context?.toLowerCase().includes(q)) {
                results.fiches.push(f);
            }
        });

        // Recherche dans modèles
        DATA.modeles.forEach(m => {
            if (m.title.toLowerCase().includes(q)) {
                results.modeles.push(m);
            }
        });

        this.renderSearchResults(results);
    },

    matchSearch(item, query) {
        return item.title?.toLowerCase().includes(query) ||
               item.fullTitle?.toLowerCase().includes(query) ||
               item.summary?.toLowerCase().includes(query) ||
               item.id?.toLowerCase().includes(query);
    },

    renderSearchResults(results) {
        const container = document.getElementById('search-results');
        let html = '';

        if (results.dispositifs.length > 0) {
            html += `<div class="search-group">
                <div class="search-group-title">Droits sociaux</div>
                ${results.dispositifs.slice(0, 5).map(d => this.renderSearchItem(d, 'dispositif')).join('')}
            </div>`;
        }

        if (results.bancaire.length > 0) {
            html += `<div class="search-group">
                <div class="search-group-title">Droits bancaires</div>
                ${results.bancaire.slice(0, 5).map(d => this.renderSearchItem(d, 'bancaire')).join('')}
            </div>`;
        }

        if (results.glossaire.length > 0) {
            html += `<div class="search-group">
                <div class="search-group-title">Glossaire</div>
                ${results.glossaire.slice(0, 5).map(g => this.renderSearchItem(g, 'glossaire')).join('')}
            </div>`;
        }

        if (results.fiches.length > 0) {
            html += `<div class="search-group">
                <div class="search-group-title">Fiches réflexes</div>
                ${results.fiches.slice(0, 5).map(f => this.renderSearchItem(f, 'fiche')).join('')}
            </div>`;
        }

        if (results.modeles.length > 0) {
            html += `<div class="search-group">
                <div class="search-group-title">Modèles</div>
                ${results.modeles.slice(0, 5).map(m => this.renderSearchItem(m, 'modele')).join('')}
            </div>`;
        }

        if (!html) {
            html = '<div class="search-item"><div class="search-item-content">Aucun résultat</div></div>';
        }

        container.innerHTML = html;
    },

    renderSearchItem(item, type) {
        return `
            <div class="search-item" onclick="app.showDetail('${type}', '${item.id}'); document.getElementById('search-results').hidden = true;">
                <span class="search-item-icon">${item.icon || '📄'}</span>
                <div class="search-item-content">
                    <div class="search-item-title">${item.title || item.term}</div>
                    <div class="search-item-subtitle">${item.summary || item.expanded || item.context || ''}</div>
                </div>
            </div>
        `;
    },

    // ===== DÉTAIL =====
    showDetail(type, id) {
        const item = this.getItemById(type, id);
        if (!item) return;

        this.currentItem = item;
        this.currentItemType = type;
        this.addToRecent(type, id);

        let pageId, contentId, titleId, favBtnId;

        switch (type) {
            case 'dispositif':
            case 'bancaire':
                pageId = 'dispositif-detail';
                contentId = 'dispositif-content';
                titleId = 'dispositif-title';
                favBtnId = 'dispositif-fav-btn';
                break;
            case 'glossaire':
                pageId = 'glossaire-detail';
                contentId = 'glossaire-content';
                titleId = 'glossaire-title';
                favBtnId = 'glossaire-fav-btn';
                break;
            case 'fiche':
                pageId = 'fiche-detail';
                contentId = 'fiche-content';
                titleId = 'fiche-title';
                favBtnId = 'fiche-fav-btn';
                break;
            case 'modele':
                pageId = 'modele-detail';
                contentId = 'modele-content';
                titleId = 'modele-title';
                favBtnId = 'modele-fav-btn';
                break;
        }

        document.getElementById(titleId).textContent = item.title || item.term;
        document.getElementById(contentId).innerHTML = this.renderDetailContent(item, type);

        const favBtn = document.getElementById(favBtnId);
        const isFav = this.isFavorite(type, id);
        favBtn.textContent = isFav ? '★' : '☆';
        favBtn.classList.toggle('active', isFav);

        this.showPage(pageId);

        // Ouvrir la première section par défaut
        setTimeout(() => {
            const container = document.getElementById(contentId);
            const firstHeader = container.querySelector('.section-header');
            const firstBody = container.querySelector('.section-body');
            if (firstHeader && firstBody) {
                firstHeader.classList.add('open');
                firstBody.classList.add('open');
            }
        }, 50);
    },

    renderDetailContent(item, type) {
        if (type === 'glossaire') {
            return this.renderGlossaireDetail(item);
        } else if (type === 'fiche') {
            return this.renderFicheDetail(item);
        } else if (type === 'modele') {
            return this.renderModeleDetail(item);
        } else {
            return this.renderDispositifDetail(item);
        }
    },

    renderDispositifDetail(item) {
        const sections = [];

        if (item.summary) {
            sections.push(`<div class="detail-intro">${item.icon} ${item.summary}</div>`);
        }

        if (item.eligibility) {
            sections.push(this.renderSection('Pour qui ?', this.formatMarkdown(item.eligibility)));
        }

        if (item.steps && item.steps.length > 0) {
            const stepsHtml = `<ol class="step-list">${item.steps.map(s => `<li>${s}</li>`).join('')}</ol>`;
            sections.push(this.renderSection('Démarche pas à pas', stepsHtml));
        }

        if (item.documents && item.documents.length > 0) {
            let docsHtml = `<ul class="checklist">${item.documents.map(d => `<li>${d}</li>`).join('')}</ul>`;
            if (item.documentsAlternatives) {
                docsHtml += `<div class="tip-box">${item.documentsAlternatives}</div>`;
            }
            sections.push(this.renderSection('Pièces demandées', docsHtml));
        }

        if (item.timelines) {
            sections.push(this.renderSection('Délais', `<p>${item.timelines}</p>`));
        }

        if (item.commonRefusals && item.commonRefusals.length > 0) {
            const refusalsHtml = `<ul>${item.commonRefusals.map(r => `<li>${r}</li>`).join('')}</ul>`;
            sections.push(this.renderSection('Refus fréquents', refusalsHtml));
        }

        if (item.whatIfRefused) {
            sections.push(this.renderSection('Que faire si refus / rupture ?', this.formatMarkdown(item.whatIfRefused)));
        }

        if (item.fieldTips && item.fieldTips.length > 0) {
            const tipsHtml = item.fieldTips.map(t => `<div class="tip-box">${t}</div>`).join('');
            sections.push(this.renderSection('Astuces terrain', tipsHtml));
        }

        if (item.relatedIds && item.relatedIds.length > 0) {
            const relatedHtml = this.renderRelatedLinks(item.relatedIds);
            if (relatedHtml) {
                sections.push(this.renderSection('Voir aussi', relatedHtml));
            }
        }

        if (item.sources && item.sources.length > 0) {
            const sourcesHtml = `<div class="sources-list">${item.sources.map(s =>
                `<a href="${s.url}" target="_blank" rel="noopener">${s.label} ↗</a>`
            ).join('')}</div>`;
            sections.push(this.renderSection('Sources', sourcesHtml));
        }

        sections.push(`<div class="update-info">Dernière mise à jour : ${item.updated_at || DATA.updated_at}</div>`);

        return sections.join('');
    },

    renderGlossaireDetail(item) {
        let html = `
            <div class="glossaire-detail-header">
                <div class="glossaire-term" style="font-size: 1.5rem; margin-bottom: 8px;">${item.term}</div>
                <div class="glossaire-expanded" style="font-size: 1.1rem; margin-bottom: 16px;">${item.expanded}</div>
            </div>
            <div class="detail-section">
                <h3>Définition</h3>
                <p>${item.definition_short}</p>
            </div>
        `;

        if (item.definition_field) {
            html += `
                <div class="detail-section">
                    <h3>En pratique</h3>
                    <p>${item.definition_field}</p>
                </div>
            `;
        }

        if (item.relatedIds && item.relatedIds.length > 0) {
            const relatedHtml = this.renderRelatedLinks(item.relatedIds);
            if (relatedHtml) {
                html += `<div class="detail-section"><h3>Contenus liés</h3>${relatedHtml}</div>`;
            }
        }

        return html;
    },

    renderFicheDetail(item) {
        let html = '';

        if (item.context) {
            html += `<div class="fiche-context">${item.context}</div>`;
        }

        if (item.checklist && item.checklist.length > 0) {
            html += `
                <div class="fiche-checklist">
                    <h3>✅ À faire</h3>
                    <ul class="checklist">
                        ${item.checklist.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        if (item.warnings && item.warnings.length > 0) {
            html += `
                <div class="fiche-warnings">
                    <h3>⚠️ Points de vigilance</h3>
                    ${item.warnings.map(w => `<div class="warning-box">${w}</div>`).join('')}
                </div>
            `;
        }

        if (item.relatedIds && item.relatedIds.length > 0) {
            const relatedHtml = this.renderRelatedLinks(item.relatedIds);
            if (relatedHtml) {
                html += `<div class="detail-section"><h3>Ressources liées</h3>${relatedHtml}</div>`;
            }
        }

        html += `<div class="update-info">Mise à jour : ${item.updated_at || DATA.updated_at}</div>`;

        return html;
    },

    renderModeleDetail(item) {
        let html = '';

        if (item.usage) {
            html += `<div class="modele-usage">💡 ${item.usage}</div>`;
        }

        html += `<div class="modele-text">${this.escapeHtml(item.content)}</div>`;

        if (item.relatedIds && item.relatedIds.length > 0) {
            const relatedHtml = this.renderRelatedLinks(item.relatedIds);
            if (relatedHtml) {
                html += `<div class="detail-section" style="margin-top: 16px;"><h3>Voir aussi</h3>${relatedHtml}</div>`;
            }
        }

        return html;
    },

    renderSection(title, content) {
        return `
            <div class="detail-section">
                <div class="section-header">
                    <span>${title}</span>
                    <span class="section-toggle">▼</span>
                </div>
                <div class="section-body">${content}</div>
            </div>
        `;
    },

    renderRelatedLinks(ids) {
        const links = ids.map(id => {
            const item = this.findItemAnywhere(id);
            if (!item) return null;
            return `<a href="#" class="related-link" onclick="app.showDetail('${item.type}', '${item.id}'); return false;">
                ${item.data.icon || '📄'} ${item.data.title || item.data.term}
            </a>`;
        }).filter(Boolean);

        return links.length > 0 ? `<div class="related-links">${links.join('')}</div>` : '';
    },

    findItemAnywhere(id) {
        let item = DATA.dispositifs.find(d => d.id === id);
        if (item) return { type: 'dispositif', id, data: item };

        item = DATA.bancaire.find(d => d.id === id);
        if (item) return { type: 'bancaire', id, data: item };

        item = DATA.glossaire.find(g => g.id === id);
        if (item) return { type: 'glossaire', id, data: item };

        item = DATA.fiches.find(f => f.id === id);
        if (item) return { type: 'fiche', id, data: item };

        item = DATA.modeles.find(m => m.id === id);
        if (item) return { type: 'modele', id, data: item };

        return null;
    },

    getItemById(type, id) {
        switch (type) {
            case 'dispositif':
                return DATA.dispositifs.find(d => d.id === id);
            case 'bancaire':
                return DATA.bancaire.find(d => d.id === id);
            case 'glossaire':
                return DATA.glossaire.find(g => g.id === id);
            case 'fiche':
                return DATA.fiches.find(f => f.id === id);
            case 'modele':
                return DATA.modeles.find(m => m.id === id);
            default:
                return null;
        }
    },

    getTypeName(type) {
        const names = {
            dispositif: 'Droit social',
            bancaire: 'Droit bancaire',
            glossaire: 'Glossaire',
            fiche: 'Fiche réflexe',
            modele: 'Modèle'
        };
        return names[type] || type;
    },

    // ===== FAVORIS =====
    isFavorite(type, id) {
        return this.favorites.some(f => f.type === type && f.id === id);
    },

    toggleFavorite(pageType) {
        if (!this.currentItem) return;

        const type = this.currentItemType;
        const id = this.currentItem.id;
        const index = this.favorites.findIndex(f => f.type === type && f.id === id);

        if (index >= 0) {
            this.favorites.splice(index, 1);
            this.showToast('Retiré des favoris');
        } else {
            this.favorites.push({ type, id, addedAt: new Date().toISOString() });
            this.showToast('Ajouté aux favoris');
        }

        this.saveToStorage();
        this.updateFavoriteBadge();

        const favBtn = document.getElementById(pageType + '-fav-btn');
        if (favBtn) {
            const isFav = this.isFavorite(type, id);
            favBtn.textContent = isFav ? '★' : '☆';
            favBtn.classList.toggle('active', isFav);
        }
    },

    renderFavoris() {
        const container = document.getElementById('favoris-list');

        if (this.favorites.length === 0) {
            container.innerHTML = '<p class="empty-state">Aucun favori pour l\'instant.<br>Appuyez sur ⭐ pour ajouter un contenu.</p>';
            return;
        }

        container.innerHTML = this.favorites.map(fav => {
            const item = this.getItemById(fav.type, fav.id);
            if (!item) return '';
            return `
                <div class="card-item" onclick="app.showDetail('${fav.type}', '${fav.id}')">
                    <span class="card-icon">${item.icon || '📄'}</span>
                    <div class="card-content">
                        <div class="card-title">${item.title || item.term}</div>
                        <div class="card-subtitle">${this.getTypeName(fav.type)}</div>
                    </div>
                    <span class="card-arrow">›</span>
                </div>
            `;
        }).join('');

        this.renderNotes();
    },

    renderNotes() {
        const container = document.getElementById('notes-list');

        if (this.notes.length === 0) {
            container.innerHTML = '<p class="empty-state">Aucune note pour l\'instant.</p>';
            return;
        }

        container.innerHTML = this.notes.map((note, index) => {
            const item = this.getItemById(note.itemType, note.itemId);
            return `
                <div class="card-item">
                    <span class="card-icon">📝</span>
                    <div class="card-content">
                        <div class="card-title">${item ? (item.title || item.term) : 'Note'}</div>
                        <div class="card-subtitle">${note.text.substring(0, 100)}${note.text.length > 100 ? '...' : ''}</div>
                    </div>
                    <button class="card-arrow" onclick="event.stopPropagation(); app.deleteNote(${index});">🗑️</button>
                </div>
            `;
        }).join('');
    },

    // ===== NOTES =====
    showNoteModal() {
        const modal = document.getElementById('note-modal');
        const textarea = document.getElementById('note-textarea');

        // Charger une note existante si présente
        const existingNote = this.notes.find(n =>
            n.itemType === this.currentItemType && n.itemId === this.currentItem.id
        );
        textarea.value = existingNote ? existingNote.text : '';

        modal.hidden = false;
    },

    closeNoteModal() {
        document.getElementById('note-modal').hidden = true;
    },

    saveNote() {
        const textarea = document.getElementById('note-textarea');
        const text = textarea.value.trim();

        if (!text) {
            this.closeNoteModal();
            return;
        }

        const existingIndex = this.notes.findIndex(n =>
            n.itemType === this.currentItemType && n.itemId === this.currentItem.id
        );

        if (existingIndex >= 0) {
            this.notes[existingIndex].text = text;
            this.notes[existingIndex].updatedAt = new Date().toISOString();
        } else {
            this.notes.push({
                itemType: this.currentItemType,
                itemId: this.currentItem.id,
                text,
                createdAt: new Date().toISOString()
            });
        }

        this.saveToStorage();
        this.closeNoteModal();
        this.showToast('Note enregistrée');
    },

    deleteNote(index) {
        if (confirm('Supprimer cette note ?')) {
            this.notes.splice(index, 1);
            this.saveToStorage();
            this.renderNotes();
            this.showToast('Note supprimée');
        }
    },

    // ===== RÉCENTS =====
    addToRecent(type, id) {
        // Retirer si déjà présent
        this.recent = this.recent.filter(r => !(r.type === type && r.id === id));
        // Ajouter en tête
        this.recent.unshift({ type, id, viewedAt: new Date().toISOString() });
        // Garder les 20 derniers
        this.recent = this.recent.slice(0, 20);
        this.saveToStorage();
    },

    // ===== COPIE =====
    copyChecklist() {
        if (!this.currentItem) return;

        let text = '';

        if (this.currentItemType === 'fiche' && this.currentItem.checklist) {
            text = this.currentItem.title + '\n\n';
            text += this.currentItem.checklist.map(c => '☐ ' + c).join('\n');
        } else if (this.currentItem.steps) {
            text = this.currentItem.title + ' - Démarche\n\n';
            text += this.currentItem.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
            if (this.currentItem.documents) {
                text += '\n\nPièces à fournir :\n';
                text += this.currentItem.documents.map(d => '☐ ' + d).join('\n');
            }
        }

        this.copyToClipboard(text);
    },

    copyModele() {
        if (!this.currentItem || !this.currentItem.content) return;
        this.copyToClipboard(this.currentItem.content);
    },

    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => this.showToast('Copié dans le presse-papier'))
                .catch(() => this.fallbackCopy(text));
        } else {
            this.fallbackCopy(text);
        }
    },

    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            this.showToast('Copié dans le presse-papier');
        } catch (e) {
            this.showToast('Erreur de copie', 'error');
        }
        document.body.removeChild(textarea);
    },

    // ===== PARAMÈTRES =====
    clearFavorites() {
        if (confirm('Supprimer tous les favoris ?')) {
            this.favorites = [];
            this.saveToStorage();
            this.updateFavoriteBadge();
            this.showToast('Favoris effacés');
        }
    },

    clearNotes() {
        if (confirm('Supprimer toutes les notes ?')) {
            this.notes = [];
            this.saveToStorage();
            this.showToast('Notes effacées');
        }
    },

    forceSync() {
        this.showToast('Synchronisation effectuée');
        document.getElementById('last-sync').textContent = this.formatDate(new Date().toISOString());
    },

    updateContent() {
        this.showToast('Contenu à jour');
        document.getElementById('update-badge').hidden = true;
    },

    // ===== UTILITAIRES =====
    formatMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n- /g, '</p><ul><li>')
            .replace(/\n(\d+)\. /g, '</p><ol><li>')
            .replace(/<\/li>\n- /g, '</li><li>')
            .replace(/<\/li>\n\d+\. /g, '</li><li>')
            .replace(/<li>([^<]+)(?=<\/p>|$)/g, '<li>$1</li></ul>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    formatDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    // ===== MES SUIVIS =====
    renderMesSuivis() {
        // Mettre à jour l'affichage du profil
        const nameEl = document.getElementById('current-ts-name');
        if (this.currentTs) {
            nameEl.textContent = this.currentTs;
            document.getElementById('no-profile-message').hidden = true;
            document.getElementById('suivis-container').hidden = false;
            this.renderSuivisList();
        } else {
            nameEl.textContent = 'Choisir';
            document.getElementById('no-profile-message').hidden = false;
            document.getElementById('suivis-container').hidden = true;
        }
    },

    renderSuivisList() {
        if (!this.currentTs) return;

        const suivis = HEBERGEES.getByTS(this.currentTs);
        const filtered = this.suivisFilter === 'all'
            ? suivis
            : suivis.filter(s => s.type === this.suivisFilter);

        // Stats
        const femmesIsolees = suivis.filter(s => s.type === 'femme_isolee').length;
        const familles = suivis.filter(s => s.type === 'famille').length;
        const alertes = suivis.filter(s => this.getPersonAlerts(s).length > 0).length;

        document.getElementById('suivis-stats').innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${suivis.length}</div>
                <div class="stat-label">Total suivis</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${femmesIsolees}</div>
                <div class="stat-label">Femmes isolées</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${familles}</div>
                <div class="stat-label">Familles</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: ${alertes > 0 ? 'var(--danger)' : 'var(--success)'}">${alertes}</div>
                <div class="stat-label">Alertes</div>
            </div>
        `;

        // Liste des suivis
        const listEl = document.getElementById('suivis-list');
        if (filtered.length === 0) {
            listEl.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 20px;">Aucun suivi dans cette catégorie</p>';
            return;
        }

        listEl.innerHTML = filtered.map(person => {
            const alerts = this.getPersonAlerts(person);
            const isFamille = person.type === 'famille';
            const nbEnfants = person.enfants ? person.enfants.length : 0;

            return `
                <div class="suivi-card" onclick="app.showSuiviDetail('${person.id}')">
                    <div class="suivi-card-avatar ${isFamille ? 'famille' : ''}">
                        ${isFamille ? '👨‍👩‍👧' : '👤'}
                    </div>
                    <div class="suivi-card-content">
                        <div class="suivi-card-name">${person.prenom} ${person.nom}</div>
                        <div class="suivi-card-info">
                            Chambre ${person.chambre}${isFamille ? ` • ${nbEnfants} enfant${nbEnfants > 1 ? 's' : ''}` : ''}
                        </div>
                        <div class="suivi-card-badges">
                            ${alerts.map(a => `<span class="suivi-badge ${a.type}">${a.label}</span>`).join('')}
                            ${person.emploi === 'CDI' ? '<span class="suivi-badge success">CDI</span>' : ''}
                            ${person.emploi === 'CDD' || person.emploi === 'Temps partiel' ? '<span class="suivi-badge info">' + person.emploi + '</span>' : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    getPersonAlerts(person) {
        const alerts = [];

        // Situation irrégulière
        if (person.statut === 'Irrégulière') {
            alerts.push({ type: 'alert', label: 'Situation irrégulière' });
        }

        // Pas de couverture santé
        if (person.assuranceMaladie === 'Aucune') {
            alerts.push({ type: 'alert', label: 'Sans couverture santé' });
        }

        // Pas de compte bancaire
        if (person.compteBancaire === 'Non') {
            alerts.push({ type: 'warning', label: 'Sans compte bancaire' });
        }

        // Sans emploi
        if (person.emploi === 'Sans' || person.emploi === 'En recherche') {
            alerts.push({ type: 'warning', label: person.emploi === 'Sans' ? 'Sans emploi' : 'En recherche' });
        }

        return alerts;
    },

    filterSuivis(filter) {
        this.suivisFilter = filter;

        // Mettre à jour les chips
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.filter === filter);
        });

        this.renderSuivisList();
    },

    showSuiviDetail(personId) {
        const person = HEBERGEES.getById(personId);
        if (!person) return;

        this.currentSuivi = person;
        this.showPage('suivi-detail', true);
    },

    renderSuiviDetail() {
        const person = this.currentSuivi;
        if (!person) return;

        const isFamille = person.type === 'famille';

        // Titre
        document.getElementById('suivi-title').textContent = 'Fiche suivi';

        // Identité
        document.getElementById('suivi-avatar').textContent = isFamille ? '👨‍👩‍👧' : '👤';
        document.getElementById('suivi-avatar').className = 'suivi-avatar' + (isFamille ? ' famille' : '');
        document.getElementById('suivi-fullname').textContent = `${person.prenom} ${person.nom}`;
        document.getElementById('suivi-chambre').textContent = `Chambre ${person.chambre} • ${isFamille ? 'Famille' : 'Femme isolée'}`;

        // Alertes
        const alerts = this.getPersonAlerts(person);
        const alertsEl = document.getElementById('suivi-alerts');
        if (alerts.length > 0) {
            alertsEl.innerHTML = alerts.map(a => `
                <div class="suivi-alert ${a.type === 'alert' ? 'danger' : 'warning'}">
                    <span class="suivi-alert-icon">${a.type === 'alert' ? '⚠️' : '⚡'}</span>
                    ${a.label}
                </div>
            `).join('');
        } else {
            alertsEl.innerHTML = '';
        }

        // Infos générales
        document.getElementById('suivi-info-grid').innerHTML = `
            <div class="info-item">
                <span class="info-label">Âge</span>
                <span class="info-value">${person.age} ans</span>
            </div>
            <div class="info-item">
                <span class="info-label">Nationalité</span>
                <span class="info-value">${person.nationalite}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Téléphone</span>
                <span class="info-value">${person.telephone || 'Non renseigné'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Date d'arrivée</span>
                <span class="info-value">${this.formatDate(person.dateArrivee)}</span>
            </div>
        `;

        // Situation administrative
        const statutClass = person.statut === 'Irrégulière' ? 'alert' : (person.statut === 'Demandeur d\'asile' ? 'warning' : '');
        const santeClass = person.assuranceMaladie === 'Aucune' ? 'alert' : '';
        const compteClass = person.compteBancaire === 'Non' ? 'warning' : 'success';
        const emploiClass = person.emploi === 'Sans' ? 'alert' : (person.emploi === 'En recherche' ? 'warning' : (person.emploi === 'CDI' ? 'success' : ''));

        document.getElementById('suivi-admin-grid').innerHTML = `
            <div class="info-item">
                <span class="info-label">Statut séjour</span>
                <span class="info-value ${statutClass}">${person.statut}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Couverture santé</span>
                <span class="info-value ${santeClass}">${person.assuranceMaladie}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Compte bancaire</span>
                <span class="info-value ${compteClass}">${person.compteBancaire}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Emploi</span>
                <span class="info-value ${emploiClass}">${person.emploi}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Aide alimentaire</span>
                <span class="info-value">${person.aideAlimentaire}${person.montantAide > 0 ? ` (${person.montantAide}€)` : ''}</span>
            </div>
        `;

        // Enfants
        const enfantsSection = document.getElementById('suivi-enfants-section');
        if (isFamille && person.enfants && person.enfants.length > 0) {
            enfantsSection.hidden = false;
            document.getElementById('suivi-enfants-list').innerHTML = person.enfants.map(enfant => `
                <div class="enfant-card">
                    <div class="enfant-avatar">👶</div>
                    <div class="enfant-info">
                        <div class="enfant-name">${enfant.prenom}</div>
                        <div class="enfant-details">${enfant.age} ans${enfant.classe ? ` • ${enfant.classe}` : ''}</div>
                    </div>
                </div>
            `).join('');
        } else {
            enfantsSection.hidden = true;
        }

        // Démarches recommandées
        this.renderRecommendedDemarches(person);
    },

    renderRecommendedDemarches(person) {
        const demarches = [];

        // Selon le statut
        if (person.statut === 'Irrégulière') {
            if (person.assuranceMaladie === 'Aucune') {
                demarches.push({
                    id: 'ame',
                    icon: '🏥',
                    title: 'AME',
                    reason: 'Couverture santé pour situation irrégulière'
                });
            }
            demarches.push({
                id: 'domiciliation',
                icon: '📬',
                title: 'Domiciliation',
                reason: 'Nécessaire pour les démarches administratives'
            });
        } else if (person.statut === 'Demandeur d\'asile') {
            if (person.assuranceMaladie !== 'CSS' && person.assuranceMaladie !== 'PUMA') {
                demarches.push({
                    id: 'puma',
                    icon: '🏥',
                    title: 'PUMA + CSS',
                    reason: 'Couverture santé complète'
                });
            }
        } else {
            // Situation régulière
            if (person.assuranceMaladie === 'Aucune') {
                demarches.push({
                    id: 'css',
                    icon: '🏥',
                    title: 'CSS',
                    reason: 'Complémentaire santé solidaire'
                });
            }

            if (person.emploi === 'Sans' || person.emploi === 'En recherche') {
                demarches.push({
                    id: 'rsa',
                    icon: '💰',
                    title: 'RSA',
                    reason: 'Revenu minimum si sans ressources'
                });
            }

            if (person.emploi === 'CDD' || person.emploi === 'Temps partiel') {
                demarches.push({
                    id: 'prime-activite',
                    icon: '💼',
                    title: 'Prime d\'activité',
                    reason: 'Complément de revenus pour travailleurs modestes'
                });
            }
        }

        // Compte bancaire
        if (person.compteBancaire === 'Non') {
            demarches.push({
                id: 'droit-au-compte',
                icon: '🏦',
                title: 'Compte bancaire',
                reason: 'Nécessaire pour recevoir les prestations'
            });
        }

        // Famille avec enfants
        if (person.type === 'famille' && person.enfants) {
            const hasYoungChild = person.enfants.some(e => e.age < 3);
            if (hasYoungChild) {
                demarches.push({
                    id: 'paje',
                    icon: '👶',
                    title: 'PAJE',
                    reason: 'Allocations pour enfant de moins de 3 ans'
                });
            }
            if (person.enfants.length >= 2) {
                demarches.push({
                    id: 'allocations-familiales',
                    icon: '👨‍👩‍👧‍👦',
                    title: 'Allocations familiales',
                    reason: 'Allocations à partir de 2 enfants'
                });
            }
        }

        const container = document.getElementById('suivi-demarches');
        if (demarches.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Aucune démarche urgente identifiée</p>';
            return;
        }

        container.innerHTML = demarches.map(d => `
            <div class="demarche-card" onclick="app.showDetail('dispositif', '${d.id}')">
                <span class="demarche-icon">${d.icon}</span>
                <div class="demarche-content">
                    <div class="demarche-title">${d.title}</div>
                    <div class="demarche-reason">${d.reason}</div>
                </div>
                <span class="demarche-arrow">→</span>
            </div>
        `).join('');
    },

    callPerson() {
        if (!this.currentSuivi || !this.currentSuivi.telephone) {
            this.showToast('Numéro de téléphone non disponible', 'error');
            return;
        }
        window.location.href = 'tel:' + this.currentSuivi.telephone.replace(/\s/g, '');
    },

    startAssistantForPerson() {
        if (!this.currentSuivi) return;

        // Pré-remplir l'assistant avec le profil de la personne
        this.assistant.selectedPerson = this.currentSuivi;

        // Réinitialiser l'assistant
        this.assistant.currentQuestion = 'start';
        this.assistant.history = [];
        this.assistant.answers = {};

        // Aller à la page assistant
        this.showPage('assistant', true);
    },

    // ===== MODAL PROFIL =====
    showProfileModal() {
        const modal = document.getElementById('profile-modal');
        modal.hidden = false;

        const listEl = document.getElementById('profile-list');
        listEl.innerHTML = HEBERGEES.ts.map(ts => {
            const count = HEBERGEES.getByTS(ts).length;
            const isSelected = this.currentTs === ts;
            return `
                <div class="profile-option ${isSelected ? 'selected' : ''}" onclick="app.selectProfile('${ts}')">
                    <div class="profile-option-avatar">${ts.charAt(0)}</div>
                    <span class="profile-option-name">${ts}</span>
                    <span class="profile-option-count">${count} suivi${count > 1 ? 's' : ''}</span>
                </div>
            `;
        }).join('');
    },

    closeProfileModal() {
        document.getElementById('profile-modal').hidden = true;
    },

    selectProfile(tsName) {
        this.currentTs = tsName;
        this.saveToStorage();
        this.closeProfileModal();

        // Si on est sur la page suivis, rafraîchir
        if (this.currentPage === 'mes-suivis') {
            this.renderMesSuivis();
        }

        this.showToast(`Profil "${tsName}" sélectionné`);
    },

    // ===== ASSISTANT SITUATION =====
    initAssistant() {
        // Réinitialiser l'état si on revient sur la page
        if (this.assistant.currentQuestion === 'start' && this.assistant.history.length === 0) {
            this.resetAssistant();
        } else {
            // Sinon afficher la question courante ou les résultats
            if (this.assistant.currentQuestion.startsWith('result_')) {
                this.showAssistantResults(this.assistant.currentQuestion);
            } else {
                this.showAssistantQuestion(this.assistant.currentQuestion);
            }
        }
    },

    resetAssistant() {
        this.assistant = {
            currentQuestion: 'start',
            history: [],
            answers: {},
            selectedPerson: null
        };

        // Afficher la zone de question, masquer les résultats
        document.getElementById('assistant-question-area').hidden = false;
        document.getElementById('assistant-results').hidden = true;

        // Afficher la première question
        this.showAssistantQuestion('start');
    },

    showAssistantQuestion(questionId) {
        const question = DECISION_TREE.questions[questionId];
        if (!question) {
            console.error('Question non trouvée:', questionId);
            return;
        }

        this.assistant.currentQuestion = questionId;

        // Mettre à jour la progression
        const progress = Math.min(100, (this.assistant.history.length / 5) * 100);
        document.getElementById('progress-fill').style.width = progress + '%';
        document.getElementById('progress-text').textContent = `Question ${this.assistant.history.length + 1}`;

        // Afficher la question
        document.getElementById('question-icon').textContent = question.icon || '🤔';
        document.getElementById('question-text').textContent = question.text;
        document.getElementById('question-hint').textContent = question.hint || '';

        // Afficher les réponses
        const answersContainer = document.getElementById('answers-list');
        answersContainer.innerHTML = question.answers.map(answer => `
            <button class="answer-btn" onclick="app.selectAssistantAnswer('${answer.value}', '${answer.next}')">
                ${answer.label}
            </button>
        `).join('');

        // Bouton précédent
        const backBtn = document.getElementById('assistant-back-btn');
        backBtn.disabled = this.assistant.history.length === 0;

        // S'assurer que la zone question est visible
        document.getElementById('assistant-question-area').hidden = false;
        document.getElementById('assistant-results').hidden = true;
    },

    selectAssistantAnswer(value, nextId) {
        // Sauvegarder la réponse
        this.assistant.answers[this.assistant.currentQuestion] = value;
        this.assistant.history.push({
            questionId: this.assistant.currentQuestion,
            answer: value,
            nextId: nextId
        });

        // Aller à la question suivante ou aux résultats
        if (nextId.startsWith('result_')) {
            this.showAssistantResults(nextId);
        } else {
            this.showAssistantQuestion(nextId);
        }
    },

    assistantGoBack() {
        if (this.assistant.history.length === 0) return;

        // Retirer la dernière réponse
        const lastEntry = this.assistant.history.pop();
        delete this.assistant.answers[lastEntry.questionId];

        // Revenir à la question précédente
        this.showAssistantQuestion(lastEntry.questionId);
    },

    showAssistantResults(resultId) {
        const result = DECISION_TREE.results[resultId];
        if (!result) {
            console.error('Résultat non trouvé:', resultId);
            return;
        }

        this.assistant.currentQuestion = resultId;

        // Masquer les questions, afficher les résultats
        document.getElementById('assistant-question-area').hidden = true;
        document.getElementById('assistant-results').hidden = false;

        // Mettre à jour la progression à 100%
        document.getElementById('progress-fill').style.width = '100%';
        document.getElementById('progress-text').textContent = 'Terminé';

        // Afficher le résumé de situation
        this.renderSituationSummary();

        // Afficher les recommandations
        this.renderRecommendations(result);
    },

    renderSituationSummary() {
        const container = document.getElementById('situation-summary');
        const tags = [];

        // Extraire les informations pertinentes des réponses
        for (const [questionId, answer] of Object.entries(this.assistant.answers)) {
            const question = DECISION_TREE.questions[questionId];
            if (question) {
                const answerObj = question.answers.find(a => a.value === answer);
                if (answerObj) {
                    tags.push(answerObj.label);
                }
            }
        }

        container.innerHTML = `
            <h3>📋 Situation identifiée</h3>
            <div class="situation-tags">
                ${tags.map(tag => `<span class="situation-tag">${tag}</span>`).join('')}
            </div>
        `;
    },

    renderRecommendations(result) {
        const container = document.getElementById('recommended-list');

        // Nettoyer les éléments précédents
        const oldTips = document.querySelector('.results-tips');
        const oldFiches = document.querySelector('.related-fiches');
        if (oldTips) oldTips.remove();
        if (oldFiches) oldFiches.remove();

        let html = '';

        // En-tête du résultat
        html += `
            <div class="recommendation-card priority-high" style="border-left-color: var(--primary);">
                <div class="recommendation-header">
                    <span class="recommendation-icon">${result.icon}</span>
                    <span class="recommendation-title">${result.title}</span>
                </div>
                <p class="recommendation-note">${result.summary}</p>
            </div>
        `;

        // Dispositifs recommandés
        if (result.recommendations && result.recommendations.length > 0) {
            result.recommendations.forEach(rec => {
                const item = this.findItemAnywhere(rec.id);
                const icon = item ? item.data.icon : '📄';
                const title = item ? (item.data.title || item.data.term) : rec.id;

                html += `
                    <div class="recommendation-card priority-${rec.priority}" onclick="app.showDetail('${item ? item.type : 'dispositif'}', '${rec.id}')">
                        <div class="recommendation-header">
                            <span class="recommendation-icon">${icon}</span>
                            <span class="recommendation-title">${title}</span>
                            <span class="recommendation-priority">${rec.priority === 'high' ? 'Prioritaire' : 'Recommandé'}</span>
                        </div>
                        <p class="recommendation-note">${rec.note}</p>
                    </div>
                `;
            });
        }

        container.innerHTML = html;

        // Afficher les conseils
        if (result.tips && result.tips.length > 0) {
            const tipsHtml = `
                <div class="results-tips">
                    <h4>💡 Conseils pratiques</h4>
                    <ul>
                        ${result.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            `;
            container.insertAdjacentHTML('afterend', tipsHtml);
        }

        // Afficher les fiches liées
        if (result.relatedFiches && result.relatedFiches.length > 0) {
            const fichesHtml = `
                <div class="related-fiches">
                    <h4>📋 Fiches réflexes associées</h4>
                    ${result.relatedFiches.map(ficheId => {
                        const fiche = DATA.fiches.find(f => f.id === ficheId);
                        if (!fiche) return '';
                        return `
                            <button class="related-fiche-btn" onclick="app.showDetail('fiche', '${ficheId}')">
                                ${fiche.icon} ${fiche.title}
                            </button>
                        `;
                    }).join('')}
                </div>
            `;
            // Insérer après les tips ou après le container
            const tipsEl = document.querySelector('.results-tips');
            if (tipsEl) {
                tipsEl.insertAdjacentHTML('afterend', fichesHtml);
            } else {
                container.insertAdjacentHTML('afterend', fichesHtml);
            }
        }
    },

    copyAssistantResults() {
        const result = DECISION_TREE.results[this.assistant.currentQuestion];
        if (!result) return;

        let text = `=== ÉVALUATION TS COMPAGNON ===\n\n`;
        text += `📋 Situation : ${result.title}\n`;
        text += `${result.summary}\n\n`;

        // Réponses données
        text += `--- Parcours ---\n`;
        for (const entry of this.assistant.history) {
            const question = DECISION_TREE.questions[entry.questionId];
            if (question) {
                const answer = question.answers.find(a => a.value === entry.answer);
                text += `• ${question.text}\n  → ${answer ? answer.label : entry.answer}\n`;
            }
        }

        text += `\n--- Recommandations ---\n`;
        if (result.recommendations) {
            result.recommendations.forEach(rec => {
                const priority = rec.priority === 'high' ? '★' : '○';
                text += `${priority} ${rec.note}\n`;
            });
        }

        if (result.tips && result.tips.length > 0) {
            text += `\n--- Conseils ---\n`;
            result.tips.forEach(tip => {
                text += `→ ${tip}\n`;
            });
        }

        text += `\n---\nGénéré par TS Compagnon le ${new Date().toLocaleDateString('fr-FR')}`;

        this.copyToClipboard(text);
    }
};

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => app.init());
