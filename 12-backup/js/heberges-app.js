/**
 * Module Hébergés - Interface utilisateur
 * Utilise la base de données SQLite via db.js
 */

// État de l'application
let state = {
    currentTab: 'femmes',
    filters: {
        search: '',
        nationalite: 'all',
        statut: 'all',
        ts: 'all'
    },
    darkMode: localStorage.getItem('darkMode') === 'true',
    dbReady: false
};

// Données en cache (chargées depuis la DB)
let dataCache = {
    femmesIsolees: [],
    familles: [],
    enfants: []
};

// ============================================================================
// INITIALISATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    await initApp();
});

async function initApp() {
    try {
        // Afficher loader
        showLoading(true);

        // Initialiser la base de données
        await db.init();

        // Créer le schéma si nécessaire
        const result = await initDatabase(db);

        // Migration automatique si le schéma a été mis à jour ou si la base est vide
        if (result.migrationNeeded || needsMigration(db)) {
            console.log('Migration automatique des données...');
            // Les données sont définies dans le fichier legacy
            if (typeof FEMMES_ISOLEES !== 'undefined' && typeof FAMILLES !== 'undefined') {
                runMigration(db, FEMMES_ISOLEES, FAMILLES);
                await db.save();
                showToast('Données importées avec succès (' + FEMMES_ISOLEES.length + ' femmes, ' + FAMILLES.length + ' familles)');
            }
        }

        if (result.upgraded) {
            showToast('Base de données mise à jour vers la version ' + result.version);
        }

        state.dbReady = true;

        // Mode sombre
        if (state.darkMode) {
            document.body.setAttribute('data-theme', 'dark');
            const icon = document.getElementById('dark-mode-icon');
            if (icon) icon.textContent = '☀️';
        }

        // Charger les données
        await loadData();

        // Calculer et afficher les statistiques
        updateStatistics();

        // Remplir les filtres
        populateFilters();

        // Afficher la liste
        renderList();

        showLoading(false);

    } catch (error) {
        console.error('Erreur initialisation:', error);
        showToast('Erreur lors du chargement');
        showLoading(false);
    }
}

function showLoading(show) {
    let loader = document.getElementById('loader');
    if (!loader && show) {
        loader = document.createElement('div');
        loader.id = 'loader';
        loader.innerHTML = '<div class="loader-spinner"></div><p>Chargement...</p>';
        loader.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.9);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;';
        document.body.appendChild(loader);
    }
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

// ============================================================================
// CHARGEMENT DES DONNÉES
// ============================================================================

async function loadData() {
    // Femmes isolées
    dataCache.femmesIsolees = HebergeModel.getFemmesIsolees();

    // Familles avec leurs membres
    const famillesRaw = FamilleModel.getAll();
    dataCache.familles = famillesRaw.map(f => {
        const membres = HebergeModel.getByFamille(f.id);
        return {
            ...f,
            adultes: membres.filter(m => m.type === 'adulte_famille'),
            enfants: membres.filter(m => m.type === 'enfant')
        };
    });

    // Tous les enfants (pour l'onglet enfants)
    dataCache.enfants = [];
    dataCache.familles.forEach(f => {
        f.enfants.forEach(e => {
            dataCache.enfants.push({
                ...e,
                familleId: f.id,
                chambre: f.chambre,
                familleNom: f.adultes[0]?.nom || 'Inconnu'
            });
        });
    });
}

// ============================================================================
// STATISTIQUES
// ============================================================================

