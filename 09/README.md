# Liens d'Interet - Politiciens Francais

Application web interactive pour visualiser les liens d'interet des politiciens francais.

## Fonctionnalites

- Graphe interactif D3.js avec zoom/pan
- Fiches detaillees par politicien
- Filtres par parti et type de lien
- Recherche par nom
- Donnees: commissions, votes, entreprises, liens personnels

## Mode Local (donnees simulees)

Ouvrez simplement `index.html` dans un navigateur.

## Mode Supabase (donnees reelles)

### 1. Creer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Creez un nouveau projet
3. Notez l'URL et les cles API

### 2. Executer le schema SQL

1. Dans Supabase, allez dans "SQL Editor"
2. Copiez-collez le contenu de `supabase/schema.sql`
3. Executez

### 3. Importer les donnees

```bash
cd scripts
npm install
cp .env.example .env
# Editez .env avec vos identifiants Supabase
npm run import:all
```

### 4. Configurer l'application

Editez `config.js`:

```javascript
const CONFIG = {
    mode: 'supabase',
    supabase: {
        url: 'https://VOTRE_PROJET.supabase.co',
        anonKey: 'VOTRE_ANON_KEY'
    }
};
```

### 5. Lancer l'application

Servez les fichiers avec un serveur HTTP:

```bash
npx serve .
# ou
python -m http.server 8000
```

## Sources de donnees

| Source | Donnees |
|--------|---------|
| NosDéputes.fr | Deputes, votes, commissions |
| HATVP | Declarations d'interets (a venir) |
| data.gouv.fr | Listes d'elus |

## Structure

```
09/
├── index.html          # Page principale
├── styles.css          # Styles
├── config.js           # Configuration
├── data.js             # Donnees simulees
├── supabase-client.js  # Client API
├── graph.js            # Visualisation D3
├── app.js              # Logique principale
├── supabase/
│   └── schema.sql      # Schema base de donnees
└── scripts/
    ├── import-all.js
    ├── import-deputes.js
    ├── import-votes.js
    └── import-commissions.js
```
