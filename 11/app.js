// Données des missions avec fréquences de reset
// frequency: 'daily' (chaque jour), 'weekly' (chaque semaine), 'days' (tous les X jours), 'reminder' (rappel permanent)
const MISSIONS = {
    kitchen: {
        name: "Cuisine 👩🏻‍🍳",
        emoji: "👩🏻‍🍳",
        missions: [
            {
                id: "k1",
                title: "Ne pas tout allumer en même temps ⚡",
                desc: "L'électricité saute si trop d'appareils fonctionnent ensemble !",
                points: 10,
                frequency: "daily"
            },
            {
                id: "k2",
                title: "Protéger la plaque de cuisson",
                desc: "Ne pas traîner les casseroles et NE JAMAIS couper dessus. Pas de rayures !",
                points: 15,
                frequency: "daily"
            },
            {
                id: "k3",
                title: "Protéger le carrelage",
                desc: "Ne pas laisser tomber d'objets lourds ou tranchants. Les carreaux peuvent s'ébrécher !",
                points: 10,
                frequency: "reminder"
            },
            {
                id: "k4",
                title: "Utiliser la hotte + aérer",
                desc: "Allumer la hotte aspirante et ouvrir la fenêtre si nécessaire",
                points: 10,
                frequency: "daily"
            },
            {
                id: "k5",
                title: "Prendre soin des ustensiles 💅🏻",
                desc: "Pas de grattage agressif ! Utiliser et laver délicatement",
                points: 10,
                frequency: "daily"
            },
            {
                id: "k6",
                title: "Laver les couteaux délicatement 🔪",
                desc: "Nettoyage doux et séchage à plat pour ne pas émousser les lames",
                points: 10,
                frequency: "daily"
            },
            {
                id: "k7",
                title: "Utiliser la cloche du micro-ondes 🔔",
                desc: "Toujours couvrir les plats quand on réchauffe",
                points: 5,
                frequency: "daily"
            },
            {
                id: "k8",
                title: "Baguettes japonaises = déco only 🥢",
                desc: "Ne PAS utiliser les belles baguettes japonaises pour cuisiner",
                points: 10,
                frequency: "reminder"
            },
            {
                id: "k9",
                title: "Ranger les couverts correctement 🍴",
                desc: "Remettre chaque couvert à sa place selon forme et type",
                points: 10,
                frequency: "daily"
            },
            {
                id: "k10",
                title: "Nettoyer les surfaces 💦",
                desc: "Pas de taches ! Spray vinaigre pour surfaces, antibactérien si nourriture crue",
                points: 15,
                frequency: "daily"
            },
            {
                id: "k11",
                title: "Nettoyer le micro-ondes et le four",
                desc: "Vérifier qu'ils sont propres après utilisation",
                points: 10,
                frequency: "weekly"
            },
            {
                id: "k12",
                title: "Stocker dans les contenants",
                desc: "Utiliser les boîtes sous l'évier pour conserver. NE PAS les jeter !",
                points: 10,
                frequency: "daily"
            }
        ]
    },
    bathroom: {
        name: "Salle de bain 🚿",
        emoji: "🚿",
        missions: [
            {
                id: "b1",
                title: "Essuyer la douche après utilisation",
                desc: "Sécher les parois et la robinetterie. Les traces d'eau c'est beurk !",
                points: 15,
                frequency: "daily"
            },
            {
                id: "b2",
                title: "Essuyer lavabo et miroir",
                desc: "Pas d'éclaboussures ! Nettoyer les projections d'eau",
                points: 10,
                frequency: "daily"
            },
            {
                id: "b3",
                title: "Changer le tapis de bain",
                desc: "Trouver les tapis propres dans le meuble de salle de bain",
                points: 10,
                frequency: "weekly"
            }
        ]
    },
    laundry: {
        name: "Linge 🧺",
        emoji: "🧺",
        missions: [
            {
                id: "l1",
                title: "Trouver les produits",
                desc: "Tout est sous l'évier de la cuisine !",
                points: 5,
                frequency: "reminder"
            },
            {
                id: "l2",
                title: "Doser la lessive correctement",
                desc: "UN bouchon de lessive dans le bac tout à gauche",
                points: 10,
                frequency: "days",
                resetDays: 4
            },
            {
                id: "l3",
                title: "Utiliser une lingette anti-décoloration",
                desc: "Boîte rose sous l'évier, si tu mélanges blancs et couleurs",
                points: 10,
                frequency: "days",
                resetDays: 4
            },
            {
                id: "l4",
                title: "Ajouter une pastille Calgon",
                desc: "Pour éviter les dépôts de calcaire dans la machine",
                points: 10,
                frequency: "days",
                resetDays: 4
            },
            {
                id: "l5",
                title: "Lancer avant 20h",
                desc: "Respecter le voisinage : pas de machine après 20h !",
                points: 15,
                frequency: "days",
                resetDays: 4
            }
        ]
    },
    general: {
        name: "Rangement 🏠",
        emoji: "🏠",
        missions: [
            {
                id: "g1",
                title: "Vider le verre 🍶",
                desc: "Poubelle verre derrière la porte de la cuisine",
                points: 10,
                frequency: "weekly"
            },
            {
                id: "g2",
                title: "Vider le plastique (RINCÉ)",
                desc: "Rincer les emballages ! Poubelle plastique derrière la porte cuisine",
                points: 15,
                frequency: "weekly"
            },
            {
                id: "g3",
                title: "Vider le compost 🍊",
                desc: "Vider le bac à compost des déchets alimentaires",
                points: 10,
                frequency: "days",
                resetDays: 2
            },
            {
                id: "g4",
                title: "PAS DE CHAUSSURES À L'INTÉRIEUR 👞",
                desc: "Enlever les chaussures d'extérieur en entrant !",
                points: 15,
                frequency: "reminder"
            },
            {
                id: "g5",
                title: "Utiliser les serviettes en tissu",
                desc: "Tiroir sous le four : réutiliser les serviettes en lin comme serviettes de table",
                points: 10,
                frequency: "daily"
            },
            {
                id: "g6",
                title: "Balayer 🧹",
                desc: "Balais derrière la porte de la cuisine",
                points: 10,
                frequency: "days",
                resetDays: 3
            }
        ]
    }
};