function updateStatistics() {
    const stats = HebergeModel.getStats();

    // Calculer les stats supplémentaires
    let totalAgesAdultes = 0;
    let nbAdultes = 0;
    let nbTravail = 0;
    let nbAME = 0;
    let nbSSP = 0;
    let nbFemmesFamilles = 0;
    let nbHommes = 0;
    let totalAgesEnfants = 0;

    // Stats des femmes isolées
    dataCache.femmesIsolees.forEach(f => {
        const age = calculateAge(f.date_naissance);
        totalAgesAdultes += age;
        nbAdultes++;
        if (f.emploi && f.emploi.includes('Travail')) {
            nbTravail++;
        }
        if (f.assurance_maladie === 'AME') {
            nbAME++;
        }
        if (f.aide_alimentaire === 'SSP') {
            nbSSP++;
        }
    });

    // Stats des familles
    dataCache.familles.forEach(f => {
        f.adultes.forEach(a => {
            const age = calculateAge(a.date_naissance);
            if (a.sexe === 'F') {
                nbFemmesFamilles++;
            } else {
                nbHommes++;
            }
            totalAgesAdultes += age;
            nbAdultes++;
            if (a.salaire > 0) {
                nbTravail++;
            }
            if (a.assurance_maladie === 'AME') {
                nbAME++;
            }
        });

        f.enfants.forEach(e => {
            const age = calculateAge(e.date_naissance);
            totalAgesEnfants += age;
        });

        if (f.aide_alimentaire === 'SSP') {
            nbSSP++;
        }
    });

    const totalFemmes = stats.femmesIsolees + nbFemmesFamilles;
    const totalHeberges = stats.total;
    const ageMoyenEnfants = stats.enfants > 0 ? (totalAgesEnfants / stats.enfants).toFixed(1) : 0;

    // Mettre à jour les éléments du DOM
    updateElement('stat-total', totalHeberges);
    updateElement('stat-femmes', totalFemmes);
    updateElement('stat-isolees', stats.femmesIsolees);
    updateElement('stat-hommes', nbHommes);
    updateElement('stat-enfants', stats.enfants);
    updateElement('stat-travail', nbTravail);
    updateElement('stat-ame', nbAME);
    updateElement('stat-ssp', nbSSP);
    updateElement('stat-logement', Math.round(totalHeberges * 0.08));

    // Âge moyen enfants
    const enfantsStatSub = document.querySelector('.stat-card.stat-children .stat-sub strong');
    if (enfantsStatSub) {
        enfantsStatSub.textContent = ageMoyenEnfants;
    }

    // Compteurs onglets
    updateElement('tab-count-femmes', stats.femmesIsolees);
    updateElement('tab-count-familles', dataCache.familles.length);
    updateElement('tab-count-enfants', stats.enfants);
}

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function calculateAge(dateNaissance) {
    if (!dateNaissance) return 0;
    const today = new Date();
    const birth = new Date(dateNaissance);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// ============================================================================
// FILTRES
// ============================================================================

function populateFilters() {
    // Nationalités
    const nationalites = new Set();
    dataCache.femmesIsolees.forEach(f => {
        if (f.nationalite) nationalites.add(f.nationalite);
    });
    dataCache.familles.forEach(f => {
        f.adultes.forEach(a => {
            if (a.nationalite) nationalites.add(a.nationalite);
        });
    });

    const selectNat = document.getElementById('filter-nationalite');
    if (selectNat) {
        [...nationalites].sort().forEach(nat => {
            const opt = document.createElement('option');
            opt.value = nat;
            opt.textContent = nat;
            selectNat.appendChild(opt);
        });
    }

    // TS Référentes
    const tsSet = new Set();
    dataCache.femmesIsolees.forEach(f => {
        if (f.ts_referente) tsSet.add(f.ts_referente);
    });
    dataCache.familles.forEach(f => {
        if (f.ts_referente) tsSet.add(f.ts_referente);
    });

    const selectTs = document.getElementById('filter-ts');
    if (selectTs) {
        [...tsSet].sort().forEach(ts => {
            const opt = document.createElement('option');
            opt.value = ts;
            opt.textContent = ts;
            selectTs.appendChild(opt);
        });
    }
}

function switchTab(tab) {
    state.currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    renderList();
}

function applyFilters() {
    state.filters.search = (document.getElementById('search')?.value || '').toLowerCase();
    state.filters.nationalite = document.getElementById('filter-nationalite')?.value || 'all';
    state.filters.statut = document.getElementById('filter-statut')?.value || 'all';
    state.filters.ts = document.getElementById('filter-ts')?.value || 'all';
    renderList();
}

// ============================================================================
// RENDU DES LISTES
// ============================================================================

function renderList() {
    const header = document.getElementById('list-header');
    const body = document.getElementById('list-body');

    if (!header || !body) return;

    if (state.currentTab === 'femmes') {
        renderFemmesList(header, body);
    } else if (state.currentTab === 'familles') {
        renderFamillesList(header, body);
    } else {
        renderEnfantsList(header, body);
    }
}

function renderFemmesList(header, body) {
    header.innerHTML = `
        <div>Chambre</div>
        <div>Nom / Prénom</div>
        <div>Nationalité</div>
        <div>Âge</div>
        <div>Statut</div>
        <div>Assurance</div>
        <div>TS Réf.</div>
        <div>Voir</div>
    `;

    let filtered = dataCache.femmesIsolees.filter(f => {
        if (state.filters.search) {
            const searchStr = `${f.nom} ${f.prenom} ${f.chambre}`.toLowerCase();
            if (!searchStr.includes(state.filters.search)) return false;
        }
        if (state.filters.nationalite !== 'all' && f.nationalite !== state.filters.nationalite) return false;
        if (state.filters.statut !== 'all') {
            const statut = (f.statut || '').toLowerCase();
            if (state.filters.statut === 'reguliere' && statut !== 'reguliere') return false;
            if (state.filters.statut === 'irreguliere' && statut !== 'irreguliere') return false;
            if (state.filters.statut === 'demande' && statut !== 'demande en cours') return false;
        }
        if (state.filters.ts !== 'all' && f.ts_referente !== state.filters.ts) return false;
        return true;
    });

    updateElement('tab-count-femmes', filtered.length);

    body.innerHTML = filtered.map(f => {
        const age = calculateAge(f.date_naissance);
        const initials = `${(f.prenom || 'X')[0]}${(f.nom || 'X')[0]}`;
        const statutBadge = getStatutBadge(f.statut);
        const assuranceBadge = getAssuranceBadge(f.assurance_maladie);

        return `
            <div class="list-row" onclick="showFemmeDetail(${f.id})">
                <div>${f.chambre || '-'}</div>
                <div>
                    <span class="avatar avatar-f">${initials}</span>
                    <span><strong>${f.nom}</strong><br>${f.prenom}</span>
                </div>
                <div>${f.nationalite || '-'}</div>
                <div>${age} ans</div>
                <div>${statutBadge}</div>
                <div>${assuranceBadge}</div>
                <div>${f.ts_referente || '-'}</div>
                <div><button class="btn-view">👁️</button></div>
            </div>
        `;
    }).join('');
}

function renderFamillesList(header, body) {
    header.innerHTML = `
        <div>Chambre</div>
        <div>Famille</div>
        <div>Composition</div>
        <div>Enfants</div>
        <div>Nationalité</div>
        <div>Statut</div>
        <div>TS Réf.</div>
        <div>Voir</div>
    `;

    let filtered = dataCache.familles.filter(f => {
        if (state.filters.search) {
            const searchStr = f.adultes.map(a => `${a.nom} ${a.prenom}`).join(' ').toLowerCase() + (f.chambre || '').toLowerCase();
            if (!searchStr.includes(state.filters.search)) return false;
        }
        if (state.filters.nationalite !== 'all') {
            if (!f.adultes.some(a => a.nationalite === state.filters.nationalite)) return false;
        }
        if (state.filters.ts !== 'all' && f.ts_referente !== state.filters.ts) return false;
        return true;
    });

    updateElement('tab-count-familles', filtered.length);

    body.innerHTML = filtered.map(f => {
        const mainAdult = f.adultes[0] || { nom: 'Inconnu', prenom: '', statut: null };
        const initials = `${(mainAdult.prenom || 'X')[0]}${(mainAdult.nom || 'X')[0]}`;
        const statutBadge = getStatutBadge(mainAdult.statut);

        return `
            <div class="list-row" onclick="showFamilleDetail(${f.id})">
                <div>${f.chambre || '-'}</div>
                <div>
                    <span class="avatar avatar-f">${initials}</span>
                    <span><strong>${mainAdult.nom}</strong><br>${mainAdult.prenom}</span>
                </div>
                <div>${f.composition || '-'}</div>
                <div>${f.enfants.length}</div>
                <div>${mainAdult.nationalite || '-'}</div>
                <div>${statutBadge}</div>
                <div>${f.ts_referente || '-'}</div>
                <div><button class="btn-view">👁️</button></div>
            </div>
        `;
    }).join('');
}

function renderEnfantsList(header, body) {
    header.innerHTML = `
        <div>Famille</div>
        <div>Nom / Prénom</div>
        <div>Sexe</div>
        <div>Âge</div>
        <div>Scolarité</div>
        <div>Lieu naiss.</div>
        <div>Chambre</div>
        <div>Voir</div>
    `;

    let filtered = dataCache.enfants.filter(e => {
        if (state.filters.search) {
            const searchStr = `${e.nom} ${e.prenom}`.toLowerCase();
            if (!searchStr.includes(state.filters.search)) return false;
        }
        return true;
    });

    updateElement('tab-count-enfants', filtered.length);

    body.innerHTML = filtered.map(e => {
        const age = calculateAge(e.date_naissance);
        const initials = `${(e.prenom || 'X')[0]}${(e.nom || 'X')[0]}`;
        const avatarClass = e.sexe === 'M' ? 'avatar-m' : 'avatar-f';

        return `
            <div class="list-row" onclick="showFamilleDetail(${e.familleId})">
                <div>${e.familleNom || '-'}</div>
                <div>
                    <span class="avatar ${avatarClass}">${initials}</span>
                    <span><strong>${e.nom}</strong><br>${e.prenom}</span>
                </div>
                <div>${e.sexe === 'M' ? '👦' : '👧'}</div>
                <div>${age} ans</div>
                <div>${e.scolarite || '-'}</div>
                <div>${(e.lieu_naissance || '').split(',')[0] || '-'}</div>
                <div>${e.chambre || '-'}</div>
                <div><button class="btn-view">👁️</button></div>
            </div>
        `;
    }).join('');
}

// ============================================================================
// BADGES
// ============================================================================

function getStatutBadge(statut) {
    if (!statut) return '-';
    const s = statut.toLowerCase();
    if (s === 'reguliere') {
        return '<span class="badge badge-reguliere">Régulière</span>';
    }
    if (s === 'irreguliere') {
        return '<span class="badge badge-irreguliere">Irrégulière</span>';
    }
    if (s.includes('demande')) {
        return '<span class="badge badge-demande">En cours</span>';
    }
    return statut;
}

function getAssuranceBadge(assurance) {
    if (!assurance) return '-';
    if (assurance === 'AME') {
        return '<span class="badge badge-ame">AME</span>';
    }
    if (assurance.includes('CSS')) {
        return '<span class="badge badge-css">CSS</span>';
    }
    return assurance;
}

// ============================================================================
// MODALES DE DÉTAIL
// ============================================================================

function showFemmeDetail(id) {
    const f = dataCache.femmesIsolees.find(x => x.id === id);
    if (!f) return;

    const age = calculateAge(f.date_naissance);
    const initials = `${(f.prenom || 'X')[0]}${(f.nom || 'X')[0]}`;
    const content = document.getElementById('detail-content');

    content.innerHTML = `
        <div class="detail-header">
            <div class="detail-avatar avatar-f">${initials}</div>
            <div class="detail-info">
                <h2>${f.prenom} ${f.nom}</h2>
                <p>Chambre ${f.chambre || '-'} - TS Référente: ${f.ts_referente || '-'}</p>
            </div>
            <button class="btn-attestation" onclick="genererAttestationFemme(${f.id})" title="Générer attestation de domiciliation">
                📄 Attestation
            </button>
        </div>

        <div class="detail-sections">
            <div class="detail-section">
                <h3>👤 État civil</h3>
                <div class="detail-row">
                    <span class="label">Date de naissance</span>
                    <span class="value">${formatDate(f.date_naissance)} (${age} ans)</span>
                </div>
                <div class="detail-row">
                    <span class="label">Nationalité</span>
                    <span class="value">${f.nationalite || '-'}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Téléphone</span>
                    <span class="value">${f.telephone || '-'}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Email</span>
                    <span class="value">${f.email || '-'}</span>
                </div>
            </div>

            <div class="detail-section">
                <h3>📋 Situation administrative</h3>
                <div class="detail-row">
                    <span class="label">Statut</span>
                    <span class="value">${getStatutBadge(f.statut)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Assurance maladie</span>
                    <span class="value">${getAssuranceBadge(f.assurance_maladie)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Date d'arrivée CHU</span>
                    <span class="value">${formatDate(f.date_arrivee)}</span>
                </div>
            </div>

            <div class="detail-section">
                <h3>💰 Ressources</h3>
                <div class="detail-row">
                    <span class="label">Aide alimentaire</span>
                    <span class="value">${f.aide_alimentaire || 'Non'}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Emploi</span>
                    <span class="value">${f.emploi || '-'}</span>
                </div>
                ${f.salaire ? `
                <div class="detail-row">
                    <span class="label">Salaire</span>
                    <span class="value">${f.salaire}€</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Compte bancaire</span>
                    <span class="value">${f.compte_bancaire || 'Non'}</span>
                </div>
            </div>
        </div>
    `;

    document.getElementById('detail-modal').classList.add('active');
}

function showFamilleDetail(id) {
    const f = dataCache.familles.find(x => x.id === id);
    if (!f) return;

    const mainAdult = f.adultes[0] || { nom: 'Inconnu', prenom: '' };
    const initials = `${(mainAdult.prenom || 'X')[0]}${(mainAdult.nom || 'X')[0]}`;
    const content = document.getElementById('detail-content');

    content.innerHTML = `
        <div class="detail-header">
            <div class="detail-avatar avatar-f">${initials}</div>
            <div class="detail-info">
                <h2>Famille ${mainAdult.nom}</h2>
                <p>Chambre ${f.chambre || '-'} - ${f.composition || ''} - TS Référente: ${f.ts_referente || '-'}</p>
            </div>
            <button class="btn-attestation" onclick="genererAttestationFamilleById(${f.id})" title="Générer attestation de domiciliation">
                📄 Attestation
            </button>
        </div>

        <div class="detail-sections">
            <div class="detail-section">
                <h3>👥 Adultes (${f.adultes.length})</h3>
                ${f.adultes.map(a => {
                    const age = calculateAge(a.date_naissance);
                    return `
                    <div class="detail-row">
                        <span class="label">${a.sexe === 'M' ? '👨' : '👩'} ${a.prenom} ${a.nom}</span>
                        <span class="value">${age} ans - ${a.nationalite || '-'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Statut</span>
                        <span class="value">${getStatutBadge(a.statut)}</span>
                    </div>
                    ${a.salaire ? `
                    <div class="detail-row">
                        <span class="label">Salaire</span>
                        <span class="value">${a.salaire}€</span>
                    </div>
                    ` : ''}
                `;}).join('')}
            </div>

            <div class="detail-section">
                <h3>👶 Enfants (${f.enfants.length})</h3>
                <div class="enfants-list">
                    ${f.enfants.map(e => {
                        const age = calculateAge(e.date_naissance);
                        return `
                        <div class="enfant-item">
                            <div class="enfant-avatar">${e.sexe === 'M' ? '👦' : '👧'}</div>
                            <div class="enfant-info">
                                <div class="name">${e.prenom} ${e.nom}</div>
                                <div class="details">${age} ans - ${e.scolarite || 'Non scolarisé'}</div>
                            </div>
                        </div>
                    `;}).join('')}
                </div>
            </div>

            <div class="detail-section">
                <h3>📋 Hébergement</h3>
                <div class="detail-row">
                    <span class="label">Date d'arrivée</span>
                    <span class="value">${formatDate(f.date_arrivee)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Aide alimentaire</span>
                    <span class="value">${f.aide_alimentaire || 'Non'}</span>
                </div>
            </div>
        </div>
    `;

    document.getElementById('detail-modal').classList.add('active');
}

function closeDetailModal() {
    document.getElementById('detail-modal').classList.remove('active');
}

// ============================================================================
// UTILITAIRES
// ============================================================================

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.body.setAttribute('data-theme', state.darkMode ? 'dark' : '');
    const icon = document.getElementById('dark-mode-icon');
    if (icon) icon.textContent = state.darkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', state.darkMode);
}

function exportData() {
    let csv = 'Nom,Prénom,Chambre,Nationalité,Âge,Statut,TS Référente\n';

    dataCache.femmesIsolees.forEach(f => {
        const age = calculateAge(f.date_naissance);
        csv += `"${f.nom}","${f.prenom}","${f.chambre}","${f.nationalite}",${age},"${f.statut}","${f.ts_referente}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'heberges-babinski.csv';
    link.click();

    showToast('Export effectué');
}

function exportDatabase() {
    db.exportAsFile('chu-babinski-backup.sqlite');
    showToast('Base de données exportée');
}

async function importDatabase() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sqlite,.db';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await db.importFromFile(file);
            await loadData();
            updateStatistics();
            renderList();
            showToast('Base de données importée');
        }
    };
    input.click();
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

