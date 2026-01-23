import { Link } from 'react-router-dom'
import { ChevronRight, Clock, CheckCircle, BookOpen, Briefcase } from 'lucide-react'
import { referentiel } from '../data/referentiel'

function Referentiel() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Référentiel de formation</h2>
        <p className="text-sm text-gray-500">{referentiel.code} - Niveau {referentiel.niveau}</p>
      </div>

      {/* CCP Cards */}
      <div className="space-y-4">
        {referentiel.ccps.map((ccp, index) => (
          <div key={ccp.id} className="card space-y-4">
            {/* CCP Header */}
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                index === 0 ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <span className="font-bold">C{index + 1}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 leading-tight">{ccp.titre}</h3>
                <p className="text-xs text-gray-500 mt-1">{ccp.code}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600">{ccp.description}</p>

            {/* Durée épreuve */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={16} />
              <span>Durée épreuve : {ccp.dureeEpreuve}</span>
            </div>

            {/* Compétences list */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Compétences ({ccp.competences.length})</h4>
              <div className="space-y-2">
                {ccp.competences.map((comp) => (
                  <Link
                    key={comp.id}
                    to={`/referentiel/${comp.id}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors active:scale-[0.99]"
                  >
                    <CheckCircle size={18} className={index === 0 ? 'text-blue-500' : 'text-emerald-500'} />
                    <span className="flex-1 text-sm text-gray-700 line-clamp-2">{comp.titre}</span>
                    <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modalités d'évaluation */}
      <div className="card space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen size={18} />
          Modalités d'évaluation
        </h3>

        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 text-sm">Mise en situation professionnelle</h4>
            <div className="mt-2 space-y-1 text-xs text-blue-700">
              <p>• Partie 1 : {referentiel.modalitesEvaluation.miseEnSituation.partie1.duree}</p>
              <p className="pl-3 text-blue-600">{referentiel.modalitesEvaluation.miseEnSituation.partie1.description}</p>
              <p>• Partie 2 : {referentiel.modalitesEvaluation.miseEnSituation.partie2.duree}</p>
              <p className="pl-3 text-blue-600">{referentiel.modalitesEvaluation.miseEnSituation.partie2.description}</p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 text-sm">Questionnaire professionnel</h4>
            <p className="text-xs text-gray-600 mt-1">{referentiel.modalitesEvaluation.questionnaireQCM}</p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 text-sm">Entretien final</h4>
            <p className="text-xs text-gray-600 mt-1">{referentiel.modalitesEvaluation.entretienFinal}</p>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-medium text-amber-800 text-sm">Tenue exigée</h4>
            <p className="text-xs text-amber-700 mt-1">{referentiel.modalitesEvaluation.tenueExigee}</p>
          </div>
        </div>
      </div>

      {/* Emplois accessibles */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Briefcase size={18} />
          Emplois accessibles
        </h3>
        <div className="flex flex-wrap gap-2">
          {referentiel.emploisAccessibles.map(emploi => (
            <span key={emploi} className="badge badge-primary">
              {emploi}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Referentiel
