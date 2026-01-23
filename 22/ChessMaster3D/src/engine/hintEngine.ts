import { Chess, Square, Move } from 'chess.js'

export type HintLevel = 'none' | 'zone' | 'piece' | 'move'

export interface Hint {
  level: HintLevel
  zone?: string // e.g., "kingside", "queenside", "center"
  piece?: Square
  move?: { from: Square; to: Square }
  explanation?: string
}

export function generateHint(
  game: Chess,
  correctMoves: string[],
  currentLevel: HintLevel
): Hint {
  if (currentLevel === 'none' || correctMoves.length === 0) {
    return { level: 'none' }
  }

  // Parse the first correct move
  const testGame = new Chess(game.fen())
  let bestMove: Move | null = null

  for (const moveNotation of correctMoves) {
    try {
      bestMove = testGame.move(moveNotation)
      break
    } catch {
      continue
    }
  }

  if (!bestMove) {
    return { level: 'none' }
  }

  switch (currentLevel) {
    case 'zone':
      return {
        level: 'zone',
        zone: getZone(bestMove.to as Square),
        explanation: `Regardez du côté ${getZoneName(bestMove.to as Square)}`
      }

    case 'piece':
      return {
        level: 'piece',
        piece: bestMove.from as Square,
        explanation: `Utilisez votre ${getPieceName(bestMove.piece)}`
      }

    case 'move':
      return {
        level: 'move',
        move: {
          from: bestMove.from as Square,
          to: bestMove.to as Square
        },
        explanation: `Le coup est ${bestMove.san}`
      }

    default:
      return { level: 'none' }
  }
}

function getZone(square: Square): string {
  const file = square.charCodeAt(0) - 97

  if (file <= 2) return 'queenside'
  if (file >= 5) return 'kingside'
  return 'center'
}

function getZoneName(square: Square): string {
  const file = square.charCodeAt(0) - 97

  if (file <= 2) return "de l'aile Dame"
  if (file >= 5) return "de l'aile Roi"
  return 'du centre'
}

function getPieceName(piece: string): string {
  const names: Record<string, string> = {
    p: 'pion',
    n: 'cavalier',
    b: 'fou',
    r: 'tour',
    q: 'dame',
    k: 'roi'
  }
  return names[piece.toLowerCase()] || 'pièce'
}

export function evaluateMove(
  game: Chess,
  move: { from: Square; to: Square },
  correctMoves: string[]
): { isCorrect: boolean; explanation: string } {
  const testGame = new Chess(game.fen())

  try {
    const madeMove = testGame.move({ from: move.from, to: move.to })

    if (!madeMove) {
      return {
        isCorrect: false,
        explanation: 'Ce coup est illégal.'
      }
    }

    // Check if the move matches any correct move
    const isCorrect = correctMoves.some((cm) => {
      const checkGame = new Chess(game.fen())
      try {
        const correctMove = checkGame.move(cm)
        return (
          correctMove &&
          correctMove.from === madeMove.from &&
          correctMove.to === madeMove.to
        )
      } catch {
        return false
      }
    })

    if (isCorrect) {
      return {
        isCorrect: true,
        explanation: ''
      }
    }

    // Analyze why the move is wrong
    if (testGame.isCheckmate()) {
      return {
        isCorrect: false,
        explanation: 'Ce coup mène au mat, mais pas le bon !'
      }
    }

    if (testGame.isCheck()) {
      return {
        isCorrect: false,
        explanation: "L'échec n'est pas la meilleure continuation ici."
      }
    }

    // Check if a piece was hung
    const captureValue = madeMove.captured
      ? getPieceValue(madeMove.captured)
      : 0

    if (captureValue > 0 && !isDefended(testGame, madeMove.to as Square)) {
      return {
        isCorrect: false,
        explanation: 'Cette capture laisse votre pièce en prise.'
      }
    }

    return {
      isCorrect: false,
      explanation: 'Ce coup ne réalise pas l\'objectif. Cherchez mieux !'
    }
  } catch {
    return {
      isCorrect: false,
      explanation: 'Coup invalide.'
    }
  }
}

function getPieceValue(type: string): number {
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

function isDefended(game: Chess, square: Square): boolean {
  const color = game.turn()
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8']

  for (const file of files) {
    for (const rank of ranks) {
      const fromSquare = (file + rank) as Square
      const piece = game.get(fromSquare)

      if (piece && piece.color === color) {
        const moves = game.moves({ square: fromSquare, verbose: true })
        if (moves.some((m) => m.to === square)) {
          return true
        }
      }
    }
  }

  return false
}

export function getProgressiveHint(
  game: Chess,
  correctMoves: string[],
  attemptCount: number
): Hint {
  if (attemptCount === 0) {
    return { level: 'none' }
  } else if (attemptCount === 1) {
    return generateHint(game, correctMoves, 'zone')
  } else if (attemptCount === 2) {
    return generateHint(game, correctMoves, 'piece')
  } else {
    return generateHint(game, correctMoves, 'move')
  }
}
