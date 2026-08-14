(() => {
  const PEOPLE = ['Parker', 'Blake', 'Porter', 'Mark', 'Nancy'];
  const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'restaurant', label: '🍴 Restaurants' },
    { id: 'shop', label: '🛍️ Shops' },
    { id: 'activity', label: '🧭 Things to do' }
  ];

  let activePerson = PEOPLE.includes(localStorage.getItem('tcTraveler'))
    ? localStorage.getItem('tcTraveler')
    : 'Parker';
  let activeFilter = 'all';
  let homeObserver = null;

  function places() {
    return typeof allPlaces !== 'undefined' && Array.isArray(allPlaces) ? allPlaces : [];
  }

  function ratingsApi() {
    return window.TCHeartRatings || null;
  }

  function ratingFor(placeId, person = activePerson) {
    return Number(ratingsApi()?.get(placeId, person)) || 0;
  }

  function remainingFor(person) {
    return places().filter(place => !ratingFor(place.id, person));
  }

  function kindLabel(place) {
    if (place.kind === 'restaurant') return 'Restaurant';
    if (place.kind === 'shop') return 'Shop';
    return 'Explore';
  }

  function siteLabel(place) {
    if (place.kind === 'restaurant') return 'Menu / site ↗';
    if (place.kind === 'shop') return 'Store site ↗';
    return 'Official info ↗';
  }

  function mapUrl(place) {
    const query = encodeURIComponent(`${place.name} ${place.town || place.area || 'Traverse City'} Michigan`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  function familyStatus(placeId) {
    const stats = ratingsApi()?.stats?.(placeId);
    if (!stats?.count) return 'Nobody else has rated this one yet.';
    const people = stats.entries.map(entry => `${entry.name} ${entry.rating}♥`).join(' · ');
    return `Family so far: ${people}`;
  }

  function ensurePanel() {
    let panel = document.querySelector('[data-panel="rate"]');
    if (!panel) {
      panel = document.createElement('section');
      panel.className = 'tab-panel';
      panel.dataset.panel = 'rate';
      document.querySelector('.tab-stage')?.appendChild(panel);
    }

    if (panel.dataset.allFamilyQueue === 'true') return panel;
    panel.dataset.allFamilyQueue = 'true';
    panel.innerHTML = `
      <div class="rating-queue-shell">
        <button type="button" class="rating-queue-back" id="allRatingQueueBack">← Back to Adventure</button>
        <div class="rating-queue-intro">
          <div>
            <p class="eyebrow dark">Your unfinished ratings</p>
            <h2>These are the ONLY places you still need to rate.</h2>
            <div style="display:inline-flex;align-items:center;gap:7px;margin-top:8px;padding:7px 11px;border-radius:999px;background:#b20f18;color:#fff;font-size:.72rem;font-weight:900;letter-spacing:.06em;">UNRATED ONLY</div>
          </div>
          <p>Rated cards never appear here. As soon as you give a place 1–5 hearts, that card disappears from this queue.</p>
        </div>
        <div class="rating-person-tabs" id="allRatingPersonTabs"></div>
        <div class="rating-progress-card">
          <div class="rating-progress-top"><strong id="allRatingProgressTitle"></strong><span id="allRatingProgressCount"></span></div>
          <div class="rating-progress-track" aria-hidden="true"><div class="rating-progress-fill" id="allRatingProgressFill"></div></div>
        </div>
        <div class="rating-filter-row" id="allRatingFilterRow"></div>
        <div class="rating-queue-grid" id="allRatingQueueGrid" aria-live="polite"></div>
      </div>`;

    panel.querySelector('#allRatingQueueBack')?.addEventListener('click', () => {
      if (typeof showTab === 'function') showTab('home');
    });
    return panel;
  }

  function syncTraveler(person) {
    if (!PEOPLE.includes(person)) return;
    activePerson = person;
    localStorage.setItem('tcRatingQueuePerson', person);
    if (typeof selectedTraveler !== 'undefined' && selectedTraveler !== person && typeof chooseTraveler === 'function') {
      chooseTraveler(person);
    }
  }

  function openQueue(person = '') {
    const traveler = localStorage.getItem('tcTraveler');
    if (PEOPLE.includes(person)) activePerson = person;
    else if (PEOPLE.includes(traveler)) activePerson = traveler;

    syncTraveler(activePerson);
    ensurePanel();
    if (typeof showTab === 'function') showTab('rate');
    render();
  }

  function setPerson(person) {
    if (!PEOPLE.includes(person)) return;
    syncTraveler(person);
    render();
  }

  function renderPersonTabs() {
    const root = document.getElementById('allRatingPersonTabs');
    if (!root) return;
    root.innerHTML = PEOPLE.map(person => {
      const remaining = remainingFor(person).length;
      return `<button type="button" class="rating-person-tab ${activePerson === person ? 'active' : ''}" data-all-rating-person="${person}">${person} · ${remaining} left</button>`;
    }).join('');
    root.querySelectorAll('[data-all-rating-person]').forEach(button => {
      button.addEventListener('click', () => setPerson(button.dataset.allRatingPerson));
    });
  }

  function renderFilters() {
    const root = document.getElementById('allRatingFilterRow');
    if (!root) return;
    root.innerHTML = FILTERS.map(filter => `<button type="button" class="${activeFilter === filter.id ? 'active' : ''}" data-all-rating-filter="${filter.id}">${filter.label}</button>`).join('');
    root.querySelectorAll('[data-all-rating-filter]').forEach(button => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.allRatingFilter;
        render();
      });
    });
  }

  function renderProgress() {
    const total = places().length;
    const remaining = remainingFor(activePerson).length;
    const completed = total - remaining;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    const title = document.getElementById('allRatingProgressTitle');
    const count = document.getElementById('allRatingProgressCount');
    const fill = document.getElementById('allRatingProgressFill');
    if (title) title.textContent = `${activePerson}'s unrated queue`;
    if (count) count.textContent = remaining ? `${remaining} LEFT · ${completed} already rated` : `0 LEFT · ALL ${total} COMPLETE`;
    if (fill) fill.style.width = `${percent}%`;
  }

  function cardMarkup(place) {
    const officialLink = place.url && place.url !== '#'
      ? `<a href="${place.url}" target="_blank" rel="noopener">${siteLabel(place)}</a>`
      : '';
    return `
      <article class="rating-queue-card" data-all-queue-place="${place.id}">
        <div class="queue-card-top"><div class="queue-icon">${place.icon || '📍'}</div><span class="queue-kind">${kindLabel(place)}</span></div>
        <div style="display:inline-block;margin:6px 0 2px;padding:5px 8px;border-radius:8px;background:#fff0f0;color:#a3161d;font-size:.64rem;font-weight:900;letter-spacing:.04em;">NOT YET RATED BY ${activePerson.toUpperCase()}</div>
        <h3>${place.name}</h3>
        <p class="queue-area">📍 ${place.area || place.town || 'Traverse City area'}</p>
        <p class="queue-summary">${place.summary || ''}</p>
        ${place.menu ? `<p class="queue-summary"><strong>Menu snapshot:</strong> ${place.menu}</p>` : ''}
        <div class="queue-family-status">${familyStatus(place.id)}</div>
        <div class="rating-queue-actions">
          ${officialLink}
          <a class="queue-map" href="${mapUrl(place)}" target="_blank" rel="noopener">Map ↗</a>
          <button type="button" class="queue-rate" data-all-queue-rate="${place.id}">Rate now → card disappears</button>
        </div>
      </article>`;
  }

  function renderCards() {
    const root = document.getElementById('allRatingQueueGrid');
    if (!root) return;
    const remaining = remainingFor(activePerson);
    const filtered = activeFilter === 'all'
      ? remaining
      : remaining.filter(place => place.kind === activeFilter);

    if (!remaining.length) {
      root.innerHTML = `
        <div class="rating-complete" style="grid-column:1/-1">
          <div class="otter-party">🦦🎉</div>
          <h3>${activePerson} finished every rating!</h3>
          <p>The queue is empty because every restaurant, shop, and activity already has a heart score.</p>
        </div>`;
      return;
    }

    if (!filtered.length) {
      root.innerHTML = `<div class="rating-complete" style="grid-column:1/-1"><div class="otter-party">✓</div><h3>${activePerson} finished this category.</h3><p>Choose another category above to see the remaining unrated cards.</p></div>`;
      return;
    }

    root.innerHTML = filtered.map(cardMarkup).join('');
    root.querySelectorAll('[data-all-queue-rate]').forEach(button => {
      button.addEventListener('click', () => {
        syncTraveler(activePerson);
        ratingsApi()?.open?.(button.dataset.allQueueRate);
      });
    });
  }

  function updateQuickLaunch() {
    const count = document.getElementById('ratingLaunchCount');
    const launch = document.getElementById('ratingQueueLaunch');
    if (!count || !launch) return;
    const traveler = localStorage.getItem('tcTraveler');
    const person = PEOPLE.includes(traveler) ? traveler : activePerson;
    const remaining = remainingFor(person).length;
    const title = launch.querySelector('strong');
    const detail = launch.querySelector('small');
    if (title) title.textContent = `Finish ${person}'s ratings`;
    if (detail) detail.textContent = 'Open an UNRATED ONLY queue. Rated cards are hidden.';
    count.textContent = remaining ? `${remaining} places left` : `Complete ✓`;
  }

  function enhanceAdventureLaunch() {
    const traveler = localStorage.getItem('tcTraveler');
    if (!PEOPLE.includes(traveler)) return;
    const button = document.querySelector('[data-panel="home"] .adventure-next-step');
    if (!button) return;

    const remaining = remainingFor(traveler).length;
    const desiredTitle = remaining ? `Finish ${traveler}'s rating queue` : `${traveler}'s ratings are complete`;
    const desiredDetail = remaining
      ? `${remaining} UNRATED places left · rated cards are hidden`
      : 'Every restaurant, shop, and activity has a heart score.';

    button.removeAttribute('data-open-mode');
    button.removeAttribute('data-open-rating-queue');
    button.dataset.openAllRatingQueue = traveler;

    const title = button.querySelector('.adventure-signal-copy > strong');
    const detail = button.querySelector('.adventure-signal-copy > span');
    if (title && title.textContent !== desiredTitle) title.textContent = desiredTitle;
    if (detail && detail.textContent !== desiredDetail) detail.textContent = desiredDetail;
  }

  function render() {
    ensurePanel();
    renderPersonTabs();
    renderProgress();
    renderFilters();
    renderCards();
    updateQuickLaunch();
    window.setTimeout(enhanceAdventureLaunch, 120);
  }

  function refreshForSelectedTraveler() {
    const traveler = localStorage.getItem('tcTraveler');
    if (PEOPLE.includes(traveler)) activePerson = traveler;
    updateQuickLaunch();
    enhanceAdventureLaunch();
  }

  function init() {
    if (!ratingsApi() || !places().length) return;
    const traveler = localStorage.getItem('tcTraveler');
    if (PEOPLE.includes(traveler)) activePerson = traveler;
    ensurePanel();
    render();

    const home = document.querySelector('[data-panel="home"]');
    if (home && !homeObserver) {
      homeObserver = new MutationObserver(() => requestAnimationFrame(enhanceAdventureLaunch));
      homeObserver.observe(home, { childList: true, subtree: true });
    }
    window.setTimeout(enhanceAdventureLaunch, 400);
  }

  window.TCAllFamilyRatingQueue = {
    open: openQueue,
    remaining: person => PEOPLE.includes(person) ? remainingFor(person).length : 0
  };

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-open-all-rating-queue]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openQueue(button.dataset.openAllRatingQueue);
  }, true);

  document.addEventListener('tc-ratings-changed', () => window.setTimeout(render, 0));
  document.addEventListener('tc-shared-ready', () => window.setTimeout(render, 0));
  document.addEventListener('tc-places-ready', () => window.setTimeout(render, 120));
  document.addEventListener('click', event => {
    if (event.target.closest('[data-explorer-name], #profilePill, .bottom-nav [data-tab="home"]')) {
      window.setTimeout(refreshForSelectedTraveler, 320);
    }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();