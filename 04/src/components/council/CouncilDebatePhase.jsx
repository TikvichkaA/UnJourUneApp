import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { PLAYER_ARGUMENTS } from '../../data/arguments'

export default function CouncilDebatePhase() {
  const councilMeeting = useGameStore(state => state.councilMeeting)
  const advanceCouncilPhase = useGameStore(state => state.advanceCouncilPhase)
  const presentPlayerArgument = useGameStore(state => state.presentPlayerArgument)

  const [selectedPlayerArg, setSelectedPlayerArg] = useState(null)

  // Utiliser directement les arguments sans animation pour l'instant
  const arguments_ = councilMeeting?.selectedArguments || []
  const actionId = councilMeeting?.proposal?.actionId
  const playerArgs = PLAYER_ARGUMENTS[actionId] || []
  const hasUsedPlayerArg = councilMeeting?.playerArgumentUsed
  const playerArgPresented = councilMeeting?.playerArgumentPresented

  const getSpeakerForArgument = (arg, idx) => {
    // Find a councilor matching the argument's alignment
    const alignment = arg.alignment || 'centre'
    const matchingCouncilors = councilMeeting?.councilors?.filter(c => c.alignment === alignment) || []
    if (matchingCouncilors.length > 0) {
      // Pick based on argument index for variety
      return matchingCouncilors[idx % matchingCouncilors.length]
    }
    // Fallback to first councilor
    return councilMeeting?.councilors?.[0]
  }

  const getAlignmentLabel = (alignment) => {
    switch (alignment) {
      case 'gauche': return 'Gauche'
      case 'droite': return 'Droite'
      case 'extreme_droite': return 'RN'
      case 'centre': return 'Centre'
      default: return alignment
    }
  }

  return (
    <div className="phase-content">
      <div className="debate-header">
        <h3>Debat en cours</h3>
        <p className="debate-subtitle">
          Les conseillers expriment leurs positions sur la mesure.
        </p>
      </div>

      <div className="arguments-container">
        {arguments_.map((arg, idx) => {
          const speaker = getSpeakerForArgument(arg, idx)
          return (
            <div
              key={arg.id || idx}
              className={`argument-bubble ${arg.type}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {arg.strength && (
                <span className={`strength-badge ${arg.strength}`}>
                  {arg.strength === 'critical' ? 'Decisif' :
                   arg.strength === 'strong' ? 'Fort' :
                   arg.strength === 'medium' ? 'Moyen' : 'Faible'}
                </span>
              )}

              <div className="argument-speaker">
                <span className="speaker-emoji">{speaker?.emoji || '👤'}</span>
                <span className="speaker-name">{speaker?.name || 'Conseiller'}</span>
                <span className={`speaker-alignment ${arg.alignment}`}>
                  {getAlignmentLabel(arg.alignment)}
                </span>
              </div>

              <p className="argument-text">"{arg.text}"</p>

              {arg.source && (
                <div className="argument-source">
                  Source: {arg.source}
                </div>
              )}
            </div>
          )
        })}

        {arguments_.length === 0 && (
          <div className="debate-empty">
            <p>Aucun argument disponible.</p>
          </div>
        )}
      </div>

      {/* Section argument du joueur */}
      <div className="player-argument-section">
        <h4>Votre intervention</h4>
        {!hasUsedPlayerArg ? (
          <>
            <p className="player-instruction">Choisissez un argument pour defendre votre mesure :</p>
            <div className="player-args-list">
              {playerArgs.map((arg) => (
                <div
                  key={arg.id}
                  className={`player-arg-option ${selectedPlayerArg?.id === arg.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPlayerArg(arg)}
                >
                  <span className={`arg-strength ${arg.strength}`}>
                    {arg.strength === 'strong' ? '★★' : '★'}
                  </span>
                  <p>"{arg.text}"</p>
                  <div className="arg-effects">
                    {Object.entries(arg.effect).map(([align, val]) => (
                      <span key={align} className={`effect ${val >= 0 ? 'positive' : 'negative'}`}>
                        {align}: {val > 0 ? '+' : ''}{val}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {selectedPlayerArg && (
              <button
                className="council-btn primary"
                onClick={() => {
                  presentPlayerArgument(selectedPlayerArg)
                  setSelectedPlayerArg(null)
                }}
              >
                Presenter cet argument
              </button>
            )}
          </>
        ) : (
          <div className="player-arg-presented">
            <span className="presented-label">Vous avez declare :</span>
            <p>"{playerArgPresented?.text}"</p>
          </div>
        )}
      </div>

      {arguments_.length > 0 && (
        <div className="debate-conclusion">
          <p className="conclusion-text">
            Les arguments ont ete entendus. Il est temps de passer au vote.
          </p>
        </div>
      )}

      <div className="council-actions">
        <button
          className="council-btn primary"
          onClick={() => advanceCouncilPhase('voting')}
        >
          Passer au vote
        </button>
      </div>

      <style>{`
        .debate-header {
          margin-bottom: 1rem;
        }

        .debate-header h3 {
          font-size: 1rem;
          font-weight: 500;
          color: #e6edf3;
          margin: 0 0 0.3rem 0;
        }

        .debate-subtitle {
          font-size: 0.8rem;
          color: #8b949e;
          margin: 0;
        }

        .arguments-container {
          max-height: 350px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .argument-bubble {
          animation: slideInArg 0.4s ease forwards;
        }

        @keyframes slideInArg {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .debate-empty {
          text-align: center;
          padding: 2rem;
          color: #6e7681;
        }

        .debate-conclusion {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          margin-top: 1rem;
        }

        .conclusion-text {
          font-size: 0.85rem;
          color: #c9d1d9;
          margin: 0;
        }

        /* Section argument du joueur */
        .player-argument-section {
          background: #1c2128;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .player-argument-section h4 {
          font-size: 0.9rem;
          font-weight: 500;
          color: #58a6ff;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .player-argument-section h4::before {
          content: '🎤';
        }

        .player-instruction {
          font-size: 0.8rem;
          color: #8b949e;
          margin: 0 0 0.75rem 0;
        }

        .player-args-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .player-arg-option {
          background: #21262d;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .player-arg-option:hover {
          border-color: #58a6ff;
          background: #252b33;
        }

        .player-arg-option.selected {
          border-color: #58a6ff;
          background: rgba(88, 166, 255, 0.1);
        }

        .player-arg-option p {
          font-size: 0.82rem;
          color: #e6edf3;
          margin: 0.3rem 0;
          line-height: 1.4;
        }

        .arg-strength {
          font-size: 0.7rem;
          color: #d29922;
        }

        .arg-strength.strong {
          color: #3fb950;
        }

        .arg-effects {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.4rem;
        }

        .arg-effects .effect {
          font-size: 0.65rem;
          padding: 0.15rem 0.35rem;
          border-radius: 3px;
          background: #21262d;
        }

        .arg-effects .effect.positive {
          color: #3fb950;
          background: rgba(63, 185, 80, 0.1);
        }

        .arg-effects .effect.negative {
          color: #f85149;
          background: rgba(248, 81, 73, 0.1);
        }

        .player-arg-presented {
          background: rgba(88, 166, 255, 0.1);
          border: 1px solid rgba(88, 166, 255, 0.3);
          border-radius: 6px;
          padding: 0.75rem;
        }

        .presented-label {
          font-size: 0.7rem;
          color: #58a6ff;
          text-transform: uppercase;
        }

        .player-arg-presented p {
          font-size: 0.85rem;
          color: #e6edf3;
          margin: 0.3rem 0 0 0;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}
