import { Link } from 'react-router-dom'
import { ArrowLeft, PenTool, Star, Clock, ChevronRight } from 'lucide-react'
import { schemasExercices, getAllCategories } from '../data/schemasExercices'

function SchemasExercices() {
  const categories = getAllCategories()

  const getDifficultyStars = (level) => {
    return Array(3).fill(null).map((_, i) => (
      <Star
        key={i}
        size={12}
        className={i < level ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
      />
    ))
  }

  const getCategoryIcon = (cat) => {
    const icons = {
      'tableaux': '🔌',
      'montages': '💡',
      'circuits': '🔧',
      'diagnostic': '🔍',
      'protections': '⚡'
    }
    return icons[cat] || '📋'
  }

  return (
    <div className="p-4 space-y-6">
      <Link to="/" className="flex items-center gap-2 text-blue-600">
        <ArrowLeft size={20} />
        Retour
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <PenTool size={28} />
          </div>
          <div>
            <h1 className="font-bold text-xl">Schémas à compléter</h1>
            <p className="text-pink-100 text-sm mt-1">
              Glissez-déposez les symboles pour compléter les schémas électriques
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Comment ça marche ?</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Sélectionnez un exercice ci-dessous</li>
          <li>Touchez un symbole dans la palette</li>
          <li>Touchez la zone vide où le placer</li>
          <li>Validez quand vous avez terminé</li>
        </ol>
      </div>

      {/* Exercices par catégorie */}
      {categories.map(category => {
        const exercices = schemasExercices.filter(e => e.categorie === category.id)
        if (exercices.length === 0) return null

        return (
          <div key={category.id}>
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>{getCategoryIcon(category.id)}</span>
              {category.label}
            </h2>
            <div className="space-y-3">
              {exercices.map(exercice => (
                <Link
                  key={exercice.id}
                  to={`/schemas-exercices/${exercice.id}`}
                  className="card card-hover flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                    {exercice.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{exercice.titre}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{exercice.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-0.5">
                        {getDifficultyStars(exercice.difficulte)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} />
                        {exercice.dureeEstimee}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        )
      })}

      {/* Stats */}
      <div className="card bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-pink-600">{schemasExercices.length}</div>
            <div className="text-xs text-gray-500">Exercices</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-600">{categories.length}</div>
            <div className="text-xs text-gray-500">Catégories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-600">
              {schemasExercices.reduce((acc, e) => acc + e.zonesVides.length, 0)}
            </div>
            <div className="text-xs text-gray-500">Zones</div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-2">Conseils</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-pink-500">•</span>
            Prenez le temps de lire la description avant de commencer
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-500">•</span>
            Utilisez les indices si vous êtes bloqué
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-500">•</span>
            Révisez l'explication après chaque exercice
          </li>
        </ul>
      </div>
    </div>
  )
}

export default SchemasExercices
