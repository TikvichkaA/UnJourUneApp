// Données simulées des politiciens français et leurs liens d'intérêt

const DATA = {
    politicians: [
        {
            id: "pol1",
            name: "Marie Dufresne",
            party: "Renaissance",
            role: "Députée de Paris (7e)",
            initials: "MD",
            commissions: ["com1", "com2"],
            votes: ["vote1", "vote2", "vote3"],
            companies: ["ent1"],
            personalLinks: [
                { targetId: "pol4", relation: "Épouse de" }
            ]
        },
        {
            id: "pol2",
            name: "Jean-Pierre Morel",
            party: "LFI",
            role: "Député de Seine-Saint-Denis",
            initials: "JPM",
            commissions: ["com3", "com4"],
            votes: ["vote1", "vote4", "vote5"],
            companies: [],
            personalLinks: []
        },
        {
            id: "pol3",
            name: "Sophie Blanchard",
            party: "RN",
            role: "Députée du Pas-de-Calais",
            initials: "SB",
            commissions: ["com2", "com5"],
            votes: ["vote2", "vote4", "vote6"],
            companies: ["ent3"],
            personalLinks: [
                { targetId: "pol7", relation: "Sœur de" }
            ]
        },
        {
            id: "pol4",
            name: "François Leclerc",
            party: "Renaissance",
            role: "Député du Rhône",
            initials: "FL",
            commissions: ["com1", "com6"],
            votes: ["vote1", "vote2", "vote5"],
            companies: ["ent1", "ent2"],
            personalLinks: [
                { targetId: "pol1", relation: "Époux de" }
            ]
        },
        {
            id: "pol5",
            name: "Isabelle Mercier",
            party: "LR",
            role: "Députée des Alpes-Maritimes",
            initials: "IM",
            commissions: ["com1", "com3"],
            votes: ["vote3", "vote5", "vote6"],
            companies: ["ent4"],
            personalLinks: []
        },
        {
            id: "pol6",
            name: "Antoine Rousseau",
            party: "EELV",
            role: "Député de Gironde",
            initials: "AR",
            commissions: ["com4", "com7"],
            votes: ["vote1", "vote4", "vote7"],
            companies: [],
            personalLinks: [
                { targetId: "pol9", relation: "Ancien collaborateur de" }
            ]
        },
        {
            id: "pol7",
            name: "Nathalie Blanchard",
            party: "RN",
            role: "Députée du Nord",
            initials: "NB",
            commissions: ["com5", "com6"],
            votes: ["vote2", "vote4", "vote6"],
            companies: ["ent3"],
            personalLinks: [
                { targetId: "pol3", relation: "Sœur de" }
            ]
        },
        {
            id: "pol8",
            name: "Philippe Martin",
            party: "PS",
            role: "Député de Haute-Garonne",
            initials: "PM",
            commissions: ["com3", "com7"],
            votes: ["vote1", "vote5", "vote7"],
            companies: ["ent5"],
            personalLinks: []
        },
        {
            id: "pol9",
            name: "Claire Dubois",
            party: "EELV",
            role: "Députée de Loire-Atlantique",
            initials: "CD",
            commissions: ["com4", "com7"],
            votes: ["vote1", "vote4", "vote7"],
            companies: [],
            personalLinks: [
                { targetId: "pol6", relation: "Ancienne collaboratrice de" }
            ]
        },
        {
            id: "pol10",
            name: "Marc Lefebvre",
            party: "MoDem",
            role: "Député des Pyrénées-Atlantiques",
            initials: "ML",
            commissions: ["com1", "com2"],
            votes: ["vote1", "vote2", "vote3"],
            companies: ["ent2"],
            personalLinks: [
                { targetId: "pol12", relation: "Beau-frère de" }
            ]
        },
        {
            id: "pol11",
            name: "Élodie Garnier",
            party: "LFI",
            role: "Députée de Paris (18e)",
            initials: "EG",
            commissions: ["com3", "com4"],
            votes: ["vote4", "vote5", "vote7"],
            companies: [],
            personalLinks: []
        },
        {
            id: "pol12",
            name: "Laurent Petit",
            party: "Horizons",
            role: "Député de l'Essonne",
            initials: "LP",
            commissions: ["com2", "com6"],
            votes: ["vote1", "vote2", "vote6"],
            companies: ["ent4", "ent6"],
            personalLinks: [
                { targetId: "pol10", relation: "Beau-frère de" }
            ]
        },
        {
            id: "pol13",
            name: "Caroline Faure",
            party: "LR",
            role: "Députée du Var",
            initials: "CF",
            commissions: ["com1", "com5"],
            votes: ["vote3", "vote5", "vote6"],
            companies: ["ent6"],
            personalLinks: []
        },
        {
            id: "pol14",
            name: "Thierry Bernard",
            party: "PS",
            role: "Député du Finistère",
            initials: "TB",
            commissions: ["com3", "com7"],
            votes: ["vote1", "vote5", "vote7"],
            companies: [],
            personalLinks: [
                { targetId: "pol8", relation: "Ancien directeur de campagne de" }
            ]
        },
        {
            id: "pol15",
            name: "Hélène Moreau",
            party: "Renaissance",
            role: "Députée de l'Hérault",
            initials: "HM",
            commissions: ["com1", "com6"],
            votes: ["vote1", "vote2", "vote3"],
            companies: ["ent1", "ent5"],
            personalLinks: []
        }
    ],

    commissions: [
        {
            id: "com1",
            name: "Commission des Finances",
            description: "Examine les projets de loi de finances et contrôle le budget de l'État",
            icon: "💰"
        },
        {
            id: "com2",
            name: "Commission des Affaires étrangères",
            description: "Traite des questions de politique internationale et de diplomatie",
            icon: "🌍"
        },
        {
            id: "com3",
            name: "Commission des Affaires sociales",
            description: "Compétente en matière de protection sociale, travail et emploi",
            icon: "🤝"
        },
        {
            id: "com4",
            name: "Commission du Développement durable",
            description: "Environnement, transports et aménagement du territoire",
            icon: "🌱"
        },
        {
            id: "com5",
            name: "Commission de la Défense",
            description: "Questions relatives à la défense nationale et aux forces armées",
            icon: "🛡️"
        },
        {
            id: "com6",
            name: "Commission des Lois",
            description: "Législation constitutionnelle, administrative et judiciaire",
            icon: "⚖️"
        },
        {
            id: "com7",
            name: "Commission des Affaires culturelles",
            description: "Éducation, culture, communication et sport",
            icon: "🎭"
        }
    ],

    votes: [
        {
            id: "vote1",
            title: "Réforme des retraites",
            date: "2024-03-15",
            description: "Projet de loi portant réforme du système de retraites",
            results: {
                pol1: "pour", pol2: "contre", pol4: "pour", pol5: "abstention",
                pol6: "contre", pol8: "contre", pol9: "contre", pol10: "pour",
                pol11: "contre", pol12: "pour", pol14: "contre", pol15: "pour"
            }
        },
        {
            id: "vote2",
            title: "Loi immigration",
            date: "2024-01-25",
            description: "Projet de loi pour contrôler l'immigration",
            results: {
                pol1: "pour", pol3: "pour", pol4: "pour", pol7: "pour",
                pol10: "pour", pol12: "pour", pol15: "pour"
            }
        },
        {
            id: "vote3",
            title: "Budget 2024",
            date: "2023-12-20",
            description: "Loi de finances pour l'année 2024",
            results: {
                pol1: "pour", pol5: "contre", pol10: "pour",
                pol13: "contre", pol15: "pour"
            }
        },
        {
            id: "vote4",
            title: "Loi climat et résilience",
            date: "2024-02-10",
            description: "Mesures pour la transition écologique",
            results: {
                pol2: "pour", pol3: "contre", pol6: "pour", pol7: "contre",
                pol9: "pour", pol11: "pour"
            }
        },
        {
            id: "vote5",
            title: "Réforme du RSA",
            date: "2024-04-05",
            description: "Conditionnalité du RSA à des heures d'activité",
            results: {
                pol2: "contre", pol4: "pour", pol5: "pour", pol8: "contre",
                pol11: "contre", pol14: "contre"
            }
        },
        {
            id: "vote6",
            title: "Loi sécurité globale",
            date: "2024-03-28",
            description: "Renforcement des pouvoirs des forces de l'ordre",
            results: {
                pol3: "pour", pol5: "pour", pol7: "pour",
                pol12: "pour", pol13: "pour"
            }
        },
        {
            id: "vote7",
            title: "Fin de vie",
            date: "2024-05-15",
            description: "Projet de loi sur l'aide active à mourir",
            results: {
                pol6: "pour", pol8: "pour", pol9: "pour",
                pol11: "pour", pol14: "pour"
            }
        }
    ],

    companies: [
        {
            id: "ent1",
            name: "Énergies Renouvelables SA",
            sector: "Énergie",
            description: "Société de production d'énergies renouvelables",
            icon: "⚡"
        },
        {
            id: "ent2",
            name: "Immobilière du Centre",
            sector: "Immobilier",
            description: "Société de gestion immobilière",
            icon: "🏢"
        },
        {
            id: "ent3",
            name: "Médias Régionaux SARL",
            sector: "Médias",
            description: "Groupe de presse régionale",
            icon: "📰"
        },
        {
            id: "ent4",
            name: "Conseil Finance Plus",
            sector: "Finance",
            description: "Cabinet de conseil en gestion de patrimoine",
            icon: "📊"
        },
        {
            id: "ent5",
            name: "Pharma Innovation",
            sector: "Santé",
            description: "Laboratoire pharmaceutique",
            icon: "💊"
        },
        {
            id: "ent6",
            name: "Tech Solutions France",
            sector: "Technologie",
            description: "ESN spécialisée dans le cloud",
            icon: "💻"
        }
    ],

    // Couleurs des partis pour référence
    partyColors: {
        "Renaissance": "#FFD700",
        "LFI": "#CC2443",
        "RN": "#0D378A",
        "LR": "#0066CC",
        "EELV": "#00A86B",
        "PS": "#FF8080",
        "MoDem": "#FF9900",
        "Horizons": "#00B7EB"
    }
};

