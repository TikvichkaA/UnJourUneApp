import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Info, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react'
import { getCategoryById, getFicheById } from '../data/courantsFaibles'

// Composant pour afficher le schéma RJ45
function RJ45Diagram({ schema }) {
  const colors = {
    "blanc-orange": "#FED7AA",
    "orange": "#F97316",
    "blanc-vert": "#BBF7D0",
    "vert": "#22C55E",
    "blanc-bleu": "#BFDBFE",
    "bleu": "#3B82F6",
    "blanc-marron": "#D6D3D1",
    "marron": "#78716C"
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h4 className="font-semibold text-center mb-3">{schema.nom}</h4>
      <div className="flex justify-center">
        <svg viewBox="0 0 200 100" className="w-full max-w-xs">
          {/* Connecteur RJ45 */}
          <rect x="20" y="15" width="160" height="55" rx="4" fill="#e5e7eb" stroke="#374151" strokeWidth="2"/>
          <rect x="20" y="15" width="160" height="15" rx="4" fill="#9ca3af"/>

          {/* 8 pins */}
          {schema.couleurs.map((item, i) => (
            <g key={i}>
              <rect
                x={30 + (item.pin - 1) * 18}
                y="35"
                width="14"
                height="30"
                rx="2"
                fill={colors[item.couleur]}
                stroke="#374151"
                strokeWidth="1"
              />
              <text
                x={37 + (item.pin - 1) * 18}
                y="80"
                fontSize="10"
                textAnchor="middle"
                fill="#374151"
                fontWeight="bold"
              >
                {item.pin}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {schema.couleurs.map((item) => (
          <div key={item.pin} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: colors[item.couleur] }}
            />
            <span>Pin {item.pin}: {item.couleur}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">{schema.usage}</p>
    </div>
  )
}

// Composant pour afficher les grades VDI
function GradeCard({ grade }) {
  const bgColor = grade.obsolete
    ? 'bg-gray-100 border-gray-300'
    : grade.obligatoire
      ? 'bg-green-50 border-green-300'
      : 'bg-white border-gray-200'

  return (
    <div className={`card ${bgColor} ${grade.obsolete ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <h4 className="font-bold text-lg">{grade.grade}</h4>
        {grade.obsolete && <span className="badge bg-gray-200 text-gray-600">Obsolète</span>}
        {grade.obligatoire && <span className="badge bg-green-200 text-green-800">Obligatoire</span>}
      </div>
      <p className="text-sm text-gray-600 mt-1">{grade.description}</p>
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-700">Câble:</span>
          <span>{grade.cable}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-700">Débit:</span>
          <span className="font-bold text-blue-600">{grade.debit}</span>
        </div>
      </div>
      {grade.services && (
        <div className="mt-3">
          <span className="text-xs font-medium text-gray-500">Services:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {grade.services.map((service, i) => (
              <span key={i} className="badge bg-blue-100 text-blue-800 text-xs">
                {service}
              </span>
            ))}
          </div>
        </div>
      )}
      {grade.commentaire && (
        <p className="text-xs text-gray-500 mt-2 italic">{grade.commentaire}</p>
      )}
    </div>
  )
}

function CourantsFaiblesDetail() {
  const { categoryId } = useParams()
  const category = getCategoryById(categoryId)
  const fiche = getFicheById(categoryId)

  if (!category || !fiche) {
    return (
      <div className="p-4">
        <Link to="/courants-faibles" className="flex items-center gap-2 text-blue-600 mb-4">
          <ArrowLeft size={20} />
          Retour
        </Link>
        <div className="card text-center">
          <p className="text-gray-500">Catégorie non trouvée</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/courants-faibles" className="p-2 hover:bg-gray-100 rounded-lg">
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
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">{fiche.intro}</p>
        </div>
      </div>

      {/* Contenu spécifique selon la catégorie */}

      {/* Coffret de communication */}
      {categoryId === 'coffret-communication' && fiche.elements && (
        <>
          {/* Emplacement */}
          {fiche.emplacement && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📍</span> {fiche.emplacement.titre}
              </h3>
              <ul className="space-y-2">
                {fiche.emplacement.regles.map((regle, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{regle}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Éléments du coffret */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Composants du coffret</h3>
            {fiche.elements.map((element) => (
              <div key={element.id} className="card">
                <h4 className="font-bold text-blue-700">{element.nom}</h4>
                <p className="text-sm text-gray-600 mt-1">{element.description}</p>

                {element.role && (
                  <div className="mt-3">
                    <span className="text-xs font-medium text-gray-500">Rôle:</span>
                    <ul className="mt-1 space-y-1">
                      {(Array.isArray(element.role) ? element.role : [element.role]).map((r, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {element.conseil && (
                  <div className="mt-3 bg-amber-50 p-2 rounded-lg flex gap-2">
                    <Lightbulb size={16} className="text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-800">{element.conseil}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* VDI - Grades */}
      {categoryId === 'vdi' && fiche.grades && (
        <>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Grades de câblage</h3>
            {fiche.grades.map((grade, i) => (
              <GradeCard key={i} grade={grade} />
            ))}
          </div>

          {/* Types de câbles */}
          {fiche.typesDesCables && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Types de câbles</h3>
              {fiche.typesDesCables.map((cable) => (
                <div key={cable.type} className="card">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-700">{cable.type}</span>
                    <span className="text-sm text-gray-500">({cable.nom})</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{cable.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {cable.avantages.map((av, i) => (
                      <span key={i} className="badge bg-green-100 text-green-800 text-xs">
                        ✓ {av}
                      </span>
                    ))}
                    {cable.inconvenients.map((inc, i) => (
                      <span key={i} className="badge bg-red-100 text-red-800 text-xs">
                        ✗ {inc}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Règles d'installation */}
          {fiche.reglesInstallation && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Règles d'installation</h3>
              <ul className="space-y-2">
                {fiche.reglesInstallation.map((regle, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{regle}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* RJ45 - Schémas */}
      {categoryId === 'rj45' && fiche.schemas && (
        <>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Schémas de câblage</h3>
            {fiche.schemas.map((schema) => (
              <RJ45Diagram key={schema.id} schema={schema} />
            ))}
          </div>

          {/* Règles de câblage */}
          {fiche.reglesCablage && (
            <div className="card bg-green-50 border-green-200">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle size={18} />
                Règles de câblage
              </h3>
              <ul className="space-y-2">
                {fiche.reglesCablage.map((regle, i) => (
                  <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                    <span>•</span>
                    {regle}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Erreurs fréquentes */}
          {fiche.erreursFrequentes && (
            <div className="card bg-red-50 border-red-200">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle size={18} />
                Erreurs fréquentes
              </h3>
              <ul className="space-y-2">
                {fiche.erreursFrequentes.map((erreur, i) => (
                  <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                    <span>✗</span>
                    {erreur}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Outillage */}
          {fiche.outillage && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Outillage nécessaire</h3>
              <div className="space-y-2">
                {fiche.outillage.map((outil, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-500">🔧</span>
                    <div>
                      <span className="font-medium">{outil.nom}</span>
                      <span className="text-gray-500"> - {outil.usage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* TV Distribution */}
      {categoryId === 'tv' && fiche.composants && (
        <>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Composants</h3>
            {fiche.composants.map((comp) => (
              <div key={comp.id} className="card">
                <h4 className="font-bold text-red-700">{comp.nom}</h4>
                <p className="text-sm text-gray-600 mt-1">{comp.description}</p>

                {comp.types && (
                  <div className="mt-3">
                    <div className="grid gap-2">
                      {comp.types.map((type, i) => (
                        <div key={i} className="bg-gray-50 p-2 rounded text-sm">
                          <span className="font-medium">{type.type || type.ref}</span>
                          {type.usage && <span className="text-gray-500"> - {type.usage}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {comp.pertes && (
                  <div className="mt-3">
                    <span className="text-xs font-medium text-gray-500">Pertes typiques:</span>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {comp.pertes.map((p, i) => (
                        <div key={i} className="bg-amber-50 p-2 rounded text-center text-sm">
                          <div className="font-medium">{p.sorties} sorties</div>
                          <div className="text-amber-700">{p.perte}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {comp.conseil && (
                  <div className="mt-3 bg-amber-50 p-2 rounded-lg flex gap-2">
                    <Lightbulb size={16} className="text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-800">{comp.conseil}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Topologies */}
          {fiche.topologies && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Topologies de câblage</h3>
              {fiche.topologies.map((topo) => (
                <div key={topo.type} className="card">
                  <h4 className="font-bold">{topo.type}</h4>
                  <p className="text-sm text-gray-600 mt-1">{topo.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {topo.avantages.map((av, i) => (
                      <span key={i} className="badge bg-green-100 text-green-800 text-xs">
                        ✓ {av}
                      </span>
                    ))}
                    {topo.inconvenients.map((inc, i) => (
                      <span key={i} className="badge bg-red-100 text-red-800 text-xs">
                        ✗ {inc}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Interphonie */}
      {categoryId === 'interphonie' && fiche.types && (
        <>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Types de systèmes</h3>
            {fiche.types.map((type, i) => (
              <div key={i} className="card">
                <h4 className="font-bold text-amber-700">{type.type}</h4>
                <p className="text-sm text-gray-600 mt-1">{type.description}</p>

                {type.composants && (
                  <div className="mt-2">
                    <span className="text-xs font-medium text-gray-500">Composants:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {type.composants.map((comp, j) => (
                        <span key={j} className="badge bg-amber-100 text-amber-800 text-xs">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 text-sm">
                  <span className="font-medium">Câblage:</span> {type.cablage}
                </div>

                {type.avantages && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {type.avantages.map((av, j) => (
                      <span key={j} className="badge bg-green-100 text-green-800 text-xs">
                        ✓ {av}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Gâche électrique */}
          {fiche.gacheElectrique && (
            <div className="card bg-amber-50 border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2">Gâche électrique</h3>
              <p className="text-sm text-amber-900">{fiche.gacheElectrique.description}</p>
              <div className="mt-3 space-y-2">
                {fiche.gacheElectrique.types.map((type, i) => (
                  <div key={i} className="bg-white p-2 rounded text-sm">
                    <span className="font-medium">{type.type}:</span> {type.description}
                    <div className="text-xs text-gray-500 mt-1">Sécurité: {type.securite}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Alarme */}
      {categoryId === 'alarme' && fiche.types && (
        <>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Types de systèmes</h3>
            {fiche.types.map((type, i) => (
              <div key={i} className="card">
                <h4 className="font-bold text-rose-700">{type.type}</h4>
                <p className="text-sm text-gray-600 mt-1">{type.description}</p>

                {type.composants && (
                  <div className="mt-3 space-y-2">
                    {type.composants.map((comp, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm bg-gray-50 p-2 rounded">
                        <span className="font-medium text-rose-600">{comp.nom}</span>
                        <span className="text-gray-500">- {comp.role}</span>
                      </div>
                    ))}
                  </div>
                )}

                {type.obligations && (
                  <div className="mt-3 bg-red-100 p-2 rounded text-sm text-red-800">
                    <strong>Obligation:</strong> {type.obligations}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Technologies filaire/sans fil */}
          {fiche.technologiesFil && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Technologies</h3>

              <div className="card">
                <h4 className="font-bold text-gray-700">Filaire</h4>
                <div className="mt-2 flex flex-wrap gap-1">
                  {fiche.technologiesFil.filaire.avantages.map((av, i) => (
                    <span key={i} className="badge bg-green-100 text-green-800 text-xs">✓ {av}</span>
                  ))}
                  {fiche.technologiesFil.filaire.inconvenients.map((inc, i) => (
                    <span key={i} className="badge bg-red-100 text-red-800 text-xs">✗ {inc}</span>
                  ))}
                </div>
              </div>

              <div className="card">
                <h4 className="font-bold text-gray-700">Sans fil</h4>
                <div className="mt-2 flex flex-wrap gap-1">
                  {fiche.technologiesFil.sansFil.avantages.map((av, i) => (
                    <span key={i} className="badge bg-green-100 text-green-800 text-xs">✓ {av}</span>
                  ))}
                  {fiche.technologiesFil.sansFil.inconvenients.map((inc, i) => (
                    <span key={i} className="badge bg-red-100 text-red-800 text-xs">✗ {inc}</span>
                  ))}
                </div>
              </div>

              <div className="card bg-purple-50 border-purple-200">
                <h4 className="font-bold text-purple-700">Hybride (recommandé)</h4>
                <p className="text-sm text-purple-800 mt-1">{fiche.technologiesFil.hybride.description}</p>
              </div>
            </div>
          )}

          {/* Conseils installation */}
          {fiche.conseilsInstallation && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Conseils d'installation</h3>
              <ul className="space-y-2">
                {fiche.conseilsInstallation.map((conseil, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Lightbulb size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{conseil}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Fibre optique */}
      {categoryId === 'fibre' && fiche.composants && (
        <>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Composants FTTH</h3>
            {fiche.composants.map((comp) => (
              <div key={comp.id} className="card">
                <h4 className="font-bold text-cyan-700">{comp.nom}</h4>
                <p className="text-sm text-gray-600 mt-1">{comp.description}</p>

                {comp.role && (
                  <div className="mt-2">
                    <ul className="space-y-1">
                      {comp.role.map((r, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-cyan-500">•</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {comp.types && (
                  <div className="mt-3 grid gap-2">
                    {comp.types.map((type, i) => (
                      <div key={i} className="bg-gray-50 p-2 rounded text-sm">
                        <span className="font-medium">{type.type}</span>
                        <span className="text-gray-500"> - {type.usage}</span>
                        {type.couleur && (
                          <span className="ml-2 badge bg-gray-200 text-gray-700 text-xs">
                            Gaine {type.couleur}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {comp.precautions && (
                  <div className="mt-3 bg-red-50 p-2 rounded">
                    <span className="text-xs font-medium text-red-700">Précautions:</span>
                    <ul className="mt-1 space-y-1">
                      {comp.precautions.map((p, i) => (
                        <li key={i} className="text-xs text-red-800 flex items-start gap-1">
                          <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Rôle de l'électricien */}
          {fiche.installationInterieure && (
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">{fiche.installationInterieure.titre}</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-blue-700">Tâches:</span>
                  <ul className="mt-1 space-y-1">
                    {fiche.installationInterieure.taches.map((t, i) => (
                      <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                        <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-xs font-medium text-blue-700">Normes:</span>
                  <ul className="mt-1 space-y-1">
                    {fiche.installationInterieure.normes.map((n, i) => (
                      <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                        <span>•</span>
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Glossaire */}
          {fiche.glossaire && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Glossaire</h3>
              <div className="grid gap-2">
                {fiche.glossaire.map((item, i) => (
                  <div key={i} className="bg-gray-50 p-2 rounded text-sm">
                    <span className="font-bold text-cyan-700">{item.terme}</span>
                    <span className="text-gray-600"> - {item.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pb-4">
        <p>Conformité NF C 15-100</p>
      </div>
    </div>
  )
}

export default CourantsFaiblesDetail
