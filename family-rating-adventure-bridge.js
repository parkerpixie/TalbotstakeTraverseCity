(() => {
  const QUEUE_PEOPLE = ['Mark', 'Nancy'];

  function currentTraveler() {
    const stored = localStorage.getItem('tcTraveler');
    if (QUEUE_PEOPLE.includes(stored)) return stored;
    if (typeof selectedTraveler !== 'undefined' && QUEUE_PEOPLE.includes(selectedTraveler)) return selectedTraveler;
    return '';
  }

  function enhanceAdventureQueueLink() {
    const person = currentTraveler();
    if (!person) return;

    const button = document.querySelector('[data-panel="home"] .adventure-next-step');
    if (!button) return;

    const remaining = window.TCFamilyRatingQueue?.remaining(person);
    button.removeAttribute('data-open-mode');
    button.dataset.openRatingQueue = person;

    const title = button.querySelector('.adventure-signal-copy > strong');
    const detail = button.querySelector('.adventure-signal-copy > span');
    if (title) title.textContent = remaining ? `Finish ${person}'s rating queue` : `${person}'s ratings are complete`;
    if (detail) detail.textContent = remaining
      ? `${remaining} unrated places left. Each card disappears as you rate it.`
      : 'Every restaurant, shop, and activity has a heart score.';
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-open-rating-queue]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    window.TCFamilyRatingQueue?.open(button.dataset.openRatingQueue);
  }, true);

  const home = document.querySelector('[data-panel="home"]');
  if (home) {
    new MutationObserver(() => requestAnimationFrame(enhanceAdventureQueueLink))
      .observe(home, { childList: true, subtree: true });
  }

  ['tc-ratings-changed', 'tc-shared-ready', 'tc-places-ready'].forEach(name => {
    document.addEventListener(name, () => window.setTimeout(enhanceAdventureQueueLink, 100));
  });

  document.addEventListener('click', event => {
    if (event.target.closest('[data-explorer-name], #profilePill, .bottom-nav [data-tab="home"]')) {
      window.setTimeout(enhanceAdventureQueueLink, 220);
    }
  });

  window.setTimeout(enhanceAdventureQueueLink, 250);
})();