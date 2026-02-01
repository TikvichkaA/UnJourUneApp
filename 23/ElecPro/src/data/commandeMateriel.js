// Module Aide a la Commande de Materiel

// Outils necessaires par type de chantier
export const outilsParChantier = {
  base: {
    titre: 'Outillage de base',
    outils: [
      { nom: 'Tournevis isolés (plat + cruciforme)', obligatoire: true },
      { nom: 'Pince coupante diagonale', obligatoire: true },
      { nom: 'Pince à dénuder', obligatoire: true },
      { nom: 'Pince universelle', obligatoire: true },
      { nom: 'Multimètre', obligatoire: true },
      { nom: 'VAT (Vérificateur d\'Absence de Tension)', obligatoire: true },
      { nom: 'Mètre ruban 5m', obligatoire: true },
      { nom: 'Niveau à bulle', obligatoire: true },
      { nom: 'Crayon + marqueur', obligatoire: true },
      { nom: 'Lampe frontale', obligatoire: false }
    ]
  },
  renovation: {
    titre: 'Rénovation électrique',
    outils: [
      { nom: 'Détecteur de câbles/métaux', obligatoire: true },
      { nom: 'Aiguille tire-fil 10-20m', obligatoire: true },
      { nom: 'Lubrifiant pour gaines', obligatoire: false },
      { nom: 'Scie cloche (67mm)', obligatoire: true },
      { nom: 'Perceuse + forêts béton', obligatoire: true },
      { nom: 'Burin + massette', obligatoire: false },
      { nom: 'Rainureuse (si saignées)', obligatoire: false },
      { nom: 'Aspirateur de chantier', obligatoire: false }
    ]
  },
  neuf: {
    titre: 'Construction neuve',
    outils: [
      { nom: 'Dérouleur de câble', obligatoire: true },
      { nom: 'Pince à sertir embouts', obligatoire: true },
      { nom: 'Agrafeuse murale isolée', obligatoire: true },
      { nom: 'Niveau laser', obligatoire: false },
      { nom: 'Visseuse sans fil', obligatoire: true },
      { nom: 'Scie à métaux', obligatoire: true },
      { nom: 'Coupe-tube (pour gaines)', obligatoire: false }
    ]
  },
  tableau: {
    titre: 'Travaux sur tableau',
    outils: [
      { nom: 'Tournevis dynamométrique', obligatoire: false },
      { nom: 'Pince à becs longs', obligatoire: true },
      { nom: 'Jeu de clés Allen', obligatoire: true },
      { nom: 'Peigne de câblage', obligatoire: false },
      { nom: 'Étiqueteuse', obligatoire: false },
      { nom: 'Appareil de test de DDR', obligatoire: false },
      { nom: 'Caméra thermique', obligatoire: false }
    ]
  },
  courantsFaibles: {
    titre: 'Courants faibles',
    outils: [
      { nom: 'Pince à sertir RJ45', obligatoire: true },
      { nom: 'Testeur de câbles RJ45', obligatoire: true },
      { nom: 'Dénudeur de câble coaxial', obligatoire: false },
      { nom: 'Pince à dénuder AWG', obligatoire: true },
      { nom: 'Fer à souder + étain', obligatoire: false },
      { nom: 'Pistolet à colle chaude', obligatoire: false },
      { nom: 'Colliers Rilsan', obligatoire: true }
    ]
  },
  epi: {
    titre: 'EPI (Équipements de Protection)',
    outils: [
      { nom: 'Gants isolants', obligatoire: true },
      { nom: 'Lunettes de protection', obligatoire: true },
      { nom: 'Chaussures de sécurité', obligatoire: true },
      { nom: 'Casque (si travail en hauteur)', obligatoire: false },
      { nom: 'Tapis isolant', obligatoire: false },
      { nom: 'Écran facial (si risque arc)', obligatoire: false }
    ]
  }
}

// Fonction pour obtenir les outils selon le type de chantier
export function getOutilsRecommandes(typeChantier) {
  const outils = [outilsParChantier.base, outilsParChantier.epi]

  if (typeChantier.includes('renovation') || typeChantier.includes('extension')) {
    outils.push(outilsParChantier.renovation)
  }
  if (typeChantier.includes('neuf')) {
    outils.push(outilsParChantier.neuf)
  }
  if (typeChantier.includes('mise-normes')) {
    outils.push(outilsParChantier.tableau)
  }

  return outils
}

