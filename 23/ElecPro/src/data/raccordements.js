// Données des exercices de raccordement électrique

export const raccordementsData = {
  // Couleurs des fils
  wireColors: {
    phase: { color: '#EF4444', label: 'Phase', code: 'L' },
    neutre: { color: '#3B82F6', label: 'Neutre', code: 'N' },
    terre: { color: '#22C55E', label: 'Terre', code: 'PE' },
    retour: { color: '#F97316', label: 'Retour lampe', code: 'RL' },
    navette1: { color: '#8B5CF6', label: 'Navette 1', code: 'N1' },
    navette2: { color: '#EC4899', label: 'Navette 2', code: 'N2' }
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
