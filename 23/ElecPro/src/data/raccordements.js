// Données des exercices de raccordement électrique

export const raccordementsData = {
  // Couleurs des fils
  wireColors: {
    phase: { color: '#EF4444', label: 'Phase', code: 'L' },
    neutre: { color: '#3B82F6', label: 'Neutre', code: 'N' },
    terre: { color: '#22C55E', label: 'Terre', code: 'PE' },
    retour: { color: '#F97316', label: 'Retour lampe', code: 'RL' },
    navette1: { color: '#8B5CF6', label: 'Navette 1', code: 'N1' },
    navette2: { color: '#EC4899', label: 'Navette 2', code: 'N2' },
    // Courants faibles
    plus12v: { color: '#DC2626', label: '+12V', code: '+' },
    moins12v: { color: '#1E40AF', label: '0V', code: '-' },
    data: { color: '#059669', label: 'Data', code: 'D' },
    commande: { color: '#D97706', label: 'Commande', code: 'C' }
  },

  // Schémas constructeur pour les dispositifs centraux
  schemasConstructeur: {
    telerupteur: {
      width: 80,
      height: 60,
      schema: [
        // Bobine (A1-A2)
        { type: 'rect', x: 5, y: 15, width: 30, height: 30, stroke: '#374151', fill: 'none' },
        { type: 'text', x: 20, y: 32, text: 'A1-A2', size: 8 },
        // Contact (1-2)
        { type: 'line', x1: 50, y1: 15, x2: 50, y2: 25 },
        { type: 'line', x1: 50, y1: 25, x2: 65, y2: 35, dashed: true },
        { type: 'line', x1: 50, y1: 35, x2: 50, y2: 45 },
        { type: 'text', x: 57, y: 22, text: '1', size: 8 },
        { type: 'text', x: 57, y: 48, text: '2', size: 8 }
      ],
      bornesLabels: { 'A1': 'Bobine +', 'A2': 'Bobine -', '1': 'Contact entrée', '2': 'Contact sortie' }
    },
    minuterie: {
      width: 80,
      height: 60,
      schema: [
        // Timer symbol
        { type: 'circle', cx: 20, cy: 30, r: 12, stroke: '#374151', fill: 'none' },
        { type: 'text', x: 20, y: 33, text: 't', size: 10 },
        // Contact (3→4)
        { type: 'line', x1: 50, y1: 15, x2: 50, y2: 25 },
        { type: 'line', x1: 50, y1: 25, x2: 65, y2: 35, dashed: true },
        { type: 'line', x1: 50, y1: 35, x2: 50, y2: 45 },
        { type: 'text', x: 40, y: 10, text: '1', size: 7 },
        { type: 'text', x: 57, y: 10, text: '3', size: 7 },
        { type: 'text', x: 40, y: 55, text: '2', size: 7 },
        { type: 'text', x: 57, y: 55, text: '4', size: 7 }
      ],
      bornesLabels: { '1': 'Phase perm.', '2': 'Neutre', '3': 'Commande BP', '4': 'Sortie lampe' }
    },
    contacteur: {
      width: 80,
      height: 60,
      schema: [
        // Bobine
        { type: 'rect', x: 5, y: 18, width: 25, height: 24, stroke: '#374151', fill: 'none' },
        { type: 'text', x: 17, y: 32, text: 'A1', size: 7 },
        { type: 'text', x: 17, y: 42, text: 'A2', size: 7 },
        // Contact de puissance
        { type: 'line', x1: 55, y1: 15, x2: 55, y2: 25 },
        { type: 'line', x1: 55, y1: 25, x2: 70, y2: 35, dashed: true },
        { type: 'line', x1: 55, y1: 35, x2: 55, y2: 45 },
        { type: 'text', x: 62, y: 22, text: '1', size: 8 },
        { type: 'text', x: 62, y: 48, text: '2', size: 8 }
      ],
      bornesLabels: { 'A1': 'Bobine +', 'A2': 'Bobine -', '1': 'Puissance in', '2': 'Puissance out' }
    },
    'va-et-vient': {
      width: 60,
      height: 50,
      schema: [
        // Point commun L
        { type: 'circle', cx: 15, cy: 25, r: 4, stroke: '#374151', fill: '#374151' },
        { type: 'text', x: 8, y: 18, text: 'L', size: 8 },
        // Deux sorties 1 et 2
        { type: 'line', x1: 19, y1: 25, x2: 45, y2: 10 },
        { type: 'line', x1: 19, y1: 25, x2: 45, y2: 40, dashed: true },
        { type: 'circle', cx: 45, cy: 10, r: 3, stroke: '#374151', fill: 'none' },
        { type: 'circle', cx: 45, cy: 40, r: 3, stroke: '#374151', fill: 'none' },
        { type: 'text', x: 50, y: 13, text: '1', size: 8 },
        { type: 'text', x: 50, y: 43, text: '2', size: 8 }
      ],
      bornesLabels: { 'L': 'Commun', '1': 'Navette 1', '2': 'Navette 2' }
    }
  },

  circuits: [
    // === NIVEAU 1 : BASIQUE ===
    {
      id: 'simple-allumage',
      titre: 'Simple allumage',
      description: 'Un interrupteur commandant un point lumineux',
      difficulte: 1,
      icon: '💡',
      dureeEstimee: '2 min',
      composants: [
        { id: 'disj', type: 'disjoncteur', label: 'Disj. 10A', x: 50, y: 50 },
        { id: 'inter', type: 'interrupteur', label: 'Interrupteur', x: 200, y: 120 },
        { id: 'lampe', type: 'lampe', label: 'Lampe', x: 350, y: 120 }
      ],
      bornes: [
        { id: 'disj-L-out', componentId: 'disj', position: 'right', label: 'L', x: 90, y: 40 },
        { id: 'disj-N-out', componentId: 'disj', position: 'right', label: 'N', x: 90, y: 60 },
        { id: 'inter-L', componentId: 'inter', position: 'top', label: 'L', x: 190, y: 100 },
        { id: 'inter-1', componentId: 'inter', position: 'bottom', label: '1', x: 210, y: 140 },
        { id: 'lampe-L', componentId: 'lampe', position: 'left', label: 'L', x: 330, y: 110 },
        { id: 'lampe-N', componentId: 'lampe', position: 'right', label: 'N', x: 370, y: 130 }
      ],
      connexionsCorrectes: [
        { from: 'disj-L-out', to: 'inter-L', wireType: 'phase' },
        { from: 'inter-1', to: 'lampe-L', wireType: 'retour' },
        { from: 'disj-N-out', to: 'lampe-N', wireType: 'neutre' }
      ],
      indices: [
        'La phase arrive toujours sur la borne L de l\'interrupteur',
        'Le neutre va directement à la lampe, sans passer par l\'interrupteur',
        'Le retour lampe (fil orange) relie l\'interrupteur à la lampe'
      ],
      explication: 'Dans un simple allumage, l\'interrupteur coupe la phase. Le neutre va directement à la lampe. Cela permet de mettre hors tension la lampe de façon sécurisée.'
    },

    {
      id: 'double-allumage',
      titre: 'Double allumage',
      description: 'Un interrupteur double commandant 2 lampes indépendamment',
      difficulte: 2,
      icon: '💡💡',
      dureeEstimee: '3 min',
      composants: [
        { id: 'disj', type: 'disjoncteur', label: 'Disj. 10A', x: 50, y: 80 },
        { id: 'inter', type: 'interrupteur-double', label: 'Double', x: 180, y: 100 },
        { id: 'lampe1', type: 'lampe', label: 'Lampe 1', x: 320, y: 50 },
        { id: 'lampe2', type: 'lampe', label: 'Lampe 2', x: 320, y: 150 }
      ],
      bornes: [
        { id: 'disj-L-out', componentId: 'disj', position: 'right', label: 'L', x: 90, y: 70 },
        { id: 'disj-N-out', componentId: 'disj', position: 'right', label: 'N', x: 90, y: 90 },
        { id: 'inter-L', componentId: 'inter', position: 'left', label: 'L', x: 160, y: 100 },
        { id: 'inter-1', componentId: 'inter', position: 'right', label: '1', x: 200, y: 80 },
        { id: 'inter-2', componentId: 'inter', position: 'right', label: '2', x: 200, y: 120 },
        { id: 'lampe1-L', componentId: 'lampe1', position: 'left', label: 'L', x: 300, y: 50 },
        { id: 'lampe1-N', componentId: 'lampe1', position: 'right', label: 'N', x: 340, y: 50 },
        { id: 'lampe2-L', componentId: 'lampe2', position: 'left', label: 'L', x: 300, y: 150 },
        { id: 'lampe2-N', componentId: 'lampe2', position: 'right', label: 'N', x: 340, y: 150 }
      ],
      connexionsCorrectes: [
        { from: 'disj-L-out', to: 'inter-L', wireType: 'phase' },
        { from: 'inter-1', to: 'lampe1-L', wireType: 'retour' },
        { from: 'inter-2', to: 'lampe2-L', wireType: 'retour' },
        { from: 'disj-N-out', to: 'lampe1-N', wireType: 'neutre' },
        { from: 'disj-N-out', to: 'lampe2-N', wireType: 'neutre' }
      ],
      indices: [
        'Une seule phase alimente les 2 commandes',
        'Chaque sortie (1 et 2) va vers une lampe différente',
        'Le neutre est commun aux 2 lampes'
      ],
      explication: 'L\'interrupteur double permet de commander 2 circuits d\'éclairage indépendants depuis un même boîtier. Une seule phase alimente les 2 commandes.'
    },

    // === NIVEAU 2 : INTERMÉDIAIRE ===
    {
      id: 'va-et-vient',
      titre: 'Va-et-vient',
      description: 'Commander une lampe depuis 2 endroits',
      difficulte: 3,
      icon: '🔀',
      dureeEstimee: '4 min',
      composants: [
        { id: 'disj', type: 'disjoncteur', label: 'Disj. 10A', x: 40, y: 100 },
        { id: 'inter1', type: 'va-et-vient', label: 'VV 1', x: 150, y: 100 },
        { id: 'inter2', type: 'va-et-vient', label: 'VV 2', x: 280, y: 100 },
        { id: 'lampe', type: 'lampe', label: 'Lampe', x: 390, y: 100 }
      ],
      bornes: [
        { id: 'disj-L-out', componentId: 'disj', position: 'right', label: 'L', x: 80, y: 90 },
        { id: 'disj-N-out', componentId: 'disj', position: 'right', label: 'N', x: 80, y: 110 },
        { id: 'inter1-L', componentId: 'inter1', position: 'left', label: 'L', x: 120, y: 100 },
        { id: 'inter1-1', componentId: 'inter1', position: 'right', label: '1', x: 180, y: 75 },
        { id: 'inter1-2', componentId: 'inter1', position: 'right', label: '2', x: 180, y: 125 },
        { id: 'inter2-1', componentId: 'inter2', position: 'left', label: '1', x: 250, y: 75 },
        { id: 'inter2-2', componentId: 'inter2', position: 'left', label: '2', x: 250, y: 125 },
        { id: 'inter2-L', componentId: 'inter2', position: 'right', label: 'L', x: 310, y: 100 },
        { id: 'lampe-L', componentId: 'lampe', position: 'left', label: 'L', x: 360, y: 100 },
        { id: 'lampe-N', componentId: 'lampe', position: 'right', label: 'N', x: 410, y: 100 }
      ],
      connexionsCorrectes: [
        { from: 'disj-L-out', to: 'inter1-L', wireType: 'phase' },
        { from: 'inter1-1', to: 'inter2-1', wireType: 'navette1' },
        { from: 'inter1-2', to: 'inter2-2', wireType: 'navette2' },
        { from: 'inter2-L', to: 'lampe-L', wireType: 'retour' },
        { from: 'disj-N-out', to: 'lampe-N', wireType: 'neutre' }
      ],
      indices: [
        'La phase arrive sur L du premier interrupteur',
        'Les navettes relient les bornes 1-1 et 2-2 entre les 2 interrupteurs',
        'Le retour lampe part de la borne L du deuxième interrupteur'
      ],
      explication: 'Le va-et-vient utilise 2 interrupteurs à 3 positions reliés par 2 fils navettes. Chaque interrupteur peut allumer ou éteindre la lampe.'
    },

    {
      id: 'prise-commandee',
      titre: 'Prise commandée',
      description: 'Une prise contrôlée par un interrupteur',
      difficulte: 2,
      icon: '🔌',
      dureeEstimee: '3 min',
      composants: [
        { id: 'disj', type: 'disjoncteur', label: 'Disj. 10A', x: 50, y: 80 },
        { id: 'inter', type: 'interrupteur', label: 'Inter.', x: 180, y: 80 },
        { id: 'prise', type: 'prise', label: 'Prise', x: 320, y: 80 }
      ],
      bornes: [
        { id: 'disj-L-out', componentId: 'disj', position: 'right', label: 'L', x: 90, y: 70 },
        { id: 'disj-N-out', componentId: 'disj', position: 'right', label: 'N', x: 90, y: 90 },
        { id: 'inter-L', componentId: 'inter', position: 'top', label: 'L', x: 170, y: 60 },
        { id: 'inter-1', componentId: 'inter', position: 'bottom', label: '1', x: 190, y: 100 },
        { id: 'prise-L', componentId: 'prise', position: 'left', label: 'L', x: 300, y: 70 },
        { id: 'prise-N', componentId: 'prise', position: 'left', label: 'N', x: 300, y: 90 },
        { id: 'prise-PE', componentId: 'prise', position: 'bottom', label: 'PE', x: 320, y: 110 }
      ],
      connexionsCorrectes: [
        { from: 'disj-L-out', to: 'inter-L', wireType: 'phase' },
        { from: 'inter-1', to: 'prise-L', wireType: 'retour' },
        { from: 'disj-N-out', to: 'prise-N', wireType: 'neutre' }
      ],
      indices: [
        'Le câblage est identique à un simple allumage',
        'La prise commandée est sur le circuit éclairage (10A)',
        'Pas besoin de terre pour l\'exercice simplifié'
      ],
      explication: 'La prise commandée fonctionne comme un simple allumage. Elle est utilisée pour commander une lampe de chevet par exemple.'
    },

    // === NIVEAU 3 : AVANCÉ ===
    {
      id: 'telerupteur',
      titre: 'Télérupteur',
      description: 'Commander une lampe depuis 3 points ou plus',
      difficulte: 4,
      icon: '🔔',
      dureeEstimee: '5 min',
      composants: [
        { id: 'disj', type: 'disjoncteur', label: 'Disj. 10A', x: 50, y: 50 },
        { id: 'teler', type: 'telerupteur', label: 'Télérupteur', x: 50, y: 160 },
        { id: 'bp1', type: 'bouton-poussoir', label: 'BP 1', x: 200, y: 50 },
        { id: 'bp2', type: 'bouton-poussoir', label: 'BP 2', x: 200, y: 160 },
        { id: 'lampe', type: 'lampe', label: 'Lampe', x: 350, y: 110 }
      ],
      bornes: [
        { id: 'disj-L-out', componentId: 'disj', position: 'right', label: 'L', x: 90, y: 40 },
        { id: 'disj-N-out', componentId: 'disj', position: 'right', label: 'N', x: 90, y: 60 },
        { id: 'teler-A1', componentId: 'teler', position: 'top', label: 'A1', x: 30, y: 130 },
        { id: 'teler-A2', componentId: 'teler', position: 'top', label: 'A2', x: 70, y: 130 },
        { id: 'teler-1', componentId: 'teler', position: 'bottom', label: '1', x: 30, y: 190 },
        { id: 'teler-2', componentId: 'teler', position: 'bottom', label: '2', x: 70, y: 190 },
        { id: 'bp1-1', componentId: 'bp1', position: 'left', label: '1', x: 170, y: 40 },
        { id: 'bp1-2', componentId: 'bp1', position: 'right', label: '2', x: 230, y: 60 },
        { id: 'bp2-1', componentId: 'bp2', position: 'left', label: '1', x: 170, y: 150 },
        { id: 'bp2-2', componentId: 'bp2', position: 'right', label: '2', x: 230, y: 170 },
        { id: 'lampe-L', componentId: 'lampe', position: 'left', label: 'L', x: 320, y: 110 },
        { id: 'lampe-N', componentId: 'lampe', position: 'right', label: 'N', x: 380, y: 110 }
      ],
      connexionsCorrectes: [
        { from: 'disj-L-out', to: 'teler-1', wireType: 'phase' },
        { from: 'disj-L-out', to: 'bp1-1', wireType: 'phase' },
        { from: 'disj-L-out', to: 'bp2-1', wireType: 'phase' },
        { from: 'bp1-2', to: 'teler-A1', wireType: 'retour' },
        { from: 'bp2-2', to: 'teler-A1', wireType: 'retour' },
        { from: 'disj-N-out', to: 'teler-A2', wireType: 'neutre' },
        { from: 'teler-2', to: 'lampe-L', wireType: 'retour' },
        { from: 'disj-N-out', to: 'lampe-N', wireType: 'neutre' }
      ],
      indices: [
        'La phase alimente le contact 1 du télérupteur ET tous les boutons poussoirs',
        'Les sorties des BP sont reliées ensemble vers A1 de la bobine',
        'A2 de la bobine est relié au neutre',
        'Le contact 2 du télérupteur alimente la lampe'
      ],
      explication: 'Le télérupteur est un relais bistable. Chaque appui sur un bouton poussoir change l\'état du contact. La bobine (A1-A2) commande le contact de puissance (1-2).'
    },

    {
      id: 'minuterie',
      titre: 'Minuterie',
      description: 'Éclairage temporisé avec extinction automatique',
      difficulte: 4,
      icon: '⏱️',
      dureeEstimee: '5 min',
      composants: [
        { id: 'disj', type: 'disjoncteur', label: 'Disj. 10A', x: 50, y: 50 },
        { id: 'minu', type: 'minuterie', label: 'Minuterie', x: 50, y: 165 },
        { id: 'bp1', type: 'bouton-poussoir', label: 'BP 1', x: 200, y: 50 },
        { id: 'bp2', type: 'bouton-poussoir', label: 'BP 2', x: 200, y: 165 },
        { id: 'lampe', type: 'lampe', label: 'Lampe', x: 350, y: 110 }
      ],
      bornes: [
        { id: 'disj-L-out', componentId: 'disj', position: 'right', label: 'L', x: 90, y: 40 },
        { id: 'disj-N-out', componentId: 'disj', position: 'right', label: 'N', x: 90, y: 60 },
        { id: 'minu-1', componentId: 'minu', position: 'top', label: '1', x: 25, y: 135 },
        { id: 'minu-2', componentId: 'minu', position: 'top', label: '2', x: 75, y: 135 },
        { id: 'minu-3', componentId: 'minu', position: 'bottom', label: '3', x: 25, y: 195 },
        { id: 'minu-4', componentId: 'minu', position: 'bottom', label: '4', x: 75, y: 195 },
        { id: 'bp1-1', componentId: 'bp1', position: 'left', label: '1', x: 170, y: 40 },
        { id: 'bp1-2', componentId: 'bp1', position: 'right', label: '2', x: 230, y: 60 },
        { id: 'bp2-1', componentId: 'bp2', position: 'left', label: '1', x: 170, y: 155 },
        { id: 'bp2-2', componentId: 'bp2', position: 'right', label: '2', x: 230, y: 175 },
        { id: 'lampe-L', componentId: 'lampe', position: 'left', label: 'L', x: 320, y: 110 },
        { id: 'lampe-N', componentId: 'lampe', position: 'right', label: 'N', x: 380, y: 110 }
      ],
      connexionsCorrectes: [
        { from: 'disj-L-out', to: 'minu-1', wireType: 'phase' },
        { from: 'disj-L-out', to: 'bp1-1', wireType: 'phase' },
        { from: 'disj-L-out', to: 'bp2-1', wireType: 'phase' },
        { from: 'bp1-2', to: 'minu-3', wireType: 'retour' },
        { from: 'bp2-2', to: 'minu-3', wireType: 'retour' },
        { from: 'disj-N-out', to: 'minu-2', wireType: 'neutre' },
        { from: 'minu-4', to: 'lampe-L', wireType: 'retour' },
        { from: 'disj-N-out', to: 'lampe-N', wireType: 'neutre' }
      ],
      indices: [
        'La borne 1 reçoit la phase permanente',
        'La borne 2 reçoit le neutre (alimentation)',
        'La borne 3 reçoit le retour des boutons poussoirs',
        'La borne 4 alimente la lampe (sortie temporisée)'
      ],
      explication: 'La minuterie s\'allume à chaque appui sur un BP et s\'éteint automatiquement après un temps réglable. Utilisée dans les couloirs et escaliers.'
    },

    {
      id: 'contacteur-jour-nuit',
      titre: 'Contacteur jour/nuit',
      description: 'Pilotage du chauffe-eau par le compteur',
      difficulte: 4,
      icon: '🌙',
      dureeEstimee: '5 min',
      composants: [
        { id: 'disj', type: 'disjoncteur', label: 'Disj. 20A', x: 50, y: 50 },
        { id: 'contact', type: 'contacteur', label: 'Contacteur', x: 170, y: 100 },
        { id: 'disj2', type: 'disjoncteur', label: 'Disj. 2A', x: 50, y: 180 },
        { id: 'compteur', type: 'compteur', label: 'Compteur', x: 300, y: 50 },
        { id: 'ce', type: 'chauffe-eau', label: 'Chauffe-eau', x: 300, y: 180 }
      ],
      bornes: [
        { id: 'disj-L-out', componentId: 'disj', position: 'right', label: 'L', x: 90, y: 40 },
        { id: 'disj-N-out', componentId: 'disj', position: 'right', label: 'N', x: 90, y: 60 },
        { id: 'disj2-L-out', componentId: 'disj2', position: 'right', label: 'L', x: 90, y: 170 },
        { id: 'disj2-N-out', componentId: 'disj2', position: 'right', label: 'N', x: 90, y: 190 },
        { id: 'contact-1', componentId: 'contact', position: 'top', label: '1', x: 150, y: 70 },
        { id: 'contact-2', componentId: 'contact', position: 'top', label: '2', x: 190, y: 70 },
        { id: 'contact-A1', componentId: 'contact', position: 'bottom', label: 'A1', x: 150, y: 130 },
        { id: 'contact-A2', componentId: 'contact', position: 'bottom', label: 'A2', x: 190, y: 130 },
        { id: 'compteur-C1', componentId: 'compteur', position: 'bottom', label: 'C1', x: 280, y: 70 },
        { id: 'compteur-C2', componentId: 'compteur', position: 'bottom', label: 'C2', x: 320, y: 70 },
        { id: 'ce-L', componentId: 'ce', position: 'top', label: 'L', x: 280, y: 160 },
        { id: 'ce-N', componentId: 'ce', position: 'top', label: 'N', x: 320, y: 160 }
      ],
      connexionsCorrectes: [
        { from: 'disj-L-out', to: 'contact-1', wireType: 'phase' },
        { from: 'contact-2', to: 'ce-L', wireType: 'phase' },
        { from: 'disj-N-out', to: 'ce-N', wireType: 'neutre' },
        { from: 'disj2-L-out', to: 'compteur-C1', wireType: 'phase' },
        { from: 'compteur-C2', to: 'contact-A1', wireType: 'retour' },
        { from: 'disj2-N-out', to: 'contact-A2', wireType: 'neutre' }
      ],
      indices: [
        'Le disj 20A protège la puissance (chauffe-eau)',
        'Le disj 2A protège la commande (bobine)',
        'Le contact C1-C2 du compteur pilote la bobine A1-A2',
        'Le contacteur 1-2 alimente le chauffe-eau'
      ],
      explication: 'Le contacteur jour/nuit permet de faire fonctionner le chauffe-eau pendant les heures creuses. Le compteur envoie un signal qui active la bobine du contacteur.'
    },

    // === COURANTS FAIBLES ===
    {
      id: 'interphone-simple',
      titre: 'Interphone simple',
      description: 'Platine de rue, combiné et gâche électrique',
      difficulte: 3,
      icon: '🚪',
      dureeEstimee: '4 min',
      composants: [
        { id: 'alim', type: 'alimentation', label: 'Alim 12V', x: 50, y: 100 },
        { id: 'platine', type: 'platine-rue', label: 'Platine', x: 180, y: 50 },
        { id: 'combine', type: 'combine', label: 'Combiné', x: 180, y: 150 },
        { id: 'gache', type: 'gache', label: 'Gâche', x: 320, y: 100 }
      ],
      bornes: [
        { id: 'alim-plus', componentId: 'alim', position: 'right', label: '+', x: 90, y: 90 },
        { id: 'alim-moins', componentId: 'alim', position: 'right', label: '-', x: 90, y: 110 },
        { id: 'platine-plus', componentId: 'platine', position: 'left', label: '+', x: 150, y: 40 },
        { id: 'platine-moins', componentId: 'platine', position: 'left', label: '-', x: 150, y: 60 },
        { id: 'platine-audio', componentId: 'platine', position: 'right', label: 'A', x: 210, y: 50 },
        { id: 'combine-plus', componentId: 'combine', position: 'left', label: '+', x: 150, y: 140 },
        { id: 'combine-moins', componentId: 'combine', position: 'left', label: '-', x: 150, y: 160 },
        { id: 'combine-audio', componentId: 'combine', position: 'top', label: 'A', x: 180, y: 130 },
        { id: 'combine-gache', componentId: 'combine', position: 'right', label: 'G', x: 210, y: 150 },
        { id: 'gache-plus', componentId: 'gache', position: 'left', label: '+', x: 290, y: 90 },
        { id: 'gache-moins', componentId: 'gache', position: 'left', label: '-', x: 290, y: 110 }
      ],
      connexionsCorrectes: [
        { from: 'alim-plus', to: 'platine-plus', wireType: 'plus12v' },
        { from: 'alim-plus', to: 'combine-plus', wireType: 'plus12v' },
        { from: 'alim-moins', to: 'platine-moins', wireType: 'moins12v' },
        { from: 'alim-moins', to: 'combine-moins', wireType: 'moins12v' },
        { from: 'alim-moins', to: 'gache-moins', wireType: 'moins12v' },
        { from: 'platine-audio', to: 'combine-audio', wireType: 'data' },
        { from: 'combine-gache', to: 'gache-plus', wireType: 'commande' }
      ],
      indices: [
        'Le +12V alimente la platine et le combiné',
        'Le 0V est commun à tous les appareils',
        'Le fil audio relie platine et combiné',
        'La commande gâche part du combiné vers la gâche'
      ],
      explication: 'L\'interphone fonctionne en 12V DC. La platine et le combiné sont alimentés en parallèle. Le fil audio transmet la voix. Le bouton du combiné envoie le +12V vers la gâche pour l\'ouvrir.'
    },

    {
      id: 'digicode',
      titre: 'Digicode + Gâche',
      description: 'Ouverture de porte par code',
      difficulte: 2,
      icon: '🔢',
      dureeEstimee: '3 min',
      composants: [
        { id: 'alim', type: 'alimentation', label: 'Alim 12V', x: 50, y: 80 },
        { id: 'digicode', type: 'digicode', label: 'Digicode', x: 180, y: 80 },
        { id: 'gache', type: 'gache', label: 'Gâche', x: 320, y: 80 }
      ],
      bornes: [
        { id: 'alim-plus', componentId: 'alim', position: 'right', label: '+', x: 90, y: 70 },
        { id: 'alim-moins', componentId: 'alim', position: 'right', label: '-', x: 90, y: 90 },
        { id: 'digi-plus', componentId: 'digicode', position: 'left', label: '+', x: 150, y: 70 },
        { id: 'digi-moins', componentId: 'digicode', position: 'left', label: '-', x: 150, y: 90 },
        { id: 'digi-com', componentId: 'digicode', position: 'right', label: 'COM', x: 210, y: 70 },
        { id: 'digi-no', componentId: 'digicode', position: 'right', label: 'NO', x: 210, y: 90 },
        { id: 'gache-plus', componentId: 'gache', position: 'left', label: '+', x: 290, y: 70 },
        { id: 'gache-moins', componentId: 'gache', position: 'left', label: '-', x: 290, y: 90 }
      ],
      connexionsCorrectes: [
        { from: 'alim-plus', to: 'digi-plus', wireType: 'plus12v' },
        { from: 'alim-plus', to: 'digi-com', wireType: 'plus12v' },
        { from: 'alim-moins', to: 'digi-moins', wireType: 'moins12v' },
        { from: 'alim-moins', to: 'gache-moins', wireType: 'moins12v' },
        { from: 'digi-no', to: 'gache-plus', wireType: 'commande' }
      ],
      indices: [
        'Le digicode est alimenté en +12V et 0V',
        'COM reçoit le +12V permanent',
        'NO (Normally Open) envoie le + vers la gâche quand le code est bon',
        'Le 0V est commun au digicode et à la gâche'
      ],
      explication: 'Le digicode possède un contact sec NO (normalement ouvert). Quand le bon code est entré, NO se connecte à COM et envoie le +12V vers la gâche.'
    },

    {
      id: 'alarme-basique',
      titre: 'Alarme filaire',
      description: 'Centrale avec détecteur et sirène',
      difficulte: 4,
      icon: '🚨',
      dureeEstimee: '5 min',
      composants: [
        { id: 'alim', type: 'alimentation', label: 'Alim 12V', x: 50, y: 100 },
        { id: 'centrale', type: 'centrale', label: 'Centrale', x: 170, y: 100 },
        { id: 'detecteur', type: 'detecteur', label: 'Détecteur IR', x: 300, y: 50 },
        { id: 'sirene', type: 'sirene', label: 'Sirène', x: 300, y: 150 }
      ],
      bornes: [
        { id: 'alim-plus', componentId: 'alim', position: 'right', label: '+', x: 90, y: 90 },
        { id: 'alim-moins', componentId: 'alim', position: 'right', label: '-', x: 90, y: 110 },
        { id: 'cent-plus', componentId: 'centrale', position: 'left', label: '+', x: 140, y: 90 },
        { id: 'cent-moins', componentId: 'centrale', position: 'left', label: '-', x: 140, y: 110 },
        { id: 'cent-z1-plus', componentId: 'centrale', position: 'right', label: 'Z1+', x: 200, y: 80 },
        { id: 'cent-z1-moins', componentId: 'centrale', position: 'right', label: 'Z1-', x: 200, y: 95 },
        { id: 'cent-sir-plus', componentId: 'centrale', position: 'right', label: 'SIR+', x: 200, y: 115 },
        { id: 'cent-sir-moins', componentId: 'centrale', position: 'right', label: 'SIR-', x: 200, y: 130 },
        { id: 'det-plus', componentId: 'detecteur', position: 'left', label: '+', x: 270, y: 40 },
        { id: 'det-moins', componentId: 'detecteur', position: 'left', label: '-', x: 270, y: 60 },
        { id: 'sir-plus', componentId: 'sirene', position: 'left', label: '+', x: 270, y: 140 },
        { id: 'sir-moins', componentId: 'sirene', position: 'left', label: '-', x: 270, y: 160 }
      ],
      connexionsCorrectes: [
        { from: 'alim-plus', to: 'cent-plus', wireType: 'plus12v' },
        { from: 'alim-moins', to: 'cent-moins', wireType: 'moins12v' },
        { from: 'cent-z1-plus', to: 'det-plus', wireType: 'plus12v' },
        { from: 'cent-z1-moins', to: 'det-moins', wireType: 'moins12v' },
        { from: 'cent-sir-plus', to: 'sir-plus', wireType: 'commande' },
        { from: 'cent-sir-moins', to: 'sir-moins', wireType: 'moins12v' }
      ],
      indices: [
        'La centrale est alimentée par l\'alimentation 12V',
        'Le détecteur est câblé sur la zone 1 (Z1+ et Z1-)',
        'La sirène reçoit le + commandé et le - permanent',
        'Le 0V est commun à tous les appareils'
      ],
      explication: 'La centrale alimente les détecteurs via ses sorties de zone. En cas de détection, elle active la sortie sirène. Le câblage en étoile part de la centrale vers chaque périphérique.'
    },

    {
      id: 'controle-acces-badge',
      titre: 'Contrôle d\'accès',
      description: 'Lecteur de badge avec ventouse',
      difficulte: 4,
      icon: '🪪',
      dureeEstimee: '5 min',
      composants: [
        { id: 'alim', type: 'alimentation', label: 'Alim 12V', x: 50, y: 100 },
        { id: 'lecteur', type: 'lecteur', label: 'Lecteur', x: 180, y: 60 },
        { id: 'controleur', type: 'controleur', label: 'Contrôleur', x: 180, y: 140 },
        { id: 'ventouse', type: 'ventouse', label: 'Ventouse', x: 320, y: 100 }
      ],
      bornes: [
        { id: 'alim-plus', componentId: 'alim', position: 'right', label: '+', x: 90, y: 90 },
        { id: 'alim-moins', componentId: 'alim', position: 'right', label: '-', x: 90, y: 110 },
        { id: 'lect-plus', componentId: 'lecteur', position: 'left', label: '+', x: 150, y: 50 },
        { id: 'lect-moins', componentId: 'lecteur', position: 'left', label: '-', x: 150, y: 70 },
        { id: 'lect-d0', componentId: 'lecteur', position: 'right', label: 'D0', x: 210, y: 50 },
        { id: 'lect-d1', componentId: 'lecteur', position: 'right', label: 'D1', x: 210, y: 70 },
        { id: 'ctrl-plus', componentId: 'controleur', position: 'left', label: '+', x: 150, y: 130 },
        { id: 'ctrl-moins', componentId: 'controleur', position: 'left', label: '-', x: 150, y: 150 },
        { id: 'ctrl-d0', componentId: 'controleur', position: 'top', label: 'D0', x: 170, y: 120 },
        { id: 'ctrl-d1', componentId: 'controleur', position: 'top', label: 'D1', x: 190, y: 120 },
        { id: 'ctrl-rel', componentId: 'controleur', position: 'right', label: 'REL', x: 210, y: 140 },
        { id: 'vent-plus', componentId: 'ventouse', position: 'left', label: '+', x: 290, y: 90 },
        { id: 'vent-moins', componentId: 'ventouse', position: 'left', label: '-', x: 290, y: 110 }
      ],
      connexionsCorrectes: [
        { from: 'alim-plus', to: 'lect-plus', wireType: 'plus12v' },
        { from: 'alim-plus', to: 'ctrl-plus', wireType: 'plus12v' },
        { from: 'alim-plus', to: 'vent-plus', wireType: 'plus12v' },
        { from: 'alim-moins', to: 'lect-moins', wireType: 'moins12v' },
        { from: 'alim-moins', to: 'ctrl-moins', wireType: 'moins12v' },
        { from: 'lect-d0', to: 'ctrl-d0', wireType: 'data' },
        { from: 'lect-d1', to: 'ctrl-d1', wireType: 'data' },
        { from: 'ctrl-rel', to: 'vent-moins', wireType: 'commande' }
      ],
      indices: [
        'Tous les appareils sont alimentés en +12V',
        'Le lecteur communique avec le contrôleur via D0/D1 (Wiegand)',
        'La ventouse est alimentée en permanence (+12V)',
        'Le relais coupe le 0V de la ventouse pour ouvrir'
      ],
      explication: 'Le lecteur lit le badge et envoie le code au contrôleur via le protocole Wiegand (D0/D1). Si le badge est autorisé, le relais coupe l\'alimentation de la ventouse qui libère la porte.'
    },

    {
      id: 'portail-motorise',
      titre: 'Portail motorisé',
      description: 'Moteur avec cellules et clignotant',
      difficulte: 5,
      icon: '🚗',
      dureeEstimee: '6 min',
      composants: [
        { id: 'disj', type: 'disjoncteur', label: 'Disj. 10A', x: 50, y: 50 },
        { id: 'moteur', type: 'moteur-portail', label: 'Moteur', x: 170, y: 100 },
        { id: 'cellule-tx', type: 'cellule', label: 'Cell. TX', x: 300, y: 50 },
        { id: 'cellule-rx', type: 'cellule', label: 'Cell. RX', x: 300, y: 100 },
        { id: 'cligno', type: 'clignotant', label: 'Clignotant', x: 300, y: 160 }
      ],
      bornes: [
        { id: 'disj-L', componentId: 'disj', position: 'right', label: 'L', x: 90, y: 40 },
        { id: 'disj-N', componentId: 'disj', position: 'right', label: 'N', x: 90, y: 60 },
        { id: 'mot-L', componentId: 'moteur', position: 'left', label: 'L', x: 140, y: 90 },
        { id: 'mot-N', componentId: 'moteur', position: 'left', label: 'N', x: 140, y: 110 },
        { id: 'mot-24-plus', componentId: 'moteur', position: 'right', label: '24+', x: 200, y: 80 },
        { id: 'mot-24-moins', componentId: 'moteur', position: 'right', label: '24-', x: 200, y: 95 },
        { id: 'mot-cell', componentId: 'moteur', position: 'right', label: 'CELL', x: 200, y: 110 },
        { id: 'mot-flash', componentId: 'moteur', position: 'right', label: 'FLASH', x: 200, y: 125 },
        { id: 'tx-plus', componentId: 'cellule-tx', position: 'left', label: '+', x: 270, y: 40 },
        { id: 'tx-moins', componentId: 'cellule-tx', position: 'left', label: '-', x: 270, y: 60 },
        { id: 'rx-plus', componentId: 'cellule-rx', position: 'left', label: '+', x: 270, y: 90 },
        { id: 'rx-moins', componentId: 'cellule-rx', position: 'left', label: '-', x: 270, y: 110 },
        { id: 'rx-nc', componentId: 'cellule-rx', position: 'right', label: 'NC', x: 330, y: 100 },
        { id: 'clig-plus', componentId: 'cligno', position: 'left', label: '+', x: 270, y: 150 },
        { id: 'clig-moins', componentId: 'cligno', position: 'left', label: '-', x: 270, y: 170 }
      ],
      connexionsCorrectes: [
        { from: 'disj-L', to: 'mot-L', wireType: 'phase' },
        { from: 'disj-N', to: 'mot-N', wireType: 'neutre' },
        { from: 'mot-24-plus', to: 'tx-plus', wireType: 'plus12v' },
        { from: 'mot-24-plus', to: 'rx-plus', wireType: 'plus12v' },
        { from: 'mot-24-moins', to: 'tx-moins', wireType: 'moins12v' },
        { from: 'mot-24-moins', to: 'rx-moins', wireType: 'moins12v' },
        { from: 'rx-nc', to: 'mot-cell', wireType: 'commande' },
        { from: 'mot-flash', to: 'clig-plus', wireType: 'commande' },
        { from: 'mot-24-moins', to: 'clig-moins', wireType: 'moins12v' }
      ],
      indices: [
        'Le moteur est alimenté en 230V (L et N)',
        'Le moteur fournit du 24V pour les accessoires',
        'Les cellules TX et RX sont alimentées en parallèle',
        'Le contact NC du RX va sur l\'entrée CELL du moteur',
        'Le clignotant reçoit la commande FLASH'
      ],
      explication: 'Le moteur de portail intègre une alimentation 24V pour les accessoires. Les cellules photoélectriques détectent les obstacles : si le faisceau est coupé, le contact NC s\'ouvre et arrête le portail. Le clignotant signale le mouvement.'
    }
  ]
}

