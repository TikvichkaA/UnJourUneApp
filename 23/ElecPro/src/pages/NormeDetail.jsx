import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { normes } from '../data/normes'

function NormeDetail() {
  const { normeId } = useParams()
  const category = normes.categories.find(c => c.id === normeId)

  if (!category) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Catégorie non trouvée</p>
        <Link to="/normes" className="text-blue-600 mt-2 inline-block">Retour aux normes</Link>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Back button */}
      <Link
        to="/normes"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        <span>NF C 15-100</span>
      </Link>

      {/* Header */}
      <div className="card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <span className="text-3xl mb-2 block">{category.icon}</span>
        <h2 className="font-bold text-xl">{category.titre}</h2>
        <p className="text-emerald-100 text-sm mt-1">{category.description}</p>
      </div>

      {/* Render fiches based on category type */}
      {category.id === 'equipements-pieces' && (
        <PiecesContent fiches={category.fiches} />
      )}

      {category.id === 'protections' && (
        <ProtectionsContent fiches={category.fiches} />
      )}

      {category.id === 'mise-a-terre' && (
        <MiseALaTerreContent fiches={category.fiches} />
      )}

      {category.id === 'gtl-etel' && (
        <GTLContent fiches={category.fiches} />
      )}

      {category.id === 'irve' && (
        <IRVEContent fiches={category.fiches} />
      )}

      {category.id === 'communication' && (
        <CommunicationContent fiches={category.fiches} />
      )}

      {category.id === 'parafoudre' && (
        <ParafoudreContent fiches={category.fiches} />
      )}
    </div>
  )
}

