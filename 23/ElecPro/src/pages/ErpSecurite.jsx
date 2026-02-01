import { Link } from 'react-router-dom'
import { ArrowLeft, Building2, ChevronRight } from 'lucide-react'
import { erpCategories } from '../data/erpSecurite'

const colorClasses = {
  slate: 'bg-slate-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500'
}

function ErpSecurite() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Securite ERP</h1>
          <p className="text-sm text-gray-500">Alimentation de secours</p>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Etablissements Recevant du Public</h2>
            <p className="text-orange-100 text-sm mt-1">
              Eclairage de securite, detection incendie, alimentation de secours
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">BAES</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">SSI</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">UPS</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Groupe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Categories</h3>
        {erpCategories.map((category) => (
          <Link
            key={category.id}
            to={`/erp-securite/${category.id}`}
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

      {/* Info importante */}
      <div className="card bg-red-50 border-red-200">
        <h3 className="font-semibold text-red-800 mb-2">Reglementation</h3>
        <div className="space-y-2 text-sm text-red-700">
          <p>Les ERP sont soumis au <strong>Code de la Construction</strong> et au <strong>reglement de securite</strong>.</p>
          <p>L'electricien doit connaitre les obligations selon la categorie et le type de l'etablissement.</p>
        </div>
      </div>

      {/* Rappel maintenance */}
      <div className="card bg-amber-50 border-amber-200">
        <h3 className="font-semibold text-amber-800 mb-2">Maintenance obligatoire</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• BAES : test mensuel + autonomie semestriel</li>
          <li>• SSI : verification annuelle par technicien agree</li>
          <li>• Groupe : test hebdomadaire + maintenance annuelle</li>
          <li>• Registre de securite a tenir a jour</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pb-4">
        Securite ERP - Reglementation incendie
      </div>
    </div>
  )
}

export default ErpSecurite
