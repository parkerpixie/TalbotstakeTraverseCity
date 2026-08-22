(() => {
  const explorers = [
    { name: 'Parker', icon: '🛍️', note: 'Art, shops, food and wandering' },
    { name: 'Blake', icon: '🍔', note: 'Food, music, scenery and science' },
    { name: 'Porter', icon: '🎮', note: 'Games, facts, sweets and unusual stops' },
    { name: 'Mark', icon: '🚤', note: 'Water, views and relaxed exploring' },
    { name: 'Nancy', icon: '🍒', note: 'Shops, scenery and memorable meals' }
  ];

  const VACATION_START = new Date('2026-08-23T06:00:00-05:00');
  const HOUSE_ADDRESS = '7900 S W Bay Shore Dr, Traverse City, MI 49684';
  const ROUTE_ORIGINS = {
    madison: { label: 'Madison', address: '7133 Gladstone Drive, Madison, WI' },
    cumberland: { label: 'Cumberland', address: '1500 Elm Street, Cumberland, WI' }
  };

  const landing = document.getElementById('landing');
  const appShell = document.getElementById('appShell');
  const profilePill = document.getElementById('profilePill');
  const travelerDialog = document.getElementById('travelerDialog');
  const landingContent = landing?.querySelector('.landing-content');

  if (!landing || !appShell || !profilePill || !landingContent) return;

  const explorerButtons = (context = 'landing') => `
    <div class="explorer-choice-grid" data-explorer-context="${context}">
      ${explorers.map(person => `
        <button class="explorer-choice" type="button" data-explorer-name="${person.name}">
          <span aria-hidden="true">${person.icon}</span>
          <strong>${person.name}</strong>
          <small>${person.note}</small>
        </button>
      `).join('')}
    </div>`;

  landing.classList.add('explorer-landing');
  landingContent.innerHTML = `
    <div class="explorer-welcome-card">
      <div class="explorer-gate-mark">⚓</div>
      <p class="eyebrow">August 23–27, 2026 · Traverse City & Sleeping Bear Dunes</p>
      <h1>Talbot's Take<br><em>Traverse City</em></h1>
      <p class="explorer-opening-copy">A family field guide for discovering places, sharing priorities, and building an adventure that sounds like all five of you.</p>
      <div class="explorer-countdown" aria-label="Time until vacation" style="grid-template-columns:repeat(2,minmax(96px,1fr));max-width:360px;width:100%;">
        <div><strong id="days">0</strong><span>hours</span></div>
        <div><strong id="hours">00</strong><span>minutes</span></div>
        <div hidden><strong id="minutes">00</strong><span>seconds</span></div>
      </div>
      <p class="countdown-start-note" id="vacationStartNote">Vacation officially starts Sunday at 6:00 AM Central.</p>
      <div class="explorer-divider" aria-hidden="true"></div>
      <p class="explorer-kicker">Meet Captain Manitou, Mani for short</p>
      <h2>Choose Your Adventurer</h2>
      <p class="explorer-gate-intro mani-intro"><strong>Hi, I’m Mani.</strong> I’m your T³C otter guide. I’ll help you compare places, share five-heart rankings, and turn five different opinions into one very good northern Michigan adventure.</p>
      ${explorerButtons('landing')}
      <p class="explorer-switch-note">The app remembers your selection. You can switch adventurers anytime from the name button at the top.</p>
    </div>`;

  const switchGate = document.createElement('section');
  switchGate.className = 'explorer-gate';
  switchGate.id = 'explorerGate';
  switchGate.hidden = true;
  switchGate.setAttribute('role', 'dialog');
  switchGate.setAttribute('aria-modal', 'true');
  switchGate.setAttribute('aria-labelledby', 'explorerGateTitle');
  switchGate.innerHTML = `
    <div class="explorer-gate-card">
      <button class="explorer-gate-close" type="button" aria-label="Close adventurer selector">×</button>
      <div class="explorer-gate-mark">⚓</div>
      <p class="eyebrow dark">Captain Mani needs a quick update</p>
      <h2 id="explorerGateTitle">Who is exploring now?</h2>
      <p class="explorer-gate-intro mani-intro"><strong>Choose your name</strong> so ratings, favorites, and room preferences stay attached to the right adventurer.</p>
      ${explorerButtons('switcher')}
    </div>`;
  document.body.appendChild(switchGate);

  function selectExistingTraveler(name) {
    const option = document.querySelector(`[data-traveler="${CSS.escape(name)}"]`);
    if (option) option.click();
    localStorage.setItem('tcTraveler', name);
  }

  function updateProfileLabel(name) {
    profilePill.textContent = name;
    profilePill.classList.add('explorer-profile-pill');
    profilePill.setAttribute('aria-label', `Current adventurer: ${name}. Switch adventurer.`);
  }

  function enterAs(name) {
    selectExistingTraveler(name);
    updateProfileLabel(name);
    switchGate.hidden = true;
    landing.hidden = true;
    appShell.hidden = false;
    document.body.style.overflow = '';
    document.querySelector('[data-tab="home"]')?.click();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function openSwitcher() {
    switchGate.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      const saved = localStorage.getItem('tcTraveler');
      switchGate.querySelector(`[data-explorer-name="${saved}"]`)?.focus()
        || switchGate.querySelector('.explorer-choice')?.focus();
    });
  }

  function closeSwitcher() {
    switchGate.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-explorer-name]').forEach(button => {
    button.addEventListener('click', () => enterAs(button.dataset.explorerName));
  });

  profilePill.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (travelerDialog?.open) travelerDialog.close();
    openSwitcher();
  }, true);

  switchGate.querySelector('.explorer-gate-close')?.addEventListener('click', closeSwitcher);
  switchGate.addEventListener('click', event => {
    if (event.target === switchGate) closeSwitcher();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !switchGate.hidden) closeSwitcher();
  });

  const saved = localStorage.getItem('tcTraveler');
  if (explorers.some(person => person.name === saved)) updateProfileLabel(saved);

  function routeUrl(origin) {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(HOUSE_ADDRESS)}&travelmode=driving`;
  }

  function patchVacationHome() {
    const home = document.querySelector('[data-panel="home"] .tc-vacation-home');
    if (!home) return;

    const routeCard = home.querySelector('.vacay-route-card');
    if (routeCard) {
      const activeOriginButton = routeCard.querySelector('[data-vacay-origin].active');
      const originId = activeOriginButton?.dataset.vacayOrigin || 'madison';
      const origin = ROUTE_ORIGINS[originId] || ROUTE_ORIGINS.madison;
      const routeCopy = routeCard.querySelector('.vacay-route-copy');
      if (routeCopy) {
        routeCopy.innerHTML = `<span>Starting at</span><strong id="vacayOriginAddress">${origin.address}</strong><span>Driving to</span><strong>${HOUSE_ADDRESS}</strong>`;
      }
      const primary = routeCard.querySelector('#vacayDirectionsLink');
      if (primary) primary.href = routeUrl(origin.address);
      routeCard.querySelector('[data-vacay-house-address]')?.remove();
      routeCard.querySelector('.vacay-note')?.remove();
    }

    const mapSide = home.querySelector('.vacay-map-side');
    if (mapSide && !mapSide.querySelector('#familyHouseInfo')) {
      const info = document.createElement('section');
      info.id = 'familyHouseInfo';
      info.className = 'vacay-card';
      info.style.marginTop = '18px';
      info.innerHTML = `
        <p class="vacay-label">Home base</p>
        <h2>Sunrise Shores Retreat</h2>
        <p style="font-weight:700;margin:.35rem 0 1rem;">${HOUSE_ADDRESS}</p>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:14px;">
          <div><span class="vacay-label">Check-in</span><strong style="display:block;">Aug 23 · 4:00 PM</strong></div>
          <div><span class="vacay-label">Check-out</span><strong style="display:block;">Aug 27 · 10:00 AM</strong></div>
        </div>
        <div class="vacay-actions" style="display:flex;flex-wrap:wrap;gap:10px;">
          <a href="${routeUrl(ROUTE_ORIGINS.madison.address)}" target="_blank" rel="noopener">Route from Madison ↗</a>
          <a href="${routeUrl(ROUTE_ORIGINS.cumberland.address)}" target="_blank" rel="noopener">Route from Cumberland ↗</a>
        </div>`;
      mapSide.appendChild(info);
    }

    const lowerHome = [...home.querySelectorAll('.vacay-lower-grid .vacay-card')].find(card => /Home base/i.test(card.textContent || ''));
    if (lowerHome) {
      const paragraph = lowerHome.querySelector('p:not(.vacay-label)');
      if (paragraph) paragraph.textContent = HOUSE_ADDRESS;
      const link = lowerHome.querySelector('a');
      if (link) link.href = routeUrl((ROUTE_ORIGINS[localStorage.getItem('tcVacationOriginV1')] || ROUTE_ORIGINS.madison).address);
    }
  }

  const homePanel = document.querySelector('[data-panel="home"]');
  if (homePanel) {
    patchVacationHome();
    const homeObserver = new MutationObserver(() => requestAnimationFrame(patchVacationHome));
    homeObserver.observe(homePanel, { childList: true, subtree: true });
  } else {
    const waitForHome = new MutationObserver(() => {
      const panel = document.querySelector('[data-panel="home"]');
      if (!panel) return;
      waitForHome.disconnect();
      patchVacationHome();
      const homeObserver = new MutationObserver(() => requestAnimationFrame(patchVacationHome));
      homeObserver.observe(panel, { childList: true, subtree: true });
    });
    waitForHome.observe(document.body, { childList: true, subtree: true });
  }

  const updateCountdown = () => {
    const remaining = Math.max(0, VACATION_START.getTime() - Date.now());
    const hoursEl = landing.querySelector('#days');
    const minutesEl = landing.querySelector('#hours');
    const secondsEl = landing.querySelector('#minutes');
    const noteEl = landing.querySelector('#vacationStartNote');

    if (remaining <= 0) {
      if (hoursEl) hoursEl.textContent = '0';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      if (noteEl) noteEl.textContent = 'VACATION MODE IS OFFICIALLY ON. 🧳✨';
      return;
    }

    const totalHours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    if (hoursEl) hoursEl.textContent = String(totalHours);
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    if (noteEl) noteEl.textContent = 'Vacation officially starts Sunday at 6:00 AM Central.';
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();