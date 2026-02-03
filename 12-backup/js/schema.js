/**
 * Schéma de la base de données CHU Babinski
 * Création des tables et initialisation des données de référence
 */

const SCHEMA_VERSION = 2;

/**
 * Crée toutes les tables de la base de données
 */
function createSchema(db) {
    db.exec(`
        -- Table de version du schéma
        CREATE TABLE IF NOT EXISTS schema_version (
            version INTEGER PRIMARY KEY
        );

        -- Familles (groupement)
        CREATE TABLE IF NOT EXISTS familles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            composition TEXT,
            chambre TEXT,
            ts_referente TEXT,
            date_arrivee DATE,
            date_fin_contrat DATE,
            aide_alimentaire TEXT,
            montant_aide REAL,
            demande_logement TEXT,
            type_logement_demande TEXT,
            numero_dls TEXT,
            dalo_daho TEXT,
            no_syplo TEXT,
            arpp TEXT,
            commentaire TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Hébergés (table centrale)
        CREATE TABLE IF NOT EXISTS heberges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL CHECK(type IN ('femme_isolee', 'adulte_famille', 'enfant')),
            famille_id INTEGER REFERENCES familles(id),

            -- Identité
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            date_naissance DATE,
            sexe TEXT CHECK(sexe IN ('M', 'F')),
            lieu_naissance TEXT,
            nationalite TEXT,

            -- Contact
            telephone TEXT,
            email TEXT,
            adresse_domiciliation TEXT,
            date_renouvellement_domiciliation DATE,

            -- Pièces d'identité
            type_pi1 TEXT,
            validite_pi1 DATE,
            type_pi2 TEXT,
            validite_pi2 DATE,

            -- Administratif
            date_entree_france DATE,
            statut TEXT,
            date_1er_tds DATE,
            oqtf TEXT,
            suivi_juridique TEXT,
            mesure_protection TEXT,
            etat_matrimonial TEXT,
            assurance_maladie TEXT,
            date_fin_droits DATE,
            mdph TEXT,

            -- Hébergement
            chambre TEXT,
            ts_referente TEXT,
            date_arrivee DATE,
            situation_avant TEXT,
            date_fin_contrat DATE,
            date_sortie DATE,

            -- Ressources
            aide_alimentaire TEXT,
            montant_aide REAL,
            allocations TEXT,
            montant_allocations REAL,
            autre_ressource TEXT,
            montant_autre REAL,
            salaire REAL DEFAULT 0,
            compte_bancaire TEXT,
            titre_transport TEXT,
            declaration_impots TEXT,

            -- Formation / Emploi
            attestation_linguistique TEXT,
            cir TEXT,
            emploi TEXT,
            suivi_cip TEXT,
            inscription_france_travail TEXT,

            -- Logement
            demande_logement TEXT,
            type_logement_demande TEXT,
            numero_dls TEXT,
            date_renouvellement_dls DATE,
            dalo_daho TEXT,
            date_envoi_dalo DATE,
            date_decision_dalo DATE,
            dates_injonction_dalo TEXT,
            no_syplo TEXT,
            arpp TEXT,
            date_envoi_arpp DATE,
            no_isis TEXT,
            no_alin TEXT,

            -- Enfants uniquement
            scolarite TEXT,
            ecole TEXT,
            financement_navigo TEXT,
            suivi_medical TEXT,
            dossier_mdph TEXT,

            -- Commentaire
            commentaire TEXT,

            -- Statut
            actif INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- PAF (Participation Aux Frais)
        CREATE TABLE IF NOT EXISTS paf (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            heberge_id INTEGER NOT NULL REFERENCES heberges(id),
            annee INTEGER NOT NULL,
            mois INTEGER NOT NULL CHECK(mois BETWEEN 1 AND 12),
            ressources REAL DEFAULT 0,
            montant_theorique REAL DEFAULT 0,
            montant_recu REAL DEFAULT 0,
            date_paiement DATE,
            statut TEXT DEFAULT 'en_attente' CHECK(statut IN ('en_attente', 'partiel', 'complet', 'exonere')),
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(heberge_id, annee, mois)
        );

        -- Cohésia (Aide alimentaire)
        CREATE TABLE IF NOT EXISTS cohesia (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            heberge_id INTEGER REFERENCES heberges(id),
            famille_id INTEGER REFERENCES familles(id),
            annee INTEGER NOT NULL,
            mois INTEGER NOT NULL CHECK(mois BETWEEN 1 AND 12),
            composition INTEGER NOT NULL DEFAULT 1,
            montant_theorique REAL NOT NULL,
            montant_distribue REAL DEFAULT 0,
            date_distribution DATE,
            distribue INTEGER DEFAULT 0,
            jours_absence INTEGER DEFAULT 0,
            deduction_absence REAL DEFAULT 0,
            avance_deduite REAL DEFAULT 0,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Barème Cohésia
        CREATE TABLE IF NOT EXISTS cohesia_bareme (
            composition INTEGER PRIMARY KEY,
            montant REAL NOT NULL
        );

        -- Absences
        CREATE TABLE IF NOT EXISTS absences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            heberge_id INTEGER NOT NULL REFERENCES heberges(id),
            date_debut DATE NOT NULL,
            date_fin DATE,
            raison TEXT,
            impact_aide INTEGER DEFAULT 1,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Avances (Prêts)
        CREATE TABLE IF NOT EXISTS avances (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            heberge_id INTEGER NOT NULL REFERENCES heberges(id),
            objet TEXT NOT NULL,
            montant_total REAL NOT NULL,
            contribution_chu_pct REAL DEFAULT 0,
            montant_chu REAL DEFAULT 0,
            montant_heberge REAL DEFAULT 0,
            nb_mensualites INTEGER DEFAULT 1,
            date_accord DATE NOT NULL,
            statut TEXT DEFAULT 'en_cours' CHECK(statut IN ('en_cours', 'termine', 'annule')),
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Remboursements des avances
        CREATE TABLE IF NOT EXISTS avances_remboursements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            avance_id INTEGER NOT NULL REFERENCES avances(id),
            annee INTEGER NOT NULL,
            mois INTEGER NOT NULL,
            montant_du REAL NOT NULL,
            montant_paye REAL DEFAULT 0,
            date_paiement DATE,
            statut TEXT DEFAULT 'en_attente' CHECK(statut IN ('en_attente', 'paye', 'partiel')),
            notes TEXT
        );

        -- Caisse mensuelle
        CREATE TABLE IF NOT EXISTS caisse_mensuelle (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            annee INTEGER NOT NULL,
            mois INTEGER NOT NULL CHECK(mois BETWEEN 1 AND 12),
            solde_initial REAL DEFAULT 0,
            total_entrees REAL DEFAULT 0,
            total_sorties REAL DEFAULT 0,
            solde_final REAL DEFAULT 0,
            cloture INTEGER DEFAULT 0,
            date_cloture DATETIME,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(annee, mois)
        );

        -- Mouvements (Transactions)
        CREATE TABLE IF NOT EXISTS mouvements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date_mouvement DATE NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('PAF', 'Cohesia', 'Avance', 'Remboursement', 'Autre')),
            sens TEXT NOT NULL CHECK(sens IN ('entree', 'sortie')),
            heberge_id INTEGER REFERENCES heberges(id),
            montant REAL NOT NULL,
            description TEXT,
            reference_id INTEGER,
            reference_type TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Configuration
        CREATE TABLE IF NOT EXISTS configuration (
            cle TEXT PRIMARY KEY,
            valeur TEXT,
            description TEXT
        );

        -- Index pour les performances
        CREATE INDEX IF NOT EXISTS idx_heberges_type ON heberges(type);
        CREATE INDEX IF NOT EXISTS idx_heberges_famille ON heberges(famille_id);
        CREATE INDEX IF NOT EXISTS idx_heberges_actif ON heberges(actif);
        CREATE INDEX IF NOT EXISTS idx_paf_periode ON paf(annee, mois);
        CREATE INDEX IF NOT EXISTS idx_cohesia_periode ON cohesia(annee, mois);
        CREATE INDEX IF NOT EXISTS idx_absences_dates ON absences(date_debut, date_fin);
        CREATE INDEX IF NOT EXISTS idx_mouvements_date ON mouvements(date_mouvement);
        CREATE INDEX IF NOT EXISTS idx_mouvements_heberge ON mouvements(heberge_id);
    `);

    // Insérer les données de référence
    initReferenceData(db);

    // Marquer la version du schéma
    db.run('INSERT OR REPLACE INTO schema_version (version) VALUES (?)', [SCHEMA_VERSION]);

    console.log('Schéma de base de données créé (version ' + SCHEMA_VERSION + ')');
}

