import { Link } from 'react-router-dom'
import { Brain, ChevronRight, Shuffle, Trophy } from 'lucide-react'
import { quizData } from '../data/quiz'

const categoryColors = {
  blue: 'from-blue-500 to-blue-600',
  amber: 'from-amber-500 to-amber-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600'
}

function Quiz() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Quiz & Entraînement</h2>
        <p className="text-sm text-gray-500">Testez vos connaissances</p>
      </div>

      {/* Mixed quiz - highlighted */}
      <Link
        to="/quiz/mix"
        className="card card-hover bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center gap-4"
      >
        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Shuffle size={28} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">Quiz mixte</h3>
          <p className="text-indigo-200 text-sm">20 questions de toutes catégories</p>
        </div>
        <ChevronRight size={24} className="text-white/60" />
      </Link>

      {/* Category quizzes */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Brain size={18} />
          Par catégorie
        </h3>
        <div className="space-y-3">
          {quizData.categories.map((cat) => {
            const questionCount = quizData.questions.filter(q => q.category === cat.id).length
            return (
              <Link
                key={cat.id}
                to={`/quiz/${cat.id}`}
                className="card card-hover flex items-center gap-4"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${categoryColors[cat.color]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">{cat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900">{cat.titre}</h4>
                  <p className="text-sm text-gray-500">{cat.description}</p>
                  <p className="text-xs text-blue-600 mt-1">{questionCount} questions disponibles</p>
                </div>
                <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="card bg-amber-50 border border-amber-200">
        <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
          <Trophy size={18} />
          Conseils pour le QCM du TP
        </h3>
        <ul className="space-y-2 text-sm text-amber-700">
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span>
            <span>Lisez attentivement chaque question avant de répondre</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span>
            <span>Attention aux unités (mm², A, V, m)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span>
            <span>En cas de doute, éliminez d'abord les réponses impossibles</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span>
            <span>Mémorisez les valeurs clés (sections, calibres, distances)</span>
          </li>
        </ul>
      </div>

      {/* Stats placeholder */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Progression</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all" />
            </div>
          </div>
          <span className="text-sm text-gray-500">0%</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Répondez aux quiz pour suivre votre progression
        </p>
      </div>
    </div>
  )
}

export default Quiz
