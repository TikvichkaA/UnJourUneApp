// ============================================
// MathOral - Base de donnees enrichie
// Exercices X-ENS-Centrale session 2025
// ============================================

// THEMES
const THEMES = {
    suites: { name: 'Suites', icon: 'S', color: '#4361ee' },
    series: { name: 'Series', icon: 'R', color: '#7c3aed' },
    fonctions: { name: 'Fonctions', icon: 'F', color: '#06d6a0' },
    integrales: { name: 'Integrales', icon: 'I', color: '#ef476f' },
    algebre: { name: 'Algebre lineaire', icon: 'A', color: '#f77f00' },
    probabilites: { name: 'Probabilites', icon: 'P', color: '#d62828' },
    'algebre-generale': { name: 'Algebre generale', icon: 'G', color: '#8b5cf6' },
    topologie: { name: 'Topologie', icon: 'T', color: '#14b8a6' }
};

// METHODES TRANSVERSALES
const METHODES = [
    {
        id: 'recurrence',
        name: 'Recurrence',
        icon: '->',
        trigger: 'Quand je vois une <strong>suite definie par recurrence</strong>, je pense a...',
        contexts: [
            'Suite $u_{n+1} = f(u_n)$',
            'Propriete a demontrer pour tout $n$',
            'Inegalite a etablir par etapes'
        ],
        strategies: [
            'Initialisation : verifier $P(0)$ ou $P(n_0)$',
            'Heredite : supposer $P(n)$ et montrer $P(n+1)$',
            'Conclusion : par principe de recurrence'
        ],
        tools: ['Theoreme de recurrence simple', 'Recurrence forte', 'Recurrence a deux crans'],
        traps: ['Oublier l\'initialisation', 'Utiliser $P(n+1)$ dans l\'heredite', 'Mal identifier l\'hypothese de recurrence'],
        examples: ['suite-recurrence', 'suite-monotone', 'suite-bornee']
    },
    {
        id: 'point-fixe',
        name: 'Point fixe',
        icon: '*',
        trigger: 'Quand je vois $u_{n+1} = f(u_n)$ et qu\'on me demande la <strong>limite</strong>, je pense a...',
        contexts: ['Suite recurrente $u_{n+1} = f(u_n)$', 'Convergence vers une valeur $\\ell$', 'Equation $f(x) = x$'],
        strategies: ['Montrer que $(u_n)$ converge (monotonie bornee, adjacentes...)', 'Passer a la limite dans $u_{n+1} = f(u_n)$', 'Resoudre $f(\\ell) = \\ell$'],
        tools: ['Theoreme de la limite monotone', 'Continuite de $f$ pour le passage a la limite', 'Theoreme du point fixe de Banach'],
        traps: ['Oublier de justifier la convergence AVANT de passer a la limite', 'Ne pas verifier la continuite de $f$', 'Confondre existence de point fixe et convergence'],
        examples: ['suite-recurrence', 'suite-contractante', 'newton-sqrt']
    },
    {
        id: 'encadrement',
        name: 'Encadrement / Gendarmes',
        icon: '<>',
        trigger: 'Quand je vois une suite ou fonction <strong>difficile a etudier directement</strong>, je pense a...',
        contexts: ['Suite compliquee type $u_n = \\sum_{k=1}^n f(k)$', 'Equivalents et comparaisons', 'Limites de quotients'],
        strategies: ['Trouver deux suites/fonctions simples encadrant', 'Montrer qu\'elles ont meme limite', 'Appliquer le theoreme des gendarmes'],
        tools: ['Inegalites classiques (convexite, Taylor...)', 'Comparaison serie-integrale', 'Croissances comparees'],
        traps: ['Encadrement trop large (limites differentes)', 'Oublier de verifier que l\'encadrement est valide', 'Ne pas justifier les inegalites utilisees'],
        examples: ['vitesse-convergence', 'serie-integrale', 'equivalent-somme']
    },
    {
        id: 'comparaison-serie-integrale',
        name: 'Comparaison serie-integrale',
        icon: 'SI',
        trigger: 'Quand je vois $\\sum f(n)$ avec $f$ <strong>monotone</strong>, je pense a...',
        contexts: ['Serie a termes positifs $\\sum_{n \\geq 1} f(n)$', 'Fonction $f$ decroissante continue', 'Etude de convergence ou equivalent'],
        strategies: ['Encadrer : $\\int_n^{n+1} f \\leq f(n) \\leq \\int_{n-1}^n f$', 'Sommer de $1$ a $N$ et faire tendre $N \\to +\\infty$', 'Conclure par comparaison'],
        tools: ['Lemme de comparaison serie-integrale', 'Theoreme de comparaison des series', 'Integrale de Riemann'],
        traps: ['Oublier l\'hypothese de monotonie', 'Se tromper dans les bornes d\'integration', 'Confondre convergence serie et convergence integrale'],
        examples: ['serie-integrale', 'serie-riemann', 'constante-euler']
    },
    {
        id: 'derivation-limite',
        name: 'Echange derivation-limite',
        icon: 'd/dx',
        trigger: 'Quand je vois une <strong>suite de fonctions derivables</strong> et qu\'on me demande si la limite est derivable...',
        contexts: ['Suite $(f_n)$ avec $f_n \\to f$', 'Question sur la derivabilite de $f$', 'Serie de fonctions'],
        strategies: ['Verifier convergence simple de $(f_n)$', 'Verifier convergence uniforme de $(f_n\')$', 'Appliquer le theoreme'],
        tools: ['Theoreme d\'interversion limite-derivation', 'Convergence uniforme', 'Derivation terme a terme des series'],
        traps: ['CVU de $f_n$ ne suffit pas pour deriver', 'Oublier de verifier la convergence de $(f_n\'(x_0))$', 'Confondre CVS et CVU'],
        examples: ['convergence-uniforme', 'serie-fonctions', 'serie-entiere-derivee']
    },
    {
        id: 'integration-limite',
        name: 'Echange integration-limite',
        icon: 'int',
        trigger: 'Quand je vois $\\lim \\int f_n$ ou $\\int \\lim f_n$, je pense a...',
        contexts: ['Suite $(f_n)$ de fonctions integrables', 'Calcul de $\\lim \\int f_n$', 'Integrale dependant d\'un parametre'],
        strategies: ['Identifier la limite simple $f$', 'Trouver une fonction $g$ integrable dominant toutes les $|f_n|$ OU montrer CVU', 'Appliquer convergence dominee ou CVU'],
        tools: ['Theoreme de convergence dominee', 'Convergence uniforme sur un segment', 'Lemme de Fatou'],
        traps: ['Oublier de verifier l\'hypothese de domination', 'Domination par une fonction non integrable', 'CVU sur un intervalle non borne ne suffit pas'],
        examples: ['integrale-parametre', 'echange-limite-integrale', 'fonction-gamma']
    },
    {
        id: 'taylor',
        name: 'Developpements limites / Taylor',
        icon: 'DL',
        trigger: 'Quand je vois une <strong>limite ou un equivalent au voisinage d\'un point</strong>, je pense a...',
        contexts: ['Calcul de $\\lim_{x \\to a} \\frac{f(x) - L}{(x-a)^n}$', 'Formes indeterminees', 'Comparaison locale de fonctions'],
        strategies: ['Ecrire le DL de chaque fonction', 'Effectuer les operations', 'Identifier le terme dominant'],
        tools: ['DL usuels ($e^x$, $\\ln$, $\\sin$, $(1+x)^\\alpha$...)', 'Formule de Taylor-Young', 'Composition et operations sur les DL'],
        traps: ['DL a un ordre insuffisant', 'Erreur de signe dans les DL', 'Oublier le reste'],
        examples: ['forme-indeterminee', 'equivalent-local', 'vitesse-convergence']
    },
    {
        id: 'rolle',
        name: 'Theoreme de Rolle / AF',
        icon: 'R',
        trigger: 'Quand je dois montrer qu\'une <strong>derivee s\'annule</strong> ou trouver un point particulier...',
        contexts: ['Montrer $\\exists c, f\'(c) = 0$', 'Nombre de racines d\'un polynome', 'Inegalite faisant intervenir une derivee'],
        strategies: ['Identifier une fonction auxiliaire $g$ avec $g(a) = g(b)$', 'Verifier les hypotheses (continuite, derivabilite)', 'Appliquer Rolle pour obtenir $g\'(c) = 0$'],
        tools: ['Theoreme de Rolle', 'Theoreme des accroissements finis', 'Inegalite des accroissements finis'],
        traps: ['Oublier de verifier les hypotheses', 'Mauvais choix de fonction auxiliaire', 'Confondre Rolle et AF'],
        examples: ['rolle-deguise', 'zeros-derivee', 'inegalite-af']
    },
    {
        id: 'ipp',
        name: 'Integration par parties',
        icon: 'IPP',
        trigger: 'Quand je vois un <strong>produit de fonctions</strong> sous une integrale...',
        contexts: ['Integrale type $\\int P(x) e^x dx$, $\\int x^n \\ln x dx$', 'Relation de recurrence sur des integrales', 'Calcul de primitives'],
        strategies: ['Identifier $u$ et $v\'$ judicieusement', 'Calculer $u\'$ et $v$', 'Appliquer $\\int uv\' = [uv] - \\int u\'v$'],
        tools: ['Formule d\'IPP', 'IPP repetees', 'Methode de Wallis'],
        traps: ['Mauvais choix de $u$ et $v\'$', 'Erreur de signe', 'Oublier les bornes dans le terme $[uv]$'],
        examples: ['ipp-astucieuse', 'integrale-wallis', 'integrale-ln']
    },
    {
        id: 'changement-variable',
        name: 'Changement de variable',
        icon: 'CV',
        trigger: 'Quand je vois une <strong>integrale compliquee</strong> avec une structure particuliere...',
        contexts: ['Integrale avec $\\sqrt{a^2 - x^2}$, $\\sqrt{x^2 + a^2}$', 'Fonctions trigonometriques', 'Simplification par substitution'],
        strategies: ['Identifier la substitution adaptee', 'Exprimer $dx$ en fonction de la nouvelle variable', 'Transformer les bornes si integrale definie'],
        tools: ['Substitutions trigonometriques', 'Substitution $t = \\tan(x/2)$', 'Changement affine'],
        traps: ['Oublier de changer les bornes', 'Erreur dans $dx$', 'Bijectivite du changement de variable'],
        examples: ['changement-variable', 'integrale-trigo', 'integrale-rationnelle']
    },
    {
        id: 'series-alternees',
        name: 'Series alternees (Leibniz)',
        icon: 'SA',
        trigger: 'Quand je vois $\\sum (-1)^n a_n$ avec $(a_n)$ <strong>positive decroissante</strong>...',
        contexts: ['Serie $\\sum_{n \\geq 1} (-1)^n a_n$', 'Convergence conditionnelle', 'Majoration du reste'],
        strategies: ['Verifier $a_n \\geq 0$', 'Verifier $(a_n)$ decroissante', 'Verifier $a_n \\to 0$'],
        tools: ['Theoreme de Leibniz', 'Majoration $|R_n| \\leq a_{n+1}$', 'Encadrement par les sommes partielles'],
        traps: ['Oublier de verifier la decroissance', 'Confondre convergence absolue et conditionnelle', 'Serie alternee mais $(a_n)$ non monotone'],
        examples: ['serie-alternee', 'convergence-conditionnelle', 'serie-ln2']
    },
    {
        id: 'convexite',
        name: 'Convexite et inegalites',
        icon: 'C',
        trigger: 'Quand je dois montrer une <strong>inegalite</strong> ou etudier une fonction...',
        contexts: ['Inegalite type Jensen', 'Position par rapport a la tangente', 'Comparaison de moyennes'],
        strategies: ['Calculer $f\'\'$ et etudier son signe', 'Utiliser : $f$ convexe ssi $f$ au-dessus de ses tangentes', 'Appliquer Jensen si necessaire'],
        tools: ['Caracterisation par $f\'\'$', 'Inegalite de Jensen', 'Inegalite tangente-courbe'],
        traps: ['Confondre convexe/concave', 'Oublier les hypotheses de Jensen', 'Se tromper dans le sens des inegalites'],
        examples: ['convexite-inegalite', 'am-gm', 'jensen-application']
    },
    {
        id: 'diagonalisation',
        name: 'Diagonalisation',
        icon: 'D',
        trigger: 'Quand je vois une <strong>matrice</strong> et qu\'on me demande ses proprietes spectrales...',
        contexts: ['Calcul de $A^n$', 'Resolution de systemes differentiels', 'Etude de suites matricielles'],
        strategies: ['Calculer le polynome caracteristique', 'Trouver les valeurs propres', 'Determiner les espaces propres et verifier $\\sum \\dim E_\\lambda = n$'],
        tools: ['Theoreme spectral', 'Matrices symetriques reelles', 'Lemme des noyaux'],
        traps: ['Confondre multiplicite algebrique et geometrique', 'Oublier de verifier que la somme des dimensions vaut $n$', 'Erreur de calcul dans le polynome caracteristique'],
        examples: ['diagonalisation-classique', 'matrice-symetrique', 'puissance-matrice']
    },
    {
        id: 'exp-matrice',
        name: 'Exponentielle matricielle',
        icon: 'exp',
        trigger: 'Quand je vois $e^A$ ou un <strong>systeme differentiel lineaire</strong>...',
        contexts: ['Calcul de $e^{tA}$', 'Resolution de $X\' = AX$', 'Etude de $\\lim_{n\\to\\infty} (I + A/n)^n$'],
        strategies: ['Diagonaliser $A$ si possible', 'Sinon, utiliser la reduction de Jordan', 'Calculer $e^{tD}$ ou $e^{tJ}$'],
        tools: ['$e^{PAP^{-1}} = P e^A P^{-1}$', 'Si $AB = BA$, $e^{A+B} = e^A e^B$', 'Serie $e^A = \\sum \\frac{A^n}{n!}$'],
        traps: ['$e^{A+B} \\neq e^A e^B$ si $AB \\neq BA$', 'Oublier le cas nilpotent', 'Se tromper dans le calcul de $J^n$'],
        examples: ['exp-matrice-diag', 'systeme-diff-lineaire', 'formule-lie-trotter']
    }
];