/**
 * Initialise les données de référence
 */
function initReferenceData(db) {
    // Barème Cohésia (aide alimentaire) ET Taux PAF (pente) par composition
    // Taux = pourcentage des ressources à payer comme participation
    const bareme = [
        // [composition, montant_aide, taux_paf]
        [1, 220, 0.3459],    // 34.59%
        [2, 420, 0.4403],    // 44.03%
        [3, 610, 0.5328],    // 53.28%
        [4, 790, 0.5647],    // 56.47%
        [5, 960, 0.5808],    // 58.08%
        [6, 1120, 0.5870],   // 58.70%
        [7, 1270, 0.5874],   // 58.74%
        [8, 1410, 0.5839],   // 58.39%
        [9, 1540, 0.5770],   // 57.70%
        [10, 1660, 0.5675],  // 56.75%
        [11, 1770, 0.5570],  // 55.70%
        [12, 1870, 0.5447]   // 54.47%
    ];

    // Recréer la table avec le taux
    db.exec(`
        DROP TABLE IF EXISTS cohesia_bareme;
        CREATE TABLE cohesia_bareme (
            composition INTEGER PRIMARY KEY,
            montant REAL NOT NULL,
            taux_paf REAL NOT NULL DEFAULT 0.35
        );
    `);

    for (const [composition, montant, taux] of bareme) {
        db.run('INSERT INTO cohesia_bareme (composition, montant, taux_paf) VALUES (?, ?, ?)',
               [composition, montant, taux]);
    }

    // Configuration par défaut
    const configs = [
        ['absence_deduction_jour', '7.10', 'Déduction par jour d\'absence (€)'],
        ['caisse_solde_initial', '200', 'Solde initial de la caisse (€)']
    ];

    for (const [cle, valeur, description] of configs) {
        db.run('INSERT OR IGNORE INTO configuration (cle, valeur, description) VALUES (?, ?, ?)',
               [cle, valeur, description]);
    }
}

