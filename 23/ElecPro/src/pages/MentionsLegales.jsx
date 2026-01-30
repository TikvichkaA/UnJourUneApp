import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Scale, User, Mail } from 'lucide-react'

function MentionsLegales() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mentions Légales</h1>
          <p className="text-sm text-gray-500">Informations juridiques</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-blue-900">Droits d'auteur</h2>
            <p className="text-blue-800 mt-2 font-medium">
              &copy; 2026 Emmanuel Pinglier - Tous droits réservés.
            </p>
          </div>
        </div>
      </div>

      {/* Éditeur */}
      <div className="card">
        <div className="flex items-start gap-3 mb-4">
          <User size={20} className="text-gray-500 mt-0.5" />
          <h2 className="font-semibold text-gray-900">Éditeur de l'application</h2>
        </div>
        <div className="space-y-2 text-gray-700">
          <p><strong>Nom :</strong> Emmanuel Pinglier</p>
          <p><strong>Application :</strong> ElecPro - Méthode EP</p>
          <p><strong>Date de création :</strong> 2026</p>
        </div>
      </div>

      {/* Propriété intellectuelle */}
      <div className="card">
        <div className="flex items-start gap-3 mb-4">
          <Scale size={20} className="text-gray-500 mt-0.5" />
          <h2 className="font-semibold text-gray-900">Propriété intellectuelle</h2>
        </div>
        <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
          <p>
            L'ensemble du contenu de cette application (textes, exercices, quiz,
            méthodes pédagogiques, structure, code source, design) est la propriété
            exclusive d'Emmanuel Pinglier et est protégé par le droit d'auteur
            français et les conventions internationales.
          </p>
          <p className="font-medium text-gray-900">
            Toute reproduction, adaptation, diffusion ou exploitation commerciale,
            totale ou partielle, sans autorisation écrite préalable est interdite.
          </p>
          <p>
            Cette protection s'applique notamment aux :
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Contenus pédagogiques et méthodes d'apprentissage</li>
            <li>Questions de quiz et cas pratiques</li>
            <li>Fiches de révision et synthèses</li>
            <li>Interface utilisateur et expérience d'apprentissage</li>
            <li>Code source et architecture technique</li>
          </ul>
        </div>
      </div>

      {/* Interdictions */}
      <div className="card bg-red-50 border-red-200">
        <h2 className="font-semibold text-red-800 mb-3">Utilisations interdites</h2>
        <div className="space-y-3 text-sm text-red-700">
          <p>
            <strong>Toute utilisation par un organisme de formation, établissement
            scolaire, CFA, ou structure commerciale est strictement interdite sans
            licence.</strong>
          </p>
          <p>Est notamment interdit sans autorisation écrite :</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>L'utilisation dans un cadre de formation payante</li>
            <li>L'intégration sur une plateforme e-learning</li>
            <li>La reproduction pour distribution collective</li>
            <li>L'adaptation ou la création d'oeuvres dérivées</li>
            <li>Toute exploitation commerciale directe ou indirecte</li>
          </ul>
        </div>
      </div>

      {/* Usage autorisé */}
      <div className="card bg-green-50 border-green-200">
        <h2 className="font-semibold text-green-800 mb-3">Usage autorisé</h2>
        <div className="text-sm text-green-700 space-y-2">
          <p>
            Cette application est destinée à un <strong>usage personnel et
            pédagogique individuel</strong> uniquement.
          </p>
          <p>
            Vous pouvez utiliser cette application pour votre propre formation
            et révision dans le cadre de la préparation au Titre Professionnel
            Électricien d'Équipement du Bâtiment.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="card">
        <div className="flex items-start gap-3 mb-4">
          <Mail size={20} className="text-gray-500 mt-0.5" />
          <h2 className="font-semibold text-gray-900">Licence professionnelle</h2>
        </div>
        <p className="text-sm text-gray-700">
          Pour toute demande de licence commerciale ou utilisation par un organisme
          de formation, veuillez contacter l'auteur pour obtenir une autorisation
          et un devis personnalisé.
        </p>
      </div>

      {/* Hébergement */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-3">Hébergement</h2>
        <p className="text-sm text-gray-700">
          Cette application est hébergée par Netlify, Inc.
        </p>
      </div>

      {/* Lien conditions */}
      <div className="text-center py-4">
        <Link
          to="/conditions"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Voir les Conditions d'utilisation
        </Link>
      </div>

      {/* Signature */}
      <div className="text-center text-xs text-gray-400 pb-4 border-t border-gray-200 pt-4">
        <p className="font-medium">Méthode EP - 2026</p>
        <p className="mt-1">Application ElecPro par Emmanuel Pinglier</p>
      </div>
    </div>
  )
}

export default MentionsLegales
