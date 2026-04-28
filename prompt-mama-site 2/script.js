/* =========================================================
   PROMPT MAMA — SCRIPT
   Scroll reveal animations + auto-updating year
   ========================================================= */

(function () {
  'use strict';

  // ---------- Auto-update year in footer ----------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---------- Scroll-triggered reveals ----------
  const supportsObserver = 'IntersectionObserver' in window;
  const reveals = document.querySelectorAll('.reveal');

  if (!supportsObserver) {
    // Fallback: just show everything
    reveals.forEach((el) => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el) => observer.observe(el));

  // ---------- Hamburger / slide-out nav ----------
  const hamburger = document.getElementById('hamburger');
  const siteNav = document.getElementById('site-nav');
  const navClose = document.getElementById('navClose');
  const navBackdrop = document.getElementById('navBackdrop');

  function openNav() {
    document.body.classList.add('nav-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    if (siteNav) siteNav.setAttribute('aria-hidden', 'false');
    if (navBackdrop) navBackdrop.hidden = false;
  }
  function closeNav() {
    document.body.classList.remove('nav-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    if (siteNav) siteNav.setAttribute('aria-hidden', 'true');
    if (navBackdrop) navBackdrop.hidden = true;
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (document.body.classList.contains('nav-open')) closeNav();
      else openNav();
    });
  }
  if (navClose) navClose.addEventListener('click', closeNav);
  if (navBackdrop) navBackdrop.addEventListener('click', closeNav);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) closeNav();
  });
})();
