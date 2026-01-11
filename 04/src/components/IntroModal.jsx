import { useState } from 'react'
import { getAllVilles } from '../data/inseeData'
import { useGameStore } from '../store/gameStore'
import './IntroModal.css'

export default function IntroModal({ onStart }) {
  const [page, setPage] = useState(0)
  const [selectedVille, setSelectedVille] = useState('ville_equilibree')
  const initializeWithVille = useGameStore(state => state.initializeWithVille)

  const villes = getAllVilles()

  const handleStart = () => {
    if (initializeWithVille) {
      initializeWithVille(selectedVille)
    }
    onStart()
  }

  const pages = [
    {
      title: "Bienvenue dans Micro-Cité",
      content: (
        <>
          <p className="intro-highlight">
            Un simulateur pour comprendre les enjeux des politiques municipales.
          </p>
          <p>
            Vous prenez les commandes d'une ville en difficulté. Services publics dégradés,
            inégalités croissantes, transition écologique en retard... À vous de choisir
            quelle orientation politique donner à votre mandat.
          </p>
          <p>
            Chaque décision aura des conséquences — certaines immédiates, d'autres différées,
            certaines visibles, d'autres cachées.
          </p>
        </>
      )
    },
    {
      title: "Différentes visions politiques",
      content: (
        <>
          <p>
            Les mesures disponibles s'inspirent de <strong>vrais programmes politiques</strong> :
          </p>
          <ul className="policy-list">
            <li>
              <span className="policy-tag gauche">Gauche / NFP</span>
              Services publics, logement social, transition écologique, justice fiscale
            </li>
            <li>
              <span className="policy-tag droite">Droite / LR</span>
              Sécurité, attractivité économique, réduction des dépenses, privatisations
            </li>
            <li>
              <span className="policy-tag ed">Extrême droite</span>
              Ordre public, localisme, identité, arrêtés municipaux
            </li>
            <li>
              <span className="policy-tag centre">Centre</span>
              Partenariats public-privé, smart city, écologie modérée
            </li>
          </ul>
          <p>
            Testez ces approches et observez leurs effets sur la vie des habitants.
          </p>
        </>
      )
    },
    {
      title: "Un outil pédagogique",
      content: (
        <>
          <p className="intro-highlight">
            Ce simulateur montre la complexité des choix politiques
            et leurs conséquences réelles.
          </p>
          <div className="insight-grid">
            <div className="insight">
              <span className="insight-icon">🔄</span>
              <span>Les effets sont souvent <strong>différés</strong> — investir aujourd'hui, récolter demain</span>
            </div>
            <div className="insight">
              <span className="insight-icon">🔗</span>
              <span>Tout est <strong>interconnecté</strong> — l'éducation affecte l'économie, l'environnement la santé</span>
            </div>
            <div className="insight">
              <span className="insight-icon">👥</span>
              <span>Les <strong>inégalités</strong> ont un coût — ignorer les plus fragiles fragilise tout le monde</span>
            </div>
            <div className="insight">
              <span className="insight-icon">📊</span>
              <span>En fin de partie, un <strong>bilan détaillé</strong> explique les mécanismes de vos choix</span>
            </div>
          </div>
        </>
      )
    },
    {
      title: "Choisissez votre ville",
      content: (
        <>
          <p className="intro-highlight">
            Sélectionnez un profil de ville pour commencer votre mandat.
          </p>
          <p className="intro-subtitle">
            Chaque ville a ses propres défis basés sur des données INSEE réelles.
          </p>
          <div className="ville-grid">
            {villes.map(ville => (
              <div
                key={ville.id}
                className={`ville-card ${selectedVille === ville.id ? 'selected' : ''}`}
                onClick={() => setSelectedVille(ville.id)}
              >
                <div className="ville-header">
                  <h4>{ville.nom}</h4>
                  <span className="ville-pop">{ville.population.toLocaleString()} hab.</span>
                </div>
                <p className="ville-desc">{ville.description}</p>
                <div className="ville-defis">
                  {ville.defis.slice(0, 2).map((defi, idx) => (
                    <span key={idx} className="defi-tag">{defi}</span>
                  ))}
                </div>
                <div className="ville-stats">
                  <span className={ville.stats.tauxChomage > 12 ? 'stat-bad' : 'stat-ok'}>
                    Chômage: {ville.stats.tauxChomage}%
                  </span>
                  <span className={ville.stats.tauxPauvrete > 18 ? 'stat-bad' : 'stat-ok'}>
                    Pauvreté: {ville.stats.tauxPauvrete}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="ville-source">
            Données inspirées de l'INSEE 2022
          </p>
        </>
      )
    }
  ]

  const isLastPage = page === pages.length - 1

  return (
    <div className="intro-overlay">
      <div className="intro-modal">
        <div className="intro-header">
          <h2>{pages[page].title}</h2>
        </div>

        <div className="intro-content">
          {pages[page].content}
        </div>

        <div className="intro-footer">
          <div className="intro-dots">
            {pages.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === page ? 'active' : ''}`}
                onClick={() => setPage(idx)}
              />
            ))}
          </div>

          <div className="intro-buttons">
            {page > 0 && (
              <button className="intro-btn secondary" onClick={() => setPage(page - 1)}>
                Retour
              </button>
            )}
            {isLastPage ? (
              <button className="intro-btn primary" onClick={handleStart}>
                Commencer
              </button>
            ) : (
              <button className="intro-btn primary" onClick={() => setPage(page + 1)}>
                Suivant
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
