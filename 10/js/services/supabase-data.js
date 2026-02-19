/**
 * SubTracker - Service CRUD centralise Supabase
 */
var DataService = (function() {
  'use strict';

  // ---- Statuts financements (ex-subventions) ----
  var SUBVENTION_STATUSES = [
    { key: 'piste',          label: 'Piste',             badge: 'badge-piste' },
    { key: 'preparation',    label: 'En preparation',    badge: 'badge-preparation' },
    { key: 'deposee',        label: 'Deposee',           badge: 'badge-deposee' },
    { key: 'instruction',    label: 'En instruction',    badge: 'badge-instruction' },
    { key: 'accordee',       label: 'Accordee',          badge: 'badge-accordee' },
    { key: 'conventionnee',  label: 'Conventionnee',     badge: 'badge-conventionnee' },
    { key: 'versee_partiel', label: 'Versee partiel.',   badge: 'badge-versee-partiel' },
    { key: 'versee',         label: 'Versee',            badge: 'badge-versee' },
    { key: 'refusee',        label: 'Refusee',           badge: 'badge-refusee' },
    { key: 'abandonnee',     label: 'Abandonnee',        badge: 'badge-abandonnee' }
  ];

  var FINANCEUR_TYPES = [
    { key: 'etat',             label: 'Etat' },
    { key: 'region',           label: 'Region' },
    { key: 'departement',      label: 'Departement' },
    { key: 'commune',          label: 'Commune' },
    { key: 'intercommunalite', label: 'Intercommunalite' },
    { key: 'europe',           label: 'Europe' },
    { key: 'fondation',        label: 'Fondation' },
    { key: 'entreprise',       label: 'Entreprise' },
    { key: 'autre',            label: 'Autre' }
  ];

  var EXPENSE_CATEGORIES = [
    'personnel', 'fonctionnement', 'investissement', 'prestation',
    'communication', 'deplacement', 'formation', 'autre'
  ];

  var DOCUMENT_CATEGORIES = [
    { key: 'cerfa',        label: 'CERFA' },
    { key: 'convention',   label: 'Convention' },
    { key: 'justificatif', label: 'Justificatif' },
    { key: 'bilan',        label: 'Bilan' },
    { key: 'budget',       label: 'Budget' },
    { key: 'autre',        label: 'Autre' }
  ];

  var EVENT_TYPES = [
    { key: 'deadline',   label: 'Deadline depot',   color: '#ef4444' },
    { key: 'reporting',  label: 'Reporting',         color: '#f59e0b' },
    { key: 'versement',  label: 'Versement attendu', color: '#059669' },
    { key: 'convention', label: 'Convention',         color: '#3b82f6' },
    { key: 'reunion',    label: 'Reunion',           color: '#8b5cf6' },
    { key: 'autre',      label: 'Autre',             color: '#6b7280' }
  ];

  function getUserId() {
    var user = Auth.getUser();
    return user ? user.id : null;
  }

  function generateSlug(name) {
    return name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // ============================================
  //  Projects CRUD
  // ============================================

  async function getProjects(opts) {
    opts = opts || {};
    var query = supabaseClient.from('projects').select('*').eq('user_id', getUserId());
    if (opts.status) query = query.eq('status', opts.status);
    query = query.order('created_at', { ascending: false });
    var result = await query;
    if (result.error) throw result.error;
    return result.data || [];
  }

  async function getProject(id) {
    var result = await supabaseClient.from('projects').select('*').eq('id', id).single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function createProject(data) {
    data.user_id = getUserId();
    data.updated_at = new Date().toISOString();
    var result = await supabaseClient.from('projects').insert(data).select().single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function updateProject(id, data) {
    data.updated_at = new Date().toISOString();
    var result = await supabaseClient.from('projects').update(data).eq('id', id).select().single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function deleteProject(id) {
    var result = await supabaseClient.from('projects').delete().eq('id', id);
    if (result.error) throw result.error;
  }

  // ============================================
  //  Financements CRUD (ex-Subventions)
  // ============================================

  async function getFinancements(opts) {
    opts = opts || {};
    var query = supabaseClient.from('financements')
      .select('*, projects(id, name), financeurs(id, name, type)')
      .eq('user_id', getUserId());
    if (opts.status) query = query.eq('status', opts.status);
    if (opts.project_id) query = query.eq('project_id', opts.project_id);
    if (opts.financeur_id) query = query.eq('financeur_id', opts.financeur_id);
    query = query.order('updated_at', { ascending: false });
    var result = await query;
    if (result.error) throw result.error;
    return result.data || [];
  }

  async function getFinancement(id) {
    var result = await supabaseClient.from('financements')
      .select('*, projects(id, name), financeurs(id, name, type)')
      .eq('id', id).single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function createFinancement(data) {
    data.user_id = getUserId();
    data.updated_at = new Date().toISOString();
    var result = await supabaseClient.from('financements').insert(data).select().single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function updateFinancement(id, data) {
    data.updated_at = new Date().toISOString();
    var result = await supabaseClient.from('financements').update(data).eq('id', id).select().single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function deleteFinancement(id) {
    var result = await supabaseClient.from('financements').delete().eq('id', id);
    if (result.error) throw result.error;
  }

  async function updateFinancementStatus(id, status) {
    return updateFinancement(id, { status: status });
  }

  // Aliases pour compat
  var getSubventions = getFinancements;
  var getSubvention = getFinancement;
  var createSubvention = createFinancement;
  var updateSubvention = updateFinancement;
  var deleteSubvention = deleteFinancement;
  var updateSubventionStatus = updateFinancementStatus;

  // ============================================
  //  Financeurs CRUD
  // ============================================

  async function getFinanceurs(opts) {
    opts = opts || {};
    var query = supabaseClient.from('financeurs').select('*');
    if (opts.type) query = query.eq('type', opts.type);
    if (opts.search) query = query.ilike('name', '%' + opts.search + '%');
    query = query.order('name', { ascending: true });
    if (opts.limit) query = query.limit(opts.limit);
    var result = await query;
    if (result.error) throw result.error;
    return result.data || [];
  }

  async function getFinanceur(id) {
    var result = await supabaseClient.from('financeurs').select('*').eq('id', id).single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function searchFinanceurs(term) {
    if (!term || term.length < 2) return [];
    var result = await supabaseClient.from('financeurs')
      .select('id, name, type, slug')
      .ilike('name', '%' + term + '%')
      .order('name', { ascending: true })
      .limit(10);
    if (result.error) throw result.error;
    return result.data || [];
  }

  async function createFinanceur(data) {
    data.created_by = getUserId();
    data.slug = generateSlug(data.name);
    data.updated_at = new Date().toISOString();
    var result = await supabaseClient.from('financeurs').insert(data).select().single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function updateFinanceur(id, data) {
    data.updated_at = new Date().toISOString();
    if (data.name) data.slug = generateSlug(data.name);
    var result = await supabaseClient.from('financeurs').update(data).eq('id', id).select().single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function getFinanceurBySlug(slug) {
    var result = await supabaseClient.from('financeurs').select('*').eq('slug', slug).single();
    if (result.error && result.error.code !== 'PGRST116') throw result.error;
    return result.data || null;
  }

  async function findOrCreateFinanceur(name, type) {
    if (!name || !name.trim()) return null;
    var slug = generateSlug(name.trim());
    var existing = await getFinanceurBySlug(slug);
    if (existing) return existing;
    return await createFinanceur({ name: name.trim(), type: type || 'autre' });
  }

  // ============================================
  //  Expenses CRUD
  // ============================================

  async function getExpenses(opts) {
    opts = opts || {};
    var query = supabaseClient.from('expenses')
      .select('*, projects(id, name), financements(id, name)')
      .eq('user_id', getUserId());
    if (opts.project_id) query = query.eq('project_id', opts.project_id);
    if (opts.financement_id) query = query.eq('financement_id', opts.financement_id);
    query = query.order('date', { ascending: false });
    var result = await query;
    if (result.error) throw result.error;
    return result.data || [];
  }

  async function createExpense(data) {
    data.user_id = getUserId();
    data.updated_at = new Date().toISOString();
    var result = await supabaseClient.from('expenses').insert(data).select().single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function updateExpense(id, data) {
    data.updated_at = new Date().toISOString();
    var result = await supabaseClient.from('expenses').update(data).eq('id', id).select().single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function deleteExpense(id) {
    var result = await supabaseClient.from('expenses').delete().eq('id', id);
    if (result.error) throw result.error;
  }

  // ============================================
  //  Documents CRUD
  // ============================================

  async function getDocuments(opts) {
    opts = opts || {};
    var query = supabaseClient.from('documents').select('*').eq('user_id', getUserId());
    if (opts.financement_id) query = query.eq('financement_id', opts.financement_id);
    if (opts.project_id) query = query.eq('project_id', opts.project_id);
    query = query.order('created_at', { ascending: false });
    var result = await query;
    if (result.error) throw result.error;
    return result.data || [];
  }

  async function createDocument(data) {
    data.user_id = getUserId();
    var result = await supabaseClient.from('documents').insert(data).select().single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function deleteDocument(id) {
    var result = await supabaseClient.from('documents').delete().eq('id', id);
    if (result.error) throw result.error;
  }

  // ============================================
  //  Calendar Events CRUD
  // ============================================

  async function getCalendarEvents(opts) {
    opts = opts || {};
    var query = supabaseClient.from('calendar_events')
      .select('*, financements(id, name, status), projects(id, name)')
      .eq('user_id', getUserId());
    if (opts.from) query = query.gte('date', opts.from);
    if (opts.to) query = query.lte('date', opts.to);
    if (opts.financement_id) query = query.eq('financement_id', opts.financement_id);
    query = query.order('date', { ascending: true });
    var result = await query;
    if (result.error) throw result.error;
    return result.data || [];
  }

  async function createCalendarEvent(data) {
    data.user_id = getUserId();
    var result = await supabaseClient.from('calendar_events').insert(data).select().single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function updateCalendarEvent(id, data) {
    var result = await supabaseClient.from('calendar_events').update(data).eq('id', id).select().single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function deleteCalendarEvent(id) {
    var result = await supabaseClient.from('calendar_events').delete().eq('id', id);
    if (result.error) throw result.error;
  }

  // ============================================
  //  AAPs (lecture seule, table existante)
  // ============================================

  async function searchAAPs(query, filters) {
    filters = filters || {};
    var q = supabaseClient.from('aaps').select('*');

    if (query) {
      q = q.or('titre.ilike.%' + query + '%,description.ilike.%' + query + '%,financeur.ilike.%' + query + '%');
    }
    if (filters.secteur) q = q.eq('secteur', filters.secteur);
    if (filters.financeur_type) q = q.eq('financeur_type', filters.financeur_type);
    if (filters.statut === 'ouvert') q = q.gte('date_cloture', new Date().toISOString().split('T')[0]);

    q = q.order('date_cloture', { ascending: true, nullsFirst: false }).limit(100);
    var result = await q;
    if (result.error) throw result.error;
    return result.data || [];
  }

  // ============================================
  //  Helpers
  // ============================================

  function getStatusLabel(key) {
    for (var i = 0; i < SUBVENTION_STATUSES.length; i++) {
      if (SUBVENTION_STATUSES[i].key === key) return SUBVENTION_STATUSES[i].label;
    }
    return key;
  }

  function getStatusBadgeClass(key) {
    for (var i = 0; i < SUBVENTION_STATUSES.length; i++) {
      if (SUBVENTION_STATUSES[i].key === key) return SUBVENTION_STATUSES[i].badge;
    }
    return 'badge-piste';
  }

  function getEventTypeColor(type) {
    for (var i = 0; i < EVENT_TYPES.length; i++) {
      if (EVENT_TYPES[i].key === type) return EVENT_TYPES[i].color;
    }
    return '#6b7280';
  }

  function getEventTypeLabel(type) {
    for (var i = 0; i < EVENT_TYPES.length; i++) {
      if (EVENT_TYPES[i].key === type) return EVENT_TYPES[i].label;
    }
    return 'Autre';
  }

  function getFinanceurTypeLabel(key) {
    for (var i = 0; i < FINANCEUR_TYPES.length; i++) {
      if (FINANCEUR_TYPES[i].key === key) return FINANCEUR_TYPES[i].label;
    }
    return key || 'Autre';
  }

  return {
    SUBVENTION_STATUSES: SUBVENTION_STATUSES,
    FINANCEUR_TYPES: FINANCEUR_TYPES,
    EXPENSE_CATEGORIES: EXPENSE_CATEGORIES,
    DOCUMENT_CATEGORIES: DOCUMENT_CATEGORIES,
    EVENT_TYPES: EVENT_TYPES,
    getStatusLabel: getStatusLabel,
    getStatusBadgeClass: getStatusBadgeClass,
    getEventTypeColor: getEventTypeColor,
    getEventTypeLabel: getEventTypeLabel,
    getFinanceurTypeLabel: getFinanceurTypeLabel,
    generateSlug: generateSlug,
    // Projects
    getProjects: getProjects,
    getProject: getProject,
    createProject: createProject,
    updateProject: updateProject,
    deleteProject: deleteProject,
    // Financements (+ aliases subventions)
    getFinancements: getFinancements,
    getFinancement: getFinancement,
    createFinancement: createFinancement,
    updateFinancement: updateFinancement,
    deleteFinancement: deleteFinancement,
    updateFinancementStatus: updateFinancementStatus,
    getSubventions: getSubventions,
    getSubvention: getSubvention,
    createSubvention: createSubvention,
    updateSubvention: updateSubvention,
    deleteSubvention: deleteSubvention,
    updateSubventionStatus: updateSubventionStatus,
    // Financeurs
    getFinanceurs: getFinanceurs,
    getFinanceur: getFinanceur,
    searchFinanceurs: searchFinanceurs,
    createFinanceur: createFinanceur,
    updateFinanceur: updateFinanceur,
    getFinanceurBySlug: getFinanceurBySlug,
    findOrCreateFinanceur: findOrCreateFinanceur,
    // Expenses
    getExpenses: getExpenses,
    createExpense: createExpense,
    updateExpense: updateExpense,
    deleteExpense: deleteExpense,
    // Documents
    getDocuments: getDocuments,
    createDocument: createDocument,
    deleteDocument: deleteDocument,
    // Calendar
    getCalendarEvents: getCalendarEvents,
    createCalendarEvent: createCalendarEvent,
    updateCalendarEvent: updateCalendarEvent,
    deleteCalendarEvent: deleteCalendarEvent,
    // AAPs
    searchAAPs: searchAAPs
  };
})();
