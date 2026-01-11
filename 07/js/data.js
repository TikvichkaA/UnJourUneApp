// ============================================
// DATA.JS - Donnees des bruits comparatifs
// ============================================

const SOUNDS_DATA = {
  animals: [
    {
      id: 'lion',
      name: { fr: 'Rugissement de Lion', en: 'Lion Roar' },
      emoji: '&#x1F981;',
      decibels: 114,
      winMessage: { fr: "Shu fait fuir le roi de la jungle !", en: "Shu scares away the king of the jungle!" },
      loseMessage: { fr: "Le lion garde son trone... pour l'instant !", en: "The lion keeps his throne... for now!" },
      funFact: { fr: "Un lion peut etre entendu a 8 km !", en: "A lion can be heard 5 miles away!" }
    },
    {
      id: 'elephant',
      name: { fr: "Barrissement d'Elephant", en: "Elephant Trumpet" },
      emoji: '&#x1F418;',
      decibels: 117,
      winMessage: { fr: "L'elephant n'en revient pas !", en: "The elephant can't believe it!" },
      loseMessage: { fr: "Shu reste impressionne par ce gros nez...", en: "Shu is impressed by that big trunk..." },
      funFact: { fr: "Les elephants communiquent par infra-sons !", en: "Elephants communicate using infrasound!" }
    },
    {
      id: 'whale',
      name: { fr: 'Chant de Baleine', en: 'Whale Song' },
      emoji: '&#x1F40B;',
      decibels: 188,
      winMessage: { fr: "IMPOSSIBLE ! Shu defie les lois de la physique !", en: "IMPOSSIBLE! Shu defies the laws of physics!" },
      loseMessage: { fr: "Normal, c'est l'animal le plus bruyant du monde !", en: "Makes sense, it's the loudest animal in the world!" },
      funFact: { fr: "Une baleine bleue atteint 188 dB sous l'eau !", en: "A blue whale reaches 188 dB underwater!" }
    },
    {
      id: 'mosquito',
      name: { fr: 'Bzzzz de Moustique', en: 'Mosquito Buzz' },
      emoji: '&#x1F99F;',
      decibels: 40,
      winMessage: { fr: "Victoire facile ! Le moustique s'enfuit !", en: "Easy win! The mosquito flies away!" },
      loseMessage: { fr: "Comment c'est possible ?! Shu dormait...", en: "How is this possible?! Shu was sleeping..." },
      funFact: { fr: "Le battement d'ailes fait 600 fois/seconde !", en: "Wing beats happen 600 times per second!" }
    },
    {
      id: 'cat',
      name: { fr: 'Miaulement de Chat', en: 'Cat Meow' },
      emoji: '&#x1F431;',
      decibels: 65,
      winMessage: { fr: "Le chat file se cacher sous le lit !", en: "The cat runs to hide under the bed!" },
      loseMessage: { fr: "Le chat garde son calme olympien...", en: "The cat keeps its composure..." },
      funFact: { fr: "Les chats miaulent uniquement pour les humains !", en: "Cats only meow at humans!" }
    }
  ],
  vehicles: [
    {
      id: 'plane',
      name: { fr: "Decollage d'Avion", en: "Airplane Takeoff" },
      emoji: '&#x2708;&#xFE0F;',
      decibels: 140,
      winMessage: { fr: "L'avion fait demi-tour !", en: "The plane turns around!" },
      loseMessage: { fr: "Shu a besoin de bouchons d'oreilles...", en: "Shu needs earplugs..." },
      funFact: { fr: "Au decollage, un avion atteint 140 dB !", en: "At takeoff, a plane reaches 140 dB!" }
    },
    {
      id: 'motorcycle',
      name: { fr: 'Vrombissement de Moto', en: 'Motorcycle Roar' },
      emoji: '&#x1F3CD;&#xFE0F;',
      decibels: 95,
      winMessage: { fr: "La moto cale de surprise !", en: "The motorcycle stalls in surprise!" },
      loseMessage: { fr: "Le motard n'a rien entendu...", en: "The biker didn't hear a thing..." },
      funFact: { fr: "Une Harley Davidson fait environ 100 dB !", en: "A Harley Davidson is about 100 dB!" }
    },
    {
      id: 'rocket',
      name: { fr: 'Lancement de Fusee', en: 'Rocket Launch' },
      emoji: '&#x1F680;',
      decibels: 180,
      winMessage: { fr: "LEGENDAIRE ! Shu > NASA !", en: "LEGENDARY! Shu > NASA!" },
      loseMessage: { fr: "La fusee reste imbattable... pour l'instant !", en: "The rocket remains unbeatable... for now!" },
      funFact: { fr: "Un lancement Saturn V faisait fondre le beton !", en: "A Saturn V launch could melt concrete!" }
    },
    {
      id: 'horn',
      name: { fr: 'Klaxon de Voiture', en: 'Car Horn' },
      emoji: '&#x1F4EF;',
      decibels: 110,
      winMessage: { fr: "Le klaxon se tait de honte !", en: "The horn goes silent in shame!" },
      loseMessage: { fr: "Shu deteste les embouteillages...", en: "Shu hates traffic jams..." },
      funFact: { fr: "Un klaxon moyen fait 107-109 dB !", en: "An average car horn is 107-109 dB!" }
    }
  ],
  nature: [
    {
      id: 'thunder',
      name: { fr: 'Coup de Tonnerre', en: 'Thunder Clap' },
      emoji: '&#x26C8;&#xFE0F;',
      decibels: 120,
      winMessage: { fr: "Zeus demande une revanche !", en: "Zeus demands a rematch!" },
      loseMessage: { fr: "Meme les dieux sont plus forts...", en: "Even the gods are louder..." },
      funFact: { fr: "La foudre chauffe l'air a 30 000 C !", en: "Lightning heats air to 54,000 F!" }
    },
    {
      id: 'volcano',
      name: { fr: 'Eruption Volcanique', en: 'Volcanic Eruption' },
      emoji: '&#x1F30B;',
      decibels: 180,
      winMessage: { fr: "LE VOLCAN S'ETEINT DE PEUR !", en: "THE VOLCANO GOES DORMANT IN FEAR!" },
      loseMessage: { fr: "La Terre gronde plus fort que Shu...", en: "The Earth rumbles louder than Shu..." },
      funFact: { fr: "Le Krakatoa de 1883 fut entendu a 4800 km !", en: "The 1883 Krakatoa was heard 3000 miles away!" }
    },
    {
      id: 'waterfall',
      name: { fr: 'Chutes du Niagara', en: 'Niagara Falls' },
      emoji: '&#x1F4A7;',
      decibels: 90,
      winMessage: { fr: "Les chutes s'arretent net !", en: "The falls stop dead!" },
      loseMessage: { fr: "L'eau continue de couler paisiblement...", en: "The water keeps flowing peacefully..." },
      funFact: { fr: "6 millions de litres/minute aux chutes !", en: "1.5 million gallons per minute flow over the falls!" }
    }
  ]
};

