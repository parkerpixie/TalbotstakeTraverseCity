(() => {
  const housePanel = document.querySelector('[data-panel="house"]');
  if (!housePanel) return;

  document.querySelector('.missing-room-note')?.remove();

  const travelerNames = ['Parker', 'Blake', 'Porter', 'Mark', 'Nancy'];
  const bedDefinitions = [
    { id: 'bed-one', title: 'Blue Deco Queen Bedroom', image: 'Blue Deco Bedroom - Side of house.avif', note: 'Side-of-house bedroom, shown in two listing photos.' },
    { id: 'bed-two', title: 'Wave Queen Bedroom', image: 'Wave Bedroom - Back of House.avif', note: 'Back-of-house bedroom with the attached bathroom.' },
    { id: 'bed-three', title: 'Nautical Queen Bedroom', image: 'IMG_9770.jpeg', note: 'Front-of-house bedroom with nautical decor.' }
  ];

  const normalizeClaims = value => {
    const normalized = value && typeof value === 'object' ? value : {};
    bedDefinitions.forEach(bed => {
      if (!Array.isArray(normalized[bed.id])) normalized[bed.id] = [];
      normalized[bed.id] = normalized[bed.id].slice(0, 2);
    });
    return normalized;
  };

  const loadClaims = () => {
    try { return normalizeClaims(JSON.parse(localStorage.getItem('tcBedClaims') || '{}')); }
    catch { return normalizeClaims({}); }
  };

  let claims = loadClaims();

  const saveClaims = () => {
    localStorage.setItem('tcBedClaims', JSON.stringify(claims));
    window.TCShared?.saveBedClaims(claims);
  };

  const bedSection = document.createElement('section');
  bedSection.className = 'bed-claim-section';
  bedSection.innerHTML = `
    <div class="bed-claim-head">
      <div>
        <p class="eyebrow dark">Choose your room</p>
        <h2>Claim a queen bedroom</h2>
        <p>Each bedroom can hold up to two names. Tap your name to claim or release a spot.</p>
      </div>
      <span class="claim-note">Shared with the family</span>
    </div>
    <div class="bed-claim-grid" id="bedClaimGrid"></div>
  `;

  document.getElementById('houseGalleries')?.after(bedSection);

  const renderClaims = () => {
    const grid = document.getElementById('bedClaimGrid');
    if (!grid) return;

    grid.innerHTML = bedDefinitions.map(bed => {
      const bedClaims = claims[bed.id];
      const full = bedClaims.length >= 2;
      return `
        <article class="bed-claim-card">
          <img src="Assets/Assets/Images/${bed.image}" alt="${bed.title}" />
          <div class="bed-claim-body">
            <div class="bed-title-row"><h3>${bed.title}</h3><span>${bedClaims.length}/2 claimed</span></div>
            <p>${bed.note}</p>
            <div class="claimed-names">
              ${bedClaims.length ? bedClaims.map(name => `<span>✓ ${name}</span>`).join('') : '<small>Open for claiming</small>'}
            </div>
            <div class="claim-buttons">
              ${travelerNames.map(name => {
                const selected = bedClaims.includes(name);
                const claimedElsewhere = Object.entries(claims).some(([id, names]) => id !== bed.id && names.includes(name));
                const disabled = !selected && (full || claimedElsewhere);
                return `<button data-bed="${bed.id}" data-person="${name}" class="${selected ? 'selected' : ''}" ${disabled ? 'disabled' : ''}>${selected ? '✓ ' : ''}${name}</button>`;
              }).join('')}
            </div>
          </div>
        </article>`;
    }).join('');

    grid.querySelectorAll('[data-bed][data-person]').forEach(button => {
      button.addEventListener('click', () => {
        const { bed, person } = button.dataset;
        const current = claims[bed];
        if (current.includes(person)) {
          claims[bed] = current.filter(name => name !== person);
        } else if (current.length < 2) {
          Object.keys(claims).forEach(id => claims[id] = claims[id].filter(name => name !== person));
          claims[bed].push(person);
        }
        saveClaims();
        renderClaims();
      });
    });
  };

  window.TCShared?.subscribe('bed_claims', value => {
    claims = normalizeClaims(value);
    localStorage.setItem('tcBedClaims', JSON.stringify(claims));
    renderClaims();
  });

  document.addEventListener('tc-shared-ready', async () => {
    try {
      const sharedClaims = await window.TCShared?.read('bed_claims');
      if (sharedClaims) {
        claims = normalizeClaims(sharedClaims);
        localStorage.setItem('tcBedClaims', JSON.stringify(claims));
        renderClaims();
      }
    } catch (error) {
      console.warn('Using local bedroom claims:', error.message);
    }
  });

  const mapSection = document.createElement('section');
  mapSection.className = 'trip-map-section';
  mapSection.innerHTML = `
    <div class="trip-map-copy">
      <p class="eyebrow dark">Getting there</p>
      <h2>Drive to the West Bay house</h2>
      <p>Open turn-by-turn directions from Madison or Cumberland, or use the live map below.</p>
      <div class="drive-buttons">
        <a href="https://www.google.com/maps/dir/?api=1&origin=Madison%2C+WI&destination=Majestic+Views+of+West+Bay%2C+Traverse+City%2C+MI&travelmode=driving" target="_blank" rel="noopener">🚗 <span>Directions from Madison</span></a>
        <a href="https://www.google.com/maps/dir/?api=1&origin=Cumberland%2C+WI&destination=Majestic+Views+of+West+Bay%2C+Traverse+City%2C+MI&travelmode=driving" target="_blank" rel="noopener">🚙 <span>Directions from Cumberland</span></a>
      </div>
    </div>
    <div class="map-frame-wrap">
      <iframe title="Google map of the West Bay vacation house" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Majestic%20Views%20of%20West%20Bay%20Traverse%20City%20Michigan&output=embed"></iframe>
    </div>
  `;

  bedSection.after(mapSection);
  renderClaims();
})();