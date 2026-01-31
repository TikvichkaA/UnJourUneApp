-- Exécuter ce script pour permettre l'édition collaborative directe
-- À lancer dans l'éditeur SQL de Supabase

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Translations are viewable by everyone" ON translations;

-- Nouvelle politique : tout le monde peut lire
CREATE POLICY "Anyone can read translations"
  ON translations FOR SELECT
  USING (true);

-- Nouvelle politique : tout le monde peut ajouter
CREATE POLICY "Anyone can insert translations"
  ON translations FOR INSERT
  WITH CHECK (true);

-- Nouvelle politique : tout le monde peut modifier
CREATE POLICY "Anyone can update translations"
  ON translations FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Nouvelle politique : tout le monde peut supprimer (optionnel, à commenter si non souhaité)
-- CREATE POLICY "Anyone can delete translations"
--   ON translations FOR DELETE
--   USING (true);
