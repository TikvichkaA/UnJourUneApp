import { create } from 'zustand';
import { User, Signalement, Categorie, SignalementStatut, Commentaire, HistoriqueEvent } from '@/lib/types';
import { mockUsers, mockSignalements, mockCategories } from '@/lib/mockData';

interface AppState {
  // Auth
  currentUser: User | null;
  login: (email: string) => boolean;
  logout: () => void;

  // Users
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Signalements
  signalements: Signalement[];
  addSignalement: (signalement: Omit<Signalement, 'id' | 'date_creation' | 'date_modification' | 'historique' | 'commentaires'>) => void;
  updateSignalementStatut: (id: string, statut: SignalementStatut) => void;
  assignerSignalement: (id: string, userId: string | null) => void;
  addCommentaire: (signalementId: string, contenu: string) => void;

  // Categories
  categories: Categorie[];
  addCategorie: (categorie: Omit<Categorie, 'id'>) => void;
  updateCategorie: (id: string, data: Partial<Categorie>) => void;
  deleteCategorie: (id: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  currentUser: null,
  login: (email: string) => {
    const user = get().users.find((u) => u.email === email);
    if (user) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },
  logout: () => set({ currentUser: null }),

  // Users
  users: mockUsers,
  addUser: (userData) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    set((state) => ({ users: [...state.users, newUser] }));
  },
  updateUser: (id, data) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
    }));
  },
  deleteUser: (id) => {
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    }));
  },

  // Signalements
  signalements: mockSignalements,
  addSignalement: (signalementData) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    const now = new Date().toISOString();
    const newSignalement: Signalement = {
      ...signalementData,
      id: Date.now().toString(),
      date_creation: now,
      date_modification: now,
      historique: [
        {
          id: `h-${Date.now()}`,
          date: now,
          type: 'creation',
          description: 'Signalement créé',
          auteur: currentUser.nom,
        },
      ],
      commentaires: [],
    };
    set((state) => ({ signalements: [newSignalement, ...state.signalements] }));
  },
  updateSignalementStatut: (id, statut) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    const now = new Date().toISOString();
    const statutLabels: Record<SignalementStatut, string> = {
      nouveau: 'Nouveau',
      en_cours: 'En cours',
      bloque: 'Bloqué',
      resolu: 'Résolu',
    };

    set((state) => ({
      signalements: state.signalements.map((s) =>
        s.id === id
          ? {
              ...s,
              statut,
              date_modification: now,
              historique: [
                ...s.historique,
                {
                  id: `h-${Date.now()}`,
                  date: now,
                  type: 'statut' as const,
                  description: `Statut changé vers "${statutLabels[statut]}"`,
                  auteur: currentUser.nom,
                },
              ],
            }
          : s
      ),
    }));
  },
  assignerSignalement: (id, userId) => {
    const currentUser = get().currentUser;
    const users = get().users;
    if (!currentUser) return;

    const assignedUser = userId ? users.find((u) => u.id === userId) : null;
    const now = new Date().toISOString();

    set((state) => ({
      signalements: state.signalements.map((s) =>
        s.id === id
          ? {
              ...s,
              assigne_a: assignedUser || null,
              date_modification: now,
              historique: [
                ...s.historique,
                {
                  id: `h-${Date.now()}`,
                  date: now,
                  type: 'affectation' as const,
                  description: assignedUser
                    ? `Affecté à ${assignedUser.nom}`
                    : 'Affectation retirée',
                  auteur: currentUser.nom,
                },
              ],
            }
          : s
      ),
    }));
  },
  addCommentaire: (signalementId, contenu) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    const now = new Date().toISOString();
    const newCommentaire: Commentaire = {
      id: `c-${Date.now()}`,
      signalement_id: signalementId,
      auteur: currentUser,
      contenu,
      date: now,
    };

    set((state) => ({
      signalements: state.signalements.map((s) =>
        s.id === signalementId
          ? {
              ...s,
              date_modification: now,
              commentaires: [...s.commentaires, newCommentaire],
              historique: [
                ...s.historique,
                {
                  id: `h-${Date.now()}`,
                  date: now,
                  type: 'commentaire' as const,
                  description: 'Commentaire ajouté',
                  auteur: currentUser.nom,
                },
              ],
            }
          : s
      ),
    }));
  },

  // Categories
  categories: mockCategories,
  addCategorie: (categorieData) => {
    const newCategorie: Categorie = {
      ...categorieData,
      id: Date.now().toString(),
    };
    set((state) => ({ categories: [...state.categories, newCategorie] }));
  },
  updateCategorie: (id, data) => {
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    }));
  },
  deleteCategorie: (id) => {
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
  },
}));
