/**
 * ReVie - Application d'économie circulaire
 * Données ADEME "Longue vie aux objets" + Assistant IA OpenAI
 */

// ========================================
// Configuration
// ========================================
const CONFIG = {
    // API ADEME - Dataset "Longue vie aux objets"
    API_BASE: 'https://data.ademe.fr/data-fair/api/v1/datasets/longue-vie-aux-objets-acteurs-de-leconomie-circulaire',

    // API Chat (backend local)
    CHAT_API: '/api/chat',

    // Limites de requêtes
    DEFAULT_LIMIT: 100,
    MAX_LIMIT: 500,

    // Position par défaut (Paris)
    DEFAULT_LAT: 48.8566,
    DEFAULT_LNG: 2.3522,
    DEFAULT_ZOOM: 12,

    // Distance par défaut en km
    DEFAULT_DISTANCE: 20,

    // Mapping des types d'actions
    ACTION_TYPES: {
        'reparer': ['réparer', 'réparation', 'repair café', 'atelier réparation'],
        'donner': ['donner', 'don', 'dons', 'collecte', 'dépôt'],
        'recycler': ['recycler', 'recyclage', 'déchetterie', 'collecte', 'tri'],
        'acheter': ['achat', 'vente', 'occasion', 'seconde main', 'revente', 'boutique solidaire']
    },

    // Mapping des types d'objets vers les colonnes ADEME
    OBJECT_MAPPING: {
        'electromenager': ['gros_electromenager', 'petit_electromenager', 'électroménager'],
        'textile': ['textile', 'vêtements', 'chaussures', 'linge'],
        'mobilier': ['mobilier', 'meubles', 'ameublement'],
        'velo': ['vélos', 'cycle', 'vélo'],
        'numerique': ['equipements_informatiques', 'téléphones', 'tablettes', 'ordinateurs', 'électronique']
    },

    // Icônes par type d'action
    ACTION_ICONS: {
        'reparer': { icon: '🔧', class: 'repair', color: '#3b82f6' },
        'donner': { icon: '🎁', class: 'donate', color: '#f59e0b' },
        'recycler': { icon: '♻️', class: 'recycle', color: '#10b981' },
        'acheter': { icon: '🛒', class: 'buy', color: '#8b5cf6' }
    }
};

// ========================================
// State
// ========================================
const state = {
    map: null,
    markers: null,
    userLocation: null,
    userLocationName: null,
    currentFilters: {
        action: 'all',
        object: 'all',
        distance: CONFIG.DEFAULT_DISTANCE
    },
    actors: [],
    selectedActor: null,
    chatHistory: [],
    isTyping: false
};

// ========================================
// DOM Elements
// ========================================
const DOM = {
    map: null,
    assistantPanel: null,
    detailsPanel: null,
    chatMessages: null,
    chatInput: null,
    chatSendBtn: null,
    locationInput: null,
    resultsCount: null,
    listCount: null,
    resultsList: null,
    loadingOverlay: null,
    toastContainer: null
};

// ========================================
// Initialization
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initDOM();
    initMap();
    initEventListeners();
    requestGeolocation();
});

function initDOM() {
    DOM.map = document.getElementById('map');
    DOM.assistantPanel = document.getElementById('assistant-panel');
    DOM.detailsPanel = document.getElementById('details-panel');
    DOM.chatMessages = document.getElementById('chat-messages');
    DOM.chatInput = document.getElementById('chat-input');
    DOM.chatSendBtn = document.getElementById('chat-send-btn');
    DOM.locationInput = document.getElementById('location-input');
    DOM.resultsCount = document.getElementById('results-count');
    DOM.listCount = document.getElementById('list-count');
    DOM.resultsList = document.getElementById('results-list');
    DOM.loadingOverlay = document.getElementById('loading-overlay');
    DOM.toastContainer = document.getElementById('toast-container');
}

