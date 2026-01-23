import { motion, AnimatePresence } from 'framer-motion'
import { Hint, HintLevel } from '../engine/hintEngine'

interface HintOverlayProps {
  hint: Hint | null
  onRequestHint: () => void
  hintsUsed: number
  maxHints?: number
  showButton?: boolean
}

export function HintOverlay({
  hint,
  onRequestHint,
  hintsUsed,
  maxHints = 3,
  showButton = true
}: HintOverlayProps) {
  const canGetHint = hintsUsed < maxHints

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
      <AnimatePresence mode="wait">
        {hint && hint.level !== 'none' && hint.explanation && (
          <motion.div
            key="hint-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass px-6 py-3 rounded-xl mb-3 text-center"
          >
            <div className="flex items-center gap-2 text-wood-accent">
              <HintIcon level={hint.level} />
              <span className="text-sm font-medium">
                {getLevelLabel(hint.level)}
              </span>
            </div>
            <p className="text-wood-light mt-1">{hint.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {showButton && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onRequestHint}
          disabled={!canGetHint}
          className={`btn-secondary flex items-center gap-2 mx-auto ${
            !canGetHint ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span>Indice ({maxHints - hintsUsed} restants)</span>
        </motion.button>
      )}
    </div>
  )
}

function HintIcon({ level }: { level: HintLevel }) {
  switch (level) {
    case 'zone':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    case 'piece':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    case 'move':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      )
    default:
      return null
  }
}

function getLevelLabel(level: HintLevel): string {
  switch (level) {
    case 'zone':
      return 'Zone'
    case 'piece':
      return 'Pièce'
    case 'move':
      return 'Solution'
    default:
      return ''
  }
}

interface FeedbackOverlayProps {
  type: 'success' | 'error' | 'info'
  message: string
  onDismiss?: () => void
}

export function FeedbackOverlay({ type, message, onDismiss }: FeedbackOverlayProps) {
  const colors = {
    success: 'border-green-500 bg-green-500/10',
    error: 'border-red-500 bg-red-500/10',
    info: 'border-blue-500 bg-blue-500/10'
  }

  const icons = {
    success: (
      <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 glass border ${colors[type]} px-6 py-4 rounded-xl max-w-md`}
      onClick={onDismiss}
    >
      <div className="flex items-start gap-3">
        {icons[type]}
        <p className="text-wood-light">{message}</p>
      </div>
    </motion.div>
  )
}
