/**
 * APSIS — blog.js
 * Shared across blog1.html → blog4.html
 * ─────────────────────────────────────
 * 1. Scroll fade-in (IntersectionObserver)
 * 2. Sticky header shadow on scroll
 * 3. Smooth reading-progress bar
 * 4. Mobile hamburger menu
 */
(function () {
  'use strict';

  /* ── 1. Scroll Fade-In ────────────────────────────────── */
  function initFadeIn() {
    var els = document.querySelectorAll('.fade-in');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.07 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ── 2. Sticky Header Shadow ──────────────────────────── */
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 20px rgba(30,58,86,0.13)'
        : '0 2px 12px rgba(30,58,86,0.06)';
    }, { passive: true });
  }

  /* ── 3. Reading Progress Bar ──────────────────────────── */
  function initProgressBar() {
    var bar = document.getElementById('reading-progress');
    if (!bar) return;
    var article = document.querySelector('.article-wrap');
    if (!article) return;

    window.addEventListener('scroll', function () {
      var rect     = article.getBoundingClientRect();
      var total    = article.offsetHeight - window.innerHeight;
      var scrolled = -rect.top;
      var pct = total > 0 ? Math.min(Math.max(scrolled / total, 0), 1) : 0;
      bar.style.width = (pct * 100) + '%';
    }, { passive: true });
  }

  /* ── 4. Mobile Hamburger Menu ─────────────────────────── */
  function initHamburger() {
    var btn      = document.getElementById('hamburger-btn');
    var overlay  = document.getElementById('nav-overlay');
    var drawer   = document.getElementById('mobile-nav');
    var closeBtn = document.getElementById('mobile-nav-close');
    if (!btn || !overlay || !drawer) return;

    function openMenu() {
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      overlay.style.display = 'block';
      drawer.classList.add('open');
      setTimeout(function () { overlay.classList.add('visible'); }, 10);
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('visible');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(function () {
        if (!drawer.classList.contains('open')) overlay.style.display = 'none';
      }, 320);
    }

    btn.addEventListener('click', function () {
      btn.classList.contains('open') ? closeMenu() : openMenu();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ── 5. Sticky TOC Highlighting ───────────────────────── */
  function initStickyTOC() {
    var tocLinks = document.querySelectorAll('.article-toc__list a');
    var headings = Array.from(tocLinks).map(function(link) {
      var id = link.getAttribute('href');
      return id ? document.querySelector(id) : null;
    }).filter(function(h) { return h !== null; });

    if (tocLinks.length === 0 || headings.length === 0) return;

    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = '#' + entry.target.getAttribute('id');
          tocLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-10% 0px -80% 0px', threshold: 0 });

    headings.forEach(function(h) { obs.observe(h); });
  }

  /* ── 6. Penalty Estimator ─────────────────────────────── */
  function initPenaltyEstimator() {
    var btn = document.getElementById('btn-calc-penalty');
    var resultBox = document.getElementById('penalty-result');
    var amountVal = document.getElementById('penalty-amount-val');
    var taxType = document.getElementById('tax-type');

    if (!btn || !resultBox || !amountVal || !taxType) return;

    btn.addEventListener('click', function() {
      var type = taxType.value;
      var penalty = 10000;

      if (type === 'income') penalty = 20000;
      else if (type === 'turnover') penalty = 1000;
      else penalty = 10000;

      var formatted = new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(penalty);

      amountVal.textContent = formatted;
      resultBox.classList.add('active');
    });
  }

  /* ── Init ─────────────────────────────────────────────── */
  function init() {
    initFadeIn();
    initStickyHeader();
    initProgressBar();
    initHamburger();
    initStickyTOC();
    initPenaltyEstimator();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
