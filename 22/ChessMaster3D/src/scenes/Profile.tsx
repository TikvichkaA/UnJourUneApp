import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../store/progressStore'
import { XPBar, SkillMeter } from '../components/ProgressBar'
import skillsData from '../data/skills.json'
import lessonsData from '../data/lessons.json'

export default function Profile() {
  const navigate = useNavigate()
  const {
    lessonsCompleted,
    drillsStats,
    skillScores,
    totalXP,
    level,
    currentStreak
  } = useProgressStore()

  // Calculate stats
  const totalLessons = lessonsData.chapters.reduce(
    (acc, chapter) => acc + chapter.lessons.length,
    0
  )
  const completedLessons = lessonsCompleted.length
  const completionPercent = Math.round((completedLessons / totalLessons) * 100)

  // Drill stats
  const drillEntries = Object.entries(drillsStats)
  const totalDrills = drillEntries.reduce((acc, [_, stats]) => acc + stats.completed, 0)
  const correctDrills = drillEntries.reduce((acc, [_, stats]) => acc + stats.correct, 0)
  const drillAccuracy = totalDrills > 0 ? Math.round((correctDrills / totalDrills) * 100) : 0
  const bestStreak = drillEntries.reduce(
    (max, [_, stats]) => Math.max(max, stats.bestStreak),
    currentStreak
  )

  // Group skills by category
  const skillsByCategory = skillsData.categories.map((category) => ({
    ...category,
    skills: skillsData.skills.filter((s) => s.category === category.id)
  }))

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen p-6 overflow-y-auto">
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

        {/* Profile header */}
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-wood-medium to-yellow-500 flex items-center justify-center">
            <svg className="w-10 h-10 text-wood-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-wood-light">
              Profil
            </h1>
            <p className="text-wood-accent">Joueur d'échecs en progression</p>
          </div>
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
        {/* Stats grid */}
        <motion.section variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Leçons"
            value={`${completedLessons}/${totalLessons}`}
            subtext={`${completionPercent}% complété`}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            color="blue"
          />
          <StatCard
            label="Puzzles"
            value={totalDrills.toString()}
            subtext={`${drillAccuracy}% précision`}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            color="orange"
          />
          <StatCard
            label="Série actuelle"
            value={currentStreak.toString()}
            subtext="puzzles corrects"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            }
            color="yellow"
          />
          <StatCard
            label="Meilleure série"
            value={bestStreak.toString()}
            subtext="record personnel"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
            color="purple"
          />
        </motion.section>

        {/* Skills */}
        <motion.section variants={itemVariants} className="glass rounded-2xl p-6">
          <h2 className="text-lg font-medium text-wood-light mb-4">
            Compétences
          </h2>

          <div className="space-y-6">
            {skillsByCategory.map((category) => (
              <div key={category.id}>
                <h3
                  className="text-sm font-medium mb-3"
                  style={{ color: category.color }}
                >
                  {category.name}
                </h3>
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <SkillMeter
                      key={skill.id}
                      name={skill.name}
                      score={skillScores[skill.id] || 0}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Achievements placeholder */}
        <motion.section variants={itemVariants} className="glass rounded-2xl p-6">
          <h2 className="text-lg font-medium text-wood-light mb-4">
            Accomplissements
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'Premier mat', unlocked: completedLessons >= 1 },
              { name: '5 leçons', unlocked: completedLessons >= 5 },
              { name: '10 puzzles', unlocked: totalDrills >= 10 },
              { name: 'Série de 5', unlocked: bestStreak >= 5 },
              { name: 'Niveau 5', unlocked: level >= 5 },
              { name: 'Précision 80%', unlocked: drillAccuracy >= 80 }
            ].map((achievement, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-wood-medium to-yellow-500'
                    : 'bg-wood-dark/30'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    achievement.unlocked ? 'bg-white/20' : 'bg-gray-600/30'
                  }`}
                >
                  {achievement.unlocked ? (
                    <svg className="w-4 h-4 text-wood-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-xs text-center ${
                    achievement.unlocked ? 'text-wood-dark' : 'text-gray-500'
                  }`}
                >
                  {achievement.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.main>
    </div>
  )
}

function StatCard({
  label,
  value,
  subtext,
  icon,
  color
}: {
  label: string
  value: string
  subtext: string
  icon: React.ReactNode
  color: 'blue' | 'orange' | 'yellow' | 'purple'
}) {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-400',
    orange: 'bg-orange-500/20 text-orange-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    purple: 'bg-purple-500/20 text-purple-400'
  }

  return (
    <div className="glass rounded-xl p-4">
      <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-wood-light">{value}</p>
      <p className="text-sm text-wood-accent">{label}</p>
      <p className="text-xs text-wood-dark mt-1">{subtext}</p>
    </div>
  )
}
