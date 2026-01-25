import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, XCircle, Trophy, RotateCcw, ChevronLeft, ChevronRight, Flag, Wrench, ClipboardCheck, Play, Square } from 'lucide-react'
import { generateExamWithTasks, calculateResultsWithTasks, saveExamResult, examConfig, categoryNames } from '../data/examen'

function ExamenSession() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dureeId = searchParams.get('duree') || 'court'
  const includeTasks = searchParams.get('taches') !== 'false'

  const [exam, setExam] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [flagged, setFlagged] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [examFinished, setExamFinished] = useState(false)
  const [results, setResults] = useState(null)
  const [showConfirmEnd, setShowConfirmEnd] = useState(false)
  const [startTime] = useState(Date.now())

  // États pour les tâches pratiques
  const [phase, setPhase] = useState('questions') // 'questions' | 'tasks' | 'results'
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [taskEvaluations, setTaskEvaluations] = useState([])
  const [taskTimeRemaining, setTaskTimeRemaining] = useState(0)
  const [taskStarted, setTaskStarted] = useState(false)
  const [taskCompleted, setTaskCompleted] = useState(false)
  const [showTaskEvaluation, setShowTaskEvaluation] = useState(false)

  // Générer l'examen au chargement
  useEffect(() => {
    const newExam = generateExamWithTasks(dureeId, includeTasks)
    if (newExam) {
      setExam(newExam)
      setAnswers(new Array(newExam.questions.length).fill(null))
      setFlagged(new Array(newExam.questions.length).fill(false))
      setTimeRemaining(newExam.duree.minutes * 60)
      if (newExam.taches) {
        setTaskEvaluations(new Array(newExam.taches.length).fill({}))
      }
    }
  }, [dureeId, includeTasks])

  // Timer principal (questions)
  useEffect(() => {
    if (!exam || examFinished || phase !== 'questions') return

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          handleFinishQuestions(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [exam, examFinished, phase])

  // Timer pour les tâches
  useEffect(() => {
    if (phase !== 'tasks' || !taskStarted || taskCompleted) return

    const interval = setInterval(() => {
      setTaskTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          handleTaskTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [phase, taskStarted, taskCompleted])

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const handleFlag = () => {
    const newFlagged = [...flagged]
    newFlagged[currentIndex] = !newFlagged[currentIndex]
    setFlagged(newFlagged)
  }

  const goToQuestion = (index) => {
    if (index >= 0 && index < exam.questions.length) {
      setCurrentIndex(index)
    }
  }

  const handleFinishQuestions = useCallback((autoSubmit = false) => {
    if (!exam) return

    // Si l'examen a des tâches, passer à la phase tâches
    if (exam.hasTasks && exam.taches && exam.taches.length > 0) {
      setPhase('tasks')
      setCurrentTaskIndex(0)
      setTaskTimeRemaining(exam.taches[0].tempsAlloue)
      setTaskStarted(false)
      setTaskCompleted(false)
      setShowTaskEvaluation(false)
    } else {
      // Sinon, terminer l'examen
      finishExam(autoSubmit)
    }
    setShowConfirmEnd(false)
  }, [exam])

  const finishExam = useCallback((autoSubmit = false) => {
    if (!exam) return

    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    const examResults = calculateResultsWithTasks(exam, answers, taskEvaluations)
    examResults.timeSpent = timeSpent
    examResults.duree = exam.duree
    examResults.autoSubmit = autoSubmit

    setResults(examResults)
    setExamFinished(true)
    setPhase('results')
    saveExamResult(examResults)
  }, [exam, answers, taskEvaluations, startTime])

  const handleStartTask = () => {
    setTaskStarted(true)
    setTaskCompleted(false)
    setShowTaskEvaluation(false)
  }

  const handleTaskTimeUp = () => {
    setTaskCompleted(true)
    setShowTaskEvaluation(true)
  }

  const handleFinishTask = () => {
    setTaskCompleted(true)
    setShowTaskEvaluation(true)
  }

  const handleCritereToggle = (critereId) => {
    const newEvaluations = [...taskEvaluations]
    if (!newEvaluations[currentTaskIndex]) {
      newEvaluations[currentTaskIndex] = {}
    }
    newEvaluations[currentTaskIndex][critereId] = !newEvaluations[currentTaskIndex][critereId]
    setTaskEvaluations(newEvaluations)
  }

  const handleNextTask = () => {
    if (currentTaskIndex < exam.taches.length - 1) {
      const nextIndex = currentTaskIndex + 1
      setCurrentTaskIndex(nextIndex)
      setTaskTimeRemaining(exam.taches[nextIndex].tempsAlloue)
      setTaskStarted(false)
      setTaskCompleted(false)
      setShowTaskEvaluation(false)
    } else {
      // Toutes les tâches terminées
      finishExam(false)
    }
  }

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const formatTimeSpent = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}min ${s}s`
  }

  if (!exam) {
    return (
      <div className="p-4">
        <Link to="/examen" className="flex items-center gap-2 text-blue-600 mb-4">
          <ArrowLeft size={20} />
          Retour
        </Link>
        <div className="card text-center py-8">
          <p className="text-gray-500">Chargement de l'examen...</p>
        </div>
      </div>
    )
  }

  // ===== ÉCRAN DE RÉSULTATS =====
  if (examFinished && results) {
    const isGreat = results.percentage >= 80
    const isPassed = results.passed

    return (
      <div className="p-4 space-y-6">
        <Link to="/examen" className="flex items-center gap-2 text-blue-600">
          <ArrowLeft size={20} />
          Retour aux examens
        </Link>

        {/* Résultat principal */}
        <div className={`card text-center py-8 ${
          isPassed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="mb-4">
            {isPassed ? (
              <Trophy size={64} className={`mx-auto ${isGreat ? 'text-yellow-500' : 'text-green-500'}`} />
            ) : (
              <XCircle size={64} className="mx-auto text-red-500" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isPassed ? (isGreat ? 'Excellent !' : 'Réussi !') : 'Non validé'}
          </h2>

          <p className="text-gray-600 mb-4">
            {results.autoSubmit ? 'Temps écoulé - ' : ''}{exam.duree.description}
          </p>

          <div className="text-5xl font-bold mb-2" style={{
            color: isPassed ? (isGreat ? '#22c55e' : '#10b981') : '#ef4444'
          }}>
            {results.percentage}%
          </div>

          <p className="text-gray-500 mb-6">
            {results.correct} / {results.total} correct{results.correct > 1 ? 's' : ''}
            {results.unanswered > 0 && ` • ${results.unanswered} sans réponse`}
          </p>

          {/* Détails si tâches */}
          {results.taskResults && results.taskResults.length > 0 && (
            <div className="bg-white rounded-xl p-4 mb-4 text-left">
              <h4 className="font-semibold text-gray-700 mb-2">Répartition</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-blue-700 font-medium">Questions</div>
                  <div className="text-gray-600">{results.correct}/{results.total} ({Math.round((results.correct/results.total)*100)}%)</div>
                </div>
                <div className="bg-teal-50 p-2 rounded">
                  <div className="text-teal-700 font-medium">Tâches</div>
                  <div className="text-gray-600">{results.taskPoints}/{results.taskMaxPoints} ({results.taskPercentage}%)</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="text-xl font-bold text-green-600">{results.correct}</div>
              <div className="text-xs text-gray-500">Corrects</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="text-xl font-bold text-red-600">{results.incorrect}</div>
              <div className="text-xs text-gray-500">Erreurs</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="text-xl font-bold text-blue-600">{formatTimeSpent(results.timeSpent)}</div>
              <div className="text-xs text-gray-500">Durée</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/examen')}
              className="w-full btn btn-primary flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Nouvel examen
            </button>
          </div>
        </div>

        {/* Résultats par catégorie */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Résultats par thème</h3>
          <div className="space-y-3">
            {Object.entries(results.byCategory)
              .filter(([_, data]) => data.total > 0)
              .sort((a, b) => a[1].percentage - b[1].percentage)
              .map(([cat, data]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{categoryNames[cat] || cat}</span>
                    <span className={`font-medium ${
                      data.percentage >= 70 ? 'text-green-600' :
                      data.percentage >= 50 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {data.correct}/{data.total} ({data.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        data.percentage >= 70 ? 'bg-green-500' :
                        data.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Résultats des tâches */}
        {results.taskResults && results.taskResults.length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Wrench size={18} />
              Tâches pratiques
            </h3>
            <div className="space-y-3">
              {results.taskResults.map((task, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${task.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{task.titre}</span>
                    <span className={`font-bold ${task.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {task.points}/{task.maxPoints}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {task.passed ? '✓ Validé' : '✗ Non validé'} ({task.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Révision des erreurs */}
        {results.answers.filter(a => !a.isCorrect && !a.isUnanswered).length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">
              Vos erreurs ({results.answers.filter(a => !a.isCorrect && !a.isUnanswered).length})
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.answers
                .filter(a => !a.isCorrect && !a.isUnanswered)
                .map((answer, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
                    <p className="text-sm font-medium text-gray-900 mb-2">{answer.question}</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-red-600">
                        ✗ Votre réponse : {answer.options[answer.userAnswer]}
                      </p>
                      <p className="text-green-600">
                        ✓ Bonne réponse : {answer.options[answer.correctAnswer]}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 italic">{answer.explication}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ===== PHASE TÂCHES PRATIQUES =====
  if (phase === 'tasks' && exam.taches) {
    const currentTask = exam.taches[currentTaskIndex]
    const isLowTime = taskTimeRemaining < 60

    // Écran d'évaluation de la tâche
    if (showTaskEvaluation) {
      const currentEval = taskEvaluations[currentTaskIndex] || {}
      let currentPoints = 0
      currentTask.criteres.forEach(c => {
        if (currentEval[c.id]) currentPoints += c.points
      })

      return (
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <div className="bg-teal-600 text-white p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-80">Évaluation</span>
              <span className="font-medium">{currentTaskIndex + 1}/{exam.taches.length}</span>
            </div>
            <h2 className="font-bold">{currentTask.titre}</h2>
          </div>

          {/* Fiche d'évaluation */}
          <div className="flex-1 p-4 space-y-4">
            <div className="card bg-teal-50 border-teal-200">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardCheck size={20} className="text-teal-600" />
                <h3 className="font-semibold text-teal-800">Fiche d'évaluation</h3>
              </div>
              <p className="text-sm text-teal-700">
                Cochez les critères réalisés correctement
              </p>
            </div>

            <div className="space-y-3">
              {currentTask.criteres.map((critere) => (
                <button
                  key={critere.id}
                  onClick={() => handleCritereToggle(critere.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    currentEval[critere.id]
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      currentEval[critere.id]
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {currentEval[critere.id] && (
                        <CheckCircle size={14} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={currentEval[critere.id] ? 'text-green-700 font-medium' : 'text-gray-700'}>
                        {critere.texte}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">({critere.points} pts)</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Score actuel */}
            <div className={`card text-center ${
              currentPoints >= currentTask.seuilReussite ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="text-3xl font-bold mb-1" style={{
                color: currentPoints >= currentTask.seuilReussite ? '#22c55e' : '#f59e0b'
              }}>
                {currentPoints} / {currentTask.pointsMax}
              </div>
              <p className="text-sm text-gray-600">
                Seuil de réussite : {currentTask.seuilReussite} pts
                {currentPoints >= currentTask.seuilReussite ? ' ✓' : ''}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t p-4">
            <button
              onClick={handleNextTask}
              className="w-full btn bg-teal-600 text-white flex items-center justify-center gap-2"
            >
              {currentTaskIndex < exam.taches.length - 1 ? (
                <>
                  Tâche suivante
                  <ChevronRight size={18} />
                </>
              ) : (
                <>
                  Voir les résultats
                  <Trophy size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )
    }

    // Écran de la tâche en cours
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header avec timer tâche */}
        <div className={`sticky top-0 z-10 p-3 ${isLowTime && taskStarted ? 'bg-red-500' : 'bg-teal-600'} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench size={18} />
              <span className="text-sm">Tâche {currentTaskIndex + 1}/{exam.taches.length}</span>
            </div>
            {taskStarted && (
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span className={`font-mono font-bold ${isLowTime ? 'animate-pulse' : ''}`}>
                  {formatTime(taskTimeRemaining)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 p-4 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">{currentTask.titre}</h2>

          <div className="card bg-blue-50 border-blue-200">
            <p className="text-blue-800">{currentTask.description}</p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Consignes</h3>
            <ul className="space-y-2">
              {currentTask.consignes.map((consigne, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span>{consigne}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card bg-amber-50 border-amber-200">
            <div className="flex items-center gap-2 text-amber-800">
              <Clock size={18} />
              <span className="font-medium">
                Temps alloué : {Math.floor(currentTask.tempsAlloue / 60)} min
                {currentTask.tempsAlloue % 60 > 0 && ` ${currentTask.tempsAlloue % 60}s`}
              </span>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              Critères d'évaluation : {currentTask.criteres.length} points à valider
            </p>
          </div>

          {/* Critères (aperçu) */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Critères d'évaluation</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              {currentTask.criteres.map((critere, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{critere.texte}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          {!taskStarted ? (
            <button
              onClick={handleStartTask}
              className="w-full btn bg-teal-600 text-white flex items-center justify-center gap-2"
            >
              <Play size={18} />
              Démarrer la tâche
            </button>
          ) : (
            <button
              onClick={handleFinishTask}
              className="w-full btn bg-green-600 text-white flex items-center justify-center gap-2"
            >
              <Square size={18} />
              J'ai terminé
            </button>
          )}
        </div>
      </div>
    )
  }

  // ===== PHASE QUESTIONS =====
  const currentQuestion = exam.questions[currentIndex]
  const answeredCount = answers.filter(a => a !== null).length
  const isLowTime = timeRemaining < 300

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header fixe avec timer */}
      <div className={`sticky top-0 z-10 p-3 ${isLowTime ? 'bg-red-500' : 'bg-blue-600'} text-white`}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowConfirmEnd(true)}
            className="text-sm opacity-80 hover:opacity-100"
          >
            ← Quitter
          </button>
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span className={`font-mono font-bold ${isLowTime ? 'animate-pulse' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <span className="text-sm">
            {currentIndex + 1}/{exam.questions.length}
          </span>
        </div>

        {/* Barre de progression */}
        <div className="h-1 bg-white/30 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${(answeredCount / exam.questions.length) * 100}%` }}
          />
        </div>

        {/* Indicateur tâches */}
        {exam.hasTasks && (
          <div className="mt-2 text-xs text-blue-200 flex items-center gap-1">
            <Wrench size={12} />
            {exam.taches.length} tâche(s) pratique(s) après les questions
          </div>
        )}
      </div>

      {/* Grille de navigation questions */}
      <div className="bg-gray-100 p-2 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {exam.questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToQuestion(idx)}
              className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                idx === currentIndex
                  ? 'bg-blue-600 text-white'
                  : answers[idx] !== null
                    ? 'bg-green-500 text-white'
                    : flagged[idx]
                      ? 'bg-amber-400 text-white'
                      : 'bg-white text-gray-600 border'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 p-4 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <span className="badge bg-gray-100 text-gray-600 text-xs">
            {categoryNames[currentQuestion.category] || currentQuestion.category}
          </span>
          <button
            onClick={handleFlag}
            className={`p-2 rounded-lg ${flagged[currentIndex] ? 'bg-amber-100 text-amber-600' : 'hover:bg-gray-100'}`}
          >
            <Flag size={18} />
          </button>
        </div>

        <h3 className="text-lg font-medium text-gray-900 leading-snug">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mt-6">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                answers[currentIndex] === idx
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  answers[currentIndex] === idx
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {answers[currentIndex] === idx && (
                    <CheckCircle size={14} className="text-white" />
                  )}
                </div>
                <span className={answers[currentIndex] === idx ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                  {option}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation bas */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <div className="flex gap-3">
          <button
            onClick={() => goToQuestion(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="flex-1 btn bg-gray-100 text-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ChevronLeft size={18} />
            Précédent
          </button>

          {currentIndex === exam.questions.length - 1 ? (
            <button
              onClick={() => setShowConfirmEnd(true)}
              className="flex-1 btn bg-green-600 text-white flex items-center justify-center gap-2"
            >
              {exam.hasTasks ? 'Passer aux tâches' : 'Terminer'}
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={() => goToQuestion(currentIndex + 1)}
              className="flex-1 btn btn-primary flex items-center justify-center gap-2"
            >
              Suivant
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {/* Status */}
        <p className="text-center text-xs text-gray-500 mt-2">
          {answeredCount}/{exam.questions.length} répondu{answeredCount > 1 ? 's' : ''}
          {flagged.filter(f => f).length > 0 && ` • ${flagged.filter(f => f).length} marquée(s)`}
        </p>
      </div>

      {/* Modal confirmation fin */}
      {showConfirmEnd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2">
              {exam.hasTasks ? 'Passer aux tâches pratiques ?' : 'Terminer l\'examen ?'}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {answers.filter(a => a === null).length > 0 ? (
                <>
                  <span className="text-amber-600 font-medium">
                    Attention : {answers.filter(a => a === null).length} question(s) sans réponse.
                  </span>
                  <br />
                </>
              ) : null}
              {exam.hasTasks
                ? `Vous passerez ensuite aux ${exam.taches.length} tâche(s) pratique(s).`
                : 'Cette action est définitive.'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmEnd(false)}
                className="flex-1 btn bg-gray-100 text-gray-700"
              >
                Continuer
              </button>
              <button
                onClick={() => handleFinishQuestions(false)}
                className="flex-1 btn bg-green-600 text-white"
              >
                {exam.hasTasks ? 'Passer aux tâches' : 'Valider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamenSession
