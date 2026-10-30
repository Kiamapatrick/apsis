/**
 * Moving Belts: Kenya Tax Deadlines & Blogs/Insights
 * APSIS Business Consulting Ltd
 *
 * Each belt is a normal horizontally scrollable container that also drifts on its own.
 * - Touch: native swipe
 * - Mouse: click and drag, trackpad, Shift+wheel
 * - Auto-drift pauses on hover, focus, touch, drag, and resumes shortly after
 * - Content is cloned so the loop is endless in both directions
 */
(function () {
    'use strict';

    var RESUME_DELAY = 2500; // ms of calm before auto-drift restarts

    // Hide any card whose data-expires date has passed (YYYY-MM-DD)
    function filterExpiredCards() {
        var now = new Date();
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        document.querySelectorAll('.belt-card[data-expires]').forEach(function (card) {
            var parts = (card.getAttribute('data-expires') || '').split('-');
            if (parts.length !== 3) return;
            var expDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
            if (expDate < today) {
                card.hidden = true;
                card.style.display = 'none';
            }
        });
    }

    function setupBelt(wrapper, autoplay) {
        var track = wrapper.querySelector('.belt-track');
        if (!track || track.getAttribute('data-cloned') === 'true') return;

        var originals = Array.from(track.children).filter(function (c) {
            return !c.hidden && c.style.display !== 'none';
        });
        if (!originals.length) return;

        var dir = wrapper.classList.contains('belt-wrapper--blogs') ? -1 : 1; // blogs drift right, deadlines drift left
        var loop = 0;      // width of one full set of cards (incl. gap)
        var sets = 1;
        var pos = 0;       // our own float position (scrollLeft can round)
        var lastSet = 0;
        var speed = 40;

        var hovering = false, focused = false, touching = false, dragging = false;
        var inView = true;
        var interactUntil = 0;
        var settleTimer;

        function now() { return window.performance ? performance.now() : Date.now(); }

        // ---- cloning ----
        function addSet() {
            originals.forEach(function (card) {
                var clone = card.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                clone.classList.add('belt-card--clone');
                clone.querySelectorAll('a, button, input, textarea, select, [tabindex]').forEach(function (el) {
                    el.setAttribute('tabindex', '-1');
                });
                track.appendChild(clone);
            });
            sets++;
        }

        function measure() {
            var first = track.querySelector('.belt-card:not(.belt-card--clone):not([hidden])');
            var firstClone = track.querySelector('.belt-card--clone');
            if (!first || !firstClone) return 0;
            return firstClone.offsetLeft - first.offsetLeft;
        }

        // keep scrollLeft inside the middle set so there is always content on both sides
        function norm(x) {
            if (!loop) return x;
            while (x >= loop * 2) x -= loop;
            while (x < loop) x += loop;
            return x;
        }

        function updateMetrics() {
            var oldLoop = loop;
            var frac = oldLoop ? (wrapper.scrollLeft - oldLoop) / oldLoop : 0;

            loop = measure();
            if (loop <= 0) return;

            // enough copies to cover the viewport plus a buffer either side
            var need = 3 + Math.ceil(wrapper.clientWidth / loop);
            while (sets < need) addSet();

            speed = window.matchMedia('(max-width: 576px)').matches ? 30 : 40;

            wrapper.scrollLeft = oldLoop ? loop + frac * loop : loop;
            pos = wrapper.scrollLeft;
            lastSet = pos;
            wrapper.classList.add('is-ready');
        }

        // ---- settle: after a scroll or fling ends, jump back to the middle set (looks identical) ----
        function settle() {
            if (touching || dragging || !loop) return;
            var sl = wrapper.scrollLeft;
            var n = norm(sl);
            if (n !== sl) wrapper.scrollLeft = n;
            pos = wrapper.scrollLeft;
            lastSet = pos;
        }

        wrapper.addEventListener('scroll', function () {
            clearTimeout(settleTimer);
            settleTimer = setTimeout(settle, 140);
        }, { passive: true });

        // ---- touch ----
        wrapper.addEventListener('touchstart', function () {
            touching = true;
        }, { passive: true });

        function touchDone() {
            touching = false;
            interactUntil = now() + RESUME_DELAY;
        }
        wrapper.addEventListener('touchend', touchDone, { passive: true });
        wrapper.addEventListener('touchcancel', touchDone, { passive: true });

        // ---- trackpad / wheel ----
        wrapper.addEventListener('wheel', function (e) {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
                interactUntil = now() + RESUME_DELAY;
            }
        }, { passive: true });

        // ---- mouse hover / keyboard focus ----
        wrapper.addEventListener('pointerenter', function (e) {
            if (e.pointerType === 'mouse') hovering = true;
        });
        wrapper.addEventListener('pointerleave', function (e) {
            if (e.pointerType === 'mouse') hovering = false;
        });
        wrapper.addEventListener('focusin', function () { focused = true; });
        wrapper.addEventListener('focusout', function () { focused = false; });

        // ---- mouse drag ----
        var startX = 0, startScroll = 0, moved = false, suppressClick = false;

        function onMove(e) {
            var dx = e.clientX - startX;
            if (!moved && Math.abs(dx) > 4) {
                moved = true;
                wrapper.classList.add('is-dragging');
            }
            if (moved) wrapper.scrollLeft = startScroll - dx;
        }

        function onUp() {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
            document.removeEventListener('pointercancel', onUp);
            dragging = false;
            wrapper.classList.remove('is-dragging');
            if (moved) {
                suppressClick = true;
                setTimeout(function () { suppressClick = false; }, 60);
            }
            interactUntil = now() + RESUME_DELAY;
            settle();
        }

        wrapper.addEventListener('pointerdown', function (e) {
            if (e.pointerType !== 'mouse' || e.button !== 0) return;
            dragging = true;
            moved = false;
            startX = e.clientX;
            startScroll = wrapper.scrollLeft;
            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onUp);
            document.addEventListener('pointercancel', onUp);
        });

        // a drag must not count as a click on a link
        wrapper.addEventListener('click', function (e) {
            if (suppressClick) {
                e.preventDefault();
                e.stopPropagation();
                suppressClick = false;
            }
        }, true);

        // stop the browser's native image/link dragging from hijacking our drag
        wrapper.addEventListener('dragstart', function (e) { e.preventDefault(); });

        // ---- build ----
        addSet();
        track.setAttribute('data-cloned', 'true');
        updateMetrics();

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateMetrics, 120);
        }, { passive: true });
        window.addEventListener('load', updateMetrics, { once: true });

        if (!autoplay) return;

        // only drift while the belt is on screen
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                inView = entries[0].isIntersecting;
            }, { threshold: 0 }).observe(wrapper);
        }

        var last = 0;
        function tick(ts) {
            requestAnimationFrame(tick);
            var dt = Math.min((ts - last) / 1000, 0.1);
            last = ts;

            if (!loop || !inView || document.hidden) return;

            var paused = hovering || focused || touching || dragging || now() < interactUntil;
            if (paused) {
                pos = wrapper.scrollLeft; // stay in sync with wherever the user left it
                return;
            }

            // something else moved it (scrollbar, keyboard, anchor): follow it
            if (Math.abs(wrapper.scrollLeft - lastSet) > 2) pos = wrapper.scrollLeft;

            pos = norm(pos + dir * speed * dt);
            wrapper.scrollLeft = pos;
            lastSet = wrapper.scrollLeft;
        }
        requestAnimationFrame(tick);
    }

    function initBelts() {
        filterExpiredCards();

        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.querySelectorAll('.belt-wrapper').forEach(function (wrapper) {
            if (reduceMotion) {
                // no clones, no drifting: plain manual scrolling only
                return;
            }
            setupBelt(wrapper, true);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBelts);
    } else {
        initBelts();
    }
})();