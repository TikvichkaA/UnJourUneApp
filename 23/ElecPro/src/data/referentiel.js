// Référentiel RNCP36441 - Titre Professionnel Électricien d'Équipement du Bâtiment
// Source: France Compétences - RNCP36441

export const referentiel = {
  titre: "Électricien d'Équipement du Bâtiment",
  code: "RNCP36441",
  niveau: 3,
  dateEcheance: "03-11-2026",
  habilitationsRequises: ["B1(V)", "BR", "H0"],

  ccps: [
    {
      id: "ccp1",
      code: "RNCP36441BC01",
      titre: "Installer les réseaux d'énergie et les équipements courants forts",
      description: "Installation des réseaux d'énergie basse tension et équipements courant fort dans les bâtiments d'habitation et tertiaires",
      dureeEpreuve: "15h30",
      competences: [
        {
          id: "c1-1",
          titre: "Réaliser l'installation des réseaux d'énergie et des équipements électriques courants forts dans les parties intérieures des bâtiments d'habitation",
          description: "Installer les canalisations, appareillages et tableaux électriques dans les logements selon la NF C 15-100",
          activites: [
            "Lire et interpréter les plans et schémas électriques",
            "Implanter et fixer les équipements (boîtes, conduits, chemins de câbles)",
            "Tirer les câbles et réaliser les connexions",
            "Installer le tableau de répartition et ses protections",
            "Poser les appareillages (prises, interrupteurs, DCL)"
          ],
          criteresJury: [
            "Respect de la NF C 15-100",
            "Qualité des connexions (serrage, repérage)",
            "Esthétique de l'installation",
            "Respect des consignes de sécurité",
            "Organisation du poste de travail"
          ],
          erreursFrequentes: [
            "Mauvais calibrage des protections",
            "Non-respect des sections de câbles",
            "Oubli du conducteur de protection (PE)",
            "Connexions mal serrées",
            "Non-respect des volumes (salle de bain)"
          ],
          pointsCles: [
            "Section minimum 1.5mm² pour éclairage, 2.5mm² pour prises",
            "DDR 30mA obligatoire sur tous les circuits",
            "Repérage des circuits au tableau",
            "Respect des IPB selon les volumes"
          ]
        },
        {
          id: "c1-2",
          titre: "Réaliser les vérifications et mettre en service l'installation électrique dans les parties intérieures des bâtiments d'habitation",
          description: "Effectuer les contrôles réglementaires et mettre sous tension l'installation",
          activites: [
            "Vérifier la continuité des conducteurs de protection",
            "Mesurer l'isolement des circuits",
            "Contrôler le fonctionnement des DDR",
            "Vérifier la conformité des protections",
            "Effectuer la mise sous tension progressive"
          ],
          criteresJury: [
            "Utilisation correcte des appareils de mesure",
            "Interprétation des mesures",
            "Méthodologie de mise en service",
            "Respect de la procédure de consignation",
            "Renseignement du rapport de vérification"
          ],
          erreursFrequentes: [
            "Oubli de vérifier la continuité PE",
            "Mauvaise utilisation du mégohmmètre",
            "Test DDR non effectué",
            "Mise sous tension sans vérification préalable"
          ],
          pointsCles: [
            "Continuité PE < 2Ω",
            "Isolement > 0.5MΩ (500V DC)",
            "Test DDR à In et 5×In",
            "Vérification visuelle avant mise sous tension"
          ]
        },
        {
          id: "c1-3",
          titre: "Réaliser l'installation des réseaux d'énergie et des équipements électriques courants forts dans les parties communes des bâtiments d'habitation",
          description: "Installation dans les halls, escaliers, locaux techniques des immeubles collectifs",
          activites: [
            "Installer les colonnes montantes",
            "Câbler les tableaux de services généraux",
            "Poser l'éclairage des parties communes",
            "Installer les systèmes de minuterie/détection",
            "Réaliser les liaisons équipotentielles"
          ],
          criteresJury: [
            "Respect des normes ERP si applicable",
            "Qualité du cheminement des câbles",
            "Respect de l'esthétique des parties communes",
            "Liaisons équipotentielles conformes"
          ],
          erreursFrequentes: [
            "Oubli des liaisons équipotentielles",
            "Non-respect des BAES/éclairage de sécurité",
            "Minuteries mal réglées"
          ],
          pointsCles: [
            "Liaison équipotentielle principale (LEP)",
            "Éclairage de sécurité obligatoire",
            "Protection des circuits par DDR 300mA minimum"
          ]
        },
        {
          id: "c1-4",
          titre: "Mettre en sécurité l'installation électrique des bâtiments d'habitation existants",
          description: "Effectuer les travaux de mise en sécurité selon les 6 points du diagnostic électrique",
          activites: [
            "Diagnostiquer les anomalies de l'installation",
            "Installer un AGCP (appareil général de coupure)",
            "Mettre en place une protection différentielle",
            "Supprimer les matériels vétustes/inadaptés",
            "Réaliser les liaisons équipotentielles manquantes",
            "Protéger mécaniquement les conducteurs"
          ],
          criteresJury: [
            "Identification des anomalies critiques",
            "Priorisation des travaux",
            "Respect de l'existant (rénovation)",
            "Solutions techniques adaptées"
          ],
          erreursFrequentes: [
            "Diagnostic incomplet",
            "Solutions surdimensionnées/coûteuses",
            "Négligence des risques électriques existants"
          ],
          pointsCles: [
            "6 points du diagnostic obligatoire",
            "AGCP accessible",
            "DDR 30mA sur circuits sensibles",
            "Mise à la terre fonctionnelle"
          ]
        },
        {
          id: "c1-5",
          titre: "Réaliser l'installation des réseaux d'énergie et des équipements électriques courants forts dans les bâtiments à usage autre que d'habitation",
          description: "Installation dans les locaux tertiaires (bureaux, commerces, ERP)",
          activites: [
            "Installer les TGBT et tableaux divisionnaires",
            "Réaliser les circuits de puissance",
            "Installer les prises de courant et éclairage tertiaire",
            "Mettre en œuvre les chemins de câbles",
            "Réaliser les alimentations spécifiques (clim, informatique)"
          ],
          criteresJury: [
            "Respect des normes tertiaires/ERP",
            "Dimensionnement correct des circuits",
            "Organisation des tableaux",
            "Respect des contraintes du site"
          ],
          erreursFrequentes: [
            "Sous-dimensionnement des protections",
            "Non-respect des règles ERP",
            "Câblage non conforme aux plans"
          ],
          pointsCles: [
            "Sélectivité des protections",
            "Circuits dédiés informatique",
            "Éclairage de sécurité conforme"
          ]
        }
      ]
    },
    {
      id: "ccp2",
      code: "RNCP36441BC02",
      titre: "Installer les réseaux de communication, équipements courants faibles et solutions d'efficacité énergétique",
      description: "Installation des réseaux de communication, automatismes, sécurité et solutions d'efficacité énergétique",
      dureeEpreuve: "15h30",
      competences: [
        {
          id: "c2-1",
          titre: "Réaliser l'installation des réseaux de communication d'un bâtiment à usage d'habitation et autres",
          description: "Installer les infrastructures de communication (RJ45, fibre, TV) selon les grades définis",
          activites: [
            "Installer le coffret de communication",
            "Tirer les câbles Grade 2TV/3TV",
            "Raccorder les prises RJ45",
            "Réaliser les tests de certification",
            "Installer les prises TV et distribution"
          ],
          criteresJury: [
            "Respect de la norme NF C 15-100 partie communication",
            "Qualité des raccordements RJ45",
            "Tests de certification conformes",
            "Organisation du coffret de communication"
          ],
          erreursFrequentes: [
            "Non-respect du schéma de câblage RJ45",
            "Rayons de courbure non respectés",
            "Câbles non certifiés",
            "Coffret sous-dimensionné"
          ],
          pointsCles: [
            "Minimum 2 prises RJ45 par pièce principale",
            "Grade 2TV minimum en neuf",
            "DTI obligatoire",
            "Test de certification Catégorie 6"
          ]
        },
        {
          id: "c2-2",
          titre: "Réaliser l'installation des équipements de sûreté et de sécurité d'un bâtiment à usage d'habitation et autres",
          description: "Installer les systèmes d'alarme intrusion, détection incendie, contrôle d'accès",
          activites: [
            "Installer une alarme intrusion",
            "Poser des détecteurs (mouvement, ouverture, fumée)",
            "Installer un système de vidéophonie/interphone",
            "Câbler un système de contrôle d'accès",
            "Mettre en service et paramétrer"
          ],
          criteresJury: [
            "Positionnement correct des détecteurs",
            "Câblage propre et conforme",
            "Paramétrage fonctionnel",
            "Documentation utilisateur"
          ],
          erreursFrequentes: [
            "Détecteurs mal positionnés",
            "Zones mal définies",
            "Alimentation de secours oubliée"
          ],
          pointsCles: [
            "DAAF obligatoire dans les logements",
            "Alimentation secourue pour alarme",
            "Hauteur de pose des détecteurs"
          ]
        },
        {
          id: "c2-3",
          titre: "Réaliser l'installation des équipements d'automatisme et de confort d'un bâtiment à usage d'habitation et autres",
          description: "Installer les systèmes domotiques, volets roulants, portails automatiques",
          activites: [
            "Installer des volets roulants électriques",
            "Câbler des stores et BSO",
            "Installer un portail/porte de garage automatique",
            "Mettre en œuvre une solution domotique",
            "Programmer des scénarios"
          ],
          criteresJury: [
            "Respect des normes de sécurité (portails)",
            "Fonctionnalité des automatismes",
            "Programmation conforme aux attentes",
            "Réglage des fins de course"
          ],
          erreursFrequentes: [
            "Fins de course mal réglées",
            "Sécurités portail non fonctionnelles",
            "Programmation incorrecte"
          ],
          pointsCles: [
            "Circuit dédié volets (2.5mm²)",
            "Norme EN 12453 pour portails",
            "Cellules photoélectriques obligatoires"
          ]
        },
        {
          id: "c2-4",
          titre: "Réaliser l'installation d'équipements et solutions d'efficacité énergétique d'un bâtiment à usage d'habitation et autres",
          description: "Installer les IRVE, systèmes de gestion d'énergie, production photovoltaïque",
          activites: [
            "Installer une borne IRVE (recharge VE)",
            "Mettre en œuvre un délesteur",
            "Installer des sous-compteurs d'énergie",
            "Câbler des panneaux photovoltaïques (partie AC)",
            "Programmer une gestion de chauffage"
          ],
          criteresJury: [
            "Respect de la norme IRVE",
            "Dimensionnement correct",
            "Paramétrage de la gestion d'énergie",
            "Respect des prescriptions constructeur"
          ],
          erreursFrequentes: [
            "Sous-dimensionnement du circuit IRVE",
            "Non-respect de la NF C 15-100 IRVE",
            "Mauvais paramétrage délesteur"
          ],
          pointsCles: [
            "Circuit dédié IRVE 2.5mm² min",
            "DDR Type A (AC+DC pulsé) ou Type B",
            "Protection amont adaptée au mode de charge",
            "Gestion dynamique de charge recommandée"
          ]
        }
      ]
    }
  ],

  modalitesEvaluation: {
    miseEnSituation: {
      partie1: {
        duree: "15 heures",
        description: "Réalisation d'une partie représentative d'une installation électrique (habitation + tertiaire)"
      },
      partie2: {
        duree: "30 minutes",
        description: "Mise en service de l'installation en présence du jury"
      }
    },
    questionnaireQCM: "Questionnaire professionnel sous forme de QCM",
    entretienFinal: "Échange avec le jury sur le dossier professionnel",
    tenueExigee: "Veste, pantalon de travail, chaussures de sécurité"
  },

  secteurs: [
    "Bâtiments d'habitation (maisons individuelles, immeubles collectifs)",
    "Bâtiments tertiaires (commerces, bureaux, santé, enseignement)",
    "Bâtiments artisanaux",
    "Bâtiments industriels (hors contrôle-commande)"
  ],

  emploisAccessibles: [
    "Électricien",
    "Électricien bâtiment",
    "Monteur électricien",
    "Installateur électricien",
    "Tableautiste en électricité"
  ]
}

export default referentiel