// Fonction utilitaire pour obtenir tous les partis uniques
function getUniqueParties() {
    const parties = new Set(DATA.politicians.map(p => p.party));
    return Array.from(parties).sort();
}

// Fonction pour obtenir un politicien par ID
function getPoliticianById(id) {
    return DATA.politicians.find(p => p.id === id);
}

// Fonction pour obtenir une commission par ID
function getCommissionById(id) {
    return DATA.commissions.find(c => c.id === id);
}

// Fonction pour obtenir un vote par ID
function getVoteById(id) {
    return DATA.votes.find(v => v.id === id);
}

// Fonction pour obtenir une entreprise par ID
function getCompanyById(id) {
    return DATA.companies.find(e => e.id === id);
}

// Fonction pour obtenir la couleur d'un parti
function getPartyColor(party) {
    return DATA.partyColors[party] || "#888888";
}

// Génération des noeuds et liens pour D3.js
function generateGraphData(filters = {}) {
    const nodes = [];
    const links = [];
    const nodeMap = new Map();

    // Filtres actifs
    const activeParties = filters.parties || getUniqueParties();
    const activeLinkTypes = filters.linkTypes || ['commission', 'company', 'vote', 'personal'];

    // Ajouter les politiciens filtrés
    DATA.politicians.forEach(pol => {
        if (activeParties.includes(pol.party)) {
            nodes.push({
                id: pol.id,
                name: pol.name,
                type: 'politician',
                party: pol.party,
                role: pol.role,
                initials: pol.initials,
                radius: 25
            });
            nodeMap.set(pol.id, true);
        }
    });

    // Ajouter les commissions et leurs liens
    if (activeLinkTypes.includes('commission')) {
        DATA.commissions.forEach(com => {
            const linkedPoliticians = DATA.politicians.filter(
                p => p.commissions.includes(com.id) && nodeMap.has(p.id)
            );

            if (linkedPoliticians.length > 0) {
                if (!nodeMap.has(com.id)) {
                    nodes.push({
                        id: com.id,
                        name: com.name,
                        type: 'commission',
                        description: com.description,
                        icon: com.icon,
                        radius: 18
                    });
                    nodeMap.set(com.id, true);
                }

                linkedPoliticians.forEach(pol => {
                    links.push({
                        source: pol.id,
                        target: com.id,
                        type: 'commission'
                    });
                });
            }
        });
    }

    // Ajouter les entreprises et leurs liens
    if (activeLinkTypes.includes('company')) {
        DATA.companies.forEach(ent => {
            const linkedPoliticians = DATA.politicians.filter(
                p => p.companies.includes(ent.id) && nodeMap.has(p.id)
            );

            if (linkedPoliticians.length > 0) {
                if (!nodeMap.has(ent.id)) {
                    nodes.push({
                        id: ent.id,
                        name: ent.name,
                        type: 'company',
                        sector: ent.sector,
                        description: ent.description,
                        icon: ent.icon,
                        radius: 16
                    });
                    nodeMap.set(ent.id, true);
                }

                linkedPoliticians.forEach(pol => {
                    links.push({
                        source: pol.id,
                        target: ent.id,
                        type: 'company'
                    });
                });
            }
        });
    }

    // Ajouter les votes et leurs liens
    if (activeLinkTypes.includes('vote')) {
        DATA.votes.forEach(vote => {
            const linkedPoliticians = DATA.politicians.filter(
                p => vote.results[p.id] && nodeMap.has(p.id)
            );

            if (linkedPoliticians.length > 0) {
                if (!nodeMap.has(vote.id)) {
                    nodes.push({
                        id: vote.id,
                        name: vote.title,
                        type: 'vote',
                        date: vote.date,
                        description: vote.description,
                        radius: 14
                    });
                    nodeMap.set(vote.id, true);
                }

                linkedPoliticians.forEach(pol => {
                    links.push({
                        source: pol.id,
                        target: vote.id,
                        type: 'vote',
                        voteResult: vote.results[pol.id]
                    });
                });
            }
        });
    }

    // Ajouter les liens personnels
    if (activeLinkTypes.includes('personal')) {
        DATA.politicians.forEach(pol => {
            if (nodeMap.has(pol.id)) {
                pol.personalLinks.forEach(link => {
                    if (nodeMap.has(link.targetId)) {
                        // Éviter les doublons (A->B et B->A)
                        const existingLink = links.find(
                            l => l.type === 'personal' &&
                            ((l.source === pol.id && l.target === link.targetId) ||
                             (l.source === link.targetId && l.target === pol.id))
                        );

                        if (!existingLink) {
                            links.push({
                                source: pol.id,
                                target: link.targetId,
                                type: 'personal',
                                relation: link.relation
                            });
                        }
                    }
                });
            }
        });
    }

    return { nodes, links };
}
