import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Lightbulb, Trophy } from 'lucide-react'
import Flashcard from '../components/Flashcard'
import {
  getCategoryById,
  getSymbolesByCategory,
  getAllSymboles,
  shuffleArray,
  saveProgress,
  getProgress
} from '../data/symboles'

function SymbolesFlashcards() {
  const { category } = useParams()
  const navigate = useNavigate()

  const [symbols, setSymbols] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState({ known: 0, toReview: 0 })
  const [showHints, setShowHints] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [categoryInfo, setCategoryInfo] = useState(null)

  useEffect(() => {
    let symbolsList = []

    if (category === 'all') {
      // Tous les symboles mélangés
      symbolsList = shuffleArray(getAllSymboles())
      setCategoryInfo({ titre: 'Tous les symboles', icon: '📚' })
    } else if (category === 'review') {
      // Seulement les symboles à revoir
      const progress = getProgress()
      symbolsList = getAllSymboles().filter(s => progress[s.id] && !progress[s.id].known)
      symbolsList = shuffleArray(symbolsList)
      setCategoryInfo({ titre: 'À revoir', icon: '🔄' })
    } else {
      // Catégorie spécifique
      const catInfo = getCategoryById(category)
      if (catInfo) {
        setCategoryInfo(catInfo)
        symbolsList = shuffleArray(getSymbolesByCategory(category))
      }
    }

    setSymbols(symbolsList)
    setCurrentIndex(0)
    setResults({ known: 0, toReview: 0 })
    setSessionComplete(false)
  }, [category])

  const handleResult = (known) => {
    const currentSymbol = symbols[currentIndex]

    // Sauvegarder la progression
    saveProgress(currentSymbol.id, known)

    // Mettre à jour les résultats de la session
    setResults(prev => ({
      known: prev.known + (known ? 1 : 0),
      toReview: prev.toReview + (known ? 0 : 1)
    }))

    // Passer au symbole suivant ou terminer
    if (currentIndex < symbols.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setSessionComplete(true)
    }
  }

  const restartSession = () => {
    setSymbols(shuffleArray([...symbols]))
    setCurrentIndex(0)
    setResults({ known: 0, toReview: 0 })
    setSessionComplete(false)
  }

  const reviewMistakes = () => {
    const progress = getProgress()
    const toReviewSymbols = symbols.filter(s => progress[s.id] && !progress[s.id].known)

    if (toReviewSymbols.length > 0) {
      setSymbols(shuffleArray(toReviewSymbols))
      setCurrentIndex(0)
      setResults({ known: 0, toReview: 0 })
      setSessionComplete(false)
    }
  }

  if (symbols.length === 0) {
    return (
      <div className="p-4">
        <Link to="/symboles" className="flex items-center gap-2 text-blue-600 mb-4">
          <ArrowLeft size={20} />
          Retour
        </Link>
        <div className="card text-center py-8">
          <p className="text-gray-500">Aucun symbole à réviser</p>
          <Link to="/symboles" className="btn btn-primary mt-4">
            Choisir une catégorie
          </Link>
        </div>
      </div>
    )
  }

  // Écran de fin de session
  if (sessionComplete) {
    const percentage = Math.round((results.known / symbols.length) * 100)
    const isGreat = percentage >= 80
    const isGood = percentage >= 60

    return (
      <div className="p-4 space-y-6">
        <Link to="/symboles" className="flex items-center gap-2 text-blue-600">
          <ArrowLeft size={20} />
          Retour aux catégories
        </Link>

        <div className={`card text-center py-8 ${
          isGreat ? 'bg-green-50 border-green-200' :
          isGood ? 'bg-amber-50 border-amber-200' :
          'bg-red-50 border-red-200'
        }`}>
          <div className="mb-4">
            {isGreat ? (
              <Trophy size={64} className="mx-auto text-green-500" />
            ) : isGood ? (
              <CheckCircle size={64} className="mx-auto text-amber-500" />
            ) : (
              <RotateCcw size={64} className="mx-auto text-red-500" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Session terminée !
          </h2>

          <p className="text-gray-600 mb-6">
            {categoryInfo?.titre}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-green-600">{results.known}</div>
              <div className="text-sm text-gray-500">Acquis</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-red-600">{results.toReview}</div>
              <div className="text-sm text-gray-500">À revoir</div>
            </div>
          </div>

          <div className="text-4xl font-bold mb-2" style={{
            color: isGreat ? '#22c55e' : isGood ? '#f59e0b' : '#ef4444'
          }}>
            {percentage}%
          </div>
          <p className="text-sm text-gray-500 mb-6">de réussite</p>

          <div className="space-y-3">
            <button
              onClick={restartSession}
              className="w-full btn btn-primary flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Recommencer
            </button>

            {results.toReview > 0 && (
              <button
                onClick={reviewMistakes}
                className="w-full btn btn-secondary flex items-center justify-center gap-2"
              >
                <XCircle size={18} />
                Revoir les erreurs ({results.toReview})
              </button>
            )}

            <Link to="/symboles" className="block w-full btn bg-gray-100 text-gray-700">
              Autres catégories
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentSymbol = symbols[currentIndex]

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/symboles" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div className="text-center">
          <h2 className="font-semibold text-gray-900">
            {categoryInfo?.icon} {categoryInfo?.titre}
          </h2>
          <p className="text-sm text-gray-500">
            {currentIndex + 1} / {symbols.length}
          </p>
        </div>
        <button
          onClick={() => setShowHints(!showHints)}
          className={`p-2 rounded-lg ${showHints ? 'bg-amber-100 text-amber-600' : 'hover:bg-gray-100'}`}
        >
          <Lightbulb size={20} />
        </button>
      </div>

      {/* Barre de progression */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
          style={{ width: `${((currentIndex) / symbols.length) * 100}%` }}
        />
      </div>

      {/* Stats de session */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle size={16} />
          <span>{results.known}</span>
        </div>
        <div className="flex items-center gap-1 text-red-600">
          <XCircle size={16} />
          <span>{results.toReview}</span>
        </div>
      </div>

      {/* Flashcard */}
      <div className="pt-4">
        <Flashcard
          key={currentSymbol.id}
          symbol={currentSymbol}
          onResult={handleResult}
          showHint={showHints}
        />
      </div>
    </div>
  )
}

export default SymbolesFlashcards
