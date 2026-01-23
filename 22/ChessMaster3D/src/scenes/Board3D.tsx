import { useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChessBoard3D } from '../components/ChessBoard3D'
import { CameraControls } from '../components/CameraControls'
import { HUD } from '../components/HUD'
import { useGameStore } from '../store/gameStore'
import { findKingSquare } from '../engine/chessEngine'

export default function Board3D() {
  const navigate = useNavigate()
  const {
    fen,
    selectedSquare,
    legalMoves,
    lastMove,
    history,
    isCheck,
    isCheckmate,
    isStalemate,
    turn,
    initGame,
    selectSquare,
    undoMove,
    resetGame
  } = useGameStore()

  useEffect(() => {
    initGame()
  }, [initGame])

  const handleResetCamera = useCallback(() => {
    if ((window as any).resetChessCamera) {
      (window as any).resetChessCamera()
    }
  }, [])

  // Find king square for check highlight
  const checkSquare = isCheck ? findKingSquare(fen, turn) : null

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-10 glass px-4 py-2 rounded-xl flex items-center gap-2 hover:border-wood-accent transition-colors"
      >
        <svg
          className="w-5 h-5 text-wood-light"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span className="text-wood-light">Retour</span>
      </motion.button>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 8, 10], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, logarithmicDepthBuffer: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, 10, -5]} intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={0.2} />

        {/* Environment */}
        <fog attach="fog" args={['#1a0f0a', 15, 40]} />

        {/* Chess board */}
        <ChessBoard3D
          fen={fen}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          lastMove={lastMove}
          onSquareClick={selectSquare}
          isCheck={isCheck}
          checkSquare={checkSquare}
        />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#1a0f0a" roughness={0.9} />
        </mesh>

        {/* Camera controls */}
        <CameraControls onResetCamera={handleResetCamera} />
      </Canvas>

      {/* HUD */}
      <HUD
        turn={turn}
        isCheck={isCheck}
        isCheckmate={isCheckmate}
        isStalemate={isStalemate}
        moveHistory={history}
        onUndo={undoMove}
        onReset={resetGame}
        onResetCamera={handleResetCamera}
      />

      {/* Game over overlay */}
      {(isCheckmate || isStalemate) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl p-8 text-center max-w-md"
          >
            <h2 className="text-3xl font-display font-bold text-wood-light mb-2">
              {isCheckmate
                ? turn === 'w'
                  ? 'Victoire des Noirs !'
                  : 'Victoire des Blancs !'
                : 'Partie nulle !'}
            </h2>
            <p className="text-wood-accent mb-6">
              {isCheckmate ? 'Échec et mat' : 'Pat'}
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={resetGame} className="btn-primary">
                Rejouer
              </button>
              <button onClick={() => navigate('/')} className="btn-secondary">
                Menu
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
