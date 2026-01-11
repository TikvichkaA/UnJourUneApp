import { useGameStore } from '../../store/gameStore'
import CouncilIntroPhase from './CouncilIntroPhase'
import CouncilDebatePhase from './CouncilDebatePhase'
import CouncilVotingPhase from './CouncilVotingPhase'
import CouncilResultPhase from './CouncilResultPhase'
import './CouncilMeetingModal.css'

export default function CouncilMeetingModal() {
  const councilMeeting = useGameStore(state => state.councilMeeting)

  if (!councilMeeting?.isActive) return null

  const renderPhase = () => {
    switch (councilMeeting.phase) {
      case 'intro':
        return <CouncilIntroPhase />
      case 'debate':
        return <CouncilDebatePhase />
      case 'voting':
        return <CouncilVotingPhase />
      case 'result':
        return <CouncilResultPhase />
      default:
        return <CouncilIntroPhase />
    }
  }

  const phases = ['intro', 'debate', 'voting', 'result']
  const currentPhaseIndex = phases.indexOf(councilMeeting.phase)

  return (
    <div className="council-overlay">
      <div className="council-modal">
        <header className="council-header">
          <div className="council-title">
            <span className="council-icon">🏛️</span>
            <h2>Conseil Municipal</h2>
          </div>
          <div className="council-progress">
            {phases.map((phase, idx) => (
              <div
                key={phase}
                className={`progress-dot ${idx <= currentPhaseIndex ? 'active' : ''} ${idx === currentPhaseIndex ? 'current' : ''}`}
              >
                <span className="dot"></span>
                <span className="phase-label">
                  {phase === 'intro' && 'Proposition'}
                  {phase === 'debate' && 'Debat'}
                  {phase === 'voting' && 'Vote'}
                  {phase === 'result' && 'Resultat'}
                </span>
              </div>
            ))}
          </div>
        </header>

        <div className="council-body">
          <div className="council-main">
            {renderPhase()}
          </div>

          <div className="council-sidebar">
            <h3>Conseillers</h3>
            <div className="councilors-list">
              {councilMeeting.councilors?.map(councilor => (
                <div
                  key={councilor.id}
                  className={`councilor-mini ${councilor.alignment}`}
                >
                  <span className="councilor-emoji">{councilor.emoji}</span>
                  <div className="councilor-info">
                    <span className="councilor-name">{councilor.name.split(' ')[0]}</span>
                    <div className="councilor-support-bar">
                      <div
                        className="support-fill"
                        style={{ width: `${councilor.currentSupport}%` }}
                      />
                    </div>
                  </div>
                  <span className={`support-indicator ${councilor.currentSupport >= 50 ? 'favorable' : 'opposed'}`}>
                    {councilor.currentSupport >= 60 ? '✓' : councilor.currentSupport >= 40 ? '~' : '✗'}
                  </span>
                </div>
              ))}
            </div>
            <div className="council-summary">
              <div className="vote-preview">
                <span className="vote-count favorable">
                  {councilMeeting.councilors?.filter(c => c.currentSupport >= 50).length || 0} pour
                </span>
                <span className="vote-count opposed">
                  {councilMeeting.councilors?.filter(c => c.currentSupport < 50).length || 0} contre
                </span>
              </div>
              <div className="majority-indicator">
                Majorite: 6 voix
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
