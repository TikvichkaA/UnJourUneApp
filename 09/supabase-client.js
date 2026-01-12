// Client Supabase pour le frontend
// Utilise l'API REST de Supabase via fetch

// Fonction pour rendre les titres de votes plus lisibles
function formatVoteTitle(title) {
    if (!title) return 'Vote';

    // Motion de censure
    if (title.includes('motion de censure')) {
        const match = title.match(/par M\. ([^,]+)|par Mme ([^,]+)/);
        const author = match ? (match[1] || match[2]) : '';
        return `Motion de censure${author ? ` (${author})` : ''}`;
    }

    // Motion de rejet préalable
    if (title.includes('motion de rejet')) {
        const textMatch = title.match(/de (?:la |le )?(proposition de loi|projet de loi)[^(]*/i);
        if (textMatch) {
            let sujet = textMatch[0].replace(/de (?:la |le )?/i, '').trim();
            if (sujet.length > 50) sujet = sujet.substring(0, 50) + '...';
            return `Rejet préalable: ${sujet}`;
        }
        return 'Motion de rejet préalable';
    }

    // Ensemble du projet/proposition (vote final)
    if (title.includes('ensemble du projet') || title.includes('ensemble de la proposition')) {
        if (title.includes('projet de loi de finances')) {
            const yearMatch = title.match(/pour (\d{4})/);
            return yearMatch ? `Vote final: PLF ${yearMatch[1]}` : 'Vote final: PLF';
        }
        if (title.includes('proposition de loi')) {
            const sujetMatch = title.match(/proposition de loi (?:visant à |relative à |organique )?([^(]+)/i);
            if (sujetMatch) {
                let sujet = sujetMatch[1].trim();
                if (sujet.length > 45) sujet = sujet.substring(0, 45) + '...';
                return `Vote final: ${sujet}`;
            }
        }
        if (title.includes('proposition de résolution')) {
            const sujetMatch = title.match(/proposition de résolution (?:tendant à )?([^(]+)/i);
            if (sujetMatch) {
                let sujet = sujetMatch[1].trim();
                if (sujet.length > 45) sujet = sujet.substring(0, 45) + '...';
                return `Résolution: ${sujet}`;
            }
        }
        return 'Vote final';
    }

    // Vote sur un article
    if (title.match(/l'article\s+(\d+|unique|premier)/i)) {
        const artMatch = title.match(/l'article\s+(\d+|unique|premier)/i);
        const article = artMatch ? artMatch[1] : '';

        if (title.includes('proposition de loi')) {
            const sujetMatch = title.match(/proposition de loi (?:visant à |relative à )?([^(]+)/i);
            if (sujetMatch) {
                let sujet = sujetMatch[1].trim();
                if (sujet.length > 35) sujet = sujet.substring(0, 35) + '...';
                return `Art. ${article}: ${sujet}`;
            }
        }
        if (title.includes('projet de loi de finances')) {
            const yearMatch = title.match(/pour (\d{4})/);
            return yearMatch ? `Art. ${article} PLF ${yearMatch[1]}` : `Art. ${article} PLF`;
        }
        return `Article ${article}`;
    }

    // Fallback: tronquer intelligemment
    if (title.length > 55) {
        return title.substring(0, 52) + '...';
    }
    return title;
}

class SupabaseClient {
    constructor(url, anonKey) {
        this.baseUrl = `${url}/rest/v1`;
        this.headers = {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json'
        };
    }

    async query(table, options = {}) {
        let url = `${this.baseUrl}/${table}`;
        const params = new URLSearchParams();

        if (options.select) {
            params.append('select', options.select);
        }
        if (options.filter) {
            for (const [key, value] of Object.entries(options.filter)) {
                params.append(key, value);
            }
        }
        if (options.order) {
            params.append('order', options.order);
        }
        if (options.limit) {
            params.append('limit', options.limit);
        }

        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        const response = await fetch(url, { headers: this.headers });

        if (!response.ok) {
            console.error(`Supabase error: ${response.status}`, await response.text());
            return [];
        }

        return response.json();
    }
}

// Service de données unifié
class DataService {
    constructor() {
        this.useSupabase = USE_SUPABASE;

        if (this.useSupabase) {
            this.client = new SupabaseClient(
                CONFIG.supabase.url,
                CONFIG.supabase.anonKey
            );
        }

        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000;
    }

    getCached(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    // ==========================================
    // POLITICIENS
    // ==========================================

    async getPoliticians() {
        if (!this.useSupabase) {
            return DATA.politicians;
        }

        const cached = this.getCached('politicians');
        if (cached) return cached;

        const data = await this.client.query('politicians', {
            select: 'id,first_name,last_name,full_name,role,photo_url,party_id,parties(id,name,color)',
            filter: { is_active: 'eq.true' },
            order: 'last_name.asc'
        });

        // Transformer pour compatibilité
        const politicians = data.map(p => ({
            id: p.id,
            name: p.full_name,
            firstName: p.first_name,
            lastName: p.last_name,
            party: p.parties?.name || 'Sans étiquette',
            partyColor: p.parties?.color || '#888888',
            role: p.role,
            photo: p.photo_url,
            initials: (p.first_name?.[0] || '') + (p.last_name?.[0] || '')
        }));

        this.setCache('politicians', politicians);
        return politicians;
    }

    async getPoliticianById(id) {
        if (!this.useSupabase) {
            return getPoliticianById(id);
        }

        const data = await this.client.query('politicians', {
            select: 'id,first_name,last_name,full_name,role,photo_url,party_id,parties(id,name,color)',
            filter: { id: `eq.${id}` },
            limit: 1
        });

        if (!data[0]) return null;

        const p = data[0];
        return {
            id: p.id,
            name: p.full_name,
            firstName: p.first_name,
            lastName: p.last_name,
            party: p.parties?.name || 'Sans étiquette',
            partyColor: p.parties?.color || '#888888',
            role: p.role,
            photo: p.photo_url,
            initials: (p.first_name?.[0] || '') + (p.last_name?.[0] || '')
        };
    }

    // ==========================================
    // COMMISSIONS
    // ==========================================

    async getCommissions(typeFilter = null) {
        if (!this.useSupabase) {
            return DATA.commissions;
        }

        const cacheKey = typeFilter ? `commissions_${typeFilter}` : 'commissions';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const options = {
            select: 'id,name,short_name,description,type',
            order: 'name.asc'
        };

        if (typeFilter) {
            options.filter = { type: `eq.${typeFilter}` };
        }

        const data = await this.client.query('commissions', options);

        this.setCache(cacheKey, data);
        return data;
    }

    async getPoliticianCommissions(politicianId) {
        if (!this.useSupabase) {
            const pol = getPoliticianById(politicianId);
            return pol?.commissions?.map(id => getCommissionById(id)).filter(Boolean) || [];
        }

        const data = await this.client.query('politician_commissions', {
            select: 'role,commissions(id,name,short_name,type)',
            filter: { politician_id: `eq.${politicianId}` }
        });

        return data.map(d => ({
            ...d.commissions,
            memberRole: d.role
        }));
    }

    // ==========================================
    // VOTES
    // ==========================================

    async getVotes(limit = 50, excludeAmendments = true) {
        if (!this.useSupabase) {
            return DATA.votes.slice(0, limit);
        }

        const cacheKey = `votes_${limit}_${excludeAmendments}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const options = {
            select: 'id,title,description,vote_date,type,result,pour,contre,abstention,source_url',
            order: 'vote_date.desc',
            limit: limit
        };

        // Exclure les amendements si demandé
        if (excludeAmendments) {
            options.filter = { title: 'not.ilike.*amendement*' };
        }

        const data = await this.client.query('votes', options);

        this.setCache(cacheKey, data);
        return data;
    }

    async getVoteById(voteId) {
        if (!this.useSupabase) {
            return getVoteById(voteId);
        }

        const data = await this.client.query('votes', {
            select: 'id,title,description,vote_date,type,result,pour,contre,abstention,source_url',
            filter: { id: `eq.${voteId}` },
            limit: 1
        });

        return data[0] || null;
    }

    async getPoliticianVotes(politicianId) {
        if (!this.useSupabase) {
            const pol = getPoliticianById(politicianId);
            return pol?.votes?.map(id => {
                const vote = getVoteById(id);
                if (vote) {
                    return { ...vote, position: vote.results[politicianId] };
                }
                return null;
            }).filter(Boolean) || [];
        }

        const data = await this.client.query('politician_votes', {
            select: 'position,votes(id,title,vote_date,result,source_url)',
            filter: { politician_id: `eq.${politicianId}` },
            order: 'votes.vote_date.desc',
            limit: 50  // Plus pour avoir assez après filtrage
        });

        // Filtrer pour exclure les amendements et limiter à 20
        return data
            .filter(d => d.votes && !d.votes.title?.toLowerCase().includes('amendement'))
            .slice(0, 20)
            .map(d => ({
                ...d.votes,
                position: d.position
        }));
    }

    // ==========================================
    // ENTREPRISES
    // ==========================================

    async getPoliticianCompanies(politicianId) {
        if (!this.useSupabase) {
            const pol = getPoliticianById(politicianId);
            return pol?.companies?.map(id => getCompanyById(id)).filter(Boolean) || [];
        }

        const data = await this.client.query('politician_companies', {
            select: 'role,stake_percentage,companies(id,name,sector,description)',
            filter: { politician_id: `eq.${politicianId}` }
        });

        return data.map(d => ({
            ...d.companies,
            companyRole: d.role,
            stake: d.stake_percentage
        }));
    }

    // ==========================================
    // LIENS PERSONNELS
    // ==========================================

    async getPoliticianRelationships(politicianId) {
        if (!this.useSupabase) {
            const pol = getPoliticianById(politicianId);
            return pol?.personalLinks?.map(link => {
                const target = getPoliticianById(link.targetId);
                return target ? { ...target, relation: link.relation } : null;
            }).filter(Boolean) || [];
        }

        const data = await this.client.query('politician_relationships', {
            select: 'relationship_type,description,related:related_politician_id(id,full_name,parties(name,color))',
            filter: { politician_id: `eq.${politicianId}` }
        });

        return data.map(d => ({
            id: d.related?.id,
            name: d.related?.full_name,
            party: d.related?.parties?.name,
            partyColor: d.related?.parties?.color,
            relation: d.description || d.relationship_type
        })).filter(d => d.id);
    }

    // ==========================================
    // PARTIS
    // ==========================================

    async getParties() {
        if (!this.useSupabase) {
            return getUniqueParties().map(name => ({
                name,
                color: getPartyColor(name)
            }));
        }

        const cached = this.getCached('parties');
        if (cached) return cached;

        const data = await this.client.query('parties', {
            select: 'id,name,short_name,color',
            order: 'name.asc'
        });

        this.setCache('parties', data);
        return data;
    }

    // ==========================================
    // VOTES PAR COMMISSION
    // ==========================================

    async getCommissionVotes(commissionId, limit = 10) {
        if (!this.useSupabase) return [];

        // Récupérer les membres de la commission
        const members = await this.client.query('politician_commissions', {
            select: 'politician_id',
            filter: { commission_id: `eq.${commissionId}` }
        });

        if (members.length === 0) return [];

        const memberIds = members.map(m => m.politician_id);

        // Récupérer les votes récents
        const votes = await this.getVotes(limit);

        // Pour chaque vote, compter les positions des membres
        const voteStats = [];

        for (const vote of votes) {
            const positions = await this.client.query('politician_votes', {
                select: 'politician_id,position',
                filter: { vote_id: `eq.${vote.id}` }
            });

            const memberPositions = positions.filter(p => memberIds.includes(p.politician_id));

            if (memberPositions.length > 0) {
                const pour = memberPositions.filter(p => p.position === 'pour').length;
                const contre = memberPositions.filter(p => p.position === 'contre').length;
                const abstention = memberPositions.filter(p => p.position === 'abstention').length;

                voteStats.push({
                    ...vote,
                    formattedTitle: formatVoteTitle(vote.title),
                    memberStats: { pour, contre, abstention, total: memberPositions.length }
                });
            }
        }

        return voteStats;
    }

    // ==========================================
    // GRAPHE
    // ==========================================

    async getGraphData(filters = {}) {
        if (!this.useSupabase) {
            return generateGraphData(filters);
        }

        // Charger les données nécessaires
        const politicians = await this.getPoliticians();

        const nodes = [];
        const links = [];
        const nodeMap = new Map();

        // Filtrer les partis si nécessaire
        let filteredPols = politicians;
        if (filters.parties?.length) {
            filteredPols = politicians.filter(p => filters.parties.includes(p.party));
        }

        // Limiter le nombre de politiciens si spécifié
        if (filters.maxPoliticians && filters.maxPoliticians > 0) {
            filteredPols = filteredPols.slice(0, filters.maxPoliticians);
        }

        // Ajouter les politiciens
        for (const pol of filteredPols) {
            nodes.push({
                id: pol.id,
                name: pol.name,
                type: 'politician',
                party: pol.party,
                partyColor: pol.partyColor,
                role: pol.role,
                initials: pol.initials,
                radius: 25
            });
            nodeMap.set(pol.id, true);
        }

        // Ajouter les commissions permanentes
        if (!filters.linkTypes || filters.linkTypes.includes('commission')) {
            // Filtrer par type de commission si spécifié
            const commissionTypeFilter = filters.commissionType || null;
            const commissions = await this.getCommissions(commissionTypeFilter);

            const polCommissions = await this.client.query('politician_commissions', {
                select: 'politician_id,commission_id'
            });

            const commissionMembers = new Map();

            for (const pc of polCommissions) {
                if (!nodeMap.has(pc.politician_id)) continue;

                if (!commissionMembers.has(pc.commission_id)) {
                    commissionMembers.set(pc.commission_id, []);
                }
                commissionMembers.get(pc.commission_id).push(pc.politician_id);
            }

            for (const com of commissions) {
                // Ignorer les commissions sans vrai nom (contenant un ID comme "PO12345")
                if (com.name && com.name.match(/\(PO\d+\)$/)) continue;

                const members = commissionMembers.get(com.id) || [];
                if (members.length === 0) continue;

                if (!nodeMap.has(com.id)) {
                    nodes.push({
                        id: com.id,
                        name: com.short_name || com.name,
                        type: 'commission',
                        commissionType: com.type,
                        description: com.name,
                        radius: 18
                    });
                    nodeMap.set(com.id, true);
                }

                for (const polId of members) {
                    links.push({
                        source: polId,
                        target: com.id,
                        type: 'commission'
                    });
                }
            }
        }

        // Ajouter les votes récents
        if (!filters.linkTypes || filters.linkTypes.includes('vote')) {
            const votes = await this.getVotes(20);  // Plus de votes
            const voteIds = votes.map(v => v.id);

            // Ne charger que les positions pour ces votes spécifiques
            const polVotesPromises = voteIds.map(voteId =>
                this.client.query('politician_votes', {
                    select: 'politician_id,vote_id,position',
                    filter: { vote_id: `eq.${voteId}` },
                    limit: 300
                })
            );

            const allPolVotes = (await Promise.all(polVotesPromises)).flat();

            for (const vote of votes) {
                const participants = allPolVotes.filter(pv =>
                    pv.vote_id === vote.id && nodeMap.has(pv.politician_id)
                );

                if (participants.length === 0) continue;

                // Formater le nom du vote
                const formattedName = formatVoteTitle(vote.title);

                nodes.push({
                    id: vote.id,
                    name: formattedName,
                    type: 'vote',
                    date: vote.vote_date,
                    description: vote.title,
                    radius: 12
                });
                nodeMap.set(vote.id, true);

                for (const pv of participants) {
                    links.push({
                        source: pv.politician_id,
                        target: vote.id,
                        type: 'vote',
                        voteResult: pv.position
                    });
                }
            }
        }

        // Ajouter les entreprises (participations HATVP)
        if (!filters.linkTypes || filters.linkTypes.includes('company')) {
            const polCompanies = await this.client.query('politician_companies', {
                select: 'politician_id,company_id,role,companies(id,name,sector)'
            });

            const companyMembers = new Map();

            for (const pc of polCompanies) {
                if (!nodeMap.has(pc.politician_id)) continue;
                if (!pc.companies) continue;

                if (!companyMembers.has(pc.company_id)) {
                    companyMembers.set(pc.company_id, {
                        company: pc.companies,
                        politicians: []
                    });
                }
                companyMembers.get(pc.company_id).politicians.push({
                    id: pc.politician_id,
                    role: pc.role
                });
            }

            // Limiter aux entreprises avec au moins 1 politicien visible
            for (const [companyId, data] of companyMembers) {
                if (data.politicians.length === 0) continue;

                if (!nodeMap.has(companyId)) {
                    nodes.push({
                        id: companyId,
                        name: data.company.name,
                        type: 'company',
                        sector: data.company.sector,
                        radius: 15
                    });
                    nodeMap.set(companyId, true);
                }

                for (const pol of data.politicians) {
                    links.push({
                        source: pol.id,
                        target: companyId,
                        type: 'company'
                    });
                }
            }
        }

        return { nodes, links };
    }
}

// Instance globale
const dataService = new DataService();
