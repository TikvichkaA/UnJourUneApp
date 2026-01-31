-- Schema Supabase pour Traducteur Antifasciste
-- À exécuter dans l'éditeur SQL de Supabase

-- Table des traductions validées
CREATE TABLE translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original TEXT NOT NULL UNIQUE,
  translation TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  votes_up INTEGER DEFAULT 0,
  votes_down INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Table des propositions (en attente de modération)
CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original TEXT NOT NULL,
  translation TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  justification TEXT,
  proposed_by TEXT, -- optionnel, pseudonyme
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_note TEXT
);

-- Table des votes (pour éviter les doublons par session)
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_id UUID REFERENCES translations(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(translation_id, session_id)
);

-- Index pour les recherches
CREATE INDEX idx_translations_original ON translations(original);
CREATE INDEX idx_translations_category ON translations(category);
CREATE INDEX idx_translations_active ON translations(is_active);
CREATE INDEX idx_proposals_status ON proposals(status);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security (RLS)
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Politique : tout le monde peut lire les traductions actives
CREATE POLICY "Translations are viewable by everyone"
  ON translations FOR SELECT
  USING (is_active = true);

-- Politique : tout le monde peut créer une proposition
CREATE POLICY "Anyone can create proposals"
  ON proposals FOR INSERT
  WITH CHECK (true);

-- Politique : tout le monde peut voter (une fois par session)
CREATE POLICY "Anyone can vote"
  ON votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can see their votes"
  ON votes FOR SELECT
  USING (true);

-- Vue pour les traductions avec scores
CREATE OR REPLACE VIEW translations_with_scores AS
SELECT
  t.*,
  (t.votes_up - t.votes_down) as score,
  CASE
    WHEN (t.votes_up + t.votes_down) = 0 THEN 0
    ELSE ROUND((t.votes_up::numeric / (t.votes_up + t.votes_down)::numeric) * 100)
  END as approval_rate
FROM translations t
WHERE t.is_active = true
ORDER BY score DESC;

-- Fonction RPC pour incrémenter les votes de façon atomique
CREATE OR REPLACE FUNCTION increment_vote(row_id UUID, vote_field TEXT)
RETURNS void AS $$
BEGIN
  IF vote_field = 'votes_up' THEN
    UPDATE translations SET votes_up = votes_up + 1 WHERE id = row_id;
  ELSIF vote_field = 'votes_down' THEN
    UPDATE translations SET votes_down = votes_down + 1 WHERE id = row_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insérer les traductions initiales