// EXERCICES ENRICHIS (X-ENS-Centrale 2025)
const EXERCICES = [
    // ===== SUITES =====
    {
        id: 'suite-recurrence',
        title: 'Suite recurrente et methode de Newton',
        theme: 'suites',
        concours: 'X',
        year: 2025,
        difficulty: 2,
        methodes: ['recurrence', 'point-fixe'],
        enonce: `Soit $(u_n)$ la suite definie par $u_0 = 2$ et pour tout $n \\in \\mathbb{N}$ :
$$u_{n+1} = \\frac{1}{2}\\left(u_n + \\frac{3}{u_n}\\right)$$

1. Montrer que pour tout $n \\geq 0$, $u_n > 0$.
2. Montrer que pour tout $n \\geq 0$, $u_n^2 \\geq 3$.
3. En deduire que $(u_n)$ est decroissante.
4. Determiner la limite de $(u_n)$.`,
        reconnaissance: {
            question: 'Quelle est la nature de cet exercice ?',
            options: [
                { text: 'Etude de convergence d\'une suite recurrente', correct: true },
                { text: 'Etude d\'une serie numerique', correct: false },
                { text: 'Etude d\'une fonction', correct: false },
                { text: 'Calcul d\'integrale', correct: false }
            ],
            feedback: {
                correct: 'Exact ! C\'est une suite definie par $u_{n+1} = f(u_n)$. On reconnait une methode de Newton pour calculer $\\sqrt{3}$.',
                incorrect: 'Il s\'agit d\'une suite recurrente de la forme $u_{n+1} = f(u_n)$. L\'etude de convergence passera par la monotonie et le point fixe.'
            }
        },
        strategie: {
            question: 'Quelle est la bonne strategie pour cet exercice ?',
            attendu: 'Montrer par recurrence les proprietes demandees, puis utiliser le theoreme de la limite monotone et identifier le point fixe.',
            exemple: `1. Recurrence pour $u_n > 0$
2. Recurrence pour $u_n^2 \\geq 3$ en utilisant $(u_n - \\sqrt{3})^2 \\geq 0$
3. Etudier $u_{n+1} - u_n = \\frac{3 - u_n^2}{2u_n} \\leq 0$
4. Suite decroissante minoree donc converge vers $\\ell = \\sqrt{3}$`
        },
        indices: [
            { title: 'Idee cle', content: 'Pour la question 2, developper $(u_n - \\sqrt{3})^2 \\geq 0$ pour obtenir l\'inegalite souhaitee.' },
            { title: 'Outil precis', content: 'Pour la monotonie, calculer $u_{n+1} - u_n$ et utiliser le fait que $u_n^2 \\geq 3$.' },
            { title: 'Point technique', content: 'Pour la limite, utiliser que $f(x) = \\frac{1}{2}(x + \\frac{3}{x})$ est continue, puis resoudre $f(\\ell) = \\ell$.' }
        ],
        oral: {
            prompt: 'Presente le plan de resolution en 2 minutes, comme si tu etais devant le jury.',
            tips: ['Annonce clairement les 4 etapes', 'Mentionne la methode de Newton', 'Insiste sur le theoreme de la limite monotone']
        },
        debrief: {
            attendu: 'Le jury attend une demarche rigoureuse avec recurrence bien posee. La reconnaissance de la methode de Newton est un plus.',
            erreurs: ['Oublier l\'initialisation des recurrences', 'Passer a la limite sans justifier la convergence', 'Ne pas voir que $\\sqrt{3}$ est le seul point fixe positif'],
            variantes: ['Etudier la vitesse de convergence', 'Generaliser a $u_{n+1} = \\frac{1}{2}(u_n + \\frac{a}{u_n})$ pour calculer $\\sqrt{a}$'],
            liens: { methodes: ['recurrence', 'point-fixe'], exercices: ['vitesse-convergence', 'suite-contractante'], notions: ['Suites monotones bornees', 'Point fixe'] }
        }
    },
    {
        id: 'suite-extraite',
        title: 'Valeurs d\'adherence et intervalle',
        theme: 'suites',
        concours: 'ENS',
        year: 2025,
        difficulty: 3,
        methodes: ['encadrement'],
        enonce: `Soit $(u_n)$ une suite reelle bornee telle que :
$$\\lim_{n \\to +\\infty} (u_{n+1} - u_n) = 0$$

1. Montrer que l'ensemble des valeurs d'adherence de $(u_n)$ est un intervalle.
2. En deduire que si $(u_n)$ admet une unique valeur d'adherence, alors $(u_n)$ converge.`,
        reconnaissance: {
            question: 'Quel est l\'objectif principal de cet exercice ?',
            options: [
                { text: 'Etudier l\'ensemble des valeurs d\'adherence', correct: true },
                { text: 'Calculer la limite de la suite', correct: false },
                { text: 'Montrer que la suite est de Cauchy', correct: false },
                { text: 'Etudier une serie associee', correct: false }
            ],
            feedback: {
                correct: 'Exact ! L\'exercice porte sur la structure de l\'ensemble des valeurs d\'adherence d\'une suite bornee.',
                incorrect: 'L\'objectif est de montrer que l\'ensemble des valeurs d\'adherence est un intervalle, grace a l\'hypothese sur $u_{n+1} - u_n$.'
            }
        },
        strategie: {
            question: 'Comment aborder la question 1 ?',
            attendu: 'Montrer que si $a < b$ sont deux valeurs d\'adherence, tout $c \\in [a,b]$ est aussi valeur d\'adherence.',
            exemple: `Soit $a < c < b$ deux valeurs d'adherence.
- Il existe des extractrices $\\varphi, \\psi$ avec $u_{\\varphi(n)} \\to a$ et $u_{\\psi(n)} \\to b$
- Par TVI discret : comme $u_{n+1} - u_n \\to 0$, la suite "passe" par $c$
- Construire une extractrice pour $c$`
        },
        indices: [
            { title: 'Idee cle', content: 'Utiliser que $u_{n+1} - u_n \\to 0$ pour "connecter" les valeurs d\'adherence.' },
            { title: 'Outil precis', content: 'Si $u_{\\varphi(n)} \\to a$ et $u_{\\psi(n)} \\to b$ avec $a < c < b$, trouver $n_k$ avec $u_{n_k}$ proche de $c$.' },
            { title: 'Point technique', content: 'Pour la question 2, un intervalle reduit a un point est un singleton : unique valeur d\'adherence = limite.' }
        ],
        oral: { prompt: 'Explique pourquoi l\'hypothese $u_{n+1} - u_n \\to 0$ est essentielle.', tips: ['Donner un contre-exemple sans cette hypothese', 'Interpreter geometriquement', 'Faire le lien avec la connexite'] },
        debrief: {
            attendu: 'Raisonnement topologique rigoureux. Le jury apprecie la construction explicite de l\'extractrice.',
            erreurs: ['Confondre valeur d\'adherence et limite', 'Oublier que la suite est supposee bornee', 'Ne pas utiliser l\'hypothese sur $u_{n+1} - u_n$'],
            variantes: ['Generaliser en dimension superieure', 'Etudier le cas $u_{n+1} - u_n \\to \\ell \\neq 0$'],
            liens: { methodes: ['encadrement'], exercices: ['suite-recurrence'], notions: ['Valeurs d\'adherence', 'Compacite'] }
        }
    },
    {
        id: 'vitesse-convergence',
        title: 'Equivalent de $u_{n+1} = \\sin(u_n)$',
        theme: 'suites',
        concours: 'Centrale',
        year: 2025,
        difficulty: 2,
        methodes: ['taylor', 'encadrement'],
        enonce: `Soit $(u_n)$ definie par $u_0 = 1$ et $u_{n+1} = \\sin(u_n)$ pour tout $n \\geq 0$.

1. Montrer que $(u_n)$ converge vers 0.
2. Trouver un equivalent de $u_n$ quand $n \\to +\\infty$.`,
        reconnaissance: {
            question: 'Quelle est la difficulte principale de cet exercice ?',
            options: [
                { text: 'Trouver la vitesse de convergence vers 0', correct: true },
                { text: 'Montrer la convergence', correct: false },
                { text: 'Calculer la limite', correct: false },
                { text: 'Etudier la monotonie', correct: false }
            ],
            feedback: {
                correct: 'Exact ! La convergence vers 0 est classique. La vraie difficulte est de trouver l\'equivalent $u_n \\sim \\sqrt{3/n}$.',
                incorrect: 'La convergence est immediate (suite positive decroissante). L\'enjeu est de determiner la vitesse : $u_n \\sim \\sqrt{3/n}$.'
            }
        },
        strategie: {
            question: 'Quelle methode utiliser pour trouver l\'equivalent ?',
            attendu: 'Utiliser le DL de sin pour transformer la relation de recurrence, puis etudier $v_n = 1/u_n^2$.',
            exemple: `1. $u_n > 0$, decroissante, minoree par 0 donc converge vers $\\ell = \\sin(\\ell)$, d'ou $\\ell = 0$
2. On pose $v_n = \\frac{1}{u_n^2}$. Comme $\\sin(x) = x - \\frac{x^3}{6} + o(x^3)$ :
   $v_{n+1} - v_n = \\frac{1}{3} + o(1)$, donc $v_n \\sim \\frac{n}{3}$
3. Ainsi $u_n \\sim \\sqrt{\\frac{3}{n}}$`
        },
        indices: [
            { title: 'Idee cle', content: 'Poser $v_n = 1/u_n^2$ pour lineariser le probleme.' },
            { title: 'Outil precis', content: 'Utiliser $\\sin(x) = x - x^3/6 + o(x^3)$ pour obtenir $v_{n+1} - v_n \\to 1/3$.' },
            { title: 'Point technique', content: 'Le lemme de Cesaro permet de passer de $v_{n+1} - v_n \\to 1/3$ a $v_n/n \\to 1/3$.' }
        ],
        oral: { prompt: 'Justifie oralement pourquoi on pose $v_n = 1/u_n^2$ et pas $v_n = 1/u_n$.', tips: ['Calculer ce que donne $1/u_n$', 'Montrer que ca ne marche pas', 'Lien avec l\'ordre du DL'] },
        debrief: {
            attendu: 'Technique classique de changement de variable pour les equivalents. Le jury attend la justification du lemme de Cesaro.',
            erreurs: ['Oublier de justifier $v_{n+1} - v_n \\to 1/3$ implique $v_n/n \\to 1/3$', 'Se tromper dans le DL', 'Ne pas voir le bon changement de variable'],
            variantes: ['Etudier $u_{n+1} = \\tan^{-1}(u_n)$', 'Trouver un terme correctif'],
            liens: { methodes: ['taylor', 'encadrement'], exercices: ['suite-recurrence'], notions: ['Equivalents', 'Lemme de Cesaro'] }
        }
    },
    {
        id: 'suite-contractante',
        title: 'Point fixe de Banach',
        theme: 'suites',
        concours: 'X',
        year: 2025,
        difficulty: 3,
        methodes: ['point-fixe'],
        enonce: `Soit $f : [0,1] \\to [0,1]$ une fonction $k$-lipschitzienne avec $k < 1$.

1. Montrer que $f$ admet un unique point fixe $\\ell \\in [0,1]$.
2. Soit $u_0 \\in [0,1]$ et $u_{n+1} = f(u_n)$. Montrer que $|u_n - \\ell| \\leq k^n |u_0 - \\ell|$.
3. Application : etudier $u_{n+1} = \\cos(u_n)/2$ avec $u_0 = 0$.`,
        reconnaissance: {
            question: 'Quel theoreme fondamental est en jeu ?',
            options: [
                { text: 'Theoreme du point fixe de Banach', correct: true },
                { text: 'Theoreme des valeurs intermediaires', correct: false },
                { text: 'Theoreme de Rolle', correct: false },
                { text: 'Theoreme de Heine', correct: false }
            ],
            feedback: {
                correct: 'Exact ! C\'est le theoreme du point fixe de Banach : une contraction sur un complet admet un unique point fixe.',
                incorrect: 'Il s\'agit du theoreme du point fixe de Banach.'
            }
        },
        strategie: {
            question: 'Comment montrer l\'unicite du point fixe ?',
            attendu: 'Par l\'absurde : si $f(a) = a$ et $f(b) = b$ avec $a \\neq b$, alors $|a-b| = |f(a)-f(b)| \\leq k|a-b| < |a-b|$, contradiction.',
            exemple: `1. Existence : TVI sur $g(x) = f(x) - x$. Unicite : contraction.
2. Par recurrence : $|u_{n+1} - \\ell| = |f(u_n) - f(\\ell)| \\leq k|u_n - \\ell|$`
        },
        indices: [
            { title: 'Idee cle', content: 'Pour l\'existence, utiliser TVI sur $g(x) = f(x) - x$.' },
            { title: 'Outil precis', content: 'La convergence geometrique $k^n \\to 0$ car $k < 1$.' },
            { title: 'Point technique', content: 'Pour l\'application, montrer que $|\\cos\'(x)|/2 \\leq 1/2 < 1$ sur $[0,1]$.' }
        ],
        oral: { prompt: 'Enonce le theoreme du point fixe de Banach avec toutes ses hypotheses.', tips: ['Espace metrique complet', 'Application contractante', 'Existence ET unicite'] },
        debrief: {
            attendu: 'Theoreme fondamental. Le jury attend la vitesse de convergence geometrique.',
            erreurs: ['Oublier de verifier que $f([0,1]) \\subset [0,1]$', 'Confondre lipschitzienne et contractante'],
            variantes: ['Generaliser aux espaces metriques complets'],
            liens: { methodes: ['point-fixe'], exercices: ['suite-recurrence'], notions: ['Contraction', 'Completude'] }
        }
    },
    {
        id: 'suite-cesaro',
        title: 'Moyenne de Cesaro',
        theme: 'suites',
        concours: 'Centrale',
        year: 2025,
        difficulty: 2,
        methodes: ['encadrement'],
        enonce: `Soit $(u_n)$ une suite reelle convergente de limite $\\ell$. On pose $v_n = \\frac{1}{n}\\sum_{k=1}^n u_k$.

1. Montrer que $(v_n)$ converge vers $\\ell$.
2. Donner un exemple de suite $(u_n)$ divergente telle que $(v_n)$ converge.
3. Si $(u_n)$ est a valeurs entieres et $(v_n)$ converge, que peut-on dire de $(u_n)$ ?`,
        reconnaissance: {
            question: 'Quel resultat classique est demontre dans la question 1 ?',
            options: [
                { text: 'Lemme de Cesaro', correct: true },
                { text: 'Theoreme de Stolz', correct: false },
                { text: 'Critere de Cauchy', correct: false },
                { text: 'Theoreme de Bolzano-Weierstrass', correct: false }
            ],
            feedback: { correct: 'Exact ! C\'est le lemme de Cesaro : la moyenne converge vers la meme limite.', incorrect: 'C\'est le lemme de Cesaro.' }
        },
        strategie: {
            question: 'Comment demontrer le lemme de Cesaro ?',
            attendu: 'Separer la somme en deux parties : les premiers termes (contribution negligeable) et les derniers (proches de $\\ell$).',
            exemple: `Soit $\\varepsilon > 0$. $\\exists N$, $\\forall k \\geq N$, $|u_k - \\ell| < \\varepsilon$.
$|v_n - \\ell| \\leq \\frac{1}{n}\\sum_{k=1}^{N-1}|u_k - \\ell| + \\frac{n-N+1}{n}\\varepsilon$
Le premier terme tend vers 0, le second est $< \\varepsilon$ pour $n$ grand.`
        },
        indices: [
            { title: 'Idee cle', content: 'Decouper la somme : termes avant $N$ (nombre fini) et termes apres $N$ (proches de $\\ell$).' },
            { title: 'Outil precis', content: 'Utiliser $|v_n - \\ell| \\leq \\frac{1}{n}\\sum |u_k - \\ell|$.' },
            { title: 'Point technique', content: 'Pour Q2, prendre $u_n = (-1)^n$. Pour Q3, si $(v_n)$ converge vers $\\ell \\notin \\mathbb{Z}$, contradiction.' }
        ],
        oral: { prompt: 'Donne l\'exemple $u_n = (-1)^n$ et calcule $v_n$ explicitement.', tips: ['$v_n = 0$ si $n$ pair', '$v_n = 1/n$ si $n$ impair'] },
        debrief: {
            attendu: 'Demonstration propre du lemme de Cesaro. La question 3 teste la reflexion.',
            erreurs: ['Oublier de traiter les $N-1$ premiers termes', 'Croire que la reciproque est vraie'],
            variantes: ['Cesaro pondere', 'Generalisation de Stolz'],
            liens: { methodes: ['encadrement'], exercices: ['vitesse-convergence'], notions: ['Moyennes', 'Suites'] }
        }
    },
    // ===== SERIES =====
    {
        id: 'serie-integrale',
        title: 'Comparaison serie-integrale et constante d\'Euler',
        theme: 'series',
        concours: 'Centrale',
        year: 2025,
        difficulty: 2,
        methodes: ['comparaison-serie-integrale', 'encadrement'],
        enonce: `Soit $\\alpha > 0$. On pose $H_n = \\sum_{k=1}^n \\frac{1}{k^\\alpha}$.

1. Determiner la nature de la serie $\\sum \\frac{1}{n^\\alpha}$ selon $\\alpha$.
2. Pour $\\alpha = 1$, montrer que $H_n - \\ln(n)$ converge vers une constante $\\gamma$ (constante d\'Euler).
3. Pour $\\alpha > 1$, donner un equivalent de $\\sum_{k=n}^{+\\infty} \\frac{1}{k^\\alpha}$.`,
        reconnaissance: {
            question: 'Quelle methode est centrale dans cet exercice ?',
            options: [
                { text: 'Comparaison serie-integrale', correct: true },
                { text: 'Critere de d\'Alembert', correct: false },
                { text: 'Series alternees', correct: false },
                { text: 'Critere de Cauchy', correct: false }
            ],
            feedback: { correct: 'Exact ! La comparaison serie-integrale avec $\\int_1^n \\frac{dx}{x^\\alpha}$ est la cle.', incorrect: 'La methode centrale est la comparaison serie-integrale.' }
        },
        strategie: {
            question: 'Comment etablir la comparaison serie-integrale ?',
            attendu: 'Encadrer : comme $x \\mapsto 1/x^\\alpha$ est decroissante, $\\int_k^{k+1} f \\leq f(k) \\leq \\int_{k-1}^k f$.',
            exemple: `1. Si $\\alpha \\leq 1$ : DV, si $\\alpha > 1$ : CV
2. $H_n - \\ln(n)$ decroissante minoree, donc converge vers $\\gamma \\approx 0.577$
3. Reste $\\sim \\frac{1}{(\\alpha-1)n^{\\alpha-1}}$`
        },
        indices: [
            { title: 'Idee cle', content: 'Encadrer chaque terme par des integrales.' },
            { title: 'Outil precis', content: '$\\int_1^n x^{-\\alpha} dx = \\frac{n^{1-\\alpha} - 1}{1-\\alpha}$ si $\\alpha \\neq 1$.' },
            { title: 'Point technique', content: 'La suite $H_n - \\ln(n)$ est decroissante et minoree.' }
        ],
        oral: { prompt: 'Explique geometriquement la comparaison serie-integrale.', tips: ['Dessiner la courbe et les rectangles', 'Aire sous la courbe vs somme des rectangles'] },
        debrief: {
            attendu: 'Maitrise parfaite de la comparaison serie-integrale.',
            erreurs: ['Se tromper dans le sens des inegalites', 'Oublier de verifier la monotonie'],
            variantes: ['Formule d\'Euler-Maclaurin'],
            liens: { methodes: ['comparaison-serie-integrale'], exercices: ['serie-riemann'], notions: ['Serie de Riemann', 'Constante d\'Euler'] }
        }
    },
    {
        id: 'serie-alternee',
        title: 'Serie alternee $\\ln(2)$',
        theme: 'series',
        concours: 'ENS',
        year: 2025,
        difficulty: 2,
        methodes: ['series-alternees'],
        enonce: `Soit $S = \\sum_{n=1}^{+\\infty} \\frac{(-1)^{n-1}}{n}$.

1. Montrer que $S$ converge.
2. Montrer que $S = \\ln(2)$.
3. Donner un encadrement de $S - S_n$.`,
        reconnaissance: {
            question: 'Quel critere permet de conclure a la convergence ?',
            options: [
                { text: 'Critere des series alternees (Leibniz)', correct: true },
                { text: 'Convergence absolue', correct: false },
                { text: 'Critere de d\'Alembert', correct: false },
                { text: 'Comparaison a une serie de Riemann', correct: false }
            ],
            feedback: { correct: 'Exact ! Critere de Leibniz.', incorrect: 'C\'est le critere des series alternees.' }
        },
        strategie: {
            question: 'Comment montrer que $S = \\ln(2)$ ?',
            attendu: 'Utiliser le DSE $\\ln(1+x) = \\sum \\frac{(-1)^{n-1} x^n}{n}$ pour $|x| \\leq 1$, $x \\neq -1$.',
            exemple: `1. $(1/n)$ positive decroissante vers 0 : Leibniz
2. $\\ln(1+x) = \\sum \\frac{(-1)^{n-1} x^n}{n}$, en $x = 1$ : $\\ln(2)$
3. $|S - S_n| \\leq \\frac{1}{n+1}$`
        },
        indices: [
            { title: 'Idee cle', content: 'DSE de $\\ln(1+x)$ en $x = 1$.' },
            { title: 'Outil precis', content: 'Theoreme d\'Abel radial.' },
            { title: 'Point technique', content: 'L\'encadrement du reste.' }
        ],
        oral: { prompt: 'Enonce le theoreme des series alternees avec la majoration du reste.', tips: ['Trois hypotheses', 'Majoration $|R_n| \\leq a_{n+1}$'] },
        debrief: {
            attendu: 'Application directe du critere de Leibniz.',
            erreurs: ['Ne pas verifier la decroissance', 'Oublier que la CV absolue est fausse'],
            variantes: ['Reordonner la serie (theoreme de Riemann)'],
            liens: { methodes: ['series-alternees'], exercices: [], notions: ['Convergence conditionnelle'] }
        }
    },
    {
        id: 'serie-fonctions-cv',
        title: 'Convergence de series de fonctions',
        theme: 'series',
        concours: 'X',
        year: 2025,
        difficulty: 3,
        methodes: ['derivation-limite', 'integration-limite'],
        enonce: `Soit $f_n(x) = \\frac{x^n}{n}$ pour $x \\in [0, 1]$.

1. Montrer que $\\sum f_n$ converge simplement sur $[0, 1]$.
2. La convergence est-elle uniforme sur $[0, 1]$ ? Sur $[0, a]$ avec $a < 1$ ?
3. Calculer $\\sum_{n=1}^{+\\infty} \\frac{1}{n \\cdot 2^n}$.`,
        reconnaissance: {
            question: 'Pourquoi la CVU echoue-t-elle sur $[0,1]$ ?',
            options: [
                { text: 'En $x = 1$, on a la serie harmonique qui diverge', correct: true },
                { text: 'Les $f_n$ ne sont pas continues', correct: false },
                { text: 'La limite n\'est pas definie', correct: false },
                { text: 'Le critere de Weierstrass echoue', correct: false }
            ],
            feedback: { correct: 'Exact ! En $x = 1$, $f_n(1) = 1/n$ et $\\sum 1/n$ diverge.', incorrect: 'Le probleme est en $x = 1$ ou la serie des normes diverge.' }
        },
        strategie: {
            question: 'Comment prouver la CVU sur $[0, a]$ ?',
            attendu: 'Critere de Weierstrass : $|f_n(x)| \\leq a^n/n \\leq a^n$ et $\\sum a^n$ converge.',
            exemple: `1. CVS par critere de d'Alembert ou comparaison
2. Sur $[0,1]$ : non, car $\\sup |f_n| = 1/n$ et $\\sum 1/n$ DV
   Sur $[0,a]$ : oui, Weierstrass
3. $\\sum \\frac{1}{n 2^n} = -\\ln(1 - 1/2) = \\ln(2)$`
        },
        indices: [
            { title: 'Idee cle', content: 'Separer le cas $x = 1$ des autres.' },
            { title: 'Outil precis', content: 'Critere de Weierstrass pour la CVU.' },
            { title: 'Point technique', content: '$\\sum x^n/n = -\\ln(1-x)$ pour $|x| < 1$.' }
        ],
        oral: { prompt: 'Compare CVS, CVU et CVN.', tips: ['CVN => CVU => CVS', 'Contre-exemples dans chaque sens'] },
        debrief: {
            attendu: 'Distinction claire entre les modes de convergence.',
            erreurs: ['Confondre CVS et CVU', 'Appliquer Weierstrass avec une serie DV'],
            variantes: ['Etudier $\\sum x^n / n^2$'],
            liens: { methodes: ['derivation-limite'], exercices: [], notions: ['CVU', 'CVS', 'Weierstrass'] }
        }
    },
    {
        id: 'serie-entiere-rayon',
        title: 'Rayon de convergence et prolongement',
        theme: 'series',
        concours: 'ENS',
        year: 2025,
        difficulty: 2,
        methodes: ['taylor'],
        enonce: `Soit $f(z) = \\sum_{n=0}^{+\\infty} a_n z^n$ une serie entiere de rayon de convergence $R > 0$.

1. Rappeler la formule de Hadamard pour $R$.
2. Si $a_n = \\frac{1}{n!}$, calculer $R$ et identifier $f$.
3. Si $a_n = n!$, calculer $R$.
4. Si $a_n = \\frac{(-1)^n}{n+1}$, calculer $R$ et $f$ explicitement.`,
        reconnaissance: {
            question: 'Quelle est la formule de Hadamard ?',
            options: [
                { text: '$1/R = \\limsup |a_n|^{1/n}$', correct: true },
                { text: '$R = \\lim |a_n/a_{n+1}|$', correct: false },
                { text: '$R = \\sum |a_n|$', correct: false },
                { text: '$R = \\inf\\{|z| : f(z) = 0\\}$', correct: false }
            ],
            feedback: { correct: 'Exact ! Formule de Hadamard.', incorrect: 'La formule de Hadamard est $1/R = \\limsup |a_n|^{1/n}$.' }
        },
        strategie: {
            question: 'Comment calculer $R$ pour $a_n = n!$ ?',
            attendu: 'Utiliser Hadamard ou d\'Alembert.',
            exemple: `2. $a_n = 1/n!$ : $(n!)^{1/n} \\sim n/e \\to +\\infty$, donc $1/R = 0$, $R = +\\infty$, $f = e^z$
3. $a_n = n!$ : $(n!)^{1/n} \\to +\\infty$, $R = 0$
4. $a_n = (-1)^n/(n+1)$ : $R = 1$, $f(z) = -\\ln(1-z)/z$`
        },
        indices: [
            { title: 'Idee cle', content: 'Hadamard toujours applicable, d\'Alembert si la limite existe.' },
            { title: 'Outil precis', content: 'Stirling : $n! \\sim \\sqrt{2\\pi n}(n/e)^n$.' },
            { title: 'Point technique', content: 'Pour Q4, reconnaitre le DSE de $-\\ln(1-z)$.' }
        ],
        oral: { prompt: 'Quand utiliser Hadamard vs d\'Alembert ?', tips: ['D\'Alembert si $a_{n+1}/a_n$ a une limite', 'Hadamard toujours'] },
        debrief: {
            attendu: 'Maitrise des deux formules.',
            erreurs: ['Confondre $R$ et $1/R$', 'Oublier que d\'Alembert necessite l\'existence de la limite'],
            variantes: ['Lacunes dans les coefficients'],
            liens: { methodes: ['taylor'], exercices: [], notions: ['Series entieres', 'Rayon CV'] }
        }
    },
    // ===== FONCTIONS =====
    {
        id: 'rolle-deguise',
        title: 'Theoreme de Rolle deguise',
        theme: 'fonctions',
        concours: 'X',
        year: 2025,
        difficulty: 2,
        methodes: ['rolle'],
        enonce: `Soit $f : [0,1] \\to \\mathbb{R}$ continue, derivable sur $]0,1[$, telle que $f(0) = 0$ et $f(1) = 1$.

1. Montrer qu'il existe $c \\in ]0,1[$ tel que $f(c) = c$.
2. Soit $n \\geq 1$. Montrer qu'il existe $c_1 < c_2 < \\ldots < c_n$ dans $]0,1[$ tels que $\\sum_{k=1}^n f'(c_k) = n$.`,
        reconnaissance: {
            question: 'Quel theoreme est cache derriere la question 2 ?',
            options: [
                { text: 'Accroissements finis sur des sous-intervalles', correct: true },
                { text: 'Theoreme des valeurs intermediaires', correct: false },
                { text: 'Inegalite des accroissements finis', correct: false },
                { text: 'Theoreme de Darboux', correct: false }
            ],
            feedback: { correct: 'Exact ! On applique les AF sur chaque sous-intervalle.', incorrect: 'C\'est les accroissements finis repetes.' }
        },
        strategie: {
            question: 'Comment decouper l\'intervalle pour la question 2 ?',
            attendu: 'Decouper $[0,1]$ en $n$ intervalles egaux et appliquer les AF sur chaque morceau.',
            exemple: `1. TVI sur $g(x) = f(x) - x$
2. Sur $[\\frac{k-1}{n}, \\frac{k}{n}]$, par AF : $f(\\frac{k}{n}) - f(\\frac{k-1}{n}) = \\frac{1}{n} f'(c_k)$
   Somme : $f(1) - f(0) = 1 = \\frac{1}{n} \\sum f'(c_k)$`
        },
        indices: [
            { title: 'Idee cle', content: 'TVI pour Q1, AF pour Q2.' },
            { title: 'Outil precis', content: 'AF : $f(b) - f(a) = (b-a) f\'(c)$.' },
            { title: 'Point technique', content: 'La somme telescopique.' }
        ],
        oral: { prompt: 'Illustre geometriquement la question 2.', tips: ['Dessiner les secantes', 'Les $f\'(c_k)$ sont des pentes'] },
        debrief: {
            attendu: 'Utilisation fine des accroissements finis.',
            erreurs: ['Oublier que les $c_k$ sont distincts', 'Confusion Rolle et AF'],
            variantes: ['Montrer $\\exists c$ tel que $f\'(c) = 1$'],
            liens: { methodes: ['rolle'], exercices: [], notions: ['Accroissements finis'] }
        }
    },
    {
        id: 'convexite-inegalite',
        title: 'Convexite et inegalite AM-GM',
        theme: 'fonctions',
        concours: 'Centrale',
        year: 2025,
        difficulty: 2,
        methodes: ['convexite'],
        enonce: `Soit $f : ]0, +\\infty[ \\to \\mathbb{R}$ definie par $f(x) = x \\ln(x)$.

1. Etudier la convexite de $f$.
2. En deduire que pour tous $a, b > 0$ : $\\frac{a+b}{2} \\ln\\left(\\frac{a+b}{2}\\right) \\leq \\frac{a \\ln(a) + b \\ln(b)}{2}$.
3. Montrer l'inegalite AM-GM : $\\sqrt{ab} \\leq \\frac{a+b}{2}$.`,
        reconnaissance: {
            question: 'Quelle propriete de $f$ est utilisee ?',
            options: [
                { text: 'La convexite de $f$', correct: true },
                { text: 'La croissance de $f$', correct: false },
                { text: 'La positivite de $f$', correct: false },
                { text: 'La continuite de $f$', correct: false }
            ],
            feedback: { correct: 'Exact ! $f$ convexe donne Jensen.', incorrect: 'C\'est la convexite.' }
        },
        strategie: {
            question: 'Comment obtenir AM-GM ?',
            attendu: 'Appliquer Jensen a $f$ ou a $g(x) = -\\ln(x)$.',
            exemple: `1. $f''(x) = 1/x > 0$ : $f$ strictement convexe
2. Jensen : $f((a+b)/2) \\leq (f(a) + f(b))/2$
3. $g(x) = -\\ln(x)$ convexe donne $\\sqrt{ab} \\leq (a+b)/2$`
        },
        indices: [
            { title: 'Idee cle', content: 'Jensen pour fonctions convexes.' },
            { title: 'Outil precis', content: '$f$ convexe ssi $f\'\'\\geq 0$.' },
            { title: 'Point technique', content: 'Alternative avec $-\\ln$.' }
        ],
        oral: { prompt: 'Enonce Jensen et son interpretation geometrique.', tips: ['Barycentre', 'Position par rapport a la corde'] },
        debrief: {
            attendu: 'Maitrise de la convexite et Jensen.',
            erreurs: ['Confondre convexe/concave', 'Mal poser Jensen'],
            variantes: ['AM-GM-HM'],
            liens: { methodes: ['convexite'], exercices: [], notions: ['Inegalite de Jensen'] }
        }
    },
    {
        id: 'equation-fonctionnelle',
        title: 'Equation fonctionnelle $f(x+y) = f(x)f(y)$',
        theme: 'fonctions',
        concours: 'X',
        year: 2025,
        difficulty: 3,
        methodes: ['taylor'],
        enonce: `Soit $f : \\mathbb{R} \\to \\mathbb{R}^*_+$ de classe $C^1$ verifiant :
$$\\forall x, y \\in \\mathbb{R}, \\quad f(x+y) = f(x)f(y)$$

1. Montrer que $f(0) = 1$.
2. Montrer que $f' = f'(0) \\cdot f$.
3. En deduire $f$.`,
        reconnaissance: {
            question: 'Quelle fonction verifie cette equation fonctionnelle ?',
            options: [
                { text: '$f(x) = e^{\\lambda x}$ pour un certain $\\lambda$', correct: true },
                { text: '$f(x) = x^n$ pour un certain $n$', correct: false },
                { text: '$f(x) = \\cos(x)$', correct: false },
                { text: '$f(x) = 1/(1+x^2)$', correct: false }
            ],
            feedback: { correct: 'Exact ! Seules les exponentielles verifient cette equation.', incorrect: 'Les exponentielles sont les seules solutions.' }
        },
        strategie: {
            question: 'Comment montrer Q2 ?',
            attendu: 'Deriver par rapport a $y$ puis poser $y = 0$.',
            exemple: `1. $f(0) = f(0+0) = f(0)^2$, donc $f(0) = 1$ (car $f > 0$)
2. Derivons en $y$ : $f'(x+y) = f(x)f'(y)$, en $y = 0$ : $f'(x) = f(x)f'(0)$
3. Posons $\\lambda = f'(0)$. Alors $f' = \\lambda f$, d'ou $f(x) = Ce^{\\lambda x}$, et $f(0) = 1$ donne $C = 1$.`
        },
        indices: [
            { title: 'Idee cle', content: 'Evaluer en $(0,0)$ pour Q1, deriver pour Q2.' },
            { title: 'Outil precis', content: 'L\'EDL $f\' = \\lambda f$ a pour solutions $Ce^{\\lambda x}$.' },
            { title: 'Point technique', content: 'La condition $f(0) = 1$ fixe la constante.' }
        ],
        oral: { prompt: 'Que se passe-t-il si on ne suppose pas $f$ derivable ?', tips: ['Solutions pathologiques', 'Besoin de mesurabilite ou continuite'] },
        debrief: {
            attendu: 'Resolution complete de l\'equation fonctionnelle.',
            erreurs: ['Oublier la condition initiale', 'Ne pas justifier $f(0) \\neq 0$'],
            variantes: ['$f(xy) = f(x) + f(y)$ (logarithme)'],
            liens: { methodes: ['taylor'], exercices: [], notions: ['Equations fonctionnelles'] }
        }
    },
    {
        id: 'extrema-oscillants',
        title: 'Extrema de solutions d\'EDO',
        theme: 'fonctions',
        concours: 'ENS',
        year: 2025,
        difficulty: 3,
        methodes: ['rolle'],
        enonce: `Soit $\\psi : [a, b] \\to \\mathbb{R}^*_+$ de classe $C^1$ croissante et $y : [a, b] \\to \\mathbb{R}$ de classe $C^2$ verifiant :
$$y'' + \\psi(x)y = 0$$

Montrer que les extrema de $|y|$ forment une suite decroissante.`,
        reconnaissance: {
            question: 'Quel type d\'equation differentielle est-ce ?',
            options: [
                { text: 'Equation de Sturm-Liouville', correct: true },
                { text: 'Equation de Bernoulli', correct: false },
                { text: 'Equation de Riccati', correct: false },
                { text: 'Equation de Bessel', correct: false }
            ],
            feedback: { correct: 'Exact ! C\'est une equation de type Sturm-Liouville.', incorrect: 'C\'est une equation de Sturm-Liouville.' }
        },
        strategie: {
            question: 'Comment etudier les extrema de $|y|$ ?',
            attendu: 'Etudier $E(x) = y(x)^2 + y\'(x)^2/\\psi(x)$ ou utiliser le wronskien.',
            exemple: `On pose $E(x) = y^2 + \\frac{(y')^2}{\\psi(x)}$ (energie).
$E' = 2yy' + 2\\frac{y'y''}{\\psi} - \\frac{(y')^2 \\psi'}{\\psi^2}$
$= 2yy' - 2\\frac{y'\\psi y}{\\psi} - \\frac{(y')^2 \\psi'}{\\psi^2} = - \\frac{(y')^2 \\psi'}{\\psi^2} \\leq 0$
Donc $E$ decroissante, et les max de $|y|$ (ou $y' = 0$) decroissent.`
        },
        indices: [
            { title: 'Idee cle', content: 'Construire une "energie" decroissante.' },
            { title: 'Outil precis', content: '$y\'\' = -\\psi y$ pour simplifier les calculs.' },
            { title: 'Point technique', content: 'Aux extrema de $|y|$, $y\' = 0$ donc $E = y^2$.' }
        ],
        oral: { prompt: 'Interprete physiquement ce resultat.', tips: ['Oscillateur avec frequence croissante', 'Dissipation d\'energie'] },
        debrief: {
            attendu: 'Construction de l\'energie et analyse de sa monotonie.',
            erreurs: ['Mauvaise derivation de $E$', 'Oublier que $\\psi\' \\geq 0$'],
            variantes: ['Theoreme de comparaison de Sturm'],
            liens: { methodes: ['rolle'], exercices: [], notions: ['EDO', 'Energie'] }
        }
    },
    // ===== INTEGRALES =====
    {
        id: 'integrale-parametre',
        title: 'Integrale a parametre et regularite',
        theme: 'integrales',
        concours: 'ENS',
        year: 2025,
        difficulty: 3,
        methodes: ['integration-limite'],
        enonce: `Soit $F(x) = \\int_0^{+\\infty} \\frac{e^{-t}}{1 + xt} dt$ pour $x \\geq 0$.

1. Montrer que $F$ est bien definie et continue sur $[0, +\\infty[$.
2. Montrer que $F$ est de classe $C^1$ sur $]0, +\\infty[$ et calculer $F'(x)$.
3. Etudier le comportement de $F(x)$ quand $x \\to +\\infty$.`,
        reconnaissance: {
            question: 'Quels theoremes utiliser pour la regularite de $F$ ?',
            options: [
                { text: 'Continuite et derivation sous l\'integrale', correct: true },
                { text: 'Convergence dominee uniquement', correct: false },
                { text: 'Integration par parties', correct: false },
                { text: 'Changement de variable', correct: false }
            ],
            feedback: { correct: 'Exact ! Theoremes sur les integrales a parametre.', incorrect: 'Ce sont les theoremes de continuite/derivation sous l\'integrale.' }
        },
        strategie: {
            question: 'Comment justifier la derivation sous le signe integrale ?',
            attendu: 'Verifier la domination uniforme locale de la derivee partielle.',
            exemple: `1. $|e^{-t}/(1+xt)| \\leq e^{-t}$ integrable : $F$ bien definie
2. $\\partial_x(e^{-t}/(1+xt)) = -te^{-t}/(1+xt)^2$, domine sur $[a,b]$ par $te^{-t}/(1+at)^2$
3. Changement $u = xt$ : $F(x) \\sim \\ln(x)/x$`
        },
        indices: [
            { title: 'Idee cle', content: 'Domination par une fonction independante de $x$.' },
            { title: 'Outil precis', content: 'Pour $x \\in [a,b]$, dominer par une fonction de $t$ seul.' },
            { title: 'Point technique', content: 'Le changement $u = xt$ pour l\'asymptotique.' }
        ],
        oral: { prompt: 'Enonce le theoreme de derivation sous l\'integrale.', tips: ['Domination locale', 'Derivee partielle continue'] },
        debrief: {
            attendu: 'Verification rigoureuse des hypotheses.',
            erreurs: ['Oublier la domination', 'Se tromper dans le domaine'],
            variantes: ['Fonction Gamma'],
            liens: { methodes: ['integration-limite'], exercices: [], notions: ['Integrales a parametre'] }
        }
    },
    {
        id: 'ipp-astucieuse',
        title: 'Integrales de Wallis',
        theme: 'integrales',
        concours: 'Centrale',
        year: 2025,
        difficulty: 2,
        methodes: ['ipp'],
        enonce: `Soit $I_n = \\int_0^{\\pi/2} \\sin^n(x) dx$ pour $n \\geq 0$.

1. Calculer $I_0$ et $I_1$.
2. Montrer que $I_n = \\frac{n-1}{n} I_{n-2}$ pour $n \\geq 2$.
3. En deduire $I_n$ pour tout $n$.
4. Montrer que $I_n \\sim \\sqrt{\\frac{\\pi}{2n}}$.`,
        reconnaissance: {
            question: 'Quelle technique donne la recurrence ?',
            options: [
                { text: 'Integration par parties', correct: true },
                { text: 'Changement de variable', correct: false },
                { text: 'Developpement en serie', correct: false },
                { text: 'Formule de Stirling', correct: false }
            ],
            feedback: { correct: 'Exact ! IPP avec $\\sin^{n-1} \\cdot \\sin$.', incorrect: 'C\'est une IPP classique.' }
        },
        strategie: {
            question: 'Comment effectuer l\'IPP ?',
            attendu: 'Poser $u = \\sin^{n-1}(x)$, $v\' = \\sin(x)$.',
            exemple: `1. $I_0 = \\pi/2$, $I_1 = 1$
2. IPP et $\\cos^2 = 1 - \\sin^2$ donnent $I_n = (n-1)(I_{n-2} - I_n)$
3. Formules de Wallis explicites
4. $I_n I_{n+1} = \\pi/(2(n+1))$ et Cesaro`
        },
        indices: [
            { title: 'Idee cle', content: 'Decomposer $\\sin^n = \\sin^{n-1} \\cdot \\sin$.' },
            { title: 'Outil precis', content: '$\\cos^2 = 1 - \\sin^2$.' },
            { title: 'Point technique', content: '$I_n I_{n+1} = \\pi/(2(n+1))$ pour l\'equivalent.' }
        ],
        oral: { prompt: 'Calcule $I_4$ et $I_5$.', tips: ['$I_4 = 3\\pi/16$', '$I_5 = 8/15$'] },
        debrief: {
            attendu: 'Integrales de Wallis : classique absolu.',
            erreurs: ['Erreur de signe dans l\'IPP', 'Oublier le terme aux bornes'],
            variantes: ['Formule de Wallis pour $\\pi$'],
            liens: { methodes: ['ipp'], exercices: [], notions: ['Integrales de Wallis'] }
        }
    },
    {
        id: 'integrale-gamma',
        title: 'Fonction Gamma',
        theme: 'integrales',
        concours: 'X',
        year: 2025,
        difficulty: 3,
        methodes: ['ipp', 'integration-limite'],
        enonce: `On definit pour $x > 0$ : $\\Gamma(x) = \\int_0^{+\\infty} t^{x-1} e^{-t} dt$.

1. Montrer que $\\Gamma$ est bien definie sur $]0, +\\infty[$.
2. Montrer que $\\Gamma(x+1) = x\\Gamma(x)$.
3. En deduire $\\Gamma(n+1) = n!$ pour $n \\in \\mathbb{N}$.
4. Montrer que $\\Gamma$ est de classe $C^\\infty$ sur $]0, +\\infty[$.`,
        reconnaissance: {
            question: 'Comment s\'obtient la relation fonctionnelle Q2 ?',
            options: [
                { text: 'Integration par parties', correct: true },
                { text: 'Changement de variable', correct: false },
                { text: 'Derivation sous l\'integrale', correct: false },
                { text: 'Theoreme de Fubini', correct: false }
            ],
            feedback: { correct: 'Exact ! IPP avec $u = t^x$, $v\' = e^{-t}$.', incorrect: 'C\'est une IPP.' }
        },
        strategie: {
            question: 'Comment justifier la convergence de l\'integrale ?',
            attendu: 'Etudier le comportement en 0 et en $+\\infty$ separement.',
            exemple: `1. En 0 : $t^{x-1}e^{-t} \\sim t^{x-1}$ integrable ssi $x > 0$
   En $+\\infty$ : $t^{x-1}e^{-t} = o(1/t^2)$ donc integrable
2. IPP : $[t^x e^{-t}]_0^{+\\infty} = 0$ et reste $x\\int t^{x-1}e^{-t}$
3. Recurrence et $\\Gamma(1) = 1$
4. Derivation sous l\'integrale iteree`
        },
        indices: [
            { title: 'Idee cle', content: 'Separer $\\int_0^1 + \\int_1^{+\\infty}$.' },
            { title: 'Outil precis', content: 'En $+\\infty$, $e^{-t}$ domine toute puissance.' },
            { title: 'Point technique', content: 'Pour $C^\\infty$, deriver $\\ln(t)^k t^{x-1}e^{-t}$.' }
        ],
        oral: { prompt: 'Calcule $\\Gamma(1/2)$.', tips: ['Changement $u = \\sqrt{t}$', 'Integrale de Gauss', '$\\Gamma(1/2) = \\sqrt{\\pi}$'] },
        debrief: {
            attendu: 'Maitrise complete de la fonction Gamma.',
            erreurs: ['Mal evaluer les bornes dans l\'IPP', 'Oublier les conditions de domination'],
            variantes: ['Fonction Beta', 'Formule de duplication'],
            liens: { methodes: ['ipp', 'integration-limite'], exercices: [], notions: ['Fonction Gamma', 'Factorielle'] }
        }
    },
    // ===== ALGEBRE LINEAIRE =====
    {
        id: 'exp-matrice-diag',
        title: 'Exponentielle de matrices',
        theme: 'algebre',
        concours: 'ENS',
        year: 2025,
        difficulty: 2,
        methodes: ['exp-matrice', 'diagonalisation'],
        enonce: `1. Montrer que si $X$ et $Y$ commutent alors $e^{X+Y} = e^X e^Y$.
2. Montrer que $e^{PXP^{-1}} = P e^X P^{-1}$.
3. On definit $\\ln A = \\sum_{k=1}^{\\infty} \\frac{(-1)^{k+1}}{k}(A - I_n)^k$.
   a) Determiner le domaine de definition.
   b) Montrer que $\\exp(\\ln A) = A$.
4. Montrer que si $X$ et $Y$ ne commutent pas, alors $(e^{X/n}e^{Y/n})^n \\to e^{X+Y}$ (formule de Lie-Trotter).`,
        reconnaissance: {
            question: 'Pourquoi $e^{A+B} \\neq e^A e^B$ en general ?',
            options: [
                { text: 'Parce que $AB \\neq BA$ en general', correct: true },
                { text: 'Parce que l\'exponentielle n\'est pas definie', correct: false },
                { text: 'Parce que la serie diverge', correct: false },
                { text: 'Parce que les matrices ne sont pas carrees', correct: false }
            ],
            feedback: { correct: 'Exact ! La formule $e^{A+B} = e^A e^B$ necessite $AB = BA$.', incorrect: 'Le probleme est la non-commutativite.' }
        },
        strategie: {
            question: 'Comment demontrer Q1 ?',
            attendu: 'Developper les series et utiliser la commutativite pour rearranger.',
            exemple: `1. Si $AB = BA$, $(A+B)^n = \\sum \\binom{n}{k} A^k B^{n-k}$ (binome)
   Donc $e^{A+B} = \\sum \\frac{(A+B)^n}{n!} = (\\sum \\frac{A^k}{k!})(\\sum \\frac{B^l}{l!})$
2. $P(\\sum A^n/n!)P^{-1} = \\sum (PAP^{-1})^n/n!$
4. DL : $(e^{X/n}e^{Y/n})^n = (I + (X+Y)/n + O(1/n^2))^n \\to e^{X+Y}$`
        },
        indices: [
            { title: 'Idee cle', content: 'La commutativite permet d\'utiliser le binome.' },
            { title: 'Outil precis', content: 'RCV infini pour l\'exponentielle.' },
            { title: 'Point technique', content: 'Pour $\\ln$, RCV = 1 donc $\\|A - I\\| < 1$.' }
        ],
        oral: { prompt: 'Donne un contre-exemple a $e^{A+B} = e^A e^B$.', tips: ['Matrices nilpotentes', 'Verifier $AB \\neq BA$'] },
        debrief: {
            attendu: 'Manipulation rigoureuse des series de matrices.',
            erreurs: ['Utiliser $e^{A+B} = e^A e^B$ sans commutativite', 'Oublier le RCV de $\\ln$'],
            variantes: ['Formule de Baker-Campbell-Hausdorff'],
            liens: { methodes: ['exp-matrice'], exercices: [], notions: ['Exponentielle matricielle'] }
        }
    },
    {
        id: 'commutateur-rang1',
        title: 'Commutateur de rang 1',
        theme: 'algebre',
        concours: 'ENS',
        year: 2025,
        difficulty: 3,
        methodes: ['diagonalisation'],
        enonce: `Soient $A, B \\in \\mathcal{M}_n(\\mathbb{C})$. On suppose que leur commutateur $[A, B] = AB - BA$ est de rang 1.

Montrer que $A$ et $B$ sont co-trigonalisables.`,
        reconnaissance: {
            question: 'Que signifie co-trigonalisable ?',
            options: [
                { text: 'Il existe une base ou les deux matrices sont triangulaires superieures', correct: true },
                { text: 'Les deux matrices commutent', correct: false },
                { text: 'Les deux matrices sont diagonalisables', correct: false },
                { text: 'Les deux matrices ont memes valeurs propres', correct: false }
            ],
            feedback: { correct: 'Exact ! Simultanement triangulaires dans une meme base.', incorrect: 'Co-trigonalisable = triangulaires simultanement.' }
        },
        strategie: {
            question: 'Quelle est l\'idee principale ?',
            attendu: 'Montrer que $\\mathrm{Ker}(A - \\lambda I)$ ou $\\mathrm{Im}(A - \\lambda I)$ est stable par $B$.',
            exemple: `Le rang 1 implique que $\\mathrm{Ker}[A,B]$ est de codimension 1.
$[A,B]$ de rang 1 s'ecrit $[A,B] = uv^*$ pour certains $u, v$.
On montre que les sous-espaces propres generalises de $A$ sont stables par $B$.
Recurrence sur $n$ pour construire une base commune triangularisante.`
        },
        indices: [
            { title: 'Idee cle', content: '$\\mathrm{rg}[A,B] = 1$ contraint fortement la structure.' },
            { title: 'Outil precis', content: 'Stabilite des sous-espaces caracteristiques.' },
            { title: 'Point technique', content: 'Recurrence sur la dimension.' }
        ],
        oral: { prompt: 'Si $[A,B] = 0$, qu\'en deduit-on ?', tips: ['Commutent', 'Co-diagonalisables si diagonalisables'] },
        debrief: {
            attendu: 'Raisonnement structurel sur les sous-espaces stables.',
            erreurs: ['Confondre rang 1 et nilpotent', 'Oublier le cas complexe'],
            variantes: ['Commutateur nilpotent'],
            liens: { methodes: ['diagonalisation'], exercices: [], notions: ['Commutateur', 'Trigonalisation'] }
        }
    },
    {
        id: 'decomposition-polaire',
        title: 'Decomposition polaire',
        theme: 'algebre',
        concours: 'ENS',
        year: 2025,
        difficulty: 2,
        methodes: ['diagonalisation'],
        enonce: `Soit $S_n^{++}$ l'ensemble des matrices symetriques definies positives, $O_n$ le groupe orthogonal.

1. Montrer que deux matrices diagonalisables qui commutent sont co-diagonalisables.
2. On definit $\\varphi : S_n^{++} \\times O_n \\to GL_n(\\mathbb{R})$ par $\\varphi(H, Q) = HQ$. Montrer que $\\varphi$ est bijective.
3. Montrer que $\\varphi^{-1}$ est continue.`,
        reconnaissance: {
            question: 'Comment s\'appelle cette decomposition ?',
            options: [
                { text: 'Decomposition polaire', correct: true },
                { text: 'Decomposition de Schur', correct: false },
                { text: 'Decomposition de Jordan', correct: false },
                { text: 'Decomposition QR', correct: false }
            ],
            feedback: { correct: 'Exact ! $M = HQ$ avec $H$ SDP et $Q$ orthogonale.', incorrect: 'C\'est la decomposition polaire.' }
        },
        strategie: {
            question: 'Comment trouver $H$ a partir de $M$ ?',
            attendu: '$H = \\sqrt{M^TM}$ (racine carree de matrice SDP).',
            exemple: `1. Sous-espaces propres stables par l'autre matrice
2. Surjectivite : $M \\in GL_n$, $M^TM$ SDP, $H = \\sqrt{M^TM}$, $Q = H^{-1}M$
   Injectivite : si $H_1Q_1 = H_2Q_2$, alors $H_1^2 = H_2^2$ donc $H_1 = H_2$
3. $H = \\sqrt{M^TM}$ et $Q = H^{-1}M$ sont continues en $M$`
        },
        indices: [
            { title: 'Idee cle', content: '$H^2 = M^TM$ determine $H$ uniquement (SDP).' },
            { title: 'Outil precis', content: 'Racine carree de matrice SDP par diagonalisation.' },
            { title: 'Point technique', content: 'Continuite de la racine carree.' }
        ],
        oral: { prompt: 'Compare avec la decomposition $z = re^{i\\theta}$ dans $\\mathbb{C}$.', tips: ['$r = |z|$, $e^{i\\theta} = z/|z|$', 'Analogue matriciel'] },
        debrief: {
            attendu: 'Construction explicite de la decomposition.',
            erreurs: ['Confondre $M^TM$ et $MM^T$', 'Oublier l\'unicite de la racine carree SDP'],
            variantes: ['Decomposition SVD'],
            liens: { methodes: ['diagonalisation'], exercices: [], notions: ['Matrices SDP', 'Groupe orthogonal'] }
        }
    },
    // ===== PROBABILITES =====
    {
        id: 'proba-esperance',
        title: 'Limite d\'esperance',
        theme: 'probabilites',
        concours: 'X',
        year: 2025,
        difficulty: 3,
        methodes: ['taylor'],
        enonce: `Soit $(X_k)_{k \\geq 1}$ une suite de v.a. independantes avec :
$$\\mathbb{P}(X_k = k) = \\frac{1}{k}, \\quad \\mathbb{P}(X_k = 0) = 1 - \\frac{1}{k}$$

On pose $S_n = \\sum_{k=1}^n X_k$. Determiner $\\lim_{n \\to \\infty} \\mathbb{E}\\left(e^{-\\lambda S_n/n}\\right)$ pour $\\lambda > 0$.`,
        reconnaissance: {
            question: 'Quel outil est adapte pour calculer l\'esperance d\'une exponentielle ?',
            options: [
                { text: 'Fonction generatrice / caracteristique', correct: true },
                { text: 'Inegalite de Markov', correct: false },
                { text: 'Loi forte des grands nombres', correct: false },
                { text: 'Theoreme central limite', correct: false }
            ],
            feedback: { correct: 'Exact ! On utilise $\\mathbb{E}(e^{tX}) = \\prod \\mathbb{E}(e^{tX_k})$.', incorrect: 'L\'independance permet de factoriser l\'esperance.' }
        },
        strategie: {
            question: 'Comment calculer $\\mathbb{E}(e^{-\\lambda X_k/n})$ ?',
            attendu: '$\\mathbb{E}(e^{-\\lambda X_k/n}) = (1 - 1/k) + (1/k)e^{-\\lambda k/n}$.',
            exemple: `$\\mathbb{E}(e^{-\\lambda S_n/n}) = \\prod_{k=1}^n \\mathbb{E}(e^{-\\lambda X_k/n})$
$= \\prod_{k=1}^n \\left(1 - \\frac{1}{k}(1 - e^{-\\lambda k/n})\\right)$
$\\ln(\\cdot) = \\sum_{k=1}^n \\ln(1 - \\frac{1}{k}(1 - e^{-\\lambda k/n}))$
$\\approx -\\sum_{k=1}^n \\frac{1}{k}(1 - e^{-\\lambda k/n}) \\to -\\int_0^\\infty \\frac{1-e^{-\\lambda t}}{t}dt$`
        },
        indices: [
            { title: 'Idee cle', content: 'Independance => produit des esperances.' },
            { title: 'Outil precis', content: '$\\ln(1-x) \\approx -x$ pour $x$ petit.' },
            { title: 'Point technique', content: 'Somme de Riemann vers integrale.' }
        ],
        oral: { prompt: 'Interprete le resultat.', tips: ['Loi limite', 'Transformee de Laplace'] },
        debrief: {
            attendu: 'Passage rigoureux a la limite.',
            erreurs: ['Oublier l\'independance', 'Mal gerer le DL'],
            variantes: ['Convergence en loi'],
            liens: { methodes: ['taylor'], exercices: [], notions: ['Fonction generatrice', 'Convergence'] }
        }
    },
    // ===== EXERCICES SUPPLEMENTAIRES =====
    {
        id: 'suite-adjacente',
        title: 'Suites adjacentes et pi',
        theme: 'suites',
        concours: 'Centrale',
        year: 2025,
        difficulty: 2,
        methodes: ['recurrence', 'encadrement'],
        enonce: `On pose $a_0 = 0$, $b_0 = 4$ et pour tout $n \\geq 0$ :
$$a_{n+1} = \\frac{a_n + b_n}{2}, \\quad b_{n+1} = \\sqrt{a_{n+1} b_n}$$

1. Montrer que $(a_n)$ et $(b_n)$ sont adjacentes.
2. Montrer que leur limite commune $\\ell$ verifie $\\ell = \\pi$.`,
        reconnaissance: {
            question: 'Quel type de suites etudie-t-on ?',
            options: [
                { text: 'Suites adjacentes', correct: true },
                { text: 'Suites arithmetico-geometriques', correct: false },
                { text: 'Suites de Cauchy', correct: false },
                { text: 'Suites homographiques', correct: false }
            ],
            feedback: { correct: 'Exact ! Ce sont les suites de Borchardt qui convergent vers $\\pi$.', incorrect: 'Les suites $(a_n)$ croissante et $(b_n)$ decroissante de meme limite sont adjacentes.' }
        },
        strategie: {
            question: 'Comment montrer l\'adjacence ?',
            attendu: 'Montrer $a_n \\leq a_{n+1} \\leq b_{n+1} \\leq b_n$ et $b_n - a_n \\to 0$.',
            exemple: `1. AM-GM : $a_{n+1} = (a_n+b_n)/2 \\geq \\sqrt{a_n b_n}$
   Comme $b_{n+1} = \\sqrt{a_{n+1}b_n}$ et $a_n \\leq b_n$, on verifie les inegalites
2. Lien avec l'integrale elliptique et $\\pi$`
        },
        indices: [
            { title: 'Idee cle', content: 'Inegalite AM-GM : $(a+b)/2 \\geq \\sqrt{ab}$.' },
            { title: 'Outil precis', content: '$b_n - a_n$ decroit geometriquement.' },
            { title: 'Point technique', content: 'Le lien avec $\\pi$ passe par les integrales elliptiques.' }
        ],
        oral: { prompt: 'Compare avec la methode d\'Archimede pour $\\pi$.', tips: ['Polygones inscrits/circonscrits', 'Convergence plus lente'] },
        debrief: {
            attendu: 'Verification methodique des conditions d\'adjacence.',
            erreurs: ['Oublier de montrer la monotonie stricte', 'Ne pas verifier $b_n - a_n \\to 0$'],
            variantes: ['Moyenne arithmetico-geometrique de Gauss'],
            liens: { methodes: ['recurrence', 'encadrement'], exercices: ['suite-recurrence'], notions: ['Suites adjacentes'] }
        }
    },
    {
        id: 'serie-riemann-zeta',
        title: 'Fonction zeta et valeurs speciales',
        theme: 'series',
        concours: 'ENS',
        year: 2025,
        difficulty: 3,
        methodes: ['comparaison-serie-integrale', 'taylor'],
        enonce: `On definit pour $s > 1$ : $\\zeta(s) = \\sum_{n=1}^{+\\infty} \\frac{1}{n^s}$.

1. Montrer que $\\zeta$ est bien definie et de classe $C^\\infty$ sur $]1, +\\infty[$.
2. Montrer que $(s-1)\\zeta(s) \\to 1$ quand $s \\to 1^+$.
3. Calculer $\\zeta(2) = \\sum \\frac{1}{n^2}$ (indication : utiliser $\\sum_{n=1}^N \\frac{1}{n^2} = \\frac{\\pi^2}{6} - \\frac{1}{N} + o(1/N)$).`,
        reconnaissance: {
            question: 'Quelle est la nature de cette serie pour $s > 1$ ?',
            options: [
                { text: 'Serie de Riemann convergente', correct: true },
                { text: 'Serie geometrique', correct: false },
                { text: 'Serie alternee', correct: false },
                { text: 'Serie telescopique', correct: false }
            ],
            feedback: { correct: 'Exact ! C\'est la serie de Riemann $\\sum 1/n^s$, base de la fonction zeta.', incorrect: 'C\'est la celebre serie de Riemann.' }
        },
        strategie: {
            question: 'Comment montrer la derivabilite de $\\zeta$ ?',
            attendu: 'Derivation terme a terme avec domination uniforme locale.',
            exemple: `1. CVU sur $[a,+\\infty[$ pour tout $a > 1$ : domination par $n^{-a}$
   Derivees : $\\zeta^{(k)}(s) = \\sum (-\\ln n)^k / n^s$
2. Comparaison serie-integrale : $\\zeta(s) \\sim 1/(s-1)$ quand $s \\to 1^+$
3. $\\zeta(2) = \\pi^2/6$ (probleme de Bale, resolu par Euler)`
        },
        indices: [
            { title: 'Idee cle', content: 'Convergence uniforme sur tout compact de $]1,+\\infty[$.' },
            { title: 'Outil precis', content: 'Comparaison : $\\sum 1/n^s \\sim \\int_1^\\infty x^{-s} dx = 1/(s-1)$.' },
            { title: 'Point technique', content: 'Pour $\\zeta(2)$, plusieurs methodes : Fourier, residus, produit infini.' }
        ],
        oral: { prompt: 'Cite d\'autres valeurs speciales de $\\zeta$.', tips: ['$\\zeta(4) = \\pi^4/90$', 'Valeurs aux entiers pairs', 'Hypothese de Riemann'] },
        debrief: {
            attendu: 'Maitrise des series de Riemann et de la fonction zeta.',
            erreurs: ['Oublier que $\\zeta$ n\'est pas definie en $s=1$', 'Confondre $\\zeta(s)$ et $1/(s-1)$'],
            variantes: ['Prolongement analytique', 'Equation fonctionnelle'],
            liens: { methodes: ['comparaison-serie-integrale'], exercices: ['serie-integrale'], notions: ['Fonction zeta', 'Series de Riemann'] }
        }
    },
    {
        id: 'derivee-limite-uniforme',
        title: 'Derivation et convergence uniforme',
        theme: 'series',
        concours: 'X',
        year: 2025,
        difficulty: 2,
        methodes: ['derivation-limite'],
        enonce: `Soit $f_n(x) = \\frac{\\sin(nx)}{n}$ pour $x \\in \\mathbb{R}$ et $n \\geq 1$.

1. Montrer que $(f_n)$ converge uniformement vers 0 sur $\\mathbb{R}$.
2. Montrer que $(f_n')$ ne converge pas uniformement sur $\\mathbb{R}$.
3. Sur quel intervalle a-t-on CVU de $(f_n')$ ?`,
        reconnaissance: {
            question: 'Pourquoi la CVU de $f_n$ n\'implique pas celle de $f_n\'$ ?',
            options: [
                { text: 'Le theoreme requiert la CVU de $f_n\'$, pas de $f_n$', correct: true },
                { text: 'Les $f_n$ ne sont pas derivables', correct: false },
                { text: 'La limite n\'est pas derivable', correct: false },
                { text: 'L\'intervalle n\'est pas borne', correct: false }
            ],
            feedback: { correct: 'Exact ! Pour deriver la limite, c\'est la CVU de $f_n\'$ qui compte.', incorrect: 'La CVU de $f_n$ ne suffit pas pour deriver.' }
        },
        strategie: {
            question: 'Comment montrer la non-CVU de $f_n\'$ ?',
            attendu: 'Trouver une suite $(x_n)$ telle que $f_n\'(x_n)$ ne tend pas vers 0.',
            exemple: `1. $\\|f_n\\|_\\infty = 1/n \\to 0$ : CVU
2. $f_n'(x) = \\cos(nx)$. En $x = 0$ : $f_n'(0) = 1 \\not\\to 0$
   Donc $\\|f_n' - 0\\|_\\infty \\geq 1$
3. Sur $[a, 2\\pi - a]$ avec $a > 0$, pas de CVU non plus`
        },
        indices: [
            { title: 'Idee cle', content: 'La norme sup de $\\cos(nx)$ vaut 1.' },
            { title: 'Outil precis', content: 'CVU ssi $\\|f_n - f\\|_\\infty \\to 0$.' },
            { title: 'Point technique', content: 'Meme sur un segment, la CVU peut echouer.' }
        ],
        oral: { prompt: 'Modifie $f_n$ pour avoir CVU de $f_n\'$.', tips: ['$f_n(x) = \\sin(nx)/n^2$', 'Alors $f_n\'(x) = \\cos(nx)/n$'] },
        debrief: {
            attendu: 'Contre-exemple classique pour la derivation des limites.',
            erreurs: ['Croire que CVU de $f_n$ implique CVU de $f_n\'$', 'Oublier de verifier les hypotheses'],
            variantes: ['Meme question avec $\\cos$'],
            liens: { methodes: ['derivation-limite'], exercices: ['serie-fonctions-cv'], notions: ['CVU', 'Derivation'] }
        }
    },
    {
        id: 'borne-inf-atteinte',
        title: 'Borne inferieure et compacite',
        theme: 'fonctions',
        concours: 'ENS',
        year: 2025,
        difficulty: 2,
        methodes: ['encadrement'],
        enonce: `Soit $f : \\mathbb{R} \\to \\mathbb{R}$ continue telle que $\\lim_{|x| \\to +\\infty} f(x) = +\\infty$.

1. Montrer que $f$ atteint son minimum.
2. Soit $A \\subset \\mathbb{R}$ ferme non vide. Montrer que $d(x, A) = \\inf_{a \\in A} |x - a|$ est atteint.
3. Caracteriser les fermes $A$ tels que $d(\\cdot, A)$ soit differentiable sur $\\mathbb{R} \\setminus A$.`,
        reconnaissance: {
            question: 'Quelle propriete topologique est utilisee ?',
            options: [
                { text: 'Compacite (theoreme des bornes atteintes)', correct: true },
                { text: 'Connexite', correct: false },
                { text: 'Completude', correct: false },
                { text: 'Separabilite', correct: false }
            ],
            feedback: { correct: 'Exact ! Une fonction continue sur un compact atteint ses bornes.', incorrect: 'C\'est la compacite qui garantit l\'existence du minimum.' }
        },
        strategie: {
            question: 'Comment ramener le probleme a un compact ?',
            attendu: 'Utiliser la condition a l\'infini pour se restreindre a un intervalle borne.',
            exemple: `1. Soit $m = f(0)$. Il existe $R$ tel que $|x| > R \\Rightarrow f(x) > m$.
   Donc $\\inf_\\mathbb{R} f = \\inf_{[-R,R]} f$, atteint par compacite.
2. Meme idee : on se restreint a un compact
3. Fermes convexes (et quelques autres)`
        },
        indices: [
            { title: 'Idee cle', content: 'La condition a l\'infini permet de se ramener a un compact.' },
            { title: 'Outil precis', content: 'Theoreme de Weierstrass : $f$ continue sur un compact atteint ses bornes.' },
            { title: 'Point technique', content: 'Pour Q3, etudier ou $d$ n\'est pas differentiable.' }
        ],
        oral: { prompt: 'Donne un contre-exemple si on enleve la condition a l\'infini.', tips: ['$f(x) = e^{-x}$ sur $\\mathbb{R}$', '$\\inf = 0$ non atteint'] },
        debrief: {
            attendu: 'Utilisation judicieuse de la compacite.',
            erreurs: ['Appliquer Weierstrass sans compact', 'Oublier la condition a l\'infini'],
            variantes: ['En dimension superieure', 'Distance a un convexe'],
            liens: { methodes: ['encadrement'], exercices: [], notions: ['Compacite', 'Bornes atteintes'] }
        }
    },
    {
        id: 'integrale-gauss',
        title: 'Integrale de Gauss',
        theme: 'integrales',
        concours: 'X',
        year: 2025,
        difficulty: 2,
        methodes: ['changement-variable'],
        enonce: `On veut calculer $I = \\int_0^{+\\infty} e^{-x^2} dx$.

1. Montrer que $I$ converge.
2. En posant $J = \\int_0^{+\\infty} \\int_0^{+\\infty} e^{-(x^2+y^2)} dx\\,dy$, montrer que $J = I^2$.
3. Calculer $J$ en coordonnees polaires et en deduire $I$.`,
        reconnaissance: {
            question: 'Quelle technique est utilisee pour calculer cette integrale ?',
            options: [
                { text: 'Passage en coordonnees polaires', correct: true },
                { text: 'Integration par parties', correct: false },
                { text: 'Serie de Taylor', correct: false },
                { text: 'Residus', correct: false }
            ],
            feedback: { correct: 'Exact ! Le passage en dimension 2 puis en polaires est la methode classique.', incorrect: 'La cle est le passage en coordonnees polaires apres elevation au carre.' }
        },
        strategie: {
            question: 'Pourquoi elever l\'integrale au carre ?',
            attendu: 'Pour obtenir une integrale double qui se factorise et se calcule en polaires.',
            exemple: `1. $e^{-x^2} \\leq e^{-x}$ pour $x \\geq 1$, donc $I$ converge
2. $J = (\\int_0^\\infty e^{-x^2}dx)(\\int_0^\\infty e^{-y^2}dy) = I^2$ (Fubini)
3. Polaires : $J = \\int_0^{\\pi/2} \\int_0^\\infty e^{-r^2} r\\,dr\\,d\\theta = \\frac{\\pi}{4}$
   Donc $I = \\sqrt{\\pi}/2$`
        },
        indices: [
            { title: 'Idee cle', content: 'Elever au carre pour obtenir $x^2 + y^2 = r^2$.' },
            { title: 'Outil precis', content: '$\\int_0^\\infty r e^{-r^2} dr = 1/2$.' },
            { title: 'Point technique', content: 'Le jacobien en polaires est $r$.' }
        ],
        oral: { prompt: 'Calcule $\\int_{-\\infty}^{+\\infty} e^{-x^2/2} dx$.', tips: ['Changement $u = x/\\sqrt{2}$', 'Resultat : $\\sqrt{2\\pi}$'] },
        debrief: {
            attendu: 'Calcul classique de l\'integrale de Gauss.',
            erreurs: ['Oublier le jacobien $r$', 'Se tromper dans les bornes angulaires'],
            variantes: ['Integrale de Fresnel', 'Fonction Gamma'],
            liens: { methodes: ['changement-variable'], exercices: ['integrale-gamma'], notions: ['Integrale de Gauss', 'Coordonnees polaires'] }
        }
    },
    {
        id: 'integrale-frullani',
        title: 'Integrale de Frullani',
        theme: 'integrales',
        concours: 'Centrale',
        year: 2025,
        difficulty: 3,
        methodes: ['changement-variable', 'integration-limite'],
        enonce: `Soit $f : ]0, +\\infty[ \\to \\mathbb{R}$ continue, avec $f(0^+) = \\ell$ et $f(+\\infty) = L$ (limites finies).

Montrer que pour tous $a, b > 0$ :
$$\\int_0^{+\\infty} \\frac{f(ax) - f(bx)}{x} dx = (\\ell - L) \\ln\\left(\\frac{b}{a}\\right)$$`,
        reconnaissance: {
            question: 'Comment interpreter cette integrale ?',
            options: [
                { text: 'Difference de deux integrales liees par changement de variable', correct: true },
                { text: 'Integrale a parametre', correct: false },
                { text: 'Transformee de Laplace', correct: false },
                { text: 'Convolution', correct: false }
            ],
            feedback: { correct: 'Exact ! Le changement $u = ax$ ou $u = bx$ relie les deux termes.', incorrect: 'L\'astuce est de voir $f(ax)/x$ et $f(bx)/x$ comme liees.' }
        },
        strategie: {
            question: 'Quelle est l\'idee de la demonstration ?',
            attendu: 'Ecrire l\'integrale comme $\\int_0^\\infty \\int_b^a \\frac{d}{dt}[f(tx)/t] dt\\,dx$ et permuter.',
            exemple: `Methode 1 : Changements $u = ax$ et $u = bx$
$\\int_0^M \\frac{f(ax)}{x}dx = \\int_0^{aM} \\frac{f(u)}{u}du$
La difference fait apparaitre $\\int_{bM}^{aM}$ qui tend vers $(\\ell - L)\\ln(a/b)$

Methode 2 : Fubini sur $\\int_b^a \\int_0^\\infty f'(tx) dx\\,dt$`
        },
        indices: [
            { title: 'Idee cle', content: 'La structure $f(ax) - f(bx)$ est telescopique en $\\ln$.' },
            { title: 'Outil precis', content: '$\\int_\\varepsilon^M \\frac{dx}{x} = \\ln(M/\\varepsilon)$.' },
            { title: 'Point technique', content: 'Justifier la convergence aux bornes.' }
        ],
        oral: { prompt: 'Applique a $f(x) = e^{-x}$.', tips: ['$\\ell = 1$, $L = 0$', '$\\int (e^{-ax} - e^{-bx})/x = \\ln(b/a)$'] },
        debrief: {
            attendu: 'Integrale de Frullani : classique en analyse.',
            erreurs: ['Oublier de verifier les hypotheses', 'Se tromper dans le signe'],
            variantes: ['Extension aux fonctions non monotones'],
            liens: { methodes: ['changement-variable'], exercices: [], notions: ['Integrale de Frullani'] }
        }
    },
    {
        id: 'matrice-nilpotente',
        title: 'Matrices nilpotentes',
        theme: 'algebre',
        concours: 'Centrale',
        year: 2025,
        difficulty: 2,
        methodes: ['diagonalisation'],
        enonce: `Soit $N \\in \\mathcal{M}_n(\\mathbb{K})$ nilpotente (i.e. $\\exists p$, $N^p = 0$).

1. Montrer que 0 est la seule valeur propre de $N$.
2. Montrer que $N$ n'est pas diagonalisable sauf si $N = 0$.
3. Calculer $e^N$ explicitement.
4. Montrer que $I + N$ est inversible et calculer $(I + N)^{-1}$.`,
        reconnaissance: {
            question: 'Quelle est la caracteristique du spectre d\'une matrice nilpotente ?',
            options: [
                { text: 'Toutes les valeurs propres sont nulles', correct: true },
                { text: 'Pas de valeurs propres', correct: false },
                { text: 'Valeurs propres de module 1', correct: false },
                { text: 'Valeurs propres distinctes', correct: false }
            ],
            feedback: { correct: 'Exact ! Si $Nx = \\lambda x$, alors $N^p x = \\lambda^p x = 0$, donc $\\lambda = 0$.', incorrect: 'Nilpotente implique spectre = {0}.' }
        },
        strategie: {
            question: 'Comment calculer $e^N$ ?',
            attendu: 'La serie s\'arrete : $e^N = I + N + N^2/2! + \\cdots + N^{p-1}/(p-1)!$.',
            exemple: `1. Si $Nv = \\lambda v$, $v \\neq 0$, alors $0 = N^p v = \\lambda^p v$, donc $\\lambda = 0$
2. Si $N$ diagonalisable avec VP 0 seulement, $N = P \\cdot 0 \\cdot P^{-1} = 0$
3. $e^N = \\sum_{k=0}^{p-1} N^k / k!$ (somme finie)
4. $(I+N)^{-1} = I - N + N^2 - \\cdots + (-1)^{p-1} N^{p-1}$`
        },
        indices: [
            { title: 'Idee cle', content: 'Nilpotente => serie de Taylor finie.' },
            { title: 'Outil precis', content: 'Serie geometrique tronquee pour $(I+N)^{-1}$.' },
            { title: 'Point technique', content: 'Indice de nilpotence = plus petit $p$ tel que $N^p = 0$.' }
        ],
        oral: { prompt: 'Donne un exemple de matrice nilpotente $3 \\times 3$ d\'indice 3.', tips: ['Matrice de Jordan', '$N_{ij} = \\delta_{i,j-1}$'] },
        debrief: {
            attendu: 'Maitrise des matrices nilpotentes.',
            erreurs: ['Croire que nilpotente = nulle', 'Oublier que la serie est finie'],
            variantes: ['Decomposition de Dunford'],
            liens: { methodes: ['diagonalisation', 'exp-matrice'], exercices: ['exp-matrice-diag'], notions: ['Nilpotence', 'Exponentielle'] }
        }
    },
    {
        id: 'endomorphisme-symetrique',
        title: 'Theoreme spectral',
        theme: 'algebre',
        concours: 'X',
        year: 2025,
        difficulty: 2,
        methodes: ['diagonalisation'],
        enonce: `Soit $E$ un espace euclidien et $u \\in \\mathcal{L}(E)$ symetrique ($\\forall x,y$, $\\langle u(x), y \\rangle = \\langle x, u(y) \\rangle$).

1. Montrer que les valeurs propres de $u$ sont reelles.
2. Montrer que les sous-espaces propres sont deux a deux orthogonaux.
3. En deduire que $u$ est diagonalisable dans une base orthonormee.`,
        reconnaissance: {
            question: 'Quel theoreme fondamental est demontre ici ?',
            options: [
                { text: 'Theoreme spectral', correct: true },
                { text: 'Theoreme de Cayley-Hamilton', correct: false },
                { text: 'Theoreme de Jordan', correct: false },
                { text: 'Theoreme de Sylvester', correct: false }
            ],
            feedback: { correct: 'Exact ! Les endomorphismes symetriques sont orthogonalement diagonalisables.', incorrect: 'C\'est le theoreme spectral.' }
        },
        strategie: {
            question: 'Comment montrer que les VP sont reelles ?',
            attendu: 'Si $u(x) = \\lambda x$, calculer $\\langle u(x), x \\rangle$ de deux facons.',
            exemple: `1. $\\lambda \\|x\\|^2 = \\langle u(x), x \\rangle = \\langle x, u(x) \\rangle = \\bar{\\lambda} \\|x\\|^2$
   Donc $\\lambda = \\bar{\\lambda}$, i.e. $\\lambda \\in \\mathbb{R}$
2. Si $u(x) = \\lambda x$ et $u(y) = \\mu y$ avec $\\lambda \\neq \\mu$ :
   $\\lambda \\langle x, y \\rangle = \\langle u(x), y \\rangle = \\langle x, u(y) \\rangle = \\mu \\langle x, y \\rangle$
3. Recurrence sur $\\dim E$ avec $E_\\lambda^\\perp$ stable`
        },
        indices: [
            { title: 'Idee cle', content: 'Symetrie = $\\langle u(x), y \\rangle$ invariant par permutation.' },
            { title: 'Outil precis', content: 'L\'orthogonal d\'un SEP est stable.' },
            { title: 'Point technique', content: 'Existence d\'au moins une VP (sur $\\mathbb{R}$ ou $\\mathbb{C}$).' }
        ],
        oral: { prompt: 'Applique a une matrice symetrique $2 \\times 2$.', tips: ['Trouver les VP', 'Construire la BON'] },
        debrief: {
            attendu: 'Demonstration complete du theoreme spectral.',
            erreurs: ['Oublier de montrer que l\'orthogonal est stable', 'Confondre reel et complexe'],
            variantes: ['Endomorphismes normaux', 'Matrices hermitiennes'],
            liens: { methodes: ['diagonalisation'], exercices: ['decomposition-polaire'], notions: ['Theoreme spectral', 'Diagonalisation orthogonale'] }
        }
    },
    {
        id: 'marche-aleatoire',
        title: 'Marche aleatoire sur Z',
        theme: 'probabilites',
        concours: 'Centrale',
        year: 2025,
        difficulty: 2,
        methodes: ['recurrence'],
        enonce: `Un marcheur part de 0 et fait des pas de +1 ou -1 avec probabilite 1/2 chacun.
Soit $S_n = X_1 + \\cdots + X_n$ sa position apres $n$ pas.

1. Calculer $\\mathbb{E}(S_n)$ et $\\mathrm{Var}(S_n)$.
2. Montrer que $\\mathbb{P}(S_{2n} = 0) = \\binom{2n}{n} / 2^{2n}$.
3. En deduire que $\\mathbb{P}(S_{2n} = 0) \\sim 1/\\sqrt{\\pi n}$.
4. La marche est-elle recurrente (i.e. revient-elle en 0 p.s.) ?`,
        reconnaissance: {
            question: 'Quel est le comportement typique de $S_n$ ?',
            options: [
                { text: '$S_n \\sim \\sqrt{n}$ (TCL)', correct: true },
                { text: '$S_n \\sim n$', correct: false },
                { text: '$S_n \\to 0$', correct: false },
                { text: '$S_n$ est bornee', correct: false }
            ],
            feedback: { correct: 'Exact ! $S_n / \\sqrt{n}$ converge en loi vers une gaussienne.', incorrect: 'Par le TCL, $S_n$ est de l\'ordre de $\\sqrt{n}$.' }
        },
        strategie: {
            question: 'Comment obtenir l\'equivalent de $\\mathbb{P}(S_{2n} = 0)$ ?',
            attendu: 'Utiliser Stirling : $n! \\sim \\sqrt{2\\pi n} (n/e)^n$.',
            exemple: `1. $\\mathbb{E}(S_n) = 0$, $\\mathrm{Var}(S_n) = n$
2. $S_{2n} = 0$ ssi $n$ pas +1 et $n$ pas -1 : $\\binom{2n}{n}$ chemins
3. Stirling : $\\binom{2n}{n} / 4^n \\sim 1/\\sqrt{\\pi n}$
4. $\\sum \\mathbb{P}(S_{2n} = 0) = +\\infty$ : recurrence (Borel-Cantelli inverse)`
        },
        indices: [
            { title: 'Idee cle', content: 'Compter les chemins revenant en 0.' },
            { title: 'Outil precis', content: 'Stirling : $n! \\sim \\sqrt{2\\pi n}(n/e)^n$.' },
            { title: 'Point technique', content: 'Recurrence ssi $\\sum \\mathbb{P}(S_{2n} = 0) = +\\infty$.' }
        ],
        oral: { prompt: 'La marche aleatoire en dimension 3 est-elle recurrente ?', tips: ['Non !', 'Polya : recurrente ssi $d \\leq 2$'] },
        debrief: {
            attendu: 'Proprietes classiques de la marche aleatoire.',
            erreurs: ['Oublier que seuls les indices pairs comptent', 'Se tromper dans Stirling'],
            variantes: ['Marche biaisee', 'Temps de retour'],
            liens: { methodes: ['recurrence'], exercices: [], notions: ['Marche aleatoire', 'Recurrence'] }
        }
    },
    {
        id: 'proba-variable-continue',
        title: 'Loi exponentielle et memoire',
        theme: 'probabilites',
        concours: 'ENS',
        year: 2025,
        difficulty: 2,
        methodes: [],
        enonce: `Soit $X$ une v.a. positive de densite $f$.

1. Montrer que $X$ est sans memoire (i.e. $\\mathbb{P}(X > s+t | X > s) = \\mathbb{P}(X > t)$) ssi $X \\sim \\mathcal{E}(\\lambda)$.
2. Calculer $\\mathbb{E}(X)$ et $\\mathrm{Var}(X)$ pour $X \\sim \\mathcal{E}(\\lambda)$.
3. Soit $(X_i)$ i.i.d. de loi $\\mathcal{E}(\\lambda)$. Quelle est la loi de $\\min(X_1, \\ldots, X_n)$ ?`,
        reconnaissance: {
            question: 'Quelle propriete caracterise la loi exponentielle ?',
            options: [
                { text: 'Absence de memoire', correct: true },
                { text: 'Symetrie', correct: false },
                { text: 'Moments finis', correct: false },
                { text: 'Support borne', correct: false }
            ],
            feedback: { correct: 'Exact ! L\'exponentielle est la seule loi continue sans memoire.', incorrect: 'La propriete caracteristique est l\'absence de memoire.' }
        },
        strategie: {
            question: 'Comment demontrer la caracterisation ?',
            attendu: 'Poser $g(t) = \\mathbb{P}(X > t)$ et montrer que $g(s+t) = g(s)g(t)$.',
            exemple: `1. $g(s+t) = g(s)g(t)$ => equation fonctionnelle de Cauchy
   Solutions continues : $g(t) = e^{-\\lambda t}$, i.e. $X \\sim \\mathcal{E}(\\lambda)$
2. $\\mathbb{E}(X) = 1/\\lambda$, $\\mathrm{Var}(X) = 1/\\lambda^2$
3. $\\mathbb{P}(\\min > t) = \\mathbb{P}(X_1 > t)^n = e^{-n\\lambda t}$ : $\\mathcal{E}(n\\lambda)$`
        },
        indices: [
            { title: 'Idee cle', content: 'L\'absence de memoire donne une equation fonctionnelle.' },
            { title: 'Outil precis', content: 'Equation de Cauchy : $g(s+t) = g(s)g(t)$.' },
            { title: 'Point technique', content: 'Le min de $n$ exponentielles est exponentielle.' }
        ],
        oral: { prompt: 'Interprete l\'absence de memoire pour un temps d\'attente.', tips: ['Processus de Poisson', '"Le futur ne depend pas du passe"'] },
        debrief: {
            attendu: 'Caracterisation et proprietes de la loi exponentielle.',
            erreurs: ['Confondre densite et fonction de survie', 'Oublier le parametre dans le min'],
            variantes: ['Loi geometrique (version discrete)', 'Processus de Poisson'],
            liens: { methodes: [], exercices: ['proba-esperance'], notions: ['Loi exponentielle', 'Sans memoire'] }
        }
    },
    {
        id: 'determinant-special',
        title: 'Determinant de Vandermonde',
        theme: 'algebre',
        concours: 'Centrale',
        year: 2025,
        difficulty: 2,
        methodes: ['recurrence'],
        enonce: `Soit $V_n = \\begin{vmatrix} 1 & x_1 & x_1^2 & \\cdots & x_1^{n-1} \\\\ 1 & x_2 & x_2^2 & \\cdots & x_2^{n-1} \\\\ \\vdots & & & & \\vdots \\\\ 1 & x_n & x_n^2 & \\cdots & x_n^{n-1} \\end{vmatrix}$

1. Calculer $V_2$ et $V_3$.
2. Montrer que $V_n = \\prod_{1 \\leq i < j \\leq n} (x_j - x_i)$.
3. En deduire une CNS d'inversibilite de la matrice de Vandermonde.`,
        reconnaissance: {
            question: 'Quelle propriete du determinant utilise-t-on ?',
            options: [
                { text: 'Multilinearite et alternance', correct: true },
                { text: 'Developpement par rapport a une ligne', correct: false },
                { text: 'Determinant d\'un produit', correct: false },
                { text: 'Trace et determinant', correct: false }
            ],
            feedback: { correct: 'Exact ! Le determinant est polynomial alterne en les $x_i$.', incorrect: 'La cle est que le det est un polynome alterne.' }
        },
        strategie: {
            question: 'Comment demontrer la formule ?',
            attendu: 'Montrer que $V_n$ est divisible par $(x_j - x_i)$ pour tout $i < j$, puis comparer les degres.',
            exemple: `1. $V_2 = x_2 - x_1$, $V_3 = (x_2-x_1)(x_3-x_1)(x_3-x_2)$
2. Si $x_i = x_j$, deux lignes egales => $V_n = 0$
   Donc $(x_j - x_i) | V_n$. Comparaison des degres : egalite a constante pres.
   Coefficient dominant : 1 (par recurrence)
3. Inversible ssi les $x_i$ sont distincts`
        },
        indices: [
            { title: 'Idee cle', content: 'Polynome alterne => divisible par $\\prod(x_j - x_i)$.' },
            { title: 'Outil precis', content: 'Degre de $V_n$ : $0+1+\\cdots+(n-1) = n(n-1)/2$.' },
            { title: 'Point technique', content: 'Recurrence sur $n$ pour le coefficient.' }
        ],
        oral: { prompt: 'Application a l\'interpolation de Lagrange.', tips: ['Systeme de Vandermonde', 'Existence et unicite du polynome interpolateur'] },
        debrief: {
            attendu: 'Formule de Vandermonde et applications.',
            erreurs: ['Se tromper dans l\'ordre des facteurs', 'Oublier le signe'],
            variantes: ['Determinant de Cauchy', 'Matrices de Gram'],
            liens: { methodes: ['recurrence'], exercices: [], notions: ['Determinant de Vandermonde', 'Polynomes'] }
        }
    },
    {
        id: 'suite-definie-serie',
        title: 'Suite definie par une serie',
        theme: 'suites',
        concours: 'ENS',
        year: 2025,
        difficulty: 3,
        methodes: ['encadrement', 'comparaison-serie-integrale'],
        enonce: `On pose $u_n = \\sum_{k=n}^{2n} \\frac{1}{k}$ pour $n \\geq 1$.

1. Montrer que $(u_n)$ converge.
2. Determiner sa limite.
3. Donner un developpement asymptotique de $u_n$ a l'ordre 2 en $1/n$.`,
        reconnaissance: {
            question: 'Comment interpreter $u_n$ ?',
            options: [
                { text: 'Difference de sommes partielles de la serie harmonique', correct: true },
                { text: 'Serie telescopique', correct: false },
                { text: 'Suite de Cauchy', correct: false },
                { text: 'Reste d\'une serie', correct: false }
            ],
            feedback: { correct: 'Exact ! $u_n = H_{2n} - H_{n-1}$ ou $H_n = \\sum_{k=1}^n 1/k$.', incorrect: 'On ecrit $u_n = H_{2n} - H_{n-1}$.' }
        },
        strategie: {
            question: 'Comment trouver la limite ?',
            attendu: 'Utiliser $H_n = \\ln(n) + \\gamma + o(1)$ ou comparaison serie-integrale.',
            exemple: `1. $u_n = H_{2n} - H_{n-1}$ ou $H_n \\sim \\ln n + \\gamma$
   $u_n \\sim \\ln(2n) - \\ln(n-1) \\to \\ln(2)$
2. Limite = $\\ln(2)$
3. $u_n = \\ln(2) + \\frac{1}{2n} + O(1/n^2)$`
        },
        indices: [
            { title: 'Idee cle', content: '$H_n = \\ln(n) + \\gamma + 1/(2n) + O(1/n^2)$.' },
            { title: 'Outil precis', content: '$\\ln(2n) - \\ln(n) = \\ln(2)$.' },
            { title: 'Point technique', content: 'Comparaison serie-integrale pour le developpement.' }
        ],
        oral: { prompt: 'Calcule $\\sum_{k=n}^{2n} 1/k^2$ a l\'ordre 1.', tips: ['Equivalent a $1/n$', 'Comparaison serie-integrale'] },
        debrief: {
            attendu: 'Manipulation des sommes partielles de la serie harmonique.',
            erreurs: ['Oublier la constante d\'Euler', 'Se tromper dans les indices'],
            variantes: ['$\\sum_{k=n}^{n^2} 1/k$'],
            liens: { methodes: ['comparaison-serie-integrale', 'encadrement'], exercices: ['serie-integrale'], notions: ['Serie harmonique', 'Constante d\'Euler'] }
        }
    },
    {
        id: 'serie-produit-cauchy',
        title: 'Produit de Cauchy de series',
        theme: 'series',
        concours: 'X',
        year: 2025,
        difficulty: 2,
        methodes: ['taylor'],
        enonce: `Soient $\\sum a_n$ et $\\sum b_n$ deux series convergentes. On pose $c_n = \\sum_{k=0}^n a_k b_{n-k}$ (produit de Cauchy).

1. Montrer que si $\\sum a_n$ et $\\sum b_n$ convergent absolument, alors $\\sum c_n$ converge et $\\sum c_n = (\\sum a_n)(\\sum b_n)$.
2. Donner un contre-exemple ou les deux series convergent mais pas leur produit.
3. Montrer que si une des deux converge absolument, le produit converge vers le produit des sommes.`,
        reconnaissance: {
            question: 'Qu\'est-ce que le produit de Cauchy ?',
            options: [
                { text: 'La convolution discrete des suites $(a_n)$ et $(b_n)$', correct: true },
                { text: 'Le produit terme a terme $a_n b_n$', correct: false },
                { text: 'La somme $a_n + b_n$', correct: false },
                { text: 'Le quotient des series', correct: false }
            ],
            feedback: { correct: 'Exact ! $c_n = \\sum_{k=0}^n a_k b_{n-k}$ est une convolution.', incorrect: 'Le produit de Cauchy est une convolution discrete.' }
        },
        strategie: {
            question: 'Comment demontrer Q1 ?',
            attendu: 'Utiliser la convergence absolue pour rearranger les sommes.',
            exemple: `1. $\\sum |c_n| \\leq (\\sum |a_n|)(\\sum |b_n|)$ : CA du produit
   Par Fubini discret : $\\sum c_n = (\\sum a_n)(\\sum b_n)$
2. Contre-exemple : $a_n = b_n = (-1)^n / \\sqrt{n+1}$
   (CV mais pas CA, et le produit diverge)
3. Theoreme de Mertens`
        },
        indices: [
            { title: 'Idee cle', content: 'CA permet de rearranger les sommes doubles.' },
            { title: 'Outil precis', content: 'Theoreme de Mertens pour le cas mixte.' },
            { title: 'Point technique', content: 'Le contre-exemple classique utilise $(-1)^n/\\sqrt{n}$.' }
        ],
        oral: { prompt: 'Applique au produit $e^x \\cdot e^y = e^{x+y}$.', tips: ['DSE de $e^x$', 'Formule du binome'] },
        debrief: {
            attendu: 'Maitrise du produit de Cauchy et ses conditions.',
            erreurs: ['Croire que CV + CV suffit', 'Oublier le theoreme de Mertens'],
            variantes: ['Carre d\'une serie'],
            liens: { methodes: ['taylor'], exercices: [], notions: ['Produit de Cauchy', 'Convolution'] }
        }
    },
    {
        id: 'prolongement-continuite',
        title: 'Prolongement par continuite',
        theme: 'fonctions',
        concours: 'Centrale',
        year: 2025,
        difficulty: 2,
        methodes: ['taylor'],
        enonce: `Soit $f(x) = \\frac{\\sin(x)}{x}$ pour $x \\neq 0$.

1. Montrer que $f$ se prolonge par continuite en 0. Quelle est la valeur $f(0)$ ?
2. Montrer que le prolongement est de classe $C^\\infty$ sur $\\mathbb{R}$.
3. Calculer $\\int_0^{+\\infty} \\frac{\\sin(x)}{x} dx$ (integrale de Dirichlet).`,
        reconnaissance: {
            question: 'Pourquoi $f$ se prolonge en 0 ?',
            options: [
                { text: 'Car $\\lim_{x \\to 0} \\sin(x)/x = 1$', correct: true },
                { text: 'Car $\\sin(0) = 0$', correct: false },
                { text: 'Car $f$ est bornee', correct: false },
                { text: 'Car $f$ est monotone', correct: false }
            ],
            feedback: { correct: 'Exact ! La limite en 0 existe et vaut 1.', incorrect: 'C\'est le theoreme de la limite.' }
        },
        strategie: {
            question: 'Comment montrer que $f$ est $C^\\infty$ ?',
            attendu: 'Utiliser le DSE de $\\sin$ : $f(x) = 1 - x^2/6 + x^4/120 - \\cdots$',
            exemple: `1. $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$ (limite classique), donc $f(0) = 1$
2. $f(x) = \\sum_{n=0}^{+\\infty} \\frac{(-1)^n x^{2n}}{(2n+1)!}$ : serie entiere de RCV infini
3. $\\int_0^{+\\infty} \\frac{\\sin x}{x} dx = \\frac{\\pi}{2}$ (integrale de Dirichlet)`
        },
        indices: [
            { title: 'Idee cle', content: '$\\sin(x)/x$ est une serie entiere (sinus cardinal).' },
            { title: 'Outil precis', content: 'RCV infini => $C^\\infty$ sur $\\mathbb{R}$.' },
            { title: 'Point technique', content: 'L\'integrale de Dirichlet se calcule par Laplace ou Fubini.' }
        ],
        oral: { prompt: 'Pourquoi l\'integrale de Dirichlet converge-t-elle ?', tips: ['Pas absolument convergente', 'Abel ou IPP'] },
        debrief: {
            attendu: 'Etude complete du sinus cardinal.',
            erreurs: ['Croire que $f\'(0)$ n\'existe pas', 'Confondre CV et CA'],
            variantes: ['Fonction $\\mathrm{sinc}$', 'Transformee de Fourier'],
            liens: { methodes: ['taylor'], exercices: [], notions: ['Sinus cardinal', 'Integrale de Dirichlet'] }
        }
    },
    {
        id: 'inegalite-cauchy-schwarz',
        title: 'Inegalite de Cauchy-Schwarz',
        theme: 'algebre',
        concours: 'Centrale',
        year: 2025,
        difficulty: 1,
        methodes: ['convexite'],
        enonce: `Soit $(E, \\langle \\cdot, \\cdot \\rangle)$ un espace prehilbertien.

1. Montrer que pour tous $x, y \\in E$ : $|\\langle x, y \\rangle| \\leq \\|x\\| \\cdot \\|y\\|$.
2. Caracteriser le cas d'egalite.
3. Application : montrer que $(\\sum a_i b_i)^2 \\leq (\\sum a_i^2)(\\sum b_i^2)$.`,
        reconnaissance: {
            question: 'Quelle est l\'idee de la demonstration ?',
            options: [
                { text: 'Etudier $\\|x + ty\\|^2 \\geq 0$ comme polynome en $t$', correct: true },
                { text: 'Utiliser le theoreme de Pythagore', correct: false },
                { text: 'Developper $(\\langle x, y \\rangle)^2$', correct: false },
                { text: 'Utiliser la convexite', correct: false }
            ],
            feedback: { correct: 'Exact ! Le discriminant du polynome $\\|x + ty\\|^2$ doit etre negatif.', incorrect: 'On etudie $P(t) = \\|x + ty\\|^2 \\geq 0$.' }
        },
        strategie: {
            question: 'Comment obtenir l\'inegalite ?',
            attendu: '$P(t) = \\|y\\|^2 t^2 + 2\\langle x,y\\rangle t + \\|x\\|^2 \\geq 0$ implique $\\Delta \\leq 0$.',
            exemple: `1. $P(t) = \\|x + ty\\|^2 = \\|x\\|^2 + 2t\\langle x,y\\rangle + t^2\\|y\\|^2 \\geq 0$
   $\\Delta = 4(\\langle x,y\\rangle^2 - \\|x\\|^2\\|y\\|^2) \\leq 0$
2. Egalite ssi $\\Delta = 0$ ssi $x$ et $y$ colineaires
3. Produit scalaire canonique sur $\\mathbb{R}^n$`
        },
        indices: [
            { title: 'Idee cle', content: 'Polynome du second degre toujours positif.' },
            { title: 'Outil precis', content: '$\\Delta \\leq 0$ pour un trinome sans racine reelle.' },
            { title: 'Point technique', content: 'Cas $y = 0$ a traiter separement.' }
        ],
        oral: { prompt: 'Enonce Cauchy-Schwarz pour les integrales.', tips: ['$(\\int fg)^2 \\leq (\\int f^2)(\\int g^2)$', 'Produit scalaire $L^2$'] },
        debrief: {
            attendu: 'Demonstration classique de Cauchy-Schwarz.',
            erreurs: ['Oublier le cas d\'egalite', 'Se tromper dans le discriminant'],
            variantes: ['Inegalite de Minkowski'],
            liens: { methodes: ['convexite'], exercices: [], notions: ['Cauchy-Schwarz', 'Espaces prehilbertiens'] }
        }
    },
    // ===== ALGEBRE GENERALE =====
    {
        id: 'groupe-quotient',
        title: 'Groupe quotient et theoreme de Lagrange',
        theme: 'algebre-generale',
        concours: 'ENS',
        year: 2024,
        difficulty: 2,
        methodes: ['structures-algebriques'],
        enonce: `Soit $G$ un groupe fini et $H$ un sous-groupe de $G$.
1. Montrer que la relation $x \\sim y \\Leftrightarrow x^{-1}y \\in H$ est une relation d'equivalence.
2. Montrer que toutes les classes d'equivalence ont le meme cardinal que $H$.
3. En deduire le theoreme de Lagrange : $|H|$ divise $|G|$.
4. Application : Montrer que tout groupe d'ordre premier est cyclique.`,
        reconnaissance: {
            question: 'Que represente l\'ensemble quotient $G/H$ ?',
            options: [
                { text: 'L\'ensemble des classes a gauche modulo $H$', correct: true },
                { text: 'L\'ensemble des elements de $G$ qui commutent avec $H$', correct: false },
                { text: 'Le plus grand sous-groupe de $G$ contenu dans $H$', correct: false },
                { text: 'L\'intersection de $G$ et $H$', correct: false }
            ],
            feedback: { correct: 'Exact ! $G/H = \\{gH : g \\in G\\}$ est l\'ensemble des classes a gauche.', incorrect: '$G/H$ represente les classes d\'equivalence pour la relation $x \\sim y \\Leftrightarrow x^{-1}y \\in H$.' }
        },
        strategie: {
            question: 'Comment demontrer que les classes ont meme cardinal ?',
            attendu: 'Construire une bijection entre $H$ et une classe $gH$ quelconque.',
            exemple: `1. Reflexivite : $x^{-1}x = e \\in H$
   Symetrie : $x^{-1}y \\in H \\Rightarrow (x^{-1}y)^{-1} = y^{-1}x \\in H$
   Transitivite : $x^{-1}y, y^{-1}z \\in H \\Rightarrow x^{-1}z = (x^{-1}y)(y^{-1}z) \\in H$
2. $\\phi: H \\to gH$, $h \\mapsto gh$ est une bijection
3. $|G| = |G/H| \\cdot |H|$, donc $|H| | |G|$
4. Si $|G| = p$ premier, les seuls diviseurs sont $1$ et $p$`
        },
        indices: [
            { title: 'Idee cle', content: 'La multiplication a gauche par $g$ est une bijection de $G$.' },
            { title: 'Outil precis', content: 'Partitionner $G$ en classes disjointes.' },
            { title: 'Point technique', content: 'Pour Q4, $\\langle a \\rangle$ avec $a \\neq e$ a ordre divisant $p$.' }
        ],
        oral: { prompt: 'Donner un exemple de groupe quotient.', tips: ['$\\mathbb{Z}/n\\mathbb{Z}$', '$S_n / A_n \\simeq \\mathbb{Z}/2\\mathbb{Z}$'] },
        debrief: {
            attendu: 'Maitrise des relations d\'equivalence et des structures de groupe.',
            erreurs: ['Confondre classe a gauche et classe a droite', 'Oublier de verifier que $H$ est un sous-groupe'],
            variantes: ['Sous-groupe distingue', 'Theoreme de Cayley'],
            liens: { methodes: ['structures-algebriques'], exercices: [], notions: ['Groupes', 'Theoreme de Lagrange'] }
        }
    },
    {
        id: 'groupe-symetrique',
        title: 'Decomposition en cycles et signature',
        theme: 'algebre-generale',
        concours: 'X',
        year: 2024,
        difficulty: 2,
        methodes: ['structures-algebriques'],
        enonce: `Soit $\\sigma \\in S_n$ une permutation.
1. Montrer que toute permutation se decompose en produit de cycles a supports disjoints.
2. Montrer que cette decomposition est unique (a l'ordre pres).
3. Definir la signature $\\varepsilon(\\sigma)$ et montrer que c'est un morphisme de groupes.
4. Montrer que $\\varepsilon(\\tau) = -1$ pour toute transposition $\\tau$.
5. En deduire que $A_n = \\ker(\\varepsilon)$ est d'indice 2 dans $S_n$.`,
        reconnaissance: {
            question: 'Quel est l\'ordre d\'un cycle de longueur $k$ ?',
            options: [
                { text: '$k$', correct: true },
                { text: '$k-1$', correct: false },
                { text: '$k!$', correct: false },
                { text: '$2$', correct: false }
            ],
            feedback: { correct: 'Exact ! Un $k$-cycle a pour ordre $k$.', incorrect: 'Un $k$-cycle $(a_1 \\cdots a_k)$ verifie $\\sigma^k = \\text{id}$.' }
        },
        strategie: {
            question: 'Comment definir la signature ?',
            attendu: 'Par le signe du produit $\\prod_{i<j} \\frac{\\sigma(j) - \\sigma(i)}{j-i}$ ou par le nombre de transpositions.',
            exemple: `1. Suivre l'orbite de chaque element sous $\\sigma$
2. Unicite : les orbites partitionnent $\\{1,...,n\\}$
3. $\\varepsilon(\\sigma) = \\prod_{i<j} \\frac{\\sigma(j) - \\sigma(i)}{j-i} \\in \\{-1, +1\\}$
4. Une transposition echange exactement une paire $(i,j)$
5. $\\varepsilon$ surjectif donc $|S_n/A_n| = |\\{\\pm 1\\}| = 2$`
        },
        indices: [
            { title: 'Idee cle', content: 'Etudier l\'action de $\\sigma$ sur $\\{1,...,n\\}$.' },
            { title: 'Outil precis', content: 'Le PPCM des longueurs donne l\'ordre.' },
            { title: 'Point technique', content: 'Un $k$-cycle est produit de $k-1$ transpositions.' }
        ],
        oral: { prompt: 'Decomposer $(1~2~3~4~5) \\circ (2~4)$ en cycles.', tips: ['Calculer l\'image de chaque element', 'Suivre les orbites'] },
        debrief: {
            attendu: 'Manipulation fluide des permutations et de la signature.',
            erreurs: ['Se tromper dans l\'ordre de composition', 'Confondre ordre et signature'],
            variantes: ['Conjugaison dans $S_n$', 'Groupe alterne simple pour $n \\geq 5$'],
            liens: { methodes: ['structures-algebriques'], exercices: [], notions: ['Groupe symetrique', 'Signature'] }
        }
    },
    {
        id: 'anneau-quotient',
        title: 'Ideaux et anneaux quotients',
        theme: 'algebre-generale',
        concours: 'ENS',
        year: 2024,
        difficulty: 3,
        methodes: ['structures-algebriques'],
        enonce: `Soit $A$ un anneau commutatif unitaire et $I$ un ideal de $A$.
1. Montrer que $A/I$ herite d'une structure d'anneau.
2. Montrer que $I$ est maximal si et seulement si $A/I$ est un corps.
3. Montrer que $I$ est premier si et seulement si $A/I$ est integre.
4. Application : Determiner les ideaux maximaux de $\\mathbb{Z}$ et de $\\mathbb{R}[X]$.`,
        reconnaissance: {
            question: 'Qu\'est-ce qu\'un ideal premier ?',
            options: [
                { text: '$ab \\in I \\Rightarrow a \\in I$ ou $b \\in I$', correct: true },
                { text: '$I$ est engendre par un element premier', correct: false },
                { text: '$I$ contient tous les elements premiers', correct: false },
                { text: '$|I|$ est un nombre premier', correct: false }
            ],
            feedback: { correct: 'Exact ! C\'est la definition d\'un ideal premier.', incorrect: 'Un ideal $I$ est premier si $ab \\in I$ implique $a \\in I$ ou $b \\in I$.' }
        },
        strategie: {
            question: 'Comment caracteriser les ideaux maximaux de $\\mathbb{Z}$ ?',
            attendu: 'Les ideaux de $\\mathbb{Z}$ sont de la forme $n\\mathbb{Z}$, maximaux ssi $n$ premier.',
            exemple: `1. Operations bien definies car $I$ ideal bilate
2. $I$ maximal $\\Leftrightarrow$ seuls ideaux de $A/I$ sont $\\{0\\}$ et $A/I$ $\\Leftrightarrow$ corps
3. $A/I$ integre $\\Leftrightarrow$ $\\bar{a}\\bar{b} = 0 \\Rightarrow \\bar{a} = 0$ ou $\\bar{b} = 0$
4. Dans $\\mathbb{Z}$ : $p\\mathbb{Z}$ avec $p$ premier
   Dans $\\mathbb{R}[X]$ : $(X-a)$ pour $a \\in \\mathbb{R}$`
        },
        indices: [
            { title: 'Idee cle', content: 'Le passage au quotient preserve les proprietes algebriques.' },
            { title: 'Outil precis', content: 'Correspondance ideaux de $A/I$ $\\leftrightarrow$ ideaux de $A$ contenant $I$.' },
            { title: 'Point technique', content: '$\\mathbb{R}[X]$ est principal donc ideaux = $(P)$.' }
        ],
        oral: { prompt: 'Pourquoi $(X^2+1)$ est maximal dans $\\mathbb{R}[X]$ ?', tips: ['$\\mathbb{R}[X]/(X^2+1) \\simeq \\mathbb{C}$', '$X^2+1$ irreductible sur $\\mathbb{R}$'] },
        debrief: {
            attendu: 'Comprehension des structures quotient et caracterisation des ideaux.',
            erreurs: ['Oublier de verifier que l\'ideal est bilateral', 'Confondre premier et maximal'],
            variantes: ['Anneaux principaux', 'Anneaux euclidiens'],
            liens: { methodes: ['structures-algebriques'], exercices: [], notions: ['Ideaux', 'Anneaux quotients'] }
        }
    },
    {
        id: 'corps-finis',
        title: 'Construction et proprietes des corps finis',
        theme: 'algebre-generale',
        concours: 'X',
        year: 2025,
        difficulty: 3,
        methodes: ['structures-algebriques'],
        enonce: `1. Montrer que tout corps fini $K$ a pour cardinal une puissance d'un nombre premier.
2. Montrer que le groupe multiplicatif $(K^*, \\times)$ est cyclique.
3. Montrer qu'il existe un corps a $p^n$ elements pour tout premier $p$ et $n \\geq 1$.
4. Montrer que deux corps finis de meme cardinal sont isomorphes.`,
        reconnaissance: {
            question: 'Quelle est la caracteristique d\'un corps fini ?',
            options: [
                { text: 'Un nombre premier $p$', correct: true },
                { text: 'Toujours 2', correct: false },
                { text: 'Le cardinal du corps', correct: false },
                { text: 'Nulle', correct: false }
            ],
            feedback: { correct: 'Exact ! La caracteristique est le plus petit $p$ tel que $p \\cdot 1 = 0$.', incorrect: 'Un corps fini a caracteristique $p$ premier, et contient $\\mathbb{F}_p$ comme sous-corps.' }
        },
        strategie: {
            question: 'Comment montrer que $K^*$ est cyclique ?',
            attendu: 'Utiliser que tout sous-groupe fini du groupe multiplicatif d\'un corps est cyclique.',
            exemple: `1. $K$ contient $\\mathbb{F}_p$ donc $|K| = p^n$ (ev sur $\\mathbb{F}_p$)
2. Soit $d$ l'exposant de $K^*$. Alors $x^d = 1$ pour tout $x \\in K^*$
   Donc $|K^*| \\leq d$, mais $d \\leq |K^*|$, donc $d = |K^*|$
3. $\\mathbb{F}_{p^n} = \\mathbb{F}_p[X]/(P)$ avec $P$ irreductible de degre $n$
4. Corps de decomposition de $X^{p^n} - X$ sur $\\mathbb{F}_p$`
        },
        indices: [
            { title: 'Idee cle', content: '$K$ est un $\\mathbb{F}_p$-espace vectoriel de dimension finie.' },
            { title: 'Outil precis', content: 'Lemme : si $G \\subset K^*$ fini alors $G$ cyclique.' },
            { title: 'Point technique', content: 'Tout element de $\\mathbb{F}_{p^n}$ est racine de $X^{p^n} - X$.' }
        ],
        oral: { prompt: 'Construire $\\mathbb{F}_4$ explicitement.', tips: ['$\\mathbb{F}_2[X]/(X^2+X+1)$', 'Elements : $0, 1, \\alpha, 1+\\alpha$ avec $\\alpha^2 = \\alpha + 1$'] },
        debrief: {
            attendu: 'Construction concrete des corps finis et structure multiplicative.',
            erreurs: ['Confondre $\\mathbb{Z}/n\\mathbb{Z}$ (anneau) et $\\mathbb{F}_n$ (corps)', 'Oublier que $n$ doit etre puissance de premier'],
            variantes: ['Extensions de corps finis', 'Frobenius'],
            liens: { methodes: ['structures-algebriques'], exercices: [], notions: ['Corps finis', 'Extensions'] }
        }
    },
    {
        id: 'morphisme-groupes',
        title: 'Theoremes d\'isomorphisme',
        theme: 'algebre-generale',
        concours: 'Centrale',
        year: 2024,
        difficulty: 2,
        methodes: ['structures-algebriques'],
        enonce: `Soit $\\phi: G \\to G'$ un morphisme de groupes.
1. Montrer que $\\ker(\\phi)$ est un sous-groupe distingue de $G$.
2. Montrer que $\\text{Im}(\\phi)$ est un sous-groupe de $G'$.
3. Premier theoreme d'isomorphisme : $G/\\ker(\\phi) \\simeq \\text{Im}(\\phi)$.
4. Application : Montrer que $\\mathbb{R}/\\mathbb{Z} \\simeq S^1$ (cercle unite).`,
        reconnaissance: {
            question: 'Qu\'est-ce qu\'un sous-groupe distingue ?',
            options: [
                { text: '$gHg^{-1} = H$ pour tout $g \\in G$', correct: true },
                { text: 'Un sous-groupe abelien', correct: false },
                { text: 'Un sous-groupe d\'indice 2', correct: false },
                { text: 'Le centre de $G$', correct: false }
            ],
            feedback: { correct: 'Exact ! $H$ distingue signifie $H$ stable par conjugaison.', incorrect: '$H \\triangleleft G$ si $gHg^{-1} = H$ pour tout $g$, ie classes a gauche = classes a droite.' }
        },
        strategie: {
            question: 'Comment definir l\'isomorphisme du premier theoreme ?',
            attendu: '$\\bar{\\phi}: G/\\ker(\\phi) \\to \\text{Im}(\\phi)$, $g \\ker(\\phi) \\mapsto \\phi(g)$.',
            exemple: `1. $g(\\ker \\phi)g^{-1} = \\ker(\\phi)$ car $\\phi(gkg^{-1}) = \\phi(g)\\phi(k)\\phi(g)^{-1} = e'$
2. $\\phi(g)\\phi(h)^{-1} = \\phi(gh^{-1}) \\in \\text{Im}(\\phi)$
3. $\\bar{\\phi}$ bien definie, bijective car $\\ker(\\bar{\\phi}) = \\{e\\}$
4. $\\phi: \\mathbb{R} \\to S^1$, $t \\mapsto e^{2i\\pi t}$ a pour noyau $\\mathbb{Z}$`
        },
        indices: [
            { title: 'Idee cle', content: 'Le noyau mesure le defaut d\'injectivite.' },
            { title: 'Outil precis', content: '$\\phi(g) = \\phi(h) \\Leftrightarrow gh^{-1} \\in \\ker(\\phi)$.' },
            { title: 'Point technique', content: 'Verifier que le morphisme quotient est bien defini.' }
        ],
        oral: { prompt: 'Donner un exemple de morphisme non surjectif.', tips: ['det : $GL_n \\to \\mathbb{R}^*$', '$\\exp: (\\mathbb{R}, +) \\to (\\mathbb{R}^*_+, \\times)$'] },
        debrief: {
            attendu: 'Application fluide des theoremes d\'isomorphisme.',
            erreurs: ['Oublier de verifier que le noyau est distingue', 'Mal definir le morphisme quotient'],
            variantes: ['Deuxieme et troisieme theoremes d\'isomorphisme'],
            liens: { methodes: ['structures-algebriques'], exercices: ['groupe-quotient'], notions: ['Morphismes', 'Isomorphismes'] }
        }
    },
    // ===== TOPOLOGIE =====
    {
        id: 'espace-metrique-complet',
        title: 'Espaces metriques complets et theoreme du point fixe',
        theme: 'topologie',
        concours: 'ENS',
        year: 2024,
        difficulty: 2,
        methodes: ['point-fixe'],
        enonce: `Soit $(E, d)$ un espace metrique complet et $f: E \\to E$ une application contractante de rapport $k < 1$.
1. Montrer que $f$ admet un unique point fixe $\\ell$.
2. Montrer que pour tout $x_0 \\in E$, la suite $x_{n+1} = f(x_n)$ converge vers $\\ell$.
3. Majorer $d(x_n, \\ell)$ en fonction de $d(x_0, x_1)$, $k$ et $n$.
4. Application : Montrer que l'equation $\\cos(x) = x$ admet une unique solution dans $[0, 1]$.`,
        reconnaissance: {
            question: 'Qu\'est-ce qu\'une application contractante ?',
            options: [
                { text: '$d(f(x), f(y)) \\leq k \\cdot d(x,y)$ avec $k < 1$', correct: true },
                { text: '$f$ est decroissante', correct: false },
                { text: '$\\|f\\| < 1$', correct: false },
                { text: '$f$ diminue les distances de moitie', correct: false }
            ],
            feedback: { correct: 'Exact ! C\'est la definition d\'une contraction.', incorrect: 'Contractante signifie $d(f(x), f(y)) \\leq k \\cdot d(x,y)$ pour un $k < 1$ fixe.' }
        },
        strategie: {
            question: 'Comment montrer que $(x_n)$ est de Cauchy ?',
            attendu: '$d(x_{n+p}, x_n) \\leq \\frac{k^n}{1-k} d(x_1, x_0) \\to 0$.',
            exemple: `1. Unicite : si $f(\\ell) = \\ell$ et $f(\\ell') = \\ell'$, alors $d(\\ell, \\ell') \\leq k d(\\ell, \\ell')$
2. $d(x_{n+1}, x_n) \\leq k^n d(x_1, x_0)$ par recurrence
   $(x_n)$ de Cauchy, donc converge car $E$ complet
3. $d(x_n, \\ell) \\leq \\frac{k^n}{1-k} d(x_0, x_1)$
4. $f(x) = \\cos(x)$ sur $[0,1]$ : $|f'(x)| = |\\sin(x)| \\leq \\sin(1) < 1$`
        },
        indices: [
            { title: 'Idee cle', content: 'Serie geometrique $\\sum k^n$ convergente.' },
            { title: 'Outil precis', content: 'Inegalite triangulaire repetee.' },
            { title: 'Point technique', content: 'Verifier que l\'espace est bien complet.' }
        ],
        oral: { prompt: 'Que se passe-t-il si $k = 1$ ?', tips: ['Contre-exemple : $f(x) = x + 1$ sur $\\mathbb{R}$', 'L\'unicite peut echouer'] },
        debrief: {
            attendu: 'Demonstration rigoureuse du theoreme du point fixe de Banach.',
            erreurs: ['Oublier l\'hypothese de completude', 'Ne pas verifier $k < 1$ strictement'],
            variantes: ['Point fixe de Brouwer', 'Theoreme de Schauder'],
            liens: { methodes: ['point-fixe'], exercices: ['suite-recurrence'], notions: ['Completude', 'Contraction'] }
        }
    },
    {
        id: 'compacite-heine-borel',
        title: 'Compacite et theoreme de Heine-Borel',
        theme: 'topologie',
        concours: 'X',
        year: 2024,
        difficulty: 2,
        methodes: ['compacite'],
        enonce: `1. Montrer qu'un compact $K$ d'un espace metrique $(E, d)$ est ferme et borne.
2. Montrer que dans $\\mathbb{R}^n$, ferme borne implique compact (Heine-Borel).
3. Montrer qu'une fonction continue sur un compact est bornee et atteint ses bornes.
4. Montrer que toute suite d'un compact admet une sous-suite convergente.`,
        reconnaissance: {
            question: 'Quelle est la definition de la compacite par recouvrements ?',
            options: [
                { text: 'Tout recouvrement ouvert admet un sous-recouvrement fini', correct: true },
                { text: 'Toute suite converge', correct: false },
                { text: 'L\'espace est ferme et borne', correct: false },
                { text: 'L\'espace est complet', correct: false }
            ],
            feedback: { correct: 'Exact ! C\'est la definition de la compacite.', incorrect: 'Compact = tout recouvrement par des ouverts admet un sous-recouvrement fini.' }
        },
        strategie: {
            question: 'Comment montrer Heine-Borel ?',
            attendu: 'Argument par dichotomie ou utilisation de Bolzano-Weierstrass.',
            exemple: `1. Ferme : si $x_n \\in K$, $x_n \\to x$, alors $x \\in K$ (extraire ss-suite cv)
   Borne : sinon $B(a, n)$ recouvre pas $K$
2. Dichotomie sur un pave, extraire une sous-suite de Cauchy
3. $f(K)$ compact dans $\\mathbb{R}$, donc ferme borne, admet $\\sup$ et $\\inf$
4. Bolzano-Weierstrass generalise`
        },
        indices: [
            { title: 'Idee cle', content: 'Compacite sequentielle dans les metriques.' },
            { title: 'Outil precis', content: 'Dichotomie : couper le pave en $2^n$ parties.' },
            { title: 'Point technique', content: 'Equivalence sequentiel/recouvrement en metrique.' }
        ],
        oral: { prompt: 'Donner un ferme borne non compact.', tips: ['Dans un espace de dimension infinie', 'Boule unite de $\\ell^2$'] },
        debrief: {
            attendu: 'Comprehension des differentes caracterisations de la compacite.',
            erreurs: ['Croire que ferme borne = compact en dimension infinie', 'Oublier l\'hypothese metrique'],
            variantes: ['Compacite dans $C([0,1])$', 'Theoreme d\'Ascoli'],
            liens: { methodes: ['compacite'], exercices: [], notions: ['Compacite', 'Heine-Borel'] }
        }
    },
    {
        id: 'connexite-valeurs-intermediaires',
        title: 'Connexite et theoreme des valeurs intermediaires',
        theme: 'topologie',
        concours: 'Centrale',
        year: 2024,
        difficulty: 2,
        methodes: ['connexite'],
        enonce: `1. Montrer que $\\mathbb{R}$ est connexe.
2. Montrer que l'image continue d'un connexe est connexe.
3. En deduire le theoreme des valeurs intermediaires.
4. Montrer que $\\mathbb{R}^n \\setminus \\{0\\}$ est connexe pour $n \\geq 2$ mais pas pour $n = 1$.`,
        reconnaissance: {
            question: 'Qu\'est-ce qu\'un espace connexe ?',
            options: [
                { text: 'Les seuls ouverts-fermes sont $\\emptyset$ et l\'espace entier', correct: true },
                { text: 'Toute fonction continue est bornee', correct: false },
                { text: 'L\'espace est compact', correct: false },
                { text: 'Toute suite converge', correct: false }
            ],
            feedback: { correct: 'Exact ! Connexe = pas de partition en deux ouverts non vides.', incorrect: 'Connexe signifie qu\'on ne peut pas separer l\'espace en deux ouverts disjoints non vides.' }
        },
        strategie: {
            question: 'Comment montrer que $\\mathbb{R}$ est connexe ?',
            attendu: 'Par l\'absurde, utiliser la propriete de la borne superieure.',
            exemple: `1. Si $\\mathbb{R} = U \\cup V$ avec $U, V$ ouverts disjoints non vides,
   Soit $a \\in U$, $b \\in V$ avec $a < b$. Soit $c = \\sup(U \\cap [a,b])$.
   $c \\notin U$ (car $U$ ouvert) et $c \\notin V$ (car $V$ ouvert). Contradiction.
2. Si $f(E)$ = $A \\cup B$ separation, alors $f^{-1}(A), f^{-1}(B)$ separent $E$
3. $f([a,b])$ connexe de $\\mathbb{R}$, donc intervalle
4. $\\mathbb{R}^* = ]-\\infty, 0[ \\cup ]0, +\\infty[$ mais chemin dans $\\mathbb{R}^n \\setminus \\{0\\}$ pour $n \\geq 2$`
        },
        indices: [
            { title: 'Idee cle', content: 'Les connexes de $\\mathbb{R}$ sont les intervalles.' },
            { title: 'Outil precis', content: 'Connexite par arcs implique connexite.' },
            { title: 'Point technique', content: 'Image reciproque d\'un ouvert par $f$ continue est ouvert.' }
        ],
        oral: { prompt: 'Donner un connexe non connexe par arcs.', tips: ['Courbe du topologiste', '$\\{(x, \\sin(1/x)) : x > 0\\} \\cup \\{0\\} \\times [-1,1]$'] },
        debrief: {
            attendu: 'Lien entre connexite et TVI.',
            erreurs: ['Confondre connexe et connexe par arcs', 'Oublier que connexite depend de la topologie'],
            variantes: ['Composantes connexes', 'Connexite locale'],
            liens: { methodes: ['connexite'], exercices: [], notions: ['Connexite', 'TVI'] }
        }
    },
    {
        id: 'topologie-matrices',
        title: 'Topologie de $\\mathcal{M}_n(\\mathbb{R})$',
        theme: 'topologie',
        concours: 'ENS',
        year: 2025,
        difficulty: 3,
        methodes: ['topologie-evn'],
        enonce: `On munit $\\mathcal{M}_n(\\mathbb{R})$ d'une norme sous-multiplicative.
1. Montrer que $GL_n(\\mathbb{R})$ est un ouvert dense de $\\mathcal{M}_n(\\mathbb{R})$.
2. Montrer que l'application $A \\mapsto A^{-1}$ est continue sur $GL_n(\\mathbb{R})$.
3. Montrer que $O_n(\\mathbb{R})$ est compact.
4. Montrer que $SL_n(\\mathbb{R})$ est ferme non borne.
5. L'application $A \\mapsto e^A$ est-elle surjective de $\\mathcal{M}_n$ dans $GL_n$ ?`,
        reconnaissance: {
            question: 'Pourquoi $GL_n$ est-il ouvert ?',
            options: [
                { text: 'Le determinant est continu et $GL_n = \\det^{-1}(\\mathbb{R}^*)$', correct: true },
                { text: 'C\'est un sous-groupe', correct: false },
                { text: 'Il contient l\'identite', correct: false },
                { text: 'Les matrices inversibles forment un convexe', correct: false }
            ],
            feedback: { correct: 'Exact ! $GL_n = \\{\\det \\neq 0\\}$ et $\\det$ est continue.', incorrect: '$GL_n = \\det^{-1}(\\mathbb{R}^*)$ avec $\\det$ continue, donc ouvert.' }
        },
        strategie: {
            question: 'Comment montrer que $O_n$ est compact ?',
            attendu: '$O_n = \\{A : A^T A = I_n\\}$ est ferme (equation) et borne ($\\|A\\| = 1$).',
            exemple: `1. $\\det$ continue, $GL_n = \\det^{-1}(\\mathbb{R}^*)$. Dense car perturber par $\\varepsilon I_n$
2. $A \\mapsto A^{-1}$ : formule avec comatrice, quotient de polynomes
3. $O_n$ : ferme (equations $A^T A = I_n$), borne ($\\|Ax\\| = \\|x\\|$)
4. $SL_n = \\det^{-1}(\\{1\\})$ ferme. $\\text{diag}(n, 1/n, 1, ..., 1) \\in SL_n$ non borne
5. Non : $e^A$ a determinant $e^{\\text{tr}(A)} > 0$`
        },
        indices: [
            { title: 'Idee cle', content: 'Utiliser la continuite du determinant.' },
            { title: 'Outil precis', content: 'Formule $A^{-1} = \\frac{1}{\\det A} \\text{Com}(A)^T$.' },
            { title: 'Point technique', content: 'Heine-Borel dans l\'espace de dimension finie $\\mathcal{M}_n$.' }
        ],
        oral: { prompt: 'Montrer que $GL_n^+$ est connexe par arcs.', tips: ['Reduction de Gauss', 'Relier a $I_n$ par un chemin'] },
        debrief: {
            attendu: 'Maitrise de la topologie en dimension finie et des groupes de matrices.',
            erreurs: ['Oublier la dimension finie pour Heine-Borel', 'Confondre $O_n$ et $SO_n$'],
            variantes: ['Composantes connexes de $GL_n$', 'Topologie de $SL_n(\\mathbb{C})$'],
            liens: { methodes: ['topologie-evn'], exercices: ['exp-matrice-diag'], notions: ['GL_n', 'Groupes de matrices'] }
        }
    },
    {
        id: 'baire-applications',
        title: 'Theoreme de Baire et applications',
        theme: 'topologie',
        concours: 'ENS',
        year: 2025,
        difficulty: 3,
        methodes: ['baire'],
        enonce: `Soit $(E, d)$ un espace metrique complet.
1. Montrer que toute intersection denombrable d'ouverts denses est dense (Baire).
2. Montrer que $\\mathbb{R}$ n'est pas reunion denombrable de fermes d'interieur vide.
3. Montrer qu'il existe des fonctions continues nulle part derivables.
4. Montrer que si $(f_n)$ converge simplement vers $f$ continue, alors $f$ est continue en un $G_\\delta$ dense.`,
        reconnaissance: {
            question: 'Qu\'est-ce qu\'un ensemble maigre ?',
            options: [
                { text: 'Une reunion denombrable de fermes d\'interieur vide', correct: true },
                { text: 'Un ensemble de mesure nulle', correct: false },
                { text: 'Un ensemble denombrable', correct: false },
                { text: 'Un ensemble non dense', correct: false }
            ],
            feedback: { correct: 'Exact ! Maigre = de premiere categorie.', incorrect: 'Maigre signifie reunion denombrable de fermes sans point interieur.' }
        },
        strategie: {
            question: 'Comment construire une fonction continue nulle part derivable ?',
            attendu: 'Montrer que l\'ensemble des fonctions derivables en au moins un point est maigre dans $C([0,1])$.',
            exemple: `1. Construire par recurrence des boules $B_n$ avec $\\bar{B}_{n+1} \\subset B_n \\cap U_n$
   $\\bigcap U_n \\supset \\bigcap \\bar{B}_n \\neq \\emptyset$ par completude
2. $\\mathbb{R} = \\bigcup F_n$ avec $\\mathring{F}_n = \\emptyset$ contredirait Baire
3. $A_n = \\{f : \\exists x, |f(x+h) - f(x)| \\leq n|h|\\}$ ferme, $\\mathring{A}_n = \\emptyset$
4. $\\omega_f(x) = \\lim_{r \\to 0} \\text{osc}(f, B(x,r))$, ensemble de continuite = $\\{\\omega_f = 0\\}$`
        },
        indices: [
            { title: 'Idee cle', content: 'Les "petits" ensembles (maigres) ne peuvent recouvrir un complet.' },
            { title: 'Outil precis', content: 'Construction par boules emboitees.' },
            { title: 'Point technique', content: '$C([0,1])$ complet pour $\\|\\cdot\\|_\\infty$.' }
        ],
        oral: { prompt: 'Montrer que $\\mathbb{Q}$ n\'est pas un $G_\\delta$ de $\\mathbb{R}$.', tips: ['Si $\\mathbb{Q} = \\bigcap U_n$, alors $\\mathbb{R} \\setminus \\mathbb{Q} = \\bigcup F_n$', 'Contradiction avec Baire'] },
        debrief: {
            attendu: 'Application du theoreme de Baire en analyse.',
            erreurs: ['Oublier l\'hypothese de completude', 'Confondre maigre et mesure nulle'],
            variantes: ['Theoreme de Banach-Steinhaus', 'Theoreme du graphe ferme'],
            liens: { methodes: ['baire'], exercices: [], notions: ['Baire', 'Categories'] }
        }
    }
];

