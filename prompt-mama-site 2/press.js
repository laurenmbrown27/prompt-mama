/* =========================================================
   PRESS KIT — Bio tab switching + copy-to-clipboard
   ========================================================= */

(function () {
  'use strict';

  // ---------- Bio tabs ----------
  const tabs = document.querySelectorAll('.bio-tab');
  const cards = document.querySelectorAll('.bio-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      cards.forEach((card) => {
        card.classList.toggle('hidden', card.id !== target);
      });
    });
  });

  // ---------- Copy bio to clipboard ----------
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetId = btn.dataset.copyTarget;
      const card = document.getElementById(targetId);
      if (!card) return;

      // Get plain text from all <p> tags inside the bio card
      const text = Array.from(card.querySelectorAll('p'))
        .map((p) => p.textContent.trim())
        .join('\n\n');

      try {
        await navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = '✓ Copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          btn.textContent = '✓ Copied';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copy bio';
            btn.classList.remove('copied');
          }, 2000);
        } catch (e) {
          btn.textContent = 'Copy failed — select manually';
        }
        document.body.removeChild(ta);
      }
    });
  });
})();
