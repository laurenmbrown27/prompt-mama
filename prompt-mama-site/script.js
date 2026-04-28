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
})();
