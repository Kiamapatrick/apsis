/* ============================================================
   APSIS Business Consulting – contact.js
   Handles: copyright year, navbar scroll, preloader, reveal, form
   (AOS is no longer used on this page)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Dynamic copyright year ────────────────────────────── */
    document.querySelectorAll('.footer-bottom p').forEach(el => {
        el.innerHTML = el.textContent.replace(/\d{4}/, new Date().getFullYear());
    });

    /* ── Navbar scroll class (matches main-v2.js) ──────────── */
    const mainNav = document.getElementById('mainNav');
    if (mainNav) {
        const onScroll = () => mainNav.classList.toggle('scrolled', window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ── Preloader ─────────────────────────────────────────── */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hidden');
            preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
        });
    }

    /* ── Reveal: one soft fade-up, only for blocks below the fold ── */
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const blocks = document.querySelectorAll('[data-reveal]');
    if (!reduce && 'IntersectionObserver' in window && blocks.length) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        blocks.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) return;
            el.classList.add('is-armed');
            io.observe(el);
        });
    }

    /* ── Contact form ──────────────────────────────────────── */
    const form = document.getElementById('contact-form');
    const status = document.getElementById('formStatus');
    if (!form || !status) return;

    const messages = {
        name: 'Please enter your name.',
        email: 'Please enter a valid email address.',
        message: 'Please tell us how we can help.'
    };

    function setError(input, text) {
        const field = input.closest('.ct-field');
        let err = field.querySelector('.ct-error');
        if (text) {
            if (!err) {
                err = document.createElement('p');
                err.className = 'ct-error';
                err.id = input.id + '-error';
                field.appendChild(err);
            }
            err.textContent = text;
            field.classList.add('has-error');
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', err.id);
        } else {
            if (err) err.remove();
            field.classList.remove('has-error');
            input.removeAttribute('aria-invalid');
            input.removeAttribute('aria-describedby');
        }
    }

    function validate() {
        let firstBad = null;
        form.querySelectorAll('[required]').forEach(input => {
            const bad = !input.value.trim() || !input.checkValidity();
            setError(input, bad ? messages[input.name] : '');
            if (bad && !firstBad) firstBad = input;
        });
        if (firstBad) firstBad.focus();
        return !firstBad;
    }

    /* clear an error as soon as the person fixes the field */
    form.addEventListener('input', e => {
        if (e.target.closest('.has-error') && e.target.checkValidity() && e.target.value.trim()) {
            setError(e.target, '');
        }
    });

    function setStatus(text, kind) {
        status.textContent = text;
        status.className = 'ct-status' + (kind ? ' is-' + kind : '');
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();
        setStatus('', '');
        if (!validate()) return;

        const btn = form.querySelector('button[type="submit"]');
        const label = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Sending…';

        const data = Object.fromEntries(new FormData(form).entries());

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (!result.success) throw new Error(result.message || 'Submission failed');

            setStatus('Thanks for reaching out. We\'ll get back to you shortly.', 'ok');
            form.reset();
        } catch (err) {
            console.error('Contact form error:', err);
            setStatus('Something went wrong. Please call us on +254 722 670 127 instead.', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = label;
        }
    });
});