// Labels pour les fréquences
const FREQUENCY_LABELS = {
    daily: "Chaque jour",
    weekly: "Chaque semaine",
    days: "Tous les {n} jours",
    reminder: "Rappel permanent"
};

// Niveaux et badges
const BADGES = [
    { id: "rookie", name: "Rookie", icon: "🌱", threshold: 0 },
    { id: "helper", name: "Helper", icon: "🧹", threshold: 25 },
    { id: "cleaner", name: "Cleaner", icon: "🧽", threshold: 50 },
    { id: "pro", name: "Pro", icon: "💫", threshold: 75 },
    { id: "legend", name: "Legend", icon: "👑", threshold: 100 }
];

// Messages motivants
const MOTIVATIONS = {
    start: [
        "Bienvenue ! Prêt·e à faire briller la Dreamhouse ? ✨",
        "Let's gooo ! La Dreamhouse a besoin de toi ! 💪",
        "Salut champion·ne du ménage ! 🏆"
    ],
    progress: [
        "Tu gères ! Continue comme ça ! 🔥",
        "La Dreamhouse commence à briller ! ✨",
        "Wow, quel·le pro ! 💫",
        "Tiphaine serait fière ! 🥹"
    ],
    halfway: [
        "À mi-chemin ! Tu es incroyable ! 🎉",
        "50% ! La maison est déjà plus propre ! 🧹",
        "Half way there ! Keep it up! 💪"
    ],
    almost: [
        "Presque fini ! Tu y es presque ! 🏁",
        "Plus que quelques missions ! 🎯",
        "La ligne d'arrivée est proche ! 🚀"
    ],
    complete: [
        "LÉGENDAIRE ! Tu as tout fini pour aujourd'hui ! 👑✨",
        "100% ! Tu es le/la GOAT du ménage ! 🐐",
        "Dreamhouse = IMMACULÉE ! 🏠💖"
    ]
};

// État de l'application
// completions: { missionId: timestamp de dernière complétion }
let state = {
    completions: {},
    totalPoints: 0
};

// Helpers pour les dates
function getToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

function getStartOfWeek() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Lundi
    return new Date(now.getFullYear(), now.getMonth(), diff).getTime();
}

function daysBetween(timestamp1, timestamp2) {
    return Math.floor((timestamp2 - timestamp1) / (1000 * 60 * 60 * 24));
}

// Vérifier si une mission doit être refaite
function isMissionDue(mission) {
    const lastDone = state.completions[mission.id];

    // Jamais faite
    if (!lastDone) return true;

    const today = getToday();
    const weekStart = getStartOfWeek();

    switch (mission.frequency) {
        case 'daily':
            return lastDone < today;
        case 'weekly':
            return lastDone < weekStart;
        case 'days':
            return daysBetween(lastDone, today) >= mission.resetDays;
        case 'reminder':
            return false; // Les rappels ne sont jamais "à refaire"
        default:
            return true;
    }
}

// Vérifier si une mission est complétée (pour la période en cours)
function isMissionCompleted(mission) {
    const lastDone = state.completions[mission.id];
    if (!lastDone) return false;

    // Pour les rappels, une fois fait = toujours fait
    if (mission.frequency === 'reminder') return true;

    return !isMissionDue(mission);
}

// Obtenir le texte de statut d'une mission
function getMissionStatus(mission) {
    const lastDone = state.completions[mission.id];

    if (!lastDone) {
        if (mission.frequency === 'reminder') {
            return { text: "À lire", class: "reminder" };
        }
        return { text: "À faire", class: "due" };
    }

    if (mission.frequency === 'reminder') {
        return { text: "Lu ✓", class: "done" };
    }

    if (isMissionDue(mission)) {
        const days = daysBetween(lastDone, getToday());
        if (days === 1) {
            return { text: "Hier - À refaire", class: "due" };
        }
        return { text: `Il y a ${days}j - À refaire`, class: "due" };
    }

    // Complété pour cette période
    switch (mission.frequency) {
        case 'daily':
            return { text: "Fait aujourd'hui ✓", class: "done" };
        case 'weekly':
            return { text: "Fait cette semaine ✓", class: "done" };
        case 'days':
            const nextDue = mission.resetDays - daysBetween(lastDone, getToday());
            if (nextDue === 1) {
                return { text: "Fait ✓ (demain)", class: "done-soon" };
            }
            return { text: `Fait ✓ (dans ${nextDue}j)`, class: "done" };
        default:
            return { text: "Fait ✓", class: "done" };
    }
}

