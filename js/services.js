/* Services: filter + phone swipe carousel (dots reuse .trust-dots / .trust-dot from style-v2.css) */
(function () {
    var grid = document.getElementById('svcGrid');
    var dotsWrap = document.getElementById('svcDots');
    var btns = Array.prototype.slice.call(document.querySelectorAll('.svc-filter-btn'));
    if (!grid || !btns.length) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.svc-card'));
    var phone = window.matchMedia('(max-width: 640px)');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var dots = [];
    var raf = null;

    function visibleCards() {
        return cards.filter(function (c) { return !c.classList.contains('svc-hidden'); });
    }

    /* Mobile layout: 2 rows (grid-template-rows: repeat(2, auto)), grid-auto-flow: column.
       Each swipe page = 1 column = 2 stacked cards. */
    function getSwipePages() {
        var vc = visibleCards();
        if (!phone.matches || vc.length < 3) return { count: 0, positions: [] };

        var pageCount = Math.ceil(vc.length / 2);

        /* Calculate column width + gap from computed styles */
        var gap = 14; /* 0.875rem = 14px at default 16px root */
        var style = getComputedStyle(grid);
        var padLeft = parseFloat(style.paddingLeft) || 0;

        /* grid-auto-columns: 80% of viewport (container) width */
        var colWidth = grid.clientWidth * 0.8;
        var step = colWidth + gap;

        var positions = [];
        for (var i = 0; i < pageCount; i++) {
            positions.push(i * step - padLeft);
        }
        return { count: pageCount, positions: positions };
    }

    function buildDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        dots = [];

        var pages = getSwipePages();
        dotsWrap.hidden = pages.count < 2;
        if (pages.count < 2) return;

        pages.positions.forEach(function (scrollLeft, i) {
            var dot = document.createElement('span');
            dot.className = 'trust-dot';
            dot.addEventListener('click', function () {
                grid.scrollTo({ left: scrollLeft, behavior: reduce.matches ? 'auto' : 'smooth' });
            });
            dotsWrap.appendChild(dot);
            dots.push(dot);
        });
        updateDots();
    }

    function updateDots() {
        if (!dots.length) return;

        var pages = getSwipePages();
        if (pages.count < 2) return;

        var pos = grid.scrollLeft;
        var atEnd = grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 2;
        var active = 0, min = Infinity;

        if (atEnd) {
            active = pages.count - 1;
        } else {
            pages.positions.forEach(function (targetLeft, i) {
                var d = Math.abs(targetLeft - pos);
                if (d < min) { min = d; active = i; }
            });
        }
        dots.forEach(function (dot, i) { dot.classList.toggle('active', i === active); });
    }

    function applyFilter(filter, animate) {
        btns.forEach(function (b) {
            var on = b.dataset.filter === filter;
            b.classList.toggle('active', on);
            b.setAttribute('aria-pressed', String(on));
        });
        cards.forEach(function (c) {
            c.classList.toggle('svc-hidden', filter !== 'all' && c.dataset.category !== filter);
        });

        grid.scrollLeft = 0;            /* new set starts at the first column */

        if (animate && !reduce.matches) {
            grid.classList.remove('is-swapping');
            void grid.offsetWidth;      /* restart the animation */
            grid.classList.add('is-swapping');
        }
        buildDots();
    }

    btns.forEach(function (b) {
        b.addEventListener('click', function () { applyFilter(b.dataset.filter, true); });
    });

    /* Hero finder: pick a category, filter, and scroll to the list */
    document.querySelectorAll('[data-jump]').forEach(function (el) {
        el.addEventListener('click', function () {
            applyFilter(el.dataset.jump, true);
            var target = document.getElementById('our-services');
            if (target) target.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
        });
    });

    grid.addEventListener('scroll', function () {
        if (raf) return;
        raf = requestAnimationFrame(function () { raf = null; updateDots(); });
    }, { passive: true });

    window.addEventListener('resize', buildDots, { passive: true });
    if (phone.addEventListener) phone.addEventListener('change', buildDots);

    buildDots();
    /* Fonts/images can shift widths after load */
    window.addEventListener('load', buildDots);
})();

/* Service finder (hero load) - animate on page load */
(function () {
    var finder = document.querySelector('.sv-find');
    if (!finder) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    finder.classList.add('is-armed');
    setTimeout(function () { finder.classList.add('is-in'); }, 300);
})();

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