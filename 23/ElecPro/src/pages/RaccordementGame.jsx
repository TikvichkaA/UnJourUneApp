import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Check, Lightbulb, Trash2, Trophy, XCircle, AlertTriangle } from 'lucide-react'
import { getCircuitById, raccordementsData, validateConnections } from '../data/raccordements'

// Wire colors from data
const wireColors = raccordementsData.wireColors

// Wire color options for toolbar
const wireOptions = [
  { id: 'phase', label: 'Phase', color: wireColors.phase.color, short: 'L' },
  { id: 'neutre', label: 'Neutre', color: wireColors.neutre.color, short: 'N' },
  { id: 'terre', label: 'Terre', color: wireColors.terre.color, short: 'PE', pattern: true },
  { id: 'retour', label: 'Retour', color: wireColors.retour.color, short: 'R' },
  { id: 'navette1', label: 'Nav.1', color: wireColors.navette1.color, short: 'N1' },
  { id: 'navette2', label: 'Nav.2', color: wireColors.navette2.color, short: 'N2' },
]

function RaccordementGame() {
  const { circuitId } = useParams()
  const navigate = useNavigate()
  const circuit = getCircuitById(circuitId)

  const [selectedWireType, setSelectedWireType] = useState('phase')
  const [selectedTerminal, setSelectedTerminal] = useState(null)
  const [userConnections, setUserConnections] = useState([])
  const [validationResult, setValidationResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // SVG viewBox dimensions
  const viewBoxWidth = 400
  const viewBoxHeight = 350

  useEffect(() => {
    // Reset state when circuit changes
    setUserConnections([])
    setSelectedTerminal(null)
    setValidationResult(null)
    setShowHint(false)
    setHintIndex(0)
    setHintsUsed(0)
    setIsComplete(false)
  }, [circuitId])

  const handleTerminalClick = useCallback((terminal) => {
    if (isComplete) return

    if (selectedTerminal === null) {
      // First terminal selected
      setSelectedTerminal(terminal)
    } else if (selectedTerminal.id === terminal.id) {
      // Same terminal clicked - deselect
      setSelectedTerminal(null)
    } else {
      // Second terminal - create connection
      const newConnection = {
        id: `${selectedTerminal.id}-${terminal.id}`,
        from: selectedTerminal.id,
        to: terminal.id,
        wireType: selectedWireType
      }

      // Check if connection already exists (in either direction)
      const exists = userConnections.some(
        c => (c.from === newConnection.from && c.to === newConnection.to) ||
             (c.from === newConnection.to && c.to === newConnection.from)
      )

      if (!exists) {
        setUserConnections(prev => [...prev, newConnection])
      }

      setSelectedTerminal(null)
      setValidationResult(null) // Clear validation on new connection
    }
  }, [selectedTerminal, selectedWireType, userConnections, isComplete])

  const handleDeleteConnection = (connectionId) => {
    setUserConnections(prev => prev.filter(c => c.id !== connectionId))
    setValidationResult(null)
  }

  const handleValidate = () => {
    const result = validateConnections(circuit, userConnections)
    setValidationResult(result)

    if (result.isComplete && result.incorrect.length === 0) {
      setIsComplete(true)
      // Save progress
      const score = Math.max(0, 100 - (hintsUsed * 10) - (result.incorrect.length * 15))
      saveProgress(circuitId, score)
    }
  }

  const handleShowHint = () => {
    if (hintIndex < circuit.indices.length) {
      setShowHint(true)
      setHintsUsed(prev => prev + 1)
    }
  }

  const handleNextHint = () => {
    if (hintIndex < circuit.indices.length - 1) {
      setHintIndex(prev => prev + 1)
      setHintsUsed(prev => prev + 1)
    } else {
      setShowHint(false)
    }
  }

  const handleReset = () => {
    setUserConnections([])
    setSelectedTerminal(null)
    setValidationResult(null)
    setShowHint(false)
    setHintIndex(0)
    setHintsUsed(0)
    setIsComplete(false)
  }

  const saveProgress = (id, score) => {
    try {
      const progress = JSON.parse(localStorage.getItem('elecpro-raccordements') || '{}')
      const existing = progress[id] || {}
      progress[id] = {
        completed: true,
        bestScore: Math.max(existing.bestScore || 0, score),
        lastAttempt: new Date().toISOString()
      }
      localStorage.setItem('elecpro-raccordements', JSON.stringify(progress))
    } catch (e) {
      console.error('Error saving progress:', e)
    }
  }

  const getTerminalPosition = (terminalId) => {
    const terminal = circuit.bornes.find(b => b.id === terminalId)
    return terminal ? { x: terminal.x, y: terminal.y } : { x: 0, y: 0 }
  }

  const getWireColor = (wireType) => {
    const wire = wireColors[wireType] || wireColors.phase
    return wire.color
  }

  if (!circuit) {
    return (
      <div className="p-4">
        <Link to="/raccordements" className="flex items-center gap-2 text-blue-600 mb-4">
          <ArrowLeft size={20} />
          Retour
        </Link>
        <div className="card text-center py-8">
          <p className="text-gray-500">Circuit non trouvé</p>
        </div>
      </div>
    )
  }

  // Success screen
  if (isComplete) {
    const score = Math.max(0, 100 - (hintsUsed * 10))

    return (
      <div className="p-4 space-y-6">
        <Link to="/raccordements" className="flex items-center gap-2 text-blue-600">
          <ArrowLeft size={20} />
          Retour aux circuits
        </Link>

        <div className="card bg-green-50 border-green-200 text-center py-8">
          <Trophy size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bravo !
          </h2>
          <p className="text-gray-600 mb-4">{circuit.titre}</p>

          <div className="text-4xl font-bold text-green-600 mb-2">
            {score}%
          </div>
          <p className="text-sm text-gray-500 mb-6">
            {hintsUsed > 0 ? `${hintsUsed} indice(s) utilisé(s)` : 'Sans indice !'}
          </p>

          <div className="space-y-3">
            <button
              onClick={handleReset}
              className="w-full btn btn-primary flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Recommencer
            </button>
            <Link
              to="/raccordements"
              className="block w-full btn bg-gray-100 text-gray-700"
            >
              Autre circuit
            </Link>
          </div>
        </div>

        {/* Explanation */}
        <div className="card bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Explication</h4>
          <p className="text-sm text-blue-700">{circuit.explication}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/raccordements" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div className="text-center">
          <h2 className="font-semibold text-gray-900">{circuit.titre}</h2>
          <p className="text-xs text-gray-500">{circuit.description}</p>
        </div>
        <button
          onClick={handleReset}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Wire color selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {wireOptions.map(wire => (
          <button
            key={wire.id}
            onClick={() => setSelectedWireType(wire.id)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg border-2 transition-all ${
              selectedWireType === wire.id
                ? 'border-gray-800 shadow-md scale-105'
                : 'border-gray-200'
            }`}
          >
            <div
              className="w-8 h-3 rounded mb-1"
              style={{
                backgroundColor: wire.pattern ? undefined : wire.color,
                background: wire.pattern
                  ? 'repeating-linear-gradient(90deg, #22c55e 0px, #22c55e 4px, #eab308 4px, #eab308 8px)'
                  : undefined
              }}
            />
            <span className="text-xs font-medium">{wire.short}</span>
          </button>
        ))}
      </div>

      {/* SVG Canvas */}
      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full touch-none"
          style={{ minHeight: '300px' }}
        >
          {/* Grid background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="0.5" />
            </pattern>
            {/* Earth wire pattern */}
            <pattern id="earthPattern" patternUnits="userSpaceOnUse" width="8" height="4">
              <rect width="4" height="4" fill="#22c55e" />
              <rect x="4" width="4" height="4" fill="#eab308" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Components */}
          {circuit.composants.map(comp => (
            <g key={comp.id} transform={`translate(${comp.x}, ${comp.y})`}>
              {/* Component box */}
              <rect
                x="-30"
                y="-20"
                width="60"
                height="40"
                rx="4"
                fill="white"
                stroke="#374151"
                strokeWidth="2"
              />
              {/* Component icon/label */}
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium"
                fill="#374151"
              >
                {comp.icon || comp.label}
              </text>
              {/* Component type label */}
              <text
                x="0"
                y="30"
                textAnchor="middle"
                className="text-[10px]"
                fill="#6b7280"
              >
                {comp.label}
              </text>
            </g>
          ))}

          {/* User connections (wires) */}
          {userConnections.map(conn => {
            const from = getTerminalPosition(conn.from)
            const to = getTerminalPosition(conn.to)
            const isCorrect = validationResult?.correct.some(
              c => (c.from === conn.from && c.to === conn.to) ||
                   (c.from === conn.to && c.to === conn.from)
            )
            const isIncorrect = validationResult?.incorrect.some(
              c => c.id === conn.id
            )

            return (
              <g key={conn.id}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={
                    validationResult
                      ? isCorrect ? '#22c55e' : isIncorrect ? '#ef4444' : getWireColor(conn.wireType)
                      : getWireColor(conn.wireType)
                  }
                  strokeWidth={validationResult ? 4 : 3}
                  strokeLinecap="round"
                  style={{
                    stroke: conn.wireType === 'terre' ? 'url(#earthPattern)' : undefined
                  }}
                />
                {/* Delete button on wire */}
                {!validationResult && (
                  <g
                    onClick={() => handleDeleteConnection(conn.id)}
                    className="cursor-pointer"
                    transform={`translate(${(from.x + to.x) / 2}, ${(from.y + to.y) / 2})`}
                  >
                    <circle r="10" fill="white" stroke="#ef4444" strokeWidth="1" />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ef4444"
                      fontSize="12"
                    >
                      ×
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Terminals (connection points) */}
          {circuit.bornes.map(terminal => {
            const isSelected = selectedTerminal?.id === terminal.id
            const isConnected = userConnections.some(
              c => c.from === terminal.id || c.to === terminal.id
            )

            return (
              <g
                key={terminal.id}
                onClick={() => handleTerminalClick(terminal)}
                className="cursor-pointer"
              >
                {/* Terminal circle */}
                <circle
                  cx={terminal.x}
                  cy={terminal.y}
                  r={isSelected ? 12 : 10}
                  fill={isSelected ? '#3b82f6' : isConnected ? '#10b981' : '#f3f4f6'}
                  stroke={isSelected ? '#1d4ed8' : '#374151'}
                  strokeWidth="2"
                  className="transition-all"
                />
                {/* Terminal label */}
                <text
                  x={terminal.x}
                  y={terminal.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="8"
                  fontWeight="bold"
                  fill={isSelected ? 'white' : '#374151'}
                >
                  {terminal.label}
                </text>
              </g>
            )
          })}

          {/* Selected terminal indicator */}
          {selectedTerminal && (
            <circle
              cx={selectedTerminal.x}
              cy={selectedTerminal.y}
              r="16"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="4 2"
              className="animate-pulse"
            />
          )}
        </svg>
      </div>

      {/* Status / Instructions */}
      {selectedTerminal ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-sm text-blue-700">
            Borne <strong>{selectedTerminal.label}</strong> sélectionnée - Touchez une autre borne
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600">
            Sélectionnez une couleur puis touchez une borne de départ
          </p>
        </div>
      )}

      {/* Validation result */}
      {validationResult && !isComplete && (
        <div className={`rounded-lg p-4 ${
          validationResult.incorrect.length > 0 || validationResult.missing.length > 0
            ? 'bg-red-50 border border-red-200'
            : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className="flex items-start gap-3">
            {validationResult.incorrect.length > 0 ? (
              <XCircle className="text-red-500 flex-shrink-0" size={20} />
            ) : (
              <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
            )}
            <div className="text-sm">
              {validationResult.correct.length > 0 && (
                <p className="text-green-700 mb-1">
                  {validationResult.correct.length} connexion(s) correcte(s)
                </p>
              )}
              {validationResult.incorrect.length > 0 && (
                <p className="text-red-700 mb-1">
                  {validationResult.incorrect.length} connexion(s) incorrecte(s)
                </p>
              )}
              {validationResult.missing.length > 0 && (
                <p className="text-amber-700">
                  {validationResult.missing.length} connexion(s) manquante(s)
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hint */}
      {showHint && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-amber-500 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-sm text-amber-800 font-medium mb-1">
                Indice {hintIndex + 1}/{circuit.indices.length}
              </p>
              <p className="text-sm text-amber-700">{circuit.indices[hintIndex]}</p>
            </div>
          </div>
          {hintIndex < circuit.indices.length - 1 && (
            <button
              onClick={handleNextHint}
              className="mt-2 text-sm text-amber-600 font-medium"
            >
              Indice suivant (-10 pts)
            </button>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleShowHint}
          disabled={showHint && hintIndex >= circuit.indices.length - 1}
          className="flex-1 btn bg-amber-100 text-amber-700 flex items-center justify-center gap-2"
        >
          <Lightbulb size={18} />
          Indice
        </button>
        <button
          onClick={handleValidate}
          disabled={userConnections.length === 0}
          className="flex-1 btn btn-primary flex items-center justify-center gap-2"
        >
          <Check size={18} />
          Valider
        </button>
      </div>

      {/* Connection count */}
      <div className="text-center text-sm text-gray-500">
        {userConnections.length} connexion(s) • {circuit.connexionsCorrectes.length} attendue(s)
      </div>
    </div>
  )
}

export default RaccordementGame
