'use client';

import { useStore } from '@/store/useStore';
import {
  Building2,
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState, useMemo } from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { currentUser, logout, signalements } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calcul des badges
  const badges = useMemo(() => {
    if (!currentUser) return { nouveaux: 0, nonAssignes: 0 };

    let relevantSignalements = [...signalements];

    // Pour les agents, filtrer leurs signalements
    if (currentUser.role === 'agent') {
      relevantSignalements = relevantSignalements.filter(
        (s) => s.assigne_a?.id === currentUser.id || s.cree_par.id === currentUser.id
      );
    }

    return {
      nouveaux: relevantSignalements.filter((s) => s.statut === 'nouveau').length,
      nonAssignes: relevantSignalements.filter((s) => !s.assigne_a && s.statut !== 'resolu').length,
    };
  }, [signalements, currentUser]);

  if (!currentUser) return null;

  const roleLabels = {
    agent: 'Agent',
    responsable: 'Responsable',
    admin: 'Administrateur',
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      roles: ['agent', 'responsable', 'admin'],
      badge: badges.nouveaux > 0 ? badges.nouveaux : null,
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'nouveau',
      label: 'Nouveau signalement',
      icon: PlusCircle,
      roles: ['agent', 'responsable', 'admin'],
      badge: null,
      badgeColor: ''
    },
    {
      id: 'stats',
      label: 'Statistiques',
      icon: BarChart3,
      roles: ['responsable', 'admin'],
      badge: null,
      badgeColor: ''
    },
    {
      id: 'admin',
      label: 'Administration',
      icon: Settings,
      roles: ['admin'],
      badge: null,
      badgeColor: ''
    },
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const NavContent = () => (
    <>
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900">MaVille Signale</h1>
            <p className="text-xs text-slate-500">Gestion municipale</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Indicateur signalements non assignés (responsable/admin) */}
      {(currentUser.role === 'responsable' || currentUser.role === 'admin') && badges.nonAssignes > 0 && (
        <div className="mx-4 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs font-medium text-amber-800">
            {badges.nonAssignes} signalement{badges.nonAssignes > 1 ? 's' : ''} non assigné{badges.nonAssignes > 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
            <span className="font-medium text-slate-600">
              {currentUser.nom.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 truncate">{currentUser.nom}</p>
            <p className="text-xs text-slate-500">{roleLabels[currentUser.role]}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center px-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg relative"
        >
          <Menu className="w-6 h-6" />
          {badges.nouveaux > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {badges.nouveaux}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2 ml-3">
          <Building2 className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-slate-900">MaVille Signale</span>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50 transform transition-transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="h-full flex flex-col">
          <NavContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col">
        <NavContent />
      </div>
    </>
  );
}
