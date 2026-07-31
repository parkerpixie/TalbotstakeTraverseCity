(() => {
  const home = document.querySelector('[data-panel="home"]');
  if (!home) return;

  const FAMILY = ['Parker', 'Blake', 'Porter', 'Mark', 'Nancy'];
  const asset = (filename) => `Assets/${filename.split('/').map(encodeURIComponent).join('/')}`;
  const houseAsset = (filename) => asset(`Assets/Images/${filename}`);

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

  const shortcutItems = [
    { label: 'Explore', caption: 'Dunes, trails & water', image: 'Sleeping Bear Dunes Nataional Lakeshore Ariel Image.jpg', mode: 'explore' },
    { label: 'Eat', caption: 'Local flavor', image: 'Art Tavern Building.jpeg', mode: 'eat' },
    { label: 'Shop', caption: 'Downtown treasures', image: 'Downtown Traverse City Shopping.jpeg', mode: 'shop' },
    { label: 'House', caption: 'West Bay basecamp', image: houseAsset('IMG_9814.jpeg'), tab: 'house', isPath: true }
  ];

  function traveler() {
    const saved = localStorage.getItem('tcTraveler');
    return saved && saved !== 'Everyone' ? saved : 'Explorer';
  }

  function greeting() {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  }

  function daysUntilTrip() {
    return Math.max(0, Math.ceil((new Date('2026-08-23T16:00:00') - new Date()) / 86400000));
  }

  function readFavoriteOwners() {
    try {
      const value = JSON.parse(localStorage.getItem('tcFavoriteOwners') || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  }

  function allPlaceRecords() {
    return typeof allPlaces !== 'undefined' && Array.isArray(allPlaces) ? allPlaces : [];
  }

  function favoriteIdsFor(name) {
    const owners = readFavoriteOwners();
    const owned = Object.entries(owners)
      .filter(([, names]) => Array.isArray(names) && names.includes(name))
      .map(([id]) => id);

    if (Object.keys(owners).length) return owned;

    try {
      return JSON.parse(localStorage.getItem('tcFavoritesV3') || '[]');
    } catch {
      return [];
    }
  }

  function plannedCount() {
    const currentPlan = typeof plan !== 'undefined' ? plan : null;
    if (!currentPlan || typeof currentPlan !== 'object') return 0;
    return Object.values(currentPlan).flatMap((day) => Object.values(day || {}).flat()).length;
  }

  function heartNames(id) {
    const owners = readFavoriteOwners();
    return Array.isArray(owners[id]) ? owners[id].filter((name) => FAMILY.includes(name)) : [];
  }

  function heartMeter(id) {
    const names = heartNames(id);
    const label = names.length ? `${names.length} of ${FAMILY.length} family hearts: ${names.join(', ')}` : 'No family hearts yet';
    return `<span class="adventure-heart-meter" aria-label="${label}" title="${label}">${FAMILY.map((_, index) => `<i class="${index < names.length ? 'filled' : ''}">♥</i>`).join('')}</span>`;
  }

  function itemImage(item) {
    const filename = placeImages[item?.id];
    return filename ? asset(filename) : asset('Downtown Traverse City From Above.jpeg');
  }

  function itemMode(item) {
    return item?.kind === 'restaurant' ? 'eat' : item?.kind === 'shop' ? 'shop' : 'explore';
  }

  function topPicksFor(name) {
    const records = allPlaceRecords();
    const selectedIds = favoriteIdsFor(name);
    const defaults = profileDefaults[name] || profileDefaults.Explorer;
    const orderedIds = [...selectedIds, ...defaults];
    const seen = new Set();

    return orderedIds
      .filter((id) => {
        if (seen.has(id) || !placeImages[id]) return false;
        seen.add(id);
        return true;
      })
      .map((id) => records.find((place) => place.id === id))
      .filter(Boolean)
      .slice(0, 4);
  }

  function discoveriesFor(name, picks) {
    const records = allPlaceRecords();
    const excluded = new Set([...favoriteIdsFor(name), ...picks.map((item) => item.id)]);
    const preferred = discoveryIds
      .map((id) => records.find((place) => place.id === id))
      .filter((place) => place && !excluded.has(place.id));
    const backups = records.filter((place) => placeImages[place.id] && !excluded.has(place.id));
    return [...preferred, ...backups.filter((place) => !preferred.some((item) => item.id === place.id))].slice(0, 4);
  }

  function familyTopTen() {
    const records = allPlaceRecords();
    const owners = readFavoriteOwners();
    return records
      .map((place) => ({ ...place, hearts: Array.isArray(owners[place.id]) ? owners[place.id].filter((name) => FAMILY.includes(name)).length : 0 }))
      .filter((place) => place.hearts > 0 && placeImages[place.id])
      .sort((a, b) => b.hearts - a.hearts || a.name.localeCompare(b.name))
      .slice(0, 10);
  }

  function typeLabel(item, name) {
    if (favoriteIdsFor(name).includes(item.id)) return 'Saved by you';
    if (item.kind === 'restaurant') return 'Restaurant';
    if (item.kind === 'shop') return 'Shop';
    return 'Adventure';
  }

  function placeCard(item, name, extraClass = '') {
    const isMine = favoriteIdsFor(name).includes(item.id);
    const mode = itemMode(item);
    return `
      <article class="adventure-place-card ${extraClass}" data-place-id="${item.id}">
        <button class="adventure-card-open" type="button" data-place-open="${item.id}" data-place-mode="${mode}" aria-label="Open ${item.name} in Places">
          <img src="${itemImage(item)}" alt="${item.name}">
          <span class="adventure-place-shade"></span>
          <span class="adventure-place-copy">
            <small>${typeLabel(item, name)}</small>
            <strong>${item.name}</strong>
            <span>${item.area || item.town || ''}</span>
          </span>
        </button>
        ${heartMeter(item.id)}
        <button class="adventure-heart-button ${isMine ? 'active' : ''}" type="button" data-dashboard-heart="${item.id}" aria-label="${isMine ? 'Remove' : 'Add'} ${name}'s heart for ${item.name}" title="${isMine ? 'Remove your heart' : 'Add your heart'}">${isMine ? '♥' : '♡'}</button>
      </article>`;
  }

  function shortcutCard(item) {
    const image = item.isPath ? item.image : asset(item.image);
    const data = item.mode ? `data-open-mode="${item.mode}"` : `data-open-tab="${item.tab}"`;
    return `
      <button class="adventure-shortcut" type="button" ${data}>
        <img src="${image}" alt="">
        <span></span>
        <strong>${item.label}<small>${item.caption}</small></strong>
      </button>`;
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
    if (typeof showTab === 'function') {
      showTab(tab);
      return;
    }
    document.querySelector(`.bottom-nav [data-tab="${tab}"]`)?.click();
  }

  function toggleHeart(id) {
    if (typeof toggleFavorite === 'function') toggleFavorite(id);
    window.setTimeout(render, 120);
  }

  function render() {
    const name = traveler();
    const selectedIds = favoriteIdsFor(name);
    const picks = topPicksFor(name);
    const discoveries = discoveriesFor(name, picks);
    const familyPicks = familyTopTen();
    const fieldNote = fieldNotes[new Date().getDate() % fieldNotes.length];
    const remaining = Math.max(0, allPlaceRecords().length - selectedIds.length);

    home.className = 'tab-panel active your-adventure';
    home.innerHTML = `
      <section class="adventure-hero">
        <img src="${asset('Downtown Traverse City From Above.jpeg')}" alt="Downtown Traverse City and Grand Traverse Bay from above">
        <span class="adventure-hero-shade"></span>
        <div class="adventure-hero-content">
          <div>
            <p class="eyebrow">Your Adventure</p>
            <h2>${greeting()}, ${name}.</h2>
            <p>Your personal field guide is filling in. Give places your heart and let the family overlap reveal the trip.</p>
          </div>
          <div class="adventure-stat-strip" aria-label="Trip status">
            <span><strong>${daysUntilTrip()}</strong><small>days to go</small></span>
            <span><strong>${selectedIds.length}</strong><small>your hearts</small></span>
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
            <strong>${remaining ? 'Keep exploring' : 'Your shortlist is ready'}</strong>
            <span>${remaining ? `${remaining} places are still waiting for your verdict.` : 'Open Places to review the family favorites, then shape the five days.'}</span>
          </span>
          <b>→</b>
        </button>

        <article class="adventure-field-note">
          <img src="${asset(fieldNote.image)}" alt="">
          <div><small>Field note</small><strong>${fieldNote.title}</strong><p>${fieldNote.text}</p></div>
        </article>
      </section>

      <section class="adventure-columns" aria-label="Personal picks and new discoveries">
        <div class="adventure-list-section">
          <div class="adventure-list-head">
            <div><p class="eyebrow dark">Personal favorites</p><h3>${selectedIds.length ? 'Your Top Picks' : `Made for ${name}`}</h3></div>
            <button type="button" data-open-mode="explore">See all →</button>
          </div>
          <div class="adventure-card-rail">
            ${picks.length ? picks.map((item) => placeCard(item, name)).join('') : '<p class="adventure-empty">Start exploring and your hearted places will appear here.</p>'}
          </div>
        </div>

        <div class="adventure-list-section">
          <div class="adventure-list-head">
            <div><p class="eyebrow dark">Fresh possibilities</p><h3>Explore Something New</h3></div>
            <button type="button" data-open-mode="explore">Wander →</button>
          </div>
          <div class="adventure-card-rail">
            ${discoveries.map((item) => placeCard(item, name, 'discovery-place-card')).join('')}
          </div>
        </div>
      </section>

      <section class="adventure-family-section">
        <div class="adventure-list-head family-list-head">
          <div><p class="eyebrow dark">Where the hearts overlap</p><h3>Family Top 10</h3><p>Every traveler gets one heart per place. The family favorites rise here automatically.</p></div>
          <button type="button" data-open-mode="explore">Open Places →</button>
        </div>
        ${familyPicks.length
          ? `<div class="adventure-family-rail">${familyPicks.map((item, index) => placeCard(item, name, `family-place-card rank-${index + 1}`)).join('')}</div>`
          : `<div class="adventure-family-empty"><strong>The leaderboard is waiting.</strong><span>Add hearts in Places and the family’s shared Top 10 will build itself.</span><button type="button" data-open-mode="explore">Start voting</button></div>`}
      </section>

      <section class="adventure-choose-section">
        <div class="adventure-list-head">
          <div><p class="eyebrow dark">Choose your next lane</p><h3>What are we in the mood for?</h3></div>
        </div>
        <div class="adventure-shortcut-row" aria-label="Trip sections">${shortcutItems.map(shortcutCard).join('')}</div>
      </section>`;

    home.querySelectorAll('[data-open-mode]').forEach((button) => button.addEventListener('click', () => openPlaces(button.dataset.openMode)));
    home.querySelectorAll('[data-open-tab]').forEach((button) => button.addEventListener('click', () => openTab(button.dataset.openTab)));
    home.querySelectorAll('[data-place-open]').forEach((button) => button.addEventListener('click', () => openPlaces(button.dataset.placeMode, button.dataset.placeOpen)));
    home.querySelectorAll('[data-dashboard-heart]').forEach((button) => button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleHeart(button.dataset.dashboardHeart);
    }));
  }

  render();

  document.getElementById('profilePill')?.addEventListener('click', () => window.setTimeout(render, 250));
  window.addEventListener('storage', (event) => {
    if (['tcTraveler', 'tcFavoriteOwners', 'tcFavoritesV3', 'tcPlanV3'].includes(event.key)) render();
  });
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-explorer-name]')) window.setTimeout(render, 120);
    if (event.target.closest('[data-save], [data-add], .remove-stop, #clearPlan')) window.setTimeout(render, 140);
    if (event.target.closest('.bottom-nav [data-tab="home"], .mini-brand[data-tab="home"]')) window.setTimeout(render, 40);
  });
  document.addEventListener('tc-shared-ready', () => window.setTimeout(render, 120));
  document.addEventListener('tc-places-ready', () => window.setTimeout(render, 80));
  document.addEventListener('tc-favorites-changed', () => window.setTimeout(render, 60));
})();
