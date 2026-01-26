import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, FileText, Brain, Calculator, Shield, ChevronRight, Award, Target, Download, Wifi, WifiOff, Shapes, Cable, ClipboardCheck, Sun, Image, Wrench, PenTool, Search } from 'lucide-react'
import { referentiel } from '../data/referentiel'

const modules = [
  {
    path: '/referentiel',
    icon: BookOpen,
    title: 'Référentiel',
    description: '2 CCP, 9 compétences',
    color: 'bg-blue-500'
  },
  {
    path: '/normes',
    icon: FileText,
    title: 'NF C 15-100',
    description: 'Fiches normatives',
    color: 'bg-emerald-500'
  },
  {
    path: '/quiz',
    icon: Brain,
    title: 'Quiz & Examen',
    description: 'Entraînement QCM',
    color: 'bg-purple-500'
  },
  {
    path: '/calculateurs',
    icon: Calculator,
    title: 'Calculateurs',
    description: 'Sections, chutes de tension',
    color: 'bg-amber-500'
  },
  {
    path: '/habilitations',
    icon: Shield,
    title: 'Habilitations',
    description: 'B1V, BR, BC, H0',
    color: 'bg-red-500'
  },
  {
    path: '/courants-faibles',
    icon: Wifi,
    title: 'Courants Faibles',
    description: 'VDI, RJ45, alarmes',
    color: 'bg-indigo-500'
  },
  {
    path: '/symboles',
    icon: Shapes,
    title: 'Symboles',
    description: 'Flashcards électriques',
    color: 'bg-cyan-500'
  },
  {
    path: '/raccordements',
    icon: Cable,
    title: 'Raccordements',
    description: 'Jeu de câblage',
    color: 'bg-orange-500'
  },
  {
    path: '/examen',
    icon: ClipboardCheck,
    title: 'Examen Blanc',
    description: 'Simulation épreuve',
    color: 'bg-rose-500'
  },
  {
    path: '/pv-irve',
    icon: Sun,
    title: 'PV & IRVE',
    description: 'Solaire et bornes VE',
    color: 'bg-yellow-500'
  },
  {
    path: '/galerie',
    icon: Image,
    title: 'Galerie',
    description: 'Photos installations',
    color: 'bg-slate-500'
  },
  {
    path: '/cas-pratiques',
    icon: Wrench,
    title: 'Cas Pratiques',
    description: 'Diagnostic terrain',
    color: 'bg-teal-500'
  },
  {
    path: '/schemas-exercices',
    icon: PenTool,
    title: 'Schémas',
    description: 'Exercices interactifs',
    color: 'bg-pink-500'
  },
  {
    path: '/erreurs-visuelles',
    icon: Search,
    title: 'Trouver les erreurs',
    description: 'Repérez les défauts',
    color: 'bg-rose-600'
  }
]

function Home() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Capture install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    // Online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const result = await installPrompt.userChoice
    if (result.outcome === 'accepted') {
      setIsInstalled(true)
    }
    setInstallPrompt(null)
  }

  return (
    <div className="p-4 space-y-6">
      {/* Install / Offline banner */}
      {!isInstalled && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download size={24} />
              <div>
                <p className="font-semibold">Installer l'app</p>
                <p className="text-sm text-green-100">Fonctionne hors-ligne</p>
              </div>
            </div>
            {installPrompt ? (
              <button
                onClick={handleInstall}
                className="bg-white text-green-600 font-semibold px-4 py-2 rounded-lg"
              >
                Installer
              </button>
            ) : (
              <div className="text-xs text-green-100 text-right max-w-32">
                Menu → "Ajouter à l'écran d'accueil"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 flex items-center gap-2 text-orange-800">
          <WifiOff size={18} />
          <span className="text-sm font-medium">Mode hors-ligne</span>
        </div>
      )}

      {/* Hero section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Titre Professionnel</h2>
            <p className="text-blue-200 text-sm mt-1">{referentiel.titre}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Niveau {referentiel.niveau}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{referentiel.code}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">2</div>
          <div className="text-xs text-gray-500">CCP</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-emerald-600">9</div>
          <div className="text-xs text-gray-500">Compétences</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">15h30</div>
          <div className="text-xs text-gray-500">Épreuve</div>
        </div>
      </div>

      {/* Modules */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Target size={18} />
          Modules de révision
        </h3>
        <div className="space-y-3">
          {modules.map(({ path, icon: Icon, title, description, color }) => (
            <Link
              key={path}
              to={path}
              className="card card-hover flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900">{title}</h4>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Habilitations requises */}
      <div className="card bg-amber-50 border-amber-200">
        <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
          <Shield size={18} />
          Habilitations requises
        </h3>
        <div className="flex flex-wrap gap-2">
          {referentiel.habilitationsRequises.map(hab => (
            <span key={hab} className="badge bg-amber-100 text-amber-800 px-3 py-1">
              {hab}
            </span>
          ))}
        </div>
        <p className="text-xs text-amber-700 mt-2">
          Conformément aux articles R4544-9 et R4544-10 du Code du travail
        </p>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-gray-400 pb-4">
        <p>Application de révision - TP Électricien Bâtiment</p>
        <p className="mt-1">Basé sur NF C 15-100 (2024) et RNCP36441</p>
      </div>
    </div>
  )
}

export default Home
