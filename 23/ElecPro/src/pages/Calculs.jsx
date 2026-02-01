import { Link } from 'react-router-dom'
import { ArrowLeft, Calculator, ChevronRight, Star } from 'lucide-react'
import { categories, getCalculsByCategorie } from '../data/calculs'

function Calculs() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Exercices de calcul</h1>
          <p className="text-sm text-gray-500">Formules et applications</p>
        </div>
      </div>

      {/* Introduction */}
      <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calculator className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Calculatrice interactive</h3>
            <p className="text-sm text-gray-600 mt-1">
              Entrainez-vous aux calculs essentiels de l'electricien.
              Chaque exercice explique la formule et valide vos resultats.
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((categorie) => {
          const exercices = getCalculsByCategorie(categorie.id)
          return (
            <div key={categorie.id} className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span>{categorie.icon}</span>
                {categorie.nom}
              </h2>
              <p className="text-sm text-gray-500 mb-2">{categorie.description}</p>

              <div className="space-y-2">
                {exercices.map((exercice) => (
                  <Link
                    key={exercice.id}
                    to={`/calculs/${exercice.id}`}
                    className="card flex items-center gap-3 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{exercice.titre}</h3>
                      <p className="text-sm text-gray-500">{exercice.formule}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(3)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < exercice.difficulte ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calculs