// Obtenir le label de fréquence
function getFrequencyLabel(mission) {
    if (mission.frequency === 'days') {
        return `Tous les ${mission.resetDays} jours`;
    }
    return FREQUENCY_LABELS[mission.frequency];
}

// Charger l'état depuis localStorage
function loadState() {
    const saved = localStorage.getItem('dreamhouse_state_v2');
    if (saved) {
        state = JSON.parse(saved);
    } else {
        // Migration depuis l'ancienne version
        const oldState = localStorage.getItem('dreamhouse_state');
        if (oldState) {
            const old = JSON.parse(oldState);
            state = {
                completions: {},
                totalPoints: old.points || 0
            };
            // Marquer les anciennes missions comme faites aujourd'hui
            if (old.completedMissions) {
                const today = getToday();
                old.completedMissions.forEach(id => {
                    state.completions[id] = today;
                });
            }
            saveState();
            localStorage.removeItem('dreamhouse_state');
        }
    }
    updateUI();
}

// Sauvegarder l'état
function saveState() {
    localStorage.setItem('dreamhouse_state_v2', JSON.stringify(state));
}

// Compter les missions à faire aujourd'hui
function getDueMissionsCount() {
    let due = 0;
    let completed = 0;

    Object.values(MISSIONS).forEach(zone => {
        zone.missions.forEach(mission => {
            if (mission.frequency !== 'reminder') {
                if (isMissionDue(mission)) {
                    due++;
                } else {
                    completed++;
                }
            }
        });
    });

    return { due, completed, total: due + completed };
}

// Obtenir le pourcentage de progression (missions faites sur total à faire)
function getProgress() {
    const { completed, total } = getDueMissionsCount();
    if (total === 0) return 100;
    return Math.round((completed / total) * 100);
}

// Obtenir le badge actuel
function getCurrentBadge() {
    const progress = getProgress();
    let currentBadge = BADGES[0];
    BADGES.forEach(badge => {
        if (progress >= badge.threshold) {
            currentBadge = badge;
        }
    });
    return currentBadge;
}

// Obtenir un message motivant
function getMotivation() {
    const progress = getProgress();
    let messages;

    if (progress === 0) {
        messages = MOTIVATIONS.start;
    } else if (progress < 50) {
        messages = MOTIVATIONS.progress;
    } else if (progress < 75) {
        messages = MOTIVATIONS.halfway;
    } else if (progress < 100) {
        messages = MOTIVATIONS.almost;
    } else {
        messages = MOTIVATIONS.complete;
    }

    return messages[Math.floor(Math.random() * messages.length)];
}

// Afficher un toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Obtenir les missions urgentes triées par priorité
function getUrgentMissions() {
    const urgent = [];
    const today = getToday();

    Object.entries(MISSIONS).forEach(([zoneId, zone]) => {
        zone.missions.forEach(mission => {
            if (mission.frequency === 'reminder') return; // Rappels dans section dédiée
            if (!isMissionDue(mission)) return; // Ignorer les missions faites

            const lastDone = state.completions[mission.id];
            let urgency = 0;
            let dueText = "À faire";
            let isOverdue = false;

            if (!lastDone) {
                // Jamais fait = très urgent
                urgency = 100;
                dueText = "Jamais fait";
                isOverdue = true;
            } else {
                const daysSince = daysBetween(lastDone, today);

                switch (mission.frequency) {
                    case 'daily':
                        urgency = daysSince * 10; // Plus c'est vieux, plus c'est urgent
                        if (daysSince === 1) {
                            dueText = "Hier";
                        } else {
                            dueText = `Il y a ${daysSince}j`;
                            isOverdue = daysSince > 1;
                        }
                        break;
                    case 'weekly':
                        urgency = daysSince;
                        if (daysSince <= 7) {
                            dueText = "Cette semaine";
                        } else {
                            dueText = `Il y a ${daysSince}j`;
                            isOverdue = true;
                        }
                        break;
                    case 'days':
                        const overdueDays = daysSince - mission.resetDays;
                        urgency = overdueDays * 5;
                        if (overdueDays === 0) {
                            dueText = "Aujourd'hui";
                        } else if (overdueDays === 1) {
                            dueText = "Depuis hier";
                            isOverdue = true;
                        } else {
                            dueText = `+${overdueDays}j de retard`;
                            isOverdue = true;
                        }
                        break;
                }
            }

            urgent.push({
                mission,
                zoneId,
                zoneName: zone.name.replace(/\s*[^\w\s].*/g, '').trim(), // Retirer emoji
                urgency,
                dueText,
                isOverdue
            });
        });
    });

    // Trier par urgence décroissante
    urgent.sort((a, b) => b.urgency - a.urgency);

    return urgent;
}

