import { useState } from 'react'
import { RotateCcw, Check, X, Lightbulb } from 'lucide-react'
import { ElectricalSymbol } from './ElectricalSymbols'

function Flashcard({ symbol, onResult, showHint = false }) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(true)
  }

  const handleResult = (known) => {
    setIsFlipped(false)
    onResult(known)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Carte */}
      <div
        className="relative h-80 cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={!isFlipped ? handleFlip : undefined}
      >
        <div
          className={`absolute inset-0 transition-transform duration-500`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Face avant - Symbole */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-lg border-2 border-gray-200 flex flex-col items-center justify-center p-6"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-gray-800 mb-4">
              <ElectricalSymbol symbolId={symbol.id} size={120} />
            </div>

            <p className="text-gray-400 text-sm mt-4">
              Touchez pour révéler
            </p>

            {showHint && symbol.astuce && (
              <div className="mt-4 bg-amber-50 rounded-lg p-3 flex items-start gap-2">
                <Lightbulb size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">{symbol.astuce}</p>
              </div>
            )}
          </div>

          {/* Face arrière - Réponse */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 text-white flex flex-col"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <h3 className="text-2xl font-bold mb-3">{symbol.nom}</h3>
              <p className="text-blue-200 text-sm mb-4">{symbol.description}</p>

              {symbol.utilisation && (
                <div className="bg-white/10 rounded-lg p-3 mt-2">
                  <p className="text-xs text-blue-100">
                    <strong>Utilisation :</strong> {symbol.utilisation}
                  </p>
                </div>
              )}
            </div>

            <div className="text-xs text-blue-300 text-center mt-2">
              {symbol.normeRef}
            </div>
          </div>
        </div>
      </div>

      {/* Boutons de réponse */}
      {isFlipped && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => handleResult(false)}
            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <X size={20} />
            À revoir
          </button>
          <button
            onClick={() => handleResult(true)}
            className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Check size={20} />
            Je connais
          </button>
        </div>
      )}

      {/* Instruction avant flip */}
      {!isFlipped && (
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <RotateCcw size={16} />
            Touchez la carte pour voir la réponse
          </p>
        </div>
      )}
    </div>
  )
}

export default Flashcard