/**
 * Vérifie si le schéma existe déjà
 */
function schemaExists(db) {
    try {
        const result = db.get('SELECT version FROM schema_version');
        return result !== null;
    } catch (e) {
        return false;
    }
}

/**
 * Récupère la version actuelle du schéma
 */
function getSchemaVersion(db) {
    try {
        const result = db.get('SELECT version FROM schema_version');
        return result ? result.version : 0;
    } catch (e) {
        return 0;
    }
}

/**
 * Initialise la base de données (crée le schéma si nécessaire)
 */
async function initDatabase(db) {
    if (!schemaExists(db)) {
        createSchema(db);
        return { created: true, version: SCHEMA_VERSION, migrationNeeded: true };
    }

    const currentVersion = getSchemaVersion(db);
    if (currentVersion < SCHEMA_VERSION) {
        console.log('Mise à jour du schéma de version ' + currentVersion + ' vers ' + SCHEMA_VERSION);
        // Réinitialiser la base pour appliquer le nouveau schéma
        await resetDatabase(db);
        return { created: false, version: SCHEMA_VERSION, upgraded: true, migrationNeeded: true };
    }

    return { created: false, version: currentVersion, migrationNeeded: false };
}

/**
 * Réinitialise complètement la base de données (drop all tables + recreate)
 */
async function resetDatabase(db) {
    console.log('Réinitialisation de la base de données...');

    // Supprimer toutes les tables
    db.exec(`
        DROP TABLE IF EXISTS mouvements;
        DROP TABLE IF EXISTS caisse_mensuelle;
        DROP TABLE IF EXISTS avances_remboursements;
        DROP TABLE IF EXISTS avances;
        DROP TABLE IF EXISTS absences;
        DROP TABLE IF EXISTS cohesia;
        DROP TABLE IF EXISTS cohesia_bareme;
        DROP TABLE IF EXISTS paf;
        DROP TABLE IF EXISTS heberges;
        DROP TABLE IF EXISTS familles;
        DROP TABLE IF EXISTS configuration;
        DROP TABLE IF EXISTS schema_version;
    `);

    // Recréer le schéma
    createSchema(db);
    console.log('Base de données réinitialisée avec succès');
}
