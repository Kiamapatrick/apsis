/**
 * Moving Belts: Kenya Tax Deadlines & Blogs/Insights
 * APSIS Business Consulting Ltd
 */
(function () {
    'use strict';

    // Hide any card whose data-expires date has passed (YYYY-MM-DD)
    function filterExpiredCards() {
        var now = new Date();
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        var expCards = document.querySelectorAll('.belt-card[data-expires]');
        expCards.forEach(function (card) {
            var expStr = card.getAttribute('data-expires');
            if (!expStr) return;
            var parts = expStr.split('-');
            if (parts.length === 3) {
                var expDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                if (expDate < today) {
                    card.hidden = true;
                    card.style.display = 'none';
                }
            }
        });
    }

    function initBelts() {
        filterExpiredCards();

        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var wrappers = document.querySelectorAll('.belt-wrapper');
        if (!wrappers.length) return;

        if (reduceMotion) {
            // prefers-reduced-motion: no animation, no clones, horizontal scroll with scroll-snap
            return;
        }

        wrappers.forEach(function (wrapper) {
            var track = wrapper.querySelector('.belt-track');
            if (!track) return;

            if (track.getAttribute('data-cloned') === 'true') return;

            var originalCards = Array.from(track.children).filter(function (c) {
                return !c.hidden && c.style.display !== 'none';
            });
            if (!originalCards.length) return;

            // Clone card set once for seamless loop
            originalCards.forEach(function (card) {
                var clone = card.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                clone.classList.add('belt-card--clone');

                // Set tabindex="-1" on focusable elements in clones
                var focusable = clone.querySelectorAll('a, button, input, textarea, select, [tabindex]');
                focusable.forEach(function (el) {
                    el.setAttribute('tabindex', '-1');
                });

                track.appendChild(clone);
            });

            track.setAttribute('data-cloned', 'true');

            // Pause on touchstart
            var touchTimer = null;
            wrapper.addEventListener('touchstart', function () {
                wrapper.classList.add('is-paused');
                clearTimeout(touchTimer);
            }, { passive: true });

            wrapper.addEventListener('touchend', function () {
                clearTimeout(touchTimer);
                touchTimer = setTimeout(function () {
                    wrapper.classList.remove('is-paused');
                }, 3500);
            }, { passive: true });
        });

        // Resume touch-pause when touching outside
        document.addEventListener('touchstart', function (e) {
            wrappers.forEach(function (wrapper) {
                if (!wrapper.contains(e.target)) {
                    wrapper.classList.remove('is-paused');
                }
            });
        }, { passive: true });

        // Set shift distance and animation duration (~40px/s desktop, ~30px/s phone)
        function updateBeltMetrics() {
            var isPhone = window.matchMedia('(max-width: 576px)').matches;
            var speed = isPhone ? 30 : 40;

            wrappers.forEach(function (wrapper) {
                var track = wrapper.querySelector('.belt-track');
                if (!track) return;

                var firstOriginal = track.querySelector('.belt-card:not(.belt-card--clone):not([hidden])');
                var firstClone = track.querySelector('.belt-card--clone');
                if (!firstOriginal || !firstClone) return;

                var shiftDistance = firstClone.offsetLeft - firstOriginal.offsetLeft;
                if (shiftDistance <= 0) return;

                var duration = shiftDistance / speed;

                track.style.setProperty('--belt-shift', shiftDistance + 'px');
                track.style.setProperty('--belt-duration', duration.toFixed(2) + 's');
                wrapper.classList.add('is-ready');
            });
        }

        updateBeltMetrics();

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateBeltMetrics, 100);
        }, { passive: true });

        window.addEventListener('load', updateBeltMetrics, { once: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBelts);
    } else {
        initBelts();
    }
})();
