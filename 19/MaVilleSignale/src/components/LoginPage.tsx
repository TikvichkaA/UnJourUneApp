'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Building2, LogIn, ChevronDown } from 'lucide-react';

export default function LoginPage() {
  const { users, login } = useStore();
  const [selectedEmail, setSelectedEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail) {
      setError('Veuillez sélectionner un utilisateur');
      return;
    }
    const success = login(selectedEmail);
    if (!success) {
      setError('Erreur de connexion');
    }
  };

  const roleLabels = {
    agent: 'Agent',
    responsable: 'Responsable',
    admin: 'Administrateur',
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">MaVille Signale</h1>
          <p className="text-slate-600 mt-2">Gestion des signalements municipaux</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Connexion simulée
            </label>
            <div className="relative">
              <select
                value={selectedEmail}
                onChange={(e) => {
                  setSelectedEmail(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un utilisateur...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.email}>
                    {user.nom} ({roleLabels[user.role]})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Se connecter
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            MVP de démonstration - Authentification simulée
          </p>
        </div>
      </div>
    </div>
  );
}
