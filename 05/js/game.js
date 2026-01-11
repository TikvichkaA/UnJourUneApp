/**
 * JB's Ultimate Mission - Game Engine
 * A dating simulation mini-game with pixel art vibes
 */

// =====================================================
// BROWSER DETECTION FOR VIDEO FORMAT
// =====================================================
const BrowserDetect = {
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),

    // Use MOV for Safari/iOS, WebM for others (better transparency support)
    getVideoFormat() {
        return (this.isSafari || this.isIOS) ? 'mov' : 'webm';
    },

    getVideoType() {
        return (this.isSafari || this.isIOS) ? 'video/quicktime' : 'video/webm';
    }
};

// =====================================================
// GAME STATE
// =====================================================
const GameState = {
    interest: 5,
    weirdness: 0,
    maxInterest: 5,
    maxWeirdness: 10,
    currentScene: 'title',
    currentDialogue: null,
    dialogueIndex: 0,
    dialogueBranch: 'bar_intro',

    // Maze state
    correctBuilding: 0,
    correctFloor: 3,
    correctDoor: 'B',

    // Timers
    negotiateTimer: null,
    negotiateTimeLeft: 60,
    negotiationPhase: 0,

    // JB Mascot animations - transparent versions (webm/mov)
    mascotAnimations: {
        idle: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/salute-pose-059fa47e.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/salute-pose-6de9ec60.mov'
        },
        drinking: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/drinking-water-eab4cf5b.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/drinking-water-11d7c971.mov'
        },
        running: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/running-sprint-f1d0d815.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/running-sprint-f940fabf.mov'
        },
        victory: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/victory-pose-ba2f68ea.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/victory-pose-586a92f4.mov'
        },
        defeated: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/defeated-fall-5974f25f.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/defeated-fall-d22c37dc.mov'
        },
        damage: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/taking-damage-ffa920e3.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/taking-damage-d0b54652.mov'
        },
        levelUp: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/level-up-jump-1a035889.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/level-up-jump-f2301aed.mov'
        },
        eating: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/eat-chinese-noodles-3da980a6.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/eat-chinese-noodles-5de000a1.mov'
        },
        // New animations
        inBar: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/in-a-bar-9523339b.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/in-a-bar-1b3bc3aa.mov'
        },
        talkToGirl: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/talk-to-a-blond-girl-b4ef8fb3.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/talk-to-a-blond-girl-1bb26041.mov'
        },
        openDoor: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/open-a-door-f8a1e2db.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/open-a-door-243159da.mov'
        },
        crying: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/cry-like-a-little-baby-0b41ff0a.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/cry-like-a-little-baby-2c658648.mov'
        },
        kebab: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/mange-un-kebab-af2424d7.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/mange-un-kebab-5311dd03.mov'
        },
        checkMap: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/check-map-1e9d17db.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/check-map-add6b8c3.mov'
        },
        thumbsUp: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/thumbs-up-8d6ef4ae.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/thumbs-up-e23630b3.mov'
        },
        sleeping: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/sleeping-f3bee5fd.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/sleeping-b815e5ae.mov'
        },
        angryYell: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/angry-yell-a1c4d33e.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/angry-yell-cd63b5b5.mov'
        },
        slapped: {
            webm: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/get-slapped-by-a-girl-289dc796.webm',
            mov: 'https://assets.masco.dev/7fced6/jb-mascot-2a60/get-slapped-by-a-girl-9113e677.mov'
        }
    },

    // Get the right animation URL based on browser
    getAnimationUrl(animationType) {
        const anim = this.mascotAnimations[animationType];
        if (!anim) return null;
        const format = BrowserDetect.getVideoFormat();
        return anim[format];
    }
};

