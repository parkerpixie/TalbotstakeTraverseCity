(() => {
  const additions = [
    {
      id: 'raven-hill-discovery',
      name: 'Raven Hill Discovery Center',
      town: 'East Jordan',
      area: 'East Jordan / Charlevoix County',
      type: 'family',
      icon: '🔬',
      url: 'https://miravenhill.org/',
      image: 'Raven HIll Discovery Center.jpeg',
      duration: '2–3 hours',
      tags: ['indoor', 'outdoor', 'rainy-day', 'interactive', 'animals-nature', 'science-discovery', 'low-energy', 'unique-offbeat'],
      fit: ['Porter', 'Parker', 'Blake'],
      dog: 'Pet policy not confirmed — check before bringing Luna and Ozzy',
      summary: 'Hands-on science, history and art with interactive museum exhibits, an animal room, outdoor exhibits and nature trails. Typical visits run about 2–3 hours. Summer hours during our trip: weekdays 10–4, Saturday noon–4, Sunday 2–4. Admission is $10 per person.'
    },
    {
      id: 'boardman-river-nature-center',
      name: 'Boardman River Nature Center',
      town: 'Traverse City',
      area: 'Traverse City / Boardman River',
      type: 'family',
      icon: '🦦',
      url: 'https://natureiscalling.org/boardman-river-nature-center',
      image: 'Boardman Nature River Center.jpeg',
      duration: '1–2 hours',
      tags: ['indoor', 'outdoor', 'rainy-day', 'interactive', 'animals-nature', 'science-discovery', 'low-energy'],
      fit: ['Porter', 'Parker', 'Mark', 'Nancy'],
      dog: 'Pet policy not confirmed — check before bringing Luna and Ozzy',
      summary: 'Interactive Michigan wildlife and plant exhibits beside the Boardman River, plus a nature playscape and access to the surrounding Natural Education Reserve. Open Tuesday–Friday 10–4 with a suggested $5 donation. Some reserve trails remain closed after the April 2026 flooding, so check current trail status before planning a longer walk.'
    },
    {
      id: 'gt-butterfly-bug-zoo',
      name: 'GT Butterfly House & Bug Zoo',
      town: 'Williamsburg',
      area: 'Williamsburg / East of Traverse City',
      type: 'family',
      icon: '🦋',
      url: 'https://www.gtbutterflyzoo.com/',
      tags: ['family', 'rainy-day', 'low-energy', 'unusual', 'animals-nature', 'unique-offbeat'],
      fit: ['Porter', 'Parker', 'Blake'],
      dog: 'No pets inside; service animals only',
      summary: 'A close-up butterfly and insect experience with strong Porter potential and an excellent rainy-day backup.'
    },
    {
      id: 'guntzviller-spirit-woods',
      name: "Guntzviller's Spirit of the Woods Museum",
      town: 'Williamsburg',
      area: 'Williamsburg / 2 miles south of Elk Rapids',
      type: 'history',
      icon: '🦌',
      url: 'http://www.northernmichigantaxidermy.com/',
      image: 'GuntzViller Taxidery Museum.jpg',
      duration: '1–1.5 hours',
      tags: ['indoor', 'rainy-day', 'animals-nature', 'low-energy', 'unique-offbeat', 'history'],
      fit: ['Porter', 'Parker', 'Blake', 'Mark'],
      dog: 'Pet policy not confirmed — check before bringing Luna and Ozzy',
      summary: 'A wonderfully oddball northern Michigan stop with taxidermy dioramas of Michigan wildlife, a large collection of regional Native American artifacts, antique hunting and fishing gear, and a gift shop. Listed summer hours are Monday–Saturday 9–5.'
    }
  ];

  if (typeof activities === 'undefined' || !Array.isArray(activities) || typeof allPlaces === 'undefined' || !Array.isArray(allPlaces)) return;

  additions.forEach(place => {
    if (!activities.some(existing => existing.id === place.id)) activities.push(place);
    if (!allPlaces.some(existing => existing.id === place.id)) {
      allPlaces.push({ ...place, kind: 'activity', price: '', tags: place.tags || [] });
    }
  });

  const townFilter = document.getElementById('activityTown');
  ['East Jordan', 'Williamsburg'].forEach(town => {
    if (townFilter && ![...townFilter.options].some(option => option.value === town)) {
      const option = document.createElement('option');
      option.value = town;
      option.textContent = town;
      townFilter.appendChild(option);
    }
  });

  const imageUrl = filename => `Assets/${String(filename).split('/').map(encodeURIComponent).join('/')}`;

  function addMuseumImage() {
    const place = additions.find(item => item.id === 'guntzviller-spirit-woods');
    if (!place?.image) return;

    const selectors = [
      `.place-card [data-save="${place.id}"]`,
      `.rating-queue-card[data-queue-place="${place.id}"]`,
      `.rating-queue-card[data-all-queue-place="${place.id}"]`
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(match => {
        const card = match.classList.contains('rating-queue-card') ? match : match.closest('.place-card');
        if (!card || card.querySelector('.guntzviller-card-image')) return;

        const media = document.createElement('div');
        media.className = 'guntzviller-card-image';
        media.style.cssText = 'overflow:hidden;border-radius:16px;margin:10px 0 14px;background:#eee;';
        const img = document.createElement('img');
        img.src = imageUrl(place.image);
        img.alt = `${place.name} museum display`;
        img.loading = 'lazy';
        img.style.cssText = 'display:block;width:100%;aspect-ratio:16/9;object-fit:cover;';
        media.appendChild(img);

        const anchor = card.querySelector('.icon-badge, h3, .queue-card-top');
        if (anchor?.nextSibling) anchor.parentNode.insertBefore(media, anchor.nextSibling);
        else card.prepend(media);
      });
    });
  }

  const plannerTypeKey = 'tcPlannerTypeFilter';
  const plannerTypeChoices = [
    { id: 'all', label: 'All types' },
    { id: 'activity', label: '🧭 Activities' },
    { id: 'restaurant', label: '🍴 Restaurants' },
    { id: 'shop', label: '🛍 Shopping' }
  ];
  let plannerTypeFilter = localStorage.getItem(plannerTypeKey) || 'all';
  if (!plannerTypeChoices.some(choice => choice.id === plannerTypeFilter)) plannerTypeFilter = 'all';

  function applyPlannerTypeFilter() {
    const row = document.getElementById('planTypeTabs');
    const shelfTabs = document.getElementById('planShelfTabs');
    const list = document.getElementById('planShelfList');
    if (!row || !shelfTabs || !list) return;

    const wanderActive = !!shelfTabs.querySelector('[data-shelf="wander"].active');
    row.hidden = wanderActive;
    row.querySelectorAll('[data-plan-type]').forEach(button => {
      const active = button.dataset.planType === plannerTypeFilter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    list.querySelectorAll('.plan-shelf-card[data-plan-id]').forEach(card => {
      const place = allPlaces.find(item => item.id === card.dataset.planId);
      card.hidden = !wanderActive && plannerTypeFilter !== 'all' && place?.kind !== plannerTypeFilter;
    });
  }

  function installPlannerTypeFilter() {
    const shelfTabs = document.getElementById('planShelfTabs');
    const list = document.getElementById('planShelfList');
    if (!shelfTabs || !list) return false;

    let row = document.getElementById('planTypeTabs');
    if (!row) {
      row = document.createElement('div');
      row.id = 'planTypeTabs';
      row.className = 'plan-shelf-tabs planner-type-tabs';
      row.setAttribute('aria-label', 'Filter planner blocks by place type');
      row.innerHTML = plannerTypeChoices.map(choice => `<button type="button" data-plan-type="${choice.id}">${choice.label}</button>`).join('');
      shelfTabs.insertAdjacentElement('afterend', row);

      row.querySelectorAll('[data-plan-type]').forEach(button => {
        button.addEventListener('click', () => {
          plannerTypeFilter = button.dataset.planType;
          localStorage.setItem(plannerTypeKey, plannerTypeFilter);
          applyPlannerTypeFilter();
        });
      });

      new MutationObserver(() => requestAnimationFrame(applyPlannerTypeFilter)).observe(list, { childList: true });
      new MutationObserver(() => requestAnimationFrame(applyPlannerTypeFilter)).observe(shelfTabs, { attributes: true, subtree: true, attributeFilter: ['class'] });
      shelfTabs.addEventListener('click', () => window.setTimeout(applyPlannerTypeFilter, 0));
      document.addEventListener('tc-ratings-changed', () => window.setTimeout(applyPlannerTypeFilter, 40));
    }

    applyPlannerTypeFilter();
    return true;
  }

  if (typeof renderActivities === 'function') renderActivities();
  if (typeof renderPlanner === 'function') renderPlanner();
  if (typeof updateStats === 'function') updateStats();

  const activityGrid = document.getElementById('activityGrid');
  if (activityGrid) new MutationObserver(() => requestAnimationFrame(addMuseumImage)).observe(activityGrid, { childList: true, subtree: true });
  document.addEventListener('tc-ratings-changed', () => window.setTimeout(addMuseumImage, 40));
  document.addEventListener('tc-shared-ready', () => window.setTimeout(addMuseumImage, 40));
  document.addEventListener('click', event => {
    if (event.target.closest('[data-open-rating-queue], [data-open-all-rating-queue], [data-rating-person], [data-all-rating-person], [data-rating-filter], [data-all-rating-filter]')) {
      window.setTimeout(addMuseumImage, 80);
    }
  });
  window.setTimeout(addMuseumImage, 60);

  let plannerFilterTries = 0;
  const plannerFilterTimer = window.setInterval(() => {
    plannerFilterTries += 1;
    if (installPlannerTypeFilter() || plannerFilterTries > 160) window.clearInterval(plannerFilterTimer);
  }, 50);

  document.dispatchEvent(new CustomEvent('tc-places-ready', { detail: { source: 'porter-place-additions' } }));
})();
