/* ============================================================
   APSIS Business Consulting – main-v2.js
   ============================================================ */

(() => {
    'use strict';

    /* ── Dynamic Copyright Year ────────────────────────────── */
    const updateCopyrightYear = () => {
        const yearElements = document.querySelectorAll('#copyright-year, .footer-copy, .hub-footer-copy, .footer-bottom p');
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            // Only update if element contains a year pattern or is empty
            const text = el.textContent.trim();
            if (text.includes('202') || text.includes('©') || text === '') {
                // Replace year in text or set new text
                if (el.id === 'copyright-year') {
                    el.textContent = currentYear;
                } else if (text.includes('202')) {
                    el.innerHTML = text.replace(/\d{4}/, currentYear);
                }
            }
        });
    };
    updateCopyrightYear();

    /* ── Preloader ─────────────────────────────────────────── */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => preloader.classList.add('hidden'), 400);
        });
    }

    /* ── Navbar: scroll class + active link ────────────────── */
    const mainNav = document.getElementById('mainNav');

    const handleNavScroll = () => {
        if (!mainNav) return;
        mainNav.classList.toggle('scrolled', window.scrollY > 60);
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // Close mobile menu on nav-link click
    document.querySelectorAll('#apsisNavbar .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const collapse = document.getElementById('apsisNavbar');
            if (collapse && collapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(collapse);
                bsCollapse && bsCollapse.hide();
            }
        });
    });

    /* ── Hero word animations (staggered) ─────────────────── */
    document.querySelectorAll('.word').forEach((el, i) => {
        el.style.animationDelay = `${0.6 + i * 0.18}s`;
    });
    document.querySelectorAll('.word2').forEach((el, i) => {
        el.style.animationDelay = `${1.0 + i * 0.18}s`;
    });

    /* ── Animated stat counters ────────────────────────────── */
    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;
        const duration = 1800;
        const step = 16;
        const increment = target / (duration / step);
        let current = 0;

        const tick = () => {
            current += increment;
            if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(tick);
            } else {
                el.textContent = target;
            }
        };
        requestAnimationFrame(tick);
    };

    const statNums = document.querySelectorAll('.stat-num[data-target]');
    if (statNums.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNums.forEach(el => observer.observe(el));
    }

    /* ── Services filter ───────────────────────────────────── */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            serviceCards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('hidden', !match);
            });
        });
    });

    /* ── Contact form ──────────────────────────────────────── */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('.contact-submit-btn');
            const originalHTML = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending…';

            // Remove any existing alert
            contactForm.querySelector('.contact-alert')?.remove();

            // Simulate async send (replace with real fetch when backend is ready)
            await new Promise(resolve => setTimeout(resolve, 1400));

            const alert = document.createElement('div');
            alert.className = 'contact-alert alert alert-success mt-3';
            alert.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Thank you! Your message has been sent. We\'ll be in touch shortly.';
            contactForm.appendChild(alert);

            contactForm.reset();
            btn.disabled = false;
            btn.innerHTML = originalHTML;

            setTimeout(() => alert.remove(), 6000);
        });
    }

    /* ── Scroll-reveal for cards (Intersection Observer) ───── */
    const revealEls = document.querySelectorAll(
        '.blog-card, .service-card, .about-pillar, .contact-form-wrap, .contact-info-card'
    );

    if (revealEls.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(28px)';
            el.style.transition = `opacity 0.55s ease ${(i % 4) * 0.08}s, transform 0.55s ease ${(i % 4) * 0.08}s`;
            revealObserver.observe(el);
        });
    }

    /* ── Smooth scroll for in-page anchor links ────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = mainNav ? mainNav.offsetHeight + 16 : 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

})();