-- ================================================
-- SubVeille - Schema Supabase
-- A executer dans: Supabase Dashboard > SQL Editor
-- ================================================

-- 0. Table AAP (donnees synchronisees depuis Aides-territoires)
CREATE TABLE IF NOT EXISTS aaps (
  id TEXT PRIMARY KEY,
  slug TEXT,
  titre TEXT NOT NULL,
  description TEXT,
  description_complete TEXT,
  financeur TEXT,
  financeur_type TEXT,
  secteur TEXT,
  montant_min INTEGER,
  montant_max INTEGER,
  subvention_rate TEXT,
  date_ouverture DATE,
  date_cloture DATE,
  lien TEXT,
  lien_candidature TEXT,
  territoires TEXT[],
  beneficiaires TEXT[],
  is_appel_projet BOOLEAN DEFAULT false,
  contact TEXT,
  source TEXT DEFAULT 'aides-territoires',
  categories JSONB,
  programs JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche
CREATE INDEX IF NOT EXISTS idx_aaps_secteur ON aaps(secteur);
CREATE INDEX IF NOT EXISTS idx_aaps_date_cloture ON aaps(date_cloture);
CREATE INDEX IF NOT EXISTS idx_aaps_financeur_type ON aaps(financeur_type);

-- RLS: lecture publique pour les AAP
ALTER TABLE aaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AAP are publicly readable" ON aaps FOR SELECT USING (true);

-- 1. Table profils associations
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nom_association TEXT,
  siret TEXT,
  adresse TEXT,
  code_postal TEXT,
  ville TEXT,
  email_contact TEXT,
  telephone TEXT,
  secteurs TEXT[] DEFAULT '{}',
  budget_annuel INTEGER,
  nb_salaries INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table AAP sauvegardes
CREATE TABLE IF NOT EXISTS saved_aaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  aap_id TEXT NOT NULL,
  aap_data JSONB NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'accepted', 'rejected')),
  deadline_alert BOOLEAN DEFAULT true,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  applied_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, aap_id)
);

-- 3. Index pour performances
CREATE INDEX IF NOT EXISTS idx_saved_aaps_user ON saved_aaps(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_aaps_status ON saved_aaps(status);

-- 4. Activer Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_aaps ENABLE ROW LEVEL SECURITY;

-- 5. Policies RLS - Profils
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 6. Policies RLS - AAP sauvegardes
CREATE POLICY "Users can view own saved aaps"
  ON saved_aaps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved aaps"
  ON saved_aaps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved aaps"
  ON saved_aaps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved aaps"
  ON saved_aaps FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Fonction pour creer profil auto a l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email_contact)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Trigger creation profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- Execution terminee !
-- ================================================
