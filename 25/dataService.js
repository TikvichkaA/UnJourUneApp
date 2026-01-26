// ===== SERVICE DE DONNÉES TS COMPAGNON =====
// Gère la connexion Supabase avec fallback sur données démo

const DataService = {
    // Client Supabase (initialisé si mode supabase)
    supabase: null,

    // Cache local des données
    cache: {
        femmesIsolees: null,
        familles: null,
        ts: null,
        lastFetch: null
    },

    // Durée de validité du cache (5 min)
    cacheDuration: 5 * 60 * 1000,

    // ===== INITIALISATION =====
    async init() {
        if (CONFIG.dataMode === 'supabase' && CONFIG.supabase.url && CONFIG.supabase.anonKey) {
            try {
                await this.initSupabase();
                console.log('[DataService] Mode Supabase activé');
                return true;
            } catch (e) {
                console.error('[DataService] Erreur init Supabase, fallback démo:', e);
                CONFIG.dataMode = 'demo';
            }
        }

        console.log('[DataService] Mode démo activé');
        return false;
    },

    async initSupabase() {
        // Charger le client Supabase dynamiquement
        if (typeof supabase === 'undefined') {
            // Le client n'est pas chargé, on va le charger
            await this.loadSupabaseClient();
        }

        this.supabase = supabase.createClient(
            CONFIG.supabase.url,
            CONFIG.supabase.anonKey
        );

        // Test de connexion
        const { error } = await this.supabase.from(CONFIG.supabase.tables.femmesIsolees).select('count', { count: 'exact', head: true });
        if (error) throw error;
    },

    loadSupabaseClient() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Impossible de charger le client Supabase'));
            document.head.appendChild(script);
        });
    },

    // ===== MÉTHODES DE LECTURE =====

    // Obtenir la liste des TS
    async getTS() {
        if (CONFIG.dataMode === 'demo') {
            return HEBERGEES.ts;
        }

        if (this.cache.ts && !this.isCacheExpired()) {
            return this.cache.ts;
        }

        try {
            const { data, error } = await this.supabase
                .from(CONFIG.supabase.tables.ts)
                .select('nom')
                .order('nom');

            if (error) throw error;

            this.cache.ts = data.map(t => t.nom);
            return this.cache.ts;
        } catch (e) {
            console.error('[DataService] Erreur getTS:', e);
            return HEBERGEES.ts; // Fallback
        }
    },

    // Obtenir toutes les hébergées
    async getAll() {
        if (CONFIG.dataMode === 'demo') {
            return HEBERGEES.getAll();
        }

        const [femmesIsolees, familles] = await Promise.all([
            this.getFemmesIsolees(),
            this.getFamilles()
        ]);

        return [...femmesIsolees, ...familles];
    },

    // Obtenir les femmes isolées
    async getFemmesIsolees() {
        if (CONFIG.dataMode === 'demo') {
            return HEBERGEES.femmesIsolees;
        }

        if (this.cache.femmesIsolees && !this.isCacheExpired()) {
            return this.cache.femmesIsolees;
        }

        try {
            const { data, error } = await this.supabase
                .from(CONFIG.supabase.tables.femmesIsolees)
                .select('*')
                .order('chambre');

            if (error) throw error;

            // Transformer les données pour correspondre au format attendu
            this.cache.femmesIsolees = data.map(p => this.transformFromDB(p, 'femme_isolee'));
            this.cache.lastFetch = Date.now();

            return this.cache.femmesIsolees;
        } catch (e) {
            console.error('[DataService] Erreur getFemmesIsolees:', e);
            return HEBERGEES.femmesIsolees; // Fallback
        }
    },

    // Obtenir les familles
    async getFamilles() {
        if (CONFIG.dataMode === 'demo') {
            return HEBERGEES.familles;
        }

        if (this.cache.familles && !this.isCacheExpired()) {
            return this.cache.familles;
        }

        try {
            const { data, error } = await this.supabase
                .from(CONFIG.supabase.tables.familles)
                .select('*')
                .order('chambre');

            if (error) throw error;

            this.cache.familles = data.map(p => this.transformFromDB(p, 'famille'));
            this.cache.lastFetch = Date.now();

            return this.cache.familles;
        } catch (e) {
            console.error('[DataService] Erreur getFamilles:', e);
            return HEBERGEES.familles; // Fallback
        }
    },

    // Obtenir les suivis d'une TS
    async getByTS(tsName) {
        if (CONFIG.dataMode === 'demo') {
            return HEBERGEES.getByTS(tsName);
        }

        const all = await this.getAll();
        return all.filter(p => p.tsReferente === tsName);
    },

    // Obtenir un hébergé par ID
    async getById(id) {
        if (CONFIG.dataMode === 'demo') {
            return HEBERGEES.getById(id);
        }

        const all = await this.getAll();
        return all.find(p => p.id === id);
    },

    // ===== MÉTHODES D'ÉCRITURE (préparées pour plus tard) =====

    // Mettre à jour une personne
    async updatePerson(id, updates) {
        if (CONFIG.dataMode === 'demo') {
            console.warn('[DataService] Mode démo - pas de sauvegarde réelle');
            // Mettre à jour localement pour la session
            const person = HEBERGEES.getById(id);
            if (person) {
                Object.assign(person, updates);
            }
            return { success: true, demo: true };
        }

        try {
            const isFemmeIsolee = id.startsWith('fi-');
            const table = isFemmeIsolee
                ? CONFIG.supabase.tables.femmesIsolees
                : CONFIG.supabase.tables.familles;

            const dbUpdates = this.transformToDB(updates);

            const { data, error } = await this.supabase
                .from(table)
                .update(dbUpdates)
                .eq('id', this.extractDBId(id))
                .select()
                .single();

            if (error) throw error;

            // Invalider le cache
            this.invalidateCache();

            return { success: true, data };
        } catch (e) {
            console.error('[DataService] Erreur updatePerson:', e);
            return { success: false, error: e.message };
        }
    },

    // Ajouter une note à une personne
    async addNote(personId, note) {
        if (CONFIG.dataMode === 'demo') {
            console.warn('[DataService] Mode démo - note stockée localement uniquement');
            return { success: true, demo: true };
        }

        // À implémenter avec une table notes séparée si besoin
        return this.updatePerson(personId, { notes: note });
    },

    // ===== UTILITAIRES =====

    isCacheExpired() {
        if (!this.cache.lastFetch) return true;
        return Date.now() - this.cache.lastFetch > this.cacheDuration;
    },

    invalidateCache() {
        this.cache.femmesIsolees = null;
        this.cache.familles = null;
        this.cache.lastFetch = null;
    },

    // Transformer les données de la DB vers le format app
    transformFromDB(data, type) {
        // Mapping des noms de colonnes DB -> App
        // Adapter selon le schéma réel de la base
        return {
            id: type === 'femme_isolee' ? `fi-${data.id}` : `fam-${data.id}`,
            type: type,
            chambre: data.chambre,
            tsReferente: data.ts_referente || data.tsReferente,
            nom: data.nom,
            prenom: data.prenom,
            dateNaissance: data.date_naissance || data.dateNaissance,
            age: data.age || this.calculateAge(data.date_naissance || data.dateNaissance),
            nationalite: data.nationalite,
            telephone: data.telephone,
            email: data.email,
            statut: data.statut,
            assuranceMaladie: data.assurance_maladie || data.assuranceMaladie,
            dateArrivee: data.date_arrivee || data.dateArrivee,
            aideAlimentaire: data.aide_alimentaire || data.aideAlimentaire,
            montantAide: data.montant_aide || data.montantAide || 0,
            emploi: data.emploi,
            compteBancaire: data.compte_bancaire || data.compteBancaire,
            enfants: data.enfants ? (typeof data.enfants === 'string' ? JSON.parse(data.enfants) : data.enfants) : [],
            notes: data.notes || ''
        };
    },

    // Transformer les données de l'app vers le format DB
    transformToDB(data) {
        const dbData = {};

        const mapping = {
            tsReferente: 'ts_referente',
            dateNaissance: 'date_naissance',
            assuranceMaladie: 'assurance_maladie',
            dateArrivee: 'date_arrivee',
            aideAlimentaire: 'aide_alimentaire',
            montantAide: 'montant_aide',
            compteBancaire: 'compte_bancaire'
        };

        for (const [key, value] of Object.entries(data)) {
            const dbKey = mapping[key] || key;
            dbData[dbKey] = value;
        }

        return dbData;
    },

    extractDBId(id) {
        // Extraire l'ID numérique de "fi-1" ou "fam-2"
        return parseInt(id.split('-')[1]);
    },

    calculateAge(dateNaissance) {
        if (!dateNaissance) return null;
        const birth = new Date(dateNaissance);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    },

    // ===== SYNC =====

    async sync() {
        if (CONFIG.dataMode === 'demo') {
            console.log('[DataService] Mode démo - pas de sync');
            return;
        }

        console.log('[DataService] Synchronisation...');
        this.invalidateCache();

        // Recharger toutes les données
        await this.getAll();

        CONFIG.sync.lastSync = new Date().toISOString();
        localStorage.setItem('ts_last_sync', CONFIG.sync.lastSync);

        console.log('[DataService] Sync terminée');
    },

    // Démarrer la sync automatique
    startAutoSync() {
        if (!CONFIG.sync.autoSync || CONFIG.dataMode === 'demo') return;

        setInterval(() => {
            this.sync();
        }, CONFIG.sync.interval);

        console.log(`[DataService] Auto-sync activée (${CONFIG.sync.interval / 1000}s)`);
    }
};

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', async () => {
    await DataService.init();

    if (CONFIG.sync.autoSync) {
        DataService.startAutoSync();
    }
});
