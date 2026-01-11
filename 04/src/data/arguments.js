// ============================================
// ARGUMENTS DE DÉBAT PAR ACTION
// Pour les actions coûteuses (>= 20 pts)
// ============================================

export const ACTION_ARGUMENTS = {
  // === SANTÉ PUBLIQUE (22 pts) ===
  sante_publique: {
    pro: {
      gauche: [
        {
          id: 'sp_pro_g1',
          text: "La santé n'est pas une marchandise. Un centre de santé municipal, c'est zéro dépassement d'honoraires.",
          strength: 'strong',
          factBased: true,
          source: 'Sécurité sociale'
        },
        {
          id: 'sp_pro_g2',
          text: "On a des quartiers entiers sans médecin. C'est une question d'égalité républicaine.",
          strength: 'medium',
          factBased: true
        }
      ],
      centre: [
        {
          id: 'sp_pro_c1',
          text: "Les centres de santé réduisent les passages aux urgences, ça coûte moins cher au final.",
          strength: 'strong',
          factBased: true,
          source: 'IRDES'
        }
      ]
    },
    con: {
      droite: [
        {
          id: 'sp_con_d1',
          text: "500K a 1M d'euros par an de fonctionnement ! On n'a pas les moyens.",
          strength: 'strong',
          factBased: true,
          source: 'Cour des comptes'
        },
        {
          id: 'sp_con_d2',
          text: "C'est à l'État de gérer la santé, pas à la commune.",
          strength: 'medium',
          factBased: false
        }
      ],
      extreme_droite: [
        {
          id: 'sp_con_ed1',
          text: "Il faut d'abord soigner nos compatriotes avant de soigner tout le monde.",
          strength: 'weak',
          factBased: false
        }
      ]
    },
    contextual: [
      {
        condition: (state) => state.hidden.health < 30,
        type: 'pro',
        argument: {
          id: 'sp_ctx_crisis',
          text: "Les files d'attente aux urgences explosent ! On ne peut plus attendre.",
          strength: 'critical',
          factBased: true
        }
      }
    ]
  },

  // === CRÈCHES PUBLIQUES (20 pts) ===
  petite_enfance: {
    pro: {
      gauche: [
        {
          id: 'pe_pro_g1',
          text: "Une place en crèche municipale, c'est 0,5 à 3 euros de l'heure pour les familles. Le privé, c'est 10 euros !",
          strength: 'strong',
          factBased: true,
          source: 'CAF'
        },
        {
          id: 'pe_pro_g2',
          text: "Les crèches libèrent les parents, surtout les mères, pour qu'ils puissent travailler.",
          strength: 'medium',
          factBased: true
        }
      ],
      centre: [
        {
          id: 'pe_pro_c1',
          text: "50% du coût est pris en charge par la CAF. L'investissement est partagé.",
          strength: 'medium',
          factBased: true,
          source: 'CAF'
        }
      ]
    },
    con: {
      droite: [
        {
          id: 'pe_con_d1',
          text: "12 000 à 15 000 euros par place et par an ! On pourrait aider les assistantes maternelles à la place.",
          strength: 'strong',
          factBased: true
        },
        {
          id: 'pe_con_d2',
          text: "Le privé sait aussi gérer des crèches, et ça ne coûte rien à la commune.",
          strength: 'medium',
          factBased: false
        }
      ]
    },
    contextual: [
      {
        condition: (state) => state.population.middle > 500,
        type: 'pro',
        argument: {
          id: 'pe_ctx_demand',
          text: "Les jeunes couples s'installent. Sans crèche, ils iront ailleurs.",
          strength: 'strong',
          factBased: true
        }
      }
    ]
  },

  // === CONSTRUCTION HLM (20 pts) ===
  hlm: {
    pro: {
      gauche: [
        {
          id: 'hlm_pro_g1',
          text: "70% des Français sont éligibles au HLM. C'est un droit, pas un privilège !",
          strength: 'strong',
          factBased: true,
          source: 'INSEE'
        },
        {
          id: 'hlm_pro_g2',
          text: "6 euros le m² en HLM contre 15 dans le privé. C'est 9 euros de pouvoir d'achat rendu aux familles.",
          strength: 'strong',
          factBased: true,
          source: 'Observatoire des loyers'
        }
      ],
      centre: [
        {
          id: 'hlm_pro_c1',
          text: "La loi SRU impose 25% de logements sociaux. On doit se mettre en conformité.",
          strength: 'medium',
          factBased: true,
          source: 'Loi SRU'
        }
      ],
      droite: [
        {
          id: 'hlm_pro_d1',
          text: "Le BTP local va en profiter. C'est de l'emploi pour nos artisans.",
          strength: 'weak',
          factBased: true
        }
      ]
    },
    con: {
      droite: [
        {
          id: 'hlm_con_d1',
          text: "15 a 20 millions d'euros pour 100 logements ! C'est un gouffre financier.",
          strength: 'strong',
          factBased: true,
          source: 'Cour des comptes'
        },
        {
          id: 'hlm_con_d2',
          text: "Laissons le marché répondre à la demande. Trop de régulation tue l'offre.",
          strength: 'medium',
          factBased: false
        }
      ],
      extreme_droite: [
        {
          id: 'hlm_con_ed1',
          text: "Les HLM concentrent les problèmes. Il faut d'abord loger les locaux.",
          strength: 'weak',
          factBased: false
        }
      ]
    },
    contextual: [
      {
        condition: (state) => state.population.total > state.hidden.housingCapacity,
        type: 'pro',
        argument: {
          id: 'hlm_ctx_crisis',
          text: "On est en crise du logement ! Des gens dorment dans leur voiture.",
          strength: 'critical',
          factBased: true
        }
      },
      {
        condition: (state) => state.budget < 30,
        type: 'con',
        argument: {
          id: 'hlm_ctx_budget',
          text: "Avec notre budget actuel, c'est irresponsable de se lancer là-dedans.",
          strength: 'strong',
          factBased: true
        }
      }
    ]
  },

  // === RÉNOVATION THERMIQUE (28 pts) ===
  renovation_thermique: {
    pro: {
      gauche: [
        {
          id: 'rt_pro_g1',
          text: "5 millions de passoires thermiques en France ! Les pauvres paient le plus cher pour se chauffer.",
          strength: 'strong',
          factBased: true,
          source: 'ADEME'
        }
      ],
      centre: [
        {
          id: 'rt_pro_c1',
          text: "Une bonne isolation réduit la facture de 50 à 70%. C'est rentable à moyen terme.",
          strength: 'strong',
          factBased: true,
          source: 'ADEME'
        },
        {
          id: 'rt_pro_c2',
          text: "MaPrimeRénov finance jusqu'à 90% pour les modestes. On peut combiner les aides.",
          strength: 'medium',
          factBased: true
        }
      ],
      droite: [
        {
          id: 'rt_pro_d1',
          text: "Ça fait travailler les artisans locaux. C'est bon pour l'économie.",
          strength: 'medium',
          factBased: true
        }
      ]
    },
    con: {
      droite: [
        {
          id: 'rt_con_d1',
          text: "28 points de budget ! C'est énorme pour des travaux qui bénéficient aux propriétaires.",
          strength: 'strong',
          factBased: true
        }
      ],
      extreme_droite: [
        {
          id: 'rt_con_ed1',
          text: "Encore de l'écologie punitive. Les gens font ce qu'ils veulent chez eux.",
          strength: 'weak',
          factBased: false
        }
      ]
    },
    contextual: [
      {
        condition: (state) => state.hidden.pollution > 30,
        type: 'pro',
        argument: {
          id: 'rt_ctx_pollution',
          text: "Notre qualité de l'air se dégrade. La rénovation, c'est moins de chauffage polluant.",
          strength: 'strong',
          factBased: true
        }
      }
    ]
  },

  // === ENERGIES RENOUVELABLES (30 pts) ===
  energie_renouvelable: {
    pro: {
      gauche: [
        {
          id: 'er_pro_g1',
          text: "Une régie publique d'électricité, c'est 10 à 20% moins cher. Grenoble l'a prouvé.",
          strength: 'strong',
          factBased: true,
          source: 'GEG Grenoble'
        },
        {
          id: 'er_pro_g2',
          text: "Des emplois locaux non délocalisables. On ne peut pas délocaliser le soleil !",
          strength: 'medium',
          factBased: true
        }
      ],
      centre: [
        {
          id: 'er_pro_c1',
          text: "Le solaire a un retour sur investissement de 8 à 12 ans. Après, c'est du bénéfice pur.",
          strength: 'strong',
          factBased: true,
          source: 'ADEME'
        }
      ]
    },
    con: {
      droite: [
        {
          id: 'er_con_d1',
          text: "30 points ! On n'est pas EDF. C'est le role de l'Etat, pas de la commune.",
          strength: 'strong',
          factBased: true
        },
        {
          id: 'er_con_d2',
          text: "Les technologies ne sont pas encore matures. On risque d'investir dans du matériel obsolète.",
          strength: 'medium',
          factBased: false
        }
      ],
      extreme_droite: [
        {
          id: 'er_con_ed1',
          text: "Des panneaux chinois pour faire plaisir aux écolos ? Non merci.",
          strength: 'weak',
          factBased: false
        }
      ]
    },
    contextual: [
      {
        condition: (state) => state.energie < 30,
        type: 'pro',
        argument: {
          id: 'er_ctx_crisis',
          text: "Les coupures se multiplient. On doit sécuriser notre approvisionnement.",
          strength: 'critical',
          factBased: true
        }
      }
    ]
  },

  // === TRANSPORTS GRATUITS (25 pts) ===
  transports_gratuits: {
    pro: {
      gauche: [
        {
          id: 'tg_pro_g1',
          text: "Dunkerque, Montpellier l'ont fait. La fréquentation augmente de 50 à 100% !",
          strength: 'strong',
          factBased: true,
          source: 'GART'
        },
        {
          id: 'tg_pro_g2',
          text: "C'est une mesure de pouvoir d'achat. Un abonnement, c'est 50 euros par mois.",
          strength: 'medium',
          factBased: true
        }
      ],
      centre: [
        {
          id: 'tg_pro_c1',
          text: "Financé par le versement mobilité des entreprises. Ce n'est pas le contribuable qui paie.",
          strength: 'medium',
          factBased: true
        }
      ]
    },
    con: {
      droite: [
        {
          id: 'tg_con_d1',
          text: "La gratuité attire les incivilités. Qui dit gratuit dit moins de respect.",
          strength: 'medium',
          factBased: false
        },
        {
          id: 'tg_con_d2',
          text: "10 à 50 millions par an de manque à gagner ! Il faudra compenser.",
          strength: 'strong',
          factBased: true
        }
      ],
      extreme_droite: [
        {
          id: 'tg_con_ed1',
          text: "On va attirer tous les cas sociaux des communes voisines.",
          strength: 'weak',
          factBased: false
        }
      ]
    },
    contextual: [
      {
        condition: (state) => state.hidden.pollution > 35,
        type: 'pro',
        argument: {
          id: 'tg_ctx_pollution',
          text: "La pollution nous tue. Chaque voiture en moins, c'est de l'air en plus.",
          strength: 'strong',
          factBased: true
        }
      }
    ]
  },

  // === PLAN RAIL (30 pts) ===
  plan_rail: {
    pro: {
      gauche: [
        {
          id: 'pr_pro_g1',
          text: "4000 km de petites lignes fermées depuis 2000 ! On abandonne les territoires.",
          strength: 'strong',
          factBased: true,
          source: 'SNCF Reseau'
        },
        {
          id: 'pr_pro_g2',
          text: "Le train émet 50 fois moins de CO2 que l'avion. C'est l'urgence climatique.",
          strength: 'medium',
          factBased: true,
          source: 'ADEME'
        }
      ],
      centre: [
        {
          id: 'pr_pro_c1',
          text: "Le désenclavement, c'est de l'attractivité économique sur le long terme.",
          strength: 'medium',
          factBased: true
        }
      ]
    },
    con: {
      droite: [
        {
          id: 'pr_con_d1',
          text: "500K à 2M euros du kilomètre pour rouvrir une ligne ! C'est hors de notre portée.",
          strength: 'strong',
          factBased: true
        },
        {
          id: 'pr_con_d2',
          text: "Le fret ferroviaire ne représente que 9% du transport. Le camion est plus souple.",
          strength: 'medium',
          factBased: true
        }
      ]
    },
    contextual: [
      {
        condition: (state) => state.hidden.mobility < 20,
        type: 'pro',
        argument: {
          id: 'pr_ctx_mobility',
          text: "Nos habitants sont coincés. Sans voiture, impossible de travailler.",
          strength: 'critical',
          factBased: true
        }
      }
    ]
  },

  // === CCAS RENFORCÉ (20 pts) ===
  ccas: {
    pro: {
      gauche: [
        {
          id: 'ccas_pro_g1',
          text: "Le CCAS, c'est le dernier filet de sécurité. Aide alimentaire, urgence sociale...",
          strength: 'strong',
          factBased: true
        },
        {
          id: 'ccas_pro_g2',
          text: "Chaque euro investi dans le social en économise trois en sécurité et santé.",
          strength: 'medium',
          factBased: true,
          source: 'Études sociales'
        }
      ],
      centre: [
        {
          id: 'ccas_pro_c1',
          text: "Un bon accompagnement social, ça évite les spirales de précarité.",
          strength: 'medium',
          factBased: true
        }
      ]
    },
    con: {
      droite: [
        {
          id: 'ccas_con_d1',
          text: "L'assistanat perpétuel n'aide personne. Il faut responsabiliser les gens.",
          strength: 'medium',
          factBased: false
        },
        {
          id: 'ccas_con_d2',
          text: "5 points de coût de fonctionnement par an, ça s'accumule vite.",
          strength: 'strong',
          factBased: true
        }
      ],
      extreme_droite: [
        {
          id: 'ccas_con_ed1',
          text: "On aide n'importe qui sans contrôle. La priorité aux nôtres !",
          strength: 'weak',
          factBased: false
        }
      ]
    },
    contextual: [
      {
        condition: (state) => state.hidden.tension > 30,
        type: 'pro',
        argument: {
          id: 'ccas_ctx_tension',
          text: "La tension monte dans les quartiers. Le CCAS peut désamorcer.",
          strength: 'strong',
          factBased: true
        }
      }
    ]
  },

  // === ATTRACTIVITE ENTREPRISES (20 pts) ===
  attractivite_entreprises: {
    pro: {
      droite: [
        {
          id: 'ae_pro_d1',
          text: "Les entreprises créent l'emploi. Il faut les attirer avant les voisins.",
          strength: 'strong',
          factBased: true
        },
        {
          id: 'ae_pro_d2',
          text: "Les exonérations sont temporaires, les emplois restent.",
          strength: 'medium',
          factBased: false
        }
      ],
      centre: [
        {
          id: 'ae_pro_c1',
          text: "Une entreprise installée, c'est de la taxe foncière et des commerces autour.",
          strength: 'medium',
          factBased: true
        }
      ]
    },
    con: {
      gauche: [
        {
          id: 'ae_con_g1',
          text: "Des cadeaux au privé pendant qu'on coupe dans les services publics ? Inacceptable.",
          strength: 'strong',
          factBased: true
        },
        {
          id: 'ae_con_g2',
          text: "Les zones franches, ca marche 5 ans puis les boites partent ailleurs.",
          strength: 'medium',
          factBased: true,
          source: 'Cour des comptes'
        }
      ],
      extreme_droite: [
        {
          id: 'ae_con_ed1',
          text: "On attire des multinationales qui pompent et qui partent.",
          strength: 'weak',
          factBased: false
        }
      ]
    },
    contextual: [
      {
        condition: (state) => state.economie < 35,
        type: 'pro',
        argument: {
          id: 'ae_ctx_eco',
          text: "L'économie locale est en berne. On doit relancer l'activité.",
          strength: 'strong',
          factBased: true
        }
      }
    ]
  },

  // === SMART CITY (25 pts) ===
  smart_city: {
    pro: {
      droite: [
        {
          id: 'sc_pro_d1',
          text: "L'optimisation par la donnée, c'est des économies et de l'efficacité.",
          strength: 'medium',
          factBased: true
        }
      ],
      centre: [
        {
          id: 'sc_pro_c1',
          text: "Les capteurs permettent une gestion plus fine : éclairage, déchets, circulation...",
          strength: 'strong',
          factBased: true
        },
        {
          id: 'sc_pro_c2',
          text: "Ça attire les startups et les talents. C'est l'image de la ville moderne.",
          strength: 'medium',
          factBased: true
        }
      ]
    },
    con: {
      gauche: [
        {
          id: 'sc_con_g1',
          text: "La surveillance généralisée, non merci. Big Brother n'est pas notre modèle.",
          strength: 'strong',
          factBased: true
        },
        {
          id: 'sc_con_g2',
          text: "Qui va gérer ces données ? Des entreprises privées américaines ?",
          strength: 'medium',
          factBased: true
        }
      ],
      extreme_droite: [
        {
          id: 'sc_con_ed1',
          text: "Encore de l'argent pour des gadgets. Investissons dans la sécurité réelle.",
          strength: 'weak',
          factBased: false
        }
      ]
    },
    contextual: [
      {
        condition: (state) => state.hidden.liberty < 40,
        type: 'con',
        argument: {
          id: 'sc_ctx_liberty',
          text: "On est déjà très surveillés. Ça suffit.",
          strength: 'strong',
          factBased: true
        }
      }
    ]
  },

  // === PARKING CENTRE-VILLE (22 pts) ===
  parking_centre: {
    pro: {
      droite: [
        {
          id: 'pc_pro_d1',
          text: "Les commerçants du centre-ville en ont besoin. Sans parking, ils meurent.",
          strength: 'strong',
          factBased: true
        },
        {
          id: 'pc_pro_d2',
          text: "Tout le monde n'habite pas en ville. La voiture reste indispensable.",
          strength: 'medium',
          factBased: true
        }
      ],
      extreme_droite: [
        {
          id: 'pc_pro_ed1',
          text: "Les Français aiment leur voiture. Arrêtons de les culpabiliser.",
          strength: 'weak',
          factBased: false
        }
      ]
    },
    con: {
      gauche: [
        {
          id: 'pc_con_g1',
          text: "Plus de parking, c'est plus de voitures, plus de pollution. On fait le contraire de la transition.",
          strength: 'strong',
          factBased: true
        }
      ],
      centre: [
        {
          id: 'pc_con_c1',
          text: "Les études montrent que les centres piétonniers font PLUS de chiffre d'affaires.",
          strength: 'strong',
          factBased: true,
          source: 'CEREMA'
        }
      ]
    },
    contextual: [
      {
        condition: (state) => state.hidden.pollution > 40,
        type: 'con',
        argument: {
          id: 'pc_ctx_pollution',
          text: "On étouffe déjà ! Encourager la voiture maintenant serait criminel.",
          strength: 'critical',
          factBased: true
        }
      }
    ]
  }
}

