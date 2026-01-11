-- Schema Supabase pour l'application Liens d'Intérêt des Politiciens
-- À exécuter dans l'éditeur SQL de Supabase

-- ===========================================
-- TABLES PRINCIPALES
-- ===========================================

-- Partis politiques
CREATE TABLE parties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    short_name VARCHAR(20),
    color VARCHAR(7) DEFAULT '#888888',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Politiciens
CREATE TABLE politicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(100) UNIQUE, -- ID depuis nosdeputes.fr ou autre source
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    party_id UUID REFERENCES parties(id),
    role VARCHAR(200), -- "Député de Paris (7e)"
    photo_url TEXT,
    twitter_handle VARCHAR(50),
    birth_date DATE,
    profession VARCHAR(200),
    legislature INT DEFAULT 17, -- Législature actuelle
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commissions parlementaires
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(100) UNIQUE,
    name VARCHAR(300) NOT NULL,
    short_name VARCHAR(100),
    description TEXT,
    type VARCHAR(50) DEFAULT 'permanente', -- permanente, enquête, spéciale
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Entreprises / Organismes
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siren VARCHAR(20) UNIQUE,
    name VARCHAR(300) NOT NULL,
    sector VARCHAR(100),
    description TEXT,
    website TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes / Scrutins
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(100) UNIQUE, -- ID depuis nosdeputes.fr
    title VARCHAR(500) NOT NULL,
    description TEXT,
    vote_date DATE NOT NULL,
    type VARCHAR(50), -- solennel, ordinaire
    result VARCHAR(20), -- adopté, rejeté
    pour INT DEFAULT 0,
    contre INT DEFAULT 0,
    abstention INT DEFAULT 0,
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABLES DE LIAISON
-- ===========================================

-- Politiciens <-> Commissions
CREATE TABLE politician_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    politician_id UUID REFERENCES politicians(id) ON DELETE CASCADE,
    commission_id UUID REFERENCES commissions(id) ON DELETE CASCADE,
    role VARCHAR(100) DEFAULT 'membre', -- président, vice-président, membre
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(politician_id, commission_id)
);

-- Politiciens <-> Entreprises (déclarations HATVP)
CREATE TABLE politician_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    politician_id UUID REFERENCES politicians(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    role VARCHAR(200), -- actionnaire, administrateur, consultant
    stake_percentage DECIMAL(5,2), -- pourcentage de participation
    remuneration DECIMAL(12,2), -- rémunération annuelle si connue
    start_date DATE,
    end_date DATE,
    declaration_year INT,
    source VARCHAR(50) DEFAULT 'hatvp',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes des politiciens sur chaque scrutin
CREATE TABLE politician_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    politician_id UUID REFERENCES politicians(id) ON DELETE CASCADE,
    vote_id UUID REFERENCES votes(id) ON DELETE CASCADE,
    position VARCHAR(20) NOT NULL, -- pour, contre, abstention, absent
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(politician_id, vote_id)
);

-- Liens personnels entre politiciens
CREATE TABLE politician_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    politician_id UUID REFERENCES politicians(id) ON DELETE CASCADE,
    related_politician_id UUID REFERENCES politicians(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL, -- conjoint, parent, enfant, collaborateur
    description VARCHAR(200),
    start_date DATE,
    end_date DATE,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(politician_id, related_politician_id, relationship_type)
);

-- ===========================================
-- INDEX POUR PERFORMANCE
-- ===========================================

CREATE INDEX idx_politicians_party ON politicians(party_id);
CREATE INDEX idx_politicians_active ON politicians(is_active);
CREATE INDEX idx_politicians_name ON politicians(last_name, first_name);

CREATE INDEX idx_pol_commissions_pol ON politician_commissions(politician_id);
CREATE INDEX idx_pol_commissions_com ON politician_commissions(commission_id);

CREATE INDEX idx_pol_companies_pol ON politician_companies(politician_id);
CREATE INDEX idx_pol_companies_com ON politician_companies(company_id);

CREATE INDEX idx_pol_votes_pol ON politician_votes(politician_id);
CREATE INDEX idx_pol_votes_vote ON politician_votes(vote_id);
CREATE INDEX idx_pol_votes_position ON politician_votes(position);

CREATE INDEX idx_votes_date ON votes(vote_date DESC);

CREATE INDEX idx_relationships_pol ON politician_relationships(politician_id);
CREATE INDEX idx_relationships_related ON politician_relationships(related_politician_id);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Activer RLS sur toutes les tables
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE politicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE politician_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE politician_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE politician_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE politician_relationships ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique (anon et authenticated)
CREATE POLICY "Public read access" ON parties FOR SELECT USING (true);
CREATE POLICY "Public read access" ON politicians FOR SELECT USING (true);
CREATE POLICY "Public read access" ON commissions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON companies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON votes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON politician_commissions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON politician_companies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON politician_votes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON politician_relationships FOR SELECT USING (true);

-- ===========================================
-- FONCTIONS UTILES
-- ===========================================

