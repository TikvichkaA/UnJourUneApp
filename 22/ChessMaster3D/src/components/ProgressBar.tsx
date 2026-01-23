import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  label?: string
  showPercent?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'gold' | 'green' | 'blue' | 'purple'
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  size = 'md',
  color = 'gold'
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }

  const colors = {
    gold: 'from-wood-medium to-yellow-500',
    green: 'from-green-600 to-green-400',
    blue: 'from-blue-600 to-blue-400',
    purple: 'from-purple-600 to-purple-400'
  }

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between text-sm mb-1">
          {label && <span className="text-wood-accent">{label}</span>}
          {showPercent && (
            <span className="text-wood-light font-medium">{Math.round(percent)}%</span>
          )}
        </div>
      )}
      <div
        className={`w-full ${heights[size]} bg-wood-dark/30 rounded-full overflow-hidden`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
        />
      </div>
    </div>
  )
}

interface XPBarProps {
  currentXP: number
  level: number
}

export function XPBar({ currentXP, level }: XPBarProps) {
  // XP needed for each level: level^2 * 100
  const xpForCurrentLevel = (level - 1) ** 2 * 100
  const xpForNextLevel = level ** 2 * 100
  const xpInLevel = currentXP - xpForCurrentLevel
  const xpNeeded = xpForNextLevel - xpForCurrentLevel
  const percent = (xpInLevel / xpNeeded) * 100

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wood-medium to-yellow-500 flex items-center justify-center">
            <span className="text-lg font-bold text-wood-dark">{level}</span>
          </div>
          <div>
            <p className="text-sm text-wood-accent">Niveau</p>
            <p className="font-medium text-wood-light">{currentXP} XP</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p className="text-wood-accent">Prochain niveau</p>
          <p className="text-wood-light">{xpForNextLevel} XP</p>
        </div>
      </div>
      <div className="h-2 bg-wood-dark/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-wood-medium to-yellow-500 rounded-full"
        />
      </div>
    </div>
  )
}

interface SkillMeterProps {
  name: string
  score: number
  maxScore?: number
  icon?: string
}

export function SkillMeter({ name, score, maxScore = 100 }: SkillMeterProps) {
  const level = score >= 100 ? 5 : score >= 70 ? 4 : score >= 40 ? 3 : score >= 20 ? 2 : score >= 5 ? 1 : 0

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-wood-light">{name}</span>
          <span className="text-wood-accent">Nv. {level}</span>
        </div>
        <div className="h-1.5 bg-wood-dark/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(score / maxScore) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
          />
        </div>
      </div>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full ${
              s <= level ? 'bg-yellow-500' : 'bg-wood-dark/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
