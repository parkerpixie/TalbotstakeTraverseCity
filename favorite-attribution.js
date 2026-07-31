(() => {
  const FAMILY = ['Parker', 'Blake', 'Porter', 'Mark', 'Nancy'];
  const STORAGE_KEY = 'tcHeartRatings';
  const SHARED_KEY = 'heart_ratings';
  const LEGEND = {
    5: { title: 'I WILL RIOT.', detail: 'This is a must-do.' },
    4: { title: 'Pretty Please?', detail: 'I really want this.' },
    3: { title: 'Looks Fun!', detail: 'I am genuinely interested.' },
    2: { title: 'I’m Along for the Ride.', detail: 'I am okay with it.' },
    1: { title: 'You Kids Have Fun.', detail: 'Probably not for me. Splitting up is fine.' }
  };

  let ratings = loadRatings();
  let activePlaceId = '';

  function normalize(value) {
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const clean = {};
    Object.entries(source).forEach(([placeId, people]) => {
      if (!people || typeof people !== 'object' || Array.isArray(people)) return;
      const normalizedPeople = {};
      FAMILY.forEach((name) => {
        const score = Number(people[name]);
        if (Number.isInteger(score) && score >= 1 && score <= 5) normalizedPeople[name] = score;
      });
      if (Object.keys(normalizedPeople).length) clean[placeId] = normalizedPeople;
    });
    return clean;
  }

  function loadRatings() {
    try { return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); }
    catch { return {}; }
  }

  function currentTraveler() {
    if (typeof selectedTraveler !== 'undefined' && FAMILY.includes(selectedTraveler)) return selectedTraveler;
    const stored = localStorage.getItem('tcTraveler');
    return FAMILY.includes(stored) ? stored : '';
  }

  function allPlaceRecords() {
    return typeof allPlaces !== 'undefined' && Array.isArray(allPlaces) ? allPlaces : [];
  }

  function placeFor(id) {
    return allPlaceRecords().find((place) => place.id === id);
  }

  function ratingFor(id, name = currentTraveler()) {
    return Number(ratings[id]?.[name]) || 0;
  }

  function statsFor(id) {
    const entries = FAMILY
      .map((name) => ({ name, rating: Number(ratings[id]?.[name]) || 0 }))
      .filter((entry) => entry.rating > 0);
    const total = entries.reduce((sum, entry) => sum + entry.rating, 0);
    return {
      entries,
      count: entries.length,
      total,
      average: entries.length ? total / entries.length : 0
    };
  }

  function hearts(score, empty = true) {
    const rounded = Math.max(0, Math.min(5, Math.round(Number(score) || 0)));
    return Array.from({ length: 5 }, (_, index) => index < rounded ? '♥' : empty ? '♡' : '').join('');
  }

  function legendLabel(score) {
    return LEGEND[score]?.title || 'Rate this place';
  }

  function migrateOldSaves() {
    if (localStorage.getItem('tcHeartRatingsMigrated') === 'yes' || Object.keys(ratings).length) return;
    let owners = {};
    try { owners = JSON.parse(localStorage.getItem('tcFavoriteOwners') || '{}') || {}; }
    catch { owners = {}; }

    Object.entries(owners).forEach(([placeId, names]) => {
      if (!Array.isArray(names)) return;
      names.filter((name) => FAMILY.includes(name)).forEach((name) => {
        ratings[placeId] ||= {};
        ratings[placeId][name] = 4;
      });
    });

    if (!Object.keys(ratings).length) {
      let oldFavorites = [];
      try { oldFavorites = JSON.parse(localStorage.getItem('tcFavoritesV3') || '[]'); }
      catch { oldFavorites = []; }
      const traveler = currentTraveler();
      if (traveler) oldFavorites.forEach((placeId) => { ratings[placeId] = { [traveler]: 4 }; });
    }

    localStorage.setItem('tcHeartRatingsMigrated', 'yes');
    persistLocal();
  }

  function persistLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
  }

  function shortlistIds() {
    return Object.entries(ratings)
      .filter(([, people]) => Object.values(people).some((score) => Number(score) >= 3))
      .map(([placeId]) => placeId);
  }

  function syncLegacyShortlist() {
    const ids = shortlistIds();
    if (typeof favorites !== 'undefined') favorites = ids;
    localStorage.setItem('tcFavoritesV3', JSON.stringify(ids));
    window.TCShared?.write('favorites', ids).catch((error) => console.warn('Shortlist stored locally only:', error?.message));
  }

  async function persist() {
    persistLocal();
    syncLegacyShortlist();
    try { await window.TCShared?.write(SHARED_KEY, ratings); }
    catch (error) { console.warn('Heart ratings stored on this device only:', error?.message); }
  }

  function renderPlannerSafe() {
    try {
      if (typeof renderRestaurants === 'function') renderRestaurants();
      if (typeof renderShops === 'function') renderShops();
      if (typeof renderActivities === 'function') renderActivities();
      if (typeof renderPlanner === 'function') renderPlanner();
      if (typeof updateStats === 'function') updateStats();
    } catch (error) {
      console.warn('Some trip views will refresh on the next visit:', error?.message);
    }
  }

  function ensureDialog() {
    let dialog = document.getElementById('heartRatingDialog');
    if (dialog) return dialog;

    dialog = document.createElement('dialog');
    dialog.id = 'heartRatingDialog';
    dialog.className = 'heart-rating-dialog';
    dialog.innerHTML = `
      <button class="dialog-close heart-rating-close" type="button" aria-label="Close rating guide">×</button>
      <p class="eyebrow dark">The family heart scale</p>
      <h2 id="heartRatingTitle">Rate this place</h2>
      <p class="heart-rating-for" id="heartRatingFor"></p>
      <div class="heart-rating-options" id="heartRatingOptions"></div>
      <button class="heart-rating-clear" id="heartRatingClear" type="button">Clear my rating</button>`;
    document.body.appendChild(dialog);

    dialog.querySelector('.heart-rating-close')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.querySelector('#heartRatingClear')?.addEventListener('click', () => saveRating(activePlaceId, 0));
    return dialog;
  }

  function openRating(id) {
    const traveler = currentTraveler();
    if (!traveler) {
      if (typeof showToast === 'function') showToast('Choose your traveler first so the app knows whose rating this is.');
      document.getElementById('travelerDialog')?.showModal();
      return;
    }

    activePlaceId = id;
    const place = placeFor(id);
    const dialog = ensureDialog();
    const current = ratingFor(id, traveler);
    dialog.querySelector('#heartRatingTitle').textContent = place?.name || 'Rate this place';
    dialog.querySelector('#heartRatingFor').textContent = `${traveler}, choose the line that feels most true.`;
    dialog.querySelector('#heartRatingOptions').innerHTML = [5, 4, 3, 2, 1].map((score) => `
      <button type="button" class="heart-rating-option ${current === score ? 'selected' : ''}" data-heart-score="${score}">
        <span class="heart-rating-hearts" aria-hidden="true">${hearts(score)}</span>
        <span><strong>${score}. ${LEGEND[score].title}</strong><small>${LEGEND[score].detail}</small></span>
      </button>`).join('');
    dialog.querySelectorAll('[data-heart-score]').forEach((button) => {
      button.addEventListener('click', () => saveRating(id, Number(button.dataset.heartScore)));
    });
    dialog.querySelector('#heartRatingClear').hidden = !current;
    if (!dialog.open) dialog.showModal();
  }

  async function saveRating(id, score) {
    const traveler = currentTraveler();
    if (!traveler || !id) return;

    if (score >= 1 && score <= 5) {
      ratings[id] ||= {};
      ratings[id][traveler] = score;
    } else if (ratings[id]) {
      delete ratings[id][traveler];
      if (!Object.keys(ratings[id]).length) delete ratings[id];
    }

    await persist();
    ensureDialog().close();
    renderPlannerSafe();
    refreshRatings();
    document.dispatchEvent(new CustomEvent('tc-ratings-changed', { detail: { placeId: id, traveler, score } }));
    if (typeof showToast === 'function') {
      showToast(score ? `${traveler} rated it ${score} heart${score === 1 ? '' : 's'}: ${legendLabel(score)}` : `${traveler}'s rating was cleared.`);
    }
  }

  function summaryMarkup(id) {
    const stats = statsFor(id);
    if (!stats.count) return '<span class="family-rating-empty">No family ratings yet</span>';
    const names = stats.entries.map((entry) => `${entry.name}: ${entry.rating}`).join(' · ');
    return `<span class="family-rating-average" title="${names}"><strong>${stats.average.toFixed(1)}</strong> ${hearts(stats.average)} <small>${stats.count} rated</small></span>`;
  }

  function refreshPlaceCards() {
    const traveler = currentTraveler();
    document.querySelectorAll('[data-save]').forEach((button) => {
      const id = button.dataset.save;
      const score = ratingFor(id, traveler);
      button.classList.toggle('active', score > 0);
      button.classList.add('heart-rating-trigger');
      button.innerHTML = score
        ? `<span>${hearts(score)}</span><small>${score}. ${legendLabel(score)}</small>`
        : '<span>♡♡♡♡♡</span><small>Rate 1–5 hearts</small>';
      button.setAttribute('aria-label', score ? `Change your ${score}-heart rating` : 'Rate this place from one to five hearts');

      const card = button.closest('.place-card');
      if (!card) return;
      card.querySelector('.saved-by-label')?.remove();
      let summary = card.querySelector('.family-rating-summary');
      if (!summary) {
        summary = document.createElement('div');
        summary.className = 'family-rating-summary';
        card.querySelector('.card-actions')?.before(summary);
      }
      summary.innerHTML = summaryMarkup(id);
    });
  }

  function refreshPlannerCards() {
    document.querySelectorAll('.planner-card[data-id]').forEach((card) => {
      const id = card.dataset.id;
      let label = card.querySelector('.planner-saved-by');
      if (!label) {
        label = document.createElement('small');
        label.className = 'planner-saved-by';
        card.querySelector('div')?.appendChild(label);
      }
      const stats = statsFor(id);
      label.textContent = stats.count ? `Family rating ${stats.average.toFixed(1)} / 5 from ${stats.count}` : 'Not rated yet';
    });
  }

  function refreshRatings() {
    refreshPlaceCards();
    refreshPlannerCards();
  }

  migrateOldSaves();
  syncLegacyShortlist();
  ensureDialog();

  window.TCHeartRatings = {
    open: openRating,
    get: ratingFor,
    stats: statsFor,
    all: () => JSON.parse(JSON.stringify(ratings)),
    legend: LEGEND,
    hearts,
    label: legendLabel,
    family: FAMILY.slice()
  };

  toggleFavorite = (id) => openRating(id);

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-save], [data-dashboard-rate]');
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openRating(target.dataset.save || target.dataset.dashboardRate);
  }, true);

  const observer = new MutationObserver(() => requestAnimationFrame(refreshRatings));
  ['restaurantGrid', 'shopGrid', 'activityGrid', 'plannerIdeas'].forEach((id) => {
    const node = document.getElementById(id);
    if (node) observer.observe(node, { childList: true, subtree: true });
  });

  window.TCShared?.subscribe(SHARED_KEY, (value) => {
    ratings = normalize(value);
    persistLocal();
    syncLegacyShortlist();
    refreshRatings();
    document.dispatchEvent(new CustomEvent('tc-ratings-changed'));
  });

  document.addEventListener('tc-shared-ready', async () => {
    try {
      const shared = await window.TCShared?.read(SHARED_KEY);
      if (shared && typeof shared === 'object' && Object.keys(shared).length) {
        ratings = normalize(shared);
        persistLocal();
      } else if (Object.keys(ratings).length) {
        await window.TCShared?.write(SHARED_KEY, ratings);
      }
      syncLegacyShortlist();
      refreshRatings();
      document.dispatchEvent(new CustomEvent('tc-ratings-changed'));
    } catch (error) {
      console.warn('Heart ratings are using this device only:', error?.message);
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-explorer-name]')) window.setTimeout(refreshRatings, 150);
  });

  refreshRatings();
})();
