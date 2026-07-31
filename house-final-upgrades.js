(() => {
  const housePanel = document.querySelector('[data-panel="house"]');
  if (!housePanel) return;

  document.querySelector('.missing-room-note')?.remove();
  document.querySelector('.bed-claim-section')?.remove();
  document.querySelector('.room-ranking-section')?.remove();
  document.querySelector('.trip-map-section')?.remove();

  const travelerNames = ['Parker', 'Blake', 'Porter', 'Mark', 'Nancy'];
  const rankLabels = {
    1: '1st choice',
    2: '2nd choice',
    3: '3rd choice'
  };
  const rankPoints = { 1: 3, 2: 2, 3: 1 };

  const roomDefinitions = [
    {
      id: 'blue-deco',
      title: 'Blue Deco Room',
      images: ['Blue Deco Bedroom - Side of house.avif', 'Blue Deco Bedroom - Font of House 2.avif'],
      note: 'Queen bedroom with Art Deco blue wallpaper.'
    },
    {
      id: 'wave',
      title: 'Wave Room',
      images: ['Wave Bedroom - Back of House.avif', 'Wave bedroom - Attached bathroom.avif'],
      note: 'Queen bedroom with wave artwork and the attached bathroom.'
    },
    {
      id: 'harbor-view',
      title: 'Harbor View Room',
      images: ['Natutical Room - Front of House.avif'],
      note: 'Front-of-house queen bedroom with a view toward the bay.'
    }
  ];

  const emptyBallot = () => Object.fromEntries(roomDefinitions.map(room => [room.id, null]));

  const normalizeRankings = value => {
    const normalized = {};
    travelerNames.forEach(name => {
      const source = value && typeof value === 'object' && value[name] && typeof value[name] === 'object'
        ? value[name]
        : {};
      const ballot = emptyBallot();
      const usedRanks = new Set();
      roomDefinitions.forEach(room => {
        const rank = Number(source[room.id]);
        if ([1, 2, 3].includes(rank) && !usedRanks.has(rank)) {
          ballot[room.id] = rank;
          usedRanks.add(rank);
        }
      });
      normalized[name] = ballot;
    });
    return normalized;
  };

  const loadRankings = () => {
    try {
      return normalizeRankings(JSON.parse(localStorage.getItem('tcRoomRankings') || '{}'));
    } catch {
      return normalizeRankings({});
    }
  };

  let rankings = loadRankings();

  const selectedName = () => travelerNames.includes(window.selectedTraveler)
    ? window.selectedTraveler
    : travelerNames.includes(typeof selectedTraveler === 'string' ? selectedTraveler : '')
      ? selectedTraveler
      : travelerNames.includes(localStorage.getItem('tcTraveler'))
        ? localStorage.getItem('tcTraveler')
        : null;

  const completedCount = ballot => Object.values(ballot || {}).filter(rank => [1, 2, 3].includes(Number(rank))).length;

  const saveRankings = async () => {
    localStorage.setItem('tcRoomRankings', JSON.stringify(rankings));
    try {
      await window.TCShared?.write('room_rankings', rankings);
    } catch (error) {
      console.warn('Room rankings saved locally only:', error.message);
    }
    document.dispatchEvent(new CustomEvent('tc-room-rankings-updated', { detail: rankings }));
  };

  const assignRank = (traveler, roomId, rank) => {
    if (!travelerNames.includes(traveler)) return;
    const ballot = rankings[traveler] || emptyBallot();
    const oldRank = ballot[roomId];
    const roomWithNewRank = Object.keys(ballot).find(id => id !== roomId && ballot[id] === rank);

    if (roomWithNewRank) {
      ballot[roomWithNewRank] = oldRank || null;
    }
    ballot[roomId] = rank;
    rankings[traveler] = ballot;
    saveRankings();
    renderRankings();
  };

  const rankingSection = document.createElement('section');
  rankingSection.className = 'room-ranking-section';
  rankingSection.innerHTML = `
    <div class="room-ranking-head">
      <div>
        <p class="eyebrow dark">Pick your room</p>
        <h2>Rank all three bedrooms</h2>
        <p>Every bedroom has one queen bed. Choose your first, second, and third choice so everyone can see where the family overlaps.</p>
      </div>
      <div class="room-ranking-person" id="roomRankingPerson"></div>
    </div>
    <div class="room-ballot-help" id="roomBallotHelp"></div>
    <div class="room-ranking-grid" id="roomRankingGrid"></div>
    <div class="room-results-layout">
      <section class="room-family-board">
        <div class="room-results-head">
          <div>
            <p class="eyebrow dark">Family room board</p>
            <h3>Everyone's first, second, and third choice</h3>
          </div>
          <span id="roomBallotsComplete"></span>
        </div>
        <div id="roomFamilyBoard"></div>
      </section>
      <section class="room-consensus-card">
        <p class="eyebrow dark">Current consensus</p>
        <h3>How the rooms rank so far</h3>
        <p class="room-consensus-note">First choice earns 3 points, second earns 2, and third earns 1. This is a planning guide, not a final room assignment.</p>
        <div id="roomConsensus"></div>
      </section>
    </div>
  `;

  document.getElementById('houseGalleries')?.after(rankingSection);

  const renderRoomCard = (room, traveler) => {
    const ballot = traveler ? rankings[traveler] : null;
    const selectedRank = ballot ? ballot[room.id] : null;
    const hasMultiple = room.images.length > 1;
    return `
      <article class="room-ranking-card" data-room-card="${room.id}" data-photo-index="0">
        <div class="room-photo-viewer">
          <img class="room-main-photo" src="Assets/Assets/Images/${room.images[0]}" alt="${room.title}" loading="lazy" />
          ${hasMultiple ? '<button class="room-photo-control prev" type="button" aria-label="Previous room photo">‹</button><button class="room-photo-control next" type="button" aria-label="Next room photo">›</button>' : ''}
          <span class="room-photo-count">1 / ${room.images.length}</span>
          ${selectedRank ? `<span class="room-choice-ribbon rank-${selectedRank}">${rankLabels[selectedRank]}</span>` : ''}
        </div>
        <div class="room-photo-thumbs" aria-label="${room.title} photos">
          ${room.images.map((image, index) => `<button type="button" class="room-photo-thumb ${index === 0 ? 'active' : ''}" data-room-photo="${index}" aria-label="Show ${room.title} photo ${index + 1}"><img src="Assets/Assets/Images/${image}" alt="" /></button>`).join('')}
        </div>
        <div class="room-ranking-body">
          <div class="room-title-row">
            <div><h3>${room.title}</h3><span>Queen bed</span></div>
            ${selectedRank ? `<strong>${rankLabels[selectedRank]}</strong>` : '<strong>Not ranked yet</strong>'}
          </div>
          <p>${room.note}</p>
          <div class="room-rank-buttons" aria-label="Rank ${room.title}">
            ${[1, 2, 3].map(rank => `<button type="button" data-room-rank="${rank}" data-room-id="${room.id}" class="${selectedRank === rank ? 'selected' : ''}" ${traveler ? '' : 'disabled'}><span>${rank}</span>${rankLabels[rank]}</button>`).join('')}
          </div>
        </div>
      </article>
    `;
  };

  const renderFamilyBoard = () => {
    const board = document.getElementById('roomFamilyBoard');
    const complete = travelerNames.filter(name => completedCount(rankings[name]) === 3).length;
    document.getElementById('roomBallotsComplete').textContent = `${complete} of ${travelerNames.length} ballots complete`;

    board.innerHTML = travelerNames.map(name => {
      const ballot = rankings[name];
      const choices = [1, 2, 3].map(rank => {
        const roomId = Object.keys(ballot).find(id => ballot[id] === rank);
        const room = roomDefinitions.find(item => item.id === roomId);
        return `<div class="family-rank rank-${rank}"><span>${rank}</span><div><small>${rankLabels[rank]}</small><strong>${room?.title || 'Not chosen yet'}</strong></div></div>`;
      }).join('');
      return `<article class="family-ballot-row ${completedCount(ballot) === 3 ? 'complete' : ''}"><div class="family-ballot-name"><strong>${name}</strong><small>${completedCount(ballot)}/3 ranked</small></div><div class="family-ballot-choices">${choices}</div></article>`;
    }).join('');
  };

  const renderConsensus = () => {
    const results = roomDefinitions.map(room => {
      const votes = travelerNames.map(name => rankings[name]?.[room.id]).filter(rank => [1, 2, 3].includes(Number(rank)));
      const points = votes.reduce((sum, rank) => sum + rankPoints[rank], 0);
      const firsts = votes.filter(rank => rank === 1).length;
      return { room, votes: votes.length, points, firsts };
    }).sort((a, b) => b.points - a.points || b.firsts - a.firsts || a.room.title.localeCompare(b.room.title));

    const root = document.getElementById('roomConsensus');
    root.innerHTML = results.map((result, index) => `
      <article class="consensus-row">
        <span class="consensus-position">${index + 1}</span>
        <img src="Assets/Assets/Images/${result.room.images[0]}" alt="" />
        <div>
          <strong>${result.room.title}</strong>
          <small>${result.points} point${result.points === 1 ? '' : 's'} · ${result.firsts} first-choice vote${result.firsts === 1 ? '' : 's'} · ${result.votes} rating${result.votes === 1 ? '' : 's'}</small>
        </div>
      </article>
    `).join('');
  };

  const attachPhotoControls = () => {
    document.querySelectorAll('[data-room-card]').forEach(card => {
      const room = roomDefinitions.find(item => item.id === card.dataset.roomCard);
      if (!room) return;
      const mainPhoto = card.querySelector('.room-main-photo');
      const count = card.querySelector('.room-photo-count');
      const thumbs = [...card.querySelectorAll('[data-room-photo]')];
      const showPhoto = nextIndex => {
        const index = (nextIndex + room.images.length) % room.images.length;
        card.dataset.photoIndex = String(index);
        mainPhoto.src = `Assets/Assets/Images/${room.images[index]}`;
        count.textContent = `${index + 1} / ${room.images.length}`;
        thumbs.forEach((thumb, thumbIndex) => thumb.classList.toggle('active', thumbIndex === index));
      };
      card.querySelector('.room-photo-control.prev')?.addEventListener('click', () => showPhoto(Number(card.dataset.photoIndex) - 1));
      card.querySelector('.room-photo-control.next')?.addEventListener('click', () => showPhoto(Number(card.dataset.photoIndex) + 1));
      thumbs.forEach(thumb => thumb.addEventListener('click', () => showPhoto(Number(thumb.dataset.roomPhoto))));
    });
  };

  const renderRankings = () => {
    const traveler = selectedName();
    const person = document.getElementById('roomRankingPerson');
    const help = document.getElementById('roomBallotHelp');
    const grid = document.getElementById('roomRankingGrid');

    if (traveler) {
      const progress = completedCount(rankings[traveler]);
      person.innerHTML = `<span>Ranking as</span><strong>${traveler}</strong><small>${progress}/3 choices complete</small>`;
      help.innerHTML = progress === 3
        ? `<strong>${traveler}'s ballot is complete.</strong> Tap any rank to swap the order.`
        : `<strong>${traveler}, choose one room for each rank.</strong> The app will prevent duplicate first, second, or third choices.`;
    } else {
      person.innerHTML = '<span>Room ballot</span><strong>Choose your name first</strong><small>Each traveler gets a separate ranking.</small>';
      help.innerHTML = '<strong>Choose Parker, Blake, Porter, Mark, or Nancy from the traveler button above.</strong> Then rank all three rooms.';
    }

    grid.innerHTML = roomDefinitions.map(room => renderRoomCard(room, traveler)).join('');
    attachPhotoControls();
    grid.querySelectorAll('[data-room-rank][data-room-id]').forEach(button => {
      button.addEventListener('click', () => {
        const currentTraveler = selectedName();
        if (!currentTraveler) return;
        assignRank(currentTraveler, button.dataset.roomId, Number(button.dataset.roomRank));
      });
    });
    renderFamilyBoard();
    renderConsensus();
  };

  const originalChooseTraveler = typeof chooseTraveler === 'function' ? chooseTraveler : null;
  if (originalChooseTraveler && !window.__roomRankingTravelerHooked) {
    window.__roomRankingTravelerHooked = true;
    chooseTraveler = name => {
      originalChooseTraveler(name);
      window.setTimeout(renderRankings, 0);
    };
  }

  window.TCShared?.subscribe('room_rankings', value => {
    rankings = normalizeRankings(value);
    localStorage.setItem('tcRoomRankings', JSON.stringify(rankings));
    renderRankings();
  });

  document.addEventListener('tc-shared-ready', async () => {
    try {
      const sharedRankings = await window.TCShared?.read('room_rankings');
      if (sharedRankings && typeof sharedRankings === 'object') {
        rankings = normalizeRankings(sharedRankings);
        localStorage.setItem('tcRoomRankings', JSON.stringify(rankings));
        renderRankings();
      } else if (Object.values(rankings).some(ballot => completedCount(ballot))) {
        await window.TCShared?.write('room_rankings', rankings);
      }
    } catch (error) {
      console.warn('Using local room rankings:', error.message);
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

  rankingSection.after(mapSection);
  renderRankings();
})();