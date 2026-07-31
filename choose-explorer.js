(() => {
  const explorers = [
    { name: 'Parker', icon: '🛍️', note: 'Art, shops, food and wandering' },
    { name: 'Blake', icon: '🍔', note: 'Food, music, scenery and science' },
    { name: 'Porter', icon: '🎮', note: 'Games, facts, sweets and unusual stops' },
    { name: 'Mark', icon: '🚤', note: 'Water, views and relaxed exploring' },
    { name: 'Nancy', icon: '🍒', note: 'Shops, scenery and memorable meals' }
  ];

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
      <p class="eyebrow">August 23–27, 2026 · West Bay</p>
      <h1>The Talbots Take<br><em>Traverse City</em></h1>
      <p class="explorer-opening-copy">A family field guide for discovering places, sharing priorities, and building an adventure that sounds like all five of you.</p>
      <div class="explorer-countdown" aria-label="Trip countdown">
        <div><strong id="days">0</strong><span>days</span></div>
        <div><strong id="hours">0</strong><span>hours</span></div>
        <div><strong id="minutes">0</strong><span>minutes</span></div>
      </div>
      <div class="explorer-divider" aria-hidden="true"></div>
      <p class="explorer-kicker">First things first</p>
      <h2>Choose Your Explorer</h2>
      <div class="explorer-gate-instruction">☝️ Choose your name first</div>
      <p class="explorer-gate-intro">Your name keeps your heart rankings, saved places, and bedroom preferences attached to the right person.</p>
      ${explorerButtons('landing')}
      <p class="explorer-switch-note">The app remembers your selection. You can switch explorers anytime from the name button at the top.</p>
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
      <button class="explorer-gate-close" type="button" aria-label="Close explorer selector">×</button>
      <div class="explorer-gate-mark">⚓</div>
      <p class="eyebrow dark">Switch profiles</p>
      <h2 id="explorerGateTitle">Choose Your Explorer</h2>
      <div class="explorer-gate-instruction">☝️ Choose your name first</div>
      <p class="explorer-gate-intro">Rankings, favorites, and room preferences will be saved for the person you choose.</p>
      ${explorerButtons('switcher')}
    </div>`;
  document.body.appendChild(switchGate);

  function selectExistingTraveler(name) {
    const option = document.querySelector(`[data-traveler="${CSS.escape(name)}"]`);
    if (option) option.click();
    localStorage.setItem('tcTraveler', name);
  }

  function updateProfileLabel(name) {
    profilePill.textContent = `👋 ${name}`;
    profilePill.classList.add('explorer-profile-pill');
    profilePill.setAttribute('aria-label', `Current explorer: ${name}. Switch explorer.`);
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

  const updateCountdown = () => {
    const diff = Math.max(0, new Date('2026-08-23T16:00:00') - new Date());
    const days = landing.querySelector('#days');
    const hours = landing.querySelector('#hours');
    const minutes = landing.querySelector('#minutes');
    if (days) days.textContent = Math.floor(diff / 86400000);
    if (hours) hours.textContent = Math.floor((diff % 86400000) / 3600000);
    if (minutes) minutes.textContent = Math.floor((diff % 3600000) / 60000);
  };

  updateCountdown();
  setInterval(updateCountdown, 60000);
})();
