import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, ChevronRight, RotateCcw, Trophy, AlertTriangle } from 'lucide-react'
import { getCasPratiqueById } from '../data/casPratiques'

function CasPratiqueSession() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const casPratique = getCasPratiqueById(caseId)

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState({ correct: 0, hints: 0, total: 0 })
  const [completed, setCompleted] = useState(false)
  const [answers, setAnswers] = useState([])

  if (!casPratique) {
    return (
      <div className="p-4">
        <Link to="/cas-pratiques" className="flex items-center gap-2 text-blue-600 mb-4">
          <ArrowLeft size={20} />
          Retour
        </Link>
        <div className="card text-center py-8">
          <p className="text-gray-500">Cas pratique non trouvé</p>
        </div>
      </div>
    )
  }

  const etape = casPratique.etapes[currentStep]
  const isLastStep = currentStep === casPratique.etapes.length - 1

  const handleSelectOption = (option) => {
    if (showFeedback) return
    setSelectedOption(option)
  }

  const handleValidate = () => {
    if (!selectedOption) return

    setShowFeedback(true)
    const isCorrect = selectedOption.correct

    setAnswers([...answers, {
      step: currentStep,
      selected: selectedOption,
      correct: isCorrect,
      usedHint: showHint
    }])

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      hints: prev.hints + (showHint ? 1 : 0),
      total: prev.total + 1
    }))
  }

  const handleNext = () => {
    if (isLastStep) {
      setCompleted(true)
    } else {
      setCurrentStep(prev => prev + 1)
      setSelectedOption(null)
      setShowFeedback(false)
      setShowHint(false)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setSelectedOption(null)
    setShowFeedback(false)
    setShowHint(false)
    setScore({ correct: 0, hints: 0, total: 0 })
    setCompleted(false)
    setAnswers([])
  }

  const typeLabels = {
    observation: { label: 'Observation', color: 'bg-blue-500' },
    diagnostic: { label: 'Diagnostic', color: 'bg-purple-500' },
    verification: { label: 'Vérification', color: 'bg-amber-500' },
    solution: { label: 'Solution', color: 'bg-green-500' }
  }

  // Écran de résultat final
  if (completed) {
    const percentage = Math.round((score.correct / score.total) * 100)
    const isGreat = percentage >= 80

    return (
      <div className="p-4 space-y-6">
        <Link to="/cas-pratiques" className="flex items-center gap-2 text-blue-600">
          <ArrowLeft size={20} />
          Retour aux cas pratiques
        </Link>

        {/* Résultat */}
        <div className={`card text-center py-8 ${isGreat ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="mb-4">
            {isGreat ? (
              <Trophy size={64} className="mx-auto text-yellow-500" />
            ) : (
              <AlertTriangle size={64} className="mx-auto text-amber-500" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isGreat ? 'Excellent travail !' : 'Bon effort !'}
          </h2>

          <p className="text-gray-600 mb-4">{casPratique.titre}</p>

          <div className="text-5xl font-bold mb-2" style={{
            color: isGreat ? '#22c55e' : '#f59e0b'
          }}>
            {percentage}%
          </div>

          <p className="text-gray-500 mb-6">
            {score.correct} / {score.total} bonnes réponses
            {score.hints > 0 && ` • ${score.hints} indice(s) utilisé(s)`}
          </p>

          {/* Conclusion */}
          <div className="bg-white rounded-xl p-4 text-left mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Conclusion</h3>
            <p className="text-sm text-gray-600">{casPratique.conclusion}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRestart}
              className="w-full btn bg-teal-600 text-white flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Recommencer
            </button>
            <button
              onClick={() => navigate('/cas-pratiques')}
              className="w-full btn bg-gray-100 text-gray-700"
            >
              Autre cas pratique
            </button>
          </div>
        </div>

        {/* Récapitulatif des réponses */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif</h3>
          <div className="space-y-3">
            {answers.map((answer, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${answer.correct ? 'bg-green-50' : 'bg-red-50'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {answer.correct ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <XCircle size={16} className="text-red-600" />
                  )}
                  <span className="font-medium text-sm">
                    Étape {idx + 1}: {casPratique.etapes[idx].titre}
                  </span>
                </div>
                <p className="text-xs text-gray-600 ml-6">
                  {answer.selected.texte}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Session en cours
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-teal-600 text-white p-4">
        <div className="flex items-center justify-between mb-3">
          <Link to="/cas-pratiques" className="text-teal-200 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <span className="font-medium">{casPratique.titre}</span>
          <span className="text-sm">
            {currentStep + 1}/{casPratique.etapes.length}
          </span>
        </div>

        {/* Progression */}
        <div className="flex gap-1">
          {casPratique.etapes.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-1.5 rounded-full ${
                idx < currentStep
                  ? 'bg-green-400'
                  : idx === currentStep
                    ? 'bg-white'
                    : 'bg-teal-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 p-4 space-y-4">
        {/* Type d'étape */}
        <div className="flex items-center gap-2">
          <span className={`badge ${typeLabels[etape.type].color} text-white text-xs`}>
            {typeLabels[etape.type].label}
          </span>
          <span className="text-sm text-gray-500">{etape.titre}</span>
        </div>

        {/* Contexte */}
        <div className="card bg-gray-50 border-gray-200">
          <p className="text-sm text-gray-700 italic">{etape.contexte}</p>
        </div>

        {/* Question */}
        <h3 className="font-semibold text-gray-900 text-lg leading-snug">
          {etape.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {etape.options.map((option) => {
            const isSelected = selectedOption?.id === option.id
            const showResult = showFeedback && isSelected

            let optionClass = 'border-gray-200 bg-white'
            if (isSelected && !showFeedback) {
              optionClass = 'border-teal-500 bg-teal-50'
            }
            if (showResult) {
              optionClass = option.correct
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option)}
                disabled={showFeedback}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${optionClass}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? showResult
                        ? option.correct
                          ? 'border-green-500 bg-green-500'
                          : 'border-red-500 bg-red-500'
                        : 'border-teal-500 bg-teal-500'
                      : 'border-gray-300'
                  }`}>
                    {showResult && (
                      option.correct
                        ? <CheckCircle size={14} className="text-white" />
                        : <XCircle size={14} className="text-white" />
                    )}
                  </div>
                  <span className={`${isSelected ? 'font-medium' : ''} ${
                    showResult
                      ? option.correct ? 'text-green-700' : 'text-red-700'
                      : 'text-gray-700'
                  }`}>
                    {option.texte}
                  </span>
                </div>

                {/* Feedback */}
                {showResult && (
                  <div className={`mt-3 pt-3 border-t ${option.correct ? 'border-green-200' : 'border-red-200'}`}>
                    <p className={`text-sm ${option.correct ? 'text-green-700' : 'text-red-700'}`}>
                      {option.feedback}
                    </p>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Indice */}
        {!showFeedback && (
          <button
            onClick={() => setShowHint(true)}
            className="w-full py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-lg flex items-center justify-center gap-2"
          >
            <Lightbulb size={16} />
            {showHint ? etape.indice : 'Afficher un indice'}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        {!showFeedback ? (
          <button
            onClick={handleValidate}
            disabled={!selectedOption}
            className="w-full btn bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Valider ma réponse
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full btn bg-teal-600 text-white flex items-center justify-center gap-2"
          >
            {isLastStep ? 'Voir le résultat' : 'Étape suivante'}
            <ChevronRight size={18} />
          </button>
        )}

        {/* Score en cours */}
        <p className="text-center text-xs text-gray-500 mt-2">
          Score actuel : {score.correct}/{score.total}
        </p>
      </div>
    </div>
  )
}

export default CasPratiqueSession
