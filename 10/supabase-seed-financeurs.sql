-- ============================================
-- SubTracker - Seed financeurs communs
-- Annuaire de base des financeurs associatifs francais
-- ============================================

-- ---- ETAT & Agences nationales ----
INSERT INTO financeurs (name, type, website, description, secteurs, is_verified, source) VALUES
('ADEME', 'etat', 'https://www.ademe.fr', 'Agence de la transition ecologique', '{environnement,energie}', true, 'seed'),
('Agence nationale du Sport', 'etat', 'https://www.agencedusport.fr', 'Financement du sport pour tous', '{sport}', true, 'seed'),
('ANCT', 'etat', 'https://agence-cohesion-territoires.gouv.fr', 'Agence nationale de la cohesion des territoires', '{social,solidarite,numerique}', true, 'seed'),
('ARS - Agence regionale de sante', 'etat', 'https://www.ars.sante.fr', 'Agences regionales de sante - financement prevention et promotion sante', '{sante}', true, 'seed'),
('BPI France', 'etat', 'https://www.bpifrance.fr', 'Banque publique d''investissement - aides a l''innovation', '{numerique,insertion}', true, 'seed'),
('CAF - Caisse d''allocations familiales', 'etat', 'https://www.caf.fr', 'Financement actions petite enfance, jeunesse, parentalite', '{social,education}', true, 'seed'),
('CNDS / ANS', 'etat', 'https://www.sports.gouv.fr', 'Centre national pour le developpement du sport', '{sport}', true, 'seed'),
('DRAC', 'etat', 'https://www.culture.gouv.fr', 'Direction regionale des affaires culturelles', '{culture}', true, 'seed'),
('DRAJES', 'etat', 'https://www.education.gouv.fr', 'Delegation regionale academique a la jeunesse, a l''engagement et aux sports', '{sport,education,social}', true, 'seed'),
('FDVA', 'etat', 'https://www.associations.gouv.fr/fdva.html', 'Fonds pour le developpement de la vie associative', '{culture,social,sport,education}', true, 'seed'),
('FONJEP', 'etat', 'https://www.fonjep.org', 'Fonds de cooperation de la jeunesse et de l''education populaire - postes subventionnes', '{education,social,culture}', true, 'seed'),
('Ministere de la Culture', 'etat', 'https://www.culture.gouv.fr', 'Subventions culturelles nationales', '{culture}', true, 'seed'),
('Ministere de la Transition ecologique', 'etat', 'https://www.ecologie.gouv.fr', 'Financement projets environnementaux', '{environnement}', true, 'seed'),
('Ministere de l''Education nationale', 'etat', 'https://www.education.gouv.fr', 'Subventions educatives et periscolaires', '{education}', true, 'seed'),
('Ministere du Travail', 'etat', 'https://travail-emploi.gouv.fr', 'Financement insertion professionnelle, IAE', '{insertion,social}', true, 'seed'),
('Prefectures - DETR', 'etat', NULL, 'Dotation d''equipement des territoires ruraux', '{social,culture,sport}', true, 'seed'),
('Prefectures - DSIL', 'etat', NULL, 'Dotation de soutien a l''investissement local', '{social,culture}', true, 'seed'),
('Politique de la Ville - CGET', 'etat', 'https://www.cohesion-territoires.gouv.fr', 'Contrats de ville - quartiers prioritaires', '{social,education,insertion}', true, 'seed')
ON CONFLICT (slug) DO NOTHING;

-- ---- EUROPE ----
INSERT INTO financeurs (name, type, website, description, secteurs, is_verified, source) VALUES
('Commission europeenne - Erasmus+', 'europe', 'https://erasmus-plus.ec.europa.eu', 'Programme europeen pour l''education, la formation, la jeunesse et le sport', '{education,sport,culture}', true, 'seed'),
('FEDER', 'europe', 'https://ec.europa.eu/regional_policy', 'Fonds europeen de developpement regional', '{numerique,environnement,social}', true, 'seed'),
('FSE+ / FSE', 'europe', 'https://ec.europa.eu/esf', 'Fonds social europeen - emploi, formation, inclusion', '{insertion,social,education}', true, 'seed'),
('LEADER', 'europe', NULL, 'Programme europeen de developpement rural - GAL', '{environnement,social,culture}', true, 'seed'),
('Programme Europe Creative', 'europe', 'https://culture.ec.europa.eu', 'Financement europeen pour la culture et les medias', '{culture}', true, 'seed'),
('Corps europeen de solidarite', 'europe', 'https://youth.europa.eu', 'Volontariat et projets solidaires europeens', '{solidarite,social}', true, 'seed'),
('Programme LIFE', 'europe', 'https://cinea.ec.europa.eu/programmes/life', 'Programme europeen pour l''environnement et le climat', '{environnement}', true, 'seed')
ON CONFLICT (slug) DO NOTHING;