// Helper pour obtenir les arguments d'une action
export const getArgumentsForAction = (actionId, gameState = null) => {
  const actionArgs = ACTION_ARGUMENTS[actionId]
  if (!actionArgs) return null

  const result = {
    pro: { ...actionArgs.pro },
    con: { ...actionArgs.con },
    contextual: []
  }

  // Ajouter les arguments contextuels si l'état du jeu est fourni
  if (gameState && actionArgs.contextual) {
    actionArgs.contextual.forEach(ctx => {
      if (ctx.condition(gameState)) {
        result.contextual.push({
          type: ctx.type,
          argument: ctx.argument
        })
      }
    })
  }

  return result
}

// Arguments disponibles pour le JOUEUR (maire) pour défendre ses mesures
export const PLAYER_ARGUMENTS = {
  sante_publique: [
    {
      id: 'player_sp_1',
      text: "J'ai rencontré des familles qui font 40km pour voir un médecin. C'est inacceptable.",
      effect: { gauche: 15, centre: 10, droite: 5 },
      strength: 'strong'
    },
    {
      id: 'player_sp_2',
      text: "Les urgences sont saturées. Un centre de santé déleste l'hôpital.",
      effect: { gauche: 10, centre: 15, droite: 10 },
      strength: 'medium'
    },
    {
      id: 'player_sp_3',
      text: "On peut négocier avec l'ARS pour un cofinancement.",
      effect: { gauche: 5, centre: 10, droite: 15 },
      strength: 'medium'
    }
  ],
  petite_enfance: [
    {
      id: 'player_pe_1',
      text: "Sans garde d'enfants, les femmes ne peuvent pas travailler. C'est un frein économique.",
      effect: { gauche: 10, centre: 15, droite: 10 },
      strength: 'strong'
    },
    {
      id: 'player_pe_2',
      text: "Les jeunes couples partent faute de crèches. On perd nos actifs.",
      effect: { gauche: 5, centre: 15, droite: 15 },
      strength: 'medium'
    }
  ],
  hlm: [
    {
      id: 'player_hlm_1',
      text: "La loi SRU nous y oblige. Autant choisir ou et comment on les construit.",
      effect: { gauche: 5, centre: 15, droite: 10 },
      strength: 'strong'
    },
    {
      id: 'player_hlm_2',
      text: "On peut imposer des critères stricts d'attribution pour nos résidents.",
      effect: { gauche: -5, centre: 10, droite: 15, extreme_droite: 10 },
      strength: 'medium'
    },
    {
      id: 'player_hlm_3',
      text: "Le logement social mixte revalorise les quartiers, regardez les exemples européens.",
      effect: { gauche: 15, centre: 10, droite: 5 },
      strength: 'medium'
    }
  ],
  renovation_thermique: [
    {
      id: 'player_rt_1',
      text: "Chaque euro investi revient triple en économies d'énergie pour les habitants.",
      effect: { gauche: 10, centre: 15, droite: 10 },
      strength: 'strong'
    },
    {
      id: 'player_rt_2',
      text: "On peut combiner avec MaPrimeRénov pour réduire la part communale.",
      effect: { gauche: 5, centre: 10, droite: 15 },
      strength: 'medium'
    }
  ],
  energie_renouvelable: [
    {
      id: 'player_er_1',
      text: "L'autonomie énergétique, c'est ne plus dépendre des cours mondiaux.",
      effect: { gauche: 10, centre: 15, droite: 10, extreme_droite: 5 },
      strength: 'strong'
    },
    {
      id: 'player_er_2',
      text: "On peut créer une SEM avec des investisseurs privés pour partager le risque.",
      effect: { gauche: 0, centre: 15, droite: 15 },
      strength: 'medium'
    }
  ],
  transports_gratuits: [
    {
      id: 'player_tg_1',
      text: "Les recettes billettique ne couvrent que 20% du coût. On peut les compenser autrement.",
      effect: { gauche: 10, centre: 15, droite: 5 },
      strength: 'strong'
    },
    {
      id: 'player_tg_2',
      text: "Dunkerque a vu +85% de fréquentation. Plus de bus = moins de voitures.",
      effect: { gauche: 15, centre: 10, droite: 5 },
      strength: 'medium'
    }
  ],
  plan_rail: [
    {
      id: 'player_pr_1',
      text: "La Région finance 80% si on s'engage. C'est maintenant ou jamais.",
      effect: { gauche: 10, centre: 15, droite: 10 },
      strength: 'strong'
    },
    {
      id: 'player_pr_2',
      text: "Le rail attire les entreprises qui veulent décarboner leur logistique.",
      effect: { gauche: 5, centre: 15, droite: 15 },
      strength: 'medium'
    }
  ],
  ccas: [
    {
      id: 'player_ccas_1',
      text: "Le CCAS prévient les expulsions et les spirales de précarité. Ça coûte moins que l'urgence.",
      effect: { gauche: 15, centre: 10, droite: 5 },
      strength: 'strong'
    },
    {
      id: 'player_ccas_2',
      text: "On peut conditionner les aides à des démarches d'insertion.",
      effect: { gauche: -5, centre: 10, droite: 15 },
      strength: 'medium'
    }
  ],
  attractivite_entreprises: [
    {
      id: 'player_ae_1',
      text: "Les exonérations sont limitées dans le temps. Après, on récupère la fiscalité pleine.",
      effect: { gauche: 5, centre: 15, droite: 10 },
      strength: 'strong'
    },
    {
      id: 'player_ae_2',
      text: "On peut cibler les PME locales plutôt que les grands groupes.",
      effect: { gauche: 15, centre: 10, droite: 5 },
      strength: 'medium'
    }
  ],
  smart_city: [
    {
      id: 'player_sc_1',
      text: "Les données restent en régie publique. Pas de revente à des tiers.",
      effect: { gauche: 15, centre: 10, droite: 5 },
      strength: 'strong'
    },
    {
      id: 'player_sc_2',
      text: "L'optimisation des ressources fera économiser 15% sur l'éclairage seul.",
      effect: { gauche: 5, centre: 15, droite: 15 },
      strength: 'medium'
    }
  ],
  parking_centre: [
    {
      id: 'player_pc_1',
      text: "C'est un parking souterrain qui libère de l'espace pour les piétons en surface.",
      effect: { gauche: 10, centre: 15, droite: 10 },
      strength: 'strong'
    },
    {
      id: 'player_pc_2',
      text: "Les commerçants menacent de fermer sans accès voiture pour leurs clients.",
      effect: { gauche: 0, centre: 10, droite: 15, extreme_droite: 10 },
      strength: 'medium'
    }
  ]
}

// Liste des actions qui déclenchent le conseil (cost >= 20)
export const COUNCIL_THRESHOLD = 20

export const COUNCIL_ACTIONS = [
  'sante_publique',
  'petite_enfance',
  'hlm',
  'renovation_thermique',
  'energie_renouvelable',
  'transports_gratuits',
  'plan_rail',
  'ccas',
  'attractivite_entreprises',
  'smart_city',
  'parking_centre'
]
