/**
 * SubVeille - Service IA Frontend
 * Appels au backend pour les fonctionnalites OpenAI
 */

const AIService = (function() {
  'use strict';

  const API_BASE = 'http://localhost:3010/api/ai';

  // Cache pour eviter les appels redondants
  const cache = new Map();

  /**
   * Appel API generique
   */
  async function apiCall(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur API IA');
      }

      return await response.json();
    } catch (error) {
      console.error('[AIService]', error);
      throw error;
    }
  }

  /**
   * Verifie si le service IA est disponible
   */
  async function isAvailable() {
    try {
      const response = await fetch('http://localhost:3010/api/health');
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Analyse le matching entre le profil et un AAP
   */
  async function analyzeMatch(aap) {
    const profile = Auth.getProfile();
    if (!profile) throw new Error('Profil non disponible');

    const cacheKey = `match-${aap.id}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const result = await apiCall('/match', { profile, aap });
    cache.set(cacheKey, result);
    return result;
  }

  /**
   * Score plusieurs AAP en batch (plus economique)
   */
  async function batchScore(aaps) {
    const profile = Auth.getProfile();
    if (!profile) throw new Error('Profil non disponible');

    return await apiCall('/batch-score', { profile, aaps });
  }

  /**
   * Genere un brouillon de candidature
   */
  async function generateDraft(aap, sections = ['presentation', 'projet', 'objectifs', 'budget']) {
    const profile = Auth.getProfile();
    if (!profile) throw new Error('Profil non disponible');

    return await apiCall('/generate-draft', { profile, aap, sections });
  }

  /**
   * Resume un AAP
   */
  async function summarize(aap) {
    const cacheKey = `summary-${aap.id}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const result = await apiCall('/summarize', { aap });
    cache.set(cacheKey, result);
    return result;
  }

  /**
   * Obtient des suggestions pour ameliorer le profil
   */
  async function getProfileSuggestions() {
    const profile = Auth.getProfile();
    if (!profile) throw new Error('Profil non disponible');

    return await apiCall('/profile-suggestions', { profile });
  }

  /**
   * Obtient les recommandations intelligentes (prefiltre + IA semantique)
   */
  async function getSmartRecommendations(prefilteredAaps) {
    const profile = Auth.getProfile();
    if (!profile) throw new Error('Profil non disponible');

    return await apiCall('/smart-recommendations', { profile, prefilteredAaps });
  }

  /**
   * Vide le cache
   */
  function clearCache() {
    cache.clear();
  }

  return {
    isAvailable,
    analyzeMatch,
    batchScore,
    generateDraft,
    summarize,
    getProfileSuggestions,
    getSmartRecommendations,
    clearCache
  };
})();
