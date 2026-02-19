-- ============================================
-- SubTracker - Migration SQL
-- 5 nouvelles tables + RLS + indexes
-- ============================================

-- 1. Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
  start_date DATE,
  end_date DATE,
  budget_total NUMERIC(12,2) DEFAULT 0,
  budget_categories JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

-- 2. Subventions
CREATE TABLE IF NOT EXISTS subventions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  aap_id TEXT,
  name TEXT NOT NULL,
  financeur TEXT,
  financeur_type TEXT,
  status TEXT DEFAULT 'piste' CHECK (status IN (
    'piste', 'preparation', 'deposee', 'instruction',
    'accordee', 'conventionnee', 'versee_partiel', 'versee',
    'refusee', 'abandonnee'
  )),
  amount_requested NUMERIC(12,2) DEFAULT 0,
  amount_granted NUMERIC(12,2),
  amount_received NUMERIC(12,2) DEFAULT 0,
  dates JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  contact TEXT,
  reference TEXT,
  aap_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subventions_user ON subventions(user_id);
CREATE INDEX idx_subventions_project ON subventions(project_id);
CREATE INDEX idx_subventions_status ON subventions(status);

ALTER TABLE subventions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own subventions" ON subventions
  FOR ALL USING (auth.uid() = user_id);

-- 3. Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  subvention_id UUID REFERENCES subventions(id) ON DELETE SET NULL,
  label TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  category TEXT DEFAULT 'autre',
  date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  receipt_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_project ON expenses(project_id);
CREATE INDEX idx_expenses_subvention ON expenses(subvention_id);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own expenses" ON expenses
  FOR ALL USING (auth.uid() = user_id);

-- 4. Documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subvention_id UUID REFERENCES subventions(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  category TEXT DEFAULT 'autre' CHECK (category IN (
    'cerfa', 'convention', 'justificatif', 'bilan', 'budget', 'autre'
  )),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_subvention ON documents(subvention_id);
CREATE INDEX idx_documents_project ON documents(project_id);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own documents" ON documents
  FOR ALL USING (auth.uid() = user_id);

-- 5. Calendar Events
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subvention_id UUID REFERENCES subventions(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT DEFAULT 'autre' CHECK (type IN (
    'deadline', 'reporting', 'versement', 'convention', 'reunion', 'autre'
  )),
  notes TEXT,
  is_done BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_calendar_events_user ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_date ON calendar_events(date);
CREATE INDEX idx_calendar_events_subvention ON calendar_events(subvention_id);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own calendar events" ON calendar_events
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- Add subscription fields to profiles
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;
