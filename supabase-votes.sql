-- Table pour stocker les votes des apps
CREATE TABLE IF NOT EXISTS app_votes (
    app_id INTEGER PRIMARY KEY,
    votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initialiser les 31 apps avec 0 votes
INSERT INTO app_votes (app_id, votes)
SELECT generate_series(1, 31), 0
ON CONFLICT (app_id) DO NOTHING;

-- Fonction RPC pour toggle un vote (increment ou decrement)
CREATE OR REPLACE FUNCTION toggle_vote(p_app_id INTEGER, p_increment BOOLEAN)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF p_increment THEN
        UPDATE app_votes
        SET votes = votes + 1, updated_at = NOW()
        WHERE app_id = p_app_id;
    ELSE
        UPDATE app_votes
        SET votes = GREATEST(0, votes - 1), updated_at = NOW()
        WHERE app_id = p_app_id;
    END IF;
END;
$$;

-- Activer RLS (Row Level Security)
ALTER TABLE app_votes ENABLE ROW LEVEL SECURITY;

-- Politique: tout le monde peut lire
CREATE POLICY "Lecture publique des votes" ON app_votes
    FOR SELECT USING (true);

-- Politique: pas d'insertion/update/delete directe (seulement via RPC)
-- La fonction toggle_vote utilise SECURITY DEFINER donc elle bypass RLS
