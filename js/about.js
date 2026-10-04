
/* Team ID cards – hero visual stack */
(function () {
    var root = document.querySelector('.ph-visual');
    if (!root) return;
    var cards = Array.prototype.slice.call(root.querySelectorAll('.pid-card'));
    var counter = root.querySelector('#pidIndex');
    var prev = root.querySelector('.pid-prev');
    var next = root.querySelector('.pid-next');
    if (cards.length < 2 || !counter || !prev || !next) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var current = 0, timer = null, stopped = reduce.matches;
    var startX = null, startY = null;

    function show(n) {
        current = (n + cards.length) % cards.length;
        cards.forEach(function (card, i) {
            var pos = (i - current + cards.length) % cards.length;
            card.dataset.pos = pos;
            card.setAttribute('aria-hidden', String(pos !== 0));
            card.inert = pos !== 0;
        });
        counter.textContent = current + 1;
    }
    function stop() { clearInterval(timer); timer = null; }
    function start() {
        if (stopped || document.hidden || root.matches(':hover') || root.contains(document.activeElement)) return;
        stop();
        timer = setInterval(function () { show(current + 1); }, 5500);
    }
    function move(n) { stopped = true; stop(); show(n); }

    prev.addEventListener('click', function () { move(current - 1); });
    next.addEventListener('click', function () { move(current + 1); });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) start(); });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

    root.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    }, { passive: true });
    root.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX, dy = e.changedTouches[0].clientY - startY;
        startX = startY = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) move(current + (dx < 0 ? 1 : -1));
    }, { passive: true });

    show(0);
    setTimeout(start, 3500);
})();

/* About details section reveal */
(function () {
    var section = document.querySelector('.ad');
    if (!section) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    section.classList.add('is-armed');
    var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            section.classList.add('is-in');
            io.disconnect();
        }
    }, { threshold: 0.25 });
    io.observe(section);
})();

/* Values cards + team rows reveal (staggered fade-up) */
(function () {
    var els = document.querySelectorAll('.vals-card, .tm');
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
    }, { threshold: 0.15 });

    els.forEach(function (el) {
        el.classList.add('is-armed');
        io.observe(el);
    });
})();

/* Values carousel dot indicators — uses trust-dot / trust-dots from style-v2.css */
(function () {
    var track = document.querySelector('.vals-track');
    var dots  = document.querySelectorAll('.vals-carousel .trust-dot');
    if (!track || !dots.length) return;

    var cards = track.querySelectorAll('.vals-card');
    if (!cards.length) return;

    function updateDots() {
        var center = track.scrollLeft + track.offsetWidth / 2;
        var activeIndex = 0;
        var minDist = Infinity;
        cards.forEach(function (card, i) {
            var cardCenter = card.offsetLeft + card.offsetWidth / 2;
            var dist = Math.abs(cardCenter - center);
            if (dist < minDist) { minDist = dist; activeIndex = i; }
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === activeIndex);
        });
    }

    track.addEventListener('scroll', updateDots, { passive: true });
    window.addEventListener('resize', updateDots, { passive: true });
    updateDots();
})();
