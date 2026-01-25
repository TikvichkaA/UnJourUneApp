import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Info, AlertTriangle, CheckCircle, Lightbulb, Zap, Sun, Battery } from 'lucide-react'
import { getCategoryById, getFicheById } from '../data/pvIrve'

// Composant pour afficher un type de cellule PV
function CelluleCard({ cellule }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded"
          style={{ backgroundColor: cellule.couleur }}
        />
        <h4 className="font-bold">{cellule.type}</h4>
      </div>
      <p className="text-sm text-gray-600">{cellule.description}</p>
      <div className="mt-2">
        <span className="badge bg-yellow-100 text-yellow-800">
          Rendement : {cellule.rendement}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {cellule.avantages.map((av, i) => (
          <span key={i} className="badge bg-green-100 text-green-800 text-xs">
            + {av}
          </span>
        ))}
        {cellule.inconvenients.map((inc, i) => (
          <span key={i} className="badge bg-red-100 text-red-800 text-xs">
            - {inc}
          </span>
        ))}
      </div>
    </div>
  )
}

// Composant pour les modes de charge IRVE
function ModeChargeCard({ mode }) {
  const bgColor = mode.mode === 'Mode 3' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'

  return (
    <div className={`card ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-lg">{mode.mode}</h4>
        <span className="badge bg-blue-100 text-blue-800">{mode.puissance}</span>
      </div>
      <h5 className="font-medium text-gray-700">{mode.titre}</h5>
      <p className="text-sm text-gray-600 mt-1">{mode.description}</p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-500">Temps de charge</div>
          <div className="font-medium">{mode.temps}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-500">Protection</div>
          <div className="font-medium text-xs">{mode.protection}</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {mode.avantages.map((av, i) => (
          <span key={i} className="badge bg-green-100 text-green-800 text-xs">
            + {av}
          </span>
        ))}
        {mode.inconvenients.map((inc, i) => (
          <span key={i} className="badge bg-red-100 text-red-800 text-xs">
            - {inc}
          </span>
        ))}
      </div>

      {mode.conseil && (
        <div className="mt-3 bg-amber-50 p-2 rounded flex gap-2">
          <Lightbulb size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">{mode.conseil}</p>
        </div>
      )}
    </div>
  )
}

function PvIrveDetail() {
  const { categoryId } = useParams()
  const category = getCategoryById(categoryId)
  const fiche = getFicheById(categoryId)

  if (!category || !fiche) {
    return (
      <div className="p-4">
        <Link to="/pv-irve" className="flex items-center gap-2 text-blue-600 mb-4">
          <ArrowLeft size={20} />
          Retour
        </Link>
        <div className="card text-center">
          <p className="text-gray-500">Catégorie non trouvée</p>
        </div>
      </div>
    )
  }

  const isPV = categoryId.startsWith('pv-')

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/pv-irve" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h1 className="font-bold text-xl">{fiche.titre}</h1>
            <p className="text-sm text-gray-500">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className={`card ${isPV ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
        <div className="flex gap-3">
          <Info size={20} className={isPV ? 'text-yellow-600' : 'text-blue-600'} />
          <p className={`text-sm ${isPV ? 'text-yellow-800' : 'text-blue-800'}`}>{fiche.intro}</p>
        </div>
      </div>

      {/* ===== PV BASES ===== */}
      {categoryId === 'pv-bases' && (
        <>
          {/* Principe de fonctionnement */}
          {fiche.principes && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sun size={18} className="text-yellow-600" />
                {fiche.principes.titre}
              </h3>
              <ol className="space-y-2">
                {fiche.principes.etapes.map((etape, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      {i + 1}
                    </span>
                    <span>{etape}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Types de cellules */}
          {fiche.typesCellules && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Types de cellules</h3>
              {fiche.typesCellules.map((cellule) => (
                <CelluleCard key={cellule.type} cellule={cellule} />
              ))}
            </div>
          )}

          {/* Types d'installations */}
          {fiche.typesInstallations && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Types d'installations</h3>
              {fiche.typesInstallations.map((inst, i) => (
                <div key={i} className="card">
                  <h4 className="font-bold text-orange-700">{inst.type}</h4>
                  <p className="text-sm text-gray-600 mt-1">{inst.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {inst.avantages.map((av, j) => (
                      <span key={j} className="badge bg-green-100 text-green-800 text-xs">+ {av}</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>Conditions :</strong> {inst.conditions}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Unités */}
          {fiche.unites && (
            <div className="card bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">Unités utilisées</h3>
              <div className="space-y-2">
                {fiche.unites.map((u, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="font-bold text-yellow-700 min-w-20">{u.unite}</span>
                    <span className="text-gray-600">{u.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {fiche.conseil && (
            <div className="card bg-amber-50 border-amber-200">
              <div className="flex gap-2">
                <Lightbulb size={18} className="text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800">{fiche.conseil}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== PV COMPOSANTS ===== */}
      {categoryId === 'pv-composants' && fiche.composants && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Composants d'une installation</h3>
          {fiche.composants.map((comp) => (
            <div key={comp.id} className="card">
              <h4 className="font-bold text-orange-700">{comp.nom}</h4>
              <p className="text-sm text-gray-600 mt-1">{comp.description}</p>

              {comp.caracteristiques && (
                <div className="mt-3">
                  <span className="text-xs font-medium text-gray-500">Caractéristiques :</span>
                  <ul className="mt-1 space-y-1">
                    {comp.caracteristiques.map((c, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-orange-500">•</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {comp.types && (
                <div className="mt-3 space-y-2">
                  {comp.types.map((type, i) => (
                    <div key={i} className="bg-gray-50 p-2 rounded text-sm">
                      <span className="font-medium">{type.type}</span>
                      <p className="text-gray-500 text-xs">{type.description}</p>
                      <div className="mt-1 flex gap-2">
                        <span className="badge bg-green-100 text-green-800 text-xs">+ {type.avantage}</span>
                        <span className="badge bg-red-100 text-red-800 text-xs">- {type.inconvenient}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {comp.elements && (
                <div className="mt-3">
                  <span className="text-xs font-medium text-gray-500">Éléments :</span>
                  <ul className="mt-1 space-y-1">
                    {comp.elements.map((e, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {comp.norme && (
                <p className="text-xs text-blue-600 mt-2">Norme : {comp.norme}</p>
              )}

              {comp.conseil && (
                <div className="mt-3 bg-amber-50 p-2 rounded flex gap-2">
                  <Lightbulb size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">{comp.conseil}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===== PV INSTALLATION ===== */}
      {categoryId === 'pv-installation' && (
        <>
          {/* Étapes d'installation */}
          {fiche.etapesInstallation && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Étapes d'installation</h3>
              <div className="space-y-3">
                {fiche.etapesInstallation.map((etape) => (
                  <div key={etape.etape} className="flex items-start gap-3">
                    <span className="w-7 h-7 bg-yellow-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {etape.etape}
                    </span>
                    <div>
                      <span className="font-medium">{etape.titre}</span>
                      <p className="text-sm text-gray-500">{etape.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schémas de raccordement */}
          {fiche.schemasRaccordement && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Schémas de raccordement</h3>
              {fiche.schemasRaccordement.map((schema, i) => (
                <div key={i} className="card">
                  <h4 className="font-bold text-orange-700">{schema.type}</h4>
                  <p className="text-sm text-gray-600 mt-1">{schema.description}</p>
                  <ul className="mt-2 space-y-1">
                    {schema.points.map((p, j) => (
                      <li key={j} className="text-sm flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Protections */}
          {fiche.protections && (
            <div className="card bg-red-50 border-red-200">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle size={18} />
                {fiche.protections.titre}
              </h3>
              <div className="space-y-2">
                {fiche.protections.liste.map((p, i) => (
                  <div key={i} className="bg-white p-2 rounded text-sm">
                    <span className="font-medium text-red-700">{p.element}</span>
                    <span className="text-gray-600"> : {p.protection}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Normes */}
          {fiche.normes && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Normes applicables</h3>
              <div className="space-y-2">
                {fiche.normes.map((n, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="font-bold text-blue-600 min-w-32">{n.norme}</span>
                    <span className="text-gray-600">{n.objet}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conseils terrain */}
          {fiche.conseilsTerrain && (
            <div className="card bg-amber-50 border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Lightbulb size={18} />
                Conseils terrain
              </h3>
              <ul className="space-y-2">
                {fiche.conseilsTerrain.map((conseil, i) => (
                  <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                    <span>•</span>
                    {conseil}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* ===== IRVE MODES ===== */}
      {categoryId === 'irve-modes' && (
        <>
          {fiche.modes && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Les 4 modes de charge</h3>
              {fiche.modes.map((mode) => (
                <ModeChargeCard key={mode.mode} mode={mode} />
              ))}
            </div>
          )}

          {/* Tableau comparatif */}
          {fiche.tableauComparatif && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">{fiche.tableauComparatif.titre}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      {fiche.tableauComparatif.colonnes.map((col, i) => (
                        <th key={i} className="text-left py-2 px-2">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fiche.tableauComparatif.lignes.map((ligne, i) => (
                      <tr key={i} className={`border-b border-gray-100 ${i === 2 ? 'bg-green-50' : ''}`}>
                        {ligne.map((cell, j) => (
                          <td key={j} className={`py-2 px-2 ${j === 0 ? 'font-medium' : ''}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== IRVE INSTALLATION ===== */}
      {categoryId === 'irve-installation' && (
        <>
          {/* Prérequis */}
          {fiche.prerequis && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Prérequis installation</h3>
              <ul className="space-y-2">
                {fiche.prerequis.map((p, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dimensionnement */}
          {fiche.dimensionnement && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">{fiche.dimensionnement.titre}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-2 px-2">Puissance</th>
                      <th className="text-left py-2 px-2">Section</th>
                      <th className="text-left py-2 px-2">Disj.</th>
                      <th className="text-left py-2 px-2">DDR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fiche.dimensionnement.circuits.map((circuit, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2 px-2 font-medium">{circuit.puissance}</td>
                        <td className="py-2 px-2">{circuit.section}</td>
                        <td className="py-2 px-2">{circuit.protection}</td>
                        <td className="py-2 px-2 text-xs">{circuit.ddr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">{fiche.dimensionnement.note}</p>
            </div>
          )}

          {/* Protections spécifiques */}
          {fiche.protections && (
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">{fiche.protections.titre}</h3>
              <div className="space-y-3">
                {fiche.protections.elements.map((el, i) => (
                  <div key={i} className="bg-white p-3 rounded">
                    <span className="font-bold text-blue-700">{el.element}</span>
                    <p className="text-sm text-gray-600 mt-1">{el.description}</p>
                    <p className="text-xs text-blue-600 mt-1">{el.conseil}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Étapes */}
          {fiche.etapesInstallation && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Étapes d'installation</h3>
              <div className="space-y-2">
                {fiche.etapesInstallation.map((etape) => (
                  <div key={etape.etape} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {etape.etape}
                    </span>
                    <p className="text-sm">{etape.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Normes */}
          {fiche.normes && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Normes et réglementation</h3>
              <div className="space-y-2">
                {fiche.normes.map((n, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="font-bold text-blue-600 min-w-36">{n.norme}</span>
                    <span className="text-gray-600">{n.objet}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aides */}
          {fiche.aides && (
            <div className="card bg-green-50 border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">Aides disponibles</h3>
              <div className="space-y-2">
                {fiche.aides.map((aide, i) => (
                  <div key={i} className="bg-white p-2 rounded text-sm">
                    <span className="font-bold text-green-700">{aide.aide}</span>
                    <span className="text-gray-600"> - {aide.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== IRVE COLLECTIF ===== */}
      {categoryId === 'irve-collectif' && (
        <>
          {/* Droit à la prise */}
          {fiche.droitPrise && (
            <div className="card bg-purple-50 border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3">{fiche.droitPrise.titre}</h3>
              <p className="text-sm text-purple-800 mb-3">{fiche.droitPrise.description}</p>

              <h4 className="text-sm font-medium text-purple-700 mb-2">Étapes :</h4>
              <ol className="space-y-2 mb-3">
                {fiche.droitPrise.etapes.map((etape, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="w-5 h-5 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {i + 1}
                    </span>
                    {etape}
                  </li>
                ))}
              </ol>

              <h4 className="text-sm font-medium text-purple-700 mb-2">Conditions :</h4>
              <ul className="space-y-1">
                {fiche.droitPrise.conditions.map((cond, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <CheckCircle size={14} className="text-purple-500 flex-shrink-0 mt-0.5" />
                    {cond}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Types d'installation */}
          {fiche.typesInstallation && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Solutions d'installation</h3>
              {fiche.typesInstallation.map((type, i) => (
                <div key={i} className="card">
                  <h4 className="font-bold text-blue-700">{type.type}</h4>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {type.avantages.map((av, j) => (
                      <span key={j} className="badge bg-green-100 text-green-800 text-xs">+ {av}</span>
                    ))}
                    {type.inconvenients.map((inc, j) => (
                      <span key={j} className="badge bg-red-100 text-red-800 text-xs">- {inc}</span>
                    ))}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">{type.conseil}</p>
                </div>
              ))}
            </div>
          )}

          {/* Loi LOM */}
          {fiche.loiLom && (
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">{fiche.loiLom.titre}</h3>
              <p className="text-sm text-blue-700 mb-3">{fiche.loiLom.description}</p>
              <ul className="space-y-2">
                {fiche.loiLom.obligations.map((obl, i) => (
                  <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                    <Zap size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    {obl}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Conseils pratiques */}
          {fiche.conseilsPratiques && (
            <div className="card bg-amber-50 border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Lightbulb size={18} />
                Conseils pratiques
              </h3>
              <ul className="space-y-2">
                {fiche.conseilsPratiques.map((conseil, i) => (
                  <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                    <span>•</span>
                    {conseil}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pb-4">
        <p>{isPV ? 'UTE C 15-712-1' : 'NF C 15-100 §14.3'}</p>
      </div>
    </div>
  )
}

export default PvIrveDetail