// =====================================================
// DIALOGUES
// =====================================================
const Dialogues = {
    bar_intro: [
        { speaker: 'Narrateur', text: '~ Le Tropical, 23h47 ~', portrait: null },
        { speaker: 'Narrateur', text: 'La musique pulse, les néons clignotent...', portrait: null },
        { speaker: 'JB', text: '*repère une fille seule au bar*', portrait: 'inBar' },
        { speaker: 'JB', text: '*inspire un grand coup* C\'est parti.', portrait: 'inBar' },
        { speaker: 'Léa', text: '*scroll sur Insta, un Mojito à la main*', portrait: null },
        { speaker: 'JB', text: 'Hey ! Ce Mojito a l\'air presque aussi frais que toi...', portrait: 'talkToGirl' },
        { speaker: 'Léa', text: '*lève les yeux, sourire en coin* Oh wow. C\'est ta phrase d\'accroche ?', portrait: null },
        { speaker: 'JB', text: '*légèrement déstabilisé*', portrait: 'damage' },
        {
            speaker: 'JB',
            text: 'Euh...',
            portrait: 'talkToGirl',
            choices: [
                { text: 'Nan j\'en ai des meilleures ! Je t\'offre un verre pour me rattraper ?', effect: { interest: 1 }, next: 'bar_flirt' },
                { text: 'Ouais... enfin non... je peux m\'asseoir ?', effect: { weirdness: 1 }, next: 'bar_awkward' },
                { text: '*rire nerveux* Pardon, je m\'appelle JB. Et toi ?', effect: {}, next: 'bar_intro_name' }
            ]
        }
    ],

    bar_intro_name: [
        { speaker: 'Léa', text: 'Léa. T\'es tout seul ?', portrait: null },
        { speaker: 'JB', text: 'Mes potes m\'ont lâché... La loose.', portrait: 'damage' },
        { speaker: 'Léa', text: '*rit* Pareil pour moi ! Ma coloc a choppé la grippe.', portrait: null },
        { speaker: 'JB', text: 'On est deux rescapés alors ! Un verre ?', portrait: 'thumbsUp' },
        { speaker: 'Léa', text: 'Allez, je dis pas non.', portrait: null, next: 'bar_chat' }
    ],

    bar_flirt: [
        { speaker: 'Léa', text: '*range son téléphone* Ok, je t\'écoute. T\'as quoi de mieux ?', portrait: null },
        { speaker: 'JB', text: 'Hmm... Est-ce que ton père est terroriste ?', portrait: 'talkToGirl' },
        { speaker: 'Léa', text: '... Pardon ?!', portrait: null },
        { speaker: 'JB', text: 'Parce que t\'es une bombe ! ... Ok celle-là est nulle aussi.', portrait: 'damage' },
        { speaker: 'Léa', text: '*éclate de rire* T\'es con ! Mais ça me fait marrer.', portrait: null },
        { speaker: 'Léa', text: 'Moi c\'est Léa. Et oui pour le verre !', portrait: null, next: 'bar_chat' }
    ],

    bar_awkward: [
        { speaker: 'Léa', text: '*le dévisage* Euh... ouais vas-y.', portrait: null },
        { speaker: 'JB', text: '*s\'assoit maladroitement, renverse presque son verre*', portrait: 'damage' },
        { speaker: 'Léa', text: 'Wow, détends-toi ! Je vais pas te manger.', portrait: null },
        { speaker: 'JB', text: 'Désolé c\'est juste que... t\'es vraiment jolie.', portrait: 'talkToGirl' },
        { speaker: 'Léa', text: '*sourit* Bon, c\'est mignon ça. Moi c\'est Léa.', portrait: null, next: 'bar_chat' }
    ],

    bar_chat: [
        { speaker: 'Narrateur', text: '~ 45 minutes et 3 verres plus tard ~', portrait: null },
        { speaker: 'Léa', text: 'Attends attends... T\'as VRAIMENT fait ça à ton entretien ?!', portrait: null },
        { speaker: 'JB', text: 'Je te jure ! J\'ai appelé le DRH "Maman" par accident.', portrait: 'drinking' },
        { speaker: 'Léa', text: '*pleure de rire* NON ! Et t\'as eu le job ?', portrait: null },
        { speaker: 'JB', text: '... Non. Bizarrement.', portrait: 'talkToGirl' },
        { speaker: 'Léa', text: '*s\'essuie les yeux* Ahah t\'es trop drôle ! Du coup tu fais quoi après ?', portrait: null },
        {
            speaker: 'JB',
            text: '*moment de vérité*',
            portrait: 'talkToGirl',
            choices: [
                { text: 'On peut continuer chez moi si tu veux ! J\'ai Netflix.', effect: { weirdness: 1 }, next: 'propose_direct' },
                { text: 'Rien de prévu... Et toi, t\'as des plans ?', effect: { interest: 1 }, next: 'propose_smooth' },
                { text: 'Faut que je rentre nourrir mon serpent...', effect: { interest: -2, weirdness: 3 }, next: 'serpent' }
            ]
        }
    ],

    propose_direct: [
        { speaker: 'Léa', text: '*hausse un sourcil* Netflix hein ? Original...', portrait: null },
        { speaker: 'JB', text: 'J\'ai aussi Disney+ !', portrait: 'idle' },
        { speaker: 'Léa', text: '*rit* T\'habites où alors ?', portrait: null },
        {
            speaker: 'JB',
            text: '*réalise le problème*',
            portrait: 'damage',
            choices: [
                { text: 'En fait c\'est chez un pote, il m\'a filé ses clés...', effect: { weirdness: 1 }, next: 'explain_abel' },
                { text: 'À 15 min en Uber, c\'est pas loin !', effect: {}, next: 'leaving_bar' }
            ]
        }
    ],

    propose_smooth: [
        { speaker: 'Léa', text: '*se rapproche* Pareil... Cette soirée est nulle sans ma coloc.', portrait: null },
        { speaker: 'Léa', text: 'On pourrait aller ailleurs non ?', portrait: null },
        { speaker: 'JB', text: '*essaie de pas trop sourire* J\'ai les clés de l\'appart d\'un pote !', portrait: 'levelUp' },
        { speaker: 'JB', text: 'Il est en vacances, l\'endroit est libre.', portrait: 'thumbsUp' },
        { speaker: 'Léa', text: 'Hmm... C\'est loin ?', portrait: null },
        { speaker: 'JB', text: 'Quinze minutes max ! Allez viens.', portrait: 'talkToGirl' },
        { speaker: 'Léa', text: '*attrape sa veste* Ok, mais si c\'est un piège je te préviens, j\'ai fait du self-défense.', portrait: null },
        { speaker: 'JB', text: 'Noté ! *stresse un peu*', portrait: 'damage', next: 'leaving_bar' }
    ],

    explain_abel: [
        { speaker: 'Léa', text: 'Chez un pote ? Genre... il sera là ?', portrait: null },
        { speaker: 'JB', text: 'Non non ! Il est à Barcelone pour 2 semaines !', portrait: 'idle' },
        {
            speaker: 'Léa',
            text: '*pas totalement convaincue*',
            portrait: null,
            choices: [
                { text: 'L\'appart est totalement vide, promis !', effect: {}, next: 'leaving_bar' },
                { text: 'Enfin... il dort peut-être sur le canap\'...', effect: { interest: -1, weirdness: 2 }, next: 'explain_abel_2' }
            ]
        }
    ],

    explain_abel_2: [
        { speaker: 'Léa', text: 'QUOI ?! On va chez quelqu\'un qui DORT ?', portrait: null },
        { speaker: 'JB', text: 'JE DÉCONNE ! Il est vraiment pas là je te jure !', portrait: 'damage' },
        { speaker: 'Léa', text: '*le fixe* ... T\'es bizarre comme mec.', portrait: null },
        { speaker: 'JB', text: 'On me le dit souvent oui.', portrait: 'damage' },
        { speaker: 'Léa', text: '*soupire* Bon allez, on y va. Mais t\'as intérêt à pas être un psychopathe.', portrait: null, next: 'leaving_bar' }
    ],

    serpent: [
        { speaker: 'Léa', text: '... Tu viens de dire serpent là ?', portrait: null },
        { speaker: 'JB', text: '*réalise sa connerie*', portrait: 'damage' },
        {
            speaker: 'Léa',
            text: 'Genre un vrai serpent ? Vivant ?',
            portrait: null,
            choices: [
                { text: 'AHAH nan je déconne ! J\'ai un chat. Un chat normal.', effect: { weirdness: -1 }, next: 'bar_chat_recovery' },
                { text: 'Ouaip ! Il s\'appelle Saucisse. Il est super câlin !', effect: { interest: -1, weirdness: 2 }, next: 'serpent_2' }
            ]
        }
    ],

    bar_chat_recovery: [
        { speaker: 'Léa', text: '*rit nerveusement* Ok t\'as un humour spécial toi.', portrait: null },
        { speaker: 'JB', text: 'C\'est mon charme ! Bon, tu fais quoi après du coup ?', portrait: 'levelUp' },
        { speaker: 'Léa', text: 'Hmm... Je sais pas, t\'as une idée ?', portrait: null },
        {
            speaker: 'JB',
            text: '*deuxième chance*',
            portrait: 'idle',
            choices: [
                { text: 'On peut aller chez un pote, il est pas là !', effect: {}, next: 'propose_smooth' },
                { text: 'Un dernier verre ici ?', effect: { interest: 1 }, next: 'bar_last_drink' }
            ]
        }
    ],

    bar_last_drink: [
        { speaker: 'Narrateur', text: '~ 20 minutes plus tard ~', portrait: null },
        { speaker: 'Léa', text: 'Bon, le bar va fermer... On fait quoi ?', portrait: null },
        { speaker: 'JB', text: 'J\'ai les clés de chez un pote ! Il est en vacances.', portrait: 'idle' },
        { speaker: 'Léa', text: 'Oh ? Allez pourquoi pas ! C\'est où ?', portrait: null, next: 'leaving_bar' }
    ],

    serpent_2: [
        { speaker: 'Léa', text: '... Saucisse. Tu as appelé ton serpent... Saucisse.', portrait: null },
        { speaker: 'JB', text: 'C\'est parce qu\'il est long et fin ! Logique non ?', portrait: 'idle' },
        { speaker: 'Léa', text: '*expression indéchiffrable*', portrait: null },
        {
            speaker: 'JB',
            text: '*sent que ça part mal*',
            portrait: 'damage',
            choices: [
                { text: 'Bref ! On parlait de quoi déjà ?', effect: {}, next: 'bar_chat_recovery' },
                { text: 'Tu veux voir des photos ? Il est trop mignon !', effect: { interest: -2, weirdness: 3 }, next: 'game_over_weird' }
            ]
        }
    ],

    leaving_bar: [
        { speaker: 'Narrateur', text: '~ Devant Le Tropical, 1h12 ~', portrait: null },
        { speaker: 'Léa', text: '*frissonne* Il fait froid ! On appelle un Uber ?', portrait: null },
        { speaker: 'JB', text: 'Yep ! Deux secondes...', portrait: 'idle' },
        { speaker: 'JB', text: '*sort son téléphone*', portrait: 'idle' },
        { speaker: 'JB', text: '*l\'écran reste noir*', portrait: 'damage' },
        { speaker: 'JB', text: '*appuie frénétiquement sur le bouton*', portrait: 'damage' },
        { speaker: 'JB', text: '... Non. Non non non.', portrait: 'damage' },
        { speaker: 'Léa', text: 'Quoi ? Qu\'est-ce qui se passe ?', portrait: null },
        { speaker: 'JB', text: 'Plus de batterie. Et... j\'ai pas noté l\'adresse d\'Abel.', portrait: 'damage' },
        { speaker: 'Léa', text: '... T\'es sérieux là ?', portrait: null },
        {
            speaker: 'JB',
            text: '*cherche une solution*',
            portrait: 'damage',
            choices: [
                { text: 'Tu pourrais commander avec ton téléphone ?', effect: {}, next: 'no_data' },
                { text: 'Faut qu\'on trouve un endroit pour charger !', effect: { interest: 1 }, next: 'find_charger' }
            ]
        }
    ],

    no_data: [
        { speaker: 'Léa', text: '*check son tel* J\'ai plus de 4G... Forfait grillé.', portrait: null },
        { speaker: 'JB', text: 'On est vraiment dans la merde.', portrait: 'damage' },
        { speaker: 'Léa', text: '*regarde autour* Y\'a une lumière là-bas !', portrait: null },
        { speaker: 'JB', text: '*voit l\'enseigne* Un salon de thé turc ! Ils ont sûrement un chargeur !', portrait: 'levelUp', next: 'go_to_salon' }
    ],

    find_charger: [
        { speaker: 'Léa', text: 'Bonne idée ! *regarde autour* Là ! Un salon de thé !', portrait: null },
        { speaker: 'JB', text: 'Yes ! Allez viens, ils vont nous sauver !', portrait: 'running', next: 'go_to_salon' }
    ],

    go_to_salon: [
        { speaker: 'Narrateur', text: '*Ils courent vers la lumière...*', portrait: null, next: 'salon_intro' }
    ],

    salon_intro: [
        { speaker: 'Narrateur', text: '~ Salon de Thé "Chez Mehmet" - 1h23 ~', portrait: null },
        { speaker: 'Narrateur', text: 'Un homme moustachu range les tables, l\'air fatigué.', portrait: null },
        { speaker: 'JB', text: '*entre en trombe* BONSOIR ! Vous auriez un chargeur iPhone ?!', portrait: 'angryYell' },
        { speaker: 'Mehmet', text: '*sursaute* Hé ! Du calme !', portrait: null },
        { speaker: 'Mehmet', text: '*regarde sa montre* On ferme là mon ami. Il est tard.', portrait: null },
        { speaker: 'Léa', text: '*chuchote* Vas-y, négocie...', portrait: null, next: 'start_negotiate' }
    ],

    negotiate_success: [
        { speaker: 'Mehmet', text: '*sourit largement* Ah, quelqu\'un qui apprécie le vrai thé !', portrait: null },
        { speaker: 'Mehmet', text: 'Allez, installez-vous ! Le chargeur est là-bas.', portrait: null },
        { speaker: 'Léa', text: '*impressionnée, chuchote* T\'as géré !', portrait: null },
        { speaker: 'JB', text: '*fier de lui*', portrait: 'thumbsUp' },
        { speaker: 'Narrateur', text: '~ 15 minutes et un excellent thé plus tard ~', portrait: null },
        { speaker: 'Mehmet', text: 'Vous revenez quand vous voulez ! Et bonne fin de soirée...', portrait: null },
        { speaker: 'JB', text: '*récupère son tel* J\'ai l\'adresse ! Let\'s go !', portrait: 'levelUp', next: 'to_maze' }
    ],

    negotiate_fail: [
        { speaker: 'Mehmet', text: '*croise les bras* Non non, je suis fatigué. Bonne nuit !', portrait: null },
        { speaker: 'JB', text: 'S\'il vous plaît...', portrait: 'damage' },
        { speaker: 'Léa', text: '*lui donne un coup de coude* Essaye autre chose !', portrait: null, next: 'start_negotiate' }
    ],

    negotiate_angry: [
        { speaker: 'Mehmet', text: '*s\'énerve* Tu te fous de moi ?! DEHORS !', portrait: null },
        { speaker: 'JB', text: '*se fait virer*', portrait: 'crying' },
        { speaker: 'Léa', text: '*morte de honte* Bravo champion...', portrait: null },
        { speaker: 'Narrateur', text: '~ Après 20 minutes à chercher ~', portrait: null },
        { speaker: 'JB', text: '*trouve un McDo* Un McDo 24h ! Sauvés !', portrait: 'levelUp' },
        { speaker: 'Léa', text: 'Tu m\'offres des nuggets pour compenser.', portrait: null },
        { speaker: 'JB', text: 'Deal.', portrait: 'kebab', next: 'to_maze' }
    ],

    to_maze: [
        { speaker: 'Narrateur', text: '*Téléphone chargé, adresse récupérée...*', portrait: null },
        { speaker: 'JB', text: 'C\'est à 5 min à pied ! On y va !', portrait: 'running', next: 'maze_intro' }
    ],

    maze_intro: [
        { speaker: 'Narrateur', text: '~ Quartier résidentiel - 2h01 ~', portrait: null },
        { speaker: 'Léa', text: 'Bon, c\'est où ton fameux appart ?', portrait: null },
        { speaker: 'JB', text: '*regarde les trois immeubles identiques*', portrait: 'checkMap' },
        { speaker: 'JB', text: '...', portrait: 'checkMap' },
        { speaker: 'Léa', text: 'JB ? C\'est lequel ?', portrait: null },
        { speaker: 'JB', text: '*transpire*', portrait: 'damage' },
        {
            speaker: 'Léa',
            text: 'Me dis pas que tu sais pas...',
            portrait: null,
            choices: [
                { text: 'Si si ! C\'est... celui du milieu ! Je crois !', effect: {}, next: 'building_select' },
                { text: 'Ils... ils se ressemblent tous...', effect: { interest: -1, weirdness: 1 }, next: 'building_confused' }
            ]
        }
    ],

    building_confused: [
        { speaker: 'Léa', text: 'Attends. Tu m\'as traînée jusqu\'ici sans savoir OÙ c\'est ?!', portrait: null },
        { speaker: 'JB', text: 'Je SAIS où c\'est ! C\'est juste que... la nuit tout se ressemble !', portrait: 'checkMap' },
        { speaker: 'Léa', text: '*soupir profond* ...Bon. On essaye.', portrait: null, next: 'building_select' }
    ],

    wrong_building: [
        { speaker: 'JB', text: '*essaye la clé* Ça tourne pas...', portrait: 'openDoor' },
        { speaker: 'Léa', text: 'Donc c\'est pas celui-là.', portrait: null },
        { speaker: 'JB', text: 'C\'est forcément un des deux autres !', portrait: 'checkMap' },
        { speaker: 'Léa', text: '*lève les yeux au ciel* Quelle soirée...', portrait: null, next: 'building_select' }
    ],

    right_building: [
        { speaker: 'JB', text: '*la clé tourne* YES !', portrait: 'openDoor' },
        { speaker: 'Léa', text: 'Miracle ! Bon, c\'est quel étage maintenant ?', portrait: null },
        { speaker: 'JB', text: 'Attends... je me souviens du SMS !', portrait: 'checkMap', next: 'start_memory_floor' }
    ],

    wrong_floor: [
        { speaker: 'JB', text: '*essaye la clé sur une porte* ...Nope.', portrait: 'openDoor' },
        { speaker: 'Léa', text: 'C\'est une blague ? C\'est pas le bon étage ?!', portrait: null },
        { speaker: 'JB', text: 'Abel m\'a dit un truc genre "au milieu"...', portrait: 'checkMap' },
        {
            speaker: 'Léa',
            text: '*commence à perdre patience*',
            portrait: null,
            choices: [
                { text: 'C\'est sûrement juste au-dessus !', effect: { interest: -1, weirdness: 1 }, next: 'floor_select' },
                { text: 'Abel et ses indications de merde...', effect: { weirdness: 1 }, next: 'floor_select' }
            ]
        }
    ],

    right_floor: [
        { speaker: 'JB', text: 'Ok on y est !', portrait: 'thumbsUp' },
        { speaker: 'Léa', text: '...Y\'a 4 portes. C\'est laquelle ?', portrait: null, next: 'door_select' }
    ],

    wrong_door: [
        { speaker: 'Narrateur', text: '*Un voisin ouvre* QU\'EST-CE QUE VOUS FOUTEZ ?!', portrait: null },
        { speaker: 'Léa', text: '*gênée* Désolé ! On s\'est trompés !', portrait: null },
        { speaker: 'JB', text: '*s\'enfuit vers une autre porte*', portrait: 'running', next: 'door_select' }
    ],

    victory_door: [
        { speaker: 'JB', text: '*la clé tourne* YESSS !', portrait: 'openDoor' },
        { speaker: 'Léa', text: 'Enfin ! J\'y croyais plus.', portrait: null, next: 'victory' }
    ],

    game_over_weird: [
        { speaker: 'Léa', text: 'Ok là c\'est trop bizarre pour moi... Salut !', portrait: null },
        { speaker: 'JB', text: '*se prend une gifle mentale*', portrait: 'slapped' },
        { speaker: 'Narrateur', text: '*elle appelle un Uber... sans toi*', portrait: null, next: 'game_over' }
    ],

    // Dialogues pour les mini-jeux
    drunk_intro: [
        { speaker: 'Narrateur', text: '~ Sur le chemin... ~', portrait: null },
        { speaker: 'Léa', text: 'Euh... T\'es sûr que ça va ? Tu tangues un peu là.', portrait: null },
        { speaker: 'JB', text: 'Moi ? Nan nan, c\'est les... les pavés qui bougent !', portrait: 'damage' },
        { speaker: 'Léa', text: '*soupir* Essaie au moins de marcher droit...', portrait: null, next: 'start_drunk_game' }
    ],

    drunk_success: [
        { speaker: 'Léa', text: 'Bon finalement t\'assures ! J\'ai cru que tu allais tomber.', portrait: null },
        { speaker: 'JB', text: '*fier de lui* Je gère ! C\'est l\'adrenaline.', portrait: 'thumbsUp' },
        { speaker: 'Léa', text: '*rit* Ok champion. On continue !', portrait: null, next: 'find_charger' }
    ],

    drunk_fail: [
        { speaker: 'Narrateur', text: '*JB s\'étale sur le trottoir*', portrait: null },
        { speaker: 'Léa', text: 'Oh mon dieu ! Ça va ?!', portrait: null },
        { speaker: 'JB', text: '*se relève tant bien que mal* Ça va ça va... C\'est rien !', portrait: 'damage' },
        { speaker: 'Léa', text: '*gênée* On va peut-être ralentir...', portrait: null, next: 'find_charger' }
    ],

    tea_intro: [
        { speaker: 'Mehmet', text: 'Tu veux charger ton téléphone ? D\'accord...', portrait: null },
        { speaker: 'Mehmet', text: 'Mais d\'abord, montre-moi que tu respectes le thé turc !', portrait: null },
        { speaker: 'JB', text: 'Euh... comment ça ?', portrait: 'damage' },
        { speaker: 'Mehmet', text: '*lui tend une théière* Sers-moi trois tasses. PARFAITEMENT.', portrait: null, next: 'start_tea_game' }
    ],

    stealth_intro: [
        { speaker: 'Narrateur', text: '~ Couloir de l\'immeuble - 2h34 ~', portrait: null },
        { speaker: 'Léa', text: '*chuchote* Il est super tard, fais pas de bruit !', portrait: null },
        { speaker: 'JB', text: '*chuchote* T\'inquiète, je suis discret comme une...', portrait: 'idle' },
        { speaker: 'Narrateur', text: '*Une porte grince quelque part*', portrait: null },
        { speaker: 'Léa', text: '*chuchote* CHUT ! Avance doucement !', portrait: null, next: 'start_stealth_game' }
    ],

    stealth_fail: [
        { speaker: 'Narrateur', text: '*Un voisin ouvre sa porte*', portrait: null },
        { speaker: 'Narrateur', text: 'VOUS FOUTEZ QUOI À CETTE HEURE ?!', portrait: null },
        { speaker: 'Léa', text: '*morte de honte* Pardon pardon pardon !', portrait: null },
        { speaker: 'JB', text: '*se cache le visage*', portrait: 'crying' },
        { speaker: 'Narrateur', text: '*Ils attendent que le voisin rentre...*', portrait: null, next: 'stealth_retry' }
    ],

    stealth_retry: [
        { speaker: 'Léa', text: 'Ok... On réessaye. DOUCEMENT cette fois.', portrait: null },
        { speaker: 'JB', text: 'Promis promis !', portrait: 'thumbsUp', next: 'start_stealth_game' }
    ],

    memory_intro: [
        { speaker: 'JB', text: 'Attends je check les SMS d\'Abel...', portrait: 'checkMap' },
        { speaker: 'Léa', text: 'Il t\'a envoyé l\'adresse ?', portrait: null },
        { speaker: 'JB', text: 'Ouais mais... mon tel va s\'éteindre ! Faut que je mémorise vite !', portrait: 'damage' },
        { speaker: 'Narrateur', text: '*L\'écran clignote dangereusement...*', portrait: null, next: 'start_memory_game' }
    ]
};