// Configuration de la puissance de Shu
const SHU_CONFIG = {
  minDecibels: 60,
  maxDecibels: 150,
  averageDecibels: 85,
  superBarkChance: 0.15 // 15% de chance de super aboiement
};

// Messages speciaux
const SPECIAL_MESSAGES = {
  superBark: {
    fr: [
      "SUPER ABOIEMENT ! Shu a mange ses croquettes ce matin !",
      "MODE TURBO ACTIVE ! Les voisins appellent la police !",
      "Shu vient de battre son record personnel !"
    ],
    en: [
      "SUPER BARK! Shu ate his kibble this morning!",
      "TURBO MODE ACTIVATED! The neighbors are calling the cops!",
      "Shu just beat his personal record!"
    ]
  },
  streak: {
    fr: {
      3: "3 victoires d'affilee ! Shu est en feu !",
      5: "5 victoires ! Shu est INARRETABLE !",
      10: "10 VICTOIRES ! Shu est une LEGENDE !"
    },
    en: {
      3: "3 wins in a row! Shu is on fire!",
      5: "5 wins! Shu is UNSTOPPABLE!",
      10: "10 WINS! Shu is a LEGEND!"
    }
  },
  draw: {
    fr: [
      "Match nul epique ! Respect mutuel !",
      "Egalite parfaite ! Les deux sont des champions !",
      "Ni vainqueur, ni vaincu... cette fois !"
    ],
    en: [
      "Epic draw! Mutual respect!",
      "Perfect tie! Both are champions!",
      "No winner, no loser... this time!"
    ]
  }
};

// Fonction utilitaire pour obtenir la langue actuelle
function getCurrentLang() {
  return (typeof I18N !== 'undefined') ? I18N.currentLang : 'fr';
}

// Fonction utilitaire pour obtenir un texte localise
function getLocalizedText(obj) {
  const lang = getCurrentLang();
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj['fr'] || obj;
}

// Fonction utilitaire pour obtenir tous les sons
function getAllSounds() {
  return [
    ...SOUNDS_DATA.animals,
    ...SOUNDS_DATA.vehicles,
    ...SOUNDS_DATA.nature
  ];
}
