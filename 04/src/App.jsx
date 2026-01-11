import { useState, useEffect } from 'react'
import CityCanvas from './components/CityCanvas'
import ControlPanel from './components/ControlPanel'
import EventModal from './components/EventModal'
import CouncilMeetingModal from './components/council/CouncilMeetingModal'
import CouncilorsPanel from './components/council/CouncilorsPanel'
import IntroModal from './components/IntroModal'
import HelpPanel from './components/HelpPanel'
import ActionFeedback from './components/ActionFeedback'
import SharedRecapView from './components/SharedRecapView'
import { decodeRecapData } from './components/RecapPanel'
import './App.css'

function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [showHelp, setShowHelp] = useState(false)
  const [showCouncilors, setShowCouncilors] = useState(false)
  const [sharedRecap, setSharedRecap] = useState(null)

  // Verifier si on a un recap partage dans l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const recapData = params.get('recap')
    if (recapData) {
      const decoded = decodeRecapData(recapData)
      if (decoded) {
        setSharedRecap(decoded)
      }
    }
  }, [])

  // Fermer le recap partage et demarrer une nouvelle partie
  const handlePlayFromShared = () => {
    // Nettoyer l'URL
    window.history.replaceState({}, '', window.location.pathname)
    setSharedRecap(null)
    setShowIntro(true)
  }

  return (
    <div className="app">
      <a href="../" className="back-link">← Retour</a>

      {!showIntro && (
        <div className="top-buttons">
          <button
            className="council-toggle"
            onClick={() => setShowCouncilors(!showCouncilors)}
            title="Conseil municipal"
          >
            🏛️
          </button>
          <button className="help-toggle" onClick={() => setShowHelp(!showHelp)}>
            {showHelp ? '✕' : '?'}
          </button>
        </div>
      )}

      <div className="game-container">
        <div className="city-view">
          <CityCanvas />
        </div>
        <div className="panel-view">
          <ControlPanel />
        </div>
      </div>

      <EventModal />
      <CouncilMeetingModal />
      <ActionFeedback />

      {showIntro && <IntroModal onStart={() => setShowIntro(false)} />}
      {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}
      {showCouncilors && <CouncilorsPanel onClose={() => setShowCouncilors(false)} />}
      {sharedRecap && <SharedRecapView data={sharedRecap} onPlay={handlePlayFromShared} />}
    </div>
  )
}

export default App
