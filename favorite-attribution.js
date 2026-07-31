(() => {
  const people = travelers.filter(person => person.name !== 'Everyone').map(person => person.name);
  let favoriteOwners = {};

  const normalizeOwners = value => {
    const normalized = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    Object.keys(normalized).forEach(id => {
      normalized[id] = Array.isArray(normalized[id]) ? [...new Set(normalized[id].filter(name => people.includes(name)))] : [];
      if (!normalized[id].length) delete normalized[id];
    });
    return normalized;
  };

  const loadOwners = () => {
    try { return normalizeOwners(JSON.parse(localStorage.getItem('tcFavoriteOwners') || '{}')); }
    catch { return {}; }
  };

  favoriteOwners = loadOwners();

  const notifyHeartChange = () => {
    document.dispatchEvent(new CustomEvent('tc-favorites-changed', { detail: { owners: favoriteOwners } }));
  };

  const saveOwners = async () => {
    localStorage.setItem('tcFavoriteOwners', JSON.stringify(favoriteOwners));
    notifyHeartChange();
    try { await window.TCShared?.write('favorite_owners', favoriteOwners); }
    catch (error) { console.warn('Heart votes stored on this device only:', error?.message); }
  };

  const ownersFor = id => favoriteOwners[id] || [];
  const heartCount = id => ownersFor(id).length;
  const ownerLabel = id => {
    const names = ownersFor(id);
    if (!names.length) return favorites.includes(id) ? 'Saved by the family' : '';
    return `Hearted by ${names.join(', ')}`;
  };

  const heartMeter = id => {
    const names = ownersFor(id);
    const label = names.length
      ? `${names.length} of ${people.length} family hearts: ${names.join(', ')}`
      : `0 of ${people.length} family hearts`;
    return {
      label,
      markup: people.map((_, index) => `<span class="${index < names.length ? 'filled' : ''}">♥</span>`).join('')
    };
  };

  const addFamilyHeartMeter = (card, id) => {
    const media = card.querySelector('.place-card-media');
    if (!media) return;
    let meter = media.querySelector('.family-heart-rating');
    if (!meter) {
      meter = document.createElement('div');
      meter.className = 'family-heart-rating';
      media.appendChild(meter);
    }
    const rating = heartMeter(id);
    meter.innerHTML = rating.markup;
    meter.setAttribute('aria-label', rating.label);
    meter.title = rating.label;
  };

  const addSavedByLabels = () => {
    document.querySelectorAll('[data-save]').forEach(button => {
      const id = button.dataset.save;
      const card = button.closest('.place-card');
      if (!card) return;
      addFamilyHeartMeter(card, id);

      let label = card.querySelector('.saved-by-label');
      const text = ownerLabel(id);
      if (!text) {
        label?.remove();
      } else {
        if (!label) {
          label = document.createElement('div');
          label.className = 'saved-by-label';
          const actions = card.querySelector('.card-actions');
          actions?.before(label);
        }
        label.textContent = `♥ ${text}`;
      }

      const ownSave = selectedTraveler !== 'Everyone' && ownersFor(id).includes(selectedTraveler);
      const count = heartCount(id);
      button.textContent = ownSave
        ? `♥ Your heart · ${count}/${people.length}`
        : count
          ? `♡ Add my heart · ${count}/${people.length}`
          : '♡ Add my heart';
      button.classList.toggle('active', ownSave);
      button.setAttribute('aria-label', ownSave ? `Remove ${selectedTraveler}'s heart` : `Add ${selectedTraveler}'s heart`);
    });

    document.querySelectorAll('.planner-card[data-id]').forEach(card => {
      const id = card.dataset.id;
      let label = card.querySelector('.planner-saved-by');
      const text = ownerLabel(id);
      if (!text) return label?.remove();
      if (!label) {
        label = document.createElement('small');
        label.className = 'planner-saved-by';
        card.querySelector('div')?.appendChild(label);
      }
      label.textContent = text;
    });

    document.querySelectorAll('.favorite-row').forEach(row => {
      const title = row.querySelector('strong')?.textContent || '';
      const place = allPlaces.find(item => title.includes(item.name));
      if (!place) return;
      let label = row.querySelector('.favorite-saved-by');
      if (!label) {
        label = document.createElement('small');
        label.className = 'favorite-saved-by';
        row.querySelector('div')?.appendChild(label);
      }
      label.textContent = ownerLabel(place.id);
    });
  };

  const ensureCoveragePanel = () => {
    const routeAdvice = document.getElementById('routeAdvice');
    if (!routeAdvice) return null;
    let panel = document.getElementById('familyCoverage');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'familyCoverage';
      panel.className = 'family-coverage';
      routeAdvice.after(panel);
    }
    return panel;
  };

  const renderCoverage = () => {
    const panel = ensureCoveragePanel();
    if (!panel || !plan?.[activeDay]) return;
    const ids = Object.values(plan[activeDay]).flat();
    const included = new Set(ids.flatMap(id => ownersFor(id)));
    const covered = people.filter(name => included.has(name));
    panel.innerHTML = `
      <div>
        <p class="eyebrow dark">Family balance</p>
        <strong>${ids.length ? `${covered.length} of ${people.length} travelers represented` : 'Build a day everyone can recognize themselves in'}</strong>
      </div>
      <div class="coverage-chips">
        ${people.map(name => `<span class="${included.has(name) ? 'covered' : ''}">${included.has(name) ? '✓' : '○'} ${name}</span>`).join('')}
      </div>`;
  };

  const refreshAttribution = () => {
    addSavedByLabels();
    renderCoverage();
  };

  toggleFavorite = id => {
    if (selectedTraveler === 'Everyone') {
      showToast('Choose your traveler first so the app knows whose heart this is.');
      document.getElementById('travelerDialog')?.showModal();
      return;
    }

    const owners = ownersFor(id);
    const alreadyMine = owners.includes(selectedTraveler);
    favoriteOwners[id] = alreadyMine
      ? owners.filter(name => name !== selectedTraveler)
      : [...owners, selectedTraveler];

    if (!favoriteOwners[id].length) delete favoriteOwners[id];
    const shouldBeSaved = Boolean(favoriteOwners[id]);
    favorites = shouldBeSaved
      ? [...new Set([...favorites, id])]
      : favorites.filter(item => item !== id);

    localStorage.setItem('tcFavoritesV3', JSON.stringify(favorites));
    saveOwners();
    window.TCShared?.write('favorites', favorites).catch(error => console.warn('Favorite stored locally only:', error?.message));

    renderRestaurants();
    renderShops();
    renderActivities();
    renderPlanner();
    updateStats();
    requestAnimationFrame(refreshAttribution);
    showToast(alreadyMine ? `Removed ${selectedTraveler}'s heart.` : `Added ${selectedTraveler}'s heart.`);
  };

  const originalRenderPlanner = renderPlanner;
  renderPlanner = () => {
    originalRenderPlanner();
    requestAnimationFrame(refreshAttribution);
  };

  const originalChooseTraveler = chooseTraveler;
  chooseTraveler = name => {
    originalChooseTraveler(name);
    requestAnimationFrame(refreshAttribution);
    notifyHeartChange();
  };

  const observer = new MutationObserver(() => requestAnimationFrame(refreshAttribution));
  ['restaurantGrid', 'shopGrid', 'activityGrid', 'plannerIdeas', 'favoritesList'].forEach(id => {
    const node = document.getElementById(id);
    if (node) observer.observe(node, { childList: true, subtree: true });
  });

  window.TCHearts = {
    people: [...people],
    ownersFor: id => [...ownersFor(id)],
    countFor: heartCount,
    all: () => JSON.parse(JSON.stringify(favoriteOwners))
  };

  window.TCShared?.subscribe('favorite_owners', value => {
    favoriteOwners = normalizeOwners(value);
    localStorage.setItem('tcFavoriteOwners', JSON.stringify(favoriteOwners));
    refreshAttribution();
    notifyHeartChange();
  });

  document.addEventListener('tc-shared-ready', async () => {
    try {
      const shared = await window.TCShared?.read('favorite_owners');
      if (shared && typeof shared === 'object') {
        favoriteOwners = normalizeOwners(shared);
        localStorage.setItem('tcFavoriteOwners', JSON.stringify(favoriteOwners));
      } else if (Object.keys(favoriteOwners).length) {
        await window.TCShared?.write('favorite_owners', favoriteOwners);
      }
      refreshAttribution();
      notifyHeartChange();
    } catch (error) {
      console.warn('Heart attribution is using this device only:', error?.message);
    }
  });

  refreshAttribution();
  notifyHeartChange();
})();
