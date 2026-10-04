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

    /* Each swipe "page" is one column of two stacked cards, so group by x position */
    function columnOffsets() {
        var xs = [];
        visibleCards().forEach(function (c) {
            var x = Math.round(c.offsetLeft);
            if (xs.indexOf(x) === -1) xs.push(x);
        });
        return xs.sort(function (a, b) { return a - b; });
    }

    function buildDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        dots = [];
        var cols = phone.matches ? columnOffsets() : [];
        dotsWrap.hidden = cols.length < 2;
        if (cols.length < 2) return;

        cols.forEach(function (x, i) {
            var dot = document.createElement('span');
            dot.className = 'trust-dot';
            dot.addEventListener('click', function () {
                var pad = parseFloat(getComputedStyle(grid).paddingLeft) || 0;
                grid.scrollTo({ left: x - pad, behavior: reduce.matches ? 'auto' : 'smooth' });
            });
            dotsWrap.appendChild(dot);
            dots.push(dot);
        });
        updateDots();
    }

    function updateDots() {
        if (!dots.length) return;
        var cols = columnOffsets();
        var pad = parseFloat(getComputedStyle(grid).paddingLeft) || 0;
        var pos = grid.scrollLeft + pad;
        var atEnd = grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 2;
        var active = 0, min = Infinity;

        if (atEnd) {
            active = cols.length - 1;   /* last column can't reach the snap point, so pin it */
        } else {
            cols.forEach(function (x, i) {
                var d = Math.abs(x - pos);
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