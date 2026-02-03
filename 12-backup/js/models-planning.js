/**
 * Modèles de données pour le Planning du Personnel
 * Opérations CRUD et logique métier
 */

// ============================================================================
// MODÈLE CATÉGORIE EMPLOYÉ
// ============================================================================

const CategorieEmployeModel = {
    /**
     * Récupère toutes les catégories
     */
    getAll() {
        return db.getAll('SELECT * FROM categories_employes ORDER BY ordre');
    },

    /**
     * Récupère une catégorie par ID
     */
    getById(id) {
        return db.get('SELECT * FROM categories_employes WHERE id = ?', [id]);
    },

    /**
     * Récupère les codes horaires autorisés pour une catégorie
     */
    getCodesAutorises(categorieId) {
        return db.getAll(`
            SELECT ch.*
            FROM codes_horaires ch
            JOIN codes_par_categorie cpc ON ch.code = cpc.code
            WHERE cpc.categorie_id = ?
            ORDER BY ch.type, ch.code
        `, [categorieId]);
    }
};

// ============================================================================
// MODÈLE CODE HORAIRE
// ============================================================================

const CodeHoraireModel = {
    /**
     * Récupère tous les codes horaires
     */
    getAll() {
        return db.getAll('SELECT * FROM codes_horaires ORDER BY type, code');
    },

    /**
     * Récupère un code par son identifiant
     */
    getByCode(code) {
        return db.get('SELECT * FROM codes_horaires WHERE code = ?', [code]);
    },

    /**
     * Récupère les codes par type (jour, nuit, etc.)
     */
    getByType(type) {
        return db.getAll('SELECT * FROM codes_horaires WHERE type = ? ORDER BY code', [type]);
    },

    /**
     * Ajoute un nouveau code horaire
     */
    create(code, description, heures, type, categoriePoste = null) {
        db.run(`
            INSERT INTO codes_horaires (code, description, heures, type, categorie_poste)
            VALUES (?, ?, ?, ?, ?)
        `, [code, description, heures, type, categoriePoste]);
        return code;
    },

    /**
     * Met à jour un code horaire
     */
    update(code, data) {
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(data)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        values.push(code);
        db.run(`UPDATE codes_horaires SET ${fields.join(', ')} WHERE code = ?`, values);
    }
};

// ============================================================================
// MODÈLE EMPLOYÉ
// ============================================================================

