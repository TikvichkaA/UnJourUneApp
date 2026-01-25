// Configuration et génération des examens blancs
import { quizData, shuffleQuestions } from './quiz'

export const examConfig = {
  durees: [
    { id: 'express', label: '15 min', minutes: 15, questions: 10, description: 'Révision rapide' },
    { id: 'court', label: '30 min', minutes: 30, questions: 20, description: 'Entraînement court' },
    { id: 'moyen', label: '1 heure', minutes: 60, questions: 40, description: 'Examen standard' },
    { id: 'complet', label: '2 heures', minutes: 120, questions: 80, description: 'Simulation complète' }
  ],
  seuilReussite: 70, // Pourcentage minimum pour réussir
  // Répartition des questions par catégorie (en %)
  repartition: {
    normes: 25,
    habilitations: 20,
    pratique: 20,
    calculs: 15,
    schemas: 10,
    'courants-faibles': 5,
    raccordements: 5
  }
}

// Génère un examen avec répartition pondérée
export function generateExam(dureeId) {
  const duree = examConfig.durees.find(d => d.id === dureeId)
  if (!duree) return null

  const totalQuestions = duree.questions
  const questions = []
  const categoryCounts = {}

  // Calculer le nombre de questions par catégorie
  Object.entries(examConfig.repartition).forEach(([categoryId, percentage]) => {
    categoryCounts[categoryId] = Math.round((percentage / 100) * totalQuestions)
  })

  // Ajuster pour atteindre exactement le nombre total
  let currentTotal = Object.values(categoryCounts).reduce((a, b) => a + b, 0)
  while (currentTotal < totalQuestions) {
    // Ajouter aux catégories principales
    categoryCounts['normes']++
    currentTotal++
  }
  while (currentTotal > totalQuestions) {
    // Retirer des catégories secondaires
    if (categoryCounts['courants-faibles'] > 0) {
      categoryCounts['courants-faibles']--
      currentTotal--
    } else if (categoryCounts['raccordements'] > 0) {
      categoryCounts['raccordements']--
      currentTotal--
    }
  }

  // Sélectionner les questions pour chaque catégorie
  Object.entries(categoryCounts).forEach(([categoryId, count]) => {
    const categoryQuestions = quizData.questions.filter(q => q.category === categoryId)
    const shuffled = shuffleQuestions(categoryQuestions)
    questions.push(...shuffled.slice(0, count))
  })

  // Mélanger toutes les questions
  return {
    id: `exam-${Date.now()}`,
    duree: duree,
    questions: shuffleQuestions(questions),
    createdAt: new Date().toISOString()
  }
}

// Calcule les résultats détaillés
export function calculateResults(exam, answers) {
  const results = {
    total: exam.questions.length,
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    percentage: 0,
    passed: false,
    byCategory: {},
    timeSpent: 0,
    answers: []
  }

  // Initialiser les stats par catégorie
  const categories = [...new Set(exam.questions.map(q => q.category))]
  categories.forEach(cat => {
    results.byCategory[cat] = { total: 0, correct: 0, percentage: 0 }
  })

  // Analyser chaque réponse
  exam.questions.forEach((question, index) => {
    const userAnswer = answers[index]
    const isCorrect = userAnswer === question.correct
    const isUnanswered = userAnswer === null || userAnswer === undefined

    results.byCategory[question.category].total++

    if (isUnanswered) {
      results.unanswered++
    } else if (isCorrect) {
      results.correct++
      results.byCategory[question.category].correct++
    } else {
      results.incorrect++
    }

    results.answers.push({
      questionId: question.id,
      question: question.question,
      category: question.category,
      userAnswer,
      correctAnswer: question.correct,
      isCorrect,
      isUnanswered,
      options: question.options,
      explication: question.explication
    })
  })

  // Calculer les pourcentages
  results.percentage = Math.round((results.correct / results.total) * 100)
  results.passed = results.percentage >= examConfig.seuilReussite

  Object.keys(results.byCategory).forEach(cat => {
    const catStats = results.byCategory[cat]
    catStats.percentage = catStats.total > 0
      ? Math.round((catStats.correct / catStats.total) * 100)
      : 0
  })

  return results
}

// Sauvegarde un résultat d'examen
const EXAM_HISTORY_KEY = 'elecpro-exam-history'

export function saveExamResult(result) {
  try {
    const history = getExamHistory()
    history.unshift({
      ...result,
      savedAt: new Date().toISOString()
    })
    // Garder uniquement les 20 derniers examens
    const trimmed = history.slice(0, 20)
    localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(trimmed))
  } catch (e) {
    console.error('Erreur sauvegarde examen:', e)
  }
}

