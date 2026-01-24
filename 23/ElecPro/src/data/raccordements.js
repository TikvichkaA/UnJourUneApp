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
        { id: 'disj', type: 'disjoncteur', label: 'Disj. 10A', x: 30, y: 80 },
        { id: 'inter1', type: 'va-et-vient', label: 'VV 1', x: 130, y: 80 },
        { id: 'inter2', type: 'va-et-vient', label: 'VV 2', x: 270, y: 80 },
        { id: 'lampe', type: 'lampe', label: 'Lampe', x: 380, y: 80 }
      ],
      bornes: [
        { id: 'disj-L-out', componentId: 'disj', position: 'right', label: 'L', x: 70, y: 70 },
        { id: 'disj-N-out', componentId: 'disj', position: 'right', label: 'N', x: 70, y: 90 },
        { id: 'inter1-L', componentId: 'inter1', position: 'left', label: 'L', x: 110, y: 80 },
        { id: 'inter1-1', componentId: 'inter1', position: 'right', label: '1', x: 150, y: 60 },
        { id: 'inter1-2', componentId: 'inter1', position: 'right', label: '2', x: 150, y: 100 },
        { id: 'inter2-1', componentId: 'inter2', position: 'left', label: '1', x: 250, y: 60 },
        { id: 'inter2-2', componentId: 'inter2', position: 'left', label: '2', x: 250, y: 100 },
        { id: 'inter2-L', componentId: 'inter2', position: 'right', label: 'L', x: 290, y: 80 },
        { id: 'lampe-L', componentId: 'lampe', position: 'left', label: 'L', x: 360, y: 80 },
        { id: 'lampe-N', componentId: 'lampe', position: 'right', label: 'N', x: 400, y: 80 }
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
        { id: 'disj', type: 'disjoncteur', label: 'Disj. 10A', x: 30, y: 50 },
        { id: 'teler', type: 'telerupteur', label: 'Télérupteur', x: 30, y: 140 },
        { id: 'bp1', type: 'bouton-poussoir', label: 'BP 1', x: 180, y: 50 },
        { id: 'bp2', type: 'bouton-poussoir', label: 'BP 2', x: 180, y: 140 },
        { id: 'lampe', type: 'lampe', label: 'Lampe', x: 330, y: 100 }
      ],
      bornes: [
        { id: 'disj-L-out', componentId: 'disj', position: 'right', label: 'L', x: 70, y: 40 },
        { id: 'disj-N-out', componentId: 'disj', position: 'right', label: 'N', x: 70, y: 60 },
        { id: 'teler-A1', componentId: 'teler', position: 'top', label: 'A1', x: 20, y: 120 },
        { id: 'teler-A2', componentId: 'teler', position: 'top', label: 'A2', x: 40, y: 120 },
        { id: 'teler-1', componentId: 'teler', position: 'bottom', label: '1', x: 20, y: 160 },
        { id: 'teler-2', componentId: 'teler', position: 'bottom', label: '2', x: 40, y: 160 },
        { id: 'bp1-1', componentId: 'bp1', position: 'left', label: '1', x: 160, y: 40 },
        { id: 'bp1-2', componentId: 'bp1', position: 'right', label: '2', x: 200, y: 60 },
        { id: 'bp2-1', componentId: 'bp2', position: 'left', label: '1', x: 160, y: 130 },
        { id: 'bp2-2', componentId: 'bp2', position: 'right', label: '2', x: 200, y: 150 },
        { id: 'lampe-L', componentId: 'lampe', position: 'left', label: 'L', x: 310, y: 100 },
        { id: 'lampe-N', componentId: 'lampe', position: 'right', label: 'N', x: 350, y: 100 }
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
        { id: 'disj', type: 'disjoncteur', label: 'Disj. 10A', x: 30, y: 50 },
        { id: 'minu', type: 'minuterie', label: 'Minuterie', x: 30, y: 140 },
        { id: 'bp1', type: 'bouton-poussoir', label: 'BP 1', x: 180, y: 50 },
        { id: 'bp2', type: 'bouton-poussoir', label: 'BP 2', x: 180, y: 140 },
        { id: 'lampe', type: 'lampe', label: 'Lampe', x: 330, y: 100 }
      ],
      bornes: [
        { id: 'disj-L-out', componentId: 'disj', position: 'right', label: 'L', x: 70, y: 40 },
        { id: 'disj-N-out', componentId: 'disj', position: 'right', label: 'N', x: 70, y: 60 },
        { id: 'minu-1', componentId: 'minu', position: 'top', label: '1', x: 15, y: 120 },
        { id: 'minu-2', componentId: 'minu', position: 'top', label: '2', x: 30, y: 120 },
        { id: 'minu-3', componentId: 'minu', position: 'bottom', label: '3', x: 15, y: 160 },
        { id: 'minu-4', componentId: 'minu', position: 'bottom', label: '4', x: 45, y: 160 },
        { id: 'bp1-1', componentId: 'bp1', position: 'left', label: '1', x: 160, y: 40 },
        { id: 'bp1-2', componentId: 'bp1', position: 'right', label: '2', x: 200, y: 60 },
        { id: 'bp2-1', componentId: 'bp2', position: 'left', label: '1', x: 160, y: 130 },
        { id: 'bp2-2', componentId: 'bp2', position: 'right', label: '2', x: 200, y: 150 },
        { id: 'lampe-L', componentId: 'lampe', position: 'left', label: 'L', x: 310, y: 100 },
        { id: 'lampe-N', componentId: 'lampe', position: 'right', label: 'N', x: 350, y: 100 }
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
        { id: 'disj', type: 'disjoncteur', label: 'Disj. 20A', x: 30, y: 50 },
        { id: 'contact', type: 'contacteur', label: 'Contacteur', x: 150, y: 80 },
        { id: 'disj2', type: 'disjoncteur', label: 'Disj. 2A', x: 30, y: 140 },
        { id: 'compteur', type: 'compteur', label: 'Compteur', x: 280, y: 50 },
        { id: 'ce', type: 'chauffe-eau', label: 'Chauffe-eau', x: 280, y: 140 }
      ],
      bornes: [
        { id: 'disj-L-out', componentId: 'disj', position: 'right', label: 'L', x: 70, y: 40 },
        { id: 'disj-N-out', componentId: 'disj', position: 'right', label: 'N', x: 70, y: 60 },
        { id: 'disj2-L-out', componentId: 'disj2', position: 'right', label: 'L', x: 70, y: 130 },
        { id: 'disj2-N-out', componentId: 'disj2', position: 'right', label: 'N', x: 70, y: 150 },
        { id: 'contact-1', componentId: 'contact', position: 'top', label: '1', x: 140, y: 60 },
        { id: 'contact-2', componentId: 'contact', position: 'top', label: '2', x: 160, y: 60 },
        { id: 'contact-A1', componentId: 'contact', position: 'bottom', label: 'A1', x: 140, y: 100 },
        { id: 'contact-A2', componentId: 'contact', position: 'bottom', label: 'A2', x: 160, y: 100 },
        { id: 'compteur-C1', componentId: 'compteur', position: 'bottom', label: 'C1', x: 270, y: 70 },
        { id: 'compteur-C2', componentId: 'compteur', position: 'bottom', label: 'C2', x: 290, y: 70 },
        { id: 'ce-L', componentId: 'ce', position: 'top', label: 'L', x: 270, y: 120 },
        { id: 'ce-N', componentId: 'ce', position: 'top', label: 'N', x: 290, y: 120 }
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
