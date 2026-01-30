import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, CheckCircle, XCircle, AlertTriangle, Scale } from 'lucide-react'

function ConditionsUtilisation() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Conditions d'utilisation</h1>
          <p className="text-sm text-gray-500">Licence pédagogique non commerciale</p>
        </div>
      </div>

      {/* Résumé */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-blue-900">En résumé</h2>
            <p className="text-blue-800 mt-2 text-sm">
              Usage libre pour les apprenants individuels. Interdiction totale
              d'utilisation commerciale ou par des organismes de formation sans licence.
            </p>
          </div>
        </div>
      </div>

      {/* Ce qui est autorisé */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={20} className="text-green-500" />
          <h2 className="font-semibold text-gray-900">Usages autorisés</h2>
        </div>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Utilisation personnelle pour votre propre apprentissage</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Révision individuelle pour le TP Électricien Bâtiment</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Installation sur vos appareils personnels (PWA)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Recommandation de l'application à d'autres apprenants</span>
          </li>
        </ul>
      </div>

      {/* Ce qui est interdit */}
      <div className="card bg-red-50 border-red-200">
        <div className="flex items-center gap-2 mb-4">
          <XCircle size={20} className="text-red-500" />
          <h2 className="font-semibold text-red-800">Usages interdits</h2>
        </div>
        <ul className="space-y-3 text-sm text-red-700">
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">✗</span>
            <span><strong>Organismes de formation</strong> (CFA, centres de formation, AFPA, Greta, etc.)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">✗</span>
            <span><strong>Établissements scolaires</strong> utilisant l'app pour leurs formations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">✗</span>
            <span><strong>Plateformes e-learning</strong> (intégration ou reproduction)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">✗</span>
            <span><strong>Exploitation commerciale</strong> directe ou indirecte</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">✗</span>
            <span><strong>Reproduction</strong> des contenus (copier-coller, screenshots systématiques)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">✗</span>
            <span><strong>Modification ou adaptation</strong> des contenus</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">✗</span>
            <span><strong>Distribution</strong> à un groupe ou une classe</span>
          </li>
        </ul>
      </div>

      {/* Licence */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Scale size={20} className="text-gray-500" />
          <h2 className="font-semibold text-gray-900">Conditions de licence</h2>
        </div>
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            <strong>Article 1 - Droits concédés</strong><br />
            L'auteur vous accorde un droit d'usage personnel, non exclusif et
            non transférable, limité à la consultation et l'utilisation de
            l'application pour votre propre apprentissage.
          </p>
          <p>
            <strong>Article 2 - Restrictions</strong><br />
            Vous vous engagez à ne pas reproduire, modifier, distribuer, vendre,
            louer ou exploiter commercialement tout ou partie de l'application
            sans autorisation écrite préalable de l'auteur.
          </p>
          <p>
            <strong>Article 3 - Usage professionnel</strong><br />
            Toute utilisation dans un contexte professionnel de formation
            (organisme, formateur indépendant, établissement) nécessite
            l'obtention d'une licence commerciale payante.
          </p>
          <p>
            <strong>Article 4 - Propriété intellectuelle</strong><br />
            L'ensemble des contenus reste la propriété exclusive d'Emmanuel
            Pinglier. Aucun transfert de propriété n'est effectué par la
            présente licence.
          </p>
        </div>
      </div>

      {/* Avertissement */}
      <div className="card bg-amber-50 border-amber-200">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={20} className="text-amber-600" />
          <h2 className="font-semibold text-amber-800">Avertissement</h2>
        </div>
        <p className="text-sm text-amber-700">
          En utilisant cette application, vous confirmez avoir lu et accepté
          les présentes conditions. Tout manquement pourra donner lieu à des
          poursuites judiciaires conformément au Code de la propriété
          intellectuelle (articles L335-2 et suivants).
        </p>
      </div>

      {/* Besoin d'une licence */}
      <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <h2 className="font-semibold mb-2">Vous êtes un organisme de formation ?</h2>
        <p className="text-blue-100 text-sm mb-3">
          Contactez-nous pour obtenir une licence adaptée à vos besoins.
        </p>
        <p className="text-xs text-blue-200">
          Licences disponibles : mono-site, multi-sites, illimitée
        </p>
      </div>

      {/* Lien mentions */}
      <div className="text-center py-4">
        <Link
          to="/mentions-legales"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Voir les Mentions légales
        </Link>
      </div>

      {/* Signature */}
      <div className="text-center text-xs text-gray-400 pb-4 border-t border-gray-200 pt-4">
        <p className="font-medium">Méthode EP - 2026</p>
        <p className="mt-1">&copy; 2026 Emmanuel Pinglier - Tous droits réservés</p>
      </div>
    </div>
  )
}

export default ConditionsUtilisation
