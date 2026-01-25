// Exercices de schémas à compléter - Drag & Drop

export const symbolesDisponibles = {
  'ddr-30ma': {
    id: 'ddr-30ma',
    nom: 'DDR 30mA',
    description: 'Interrupteur différentiel 30mA',
    svg: `<rect x="5" y="10" width="30" height="20" fill="none" stroke="currentColor" stroke-width="2"/>
          <line x1="5" y1="20" x2="0" y2="20" stroke="currentColor" stroke-width="2"/>
          <line x1="35" y1="20" x2="40" y2="20" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="25" font-size="6" text-anchor="middle" fill="currentColor">30</text>`
  },
  'ddr-300ma': {
    id: 'ddr-300ma',
    nom: 'DDR 300mA',
    description: 'Interrupteur différentiel 300mA',
    svg: `<rect x="5" y="10" width="30" height="20" fill="none" stroke="currentColor" stroke-width="2"/>
          <line x1="5" y1="20" x2="0" y2="20" stroke="currentColor" stroke-width="2"/>
          <line x1="35" y1="20" x2="40" y2="20" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="25" font-size="6" text-anchor="middle" fill="currentColor">300</text>`
  },
  'disj-10a': {
    id: 'disj-10a',
    nom: 'Disjoncteur 10A',
    description: 'Disjoncteur divisionnaire 10A',
    svg: `<line x1="0" y1="20" x2="15" y2="20" stroke="currentColor" stroke-width="2"/>
          <line x1="15" y1="20" x2="25" y2="10" stroke="currentColor" stroke-width="2"/>
          <line x1="25" y1="20" x2="40" y2="20" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="35" font-size="6" text-anchor="middle" fill="currentColor">10A</text>`
  },
  'disj-16a': {
    id: 'disj-16a',
    nom: 'Disjoncteur 16A',
    description: 'Disjoncteur divisionnaire 16A',
    svg: `<line x1="0" y1="20" x2="15" y2="20" stroke="currentColor" stroke-width="2"/>
          <line x1="15" y1="20" x2="25" y2="10" stroke="currentColor" stroke-width="2"/>
          <line x1="25" y1="20" x2="40" y2="20" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="35" font-size="6" text-anchor="middle" fill="currentColor">16A</text>`
  },
  'disj-20a': {
    id: 'disj-20a',
    nom: 'Disjoncteur 20A',
    description: 'Disjoncteur divisionnaire 20A',
    svg: `<line x1="0" y1="20" x2="15" y2="20" stroke="currentColor" stroke-width="2"/>
          <line x1="15" y1="20" x2="25" y2="10" stroke="currentColor" stroke-width="2"/>
          <line x1="25" y1="20" x2="40" y2="20" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="35" font-size="6" text-anchor="middle" fill="currentColor">20A</text>`
  },
  'disj-32a': {
    id: 'disj-32a',
    nom: 'Disjoncteur 32A',
    description: 'Disjoncteur divisionnaire 32A',
    svg: `<line x1="0" y1="20" x2="15" y2="20" stroke="currentColor" stroke-width="2"/>
          <line x1="15" y1="20" x2="25" y2="10" stroke="currentColor" stroke-width="2"/>
          <line x1="25" y1="20" x2="40" y2="20" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="35" font-size="6" text-anchor="middle" fill="currentColor">32A</text>`
  },
  'prise': {
    id: 'prise',
    nom: 'Prise de courant',
    description: 'Prise 2P+T 16A',
    svg: `<circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" stroke-width="2"/>
          <line x1="20" y1="8" x2="20" y2="2" stroke="currentColor" stroke-width="2"/>
          <line x1="14" y1="20" x2="26" y2="20" stroke="currentColor" stroke-width="2"/>`
  },
  'lampe': {
    id: 'lampe',
    nom: 'Point lumineux',
    description: 'Lampe / éclairage',
    svg: `<circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <line x1="13" y1="13" x2="27" y2="27" stroke="currentColor" stroke-width="2"/>
          <line x1="27" y1="13" x2="13" y2="27" stroke="currentColor" stroke-width="2"/>`
  },
  'interrupteur': {
    id: 'interrupteur',
    nom: 'Interrupteur simple',
    description: 'Interrupteur simple allumage',
    svg: `<circle cx="10" cy="20" r="4" fill="currentColor"/>
          <line x1="14" y1="20" x2="30" y2="10" stroke="currentColor" stroke-width="2"/>`
  },
  'va-et-vient': {
    id: 'va-et-vient',
    nom: 'Va-et-vient',
    description: 'Interrupteur va-et-vient',
    svg: `<circle cx="10" cy="20" r="4" fill="currentColor"/>
          <line x1="14" y1="20" x2="30" y2="10" stroke="currentColor" stroke-width="2"/>
          <line x1="14" y1="20" x2="30" y2="30" stroke="currentColor" stroke-width="2"/>`
  },
  'terre': {
    id: 'terre',
    nom: 'Prise de terre',
    description: 'Mise à la terre',
    svg: `<line x1="20" y1="5" x2="20" y2="15" stroke="currentColor" stroke-width="2"/>
          <line x1="10" y1="15" x2="30" y2="15" stroke="currentColor" stroke-width="2"/>
          <line x1="13" y1="20" x2="27" y2="20" stroke="currentColor" stroke-width="2"/>
          <line x1="16" y1="25" x2="24" y2="25" stroke="currentColor" stroke-width="2"/>`
  },
  'parafoudre': {
    id: 'parafoudre',
    nom: 'Parafoudre',
    description: 'Protection contre surtensions',
    svg: `<polygon points="20,5 25,18 20,18 25,35 15,20 20,20 15,5" fill="none" stroke="currentColor" stroke-width="2"/>`
  }
}