// ========================================
// Map Functions
// ========================================
function initMap() {
    // Créer la carte
    state.map = L.map('map', {
        center: [CONFIG.DEFAULT_LAT, CONFIG.DEFAULT_LNG],
        zoom: CONFIG.DEFAULT_ZOOM,
        zoomControl: false
    });

    // Ajouter le fond de carte (CartoDB Positron pour un look épuré)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19
    }).addTo(state.map);

    // Créer le groupe de marqueurs avec clustering
    state.markers = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        iconCreateFunction: function(cluster) {
            const count = cluster.getChildCount();
            let size = 'small';
            if (count > 50) size = 'large';
            else if (count > 10) size = 'medium';

            return L.divIcon({
                html: `<div>${count}</div>`,
                className: `marker-cluster marker-cluster-${size}`,
                iconSize: L.point(40, 40)
            });
        }
    });

    state.map.addLayer(state.markers);
}

function createMarkerIcon(actionType) {
    const config = CONFIG.ACTION_ICONS[actionType] || CONFIG.ACTION_ICONS['reparer'];
    return L.divIcon({
        html: `<div class="custom-marker ${config.class}"><span>${config.icon}</span></div>`,
        className: 'marker-wrapper',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });
}

function addMarkersToMap(actors) {
    state.markers.clearLayers();

    actors.forEach(actor => {
        if (!actor.latitude || !actor.longitude) return;

        const actionType = detectActionType(actor);
        const marker = L.marker([actor.latitude, actor.longitude], {
            icon: createMarkerIcon(actionType)
        });

        marker.on('click', () => showActorDetails(actor));

        // Popup simple au survol
        const popupContent = `
            <strong>${actor.nom_de_lorganisme || actor.nom_commercial || 'Acteur'}</strong><br>
            <small>${actor.adresse || ''}</small>
        `;
        marker.bindPopup(popupContent);

        state.markers.addLayer(marker);
    });

    updateResultsCount(actors.length);
    updateResultsList(actors);
}

function centerMapOnUser() {
    if (state.userLocation) {
        state.map.setView([state.userLocation.lat, state.userLocation.lng], 14);
    }
}

// ========================================
// API Functions
// ========================================
async function fetchActors(params = {}) {
    showLoading(true);

    try {
        const queryParams = new URLSearchParams({
            size: params.limit || CONFIG.DEFAULT_LIMIT,
            ...buildApiFilters(params)
        });

        // Ajouter le filtre géographique si la position est définie
        if (state.userLocation && state.currentFilters.distance) {
            queryParams.set('geo_distance', `${state.userLocation.lng},${state.userLocation.lat},${state.currentFilters.distance}km`);
        }

        const url = `${CONFIG.API_BASE}/lines?${queryParams.toString()}`;
        console.log('Chargement:', url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        state.actors = data.results || [];

        // Calculer les distances
        if (state.userLocation) {
            state.actors = state.actors.map(actor => ({
                ...actor,
                distance: calculateDistance(
                    state.userLocation.lat,
                    state.userLocation.lng,
                    actor.latitude,
                    actor.longitude
                )
            })).sort((a, b) => (a.distance || 999) - (b.distance || 999));
        }

        addMarkersToMap(state.actors);

        return state.actors;

    } catch (error) {
        console.error('Erreur lors du chargement des acteurs:', error);
        showToast('Erreur lors du chargement des données', 'error');
        return [];
    } finally {
        showLoading(false);
    }
}

function buildApiFilters(params) {
    const filters = {};

    // Filtrer par type d'action
    if (state.currentFilters.action && state.currentFilters.action !== 'all') {
        const actionKeywords = CONFIG.ACTION_TYPES[state.currentFilters.action];
        if (actionKeywords) {
            filters.q = actionKeywords[0];
        }
    }

    // Filtrer par type d'objet
    if (state.currentFilters.object && state.currentFilters.object !== 'all') {
        const objectFields = CONFIG.OBJECT_MAPPING[state.currentFilters.object];
        if (objectFields) {
            filters.q_fields = 'produits_acceptes,sous_categories';
            if (!filters.q) {
                filters.q = objectFields[0];
            } else {
                filters.q += ' ' + objectFields[0];
            }
        }
    }

    return filters;
}

async function searchByLocation(query) {
    // Utiliser Nominatim pour le géocodage
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)},France&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
            const result = data[0];
            state.userLocation = {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon)
            };
            state.userLocationName = result.display_name.split(',')[0];
            state.map.setView([state.userLocation.lat, state.userLocation.lng], 13);
            await fetchActors();
            showToast(`Position : ${state.userLocationName}`, 'success');
        } else {
            showToast('Lieu non trouvé', 'warning');
        }
    } catch (error) {
        console.error('Erreur de géocodage:', error);
        showToast('Erreur de géolocalisation', 'error');
    }
}