// Mettre à jour la section priorités
function updatePriorities() {
    const section = document.getElementById('priorities-section');
    const list = document.getElementById('priorities-list');
    const urgent = getUrgentMissions();

    if (urgent.length === 0) {
        // Tout est fait !
        section.classList.add('all-done');
        section.querySelector('h3').textContent = '✨ Tout est fait !';
        list.innerHTML = '<div class="all-done-message">Bravo ! Aucune tâche urgente pour le moment.</div>';
        return;
    }

    section.classList.remove('all-done');
    section.querySelector('h3').textContent = `🔥 À faire (${urgent.length})`;

    // Afficher max 5 priorités, avec bouton "voir plus"
    const maxShow = 5;
    const toShow = urgent.slice(0, maxShow);

    list.innerHTML = '';

    toShow.forEach(item => {
        const div = document.createElement('div');
        div.className = 'priority-item' + (item.isOverdue ? ' overdue' : '');
        div.innerHTML = `
            <div class="priority-checkbox"></div>
            <div class="priority-content">
                <div class="priority-title">${item.mission.title}</div>
                <div class="priority-meta">
                    <span class="priority-zone">${item.zoneName}</span>
                    <span class="priority-due">${item.dueText}</span>
                </div>
            </div>
        `;
        div.addEventListener('click', () => completePriorityMission(item.mission));
        list.appendChild(div);
    });

    // Bouton voir plus si nécessaire
    if (urgent.length > maxShow) {
        const btn = document.createElement('button');
        btn.className = 'show-more-btn';
        btn.textContent = `Voir les ${urgent.length - maxShow} autres tâches...`;
        btn.addEventListener('click', () => showAllPriorities(urgent));
        list.appendChild(btn);
    }
}

// Compléter une mission depuis les priorités
function completePriorityMission(mission) {
    // Vérifier late_cleaner avant de marquer comme fait
    checkLateCleaner(mission);

    state.completions[mission.id] = getToday();
    state.totalPoints += mission.points;
    saveState();
    updateUI();
    updatePriorities();
    updateAchievementBadges();
    playCompletionSound();
    showToast(`+${mission.points}⭐ ${mission.title.substring(0, 20)}...`);

    // Vérifier achievements
    checkTimeBasedAchievements();
    checkStreak();

    // Vérifier badges de progression
    const progress = getProgress();
    BADGES.forEach(badge => {
        if (progress >= badge.threshold && progress - 5 < badge.threshold) {
            setTimeout(() => {
                showToast(`🎉 Nouveau badge : ${badge.icon} ${badge.name} !`);
            }, 1000);
        }
    });
}

// Afficher toutes les priorités dans le panel
function showAllPriorities(urgent) {
    const panel = document.getElementById('missions-panel');
    const title = document.getElementById('panel-title');
    const list = document.getElementById('missions-list');

    title.textContent = '🔥 Toutes les tâches à faire';
    list.innerHTML = '';

    urgent.forEach(item => {
        const status = getMissionStatus(item.mission);
        const div = document.createElement('div');
        div.className = `mission-item ${item.isOverdue ? 'due' : 'due'}`;
        div.innerHTML = `
            <div class="mission-checkbox"></div>
            <div class="mission-content">
                <div class="mission-title">${item.mission.title}</div>
                <div class="mission-desc">${item.mission.desc}</div>
                <div class="mission-meta">
                    <span class="mission-frequency">${item.zoneName}</span>
                    <span class="mission-status">${item.dueText}</span>
                </div>
            </div>
            <div class="mission-points">+${item.mission.points}⭐</div>
        `;
        div.addEventListener('click', () => {
            completePriorityMission(item.mission);
            // Rafraîchir le panel
            showAllPriorities(getUrgentMissions());
        });
        list.appendChild(div);
    });

    if (urgent.length === 0) {
        list.innerHTML = '<div class="all-done-message" style="padding: 2rem;">✨ Tout est fait ! Bravo !</div>';
    }

    panel.classList.add('active');
}

// Mettre à jour l'interface
function updateUI() {
    const { completed, total } = getDueMissionsCount();

    // Points et missions complétées
    document.getElementById('points').textContent = state.totalPoints;
    document.getElementById('completed').textContent = `${completed}/${total}`;

    // Barre de progression
    const progress = getProgress();
    document.getElementById('progress-bar').style.width = progress + '%';
    document.getElementById('progress-text').textContent = progress + '%';

    // Badge actuel
    const badge = getCurrentBadge();
    document.querySelector('.badge-icon').textContent = badge.icon;
    document.querySelector('.badge-name').textContent = badge.name;

    // Message motivant
    document.getElementById('motivation').textContent = getMotivation();

    // Progression par zone
    Object.keys(MISSIONS).forEach(zoneId => {
        const zone = MISSIONS[zoneId];
        let zoneDue = 0;
        let zoneCompleted = 0;

        zone.missions.forEach(mission => {
            if (mission.frequency !== 'reminder') {
                if (isMissionDue(mission)) {
                    zoneDue++;
                } else {
                    zoneCompleted++;
                }
            }
        });

        const zoneTotal = zoneDue + zoneCompleted;
        document.getElementById(zoneId + '-progress').textContent =
            zoneTotal > 0 ? `${zoneCompleted}/${zoneTotal}` : '✓';

        // Marquer la zone comme complète
        const card = document.querySelector(`[data-zone="${zoneId}"]`);
        if (zoneDue === 0) {
            card.classList.add('completed');
        } else {
            card.classList.remove('completed');
        }
    });

    // Mettre à jour les badges
    BADGES.forEach(badge => {
        const badgeEl = document.querySelector(`[data-badge="${badge.id}"]`);
        if (progress >= badge.threshold) {
            badgeEl.classList.remove('locked');
            badgeEl.classList.add('unlocked');
        } else {
            badgeEl.classList.add('locked');
            badgeEl.classList.remove('unlocked');
        }
    });
}

