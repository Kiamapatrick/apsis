/* ============================================================
   APSIS Business Consulting – legal-pages.js
   Terms of Service, Privacy Policy and other long-form documents.
   Loaded after main-v2.js (navbar, preloader and copyright year
   are handled there). Each block exits early if its markup is absent.
   ============================================================ */

/* Contents: open on desktop, collapsed on phones (it is a <details> bar there) */
(function () {
    var toc = document.getElementById('tocDetails');
    if (!toc) return;
    var summary = toc.querySelector('summary');
    var mq = window.matchMedia('(max-width: 900px)');

    function sync() {
        toc.open = !mq.matches;               // desktop: always open
        if (summary) summary.tabIndex = mq.matches ? 0 : -1;
    }
    sync();
    if (mq.addEventListener) mq.addEventListener('change', sync);

    /* phones: close the bar after jumping to a section */
    toc.addEventListener('click', function (e) {
        if (mq.matches && e.target.closest('a')) toc.open = false;
    });
})();

/* Contents: highlight the section being read */
(function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('#toc-list a'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    var sections = [];
    links.forEach(function (link) {
        var id = link.getAttribute('href').slice(1);
        var sec = document.getElementById(id);
        if (sec) { byId[id] = link; sections.push(sec); }
    });
    if (!sections.length) return;

    function setActive(id) {
        links.forEach(function (link) {
            var on = byId[id] === link;
            link.classList.toggle('is-active', on);
            if (on) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });
    }

    /* a section counts as "current" while it crosses the upper part of the viewport */
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) setActive(entry.target.id);
        });
    }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });

    sections.forEach(function (sec) { io.observe(sec); });
    setActive(sections[0].id);
})();
