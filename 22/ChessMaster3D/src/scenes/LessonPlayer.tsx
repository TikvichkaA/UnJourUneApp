import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { Chess, Square } from 'chess.js'
import { ChessBoard3D } from '../components/ChessBoard3D'
import { CameraControls } from '../components/CameraControls'
import { HintOverlay, FeedbackOverlay } from '../components/HintOverlay'
import { useProgressStore } from '../store/progressStore'
import { evaluateMove, getProgressiveHint } from '../engine/hintEngine'
import { findKingSquare } from '../engine/chessEngine'
import lessonsData from '../data/lessons.json'

interface Lesson {
  id: string
  title: string
  level: string
  skill: string
  fen: string
  objective: string
  bestMoves: string[]
  intro: string
  successText: string
  failureText: string
}

export default function LessonPlayer() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { completeLesson, failLesson } = useProgressStore()

  // Find the lesson
  const lesson = useMemo(() => {
    for (const chapter of lessonsData.chapters) {
      const found = chapter.lessons.find((l) => l.id === lessonId)
      if (found) return found as Lesson
    }
    return null
  }, [lessonId])

  // Game state
  const [game, setGame] = useState<Chess | null>(null)
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [legalMoves, setLegalMoves] = useState<Square[]>([])
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null)

  // Lesson state
  const [phase, setPhase] = useState<'intro' | 'play' | 'success' | 'failure'>('intro')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [, setAttemptCount] = useState(0)
  const [currentHint, setCurrentHint] = useState<ReturnType<typeof getProgressiveHint> | null>(null)

  // Initialize game
  useEffect(() => {
    if (lesson) {
      const newGame = new Chess(lesson.fen)
      setGame(newGame)
      setSelectedSquare(null)
      setLegalMoves([])
      setLastMove(null)
      setPhase('intro')
      setFeedback(null)
      setHintsUsed(0)
      setAttemptCount(0)
      setCurrentHint(null)
    }
  }, [lesson])

  const handleSquareClick = useCallback(
    (square: Square) => {
      if (!game || phase !== 'play') return

      // If we have a selected square and clicking a legal move
      if (selectedSquare && legalMoves.includes(square)) {
        const result = evaluateMove(game, { from: selectedSquare, to: square }, lesson?.bestMoves || [])

        if (result.isCorrect) {
          // Make the move
          const move = game.move({ from: selectedSquare, to: square })
          if (move) {
            setLastMove({ from: selectedSquare, to: square })
            setPhase('success')
            setFeedback({
              type: 'success',
              message: lesson?.successText || 'Excellent !'
            })
            if (lesson) {
              completeLesson(lesson.id, lesson.skill)
            }
          }
        } else {
          // Wrong move
          setAttemptCount((prev) => prev + 1)
          setFeedback({
            type: 'error',
            message: result.explanation || lesson?.failureText || 'Ce n\'est pas le bon coup.'
          })
          if (lesson) {
            failLesson(lesson.id)
          }
        }

        setSelectedSquare(null)
        setLegalMoves([])
        return
      }

      // Select a piece
      const piece = game.get(square)
      if (piece && piece.color === game.turn()) {
        const moves = game.moves({ square, verbose: true })
        setSelectedSquare(square)
        setLegalMoves(moves.map((m) => m.to as Square))
      } else {
        setSelectedSquare(null)
        setLegalMoves([])
      }
    },
    [game, phase, selectedSquare, legalMoves, lesson, completeLesson, failLesson]
  )

  const handleRequestHint = useCallback(() => {
    if (!game || !lesson || hintsUsed >= 3) return

    const newHintCount = hintsUsed + 1
    setHintsUsed(newHintCount)
    const hint = getProgressiveHint(game, lesson.bestMoves, newHintCount)
    setCurrentHint(hint)
  }, [game, lesson, hintsUsed])

  const handleReplay = useCallback(() => {
    if (lesson) {
      const newGame = new Chess(lesson.fen)
      setGame(newGame)
      setSelectedSquare(null)
      setLegalMoves([])
      setLastMove(null)
      setPhase('play')
      setFeedback(null)
      setHintsUsed(0)
      setAttemptCount(0)
      setCurrentHint(null)
    }
  }, [lesson])

  const handleNext = useCallback(() => {
    // Find next lesson
    let foundCurrent = false
    for (const chapter of lessonsData.chapters) {
      for (const l of chapter.lessons) {
        if (foundCurrent) {
          navigate(`/lesson/${l.id}`)
          return
        }
        if (l.id === lessonId) {
          foundCurrent = true
        }
      }
    }
    // No more lessons, go home
    navigate('/')
  }, [lessonId, navigate])

  if (!lesson || !game) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-wood-accent">Leçon non trouvée</p>
      </div>
    )
  }

  const isCheck = game.isCheck()
  const checkSquare = isCheck ? findKingSquare(game.fen(), game.turn()) : null

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-10 glass px-4 py-2 rounded-xl flex items-center gap-2 hover:border-wood-accent transition-colors"
      >
        <svg className="w-5 h-5 text-wood-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-wood-light">Retour</span>
      </motion.button>

      {/* Lesson title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10 glass px-6 py-3 rounded-xl"
      >
        <h1 className="text-lg font-medium text-wood-light">{lesson.title}</h1>
      </motion.div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 8, 10], fov: 45, near: 0.1, far: 100 }} gl={{ antialias: true, logarithmicDepthBuffer: true }}>
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-5, 10, -5]} intensity={0.3} />
        <fog attach="fog" args={['#1a0f0a', 15, 40]} />

        <ChessBoard3D
          fen={game.fen()}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          lastMove={lastMove}
          onSquareClick={handleSquareClick}
          isCheck={isCheck}
          checkSquare={checkSquare}
          interactive={phase === 'play'}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#1a0f0a" roughness={0.9} />
        </mesh>

        <CameraControls />
      </Canvas>

      {/* Intro overlay */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-20"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-8 max-w-md text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-wood-medium to-yellow-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-wood-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-wood-light mb-3">
                {lesson.title}
              </h2>
              <p className="text-wood-accent mb-6">{lesson.intro}</p>
              <button onClick={() => setPhase('play')} className="btn-primary">
                C'est parti !
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success overlay */}
      <AnimatePresence>
        {phase === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-20"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass rounded-2xl p-8 max-w-md text-center glow-success"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center mx-auto mb-4"
              >
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-display font-bold text-wood-light mb-3">
                Excellent !
              </h2>
              <p className="text-wood-accent mb-6">{lesson.successText}</p>
              <div className="flex gap-4 justify-center">
                <button onClick={handleReplay} className="btn-secondary">
                  Rejouer
                </button>
                <button onClick={handleNext} className="btn-primary">
                  Suivant
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint overlay */}
      {phase === 'play' && (
        <HintOverlay
          hint={currentHint}
          onRequestHint={handleRequestHint}
          hintsUsed={hintsUsed}
          maxHints={3}
        />
      )}

      {/* Feedback */}
      <AnimatePresence>
        {feedback && phase === 'play' && (
          <FeedbackOverlay
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
