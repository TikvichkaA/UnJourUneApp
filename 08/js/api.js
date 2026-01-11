/**
 * EntreGraphe - API Pappers Module
 * Gestion des appels a l'API Pappers
 */

const PappersAPI = (function() {
  const BASE_URL = 'https://api.pappers.fr/v2';

  // Stockage de la cle API
  let apiKey = localStorage.getItem('pappers_api_key') || '';

  /**
   * Configure la cle API
   */
  function setApiKey(key) {
    apiKey = key;
    localStorage.setItem('pappers_api_key', key);
  }

  /**
   * Recupere la cle API
   */
  function getApiKey() {
    return apiKey;
  }

  /**
   * Verifie si une cle API est configuree
   */
  function hasApiKey() {
    return apiKey && apiKey.length > 0;
  }

  /**
   * Effectue une requete a l'API
   */
  async function request(endpoint, params = {}) {
    if (!hasApiKey()) {
      throw new Error('Cle API Pappers non configuree');
    }

    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_token', apiKey);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Cle API invalide ou expiree');
      }
      if (response.status === 404) {
        throw new Error('Entreprise non trouvee');
      }
      if (response.status === 429) {
        throw new Error('Trop de requetes. Veuillez patienter.');
      }
      throw new Error(`Erreur API: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Recherche d'entreprises par nom ou SIREN
   */
  async function searchEntreprises(query, limit = 10) {
    // Detecter si c'est un SIREN (9 chiffres)
    const isSiren = /^\d{9}$/.test(query.replace(/\s/g, ''));

    if (isSiren) {
      // Recherche directe par SIREN
      try {
        const entreprise = await getEntreprise(query.replace(/\s/g, ''));
        return [entreprise];
      } catch (e) {
        return [];
      }
    }

    // Recherche par nom
    const data = await request('/recherche', {
      q: query,
      par_page: limit
    });

    return data.resultats || [];
  }

  /**
   * Recupere les details d'une entreprise par SIREN
   */
  async function getEntreprise(siren) {
    return request('/entreprise', {
      siren: siren,
      // Demander toutes les informations utiles
      beneficiaires: true,
      dirigeants: true,
      actionnaires: true  // Actionnaires (personnes morales et physiques)
    });
  }

  /**
   * Recupere les dirigeants d'une entreprise
   */
  async function getDirigeants(siren) {
    const data = await getEntreprise(siren);
    return data.representants || [];
  }

  /**
   * Recupere les beneficiaires effectifs
   */
  async function getBeneficiaires(siren) {
    const data = await getEntreprise(siren);
    return data.beneficiaires_effectifs || [];
  }

  /**
   * Construit le graphe de relations pour une entreprise
   * Retourne les noeuds et liens pour D3.js
   */
  async function buildRelationsGraph(siren) {
    const entreprise = await getEntreprise(siren);

    const nodes = [];
    const links = [];
    const nodeMap = new Map();

    // Noeud central: l'entreprise recherchee
    const mainNodeId = `company_${siren}`;
    nodes.push({
      id: mainNodeId,
      type: 'company',
      label: entreprise.nom_entreprise || entreprise.denomination || 'Entreprise',
      siren: siren,
      data: entreprise,
      isMain: true
    });
    nodeMap.set(mainNodeId, true);

    // Ajouter les dirigeants
    const representants = entreprise.representants || [];
    representants.forEach((rep, index) => {
      const isCompany = rep.personne_morale;
      const nodeId = isCompany
        ? `company_${rep.siren || `rep_${index}`}`
        : `person_${rep.nom}_${rep.prenom || ''}`.replace(/\s+/g, '_');

      if (!nodeMap.has(nodeId)) {
        nodes.push({
          id: nodeId,
          type: isCompany ? 'company' : 'person',
          label: isCompany
            ? (rep.denomination || rep.nom)
            : `${rep.prenom || ''} ${rep.nom || ''}`.trim(),
          siren: rep.siren,
          data: rep
        });
        nodeMap.set(nodeId, true);
      }

      links.push({
        source: nodeId,
        target: mainNodeId,
        type: 'dirigeant',
        label: rep.qualite || 'Dirigeant'
      });
    });

    // Ajouter les beneficiaires effectifs
    const beneficiaires = entreprise.beneficiaires_effectifs || [];
    beneficiaires.forEach((ben, index) => {
      const isCompany = ben.personne_morale;
      const nodeId = isCompany
        ? `company_${ben.siren || `ben_${index}`}`
        : `person_${ben.nom}_${ben.prenom || ''}`.replace(/\s+/g, '_');

      if (!nodeMap.has(nodeId)) {
        nodes.push({
          id: nodeId,
          type: isCompany ? 'company' : 'person',
          label: isCompany
            ? (ben.denomination || ben.nom)
            : `${ben.prenom || ''} ${ben.nom || ''}`.trim(),
          siren: ben.siren,
          data: ben
        });
        nodeMap.set(nodeId, true);
      }

      links.push({
        source: nodeId,
        target: mainNodeId,
        type: 'beneficiaire',
        label: `${ben.pourcentage_parts || '?'}% parts`
      });
    });

    // Ajouter les actionnaires (personnes morales et physiques)
    const actionnaires = entreprise.actionnaires || [];
    actionnaires.forEach((act, index) => {
      const isCompany = act.personne_morale;
      const nodeId = isCompany
        ? `company_${act.siren || `act_${index}`}`
        : `person_${act.nom}_${act.prenom || ''}`.replace(/\s+/g, '_');

      if (!nodeMap.has(nodeId)) {
        nodes.push({
          id: nodeId,
          type: isCompany ? 'company' : 'person',
          label: isCompany
            ? (act.denomination || act.nom)
            : `${act.prenom || ''} ${act.nom || ''}`.trim(),
          siren: act.siren,
          data: act
        });
        nodeMap.set(nodeId, true);
      }

      // Eviter les doublons de liens (si deja beneficiaire)
      const linkExists = links.some(l =>
        l.source === nodeId && l.target === mainNodeId
      );

      if (!linkExists) {
        links.push({
          source: nodeId,
          target: mainNodeId,
          type: 'actionnaire',
          label: `${act.pourcentage || act.pourcentage_parts || '?'}%`
        });
      }
    });

    return { nodes, links, mainEntreprise: entreprise };
  }

  /**
   * Recherche les autres entreprises liees a une personne
   */
  async function searchPersonMandates(nom, prenom) {
    try {
      const data = await request('/recherche-dirigeants', {
        q: `${prenom} ${nom}`.trim(),
        par_page: 20
      });
      return data.resultats || [];
    } catch (e) {
      console.warn('Erreur recherche mandats:', e);
      return [];
    }
  }

  /**
   * Etend le graphe existant avec les relations d'une entreprise
   * Retourne uniquement les nouveaux noeuds et liens
   */
  async function expandCompanyRelations(siren, existingNodeIds) {
    const entreprise = await getEntreprise(siren);

    const newNodes = [];
    const newLinks = [];
    const companyNodeId = `company_${siren}`;

    // Ajouter les dirigeants
    const representants = entreprise.representants || [];
    representants.forEach((rep, index) => {
      const isCompany = rep.personne_morale;
      const nodeId = isCompany
        ? `company_${rep.siren || `rep_${siren}_${index}`}`
        : `person_${rep.nom}_${rep.prenom || ''}`.replace(/\s+/g, '_');

      if (!existingNodeIds.has(nodeId)) {
        newNodes.push({
          id: nodeId,
          type: isCompany ? 'company' : 'person',
          label: isCompany
            ? (rep.denomination || rep.nom)
            : `${rep.prenom || ''} ${rep.nom || ''}`.trim(),
          siren: rep.siren,
          data: rep,
          expanded: false
        });
        existingNodeIds.add(nodeId);
      }

      // Verifier si le lien existe deja
      const linkId = `${nodeId}->${companyNodeId}`;
      newLinks.push({
        id: linkId,
        source: nodeId,
        target: companyNodeId,
        type: 'dirigeant',
        label: rep.qualite || 'Dirigeant'
      });
    });

    // Ajouter les beneficiaires effectifs
    const beneficiaires = entreprise.beneficiaires_effectifs || [];
    beneficiaires.forEach((ben, index) => {
      const isCompany = ben.personne_morale;
      const nodeId = isCompany
        ? `company_${ben.siren || `ben_${siren}_${index}`}`
        : `person_${ben.nom}_${ben.prenom || ''}`.replace(/\s+/g, '_');

      if (!existingNodeIds.has(nodeId)) {
        newNodes.push({
          id: nodeId,
          type: isCompany ? 'company' : 'person',
          label: isCompany
            ? (ben.denomination || ben.nom)
            : `${ben.prenom || ''} ${ben.nom || ''}`.trim(),
          siren: ben.siren,
          data: ben,
          expanded: false
        });
        existingNodeIds.add(nodeId);
      }

      const linkId = `${nodeId}->${companyNodeId}`;
      newLinks.push({
        id: linkId,
        source: nodeId,
        target: companyNodeId,
        type: 'beneficiaire',
        label: `${ben.pourcentage_parts || '?'}% parts`
      });
    });

    // Ajouter les actionnaires
    const actionnaires = entreprise.actionnaires || [];
    const addedLinks = new Set(newLinks.map(l => l.id));

    actionnaires.forEach((act, index) => {
      const isCompany = act.personne_morale;
      const nodeId = isCompany
        ? `company_${act.siren || `act_${siren}_${index}`}`
        : `person_${act.nom}_${act.prenom || ''}`.replace(/\s+/g, '_');

      if (!existingNodeIds.has(nodeId)) {
        newNodes.push({
          id: nodeId,
          type: isCompany ? 'company' : 'person',
          label: isCompany
            ? (act.denomination || act.nom)
            : `${act.prenom || ''} ${act.nom || ''}`.trim(),
          siren: act.siren,
          data: act,
          expanded: false
        });
        existingNodeIds.add(nodeId);
      }

      const linkId = `${nodeId}->${companyNodeId}`;
      if (!addedLinks.has(linkId)) {
        newLinks.push({
          id: linkId,
          source: nodeId,
          target: companyNodeId,
          type: 'actionnaire',
          label: `${act.pourcentage || act.pourcentage_parts || '?'}%`
        });
        addedLinks.add(linkId);
      }
    });

    return { newNodes, newLinks, entreprise };
  }

  /**
   * Trouve les entreprises ou une personne a des mandats
   * et retourne les noeuds/liens pour le graphe
   */
  async function getPersonMandatesGraph(nom, prenom, personNodeId, existingNodeIds) {
    const mandates = await searchPersonMandates(nom, prenom);

    const newNodes = [];
    const newLinks = [];

    mandates.forEach((mandat, index) => {
      const siren = mandat.siren;
      if (!siren) return;

      const nodeId = `company_${siren}`;

      if (!existingNodeIds.has(nodeId)) {
        newNodes.push({
          id: nodeId,
          type: 'company',
          label: mandat.nom_entreprise || mandat.denomination || 'Entreprise',
          siren: siren,
          data: mandat,
          expanded: false
        });
        existingNodeIds.add(nodeId);
      }

      // Lien de la personne vers l'entreprise
      newLinks.push({
        id: `${personNodeId}->${nodeId}`,
        source: personNodeId,
        target: nodeId,
        type: 'dirigeant',
        label: mandat.qualite || 'Mandat'
      });
    });

    return { newNodes, newLinks, count: mandates.length };
  }

  // API publique
  return {
    setApiKey,
    getApiKey,
    hasApiKey,
    searchEntreprises,
    getEntreprise,
    getDirigeants,
    getBeneficiaires,
    buildRelationsGraph,
    searchPersonMandates,
    expandCompanyRelations,
    getPersonMandatesGraph
  };
})();
