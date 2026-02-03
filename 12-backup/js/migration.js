/**
 * Migration des données existantes vers la base de données SQLite
 * Importe FEMMES_ISOLEES et FAMILLES depuis les constantes JavaScript
 */

/**
 * Normalise le statut pour correspondre au schéma
 */
function normalizeStatut(statut) {
    if (!statut) return null;
    const s = statut.toLowerCase();
    if (s.includes('régulière') && !s.includes('ir')) return 'Reguliere';
    if (s.includes('irrégulière') || s.includes('irreguliere')) return 'Irreguliere';
    if (s.includes('demande') || s.includes('cours')) return 'Demande en cours';
    return statut;
}

/**
 * Normalise l'aide alimentaire
 */
function normalizeAide(aide) {
    if (!aide) return null;
    const a = aide.toLowerCase();
    if (a.includes('cohé') || a.includes('cohe')) return 'Cohesia';
    if (a.includes('ssp')) return 'SSP';
    if (a.includes('non') || a === '') return 'Non';
    return aide;
}

/**
 * Migre les femmes isolées vers la base de données
 */
function migrateFemmesIsolees(db, femmesIsolees) {
    let count = 0;

    for (const f of femmesIsolees) {
        db.run(`
            INSERT INTO heberges (
                id, type, nom, prenom, date_naissance, sexe, lieu_naissance, nationalite,
                telephone, email, adresse_domiciliation, date_renouvellement_domiciliation,
                type_pi1, validite_pi1, type_pi2, validite_pi2,
                date_entree_france, statut, date_1er_tds, oqtf, suivi_juridique,
                mesure_protection, etat_matrimonial, assurance_maladie, date_fin_droits, mdph,
                chambre, ts_referente, date_arrivee, situation_avant, date_fin_contrat,
                aide_alimentaire, montant_aide, allocations, montant_allocations,
                autre_ressource, montant_autre, salaire, compte_bancaire, titre_transport,
                declaration_impots, attestation_linguistique, cir, emploi, suivi_cip,
                inscription_france_travail, demande_logement, type_logement_demande,
                numero_dls, date_renouvellement_dls, dalo_daho, date_envoi_dalo,
                date_decision_dalo, dates_injonction_dalo, no_syplo, arpp,
                date_envoi_arpp, no_isis, no_alin, commentaire, actif
            ) VALUES (
                ?, 'femme_isolee', ?, ?, ?, 'F', ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?, 1
            )
        `, [
            f.id,
            f.nom || '',
            f.prenom || '',
            f.dateNaissance || null,
            f.lieuNaissance || null,
            f.nationalite || null,
            f.telephone || null,
            f.email || null,
            f.adresseDomiciliation || null,
            f.dateRenouvellement || null,
            f.typePI1 || null,
            f.validitePI1 || null,
            f.typePI2 || null,
            f.validitePI2 || null,
            f.dateEntreeFrance || null,
            normalizeStatut(f.statut),
            f.date1erTDS || null,
            f.oqtf || null,
            f.suiviJuridique || null,
            f.mesureProtection || null,
            f.etatMatrimonial || null,
            f.assuranceMaladie || null,
            f.dateFinDroits || null,
            f.mdph || null,
            f.chambre || null,
            f.tsReferente || null,
            f.dateArrivee || null,
            f.situationAvant || null,
            f.dateFinContrat || null,
            normalizeAide(f.aideAlimentaire),
            f.montantAide || null,
            f.allocations || null,
            f.montantAllocations || null,
            f.autreRessource || null,
            f.montantAutre || null,
            f.salaire || 0,
            f.compteBancaire || null,
            f.titreTransport || null,
            f.declarationImpots || null,
            f.attestationLinguistique || null,
            f.cir || null,
            f.emploi || null,
            f.suiviCIP || null,
            f.inscriptionFranceTravail || null,
            f.demandeLogement || null,
            f.typeLogementDemande || null,
            f.numeroDLS || null,
            f.dateRenouvellementDLS || null,
            f.daloDAHO || null,
            f.dateEnvoiDALO || null,
            f.dateDecisionDALO || null,
            f.datesInjonctionDALO || null,
            f.noSYPLO || null,
            f.arpp || null,
            f.dateEnvoiARPP || null,
            f.noISIS || null,
            f.noALIN || null,
            f.commentaire || null
        ]);
        count++;
    }

    console.log(`Migration: ${count} femmes isolées importées`);
    return count;
}

/**
 * Migre les familles vers la base de données
 */