// Sous-composants pour chaque type de contenu
function PiecesContent({ fiches }) {
  return (
    <div className="space-y-4">
      {fiches.map(fiche => (
        <div key={fiche.id} className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">{fiche.titre}</h3>
            {fiche.surface && (
              <span className="badge badge-primary">{fiche.surface}</span>
            )}
          </div>

          {/* Équipements */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Équipements minimum</h4>
            {fiche.equipements.map((eq, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {eq.min}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{eq.type}</p>
                  {eq.note && <p className="text-xs text-gray-500">{eq.note}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Volumes (salle de bain) */}
          {fiche.volumes && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Volumes</h4>
              {fiche.volumes.map((vol, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${
                  vol.volume === 0 ? 'bg-red-50 border border-red-200' :
                  vol.volume === 1 ? 'bg-orange-50 border border-orange-200' :
                  vol.volume === 2 ? 'bg-amber-50 border border-amber-200' :
                  'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${
                      vol.volume === 0 ? 'text-red-700' :
                      vol.volume === 1 ? 'text-orange-700' :
                      vol.volume === 2 ? 'text-amber-700' :
                      'text-green-700'
                    }`}>Volume {vol.volume}</span>
                    <span className="text-xs bg-white/50 px-2 py-0.5 rounded">{vol.ip}</span>
                  </div>
                  <p className="text-xs mt-1 text-gray-600">{vol.description}</p>
                  <p className="text-xs mt-1 font-medium">{vol.appareils}</p>
                </div>
              ))}
            </div>
          )}

          {/* Règles */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Règles importantes</h4>
            {fiche.regles.map((regle, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">{regle}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ProtectionsContent({ fiches }) {
  return (
    <div className="space-y-4">
      {fiches.map(fiche => (
        <div key={fiche.id} className="card space-y-4">
          <h3 className="font-bold text-gray-900">{fiche.titre}</h3>

          {/* Tableau sections/circuits */}
          {fiche.tableau && (
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-2 font-medium text-gray-600">Circuit</th>
                    <th className="text-center py-2 px-1 font-medium text-gray-600">Section</th>
                    <th className="text-center py-2 px-1 font-medium text-gray-600">Disj.</th>
                    <th className="text-left py-2 pl-2 font-medium text-gray-600">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fiche.tableau.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-2 pr-2">{row.circuit}</td>
                      <td className="py-2 px-1 text-center font-mono text-blue-600">{row.section}</td>
                      <td className="py-2 px-1 text-center">{row.protection}</td>
                      <td className="py-2 pl-2 text-gray-500">{row.nbPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Types DDR */}
          {fiche.types && (
            <div className="space-y-3">
              {fiche.types.map((type, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600">{type.type}</span>
                    <span className="text-xs text-gray-500">{type.sensibilite}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{type.usage}</p>
                  {type.applications && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {type.applications.map((app, i) => (
                        <span key={i} className="text-xs bg-white px-2 py-0.5 rounded border">{app}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Règles */}
          {fiche.regles && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="text-sm font-medium text-amber-800 mb-2">À retenir</h4>
              {fiche.regles.map((regle, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-amber-700 mt-1">
                  <CheckCircle size={12} className="flex-shrink-0 mt-0.5" />
                  <span>{regle}</span>
                </div>
              ))}
            </div>
          )}

          {/* AFDD */}
          {fiche.principe && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{fiche.principe}</p>
              {fiche.obligatoire && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="text-sm font-medium text-red-800">Obligatoire dans</h4>
                  {fiche.obligatoire.map((item, idx) => (
                    <p key={idx} className="text-xs text-red-700 mt-1">• {item}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function MiseALaTerreContent({ fiches }) {
  return (
    <div className="space-y-4">
      {fiches.map(fiche => (
        <div key={fiche.id} className="card space-y-4">
          <h3 className="font-bold text-gray-900">{fiche.titre}</h3>

          {/* Régimes de neutre */}
          {fiche.types && fiche.id === 'regimes-neutre' && (
            <div className="space-y-3">
              {fiche.types.map((type, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-2xl text-blue-600">{type.regime}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{type.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{type.usage}</p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-2 inline-block">
                    {type.protection}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Liaisons équipotentielles */}
          {fiche.types && fiche.id === 'liaisons-equipotentielles' && (
            <div className="space-y-3">
              {fiche.types.map((type, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${
                  type.type.includes('LEP') ? 'bg-blue-50 border border-blue-200' : 'bg-amber-50 border border-amber-200'
                }`}>
                  <div className="font-bold text-gray-900">{type.type}</div>
                  <p className="text-sm mt-1">Section : <span className="font-mono text-blue-600">{type.section}</span></p>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-600">Éléments à relier :</p>
                    {type.elements.map((el, i) => (
                      <p key={i} className="text-xs text-gray-600 ml-2">• {el}</p>
                    ))}
                  </div>
                  {type.local && (
                    <p className="text-xs text-amber-700 mt-2 font-medium">{type.local}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Méthodes prise de terre */}
          {fiche.methodes && (
            <div className="space-y-3">
              {fiche.methodes.map((methode, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-gray-900">{methode.type}</div>
                  <p className="text-sm text-gray-600 mt-1">{methode.description}</p>
                  <p className="text-xs text-blue-600 mt-1">{methode.resistance}</p>
                </div>
              ))}
              {fiche.controle && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <Info size={16} className="text-amber-600 inline mr-2" />
                  <span className="text-sm text-amber-800">{fiche.controle}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function GTLContent({ fiches }) {
  return (
    <div className="space-y-4">
      {fiches.map(fiche => (
        <div key={fiche.id} className="card space-y-4">
          <h3 className="font-bold text-gray-900">{fiche.titre}</h3>
          <p className="text-sm text-gray-600">{fiche.description}</p>

          {/* Contenu GTL */}
          {fiche.contenu && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Contenu</h4>
              {fiche.contenu.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Dimensions */}
          {fiche.dimensions && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Dimensions</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(fiche.dimensions).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-gray-600 capitalize">{key} : </span>
                    <span className="font-mono text-blue-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Règles */}
          {fiche.regles && (
            <div className="space-y-2">
              {fiche.regles.map((regle, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{regle}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function IRVEContent({ fiches }) {
  return (
    <div className="space-y-4">
      {fiches.map(fiche => (
        <div key={fiche.id} className="card space-y-4">
          <h3 className="font-bold text-gray-900">{fiche.titre}</h3>

          {/* Modes de charge */}
          {fiche.modes && (
            <div className="space-y-3">
              {fiche.modes.map((mode, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${
                  mode.mode === 'Mode 1' ? 'bg-red-50 border border-red-200' :
                  mode.mode === 'Mode 2' ? 'bg-amber-50 border border-amber-200' :
                  mode.mode === 'Mode 3' ? 'bg-green-50 border border-green-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="font-bold">{mode.mode}</div>
                  <p className="text-sm text-gray-700">{mode.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="bg-white px-2 py-0.5 rounded">{mode.puissance}</span>
                    {mode.section && <span className="bg-white px-2 py-0.5 rounded">{mode.section}</span>}
                    {mode.protection && <span className="bg-white px-2 py-0.5 rounded">{mode.protection}</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{mode.usage}</p>
                </div>
              ))}
            </div>
          )}

          {/* Règles installation */}
          {fiche.regles && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="text-sm font-medium text-amber-800 mb-2">Règles d'installation</h4>
              {fiche.regles.map((regle, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-amber-700 mt-1">
                  <CheckCircle size={12} className="flex-shrink-0 mt-0.5" />
                  <span>{regle}</span>
                </div>
              ))}
            </div>
          )}

          {/* Dimensionnement */}
          {fiche.dimensionnement && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Dimensionnement</h4>
              {Object.entries(fiche.dimensionnement).map(([key, value]) => (
                <div key={key} className="p-2 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span className="text-sm text-gray-600">{key}</span>
                  <span className="text-xs font-mono text-blue-600">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function CommunicationContent({ fiches }) {
  return (
    <div className="space-y-4">
      {fiches.map(fiche => (
        <div key={fiche.id} className="card space-y-4">
          <h3 className="font-bold text-gray-900">{fiche.titre}</h3>

          {/* Grades */}
          {fiche.grades && (
            <div className="space-y-3">
              {fiche.grades.map((grade, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${
                  grade.grade === 'Grade 2TV' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}>
                  <div className="font-bold text-gray-900">{grade.grade}</div>
                  <p className="text-sm text-gray-600 mt-1">{grade.description}</p>
                  <p className="text-xs text-blue-600 mt-1">{grade.cable}</p>
                  <p className="text-xs text-gray-500 mt-1">{grade.services}</p>
                </div>
              ))}
            </div>
          )}

          {/* Coffret communication */}
          {fiche.contenu && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Contenu du coffret</h4>
              {fiche.contenu.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Règles */}
          {fiche.regles && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              {fiche.regles.map((regle, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-amber-700 mt-1 first:mt-0">
                  <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                  <span>{regle}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ParafoudreContent({ fiches }) {
  return (
    <div className="space-y-4">
      {fiches.map(fiche => (
        <div key={fiche.id} className="card space-y-4">
          <h3 className="font-bold text-gray-900">{fiche.titre}</h3>

          {/* Zones */}
          {fiche.zones && (
            <div className="space-y-3">
              {fiche.zones.map((zone, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${
                  zone.zone === 'AQ2' ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{zone.zone}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      zone.obligation === 'Obligatoire' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'
                    }`}>{zone.obligation}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{zone.description}</p>
                </div>
              ))}
              {fiche.casObligatoires && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="text-sm font-medium text-red-800">Cas où le parafoudre est obligatoire</h4>
                  {fiche.casObligatoires.map((cas, idx) => (
                    <p key={idx} className="text-xs text-red-700 mt-1">• {cas}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Types */}
          {fiche.types && (
            <div className="space-y-3">
              {fiche.types.map((type, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600">{type.type}</span>
                    <span className="text-xs text-gray-500">{type.courant}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{type.usage}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default NormeDetail
