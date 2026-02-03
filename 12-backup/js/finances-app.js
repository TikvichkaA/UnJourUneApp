/**
 * Module Finances - CHU Babinski
 * Gestion PAF, Cohésia, Absences, Avances, Caisse
 */

// État de l'application
let state = {
    currentTab: 'paf',
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    darkMode: localStorage.getItem('darkMode') === 'true'
};

const MOIS_NOMS = [
    '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// ============================================================================
// INITIALISATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    await initApp();
});

async function initApp() {
    try {
        // Initialiser la base de données
        await db.init();
        const result = await initDatabase(db);

        // Migration automatique si le schéma a été mis à jour ou si la base est vide
        if (result.migrationNeeded || (typeof needsMigration === 'function' && needsMigration(db))) {
            if (typeof FEMMES_ISOLEES !== 'undefined' && typeof FAMILLES !== 'undefined') {
                console.log('Migration automatique des données...');
                runMigration(db, FEMMES_ISOLEES, FAMILLES);
                await db.save();
                showToast('Données importées (' + FEMMES_ISOLEES.length + ' femmes, ' + FAMILLES.length + ' familles)');
            }
        }

        if (result.upgraded) {
            showToast('Base de données mise à jour vers la version ' + result.version);
        }

        // Mode sombre
        if (state.darkMode) {
            document.body.setAttribute('data-theme', 'dark');
            document.getElementById('dark-mode-icon').textContent = '☀️';
        }

        // Afficher le mois courant
        updateMonthDisplay();

        // Charger les données
        await loadDashboard();
        await loadTabContent();

    } catch (error) {
        console.error('Erreur initialisation:', error);
        showToast('Erreur lors du chargement');
    }
}

// ============================================================================
// NAVIGATION MENSUELLE
// ============================================================================

function updateMonthDisplay() {
    document.getElementById('current-month').textContent =
        `${MOIS_NOMS[state.currentMonth]} ${state.currentYear}`;
}

function previousMonth() {
    state.currentMonth--;
    if (state.currentMonth < 1) {
        state.currentMonth = 12;
        state.currentYear--;
    }
    updateMonthDisplay();
    loadDashboard();
    loadTabContent();
}

function nextMonth() {
    state.currentMonth++;
    if (state.currentMonth > 12) {
        state.currentMonth = 1;
        state.currentYear++;
    }
    updateMonthDisplay();
    loadDashboard();
    loadTabContent();
}

// ============================================================================
// DASHBOARD CAISSE
// ============================================================================

async function loadDashboard() {
    const caisse = CaisseModel.getOrCreateMois(state.currentYear, state.currentMonth);
    CaisseModel.recalculer(state.currentYear, state.currentMonth);
    const updated = CaisseModel.getOrCreateMois(state.currentYear, state.currentMonth);

    document.getElementById('solde-caisse').textContent = `${updated.solde_final.toFixed(2)} €`;
    document.getElementById('total-entrees').textContent = `${updated.total_entrees.toFixed(2)} €`;
    document.getElementById('total-sorties').textContent = `${updated.total_sorties.toFixed(2)} €`;

    // Compter les bénéficiaires du mois
    const pafCount = PAFModel.getRecapMensuel(state.currentYear, state.currentMonth)
        .filter(p => p.montant_theorique > 0).length;
    document.getElementById('nb-beneficiaires').textContent = pafCount;
}

// ============================================================================
// TABS
// ============================================================================

function switchTab(tab) {
    state.currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    loadTabContent();
}

async function loadTabContent() {
    const content = document.getElementById('tab-content');

    switch (state.currentTab) {
        case 'paf':
            renderPAFTab(content);
            break;
        case 'absences':
            renderAbsencesTab(content);
            break;
        case 'avances':
            renderAvancesTab(content);
            break;
        case 'mouvements':
            renderMouvementsTab(content);
            break;
    }
}

// ============================================================================
// TAB AIDES - Liste simple avec cases à cocher
// ============================================================================