// QUESTIONS EXPRESS ENRICHIES
const EXPRESS_QUESTIONS = [
    { type: 'reconnaissance', question: 'Quelle methode pour $u_{n+1} = f(u_n)$ ?', options: ['Point fixe', 'Comparaison serie-integrale', 'IPP', 'Changement de variable'], correct: 0 },
    { type: 'reconnaissance', question: 'Suite positive decroissante minoree ?', options: ['Converge', 'Diverge', 'On ne peut pas conclure', 'Tend vers 0'], correct: 0 },
    { type: 'reconnaissance', question: '$\\sum 1/n^\\alpha$ converge ssi...', options: ['$\\alpha > 1$', '$\\alpha < 1$', '$\\alpha \\geq 1$', '$\\alpha = 2$'], correct: 0 },
    { type: 'reconnaissance', question: 'Critere de Leibniz : $(a_n)$ doit etre...', options: ['Positive decroissante vers 0', 'Croissante bornee', 'De signe constant', 'Absolument sommable'], correct: 0 },
    { type: 'reconnaissance', question: 'Pour deriver sous $\\int$, il faut...', options: ['Domination locale', 'Convergence simple', 'Continuite seulement', 'Rien de special'], correct: 0 },
    { type: 'reconnaissance', question: '$f$ convexe equivaut a $f\'\'$...', options: ['$\\geq 0$', '$\\leq 0$', '$> 0$', '$= 0$'], correct: 0 },
    { type: 'reconnaissance', question: 'Theoreme de Rolle necessite...', options: ['$f(a) = f(b)$', '$f(a) = 0$', '$f\'(a) = 0$', '$f$ croissante'], correct: 0 },
    { type: 'calcul', question: '$\\lim (1 + 1/n)^n = $ ?', options: ['$e$', '1', '$+\\infty$', '0'], correct: 0 },
    { type: 'calcul', question: '$\\int_0^1 x e^x dx = $ ?', options: ['1', '$e-1$', '$e$', '0'], correct: 0 },
    { type: 'calcul', question: 'DL de $\\sin(x)$ a l\'ordre 3 ?', options: ['$x - x^3/6$', '$x + x^3/6$', '$1 - x^2/2$', '$x - x^2/2$'], correct: 0 },
    { type: 'strategie', question: 'Pour montrer $\\exists c, f\'(c) = 0$...', options: ['Rolle', 'TVI', 'Cauchy', 'Heine'], correct: 0 },
    { type: 'strategie', question: 'Equivalent de $\\sum_{k=1}^n 1/k$ ?', options: ['$\\ln(n)$', '$n$', '$\\sqrt{n}$', '1'], correct: 0 },
    { type: 'strategie', question: 'Pour CVU, on etudie...', options: ['$\\sup |f_n - f|$', '$\\int |f_n - f|$', '$f_n(0)$', '$f_n\'$'], correct: 0 },
    { type: 'piege', question: '$\\sum (-1)^n / n$ est...', options: ['CV conditionnelle', 'CV absolue', 'Divergente', 'Semi-convergente'], correct: 0 },
    { type: 'piege', question: 'CVU sur $[0,1]$ implique...', options: ['$\\int f_n \\to \\int f$', '$f_n\' \\to f\'$', 'CVU de $f_n\'$', 'Rien'], correct: 0 },
    { type: 'calcul', question: '$\\Gamma(n+1) = $ ?', options: ['$n!$', '$(n+1)!$', '$n$', '$1/n!$'], correct: 0 },
    { type: 'calcul', question: '$\\sum_{n=1}^\\infty x^n/n = $ ?', options: ['$-\\ln(1-x)$', '$e^x$', '$1/(1-x)$', '$\\ln(1+x)$'], correct: 0 },
    { type: 'strategie', question: '$e^{A+B} = e^A e^B$ si...', options: ['$AB = BA$', 'Toujours', '$A = B$', 'Jamais'], correct: 0 },
    { type: 'reconnaissance', question: 'Rayon CV de $\\sum n! z^n$ ?', options: ['0', '1', '$+\\infty$', '$e$'], correct: 0 },
    { type: 'piege', question: '$A$ diagonalisable ssi...', options: ['$\\sum \\dim E_\\lambda = n$', '$\\det A \\neq 0$', '$A$ symetrique', '$A^2 = A$'], correct: 0 }
];

