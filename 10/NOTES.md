# SubVeille - Notes de developpement

## Concept
Outil de veille pour associations et acteurs de l'ESS permettant de trouver des appels a projets.

## Structure actuelle

```
10/
├── index.html      # Page principale
├── css/
│   └── style.css   # Styles (theme clair, couleurs vertes)
├── js/
│   ├── sources.js  # Module de donnees (demo + structure API)
│   └── app.js      # Application principale
└── NOTES.md        # Ce fichier
```

## Fonctionnalites implementees

- [x] Interface de recherche avec filtres
- [x] Filtres : secteur, financeur, statut, montant
- [x] Affichage des resultats en cartes
- [x] Panel de detail
- [x] Indicateurs de deadline (urgent, bientot, ok)
- [x] Donnees de demo (8 appels a projets fictifs)

## A implementer

### Sources de donnees reelles

1. **Aides-territoires** (API gouvernementale) - INTEGRE
   - URL: https://aides-territoires.beta.gouv.fr/api/
   - Endpoint: /aids/ avec filtres (text, targeted_audiences, categories, is_call_for_project)
   - Gratuit, pas de cle API requise
   - Cache de 10 minutes implemente

2. **data.gouv.fr** - Subventions
   - Dataset: subventions-aux-associations
   - Format: CSV/JSON

3. **BOAMP** (marches publics)
   - API officielle disponible

4. **Fondation de France**
   - Pas d'API, scraping necessaire

### Fonctionnalites a ajouter

- [x] Integration API Aides-territoires
- [ ] Favoris / Watchlist
- [ ] Alertes email (necessite backend)
- [ ] Export PDF/CSV
- [ ] Historique des laureats
- [ ] Carte des territoires
- [ ] Mode sombre
- [ ] PWA (mode offline)

## APIs utiles

```javascript
// Aides-territoires - Exemple de requete
fetch('https://aides-territoires.beta.gouv.fr/api/aids/?is_live=true&targeted_audiences=association')
  .then(r => r.json())
  .then(data => console.log(data.results));

// Parametres utiles :
// - targeted_audiences: association, commune, epci, etc.
// - categories: culture, environnement, etc.
// - is_live: true (appels en cours)
```

## Secteurs disponibles

| Code | Libelle |
|------|---------|
| culture | Culture et patrimoine |
| environnement | Environnement et developpement durable |
| social | Action sociale |
| education | Education et formation |
| sante | Sante |
| sport | Sport |
| solidarite | Solidarite internationale |
| insertion | Insertion professionnelle |
| numerique | Numerique et innovation |
