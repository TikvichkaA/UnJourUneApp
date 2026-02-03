/**
 * Schéma de base de données pour le Planning du Personnel
 * Gestion des employés, catégories, codes horaires et plannings
 */

const PLANNING_SCHEMA_VERSION = 1;

/**
 * Crée les tables pour le module Planning
 */
function createPlanningSchema(db) {
    db.exec(`
        -- Table de version du schéma planning
        CREATE TABLE IF NOT EXISTS planning_schema_version (
            version INTEGER PRIMARY KEY
        );

        -- Catégories d'employés
        CREATE TABLE IF NOT EXISTS categories_employes (
            id TEXT PRIMARY KEY,
            nom TEXT NOT NULL,
            icon TEXT,
            couleur TEXT,
            ordre INTEGER DEFAULT 0
        );

        -- Codes horaires (shifts)
        CREATE TABLE IF NOT EXISTS codes_horaires (
            code TEXT PRIMARY KEY,
            description TEXT NOT NULL,
            heures REAL NOT NULL DEFAULT 0,
            type TEXT NOT NULL CHECK(type IN ('jour', 'nuit', 'present', 'conge', 'absent', 'formation', 'ferie', 'repos', 'autre')),
            categorie_poste TEXT
        );

        -- Codes autorisés par catégorie d'employé
        CREATE TABLE IF NOT EXISTS codes_par_categorie (
            categorie_id TEXT NOT NULL REFERENCES categories_employes(id),
            code TEXT NOT NULL REFERENCES codes_horaires(code),
            PRIMARY KEY (categorie_id, code)
        );

        -- Employés
        CREATE TABLE IF NOT EXISTS employes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            prenom TEXT,
            categorie_id TEXT NOT NULL REFERENCES categories_employes(id),
            type_contrat TEXT NOT NULL CHECK(type_contrat IN ('permanent', 'vacataire', 'interimaire')) DEFAULT 'permanent',
            date_debut DATE,
            date_fin DATE,
            telephone TEXT,
            email TEXT,
            actif INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Planning journalier
        CREATE TABLE IF NOT EXISTS planning_journalier (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employe_id INTEGER NOT NULL REFERENCES employes(id),
            date_travail DATE NOT NULL,
            code TEXT REFERENCES codes_horaires(code),
            heures_reelles REAL,
            commentaire TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(employe_id, date_travail)
        );

        -- Jours fériés
        CREATE TABLE IF NOT EXISTS jours_feries (
            date_ferie DATE PRIMARY KEY,
            nom TEXT NOT NULL,
            annee INTEGER NOT NULL
        );

        -- Besoins en effectifs par poste
        CREATE TABLE IF NOT EXISTS besoins_effectifs (
            id TEXT PRIMARY KEY,
            label TEXT NOT NULL,
            icon TEXT,
            effectif_minimum INTEGER DEFAULT 1
        );

        -- Mapping codes -> postes de staffing
        CREATE TABLE IF NOT EXISTS codes_vers_postes (
            code TEXT NOT NULL REFERENCES codes_horaires(code),
            poste_id TEXT NOT NULL REFERENCES besoins_effectifs(id),
            PRIMARY KEY (code, poste_id)
        );

        -- Index pour les performances
        CREATE INDEX IF NOT EXISTS idx_employes_categorie ON employes(categorie_id);
        CREATE INDEX IF NOT EXISTS idx_employes_type ON employes(type_contrat);
        CREATE INDEX IF NOT EXISTS idx_employes_actif ON employes(actif);
        CREATE INDEX IF NOT EXISTS idx_planning_date ON planning_journalier(date_travail);
        CREATE INDEX IF NOT EXISTS idx_planning_employe ON planning_journalier(employe_id);
        CREATE INDEX IF NOT EXISTS idx_planning_employe_date ON planning_journalier(employe_id, date_travail);
    `);

    // Initialiser les données de référence
    initPlanningReferenceData(db);

    // Marquer la version
    db.run('INSERT OR REPLACE INTO planning_schema_version (version) VALUES (?)', [PLANNING_SCHEMA_VERSION]);

    console.log('Schéma planning créé (version ' + PLANNING_SCHEMA_VERSION + ')');
}

/**
 * Initialise les données de référence pour le planning
 */
