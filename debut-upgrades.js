(() => {
  const getFavorites = () => {
    try { return JSON.parse(localStorage.getItem('tcFavoritesV3') || localStorage.getItem('tcFavoritesV2') || '[]'); }
    catch { return []; }
  };

  const mapsUrl = place => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${place.area}, Michigan`)}`;
  const appleMapsUrl = place => `https://maps.apple.com/?q=${encodeURIComponent(`${place.name}, ${place.area}, Michigan`)}`;

  function addMapButtons() {
    document.querySelectorAll('.place-card').forEach(card => {
      if (card.querySelector('.map-actions')) return;
      const title = card.querySelector('h3')?.textContent?.trim();
      const place = allPlaces.find(item => item.name === title);
      if (!place || place.area === 'At the House') return;
      const actions = card.querySelector('.card-actions');
      if (!actions) return;
      const maps = document.createElement('div');
      maps.className = 'map-actions';
      maps.innerHTML = `<a href="${appleMapsUrl(place)}" target="_blank" rel="noopener"> Maps</a><a href="${mapsUrl(place)}" target="_blank" rel="noopener">Google Maps</a>`;
      actions.before(maps);
    });
  }

  const favoritesDialog = document.createElement('dialog');
  favoritesDialog.className = 'favorites-dialog';
  favoritesDialog.innerHTML = `<button class="dialog-close" aria-label="Close">×</button><p class="eyebrow dark">Family shortlist</p><h2>Saved places</h2><p class="favorites-help">These are the ideas your family has saved. Open one in Maps or head to Plan to build the week.</p><div id="favoritesList" class="favorites-list"></div><button class="primary favorites-plan">Open the planner</button>`;
  document.body.appendChild(favoritesDialog);

  function renderFavorites() {
    const ids = getFavorites();
    const items = ids.map(id => allPlaces.find(place => place.id === id)).filter(Boolean);
    const list = favoritesDialog.querySelector('#favoritesList');
    list.innerHTML = items.length ? items.map(place => `<article class="favorite-row"><div><strong>${place.icon} ${place.name}</strong><small>${typeLabel(place)} · ${place.area}</small></div><div class="favorite-row-actions">${place.area === 'At the House' ? '' : `<a href="${appleMapsUrl(place)}" target="_blank" rel="noopener">Directions</a>`}<button data-remove-favorite="${place.id}">Remove</button></div></article>`).join('') : `<div class="favorites-empty"><span>♡</span><strong>No saved places yet</strong><p>Browse Eat, Explore, or Shop and tap Save on anything worth discussing.</p></div>`;
    favoritesDialog.querySelectorAll('[data-remove-favorite]').forEach(button => button.onclick = async () => {
      const current = getFavorites().filter(id => id !== button.dataset.removeFavorite);
      localStorage.setItem('tcFavoritesV3', JSON.stringify(current));
      favorites = current;
      renderRestaurants(); renderShops(); renderActivities(); renderPlanner(); updateStats();
      renderFavorites();
      const count = document.getElementById('savedHeaderCount'); if (count) count.textContent = current.length;
      try { await window.TCShared?.write('favorites', current); }
      catch (error) { console.warn('Favorite removal saved on this phone only:', error?.message); }
    });
  }

  const savedButton = document.getElementById('savedHeader');
  if (savedButton) {
    const replacement = savedButton.cloneNode(true);
    savedButton.replaceWith(replacement);
    replacement.addEventListener('click', () => { renderFavorites(); favoritesDialog.showModal(); });
  }
  favoritesDialog.querySelector('.dialog-close').onclick = () => favoritesDialog.close();
  favoritesDialog.querySelector('.favorites-plan').onclick = () => { favoritesDialog.close(); showTab('planner'); };

  function addInstallCard() {
    const home = document.querySelector('[data-panel="home"]');
    if (!home || document.querySelector('.install-card')) return;
    const card = document.createElement('section');
    card.className = 'install-card';
    card.innerHTML = `<div><p class="eyebrow dark">Put it on your phone</p><h3>Save this guide like an app</h3><p id="installCopy">Open the browser menu and choose Add to Home Screen. It will launch full-screen with its own icon.</p></div><button class="primary" id="installAppButton">Install app</button>`;
    home.appendChild(card);
    let promptEvent = null;
    window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); promptEvent = event; card.querySelector('#installAppButton').hidden = false; });
    const button = card.querySelector('#installAppButton');
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIOS) {
      button.textContent = 'How to save it';
      button.onclick = () => alert('On iPhone: tap the Share button in Safari, scroll down, then choose “Add to Home Screen.”');
    } else {
      button.onclick = async () => {
        if (promptEvent) { promptEvent.prompt(); await promptEvent.userChoice; promptEvent = null; }
        else alert('Open your browser menu and choose “Install app” or “Add to Home Screen.”');
      };
    }
  }

  function addVacationModePreview() {
    const tripStart = new Date('2026-08-23T00:00:00');
    const now = new Date();
    const previewStart = new Date(tripStart); previewStart.setDate(previewStart.getDate() - 7);
    if (now < previewStart) return;
    const home = document.querySelector('[data-panel="home"]');
    const planned = Object.values(plan).flatMap(day => Object.values(day).flat()).length;
    const banner = document.createElement('section');
    banner.className = 'vacation-mode-banner';
    banner.innerHTML = `<p class="eyebrow">Vacation mode</p><h2>${now < tripStart ? 'One week to go. Your plan is becoming the dashboard.' : 'Today’s adventure starts here.'}</h2><p>${planned} planned stop${planned === 1 ? '' : 's'} are ready. Open Plan for the daily schedule.</p><button class="secondary" data-tab="planner">Open today’s plan</button>`;
    home.prepend(banner);
    banner.querySelector('button').onclick = () => showTab('planner');
  }

  const observer = new MutationObserver(addMapButtons);
  ['restaurantGrid','shopGrid','activityGrid'].forEach(id => { const node = document.getElementById(id); if (node) observer.observe(node, { childList: true }); });
  addMapButtons(); addInstallCard(); addVacationModePreview();
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/service-worker.js').catch(() => {}));
})();