// ========================================
// Geolocation
// ========================================
function requestGeolocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                state.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                state.map.setView([state.userLocation.lat, state.userLocation.lng], 13);

                // Ajouter le marqueur utilisateur
                addUserMarker();

                // Géocodage inverse pour obtenir le nom de la ville
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
                    );
                    const data = await response.json();
                    state.userLocationName = data.address?.city || data.address?.town || data.address?.village || 'votre position';
                } catch (e) {
                    state.userLocationName = 'votre position';
                }

                // Charger les acteurs à proximité
                fetchActors();
            },
            (error) => {
                console.log('Géolocalisation refusée ou indisponible');
                // Utiliser la position par défaut
                fetchActors();
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    } else {
        fetchActors();
    }
}

function addUserMarker() {
    if (!state.userLocation) return;

    const userIcon = L.divIcon({
        html: `<div class="user-marker">
            <div class="user-marker-dot"></div>
            <div class="user-marker-pulse"></div>
        </div>`,
        className: 'user-marker-wrapper',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    L.marker([state.userLocation.lat, state.userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000
    }).addTo(state.map);
}

// ========================================
// Event Listeners
// ========================================
function initEventListeners() {
    // Toggle panneau assistant (mobile)
    document.getElementById('mobile-assistant-btn')?.addEventListener('click', () => {
        DOM.assistantPanel.classList.add('open');
    });

    document.getElementById('panel-toggle')?.addEventListener('click', () => {
        DOM.assistantPanel.classList.remove('open');
    });

    // Fermeture panneau détails
    document.getElementById('details-close')?.addEventListener('click', () => {
        DOM.detailsPanel.classList.remove('open');
    });

    // Contrôles de la carte
    document.getElementById('zoom-in')?.addEventListener('click', () => {
        state.map.zoomIn();
    });

    document.getElementById('zoom-out')?.addEventListener('click', () => {
        state.map.zoomOut();
    });

    document.getElementById('center-map')?.addEventListener('click', centerMapOnUser);

    // Bouton de géolocalisation
    document.getElementById('geolocate-btn')?.addEventListener('click', () => {
        requestGeolocation();
    });

    // Saisie de localisation
    DOM.locationInput?.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const query = DOM.locationInput.value.trim();
            if (query) {
                await searchByLocation(query);
            }
        }
    });

    // Formulaire de chat IA
    document.getElementById('chat-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = DOM.chatInput.value.trim();
        if (message && !state.isTyping) {
            await sendChatMessage(message);
        }
    });

    // Boutons d'actions rapides
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action) handleQuickAction(action);
        });
    });

    // Filtres par action
    document.querySelectorAll('#action-filters .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('#action-filters .chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.currentFilters.action = chip.dataset.filter;
            fetchActors();
        });
    });

    // Filtres par objet
    document.querySelectorAll('#object-filters .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('#object-filters .chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.currentFilters.object = chip.dataset.filter;
            fetchActors();
        });
    });

    // Slider de distance
    const distanceSlider = document.getElementById('distance-slider');
    const distanceValue = document.getElementById('distance-value');

    distanceSlider?.addEventListener('input', (e) => {
        distanceValue.textContent = e.target.value;
    });

    distanceSlider?.addEventListener('change', (e) => {
        state.currentFilters.distance = parseInt(e.target.value);
        fetchActors();
    });

    // Toggle liste de résultats (mobile)
    const resultsContainer = document.getElementById('results-list-container');
    document.querySelector('.results-header')?.addEventListener('click', () => {
        resultsContainer.classList.toggle('expanded');
    });

    document.getElementById('toggle-view')?.addEventListener('click', (e) => {
        e.stopPropagation();
        resultsContainer.classList.remove('expanded');
    });
}

