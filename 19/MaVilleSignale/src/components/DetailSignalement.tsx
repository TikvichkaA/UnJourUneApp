'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  Camera,
  Send,
  CheckCircle2,
  Circle,
  Pause,
  AlertCircle,
  History
} from 'lucide-react';
import { SignalementStatut } from '@/lib/types';

interface DetailSignalementProps {
  signalementId: string;
  onBack: () => void;
}

export default function DetailSignalement({ signalementId, onBack }: DetailSignalementProps) {
  const {
    signalements,
    currentUser,
    users,
    updateSignalementStatut,
    assignerSignalement,
    addCommentaire,
  } = useStore();
  const [newComment, setNewComment] = useState('');

  const signalement = signalements.find((s) => s.id === signalementId);

  if (!signalement) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-600">Signalement non trouvé</p>
        <button
          onClick={onBack}
          className="mt-4 text-blue-600 hover:underline"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  const canChangeStatut =
    currentUser?.role === 'responsable' ||
    currentUser?.role === 'admin' ||
    signalement.assigne_a?.id === currentUser?.id;

  const canAssign = currentUser?.role === 'responsable' || currentUser?.role === 'admin';

  const statutConfig: Record<SignalementStatut, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
    nouveau: { label: 'Nouveau', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: Circle },
    en_cours: { label: 'En cours', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: Clock },
    bloque: { label: 'Bloqué', color: 'text-red-700', bgColor: 'bg-red-100', icon: Pause },
    resolu: { label: 'Résolu', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle2 },
  };

  const prioriteLabels = {
    basse: 'Basse',
    normale: 'Normale',
    haute: 'Haute',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addCommentaire(signalement.id, newComment);
    setNewComment('');
  };

  const agents = users.filter((u) => u.role === 'agent' || u.role === 'responsable');
  const statut = statutConfig[signalement.statut];
  const StatutIcon = statut.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900 line-clamp-1">
            {signalement.titre}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Signalement #{signalement.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations principales */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Informations</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-500">Description</label>
                <p className="mt-1 text-slate-900">{signalement.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Catégorie</label>
                  <p className="mt-1 text-slate-900">{signalement.categorie}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Priorité</label>
                  <p className={`mt-1 font-medium ${
                    signalement.priorite === 'haute'
                      ? 'text-red-600'
                      : signalement.priorite === 'normale'
                      ? 'text-blue-600'
                      : 'text-slate-600'
                  }`}>
                    {prioriteLabels[signalement.priorite]}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Localisation
                </label>
                <p className="mt-1 text-slate-900">{signalement.localisation}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Créé par</label>
                  <p className="mt-1 text-slate-900">{signalement.cree_par.nom}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Date de création</label>
                  <p className="mt-1 text-slate-900">{formatDate(signalement.date_creation)}</p>
                </div>
              </div>
            </div>

            {/* Photos */}
            {signalement.photos.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <label className="text-sm text-slate-500 mb-3 block">Photos</label>
                <div className="flex flex-wrap gap-3">
                  {signalement.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"
                    >
                      <Camera className="w-8 h-8" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Commentaires */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">
              Commentaires ({signalement.commentaires.length})
            </h2>

            <div className="space-y-4">
              {signalement.commentaires.length === 0 ? (
                <p className="text-slate-500 text-sm">Aucun commentaire pour le moment</p>
              ) : (
                signalement.commentaires.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-slate-600">
                        {comment.auteur.nom.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 text-sm">
                          {comment.auteur.nom}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDate(comment.date)}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-700 text-sm">{comment.contenu}</p>
                    </div>
                  </div>
                ))
              )}

              {/* Nouveau commentaire */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600">
                    {currentUser?.nom.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Statut et actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Statut</h2>

            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${statut.bgColor} ${statut.color} mb-4`}>
              <StatutIcon className="w-5 h-5" />
              <span className="font-medium">{statut.label}</span>
            </div>

            {canChangeStatut && (
              <div className="space-y-2">
                <label className="text-sm text-slate-500">Changer le statut</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(statutConfig) as SignalementStatut[]).map((s) => {
                    const config = statutConfig[s];
                    const Icon = config.icon;
                    return (
                      <button
                        key={s}
                        onClick={() => updateSignalementStatut(signalement.id, s)}
                        disabled={signalement.statut === s}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          signalement.statut === s
                            ? `${config.bgColor} ${config.color}`
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Affectation */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Affectation</h2>

            {signalement.assigne_a ? (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{signalement.assigne_a.nom}</p>
                  <p className="text-sm text-slate-500 capitalize">{signalement.assigne_a.role}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm mb-4">Non assigné</p>
            )}

            {canAssign && (
              <div>
                <label className="text-sm text-slate-500 block mb-2">
                  {signalement.assigne_a ? 'Réaffecter à' : 'Affecter à'}
                </label>
                <select
                  value={signalement.assigne_a?.id || ''}
                  onChange={(e) => assignerSignalement(signalement.id, e.target.value || null)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Non assigné</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.nom} ({agent.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Historique */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              Historique
            </h2>

            <div className="space-y-3">
              {signalement.historique.map((event, index) => (
                <div key={event.id} className="flex gap-3">
                  <div className="relative">
                    <div className="w-2 h-2 bg-slate-300 rounded-full mt-2" />
                    {index < signalement.historique.length - 1 && (
                      <div className="absolute top-4 left-[3px] w-0.5 h-full bg-slate-200" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-sm text-slate-900">{event.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {event.auteur} - {formatDate(event.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
