/**
 * SubVeille - Service OpenAI
 * Gestion des appels a l'API OpenAI
 */

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Modele par defaut (gpt-4o-mini est rapide et economique)
const DEFAULT_MODEL = 'gpt-4o-mini';

/**
 * Analyse semantique du matching entre profil et AAP
 * Retourne un score et une explication
 */
async function analyzeMatch(profile, aap) {
  const prompt = `Tu es un expert en financement associatif en France.

PROFIL DE L'ASSOCIATION:
- Nom: ${profile.nom_association || 'Non renseigne'}
- Secteurs: ${(profile.secteurs || []).join(', ') || 'Non renseigne'}
- Description activites: ${profile.description || 'Non renseignee'}
- Localisation: ${profile.ville || ''} (${profile.code_postal || ''})
- Budget annuel: ${profile.budget_annuel ? profile.budget_annuel + ' EUR' : 'Non renseigne'}
- Nombre de salaries: ${profile.nb_salaries ?? 'Non renseigne'}

APPEL A PROJET:
- Titre: ${aap.titre}
- Financeur: ${aap.financeur}
- Description: ${aap.description}
- Secteur: ${aap.secteur}
- Montant: ${aap.montantMin || '?'} - ${aap.montantMax || '?'} EUR
- Territoires eligibles: ${(aap.territoires || []).join(', ')}
- Beneficiaires eligibles: ${(aap.beneficiaires || []).join(', ')}

ANALYSE DEMANDEE:
1. Score de pertinence de 0 a 100
2. 3 raisons principales de correspondance (ou non)
3. Conseil pour maximiser les chances

Reponds en JSON avec cette structure exacte:
{
  "score": <number>,
  "reasons": ["raison 1", "raison 2", "raison 3"],
  "conseil": "conseil personnalise",
  "eligible": <boolean>
}`;

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_tokens: 500
  });

  return JSON.parse(response.choices[0].message.content);
}

/**
 * Genere un brouillon de candidature
 */
async function generateDraft(profile, aap, sections = ['presentation', 'projet', 'budget']) {
  const prompt = `Tu es un expert en redaction de dossiers de subvention pour associations.

PROFIL DE L'ASSOCIATION:
- Nom: ${profile.nom_association || '[Nom de l\'association]'}
- Secteurs d'activite: ${(profile.secteurs || []).join(', ')}
- Description: ${profile.description || 'Association oeuvrant dans le secteur associatif'}
- Localisation: ${profile.ville || '[Ville]'} (${profile.code_postal || '[CP]'})
- Budget annuel: ${profile.budget_annuel ? profile.budget_annuel + ' EUR' : '[Budget]'}
- Equipe: ${profile.nb_salaries || 0} salarie(s)
- SIRET: ${profile.siret || '[SIRET]'}

APPEL A PROJET CIBLE:
- Titre: ${aap.titre}
- Financeur: ${aap.financeur}
- Description: ${aap.description}
- Objectifs recherches: ${aap.description}
- Montant possible: ${aap.montantMin || '?'} - ${aap.montantMax || '?'} EUR

SECTIONS A REDIGER: ${sections.join(', ')}

Redige un brouillon professionnel pour chaque section demandee.
Le texte doit etre adapte au contexte de l'AAP et mettre en valeur les points forts de l'association.
Utilise un ton professionnel mais accessible.
Indique [A COMPLETER] pour les informations manquantes.

Reponds en JSON avec cette structure:
{
  "sections": {
    "presentation": "texte...",
    "projet": "texte...",
    "budget": "texte...",
    "objectifs": "texte...",
    "calendrier": "texte..."
  },
  "conseils": ["conseil 1", "conseil 2"],
  "points_attention": ["point 1", "point 2"]
}`;

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 2000
  });

  return JSON.parse(response.choices[0].message.content);
}

/**
 * Resume un AAP de maniere claire et concise
 */
async function summarizeAAP(aap) {
  const prompt = `Resume cet appel a projet en 3-4 phrases claires pour une association.
Mets en avant: qui peut candidater, pour quel type de projet, quel montant, quelle deadline.

APPEL A PROJET:
Titre: ${aap.titre}
Financeur: ${aap.financeur}
Description: ${aap.description || aap.description_complete}
Secteur: ${aap.secteur}
Montant: ${aap.montantMin || '?'} - ${aap.montantMax || '?'} EUR
Date limite: ${aap.dateCloture || 'Non precisee'}
Beneficiaires: ${(aap.beneficiaires || []).join(', ')}
Territoires: ${(aap.territoires || []).join(', ')}

Reponds en JSON:
{
  "resume": "resume en 3-4 phrases",
  "points_cles": ["point 1", "point 2", "point 3"],
  "pour_qui": "description du profil ideal",
  "difficulte": "facile|moyen|difficile"
}`;

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_tokens: 500
  });

  return JSON.parse(response.choices[0].message.content);
}

/**
 * Scoring batch de plusieurs AAP pour un profil
 * Plus economique que d'appeler analyzeMatch pour chaque AAP
 */
