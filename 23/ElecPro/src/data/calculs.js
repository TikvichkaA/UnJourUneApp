// Exercices de calcul electrique interactifs

export const categories = [
  { id: 'base', nom: 'Formules de base', icon: '📐', description: 'Loi d\'Ohm, puissance' },
  { id: 'section', nom: 'Section de cable', icon: '🔌', description: 'Dimensionnement cables' },
  { id: 'chute', nom: 'Chute de tension', icon: '📉', description: 'Verification conformite' },
  { id: 'puissance', nom: 'Puissance', icon: '⚡', description: 'Mono et triphase' },
  { id: 'energie', nom: 'Energie', icon: '🔋', description: 'Consommation, facturation' }
]

export const calculsExercices = [
  // FORMULES DE BASE
  {
    id: 'intensite-mono',
    titre: 'Intensite monophase',
    categorie: 'base',
    difficulte: 1,
    formule: 'I = P / U',
    description: 'Calculer l\'intensite a partir de la puissance et tension',
    variables: [
      { id: 'P', nom: 'Puissance', unite: 'W', type: 'input', min: 100, max: 10000 },
      { id: 'U', nom: 'Tension', unite: 'V', valeur: 230, type: 'fixed' },
      { id: 'I', nom: 'Intensite', unite: 'A', type: 'result', decimales: 2 }
    ],
    calcul: (vals) => vals.P / vals.U,
    exemples: [
      { P: 2300, resultat: 10, tolerance: 0.1 },
      { P: 3000, resultat: 13.04, tolerance: 0.1 },
      { P: 1500, resultat: 6.52, tolerance: 0.1 }
    ],
    explication: 'En monophase, l\'intensite est simplement la puissance divisee par la tension. I = P / U. Par exemple, un appareil de 2300W sous 230V consomme 2300/230 = 10A.'
  },
  {
    id: 'puissance-mono',
    titre: 'Puissance monophase',
    categorie: 'base',
    difficulte: 1,
    formule: 'P = U x I',
    description: 'Calculer la puissance a partir de la tension et intensite',
    variables: [
      { id: 'U', nom: 'Tension', unite: 'V', valeur: 230, type: 'fixed' },
      { id: 'I', nom: 'Intensite', unite: 'A', type: 'input', min: 1, max: 50 },
      { id: 'P', nom: 'Puissance', unite: 'W', type: 'result', decimales: 0 }
    ],
    calcul: (vals) => vals.U * vals.I,
    exemples: [
      { I: 10, resultat: 2300, tolerance: 10 },
      { I: 16, resultat: 3680, tolerance: 10 },
      { I: 20, resultat: 4600, tolerance: 10 }
    ],
    explication: 'La puissance en monophase est le produit de la tension par l\'intensite. P = U x I. Un circuit 16A sous 230V peut fournir 230 x 16 = 3680W maximum.'
  },
  {
    id: 'resistance-ohm',
    titre: 'Loi d\'Ohm - Resistance',
    categorie: 'base',
    difficulte: 1,
    formule: 'R = U / I',
    description: 'Calculer la resistance a partir de la tension et intensite',
    variables: [
      { id: 'U', nom: 'Tension', unite: 'V', type: 'input', min: 1, max: 400 },
      { id: 'I', nom: 'Intensite', unite: 'A', type: 'input', min: 0.1, max: 50 },
      { id: 'R', nom: 'Resistance', unite: 'ohms', type: 'result', decimales: 1 }
    ],
    calcul: (vals) => vals.U / vals.I,
    exemples: [
      { U: 230, I: 10, resultat: 23, tolerance: 0.5 },
      { U: 12, I: 2, resultat: 6, tolerance: 0.1 },
      { U: 24, I: 0.5, resultat: 48, tolerance: 0.5 }
    ],
    explication: 'La loi d\'Ohm relie tension, intensite et resistance: U = R x I. La resistance R = U / I est exprimee en Ohms.'
  },
  {
    id: 'tension-ohm',
    titre: 'Loi d\'Ohm - Tension',
    categorie: 'base',
    difficulte: 1,
    formule: 'U = R x I',
    description: 'Calculer la tension a partir de la resistance et intensite',
    variables: [
      { id: 'R', nom: 'Resistance', unite: 'ohms', type: 'input', min: 1, max: 1000 },
      { id: 'I', nom: 'Intensite', unite: 'A', type: 'input', min: 0.1, max: 50 },
      { id: 'U', nom: 'Tension', unite: 'V', type: 'result', decimales: 1 }
    ],
    calcul: (vals) => vals.R * vals.I,
    exemples: [
      { R: 23, I: 10, resultat: 230, tolerance: 1 },
      { R: 100, I: 2.3, resultat: 230, tolerance: 1 }
    ],
    explication: 'Selon la loi d\'Ohm, la tension aux bornes d\'une resistance est U = R x I.'
  },

  // SECTION DE CABLE
  {
    id: 'section-eclairage',
    titre: 'Section circuit eclairage',
    categorie: 'section',
    difficulte: 2,
    formule: 'Tableau NF C 15-100',
    description: 'Determiner la section minimale pour un circuit eclairage',
    variables: [
      { id: 'protection', nom: 'Disjoncteur', unite: 'A', type: 'input', min: 10, max: 16 },
      { id: 'type', nom: 'Type circuit', unite: '', valeur: 'eclairage', type: 'fixed' },
      { id: 'section', nom: 'Section mini', unite: 'mm2', type: 'result', decimales: 1 }
    ],
    calcul: (vals) => vals.protection <= 10 ? 1.5 : 2.5,
    exemples: [
      { protection: 10, resultat: 1.5, tolerance: 0 },
      { protection: 16, resultat: 2.5, tolerance: 0 }
    ],
    explication: 'Selon la NF C 15-100, un circuit eclairage protege par disjoncteur 10A necessite du 1,5mm2 minimum. Au-dela de 10A, il faut du 2,5mm2.'
  },
  {
    id: 'section-prises',
    titre: 'Section circuit prises',
    categorie: 'section',
    difficulte: 2,
    formule: 'Tableau NF C 15-100',
    description: 'Determiner la section minimale pour un circuit prises',
    variables: [
      { id: 'protection', nom: 'Disjoncteur', unite: 'A', type: 'input', min: 16, max: 32 },
      { id: 'type', nom: 'Type circuit', unite: '', valeur: 'prises', type: 'fixed' },
      { id: 'section', nom: 'Section mini', unite: 'mm2', type: 'result', decimales: 1 }
    ],
    calcul: (vals) => {
      if (vals.protection <= 16) return 2.5
      if (vals.protection <= 20) return 2.5
      if (vals.protection <= 25) return 4
      return 6
    },
    exemples: [
      { protection: 16, resultat: 2.5, tolerance: 0 },
      { protection: 20, resultat: 2.5, tolerance: 0 },
      { protection: 32, resultat: 6, tolerance: 0 }
    ],
    explication: 'Circuit prises: 16A -> 2,5mm2, 20A -> 2,5mm2, 25A -> 4mm2, 32A -> 6mm2. Ces valeurs sont les minimums imposes par la NF C 15-100.'
  },

  // CHUTE DE TENSION
  {
    id: 'chute-mono',
    titre: 'Chute de tension monophase',
    categorie: 'chute',
    difficulte: 3,
    formule: 'dU = 2 x rho x L x I / S',
    description: 'Calculer la chute de tension en monophase',
    variables: [
      { id: 'L', nom: 'Longueur', unite: 'm', type: 'input', min: 1, max: 100 },
      { id: 'I', nom: 'Intensite', unite: 'A', type: 'input', min: 1, max: 50 },
      { id: 'S', nom: 'Section', unite: 'mm2', type: 'input', min: 1.5, max: 16 },
      { id: 'rho', nom: 'Resistivite Cu', unite: 'ohm.mm2/m', valeur: 0.0225, type: 'fixed' },
      { id: 'dU', nom: 'Chute tension', unite: 'V', type: 'result', decimales: 2 }
    ],
    calcul: (vals) => (2 * vals.rho * vals.L * vals.I) / vals.S,
    exemples: [
      { L: 25, I: 16, S: 2.5, resultat: 7.2, tolerance: 0.2 },
      { L: 15, I: 10, S: 1.5, resultat: 4.5, tolerance: 0.2 }
    ],
    explication: 'La chute de tension en monophase: dU = 2 x rho x L x I / S. Le facteur 2 correspond a l\'aller-retour du courant. rho(cuivre) = 0,0225 ohm.mm2/m. La chute doit rester < 3% pour l\'eclairage et < 5% pour les autres circuits.'
  },
  {
    id: 'chute-pourcent',
    titre: 'Chute de tension en %',
    categorie: 'chute',
    difficulte: 3,
    formule: 'dU% = (dU / U) x 100',
    description: 'Calculer la chute de tension en pourcentage',
    variables: [
      { id: 'dU', nom: 'Chute tension', unite: 'V', type: 'input', min: 0.1, max: 20 },
      { id: 'U', nom: 'Tension nominale', unite: 'V', valeur: 230, type: 'fixed' },
      { id: 'pourcent', nom: 'Chute en %', unite: '%', type: 'result', decimales: 2 }
    ],
    calcul: (vals) => (vals.dU / vals.U) * 100,
    exemples: [
      { dU: 6.9, resultat: 3, tolerance: 0.1 },
      { dU: 11.5, resultat: 5, tolerance: 0.1 }
    ],
    explication: 'Limites NF C 15-100: eclairage <= 3% (6,9V), autres usages <= 5% (11,5V). Au-dela, il faut augmenter la section ou reduire la longueur.'
  },

  // PUISSANCE
  {
    id: 'puissance-tri',
    titre: 'Puissance triphase',
    categorie: 'puissance',
    difficulte: 2,
    formule: 'P = sqrt(3) x U x I x cos(phi)',
    description: 'Calculer la puissance en triphase equilibre',
    variables: [
      { id: 'U', nom: 'Tension compose', unite: 'V', valeur: 400, type: 'fixed' },
      { id: 'I', nom: 'Intensite', unite: 'A', type: 'input', min: 1, max: 100 },
      { id: 'cos', nom: 'Cos phi', unite: '', type: 'input', min: 0.5, max: 1 },
      { id: 'P', nom: 'Puissance active', unite: 'W', type: 'result', decimales: 0 }
    ],
    calcul: (vals) => Math.sqrt(3) * vals.U * vals.I * vals.cos,
    exemples: [
      { I: 16, cos: 0.8, resultat: 8867, tolerance: 50 },
      { I: 10, cos: 1, resultat: 6928, tolerance: 50 }
    ],
    explication: 'En triphase equilibre, P = sqrt(3) x U x I x cos(phi). Avec U = 400V (tension compose), sqrt(3) = 1,732. Le cos(phi) represente le facteur de puissance (1 pour resistif, 0,8 typique moteur).'
  },
  {
    id: 'intensite-tri',
    titre: 'Intensite triphase',
    categorie: 'puissance',
    difficulte: 2,
    formule: 'I = P / (sqrt(3) x U x cos(phi))',
    description: 'Calculer l\'intensite en triphase',
    variables: [
      { id: 'P', nom: 'Puissance', unite: 'W', type: 'input', min: 1000, max: 50000 },
      { id: 'U', nom: 'Tension compose', unite: 'V', valeur: 400, type: 'fixed' },
      { id: 'cos', nom: 'Cos phi', unite: '', type: 'input', min: 0.5, max: 1 },
      { id: 'I', nom: 'Intensite', unite: 'A', type: 'result', decimales: 2 }
    ],
    calcul: (vals) => vals.P / (Math.sqrt(3) * vals.U * vals.cos),
    exemples: [
      { P: 11000, cos: 0.85, resultat: 18.68, tolerance: 0.2 },
      { P: 5500, cos: 1, resultat: 7.94, tolerance: 0.1 }
    ],
    explication: 'Pour dimensionner les protections et cables en triphase: I = P / (sqrt(3) x U x cos phi). Un moteur 11kW avec cos phi = 0,85 consomme environ 18,7A.'
  },

  // ENERGIE
  {
    id: 'energie-kwh',
    titre: 'Energie consommee',
    categorie: 'energie',
    difficulte: 1,
    formule: 'E = P x t',
    description: 'Calculer l\'energie consommee en kWh',
    variables: [
      { id: 'P', nom: 'Puissance', unite: 'W', type: 'input', min: 10, max: 10000 },
      { id: 't', nom: 'Duree', unite: 'h', type: 'input', min: 0.5, max: 24 },
      { id: 'E', nom: 'Energie', unite: 'kWh', type: 'result', decimales: 2 }
    ],
    calcul: (vals) => (vals.P * vals.t) / 1000,
    exemples: [
      { P: 2000, t: 2, resultat: 4, tolerance: 0.01 },
      { P: 1000, t: 8, resultat: 8, tolerance: 0.01 }
    ],
    explication: 'L\'energie E = P x t. Un radiateur de 2000W allume 2h consomme 2000 x 2 = 4000 Wh = 4 kWh.'
  },
  {
    id: 'cout-energie',
    titre: 'Cout de consommation',
    categorie: 'energie',
    difficulte: 1,
    formule: 'Cout = E x prix',
    description: 'Calculer le cout de l\'energie consommee',
    variables: [
      { id: 'E', nom: 'Energie', unite: 'kWh', type: 'input', min: 1, max: 1000 },
      { id: 'prix', nom: 'Prix kWh', unite: 'euros', valeur: 0.25, type: 'fixed' },
      { id: 'cout', nom: 'Cout total', unite: 'euros', type: 'result', decimales: 2 }
    ],
    calcul: (vals) => vals.E * vals.prix,
    exemples: [
      { E: 100, resultat: 25, tolerance: 0.1 },
      { E: 250, resultat: 62.5, tolerance: 0.1 }
    ],
    explication: 'Le cout = energie x prix du kWh. Avec un tarif moyen de 0,25 euros/kWh, 100 kWh coutent 25 euros.'
  },
  {
    id: 'chauffage-eau',
    titre: 'Energie chauffage eau',
    categorie: 'energie',
    difficulte: 2,
    formule: 'E = m x c x dT / 3600',
    description: 'Calculer l\'energie pour chauffer de l\'eau',
    variables: [
      { id: 'V', nom: 'Volume eau', unite: 'L', type: 'input', min: 10, max: 300 },
      { id: 'dT', nom: 'Ecart temperature', unite: 'C', type: 'input', min: 10, max: 60 },
      { id: 'c', nom: 'Chaleur massique', unite: 'Wh/kg.K', valeur: 1.16, type: 'fixed' },
      { id: 'E', nom: 'Energie', unite: 'kWh', type: 'result', decimales: 2 }
    ],
    calcul: (vals) => (vals.V * vals.c * vals.dT) / 1000,
    exemples: [
      { V: 200, dT: 45, resultat: 10.44, tolerance: 0.1 },
      { V: 150, dT: 40, resultat: 6.96, tolerance: 0.1 }
    ],
    explication: 'Chauffer 1L d\'eau de 1C necessite 1,16 Wh. Un ballon de 200L chauffe de 15C a 60C (dT=45C) consomme 200 x 1,16 x 45 = 10 440 Wh = 10,44 kWh.'
  }
]

export function getCalculById(id) {
  return calculsExercices.find(c => c.id === id)
}

export function getCalculsByCategorie(categorieId) {
  return calculsExercices.filter(c => c.categorie === categorieId)
}

export function getCategorieById(id) {
  return categories.find(c => c.id === id)
}
