-- ================================================
-- SubVeille - Migration: Table subscriptions
-- A executer dans: Supabase Dashboard > SQL Editor
-- ================================================

-- Table abonnements (alertes email, etc.)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- 'veille_ars', future: 'deadline_alerts', etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, type)
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_subscriptions_type_active ON subscriptions(type, is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- RLS pour subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
  ON subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- Verification
SELECT 'Table subscriptions creee avec succes' AS status;
