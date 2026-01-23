import { Link } from 'react-router-dom'
import { ChevronRight, FileText, Info } from 'lucide-react'
import { normes } from '../data/normes'

function Normes() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">NF C 15-100</h2>
        <p className="text-sm text-gray-500">{normes.version}</p>
      </div>

      {/* Info banner */}
      <div className="card bg-blue-50 border border-blue-200 flex items-start gap-3">
        <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800">
            La norme NF C 15-100 définit les règles d'installation électrique basse tension en France.
            Elle est composée de {normes.structure}.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {normes.categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/normes/${cat.id}`}
            className="card card-hover flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{cat.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">{cat.titre}</h3>
              <p className="text-sm text-gray-500">{cat.description}</p>
              <p className="text-xs text-emerald-600 mt-1">
                {cat.fiches.length} fiche{cat.fiches.length > 1 ? 's' : ''}
              </p>
            </div>
            <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
          </Link>
        ))}
      </div>

      {/* Quick reference */}
      <div className="card space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FileText size={18} />
          Mémo rapide - Sections de câbles
        </h3>
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-600">Circuit</th>
                <th className="text-center py-2 px-2 font-medium text-gray-600">Section</th>
                <th className="text-center py-2 pl-2 font-medium text-gray-600">Protection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4">Éclairage</td>
                <td className="py-2 px-2 text-center font-mono text-blue-600">1.5mm²</td>
                <td className="py-2 pl-2 text-center">16A</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Prises (5 max)</td>
                <td className="py-2 px-2 text-center font-mono text-blue-600">1.5mm²</td>
                <td className="py-2 pl-2 text-center">16A</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Prises (8 max)</td>
                <td className="py-2 px-2 text-center font-mono text-blue-600">2.5mm²</td>
                <td className="py-2 pl-2 text-center">20A</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Spécialisé (LV, LL...)</td>
                <td className="py-2 px-2 text-center font-mono text-blue-600">2.5mm²</td>
                <td className="py-2 pl-2 text-center">20A</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Plaque cuisson</td>
                <td className="py-2 px-2 text-center font-mono text-blue-600">6mm²</td>
                <td className="py-2 pl-2 text-center">32A</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">IRVE 7kW</td>
                <td className="py-2 px-2 text-center font-mono text-blue-600">6mm²</td>
                <td className="py-2 pl-2 text-center">32A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* DDR quick ref */}
      <div className="card space-y-4">
        <h3 className="font-semibold text-gray-900">Types de DDR</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-bold text-gray-900">Type AC</div>
            <p className="text-xs text-gray-500 mt-1">Circuits résistifs (chauffage)</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-bold text-blue-800">Type A</div>
            <p className="text-xs text-blue-600 mt-1">Lave-linge, plaques induction</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-bold text-gray-900">Type F</div>
            <p className="text-xs text-gray-500 mt-1">Climatisation inverter</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-bold text-gray-900">Type B</div>
            <p className="text-xs text-gray-500 mt-1">IRVE avec redresseur</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Rappel : Minimum 2 DDR 30mA par logement, dont 1 Type A obligatoire
        </p>
      </div>
    </div>
  )
}

export default Normes
