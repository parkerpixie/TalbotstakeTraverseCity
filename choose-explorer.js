(() => {
  const names = [
    { name: 'Parker', icon: '🛍️', note: 'Art, shops, food and wandering' },
    { name: 'Blake', icon: '🍔', note: 'Food, music, scenery and science' },
    { name: 'Porter', icon: '🎮', note: 'Games, facts, sweets and unusual stops' },
    { name: 'Mark', icon: '🚤', note: 'Water, views and relaxed exploring' },
    { name: 'Nancy', icon: '🍒', note: 'Shops, scenery and memorable meals' }
  ];

  const landing = document.getElementById('landing');
  const appShell = document.getElementById('appShell');
  const enterButton = document.getElementById('enterApp');
  const profilePill = document.getElementById('profilePill');
  const travelerDialog = document.getElementById('travelerDialog');

  if (!landing || !appShell || !enterButton || !profilePill) return;

  enterButton.textContent = 'Choose Your Explorer';
  enterButton.setAttribute('aria-haspopup', 'dialog');

  const gate = document.createElement('section');
  gate.className = 'explorer-gate';
  gate.id = 'explorerGate';
  gate.hidden = true;
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-labelledby', 'explorerGateTitle');
  gate.innerHTML = `
    <div class="explorer-gate-card">
      <div class="explorer-gate-mark">⚓</div>
      <p class="eyebrow dark">Welcome to Talbots Take TC</p>
      <h2 id="explorerGateTitle">Choose Your Explorer</h2>
      <p class="explorer-gate-intro">Your name keeps your heart rankings, saved places, and bedroom preferences attached to the right person.</p>
      <div class="explorer-gate-instruction">☝️ Choose your name first</div>
      <div class="explorer-choice-grid">
        ${names.map(person => `
          <button class="explorer-choice" type="button" data-explorer-name="${person.name}">
            <span aria-hidden="true">${person.icon}</span>
            <strong>${person.name}</strong>
            <small>${person.note}</small>
          </button>
        `).join('')}
      </div>
      <p class="explorer-switch-note">Picked the wrong human? You can switch explorers anytime from the name button at the top.</p>
    </div>`;
  document.body.appendChild(gate);

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

  function openGate() {
    landing.hidden = true;
    appShell.hidden = true;
    gate.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => gate.querySelector('.explorer-choice')?.focus());
  }

  function finishSelection(name) {
    selectExistingTraveler(name);
    updateProfileLabel(name);
    gate.hidden = true;
    landing.hidden = true;
    appShell.hidden = false;
    document.body.style.overflow = '';
    document.querySelector('[data-tab="home"]')?.click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  enterButton.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    openGate();
  }, true);

  gate.querySelectorAll('[data-explorer-name]').forEach(button => {
    button.addEventListener('click', () => finishSelection(button.dataset.explorerName));
  });

  profilePill.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (travelerDialog?.open) travelerDialog.close();
    openGate();
  }, true);

  const saved = localStorage.getItem('tcTraveler');
  if (names.some(person => person.name === saved)) updateProfileLabel(saved);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !gate.hidden && !appShell.hidden) {
      gate.hidden = true;
      document.body.style.overflow = '';
    }
  });
})();
