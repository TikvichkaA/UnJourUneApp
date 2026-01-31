# Traducteur Antifasciste

Extension de navigateur qui traduit les euphémismes autoritaires en formulations politiques explicites.

## Positionnement

Cette extension est **explicitement antifasciste**. Elle ne prétend pas à la neutralité, ni à l'objectivité journalistique.

Son rôle est de **dévoiler, dénormaliser et désambiguïser** les discours autoritaires, nationalistes ou fascisants en traduisant leurs éléments de langage en termes politiques explicites.

## Installation

### Chrome / Chromium

1. Ouvrir `chrome://extensions/`
2. Activer le "Mode développeur" (en haut à droite)
3. Cliquer sur "Charger l'extension non empaquetée"
4. Sélectionner le dossier `29`

### Firefox

1. Ouvrir `about:debugging#/runtime/this-firefox`
2. Cliquer sur "Charger un module temporaire..."
3. Sélectionner le fichier `manifest.json` dans le dossier `29`

## Dictionnaire collaboratif

Le lexique peut être hébergé sur Supabase pour permettre les contributions.

### Configuration Supabase

1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Aller dans **SQL Editor** et exécuter le contenu de `supabase/schema.sql`
4. Aller dans **Settings > API** et copier :
   - **Project URL** → `SUPABASE_URL` dans `config.js`
   - **anon public key** → `SUPABASE_ANON_KEY` dans `config.js`
5. Mettre `ONLINE_MODE: true` dans `config.js`
6. Recharger l'extension

### Fonctionnalités collaboratives

- **Proposer une traduction** : formulaire dans le popup
- **Parcourir le dictionnaire** : recherche et filtres par catégorie
- **Votes** : les utilisateurs peuvent voter pour les traductions
- **Modération** : les propositions sont examinées avant publication

### Mode hors ligne

Par défaut, l'extension fonctionne en mode local avec le dictionnaire intégré (`translations.js`). Les contributions sont désactivées tant que Supabase n'est pas configuré.

## Mode Debug

Une version debug est disponible pour visualiser toutes les détections en temps réel.

### Installation du mode debug

1. Renommer `manifest.json` en `manifest-normal.json`
2. Renommer `manifest-debug.json` en `manifest.json`
3. Recharger l'extension

### Fonctionnalités debug

- **Panneau flottant** (en bas à droite) avec 3 onglets :
  - **Détections** : liste des expressions trouvées sur la page avec compteur
  - **Dictionnaire** : les 78 expressions avec recherche
  - **Regex** : affiche le pattern de détection
- **Console** : chaque détection est loguée avec couleurs
- Le panneau est **déplaçable** (glisser l'en-tête)
- Boutons pour **minimiser** ou **fermer**

## Génération des icônes

Pour générer les icônes PNG à partir du SVG source :

```bash
# Avec ImageMagick
convert -background none icons/icon.svg -resize 16x16 icons/icon16.png
convert -background none icons/icon.svg -resize 32x32 icons/icon32.png
convert -background none icons/icon.svg -resize 48x48 icons/icon48.png
convert -background none icons/icon.svg -resize 128x128 icons/icon128.png
```

Ou utiliser un outil en ligne comme https://svgtopng.com/

## Fonctionnement

Le plugin détecte automatiquement dans les pages web les expressions typiques du langage autoritaire et affiche leur "traduction politique" au survol.

- **Le texte original reste lisible**
- **La traduction apparaît en tooltip** au survol
- **Design sobre et tranchant**, sans humour ni caricature

## Ce que le plugin ne fait pas

- Il ne bloque pas les contenus
- Il n'empêche pas la lecture
- Il n'insulte pas
- Il n'appelle pas à la violence
- Il ne cible pas des personnes privées

**Il nomme. Il traduit. Il assume.**

## Exemples de traductions

| Expression originale | Traduction politique |
|---------------------|---------------------|
| Préférence nationale | Discrimination légale fondée sur l'origine |
| Rétablir l'ordre | Renforcement de la répression d'État |
| Immigration massive | Population désignée comme menace collective |
| Valeurs traditionnelles | Normes sociales imposées par l'État ou la majorité |
| Ensauvagement | Déshumanisation de populations ciblées |

## Licence

Logiciel libre - Utilisez, modifiez, partagez.
