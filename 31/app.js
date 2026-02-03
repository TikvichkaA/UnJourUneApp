class HomeHelper {
    constructor() {
        this.currentView = 'accueil';
        this.mesPlantes = [];
        this.mesIngredients = [];
        this.selectedCataloguePlante = null;
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.renderAll();
        this.updateDate();
        this.checkNotificationPermission();
        this.registerServiceWorker();
    }

    // === DATA MANAGEMENT ===
    loadData() {
        const plantesData = localStorage.getItem('homehelper_plantes');
        const ingredientsData = localStorage.getItem('homehelper_ingredients');

        this.mesPlantes = plantesData ? JSON.parse(plantesData) : [];
        this.mesIngredients = ingredientsData ? JSON.parse(ingredientsData) : [];
    }

    saveData() {
        localStorage.setItem('homehelper_plantes', JSON.stringify(this.mesPlantes));
        localStorage.setItem('homehelper_ingredients', JSON.stringify(this.mesIngredients));
    }

    // === NAVIGATION ===
    bindEvents() {
        // Navigation principale
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.showView(view);
            });
        });

        // Fermeture des modales
        document.querySelectorAll('.btn-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.currentTarget.dataset.close;
                this.closeModal(modalId);
            });
        });

        // Clic à l'extérieur de la modale
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });

        // Bouton ajout plante
        document.getElementById('btnAddPlante').addEventListener('click', () => {
            this.openModalPlante();
        });

        // Bouton confirmer ajout plante
        document.getElementById('btnConfirmAddPlante').addEventListener('click', () => {
            this.confirmAddPlante();
        });

        // Bouton ajout ingrédient
        document.getElementById('btnAddIngredient').addEventListener('click', () => {
            this.openModalIngredient();
        });

        // Bouton confirmer ajout ingrédient
        document.getElementById('btnConfirmAddIngredient').addEventListener('click', () => {
            this.confirmAddIngredient();
        });

        // Tabs frigo
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Notifications
        document.getElementById('btnEnableNotif')?.addEventListener('click', () => {
            this.requestNotificationPermission();
        });

        document.getElementById('btnDismissNotif')?.addEventListener('click', () => {
            document.getElementById('notifBanner').classList.add('hidden');
            localStorage.setItem('homehelper_notif_dismissed', 'true');
        });
    }

    showView(viewName) {
        // Update nav
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewName);
        });

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(viewName + 'View').classList.add('active');

        // Update title
        const titles = {
            accueil: '🏠 HomeHelper',
            plantes: '🌱 Mes Plantes',
            frigo: '🍽️ Mon Frigo'
        };
        document.getElementById('pageTitle').textContent = titles[viewName] || '🏠 HomeHelper';

        this.currentView = viewName;

        // Refresh view data
        if (viewName === 'accueil') this.renderDashboard();
        if (viewName === 'plantes') this.renderPlantes();
        if (viewName === 'frigo') this.renderFrigo();
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tabName);
        });
        document.getElementById('tabInventaire').classList.toggle('active', tabName === 'inventaire');
        document.getElementById('tabRecettes').classList.toggle('active', tabName === 'recettes');

        if (tabName === 'recettes') {
            this.renderRecettes();
        }
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    // === PLANTES ===
    openModalPlante() {
        this.renderCataloguePlantes();
        this.openModal('modalPlante');
    }

    renderCataloguePlantes() {
        const container = document.getElementById('cataloguePlantes');
        container.innerHTML = CATALOGUE_PLANTES.map(p => `
            <div class="catalogue-item" data-plante-id="${p.id}">
                <span class="emoji">${p.emoji}</span>
                <span class="name">${p.nom}</span>
            </div>
        `).join('');

        container.querySelectorAll('.catalogue-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const planteId = e.currentTarget.dataset.planteId;
                this.selectCataloguePlante(planteId);
            });
        });
    }

    selectCataloguePlante(planteId) {
        const plante = CATALOGUE_PLANTES.find(p => p.id === planteId);
        if (!plante) return;

        this.selectedCataloguePlante = plante;

        document.getElementById('detailPlanteName').textContent = `${plante.emoji} ${plante.nom}`;
        document.getElementById('detailPlanteContent').innerHTML = `
            <p style="margin-bottom: 12px; color: var(--text-secondary);">${plante.conseils}</p>
            <p style="font-size: 0.9rem;">
                <strong>Arrosage :</strong><br>
                Été : tous les ${plante.frequenceEte} jours<br>
                Hiver : tous les ${plante.frequenceHiver} jours
            </p>
        `;
        document.getElementById('inputEmplacement').value = '';

        this.closeModal('modalPlante');
        this.openModal('modalPlantDetail');
    }

    confirmAddPlante() {
        if (!this.selectedCataloguePlante) return;

        const emplacement = document.getElementById('inputEmplacement').value.trim() || 'Non spécifié';

        const nouvellePlante = {
            id: 'plant_' + Date.now(),
            catalogueId: this.selectedCataloguePlante.id,
            nom: this.selectedCataloguePlante.nom,
            emoji: this.selectedCataloguePlante.emoji,
            frequenceEte: this.selectedCataloguePlante.frequenceEte,
            frequenceHiver: this.selectedCataloguePlante.frequenceHiver,
            conseils: this.selectedCataloguePlante.conseils,
            emplacement: emplacement,
            dernierArrosage: new Date().toISOString().split('T')[0]
        };

        this.mesPlantes.push(nouvellePlante);
        this.saveData();
        this.closeModal('modalPlantDetail');
        this.renderPlantes();
        this.selectedCataloguePlante = null;
    }

    arroserPlante(planteId) {
        const plante = this.mesPlantes.find(p => p.id === planteId);
        if (plante) {
            plante.dernierArrosage = new Date().toISOString().split('T')[0];
            this.saveData();
            this.renderPlantes();
            this.renderDashboard();
        }
    }

    supprimerPlante(planteId) {
        if (confirm('Supprimer cette plante ?')) {
            this.mesPlantes = this.mesPlantes.filter(p => p.id !== planteId);
            this.saveData();
            this.renderPlantes();
            this.renderDashboard();
        }
    }

    getStatutPlante(plante) {
        const today = new Date();
        const dernierArrosage = new Date(plante.dernierArrosage);
        const joursDepuis = Math.floor((today - dernierArrosage) / (1000 * 60 * 60 * 24));

        // Déterminer la saison (simplifié : avril-septembre = été)
        const mois = today.getMonth();
        const estEte = mois >= 3 && mois <= 8;
        const frequence = estEte ? plante.frequenceEte : plante.frequenceHiver;

        const joursRestants = frequence - joursDepuis;

        if (joursRestants <= 0) {
            return { status: 'urgent', text: 'À arroser !', class: 'urgent' };
        } else if (joursRestants === 1) {
            return { status: 'warning', text: 'Demain', class: 'warning' };
        } else {
            return { status: 'ok', text: `Dans ${joursRestants} jours`, class: 'ok' };
        }
    }

    renderPlantes() {
        const container = document.getElementById('plantesList');

        if (this.mesPlantes.length === 0) {
            container.innerHTML = '<p class="empty-state">Aucune plante ajoutée.<br>Cliquez sur + Ajouter pour commencer !</p>';
            return;
        }

        container.innerHTML = this.mesPlantes.map(plante => {
            const statut = this.getStatutPlante(plante);
            return `
                <div class="plante-card">
                    <span class="emoji">${plante.emoji}</span>
                    <div class="info">
                        <div class="name">${plante.nom}</div>
                        <div class="location">📍 ${plante.emplacement}</div>
                        <div class="status ${statut.class}">${statut.text}</div>
                    </div>
                    <div class="actions">
                        <button class="btn-water" data-plante-id="${plante.id}">💧 Arrosé !</button>
                        <button class="btn-delete" data-plante-id="${plante.id}">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');

        // Bind events
        container.querySelectorAll('.btn-water').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.arroserPlante(e.currentTarget.dataset.planteId);
            });
        });

        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.supprimerPlante(e.currentTarget.dataset.planteId);
            });
        });
    }

    // === FRIGO / INGREDIENTS ===
    openModalIngredient() {
        document.getElementById('inputIngredientNom').value = '';
        document.getElementById('selectCategorie').value = '';
        document.getElementById('inputDatePeremption').value = '';
        document.getElementById('inputQuantite').value = '';

        // Set default date to 7 days from now
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        document.getElementById('inputDatePeremption').value = defaultDate.toISOString().split('T')[0];

        this.openModal('modalIngredient');
    }

    confirmAddIngredient() {
        const nom = document.getElementById('inputIngredientNom').value.trim();
        const categorie = document.getElementById('selectCategorie').value;
        const datePeremption = document.getElementById('inputDatePeremption').value;
        const quantite = document.getElementById('inputQuantite').value.trim();

        if (!nom) {
            alert('Veuillez entrer un nom d\'ingrédient');
            return;
        }

        const nouvelIngredient = {
            id: 'ing_' + Date.now(),
            nom: nom,
            nomNormalise: this.normaliserIngredient(nom),
            categorie: categorie || 'autres',
            datePeremption: datePeremption || null,
            quantite: quantite || '',
            dateAjout: new Date().toISOString().split('T')[0]
        };

        this.mesIngredients.push(nouvelIngredient);
        this.saveData();
        this.closeModal('modalIngredient');
        this.renderFrigo();
        this.renderDashboard();
    }

    normaliserIngredient(nom) {
        const nomLower = nom.toLowerCase().trim();
        return INGREDIENT_ALIASES[nomLower] || nomLower.replace(/s$/, '').replace(/ /g, '-');
    }

    getStatutPeremption(datePeremption) {
        if (!datePeremption) return { status: 'ok', text: '', class: 'ok' };

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const peremption = new Date(datePeremption);
        const joursRestants = Math.ceil((peremption - today) / (1000 * 60 * 60 * 24));

        if (joursRestants < 0) {
            return { status: 'urgent', text: 'Périmé !', class: 'urgent' };
        } else if (joursRestants === 0) {
            return { status: 'urgent', text: "Aujourd'hui !", class: 'urgent' };
        } else if (joursRestants <= 2) {
            return { status: 'warning', text: `J-${joursRestants}`, class: 'warning' };
        } else if (joursRestants <= 5) {
            return { status: 'warning', text: `${joursRestants} jours`, class: 'warning' };
        } else {
            return { status: 'ok', text: `${joursRestants} jours`, class: 'ok' };
        }
    }

    supprimerIngredient(ingredientId) {
        this.mesIngredients = this.mesIngredients.filter(i => i.id !== ingredientId);
        this.saveData();
        this.renderFrigo();
        this.renderDashboard();
    }

    renderFrigo() {
        this.renderIngredients();
        this.renderRecettes();
    }

    renderIngredients() {
        const container = document.getElementById('ingredientsList');

        if (this.mesIngredients.length === 0) {
            container.innerHTML = '<p class="empty-state">Frigo vide !<br>Ajoutez vos ingrédients pour obtenir des suggestions de recettes.</p>';
            return;
        }

        // Trier par date de péremption (urgent en premier)
        const sorted = [...this.mesIngredients].sort((a, b) => {
            if (!a.datePeremption) return 1;
            if (!b.datePeremption) return -1;
            return new Date(a.datePeremption) - new Date(b.datePeremption);
        });

        container.innerHTML = sorted.map(ing => {
            const statut = this.getStatutPeremption(ing.datePeremption);
            const catEmoji = CATEGORIES_INGREDIENTS[ing.categorie]?.emoji || '📦';
            return `
                <div class="ingredient-card">
                    <span class="emoji">${catEmoji}</span>
                    <div class="info">
                        <div class="name">${ing.nom}</div>
                        <div class="detail">${ing.quantite || ''}</div>
                    </div>
                    ${statut.text ? `<span class="expiry ${statut.class}">${statut.text}</span>` : ''}
                    <button class="btn-delete" data-ingredient-id="${ing.id}">🗑️</button>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.supprimerIngredient(e.currentTarget.dataset.ingredientId);
            });
        });
    }

    // === RECETTES ===
    getRecettesMatchees() {
        const mesIngredientsNormalises = this.mesIngredients.map(i => i.nomNormalise);

        return RECETTES.map(recette => {
            // Ingrédients requis que j'ai
            const requisPresents = recette.ingredients.filter(ing =>
                mesIngredientsNormalises.some(mi => mi.includes(ing) || ing.includes(mi))
            );

            // Ingrédients optionnels que j'ai
            const optionnelsPresents = recette.optionnels.filter(ing =>
                mesIngredientsNormalises.some(mi => mi.includes(ing) || ing.includes(mi))
            );

            const totalRequis = recette.ingredients.length;
            const totalOptionnels = recette.optionnels.length;

            // Score basé sur les ingrédients requis + bonus pour optionnels
            const scoreRequis = totalRequis === 0 ? 1 : requisPresents.length / totalRequis;
            const scoreOptionnels = totalOptionnels === 0 ? 0 : optionnelsPresents.length / totalOptionnels;

            // Score final : requis pèse plus (70%) que optionnels (30%)
            const scoreFinal = scoreRequis * 0.7 + scoreOptionnels * 0.3;

            return {
                ...recette,
                requisPresents,
                optionnelsPresents,
                scoreRequis,
                scoreFinal,
                peutFaire: scoreRequis === 1 || (totalRequis === 0 && optionnelsPresents.length > 0)
            };
        })
        .filter(r => r.scoreFinal > 0)
        .sort((a, b) => {
            // Priorité aux recettes faisables, puis par score
            if (a.peutFaire !== b.peutFaire) return b.peutFaire - a.peutFaire;
            return b.scoreFinal - a.scoreFinal;
        });
    }

    renderRecettes() {
        const container = document.getElementById('recettesList');
        const recettes = this.getRecettesMatchees();

        if (recettes.length === 0) {
            container.innerHTML = '<p class="empty-state">Ajoutez des ingrédients pour voir les recettes possibles</p>';
            return;
        }

        container.innerHTML = recettes.slice(0, 15).map(recette => {
            const matchPercent = Math.round(recette.scoreFinal * 100);
            const allIngredients = [...recette.ingredients, ...recette.optionnels];
            const mesIngredientsNormalises = this.mesIngredients.map(i => i.nomNormalise);

            return `
                <div class="recette-card" data-recette-id="${recette.id}">
                    <div class="header">
                        <span class="emoji">${recette.emoji}</span>
                        <span class="name">${recette.nom}</span>
                        <span class="match">${matchPercent}%</span>
                    </div>
                    <div class="ingredients-preview">
                        ${allIngredients.slice(0, 6).map(ing => {
                            const have = mesIngredientsNormalises.some(mi => mi.includes(ing) || ing.includes(mi));
                            return `<span class="ingredient-tag ${have ? 'have' : 'missing'}">${ing}</span>`;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.recette-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.showRecetteDetail(e.currentTarget.dataset.recetteId);
            });
        });
    }

    showRecetteDetail(recetteId) {
        const recette = RECETTES.find(r => r.id === recetteId);
        if (!recette) return;

        document.getElementById('recetteTitle').textContent = `${recette.emoji} ${recette.nom}`;

        const mesIngredientsNormalises = this.mesIngredients.map(i => i.nomNormalise);

        document.getElementById('recetteContent').innerHTML = `
            <div class="recette-detail">
                <div class="time">⏱️ ${recette.temps} minutes</div>

                ${recette.ingredients.length > 0 ? `
                    <h4>Ingrédients principaux</h4>
                    <ul>
                        ${recette.ingredients.map(ing => {
                            const have = mesIngredientsNormalises.some(mi => mi.includes(ing) || ing.includes(mi));
                            return `<li style="color: ${have ? 'var(--success)' : 'var(--text-primary)'}">${have ? '✓' : '○'} ${ing}</li>`;
                        }).join('')}
                    </ul>
                ` : ''}

                <h4>Ingrédients optionnels</h4>
                <ul>
                    ${recette.optionnels.map(ing => {
                        const have = mesIngredientsNormalises.some(mi => mi.includes(ing) || ing.includes(mi));
                        return `<li style="color: ${have ? 'var(--success)' : 'var(--text-muted)'}">${have ? '✓' : '○'} ${ing}</li>`;
                    }).join('')}
                </ul>

                <h4>Instructions</h4>
                <p class="instructions">${recette.instructions}</p>
            </div>
        `;

        this.openModal('modalRecette');
    }

    // === DASHBOARD ===
    updateDate() {
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        const dateStr = new Date().toLocaleDateString('fr-FR', options);
        document.getElementById('dateToday').textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }

    renderDashboard() {
        this.renderPlantesAlerts();
        this.renderFrigoAlerts();
        this.renderSuggestion();
    }

    renderPlantesAlerts() {
        const container = document.getElementById('plantesAlerts');

        const plantesUrgentes = this.mesPlantes
            .map(p => ({ ...p, statut: this.getStatutPlante(p) }))
            .filter(p => p.statut.status !== 'ok')
            .sort((a, b) => {
                if (a.statut.status === 'urgent' && b.statut.status !== 'urgent') return -1;
                if (b.statut.status === 'urgent' && a.statut.status !== 'urgent') return 1;
                return 0;
            });

        if (plantesUrgentes.length === 0) {
            container.innerHTML = '<p class="empty-state">Toutes vos plantes vont bien !</p>';
            return;
        }

        container.innerHTML = plantesUrgentes.map(p => `
            <div class="alert-item ${p.statut.class}">
                <span class="emoji">${p.emoji}</span>
                <div class="info">
                    <div class="name">${p.nom}</div>
                    <div class="detail">${p.emplacement}</div>
                </div>
                <button class="btn-water" data-plante-id="${p.id}">💧</button>
            </div>
        `).join('');

        container.querySelectorAll('.btn-water').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.arroserPlante(e.currentTarget.dataset.planteId);
            });
        });
    }

    renderFrigoAlerts() {
        const container = document.getElementById('frigoAlerts');

        const produitsUrgents = this.mesIngredients
            .map(i => ({ ...i, statut: this.getStatutPeremption(i.datePeremption) }))
            .filter(i => i.statut.status !== 'ok' && i.datePeremption)
            .sort((a, b) => new Date(a.datePeremption) - new Date(b.datePeremption));

        if (produitsUrgents.length === 0) {
            container.innerHTML = '<p class="empty-state">Aucun produit urgent</p>';
            return;
        }

        container.innerHTML = produitsUrgents.slice(0, 5).map(i => {
            const catEmoji = CATEGORIES_INGREDIENTS[i.categorie]?.emoji || '📦';
            return `
                <div class="alert-item ${i.statut.class}">
                    <span class="emoji">${catEmoji}</span>
                    <div class="info">
                        <div class="name">${i.nom}</div>
                        <div class="detail">${i.statut.text}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderSuggestion() {
        const container = document.getElementById('suggestionDuJour');
        const recettes = this.getRecettesMatchees();

        // Trouver une recette faisable avec des ingrédients qui périment
        const recetteFaisable = recettes.find(r => r.peutFaire);

        if (!recetteFaisable) {
            if (this.mesIngredients.length === 0) {
                container.innerHTML = '<p class="empty-state">Ajoutez des ingrédients pour des suggestions</p>';
            } else {
                container.innerHTML = '<p class="empty-state">Pas de recette complète possible.<br>Consultez l\'onglet Recettes pour des idées !</p>';
            }
            return;
        }

        container.innerHTML = `
            <div class="recette-header">
                <span class="emoji">${recetteFaisable.emoji}</span>
                <span class="name">${recetteFaisable.nom}</span>
            </div>
            <p class="reason">Vous avez tous les ingrédients ! (${recetteFaisable.temps} min)</p>
        `;

        container.onclick = () => this.showRecetteDetail(recetteFaisable.id);
    }

    renderAll() {
        this.renderDashboard();
        this.renderPlantes();
        this.renderFrigo();
    }

    // === NOTIFICATIONS ===
    checkNotificationPermission() {
        if (!('Notification' in window)) return;

        const dismissed = localStorage.getItem('homehelper_notif_dismissed');
        if (dismissed) return;

        if (Notification.permission === 'default') {
            document.getElementById('notifBanner').classList.remove('hidden');
        }
    }

    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            document.getElementById('notifBanner').classList.add('hidden');

            if (permission === 'granted') {
                new Notification('HomeHelper', {
                    body: 'Notifications activées ! Vous recevrez des rappels pour vos plantes.',
                    icon: '🏠'
                });
                this.scheduleNotifications();
            }
        } catch (e) {
            console.error('Erreur notification:', e);
        }
    }

    scheduleNotifications() {
        // Vérifier toutes les heures si des rappels sont nécessaires
        setInterval(() => this.checkAndNotify(), 60 * 60 * 1000);
        // Vérifier aussi au démarrage
        this.checkAndNotify();
    }

    checkAndNotify() {
        if (Notification.permission !== 'granted') return;

        const now = new Date();
        // Notifier uniquement entre 8h et 10h
        if (now.getHours() < 8 || now.getHours() > 10) return;

        const lastNotif = localStorage.getItem('homehelper_last_notif');
        const today = now.toISOString().split('T')[0];
        if (lastNotif === today) return; // Déjà notifié aujourd'hui

        // Compter les plantes à arroser
        const plantesUrgentes = this.mesPlantes.filter(p =>
            this.getStatutPlante(p).status !== 'ok'
        ).length;

        // Compter les produits qui périment bientôt
        const produitsUrgents = this.mesIngredients.filter(i =>
            this.getStatutPeremption(i.datePeremption).status !== 'ok'
        ).length;

        if (plantesUrgentes > 0 || produitsUrgents > 0) {
            let message = [];
            if (plantesUrgentes > 0) {
                message.push(`${plantesUrgentes} plante${plantesUrgentes > 1 ? 's' : ''} à arroser`);
            }
            if (produitsUrgents > 0) {
                message.push(`${produitsUrgents} produit${produitsUrgents > 1 ? 's' : ''} à consommer`);
            }

            new Notification('🏠 HomeHelper - Rappel', {
                body: message.join(' • '),
                tag: 'homehelper-daily'
            });

            localStorage.setItem('homehelper_last_notif', today);
        }
    }

    // === SERVICE WORKER ===
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('sw.js');
            } catch (e) {
                console.log('SW registration failed:', e);
            }
        }
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HomeHelper();
});
