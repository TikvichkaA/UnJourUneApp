import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calculator, CheckCircle, XCircle, Lightbulb, RotateCcw, ChevronRight } from 'lucide-react'
import { getCalculById, getCalculsByCategorie, getCategorieById } from '../data/calculs'

function CalculSession() {
  const { id } = useParams()
  const exercice = getCalculById(id)

  const [values, setValues] = useState({})
  const [userResult, setUserResult] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showExplication, setShowExplication] = useState(false)
  const [currentExemple, setCurrentExemple] = useState(0)

  useEffect(() => {
    if (exercice) {
      resetExercice()
    }
  }, [id])

  const resetExercice = () => {
    const initialValues = {}
    exercice.variables.forEach((v) => {
      if (v.type === 'fixed') {
        initialValues[v.id] = v.valeur
      } else if (v.type === 'input') {
        // Use example values if available
        if (exercice.exemples && exercice.exemples[currentExemple]) {
          initialValues[v.id] = exercice.exemples[currentExemple][v.id] || ''
        } else {
          initialValues[v.id] = ''
        }
      }
    })
    setValues(initialValues)
    setUserResult('')
    setShowResult(false)
    setIsCorrect(false)
    setShowExplication(false)
  }

  const handleInputChange = (varId, value) => {
    setValues((prev) => ({ ...prev, [varId]: parseFloat(value) || 0 }))
    setShowResult(false)
  }

  const handleResultChange = (value) => {
    setUserResult(value)
    setShowResult(false)
  }

  const checkResult = () => {
    const correctResult = exercice.calcul(values)
    const userValue = parseFloat(userResult)
    const tolerance = exercice.exemples[0]?.tolerance || 0.5

    const isWithinTolerance = Math.abs(userValue - correctResult) <= tolerance
    setIsCorrect(isWithinTolerance)
    setShowResult(true)
  }

  const loadNextExemple = () => {
    const nextIndex = (currentExemple + 1) % exercice.exemples.length
    setCurrentExemple(nextIndex)

    const newValues = { ...values }
    exercice.variables.forEach((v) => {
      if (v.type === 'input' && exercice.exemples[nextIndex][v.id] !== undefined) {
        newValues[v.id] = exercice.exemples[nextIndex][v.id]
      }
    })
    setValues(newValues)
    setUserResult('')
    setShowResult(false)
    setIsCorrect(false)
    setShowExplication(false)
  }

  if (!exercice) {
    return (
      <div className="p-4">
        <Link to="/calculs" className="flex items-center gap-2 text-blue-600 mb-4">
          <ArrowLeft size={20} />
          Retour
        </Link>
        <div className="card text-center py-8">
          <p className="text-gray-500">Exercice non trouve</p>
        </div>
      </div>
    )
  }

  const categorie = getCategorieById(exercice.categorie)
  const correctResult = exercice.calcul(values)
  const resultVar = exercice.variables.find((v) => v.type === 'result')

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/calculs" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div className="text-center flex-1">
          <h1 className="font-semibold text-gray-900">{exercice.titre}</h1>
          <p className="text-sm text-gray-500">{categorie?.nom}</p>
        </div>
        <button
          onClick={() => setShowExplication(!showExplication)}
          className={`p-2 rounded-lg ${showExplication ? 'bg-amber-100 text-amber-600' : 'hover:bg-gray-100'}`}
        >
          <Lightbulb size={20} />
        </button>
      </div>

      {/* Formule */}
      <div className="card bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center">
        <p className="text-sm opacity-80 mb-1">Formule</p>
        <p className="text-2xl font-mono font-bold">{exercice.formule}</p>
      </div>

      {/* Explication */}
      {showExplication && (
        <div className="card bg-amber-50 border-amber-200">
          <div className="flex items-start gap-2">
            <Lightbulb className="text-amber-500 flex-shrink-0 mt-1" size={18} />
            <p className="text-sm text-gray-700">{exercice.explication}</p>
          </div>
        </div>
      )}

      {/* Variables d'entree */}
      <div className="card space-y-4">
        <h3 className="font-medium text-gray-900">Donnees</h3>

        {exercice.variables
          .filter((v) => v.type !== 'result')
          .map((variable) => (
            <div key={variable.id} className="flex items-center gap-3">
              <label className="flex-1 text-gray-700">
                {variable.nom}
                {variable.type === 'fixed' && (
                  <span className="text-xs text-gray-400 ml-1">(fixe)</span>
                )}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={values[variable.id] || ''}
                  onChange={(e) => handleInputChange(variable.id, e.target.value)}
                  disabled={variable.type === 'fixed'}
                  className={`w-24 px-3 py-2 border rounded-lg text-right font-mono ${
                    variable.type === 'fixed'
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-white focus:ring-2 focus:ring-blue-500'
                  }`}
                  step="any"
                />
                <span className="text-sm text-gray-500 w-12">{variable.unite}</span>
              </div>
            </div>
          ))}
      </div>

      {/* Calcul du resultat */}
      <div className="card space-y-4">
        <h3 className="font-medium text-gray-900">Resultat</h3>

        <div className="flex items-center gap-3">
          <label className="flex-1 text-gray-700 font-medium">
            {resultVar?.nom}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={userResult}
              onChange={(e) => handleResultChange(e.target.value)}
              placeholder="?"
              className={`w-24 px-3 py-2 border-2 rounded-lg text-right font-mono text-lg ${
                showResult
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-blue-300 focus:border-blue-500'
              }`}
              step="any"
            />
            <span className="text-sm text-gray-500 w-12">{resultVar?.unite}</span>
          </div>
        </div>

        <button
          onClick={checkResult}
          disabled={!userResult}
          className="w-full btn btn-primary flex items-center justify-center gap-2"
        >
          <Calculator size={18} />
          Verifier
        </button>
      </div>

      {/* Resultat de la verification */}
      {showResult && (
        <div className={`card ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
            ) : (
              <XCircle className="text-red-500 flex-shrink-0" size={24} />
            )}
            <div>
              <p className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Correct !' : 'Pas tout a fait...'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Resultat attendu: <span className="font-mono font-bold">{correctResult.toFixed(resultVar?.decimales || 2)} {resultVar?.unite}</span>
              </p>
              {!isCorrect && (
                <p className="text-sm text-gray-500 mt-1">
                  Votre reponse: {parseFloat(userResult).toFixed(resultVar?.decimales || 2)} {resultVar?.unite}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={resetExercice}
          className="flex-1 btn bg-gray-100 text-gray-700 flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          Reinitialiser
        </button>

        {exercice.exemples.length > 1 && (
          <button
            onClick={loadNextExemple}
            className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
          >
            Exemple suivant
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Exercices similaires */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">Autres exercices</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {getCalculsByCategorie(exercice.categorie)
            .filter((c) => c.id !== exercice.id)
            .slice(0, 3)
            .map((autreExo) => (
              <Link
                key={autreExo.id}
                to={`/calculs/${autreExo.id}`}
                className="flex-shrink-0 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200"
              >
                {autreExo.titre}
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

export default CalculSession
