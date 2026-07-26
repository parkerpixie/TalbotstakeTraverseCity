(() => {
  const housePanel = document.querySelector('[data-panel="house"]');
  if (!housePanel) return;

  document.querySelector('.missing-room-note')?.remove();

  const travelerNames = ['Parker', 'Blake', 'Porter', 'Mark', 'Nancy'];
  const bedDefinitions = [
    {
      id: 'bed-one',
      title: 'Blue Deco Room',
      images: ['Blue Deco Bedroom - Side of house.avif', 'Blue Deco Bedroom - Font of House 2.avif'],
      note: 'Art Deco blue wallpaper and a queen bed.'
    },
    {
      id: 'bed-two',
      title: 'Wave Room',
      images: ['Wave Bedroom - Back of House.avif', 'Wave bedroom - Attached bathroom.avif'],
      note: 'Queen bedroom with the wave artwork and attached bathroom.'
    },
    {
      id: 'bed-three',
      title: 'Harbor View Room',
      images: ['IMG_9770.jpeg?v=harbor-view-full'],
      note: 'Front-of-house queen bedroom with a view toward the bay.'
    }
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
        <p class="eyebrow dark">Pick your bed</p>
        <h2>Choose a room at Sunrise Shores Retreat</h2>
        <p>See every available photo for each room, then tap your name to claim or release a spot.</p>
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
      const hasMultiple = bed.images.length > 1;
      return `
        <article class="bed-claim-card" data-room-card="${bed.id}" data-photo-index="0">
          <div class="room-photo-viewer">
            <img class="room-main-photo" src="Assets/Assets/Images/${bed.images[0]}" alt="${bed.title}" loading="lazy" />
            ${hasMultiple ? '<button class="room-photo-control prev" type="button" aria-label="Previous room photo">‹</button><button class="room-photo-control next" type="button" aria-label="Next room photo">›</button>' : ''}
            <span class="room-photo-count">1 / ${bed.images.length}</span>
          </div>
          <div class="room-photo-thumbs" aria-label="${bed.title} photos">
            ${bed.images.map((image, index) => `<button type="button" class="room-photo-thumb ${index === 0 ? 'active' : ''}" data-room-photo="${index}" aria-label="Show ${bed.title} photo ${index + 1}"><img src="Assets/Assets/Images/${image}" alt="" /></button>`).join('')}
          </div>
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

    grid.querySelectorAll('[data-room-card]').forEach(card => {
      const bed = bedDefinitions.find(item => item.id === card.dataset.roomCard);
      const mainPhoto = card.querySelector('.room-main-photo');
      const count = card.querySelector('.room-photo-count');
      const thumbs = [...card.querySelectorAll('[data-room-photo]')];
      const showPhoto = nextIndex => {
        const index = (nextIndex + bed.images.length) % bed.images.length;
        card.dataset.photoIndex = String(index);
        mainPhoto.src = `Assets/Assets/Images/${bed.images[index]}`;
        count.textContent = `${index + 1} / ${bed.images.length}`;
        thumbs.forEach((thumb, thumbIndex) => thumb.classList.toggle('active', thumbIndex === index));
      };
      card.querySelector('.room-photo-control.prev')?.addEventListener('click', () => showPhoto(Number(card.dataset.photoIndex) - 1));
      card.querySelector('.room-photo-control.next')?.addEventListener('click', () => showPhoto(Number(card.dataset.photoIndex) + 1));
      thumbs.forEach(thumb => thumb.addEventListener('click', () => showPhoto(Number(thumb.dataset.roomPhoto))));
    });

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
      <h2>Drive to Sunrise Shores Retreat</h2>
      <p>Open turn-by-turn directions from Madison or Cumberland, or use the live map below.</p>
      <div class="drive-buttons">
        <a href="https://www.google.com/maps/dir/?api=1&origin=Madison%2C+WI&destination=Majestic+Views+of+West+Bay%2C+Traverse+City%2C+MI&travelmode=driving" target="_blank" rel="noopener">🚗 <span>Directions from Madison</span></a>
        <a href="https://www.google.com/maps/dir/?api=1&origin=Cumberland%2C+WI&destination=Majestic+Views+of+West+Bay%2C+Traverse+City%2C+MI&travelmode=driving" target="_blank" rel="noopener">🚙 <span>Directions from Cumberland</span></a>
      </div>
    </div>
    <div class="map-frame-wrap">
      <iframe title="Google map of Sunrise Shores Retreat" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Majestic%20Views%20of%20West%20Bay%20Traverse%20City%20Michigan&output=embed"></iframe>
    </div>
  `;

  bedSection.after(mapSection);
  renderClaims();
})();