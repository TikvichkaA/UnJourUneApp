import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import './DecisionHistory.css'

const EFFECT_ICONS = {
  economie: '📊',
  environnement: '🌿',
  cohesion: '🤝',
  energie: '⚡'
}

const ORIENTATION_COLORS = {
  gauche: '#E63946',
  droite: '#1E3A5F',
  extreme_droite: '#4A2C2A',
  centre: '#F0A500',
  neutre: '#6c757d'
}

export default function DecisionHistory() {
  const [expanded, setExpanded] = useState(false)
  const { actionHistory, turn } = useGameStore()

  if (actionHistory.length === 0) {
    return null
  }

  // Grouper par tour
  const historyByTurn = actionHistory.reduce((acc, action) => {
    const t = action.turn || 1
    if (!acc[t]) acc[t] = []
    acc[t].push(action)
    return acc
  }, {})

  // Calculer le bilan politique
  const politicalBalance = actionHistory.reduce((acc, a) => {
    acc[a.orientation] = (acc[a.orientation] || 0) + 1
    return acc
  }, {})

  const totalActions = actionHistory.length
  const dominantOrientation = Object.entries(politicalBalance)
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  return (
    <div className="decision-history">
      <div className="history-header" onClick={() => setExpanded(!expanded)}>
        <span className="history-icon">📜</span>
        <span className="history-title">Historique ({actionHistory.length})</span>
        <div className="history-summary">
          {Object.entries(politicalBalance).map(([orient, count]) => (
            <span
              key={orient}
              className="summary-dot"
              style={{ backgroundColor: ORIENTATION_COLORS[orient] }}
              title={`${orient}: ${count}`}
            />
          ))}
        </div>
        <span className="history-toggle">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="history-content">
          <div className="history-timeline">
            {Object.entries(historyByTurn)
              .sort((a, b) => Number(b[0]) - Number(a[0]))
              .map(([turnNum, actions]) => (
                <div key={turnNum} className="timeline-turn">
                  <div className="turn-marker">
                    <span className="turn-number">T{turnNum}</span>
                  </div>
                  <div className="turn-actions">
                    {actions.map((action, idx) => (
                      <div
                        key={idx}
                        className="history-action"
                        style={{ borderLeftColor: ORIENTATION_COLORS[action.orientation] }}
                      >
                        <div className="action-header">
                          <span className="action-name">{action.name}</span>
                          {action.cost > 0 && (
                            <span className="action-cost">-{action.cost}</span>
                          )}
                        </div>
                        {action.effects && Object.keys(action.effects).length > 0 && (
                          <div className="action-effects">
                            {Object.entries(action.effects).map(([key, val]) => (
                              <span
                                key={key}
                                className={`effect ${val > 0 ? 'positive' : 'negative'}`}
                              >
                                {EFFECT_ICONS[key]} {val > 0 ? '+' : ''}{val}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          <div className="history-stats">
            <div className="stat-item">
              <span className="stat-label">Actions totales</span>
              <span className="stat-value">{totalActions}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Orientation dominante</span>
              <span
                className="stat-value orientation"
                style={{ color: ORIENTATION_COLORS[dominantOrientation] }}
              >
                {dominantOrientation === 'gauche' ? 'Gauche' :
                 dominantOrientation === 'droite' ? 'Droite' :
                 dominantOrientation === 'extreme_droite' ? 'Ext. Droite' :
                 dominantOrientation === 'centre' ? 'Centre' : 'Neutre'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