export function getExamHistory() {
  try {
    return JSON.parse(localStorage.getItem(EXAM_HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

export function clearExamHistory() {
  localStorage.removeItem(EXAM_HISTORY_KEY)
}

// Obtenir les statistiques globales
export function getExamStats() {
  const history = getExamHistory()
  if (history.length === 0) return null

  const stats = {
    totalExams: history.length,
    averageScore: 0,
    passRate: 0,
    bestScore: 0,
    worstScore: 100,
    recentTrend: [],
    weakCategories: {}
  }

  let totalScore = 0
  let passedCount = 0

  history.forEach(exam => {
    totalScore += exam.percentage
    if (exam.passed) passedCount++
    if (exam.percentage > stats.bestScore) stats.bestScore = exam.percentage
    if (exam.percentage < stats.worstScore) stats.worstScore = exam.percentage

    // Accumuler les stats par catégorie
    if (exam.byCategory) {
      Object.entries(exam.byCategory).forEach(([cat, data]) => {
        if (!stats.weakCategories[cat]) {
          stats.weakCategories[cat] = { total: 0, correct: 0 }
        }
        stats.weakCategories[cat].total += data.total
        stats.weakCategories[cat].correct += data.correct
      })
    }
  })

  stats.averageScore = Math.round(totalScore / history.length)
  stats.passRate = Math.round((passedCount / history.length) * 100)

  // Calculer les pourcentages par catégorie et identifier les points faibles
  Object.keys(stats.weakCategories).forEach(cat => {
    const data = stats.weakCategories[cat]
    data.percentage = data.total > 0
      ? Math.round((data.correct / data.total) * 100)
      : 0
  })

  // Trend des 5 derniers examens
  stats.recentTrend = history.slice(0, 5).map(e => e.percentage).reverse()

  return stats
}

// Noms des catégories pour l'affichage
export const categoryNames = {
  normes: 'NF C 15-100',
  habilitations: 'Habilitations',
  pratique: 'Pratique terrain',
  calculs: 'Calculs',
  schemas: 'Schémas',
  'courants-faibles': 'Courants Faibles',
  raccordements: 'Raccordements',
  outillage: 'Outillage',
  taches: 'Tâches pratiques'
}

// ===== TÂCHES PRATIQUES AVEC ÉVALUATION =====
export const tachesPratiques = [
  {
    id: 'tache-vaet-vient',
    type: 'tache',
    category: 'taches',
    titre: 'Câbler un va-et-vient',
    description: 'Réalisez le câblage complet d\'un montage va-et-vient sur la platine d\'entraînement.',
    consignes: [
      'Utilisez les interrupteurs et la lampe fournis',
      'Respectez le code couleur des conducteurs',
      'Vérifiez le fonctionnement avant validation'
    ],
    tempsAlloue: 600, // 10 minutes en secondes
    criteres: [
      { id: 'c1', texte: 'Phase correctement raccordée sur L du 1er interrupteur', points: 2 },
      { id: 'c2', texte: 'Navettes correctement câblées entre les deux interrupteurs', points: 3 },
      { id: 'c3', texte: 'Retour lampe correctement raccordé', points: 2 },
      { id: 'c4', texte: 'Neutre direct au luminaire', points: 1 },
      { id: 'c5', texte: 'Conducteur PE raccordé (si luminaire classe I)', points: 1 },
      { id: 'c6', texte: 'Fonctionnement correct depuis les deux points', points: 3 },
      { id: 'c7', texte: 'Câblage propre et serrage correct', points: 2 }
    ],
    pointsMax: 14,
    seuilReussite: 10
  },
  {
    id: 'tache-telerupteur',
    type: 'tache',
    category: 'taches',
    titre: 'Câbler un télérupteur',
    description: 'Réalisez le câblage d\'un télérupteur avec 3 boutons poussoirs commandant un point lumineux.',
    consignes: [
      'Utilisez le télérupteur modulaire fourni',
      'Raccordez les 3 boutons poussoirs en parallèle',
      'Vérifiez le fonctionnement depuis chaque bouton'
    ],
    tempsAlloue: 720, // 12 minutes
    criteres: [
      { id: 'c1', texte: 'Alimentation A1 du télérupteur correcte', points: 2 },
      { id: 'c2', texte: 'Boutons poussoirs câblés en parallèle sur A2', points: 3 },
      { id: 'c3', texte: 'Sortie 1-2 du télérupteur vers le luminaire', points: 2 },
      { id: 'c4', texte: 'Neutre au luminaire', points: 1 },
      { id: 'c5', texte: 'Fonctionnement depuis les 3 boutons', points: 3 },
      { id: 'c6', texte: 'Câblage propre', points: 1 }
    ],
    pointsMax: 12,
    seuilReussite: 8
  },
  {
    id: 'tache-prise',
    type: 'tache',
    category: 'taches',
    titre: 'Installer une prise de courant',
    description: 'Raccordez une prise de courant 2P+T en respectant les règles de l\'art.',
    consignes: [
      'Dénudez les conducteurs à la bonne longueur',
      'Respectez le serrage au couple si clé dynamométrique disponible',
      'Vérifiez la continuité après raccordement'
    ],
    tempsAlloue: 300, // 5 minutes
    criteres: [
      { id: 'c1', texte: 'Phase sur la borne L (droite vue de face)', points: 2 },
      { id: 'c2', texte: 'Neutre sur la borne N (gauche)', points: 2 },
      { id: 'c3', texte: 'Terre sur la borne centrale', points: 2 },
      { id: 'c4', texte: 'Longueur de dénudage correcte (pas de cuivre visible)', points: 2 },
      { id: 'c5', texte: 'Serrage correct des bornes', points: 2 },
      { id: 'c6', texte: 'Prise correctement fixée', points: 1 }
    ],
    pointsMax: 11,
    seuilReussite: 8
  },
  {
    id: 'tache-tableau',
    type: 'tache',
    category: 'taches',
    titre: 'Raccorder un disjoncteur au tableau',
    description: 'Ajoutez un disjoncteur 16A pour un nouveau circuit prises et raccordez-le au DDR.',
    consignes: [
      'Installez le disjoncteur sur le rail DIN',
      'Raccordez-le au peigne ou au DDR en tête',
      'Identifiez le circuit'
    ],
    tempsAlloue: 480, // 8 minutes
    criteres: [
      { id: 'c1', texte: 'Disjoncteur correctement clipsé sur le rail', points: 1 },
      { id: 'c2', texte: 'Alimentation depuis le DDR correcte (Ph + N)', points: 3 },
      { id: 'c3', texte: 'Raccordement du circuit en sortie', points: 2 },
      { id: 'c4', texte: 'Serrage correct de toutes les bornes', points: 2 },
      { id: 'c5', texte: 'Repérage du circuit (étiquette)', points: 1 },
      { id: 'c6', texte: 'Test de déclenchement manuel OK', points: 1 }
    ],
    pointsMax: 10,
    seuilReussite: 7
  },
  {
    id: 'tache-mesure-terre',
    type: 'tache',
    category: 'taches',
    titre: 'Mesurer la continuité PE',
    description: 'Effectuez une mesure de continuité du conducteur de protection entre le tableau et une prise.',
    consignes: [
      'Utilisez l\'ohmmètre ou le contrôleur d\'installation',
      'Identifiez les points de mesure',
      'Notez la valeur obtenue'
    ],
    tempsAlloue: 300, // 5 minutes
    criteres: [
      { id: 'c1', texte: 'Appareil correctement configuré (mode Ω)', points: 2 },
      { id: 'c2', texte: 'Points de mesure corrects (barrette PE et prise)', points: 2 },
      { id: 'c3', texte: 'Valeur obtenue cohérente (< 2Ω)', points: 3 },
      { id: 'c4', texte: 'Interprétation correcte du résultat', points: 2 },
      { id: 'c5', texte: 'Appareil remis en état après mesure', points: 1 }
    ],
    pointsMax: 10,
    seuilReussite: 7
  },
  {
    id: 'tache-test-ddr',
    type: 'tache',
    category: 'taches',
    titre: 'Tester un DDR 30mA',
    description: 'Vérifiez le fonctionnement d\'un interrupteur différentiel avec le testeur approprié.',
    consignes: [
      'Utilisez le testeur de DDR ou le contrôleur multifonction',
      'Testez le déclenchement à différents seuils',
      'Vérifiez le temps de déclenchement'
    ],
    tempsAlloue: 420, // 7 minutes
    criteres: [
      { id: 'c1', texte: 'Appareil branché correctement', points: 2 },
      { id: 'c2', texte: 'Test à 30mA : déclenchement effectif', points: 3 },
      { id: 'c3', texte: 'Temps de déclenchement < 300ms', points: 2 },
      { id: 'c4', texte: 'Test du bouton test également effectué', points: 1 },
      { id: 'c5', texte: 'Réarmement et remise en service', points: 1 },
      { id: 'c6', texte: 'Conclusion correcte sur l\'état du DDR', points: 2 }
    ],
    pointsMax: 11,
    seuilReussite: 8
  },
  {
    id: 'tache-rj45',
    type: 'tache',
    category: 'taches',
    titre: 'Raccorder une prise RJ45',
    description: 'Raccordez un câble réseau sur une prise RJ45 en respectant le schéma T568A ou T568B.',
    consignes: [
      'Utilisez l\'outil de sertissage LSA ou le système à clapets',
      'Respectez le schéma de couleurs choisi',
      'Vérifiez la connexion avec le testeur'
    ],
    tempsAlloue: 480, // 8 minutes
    criteres: [
      { id: 'c1', texte: 'Dégainage correct du câble (longueur adaptée)', points: 1 },
      { id: 'c2', texte: 'Paires non détorsadées au minimum nécessaire', points: 2 },
      { id: 'c3', texte: 'Ordre des couleurs correct (T568A ou T568B)', points: 3 },
      { id: 'c4', texte: 'Insertion complète des conducteurs', points: 2 },
      { id: 'c5', texte: 'Test de continuité OK (8 fils)', points: 2 },
      { id: 'c6', texte: 'Prise proprement fermée et fixée', points: 1 }
    ],
    pointsMax: 11,
    seuilReussite: 8
  },
  {
    id: 'tache-saignee',
    type: 'tache',
    category: 'taches',
    titre: 'Repérer un tracé de saignée',
    description: 'Sur le plan fourni, tracez le cheminement des canalisations pour alimenter une prise depuis le tableau.',
    consignes: [
      'Respectez les zones de passage normalisées',
      'Indiquez les hauteurs de passage',
      'Optimisez le trajet'
    ],
    tempsAlloue: 360, // 6 minutes
    criteres: [
      { id: 'c1', texte: 'Tracé dans les zones normalisées (20cm des angles)', points: 3 },
      { id: 'c2', texte: 'Passage horizontal à 30cm max du sol ou plafond', points: 2 },
      { id: 'c3', texte: 'Passage vertical d\'aplomb des points', points: 2 },
      { id: 'c4', texte: 'Trajet optimisé (longueur raisonnable)', points: 1 },
      { id: 'c5', texte: 'Cotations indiquées', points: 1 }
    ],
    pointsMax: 9,
    seuilReussite: 6
  }
]

// Génère un examen avec tâches pratiques
export function generateExamWithTasks(dureeId, includeTasks = true) {
  const baseExam = generateExam(dureeId)
  if (!baseExam) return null

  if (!includeTasks) return baseExam

  // Ajouter des tâches selon la durée
  const taskCount = {
    'express': 1,
    'court': 2,
    'moyen': 3,
    'complet': 4
  }

  const numTasks = taskCount[dureeId] || 1
  const shuffledTasks = [...tachesPratiques].sort(() => Math.random() - 0.5)
  const selectedTasks = shuffledTasks.slice(0, numTasks)

  return {
    ...baseExam,
    taches: selectedTasks,
    hasTasks: true
  }
}

// Calcule les résultats avec tâches
export function calculateResultsWithTasks(exam, answers, taskEvaluations) {
  const baseResults = calculateResults(exam, answers)

  if (!exam.hasTasks || !taskEvaluations) {
    return baseResults
  }

  // Calculer les résultats des tâches
  let taskPoints = 0
  let taskMaxPoints = 0
  const taskResults = []

  exam.taches.forEach((tache, idx) => {
    const evaluation = taskEvaluations[idx] || {}
    let points = 0

    tache.criteres.forEach(critere => {
      if (evaluation[critere.id]) {
        points += critere.points
      }
    })

    taskMaxPoints += tache.pointsMax
    taskPoints += points

    taskResults.push({
      id: tache.id,
      titre: tache.titre,
      points,
      maxPoints: tache.pointsMax,
      passed: points >= tache.seuilReussite,
      percentage: Math.round((points / tache.pointsMax) * 100)
    })
  })

  // Combiner les résultats (60% questions, 40% tâches si présentes)
  const questionWeight = 0.6
  const taskWeight = 0.4
  const questionPercentage = baseResults.percentage
  const taskPercentage = taskMaxPoints > 0 ? Math.round((taskPoints / taskMaxPoints) * 100) : 0

  const combinedPercentage = Math.round(
    (questionPercentage * questionWeight) + (taskPercentage * taskWeight)
  )

  return {
    ...baseResults,
    taskResults,
    taskPoints,
    taskMaxPoints,
    taskPercentage,
    combinedPercentage,
    percentage: combinedPercentage,
    passed: combinedPercentage >= examConfig.seuilReussite,
    byCategory: {
      ...baseResults.byCategory,
      taches: {
        total: exam.taches.length,
        correct: taskResults.filter(t => t.passed).length,
        percentage: taskPercentage
      }
    }
  }
}
