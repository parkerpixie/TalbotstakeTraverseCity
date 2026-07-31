(() => {
  const home = document.querySelector('[data-panel="home"]');
  if (!home) return;

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
    'old-mission-drive': 'Cherry Orchard 1.jpeg',
    'mission-point': 'Mission Point Lighthouse.webp',
    'suttons-bay-walk': 'Suttons Bay Marina.jpeg',
    'fishtown-walk': 'Fishtown - Shantys on Canal.jpg',
    'empire-bluff': 'Sleeping Bear Dunes from the Lake View.jpeg',
    'pyramid-point': 'Sleeping Bear Dunes Steep Dune Blue Water.webp',
    'dune-climb': 'Sleeping Bear Dunes - Dune Climb.webp',
    'pierce-stocking': 'Pierce Stocking Scenic Drive.jpg',
    'rainy-commons': 'Grand Traverse Commons 1.jpg'
  };

  const profileDefaults = {
    Parker: ['laughing-fish', 'fishtown-walk', 'horizon', 'commons-trails'],
    Blake: ['arts', 'rpm-records', 'pierce-stocking', 'commons-trails'],
    Porter: ['top-comics', 'dune-climb', 'cherry-republic-ga', 'commons-trails'],
    Mark: ['house-water', 'mission-point', 'suttons-bay-walk', 'fishtown-walk'],
    Nancy: ['laughing-fish', 'mission-point', 'fishtown', 'cherry-republic-ga'],
    Explorer: ['pierce-stocking', 'fishtown-walk', 'commons-trails', 'mission-point']
  };

  const discoveries = [
    {
      type: 'Garden wander',
      name: 'The Botanic Garden at Historic Barns Park',
      image: 'Grand Traverse Commons - Botanical Garden 1.jpg',
      tab: 'explore'
    },
    {
      type: 'Curious stop',
      name: 'The Music House Museum',
      image: 'The Music House Museum Outside Image.jpeg',
      tab: 'explore'
    },
    {
      type: 'Waterfront pause',
      name: 'Clinch Park at Sunset',
      image: 'Clinch Park Beach at Sunset.jpg',
      placeId: 'clinch-park'
    },
    {
      type: 'Historic wandering',
      name: 'Fishtown Shanties & Harbor',
      image: 'Fishtown - Shantys on Canal 2.webp',
      placeId: 'fishtown-walk'
    }
  ];

  const fieldNotes = [
    {
      title: 'A fossil in your pocket',
      text: 'Petoskey stones are fossilized colonial coral from an ancient tropical sea.',
      image: 'Petoskey Stones.jpeg'
    },
    {
      title: 'Why the water turns turquoise',
      text: 'Shallow water over pale sand reflects more light, creating those bright blue-green bands.',
      image: 'Traverse City - Pier and Beach access.webp'
    },
    {
      title: 'A landscape still moving',
      text: 'Wind continues to reshape the Sleeping Bear dunes grain by grain.',
      image: 'Sleeping Bear Dunes Steep Dune Blue Water 2.webp'
    },
    {
      title: 'Cherry-country weather magic',
      text: 'Lake Michigan softens temperature swings around northern Michigan orchards.',
      image: 'Cherry in Orchard close up.jpeg'
    },
    {
      title: 'History under the water',
      text: 'Storms, shoals, and busy shipping routes left shipwreck stories throughout the region.',
      image: 'Shipwreck - Paddleboat with ship underneath.jpeg'
    }
  ];

  const shortcutItems = [
    { label: 'Explore', caption: 'Dunes, trails & water', image: 'Sleeping Bear Dunes Nataional Lakeshore Ariel Image.jpg', tab: 'explore' },
    { label: 'Eat', caption: 'Local flavor', image: 'Art Tavern Building.jpeg', tab: 'eat' },
    { label: 'Shop', caption: 'Downtown treasures', image: 'Downtown Traverse City Shopping.jpeg', tab: 'shop' },
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

    if (owned.length) return owned;

    try {
      return JSON.parse(localStorage.getItem('tcFavoritesV3') || '[]');
    } catch {
      return [];
    }
  }

  function plannedCount() {
    const currentPlan = typeof plan !== 'undefined' ? plan : null;
    if (!currentPlan || typeof currentPlan !== 'object') return 0;
    return Object.values(currentPlan)
      .flatMap((day) => Object.values(day || {}).flat())
      .length;
  }

  function itemImage(item) {
    const filename = placeImages[item.id];
    return filename ? asset(filename) : '';
  }

  function itemTab(item) {
    return item.kind === 'restaurant' ? 'eat' : item.kind === 'shop' ? 'shop' : 'explore';
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
      .slice(0, 4)
      .map((place) => ({
        ...place,
        image: itemImage(place),
        tab: itemTab(place),
        savedByTraveler: selectedIds.includes(place.id)
      }));
  }

  function typeLabel(item) {
    if (item.savedByTraveler) return 'Saved by you';
    if (item.kind === 'restaurant') return 'Restaurant';
    if (item.kind === 'shop') return 'Shop';
    return 'Adventure';
  }

  function placeCard(item) {
    return `
      <button class="adventure-place-card" type="button" data-place-id="${item.id}" data-tab-target="${item.tab}">
        <img src="${item.image}" alt="${item.name}">
        <span class="adventure-place-shade"></span>
        <span class="adventure-place-copy">
          <small>${typeLabel(item)}</small>
          <strong>${item.name}</strong>
          <span>${item.area || ''}</span>
        </span>
        ${item.savedByTraveler ? '<span class="adventure-saved-mark" aria-label="Saved by you">♥</span>' : ''}
      </button>`;
  }

  function discoveryCard(item) {
    const image = asset(item.image);
    return `
      <button class="adventure-place-card discovery-place-card" type="button" ${item.placeId ? `data-place-id="${item.placeId}"` : ''} data-tab-target="${item.tab || 'explore'}">
        <img src="${image}" alt="${item.name}">
        <span class="adventure-place-shade"></span>
        <span class="adventure-place-copy">
          <small>${item.type}</small>
          <strong>${item.name}</strong>
        </span>
      </button>`;
  }

  function shortcutCard(item) {
    const image = item.isPath ? item.image : asset(item.image);
    return `
      <button class="adventure-shortcut" type="button" data-tab-target="${item.tab}">
        <img src="${image}" alt="">
        <span></span>
        <strong>${item.label}<small>${item.caption}</small></strong>
      </button>`;
  }

  function goToTab(tab) {
    const navButton = document.querySelector(`.bottom-nav [data-tab="${tab}"]`);
    const fallback = document.querySelector(`.mini-brand[data-tab="${tab}"]`);
    (navButton || fallback)?.click();
  }

  function focusPlace(id, requestedTab) {
    const place = allPlaceRecords().find((item) => item.id === id);
    const tab = place ? itemTab(place) : requestedTab || 'explore';
    goToTab(tab);
    if (!place) return;

    const searchIds = { eat: 'restaurantSearch', shop: 'shopSearch', explore: 'activitySearch' };
    window.setTimeout(() => {
      const field = document.getElementById(searchIds[tab]);
      if (!field) return;
      field.value = place.name;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  }

  function render() {
    const name = traveler();
    const selectedIds = favoriteIdsFor(name);
    const picks = topPicksFor(name);
    const fieldNote = fieldNotes[new Date().getDate() % fieldNotes.length];
    const totalPlaces = allPlaceRecords().length;
    const remaining = Math.max(0, totalPlaces - selectedIds.length);

    home.className = 'tab-panel active your-adventure';
    home.innerHTML = `
      <section class="adventure-hero">
        <img src="${asset('Downtown Traverse City From Above.jpeg')}" alt="Downtown Traverse City and Grand Traverse Bay from above">
        <span class="adventure-hero-shade"></span>
        <div class="adventure-hero-content">
          <div>
            <p class="eyebrow">Your Adventure</p>
            <h2>${greeting()}, ${name}.</h2>
            <p>Your personal field guide is filling in. Save what sounds good and let the family overlap reveal the trip.</p>
          </div>
          <div class="adventure-stat-strip" aria-label="Trip status">
            <span><strong>${daysUntilTrip()}</strong><small>days to go</small></span>
            <span><strong>${selectedIds.length}</strong><small>your saves</small></span>
            <span><strong>${plannedCount()}</strong><small>planned stops</small></span>
          </div>
        </div>
      </section>

      <section class="adventure-signal-row">
        <button class="adventure-next-step" type="button" data-tab-target="explore">
          <img src="${asset('Cherry in Orchard close up.jpeg')}" alt="Ripe cherries in a northern Michigan orchard">
          <span class="adventure-signal-shade"></span>
          <span class="adventure-signal-copy">
            <small>Your next step</small>
            <strong>${remaining ? 'Keep exploring' : 'Your shortlist is ready'}</strong>
            <span>${remaining ? `${remaining} places are still waiting for your verdict.` : 'Open the planner and start shaping the five days.'}</span>
          </span>
          <b>→</b>
        </button>

        <article class="adventure-field-note">
          <img src="${asset(fieldNote.image)}" alt="">
          <div>
            <small>Field note</small>
            <strong>${fieldNote.title}</strong>
            <p>${fieldNote.text}</p>
          </div>
        </article>
      </section>

      <section class="adventure-columns">
        <div class="adventure-list-section">
          <div class="adventure-list-head">
            <div><p class="eyebrow dark">Personal shortlist</p><h3>${selectedIds.length ? 'Your Top Picks' : `Made for ${name}`}</h3></div>
            <button type="button" data-tab-target="explore">See all →</button>
          </div>
          <div class="adventure-card-rail">
            ${picks.length ? picks.map(placeCard).join('') : '<p class="adventure-empty">Start exploring and your saved places will appear here.</p>'}
          </div>
        </div>

        <div class="adventure-list-section">
          <div class="adventure-list-head">
            <div><p class="eyebrow dark">Fresh possibilities</p><h3>New Discoveries</h3></div>
            <button type="button" data-tab-target="explore">Wander →</button>
          </div>
          <div class="adventure-card-rail">
            ${discoveries.map(discoveryCard).join('')}
          </div>
        </div>
      </section>

      <section class="adventure-shortcut-row" aria-label="Trip sections">
        ${shortcutItems.map(shortcutCard).join('')}
      </section>`;

    home.querySelectorAll('[data-tab-target]').forEach((button) => {
      button.addEventListener('click', () => {
        const placeId = button.dataset.placeId;
        if (placeId) focusPlace(placeId, button.dataset.tabTarget);
        else goToTab(button.dataset.tabTarget);
      });
    });
  }

  render();

  const profile = document.getElementById('profilePill');
  profile?.addEventListener('click', () => window.setTimeout(render, 250));
  window.addEventListener('storage', (event) => {
    if (['tcTraveler', 'tcFavoriteOwners', 'tcFavoritesV3', 'tcPlanV3'].includes(event.key)) render();
  });
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-explorer-name]')) window.setTimeout(render, 120);
    if (event.target.closest('[data-save]')) window.setTimeout(render, 120);
  });
  document.addEventListener('tc-shared-ready', () => window.setTimeout(render, 120));
})();