-- Fonction pour obtenir toutes les connexions d'un politicien
CREATE OR REPLACE FUNCTION get_politician_connections(pol_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'commissions', (
            SELECT json_agg(json_build_object(
                'id', c.id,
                'name', c.name,
                'role', pc.role
            ))
            FROM politician_commissions pc
            JOIN commissions c ON c.id = pc.commission_id
            WHERE pc.politician_id = pol_id
        ),
        'companies', (
            SELECT json_agg(json_build_object(
                'id', co.id,
                'name', co.name,
                'role', pco.role,
                'stake', pco.stake_percentage
            ))
            FROM politician_companies pco
            JOIN companies co ON co.id = pco.company_id
            WHERE pco.politician_id = pol_id
        ),
        'votes', (
            SELECT json_agg(json_build_object(
                'id', v.id,
                'title', v.title,
                'date', v.vote_date,
                'position', pv.position
            ))
            FROM politician_votes pv
            JOIN votes v ON v.id = pv.vote_id
            WHERE pv.politician_id = pol_id
            ORDER BY v.vote_date DESC
            LIMIT 20
        ),
        'relationships', (
            SELECT json_agg(json_build_object(
                'id', p.id,
                'name', p.full_name,
                'party', pa.name,
                'type', pr.relationship_type,
                'description', pr.description
            ))
            FROM politician_relationships pr
            JOIN politicians p ON p.id = pr.related_politician_id
            LEFT JOIN parties pa ON pa.id = p.party_id
            WHERE pr.politician_id = pol_id
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour générer les données du graphe
CREATE OR REPLACE FUNCTION get_graph_data(
    party_filter TEXT[] DEFAULT NULL,
    link_types TEXT[] DEFAULT ARRAY['commission', 'company', 'vote', 'personal']
)
RETURNS JSON AS $$
DECLARE
    nodes JSON;
    links JSON;
BEGIN
    -- Noeuds politiciens
    WITH pol_nodes AS (
        SELECT
            p.id,
            p.full_name as name,
            'politician' as type,
            pa.name as party,
            pa.color as party_color,
            p.role,
            UPPER(LEFT(p.first_name, 1) || LEFT(p.last_name, 1)) as initials
        FROM politicians p
        LEFT JOIN parties pa ON pa.id = p.party_id
        WHERE p.is_active = true
        AND (party_filter IS NULL OR pa.name = ANY(party_filter))
    ),
    -- Noeuds commissions
    com_nodes AS (
        SELECT DISTINCT
            c.id,
            c.name,
            'commission' as type,
            NULL as party,
            NULL as party_color,
            c.description as role,
            NULL as initials
        FROM commissions c
        JOIN politician_commissions pc ON pc.commission_id = c.id
        JOIN pol_nodes pn ON pn.id = pc.politician_id
        WHERE 'commission' = ANY(link_types)
    ),
    -- Combiner tous les noeuds
    all_nodes AS (
        SELECT * FROM pol_nodes
        UNION ALL
        SELECT * FROM com_nodes
    )
    SELECT json_agg(row_to_json(all_nodes)) INTO nodes FROM all_nodes;

    -- Liens
    WITH pol_ids AS (
        SELECT p.id
        FROM politicians p
        LEFT JOIN parties pa ON pa.id = p.party_id
        WHERE p.is_active = true
        AND (party_filter IS NULL OR pa.name = ANY(party_filter))
    ),
    commission_links AS (
        SELECT
            pc.politician_id as source,
            pc.commission_id as target,
            'commission' as type
        FROM politician_commissions pc
        WHERE pc.politician_id IN (SELECT id FROM pol_ids)
        AND 'commission' = ANY(link_types)
    ),
    personal_links AS (
        SELECT
            pr.politician_id as source,
            pr.related_politician_id as target,
            'personal' as type
        FROM politician_relationships pr
        WHERE pr.politician_id IN (SELECT id FROM pol_ids)
        AND pr.related_politician_id IN (SELECT id FROM pol_ids)
        AND 'personal' = ANY(link_types)
    ),
    all_links AS (
        SELECT * FROM commission_links
        UNION ALL
        SELECT * FROM personal_links
    )
    SELECT json_agg(row_to_json(all_links)) INTO links FROM all_links;

    RETURN json_build_object('nodes', COALESCE(nodes, '[]'::json), 'links', COALESCE(links, '[]'::json));
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- DONNÉES INITIALES (Partis)
-- ===========================================

INSERT INTO parties (name, short_name, color) VALUES
    ('Renaissance', 'RE', '#FFD700'),
    ('La France Insoumise', 'LFI', '#CC2443'),
    ('Rassemblement National', 'RN', '#0D378A'),
    ('Les Républicains', 'LR', '#0066CC'),
    ('Europe Écologie Les Verts', 'EELV', '#00A86B'),
    ('Parti Socialiste', 'PS', '#FF8080'),
    ('MoDem', 'MoDem', '#FF9900'),
    ('Horizons', 'HOR', '#00B7EB'),
    ('Parti Communiste', 'PCF', '#DD0000'),
    ('Libertés, Indépendants, Outre-mer et Territoires', 'LIOT', '#2E8B57')
ON CONFLICT (name) DO NOTHING;
