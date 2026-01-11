# Guide de déploiement Netlify

## ✅ Vérifications avant déploiement

1. **Firebase configuré** : `firebase-config.js` contient tes vraies clés Firebase
2. **Firestore activé** : La base de données Firestore est créée et en mode test
3. **Fichiers présents** :
   - ✅ `index.html`
   - ✅ `app.js`
   - ✅ `firebase-config.js`
   - ✅ `style.css`
   - ✅ `netlify.toml` (nouveau, pour le support des groupes)

## 🚀 Déploiement sur Netlify

### Méthode 1 : Glisser-déposer (le plus rapide)

1. Va sur [Netlify Drop](https://app.netlify.com/drop)
2. Glisse-dépose le dossier `NY-Forecast` entier
3. Netlify génère une URL automatique (ex: `random-name-123.netlify.app`)
4. **C'est déployé !** Partage l'URL avec tes amis

### Méthode 2 : Via Git (recommandé pour les mises à jour)

1. **Créer un repo GitHub** :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/ton-username/ny-forecast.git
   git push -u origin main
   ```

2. **Connecter à Netlify** :
   - Va sur [Netlify](https://app.netlify.com)
   - Clique sur "Add new site" > "Import an existing project"
   - Connecte ton compte GitHub
   - Sélectionne le repo `ny-forecast`
   - Clique sur "Deploy site"

3. **Configuration automatique** :
   - Netlify détecte automatiquement `netlify.toml`
   - Le site est déployé en quelques secondes
   - Tu reçois une URL (ex: `ny-forecast.netlify.app`)

## 🔗 URLs des groupes

Une fois déployé, tes groupes sont accessibles via :

- **Global** : `https://ton-app.netlify.app/`
- **CC** : `https://ton-app.netlify.app/?group=cc`
- **Kénopotes** : `https://ton-app.netlify.app/?group=kenopotes`
- **Famille** : `https://ton-app.netlify.app/?group=famille`

## 📝 Personnaliser l'URL Netlify

1. Dans Netlify, va dans "Site settings" > "Change site name"
2. Choisis un nom personnalisé (ex: `predictions-2026`)
3. Ton URL devient : `https://predictions-2026.netlify.app`

## 🔄 Mises à jour

Si tu utilises Git :
- Fais tes modifications
- `git add .`
- `git commit -m "Description des changements"`
- `git push`
- Netlify redéploie automatiquement !

## ⚠️ Important

- Les groupes sont créés automatiquement quand quelqu'un visite l'URL avec `?group=nom`
- Chaque groupe a ses propres données (utilisateurs, prédictions, votes)
- Les utilisateurs sont sauvegardés par groupe dans le localStorage du navigateur

## 🐛 Dépannage

**Le site ne charge pas** :
- Vérifie que `firebase-config.js` contient tes vraies clés Firebase
- Vérifie que Firestore est bien activé dans Firebase Console

**Les groupes ne fonctionnent pas** :
- Vérifie que `netlify.toml` est présent dans le repo
- Vérifie que la redirection `/*` vers `/index.html` est bien configurée

**Les données ne s'affichent pas** :
- Vérifie les règles Firestore dans Firebase Console
- En mode test, les règles doivent permettre read/write à tous





