-- ============================================
-- EcoProfil - Schema Supabase pour Vue d'Ensemble
-- ============================================

-- Table des administrateurs
CREATE TABLE admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'admin', -- 'admin', 'super_admin'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des profils utilisateurs
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Informations personnelles
    age_range TEXT,
    city TEXT,
    profession TEXT,
    education TEXT,

    -- Mobilité
    transport_modes TEXT[], -- Array de modes de transport
    commute_distance TEXT,
    flight_frequency TEXT,

    -- Consommation
    diet TEXT,
    local_purchase INTEGER, -- Pourcentage 0-100
    anti_waste TEXT[], -- Array de pratiques
    housing TEXT,

    -- Engagement
    vote_frequency TEXT,
    associations TEXT[], -- Array d'associations
    interests TEXT[], -- Array de centres d'intérêt

    -- Compétences & Loisirs
    skills TEXT[], -- Array de compétences
    hobbies TEXT[], -- Array de loisirs
    availability TEXT
);

-- Table des questions/sondages
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array d'options sous forme JSON
    category TEXT, -- 'ecology', 'mobility', 'local', etc.
    city TEXT, -- Pour cibler une commune spécifique (NULL = toutes)
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Table des réponses aux questions
CREATE TABLE responses (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    selected_option INTEGER NOT NULL, -- Index de l'option choisie
    responded_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, question_id) -- Un utilisateur ne peut répondre qu'une fois par question
);

-- Table des notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'question', 'reminder', 'info'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    question_id INTEGER REFERENCES questions(id) ON DELETE SET NULL,
    action TEXT, -- 'complete_profile', etc.
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS) - Sécurité
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Policies pour profiles
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent créer leur profil"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policies pour responses
CREATE POLICY "Les utilisateurs peuvent voir leurs propres réponses"
    ON responses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leurs réponses"
    ON responses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policies pour notifications
CREATE POLICY "Les utilisateurs peuvent voir leurs notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent marquer leurs notifications comme lues"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Policies pour questions (lecture publique pour les utilisateurs connectés)
CREATE POLICY "Les utilisateurs connectés peuvent voir les questions actives"
    ON questions FOR SELECT
    USING (auth.role() = 'authenticated' AND active = TRUE);

-- Policies pour admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les admins peuvent tout voir"
    ON admins FOR SELECT
    USING (auth.uid() = id);

-- Fonction pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM admins WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies admin pour la gestion complète
CREATE POLICY "Les admins peuvent créer des questions"
    ON questions FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Les admins peuvent modifier les questions"
    ON questions FOR UPDATE
    USING (is_admin(auth.uid()));

CREATE POLICY "Les admins peuvent supprimer les questions"
    ON questions FOR DELETE
    USING (is_admin(auth.uid()));

CREATE POLICY "Les admins peuvent créer des notifications"
    ON notifications FOR INSERT
    WITH CHECK (is_admin(auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Les admins peuvent voir tous les profils (anonymisé)"
    ON profiles FOR SELECT
    USING (auth.uid() = id OR is_admin(auth.uid()));

CREATE POLICY "Les admins peuvent voir toutes les réponses (anonymisé)"
    ON responses FOR SELECT
    USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- ============================================
-- Fonctions utilitaires
-- ============================================

-- Fonction pour calculer le taux de complétion du profil
CREATE OR REPLACE FUNCTION calculate_profile_completion(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_fields INTEGER := 9;
    filled_fields INTEGER := 0;
    profile_row profiles%ROWTYPE;
BEGIN
    SELECT * INTO profile_row FROM profiles WHERE id = profile_id;

    IF profile_row.age_range IS NOT NULL AND profile_row.age_range != '' THEN filled_fields := filled_fields + 1; END IF;
    IF profile_row.city IS NOT NULL AND profile_row.city != '' THEN filled_fields := filled_fields + 1; END IF;
    IF profile_row.profession IS NOT NULL AND profile_row.profession != '' THEN filled_fields := filled_fields + 1; END IF;
    IF profile_row.education IS NOT NULL AND profile_row.education != '' THEN filled_fields := filled_fields + 1; END IF;
    IF profile_row.transport_modes IS NOT NULL AND array_length(profile_row.transport_modes, 1) > 0 THEN filled_fields := filled_fields + 1; END IF;
    IF profile_row.diet IS NOT NULL AND profile_row.diet != '' THEN filled_fields := filled_fields + 1; END IF;
    IF profile_row.vote_frequency IS NOT NULL AND profile_row.vote_frequency != '' THEN filled_fields := filled_fields + 1; END IF;
    IF profile_row.skills IS NOT NULL AND array_length(profile_row.skills, 1) > 0 THEN filled_fields := filled_fields + 1; END IF;
    IF profile_row.availability IS NOT NULL AND profile_row.availability != '' THEN filled_fields := filled_fields + 1; END IF;

    RETURN ROUND((filled_fields::DECIMAL / total_fields) * 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour créer une notification de bienvenue
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (
        NEW.id,
        'info',
        'Bienvenue !',
        'Merci d''avoir rejoint Vue d''Ensemble. Ensemble, catalysons l''action écologique !'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour notification de bienvenue
CREATE TRIGGER on_profile_created
    AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Données initiales - Questions
-- ============================================

INSERT INTO questions (title, question, options, category) VALUES
(
    'Composteurs collectifs',
    'Êtes-vous favorable à l''installation de composteurs collectifs dans votre quartier ?',
    '["Oui, totalement favorable", "Plutôt favorable", "Plutôt défavorable", "Non, défavorable", "Sans opinion"]',
    'ecology'
),
(
    'Mobilité alternative',
    'Quel mode de transport alternatif souhaiteriez-vous voir développé en priorité sur le territoire ?',
    '["Pistes cyclables sécurisées", "Transports en commun plus fréquents", "Stations de covoiturage", "Parkings vélos sécurisés", "Navettes électriques"]',
    'mobility'
),
(
    'Marchés locaux',
    'Seriez-vous intéressé par l''organisation de marchés de producteurs locaux le week-end ?',
    '["Oui, le samedi matin", "Oui, le dimanche matin", "Oui, peu importe le jour", "Non, pas intéressé"]',
    'local'
);

-- ============================================
-- Vue pour statistiques anonymisées (admin)
-- ============================================

CREATE VIEW stats_overview AS
SELECT
    COUNT(DISTINCT p.id) as total_users,
    COUNT(DISTINCT r.user_id) as users_with_responses,
    COUNT(r.id) as total_responses,
    AVG(calculate_profile_completion(p.id)) as avg_profile_completion
FROM profiles p
LEFT JOIN responses r ON p.id = r.user_id;

CREATE VIEW stats_by_city AS
SELECT
    city,
    COUNT(*) as user_count,
    AVG(calculate_profile_completion(id)) as avg_completion
FROM profiles
WHERE city IS NOT NULL
GROUP BY city
ORDER BY user_count DESC;

CREATE VIEW stats_transport AS
SELECT
    unnest(transport_modes) as transport_mode,
    COUNT(*) as count
FROM profiles
WHERE transport_modes IS NOT NULL
GROUP BY transport_mode
ORDER BY count DESC;

CREATE VIEW stats_interests AS
SELECT
    unnest(interests) as interest,
    COUNT(*) as count
FROM profiles
WHERE interests IS NOT NULL
GROUP BY interest
ORDER BY count DESC;
