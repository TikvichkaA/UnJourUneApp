// Cas pratiques interactifs - Scénarios de diagnostic terrain

export const casPratiques = [
  {
    id: 'disjonctions-repetees',
    titre: 'Disjonctions répétées',
    description: 'Le client signale que son disjoncteur général saute régulièrement',
    difficulte: 2,
    icon: '⚡',
    duree: '10-15 min',
    competences: ['Diagnostic', 'Surcharge', 'Protection'],
    etapes: [
      {
        id: 'etape1',
        type: 'observation',
        titre: 'Questionnement client',
        question: 'Quelle est votre première action en arrivant chez le client ?',
        contexte: 'Le client vous accueille et vous explique que le disjoncteur saute "de temps en temps".',
        options: [
          {
            id: 'a',
            texte: 'Demander quand et comment ça disjoncte',
            correct: true,
            feedback: 'Correct ! Un bon diagnostic commence toujours par écouter le client pour comprendre les circonstances.'
          },
          {
            id: 'b',
            texte: 'Remplacer immédiatement le disjoncteur',
            correct: false,
            feedback: 'Trop hâtif ! Sans diagnostic, vous risquez de ne pas résoudre le vrai problème.'
          },
          {
            id: 'c',
            texte: 'Mesurer la tension au tableau',
            correct: false,
            feedback: 'La mesure viendra après. D\'abord, comprendre la situation avec le client.'
          },
          {
            id: 'd',
            texte: 'Ouvrir le tableau et inspecter visuellement',
            correct: false,
            feedback: 'L\'inspection viendra, mais le questionnement client doit précéder.'
          }
        ],
        indice: 'Un bon diagnostic commence par écouter le client'
      },
      {
        id: 'etape2',
        type: 'diagnostic',
        titre: 'Analyse des informations',
        question: 'Le client dit que ça disjoncte quand il allume le four ET le lave-linge en même temps. Quelle est votre hypothèse principale ?',
        contexte: 'Le client a un abonnement 6 kVA. Le four fait 3000W et le lave-linge 2500W.',
        options: [
          {
            id: 'a',
            texte: 'Surcharge - puissance totale dépasse l\'abonnement',
            correct: true,
            feedback: 'Exact ! 3000W + 2500W = 5500W, proche des 6000VA de l\'abonnement, sans compter le reste.'
          },
          {
            id: 'b',
            texte: 'Court-circuit dans le four',
            correct: false,
            feedback: 'Non, un court-circuit provoquerait un déclenchement immédiat et systématique.'
          },
          {
            id: 'c',
            texte: 'Défaut d\'isolement du lave-linge',
            correct: false,
            feedback: 'Un défaut d\'isolement déclencherait le DDR, pas le disjoncteur de branchement.'
          },
          {
            id: 'd',
            texte: 'Disjoncteur de branchement défectueux',
            correct: false,
            feedback: 'Peu probable si le déclenchement est lié à l\'usage simultané d\'appareils.'
          }
        ],
        indice: 'Faites le calcul : puissance demandée vs puissance disponible'
      },
      {
        id: 'etape3',
        type: 'verification',
        titre: 'Vérification',
        question: 'Pour confirmer votre hypothèse de surcharge, que vérifiez-vous ?',
        contexte: 'Vous avez identifié une probable surcharge.',
        options: [
          {
            id: 'a',
            texte: 'La puissance souscrite sur le compteur Linky',
            correct: true,
            feedback: 'Correct ! Le Linky affiche la puissance souscrite. Vous confirmez 6 kVA.'
          },
          {
            id: 'b',
            texte: 'L\'isolement de tous les circuits',
            correct: false,
            feedback: 'La mesure d\'isolement n\'est pas pertinente pour une surcharge.'
          },
          {
            id: 'c',
            texte: 'La tension du réseau',
            correct: false,
            feedback: 'La tension n\'explique pas une surcharge.'
          },
          {
            id: 'd',
            texte: 'Le serrage des connexions',
            correct: false,
            feedback: 'Le serrage est important mais pas pour diagnostiquer une surcharge.'
          }
        ],
        indice: 'Le compteur Linky donne des informations précieuses'
      },
      {
        id: 'etape4',
        type: 'solution',
        titre: 'Solution proposée',
        question: 'Quelle solution proposez-vous au client ?',
        contexte: 'Surcharge confirmée : abonnement 6 kVA insuffisant pour l\'usage.',
        options: [
          {
            id: 'a',
            texte: 'Augmenter l\'abonnement à 9 kVA ou installer un délesteur',
            correct: true,
            feedback: 'Excellent ! Les deux solutions sont valables. Le délesteur coupe temporairement les circuits non prioritaires.'
          },
          {
            id: 'b',
            texte: 'Remplacer le disjoncteur de branchement par un 40A',
            correct: false,
            feedback: 'Impossible ! Le calibre du DB est fixé par le gestionnaire selon l\'abonnement.'
          },
          {
            id: 'c',
            texte: 'Changer le four pour un modèle moins puissant',
            correct: false,
            feedback: 'C\'est une option, mais augmenter l\'abonnement est plus simple et standard.'
          },
          {
            id: 'd',
            texte: 'Dire au client de ne pas utiliser les deux en même temps',
            correct: false,
            feedback: 'Ce n\'est pas une solution professionnelle. Il faut résoudre le problème.'
          }
        ],
        indice: 'Il existe des solutions techniques pour gérer la puissance'
      }
    ],
    conclusion: 'La surcharge est un problème fréquent. Les solutions sont : augmenter l\'abonnement, installer un délesteur, ou optimiser l\'usage. Toujours vérifier l\'abonnement en premier !'
  },

  {
    id: 'ddr-qui-saute',
    titre: 'DDR qui déclenche',
    description: 'L\'interrupteur différentiel 30mA déclenche sans raison apparente',
    difficulte: 3,
    icon: '🔌',
    duree: '15-20 min',
    competences: ['DDR', 'Isolement', 'Localisation'],
    etapes: [
      {
        id: 'etape1',
        type: 'observation',
        titre: 'Premiers constats',
        question: 'Le DDR déclenche de façon aléatoire. Par où commencez-vous ?',
        contexte: 'Le client dit que ça arrive "n\'importe quand", parfois plusieurs fois par jour.',
        options: [
          {
            id: 'a',
            texte: 'Identifier les circuits protégés par ce DDR',
            correct: true,
            feedback: 'Correct ! Il faut d\'abord savoir quels circuits peuvent être en cause.'
          },
          {
            id: 'b',
            texte: 'Remplacer le DDR directement',
            correct: false,
            feedback: 'Sans diagnostic, vous risquez de remplacer un DDR fonctionnel.'
          },
          {
            id: 'c',
            texte: 'Mesurer la tension',
            correct: false,
            feedback: 'La tension n\'est pas la cause d\'un déclenchement DDR.'
          },
          {
            id: 'd',
            texte: 'Appeler un collègue',
            correct: false,
            feedback: 'Vous pouvez faire le diagnostic seul avec méthode.'
          }
        ],
        indice: 'Identifier le périmètre du problème'
      },
      {
        id: 'etape2',
        type: 'diagnostic',
        titre: 'Localisation',
        question: 'Comment localiser le circuit fautif ?',
        contexte: 'Le DDR protège 6 circuits : éclairage salon, prises chambre, lave-linge, sèche-linge, prises cuisine, salle de bain.',
        options: [
          {
            id: 'a',
            texte: 'Couper tous les disjoncteurs sous ce DDR, réarmer, puis les réenclencher un par un',
            correct: true,
            feedback: 'Méthode classique de localisation par élimination. Efficace !'
          },
          {
            id: 'b',
            texte: 'Mesurer l\'isolement de chaque circuit simultanément',
            correct: false,
            feedback: 'On ne peut pas mesurer tous les circuits en même temps.'
          },
          {
            id: 'c',
            texte: 'Attendre que ça disjoncte et voir ce qui était allumé',
            correct: false,
            feedback: 'Trop aléatoire et peu professionnel.'
          },
          {
            id: 'd',
            texte: 'Demander au client de noter ses activités',
            correct: false,
            feedback: 'Peut aider mais il faut une méthode de diagnostic directe.'
          }
        ],
        indice: 'Procédez par élimination méthodique'
      },
      {
        id: 'etape3',
        type: 'verification',
        titre: 'Identification',
        question: 'Le DDR déclenche quand vous réenclenchez le circuit "sèche-linge". Que faites-vous ?',
        contexte: 'Le circuit sèche-linge provoque le déclenchement immédiat.',
        options: [
          {
            id: 'a',
            texte: 'Débrancher le sèche-linge et réessayer',
            correct: true,
            feedback: 'Correct ! Cela permet de savoir si le défaut vient de l\'appareil ou du circuit.'
          },
          {
            id: 'b',
            texte: 'Remplacer le câble du circuit',
            correct: false,
            feedback: 'Trop hâtif. Le défaut peut venir de l\'appareil.'
          },
          {
            id: 'c',
            texte: 'Changer le disjoncteur du circuit',
            correct: false,
            feedback: 'Le disjoncteur n\'est pas en cause, c\'est le DDR qui déclenche.'
          },
          {
            id: 'd',
            texte: 'Mesurer la résistance de terre',
            correct: false,
            feedback: 'La terre n\'est pas en cause dans ce cas.'
          }
        ],
        indice: 'Isolez l\'appareil pour déterminer s\'il est en cause'
      },
      {
        id: 'etape4',
        type: 'solution',
        titre: 'Conclusion',
        question: 'Sèche-linge débranché, le circuit fonctionne. Diagnostic final ?',
        contexte: 'Sans le sèche-linge branché, le DDR ne déclenche plus.',
        options: [
          {
            id: 'a',
            texte: 'Défaut d\'isolement dans le sèche-linge - conseiller réparation ou remplacement',
            correct: true,
            feedback: 'Exact ! Le sèche-linge a un défaut d\'isolement qui crée une fuite de courant vers la terre.'
          },
          {
            id: 'b',
            texte: 'Circuit sous-dimensionné pour le sèche-linge',
            correct: false,
            feedback: 'Un sous-dimensionnement ferait déclencher le disjoncteur, pas le DDR.'
          },
          {
            id: 'c',
            texte: 'DDR trop sensible - remplacer par un 300mA',
            correct: false,
            feedback: 'Jamais ! Le 30mA protège les personnes. Le défaut vient de l\'appareil.'
          },
          {
            id: 'd',
            texte: 'Prise de terre défectueuse',
            correct: false,
            feedback: 'La terre fonctionne, c\'est ce qui permet au DDR de détecter le défaut.'
          }
        ],
        indice: 'Le DDR détecte les courants de fuite vers la terre'
      }
    ],
    conclusion: 'Un DDR qui déclenche signale un défaut d\'isolement. Toujours localiser le circuit puis l\'appareil fautif. Ne jamais shunter ou remplacer un DDR 30mA par un moins sensible !'
  },

  {
    id: 'prise-qui-chauffe',
    titre: 'Prise qui chauffe',
    description: 'Le client signale une prise de courant anormalement chaude',
    difficulte: 2,
    icon: '🔥',
    duree: '10-15 min',
    competences: ['Sécurité', 'Connexions', 'Diagnostic'],
    etapes: [
      {
        id: 'etape1',
        type: 'observation',
        titre: 'Évaluation du danger',
        question: 'Le client montre une prise qui chauffe. Première action ?',
        contexte: 'La prise est chaude au toucher, avec une légère odeur de plastique brûlé.',
        options: [
          {
            id: 'a',
            texte: 'Couper le circuit concerné au tableau',
            correct: true,
            feedback: 'Correct ! Sécurité d\'abord. Un échauffement peut mener à un incendie.'
          },
          {
            id: 'b',
            texte: 'Débrancher l\'appareil de la prise',
            correct: false,
            feedback: 'Risque ! La prise peut être endommagée. Mieux vaut couper au tableau.'
          },
          {
            id: 'c',
            texte: 'Mesurer la température avec un thermomètre',
            correct: false,
            feedback: 'Pas nécessaire. Si ça chauffe anormalement, il faut sécuriser d\'abord.'
          },
          {
            id: 'd',
            texte: 'Demander depuis combien de temps ça chauffe',
            correct: false,
            feedback: 'L\'information est utile mais la sécurisation est prioritaire.'
          }
        ],
        indice: 'La sécurité prime toujours'
      },
      {
        id: 'etape2',
        type: 'diagnostic',
        titre: 'Recherche de la cause',
        question: 'Circuit coupé, vous démontez la prise. Que recherchez-vous en priorité ?',
        contexte: 'La prise est accessible et le circuit est hors tension (vérifié au VAT).',
        options: [
          {
            id: 'a',
            texte: 'L\'état des connexions (serrage, traces de chauffe)',
            correct: true,
            feedback: 'Correct ! Un mauvais serrage crée une résistance qui provoque un échauffement.'
          },
          {
            id: 'b',
            texte: 'La section des conducteurs',
            correct: false,
            feedback: 'La section est rarement en cause sur une installation existante.'
          },
          {
            id: 'c',
            texte: 'La marque de la prise',
            correct: false,
            feedback: 'Pas le plus important pour le diagnostic.'
          },
          {
            id: 'd',
            texte: 'La couleur des fils',
            correct: false,
            feedback: 'Les couleurs n\'expliquent pas un échauffement.'
          }
        ],
        indice: 'La cause la plus fréquente des échauffements ?'
      },
      {
        id: 'etape3',
        type: 'verification',
        titre: 'Constat',
        question: 'Vous constatez des traces noires sur une borne et un fil mal serré. Que faites-vous ?',
        contexte: 'Le conducteur de phase présente des traces d\'oxydation et était à peine maintenu.',
        options: [
          {
            id: 'a',
            texte: 'Remplacer la prise et refaire le raccordement proprement',
            correct: true,
            feedback: 'Exact ! La prise endommagée doit être remplacée et les connexions refaites.'
          },
          {
            id: 'b',
            texte: 'Resserrer simplement la connexion',
            correct: false,
            feedback: 'Non ! Les bornes endommagées doivent être remplacées.'
          },
          {
            id: 'c',
            texte: 'Nettoyer les traces noires et remonter',
            correct: false,
            feedback: 'Une prise ayant subi un échauffement doit être remplacée.'
          },
          {
            id: 'd',
            texte: 'Condamner définitivement la prise',
            correct: false,
            feedback: 'On peut la remplacer, pas besoin de la condamner.'
          }
        ],
        indice: 'Un appareillage endommagé doit être remplacé'
      },
      {
        id: 'etape4',
        type: 'solution',
        titre: 'Vérifications complémentaires',
        question: 'Avant de refermer, que vérifiez-vous également ?',
        contexte: 'Nouvelle prise installée avec serrage correct.',
        options: [
          {
            id: 'a',
            texte: 'Toutes les autres connexions du circuit (boîtes de dérivation)',
            correct: true,
            feedback: 'Correct ! Si un serrage était mauvais, d\'autres peuvent l\'être aussi.'
          },
          {
            id: 'b',
            texte: 'Uniquement le fonctionnement de cette prise',
            correct: false,
            feedback: 'Il faut vérifier l\'ensemble du circuit par précaution.'
          },
          {
            id: 'c',
            texte: 'La tension du réseau EDF',
            correct: false,
            feedback: 'La tension n\'est pas en cause ici.'
          },
          {
            id: 'd',
            texte: 'Le compteur Linky',
            correct: false,
            feedback: 'Le compteur n\'a pas de rapport avec ce problème.'
          }
        ],
        indice: 'Un problème de serrage peut en cacher d\'autres'
      }
    ],
    conclusion: 'L\'échauffement d\'une prise est souvent dû à un mauvais serrage. C\'est un danger d\'incendie ! Toujours remplacer l\'appareillage endommagé et vérifier les autres connexions du circuit.'
  },

  {
    id: 'eclairage-intermittent',
    titre: 'Éclairage intermittent',
    description: 'Une lampe clignote ou s\'allume de façon intermittente',
    difficulte: 2,
    icon: '💡',
    duree: '10-15 min',
    competences: ['Éclairage', 'Faux contact', 'Diagnostic'],
    etapes: [
      {
        id: 'etape1',
        type: 'observation',
        titre: 'Observation',
        question: 'Le client dit que sa lampe de salon "clignote parfois". Par quoi commencez-vous ?',
        contexte: 'C\'est un plafonnier avec ampoule LED. Le problème est apparu récemment.',
        options: [
          {
            id: 'a',
            texte: 'Demander si c\'est avec toutes les ampoules ou juste celle-ci',
            correct: true,
            feedback: 'Bon réflexe ! Cela permet de savoir si le problème vient de l\'ampoule ou du circuit.'
          },
          {
            id: 'b',
            texte: 'Remplacer l\'ampoule directement',
            correct: false,
            feedback: 'Possible mais il faut d\'abord identifier la cause.'
          },
          {
            id: 'c',
            texte: 'Ouvrir l\'interrupteur',
            correct: false,
            feedback: 'Prématuré. Il faut d\'abord interroger le client.'
          },
          {
            id: 'd',
            texte: 'Mesurer la tension au plafonnier',
            correct: false,
            feedback: 'Pas en premier. Le questionnement aide à orienter le diagnostic.'
          }
        ],
        indice: 'Le client peut donner des indices précieux'
      },
      {
        id: 'etape2',
        type: 'diagnostic',
        titre: 'Test simple',
        question: 'Le client dit que ça fait pareil avec une autre ampoule. Hypothèse ?',
        contexte: 'Le problème persiste avec une ampoule neuve.',
        options: [
          {
            id: 'a',
            texte: 'Faux contact dans le circuit (interrupteur, douille ou boîte)',
            correct: true,
            feedback: 'Exact ! Si l\'ampoule n\'est pas en cause, c\'est un problème de connexion.'
          },
          {
            id: 'b',
            texte: 'Problème de compatibilité LED',
            correct: false,
            feedback: 'Possible mais peu probable si ça marchait avant.'
          },
          {
            id: 'c',
            texte: 'Surtension du réseau',
            correct: false,
            feedback: 'Une surtension ne causerait pas un clignotement intermittent.'
          },
          {
            id: 'd',
            texte: 'DDR défectueux',
            correct: false,
            feedback: 'Le DDR n\'a pas d\'impact sur le clignotement d\'une lampe.'
          }
        ],
        indice: 'L\'ampoule est hors de cause, cherchez ailleurs'
      },
      {
        id: 'etape3',
        type: 'verification',
        titre: 'Localisation',
        question: 'Pour localiser le faux contact, par où commencez-vous ?',
        contexte: 'Vous suspectez un faux contact. Le circuit comprend un interrupteur va-et-vient.',
        options: [
          {
            id: 'a',
            texte: 'L\'interrupteur (point le plus sollicité mécaniquement)',
            correct: true,
            feedback: 'Correct ! Les interrupteurs sont souvent en cause, surtout les va-et-vient.'
          },
          {
            id: 'b',
            texte: 'Le tableau électrique',
            correct: false,
            feedback: 'Peu probable pour un clignotement localisé.'
          },
          {
            id: 'c',
            texte: 'Le câble dans le mur',
            correct: false,
            feedback: 'Les câbles encastrés sont rarement en cause.'
          },
          {
            id: 'd',
            texte: 'La douille du plafonnier',
            correct: false,
            feedback: 'Possible mais l\'interrupteur est plus souvent en cause.'
          }
        ],
        indice: 'Les points de connexion sollicités sont les plus fragiles'
      },
      {
        id: 'etape4',
        type: 'solution',
        titre: 'Réparation',
        question: 'Vous trouvez un fil mal serré dans l\'interrupteur. Action ?',
        contexte: 'La navette du va-et-vient était à peine maintenue, créant un faux contact.',
        options: [
          {
            id: 'a',
            texte: 'Resserrer proprement et vérifier toutes les connexions de l\'interrupteur',
            correct: true,
            feedback: 'Correct ! Un bon serrage et une vérification complète règlent le problème.'
          },
          {
            id: 'b',
            texte: 'Remplacer l\'interrupteur par précaution',
            correct: false,
            feedback: 'Pas nécessaire si les bornes ne sont pas abîmées.'
          },
          {
            id: 'c',
            texte: 'Ajouter de l\'étain sur la connexion',
            correct: false,
            feedback: 'L\'étamage n\'est pas recommandé sur les connexions à vis.'
          },
          {
            id: 'd',
            texte: 'Remplacer le fil par un plus gros',
            correct: false,
            feedback: 'La section n\'est pas en cause.'
          }
        ],
        indice: 'Un bon serrage suffit si la borne n\'est pas endommagée'
      }
    ],
    conclusion: 'Les faux contacts sont la cause principale des éclairages intermittents. Vérifiez systématiquement : interrupteurs, douilles, boîtes de dérivation. Un bon serrage règle 90% des cas !'
  },

  {
    id: 'absence-tension',
    titre: 'Absence de tension',
    description: 'Un circuit ou une prise n\'a plus de courant',
    difficulte: 2,
    icon: '🔋',
    duree: '10-15 min',
    competences: ['Diagnostic', 'Mesure', 'Méthode'],
    etapes: [
      {
        id: 'etape1',
        type: 'observation',
        titre: 'Premiers contrôles',
        question: 'Le client dit "il n\'y a plus de courant dans le salon". Que vérifiez-vous d\'abord ?',
        contexte: 'Le reste de la maison fonctionne normalement.',
        options: [
          {
            id: 'a',
            texte: 'L\'état des disjoncteurs au tableau',
            correct: true,
            feedback: 'Correct ! Vérifier si un disjoncteur ou DDR a déclenché est le premier réflexe.'
          },
          {
            id: 'b',
            texte: 'La tension avec un multimètre',
            correct: false,
            feedback: 'La mesure viendra après avoir vérifié les protections.'
          },
          {
            id: 'c',
            texte: 'Si le compteur est en marche',
            correct: false,
            feedback: 'Le reste de la maison fonctionne, donc le compteur est OK.'
          },
          {
            id: 'd',
            texte: 'La prise avec un appareil',
            correct: false,
            feedback: 'Le client a déjà constaté le problème.'
          }
        ],
        indice: 'Le tableau électrique donne les premières informations'
      },
      {
        id: 'etape2',
        type: 'diagnostic',
        titre: 'Tableau OK',
        question: 'Tous les disjoncteurs sont enclenchés. Que faites-vous ?',
        contexte: 'Au tableau, aucune protection n\'a déclenché.',
        options: [
          {
            id: 'a',
            texte: 'Vérifier la présence de tension en sortie du disjoncteur concerné',
            correct: true,
            feedback: 'Exact ! Il faut vérifier que la tension arrive bien au départ du circuit.'
          },
          {
            id: 'b',
            texte: 'Remplacer le disjoncteur',
            correct: false,
            feedback: 'Pas sans avoir vérifié qu\'il est en cause.'
          },
          {
            id: 'c',
            texte: 'Appeler ENEDIS',
            correct: false,
            feedback: 'Le problème est sur l\'installation, pas sur le réseau.'
          },
          {
            id: 'd',
            texte: 'Couper le compteur et tout remettre',
            correct: false,
            feedback: 'Cette manipulation n\'a pas de sens ici.'
          }
        ],
        indice: 'Vérifiez étape par étape du tableau vers le point en panne'
      },
      {
        id: 'etape3',
        type: 'verification',
        titre: 'Mesure',
        question: 'Vous avez bien 230V en sortie du disjoncteur. Où se situe le problème ?',
        contexte: 'La tension est présente au tableau mais absente à la prise du salon.',
        options: [
          {
            id: 'a',
            texte: 'Entre le tableau et la prise : fil coupé ou connexion défaillante',
            correct: true,
            feedback: 'Correct ! Le problème est sur le cheminement du circuit.'
          },
          {
            id: 'b',
            texte: 'Dans le disjoncteur lui-même',
            correct: false,
            feedback: 'Non, la tension est présente en sortie du disjoncteur.'
          },
          {
            id: 'c',
            texte: 'Dans le compteur',
            correct: false,
            feedback: 'Non, la tension arrive jusqu\'au tableau.'
          },
          {
            id: 'd',
            texte: 'Problème réseau ENEDIS',
            correct: false,
            feedback: 'Le réseau alimente le tableau correctement.'
          }
        ],
        indice: 'Raisonnez par élimination'
      },
      {
        id: 'etape4',
        type: 'solution',
        titre: 'Recherche',
        question: 'Comment localiser précisément la coupure ?',
        contexte: 'Vous savez que le problème est sur le circuit entre le tableau et les prises.',
        options: [
          {
            id: 'a',
            texte: 'Vérifier les boîtes de dérivation du circuit et les connexions',
            correct: true,
            feedback: 'Correct ! Les boîtes de dérivation sont souvent le lieu des problèmes de connexion.'
          },
          {
            id: 'b',
            texte: 'Retirer tout le câblage et le remplacer',
            correct: false,
            feedback: 'Disproportionné. Il faut d\'abord localiser.'
          },
          {
            id: 'c',
            texte: 'Tirer un nouveau câble en parallèle',
            correct: false,
            feedback: 'Ce n\'est pas la bonne méthode de diagnostic.'
          },
          {
            id: 'd',
            texte: 'Appeler un collègue avec un détecteur de câbles',
            correct: false,
            feedback: 'Utile en dernier recours, mais vérifiez d\'abord les points accessibles.'
          }
        ],
        indice: 'Les points de connexion sont les endroits les plus sensibles'
      }
    ],
    conclusion: 'En cas d\'absence de tension : vérifiez d\'abord le tableau, puis progressez vers le point en panne. Les connexions dans les boîtes de dérivation sont souvent en cause.'
  },

  {
    id: 'tableau-a-verifier',
    titre: 'Vérification d\'un tableau',
    description: 'Vous devez vérifier la conformité d\'un tableau électrique existant',
    difficulte: 3,
    icon: '✅',
    duree: '15-20 min',
    competences: ['Conformité', 'Normes', 'Inspection'],
    etapes: [
      {
        id: 'etape1',
        type: 'observation',
        titre: 'Inspection visuelle',
        question: 'Face à un tableau existant, quelle est votre première vérification ?',
        contexte: 'Vous êtes mandaté pour vérifier la conformité d\'un tableau résidentiel.',
        options: [
          {
            id: 'a',
            texte: 'Vérifier la présence des protections obligatoires (DDR 30mA, disjoncteurs)',
            correct: true,
            feedback: 'Correct ! La présence et le type des protections sont la base de la conformité.'
          },
          {
            id: 'b',
            texte: 'Mesurer immédiatement l\'isolement',
            correct: false,
            feedback: 'Les mesures viennent après l\'inspection visuelle.'
          },
          {
            id: 'c',
            texte: 'Prendre une photo pour le rapport',
            correct: false,
            feedback: 'Utile mais ce n\'est pas une vérification technique.'
          },
          {
            id: 'd',
            texte: 'Demander l\'âge de l\'installation',
            correct: false,
            feedback: 'L\'information est utile mais ne remplace pas l\'inspection.'
          }
        ],
        indice: 'Commencez par voir ce qui est présent ou absent'
      },
      {
        id: 'etape2',
        type: 'diagnostic',
        titre: 'Protections différentielles',
        question: 'Vous constatez un seul DDR 30mA pour toute l\'installation. Est-ce conforme ?',
        contexte: 'Tableau avec 1 DDR 40A 30mA et 8 disjoncteurs divisionnaires.',
        options: [
          {
            id: 'a',
            texte: 'Non, il faut au minimum 2 DDR 30mA pour une installation > 35m²',
            correct: true,
            feedback: 'Exact ! La NF C 15-100 impose 2 DDR minimum au-delà de 35m².'
          },
          {
            id: 'b',
            texte: 'Oui, un DDR suffit pour une maison',
            correct: false,
            feedback: 'Non, il faut répartir les circuits sur plusieurs DDR.'
          },
          {
            id: 'c',
            texte: 'Ça dépend de l\'année de construction',
            correct: false,
            feedback: 'Pour les nouvelles installations, la norme actuelle s\'applique.'
          },
          {
            id: 'd',
            texte: 'Il faudrait vérifier le calibre du disjoncteur de branchement',
            correct: false,
            feedback: 'Le calibre du DB est indépendant du nombre de DDR.'
          }
        ],
        indice: 'La NF C 15-100 définit le nombre minimum de DDR'
      },
      {
        id: 'etape3',
        type: 'verification',
        titre: 'Circuits spécialisés',
        question: 'Quels circuits doivent obligatoirement être sur un DDR Type A ?',
        contexte: 'Vous vérifiez le type des DDR pour chaque circuit.',
        options: [
          {
            id: 'a',
            texte: 'Lave-linge, sèche-linge, plaque de cuisson, borne VE',
            correct: true,
            feedback: 'Correct ! Ces appareils génèrent des courants à composante continue.'
          },
          {
            id: 'b',
            texte: 'Tous les circuits doivent être sur Type A',
            correct: false,
            feedback: 'Non, seuls certains circuits spécialisés nécessitent le Type A.'
          },
          {
            id: 'c',
            texte: 'Uniquement le circuit congélateur',
            correct: false,
            feedback: 'Le congélateur n\'a pas besoin de Type A obligatoirement.'
          },
          {
            id: 'd',
            texte: 'Les circuits éclairage',
            correct: false,
            feedback: 'L\'éclairage peut être sur Type AC.'
          }
        ],
        indice: 'Les appareils avec variateurs électroniques sont concernés'
      },
      {
        id: 'etape4',
        type: 'solution',
        titre: 'Tests',
        question: 'Quels tests effectuez-vous pour valider le tableau ?',
        contexte: 'Inspection visuelle terminée, place aux mesures.',
        options: [
          {
            id: 'a',
            texte: 'Continuité PE, isolement des circuits, test DDR avec appareil dédié',
            correct: true,
            feedback: 'Correct ! Ce sont les 3 mesures essentielles pour la conformité.'
          },
          {
            id: 'b',
            texte: 'Uniquement le test du bouton DDR',
            correct: false,
            feedback: 'Insuffisant. Le bouton test ne vérifie pas le seuil réel de déclenchement.'
          },
          {
            id: 'c',
            texte: 'Mesure de tension sur tous les circuits',
            correct: false,
            feedback: 'La tension seule ne prouve pas la conformité.'
          },
          {
            id: 'd',
            texte: 'Comptage des prises par circuit',
            correct: false,
            feedback: 'C\'est de l\'inspection, pas des tests électriques.'
          }
        ],
        indice: 'Les 3 tests fondamentaux de la vérification électrique'
      }
    ],
    conclusion: 'La vérification d\'un tableau comprend : inspection visuelle (présence DDR, types, calibres), puis tests (continuité PE, isolement > 0.5MΩ, déclenchement DDR). Document à remettre au client.'
  }
]

// Fonctions utilitaires
export function getCasPratiqueById(caseId) {
  return casPratiques.find(c => c.id === caseId)
}

export function getAllCasPratiques() {
  return casPratiques
}

export default casPratiques
