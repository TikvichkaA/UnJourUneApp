import { Link } from 'react-router-dom'
import { ArrowLeft, Cog, ChevronRight } from 'lucide-react'
import { moteursCategories } from '../data/moteurs'

const colorClasses = {
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  purple: 'bg-purple-500',
  cyan: 'bg-cyan-500',
  green: 'bg-green-500',
  red: 'bg-red-500'
}

function Moteurs() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Moteurs electriques</h1>
          <p className="text-sm text-gray-500">Theorie et pratique</p>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Cog size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Moteurs asynchrones</h2>
            <p className="text-purple-200 text-sm mt-1">
              Fonctionnement, couplages, demarrage et protection des moteurs electriques
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Monophase</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Triphase</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Variateur</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Categories</h3>
        {moteursCategories.map((category) => (
          <Link
            key={category.id}
            to={`/moteurs/${category.id}`}
            className="card card-hover flex items-center gap-4"
          >
            <div className={`w-12 h-12 ${colorClasses[category.color]} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <span className="text-2xl">{category.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900">{category.nom}</h4>
              <p className="text-sm text-gray-500">{category.description}</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </Link>
        ))}
      </div>

      {/* Info */}
      <div className="card bg-amber-50 border-amber-200">
        <h3 className="font-semibold text-amber-800 mb-2">Formules essentielles</h3>
        <div className="space-y-2 text-sm text-amber-700">
          <p><strong>Vitesse synchrone:</strong> Ns = 60f/p (f=50Hz, p=paires de poles)</p>
          <p><strong>Glissement:</strong> g = (Ns - N) / Ns</p>
          <p><strong>Puissance:</strong> P = √3 × U × I × cos(φ) × η</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pb-4">
        Moteurs asynchrones - Formation electricien
      </div>
    </div>
  )
}

export default Moteurs
