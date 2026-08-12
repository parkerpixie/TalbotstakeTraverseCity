(() => {
  const PEOPLE = ['Mark', 'Nancy'];
  const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'restaurant', label: '🍴 Restaurants' },
    { id: 'shop', label: '🛍️ Shops' },
    { id: 'activity', label: '🧭 Things to do' }
  ];

  let activePerson = PEOPLE.includes(localStorage.getItem('tcTraveler')) ? localStorage.getItem('tcTraveler') : 'Mark';
  let activeFilter = 'all';

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

  function completedFor(person) {
    return places().length - remainingFor(person).length;
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
    const stats = ratingsApi()?.stats(placeId);
    if (!stats?.count) return 'Nobody has rated this one yet.';
    const people = stats.entries.map(entry => `${entry.name} ${entry.rating}♥`).join(' · ');
    return `${stats.count} of 5 rated · ${people}`;
  }

  function ensurePanel() {
    let panel = document.querySelector('[data-panel="rate"]');
    if (panel) return panel;

    panel = document.createElement('section');
    panel.className = 'tab-panel';
    panel.dataset.panel = 'rate';
    panel.innerHTML = `
      <div class="rating-queue-shell">
        <button type="button" class="rating-queue-back" id="ratingQueueBack">← Back to Adventure</button>
        <div class="rating-queue-intro">
          <div>
            <p class="eyebrow dark">Finish the family shortlist</p>
            <h2>Rate what sounds worth doing.</h2>
          </div>
          <p>Open the menu or website if you need more context, then use the same five-heart scale as everyone else. Once you rate something, it disappears from your stack.</p>
        </div>
        <div class="rating-person-tabs" id="ratingPersonTabs"></div>
        <div class="rating-progress-card">
          <div class="rating-progress-top"><strong id="ratingProgressTitle"></strong><span id="ratingProgressCount"></span></div>
          <div class="rating-progress-track" aria-hidden="true"><div class="rating-progress-fill" id="ratingProgressFill"></div></div>
        </div>
        <div class="rating-filter-row" id="ratingFilterRow"></div>
        <div class="rating-queue-grid" id="ratingQueueGrid" aria-live="polite"></div>
      </div>`;

    document.querySelector('.tab-stage')?.appendChild(panel);
    panel.querySelector('#ratingQueueBack')?.addEventListener('click', () => showTab('home'));
    return panel;
  }

  function ensureLaunch() {
    if (document.getElementById('ratingQueueLaunch')) return;
    const grid = document.querySelector('.quick-grid');
    if (!grid) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'ratingQueueLaunch';
    button.className = 'quick-card rating-queue-launch';
    button.innerHTML = `
      <span>♥</span>
      <strong>Finish family ratings</strong>
      <small>Mark and Nancy: menus, stores, activities, then the same 1–5 heart scale.</small>
      <span class="rating-launch-count" id="ratingLaunchCount"></span>`;
    button.addEventListener('click', openQueue);
    grid.appendChild(button);
  }

  function setPerson(person) {
    if (!PEOPLE.includes(person)) return;
    activePerson = person;
    localStorage.setItem('tcRatingQueuePerson', person);
    if (typeof selectedTraveler !== 'undefined' && selectedTraveler !== person && typeof chooseTraveler === 'function') {
      chooseTraveler(person);
    }
    render();
  }

  function openQueue(person = '') {
    const savedQueuePerson = localStorage.getItem('tcRatingQueuePerson');
    if (PEOPLE.includes(person)) activePerson = person;
    else if (PEOPLE.includes(savedQueuePerson)) activePerson = savedQueuePerson;
    else {
      const traveler = localStorage.getItem('tcTraveler');
      if (PEOPLE.includes(traveler)) activePerson = traveler;
    }
    localStorage.setItem('tcRatingQueuePerson', activePerson);
    ensurePanel();
    if (typeof showTab === 'function') showTab('rate');
    if (typeof selectedTraveler !== 'undefined' && selectedTraveler !== activePerson && typeof chooseTraveler === 'function') {
      chooseTraveler(activePerson);
    }
    render();
  }

  function renderPersonTabs() {
    const root = document.getElementById('ratingPersonTabs');
    if (!root) return;
    root.innerHTML = PEOPLE.map(person => {
      const remaining = remainingFor(person).length;
      return `<button type="button" class="rating-person-tab ${activePerson === person ? 'active' : ''}" data-rating-person="${person}">${person} · ${remaining} left</button>`;
    }).join('');
    root.querySelectorAll('[data-rating-person]').forEach(button => {
      button.addEventListener('click', () => setPerson(button.dataset.ratingPerson));
    });
  }

  function renderFilters() {
    const root = document.getElementById('ratingFilterRow');
    if (!root) return;
    root.innerHTML = FILTERS.map(filter => `<button type="button" class="${activeFilter === filter.id ? 'active' : ''}" data-rating-filter="${filter.id}">${filter.label}</button>`).join('');
    root.querySelectorAll('[data-rating-filter]').forEach(button => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.ratingFilter;
        render();
      });
    });
  }

  function renderProgress() {
    const total = places().length;
    const completed = completedFor(activePerson);
    const remaining = total - completed;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    const title = document.getElementById('ratingProgressTitle');
    const count = document.getElementById('ratingProgressCount');
    const fill = document.getElementById('ratingProgressFill');
    if (title) title.textContent = `${activePerson}'s progress`;
    if (count) count.textContent = remaining ? `${completed} rated · ${remaining} left` : `${total} rated · complete!`;
    if (fill) fill.style.width = `${percent}%`;
  }

  function cardMarkup(place) {
    const officialLink = place.url && place.url !== '#'
      ? `<a href="${place.url}" target="_blank" rel="noopener">${siteLabel(place)}</a>`
      : '';
    return `
      <article class="rating-queue-card" data-queue-place="${place.id}">
        <div class="queue-card-top"><div class="queue-icon">${place.icon || '📍'}</div><span class="queue-kind">${kindLabel(place)}</span></div>
        <h3>${place.name}</h3>
        <p class="queue-area">📍 ${place.area || place.town || 'Traverse City area'}</p>
        <p class="queue-summary">${place.summary || ''}</p>
        ${place.menu ? `<p class="queue-summary"><strong>Menu snapshot:</strong> ${place.menu}</p>` : ''}
        <div class="queue-family-status">${familyStatus(place.id)}</div>
        <div class="rating-queue-actions">
          ${officialLink}
          <a class="queue-map" href="${mapUrl(place)}" target="_blank" rel="noopener">Map ↗</a>
          <button type="button" class="queue-rate" data-queue-rate="${place.id}">Rate 1–5 ♥</button>
        </div>
      </article>`;
  }

  function renderCards() {
    const root = document.getElementById('ratingQueueGrid');
    if (!root) return;

    const remaining = remainingFor(activePerson);
    const filtered = activeFilter === 'all' ? remaining : remaining.filter(place => place.kind === activeFilter);

    if (!remaining.length) {
      root.innerHTML = `
        <div class="rating-complete" style="grid-column:1/-1">
          <div class="otter-party">🦦🎉</div>
          <h3>${activePerson} finished every rating!</h3>
          <p>The stack is empty because every restaurant, shop, and activity has a heart score. Family planning has officially become much less guessy.</p>
        </div>`;
      return;
    }

    if (!filtered.length) {
      root.innerHTML = `<div class="rating-complete" style="grid-column:1/-1"><div class="otter-party">✓</div><h3>${activePerson} finished this category.</h3><p>Choose another category above to keep going.</p></div>`;
      return;
    }

    root.innerHTML = filtered.map(cardMarkup).join('');
    root.querySelectorAll('[data-queue-rate]').forEach(button => {
      button.addEventListener('click', () => {
        if (typeof selectedTraveler !== 'undefined' && selectedTraveler !== activePerson && typeof chooseTraveler === 'function') {
          chooseTraveler(activePerson);
        }
        ratingsApi()?.open(button.dataset.queueRate);
      });
    });
  }

  function updateLaunch() {
    const count = document.getElementById('ratingLaunchCount');
    if (!count) return;
    const mark = remainingFor('Mark').length;
    const nancy = remainingFor('Nancy').length;
    count.textContent = mark || nancy ? `Mark ${mark} left · Nancy ${nancy} left` : 'Mark + Nancy complete ✓';
  }

  function enhanceAdventureLaunch() {
    const traveler = localStorage.getItem('tcTraveler');
    if (!PEOPLE.includes(traveler)) return;
    const button = document.querySelector('[data-panel="home"] .adventure-next-step');
    if (!button) return;

    const remaining = remainingFor(traveler).length;
    const desiredTitle = remaining ? `Finish ${traveler}'s rating queue` : `${traveler}'s ratings are complete`;
    const desiredDetail = remaining
      ? `${remaining} unrated places left. Each card disappears as you rate it.`
      : 'Every restaurant, shop, and activity has a heart score.';

    if (button.hasAttribute('data-open-mode')) button.removeAttribute('data-open-mode');
    if (button.dataset.openRatingQueue !== traveler) button.dataset.openRatingQueue = traveler;

    const title = button.querySelector('.adventure-signal-copy > strong');
    const detail = button.querySelector('.adventure-signal-copy > span');
    if (title && title.textContent !== desiredTitle) title.textContent = desiredTitle;
    if (detail && detail.textContent !== desiredDetail) detail.textContent = desiredDetail;
  }

  function render() {
    renderPersonTabs();
    renderProgress();
    renderFilters();
    renderCards();
    updateLaunch();
    window.setTimeout(enhanceAdventureLaunch, 80);
  }

  function init() {
    if (!ratingsApi() || !places().length) return;
    const remembered = localStorage.getItem('tcRatingQueuePerson');
    if (PEOPLE.includes(remembered)) activePerson = remembered;
    ensurePanel();
    ensureLaunch();
    render();

    const home = document.querySelector('[data-panel="home"]');
    if (home) {
      new MutationObserver(() => requestAnimationFrame(enhanceAdventureLaunch))
        .observe(home, { childList: true, subtree: true });
    }
    window.setTimeout(enhanceAdventureLaunch, 300);
  }

  window.TCFamilyRatingQueue = {
    open: openQueue,
    remaining: person => PEOPLE.includes(person) ? remainingFor(person).length : 0
  };

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-open-rating-queue]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openQueue(button.dataset.openRatingQueue);
  }, true);

  document.addEventListener('tc-ratings-changed', render);
  document.addEventListener('tc-shared-ready', render);
  document.addEventListener('tc-places-ready', () => window.setTimeout(enhanceAdventureLaunch, 100));
  document.addEventListener('click', event => {
    if (event.target.closest('[data-explorer-name], #profilePill, .bottom-nav [data-tab="home"]')) {
      window.setTimeout(enhanceAdventureLaunch, 220);
    }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
