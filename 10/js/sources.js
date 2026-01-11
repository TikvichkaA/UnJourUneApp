/**
 * SubVeille - Sources de donnees
 * Lit les AAP depuis Supabase (synchronises quotidiennement)
 */

const DataSources = (function() {

  // ============================================
  // Recherche depuis Supabase
  // ============================================

  /**
   * Recherche des AAP dans Supabase
   */
  async function search(query = '', filters = {}) {
    try {
      let queryBuilder = supabaseClient
        .from('aaps')
        .select('*');

      // Recherche texte
      if (query) {
        queryBuilder = queryBuilder.or(`titre.ilike.%${query}%,description.ilike.%${query}%,financeur.ilike.%${query}%`);
      }

      // Filtre par secteur
      if (filters.secteur) {
        queryBuilder = queryBuilder.eq('secteur', filters.secteur);
      }

      // Filtre par type de financeur
      if (filters.financeur) {
        queryBuilder = queryBuilder.eq('financeur_type', filters.financeur);
      }

      // Filtre par statut (dates)
      const now = new Date().toISOString().split('T')[0];
      if (filters.statut === 'ouvert') {
        queryBuilder = queryBuilder.or(`date_cloture.gte.${now},date_cloture.is.null`);
      } else if (filters.statut === 'bientot') {
        const in30days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        queryBuilder = queryBuilder.gte('date_cloture', now).lte('date_cloture', in30days);
      }

      // Trier par date de cloture
      queryBuilder = queryBuilder.order('date_cloture', { ascending: true, nullsFirst: false });

      // Limite (augmentee pour voir plus de resultats)
      queryBuilder = queryBuilder.limit(500);

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('[Supabase] Erreur recherche:', error);
        throw error;
      }

      // Transformer pour compatibilite avec le format existant
      return (data || []).map(transformFromSupabase);

    } catch (error) {
      console.warn('[Supabase] Fallback vers donnees demo:', error);
      return searchDemo(query, filters);
    }
  }

  /**
   * Transforme un enregistrement Supabase vers le format de l'app
   */
  function transformFromSupabase(row) {
    return {
      id: row.id,
      slug: row.slug,
      titre: row.titre,
      description: row.description || '',
      descriptionComplete: row.description_complete || '',
      financeur: row.financeur || 'Non precise',
      financeurType: row.financeur_type || 'autre',
      secteur: row.secteur || 'autre',
      montantMin: row.montant_min,
      montantMax: row.montant_max,
      subventionRate: row.subvention_rate,
      dateOuverture: row.date_ouverture,
      dateCloture: row.date_cloture,
      lien: row.lien || '#',
      lienCandidature: row.lien_candidature,
      territoires: row.territoires || ['National'],
      beneficiaires: row.beneficiaires || ['Non precise'],
      isAppelProjet: row.is_appel_projet || false,
      contact: row.contact,
      source: row.source || 'supabase',
      categories: row.categories || [],
      programs: row.programs || []
    };
  }

  /**
   * Recupere le detail d'un AAP
   */
  async function getDetail(id) {
    try {
      const { data, error } = await supabaseClient
        .from('aaps')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? transformFromSupabase(data) : null;

    } catch (error) {
      console.error('[Supabase] Erreur detail:', error);
      // Chercher dans les demos
      return DEMO_DATA.find(r => r.id === id) || null;
    }
  }

  /**
   * Recherche dans les donnees demo (fallback)
   */
  function searchDemo(query = '', filters = {}) {
    let results = [...DEMO_DATA];

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(r =>
        r.titre.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.financeur.toLowerCase().includes(q)
      );
    }

    // Filtre secteur
    if (filters.secteur) {
      results = results.filter(r => r.secteur === filters.secteur);
    }

    // Filtre financeur
    if (filters.financeur) {
      results = results.filter(r => r.financeurType === filters.financeur);
    }

    // Filtre statut
    if (filters.statut && filters.statut !== 'tous') {
      const now = new Date();
      results = results.filter(r => {
        if (!r.dateCloture) return filters.statut === 'ouvert';
        const cloture = new Date(r.dateCloture);
        const joursRestants = Math.ceil((cloture - now) / (1000 * 60 * 60 * 24));
        if (filters.statut === 'ouvert') return joursRestants > 0;
        if (filters.statut === 'bientot') return joursRestants > 0 && joursRestants <= 30;
        return true;
      });
    }

    return results;
  }

  /**
   * Calcule le statut de deadline
   */
  function getDeadlineStatus(dateCloture) {
    if (!dateCloture) {
      return { status: 'permanent', label: 'Permanent', class: 'deadline-ok' };
    }

    const now = new Date();
    const cloture = new Date(dateCloture);
    const joursRestants = Math.ceil((cloture - now) / (1000 * 60 * 60 * 24));

    if (joursRestants <= 0) {
      return { status: 'closed', label: 'Clos', class: 'deadline-closed' };
    } else if (joursRestants <= 7) {
      return { status: 'urgent', label: `${joursRestants}j restants`, class: 'deadline-urgent' };
    } else if (joursRestants <= 30) {
      return { status: 'soon', label: `${joursRestants}j restants`, class: 'deadline-soon' };
    } else {
      return { status: 'ok', label: `${joursRestants}j`, class: 'deadline-ok' };
    }
  }

  /**
   * Formate un montant
   */
  function formatMontant(min, max, rate) {
    const formatter = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    });

    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    } else if (max) {
      return `Jusqu'a ${formatter.format(max)}`;
    } else if (min) {
      return `A partir de ${formatter.format(min)}`;
    } else if (rate) {
      return `${rate}% du projet`;
    }
    return 'Variable';
  }

  // ============================================
  // Donnees de demo (fallback)
  // ============================================

  const DEMO_DATA = [
    {
      id: 'demo-1',
      titre: 'Appel a projets - Transition ecologique des associations',
      description: 'Soutien aux associations pour la mise en place d\'actions en faveur de la transition ecologique.',
      financeur: 'ADEME',
      financeurType: 'etat',
      secteur: 'environnement',
      montantMin: 5000,
      montantMax: 50000,
      dateOuverture: '2025-01-01',
      dateCloture: '2025-06-30',
      lien: 'https://agirpourlatransition.ademe.fr',
      territoires: ['National'],
      beneficiaires: ['Associations'],
      isAppelProjet: true,
      source: 'demo'
    },
    {
      id: 'demo-2',
      titre: 'Fonds de soutien aux initiatives culturelles locales',
      description: 'Accompagnement des projets culturels de proximite.',
      financeur: 'Ministere de la Culture',
      financeurType: 'etat',
      secteur: 'culture',
      montantMin: 2000,
      montantMax: 20000,
      dateOuverture: '2025-01-15',
      dateCloture: '2025-07-15',
      lien: 'https://www.culture.gouv.fr',
      territoires: ['National'],
      beneficiaires: ['Associations'],
      isAppelProjet: true,
      source: 'demo'
    },
    {
      id: 'demo-3',
      titre: 'Aide au developpement du sport pour tous',
      description: 'Financement pour les clubs sportifs associatifs favorisant l\'acces au sport.',
      financeur: 'Agence nationale du Sport',
      financeurType: 'etat',
      secteur: 'sport',
      montantMin: 1000,
      montantMax: 15000,
      dateOuverture: '2025-02-01',
      dateCloture: '2025-05-31',
      lien: 'https://www.agencedusport.fr',
      territoires: ['National'],
      beneficiaires: ['Associations sportives'],
      isAppelProjet: false,
      source: 'demo'
    },
    {
      id: 'demo-4',
      titre: 'Programme regional ESS et innovation sociale',
      description: 'Soutien aux projets innovants dans le champ de l\'economie sociale et solidaire.',
      financeur: 'Region Ile-de-France',
      financeurType: 'region',
      secteur: 'social',
      montantMin: 10000,
      montantMax: 100000,
      dateOuverture: '2025-01-01',
      dateCloture: null,
      lien: 'https://www.iledefrance.fr',
      territoires: ['Ile-de-France'],
      beneficiaires: ['Associations', 'Cooperatives', 'SCIC'],
      isAppelProjet: true,
      source: 'demo'
    }
  ];

  // ============================================
  // API publique
  // ============================================

  return {
    search,
    getDetail,
    getDeadlineStatus,
    formatMontant,
    DEMO_DATA
  };
})();
