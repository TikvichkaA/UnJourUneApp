'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  Users,
  Tag,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { UserRole, Categorie } from '@/lib/types';
import ConfirmModal from './ConfirmModal';
import { useToast } from './Toast';

type Tab = 'users' | 'categories';

export default function Admin() {
  const {
    users,
    categories,
    currentUser,
    addUser,
    updateUser,
    deleteUser,
    addCategorie,
    updateCategorie,
    deleteCategorie,
  } = useStore();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>('users');

  // États pour les modales
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCategorieModal, setShowCategorieModal] = useState(false);
  const [editingUser, setEditingUser] = useState<typeof users[0] | null>(null);
  const [editingCategorie, setEditingCategorie] = useState<Categorie | null>(null);

  // États de confirmation
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'user' | 'categorie'; id: string; name: string } | null>(null);
  const [showSelfDeleteError, setShowSelfDeleteError] = useState(false);

  // États des formulaires
  const [userForm, setUserForm] = useState({ nom: '', email: '', role: 'agent' as UserRole });
  const [categorieForm, setCategorieForm] = useState({ nom: '', description: '', couleur: '#3b82f6' });

  const roleLabels = {
    agent: 'Agent',
    responsable: 'Responsable',
    admin: 'Administrateur',
  };

  const handleOpenUserModal = (user?: typeof users[0]) => {
    if (user) {
      setEditingUser(user);
      setUserForm({ nom: user.nom, email: user.email, role: user.role });
    } else {
      setEditingUser(null);
      setUserForm({ nom: '', email: '', role: 'agent' });
    }
    setShowUserModal(true);
  };

  const handleOpenCategorieModal = (categorie?: Categorie) => {
    if (categorie) {
      setEditingCategorie(categorie);
      setCategorieForm({ nom: categorie.nom, description: categorie.description, couleur: categorie.couleur });
    } else {
      setEditingCategorie(null);
      setCategorieForm({ nom: '', description: '', couleur: '#3b82f6' });
    }
    setShowCategorieModal(true);
  };

  const handleSaveUser = () => {
    if (!userForm.nom.trim() || !userForm.email.trim()) return;

    if (editingUser) {
      updateUser(editingUser.id, userForm);
      showToast('Utilisateur modifié avec succès');
    } else {
      addUser(userForm);
      showToast('Utilisateur créé avec succès');
    }
    setShowUserModal(false);
  };

  const handleSaveCategorie = () => {
    if (!categorieForm.nom.trim()) return;

    if (editingCategorie) {
      updateCategorie(editingCategorie.id, categorieForm);
      showToast('Catégorie modifiée avec succès');
    } else {
      addCategorie(categorieForm);
      showToast('Catégorie créée avec succès');
    }
    setShowCategorieModal(false);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (userId === currentUser?.id) {
      setShowSelfDeleteError(true);
      return;
    }
    setConfirmDelete({ type: 'user', id: userId, name: userName });
  };

  const handleDeleteCategorie = (categorieId: string, categorieName: string) => {
    setConfirmDelete({ type: 'categorie', id: categorieId, name: categorieName });
  };

  const handleConfirmDelete = () => {
    if (!confirmDelete) return;

    if (confirmDelete.type === 'user') {
      deleteUser(confirmDelete.id);
      showToast('Utilisateur supprimé');
    } else {
      deleteCategorie(confirmDelete.id);
      showToast('Catégorie supprimée');
    }
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Administration</h1>
        <p className="text-slate-600 mt-1">Gestion des utilisateurs et catégories</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Utilisateurs ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'categories'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          Catégories ({categories.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => handleOpenUserModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter un utilisateur
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-slate-600">
                            {user.nom.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-slate-900">{user.nom}</span>
                        {user.id === currentUser?.id && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            Vous
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'responsable'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenUserModal(user)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.nom)}
                          disabled={user.id === currentUser?.id}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => handleOpenCategorieModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter une catégorie
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((categorie) => (
              <div
                key={categorie.id}
                className="bg-white rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg"
                      style={{ backgroundColor: categorie.couleur }}
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900">{categorie.nom}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{categorie.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenCategorieModal(categorie)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategorie(categorie.id, categorie.nom)}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Utilisateur */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
              </h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={userForm.nom}
                  onChange={(e) => setUserForm({ ...userForm, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="jean.dupont@ville.fr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="agent">Agent</option>
                  <option value="responsable">Responsable</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveUser}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                {editingUser ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Catégorie */}
      {showCategorieModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCategorie ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
              <button
                onClick={() => setShowCategorieModal(false)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={categorieForm.nom}
                  onChange={(e) => setCategorieForm({ ...categorieForm, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Voirie"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={categorieForm.description}
                  onChange={(e) => setCategorieForm({ ...categorieForm, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description de la catégorie..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Couleur</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={categorieForm.couleur}
                    onChange={(e) => setCategorieForm({ ...categorieForm, couleur: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={categorieForm.couleur}
                    onChange={(e) => setCategorieForm({ ...categorieForm, couleur: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCategorieModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveCategorie}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                {editingCategorie ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        title={confirmDelete?.type === 'user' ? 'Supprimer l\'utilisateur' : 'Supprimer la catégorie'}
        message={`Êtes-vous sûr de vouloir supprimer ${confirmDelete?.type === 'user' ? 'l\'utilisateur' : 'la catégorie'} "${confirmDelete?.name}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Modal d'erreur auto-suppression */}
      {showSelfDeleteError && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 animate-scale-in">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Action impossible</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Vous ne pouvez pas supprimer votre propre compte.
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowSelfDeleteError(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