// =====================================================
// NEGOTIATION DATA
// =====================================================
const NegotiationData = [
    {
        mehmet: "On ferme là mon ami ! Il est tard !",
        mood: '😐',
        choices: [
            { text: "S'il vous plaît, juste 10 minutes pour charger !", mood: 10, next: 1 },
            { text: "Je vous paie un thé si vous me laissez charger !", mood: 25, next: 1 },
            { text: "C'est une urgence, ma mère est à l'hôpital !", mood: -20, next: 'angry' },
            { text: "*essayer de forcer l'entrée*", mood: -50, next: 'angry' }
        ]
    },
    {
        mehmet: "*hésite* Un thé tu dis ? Hmm...",
        mood: '🤔',
        choices: [
            { text: "Oui ! Et un baklava aussi, je meurs de faim !", mood: 30, next: 'success' },
            { text: "Le meilleur thé de Paris qu'on m'a dit !", mood: 20, next: 2 },
            { text: "Allez quoi, soyez cool...", mood: -10, next: 'fail' }
        ]
    },
    {
        mehmet: "*flatté* Ah tu connais le bon thé toi !",
        mood: '😊',
        choices: [
            { text: "Mon grand-père était turc ! (mensonge)", mood: 15, next: 3 },
            { text: "J'adore la culture turque !", mood: 20, next: 'success' },
            { text: "Ouais enfin bon, le chargeur ?", mood: -15, next: 'fail' }
        ]
    },
    {
        mehmet: "*suspicieux* Turc ? C'est quoi son nom ?",
        mood: '🧐',
        choices: [
            { text: "Euh... Mehmet ! Comme vous !", mood: 10, next: 'success' },
            { text: "Ibrahim... Kebaboglu ?", mood: -30, next: 'angry' },
            { text: "*avouer le mensonge en rigolant*", mood: 5, next: 'success' }
        ]
    }
];

