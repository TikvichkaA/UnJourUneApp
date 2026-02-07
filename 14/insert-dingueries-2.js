const fetch = require('node-fetch');

const SUPABASE_URL = 'https://hwunkojdzodcutewkfet.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dW5rb2pkem9kY3V0ZXdrZmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTMzNTAsImV4cCI6MjA4Mzk2OTM1MH0.Zpe-QqzKDIpx3pTa6_e9ysfI-Rprl3SXANM8b2pqXU0';

const dingueries = [
  // Nouvelles dingueries - Sources FranceInfo/LCP
  {
    auteur: "Gilles Bourdouleix",
    citation: "Hitler n'a pas tué assez de Tsiganes",
    type: "antisemitisme",
    date_declaration: "2013-07-21",
    source_url: "https://www.franceinfo.fr/elections/legislatives-2024-qui-sont-ces-candidats-rn-qualifies-de-racistes-ou-d-antisemites-par-gabriel-attal-lors-du-debat_6631557.html",
    source_media: "FranceInfo",
    contexte: "Maire de Cholet, candidat RN 5e Maine-et-Loire. Condamné en 2014 pour apologie de crime contre l'humanité, annulé en cassation 2015.",
    est_condamnation: true
  },
  {
    auteur: "Marie-Christine Sorin",
    citation: "Non, toutes les civilisations ne se valent pas",
    type: "racisme",
    date_declaration: "2024-01-11",
    source_url: "https://www.franceinfo.fr/elections/legislatives-2024-qui-sont-ces-candidats-rn-qualifies-de-racistes-ou-d-antisemites-par-gabriel-attal-lors-du-debat_6631557.html",
    source_media: "FranceInfo",
    contexte: "Candidate RN 1re Hautes-Pyrénées. Retraitée Education nationale. Tweet hiérarchisant les civilisations.",
    est_condamnation: false
  },
  {
    auteur: "Julien Leonardelli",
    citation: "Distribution de sandwichs aux rillettes de porc aux SDF pour exclure musulmans et juifs",
    type: "racisme",
    date_declaration: "2015-01-25",
    source_url: "https://www.franceinfo.fr/elections/legislatives-2024-qui-sont-ces-candidats-rn-qualifies-de-racistes-ou-d-antisemites-par-gabriel-attal-lors-du-debat_6631557.html",
    source_media: "La Dépêche",
    contexte: "Conseiller régional Occitanie, candidat RN 5e Haute-Garonne. Maraude identitaire excluant populations musulmanes et juives.",
    est_condamnation: false
  },
  {
    auteur: "Joseph Martin",
    citation: "Le gaz a rendu justice aux victimes de la Shoah",
    type: "antisemitisme",
    date_declaration: "2018-10-22",
    source_url: "https://www.europe1.fr/politique/legislatives-2024-un-candidat-rn-accuse-dantisemitisme-rehabilite-et-reinvesti-4254348",
    source_media: "Twitter/Europe1",
    contexte: "Candidat RN 1re Morbihan. Soutien retiré puis rétabli par le RN qui estime le propos non antisémite.",
    est_condamnation: false
  },
  {
    auteur: "Daniel Grenon",
    citation: "Les Maghrébins n'ont pas leur place dans les hauts lieux",
    type: "racisme",
    date_declaration: "2024-06-01",
    source_url: "https://lcp.fr/actualites/legislatives-2024-ces-candidats-qualifies-de-brebis-galeuses-par-jordan-bardella-qui",
    source_media: "L'Yonne républicaine/LCP",
    contexte: "Député RN sortant 1re Yonne. Bardella a qualifié ces propos d'abjects et annoncé qu'il ne siègera pas dans le groupe RN.",
    est_condamnation: false
  },
  {
    auteur: "Laurent Gnaedig",
    citation: "Les déclarations de Jean-Marie Le Pen sur les chambres à gaz étaient une grave erreur de communication, pas une remarque antisémite",
    type: "antisemitisme",
    date_declaration: "2024-06-01",
    source_url: "https://lcp.fr/actualites/legislatives-2024-ces-candidats-qualifies-de-brebis-galeuses-par-jordan-bardella-qui",
    source_media: "BFM Alsace/LCP",
    contexte: "Candidat RN 1re Haut-Rhin. Défense du négationnisme de JMLP.",
    est_condamnation: false
  },
  {
    auteur: "Ludivine Daoudi",
    citation: "Photographie portant casquette de sous-officier nazi de la Luftwaffe ornée d'une croix gammée",
    type: "autre",
    date_declaration: "2024-07-02",
    source_url: "https://lcp.fr/actualites/legislatives-2024-ces-candidats-qualifies-de-brebis-galeuses-par-jordan-bardella-qui",
    source_media: "LCP",
    contexte: "Candidate RN 1re Calvados. A retiré sa candidature après diffusion de la photo.",
    est_condamnation: false
  },
  // Condamnations procès assistants parlementaires (mars 2025)
  {
    auteur: "Marine Le Pen",
    citation: "Condamnée pour détournement de fonds publics dans l'affaire des assistants parlementaires européens",
    type: "autre",
    date_declaration: "2025-03-01",
    source_url: "https://www.franceinfo.fr/politique/front-national/affaire-des-assistants-fn-au-parlement-europeen/marine-le-pen-louis-aliot-julien-odoul-on-a-liste-les-25-condamnations-a-l-issue-du-proces-des-assistants-parlementaires-du-fn_7162527.html",
    source_media: "FranceInfo",
    contexte: "4 ans prison (2 ferme), 100 000€ amende, 5 ans inéligibilité. En appel depuis janvier 2026.",
    est_condamnation: true
  },
  {
    auteur: "Louis Aliot",
    citation: "Condamné pour détournement de fonds publics dans l'affaire des assistants parlementaires européens",
    type: "autre",
    date_declaration: "2025-03-01",
    source_url: "https://www.franceinfo.fr/politique/front-national/affaire-des-assistants-fn-au-parlement-europeen/marine-le-pen-louis-aliot-julien-odoul-on-a-liste-les-25-condamnations-a-l-issue-du-proces-des-assistants-parlementaires-du-fn_7162527.html",
    source_media: "FranceInfo",
    contexte: "Vice-président RN, maire de Perpignan. 18 mois prison (12 sursis), 8 000€ amende, 3 ans inéligibilité.",
    est_condamnation: true
  },
  {
    auteur: "Bruno Gollnisch",
    citation: "Condamné pour détournement de fonds publics dans l'affaire des assistants parlementaires européens",
    type: "autre",
    date_declaration: "2025-03-01",
    source_url: "https://www.franceinfo.fr/politique/front-national/affaire-des-assistants-fn-au-parlement-europeen/marine-le-pen-louis-aliot-julien-odoul-on-a-liste-les-25-condamnations-a-l-issue-du-proces-des-assistants-parlementaires-du-fn_7162527.html",
    source_media: "FranceInfo",
    contexte: "Ancien député européen. 3 ans prison (2 sursis), 50 000€ amende, 5 ans inéligibilité.",
    est_condamnation: true
  },
  {
    auteur: "Nicolas Bay",
    citation: "Condamné pour détournement de fonds publics dans l'affaire des assistants parlementaires européens",
    type: "autre",
    date_declaration: "2025-03-01",
    source_url: "https://www.franceinfo.fr/politique/front-national/affaire-des-assistants-fn-au-parlement-europeen/marine-le-pen-louis-aliot-julien-odoul-on-a-liste-les-25-condamnations-a-l-issue-du-proces-des-assistants-parlementaires-du-fn_7162527.html",
    source_media: "FranceInfo",
    contexte: "Ancien secrétaire général FN. 12 mois prison (6 sursis), 8 000€ amende, 3 ans inéligibilité.",
    est_condamnation: true
  },
  {
    auteur: "Julien Odoul",
    citation: "Condamné pour détournement de fonds publics dans l'affaire des assistants parlementaires européens",
    type: "autre",
    date_declaration: "2025-03-01",
    source_url: "https://www.franceinfo.fr/politique/front-national/affaire-des-assistants-fn-au-parlement-europeen/marine-le-pen-louis-aliot-julien-odoul-on-a-liste-les-25-condamnations-a-l-issue-du-proces-des-assistants-parlementaires-du-fn_7162527.html",
    source_media: "FranceInfo",
    contexte: "Député RN, porte-parole du parti. 8 mois sursis, 1 an inéligibilité.",
    est_condamnation: true
  },
  {
    auteur: "Timothée Houssin",
    citation: "Condamné pour détournement de fonds publics dans l'affaire des assistants parlementaires européens",
    type: "autre",
    date_declaration: "2025-03-01",
    source_url: "https://www.franceinfo.fr/politique/front-national/affaire-des-assistants-fn-au-parlement-europeen/marine-le-pen-louis-aliot-julien-odoul-on-a-liste-les-25-condamnations-a-l-issue-du-proces-des-assistants-parlementaires-du-fn_7162527.html",
    source_media: "FranceInfo",
    contexte: "Député RN de l'Eure. 6 mois sursis, 1 an inéligibilité.",
    est_condamnation: true
  },
  {
    auteur: "Dominique Bilde",
    citation: "Condamnée pour détournement de fonds publics dans l'affaire des assistants parlementaires européens",
    type: "autre",
    date_declaration: "2025-03-01",
    source_url: "https://www.franceinfo.fr/politique/front-national/affaire-des-assistants-fn-au-parlement-europeen/marine-le-pen-louis-aliot-julien-odoul-on-a-liste-les-25-condamnations-a-l-issue-du-proces-des-assistants-parlementaires-du-fn_7162527.html",
    source_media: "FranceInfo",
    contexte: "Ex-eurodéputée. 18 mois sursis, 3 ans inéligibilité.",
    est_condamnation: true
  }
];

async function main() {
  const res = await fetch(SUPABASE_URL + '/rest/v1/dingueries', {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(dingueries)
  });

  if (res.ok) {
    console.log('Insérées:', dingueries.length, 'nouvelles dingueries');
  } else {
    const err = await res.text();
    console.error('Erreur:', err);
  }
}

main();
