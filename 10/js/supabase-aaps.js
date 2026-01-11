/**
 * SubVeille - Module Gestion AAP Sauvegardes
 */

const SavedAaps = (function() {
  'use strict';

  // Cache local des AAP sauvegardes
  let savedAapsCache = new Map();
  let cacheLoaded = false;

  /**
   * Charge tous les AAP sauvegardes de l'utilisateur
   */
  async function loadAll() {
    const user = Auth.getUser();
    if (!user) {
      savedAapsCache.clear();
      cacheLoaded = false;
      return [];
    }

    const { data, error } = await supabaseClient
      .from('saved_aaps')
      .select('*')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });

    if (error) {
      console.error('[SavedAaps] Erreur chargement:', error);
      return [];
    }

    // Mettre en cache
    savedAapsCache.clear();
    data.forEach(item => {
      savedAapsCache.set(item.aap_id, item);
    });
    cacheLoaded = true;

    return data;
  }

  /**
   * Sauvegarde un AAP
   */
  async function save(aapData) {
    const user = Auth.getUser();
    if (!user) throw new Error('Non connecte');

    const record = {
      user_id: user.id,
      aap_id: aapData.id,
      aap_data: aapData,
      status: 'saved',
      deadline_alert: true
    };

    const { data, error } = await supabaseClient
      .from('saved_aaps')
      .upsert(record, { onConflict: 'user_id,aap_id' })
      .select()
      .single();

    if (error) throw error;

    // Mettre a jour le cache
    savedAapsCache.set(aapData.id, data);

    return data;
  }

  /**
   * Supprime un AAP sauvegarde
   */
  async function remove(aapId) {
    const user = Auth.getUser();
    if (!user) throw new Error('Non connecte');

    const { error } = await supabaseClient
      .from('saved_aaps')
      .delete()
      .eq('user_id', user.id)
      .eq('aap_id', aapId);

    if (error) throw error;

    // Mettre a jour le cache
    savedAapsCache.delete(aapId);
  }

  /**
   * Met a jour le statut d'un AAP
   */
  async function updateStatus(aapId, status) {
    const user = Auth.getUser();
    if (!user) throw new Error('Non connecte');

    const updates = {
      status,
      updated_at: new Date().toISOString()
    };

    // Si on passe a "applied", enregistrer la date
    if (status === 'applied') {
      updates.applied_at = new Date().toISOString();
    }

    const { data, error } = await supabaseClient
      .from('saved_aaps')
      .update(updates)
      .eq('user_id', user.id)
      .eq('aap_id', aapId)
      .select()
      .single();

    if (error) throw error;

    // Mettre a jour le cache
    if (savedAapsCache.has(aapId)) {
      savedAapsCache.set(aapId, data);
    }

    return data;
  }

  /**
   * Met a jour les notes d'un AAP
   */
  async function updateNotes(aapId, notes) {
    const user = Auth.getUser();
    if (!user) throw new Error('Non connecte');

    const { data, error } = await supabaseClient
      .from('saved_aaps')
      .update({ notes })
      .eq('user_id', user.id)
      .eq('aap_id', aapId)
      .select()
      .single();

    if (error) throw error;

    // Mettre a jour le cache
    if (savedAapsCache.has(aapId)) {
      savedAapsCache.set(aapId, data);
    }

    return data;
  }

  /**
   * Toggle l'alerte deadline
   */
  async function toggleDeadlineAlert(aapId) {
    const user = Auth.getUser();
    if (!user) throw new Error('Non connecte');

    const current = savedAapsCache.get(aapId);
    const newValue = !(current?.deadline_alert ?? true);

    const { data, error } = await supabaseClient
      .from('saved_aaps')
      .update({ deadline_alert: newValue })
      .eq('user_id', user.id)
      .eq('aap_id', aapId)
      .select()
      .single();

    if (error) throw error;

    savedAapsCache.set(aapId, data);
    return data;
  }

  /**
   * Verifie si un AAP est sauvegarde
   */
  function isSaved(aapId) {
    return savedAapsCache.has(aapId);
  }

  /**
   * Recupere un AAP sauvegarde depuis le cache
   */
  function get(aapId) {
    return savedAapsCache.get(aapId);
  }

  /**
   * Recupere tous les AAP du cache
   */
  function getAll() {
    return Array.from(savedAapsCache.values());
  }

  /**
   * Recupere les AAP avec deadline proche (< 7 jours)
   */
  function getUrgentDeadlines() {
    const now = new Date();
    const urgent = [];

    savedAapsCache.forEach(item => {
      if (!item.deadline_alert) return;
      if (item.status === 'applied' || item.status === 'accepted' || item.status === 'rejected') return;

      const deadline = item.aap_data?.dateCloture;
      if (!deadline) return;

      const daysLeft = Math.ceil((new Date(deadline) - now) / (1000 * 60 * 60 * 24));
      if (daysLeft > 0 && daysLeft <= 7) {
        urgent.push({ ...item, daysLeft });
      }
    });

    return urgent.sort((a, b) => a.daysLeft - b.daysLeft);
  }

  /**
   * Recupere les stats
   */
  function getStats() {
    const all = getAll();
    return {
      total: all.length,
      saved: all.filter(a => a.status === 'saved').length,
      applied: all.filter(a => a.status === 'applied').length,
      accepted: all.filter(a => a.status === 'accepted').length,
      rejected: all.filter(a => a.status === 'rejected').length
    };
  }

  /**
   * Verifie si le cache est charge
   */
  function isLoaded() {
    return cacheLoaded;
  }

  return {
    loadAll,
    save,
    remove,
    updateStatus,
    updateNotes,
    toggleDeadlineAlert,
    isSaved,
    get,
    getAll,
    getUrgentDeadlines,
    getStats,
    isLoaded
  };
})();
