-- ================================================
-- SubVeille - Migration: Ajouter description au profil
-- A executer dans: Supabase Dashboard > SQL Editor
-- ================================================

-- Ajouter la colonne description a la table profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS description TEXT;

-- Commentaire pour documentation
COMMENT ON COLUMN profiles.description IS 'Description libre de l''association pour le matching IA';
