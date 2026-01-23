import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, AlertTriangle, Target, Key, ListChecks } from 'lucide-react'
import { referentiel } from '../data/referentiel'

function CompetenceDetail() {
  const { competenceId } = useParams()

  // Trouver la compétence
  let competence = null
  let ccpIndex = 0

  for (let i = 0; i < referentiel.ccps.length; i++) {
    const found = referentiel.ccps[i].competences.find(c => c.id === competenceId)
    if (found) {
      competence = found
      ccpIndex = i
      break
    }
  }

  if (!competence) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Compétence non trouvée</p>
        <Link to="/referentiel" className="text-blue-600 mt-2 inline-block">Retour au référentiel</Link>
      </div>
    )
  }

  const colorScheme = ccpIndex === 0
    ? { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', badge: 'bg-blue-100 text-blue-800', icon: 'text-blue-500' }
    : { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', badge: 'bg-emerald-100 text-emerald-800', icon: 'text-emerald-500' }

  return (
    <div className="p-4 space-y-4">
      {/* Back button */}
      <Link
        to="/referentiel"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        <span>Référentiel</span>
      </Link>

      {/* Header */}
      <div className={`card ${colorScheme.bg} ${colorScheme.border} border`}>
        <span className={`badge ${colorScheme.badge} mb-2`}>
          CCP{ccpIndex + 1} - {competence.id.toUpperCase()}
        </span>
        <h2 className={`font-bold text-lg ${colorScheme.text}`}>{competence.titre}</h2>
        <p className="text-sm text-gray-600 mt-2">{competence.description}</p>
      </div>

      {/* Activités */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <ListChecks size={18} className={colorScheme.icon} />
          Activités
        </h3>
        <ul className="space-y-2">
          {competence.activites.map((activite, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <CheckCircle size={16} className={`${colorScheme.icon} flex-shrink-0 mt-0.5`} />
              <span className="text-gray-700">{activite}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Critères du jury */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Target size={18} className="text-purple-500" />
          Critères évalués par le jury
        </h3>
        <ul className="space-y-2">
          {competence.criteresJury.map((critere, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                {idx + 1}
              </div>
              <span className="text-gray-700">{critere}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Erreurs fréquentes */}
      <div className="card space-y-3 bg-red-50 border border-red-200">
        <h3 className="font-semibold text-red-800 flex items-center gap-2">
          <AlertTriangle size={18} />
          Erreurs fréquentes à éviter
        </h3>
        <ul className="space-y-2">
          {competence.erreursFrequentes.map((erreur, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <span className="text-red-500 flex-shrink-0">✗</span>
              <span className="text-red-700">{erreur}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Points clés */}
      <div className="card space-y-3 bg-amber-50 border border-amber-200">
        <h3 className="font-semibold text-amber-800 flex items-center gap-2">
          <Key size={18} />
          Points clés à retenir
        </h3>
        <ul className="space-y-2">
          {competence.pointsCles.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <span className="text-amber-600 flex-shrink-0">★</span>
              <span className="text-amber-800">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quiz rapide */}
      <Link
        to={`/quiz/pratique`}
        className="card card-hover flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white"
      >
        <span className="font-medium">Tester mes connaissances</span>
        <span className="text-purple-200">→</span>
      </Link>
    </div>
  )
}

export default CompetenceDetail
