/* ============================================================
   APSIS Business Consulting – services.js
   Handles: service card filtering, scroll animations,
   navbar scroll state, preloader, and misc UX polish.
   ============================================================ */

(function () {
    "use strict";

    /* ── Preloader ─────────────────────────────────────────── */
    const preloader = document.getElementById("preloader");

    function hidePreloader() {
        if (preloader) {
            preloader.classList.add("hidden");
            setTimeout(() => preloader.remove(), 700);
        }
    }

    if (document.readyState === "complete") {
        hidePreloader();
    } else {
        window.addEventListener("load", hidePreloader);
        // Fallback: hide after 3 s even if load never fires
        setTimeout(hidePreloader, 3000);
    }

    /* ── Navbar scroll state ───────────────────────────────── */
    const mainNav = document.getElementById("mainNav");

    function onNavScroll() {
        if (!mainNav) return;
        mainNav.classList.toggle("scrolled", window.scrollY > 60);
    }

    window.addEventListener("scroll", onNavScroll, { passive: true });
    onNavScroll(); // apply immediately in case page is pre-scrolled

    /* ── Service-card filter ───────────────────────────────── */
    const filterBtns = document.querySelectorAll(".svc-filter-btn");
    const svcCards = document.querySelectorAll(".svc-card");

    /**
     * Show/hide cards with a lightweight fade transition.
     * Cards that don't match gain `svc-hidden` (display:none in CSS)
     * after the fade-out; matching cards are shown before the fade-in.
     */
    function filterCards(filter) {
        svcCards.forEach((card) => {
            const cat = card.dataset.category || "all";
            const show = filter === "all" || cat === filter;

            if (show) {
                card.classList.remove("svc-hidden");
                // Tiny delay so the browser registers the display change first
                requestAnimationFrame(() => {
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                });
            } else {
                card.style.opacity = "0";
                card.style.transform = "translateY(12px)";
                // Hide after the CSS transition finishes (350 ms matches --transition)
                setTimeout(() => card.classList.add("svc-hidden"), 360);
            }
        });
    }

    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Update active button
            filterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            filterCards(btn.dataset.filter || "all");
        });
    });

    // Seed inline styles so the transition works from the start
    svcCards.forEach((card) => {
        card.style.transition = "opacity 0.35s ease, transform 0.35s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
    });

    /* ── Intersection Observer – scroll-reveal ─────────────── */
    /**
     * Adds a fade-up reveal to major section elements when they
     * enter the viewport. Works on cards, pillars, values, etc.
     */
    const REVEAL_SELECTOR = [
        ".svc-card",
        ".value-card",
        ".pillar-card",
        ".client-card",
        ".comp-pillar",
        ".section-header",
    ].join(", ");

    const revealElements = document.querySelectorAll(REVEAL_SELECTOR);

    // Initial hidden state (only if JS is running)
    revealElements.forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";
        el.style.transition = `opacity 0.55s ease ${(i % 8) * 60}ms, transform 0.55s ease ${(i % 8) * 60}ms`;
    });

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                    revealObserver.unobserve(el); // animate only once
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    /* ── Competency pillars stagger ────────────────────────── */
    // Extra stagger for the competency pill grid
    document.querySelectorAll(".comp-pillar").forEach((pill, i) => {
        pill.style.transitionDelay = `${i * 80}ms`;
    });

    /* ── Smooth-scroll for in-page anchor links ────────────── */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const target = document.querySelector(anchor.getAttribute("href"));
            if (!target) return;
            e.preventDefault();
            const offset = mainNav ? mainNav.offsetHeight + 16 : 80;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - offset,
                behavior: "smooth",
            });
        });
    });

    /* ── Service card tilt (subtle, desktop only) ──────────── */
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        svcCards.forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);  // -1 … 1
                const dy = (e.clientY - cy) / (rect.height / 2);  // -1 … 1
                const tiltX = -dy * 5;   // max ±5 °
                const tiltY = dx * 5;

                card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
                card.style.transition = "transform 0.1s ease";
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
                card.style.transition = "transform 0.45s ease, opacity 0.35s ease, box-shadow 0.35s ease";
            });
        });
    }

    /* ── Active nav link highlight ─────────────────────────── */
    // Mark the "Our Services" link active (already set via class in HTML,
    // but re-apply in case another script clears it).
    const servicesLink = document.querySelector('.nav-link[href="services.html"]');
    if (servicesLink) servicesLink.classList.add("active");

    /* ── Section-tag counter animation ────────────────────── */
    // Animates numbers like "11 services" if you add a [data-count] attribute.
    // Harmless no-op if no such elements exist.
    function animateCount(el) {
        const target = parseInt(el.dataset.count, 10);
        const duration = 1200;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    const countEls = document.querySelectorAll("[data-count]");
    if (countEls.length) {
        const countObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        countObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.6 }
        );
        countEls.forEach((el) => countObserver.observe(el));
    }

})();