// ========================================
// Chat IA Functions
// ========================================
async function sendChatMessage(message) {
    if (state.isTyping) return;

    // Ajouter le message utilisateur
    addChatMessage(message, 'user');
    DOM.chatInput.value = '';

    // Ajouter à l'historique
    state.chatHistory.push({ role: 'user', content: message });

    // Afficher l'indicateur de frappe
    showTypingIndicator();

    try {
        const response = await fetch(CONFIG.CHAT_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                context: {
                    location: state.userLocationName,
                    distance: state.currentFilters.distance,
                    filters: state.currentFilters,
                    history: state.chatHistory.slice(-6)
                }
            })
        });

        const data = await response.json();

        // Masquer l'indicateur
        hideTypingIndicator();

        // Ajouter la réponse du bot
        addChatMessage(data.reply, 'bot');

        // Ajouter à l'historique
        state.chatHistory.push({ role: 'assistant', content: data.reply });

        // Appliquer les filtres suggérés si présents
        if (data.suggestedAction) {
            if (data.suggestedAction.action) {
                state.currentFilters.action = data.suggestedAction.action;
                document.querySelectorAll('#action-filters .chip').forEach(chip => {
                    chip.classList.toggle('active', chip.dataset.filter === data.suggestedAction.action);
                });
            }
            if (data.suggestedAction.object) {
                state.currentFilters.object = data.suggestedAction.object;
                document.querySelectorAll('#object-filters .chip').forEach(chip => {
                    chip.classList.toggle('active', chip.dataset.filter === data.suggestedAction.object);
                });
            }
            // Mettre à jour la carte
            fetchActors();
        }

    } catch (error) {
        console.error('Erreur chat:', error);
        hideTypingIndicator();
        addChatMessage("Désolé, je rencontre un problème technique. Utilisez les boutons ci-dessus pour naviguer ! 🔧", 'bot');
    }
}

function handleQuickAction(action) {
    state.currentFilters.action = action;

    // Activer le filtre correspondant
    document.querySelectorAll('#action-filters .chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filter === action);
    });

    // Envoyer un message au chatbot
    const messages = {
        'reparer': "Je veux réparer un objet",
        'donner': "Je veux donner quelque chose",
        'recycler': "Je veux recycler un objet",
        'acheter': "Je cherche à acheter d'occasion"
    };

    sendChatMessage(messages[action] || `Je veux ${action}`);
}