// NOTIONS ENRICHIES (pour la carte visuelle)
const NOTIONS = [
    { id: 'suites-reelles', name: 'Suites reelles', theme: 'suites', x: 100, y: 150 },
    { id: 'suites-recurrentes', name: 'Suites recurrentes', theme: 'suites', x: 100, y: 250 },
    { id: 'convergence-suites', name: 'Convergence', theme: 'suites', x: 200, y: 200 },
    { id: 'series-numeriques', name: 'Series numeriques', theme: 'series', x: 350, y: 150 },
    { id: 'series-alternees', name: 'Series alternees', theme: 'series', x: 350, y: 250 },
    { id: 'series-fonctions', name: 'Series de fonctions', theme: 'series', x: 450, y: 200 },
    { id: 'series-entieres', name: 'Series entieres', theme: 'series', x: 450, y: 300 },
    { id: 'fonctions-continues', name: 'Continuite', theme: 'fonctions', x: 600, y: 150 },
    { id: 'fonctions-derivables', name: 'Derivabilite', theme: 'fonctions', x: 600, y: 250 },
    { id: 'theoremes-analyse', name: 'Rolle, TVI, AF', theme: 'fonctions', x: 700, y: 200 },
    { id: 'convexite', name: 'Convexite', theme: 'fonctions', x: 700, y: 300 },
    { id: 'integrales-riemann', name: 'Integrales Riemann', theme: 'integrales', x: 850, y: 150 },
    { id: 'integrales-parametre', name: 'Integrales a parametre', theme: 'integrales', x: 850, y: 250 },
    { id: 'integrales-generalisees', name: 'Integrales impropres', theme: 'integrales', x: 950, y: 200 },
    { id: 'matrices', name: 'Matrices', theme: 'algebre', x: 200, y: 400 },
    { id: 'diagonalisation', name: 'Diagonalisation', theme: 'algebre', x: 300, y: 450 },
    { id: 'exp-matrices', name: 'Exp matricielle', theme: 'algebre', x: 400, y: 400 },
    { id: 'probabilites-base', name: 'Probabilites', theme: 'probabilites', x: 600, y: 400 },
    // Algebre generale
    { id: 'groupes', name: 'Groupes', theme: 'algebre-generale', x: 100, y: 500 },
    { id: 'groupe-symetrique', name: 'Groupe symetrique', theme: 'algebre-generale', x: 200, y: 550 },
    { id: 'anneaux', name: 'Anneaux', theme: 'algebre-generale', x: 300, y: 500 },
    { id: 'corps', name: 'Corps', theme: 'algebre-generale', x: 400, y: 550 },
    { id: 'corps-finis', name: 'Corps finis', theme: 'algebre-generale', x: 500, y: 500 },
    // Topologie
    { id: 'espaces-metriques', name: 'Espaces metriques', theme: 'topologie', x: 700, y: 500 },
    { id: 'completude', name: 'Completude', theme: 'topologie', x: 800, y: 450 },
    { id: 'compacite', name: 'Compacite', theme: 'topologie', x: 800, y: 550 },
    { id: 'connexite', name: 'Connexite', theme: 'topologie', x: 900, y: 500 },
    { id: 'baire', name: 'Baire', theme: 'topologie', x: 950, y: 450 }
];

