/**
 * JB vs la vie
 * L'aide à la décision qui ne décide rien
 */

// ============================================
// État de l'application
// ============================================

const state = {
    decision: '',
    optionA: 'Option A',
    optionB: 'Option B',
    lastResult: null
};

// ============================================
// Navigation
// ============================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        // Déclencher les initialisations spécifiques à chaque écran
        if (screenId === 'conseil') initCouncil();
        if (screenId === 'scenario') initScenario();
        if (screenId === 'miroir') initMirror();
        if (screenId === 'tribunal') initTribunal();
        if (screenId === 'excuses') initExcuses();
        if (screenId === 'roue') initWheel();
    }
}

// ============================================
// Module 1: Le Tirage Décalé
// ============================================

const tirageInsights = {
    soulage: [
        "Ah ! Ton corps savait déjà. La pièce n'a fait que confirmer.",
        "Ce soulagement ne ment pas. Note-le quelque part.",
        "Intéressant. Quand le hasard choisit ce que tu voulais secrètement...",
        "Le hasard a bon goût, apparemment. Ou c'est toi qui projetais ?"
    ],
    decu: [
        "Et voilà. Tu viens de découvrir ce que tu voulais vraiment.",
        "La déception est une boussole. Elle pointe vers ton vrai désir.",
        "Merci le hasard. Maintenant tu sais que tu préférais l'autre option.",
        "Cette petite déception vaut de l'or. Elle te montre le chemin."
    ],
    neutre: [
        "L'indifférence est une information aussi. Peut-être que ce choix compte moins que tu le pensais ?",
        "Ni chaud ni froid... Et si les deux options étaient acceptables ?",
        "L'absence de réaction forte est rassurante. Tu survivras aux deux choix.",
        "Peut-être que le vrai sujet est ailleurs ?"
    ],
    panique: [
        "La panique face au hasard révèle que tu ne veux pas déléguer ce choix.",
        "Ce stress dit quelque chose : cette décision compte vraiment pour toi.",
        "Respire. Le fait que ça t'angoisse montre que tu y réfléchis sérieusement.",
        "La bonne nouvelle ? Quelqu'un qui panique n'est pas quelqu'un d'indifférent."
    ]
};

function flipCoin() {
    const coin = document.getElementById('coin');
    const resultZone = document.getElementById('tirage-result');
    const reactionZone = document.getElementById('reaction-zone');
    const insightZone = document.getElementById('tirage-insight');
    const flipBtn = document.getElementById('flip-btn');

    // Reset
    reactionZone.classList.add('hidden');
    insightZone.classList.add('hidden');
    coin.classList.remove('flipping', 'result-b');

    // Disable button during animation
    flipBtn.disabled = true;

    // Random result
    const isOptionA = Math.random() > 0.5;
    state.lastResult = isOptionA ? 'A' : 'B';

    // Add appropriate animation class
    if (!isOptionA) {
        coin.classList.add('result-b');
    }
    coin.classList.add('flipping');

    // Show result after animation
    setTimeout(() => {
        const winner = isOptionA ? state.optionA : state.optionB;
        resultZone.innerHTML = `
            <p style="color: var(--accent); margin-bottom: 0.5rem;">Le hasard a parlé :</p>
            <p style="font-size: 1rem; color: var(--primary);">${winner}</p>
            <p style="font-size: 0.5rem; color: var(--text-dim); margin-top: 0.5rem;">
                (Mais on s'en fiche du résultat. Ce qui compte, c'est ta réaction.)
            </p>
        `;
        reactionZone.classList.remove('hidden');
        flipBtn.disabled = false;
    }, 1600);
}

