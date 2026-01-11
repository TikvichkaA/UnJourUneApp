import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import './HiddenStatsPanel.css'

// Variables revelees selon leur niveau critique
const HIDDEN_THRESHOLDS = {
  tension: { reveal: 25, danger: 40, icon: '😤', name: 'Tensions sociales', bad: true },
  pollution: { reveal: 20, danger: 35, icon: '🏭', name: 'Pollution', bad: true },
  liberty: { reveal: 50, danger: 35, icon: '🕊️', name: 'Libertes', bad: false, invert: true },
  health: { reveal: 45, danger: 30, icon: '💊', name: 'Sante publique', bad: false, invert: true },
  education: { reveal: 40, danger: 25, icon: '📚', name: 'Education', bad: false, invert: true },
  infrastructureDebt: { reveal: 20, danger: 30, icon: '🔧', name: 'Dette technique', bad: true }
}

export default function HiddenStatsPanel() {
  const [expanded, setExpanded] = useState(false)
  const { hidden, turn } = useGameStore()

  // Determiner quelles variables sont revelees
  const revealedStats = Object.entries(HIDDEN_THRESHOLDS).filter(([key, config]) => {
    const value = hidden[key] || 0
    if (config.invert) {
      return value < config.reveal
    }
    return value >= config.reveal
  })

  // Compter les alertes
  const alertCount = revealedStats.filter(([key, config]) => {
    const value = hidden[key] || 0
    if (config.invert) {
      return value <= config.danger
    }
    return value >= config.danger
  }).length

  if (turn < 3 && revealedStats.length === 0) {
    return null // Pas de panneau au debut si rien a montrer
  }

  return (
    <div className="hidden-stats-panel">
      <div className="hidden-stats-header" onClick={() => setExpanded(!expanded)}>
        <span className="hidden-stats-icon">🔍</span>
        <span className="hidden-stats-title">Signaux faibles</span>
        {alertCount > 0 && (
          <span className="alert-badge">{alertCount}</span>
        )}
        <span className="hidden-stats-toggle">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="hidden-stats-content">
          {revealedStats.length === 0 ? (
            <p className="no-signals">Aucun signal preoccupant pour l'instant.</p>
          ) : (
            <div className="hidden-stats-list">
              {revealedStats.map(([key, config]) => {
                const value = hidden[key] || 0
                const isDanger = config.invert ? value <= config.danger : value >= config.danger

                // Calculer un niveau de risque visuel
                let level = 'normal'
                if (config.bad) {
                  if (value >= config.danger) level = 'danger'
                  else if (value >= config.reveal) level = 'warning'
                } else if (config.invert) {
                  if (value <= config.danger) level = 'danger'
                  else if (value < config.reveal) level = 'warning'
                }

                return (
                  <div key={key} className={`hidden-stat ${level}`}>
                    <span className="stat-icon">{config.icon}</span>
                    <div className="stat-info">
                      <span className="stat-name">{config.name}</span>
                      <div className="stat-bar-container">
                        <div
                          className={`stat-bar ${level}`}
                          style={{ width: `${Math.min(100, value)}%` }}
                        />
                      </div>
                    </div>
                    <span className={`stat-value ${level}`}>{Math.round(value)}</span>
                  </div>
                )
              })}
            </div>
          )}

          <div className="hidden-stats-explanation">
            <p>Ces indicateurs influencent la vie de la cite mais ne sont pas directement visibles. Ils peuvent declencher des evenements ou des crises.</p>
          </div>
        </div>
      )}
    </div>
  )
}
