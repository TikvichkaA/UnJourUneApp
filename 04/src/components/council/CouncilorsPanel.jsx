import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { COMMISSIONS } from '../../data/councilors'
import './CouncilorsPanel.css'

export default function CouncilorsPanel({ onClose }) {
  const councilors = useGameStore(state => state.councilors)
  const commissions = useGameStore(state => state.commissions)
  const getCommissionMembers = useGameStore(state => state.getCommissionMembers)
  const consultCouncilor = useGameStore(state => state.consultCouncilor)

  const [activeTab, setActiveTab] = useState('councilors') // 'councilors' | 'commissions'
  const [selectedCouncilor, setSelectedCouncilor] = useState(null)
  const [selectedCommission, setSelectedCommission] = useState(null)
  const [consultationResult, setConsultationResult] = useState(null)

  if (!councilors) return null

  const getAlignmentColor = (alignment) => {
    switch (alignment) {
      case 'gauche': return '#E63946'
      case 'droite': return '#1E3A5F'
      case 'extreme_droite': return '#4A2C2A'
      case 'centre': return '#F0A500'
      default: return '#6e7681'
    }
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

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'happy': return '😊'
      case 'angry': return '😠'
      case 'worried': return '😟'
      default: return '😐'
    }
  }

  const getRelationshipLevel = (relationship) => {
    if (relationship >= 80) return { label: 'Allié', color: '#3fb950' }
    if (relationship >= 60) return { label: 'Favorable', color: '#58a6ff' }
    if (relationship >= 40) return { label: 'Neutre', color: '#8b949e' }
    if (relationship >= 20) return { label: 'Méfiant', color: '#d29922' }
    return { label: 'Hostile', color: '#f85149' }
  }

  const handleConsult = (councilor, theme) => {
    const result = consultCouncilor(councilor.id, theme)
    setConsultationResult(result)
  }

  // Grouper les conseillers par alignement
  const councilorsByAlignment = councilors.reduce((acc, c) => {
    if (!acc[c.alignment]) acc[c.alignment] = []
    acc[c.alignment].push(c)
    return acc
  }, {})

  return (
    <div className="councilors-panel-overlay" onClick={onClose}>
      <div className="councilors-panel" onClick={e => e.stopPropagation()}>
        <header className="panel-header">
          <div className="panel-title">
            <span className="panel-icon">🏛️</span>
            <h2>Conseil Municipal</h2>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </header>

        <div className="panel-tabs">
          <button
            className={`tab ${activeTab === 'councilors' ? 'active' : ''}`}
            onClick={() => setActiveTab('councilors')}
          >
            Conseillers
          </button>
          <button
            className={`tab ${activeTab === 'commissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('commissions')}
          >
            Commissions
          </button>
        </div>

        <div className="panel-content">
          {activeTab === 'councilors' && (
            <div className="councilors-view">
              {/* Liste des conseillers par camp */}
              <div className="councilors-grid">
                {['gauche', 'centre', 'droite', 'extreme_droite'].map(alignment => (
                  <div key={alignment} className="alignment-group">
                    <h3 style={{ borderColor: getAlignmentColor(alignment) }}>
                      {getAlignmentLabel(alignment)}
                      <span className="count">({councilorsByAlignment[alignment]?.length || 0})</span>
                    </h3>
                    {councilorsByAlignment[alignment]?.map(councilor => {
                      const relLevel = getRelationshipLevel(councilor.relationship)
                      return (
                        <div
                          key={councilor.id}
                          className={`councilor-card ${selectedCouncilor?.id === councilor.id ? 'selected' : ''}`}
                          onClick={() => setSelectedCouncilor(councilor)}
                        >
                          <div className="card-header">
                            <span className="councilor-emoji">{councilor.emoji}</span>
                            <span className="mood">{getMoodEmoji(councilor.mood)}</span>
                          </div>
                          <div className="card-body">
                            <span className="councilor-name">{councilor.name}</span>
                            <span className="councilor-title">{councilor.title}</span>
                          </div>
                          <div className="card-footer">
                            <div className="relationship-bar">
                              <div
                                className="relationship-fill"
                                style={{ width: `${councilor.relationship}%`, background: relLevel.color }}
                              />
                            </div>
                            <span className="relationship-label" style={{ color: relLevel.color }}>
                              {relLevel.label}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Détail du conseiller sélectionné */}
              {selectedCouncilor && (
                <div className="councilor-detail">
                  <div className="detail-header">
                    <span className="detail-emoji">{selectedCouncilor.emoji}</span>
                    <div className="detail-info">
                      <h4>{selectedCouncilor.name}</h4>
                      <span className="detail-title">{selectedCouncilor.title}</span>
                      <span
                        className="detail-alignment"
                        style={{ background: getAlignmentColor(selectedCouncilor.alignment) }}
                      >
                        {getAlignmentLabel(selectedCouncilor.alignment)}
                      </span>
                    </div>
                  </div>

                  <p className="detail-desc">{selectedCouncilor.description}</p>

                  <div className="detail-traits">
                    {selectedCouncilor.traits?.map(trait => (
                      <span key={trait} className="trait">{trait}</span>
                    ))}
                  </div>

                  {/* Opinions du conseiller */}
                  <div className="detail-opinions">
                    <h5>Positions connues</h5>
                    {Object.entries(selectedCouncilor.opinions || {}).map(([theme, opinion]) => (
                      <div key={theme} className="opinion-item">
                        <span className="opinion-theme">{theme}</span>
                        <div className="opinion-bar">
                          <div
                            className="opinion-fill"
                            style={{
                              width: `${opinion.position}%`,
                              background: opinion.position > 60 ? '#3fb950' : opinion.position < 40 ? '#f85149' : '#d29922'
                            }}
                          />
                        </div>
                        {opinion.quote && <span className="opinion-quote">"{opinion.quote}"</span>}
                      </div>
                    ))}
                  </div>

                  {/* Phrases typiques */}
                  <div className="detail-quotes">
                    <h5>Expressions typiques</h5>
                    <p className="quote pro">Pour : "{selectedCouncilor.catchphrases?.pro}"</p>
                    <p className="quote con">Contre : "{selectedCouncilor.catchphrases?.con}"</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'commissions' && (
            <div className="commissions-view">
              <div className="commissions-list">
                {Object.values(COMMISSIONS).map(commission => {
                  const members = getCommissionMembers(commission.id)
                  return (
                    <div
                      key={commission.id}
                      className={`commission-card ${selectedCommission?.id === commission.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedCommission(commission)
                        setConsultationResult(null)
                      }}
                    >
                      <span className="commission-icon">{commission.icon}</span>
                      <div className="commission-info">
                        <h4>{commission.name}</h4>
                        <p>{commission.description}</p>
                        <div className="commission-members">
                          {members.map(m => (
                            <span key={m.id} className="member-avatar" title={m.name}>
                              {m.emoji}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Détail de la commission sélectionnée */}
              {selectedCommission && (
                <div className="commission-detail">
                  <div className="detail-header">
                    <span className="detail-emoji">{selectedCommission.icon}</span>
                    <h4>{selectedCommission.name}</h4>
                  </div>

                  <p className="detail-desc">{selectedCommission.description}</p>

                  <div className="commission-themes">
                    <h5>Thèmes de consultation</h5>
                    <div className="themes-grid">
                      {selectedCommission.themes.map(theme => (
                        <button
                          key={theme}
                          className="theme-btn"
                          onClick={() => {
                            const members = getCommissionMembers(selectedCommission.id)
                            if (members.length > 0) {
                              handleConsult(members[0], theme)
                            }
                          }}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="commission-members-detail">
                    <h5>Membres de la commission</h5>
                    {getCommissionMembers(selectedCommission.id).map(member => {
                      const relLevel = getRelationshipLevel(member.relationship)
                      return (
                        <div key={member.id} className="member-row">
                          <span className="member-emoji">{member.emoji}</span>
                          <div className="member-info">
                            <span className="member-name">{member.name}</span>
                            <span
                              className="member-alignment"
                              style={{ color: getAlignmentColor(member.alignment) }}
                            >
                              {getAlignmentLabel(member.alignment)}
                            </span>
                          </div>
                          <span className="member-relation" style={{ color: relLevel.color }}>
                            {relLevel.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Résultat de consultation */}
                  {consultationResult && (
                    <div className="consultation-result">
                      <h5>Avis recueilli</h5>
                      <div className="result-content">
                        <span className="result-emoji">{consultationResult.councilor.emoji}</span>
                        <div className="result-info">
                          <span className="result-name">{consultationResult.councilor.name}</span>
                          <div className="result-opinion">
                            <span>Position : </span>
                            <strong style={{
                              color: consultationResult.opinion.position > 60 ? '#3fb950' :
                                     consultationResult.opinion.position < 40 ? '#f85149' : '#d29922'
                            }}>
                              {consultationResult.opinion.position > 60 ? 'Favorable' :
                               consultationResult.opinion.position < 40 ? 'Opposé' : 'Mitigé'}
                            </strong>
                          </div>
                          {consultationResult.opinion.quote && (
                            <p className="result-quote">"{consultationResult.opinion.quote}"</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
