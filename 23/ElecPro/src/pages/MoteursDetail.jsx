import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { getCategoryById, getFicheById } from '../data/moteurs'

function MoteursDetail() {
  const { categoryId } = useParams()
  const category = getCategoryById(categoryId)
  const fiche = getFicheById(categoryId)

  if (!category || !fiche) {
    return (
      <div className="p-4">
        <Link to="/moteurs" className="flex items-center gap-2 text-blue-600 mb-4">
          <ArrowLeft size={20} />
          Retour
        </Link>
        <div className="card text-center py-8">
          <p className="text-gray-500">Categorie non trouvee</p>
        </div>
      </div>
    )
  }

  const colorMap = {
    blue: { bg: 'from-blue-500 to-blue-600', light: 'bg-blue-50 border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
    amber: { bg: 'from-amber-500 to-amber-600', light: 'bg-amber-50 border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
    violet: { bg: 'from-violet-500 to-violet-600', light: 'bg-violet-50 border-violet-200', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700' }
  }
  const colors = colorMap[category.color] || colorMap.violet

  return (
    <div className="p-4 space-y-4">
      {/* Back button */}
      <Link
        to="/moteurs"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        <span>Moteurs</span>
      </Link>

      {/* Header */}
      <div className={`card bg-gradient-to-br ${colors.bg} text-white`}>
        <span className="text-3xl mb-2 block">{category.icon}</span>
        <h2 className="font-bold text-xl">{fiche.titre}</h2>
        <p className="text-white/80 text-sm mt-1">{fiche.intro}</p>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {fiche.sections.map((section, idx) => (
          <div key={idx} className="card space-y-3">
            <h3 className="font-bold text-gray-900">{section.titre}</h3>

            {/* Contenu texte simple */}
            {typeof section.contenu === 'string' && (
              <p className="text-sm text-gray-600">{section.contenu}</p>
            )}

            {/* Liste d'elements */}
            {Array.isArray(section.contenu) && (
              <div className="space-y-2">
                {section.contenu.map((item, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    {/* Element generique */}
                    {item.element && (
                      <>
                        <div className={`font-semibold ${colors.text}`}>{item.element}</div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </>
                    )}
                    {/* Type avec puissance */}
                    {item.type && !item.principe && !item.temps && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${colors.text}`}>{item.type}</span>
                          {item.puissance && (
                            <span className="text-xs text-gray-400">({item.puissance})</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </>
                    )}
                    {/* Parametre */}
                    {item.param && (
                      <>
                        <div className={`font-semibold ${colors.text}`}>{item.param}</div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </>
                    )}
                    {/* Point */}
                    {item.point && (
                      <>
                        <div className={`font-semibold ${colors.text}`}>{item.point}</div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </>
                    )}
                    {/* Phase demarrage */}
                    {item.phase && (
                      <>
                        <div className="font-semibold text-green-700">{item.phase}</div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </>
                    )}
                    {/* Avantage/Inconvenient */}
                    {item.avantage && !item.dispositif && (
                      <div className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-green-700">{item.avantage}</span>
                      </div>
                    )}
                    {item.inconvenient && !item.dispositif && (
                      <div className="flex items-start gap-2">
                        <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-red-700">{item.inconvenient}</span>
                      </div>
                    )}
                    {item.limite && (
                      <div className="flex items-start gap-2">
                        <Info size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-amber-700">{item.limite}</span>
                      </div>
                    )}
                    {item.condition && (
                      <div className="flex items-start gap-2">
                        <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-blue-700">{item.condition}</span>
                      </div>
                    )}
                    {/* Dispositif protection */}
                    {item.dispositif && (
                      <>
                        <div className="font-semibold text-red-700">{item.dispositif}</div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        {item.reglage && (
                          <p className="text-xs text-blue-600 mt-1">Réglage: {item.reglage}</p>
                        )}
                        {item.avantage && (
                          <p className="text-xs text-green-600 mt-1">+ {item.avantage}</p>
                        )}
                      </>
                    )}
                    {/* Classe isolation */}
                    {item.classe && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${colors.badge} px-2 py-0.5 rounded`}>
                            Classe {item.classe}
                          </span>
                          <span className="text-sm text-gray-600">{item.description}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.usage}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Formules */}
            {section.formules && (
              <div className="space-y-2">
                {section.formules.map((f, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${colors.light}`}>
                    <div className={`font-semibold ${colors.text}`}>{f.nom}</div>
                    <div className="font-mono text-lg text-gray-900 my-1 bg-white/50 inline-block px-2 py-1 rounded">
                      {f.formule}
                    </div>
                    <p className="text-xs text-gray-600">{f.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tableau vitesses */}
            {section.tableau && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 text-left">Pôles</th>
                      <th className="px-3 py-2 text-left">Paires</th>
                      <th className="px-3 py-2 text-left">Vitesse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.tableau.map((row, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2">{row.poles}</td>
                        <td className="px-3 py-2">{row.paires}</td>
                        <td className={`px-3 py-2 font-semibold ${colors.text}`}>{row.vitesse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Regles */}
            {section.regles && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                {section.regles.map((regle, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-amber-800 mt-1 first:mt-0">
                    <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>{regle}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lien vers quiz */}
      <Link
        to="/quiz/moteurs"
        className={`block card ${colors.light} border text-center py-4`}
      >
        <p className={`font-semibold ${colors.text}`}>Testez vos connaissances</p>
        <p className="text-sm text-gray-600">Quiz Moteurs disponible</p>
      </Link>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pb-4">
        Moteurs électriques - Formation
      </div>
    </div>
  )
}

export default MoteursDetail