-- ---- REGIONS ----
INSERT INTO financeurs (name, type, website, description, secteurs, is_verified, source) VALUES
('Region Auvergne-Rhone-Alpes', 'region', 'https://www.auvergnerhonealpes.fr', NULL, '{}', true, 'seed'),
('Region Bourgogne-Franche-Comte', 'region', 'https://www.bourgognefranchecomte.fr', NULL, '{}', true, 'seed'),
('Region Bretagne', 'region', 'https://www.bretagne.bzh', NULL, '{}', true, 'seed'),
('Region Centre-Val de Loire', 'region', 'https://www.centre-valdeloire.fr', NULL, '{}', true, 'seed'),
('Region Corse', 'region', 'https://www.isula.corsica', NULL, '{}', true, 'seed'),
('Region Grand Est', 'region', 'https://www.grandest.fr', NULL, '{}', true, 'seed'),
('Region Guadeloupe', 'region', 'https://www.regionguadeloupe.fr', NULL, '{}', true, 'seed'),
('Region Guyane', 'region', 'https://www.ctguyane.fr', NULL, '{}', true, 'seed'),
('Region Hauts-de-France', 'region', 'https://www.hautsdefrance.fr', NULL, '{}', true, 'seed'),
('Region Ile-de-France', 'region', 'https://www.iledefrance.fr', NULL, '{}', true, 'seed'),
('Region La Reunion', 'region', 'https://www.regionreunion.com', NULL, '{}', true, 'seed'),
('Region Martinique', 'region', 'https://www.collectivitedemartinique.mq', NULL, '{}', true, 'seed'),
('Region Mayotte', 'region', 'https://www.cg976.fr', NULL, '{}', true, 'seed'),
('Region Normandie', 'region', 'https://www.normandie.fr', NULL, '{}', true, 'seed'),
('Region Nouvelle-Aquitaine', 'region', 'https://www.nouvelle-aquitaine.fr', NULL, '{}', true, 'seed'),
('Region Occitanie', 'region', 'https://www.laregion.fr', NULL, '{}', true, 'seed'),
('Region Pays de la Loire', 'region', 'https://www.paysdelaloire.fr', NULL, '{}', true, 'seed'),
('Region Provence-Alpes-Cote d''Azur', 'region', 'https://www.maregionsud.fr', NULL, '{}', true, 'seed')
ON CONFLICT (slug) DO NOTHING;

-- ---- FONDATIONS ----
INSERT INTO financeurs (name, type, website, description, secteurs, is_verified, source) VALUES
('Fondation Abbé Pierre', 'fondation', 'https://www.fondation-abbe-pierre.fr', 'Lutte contre le mal-logement et l''exclusion', '{social,solidarite}', true, 'seed'),
('Fondation Carasso', 'fondation', 'https://www.fondationcarasso.org', 'Alimentation durable et art citoyen', '{environnement,culture}', true, 'seed'),
('Fondation Daniel et Nina Carasso', 'fondation', 'https://www.fondationcarasso.org', 'Art citoyen, alimentation durable', '{culture,environnement}', true, 'seed'),
('Fondation de France', 'fondation', 'https://www.fondationdefrance.org', 'Premiere fondation en France - tous secteurs', '{social,culture,environnement,sante,education}', true, 'seed'),
('Fondation MACIF', 'fondation', 'https://www.fondation-macif.org', 'Economie sociale et solidaire', '{social,insertion,solidarite}', true, 'seed'),
('Fondation Roi Baudouin', 'fondation', 'https://www.kbs-frb.be', 'Fondation europeenne - cohesion sociale', '{social,solidarite}', true, 'seed'),
('Fondation SNCF', 'fondation', 'https://www.fondation-sncf.org', 'Solidarite, culture, education', '{solidarite,culture,education}', true, 'seed'),
('Fondation Total Energies', 'fondation', 'https://fondation.totalenergies.com', 'Insertion, patrimoine maritime, biodiversite', '{environnement,insertion,culture}', true, 'seed'),
('Fondation du Credit Mutuel', 'fondation', 'https://www.fondation-creditmutuel.org', 'Lecture, ecriture, langue francaise', '{education,culture}', true, 'seed'),
('Fondation Banque Populaire', 'fondation', 'https://www.fondationbp.com', 'Musique, handicap, solidarite', '{culture,social}', true, 'seed'),
('Fondation Orange', 'fondation', 'https://www.fondationorange.com', 'Education numerique, sante, culture', '{numerique,education,sante}', true, 'seed'),
('Fondation La Poste', 'fondation', 'https://www.fondationlaposte.org', 'Ecriture, correspondance, langue francaise', '{culture,education}', true, 'seed'),
('Fondation Bettencourt Schueller', 'fondation', 'https://www.fondationbs.org', 'Sciences, culture, solidarite', '{sante,culture,solidarite}', true, 'seed'),
('Fondation Vinci pour la Cite', 'fondation', 'https://www.interlud.fondation-vinci.com', 'Insertion par l''emploi, acces aux droits', '{insertion,social}', true, 'seed'),
('AG2R La Mondiale', 'fondation', 'https://www.ag2rlamondiale.fr', 'Soutien aux initiatives solidaires', '{social,solidarite}', true, 'seed'),
('Fondation Leclerc', 'fondation', NULL, 'Solidarite, environnement, culture', '{solidarite,environnement,culture}', true, 'seed')
ON CONFLICT (slug) DO NOTHING;

-- ---- ENTREPRISES / Mecenat ----
INSERT INTO financeurs (name, type, website, description, secteurs, is_verified, source) VALUES
('Credit Agricole - Mecenat', 'entreprise', 'https://www.credit-agricole.com', 'Mecenat associatif des caisses regionales', '{social,culture,environnement}', true, 'seed'),
('La Banque Postale', 'entreprise', 'https://www.labanquepostale.fr', 'Mecenat et prix associatifs', '{social,solidarite}', true, 'seed'),
('Caisse d''Epargne', 'entreprise', 'https://www.caisse-epargne.fr', 'Mecenat regional - projets locaux', '{social,culture,sport}', true, 'seed')
ON CONFLICT (slug) DO NOTHING;

-- Verification du nombre insere
SELECT type, count(*) as nb FROM financeurs WHERE source = 'seed' GROUP BY type ORDER BY nb DESC;
