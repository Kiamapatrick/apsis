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

    /* ── Homepage hero services carousel ────────────────────── */
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        const slides = [...heroSlider.querySelectorAll('.hs-slide')];
        const lines = [...document.querySelectorAll('.hero-line')];
        const label = heroSlider.querySelector('#hsLabel');
        const index = heroSlider.querySelector('#hsIndex');
        const previous = heroSlider.querySelector('.hs-prev');
        const next = heroSlider.querySelector('.hs-next');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const interval = 7000;
        let current = 0;
        let timer = null;
        let stopped = reduceMotion.matches;
        let hovering = false;
        let touching = false;
        let touchStartX = null;
        let touchStartY = null;

        if (slides.length > 1 && lines.length === slides.length && label && index && previous && next) {
            const show = (nextIndex) => {
                current = (nextIndex + slides.length) % slides.length;
                slides.forEach((slide, slideIndex) => {
                    const isActive = slideIndex === current;
                    slide.classList.toggle('is-active', isActive);
                    slide.setAttribute('aria-hidden', String(!isActive));
                    slide.inert = !isActive;

                    const line = lines[slideIndex];
                    line.classList.toggle('is-active', isActive);
                    line.setAttribute('aria-hidden', String(!isActive));
                    line.inert = !isActive;
                });
                label.textContent = slides[current].dataset.label;
                index.textContent = String(current + 1);
            };

            const clear = () => {
                window.clearInterval(timer);
                timer = null;
            };

            const start = () => {
                if (stopped || reduceMotion.matches || document.hidden ||
                    hovering || touching || heroSlider.contains(document.activeElement)) return;
                clear();
                timer = window.setInterval(() => show(current + 1), interval);
            };

            const userMove = (nextIndex) => {
                stopped = true;
                clear();
                show(nextIndex);
            };

            previous.addEventListener('click', () => userMove(current - 1));
            next.addEventListener('click', () => userMove(current + 1));

            // Mouse only: pause on hover. Touch has no hover, so phones keep playing.
            heroSlider.addEventListener('pointerenter', (event) => {
                if (event.pointerType !== 'mouse') return;
                hovering = true;
                clear();
            });
            heroSlider.addEventListener('pointerleave', (event) => {
                if (event.pointerType !== 'mouse') return;
                hovering = false;
                start();
            });

            heroSlider.addEventListener('focusin', clear);
            heroSlider.addEventListener('focusout', (event) => {
                if (!heroSlider.contains(event.relatedTarget)) start();
            });

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) clear();
                else start();
            });

            // Touch: pause while a finger is down, swipe to move, resume if it was just a tap
            heroSlider.addEventListener('touchstart', (event) => {
                touching = true;
                clear();
                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;
            }, { passive: true });

            heroSlider.addEventListener('touchend', (event) => {
                touching = false;

                if (touchStartX === null || touchStartY === null) {
                    start();
                    return;
                }

                const deltaX = event.changedTouches[0].clientX - touchStartX;
                const deltaY = event.changedTouches[0].clientY - touchStartY;
                touchStartX = null;
                touchStartY = null;

                if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
                    if (event.cancelable) event.preventDefault();
                    userMove(deltaX < 0 ? current + 1 : current - 1);
                } else {
                    start();
                }
            }, { passive: false });

            heroSlider.addEventListener('touchcancel', () => {
                touching = false;
                touchStartX = null;
                touchStartY = null;
                start();
            }, { passive: true });

            show(0);
            start();
        }
    }

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

            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (result.success) {
                    const alert = document.createElement('div');
                    alert.className = 'contact-alert alert alert-success mt-3';
                    alert.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Thank you! Your message has been sent. We\'ll be in touch shortly.';
                    contactForm.appendChild(alert);
                    contactForm.reset();
                    setTimeout(() => alert.remove(), 6000);
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (err) {
                console.error('Contact form error:', err);
                const alert = document.createElement('div');
                alert.className = 'contact-alert alert alert-danger mt-3';
                alert.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i>Something went wrong, please try calling us at +254 722 670 127 instead';
                contactForm.appendChild(alert);
                setTimeout(() => alert.remove(), 8000);
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }
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
(function () {
    var strip = document.querySelector('.trust-strip');
    if (!strip) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return; // stays fully visible
 
    strip.classList.add('is-armed');
    var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            strip.classList.add('is-in');
            io.disconnect(); // play once
        }
    }, { threshold: 0.35 });
    io.observe(strip);
})();
(function () {
    var inner = document.querySelector('.trust-strip-inner');
    var dots = document.querySelectorAll('.trust-strip .trust-dot');

    if (!inner || !dots.length) return;

    function updateDots() {
        var items = inner.querySelectorAll('.trust-item');
        if (!items.length) return;

        var scrollLeft = inner.scrollLeft;
        var closestIndex = 0;
        var closestDistance = Infinity;

        items.forEach(function (item, index) {
            var distance = Math.abs(item.offsetLeft - scrollLeft);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        dots.forEach(function (dot, index) {
            dot.classList.toggle('active', index === closestIndex);
        });
    }

    inner.addEventListener('scroll', updateDots, {
        passive: true
    });

    window.addEventListener('resize', updateDots);

    updateDots();
})();
(function () {
    var grid = document.querySelector('.insights-grid');
    var cards = grid ? Array.from(grid.querySelectorAll('.insight')) : [];
    var dots = document.querySelectorAll('.insights .trust-dots .trust-dot');

    if (!grid || !cards.length || dots.length !== cards.length) return;

    var updateFrame = 0;

    function updateDots() {
        var gridBounds = grid.getBoundingClientRect();
        var viewportCenter = gridBounds.left + grid.clientLeft + grid.clientWidth / 2;
        var activeIndex = 0;
        var shortestDistance = Infinity;

        cards.forEach(function (card, index) {
            var bounds = card.getBoundingClientRect();
            var cardCenter = bounds.left + bounds.width / 2;
            var distance = Math.abs(cardCenter - viewportCenter);

            if (distance < shortestDistance) {
                shortestDistance = distance;
                activeIndex = index;
            }
        });

        dots.forEach(function (dot, index) {
            dot.classList.toggle('active', index === activeIndex);
        });
    }

    grid.addEventListener('scroll', function () {
        if (updateFrame) return;
        updateFrame = window.requestAnimationFrame(function () {
            updateFrame = 0;
            updateDots();
        });
    }, { passive: true });

    window.addEventListener('resize', updateDots, { passive: true });
    updateDots();
})();

/* Services filter (paste into main-v2.js) */
(function () {
    var tabs = document.querySelectorAll('.offer-tab');
    var items = document.querySelectorAll('.offer');
    var grid = document.getElementById('servicesGrid');
    if (!tabs.length || !items.length) return;

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var filter = tab.dataset.filter;
            tabs.forEach(function (t) {
                var on = t === tab;
                t.classList.toggle('active', on);
                t.setAttribute('aria-pressed', String(on));
            });
            items.forEach(function (item) {
                item.hidden = !(filter === 'all' || item.dataset.category === filter);
            });
            if (grid) grid.scrollLeft = 0; // phones: return to the first card
        });
    });
})();

/* ── Insights / Blogs section scroll-reveal ─────────────── */
(function () {
    var section = document.querySelector('.insights');
    if (!section) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    /* Section-level entrance: header + "view all" slide up */
    var head = section.querySelector('.insights-head');
    if (head) {
        head.style.opacity = '0';
        head.style.transform = 'translateY(16px)';
        head.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    }

    /* Card-level stagger: each card fades up with a delay */
    var cards = section.querySelectorAll('.insight');
    cards.forEach(function (card, i) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition =
            'opacity 0.65s ease ' + (0.1 + i * 0.12) + 's, ' +
            'transform 0.65s ease ' + (0.1 + i * 0.12) + 's';
    });

    var played = false;
    var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting || played) return;
        played = true;

        if (head) {
            head.style.opacity = '1';
            head.style.transform = 'none';
        }
        cards.forEach(function (card) {
            card.style.opacity = '1';
            card.style.transform = 'none';
        });
        io.disconnect();
    }, { threshold: 0.12 });

    io.observe(section);
})();
