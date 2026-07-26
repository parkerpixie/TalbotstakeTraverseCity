(() => {
  const home = document.querySelector('[data-panel="home"]');
  const header = document.querySelector('.app-header');
  if (!home || !header) return;

  const getFavorites = () => {
    try { return JSON.parse(localStorage.getItem('tcFavoritesV3') || localStorage.getItem('tcFavoritesV2') || '[]'); }
    catch { return []; }
  };

  const headerActions = document.createElement('div');
  headerActions.className = 'header-actions';
  headerActions.innerHTML = `
    <button class="start-here-button" id="startHereButton">Start here</button>
    <button class="saved-header" id="savedHeader">♥ Saved <span id="savedHeaderCount">0</span></button>
  `;
  header.appendChild(headerActions);

  const welcome = document.createElement('section');
  welcome.className = 'home-welcome';
  welcome.innerHTML = `
    <div>
      <p class="eyebrow dark">Welcome, Talbots</p>
      <h2>One place to dream up the trip together.</h2>
      <p>Browse restaurants, shops, and activities. Save anything that sounds good, then group your favorites into easy days.</p>
      <button class="primary" id="welcomeStart">Start exploring</button>
    </div>
    <div class="start-steps">
      <div class="start-step"><span>1</span><div><strong>Choose your name</strong><small>Recommendations move toward what you enjoy.</small></div></div>
      <div class="start-step"><span>2</span><div><strong>Tap Save</strong><small>Your ideas collect in the planner tray.</small></div></div>
      <div class="start-step"><span>3</span><div><strong>Build the week</strong><small>Add saved ideas to any day and time.</small></div></div>
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
      <div class="progress-list"><span>✓ House tour</span><span>✓ Restaurants</span><span>✓ Shopping</span><span>✓ Activities</span><span id="favoritesProgress">○ Family favorites</span><span id="itineraryProgress">○ Final itinerary</span></div>
    </div>`;

  const footer = document.createElement('section');
  footer.className = 'trip-footer-card';
  footer.innerHTML = `<p class="eyebrow dark">See you on West Bay</p><h3>Five travelers. Four nights. One very good plan.</h3><p>Everything here can keep changing as the family discovers new favorites.</p>`;

  const stats = home.querySelector('.stats-row');
  if (stats) stats.before(welcome);
  home.append(picks, progress, footer);

  const guide = document.createElement('dialog');
  guide.id = 'guideDialog';
  guide.className = 'guide-dialog';
  guide.innerHTML = `
    <button class="dialog-close" aria-label="Close">×</button>
    <p class="eyebrow dark">Start here</p>
    <h2>This guide does four simple things.</h2>
    <div class="guide-grid">
      <article><strong>🍴 Eat</strong><p>Find restaurants by town, price, and mood.</p></article>
      <article><strong>🧭 Explore</strong><p>Find activities, including dog-friendly choices.</p></article>
      <article><strong>🛍 Shop</strong><p>Browse records, comics, art, books, and local finds.</p></article>
      <article><strong>▦ Plan</strong><p>Put saved ideas into each day of the trip.</p></article>
    </div>`;
  document.body.appendChild(guide);

  const addPurpose = (panel, text) => {
    const heading = document.querySelector(`[data-panel="${panel}"] .page-heading`);
    if (!heading) return;
    const note = document.createElement('div');
    note.className = 'purpose-banner';
    note.textContent = text;
    heading.after(note);
  };
  addPurpose('eat', 'Find somewhere everyone can enjoy, then save the contenders before the family debate begins.');
  addPurpose('explore', 'Choose the experience first, then use area and dog-friendly filters to keep the day practical.');
  addPurpose('shop', 'Build walkable clusters of local finds instead of scattering shopping stops across the county.');
  addPurpose('planner', 'This is planning mode. Nothing is locked in, and every saved idea can move between days.');

  const updateProgress = () => {
    const favoriteTotal = getFavorites().length;
    let plannedTotal = 0;
    try {
      const savedPlan = JSON.parse(localStorage.getItem('tcPlanV3') || '{}');
      plannedTotal = Object.values(savedPlan).flatMap(day => Object.values(day || {}).flat()).length;
    } catch {}
    const percent = Math.min(100, 60 + Math.min(20, favoriteTotal * 4) + Math.min(20, plannedTotal * 4));
    const fill = document.getElementById('progressFill');
    const value = document.getElementById('progressPercent');
    if (fill) fill.style.width = `${percent}%`;
    if (value) value.textContent = `${percent}%`;
    const favoriteStep = document.getElementById('favoritesProgress');
    const itineraryStep = document.getElementById('itineraryProgress');
    if (favoriteStep) favoriteStep.textContent = `${favoriteTotal ? '✓' : '○'} Family favorites`;
    if (itineraryStep) itineraryStep.textContent = `${plannedTotal ? '✓' : '○'} Final itinerary`;
  };

  const updateSavedCount = () => {
    const count = getFavorites().length;
    const el = document.getElementById('savedHeaderCount');
    if (el) el.textContent = count;
    updateProgress();
  };

  document.getElementById('startHereButton')?.addEventListener('click', () => guide.showModal());
  guide.querySelector('.dialog-close')?.addEventListener('click', () => guide.close());
  document.getElementById('welcomeStart')?.addEventListener('click', () => document.querySelector('[data-tab="explore"]')?.click());
  document.getElementById('savedHeader')?.addEventListener('click', () => document.querySelector('[data-tab="planner"]')?.click());
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-save], [data-remove-favorite], [data-add], .remove-stop')) setTimeout(updateSavedCount, 80);
    const tabButton = event.target.closest('.pick-card[data-tab]');
    if (tabButton) document.querySelector(`.bottom-nav [data-tab="${tabButton.dataset.tab}"]`)?.click();
  });

  document.addEventListener('tc-shared-ready', updateSavedCount);
  updateSavedCount();
})();