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
  },
  'telerupteur': {
    id: 'telerupteur',
    nom: 'Télérupteur',
    description: 'Commande impulsionnelle',
    svg: `<rect x="5" y="8" width="30" height="24" fill="none" stroke="currentColor" stroke-width="2"/>
          <line x1="5" y1="20" x2="0" y2="20" stroke="currentColor" stroke-width="2"/>
          <line x1="35" y1="20" x2="40" y2="20" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="24" font-size="7" text-anchor="middle" fill="currentColor">T</text>`
  },
  'minuterie': {
    id: 'minuterie',
    nom: 'Minuterie',
    description: 'Temporisation éclairage',
    svg: `<rect x="5" y="8" width="30" height="24" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="20" cy="20" r="6" fill="none" stroke="currentColor" stroke-width="1"/>
          <line x1="20" y1="20" x2="20" y2="15" stroke="currentColor" stroke-width="1"/>
          <line x1="20" y1="20" x2="24" y2="22" stroke="currentColor" stroke-width="1"/>`
  },
  'bouton-poussoir': {
    id: 'bouton-poussoir',
    nom: 'Bouton poussoir',
    description: 'Commande momentanée',
    svg: `<circle cx="10" cy="20" r="4" fill="currentColor"/>
          <line x1="14" y1="20" x2="30" y2="20" stroke="currentColor" stroke-width="2"/>
          <line x1="30" y1="15" x2="30" y2="25" stroke="currentColor" stroke-width="2"/>`
  },
  'disj-2a': {
    id: 'disj-2a',
    nom: 'Disjoncteur 2A',
    description: 'Disjoncteur divisionnaire 2A',
    svg: `<line x1="0" y1="20" x2="15" y2="20" stroke="currentColor" stroke-width="2"/>
          <line x1="15" y1="20" x2="25" y2="10" stroke="currentColor" stroke-width="2"/>
          <line x1="25" y1="20" x2="40" y2="20" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="35" font-size="6" text-anchor="middle" fill="currentColor">2A</text>`
  },
  'moteur': {
    id: 'moteur',
    nom: 'Moteur',
    description: 'Moteur électrique',
    svg: `<circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="24" font-size="10" text-anchor="middle" fill="currentColor">M</text>`
  },
  'inter-volet': {
    id: 'inter-volet',
    nom: 'Inter volet',
    description: 'Interrupteur montée/descente',
    svg: `<rect x="8" y="8" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"/>
          <polygon points="20,12 26,18 14,18" fill="currentColor"/>
          <polygon points="20,28 14,22 26,22" fill="currentColor"/>`
  },
  'inter-vmc': {
    id: 'inter-vmc',
    nom: 'Inter VMC',
    description: 'Interrupteur 2 vitesses',
    svg: `<rect x="8" y="8" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="17" font-size="6" text-anchor="middle" fill="currentColor">GV</text>
          <line x1="10" y1="20" x2="30" y2="20" stroke="currentColor" stroke-width="1"/>
          <text x="20" y="28" font-size="6" text-anchor="middle" fill="currentColor">PV</text>`
  },
  'delesteur': {
    id: 'delesteur',
    nom: 'Délesteur',
    description: 'Gestion des priorités',
    svg: `<rect x="5" y="8" width="30" height="24" fill="none" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="18" font-size="5" text-anchor="middle" fill="currentColor">DEL</text>
          <line x1="12" y1="22" x2="18" y2="26" stroke="currentColor" stroke-width="1"/>
          <line x1="22" y1="22" x2="28" y2="26" stroke="currentColor" stroke-width="1"/>`
  },
  'contacteur-jn': {
    id: 'contacteur-jn',
    nom: 'Contacteur J/N',
    description: 'Contacteur heures creuses',
    svg: `<rect x="5" y="8" width="30" height="24" fill="none" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="17" font-size="5" text-anchor="middle" fill="currentColor">J/N</text>
          <line x1="10" y1="22" x2="17" y2="22" stroke="currentColor" stroke-width="2"/>
          <line x1="17" y1="22" x2="23" y2="28" stroke="currentColor" stroke-width="2"/>
          <line x1="23" y1="22" x2="30" y2="22" stroke="currentColor" stroke-width="2"/>`
  },
  'chauffe-eau': {
    id: 'chauffe-eau',
    nom: 'Chauffe-eau',
    description: 'Ballon eau chaude',
    svg: `<rect x="8" y="5" width="24" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M14,20 Q20,25 26,20" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M14,26 Q20,31 26,26" fill="none" stroke="currentColor" stroke-width="2"/>`
  },
  // Symboles courants faibles
  'platine-rue': {
    id: 'platine-rue',
    nom: 'Platine de rue',
    description: 'Interphone exterieur',
    svg: `<rect x="8" y="5" width="24" height="30" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="20" cy="14" r="4" fill="none" stroke="currentColor" stroke-width="1"/>
          <rect x="14" y="22" width="12" height="8" fill="none" stroke="currentColor" stroke-width="1"/>
          <line x1="16" y1="25" x2="24" y2="25" stroke="currentColor" stroke-width="1"/>
          <line x1="16" y1="28" x2="24" y2="28" stroke="currentColor" stroke-width="1"/>`
  },
  'combine-interieur': {
    id: 'combine-interieur',
    nom: 'Combine interieur',
    description: 'Poste interieur interphone',
    svg: `<rect x="10" y="8" width="20" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="20" cy="16" r="4" fill="none" stroke="currentColor" stroke-width="1"/>
          <rect x="14" y="24" width="12" height="4" fill="none" stroke="currentColor" stroke-width="1"/>`
  },
  'gache-electrique': {
    id: 'gache-electrique',
    nom: 'Gache electrique',
    description: 'Serrure electrique',
    svg: `<rect x="10" y="8" width="20" height="24" rx="1" fill="none" stroke="currentColor" stroke-width="2"/>
          <rect x="14" y="12" width="12" height="8" fill="none" stroke="currentColor" stroke-width="1"/>
          <circle cx="20" cy="26" r="3" fill="none" stroke="currentColor" stroke-width="1"/>`
  },
  'centrale-alarme': {
    id: 'centrale-alarme',
    nom: 'Centrale alarme',
    description: 'Centrale de detection intrusion',
    svg: `<rect x="5" y="8" width="30" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="18" font-size="6" text-anchor="middle" fill="currentColor">ALARM</text>
          <circle cx="12" cy="26" r="2" fill="currentColor"/>
          <circle cx="20" cy="26" r="2" fill="currentColor"/>
          <circle cx="28" cy="26" r="2" fill="currentColor"/>`
  },
  'detecteur-mouvement': {
    id: 'detecteur-mouvement',
    nom: 'Detecteur mouvement',
    description: 'Detecteur infrarouge passif',
    svg: `<path d="M10,30 L20,10 L30,30 Z" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="20" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="1"/>
          <path d="M12,28 Q20,20 28,28" fill="none" stroke="currentColor" stroke-width="1"/>`
  },
  'detecteur-ouverture': {
    id: 'detecteur-ouverture',
    nom: 'Detecteur ouverture',
    description: 'Contact magnetique porte/fenetre',
    svg: `<rect x="5" y="14" width="14" height="12" fill="none" stroke="currentColor" stroke-width="2"/>
          <rect x="21" y="14" width="14" height="12" fill="none" stroke="currentColor" stroke-width="2"/>
          <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" stroke-width="2"/>
          <line x1="28" y1="18" x2="28" y2="22" stroke="currentColor" stroke-width="2"/>`
  },
  'sirene': {
    id: 'sirene',
    nom: 'Sirene',
    description: 'Sirene interieure ou exterieure',
    svg: `<ellipse cx="20" cy="20" rx="12" ry="8" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M12,16 Q8,20 12,24" fill="none" stroke="currentColor" stroke-width="1"/>
          <path d="M28,16 Q32,20 28,24" fill="none" stroke="currentColor" stroke-width="1"/>
          <line x1="16" y1="20" x2="24" y2="20" stroke="currentColor" stroke-width="2"/>`
  },
  'clavier-alarme': {
    id: 'clavier-alarme',
    nom: 'Clavier alarme',
    description: 'Clavier de commande alarme',
    svg: `<rect x="8" y="8" width="24" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
          <rect x="12" y="12" width="4" height="3" fill="currentColor"/>
          <rect x="18" y="12" width="4" height="3" fill="currentColor"/>
          <rect x="24" y="12" width="4" height="3" fill="currentColor"/>
          <rect x="12" y="17" width="4" height="3" fill="currentColor"/>
          <rect x="18" y="17" width="4" height="3" fill="currentColor"/>
          <rect x="24" y="17" width="4" height="3" fill="currentColor"/>
          <rect x="12" y="22" width="4" height="3" fill="currentColor"/>
          <rect x="18" y="22" width="4" height="3" fill="currentColor"/>
          <rect x="24" y="22" width="4" height="3" fill="currentColor"/>
          <rect x="12" y="27" width="16" height="3" fill="currentColor"/>`
  },
  'alimentation-12v': {
    id: 'alimentation-12v',
    nom: 'Alimentation 12V',
    description: 'Bloc alimentation courants faibles',
    svg: `<rect x="8" y="10" width="24" height="20" fill="none" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="23" font-size="7" text-anchor="middle" fill="currentColor">12V</text>
          <line x1="0" y1="20" x2="8" y2="20" stroke="currentColor" stroke-width="2"/>
          <line x1="32" y1="16" x2="40" y2="16" stroke="currentColor" stroke-width="2"/>
          <line x1="32" y1="24" x2="40" y2="24" stroke="currentColor" stroke-width="2"/>
          <text x="36" y="14" font-size="5" fill="currentColor">+</text>
          <text x="36" y="28" font-size="5" fill="currentColor">-</text>`
  },
  'ventouse': {
    id: 'ventouse',
    nom: 'Ventouse',
    description: 'Ventouse electromagnetique',
    svg: `<rect x="5" y="15" width="15" height="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <rect x="20" y="12" width="15" height="16" fill="none" stroke="currentColor" stroke-width="2"/>
          <line x1="23" y1="18" x2="32" y2="18" stroke="currentColor" stroke-width="1"/>
          <line x1="23" y1="22" x2="32" y2="22" stroke="currentColor" stroke-width="1"/>`
  },
  'lecteur-badge': {
    id: 'lecteur-badge',
    nom: 'Lecteur badge',
    description: 'Lecteur de badges RFID',
    svg: `<rect x="10" y="8" width="20" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="20" cy="18" r="6" fill="none" stroke="currentColor" stroke-width="1"/>
          <rect x="16" y="26" width="8" height="3" fill="currentColor"/>`
  },
  'moteur-portail': {
    id: 'moteur-portail',
    nom: 'Moteur portail',
    description: 'Motorisation portail',
    svg: `<circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" stroke-width="2"/>
          <text x="20" y="23" font-size="8" text-anchor="middle" fill="currentColor">M</text>
          <line x1="32" y1="15" x2="38" y2="15" stroke="currentColor" stroke-width="2"/>
          <line x1="32" y1="20" x2="38" y2="20" stroke="currentColor" stroke-width="2"/>
          <line x1="32" y1="25" x2="38" y2="25" stroke="currentColor" stroke-width="2"/>`
  },
  'cellule-photo': {
    id: 'cellule-photo',
    nom: 'Cellule photo',
    description: 'Cellule photoelectrique',
    svg: `<circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <line x1="14" y1="20" x2="26" y2="20" stroke="currentColor" stroke-width="1"/>
          <path d="M10,14 L6,10" stroke="currentColor" stroke-width="1"/>
          <path d="M10,26 L6,30" stroke="currentColor" stroke-width="1"/>`
  },
  'clignotant': {
    id: 'clignotant',
    nom: 'Clignotant',
    description: 'Gyrophare de signalisation',
    svg: `<circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M14,14 L20,8 L26,14" fill="none" stroke="currentColor" stroke-width="1"/>
          <path d="M14,26 L20,32 L26,26" fill="none" stroke="currentColor" stroke-width="1"/>
          <circle cx="20" cy="20" r="4" fill="currentColor"/>`
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
      { type: 'line', x1: 110, y1: 25, x2: 110, y2: 185, color: '#374151' },
      { type: 'line', x1: 110, y1: 105, x2: 130, y2: 105 },
      { type: 'line', x1: 110, y1: 185, x2: 130, y2: 185 },
      { type: 'line', x1: 180, y1: 25, x2: 190, y2: 25 },
      { type: 'line', x1: 240, y1: 25, x2: 250, y2: 25 },
      { type: 'line', x1: 180, y1: 105, x2: 190, y2: 105 },
      { type: 'line', x1: 240, y1: 105, x2: 250, y2: 105 },
      { type: 'line', x1: 180, y1: 185, x2: 190, y2: 185 },
      { type: 'line', x1: 240, y1: 185, x2: 250, y2: 185 },
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
      { type: 'line', x1: 120, y1: 20, x2: 170, y2: 20, color: '#f97316' },
      { type: 'line', x1: 120, y1: 28, x2: 170, y2: 28, color: '#8b5cf6' },
      { type: 'line', x1: 220, y1: 20, x2: 260, y2: 90, color: '#f97316' },
      { type: 'text', x: 145, y: 15, text: 'Navettes', fontSize: 6, color: '#6b7280' },
      { type: 'text', x: 10, y: 180, text: 'Neutre', fontSize: 8 },
      { type: 'line', x1: 40, y1: 180, x2: 280, y2: 180, color: '#3498db' },
      { type: 'line', x1: 260, y1: 180, x2: 260, y2: 130, color: '#3498db' },
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
      { type: 'line', x1: 125, y1: 35, x2: 125, y2: 250, color: '#374151' },
      { type: 'line', x1: 125, y1: 90, x2: 100, y2: 90 },
      { type: 'line', x1: 125, y1: 170, x2: 100, y2: 170 },
      { type: 'line', x1: 125, y1: 250, x2: 100, y2: 250 },
      { type: 'line', x1: 150, y1: 90, x2: 160, y2: 90 },
      { type: 'line', x1: 150, y1: 170, x2: 160, y2: 170 },
      { type: 'line', x1: 150, y1: 250, x2: 160, y2: 250 },
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
      { type: 'line', x1: 105, y1: 75, x2: 105, y2: 230, color: '#374151' },
      { type: 'line', x1: 105, y1: 90, x2: 150, y2: 90 },
      { type: 'line', x1: 105, y1: 160, x2: 150, y2: 160 },
      { type: 'line', x1: 105, y1: 230, x2: 150, y2: 230 },
      { type: 'text', x: 210, y: 90, text: 'Éclairage', fontSize: 7 },
      { type: 'text', x: 210, y: 160, text: 'Prise rasoir', fontSize: 7 },
      { type: 'text', x: 210, y: 230, text: 'Chauffe-eau', fontSize: 7 },
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
      { type: 'line', x1: 85, y1: 25, x2: 250, y2: 25 },
      { type: 'text', x: 260, y: 25, text: 'Vers DDR', fontSize: 8 },
      { type: 'line', x1: 100, y1: 25, x2: 100, y2: 80 },
      { type: 'line', x1: 100, y1: 80, x2: 120, y2: 80 },
      { type: 'line', x1: 170, y1: 80, x2: 180, y2: 80 },
      { type: 'line', x1: 200, y1: 105, x2: 200, y2: 120 },
      { type: 'text', x: 10, y: 140, text: 'Terre', fontSize: 8 },
      { type: 'line', x1: 40, y1: 140, x2: 230, y2: 140, color: '#27ae60' },
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
      { type: 'line', x1: 110, y1: 20, x2: 180, y2: 70, color: '#f97316' },
      { type: 'text', x: 145, y: 40, text: 'Retour', fontSize: 6, color: '#6b7280' },
      { type: 'text', x: 10, y: 150, text: 'Neutre', fontSize: 8, color: '#3498db' },
      { type: 'line', x1: 40, y1: 150, x2: 200, y2: 150, color: '#3498db' },
      { type: 'line', x1: 180, y1: 150, x2: 180, y2: 110, color: '#3498db' },
    ],
    zonesVides: [
      { id: 'z1', x: 60, y: 5, width: 50, height: 30, attendu: 'interrupteur', hint: 'Commande de l\'éclairage' },
      { id: 'z2', x: 160, y: 70, width: 40, height: 40, attendu: 'lampe', hint: 'Point lumineux' },
    ],
    palette: ['interrupteur', 'va-et-vient', 'lampe', 'prise'],
    explication: 'Le montage simple allumage est le plus basique. La phase passe par l\'interrupteur qui coupe ou etablit le circuit vers la lampe. Le neutre est connecte directement a la lampe.'
  },
  {
    id: 'telerupteur-3bp',
    titre: 'Télérupteur 3 points',
    description: 'Câblez un télérupteur commandé par 3 boutons poussoirs.',
    difficulte: 2,
    dureeEstimee: '4 min',
    icon: '🔘',
    categorie: 'montages',
    elementsAffiches: [
      { type: 'text', x: 10, y: 20, text: 'Phase', fontSize: 8, color: '#e74c3c' },
      { type: 'line', x1: 40, y1: 20, x2: 60, y2: 20, color: '#e74c3c' },
      { type: 'line', x1: 60, y1: 20, x2: 60, y2: 140, color: '#e74c3c' },
      { type: 'line', x1: 60, y1: 60, x2: 80, y2: 60 },
      { type: 'line', x1: 60, y1: 100, x2: 80, y2: 100 },
      { type: 'line', x1: 60, y1: 140, x2: 80, y2: 140 },
      { type: 'line', x1: 130, y1: 60, x2: 150, y2: 60 },
      { type: 'line', x1: 130, y1: 100, x2: 150, y2: 100 },
      { type: 'line', x1: 130, y1: 140, x2: 150, y2: 140 },
      { type: 'line', x1: 150, y1: 60, x2: 150, y2: 140 },
      { type: 'line', x1: 150, y1: 100, x2: 170, y2: 100, color: '#e74c3c' },
      { type: 'text', x: 150, y: 50, text: 'A1', fontSize: 7 },
      { type: 'text', x: 10, y: 200, text: 'Neutre', fontSize: 8, color: '#3498db' },
      { type: 'line', x1: 40, y1: 200, x2: 280, y2: 200, color: '#3498db' },
      { type: 'line', x1: 220, y1: 200, x2: 220, y2: 160, color: '#3498db' },
      { type: 'line', x1: 220, y1: 100, x2: 250, y2: 100 },
      { type: 'line', x1: 290, y1: 100, x2: 310, y2: 100, color: '#f97316' },
      { type: 'text', x: 310, y: 90, text: 'Lampes', fontSize: 7 },
    ],
    zonesVides: [
      { id: 'z1', x: 80, y: 45, width: 50, height: 30, attendu: 'bouton-poussoir', hint: 'Bouton poussoir entrée' },
      { id: 'z2', x: 80, y: 85, width: 50, height: 30, attendu: 'bouton-poussoir', hint: 'Bouton poussoir couloir' },
      { id: 'z3', x: 80, y: 125, width: 50, height: 30, attendu: 'bouton-poussoir', hint: 'Bouton poussoir chambre' },
      { id: 'z4', x: 170, y: 85, width: 50, height: 30, attendu: 'telerupteur', hint: 'Télérupteur' },
      { id: 'z5', x: 250, y: 80, width: 40, height: 40, attendu: 'lampe', hint: 'Point lumineux' },
    ],
    palette: ['bouton-poussoir', 'telerupteur', 'lampe', 'interrupteur', 'minuterie'],
    explication: 'Le télérupteur permet de commander un éclairage depuis plusieurs points avec des boutons poussoirs. La phase arrive sur tous les BP en parallèle. Chaque impulsion sur un BP change l\'état du télérupteur (allumé/éteint). Le neutre est connecté à la bobine (A2) et à la lampe.'
  },
  {
    id: 'minuterie-cage-escalier',
    titre: 'Minuterie cage d\'escalier',
    description: 'Installez une minuterie pour l\'éclairage d\'une cage d\'escalier.',
    difficulte: 2,
    dureeEstimee: '4 min',
    icon: '⏱️',
    categorie: 'montages',
    elementsAffiches: [
      { type: 'text', x: 10, y: 20, text: 'Phase', fontSize: 8, color: '#e74c3c' },
      { type: 'line', x1: 40, y1: 20, x2: 60, y2: 20, color: '#e74c3c' },
      { type: 'line', x1: 60, y1: 20, x2: 60, y2: 140, color: '#e74c3c' },
      { type: 'line', x1: 60, y1: 50, x2: 80, y2: 50 },
      { type: 'line', x1: 60, y1: 95, x2: 80, y2: 95 },
      { type: 'line', x1: 60, y1: 140, x2: 80, y2: 140 },
      { type: 'line', x1: 130, y1: 50, x2: 160, y2: 50 },
      { type: 'line', x1: 130, y1: 95, x2: 160, y2: 95 },
      { type: 'line', x1: 130, y1: 140, x2: 160, y2: 140 },
      { type: 'line', x1: 160, y1: 50, x2: 160, y2: 140 },
      { type: 'line', x1: 160, y1: 95, x2: 180, y2: 95, color: '#e74c3c' },
      { type: 'text', x: 240, y: 80, text: 'Lampes', fontSize: 7 },
      { type: 'line', x1: 230, y1: 95, x2: 260, y2: 95 },
      { type: 'line', x1: 260, y1: 95, x2: 260, y2: 160 },
      { type: 'text', x: 10, y: 200, text: 'Neutre', fontSize: 8, color: '#3498db' },
      { type: 'line', x1: 40, y1: 200, x2: 280, y2: 200, color: '#3498db' },
      { type: 'line', x1: 260, y1: 200, x2: 260, y2: 175, color: '#3498db' },
    ],
    zonesVides: [
      { id: 'z1', x: 80, y: 35, width: 50, height: 30, attendu: 'bouton-poussoir', hint: 'BP RDC' },
      { id: 'z2', x: 80, y: 80, width: 50, height: 30, attendu: 'bouton-poussoir', hint: 'BP 1er étage' },
      { id: 'z3', x: 80, y: 125, width: 50, height: 30, attendu: 'bouton-poussoir', hint: 'BP 2ème étage' },
      { id: 'z4', x: 180, y: 80, width: 50, height: 30, attendu: 'minuterie', hint: 'Minuterie temporisée' },
      { id: 'z5', x: 240, y: 140, width: 40, height: 40, attendu: 'lampe', hint: 'Éclairage escalier' },
    ],
    palette: ['bouton-poussoir', 'minuterie', 'telerupteur', 'lampe', 'interrupteur'],
    explication: 'La minuterie fonctionne comme un télérupteur mais avec une temporisation. Après appui sur un BP, la lumière s\'allume pendant un temps défini (1 à 7 min généralement) puis s\'éteint automatiquement. Parfait pour les parties communes.'
  },
  {
    id: 'vmc-2-vitesses',
    titre: 'VMC 2 vitesses',
    description: 'Câblez une VMC avec commande 2 vitesses.',
    difficulte: 2,
    dureeEstimee: '3 min',
    icon: '🌀',
    categorie: 'circuits',
    elementsAffiches: [
      { type: 'text', x: 10, y: 25, text: 'Tableau', fontSize: 8 },
      { type: 'line', x1: 50, y1: 25, x2: 70, y2: 25 },
      { type: 'line', x1: 120, y1: 25, x2: 150, y2: 25 },
      { type: 'line', x1: 150, y1: 25, x2: 150, y2: 100 },
      { type: 'line', x1: 150, y1: 100, x2: 170, y2: 100 },
      { type: 'line', x1: 220, y1: 85, x2: 250, y2: 85, color: '#f97316' },
      { type: 'line', x1: 220, y1: 115, x2: 250, y2: 115, color: '#8b5cf6' },
      { type: 'text', x: 255, y: 85, text: 'GV', fontSize: 7 },
      { type: 'text', x: 255, y: 115, text: 'PV', fontSize: 7 },
      { type: 'line', x1: 290, y1: 100, x2: 310, y2: 100 },
      { type: 'text', x: 10, y: 150, text: 'Neutre', fontSize: 8, color: '#3498db' },
      { type: 'line', x1: 50, y1: 150, x2: 350, y2: 150, color: '#3498db' },
      { type: 'line', x1: 330, y1: 150, x2: 330, y2: 130, color: '#3498db' },
    ],
    zonesVides: [
      { id: 'z1', x: 70, y: 10, width: 50, height: 30, attendu: 'disj-2a', hint: 'Protection VMC (2A max)' },
      { id: 'z2', x: 170, y: 85, width: 50, height: 30, attendu: 'inter-vmc', hint: 'Interrupteur 2 vitesses' },
      { id: 'z3', x: 310, y: 85, width: 40, height: 40, attendu: 'moteur', hint: 'Moteur VMC' },
    ],
    palette: ['disj-2a', 'disj-10a', 'inter-vmc', 'interrupteur', 'moteur', 'lampe'],
    explication: 'La VMC 2 vitesses est protégée par un disjoncteur 2A maximum. L\'interrupteur permet de choisir entre petite vitesse (PV, silencieuse) et grande vitesse (GV, extraction rapide). Le fil orange/violet va à GV, le marron/violet à PV.'
  },
  {
    id: 'volet-roulant',
    titre: 'Volet roulant électrique',
    description: 'Câblez un volet roulant avec sa commande montée/descente.',
    difficulte: 2,
    dureeEstimee: '3 min',
    icon: '🪟',
    categorie: 'circuits',
    elementsAffiches: [
      { type: 'text', x: 10, y: 25, text: 'Tableau', fontSize: 8 },
      { type: 'line', x1: 50, y1: 25, x2: 70, y2: 25 },
      { type: 'line', x1: 120, y1: 25, x2: 150, y2: 25 },
      { type: 'line', x1: 150, y1: 25, x2: 150, y2: 100 },
      { type: 'line', x1: 150, y1: 100, x2: 170, y2: 100 },
      { type: 'line', x1: 220, y1: 85, x2: 270, y2: 85 },
      { type: 'line', x1: 220, y1: 115, x2: 270, y2: 115 },
      { type: 'text', x: 225, y: 80, text: 'Montée', fontSize: 6, color: '#059669' },
      { type: 'text', x: 225, y: 128, text: 'Descente', fontSize: 6, color: '#dc2626' },
      { type: 'line', x1: 270, y1: 85, x2: 270, y2: 115 },
      { type: 'line', x1: 270, y1: 100, x2: 300, y2: 100 },
      { type: 'text', x: 10, y: 150, text: 'Neutre', fontSize: 8, color: '#3498db' },
      { type: 'line', x1: 50, y1: 150, x2: 340, y2: 150, color: '#3498db' },
      { type: 'line', x1: 320, y1: 150, x2: 320, y2: 130, color: '#3498db' },
    ],
    zonesVides: [
      { id: 'z1', x: 70, y: 10, width: 50, height: 30, attendu: 'disj-10a', hint: 'Protection volet (10A)' },
      { id: 'z2', x: 170, y: 85, width: 50, height: 30, attendu: 'inter-volet', hint: 'Commande montée/descente' },
      { id: 'z3', x: 300, y: 85, width: 40, height: 40, attendu: 'moteur', hint: 'Moteur volet' },
    ],
    palette: ['disj-10a', 'disj-16a', 'inter-volet', 'inter-vmc', 'moteur', 'lampe'],
    explication: 'Le volet roulant est protégé par un disjoncteur 10A dédié. L\'interrupteur à 3 positions (montée/arrêt/descente) envoie la phase sur le fil montée ou descente. Le moteur possède des fins de course intégrés.'
  },
  {
    id: 'delesteur',
    titre: 'Délesteur de puissance',
    description: 'Installez un délesteur pour gérer la puissance disponible.',
    difficulte: 3,
    dureeEstimee: '5 min',
    icon: '⚖️',
    categorie: 'protections',
    elementsAffiches: [
      { type: 'text', x: 10, y: 25, text: 'AGCP', fontSize: 8 },
      { type: 'rect', x: 40, y: 10, width: 35, height: 30, label: 'DB' },
      { type: 'line', x1: 75, y1: 25, x2: 90, y2: 25 },
      { type: 'line', x1: 140, y1: 25, x2: 160, y2: 25 },
      { type: 'line', x1: 160, y1: 25, x2: 160, y2: 150 },
      { type: 'line', x1: 100, y1: 60, x2: 100, y2: 110 },
      { type: 'line', x1: 100, y1: 110, x2: 120, y2: 110 },
      { type: 'text', x: 100, y: 55, text: 'Mesure I', fontSize: 6, color: '#6b7280' },
      { type: 'line', x1: 160, y1: 80, x2: 180, y2: 80 },
      { type: 'line', x1: 160, y1: 120, x2: 180, y2: 120 },
      { type: 'line', x1: 230, y1: 80, x2: 250, y2: 80 },
      { type: 'line', x1: 230, y1: 120, x2: 250, y2: 120 },
      { type: 'text', x: 260, y: 80, text: 'Chauffe-eau (P3)', fontSize: 7 },
      { type: 'text', x: 260, y: 120, text: 'Radiateurs (P2)', fontSize: 7 },
      { type: 'text', x: 260, y: 160, text: 'Circuits prioritaires (P1)', fontSize: 7 },
    ],
    zonesVides: [
      { id: 'z1', x: 90, y: 10, width: 50, height: 30, attendu: 'ddr-30ma', hint: 'DDR principal' },
      { id: 'z2', x: 120, y: 95, width: 50, height: 30, attendu: 'delesteur', hint: 'Module délesteur' },
      { id: 'z3', x: 180, y: 65, width: 50, height: 30, attendu: 'disj-20a', hint: 'Circuit délestable 1' },
      { id: 'z4', x: 180, y: 105, width: 50, height: 30, attendu: 'disj-16a', hint: 'Circuit délestable 2' },
    ],
    palette: ['ddr-30ma', 'ddr-300ma', 'delesteur', 'disj-16a', 'disj-20a', 'disj-32a'],
    explication: 'Le délesteur mesure le courant total et coupe automatiquement les circuits non prioritaires quand la puissance souscrite est dépassée. P1 = priorité haute (jamais coupé), P2 = priorité moyenne, P3 = priorité basse (coupé en premier).'
  },
  {
    id: 'contacteur-hc',
    titre: 'Contacteur heures creuses',
    description: 'Câblez un contacteur jour/nuit pour le chauffe-eau.',
    difficulte: 2,
    dureeEstimee: '4 min',
    icon: '🌙',
    categorie: 'circuits',
    elementsAffiches: [
      { type: 'text', x: 10, y: 25, text: 'Tableau', fontSize: 8 },
      { type: 'line', x1: 50, y1: 25, x2: 70, y2: 25 },
      { type: 'line', x1: 120, y1: 25, x2: 140, y2: 25 },
      { type: 'line', x1: 140, y1: 25, x2: 140, y2: 100 },
      { type: 'line', x1: 140, y1: 100, x2: 160, y2: 100 },
      { type: 'line', x1: 210, y1: 100, x2: 240, y2: 100 },
      { type: 'line', x1: 240, y1: 100, x2: 240, y2: 140 },
      { type: 'line', x1: 240, y1: 140, x2: 260, y2: 140 },
      { type: 'text', x: 10, y: 80, text: 'Signal HC', fontSize: 7, color: '#6b7280' },
      { type: 'line', x1: 55, y1: 80, x2: 75, y2: 80, color: '#9333ea' },
      { type: 'line', x1: 75, y1: 80, x2: 75, y2: 110 },
      { type: 'line', x1: 75, y1: 110, x2: 160, y2: 110, color: '#9333ea' },
      { type: 'text', x: 120, y: 125, text: 'A1', fontSize: 6 },
      { type: 'text', x: 10, y: 180, text: 'Neutre', fontSize: 8, color: '#3498db' },
      { type: 'line', x1: 50, y1: 180, x2: 300, y2: 180, color: '#3498db' },
      { type: 'line', x1: 180, y1: 180, x2: 180, y2: 120, color: '#3498db' },
      { type: 'text', x: 185, y: 125, text: 'A2', fontSize: 6 },
      { type: 'line', x1: 280, y1: 180, x2: 280, y2: 160, color: '#3498db' },
    ],
    zonesVides: [
      { id: 'z1', x: 70, y: 10, width: 50, height: 30, attendu: 'disj-20a', hint: 'Protection chauffe-eau 20A' },
      { id: 'z2', x: 160, y: 85, width: 50, height: 30, attendu: 'contacteur-jn', hint: 'Contacteur heures creuses' },
      { id: 'z3', x: 260, y: 120, width: 40, height: 40, attendu: 'chauffe-eau', hint: 'Ballon eau chaude' },
    ],
    palette: ['disj-16a', 'disj-20a', 'contacteur-jn', 'telerupteur', 'chauffe-eau', 'moteur'],
    explication: 'Le contacteur jour/nuit permet au chauffe-eau de fonctionner uniquement pendant les heures creuses. Le signal HC du compteur (via le fil pilote) active la bobine A1-A2 du contacteur, qui ferme le circuit de puissance. Économie d\'environ 40% sur la facture d\'eau chaude.'
  },
  // COURANTS FAIBLES
  {
    id: 'interphone-simple',
    titre: 'Interphone simple',
    description: 'Câblez un interphone avec platine de rue, combiné et gâche électrique.',
    difficulte: 2,
    dureeEstimee: '4 min',
    icon: '🚪',
    categorie: 'courants-faibles',
    elementsAffiches: [
      { type: 'text', x: 10, y: 20, text: '230V AC', fontSize: 8 },
      { type: 'line', x1: 50, y1: 20, x2: 70, y2: 20 },
      { type: 'line', x1: 120, y1: 15, x2: 140, y2: 15, color: '#dc2626' },
      { type: 'line', x1: 120, y1: 25, x2: 140, y2: 25, color: '#1e40af' },
      { type: 'text', x: 145, y: 15, text: '+12V', fontSize: 6, color: '#dc2626' },
      { type: 'text', x: 145, y: 28, text: '0V', fontSize: 6, color: '#1e40af' },
      { type: 'line', x1: 140, y1: 15, x2: 140, y2: 80 },
      { type: 'line', x1: 140, y1: 25, x2: 140, y2: 200 },
      { type: 'line', x1: 140, y1: 80, x2: 160, y2: 80, color: '#dc2626' },
      { type: 'line', x1: 140, y1: 200, x2: 160, y2: 200, color: '#1e40af' },
      { type: 'line', x1: 210, y1: 80, x2: 240, y2: 80 },
      { type: 'line', x1: 240, y1: 80, x2: 240, y2: 140 },
      { type: 'line', x1: 240, y1: 140, x2: 260, y2: 140 },
      { type: 'text', x: 305, y: 140, text: 'Gâche', fontSize: 7 },
      { type: 'line', x1: 210, y1: 200, x2: 280, y2: 200, color: '#1e40af' },
      { type: 'line', x1: 280, y1: 200, x2: 280, y2: 160, color: '#1e40af' },
      { type: 'text', x: 10, y: 140, text: 'Exterieur', fontSize: 7, color: '#6b7280' },
      { type: 'line', x1: 5, y1: 145, x2: 130, y2: 145, color: '#9ca3af', strokeDasharray: '4' },
      { type: 'text', x: 10, y: 160, text: 'Interieur', fontSize: 7, color: '#6b7280' },
    ],
    zonesVides: [
      { id: 'z1', x: 70, y: 5, width: 50, height: 30, attendu: 'alimentation-12v', hint: 'Alimentation 12V DC' },
      { id: 'z2', x: 160, y: 65, width: 50, height: 30, attendu: 'platine-rue', hint: 'Platine de rue extérieure' },
      { id: 'z3', x: 160, y: 180, width: 50, height: 35, attendu: 'combine-interieur', hint: 'Combiné intérieur' },
      { id: 'z4', x: 260, y: 120, width: 40, height: 40, attendu: 'gache-electrique', hint: 'Gâche électrique porte' },
    ],
    palette: ['alimentation-12v', 'platine-rue', 'combine-interieur', 'gache-electrique', 'detecteur-mouvement'],
    explication: 'L\'interphone simple fonctionne en 12V DC fourni par une alimentation. La platine de rue contient le micro, le haut-parleur et le bouton d\'appel. Le combiné intérieur permet de répondre et d\'actionner la gâche électrique pour ouvrir la porte.'
  },
  {
    id: 'digicode-gache',
    titre: 'Digicode + gâche',
    description: 'Installez un digicode pour commander l\'ouverture d\'une porte.',
    difficulte: 2,
    dureeEstimee: '3 min',
    icon: '🔢',
    categorie: 'courants-faibles',
    elementsAffiches: [
      { type: 'text', x: 10, y: 20, text: '230V AC', fontSize: 8 },
      { type: 'line', x1: 50, y1: 20, x2: 70, y2: 20 },
      { type: 'line', x1: 120, y1: 15, x2: 140, y2: 15, color: '#dc2626' },
      { type: 'line', x1: 120, y1: 25, x2: 140, y2: 25, color: '#1e40af' },
      { type: 'line', x1: 140, y1: 15, x2: 140, y2: 100 },
      { type: 'line', x1: 140, y1: 25, x2: 140, y2: 180 },
      { type: 'line', x1: 140, y1: 100, x2: 160, y2: 100, color: '#dc2626' },
      { type: 'line', x1: 140, y1: 180, x2: 160, y2: 180, color: '#1e40af' },
      { type: 'text', x: 145, y: 90, text: '+12V', fontSize: 6, color: '#dc2626' },
      { type: 'text', x: 145, y: 193, text: '0V', fontSize: 6, color: '#1e40af' },
      { type: 'line', x1: 210, y1: 110, x2: 250, y2: 110 },
      { type: 'line', x1: 250, y1: 110, x2: 250, y2: 150 },
      { type: 'line', x1: 250, y1: 150, x2: 270, y2: 150 },
      { type: 'line', x1: 210, y1: 180, x2: 290, y2: 180, color: '#1e40af' },
      { type: 'line', x1: 290, y1: 180, x2: 290, y2: 170, color: '#1e40af' },
      { type: 'text', x: 255, y: 200, text: 'Porte', fontSize: 8 },
    ],
    zonesVides: [
      { id: 'z1', x: 70, y: 5, width: 50, height: 30, attendu: 'alimentation-12v', hint: 'Alimentation 12V' },
      { id: 'z2', x: 160, y: 90, width: 50, height: 35, attendu: 'clavier-alarme', hint: 'Digicode clavier' },
      { id: 'z3', x: 270, y: 130, width: 40, height: 40, attendu: 'gache-electrique', hint: 'Gâche électrique' },
    ],
    palette: ['alimentation-12v', 'clavier-alarme', 'gache-electrique', 'ventouse', 'lecteur-badge'],
    explication: 'Le digicode permet l\'ouverture de porte par code. Alimenté en 12V, il commande la gâche électrique quand le bon code est composé. La gâche se déverrouille pendant quelques secondes pour permettre l\'entrée.'
  },
  {
    id: 'alarme-filaire',
    titre: 'Alarme filaire basique',
    description: 'Câblez une centrale d\'alarme avec ses détecteurs et sa sirène.',
    difficulte: 3,
    dureeEstimee: '5 min',
    icon: '🚨',
    categorie: 'courants-faibles',
    elementsAffiches: [
      { type: 'text', x: 10, y: 20, text: '230V AC', fontSize: 8 },
      { type: 'line', x1: 50, y1: 20, x2: 80, y2: 20 },
      { type: 'line', x1: 130, y1: 15, x2: 150, y2: 15, color: '#dc2626' },
      { type: 'line', x1: 130, y1: 25, x2: 150, y2: 25, color: '#1e40af' },
      { type: 'line', x1: 150, y1: 15, x2: 150, y2: 60 },
      { type: 'line', x1: 150, y1: 60, x2: 170, y2: 60, color: '#dc2626' },
      { type: 'line', x1: 150, y1: 25, x2: 150, y2: 270 },
      { type: 'line', x1: 150, y1: 270, x2: 170, y2: 270, color: '#1e40af' },
      { type: 'text', x: 235, y: 50, text: 'Zone 1', fontSize: 6 },
      { type: 'line', x1: 220, y1: 60, x2: 250, y2: 60 },
      { type: 'line', x1: 250, y1: 60, x2: 250, y2: 100 },
      { type: 'line', x1: 250, y1: 100, x2: 280, y2: 100 },
      { type: 'text', x: 235, y: 130, text: 'Zone 2', fontSize: 6 },
      { type: 'line', x1: 220, y1: 140, x2: 250, y2: 140 },
      { type: 'line', x1: 250, y1: 140, x2: 250, y2: 180 },
      { type: 'line', x1: 250, y1: 180, x2: 280, y2: 180 },
      { type: 'text', x: 235, y: 210, text: 'Sirène', fontSize: 6 },
      { type: 'line', x1: 220, y1: 220, x2: 280, y2: 220 },
      { type: 'line', x1: 250, y1: 270, x2: 320, y2: 270, color: '#1e40af' },
      { type: 'line', x1: 300, y1: 100, x2: 300, y2: 270, color: '#1e40af' },
      { type: 'line', x1: 300, y1: 180, x2: 320, y2: 180, color: '#1e40af' },
      { type: 'line', x1: 300, y1: 220, x2: 320, y2: 220, color: '#1e40af' },
    ],
    zonesVides: [
      { id: 'z1', x: 80, y: 5, width: 50, height: 30, attendu: 'alimentation-12v', hint: 'Alimentation centrale' },
      { id: 'z2', x: 170, y: 45, width: 50, height: 35, attendu: 'centrale-alarme', hint: 'Centrale d\'alarme' },
      { id: 'z3', x: 280, y: 80, width: 40, height: 40, attendu: 'detecteur-mouvement', hint: 'Détecteur de mouvement' },
      { id: 'z4', x: 280, y: 160, width: 40, height: 40, attendu: 'detecteur-ouverture', hint: 'Détecteur d\'ouverture' },
      { id: 'z5', x: 280, y: 200, width: 40, height: 40, attendu: 'sirene', hint: 'Sirène intérieure' },
    ],
    palette: ['alimentation-12v', 'centrale-alarme', 'detecteur-mouvement', 'detecteur-ouverture', 'sirene', 'clavier-alarme'],
    explication: 'L\'alarme filaire comprend une centrale alimentée en 230V avec transfo intégré. Les détecteurs (mouvement IR, ouverture magnétique) sont câblés en zones. La sirène est déclenchée par la centrale en cas d\'intrusion. Un clavier permet l\'armement/désarmement.'
  },
  {
    id: 'controle-acces',
    titre: 'Contrôle d\'accès badge',
    description: 'Installez un contrôle d\'accès par badge avec ventouse électromagnétique.',
    difficulte: 3,
    dureeEstimee: '4 min',
    icon: '🪪',
    categorie: 'courants-faibles',
    elementsAffiches: [
      { type: 'text', x: 10, y: 20, text: '230V AC', fontSize: 8 },
      { type: 'line', x1: 50, y1: 20, x2: 70, y2: 20 },
      { type: 'line', x1: 120, y1: 15, x2: 140, y2: 15, color: '#dc2626' },
      { type: 'line', x1: 120, y1: 25, x2: 140, y2: 25, color: '#1e40af' },
      { type: 'line', x1: 140, y1: 15, x2: 140, y2: 100 },
      { type: 'line', x1: 140, y1: 25, x2: 140, y2: 220 },
      { type: 'line', x1: 140, y1: 100, x2: 160, y2: 100, color: '#dc2626' },
      { type: 'line', x1: 140, y1: 220, x2: 160, y2: 220, color: '#1e40af' },
      { type: 'text', x: 145, y: 90, text: '+12V', fontSize: 6, color: '#dc2626' },
      { type: 'text', x: 145, y: 235, text: '0V', fontSize: 6, color: '#1e40af' },
      { type: 'line', x1: 210, y1: 100, x2: 250, y2: 100, color: '#dc2626' },
      { type: 'line', x1: 250, y1: 100, x2: 250, y2: 160 },
      { type: 'line', x1: 250, y1: 160, x2: 270, y2: 160 },
      { type: 'line', x1: 210, y1: 220, x2: 290, y2: 220, color: '#1e40af' },
      { type: 'line', x1: 290, y1: 220, x2: 290, y2: 180, color: '#1e40af' },
      { type: 'text', x: 255, y: 250, text: 'Porte securisee', fontSize: 7 },
      { type: 'text', x: 10, y: 140, text: 'Exterieur', fontSize: 7, color: '#6b7280' },
      { type: 'line', x1: 5, y1: 145, x2: 130, y2: 145, color: '#9ca3af', strokeDasharray: '4' },
    ],
    zonesVides: [
      { id: 'z1', x: 70, y: 5, width: 50, height: 30, attendu: 'alimentation-12v', hint: 'Alimentation 12V secourue' },
      { id: 'z2', x: 160, y: 85, width: 50, height: 35, attendu: 'lecteur-badge', hint: 'Lecteur de badges RFID' },
      { id: 'z3', x: 270, y: 140, width: 40, height: 40, attendu: 'ventouse', hint: 'Ventouse électromagnétique' },
    ],
    palette: ['alimentation-12v', 'lecteur-badge', 'ventouse', 'gache-electrique', 'clavier-alarme'],
    explication: 'Le contrôle d\'accès par badge utilise un lecteur RFID connecté à une centrale. La ventouse électromagnétique maintient la porte fermée (sécurité positive : porte déverrouillée en cas de coupure courant). L\'alimentation doit être secourue par batterie.'
  },
  {
    id: 'portail-motorise',
    titre: 'Portail motorisé',
    description: 'Câblez une motorisation de portail avec ses accessoires de sécurité.',
    difficulte: 3,
    dureeEstimee: '5 min',
    icon: '🚗',
    categorie: 'courants-faibles',
    elementsAffiches: [
      { type: 'text', x: 10, y: 25, text: '230V AC', fontSize: 8 },
      { type: 'line', x1: 50, y1: 25, x2: 70, y2: 25 },
      { type: 'line', x1: 120, y1: 25, x2: 150, y2: 25 },
      { type: 'line', x1: 150, y1: 25, x2: 150, y2: 200 },
      { type: 'line', x1: 150, y1: 80, x2: 170, y2: 80 },
      { type: 'line', x1: 150, y1: 140, x2: 170, y2: 140 },
      { type: 'line', x1: 150, y1: 200, x2: 170, y2: 200 },
      { type: 'line', x1: 220, y1: 80, x2: 250, y2: 80 },
      { type: 'line', x1: 220, y1: 140, x2: 250, y2: 140 },
      { type: 'line', x1: 220, y1: 200, x2: 250, y2: 200 },
      { type: 'text', x: 260, y: 80, text: 'Clignotant', fontSize: 7 },
      { type: 'text', x: 260, y: 140, text: 'Cellules TX', fontSize: 7 },
      { type: 'text', x: 260, y: 165, text: 'Cellules RX', fontSize: 7 },
      { type: 'text', x: 260, y: 200, text: 'Moteur', fontSize: 7 },
      { type: 'text', x: 10, y: 240, text: 'Photocellules: Arret si obstacle', fontSize: 7, color: '#6b7280' },
    ],
    zonesVides: [
      { id: 'z1', x: 70, y: 10, width: 50, height: 30, attendu: 'disj-10a', hint: 'Protection motorisation' },
      { id: 'z2', x: 170, y: 60, width: 50, height: 35, attendu: 'clignotant', hint: 'Gyrophare de signalisation' },
      { id: 'z3', x: 170, y: 125, width: 50, height: 35, attendu: 'cellule-photo', hint: 'Cellules photoélectriques' },
      { id: 'z4', x: 170, y: 180, width: 50, height: 40, attendu: 'moteur-portail', hint: 'Moteur de portail' },
    ],
    palette: ['disj-10a', 'disj-16a', 'clignotant', 'cellule-photo', 'moteur-portail', 'detecteur-mouvement'],
    explication: 'La motorisation de portail comprend le moteur avec sa carte électronique, un clignotant de signalisation obligatoire, et des cellules photoélectriques pour détecter les obstacles. Les cellules arrêtent le mouvement si quelqu\'un passe dans le faisceau.'
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
      'protections': 'Protections',
      'courants-faibles': 'Courants faibles'
    }[cat] || cat
  }))
}
