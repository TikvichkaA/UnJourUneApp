/**
 * Dictionnaire de traductions politiques
 * Chaque entrée contient l'expression originale et sa traduction explicite
 */
const TRANSLATIONS = [
  // Immigration et nationalisme
  {
    original: "préférence nationale",
    translation: "discrimination légale fondée sur l'origine",
    category: "nationalisme"
  },
  {
    original: "immigration massive",
    translation: "population désignée comme menace collective",
    category: "immigration"
  },
  {
    original: "immigration incontrôlée",
    translation: "fantasme d'invasion utilisé pour justifier la répression",
    category: "immigration"
  },
  {
    original: "submersion migratoire",
    translation: "rhétorique de remplacement démographique",
    category: "immigration"
  },
  {
    original: "grand remplacement",
    translation: "théorie complotiste raciste",
    category: "immigration"
  },
  {
    original: "appel d'air",
    translation: "prétexte pour refuser l'accueil des exilés",
    category: "immigration"
  },
  {
    original: "flux migratoires",
    translation: "déshumanisation des personnes en mouvement",
    category: "immigration"
  },
  {
    original: "clandestins",
    translation: "personnes privées de droits par l'État",
    category: "immigration"
  },
  {
    original: "illégaux",
    translation: "personnes dont l'existence est criminalisée",
    category: "immigration"
  },
  {
    original: "migrants économiques",
    translation: "hiérarchisation des vies selon leur utilité",
    category: "immigration"
  },
  {
    original: "communautarisme",
    translation: "accusation visant les minorités qui s'organisent",
    category: "immigration"
  },
  {
    original: "islamisation",
    translation: "fantasme complotiste antimusulman",
    category: "immigration"
  },
  {
    original: "territoires perdus de la République",
    translation: "stigmatisation des quartiers populaires",
    category: "immigration"
  },

  // Ordre et répression
  {
    original: "rétablir l'ordre",
    translation: "renforcement de la répression d'État",
    category: "ordre"
  },
  {
    original: "maintien de l'ordre",
    translation: "usage de la violence policière",
    category: "ordre"
  },
  {
    original: "fermeté républicaine",
    translation: "autoritarisme déguisé en principe démocratique",
    category: "ordre"
  },
  {
    original: "lutter contre l'ensauvagement",
    translation: "désigner des groupes sociaux comme intrinsèquement violents",
    category: "ordre"
  },
  {
    original: "ensauvagement",
    translation: "déshumanisation de populations ciblées",
    category: "ordre"
  },
  {
    original: "tolérance zéro",
    translation: "politique répressive sans nuance ni justice",
    category: "ordre"
  },
  {
    original: "laxisme judiciaire",
    translation: "attaque contre l'indépendance de la justice",
    category: "ordre"
  },
  {
    original: "sentiment d'insécurité",
    translation: "peur instrumentalisée politiquement",
    category: "ordre"
  },
  {
    original: "zones de non-droit",
    translation: "stigmatisation de quartiers pour justifier la répression",
    category: "ordre"
  },
  {
    original: "délinquance",
    translation: "terme fourre-tout criminalisant la pauvreté",
    category: "ordre"
  },
  {
    original: "racaille",
    translation: "déshumanisation des jeunes des quartiers populaires",
    category: "ordre"
  },
  {
    original: "voyous",
    translation: "criminalisation de catégories sociales",
    category: "ordre"
  },
  {
    original: "casseurs",
    translation: "délégitimation des mouvements sociaux",
    category: "ordre"
  },
  {
    original: "ultra-gauche",
    translation: "épouvantail pour criminaliser la contestation",
    category: "ordre"
  },
  {
    original: "écoterrorisme",
    translation: "criminalisation de l'activisme écologique",
    category: "ordre"
  },
  {
    original: "séparatisme",
    translation: "prétexte pour contrôler les minorités religieuses",
    category: "ordre"
  },

  // Valeurs et tradition
  {
    original: "valeurs traditionnelles",
    translation: "normes sociales imposées par l'État ou la majorité",
    category: "tradition"
  },
  {
    original: "nos valeurs",
    translation: "exclusion de ceux qui ne correspondent pas à la norme dominante",
    category: "tradition"
  },
  {
    original: "identité nationale",
    translation: "construction excluante basée sur l'origine",
    category: "tradition"
  },
  {
    original: "civilisation occidentale",
    translation: "hiérarchie culturelle à prétention universelle",
    category: "tradition"
  },
  {
    original: "racines chrétiennes",
    translation: "instrumentalisation religieuse nationaliste",
    category: "tradition"
  },
  {
    original: "France éternelle",
    translation: "mythe nationaliste anhistorique",
    category: "tradition"
  },
  {
    original: "déclin de la France",
    translation: "rhétorique décliniste au service du nationalisme",
    category: "tradition"
  },
  {
    original: "effondrement civilisationnel",
    translation: "fantasme apocalyptique réactionnaire",
    category: "tradition"
  },
  {
    original: "idéologie du genre",
    translation: "attaque contre les droits des personnes LGBTQI+",
    category: "tradition"
  },
  {
    original: "théorie du genre",
    translation: "épouvantail contre les études sur le genre",
    category: "tradition"
  },
  {
    original: "lobby LGBT",
    translation: "rhétorique complotiste homophobe",
    category: "tradition"
  },
  {
    original: "wokisme",
    translation: "épouvantail contre les luttes pour l'égalité",
    category: "tradition"
  },
  {
    original: "cancel culture",
    translation: "délégitimation de la critique sociale",
    category: "tradition"
  },
  {
    original: "dictature des minorités",
    translation: "rejet des droits des groupes marginalisés",
    category: "tradition"
  },
  {
    original: "bien-pensance",
    translation: "mépris pour les positions antiracistes et égalitaires",
    category: "tradition"
  },
  {
    original: "politiquement correct",
    translation: "rejet du respect des personnes discriminées",
    category: "tradition"
  },

  // Économie et social
  {
    original: "assistanat",
    translation: "stigmatisation des bénéficiaires de droits sociaux",
    category: "economie"
  },
  {
    original: "assistés",
    translation: "désignation méprisante des personnes en situation de précarité",
    category: "economie"
  },
  {
    original: "fraude sociale",
    translation: "criminalisation des pauvres (plutôt que de l'évasion fiscale)",
    category: "economie"
  },
  {
    original: "profiteurs du système",
    translation: "boucs émissaires pour masquer les inégalités structurelles",
    category: "economie"
  },
  {
    original: "mérite",
    translation: "justification des inégalités sociales",
    category: "economie"
  },
  {
    original: "valeur travail",
    translation: "injonction à accepter l'exploitation",
    category: "economie"
  },
  {
    original: "charges sociales",
    translation: "présentation négative des cotisations de solidarité",
    category: "economie"
  },
  {
    original: "réformes nécessaires",
    translation: "destruction programmée des acquis sociaux",
    category: "economie"
  },
  {
    original: "modernisation",
    translation: "euphémisme pour régression sociale",
    category: "economie"
  },
  {
    original: "flexibilité",
    translation: "précarisation des travailleurs",
    category: "economie"
  },
  {
    original: "compétitivité",
    translation: "course au moins-disant social",
    category: "economie"
  },

  // Médias et démocratie
  {
    original: "pensée unique",
    translation: "délégitimation du consensus démocratique",
    category: "medias"
  },
  {
    original: "média mainstream",
    translation: "rhétorique de victimisation et de défiance",
    category: "medias"
  },
  {
    original: "élites",
    translation: "bouc émissaire populiste (visant rarement les plus riches)",
    category: "medias"
  },
  {
    original: "système",
    translation: "ennemi flou permettant de fédérer les ressentiments",
    category: "medias"
  },
  {
    original: "démocrature",
    translation: "comparaison exagérée pour délégitimer les institutions",
    category: "medias"
  },
  {
    original: "liberté d'expression menacée",
    translation: "revendication du droit à tenir des propos discriminatoires",
    category: "medias"
  },
  {
    original: "on ne peut plus rien dire",
    translation: "refus d'assumer les conséquences de propos problématiques",
    category: "medias"
  },
  {
    original: "censure",
    translation: "victimisation face à la contradiction",
    category: "medias"
  },
  {
    original: "dictature sanitaire",
    translation: "refus complotiste des mesures de santé publique",
    category: "medias"
  },

  // Expressions additionnelles
  {
    original: "défense de la famille",
    translation: "opposition aux droits des familles non-traditionnelles",
    category: "tradition"
  },
  {
    original: "protection de l'enfance",
    translation: "prétexte pour attaquer les droits LGBTQI+",
    category: "tradition"
  },
  {
    original: "bon sens",
    translation: "appel à l'évidence masquant des positions idéologiques",
    category: "medias"
  },
  {
    original: "les Français",
    translation: "généralisation excluante (qui en fait partie ?)",
    category: "nationalisme"
  },
  {
    original: "Français de souche",
    translation: "catégorie raciale déguisée en critère culturel",
    category: "nationalisme"
  },
  {
    original: "assimilation",
    translation: "injonction à l'effacement culturel",
    category: "nationalisme"
  },
  {
    original: "intégration",
    translation: "responsabilisation des immigrés pour leur propre exclusion",
    category: "nationalisme"
  },
  {
    original: "souveraineté",
    translation: "repli nationaliste déguisé en indépendance",
    category: "nationalisme"
  },
  {
    original: "patriote",
    translation: "nationaliste cherchant une étiquette respectable",
    category: "nationalisme"
  },
  {
    original: "mondialisme",
    translation: "théorie complotiste aux relents antisémites",
    category: "medias"
  },
  {
    original: "islamo-gauchisme",
    translation: "amalgame visant à délégitimer la gauche antiraciste",
    category: "ordre"
  },
  {
    original: "islamo-gauchiste",
    translation: "insulte politique sans fondement factuel",
    category: "ordre"
  },
  {
    original: "envahisseurs",
    translation: "déshumanisation guerrière des migrants",
    category: "immigration"
  },
  {
    original: "hordes",
    translation: "animalisation des populations en mouvement",
    category: "immigration"
  },
  {
    original: "remigration",
    translation: "euphémisme pour expulsion massive et ethnique",
    category: "immigration"
  },
  {
    original: "décivilisation",
    translation: "concept raciste de hiérarchie des peuples",
    category: "tradition"
  },
  {
    original: "réarmement démographique",
    translation: "contrôle des corps et natalisme nationaliste",
    category: "tradition"
  },
  {
    original: "réarmement civique",
    translation: "mise au pas idéologique sous couvert de civisme",
    category: "ordre"
  },
  {
    original: "autorité de l'État",
    translation: "renforcement du pouvoir répressif",
    category: "ordre"
  },
  {
    original: "sécurité des Français",
    translation: "prétexte pour politiques liberticides",
    category: "ordre"
  },
  {
    original: "guerre culturelle",
    translation: "rhétorique martiale contre le pluralisme",
    category: "tradition"
  },
  {
    original: "héritage",
    translation: "mythe d'une culture figée et menacée",
    category: "tradition"
  },
  {
    original: "défendre notre mode de vie",
    translation: "refus de l'altérité et du changement social",
    category: "tradition"
  }
];

// Exporter pour utilisation dans content.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TRANSLATIONS;
}
