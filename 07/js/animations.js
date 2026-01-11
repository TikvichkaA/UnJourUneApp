// ============================================
// ANIMATIONS.JS - Animations JavaScript
// ============================================

// Configuration des animations
const ANIMATION_CONFIG = {
  confetti: {
    particleCount: 50,
    colors: ['#FFB6C1', '#87CEEB', '#98FB98', '#E6E6FA', '#FFE066', '#FFA07A'],
    duration: 3000,
    spread: 70
  },
  meter: {
    duration: 800
  },
  counter: {
    duration: 500
  }
};

// ============================================
// SYSTEME DE CONFETTIS
// ============================================

class ConfettiSystem {
  constructor(container) {
    this.container = container;
    this.particles = [];
  }

  launch() {
    const { particleCount, colors, duration } = ANIMATION_CONFIG.confetti;

    // Nettoyer les anciens confettis
    this.container.innerHTML = '';

    for (let i = 0; i < particleCount; i++) {
      const particle = this.createParticle(colors);
      this.container.appendChild(particle);

      // Animation avec delai aleatoire
      setTimeout(() => {
        particle.classList.add('falling');
      }, Math.random() * 500);
    }

    // Nettoyer apres l'animation
    setTimeout(() => {
      this.container.innerHTML = '';
    }, duration + 500);
  }

  createParticle(colors) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';

    // Position horizontale aleatoire
    particle.style.left = Math.random() * 100 + '%';

    // Couleur aleatoire
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // Taille aleatoire
    const size = Math.random() * 10 + 5;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    // Forme aleatoire (carre ou rond)
    if (Math.random() > 0.5) {
      particle.style.borderRadius = '50%';
    } else {
      particle.style.borderRadius = '2px';
      particle.style.transform = `rotate(${Math.random() * 360}deg)`;
    }

    // Delai et duree aleatoires
    particle.style.animationDelay = Math.random() * 0.5 + 's';
    particle.style.animationDuration = (Math.random() * 2 + 2) + 's';

    return particle;
  }
}

// ============================================
// ANIMATION DE REMPLISSAGE DE JAUGE
// ============================================

class MeterAnimation {
  static easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  }

  static easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  static animate(element, targetPercent, duration = 800, easing = 'cubic') {
    return new Promise((resolve) => {
      const start = performance.now();
      const easingFn = easing === 'elastic'
        ? this.easeOutElastic
        : this.easeOutCubic;

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFn(progress);

        element.style.width = `${easedProgress * targetPercent}%`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(update);
    });
  }
}

// ============================================
// ANIMATION DE COMPTEUR
// ============================================

class CounterAnimation {
  static animate(element, targetValue, duration = 500, suffix = '') {
    return new Promise((resolve) => {
      const start = performance.now();
      const startValue = parseInt(element.textContent) || 0;
      const diff = targetValue - startValue;

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

        const currentValue = Math.round(startValue + diff * eased);
        element.textContent = currentValue + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = targetValue + suffix;
          resolve();
        }
      };

      requestAnimationFrame(update);
    });
  }
}

// ============================================
// UTILITAIRES D'ANIMATION
// ============================================

const AnimationUtils = {
  // Attendre un delai
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Ajouter une classe temporairement
  async addClassTemporarily(element, className, duration) {
    element.classList.add(className);
    await this.wait(duration);
    element.classList.remove(className);
  },

  // Sequence d'animations
  async sequence(animations) {
    for (const animation of animations) {
      await animation();
    }
  },

  // Animations en parallele
  async parallel(animations) {
    await Promise.all(animations.map(fn => fn()));
  },

  // Shake un element
  shake(element, intensity = 5, duration = 500) {
    return new Promise(resolve => {
      const start = performance.now();
      const originalTransform = element.style.transform;

      const update = (now) => {
        const elapsed = now - start;
        const progress = elapsed / duration;

        if (progress < 1) {
          const decay = 1 - progress;
          const x = (Math.random() - 0.5) * intensity * decay;
          const y = (Math.random() - 0.5) * intensity * decay;
          element.style.transform = `translate(${x}px, ${y}px)`;
          requestAnimationFrame(update);
        } else {
          element.style.transform = originalTransform;
          resolve();
        }
      };

      requestAnimationFrame(update);
    });
  }
};

// Export pour utilisation globale
window.ConfettiSystem = ConfettiSystem;
window.MeterAnimation = MeterAnimation;
window.CounterAnimation = CounterAnimation;
window.AnimationUtils = AnimationUtils;
