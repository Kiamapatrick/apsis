/* ============================================================
   APSIS — SERVICES INDEX  (services.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Dynamic Copyright Year ── */
    function updateCopyrightYear() {
        const yearElements = document.querySelectorAll('#copyright-year, .footer-copy, .hub-footer-copy, .footer-bottom p');
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            const text = el.textContent.trim();
            if (text.includes('202') || text.includes('©') || text === '') {
                if (el.id === 'copyright-year') {
                    el.textContent = currentYear;
                } else if (text.includes('202')) {
                    el.innerHTML = text.replace(/\d{4}/, currentYear);
                }
            }
        });
    }
    updateCopyrightYear();

    /* ── Reading progress bar ── */
    const bar = document.getElementById('reading-progress');
    if (bar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0';
        }, { passive: true });
    }

    /* ── Scroll fade-up ── */
    const fadeEls = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.10, rootMargin: '0px 0px -48px 0px' });
    fadeEls.forEach(el => observer.observe(el));

    /* ── Mobile nav ── */
    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = document.getElementById('nav-overlay');
    const closeBtn = document.getElementById('mobile-nav-close');

    const openNav = () => {
        mobileNav?.classList.add('open');
        overlay && (overlay.style.display = 'block');
        requestAnimationFrame(() => overlay?.classList.add('visible'));
        hamburger?.classList.add('open');
        hamburger?.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };
    const closeNav = () => {
        mobileNav?.classList.remove('open');
        overlay?.classList.remove('visible');
        hamburger?.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        setTimeout(() => { if (overlay) overlay.style.display = 'none'; }, 320);
    };

    hamburger?.addEventListener('click', openNav);
    closeBtn?.addEventListener('click', closeNav);
    overlay?.addEventListener('click', closeNav);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

    /* ── Service card keyboard accessibility ── */
    document.querySelectorAll('.service-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const href = card.getAttribute('href');
                if (href) window.location.href = href;
            }
        });
    });

    /* ── Stagger card animations ── */
    const cards = document.querySelectorAll('.service-card.fade-up');
    cards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.08}s`;
    });

});