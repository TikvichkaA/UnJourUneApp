const fetch = require('node-fetch');

const SUPABASE_URL = 'https://hwunkojdzodcutewkfet.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dW5rb2pkem9kY3V0ZXdrZmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTMzNTAsImV4cCI6MjA4Mzk2OTM1MH0.Zpe-QqzKDIpx3pTa6_e9ysfI-Rprl3SXANM8b2pqXU0';

const dingueries = [
  { auteur: "Josseline Liban", citation: "Publications racistes et complotistes sur réseaux sociaux, relaie vidéos antivax", type: "racisme", date_declaration: "2024-06-01", source_url: "https://www.streetpress.com/sujet/1720200623-propos-racistes-homophobes-complotistes-liste-candidats-rassemblement-national-epingles-extreme-droite-bardella-deputes-assemblee", source_media: "StreetPress", contexte: "Candidate RN 2e circonscription Calvados", est_condamnation: false },
  { auteur: "Jacques Myard", citation: "Homosexualité = perversion sexuelle ; Ni les juifs, ni les catholiques qui ont déposé des bombes", type: "homophobie", date_declaration: "2011-01-01", source_url: "https://www.streetpress.com/", source_media: "Le Monde/BFMTV", contexte: "Candidat RN 5e Yvelines. Pro-russe notoire.", est_condamnation: false },
  { auteur: "Romain Baubry", citation: "Deux assistantes parlementaires militantes du groupuscule néofasciste Némésis", type: "autre", date_declaration: "2024-06-01", source_url: "https://www.streetpress.com/", source_media: "StreetPress", contexte: "Député RN 15e Bouches-du-Rhône", est_condamnation: false },
  { auteur: "Thomas Lutz", citation: "Les untermenschen, ça suffit !", type: "racisme", date_declaration: "2024-04-01", source_url: "https://www.francetvinfo.fr/", source_media: "FrancetvInfo", contexte: "Candidat RN 1re Doubs. Utilisation vocabulaire nazi.", est_condamnation: false },
  { auteur: "Annie Bell", citation: "Prise d'otages armée dans une mairie pendant 3 heures", type: "autre", date_declaration: "1995-01-01", source_url: "https://www.ouest-france.fr/", source_media: "Ouest-France", contexte: "Candidate RN 3e Mayenne. Condamnée à 10 mois de prison ferme pour séquestration avec armes.", est_condamnation: true },
  { auteur: "Christian Perez", citation: "J'ai cru voir des clandestins repartir chez eux et là paf, c'était que la pseudo-équipe de France", type: "racisme", date_declaration: "2022-11-19", source_url: "https://www.streetpress.com/", source_media: "StreetPress", contexte: "Candidat RN 8e Finistère. Liens négationnistes/pétainistes.", est_condamnation: false },
  { auteur: "Tiffany Joncour", citation: "Proche anciens de Génération identitaire, soutenue par Remparts de Lyon", type: "autre", date_declaration: "2024-06-01", source_url: "https://www.streetpress.com/", source_media: "StreetPress", contexte: "Candidate RN 13e Rhône. Liens groupuscules identitaires violents.", est_condamnation: false },
  { auteur: "Julie Apricena", citation: "Photographies avec skinheads néonazis, t-shirt White Pride Worldwide", type: "racisme", date_declaration: "2024-06-01", source_url: "https://www.streetpress.com/", source_media: "StreetPress", contexte: "Suppléante RN 3e Cher. Liens néonazis.", est_condamnation: false },
  { auteur: "Nicolas Conquer", citation: "Ancien porte-parole trumpiste, théories conspirationnistes", type: "autre", date_declaration: "2024-06-01", source_url: "https://www.streetpress.com/", source_media: "StreetPress", contexte: "Candidat RN 4e Manche. Complotisme.", est_condamnation: false },
  { auteur: "Antoine Oliviero", citation: "Surnommé le néonazi par militants locaux, liens compte néonazi L'Oriflamme", type: "racisme", date_declaration: "2024-06-01", source_url: "https://www.mediapart.fr/", source_media: "Mediapart", contexte: "Candidat RN 3e Morbihan. Néonazisme.", est_condamnation: false },
  { auteur: "José Gonzalez", citation: "Je ne suis pas là pour juger si l'OAS a commis des crimes", type: "autre", date_declaration: "2024-06-01", source_url: "https://www.europe1.fr/", source_media: "Europe 1", contexte: "Député RN 10e Bouches-du-Rhône. Relativisation terrorisme OAS.", est_condamnation: false },
  { auteur: "Virginie Joron", citation: "Liée mouvements antivax, activité parlementaire européenne sur blanchiment discours antivax", type: "autre", date_declaration: "2024-06-01", source_url: "https://www.huffingtonpost.fr/", source_media: "HuffPost", contexte: "Candidate RN 2e Bas-Rhin. Antivax, complotisme.", est_condamnation: false },
  { auteur: "Tony Bihouée", citation: "Les merdes migrantes dans l'avion ; insultes envers parents immigrés", type: "racisme", date_declaration: "2024-06-01", source_url: "https://www.mediapart.fr/", source_media: "Mediapart", contexte: "Candidat RN 4e Finistère.", est_condamnation: false },
  { auteur: "Monique Becker", citation: "Fan Algérie française/OAS, éloge Franco", type: "autre", date_declaration: "2024-06-01", source_url: "https://www.streetpress.com/", source_media: "StreetPress", contexte: "Candidate RN 2e Pyrénées-Atlantiques. 3e investiture RN.", est_condamnation: false },
  { auteur: "Julie Rechagneux", citation: "Côtoyé groupes néofascistes et néonazis", type: "autre", date_declaration: "2024-06-01", source_url: "https://www.streetpress.com/", source_media: "StreetPress", contexte: "Élue RN Parlement européen, 4e Gironde. Candidate municipales Bordeaux 2026.", est_condamnation: false },
  { auteur: "Christophe Bentz", citation: "IVG = génocide de masse ; Réhabilitons la race pour restaurer liberté penser", type: "autre", date_declaration: "2011-01-01", source_url: "https://www.france3-regions.franceinfo.fr/", source_media: "France 3", contexte: "Député RN 1re Haute-Marne. Anti-IVG, apologie race.", est_condamnation: false },
  { auteur: "Stéphanie Alarcon", citation: "Propos contre étrangers (sévir, radical), théories complotistes Ukraine", type: "racisme", date_declaration: "2024-06-01", source_url: "https://www.instagram.com/", source_media: "Instagram", contexte: "Candidate RN 3e Haute-Garonne. Racisme, complotisme.", est_condamnation: false },
  { auteur: "René Lioret", citation: "Tweets racistes Islam/immigration, vaccin Covid = arnaque", type: "racisme", date_declaration: "2024-06-01", source_url: "https://www.lemonde.fr/", source_media: "Le Monde/Libération", contexte: "Candidat RN 5e Côte-d'Or. Racisme, antivax, climatoscepticisme.", est_condamnation: false },
  { auteur: "Roger Chudeau", citation: "Nomination Vallaud-Belkacem ministre était une erreur, postes ministériels doivent être détenus par des Franco-Français", type: "racisme", date_declaration: "2024-06-01", source_url: "https://www.streetpress.com/", source_media: "StreetPress", contexte: "Député RN sortant Loir-et-Cher. Propos sur double loyauté.", est_condamnation: false }
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