export const typesChantiers = [
  { id: 'renovation-studio', nom: 'Renovation studio/T1',
    defauts: { prises: 8, eclairages: 4, specialises: 3, longueurMoyenne: 15 } },
  { id: 'renovation-t2', nom: 'Renovation T2',
    defauts: { prises: 12, eclairages: 6, specialises: 4, longueurMoyenne: 18 } },
  { id: 'renovation-t3', nom: 'Renovation T3',
    defauts: { prises: 16, eclairages: 8, specialises: 5, longueurMoyenne: 20 } },
  { id: 'renovation-t4', nom: 'Renovation T4+',
    defauts: { prises: 22, eclairages: 12, specialises: 6, longueurMoyenne: 25 } },
  { id: 'neuf-t2', nom: 'Neuf T2',
    defauts: { prises: 14, eclairages: 7, specialises: 5, longueurMoyenne: 20 } },
  { id: 'neuf-t3', nom: 'Neuf T3',
    defauts: { prises: 20, eclairages: 10, specialises: 6, longueurMoyenne: 25 } },
  { id: 'neuf-maison', nom: 'Maison individuelle',
    defauts: { prises: 30, eclairages: 15, specialises: 8, longueurMoyenne: 30 } },
  { id: 'mise-normes', nom: 'Mise aux normes',
    defauts: { prises: 0, eclairages: 0, specialises: 2, longueurMoyenne: 10 } },
  { id: 'extension', nom: 'Extension / piece',
    defauts: { prises: 4, eclairages: 2, specialises: 1, longueurMoyenne: 12 } }
]

export const categoriesMateriel = [
  { id: 'cables', nom: 'Cables et fils', icon: '🔌' },
  { id: 'protection', nom: 'Protections', icon: '🛡️' },
  { id: 'appareillage', nom: 'Appareillage', icon: '🔲' },
  { id: 'tableau', nom: 'Tableau', icon: '📦' },
  { id: 'divers', nom: 'Divers', icon: '🔧' }
]

