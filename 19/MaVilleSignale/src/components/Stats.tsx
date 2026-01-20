'use client';

import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Pause,
  Circle,
  Users
} from 'lucide-react';
import { SignalementStatut } from '@/lib/types';

export default function Stats() {
  const { signalements, categories, users } = useStore();

  const stats = useMemo(() => {
    const total = signalements.length;

    // Par statut
    const byStatut: Record<SignalementStatut, number> = {
      nouveau: 0,
      en_cours: 0,
      bloque: 0,
      resolu: 0,
    };
    signalements.forEach((s) => {
      byStatut[s.statut]++;
    });

    // Par catégorie
    const byCategorie: Record<string, number> = {};
    categories.forEach((cat) => {
      byCategorie[cat.nom] = 0;
    });
    signalements.forEach((s) => {
      if (byCategorie[s.categorie] !== undefined) {
        byCategorie[s.categorie]++;
      }
    });

    // Par priorité
    const byPriorite = {
      haute: signalements.filter((s) => s.priorite === 'haute').length,
      normale: signalements.filter((s) => s.priorite === 'normale').length,
      basse: signalements.filter((s) => s.priorite === 'basse').length,
    };

    // Par agent (assignés)
    const byAgent: Record<string, number> = {};
    users
      .filter((u) => u.role === 'agent')
      .forEach((agent) => {
        byAgent[agent.nom] = signalements.filter(
          (s) => s.assigne_a?.id === agent.id
        ).length;
      });

    // Taux de résolution
    const tauxResolution = total > 0 ? Math.round((byStatut.resolu / total) * 100) : 0;

    // Non assignés
    const nonAssignes = signalements.filter((s) => !s.assigne_a).length;

    return {
      total,
      byStatut,
      byCategorie,
      byPriorite,
      byAgent,
      tauxResolution,
      nonAssignes,
    };
  }, [signalements, categories, users]);

  const statutConfig = {
    nouveau: { label: 'Nouveaux', color: 'bg-blue-500', icon: Circle },
    en_cours: { label: 'En cours', color: 'bg-amber-500', icon: Clock },
    bloque: { label: 'Bloqués', color: 'bg-red-500', icon: Pause },
    resolu: { label: 'Résolus', color: 'bg-green-500', icon: CheckCircle2 },
  };

  const getBarWidth = (value: number, max: number) => {
    return max > 0 ? (value / max) * 100 : 0;
  };

  const maxCategorie = Math.max(...Object.values(stats.byCategorie), 1);
  const maxAgent = Math.max(...Object.values(stats.byAgent), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Statistiques</h1>
        <p className="text-slate-600 mt-1">Vue d'ensemble des signalements</p>
      </div>

      {/* Cartes principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total signalements</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Taux de résolution</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.tauxResolution}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Priorité haute</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.byPriorite.haute}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Non assignés</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{stats.nonAssignes}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Par statut */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-6">Répartition par statut</h2>
          <div className="space-y-4">
            {(Object.keys(statutConfig) as SignalementStatut[]).map((statut) => {
              const config = statutConfig[statut];
              const count = stats.byStatut[statut];
              const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              const Icon = config.icon;

              return (
                <div key={statut}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">{config.label}</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      <span className="font-semibold">{count}</span>
                      <span className="text-slate-400 ml-1">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${config.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Par catégorie */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-6">Répartition par catégorie</h2>
          <div className="space-y-4">
            {categories.map((cat) => {
              const count = stats.byCategorie[cat.nom] || 0;
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.couleur }}
                      />
                      <span className="text-sm font-medium text-slate-700">{cat.nom}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-600">{count}</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${getBarWidth(count, maxCategorie)}%`,
                        backgroundColor: cat.couleur,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Par priorité */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-6">Répartition par priorité</h2>
          <div className="flex items-end justify-center gap-8 h-48">
            {[
              { key: 'haute', label: 'Haute', color: 'bg-red-500', value: stats.byPriorite.haute },
              { key: 'normale', label: 'Normale', color: 'bg-blue-500', value: stats.byPriorite.normale },
              { key: 'basse', label: 'Basse', color: 'bg-slate-400', value: stats.byPriorite.basse },
            ].map((item) => {
              const maxPriorite = Math.max(
                stats.byPriorite.haute,
                stats.byPriorite.normale,
                stats.byPriorite.basse,
                1
              );
              const height = (item.value / maxPriorite) * 100;
              return (
                <div key={item.key} className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-slate-700 mb-2">
                    {item.value}
                  </span>
                  <div
                    className={`w-16 ${item.color} rounded-t-lg transition-all duration-500`}
                    style={{ height: `${Math.max(height, 10)}%` }}
                  />
                  <span className="text-xs text-slate-500 mt-2">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Par agent */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-6">Signalements par agent</h2>
          <div className="space-y-4">
            {Object.entries(stats.byAgent).map(([agentName, count]) => (
              <div key={agentName}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-600">
                        {agentName.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{agentName}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-600">{count}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${getBarWidth(count, maxAgent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
