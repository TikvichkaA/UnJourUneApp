import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, FileText, Brain, Calculator, Shield } from 'lucide-react'
import DisclaimerModal from './DisclaimerModal'

const navItems = [
  { path: '/', icon: Home, label: 'Accueil' },
  { path: '/referentiel', icon: BookOpen, label: 'Référentiel' },
  { path: '/normes', icon: FileText, label: 'Normes' },
  { path: '/quiz', icon: Brain, label: 'Quiz' },
  { path: '/calculateurs', icon: Calculator, label: 'Calculs' },
  { path: '/habilitations', icon: Shield, label: 'Habilitations' }
]

function Layout() {
  const location = useLocation()
  const isQuizSession = location.pathname.includes('/quiz/') && location.pathname !== '/quiz'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Disclaimer modal */}
      <DisclaimerModal />

      {/* Header */}
      <header className="bg-blue-600 text-white px-4 py-3 safe-area-top sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">ElecPro</h1>
            <p className="text-xs text-blue-200">TP Électricien Bâtiment</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-28">
        <Outlet />

        {/* Footer signature / Watermark */}
        <footer className="mt-8 pb-4 px-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center pt-4">
            <p className="text-xs font-medium text-gray-500">
              Méthode EP - 2026
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              &copy; 2026 Emmanuel Pinglier - Tous droits réservés
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <Link
                to="/mentions-legales"
                className="text-[10px] text-blue-500 hover:underline"
              >
                Mentions légales
              </Link>
              <Link
                to="/conditions"
                className="text-[10px] text-blue-500 hover:underline"
              >
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </footer>
      </main>

      {/* Bottom navigation - hidden during quiz */}
      {!isQuizSession && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
          <div className="flex justify-around items-center py-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}

export default Layout