export const materiaux = [
  // CABLES
  {
    id: 'cable-1.5-rouge',
    nom: 'H07VU 1,5mm² rouge (phase)',
    categorie: 'cables',
    unite: 'm',
    prixMin: 0.12,
    prixMax: 0.25,
    calcul: (params) => Math.ceil(params.eclairages * params.longueurMoyenne * 1.2)
  },
  {
    id: 'cable-1.5-bleu',
    nom: 'H07VU 1,5mm² bleu (neutre)',
    categorie: 'cables',
    unite: 'm',
    prixMin: 0.12,
    prixMax: 0.25,
    calcul: (params) => Math.ceil(params.eclairages * params.longueurMoyenne * 1.2)
  },
  {
    id: 'cable-1.5-vj',
    nom: 'H07VU 1,5mm² vert/jaune (terre)',
    categorie: 'cables',
    unite: 'm',
    prixMin: 0.12,
    prixMax: 0.25,
    calcul: (params) => Math.ceil(params.eclairages * params.longueurMoyenne * 1.2)
  },
  {
    id: 'cable-2.5-rouge',
    nom: 'H07VU 2,5mm² rouge (phase)',
    categorie: 'cables',
    unite: 'm',
    prixMin: 0.20,
    prixMax: 0.40,
    calcul: (params) => Math.ceil(params.prises * params.longueurMoyenne * 1.2)
  },
  {
    id: 'cable-2.5-bleu',
    nom: 'H07VU 2,5mm² bleu (neutre)',
    categorie: 'cables',
    unite: 'm',
    prixMin: 0.20,
    prixMax: 0.40,
    calcul: (params) => Math.ceil(params.prises * params.longueurMoyenne * 1.2)
  },
  {
    id: 'cable-2.5-vj',
    nom: 'H07VU 2,5mm² vert/jaune (terre)',
    categorie: 'cables',
    unite: 'm',
    prixMin: 0.20,
    prixMax: 0.40,
    calcul: (params) => Math.ceil(params.prises * params.longueurMoyenne * 1.2)
  },
  {
    id: 'cable-6',
    nom: 'H07VU 6mm² (plaque/four)',
    categorie: 'cables',
    unite: 'm',
    prixMin: 0.80,
    prixMax: 1.50,
    calcul: (params) => params.specialises >= 2 ? Math.ceil(params.longueurMoyenne * 2) : 0
  },
  {
    id: 'gaine-icta-16',
    nom: 'Gaine ICTA 16mm',
    categorie: 'cables',
    unite: 'm',
    prixMin: 0.30,
    prixMax: 0.60,
    calcul: (params) => Math.ceil(params.eclairages * params.longueurMoyenne)
  },
  {
    id: 'gaine-icta-20',
    nom: 'Gaine ICTA 20mm',
    categorie: 'cables',
    unite: 'm',
    prixMin: 0.40,
    prixMax: 0.80,
    calcul: (params) => Math.ceil(params.prises * params.longueurMoyenne)
  },

  // PROTECTIONS
  {
    id: 'ddr-40a-30ma',
    nom: 'Inter diff 40A 30mA Type AC',
    categorie: 'protection',
    unite: 'piece',
    prixMin: 35,
    prixMax: 70,
    calcul: (params) => Math.max(2, Math.ceil((params.prises + params.eclairages) / 12))
  },
  {
    id: 'ddr-63a-30ma',
    nom: 'Inter diff 63A 30mA Type A',
    categorie: 'protection',
    unite: 'piece',
    prixMin: 55,
    prixMax: 100,
    calcul: (params) => params.specialises >= 3 ? 1 : 0
  },
  {
    id: 'disj-10a',
    nom: 'Disjoncteur 10A (eclairage)',
    categorie: 'protection',
    unite: 'piece',
    prixMin: 6,
    prixMax: 15,
    calcul: (params) => Math.ceil(params.eclairages / 8)
  },
  {
    id: 'disj-16a',
    nom: 'Disjoncteur 16A (prises)',
    categorie: 'protection',
    unite: 'piece',
    prixMin: 6,
    prixMax: 15,
    calcul: (params) => Math.ceil(params.prises / 8)
  },
  {
    id: 'disj-20a',
    nom: 'Disjoncteur 20A (specialise)',
    categorie: 'protection',
    unite: 'piece',
    prixMin: 7,
    prixMax: 16,
    calcul: (params) => Math.max(0, params.specialises - 1)
  },
  {
    id: 'disj-32a',
    nom: 'Disjoncteur 32A (plaque)',
    categorie: 'protection',
    unite: 'piece',
    prixMin: 10,
    prixMax: 22,
    calcul: (params) => params.specialises >= 2 ? 1 : 0
  },
  {
    id: 'disj-2a',
    nom: 'Disjoncteur 2A (VMC)',
    categorie: 'protection',
    unite: 'piece',
    prixMin: 8,
    prixMax: 18,
    calcul: (params) => params.specialises >= 1 ? 1 : 0
  },

  // APPAREILLAGE
  {
    id: 'prise-2pt',
    nom: 'Prise 2P+T 16A',
    categorie: 'appareillage',
    unite: 'piece',
    prixMin: 3,
    prixMax: 12,
    calcul: (params) => params.prises
  },
  {
    id: 'inter-simple',
    nom: 'Interrupteur simple allumage',
    categorie: 'appareillage',
    unite: 'piece',
    prixMin: 4,
    prixMax: 15,
    calcul: (params) => Math.ceil(params.eclairages * 0.6)
  },
  {
    id: 'inter-vv',
    nom: 'Interrupteur va-et-vient',
    categorie: 'appareillage',
    unite: 'piece',
    prixMin: 5,
    prixMax: 18,
    calcul: (params) => Math.ceil(params.eclairages * 0.3) * 2
  },
  {
    id: 'dcl',
    nom: 'Douille DCL + fiche',
    categorie: 'appareillage',
    unite: 'piece',
    prixMin: 3,
    prixMax: 8,
    calcul: (params) => params.eclairages
  },
  {
    id: 'boite-encastr',
    nom: 'Boite d\'encastrement',
    categorie: 'appareillage',
    unite: 'piece',
    prixMin: 0.50,
    prixMax: 2,
    calcul: (params) => params.prises + params.eclairages
  },
  {
    id: 'boite-deriv',
    nom: 'Boite de derivation',
    categorie: 'appareillage',
    unite: 'piece',
    prixMin: 2,
    prixMax: 6,
    calcul: (params) => Math.ceil((params.prises + params.eclairages) / 4)
  },

  // TABLEAU
  {
    id: 'coffret-1r',
    nom: 'Coffret 1 rangee 13 modules',
    categorie: 'tableau',
    unite: 'piece',
    prixMin: 15,
    prixMax: 40,
    calcul: (params) => {
      const modules = Math.ceil((params.prises + params.eclairages) / 8) + params.specialises + 4
      return modules <= 13 ? 1 : 0
    }
  },
  {
    id: 'coffret-2r',
    nom: 'Coffret 2 rangees 26 modules',
    categorie: 'tableau',
    unite: 'piece',
    prixMin: 25,
    prixMax: 60,
    calcul: (params) => {
      const modules = Math.ceil((params.prises + params.eclairages) / 8) + params.specialises + 4
      return modules > 13 && modules <= 26 ? 1 : 0
    }
  },
  {
    id: 'coffret-3r',
    nom: 'Coffret 3 rangees 39 modules',
    categorie: 'tableau',
    unite: 'piece',
    prixMin: 40,
    prixMax: 90,
    calcul: (params) => {
      const modules = Math.ceil((params.prises + params.eclairages) / 8) + params.specialises + 4
      return modules > 26 ? 1 : 0
    }
  },
  {
    id: 'peigne-h',
    nom: 'Peigne horizontal 13 modules',
    categorie: 'tableau',
    unite: 'piece',
    prixMin: 8,
    prixMax: 20,
    calcul: (params) => {
      const modules = Math.ceil((params.prises + params.eclairages) / 8) + params.specialises + 4
      return Math.ceil(modules / 13)
    }
  },
  {
    id: 'bornier-terre',
    nom: 'Bornier de terre',
    categorie: 'tableau',
    unite: 'piece',
    prixMin: 5,
    prixMax: 15,
    calcul: () => 1
  },

  // DIVERS
  {
    id: 'connecteur-wago',
    nom: 'Connecteurs Wago (boite 50)',
    categorie: 'divers',
    unite: 'boite',
    prixMin: 15,
    prixMax: 30,
    calcul: (params) => Math.ceil((params.prises + params.eclairages) / 25)
  },
  {
    id: 'colliers',
    nom: 'Colliers de fixation (100)',
    categorie: 'divers',
    unite: 'sachet',
    prixMin: 5,
    prixMax: 12,
    calcul: (params) => Math.ceil((params.prises + params.eclairages) * params.longueurMoyenne / 200)
  },
  {
    id: 'chevilles',
    nom: 'Chevilles + vis (boite)',
    categorie: 'divers',
    unite: 'boite',
    prixMin: 8,
    prixMax: 18,
    calcul: (params) => Math.ceil((params.prises + params.eclairages) / 20)
  }
]

