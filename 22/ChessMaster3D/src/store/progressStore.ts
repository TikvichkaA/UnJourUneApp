import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DrillStats {
  completed: number
  correct: number
  avgTime: number
  bestStreak: number
}

interface ProgressState {
  // Lessons
  lessonsCompleted: string[]
  lessonAttempts: Record<string, number>

  // Drills
  drillsStats: Record<string, DrillStats>
  currentStreak: number

  // Skills
  skillScores: Record<string, number>

  // General
  totalXP: number
  level: number
  lastPlayedAt: string | null
  dailyGoalProgress: {
    puzzlesSolved: number
    minutesPlayed: number
  }

  // Actions
  completeLesson: (lessonId: string, skillId: string) => void
  failLesson: (lessonId: string) => void
  completeDrill: (drillId: string, correct: boolean, timeMs: number) => void
  addXP: (amount: number) => void
  updateDailyGoal: (puzzles?: number, minutes?: number) => void
  resetDailyGoal: () => void
  getSkillLevel: (skillId: string) => number
}

const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessonsCompleted: [],
      lessonAttempts: {},
      drillsStats: {},
      currentStreak: 0,
      skillScores: {},
      totalXP: 0,
      level: 1,
      lastPlayedAt: null,
      dailyGoalProgress: {
        puzzlesSolved: 0,
        minutesPlayed: 0
      },

      completeLesson: (lessonId: string, skillId: string) => {
        const state = get()
        if (!state.lessonsCompleted.includes(lessonId)) {
          const newSkillScore = (state.skillScores[skillId] || 0) + 10
          const newXP = state.totalXP + 25

          set({
            lessonsCompleted: [...state.lessonsCompleted, lessonId],
            skillScores: {
              ...state.skillScores,
              [skillId]: newSkillScore
            },
            totalXP: newXP,
            level: calculateLevel(newXP),
            lastPlayedAt: new Date().toISOString()
          })
        }
      },

      failLesson: (lessonId: string) => {
        const state = get()
        set({
          lessonAttempts: {
            ...state.lessonAttempts,
            [lessonId]: (state.lessonAttempts[lessonId] || 0) + 1
          }
        })
      },

      completeDrill: (drillId: string, correct: boolean, timeMs: number) => {
        const state = get()
        const existing = state.drillsStats[drillId] || {
          completed: 0,
          correct: 0,
          avgTime: 0,
          bestStreak: 0
        }

        const newCompleted = existing.completed + 1
        const newCorrect = existing.correct + (correct ? 1 : 0)
        const newAvgTime = (existing.avgTime * existing.completed + timeMs) / newCompleted
        const newStreak = correct ? state.currentStreak + 1 : 0
        const newBestStreak = Math.max(existing.bestStreak, newStreak)

        const xpGain = correct ? 10 + Math.floor(newStreak / 3) * 5 : 2
        const newXP = state.totalXP + xpGain

        set({
          drillsStats: {
            ...state.drillsStats,
            [drillId]: {
              completed: newCompleted,
              correct: newCorrect,
              avgTime: newAvgTime,
              bestStreak: newBestStreak
            }
          },
          currentStreak: newStreak,
          totalXP: newXP,
          level: calculateLevel(newXP),
          lastPlayedAt: new Date().toISOString(),
          dailyGoalProgress: {
            ...state.dailyGoalProgress,
            puzzlesSolved: state.dailyGoalProgress.puzzlesSolved + 1
          }
        })
      },

      addXP: (amount: number) => {
        const state = get()
        const newXP = state.totalXP + amount
        set({
          totalXP: newXP,
          level: calculateLevel(newXP)
        })
      },

      updateDailyGoal: (puzzles?: number, minutes?: number) => {
        const state = get()
        set({
          dailyGoalProgress: {
            puzzlesSolved: puzzles ?? state.dailyGoalProgress.puzzlesSolved,
            minutesPlayed: minutes ?? state.dailyGoalProgress.minutesPlayed
          }
        })
      },

      resetDailyGoal: () => {
        set({
          dailyGoalProgress: {
            puzzlesSolved: 0,
            minutesPlayed: 0
          }
        })
      },

      getSkillLevel: (skillId: string) => {
        const score = get().skillScores[skillId] || 0
        if (score >= 100) return 5
        if (score >= 70) return 4
        if (score >= 40) return 3
        if (score >= 20) return 2
        if (score >= 5) return 1
        return 0
      }
    }),
    {
      name: 'chess-master-progress'
    }
  )
)