function renderPAFTab(container) {
    // Récupérer le calcul mensuel avec statut de distribution
    const data = CohesiaModel.getRecapMensuel(state.currentYear, state.currentMonth);

    // Séparer femmes isolées et familles
    const femmesIsolees = data.filter(d => d.type === 'femme_isolee');
    const familles = data.filter(d => d.type === 'famille');

    // Calculer les totaux
    const totalADistribuer = data.reduce((sum, d) => sum + d.sommeADistribuer, 0);
    const totalDistribue = data.filter(d => d.distribue).reduce((sum, d) => sum + d.sommeADistribuer, 0);
    const nbDistribues = data.filter(d => d.distribue).length;

    document.getElementById('tab-count-paf').textContent = data.length;

    container.innerHTML = `
        <div class="actions-bar">
            <div>
                <h2>Aides Mensuelles</h2>
                <p style="color: var(--text-light); font-size: 0.875rem;">
                    Cochez les aides versées ce mois-ci
                </p>
            </div>
            <button class="btn btn-outline" onclick="exportAides()">📥 Exporter</button>
        </div>

        <div class="summary-cards">
            <div class="summary-card">
                <div class="value">${data.length}</div>
                <div class="label">Ménages</div>
            </div>
            <div class="summary-card">
                <div class="value">${totalADistribuer.toFixed(2)} €</div>
                <div class="label">Total à verser</div>
            </div>
            <div class="summary-card">
                <div class="value">${totalDistribue.toFixed(2)} €</div>
                <div class="label">Déjà versé</div>
            </div>
            <div class="summary-card">
                <div class="value">${nbDistribues} / ${data.length}</div>
                <div class="label">Versements faits</div>
            </div>
        </div>

        ${data.length === 0 ? `
            <div class="empty-state">
                <div class="icon">💰</div>
                <p>Aucun bénéficiaire ce mois-ci</p>
            </div>
        ` : `
            <div class="aide-list">
                <h3 style="margin: 1rem 0 0.75rem;">👩 Femmes isolées (${femmesIsolees.length})</h3>
                ${renderAideList(femmesIsolees)}

                <h3 style="margin: 1.5rem 0 0.75rem;">👨‍👩‍👧 Familles (${familles.length})</h3>
                ${renderAideList(familles)}
            </div>
        `}
    `;
}