// Afficher une zone
function showZone(zoneId) {
    const zone = MISSIONS[zoneId];
    const panel = document.getElementById('missions-panel');
    const title = document.getElementById('panel-title');
    const list = document.getElementById('missions-list');

    title.textContent = zone.name;
    list.innerHTML = '';

    // Trier : à faire d'abord, puis faits
    const sortedMissions = [...zone.missions].sort((a, b) => {
        const aDue = isMissionDue(a) ? 0 : 1;
        const bDue = isMissionDue(b) ? 0 : 1;
        return aDue - bDue;
    });

    sortedMissions.forEach(mission => {
        const isCompleted = isMissionCompleted(mission);
        const status = getMissionStatus(mission);
        const item = document.createElement('div');
        item.className = `mission-item ${status.class}`;
        item.innerHTML = `
            <div class="mission-checkbox">${isCompleted ? '✓' : ''}</div>
            <div class="mission-content">
                <div class="mission-title">${mission.title}</div>
                <div class="mission-desc">${mission.desc}</div>
                <div class="mission-meta">
                    <span class="mission-frequency">${getFrequencyLabel(mission)}</span>
                    <span class="mission-status">${status.text}</span>
                </div>
            </div>
            <div class="mission-points">+${mission.points}⭐</div>
        `;
        item.addEventListener('click', () => toggleMission(mission));
        list.appendChild(item);
    });

    panel.classList.add('active');
}

// Fermer le panel
function closePanel() {
    document.getElementById('missions-panel').classList.remove('active');
}

// Toggle une mission
function toggleMission(mission) {
    const wasCompleted = isMissionCompleted(mission);
    let message;

    if (!wasCompleted) {
        // Vérifier late_cleaner avant de marquer comme fait
        checkLateCleaner(mission);

        // Compléter la mission
        state.completions[mission.id] = getToday();
        state.totalPoints += mission.points;
        message = `+${mission.points}⭐ Mission accomplie !`;
        playCompletionSound();

        // Vérifier achievements
        checkTimeBasedAchievements();
        checkStreak();

        // Vérifier si nouveau badge de progression
        const oldProgress = getProgress() - 5; // approximation
        const newProgress = getProgress();

        BADGES.forEach(badge => {
            if (oldProgress < badge.threshold && newProgress >= badge.threshold) {
                setTimeout(() => {
                    showToast(`🎉 Nouveau badge : ${badge.icon} ${badge.name} !`);
                }, 1000);
            }
        });
    } else {
        // Annuler la mission (seulement si c'est récent)
        if (mission.frequency === 'reminder') {
            delete state.completions[mission.id];
        } else {
            // Remettre à hier pour les missions périodiques
            state.completions[mission.id] = getToday() - (1000 * 60 * 60 * 24 * 100);
        }
        state.totalPoints = Math.max(0, state.totalPoints - mission.points);
        message = `Mission annulée`;
    }

    saveState();
    updateUI();
    updatePriorities();
    updateAchievementBadges();
    showToast(message);

    // Rafraîchir la liste des missions
    const zoneId = Object.keys(MISSIONS).find(z =>
        MISSIONS[z].missions.some(m => m.id === mission.id)
    );
    showZone(zoneId);
}

// Vérifier si une zone est complète (toutes missions non-reminder faites)
function isZoneComplete(zoneId) {
    const zone = MISSIONS[zoneId];
    return zone.missions.every(m =>
        m.frequency === 'reminder' || isMissionCompleted(m)
    );
}

// Mettre à jour les badges d'accomplissement
function updateAchievementBadges() {
    const achievements = {
        // Badges de points
        centurion: state.totalPoints >= 100,
        superstar: state.totalPoints >= 500,
        legendary: state.totalPoints >= 1000,

        // Badges de zone
        kitchen_master: isZoneComplete('kitchen'),
        bathroom_pro: isZoneComplete('bathroom'),
        laundry_expert: isZoneComplete('laundry'),
        tidy_freak: isZoneComplete('general'),

        // Badges basés sur l'historique (stockés dans state)
        early_bird: state.achievements?.early_bird || false,
        night_owl: state.achievements?.night_owl || false,
        late_cleaner: state.achievements?.late_cleaner || false,
        streak_3: state.achievements?.streak_3 || false,
        streak_7: state.achievements?.streak_7 || false
    };

    // Mettre à jour l'affichage
    Object.entries(achievements).forEach(([id, unlocked]) => {
        const el = document.querySelector(`[data-achievement="${id}"]`);
        if (el) {
            if (unlocked) {
                el.classList.remove('locked');
                el.classList.add('unlocked');
            } else {
                el.classList.add('locked');
                el.classList.remove('unlocked');
            }
        }
    });
}

