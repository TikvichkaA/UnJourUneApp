/* ==========================================
   NPA-R Ivry-sur-Seine — Municipales 2026
   Interactions & animations
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Mobile Navigation ----------
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile nav on link click
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ---------- Header scroll effect ----------
    const header = document.getElementById('header');

    function onScroll() {
        if (window.pageYOffset > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---------- Smooth scroll for anchor links ----------
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const headerHeight = header?.offsetHeight || 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        });
    });

    // ---------- Scroll Reveal (IntersectionObserver) ----------
    const revealElements = document.querySelectorAll('[data-reveal]');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    entry.target.style.transitionDelay = `${delay * 0.15}s`;
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ---------- Parallax on hero shapes ----------
    const heroSection = document.getElementById('hero');
    const heroShapes = document.querySelectorAll('.hero-shape');
    let ticking = false;

    if (heroShapes.length > 0 && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;
                    const heroHeight = heroSection?.offsetHeight || 800;

                    if (scrollY < heroHeight * 1.5) {
                        heroShapes.forEach((shape, index) => {
                            const speed = 0.05 + (index * 0.04);
                            shape.style.transform = `translateY(${scrollY * speed}px)`;
                        });
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ---------- Card hover tilt (desktop only) ----------
    if (window.matchMedia('(pointer: fine)').matches) {
        const cards = document.querySelectorAll('.program-card, .why-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;

                card.style.transform = `translateY(-8px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ---------- Contact form ----------
    const contactForm = document.getElementById('contactForm');

    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        data.volunteer = contactForm.querySelector('#volunteer')?.checked || false;

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;

        // Simulated submission (replace with real endpoint)
        setTimeout(() => {
            showNotification('Merci ! Votre message a bien été envoyé. Nous vous recontacterons rapidement.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1200);
    });

    // ---------- Notification system ----------
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.4s ease-in forwards';
            setTimeout(() => notification.remove(), 400);
        }, 5000);
    }
});