// =====================================================
// SOUND EFFECTS (using Web Audio API for simple sounds)
// =====================================================
const AudioManager = {
    context: null,

    init() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
    },

    playTone(frequency, duration, type = 'sine') {
        if (!this.context) this.init();
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;
        gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
    },

    click() { this.playTone(800, 0.1); },
    success() { this.playTone(523, 0.1); setTimeout(() => this.playTone(659, 0.1), 100); setTimeout(() => this.playTone(784, 0.2), 200); },
    fail() { this.playTone(200, 0.3, 'sawtooth'); },
    heartLost() { this.playTone(300, 0.2, 'triangle'); }
};

// =====================================================
// UI MANAGER
// =====================================================
const UI = {
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
        });
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }
    },

    showScene(sceneId) {
        document.querySelectorAll('.game-scene').forEach(s => {
            s.classList.remove('active');
        });
        const scene = document.getElementById(sceneId);
        if (scene) {
            scene.classList.add('active');
        }
    },

    updateHUD() {
        // Update hearts
        const hearts = document.querySelectorAll('#hearts .heart');
        hearts.forEach((heart, i) => {
            if (i >= GameState.interest) {
                if (!heart.classList.contains('empty')) {
                    heart.classList.add('lost');
                    setTimeout(() => {
                        heart.classList.remove('lost');
                        heart.classList.add('empty');
                    }, 500);
                }
            } else {
                heart.classList.remove('empty', 'lost');
            }
        });

        // Update weirdness bar
        const weirdFill = document.getElementById('weird-fill');
        if (weirdFill) {
            weirdFill.style.width = (GameState.weirdness / GameState.maxWeirdness * 100) + '%';
        }
    },

    setLocation(name) {
        const locationName = document.getElementById('location-name');
        if (locationName) {
            locationName.textContent = name;
        }
    },

    showReaction(emoji) {
        const reaction = document.getElementById('girl-reaction');
        if (reaction) {
            reaction.textContent = emoji;
            reaction.classList.add('show');
            setTimeout(() => reaction.classList.remove('show'), 1500);
        }
    },

    typeText(element, text, callback) {
        let i = 0;
        element.textContent = '';
        const cursor = element.parentElement?.querySelector('.text-cursor');

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, 30);
            } else {
                if (cursor) cursor.style.display = 'inline';
                if (callback) callback();
            }
        };

        if (cursor) cursor.style.display = 'none';
        type();
    },

    setMascotAnimation(videoElement, animationType) {
        if (!videoElement) return;

        const url = GameState.getAnimationUrl(animationType);
        if (!url) return;

        const source = videoElement.querySelector('source');
        if (source) {
            source.src = url;
            source.type = BrowserDetect.getVideoType();
            videoElement.load();
            videoElement.play().catch(() => {});
        } else {
            // If no source element, set src directly
            videoElement.src = url;
            videoElement.load();
            videoElement.play().catch(() => {});
        }
    },

    // Initialize all video elements with the correct format
    initAllVideos() {
        const videoMappings = {
            'jb-idle': 'inBar',           // Title screen - JB at bar
            'jb-sprite': 'talkToGirl',    // Bar scene - talking to Léa
            'jb-sprite-street': 'running', // Street scene - running
            'jb-sprite-salon': 'kebab',    // Salon scene - eating kebab
            'jb-defeated': 'slapped',      // Game over - got slapped
            'jb-victory': 'victory',       // Victory screen
            'jb-running': 'running'        // Transition screen
        };

        Object.entries(videoMappings).forEach(([id, anim]) => {
            const video = document.getElementById(id);
            if (video) {
                this.setMascotAnimation(video, anim);
            }
        });
    }
};

// =====================================================
// DIALOGUE SYSTEM
// =====================================================
const DialogueSystem = {
    currentBranch: null,
    currentIndex: 0,
    isTyping: false,
    typeInterval: null,

    start(branchName) {
        // Clear any ongoing typing
        if (this.typeInterval) {
            clearInterval(this.typeInterval);
            this.typeInterval = null;
        }

        if (!Dialogues[branchName]) {
            console.error('Branch not found:', branchName);
            return;
        }

        this.currentBranch = Dialogues[branchName];
        this.currentIndex = 0;
        GameState.dialogueBranch = branchName;
        this.isTyping = false;
        this.showCurrent();
    },

    showCurrent() {
        if (!this.currentBranch || this.currentIndex >= this.currentBranch.length) {
            return;
        }

        const dialogue = this.currentBranch[this.currentIndex];
        const speakerName = document.getElementById('speaker-name');
        const dialogueText = document.getElementById('dialogue-text');
        const choicesContainer = document.getElementById('choices-container');
        const speakerPortrait = document.getElementById('speaker-portrait');
        const speakerVideo = document.getElementById('speaker-video');

        // Clear choices first
        if (choicesContainer) choicesContainer.innerHTML = '';

        // Set speaker name with color based on who's speaking
        if (speakerName) {
            speakerName.textContent = dialogue.speaker;
            speakerName.className = 'speaker-name';
            if (dialogue.speaker === 'JB') {
                speakerName.classList.add('speaker-jb');
            } else if (dialogue.speaker === 'Léa') {
                speakerName.classList.add('speaker-lea');
            } else if (dialogue.speaker === 'Mehmet') {
                speakerName.classList.add('speaker-mehmet');
            } else {
                speakerName.classList.add('speaker-narrator');
            }
        }

        // Set portrait animation
        if (dialogue.portrait && speakerVideo && speakerPortrait) {
            UI.setMascotAnimation(speakerVideo, dialogue.portrait);
            speakerPortrait.style.display = 'flex';
        } else if (speakerPortrait) {
            speakerPortrait.style.display = 'none';
        }

        // Display text with typewriter effect
        if (dialogueText) {
            this.isTyping = true;
            this.typeTextEffect(dialogueText, dialogue.text, () => {
                this.isTyping = false;

                // Show choices if any
                if (dialogue.choices) {
                    this.showChoices(dialogue.choices);
                } else if (dialogue.next) {
                    // Auto-continue to special branch
                    choicesContainer.innerHTML = '';
                    const continueBtn = document.createElement('button');
                    continueBtn.className = 'choice-btn';
                    continueBtn.textContent = 'Continuer';
                    continueBtn.onclick = () => this.handleSpecialBranch(dialogue.next);
                    choicesContainer.appendChild(continueBtn);
                } else {
                    // Regular continue
                    choicesContainer.innerHTML = '';
                    const continueBtn = document.createElement('button');
                    continueBtn.className = 'choice-btn';
                    continueBtn.textContent = 'Continuer';
                    continueBtn.onclick = () => this.next();
                    choicesContainer.appendChild(continueBtn);
                }
            });
        }
    },

    // Typewriter effect for dialogue
    typeTextEffect(element, text, callback) {
        // Clear any previous interval
        if (this.typeInterval) {
            clearInterval(this.typeInterval);
        }

        element.textContent = '';
        let i = 0;

        this.typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(this.typeInterval);
                this.typeInterval = null;
                if (callback) callback();
            }
        }, 25);
    },

    showChoices(choices) {
        const container = document.getElementById('choices-container');
        if (!container) return;
        container.innerHTML = '';

        choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.onclick = () => this.selectChoice(choice);
            btn.style.animationDelay = (index * 0.1) + 's';
            container.appendChild(btn);
        });
    },

    selectChoice(choice) {
        AudioManager.click();

        // Apply effects
        if (choice.effect) {
            if (choice.effect.interest) {
                GameState.interest = Math.max(0, Math.min(GameState.maxInterest, GameState.interest + choice.effect.interest));
                if (choice.effect.interest > 0) {
                    UI.showReaction('😊');
                } else if (choice.effect.interest < 0) {
                    UI.showReaction('😕');
                    AudioManager.heartLost();
                }
            }
            if (choice.effect.weirdness) {
                GameState.weirdness = Math.max(0, Math.min(GameState.maxWeirdness, GameState.weirdness + choice.effect.weirdness));
                if (choice.effect.weirdness > 1) {
                    UI.showReaction('😬');
                }
            }
            UI.updateHUD();

            // Check game over conditions
            if (GameState.interest <= 0) {
                this.handleSpecialBranch('game_over');
                return;
            }
            if (GameState.weirdness >= GameState.maxWeirdness) {
                this.handleSpecialBranch('game_over_weird');
                return;
            }
        }

        // Go to next branch
        if (choice.next) {
            this.handleSpecialBranch(choice.next);
        } else {
            this.next();
        }
    },

    next() {
        this.currentIndex++;
        if (this.currentIndex >= this.currentBranch.length) {
            return;
        }
        this.showCurrent();
    },

    handleSpecialBranch(branch) {
        // Clear any ongoing typing first
        if (this.typeInterval) {
            clearInterval(this.typeInterval);
            this.typeInterval = null;
        }

        switch (branch) {
            case 'start_negotiate':
                startNegotiation();
                break;
            case 'building_select':
                showBuildingSelect();
                break;
            case 'floor_select':
                showFloorSelect();
                break;
            case 'door_select':
                showDoorSelect();
                break;
            case 'game_over':
            case 'game_over_weird':
                showGameOver();
                break;
            case 'victory':
                showVictory();
                break;
            // Mini-jeux
            case 'start_drunk_game':
                DrunkWalkGame.start();
                break;
            case 'start_tea_game':
                TeaPourGame.start();
                break;
            case 'start_memory_game':
                MemoryGame.start('building');
                break;
            case 'start_memory_floor':
                MemoryGame.start('floor');
                break;
            case 'start_memory_door':
                MemoryGame.start('door');
                break;
            case 'start_stealth_game':
                StealthGame.start();
                break;
            default:
                if (Dialogues[branch]) {
                    // Scene transitions with animations
                    if (branch === 'leaving_bar') {
                        transition('Sortie du bar...', () => {
                            UI.showScene('scene-street');
                            UI.setLocation('Devant Le Tropical');
                            // Start drunk walk intro instead
                            this.start('drunk_intro');
                        });
                    } else if (branch === 'find_charger') {
                        // After drunk walk, continue to find charger
                        this.start('no_data');
                    } else if (branch === 'go_to_salon' || branch === 'salon_intro') {
                        transition('Direction le salon de thé !', () => {
                            UI.showScene('scene-salon');
                            UI.setLocation('Chez Mehmet');
                            // Set salon scene animation
                            const salonSprite = document.getElementById('jb-sprite-salon');
                            if (salonSprite) UI.setMascotAnimation(salonSprite, 'kebab');
                            // Start tea intro instead of negotiate
                            this.start('tea_intro');
                        });
                    } else if (branch === 'to_maze' || branch === 'maze_intro') {
                        transition('En route vers chez Abel...', () => {
                            UI.showScene('scene-maze');
                            UI.setLocation('Quartier résidentiel');
                            setupMaze();
                            // Start memory game intro
                            this.start('memory_intro');
                        });
                    } else if (branch === 'right_building') {
                        // After memory building, show dialogue then floor memory
                        this.start(branch);
                    } else if (branch === 'right_floor') {
                        // After memory floor, go to stealth
                        UI.showScene('scene-corridor');
                        UI.setLocation('Couloir');
                        this.start('stealth_intro');
                    } else {
                        // No transition needed, just start the branch
                        this.start(branch);
                    }
                } else {
                    console.warn('Unknown branch:', branch);
                }
                break;
        }
    }
};