function migrateFamilles(db, familles) {
    let famillesCount = 0;
    let adultesCount = 0;
    let enfantsCount = 0;

    for (const famille of familles) {
        // Créer l'entrée famille
        db.run(`
            INSERT INTO familles (
                id, composition, chambre, ts_referente, date_arrivee, date_fin_contrat,
                aide_alimentaire, montant_aide, demande_logement, type_logement_demande,
                numero_dls, dalo_daho, no_syplo, arpp, commentaire
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            famille.id,
            famille.composition || null,
            famille.chambre || null,
            famille.tsReferente || null,
            famille.dateArrivee || null,
            famille.dateFinContrat || null,
            normalizeAide(famille.aideAlimentaire),
            famille.montantAide || null,
            famille.demandeLogement || null,
            famille.typeLogementDemande || null,
            famille.numeroDLS || null,
            famille.daloDAHO || null,
            famille.noSYPLO || null,
            famille.arpp || null,
            famille.commentaire || null
        ]);
        famillesCount++;

        // Importer les adultes
        if (famille.adultes) {
            for (const adulte of famille.adultes) {
                db.run(`
                    INSERT INTO heberges (
                        type, famille_id, nom, prenom, date_naissance, sexe, nationalite,
                        telephone, email, adresse_domiciliation,
                        type_pi1, validite_pi1, type_pi2, validite_pi2,
                        date_entree_france, statut, date_1er_tds, oqtf, suivi_juridique,
                        mesure_protection, etat_matrimonial, assurance_maladie, date_fin_droits, mdph,
                        chambre, ts_referente, date_arrivee,
                        allocations, montant_allocations, autre_ressource, montant_autre,
                        salaire, compte_bancaire, titre_transport, declaration_impots,
                        attestation_linguistique, cir, emploi, suivi_cip, inscription_france_travail,
                        aide_alimentaire, actif
                    ) VALUES (
                        'adulte_famille', ?, ?, ?, ?, ?, ?,
                        ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, 1
                    )
                `, [
                    famille.id,
                    adulte.nom || '',
                    adulte.prenom || '',
                    adulte.dateNaissance || null,
                    adulte.sexe || null,
                    adulte.nationalite || null,
                    adulte.telephone || null,
                    adulte.email || null,
                    adulte.adresseDomiciliation || null,
                    adulte.typePI1 || null,
                    adulte.validitePI1 || null,
                    adulte.typePI2 || null,
                    adulte.validitePI2 || null,
                    adulte.dateEntreeFrance || null,
                    normalizeStatut(adulte.statut),
                    adulte.date1erTDS || null,
                    adulte.oqtf || null,
                    adulte.suiviJuridique || null,
                    adulte.mesureProtection || null,
                    adulte.etatMatrimonial || null,
                    adulte.assuranceMaladie || null,
                    adulte.dateFinDroits || null,
                    adulte.mdph || null,
                    famille.chambre || null,
                    famille.tsReferente || null,
                    famille.dateArrivee || null,
                    adulte.allocations || null,
                    adulte.montantAllocations || null,
                    adulte.autreRessource || null,
                    adulte.montantAutre || null,
                    adulte.salaire || 0,
                    adulte.compteBancaire || null,
                    adulte.titreTransport || null,
                    adulte.declarationImpots || null,
                    adulte.attestationLinguistique || null,
                    adulte.cir || null,
                    adulte.emploi || null,
                    adulte.suiviCIP || null,
                    adulte.inscriptionFranceTravail || null,
                    normalizeAide(famille.aideAlimentaire)
                ]);
                adultesCount++;
            }
        }

        // Importer les enfants
        if (famille.enfants) {
            for (const enfant of famille.enfants) {
                db.run(`
                    INSERT INTO heberges (
                        type, famille_id, nom, prenom, date_naissance, sexe,
                        lieu_naissance, type_pi1, scolarite, ecole,
                        titre_transport, financement_navigo, suivi_medical, dossier_mdph,
                        chambre, ts_referente, date_arrivee, actif
                    ) VALUES (
                        'enfant', ?, ?, ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?, ?, 1
                    )
                `, [
                    famille.id,
                    enfant.nom || '',
                    enfant.prenom || '',
                    enfant.dateNaissance || null,
                    enfant.sexe || null,
                    enfant.lieuNaissance || null,
                    enfant.pieceIdentite || null,
                    enfant.scolarite || null,
                    enfant.ecole || null,
                    enfant.titreTransport || null,
                    enfant.financementNavigo || null,
                    enfant.suiviMedical || null,
                    enfant.dossierMDPH || null,
                    famille.chambre || null,
                    famille.tsReferente || null,
                    famille.dateArrivee || null
                ]);
                enfantsCount++;
            }
        }
    }

    console.log(`Migration: ${famillesCount} familles, ${adultesCount} adultes, ${enfantsCount} enfants importés`);
    return { familles: famillesCount, adultes: adultesCount, enfants: enfantsCount };
}

/**
 * Vérifie si une migration est nécessaire
 */
function needsMigration(db) {
    const count = db.get('SELECT COUNT(*) as count FROM heberges');
    return count.count === 0;
}

/**
 * Exécute la migration complète
 */
function runMigration(db, femmesIsolees, familles) {
    console.log('Début de la migration des données...');

    const femmes = migrateFemmesIsolees(db, femmesIsolees);
    const famillesResult = migrateFamilles(db, familles);

    const total = femmes + famillesResult.adultes + famillesResult.enfants;
    console.log(`Migration terminée: ${total} personnes importées au total`);

    return {
        femmesIsolees: femmes,
        familles: famillesResult.familles,
        adultesFamilles: famillesResult.adultes,
        enfants: famillesResult.enfants,
        total: total
    };
}

/**
 * Réinitialise et relance la migration (pour debug)
 */
async function resetAndMigrate(db, femmesIsolees, familles) {
    // Vider les tables
    db.exec('DELETE FROM mouvements');
    db.exec('DELETE FROM caisse_mensuelle');
    db.exec('DELETE FROM avances_remboursements');
    db.exec('DELETE FROM avances');
    db.exec('DELETE FROM absences');
    db.exec('DELETE FROM cohesia');
    db.exec('DELETE FROM paf');
    db.exec('DELETE FROM heberges');
    db.exec('DELETE FROM familles');

    // Relancer la migration
    return runMigration(db, femmesIsolees, familles);
}
