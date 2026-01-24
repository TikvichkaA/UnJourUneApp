import { Link } from 'react-router-dom'
import { ChevronRight, Wifi, Info } from 'lucide-react'
import { courantsFaiblesData } from '../data/courantsFaibles'

const colorClasses = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  cyan: 'bg-cyan-500'
}

function CourantsFaibles() {
  const { categories } = courantsFaiblesData

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Wifi size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Courants Faibles</h2>
            <p className="text-indigo-200 text-sm mt-1">
              VDI, communication, sécurité
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                {categories.length} catégories
              </span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                NF C 15-100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              <strong>Compétence CCP2 :</strong> Réaliser l'installation des réseaux de communication
              et mettre en place les équipements courants faibles.
            </p>
          </div>
        </div>
      </div>

      {/* Categories list */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Catégories</h3>

        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/courants-faibles/${category.id}`}
            className="card card-hover flex items-center gap-4"
          >
            <div className={`w-12 h-12 ${colorClasses[category.color]} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <span className="text-2xl">{category.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900">{category.titre}</h4>
              <p className="text-sm text-gray-500 line-clamp-1">{category.description}</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </Link>
        ))}
      </div>

      {/* Quick reference */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Grades de câblage VDI</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Grade</th>
                <th className="text-left py-2 pr-4">Câble</th>
                <th className="text-left py-2">Débit</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-400 line-through">Grade 1</td>
                <td className="py-2 pr-4 text-gray-400">Paire simple</td>
                <td className="py-2 text-gray-400">100 Mb/s</td>
              </tr>
              <tr className="border-b border-gray-100 bg-green-50">
                <td className="py-2 pr-4 font-medium text-green-700">Grade 2TV</td>
                <td className="py-2 pr-4">F/UTP Cat6</td>
                <td className="py-2 font-medium">1 Gb/s</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-purple-700">Grade 3TV</td>
                <td className="py-2 pr-4">F/FTP Cat6a</td>
                <td className="py-2 font-medium">10 Gb/s</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-cyan-700">Grade 4</td>
                <td className="py-2 pr-4">Fibre optique</td>
                <td className="py-2 font-medium">10+ Gb/s</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Le Grade 2TV est le minimum obligatoire en construction neuve depuis 2016.
        </p>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-gray-400 pb-4">
        <p>Réseaux VDI - Voix Données Images</p>
        <p className="mt-1">Conformité NF C 15-100 et guides UTE</p>
      </div>
    </div>
  )
}

export default CourantsFaibles
