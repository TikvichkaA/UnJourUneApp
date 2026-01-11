// ============================================
// APP.JS - Application principale
// ============================================

class ShuApp {
  constructor() {
    // Etat de l'application
    this.state = {
      isBarking: false,
      totalBarks: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winStreak: 0,
      lastResult: null
    };

    // Elements DOM
    this.elements = {};

    // Systeme de confettis
    this.confetti = null;

    // Audio
    this.barkSound = null;

    // Initialisation
    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.loadStats();
    this.setupConfetti();
    this.setupAudio();
    this.startIdleAnimation();
    this.updateStatsDisplay();
  }

  cacheElements() {
    this.elements = {
      shu: document.getElementById('shu'),
      shuImage: document.getElementById('shuImage'),
      shuVideo: document.getElementById('shuVideo'),
      woofText: document.getElementById('woofText'),
      barkBtn: document.getElementById('barkBtn'),
      resultPanel: document.getElementById('resultPanel'),
      vsBadge: document.getElementById('vsBadge'),
      shuMeter: document.getElementById('shuMeter'),
      shuValue: document.getElementById('shuValue'),
      opponentEmoji: document.getElementById('opponentEmoji'),
      opponentName: document.getElementById('opponentName'),
      opponentMeter: document.getElementById('opponentMeter'),
      opponentValue: document.getElementById('opponentValue'),
      messageText: document.getElementById('messageText'),
      funFact: document.getElementById('funFact'),
      totalBarks: document.getElementById('totalBarks'),
      wins: document.getElementById('wins'),
      winRate: document.getElementById('winRate'),
      confettiContainer: document.getElementById('confettiContainer'),
      announcer: document.getElementById('announcer')
    };
  }

