import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import './ActionFeedback.css'

const EFFECT_LABELS = {
  economie: { name: 'Economie', icon: '📊' },
  environnement: { name: 'Environnement', icon: '🌿' },
  cohesion: { name: 'Cohesion', icon: '🤝' },
  energie: { name: 'Energie', icon: '⚡' }
}

const HIDDEN_LABELS = {
  tension: { name: 'Tensions sociales', icon: '😤', bad: true },
  pollution: { name: 'Pollution', icon: '🏭', bad: true },
  health: { name: 'Sante publique', icon: '💊' },
  education: { name: 'Education', icon: '📚' },
  greenInvest: { name: 'Invest. ecologique', icon: '🌱' },
  housingCapacity: { name: 'Capacite logement', icon: '🏠' },
  culture: { name: 'Vie culturelle', icon: '🎭' },
  mobility: { name: 'Mobilite', icon: '🚇' },
  security: { name: 'Securite', icon: '🛡️' },
  liberty: { name: 'Libertes', icon: '🕊️' },
  debt: { name: 'Dette', icon: '💸', bad: true },
  infrastructureDebt: { name: 'Dette infrastructure', icon: '🔧', bad: true }
}

export default function ActionFeedback() {
  const [visible, setVisible] = useState(false)
  const [feedbackData, setFeedbackData] = useState(null)

  const { lastActionName, indicatorDeltas, actionHistory, delayedEffects, budget, turn } = useGameStore()

  useEffect(() => {
    if (lastActionName && actionHistory.length > 0) {
      const lastAction = actionHistory[actionHistory.length - 1]

      // Trouver les effets differes associes a cette action
      const upcomingEffects = delayedEffects.filter(d => d.triggerTurn > turn)

      setFeedbackData({
        name: lastActionName,
        cost: lastAction.cost,
        effects: lastAction.effects || {},
        deltas: indicatorDeltas,
        delayed: upcomingEffects.slice(0, 3), // Max 3 effets differes affiches
        budgetAfter: budget
      })
      setVisible(true)

      const timer = setTimeout(() => setVisible(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [actionHistory.length])

  if (!visible || !feedbackData) return null

  const hasEffects = Object.keys(feedbackData.effects).length > 0
  const hasDelayed = feedbackData.delayed.length > 0

  return (
    <div className={`action-feedback ${visible ? 'visible' : ''}`}>
      <div className="feedback-header">
        <span className="feedback-action-name">{feedbackData.name}</span>
        {feedbackData.cost > 0 && (
          <span className="feedback-cost">-{feedbackData.cost} pts</span>
        )}
      </div>

      {hasEffects && (
        <div className="feedback-effects">
          <span className="feedback-label">Effets immediats</span>
          <div className="feedback-effect-list">
            {Object.entries(feedbackData.effects).map(([key, value]) => {
              const label = EFFECT_LABELS[key]
              if (!label) return null
              const isPositive = value > 0
              return (
                <span key={key} className={`feedback-effect ${isPositive ? 'positive' : 'negative'}`}>
                  {label.icon} {isPositive ? '+' : ''}{value}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {hasDelayed && (
        <div className="feedback-delayed">
          <span className="feedback-label">A venir...</span>
          {feedbackData.delayed.map((d, i) => (
            <div key={i} className="feedback-delayed-item">
              <span className="delayed-turn">Tour {d.triggerTurn}</span>
              <span className="delayed-reason">{d.reason}</span>
            </div>
          ))}
        </div>
      )}

      <div className="feedback-budget">
        Budget restant: <strong>{feedbackData.budgetAfter} pts</strong>
      </div>
    </div>
  )
}