// LIENS POUR LA CARTE (connexions entre notions)
const CARTE_LIENS = [
    { source: 'suites-reelles', target: 'suites-recurrentes' },
    { source: 'suites-recurrentes', target: 'convergence-suites' },
    { source: 'convergence-suites', target: 'series-numeriques' },
    { source: 'series-numeriques', target: 'series-alternees' },
    { source: 'series-numeriques', target: 'series-fonctions' },
    { source: 'series-fonctions', target: 'series-entieres' },
    { source: 'fonctions-continues', target: 'fonctions-derivables' },
    { source: 'fonctions-derivables', target: 'theoremes-analyse' },
    { source: 'fonctions-derivables', target: 'convexite' },
    { source: 'theoremes-analyse', target: 'integrales-riemann' },
    { source: 'integrales-riemann', target: 'integrales-parametre' },
    { source: 'integrales-riemann', target: 'integrales-generalisees' },
    { source: 'series-fonctions', target: 'integrales-parametre' },
    { source: 'matrices', target: 'diagonalisation' },
    { source: 'diagonalisation', target: 'exp-matrices' },
    { source: 'series-entieres', target: 'exp-matrices' },
    { source: 'convergence-suites', target: 'probabilites-base' },
    // Algebre generale
    { source: 'groupes', target: 'groupe-symetrique' },
    { source: 'groupes', target: 'anneaux' },
    { source: 'anneaux', target: 'corps' },
    { source: 'corps', target: 'corps-finis' },
    { source: 'matrices', target: 'groupes' },
    // Topologie
    { source: 'espaces-metriques', target: 'completude' },
    { source: 'espaces-metriques', target: 'compacite' },
    { source: 'espaces-metriques', target: 'connexite' },
    { source: 'completude', target: 'baire' },
    { source: 'fonctions-continues', target: 'espaces-metriques' },
    { source: 'convergence-suites', target: 'completude' },
    { source: 'compacite', target: 'theoremes-analyse' }
];

