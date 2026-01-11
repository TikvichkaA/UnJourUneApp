import { useState, useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'

export default function CouncilVotingPhase() {
  const councilMeeting = useGameStore(state => state.councilMeeting)
  const executeCouncilVote = useGameStore(state => state.executeCouncilVote)

  const [votingState, setVotingState] = useState('preparing') // 'preparing' | 'voting' | 'done'
  const [currentVoter, setCurrentVoter] = useState(-1)
  const [votes, setVotes] = useState({})

  const councilors = councilMeeting.councilors || []

  useEffect(() => {
    if (votingState === 'preparing') {
      const timer = setTimeout(() => {
        setVotingState('voting')
        setCurrentVoter(0)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [votingState])

  useEffect(() => {
    if (votingState === 'voting' && currentVoter >= 0 && currentVoter < councilors.length) {
      const timer = setTimeout(() => {
        const councilor = councilors[currentVoter]
        // Determine vote based on support
        let vote
        if (councilor.currentSupport >= 55) {
          vote = 'pour'
        } else if (councilor.currentSupport <= 45) {
          vote = 'contre'
        } else {
          // Undecided - random with slight bias towards support level
          vote = Math.random() * 100 < councilor.currentSupport ? 'pour' : 'contre'
        }

        setVotes(prev => ({ ...prev, [councilor.id]: vote }))

        if (currentVoter < councilors.length - 1) {
          setCurrentVoter(prev => prev + 1)
        } else {
          setVotingState('done')
        }
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [votingState, currentVoter, councilors])

  useEffect(() => {
    if (votingState === 'done') {
      const timer = setTimeout(() => {
        // Calculate final result and advance
        const pourCount = Object.values(votes).filter(v => v === 'pour').length
        const contreCount = Object.values(votes).filter(v => v === 'contre').length
        const passed = pourCount >= 6

        executeCouncilVote({
          pour: Object.entries(votes).filter(([, v]) => v === 'pour').map(([id]) => id),
          contre: Object.entries(votes).filter(([, v]) => v === 'contre').map(([id]) => id),
          abstention: [],
          passed,
          margin: pourCount - contreCount
        })
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [votingState, votes, executeCouncilVote])

  const pourCount = Object.values(votes).filter(v => v === 'pour').length
  const contreCount = Object.values(votes).filter(v => v === 'contre').length

  return (
    <div className="phase-content">
      <div className="voting-header">
        <h3>Vote en cours</h3>
        <p className="voting-subtitle">
          {votingState === 'preparing' && 'Les conseillers se preparent a voter...'}
          {votingState === 'voting' && 'Chaque conseiller exprime son vote.'}
          {votingState === 'done' && 'Le scrutin est termine.'}
        </p>
      </div>

      <div className="voting-grid">
        {councilors.map((councilor, idx) => {
          const vote = votes[councilor.id]
          const isVoting = votingState === 'voting' && currentVoter === idx
          const hasVoted = vote !== undefined

          return (
            <div
              key={councilor.id}
              className={`vote-card ${isVoting ? 'voting' : ''} ${vote || ''}`}
            >
              <span className="councilor-emoji">{councilor.emoji}</span>
              <span className="councilor-name">{councilor.name.split(' ')[0]}</span>
              {hasVoted && (
                <span className="vote-result">
                  {vote === 'pour' ? '✓' : vote === 'contre' ? '✗' : '○'}
                </span>
              )}
              {isVoting && !hasVoted && (
                <span className="vote-result voting-anim">?</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="vote-tally">
        <div className="tally-item pour">
          <span className="tally-count">{pourCount}</span>
          <span className="tally-label">Pour</span>
        </div>
        <div className="tally-divider">
          <span className="tally-total">{pourCount + contreCount} / {councilors.length}</span>
        </div>
        <div className="tally-item contre">
          <span className="tally-count">{contreCount}</span>
          <span className="tally-label">Contre</span>
        </div>
      </div>

      {votingState === 'done' && (
        <div className={`vote-outcome ${pourCount >= 6 ? 'passed' : 'rejected'}`}>
          {pourCount >= 6 ? (
            <span>La majorite est atteinte !</span>
          ) : (
            <span>La majorite n'est pas atteinte.</span>
          )}
        </div>
      )}

      <style>{`
        .voting-header {
          margin-bottom: 1.25rem;
          text-align: center;
        }

        .voting-header h3 {
          font-size: 1rem;
          font-weight: 500;
          color: #e6edf3;
          margin: 0 0 0.3rem 0;
        }

        .voting-subtitle {
          font-size: 0.8rem;
          color: #8b949e;
          margin: 0;
        }

        .vote-tally {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin: 1.5rem 0;
        }

        .tally-item {
          text-align: center;
        }

        .tally-count {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1;
        }

        .tally-item.pour .tally-count {
          color: #3fb950;
        }

        .tally-item.contre .tally-count {
          color: #f85149;
        }

        .tally-label {
          font-size: 0.75rem;
          color: #6e7681;
          text-transform: uppercase;
        }

        .tally-divider {
          color: #6e7681;
          font-size: 0.85rem;
        }

        .vote-card .vote-result {
          display: block;
          margin-top: 0.3rem;
        }

        .vote-card.pour .vote-result {
          color: #3fb950;
        }

        .vote-card.contre .vote-result {
          color: #f85149;
        }

        .voting-anim {
          animation: pulse 0.5s ease infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .vote-outcome {
          text-align: center;
          padding: 1rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          animation: fadeInUp 0.5s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .vote-outcome.passed {
          background: rgba(63, 185, 80, 0.15);
          border: 1px solid #3fb950;
          color: #3fb950;
        }

        .vote-outcome.rejected {
          background: rgba(248, 81, 73, 0.15);
          border: 1px solid #f85149;
          color: #f85149;
        }
      `}</style>
    </div>
  )
}
