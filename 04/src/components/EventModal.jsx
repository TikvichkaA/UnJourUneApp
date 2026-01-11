import { useGameStore } from '../store/gameStore'
import './EventModal.css'

export default function EventModal() {
  const { currentEvent, dismissEvent, makeEventChoice, budget } = useGameStore()

  if (!currentEvent) return null

  const hasChoices = currentEvent.choices && currentEvent.choices.length > 0
  const eventType = currentEvent.type || 'crisis'

  // Determine card border color based on event type
  const getTypeClass = () => {
    switch(eventType) {
      case 'opportunity': return 'opportunity'
      case 'dilemma': return 'dilemma'
      case 'disaster': return 'disaster'
      case 'crisis':
      default: return 'crisis'
    }
  }

  return (
    <div className="event-overlay">
      <div className={`event-card ${getTypeClass()}`}>
        <div className="event-icon">{currentEvent.icon}</div>
        <h2 className="event-title">{currentEvent.title}</h2>
        <p className="event-desc">{currentEvent.desc}</p>

        {/* Effects preview for non-choice events */}
        {!hasChoices && currentEvent.effects && Object.keys(currentEvent.effects).length > 0 && (
          <div className="event-effects">
            {Object.entries(currentEvent.effects).map(([key, value]) => (
              <span key={key} className={value > 0 ? 'positive' : 'negative'}>
                {value > 0 ? '+' : ''}{value} {key}
              </span>
            ))}
          </div>
        )}

        {/* Choice buttons for dilemmas/events with choices */}
        {hasChoices ? (
          <div className="event-choices">
            {currentEvent.choices.map((choice, idx) => {
              const canAfford = !choice.cost || budget >= choice.cost
              return (
                <button
                  key={idx}
                  className={`choice-btn ${!canAfford ? 'disabled' : ''}`}
                  disabled={!canAfford}
                  onClick={() => makeEventChoice(idx)}
                >
                  <span className="choice-label">{choice.label}</span>
                  {choice.cost && (
                    <span className="choice-cost">-{choice.cost} pts</span>
                  )}
                  {choice.effects && (
                    <div className="choice-effects">
                      {Object.entries(choice.effects).map(([key, value]) => (
                        <span key={key} className={value > 0 ? 'positive' : 'negative'}>
                          {value > 0 ? '+' : ''}{value} {key}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        ) : (
          <button className="event-btn" onClick={dismissEvent}>
            Continuer
          </button>
        )}
      </div>
    </div>
  )
}
