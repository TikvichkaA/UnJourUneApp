import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { useGameStore } from '../store/gameStore'
import './RecapPanel.css'

// Fonction pour compresser les données du recap en base64
const encodeRecapData = (recap, score, verdict) => {
  const shareData = {
    s: score, // score
    v: verdict.title.substring(0, 50), // verdict (tronque)
    o: recap.dominantOrientation,
    f: { // final state (indicateurs principaux)
      e: recap.finalState.economie,
      n: recap.finalState.environnement,
      c: recap.finalState.cohesion,
      g: recap.finalState.energie
    },
    p: { // population
      p: recap.finalState.population.poor,
      m: recap.finalState.population.middle,
      r: recap.finalState.population.rich
    },
    h: recap.indicatorHistory.slice(-8), // 8 derniers points
    a: recap.actionHistory.slice(0, 10).map(a => ({ n: a.name, t: a.turn })) // 10 actions max
  }
  return btoa(encodeURIComponent(JSON.stringify(shareData)))
}

// Fonction pour décoder les données partagées
export const decodeRecapData = (encoded) => {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)))
  } catch {
    return null
  }
}

const tabVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function RecapPanel({ onClose }) {
  const { getRecapData, getScore, getVerdict, orientations, categories, reset } = useGameStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [shareStatus, setShareStatus] = useState(null) // null | 'copied' | 'error'

  const recap = getRecapData()
  const score = getScore()
  const verdict = getVerdict()

  // Gestion du partage
  const handleShare = useCallback(async () => {
    try {
      const encoded = encodeRecapData(recap, score, verdict)
      const shareUrl = `${window.location.origin}${window.location.pathname}?recap=${encoded}`

      // Essayer l'API Web Share (mobile)
      if (navigator.share) {
        await navigator.share({
          title: `Mon mandat: ${score}/100 - ${verdict.title}`,
          text: `J'ai obtenu ${score}/100 dans Simulateur Municipal ! Politique ${recap.dominantOrientation}. À toi de faire mieux !`,
          url: shareUrl
        })
        setShareStatus('shared')
      } else {
        // Fallback: copier le lien
        await navigator.clipboard.writeText(shareUrl)
        setShareStatus('copied')
      }

      setTimeout(() => setShareStatus(null), 3000)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setShareStatus('error')
        setTimeout(() => setShareStatus(null), 3000)
      }
    }
  }, [recap, score, verdict])

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
    { id: 'timeline', label: 'Chronologie', icon: '📅' },
    { id: 'analysis', label: 'Analyse', icon: '🔍' },
    { id: 'hidden', label: 'Coulisses', icon: '🎭' }
  ]

  // Données pour le graphique pie d'orientation
  const orientationData = Object.entries(recap.orientationScore)
    .filter(([_, val]) => val > 0)
    .map(([key, val]) => ({
      name: orientations[key]?.name || key,
      value: val,
      color: orientations[key]?.color || '#666'
    }))

  // Couleurs pour les graphiques
  const INDICATOR_COLORS = {
    economie: '#58a6ff',
    environnement: '#3fb950',
    cohesion: '#f0883e',
    energie: '#d29922'
  }

  return (
    <motion.div
      className="recap-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="recap-panel"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <header className="recap-header">
          <div className="recap-title">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Bilan de votre mandat
            </motion.h1>
            <motion.p
              className="recap-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {verdict.title}
            </motion.p>
          </div>
          <motion.div
            className="recap-score"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.3 }}
          >
            <span className="score-value">{score}</span>
            <span className="score-label">/100</span>
          </motion.div>
        </header>

        <motion.div
          className="recap-verdict"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.5 }}
        >
          <p>{verdict.desc}</p>
        </motion.div>

        <nav className="recap-tabs">
          {tabs.map((tab, idx) => (
            <motion.button
              key={tab.id}
              className={`recap-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </motion.button>
          ))}
        </nav>

        <div className="recap-content">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                className="tab-overview"
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <section className="overview-section">
                  <h3>Orientation politique</h3>
                  <div className="orientation-chart-container">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={orientationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={1000}
                        >
                          {orientationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [`${value} actions`, name]}
                          contentStyle={{ background: '#21262d', border: '1px solid #30363d', borderRadius: 6 }}
                          labelStyle={{ color: '#e6edf3' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <motion.div
                      className="orientation-legend"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="show"
                    >
                      {orientationData.map((item, idx) => (
                        <motion.div
                          key={idx}
                          className="legend-item"
                          variants={staggerItem}
                        >
                          <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                          <span className="legend-name">{item.name}</span>
                          <span className="legend-count">{item.value}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                  {recap.dominantOrientation !== 'neutre' && (
                    <motion.p
                      className="orientation-analysis"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      style={{ borderLeftColor: orientations[recap.dominantOrientation]?.color }}
                    >
                      Politique majoritairement <strong style={{ color: orientations[recap.dominantOrientation]?.color }}>
                        {orientations[recap.dominantOrientation]?.name?.toLowerCase()}
                      </strong>. {orientations[recap.dominantOrientation]?.desc}.
                    </motion.p>
                  )}
                </section>

                <section className="overview-section">
                  <h3>Évolution des indicateurs</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={recap.indicatorHistory}>
                        <defs>
                          {Object.entries(INDICATOR_COLORS).map(([key, color]) => (
                            <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                          ))}
                        </defs>
                        <XAxis dataKey="turn" stroke="#484f58" fontSize={10} tickLine={false} />
                        <YAxis domain={[0, 100]} stroke="#484f58" fontSize={10} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: '#21262d', border: '1px solid #30363d', borderRadius: 6, fontSize: 12 }}
                          labelStyle={{ color: '#8b949e' }}
                        />
                        {Object.entries(INDICATOR_COLORS).map(([key, color]) => (
                          <Area
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={color}
                            fill={`url(#gradient-${key})`}
                            strokeWidth={2}
                            animationDuration={1500}
                          />
                        ))}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="indicators-legend">
                    {Object.entries(INDICATOR_COLORS).map(([key, color]) => (
                      <div key={key} className="indicator-legend-item">
                        <span className="indicator-dot" style={{ backgroundColor: color }}></span>
                        <span className="indicator-legend-name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <span className="indicator-legend-value" style={{ color }}>{recap.finalState[key]}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="overview-section population-final">
                  <h3>Population finale</h3>
                  <motion.div
                    className="pop-breakdown-final"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                  >
                    {[
                      { key: 'poor', icon: '👷', name: 'Populaires', value: recap.finalState.population.poor },
                      { key: 'middle', icon: '👨‍💼', name: 'Moyennes', value: recap.finalState.population.middle },
                      { key: 'rich', icon: '🎩', name: 'Aisées', value: recap.finalState.population.rich }
                    ].map((pop, idx) => (
                      <motion.div key={pop.key} className="pop-group" variants={staggerItem}>
                        <span className="pop-icon">{pop.icon}</span>
                        <span className="pop-name">{pop.name}</span>
                        <motion.span
                          className="pop-value"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + idx * 0.15, type: 'spring' }}
                        >
                          {pop.value}
                        </motion.span>
                      </motion.div>
                    ))}
                  </motion.div>
                </section>
              </motion.div>
            )}

            {activeTab === 'timeline' && (
              <motion.div
                key="timeline"
                className="tab-timeline"
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <motion.div
                  className="timeline"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  {recap.actionHistory.map((action, idx) => {
                    const catInfo = categories[action.category]
                    const orientInfo = orientations[action.orientation]
                    return (
                      <motion.div
                        key={idx}
                        className="timeline-item"
                        variants={staggerItem}
                        whileHover={{ x: 5, transition: { duration: 0.2 } }}
                      >
                        <motion.div
                          className="timeline-marker"
                          style={{ backgroundColor: orientInfo?.color || '#666' }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.05, type: 'spring' }}
                        />
                        <div className="timeline-content">
                          <div className="timeline-turn">Tour {action.turn}</div>
                          <div className="timeline-action">{action.name}</div>
                          <div className="timeline-category" style={{ color: catInfo?.color }}>
                            {catInfo?.icon} {catInfo?.name}
                          </div>
                          {action.desc && <div className="timeline-desc">{action.desc}</div>}
                        </div>
                      </motion.div>
                    )
                  })}
                  {recap.actionHistory.length === 0 && (
                    <p className="no-actions">Aucune action entreprise.</p>
                  )}
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'analysis' && (
              <motion.div
                key="analysis"
                className="tab-analysis"
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <section className="analysis-section">
                  <h3>Moments clés</h3>
                  {recap.keyMoments.length > 0 ? (
                    <motion.div
                      className="key-moments"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="show"
                    >
                      {recap.keyMoments.map((moment, idx) => (
                        <motion.div
                          key={idx}
                          className={`moment-card ${moment.impact}`}
                          variants={staggerItem}
                          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        >
                          <div className="moment-turn">Tour {moment.turn}</div>
                          <div className="moment-action">{moment.action}</div>
                          <div className="moment-deltas">
                            {moment.delta.cohesion !== 0 && (
                              <motion.span
                                className={moment.delta.cohesion > 0 ? 'positive' : 'negative'}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                              >
                                Cohésion {moment.delta.cohesion > 0 ? '+' : ''}{moment.delta.cohesion}
                              </motion.span>
                            )}
                            {moment.delta.economie !== 0 && (
                              <motion.span
                                className={moment.delta.economie > 0 ? 'positive' : 'negative'}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.35 + idx * 0.1 }}
                              >
                                Économie {moment.delta.economie > 0 ? '+' : ''}{moment.delta.economie}
                              </motion.span>
                            )}
                            {moment.delta.environnement !== 0 && (
                              <motion.span
                                className={moment.delta.environnement > 0 ? 'positive' : 'negative'}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 + idx * 0.1 }}
                              >
                                Environnement {moment.delta.environnement > 0 ? '+' : ''}{moment.delta.environnement}
                              </motion.span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <p className="no-moments">Pas de bouleversements majeurs durant votre mandat.</p>
                  )}
                </section>

                <section className="analysis-section">
                  <h3>Mécanismes en jeu</h3>
                  <motion.div
                    className="causal-analysis"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                  >
                    {recap.causalAnalysis.map((item, idx) => (
                      <motion.div
                        key={idx}
                        className={`causal-card ${item.severity}`}
                        variants={staggerItem}
                        whileHover={{ x: 5 }}
                      >
                        <div className="causal-cause">{item.cause}</div>
                        <motion.div
                          className="causal-arrow"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                        >
                          →
                        </motion.div>
                        <div className="causal-effect">{item.effect}</div>
                      </motion.div>
                    ))}
                    {recap.causalAnalysis.length === 0 && (
                      <p className="no-analysis">Situation équilibrée, pas de mécanisme dominant.</p>
                    )}
                  </motion.div>
                </section>
              </motion.div>
            )}

            {activeTab === 'hidden' && (
              <motion.div
                key="hidden"
                className="tab-hidden"
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <motion.p
                  className="hidden-intro"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Ces indicateurs invisibles ont influencé le destin de votre ville :
                </motion.p>
                <motion.div
                  className="hidden-grid"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  {[
                    { key: 'tension', label: 'Tension sociale', type: 'danger' },
                    { key: 'pollution', label: 'Pollution', type: 'danger' },
                    { key: 'greenInvest', label: 'Investissements verts', type: 'positive' },
                    { key: 'education', label: 'Éducation', type: 'positive' },
                    { key: 'health', label: 'Santé', type: 'positive' },
                    { key: 'culture', label: 'Culture', type: 'positive' },
                    { key: 'security', label: 'Sécurité', type: 'neutral' },
                    { key: 'liberty', label: 'Libertés', type: 'positive' },
                    { key: 'infrastructureDebt', label: 'Dette infrastructure', type: 'danger' },
                    { key: 'innovation', label: 'Innovation', type: 'positive' }
                  ].map((item, idx) => (
                    <motion.div
                      key={item.key}
                      className="hidden-item"
                      variants={staggerItem}
                    >
                      <span className="hidden-label">{item.label}</span>
                      <div className="hidden-bar">
                        <motion.div
                          className={`hidden-fill ${item.type}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(recap.finalState.hidden[item.key] || 0, 100)}%` }}
                          transition={{ delay: 0.3 + idx * 0.05, duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                      <motion.span
                        className="hidden-value"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + idx * 0.05 }}
                      >
                        {recap.finalState.hidden[item.key] || 0}
                      </motion.span>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.p
                  className="hidden-explanation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  Ces variables cachées représentent les dynamiques profondes qui façonnent une ville.
                  Elles évoluent en fonction de vos choix et déclenchent des effets en chaîne.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="recap-footer">
          <motion.button
            className="recap-btn secondary"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Fermer
          </motion.button>
          <motion.button
            className={`recap-btn share ${shareStatus || ''}`}
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {shareStatus === 'copied' ? '✓ Lien copié !' :
             shareStatus === 'shared' ? '✓ Partagé !' :
             shareStatus === 'error' ? 'Erreur' :
             '📤 Partager'}
          </motion.button>
          <motion.button
            className="recap-btn primary"
            onClick={() => { reset(); onClose(); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Nouvelle partie
          </motion.button>
        </footer>
      </motion.div>
    </motion.div>
  )
}
