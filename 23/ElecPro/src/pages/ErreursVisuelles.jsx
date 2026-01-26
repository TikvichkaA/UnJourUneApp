import { Link } from 'react-router-dom'
import { ChevronRight, Search, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { getAllErreursVisuelles } from '../data/erreursVisuelles'

const difficultyConfig = {
  1: { label: 'Facile', color: 'bg-green-100 text-green-700' },
  2: { label: 'Moyen', color: 'bg-amber-100 text-amber-700' },
  3: { label: 'Difficile', color: 'bg-red-100 text-red-700' }
}

function ErreursVisuelles() {
  const exercices = getAllErreursVisuelles()

  // Récupérer la progression
  const getProgress = () => {
    try {
      return JSON.parse(localStorage.getItem('elecpro-erreurs-visuelles') || '{}')
    } catch {
      return {}
    }
  }

  const progress = getProgress()

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Search size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Repérer les erreurs</h2>
            <p className="text-rose-100 text-sm mt-1">
              Trouvez les défauts dans les installations
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                {exercices.length} schémas
              </span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                Interactif
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="card bg-rose-50 border-rose-200">
        <div className="flex gap-3">
          <Info size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-rose-800">
              <strong>Comment jouer ?</strong> Touchez les zones qui contiennent une erreur.
              Chaque schéma contient plusieurs défauts à identifier.
            </p>
          </div>
        </div>
      </div>

      {/* Liste des exercices */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Choisissez un schéma</h3>

        {exercices.map((exercice) => {
          const difficulty = difficultyConfig[exercice.difficulte]
          const exerciceProgress = progress[exercice.id]
          const isCompleted = exerciceProgress?.completed
          const bestScore = exerciceProgress?.bestScore || 0

          return (
            <Link
              key={exercice.id}
              to={`/erreurs-visuelles/${exercice.id}`}
              className="card card-hover flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">{exercice.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{exercice.titre}</h4>
                  {isCompleted && (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{exercice.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`badge ${difficulty.color} text-xs`}>
                    {difficulty.label}
                  </span>
                  <span className="badge bg-gray-100 text-gray-600 text-xs flex items-center gap-1">
                    <Clock size={10} />
                    {exercice.dureeEstimee}
                  </span>
                  <span className="badge bg-rose-100 text-rose-700 text-xs flex items-center gap-1">
                    <AlertTriangle size={10} />
                    {exercice.nbErreurs} erreurs
                  </span>
                  {bestScore > 0 && (
                    <span className="badge bg-green-100 text-green-700 text-xs">
                      {bestScore}%
                    </span>
                  )}
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
          <li>1. Observez attentivement chaque zone du schéma</li>
          <li>2. Pensez aux règles NF C 15-100</li>
          <li>3. Vérifiez les couleurs, calibres, hauteurs...</li>
          <li>4. Touchez une zone pour voir si c'est une erreur</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pb-4">
        <p>Schémas pédagogiques interactifs</p>
        <p className="mt-1">Conformité NF C 15-100</p>
      </div>
    </div>
  )
}

export default ErreursVisuelles
