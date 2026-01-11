import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'
import './SharedRecapView.css'

const INDICATOR_COLORS = {
  economie: '#58a6ff',
  environnement: '#3fb950',
  cohesion: '#f0883e',
  energie: '#d29922'
}

const ORIENTATION_LABELS = {
  gauche: { name: 'Gauche', color: '#E63946' },
  droite: { name: 'Droite', color: '#1E3A5F' },
  extreme_droite: { name: 'Extrême droite', color: '#4A2C2A' },
  centre: { name: 'Centre', color: '#F0A500' },
  neutre: { name: 'Neutre', color: '#6e7681' }
}

export default function SharedRecapView({ data, onPlay }) {
  if (!data) return null

  const orientation = ORIENTATION_LABELS[data.o] || ORIENTATION_LABELS.neutre

  // Transformer les données historiques pour recharts
  const historyData = data.h?.map((point, idx) => ({
    turn: point.turn || idx + 1,
    economie: point.economie,
    environnement: point.environnement,
    cohesion: point.cohesion,
    energie: point.energie
  })) || []

  return (
    <div className="shared-recap-overlay">
      <motion.div
        className="shared-recap"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <header className="shared-header">
          <div className="shared-badge">Résultat partagé</div>
          <h1>Simulateur Municipal</h1>
        </header>

        <div className="shared-score-section">
          <motion.div
            className="shared-score"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <span className="score-value">{data.s}</span>
            <span className="score-max">/100</span>
          </motion.div>
          <motion.p
            className="shared-verdict"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {data.v}
          </motion.p>
          <motion.div
            className="shared-orientation"
            style={{ borderColor: orientation.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Politique <span style={{ color: orientation.color }}>{orientation.name}</span>
          </motion.div>
        </div>

        <div className="shared-indicators">
          <h3>Indicateurs finaux</h3>
          <div className="indicators-grid">
            {[
              { key: 'e', label: 'Économie', color: INDICATOR_COLORS.economie },
              { key: 'n', label: 'Environnement', color: INDICATOR_COLORS.environnement },
              { key: 'c', label: 'Cohésion', color: INDICATOR_COLORS.cohesion },
              { key: 'g', label: 'Énergie', color: INDICATOR_COLORS.energie }
            ].map((ind, idx) => (
              <motion.div
                key={ind.key}
                className="indicator-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
              >
                <span className="indicator-label">{ind.label}</span>
                <div className="indicator-bar">
                  <motion.div
                    className="indicator-fill"
                    style={{ backgroundColor: ind.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${data.f[ind.key]}%` }}
                    transition={{ delay: 0.8 + idx * 0.1, duration: 0.6 }}
                  />
                </div>
                <span className="indicator-value" style={{ color: ind.color }}>
                  {data.f[ind.key]}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {historyData.length > 0 && (
          <div className="shared-chart">
            <h3>Évolution</h3>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={historyData}>
                <defs>
                  {Object.entries(INDICATOR_COLORS).map(([key, color]) => (
                    <linearGradient key={key} id={`shared-gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <XAxis dataKey="turn" stroke="#484f58" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#484f58" fontSize={10} />
                <Tooltip
                  contentStyle={{ background: '#21262d', border: '1px solid #30363d', borderRadius: 6, fontSize: 11 }}
                />
                {Object.entries(INDICATOR_COLORS).map(([key, color]) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={color}
                    fill={`url(#shared-gradient-${key})`}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="shared-population">
          <h3>Population finale</h3>
          <div className="pop-grid">
            <div className="pop-item">
              <span className="pop-icon">👷</span>
              <span className="pop-label">Populaires</span>
              <span className="pop-value">{data.p.p}</span>
            </div>
            <div className="pop-item">
              <span className="pop-icon">👨‍💼</span>
              <span className="pop-label">Moyennes</span>
              <span className="pop-value">{data.p.m}</span>
            </div>
            <div className="pop-item">
              <span className="pop-icon">🎩</span>
              <span className="pop-label">Aisées</span>
              <span className="pop-value">{data.p.r}</span>
            </div>
          </div>
        </div>

        {data.a && data.a.length > 0 && (
          <div className="shared-actions">
            <h3>Actions majeures</h3>
            <div className="actions-list">
              {data.a.map((action, idx) => (
                <motion.div
                  key={idx}
                  className="action-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + idx * 0.05 }}
                >
                  <span className="action-turn">T{action.t}</span>
                  <span className="action-name">{action.n}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <footer className="shared-footer">
          <p className="challenge-text">Tu peux faire mieux ?</p>
          <motion.button
            className="play-btn"
            onClick={onPlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Jouer ma ville
          </motion.button>
        </footer>
      </motion.div>
    </div>
  )
}
