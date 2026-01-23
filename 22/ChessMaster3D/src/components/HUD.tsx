import { motion } from 'framer-motion'
import { useSettingsStore } from '../store/settingsStore'

interface HUDProps {
  turn: 'w' | 'b'
  isCheck?: boolean
  isCheckmate?: boolean
  isStalemate?: boolean
  moveHistory?: string[]
  onUndo?: () => void
  onReset?: () => void
  onResetCamera?: () => void
  showControls?: boolean
}

export function HUD({
  turn,
  isCheck = false,
  isCheckmate = false,
  isStalemate = false,
  moveHistory = [],
  onUndo,
  onReset,
  onResetCamera,
  showControls = true
}: HUDProps) {
  const {
    showLegalMoves,
    showLastMove,
    showThreats,
    toggleLegalMoves,
    toggleLastMove,
    toggleThreats
  } = useSettingsStore()

  const turnText = turn === 'w' ? 'Blancs' : 'Noirs'
  const statusText = isCheckmate
    ? `Échec et mat ! ${turn === 'w' ? 'Noirs' : 'Blancs'} gagnent`
    : isStalemate
    ? 'Pat !'
    : isCheck
    ? `Échec au Roi ${turnText.toLowerCase()}`
    : `Au tour des ${turnText.toLowerCase()}`

  return (
    <>
      {/* Top bar - Game status */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-xl"
      >
        <div className="flex items-center gap-4">
          {/* Turn indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full ${
                turn === 'w' ? 'bg-chess-white' : 'bg-chess-black'
              } border border-wood-accent`}
            />
            <span
              className={`font-medium ${
                isCheckmate || isStalemate
                  ? 'text-chess-danger'
                  : isCheck
                  ? 'text-yellow-400'
                  : 'text-wood-light'
              }`}
            >
              {statusText}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Left panel - Move history */}
      {moveHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-4 top-20 glass rounded-xl p-4 max-h-[300px] overflow-y-auto w-48"
        >
          <h3 className="text-wood-accent text-sm font-medium mb-2">Historique</h3>
          <div className="space-y-1">
            {moveHistory.reduce<string[][]>((acc, move, i) => {
              if (i % 2 === 0) {
                acc.push([move])
              } else {
                acc[acc.length - 1].push(move)
              }
              return acc
            }, []).map((pair, i) => (
              <div key={i} className="flex text-sm">
                <span className="text-wood-dark w-6">{i + 1}.</span>
                <span className="text-wood-light w-12">{pair[0]}</span>
                {pair[1] && <span className="text-wood-light">{pair[1]}</span>}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Right panel - Controls */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-4 top-20 space-y-3"
        >
          {/* Action buttons */}
          <div className="glass rounded-xl p-3 space-y-2">
            <button
              onClick={onResetCamera}
              className="w-full btn-secondary text-sm py-2 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Caméra
            </button>

            {onUndo && (
              <button
                onClick={onUndo}
                disabled={moveHistory.length === 0}
                className="w-full btn-secondary text-sm py-2 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Annuler
              </button>
            )}

            {onReset && (
              <button
                onClick={onReset}
                className="w-full btn-secondary text-sm py-2 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Rejouer
              </button>
            )}
          </div>

          {/* Settings toggles */}
          <div className="glass rounded-xl p-3 space-y-2">
            <h4 className="text-wood-accent text-xs font-medium mb-2">Affichage</h4>

            <ToggleButton
              label="Coups légaux"
              active={showLegalMoves}
              onClick={toggleLegalMoves}
            />

            <ToggleButton
              label="Dernier coup"
              active={showLastMove}
              onClick={toggleLastMove}
            />

            <ToggleButton
              label="Menaces"
              active={showThreats}
              onClick={toggleThreats}
            />
          </div>
        </motion.div>
      )}
    </>
  )
}

function ToggleButton({
  label,
  active,
  onClick
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
        active
          ? 'bg-wood-medium/30 text-wood-light'
          : 'text-wood-dark hover:text-wood-accent'
      }`}
    >
      <span className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            active ? 'bg-green-400' : 'bg-gray-500'
          }`}
        />
        {label}
      </span>
    </button>
  )
}
