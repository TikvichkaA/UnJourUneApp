-- ============================================
-- SubTracker CRM - Migration SQL
-- Table financeurs + rename subventions -> financements + FK
-- ============================================

-- Extension requise pour unaccent (suppression des accents dans les slugs)
CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;

-- ============================================
-- 1a. Table financeurs (partagee entre tous les users)
-- ============================================
CREATE TABLE IF NOT EXISTS financeurs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  type TEXT DEFAULT 'autre' CHECK (type IN (
    'etat','region','departement','commune','intercommunalite',
    'europe','fondation','entreprise','autre'
  )),
  address TEXT,
  city TEXT,
  postal_code TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  contact_name TEXT,
  description TEXT,
  secteurs TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_verified BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_financeurs_name ON financeurs(name);
CREATE INDEX IF NOT EXISTS idx_financeurs_slug ON financeurs(slug);
CREATE INDEX IF NOT EXISTS idx_financeurs_type ON financeurs(type);

-- RLS : tous authenticated peuvent lire, createur peut modifier si non verifie
ALTER TABLE financeurs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read financeurs" ON financeurs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert financeurs" ON financeurs
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update non-verified financeurs" ON financeurs
  FOR UPDATE USING (auth.uid() = created_by AND is_verified = false);

CREATE POLICY "Creators can delete non-verified financeurs" ON financeurs
  FOR DELETE USING (auth.uid() = created_by AND is_verified = false);

-- Trigger auto-slug sur INSERT/UPDATE
CREATE OR REPLACE FUNCTION generate_financeur_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug := lower(regexp_replace(
    regexp_replace(
      public.unaccent(NEW.name),
      '[^a-zA-Z0-9\s-]', '', 'g'
    ),
    '\s+', '-', 'g'
  ));
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_financeur_slug
  BEFORE INSERT OR UPDATE OF name ON financeurs
  FOR EACH ROW EXECUTE FUNCTION generate_financeur_slug();

-- ============================================
-- 1b. Rename subventions -> financements + FK
-- ============================================
ALTER TABLE subventions RENAME TO financements;

-- Ajouter FK vers financeurs
ALTER TABLE financements
  ADD COLUMN IF NOT EXISTS financeur_id UUID REFERENCES financeurs(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_financements_financeur ON financements(financeur_id);

-- Rename FK dans expenses : subvention_id -> financement_id
ALTER TABLE expenses RENAME COLUMN subvention_id TO financement_id;

-- Rename FK dans documents : subvention_id -> financement_id
ALTER TABLE documents RENAME COLUMN subvention_id TO financement_id;

-- Rename FK dans calendar_events : subvention_id -> financement_id
ALTER TABLE calendar_events RENAME COLUMN subvention_id TO financement_id;

-- Mettre a jour les indexes
DROP INDEX IF EXISTS idx_expenses_subvention;
CREATE INDEX IF NOT EXISTS idx_expenses_financement ON expenses(financement_id);

DROP INDEX IF EXISTS idx_documents_subvention;
CREATE INDEX IF NOT EXISTS idx_documents_financement ON documents(financement_id);

DROP INDEX IF EXISTS idx_calendar_events_subvention;
CREATE INDEX IF NOT EXISTS idx_calendar_events_financement ON calendar_events(financement_id);

-- Mettre a jour les RLS policies (les anciennes references subventions sont renommees auto)
-- Mais les policies referençant le nom de table doivent etre recreees
DROP POLICY IF EXISTS "Users manage own subventions" ON financements;
CREATE POLICY "Users manage own financements" ON financements
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 1c. Lier aaps -> financeurs
-- ============================================
ALTER TABLE aaps
  ADD COLUMN IF NOT EXISTS financeur_id UUID REFERENCES financeurs(id) ON DELETE SET NULL;

-- ============================================
-- 1d. Migration donnees existantes
-- Dedoublonner financeurs depuis financements.financeur et aaps.financeur
-- ============================================

-- Inserer les financeurs uniques depuis financements
INSERT INTO financeurs (name, type, created_by, source)
SELECT DISTINCT ON (lower(trim(f.financeur)))
  trim(f.financeur),
  COALESCE(f.financeur_type, 'autre'),
  f.user_id,
  'migration'
FROM financements f
WHERE f.financeur IS NOT NULL AND trim(f.financeur) != ''
ON CONFLICT (slug) DO NOTHING;

-- Inserer les financeurs uniques depuis aaps (qui ne sont pas deja dans financeurs)
INSERT INTO financeurs (name, type, source)
SELECT DISTINCT ON (lower(trim(a.financeur)))
  trim(a.financeur),
  COALESCE(a.financeur_type, 'autre'),
  'migration'
FROM aaps a
WHERE a.financeur IS NOT NULL AND trim(a.financeur) != ''
ON CONFLICT (slug) DO NOTHING;

-- Backfill financeur_id dans financements
UPDATE financements f
SET financeur_id = fin.id
FROM financeurs fin
WHERE f.financeur IS NOT NULL
  AND fin.slug = lower(regexp_replace(
    regexp_replace(public.unaccent(trim(f.financeur)), '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));

-- Backfill financeur_id dans aaps
UPDATE aaps a
SET financeur_id = fin.id
FROM financeurs fin
WHERE a.financeur IS NOT NULL
  AND fin.slug = lower(regexp_replace(
    regexp_replace(public.unaccent(trim(a.financeur)), '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));
