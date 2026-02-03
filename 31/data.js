// Catalogue de plantes avec fréquences d'arrosage
const CATALOGUE_PLANTES = [
    {
        id: 'basilic',
        nom: 'Basilic',
        emoji: '🌿',
        frequenceEte: 2,
        frequenceHiver: 3,
        conseils: 'Sol humide mais pas détrempé. Aime la lumière.'
    },
    {
        id: 'menthe',
        nom: 'Menthe',
        emoji: '🌱',
        frequenceEte: 2,
        frequenceHiver: 4,
        conseils: 'Très gourmande en eau. Supporte la mi-ombre.'
    },
    {
        id: 'cactus',
        nom: 'Cactus',
        emoji: '🌵',
        frequenceEte: 14,
        frequenceHiver: 30,
        conseils: 'Peu d\'eau, beaucoup de lumière. Laisser sécher entre deux arrosages.'
    },
    {
        id: 'ficus',
        nom: 'Ficus',
        emoji: '🌳',
        frequenceEte: 7,
        frequenceHiver: 10,
        conseils: 'Arroser quand le sol est sec sur 2cm. Éviter les courants d\'air.'
    },
    {
        id: 'orchidee',
        nom: 'Orchidée',
        emoji: '🌸',
        frequenceEte: 7,
        frequenceHiver: 10,
        conseils: 'Trempage 15min puis égouttage. Lumière indirecte.'
    },
    {
        id: 'aloe',
        nom: 'Aloe Vera',
        emoji: '🪴',
        frequenceEte: 14,
        frequenceHiver: 21,
        conseils: 'Laisser sécher complètement entre les arrosages.'
    },
    {
        id: 'pothos',
        nom: 'Pothos',
        emoji: '💚',
        frequenceEte: 7,
        frequenceHiver: 10,
        conseils: 'Facile à vivre. Arroser quand les feuilles s\'affaissent.'
    },
    {
        id: 'monstera',
        nom: 'Monstera',
        emoji: '🍃',
        frequenceEte: 7,
        frequenceHiver: 14,
        conseils: 'Sol légèrement humide. Brumiser les feuilles.'
    },
    {
        id: 'lavande',
        nom: 'Lavande',
        emoji: '💜',
        frequenceEte: 7,
        frequenceHiver: 14,
        conseils: 'Préfère les sols secs. Plein soleil.'
    },
    {
        id: 'romarin',
        nom: 'Romarin',
        emoji: '🌲',
        frequenceEte: 5,
        frequenceHiver: 10,
        conseils: 'Aromatique méditerranéenne. Résiste à la sécheresse.'
    },
    {
        id: 'thym',
        nom: 'Thym',
        emoji: '🍀',
        frequenceEte: 5,
        frequenceHiver: 10,
        conseils: 'Peu d\'eau. Sol bien drainé.'
    },
    {
        id: 'persil',
        nom: 'Persil',
        emoji: '🥬',
        frequenceEte: 2,
        frequenceHiver: 4,
        conseils: 'Sol frais. Mi-ombre acceptée.'
    },
    {
        id: 'tomate',
        nom: 'Tomate',
        emoji: '🍅',
        frequenceEte: 1,
        frequenceHiver: 3,
        conseils: 'Arrosage régulier au pied. Éviter de mouiller les feuilles.'
    },
    {
        id: 'fraisier',
        nom: 'Fraisier',
        emoji: '🍓',
        frequenceEte: 2,
        frequenceHiver: 5,
        conseils: 'Sol frais mais pas détrempé. Paillage recommandé.'
    },
    {
        id: 'ciboulette',
        nom: 'Ciboulette',
        emoji: '🧅',
        frequenceEte: 3,
        frequenceHiver: 5,
        conseils: 'Sol frais. Couper régulièrement pour stimuler la pousse.'
    },
    {
        id: 'succulente',
        nom: 'Succulente',
        emoji: '🪻',
        frequenceEte: 10,
        frequenceHiver: 21,
        conseils: 'Très peu d\'eau. Lumière vive.'
    },
    {
        id: 'palmier',
        nom: 'Palmier d\'intérieur',
        emoji: '🌴',
        frequenceEte: 5,
        frequenceHiver: 10,
        conseils: 'Brumiser régulièrement. Sol légèrement humide.'
    },
    {
        id: 'geranium',
        nom: 'Géranium',
        emoji: '🌺',
        frequenceEte: 3,
        frequenceHiver: 7,
        conseils: 'Arrosage modéré. Supprimer les fleurs fanées.'
    },
    {
        id: 'rose',
        nom: 'Rosier',
        emoji: '🌹',
        frequenceEte: 3,
        frequenceHiver: 7,
        conseils: 'Arrosage au pied. Aime le soleil.'
    },
    {
        id: 'bambou',
        nom: 'Bambou Lucky',
        emoji: '🎋',
        frequenceEte: 7,
        frequenceHiver: 10,
        conseils: 'Peut pousser dans l\'eau. Changer l\'eau régulièrement.'
    }
];

