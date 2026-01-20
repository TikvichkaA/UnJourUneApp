'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Pause,
  Circle,
  AlertTriangle,
  ArrowUpDown,
  Timer
} from 'lucide-react';
import { Signalement, SignalementStatut, SignalementPriorite } from '@/lib/types';

interface DashboardProps {
  onViewDetail: (id: string) => void;
}

type SortOption = 'recent' | 'ancien' | 'priorite' | 'statut';

export default function Dashboard({ onViewDetail }: DashboardProps) {
  const { signalements, currentUser, categories, users } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<SignalementStatut | 'tous'>('tous');
  const [filterCategorie, setFilterCategorie] = useState<string>('tous');
  const [filterPriorite, setFilterPriorite] = useState<SignalementPriorite | 'tous'>('tous');
  const [filterAgent, setFilterAgent] = useState<string>('tous');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const agents = users.filter((u) => u.role === 'agent' || u.role === 'responsable');
  const canFilterByAgent = currentUser?.role === 'responsable' || currentUser?.role === 'admin';

  // Compteurs rapides
  const quickStats = useMemo(() => {
    let baseSignalements = [...signalements];

    // Pour les agents, filtrer leurs signalements
    if (currentUser?.role === 'agent') {
      baseSignalements = baseSignalements.filter(
        (s) => s.assigne_a?.id === currentUser.id || s.cree_par.id === currentUser.id
      );
    }

    return {
      total: baseSignalements.length,
      nouveaux: baseSignalements.filter((s) => s.statut === 'nouveau').length,
      enCours: baseSignalements.filter((s) => s.statut === 'en_cours').length,
      bloques: baseSignalements.filter((s) => s.statut === 'bloque').length,
      hautePriorite: baseSignalements.filter((s) => s.priorite === 'haute' && s.statut !== 'resolu').length,
      nonAssignes: baseSignalements.filter((s) => !s.assigne_a && s.statut !== 'resolu').length,
    };
  }, [signalements, currentUser]);

  const filteredSignalements = useMemo(() => {
    let result = [...signalements];

    // Pour les agents, ne montrer que leurs signalements assignés ou créés par eux
    if (currentUser?.role === 'agent') {
      result = result.filter(
        (s) => s.assigne_a?.id === currentUser.id || s.cree_par.id === currentUser.id
      );
    }

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.titre.toLowerCase().includes(term) ||
          s.description.toLowerCase().includes(term) ||
          s.localisation.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (filterStatut !== 'tous') {
      result = result.filter((s) => s.statut === filterStatut);
    }

    // Filtre par catégorie
    if (filterCategorie !== 'tous') {
      result = result.filter((s) => s.categorie === filterCategorie);
    }

    // Filtre par priorité
    if (filterPriorite !== 'tous') {
      result = result.filter((s) => s.priorite === filterPriorite);
    }

    // Filtre par agent assigné
    if (filterAgent !== 'tous') {
      if (filterAgent === 'non_assigne') {
        result = result.filter((s) => !s.assigne_a);
      } else {
        result = result.filter((s) => s.assigne_a?.id === filterAgent);
      }
    }

    // Tri
    const prioriteOrder = { haute: 0, normale: 1, basse: 2 };
    const statutOrder = { nouveau: 0, en_cours: 1, bloque: 2, resolu: 3 };

    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime());
        break;
      case 'ancien':
        result.sort((a, b) => new Date(a.date_creation).getTime() - new Date(b.date_creation).getTime());
        break;
      case 'priorite':
        result.sort((a, b) => prioriteOrder[a.priorite] - prioriteOrder[b.priorite]);
        break;
      case 'statut':
        result.sort((a, b) => statutOrder[a.statut] - statutOrder[b.statut]);
        break;
    }

    return result;
  }, [signalements, currentUser, searchTerm, filterStatut, filterCategorie, filterPriorite, filterAgent, sortBy]);

  const statutConfig: Record<SignalementStatut, { label: string; color: string; icon: React.ElementType }> = {
    nouveau: { label: 'Nouveau', color: 'bg-blue-100 text-blue-700', icon: Circle },
    en_cours: { label: 'En cours', color: 'bg-amber-100 text-amber-700', icon: Clock },
    bloque: { label: 'Bloqué', color: 'bg-red-100 text-red-700', icon: Pause },
    resolu: { label: 'Résolu', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  };

  const prioriteConfig: Record<SignalementPriorite, { label: string; color: string }> = {
    basse: { label: 'Basse', color: 'text-slate-500' },
    normale: { label: 'Normale', color: 'text-blue-600' },
    haute: { label: 'Haute', color: 'text-red-600' },
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDelaiDepuisCreation = (dateStr: string) => {
    const now = new Date();
    const created = new Date(dateStr);
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `${diffDays} jours`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem.`;
    return `${Math.floor(diffDays / 30)} mois`;
  };

  const getCategorieColor = (categorieName: string) => {
    const cat = categories.find((c) => c.nom === categorieName);
    return cat?.couleur || '#6b7280';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-600 mt-1">
            {currentUser?.role === 'agent'
              ? 'Vos signalements assignés et créés'
              : 'Tous les signalements'}
          </p>
        </div>
      </div>

      {/* Compteurs rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => { setFilterStatut('tous'); setFilterPriorite('tous'); setFilterAgent('tous'); }}
          className={`bg-white rounded-xl border p-4 text-left transition-all hover:shadow-md ${
            filterStatut === 'tous' && filterPriorite === 'tous' && filterAgent === 'tous'
              ? 'border-blue-300 ring-2 ring-blue-100'
              : 'border-slate-200'
          }`}
        >
          <p className="text-2xl font-bold text-slate-900">{quickStats.total}</p>
          <p className="text-xs text-slate-500 mt-1">Total</p>
        </button>

        <button
          onClick={() => { setFilterStatut('nouveau'); setFilterPriorite('tous'); setFilterAgent('tous'); }}
          className={`bg-white rounded-xl border p-4 text-left transition-all hover:shadow-md ${
            filterStatut === 'nouveau' ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200'
          }`}
        >
          <p className="text-2xl font-bold text-blue-600">{quickStats.nouveaux}</p>
          <p className="text-xs text-slate-500 mt-1">Nouveaux</p>
        </button>

        <button
          onClick={() => { setFilterStatut('en_cours'); setFilterPriorite('tous'); setFilterAgent('tous'); }}
          className={`bg-white rounded-xl border p-4 text-left transition-all hover:shadow-md ${
            filterStatut === 'en_cours' ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
          }`}
        >
          <p className="text-2xl font-bold text-amber-600">{quickStats.enCours}</p>
          <p className="text-xs text-slate-500 mt-1">En cours</p>
        </button>

        <button
          onClick={() => { setFilterStatut('bloque'); setFilterPriorite('tous'); setFilterAgent('tous'); }}
          className={`bg-white rounded-xl border p-4 text-left transition-all hover:shadow-md ${
            filterStatut === 'bloque' ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'
          }`}
        >
          <p className="text-2xl font-bold text-red-600">{quickStats.bloques}</p>
          <p className="text-xs text-slate-500 mt-1">Bloqués</p>
        </button>

        <button
          onClick={() => { setFilterStatut('tous'); setFilterPriorite('haute'); setFilterAgent('tous'); }}
          className={`bg-white rounded-xl border p-4 text-left transition-all hover:shadow-md ${
            filterPriorite === 'haute' ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <p className="text-2xl font-bold text-red-600">{quickStats.hautePriorite}</p>
          </div>
          <p className="text-xs text-slate-500 mt-1">Urgents</p>
        </button>

        {canFilterByAgent && (
          <button
            onClick={() => { setFilterStatut('tous'); setFilterPriorite('tous'); setFilterAgent('non_assigne'); }}
            className={`bg-white rounded-xl border p-4 text-left transition-all hover:shadow-md ${
              filterAgent === 'non_assigne' ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
            }`}
          >
            <p className="text-2xl font-bold text-amber-600">{quickStats.nonAssignes}</p>
            <p className="text-xs text-slate-500 mt-1">Non assignés</p>
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filtres</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-medium">{filteredSignalements.length}</span>
            <span>résultat{filteredSignalements.length > 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Recherche */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Catégorie */}
          <select
            value={filterCategorie}
            onChange={(e) => setFilterCategorie(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="tous">Toutes catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.nom}>
                {cat.nom}
              </option>
            ))}
          </select>

          {/* Agent assigné (responsable/admin seulement) */}
          {canFilterByAgent && (
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="tous">Tous agents</option>
              <option value="non_assigne">Non assignés</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.nom}
                </option>
              ))}
            </select>
          )}

          {/* Tri */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
            >
              <option value="recent">Plus récent</option>
              <option value="ancien">Plus ancien</option>
              <option value="priorite">Par priorité</option>
              <option value="statut">Par statut</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des signalements */}
      <div className="space-y-3">
        {filteredSignalements.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Aucun signalement trouvé</p>
            <p className="text-sm text-slate-400 mt-1">
              Essayez de modifier vos filtres
            </p>
          </div>
        ) : (
          filteredSignalements.map((signalement) => {
            const statut = statutConfig[signalement.statut];
            const priorite = prioriteConfig[signalement.priorite];
            const StatutIcon = statut.icon;
            const delai = getDelaiDepuisCreation(signalement.date_creation);
            const isOld = new Date().getTime() - new Date(signalement.date_creation).getTime() > 7 * 24 * 60 * 60 * 1000;

            return (
              <button
                key={signalement.id}
                onClick={() => onViewDetail(signalement.id)}
                className="w-full bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start gap-4">
                  {/* Indicateur catégorie */}
                  <div
                    className="w-1 h-full min-h-[80px] rounded-full flex-shrink-0"
                    style={{ backgroundColor: getCategorieColor(signalement.categorie) }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 line-clamp-1">
                          {signalement.titre}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                          {signalement.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {/* Statut */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statut.color}`}>
                        <StatutIcon className="w-3.5 h-3.5" />
                        {statut.label}
                      </span>

                      {/* Catégorie */}
                      <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        {signalement.categorie}
                      </span>

                      {/* Priorité (avec indicateur visuel renforcé si haute) */}
                      {signalement.priorite === 'haute' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          Urgent
                        </span>
                      ) : (
                        <span className={`text-xs font-medium ${priorite.color}`}>
                          Priorité {priorite.label.toLowerCase()}
                        </span>
                      )}

                      {/* Délai depuis création */}
                      <span className={`inline-flex items-center gap-1 text-xs ${
                        isOld && signalement.statut !== 'resolu' ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        <Timer className="w-3.5 h-3.5" />
                        {delai}
                      </span>

                      {/* Localisation */}
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {signalement.localisation}
                      </span>

                      {/* Assigné à */}
                      {signalement.assigne_a ? (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <User className="w-3.5 h-3.5" />
                          {signalement.assigne_a.nom}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          <User className="w-3.5 h-3.5" />
                          Non assigné
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
