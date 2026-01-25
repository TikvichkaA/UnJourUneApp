// Galerie de photos d'installations électriques
// Sources : Unsplash (CC0), Wikimedia Commons (CC-BY/CC0)

export const galerieData = {
  categories: [
    {
      id: "tableaux",
      titre: "Tableaux électriques",
      icon: "🔲",
      description: "Exemples de tableaux conformes",
      count: 5
    },
    {
      id: "appareillage",
      titre: "Appareillage",
      icon: "🔌",
      description: "DDR, disjoncteurs, prises",
      count: 6
    },
    {
      id: "cablage",
      titre: "Câblage",
      icon: "🔗",
      description: "Bonnes pratiques de câblage",
      count: 4
    },
    {
      id: "defauts",
      titre: "Défauts à éviter",
      icon: "⚠️",
      description: "Exemples de non-conformités",
      count: 5
    },
    {
      id: "chantier",
      titre: "Chantier",
      icon: "🏗️",
      description: "Installation en situation",
      count: 4
    }
  ],

  images: [
    // ===== TABLEAUX =====
    {
      id: "tab1",
      category: "tableaux",
      src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
      titre: "Tableau électrique résidentiel moderne",
      description: "Tableau avec DDR, disjoncteurs divisionnaires bien repérés. Exemple de bonne organisation avec peignes d'alimentation.",
      tags: ["tableau", "DDR", "disjoncteur", "conforme"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Repérage clair des circuits",
        "Réserve pour extensions futures",
        "Peignes d'alimentation horizontaux"
      ]
    },
    {
      id: "tab2",
      category: "tableaux",
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      titre: "Coffret de chantier",
      description: "Tableau provisoire de chantier avec protections adaptées. Armoire IP65 pour usage extérieur.",
      tags: ["tableau", "chantier", "provisoire"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Indice de protection IP65",
        "DDR 30mA obligatoire",
        "Verrouillage des protections"
      ]
    },
    {
      id: "tab3",
      category: "tableaux",
      src: "https://images.unsplash.com/photo-1545259741-2266eb9ed588?w=800&q=80",
      titre: "Tableau triphasé",
      description: "Installation triphasée avec équilibrage des phases et protections adaptées.",
      tags: ["tableau", "triphasé", "industrie"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Répartition équilibrée des charges",
        "Tétrapolaire en tête",
        "Barres de répartition cuivre"
      ]
    },
    {
      id: "tab4",
      category: "tableaux",
      src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
      titre: "GTL complète",
      description: "Gaine Technique Logement avec tableau électrique, coffret communication et espace ERDF.",
      tags: ["GTL", "tableau", "communication"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Espace minimum 600x200mm",
        "Coffret communication intégré",
        "Accessible et ventilé"
      ]
    },
    {
      id: "tab5",
      category: "tableaux",
      src: "https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=800&q=80",
      titre: "Tableau industriel",
      description: "Armoire électrique industrielle avec automates et contacteurs.",
      tags: ["industriel", "automate", "armoire"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Bornier de raccordement",
        "Goulottes de câblage",
        "Schéma électrique obligatoire"
      ]
    },

    // ===== APPAREILLAGE =====
    {
      id: "app1",
      category: "appareillage",
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      titre: "Interrupteur différentiel 30mA",
      description: "DDR 30mA haute sensibilité - Protection des personnes contre les contacts indirects.",
      tags: ["DDR", "protection", "30mA"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Type A pour circuits spécialisés",
        "Type AC pour circuits généraux",
        "Bouton test mensuel"
      ]
    },
    {
      id: "app2",
      category: "appareillage",
      src: "https://images.unsplash.com/photo-1597766325930-aa1e52c4e9d3?w=800&q=80",
      titre: "Disjoncteurs modulaires",
      description: "Gamme de disjoncteurs divisionnaires : 10A, 16A, 20A, 32A pour différents circuits.",
      tags: ["disjoncteur", "protection", "modulaire"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Courbe C pour usage général",
        "Pouvoir de coupure 6kA minimum",
        "1 module = 18mm"
      ]
    },
    {
      id: "app3",
      category: "appareillage",
      src: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&q=80",
      titre: "Prise de courant 2P+T",
      description: "Prise encastrée avec terre, format standard français.",
      tags: ["prise", "2P+T", "encastré"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Norme NF",
        "Obturateurs enfants obligatoires",
        "Connexion automatique ou à vis"
      ]
    },
    {
      id: "app4",
      category: "appareillage",
      src: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
      titre: "Interrupteur va-et-vient",
      description: "Interrupteur permettant la commande d'un point lumineux depuis deux endroits.",
      tags: ["interrupteur", "va-et-vient", "commande"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "3 bornes : L, 1, 2",
        "Navettes en orange ou violet",
        "Installation par paire"
      ]
    },
    {
      id: "app5",
      category: "appareillage",
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      titre: "Contacteur jour/nuit",
      description: "Contacteur heures creuses pour pilotage du chauffe-eau électrique.",
      tags: ["contacteur", "heures creuses", "chauffe-eau"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "3 positions : Auto / 0 / 1",
        "Commande par signal tarifaire",
        "20A minimum pour chauffe-eau"
      ]
    },
    {
      id: "app6",
      category: "appareillage",
      src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
      titre: "Parafoudre Type 2",
      description: "Protection contre les surtensions atmosphériques et industrielles.",
      tags: ["parafoudre", "surtension", "protection"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Obligatoire en zone AQ2",
        "Voyant d'état",
        "Déconnecteur intégré"
      ]
    },

    // ===== CABLAGE =====
    {
      id: "cab1",
      category: "cablage",
      src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
      titre: "Câblage soigné",
      description: "Exemple de câblage propre avec peignes et goulottes bien organisés.",
      tags: ["câblage", "organisation", "propre"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Fils rangés par fonction",
        "Serrage au couple",
        "Repérage des conducteurs"
      ]
    },
    {
      id: "cab2",
      category: "cablage",
      src: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&q=80",
      titre: "Raccordement bornier",
      description: "Technique de raccordement sur bornier avec respect des couleurs normalisées.",
      tags: ["bornier", "raccordement", "couleurs"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Bleu = Neutre",
        "Vert-jaune = Terre",
        "Autre couleur = Phase"
      ]
    },
    {
      id: "cab3",
      category: "cablage",
      src: "https://images.unsplash.com/photo-1545259741-2266eb9ed588?w=800&q=80",
      titre: "Passage de câbles",
      description: "Cheminement de câbles en apparent avec goulottes et conduits.",
      tags: ["goulotte", "conduit", "cheminement"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Rayon de courbure respecté",
        "Séparation courants forts/faibles",
        "Fixations régulières"
      ]
    },
    {
      id: "cab4",
      category: "cablage",
      src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
      titre: "Peigne d'alimentation",
      description: "Utilisation de peignes horizontaux et verticaux pour l'alimentation des modules.",
      tags: ["peigne", "alimentation", "répartition"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Peigne phase + neutre",
        "Calibre adapté au DDR",
        "Évite les ponts de câblage"
      ]
    },

    // ===== DEFAUTS =====
    {
      id: "def1",
      category: "defauts",
      src: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
      titre: "Mauvais serrage - Danger !",
      description: "Exemple de borne mal serrée ayant provoqué un échauffement. Point chaud visible.",
      tags: ["défaut", "serrage", "échauffement", "danger"],
      source: "Unsplash",
      license: "CC0",
      danger: true,
      points: [
        "Serrage insuffisant = résistance",
        "Résistance = échauffement",
        "Risque d'incendie"
      ]
    },
    {
      id: "def2",
      category: "defauts",
      src: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
      titre: "Câblage anarchique",
      description: "Tableau mal organisé : fils croisés, pas de repérage, maintenance difficile.",
      tags: ["défaut", "désordre", "maintenance"],
      source: "Unsplash",
      license: "CC0",
      danger: false,
      points: [
        "Maintenance impossible",
        "Risque d'erreur d'intervention",
        "Non-conformité NF C 15-100"
      ]
    },
    {
      id: "def3",
      category: "defauts",
      src: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&q=80",
      titre: "Absence de terre",
      description: "Installation ancienne sans conducteur de protection. Danger électrocution.",
      tags: ["défaut", "terre", "sécurité", "danger"],
      source: "Unsplash",
      license: "CC0",
      danger: true,
      points: [
        "Pas de protection des personnes",
        "DDR ne peut pas fonctionner",
        "Mise en conformité obligatoire"
      ]
    },
    {
      id: "def4",
      category: "defauts",
      src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
      titre: "Surcharge multiprise",
      description: "Cascades de multiprises sur un même circuit - Surcharge et risque d'incendie.",
      tags: ["défaut", "surcharge", "multiprise", "danger"],
      source: "Unsplash",
      license: "CC0",
      danger: true,
      points: [
        "Puissance totale dépassée",
        "Échauffement des conducteurs",
        "Installer des prises supplémentaires"
      ]
    },
    {
      id: "def5",
      category: "defauts",
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      titre: "Calibre inadapté",
      description: "Disjoncteur 32A sur circuit en 1.5mm² - Protection inefficace, risque de feu.",
      tags: ["défaut", "calibre", "section", "danger"],
      source: "Unsplash",
      license: "CC0",
      danger: true,
      points: [
        "Section non protégée",
        "Câble peut fondre avant déclenchement",
        "Respecter les associations section/protection"
      ]
    },

    // ===== CHANTIER =====
    {
      id: "chan1",
      category: "chantier",
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
      titre: "Saignée dans mur",
      description: "Réalisation d'une saignée pour passage de gaine ICTA.",
      tags: ["saignée", "encastrement", "gaine"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Profondeur max 3cm",
        "Zones de passage définies",
        "Rebouchage soigné"
      ]
    },
    {
      id: "chan2",
      category: "chantier",
      src: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
      titre: "Pose de boîtier",
      description: "Encastrement d'un boîtier d'appareillage dans cloison sèche.",
      tags: ["boîtier", "encastrement", "cloison"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Boîtier spécial placo",
        "Hauteur normalisée",
        "Griffes de serrage"
      ]
    },
    {
      id: "chan3",
      category: "chantier",
      src: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
      titre: "Tirage de câbles",
      description: "Tirage de câbles dans une gaine préexistante avec aiguille.",
      tags: ["tirage", "aiguille", "câblage"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Aiguille adaptée au diamètre",
        "Lubrifiant si nécessaire",
        "Ne jamais forcer"
      ]
    },
    {
      id: "chan4",
      category: "chantier",
      src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
      titre: "Vérification finale",
      description: "Tests de conformité avant mise sous tension : continuité, isolement, DDR.",
      tags: ["test", "conformité", "mesure"],
      source: "Unsplash",
      license: "CC0",
      points: [
        "Continuité des PE",
        "Isolement > 0.5 MΩ",
        "Fonctionnement DDR"
      ]
    }
  ]
}

// Fonctions utilitaires
export function getCategoryById(categoryId) {
  return galerieData.categories.find(c => c.id === categoryId)
}

export function getImagesByCategory(categoryId) {
  return galerieData.images.filter(img => img.category === categoryId)
}

export function getImageById(imageId) {
  return galerieData.images.find(img => img.id === imageId)
}

export function getAllImages() {
  return galerieData.images
}

export default galerieData