function initPlanningReferenceData(db) {
    // Catégories d'employés
    const categories = [
        ['responsables', 'Responsables Site/CHU', '👔', '#1a56db', 1],
        ['coordination', 'Coordination Site/CHU', '📋', '#7c3aed', 2],
        ['maintenance', 'Agent Maintenance/Log', '🔧', '#059669', 3],
        ['administratif', 'Agent Administratif', '📝', '#d97706', 4],
        ['restauration', 'Agent de Restauration', '🍽️', '#dc2626', 5],
        ['accueil', "Agent d'Accueil", '🏠', '#0891b2', 6],
        ['entretien', "Agent d'Entretien", '🧹', '#65a30d', 7],
        ['polyvalent', 'Agent Polyvalent', '⚡', '#be185d', 8]
    ];

    for (const [id, nom, icon, couleur, ordre] of categories) {
        db.run('INSERT OR IGNORE INTO categories_employes (id, nom, icon, couleur, ordre) VALUES (?, ?, ?, ?, ?)',
            [id, nom, icon, couleur, ordre]);
    }

    // Codes horaires
    const codes = [
        // Jour - Accueil
        ['12j', 'Accueil jour 12h (8h-20h)', 12, 'jour', 'accueil'],
        ['9,2j', 'Accueil jour 9h20 (13h45-23h)', 9.33, 'jour', 'accueil'],
        ['7,5a', 'Accueil admin 7h30 (6h45-14h15)', 7.5, 'jour', 'accueil'],
        ['7a', 'Accueil admin 7h', 7, 'jour', 'accueil'],

        // Nuit - Accueil
        ['12n', 'Accueil nuit 12h (20h-8h)', 12, 'nuit', 'accueil'],
        ['8,2n', 'Accueil nuit 8h20 (22h45-7h)', 8.33, 'nuit', 'accueil'],

        // Restauration
        ['8,5ra', 'Restauration A 8h30', 8.5, 'jour', 'restauration'],
        ['8,5rb', 'Restauration B 8h30', 8.5, 'jour', 'restauration'],
        ['8,5rm', 'Restauration M 8h30', 8.5, 'jour', 'restauration'],
        ['7rc', 'Restauration C 7h', 7, 'jour', 'restauration'],
        ['7rd', 'Restauration D 7h', 7, 'jour', 'restauration'],
        ['9rs', 'Restauration S 9h', 9, 'jour', 'restauration'],
        ['10,5rm', 'Restauration M 10h30', 10.5, 'jour', 'restauration'],

        // Entretien
        ['8ea', 'Entretien A 8h', 8, 'jour', 'entretien'],
        ['8eb', 'Entretien B 8h', 8, 'jour', 'entretien'],
        ['8ec', 'Entretien C 8h', 8, 'jour', 'entretien'],
        ['8ed', 'Entretien D 8h', 8, 'jour', 'entretien'],
        ['8e.1', 'Entretien 1 8h', 8, 'jour', 'entretien'],
        ['8e.2', 'Entretien 2 8h', 8, 'jour', 'entretien'],
        ['8w', 'Entretien W 8h', 8, 'jour', 'entretien'],
        ['8W', 'Entretien W 8h', 8, 'jour', 'entretien'],
        ['8T', 'Polyvalent T 8h', 8, 'jour', 'polyvalent'],

        // Standard
        ['P', 'Présent', 7, 'present', 'admin'],
        ['7', 'Journée 7h', 7, 'jour', 'admin'],

        // Absences et congés
        ['CP', 'Congé payé', 0, 'conge', null],
        ['Am', 'Arrêt maladie', 0, 'absent', null],
        ['ABS', 'Absent', 0, 'absent', null],
        ['Abs', 'Absent', 0, 'absent', null],
        ['FOR', 'Formation', 7, 'formation', null],
        ['For', 'Formation', 7, 'formation', null],
        ['FS', 'Formation syndicale', 7, 'formation', null],
        ['F', 'Férié', 0, 'ferie', null],
        ['tp', 'Temps partiel', 0, 'repos', null]
    ];

    for (const [code, desc, heures, type, categorie] of codes) {
        db.run('INSERT OR IGNORE INTO codes_horaires (code, description, heures, type, categorie_poste) VALUES (?, ?, ?, ?, ?)',
            [code, desc, heures, type, categorie]);
    }

    // Codes autorisés par catégorie
    const codesParCategorie = {
        responsables: ['P', '7', 'CP', 'Am', 'ABS', 'FOR', 'F'],
        coordination: ['P', '7', 'CP', 'Am', 'ABS', 'FOR', 'F'],
        maintenance: ['P', '7', '12j', 'CP', 'Am', 'ABS', 'FOR', 'F'],
        administratif: ['P', '7', 'CP', 'Am', 'ABS', 'FOR', 'F'],
        restauration: ['8,5ra', '8,5rb', '8,5rm', '7rc', '7rd', '9rs', '10,5rm', 'CP', 'Am', 'ABS', 'FOR', 'FS', 'F'],
        accueil: ['12j', '9,2j', '7,5a', '7a', '12n', '8,2n', 'CP', 'Am', 'ABS', 'FOR', 'F'],
        entretien: ['8ea', '8eb', '8ec', '8ed', '8e.1', '8e.2', '8w', '8W', 'CP', 'Am', 'ABS', 'FOR', 'F'],
        polyvalent: ['8T', '8ea', '8eb', '8ec', '8ed', '8w', '8W', 'CP', 'Am', 'ABS', 'FOR', 'F']
    };

    for (const [cat, codesList] of Object.entries(codesParCategorie)) {
        for (const code of codesList) {
            db.run('INSERT OR IGNORE INTO codes_par_categorie (categorie_id, code) VALUES (?, ?)', [cat, code]);
        }
    }

    // Besoins en effectifs
    const besoins = [
        ['accueil_matin', 'Accueil matin', '🌅', 1],
        ['accueil_aprem', 'Accueil après-midi', '☀️', 1],
        ['accueil_nuit', 'Accueil nuit', '🌙', 1],
        ['restauration_matin', 'Restauration matin', '🍳', 2],
        ['restauration_soir', 'Restauration soir', '🍽️', 2],
        ['entretien', 'Entretien', '🧹', 4]
    ];

    for (const [id, label, icon, min] of besoins) {
        db.run('INSERT OR IGNORE INTO besoins_effectifs (id, label, icon, effectif_minimum) VALUES (?, ?, ?, ?)',
            [id, label, icon, min]);
    }

    // Mapping codes vers postes
    const codesVersPostes = [
        ['7,5a', 'accueil_matin'],
        ['7a', 'accueil_matin'],
        ['9,2j', 'accueil_aprem'],
        ['12j', 'accueil_aprem'],
        ['12n', 'accueil_nuit'],
        ['8,2n', 'accueil_nuit'],
        ['8,5ra', 'restauration_matin'],
        ['8,5rb', 'restauration_matin'],
        ['7rc', 'restauration_matin'],
        ['7rd', 'restauration_matin'],
        ['8,5rm', 'restauration_soir'],
        ['9rs', 'restauration_soir'],
        ['10,5rm', 'restauration_soir'],
        ['8ea', 'entretien'],
        ['8eb', 'entretien'],
        ['8ec', 'entretien'],
        ['8ed', 'entretien'],
        ['8e.1', 'entretien'],
        ['8e.2', 'entretien'],
        ['8w', 'entretien'],
        ['8W', 'entretien'],
        ['8T', 'entretien']
    ];

    for (const [code, poste] of codesVersPostes) {
        db.run('INSERT OR IGNORE INTO codes_vers_postes (code, poste_id) VALUES (?, ?)', [code, poste]);
    }

    // Jours fériés 2026
    const feries2026 = [
        ['2026-01-01', 'Nouvel an', 2026],
        ['2026-04-06', 'Lundi de Pâques', 2026],
        ['2026-05-01', 'Fête du travail', 2026],
        ['2026-05-08', 'Victoire 1945', 2026],
        ['2026-05-14', 'Ascension', 2026],
        ['2026-05-25', 'Lundi de Pentecôte', 2026],
        ['2026-07-14', 'Fête nationale', 2026],
        ['2026-08-15', 'Assomption', 2026],
        ['2026-11-01', 'Toussaint', 2026],
        ['2026-11-11', 'Armistice', 2026],
        ['2026-12-25', 'Noël', 2026]
    ];

    for (const [date, nom, annee] of feries2026) {
        db.run('INSERT OR IGNORE INTO jours_feries (date_ferie, nom, annee) VALUES (?, ?, ?)', [date, nom, annee]);
    }
}

/**
 * Vérifie si le schéma planning existe
 */
function planningSchemaExists(db) {
    try {
        const result = db.get('SELECT version FROM planning_schema_version');
        return result !== null;
    } catch (e) {
        return false;
    }
}

/**
 * Initialise le schéma planning si nécessaire
 */
function initPlanningDatabase(db) {
    if (!planningSchemaExists(db)) {
        createPlanningSchema(db);
        return { created: true, version: PLANNING_SCHEMA_VERSION, migrationNeeded: true };
    }

    const result = db.get('SELECT version FROM planning_schema_version');
    return { created: false, version: result?.version || 0, migrationNeeded: false };
}