  bindEvents() {
    this.elements.barkBtn.addEventListener('click', () => this.handleBark());

    // Accessibilite clavier
    this.elements.barkBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleBark();
      }
    });
  }

  setupConfetti() {
    this.confetti = new ConfettiSystem(this.elements.confettiContainer);
  }

  setupAudio() {
    // Charger tous les sons d'aboiement
    this.barkSounds = [];
    const barkCount = 8;
    for (let i = 1; i <= barkCount; i++) {
      const audio = new Audio(`assets/sounds/bark_0${i}.mp3`);
      audio.load();
      this.barkSounds.push(audio);
    }
  }

  playBarkSound(power = 85) {
    if (this.barkSounds && this.barkSounds.length > 0) {
      // Choisir un aboiement au hasard
      const randomIndex = Math.floor(Math.random() * this.barkSounds.length);
      const sound = this.barkSounds[randomIndex];

      // Volume au max (1.0) - la variabilite se fait par le choix du son
      // Les sons sont deja a volume different selon l'intensite
      const minPower = 60;
      const maxPower = 150;
      const minVolume = 0.6;
      const maxVolume = 1.0;
      const normalizedPower = (power - minPower) / (maxPower - minPower);
      sound.volume = minVolume + normalizedPower * (maxVolume - minVolume);

      // Jouer le son
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }

  startIdleAnimation() {
    this.elements.shu.classList.add('idle');
  }

  // ============================================
  // GESTION DE L'ABOIEMENT
  // ============================================

  async handleBark() {
    if (this.state.isBarking) return;

    this.state.isBarking = true;
    this.disableButton();

    // Phase 1: Calculer la puissance d'abord (pour le volume du son)
    const shuPower = this.calculateShuPower();
    const opponent = this.selectRandomOpponent();
    const isSuperBark = shuPower >= 120;

    // Phase 2: Animation d'aboiement avec volume adapte
    await this.playBarkAnimation(shuPower);

    // Phase 3: Affichage du panel
    await this.showResultPanel();

    // Phase 4: Affichage progressif des resultats
    await this.showResults(shuPower, opponent);

    // Phase 5: Resultat final
    const result = this.determineWinner(shuPower, opponent.decibels);
    await this.showFinalResult(result, opponent, isSuperBark);

    // Mise a jour stats
    this.updateStats(result);
    this.state.totalBarks++;
    this.saveStats();
    this.updateStatsDisplay();

    this.state.isBarking = false;
    this.enableButton();
  }

  // ============================================
  // CALCULS
  // ============================================

  calculateShuPower() {
    const { minDecibels, maxDecibels, superBarkChance } = SHU_CONFIG;

    // 15% de chance de super aboiement
    if (Math.random() < superBarkChance) {
      return Math.floor(Math.random() * 30) + 120; // 120-150 dB
    }

    // Distribution normale autour de 85 dB
    const gaussian = this.gaussianRandom(85, 20);
    return Math.max(minDecibels, Math.min(maxDecibels, Math.floor(gaussian)));
  }

  gaussianRandom(mean, stdDev) {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
  }

  selectRandomOpponent() {
    const allSounds = getAllSounds();
    return allSounds[Math.floor(Math.random() * allSounds.length)];
  }

  determineWinner(shuPower, opponentPower) {
    const diff = shuPower - opponentPower;
    if (diff > 5) return 'win';
    if (diff < -5) return 'lose';
    return 'draw';
  }

  // ============================================
  // ANIMATIONS
  // ============================================

  async playBarkAnimation(power = 85) {
    // Retirer idle
    this.elements.shu.classList.remove('idle');

    // Obtenir l'animation video correspondant a la puissance
    const animation = SHU_ANIMATIONS.getAnimationByPower(power);

    // Configurer et jouer la video
    const video = this.elements.shuVideo;
    const sources = video.querySelectorAll('source');
    sources[0].src = animation.animation_webm;
    sources[1].src = animation.video;
    video.load();

    // Passer en mode video
    this.elements.shu.classList.add('video-mode');
    video.classList.add('playing');

    // Jouer le son d'aboiement avec volume adapte a la puissance
    this.playBarkSound(power);

    // Afficher WOOF!
    this.elements.woofText.classList.add('show');

    // Jouer la video
    try {
      await video.play();
      // Attendre la fin de la video
      await new Promise((resolve) => {
        video.onended = resolve;
        // Fallback si la video est trop longue
        setTimeout(resolve, 3000);
      });
    } catch (e) {
      // Fallback en cas d'erreur de lecture
      await AnimationUtils.wait(600);
    }

    // Nettoyer
    video.classList.remove('playing');
    this.elements.shu.classList.remove('video-mode');
    this.elements.woofText.classList.remove('show');
  }

  async showResultPanel() {
    // Reset des valeurs
    this.elements.shuMeter.style.width = '0%';
    this.elements.opponentMeter.style.width = '0%';
    this.elements.shuValue.textContent = '0 dB';
    this.elements.opponentValue.textContent = '0 dB';
    this.elements.messageText.textContent = '';
    this.elements.funFact.textContent = '';
    this.elements.resultPanel.className = 'result-panel';

    // Afficher le panel
    this.elements.resultPanel.classList.remove('hidden');
    this.elements.resultPanel.classList.add('show');

    await AnimationUtils.wait(100);
  }

  async showResults(shuPower, opponent) {
    // Calculer les pourcentages (max 200 dB pour l'echelle)
    const maxScale = 200;
    const shuPercent = (shuPower / maxScale) * 100;
    const opponentPercent = (opponent.decibels / maxScale) * 100;

    // Mettre a jour l'adversaire
    this.elements.opponentEmoji.innerHTML = opponent.emoji;
    this.elements.opponentName.textContent = getLocalizedText(opponent.name);

    // Animation VS badge
    this.elements.vsBadge.classList.add('bounce');

    // Animer les jauges en parallele
    await AnimationUtils.parallel([
      () => MeterAnimation.animate(this.elements.shuMeter, shuPercent, 1000),
      () => MeterAnimation.animate(this.elements.opponentMeter, opponentPercent, 1000),
      () => CounterAnimation.animate(this.elements.shuValue, shuPower, 1000, ' dB'),
      () => CounterAnimation.animate(this.elements.opponentValue, opponent.decibels, 1000, ' dB')
    ]);

    this.elements.vsBadge.classList.remove('bounce');

    await AnimationUtils.wait(300);
  }

  async showFinalResult(result, opponent, isSuperBark) {
    let message = '';
    let resultClass = '';
    const lang = getCurrentLang();

    if (result === 'win') {
      message = getLocalizedText(opponent.winMessage);
      resultClass = 'win';
      this.elements.shu.classList.add('victory');
      this.confetti.launch();

      // Message special pour super bark
      if (isSuperBark) {
        const superMessages = SPECIAL_MESSAGES.superBark[lang] || SPECIAL_MESSAGES.superBark.fr;
        message = superMessages[Math.floor(Math.random() * superMessages.length)];
      }
    } else if (result === 'lose') {
      message = getLocalizedText(opponent.loseMessage);
      resultClass = 'lose';
      this.elements.shu.classList.add('defeat');
    } else {
      const drawMessages = SPECIAL_MESSAGES.draw[lang] || SPECIAL_MESSAGES.draw.fr;
      message = drawMessages[Math.floor(Math.random() * drawMessages.length)];
      resultClass = 'draw';
      this.elements.shu.classList.add('idle');
    }

    // Afficher le message
    this.elements.resultPanel.classList.add(resultClass);
    this.elements.messageText.textContent = message;
    this.elements.messageText.classList.add('show');

    // Afficher le fun fact apres un delai
    await AnimationUtils.wait(500);
    this.elements.funFact.textContent = getLocalizedText(opponent.funFact);
    this.elements.funFact.classList.add('show');

    // Annonce pour lecteurs d'ecran
    const resultText = result === 'win' ? I18N.t('victory') : result === 'lose' ? I18N.t('defeat') : I18N.t('draw');
    this.announce(`${resultText}! ${message}`);

    // Nettoyer les classes d'animation apres un moment
    await AnimationUtils.wait(1500);
    this.elements.shu.classList.remove('victory', 'defeat');
    this.elements.shu.classList.add('idle');
  }

  // ============================================
  // UI HELPERS
  // ============================================

  disableButton() {
    this.elements.barkBtn.disabled = true;
    this.elements.barkBtn.classList.add('disabled');
  }

  enableButton() {
    this.elements.barkBtn.disabled = false;
    this.elements.barkBtn.classList.remove('disabled');
    this.elements.barkBtn.querySelector('.button-text').textContent = I18N.t('barkButtonAgain');
  }

  announce(message) {
    this.elements.announcer.textContent = message;
  }

  // ============================================
  // STATISTIQUES
  // ============================================

  updateStats(result) {
    if (result === 'win') {
      this.state.wins++;
      this.state.winStreak++;

      // Verifier les series
      const lang = getCurrentLang();
      const streakMessages = SPECIAL_MESSAGES.streak[lang] || SPECIAL_MESSAGES.streak.fr;
      const streakMessage = streakMessages[this.state.winStreak];
      if (streakMessage) {
        this.elements.messageText.textContent += '\n' + streakMessage;
      }
    } else if (result === 'lose') {
      this.state.losses++;
      this.state.winStreak = 0;
    } else {
      this.state.draws++;
    }
  }

  updateStatsDisplay() {
    this.elements.totalBarks.textContent = this.state.totalBarks;
    this.elements.wins.textContent = this.state.wins;

    const total = this.state.wins + this.state.losses + this.state.draws;
    const rate = total > 0 ? Math.round((this.state.wins / total) * 100) : 0;
    this.elements.winRate.textContent = rate + '%';
  }

  saveStats() {
    const stats = {
      totalBarks: this.state.totalBarks,
      wins: this.state.wins,
      losses: this.state.losses,
      draws: this.state.draws
    };
    localStorage.setItem('shuStats', JSON.stringify(stats));
  }

  loadStats() {
    const saved = localStorage.getItem('shuStats');
    if (saved) {
      const stats = JSON.parse(saved);
      this.state.totalBarks = stats.totalBarks || 0;
      this.state.wins = stats.wins || 0;
      this.state.losses = stats.losses || 0;
      this.state.draws = stats.draws || 0;
    }
  }
}

// ============================================
// DEMARRAGE DE L'APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  window.shuApp = new ShuApp();
});