// =====================================================
// TRANSITION
// =====================================================
function transition(text, callback) {
    const transitionScreen = document.getElementById('transition-screen');
    const transitionText = document.getElementById('transition-text');

    if (transitionText) transitionText.textContent = text;

    // Start running animation for transition
    const runningVideo = document.getElementById('jb-running');
    if (runningVideo) {
        UI.setMascotAnimation(runningVideo, 'running');
    }

    UI.showScreen('transition-screen');

    setTimeout(() => {
        UI.showScreen('game-screen');
        if (callback) callback();
    }, 1500);
}

// =====================================================
// NEGOTIATION MINIGAME
// =====================================================
function startNegotiation() {
    GameState.negotiationPhase = 0;
    GameState.negotiateTimeLeft = 60;

    UI.showScreen('minigame-negotiate');
    showNegotiationPhase();

    // Start timer
    clearInterval(GameState.negotiateTimer);
    GameState.negotiateTimer = setInterval(() => {
        GameState.negotiateTimeLeft--;
        updateNegotiateTimer();
        if (GameState.negotiateTimeLeft <= 0) {
            endNegotiation('timeout');
        }
    }, 1000);
}

function updateNegotiateTimer() {
    const timer = document.getElementById('negotiate-timer');
    const mins = Math.floor(GameState.negotiateTimeLeft / 60);
    const secs = GameState.negotiateTimeLeft % 60;
    timer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showNegotiationPhase() {
    const phase = NegotiationData[GameState.negotiationPhase];
    if (!phase) return;

    document.getElementById('mehmet-text').textContent = phase.mehmet;
    document.querySelector('#mehmet-mood .mood-emoji').textContent = phase.mood;

    const choicesContainer = document.getElementById('negotiate-choices');
    choicesContainer.innerHTML = '';

    phase.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'negotiate-btn';
        btn.textContent = choice.text;
        btn.onclick = () => makeNegotiationChoice(choice);
        choicesContainer.appendChild(btn);
    });
}

function makeNegotiationChoice(choice) {
    AudioManager.click();

    // Visual feedback
    const mehmetText = document.getElementById('mehmet-text');
    mehmetText.style.color = choice.mood > 0 ? '#4ecdc4' : '#e94560';
    setTimeout(() => mehmetText.style.color = '', 500);

    // Apply effects
    if (choice.mood < 0) {
        GameState.weirdness += Math.abs(Math.floor(choice.mood / 10));
        UI.updateHUD();
    }

    if (typeof choice.next === 'number') {
        GameState.negotiationPhase = choice.next;
        setTimeout(showNegotiationPhase, 800);
    } else {
        endNegotiation(choice.next);
    }
}

function endNegotiation(result) {
    clearInterval(GameState.negotiateTimer);
    UI.showScreen('game-screen');

    switch (result) {
        case 'success':
            GameState.interest = Math.min(GameState.maxInterest, GameState.interest + 1);
            AudioManager.success();
            DialogueSystem.start('negotiate_success');
            break;
        case 'fail':
            DialogueSystem.start('negotiate_fail');
            break;
        case 'angry':
            GameState.interest--;
            GameState.weirdness += 2;
            AudioManager.fail();
            DialogueSystem.start('negotiate_angry');
            break;
        case 'timeout':
            GameState.interest--;
            DialogueSystem.start('negotiate_angry');
            break;
    }
    UI.updateHUD();
}

// =====================================================
// MAZE / BUILDING SELECTION
// =====================================================
function setupMaze() {
    GameState.correctBuilding = Math.floor(Math.random() * 3);
    GameState.correctFloor = Math.floor(Math.random() * 5) + 1;
    GameState.correctDoor = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
}

function showBuildingSelect() {
    UI.showScene('scene-maze');

    const container = document.getElementById('buildings-container');
    container.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const building = document.createElement('div');
        building.className = 'apartment';
        building.innerHTML = `
            <div class="apartment-windows">
                ${Array(12).fill().map(() =>
                    `<div class="window ${Math.random() > 0.5 ? 'lit' : ''}"></div>`
                ).join('')}
            </div>
        `;
        building.onclick = () => selectBuilding(i);
        container.appendChild(building);
    }
}

function selectBuilding(index) {
    AudioManager.click();

    if (index === GameState.correctBuilding) {
        AudioManager.success();
        DialogueSystem.start('right_building');
    } else {
        GameState.interest--;
        GameState.weirdness++;
        AudioManager.fail();
        UI.updateHUD();
        DialogueSystem.start('wrong_building');
    }
}

function showFloorSelect() {
    UI.showScreen('minigame-floor');

    const hints = [
        '"C\'est pas trop haut" - Abel',
        '"Au milieu je crois" - Abel',
        '"Fais pas de bruit en montant" - Abel'
    ];
    document.getElementById('floor-hint').textContent = hints[Math.floor(Math.random() * hints.length)];

    const container = document.getElementById('floor-buttons');
    container.innerHTML = '';

    for (let i = 5; i >= 1; i--) {
        const btn = document.createElement('button');
        btn.className = 'floor-btn';
        btn.textContent = `Étage ${i}`;
        btn.onclick = () => selectFloor(i);
        container.appendChild(btn);
    }
}

function selectFloor(floor) {
    AudioManager.click();
    UI.showScreen('game-screen');

    if (floor === GameState.correctFloor) {
        AudioManager.success();
        DialogueSystem.start('right_floor');
    } else {
        GameState.interest--;
        GameState.weirdness++;
        AudioManager.fail();
        UI.updateHUD();
        DialogueSystem.start('wrong_floor');
    }
}

function showDoorSelect() {
    UI.showScene('scene-corridor');

    const container = document.getElementById('doors-container');
    container.innerHTML = '';

    const doors = ['A', 'B', 'C', 'D'];
    const wrongDoor = doors.filter(d => d !== GameState.correctDoor)[Math.floor(Math.random() * 3)];

    // Update hint in dialogue
    const hint = `Abel a dit: "C'est la porte ${GameState.correctDoor}... ou ${wrongDoor}? J'sais plus."`;

    doors.forEach(letter => {
        const door = document.createElement('div');
        door.className = 'door';
        door.innerHTML = `
            <span class="door-label">${letter}</span>
            <div class="door-knob"></div>
        `;
        door.onclick = () => selectDoor(letter);
        container.appendChild(door);
    });
}

function selectDoor(letter) {
    AudioManager.click();

    if (letter === GameState.correctDoor) {
        AudioManager.success();
        DialogueSystem.start('victory_door');
    } else {
        GameState.interest--;
        GameState.weirdness += 2;
        AudioManager.fail();
        UI.updateHUD();

        if (GameState.interest <= 0) {
            showGameOver();
        } else {
            DialogueSystem.start('wrong_door');
        }
    }
}

