import { useState, useRef, useEffect } from 'react'
import './ActionTooltip.css'

const EFFECT_LABELS = {
  economie: { name: 'Economie', icon: '📊' },
  environnement: { name: 'Environnement', icon: '🌿' },
  cohesion: { name: 'Cohesion', icon: '🤝' },
  energie: { name: 'Energie', icon: '⚡' }
}

const HIDDEN_LABELS = {
  tension: { name: 'Tensions', icon: '😤', inverted: true },
  pollution: { name: 'Pollution', icon: '🏭', inverted: true },
  health: { name: 'Sante', icon: '💊' },
  education: { name: 'Education', icon: '📚' },
  greenInvest: { name: 'Invest. vert', icon: '🌱' },
  housingCapacity: { name: 'Logements', icon: '🏠' },
  culture: { name: 'Culture', icon: '🎭' },
  mobility: { name: 'Mobilite', icon: '🚇' },
  security: { name: 'Securite', icon: '🛡️' },
  liberty: { name: 'Libertes', icon: '🕊️' },
  debt: { name: 'Dette', icon: '💸', inverted: true },
  infrastructureDebt: { name: 'Dette infra.', icon: '🔧', inverted: true }
}

export default function ActionTooltip({ action, children, categories }) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
      let top = triggerRect.top - tooltipRect.height - 8

      // Ajuster si depasse a gauche
      if (left < 10) left = 10
      // Ajuster si depasse a droite
      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10
      }
      // Si depasse en haut, afficher en bas
      if (top < 10) {
        top = triggerRect.bottom + 8
      }

      setPosition({ top, left })
    }
  }, [visible])

  const hasEffects = action.effects && Object.keys(action.effects).length > 0
  const hasHidden = action.hidden && Object.keys(action.hidden).length > 0
  const hasDelayed = action.delayed && action.delayed.length > 0

  const formatEffect = (value, inverted = false) => {
    const isPositive = inverted ? value < 0 : value > 0
    const sign = value > 0 ? '+' : ''
    return { text: `${sign}${value}`, positive: isPositive }
  }

  return (
    <div
      className="tooltip-wrapper"
      ref={triggerRef}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div
          className="action-tooltip"
          ref={tooltipRef}
          style={{ top: position.top, left: position.left }}
        >
          <div className="tooltip-header">
            <span className="tooltip-cat-icon">{categories[action.category]?.icon}</span>
            <span className="tooltip-name">{action.name}</span>
            {action.cost > 0 && (
              <span className="tooltip-cost">{action.cost} pts</span>
            )}
          </div>

          {action.recurringCost && (
            <div className="tooltip-recurring">
              <span className="recurring-icon">🔄</span>
              <span>Cout recurrent: -{action.recurringCost} pts/tour</span>
            </div>
          )}

          {action.desc && (
            <p className="tooltip-desc">{action.desc}</p>
          )}

          {hasEffects && (
            <div className="tooltip-section">
              <span className="tooltip-section-title">Effets directs</span>
              <div className="tooltip-effects">
                {Object.entries(action.effects).map(([key, value]) => {
                  const label = EFFECT_LABELS[key]
                  if (!label) return null
                  const formatted = formatEffect(value)
                  return (
                    <span
                      key={key}
                      className={`tooltip-effect ${formatted.positive ? 'positive' : 'negative'}`}
                    >
                      {label.icon} {formatted.text}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {hasHidden && (
            <div className="tooltip-section">
              <span className="tooltip-section-title">Effets indirects</span>
              <div className="tooltip-effects">
                {Object.entries(action.hidden).map(([key, value]) => {
                  const label = HIDDEN_LABELS[key]
                  if (!label) return null
                  const formatted = formatEffect(value, label.inverted)
                  return (
                    <span
                      key={key}
                      className={`tooltip-effect ${formatted.positive ? 'positive' : 'negative'}`}
                      title={label.name}
                    >
                      {label.icon} {formatted.text}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {hasDelayed && (
            <div className="tooltip-section delayed">
              <span className="tooltip-section-title">Effets differes</span>
              {action.delayed.map((d, i) => (
                <div key={i} className="tooltip-delayed">
                  <span className="delayed-turns">Tour +{d.turns}</span>
                  <span className="delayed-reason">{d.reason}</span>
                </div>
              ))}
            </div>
          )}

          {action.realWorld && (
            <div className="tooltip-realworld">
              <span className="realworld-label">Dans la realite :</span>
              <span className="realworld-text">{action.realWorld}</span>
            </div>
          )}

          {(action.requires || action.excludes || action.unlocks) && (
            <div className="tooltip-branching">
              {action.requires && (
                <span className="branching-item requires">
                  Necessite: {action.requires.join(', ')}
                </span>
              )}
              {action.unlocks && (
                <span className="branching-item unlocks">
                  Debloque: {action.unlocks.join(', ')}
                </span>
              )}
              {action.excludes && (
                <span className="branching-item excludes">
                  Exclut: {action.excludes.join(', ')}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
