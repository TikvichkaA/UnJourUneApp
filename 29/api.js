/**
 * Service API pour Supabase
 * Gère le chargement et les contributions au lexique collaboratif
 */

const TranslationsAPI = {
  // Cache local
  _cache: null,
  _cacheTimestamp: 0,

  // Générer un ID de session unique
  _getSessionId() {
    let sessionId = localStorage.getItem('trad-antifa-session');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem('trad-antifa-session', sessionId);
    }
    return sessionId;
  },

  // Headers pour les requêtes Supabase
  _getHeaders() {
    return {
      'apikey': CONFIG.SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  },

  /**
   * Charger les traductions depuis Supabase ou le cache
   */
  async fetchTranslations() {
    // Mode hors ligne : utiliser le dictionnaire local
    if (!CONFIG.ONLINE_MODE) {
      console.log('[API] Mode hors ligne - utilisation du dictionnaire local');
      return typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS : [];
    }

    // Vérifier le cache
    const now = Date.now();
    if (this._cache && (now - this._cacheTimestamp) < CONFIG.CACHE_DURATION) {
      console.log('[API] Utilisation du cache');
      return this._cache;
    }

    try {
      const response = await fetch(
        `${CONFIG.SUPABASE_URL}/rest/v1/translations?is_active=eq.true&select=original,translation,category`,
        { headers: this._getHeaders() }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`[API] ${data.length} traductions chargées depuis Supabase`);

      // Mettre en cache
      this._cache = data;
      this._cacheTimestamp = now;

      // Sauvegarder aussi dans le storage local pour le mode hors ligne
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({
          cachedTranslations: data,
          cacheTimestamp: now
        });
      }

      return data;

    } catch (error) {
      console.error('[API] Erreur de chargement:', error);

      // Fallback : essayer le cache storage
      if (typeof chrome !== 'undefined' && chrome.storage) {
        return new Promise((resolve) => {
          chrome.storage.local.get(['cachedTranslations'], (result) => {
            if (result.cachedTranslations) {
              console.log('[API] Utilisation du cache local de secours');
              resolve(result.cachedTranslations);
            } else {
              // Dernier recours : dictionnaire local
              resolve(typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS : []);
            }
          });
        });
      }

      return typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS : [];
    }
  },

  /**
   * Proposer une nouvelle traduction
   */
  async submitProposal(original, translation, category, justification = '', proposedBy = '') {
    if (!CONFIG.ONLINE_MODE) {
      console.log('[API] Mode hors ligne - proposition non envoyée');
      return { success: false, error: 'Mode hors ligne activé' };
    }

    try {
      const response = await fetch(
        `${CONFIG.SUPABASE_URL}/rest/v1/proposals`,
        {
          method: 'POST',
          headers: this._getHeaders(),
          body: JSON.stringify({
            original: original.toLowerCase().trim(),
            translation: translation.trim(),
            category: category,
            justification: justification.trim(),
            proposed_by: proposedBy.trim() || null
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('[API] Proposition soumise:', data);

      return { success: true, data: data[0] };

    } catch (error) {
      console.error('[API] Erreur de soumission:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Voter pour une traduction
   */
  async vote(translationId, voteType) {
    if (!CONFIG.ONLINE_MODE) {
      return { success: false, error: 'Mode hors ligne activé' };
    }

    const sessionId = this._getSessionId();

    try {
      // Enregistrer le vote
      const response = await fetch(
        `${CONFIG.SUPABASE_URL}/rest/v1/votes`,
        {
          method: 'POST',
          headers: {
            ...this._getHeaders(),
            'Prefer': 'resolution=ignore-duplicates'
          },
          body: JSON.stringify({
            translation_id: translationId,
            session_id: sessionId,
            vote_type: voteType
          })
        }
      );

      if (response.status === 409) {
        return { success: false, error: 'Vous avez déjà voté pour cette traduction' };
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Mettre à jour le compteur de la traduction
      await this._updateVoteCount(translationId, voteType);

      return { success: true };

    } catch (error) {
      console.error('[API] Erreur de vote:', error);
      return { success: false, error: error.message };
    }
  },

  async _updateVoteCount(translationId, voteType) {
    const field = voteType === 'up' ? 'votes_up' : 'votes_down';

    // RPC call pour incrémenter atomiquement
    await fetch(
      `${CONFIG.SUPABASE_URL}/rest/v1/rpc/increment_vote`,
      {
        method: 'POST',
        headers: this._getHeaders(),
        body: JSON.stringify({
          row_id: translationId,
          vote_field: field
        })
      }
    );
  },

  /**
   * Récupérer les statistiques
   */
  async getStats() {
    if (!CONFIG.ONLINE_MODE) {
      return {
        totalTranslations: typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS.length : 0,
        pendingProposals: 0,
        online: false
      };
    }

    try {
      const [transRes, proposalsRes] = await Promise.all([
        fetch(
          `${CONFIG.SUPABASE_URL}/rest/v1/translations?is_active=eq.true&select=id`,
          { headers: this._getHeaders() }
        ),
        fetch(
          `${CONFIG.SUPABASE_URL}/rest/v1/proposals?status=eq.pending&select=id`,
          { headers: this._getHeaders() }
        )
      ]);

      const translations = await transRes.json();
      const proposals = await proposalsRes.json();

      return {
        totalTranslations: translations.length,
        pendingProposals: proposals.length,
        online: true
      };

    } catch (error) {
      console.error('[API] Erreur stats:', error);
      return {
        totalTranslations: typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS.length : 0,
        pendingProposals: 0,
        online: false
      };
    }
  },

  /**
   * Vérifier la connexion à Supabase
   */
  async checkConnection() {
    if (!CONFIG.ONLINE_MODE) {
      return false;
    }

    try {
      const response = await fetch(
        `${CONFIG.SUPABASE_URL}/rest/v1/translations?limit=1`,
        { headers: this._getHeaders() }
      );
      return response.ok;
    } catch {
      return false;
    }
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TranslationsAPI;
}
