import { useState, useEffect } from 'react'
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react'

const DISCLAIMER_KEY = 'elecpro_disclaimer_accepted'

function DisclaimerModal() {
  const [show, setShow] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté
    const accepted = localStorage.getItem(DISCLAIMER_KEY)
    if (!accepted) {
      setShow(true)
    }
  }, [])

  const handleAccept = () => {
    if (isChecked) {
      localStorage.setItem(DISCLAIMER_KEY, 'true')
      setShow(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Bienvenue sur ElecPro</h2>
              <p className="text-blue-200 text-sm">Méthode EP - 2026</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-blue-800 leading-relaxed">
              Cette application est destinée à un <strong>usage personnel
              et pédagogique individuel</strong> pour la préparation au
              Titre Professionnel Électricien d'Équipement du Bâtiment.
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Usage libre pour les apprenants individuels</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Révision personnelle sans restriction</span>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Toute utilisation par un <strong>organisme de formation,
                établissement scolaire, ou structure commerciale</strong> est
                strictement interdite sans licence.
              </p>
            </div>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 leading-snug">
              En continuant, je confirme utiliser cette application à titre
              personnel et <strong>ne pas représenter un organisme de
              formation ou une structure commerciale</strong>.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="p-5 pt-0">
          <button
            onClick={handleAccept}
            disabled={!isChecked}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all ${
              isChecked
                ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Commencer la formation
          </button>
          <p className="text-[10px] text-gray-400 text-center mt-3">
            &copy; 2026 Emmanuel Pinglier - Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  )
}

export default DisclaimerModal