const EmployeModel = {
    /**
     * Récupère tous les employés actifs
     */
    getAll() {
        return db.getAll(`
            SELECT e.*, ce.nom as categorie_nom, ce.icon as categorie_icon, ce.couleur as categorie_couleur
            FROM employes e
            JOIN categories_employes ce ON e.categorie_id = ce.id
            WHERE e.actif = 1
            ORDER BY ce.ordre, e.nom, e.prenom
        `);
    },

    /**
     * Récupère un employé par ID
     */
    getById(id) {
        return db.get(`
            SELECT e.*, ce.nom as categorie_nom, ce.icon as categorie_icon, ce.couleur as categorie_couleur
            FROM employes e
            JOIN categories_employes ce ON e.categorie_id = ce.id
            WHERE e.id = ?
        `, [id]);
    },

    /**
     * Récupère les employés par catégorie
     */
    getByCategorie(categorieId) {
        return db.getAll(`
            SELECT * FROM employes
            WHERE categorie_id = ? AND actif = 1
            ORDER BY nom, prenom
        `, [categorieId]);
    },

    /**
     * Récupère les employés par type de contrat
     */
    getByTypeContrat(type) {
        return db.getAll(`
            SELECT e.*, ce.nom as categorie_nom, ce.icon as categorie_icon
            FROM employes e
            JOIN categories_employes ce ON e.categorie_id = ce.id
            WHERE e.type_contrat = ? AND e.actif = 1
            ORDER BY ce.ordre, e.nom
        `, [type]);
    },

    /**
     * Recherche des employés
     */
    search(query) {
        const pattern = `%${query}%`;
        return db.getAll(`
            SELECT e.*, ce.nom as categorie_nom, ce.icon as categorie_icon
            FROM employes e
            JOIN categories_employes ce ON e.categorie_id = ce.id
            WHERE e.actif = 1 AND (e.nom LIKE ? OR e.prenom LIKE ?)
            ORDER BY ce.ordre, e.nom
        `, [pattern, pattern]);
    },

    /**
     * Crée un nouvel employé
     */
    create(data) {
        const {
            nom,
            prenom = null,
            categorie_id,
            type_contrat = 'permanent',
            date_debut = null,
            date_fin = null,
            telephone = null,
            email = null
        } = data;

        if (!nom) throw new Error('Le nom est obligatoire');
        if (!categorie_id) throw new Error('La catégorie est obligatoire');

        db.run(`
            INSERT INTO employes (nom, prenom, categorie_id, type_contrat, date_debut, date_fin, telephone, email, actif)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        `, [nom, prenom, categorie_id, type_contrat, date_debut, date_fin, telephone, email]);

        return db.lastInsertRowId();
    },

    /**
     * Met à jour un employé
     */
    update(id, data) {
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(data)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);
        db.run(`UPDATE employes SET ${fields.join(', ')} WHERE id = ?`, values);
    },

    /**
     * Désactive un employé (soft delete)
     */
    delete(id) {
        db.run('UPDATE employes SET actif = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return db.changes() > 0;
    },

    /**
     * Supprime définitivement un employé et son planning
     */
    hardDelete(id) {
        db.run('DELETE FROM planning_journalier WHERE employe_id = ?', [id]);
        db.run('DELETE FROM employes WHERE id = ?', [id]);
        return db.changes() > 0;
    },

    /**
     * Réactive un employé
     */
    reactivate(id) {
        db.run('UPDATE employes SET actif = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return db.changes() > 0;
    },

    /**
     * Statistiques des employés
     */
    getStats() {
        return {
            total: db.get('SELECT COUNT(*) as count FROM employes WHERE actif = 1').count,
            permanents: db.get("SELECT COUNT(*) as count FROM employes WHERE actif = 1 AND type_contrat = 'permanent'").count,
            vacataires: db.get("SELECT COUNT(*) as count FROM employes WHERE actif = 1 AND type_contrat = 'vacataire'").count,
            interimaires: db.get("SELECT COUNT(*) as count FROM employes WHERE actif = 1 AND type_contrat = 'interimaire'").count,
            categories: db.get('SELECT COUNT(DISTINCT categorie_id) as count FROM employes WHERE actif = 1').count
        };
    },

    /**
     * Récupère les employés groupés par catégorie
     */
    getAllGroupedByCategorie() {
        const categories = CategorieEmployeModel.getAll();
        const result = {};

        for (const cat of categories) {
            result[cat.id] = {
                ...cat,
                employes: this.getByCategorie(cat.id)
            };
        }

        return result;
    }
};

// ============================================================================
// MODÈLE PLANNING JOURNALIER
// ============================================================================

const PlanningModel = {
    /**
     * Récupère le planning d'un employé pour un mois
     */
    getByEmployeMois(employeId, annee, mois) {
        const debut = `${annee}-${String(mois).padStart(2, '0')}-01`;
        const fin = new Date(annee, mois, 0).toISOString().split('T')[0];

        return db.getAll(`
            SELECT pj.*, ch.description, ch.heures, ch.type
            FROM planning_journalier pj
            LEFT JOIN codes_horaires ch ON pj.code = ch.code
            WHERE pj.employe_id = ? AND pj.date_travail BETWEEN ? AND ?
            ORDER BY pj.date_travail
        `, [employeId, debut, fin]);
    },

    /**
     * Récupère le planning de tous les employés pour une date
     */
    getByDate(date) {
        return db.getAll(`
            SELECT pj.*, e.nom, e.prenom, e.categorie_id, ch.description, ch.heures, ch.type
            FROM planning_journalier pj
            JOIN employes e ON pj.employe_id = e.id
            LEFT JOIN codes_horaires ch ON pj.code = ch.code
            WHERE pj.date_travail = ? AND e.actif = 1
            ORDER BY e.categorie_id, e.nom
        `, [date]);
    },

    /**
     * Définit ou met à jour un shift
     */
    setShift(employeId, date, code, heuresReelles = null, commentaire = null) {
        const existing = db.get(
            'SELECT id FROM planning_journalier WHERE employe_id = ? AND date_travail = ?',
            [employeId, date]
        );

        if (existing) {
            if (code === null || code === '') {
                // Supprimer le shift
                db.run('DELETE FROM planning_journalier WHERE id = ?', [existing.id]);
            } else {
                // Mettre à jour
                db.run(`
                    UPDATE planning_journalier
                    SET code = ?, heures_reelles = ?, commentaire = ?
                    WHERE id = ?
                `, [code, heuresReelles, commentaire, existing.id]);
            }
        } else if (code !== null && code !== '') {
            // Créer
            db.run(`
                INSERT INTO planning_journalier (employe_id, date_travail, code, heures_reelles, commentaire)
                VALUES (?, ?, ?, ?, ?)
            `, [employeId, date, code, heuresReelles, commentaire]);
        }
    },

    /**
     * Supprime un shift
     */
    clearShift(employeId, date) {
        db.run('DELETE FROM planning_journalier WHERE employe_id = ? AND date_travail = ?', [employeId, date]);
    },

    /**
     * Importe le planning d'un mois complet pour un employé
     * @param {number} employeId - ID de l'employé
     * @param {number} annee - Année
     * @param {number} mois - Mois (1-12)
     * @param {Array} shifts - Tableau indexé par jour (1-31), valeur = code ou null
     */
    importMois(employeId, annee, mois, shifts) {
        const daysInMonth = new Date(annee, mois, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const code = shifts[day] || null;
            const date = `${annee}-${String(mois).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            if (code) {
                this.setShift(employeId, date, code);
            }
        }
    },

    /**
     * Calcule les heures totales d'un employé pour un mois
     */
    getHeuresMois(employeId, annee, mois) {
        const result = db.get(`
            SELECT
                COALESCE(SUM(COALESCE(pj.heures_reelles, ch.heures)), 0) as heures_totales,
                COUNT(CASE WHEN ch.type = 'jour' OR ch.type = 'present' THEN 1 END) as jours_travailles,
                COUNT(CASE WHEN ch.type = 'nuit' THEN 1 END) as nuits_travaillees,
                COUNT(CASE WHEN ch.type = 'conge' THEN 1 END) as jours_conge,
                COUNT(CASE WHEN ch.type = 'absent' THEN 1 END) as jours_absent,
                COUNT(CASE WHEN ch.type = 'formation' THEN 1 END) as jours_formation
            FROM planning_journalier pj
            LEFT JOIN codes_horaires ch ON pj.code = ch.code
            WHERE pj.employe_id = ?
            AND strftime('%Y', pj.date_travail) = ?
            AND strftime('%m', pj.date_travail) = ?
        `, [employeId, String(annee), String(mois).padStart(2, '0')]);

        return result || {
            heures_totales: 0,
            jours_travailles: 0,
            nuits_travaillees: 0,
            jours_conge: 0,
            jours_absent: 0,
            jours_formation: 0
        };
    },

    /**
     * Récapitulatif des heures pour tous les employés d'un mois
     */
    getRecapMois(annee, mois) {
        const employes = EmployeModel.getAll();
        const recap = [];

        for (const emp of employes) {
            const heures = this.getHeuresMois(emp.id, annee, mois);
            recap.push({
                employe_id: emp.id,
                nom: emp.nom,
                prenom: emp.prenom,
                categorie: emp.categorie_nom,
                categorie_icon: emp.categorie_icon,
                type_contrat: emp.type_contrat,
                ...heures
            });
        }

        return recap;
    },

    /**
     * Récapitulatif annuel des heures pour un employé
     */
    getRecapAnnuel(employeId, annee) {
        const recap = [];

        for (let mois = 1; mois <= 12; mois++) {
            const heures = this.getHeuresMois(employeId, annee, mois);
            recap.push({
                mois,
                ...heures
            });
        }

        // Totaux annuels
        const totaux = recap.reduce((acc, m) => ({
            heures_totales: acc.heures_totales + m.heures_totales,
            jours_travailles: acc.jours_travailles + m.jours_travailles,
            nuits_travaillees: acc.nuits_travaillees + m.nuits_travaillees,
            jours_conge: acc.jours_conge + m.jours_conge,
            jours_absent: acc.jours_absent + m.jours_absent,
            jours_formation: acc.jours_formation + m.jours_formation
        }), {
            heures_totales: 0,
            jours_travailles: 0,
            nuits_travaillees: 0,
            jours_conge: 0,
            jours_absent: 0,
            jours_formation: 0
        });

        return { mois: recap, totaux };
    }
};

// ============================================================================
// MODÈLE EFFECTIFS (STAFFING)
// ============================================================================

const EffectifsModel = {
    /**
     * Récupère les besoins en effectifs
     */
    getBesoins() {
        return db.getAll('SELECT * FROM besoins_effectifs ORDER BY id');
    },

    /**
     * Calcule les effectifs réels pour une date
     */
    getEffectifsDate(date) {
        const besoins = this.getBesoins();
        const result = {};

        for (const besoin of besoins) {
            const count = db.get(`
                SELECT COUNT(*) as count
                FROM planning_journalier pj
                JOIN employes e ON pj.employe_id = e.id
                JOIN codes_vers_postes cvp ON pj.code = cvp.code
                WHERE pj.date_travail = ?
                AND cvp.poste_id = ?
                AND e.actif = 1
            `, [date, besoin.id]);

            result[besoin.id] = {
                ...besoin,
                effectif_reel: count?.count || 0,
                status: this.getStatus(count?.count || 0, besoin.effectif_minimum)
            };
        }

        return result;
    },

    /**
     * Calcule les effectifs pour un mois complet
     */
    getEffectifsMois(annee, mois) {
        const daysInMonth = new Date(annee, mois, 0).getDate();
        const result = {};

        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${annee}-${String(mois).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            result[day] = this.getEffectifsDate(date);
        }

        return result;
    },

    /**
     * Détermine le statut d'un effectif
     */
    getStatus(reel, minimum) {
        if (reel >= minimum) return 'ok';
        if (reel > 0) return 'warning';
        return 'critical';
    }
};

// ============================================================================
// MODÈLE JOURS FÉRIÉS
// ============================================================================

const JoursFeriesModel = {
    /**
     * Récupère les jours fériés d'une année
     */
    getByAnnee(annee) {
        return db.getAll('SELECT * FROM jours_feries WHERE annee = ? ORDER BY date_ferie', [annee]);
    },

    /**
     * Vérifie si une date est fériée
     */
    isFerie(date) {
        const result = db.get('SELECT 1 FROM jours_feries WHERE date_ferie = ?', [date]);
        return result !== null;
    },

    /**
     * Ajoute un jour férié
     */
    add(date, nom, annee) {
        db.run('INSERT OR REPLACE INTO jours_feries (date_ferie, nom, annee) VALUES (?, ?, ?)', [date, nom, annee]);
    },

    /**
     * Supprime un jour férié
     */
    remove(date) {
        db.run('DELETE FROM jours_feries WHERE date_ferie = ?', [date]);
    }
};

// ============================================================================
// MIGRATION DEPUIS LOCALSTORAGE
// ============================================================================

/**
 * Migre les données depuis le format localStorage vers SQLite
 * @param {Object} legacyData - Données du localStorage (format app.js)
 */
function migratePlanningFromLocalStorage(legacyData) {
    if (!legacyData || !legacyData.employees) {
        console.log('Aucune donnée legacy à migrer');
        return { migrated: 0 };
    }

    let migratedCount = 0;

    for (const emp of legacyData.employees) {
        // Séparer nom et prénom si format "Prénom Nom"
        const nameParts = emp.name.split(' ');
        const prenom = nameParts.length > 1 ? nameParts[0] : null;
        const nom = nameParts.length > 1 ? nameParts.slice(1).join(' ') : emp.name;

        // Créer l'employé
        const employeId = EmployeModel.create({
            nom,
            prenom,
            categorie_id: emp.category,
            type_contrat: emp.type || 'permanent',
            date_debut: emp.startDate || null,
            date_fin: emp.endDate || null
        });

        // Importer le planning
        if (emp.planning) {
            for (const [monthKey, shifts] of Object.entries(emp.planning)) {
                const [annee, mois] = monthKey.split('-').map(Number);
                PlanningModel.importMois(employeId, annee, mois, shifts);
            }
        }

        migratedCount++;
    }

    console.log(`Migration terminée: ${migratedCount} employés migrés`);
    return { migrated: migratedCount };
}

/**
 * Vérifie si une migration depuis localStorage est nécessaire
 */
function needsPlanningMigration() {
    const count = db.get('SELECT COUNT(*) as count FROM employes').count;
    return count === 0;
}