// ============================================
// FICHES MEMO - Formulaires condenses par theme
// ============================================
const FICHES_MEMO = [
    {
        id: 'dl-usuels',
        title: 'Developpements limites usuels',
        theme: 'fonctions',
        icon: 'DL',
        formulas: [
            { name: 'Exponentielle', formula: '$e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots + \\frac{x^n}{n!} + o(x^n)$' },
            { name: 'Logarithme', formula: '$\\ln(1+x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\cdots + (-1)^{n+1}\\frac{x^n}{n} + o(x^n)$' },
            { name: 'Sinus', formula: '$\\sin(x) = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots + (-1)^n\\frac{x^{2n+1}}{(2n+1)!} + o(x^{2n+2})$' },
            { name: 'Cosinus', formula: '$\\cos(x) = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots + (-1)^n\\frac{x^{2n}}{(2n)!} + o(x^{2n+1})$' },
            { name: 'Tangente', formula: '$\\tan(x) = x + \\frac{x^3}{3} + \\frac{2x^5}{15} + o(x^6)$' },
            { name: 'Arctan', formula: '$\\arctan(x) = x - \\frac{x^3}{3} + \\frac{x^5}{5} - \\cdots + (-1)^n\\frac{x^{2n+1}}{2n+1} + o(x^{2n+2})$' },
            { name: 'Arcsin', formula: '$\\arcsin(x) = x + \\frac{x^3}{6} + \\frac{3x^5}{40} + o(x^6)$' },
            { name: '$(1+x)^\\alpha$', formula: '$(1+x)^\\alpha = 1 + \\alpha x + \\frac{\\alpha(\\alpha-1)}{2!}x^2 + \\cdots + \\binom{\\alpha}{n}x^n + o(x^n)$' },
            { name: '$\\frac{1}{1-x}$', formula: '$\\frac{1}{1-x} = 1 + x + x^2 + \\cdots + x^n + o(x^n)$' },
            { name: '$\\frac{1}{1+x}$', formula: '$\\frac{1}{1+x} = 1 - x + x^2 - \\cdots + (-1)^nx^n + o(x^n)$' },
            { name: '$\\sqrt{1+x}$', formula: '$\\sqrt{1+x} = 1 + \\frac{x}{2} - \\frac{x^2}{8} + \\frac{x^3}{16} + o(x^3)$' },
            { name: 'sh et ch', formula: '$\\sh(x) = x + \\frac{x^3}{6} + o(x^4)$, $\\ch(x) = 1 + \\frac{x^2}{2} + \\frac{x^4}{24} + o(x^5)$' }
        ],
        tips: [
            'Pour composer, substituer $u(x)$ a $x$ dans le DL si $u(x) \\to 0$',
            'Attention a l\'ordre : si on veut un DL a l\'ordre $n$, garder les termes jusqu\'a $x^n$',
            'DL en $a$ : poser $h = x - a$ et faire le DL en $h = 0$'
        ]
    },
    {
        id: 'equivalents',
        title: 'Equivalents classiques',
        theme: 'suites',
        icon: '~',
        formulas: [
            { name: 'En 0', formula: '$\\sin x \\sim x$, $\\tan x \\sim x$, $\\arcsin x \\sim x$, $\\arctan x \\sim x$' },
            { name: 'En 0', formula: '$1 - \\cos x \\sim \\frac{x^2}{2}$, $e^x - 1 \\sim x$, $\\ln(1+x) \\sim x$' },
            { name: 'En 0', formula: '$(1+x)^\\alpha - 1 \\sim \\alpha x$, $\\sh x \\sim x$, $\\ch x - 1 \\sim \\frac{x^2}{2}$' },
            { name: 'Stirling', formula: '$n! \\sim \\sqrt{2\\pi n}\\left(\\frac{n}{e}\\right)^n$' },
            { name: 'Harmonique', formula: '$H_n = \\sum_{k=1}^n \\frac{1}{k} \\sim \\ln(n) + \\gamma$ avec $\\gamma \\approx 0.577$' },
            { name: 'Binomial', formula: '$\\binom{2n}{n} \\sim \\frac{4^n}{\\sqrt{\\pi n}}$' }
        ],
        tips: [
            '$f \\sim g$ signifie $f/g \\to 1$',
            'On peut multiplier des equivalents mais PAS les additionner !',
            'Pour $f - g$, utiliser un DL'
        ]
    },
    {
        id: 'criteres-series',
        title: 'Criteres de convergence des series',
        theme: 'series',
        icon: 'CV',
        formulas: [
            { name: 'Serie geometrique', formula: '$\\sum q^n$ CV ssi $|q| < 1$, et $\\sum_{n=0}^\\infty q^n = \\frac{1}{1-q}$' },
            { name: 'Serie de Riemann', formula: '$\\sum \\frac{1}{n^\\alpha}$ CV ssi $\\alpha > 1$' },
            { name: 'Serie de Bertrand', formula: '$\\sum \\frac{1}{n^\\alpha (\\ln n)^\\beta}$ CV ssi $\\alpha > 1$ ou ($\\alpha = 1$ et $\\beta > 1$)' },
            { name: 'Comparaison', formula: 'Si $0 \\leq u_n \\leq v_n$ : $\\sum v_n$ CV $\\Rightarrow$ $\\sum u_n$ CV' },
            { name: 'Equivalents', formula: 'Si $u_n \\sim v_n$ avec $u_n, v_n > 0$ : $\\sum u_n$ et $\\sum v_n$ de meme nature' },
            { name: 'd\'Alembert', formula: 'Si $|u_{n+1}/u_n| \\to \\ell$ : CV abs si $\\ell < 1$, DV si $\\ell > 1$' },
            { name: 'Cauchy (racine)', formula: 'Si $|u_n|^{1/n} \\to \\ell$ : CV abs si $\\ell < 1$, DV si $\\ell > 1$' },
            { name: 'Leibniz', formula: 'Si $(a_n)$ positive, decroissante, $a_n \\to 0$ : $\\sum (-1)^n a_n$ CV' },
            { name: 'Abel', formula: 'Si $(a_n)$ monotone bornee et $\\sum b_n$ CV : $\\sum a_n b_n$ CV' }
        ],
        tips: [
            'd\'Alembert et Cauchy ne concluent pas si $\\ell = 1$',
            'Pour les series alternees, le reste verifie $|R_n| \\leq a_{n+1}$',
            'CV absolue $\\Rightarrow$ CV, mais la reciproque est fausse'
        ]
    },
    {
        id: 'integrales-usuelles',
        title: 'Integrales et primitives usuelles',
        theme: 'integrales',
        icon: 'I',
        formulas: [
            { name: 'Puissances', formula: '$\\int x^n dx = \\frac{x^{n+1}}{n+1}$ si $n \\neq -1$, $\\int \\frac{1}{x} dx = \\ln|x|$' },
            { name: 'Exponentielles', formula: '$\\int e^{ax} dx = \\frac{e^{ax}}{a}$, $\\int a^x dx = \\frac{a^x}{\\ln a}$' },
            { name: 'Trigonometriques', formula: '$\\int \\cos x = \\sin x$, $\\int \\sin x = -\\cos x$, $\\int \\frac{1}{\\cos^2 x} = \\tan x$' },
            { name: 'Arctangente', formula: '$\\int \\frac{1}{1+x^2} dx = \\arctan x$, $\\int \\frac{1}{a^2+x^2} dx = \\frac{1}{a}\\arctan\\frac{x}{a}$' },
            { name: 'Arcsinus', formula: '$\\int \\frac{1}{\\sqrt{1-x^2}} dx = \\arcsin x$' },
            { name: 'Logarithme', formula: '$\\int \\ln x\\, dx = x\\ln x - x$' },
            { name: 'Gauss', formula: '$\\int_0^{+\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$, $\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}$' },
            { name: 'Wallis', formula: '$I_n = \\int_0^{\\pi/2} \\sin^n x\\, dx$ : $I_n = \\frac{n-1}{n}I_{n-2}$, $I_0 = \\frac{\\pi}{2}$, $I_1 = 1$' },
            { name: 'Gamma', formula: '$\\Gamma(x) = \\int_0^{+\\infty} t^{x-1}e^{-t}dt$, $\\Gamma(n+1) = n!$, $\\Gamma(1/2) = \\sqrt{\\pi}$' }
        ],
        tips: [
            'IPP : $\\int uv\' = [uv] - \\int u\'v$ (LIATE : Log, Inverse trig, Algebrique, Trig, Exp)',
            'Changement de variable : ne pas oublier de changer $dx$ et les bornes',
            'Pour $\\int R(\\sin x, \\cos x)dx$ : essayer $t = \\tan(x/2)$ (regles de Bioche)'
        ]
    },
    {
        id: 'algebre-lineaire',
        title: 'Algebre lineaire - Formules cles',
        theme: 'algebre',
        icon: 'M',
        formulas: [
            { name: 'Determinant 2x2', formula: '$\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix} = ad - bc$' },
            { name: 'Determinant 3x3', formula: 'Regle de Sarrus ou developpement par rapport a une ligne/colonne' },
            { name: 'Inverse 2x2', formula: '$\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}^{-1} = \\frac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$' },
            { name: 'Cayley-Hamilton', formula: 'Toute matrice annule son polynome caracteristique : $\\chi_A(A) = 0$' },
            { name: 'Trace et det', formula: '$\\mathrm{tr}(A) = \\sum \\lambda_i$, $\\det(A) = \\prod \\lambda_i$' },
            { name: 'Exponentielle', formula: '$e^A = \\sum_{n=0}^\\infty \\frac{A^n}{n!}$, si $A = PDP^{-1}$ alors $e^A = Pe^DP^{-1}$' },
            { name: 'Commutativite', formula: '$e^{A+B} = e^Ae^B$ ssi $AB = BA$' },
            { name: 'Vandermonde', formula: '$V_n = \\prod_{i<j}(x_j - x_i)$' }
        ],
        tips: [
            'Diagonalisable ssi $\\sum \\dim E_\\lambda = n$',
            'Matrice symetrique reelle $\\Rightarrow$ diagonalisable en base orthonormee',
            'Nilpotente : $N^p = 0$ pour un certain $p$, spectre = {0}'
        ]
    },
    {
        id: 'probabilites-formules',
        title: 'Probabilites - Formules essentielles',
        theme: 'probabilites',
        icon: 'P',
        formulas: [
            { name: 'Bayes', formula: '$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$' },
            { name: 'Formule totale', formula: '$P(B) = \\sum_i P(B|A_i)P(A_i)$ (partition $(A_i)$)' },
            { name: 'Esperance', formula: '$E(X) = \\sum x_i P(X=x_i)$ ou $E(X) = \\int xf(x)dx$' },
            { name: 'Variance', formula: '$V(X) = E(X^2) - E(X)^2 = E((X-E(X))^2)$' },
            { name: 'Covariance', formula: '$\\mathrm{Cov}(X,Y) = E(XY) - E(X)E(Y)$' },
            { name: 'Loi binomiale', formula: '$B(n,p)$ : $P(X=k) = \\binom{n}{k}p^k(1-p)^{n-k}$, $E=np$, $V=np(1-p)$' },
            { name: 'Loi de Poisson', formula: '$\\mathcal{P}(\\lambda)$ : $P(X=k) = e^{-\\lambda}\\frac{\\lambda^k}{k!}$, $E=V=\\lambda$' },
            { name: 'Loi exponentielle', formula: '$\\mathcal{E}(\\lambda)$ : $f(x) = \\lambda e^{-\\lambda x}$, $E=1/\\lambda$, $V=1/\\lambda^2$' },
            { name: 'Loi normale', formula: '$\\mathcal{N}(\\mu,\\sigma^2)$ : $f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$' }
        ],
        tips: [
            'Independance : $P(A \\cap B) = P(A)P(B)$ ou $E(XY) = E(X)E(Y)$',
            '$V(aX+b) = a^2V(X)$, $V(X+Y) = V(X) + V(Y) + 2\\mathrm{Cov}(X,Y)$',
            'TCL : $\\frac{S_n - n\\mu}{\\sigma\\sqrt{n}} \\xrightarrow{\\mathcal{L}} \\mathcal{N}(0,1)$'
        ]
    },
    {
        id: 'theoremes-analyse',
        title: 'Grands theoremes d\'analyse',
        theme: 'fonctions',
        icon: 'T',
        formulas: [
            { name: 'TVI', formula: 'Si $f$ continue sur $[a,b]$, $f$ prend toutes les valeurs entre $f(a)$ et $f(b)$' },
            { name: 'Rolle', formula: 'Si $f$ continue sur $[a,b]$, derivable sur $]a,b[$, $f(a)=f(b)$ : $\\exists c, f\'(c)=0$' },
            { name: 'AF', formula: '$f(b)-f(a) = (b-a)f\'(c)$ pour un certain $c \\in ]a,b[$' },
            { name: 'Taylor-Lagrange', formula: '$f(x) = \\sum_{k=0}^n \\frac{f^{(k)}(a)}{k!}(x-a)^k + \\frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$' },
            { name: 'Taylor-Young', formula: '$f(x) = \\sum_{k=0}^n \\frac{f^{(k)}(a)}{k!}(x-a)^k + o((x-a)^n)$' },
            { name: 'Weierstrass', formula: 'Une fonction continue sur un segment est bornee et atteint ses bornes' },
            { name: 'Heine', formula: 'Une fonction continue sur un segment est uniformement continue' },
            { name: 'Derivation sous $\\int$', formula: 'Si $\\partial_x f$ existe, continue, et domination locale : $F\'(x) = \\int \\partial_x f(x,t)dt$' },
            { name: 'CV dominee', formula: 'Si $f_n \\to f$ pp et $|f_n| \\leq g$ integrable : $\\int f_n \\to \\int f$' }
        ],
        tips: [
            'Rolle est un cas particulier des AF (quand $f(a) = f(b)$)',
            'Pour Weierstrass/Heine : hypothese cruciale = segment (compact)',
            'CVU sur un segment permet d\'echanger $\\lim$ et $\\int$'
        ]
    }
];

