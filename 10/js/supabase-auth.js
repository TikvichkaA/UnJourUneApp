/**
 * SubVeille - Module Authentification
 */

const Auth = (function() {
  'use strict';

  let currentUser = null;
  let currentProfile = null;
  let authChangeCallbacks = [];

  /**
   * Initialise l'auth et ecoute les changements
   */
  async function init() {
    // Recuperer session existante
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
      currentUser = session.user;
      await loadProfile();
    }

    // Ecouter les changements d'auth
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] Event:', event);

      if (session) {
        currentUser = session.user;
        await loadProfile();
      } else {
        currentUser = null;
        currentProfile = null;
      }

      // Notifier les callbacks
      authChangeCallbacks.forEach(cb => cb(currentUser, currentProfile));
    });

    return currentUser;
  }

  /**
   * Inscription
   */
  async function signUp(email, password) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  /**
   * Connexion
   */
  async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  /**
   * Deconnexion
   */
  async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    currentUser = null;
    currentProfile = null;
  }

  /**
   * Recupere l'utilisateur actuel
   */
  function getUser() {
    return currentUser;
  }

  /**
   * Recupere le profil actuel
   */
  function getProfile() {
    return currentProfile;
  }

  /**
   * Charge le profil depuis Supabase
   */
  async function loadProfile() {
    if (!currentUser) return null;

    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[Auth] Erreur chargement profil:', error);
    }

    currentProfile = data;
    return currentProfile;
  }

  /**
   * Met a jour le profil
   */
  async function updateProfile(profileData) {
    if (!currentUser) throw new Error('Non connecte');

    const { data, error } = await supabaseClient
      .from('profiles')
      .upsert({
        id: currentUser.id,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    currentProfile = data;
    return currentProfile;
  }

  /**
   * Enregistre un callback pour les changements d'auth
   */
  function onAuthChange(callback) {
    authChangeCallbacks.push(callback);
    // Appeler immediatement avec l'etat actuel
    callback(currentUser, currentProfile);
  }

  /**
   * Verifie si l'utilisateur est connecte
   */
  function isLoggedIn() {
    return currentUser !== null;
  }

  return {
    init,
    signUp,
    signIn,
    signOut,
    getUser,
    getProfile,
    updateProfile,
    onAuthChange,
    isLoggedIn
  };
})();