// Fermer modal avec Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDetailModal();
    }
});

// Fermer modal en cliquant à l'extérieur
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ============================================================================
// GÉNÉRATION D'ATTESTATIONS
// ============================================================================

/**
 * Génère une attestation pour une femme isolée
 */
async function genererAttestationFemme(id) {
    const femme = dataCache.femmesIsolees.find(f => f.id === id);
    if (!femme) {
        showToast('Hébergée non trouvée');
        return;
    }

    // Adapter les noms de champs pour l'attestation
    const personne = {
        nom: femme.nom,
        prenom: femme.prenom,
        dateNaissance: femme.date_naissance,
        lieuNaissance: femme.lieu_naissance,
        dateArrivee: femme.date_arrivee
    };

    await genererAttestation(personne, 'femme_isolee');
}

/**
 * Génère une attestation pour une famille
 */
async function genererAttestationFamilleById(id) {
    const famille = dataCache.familles.find(f => f.id === id);
    if (!famille) {
        showToast('Famille non trouvée');
        return;
    }

    // Adapter les données de la famille
    const familleData = {
        dateArrivee: famille.date_arrivee,
        composition: famille.composition
    };

    // Adapter les adultes
    const adultes = famille.adultes.map(a => ({
        nom: a.nom,
        prenom: a.prenom,
        sexe: a.sexe,
        dateNaissance: a.date_naissance,
        lieuNaissance: a.lieu_naissance
    }));

    // Adapter les enfants
    const enfants = famille.enfants.map(e => ({
        nom: e.nom,
        prenom: e.prenom,
        sexe: e.sexe,
        dateNaissance: e.date_naissance,
        lieuNaissance: e.lieu_naissance
    }));

    await genererAttestation(null, 'famille', familleData, adultes, enfants);
}
