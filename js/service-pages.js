/* ============================================================
   APSIS Business Consulting – service-pages.js
   Shared behaviour for the SEO service landing pages.
   Loaded after main-v2.js (which already handles the navbar,
   preloader and copyright year). Add new blocks below as pages
   are migrated; each block is self-contained and exits early
   when its markup isn't on the page.
   ============================================================ */

/* Reveal: one soft fade-up, armed only for blocks that start below the fold (no flash on load) */
(function () {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    els.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        el.classList.add('is-armed');
        io.observe(el);
    });
})();

/* FAQ: open the question named in the URL hash (e.g. page.html#faq3), so shared links land on the answer */
(function () {
    var id = window.location.hash.slice(1);
    if (!id || !window.bootstrap) return;
    var panel = document.getElementById(id);
    if (!panel || !panel.classList.contains('accordion-collapse')) return;

    window.bootstrap.Collapse.getOrCreateInstance(panel, { toggle: false }).show();
    panel.scrollIntoView({ block: 'center' });
})();