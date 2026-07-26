(() => {
  const replaceText = (selector, text) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = text;
  };

  const eatHeading = document.querySelector('[data-panel="eat"] .page-heading > p');
  if (eatHeading) eatHeading.textContent = 'Filter by town, price, atmosphere, and appetite. Every card includes its general location so nearby stops are easier to plan together.';

  const plannerHeading = document.querySelector('[data-panel="planner"] .page-heading > p');
  if (plannerHeading) plannerHeading.textContent = 'Tap a day, then add saved stops to morning, afternoon, or evening. Each stop is labeled as an activity, restaurant, or shop.';

  replaceText('[data-panel="house"] .house-intro h2', 'Explore the house by area.');

  const bedCards = document.querySelectorAll('.bed-claim-card');
  const bedNotes = ['Shown in the first bedroom photo.', 'Shown in two listing photos.', 'Shown in the final bedroom photo.'];
  bedCards.forEach((card, index) => {
    const note = card.querySelector('.bed-claim-body > p');
    if (note && bedNotes[index]) note.textContent = bedNotes[index];
  });

  const syncChip = document.createElement('span');
  syncChip.className = 'sync-status';
  syncChip.setAttribute('role', 'status');
  syncChip.setAttribute('aria-live', 'polite');
  syncChip.textContent = 'Connecting…';
  document.querySelector('.app-header')?.appendChild(syncChip);

  const setStatus = connected => {
    syncChip.textContent = connected ? '✓ Shared' : 'Saved on this phone';
    syncChip.classList.toggle('connected', connected);
  };

  document.addEventListener('tc-shared-ready', () => setStatus(true));
  window.addEventListener('offline', () => setStatus(false));
  window.addEventListener('online', () => setStatus(document.documentElement.dataset.sync === 'connected'));
  setTimeout(() => setStatus(document.documentElement.dataset.sync === 'connected'), 1800);
})();