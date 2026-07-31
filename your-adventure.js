(() => {
  const home = document.querySelector('[data-panel="home"]');
  if (!home) return;

  const FAMILY = ['Parker', 'Blake', 'Porter', 'Mark', 'Nancy'];
  const asset = (filename) => `Assets/${filename.split('/').map(encodeURIComponent).join('/')}`;
  const houseAsset = (filename) => asset(`Assets/Images/${filename}`);
  const safe = (value = '') => String(value).replace(/[&<>"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character]));

  const placeImages = {
    'arts': 'Art Tavern Building.jpeg',
    'cherry-public': 'Cherry Republic - Cherry Public House and Great Hall of the Repbulic Glen Arbor.webp',
    'rpm-records': 'RPM Records.jpeg',
    'top-comics': 'Top Comics Outside.jpeg',
    'horizon': 'Horizon Books.jpeg',
    'laughing-fish': 'Laughing Fish Gallery.jpeg',
    'cherry-republic-tc': 'Cherry Republic Traverse City.jpg',
    'cherry-republic-ga': 'Cherry Republic Glen Arbor.jpg',
    'fishtown': 'Fishtown - Leelanau Artisan - Local goods.webp',
    'house-water': 'Traverse City - Pier and Beach access.webp',
    'clinch-park': 'Clinch Park Beach at Sunset.jpg',
    'commons-trails': 'Grand Traverse Commons - Scenic Walking Trail.webp',
    'commons-botanic': 'Grand Traverse Commons - Botanical Garden 1.jpg',
    'commons-tunnel-tour': 'Grand Traverse Common Tunnel.webp',
    'commons-arboretum': 'Grand Traverse Commons Historic image.webp',
    'old-mission-drive': 'Cherry Orchard 1.jpeg',
    'mission-point': 'Mission Point Lighthouse.webp',
    'suttons-bay-walk': 'Suttons Bay Marina.jpeg',
    'fishtown-walk': 'Fishtown - Shantys on Canal.jpg',
    'empire-bluff': 'Sleeping Bear Dunes from the Lake View.jpeg',
    'pyramid-point': 'Sleeping Bear Dunes Steep Dune Blue Water.webp',
    'dune-climb': 'Sleeping Bear Dunes - Dune Climb.webp',
    'pierce-stocking': 'Pierce Stocking Scenic Drive.jpg',
    'rainy-commons': 'Grand Traverse Commons 1.jpg',
    'music-house': 'The Music House Museum Outside Image.jpeg',
    'moomers': 'Moomers Ice Cream Building.jpg',
    'sara-hardy-market': 'Sara Hardy Farmers Market.jpeg',
    'glen-haven-beach': 'Glen Haven Beach 1.jpeg',
    'brys-secret-garden': 'Brys Estate - Secret Garden Lavender.webp',
    'village-store': 'Grand Travese Commons - The Village Store.webp',
    'landmark-books': 'Grand Traverse Common Shopping.jpg',
    'underground-toys': 'Grand Traverse Common Shopping.jpg',
    'sweet-asylum': 'Grand Traverse Common Shopping.jpg',
    'spanglish': 'Grand Traverse Commons 1.jpg',
    'pleasanton-bakery': 'Grand Traverse Commons 1.jpg'
  };

  const profileDefaults = {
    Parker: ['laughing-fish', 'fishtown-walk', 'horizon', 'commons-trails'],
    Blake: ['arts', 'rpm-records', 'pierce-stocking', 'commons-trails'],
    Porter: ['top-comics', 'dune-climb', 'cherry-republic-ga', 'underground-toys'],
    Mark: ['house-water', 'mission-point', 'suttons-bay-walk', 'fishtown-walk'],
    Nancy: ['laughing-fish', 'mission-point', 'fishtown', 'cherry-republic-ga'],
    Explorer: ['pierce-stocking', 'fishtown-walk', 'commons-trails', 'mission-point']
  };

  const discoveryIds = ['commons-botanic', 'music-house', 'clinch-park', 'fishtown-walk', 'moomers', 'sara-hardy-market'];

  const fieldNotes = [
    { title: 'A fossil in your pocket', text: 'Petoskey stones are fossilized colonial coral from an ancient tropical sea.', image: 'Petoskey Stones.jpeg' },
    { title: 'Why the water turns turquoise', text: 'Shallow water over pale sand reflects more light, creating those bright blue-green bands.', image: 'Traverse City - Pier and Beach access.webp' },
    { title: 'A landscape still moving', text: 'Wind continues to reshape the Sleeping Bear dunes grain by grain.', image: 'Sleeping Bear Dunes Steep Dune Blue Water 2.webp' },
    { title: 'Cherry-country weather magic', text: 'Lake Michigan softens temperature swings around northern Michigan orchards.', image: 'Cherry in Orchard close up.jpeg' },
    { title: 'History under the water', text: 'Storms, shoals, and busy shipping routes left shipwreck stories throughout the region.', image: 'Shipwreck - Paddleboat with ship underneath.jpeg' }
  ];

  const shortcuts = [
    { label: 'Explore', caption: 'Dunes, trails & water', image: 'Sleeping Bear Dunes Nataional Lakeshore Ariel Image.jpg', mode: 'explore' },
    { label: 'Eat', caption: 'Local flavor', image: 'Art Tavern Building.jpeg', mode: 'eat' },
    { label: 'Shop', caption: 'Downtown treasures', image: 'Downtown Traverse City Shopping.jpeg', mode: 'shop' },
    { label: 'House', caption: 'West Bay basecamp', image: houseAsset('IMG_9814.jpeg'), tab: 'house' }
  ];

  function traveler() {
    const stored = localStorage.getItem('tcTraveler');
    if (FAMILY.includes(stored)) return stored;
    if (typeof selectedTraveler !== 'undefined' && FAMILY.includes(selectedTraveler)) return selectedTraveler;
    return 'Explorer';
  }

  function greeting() {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  }

  function daysUntilTrip() {
    return Math.max(0, Math.ceil((new Date('2026-08-23T16:00:00') - new Date()) / 86400000));
  }

  function allPlaceRecords() {
    return typeof allPlaces !== 'undefined' && Array.isArray(allPlaces) ? allPlaces : [];
  }

  function ratingApi() {
    return window.TCHeartRatings || {
      get: () => 0,
      stats: () => ({ count: 0, total: 0, average: 0, entries: [] }),
      hearts: (score) => '♥'.repeat(Math.max(0, Math.round(score))) + '♡'.repeat(Math.max(0, 5 - Math.round(score))),
      label: () => 'Not rated',
      open: () => {},
      legend: {}
    };
  }

  function ratingFor(id, name) {
    return ratingApi().get(id, name);
  }

  function ratedIdsFor(name) {
    return allPlaceRecords()
      .map((place) => ({ id: place.id, rating: ratingFor(place.id, name) }))
      .filter((item) => item.rating > 0)
      .sort((a, b) => b.rating - a.rating || a.id.localeCompare(b.id));
  }

  function plannedCount() {
    const currentPlan = typeof plan !== 'undefined' ? plan : null;
    if (!currentPlan || typeof currentPlan !== 'object') return 0;
    return Object.values(currentPlan).flatMap((day) => Object.values(day || {}).flat()).length;
  }

  function itemImage(item) {
    return asset(placeImages[item?.id] || 'Downtown Traverse City From Above.jpeg');
  }

  function itemMode(item) {
    return item?.kind === 'restaurant' ? 'eat' : item?.kind === 'shop' ? 'shop' : 'explore';
  }

  function topPicksFor(name) {
    const records = allPlaceRecords();
    const rated = ratedIdsFor(name).filter((item) => item.rating >= 3).map((item) => item.id);
    const defaults = profileDefaults[name] || profileDefaults.Explorer;
    const ordered = [...rated, ...defaults];
    const seen = new Set();
    return ordered
      .filter((id) => !seen.has(id) && seen.add(id))
      .map((id) => records.find((place) => place.id === id))
      .filter(Boolean)
      .slice(0, 4);
  }

  function discoveriesFor(name, picks) {
    const records = allPlaceRecords();
    const excluded = new Set([...ratedIdsFor(name).map((item) => item.id), ...picks.map((item) => item.id)]);
    const preferred = discoveryIds.map((id) => records.find((place) => place.id === id)).filter((place) => place && !excluded.has(place.id));
    const backups = records.filter((place) => placeImages[place.id] && !excluded.has(place.id));
    return [...preferred, ...backups.filter((place) => !preferred.some((item) => item.id === place.id))].slice(0, 4);
  }

  function familyTopTen() {
    return allPlaceRecords()
      .map((place) => ({ place, stats: ratingApi().stats(place.id) }))
      .filter((item) => item.stats.count > 0 && placeImages[item.place.id])
      .sort((a, b) => b.stats.total - a.stats.total || b.stats.average - a.stats.average || b.stats.count - a.stats.count || a.place.name.localeCompare(b.place.name))
      .slice(0, 10);
  }

  function personalLabel(item, name) {
    const rating = ratingFor(item.id, name);
    if (rating) return `${rating}. ${ratingApi().label(rating)}`;
    if (item.kind === 'restaurant') return 'Restaurant';
    if (item.kind === 'shop') return 'Shopping';
    return 'Adventure';
  }

  function familySummary(id) {
    const stats = ratingApi().stats(id);
    if (!stats.count) return '<span class="adventure-family-rating empty">Not rated yet</span>';
    return `<span class="adventure-family-rating" title="${safe(stats.entries.map((entry) => `${entry.name}: ${entry.rating}`).join(' · '))}"><strong>${stats.average.toFixed(1)}</strong><span>${ratingApi().hearts(stats.average)}</span><small>${stats.count} rated</small></span>`;
  }

  function placeCard(item, name, extraClass = '') {
    const rating = ratingFor(item.id, name);
    return `
      <article class="adventure-place-card ${extraClass}" data-place-id="${safe(item.id)}">
        <button class="adventure-card-open" type="button" data-place-open="${safe(item.id)}" data-place-mode="${itemMode(item)}" aria-label="Open ${safe(item.name)} in Places">
          <img src="${itemImage(item)}" alt="${safe(item.name)}">
          <span class="adventure-place-shade"></span>
          <span class="adventure-place-copy">
            <small>${safe(personalLabel(item, name))}</small>
            <strong>${safe(item.name)}</strong>
            <span>${safe(item.area || item.town || '')}</span>
          </span>
        </button>
        ${familySummary(item.id)}
        <button class="adventure-rate-button ${rating ? 'active' : ''}" type="button" data-dashboard-rate="${safe(item.id)}" aria-label="Rate ${safe(item.name)} from one to five hearts">
          <span>${rating ? ratingApi().hearts(rating) : '♡♡♡♡♡'}</span>
          <small>${rating ? ratingApi().label(rating) : 'Rate it'}</small>
        </button>
      </article>`;
  }

  function shortcutCard(item) {
    const data = item.mode ? `data-open-mode="${item.mode}"` : `data-open-tab="${item.tab}"`;
    return `
      <button class="adventure-shortcut" type="button" ${data}>
        <img src="${item.image}" alt="">
        <span></span>
        <strong>${item.label}<small>${item.caption}</small></strong>
      </button>`;
  }

  function familyCard(item, rank, name) {
    const { place, stats } = item;
    const personal = ratingFor(place.id, name);
    return `
      <article class="family-top-card">
        <button class="family-top-open" type="button" data-place-open="${safe(place.id)}" data-place-mode="${itemMode(place)}">
          <img src="${itemImage(place)}" alt="${safe(place.name)}">
          <span class="family-top-shade"></span>
          <b>#${rank}</b>
          <span class="family-top-copy"><strong>${safe(place.name)}</strong><small>${safe(place.area || place.town || '')}</small></span>
        </button>
        <div class="family-top-score"><strong>${stats.average.toFixed(1)}</strong><span>${ratingApi().hearts(stats.average)}</span><small>${stats.count} of 5 rated</small></div>
        <button class="family-top-rate ${personal ? 'active' : ''}" type="button" data-dashboard-rate="${safe(place.id)}">${personal ? `${ratingApi().hearts(personal)} ${ratingApi().label(personal)}` : 'Add my rating'}</button>
      </article>`;
  }

  function legendMarkup() {
    const legend = ratingApi().legend || {};
    return [5, 4, 3, 2, 1].map((score) => `
      <div class="adventure-legend-item">
        <span>${ratingApi().hearts(score)}</span>
        <strong>${score}. ${safe(legend[score]?.title || '')}</strong>
        <small>${safe(legend[score]?.detail || '')}</small>
      </div>`).join('');
  }

  function openPlaces(mode = 'explore', placeId = '') {
    if (window.TCPlaces?.open) {
      window.TCPlaces.open(mode, placeId ? { placeId } : {});
      return;
    }
    if (typeof showTab === 'function') showTab('places');
    window.setTimeout(() => window.TCPlaces?.open(mode, placeId ? { placeId } : {}), 140);
  }

  function openTab(tab) {
    if (typeof showTab === 'function') showTab(tab);
    else document.querySelector(`.bottom-nav [data-tab="${tab}"]`)?.click();
  }

  function render() {
    const name = traveler();
    const rated = ratedIdsFor(name);
    const picks = topPicksFor(name);
    const discoveries = discoveriesFor(name, picks);
    const familyPicks = familyTopTen();
    const fieldNote = fieldNotes[new Date().getDate() % fieldNotes.length];
    const remaining = Math.max(0, allPlaceRecords().length - rated.length);

    home.className = 'tab-panel active your-adventure';
    home.innerHTML = `
      <section class="adventure-hero">
        <img src="${asset('Downtown Traverse City From Above.jpeg')}" alt="Downtown Traverse City and Grand Traverse Bay from above">
        <span class="adventure-hero-shade"></span>
        <div class="adventure-hero-content">
          <div>
            <p class="eyebrow">Your Adventure</p>
            <h2>${greeting()}, ${safe(name)}.</h2>
            <p>Rate every possibility from one to five hearts. Your favorites stay personal while the Family Top 10 reveals where the trip has real gravitational pull.</p>
          </div>
          <div class="adventure-stat-strip" aria-label="Trip status">
            <span><strong>${daysUntilTrip()}</strong><small>days to go</small></span>
            <span><strong>${rated.length}</strong><small>places rated</small></span>
            <span><strong>${plannedCount()}</strong><small>planned stops</small></span>
          </div>
        </div>
      </section>

      <section class="adventure-signal-row">
        <button class="adventure-next-step" type="button" data-open-mode="explore">
          <img src="${asset('Cherry in Orchard close up.jpeg')}" alt="Ripe cherries in a northern Michigan orchard">
          <span class="adventure-signal-shade"></span>
          <span class="adventure-signal-copy">
            <small>Your next step</small>
            <strong>${remaining ? 'Keep rating possibilities' : 'Your ratings are complete'}</strong>
            <span>${remaining ? `${remaining} places are still waiting for your verdict.` : 'The Family Top 10 is ready to guide the plan.'}</span>
          </span>
          <b>→</b>
        </button>

        <article class="adventure-field-note">
          <img src="${asset(fieldNote.image)}" alt="">
          <div><small>Field note</small><strong>${fieldNote.title}</strong><p>${fieldNote.text}</p></div>
        </article>
      </section>

      <section class="adventure-rating-legend" aria-label="One through five heart rating legend">
        <div class="adventure-legend-head"><p class="eyebrow dark">The family heart scale</p><h3>Say what you actually mean.</h3></div>
        <div class="adventure-legend-grid">${legendMarkup()}</div>
      </section>

      <section class="adventure-columns" aria-label="Personal favorites and new discoveries">
        <div class="adventure-list-section">
          <div class="adventure-list-head">
            <div><p class="eyebrow dark">Your highest ratings</p><h3>Your Favorites</h3></div>
            <button type="button" data-open-mode="explore">See all →</button>
          </div>
          <div class="adventure-card-rail">${picks.map((item) => placeCard(item, name)).join('') || '<p class="adventure-empty">Rate a few places and your favorites will gather here.</p>'}</div>
        </div>

        <div class="adventure-list-section">
          <div class="adventure-list-head">
            <div><p class="eyebrow dark">Fresh possibilities</p><h3>Explore Something New</h3></div>
            <button type="button" data-open-mode="explore">Wander →</button>
          </div>
          <div class="adventure-card-rail">${discoveries.map((item) => placeCard(item, name, 'discovery-place-card')).join('')}</div>
        </div>
      </section>

      <section class="adventure-quick-section">
        <div class="adventure-list-head"><div><p class="eyebrow dark">Choose your next move</p><h3>Four Ways Into the Trip</h3></div></div>
        <div class="adventure-shortcut-row">${shortcuts.map(shortcutCard).join('')}</div>
      </section>

      <section class="family-top-section">
        <div class="adventure-list-head">
          <div><p class="eyebrow dark">The shared signal</p><h3>Family Top 10</h3></div>
          <span class="family-top-note">Ranked by combined hearts, then family average.</span>
        </div>
        <div class="family-top-rail">
          ${familyPicks.length ? familyPicks.map((item, index) => familyCard(item, index + 1, name)).join('') : '<p class="adventure-empty">Once the family starts rating places, the Top 10 will build itself here.</p>'}
        </div>
      </section>`;

    home.querySelectorAll('[data-open-mode]').forEach((button) => button.addEventListener('click', () => openPlaces(button.dataset.openMode)));
    home.querySelectorAll('[data-open-tab]').forEach((button) => button.addEventListener('click', () => openTab(button.dataset.openTab)));
    home.querySelectorAll('[data-place-open]').forEach((button) => button.addEventListener('click', () => openPlaces(button.dataset.placeMode, button.dataset.placeOpen)));
    home.querySelectorAll('[data-dashboard-rate]').forEach((button) => button.addEventListener('click', (event) => {
      event.stopPropagation();
      ratingApi().open(button.dataset.dashboardRate);
    }));
  }

  render();

  document.getElementById('profilePill')?.addEventListener('click', () => window.setTimeout(render, 250));
  window.addEventListener('storage', (event) => {
    if (['tcTraveler', 'tcHeartRatings', 'tcPlanV3'].includes(event.key)) render();
  });
  document.addEventListener('tc-ratings-changed', () => window.setTimeout(render, 60));
  document.addEventListener('tc-places-ready', () => window.setTimeout(render, 80));
  document.addEventListener('tc-shared-ready', () => window.setTimeout(render, 120));
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-explorer-name]')) window.setTimeout(render, 140);
    if (event.target.closest('[data-add], .remove-stop, #clearPlan')) window.setTimeout(render, 120);
    if (event.target.closest('.bottom-nav [data-tab="home"], .mini-brand[data-tab="home"]')) window.setTimeout(render, 40);
  });
})();
