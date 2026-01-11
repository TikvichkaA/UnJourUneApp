/**
 * EntreGraphe - Graph Visualization Module
 * Visualisation D3.js force-directed
 */

const GraphViz = (function() {
  let svg, simulation, container;
  let nodes = [];
  let links = [];
  let width, height;
  let onNodeClick = null;
  let onNodeExpand = null;
  let linkSet = new Set();

  // Couleurs
  const COLORS = {
    company: '#3b82f6',
    person: '#10b981',
    dirigeant: '#f59e0b',
    beneficiaire: '#ef4444',
    filiale: '#6366f1',
    actionnaire: '#22d3ee', // Cyan pour les actionnaires
    bridge: '#f472b6' // Rose pour les noeuds-ponts
  };

  /**
   * Initialise le graphe SVG
   */
  function init(svgElement, clickCallback, expandCallback) {
    svg = d3.select(svgElement);
    onNodeClick = clickCallback;
    onNodeExpand = expandCallback;

    // Groupe principal avec zoom
    container = svg.append('g').attr('class', 'graph-container');

    // Zoom et pan
    const zoom = d3.zoom()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Fleches pour les liens
    const defs = svg.append('defs');

    // Fleche dirigeant
    defs.append('marker')
      .attr('id', 'arrow-dirigeant')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', COLORS.dirigeant);

    // Fleche beneficiaire
    defs.append('marker')
      .attr('id', 'arrow-beneficiaire')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', COLORS.beneficiaire);

    // Fleche filiale
    defs.append('marker')
      .attr('id', 'arrow-filiale')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', COLORS.filiale);

    // Fleche actionnaire
    defs.append('marker')
      .attr('id', 'arrow-actionnaire')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', COLORS.actionnaire);

    // Ecouter les changements de taille
    updateSize();
    window.addEventListener('resize', updateSize);
  }

  /**
   * Met a jour les dimensions du graphe
   */
  function updateSize() {
    const rect = svg.node().getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    if (simulation) {
      simulation.force('center', d3.forceCenter(width / 2, height / 2));
      simulation.alpha(0.3).restart();
    }
  }

  /**
   * Affiche le graphe avec les donnees
   */
  function render(graphData, preservePositions = false) {
    const oldPositions = new Map();
    if (preservePositions) {
      nodes.forEach(n => oldPositions.set(n.id, { x: n.x, y: n.y }));
    }

    nodes = graphData.nodes;
    links = graphData.links;

    // Restaurer les positions existantes
    if (preservePositions) {
      nodes.forEach(n => {
        const pos = oldPositions.get(n.id);
        if (pos) {
          n.x = pos.x;
          n.y = pos.y;
        }
      });
    }

    // Mettre a jour le set de liens
    linkSet.clear();
    links.forEach(l => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
      linkSet.add(`${srcId}->${tgtId}`);
    });

    // Detecter les noeuds-ponts (connectes a plusieurs entreprises)
    detectBridgeNodes();

    // Nettoyer le graphe precedent
    container.selectAll('.links').remove();
    container.selectAll('.nodes').remove();
    container.selectAll('.labels').remove();
    container.selectAll('.expand-buttons').remove();

    // Creer la simulation de forces
    simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(120)
        .strength(0.5))
      .force('charge', d3.forceManyBody()
        .strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide()
        .radius(40));

    // Creer les liens
    const linkGroup = container.append('g').attr('class', 'links');

    const link = linkGroup.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('class', d => `graph-link link-${d.type}`)
      .attr('stroke', d => COLORS[d.type])
      .attr('stroke-width', 2)
      .attr('marker-end', d => `url(#arrow-${d.type})`);

    // Labels sur les liens
    const linkLabels = linkGroup.selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .attr('class', 'link-label')
      .attr('font-size', '9px')
      .attr('fill', '#9090a0')
      .attr('text-anchor', 'middle')
      .text(d => d.label);

    // Creer les noeuds
    const nodeGroup = container.append('g').attr('class', 'nodes');

    const node = nodeGroup.selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'graph-node')
      .call(drag(simulation))
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onNodeClick) onNodeClick(d);
      });

    // Cercles des noeuds
    node.append('circle')
      .attr('r', d => getNodeRadius(d))
      .attr('fill', d => d.isBridge ? COLORS.bridge : COLORS[d.type])
      .attr('stroke', d => d.isMain ? '#fff' : (d.isBridge ? '#fff' : 'transparent'))
      .attr('stroke-width', d => d.isMain ? 3 : (d.isBridge ? 2 : 0))
      .style('filter', d => d.isMain ? 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))' :
                          (d.isBridge ? 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.5))' : 'none'));

    // Icones dans les noeuds
    node.append('text')
      .attr('class', 'node-icon')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', d => d.isMain ? '16px' : '12px')
      .attr('fill', 'white')
      .text(d => d.type === 'company' ? '\u{1F3E2}' : '\u{1F464}');

    // Bouton d'expansion pour les entreprises non-etendues
    const expandGroup = container.append('g').attr('class', 'expand-buttons');

    const expandableNodes = nodes.filter(n =>
      (n.type === 'company' && n.siren && !n.expanded && !n.isMain) ||
      (n.type === 'person' && !n.expanded)
    );

    const expandBtn = expandGroup.selectAll('g')
      .data(expandableNodes)
      .enter()
      .append('g')
      .attr('class', 'expand-btn')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onNodeExpand) onNodeExpand(d);
      });

    expandBtn.append('circle')
      .attr('r', 10)
      .attr('fill', '#6366f1')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    expandBtn.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('+');

    // Labels des noeuds
    const labelGroup = container.append('g').attr('class', 'labels');

    const label = labelGroup.selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', d => getNodeRadius(d) + 14)
      .attr('font-size', d => d.isMain ? '12px' : (d.isBridge ? '11px' : '10px'))
      .attr('font-weight', d => (d.isMain || d.isBridge) ? '600' : '400')
      .attr('fill', '#f0f0f5')
      .text(d => truncateLabel(d.label, 18));

    // Animation de la simulation
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      linkLabels
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
      label.attr('x', d => d.x).attr('y', d => d.y);

      // Positionner les boutons d'expansion
      expandBtn.attr('transform', d => {
        const r = getNodeRadius(d);
        return `translate(${d.x + r * 0.7},${d.y - r * 0.7})`;
      });
    });

    // Centrer le graphe apres stabilisation (sauf si on preserve les positions)
    if (!preservePositions) {
      simulation.on('end', () => {
        centerGraph();
      });
    }
  }

  /**
   * Retourne le rayon d'un noeud
   */
  function getNodeRadius(node) {
    if (node.isMain) return 25;
    if (node.isBridge) return 22;
    return 18;
  }

  /**
   * Detecte les noeuds-ponts (personnes liees a plusieurs entreprises)
   */
  function detectBridgeNodes() {
    // Compter les connexions de chaque noeud vers des entreprises
    const companyConnections = new Map();

    links.forEach(l => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;

      // Trouver les noeuds source et cible
      const srcNode = nodes.find(n => n.id === srcId);
      const tgtNode = nodes.find(n => n.id === tgtId);

      if (srcNode && srcNode.type === 'person' && tgtNode && tgtNode.type === 'company') {
        const count = companyConnections.get(srcId) || 0;
        companyConnections.set(srcId, count + 1);
      }
      if (tgtNode && tgtNode.type === 'person' && srcNode && srcNode.type === 'company') {
        const count = companyConnections.get(tgtId) || 0;
        companyConnections.set(tgtId, count + 1);
      }
    });

    // Marquer les noeuds-ponts (connectes a 2+ entreprises)
    nodes.forEach(n => {
      const connections = companyConnections.get(n.id) || 0;
      n.isBridge = n.type === 'person' && connections >= 2;
    });
  }

  /**
   * Tronque un label trop long
   */
  function truncateLabel(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Centre le graphe dans le viewport
   */
  function centerGraph() {
    if (nodes.length === 0) return;

    const bounds = {
      minX: d3.min(nodes, d => d.x) - 50,
      maxX: d3.max(nodes, d => d.x) + 50,
      minY: d3.min(nodes, d => d.y) - 50,
      maxY: d3.max(nodes, d => d.y) + 50
    };

    const graphWidth = bounds.maxX - bounds.minX;
    const graphHeight = bounds.maxY - bounds.minY;

    const scale = Math.min(
      width / graphWidth * 0.9,
      height / graphHeight * 0.9,
      1.5
    );

    const translateX = (width - graphWidth * scale) / 2 - bounds.minX * scale;
    const translateY = (height - graphHeight * scale) / 2 - bounds.minY * scale;

    svg.transition()
      .duration(750)
      .call(
        d3.zoom().transform,
        d3.zoomIdentity.translate(translateX, translateY).scale(scale)
      );
  }

  /**
   * Gestion du drag des noeuds
   */
  function drag(simulation) {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  /**
   * Ajoute des noeuds supplementaires au graphe existant
   */
  function addNodes(newNodes, newLinks) {
    // Eviter les doublons de noeuds
    const existingIds = new Set(nodes.map(n => n.id));

    newNodes.forEach(n => {
      if (!existingIds.has(n.id)) {
        // Position initiale pres du noeud parent si possible
        const relatedLink = newLinks.find(l =>
          l.source === n.id || l.target === n.id
        );
        if (relatedLink) {
          const parentId = relatedLink.source === n.id ? relatedLink.target : relatedLink.source;
          const parent = nodes.find(p => p.id === parentId);
          if (parent && parent.x && parent.y) {
            n.x = parent.x + (Math.random() - 0.5) * 100;
            n.y = parent.y + (Math.random() - 0.5) * 100;
          }
        }
        nodes.push(n);
        existingIds.add(n.id);
      }
    });

    // Eviter les doublons de liens
    newLinks.forEach(l => {
      const linkId = `${l.source}->${l.target}`;
      if (!linkSet.has(linkId)) {
        links.push(l);
        linkSet.add(linkId);
      }
    });

    // Re-render en preservant les positions
    render({ nodes, links }, true);
  }

  /**
   * Retourne les noeuds actuels
   */
  function getNodes() {
    return nodes;
  }

  /**
   * Retourne les liens actuels
   */
  function getLinks() {
    return links;
  }

  /**
   * Retourne l'ensemble des IDs de noeuds
   */
  function getNodeIds() {
    return new Set(nodes.map(n => n.id));
  }

  /**
   * Marque un noeud comme etendu
   */
  function markExpanded(nodeId) {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      node.expanded = true;
    }
  }

  /**
   * Met en surbrillance un noeud
   */
  function highlightNode(nodeId) {
    container.selectAll('.graph-node circle')
      .transition()
      .duration(200)
      .attr('opacity', d => d.id === nodeId ? 1 : 0.4);

    container.selectAll('.graph-link')
      .transition()
      .duration(200)
      .attr('opacity', d =>
        d.source.id === nodeId || d.target.id === nodeId ? 1 : 0.2
      );
  }

  /**
   * Retire la surbrillance
   */
  function clearHighlight() {
    container.selectAll('.graph-node circle')
      .transition()
      .duration(200)
      .attr('opacity', 1);

    container.selectAll('.graph-link')
      .transition()
      .duration(200)
      .attr('opacity', 0.6);
  }

  /**
   * Nettoie le graphe
   */
  function clear() {
    container.selectAll('*').remove();
    nodes = [];
    links = [];

    if (simulation) {
      simulation.stop();
      simulation = null;
    }
  }

  // API publique
  return {
    init,
    render,
    addNodes,
    getNodes,
    getLinks,
    getNodeIds,
    markExpanded,
    highlightNode,
    clearHighlight,
    centerGraph,
    clear,
    updateSize
  };
})();