function addChatMessage(content, type) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${type}`;
    bubble.innerHTML = `<p>${content}</p>`;

    DOM.chatMessages.appendChild(bubble);
    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}

function showTypingIndicator() {
    state.isTyping = true;
    DOM.chatSendBtn.disabled = true;
    DOM.chatSendBtn.classList.add('loading');

    const indicator = document.createElement('div');
    indicator.className = 'chat-bubble bot typing-bubble';
    indicator.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    indicator.id = 'typing-indicator';

    DOM.chatMessages.appendChild(indicator);
    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    state.isTyping = false;
    DOM.chatSendBtn.disabled = false;
    DOM.chatSendBtn.classList.remove('loading');

    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// ========================================
// Actor Details
// ========================================
function showActorDetails(actor) {
    state.selectedActor = actor;

    const actionType = detectActionType(actor);
    const actionConfig = CONFIG.ACTION_ICONS[actionType] || CONFIG.ACTION_ICONS['reparer'];

    const distance = actor.distance ? `${actor.distance.toFixed(1)} km` : 'Distance inconnue';

    const html = `
        <div class="actor-card">
            <div class="actor-header">
                <span class="actor-type-badge ${actionConfig.class}">${getActionLabel(actionType)}</span>
                <h2 class="actor-name">${actor.nom_de_lorganisme || actor.nom_commercial || 'Acteur'}</h2>
                <p class="actor-distance">À <strong>${distance}</strong> de vous</p>
            </div>

            <div class="actor-info">
                ${actor.adresse ? `
                <div class="info-row">
                    <div class="info-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Adresse</div>
                        <div class="info-value">${actor.adresse}${actor.code_postal ? ', ' + actor.code_postal : ''} ${actor.ville || ''}</div>
                    </div>
                </div>
                ` : ''}

                ${actor.telephone ? `
                <div class="info-row">
                    <div class="info-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Téléphone</div>
                        <div class="info-value"><a href="tel:${actor.telephone}">${actor.telephone}</a></div>
                    </div>
                </div>
                ` : ''}

                ${actor.site_web ? `
                <div class="info-row">
                    <div class="info-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Site web</div>
                        <div class="info-value"><a href="${normalizeUrl(actor.site_web)}" target="_blank" rel="noopener">${actor.site_web}</a></div>
                    </div>
                </div>
                ` : ''}

                ${actor.type_de_structure || actor.type_acteur ? `
                <div class="info-row">
                    <div class="info-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                        </svg>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Type de structure</div>
                        <div class="info-value">${actor.type_de_structure || actor.type_acteur || '-'}</div>
                    </div>
                </div>
                ` : ''}

                ${actor.produits_acceptes || actor.sous_categories ? `
                <div class="info-row">
                    <div class="info-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                            <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Objets acceptés</div>
                        <div class="object-tags">
                            ${formatObjectTags(actor.produits_acceptes || actor.sous_categories)}
                        </div>
                    </div>
                </div>
                ` : ''}

                ${actor.horaires_douverture || actor.horaires_osm ? `
                <div class="info-row">
                    <div class="info-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Horaires</div>
                        <div class="info-value">${actor.horaires_douverture || formatOsmHours(actor.horaires_osm) || '-'}</div>
                    </div>
                </div>
                ` : ''}
            </div>

            <div class="actor-actions">
                ${actor.latitude && actor.longitude ? `
                <a href="https://www.google.com/maps/dir/?api=1&destination=${actor.latitude},${actor.longitude}"
                   target="_blank" rel="noopener" class="action-btn primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                    </svg>
                    Itinéraire
                </a>
                ` : ''}
                ${actor.telephone ? `
                <a href="tel:${actor.telephone}" class="action-btn secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    Appeler
                </a>
                ` : ''}
            </div>

            <div class="source-attribution">
                Source : ADEME - Longue vie aux objets<br>
                ${actor.source ? `Via : ${actor.source}` : ''}
            </div>
        </div>
    `;

    document.getElementById('details-content').innerHTML = html;
    DOM.detailsPanel.classList.add('open');
}

// ========================================
// Results List
// ========================================
function updateResultsList(actors) {
    if (!DOM.resultsList) return;

    if (actors.length === 0) {
        DOM.resultsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h4>Aucun résultat</h4>
                <p>Modifiez vos critères ou élargissez la zone de recherche.</p>
            </div>
        `;
        return;
    }

    const html = actors.slice(0, 50).map(actor => {
        const actionType = detectActionType(actor);
        const actionConfig = CONFIG.ACTION_ICONS[actionType] || CONFIG.ACTION_ICONS['reparer'];
        const distance = actor.distance ? `${actor.distance.toFixed(1)} km` : '';

        return `
            <div class="result-item" data-id="${actor.identifiant_unique || actor._id}">
                <div class="result-icon" style="background: ${actionConfig.color}20; color: ${actionConfig.color}">
                    ${actionConfig.icon}
                </div>
                <div class="result-info">
                    <div class="result-name">${actor.nom_de_lorganisme || actor.nom_commercial || 'Acteur'}</div>
                    <div class="result-type">${actor.type_de_structure || actor.type_acteur || getActionLabel(actionType)}</div>
                    ${distance ? `<div class="result-distance">${distance}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');

    DOM.resultsList.innerHTML = html;

    // Ajouter les listeners de clic
    DOM.resultsList.querySelectorAll('.result-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            const actor = actors[index];
            showActorDetails(actor);

            // Centrer la carte sur l'acteur
            if (actor.latitude && actor.longitude) {
                state.map.setView([actor.latitude, actor.longitude], 15);
            }
        });
    });
}

