(() => {
  const home = document.querySelector('[data-panel="home"]');
  const header = document.querySelector('.app-header');
  if (!home || !header) return;

  const RATING_GOAL = 10;

  const getFavorites = () => {
    try { return JSON.parse(localStorage.getItem('tcFavoritesV3') || localStorage.getItem('tcFavoritesV2') || '[]'); }
    catch { return []; }
  };

  const getRatings = () => {
    try {
      const value = JSON.parse(localStorage.getItem('tcHeartRatings') || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  };

  const currentTraveler = () => localStorage.getItem('tcTraveler') || '';

  const ratedPlaceCount = () => {
    const traveler = currentTraveler();
    if (!traveler) return 0;
    return Object.values(getRatings()).filter(people => Number(people?.[traveler]) > 0).length;
  };

  document.querySelector('.header-actions')?.remove();
  const headerActions = document.createElement('div');
  headerActions.className = 'header-actions rating-header-actions';
  headerActions.innerHTML = `
    <div class="header-rating-progress" id="headerRatingProgress" role="status" aria-live="polite">
      <strong id="headerRatingCount">0/${RATING_GOAL}</strong>
      <span>Places rated</span>
    </div>`;
  header.appendChild(headerActions);

  const tripChip = header.querySelector('.trip-chip');
  if (tripChip) tripChip.textContent = 'Traverse City & Sleeping Bear Dunes';

  const welcome = document.createElement('section');
  welcome.className = 'home-welcome';
  welcome.innerHTML = `
    <div>
      <p class="eyebrow dark">Welcome, Talbots</p>
      <h2>One place to dream up the trip together.</h2>
      <p>Browse restaurants, shops, and activities. Rate anything that sounds good, then group the family favorites into easy days.</p>
      <button class="primary" id="welcomeStart">Start exploring</button>
    </div>
    <div class="start-steps">
      <div class="start-step"><span>1</span><div><strong>Choose your name</strong><small>Your ratings stay attached to the right adventurer.</small></div></div>
      <div class="start-step"><span>2</span><div><strong>Rate the places</strong><small>Use the five-heart scale to show what matters most.</small></div></div>
      <div class="start-step"><span>3</span><div><strong>Build the week</strong><small>Add the strongest family contenders to each day.</small></div></div>
    </div>`;

  const picks = document.createElement('section');
  picks.className = 'parker-picks';
  picks.innerHTML = `
    <p class="eyebrow dark">A few places to begin</p>
    <h2 class="section-title">Parker's Picks</h2>
    <p class="section-intro">A starter handful, not commandments carved into cherrywood.</p>
    <div class="pick-grid">
      <button class="pick-card" data-tab="eat"><span>🍝</span><strong>Trattoria Stella</strong><small>Atmospheric Italian at the Commons</small></button>
      <button class="pick-card" data-tab="shop"><span>🎨</span><strong>My Secret Stash</strong><small>Michigan makers and local art</small></button>
      <button class="pick-card" data-tab="explore"><span>🌊</span><strong>Sleeping Bear</strong><small>The big scenic day</small></button>
      <button class="pick-card" data-tab="shop"><span>📚</span><strong>Horizon Books</strong><small>Downtown browsing stop</small></button>
      <button class="pick-card" data-tab="eat"><span>🌅</span><strong>West End Tavern</strong><small>Low-stress food by the bay</small></button>
    </div>`;

  const progress = document.createElement('section');
  progress.className = 'planning-progress';
  progress.innerHTML = `
    <div class="progress-card">
      <div class="progress-head"><div><p class="eyebrow">Vacation planning</p><h3 id="progressTitle">The trip is taking shape</h3></div><strong id="progressPercent">0%</strong></div>
      <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
      <div class="progress-list"><span>✓ House tour</span><span>✓ Restaurants</span><span>✓ Shopping</span><span>✓ Activities</span><span id="favoritesProgress">○ Family ratings</span><span id="itineraryProgress">○ Final itinerary</span></div>
    </div>`;

  const footer = document.createElement('section');
  footer.className = 'trip-footer-card';
  footer.innerHTML = `<p class="eyebrow dark">Traverse City & Sleeping Bear Dunes</p><h3>Five travelers. Four nights. One very good plan.</h3><p>Everything here can keep changing as the family discovers new favorites.</p>`;

  const stats = home.querySelector('.stats-row');
  if (stats) stats.before(welcome);
  home.append(picks, progress, footer);

  const addPurpose = (panel, text) => {
    const heading = document.querySelector(`[data-panel="${panel}"] .page-heading`);
    if (!heading || heading.nextElementSibling?.classList.contains('purpose-banner')) return;
    const note = document.createElement('div');
    note.className = 'purpose-banner';
    note.textContent = text;
    heading.after(note);
  };
  addPurpose('eat', 'Find somewhere everyone can enjoy, then rate the contenders before the family debate begins.');
  addPurpose('explore', 'Choose the experience first, then use area and dog-friendly filters to keep the day practical.');
  addPurpose('shop', 'Build walkable clusters of local finds instead of scattering shopping stops across the county.');
  addPurpose('planner', 'This is planning mode. Nothing is locked in, and every rated idea can move between days.');

  const updateProgress = () => {
    const favoriteTotal = getFavorites().length;
    const ratingTotal = ratedPlaceCount();
    let plannedTotal = 0;
    try {
      const savedPlan = JSON.parse(localStorage.getItem('tcPlanV3') || '{}');
      plannedTotal = Object.values(savedPlan).flatMap(day => Object.values(day || {}).flat()).length;
    } catch {}
    const percent = Math.min(100, 55 + Math.min(25, ratingTotal * 2.5) + Math.min(20, plannedTotal * 4));
    const fill = document.getElementById('progressFill');
    const value = document.getElementById('progressPercent');
    if (fill) fill.style.width = `${percent}%`;
    if (value) value.textContent = `${Math.round(percent)}%`;
    const favoriteStep = document.getElementById('favoritesProgress');
    const itineraryStep = document.getElementById('itineraryProgress');
    if (favoriteStep) favoriteStep.textContent = `${ratingTotal ? '✓' : '○'} Family ratings`;
    if (itineraryStep) itineraryStep.textContent = `${plannedTotal ? '✓' : '○'} Final itinerary`;
  };

  const updateRatingProgress = () => {
    const count = ratedPlaceCount();
    const traveler = currentTraveler();
    const displayed = Math.min(count, RATING_GOAL);
    const countNode = document.getElementById('headerRatingCount');
    const shell = document.getElementById('headerRatingProgress');
    if (countNode) countNode.textContent = count > RATING_GOAL ? `${RATING_GOAL}+` : `${displayed}/${RATING_GOAL}`;
    if (shell) {
      shell.classList.toggle('complete', count >= RATING_GOAL);
      shell.setAttribute('aria-label', traveler
        ? `${traveler} has rated ${count} place${count === 1 ? '' : 's'} toward a goal of ${RATING_GOAL}`
        : `Choose an adventurer to track ratings toward a goal of ${RATING_GOAL}`);
    }
    updateProgress();
  };

  document.getElementById('welcomeStart')?.addEventListener('click', () => document.querySelector('[data-tab="explore"]')?.click());
  document.addEventListener('click', event => {
    if (event.target.closest('[data-save], [data-dashboard-rate], [data-heart-score], [data-explorer-name], [data-add], .remove-stop')) {
      window.setTimeout(updateRatingProgress, 140);
    }
    const tabButton = event.target.closest('.pick-card[data-tab]');
    if (tabButton) document.querySelector(`.bottom-nav [data-tab="${tabButton.dataset.tab}"]`)?.click();
  });

  document.addEventListener('tc-ratings-changed', updateRatingProgress);
  document.addEventListener('tc-shared-ready', updateRatingProgress);
  updateRatingProgress();
})();