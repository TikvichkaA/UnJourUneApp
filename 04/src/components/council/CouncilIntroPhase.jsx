import { useGameStore } from '../../store/gameStore'

export default function CouncilIntroPhase() {
  const councilMeeting = useGameStore(state => state.councilMeeting)
  const advanceCouncilPhase = useGameStore(state => state.advanceCouncilPhase)
  const cancelCouncilMeeting = useGameStore(state => state.cancelCouncilMeeting)
  const categories = useGameStore(state => state.categories)

  const { proposal } = councilMeeting
  const action = proposal?.action
  const category = categories?.[action?.category]

  if (!action) return null

  const favorableCount = councilMeeting.councilors?.filter(c => c.currentSupport >= 50).length || 0
  const opposedCount = councilMeeting.councilors?.filter(c => c.currentSupport < 50).length || 0

  return (
    <div className="phase-content">
      <div className="intro-header">
        <h3>Proposition soumise au vote</h3>
        <p className="intro-subtitle">
          Vous souhaitez faire adopter la mesure suivante par le conseil municipal.
        </p>
      </div>

      <div className="proposal-card">
        <div className="proposal-header">
          <span
            className="proposal-category"
            style={{ borderLeft: `3px solid ${category?.color || '#6e7681'}` }}
          >
            {category?.icon} {category?.name}
          </span>
          <span className="proposal-cost">
            -{action.cost} pts
          </span>
        </div>

        <h4 className="proposal-title">{action.name}</h4>
        <p className="proposal-desc">{action.desc}</p>

        {action.realWorld && (
          <p className="proposal-realworld">
            {action.realWorld}
          </p>
        )}

        {/* Effects preview */}
        {action.effects && Object.keys(action.effects).length > 0 && (
          <div className="proposal-effects">
            <span className="effects-label">Effets immediats :</span>
            <div className="effects-list">
              {Object.entries(action.effects).map(([key, value]) => (
                <span key={key} className={value > 0 ? 'positive' : 'negative'}>
                  {value > 0 ? '+' : ''}{value} {key}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="council-preview">
        <h4>Etat du conseil</h4>
        <div className="preview-stats">
          <div className="stat-item favorable">
            <span className="stat-value">{favorableCount}</span>
            <span className="stat-label">Favorables</span>
          </div>
          <div className="stat-item indecis">
            <span className="stat-value">{councilMeeting.councilors?.filter(c => c.currentSupport >= 40 && c.currentSupport < 60).length || 0}</span>
            <span className="stat-label">Indecis</span>
          </div>
          <div className="stat-item opposed">
            <span className="stat-value">{opposedCount}</span>
            <span className="stat-label">Opposes</span>
          </div>
        </div>

        <div className="prognosis">
          {favorableCount >= 6 ? (
            <span className="prognosis-text favorable">
              Pronostic : La mesure devrait passer
            </span>
          ) : favorableCount >= 4 ? (
            <span className="prognosis-text uncertain">
              Pronostic : Resultat incertain, le debat sera decisif
            </span>
          ) : (
            <span className="prognosis-text opposed">
              Pronostic : Opposition forte, preparez vos arguments
            </span>
          )}
        </div>
      </div>

      <div className="council-actions">
        <button className="council-btn" onClick={cancelCouncilMeeting}>
          Retirer la proposition
        </button>
        <button className="council-btn primary" onClick={() => advanceCouncilPhase('debate')}>
          Ouvrir le debat
        </button>
      </div>

      <style>{`
        .intro-header {
          margin-bottom: 1.25rem;
        }

        .intro-header h3 {
          font-size: 1rem;
          font-weight: 500;
          color: #e6edf3;
          margin: 0 0 0.3rem 0;
        }

        .intro-subtitle {
          font-size: 0.8rem;
          color: #8b949e;
          margin: 0;
        }

        .proposal-effects {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #30363d;
        }

        .effects-label {
          font-size: 0.72rem;
          color: #6e7681;
          display: block;
          margin-bottom: 0.4rem;
        }

        .effects-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .effects-list span {
          font-size: 0.72rem;
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
          background: #0d1117;
        }

        .effects-list .positive { color: #3fb950; }
        .effects-list .negative { color: #f85149; }

        .council-preview {
          background: #0d1117;
          border: 1px solid #21262d;
          border-radius: 8px;
          padding: 1rem;
        }

        .council-preview h4 {
          font-size: 0.85rem;
          font-weight: 500;
          color: #c9d1d9;
          margin: 0 0 0.75rem 0;
        }

        .preview-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .stat-item {
          flex: 1;
          text-align: center;
          padding: 0.5rem;
          border-radius: 6px;
          background: #161b22;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .stat-item.favorable .stat-value { color: #3fb950; }
        .stat-item.indecis .stat-value { color: #d29922; }
        .stat-item.opposed .stat-value { color: #f85149; }

        .stat-label {
          font-size: 0.7rem;
          color: #6e7681;
        }

        .prognosis {
          text-align: center;
          padding-top: 0.5rem;
          border-top: 1px solid #21262d;
        }

        .prognosis-text {
          font-size: 0.8rem;
          font-style: italic;
        }

        .prognosis-text.favorable { color: #3fb950; }
        .prognosis-text.uncertain { color: #d29922; }
        .prognosis-text.opposed { color: #f85149; }
      `}</style>
    </div>
  )
}
