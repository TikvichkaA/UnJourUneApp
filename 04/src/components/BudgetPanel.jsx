import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import './BudgetPanel.css'

export default function BudgetPanel() {
  const [expanded, setExpanded] = useState(false)

  const {
    budget,
    population,
    economie,
    hidden,
    actionHistory,
    turn,
    recurringCosts
  } = useGameStore()

  // Calculer les recettes
  const taxBase = population.poor * 0.02 + population.middle * 0.05 + population.rich * 0.12
  const recettesBase = Math.round(15 + economie * 0.4 + taxBase)
  const penaliteDette = Math.round((hidden.debt || 0) * 0.15)

  // Utiliser les couts recurrents du store
  const depensesRecurrentes = recurringCosts || 0

  // Projection budget prochain tour
  const projectionBudget = recettesBase - penaliteDette - depensesRecurrentes

  // Calculer le total depense
  const totalDepense = actionHistory.reduce((sum, a) => sum + (a.cost || 0), 0)

  // Repartition des depenses par orientation
  const depensesParOrientation = actionHistory.reduce((acc, a) => {
    acc[a.orientation] = (acc[a.orientation] || 0) + (a.cost || 0)
    return acc
  }, {})

  const orientationColors = {
    gauche: '#E63946',
    droite: '#1E3A5F',
    extreme_droite: '#4A2C2A',
    centre: '#F0A500',
    neutre: '#6c757d'
  }

  return (
    <div className="budget-panel">
      <div className="budget-main" onClick={() => setExpanded(!expanded)}>
        <div className="budget-current">
          <span className="budget-label">Budget disponible</span>
          <span className={`budget-amount ${budget < 10 ? 'danger' : budget < 25 ? 'warning' : ''}`}>
            {budget} pts
          </span>
        </div>
        <div className="budget-toggle">{expanded ? '▲' : '▼'}</div>
      </div>

      {expanded && (
        <div className="budget-details">
          <div className="budget-section">
            <h4>Recettes estimees / tour</h4>
            <div className="budget-line">
              <span>Fiscalite locale (taxe fonciere, CFE...)</span>
              <span className="positive">+{recettesBase} pts</span>
            </div>
            {penaliteDette > 0 && (
              <div className="budget-line">
                <span>Remboursement dette</span>
                <span className="negative">-{penaliteDette} pts</span>
              </div>
            )}
            {depensesRecurrentes > 0 && (
              <div className="budget-line">
                <span>Fonctionnement services</span>
                <span className="negative">-{depensesRecurrentes} pts</span>
              </div>
            )}
            <div className="budget-line total">
              <span>Projection tour suivant</span>
              <span className={projectionBudget >= 0 ? 'positive' : 'negative'}>
                {projectionBudget >= 0 ? '+' : ''}{projectionBudget} pts
              </span>
            </div>
          </div>

          <div className="budget-section">
            <h4>Bilan depuis le debut</h4>
            <div className="budget-line">
              <span>Total investi</span>
              <span>{totalDepense} pts</span>
            </div>
            <div className="budget-line">
              <span>Nombre d'actions</span>
              <span>{actionHistory.length}</span>
            </div>
          </div>

          {Object.keys(depensesParOrientation).length > 0 && (
            <div className="budget-section">
              <h4>Repartition des depenses</h4>
              <div className="budget-repartition">
                {Object.entries(depensesParOrientation).map(([orient, amount]) => {
                  const pct = totalDepense > 0 ? (amount / totalDepense * 100) : 0
                  return (
                    <div key={orient} className="repartition-bar">
                      <div className="bar-label">
                        <span>{orient === 'gauche' ? 'Social/Ecolo' : orient === 'droite' ? 'Securite/Eco' : orient === 'extreme_droite' ? 'Ordre/Identite' : orient}</span>
                        <span>{Math.round(pct)}%</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: orientationColors[orient]
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="budget-warning">
            <span className="warning-icon">💡</span>
            <span>Les recettes dependent de la population et de l'economie. Plus la ville est prospere, plus elle genere de ressources.</span>
          </div>
        </div>
      )}
    </div>
  )
}
