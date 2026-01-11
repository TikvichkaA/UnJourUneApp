import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import RecapPanel from './RecapPanel'
import ActionTooltip from './ActionTooltip'
import { IndicatorHelpButton } from './IndicatorHelp'
import BudgetPanel from './BudgetPanel'
import HiddenStatsPanel from './HiddenStatsPanel'
import DecisionHistory from './DecisionHistory'
import './ControlPanel.css'

// Ordre d'affichage des categories par orientation
const CATEGORY_ORDER = [
  // Gauche
  'social', 'logement', 'ecologie', 'transports', 'fiscalite_gauche', 'services', 'culture',
  // Droite
  'securite', 'attractivite', 'fiscalite_droite', 'gestion',
  // Extreme droite
  'identite', 'ordre', 'localisme',
  // Autre
  'autre'
]

export default function ControlPanel() {
  const [showRecap, setShowRecap] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState(null)

  const {
    turn,
    maxTurns,
    economie,
    environnement,
    cohesion,
    energie,
    population,
    budget,
    narrative,
    actions,
    executeAction,
    isActionAvailable,
    usedActions,
    gameOver,
    getScore,
    getVerdict,
    reset,
    season,
    seasonTurn,
    seasons,
    categories,
    indicatorDeltas,
    clearDeltas
  } = useGameStore()

  // Clear deltas after animation
  useEffect(() => {
    const hasDeltas = Object.values(indicatorDeltas || {}).some(d => d !== 0)
    if (hasDeltas) {
      const timer = setTimeout(() => clearDeltas(), 1500)
      return () => clearTimeout(timer)
    }
  }, [indicatorDeltas, clearDeltas])

  const currentSeason = seasons[season]

  const indicators = [
    { key: 'economie', value: economie, icon: '📊', name: 'Eco' },
    { key: 'environnement', value: environnement, icon: '🌿', name: 'Env' },
    { key: 'cohesion', value: cohesion, icon: '🤝', name: 'Social' },
    { key: 'energie', value: energie, icon: '⚡', name: 'Energie' }
  ]

  const getIndicatorClass = (value) => {
    if (value <= 20) return 'danger'
    if (value <= 35) return 'warning'
    if (value >= 70) return 'good'
    return ''
  }

  // Group actions by orientation then category
  const actionsByOrientation = {}
  CATEGORY_ORDER.forEach(cat => {
    const catActions = actions.filter(a => a.category === cat)
    if (catActions.length > 0) {
      const orientation = categories[cat]?.orientation || 'neutre'
      if (!actionsByOrientation[orientation]) {
        actionsByOrientation[orientation] = {}
      }
      actionsByOrientation[orientation][cat] = catActions
    }
  })

  const orientationLabels = {
    gauche: { label: 'Gauche / NFP', color: '#E63946' },
    droite: { label: 'Droite / LR', color: '#1E3A5F' },
    extreme_droite: { label: 'Extreme droite / RN', color: '#4A2C2A' },
    centre: { label: 'Centre', color: '#F0A500' },
    neutre: { label: 'Autre', color: '#6c757d' }
  }

  // Calculate total population
  const totalPop = population.poor + population.middle + population.rich

  if (gameOver) {
    const verdict = getVerdict()
    const score = getScore()

    return (
      <div className="control-panel">
        {showRecap && <RecapPanel onClose={() => setShowRecap(false)} />}
        <div className="game-over">
          <h2>{verdict.title}</h2>
          <p className="verdict-desc">{verdict.desc}</p>

          <div className="final-stats">
            <div className="final-stat">
              <span className="final-stat-label">Population totale</span>
              <span className="final-stat-value">{totalPop.toLocaleString()}</span>
            </div>
            <div className="final-population-breakdown">
              <div className="pop-class poor">
                <span className="pop-icon">👷</span>
                <span>{population.poor}</span>
              </div>
              <div className="pop-class middle">
                <span className="pop-icon">👨‍💼</span>
                <span>{population.middle}</span>
              </div>
              <div className="pop-class rich">
                <span className="pop-icon">🎩</span>
                <span>{population.rich}</span>
              </div>
            </div>
            <div className="final-stat score">
              <span className="final-stat-label">Score</span>
              <span className="final-stat-value">{score}/100</span>
            </div>
          </div>

          <div className="game-over-buttons">
            <button className="recap-btn" onClick={() => setShowRecap(true)}>
              Voir le bilan detaille
            </button>
            <button className="restart-btn" onClick={reset}>
              Rejouer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="control-panel">
      <header className="panel-header">
        <h1>Micro-Cite</h1>
        <div className="header-info">
          <span className="turn-info">Tour {turn}/{maxTurns}</span>
          {currentSeason && (
            <span className="season-info">
              {currentSeason.icon} {currentSeason.name}
            </span>
          )}
        </div>
      </header>

      <div className="indicators">
        {indicators.map(ind => {
          const delta = indicatorDeltas?.[ind.key] || 0
          const hasChange = delta !== 0
          return (
            <div
              key={ind.key}
              className={`indicator ${getIndicatorClass(ind.value)} ${hasChange ? (delta > 0 ? 'pulse-positive' : 'pulse-negative') : ''}`}
            >
              <IndicatorHelpButton indicatorKey={ind.key} />
              <span className="indicator-icon">{ind.icon}</span>
              <span className="indicator-value">{Math.round(ind.value)}</span>
              {hasChange && (
                <span className={`indicator-delta ${delta > 0 ? 'positive' : 'negative'}`}>
                  {delta > 0 ? '+' : ''}{delta}
                </span>
              )}
              <span className="indicator-name">{ind.name}</span>
            </div>
          )
        })}
      </div>

      <BudgetPanel />
      <HiddenStatsPanel />
      <DecisionHistory />

      <div className="population-section">
        <div className="population-total">
          <span className="pop-label">Population</span>
          <span className="pop-value">{totalPop.toLocaleString()}</span>
        </div>
        <div className="population-breakdown">
          <div className="pop-class poor" title="Classes populaires">
            <span className="pop-icon">👷</span>
            <span className="pop-count">{population.poor}</span>
          </div>
          <div className="pop-class middle" title="Classes moyennes">
            <span className="pop-icon">👨‍💼</span>
            <span className="pop-count">{population.middle}</span>
          </div>
          <div className="pop-class rich" title="Classes aisees">
            <span className="pop-icon">🎩</span>
            <span className="pop-count">{population.rich}</span>
          </div>
        </div>
      </div>

      <div className="narrative">
        <p className="narrative-main">{narrative.main}</p>
        <p className={`narrative-hint ${narrative.hintType}`}>{narrative.hint}</p>
      </div>

      <div className="actions-section">
        {Object.entries(actionsByOrientation).map(([orientation, catGroups]) => (
          <div key={orientation} className="orientation-group">
            <h2
              className="orientation-title"
              style={{
                borderColor: orientationLabels[orientation]?.color,
                color: orientationLabels[orientation]?.color
              }}
            >
              {orientationLabels[orientation]?.label}
            </h2>
            {Object.entries(catGroups).map(([category, catActions]) => {
              const isExpanded = expandedCategory === category
              const availableCount = catActions.filter(a => {
                const avail = isActionAvailable ? isActionAvailable(a.id) : { available: true }
                return avail.available
              }).length

              return (
                <div key={category} className={`action-category ${isExpanded ? 'expanded' : ''}`}>
                  <h3
                    className="category-title"
                    style={{
                      borderColor: categories[category]?.color,
                      color: categories[category]?.color
                    }}
                    onClick={() => setExpandedCategory(isExpanded ? null : category)}
                  >
                    <span className="category-toggle">{isExpanded ? '▼' : '▶'}</span>
                    {categories[category]?.icon} {categories[category]?.name}
                    <span className="category-count">
                      {availableCount > 0 && <span className="available-badge">{availableCount}</span>}
                    </span>
                  </h3>
                  {isExpanded && (
                    <div className="actions">
                      {catActions.map(action => {
                        const availability = isActionAvailable ? isActionAvailable(action.id) : { available: true }
                        const timesUsed = (usedActions && usedActions[action.id]) || 0
                        const isLocked = availability.locked
                        const isExhausted = !availability.available && !isLocked && timesUsed > 0
                        const isExcluded = !availability.available && availability.reason?.includes('Incompatible')

                        return (
                          <ActionTooltip key={action.id} action={action} categories={categories}>
                            <button
                              className={`action-btn ${isLocked ? 'locked' : ''} ${isExhausted ? 'exhausted' : ''} ${isExcluded ? 'excluded' : ''}`}
                              disabled={!availability.available}
                              onClick={() => executeAction(action.id)}
                              style={{ '--cat-color': categories[category]?.color }}
                            >
                              <span className="action-name">
                                {isLocked && <span className="lock-icon">🔒</span>}
                                {isExcluded && <span className="lock-icon">⛔</span>}
                                {action.name}
                              </span>
                              <span className="action-cost">
                                {action.cost > 0 ? `${action.cost} pts` : action.budgetGain ? `+${action.budgetGain}` : '—'}
                                {action.repeatable && timesUsed > 0 && (
                                  <span className="usage-count"> ({timesUsed}/{action.repeatable})</span>
                                )}
                                {action.oneShot && timesUsed > 0 && <span className="usage-count"> ✓</span>}
                              </span>
                              {isLocked && <span className="action-requires">{availability.reason}</span>}
                            </button>
                          </ActionTooltip>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
