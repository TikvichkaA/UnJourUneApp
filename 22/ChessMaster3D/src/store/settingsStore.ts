import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  // Board settings
  showLegalMoves: boolean
  showLastMove: boolean
  showThreats: boolean
  showCheck: boolean

  // Visual
  theme: 'wood' | 'marble' | 'modern'
  pieceStyle: 'classic' | 'neo'
  soundEnabled: boolean
  soundVolume: number

  // Camera
  cameraAutoRotate: boolean
  cameraSensitivity: number

  // Hints
  hintLevel: 'none' | 'zone' | 'piece' | 'move'

  // Actions
  toggleLegalMoves: () => void
  toggleLastMove: () => void
  toggleThreats: () => void
  toggleCheck: () => void
  toggleSound: () => void
  setTheme: (theme: 'wood' | 'marble' | 'modern') => void
  setPieceStyle: (style: 'classic' | 'neo') => void
  setSoundVolume: (volume: number) => void
  setHintLevel: (level: 'none' | 'zone' | 'piece' | 'move') => void
  toggleCameraAutoRotate: () => void
  setCameraSensitivity: (sensitivity: number) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      showLegalMoves: true,
      showLastMove: true,
      showThreats: false,
      showCheck: true,
      theme: 'wood',
      pieceStyle: 'classic',
      soundEnabled: true,
      soundVolume: 0.5,
      cameraAutoRotate: false,
      cameraSensitivity: 1,
      hintLevel: 'zone',

      toggleLegalMoves: () => set((s) => ({ showLegalMoves: !s.showLegalMoves })),
      toggleLastMove: () => set((s) => ({ showLastMove: !s.showLastMove })),
      toggleThreats: () => set((s) => ({ showThreats: !s.showThreats })),
      toggleCheck: () => set((s) => ({ showCheck: !s.showCheck })),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setTheme: (theme) => set({ theme }),
      setPieceStyle: (pieceStyle) => set({ pieceStyle }),
      setSoundVolume: (soundVolume) => set({ soundVolume }),
      setHintLevel: (hintLevel) => set({ hintLevel }),
      toggleCameraAutoRotate: () => set((s) => ({ cameraAutoRotate: !s.cameraAutoRotate })),
      setCameraSensitivity: (cameraSensitivity) => set({ cameraSensitivity })
    }),
    {
      name: 'chess-master-settings'
    }
  )
)