// ============================================
// ERREURS FREQUENTES - Pieges classiques
// ============================================
const ERREURS_FREQUENTES = [
    {
        id: 'limite-passage',
        title: 'Passage a la limite non justifie',
        theme: 'suites',
        severity: 'haute',
        description: 'Passer a la limite dans une relation sans avoir prouve la convergence au prealable.',
        exemple: {
            faux: 'Si $u_{n+1} = f(u_n)$ et $\\ell = f(\\ell)$, alors $u_n \\to \\ell$.',
            correct: 'Il faut D\'ABORD montrer que $(u_n)$ converge (monotone bornee, Cauchy...), PUIS passer a la limite.'
        },
        conseil: 'Toujours demontrer la convergence avant de chercher la limite.'
    },
    {
        id: 'recurrence-heredite',
        title: 'Utiliser P(n+1) dans l\'heredite',
        theme: 'suites',
        severity: 'haute',
        description: 'Dans une recurrence, utiliser ce qu\'on veut demontrer pour le prouver.',
        exemple: {
            faux: 'On suppose $P(n)$ et $P(n+1)$ vraies, donc $P(n+1)$ est vraie.',
            correct: 'On suppose SEULEMENT $P(n)$ vraie et on en deduit $P(n+1)$.'
        },
        conseil: 'Dans l\'heredite, on dispose uniquement de $P(n)$ (ou $P(0), ..., P(n)$ en recurrence forte).'
    },
    {
        id: 'somme-equivalents',
        title: 'Additionner des equivalents',
        theme: 'suites',
        severity: 'haute',
        description: 'On ne peut pas additionner des equivalents ! Seule la multiplication est permise.',
        exemple: {
            faux: '$n + n \\sim n + n$ donc $2n \\sim 2n$... mais $n \\sim n+1$ ne donne PAS $n + n \\sim n + (n+1)$.',
            correct: 'Si $f \\sim g$ et $h \\sim k$, alors $fh \\sim gk$. Mais $f + h$ n\'est PAS equivalent a $g + k$.'
        },
        conseil: 'Pour les sommes, utiliser les DL ou calculer directement.'
    },
    {
        id: 'cvu-cvs',
        title: 'Confondre CVU et CVS',
        theme: 'series',
        severity: 'moyenne',
        description: 'La convergence uniforme (CVU) est plus forte que la convergence simple (CVS).',
        exemple: {
            faux: '$f_n(x) \\to f(x)$ pour tout $x$, donc $\\int f_n \\to \\int f$.',
            correct: 'Pour echanger $\\lim$ et $\\int$, il faut CVU sur le domaine (ou convergence dominee).'
        },
        conseil: 'CVU : $\\sup_x |f_n(x) - f(x)| \\to 0$. C\'est beaucoup plus fort que CVS.'
    },
    {
        id: 'serie-terme-general',
        title: 'Confondre terme general et reste',
        theme: 'series',
        severity: 'moyenne',
        description: '$u_n \\to 0$ ne suffit PAS pour la convergence de $\\sum u_n$.',
        exemple: {
            faux: '$1/n \\to 0$ donc $\\sum 1/n$ converge.',
            correct: '$u_n \\to 0$ est necessaire mais pas suffisant. La serie harmonique diverge !'
        },
        conseil: 'Condition necessaire : $u_n \\to 0$. Pour conclure, utiliser un critere (comparaison, Leibniz...).'
    },
    {
        id: 'derivation-cvu',
        title: 'Deriver une limite uniforme',
        theme: 'series',
        severity: 'haute',
        description: 'La CVU de $f_n$ ne permet PAS de deriver la limite.',
        exemple: {
            faux: '$f_n \\to f$ uniformement, donc $f_n\' \\to f\'$.',
            correct: 'Pour deriver : il faut CVU de $f_n\'$ (pas de $f_n$), et CVS de $f_n$.'
        },
        conseil: 'Theoreme : si $f_n \\to f$ (CVS), $f_n\' \\to g$ (CVU), et chaque $f_n$ derivable, alors $f\' = g$.'
    },
    {
        id: 'exp-matrices',
        title: '$e^{A+B} = e^A e^B$ sans commutativite',
        theme: 'algebre',
        severity: 'haute',
        description: 'Cette formule n\'est valable que si $AB = BA$.',
        exemple: {
            faux: '$e^{A+B} = e^A e^B$ pour toutes matrices $A, B$.',
            correct: '$e^{A+B} = e^A e^B$ ssi $AB = BA$. Sinon, utiliser Lie-Trotter ou calculer directement.'
        },
        conseil: 'Toujours verifier la commutativite avant d\'utiliser cette formule.'
    },
    {
        id: 'diagonalisation-vp',
        title: 'Diagonalisable ssi valeurs propres distinctes',
        theme: 'algebre',
        severity: 'moyenne',
        description: 'C\'est une condition suffisante, pas necessaire.',
        exemple: {
            faux: '$I_n$ n\'a qu\'une VP ($\\lambda = 1$) donc n\'est pas diagonalisable.',
            correct: '$I_n$ est deja diagonale ! Le critere est : $\\sum \\dim E_\\lambda = n$.'
        },
        conseil: 'VP distinctes $\\Rightarrow$ diagonalisable. Reciproque fausse.'
    },
    {
        id: 'rolle-hypotheses',
        title: 'Oublier les hypotheses de Rolle',
        theme: 'fonctions',
        severity: 'moyenne',
        description: 'Le theoreme de Rolle necessite trois hypotheses.',
        exemple: {
            faux: '$f(a) = f(b)$ donc $\\exists c$, $f\'(c) = 0$.',
            correct: 'Il faut : (1) $f$ continue sur $[a,b]$, (2) derivable sur $]a,b[$, (3) $f(a) = f(b)$.'
        },
        conseil: 'Toujours verifier les trois hypotheses avant d\'appliquer Rolle ou les AF.'
    },
    {
        id: 'primitive-integrale',
        title: 'Confondre primitive et integrale',
        theme: 'integrales',
        severity: 'moyenne',
        description: 'Une fonction peut avoir une primitive sans que l\'integrale impropre converge.',
        exemple: {
            faux: '$F(x) = \\int_0^x f(t)dt$ existe pour tout $x$, donc $\\int_0^{+\\infty} f$ converge.',
            correct: 'L\'existence de la primitive ne dit rien sur la limite a l\'infini de $F(x)$.'
        },
        conseil: 'Integrale impropre : etudier $\\lim_{M \\to +\\infty} \\int_0^M f$.'
    },
    {
        id: 'ipp-bornes',
        title: 'Oublier le terme aux bornes dans IPP',
        theme: 'integrales',
        severity: 'moyenne',
        description: 'L\'IPP produit un terme $[uv]_a^b$ qu\'il ne faut pas oublier.',
        exemple: {
            faux: '$\\int_0^{+\\infty} uv\' = -\\int_0^{+\\infty} u\'v$',
            correct: '$\\int_0^{+\\infty} uv\' = [uv]_0^{+\\infty} - \\int_0^{+\\infty} u\'v$. Verifier que $[uv]$ existe et calculer.'
        },
        conseil: 'Pour les integrales impropres, toujours verifier l\'existence des limites dans $[uv]$.'
    },
    {
        id: 'proba-independance',
        title: 'Confondre independance et incompatibilite',
        theme: 'probabilites',
        severity: 'haute',
        description: 'Independants : $P(A \\cap B) = P(A)P(B)$. Incompatibles : $A \\cap B = \\emptyset$.',
        exemple: {
            faux: 'Si $A$ et $B$ sont independants, $A \\cap B = \\emptyset$.',
            correct: 'C\'est le contraire ! Si $A$ et $B$ sont incompatibles et de proba non nulle, ils sont dependants.'
        },
        conseil: 'Independants = pas de lien probabiliste. Incompatibles = ne peuvent pas arriver ensemble.'
    }
];