// Catégories d'ingrédients
const CATEGORIES_INGREDIENTS = {
    'fruits-legumes': { emoji: '🥕', nom: 'Fruits & Légumes' },
    'produits-laitiers': { emoji: '🧀', nom: 'Produits laitiers' },
    'viandes': { emoji: '🥩', nom: 'Viandes & Poissons' },
    'autres': { emoji: '📦', nom: 'Autres' }
};

// Base de recettes anti-gaspi
const RECETTES = [
    {
        id: 'omelette',
        nom: 'Omelette garnie',
        emoji: '🍳',
        ingredients: ['oeufs'],
        optionnels: ['fromage', 'jambon', 'champignons', 'oignons', 'tomates'],
        temps: 10,
        instructions: `1. Battre les œufs avec sel et poivre
2. Chauffer une poêle avec un peu de beurre
3. Verser les œufs et ajouter les garnitures
4. Replier quand c'est presque cuit
5. Servir chaud`
    },
    {
        id: 'quiche',
        nom: 'Quiche express',
        emoji: '🥧',
        ingredients: ['oeufs', 'creme', 'pate-feuilletee'],
        optionnels: ['lardons', 'fromage', 'oignons', 'poireaux', 'epinards'],
        temps: 45,
        instructions: `1. Préchauffer le four à 180°C
2. Étaler la pâte dans un moule
3. Mélanger œufs, crème, sel, poivre
4. Ajouter les garnitures sur la pâte
5. Verser l'appareil et enfourner 35min`
    },
    {
        id: 'salade-composee',
        nom: 'Salade composée',
        emoji: '🥗',
        ingredients: ['salade'],
        optionnels: ['tomates', 'concombre', 'oeufs', 'thon', 'mais', 'fromage', 'jambon'],
        temps: 15,
        instructions: `1. Laver et essorer la salade
2. Couper tous les ingrédients
3. Disposer dans un saladier
4. Assaisonner avec vinaigrette
5. Mélanger et servir frais`
    },
    {
        id: 'pates-legumes',
        nom: 'Pâtes aux légumes',
        emoji: '🍝',
        ingredients: ['pates'],
        optionnels: ['courgettes', 'tomates', 'poivrons', 'oignons', 'ail', 'parmesan', 'creme'],
        temps: 25,
        instructions: `1. Cuire les pâtes al dente
2. Faire revenir les légumes coupés
3. Ajouter ail et assaisonnement
4. Mélanger pâtes et légumes
5. Ajouter parmesan ou crème`
    },
    {
        id: 'riz-sauté',
        nom: 'Riz sauté',
        emoji: '🍚',
        ingredients: ['riz'],
        optionnels: ['oeufs', 'petits-pois', 'carottes', 'oignons', 'poulet', 'crevettes'],
        temps: 20,
        instructions: `1. Utiliser du riz froid (de la veille)
2. Faire sauter les légumes au wok
3. Ajouter le riz et bien mélanger
4. Incorporer l'œuf battu
5. Assaisonner avec sauce soja`
    },
    {
        id: 'gratin-legumes',
        nom: 'Gratin de légumes',
        emoji: '🧀',
        ingredients: ['fromage', 'creme'],
        optionnels: ['pommes-de-terre', 'courgettes', 'aubergines', 'tomates', 'oignons'],
        temps: 50,
        instructions: `1. Préchauffer le four à 180°C
2. Couper les légumes en rondelles
3. Disposer en couches dans un plat
4. Napper de crème, saler, poivrer
5. Couvrir de fromage et enfourner 40min`
    },
    {
        id: 'soupe-legumes',
        nom: 'Soupe de légumes',
        emoji: '🍲',
        ingredients: [],
        optionnels: ['carottes', 'poireaux', 'pommes-de-terre', 'courgettes', 'navets', 'oignons', 'celeri'],
        temps: 40,
        instructions: `1. Éplucher et couper les légumes
2. Faire revenir dans un peu d'huile
3. Couvrir d'eau ou bouillon
4. Cuire 30min à feu doux
5. Mixer et assaisonner`
    },
    {
        id: 'croque-monsieur',
        nom: 'Croque-monsieur',
        emoji: '🥪',
        ingredients: ['pain', 'jambon', 'fromage'],
        optionnels: ['beurre', 'bechamel'],
        temps: 15,
        instructions: `1. Beurrer les tranches de pain
2. Disposer jambon et fromage
3. Refermer le sandwich
4. Griller à la poêle ou au four
5. Servir chaud et croustillant`
    },
    {
        id: 'smoothie',
        nom: 'Smoothie fruits',
        emoji: '🥤',
        ingredients: ['banane'],
        optionnels: ['fraises', 'pomme', 'kiwi', 'orange', 'yaourt', 'lait'],
        temps: 5,
        instructions: `1. Éplucher et couper les fruits
2. Mettre dans le blender
3. Ajouter yaourt ou lait
4. Mixer jusqu'à consistance lisse
5. Servir frais`
    },
    {
        id: 'compote',
        nom: 'Compote maison',
        emoji: '🍎',
        ingredients: ['pomme'],
        optionnels: ['poire', 'banane', 'cannelle', 'sucre'],
        temps: 25,
        instructions: `1. Éplucher et couper les fruits
2. Mettre dans une casserole avec un fond d'eau
3. Cuire à feu doux 20min
4. Écraser à la fourchette ou mixer
5. Ajouter sucre/cannelle selon goût`
    },
    {
        id: 'tartine-avocat',
        nom: 'Tartine avocat',
        emoji: '🥑',
        ingredients: ['pain', 'avocat'],
        optionnels: ['oeufs', 'tomates', 'citron', 'fromage-frais'],
        temps: 10,
        instructions: `1. Toaster le pain
2. Écraser l'avocat avec citron, sel, poivre
3. Tartiner généreusement
4. Ajouter garnitures (œuf poché, tomates...)
5. Déguster immédiatement`
    },
    {
        id: 'cake-sale',
        nom: 'Cake salé',
        emoji: '🍞',
        ingredients: ['oeufs', 'farine', 'lait'],
        optionnels: ['olives', 'jambon', 'fromage', 'tomates-sechees', 'lardons'],
        temps: 60,
        instructions: `1. Préchauffer le four à 180°C
2. Mélanger farine, œufs, lait, huile
3. Ajouter les garnitures coupées
4. Verser dans un moule à cake
5. Enfourner 45min, vérifier la cuisson`
    },
    {
        id: 'wrap',
        nom: 'Wrap garni',
        emoji: '🌯',
        ingredients: ['tortilla'],
        optionnels: ['poulet', 'salade', 'tomates', 'concombre', 'fromage', 'sauce'],
        temps: 10,
        instructions: `1. Étaler la sauce sur la tortilla
2. Disposer les ingrédients au centre
3. Replier les côtés
4. Rouler serré
5. Couper en deux et déguster`
    },
    {
        id: 'frittata',
        nom: 'Frittata',
        emoji: '🥘',
        ingredients: ['oeufs'],
        optionnels: ['pommes-de-terre', 'oignons', 'poivrons', 'courgettes', 'fromage', 'herbes'],
        temps: 30,
        instructions: `1. Faire revenir les légumes
2. Battre les œufs avec sel/poivre
3. Verser sur les légumes
4. Cuire à feu doux couvert
5. Finir au gril si besoin`
    },
    {
        id: 'pain-perdu',
        nom: 'Pain perdu',
        emoji: '🥞',
        ingredients: ['pain', 'oeufs', 'lait'],
        optionnels: ['sucre', 'cannelle', 'fruits'],
        temps: 15,
        instructions: `1. Mélanger œufs, lait, sucre
2. Tremper les tranches de pain
3. Faire dorer à la poêle beurrée
4. Retourner et cuire l'autre face
5. Servir avec sucre ou fruits`
    },
    {
        id: 'bruschetta',
        nom: 'Bruschetta',
        emoji: '🍅',
        ingredients: ['pain', 'tomates'],
        optionnels: ['ail', 'basilic', 'mozzarella', 'huile-olive'],
        temps: 15,
        instructions: `1. Couper les tomates en dés
2. Assaisonner avec ail, basilic, huile
3. Toaster le pain
4. Frotter avec une gousse d'ail
5. Garnir généreusement et servir`
    },
    {
        id: 'gateau-yaourt',
        nom: 'Gâteau au yaourt',
        emoji: '🎂',
        ingredients: ['yaourt', 'oeufs', 'farine', 'sucre'],
        optionnels: ['chocolat', 'pomme', 'citron'],
        temps: 45,
        instructions: `1. Préchauffer à 180°C
2. Mélanger yaourt, sucre, œufs
3. Ajouter farine et levure
4. Verser dans un moule beurré
5. Cuire 35min`
    },
    {
        id: 'crumble',
        nom: 'Crumble aux fruits',
        emoji: '🥧',
        ingredients: ['pomme', 'beurre', 'farine', 'sucre'],
        optionnels: ['poire', 'peche', 'abricots', 'flocons-avoine'],
        temps: 45,
        instructions: `1. Préchauffer à 180°C
2. Couper les fruits dans un plat
3. Mélanger farine, beurre froid, sucre du bout des doigts
4. Répartir sur les fruits
5. Enfourner 35min jusqu'à doré`
    },
    {
        id: 'banana-bread',
        nom: 'Banana bread',
        emoji: '🍌',
        ingredients: ['banane', 'oeufs', 'farine', 'sucre'],
        optionnels: ['chocolat', 'noix', 'beurre'],
        temps: 60,
        instructions: `1. Préchauffer à 180°C
2. Écraser les bananes très mûres
3. Mélanger avec œufs, sucre, beurre fondu
4. Ajouter farine et levure
5. Cuire 50min dans un moule à cake`
    },
    {
        id: 'ratatouille',
        nom: 'Ratatouille',
        emoji: '🍆',
        ingredients: ['courgettes', 'aubergines', 'tomates'],
        optionnels: ['poivrons', 'oignons', 'ail', 'herbes-de-provence'],
        temps: 50,
        instructions: `1. Couper tous les légumes en cubes
2. Faire revenir oignons et ail
3. Ajouter les légumes progressivement
4. Assaisonner avec herbes
5. Mijoter 40min à feu doux`
    },
    {
        id: 'pizza-maison',
        nom: 'Pizza express',
        emoji: '🍕',
        ingredients: ['pate-a-pizza', 'sauce-tomate', 'fromage'],
        optionnels: ['jambon', 'champignons', 'olives', 'poivrons', 'oignons'],
        temps: 25,
        instructions: `1. Préchauffer à 220°C
2. Étaler la pâte
3. Napper de sauce tomate
4. Disposer les garnitures
5. Couvrir de fromage et enfourner 15min`
    },
    {
        id: 'crepes',
        nom: 'Crêpes',
        emoji: '🥞',
        ingredients: ['oeufs', 'farine', 'lait'],
        optionnels: ['sucre', 'beurre', 'chocolat', 'confiture', 'jambon', 'fromage'],
        temps: 30,
        instructions: `1. Mélanger farine, œufs, lait
2. Laisser reposer 30min (optionnel)
3. Chauffer une poêle beurrée
4. Verser une louche et étaler
5. Retourner quand doré, garnir et servir`
    },
    {
        id: 'club-sandwich',
        nom: 'Club sandwich',
        emoji: '🥪',
        ingredients: ['pain', 'poulet', 'salade'],
        optionnels: ['tomates', 'oeufs', 'bacon', 'mayonnaise'],
        temps: 15,
        instructions: `1. Toaster le pain
2. Tartiner de mayonnaise
3. Empiler salade, poulet, tomate
4. Ajouter une tranche de pain au milieu
5. Couper en triangles`
    },
    {
        id: 'soupe-potiron',
        nom: 'Velouté de potiron',
        emoji: '🎃',
        ingredients: ['potiron'],
        optionnels: ['pommes-de-terre', 'oignons', 'creme', 'muscade'],
        temps: 40,
        instructions: `1. Éplucher et couper le potiron
2. Faire revenir avec oignons
3. Couvrir de bouillon
4. Cuire 25min et mixer
5. Ajouter crème et muscade`
    },
    {
        id: 'curry-legumes',
        nom: 'Curry de légumes',
        emoji: '🍛',
        ingredients: ['lait-de-coco', 'curry'],
        optionnels: ['poulet', 'pois-chiches', 'carottes', 'courgettes', 'oignons', 'riz'],
        temps: 35,
        instructions: `1. Faire revenir oignons et curry
2. Ajouter les légumes coupés
3. Verser le lait de coco
4. Mijoter 20min
5. Servir avec du riz`
    },
    {
        id: 'oeufs-brouilles',
        nom: 'Œufs brouillés',
        emoji: '🥚',
        ingredients: ['oeufs', 'beurre'],
        optionnels: ['creme', 'ciboulette', 'saumon-fume', 'fromage'],
        temps: 10,
        instructions: `1. Battre les œufs légèrement
2. Chauffer beurre à feu doux
3. Verser les œufs et remuer
4. Retirer du feu encore baveux
5. Assaisonner et servir sur toast`
    },
    {
        id: 'taboulé',
        nom: 'Taboulé',
        emoji: '🥗',
        ingredients: ['semoule', 'tomates'],
        optionnels: ['concombre', 'menthe', 'persil', 'oignons', 'citron'],
        temps: 20,
        instructions: `1. Faire gonfler la semoule dans l'eau
2. Couper les légumes en petits dés
3. Ciseler les herbes
4. Mélanger le tout
5. Assaisonner huile, citron, sel`
    },
    {
        id: 'welsh',
        nom: 'Welsh',
        emoji: '🧀',
        ingredients: ['pain', 'jambon', 'cheddar', 'biere'],
        optionnels: ['oeufs', 'moutarde'],
        temps: 20,
        instructions: `1. Toaster le pain
2. Disposer le jambon dessus
3. Faire fondre cheddar avec bière
4. Napper le tout
5. Gratiner et servir avec œuf`
    },
    {
        id: 'galette-legumes',
        nom: 'Galettes de légumes',
        emoji: '🥔',
        ingredients: ['oeufs'],
        optionnels: ['courgettes', 'carottes', 'pommes-de-terre', 'oignons', 'farine', 'fromage'],
        temps: 25,
        instructions: `1. Râper les légumes
2. Mélanger avec œuf et farine
3. Assaisonner
4. Former des galettes
5. Dorer à la poêle des deux côtés`
    }
];

// Mapping des noms courants vers les IDs d'ingrédients pour le matching
const INGREDIENT_ALIASES = {
    'oeuf': 'oeufs',
    'œuf': 'oeufs',
    'œufs': 'oeufs',
    'tomate': 'tomates',
    'carotte': 'carottes',
    'oignon': 'oignons',
    'pomme de terre': 'pommes-de-terre',
    'patate': 'pommes-de-terre',
    'courgette': 'courgettes',
    'aubergine': 'aubergines',
    'poivron': 'poivrons',
    'champignon': 'champignons',
    'petit pois': 'petits-pois',
    'crème': 'creme',
    'crème fraîche': 'creme',
    'lait de coco': 'lait-de-coco',
    'pâte feuilletée': 'pate-feuilletee',
    'pâte à pizza': 'pate-a-pizza',
    'sauce tomate': 'sauce-tomate'
};
