# Prédictions 2026

Application simple pour faire des prédictions sur l'année 2026 avec tes amis.

## Configuration Firebase (5 minutes)

### 1. Créer un projet Firebase

1. Va sur [Firebase Console](https://console.firebase.google.com/)
2. Clique sur **"Ajouter un projet"**
3. Donne un nom (ex: "predictions-2026")
4. Désactive Google Analytics (pas nécessaire)
5. Clique sur **"Créer le projet"**

### 2. Ajouter une application web

1. Dans ton projet, clique sur l'icône **</>** (Web)
2. Donne un surnom (ex: "predictions-app")
3. **Ne coche pas** "Firebase Hosting"
4. Clique sur **"Enregistrer l'application"**
5. **Copie les valeurs de configuration** affichées

### 3. Configurer l'application

Ouvre `firebase-config.js` et remplace les valeurs :

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",           // Ta vraie clé API
    authDomain: "ton-projet.firebaseapp.com",
    projectId: "ton-projet",
    storageBucket: "ton-projet.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### 4. Activer Firestore

1. Dans Firebase Console, va dans **"Build" > "Firestore Database"**
2. Clique sur **"Créer une base de données"**
3. Choisis **"Mode test"** (pour commencer rapidement)
4. Sélectionne une région proche (ex: europe-west1)
5. Clique sur **"Activer"**

**Important** : Le mode test expire après 30 jours. Pour une utilisation prolongée, modifie les règles Firestore :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Déploiement sur Netlify (2 minutes)

### Option A : Glisser-déposer

1. Va sur [Netlify Drop](https://app.netlify.com/drop)
2. Glisse le dossier `NY-Forecast` sur la page
3. C'est déployé ! Copie l'URL et partage-la avec tes amis

### Option B : Avec Git

1. Crée un repo GitHub avec ces fichiers
2. Va sur [Netlify](https://netlify.com) et connecte-toi
3. Clique sur "Add new site" > "Import an existing project"
4. Connecte ton repo GitHub
5. Clique sur "Deploy"

**Note** : Le fichier `netlify.toml` est déjà configuré pour supporter les groupes via les query params.

## Utilisation

1. **Choisir son prénom** : Sélectionne ton prénom ou ajoute-le s'il n'existe pas
2. **Voter** : Pour chaque prédiction, vote Oui ou Non
3. **Voir les résultats** : L'onglet "Résultats" montre les votes de chacun
4. **Ajouter une prédiction** : L'onglet "+ Ajouter" permet de créer de nouvelles prédictions

## Groupes

L'application supporte plusieurs groupes séparés via le paramètre `?group=` dans l'URL.

### Liens par groupe

- **Données globales** : `https://ton-app.netlify.app/`
- **Groupe "cc"** : `https://ton-app.netlify.app/?group=cc`
- **Groupe "kenopotes"** : `https://ton-app.netlify.app/?group=kenopotes`
- **Groupe "famille"** : `https://ton-app.netlify.app/?group=famille`

Chaque groupe a :
- Ses propres utilisateurs
- Ses propres prédictions
- Ses propres votes et scores
- Son propre countdown

### Commandes admin (script Node.js)

```bash
# Voir les groupes existants
node firebase-admin.js groups

# Créer un nouveau groupe vide
node firebase-admin.js init nom-du-groupe

# Copier les données globales vers un groupe
node firebase-admin.js copy nom-du-groupe

# Gérer un groupe spécifique
node firebase-admin.js --group=cc list
node firebase-admin.js --group=cc users
node firebase-admin.js --group=cc adduser "Prénom"
node firebase-admin.js --group=cc resolve <ID> realized
```

## Structure des fichiers

```
NY-Forecast/
├── index.html          # Page principale
├── style.css           # Styles
├── app.js              # Logique JavaScript (gère les groupes)
├── firebase-config.js  # Configuration Firebase (à modifier)
├── firebase-admin.js   # Script admin pour gérer les groupes
├── netlify.toml        # Configuration Netlify
└── README.md           # Ce fichier
```
