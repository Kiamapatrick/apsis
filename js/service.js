/* ============================================================
   APSIS — service.js
   Shared script for individual service detail pages
   (VAT registration, KRA audit support, eTIMS, etc.)
   ============================================================ */

(function () {
    "use strict";

    /* ── Hamburger / Mobile nav ─────────────────────────────── */
    const hamburger   = document.getElementById("hamburger-btn");
    const mobileNav   = document.getElementById("mobile-nav");
    const navOverlay  = document.getElementById("nav-overlay");
    const mobileClose = document.getElementById("mobile-nav-close");

    function openNav() {
        if (!mobileNav) return;
        mobileNav.classList.add("open");
        if (navOverlay) {
            navOverlay.style.display = "block";
            requestAnimationFrame(() => navOverlay.classList.add("visible"));
        }
        if (hamburger) {
            hamburger.classList.add("open");
            hamburger.setAttribute("aria-expanded", "true");
        }
        document.body.style.overflow = "hidden";
    }

    function closeNav() {
        if (!mobileNav) return;
        mobileNav.classList.remove("open");
        if (navOverlay) {
            navOverlay.classList.remove("visible");
            setTimeout(() => { navOverlay.style.display = "none"; }, 320);
        }
        if (hamburger) {
            hamburger.classList.remove("open");
            hamburger.setAttribute("aria-expanded", "false");
        }
        document.body.style.overflow = "";
    }

    if (hamburger)   hamburger.addEventListener("click", openNav);
    if (mobileClose) mobileClose.addEventListener("click", closeNav);
    if (navOverlay)  navOverlay.addEventListener("click", closeNav);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeNav();
    });

    /* ── Reading progress bar ───────────────────────────────── */
    const progressBar = document.getElementById("reading-progress");

    function updateProgress() {
        if (!progressBar) return;
        const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled   = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        progressBar.style.width = scrolled + "%";
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    /* ── Fade-in scroll reveal (.fade-in elements) ──────────── */
    const fadeEls = document.querySelectorAll(".fade-in");

    if ("IntersectionObserver" in window) {
        const fadeObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        fadeObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
        );

        fadeEls.forEach((el) => fadeObserver.observe(el));
    } else {
        // Fallback for older browsers — just show everything
        fadeEls.forEach((el) => el.classList.add("visible"));
    }

    /* ── TOC active link on scroll ──────────────────────────── */
    const tocLinks    = document.querySelectorAll(".article-toc__list a");
    const headings    = document.querySelectorAll(".article-body h2[id]");
    const siteHeader  = document.querySelector(".site-header");

    function getHeaderOffset() {
        return siteHeader ? siteHeader.offsetHeight + 24 : 90;
    }

    function updateTOC() {
        if (!tocLinks.length || !headings.length) return;
        const scrollY  = window.scrollY + getHeaderOffset() + 10;
        let   current  = "";

        headings.forEach((h) => {
            if (h.offsetTop <= scrollY) current = h.id;
        });

        tocLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateTOC, { passive: true });
    updateTOC();

    /* ── FAQ accordion ──────────────────────────────────────── */
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const btn    = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");
        if (!btn || !answer) return;

        btn.addEventListener("click", () => {
            const isOpen = item.classList.contains("open");

            // Close all others
            faqItems.forEach((other) => {
                if (other !== item) {
                    other.classList.remove("open");
                    const otherBtn    = other.querySelector(".faq-question");
                    const otherAnswer = other.querySelector(".faq-answer");
                    if (otherBtn)    otherBtn.setAttribute("aria-expanded", "false");
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                }
            });

            // Toggle current
            item.classList.toggle("open", !isOpen);
            btn.setAttribute("aria-expanded", String(!isOpen));
            answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
        });
    });

    /* ── Smooth scroll for in-page anchors ──────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const id = anchor.getAttribute("href");
            if (id === "#") return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = getHeaderOffset();
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - offset,
                behavior: "smooth",
            });
        });
    });

    /* ── Contact form (Web3Forms integration) ────────────────── */
    const form        = document.getElementById("service-contact-form");
    const formSuccess = form && form.querySelector(".form-success");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name  = form.querySelector('[name="name"]');
            const phone = form.querySelector('[name="phone"]');

            if (name  && !name.value.trim())  { name.focus();  return; }
            if (phone && !phone.value.trim()) { phone.focus(); return; }

            const btn = form.querySelector('.btn-submit');
            const originalHTML = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending…';

            // Remove any existing error alert
            const existingError = form.querySelector('.form-error');
            if (existingError) existingError.remove();

            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (result.success) {
                    form.style.display = "none";
                    if (formSuccess) {
                        formSuccess.style.display = "block";
                    }
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (err) {
                console.error('Service form error:', err);
                btn.disabled = false;
                btn.innerHTML = originalHTML;

                // Show error message
                let errorAlert = form.querySelector('.form-error');
                if (!errorAlert) {
                    errorAlert = document.createElement('div');
                    errorAlert.className = 'form-error alert alert-danger mt-3';
                    form.appendChild(errorAlert);
                }
                errorAlert.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i>Something went wrong, please try calling us at +254 722 670 127 instead';
                errorAlert.style.display = 'block';
                setTimeout(() => { errorAlert.style.display = 'none'; }, 8000);
            }
        });
    }

})();
