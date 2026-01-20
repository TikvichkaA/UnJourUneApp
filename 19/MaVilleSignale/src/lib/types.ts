export type UserRole = 'agent' | 'responsable' | 'admin';

export interface User {
  id: string;
  nom: string;
  email: string;
  role: UserRole;
}

export type SignalementStatut = 'nouveau' | 'en_cours' | 'bloque' | 'resolu';
export type SignalementPriorite = 'basse' | 'normale' | 'haute';

export interface HistoriqueEvent {
  id: string;
  date: string;
  type: 'creation' | 'statut' | 'affectation' | 'commentaire';
  description: string;
  auteur: string;
}

export interface Commentaire {
  id: string;
  signalement_id: string;
  auteur: User;
  contenu: string;
  date: string;
}

export interface Signalement {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  statut: SignalementStatut;
  priorite: SignalementPriorite;
  localisation: string;
  photos: string[];
  cree_par: User;
  assigne_a: User | null;
  date_creation: string;
  date_modification: string;
  historique: HistoriqueEvent[];
  commentaires: Commentaire[];
}

export interface Categorie {
  id: string;
  nom: string;
  description: string;
  couleur: string;
}
