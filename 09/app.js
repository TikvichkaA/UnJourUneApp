// Application principale - Liens d'Intérêt des Politiciens

class App {
    constructor() {
        this.graph = null;
        this.currentFilters = {
            parties: [],
            linkTypes: ['commission', 'vote', 'company', 'personal'],
            commissionType: null,  // null = toutes, 'permanente', 'enquête'
            maxPoliticians: 100
        };
        this.detailPanel = document.getElementById('detail-panel');
        this.panelContent = document.getElementById('panel-content');
        this.tooltip = document.getElementById('tooltip');
        this.politiciansCache = [];

        this.init();
    }

    async init() {
        // Initialiser le graphe
        this.graph = new GraphVisualization('graph');
        this.graph.onNodeClick = (node) => this.showNodeDetail(node);
        this.graph.onNodeHover = (node, event) => this.handleTooltip(node, event);

        // Charger les partis et initialiser les filtres
        await this.initPartyFilters();

        // Charger les données initiales
        await this.loadGraphData();

        // Événements
        this.bindEvents();
    }

    async initPartyFilters() {
        const container = document.getElementById('party-filters');
        let parties;

        if (USE_SUPABASE) {
            const partyData = await dataService.getParties();
            parties = partyData.map(p => ({ name: p.name, color: p.color }));
        } else {
            parties = getUniqueParties().map(name => ({
                name,
                color: getPartyColor(name)
            }));
        }

        this.currentFilters.parties = parties.map(p => p.name);

        container.innerHTML = parties.map(party => `
            <label class="filter-checkbox">
                <input type="checkbox" value="${party.name}" checked>
                <span class="checkmark"></span>
                <span class="filter-label">${party.name}</span>
                <span class="filter-color" style="background: ${party.color}"></span>
            </label>
        `).join('');

        container.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => this.updateFilters());
        });
    }

    async loadGraphData() {
        let data;

        if (USE_SUPABASE) {
            data = await dataService.getGraphData(this.currentFilters);
            this.politiciansCache = await dataService.getPoliticians();
        } else {
            data = generateGraphData(this.currentFilters);
            this.politiciansCache = DATA.politicians;
        }

        this.graph.setData(data);
    }

    bindEvents() {
        document.getElementById('close-panel').addEventListener('click', () => {
            this.closeDetailPanel();
        });

        document.getElementById('zoom-in').addEventListener('click', () => {
            this.graph.zoomIn();
        });

        document.getElementById('zoom-out').addEventListener('click', () => {
            this.graph.zoomOut();
        });

        document.getElementById('zoom-reset').addEventListener('click', () => {
            this.graph.resetView();
        });

        document.getElementById('reset-view').addEventListener('click', () => {
            this.resetAll();
        });

        document.querySelectorAll('#link-filters input').forEach(input => {
            input.addEventListener('change', () => this.updateFilters());
        });

        // Filtre type de commission
        document.querySelectorAll('#commission-type-filter input').forEach(input => {
            input.addEventListener('change', () => this.updateFilters());
        });

        // Limite nombre de politiciens
        document.getElementById('max-politicians').addEventListener('change', () => {
            this.updateFilters();
        });

        // Recherche
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');

        searchInput.addEventListener('input', async (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query.length < 2) {
                searchResults.classList.remove('active');
                return;
            }

            const matches = this.politiciansCache.filter(p =>
                (p.name || p.full_name || '').toLowerCase().includes(query)
            ).slice(0, 5);

            if (matches.length > 0) {
                searchResults.innerHTML = matches.map(p => {
                    const name = p.name || p.full_name;
                    const color = p.partyColor || getPartyColor(p.party);
                    return `
                        <div class="search-result-item" data-id="${p.id}">
                            <span class="party-badge" style="background: ${color}"></span>
                            <span>${name}</span>
                        </div>
                    `;
                }).join('');

                searchResults.classList.add('active');

                searchResults.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', async () => {
                        const id = item.dataset.id;
                        this.graph.focusOnNode(id);
                        await this.showPoliticianDetailById(id);
                        searchResults.classList.remove('active');
                        searchInput.value = '';
                    });
                });
            } else {
                searchResults.classList.remove('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.classList.remove('active');
            }
        });

        document.getElementById('graph').addEventListener('click', (e) => {
            if (e.target.tagName === 'svg') {
                this.closeDetailPanel();
            }
        });
    }

    async updateFilters() {
        const partyInputs = document.querySelectorAll('#party-filters input:checked');
        this.currentFilters.parties = Array.from(partyInputs).map(i => i.value);

        const linkInputs = document.querySelectorAll('#link-filters input:checked');
        this.currentFilters.linkTypes = Array.from(linkInputs).map(i => i.value);

        // Type de commission
        const commissionTypeInput = document.querySelector('#commission-type-filter input:checked');
        this.currentFilters.commissionType = commissionTypeInput?.value || null;

        // Limite politiciens
        const maxPolSelect = document.getElementById('max-politicians');
        this.currentFilters.maxPoliticians = parseInt(maxPolSelect.value) || 0;

        await this.loadGraphData();
    }

    async resetAll() {
        document.querySelectorAll('#party-filters input, #link-filters input').forEach(input => {
            input.checked = true;
        });

        // Réinitialiser le filtre type de commission
        const allCommissionsRadio = document.querySelector('#commission-type-filter input[value=""]');
        if (allCommissionsRadio) allCommissionsRadio.checked = true;

        // Réinitialiser le nombre de politiciens
        document.getElementById('max-politicians').value = '100';

        const parties = USE_SUPABASE
            ? (await dataService.getParties()).map(p => p.name)
            : getUniqueParties();

        this.currentFilters = {
            parties: parties,
            linkTypes: ['commission', 'vote', 'company', 'personal'],
            commissionType: null,
            maxPoliticians: 100
        };

        await this.loadGraphData();
        this.graph.resetView();
        this.closeDetailPanel();
    }

    async showNodeDetail(node) {
        if (node.type === 'politician') {
            await this.showPoliticianDetailById(node.id);
        } else if (node.type === 'commission') {
            await this.showCommissionDetail(node);
        } else if (node.type === 'company') {
            await this.showCompanyDetail(node);
        } else if (node.type === 'vote') {
            await this.showVoteDetail(node);
        }
    }

    async showPoliticianDetailById(id) {
        let pol, commissions, votes, companies, relationships;

        if (USE_SUPABASE) {
            pol = await dataService.getPoliticianById(id);
            commissions = await dataService.getPoliticianCommissions(id);
            votes = await dataService.getPoliticianVotes(id);
            companies = await dataService.getPoliticianCompanies(id);
            relationships = await dataService.getPoliticianRelationships(id);
        } else {
            pol = getPoliticianById(id);
            if (!pol) return;
            commissions = pol.commissions?.map(cid => getCommissionById(cid)).filter(Boolean) || [];
            votes = pol.votes?.map(vid => {
                const v = getVoteById(vid);
                return v ? { ...v, position: v.results[id] } : null;
            }).filter(Boolean) || [];
            companies = pol.companies?.map(cid => getCompanyById(cid)).filter(Boolean) || [];
            relationships = pol.personalLinks?.map(link => {
                const target = getPoliticianById(link.targetId);
                return target ? { ...target, relation: link.relation } : null;
            }).filter(Boolean) || [];
        }

        if (!pol) return;

        const partyColor = pol.partyColor || getPartyColor(pol.party);

        this.panelContent.innerHTML = `
            <div class="panel-header">
                <div class="panel-avatar" style="background: ${partyColor}">${pol.initials}</div>
                <h2 class="panel-name">${pol.name}</h2>
                <p class="panel-role">${pol.role || ''}</p>
                <span class="panel-party" style="background: ${partyColor}20; color: ${partyColor}">${pol.party}</span>
            </div>

            ${this.createAccordionSection('commission', 'Commissions', commissions, (com) => `
                <div class="list-item">
                    <div class="list-item-icon commission">🏛️</div>
                    <div class="list-item-content">
                        <div class="list-item-title">${com.short_name || com.name}</div>
                        <div class="list-item-subtitle">${com.memberRole || 'Membre'}</div>
                    </div>
                </div>
            `)}

            ${this.createAccordionSection('vote', 'Votes Récents', votes, (vote) => {
                const tagClass = vote.position === 'pour' ? 'tag-for' : vote.position === 'contre' ? 'tag-against' : 'tag-abstain';
                const resultLabel = vote.position === 'pour' ? 'Pour' : vote.position === 'contre' ? 'Contre' : 'Abstention';
                const voteTitle = typeof formatVoteTitle === 'function' ? formatVoteTitle(vote.title) : (vote.title || '').substring(0, 60);
                const sourceLink = vote.source_url ? `<a href="${vote.source_url}" target="_blank" class="vote-link" title="Voir sur assemblee-nationale.fr">🔗</a>` : '';
                return `
                    <div class="list-item">
                        <div class="list-item-icon vote">🗳️</div>
                        <div class="list-item-content">
                            <div class="list-item-title">${voteTitle} ${sourceLink}</div>
                            <div class="list-item-subtitle">${this.formatDate(vote.vote_date || vote.date)}</div>
                        </div>
                        <span class="list-item-tag ${tagClass}">${resultLabel}</span>
                    </div>
                `;
            })}

            ${this.createAccordionSection('company', 'Participations', companies, (ent) => `
                <div class="list-item">
                    <div class="list-item-icon company">💼</div>
                    <div class="list-item-content">
                        <div class="list-item-title">${ent.name}</div>
                        <div class="list-item-subtitle">${ent.sector || ''} - ${ent.companyRole || ent.role || ''}</div>
                    </div>
                </div>
            `)}

            ${this.createAccordionSection('personal', 'Liens Personnels', relationships, (link) => `
                <div class="list-item" style="cursor: pointer" data-pol-id="${link.id}">
                    <div class="list-item-icon personal">👤</div>
                    <div class="list-item-content">
                        <div class="list-item-title">${link.name}</div>
                        <div class="list-item-subtitle">${link.relation}</div>
                    </div>
                </div>
            `)}

            <button class="btn-focus" data-id="${pol.id}">Voir uniquement ses connexions</button>
        `;

        this.bindPanelEvents(pol.id);
        this.openDetailPanel();
    }

    async showCommissionDetail(com) {
        let members;
        let votes = [];

        if (USE_SUPABASE) {
            const data = await dataService.client.query('politician_commissions', {
                select: 'role,politicians(id,full_name,parties(name,color))',
                filter: { commission_id: `eq.${com.id}` }
            });
            members = data.map(d => ({
                id: d.politicians.id,
                name: d.politicians.full_name,
                party: d.politicians.parties?.name,
                partyColor: d.politicians.parties?.color,
                initials: d.politicians.full_name?.split(' ').map(w => w[0]).join('').substring(0, 2),
                role: d.role
            }));

            // Récupérer les votes des membres
            votes = await dataService.getCommissionVotes(com.id, 15);
        } else {
            members = DATA.politicians.filter(p => p.commissions?.includes(com.id));
        }

        this.panelContent.innerHTML = `
            <div class="panel-header">
                <div class="panel-avatar" style="background: #22d3ee">🏛️</div>
                <h2 class="panel-name">${com.name}</h2>
                <p class="panel-role">${com.description || com.type || 'Commission parlementaire'}</p>
            </div>

            <div class="accordion-section">
                <div class="accordion-header active">
                    <span class="accordion-icon">👥</span>
                    <span class="accordion-title">Membres</span>
                    <span class="accordion-count">${members.length}</span>
                    <span class="accordion-arrow">▼</span>
                </div>
                <div class="accordion-content active">
                    <div class="accordion-inner">
                        ${members.map(pol => `
                            <div class="list-item" style="cursor: pointer" data-pol-id="${pol.id}">
                                <div class="panel-avatar" style="width: 32px; height: 32px; font-size: 0.8rem; background: ${pol.partyColor || '#888'}">${pol.initials || '?'}</div>
                                <div class="list-item-content">
                                    <div class="list-item-title">${pol.name}</div>
                                    <div class="list-item-subtitle">${pol.role || 'Membre'}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            ${votes.length > 0 ? `
            <div class="accordion-section">
                <div class="accordion-header">
                    <span class="accordion-icon">🗳️</span>
                    <span class="accordion-title">Votes des membres</span>
                    <span class="accordion-count">${votes.length}</span>
                    <span class="accordion-arrow">▼</span>
                </div>
                <div class="accordion-content">
                    <div class="accordion-inner">
                        ${votes.map(vote => `
                            <div class="list-item">
                                <div class="list-item-icon vote">🗳️</div>
                                <div class="list-item-content">
                                    <div class="list-item-title">${vote.formattedTitle || vote.title}</div>
                                    <div class="list-item-subtitle">${this.formatDate(vote.vote_date)}</div>
                                    <div class="vote-stats">
                                        <span class="vote-stat pour">${vote.memberStats.pour} pour</span>
                                        <span class="vote-stat contre">${vote.memberStats.contre} contre</span>
                                        <span class="vote-stat abstention">${vote.memberStats.abstention} abst.</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            ` : ''}

            <button class="btn-focus" data-id="${com.id}">Voir uniquement cette commission</button>
        `;

        this.bindPanelEvents(com.id);
        this.openDetailPanel();
    }

    async showCompanyDetail(ent) {
        this.panelContent.innerHTML = `
            <div class="panel-header">
                <div class="panel-avatar" style="background: #fbbf24">💼</div>
                <h2 class="panel-name">${ent.name}</h2>
                <p class="panel-role">${ent.sector || ''}</p>
            </div>
            <p style="padding: 20px; color: var(--text-secondary);">Détails non disponibles</p>
        `;

        this.openDetailPanel();
    }

    async showVoteDetail(vote) {
        // Récupérer les détails complets du vote
        let voteDetails = vote;
        if (USE_SUPABASE) {
            const fullVote = await dataService.getVoteById(vote.id);
            if (fullVote) {
                voteDetails = { ...vote, ...fullVote };
            }
        }

        // Titre complet (non tronqué)
        const fullTitle = voteDetails.description || voteDetails.title || vote.name;
        const formattedTitle = vote.name || formatVoteTitle(voteDetails.title);

        // Statistiques de vote
        const pour = voteDetails.pour || 0;
        const contre = voteDetails.contre || 0;
        const abstention = voteDetails.abstention || 0;
        const total = pour + contre + abstention;

        // Résultat
        const resultLabel = voteDetails.result === 'adopted' ? 'Adopté' : voteDetails.result === 'rejected' ? 'Rejeté' : voteDetails.result || '';
        const resultClass = voteDetails.result === 'adopted' ? 'tag-for' : voteDetails.result === 'rejected' ? 'tag-against' : '';

        // Lien source
        const sourceLink = voteDetails.source_url
            ? `<a href="${voteDetails.source_url}" target="_blank" class="btn-source">Voir sur assemblee-nationale.fr 🔗</a>`
            : '';

        this.panelContent.innerHTML = `
            <div class="panel-header">
                <div class="panel-avatar" style="background: #34d399">🗳️</div>
                <h2 class="panel-name">${formattedTitle}</h2>
                <p class="panel-role">${this.formatDate(voteDetails.vote_date || vote.date)}</p>
                ${resultLabel ? `<span class="list-item-tag ${resultClass}">${resultLabel}</span>` : ''}
            </div>

            <div class="vote-detail-section">
                <h3 class="section-title">Titre complet</h3>
                <p class="vote-full-title">${fullTitle}</p>
            </div>

            ${total > 0 ? `
            <div class="vote-detail-section">
                <h3 class="section-title">Résultats du vote</h3>
                <div class="vote-results-bar">
                    <div class="vote-bar-pour" style="width: ${(pour/total*100).toFixed(1)}%"></div>
                    <div class="vote-bar-contre" style="width: ${(contre/total*100).toFixed(1)}%"></div>
                    <div class="vote-bar-abstention" style="width: ${(abstention/total*100).toFixed(1)}%"></div>
                </div>
                <div class="vote-results-stats">
                    <div class="vote-stat-item pour">
                        <span class="stat-value">${pour}</span>
                        <span class="stat-label">Pour</span>
                    </div>
                    <div class="vote-stat-item contre">
                        <span class="stat-value">${contre}</span>
                        <span class="stat-label">Contre</span>
                    </div>
                    <div class="vote-stat-item abstention">
                        <span class="stat-value">${abstention}</span>
                        <span class="stat-label">Abstention</span>
                    </div>
                </div>
            </div>
            ` : ''}

            ${sourceLink ? `<div class="vote-detail-section">${sourceLink}</div>` : ''}
        `;

        this.openDetailPanel();
    }

    createAccordionSection(type, title, items, renderItem) {
        if (!items || items.length === 0) return '';

        const icons = {
            commission: '🏛️',
            vote: '🗳️',
            company: '💼',
            personal: '👥'
        };

        return `
            <div class="accordion-section">
                <div class="accordion-header">
                    <span class="accordion-icon">${icons[type]}</span>
                    <span class="accordion-title">${title}</span>
                    <span class="accordion-count">${items.length}</span>
                    <span class="accordion-arrow">▼</span>
                </div>
                <div class="accordion-content">
                    <div class="accordion-inner">
                        ${items.map(renderItem).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    bindPanelEvents(currentId) {
        this.panelContent.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                header.classList.toggle('active');
                header.nextElementSibling.classList.toggle('active');
            });
        });

        this.panelContent.querySelectorAll('[data-pol-id]').forEach(item => {
            item.addEventListener('click', async () => {
                const polId = item.dataset.polId;
                this.graph.focusOnNode(polId);
                await this.showPoliticianDetailById(polId);
            });
        });

        const focusBtn = this.panelContent.querySelector('.btn-focus');
        if (focusBtn) {
            focusBtn.addEventListener('click', () => {
                this.graph.showOnlyConnections(currentId);
            });
        }
    }

    handleTooltip(node, event) {
        if (!node) {
            this.tooltip.classList.remove('active');
            return;
        }

        let content = '';
        if (node.type === 'politician') {
            content = `
                <div class="tooltip-title">${node.name}</div>
                <div class="tooltip-subtitle">${node.party} - ${node.role || ''}</div>
            `;
        } else if (node.type === 'commission') {
            content = `
                <div class="tooltip-title">${node.name}</div>
                <div class="tooltip-subtitle">Commission parlementaire</div>
            `;
        } else if (node.type === 'company') {
            content = `
                <div class="tooltip-title">${node.name}</div>
                <div class="tooltip-subtitle">${node.sector || 'Entreprise'}</div>
            `;
        } else if (node.type === 'vote') {
            content = `
                <div class="tooltip-title">${node.name}</div>
                <div class="tooltip-subtitle">Vote</div>
            `;
        }

        this.tooltip.innerHTML = content;
        this.tooltip.style.left = (event.pageX + 15) + 'px';
        this.tooltip.style.top = (event.pageY + 15) + 'px';
        this.tooltip.classList.add('active');
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    openDetailPanel() {
        this.detailPanel.classList.add('active');
    }

    closeDetailPanel() {
        this.detailPanel.classList.remove('active');
        this.graph.resetHighlight();
    }
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
