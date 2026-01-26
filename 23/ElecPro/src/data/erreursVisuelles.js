// Exercices "Repérer les erreurs" - Schémas SVG interactifs
// L'utilisateur doit identifier les zones incorrectes en les touchant

export const erreursVisuelles = [
  {
    id: 'tableau-mal-cable',
    titre: 'Tableau mal câblé',
    description: 'Ce tableau électrique contient plusieurs erreurs de câblage. Trouvez-les !',
    difficulte: 2,
    dureeEstimee: '3 min',
    icon: '🔲',
    nbErreurs: 4,
    viewBox: '0 0 400 350',
    // Éléments du schéma SVG
    elements: [
      // Fond du tableau
      { type: 'rect', x: 50, y: 20, width: 300, height: 310, fill: '#f3f4f6', stroke: '#9ca3af', strokeWidth: 2 },
      // Titre
      { type: 'text', x: 200, y: 15, text: 'TABLEAU ÉLECTRIQUE', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle' },

      // Rail DIN 1
      { type: 'rect', x: 60, y: 50, width: 280, height: 8, fill: '#d1d5db', stroke: '#9ca3af' },
      // Rail DIN 2
      { type: 'rect', x: 60, y: 130, width: 280, height: 8, fill: '#d1d5db', stroke: '#9ca3af' },
      // Rail DIN 3
      { type: 'rect', x: 60, y: 210, width: 280, height: 8, fill: '#d1d5db', stroke: '#9ca3af' },

      // === Rangée 1 : DDR + Disjoncteurs ===
      // DDR 30mA (correct)
      { type: 'rect', x: 70, y: 60, width: 36, height: 50, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 2 },
      { type: 'text', x: 88, y: 78, text: 'DDR', fontSize: 8, textAnchor: 'middle' },
      { type: 'text', x: 88, y: 90, text: '30mA', fontSize: 7, textAnchor: 'middle', fill: '#059669' },
      { type: 'text', x: 88, y: 102, text: '40A', fontSize: 7, textAnchor: 'middle' },

      // Disjoncteur 10A (correct - éclairage)
      { type: 'rect', x: 116, y: 60, width: 18, height: 50, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2 },
      { type: 'text', x: 125, y: 85, text: '10A', fontSize: 7, textAnchor: 'middle' },
      { type: 'circle', cx: 125, cy: 97, r: 5, fill: '#22c55e' },

      // Disjoncteur 10A (correct - éclairage)
      { type: 'rect', x: 140, y: 60, width: 18, height: 50, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2 },
      { type: 'text', x: 149, y: 85, text: '10A', fontSize: 7, textAnchor: 'middle' },
      { type: 'circle', cx: 149, cy: 97, r: 5, fill: '#22c55e' },

      // === Rangée 2 : DDR + Prises ===
      // DDR 300mA (ERREUR - devrait être 30mA pour les prises)
      { type: 'rect', x: 70, y: 140, width: 36, height: 50, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 2, id: 'erreur1' },
      { type: 'text', x: 88, y: 158, text: 'DDR', fontSize: 8, textAnchor: 'middle' },
      { type: 'text', x: 88, y: 170, text: '300mA', fontSize: 7, textAnchor: 'middle', fill: '#dc2626' },
      { type: 'text', x: 88, y: 182, text: '40A', fontSize: 7, textAnchor: 'middle' },

      // Disjoncteur 16A (correct)
      { type: 'rect', x: 116, y: 140, width: 18, height: 50, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2 },
      { type: 'text', x: 125, y: 165, text: '16A', fontSize: 7, textAnchor: 'middle' },
      { type: 'circle', cx: 125, cy: 177, r: 5, fill: '#22c55e' },

      // Disjoncteur 32A sur prises (ERREUR - trop fort pour des prises standard)
      { type: 'rect', x: 140, y: 140, width: 18, height: 50, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2, id: 'erreur2' },
      { type: 'text', x: 149, y: 165, text: '32A', fontSize: 7, textAnchor: 'middle', fill: '#dc2626' },
      { type: 'circle', cx: 149, cy: 177, r: 5, fill: '#22c55e' },

      // === Rangée 3 : Circuits spécialisés ===
      // DDR 30mA
      { type: 'rect', x: 70, y: 220, width: 36, height: 50, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 2 },
      { type: 'text', x: 88, y: 238, text: 'DDR', fontSize: 8, textAnchor: 'middle' },
      { type: 'text', x: 88, y: 250, text: '30mA', fontSize: 7, textAnchor: 'middle', fill: '#059669' },
      { type: 'text', x: 88, y: 262, text: '40A', fontSize: 7, textAnchor: 'middle' },

      // Disjoncteur 10A pour plaque cuisson (ERREUR - doit être 32A)
      { type: 'rect', x: 116, y: 220, width: 18, height: 50, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2, id: 'erreur3' },
      { type: 'text', x: 125, y: 238, text: '10A', fontSize: 7, textAnchor: 'middle', fill: '#dc2626' },
      { type: 'text', x: 125, y: 250, text: 'Plaque', fontSize: 5, textAnchor: 'middle' },
      { type: 'circle', cx: 125, cy: 260, r: 5, fill: '#22c55e' },

      // Disjoncteur 20A lave-linge (correct)
      { type: 'rect', x: 140, y: 220, width: 18, height: 50, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2 },
      { type: 'text', x: 149, y: 238, text: '20A', fontSize: 7, textAnchor: 'middle' },
      { type: 'text', x: 149, y: 250, text: 'L-L', fontSize: 5, textAnchor: 'middle' },
      { type: 'circle', cx: 149, cy: 260, r: 5, fill: '#22c55e' },

      // === Câblage visible ===
      // Fil phase rouge correct
      { type: 'line', x1: 170, y1: 75, x2: 200, y2: 75, stroke: '#ef4444', strokeWidth: 2 },
      // Fil neutre bleu correct
      { type: 'line', x1: 170, y1: 85, x2: 200, y2: 85, stroke: '#3b82f6', strokeWidth: 2 },

      // Fil bleu utilisé comme phase (ERREUR)
      { type: 'line', x1: 170, y1: 155, x2: 220, y2: 155, stroke: '#3b82f6', strokeWidth: 2, id: 'erreur4' },
      { type: 'text', x: 225, y: 158, text: 'vers prise', fontSize: 6, fill: '#6b7280' },

      // Fil vert-jaune terre
      { type: 'line', x1: 170, y1: 165, x2: 200, y2: 165, stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '4 2' },

      // Légende
      { type: 'rect', x: 230, y: 60, width: 110, height: 80, fill: '#fef3c7', stroke: '#f59e0b', rx: 4 },
      { type: 'text', x: 285, y: 75, text: 'LÉGENDE', fontSize: 8, fontWeight: 'bold', textAnchor: 'middle' },
      { type: 'line', x1: 240, y1: 90, x2: 260, y2: 90, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'text', x: 265, y: 93, text: 'Phase', fontSize: 7 },
      { type: 'line', x1: 240, y1: 105, x2: 260, y2: 105, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'text', x: 265, y: 108, text: 'Neutre', fontSize: 7 },
      { type: 'line', x1: 240, y1: 120, x2: 260, y2: 120, stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '4 2' },
      { type: 'text', x: 265, y: 123, text: 'Terre', fontSize: 7 },
    ],
    erreurs: [
      {
        id: 'erreur1',
        zone: { x: 70, y: 140, width: 36, height: 50 },
        titre: 'DDR 300mA inadapté',
        explication: 'Les prises de courant nécessitent un DDR 30mA haute sensibilité pour la protection des personnes, pas un 300mA.',
        correction: 'Remplacer par un DDR 30mA Type AC ou Type A'
      },
      {
        id: 'erreur2',
        zone: { x: 140, y: 140, width: 18, height: 50 },
        titre: 'Calibre 32A sur prises standard',
        explication: 'Un disjoncteur 32A est trop puissant pour des prises standard (2.5mm²). Le câble risque de surchauffer avant déclenchement.',
        correction: 'Utiliser un disjoncteur 16A pour les prises en 2.5mm²'
      },
      {
        id: 'erreur3',
        zone: { x: 116, y: 220, width: 18, height: 50 },
        titre: 'Calibre 10A pour plaque cuisson',
        explication: 'Une plaque de cuisson nécessite un disjoncteur 32A minimum (circuit spécialisé en 6mm²).',
        correction: 'Installer un disjoncteur 32A et vérifier la section du câble (6mm²)'
      },
      {
        id: 'erreur4',
        zone: { x: 170, y: 150, width: 50, height: 20 },
        titre: 'Fil bleu utilisé comme phase',
        explication: 'Le fil bleu est EXCLUSIVEMENT réservé au neutre (NF C 15-100). Utiliser un bleu comme phase est dangereux et interdit.',
        correction: 'Utiliser un fil rouge, marron ou noir pour la phase'
      }
    ]
  },
  {
    id: 'salle-de-bain',
    titre: 'Installation salle de bain',
    description: 'Cette salle de bain présente des anomalies vis-à-vis des volumes de sécurité.',
    difficulte: 3,
    dureeEstimee: '4 min',
    icon: '🚿',
    nbErreurs: 4,
    viewBox: '0 0 400 320',
    elements: [
      // Sol
      { type: 'rect', x: 0, y: 280, width: 400, height: 40, fill: '#d1d5db' },
      { type: 'text', x: 200, y: 310, text: 'SOL', fontSize: 10, textAnchor: 'middle', fill: '#6b7280' },

      // Murs
      { type: 'rect', x: 10, y: 30, width: 380, height: 250, fill: '#e0f2fe', stroke: '#0ea5e9', strokeWidth: 2 },

      // Titre
      { type: 'text', x: 200, y: 20, text: 'SALLE DE BAIN - Volumes de sécurité', fontSize: 11, fontWeight: 'bold', textAnchor: 'middle' },

      // Baignoire
      { type: 'rect', x: 30, y: 180, width: 120, height: 80, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 10 },
      { type: 'text', x: 90, y: 225, text: 'BAIGNOIRE', fontSize: 9, textAnchor: 'middle', fill: '#374151' },
      { type: 'ellipse', cx: 60, cy: 200, rx: 8, ry: 4, fill: '#9ca3af' },

      // Indication volumes
      { type: 'line', x1: 150, y1: 180, x2: 150, y2: 100, stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '3 2' },
      { type: 'text', x: 145, y: 95, text: 'Vol.1', fontSize: 8, fill: '#f59e0b' },
      { type: 'line', x1: 210, y1: 180, x2: 210, y2: 100, stroke: '#22c55e', strokeWidth: 1, strokeDasharray: '3 2' },
      { type: 'text', x: 205, y: 95, text: 'Vol.2', fontSize: 8, fill: '#22c55e' },
      { type: 'text', x: 180, y: 275, text: '← 60cm →', fontSize: 7, textAnchor: 'middle', fill: '#6b7280' },

      // Prise dans volume 1 (ERREUR)
      { type: 'rect', x: 160, y: 145, width: 30, height: 20, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 3, id: 'erreur1' },
      { type: 'circle', cx: 170, cy: 155, r: 3, fill: '#374151' },
      { type: 'circle', cx: 180, cy: 155, r: 3, fill: '#374151' },
      { type: 'line', x1: 175, y1: 148, x2: 175, y2: 145, stroke: '#22c55e', strokeWidth: 2 },

      // Interrupteur classique (pas IP44) dans volume 2 (ERREUR)
      { type: 'rect', x: 220, y: 145, width: 25, height: 35, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 3, id: 'erreur2' },
      { type: 'circle', cx: 232, cy: 165, r: 8, fill: '#f3f4f6', stroke: '#374151' },
      { type: 'text', x: 232, y: 185, text: 'Inter', fontSize: 6, textAnchor: 'middle', fill: '#6b7280' },

      // Luminaire correct (IPx4 volume 2)
      { type: 'circle', cx: 280, cy: 80, r: 20, fill: '#fef9c3', stroke: '#eab308', strokeWidth: 2 },
      { type: 'text', x: 280, y: 85, text: 'IPx4', fontSize: 7, textAnchor: 'middle' },

      // Radiateur électrique dans volume 2 (ERREUR - pas de chauffage classe I dans vol 2)
      { type: 'rect', x: 250, y: 200, width: 60, height: 60, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 4, id: 'erreur3' },
      { type: 'line', x1: 260, y1: 215, x2: 300, y2: 215, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 260, y1: 225, x2: 300, y2: 225, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 260, y1: 235, x2: 300, y2: 235, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 260, y1: 245, x2: 300, y2: 245, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'text', x: 280, y: 268, text: 'Radiateur', fontSize: 6, textAnchor: 'middle', fill: '#6b7280' },

      // Chauffe-eau sans DDR 30mA indiqué (ERREUR)
      { type: 'rect', x: 330, y: 50, width: 50, height: 80, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 4, id: 'erreur4' },
      { type: 'ellipse', cx: 355, cy: 100, rx: 15, ry: 8, fill: '#e5e7eb' },
      { type: 'text', x: 355, y: 75, text: 'Ballon', fontSize: 7, textAnchor: 'middle' },
      { type: 'text', x: 355, y: 85, text: 'ECS', fontSize: 7, textAnchor: 'middle' },
      { type: 'text', x: 355, y: 140, text: 'DDR ?', fontSize: 7, textAnchor: 'middle', fill: '#dc2626' },

      // Lavabo hors volume (correct)
      { type: 'ellipse', cx: 355, cy: 220, rx: 25, ry: 15, fill: '#fff', stroke: '#374151', strokeWidth: 2 },
      { type: 'circle', cx: 355, cy: 220, r: 4, fill: '#9ca3af' },
      { type: 'text', x: 355, y: 245, text: 'Lavabo', fontSize: 7, textAnchor: 'middle', fill: '#6b7280' },

      // Légende volumes
      { type: 'rect', x: 20, y: 45, width: 100, height: 65, fill: '#fff', stroke: '#9ca3af', rx: 4 },
      { type: 'text', x: 70, y: 58, text: 'Volumes', fontSize: 8, fontWeight: 'bold', textAnchor: 'middle' },
      { type: 'rect', x: 25, y: 65, width: 15, height: 10, fill: '#fecaca' },
      { type: 'text', x: 45, y: 73, text: 'Vol.0 interdit', fontSize: 6 },
      { type: 'rect', x: 25, y: 78, width: 15, height: 10, fill: '#fef08a' },
      { type: 'text', x: 45, y: 86, text: 'Vol.1 IPx5', fontSize: 6 },
      { type: 'rect', x: 25, y: 91, width: 15, height: 10, fill: '#bbf7d0' },
      { type: 'text', x: 45, y: 99, text: 'Vol.2 IPx4', fontSize: 6 },
    ],
    erreurs: [
      {
        id: 'erreur1',
        zone: { x: 160, y: 145, width: 30, height: 20 },
        titre: 'Prise interdite en Volume 1',
        explication: 'Les prises de courant sont INTERDITES dans les volumes 0, 1 et 2 de la salle de bain (sauf prise rasoir avec transfo de séparation dans vol.2).',
        correction: 'Supprimer la prise ou la déplacer hors volume (à plus de 60cm de la baignoire)'
      },
      {
        id: 'erreur2',
        zone: { x: 220, y: 145, width: 25, height: 35 },
        titre: 'Interrupteur non protégé en Volume 2',
        explication: 'En volume 2, l\'appareillage doit être IP x4 minimum. Un interrupteur classique n\'est pas adapté.',
        correction: 'Utiliser un appareillage IP44 ou déplacer hors volume'
      },
      {
        id: 'erreur3',
        zone: { x: 250, y: 200, width: 60, height: 60 },
        titre: 'Radiateur classe I en Volume 2',
        explication: 'Les appareils de chauffage de classe I (avec terre) sont interdits en volume 2. Seul le classe II IPx4 est autorisé.',
        correction: 'Utiliser un radiateur classe II IPx4 ou le déplacer hors volume'
      },
      {
        id: 'erreur4',
        zone: { x: 330, y: 50, width: 50, height: 80 },
        titre: 'Chauffe-eau sans DDR 30mA',
        explication: 'Le ballon d\'eau chaude dans une salle de bain DOIT être protégé par un DDR 30mA (NF C 15-100).',
        correction: 'Vérifier la présence d\'un DDR 30mA sur le circuit du chauffe-eau'
      }
    ]
  },
  {
    id: 'prises-defectueuses',
    titre: 'Prises mal installées',
    description: 'Ces prises de courant présentent des défauts d\'installation. Identifiez-les !',
    difficulte: 1,
    dureeEstimee: '2 min',
    icon: '🔌',
    nbErreurs: 4,
    viewBox: '0 0 400 280',
    elements: [
      // Titre
      { type: 'text', x: 200, y: 20, text: 'INSTALLATION DE PRISES', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle' },

      // Mur
      { type: 'rect', x: 10, y: 40, width: 380, height: 220, fill: '#fef3c7', stroke: '#d97706', strokeWidth: 2 },

      // Sol
      { type: 'line', x1: 10, y1: 260, x2: 390, y2: 260, stroke: '#374151', strokeWidth: 3 },
      { type: 'text', x: 30, y: 275, text: 'SOL', fontSize: 9, fill: '#6b7280' },

      // Hauteur standard indicative
      { type: 'line', x1: 25, y1: 230, x2: 25, y2: 260, stroke: '#22c55e', strokeWidth: 1, strokeDasharray: '3 2' },
      { type: 'text', x: 28, y: 245, text: '5cm', fontSize: 7, fill: '#22c55e' },

      // === Prise 1 : Trop près du sol (ERREUR) ===
      { type: 'rect', x: 50, y: 248, width: 40, height: 25, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 4, id: 'erreur1' },
      { type: 'circle', cx: 62, cy: 260, r: 4, fill: '#374151' },
      { type: 'circle', cx: 78, cy: 260, r: 4, fill: '#374151' },
      { type: 'line', x1: 70, y1: 251, x2: 70, y2: 248, stroke: '#22c55e', strokeWidth: 2 },
      { type: 'text', x: 70, y: 242, text: '2cm', fontSize: 7, textAnchor: 'middle', fill: '#dc2626' },

      // === Prise 2 : Correcte à 5cm ===
      { type: 'rect', x: 120, y: 220, width: 40, height: 25, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 4 },
      { type: 'circle', cx: 132, cy: 232, r: 4, fill: '#374151' },
      { type: 'circle', cx: 148, cy: 232, r: 4, fill: '#374151' },
      { type: 'line', x1: 140, y1: 223, x2: 140, y2: 220, stroke: '#22c55e', strokeWidth: 2 },
      { type: 'text', x: 140, y: 250, text: 'OK', fontSize: 8, textAnchor: 'middle', fill: '#22c55e' },

      // === Prise 3 : Sans terre (ERREUR) ===
      { type: 'rect', x: 190, y: 150, width: 40, height: 25, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 4, id: 'erreur2' },
      { type: 'circle', cx: 202, cy: 162, r: 4, fill: '#374151' },
      { type: 'circle', cx: 218, cy: 162, r: 4, fill: '#374151' },
      // Pas de broche de terre !
      { type: 'text', x: 210, y: 145, text: 'Pas de terre !', fontSize: 7, textAnchor: 'middle', fill: '#dc2626' },

      // === Prise 4 : Fils visibles (ERREUR) ===
      { type: 'rect', x: 260, y: 150, width: 40, height: 25, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 4, id: 'erreur3' },
      { type: 'circle', cx: 272, cy: 162, r: 4, fill: '#374151' },
      { type: 'circle', cx: 288, cy: 162, r: 4, fill: '#374151' },
      { type: 'line', x1: 280, y1: 153, x2: 280, y2: 150, stroke: '#22c55e', strokeWidth: 2 },
      // Fils qui dépassent
      { type: 'line', x1: 265, y1: 145, x2: 258, y2: 130, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 280, y1: 145, x2: 280, y2: 125, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'line', x1: 295, y1: 145, x2: 302, y2: 130, stroke: '#22c55e', strokeWidth: 2 },
      { type: 'text', x: 280, y: 120, text: 'Fils nus !', fontSize: 7, textAnchor: 'middle', fill: '#dc2626' },

      // === Prise 5 : Multiprise en cascade (ERREUR) ===
      { type: 'rect', x: 330, y: 180, width: 40, height: 25, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 4, id: 'erreur4' },
      { type: 'circle', cx: 342, cy: 192, r: 4, fill: '#374151' },
      { type: 'circle', cx: 358, cy: 192, r: 4, fill: '#374151' },
      // Multiprise branchée
      { type: 'rect', x: 315, y: 210, width: 70, height: 15, fill: '#f3f4f6', stroke: '#9ca3af', rx: 2 },
      { type: 'line', x1: 350, y1: 205, x2: 350, y2: 210, stroke: '#374151', strokeWidth: 2 },
      // 2ème multiprise
      { type: 'rect', x: 320, y: 230, width: 60, height: 12, fill: '#f3f4f6', stroke: '#9ca3af', rx: 2 },
      { type: 'line', x1: 340, y1: 225, x2: 340, y2: 230, stroke: '#374151', strokeWidth: 2 },
      { type: 'text', x: 350, y: 255, text: 'Cascade !', fontSize: 7, textAnchor: 'middle', fill: '#dc2626' },

      // Légende
      { type: 'rect', x: 250, y: 50, width: 130, height: 55, fill: '#ecfdf5', stroke: '#22c55e', rx: 4 },
      { type: 'text', x: 315, y: 65, text: 'Règles NF C 15-100', fontSize: 8, fontWeight: 'bold', textAnchor: 'middle' },
      { type: 'text', x: 315, y: 78, text: '• Hauteur mini : 5cm', fontSize: 7, textAnchor: 'middle' },
      { type: 'text', x: 315, y: 90, text: '• Terre obligatoire', fontSize: 7, textAnchor: 'middle' },
      { type: 'text', x: 315, y: 102, text: '• Pas de cascade', fontSize: 7, textAnchor: 'middle' },
    ],
    erreurs: [
      {
        id: 'erreur1',
        zone: { x: 50, y: 248, width: 40, height: 25 },
        titre: 'Prise trop près du sol',
        explication: 'La hauteur minimale d\'une prise est de 5cm (axe à 12cm) par rapport au sol fini. Ici elle est à 2cm.',
        correction: 'Rehausser la prise à minimum 5cm du sol'
      },
      {
        id: 'erreur2',
        zone: { x: 190, y: 150, width: 40, height: 25 },
        titre: 'Prise sans broche de terre',
        explication: 'Toutes les prises 2P+T doivent avoir une broche de terre fonctionnelle et raccordée au conducteur de protection.',
        correction: 'Remplacer par une prise avec terre et raccorder le PE'
      },
      {
        id: 'erreur3',
        zone: { x: 258, y: 125, width: 50, height: 55 },
        titre: 'Fils dénudés visibles',
        explication: 'Les conducteurs ne doivent jamais être visibles ou accessibles. Risque d\'électrocution et de court-circuit.',
        correction: 'Repousser les fils dans la boîte, vérifier les connexions'
      },
      {
        id: 'erreur4',
        zone: { x: 315, y: 180, width: 75, height: 75 },
        titre: 'Multiprises en cascade',
        explication: 'Le branchement de multiprises en série (cascade) est interdit. Risque de surcharge et d\'incendie.',
        correction: 'Installer des prises supplémentaires fixes'
      }
    ]
  },
  {
    id: 'cablage-tableau',
    titre: 'Câblage non conforme',
    description: 'Repérez les erreurs de câblage dans ce tableau électrique.',
    difficulte: 2,
    dureeEstimee: '3 min',
    icon: '🔧',
    nbErreurs: 5,
    viewBox: '0 0 400 350',
    elements: [
      // Fond tableau
      { type: 'rect', x: 30, y: 30, width: 340, height: 290, fill: '#f9fafb', stroke: '#374151', strokeWidth: 3 },
      { type: 'text', x: 200, y: 20, text: 'TABLEAU - Erreurs de câblage', fontSize: 11, fontWeight: 'bold', textAnchor: 'middle' },

      // Rail DIN
      { type: 'rect', x: 40, y: 80, width: 320, height: 8, fill: '#9ca3af' },
      { type: 'rect', x: 40, y: 180, width: 320, height: 8, fill: '#9ca3af' },

      // Bornier de terre
      { type: 'rect', x: 40, y: 280, width: 200, height: 20, fill: '#22c55e', stroke: '#15803d', strokeWidth: 2 },
      { type: 'text', x: 140, y: 293, text: 'BORNIER DE TERRE', fontSize: 8, textAnchor: 'middle', fill: '#fff' },

      // === Disjoncteur de branchement ===
      { type: 'rect', x: 50, y: 90, width: 50, height: 70, fill: '#fff', stroke: '#374151', strokeWidth: 2 },
      { type: 'text', x: 75, y: 110, text: 'DB', fontSize: 10, textAnchor: 'middle', fontWeight: 'bold' },
      { type: 'text', x: 75, y: 125, text: '500mA', fontSize: 8, textAnchor: 'middle' },
      { type: 'text', x: 75, y: 150, text: '30/60A', fontSize: 8, textAnchor: 'middle' },

      // === DDR 40A 30mA ===
      { type: 'rect', x: 120, y: 90, width: 40, height: 70, fill: '#fff', stroke: '#374151', strokeWidth: 2 },
      { type: 'text', x: 140, y: 115, text: 'DDR', fontSize: 9, textAnchor: 'middle' },
      { type: 'text', x: 140, y: 130, text: '30mA', fontSize: 7, textAnchor: 'middle' },
      { type: 'text', x: 140, y: 145, text: '40A', fontSize: 8, textAnchor: 'middle' },

      // === Disjoncteurs ===
      { type: 'rect', x: 170, y: 90, width: 20, height: 70, fill: '#fff', stroke: '#374151', strokeWidth: 1.5 },
      { type: 'text', x: 180, y: 130, text: '16A', fontSize: 7, textAnchor: 'middle' },

      { type: 'rect', x: 195, y: 90, width: 20, height: 70, fill: '#fff', stroke: '#374151', strokeWidth: 1.5 },
      { type: 'text', x: 205, y: 130, text: '20A', fontSize: 7, textAnchor: 'middle' },

      // === Rangée 2 ===
      { type: 'rect', x: 50, y: 190, width: 40, height: 70, fill: '#fff', stroke: '#374151', strokeWidth: 2 },
      { type: 'text', x: 70, y: 215, text: 'DDR', fontSize: 9, textAnchor: 'middle' },
      { type: 'text', x: 70, y: 230, text: '30mA', fontSize: 7, textAnchor: 'middle' },

      // === CÂBLAGE (avec erreurs) ===

      // Fil phase rouge OK
      { type: 'line', x1: 100, y1: 100, x2: 120, y2: 100, stroke: '#ef4444', strokeWidth: 2.5 },

      // Fil neutre avec mauvaise couleur - NOIR au lieu de BLEU (ERREUR)
      { type: 'line', x1: 100, y1: 110, x2: 120, y2: 110, stroke: '#1f2937', strokeWidth: 2.5, id: 'erreur1' },
      { type: 'text', x: 110, y: 108, text: 'N?', fontSize: 6, textAnchor: 'middle', fill: '#dc2626' },

      // Câbles qui se croisent en désordre (ERREUR)
      { type: 'path', d: 'M 160 120 Q 180 150 200 120 Q 220 90 240 130', stroke: '#ef4444', strokeWidth: 2, fill: 'none', id: 'erreur2' },
      { type: 'path', d: 'M 160 130 Q 190 100 210 140 Q 230 180 250 120', stroke: '#3b82f6', strokeWidth: 2, fill: 'none' },

      // Borne mal serrée - fil qui dépasse (ERREUR)
      { type: 'line', x1: 195, y1: 160, x2: 195, y2: 175, stroke: '#ef4444', strokeWidth: 2, id: 'erreur3' },
      { type: 'line', x1: 195, y1: 175, x2: 202, y2: 182, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 202, y1: 182, x2: 195, y2: 185, stroke: '#d97706', strokeWidth: 1.5 },
      { type: 'text', x: 210, y: 180, text: 'Mal serrée', fontSize: 6, fill: '#dc2626' },

      // Terre passant par neutre (ERREUR GRAVE)
      { type: 'line', x1: 90, y1: 200, x2: 90, y2: 280, stroke: '#22c55e', strokeWidth: 2 },
      { type: 'line', x1: 90, y1: 240, x2: 120, y2: 240, stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '4 2' },
      { type: 'line', x1: 120, y1: 240, x2: 120, y2: 230, stroke: '#3b82f6', strokeWidth: 2, id: 'erreur4' },
      { type: 'text', x: 135, y: 238, text: 'PE→N?', fontSize: 7, fill: '#dc2626' },

      // Trop de fils sous une borne (ERREUR)
      { type: 'circle', cx: 300, cy: 230, r: 8, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, id: 'erreur5' },
      { type: 'line', x1: 290, y1: 230, x2: 280, y2: 215, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 295, y1: 225, x2: 285, y2: 205, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 300, y1: 222, x2: 300, y2: 200, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 305, y1: 225, x2: 315, y2: 205, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 310, y1: 230, x2: 325, y2: 218, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'text', x: 300, y: 250, text: '5 fils!', fontSize: 7, textAnchor: 'middle', fill: '#dc2626' },

      // Légende
      { type: 'rect', x: 260, y: 45, width: 100, height: 60, fill: '#fff', stroke: '#9ca3af', rx: 4 },
      { type: 'text', x: 310, y: 58, text: 'Couleurs', fontSize: 8, fontWeight: 'bold', textAnchor: 'middle' },
      { type: 'line', x1: 270, y1: 70, x2: 290, y2: 70, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'text', x: 295, y: 73, text: 'Phase', fontSize: 7 },
      { type: 'line', x1: 270, y1: 82, x2: 290, y2: 82, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'text', x: 295, y: 85, text: 'Neutre', fontSize: 7 },
      { type: 'line', x1: 270, y1: 94, x2: 290, y2: 94, stroke: '#22c55e', strokeWidth: 2 },
      { type: 'text', x: 295, y: 97, text: 'Terre', fontSize: 7 },
    ],
    erreurs: [
      {
        id: 'erreur1',
        zone: { x: 100, y: 105, width: 25, height: 15 },
        titre: 'Couleur neutre incorrecte',
        explication: 'Le conducteur neutre doit OBLIGATOIREMENT être de couleur bleue. Le noir est réservé à la phase.',
        correction: 'Remplacer par un conducteur bleu clair'
      },
      {
        id: 'erreur2',
        zone: { x: 155, y: 85, width: 100, height: 60 },
        titre: 'Câblage désordonné',
        explication: 'Les fils doivent être rangés proprement, sans croisements inutiles. Cela facilite la maintenance et évite les erreurs.',
        correction: 'Réorganiser les fils, utiliser des goulottes ou peignes'
      },
      {
        id: 'erreur3',
        zone: { x: 190, y: 155, width: 30, height: 35 },
        titre: 'Borne mal serrée',
        explication: 'Un fil mal serré crée une résistance qui provoque un échauffement. C\'est une cause fréquente d\'incendie électrique.',
        correction: 'Resserrer la borne au couple préconisé'
      },
      {
        id: 'erreur4',
        zone: { x: 85, y: 225, width: 45, height: 30 },
        titre: 'Terre reliée au neutre',
        explication: 'Le conducteur de protection (terre) ne doit JAMAIS être connecté au neutre. C\'est extrêmement dangereux.',
        correction: 'Séparer les conducteurs, terre sur bornier dédié'
      },
      {
        id: 'erreur5',
        zone: { x: 275, y: 195, width: 55, height: 60 },
        titre: 'Trop de fils par borne',
        explication: 'Maximum 2 conducteurs par borne (selon fabricant). 5 fils = mauvais contact, échauffement, desserrage.',
        correction: 'Utiliser des borniers de répartition adaptés'
      }
    ]
  },
  {
    id: 'gtl-incomplete',
    titre: 'GTL incomplète',
    description: 'Cette Gaine Technique Logement présente des manquements à la norme.',
    difficulte: 3,
    dureeEstimee: '4 min',
    icon: '🏠',
    nbErreurs: 4,
    viewBox: '0 0 300 400',
    elements: [
      // Titre
      { type: 'text', x: 150, y: 20, text: 'GAINE TECHNIQUE LOGEMENT', fontSize: 10, fontWeight: 'bold', textAnchor: 'middle' },

      // Contour GTL
      { type: 'rect', x: 50, y: 40, width: 200, height: 340, fill: '#f3f4f6', stroke: '#374151', strokeWidth: 3 },

      // Dimensions requises
      { type: 'line', x1: 35, y1: 40, x2: 35, y2: 380, stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '3 2' },
      { type: 'text', x: 25, y: 210, text: '≥1m', fontSize: 8, fill: '#3b82f6', transform: 'rotate(-90 25 210)' },
      { type: 'line', x1: 50, y1: 390, x2: 250, y2: 390, stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '3 2' },
      { type: 'text', x: 150, y: 398, text: '≥600mm (200 si réhab.)', fontSize: 7, textAnchor: 'middle', fill: '#3b82f6' },

      // Tableau électrique
      { type: 'rect', x: 70, y: 60, width: 160, height: 100, fill: '#fff', stroke: '#374151', strokeWidth: 2 },
      { type: 'text', x: 150, y: 90, text: 'TABLEAU', fontSize: 12, textAnchor: 'middle', fontWeight: 'bold' },
      { type: 'text', x: 150, y: 105, text: 'ÉLECTRIQUE', fontSize: 10, textAnchor: 'middle' },
      { type: 'text', x: 150, y: 120, text: '13 modules', fontSize: 8, textAnchor: 'middle', fill: '#6b7280' },
      { type: 'text', x: 150, y: 145, text: 'Pas de réserve!', fontSize: 8, textAnchor: 'middle', fill: '#dc2626', id: 'erreur1' },

      // Coffret communication (MANQUANT - ERREUR)
      { type: 'rect', x: 70, y: 180, width: 160, height: 70, fill: '#fef3c7', stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5 3', id: 'erreur2' },
      { type: 'text', x: 150, y: 205, text: 'COFFRET COM', fontSize: 10, textAnchor: 'middle', fill: '#f59e0b' },
      { type: 'text', x: 150, y: 220, text: 'ABSENT ?', fontSize: 10, textAnchor: 'middle', fill: '#dc2626', fontWeight: 'bold' },
      { type: 'text', x: 150, y: 235, text: '(Grade 1 mini)', fontSize: 7, textAnchor: 'middle', fill: '#92400e' },

      // Espace ERDF
      { type: 'rect', x: 70, y: 270, width: 160, height: 50, fill: '#dbeafe', stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'text', x: 150, y: 295, text: 'ESPACE ERDF', fontSize: 10, textAnchor: 'middle' },
      { type: 'text', x: 150, y: 310, text: 'Coupure d\'urgence', fontSize: 7, textAnchor: 'middle', fill: '#6b7280' },

      // Canalisation eau passant dans GTL (ERREUR)
      { type: 'line', x1: 60, y1: 330, x2: 60, y2: 380, stroke: '#06b6d4', strokeWidth: 6, id: 'erreur3' },
      { type: 'line', x1: 60, y1: 380, x2: 120, y2: 380, stroke: '#06b6d4', strokeWidth: 6 },
      { type: 'text', x: 90, y: 370, text: 'EAU', fontSize: 8, fill: '#0891b2' },

      // Pas de conduits pour câbles (ERREUR)
      { type: 'line', x1: 230, y1: 100, x2: 260, y2: 100, stroke: '#ef4444', strokeWidth: 3, id: 'erreur4' },
      { type: 'line', x1: 230, y1: 200, x2: 260, y2: 200, stroke: '#3b82f6', strokeWidth: 3 },
      { type: 'line', x1: 230, y1: 290, x2: 260, y2: 290, stroke: '#ef4444', strokeWidth: 3 },
      { type: 'text', x: 270, y: 150, text: 'Câbles', fontSize: 7, fill: '#dc2626' },
      { type: 'text', x: 270, y: 162, text: 'volants', fontSize: 7, fill: '#dc2626' },

      // Légende
      { type: 'rect', x: 70, y: 340, width: 160, height: 30, fill: '#f0fdf4', stroke: '#22c55e', rx: 4 },
      { type: 'text', x: 150, y: 358, text: 'NF C 15-100 §10.1.3', fontSize: 8, textAnchor: 'middle', fill: '#166534' },
    ],
    erreurs: [
      {
        id: 'erreur1',
        zone: { x: 70, y: 60, width: 160, height: 100 },
        titre: 'Pas de réserve au tableau',
        explication: 'Le tableau doit avoir minimum 20% de réserve (places libres) pour les extensions futures.',
        correction: 'Prévoir un tableau plus grand avec au moins 20% de modules libres'
      },
      {
        id: 'erreur2',
        zone: { x: 70, y: 180, width: 160, height: 70 },
        titre: 'Coffret communication absent',
        explication: 'La GTL doit obligatoirement inclure un coffret de communication (Grade 1 minimum avec bandeau RJ45).',
        correction: 'Installer un coffret de communication Grade 1 ou supérieur'
      },
      {
        id: 'erreur3',
        zone: { x: 55, y: 325, width: 75, height: 60 },
        titre: 'Canalisation d\'eau dans GTL',
        explication: 'INTERDIT : aucune canalisation d\'eau, de gaz ou de chauffage ne doit traverser la GTL.',
        correction: 'Dévier la canalisation hors de la GTL'
      },
      {
        id: 'erreur4',
        zone: { x: 225, y: 90, width: 50, height: 210 },
        titre: 'Câbles sans protection',
        explication: 'Les câbles doivent cheminer dans des conduits, goulottes ou chemins de câbles, pas en "volant".',
        correction: 'Installer des conduits IRL ou goulottes pour le passage des câbles'
      }
    ]
  }
]

// Fonctions utilitaires
export function getErreurVisuelleById(id) {
  return erreursVisuelles.find(e => e.id === id)
}

export function getAllErreursVisuelles() {
  return erreursVisuelles
}

export function getErreursVisuellesByDifficulte(niveau) {
  return erreursVisuelles.filter(e => e.difficulte === niveau)
}
