import { Chess, Square, Move } from 'chess.js'

export interface ChessPosition {
  fen: string
  turn: 'w' | 'b'
  isCheck: boolean
  isCheckmate: boolean
  isStalemate: boolean
  isDraw: boolean
}

export interface PieceInfo {
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
  color: 'w' | 'b'
  square: Square
}

export function parseFEN(fen: string): Map<Square, PieceInfo> {
  const pieces = new Map<Square, PieceInfo>()
  const game = new Chess(fen)

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8']

  for (const file of files) {
    for (const rank of ranks) {
      const square = (file + rank) as Square
      const piece = game.get(square)
      if (piece) {
        pieces.set(square, {
          type: piece.type,
          color: piece.color,
          square
        })
      }
    }
  }

  return pieces
}

export function squareToPosition(square: Square): [number, number] {
  const file = square.charCodeAt(0) - 97 // 'a' = 0, 'b' = 1, ...
  const rank = parseInt(square[1]) - 1 // '1' = 0, '2' = 1, ...
  return [file - 3.5, rank - 3.5] // Center the board
}

export function positionToSquare(x: number, z: number): Square | null {
  const file = Math.round(x + 3.5)
  const rank = Math.round(z + 3.5)

  if (file < 0 || file > 7 || rank < 0 || rank > 7) {
    return null
  }

  const fileLetter = String.fromCharCode(97 + file)
  const rankNumber = (rank + 1).toString()

  return (fileLetter + rankNumber) as Square
}

export function validateMove(
  game: Chess,
  from: Square,
  to: Square
): Move | null {
  try {
    const moves = game.moves({ square: from, verbose: true })
    const validMove = moves.find((m) => m.to === to)

    if (validMove) {
      return validMove
    }
  } catch {
    // Invalid position or move
  }

  return null
}

export function getGameStatus(game: Chess): ChessPosition {
  return {
    fen: game.fen(),
    turn: game.turn(),
    isCheck: game.isCheck(),
    isCheckmate: game.isCheckmate(),
    isStalemate: game.isStalemate(),
    isDraw: game.isDraw()
  }
}

export function getPieceValue(type: string): number {
  const values: Record<string, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0
  }
  return values[type.toLowerCase()] || 0
}

export function getMaterialBalance(fen: string): number {
  const pieces = parseFEN(fen)
  let balance = 0

  pieces.forEach((piece) => {
    const value = getPieceValue(piece.type)
    balance += piece.color === 'w' ? value : -value
  })

  return balance
}

export function isMoveMate(game: Chess, from: Square, to: Square): boolean {
  const testGame = new Chess(game.fen())
  try {
    testGame.move({ from, to })
    return testGame.isCheckmate()
  } catch {
    return false
  }
}

export function findKingSquare(fen: string, color: 'w' | 'b'): Square | null {
  const pieces = parseFEN(fen)

  for (const [square, piece] of pieces) {
    if (piece.type === 'k' && piece.color === color) {
      return square
    }
  }

  return null
}

export function getAttackedSquares(game: Chess, color: 'w' | 'b'): Set<Square> {
  const attacked = new Set<Square>()
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8']

  for (const file of files) {
    for (const rank of ranks) {
      const square = (file + rank) as Square
      const piece = game.get(square)

      if (piece && piece.color === color) {
        const moves = game.moves({ square, verbose: true })
        moves.forEach((move) => {
          if (move.captured || move.flags.includes('e')) {
            attacked.add(move.to as Square)
          }
        })
      }
    }
  }

  return attacked
}