INSERT INTO translations (original, translation, category) VALUES
('préférence nationale', 'discrimination légale fondée sur l''origine', 'nationalisme'),
('immigration massive', 'population désignée comme menace collective', 'immigration'),
('immigration incontrôlée', 'fantasme d''invasion utilisé pour justifier la répression', 'immigration'),
('submersion migratoire', 'rhétorique de remplacement démographique', 'immigration'),
('grand remplacement', 'théorie complotiste raciste', 'immigration'),
('appel d''air', 'prétexte pour refuser l''accueil des exilés', 'immigration'),
('flux migratoires', 'déshumanisation des personnes en mouvement', 'immigration'),
('clandestins', 'personnes privées de droits par l''État', 'immigration'),
('illégaux', 'personnes dont l''existence est criminalisée', 'immigration'),
('migrants économiques', 'hiérarchisation des vies selon leur utilité', 'immigration'),
('communautarisme', 'accusation visant les minorités qui s''organisent', 'immigration'),
('islamisation', 'fantasme complotiste antimusulman', 'immigration'),
('territoires perdus de la République', 'stigmatisation des quartiers populaires', 'immigration'),
('rétablir l''ordre', 'renforcement de la répression d''État', 'ordre'),
('maintien de l''ordre', 'usage de la violence policière', 'ordre'),
('fermeté républicaine', 'autoritarisme déguisé en principe démocratique', 'ordre'),
('lutter contre l''ensauvagement', 'désigner des groupes sociaux comme intrinsèquement violents', 'ordre'),
('ensauvagement', 'déshumanisation de populations ciblées', 'ordre'),
('tolérance zéro', 'politique répressive sans nuance ni justice', 'ordre'),
('laxisme judiciaire', 'attaque contre l''indépendance de la justice', 'ordre'),
('sentiment d''insécurité', 'peur instrumentalisée politiquement', 'ordre'),
('zones de non-droit', 'stigmatisation de quartiers pour justifier la répression', 'ordre'),
('délinquance', 'terme fourre-tout criminalisant la pauvreté', 'ordre'),
('racaille', 'déshumanisation des jeunes des quartiers populaires', 'ordre'),
('voyous', 'criminalisation de catégories sociales', 'ordre'),
('casseurs', 'délégitimation des mouvements sociaux', 'ordre'),
('ultra-gauche', 'épouvantail pour criminaliser la contestation', 'ordre'),
('écoterrorisme', 'criminalisation de l''activisme écologique', 'ordre'),
('séparatisme', 'prétexte pour contrôler les minorités religieuses', 'ordre'),
('valeurs traditionnelles', 'normes sociales imposées par l''État ou la majorité', 'tradition'),
('nos valeurs', 'exclusion de ceux qui ne correspondent pas à la norme dominante', 'tradition'),
('identité nationale', 'construction excluante basée sur l''origine', 'tradition'),
('civilisation occidentale', 'hiérarchie culturelle à prétention universelle', 'tradition'),
('racines chrétiennes', 'instrumentalisation religieuse nationaliste', 'tradition'),
('France éternelle', 'mythe nationaliste anhistorique', 'tradition'),
('déclin de la France', 'rhétorique décliniste au service du nationalisme', 'tradition'),
('effondrement civilisationnel', 'fantasme apocalyptique réactionnaire', 'tradition'),
('idéologie du genre', 'attaque contre les droits des personnes LGBTQI+', 'tradition'),
('théorie du genre', 'épouvantail contre les études sur le genre', 'tradition'),
('lobby LGBT', 'rhétorique complotiste homophobe', 'tradition'),
('wokisme', 'épouvantail contre les luttes pour l''égalité', 'tradition'),
('cancel culture', 'délégitimation de la critique sociale', 'tradition'),
('dictature des minorités', 'rejet des droits des groupes marginalisés', 'tradition'),
('bien-pensance', 'mépris pour les positions antiracistes et égalitaires', 'tradition'),
('politiquement correct', 'rejet du respect des personnes discriminées', 'tradition'),
('assistanat', 'stigmatisation des bénéficiaires de droits sociaux', 'economie'),
('assistés', 'désignation méprisante des personnes en situation de précarité', 'economie'),
('fraude sociale', 'criminalisation des pauvres (plutôt que de l''évasion fiscale)', 'economie'),
('profiteurs du système', 'boucs émissaires pour masquer les inégalités structurelles', 'economie'),
('mérite', 'justification des inégalités sociales', 'economie'),
('valeur travail', 'injonction à accepter l''exploitation', 'economie'),
('charges sociales', 'présentation négative des cotisations de solidarité', 'economie'),
('réformes nécessaires', 'destruction programmée des acquis sociaux', 'economie'),
('modernisation', 'euphémisme pour régression sociale', 'economie'),
('flexibilité', 'précarisation des travailleurs', 'economie'),
('compétitivité', 'course au moins-disant social', 'economie'),
('pensée unique', 'délégitimation du consensus démocratique', 'medias'),
('média mainstream', 'rhétorique de victimisation et de défiance', 'medias'),
('élites', 'bouc émissaire populiste (visant rarement les plus riches)', 'medias'),
('système', 'ennemi flou permettant de fédérer les ressentiments', 'medias'),
('liberté d''expression menacée', 'revendication du droit à tenir des propos discriminatoires', 'medias'),
('on ne peut plus rien dire', 'refus d''assumer les conséquences de propos problématiques', 'medias'),
('censure', 'victimisation face à la contradiction', 'medias'),
('dictature sanitaire', 'refus complotiste des mesures de santé publique', 'medias'),
('défense de la famille', 'opposition aux droits des familles non-traditionnelles', 'tradition'),
('bon sens', 'appel à l''évidence masquant des positions idéologiques', 'medias'),
('les Français', 'généralisation excluante (qui en fait partie ?)', 'nationalisme'),
('Français de souche', 'catégorie raciale déguisée en critère culturel', 'nationalisme'),
('assimilation', 'injonction à l''effacement culturel', 'nationalisme'),
('intégration', 'responsabilisation des immigrés pour leur propre exclusion', 'nationalisme'),
('souveraineté', 'repli nationaliste déguisé en indépendance', 'nationalisme'),
('patriote', 'nationaliste cherchant une étiquette respectable', 'nationalisme'),
('mondialisme', 'théorie complotiste aux relents antisémites', 'medias'),
('islamo-gauchisme', 'amalgame visant à délégitimer la gauche antiraciste', 'ordre'),
('islamo-gauchiste', 'insulte politique sans fondement factuel', 'ordre'),
('envahisseurs', 'déshumanisation guerrière des migrants', 'immigration'),
('hordes', 'animalisation des populations en mouvement', 'immigration'),
('remigration', 'euphémisme pour expulsion massive et ethnique', 'immigration'),
('décivilisation', 'concept raciste de hiérarchie des peuples', 'tradition'),
('réarmement démographique', 'contrôle des corps et natalisme nationaliste', 'tradition'),
('réarmement civique', 'mise au pas idéologique sous couvert de civisme', 'ordre'),
('autorité de l''État', 'renforcement du pouvoir répressif', 'ordre'),
('sécurité des Français', 'prétexte pour politiques liberticides', 'ordre'),
('guerre culturelle', 'rhétorique martiale contre le pluralisme', 'tradition'),
('héritage', 'mythe d''une culture figée et menacée', 'tradition'),
('défendre notre mode de vie', 'refus de l''altérité et du changement social', 'tradition');
