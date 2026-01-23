-- ===========================================
-- SCHEMA SUPABASE - Veille Municipales 2026
-- ===========================================

-- Table des communes à risque
CREATE TABLE communes (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    departement VARCHAR(100) NOT NULL,
    code_dept VARCHAR(5),
    score CHAR(1) CHECK (score IN ('A', 'B', 'C', 'D', 'E')),
    population VARCHAR(20),
    maire_actuel VARCHAR(200),
    detail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des candidat·es ED
CREATE TABLE candidats (
    id SERIAL PRIMARY KEY,
    commune_id INTEGER REFERENCES communes(id) ON DELETE SET NULL,
    nom VARCHAR(200) NOT NULL,
    prenom VARCHAR(100),
    role VARCHAR(50) DEFAULT 'tete' CHECK (role IN ('tete', 'colistier', 'soutien')),
    parti VARCHAR(50) DEFAULT 'RN',
    detail TEXT,
    twitter VARCHAR(100),
    circonscription VARCHAR(100),
    photo_url TEXT,
    est_depute BOOLEAN DEFAULT FALSE,
    est_senateur BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des dingueries (déclarations problématiques)
CREATE TABLE dingueries (
    id SERIAL PRIMARY KEY,
    candidat_id INTEGER REFERENCES candidats(id) ON DELETE SET NULL,
    commune_id INTEGER REFERENCES communes(id) ON DELETE SET NULL,
    auteur VARCHAR(200) NOT NULL,
    citation TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'autre' CHECK (type IN ('racisme', 'islamophobie', 'homophobie', 'sexisme', 'antisemitisme', 'complotisme', 'autre')),
    date_declaration DATE,
    source_url TEXT NOT NULL,
    source_media VARCHAR(200),
    contexte TEXT,
    est_condamnation BOOLEAN DEFAULT FALSE,
    montant_condamnation VARCHAR(50),
    capture_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les sources de scraping
CREATE TABLE sources_scraping (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('article', 'liste', 'api', 'twitter')),
    derniere_verification TIMESTAMP WITH TIME ZONE,
    actif BOOLEAN DEFAULT TRUE,
    notes TEXT
);

-- Index pour améliorer les performances
CREATE INDEX idx_candidats_commune ON candidats(commune_id);
CREATE INDEX idx_candidats_parti ON candidats(parti);
CREATE INDEX idx_dingueries_type ON dingueries(type);
CREATE INDEX idx_dingueries_auteur ON dingueries(auteur);
CREATE INDEX idx_communes_score ON communes(score);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_communes_updated_at BEFORE UPDATE ON communes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidats_updated_at BEFORE UPDATE ON candidats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dingueries_updated_at BEFORE UPDATE ON dingueries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- DONNEES INITIALES - Communes à risque
-- ===========================================

INSERT INTO communes (nom, departement, code_dept, score, population, maire_actuel, detail) VALUES
-- Score E (déjà RN)
('Hénin-Beaumont', 'Pas-de-Calais', '62', 'E', '27 000', 'Steeve Briois (RN)', 'Fief historique du RN depuis 2014'),
('Perpignan', 'Pyrénées-Orientales', '66', 'E', '120 000', 'Louis Aliot (RN)', 'RN depuis 2020'),
('Fréjus', 'Var', '83', 'E', '54 000', 'David Rachline (RN)', 'RN depuis 2014'),
('Orange', 'Vaucluse', '84', 'E', '30 000', 'Yann Bompard (RN)', 'Historique FN/RN depuis 1995'),
('Béziers', 'Hérault', '34', 'E', '78 000', 'Robert Ménard (proche RN)', 'Robert Ménard depuis 2014'),
('Marignane', 'Bouches-du-Rhône', '13', 'E', '34 000', 'Eric Le Dissès (RN)', 'RN depuis 2014'),
('Bruay-la-Buissière', 'Pas-de-Calais', '62', 'E', '22 000', 'Ludovic Pajot (RN)', 'RN depuis 2020'),

-- Score D (risque élevé)
('Toulon', 'Var', '83', 'D', '180 000', 'Hubert Falco (DVD)', 'Plus grande ville à risque. Ancien fief FN (1995-2001)'),
('Calais', 'Pas-de-Calais', '62', 'D', '73 000', 'Natacha Bouchart (LR)', 'Forte implantation RN dans le département'),
('Agde', 'Hérault', '34', 'D', '29 000', 'Vacant (démission)', 'Maire sortant mis en examen'),
('Allauch', 'Bouches-du-Rhône', '13', 'D', '21 000', 'Lionel de Cala (DVD)', '50 ans de mairie socialiste avant bascule'),
('Les Pennes-Mirabeau', 'Bouches-du-Rhône', '13', 'D', '22 000', 'Michel Amiel (ex-PS)', '67,76% pour le RN aux législatives 2024'),
('Fos-sur-Mer', 'Bouches-du-Rhône', '13', 'D', '16 000', 'René Raimondi (DVG)', 'Top 5 réservoir de voix RN'),
('Vitrolles', 'Bouches-du-Rhône', '13', 'D', '35 000', 'Loïc Gachon (DVG)', '1ère commune FN en 1997 (Mégret)'),
('Roquebrune-sur-Argens', 'Var', '83', 'D', '14 000', 'Luc Jousse (DVD)', 'Députée RN très implantée'),
('Menton', 'Alpes-Maritimes', '06', 'D', '30 000', 'Yves Juhel (ne se représente pas)', 'Opportunité ED, maire sortant part'),
('Montauban', 'Tarn-et-Garonne', '82', 'D', '62 000', 'Brigitte Barèges (inéligible)', 'Exception dans le Sud-Ouest'),
('Liévin', 'Pas-de-Calais', '62', 'D', '30 000', 'Laurent Duporge (PS)', 'PS à 73% en 2020 mais contexte changé'),
('Lens', 'Pas-de-Calais', '62', 'D', '32 000', 'Sylvain Robert (PS)', 'Ancien bastion PS menacé'),
('Hyères', 'Var', '83', 'D', '56 000', 'Jean-Pierre Giran (LR)', 'Var = département le plus RN'),
('Martigues', 'Bouches-du-Rhône', '13', 'D', '49 000', 'Gaby Charroux (PCF)', 'Fief PCF menacé'),
('Narbonne', 'Aude', '11', 'D', '55 000', 'Didier Mouly (DVD)', 'Région à forte pression RN'),
('Boulogne-sur-Mer', 'Pas-de-Calais', '62', 'D', '41 000', 'Frédéric Cuvillier (PS)', 'Port de pêche, thématiques RN'),
('Carpentras', 'Vaucluse', '84', 'D', '30 000', 'Serge Andrieu (DVG)', 'Département historique du FN'),

-- Score C
('Romorantin-Lanthenay', 'Loir-et-Cher', '41', 'C', '17 000', 'Jeanny Lorgeoux (PS)', 'Territoire rural, vote RN en hausse'),

-- Nouvelles communes - Candidats Reconquête (source: Candidator.fr - 01/03/2026)
('Bourg-en-Bresse', 'Ain', '01', 'C', '42 000', 'Jean-François Debat (PS)', 'Liste union des droites LR-Reconquête annoncée'),
('Évreux', 'Eure', '27', 'D', '51 000', 'Guy Lefrand (LR)', 'Candidature officielle Reconquête annoncée. Jean Messiha figure médiatique'),
('Saint-Priest', 'Rhône', '69', 'C', '47 000', 'Gilles Gascon (LR)', 'Candidature Reconquête dans la métropole lyonnaise'),
('Paris 16e', 'Paris', '75', 'C', '166 000', 'Francis Szpiner (LR)', 'Arrondissement huppé, candidature symbolique de Sarah Knafo'),

-- Candidats UDR (source: Candidator.fr - 01/03/2026)
('Nice', 'Alpes-Maritimes', '06', 'D', '342 000', 'Christian Estrosi (Horizons)', 'Plus grande ville visée par l''UDR. Éric Ciotti tête de liste'),
('La Teste-de-Buch', 'Gironde', '33', 'C', '28 000', 'Patrick Davet (DVD)', 'Candidature union des droites sans investiture officielle'),
('Poitiers', 'Vienne', '86', 'C', '89 000', 'Léonore Moncond''huy (EELV)', 'Liste Liberté pour Poitiers sous étiquette UDR');

-- ===========================================
-- DONNEES INITIALES - Candidat·es identifié·es
-- ===========================================

INSERT INTO candidats (commune_id, nom, prenom, role, parti, detail, twitter, est_depute) VALUES
((SELECT id FROM communes WHERE nom = 'Calais'), 'de Fleurian', 'Marc', 'tete', 'RN', 'Député RN. Marine Le Pen élue dans le département', NULL, TRUE),
((SELECT id FROM communes WHERE nom = 'Agde'), 'Lopez-Liguori', 'Aurélien', 'tete', 'RN', 'Député RN élu au 1er tour', '@ALopezLiguori', TRUE),
((SELECT id FROM communes WHERE nom = 'Allauch'), 'Varnier', 'Christelle', 'tete', 'RN', 'José Gonzalez (député RN) a fait 60%+ en 2024', NULL, FALSE),
((SELECT id FROM communes WHERE nom = 'Fos-sur-Mer'), 'Fouquart', 'Emmanuel', 'tete', 'RN', '62,78% aux législatives 2024', NULL, FALSE),
((SELECT id FROM communes WHERE nom = 'Roquebrune-sur-Argens'), 'Lechanteux', 'Julie', 'tete', 'RN', 'Députée RN élue au 1er tour 2024', '@music_juls', TRUE),
((SELECT id FROM communes WHERE nom = 'Menton'), 'Masson', 'Alexandra', 'tete', 'RN', 'Députée RN élue au 1er tour 2024', '@AMasson_RN', TRUE),
((SELECT id FROM communes WHERE nom = 'Liévin'), 'Paiva', 'Dany', 'tete', 'RN', 'Trentenaire originaire du Gard', NULL, FALSE);

-- Candidats Reconquête (source: Candidator.fr - 01/03/2026)
INSERT INTO candidats (commune_id, nom, prenom, role, parti, detail, twitter) VALUES
((SELECT id FROM communes WHERE nom = 'Bourg-en-Bresse'), 'de Boysson', 'Benoit', 'tete', 'Reconquete', 'Tête de liste union des droites (LR-Reconquête)', NULL),
((SELECT id FROM communes WHERE nom = 'Évreux'), 'Messiha', 'Jean', 'tete', 'Reconquete', 'Candidat officiel Reconquête, 55 ans, économiste et figure médiatique du parti', '@JeanMessiha'),
((SELECT id FROM communes WHERE nom = 'Saint-Priest'), 'Pozzi', 'André', 'tete', 'Reconquete', 'Candidat Reconquête', NULL),
((SELECT id FROM communes WHERE nom = 'Paris 16e'), 'Knafo', 'Sarah', 'tete', 'Reconquete', 'Eurodéputée Reconquête, 32 ans, défense de l''identité française', '@SarahKnaorth');

-- Candidats UDR (source: Candidator.fr - 01/03/2026)
INSERT INTO candidats (commune_id, nom, prenom, role, parti, detail, twitter) VALUES
((SELECT id FROM communes WHERE nom = 'Nice'), 'Ciotti', 'Éric', 'tete', 'UDR', 'Président de l''UDR, 59 ans, ex-LR rallié au RN, prône une droite ferme sur l''autorité et l''identité', '@ECiotti'),
((SELECT id FROM communes WHERE nom = 'Nice'), 'Rivère', 'Jean-Pierre', 'colistier', 'UDR', 'Ancien président de l''OGC Nice, candidat comme 1er adjoint', NULL),
((SELECT id FROM communes WHERE nom = 'La Teste-de-Buch'), 'Muret', 'Marc', 'tete', 'UDR', 'Candidat prônant l''union des droites, sans investiture officielle UDR', NULL),
((SELECT id FROM communes WHERE nom = 'Poitiers'), 'Prost', 'Marie-Dolorès', 'tete', 'UDR', 'Candidate sous l''étiquette UDR, liste Liberté pour Poitiers', NULL);

-- Candidats nationaux avec dingueries (pas forcément candidats municipales mais utiles)
INSERT INTO candidats (nom, prenom, parti, circonscription, detail, est_depute) VALUES
('Grenon', 'Daniel', 'RN', 'Yonne (89)', 'Exclu du RN après condamnation pour racisme', TRUE),
('Boccaletti', 'Frédéric', 'RN', 'Var (83)', 'Député sortant, condamné pour violences', TRUE),
('Dumont', 'Sophie', 'RN', 'Côte-d''Or (21)', 'Propos antisémites et complotistes', FALSE),
('Bourdouleix', 'Gilles', 'UDR', 'Maine-et-Loire (49)', 'Allié RN, propos sur Hitler', FALSE),
('de Lépinau', 'Hervé', 'RN', 'Vaucluse (84)', 'Député, opposition radicale IVG', TRUE),
('Parmentier', 'Caroline', 'RN', 'Pas-de-Calais (62)', 'Théorie du grand remplacement', FALSE),
('Martin', 'Joseph', 'RN', 'Morbihan (56)', 'Tweet sur la Shoah', FALSE);

-- ===========================================
-- DONNEES INITIALES - Dingueries documentées
-- ===========================================

INSERT INTO dingueries (auteur, citation, type, date_declaration, source_url, source_media, contexte, est_condamnation, montant_condamnation) VALUES
('Daniel Grenon', 'Les Maghrébins ne devraient pas se trouver dans les positions élevées', 'racisme', '2024-07-01', 'https://42mag.fr/2025/05/condamnation-de-11-000e-pour-propos-racistes-daniel-grenon-ex-rn-depute-de-lyonne/', '42mag', 'Lors d''un débat législatif. Exclu du RN en octobre 2024.', TRUE, '11 000€'),

('Gilles Bourdouleix', 'Hitler n''en a peut-être pas tué assez', 'racisme', '2013-07-01', 'https://www.streetpress.com/', 'StreetPress', 'Propos visant les gens du voyage. Allié RN aux municipales.', FALSE, NULL),

('Frédéric Boccaletti', 'Violence en réunion avec arme contre des jeunes noirs', 'racisme', '2000-01-01', 'https://www.streetpress.com/', 'StreetPress', 'Condamné à 1 an de prison. Député RN sortant. Fondateur de la librairie d''extrême droite Anthinéa.', TRUE, '1 an prison'),

('Sophie Dumont', 'Le petit geste qui trahit l''origine des fonds qui alimentent Reconquête', 'antisemitisme', '2024-01-01', 'https://www.liberation.fr/', 'Libération', 'Insinuation antisémite visant Sarah Knafo. Également complotiste.', FALSE, NULL),

('Marie-Christine Sorin', 'Civilisations n''ayant aucun humanisme restées au-dessous de la bestialité', 'racisme', '2024-01-01', 'https://www.liberation.fr/', 'Libération', 'Propos suprémacistes publiés sur Twitter.', FALSE, NULL),

('Caroline Parmentier', 'Avortement génocide français remplacés par migrants', 'autre', '2018-05-01', 'https://basta.media/racistes-homophobes-complotistes-pro-poutine-antisemites-candidats-rn', 'Basta!', 'Défense du grand remplacement dans le journal Présent.', FALSE, NULL),

('Louis-Joseph Gannat Peche', 'Juif qui parle bouche qui ment', 'antisemitisme', '2024-01-01', 'https://www.streetpress.com/', 'StreetPress', 'Tweet antisémite. A aussi insulté Franck Riester pour son homosexualité.', FALSE, NULL),

('Pierre-Nicolas Nups', 'On va casser du PD', 'homophobie', '2013-05-01', 'https://tetu.com/', 'Têtu', 'Vidéo appelant à la violence homophobe. Ancien membre du GUD.', FALSE, NULL),

('Hervé de Lépinau', 'IVG assimilée aux génocides arménien, rwandais, à la Shoah et Daesh', 'autre', '2020-10-01', 'https://www.lejdd.fr/', 'JDD', 'Opposition radicale à l''IVG. Député de Carpentras.', FALSE, NULL),

('Joseph Martin', 'Le gaz a rendu justice aux victimes de la Shoah', 'antisemitisme', '2018-10-01', 'https://fr.timesofisrael.com/', 'Times of Israel', 'Tweet concernant la mort de Robert Faurisson. Réinvesti malgré la polémique.', FALSE, NULL),

('Françoise Billaud', 'Hommage à Philippe Pétain et l''abbé Perrot (figure de la collaboration)', 'autre', '2024-05-01', 'https://fr.timesofisrael.com/', 'Times of Israel', 'Partages Facebook pro-Vichy.', FALSE, NULL),

('Agnès Pageard', 'Invitait à relire Henry Coston (collaborateur antisémite 1910-2001)', 'antisemitisme', '2021-02-01', 'https://fr.timesofisrael.com/', 'Times of Israel', 'A promu Cassandre Fristot, condamnée en 2021 pour gestes antisémites.', FALSE, NULL),

('Paule Veyre de Soras', 'J''ai comme ophtalmo un juif. Et j''ai comme dentiste un musulman', 'racisme', '2024-06-01', 'https://www.franceinfo.fr/', 'France Info', 'Réponse aux accusations de racisme du RN lors d''un débat.', FALSE, NULL),

('Rody Tolassy', 'Violence filmée contre une opposante politique', 'autre', '2022-03-01', 'https://www.politis.fr/', 'Politis', 'Filmé frappant une femme. Candidat RN.', FALSE, NULL);

-- ===========================================
-- SOURCES DE SCRAPING
-- ===========================================

INSERT INTO sources_scraping (nom, url, type, notes) VALUES
('StreetPress - RN', 'https://www.streetpress.com/rubriques/rassemblement-national', 'article', 'Articles sur les candidats RN'),
('StreetPress - Municipales', 'https://www.streetpress.com/rubriques/municipales', 'article', 'Actualités municipales'),
('Basta! - Candidats RN', 'https://basta.media/racistes-homophobes-complotistes-pro-poutine-antisemites-candidats-rn', 'liste', 'Liste de candidats avec propos problématiques'),
('Times of Israel', 'https://fr.timesofisrael.com/les-candidats-du-rn-qui-font-tache-leurs-propos-antisemites-racistes-et-complotistes/', 'liste', 'Dérapages antisémites'),
('Carte StreetPress', 'https://municipales.streetpress.com/', 'api', 'Carte interactive des communes à risque'),
('France 3 PACA', 'https://france3-regions.franceinfo.fr/provence-alpes-cote-d-azur/', 'article', 'Actualités régionales Sud');

-- ===========================================
-- POLITIQUES RLS (Row Level Security)
-- ===========================================

-- Activer RLS sur les tables
ALTER TABLE communes ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidats ENABLE ROW LEVEL SECURITY;
ALTER TABLE dingueries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources_scraping ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique (anon peut lire)
CREATE POLICY "Lecture publique communes" ON communes FOR SELECT USING (true);
CREATE POLICY "Lecture publique candidats" ON candidats FOR SELECT USING (true);
CREATE POLICY "Lecture publique dingueries" ON dingueries FOR SELECT USING (true);
CREATE POLICY "Lecture publique sources" ON sources_scraping FOR SELECT USING (true);

-- Pour l'écriture, on peut soit :
-- 1. Autoriser anon (moins sécurisé mais simple)
-- 2. Créer un utilisateur service (plus sécurisé)

-- Option 1 : Autoriser l'écriture anonyme (pour le dev)
CREATE POLICY "Ecriture anon communes" ON communes FOR INSERT WITH CHECK (true);
CREATE POLICY "Ecriture anon candidats" ON candidats FOR INSERT WITH CHECK (true);
CREATE POLICY "Ecriture anon dingueries" ON dingueries FOR INSERT WITH CHECK (true);
CREATE POLICY "Update anon communes" ON communes FOR UPDATE USING (true);
CREATE POLICY "Update anon candidats" ON candidats FOR UPDATE USING (true);
CREATE POLICY "Update anon dingueries" ON dingueries FOR UPDATE USING (true);