// Fonctions utilitaires
export function getCircuitById(id) {
  return raccordementsData.circuits.find(c => c.id === id)
}

export function getAllCircuits() {
  return raccordementsData.circuits
}

export function getCircuitsByDifficulty(difficulty) {
  return raccordementsData.circuits.filter(c => c.difficulte === difficulty)
}

export function getWireColors() {
  return raccordementsData.wireColors
}

// Validation des connexions
export function validateConnections(circuit, userConnections) {
  const correctConnections = circuit.connexionsCorrectes

  // Vérifier chaque connexion utilisateur
  const results = {
    correct: [],
    incorrect: [],
    missing: []
  }

  // Connexions correctes trouvées
  userConnections.forEach(userConn => {
    const isCorrect = correctConnections.some(correct =>
      (correct.from === userConn.from && correct.to === userConn.to && correct.wireType === userConn.wireType) ||
      (correct.from === userConn.to && correct.to === userConn.from && correct.wireType === userConn.wireType)
    )

    if (isCorrect) {
      results.correct.push(userConn)
    } else {
      results.incorrect.push(userConn)
    }
  })

  // Connexions manquantes
  correctConnections.forEach(correct => {
    const found = userConnections.some(user =>
      (correct.from === user.from && correct.to === user.to && correct.wireType === user.wireType) ||
      (correct.from === user.to && correct.to === user.from && correct.wireType === user.wireType)
    )

    if (!found) {
      results.missing.push(correct)
    }
  })

  return {
    ...results,
    isComplete: results.missing.length === 0 && results.incorrect.length === 0,
    score: Math.round((results.correct.length / correctConnections.length) * 100)
  }
}

// Sauvegarde progression
const PROGRESS_KEY = 'elecpro_raccordements_progress'

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveCircuitProgress(circuitId, score, completed) {
  const progress = getProgress()
  const existing = progress[circuitId] || { attempts: 0, bestScore: 0 }

  progress[circuitId] = {
    attempts: existing.attempts + 1,
    bestScore: Math.max(existing.bestScore, score),
    completed: completed || existing.completed,
    lastAttempt: Date.now()
  }

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function getOverallProgress() {
  const progress = getProgress()
  const total = raccordementsData.circuits.length
  const completed = Object.values(progress).filter(p => p.completed).length

  return { total, completed, percentage: Math.round((completed / total) * 100) }
}
