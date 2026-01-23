import { Link } from 'react-router-dom'
import { ChevronRight, Shield, AlertTriangle, Zap, Info } from 'lucide-react'
import { habilitations } from '../data/habilitations'

function Habilitations() {
  // Filtrer les habilitations requises pour le TP
  const habilitationsTP = habilitations.niveaux.filter(h => h.tpElectricien)
  const autresHabilitations = habilitations.niveaux.filter(h => !h.tpElectricien)

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Habilitations électriques</h2>
        <p className="text-sm text-gray-500">UTE C18-510 / NF C18-510</p>
      </div>

      {/* Domaines de tension */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Zap size={18} />
          Domaines de tension
        </h3>
        <div className="space-y-2">
          {habilitations.domainesTension.map((domaine) => (
            <div
              key={domaine.domaine}
              className={`p-3 rounded-lg border ${
                domaine.domaine === 'TBT' ? 'bg-green-50 border-green-200' :
                domaine.domaine === 'BT' ? 'bg-blue-50 border-blue-200' :
                'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{domaine.domaine}</span>
                {domaine.symbole && (
                  <span className="text-xs bg-white px-2 py-0.5 rounded border">{domaine.symbole}</span>
                )}
              </div>
              <p className="text-sm font-medium mt-1">{domaine.nom}</p>
              <div className="text-xs mt-1 text-gray-600">
                <span>AC: {domaine.limites.alternatif}</span>
                <span className="mx-2">|</span>
                <span>DC: {domaine.limites.continu}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habilitations requises TP */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Shield size={18} className="text-blue-500" />
          Habilitations pour le TP Électricien
        </h3>
        <div className="card bg-blue-50 border border-blue-200 mb-2">
          <p className="text-sm text-blue-800">
            Le référentiel RNCP36441 exige les habilitations <strong>B1(V), BR et H0</strong>
          </p>
        </div>
        <div className="space-y-3">
          {habilitationsTP.map((hab) => (
            <Link
              key={hab.id}
              to={`/habilitations/${hab.id}`}
              className="card card-hover flex items-center gap-4"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg ${
                hab.symbole.startsWith('H') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {hab.symbole}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900">{hab.titre}</h4>
                <p className="text-sm text-gray-500 line-clamp-1">{hab.description}</p>
                <p className="text-xs text-blue-600 mt-1">Formation : {hab.dureeFormation}</p>
              </div>
              <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Autres habilitations */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Autres habilitations</h3>
        <div className="space-y-2">
          {autresHabilitations.map((hab) => (
            <Link
              key={hab.id}
              to={`/habilitations/${hab.id}`}
              className="card card-hover flex items-center gap-3"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 font-bold ${
                hab.symbole.startsWith('H') ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {hab.symbole}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm">{hab.titre}</h4>
                <p className="text-xs text-gray-500 line-clamp-1">{hab.description}</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Distances de sécurité */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-500" />
          Distances de sécurité
        </h3>
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-2 font-medium text-gray-600">Domaine</th>
                <th className="text-center py-2 px-2 font-medium text-gray-600">DMA</th>
                <th className="text-center py-2 pl-2 font-medium text-gray-600">DLVS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-2 font-medium text-blue-600">BT</td>
                <td className="py-2 px-2 text-center">0.30m</td>
                <td className="py-2 pl-2 text-center">0.30m</td>
              </tr>
              <tr>
                <td className="py-2 pr-2 font-medium text-red-600">HTA</td>
                <td className="py-2 px-2 text-center">0.60m</td>
                <td className="py-2 pl-2 text-center">2m</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500">
          DMA = Distance Minimale d'Approche<br />
          DLVS = Distance Limite de Voisinage Simple
        </p>
      </div>

      {/* Conduite en cas d'accident */}
      <div className="card space-y-3 bg-red-50 border border-red-200">
        <h3 className="font-semibold text-red-800 flex items-center gap-2">
          <Info size={18} />
          Conduite en cas d'accident électrique
        </h3>
        <div className="space-y-2">
          {habilitations.accidentElectrique.conduite.map((etape, idx) => (
            <div key={idx} className="p-3 bg-white rounded-lg">
              <div className="font-bold text-red-700">{idx + 1}. {etape.etape}</div>
              <ul className="text-xs text-red-600 mt-1 space-y-0.5">
                {etape.actions.map((action, i) => (
                  <li key={i}>• {action}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-sm font-medium text-red-700 text-center">
          Numéros d'urgence : 15 (SAMU) - 18 (Pompiers) - 112 (Européen)
        </p>
      </div>
    </div>
  )
}

export default Habilitations
