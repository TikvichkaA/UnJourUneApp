// Module Securite ERP et Alimentation de Secours

export const erpCategories = [
  { id: 'types-erp', nom: 'Types d\'ERP', icon: '🏢', color: 'slate',
    description: 'Categories et classement des etablissements' },
  { id: 'baes', nom: 'BAES / BAEH', icon: '🚨', color: 'green',
    description: 'Blocs Autonomes d\'Eclairage de Securite' },
  { id: 'ssi', nom: 'SSI', icon: '🔔', color: 'red',
    description: 'Systeme de Securite Incendie' },
  { id: 'eclairage-secu', nom: 'Eclairage de securite', icon: '💡', color: 'yellow',
    description: 'Evacuation, ambiance, anti-panique' },
  { id: 'onduleur', nom: 'Onduleurs (UPS)', icon: '🔋', color: 'blue',
    description: 'Alimentation sans interruption' },
  { id: 'groupe', nom: 'Groupes electrogenes', icon: '⚡', color: 'amber',
    description: 'Alimentation de secours' }
]

export const erpFiches = {
  'types-erp': {
    titre: 'Classification des ERP',
    intro: 'Les Etablissements Recevant du Public (ERP) sont classes par type d\'activite et par categorie selon leur capacite d\'accueil.',
    sections: [
      {
        titre: 'Types d\'ERP',
        contenu: [
          { code: 'J', nom: 'Structures d\'accueil pour personnes agees ou handicapees' },
          { code: 'L', nom: 'Salles de spectacles, conferences, reunions' },
          { code: 'M', nom: 'Magasins, centres commerciaux' },
          { code: 'N', nom: 'Restaurants, debits de boissons' },
          { code: 'O', nom: 'Hotels, pensions de famille' },
          { code: 'P', nom: 'Salles de danse, salles de jeux' },
          { code: 'R', nom: 'Etablissements d\'enseignement' },
          { code: 'S', nom: 'Bibliotheques, centres de documentation' },
          { code: 'T', nom: 'Salles d\'expositions' },
          { code: 'U', nom: 'Etablissements sanitaires' },
          { code: 'V', nom: 'Etablissements de culte' },
          { code: 'W', nom: 'Administrations, banques, bureaux' },
          { code: 'X', nom: 'Etablissements sportifs couverts' },
          { code: 'Y', nom: 'Musees' }
        ]
      },
      {
        titre: 'Categories d\'ERP',
        contenu: [
          { categorie: '1ere', effectif: '> 1500 personnes', obligations: 'Commission de securite, registre, exercices' },
          { categorie: '2eme', effectif: '701 a 1500 personnes', obligations: 'Commission de securite, registre' },
          { categorie: '3eme', effectif: '301 a 700 personnes', obligations: 'Visite periodique' },
          { categorie: '4eme', effectif: '≤ 300 personnes', obligations: 'Visite periodique' },
          { categorie: '5eme', effectif: 'Sous les seuils', obligations: 'Regles simplifiees' }
        ]
      },
      {
        titre: 'Obligations electriques',
        regles: [
          'Verification initiale avant ouverture',
          'Verification periodique annuelle',
          'Registre de securite a jour',
          'Maintenance des installations de securite',
          'Formation du personnel'
        ]
      }
    ],
    quiz: [
      { question: 'Un magasin est de type?', options: ['L', 'M', 'N'], correct: 1 },
      { question: 'La 1ere categorie accueille plus de?', options: ['700', '1000', '1500'], correct: 2 }
    ]
  },

  'baes': {
    titre: 'BAES - Blocs Autonomes d\'Eclairage de Securite',
    intro: 'L\'eclairage de securite est obligatoire dans les ERP et les batiments d\'habitation. Il permet l\'evacuation sure des occupants et l\'intervention des secours.',
    sections: [
      {
        titre: 'Types de BAES',
        contenu: [
          { type: 'BAES d\'evacuation', autonomie: '1 heure', flux: '45 lumens mini', usage: 'Signalisation des sorties et cheminements', norme: 'NF C 71-800' },
          { type: 'BAES d\'ambiance', autonomie: '1 heure', flux: '5 lm/m2 mini', usage: 'Eclairage anti-panique des grandes surfaces', norme: 'NF C 71-800' },
          { type: 'BAEH', autonomie: '5 heures', flux: '8 lumens mini', usage: 'Etablissements de soins (hopitaux)', norme: 'NF C 71-805' },
          { type: 'BAES + BAEH', autonomie: '1h + 5h', flux: 'Variable', usage: 'Etablissements de soins avec evacuation', norme: 'Cumul' }
        ]
      },
      {
        titre: 'Implantation',
        regles: [
          'A chaque sortie et issue de secours',
          'A chaque changement de direction',
          'A chaque changement de niveau (escaliers)',
          'A chaque obstacle',
          'Tous les 15 metres dans les circulations horizontales',
          'Au-dessus de chaque porte de sortie',
          'A proximite des equipements de securite (extincteurs, RIA)'
        ]
      },
      {
        titre: 'Installation',
        contenu: [
          { point: 'Hauteur', description: 'Entre 2m et 2,50m du sol, ou en saillie (plafond)' },
          { point: 'Alimentation', description: 'Circuit dedie depuis le tableau, cable resistant au feu' },
          { point: 'Telecommande', description: 'Obligatoire pour les tests, depuis un point central' },
          { point: 'SATI', description: 'Systeme Automatique de Test Integre recommande' }
        ]
      },
      {
        titre: 'Maintenance obligatoire',
        contenu: [
          { periode: 'Mensuel', action: 'Test de fonctionnement (telecommande ou SATI)' },
          { periode: 'Semestriel', action: 'Test d\'autonomie (1/2 autonomie nominale)' },
          { periode: 'Annuel', action: 'Test complet d\'autonomie, verification visuelle, registre' },
          { periode: '4 ans', action: 'Remplacement des batteries (si non SATI)' }
        ]
      }
    ],
    quiz: [
      { question: 'Quelle est l\'autonomie minimale d\'un BAES d\'evacuation?', options: ['30 minutes', '1 heure', '5 heures'], correct: 1 },
      { question: 'A quelle frequence le test de fonctionnement?', options: ['Hebdomadaire', 'Mensuel', 'Annuel'], correct: 1 },
      { question: 'L\'espacement max des BAES en circulation?', options: ['10m', '15m', '20m'], correct: 1 },
      { question: 'Quelle est l\'autonomie d\'un BAEH?', options: ['1 heure', '3 heures', '5 heures'], correct: 2 }
    ]
  },

  'ssi': {
    titre: 'SSI - Systeme de Securite Incendie',
    intro: 'Le SSI regroupe l\'ensemble des equipements de detection, d\'alarme et de mise en securite d\'un batiment contre l\'incendie.',
    sections: [
      {
        titre: 'Categories de SSI',
        contenu: [
          { categorie: 'A', description: 'SDI (detection automatique) + CMSI + SMSI complet', usage: 'ERP 1ere et 2eme categorie, IGH' },
          { categorie: 'B', description: 'SDI (detection automatique) + CMSI', usage: 'ERP selon type et categorie' },
          { categorie: 'C', description: 'CMSI seul (declenchement manuel)', usage: 'ERP petite capacite' },
          { categorie: 'D', description: 'Declencheurs manuels + diffuseurs sonores', usage: 'ERP 5eme categorie' },
          { categorie: 'E', description: 'Alarme generale selective', usage: 'Petits etablissements' }
        ]
      },
      {
        titre: 'Composants du SSI',
        contenu: [
          { composant: 'SDI', nom: 'Systeme de Detection Incendie', fonction: 'Detecteurs automatiques et manuels' },
          { composant: 'CMSI', nom: 'Centralisateur de Mise en Securite', fonction: 'Traitement des informations, commandes' },
          { composant: 'SMSI', nom: 'Systeme de Mise en Securite', fonction: 'Actionneurs: portes CF, desenfumage, coupures' },
          { composant: 'UAE', nom: 'Unite d\'Aide a l\'Exploitation', fonction: 'Interface operateur, visualisation' },
          { composant: 'DAS', nom: 'Dispositif Actionne de Securite', fonction: 'Porte CF, volet, exutoire, arret CTA' }
        ]
      },
      {
        titre: 'Types de detecteurs',
        contenu: [
          { type: 'Optique de fumee', principe: 'Diffusion de lumiere par particules', usage: 'Usage general, bureaux' },
          { type: 'Ionique', principe: 'Ionisation par particules (interdit depuis 2011)', usage: 'Remplace par optique' },
          { type: 'Thermique', principe: 'Elevation de temperature', usage: 'Cuisines, chaufferies' },
          { type: 'Thermoveloci', principe: 'Vitesse d\'elevation de temperature', usage: 'Locaux techniques' },
          { type: 'Flamme', principe: 'Rayonnement UV ou IR', usage: 'Stockage hydrocarbures' },
          { type: 'Lineaire', principe: 'Faisceau infrarouge coupe', usage: 'Grandes hauteurs, entrepots' }
        ]
      },
      {
        titre: 'Alarme',
        contenu: [
          { niveau: 'Alarme restreinte', description: 'Signal discret pour le personnel de securite' },
          { niveau: 'Alarme generale', description: 'Signal sonore pour evacuation de tous' },
          { niveau: 'Alarme generale selective', description: 'Evacuation par zones (hotels, hopitaux)' }
        ]
      }
    ],
    quiz: [
      { question: 'Un SSI de categorie A comprend?', options: ['CMSI seul', 'SDI + CMSI', 'SDI + CMSI + SMSI'], correct: 2 },
      { question: 'Quel detecteur en cuisine?', options: ['Optique', 'Thermique', 'Lineaire'], correct: 1 },
      { question: 'Que signifie DAS?', options: ['Detection Automatique', 'Dispositif Actionne de Securite', 'Declencheur Alarme'], correct: 1 }
    ]
  },

  'eclairage-secu': {
    titre: 'Eclairage de securite',
    intro: 'L\'eclairage de securite assure l\'evacuation des personnes et permet les interventions de secours en cas de defaillance de l\'eclairage normal.',
    sections: [
      {
        titre: 'Deux fonctions',
        contenu: [
          { fonction: 'Eclairage d\'evacuation', objectif: 'Permettre l\'evacuation sure', exigences: 'Balisage des sorties, 1 lux mini au sol' },
          { fonction: 'Eclairage d\'ambiance (anti-panique)', objectif: 'Eviter la panique dans les grands volumes', exigences: '5 lm/m2, eclairement uniforme' }
        ]
      },
      {
        titre: 'Technologies',
        contenu: [
          { techno: 'Blocs autonomes (BAES)', avantages: 'Installation simple, autonomie integree', inconvenients: 'Maintenance batteries' },
          { techno: 'Source centrale (LSC)', avantages: 'Centralisation, lampes standard', inconvenients: 'Installation plus complexe, cables resistant au feu' },
          { techno: 'LED', avantages: 'Duree de vie, faible consommation', inconvenients: 'Cout initial' }
        ]
      },
      {
        titre: 'Pictogrammes',
        contenu: [
          { picto: 'Fleche directionnelle', couleur: 'Vert sur blanc', usage: 'Indication du sens d\'evacuation' },
          { picto: 'Sortie de secours', couleur: 'Vert sur blanc', usage: 'Signalisation des issues' },
          { picto: 'Escalier', couleur: 'Vert sur blanc', usage: 'Acces aux degagements' }
        ]
      },
      {
        titre: 'Normes applicables',
        regles: [
          'NF C 71-800 : BAES',
          'NF C 71-801 : Regles d\'installation',
          'NF EN 1838 : Eclairage de secours',
          'NF EN 60598-2-22 : Luminaires pour eclairage de secours'
        ]
      }
    ],
    quiz: [
      { question: 'L\'eclairage d\'evacuation doit assurer au sol?', options: ['0.5 lux', '1 lux', '5 lux'], correct: 1 },
      { question: 'L\'eclairage d\'ambiance doit assurer?', options: ['1 lm/m2', '5 lm/m2', '10 lm/m2'], correct: 1 }
    ]
  },

  'onduleur': {
    titre: 'Onduleurs (UPS)',
    intro: 'L\'onduleur (Uninterruptible Power Supply) assure la continuite d\'alimentation des equipements sensibles en cas de coupure secteur.',
    sections: [
      {
        titre: 'Types d\'onduleurs',
        contenu: [
          { type: 'Off-line (standby)', principe: 'Commute sur batterie en cas de coupure', temps: '5-12ms', usage: 'PC, petite bureautique', avantages: 'Economique', inconvenients: 'Temps de commutation' },
          { type: 'Line-interactive', principe: 'Regulation AVR + batterie', temps: '2-4ms', usage: 'Serveurs, reseaux', avantages: 'Bon compromis', inconvenients: 'Temps de commutation' },
          { type: 'On-line (double conversion)', principe: 'Charge permanente batteries, onduleur permanent', temps: '0ms', usage: 'Datacenter, medical, industriel', avantages: 'Protection totale', inconvenients: 'Cout, consommation' }
        ]
      },
      {
        titre: 'Dimensionnement',
        contenu: [
          { param: 'Puissance apparente (VA)', description: 'Capacite totale de l\'onduleur' },
          { param: 'Puissance active (W)', description: 'VA x facteur de puissance (0.6 a 0.9)' },
          { param: 'Autonomie', description: 'Temps de fonctionnement sur batterie' },
          { param: 'Facteur de crete', description: 'Rapport courant de pointe / courant efficace' }
        ]
      },
      {
        titre: 'Regles de dimensionnement',
        regles: [
          'Lister tous les equipements a proteger',
          'Sommer les puissances (ajouter 20-30% de marge)',
          'Choisir l\'autonomie souhaitee (5, 10, 30 min...)',
          'Prevoir les extensions futures',
          'Verifier la compatibilite avec le groupe electrogene si present'
        ]
      },
      {
        titre: 'Maintenance',
        contenu: [
          { periode: 'Quotidien', action: 'Verification des voyants, alarmes' },
          { periode: 'Mensuel', action: 'Test de fonctionnement sur batterie' },
          { periode: 'Annuel', action: 'Verification complete, mesures, filtres' },
          { periode: '3-5 ans', action: 'Remplacement des batteries' }
        ]
      }
    ],
    quiz: [
      { question: 'Quel type d\'onduleur a 0ms de commutation?', options: ['Off-line', 'Line-interactive', 'On-line'], correct: 2 },
      { question: 'Pour un datacenter, on choisit?', options: ['Off-line', 'On-line', 'Aucun'], correct: 1 },
      { question: 'Tous les combien remplacer les batteries?', options: ['1 an', '3-5 ans', '10 ans'], correct: 1 }
    ]
  },

  'groupe': {
    titre: 'Groupes electrogenes',
    intro: 'Le groupe electrogene assure l\'alimentation de secours en cas de coupure prolongee du reseau. Il est obligatoire dans certains ERP et batiments.',
    sections: [
      {
        titre: 'Constitution',
        contenu: [
          { element: 'Moteur thermique', description: 'Diesel ou gaz, entraine l\'alternateur' },
          { element: 'Alternateur', description: 'Produit le courant electrique' },
          { element: 'Regulateur', description: 'Maintient tension et frequence constantes' },
          { element: 'Armoire de commande', description: 'Demarrage, surveillance, protections' },
          { element: 'Inverseur de sources', description: 'Commute entre reseau et groupe' }
        ]
      },
      {
        titre: 'Types de demarrage',
        contenu: [
          { type: 'Manuel', description: 'Operateur demarre le groupe', usage: 'Secours occasionnel' },
          { type: 'Semi-automatique', description: 'Demarrage auto, commutation manuelle', usage: 'Usage courant' },
          { type: 'Automatique', description: 'Detection coupure, demarrage, commutation auto', temps: '10-15s', usage: 'ERP, hopitaux, datacenter' }
        ]
      },
      {
        titre: 'Dimensionnement',
        regles: [
          'Puissance = somme des charges + 20% marge',
          'Tenir compte des courants de demarrage (moteurs)',
          'Facteur de simultaneite selon installation',
          'Prevoir la selectivite des protections',
          'Autonomie carburant selon besoins (24h, 72h...)'
        ]
      },
      {
        titre: 'Installation',
        contenu: [
          { point: 'Local', description: 'Ventile, acces facile, isolation phonique' },
          { point: 'Echappement', description: 'Evacuation des gaz, silencieux' },
          { point: 'Carburant', description: 'Cuve retenue, anti-debordement' },
          { point: 'Cablage', description: 'Section adaptee, chemin de cables dedie' },
          { point: 'Mise a la terre', description: 'Regime de neutre compatible' }
        ]
      },
      {
        titre: 'Maintenance',
        contenu: [
          { periode: 'Hebdomadaire', action: 'Niveaux, test a vide (15 min)' },
          { periode: 'Mensuel', action: 'Test en charge, verification batteries' },
          { periode: 'Annuel', action: 'Vidange, filtres, controle complet' },
          { periode: 'Selon heures', action: 'Revision moteur (500h, 1000h...)' }
        ]
      }
    ],
    quiz: [
      { question: 'En combien de temps demarre un groupe automatique?', options: ['1s', '10-15s', '1 minute'], correct: 1 },
      { question: 'A quelle frequence tester le groupe?', options: ['Quotidien', 'Hebdomadaire', 'Mensuel'], correct: 1 },
      { question: 'Quel regime de neutre pour un groupe?', options: ['TT uniquement', 'IT uniquement', 'Compatible installation'], correct: 2 }
    ]
  }
}

export function getCategoryById(id) {
  return erpCategories.find(c => c.id === id)
}

export function getFicheById(id) {
  return erpFiches[id]
}

export function getAllCategories() {
  return erpCategories
}
