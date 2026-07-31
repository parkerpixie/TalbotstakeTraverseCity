(() => {
  const FAMILY = ['Parker', 'Blake', 'Porter', 'Mark', 'Nancy'];

  const traveler = () => {
    const stored = localStorage.getItem('tcTraveler');
    return FAMILY.includes(stored) ? stored : '';
  };

  const api = () => window.TCHeartRatings;

  function updateAdventureCard(card) {
    const placeId = card.dataset.placeId;
    if (!placeId || !api()) return;

    const name = traveler();
    const personal = name ? Number(api().get(placeId, name)) || 0 : 0;
    const stats = api().stats(placeId) || { count: 0, average: 0 };
    const familyBadge = card.querySelector('.adventure-family-rating');
    const rateButton = card.querySelector('.adventure-rate-button');

    if (familyBadge) {
      familyBadge.classList.toggle('empty', !stats.count);
      familyBadge.innerHTML = stats.count
        ? `<small>Fam rank</small><strong>${Number(stats.average).toFixed(1)}</strong><span aria-hidden="true">💖</span>`
        : '<small>Fam rank</small><strong>—</strong>';
      familyBadge.title = stats.count ? `${stats.count} family member${stats.count === 1 ? '' : 's'} rated this place` : 'No family ratings yet';
    }

    if (rateButton) {
      rateButton.classList.toggle('active', personal > 0);
      rateButton.innerHTML = personal
        ? `<small>Your rating</small><strong>${personal}/5</strong>`
        : '<span aria-hidden="true">♡</span><small>Rate it</small>';
    }
  }

  function updateFamilyTopCard(card) {
    const placeId = card.querySelector('[data-place-open]')?.dataset.placeOpen;
    if (!placeId || !api()) return;

    const name = traveler();
    const personal = name ? Number(api().get(placeId, name)) || 0 : 0;
    const stats = api().stats(placeId) || { count: 0, average: 0 };
    const score = card.querySelector('.family-top-score');
    const rateButton = card.querySelector('.family-top-rate');

    if (score) {
      score.innerHTML = stats.count
        ? `<small>Fam rank</small><strong>${Number(stats.average).toFixed(1)}</strong><span aria-hidden="true">💖</span><em>${stats.count} of 5 rated</em>`
        : '<small>Fam rank</small><strong>—</strong><em>No ratings yet</em>';
    }

    if (rateButton) {
      rateButton.classList.toggle('active', personal > 0);
      rateButton.textContent = personal ? `Your rating ${personal}/5` : 'Add my rating';
    }
  }

  function refresh() {
    if (!api()) return;
    document.querySelectorAll('.adventure-place-card[data-place-id]').forEach(updateAdventureCard);
    document.querySelectorAll('.family-top-card').forEach(updateFamilyTopCard);
  }

  const observer = new MutationObserver(() => requestAnimationFrame(refresh));
  const home = document.querySelector('[data-panel="home"]');
  if (home) observer.observe(home, { childList: true, subtree: true });

  document.addEventListener('tc-ratings-changed', refresh);
  document.addEventListener('tc-shared-ready', refresh);
  document.addEventListener('click', event => {
    if (event.target.closest('[data-explorer-name]')) window.setTimeout(refresh, 150);
  });

  window.setTimeout(refresh, 0);
})();