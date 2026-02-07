// ============================================
// Navigation Mobile
// ============================================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Fermer le menu quand on clique sur un lien
navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ============================================
// Header au scroll
// ============================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ============================================
// Animations au scroll (Intersection Observer)
// ============================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
};

const scrollObserver = new IntersectionObserver(animateOnScroll, observerOptions);

// Éléments à animer
const animatedElements = document.querySelectorAll('.service-card, .temoignage-card, .approche-point');

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    scrollObserver.observe(el);
});

// Ajouter la classe d'animation
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    </style>
`);

// Délai progressif pour les cartes
document.querySelectorAll('.services-grid .service-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

document.querySelectorAll('.temoignages-grid .temoignage-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// ============================================
// Gestion du formulaire
// ============================================
const contactForm = document.getElementById('contact-form');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Afficher un état de chargement
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;

    // Simulation d'envoi (à remplacer par votre backend)
    try {
        // Ici vous pouvez intégrer Formspree, Netlify Forms, ou votre propre API
        // Exemple avec Formspree:
        // const response = await fetch('https://formspree.io/f/VOTRE_ID', {
        //     method: 'POST',
        //     body: formData,
        //     headers: { 'Accept': 'application/json' }
        // });

        // Simulation d'un délai
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Afficher un message de succès
        showNotification('Message envoyé avec succès ! Je vous répondrai rapidement.', 'success');
        contactForm.reset();

    } catch (error) {
        showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// ============================================
// Notifications
// ============================================
function showNotification(message, type = 'success') {
    // Supprimer les notifications existantes
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    // Styles inline pour la notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 10px 25px rgb(0 0 0 / 0.15)',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease',
        background: type === 'success' ? '#0d9488' : '#ef4444',
        color: 'white',
        fontWeight: '500'
    });

    // Ajouter l'animation
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto-suppression après 5 secondes
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ============================================
// Smooth scroll pour les ancres
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Counter Animation (optionnel)
// ============================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ============================================
// Effet parallax léger sur le hero (optionnel)
// ============================================
const heroBg = document.querySelector('.hero-bg');

if (heroBg) {
    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        if (scroll < window.innerHeight) {
            heroBg.style.transform = `translateY(${scroll * 0.3}px)`;
        }
    });
}
