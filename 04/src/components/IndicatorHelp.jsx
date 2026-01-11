import { useState } from 'react'
import './IndicatorHelp.css'

const INDICATOR_EXPLANATIONS = {
  economie: {
    name: 'Economie',
    icon: '📊',
    description: "Mesure la vitalite economique de la ville : emplois, commerces, investissements.",
    factors: [
      { label: 'Hausse', items: ['Attractivite entreprises', 'Tourisme', 'Innovation'] },
      { label: 'Baisse', items: ['Chomage', 'Fuite des entreprises', 'Endettement'] }
    ],
    realImpact: "Une economie forte permet de financer les services publics via les impots locaux (taxe fonciere, CFE).",
    threshold: "En dessous de 25, risque de spirale negative avec montee des tensions sociales."
  },
  environnement: {
    name: 'Environnement',
    icon: '🌿',
    description: "Etat ecologique de la ville : qualite de l'air, espaces verts, biodiversite.",
    factors: [
      { label: 'Hausse', items: ['Investissements verts', 'Transports doux', 'Protection biodiversite'] },
      { label: 'Baisse', items: ['Pollution industrielle', 'Trafic automobile', 'Artificialisation'] }
    ],
    realImpact: "Un bon environnement attire les habitants et reduit les depenses de sante publique.",
    threshold: "En dessous de 30, la cohesion sociale se degrade (maladies, mal-etre)."
  },
  cohesion: {
    name: 'Cohesion sociale',
    icon: '🤝',
    description: "Niveau de solidarite et de bien-vivre ensemble dans la ville.",
    factors: [
      { label: 'Hausse', items: ['Services publics', 'Logements accessibles', 'Culture', 'Egalite'] },
      { label: 'Baisse', items: ['Inegalites', 'Tensions', 'Manque de logements', 'Libertes restreintes'] }
    ],
    realImpact: "Une forte cohesion favorise l'entraide, reduit la delinquance et attire de nouveaux habitants.",
    threshold: "En dessous de 25, l'economie se degrade (conflits, greves, fuite des habitants)."
  },
  energie: {
    name: 'Energie',
    icon: '⚡',
    description: "Capacite energetique de la ville : production, consommation, resilience.",
    factors: [
      { label: 'Hausse', items: ['Energies renouvelables', 'Renovation thermique', 'Sobriete'] },
      { label: 'Baisse', items: ['Forte demande (hiver/ete)', 'Dependance aux fossiles', 'Population croissante'] }
    ],
    realImpact: "L'autonomie energetique protege contre les crises et reduit la facture des menages.",
    threshold: "Variations saisonnieres : l'hiver et l'ete sont les periodes les plus tendues."
  }
}

export default function IndicatorHelp({ indicatorKey, onClose }) {
  const info = INDICATOR_EXPLANATIONS[indicatorKey]
  if (!info) return null

  return (
    <div className="indicator-help-overlay" onClick={onClose}>
      <div className="indicator-help-modal" onClick={e => e.stopPropagation()}>
        <button className="help-close" onClick={onClose}>×</button>

        <div className="help-header">
          <span className="help-icon">{info.icon}</span>
          <h2>{info.name}</h2>
        </div>

        <p className="help-description">{info.description}</p>

        <div className="help-factors">
          {info.factors.map((factor, i) => (
            <div key={i} className={`factor-group ${factor.label === 'Hausse' ? 'positive' : 'negative'}`}>
              <span className="factor-label">
                {factor.label === 'Hausse' ? '📈' : '📉'} {factor.label}
              </span>
              <ul>
                {factor.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="help-real-impact">
          <span className="impact-label">Impact reel</span>
          <p>{info.realImpact}</p>
        </div>

        <div className="help-threshold">
          <span className="threshold-icon">⚠️</span>
          <p>{info.threshold}</p>
        </div>
      </div>
    </div>
  )
}

export function IndicatorHelpButton({ indicatorKey }) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <>
      <button
        className="indicator-help-btn"
        onClick={(e) => {
          e.stopPropagation()
          setShowHelp(true)
        }}
        title="En savoir plus"
      >
        ?
      </button>
      {showHelp && (
        <IndicatorHelp
          indicatorKey={indicatorKey}
          onClose={() => setShowHelp(false)}
        />
      )}
    </>
  )
}
