import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, AlertTriangle, Clock, Target, Shield, BookOpen } from 'lucide-react'
import { habilitations } from '../data/habilitations'

function HabilitationDetail() {
  const { habId } = useParams()
  const hab = habilitations.niveaux.find(h => h.id === habId)

  if (!hab) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Habilitation non trouvée</p>
        <Link to="/habilitations" className="text-blue-600 mt-2 inline-block">Retour aux habilitations</Link>
      </div>
    )
  }

  const isHT = hab.symbole.startsWith('H')
  const colorScheme = isHT
    ? { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', badge: 'bg-red-100 text-red-800', icon: 'text-red-500', cardBg: 'bg-red-100' }
    : { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', badge: 'bg-blue-100 text-blue-800', icon: 'text-blue-500', cardBg: 'bg-blue-100' }

  return (
    <div className="p-4 space-y-4">
      {/* Back button */}
      <Link
        to="/habilitations"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        <span>Habilitations</span>
      </Link>

      {/* Header */}
      <div className={`card ${colorScheme.bg} ${colorScheme.border} border`}>
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 ${colorScheme.cardBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <span className={`font-bold text-2xl ${colorScheme.text}`}>{hab.symbole}</span>
          </div>
          <div>
            <h2 className={`font-bold text-lg ${colorScheme.text}`}>{hab.titre}</h2>
            <p className="text-sm text-gray-600 mt-1">{hab.description}</p>
          </div>
        </div>
      </div>

      {/* Infos rapides */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <Clock size={20} className="mx-auto text-gray-400 mb-1" />
          <div className="text-sm font-medium">{hab.dureeFormation}</div>
          <div className="text-xs text-gray-500">Formation</div>
        </div>
        <div className="card text-center">
          <Shield size={20} className={`mx-auto mb-1 ${hab.tpElectricien ? 'text-green-500' : 'text-gray-400'}`} />
          <div className="text-sm font-medium">{hab.tpElectricien ? 'Requis TP' : 'Non requis'}</div>
          <div className="text-xs text-gray-500">TP Électricien</div>
        </div>
      </div>

      {/* Activités */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Target size={18} className={colorScheme.icon} />
          Activités autorisées
        </h3>
        <ul className="space-y-2">
          {hab.activites.map((activite, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <CheckCircle size={16} className={`${colorScheme.icon} flex-shrink-0 mt-0.5`} />
              <span className="text-gray-700">{activite}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Compétences */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen size={18} className="text-purple-500" />
          Compétences requises
        </h3>
        <ul className="space-y-2">
          {hab.competences.map((comp, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                {idx + 1}
              </div>
              <span className="text-gray-700">{comp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Prérequis */}
      <div className="card space-y-2">
        <h3 className="font-semibold text-gray-900">Prérequis</h3>
        <p className="text-sm text-gray-600">{hab.prerequis}</p>
      </div>

      {/* Limites */}
      {hab.limites && (
        <div className="card space-y-2 bg-amber-50 border border-amber-200">
          <h3 className="font-semibold text-amber-800 flex items-center gap-2">
            <AlertTriangle size={18} />
            Limites d'intervention
          </h3>
          <p className="text-sm text-amber-700">{hab.limites}</p>
        </div>
      )}

      {/* Attributs possibles */}
      {hab.attributPossible && hab.attributPossible.length > 0 && (
        <div className="card space-y-2">
          <h3 className="font-semibold text-gray-900">Attributs possibles</h3>
          <div className="flex flex-wrap gap-2">
            {hab.attributPossible.map(attr => (
              <span key={attr} className="badge bg-gray-100 text-gray-700">
                {hab.symbole}{attr}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Les attributs étendent les prérogatives de l'habilitation de base.
          </p>
        </div>
      )}

      {/* Symboles (pour BE) */}
      {hab.attributs && (
        <div className="card space-y-3">
          <h3 className="font-semibold text-gray-900">Opérations spécifiques</h3>
          <div className="space-y-2">
            {hab.attributs.map((attr, idx) => (
              <div key={idx} className="p-2 bg-gray-50 rounded-lg flex items-center gap-3">
                <span className={`font-bold ${colorScheme.text}`}>BE {attr.code}</span>
                <span className="text-sm text-gray-600">{attr.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Décodage du symbole */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-gray-900">Décodage du symbole</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <span className={`w-8 h-8 ${colorScheme.cardBg} rounded flex items-center justify-center font-bold ${colorScheme.text}`}>
              {hab.symbole.charAt(0)}
            </span>
            <span className="text-gray-600">
              {hab.symbole.charAt(0) === 'B' ? 'Basse Tension (BT) et Très Basse Tension (TBT)' : 'Haute Tension (HTA et HTB)'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-700">
              {hab.symbole.charAt(1)}
            </span>
            <span className="text-gray-600">
              {habilitations.symboles.deuxieme[hab.symbole.charAt(1)] || 'Attribut spécial'}
            </span>
          </div>
          {hab.symbole.length > 2 && (
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center font-bold text-amber-700">
                {hab.symbole.substring(2)}
              </span>
              <span className="text-gray-600">
                {habilitations.symboles.attributs[hab.symbole.substring(2)] || 'Attribut spécifique'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quiz link */}
      <Link
        to="/quiz/habilitations"
        className="card card-hover flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white"
      >
        <span className="font-medium">Tester mes connaissances</span>
        <span className="text-amber-200">→</span>
      </Link>
    </div>
  )
}

export default HabilitationDetail
