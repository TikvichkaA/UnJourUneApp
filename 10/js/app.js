/**
 * SubTracker - Application principale (SPA Router + Orchestrateur)
 */
var App = (function() {
  'use strict';

  // ---- Constants ----
  var ROUTES = {
    dashboard:    { module: 'DashboardModule',    title: 'Tableau de bord' },
    subventions:  { module: 'SubventionsModule',  title: 'Financements' },
    financeurs:   { module: 'FinanceursModule',   title: 'Financeurs' },
    projects:     { module: 'ProjectsModule',     title: 'Projets' },
    calendar:     { module: 'CalendarViewModule', title: 'Calendrier' },
    discovery:    { module: 'DiscoveryModule',    title: 'Decouvrir AAP' },
    reports:      { module: 'ReportsModule',      title: 'Rapports' },
    tableaux:     { module: 'TableViewModule',    title: 'Tableaux' },
    settings:     { module: 'SettingsModule',     title: 'Parametres' }
  };

  var DEFAULT_ROUTE = 'dashboard';

  // ---- State ----
  var currentRoute = null;
  var isSignUpMode = false;
  var initialized = false;

  // ---- DOM refs ----
  var els = {};

  function cacheElements() {
    els.mainContent = document.getElementById('mainContent');
    els.appLoader = document.getElementById('appLoader');
    els.sidebar = document.getElementById('sidebar');
    els.sidebarToggle = document.getElementById('sidebarToggle');
    els.sidebarOverlay = document.getElementById('sidebarOverlay');
    els.sidebarFooter = document.getElementById('sidebarFooter');
    els.authModal = document.getElementById('authModal');
    els.authModalTitle = document.getElementById('authModalTitle');
    els.authModalClose = document.getElementById('authModalClose');
    els.authForm = document.getElementById('authForm');
    els.authEmail = document.getElementById('authEmail');
    els.authPassword = document.getElementById('authPassword');
    els.authName = document.getElementById('authName');
    els.authNameGroup = document.getElementById('authNameGroup');
    els.authSubmitBtn = document.getElementById('authSubmitBtn');
    els.authToggleText = document.getElementById('authToggleText');
    els.authToggleLink = document.getElementById('authToggleLink');
    els.genericModal = document.getElementById('genericModal');
    els.genericModalContent = document.getElementById('genericModalContent');
    els.toastContainer = document.getElementById('toastContainer');
  }

  // ============================================
  //  Router
  // ============================================

  function getRouteFromHash() {
    var hash = window.location.hash.replace('#', '').split('/');
    return { route: hash[0] || DEFAULT_ROUTE, params: hash.slice(1) };
  }

  function navigate(route, params) {
    var hash = '#' + route;
    if (params && params.length) hash += '/' + params.join('/');
    window.location.hash = hash;
  }

  function handleRouteChange() {
    if (!Auth.isLoggedIn()) {
      showAuthModal();
      return;
    }

    var parsed = getRouteFromHash();
    var routeName = parsed.route;
    var params = parsed.params;

    if (!ROUTES[routeName]) {
      routeName = DEFAULT_ROUTE;
      window.location.hash = '#' + routeName;
      return;
    }

    currentRoute = routeName;
    updateSidebarActive(routeName);
    renderView(routeName, params);
  }

  function renderView(routeName, params) {
    var routeConfig = ROUTES[routeName];
    var moduleName = routeConfig.module;
    var mod = window[moduleName];

    els.mainContent.innerHTML = '<div class="loading-spinner"></div>';

    if (mod && typeof mod.render === 'function') {
      try {
        mod.render(els.mainContent, params);
      } catch (e) {
        console.error('[App] Error rendering ' + moduleName + ':', e);
        els.mainContent.innerHTML =
          '<div class="page-body"><div class="empty-state">' +
          '<div class="empty-state-icon">&#9888;</div>' +
          '<div class="empty-state-title">Erreur de chargement</div>' +
          '<div class="empty-state-text">' + e.message + '</div>' +
          '</div></div>';
      }
    } else {
      els.mainContent.innerHTML =
        '<div class="page-body"><div class="empty-state">' +
        '<div class="empty-state-icon">&#128679;</div>' +
        '<div class="empty-state-title">Module en construction</div>' +
        '<div class="empty-state-text">La vue "' + routeConfig.title + '" sera bientôt disponible.</div>' +
        '</div></div>';
    }
  }

  // ============================================
  //  Sidebar
  // ============================================

  function updateSidebarActive(route) {
    var links = els.sidebar.querySelectorAll('.sidebar-link');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.getAttribute('data-route') === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  }

  function updateSidebarUser(user, profile) {
    if (!user) {
      els.sidebarFooter.innerHTML =
        '<button class="btn btn-primary btn-sm" style="width:100%" onclick="App.showAuthModal()">Se connecter</button>';
      return;
    }

    var name = (profile && profile.nom_association) || user.email.split('@')[0];
    var initial = name.charAt(0).toUpperCase();

    els.sidebarFooter.innerHTML =
      '<div class="sidebar-user" onclick="App.navigate(\'settings\')">' +
        '<div class="sidebar-avatar">' + initial + '</div>' +
        '<div class="sidebar-user-info">' +
          '<div class="sidebar-user-name">' + escapeHtml(name) + '</div>' +
          '<div class="sidebar-user-email">' + escapeHtml(user.email) + '</div>' +
        '</div>' +
      '</div>';
  }

  function toggleSidebar() {
    els.sidebar.classList.toggle('open');
    els.sidebarOverlay.classList.toggle('visible');
  }

  function closeSidebar() {
    els.sidebar.classList.remove('open');
    els.sidebarOverlay.classList.remove('visible');
  }

  // ============================================
  //  Auth Modal
  // ============================================

  function showAuthModal() {
    isSignUpMode = false;
    updateAuthModalUI();
    els.authModal.classList.add('visible');
  }

  function hideAuthModal() {
    els.authModal.classList.remove('visible');
    els.authForm.reset();
  }

  function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    updateAuthModalUI();
  }

  function updateAuthModalUI() {
    if (isSignUpMode) {
      els.authModalTitle.textContent = 'Créer un compte';
      els.authSubmitBtn.textContent = "S'inscrire";
      els.authToggleText.textContent = 'Déjà un compte ?';
      els.authToggleLink.textContent = ' Se connecter';
      els.authNameGroup.style.display = 'block';
    } else {
      els.authModalTitle.textContent = 'Connexion';
      els.authSubmitBtn.textContent = 'Se connecter';
      els.authToggleText.textContent = 'Pas encore de compte ?';
      els.authToggleLink.textContent = ' Créer un compte';
      els.authNameGroup.style.display = 'none';
    }
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    var email = els.authEmail.value.trim();
    var password = els.authPassword.value;

    els.authSubmitBtn.disabled = true;
    els.authSubmitBtn.textContent = 'Chargement...';

    try {
      if (isSignUpMode) {
        await Auth.signUp(email, password);
        var name = els.authName.value.trim();
        if (name) {
          // Profile will be auto-created by trigger, update name after
          setTimeout(async function() {
            try {
              await Auth.updateProfile({ nom_association: name });
            } catch (err) {
              // Ignore - profile might not be ready yet
            }
          }, 1000);
        }
        toast('Compte créé ! Vérifiez votre email pour confirmer.', 'success');
      } else {
        await Auth.signIn(email, password);
        toast('Bienvenue !', 'success');
      }
      hideAuthModal();
    } catch (err) {
      toast(err.message || 'Erreur de connexion', 'error');
    } finally {
      updateAuthModalUI();
      els.authSubmitBtn.disabled = false;
    }
  }

  // ============================================
  //  Auth state change
  // ============================================

  function handleAuthChange(user, profile) {
    updateSidebarUser(user, profile);

    if (user) {
      hideAuthModal();
      if (els.appLoader) {
        els.appLoader.remove();
        els.appLoader = null;
      }
      handleRouteChange();
    } else {
      showAuthModal();
      els.mainContent.innerHTML =
        '<div class="page-body"><div class="empty-state">' +
        '<div class="empty-state-icon">&#128274;</div>' +
        '<div class="empty-state-title">Connectez-vous pour accéder à SubTracker</div>' +
        '<div class="empty-state-text">Gérez vos subventions, projets et finances associatives.</div>' +
        '<button class="btn btn-primary" onclick="App.showAuthModal()">Se connecter</button>' +
        '</div></div>';
    }
  }

  // ============================================
  //  Generic Modal
  // ============================================

  function showModal(html, opts) {
    opts = opts || {};
    var maxWidth = opts.maxWidth || '600px';
    els.genericModalContent.style.maxWidth = maxWidth;
    els.genericModalContent.innerHTML = html;
    els.genericModal.classList.add('visible');
  }

  function hideModal() {
    els.genericModal.classList.remove('visible');
    els.genericModalContent.innerHTML = '';
  }

  // ============================================
  //  Toasts
  // ============================================

  function toast(message, type) {
    type = type || 'info';
    var icons = { success: '&#10003;', error: '&#10007;', warning: '&#9888;', info: '&#8505;' };

    var toastEl = document.createElement('div');
    toastEl.className = 'toast ' + type;
    toastEl.innerHTML =
      '<span class="toast-icon">' + (icons[type] || icons.info) + '</span>' +
      '<span class="toast-message">' + escapeHtml(message) + '</span>' +
      '<span class="toast-close">&times;</span>';

    toastEl.querySelector('.toast-close').onclick = function() { removeToast(toastEl); };
    els.toastContainer.appendChild(toastEl);

    setTimeout(function() { removeToast(toastEl); }, 4000);
  }

  function removeToast(el) {
    if (!el || !el.parentNode) return;
    el.classList.add('removing');
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
  }

  // ============================================
  //  Utilities
  // ============================================

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function confirmDialog(message) {
    return new Promise(function(resolve) {
      var html =
        '<div class="modal-header">' +
          '<h3 class="modal-title">Confirmation</h3>' +
          '<button class="modal-close" onclick="App.hideModal()">&times;</button>' +
        '</div>' +
        '<div class="modal-body">' +
          '<p style="font-size:0.9rem;color:var(--text-secondary)">' + escapeHtml(message) + '</p>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<button class="btn btn-secondary" id="confirmNo">Annuler</button>' +
          '<button class="btn btn-danger" id="confirmYes">Confirmer</button>' +
        '</div>';
      showModal(html, { maxWidth: '400px' });
      document.getElementById('confirmNo').onclick = function() { hideModal(); resolve(false); };
      document.getElementById('confirmYes').onclick = function() { hideModal(); resolve(true); };
    });
  }

  // ============================================
  //  Init
  // ============================================

  async function init() {
    if (initialized) return;
    initialized = true;

    cacheElements();

    // Bind events
    window.addEventListener('hashchange', handleRouteChange);
    els.sidebarToggle.addEventListener('click', toggleSidebar);
    els.sidebarOverlay.addEventListener('click', closeSidebar);
    els.authModalClose.addEventListener('click', hideAuthModal);
    els.authToggleLink.addEventListener('click', toggleAuthMode);
    els.authForm.addEventListener('submit', handleAuthSubmit);
    els.authModal.addEventListener('click', function(e) {
      if (e.target === els.authModal) hideAuthModal();
    });
    els.genericModal.addEventListener('click', function(e) {
      if (e.target === els.genericModal) hideModal();
    });

    // Close sidebar on nav click (mobile)
    var sidebarLinks = els.sidebar.querySelectorAll('.sidebar-link');
    for (var i = 0; i < sidebarLinks.length; i++) {
      sidebarLinks[i].addEventListener('click', closeSidebar);
    }

    // Init auth
    Auth.onAuthChange(handleAuthChange);
    await Auth.init();
  }

  // Start on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', init);

  // ---- Public API ----
  return {
    navigate: navigate,
    showAuthModal: showAuthModal,
    hideAuthModal: hideAuthModal,
    showModal: showModal,
    hideModal: hideModal,
    toast: toast,
    escapeHtml: escapeHtml,
    confirmDialog: confirmDialog,
    getRouteFromHash: getRouteFromHash,
    getCurrentRoute: function() { return currentRoute; }
  };
})();
