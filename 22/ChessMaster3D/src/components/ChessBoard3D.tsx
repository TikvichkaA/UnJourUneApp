import { useRef, useMemo } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { Group, DoubleSide } from 'three'
import { Square } from 'chess.js'
import { ChessPiece3D } from './ChessPiece3D'
import { parseFEN, squareToPosition, positionToSquare } from '../engine/chessEngine'
import { useSettingsStore } from '../store/settingsStore'

interface ChessBoard3DProps {
  fen: string
  selectedSquare: Square | null
  legalMoves: Square[]
  lastMove: { from: Square; to: Square } | null
  onSquareClick: (square: Square) => void
  isCheck?: boolean
  checkSquare?: Square | null
  interactive?: boolean
}

export function ChessBoard3D({
  fen,
  selectedSquare,
  legalMoves,
  lastMove,
  onSquareClick,
  isCheck = false,
  checkSquare = null,
  interactive = true
}: ChessBoard3DProps) {
  const boardRef = useRef<Group>(null)
  const { showLegalMoves, showLastMove, showCheck } = useSettingsStore()

  // Parse the FEN to get piece positions
  const pieces = useMemo(() => parseFEN(fen), [fen])

  // Generate board squares
  const squares = useMemo(() => {
    const result: {
      square: Square
      position: [number, number, number]
      isLight: boolean
    }[] = []

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const squareName = (String.fromCharCode(97 + file) + (rank + 1)) as Square
        const isLight = (file + rank) % 2 === 1
        const [x, z] = squareToPosition(squareName)

        result.push({
          square: squareName,
          position: [x, 0, z],
          isLight
        })
      }
    }

    return result
  }, [])

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!interactive) return
    event.stopPropagation()

    const point = event.point
    const square = positionToSquare(point.x, point.z)

    if (square) {
      onSquareClick(square)
    }
  }

  // Animate board subtle float
  useFrame((state) => {
    if (boardRef.current) {
      boardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })

  return (
    <group ref={boardRef}>
      {/* Board base */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[9, 0.3, 9]} />
        <meshStandardMaterial color="#3d2817" roughness={0.8} />
      </mesh>

      {/* Board surface - single mesh for all squares */}
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <boxGeometry args={[8.2, 0.08, 8.2]} />
        <meshStandardMaterial color="#2a1a0f" roughness={0.6} />
      </mesh>

      {/* Squares - using boxes instead of planes to avoid z-fighting */}
      {squares.map(({ square, position, isLight }) => {
        const isSelected = square === selectedSquare
        const isLegalMove = showLegalMoves && legalMoves.includes(square)
        const isLastMoveSquare =
          showLastMove &&
          lastMove &&
          (square === lastMove.from || square === lastMove.to)
        const isCheckSquare = showCheck && isCheck && square === checkSquare

        let color = isLight ? '#e8d4a8' : '#8b6914'

        if (isSelected) {
          color = '#7cb342'
        } else if (isCheckSquare) {
          color = '#e53935'
        } else if (isLastMoveSquare) {
          color = isLight ? '#f0e68c' : '#daa520'
        }

        return (
          <group key={square}>
            {/* Square tile - using thin box */}
            <mesh
              position={[position[0], 0.01, position[2]]}
              onPointerDown={handlePointerDown}
              receiveShadow
            >
              <boxGeometry args={[0.98, 0.02, 0.98]} />
              <meshStandardMaterial
                color={color}
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>

            {/* Legal move indicator */}
            {isLegalMove && (
              <mesh
                position={[position[0], 0.03, position[2]]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                {pieces.has(square) ? (
                  // Capture indicator - ring
                  <>
                    <ringGeometry args={[0.35, 0.42, 32]} />
                    <meshStandardMaterial
                      color="#66bb6a"
                      transparent
                      opacity={0.9}
                    />
                  </>
                ) : (
                  // Move indicator - dot
                  <>
                    <circleGeometry args={[0.12, 32]} />
                    <meshStandardMaterial
                      color="#66bb6a"
                      transparent
                      opacity={0.85}
                    />
                  </>
                )}
              </mesh>
            )}
          </group>
        )
      })}

      {/* Pieces */}
      {Array.from(pieces.entries()).map(([square, piece]) => {
        const [x, z] = squareToPosition(square)

        return (
          <ChessPiece3D
            key={`${square}-${piece.type}-${piece.color}`}
            type={piece.type}
            color={piece.color}
            position={[x, 0.01, z]}
            isSelected={square === selectedSquare}
            onClick={() => interactive && onSquareClick(square)}
          />
        )
      })}

      {/* File labels (a-h) */}
      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((file, i) => (
        <mesh key={`file-${file}`} position={[i - 3.5, -0.14, -4.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      ))}

      {/* Rank labels (1-8) */}
      {['1', '2', '3', '4', '5', '6', '7', '8'].map((rank, i) => (
        <mesh key={`rank-${rank}`} position={[-4.3, -0.14, i - 3.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      ))}
    </group>
  )
}
