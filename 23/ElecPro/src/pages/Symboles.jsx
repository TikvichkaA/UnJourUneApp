import { Link } from 'react-router-dom'
import { ChevronRight, Shapes, CheckCircle, BookOpen } from 'lucide-react'
import { symbolesData, getSymbolesByCategory, getProgressStats, getProgress } from '../data/symboles'

const colorClasses = {
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  cyan: 'bg-cyan-500',
  gray: 'bg-gray-500'
}

function Symboles() {
  const { categories } = symbolesData
  const stats = getProgressStats()
  const progress = getProgress()

  // Calcul du nombre de symboles connus par catégorie
  const getCategoryProgress = (categoryId) => {
    const symbols = getSymbolesByCategory(categoryId)
    const known = symbols.filter(s => progress[s.id]?.known).length
    return { total: symbols.length, known }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-600 to-teal-700 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shapes size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Symboles Électriques</h2>
            <p className="text-cyan-200 text-sm mt-1">
              Flashcards NF C 15-100
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                {stats.total} symboles
              </span>
              {stats.known > 0 && (
                <span className="bg-green-400/30 px-2 py-0.5 rounded text-xs">
                  {stats.known} acquis
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress global */}
      {stats.reviewed > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progression globale</span>
            <span className="text-sm text-gray-500">
              {stats.known}/{stats.total}
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
              style={{ width: `${(stats.known / stats.total) * 100}%` }}
            />
          </div>
          {stats.toReview > 0 && (
            <p className="text-xs text-amber-600 mt-2">
              {stats.toReview} symbole(s) à revoir
            </p>
          )}
        </div>
      )}

      {/* Mode révision rapide */}
      <Link
        to="/symboles/all"
        className="card card-hover bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center gap-4"
      >
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <BookOpen size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Révision complète</h3>
          <p className="text-sm text-purple-200">Tous les symboles mélangés</p>
        </div>
        <ChevronRight size={20} />
      </Link>

      {/* Catégories */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Par catégorie</h3>

        {categories.map((category) => {
          const catProgress = getCategoryProgress(category.id)
          const progressPercent = catProgress.total > 0
            ? Math.round((catProgress.known / catProgress.total) * 100)
            : 0

          return (
            <Link
              key={category.id}
              to={`/symboles/${category.id}`}
              className="card card-hover flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${colorClasses[category.color]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{category.titre}</h4>
                  {catProgress.known === catProgress.total && catProgress.total > 0 && (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                </div>
                <p className="text-sm text-gray-500">{catProgress.total} symboles</p>
                {catProgress.known > 0 && (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{progressPercent}%</span>
                  </div>
                )}
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </Link>
          )
        })}
      </div>

      {/* Info */}
      <div className="card bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Comment ça marche ?</h4>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• Touchez une carte pour voir le symbole</li>
          <li>• Essayez de deviner son nom</li>
          <li>• Touchez pour révéler la réponse</li>
          <li>• Marquez "Je connais" ou "À revoir"</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pb-4">
        <p>Symboles conformes NF C 15-100</p>
      </div>
    </div>
  )
}

export default Symboles