// Débloquer un achievement spécial (et sauvegarder)
function unlockAchievement(id, message) {
    if (!state.achievements) state.achievements = {};
    if (state.achievements[id]) return; // Déjà débloqué

    state.achievements[id] = true;
    saveState();
    updateAchievementBadges();

    // Toast de félicitations
    const names = {
        early_bird: '🌅 Early Bird',
        night_owl: '🦉 Night Owl',
        late_cleaner: '😅 Late Cleaner',
        streak_3: '🔥 On Fire',
        streak_7: '⚡ Inarrêtable'
    };

    setTimeout(() => {
        showToast(`🎖️ Badge débloqué : ${names[id] || id} !`);
    }, 1500);
}

// Vérifier les achievements basés sur l'heure et le contexte
function checkTimeBasedAchievements() {
    const hour = new Date().getHours();

    if (hour < 9) {
        unlockAchievement('early_bird');
    }
    if (hour >= 21) {
        unlockAchievement('night_owl');
    }
}

// Vérifier si on rattrape du retard (pour late_cleaner)
function checkLateCleaner(mission) {
    const lastDone = state.completions[mission.id];
    if (!lastDone) return;

    const daysSince = daysBetween(lastDone, getToday());

    // Si la tâche était très en retard (plus de 3 jours)
    if (mission.frequency === 'daily' && daysSince >= 3) {
        unlockAchievement('late_cleaner');
    } else if (mission.frequency === 'weekly' && daysSince >= 14) {
        unlockAchievement('late_cleaner');
    } else if (mission.frequency === 'days' && daysSince >= mission.resetDays * 2) {
        unlockAchievement('late_cleaner');
    }
}

// Vérifier les streaks (jours parfaits consécutifs)
function checkStreak() {
    if (!state.perfectDays) state.perfectDays = [];

    const today = getToday();
    const { due } = getDueMissionsCount();

    // Si tout est fait aujourd'hui
    if (due === 0) {
        // Ajouter aujourd'hui si pas déjà présent
        if (!state.perfectDays.includes(today)) {
            state.perfectDays.push(today);
            state.perfectDays.sort((a, b) => b - a); // Plus récent en premier

            // Garder seulement les 30 derniers jours
            state.perfectDays = state.perfectDays.slice(0, 30);
            saveState();
        }

        // Compter les jours consécutifs
        let streak = 0;
        let checkDate = today;

        for (let i = 0; i < state.perfectDays.length; i++) {
            if (state.perfectDays.includes(checkDate)) {
                streak++;
                checkDate -= 24 * 60 * 60 * 1000; // Jour précédent
            } else {
                break;
            }
        }

        if (streak >= 3) unlockAchievement('streak_3');
        if (streak >= 7) unlockAchievement('streak_7');
    }
}

// Réinitialiser la progression
function resetProgress() {
    if (confirm('Tu veux vraiment tout recommencer ? 🤔\nTes points seront conservés, mais toutes les missions seront à refaire.')) {
        state.completions = {};
        saveState();
        updateUI();
        updatePriorities();
        updateAchievementBadges();
        showToast('Missions réinitialisées ! 🔄');
    }
}

// Fermer le panel avec Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePanel();
        closeStatsPanel();
        closePhotoModal();
    }
});

// ========== SOUND & VIBRATION ==========
function playCompletionSound() {
    // Vibration
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }

    // Son (Web Audio API pour un "ding" satisfaisant)
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Audio non supporté
    }
}

// ========== DARK MODE ==========
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('dreamhouse_dark_mode', isDark);

    // Mettre à jour l'icône
    document.getElementById('dark-mode-icon').textContent = isDark ? '☀️' : '🌙';

    // Mettre à jour le theme-color
    document.getElementById('theme-color').content = isDark ? '#1A1A2E' : '#FF1493';
}

function loadDarkMode() {
    const isDark = localStorage.getItem('dreamhouse_dark_mode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-icon').textContent = '☀️';
        document.getElementById('theme-color').content = '#1A1A2E';
    }
}

// ========== ACTIVITY MODES ==========
const ACTIVITY_MISSIONS = {
    cooking: ['k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8', 'k9', 'k10', 'k12'],
    shower: ['b1', 'b2'],
    departure: ['k10', 'k11', 'b1', 'b2', 'g1', 'g2', 'g3', 'g4', 'g6'] // Checklist de départ
};

const ACTIVITY_NAMES = {
    cooking: '🍳 Mode Cuisine',
    shower: '🚿 Mode Douche',
    departure: '✈️ Checklist Départ'
};

