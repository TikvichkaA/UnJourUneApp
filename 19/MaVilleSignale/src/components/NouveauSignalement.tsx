'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  MapPin,
  Camera,
  Upload,
  X,
  AlertTriangle,
  Check
} from 'lucide-react';
import { SignalementPriorite } from '@/lib/types';

interface NouveauSignalementProps {
  onSuccess: () => void;
}

export default function NouveauSignalement({ onSuccess }: NouveauSignalementProps) {
  const { categories, currentUser, addSignalement } = useStore();
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('');
  const [priorite, setPriorite] = useState<SignalementPriorite>('normale');
  const [localisation, setLocalisation] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!titre.trim()) newErrors.titre = 'Le titre est requis';
    if (!description.trim()) newErrors.description = 'La description est requise';
    if (!categorie) newErrors.categorie = 'Veuillez sélectionner une catégorie';
    if (!localisation.trim()) newErrors.localisation = 'La localisation est requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !currentUser) return;

    addSignalement({
      titre,
      description,
      categorie,
      statut: 'nouveau',
      priorite,
      localisation,
      photos,
      cree_par: currentUser,
      assigne_a: null,
    });

    setSuccess(true);
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  const handleAddPhoto = () => {
    // Simulation d'ajout de photo
    const mockPhotos = [
      '/placeholder-photo-1.jpg',
      '/placeholder-photo-2.jpg',
      '/placeholder-photo-3.jpg',
    ];
    const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    setPhotos([...photos, randomPhoto]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Signalement créé avec succès
          </h2>
          <p className="text-slate-600">
            Votre signalement a été enregistré et sera traité prochainement.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nouveau signalement</h1>
        <p className="text-slate-600 mt-1">
          Remplissez le formulaire pour créer un nouveau signalement
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Titre du signalement *
          </label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Ex: Nid de poule rue de la Mairie"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.titre ? 'border-red-300' : 'border-slate-300'
            }`}
          />
          {errors.titre && (
            <p className="mt-1 text-sm text-red-600">{errors.titre}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Décrivez le problème en détail..."
            className={`w-full px-4 py-2.5 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-300' : 'border-slate-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Catégorie et Priorité */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Catégorie *
            </label>
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.categorie ? 'border-red-300' : 'border-slate-300'
              }`}
            >
              <option value="">Sélectionner...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.nom}>
                  {cat.nom}
                </option>
              ))}
            </select>
            {errors.categorie && (
              <p className="mt-1 text-sm text-red-600">{errors.categorie}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Priorité
            </label>
            <div className="flex gap-2">
              {(['basse', 'normale', 'haute'] as SignalementPriorite[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriorite(p)}
                  className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    priorite === p
                      ? p === 'haute'
                        ? 'bg-red-100 text-red-700 border-2 border-red-300'
                        : p === 'normale'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-slate-100 text-slate-700 border-2 border-slate-300'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p === 'haute' && <AlertTriangle className="w-4 h-4 inline mr-1" />}
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Localisation *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={localisation}
              onChange={(e) => setLocalisation(e.target.value)}
              placeholder="Adresse ou description du lieu"
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.localisation ? 'border-red-300' : 'border-slate-300'
              }`}
            />
          </div>
          {errors.localisation && (
            <p className="mt-1 text-sm text-red-600">{errors.localisation}</p>
          )}
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Photos (optionnel)
          </label>
          <div className="space-y-3">
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 bg-slate-100 rounded-lg overflow-hidden"
                  >
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Camera className="w-8 h-8" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={handleAddPhoto}
              className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>Ajouter une photo (simulé)</span>
            </button>
            <p className="text-xs text-slate-500">
              Note: Dans cette version MVP, l'ajout de photos est simulé.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Créer le signalement
          </button>
        </div>
      </form>
    </div>
  );
}
