import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { Chess, Square } from 'chess.js'
import { ChessBoard3D } from '../components/ChessBoard3D'
import { CameraControls } from '../components/CameraControls'
import { useProgressStore } from '../store/progressStore'
import { findKingSquare } from '../engine/chessEngine'
import drillsData from '../data/drills.json'

interface Puzzle {
  id: string
  fen: string
  solution: string[]
  theme: string
}

interface DrillSet {
  id: string
  title: string
  description: string
  difficulty: string
  puzzles: Puzzle[]
}

export default function DrillMode() {
  const navigate = useNavigate()
  const { completeDrill, currentStreak } = useProgressStore()

  // State
  const [selectedDrillSet, setSelectedDrillSet] = useState<DrillSet | null>(null)
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [game, setGame] = useState<Chess | null>(null)
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [legalMoves, setLegalMoves] = useState<Square[]>([])
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null)

  // Stats
  const [startTime, setStartTime] = useState<number>(0)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [sessionStreak, setSessionStreak] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const currentPuzzle = useMemo(() => {
    if (!selectedDrillSet) return null
    return selectedDrillSet.puzzles[currentPuzzleIndex]
  }, [selectedDrillSet, currentPuzzleIndex])

  // Initialize puzzle
  useEffect(() => {
    if (currentPuzzle) {
      const newGame = new Chess(currentPuzzle.fen)
      setGame(newGame)
      setSelectedSquare(null)
      setLegalMoves([])
      setLastMove(null)
      setFeedback(null)
      setStartTime(Date.now())
    }
  }, [currentPuzzle])

  const handleSquareClick = useCallback(
    (square: Square) => {
      if (!game || !currentPuzzle || feedback) return

      // If clicking a legal move
      if (selectedSquare && legalMoves.includes(square)) {
        const moveNotation = `${selectedSquare}${square}`
        const isCorrect = currentPuzzle.solution.some((sol) => {
          const testGame = new Chess(currentPuzzle.fen)
          try {
            const move = testGame.move(sol)
            return move && `${move.from}${move.to}` === moveNotation
          } catch {
            return false
          }
        })

        const timeMs = Date.now() - startTime

        if (isCorrect) {
          game.move({ from: selectedSquare, to: square })
          setLastMove({ from: selectedSquare, to: square })
          setFeedback('correct')
          setScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }))
          setSessionStreak((prev) => prev + 1)
          completeDrill(currentPuzzle.id, true, timeMs)
        } else {
          setFeedback('wrong')
          setScore((prev) => ({ ...prev, total: prev.total + 1 }))
          setSessionStreak(0)
          completeDrill(currentPuzzle.id, false, timeMs)
        }

        setSelectedSquare(null)
        setLegalMoves([])

        // Move to next puzzle after delay
        setTimeout(() => {
          if (selectedDrillSet && currentPuzzleIndex < selectedDrillSet.puzzles.length - 1) {
            setCurrentPuzzleIndex((prev) => prev + 1)
          } else {
            setIsComplete(true)
          }
        }, 1500)

        return
      }

      // Select piece
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
    [game, currentPuzzle, selectedSquare, legalMoves, startTime, selectedDrillSet, currentPuzzleIndex, completeDrill, feedback]
  )

  const handleStartDrill = (drillSet: DrillSet) => {
    setSelectedDrillSet(drillSet)
    setCurrentPuzzleIndex(0)
    setScore({ correct: 0, total: 0 })
    setSessionStreak(0)
    setIsComplete(false)
  }

  const handleRestartDrill = () => {
    if (selectedDrillSet) {
      setCurrentPuzzleIndex(0)
      setScore({ correct: 0, total: 0 })
      setSessionStreak(0)
      setIsComplete(false)
    }
  }

  // Drill selection screen
  if (!selectedDrillSet) {
    return (
      <div className="min-h-screen p-6">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-wood-accent hover:text-wood-light transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
          <h1 className="text-3xl font-display font-bold text-wood-light">
            Entraînement Tactique
          </h1>
          <p className="text-wood-accent mt-1">
            Choisissez un type de puzzle
          </p>
        </motion.header>

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto grid gap-4"
        >
          {drillsData.drillSets.map((drillSet, index) => (
            <motion.button
              key={drillSet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleStartDrill(drillSet as DrillSet)}
              className="glass rounded-2xl p-6 text-left hover:border-wood-medium transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium text-wood-light group-hover:text-yellow-400 transition-colors">
                    {drillSet.title}
                  </h2>
                  <p className="text-wood-accent mt-1">{drillSet.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm text-wood-dark">
                      {drillSet.puzzles.length} puzzles
                    </span>
                    <span
                      className={`text-sm px-2 py-0.5 rounded ${
                        drillSet.difficulty === 'beginner'
                          ? 'bg-green-500/20 text-green-400'
                          : drillSet.difficulty === 'intermediate'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {drillSet.difficulty === 'beginner'
                        ? 'Débutant'
                        : drillSet.difficulty === 'intermediate'
                        ? 'Intermédiaire'
                        : 'Avancé'}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-wood-medium/20 flex items-center justify-center group-hover:bg-wood-medium/40 transition-colors">
                  <svg className="w-6 h-6 text-wood-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.main>
      </div>
    )
  }

  if (!game || !currentPuzzle) return null

  const isCheck = game.isCheck()
  const checkSquare = isCheck ? findKingSquare(game.fen(), game.turn()) : null

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between"
      >
        <button
          onClick={() => setSelectedDrillSet(null)}
          className="glass px-4 py-2 rounded-xl flex items-center gap-2 hover:border-wood-accent transition-colors"
        >
          <svg className="w-5 h-5 text-wood-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-wood-light">Quitter</span>
        </button>

        {/* Progress */}
        <div className="glass px-6 py-3 rounded-xl">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-wood-accent">Puzzle</p>
              <p className="text-lg font-medium text-wood-light">
                {currentPuzzleIndex + 1}/{selectedDrillSet.puzzles.length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-wood-accent">Score</p>
              <p className="text-lg font-medium text-green-400">
                {score.correct}/{score.total}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-wood-accent">Série</p>
              <p className="text-lg font-medium text-yellow-400">
                {sessionStreak}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 8, 10], fov: 45, near: 0.1, far: 100 }} gl={{ antialias: true, logarithmicDepthBuffer: true }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 15, 10]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
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
          interactive={!feedback}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#1a0f0a" roughness={0.9} />
        </mesh>

        <CameraControls />
      </Canvas>

      {/* Feedback overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center ${
                feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {feedback === 'correct' ? (
                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-20"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass rounded-2xl p-8 max-w-md text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-wood-medium to-yellow-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-wood-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-wood-light mb-2">
                Session terminée !
              </h2>
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="glass-light rounded-xl p-4">
                  <p className="text-sm text-wood-accent">Précision</p>
                  <p className="text-2xl font-bold text-green-400">
                    {Math.round((score.correct / score.total) * 100)}%
                  </p>
                </div>
                <div className="glass-light rounded-xl p-4">
                  <p className="text-sm text-wood-accent">Meilleure série</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {Math.max(sessionStreak, currentStreak)}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <button onClick={handleRestartDrill} className="btn-secondary">
                  Recommencer
                </button>
                <button onClick={() => setSelectedDrillSet(null)} className="btn-primary">
                  Autres puzzles
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