// =====================================================
// GAME OVER & VICTORY
// =====================================================
function showGameOver() {
    clearInterval(GameState.negotiateTimer);
    const reason = GameState.weirdness >= GameState.maxWeirdness
        ? 'Trop bizarre... Elle a appelé un Uber sans toi.'
        : 'Elle a perdu tout intérêt... "J\'ai un truc tôt demain."';

    document.getElementById('game-over-reason').textContent = reason;

    // Use slapped animation for weird game over, crying for interest loss
    const defeatedVideo = document.getElementById('jb-defeated');
    if (defeatedVideo) {
        const anim = GameState.weirdness >= GameState.maxWeirdness ? 'slapped' : 'crying';
        UI.setMascotAnimation(defeatedVideo, anim);
    }

    UI.showScreen('game-over-screen');
    AudioManager.fail();
}

function showVictory() {
    // Set victory animation
    const victoryVideo = document.getElementById('jb-victory');
    if (victoryVideo) {
        UI.setMascotAnimation(victoryVideo, 'victory');
    }

    UI.showScreen('victory-screen');
    AudioManager.success();

    // Create confetti
    const container = document.getElementById('confetti');
    container.innerHTML = '';
    const colors = ['#ff2d75', '#ffd93d', '#00f5ff', '#b14aed', '#4ade80'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(confetti);
        }, i * 50);
    }
}

// =====================================================
// GAME CONTROL
// =====================================================
function startGame() {
    AudioManager.click();

    // Reset state
    GameState.interest = 5;
    GameState.weirdness = 0;
    GameState.currentScene = 'bar';

    // Update UI
    UI.updateHUD();
    UI.setLocation('Le Tropical');
    UI.showScreen('game-screen');
    UI.showScene('scene-bar');

    // Set bar scene animation
    const barSprite = document.getElementById('jb-sprite');
    if (barSprite) UI.setMascotAnimation(barSprite, 'inBar');

    // Start dialogue
    DialogueSystem.start('bar_intro');
}

// Jump directly to a specific mini-game (for testing/quick access)
function jumpToLevel(level) {
    AudioManager.click();

    // Reset state
    GameState.interest = 5;
    GameState.weirdness = 0;
    MemoryGame.cluesGenerated = false;

    // Update UI
    UI.updateHUD();
    UI.showScreen('game-screen');

    switch (level) {
        case 'drunk':
            UI.setLocation('Rue');
            UI.showScene('scene-street');
            DrunkWalkGame.start();
            break;
        case 'tea':
            UI.setLocation('Chez Mehmet');
            UI.showScene('scene-salon');
            TeaPourGame.start();
            break;
        case 'memory':
            UI.setLocation('Quartier résidentiel');
            UI.showScene('scene-maze');
            setupMaze();
            MemoryGame.start('building');
            break;
        case 'stealth':
            UI.setLocation('Couloir');
            UI.showScene('scene-corridor');
            StealthGame.start();
            break;
    }
}

function restartGame() {
    AudioManager.click();

    // Reset everything
    GameState.interest = 5;
    GameState.weirdness = 0;
    clearInterval(GameState.negotiateTimer);

    // Reset MemoryGame for new playthrough
    MemoryGame.cluesGenerated = false;
    if (MemoryGame.timerInterval) {
        clearInterval(MemoryGame.timerInterval);
        MemoryGame.timerInterval = null;
    }

    // Reset hearts display
    document.querySelectorAll('#hearts .heart').forEach(h => {
        h.classList.remove('empty', 'lost');
    });

    // Clear confetti
    document.getElementById('confetti').innerHTML = '';

    // Go to title
    UI.showScreen('title-screen');
}

// =====================================================
// MINI-JEU: MARCHE SOBRE (Drunk Walk)
// =====================================================
const DrunkWalkGame = {
    active: false,
    balance: 0, // -100 to 100, 0 = center
    swaySpeed: 2,
    swayDirection: 1,
    progress: 0,
    targetProgress: 100,
    gameLoop: null,
    keys: { left: false, right: false },

    start() {
        this.active = true;
        this.balance = 0;
        this.progress = 0;
        this.swaySpeed = 3.5; // HARDER: was 2
        this.swayDirection = Math.random() > 0.5 ? 1 : -1;

        UI.showScreen('minigame-drunk');

        // Set animation
        const drunkSprite = document.getElementById('jb-drunk-sprite');
        if (drunkSprite) UI.setMascotAnimation(drunkSprite, 'running');

        // Key handlers
        this.keyDownHandler = (e) => this.handleKeyDown(e);
        this.keyUpHandler = (e) => this.handleKeyUp(e);
        document.addEventListener('keydown', this.keyDownHandler);
        document.addEventListener('keyup', this.keyUpHandler);

        // Touch handlers for mobile
        const btnLeft = document.getElementById('drunk-btn-left');
        const btnRight = document.getElementById('drunk-btn-right');

        this.touchStartLeft = () => { this.keys.left = true; };
        this.touchEndLeft = () => { this.keys.left = false; };
        this.touchStartRight = () => { this.keys.right = true; };
        this.touchEndRight = () => { this.keys.right = false; };

        if (btnLeft) {
            btnLeft.addEventListener('touchstart', this.touchStartLeft);
            btnLeft.addEventListener('touchend', this.touchEndLeft);
            btnLeft.addEventListener('mousedown', this.touchStartLeft);
            btnLeft.addEventListener('mouseup', this.touchEndLeft);
            btnLeft.addEventListener('mouseleave', this.touchEndLeft);
        }
        if (btnRight) {
            btnRight.addEventListener('touchstart', this.touchStartRight);
            btnRight.addEventListener('touchend', this.touchEndRight);
            btnRight.addEventListener('mousedown', this.touchStartRight);
            btnRight.addEventListener('mouseup', this.touchEndRight);
            btnRight.addEventListener('mouseleave', this.touchEndRight);
        }

        // Start game loop
        this.gameLoop = setInterval(() => this.update(), 50);

        this.updateUI();
    },

    handleKeyDown(e) {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            this.keys.left = true;
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            this.keys.right = true;
        }
    },

    handleKeyUp(e) {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            this.keys.left = false;
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            this.keys.right = false;
        }
    },

    update() {
        if (!this.active) return;

        // Natural sway (gets faster over time)
        this.balance += this.swayDirection * this.swaySpeed;

        // Random direction changes
        if (Math.random() < 0.02) {
            this.swayDirection *= -1;
        }

        // Player input
        if (this.keys.left) this.balance -= 4;
        if (this.keys.right) this.balance += 4;

        // Clamp balance
        this.balance = Math.max(-100, Math.min(100, this.balance));

        // Progress (only if balanced) - HARDER: zone reduced from 60 to 45
        if (Math.abs(this.balance) < 45) {
            this.progress += 0.5;
            // Increase difficulty - HARDER: faster scaling
            this.swaySpeed = 3.5 + (this.progress / 30);
        }

        // Update companion bubble
        const bubble = document.getElementById('drunk-bubble');
        if (Math.abs(this.balance) > 70) {
            bubble.textContent = "ATTENTION !";
            bubble.style.color = '#ff2d75';
        } else if (Math.abs(this.balance) > 40) {
            bubble.textContent = "Euh... ça va ?";
            bubble.style.color = '#ffd93d';
        } else {
            bubble.textContent = "C'est bien !";
            bubble.style.color = '#4ade80';
        }

        this.updateUI();

        // Check win/lose
        if (Math.abs(this.balance) >= 100) {
            this.end(false);
        } else if (this.progress >= this.targetProgress) {
            this.end(true);
        }
    },

    updateUI() {
        // Balance indicator
        const indicator = document.getElementById('balance-indicator');
        if (indicator) {
            indicator.style.left = `${50 + this.balance / 2}%`;
        }

        // Character position
        const jb = document.getElementById('drunk-jb');
        if (jb) {
            jb.style.transform = `translateX(${this.balance}px) rotate(${this.balance / 5}deg)`;
        }

        // Progress bar
        const progressBar = document.getElementById('drunk-progress');
        if (progressBar) {
            progressBar.style.width = `${100 - this.progress}%`;
        }
    },

    end(success) {
        this.active = false;
        clearInterval(this.gameLoop);
        document.removeEventListener('keydown', this.keyDownHandler);
        document.removeEventListener('keyup', this.keyUpHandler);

        // Clean up touch handlers
        const btnLeft = document.getElementById('drunk-btn-left');
        const btnRight = document.getElementById('drunk-btn-right');
        if (btnLeft) {
            btnLeft.removeEventListener('touchstart', this.touchStartLeft);
            btnLeft.removeEventListener('touchend', this.touchEndLeft);
            btnLeft.removeEventListener('mousedown', this.touchStartLeft);
            btnLeft.removeEventListener('mouseup', this.touchEndLeft);
            btnLeft.removeEventListener('mouseleave', this.touchEndLeft);
        }
        if (btnRight) {
            btnRight.removeEventListener('touchstart', this.touchStartRight);
            btnRight.removeEventListener('touchend', this.touchEndRight);
            btnRight.removeEventListener('mousedown', this.touchStartRight);
            btnRight.removeEventListener('mouseup', this.touchEndRight);
            btnRight.removeEventListener('mouseleave', this.touchEndRight);
        }

        if (success) {
            AudioManager.success();
            GameState.interest = Math.min(GameState.maxInterest, GameState.interest + 1);
            UI.showScreen('game-screen');
            DialogueSystem.start('drunk_success');
        } else {
            AudioManager.fail();
            GameState.interest--;
            GameState.weirdness += 2;
            UI.updateHUD();
            if (GameState.interest <= 0) {
                showGameOver();
            } else {
                UI.showScreen('game-screen');
                DialogueSystem.start('drunk_fail');
            }
        }
    }
};