function updateResultsCount(count) {
    if (DOM.resultsCount) DOM.resultsCount.textContent = count;
    if (DOM.listCount) DOM.listCount.textContent = count;
}

// ========================================
// Helper Functions
// ========================================
function detectActionType(actor) {
    const text = [
        actor.actions,
        actor.type_de_structure,
        actor.type_acteur,
        actor.nom_de_lorganisme,
        actor.nom_commercial
    ].filter(Boolean).join(' ').toLowerCase();

    for (const [action, keywords] of Object.entries(CONFIG.ACTION_TYPES)) {
        if (keywords.some(kw => text.includes(kw))) {
            return action;
        }
    }

    return 'reparer'; // Par défaut
}

function getActionLabel(action) {
    const labels = {
        'reparer': 'réparer',
        'donner': 'donner',
        'recycler': 'recycler',
        'acheter': 'acheter d\'occasion'
    };
    return labels[action] || action;
}

function getObjectLabel(object) {
    const labels = {
        'electromenager': 'électroménager',
        'textile': 'textile / vêtements',
        'mobilier': 'mobilier',
        'velo': 'vélo',
        'numerique': 'numérique / high-tech',
        'all': 'tous types d\'objets'
    };
    return labels[object] || object;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371; // Rayon de la Terre en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(deg) {
    return deg * (Math.PI/180);
}

function normalizeUrl(url) {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return 'https://' + url;
}

function formatObjectTags(text) {
    if (!text) return '';

    // Séparer par délimiteurs communs et créer des tags
    const items = text.split(/[,;|\/]/).map(s => s.trim()).filter(Boolean);
    return items.slice(0, 8).map(item => `<span class="object-tag">${item}</span>`).join('');
}

function formatOsmHours(osmHours) {
    if (!osmHours) return null;
    // Formatage simple des horaires OSM
    return osmHours.replace(/;/g, ', ');
}

// ========================================
// UI Helpers
// ========================================
function showLoading(show) {
    DOM.loadingOverlay?.classList.toggle('visible', show);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    DOM.toastContainer?.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// ========================================
// PWA / Service Worker
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW enregistré'))
            .catch(err => console.log('Échec enregistrement SW:', err));
    });
}

// Ajouter le CSS pour le marqueur utilisateur dynamiquement
const style = document.createElement('style');
style.textContent = `
    .user-marker-wrapper {
        background: transparent !important;
        border: none !important;
    }
    .user-marker {
        position: relative;
        width: 24px;
        height: 24px;
    }
    .user-marker-dot {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 14px;
        height: 14px;
        background: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
        z-index: 2;
    }
    .user-marker-pulse {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        background: rgba(59, 130, 246, 0.2);
        border-radius: 50%;
        animation: userPulse 2s ease-out infinite;
    }
    @keyframes userPulse {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
    }
    .marker-wrapper {
        background: transparent !important;
        border: none !important;
    }
`;
document.head.appendChild(style);
