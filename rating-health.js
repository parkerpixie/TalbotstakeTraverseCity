(() => {
  const FAMILY = ['Parker', 'Blake', 'Porter', 'Mark', 'Nancy'];
  const CURRENT_KEY = 'tcHeartRatings';
  const BACKUP_KEY = 'tcHeartRatingsSafetyBackup';

  const parse = key => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  };

  const countPerson = (state, person) => Object.values(state || {}).reduce((count, people) => {
    const score = Number(people?.[person]);
    return count + (Number.isInteger(score) && score >= 1 && score <= 5 ? 1 : 0);
  }, 0);

  const mergedState = () => {
    try {
      return window.TCHeartRatings?.all?.() || {};
    } catch {
      return {};
    }
  };

  function ensureCard() {
    const shell = document.querySelector('[data-panel="rate"] .rating-queue-shell');
    if (!shell) return null;
    let card = shell.querySelector('#familyRatingHealth');
    if (card) return card;
    card = document.createElement('section');
    card.id = 'familyRatingHealth';
    card.className = 'rating-progress-card';
    const intro = shell.querySelector('.rating-queue-intro');
    if (intro) intro.insertAdjacentElement('afterend', card);
    else shell.prepend(card);
    return card;
  }

  function render() {
    const card = ensureCard();
    if (!card || !window.TCHeartRatings) return;

    const current = parse(CURRENT_KEY);
    const backup = parse(BACKUP_KEY);
    const merged = mergedState();

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;margin-bottom:10px;">
        <div>
          <strong style="display:block;">Family Rating Health</strong>
          <small style="display:block;margin-top:3px;">Read-only check. This panel does not change, restore, or delete ratings.</small>
        </div>
        <span style="font-size:.72rem;font-weight:800;letter-spacing:.04em;padding:5px 8px;border-radius:999px;background:#eef7ef;">SYNC PROTECTION ON</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
        ${FAMILY.map(person => {
          const mergedCount = countPerson(merged, person);
          const localCount = countPerson(current, person);
          const backupCount = countPerson(backup, person);
          return `<div style="padding:9px 10px;border:1px solid rgba(0,0,0,.08);border-radius:10px;background:rgba(255,255,255,.72);">
            <strong style="display:block;">${person}</strong>
            <span style="display:block;margin-top:4px;font-size:1rem;font-weight:900;">${mergedCount} current</span>
            <small style="display:block;margin-top:2px;">device ${localCount} · backup ${backupCount}</small>
          </div>`;
        }).join('')}
      </div>`;
  }

  document.addEventListener('tc-ratings-changed', () => setTimeout(render, 0));
  document.addEventListener('tc-shared-ready', () => setTimeout(render, 0));
  document.addEventListener('click', event => {
    if (event.target.closest('[data-open-all-rating-queue], [data-all-rating-person], [data-tab="home"]')) {
      setTimeout(render, 200);
    }
  });

  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    render();
    if ((document.getElementById('familyRatingHealth') && window.TCHeartRatings) || tries > 120) clearInterval(timer);
  }, 100);
})();