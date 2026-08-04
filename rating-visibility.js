(() => {
  const FAMILY = ['Parker', 'Blake', 'Porter', 'Mark', 'Nancy'];

  const currentTraveler = () => {
    const stored = localStorage.getItem('tcTraveler') || '';
    return FAMILY.includes(stored) ? stored : '';
  };

  const getRatings = () => {
    if (window.TCHeartRatings?.all) return window.TCHeartRatings.all();
    try {
      const value = JSON.parse(localStorage.getItem('tcHeartRatings') || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  };

  const placeIdForCard = card => {
    if (card.dataset.placeId) return card.dataset.placeId;
    const saveButton = card.querySelector('[data-save]');
    if (saveButton?.dataset.save) return saveButton.dataset.save;
    const openButton = card.querySelector('[data-place-open]');
    if (openButton?.dataset.placeOpen) return openButton.dataset.placeOpen;
    return card.dataset.id || '';
  };

  const refreshCard = (card, ratings, traveler) => {
    const placeId = placeIdForCard(card);
    const score = placeId && traveler ? Number(ratings?.[placeId]?.[traveler]) || 0 : 0;
    card.classList.toggle('rated-by-current-traveler', score > 0);

    if (score > 0) card.dataset.currentRating = String(score);
    else delete card.dataset.currentRating;
  };

  const refresh = () => {
    const traveler = currentTraveler();
    const ratings = getRatings();
    document.querySelectorAll('.place-card, .adventure-place-card, .family-top-card').forEach(card => {
      refreshCard(card, ratings, traveler);
    });
  };

  let queued = false;
  const queueRefresh = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      refresh();
    });
  };

  const observer = new MutationObserver(queueRefresh);
  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('tc-ratings-changed', queueRefresh);
  document.addEventListener('tc-shared-ready', queueRefresh);
  document.addEventListener('click', event => {
    if (event.target.closest('[data-heart-score], [data-explorer-name], [data-save], [data-dashboard-rate]')) {
      window.setTimeout(queueRefresh, 100);
    }
  });
  window.addEventListener('storage', queueRefresh);

  queueRefresh();
})();