export function calculerDevis(params) {
  const lignes = materiaux.map(m => {
    const quantite = m.calcul(params)
    return {
      ...m,
      quantite,
      prixMinTotal: quantite * m.prixMin,
      prixMaxTotal: quantite * m.prixMax
    }
  }).filter(l => l.quantite > 0)

  const parCategorie = {}
  categoriesMateriel.forEach(cat => {
    parCategorie[cat.id] = lignes.filter(l => l.categorie === cat.id)
  })

  const totalMin = lignes.reduce((s, l) => s + l.prixMinTotal, 0)
  const totalMax = lignes.reduce((s, l) => s + l.prixMaxTotal, 0)

  return {
    lignes,
    parCategorie,
    totalMin: Math.round(totalMin),
    totalMax: Math.round(totalMax)
  }
}

export function genererTexte(params, devis) {
  let texte = `LISTE DE MATERIEL - ${new Date().toLocaleDateString('fr-FR')}\n`
  texte += `================================================\n\n`
  texte += `Configuration:\n`
  texte += `- Prises: ${params.prises}\n`
  texte += `- Points lumineux: ${params.eclairages}\n`
  texte += `- Circuits specialises: ${params.specialises}\n`
  texte += `- Longueur moyenne: ${params.longueurMoyenne}m\n\n`

  categoriesMateriel.forEach(cat => {
    const items = devis.parCategorie[cat.id]
    if (items && items.length > 0) {
      texte += `${cat.icon} ${cat.nom.toUpperCase()}\n`
      texte += `---------------------------------\n`
      items.forEach(item => {
        texte += `${item.nom}: ${item.quantite} ${item.unite}\n`
      })
      texte += `\n`
    }
  })

  texte += `================================================\n`
  texte += `ESTIMATION: ${devis.totalMin}€ - ${devis.totalMax}€\n`
  texte += `(prix indicatifs, hors pose)\n`

  return texte
}
