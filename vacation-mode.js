(() => {
  const VERSION = '20260821-1';
  const HOUSE_ADDRESS_KEY = 'tcHouseAddressPrivate';
  const ORIGIN_KEY = 'tcVacationOriginV1';
  const GAME_LOG_KEY = 'tcVacationGameLogV1';
  const GAME_SHARED_KEY = 'vacation_game_log_v1';
  const RAINY_KEY = 'tcRainyActivitiesOnlyV1';
  const FAMILY = ['Parker', 'Blake', 'Porter', 'Mark', 'Nancy'];
  const CORE = ['Parker', 'Blake', 'Porter'];
  const ORIGINS = {
    cumberland: { label: 'Cumberland, WI', short: 'Cumberland', address: '1500 Elm Street, Cumberland, WI' },
    madison: { label: 'Madison, WI', short: 'Madison', address: '7133 Gladstone Drive, Madison, WI' }
  };
  const GAMES = [
    { icon: '🚙', name: 'License Plate Hunt', text: 'Collect states and provinces. One point per new plate, two if nobody else spotted it first.' },
    { icon: '🔤', name: 'Alphabet Signs', text: 'Find A through Z in order on road signs, storefronts, billboards, or plates. Q remains a tiny roadside villain.' },
    { icon: '🕵️', name: 'Michigan 20 Questions', text: 'Pick something from the trip universe: a dune, cherry, lighthouse, fish tug, Petoskey stone, or town. Everyone else gets yes/no questions.' },
    { icon: '📚', name: 'One-Sentence Road Story', text: 'Go around the car adding exactly one sentence at a time. No planning ahead. Let the story become whatever creature it becomes.' },
    { icon: '🎧', name: 'Trip DJ Challenge', text: 'Pick a category like “song with a place name” or “song that belongs on a lake.” Everyone nominates one and the car votes.' },
    { icon: '🦌', name: 'Spot the Weird', text: 'First person to spot an odd roadside attraction, strange statue, giant object, or suspiciously taxidermy-adjacent sign gets the point.' },
    { icon: '🌲', name: 'Would You Rather: Up North', text: 'Lighthouse keeper or fish tug captain? Dune hike or stormy museum day? Cherry everything or no cherries at all?' }
  ];

  let renderingHome = false;
  let lastGameName = '';
  let observer = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const safe = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  function currentTraveler() {
    const stored = localStorage.getItem('tcTraveler');
    if (FAMILY.includes(stored)) return stored;
    try {
      if (typeof selectedTraveler !== 'undefined' && FAMILY.includes(selectedTraveler)) return selectedTraveler;
    } catch {}
    return 'Parker';
  }

  function getPlaces() {
    try {
      return typeof allPlaces !== 'undefined' && Array.isArray(allPlaces) ? allPlaces.filter(place => !place.virtual) : [];
    } catch { return []; }
  }

  function getActivities() {
    try {
      return typeof activities !== 'undefined' && Array.isArray(activities) ? activities : [];
    } catch { return []; }
  }

  function statsFor(place) {
    const stats = window.TCHeartRatings?.stats?.(place.id) || { entries: [], count: 0, average: 0 };
    const coreEntries = (stats.entries || []).filter(entry => CORE.includes(entry.name));
    const values = coreEntries.map(entry => Number(entry.rating)).filter(Number.isFinite);
    const decisionAverage = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : Number(stats.average) || 0;
    return { ...stats, decisionAverage, decisionCount: values.length || stats.count || 0 };
  }

  function topFavorites(limit = 6) {
    return getPlaces()
      .map(place => ({ place, stats: statsFor(place) }))
      .filter(item => item.stats.decisionCount && item.stats.decisionAverage >= 3)
      .sort((a, b) => b.stats.decisionAverage - a.stats.decisionAverage || b.stats.count - a.stats.count || a.place.name.localeCompare(b.place.name))
      .slice(0, limit);
  }

  function placeImage(place) {
    if (place?.image) return `Assets/${String(place.image).split('/').map(encodeURIComponent).join('/')}`;
    const fallbacks = {
      activity: 'Assets/Downtown Traverse City From Above.jpeg',
      restaurant: 'Assets/Downtown Traverse City From Above.jpeg',
      shop: 'Assets/Downtown Traverse City Shopping.jpeg'
    };
    return fallbacks[place?.kind] || 'Assets/Downtown Traverse City From Above.jpeg';
  }

  function mapsPlaceQuery(place) {
    return `${place.name} ${place.town || place.area || 'Traverse City'} Michigan`;
  }

  function mapsSearchUrl(query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  function mapsEmbedUrl(query) {
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  }

  function selectedOriginId() {
    const stored = localStorage.getItem(ORIGIN_KEY);
    return ORIGINS[stored] ? stored : 'madison';
  }

  function houseDestination() {
    return localStorage.getItem(HOUSE_ADDRESS_KEY)?.trim() || 'West Grand Traverse Bay, Traverse City, MI';
  }

  function directionsUrl(originId = selectedOriginId(), destination = houseDestination()) {
    const origin = ORIGINS[originId] || ORIGINS.madison;
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin.address)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
  }

  function departureStatus() {
    const start = new Date('2026-08-23T06:00:00-04:00');
    const now = new Date();
    if (now >= start) return { eyebrow: 'VACATION MODE', title: 'We are officially doing this.', detail: 'No more rating homework. Use the app to get there, decide what sounds good, and pivot when the day has other ideas.' };
    const ms = start - now;
    const hours = Math.max(0, Math.floor(ms / 3600000));
    const days = Math.floor(hours / 24);
    const leftover = hours % 24;
    const time = days ? `${days}d ${leftover}h` : `${leftover}h`;
    return { eyebrow: `VACATION MODE · ${time} TO DEPARTURE`, title: `Almost time, ${currentTraveler()}.`, detail: 'The rating phase is over. From here on out, this app is for getting there, choosing what sounds good, and enjoying the trip.' };
  }

  function planSummaryMarkup() {
    const dateMap = {
      '2026-08-23': ['sun23', 'Arrival Day'],
      '2026-08-24': ['mon24', 'First Full Day'],
      '2026-08-25': ['tue25', 'Adventure Day'],
      '2026-08-26': ['wed26', 'Choose Our Favorite'],
      '2026-08-27': ['thu27', 'Departure Day']
    };
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Detroit', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const tuple = dateMap[today];
    if (!tuple) return '<p class="vacay-muted">The five-day board is ready whenever you want to pin down an anchor. Until then, open canvas is a valid plan.</p>';
    try {
      if (typeof plan === 'undefined' || !plan?.[tuple[0]]) return '<p class="vacay-muted">Today is still open. Add an anchor when something earns the commitment.</p>';
      const day = plan[tuple[0]];
      const slots = ['morning', 'afternoon', 'evening'];
      const records = getPlaces();
      const items = slots.flatMap(slot => (day[slot] || []).map(id => ({ slot, place: records.find(place => place.id === id) })).filter(item => item.place));
      if (!items.length) return '<p class="vacay-muted">Today is still open. Add an anchor when something earns the commitment.</p>';
      return `<div class="vacay-today-list">${items.map(item => `<div><span>${item.slot === 'morning' ? '☀️' : item.slot === 'afternoon' ? '🌤️' : '🌙'}</span><strong>${safe(item.place.name)}</strong><small>${safe(item.place.area || item.place.town || '')}</small></div>`).join('')}</div>`;
    } catch { return '<p class="vacay-muted">Open the Plan tab to see the current five-day board.</p>'; }
  }

  function favoritesMarkup() {
    const items = topFavorites(6);
    if (!items.length) return '<p class="vacay-muted">Your family favorites will appear here as soon as the saved ratings finish loading.</p>';
    return items.map(({ place, stats }, index) => `
      <button type="button" class="vacay-favorite ${index === 0 ? 'active' : ''}" data-map-query="${safe(mapsPlaceQuery(place))}">
        <img src="${placeImage(place)}" alt="" loading="lazy" onerror="this.remove()">
        <span><strong>${safe(place.name)}</strong><small>${stats.decisionAverage.toFixed(1)} ♥ · ${safe(place.area || place.town || 'Traverse City area')}</small></span>
      </button>`).join('');
  }

  function gameLog() {
    try { return JSON.parse(localStorage.getItem(GAME_LOG_KEY) || '[]'); }
    catch { return []; }
  }

  function gameSummaryMarkup() {
    const log = gameLog();
    if (!log.length) return '<span>No road games logged yet</span>';
    const last = log[0];
    return `<span>${log.length} game${log.length === 1 ? '' : 's'} logged · last: ${safe(last.game)}</span><small>${safe((last.players || []).join(' + '))}</small>`;
  }

  function weatherCardMarkup() {
    const weather = window.TCTripWeather;
    if (!weather?.current) return '<div id="vacayWeatherBody"><strong>🌤️ Traverse City weather is loading</strong><small>We will use the live forecast as soon as the trip companion finishes its weather check.</small></div>';
    const current = weather.current;
    const daily = weather.daily || {};
    const code = Number(current.weather_code);
    const icon = [61,63,65,80,81,82,95,96,99].includes(code) ? '🌧️' : code === 0 ? '☀️' : code <= 3 ? '🌤️' : '☁️';
    const rain = Number(daily.precipitation_probability_max?.[0]) || 0;
    return `<div id="vacayWeatherBody"><div class="vacay-weather-temp">${icon} ${Math.round(Number(current.temperature_2m))}°</div><strong>${rain}% chance of rain today</strong><small>Feels ${Math.round(Number(current.apparent_temperature))}° · H ${Math.round(Number(daily.temperature_2m_max?.[0]))}° / L ${Math.round(Number(daily.temperature_2m_min?.[0]))}°</small></div>`;
  }

  function vacationHomeMarkup() {
    const status = departureStatus();
    const originId = selectedOriginId();
    const origin = ORIGINS[originId];
    const destination = houseDestination();
    const firstFavorite = topFavorites(1)[0]?.place;
    const mapQuery = firstFavorite ? mapsPlaceQuery(firstFavorite) : 'Traverse City Michigan West Bay';
    const exactHouse = !!localStorage.getItem(HOUSE_ADDRESS_KEY)?.trim();

    return `
      <div class="tc-vacation-home" data-vacation-home-version="${VERSION}">
        <section class="vacay-hero">
          <div>
            <p class="eyebrow">${safe(status.eyebrow)}</p>
            <h1>${safe(status.title)}</h1>
            <p>${safe(status.detail)}</p>
          </div>
          <img src="tttc-mani-west-bay-scene-transparent-1536x1024.png" alt="Mani at West Bay">
        </section>

        <section class="vacay-launch-grid">
          <article class="vacay-card vacay-route-card">
            <p class="vacay-label">Road trip launchpad</p>
            <h2>Where are we starting?</h2>
            <div class="vacay-origin-switch" role="group" aria-label="Choose driving origin">
              ${Object.entries(ORIGINS).map(([id, item]) => `<button type="button" class="${id === originId ? 'active' : ''}" data-vacay-origin="${id}"><strong>${safe(item.short)}</strong><small>${safe(item.label)}</small></button>`).join('')}
            </div>
            <div class="vacay-route-copy"><span>Starting at</span><strong id="vacayOriginAddress">${safe(origin.address)}</strong><span>Driving to ${exactHouse ? 'the saved house address' : 'the West Bay house area'}</span></div>
            <div class="vacay-actions">
              <a class="vacay-primary" id="vacayDirectionsLink" href="${directionsUrl(originId)}" target="_blank" rel="noopener">Open Google Maps directions ↗</a>
              <button type="button" data-vacay-house-address>${exactHouse ? 'Change house address' : 'Set exact house address'}</button>
            </div>
            ${exactHouse ? '' : '<p class="vacay-note">The destination stays at West Bay until the exact rental address is saved on this device.</p>'}
          </article>

          <article class="vacay-card vacay-weather-card">
            <div class="vacay-card-head"><div><p class="vacay-label">Weather</p><h2>What is Michigan plotting?</h2></div><button type="button" data-rainy-shortcut>☔ Rainy picks</button></div>
            ${weatherCardMarkup()}
            <button type="button" class="vacay-link-button" data-vacay-plan>Open the five-day plan →</button>
          </article>
        </section>

        <section class="vacay-card vacay-favorites-map">
          <div class="vacay-favorites-side">
            <div class="vacay-card-head"><div><p class="vacay-label">Family favorites</p><h2>The places with actual gravitational pull.</h2></div></div>
            <div class="vacay-favorites-list">${favoritesMarkup()}</div>
          </div>
          <div class="vacay-map-side">
            <div class="vacay-card-head">
              <div><p class="vacay-label">Trip map</p><h2 id="vacayMapTitle">Tap a favorite to move the map.</h2></div>
              <button type="button" class="vacay-game-button" data-vacay-game>🎲 Give us a game</button>
            </div>
            <div class="vacay-map-frame"><iframe id="vacayMapFrame" title="Traverse City trip map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${mapsEmbedUrl(mapQuery)}"></iframe></div>
            <div class="vacay-game-log" id="vacayGameSummary">${gameSummaryMarkup()}</div>
          </div>
        </section>

        <section class="vacay-lower-grid">
          <article class="vacay-card">
            <div class="vacay-card-head"><div><p class="vacay-label">Today</p><h2>Use the plan, not a checklist.</h2></div><button type="button" data-vacay-plan>Full plan →</button></div>
            ${planSummaryMarkup()}
          </article>
          <article class="vacay-card">
            <p class="vacay-label">Home base</p>
            <h2>Sunrise Shores Retreat</h2>
            <p>${exactHouse ? 'The exact rental address is saved privately on this device.' : 'The exact street address stays private unless you save it on this device.'}</p>
            <div class="vacay-actions"><a href="${directionsUrl(originId, destination)}" target="_blank" rel="noopener">Route to home base ↗</a><button type="button" data-vacay-house>House photos</button></div>
          </article>
        </section>
      </div>`;
  }

  function renderVacationHome(force = false) {
    if (renderingHome) return;
    const panel = $('[data-panel="home"]');
    if (!panel) return;
    if (!force && panel.querySelector(`[data-vacation-home-version="${VERSION}"]`)) return;
    renderingHome = true;
    panel.innerHTML = vacationHomeMarkup();
    bindHome();
    renderingHome = false;
    window.setTimeout(refreshWeatherCard, 1400);
  }

  function bindHome() {
    $$('[data-vacay-origin]').forEach(button => button.addEventListener('click', () => {
      localStorage.setItem(ORIGIN_KEY, button.dataset.vacayOrigin);
      renderVacationHome(true);
    }));

    $$('[data-vacay-plan]').forEach(button => button.addEventListener('click', () => openTab('planner')));
    $('[data-vacay-house]')?.addEventListener('click', () => openTab('house'));
    $('[data-vacay-game]')?.addEventListener('click', openGame);
    $('[data-rainy-shortcut]')?.addEventListener('click', openRainyActivities);
    $('[data-vacay-house-address]')?.addEventListener('click', setHouseAddress);

    $$('.vacay-favorite').forEach(button => button.addEventListener('click', () => {
      $$('.vacay-favorite').forEach(item => item.classList.toggle('active', item === button));
      const query = button.dataset.mapQuery;
      const frame = $('#vacayMapFrame');
      if (frame && query) frame.src = mapsEmbedUrl(query);
      const title = $('#vacayMapTitle');
      if (title) title.textContent = query || 'Traverse City';
    }));
  }

  function openTab(name) {
    const navButton = $(`.bottom-nav [data-tc-tab="${name}"]`);
    if (navButton) navButton.click();
    else if (typeof window.showTab === 'function') window.showTab(name);
    else {
      $$('.tab-panel').forEach(panel => panel.classList.toggle('active', panel.dataset.panel === name));
    }
  }

  function setHouseAddress() {
    const current = localStorage.getItem(HOUSE_ADDRESS_KEY) || '';
    const value = window.prompt('Paste the Traverse City rental street address. It is saved only in this browser on this device.', current);
    if (value === null) return;
    const trimmed = value.trim();
    if (trimmed) localStorage.setItem(HOUSE_ADDRESS_KEY, trimmed);
    else localStorage.removeItem(HOUSE_ADDRESS_KEY);
    renderVacationHome(true);
  }

  function ensureGameDialog() {
    let dialog = $('#tcVacationGameDialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'tcVacationGameDialog';
    dialog.className = 'vacay-game-dialog';
    dialog.innerHTML = '<button type="button" class="vacay-dialog-close" data-game-close aria-label="Close">×</button><div id="vacayGameDialogBody"></div>';
    document.body.appendChild(dialog);
    dialog.querySelector('[data-game-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    return dialog;
  }

  function pickGame() {
    let choices = GAMES.filter(game => game.name !== lastGameName);
    if (!choices.length) choices = GAMES;
    const game = choices[Math.floor(Math.random() * choices.length)];
    lastGameName = game.name;
    return game;
  }

  function openGame() {
    const dialog = ensureGameDialog();
    const game = pickGame();
    const body = $('#vacayGameDialogBody');
    body.innerHTML = `
      <div class="vacay-game-icon">${game.icon}</div>
      <p class="eyebrow dark">The hidden road-game drawer</p>
      <h2>${safe(game.name)}</h2>
      <p>${safe(game.text)}</p>
      <div class="vacay-player-picker"><strong>Who is playing?</strong><div>${FAMILY.map(name => `<label><input type="checkbox" value="${name}" checked><span>${name}</span></label>`).join('')}</div></div>
      <p class="vacay-game-error" id="vacayGameError" hidden>Pick at least one player so the log knows who joined.</p>
      <div class="vacay-dialog-actions"><button type="button" data-another-vacay-game>Different game</button><button type="button" class="vacay-primary" data-log-vacay-game>Log this game</button></div>`;
    body.querySelector('[data-another-vacay-game]').addEventListener('click', openGame);
    body.querySelector('[data-log-vacay-game]').addEventListener('click', () => logGame(game));
    if (!dialog.open) dialog.showModal();
  }

  async function logGame(game) {
    const dialog = ensureGameDialog();
    const players = $$('input[type="checkbox"]:checked', dialog).map(input => input.value);
    if (!players.length) {
      const error = $('#vacayGameError');
      if (error) error.hidden = false;
      return;
    }
    const entry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, game: game.name, icon: game.icon, players, startedAt: new Date().toISOString() };
    const log = [entry, ...gameLog()].slice(0, 100);
    localStorage.setItem(GAME_LOG_KEY, JSON.stringify(log));
    try { await window.TCShared?.write?.(GAME_SHARED_KEY, log); } catch {}
    dialog.close();
    const summary = $('#vacayGameSummary');
    if (summary) summary.innerHTML = gameSummaryMarkup();
  }

  async function hydrateSharedGameLog() {
    try {
      const remote = await window.TCShared?.read?.(GAME_SHARED_KEY);
      if (!Array.isArray(remote) || !remote.length) return;
      const merged = [...remote, ...gameLog()].reduce((map, item) => {
        if (item?.id) map.set(item.id, item);
        return map;
      }, new Map());
      const log = [...merged.values()].sort((a, b) => String(b.startedAt).localeCompare(String(a.startedAt))).slice(0, 100);
      localStorage.setItem(GAME_LOG_KEY, JSON.stringify(log));
      const summary = $('#vacayGameSummary');
      if (summary) summary.innerHTML = gameSummaryMarkup();
    } catch {}
  }

  function isRainyPlace(place) {
    const tags = Array.isArray(place?.tags) ? place.tags : [];
    return tags.some(tag => ['indoor', 'rainy-day'].includes(String(tag).toLowerCase()));
  }

  function applyRainyFilter() {
    const panel = $('[data-panel="explore"]');
    if (!panel) return;
    const active = sessionStorage.getItem(RAINY_KEY) === 'on';
    let banner = $('#vacayRainyFilterBar');
    if (!active) {
      banner?.remove();
      $$('.tc-place-card', panel).forEach(card => { card.hidden = false; });
      return;
    }

    const records = getActivities();
    let shown = 0;
    $$('.tc-place-card', panel).forEach(card => {
      const place = records.find(item => item.id === card.dataset.placeId);
      const keep = !!place && isRainyPlace(place);
      card.hidden = !keep;
      if (keep) shown += 1;
    });

    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'vacayRainyFilterBar';
      banner.className = 'vacay-rainy-filter';
      const grid = $('#activityGrid', panel);
      grid?.insertAdjacentElement('beforebegin', banner);
    }
    if (banner) {
      banner.innerHTML = `<strong>☔ Rainy-day filter is ON</strong><span>${shown} indoor or rainy-day options showing</span><button type="button" data-clear-rainy>Show all activities</button>`;
      banner.querySelector('[data-clear-rainy]').addEventListener('click', () => {
        sessionStorage.removeItem(RAINY_KEY);
        const search = $('#activitySearch');
        if (search) search.value = '';
        const type = $('#activityType');
        if (type) type.value = 'all';
        if (typeof window.renderActivities === 'function') window.renderActivities();
        window.setTimeout(applyRainyFilter, 30);
      });
    }
    const note = $('#activityResultsNote', panel);
    if (note) note.textContent = `${shown} rainy-day activit${shown === 1 ? 'y' : 'ies'} showing · indoor and weather-proof only.`;
  }

  function openRainyActivities() {
    sessionStorage.setItem(RAINY_KEY, 'on');
    openTab('explore');
    const search = $('#activitySearch');
    if (search) search.value = '';
    const type = $('#activityType');
    if (type) type.value = 'all';
    if (typeof window.renderActivities === 'function') window.renderActivities();
    window.setTimeout(applyRainyFilter, 50);
  }

  function wireRainyPlannerFix() {
    document.addEventListener('click', event => {
      if (!event.target.closest('[data-weather-activities]')) return;
      sessionStorage.setItem(RAINY_KEY, 'on');
      window.setTimeout(applyRainyFilter, 60);
    }, true);

    const activityPanel = $('[data-panel="explore"]');
    activityPanel?.addEventListener('input', () => {
      if (sessionStorage.getItem(RAINY_KEY) === 'on') window.setTimeout(applyRainyFilter, 20);
    });
  }

  function disableRatingHomework() {
    document.documentElement.dataset.vacationMode = VERSION;
    $$('.rating-queue-launch, [data-open-rating-queue], [data-queue-rate], .heart-rating-trigger, [data-dashboard-rate]').forEach(node => { node.hidden = true; });
    const ratePanel = $('[data-panel="rate"]');
    if (ratePanel) ratePanel.hidden = true;

    // Turn any small header progress pill into a vacation-state pill instead of a rating reminder.
    const textNodes = $$('body *').filter(node => node.children.length <= 3 && /places\s+rated/i.test(node.textContent || '') && (node.textContent || '').trim().length < 80);
    textNodes.forEach(node => {
      const box = node.parentElement && (node.parentElement.textContent || '').trim().length < 100 ? node.parentElement : node;
      if (box.dataset.vacationizedRatingPill) return;
      box.dataset.vacationizedRatingPill = 'yes';
      box.innerHTML = '<strong class="vacay-header-mode">VACATION</strong><small>MODE ON</small>';
    });
  }

  function refreshWeatherCard() {
    const body = $('#vacayWeatherBody');
    if (!body || !window.TCTripWeather?.current) return;
    const replacement = document.createElement('div');
    replacement.innerHTML = weatherCardMarkup();
    body.replaceWith(replacement.firstElementChild);
  }

  function observeHome() {
    const panel = $('[data-panel="home"]');
    if (!panel || observer) return;
    observer = new MutationObserver(() => {
      if (renderingHome) return;
      if (!panel.querySelector(`[data-vacation-home-version="${VERSION}"]`)) requestAnimationFrame(() => renderVacationHome(true));
      disableRatingHomework();
    });
    observer.observe(panel, { childList: true, subtree: true });
  }

  function init() {
    const panel = $('[data-panel="home"]');
    const nav = $('.bottom-nav');
    if (!panel || !nav || !window.TCHeartRatings) {
      window.setTimeout(init, 120);
      return;
    }

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = `vacation-mode.css?v=${VERSION}`;
    document.head.appendChild(style);

    renderVacationHome(true);
    disableRatingHomework();
    observeHome();
    wireRainyPlannerFix();
    hydrateSharedGameLog();
    applyRainyFilter();

    document.addEventListener('tc-ratings-changed', () => {
      disableRatingHomework();
      if ($('[data-panel="home"]')?.classList.contains('active')) renderVacationHome(true);
    });
    document.addEventListener('tc-shared-ready', () => {
      disableRatingHomework();
      hydrateSharedGameLog();
    });
    document.addEventListener('tc-trip-companion-ready', () => {
      renderVacationHome(true);
      disableRatingHomework();
      wireRainyPlannerFix();
    }, { once: true });

    window.setInterval(() => {
      disableRatingHomework();
      refreshWeatherCard();
      if (sessionStorage.getItem(RAINY_KEY) === 'on' && $('[data-panel="explore"]')?.classList.contains('active')) applyRainyFilter();
    }, 2500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => window.setTimeout(init, 800));
  else window.setTimeout(init, 800);
})();
