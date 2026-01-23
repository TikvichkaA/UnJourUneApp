import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../store/progressStore'
import { XPBar, ProgressBar } from '../components/ProgressBar'
import lessonsData from '../data/lessons.json'

export default function Home() {
  const navigate = useNavigate()
  const { lessonsCompleted, totalXP, level, dailyGoalProgress } = useProgressStore()

  // Calculate chapter progress
  const getChapterProgress = (chapterId: string) => {
    const chapter = lessonsData.chapters.find((c) => c.id === chapterId)
    if (!chapter) return 0

    const completed = chapter.lessons.filter((l) =>
      lessonsCompleted.includes(l.id)
    ).length

    return Math.round((completed / chapter.lessons.length) * 100)
  }

  // Find next lesson
  const findNextLesson = () => {
    for (const chapter of lessonsData.chapters) {
      for (const lesson of chapter.lessons) {
        if (!lessonsCompleted.includes(lesson.id)) {
          return lesson
        }
      }
    }
    return null
  }

  const nextLesson = findNextLesson()

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen p-6 overflow-y-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-wood-light">
              ChessMaster 3D
            </h1>
            <p className="text-wood-accent mt-1">
              Apprenez les échecs pas à pas
            </p>
          </div>

          {/* Profile button */}
          <button
            onClick={() => navigate('/profile')}
            className="glass p-3 rounded-xl hover:border-wood-accent transition-colors"
          >
            <svg
              className="w-6 h-6 text-wood-light"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        </div>

        {/* XP Bar */}
        <XPBar currentXP={totalXP} level={level} />
      </motion.header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Daily goal */}
        <motion.section variants={itemVariants} className="glass rounded-2xl p-6">
          <h2 className="text-lg font-medium text-wood-light mb-4">
            Objectif du jour
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ProgressBar
                value={dailyGoalProgress.puzzlesSolved}
                max={5}
                label="Puzzles"
                size="md"
                color="green"
              />
            </div>
            <div>
              <ProgressBar
                value={dailyGoalProgress.minutesPlayed}
                max={10}
                label="Minutes"
                size="md"
                color="blue"
              />
            </div>
          </div>
        </motion.section>

        {/* Continue button */}
        {nextLesson && (
          <motion.section variants={itemVariants}>
            <button
              onClick={() => navigate(`/lesson/${nextLesson.id}`)}
              className="w-full glass rounded-2xl p-6 text-left hover:border-wood-medium transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-wood-accent text-sm mb-1">Continuer</p>
                  <h2 className="text-xl font-medium text-wood-light">
                    {nextLesson.title}
                  </h2>
                  <p className="text-wood-dark text-sm mt-1">
                    {nextLesson.intro.substring(0, 60)}...
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-wood-medium to-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-wood-dark"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </button>
          </motion.section>
        )}

        {/* Quick actions */}
        <motion.section variants={itemVariants} className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/play')}
            className="glass rounded-2xl p-6 text-left hover:border-wood-medium transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-wood-light">Mode Libre</h3>
            <p className="text-sm text-wood-dark mt-1">Jouez sur le plateau 3D</p>
          </button>

          <button
            onClick={() => navigate('/drills')}
            className="glass rounded-2xl p-6 text-left hover:border-wood-medium transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-orange-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-wood-light">Puzzles</h3>
            <p className="text-sm text-wood-dark mt-1">Entraînement tactique</p>
          </button>
        </motion.section>

        {/* Chapters */}
        <motion.section variants={itemVariants}>
          <h2 className="text-lg font-medium text-wood-light mb-4">Parcours</h2>
          <div className="space-y-4">
            {lessonsData.chapters.map((chapter, index) => {
              const progress = getChapterProgress(chapter.id)
              const isUnlocked = index === 0 || getChapterProgress(lessonsData.chapters[index - 1].id) >= 50

              return (
                <motion.div
                  key={chapter.id}
                  variants={itemVariants}
                  className={`glass rounded-2xl p-5 ${
                    isUnlocked ? 'cursor-pointer hover:border-wood-medium' : 'opacity-60'
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          progress === 100
                            ? 'bg-green-500/20'
                            : isUnlocked
                            ? 'bg-wood-medium/20'
                            : 'bg-gray-500/20'
                        }`}
                      >
                        {progress === 100 ? (
                          <svg
                            className="w-5 h-5 text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : isUnlocked ? (
                          <span className="text-wood-light font-medium">
                            {index + 1}
                          </span>
                        ) : (
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-wood-light">
                          {chapter.title}
                        </h3>
                        <p className="text-sm text-wood-dark">
                          {chapter.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-wood-accent text-sm">
                      {chapter.lessons.filter((l) =>
                        lessonsCompleted.includes(l.id)
                      ).length}
                      /{chapter.lessons.length}
                    </span>
                  </div>

                  <ProgressBar
                    value={progress}
                    showPercent={false}
                    size="sm"
                    color={progress === 100 ? 'green' : 'gold'}
                  />

                  {/* Lesson list */}
                  {isUnlocked && (
                    <div className="mt-4 space-y-2">
                      {chapter.lessons.map((lesson) => {
                        const isCompleted = lessonsCompleted.includes(lesson.id)

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => navigate(`/lesson/${lesson.id}`)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                              isCompleted
                                ? 'bg-green-500/10 hover:bg-green-500/20'
                                : 'hover:bg-wood-dark/20'
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                isCompleted
                                  ? 'bg-green-500'
                                  : 'border border-wood-dark'
                              }`}
                            >
                              {isCompleted && (
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                            <span
                              className={
                                isCompleted ? 'text-wood-light' : 'text-wood-accent'
                              }
                            >
                              {lesson.title}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.section>
      </motion.main>
    </div>
  )
}
