/**
 * Modèles de données pour CHU Babinski
 * Opérations CRUD et logique métier
 */

// ============================================================================
// MODÈLE HÉBERGÉ
// ============================================================================

const HebergeModel = {
    /**
     * Récupère tous les hébergés actifs
     */
    getAll(type = null) {
        let sql = 'SELECT * FROM heberges WHERE actif = 1';
        const params = [];

        if (type) {
            sql += ' AND type = ?';
            params.push(type);
        }

        sql += ' ORDER BY nom, prenom';
        return db.getAll(sql, params);
    },

    /**
     * Récupère un hébergé par ID
     */
    getById(id) {
        return db.get('SELECT * FROM heberges WHERE id = ?', [id]);
    },

    /**
     * Récupère les femmes isolées
     */
    getFemmesIsolees() {
        return this.getAll('femme_isolee');
    },

    /**
     * Récupère les adultes des familles
     */
    getAdultesFamilles() {
        return this.getAll('adulte_famille');
    },

    /**
     * Récupère les enfants
     */
    getEnfants() {
        return this.getAll('enfant');
    },

    /**
     * Récupère les membres d'une famille
     */
    getByFamille(familleId) {
        return db.getAll(
            'SELECT * FROM heberges WHERE famille_id = ? AND actif = 1 ORDER BY type DESC, date_naissance',
            [familleId]
        );
    },

    /**
     * Récupère les hébergés avec revenus (pour PAF)
     */
    getAvecRevenus() {
        return db.getAll(`
            SELECT * FROM heberges
            WHERE actif = 1 AND salaire > 0
            ORDER BY nom, prenom
        `);
    },

    /**
     * Recherche des hébergés
     */
    search(query) {
        const pattern = `%${query}%`;
        return db.getAll(`
            SELECT * FROM heberges
            WHERE actif = 1
            AND (nom LIKE ? OR prenom LIKE ? OR chambre LIKE ?)
            ORDER BY nom, prenom
        `, [pattern, pattern, pattern]);
    },

    /**
     * Met à jour un hébergé
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

        db.run(`UPDATE heberges SET ${fields.join(', ')} WHERE id = ?`, values);
    },

    /**
     * Statistiques générales
     */
    getStats() {
        return {
            total: db.get('SELECT COUNT(*) as count FROM heberges WHERE actif = 1').count,
            femmesIsolees: db.get("SELECT COUNT(*) as count FROM heberges WHERE actif = 1 AND type = 'femme_isolee'").count,
            adultesFamilles: db.get("SELECT COUNT(*) as count FROM heberges WHERE actif = 1 AND type = 'adulte_famille'").count,
            enfants: db.get("SELECT COUNT(*) as count FROM heberges WHERE actif = 1 AND type = 'enfant'").count,
            avecRevenus: db.get('SELECT COUNT(*) as count FROM heberges WHERE actif = 1 AND salaire > 0').count
        };
    },

    /**
     * Crée un nouvel hébergé
     * @param {Object} data - Données de l'hébergé
     * @returns {number} ID du nouvel hébergé
     */
    create(data) {
        const {
            type,
            famille_id = null,
            nom,
            prenom,
            date_naissance = null,
            sexe = null,
            lieu_naissance = null,
            nationalite = null,
            telephone = null,
            email = null,
            statut = null,
            assurance_maladie = null,
            chambre = null,
            ts_referente = null,
            date_arrivee = null,
            aide_alimentaire = null,
            salaire = 0,
            compte_bancaire = null,
            emploi = null,
            scolarite = null,
            ecole = null,
            commentaire = null
        } = data;

        // Validation
        if (!type || !['femme_isolee', 'adulte_famille', 'enfant'].includes(type)) {
            throw new Error('Type invalide. Doit être: femme_isolee, adulte_famille ou enfant');
        }
        if (!nom || !prenom) {
            throw new Error('Nom et prénom sont obligatoires');
        }

        db.run(`
            INSERT INTO heberges (
                type, famille_id, nom, prenom, date_naissance, sexe, lieu_naissance,
                nationalite, telephone, email, statut, assurance_maladie, chambre,
                ts_referente, date_arrivee, aide_alimentaire, salaire, compte_bancaire,
                emploi, scolarite, ecole, commentaire, actif
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `, [
            type, famille_id, nom, prenom, date_naissance, sexe, lieu_naissance,
            nationalite, telephone, email, statut, assurance_maladie, chambre,
            ts_referente, date_arrivee, aide_alimentaire, salaire, compte_bancaire,
            emploi, scolarite, ecole, commentaire
        ]);

        return db.lastInsertRowId();
    },

    /**
     * Supprime un hébergé (désactivation soft)
     * @param {number} id - ID de l'hébergé
     * @returns {boolean} Succès de l'opération
     */
    delete(id) {
        const heberge = this.getById(id);
        if (!heberge) return false;

        db.run('UPDATE heberges SET actif = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return db.changes() > 0;
    },

    /**
     * Supprime définitivement un hébergé (hard delete)
     * À utiliser avec précaution
     * @param {number} id - ID de l'hébergé
     * @returns {boolean} Succès de l'opération
     */
    hardDelete(id) {
        // Supprimer les enregistrements liés
        db.run('DELETE FROM paf WHERE heberge_id = ?', [id]);
        db.run('DELETE FROM cohesia WHERE heberge_id = ?', [id]);
        db.run('DELETE FROM absences WHERE heberge_id = ?', [id]);
        db.run('DELETE FROM avances WHERE heberge_id = ?', [id]);
        db.run('DELETE FROM mouvements WHERE heberge_id = ?', [id]);

        // Supprimer l'hébergé
        db.run('DELETE FROM heberges WHERE id = ?', [id]);
        return db.changes() > 0;
    },

    /**
     * Réactive un hébergé désactivé
     * @param {number} id - ID de l'hébergé
     * @returns {boolean} Succès de l'opération
     */
    reactivate(id) {
        db.run('UPDATE heberges SET actif = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return db.changes() > 0;
    },

    /**
     * Récupère les hébergés inactifs (archivés)
     */
    getInactifs() {
        return db.getAll('SELECT * FROM heberges WHERE actif = 0 ORDER BY nom, prenom');
    }
};

// ============================================================================
// MODÈLE FAMILLE
// ============================================================================

const FamilleModel = {
    getAll() {
        return db.getAll('SELECT * FROM familles ORDER BY id');
    },

    getById(id) {
        return db.get('SELECT * FROM familles WHERE id = ?', [id]);
    },

    getWithMembers(id) {
        const famille = this.getById(id);
        if (!famille) return null;

        famille.membres = HebergeModel.getByFamille(id);
        famille.adultes = famille.membres.filter(m => m.type === 'adulte_famille');
        famille.enfants = famille.membres.filter(m => m.type === 'enfant');

        return famille;
    },

    /**
     * Compte le nombre de personnes dans une famille
     */
    getComposition(familleId) {
        const result = db.get(
            'SELECT COUNT(*) as count FROM heberges WHERE famille_id = ? AND actif = 1',
            [familleId]
        );
        return result ? result.count : 0;
    },

    /**
     * Crée une nouvelle famille
     * @param {Object} data - Données de la famille
     * @returns {number} ID de la nouvelle famille
     */
    create(data) {
        const {
            composition = null,
            chambre = null,
            ts_referente = null,
            date_arrivee = null,
            date_fin_contrat = null,
            aide_alimentaire = null,
            montant_aide = null,
            demande_logement = null,
            type_logement_demande = null,
            numero_dls = null,
            dalo_daho = null,
            no_syplo = null,
            arpp = null,
            commentaire = null
        } = data;

        db.run(`
            INSERT INTO familles (
                composition, chambre, ts_referente, date_arrivee, date_fin_contrat,
                aide_alimentaire, montant_aide, demande_logement, type_logement_demande,
                numero_dls, dalo_daho, no_syplo, arpp, commentaire
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            composition, chambre, ts_referente, date_arrivee, date_fin_contrat,
            aide_alimentaire, montant_aide, demande_logement, type_logement_demande,
            numero_dls, dalo_daho, no_syplo, arpp, commentaire
        ]);

        return db.lastInsertRowId();
    },

    /**
     * Crée une famille complète avec ses membres
     * @param {Object} familleData - Données de la famille
     * @param {Array} adultes - Liste des adultes
     * @param {Array} enfants - Liste des enfants
     * @returns {Object} Famille créée avec ses membres
     */
    createWithMembers(familleData, adultes = [], enfants = []) {
        // Créer la famille
        const familleId = this.create(familleData);

        // Ajouter les adultes
        const adultesIds = adultes.map(adulte => {
            return HebergeModel.create({
                ...adulte,
                type: 'adulte_famille',
                famille_id: familleId,
                chambre: familleData.chambre,
                ts_referente: familleData.ts_referente,
                date_arrivee: familleData.date_arrivee
            });
        });

        // Ajouter les enfants
        const enfantsIds = enfants.map(enfant => {
            return HebergeModel.create({
                ...enfant,
                type: 'enfant',
                famille_id: familleId,
                chambre: familleData.chambre,
                ts_referente: familleData.ts_referente,
                date_arrivee: familleData.date_arrivee
            });
        });

        return {
            familleId,
            adultesIds,
            enfantsIds
        };
    },

    /**
     * Met à jour une famille
     * @param {number} id - ID de la famille
     * @param {Object} data - Données à mettre à jour
     */
    update(id, data) {
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(data)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }

        if (fields.length === 0) return;

        values.push(id);
        db.run(`UPDATE familles SET ${fields.join(', ')} WHERE id = ?`, values);
    },

    /**
     * Supprime une famille et désactive tous ses membres
     * @param {number} id - ID de la famille
     * @returns {boolean} Succès de l'opération
     */
    delete(id) {
        const famille = this.getById(id);
        if (!famille) return false;

        // Désactiver tous les membres de la famille
        db.run('UPDATE heberges SET actif = 0 WHERE famille_id = ?', [id]);

        // Supprimer la famille
        db.run('DELETE FROM familles WHERE id = ?', [id]);

        return db.changes() > 0;
    },

    /**
     * Ajoute un membre à une famille existante
     * @param {number} familleId - ID de la famille
     * @param {Object} membreData - Données du membre
     * @param {string} type - 'adulte_famille' ou 'enfant'
     * @returns {number} ID du nouveau membre
     */
    addMembre(familleId, membreData, type = 'adulte_famille') {
        const famille = this.getById(familleId);
        if (!famille) throw new Error('Famille non trouvée');

        return HebergeModel.create({
            ...membreData,
            type,
            famille_id: familleId,
            chambre: famille.chambre,
            ts_referente: famille.ts_referente,
            date_arrivee: famille.date_arrivee
        });
    },

    /**
     * Retire un membre d'une famille (le désactive)
     * @param {number} membreId - ID du membre à retirer
     * @returns {boolean} Succès de l'opération
     */
    removeMembre(membreId) {
        return HebergeModel.delete(membreId);
    },

    /**
     * Recherche des familles
     * @param {string} query - Terme de recherche
     * @returns {Array} Familles correspondantes
     */
    search(query) {
        const pattern = `%${query}%`;
        return db.getAll(`
            SELECT DISTINCT f.*
            FROM familles f
            LEFT JOIN heberges h ON h.famille_id = f.id AND h.actif = 1
            WHERE f.chambre LIKE ?
               OR f.ts_referente LIKE ?
               OR h.nom LIKE ?
               OR h.prenom LIKE ?
            ORDER BY f.id
        `, [pattern, pattern, pattern, pattern]);
    }
};

// ============================================================================
// MODÈLE CALCUL MENSUEL (PAF + Aide pour TOUS les hébergés)
// ============================================================================

const CalculMensuelModel = {
    /**
     * Récupère le barème (aide + taux PAF) selon composition
     */
    getBareme(composition) {
        const result = db.get(
            'SELECT montant, taux_paf FROM cohesia_bareme WHERE composition = ?',
            [Math.min(composition, 12)]
        );
        return result || { montant: 220, taux_paf: 0.3459 };
    },

    /**
     * Calcule PAF et Aide pour un hébergé/famille
     * @param {number} composition - Nombre de personnes dans le foyer
     * @param {number} ressources - Revenus mensuels
     * @param {number} joursAbsence - Jours d'absence dans le mois
     * @param {number} avanceADeduire - Montant d'avance à déduire
     */
    calculer(composition, ressources = 0, joursAbsence = 0, avanceADeduire = 0) {
        const bareme = this.getBareme(composition);
        const deductionJour = parseFloat(
            db.get("SELECT valeur FROM configuration WHERE cle = 'absence_deduction_jour'")?.valeur || 7.10
        );

        // Aide théorique selon composition
        const aideTheorique = bareme.montant;

        // PAF = Ressources × Taux (selon composition)
        const pafTheorique = ressources > 0
            ? Math.round(ressources * bareme.taux_paf)
            : 0;

        // Déduction pour absences
        const deductionAbsence = Math.round(joursAbsence * deductionJour);

        // Somme à distribuer = Aide - PAF - Absences - Avances
        // Si négatif, la personne ne reçoit rien (elle paie plus qu'elle ne reçoit)
        const sommeADistribuer = Math.max(0, aideTheorique - pafTheorique - deductionAbsence - avanceADeduire);

        return {
            composition,
            ressources,
            aideTheorique,
            tauxPaf: bareme.taux_paf,
            pafTheorique,
            joursAbsence,
            deductionAbsence,
            avanceADeduire,
            sommeADistribuer
        };
    },

    /**
     * Génère le calcul mensuel pour TOUS les bénéficiaires
     * (femmes isolées + familles)
     */
    genererMois(annee, mois) {
        const resultats = [];

        // 1. Femmes isolées (bénéficiaires Cohésia ou SSP)
        const femmesIsolees = db.getAll(`
            SELECT * FROM heberges
            WHERE type = 'femme_isolee' AND actif = 1
            AND aide_alimentaire IN ('Cohesia', 'SSP')
            ORDER BY nom, prenom
        `);

        for (const f of femmesIsolees) {
            const joursAbsence = AbsenceModel.getJoursMois(f.id, annee, mois);
            const avance = AvanceModel.getMontantADeduire(f.id, annee, mois);
            const calcul = this.calculer(1, f.salaire || 0, joursAbsence, avance);

            resultats.push({
                type: 'femme_isolee',
                id: f.id,
                familleId: null,
                nom: f.nom,
                prenom: f.prenom,
                chambre: f.chambre,
                ...calcul
            });
        }

        // 2. Familles (bénéficiaires Cohésia ou SSP)
        const familles = db.getAll(`
            SELECT f.*,
                   (SELECT SUM(COALESCE(h.salaire, 0)) FROM heberges h WHERE h.famille_id = f.id AND h.actif = 1) as ressources_famille
            FROM familles f
            WHERE f.aide_alimentaire IN ('Cohesia', 'SSP')
            ORDER BY f.id
        `);

        for (const fam of familles) {
            const composition = FamilleModel.getComposition(fam.id);
            // Pour les absences famille, on prend le premier adulte comme référence
            const premierAdulte = db.get(
                "SELECT id FROM heberges WHERE famille_id = ? AND type = 'adulte_famille' LIMIT 1",
                [fam.id]
            );
            const joursAbsence = premierAdulte ? AbsenceModel.getJoursMois(premierAdulte.id, annee, mois) : 0;
            const avance = premierAdulte ? AvanceModel.getMontantADeduire(premierAdulte.id, annee, mois) : 0;

            const calcul = this.calculer(composition, fam.ressources_famille || 0, joursAbsence, avance);

            // Récupérer le nom de famille
            const adulte = db.get(
                "SELECT nom, prenom FROM heberges WHERE famille_id = ? AND type = 'adulte_famille' LIMIT 1",
                [fam.id]
            );

            resultats.push({
                type: 'famille',
                id: null,
                familleId: fam.id,
                nom: adulte?.nom || `Famille ${fam.id}`,
                prenom: adulte?.prenom || '',
                chambre: fam.chambre,
                ...calcul
            });
        }

        return resultats;
    },

    /**
     * Récupère le récapitulatif stocké du mois
     */
    getRecapMensuel(annee, mois) {
        return this.genererMois(annee, mois);
    }
};

// ============================================================================
// MODÈLE PAF (Participation Aux Frais) - Suivi des paiements
// ============================================================================

const PAFModel = {
    /**
     * Récupère le barème selon composition
     */
    getBareme(composition) {
        return CalculMensuelModel.getBareme(composition);
    },

    /**
     * Calcule le PAF théorique
     */
    calculer(ressources, composition = 1) {
        const bareme = this.getBareme(composition);
        if (ressources <= 0) return 0;
        return Math.round(ressources * bareme.taux_paf);
    },

    /**
     * Enregistre un paiement PAF
     */
    enregistrerPaiement(hebergeId, familleId, annee, mois, montant, datePaiement) {
        // Créer ou récupérer l'enregistrement
        const existing = db.get(`
            SELECT * FROM paf
            WHERE (heberge_id = ? OR famille_id = ?) AND annee = ? AND mois = ?
        `, [hebergeId, familleId, annee, mois]);

        if (existing) {
            const nouveauMontant = existing.montant_recu + montant;
            let statut = 'partiel';
            if (nouveauMontant >= existing.montant_theorique) statut = 'complet';

            db.run(`
                UPDATE paf SET montant_recu = ?, date_paiement = ?, statut = ?
                WHERE id = ?
            `, [nouveauMontant, datePaiement, statut, existing.id]);
        } else {
            // Calculer le PAF théorique
            let composition = 1;
            let ressources = 0;
            if (familleId) {
                composition = FamilleModel.getComposition(familleId);
                const fam = db.get(`
                    SELECT (SELECT SUM(COALESCE(h.salaire, 0)) FROM heberges h WHERE h.famille_id = f.id) as ress
                    FROM familles f WHERE f.id = ?
                `, [familleId]);
                ressources = fam?.ress || 0;
            } else if (hebergeId) {
                const h = HebergeModel.getById(hebergeId);
                ressources = h?.salaire || 0;
            }

            const pafTheorique = this.calculer(ressources, composition);
            const statut = montant >= pafTheorique ? 'complet' : 'partiel';

            db.run(`
                INSERT INTO paf (heberge_id, annee, mois, ressources, montant_theorique, montant_recu, date_paiement, statut)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [hebergeId || null, annee, mois, ressources, pafTheorique, montant, datePaiement, statut]);
        }

        // Créer le mouvement de caisse
        MouvementModel.creer({
            date: datePaiement,
            type: 'PAF',
            sens: 'entree',
            hebergeId: hebergeId,
            montant: montant,
            description: `PAF ${mois}/${annee}`
        });

        return true;
    },

    /**
     * Récupère le récapitulatif mensuel pour l'interface
     */
    getRecapMensuel(annee, mois) {
        return CalculMensuelModel.genererMois(annee, mois);
    },

    genererMois(annee, mois) {
        // La génération est maintenant faite par CalculMensuelModel
        return CalculMensuelModel.genererMois(annee, mois).length;
    }
};

// ============================================================================
// MODÈLE COHÉSIA (Aide alimentaire) - Suivi des distributions
// ============================================================================

const CohesiaModel = {
    /**
     * Récupère le barème Cohésia (aide) selon composition
     */
    getBareme(composition) {
        const result = CalculMensuelModel.getBareme(composition);
        return result.montant;
    },

    /**
     * Enregistre une distribution Cohésia
     */
    enregistrerDistribution(hebergeId, familleId, annee, mois, montant, dateDistribution) {
        // Créer ou récupérer l'enregistrement
        const existing = db.get(`
            SELECT * FROM cohesia
            WHERE (heberge_id = ? OR famille_id = ?) AND annee = ? AND mois = ?
        `, [hebergeId, familleId, annee, mois]);

        if (existing) {
            db.run(`
                UPDATE cohesia SET montant_distribue = ?, date_distribution = ?, distribue = 1
                WHERE id = ?
            `, [montant, dateDistribution, existing.id]);
        } else {
            let composition = 1;
            if (familleId) {
                composition = FamilleModel.getComposition(familleId);
            }
            const aideTheorique = this.getBareme(composition);

            db.run(`
                INSERT INTO cohesia (heberge_id, famille_id, annee, mois, composition, montant_theorique, montant_distribue, date_distribution, distribue)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
            `, [hebergeId || null, familleId || null, annee, mois, composition, aideTheorique, montant, dateDistribution]);
        }

        // Créer le mouvement de caisse
        MouvementModel.creer({
            date: dateDistribution,
            type: 'Cohesia',
            sens: 'sortie',
            hebergeId: hebergeId,
            montant: montant,
            description: `Aide ${mois}/${annee}`
        });

        return true;
    },

    /**
     * Récupère le récapitulatif mensuel
     */
    getRecapMensuel(annee, mois) {
        const calculs = CalculMensuelModel.genererMois(annee, mois);

        // Enrichir avec les infos de distribution
        return calculs.map(c => {
            const distrib = db.get(`
                SELECT * FROM cohesia
                WHERE ((heberge_id = ? AND ? IS NOT NULL) OR (famille_id = ? AND ? IS NOT NULL))
                AND annee = ? AND mois = ?
            `, [c.id, c.id, c.familleId, c.familleId, annee, mois]);

            return {
                ...c,
                distribue: distrib?.distribue || 0,
                montant_distribue: distrib?.montant_distribue || 0,
                date_distribution: distrib?.date_distribution
            };
        });
    },

    getOrCreate(hebergeId, familleId, annee, mois) {
        // Compatibilité avec l'ancien code
        return { id: null };
    },

    /**
     * Annule une distribution (décoche)
     */
    annulerDistribution(hebergeId, familleId, annee, mois) {
        db.run(`
            UPDATE cohesia SET distribue = 0, montant_distribue = 0, date_distribution = NULL
            WHERE ((heberge_id = ? AND ? IS NOT NULL) OR (famille_id = ? AND ? IS NOT NULL))
            AND annee = ? AND mois = ?
        `, [hebergeId, hebergeId, familleId, familleId, annee, mois]);

        return true;
    }
};

// ============================================================================
// MODÈLE ABSENCES
// ============================================================================

const AbsenceModel = {
    /**
     * Ajoute une absence
     */
    ajouter(hebergeId, dateDebut, dateFin, raison = null, impactAide = true) {
        db.run(`
            INSERT INTO absences (heberge_id, date_debut, date_fin, raison, impact_aide)
            VALUES (?, ?, ?, ?, ?)
        `, [hebergeId, dateDebut, dateFin, raison, impactAide ? 1 : 0]);

        return db.lastInsertRowId();
    },

    /**
     * Récupère les absences d'un hébergé
     */
    getByHeberge(hebergeId) {
        return db.getAll(
            'SELECT * FROM absences WHERE heberge_id = ? ORDER BY date_debut DESC',
            [hebergeId]
        );
    },

    /**
     * Calcule les jours d'absence pour un mois
     */
    getJoursMois(hebergeId, annee, mois) {
        const premierJour = `${annee}-${String(mois).padStart(2, '0')}-01`;
        const dernierJour = new Date(annee, mois, 0).toISOString().split('T')[0];

        const absences = db.getAll(`
            SELECT date_debut, date_fin FROM absences
            WHERE heberge_id = ? AND impact_aide = 1
            AND date_debut <= ? AND (date_fin IS NULL OR date_fin >= ?)
        `, [hebergeId, dernierJour, premierJour]);

        let totalJours = 0;
        const debutMois = new Date(premierJour);
        const finMois = new Date(dernierJour);

        for (const a of absences) {
            const debut = new Date(Math.max(new Date(a.date_debut), debutMois));
            const fin = a.date_fin
                ? new Date(Math.min(new Date(a.date_fin), finMois))
                : finMois;

            const jours = Math.ceil((fin - debut) / (1000 * 60 * 60 * 24)) + 1;
            totalJours += jours;
        }

        return totalJours;
    },

    /**
     * Supprime une absence
     */
    supprimer(id) {
        db.run('DELETE FROM absences WHERE id = ?', [id]);
    },

    /**
     * Récupère les absences du mois
     */
    getAbsencesMois(annee, mois) {
        const premierJour = `${annee}-${String(mois).padStart(2, '0')}-01`;
        const dernierJour = new Date(annee, mois, 0).toISOString().split('T')[0];

        return db.getAll(`
            SELECT a.*, h.nom, h.prenom, h.chambre
            FROM absences a
            JOIN heberges h ON a.heberge_id = h.id
            WHERE a.date_debut <= ? AND (a.date_fin IS NULL OR a.date_fin >= ?)
            ORDER BY a.date_debut
        `, [dernierJour, premierJour]);
    }
};

// ============================================================================
// MODÈLE AVANCES
// ============================================================================

const AvanceModel = {
    /**
     * Crée une nouvelle avance
     */
    creer(hebergeId, objet, montantTotal, contributionChuPct, nbMensualites, dateAccord) {
        const montantChu = Math.round(montantTotal * contributionChuPct / 100 * 100) / 100;
        const montantHeberge = montantTotal - montantChu;

        db.run(`
            INSERT INTO avances (
                heberge_id, objet, montant_total, contribution_chu_pct,
                montant_chu, montant_heberge, nb_mensualites, date_accord
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [hebergeId, objet, montantTotal, contributionChuPct, montantChu, montantHeberge, nbMensualites, dateAccord]);

        const avanceId = db.lastInsertRowId();

        // Créer l'échéancier de remboursement
        const mensualite = Math.round(montantHeberge / nbMensualites * 100) / 100;
        const dateDebut = new Date(dateAccord);

        for (let i = 0; i < nbMensualites; i++) {
            const date = new Date(dateDebut);
            date.setMonth(date.getMonth() + i + 1);

            db.run(`
                INSERT INTO avances_remboursements (avance_id, annee, mois, montant_du)
                VALUES (?, ?, ?, ?)
            `, [avanceId, date.getFullYear(), date.getMonth() + 1, mensualite]);
        }

        return avanceId;
    },

    /**
     * Récupère les avances d'un hébergé
     */
    getByHeberge(hebergeId) {
        return db.getAll(
            'SELECT * FROM avances WHERE heberge_id = ? ORDER BY date_accord DESC',
            [hebergeId]
        );
    },

    /**
     * Récupère les avances en cours
     */
    getEnCours() {
        return db.getAll(`
            SELECT a.*, h.nom, h.prenom, h.chambre
            FROM avances a
            JOIN heberges h ON a.heberge_id = h.id
            WHERE a.statut = 'en_cours'
            ORDER BY a.date_accord
        `);
    },

    /**
     * Récupère l'échéancier d'une avance
     */
    getEcheancier(avanceId) {
        return db.getAll(
            'SELECT * FROM avances_remboursements WHERE avance_id = ? ORDER BY annee, mois',
            [avanceId]
        );
    },

    /**
     * Enregistre un remboursement
     */
    enregistrerRemboursement(remboursementId, montant, datePaiement) {
        const remb = db.get('SELECT * FROM avances_remboursements WHERE id = ?', [remboursementId]);
        if (!remb) return false;

        const nouveauMontant = remb.montant_paye + montant;
        let statut = 'partiel';
        if (nouveauMontant >= remb.montant_du) statut = 'paye';

        db.run(`
            UPDATE avances_remboursements
            SET montant_paye = ?, date_paiement = ?, statut = ?
            WHERE id = ?
        `, [nouveauMontant, datePaiement, statut, remboursementId]);

        // Vérifier si l'avance est terminée
        const avance = db.get('SELECT * FROM avances WHERE id = ?', [remb.avance_id]);
        const resteAPayer = db.get(`
            SELECT SUM(montant_du - montant_paye) as reste
            FROM avances_remboursements WHERE avance_id = ?
        `, [remb.avance_id]);

        if (resteAPayer.reste <= 0) {
            db.run("UPDATE avances SET statut = 'termine' WHERE id = ?", [remb.avance_id]);
        }

        return true;
    },

    /**
     * Montant à déduire ce mois pour un hébergé
     */
    getMontantADeduire(hebergeId, annee, mois) {
        const result = db.get(`
            SELECT SUM(ar.montant_du) as total
            FROM avances_remboursements ar
            JOIN avances a ON ar.avance_id = a.id
            WHERE a.heberge_id = ? AND ar.annee = ? AND ar.mois = ?
            AND ar.statut != 'paye' AND a.statut = 'en_cours'
        `, [hebergeId, annee, mois]);

        return result?.total || 0;
    }
};

// ============================================================================
// MODÈLE CAISSE
// ============================================================================

const CaisseModel = {
    /**
     * Récupère ou crée le mois de caisse
     */
    getOrCreateMois(annee, mois) {
        let caisse = db.get(
            'SELECT * FROM caisse_mensuelle WHERE annee = ? AND mois = ?',
            [annee, mois]
        );

        if (!caisse) {
            // Récupérer le solde du mois précédent
            let soldeInitial = parseFloat(
                db.get("SELECT valeur FROM configuration WHERE cle = 'caisse_solde_initial'")?.valeur || 200
            );

            const moisPrec = mois === 1 ? 12 : mois - 1;
            const anneePrec = mois === 1 ? annee - 1 : annee;
            const caissePrec = db.get(
                'SELECT solde_final FROM caisse_mensuelle WHERE annee = ? AND mois = ?',
                [anneePrec, moisPrec]
            );

            if (caissePrec) {
                soldeInitial = caissePrec.solde_final;
            }

            db.run(`
                INSERT INTO caisse_mensuelle (annee, mois, solde_initial, solde_final)
                VALUES (?, ?, ?, ?)
            `, [annee, mois, soldeInitial, soldeInitial]);

            caisse = db.get(
                'SELECT * FROM caisse_mensuelle WHERE annee = ? AND mois = ?',
                [annee, mois]
            );
        }

        return caisse;
    },

    /**
     * Recalcule les totaux du mois
     */
    recalculer(annee, mois) {
        const caisse = this.getOrCreateMois(annee, mois);

        const entrees = db.get(`
            SELECT COALESCE(SUM(montant), 0) as total FROM mouvements
            WHERE strftime('%Y', date_mouvement) = ? AND strftime('%m', date_mouvement) = ?
            AND sens = 'entree'
        `, [String(annee), String(mois).padStart(2, '0')]);

        const sorties = db.get(`
            SELECT COALESCE(SUM(montant), 0) as total FROM mouvements
            WHERE strftime('%Y', date_mouvement) = ? AND strftime('%m', date_mouvement) = ?
            AND sens = 'sortie'
        `, [String(annee), String(mois).padStart(2, '0')]);

        const soldeFinal = caisse.solde_initial + entrees.total - sorties.total;

        db.run(`
            UPDATE caisse_mensuelle
            SET total_entrees = ?, total_sorties = ?, solde_final = ?
            WHERE id = ?
        `, [entrees.total, sorties.total, soldeFinal, caisse.id]);

        return this.getOrCreateMois(annee, mois);
    },

    /**
     * Récupère le récapitulatif annuel
     */
    getRecapAnnuel(annee) {
        return db.getAll(`
            SELECT * FROM caisse_mensuelle
            WHERE annee = ?
            ORDER BY mois
        `, [annee]);
    }
};

// ============================================================================
// MODÈLE MOUVEMENTS
// ============================================================================

const MouvementModel = {
    /**
     * Crée un mouvement
     */
    creer({ date, type, sens, hebergeId, montant, description, referenceId, referenceType }) {
        db.run(`
            INSERT INTO mouvements (
                date_mouvement, type, sens, heberge_id, montant,
                description, reference_id, reference_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [date, type, sens, hebergeId, montant, description, referenceId, referenceType]);

        // Recalculer la caisse
        const d = new Date(date);
        CaisseModel.recalculer(d.getFullYear(), d.getMonth() + 1);

        return db.lastInsertRowId();
    },

    /**
     * Récupère les mouvements du mois
     */
    getMois(annee, mois) {
        return db.getAll(`
            SELECT m.*, h.nom, h.prenom
            FROM mouvements m
            LEFT JOIN heberges h ON m.heberge_id = h.id
            WHERE strftime('%Y', m.date_mouvement) = ?
            AND strftime('%m', m.date_mouvement) = ?
            ORDER BY m.date_mouvement DESC, m.id DESC
        `, [String(annee), String(mois).padStart(2, '0')]);
    },

    /**
     * Récupère les derniers mouvements
     */
    getDerniers(limit = 20) {
        return db.getAll(`
            SELECT m.*, h.nom, h.prenom
            FROM mouvements m
            LEFT JOIN heberges h ON m.heberge_id = h.id
            ORDER BY m.date_mouvement DESC, m.id DESC
            LIMIT ?
        `, [limit]);
    }
};
