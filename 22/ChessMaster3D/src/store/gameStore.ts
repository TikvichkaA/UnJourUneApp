import { create } from 'zustand'
import { Chess, Square, Move } from 'chess.js'

interface GameState {
  // Game instance
  game: Chess
  fen: string
  history: string[]

  // Selection
  selectedSquare: Square | null
  legalMoves: Square[]
  lastMove: { from: Square; to: Square } | null

  // Game state
  isCheck: boolean
  isCheckmate: boolean
  isStalemate: boolean
  isDraw: boolean
  turn: 'w' | 'b'

  // Actions
  initGame: (fen?: string) => void
  selectSquare: (square: Square) => void
  makeMove: (from: Square, to: Square, promotion?: string) => Move | null
  undoMove: () => void
  resetGame: () => void
  getLegalMovesForSquare: (square: Square) => Square[]
  isLegalMove: (from: Square, to: Square) => boolean
  getPieceAt: (square: Square) => { type: string; color: 'w' | 'b' } | null
}

export const useGameStore = create<GameState>((set, get) => ({
  game: new Chess(),
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  history: [],
  selectedSquare: null,
  legalMoves: [],
  lastMove: null,
  isCheck: false,
  isCheckmate: false,
  isStalemate: false,
  isDraw: false,
  turn: 'w',

  initGame: (fen?: string) => {
    const game = new Chess(fen)
    set({
      game,
      fen: game.fen(),
      history: [],
      selectedSquare: null,
      legalMoves: [],
      lastMove: null,
      isCheck: game.isCheck(),
      isCheckmate: game.isCheckmate(),
      isStalemate: game.isStalemate(),
      isDraw: game.isDraw(),
      turn: game.turn()
    })
  },

  selectSquare: (square: Square) => {
    const { game, selectedSquare, legalMoves } = get()

    // If clicking on a legal move destination, make the move
    if (selectedSquare && legalMoves.includes(square)) {
      get().makeMove(selectedSquare, square)
      return
    }

    // Get piece at square
    const piece = game.get(square)

    // If clicking on own piece, select it
    if (piece && piece.color === game.turn()) {
      const moves = game.moves({ square, verbose: true })
      set({
        selectedSquare: square,
        legalMoves: moves.map(m => m.to as Square)
      })
    } else {
      // Deselect
      set({
        selectedSquare: null,
        legalMoves: []
      })
    }
  },

  makeMove: (from: Square, to: Square, promotion = 'q') => {
    const { game } = get()

    try {
      const move = game.move({ from, to, promotion })

      if (move) {
        set({
          fen: game.fen(),
          history: [...get().history, move.san],
          selectedSquare: null,
          legalMoves: [],
          lastMove: { from: move.from as Square, to: move.to as Square },
          isCheck: game.isCheck(),
          isCheckmate: game.isCheckmate(),
          isStalemate: game.isStalemate(),
          isDraw: game.isDraw(),
          turn: game.turn()
        })
        return move
      }
    } catch {
      // Invalid move
    }

    set({
      selectedSquare: null,
      legalMoves: []
    })
    return null
  },

  undoMove: () => {
    const { game, history } = get()
    const move = game.undo()

    if (move) {
      set({
        fen: game.fen(),
        history: history.slice(0, -1),
        selectedSquare: null,
        legalMoves: [],
        lastMove: null,
        isCheck: game.isCheck(),
        isCheckmate: game.isCheckmate(),
        isStalemate: game.isStalemate(),
        isDraw: game.isDraw(),
        turn: game.turn()
      })
    }
  },

  resetGame: () => {
    get().initGame()
  },

  getLegalMovesForSquare: (square: Square) => {
    const { game } = get()
    const moves = game.moves({ square, verbose: true })
    return moves.map(m => m.to as Square)
  },

  isLegalMove: (from: Square, to: Square) => {
    const { game } = get()
    const moves = game.moves({ square: from, verbose: true })
    return moves.some(m => m.to === to)
  },

  getPieceAt: (square: Square) => {
    const { game } = get()
    const piece = game.get(square)
    return piece || null
  }
}))