// ============================================
// QUESTIONS DE JURY - Questions types a l'oral
// ============================================
const QUESTIONS_JURY = [
    // Questions generales
    {
        id: 'q-strategie',
        question: 'Quelle est votre strategie pour aborder cet exercice ?',
        theme: 'general',
        type: 'strategie',
        conseil: 'Identifier le type d\'exercice, les outils mobilisables, les etapes principales.',
        reponseType: 'Annoncer : "Je vais d\'abord... puis... et enfin..."'
    },
    {
        id: 'q-pourquoi',
        question: 'Pourquoi utilisez-vous ce theoreme / cette methode ?',
        theme: 'general',
        type: 'justification',
        conseil: 'Expliquer les hypotheses verifiees et pourquoi cette approche est adaptee.',
        reponseType: 'Citer les hypotheses et montrer qu\'elles sont satisfaites.'
    },
    {
        id: 'q-autre-methode',
        question: 'Voyez-vous une autre methode pour traiter cette question ?',
        theme: 'general',
        type: 'ouverture',
        conseil: 'Avoir toujours une approche alternative en tete (meme moins elegante).',
        reponseType: 'Proposer une alternative, meme partielle.'
    },
    {
        id: 'q-contre-exemple',
        question: 'Que se passe-t-il si on enleve cette hypothese ?',
        theme: 'general',
        type: 'contre-exemple',
        conseil: 'Preparer des contre-exemples classiques pour chaque grand theoreme.',
        reponseType: 'Donner un contre-exemple precis ou expliquer pourquoi la preuve echoue.'
    },
    // Suites et series
    {
        id: 'q-convergence',
        question: 'Comment savez-vous que cette suite converge ?',
        theme: 'suites',
        type: 'justification',
        conseil: 'Criteres : monotone bornee, Cauchy, adjacentes, point fixe contractant...',
        reponseType: 'Identifier le critere utilise et verifier ses hypotheses.'
    },
    {
        id: 'q-vitesse',
        question: 'Pouvez-vous preciser la vitesse de convergence ?',
        theme: 'suites',
        type: 'approfondissement',
        conseil: 'Donner un equivalent de $u_n - \\ell$ ou une majoration.',
        reponseType: 'Equivalent ou estimation asymptotique de $|u_n - \\ell|$.'
    },
    {
        id: 'q-serie-cv',
        question: 'Convergence absolue ou conditionnelle ?',
        theme: 'series',
        type: 'precision',
        conseil: 'Etudier $\\sum |u_n|$ pour repondre.',
        reponseType: 'Si $\\sum |u_n|$ CV : absolue. Sinon si $\\sum u_n$ CV : conditionnelle.'
    },
    {
        id: 'q-rayon',
        question: 'Comment determinez-vous le rayon de convergence ?',
        theme: 'series',
        type: 'methode',
        conseil: 'Hadamard : $1/R = \\limsup |a_n|^{1/n}$. D\'Alembert si limite existe.',
        reponseType: 'Appliquer Hadamard ou d\'Alembert selon le cas.'
    },
    // Fonctions et integrales
    {
        id: 'q-regularite',
        question: 'Cette fonction est-elle $C^1$ ? $C^\\infty$ ?',
        theme: 'fonctions',
        type: 'precision',
        conseil: 'Etudier l\'existence et la continuite des derivees successives.',
        reponseType: 'Calculer les derivees et verifier leur continuite.'
    },
    {
        id: 'q-hypotheses-int',
        question: 'Quelles sont les hypotheses du theoreme de derivation sous l\'integrale ?',
        theme: 'integrales',
        type: 'connaissance',
        conseil: 'Domination locale de la derivee partielle, continuite, integrabilite.',
        reponseType: 'Enoncer les hypotheses et les verifier sur l\'exemple.'
    },
    {
        id: 'q-cv-integrale',
        question: 'Comment montrez-vous la convergence de cette integrale ?',
        theme: 'integrales',
        type: 'methode',
        conseil: 'En 0 : equivalent et comparaison. A l\'infini : domination ou comparaison.',
        reponseType: 'Separer les singularites et traiter chaque borne.'
    },
    // Algebre
    {
        id: 'q-diag',
        question: 'Cette matrice est-elle diagonalisable ?',
        theme: 'algebre',
        type: 'direct',
        conseil: 'Calculer $\\chi_A$, trouver les VP, verifier $\\sum \\dim E_\\lambda = n$.',
        reponseType: 'Ou : matrice symetrique reelle, ou : VP distinctes.'
    },
    {
        id: 'q-valeurs-propres',
        question: 'Que representent geometriquement les valeurs propres ?',
        theme: 'algebre',
        type: 'interpretation',
        conseil: 'Directions invariantes, facteurs d\'etirement/compression.',
        reponseType: 'Les VP sont les facteurs d\'echelle le long des directions propres.'
    },
    {
        id: 'q-inversible',
        question: 'A quelle condition cette matrice est-elle inversible ?',
        theme: 'algebre',
        type: 'connaissance',
        conseil: '$\\det A \\neq 0$, ou $0$ n\'est pas VP, ou noyau trivial.',
        reponseType: 'Plusieurs caracterisations equivalentes.'
    },
    // Probabilites
    {
        id: 'q-independance',
        question: 'Ces variables sont-elles independantes ?',
        theme: 'probabilites',
        type: 'verification',
        conseil: 'Verifier si $P(X \\in A, Y \\in B) = P(X \\in A)P(Y \\in B)$ pour tous $A, B$.',
        reponseType: 'Ou utiliser $E(f(X)g(Y)) = E(f(X))E(g(Y))$.'
    },
    {
        id: 'q-loi',
        question: 'Quelle est la loi de cette variable aleatoire ?',
        theme: 'probabilites',
        type: 'calcul',
        conseil: 'Calculer $P(X = k)$ ou la fonction de repartition / densite.',
        reponseType: 'Identifier une loi usuelle ou donner la loi explicitement.'
    },
    {
        id: 'q-esperance',
        question: 'Pourquoi l\'esperance existe-t-elle ?',
        theme: 'probabilites',
        type: 'justification',
        conseil: 'Verifier l\'integrabilite : $E(|X|) < +\\infty$.',
        reponseType: 'Majorer $E(|X|)$ ou utiliser une loi connue.'
    },
    // Questions pieges
    {
        id: 'q-erreur',
        question: 'Il y a une erreur dans votre raisonnement, la voyez-vous ?',
        theme: 'general',
        type: 'piege',
        conseil: 'Rester calme, reprendre etape par etape, identifier l\'hypothese manquante.',
        reponseType: 'Relire a voix haute, verifier chaque implication.'
    },
    {
        id: 'q-simplement',
        question: 'Pouvez-vous expliquer plus simplement ?',
        theme: 'general',
        type: 'pedagogie',
        conseil: 'Donner l\'idee intuitive, un dessin, un exemple numerique.',
        reponseType: 'Vulgariser sans perdre en rigueur.'
    }
];
