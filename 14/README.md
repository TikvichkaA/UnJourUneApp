# Veille Municipales 2026 - Communes à risque ED

Application web de suivi des communes françaises à risque de basculer à l'extrême droite lors des élections municipales de mars 2026.

## Fonctionnalités

- **Cartographie des communes à risque** : 90+ communes classées par niveau de risque (E/D/C)
- **Suivi des candidats** : 100+ candidats RN, UDR, Reconquête identifiés
- **Base de dingueries** : 24+ propos polémiques documentés et sourcés
- **Filtres et recherche** : par score de risque, par département, par nom
- **Export** : génération de rapports Markdown
- **Persistance** : Supabase + localStorage en fallback

## Scores de risque

| Score | Signification | Couleur |
|-------|---------------|---------|
| E | ED déjà au pouvoir | Rouge |
| D | Risque significatif | Orange |
| C | Risque possible | Jaune |

## Stack technique

- **Frontend** : HTML/CSS/JS vanilla
- **Backend** : Supabase (PostgreSQL)
- **Scraping** : Node.js + Cheerio

## Structure

```
14/
├── index.html                      # Application principale
├── config.js                       # Configuration Supabase
├── supabase-schema.sql             # Schéma de la base de données
│
├── import-supabase.js              # Import initial StreetPress
├── import-datagouv.js              # Import candidatures officielles data.gouv.fr
├── import-nouvelles-communes.js    # Import grandes villes + candidats manuels
│
├── scraper.js                      # Scraper presse (têtes de liste)
├── scraper-colistiers.js           # Scraper enrichi (colistiers + équipes)
├── scraper-dingueries.js           # Scraper dingueries StreetPress
│
├── nouvelles-communes-candidats.json  # Données manuelles vérifiées
├── streetpress-communes-risque.json   # Export carte StreetPress
│
└── README.md
```

## Base de données Supabase

### Tables

| Table | Description |
|-------|-------------|
| `communes` | Communes surveillées (id, nom, département, score, maire, population) |
| `candidats` | Candidats ED (nom, parti, commune_id, rôle, détail) |
| `dingueries` | Propos polémiques (auteur, citation, type, source, contexte) |
| `sources_scraping` | Sources de veille |

## Installation

```bash
# Cloner et installer
cd 14
npm install

# Importer les données dans Supabase
node import-supabase.js
```

## Utilisation

Ouvrir `index.html` dans un navigateur ou servir via un serveur local :

```bash
npx serve .
```

## Sources principales

- [StreetPress - Carte des villes à risque](https://www.streetpress.com/sujet/1758557171-municipales-dix-villes-pourraient-basculer-extreme-droite)
- [Basta Media - 50 villes qui pourraient basculer](https://basta.media/La-carte-des-cinquante-villes-qui-pourraient-basculer-extreme-droite-elections-municipales)
- [Times of Israel - Candidats RN polémiques](https://fr.timesofisrael.com/les-candidats-du-rn-qui-font-tache-leurs-propos-antisemites-racistes-et-complotistes/)
- [Les Jours - Casseroles des députés RN](https://lesjours.fr/obsessions/rn-derniere-marche-2/)
- [France Info - Investitures municipales](https://www.franceinfo.fr/elections/municipales/)

## Ajouter des données

### Via l'interface
1. Cliquer sur "Ajouter candidat" sur une commune
2. Cliquer sur "Signaler une dinguerie"

### Via script
Modifier `import-supabase.js` et relancer :
```bash
node import-supabase.js
```

## Enrichissement des candidats (colistiers et listes complètes)

### Contexte

Le schéma supporte 3 rôles pour les candidats : `tete`, `colistier`, `soutien`.
Initialement seules les têtes de liste sont importées. Plusieurs outils permettent d'enrichir avec les colistiers.

### Outils disponibles

#### 1. Données manuelles vérifiées (20+ candidats)

Fichier `nouvelles-communes-candidats.json` avec grandes villes (Marseille, Lyon, Nantes, Toulon, Bordeaux...) et candidats sourcés.

```bash
# Importer les communes + candidats manuels
node import-nouvelles-communes.js
```

#### 2. Scraper colistiers

Script `scraper-colistiers.js` avec patterns enrichis pour extraire les équipes complètes.

```bash
node scraper-colistiers.js --help             # Voir les options
node scraper-colistiers.js --manuels          # Voir données intégrées
node scraper-colistiers.js --import-manuels   # Importer en BDD
node scraper-colistiers.js --all              # Scraper toutes les sources
node scraper-colistiers.js --export out.json  # Exporter
```

#### 3. Import data.gouv.fr (listes officielles)

Script `import-datagouv.js` pour importer les candidatures officielles après le dépôt (26/02/2026).

```bash
node import-datagouv.js --check                              # Vérifier disponibilité
node import-datagouv.js --download                           # Télécharger CSV
node import-datagouv.js --import fichier.csv --filter-ed     # Importer ED seulement
node import-datagouv.js --import fichier.csv --communes      # Nos communes seulement
node import-datagouv.js --import fichier.csv --dry-run       # Simulation
```

### Calendrier municipales 2026

| Date | Événement |
|------|-----------|
| 26/02/2026 18h | Dépôt des candidatures en préfecture |
| ~27-28/02/2026 | Publication sur data.gouv.fr |
| 15/03/2026 | 1er tour |
| 22/03/2026 | 2nd tour |

### Stratégie recommandée

1. **Maintenant** : `node import-nouvelles-communes.js` (20 candidats vérifiés)
2. **Mi-février** : `node import-datagouv.js --check` (surveiller publication)
3. **Fin février** : `node import-datagouv.js --import <file> --filter-ed --communes` (import massif)

### Candidats identifiés (février 2026)

| Ville | Candidat | Parti | Source |
|-------|----------|-------|--------|
| Marseille | Franck Allisio + 8 secteurs | RN | France Bleu |
| Lyon | Alexandre Dupalais | UDR | Lyon People |
| Nantes | Jean-Claude Hulot | RN | France Bleu |
| Toulon | Laure Lavalette | RN | Var Matin |
| Bordeaux | Virginie Bonthoux Tournay | Reconquête | CNews |
| Nice | Eric Ciotti + équipe | UDR | Nice Presse |
| Annecy | Guillaume Roit-Levêque | RN | Acteurs Annecy |

### Nuances politiques ED surveillées

- `LRN` : Rassemblement National
- `LREC` : Reconquête
- `LUDR` : Union des droites (Ciotti)
- `LEXD` : Extrême droite divers

## Licence

Projet à but informatif et citoyen.
