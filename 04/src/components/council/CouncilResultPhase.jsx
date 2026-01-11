import { useGameStore } from '../../store/gameStore'

export default function CouncilResultPhase() {
  const councilMeeting = useGameStore(state => state.councilMeeting)
  const finalizeCouncilMeeting = useGameStore(state => state.finalizeCouncilMeeting)

  const { result, proposal, votes } = councilMeeting
  const action = proposal?.action

  if (!result) return null

  const pourList = councilMeeting.councilors?.filter(c => votes?.pour?.includes(c.id)) || []
  const contreList = councilMeeting.councilors?.filter(c => votes?.contre?.includes(c.id)) || []

  return (
    <div className="phase-content">
      <div className={`result-banner ${result.passed ? 'passed' : 'rejected'}`}>
        <div className="result-icon">
          {result.passed ? '✓' : '✗'}
        </div>
        <h3 className="result-title">
          {result.passed ? 'Mesure adoptee !' : 'Mesure rejetee'}
        </h3>
        <p className="result-subtitle">
          {result.passed
            ? `${action?.name} a ete adopte par le conseil municipal.`
            : `${action?.name} n'a pas obtenu la majorite requise.`}
        </p>

        <div className="vote-breakdown">
          <div className="breakdown-item">
            <span className="breakdown-count pour">{votes?.pour?.length || 0}</span>
            <span className="breakdown-label">Pour</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-count contre">{votes?.contre?.length || 0}</span>
            <span className="breakdown-label">Contre</span>
          </div>
          {votes?.abstention?.length > 0 && (
            <div className="breakdown-item">
              <span className="breakdown-count abstention">{votes.abstention.length}</span>
              <span className="breakdown-label">Abstention</span>
            </div>
          )}
        </div>
      </div>

      <div className="vote-details">
        <div className="vote-column pour">
          <h4>Ont vote pour</h4>
          <div className="voters-list">
            {pourList.map(c => (
              <div key={c.id} className="voter-item">
                <span className="voter-emoji">{c.emoji}</span>
                <span className="voter-name">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="vote-column contre">
          <h4>Ont vote contre</h4>
          <div className="voters-list">
            {contreList.map(c => (
              <div key={c.id} className="voter-item">
                <span className="voter-emoji">{c.emoji}</span>
                <span className="voter-name">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {result.passed && action?.effects && (
        <div className="result-effects">
          <h4>Effets de la mesure</h4>
          <div className="effects-grid">
            {Object.entries(action.effects).map(([key, value]) => (
              <div key={key} className={`effect-item ${value > 0 ? 'positive' : 'negative'}`}>
                <span className="effect-value">{value > 0 ? '+' : ''}{value}</span>
                <span className="effect-label">{key}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!result.passed && (
        <div className="rejection-message">
          <p>
            La mesure n'ayant pas ete adoptee, aucun effet ne sera applique.
            Vous pouvez retenter plus tard en construisant davantage de soutien politique.
          </p>
        </div>
      )}

      <div className="council-actions">
        <button className="council-btn primary" onClick={finalizeCouncilMeeting}>
          Continuer
        </button>
      </div>

      <style>{`
        .vote-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin: 1rem 0;
        }

        .vote-column {
          background: #0d1117;
          border-radius: 8px;
          padding: 0.75rem;
        }

        .vote-column h4 {
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          margin: 0 0 0.5rem 0;
        }

        .vote-column.pour h4 { color: #3fb950; }
        .vote-column.contre h4 { color: #f85149; }

        .voters-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .voter-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: #c9d1d9;
        }

        .voter-emoji {
          font-size: 1rem;
        }

        .result-effects {
          background: #21262d;
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem 0;
        }

        .result-effects h4 {
          font-size: 0.8rem;
          font-weight: 500;
          color: #8b949e;
          margin: 0 0 0.75rem 0;
        }

        .effects-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .effect-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          background: #0d1117;
        }

        .effect-value {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .effect-item.positive .effect-value { color: #3fb950; }
        .effect-item.negative .effect-value { color: #f85149; }

        .effect-label {
          font-size: 0.68rem;
          color: #6e7681;
          text-transform: capitalize;
        }

        .rejection-message {
          background: rgba(248, 81, 73, 0.1);
          border: 1px solid rgba(248, 81, 73, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem 0;
        }

        .rejection-message p {
          font-size: 0.85rem;
          color: #c9d1d9;
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  )
}
