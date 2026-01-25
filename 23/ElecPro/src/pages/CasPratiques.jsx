import { Link } from 'react-router-dom'
import { ChevronRight, Wrench, Clock, BarChart2, Info } from 'lucide-react'
import { getAllCasPratiques } from '../data/casPratiques'

const difficultyColors = {
  1: { bg: 'bg-green-100', text: 'text-green-700', label: 'Facile' },
  2: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Moyen' },
  3: { bg: 'bg-red-100', text: 'text-red-700', label: 'Difficile' }
}

function CasPratiques() {
  const casPratiques = getAllCasPratiques()

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Wrench size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Cas Pratiques</h2>
            <p className="text-teal-100 text-sm mt-1">
              Scénarios de diagnostic terrain
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                {casPratiques.length} scénarios
              </span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                Interactif
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="card bg-teal-50 border-teal-200">
        <div className="flex gap-3">
          <Info size={20} className="text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-teal-800">
              <strong>Apprenez par la pratique !</strong> Chaque cas vous met en situation réelle
              de dépannage. Analysez, diagnostiquez et résolvez étape par étape.
            </p>
          </div>
        </div>
      </div>

      {/* Liste des cas */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Choisissez un scénario</h3>

        {casPratiques.map((cas) => {
          const difficulty = difficultyColors[cas.difficulte]
          return (
            <Link
              key={cas.id}
              to={`/cas-pratiques/${cas.id}`}
              className="card card-hover flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">{cas.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900">{cas.titre}</h4>
                <p className="text-sm text-gray-500 line-clamp-1">{cas.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`badge ${difficulty.bg} ${difficulty.text} text-xs`}>
                    {difficulty.label}
                  </span>
                  <span className="badge bg-gray-100 text-gray-600 text-xs flex items-center gap-1">
                    <Clock size={10} />
                    {cas.duree}
                  </span>
                  <span className="badge bg-gray-100 text-gray-600 text-xs">
                    {cas.etapes.length} étapes
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </Link>
          )
        })}
      </div>

      {/* Conseils */}
      <div className="card bg-amber-50 border-amber-200">
        <h4 className="font-semibold text-amber-800 mb-2">Conseils</h4>
        <ul className="space-y-1 text-sm text-amber-700">
          <li>1. Lisez attentivement le contexte de chaque étape</li>
          <li>2. Réfléchissez avant de choisir une réponse</li>
          <li>3. Utilisez les indices si vous bloquez</li>
          <li>4. Lisez les explications pour apprendre de vos erreurs</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pb-4">
        <p>Diagnostic et dépannage électrique</p>
        <p className="mt-1">Situations inspirées du terrain</p>
      </div>
    </div>
  )
}

export default CasPratiques
