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
    viewBox: '0 0 420 380',
    elements: [
      // Fond du tableau
      { type: 'rect', x: 20, y: 30, width: 380, height: 330, fill: '#f3f4f6', stroke: '#374151', strokeWidth: 3 },
      { type: 'text', x: 210, y: 20, text: 'TABLEAU ÉLECTRIQUE', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle' },

      // Arrivée générale (câbles du haut)
      { type: 'line', x1: 50, y1: 30, x2: 50, y2: 55, stroke: '#ef4444', strokeWidth: 3 },
      { type: 'line', x1: 70, y1: 30, x2: 70, y2: 55, stroke: '#3b82f6', strokeWidth: 3 },
      { type: 'text', x: 60, y: 45, text: 'Arrivée', fontSize: 7, textAnchor: 'middle', fill: '#6b7280' },

      // Rail DIN 1
      { type: 'rect', x: 30, y: 55, width: 360, height: 10, fill: '#9ca3af', stroke: '#6b7280' },
      // Rail DIN 2
      { type: 'rect', x: 30, y: 145, width: 360, height: 10, fill: '#9ca3af', stroke: '#6b7280' },
      // Rail DIN 3
      { type: 'rect', x: 30, y: 235, width: 360, height: 10, fill: '#9ca3af', stroke: '#6b7280' },

      // Bornier neutre
      { type: 'rect', x: 30, y: 320, width: 170, height: 15, fill: '#3b82f6', stroke: '#1d4ed8', strokeWidth: 2 },
      { type: 'text', x: 115, y: 330, text: 'BORNIER NEUTRE', fontSize: 7, textAnchor: 'middle', fill: '#fff' },
      // Bornier terre
      { type: 'rect', x: 220, y: 320, width: 170, height: 15, fill: '#22c55e', stroke: '#15803d', strokeWidth: 2 },
      { type: 'text', x: 305, y: 330, text: 'BORNIER TERRE', fontSize: 7, textAnchor: 'middle', fill: '#fff' },

      // ============ RANGÉE 1 : Éclairage ============
      // DDR 30mA (correct)
      { type: 'rect', x: 40, y: 70, width: 45, height: 65, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 3 },
      { type: 'text', x: 62, y: 90, text: 'DDR', fontSize: 9, textAnchor: 'middle', fontWeight: 'bold' },
      { type: 'text', x: 62, y: 102, text: '30mA', fontSize: 8, textAnchor: 'middle', fill: '#059669' },
      { type: 'text', x: 62, y: 114, text: '40A', fontSize: 8, textAnchor: 'middle' },
      { type: 'rect', x: 48, y: 120, width: 28, height: 8, fill: '#22c55e', rx: 2 },

      // Peigne rangée 1 (phase)
      { type: 'line', x1: 85, y1: 80, x2: 200, y2: 80, stroke: '#ef4444', strokeWidth: 3 },
      // Peigne rangée 1 (neutre)
      { type: 'line', x1: 85, y1: 90, x2: 200, y2: 90, stroke: '#3b82f6', strokeWidth: 3 },

      // Disjoncteur 10A éclairage 1
      { type: 'rect', x: 100, y: 70, width: 22, height: 65, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2 },
      { type: 'text', x: 111, y: 100, text: '10A', fontSize: 7, textAnchor: 'middle' },
      { type: 'circle', cx: 111, cy: 115, r: 6, fill: '#22c55e' },
      { type: 'text', x: 111, y: 118, text: 'I', fontSize: 6, textAnchor: 'middle', fill: '#fff' },

      // Disjoncteur 10A éclairage 2
      { type: 'rect', x: 130, y: 70, width: 22, height: 65, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2 },
      { type: 'text', x: 141, y: 100, text: '10A', fontSize: 7, textAnchor: 'middle' },
      { type: 'circle', cx: 141, cy: 115, r: 6, fill: '#22c55e' },
      { type: 'text', x: 141, y: 118, text: 'I', fontSize: 6, textAnchor: 'middle', fill: '#fff' },

      // Disjoncteur 10A éclairage 3
      { type: 'rect', x: 160, y: 70, width: 22, height: 65, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2 },
      { type: 'text', x: 171, y: 100, text: '10A', fontSize: 7, textAnchor: 'middle' },
      { type: 'circle', cx: 171, cy: 115, r: 6, fill: '#22c55e' },
      { type: 'text', x: 171, y: 118, text: 'I', fontSize: 6, textAnchor: 'middle', fill: '#fff' },

      // Fils de sortie rangée 1 (vers circuits)
      { type: 'line', x1: 111, y1: 135, x2: 111, y2: 143, stroke: '#f97316', strokeWidth: 2 },
      { type: 'line', x1: 141, y1: 135, x2: 141, y2: 143, stroke: '#f97316', strokeWidth: 2 },
      { type: 'line', x1: 171, y1: 135, x2: 171, y2: 143, stroke: '#f97316', strokeWidth: 2 },

      // Label rangée 1
      { type: 'text', x: 135, y: 142, text: 'Éclairage', fontSize: 7, textAnchor: 'middle', fill: '#6b7280' },

      // ============ RANGÉE 2 : Prises (avec erreurs) ============
      // DDR 300mA (ERREUR - devrait être 30mA)
      { type: 'rect', x: 40, y: 160, width: 45, height: 65, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 3, id: 'erreur1' },
      { type: 'text', x: 62, y: 180, text: 'DDR', fontSize: 9, textAnchor: 'middle', fontWeight: 'bold' },
      { type: 'text', x: 62, y: 192, text: '300mA', fontSize: 8, textAnchor: 'middle', fill: '#dc2626' },
      { type: 'text', x: 62, y: 204, text: '40A', fontSize: 8, textAnchor: 'middle' },
      { type: 'rect', x: 48, y: 210, width: 28, height: 8, fill: '#22c55e', rx: 2 },

      // Peigne rangée 2 (phase)
      { type: 'line', x1: 85, y1: 170, x2: 200, y2: 170, stroke: '#ef4444', strokeWidth: 3 },
      // Peigne rangée 2 (neutre) - ERREUR: fil bleu utilisé comme phase
      { type: 'line', x1: 85, y1: 180, x2: 115, y2: 180, stroke: '#3b82f6', strokeWidth: 3 },
      { type: 'line', x1: 115, y1: 180, x2: 200, y2: 180, stroke: '#3b82f6', strokeWidth: 3, id: 'erreur4' },

      // Disjoncteur 16A prises 1 (correct)
      { type: 'rect', x: 100, y: 160, width: 22, height: 65, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2 },
      { type: 'text', x: 111, y: 190, text: '16A', fontSize: 7, textAnchor: 'middle' },
      { type: 'circle', cx: 111, cy: 205, r: 6, fill: '#22c55e' },

      // Disjoncteur 32A sur prises (ERREUR - trop fort)
      { type: 'rect', x: 130, y: 160, width: 22, height: 65, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2, id: 'erreur2' },
      { type: 'text', x: 141, y: 190, text: '32A', fontSize: 7, textAnchor: 'middle', fill: '#dc2626' },
      { type: 'circle', cx: 141, cy: 205, r: 6, fill: '#22c55e' },
      { type: 'text', x: 141, y: 230, text: 'Prises!', fontSize: 6, textAnchor: 'middle', fill: '#dc2626' },

      // Disjoncteur 16A prises 3
      { type: 'rect', x: 160, y: 160, width: 22, height: 65, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2 },
      { type: 'text', x: 171, y: 190, text: '16A', fontSize: 7, textAnchor: 'middle' },
      { type: 'circle', cx: 171, cy: 205, r: 6, fill: '#22c55e' },

      // Fils sortie rangée 2 - avec un fil bleu comme phase (ERREUR visible)
      { type: 'line', x1: 111, y1: 225, x2: 111, y2: 233, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 141, y1: 225, x2: 141, y2: 233, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'text', x: 150, y: 232, text: 'L?', fontSize: 6, fill: '#dc2626' },
      { type: 'line', x1: 171, y1: 225, x2: 171, y2: 233, stroke: '#ef4444', strokeWidth: 2 },

      // ============ RANGÉE 3 : Circuits spécialisés ============
      // DDR 30mA (correct)
      { type: 'rect', x: 40, y: 250, width: 45, height: 65, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 3 },
      { type: 'text', x: 62, y: 270, text: 'DDR', fontSize: 9, textAnchor: 'middle', fontWeight: 'bold' },
      { type: 'text', x: 62, y: 282, text: '30mA', fontSize: 8, textAnchor: 'middle', fill: '#059669' },
      { type: 'text', x: 62, y: 294, text: '40A', fontSize: 8, textAnchor: 'middle' },
      { type: 'rect', x: 48, y: 300, width: 28, height: 8, fill: '#22c55e', rx: 2 },

      // Peigne rangée 3
      { type: 'line', x1: 85, y1: 260, x2: 200, y2: 260, stroke: '#ef4444', strokeWidth: 3 },
      { type: 'line', x1: 85, y1: 270, x2: 200, y2: 270, stroke: '#3b82f6', strokeWidth: 3 },

      // Disjoncteur 10A pour plaque (ERREUR - doit être 32A)
      { type: 'rect', x: 100, y: 250, width: 22, height: 65, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2, id: 'erreur3' },
      { type: 'text', x: 111, y: 275, text: '10A', fontSize: 7, textAnchor: 'middle', fill: '#dc2626' },
      { type: 'circle', cx: 111, cy: 290, r: 6, fill: '#f59e0b' },
      { type: 'text', x: 111, y: 305, text: 'Plaque', fontSize: 5, textAnchor: 'middle' },

      // Disjoncteur 20A lave-linge (correct)
      { type: 'rect', x: 130, y: 250, width: 22, height: 65, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2 },
      { type: 'text', x: 141, y: 275, text: '20A', fontSize: 7, textAnchor: 'middle' },
      { type: 'circle', cx: 141, cy: 290, r: 6, fill: '#22c55e' },
      { type: 'text', x: 141, y: 305, text: 'L-Linge', fontSize: 5, textAnchor: 'middle' },

      // Disjoncteur 20A four (correct)
      { type: 'rect', x: 160, y: 250, width: 22, height: 65, fill: '#fff', stroke: '#374151', strokeWidth: 1.5, rx: 2 },
      { type: 'text', x: 171, y: 275, text: '20A', fontSize: 7, textAnchor: 'middle' },
      { type: 'circle', cx: 171, cy: 290, r: 6, fill: '#22c55e' },
      { type: 'text', x: 171, y: 305, text: 'Four', fontSize: 5, textAnchor: 'middle' },

      // Fils vers borniers
      { type: 'line', x1: 62, y1: 225, x2: 62, y2: 320, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'line', x1: 50, y1: 135, x2: 50, y2: 320, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'line', x1: 300, y1: 135, x2: 300, y2: 320, stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '4 2' },

      // Légende
      { type: 'rect', x: 250, y: 55, width: 130, height: 100, fill: '#fff', stroke: '#9ca3af', rx: 4 },
      { type: 'text', x: 315, y: 70, text: 'LÉGENDE', fontSize: 9, fontWeight: 'bold', textAnchor: 'middle' },
      { type: 'line', x1: 260, y1: 85, x2: 285, y2: 85, stroke: '#ef4444', strokeWidth: 3 },
      { type: 'text', x: 290, y: 88, text: 'Phase (L)', fontSize: 7 },
      { type: 'line', x1: 260, y1: 100, x2: 285, y2: 100, stroke: '#3b82f6', strokeWidth: 3 },
      { type: 'text', x: 290, y: 103, text: 'Neutre (N)', fontSize: 7 },
      { type: 'line', x1: 260, y1: 115, x2: 285, y2: 115, stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '4 2' },
      { type: 'text', x: 290, y: 118, text: 'Terre (PE)', fontSize: 7 },
      { type: 'line', x1: 260, y1: 130, x2: 285, y2: 130, stroke: '#f97316', strokeWidth: 2 },
      { type: 'text', x: 290, y: 133, text: 'Retour', fontSize: 7 },
      { type: 'text', x: 315, y: 148, text: '4 erreurs à trouver', fontSize: 8, textAnchor: 'middle', fill: '#dc2626' },
    ],
    erreurs: [
      {
        id: 'erreur1',
        zone: { x: 40, y: 160, width: 45, height: 65 },
        titre: 'DDR 300mA inadapté',
        explication: 'Les prises de courant nécessitent un DDR 30mA haute sensibilité pour la protection des personnes, pas un 300mA.',
        correction: 'Remplacer par un DDR 30mA Type AC ou Type A'
      },
      {
        id: 'erreur2',
        zone: { x: 130, y: 160, width: 22, height: 65 },
        titre: 'Calibre 32A sur prises standard',
        explication: 'Un disjoncteur 32A est trop puissant pour des prises standard (2.5mm²). Le câble risque de surchauffer avant déclenchement.',
        correction: 'Utiliser un disjoncteur 16A pour les prises en 2.5mm²'
      },
      {
        id: 'erreur3',
        zone: { x: 100, y: 250, width: 22, height: 65 },
        titre: 'Calibre 10A pour plaque cuisson',
        explication: 'Une plaque de cuisson nécessite un disjoncteur 32A minimum (circuit spécialisé en 6mm²).',
        correction: 'Installer un disjoncteur 32A et vérifier la section du câble (6mm²)'
      },
      {
        id: 'erreur4',
        zone: { x: 135, y: 220, width: 20, height: 20 },
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
    viewBox: '0 0 400 350',
    elements: [
      // Titre
      { type: 'text', x: 200, y: 18, text: 'SALLE DE BAIN - Volumes de sécurité', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle' },

      // Mur du fond
      { type: 'rect', x: 10, y: 30, width: 380, height: 280, fill: '#e0f2fe', stroke: '#0ea5e9', strokeWidth: 2 },

      // Sol carrelé
      { type: 'rect', x: 10, y: 310, width: 380, height: 30, fill: '#d1d5db' },
      { type: 'line', x1: 50, y1: 310, x2: 50, y2: 340, stroke: '#9ca3af', strokeWidth: 1 },
      { type: 'line', x1: 100, y1: 310, x2: 100, y2: 340, stroke: '#9ca3af', strokeWidth: 1 },
      { type: 'line', x1: 150, y1: 310, x2: 150, y2: 340, stroke: '#9ca3af', strokeWidth: 1 },
      { type: 'line', x1: 200, y1: 310, x2: 200, y2: 340, stroke: '#9ca3af', strokeWidth: 1 },
      { type: 'line', x1: 250, y1: 310, x2: 250, y2: 340, stroke: '#9ca3af', strokeWidth: 1 },
      { type: 'line', x1: 300, y1: 310, x2: 300, y2: 340, stroke: '#9ca3af', strokeWidth: 1 },
      { type: 'line', x1: 350, y1: 310, x2: 350, y2: 340, stroke: '#9ca3af', strokeWidth: 1 },
      { type: 'text', x: 200, y: 348, text: 'SOL', fontSize: 9, textAnchor: 'middle', fill: '#6b7280' },

      // Baignoire avec robinetterie
      { type: 'rect', x: 20, y: 200, width: 130, height: 100, fill: '#fff', stroke: '#374151', strokeWidth: 3, rx: 10 },
      { type: 'ellipse', cx: 50, cy: 230, rx: 12, ry: 6, fill: '#9ca3af' },
      { type: 'rect', x: 70, y: 195, width: 25, height: 15, fill: '#d1d5db', stroke: '#9ca3af', rx: 3 },
      { type: 'text', x: 85, y: 260, text: 'BAIGNOIRE', fontSize: 10, textAnchor: 'middle', fill: '#374151', fontWeight: 'bold' },

      // Zones de volume (couleurs de fond)
      { type: 'rect', x: 20, y: 100, width: 130, height: 100, fill: 'rgba(254, 202, 202, 0.3)', stroke: 'none' },
      { type: 'rect', x: 150, y: 100, width: 60, height: 200, fill: 'rgba(254, 240, 138, 0.3)', stroke: 'none' },
      { type: 'rect', x: 210, y: 100, width: 60, height: 200, fill: 'rgba(187, 247, 208, 0.3)', stroke: 'none' },

      // Lignes de délimitation des volumes
      { type: 'line', x1: 150, y1: 100, x2: 150, y2: 310, stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5 3' },
      { type: 'line', x1: 210, y1: 100, x2: 210, y2: 310, stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '5 3' },
      { type: 'line', x1: 270, y1: 100, x2: 270, y2: 310, stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 3' },

      // Labels volumes
      { type: 'text', x: 85, y: 95, text: 'Volume 0', fontSize: 8, textAnchor: 'middle', fill: '#dc2626' },
      { type: 'text', x: 180, y: 95, text: 'Vol.1', fontSize: 8, textAnchor: 'middle', fill: '#f59e0b' },
      { type: 'text', x: 240, y: 95, text: 'Vol.2', fontSize: 8, textAnchor: 'middle', fill: '#22c55e' },
      { type: 'text', x: 320, y: 95, text: 'Hors vol.', fontSize: 8, textAnchor: 'middle', fill: '#3b82f6' },

      // Distances
      { type: 'text', x: 180, y: 305, text: '60cm', fontSize: 7, textAnchor: 'middle', fill: '#f59e0b' },
      { type: 'text', x: 240, y: 305, text: '60cm', fontSize: 7, textAnchor: 'middle', fill: '#22c55e' },

      // Câble alimentation général (du plafond)
      { type: 'line', x1: 340, y1: 30, x2: 340, y2: 60, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 350, y1: 30, x2: 350, y2: 60, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'line', x1: 360, y1: 30, x2: 360, y2: 60, stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '3 2' },
      { type: 'text', x: 350, y: 55, text: 'Depuis tableau', fontSize: 6, textAnchor: 'middle', fill: '#6b7280' },

      // === PRISE DANS VOLUME 1 (ERREUR) ===
      // Fil vers la prise
      { type: 'line', x1: 340, y1: 60, x2: 340, y2: 130, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 340, y1: 130, x2: 175, y2: 130, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 175, y1: 130, x2: 175, y2: 155, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 350, y1: 60, x2: 350, y2: 125, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'line', x1: 350, y1: 125, x2: 185, y2: 125, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'line', x1: 185, y1: 125, x2: 185, y2: 155, stroke: '#3b82f6', strokeWidth: 2 },
      // Prise
      { type: 'rect', x: 160, y: 155, width: 40, height: 28, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 4, id: 'erreur1' },
      { type: 'circle', cx: 172, cy: 169, r: 4, fill: '#374151' },
      { type: 'circle', cx: 188, cy: 169, r: 4, fill: '#374151' },
      { type: 'line', x1: 180, y1: 158, x2: 180, y2: 155, stroke: '#22c55e', strokeWidth: 2 },

      // === INTERRUPTEUR NON IP44 DANS VOLUME 2 (ERREUR) ===
      // Fils vers inter
      { type: 'line', x1: 340, y1: 130, x2: 240, y2: 130, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 240, y1: 130, x2: 240, y2: 200, stroke: '#ef4444', strokeWidth: 2 },
      // Interrupteur
      { type: 'rect', x: 225, y: 200, width: 30, height: 45, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 4, id: 'erreur2' },
      { type: 'circle', cx: 240, cy: 225, r: 10, fill: '#f3f4f6', stroke: '#374151', strokeWidth: 2 },
      { type: 'text', x: 240, y: 250, text: 'Inter', fontSize: 7, textAnchor: 'middle', fill: '#6b7280' },

      // === LUMINAIRE IPx4 (CORRECT) ===
      { type: 'line', x1: 350, y1: 60, x2: 350, y2: 70, stroke: '#f97316', strokeWidth: 2 },
      { type: 'line', x1: 350, y1: 70, x2: 240, y2: 70, stroke: '#f97316', strokeWidth: 2 },
      { type: 'line', x1: 240, y1: 70, x2: 240, y2: 50, stroke: '#f97316', strokeWidth: 2 },
      { type: 'circle', cx: 240, cy: 50, r: 18, fill: '#fef9c3', stroke: '#eab308', strokeWidth: 2 },
      { type: 'text', x: 240, y: 53, text: 'IPx4', fontSize: 8, textAnchor: 'middle', fontWeight: 'bold' },
      { type: 'text', x: 240, y: 75, text: 'OK', fontSize: 7, textAnchor: 'middle', fill: '#22c55e' },

      // === RADIATEUR CLASSE I EN VOLUME 2 (ERREUR) ===
      // Fils vers radiateur
      { type: 'line', x1: 340, y1: 130, x2: 340, y2: 200, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 340, y1: 200, x2: 260, y2: 200, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 260, y1: 200, x2: 260, y2: 255, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 360, y1: 60, x2: 360, y2: 195, stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '3 2' },
      { type: 'line', x1: 360, y1: 195, x2: 270, y2: 195, stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '3 2' },
      { type: 'line', x1: 270, y1: 195, x2: 270, y2: 255, stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '3 2' },
      // Radiateur
      { type: 'rect', x: 220, y: 255, width: 60, height: 50, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 4, id: 'erreur3' },
      { type: 'line', x1: 230, y1: 268, x2: 270, y2: 268, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 230, y1: 278, x2: 270, y2: 278, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 230, y1: 288, x2: 270, y2: 288, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 230, y1: 298, x2: 270, y2: 298, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'text', x: 250, y: 260, text: 'Classe I', fontSize: 6, textAnchor: 'middle', fill: '#dc2626' },

      // === CHAUFFE-EAU SANS DDR 30mA (ERREUR) ===
      // Fils vers chauffe-eau
      { type: 'line', x1: 350, y1: 60, x2: 350, y2: 80, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'line', x1: 350, y1: 80, x2: 360, y2: 80, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 360, y1: 80, x2: 360, y2: 120, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 350, y1: 80, x2: 350, y2: 120, stroke: '#3b82f6', strokeWidth: 2 },
      // Chauffe-eau
      { type: 'rect', x: 330, y: 120, width: 55, height: 90, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 5, id: 'erreur4' },
      { type: 'ellipse', cx: 357, cy: 180, rx: 18, ry: 10, fill: '#e5e7eb' },
      { type: 'text', x: 357, y: 145, text: 'Ballon', fontSize: 9, textAnchor: 'middle', fontWeight: 'bold' },
      { type: 'text', x: 357, y: 158, text: 'ECS', fontSize: 8, textAnchor: 'middle' },
      { type: 'text', x: 357, y: 220, text: 'DDR 30mA ?', fontSize: 7, textAnchor: 'middle', fill: '#dc2626' },

      // === LAVABO HORS VOLUME (CORRECT) ===
      { type: 'ellipse', cx: 340, cy: 270, rx: 30, ry: 18, fill: '#fff', stroke: '#374151', strokeWidth: 2 },
      { type: 'circle', cx: 340, cy: 270, r: 5, fill: '#9ca3af' },
      { type: 'rect', x: 330, y: 248, width: 20, height: 12, fill: '#d1d5db', stroke: '#9ca3af', rx: 2 },
      { type: 'text', x: 340, y: 295, text: 'Lavabo', fontSize: 8, textAnchor: 'middle', fill: '#6b7280' },

      // Légende volumes
      { type: 'rect', x: 15, y: 40, width: 120, height: 55, fill: '#fff', stroke: '#9ca3af', rx: 4 },
      { type: 'text', x: 75, y: 52, text: 'Volumes SDB', fontSize: 8, fontWeight: 'bold', textAnchor: 'middle' },
      { type: 'rect', x: 20, y: 58, width: 12, height: 8, fill: '#fecaca' },
      { type: 'text', x: 37, y: 65, text: 'Vol.0 INTERDIT', fontSize: 6 },
      { type: 'rect', x: 20, y: 70, width: 12, height: 8, fill: '#fef08a' },
      { type: 'text', x: 37, y: 77, text: 'Vol.1 IPx5 12V', fontSize: 6 },
      { type: 'rect', x: 20, y: 82, width: 12, height: 8, fill: '#bbf7d0' },
      { type: 'text', x: 37, y: 89, text: 'Vol.2 IPx4', fontSize: 6 },
    ],
    erreurs: [
      {
        id: 'erreur1',
        zone: { x: 160, y: 155, width: 40, height: 28 },
        titre: 'Prise interdite en Volume 1',
        explication: 'Les prises de courant sont INTERDITES dans les volumes 0, 1 et 2 de la salle de bain (sauf prise rasoir avec transfo de séparation dans vol.2).',
        correction: 'Supprimer la prise ou la déplacer hors volume (à plus de 60cm de la baignoire)'
      },
      {
        id: 'erreur2',
        zone: { x: 225, y: 200, width: 30, height: 45 },
        titre: 'Interrupteur non protégé en Volume 2',
        explication: 'En volume 2, l\'appareillage doit être IP x4 minimum. Un interrupteur classique n\'est pas adapté.',
        correction: 'Utiliser un appareillage IP44 ou déplacer hors volume'
      },
      {
        id: 'erreur3',
        zone: { x: 220, y: 255, width: 60, height: 50 },
        titre: 'Radiateur classe I en Volume 2',
        explication: 'Les appareils de chauffage de classe I (avec terre) sont interdits en volume 2. Seul le classe II IPx4 est autorisé.',
        correction: 'Utiliser un radiateur classe II IPx4 ou le déplacer hors volume'
      },
      {
        id: 'erreur4',
        zone: { x: 330, y: 120, width: 55, height: 90 },
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
    viewBox: '0 0 400 300',
    elements: [
      // Titre
      { type: 'text', x: 200, y: 18, text: 'INSTALLATION DE PRISES', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle' },

      // Mur
      { type: 'rect', x: 10, y: 30, width: 380, height: 240, fill: '#fef3c7', stroke: '#d97706', strokeWidth: 2 },

      // Sol
      { type: 'rect', x: 10, y: 270, width: 380, height: 25, fill: '#92400e' },
      { type: 'text', x: 30, y: 288, text: 'SOL', fontSize: 10, fill: '#fef3c7' },

      // Câblage principal horizontal (dans le mur)
      { type: 'line', x1: 20, y1: 50, x2: 380, y2: 50, stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '8 3' },
      { type: 'line', x1: 20, y1: 58, x2: 380, y2: 58, stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '8 3' },
      { type: 'line', x1: 20, y1: 66, x2: 380, y2: 66, stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '8 3' },
      { type: 'text', x: 35, y: 80, text: 'Gaine encastrée', fontSize: 7, fill: '#6b7280' },

      // Règle de mesure
      { type: 'line', x1: 25, y1: 200, x2: 25, y2: 270, stroke: '#22c55e', strokeWidth: 1 },
      { type: 'line', x1: 20, y1: 200, x2: 30, y2: 200, stroke: '#22c55e', strokeWidth: 1 },
      { type: 'text', x: 32, y: 235, text: '5cm', fontSize: 8, fill: '#22c55e' },
      { type: 'text', x: 32, y: 248, text: 'mini', fontSize: 7, fill: '#22c55e' },

      // === PRISE 1 : Trop près du sol (ERREUR) ===
      { type: 'line', x1: 70, y1: 50, x2: 70, y2: 255, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 78, y1: 58, x2: 78, y2: 255, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'line', x1: 86, y1: 66, x2: 86, y2: 258, stroke: '#22c55e', strokeWidth: 2 },
      { type: 'rect', x: 55, y: 255, width: 45, height: 30, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 5, id: 'erreur1' },
      { type: 'circle', cx: 68, cy: 270, r: 5, fill: '#374151' },
      { type: 'circle', cx: 88, cy: 270, r: 5, fill: '#374151' },
      { type: 'line', x1: 78, y1: 258, x2: 78, y2: 255, stroke: '#22c55e', strokeWidth: 2 },
      { type: 'text', x: 78, y: 250, text: '1cm!', fontSize: 8, textAnchor: 'middle', fill: '#dc2626', fontWeight: 'bold' },

      // === PRISE 2 : Correcte ===
      { type: 'line', x1: 150, y1: 50, x2: 150, y2: 205, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 158, y1: 58, x2: 158, y2: 205, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'line', x1: 166, y1: 66, x2: 166, y2: 208, stroke: '#22c55e', strokeWidth: 2 },
      { type: 'rect', x: 135, y: 205, width: 45, height: 30, fill: '#fff', stroke: '#22c55e', strokeWidth: 2, rx: 5 },
      { type: 'circle', cx: 148, cy: 220, r: 5, fill: '#374151' },
      { type: 'circle', cx: 168, cy: 220, r: 5, fill: '#374151' },
      { type: 'line', x1: 158, y1: 208, x2: 158, y2: 205, stroke: '#22c55e', strokeWidth: 2 },
      { type: 'text', x: 158, y: 245, text: 'OK (5cm)', fontSize: 8, textAnchor: 'middle', fill: '#22c55e' },

      // === PRISE 3 : Sans terre (ERREUR) ===
      { type: 'line', x1: 230, y1: 50, x2: 230, y2: 140, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 238, y1: 58, x2: 238, y2: 140, stroke: '#3b82f6', strokeWidth: 2 },
      // Pas de fil vert !
      { type: 'rect', x: 215, y: 140, width: 45, height: 30, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 5, id: 'erreur2' },
      { type: 'circle', cx: 228, cy: 155, r: 5, fill: '#374151' },
      { type: 'circle', cx: 248, cy: 155, r: 5, fill: '#374151' },
      // Pas de broche de terre visible !
      { type: 'text', x: 238, y: 135, text: 'Pas de PE!', fontSize: 8, textAnchor: 'middle', fill: '#dc2626', fontWeight: 'bold' },

      // === PRISE 4 : Fils visibles (ERREUR) ===
      { type: 'line', x1: 300, y1: 50, x2: 300, y2: 100, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 308, y1: 58, x2: 308, y2: 100, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'line', x1: 316, y1: 66, x2: 316, y2: 100, stroke: '#22c55e', strokeWidth: 2 },
      // Fils qui sortent du mur et vont vers la prise
      { type: 'line', x1: 300, y1: 100, x2: 295, y2: 130, stroke: '#ef4444', strokeWidth: 3 },
      { type: 'line', x1: 308, y1: 100, x2: 308, y2: 130, stroke: '#3b82f6', strokeWidth: 3 },
      { type: 'line', x1: 316, y1: 100, x2: 320, y2: 130, stroke: '#22c55e', strokeWidth: 3 },
      { type: 'rect', x: 290, y: 130, width: 45, height: 30, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 5, id: 'erreur3' },
      { type: 'circle', cx: 303, cy: 145, r: 5, fill: '#374151' },
      { type: 'circle', cx: 323, cy: 145, r: 5, fill: '#374151' },
      { type: 'line', x1: 313, y1: 133, x2: 313, y2: 130, stroke: '#22c55e', strokeWidth: 2 },
      { type: 'text', x: 312, y: 95, text: 'Fils nus!', fontSize: 8, textAnchor: 'middle', fill: '#dc2626', fontWeight: 'bold' },

      // === PRISE 5 : Multiprise en cascade (ERREUR) ===
      { type: 'line', x1: 360, y1: 50, x2: 360, y2: 175, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'line', x1: 368, y1: 58, x2: 368, y2: 175, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'line', x1: 376, y1: 66, x2: 376, y2: 178, stroke: '#22c55e', strokeWidth: 2 },
      { type: 'rect', x: 345, y: 175, width: 45, height: 30, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 5, id: 'erreur4' },
      { type: 'circle', cx: 358, cy: 190, r: 5, fill: '#374151' },
      { type: 'circle', cx: 378, cy: 190, r: 5, fill: '#374151' },
      { type: 'line', x1: 368, y1: 178, x2: 368, y2: 175, stroke: '#22c55e', strokeWidth: 2 },
      // Multiprise 1
      { type: 'rect', x: 330, y: 210, width: 60, height: 15, fill: '#e5e7eb', stroke: '#9ca3af', rx: 3 },
      { type: 'line', x1: 368, y1: 205, x2: 368, y2: 210, stroke: '#374151', strokeWidth: 3 },
      { type: 'circle', cx: 343, cy: 217, r: 3, fill: '#374151' },
      { type: 'circle', cx: 353, cy: 217, r: 3, fill: '#374151' },
      { type: 'circle', cx: 363, cy: 217, r: 3, fill: '#374151' },
      { type: 'circle', cx: 373, cy: 217, r: 3, fill: '#374151' },
      { type: 'circle', cx: 383, cy: 217, r: 3, fill: '#374151' },
      // Multiprise 2 (cascade)
      { type: 'rect', x: 335, y: 235, width: 55, height: 12, fill: '#e5e7eb', stroke: '#9ca3af', rx: 3 },
      { type: 'line', x1: 355, y1: 225, x2: 355, y2: 235, stroke: '#374151', strokeWidth: 2 },
      { type: 'text', x: 360, y: 260, text: 'Cascade!', fontSize: 8, textAnchor: 'middle', fill: '#dc2626', fontWeight: 'bold' },

      // Légende
      { type: 'rect', x: 100, y: 85, width: 100, height: 50, fill: '#ecfdf5', stroke: '#22c55e', rx: 4 },
      { type: 'text', x: 150, y: 98, text: 'NF C 15-100', fontSize: 8, fontWeight: 'bold', textAnchor: 'middle' },
      { type: 'text', x: 150, y: 112, text: '• Hauteur ≥ 5cm', fontSize: 7, textAnchor: 'middle' },
      { type: 'text', x: 150, y: 124, text: '• Terre obligatoire', fontSize: 7, textAnchor: 'middle' },
    ],
    erreurs: [
      {
        id: 'erreur1',
        zone: { x: 55, y: 248, width: 45, height: 37 },
        titre: 'Prise trop près du sol',
        explication: 'La hauteur minimale d\'une prise est de 5cm (axe à 12cm) par rapport au sol fini. Ici elle est à 1cm.',
        correction: 'Rehausser la prise à minimum 5cm du sol'
      },
      {
        id: 'erreur2',
        zone: { x: 215, y: 140, width: 45, height: 30 },
        titre: 'Prise sans terre',
        explication: 'Toutes les prises 2P+T doivent avoir une broche de terre fonctionnelle et raccordée au conducteur de protection.',
        correction: 'Remplacer par une prise avec terre et raccorder le PE'
      },
      {
        id: 'erreur3',
        zone: { x: 290, y: 95, width: 50, height: 70 },
        titre: 'Fils dénudés visibles',
        explication: 'Les conducteurs ne doivent jamais être visibles ou accessibles. Risque d\'électrocution et de court-circuit.',
        correction: 'Repousser les fils dans le boîtier, utiliser une boîte adaptée'
      },
      {
        id: 'erreur4',
        zone: { x: 330, y: 175, width: 65, height: 90 },
        titre: 'Multiprises en cascade',
        explication: 'Le branchement de multiprises en série (cascade) est interdit. Risque de surcharge et d\'incendie.',
        correction: 'Installer des prises supplémentaires fixes'
      }
    ]
  },
  {
    id: 'simple-allumage-erreurs',
    titre: 'Circuit éclairage',
    description: 'Ce montage simple allumage contient des erreurs de câblage.',
    difficulte: 1,
    dureeEstimee: '3 min',
    icon: '💡',
    nbErreurs: 3,
    viewBox: '0 0 400 280',
    elements: [
      // Titre
      { type: 'text', x: 200, y: 18, text: 'MONTAGE SIMPLE ALLUMAGE', fontSize: 13, fontWeight: 'bold', textAnchor: 'middle' },

      // Zone tableau
      { type: 'rect', x: 20, y: 40, width: 80, height: 120, fill: '#f3f4f6', stroke: '#374151', strokeWidth: 2 },
      { type: 'text', x: 60, y: 55, text: 'TABLEAU', fontSize: 8, textAnchor: 'middle', fontWeight: 'bold' },

      // Disjoncteur
      { type: 'rect', x: 35, y: 65, width: 50, height: 40, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 3 },
      { type: 'text', x: 60, y: 80, text: 'Disj', fontSize: 8, textAnchor: 'middle' },
      { type: 'text', x: 60, y: 92, text: '10A', fontSize: 9, textAnchor: 'middle', fontWeight: 'bold' },

      // Bornes de sortie disjoncteur
      { type: 'circle', cx: 50, cy: 105, r: 5, fill: '#ef4444', stroke: '#374151' },
      { type: 'text', x: 50, y: 118, text: 'L', fontSize: 7, textAnchor: 'middle' },
      { type: 'circle', cx: 70, cy: 105, r: 5, fill: '#3b82f6', stroke: '#374151' },
      { type: 'text', x: 70, y: 118, text: 'N', fontSize: 7, textAnchor: 'middle' },

      // Borne de terre tableau
      { type: 'rect', x: 35, y: 130, width: 50, height: 15, fill: '#22c55e', stroke: '#15803d', rx: 2 },
      { type: 'text', x: 60, y: 140, text: 'PE', fontSize: 7, textAnchor: 'middle', fill: '#fff' },

      // Zone mur/pièce
      { type: 'rect', x: 120, y: 40, width: 260, height: 200, fill: '#fef3c7', stroke: '#d97706', strokeWidth: 2 },
      { type: 'text', x: 250, y: 55, text: 'PIÈCE', fontSize: 10, textAnchor: 'middle', fill: '#92400e' },

      // === CÂBLAGE ===
      // Phase du disjoncteur vers l'interrupteur (CORRECT)
      { type: 'line', x1: 50, y1: 105, x2: 50, y2: 130, stroke: '#ef4444', strokeWidth: 3 },
      { type: 'line', x1: 50, y1: 130, x2: 100, y2: 130, stroke: '#ef4444', strokeWidth: 3 },
      { type: 'line', x1: 100, y1: 130, x2: 150, y2: 130, stroke: '#ef4444', strokeWidth: 3 },

      // Interrupteur
      { type: 'rect', x: 150, y: 110, width: 40, height: 50, fill: '#fff', stroke: '#374151', strokeWidth: 2, rx: 4 },
      { type: 'circle', cx: 170, cy: 135, r: 12, fill: '#f3f4f6', stroke: '#374151', strokeWidth: 2 },
      { type: 'text', x: 170, y: 165, text: 'Inter', fontSize: 8, textAnchor: 'middle' },
      // Bornes interrupteur
      { type: 'circle', cx: 155, cy: 115, r: 4, fill: '#ef4444', stroke: '#374151' },
      { type: 'text', x: 155, y: 108, text: 'L', fontSize: 6, textAnchor: 'middle' },
      { type: 'circle', cx: 185, cy: 115, r: 4, fill: '#f97316', stroke: '#374151' },
      { type: 'text', x: 185, y: 108, text: '1', fontSize: 6, textAnchor: 'middle' },

      // Fil phase vers borne L de l'inter
      { type: 'line', x1: 150, y1: 130, x2: 150, y2: 115, stroke: '#ef4444', strokeWidth: 3 },
      { type: 'line', x1: 150, y1: 115, x2: 155, y2: 115, stroke: '#ef4444', strokeWidth: 3 },

      // ERREUR 1: Retour lampe en BLEU au lieu d'orange
      { type: 'line', x1: 185, y1: 115, x2: 210, y2: 115, stroke: '#3b82f6', strokeWidth: 3, id: 'erreur1' },
      { type: 'line', x1: 210, y1: 115, x2: 210, y2: 80, stroke: '#3b82f6', strokeWidth: 3 },
      { type: 'line', x1: 210, y1: 80, x2: 290, y2: 80, stroke: '#3b82f6', strokeWidth: 3 },
      { type: 'text', x: 250, y: 75, text: 'Bleu = Retour?', fontSize: 7, fill: '#dc2626' },

      // Lampe
      { type: 'circle', cx: 320, cy: 100, r: 30, fill: '#fef9c3', stroke: '#eab308', strokeWidth: 3 },
      { type: 'line', x1: 305, y1: 85, x2: 335, y2: 115, stroke: '#374151', strokeWidth: 2 },
      { type: 'line', x1: 335, y1: 85, x2: 305, y2: 115, stroke: '#374151', strokeWidth: 2 },
      { type: 'text', x: 320, y: 140, text: 'LAMPE', fontSize: 9, textAnchor: 'middle', fontWeight: 'bold' },
      // Bornes lampe
      { type: 'circle', cx: 300, cy: 90, r: 4, fill: '#f97316', stroke: '#374151' },
      { type: 'circle', cx: 340, cy: 90, r: 4, fill: '#3b82f6', stroke: '#374151' },

      // Fil retour vers lampe
      { type: 'line', x1: 290, y1: 80, x2: 290, y2: 90, stroke: '#3b82f6', strokeWidth: 3 },
      { type: 'line', x1: 290, y1: 90, x2: 300, y2: 90, stroke: '#3b82f6', strokeWidth: 3 },

      // ERREUR 2: Neutre passant par l'interrupteur au lieu d'aller direct
      { type: 'line', x1: 70, y1: 105, x2: 70, y2: 180, stroke: '#3b82f6', strokeWidth: 3, id: 'erreur2' },
      { type: 'line', x1: 70, y1: 180, x2: 170, y2: 180, stroke: '#3b82f6', strokeWidth: 3 },
      { type: 'line', x1: 170, y1: 160, x2: 170, y2: 180, stroke: '#3b82f6', strokeWidth: 3 },
      { type: 'text', x: 120, y: 195, text: 'N passe par inter?', fontSize: 7, fill: '#dc2626' },

      // Neutre devrait aller direct à la lampe
      { type: 'line', x1: 170, y1: 180, x2: 340, y2: 180, stroke: '#3b82f6', strokeWidth: 3 },
      { type: 'line', x1: 340, y1: 180, x2: 340, y2: 90, stroke: '#3b82f6', strokeWidth: 3 },

      // ERREUR 3: Pas de terre visible
      { type: 'text', x: 320, y: 160, text: 'Pas de PE!', fontSize: 8, fill: '#dc2626', textAnchor: 'middle', id: 'erreur3' },

      // Légende
      { type: 'rect', x: 130, y: 200, width: 150, height: 35, fill: '#fff', stroke: '#9ca3af', rx: 4 },
      { type: 'text', x: 205, y: 213, text: 'Couleurs normatives', fontSize: 8, fontWeight: 'bold', textAnchor: 'middle' },
      { type: 'line', x1: 140, y1: 225, x2: 155, y2: 225, stroke: '#ef4444', strokeWidth: 2 },
      { type: 'text', x: 160, y: 228, text: 'L', fontSize: 7 },
      { type: 'line', x1: 175, y1: 225, x2: 190, y2: 225, stroke: '#3b82f6', strokeWidth: 2 },
      { type: 'text', x: 195, y: 228, text: 'N', fontSize: 7 },
      { type: 'line', x1: 210, y1: 225, x2: 225, y2: 225, stroke: '#f97316', strokeWidth: 2 },
      { type: 'text', x: 230, y: 228, text: 'Ret.', fontSize: 7 },
      { type: 'line', x1: 245, y1: 225, x2: 260, y2: 225, stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '3 2' },
      { type: 'text', x: 265, y: 228, text: 'PE', fontSize: 7 },
    ],
    erreurs: [
      {
        id: 'erreur1',
        zone: { x: 185, y: 70, width: 110, height: 50 },
        titre: 'Retour lampe en bleu',
        explication: 'Le fil de retour lampe doit être de couleur ORANGE (ou toute couleur sauf bleu, vert-jaune). Le bleu est réservé au neutre.',
        correction: 'Utiliser un fil orange, violet ou marron pour le retour lampe'
      },
      {
        id: 'erreur2',
        zone: { x: 70, y: 155, width: 110, height: 45 },
        titre: 'Neutre passant par l\'interrupteur',
        explication: 'Le neutre doit aller DIRECTEMENT à la lampe sans passer par l\'interrupteur. Seule la phase doit être coupée.',
        correction: 'Câbler le neutre en direct du tableau vers la lampe'
      },
      {
        id: 'erreur3',
        zone: { x: 290, y: 145, width: 70, height: 25 },
        titre: 'Absence de conducteur de protection',
        explication: 'Même pour un circuit d\'éclairage, le conducteur PE (terre) doit être présent pour la sécurité.',
        correction: 'Ajouter un fil vert-jaune du bornier terre vers le DCL'
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