// =====================================================
// MINI-JEU: SERVICE PARFAIT (Tea Pouring)
// =====================================================
const TeaPourGame = {
    active: false,
    pouring: false,
    teaLevel: 0,
    targetMin: 0,
    targetMax: 0,
    round: 0,
    maxRounds: 3,
    score: 0,
    gameLoop: null,

    start() {
        this.active = true;
        this.round = 0;
        this.score = 0;

        UI.showScreen('minigame-tea');
        this.nextRound();

        // Input handlers
        this.keyDownHandler = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.startPour();
            }
        };
        this.keyUpHandler = (e) => {
            if (e.code === 'Space') {
                this.stopPour();
            }
        };
        this.mouseDownHandler = () => this.startPour();
        this.mouseUpHandler = () => this.stopPour();

        document.addEventListener('keydown', this.keyDownHandler);
        document.addEventListener('keyup', this.keyUpHandler);
        document.getElementById('minigame-tea').addEventListener('mousedown', this.mouseDownHandler);
        document.getElementById('minigame-tea').addEventListener('mouseup', this.mouseUpHandler);
    },

    nextRound() {
        this.round++;
        this.teaLevel = 0;
        this.pouring = false;

        // Random target zone (between 40-90%) - HARDER: smaller zones
        const targetCenter = 40 + Math.random() * 40;
        const targetSize = 12 - this.round * 3; // HARDER: was 15, now starts at 12
        this.targetMin = targetCenter - targetSize / 2;
        this.targetMax = targetCenter + targetSize / 2;

        // Update UI
        const target = document.getElementById('tea-target');
        if (target) {
            target.style.bottom = `${this.targetMin}%`;
            target.style.height = `${this.targetMax - this.targetMin}%`;
        }

        const liquid = document.getElementById('tea-liquid');
        if (liquid) liquid.style.height = '0%';

        const stream = document.getElementById('tea-stream');
        if (stream) stream.classList.remove('active');

        // Update round indicators
        const dots = document.querySelectorAll('#tea-rounds .round-dot');
        dots.forEach((dot, i) => {
            dot.classList.remove('active', 'success', 'fail');
            if (i < this.round - 1) {
                dot.classList.add('success');
            } else if (i === this.round - 1) {
                dot.classList.add('active');
            }
        });

        document.getElementById('mehmet-comment').textContent = `Tour ${this.round}/${this.maxRounds} - Vas-y !`;
        document.getElementById('mehmet-face').textContent = '😐';
    },

    startPour() {
        if (!this.active || this.teaLevel >= 100) return;
        this.pouring = true;

        const stream = document.getElementById('tea-stream');
        if (stream) stream.classList.add('active');

        // Start pour loop
        if (!this.gameLoop) {
            this.gameLoop = setInterval(() => this.updatePour(), 50);
        }
    },

    stopPour() {
        if (!this.active) return;
        this.pouring = false;

        const stream = document.getElementById('tea-stream');
        if (stream) stream.classList.remove('active');

        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }

        // Evaluate pour
        this.evaluatePour();
    },

    updatePour() {
        if (!this.pouring || this.teaLevel >= 100) return;

        this.teaLevel += 3; // HARDER: was 2, now 3 (faster pour)
        this.teaLevel = Math.min(100, this.teaLevel);

        const liquid = document.getElementById('tea-liquid');
        if (liquid) {
            liquid.style.height = `${this.teaLevel}%`;
        }

        // Overflow check
        if (this.teaLevel >= 100) {
            this.stopPour();
        }
    },

    evaluatePour() {
        const dots = document.querySelectorAll('#tea-rounds .round-dot');
        const currentDot = dots[this.round - 1];

        if (this.teaLevel >= this.targetMin && this.teaLevel <= this.targetMax) {
            // Perfect!
            this.score++;
            if (currentDot) currentDot.classList.add('success');
            document.getElementById('mehmet-face').textContent = '😊';
            document.getElementById('mehmet-comment').textContent = 'Parfait !';
            AudioManager.success();
        } else if (this.teaLevel > this.targetMax) {
            // Overflow
            if (currentDot) currentDot.classList.add('fail');
            document.getElementById('mehmet-face').textContent = '😠';
            document.getElementById('mehmet-comment').textContent = 'Trop plein !';
            AudioManager.fail();
        } else {
            // Not enough
            if (currentDot) currentDot.classList.add('fail');
            document.getElementById('mehmet-face').textContent = '😕';
            document.getElementById('mehmet-comment').textContent = 'Pas assez...';
            AudioManager.fail();
        }

        // Next round or end
        setTimeout(() => {
            if (this.round >= this.maxRounds) {
                this.end();
            } else {
                this.nextRound();
            }
        }, 1500);
    },

    end() {
        this.active = false;
        document.removeEventListener('keydown', this.keyDownHandler);
        document.removeEventListener('keyup', this.keyUpHandler);
        document.getElementById('minigame-tea').removeEventListener('mousedown', this.mouseDownHandler);
        document.getElementById('minigame-tea').removeEventListener('mouseup', this.mouseUpHandler);

        UI.showScreen('game-screen');

        if (this.score >= 2) {
            // Success - impressed Mehmet
            DialogueSystem.start('negotiate_success');
        } else {
            // Fail
            GameState.weirdness += 2;
            UI.updateHUD();
            DialogueSystem.start('negotiate_angry');
        }
    }
};

// =====================================================
// MINI-JEU: MEMORY INDICES
// =====================================================
const MemoryGame = {
    active: false,
    phase: 'building', // 'building', 'floor', 'door'
    clues: {},
    showingClues: false,
    timerInterval: null,
    cluesGenerated: false,

    start(phase = 'building') {
        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        this.active = true;
        this.phase = phase;
        this.showingClues = true;

        // Only generate clues once (at building phase)
        if (phase === 'building' || !this.cluesGenerated) {
            this.generateClues();
            this.cluesGenerated = true;
        }

        UI.showScreen('minigame-memory');
        document.getElementById('memory-instruction').textContent = 'Mémorise les indices !';

        // Clear previous choices
        document.getElementById('memory-choices').innerHTML = '';

        // Show SMS clues
        this.showClues();

        // Timer to hide clues - HARDER: 3 seconds instead of 5
        const totalTime = 3;
        let timeLeft = totalTime;
        const timerFill = document.getElementById('memory-timer-fill');
        timerFill.style.width = '100%';

        this.timerInterval = setInterval(() => {
            timeLeft -= 0.1;
            timerFill.style.width = `${(timeLeft / totalTime) * 100}%`;

            if (timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
                this.hideCluesAndShowChoices();
            }
        }, 100);
    },

    generateClues() {
        const buildingColors = ['bleu', 'rouge', 'vert'];
        const doorLetters = ['A', 'B', 'C', 'D'];

        // Set correct answers ONCE
        GameState.correctBuilding = Math.floor(Math.random() * 3);
        GameState.correctFloor = Math.floor(Math.random() * 5) + 1;
        GameState.correctDoor = doorLetters[Math.floor(Math.random() * 4)];

        // Subtle/cryptic clues for building
        const buildingClues = {
            'bleu': [
                "Cherche la couleur du ciel frère 🌊",
                "Tu sais, comme les Schtroumpfs mdr",
                "La couleur de mon mood quand t'es pas là 💙",
                "Pense océan, pense avatar le film"
            ],
            'rouge': [
                "Couleur Ferrari tu vois le délire 🏎️",
                "Comme le sang qui coule dans mes veines bg",
                "La couleur de l'amour ou du danger lol",
                "Pense tomate, pense feu 🔥"
            ],
            'vert': [
                "Comme Shrek ou Hulk tu choisis 💚",
                "La couleur de l'espoir mon reuf",
                "Pense nature, pense weed mdrr",
                "Comme les feux quand tu peux passer 🚦"
            ]
        };

        // Subtle clues for floor
        const floorClues = {
            1: [
                "Rdv au rez-de-chaussée presque, juste au dessus",
                "Premier palier après l'entrée fréro",
                "Tout en bas, 1 seul escalier"
            ],
            2: [
                "Deuxième en partant du bas, easy",
                "Comme les 2 yeux de ta face",
                "Un de plus que le premier étage logique"
            ],
            3: [
                "Pile au milieu si y'a 5 étages",
                "Comme les 3 mousquetaires 🗡️",
                "Ni trop haut ni trop bas, parfait"
            ],
            4: [
                "Presque en haut, avant dernier",
                "Comme les 4 saisons ou les 4 fantastiques",
                "L'avant dernier étage gros"
            ],
            5: [
                "Tout en haut frère, dernier étage",
                "Le max, le top, le sommet 🏔️",
                "5/5, full power, tout en haut"
            ]
        };

        // Subtle clues for door
        const doorClues = {
            'A': [
                "Première lettre de l'alphabet, facile",
                "Comme Abel d'ailleurs mdrr",
                "La porte du début, A comme Amour 💕"
            ],
            'B': [
                "Deuxième lettre, après le A",
                "B comme Bro, B comme Boss",
                "Juste après la première porte"
            ],
            'C': [
                "Troisième lettre frérot",
                "C comme... C quoi en fait? 🤔",
                "Ni au début ni à la fin"
            ],
            'D': [
                "Dernière des 4 portes",
                "D comme Daron, D comme Dingue",
                "Tout au bout du couloir gros"
            ]
        };

        const color = buildingColors[GameState.correctBuilding];
        const floor = GameState.correctFloor;
        const door = GameState.correctDoor;

        this.clues = {
            building: {
                color: color,
                text: buildingClues[color][Math.floor(Math.random() * buildingClues[color].length)]
            },
            floor: {
                number: floor,
                text: floorClues[floor][Math.floor(Math.random() * floorClues[floor].length)]
            },
            door: {
                letter: door,
                text: doorClues[door][Math.floor(Math.random() * doorClues[door].length)]
            }
        };
    },

    showClues() {
        const container = document.getElementById('sms-container');
        container.innerHTML = '';

        const clue = this.clues[this.phase];

        const sms = document.createElement('div');
        sms.className = 'sms-message';
        sms.innerHTML = `
            <div class="sms-sender">Abel</div>
            <div class="sms-bubble">${clue.text}</div>
            <div class="sms-time">2:03</div>
        `;
        container.appendChild(sms);

        // Add extra hint
        const hint = document.createElement('div');
        hint.className = 'sms-message';
        hint.innerHTML = `
            <div class="sms-sender">Abel</div>
            <div class="sms-bubble">Retiens bien !</div>
            <div class="sms-time">2:03</div>
        `;
        setTimeout(() => container.appendChild(hint), 500);
    },

    hideCluesAndShowChoices() {
        this.showingClues = false;
        document.getElementById('memory-instruction').textContent = 'Quel était l\'indice ?';

        const smsContainer = document.getElementById('sms-container');
        smsContainer.innerHTML = '<div class="sms-hidden">📱 SMS effacé...</div>';

        const choicesContainer = document.getElementById('memory-choices');
        choicesContainer.innerHTML = '';

        let options = [];
        if (this.phase === 'building') {
            options = [
                { icon: '🏢', color: 'bleu', text: 'Bleu 🏢' },
                { icon: '🏠', color: 'rouge', text: 'Rouge 🏠' },
                { icon: '🏬', color: 'vert', text: 'Vert 🏬' }
            ];
        } else if (this.phase === 'floor') {
            for (let i = 1; i <= 5; i++) {
                options.push({ number: i, text: `Étage ${i}` });
            }
        } else if (this.phase === 'door') {
            ['A', 'B', 'C', 'D'].forEach(letter => {
                options.push({ letter, text: `Porte ${letter}` });
            });
        }

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'memory-choice-btn';
            btn.textContent = opt.text;
            btn.onclick = () => this.selectChoice(opt);
            choicesContainer.appendChild(btn);
        });
    },

    selectChoice(choice) {
        if (!this.active) return;

        let correct = false;
        if (this.phase === 'building') {
            correct = choice.color === this.clues.building.color;
            GameState.selectedBuilding = ['bleu', 'rouge', 'vert'].indexOf(choice.color);
        } else if (this.phase === 'floor') {
            correct = choice.number === this.clues.floor.number;
            GameState.selectedFloor = choice.number;
        } else if (this.phase === 'door') {
            correct = choice.letter === this.clues.door.letter;
            GameState.selectedDoor = choice.letter;
        }

        if (correct) {
            AudioManager.success();
            this.nextPhase();
        } else {
            AudioManager.fail();
            GameState.interest--;
            GameState.weirdness++;
            UI.updateHUD();

            if (GameState.interest <= 0) {
                this.active = false;
                showGameOver();
            } else {
                // Wrong answer, try again
                this.start(this.phase);
            }
        }
    },

    nextPhase() {
        this.active = false;
        UI.showScreen('game-screen');

        if (this.phase === 'building') {
            DialogueSystem.start('right_building');
        } else if (this.phase === 'floor') {
            DialogueSystem.start('right_floor');
        } else if (this.phase === 'door') {
            DialogueSystem.start('victory_door');
        }
    }
};