function startActivity(activity) {
    const missionIds = ACTIVITY_MISSIONS[activity];
    const panel = document.getElementById('missions-panel');
    const title = document.getElementById('panel-title');
    const list = document.getElementById('missions-list');

    title.textContent = ACTIVITY_NAMES[activity];
    list.innerHTML = '';

    // Collecter les missions de toutes les zones
    const relevantMissions = [];
    Object.entries(MISSIONS).forEach(([zoneId, zone]) => {
        zone.missions.forEach(mission => {
            if (missionIds.includes(mission.id)) {
                relevantMissions.push({ mission, zoneName: zone.name });
            }
        });
    });

    // Trier : à faire d'abord
    relevantMissions.sort((a, b) => {
        const aDue = isMissionDue(a.mission) ? 0 : 1;
        const bDue = isMissionDue(b.mission) ? 0 : 1;
        return aDue - bDue;
    });

    relevantMissions.forEach(({ mission, zoneName }) => {
        const isCompleted = isMissionCompleted(mission);
        const status = getMissionStatus(mission);
        const item = document.createElement('div');
        item.className = `mission-item ${status.class}`;
        item.innerHTML = `
            <div class="mission-checkbox">${isCompleted ? '✓' : ''}</div>
            <div class="mission-content">
                <div class="mission-title">${mission.title}</div>
                <div class="mission-desc">${mission.desc}</div>
                <div class="mission-meta">
                    <span class="mission-frequency">${getFrequencyLabel(mission)}</span>
                    <span class="mission-status">${status.text}</span>
                </div>
            </div>
            <div class="mission-points">+${mission.points}⭐</div>
        `;
        item.addEventListener('click', () => {
            toggleMission(mission);
            startActivity(activity); // Rafraîchir
        });
        list.appendChild(item);
    });

    panel.classList.add('active');
}

// ========== LAUNDRY TIMER ==========
let laundryTimer = null;
let laundryEndTime = null;

function startLaundryTimer(minutes) {
    const section = document.getElementById('timer-section');
    const display = document.getElementById('timer-display');
    const status = document.getElementById('timer-status');

    // Calculer l'heure de fin
    laundryEndTime = Date.now() + (minutes * 60 * 1000);

    // Sauvegarder
    localStorage.setItem('dreamhouse_timer_end', laundryEndTime);

    section.classList.add('running');
    status.textContent = `Fin prévue : ${new Date(laundryEndTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;

    updateTimerDisplay();

    // Mettre à jour toutes les secondes
    laundryTimer = setInterval(updateTimerDisplay, 1000);

    showToast('⏱️ Timer lancé !');
    playCompletionSound();
}

function updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    const section = document.getElementById('timer-section');

    if (!laundryEndTime) return;

    const remaining = laundryEndTime - Date.now();

    if (remaining <= 0) {
        // Timer terminé !
        clearInterval(laundryTimer);
        laundryTimer = null;
        display.textContent = '00:00';
        section.classList.remove('running');

        // Notification
        showToast('🧺 Machine terminée ! 🎉');
        playCompletionSound();

        // Essayer de notifier
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🧺 Dreamhouse Quest', {
                body: 'Ta machine à laver est terminée !',
                icon: '🧺'
            });
        }

        localStorage.removeItem('dreamhouse_timer_end');
        laundryEndTime = null;
        return;
    }

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function cancelTimer() {
    clearInterval(laundryTimer);
    laundryTimer = null;
    laundryEndTime = null;
    localStorage.removeItem('dreamhouse_timer_end');

    const section = document.getElementById('timer-section');
    const display = document.getElementById('timer-display');

    section.classList.remove('running');
    display.textContent = '--:--';
    document.getElementById('timer-status').textContent = '';
}

function restoreTimer() {
    const savedEnd = localStorage.getItem('dreamhouse_timer_end');
    if (savedEnd) {
        laundryEndTime = parseInt(savedEnd);
        if (laundryEndTime > Date.now()) {
            const section = document.getElementById('timer-section');
            section.classList.add('active', 'running');
            document.getElementById('timer-status').textContent =
                `Fin prévue : ${new Date(laundryEndTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
            updateTimerDisplay();
            laundryTimer = setInterval(updateTimerDisplay, 1000);
        } else {
            localStorage.removeItem('dreamhouse_timer_end');
        }
    }
}

// Afficher/cacher la section timer
function showTimer() {
    document.getElementById('timer-section').classList.add('active');
}

// ========== STATISTICS ==========
function showStats() {
    const panel = document.getElementById('stats-panel');
    const content = document.getElementById('stats-content');

    const { completed, total } = getDueMissionsCount();
    const progress = getProgress();

    // Calculer les stats par zone
    const zoneStats = {};
    Object.entries(MISSIONS).forEach(([zoneId, zone]) => {
        let done = 0;
        let zoneTotal = 0;
        zone.missions.forEach(m => {
            if (m.frequency !== 'reminder') {
                zoneTotal++;
                if (!isMissionDue(m)) done++;
            }
        });
        zoneStats[zoneId] = { name: zone.name, done, total: zoneTotal };
    });

    // Jours parfaits
    const perfectDays = state.perfectDays?.length || 0;

    // Badges débloqués
    const badgesUnlocked = Object.values(state.achievements || {}).filter(v => v).length +
        BADGES.filter(b => progress >= b.threshold).length;

    content.innerHTML = `
        <div class="stat-card">
            <div class="stat-card-value">${state.totalPoints}</div>
            <div class="stat-card-label">Points totaux</div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-card-value">${completed}/${total}</div>
                <div class="stat-card-label">Missions aujourd'hui</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-value">${progress}%</div>
                <div class="stat-card-label">Progression</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-value">${perfectDays}</div>
                <div class="stat-card-label">Jours parfaits</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-value">${badgesUnlocked}</div>
                <div class="stat-card-label">Badges</div>
            </div>
        </div>

        <h3 style="margin: 1rem 0 0.5rem; color: var(--pink-dark);">Progression par zone</h3>
        <div class="zone-stats">
            ${Object.entries(zoneStats).map(([id, z]) => `
                <div class="zone-stat-item">
                    <span class="zone-stat-name">${z.name}</span>
                    <div class="zone-stat-bar">
                        <div class="zone-stat-fill" style="width: ${z.total > 0 ? (z.done / z.total * 100) : 100}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    panel.classList.add('active');
}

