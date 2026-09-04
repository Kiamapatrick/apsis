/**
 * APSIS BLOGS & INSIGHTS — main.js
 * ──────────────────────────────────────────────────────────
 * Handles:
 *  1. Category filter pill toggling + card filtering
 *  2. Scroll-triggered fade-in via IntersectionObserver
 *  3. Sticky header shadow
 *  4. Mobile hamburger menu
 * ──────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────
     0. DYNAMIC COPYRIGHT YEAR
     ────────────────────────────────────────────────────── */
  function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('#copyright-year, .footer-copy, .hub-footer-copy, .footer-bottom p');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
      const text = el.textContent.trim();
      if (text.includes('202') || text.includes('©') || text === '') {
        if (el.id === 'copyright-year') {
          el.textContent = currentYear;
        } else if (text.includes('202')) {
          el.innerHTML = text.replace(/\d{4}/, currentYear);
        }
      }
    });
  }
  updateCopyrightYear();

  /* ──────────────────────────────────────────────────────
     1. CATEGORY FILTER INTERACTION
     ────────────────────────────────────────────────────── */
  var filterPills = document.querySelectorAll('.filter-pill');
  var blogCards   = document.querySelectorAll('.blog-card');

  var CATEGORY_MAP = {
    'all':            null,
    'tax-advisory':   'Tax Advisory',
    'compliance':     'Compliance',
    'business-setup': 'Business Setup',
    'accounting':     'Accounting',
  };

  function filterCards(activeFilter) {
    var targetCategory = CATEGORY_MAP[activeFilter];
    blogCards.forEach(function (card) {
      var cardCategory = card.getAttribute('data-category') || '';
      if (!targetCategory || cardCategory === targetCategory) {
        card.style.display = '';
        card.classList.remove('visible');
        void card.offsetWidth;
        card.classList.add('visible');
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      filterPills.forEach(function (p) {
        p.classList.remove('active');
        p.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-pressed', 'true');
      filterCards(pill.getAttribute('data-filter') || 'all');
    });

    pill.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pill.click(); }
    });
  });

  /* ──────────────────────────────────────────────────────
     2. SCROLL-TRIGGERED FADE-IN
     ────────────────────────────────────────────────────── */
  function initFadeIn() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-in').forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
    document.querySelectorAll('.fade-in').forEach(function (el) { obs.observe(el); });
  }

  /* ──────────────────────────────────────────────────────
     3. STICKY HEADER SHADOW
     ────────────────────────────────────────────────────── */
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 20px rgba(30,58,86,0.12)'
        : '0 2px 12px rgba(30,58,86,0.06)';
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────────────
     4. MOBILE HAMBURGER MENU
     ────────────────────────────────────────────────────── */
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

  /* ──────────────────────────────────────────────────────
     5. INIT
     ────────────────────────────────────────────────────── */
  function init() {
    initFadeIn();
    initStickyHeader();
    initHamburger();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
