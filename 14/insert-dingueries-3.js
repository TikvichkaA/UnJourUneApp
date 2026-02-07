const fetch = require('node-fetch');

const SUPABASE_URL = 'https://hwunkojdzodcutewkfet.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dW5rb2pkem9kY3V0ZXdrZmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTMzNTAsImV4cCI6MjA4Mzk2OTM1MH0.Zpe-QqzKDIpx3pTa6_e9ysfI-Rprl3SXANM8b2pqXU0';

const dingueries = [
  // Source: FranceBleu Loiret
  {
    auteur: "Jean-Pierre Templier",
    citation: "Cette communauté [juive] nous dirige, combien sont au gouvernement, à la tête des entreprises du CAC 40",
    type: "antisemitisme",
    date_declaration: "2014-01-01",
    source_url: "https://www.francebleu.fr/infos/politique/legislatives-2024-plainte-contre-un-suppleant-du-rn-dans-le-loiret-pour-des-propos-sexistes-racistes-et-antisemites-9061165",
    source_media: "FranceBleu",
    contexte: "Suppléant RN 6e Loiret. Plainte de Richard Ramos (Modem). Procédure d'exclusion du RN engagée.",
    est_condamnation: false
  },
  // Source: FranceBleu Isère (Municipales 2026)
  {
    auteur: "Thomas Gagnieu",
    citation: "Opposition aux terrains familiaux locatifs pour gens du voyage pour préserver la tranquillité des quartiers",
    type: "racisme",
    date_declaration: "2026-01-01",
    source_url: "https://www.francebleu.fr/infos/societe/municipales-2026-la-colere-des-gens-du-voyage-apres-la-publication-du-programme-d-un-candidat-rn-en-isere-3472821",
    source_media: "FranceBleu",
    contexte: "Candidat RN aux municipales 2026 aux Avenières Veyrins-Thuellin (Isère). Signalement au procureur de Grenoble par l'ANGVC.",
    est_condamnation: false
  },
  // Source: Révolution Permanente
  {
    auteur: "Béatrice Roullaud",
    citation: "70% de faux mineurs isolés. C'est une filière de l'immigration",
    type: "racisme",
    date_declaration: "2024-06-01",
    source_url: "https://www.revolutionpermanente.fr/Negationnistes-anti-IVG-xenophobes-qui-sont-les-candidats-RN-aux-legislatives",
    source_media: "Révolution Permanente",
    contexte: "Députée RN 6e Seine-et-Marne. Déclarations contre les mineurs isolés étrangers.",
    est_condamnation: false
  },
  {
    auteur: "Victor Catteau",
    citation: "Je préfère les chiens aux migrants",
    type: "racisme",
    date_declaration: "2024-06-01",
    source_url: "https://www.revolutionpermanente.fr/Negationnistes-anti-IVG-xenophobes-qui-sont-les-candidats-RN-aux-legislatives",
    source_media: "Révolution Permanente",
    contexte: "Candidat RN 5e Nord. A diffusé images d'étudiantes musulmanes sans consentement.",
    est_condamnation: false
  },
  {
    auteur: "Frédéric Boccaletti",
    citation: "Ancien gérant de la librairie Anthinéa, spécialisée dans les ouvrages antisémites et négationnistes",
    type: "antisemitisme",
    date_declaration: "1997-01-01",
    source_url: "https://www.revolutionpermanente.fr/Negationnistes-anti-IVG-xenophobes-qui-sont-les-candidats-RN-aux-legislatives",
    source_media: "Révolution Permanente",
    contexte: "Député RN 7e Var. Librairie nommée d'après Charles Maurras. Condamné en 2000 à 1 an de prison pour violences avec armes.",
    est_condamnation: true
  },
  {
    auteur: "Pierre Gentillet",
    citation: "Contributeur au site Égalité & Réconciliation d'Alain Soral (néo-nazi)",
    type: "antisemitisme",
    date_declaration: "2024-06-01",
    source_url: "https://www.revolutionpermanente.fr/Negationnistes-anti-IVG-xenophobes-qui-sont-les-candidats-RN-aux-legislatives",
    source_media: "Révolution Permanente",
    contexte: "Candidat RN 3e Cher. Contributeur du site d'extrême droite antisémite d'Alain Soral.",
    est_condamnation: false
  },
  {
    auteur: "Frank Khalifa",
    citation: "Nie les crimes de Tsahal et traite les juifs pro-palestiniens de traîtres",
    type: "autre",
    date_declaration: "2024-06-01",
    source_url: "https://www.revolutionpermanente.fr/Negationnistes-anti-IVG-xenophobes-qui-sont-les-candidats-RN-aux-legislatives",
    source_media: "Révolution Permanente",
    contexte: "Candidat RN 2e Haute-Garonne.",
    est_condamnation: false
  },
  {
    auteur: "Caroline Parmentier",
    citation: "Après avoir génocidé les enfants français [par l'avortement], on doit les remplacer par des migrants",
    type: "autre",
    date_declaration: "2018-01-01",
    source_url: "https://www.revolutionpermanente.fr/Negationnistes-anti-IVG-xenophobes-qui-sont-les-candidats-RN-aux-legislatives",
    source_media: "Présent",
    contexte: "Députée RN 9e Pas-de-Calais. Déclaration dans le journal d'extrême droite Présent en 2018.",
    est_condamnation: false
  },
  {
    auteur: "Hervé de Lépinau",
    citation: "Compare l'avortement aux génocides arméniens, rwandais, à la Shoah et Daesh",
    type: "autre",
    date_declaration: "2024-06-01",
    source_url: "https://www.revolutionpermanente.fr/Negationnistes-anti-IVG-xenophobes-qui-sont-les-candidats-RN-aux-legislatives",
    source_media: "Révolution Permanente",
    contexte: "Député RN 3e Vaucluse. Comparaison de l'avortement à des génocides.",
    est_condamnation: false
  },
  // Autres candidats trouvés dans les recherches
  {
    auteur: "Sophie Dumont",
    citation: "Messages antisémites et complotistes: théorie que Brigitte Macron serait un homme, Ukraine fournit les réseaux pédophiles en enfants",
    type: "antisemitisme",
    date_declaration: "2024-06-01",
    source_url: "https://basta.media/racistes-homophobes-complotistes-pro-poutine-antisemites-candidats-rn",
    source_media: "Basta!",
    contexte: "Ancienne conseillère de Marine Le Pen, candidate Côte d'Or.",
    est_condamnation: false
  },
  {
    auteur: "Paule Veyre de Soras",
    citation: "Pour prouver que le RN n'est ni antisémite ni raciste: J'ai un ophtalmo juif et un dentiste musulman",
    type: "autre",
    date_declaration: "2024-06-01",
    source_url: "https://basta.media/racistes-homophobes-complotistes-pro-poutine-antisemites-candidats-rn",
    source_media: "Basta!",
    contexte: "Candidate RN qualifiée pour le second tour en Mayenne.",
    est_condamnation: false
  },
  {
    auteur: "Jocelyn Dessigny",
    citation: "Photo sur Facebook portant un t-shirt du groupe In memoriam, reprise d'un chant de marche de la Jeunesse hitlérienne",
    type: "autre",
    date_declaration: "2024-06-01",
    source_url: "https://lcp.fr/actualites/legislatives-2024-ces-candidats-qualifies-de-brebis-galeuses-par-jordan-bardella-qui",
    source_media: "LCP",
    contexte: "Ex-député RN de l'Aisne. Groupe de rock néonazi.",
    est_condamnation: false
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