function closeStatsPanel() {
    document.getElementById('stats-panel').classList.remove('active');
}

// ========== PHOTO HELP ==========
const PHOTO_HINTS = {
    k1: { title: 'Appareils électriques', desc: 'Ne pas utiliser le four, le micro-ondes et la bouilloire en même temps !' },
    k2: { title: 'Plaque de cuisson', desc: 'La plaque est en vitrocéramique. Soulever les casseroles au lieu de les traîner.' },
    l1: { title: 'Produits de lessive', desc: 'Sous l\'évier de la cuisine : lessive, Calgon, lingettes anti-décoloration.' },
    l4: { title: 'Pastille Calgon', desc: 'Mettre une pastille Calgon dans le tambour pour éviter le calcaire.' },
    g1: { title: 'Poubelle verre', desc: 'Derrière la porte de la cuisine, le bac vert.' },
    g2: { title: 'Poubelle plastique', desc: 'Derrière la porte de la cuisine. RINCER les emballages !' },
    g3: { title: 'Bac à compost', desc: 'Sur le plan de travail ou sous l\'évier. Pour les déchets alimentaires.' },
    g6: { title: 'Balais', desc: 'Derrière la porte de la cuisine.' }
};

function showPhotoHelp(missionId) {
    const hint = PHOTO_HINTS[missionId];
    if (!hint) return;

    const modal = document.getElementById('photo-modal');
    document.getElementById('photo-title').textContent = hint.title;
    document.getElementById('photo-desc').textContent = hint.desc;

    modal.classList.add('active');
}

function closePhotoModal() {
    document.getElementById('photo-modal').classList.remove('active');
}

// ========== CUSTOM TASKS ==========
function showCustomTasks() {
    const section = document.getElementById('custom-tasks-section');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
    renderCustomTasks();
}

function renderCustomTasks() {
    const list = document.getElementById('custom-tasks-list');
    const tasks = state.customTasks || [];

    if (tasks.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #888; font-size: 0.8rem; padding: 0.5rem;">Aucune tâche personnalisée</p>';
        return;
    }

    list.innerHTML = tasks.map((task, i) => `
        <div class="custom-task-item ${task.completed ? 'completed' : ''}" data-index="${i}">
            <div class="custom-task-checkbox" onclick="toggleCustomTask(${i})">${task.completed ? '✓' : ''}</div>
            <span>${task.text}</span>
            <button class="custom-task-delete" onclick="deleteCustomTask(${i})">✕</button>
        </div>
    `).join('');
}

function addCustomTask() {
    const input = document.getElementById('custom-task-input');
    const text = input.value.trim();

    if (!text) return;

    if (!state.customTasks) state.customTasks = [];
    state.customTasks.push({ text, completed: false });
    saveState();

    input.value = '';
    renderCustomTasks();
    playCompletionSound();
}

function toggleCustomTask(index) {
    if (!state.customTasks || !state.customTasks[index]) return;

    state.customTasks[index].completed = !state.customTasks[index].completed;
    saveState();
    renderCustomTasks();

    if (state.customTasks[index].completed) {
        playCompletionSound();
        showToast('✅ Tâche terminée !');
    }
}

function deleteCustomTask(index) {
    if (!state.customTasks) return;

    state.customTasks.splice(index, 1);
    saveState();
    renderCustomTasks();
}

// Demander la permission pour les notifications
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// ========== REMINDERS SIDEBAR ==========
function getAllReminders() {
    const reminders = [];
    Object.entries(MISSIONS).forEach(([zoneId, zone]) => {
        zone.missions.forEach(mission => {
            if (mission.frequency === 'reminder') {
                reminders.push({
                    mission,
                    zoneName: zone.name.replace(/\s*[^\w\s].*/g, '').trim()
                });
            }
        });
    });
    return reminders;
}

function updateRemindersSidebar() {
    const list = document.getElementById('reminders-list');
    const reminders = getAllReminders();

    list.innerHTML = reminders.map(({ mission, zoneName }) => `
        <div class="reminder-item" title="${mission.desc}">
            <span class="reminder-icon">⚠️</span>
            <span class="reminder-text">${mission.title}</span>
        </div>
    `).join('');
}

function toggleRemindersSidebar() {
    const sidebar = document.getElementById('reminders-sidebar');
    sidebar.classList.toggle('open');

    // Sauvegarder l'état
    localStorage.setItem('dreamhouse_reminders_open', sidebar.classList.contains('open'));
}

function loadRemindersSidebarState() {
    const isOpen = localStorage.getItem('dreamhouse_reminders_open') === 'true';
    if (isOpen) {
        document.getElementById('reminders-sidebar').classList.add('open');
    }
}

// Initialisation
loadState();
loadDarkMode();
updatePriorities();
updateAchievementBadges();
restoreTimer();
requestNotificationPermission();
updateRemindersSidebar();
loadRemindersSidebarState();
