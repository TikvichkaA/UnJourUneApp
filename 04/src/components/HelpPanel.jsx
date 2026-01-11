import './HelpPanel.css'

const POLICY_INFO = {
  social: {
    title: 'Politiques Sociales',
    color: '#58a6ff',
    policies: [
      {
        name: 'Logement social',
        realWorld: 'Construction de HLM, encadrement des loyers, réquisition de logements vacants',
        effects: 'Réduit les inégalités, améliore la cohésion sociale, peut réduire l\'attractivité pour les plus riches'
      },
      {
        name: 'Éducation',
        realWorld: 'Écoles municipales, cantines gratuites, activités périscolaires, soutien scolaire',
        effects: 'Investissement long terme : améliore l\'économie et la mobilité sociale après plusieurs tours'
      },
      {
        name: 'Santé publique',
        realWorld: 'Centres de santé municipaux, prévention, accès aux soins pour tous',
        effects: 'Réduit les tensions, augmente la population, protège contre les épidémies'
      },
      {
        name: 'Culture & loisirs',
        realWorld: 'Médiathèques, MJC, festivals gratuits, associations culturelles',
        effects: 'Renforce la cohésion sociale, réduit les tensions, attire le tourisme'
      }
    ]
  },
  infrastructure: {
    title: 'Infrastructure',
    color: '#d29922',
    policies: [
      {
        name: 'Transport public',
        realWorld: 'Bus, tramway, vélos en libre-service, gratuité des transports',
        effects: 'Améliore l\'environnement, la cohésion, mais coûte en énergie. Politique de gauche emblématique.'
      },
      {
        name: 'Logements',
        realWorld: 'Permis de construire, zones d\'aménagement',
        effects: 'Augmente la population mais peut créer des tensions si pas assez de services'
      },
      {
        name: 'Zone commerciale',
        realWorld: 'Soutien au commerce local, marchés, halles',
        effects: 'Crée des emplois locaux, améliore l\'économie et la cohésion'
      }
    ]
  },
  environnement: {
    title: 'Environnement',
    color: '#3fb950',
    policies: [
      {
        name: 'Espaces verts',
        realWorld: 'Parcs, jardins partagés, végétalisation urbaine, coulées vertes',
        effects: 'Améliore l\'environnement et la santé, réduit la pollution, renforce la cohésion'
      },
      {
        name: 'Recyclage',
        realWorld: 'Tri sélectif, compostage collectif, ressourceries',
        effects: 'Réduit la pollution, crée des emplois pour les moins qualifiés'
      },
      {
        name: 'Énergie verte',
        realWorld: 'Panneaux solaires municipaux, régie publique d\'énergie, rénovation thermique',
        effects: 'Investissement initial élevé, mais dividendes environnementaux et énergétiques à long terme'
      }
    ]
  },
  economie: {
    title: 'Économie & Fiscalité',
    color: '#a371f7',
    policies: [
      {
        name: 'Fiscalité',
        realWorld: 'Taxe foncière, taxe d\'habitation, impôts locaux',
        effects: 'Augmenter : plus de budget mais risque d\'exode fiscal. Baisser : attire les riches mais moins de moyens.'
      },
      {
        name: 'Incubateur tech',
        realWorld: 'Soutien aux startups locales, pépinières d\'entreprises',
        effects: 'Crée des emplois qualifiés, attire les classes moyennes et aisées'
      }
    ]
  }
}

const MECHANICS_INFO = [
  {
    title: 'Effets différés',
    icon: '⏳',
    desc: 'Certaines décisions ne montrent leurs effets qu\'après plusieurs tours. L\'éducation par exemple prend du temps avant d\'améliorer l\'économie.'
  },
  {
    title: 'Variables cachées',
    icon: '👁️',
    desc: 'La pollution, les tensions sociales, la dette... Ces indicateurs ne sont pas visibles mais influencent fortement la situation.'
  },
  {
    title: 'Inégalités',
    icon: '⚖️',
    desc: 'L\'écart entre riches et pauvres crée des tensions. Une ville prospère mais inégalitaire est instable.'
  },
  {
    title: 'Cercles vertueux',
    icon: '🔄',
    desc: 'Les bonnes politiques sociales et environnementales peuvent créer des dynamiques positives auto-entretenues.'
  }
]

export default function HelpPanel({ onClose }) {
  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-panel" onClick={e => e.stopPropagation()}>
        <header className="help-header">
          <h2>Guide des politiques municipales</h2>
          <button className="help-close" onClick={onClose}>✕</button>
        </header>

        <div className="help-content">
          <section className="help-section">
            <h3>Comprendre les mécaniques</h3>
            <div className="mechanics-grid">
              {MECHANICS_INFO.map((m, idx) => (
                <div key={idx} className="mechanic-card">
                  <span className="mechanic-icon">{m.icon}</span>
                  <div>
                    <strong>{m.title}</strong>
                    <p>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {Object.entries(POLICY_INFO).map(([key, category]) => (
            <section key={key} className="help-section">
              <h3 style={{ borderColor: category.color }}>{category.title}</h3>
              <div className="policy-cards">
                {category.policies.map((policy, idx) => (
                  <div key={idx} className="policy-card">
                    <h4>{policy.name}</h4>
                    <div className="policy-detail">
                      <span className="detail-label">Dans la réalité :</span>
                      <p>{policy.realWorld}</p>
                    </div>
                    <div className="policy-detail">
                      <span className="detail-label">Effets dans le jeu :</span>
                      <p>{policy.effects}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="help-section conclusion">
            <h3>Le message</h3>
            <p>
              Ce simulateur montre que <strong>les politiques progressistes</strong> —
              investissement dans les services publics, réduction des inégalités,
              transition écologique — peuvent créer des villes plus résilientes et plus justes.
            </p>
            <p>
              Les effets ne sont pas toujours immédiats, mais sur le long terme,
              <strong> une ville qui prend soin de tous ses habitants</strong> est
              une ville qui prospère.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
