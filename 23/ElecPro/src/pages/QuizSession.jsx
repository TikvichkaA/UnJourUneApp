import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Clock } from 'lucide-react'
import { quizData, getQuestionsByCategory, getMixedQuestions } from '../data/quiz'

function QuizSession() {
  const { category } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [quizComplete, setQuizComplete] = useState(false)
  const [startTime] = useState(Date.now())

  // Charger les questions
  useEffect(() => {
    let loadedQuestions
    if (category === 'mix') {
      loadedQuestions = getMixedQuestions(20)
    } else {
      loadedQuestions = getQuestionsByCategory(category, 10)
    }
    setQuestions(loadedQuestions)
  }, [category])

  const currentQuestion = questions[currentIndex]

  const categoryInfo = category === 'mix'
    ? { titre: 'Quiz mixte', icon: '🎲' }
    : quizData.categories.find(c => c.id === category) || { titre: 'Quiz', icon: '❓' }

  const handleAnswer = (answerIndex) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
  }

  const handleValidate = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQuestion.correct
    if (isCorrect) {
      setScore(prev => prev + 1)
    }

    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      selected: selectedAnswer,
      correct: currentQuestion.correct,
      isCorrect
    }])

    setShowResult(true)
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizComplete(true)
    }
  }

  const handleRestart = () => {
    let loadedQuestions
    if (category === 'mix') {
      loadedQuestions = getMixedQuestions(20)
    } else {
      loadedQuestions = getQuestionsByCategory(category, 10)
    }
    setQuestions(loadedQuestions)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
    setQuizComplete(false)
  }

  if (questions.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Chargement des questions...</p>
      </div>
    )
  }

  // Écran de résultats
  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100)
    const elapsed = Math.round((Date.now() - startTime) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60

    return (
      <div className="p-4 space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
            <Trophy size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Quiz terminé !</h2>
        </div>

        {/* Score */}
        <div className="card text-center">
          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {score}/{questions.length}
          </div>
          <p className="text-gray-500 mt-2">{percentage}% de bonnes réponses</p>

          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <Clock size={16} />
            <span>Temps : {minutes}min {seconds}s</span>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentage >= 80 ? 'bg-green-500' :
                percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Message */}
          <p className={`mt-4 font-medium ${
            percentage >= 80 ? 'text-green-600' :
            percentage >= 60 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {percentage >= 80 ? 'Excellent ! Vous maîtrisez bien ce sujet.' :
             percentage >= 60 ? 'Bien ! Continuez à réviser.' :
             'Encore un peu de travail nécessaire.'}
          </p>
        </div>

        {/* Résumé des réponses */}
        <div className="card space-y-3">
          <h3 className="font-semibold text-gray-900">Résumé</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {answers.map((answer, idx) => {
              const q = questions.find(q => q.id === answer.questionId)
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg flex items-start gap-3 ${
                    answer.isCorrect ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {answer.isCorrect ? (
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 line-clamp-2">{q?.question}</p>
                    {!answer.isCorrect && (
                      <p className="text-xs text-green-600 mt-1">
                        Réponse : {q?.options[q?.correct]}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="btn btn-secondary flex-1 gap-2"
          >
            <RotateCcw size={18} />
            Recommencer
          </button>
          <Link to="/quiz" className="btn btn-primary flex-1">
            Autre quiz
          </Link>
        </div>
      </div>
    )
  }

  // Écran de question
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/quiz')}
            className="flex items-center gap-2 text-gray-600"
          >
            <ArrowLeft size={20} />
            <span>Quitter</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryInfo.icon}</span>
            <span className="font-medium text-gray-900">{categoryInfo.titre}</span>
          </div>
          <div className="text-sm font-medium text-blue-600">
            {currentIndex + 1}/{questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 p-4 space-y-6">
        <div className="card">
          <span className="badge badge-primary mb-3">{categoryInfo.titre}</span>
          <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let className = 'card card-hover cursor-pointer flex items-start gap-3 border-2 transition-all'

            if (showResult) {
              if (idx === currentQuestion.correct) {
                className += ' bg-green-50 border-green-500'
              } else if (idx === selectedAnswer && idx !== currentQuestion.correct) {
                className += ' bg-red-50 border-red-500'
              } else {
                className += ' border-gray-200 opacity-60'
              }
            } else if (selectedAnswer === idx) {
              className += ' border-blue-500 bg-blue-50'
            } else {
              className += ' border-gray-200 hover:border-blue-300'
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={className}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold ${
                  showResult && idx === currentQuestion.correct ? 'bg-green-500 text-white' :
                  showResult && idx === selectedAnswer ? 'bg-red-500 text-white' :
                  selectedAnswer === idx ? 'bg-blue-500 text-white' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-left flex-1 pt-1">{option}</span>
                {showResult && idx === currentQuestion.correct && (
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                )}
                {showResult && idx === selectedAnswer && idx !== currentQuestion.correct && (
                  <XCircle size={20} className="text-red-500 flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>

        {/* Explication */}
        {showResult && currentQuestion.explication && (
          <div className="card bg-blue-50 border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Explication</h4>
            <p className="text-sm text-blue-700">{currentQuestion.explication}</p>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="bg-white border-t border-gray-200 p-4 safe-area-bottom">
        {!showResult ? (
          <button
            onClick={handleValidate}
            disabled={selectedAnswer === null}
            className={`btn w-full ${
              selectedAnswer !== null ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Valider ma réponse
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn btn-primary w-full gap-2"
          >
            {currentIndex < questions.length - 1 ? (
              <>
                Question suivante
                <ArrowRight size={18} />
              </>
            ) : (
              'Voir mes résultats'
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default QuizSession