export const schemasExercices = [
  {
    id: 'tableau-divisionnaire',
    titre: 'Tableau divisionnaire',
    description: 'Complétez ce tableau avec les protections appropriées pour une installation résidentielle standard.',
    difficulte: 2,
    dureeEstimee: '5 min',
    icon: '🔌',
    categorie: 'tableaux',
    elementsAffiches: [
      { type: 'text', x: 20, y: 25, text: 'AGCP', fontSize: 10 },
      { type: 'rect', x: 50, y: 10, width: 40, height: 30, label: 'DB 500mA' },
      { type: 'line', x1: 90, y1: 25, x2: 130, y2: 25 },
      { type: 'text', x: 50, y: 70, text: 'Rangée 1 - Éclairage', fontSize: 8 },
      { type: 'text', x: 50, y: 150, text: 'Rangée 2 - Prises', fontSize: 8 },
      { type: 'text', x: 50, y: 230, text: 'Rangée 3 - Spécialisés', fontSize: 8 },
    ],
    zonesVides: [
      { id: 'z1', x: 130, y: 10, width: 50, height: 30, attendu: 'ddr-30ma', hint: 'Protection différentielle haute sensibilité pour rangée éclairage' },
      { id: 'z2', x: 190, y: 10, width: 50, height: 30, attendu: 'disj-10a', hint: 'Protection circuit éclairage chambre' },
      { id: 'z3', x: 250, y: 10, width: 50, height: 30, attendu: 'disj-10a', hint: 'Protection circuit éclairage salon' },
      { id: 'z4', x: 130, y: 90, width: 50, height: 30, attendu: 'ddr-30ma', hint: 'Protection différentielle pour rangée prises' },
      { id: 'z5', x: 190, y: 90, width: 50, height: 30, attendu: 'disj-16a', hint: 'Protection circuit prises chambre' },
      { id: 'z6', x: 250, y: 90, width: 50, height: 30, attendu: 'disj-16a', hint: 'Protection circuit prises salon' },
      { id: 'z7', x: 130, y: 170, width: 50, height: 30, attendu: 'ddr-30ma', hint: 'Protection différentielle spécialisés' },
      { id: 'z8', x: 190, y: 170, width: 50, height: 30, attendu: 'disj-20a', hint: 'Protection lave-linge' },
      { id: 'z9', x: 250, y: 170, width: 50, height: 30, attendu: 'disj-32a', hint: 'Protection plaque de cuisson' },
    ],
    palette: ['ddr-30ma', 'ddr-300ma', 'disj-10a', 'disj-16a', 'disj-20a', 'disj-32a'],
    explication: 'Un tableau divisionnaire doit comporter un DDR 30mA en tête de chaque rangée pour la protection des personnes. Les calibres des disjoncteurs sont adaptés aux circuits : 10A pour l\'éclairage, 16A pour les prises, 20A pour les circuits spécialisés type lave-linge, et 32A pour la plaque de cuisson.'
  },
  {
    id: 'schema-va-et-vient',
    titre: 'Montage va-et-vient',
    description: 'Complétez le schéma de câblage d\'un va-et-vient avec une lampe.',
    difficulte: 1,
    dureeEstimee: '3 min',
    icon: '💡',
    categorie: 'montages',
    elementsAffiches: [
      { type: 'text', x: 10, y: 15, text: 'Phase', fontSize: 8 },
      { type: 'line', x1: 40, y1: 15, x2: 70, y2: 15, color: '#e74c3c' },
      { type: 'text', x: 10, y: 180, text: 'Neutre', fontSize: 8 },
      { type: 'line', x1: 40, y1: 180, x2: 280, y2: 180, color: '#3498db' },
      { type: 'line', x1: 260, y1: 180, x2: 260, y2: 150, color: '#3498db' },
      { type: 'text', x: 240, y: 140, text: 'Lampe', fontSize: 8 },
    ],
    zonesVides: [
      { id: 'z1', x: 70, y: 5, width: 50, height: 30, attendu: 'va-et-vient', hint: 'Premier interrupteur va-et-vient' },
      { id: 'z2', x: 170, y: 5, width: 50, height: 30, attendu: 'va-et-vient', hint: 'Second interrupteur va-et-vient' },
      { id: 'z3', x: 240, y: 90, width: 40, height: 40, attendu: 'lampe', hint: 'Point lumineux commandé' },
    ],
    palette: ['interrupteur', 'va-et-vient', 'lampe', 'prise'],
    explication: 'Le montage va-et-vient permet de commander un point lumineux depuis deux endroits différents. La phase arrive sur le premier interrupteur, les navettes relient les deux interrupteurs, et le retour lampe part du second interrupteur vers la lampe. Le neutre est connecté directement à la lampe.'
  },
  {
    id: 'circuit-prises',
    titre: 'Circuit prises cuisine',
    description: 'Ajoutez les protections nécessaires pour un circuit de prises de cuisine.',
    difficulte: 2,
    dureeEstimee: '4 min',
    icon: '🔧',
    categorie: 'circuits',
    elementsAffiches: [
      { type: 'text', x: 10, y: 20, text: 'Depuis tableau', fontSize: 8 },
      { type: 'line', x1: 80, y1: 20, x2: 100, y2: 20 },
      { type: 'text', x: 200, y: 90, text: 'Prises plan travail', fontSize: 7 },
      { type: 'text', x: 200, y: 170, text: 'Prise four', fontSize: 7 },
      { type: 'text', x: 200, y: 250, text: 'Prise lave-vaisselle', fontSize: 7 },
    ],
    zonesVides: [
      { id: 'z1', x: 100, y: 5, width: 50, height: 30, attendu: 'ddr-30ma', hint: 'Protection différentielle obligatoire cuisine' },
      { id: 'z2', x: 100, y: 75, width: 50, height: 30, attendu: 'disj-16a', hint: 'Protection prises plan de travail' },
      { id: 'z3', x: 160, y: 75, width: 40, height: 40, attendu: 'prise', hint: 'Prise de courant' },
      { id: 'z4', x: 100, y: 155, width: 50, height: 30, attendu: 'disj-20a', hint: 'Protection circuit four (spécialisé)' },
      { id: 'z5', x: 160, y: 155, width: 40, height: 40, attendu: 'prise', hint: 'Prise dédiée four' },
      { id: 'z6', x: 100, y: 235, width: 50, height: 30, attendu: 'disj-20a', hint: 'Protection lave-vaisselle (spécialisé)' },
      { id: 'z7', x: 160, y: 235, width: 40, height: 40, attendu: 'prise', hint: 'Prise dédiée lave-vaisselle' },
    ],
    palette: ['ddr-30ma', 'ddr-300ma', 'disj-16a', 'disj-20a', 'disj-32a', 'prise'],
    explication: 'La cuisine nécessite plusieurs circuits spécialisés selon la NF C 15-100. Les prises du plan de travail sont protégées par un disjoncteur 16A. Le four et le lave-vaisselle sont sur des circuits dédiés avec disjoncteur 20A chacun. Tous ces circuits doivent être protégés par un DDR 30mA.'
  },
  {
    id: 'identification-erreurs',
    titre: 'Identifier les erreurs',
    description: 'Ce schéma contient des erreurs. Remplacez les composants incorrects par les bons.',
    difficulte: 3,
    dureeEstimee: '5 min',
    icon: '❌',
    categorie: 'diagnostic',
    elementsAffiches: [
      { type: 'text', x: 10, y: 20, text: 'Salle de bain', fontSize: 10, color: '#e74c3c' },
      { type: 'text', x: 10, y: 40, text: '(Volume 2)', fontSize: 8 },
      { type: 'line', x1: 10, y1: 60, x2: 80, y2: 60 },
      { type: 'text', x: 90, y: 90, text: 'Éclairage', fontSize: 7 },
      { type: 'text', x: 90, y: 160, text: 'Prise rasoir', fontSize: 7 },
      { type: 'text', x: 90, y: 230, text: 'Chauffe-eau', fontSize: 7 },
    ],
    zonesVides: [
      { id: 'z1', x: 80, y: 45, width: 50, height: 30, attendu: 'ddr-30ma', valeurInitiale: 'ddr-300ma', hint: 'La salle de bain nécessite un DDR haute sensibilité' },
      { id: 'z2', x: 150, y: 75, width: 50, height: 30, attendu: 'disj-10a', valeurInitiale: 'disj-16a', hint: 'Calibre éclairage' },
      { id: 'z3', x: 150, y: 145, width: 50, height: 30, attendu: 'disj-16a', valeurInitiale: 'disj-16a', hint: 'Calibre prise rasoir correct' },
      { id: 'z4', x: 150, y: 215, width: 50, height: 30, attendu: 'disj-20a', valeurInitiale: 'disj-10a', hint: 'Calibre chauffe-eau' },
    ],
    palette: ['ddr-30ma', 'ddr-300ma', 'disj-10a', 'disj-16a', 'disj-20a', 'disj-32a'],
    explication: 'Dans une salle de bain, le DDR doit être de 30mA (haute sensibilité) et non 300mA. L\'éclairage doit être protégé par un 10A, pas un 16A. Le chauffe-eau est un circuit spécialisé nécessitant un 20A minimum, pas un 10A. Seul le circuit prise rasoir était correct avec son 16A.'
  },
  {
    id: 'protection-parafoudre',
    titre: 'Installation parafoudre',
    description: 'Positionnez correctement le parafoudre et ses protections associées.',
    difficulte: 3,
    dureeEstimee: '4 min',
    icon: '⚡',
    categorie: 'protections',
    elementsAffiches: [
      { type: 'text', x: 10, y: 25, text: 'AGCP', fontSize: 9 },
      { type: 'rect', x: 45, y: 10, width: 40, height: 30, label: 'DB' },
      { type: 'line', x1: 85, y1: 25, x2: 120, y2: 25 },
      { type: 'text', x: 130, y: 25, text: 'Vers DDR', fontSize: 8 },
      { type: 'line', x1: 85, y1: 25, x2: 85, y2: 80 },
      { type: 'line', x1: 85, y1: 80, x2: 120, y2: 80 },
      { type: 'text', x: 10, y: 140, text: 'Terre', fontSize: 8 },
      { type: 'line', x1: 40, y1: 140, x2: 200, y2: 140, color: '#27ae60' },
    ],
    zonesVides: [
      { id: 'z1', x: 120, y: 65, width: 50, height: 30, attendu: 'disj-20a', hint: 'Protection amont du parafoudre' },
      { id: 'z2', x: 180, y: 65, width: 40, height: 40, attendu: 'parafoudre', hint: 'Dispositif de protection contre les surtensions' },
      { id: 'z3', x: 195, y: 120, width: 30, height: 30, attendu: 'terre', hint: 'Raccordement à la terre le plus court possible' },
    ],
    palette: ['disj-16a', 'disj-20a', 'disj-32a', 'parafoudre', 'terre', 'ddr-30ma'],
    explication: 'Le parafoudre doit être installé au plus près de l\'origine de l\'installation, après le disjoncteur de branchement. Il doit être protégé par un disjoncteur (souvent 20A) et raccordé à la terre par le chemin le plus court possible (max 50cm recommandé). Le câble de terre ne doit pas faire de coudes prononcés.'
  },
  {
    id: 'eclairage-simple',
    titre: 'Circuit éclairage simple',
    description: 'Complétez ce circuit d\'éclairage simple allumage.',
    difficulte: 1,
    dureeEstimee: '2 min',
    icon: '💡',
    categorie: 'montages',
    elementsAffiches: [
      { type: 'text', x: 10, y: 15, text: 'Phase', fontSize: 8, color: '#e74c3c' },
      { type: 'line', x1: 40, y1: 15, x2: 60, y2: 15, color: '#e74c3c' },
      { type: 'text', x: 10, y: 150, text: 'Neutre', fontSize: 8, color: '#3498db' },
      { type: 'line', x1: 40, y1: 150, x2: 200, y2: 150, color: '#3498db' },
      { type: 'line', x1: 180, y1: 150, x2: 180, y2: 120, color: '#3498db' },
    ],
    zonesVides: [
      { id: 'z1', x: 60, y: 5, width: 50, height: 30, attendu: 'interrupteur', hint: 'Commande de l\'éclairage' },
      { id: 'z2', x: 160, y: 70, width: 40, height: 40, attendu: 'lampe', hint: 'Point lumineux' },
    ],
    palette: ['interrupteur', 'va-et-vient', 'lampe', 'prise'],
    explication: 'Le montage simple allumage est le plus basique. La phase passe par l\'interrupteur qui coupe ou établit le circuit vers la lampe. Le neutre est connecté directement à la lampe. C\'est le montage de base pour commander un point lumineux depuis un seul endroit.'
  }
]

export function getSchemaById(id) {
  return schemasExercices.find(s => s.id === id)
}

export function getSchemasByCategorie(categorie) {
  return schemasExercices.filter(s => s.categorie === categorie)
}

export function getAllCategories() {
  const categories = [...new Set(schemasExercices.map(s => s.categorie))]
  return categories.map(cat => ({
    id: cat,
    label: {
      'tableaux': 'Tableaux électriques',
      'montages': 'Montages de base',
      'circuits': 'Circuits spécialisés',
      'diagnostic': 'Diagnostic',
      'protections': 'Protections'
    }[cat] || cat
  }))
}