async function batchScore(profile, aaps) {
  // Limiter a 20 AAP max par requete
  const aapsToScore = aaps.slice(0, 20);

  const aapsSummary = aapsToScore.map((aap, i) =>
    `[${i}] ${aap.titre} | Secteur: ${aap.secteur} | ${(aap.beneficiaires || []).slice(0, 2).join(', ')}`
  ).join('\n');

  const prompt = `Tu es un expert en financement associatif.

PROFIL ASSOCIATION:
- Secteurs: ${(profile.secteurs || []).join(', ')}
- Description: ${profile.description || 'Non renseignee'}
- Localisation: ${profile.code_postal || 'France'}
- Budget: ${profile.budget_annuel || 'Non renseigne'} EUR

LISTE DES AAP A SCORER:
${aapsSummary}

Pour chaque AAP (par son index), donne un score de 0 a 100 et une raison courte.
Reponds en JSON:
{
  "scores": [
    {"index": 0, "score": 75, "reason": "raison courte"},
    {"index": 1, "score": 30, "reason": "raison courte"},
    ...
  ]
}`;

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.2,
    max_tokens: 1500
  });

  const result = JSON.parse(response.choices[0].message.content);

  // Enrichir les AAP avec les scores
  return aapsToScore.map((aap, i) => {
    const scoreData = result.scores.find(s => s.index === i) || { score: 0, reason: '' };
    return {
      ...aap,
      aiScore: scoreData.score,
      aiReason: scoreData.reason
    };
  });
}

/**
 * Suggere des ameliorations pour le profil
 */
async function suggestProfileImprovements(profile) {
  const prompt = `Tu es un conseiller pour associations.

PROFIL ACTUEL:
- Nom: ${profile.nom_association || 'Non renseigne'}
- Secteurs: ${(profile.secteurs || []).join(', ') || 'Non renseigne'}
- Description: ${profile.description || 'Non renseignee'}
- Localisation: ${profile.ville || 'Non renseignee'}
- Budget: ${profile.budget_annuel || 'Non renseigne'}
- Salaries: ${profile.nb_salaries ?? 'Non renseigne'}
- SIRET: ${profile.siret || 'Non renseigne'}

Analyse ce profil et suggere des ameliorations pour:
1. Mieux se positionner sur les appels a projets
2. Completer les informations manquantes importantes
3. Optimiser la description

Reponds en JSON:
{
  "completude": <pourcentage 0-100>,
  "manquants": ["element 1", "element 2"],
  "suggestions": [
    {"champ": "description", "conseil": "conseil specifique"},
    {"champ": "secteurs", "conseil": "conseil specifique"}
  ],
  "exemple_description": "exemple de description optimisee si la description actuelle est faible"
}`;

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.5,
    max_tokens: 800
  });

  return JSON.parse(response.choices[0].message.content);
}

/**
 * Scoring semantique leger : compare titres AAP vs description association
 * Tres economique car prompt court
 */
async function semanticTitleMatch(associationDescription, aapTitles) {
  // Limiter a 30 titres max
  const titles = aapTitles.slice(0, 30);

  const titlesFormatted = titles.map((t, i) => `${i}. ${t}`).join('\n');

  const prompt = `Tu es un expert en financement associatif.

DESCRIPTION DE L'ASSOCIATION:
"${associationDescription}"

LISTE DES APPELS A PROJETS (titres uniquement):
${titlesFormatted}

Pour chaque AAP, evalue la pertinence semantique du titre par rapport a l'objet de l'association.
Score de 0 a 100 (0 = aucun rapport, 100 = parfaitement adapte).

Reponds UNIQUEMENT en JSON:
{
  "scores": [
    {"index": 0, "score": 85, "motif": "3-5 mots expliquant le lien"},
    {"index": 1, "score": 20, "motif": "3-5 mots"}
  ]
}

IMPORTANT: Sois selectif. Seuls les AAP vraiment pertinents doivent avoir un score > 60.`;

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.1,
    max_tokens: 1500
  });

  return JSON.parse(response.choices[0].message.content);
}

/**
 * Recommandations intelligentes : prefiltre + IA semantique
 * Retourne les 10 meilleurs AAP avec scores combines
 */
async function getSmartRecommendations(profile, prefilteredAaps) {
  // Extraire les titres pour le scoring semantique
  const titles = prefilteredAaps.map(a => a.titre);

  // Si pas de description, retourner les prefiltrés tels quels
  if (!profile.description || profile.description.length < 20) {
    return {
      aaps: prefilteredAaps.slice(0, 10).map(a => ({
        ...a,
        aiScore: null,
        aiMotif: 'Ajoutez une description pour un matching IA'
      })),
      hasAiScoring: false
    };
  }

  // Scoring semantique
  const semanticResult = await semanticTitleMatch(profile.description, titles);

  // Combiner les scores
  const enrichedAaps = prefilteredAaps.map((aap, index) => {
    const semantic = semanticResult.scores.find(s => s.index === index);
    const aiScore = semantic?.score || 0;
    const aiMotif = semantic?.motif || '';

    // Score combine: 40% prefiltre + 60% IA semantique
    const baseScore = aap.matchScore || 0;
    const combinedScore = Math.round(baseScore * 0.4 + aiScore * 0.6);

    return {
      ...aap,
      aiScore,
      aiMotif,
      combinedScore
    };
  });

  // Trier par score combine et prendre les 10 meilleurs
  const top10 = enrichedAaps
    .sort((a, b) => b.combinedScore - a.combinedScore)
    .slice(0, 10);

  return {
    aaps: top10,
    hasAiScoring: true
  };
}

module.exports = {
  analyzeMatch,
  generateDraft,
  summarizeAAP,
  batchScore,
  suggestProfileImprovements,
  semanticTitleMatch,
  getSmartRecommendations
};
