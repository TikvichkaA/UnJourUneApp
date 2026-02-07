const fetch = require('node-fetch');

const SUPABASE_URL = 'https://hwunkojdzodcutewkfet.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dW5rb2pkem9kY3V0ZXdrZmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTMzNTAsImV4cCI6MjA4Mzk2OTM1MH0.Zpe-QqzKDIpx3pTa6_e9ysfI-Rprl3SXANM8b2pqXU0';

const dingueries = [
  // Carte de la honte
  {
    auteur: "Jorys Bovet",
    citation: "Ou quand le bien vivre ensemble te rencontre (contextualisant une vidéo de violence de rue)",
    type: "racisme",
    date_declaration: "2024-06-01",
    source_url: "https://cartedelahonte.github.io/",
    source_media: "Carte de la honte",
    contexte: "Candidat RN 2e Allier. Rhétorique raciste sur les réseaux sociaux.",
    est_condamnation: false
  },
  {
    auteur: "Bryan Masson",
    citation: "Multiples insultes homophobes en tant que responsable de section FNJ",
    type: "homophobie",
    date_declaration: "2024-06-01",
    source_url: "https://cartedelahonte.github.io/",
    source_media: "Carte de la honte",
    contexte: "Candidat RN 6e Alpes-Maritimes. Ancien responsable Front National Jeunesse.",
    est_condamnation: false
  },
  {
    auteur: "Mathilde Paris",
    citation: "L'avortement est comparable aux crimes de l'idéologie nazie",
    type: "autre",
    date_declaration: "2024-06-01",
    source_url: "https://cartedelahonte.github.io/",
    source_media: "Carte de la honte",
    contexte: "Candidate RN 3e Loiret. Rhétorique anti-IVG extrémiste.",
    est_condamnation: false
  },
  {
    auteur: "Andréa Kotarac",
    citation: "A participé au Forum de Yalta en Crimée occupée (2019) et rencontré Assad en Syrie (2018, 2019, 2021)",
    type: "autre",
    date_declaration: "2019-01-01",
    source_url: "https://cartedelahonte.github.io/",
    source_media: "Carte de la honte",
    contexte: "Candidat RN 2e Ain. Liens avec régimes autoritaires (Russie, Syrie).",
    est_condamnation: false
  },
  // Condamnation Laurent Jacobelli
  {
    auteur: "Laurent Jacobelli",
    citation: "A traité Belkhir Belhaddad de racaille et lui a demandé Il va bien le Hamas? quelques jours après le 7 octobre",
    type: "racisme",
    date_declaration: "2023-10-13",
    source_url: "https://france3-regions.franceinfo.fr/grand-est/moselle/metz/proces-du-depute-rn-laurent-jacobelli-condamne-a-300-euros-d-amende-une-parodie-de-justice-pour-belkhir-belhaddad-3210020.html",
    source_media: "France 3",
    contexte: "Député RN Moselle, porte-parole du parti. Condamné à 300€ avec sursis pour outrage et diffamation. Caractère raciste non retenu par le tribunal.",
    est_condamnation: true
  },
  // Thierry Mariani - plainte en cours
  {
    auteur: "Thierry Mariani",
    citation: "Programme municipal promettant la priorité nationale dans l'accès aux logements sociaux",
    type: "racisme",
    date_declaration: "2026-01-01",
    source_url: "https://www.francebleu.fr/infos/elections/municipales-2026-la-priorite-nationale-du-rn-attaquee-en-justice-9081203",
    source_media: "FranceBleu",
    contexte: "Tête de liste RN Paris municipales 2026. Plainte de la Maison des potes pour provocation à la discrimination envers les étrangers.",
    est_condamnation: false
  },
  // Mise à jour Daniel Grenon avec condamnation définitive
  {
    auteur: "Thierry Tsagalos",
    citation: "Exclu du RN après avoir revendiqué l'investiture contre France Jamet à Montpellier",
    type: "autre",
    date_declaration: "2026-01-01",
    source_url: "https://france3-regions.franceinfo.fr/occitanie/herault/montpellier/municipales-2026-deux-candidats-revendiquent-l-etiquette-et-les-votes-du-rassemblement-national-3284234.html",
    source_media: "France 3",
    contexte: "Ex-candidat RN Montpellier municipales 2026. Guerre interne au parti.",
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
