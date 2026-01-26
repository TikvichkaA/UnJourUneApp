import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Trophy, XCircle, CheckCircle, HelpCircle, Eye, EyeOff } from 'lucide-react'
import { getErreurVisuelleById } from '../data/erreursVisuelles'

function ErreurVisuelleSession() {
  const { exerciceId } = useParams()
  const navigate = useNavigate()
  const exercice = getErreurVisuelleById(exerciceId)

  const [foundErrors, setFoundErrors] = useState([])
  const [wrongClicks, setWrongClicks] = useState(0)
  const [selectedError, setSelectedError] = useState(null)
  const [showAllZones, setShowAllZones] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [clickFeedback, setClickFeedback] = useState(null)

  useEffect(() => {
    // Reset on exercice change
    setFoundErrors([])
    setWrongClicks(0)
    setSelectedError(null)
    setShowAllZones(false)
    setIsComplete(false)
  }, [exerciceId])

  if (!exercice) {
    return (
      <div className="p-4">
        <Link to="/erreurs-visuelles" className="flex items-center gap-2 text-blue-600 mb-4">
          <ArrowLeft size={20} />
          Retour
        </Link>
        <div className="card text-center py-8">
          <p className="text-gray-500">Exercice non trouvé</p>
        </div>
      </div>
    )
  }

  const handleSvgClick = (e) => {
    if (isComplete) return

    // Obtenir les coordonnées du clic dans le SVG
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const scaleX = parseFloat(exercice.viewBox.split(' ')[2]) / rect.width
    const scaleY = parseFloat(exercice.viewBox.split(' ')[3]) / rect.height

    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    // Vérifier si le clic touche une zone d'erreur
    let foundError = null
    for (const erreur of exercice.erreurs) {
      const zone = erreur.zone
      if (
        x >= zone.x && x <= zone.x + zone.width &&
        y >= zone.y && y <= zone.y + zone.height
      ) {
        foundError = erreur
        break
      }
    }

    if (foundError) {
      // Erreur trouvée !
      if (!foundErrors.includes(foundError.id)) {
        const newFoundErrors = [...foundErrors, foundError.id]
        setFoundErrors(newFoundErrors)
        setSelectedError(foundError)
        setClickFeedback({ type: 'success', x, y })

        // Vérifier si toutes les erreurs sont trouvées
        if (newFoundErrors.length === exercice.erreurs.length) {
          setIsComplete(true)
          saveProgress()
        }
      } else {
        // Déjà trouvée
        setSelectedError(foundError)
      }
    } else {
      // Mauvais clic
      setWrongClicks(prev => prev + 1)
      setClickFeedback({ type: 'error', x, y })
      setSelectedError(null)
    }

    // Effacer le feedback après un court délai
    setTimeout(() => setClickFeedback(null), 500)
  }

  const saveProgress = () => {
    try {
      const progress = JSON.parse(localStorage.getItem('elecpro-erreurs-visuelles') || '{}')
      const score = Math.max(0, 100 - (wrongClicks * 5))
      const existing = progress[exerciceId] || {}

      progress[exerciceId] = {
        completed: true,
        bestScore: Math.max(existing.bestScore || 0, score),
        lastAttempt: new Date().toISOString()
      }

      localStorage.setItem('elecpro-erreurs-visuelles', JSON.stringify(progress))
    } catch (e) {
      console.error('Error saving progress:', e)
    }
  }

  const handleReset = () => {
    setFoundErrors([])
    setWrongClicks(0)
    setSelectedError(null)
    setShowAllZones(false)
    setIsComplete(false)
  }

  const score = Math.max(0, 100 - (wrongClicks * 5))

  // Écran de réussite
  if (isComplete) {
    return (
      <div className="p-4 space-y-6">
        <Link to="/erreurs-visuelles" className="flex items-center gap-2 text-blue-600">
          <ArrowLeft size={20} />
          Retour aux exercices
        </Link>

        <div className="card bg-green-50 border-green-200 text-center py-8">
          <Trophy size={64} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Toutes les erreurs trouvées !
          </h2>
          <p className="text-gray-600 mb-4">{exercice.titre}</p>

          <div className="text-4xl font-bold text-green-600 mb-2">
            {score}%
          </div>
          <p className="text-sm text-gray-500 mb-6">
            {wrongClicks === 0
              ? 'Sans faux clics !'
              : `${wrongClicks} faux clic(s)`}
          </p>

          <div className="space-y-3">
            <button
              onClick={handleReset}
              className="w-full btn bg-rose-600 text-white flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Recommencer
            </button>
            <button
              onClick={() => navigate('/erreurs-visuelles')}
              className="w-full btn bg-gray-100 text-gray-700"
            >
              Autre exercice
            </button>
          </div>
        </div>

        {/* Récapitulatif des erreurs */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif des erreurs</h3>
          <div className="space-y-3">
            {exercice.erreurs.map((erreur, idx) => (
              <div key={erreur.id} className="bg-red-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-medium text-red-800">{erreur.titre}</h4>
                    <p className="text-sm text-red-700 mt-1">{erreur.explication}</p>
                    <p className="text-sm text-green-700 mt-2 font-medium">
                      ✓ {erreur.correction}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Session en cours
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-rose-600 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <Link to="/erreurs-visuelles" className="text-rose-200 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <span className="font-medium text-sm">{exercice.titre}</span>
          <button
            onClick={handleReset}
            className="text-rose-200 hover:text-white"
          >
            <RotateCcw size={20} />
          </button>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>
            {foundErrors.length}/{exercice.nbErreurs} trouvée(s)
          </span>
          <span className={wrongClicks > 0 ? 'text-rose-200' : ''}>
            {wrongClicks} faux clic(s)
          </span>
        </div>
        {/* Barre de progression */}
        <div className="mt-2 bg-rose-400 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all"
            style={{ width: `${(foundErrors.length / exercice.nbErreurs) * 100}%` }}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 border-b border-amber-200 p-3 text-center">
        <p className="text-sm text-amber-800">
          Touchez les zones contenant des erreurs d'installation
        </p>
      </div>

      {/* Zone SVG interactive */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
          <svg
            viewBox={exercice.viewBox}
            className="w-full touch-none cursor-crosshair"
            style={{ minHeight: '250px' }}
            onClick={handleSvgClick}
          >
            {/* Rendu des éléments du schéma */}
            {exercice.elements.map((el, idx) => {
              switch (el.type) {
                case 'rect':
                  return (
                    <rect
                      key={idx}
                      x={el.x}
                      y={el.y}
                      width={el.width}
                      height={el.height}
                      fill={el.fill || 'none'}
                      stroke={el.stroke || 'none'}
                      strokeWidth={el.strokeWidth || 1}
                      strokeDasharray={el.strokeDasharray || 'none'}
                      rx={el.rx || 0}
                    />
                  )
                case 'circle':
                  return (
                    <circle
                      key={idx}
                      cx={el.cx}
                      cy={el.cy}
                      r={el.r}
                      fill={el.fill || 'none'}
                      stroke={el.stroke || 'none'}
                      strokeWidth={el.strokeWidth || 1}
                    />
                  )
                case 'ellipse':
                  return (
                    <ellipse
                      key={idx}
                      cx={el.cx}
                      cy={el.cy}
                      rx={el.rx}
                      ry={el.ry}
                      fill={el.fill || 'none'}
                      stroke={el.stroke || 'none'}
                      strokeWidth={el.strokeWidth || 1}
                    />
                  )
                case 'line':
                  return (
                    <line
                      key={idx}
                      x1={el.x1}
                      y1={el.y1}
                      x2={el.x2}
                      y2={el.y2}
                      stroke={el.stroke || '#374151'}
                      strokeWidth={el.strokeWidth || 1}
                      strokeDasharray={el.strokeDasharray || 'none'}
                    />
                  )
                case 'path':
                  return (
                    <path
                      key={idx}
                      d={el.d}
                      fill={el.fill || 'none'}
                      stroke={el.stroke || '#374151'}
                      strokeWidth={el.strokeWidth || 1}
                    />
                  )
                case 'text':
                  return (
                    <text
                      key={idx}
                      x={el.x}
                      y={el.y}
                      fontSize={el.fontSize || 10}
                      fontWeight={el.fontWeight || 'normal'}
                      fill={el.fill || '#374151'}
                      textAnchor={el.textAnchor || 'start'}
                      transform={el.transform || ''}
                    >
                      {el.text}
                    </text>
                  )
                case 'polygon':
                  return (
                    <polygon
                      key={idx}
                      points={el.points}
                      fill={el.fill || 'none'}
                      stroke={el.stroke || '#374151'}
                      strokeWidth={el.strokeWidth || 1}
                    />
                  )
                default:
                  return null
              }
            })}

            {/* Zones d'erreurs trouvées (highlight vert) */}
            {foundErrors.map(erreurId => {
              const erreur = exercice.erreurs.find(e => e.id === erreurId)
              if (!erreur) return null
              return (
                <rect
                  key={`found-${erreurId}`}
                  x={erreur.zone.x - 2}
                  y={erreur.zone.y - 2}
                  width={erreur.zone.width + 4}
                  height={erreur.zone.height + 4}
                  fill="rgba(34, 197, 94, 0.2)"
                  stroke="#22c55e"
                  strokeWidth="2"
                  rx="4"
                  className="pointer-events-none"
                />
              )
            })}

            {/* Mode aide : montrer toutes les zones */}
            {showAllZones && exercice.erreurs.map(erreur => {
              if (foundErrors.includes(erreur.id)) return null
              return (
                <rect
                  key={`hint-${erreur.id}`}
                  x={erreur.zone.x}
                  y={erreur.zone.y}
                  width={erreur.zone.width}
                  height={erreur.zone.height}
                  fill="rgba(251, 191, 36, 0.3)"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  rx="4"
                  className="pointer-events-none animate-pulse"
                />
              )
            })}

            {/* Feedback visuel de clic */}
            {clickFeedback && (
              <g className="pointer-events-none">
                <circle
                  cx={clickFeedback.x}
                  cy={clickFeedback.y}
                  r="15"
                  fill={clickFeedback.type === 'success' ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}
                  stroke={clickFeedback.type === 'success' ? '#22c55e' : '#ef4444'}
                  strokeWidth="2"
                />
                {clickFeedback.type === 'success' ? (
                  <text
                    x={clickFeedback.x}
                    y={clickFeedback.y + 5}
                    textAnchor="middle"
                    fontSize="16"
                    fill="#22c55e"
                    fontWeight="bold"
                  >
                    ✓
                  </text>
                ) : (
                  <text
                    x={clickFeedback.x}
                    y={clickFeedback.y + 5}
                    textAnchor="middle"
                    fontSize="16"
                    fill="#ef4444"
                    fontWeight="bold"
                  >
                    ✗
                  </text>
                )}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Info erreur sélectionnée */}
      {selectedError && (
        <div className="mx-4 mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <XCircle className="text-red-500 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-red-800">{selectedError.titre}</h4>
              <p className="text-sm text-red-700 mt-1">{selectedError.explication}</p>
              <p className="text-sm text-green-700 mt-2">
                <strong>Correction :</strong> {selectedError.correction}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer avec boutons */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-3">
          <button
            onClick={() => setShowAllZones(!showAllZones)}
            className={`flex-1 btn flex items-center justify-center gap-2 ${
              showAllZones
                ? 'bg-amber-500 text-white'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {showAllZones ? <EyeOff size={18} /> : <Eye size={18} />}
            {showAllZones ? 'Masquer' : 'Aide'}
          </button>
          <button
            onClick={() => {
              if (exercice.erreurs.length > foundErrors.length) {
                // Trouver la première erreur non trouvée
                const notFound = exercice.erreurs.find(e => !foundErrors.includes(e.id))
                if (notFound) {
                  setSelectedError(notFound)
                  setFoundErrors([...foundErrors, notFound.id])
                  setWrongClicks(prev => prev + 2) // Pénalité

                  // Vérifier si toutes les erreurs sont trouvées
                  if (foundErrors.length + 1 === exercice.erreurs.length) {
                    setIsComplete(true)
                    saveProgress()
                  }
                }
              }
            }}
            className="flex-1 btn bg-gray-100 text-gray-700 flex items-center justify-center gap-2"
          >
            <HelpCircle size={18} />
            Révéler (-10pts)
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">
          Score actuel : {score}% • {foundErrors.length}/{exercice.nbErreurs} erreur(s)
        </p>
      </div>
    </div>
  )
}

export default ErreurVisuelleSession
