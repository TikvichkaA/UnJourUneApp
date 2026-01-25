import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, RotateCcw, Trophy, HelpCircle } from 'lucide-react'
import { getSchemaById, symbolesDisponibles } from '../data/schemasExercices'

function SchemaExercice() {
  const { exerciceId } = useParams()
  const navigate = useNavigate()
  const exercice = getSchemaById(exerciceId)

  const [placements, setPlacements] = useState(() => {
    if (!exercice) return {}
    const initial = {}
    exercice.zonesVides.forEach(zone => {
      initial[zone.id] = zone.valeurInitiale || null
    })
    return initial
  })
  const [selectedSymbol, setSelectedSymbol] = useState(null)
  const [showHints, setShowHints] = useState({})
  const [validated, setValidated] = useState(false)
  const [results, setResults] = useState(null)

  if (!exercice) {
    return (
      <div className="p-4">
        <Link to="/schemas-exercices" className="flex items-center gap-2 text-blue-600 mb-4">
          <ArrowLeft size={20} />
          Retour
        </Link>
        <div className="card text-center py-8">
          <p className="text-gray-500">Exercice non trouvé</p>
        </div>
      </div>
    )
  }

  const handleZoneClick = (zoneId) => {
    if (validated) return

    if (selectedSymbol) {
      setPlacements(prev => ({
        ...prev,
        [zoneId]: selectedSymbol
      }))
      setSelectedSymbol(null)
    } else if (placements[zoneId]) {
      // Clear the zone if clicking without selection
      setPlacements(prev => ({
        ...prev,
        [zoneId]: null
      }))
    }
  }

  const handleSymbolSelect = (symbolId) => {
    if (validated) return
    setSelectedSymbol(selectedSymbol === symbolId ? null : symbolId)
  }

  const toggleHint = (zoneId) => {
    setShowHints(prev => ({
      ...prev,
      [zoneId]: !prev[zoneId]
    }))
  }

  const handleValidate = () => {
    const zoneResults = exercice.zonesVides.map(zone => ({
      zoneId: zone.id,
      placed: placements[zone.id],
      expected: zone.attendu,
      correct: placements[zone.id] === zone.attendu
    }))

    const correctCount = zoneResults.filter(r => r.correct).length
    const totalCount = zoneResults.length
    const percentage = Math.round((correctCount / totalCount) * 100)

    setResults({
      zones: zoneResults,
      correct: correctCount,
      total: totalCount,
      percentage
    })
    setValidated(true)
  }

  const handleReset = () => {
    const initial = {}
    exercice.zonesVides.forEach(zone => {
      initial[zone.id] = zone.valeurInitiale || null
    })
    setPlacements(initial)
    setSelectedSymbol(null)
    setShowHints({})
    setValidated(false)
    setResults(null)
  }

  const allZonesFilled = exercice.zonesVides.every(zone => placements[zone.id])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-pink-600 text-white p-4">
        <div className="flex items-center justify-between">
          <Link to="/schemas-exercices" className="text-pink-200 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <span className="font-medium text-sm">{exercice.titre}</span>
          <button onClick={handleReset} className="text-pink-200 hover:text-white">
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="p-4 bg-white border-b">
        <p className="text-sm text-gray-600">{exercice.description}</p>
      </div>

      {/* Schema canvas */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 min-h-64 relative">
          <svg viewBox="0 0 320 280" className="w-full h-auto" style={{ maxHeight: '300px' }}>
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>

            {/* Fixed elements */}
            {exercice.elementsAffiches.map((el, idx) => {
              if (el.type === 'text') {
                return (
                  <text
                    key={idx}
                    x={el.x}
                    y={el.y}
                    fontSize={el.fontSize || 10}
                    fill={el.color || '#374151'}
                    fontFamily="system-ui"
                  >
                    {el.text}
                  </text>
                )
              }
              if (el.type === 'line') {
                return (
                  <line
                    key={idx}
                    x1={el.x1}
                    y1={el.y1}
                    x2={el.x2}
                    y2={el.y2}
                    stroke={el.color || '#374151'}
                    strokeWidth="2"
                  />
                )
              }
              if (el.type === 'rect') {
                return (
                  <g key={idx}>
                    <rect
                      x={el.x}
                      y={el.y}
                      width={el.width}
                      height={el.height}
                      fill="none"
                      stroke="#374151"
                      strokeWidth="2"
                    />
                    {el.label && (
                      <text
                        x={el.x + el.width / 2}
                        y={el.y + el.height / 2 + 4}
                        fontSize="8"
                        textAnchor="middle"
                        fill="#374151"
                      >
                        {el.label}
                      </text>
                    )}
                  </g>
                )
              }
              return null
            })}

            {/* Drop zones */}
            {exercice.zonesVides.map(zone => {
              const placed = placements[zone.id]
              const isCorrect = validated && results?.zones.find(r => r.zoneId === zone.id)?.correct
              const isWrong = validated && !isCorrect

              let borderColor = '#d1d5db'
              let bgColor = 'rgba(255,255,255,0.8)'

              if (selectedSymbol && !validated) {
                borderColor = '#ec4899'
                bgColor = 'rgba(236,72,153,0.1)'
              }
              if (placed && !validated) {
                borderColor = '#3b82f6'
                bgColor = 'rgba(59,130,246,0.1)'
              }
              if (isCorrect) {
                borderColor = '#22c55e'
                bgColor = 'rgba(34,197,94,0.1)'
              }
              if (isWrong) {
                borderColor = '#ef4444'
                bgColor = 'rgba(239,68,68,0.1)'
              }

              return (
                <g key={zone.id}>
                  <rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    fill={bgColor}
                    stroke={borderColor}
                    strokeWidth="2"
                    strokeDasharray={placed ? '0' : '4'}
                    rx="4"
                    style={{ cursor: validated ? 'default' : 'pointer' }}
                    onClick={() => handleZoneClick(zone.id)}
                  />

                  {placed && (
                    <g transform={`translate(${zone.x + zone.width/2 - 20}, ${zone.y + zone.height/2 - 20})`}>
                      <svg width="40" height="40" viewBox="0 0 40 40">
                        <g dangerouslySetInnerHTML={{ __html: symbolesDisponibles[placed]?.svg || '' }} />
                      </svg>
                    </g>
                  )}

                  {!placed && !validated && (
                    <text
                      x={zone.x + zone.width/2}
                      y={zone.y + zone.height/2 + 4}
                      fontSize="20"
                      textAnchor="middle"
                      fill="#d1d5db"
                    >
                      ?
                    </text>
                  )}

                  {validated && isCorrect && (
                    <circle
                      cx={zone.x + zone.width - 8}
                      cy={zone.y + 8}
                      r="6"
                      fill="#22c55e"
                    />
                  )}
                  {validated && isWrong && (
                    <circle
                      cx={zone.x + zone.width - 8}
                      cy={zone.y + 8}
                      r="6"
                      fill="#ef4444"
                    />
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Zone hints */}
        {!validated && (
          <div className="mt-4 space-y-2">
            {exercice.zonesVides.map(zone => (
              <div key={zone.id} className="flex items-start gap-2">
                <button
                  onClick={() => toggleHint(zone.id)}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                    showHints[zone.id] ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <HelpCircle size={12} />
                  Zone {zone.id.replace('z', '')}
                </button>
                {showHints[zone.id] && (
                  <span className="text-xs text-amber-700 flex-1">{zone.hint}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results panel */}
      {validated && results && (
        <div className={`p-4 border-t ${results.percentage >= 70 ? 'bg-green-50' : 'bg-amber-50'}`}>
          <div className="flex items-center gap-3 mb-3">
            {results.percentage >= 70 ? (
              <Trophy size={32} className="text-yellow-500" />
            ) : (
              <Lightbulb size={32} className="text-amber-500" />
            )}
            <div>
              <h3 className="font-bold text-lg">
                {results.percentage >= 70 ? 'Excellent !' : 'Continuez vos efforts !'}
              </h3>
              <p className="text-sm text-gray-600">
                {results.correct}/{results.total} zones correctes ({results.percentage}%)
              </p>
            </div>
          </div>

          {/* Zone by zone results */}
          <div className="space-y-2 mb-4">
            {results.zones.map((zone, idx) => {
              const zoneData = exercice.zonesVides.find(z => z.id === zone.zoneId)
              return (
                <div
                  key={zone.zoneId}
                  className={`flex items-center gap-2 p-2 rounded text-sm ${
                    zone.correct ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {zone.correct ? (
                    <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle size={16} className="text-red-600 flex-shrink-0" />
                  )}
                  <span className="flex-1">
                    Zone {idx + 1}: {zone.correct ? (
                      <span className="text-green-700">{symbolesDisponibles[zone.placed]?.nom}</span>
                    ) : (
                      <>
                        <span className="text-red-700 line-through">
                          {zone.placed ? symbolesDisponibles[zone.placed]?.nom : 'vide'}
                        </span>
                        {' → '}
                        <span className="text-green-700">{symbolesDisponibles[zone.expected]?.nom}</span>
                      </>
                    )}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Explanation */}
          <div className="bg-white rounded-lg p-3 mb-4">
            <h4 className="font-semibold text-gray-900 mb-1">Explication</h4>
            <p className="text-sm text-gray-600">{exercice.explication}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 btn bg-gray-100 text-gray-700 flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Recommencer
            </button>
            <button
              onClick={() => navigate('/schemas-exercices')}
              className="flex-1 btn bg-pink-600 text-white"
            >
              Autre exercice
            </button>
          </div>
        </div>
      )}

      {/* Symbol palette */}
      {!validated && (
        <div className="sticky bottom-0 bg-white border-t p-4 space-y-3">
          <p className="text-xs text-gray-500 text-center">
            {selectedSymbol
              ? `Touchez une zone pour placer : ${symbolesDisponibles[selectedSymbol]?.nom}`
              : 'Sélectionnez un symbole puis touchez une zone'
            }
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            {exercice.palette.map(symbolId => {
              const symbole = symbolesDisponibles[symbolId]
              if (!symbole) return null

              const isSelected = selectedSymbol === symbolId

              return (
                <button
                  key={symbolId}
                  onClick={() => handleSymbolSelect(symbolId)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50 scale-105'
                      : 'border-gray-200 bg-white hover:border-pink-300'
                  }`}
                  title={symbole.description}
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" className="text-gray-700">
                    <g dangerouslySetInnerHTML={{ __html: symbole.svg }} />
                  </svg>
                  <div className="text-xs text-center mt-1 max-w-16 truncate">
                    {symbole.nom}
                  </div>
                </button>
              )
            })}
          </div>

          <button
            onClick={handleValidate}
            disabled={!allZonesFilled}
            className="w-full btn bg-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Valider ({Object.values(placements).filter(Boolean).length}/{exercice.zonesVides.length} zones)
          </button>
        </div>
      )}
    </div>
  )
}

export default SchemaExercice