function renderAideList(data) {
    if (data.length === 0) {
        return '<p style="color: var(--text-light); padding: 0.5rem 0;">Aucun bénéficiaire</p>';
    }

    return `
        <div class="aide-items">
            ${data.map(d => `
                <div class="aide-item ${d.distribue ? 'aide-done' : ''}">
                    <label class="aide-checkbox">
                        <input type="checkbox"
                               ${d.distribue ? 'checked' : ''}
                               onchange="toggleAide(${d.id || 'null'}, ${d.familleId || 'null'}, ${d.sommeADistribuer}, this.checked)">
                        <span class="checkmark"></span>
                    </label>
                    <div class="aide-info">
                        <div class="aide-name">
                            <strong>${d.nom}</strong> ${d.prenom || ''}
                            ${d.composition > 1 ? `<span class="aide-comp">${d.composition} pers.</span>` : ''}
                        </div>
                        <div class="aide-details">
                            Chambre ${d.chambre || '?'}
                            ${d.ressources > 0 ? `• Ressources: ${d.ressources.toFixed(0)}€` : ''}
                        </div>
                    </div>
                    <div class="aide-amount ${d.distribue ? 'done' : ''}">
                        ${d.sommeADistribuer.toFixed(2)} €
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="aide-total">
            Total: <strong>${data.reduce((s, d) => s + d.sommeADistribuer, 0).toFixed(2)} €</strong>
            <span class="aide-total-done">(versé: ${data.filter(d => d.distribue).reduce((s, d) => s + d.sommeADistribuer, 0).toFixed(2)} €)</span>
        </div>
    `;
}

function toggleAide(hebergeId, familleId, montant, checked) {
    const date = new Date().toISOString().split('T')[0];

    if (checked) {
        // Marquer comme versé
        CohesiaModel.enregistrerDistribution(hebergeId, familleId, state.currentYear, state.currentMonth, montant, date);
        showToast('Aide versée : ' + montant.toFixed(2) + ' €');
    } else {
        // Annuler le versement
        CohesiaModel.annulerDistribution(hebergeId, familleId, state.currentYear, state.currentMonth);
        showToast('Versement annulé');
    }

    loadDashboard();
    loadTabContent();
}

function exportAides() {
    const data = CohesiaModel.getRecapMensuel(state.currentYear, state.currentMonth);
    let csv = 'Type,Nom,Prénom,Chambre,Composition,Ressources,Montant,Versé\n';

    data.forEach(d => {
        csv += `"${d.type === 'femme_isolee' ? 'Femme isolée' : 'Famille'}","${d.nom}","${d.prenom || ''}","${d.chambre || ''}",${d.composition},${d.ressources},${d.sommeADistribuer},"${d.distribue ? 'Oui' : 'Non'}"\n`;
    });

    downloadCSV(csv, `aides-${state.currentYear}-${state.currentMonth}.csv`);
}

// ============================================================================
// TAB ABSENCES
// ============================================================================

function renderAbsencesTab(container) {
    const absences = AbsenceModel.getAbsencesMois(state.currentYear, state.currentMonth);

    document.getElementById('tab-count-absences').textContent = absences.length;

    container.innerHTML = `
        <div class="actions-bar">
            <div>
                <h2>Absences</h2>
                <p style="color: var(--text-light); font-size: 0.875rem;">
                    Suivi des absences impactant les aides
                </p>
            </div>
            <button class="btn btn-primary" onclick="showAddAbsenceForm()">+ Nouvelle absence</button>
        </div>

        ${absences.length === 0 ? `
            <div class="empty-state">
                <div class="icon">📅</div>
                <p>Aucune absence enregistrée ce mois-ci</p>
            </div>
        ` : `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Chambre</th>
                        <th>Début</th>
                        <th>Fin</th>
                        <th>Raison</th>
                        <th>Impact aide</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${absences.map(a => `
                        <tr>
                            <td><strong>${a.nom}</strong> ${a.prenom}</td>
                            <td>${a.chambre || '-'}</td>
                            <td>${formatDate(a.date_debut)}</td>
                            <td>${a.date_fin ? formatDate(a.date_fin) : 'En cours'}</td>
                            <td>${a.raison || '-'}</td>
                            <td>${a.impact_aide ? '<span class="badge badge-danger">Oui</span>' : '<span class="badge badge-info">Non</span>'}</td>
                            <td>
                                <button class="btn-action" onclick="deleteAbsence(${a.id})" title="Supprimer">🗑️</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `}
    `;
}

function showAddAbsenceForm() {
    const heberges = HebergeModel.getAll();

    document.getElementById('form-body').innerHTML = `
        <h2>Ajouter une absence</h2>

        <div class="form-group">
            <label>Hébergé</label>
            <select id="absence-heberge" required>
                <option value="">Sélectionner...</option>
                ${heberges.map(h => `
                    <option value="${h.id}">${h.nom} ${h.prenom} (${h.chambre || 'N/A'})</option>
                `).join('')}
            </select>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Date début</label>
                <input type="date" id="absence-debut" required>
            </div>
            <div class="form-group">
                <label>Date fin (optionnel)</label>
                <input type="date" id="absence-fin">
            </div>
        </div>

        <div class="form-group">
            <label>Raison</label>
            <input type="text" id="absence-raison" placeholder="Ex: Vacances, Hospitalisation...">
        </div>

        <div class="form-group">
            <label>
                <input type="checkbox" id="absence-impact" checked>
                Impact sur le calcul des aides
            </label>
        </div>

        <div class="form-actions">
            <button class="btn btn-outline" onclick="closeFormModal()">Annuler</button>
            <button class="btn btn-success" onclick="saveAbsence()">Enregistrer</button>
        </div>
    `;

    document.getElementById('form-modal').classList.add('active');
}

function saveAbsence() {
    const hebergeId = document.getElementById('absence-heberge').value;
    const debut = document.getElementById('absence-debut').value;
    const fin = document.getElementById('absence-fin').value || null;
    const raison = document.getElementById('absence-raison').value;
    const impact = document.getElementById('absence-impact').checked;

    if (!hebergeId || !debut) {
        showToast('Veuillez remplir les champs obligatoires');
        return;
    }

    AbsenceModel.ajouter(hebergeId, debut, fin, raison, impact);
    closeFormModal();
    loadTabContent();
    showToast('Absence enregistrée');
}

function deleteAbsence(id) {
    if (confirm('Supprimer cette absence ?')) {
        AbsenceModel.supprimer(id);
        loadTabContent();
        showToast('Absence supprimée');
    }
}

// ============================================================================
// TAB AVANCES
// ============================================================================

function renderAvancesTab(container) {
    const avances = AvanceModel.getEnCours();

    document.getElementById('tab-count-avances').textContent = avances.length;

    const totalEnCours = avances.reduce((sum, a) => sum + (a.montant_heberge - getTotalRembourse(a.id)), 0);

    container.innerHTML = `
        <div class="actions-bar">
            <div>
                <h2>Avances et Prêts</h2>
                <p style="color: var(--text-light); font-size: 0.875rem;">
                    Gestion des avances accordées aux hébergés
                </p>
            </div>
            <button class="btn btn-primary" onclick="showAddAvanceForm()">+ Nouvelle avance</button>
        </div>

        <div class="summary-cards">
            <div class="summary-card">
                <div class="value">${avances.length}</div>
                <div class="label">Avances en cours</div>
            </div>
            <div class="summary-card">
                <div class="value">${totalEnCours.toFixed(2)} €</div>
                <div class="label">Reste à rembourser</div>
            </div>
        </div>

        ${avances.length === 0 ? `
            <div class="empty-state">
                <div class="icon">💳</div>
                <p>Aucune avance en cours</p>
            </div>
        ` : `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Bénéficiaire</th>
                        <th>Objet</th>
                        <th>Montant total</th>
                        <th>Part CHU</th>
                        <th>À rembourser</th>
                        <th>Remboursé</th>
                        <th>Mensualités</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${avances.map(a => {
                        const rembourse = getTotalRembourse(a.id);
                        const reste = a.montant_heberge - rembourse;
                        return `
                            <tr>
                                <td><strong>${a.nom}</strong> ${a.prenom}</td>
                                <td>${a.objet}</td>
                                <td class="amount">${a.montant_total.toFixed(2)} €</td>
                                <td class="amount">${a.montant_chu.toFixed(2)} €</td>
                                <td class="amount">${a.montant_heberge.toFixed(2)} €</td>
                                <td class="amount positive">${rembourse.toFixed(2)} €</td>
                                <td>${a.nb_mensualites}</td>
                                <td>
                                    <button class="btn-action" onclick="showAvanceDetail(${a.id})" title="Détails">👁️</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `}
    `;
}

function getTotalRembourse(avanceId) {
    const result = db.get(`
        SELECT COALESCE(SUM(montant_paye), 0) as total
        FROM avances_remboursements WHERE avance_id = ?
    `, [avanceId]);
    return result?.total || 0;
}

function showAddAvanceForm() {
    const heberges = HebergeModel.getAll().filter(h => h.type !== 'enfant');

    document.getElementById('form-body').innerHTML = `
        <h2>Nouvelle avance</h2>

        <div class="form-group">
            <label>Bénéficiaire</label>
            <select id="avance-heberge" required>
                <option value="">Sélectionner...</option>
                ${heberges.map(h => `
                    <option value="${h.id}">${h.nom} ${h.prenom}</option>
                `).join('')}
            </select>
        </div>

        <div class="form-group">
            <label>Objet de l'avance</label>
            <input type="text" id="avance-objet" placeholder="Ex: Achat lunettes, Frais médicaux..." required>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Montant total (€)</label>
                <input type="number" id="avance-montant" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Contribution CHU (%)</label>
                <input type="number" id="avance-chu" value="50" min="0" max="100">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Nombre de mensualités</label>
                <input type="number" id="avance-mensualites" value="3" min="1" max="12">
            </div>
            <div class="form-group">
                <label>Date d'accord</label>
                <input type="date" id="avance-date" value="${new Date().toISOString().split('T')[0]}" required>
            </div>
        </div>

        <div class="form-actions">
            <button class="btn btn-outline" onclick="closeFormModal()">Annuler</button>
            <button class="btn btn-success" onclick="saveAvance()">Enregistrer</button>
        </div>
    `;

    document.getElementById('form-modal').classList.add('active');
}

function saveAvance() {
    const hebergeId = document.getElementById('avance-heberge').value;
    const objet = document.getElementById('avance-objet').value;
    const montant = parseFloat(document.getElementById('avance-montant').value);
    const chuPct = parseFloat(document.getElementById('avance-chu').value);
    const mensualites = parseInt(document.getElementById('avance-mensualites').value);
    const date = document.getElementById('avance-date').value;

    if (!hebergeId || !objet || !montant || !date) {
        showToast('Veuillez remplir tous les champs obligatoires');
        return;
    }

    AvanceModel.creer(hebergeId, objet, montant, chuPct, mensualites, date);
    closeFormModal();
    loadTabContent();
    showToast('Avance créée avec échéancier');
}

function showAvanceDetail(avanceId) {
    const avance = db.get('SELECT * FROM avances WHERE id = ?', [avanceId]);
    const heberge = HebergeModel.getById(avance.heberge_id);
    const echeancier = AvanceModel.getEcheancier(avanceId);

    document.getElementById('modal-body').innerHTML = `
        <h2>Détail de l'avance</h2>
        <p style="margin-bottom: 1rem;"><strong>${heberge.prenom} ${heberge.nom}</strong> - ${avance.objet}</p>

        <div class="summary-cards" style="margin-bottom: 1rem;">
            <div class="summary-card">
                <div class="value">${avance.montant_total.toFixed(2)} €</div>
                <div class="label">Total</div>
            </div>
            <div class="summary-card">
                <div class="value">${avance.montant_chu.toFixed(2)} €</div>
                <div class="label">Part CHU</div>
            </div>
            <div class="summary-card">
                <div class="value">${avance.montant_heberge.toFixed(2)} €</div>
                <div class="label">À rembourser</div>
            </div>
        </div>

        <h3 style="margin-bottom: 0.5rem;">Échéancier</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Mois</th>
                    <th>Montant dû</th>
                    <th>Payé</th>
                    <th>Statut</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${echeancier.map(e => `
                    <tr>
                        <td>${MOIS_NOMS[e.mois]} ${e.annee}</td>
                        <td class="amount">${e.montant_du.toFixed(2)} €</td>
                        <td class="amount positive">${e.montant_paye.toFixed(2)} €</td>
                        <td>${getRemboursementBadge(e.statut)}</td>
                        <td>
                            ${e.statut !== 'paye' ? `
                                <button class="btn-action" onclick="enregistrerRemboursement(${e.id}, ${e.montant_du - e.montant_paye})">💵</button>
                            ` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('detail-modal').classList.add('active');
}

function getRemboursementBadge(statut) {
    if (statut === 'paye') return '<span class="badge badge-success">Payé</span>';
    if (statut === 'partiel') return '<span class="badge badge-warning">Partiel</span>';
    return '<span class="badge badge-danger">En attente</span>';
}

function enregistrerRemboursement(remboursementId, montantRestant) {
    const montant = prompt(`Montant remboursé (reste: ${montantRestant.toFixed(2)}€)`, montantRestant.toFixed(2));
    if (montant === null) return;

    const date = new Date().toISOString().split('T')[0];
    AvanceModel.enregistrerRemboursement(remboursementId, parseFloat(montant), date);

    closeModal();
    loadTabContent();
    showToast('Remboursement enregistré');
}

// ============================================================================
// TAB MOUVEMENTS
// ============================================================================

function renderMouvementsTab(container) {
    const mouvements = MouvementModel.getMois(state.currentYear, state.currentMonth);

    container.innerHTML = `
        <div class="actions-bar">
            <div>
                <h2>Mouvements de caisse</h2>
                <p style="color: var(--text-light); font-size: 0.875rem;">
                    Historique des transactions du mois
                </p>
            </div>
            <button class="btn btn-outline" onclick="exportMouvements()">📥 Exporter</button>
        </div>

        ${mouvements.length === 0 ? `
            <div class="empty-state">
                <div class="icon">📋</div>
                <p>Aucun mouvement ce mois-ci</p>
            </div>
        ` : `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Bénéficiaire</th>
                        <th>Description</th>
                        <th>Montant</th>
                    </tr>
                </thead>
                <tbody>
                    ${mouvements.map(m => `
                        <tr>
                            <td>${formatDate(m.date_mouvement)}</td>
                            <td><span class="badge ${m.sens === 'entree' ? 'badge-success' : 'badge-danger'}">${m.type}</span></td>
                            <td>${m.nom ? `${m.nom} ${m.prenom}` : '-'}</td>
                            <td>${m.description || '-'}</td>
                            <td class="amount ${m.sens === 'entree' ? 'positive' : 'negative'}">
                                ${m.sens === 'entree' ? '+' : '-'}${m.montant.toFixed(2)} €
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `}
    `;
}

// ============================================================================
// EXPORTS
// ============================================================================

function exportMouvements() {
    const mouvements = MouvementModel.getMois(state.currentYear, state.currentMonth);
    let csv = 'Date,Type,Sens,Bénéficiaire,Montant,Description\n';

    mouvements.forEach(m => {
        csv += `"${m.date_mouvement}","${m.type}","${m.sens}","${m.nom || ''} ${m.prenom || ''}",${m.montant},"${m.description || ''}"\n`;
    });

    downloadCSV(csv, `mouvements-${state.currentYear}-${state.currentMonth}.csv`);
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    showToast('Export effectué');
}

// ============================================================================
// UTILITAIRES
// ============================================================================

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR');
}

function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.body.setAttribute('data-theme', state.darkMode ? 'dark' : '');
    document.getElementById('dark-mode-icon').textContent = state.darkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', state.darkMode);
}

function closeModal() {
    document.getElementById('detail-modal').classList.remove('active');
}

function closeFormModal() {
    document.getElementById('form-modal').classList.remove('active');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Événements clavier
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeFormModal();
    }
});

// Fermer modals en cliquant à l'extérieur
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
