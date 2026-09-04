/* ============================================================
   APSIS Business Consulting – contact.js
   Handles: AOS, navbar scroll, preloader, form submission
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── AOS ─────────────────────────────────────────────── */
    AOS.init({
        duration: 900,
        once: true,
        offset: 80,
        easing: 'ease-out-cubic',
    });

    /* ── Navbar scroll class (matches main-v2.js) ─────────── */
    const mainNav = document.getElementById('mainNav');
    if (mainNav) {
        const onScroll = () => {
            mainNav.classList.toggle('scrolled', window.scrollY > 60);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ── Preloader ───────────────────────────────────────── */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hidden');
            preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
        });
    }

    /* ── Contact Form ────────────────────────────────────── */
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        // Loading state
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending…`;

        const data = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim(),
        };

        try {
            const response = await fetch('https://apsis-backend.onrender.com/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                showAlert('✅ Thanks for reaching out — we\'ll get back to you shortly.', 'success');
                form.reset();
            } else {
                showAlert('⚠️ Message could not be sent. Please try again.', 'danger');
            }
        } catch (err) {
            console.error('Contact form error:', err);
            showAlert('❌ An error occurred. Please try again later.', 'danger');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    });

    /**
     * Render a dismissible Bootstrap alert below the form.
     * @param {string} message
     * @param {'success'|'danger'} type
     */
    function showAlert(message, type) {
        // Remove any existing alert
        const existing = form.querySelector('.contact-alert');
        if (existing) existing.remove();

        const alert = document.createElement('div');
        alert.className = `contact-alert alert alert-${type} alert-dismissible fade show mt-3`;
        alert.setAttribute('role', 'alert');
        alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

        form.appendChild(alert);

        // Auto-dismiss after 6 s
        setTimeout(() => {
            alert.classList.remove('show');
            alert.addEventListener('transitionend', () => alert.remove(), { once: true });
        }, 6000);
    }

});