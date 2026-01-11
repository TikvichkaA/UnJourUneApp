// Mascotte Oracle - Animations Lottie
const OracleMascot = {
    container: null,
    currentAnimation: null,
    currentAnimationName: null,

    // Collection d'animations Oracle (fichiers locaux pour éviter CORS)
    animations: {
        idle: {
            name: "Polish blue orb",
            url: "assets/mascot/polish-blue-orb.json",
            loop: true
        },
        predict: {
            name: "predict futur",
            url: "assets/mascot/predict-futur.json",
            loop: true
        },
        joy: {
            name: "Jump for joy",
            url: "assets/mascot/jump-for-joy.json",
            loop: false
        },
        laugh: {
            name: "Evil laugh",
            url: "assets/mascot/evil-laugh.json",
            loop: false
        },
        cry: {
            name: "cry like a baby with tears",
            url: "assets/mascot/cry-with-tears.json",
            loop: false
        }
    },

    // Initialisation de la mascotte
    init() {
        console.log('Initializing Oracle Mascot...');
        this.container = document.getElementById('mascot-container');
        if (!this.container) {
            console.warn('Mascot container not found');
            return;
        }

        console.log('Mascot container found, loading animation...');

        // Charger l'animation par défaut (idle)
        this.play('idle');

        // Ajouter interaction au clic
        this.container.addEventListener('click', () => this.onMascotClick());
    },

    // Jouer une animation spécifique
    play(animationKey, options = {}) {
        const animConfig = this.animations[animationKey];
        if (!animConfig) {
            console.warn(`Animation "${animationKey}" not found`);
            return;
        }

        // Ne pas recharger si c'est la même animation en boucle
        if (this.currentAnimationName === animationKey && animConfig.loop) {
            return;
        }

        // Détruire l'animation précédente
        if (this.currentAnimation) {
            this.currentAnimation.destroy();
        }

        console.log(`Loading mascot animation: ${animationKey}`);

        // Créer la nouvelle animation
        this.currentAnimation = lottie.loadAnimation({
            container: this.container,
            renderer: 'svg',
            loop: options.loop !== undefined ? options.loop : animConfig.loop,
            autoplay: true,
            path: animConfig.url
        });

        // Gérer le chargement réussi
        this.currentAnimation.addEventListener('DOMLoaded', () => {
            console.log(`Mascot animation loaded: ${animationKey}`);
            this.container.classList.add('loaded');
        });

        // Gérer les erreurs de chargement
        this.currentAnimation.addEventListener('error', (err) => {
            console.error(`Error loading mascot animation: ${animationKey}`, err);
        });

        this.currentAnimationName = animationKey;

        // Ajouter/retirer la classe idle pour l'effet de pulsation
        if (animationKey === 'idle') {
            this.container.classList.add('idle');
        } else {
            this.container.classList.remove('idle');
        }

        // Si l'animation ne boucle pas, revenir à idle après
        if (!animConfig.loop && !options.stayOnComplete) {
            this.currentAnimation.addEventListener('complete', () => {
                this.play('idle');
            });
        }

        // Callback personnalisé à la fin
        if (options.onComplete) {
            this.currentAnimation.addEventListener('complete', options.onComplete);
        }
    },

    // Réaction au clic sur la mascotte
    onMascotClick() {
        // Animations aléatoires au clic
        const clickAnimations = ['joy', 'laugh', 'predict'];
        const randomAnim = clickAnimations[Math.floor(Math.random() * clickAnimations.length)];
        this.play(randomAnim);
    },

    // Méthodes d'événements pour l'application

    // Quand l'utilisateur vote
    onVote() {
        this.play('predict');
        setTimeout(() => this.play('idle'), 2000);
    },

    // Quand une prédiction est ajoutée
    onPredictionAdded() {
        this.play('joy');
    },

    // Quand l'utilisateur se connecte
    onUserLogin() {
        this.play('joy');
    },

    // Quand on consulte les résultats (bon score)
    onGoodResults() {
        this.play('laugh');
    },

    // Quand on consulte les résultats (mauvais score)
    onBadResults() {
        this.play('cry');
    },

    // Mode prédiction (onglet Marché par exemple)
    onMarketView() {
        this.play('predict');
    },

    // Revenir à l'état de repos
    setIdle() {
        this.play('idle');
    }
};

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Petit délai pour s'assurer que Lottie est chargé
    setTimeout(() => {
        if (typeof lottie !== 'undefined') {
            OracleMascot.init();
        } else {
            console.warn('Lottie library not loaded');
        }
    }, 100);
});