// =====================================================
// MINI-JEU: STEALTH MODE
// =====================================================
const StealthGame = {
    active: false,
    position: 0,
    targetPosition: 100,
    moving: false,
    noise: 0,
    doors: [],
    gameLoop: null,
    caught: false,

    start() {
        this.active = true;
        this.position = 0;
        this.noise = 0;
        this.caught = false;
        this.doors = [
            { open: false, timer: null, neighbor: '👴' },
            { open: false, timer: null, neighbor: '👵' },
            { open: false, timer: null, neighbor: '😠' }
        ];

        UI.showScreen('minigame-stealth');

        // Set animation
        const stealthSprite = document.getElementById('jb-stealth-sprite');
        if (stealthSprite) UI.setMascotAnimation(stealthSprite, 'idle');

        // Input handlers
        this.keyDownHandler = (e) => {
            if (e.code === 'Space' || e.key === 'ArrowRight') {
                e.preventDefault();
                this.startMoving();
            }
        };
        this.keyUpHandler = (e) => {
            if (e.code === 'Space' || e.key === 'ArrowRight') {
                this.stopMoving();
            }
        };
        this.mouseDownHandler = () => this.startMoving();
        this.mouseUpHandler = () => this.stopMoving();

        document.addEventListener('keydown', this.keyDownHandler);
        document.addEventListener('keyup', this.keyUpHandler);
        document.getElementById('minigame-stealth').addEventListener('mousedown', this.mouseDownHandler);
        document.getElementById('minigame-stealth').addEventListener('mouseup', this.mouseUpHandler);

        // Start game loop
        this.gameLoop = setInterval(() => this.update(), 50);

        // Start random door openings
        this.scheduleDoorOpenings();

        this.updateUI();
    },

    startMoving() {
        if (!this.active || this.caught) return;
        this.moving = true;

        const stealthSprite = document.getElementById('jb-stealth-sprite');
        if (stealthSprite) UI.setMascotAnimation(stealthSprite, 'running');
    },

    stopMoving() {
        this.moving = false;

        const stealthSprite = document.getElementById('jb-stealth-sprite');
        if (stealthSprite) UI.setMascotAnimation(stealthSprite, 'idle');
    },

    scheduleDoorOpenings() {
        this.doors.forEach((door, index) => {
            const scheduleNext = () => {
                if (!this.active) return;

                // HARDER: reduced delay from 2000-5000 to 1000-2500
                const delay = 1000 + Math.random() * 1500;
                door.timer = setTimeout(() => {
                    this.openDoor(index);
                    // HARDER: doors stay open longer (2-3.5s instead of 1.5-2.5s)
                    setTimeout(() => {
                        this.closeDoor(index);
                        scheduleNext();
                    }, 2000 + Math.random() * 1500);
                }, delay);
            };
            scheduleNext();
        });
    },

    openDoor(index) {
        if (!this.active) return;
        this.doors[index].open = true;

        const doorEl = document.querySelectorAll('.stealth-door')[index];
        if (doorEl) {
            doorEl.classList.add('open');
        }
    },

    closeDoor(index) {
        if (!this.active) return;
        this.doors[index].open = false;

        const doorEl = document.querySelectorAll('.stealth-door')[index];
        if (doorEl) {
            doorEl.classList.remove('open');
        }
    },

    update() {
        if (!this.active || this.caught) return;

        // Move if holding
        if (this.moving) {
            this.position += 1;
            this.noise += 0.5;
        } else {
            this.noise = Math.max(0, this.noise - 1);
        }

        // Check if caught (moving while door is open and in range)
        this.doors.forEach((door, index) => {
            if (door.open && this.moving) {
                const doorPosition = (index + 1) * 25;
                if (Math.abs(this.position - doorPosition) < 15) {
                    this.getCaught(index);
                }
            }
        });

        // Noise alert
        if (this.noise >= 100) {
            this.getCaught(-1);
        }

        this.updateUI();

        // Win check
        if (this.position >= this.targetPosition) {
            this.end(true);
        }
    },

    getCaught(doorIndex) {
        this.caught = true;
        this.stopMoving();

        const stealthSprite = document.getElementById('jb-stealth-sprite');
        if (stealthSprite) UI.setMascotAnimation(stealthSprite, 'damage');

        AudioManager.fail();

        setTimeout(() => {
            this.end(false);
        }, 1000);
    },

    updateUI() {
        // Character position
        const jb = document.getElementById('stealth-jb');
        if (jb) {
            jb.style.left = `${10 + this.position * 0.8}%`;
        }

        // Progress
        const progress = document.getElementById('stealth-progress');
        if (progress) {
            progress.style.width = `${this.position}%`;
        }

        const marker = document.getElementById('stealth-marker');
        if (marker) {
            marker.style.left = `${this.position}%`;
        }

        // Noise meter
        const noiseFill = document.getElementById('noise-fill');
        if (noiseFill) {
            noiseFill.style.width = `${this.noise}%`;
            noiseFill.style.backgroundColor = this.noise > 70 ? '#ff2d75' : this.noise > 40 ? '#ffd93d' : '#4ade80';
        }
    },

    end(success) {
        this.active = false;
        clearInterval(this.gameLoop);
        this.doors.forEach(door => clearTimeout(door.timer));

        document.removeEventListener('keydown', this.keyDownHandler);
        document.removeEventListener('keyup', this.keyUpHandler);
        document.getElementById('minigame-stealth').removeEventListener('mousedown', this.mouseDownHandler);
        document.getElementById('minigame-stealth').removeEventListener('mouseup', this.mouseUpHandler);

        UI.showScreen('game-screen');

        if (success) {
            AudioManager.success();
            DialogueSystem.start('victory_door');
        } else {
            GameState.interest--;
            GameState.weirdness += 2;
            UI.updateHUD();

            if (GameState.interest <= 0) {
                showGameOver();
            } else {
                DialogueSystem.start('stealth_fail');
            }
        }
    }
};

// =====================================================
// INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    // Log browser detection
    console.log(`🎮 JB's Ultimate Mission loaded!`);
    console.log(`📱 Browser: ${BrowserDetect.isSafari ? 'Safari' : 'Other'}, Using: ${BrowserDetect.getVideoFormat().toUpperCase()}`);

    // Initialize all videos with correct format (webm/mov based on browser)
    UI.initAllVideos();

    // Initialize audio on first interaction
    document.addEventListener('click', () => {
        if (!AudioManager.context) {
            AudioManager.init();
        }
    }, { once: true });

    // Ensure videos play
    document.querySelectorAll('video').forEach(video => {
        video.play().catch(() => {});
    });
});
