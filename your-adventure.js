(() => {
  const home = document.querySelector('[data-panel="home"]');
  if (!home) return;

  const asset = (filename) => `Assets/${filename.split('/').map(encodeURIComponent).join('/')}`;

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
    return Object.values(currentPlan)
      .flatMap((day) => Object.values(day || {}).flat())
      .length;
  }

  function placeCount() {
    return typeof allPlaces !== 'undefined' && Array.isArray(allPlaces) ? allPlaces.length : 0;
  }

  function openPlaces(mode = 'explore') {
    if (window.TCPlaces?.open) {
      window.TCPlaces.open(mode);
      return;
    }

    if (typeof showTab === 'function') showTab(mode);
    window.setTimeout(() => window.TCPlaces?.open(mode), 120);
  }

  function render() {
    const name = traveler();
    const selectedIds = favoriteIdsFor(name);
    const fieldNote = fieldNotes[new Date().getDate() % fieldNotes.length];
    const remaining = Math.max(0, placeCount() - selectedIds.length);

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
        <button class="adventure-next-step" type="button" data-open-places="explore">
          <img src="${asset('Cherry in Orchard close up.jpeg')}" alt="Ripe cherries in a northern Michigan orchard">
          <span class="adventure-signal-shade"></span>
          <span class="adventure-signal-copy">
            <small>Your next step</small>
            <strong>${remaining ? 'Keep exploring' : 'Your shortlist is ready'}</strong>
            <span>${remaining ? `${remaining} places are still waiting for your verdict.` : 'Open Places to review your shortlist, then shape the five days.'}</span>
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
      </section>`;

    home.querySelector('[data-open-places]')?.addEventListener('click', (event) => {
      openPlaces(event.currentTarget.dataset.openPlaces);
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
    if (event.target.closest('[data-save], [data-add], .remove-stop, #clearPlan')) window.setTimeout(render, 120);
    if (event.target.closest('.bottom-nav [data-tab="home"], .mini-brand[data-tab="home"]')) window.setTimeout(render, 40);
  });
  document.addEventListener('tc-shared-ready', () => window.setTimeout(render, 120));
})();
