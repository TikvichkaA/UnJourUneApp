// Module de visualisation du graphe avec D3.js

class GraphVisualization {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        this.svg = null;
        this.g = null;
        this.simulation = null;
        this.nodes = [];
        this.links = [];
        this.nodeElements = null;
        this.linkElements = null;

        this.zoom = null;
        this.currentTransform = d3.zoomIdentity;

        this.selectedNode = null;
        this.onNodeClick = null;
        this.onNodeHover = null;

        this.colors = {
            politician: '#f472b6',
            commission: '#22d3ee',
            company: '#fbbf24',
            vote: '#34d399',
            personal: '#fb7185'
        };

        this.init();
    }

    init() {
        // Créer le SVG
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', [0, 0, this.width, this.height]);

        // Groupe principal pour le zoom/pan
        this.g = this.svg.append('g');

        // Définir les filtres et dégradés
        this.createDefs();

        // Configurer le zoom
        this.zoom = d3.zoom()
            .scaleExtent([0.2, 4])
            .on('zoom', (event) => {
                this.currentTransform = event.transform;
                this.g.attr('transform', event.transform);
            });

        this.svg.call(this.zoom);

        // Groupes pour liens et noeuds
        this.linksGroup = this.g.append('g').attr('class', 'links');
        this.nodesGroup = this.g.append('g').attr('class', 'nodes');

        // Gestion du redimensionnement
        window.addEventListener('resize', () => this.handleResize());
    }

    createDefs() {
        const defs = this.svg.append('defs');

        // Glow filter
        const filter = defs.append('filter')
            .attr('id', 'glow')
            .attr('x', '-50%')
            .attr('y', '-50%')
            .attr('width', '200%')
            .attr('height', '200%');

        filter.append('feGaussianBlur')
            .attr('stdDeviation', '3')
            .attr('result', 'coloredBlur');

        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Marqueur de flèche pour les liens
        defs.append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 20)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .append('path')
            .attr('d', 'M 0,-5 L 10,0 L 0,5')
            .attr('fill', '#666');
    }

    handleResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.svg.attr('viewBox', [0, 0, this.width, this.height]);

        if (this.simulation) {
            this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2));
            this.simulation.alpha(0.3).restart();
        }
    }

    setData(data) {
        this.nodes = data.nodes;
        this.links = data.links;
        this.render();
    }

    render() {
        // Nettoyer
        this.linksGroup.selectAll('*').remove();
        this.nodesGroup.selectAll('*').remove();

        // Créer la simulation
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links)
                .id(d => d.id)
                .distance(d => {
                    if (d.type === 'personal') return 80;
                    if (d.type === 'commission') return 120;
                    return 100;
                })
                .strength(0.5))
            .force('charge', d3.forceManyBody()
                .strength(d => d.type === 'politician' ? -400 : -200))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide()
                .radius(d => d.radius + 15));

        // Dessiner les liens
        this.linkElements = this.linksGroup.selectAll('line')
            .data(this.links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('stroke', d => this.colors[d.type])
            .attr('stroke-width', d => d.type === 'personal' ? 2.5 : 1.5)
            .attr('stroke-dasharray', d => d.type === 'personal' ? '5,5' : 'none');

        // Dessiner les noeuds
        this.nodeElements = this.nodesGroup.selectAll('g')
            .data(this.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .call(this.drag());

        // Cercle du noeud
        this.nodeElements.append('circle')
            .attr('r', d => d.radius)
            .attr('fill', d => {
                if (d.type === 'politician') {
                    return d.partyColor || getPartyColor(d.party);
                }
                return this.colors[d.type];
            })
            .attr('stroke', 'rgba(255,255,255,0.3)')
            .attr('stroke-width', 2);

        // Texte/icône du noeud
        this.nodeElements.append('text')
            .attr('dy', '0.35em')
            .attr('font-size', d => d.type === 'politician' ? '10px' : '12px')
            .attr('fill', d => d.type === 'politician' ? '#000' : '#fff')
            .attr('font-weight', 'bold')
            .text(d => {
                if (d.type === 'politician') return d.initials;
                if (d.icon) return d.icon;
                if (d.type === 'vote') return '🗳️';
                return '';
            });

        // Label sous le noeud pour les politiciens
        this.nodeElements.filter(d => d.type === 'politician')
            .append('text')
            .attr('dy', d => d.radius + 14)
            .attr('font-size', '10px')
            .attr('fill', '#94a3b8')
            .text(d => d.name.split(' ').pop()); // Nom de famille seulement

        // Événements
        this.nodeElements
            .on('click', (event, d) => this.handleNodeClick(event, d))
            .on('mouseenter', (event, d) => this.handleNodeHover(event, d, true))
            .on('mouseleave', (event, d) => this.handleNodeHover(event, d, false));

        // Animation
        this.simulation.on('tick', () => this.tick());
    }

    tick() {
        this.linkElements
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        this.nodeElements
            .attr('transform', d => `translate(${d.x},${d.y})`);
    }

    drag() {
        return d3.drag()
            .on('start', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });
    }

    handleNodeClick(event, d) {
        event.stopPropagation();
        this.selectedNode = d;

        if (this.onNodeClick) {
            this.onNodeClick(d);
        }

        // Centrer sur le noeud cliqué
        this.centerOnNode(d);
    }

    handleNodeHover(event, d, isEntering) {
        if (isEntering) {
            this.highlightConnections(d);
            if (this.onNodeHover) {
                this.onNodeHover(d, event);
            }
        } else {
            this.resetHighlight();
            if (this.onNodeHover) {
                this.onNodeHover(null, event);
            }
        }
    }

    highlightConnections(node) {
        // Trouver tous les noeuds connectés
        const connectedIds = new Set([node.id]);

        this.links.forEach(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;

            if (sourceId === node.id) connectedIds.add(targetId);
            if (targetId === node.id) connectedIds.add(sourceId);
        });

        // Appliquer les styles
        this.nodeElements.classed('dimmed', d => !connectedIds.has(d.id));
        this.nodeElements.classed('highlighted', d => d.id === node.id);

        this.linkElements.classed('dimmed', d => {
            const sourceId = typeof d.source === 'object' ? d.source.id : d.source;
            const targetId = typeof d.target === 'object' ? d.target.id : d.target;
            return sourceId !== node.id && targetId !== node.id;
        });
        this.linkElements.classed('highlighted', d => {
            const sourceId = typeof d.source === 'object' ? d.source.id : d.source;
            const targetId = typeof d.target === 'object' ? d.target.id : d.target;
            return sourceId === node.id || targetId === node.id;
        });
    }

    resetHighlight() {
        this.nodeElements.classed('dimmed', false);
        this.nodeElements.classed('highlighted', false);
        this.linkElements.classed('dimmed', false);
        this.linkElements.classed('highlighted', false);
    }

    centerOnNode(node, duration = 500) {
        const scale = 1.5;
        const x = this.width / 2 - node.x * scale;
        const y = this.height / 2 - node.y * scale;

        this.svg.transition()
            .duration(duration)
            .call(this.zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
    }

    focusOnNode(nodeId) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
            this.highlightConnections(node);
            this.centerOnNode(node);
        }
    }

    // Mapping thématique commissions -> mots-clés votes
    getCommissionKeywords(commissionName) {
        const name = (commissionName || '').toLowerCase();
        const keywords = [];

        // Finance / Budget
        if (name.includes('finance')) {
            keywords.push('budget', 'finance', 'plf', 'plfss', 'fiscal', 'impôt', 'taxe', 'dette', 'économi');
        }
        // Défense
        if (name.includes('défense') || name.includes('armée')) {
            keywords.push('défense', 'armée', 'militaire', 'sécurité nationale', 'guerre');
        }
        // Affaires sociales / Santé
        if (name.includes('social') || name.includes('santé')) {
            keywords.push('social', 'santé', 'sécu', 'retraite', 'pension', 'hôpital', 'médic', 'plfss');
        }
        // Lois / Justice
        if (name.includes('lois') || name.includes('justice')) {
            keywords.push('justice', 'pénal', 'constitution', 'liberté', 'droit');
        }
        // Affaires étrangères
        if (name.includes('étrangères') || name.includes('européen')) {
            keywords.push('europe', 'international', 'traité', 'accord', 'diplomati');
        }
        // Économie
        if (name.includes('économi') || name.includes('entreprise')) {
            keywords.push('économi', 'entreprise', 'commerce', 'industri', 'emploi', 'travail');
        }
        // Environnement / Développement durable
        if (name.includes('développement durable') || name.includes('environnement') || name.includes('écologi')) {
            keywords.push('environnement', 'écologi', 'climat', 'énergie', 'transition', 'biodiversité');
        }
        // Culture / Éducation
        if (name.includes('culture') || name.includes('éducation')) {
            keywords.push('culture', 'éducation', 'école', 'université', 'enseignement', 'recherche');
        }
        // Agriculture
        if (name.includes('agricult')) {
            keywords.push('agricult', 'agricole', 'rural', 'alimenta', 'pêche');
        }

        return keywords;
    }

    voteMatchesCommission(voteNode, keywords) {
        if (keywords.length === 0) return true; // Pas de filtre si pas de mots-clés

        const voteName = ((voteNode.name || '') + ' ' + (voteNode.description || '')).toLowerCase();
        return keywords.some(kw => voteName.includes(kw));
    }

    showOnlyConnections(nodeId) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) return;

        // Trouver tous les noeuds connectés directement
        const connectedIds = new Set([nodeId]);
        const politicianIds = new Set();

        this.links.forEach(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;

            if (sourceId === nodeId) connectedIds.add(targetId);
            if (targetId === nodeId) connectedIds.add(sourceId);
        });

        // Si c'est une commission, on collecte les politiciens membres et les votes thématiques
        if (node.type === 'commission') {
            // Extraire les mots-clés thématiques de la commission
            const keywords = this.getCommissionKeywords(node.name || node.description);

            this.links.forEach(link => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;

                if (sourceId === nodeId || targetId === nodeId) {
                    const otherId = sourceId === nodeId ? targetId : sourceId;
                    const otherNode = this.nodes.find(n => n.id === otherId);
                    if (otherNode && otherNode.type === 'politician') {
                        politicianIds.add(otherId);
                    }
                }
            });

            // Ajouter les votes thématiquement liés à la commission
            this.links.forEach(link => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;

                if (link.type === 'vote') {
                    if (politicianIds.has(sourceId) || politicianIds.has(targetId)) {
                        const voteId = politicianIds.has(sourceId) ? targetId : sourceId;
                        const voteNode = this.nodes.find(n => n.id === voteId);

                        // Filtrer par thème si des mots-clés existent
                        if (voteNode && this.voteMatchesCommission(voteNode, keywords)) {
                            connectedIds.add(voteId);
                        }
                    }
                }
            });
        }

        // Filtrer les données
        const filteredNodes = this.nodes.filter(n => connectedIds.has(n.id));
        const filteredLinks = this.links.filter(l => {
            const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
            const targetId = typeof l.target === 'object' ? l.target.id : l.target;
            return connectedIds.has(sourceId) && connectedIds.has(targetId);
        });

        // Recréer le graphe avec les données filtrées
        this.nodes = filteredNodes;
        this.links = filteredLinks;
        this.render();

        // Centrer sur le noeud principal
        setTimeout(() => {
            const updatedNode = this.nodes.find(n => n.id === nodeId);
            if (updatedNode) this.centerOnNode(updatedNode);
        }, 500);
    }

    resetView() {
        this.svg.transition()
            .duration(500)
            .call(this.zoom.transform, d3.zoomIdentity);
        this.resetHighlight();
    }

    zoomIn() {
        this.svg.transition()
            .duration(300)
            .call(this.zoom.scaleBy, 1.3);
    }

    zoomOut() {
        this.svg.transition()
            .duration(300)
            .call(this.zoom.scaleBy, 0.7);
    }

    updateFilters(filters) {
        const data = generateGraphData(filters);
        this.setData(data);
    }
}
