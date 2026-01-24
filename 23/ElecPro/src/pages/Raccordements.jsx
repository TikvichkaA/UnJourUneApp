import { Link } from 'react-router-dom'
import { ChevronRight, Cable, Star, Lock, CheckCircle, Trophy } from 'lucide-react'
import { raccordementsData, getCircuitById } from '../data/raccordements'

const difficultyStars = (level) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={12}
      className={i < level ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
    />
  ))
}

const difficultyColors = {
  1: 'bg-green-500',
  2: 'bg-emerald-500',
  3: 'bg-amber-500',
  4: 'bg-orange-500',
  5: 'bg-red-500'
}

function Raccordements() {
  const { circuits } = raccordementsData

  // Get saved progress from localStorage
  const getProgress = () => {
    try {
      return JSON.parse(localStorage.getItem('elecpro-raccordements') || '{}')
    } catch {
      return {}
    }
  }

  const progress = getProgress()

  // Count completed circuits
  const completedCount = Object.values(progress).filter(p => p.completed).length
  const totalCircuits = circuits.length

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Cable size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Raccordements Pratiques</h2>
            <p className="text-orange-200 text-sm mt-1">
              Apprenez le câblage en pratique
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                {totalCircuits} circuits
              </span>
              {completedCount > 0 && (
                <span className="bg-green-400/30 px-2 py-0.5 rounded text-xs">
                  {completedCount} réussis
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      {completedCount > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progression</span>
            <span className="text-sm text-gray-500">
              {completedCount}/{totalCircuits}
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
              style={{ width: `${(completedCount / totalCircuits) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Circuits list */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Circuits à maîtriser</h3>

        {circuits.map((circuit, index) => {
          const circuitProgress = progress[circuit.id]
          const isCompleted = circuitProgress?.completed
          const bestScore = circuitProgress?.bestScore

          return (
            <Link
              key={circuit.id}
              to={`/raccordements/${circuit.id}`}
              className="card card-hover flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${difficultyColors[circuit.difficulte]} rounded-xl flex items-center justify-center flex-shrink-0 relative`}>
                <span className="text-white font-bold text-lg">{index + 1}</span>
                {isCompleted && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{circuit.titre}</h4>
                </div>
                <p className="text-sm text-gray-500 truncate">{circuit.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-0.5">
                    {difficultyStars(circuit.difficulte)}
                  </div>
                  {bestScore !== undefined && (
                    <span className="text-xs text-amber-600 font-medium">
                      Record: {bestScore}%
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </Link>
          )
        })}
      </div>

      {/* Légende difficulté */}
      <div className="card bg-gray-50">
        <h4 className="font-semibold text-gray-800 mb-3">Niveaux de difficulté</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">{difficultyStars(1)}</div>
            <span className="text-gray-600">Débutant - Circuit simple</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">{difficultyStars(2)}</div>
            <span className="text-gray-600">Facile - Plusieurs points</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">{difficultyStars(3)}</div>
            <span className="text-gray-600">Intermédiaire - Commandes spéciales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">{difficultyStars(4)}</div>
            <span className="text-gray-600">Avancé - Appareils modulaires</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">{difficultyStars(5)}</div>
            <span className="text-gray-600">Expert - Circuits complexes</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="card bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Comment jouer ?</h4>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>1. Sélectionnez une couleur de fil</li>
          <li>2. Touchez une borne de départ</li>
          <li>3. Touchez la borne d'arrivée</li>
          <li>4. Validez quand vous avez terminé</li>
          <li>5. Utilisez les indices si besoin (-10 pts)</li>
        </ul>
      </div>

      {/* Color legend */}
      <div className="card">
        <h4 className="font-semibold text-gray-800 mb-3">Code couleur des fils</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 bg-red-500 rounded"></div>
            <span>Phase (L)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 bg-blue-500 rounded"></div>
            <span>Neutre (N)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 rounded" style={{ background: 'repeating-linear-gradient(90deg, #22c55e 0px, #22c55e 4px, #eab308 4px, #eab308 8px)' }}></div>
            <span>Terre (PE)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 bg-orange-500 rounded"></div>
            <span>Retour lampe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 bg-purple-500 rounded"></div>
            <span>Navette 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 bg-violet-400 rounded"></div>
            <span>Navette 2</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pb-4">
        <p>Schémas conformes NF C 15-100</p>
      </div>
    </div>
  )
}

export default Raccordements
