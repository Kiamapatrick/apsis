/* ============================================================
   APSIS Business Consulting – content.js
   Shared JS for hub, blog listing, blog articles, insight pages.
   Loaded after main-v2.js (navbar, preloader already handled).
   ============================================================ */

(() => {
    'use strict';

    /* ── Reveal: native IntersectionObserver ─────────────── */
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (revealEls.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });
        revealEls.forEach(el => io.observe(el));
    }

    /* ── Reading progress bar ────────────────────────────── */
    const progressBar = document.getElementById('reading-progress');
    const article = document.querySelector('.article-prose') || document.querySelector('main');
    if (progressBar && article) {
        const updateProgress = () => {
            const rect = article.getBoundingClientRect();
            const articleTop = rect.top + window.scrollY;
            const articleHeight = rect.height;
            const scrolled = window.scrollY - articleTop;
            const progress = Math.max(0, Math.min(1, scrolled / (articleHeight - window.innerHeight)));
            progressBar.style.width = (progress * 100) + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    /* ── Blog article TOC: highlight current section ─────── */
    const tocLinks = Array.from(document.querySelectorAll('.article-toc-list a'));
    if (tocLinks.length && 'IntersectionObserver' in window) {
        const byId = {};
        const sections = [];
        tocLinks.forEach(link => {
            const id = link.getAttribute('href').replace('#', '');
            const sec = document.getElementById(id);
            if (sec) { byId[id] = link; sections.push(sec); }
        });
        if (sections.length) {
            const setActive = (id) => {
                tocLinks.forEach(link => {
                    const on = byId[id] === link;
                    link.classList.toggle('is-active', on);
                });
            };
            const tocIO = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });
            sections.forEach(sec => tocIO.observe(sec));
            setActive(sections[0].id);
        }
    }

    /* ── Filter pills (blog listing) ─────────────────────── */
    const filterBar = document.querySelector('.ct-filters');
    if (filterBar) {
        const pills = filterBar.querySelectorAll('.ct-pill');
        const cards = document.querySelectorAll('.ct-blog-card[data-category]');

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => {
                    p.classList.remove('active');
                    p.setAttribute('aria-pressed', 'false');
                });
                pill.classList.add('active');
                pill.setAttribute('aria-pressed', 'true');

                const filter = pill.dataset.filter;
                cards.forEach(card => {
                    const match = filter === 'all' || card.dataset.category === filter;
                    card.style.display = match ? '' : 'none';
                    card.closest('li')?.style && (card.closest('li').style.display = match ? '' : 'none');
                });
            });
        });
    }

    /* ── Navbar toggle (content pages share the same nav) ── */
    const toggler = document.querySelector('.navbar-toggler');
    const collapse = document.getElementById('apsisNavbar');
    if (toggler && collapse) {
        toggler.addEventListener('click', () => {
            const open = collapse.classList.toggle('show');
            toggler.setAttribute('aria-expanded', String(open));
        });
        /* close on link click */
        collapse.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                collapse.classList.remove('show');
                toggler.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ── Fade-in & Reveal Support ───────────────────────── */
    const fadeEls = document.querySelectorAll('.fade-in');
    if (fadeEls.length) {
        fadeEls.forEach(el => el.classList.add('visible'));
    }

    /* ── FAQ Accordion (Insight pages) ───────────────────── */
    const faqItems = document.querySelectorAll('.faq-item, .accordion-item');
    if (faqItems.length) {
        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!btn || !answer) return;

            btn.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                // Close other open FAQ items
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('open');
                        const otherBtn = other.querySelector('.faq-question');
                        const otherAnswer = other.querySelector('.faq-answer');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                    }
                });

                item.classList.toggle('open', !isOpen);
                btn.setAttribute('aria-expanded', String(!isOpen));
                answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
            });
        });
    }

    /* ── Article TOC (Blog & Insight pages) ──────────────── */
    const allTocLinks = Array.from(document.querySelectorAll('.article-toc-list a, .article-toc__list a, #toc-list a'));
    if (allTocLinks.length && 'IntersectionObserver' in window) {
        const byId = {};
        const sections = [];
        allTocLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const id = href.replace('#', '');
                const sec = document.getElementById(id);
                if (sec) { byId[id] = link; sections.push(sec); }
            }
        });
        if (sections.length) {
            const setActive = (id) => {
                allTocLinks.forEach(link => {
                    const on = byId[id] === link;
                    link.classList.toggle('is-active', on);
                    link.classList.toggle('active', on);
                });
            };
            const tocIO = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });
            sections.forEach(sec => tocIO.observe(sec));
            if (sections[0]) setActive(sections[0].id);
        }
    }

    /* ── Penalty Estimator Mini-Tool ─────────────────────── */
    const calcBtn = document.getElementById('btn-calc-penalty');
    const resultBox = document.getElementById('penalty-result');
    const amountVal = document.getElementById('penalty-amount-val');
    const taxType = document.getElementById('tax-type');

    if (calcBtn && resultBox && amountVal && taxType) {
        calcBtn.addEventListener('click', () => {
            const type = taxType.value;
            let penalty = 10000;
            if (type === 'income') penalty = 20000;
            else if (type === 'turnover') penalty = 1000;
            else penalty = 1000;

            const formatted = new Intl.NumberFormat('en-KE', {
                style: 'currency',
                currency: 'KES',
                maximumFractionDigits: 0
            }).format(penalty);

            amountVal.textContent = formatted;
            resultBox.classList.add('active');
        });
    }
})();