function handleReaction(reaction) {
    const insightZone = document.getElementById('tirage-insight');
    const insights = tirageInsights[reaction];
    const insight = insights[Math.floor(Math.random() * insights.length)];

    insightZone.innerHTML = `
        <p style="color: var(--accent); margin-bottom: 0.5rem;">💡 Ce que ça révèle :</p>
        <p>${insight}</p>
    `;
    insightZone.classList.remove('hidden');
    insightZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================
// Module 2: Le Conseil des Sages
// ============================================

const sages = [
    {
        name: "Le Philosophe Fatigué",
        avatar: "🧙",
        opinions: [
            "Tout choix est une illusion. Mais bon, faut bien manger.",
            "As-tu envisagé que les deux options mènent au même néant ?",
            "Sartre dirait que tu es condamné à être libre. Désolé.",
            "L'important n'est pas le choix, mais qui tu deviens en choisissant."
        ],
        verdicts: {
            a: "préfère vaguement {a}. Mais ça n'a aucune importance cosmique.",
            b: "pencherait pour {b}. Quoique, tout est absurde.",
            neutral: "refuse de trancher. Comme d'habitude."
        }
    },
    {
        name: "Ta Grand-Mère Imaginaire",
        avatar: "👵",
        opinions: [
            "À mon époque, on n'avait pas le choix. Et on s'en portait très bien !",
            "Tu as mangé aujourd'hui ? Mange d'abord, décide après.",
            "L'important c'est la santé. Et que tu m'appelles plus souvent.",
            "Fais ce qui te rend heureux, mon petit. Mais pas de bêtises."
        ],
        verdicts: {
            a: "validerait {a}. Parce que ça lui rappelle ta mère.",
            b: "suggère {b}. Mais elle te donnera de l'argent quoi qu'il arrive.",
            neutral: "dit que tu devrais d'abord ranger ta chambre."
        }
    },
    {
        name: "Un Chat Blasé",
        avatar: "🐱",
        opinions: [
            "*baille* ...et ?",
            "Les deux options ne m'offrent pas de croquettes.",
            "Réveille-moi quand il y aura une sieste au programme.",
            "*te fixe avec jugement*"
        ],
        verdicts: {
            a: "ignore {a} et se lèche la patte.",
            b: "s'en fiche de {b} mais s'assoit dessus par principe.",
            neutral: "dort. Comme toujours."
        }
    },
    {
        name: "L'Optimiste Suspect",
        avatar: "😁",
        opinions: [
            "LES DEUX OPTIONS SONT GÉNIALES !!! Tu peux pas perdre !!!",
            "C'est une opportunité INCROYABLE déguisée en dilemme !",
            "Peu importe ton choix, ça va être FANTASTIQUE !",
            "Et si tu faisais les deux ?! En MÊME TEMPS ?!"
        ],
        verdicts: {
            a: "ADORE {a} !!! C'est le meilleur choix de ta vie !!!",
            b: "{b} EST PARFAIT !!! Tu es un génie !!!",
            neutral: "trouve que TOUT EST PARFAIT comme c'est !!!"
        }
    },
    {
        name: "Le Stagiaire Anxieux",
        avatar: "😰",
        opinions: [
            "Euh... est-ce qu'il y a une option C ? Moins risquée ?",
            "Tu as demandé l'avis de ton manager ? De tes parents ? De ton dentiste ?",
            "Personnellement, j'éviterais de décider avant d'avoir fait un Excel.",
            "Est-ce que... est-ce qu'on peut reporter ?"
        ],
        verdicts: {
            a: "hésite sur {a}. Mais il hésite sur tout.",
            b: "a peur de {b}. Mais il a peur de tout.",
            neutral: "suggère d'attendre. Peut-être 3-4 ans."
        }
    },
    {
        name: "Le Pote Bourré",
        avatar: "🍺",
        opinions: [
            "Fréro. FRÉRO. T'y penses trop.",
            "Tu sais quoi ? Fais-le. Fais. Le.",
            "Mais genre... qu'est-ce que t'as VRAIMENT à perdre ?",
            "On s'en refait un et on y pense plus."
        ],
        verdicts: {
            a: "valide {a}. Mais il validerait n'importe quoi.",
            b: "trouve {b} trop bien. Tchin !",
            neutral: "a oublié la question."
        }
    },
    {
        name: "L'IA Philosophe",
        avatar: "🤖",
        opinions: [
            "Selon mes calculs, la probabilité que tu regrettes est de 47%. Dans les deux cas.",
            "Erreur : variable 'bonheur' non définie.",
            "As-tu essayé de redémarrer ta vie ?",
            "Je suggère de maximiser ta fonction utilité. Mais je ne sais pas ce que tu veux."
        ],
        verdicts: {
            a: "calcule un léger avantage pour {a}. Marge d'erreur : 100%.",
            b: "simule que {b} a 50.01% de succès.",
            neutral: "a planté. Veuillez réessayer."
        }
    },
    {
        name: "L'Enfant de 5 ans",
        avatar: "👶",
        opinions: [
            "Pourquoi ?",
            "Mais pourquoi ?",
            "Oui mais POURQUOI ?",
            "Tu préfères quoi TOI ? Parce que c'est ça qui compte."
        ],
        verdicts: {
            a: "aime bien {a}. Parce que.",
            b: "préfère {b}. Parce que.",
            neutral: "veut un bonbon."
        }
    }
];

function initCouncil() {
    generateCouncil();
}

function generateCouncil() {
    const container = document.getElementById('council');
    const selectedSages = shuffleArray([...sages]).slice(0, 4);

    container.innerHTML = selectedSages.map(sage => {
        const opinion = sage.opinions[Math.floor(Math.random() * sage.opinions.length)];
        const verdictType = ['a', 'b', 'neutral'][Math.floor(Math.random() * 3)];
        let verdict = sage.verdicts[verdictType];
        verdict = verdict.replace('{a}', `"${state.optionA}"`).replace('{b}', `"${state.optionB}"`);

        return `
            <div class="sage-card">
                <span class="sage-avatar">${sage.avatar}</span>
                <div class="sage-name">${sage.name}</div>
                <p class="sage-opinion">"${opinion}"</p>
                <div class="sage-verdict">➜ ${sage.name.split(' ')[0]} ${verdict}</div>
            </div>
        `;
    }).join('');
}

// ============================================
// Module 3: Scénarios Absurdes
// ============================================

const scenarios = [
    {
        template: "Tu choisis {option}, mais un décret lunaire oblige tout le monde à marcher à reculons le mardi. {option} devient-elle toujours viable ?",
        insight_a: "Même dans l'absurde, {a} te semble gérable.",
        insight_b: "L'absurde révèle que {b} était peut-être plus fragile que prévu.",
        insight_fuite: "Ta vraie préférence : fuir. C'est une info."
    },
    {
        template: "Imagine : tu as choisi {option}. Trois mois plus tard, ton reflet dans le miroir te dit : « Je savais que tu ferais ça. » Il a l'air content ou déçu ?",
        insight_a: "Ton futur toi valide {a}. C'est bon signe.",
        insight_b: "Quelque chose te dit que ton futur toi préfère {b}.",
        insight_fuite: "Même ton reflet ne sait pas. Ça arrive."
    },
    {
        template: "Tu découvres que {option} était secrètement recommandée par tous les hérissons d'Europe. Ça change quelque chose ?",
        insight_a: "Les hérissons ont parlé. {a} reste solide.",
        insight_b: "La recommandation des hérissons te fait reconsidérer {b}.",
        insight_fuite: "Tu ne fais pas confiance aux hérissons. Intéressant."
    },
    {
        template: "Si {option} était une pizza, elle aurait des ananas dessus. Tu la manges quand même ?",
        insight_a: "Tu acceptes les ananas sur {a}. Ton engagement est fort.",
        insight_b: "Sans ananas, tu préfères {b}. Logique.",
        insight_fuite: "Les pizzas à l'ananas te posent question existentielle."
    },
    {
        template: "Un corbeau t'apporte une lettre : « {option} mènera à une aventure impliquant un parapluie et trois cacahuètes. » Tu y vas ?",
        insight_a: "L'aventure parapluie-cacahuètes avec {a} te tente.",
        insight_b: "Tu préfères tenter {b} et ses mystères.",
        insight_fuite: "Tu ignores les corbeaux. Sage décision, peut-être."
    },
    {
        template: "Dans un univers parallèle, toi-même as choisi {option} et envoie un message : « Pas mal. » C'est suffisant comme retour ?",
        insight_a: "« Pas mal » pour {a} te suffit. Tes standards sont sains.",
        insight_b: "Tu voudrais mieux que « pas mal » pour {b}.",
        insight_fuite: "Tu n'as pas confiance en toi-même parallèle."
    },
    {
        template: "Si tu choisissais {option} et qu'un documentaire était tourné sur ta décision, le titre serait plutôt inspirant ou plutôt un avertissement ?",
        insight_a: "Tu vois {a} comme une histoire inspirante.",
        insight_b: "Tu imagines {b} avec plus de drame.",
        insight_fuite: "Tu préfères ne pas être documenté."
    },
    {
        template: "Un vieux sage te dit : « {option}, c'est ce qu'aurait choisi quelqu'un qui aime les mardis. » Tu aimes les mardis ?",
        insight_a: "Tu es du genre mardi. {a} te correspond.",
        insight_b: "Tu es plus jeudi. {b} te parle davantage.",
        insight_fuite: "Tu détestes les jours de la semaine en général."
    },
    {
        template: "Si {option} devait être annoncée par un crieur public sur la place du village, tu assumerais ?",
        insight_a: "Tu assumeras {a} publiquement. C'est bien.",
        insight_b: "Tu préfères garder {b} plus discret. Pourquoi ?",
        insight_fuite: "Tu ne veux pas de crieur. Vie privée respectée."
    },
    {
        template: "Tu choisis {option}, et un barde compose une chanson dessus. Le refrain est plutôt épique ou plutôt mélancolique ?",
        insight_a: "La chanson de {a} serait épique pour toi.",
        insight_b: "Tu entends déjà la ballade de {b}.",
        insight_fuite: "Tu préfères le silence."
    }
];

let currentScenario = null;

function initScenario() {
    generateScenario();
}

function generateScenario() {
    const container = document.getElementById('scenario-text');
    const reactionZone = document.getElementById('scenario-reaction');
    const insightZone = document.getElementById('scenario-insight');

    currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const useOptionA = Math.random() > 0.5;
    const option = useOptionA ? state.optionA : state.optionB;
    currentScenario._usedOption = useOptionA ? 'a' : 'b';

    const text = currentScenario.template.replace(/{option}/g, `"${option}"`);

    container.innerHTML = text;
    reactionZone.classList.remove('hidden');
    insightZone.classList.add('hidden');
}

function handleScenarioReaction(choice) {
    const insightZone = document.getElementById('scenario-insight');
    let insight;

    if (choice === 'fuite') {
        insight = currentScenario.insight_fuite;
    } else if (choice === 'a') {
        insight = currentScenario.insight_a.replace('{a}', state.optionA);
    } else {
        insight = currentScenario.insight_b.replace('{b}', state.optionB);
    }

    insightZone.innerHTML = `
        <p style="color: var(--accent); margin-bottom: 0.5rem;">🔮 L'absurde révèle :</p>
        <p>${insight}</p>
    `;
    insightZone.classList.remove('hidden');
    insightZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================
// Module 4: Le Miroir Bienveillant
// ============================================

const mirrorQuestions = [
    {
        question: "Si cette décision était un animal, ce serait lequel ? Et tu aurais envie de le caresser ou de le fuir ?",
        reflections: [
            "L'animal que tu as choisi en dit long. Les animaux qu'on veut caresser sont ceux qui nous rassurent.",
            "Fuir un animal, c'est souvent fuir une émotion. Laquelle se cache ici ?",
            "Parfois, on apprivoise les décisions comme on apprivoise un animal méfiant. Avec patience."
        ]
    },
    {
        question: "Qu'est-ce que le toi de 8 ans penserait de ce dilemme ?",
        reflections: [
            "L'enfant en toi avait souvent des réponses plus claires. Il n'avait pas encore appris à douter de lui.",
            "À 8 ans, on savait ce qu'on voulait. Le truc, c'est de retrouver cette clarté.",
            "L'enfant dirait peut-être : « Mais pourquoi tu te compliques ? »"
        ]
    },
    {
        question: "Si tu pouvais déléguer cette décision à quelqu'un, ce serait qui ? Et ça te soulagerait ou ça t'angoisserait ?",
        reflections: [
            "Si l'idée de déléguer t'angoisse, c'est que tu veux garder le contrôle. Et c'est ok.",
            "Vouloir déléguer, c'est parfois vouloir éviter la responsabilité. Qu'est-ce qui te fait peur ?",
            "La personne à qui tu délèguerais mentalement... son choix te convient ? Écoute ça."
        ]
    },
    {
        question: "Imagine que tu as déjà décidé. C'est fait. Comment tu te sens, là, maintenant ?",
        reflections: [
            "Le soulagement ou le stress que tu ressens en imaginant avoir décidé est une vraie information.",
            "Parfois, le pire c'est de ne pas avoir décidé. Pas le choix lui-même.",
            "Si imaginer que c'est fait te détend, peut-être que décider vite est la vraie réponse."
        ]
    },
    {
        question: "Cette décision, tu la prends pour toi ou pour faire plaisir à quelqu'un d'autre ?",
        reflections: [
            "Faire plaisir aux autres n'est pas mal. Mais savoir pour qui tu décides change tout.",
            "Si c'est pour toi : quels sont TES critères ? Si c'est pour les autres : c'est vraiment ce qu'ils veulent ?",
            "Les meilleures décisions sont celles où tu assumes qui elles servent."
        ]
    },
    {
        question: "Qu'est-ce que tu aurais fait si personne ne devait jamais le savoir ?",
        reflections: [
            "Ce que tu ferais en secret révèle tes vraies préférences, sans le poids du regard des autres.",
            "Le jugement des autres influence plus qu'on ne le pense. Mais au final, c'est ta vie.",
            "Cette réponse secrète... pourquoi ne pas l'écouter davantage ?"
        ]
    },
    {
        question: "Si les deux options disparaissaient soudainement, qu'est-ce qui te manquerait le plus ?",
        reflections: [
            "Ce qui manquerait, c'est ce qui compte vraiment. C'est ton vrai critère.",
            "Parfois on réalise ce qu'on veut quand on nous l'enlève. Même en imagination.",
            "Le manque est un signal puissant. Écoute-le."
        ]
    },
    {
        question: "Si cette décision était une météo, il ferait quel temps ?",
        reflections: [
            "Une météo ensoleillée = optimisme. Orageuse = anxiété. Le temps dit l'émotion.",
            "La météo intérieure guide souvent mieux que les listes de pour/contre.",
            "Peut-être que tu attends une éclaircie pour décider. Elle viendra peut-être pas."
        ]
    },
    {
        question: "Qu'est-ce que tu te dirais si ton meilleur ami était dans la même situation ?",
        reflections: [
            "On est souvent plus bienveillant avec les autres qu'avec soi-même.",
            "Le conseil que tu donnerais à un ami, tu as le droit de te l'appliquer.",
            "La compassion envers soi commence par s'écouter comme on écoute un ami."
        ]
    },
    {
        question: "Est-ce que cette décision sera encore importante dans 5 ans ?",
        reflections: [
            "Si non, peut-être que tu peux te permettre de décider plus légèrement.",
            "Si oui, prends le temps qu'il faut. Mais 'prendre le temps' ne veut pas dire 'éviter'.",
            "La plupart des décisions semblent énormes sur le moment. Et puis le temps passe."
        ]
    },
    {
        question: "Y a-t-il une troisième option que tu n'oses pas considérer ?",
        reflections: [
            "Parfois, on se force dans un dilemme binaire pour éviter l'option qui fait vraiment peur.",
            "L'option C existe souvent. Elle demande juste plus de courage.",
            "Ne pas choisir entre A et B est aussi un choix. Pas toujours le pire."
        ]
    }
];

let currentQuestion = null;

function initMirror() {
    generateQuestion();
}

function generateQuestion() {
    const questionContainer = document.getElementById('mirror-question');
    const answerField = document.getElementById('mirror-answer');
    const reflectionZone = document.getElementById('mirror-reflection');

    currentQuestion = mirrorQuestions[Math.floor(Math.random() * mirrorQuestions.length)];

    questionContainer.innerHTML = currentQuestion.question;
    answerField.value = '';
    reflectionZone.classList.add('hidden');
}

function showReflection() {
    const reflectionZone = document.getElementById('mirror-reflection');
    const answerField = document.getElementById('mirror-answer');

    if (!answerField.value.trim()) {
        reflectionZone.innerHTML = `
            <p style="color: var(--accent);">Tu n'as rien écrit, et c'est ok.</p>
            <p>Parfois, ne pas savoir quoi répondre EST la réponse. Ça pointe vers ce qu'il faut explorer.</p>
        `;
    } else {
        const reflection = currentQuestion.reflections[Math.floor(Math.random() * currentQuestion.reflections.length)];
        reflectionZone.innerHTML = `
            <p style="color: var(--accent); margin-bottom: 0.5rem;">💭 Un murmure du miroir :</p>
            <p>${reflection}</p>
        `;
    }

    reflectionZone.classList.remove('hidden');
    reflectionZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================
// Module 5: Le Tribunal des Toi
// ============================================

const tribunalCharacters = [
    {
        name: "Toi à 20 ans",
        avatar: "🧑",
        personality: "optimiste",
        forA: [
            "Fonce ! C'est maintenant ou jamais. On réfléchira après.",
            "La vie est trop courte pour hésiter. {a}, c'est l'aventure !",
            "Tu vas le regretter si tu choisis pas {a}. Trust me."
        ],
        forB: [
            "Attends, {b} c'est peut-être plus safe non ?",
            "{b} te laisse plus de portes ouvertes, j'trouve.",
            "Genre, {b} c'est clairement le move intelligent."
        ]
    },
    {
        name: "Toi dans 10 ans",
        avatar: "🧔",
        personality: "sage",
        forA: [
            "Avec le recul, {a} m'a appris beaucoup de choses.",
            "Je ne regrette pas {a}. C'était le bon choix pour grandir.",
            "{a} m'a mené là où je devais être. Fais-toi confiance."
        ],
        forB: [
            "Crois-moi, {b} était la décision mature.",
            "Je suis content d'avoir choisi {b}. La stabilité, ça compte.",
            "{b} m'a permis de construire quelque chose de durable."
        ]
    },
    {
        name: "Toi fatigué",
        avatar: "😫",
        personality: "épuisé",
        forA: [
            "Écoute, {a} demande moins d'énergie mentale. Juste... fais-le.",
            "J'en peux plus d'y penser. {a} et on n'en parle plus.",
            "{a} au moins c'est clair. Pas de prise de tête."
        ],
        forB: [
            "{b} me semble plus reposant sur le long terme.",
            "Avec {b}, au moins on dort tranquille.",
            "Je vote {b} parce que j'ai plus la force de réfléchir."
        ]
    },
    {
        name: "Toi ambitieux",
        avatar: "🚀",
        personality: "fonceur",
        forA: [
            "{a} c'est le choix qui va te faire grandir. GO.",
            "Tu veux rester où tu es ou tu veux évoluer ? {a}.",
            "{a} c'est inconfortable, et c'est exactement pour ça qu'il faut le faire."
        ],
        forB: [
            "{b} c'est stratégique. C'est jouer le long game.",
            "Les vrais winners savent que {b} prépare le terrain.",
            "{b} te positionne mieux pour la suite."
        ]
    },
    {
        name: "Toi anxieux",
        avatar: "😰",
        personality: "prudent",
        forA: [
            "Et si {a} marchait ? On panique pour rien peut-être...",
            "Le stress de ne pas choisir {a} serait pire, non ?",
            "Bon... {a}... au pire qu'est-ce qui peut arriver ? (ne réponds pas)"
        ],
        forB: [
            "{b} c'est plus sécurisé. J'ai vérifié trois fois.",
            "Avec {b}, on minimise les risques. C'est mathématique.",
            "J'ai fait une liste de pour/contre. {b} gagne. De peu. Mais quand même."
        ]
    },
    {
        name: "Toi rebelle",
        avatar: "😎",
        personality: "provocateur",
        forA: [
            "{a} ça va en surprendre plus d'un. J'adore.",
            "Tout le monde s'attend à ce que tu fasses pas {a}. Raison de plus.",
            "{a} c'est le choix que personne comprendra. Parfait."
        ],
        forB: [
            "Plot twist : {b} c'est le vrai acte de rébellion.",
            "{b} parce que personne s'y attend venant de toi.",
            "Fais {b} juste pour voir la tête des gens."
        ]
    },
    {
        name: "Toi en vacances",
        avatar: "🏖️",
        personality: "détendu",
        forA: [
            "Franchement, {a} ou {b}... ça va aller de toute façon.",
            "{a} me donne des vibes positives. Écoute ton cœur.",
            "Prends {a}, commande un mojito, et profite."
        ],
        forB: [
            "{b} et on passe à autre chose. La vie est belle.",
            "Stress pas. {b} c'est très bien aussi.",
            "{b}, un hamac, et on oublie tout ça."
        ]
    },
    {
        name: "Toi à 3h du mat'",
        avatar: "🌙",
        personality: "philosophe nocturne",
        forA: [
            "Tu sais au fond que c'est {a}. Tu le sais.",
            "{a}... c'est ce que tu choisirais si t'avais pas peur.",
            "Dans le silence de la nuit, {a} résonne différemment, non ?"
        ],
        forB: [
            "Et si {b} était le choix que tu t'interdis de vouloir ?",
            "{b} me semble être ce que ton inconscient murmure.",
            "À 3h du mat', la vérité c'est souvent {b}."
        ]
    }
];

let currentTribunal = null;

function initTribunal() {
    generateTribunal();
}

function generateTribunal() {
    const charLeft = document.getElementById('char-left');
    const charRight = document.getElementById('char-right');
    const debateContainer = document.getElementById('tribunal-debate');
    const verdictZone = document.getElementById('tribunal-verdict');
    const voteLeftBtn = document.getElementById('vote-left');
    const voteRightBtn = document.getElementById('vote-right');

    verdictZone.classList.add('hidden');

    // Sélectionner 2 personnages différents au hasard
    const shuffled = shuffleArray([...tribunalCharacters]);
    const leftChar = shuffled[0];
    const rightChar = shuffled[1];

    // Un défend A, l'autre défend B (aléatoire)
    const leftDefendsA = Math.random() > 0.5;

    currentTribunal = {
        left: { char: leftChar, defends: leftDefendsA ? 'a' : 'b' },
        right: { char: rightChar, defends: leftDefendsA ? 'b' : 'a' }
    };

    // Afficher les personnages
    const leftOption = leftDefendsA ? state.optionA : state.optionB;
    const rightOption = leftDefendsA ? state.optionB : state.optionA;

    charLeft.innerHTML = `
        <span class="char-avatar">${leftChar.avatar}</span>
        <div class="char-name">${leftChar.name}</div>
        <div class="char-stance">Défend : "${leftOption}"</div>
    `;

    charRight.innerHTML = `
        <span class="char-avatar">${rightChar.avatar}</span>
        <div class="char-name">${rightChar.name}</div>
        <div class="char-stance">Défend : "${rightOption}"</div>
    `;

    voteLeftBtn.textContent = `${leftChar.avatar} ${leftChar.name.split(' ')[0]}`;
    voteRightBtn.textContent = `${rightChar.avatar} ${rightChar.name.split(' ')[0]}`;

    // Générer le débat
    const leftArgs = leftDefendsA ? leftChar.forA : leftChar.forB;
    const rightArgs = leftDefendsA ? rightChar.forB : rightChar.forA;

    const leftArg = leftArgs[Math.floor(Math.random() * leftArgs.length)]
        .replace('{a}', state.optionA).replace('{b}', state.optionB);
    const rightArg = rightArgs[Math.floor(Math.random() * rightArgs.length)]
        .replace('{a}', state.optionA).replace('{b}', state.optionB);

    debateContainer.innerHTML = `
        <div class="debate-line left">
            <span class="speaker">${leftChar.avatar} ${leftChar.name} :</span>
            "${leftArg}"
        </div>
        <div class="debate-line right">
            <span class="speaker">${rightChar.avatar} ${rightChar.name} :</span>
            "${rightArg}"
        </div>
    `;
}

function handleTribunalVote(vote) {
    const verdictZone = document.getElementById('tribunal-verdict');
    let verdict;

    if (vote === 'left') {
        const winner = currentTribunal.left;
        const option = winner.defends === 'a' ? state.optionA : state.optionB;
        verdict = `
            <p style="color: var(--accent);">⚖️ Verdict :</p>
            <p>${winner.char.name} t'a convaincu.</p>
            <p style="margin-top: 0.5rem; font-size: 0.5rem;">
                Ça veut peut-être dire que "${option}" résonne avec ta part ${winner.char.personality}.
                Cette partie de toi mérite d'être écoutée.
            </p>
        `;
    } else if (vote === 'right') {
        const winner = currentTribunal.right;
        const option = winner.defends === 'a' ? state.optionA : state.optionB;
        verdict = `
            <p style="color: var(--accent);">⚖️ Verdict :</p>
            <p>${winner.char.name} t'a convaincu.</p>
            <p style="margin-top: 0.5rem; font-size: 0.5rem;">
                Ça veut peut-être dire que "${option}" résonne avec ta part ${winner.char.personality}.
                Cette partie de toi mérite d'être écoutée.
            </p>
        `;
    } else {
        verdict = `
            <p style="color: var(--accent);">⚖️ Match nul !</p>
            <p>Aucune de tes "versions" ne l'emporte.</p>
            <p style="margin-top: 0.5rem; font-size: 0.5rem;">
                Peut-être que les deux options sont équivalentes pour toi ?
                Ou peut-être qu'il te faut un autre angle pour y voir plus clair.
            </p>
        `;
    }

    verdictZone.innerHTML = verdict;
    verdictZone.classList.remove('hidden');
    verdictZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================
// Module 6: Générateur d'Excuses
// ============================================

const excuseTemplates = [
    "C'est ce que m'a conseillé un pigeon très sage ce matin.",
    "Mon horoscope était catégorique.",
    "J'ai tiré les cartes et le Valet de Trèfle a parlé.",
    "Une intuition m'est venue en mangeant des pâtes.",
    "C'est pile ce que mon moi du futur aurait voulu.",
    "Un rêve très réaliste m'a montré la voie.",
    "J'ai lancé une pièce 47 fois et c'est sorti.",
    "Ma plante verte a penché dans cette direction.",
    "C'est le seul choix compatible avec mon karma.",
    "Un chat m'a fixé et j'ai compris.",
    "Mon algorithme intérieur a calculé.",
    "La troisième chanson à la radio l'a confirmé.",
    "J'ai senti une vibration cosmique claire.",
    "Mon café a formé un symbole évident ce matin.",
    "C'est ce que j'aurais conseillé à un inconnu dans le bus.",
    "Mercure est rétrograde, je n'avais pas le choix.",
    "J'ai consulté un GIF aléatoire et c'était le signe.",
    "Mon WiFi s'est connecté à ce moment précis.",
    "J'ai éternué trois fois, c'était un présage.",
    "Un écureuil m'a regardé avec insistance.",
    "C'est le choix qui demande le moins d'emails.",
    "J'ai suivi le conseil d'une fortune cookie de 2019.",
    "Mon téléphone était à 42% de batterie. C'était un signe.",
    "Un panneau publicitaire m'a parlé spirituellement."
];

const excuseInsights = {
    a: [
        "Tu défends plus facilement les excuses pour {a}. Ton cœur a peut-être déjà choisi.",
        "L'excuse pour {a} te fait sourire ? C'est souvent bon signe.",
        "Défendre l'indéfendable pour {a} t'amuse. L'amusement révèle l'attachement."
    ],
    b: [
        "Tu défends plus facilement les excuses pour {b}. Intéressant, non ?",
        "L'absurdité de l'excuse pour {b} ne t'a pas rebuté. Note-le.",
        "Même avec une excuse ridicule, tu choisis {b}. Ça dit quelque chose."
    ]
};

function initExcuses() {
    generateExcuses();
}

function generateExcuses() {
    const excuseTextA = document.getElementById('excuse-text-a');
    const excuseTextB = document.getElementById('excuse-text-b');
    const insightZone = document.getElementById('excuse-insight');

    // Mettre à jour les noms d'options
    document.querySelectorAll('.option-name-a').forEach(el => el.textContent = state.optionA);
    document.querySelectorAll('.option-name-b').forEach(el => el.textContent = state.optionB);

    // Générer deux excuses différentes
    const shuffled = shuffleArray([...excuseTemplates]);
    excuseTextA.textContent = `"Je choisis ${state.optionA} parce que : ${shuffled[0]}"`;
    excuseTextB.textContent = `"Je choisis ${state.optionB} parce que : ${shuffled[1]}"`;

    insightZone.classList.add('hidden');
}

function handleExcuseDefend(option) {
    const insightZone = document.getElementById('excuse-insight');
    const insights = excuseInsights[option];
    const insight = insights[Math.floor(Math.random() * insights.length)]
        .replace('{a}', state.optionA)
        .replace('{b}', state.optionB);

    insightZone.innerHTML = `
        <p style="color: var(--accent); margin-bottom: 0.5rem;">🎭 L'absurde révèle :</p>
        <p>${insight}</p>
    `;
    insightZone.classList.remove('hidden');
    insightZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================
// Module 7: La Roue du Chaos
// ============================================

const wheelChallenges = [
    {
        icon: "🎭",
        title: "Le Mime",
        text: "Mime ton choix préféré devant ton miroir pendant 10 secondes. Lequel t'a semblé le plus naturel à mimer ?",
        insight: "Le corps ne ment pas. Ce qui est fluide à mimer est souvent ce qui nous correspond."
    },
    {
        icon: "📞",
        title: "L'Appel Imaginaire",
        text: "Imagine que tu appelles quelqu'un pour lui annoncer ta décision. Qui appelles-tu ? Et tu lui annonces quoi ?",
        insight: "La personne que tu imagines appeler et ce que tu lui dis révèlent ce que tu veux vraiment partager."
    },
    {
        icon: "✍️",
        title: "La Lettre",
        text: "Écris une phrase qui commence par : 'J'ai choisi [option] parce que...' Écris vite, sans réfléchir.",
        insight: "L'écriture spontanée contourne le mental. Ce qui sort d'abord est souvent le plus vrai."
    },
    {
        icon: "🔮",
        title: "La Prédiction",
        text: "Ferme les yeux. Imagine-toi dans 1 an. Tu as choisi. Tu te vois faire quoi exactement ?",
        insight: "L'image qui vient spontanément est un signal. Ton inconscient projette ce qu'il désire."
    },
    {
        icon: "🎲",
        title: "Le Pari",
        text: "Si tu devais parier 100€ sur l'option qui te rendra le plus heureux, tu mises sur laquelle ?",
        insight: "L'argent rend les choses concrètes. Là où tu mets ton argent (imaginaire), tu mets ta confiance."
    },
    {
        icon: "💭",
        title: "Le Mensonge",
        text: "Dis à voix haute : 'Je choisis [Option A]'. Puis : 'Je choisis [Option B]'. Laquelle sonne comme un mensonge ?",
        insight: "On détecte nos propres mensonges. Ce qui sonne faux l'est probablement."
    },
    {
        icon: "⏰",
        title: "Le Compte à Rebours",
        text: "Tu as 5 secondes pour choisir. 5... 4... 3... 2... 1... C'EST QUOI ?",
        insight: "La pression du temps élimine le sur-analyse. Le premier instinct est souvent le bon."
    },
    {
        icon: "🪙",
        title: "Le Pile ou Face Mental",
        text: "Attribue mentalement Pile à A et Face à B. Lance une pièce imaginaire. Elle tombe sur... (le premier qui te vient) ?",
        insight: "Ce 'hasard' mental n'en est pas un. Tu as choisi ce que tu voulais voir tomber."
    }
];

let currentChallenge = null;
let wheelRotation = 0;

function initWheel() {
    // Reset
    document.getElementById('wheel-challenge').classList.add('hidden');
    document.getElementById('wheel-response').classList.add('hidden');
    document.getElementById('wheel-insight').classList.add('hidden');
}

function spinWheel() {
    const wheel = document.getElementById('wheel');
    const challengeZone = document.getElementById('wheel-challenge');
    const responseZone = document.getElementById('wheel-response');
    const insightZone = document.getElementById('wheel-insight');
    const spinBtn = document.getElementById('spin-btn');

    // Reset zones
    challengeZone.classList.add('hidden');
    responseZone.classList.add('hidden');
    insightZone.classList.add('hidden');

    // Disable button
    spinBtn.disabled = true;

    // Random rotation (minimum 5 tours + segment aléatoire)
    const randomSegment = Math.floor(Math.random() * 8);
    const extraRotation = 1800 + (randomSegment * 45) + Math.random() * 45;
    wheelRotation += extraRotation;

    wheel.style.transform = `rotate(${wheelRotation}deg)`;

    // Show challenge after spin
    setTimeout(() => {
        currentChallenge = wheelChallenges[randomSegment];

        challengeZone.innerHTML = `
            <div class="challenge-type">${currentChallenge.icon}</div>
            <div class="challenge-title">${currentChallenge.title}</div>
            <div class="challenge-text">${currentChallenge.text.replace('[Option A]', state.optionA).replace('[Option B]', state.optionB).replace('[option]', '___')}</div>
        `;
        challengeZone.classList.remove('hidden');
        responseZone.classList.remove('hidden');
        document.getElementById('challenge-answer').value = '';
        spinBtn.disabled = false;
    }, 4200);
}

function submitChallenge() {
    const insightZone = document.getElementById('wheel-insight');
    const answerField = document.getElementById('challenge-answer');

    let insightText = currentChallenge.insight;

    if (!answerField.value.trim()) {
        insightText = "Tu n'as rien écrit, et c'est ok. Parfois le défi nous bloque parce qu'il touche à quelque chose d'important.";
    }

    insightZone.innerHTML = `
        <p style="color: var(--accent); margin-bottom: 0.5rem;">🎡 Ce que le chaos révèle :</p>
        <p>${insightText}</p>
    `;
    insightZone.classList.remove('hidden');
    insightZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================
// Utilitaires
// ============================================

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateState() {
    const decisionInput = document.getElementById('decision');
    const optionAInput = document.getElementById('option-a');
    const optionBInput = document.getElementById('option-b');

    state.decision = decisionInput.value || 'Mon dilemme';
    state.optionA = optionAInput.value || 'Option A';
    state.optionB = optionBInput.value || 'Option B';
}

// ============================================
// Event Listeners
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Navigation buttons
    document.querySelectorAll('[data-screen]').forEach(btn => {
        btn.addEventListener('click', () => {
            updateState();
            showScreen(btn.dataset.screen);
        });
    });

    // Tirage module
    document.getElementById('flip-btn').addEventListener('click', flipCoin);

    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => handleReaction(btn.dataset.reaction));
    });

    // Conseil module
    document.getElementById('new-council-btn').addEventListener('click', generateCouncil);

    // Scenario module
    document.getElementById('new-scenario-btn').addEventListener('click', generateScenario);

    document.querySelectorAll('.scenario-react').forEach(btn => {
        btn.addEventListener('click', () => handleScenarioReaction(btn.dataset.choice));
    });

    // Miroir module
    document.getElementById('next-question-btn').addEventListener('click', generateQuestion);
    document.getElementById('reflect-btn').addEventListener('click', showReflection);

    // Tribunal module
    document.getElementById('new-tribunal-btn').addEventListener('click', generateTribunal);
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', () => handleTribunalVote(btn.dataset.vote));
    });

    // Excuses module
    document.getElementById('new-excuses-btn').addEventListener('click', generateExcuses);
    document.querySelectorAll('.defend-btn').forEach(btn => {
        btn.addEventListener('click', () => handleExcuseDefend(btn.dataset.option));
    });

    // Roue module
    document.getElementById('spin-btn').addEventListener('click', spinWheel);
    document.getElementById('submit-challenge').addEventListener('click', submitChallenge);

    // Update coin display with options
    const optionAInput = document.getElementById('option-a');
    const optionBInput = document.getElementById('option-b');

    optionAInput.addEventListener('input', () => {
        document.querySelector('.coin-face.front').textContent = optionAInput.value.charAt(0).toUpperCase() || 'A';
    });

    optionBInput.addEventListener('input', () => {
        document.querySelector('.coin-face.back').textContent = optionBInput.value.charAt(0).toUpperCase() || 'B';
    });
});
