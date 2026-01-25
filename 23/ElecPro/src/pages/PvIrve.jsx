import { Link } from 'react-router-dom'
import { ChevronRight, Sun, Info, Zap, Battery } from 'lucide-react'
import { pvIrveData } from '../data/pvIrve'

const colorClasses = {
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500'
}

function PvIrve() {
  const { categories } = pvIrveData
  const pvCategories = categories.filter(c => c.id.startsWith('pv-'))
  const irveCategories = categories.filter(c => c.id.startsWith('irve-'))

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sun size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">PV & IRVE</h2>
            <p className="text-yellow-100 text-sm mt-1">
              Photovoltaïque et bornes de recharge
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                {pvCategories.length} fiches PV
              </span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                {irveCategories.length} fiches IRVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="card bg-amber-50 border-amber-200">
        <div className="flex gap-3">
          <Info size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800">
              <strong>Secteurs en croissance :</strong> L'électricien d'aujourd'hui doit maîtriser
              les installations photovoltaïques et les bornes de recharge pour véhicules électriques.
            </p>
          </div>
        </div>
      </div>

      {/* Section PV */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sun size={20} className="text-yellow-600" />
          <h3 className="font-semibold text-gray-900">Photovoltaïque</h3>
        </div>

        {pvCategories.map((category) => (
          <Link
            key={category.id}
            to={`/pv-irve/${category.id}`}
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

      {/* Section IRVE */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-blue-600" />
          <h3 className="font-semibold text-gray-900">IRVE - Bornes de recharge</h3>
        </div>

        {irveCategories.map((category) => (
          <Link
            key={category.id}
            to={`/pv-irve/${category.id}`}
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

      {/* Résumé rapide PV */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Sun size={18} className="text-yellow-600" />
          Rendement moyen par région
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-yellow-50 p-2 rounded">
            <div className="font-bold text-yellow-700">Sud</div>
            <div className="text-gray-600">1200-1400 kWh/kWc</div>
          </div>
          <div className="bg-orange-50 p-2 rounded">
            <div className="font-bold text-orange-700">Centre</div>
            <div className="text-gray-600">1000-1200 kWh/kWc</div>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <div className="font-bold text-blue-700">Nord</div>
            <div className="text-gray-600">900-1000 kWh/kWc</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="font-bold text-green-700">Ouest</div>
            <div className="text-gray-600">1000-1150 kWh/kWc</div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Production annuelle moyenne par kWc installé
        </p>
      </div>

      {/* Résumé rapide IRVE */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Battery size={18} className="text-green-600" />
          Temps de charge selon puissance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Puissance</th>
                <th className="text-left py-2 pr-4">Mode</th>
                <th className="text-left py-2">50 kWh</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">2.3 kW</td>
                <td className="py-2 pr-4 text-gray-500">Mode 1</td>
                <td className="py-2">~22h</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">7.4 kW</td>
                <td className="py-2 pr-4 text-gray-500">Mode 3</td>
                <td className="py-2 font-medium text-blue-600">~7h</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">22 kW</td>
                <td className="py-2 pr-4 text-gray-500">Mode 3 tri</td>
                <td className="py-2 font-medium text-green-600">~2h30</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">50 kW</td>
                <td className="py-2 pr-4 text-gray-500">Mode 4</td>
                <td className="py-2 font-medium text-purple-600">~1h</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Qualifications */}
      <div className="card bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Qualifications requises</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <span className="badge bg-yellow-200 text-yellow-800">PV</span>
            <span className="text-blue-800">QualiPV ou équivalent pour installations raccordées au réseau</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="badge bg-green-200 text-green-800">IRVE</span>
            <span className="text-blue-800">Qualification IRVE obligatoire pour puissance &gt; 3.7 kW</span>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-gray-400 pb-4">
        <p>Énergies renouvelables et mobilité électrique</p>
        <p className="mt-1">UTE C 15-712-1 / NF C 15-100 §14.3</p>
      </div>
    </div>
  )
}

export default PvIrve
