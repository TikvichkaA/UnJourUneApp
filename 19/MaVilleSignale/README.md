# MaVille Signale

MVP de gestion des signalements municipaux pour agents.

## Contexte

Cette application est une **vitrine fonctionnelle** (MVP) destinee a demontrer la valeur d'un outil de gestion de signalements pour une petite ville.

**Objectif du MVP** :
- Demonstrer la valeur fonctionnelle
- Illustrer les cas d'usage reels
- Servir de support de discussion (DGS / elus / agents)

**Ce n'est PAS** :
- Un produit pret a la mise en production
- Une application integree a des systemes externes

## Perimetre du MVP

### Inclus
- Gestion interne de signalements
- Usage par agents municipaux
- Web app responsive (desktop + mobile)
- Donnees mockees
- Authentification simulee

### Exclus (volontairement)
- Portail habitants
- Integration IntraMuros
- Notifications reelles
- RGPD complet
- Performance / scalabilite
- Multi-communes

## Roles utilisateurs

| Role | Droits |
|------|--------|
| **Agent** | Voir ses signalements assignes/crees, creer un signalement, modifier le statut, commenter |
| **Responsable** | Tout voir, affecter/reaffecter, statistiques |
| **Admin** | Gestion des comptes, parametrage des categories |

## Fonctionnalites

### 1. Connexion (simulee)
- Selection d'un utilisateur predifini
- Pas de securite avancee (MVP)

### 2. Tableau de bord
- Liste des signalements (filtree selon le role)
- Filtres : statut, categorie, priorite, recherche
- Acces au detail de chaque signalement

### 3. Creation de signalement
- Formulaire simple
- Upload photo (mock)
- Localisation texte libre

### 4. Detail d'un signalement
- Informations completes
- Historique des evenements
- Commentaires
- Changement de statut
- Affectation (si autorise)

### 5. Statistiques (Responsable/Admin)
- Nombre total de signalements
- Repartition par statut
- Repartition par categorie
- Repartition par priorite
- Charge par agent

### 6. Administration (Admin)
- CRUD utilisateurs
- CRUD categories

## Flux utilisateurs cles

### Flux 1 - Agent terrain
1. Se connecte
2. Cree un signalement
3. Ajoute une photo (simule)
4. Voit le statut evoluer

### Flux 2 - Responsable
1. Se connecte
2. Voit tous les signalements
3. Affecte a un agent
4. Suit la resolution

## Donnees de test

### Utilisateurs precharges
- **Jean Dupont** (Agent)
- **Marie Martin** (Agent)
- **Pierre Durand** (Responsable)
- **Sophie Bernard** (Admin)

### Categories predefinies
- Voirie
- Eclairage public
- Espaces verts
- Proprete
- Mobilier urbain

### Signalements exemples
- 6 signalements de demonstration avec statuts varies

## Stack technique

- **Frontend** : Next.js 14 (React)
- **Style** : Tailwind CSS
- **State** : Zustand
- **Icons** : Lucide React
- **Base de donnees** : In-memory (pas de persistance)

## Installation

```bash
# Installation des dependances
npm install

# Lancement en mode developpement
npm run dev

# Build production
npm run build

# Lancement production
npm start
```

L'application sera disponible sur `http://localhost:3000`

## Structure du projet

```
src/
  app/
    globals.css      # Styles globaux
    layout.tsx       # Layout principal
    page.tsx         # Page principale (routage)
  components/
    Admin.tsx        # Interface administration
    Dashboard.tsx    # Tableau de bord
    DetailSignalement.tsx  # Page detail
    LoginPage.tsx    # Connexion
    NouveauSignalement.tsx # Creation
    Sidebar.tsx      # Navigation
    Stats.tsx        # Statistiques
  lib/
    mockData.ts      # Donnees de test
    types.ts         # Types TypeScript
  store/
    useStore.ts      # Store Zustand
```

## Ce que montre ce MVP

1. **Clarté métier** : Workflow complet de gestion de signalement
2. **UX sobre** : Interface "outil pro" lisible et efficace
3. **Responsive** : Fonctionne sur desktop et mobile
4. **Rôles différenciés** : Chaque profil a une vue adaptée
5. **Traçabilité** : Historique complet des actions

## Limitations connues (MVP)

- Pas de persistance des données (refresh = reset)
- Photos simulées (pas d'upload réel)
- Authentification simulée (pas de sécurité)
- Pas de géolocalisation
- Pas de notifications
- Pas d'export de données
