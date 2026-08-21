(() => {
  const VERSION = '20260821-1';
  const FAMILY = ['Parker', 'Blake', 'Porter', 'Mark', 'Nancy'];
  const GAME_LOG_KEY = 'tcVacationGameLogV1';
  const GAME_SHARED_KEY = 'vacation_game_log_v1';
  const ORIGIN_KEY = 'tcVacationOriginV1';
  const HOUSE_ADDRESS_KEY = 'tcHouseAddressPrivate';
  const ORIGINS = {
    cumberland: { label: 'Cumberland, WI', address: '1500 Elm Street, Cumberland, WI' },
    madison: { label: 'Madison, WI', address: '7133 Gladstone Drive, Madison, WI' }
  };

  const GAMES = [
    { icon: '🚙', name: 'License Plate Hunt', text: 'Collect states and provinces. One point per new plate, two if nobody else spotted it first.' },
    { icon: '🔤', name: 'Alphabet Signs', text: 'Find A through Z in order on road signs, storefronts, billboards, or plates. Q remains a tiny roadside villain.' },
    { icon: '❓', name: '20 Questions', text: 'One person thinks of a person, place, thing, or character. Everyone else gets up to twenty yes-or-no questions to figure it out.' },
    { icon: '🧠', name: 'Word Association', text: 'Start with any word. Go around the car answering immediately with a related word. Hesitate, repeat, or make a connection nobody buys and the round resets.' },
    { icon: '🎭', name: 'Fortunately / Unfortunately', text: 'Build one story together. Each sentence alternates between starting with “Fortunately…” and “Unfortunately…”.' },
    { icon: '🌎', name: 'The Geography Game', text: 'Name a place. The next place must begin with the last letter of the previous one. Traverse City → Yakima → Amsterdam, and onward.' },
    { icon: '🐄', name: 'My Cows!', text: 'Call “My cows!” when you spot a herd to earn a point. Separate herds divided by fences, rocks, trees, or other barriers count separately. If somebody spots a cemetery and yells “Bury your cows!”, everyone else loses their cows.' },
    { icon: '🌊', name: 'My Cows + My Pond', text: 'Play My Cows, but bodies of water become weapons. Yell “My pond!” and choose one player to lose roughly the number of cows it would take, lined head-to-butt, to span the water.' },
    { icon: '🐎', name: 'HORSE', text: 'You may only claim horses on your side of the vehicle. Each spotted horse earns the next letter in HORSE. A graveyard on your side wipes your current letters. First to spell HORSE wins.' },
    { icon: '📞', name: 'Contact', text: 'One player secretly chooses a word and reveals only its first letter. Other players give clue-definitions for words beginning with that letter and try to make contact before the chooser guesses the clue word.' },
    { icon: '👻', name: 'Ghost', text: 'Take turns adding one letter to a growing word fragment. Do not complete a valid word, but keep the fragment capable of becoming one. Challenge bluffers steering into nonsense.' },
    { icon: '🧺', name: 'Going on a Picnic', text: 'One player invents a secret rule for what may come on the picnic. Everyone proposes items and gets a yes or no until somebody figures out the hidden rule.' },
    { icon: '🕯️', name: 'Mystery Stories', text: 'One person gives a strange situation with a hidden explanation. Everyone else may ask only yes-or-no questions until the group reconstructs what happened. Keep the mysteries funny, eerie, or weird.' },
    { icon: '📚', name: 'One-Sentence Road Story', text: 'Go around the car adding exactly one sentence at a time. No planning ahead. Let the story become whatever creature it becomes.' },
    { icon: '🔠', name: 'Alphabet Story', text: 'Tell a story one sentence at a time, but each new sentence must start with the next letter of the alphabet. A, then B, then C, all the way to Z.' },
    { icon: '🎧', name: 'Trip DJ Challenge', text: 'Pick a category like “song with a place name” or “song that belongs on a lake.” Everyone nominates one and the car votes.' },
    { icon: '🦌', name: 'Spot the Weird', text: 'First person to spot an odd roadside attraction, strange statue, giant object, or suspiciously taxidermy-adjacent sign gets the point.' },
    { icon: '🌲', name: 'Would You Rather: Up North', text: 'Lighthouse keeper or fish tug captain? Dune hike or stormy museum day? Cherry everything or no cherries at all?' },
    { icon: '👀', name: 'I Spy: Road Edition', text: 'Classic I Spy, except the object has to stay visible long enough to be guessable. Moving vehicles count only if the car agrees.' },
    { icon: '🧾', name: 'Roadside Bingo', text: 'Choose nine targets together: tractor, water tower, dog in a car, weird billboard, motorcycle, silo, camper, construction cone, giant roadside object. First to spot all nine wins.' },
    { icon: '✋', name: 'Name Five', text: 'Pick a category and a player: five animated movies, five Michigan towns, five dog breeds, five foods starting with S. They get five seconds.' },
    { icon: '🎬', name: 'Movie Chain', text: 'Name a movie. The next player names an actor from it, then another movie with that actor, then a different actor from that movie. Keep the chain alive.' },
    { icon: '🕵️', name: 'Who Am I?', text: 'Think of a real person or fictional character. Everyone asks yes-or-no questions until somebody identifies you. The winner chooses the next identity.' },
    { icon: '🪄', name: 'Two Truths and a Lie', text: 'Give the car three statements about yourself, two true and one fake. Everyone votes on the lie before you reveal it.' },
    { icon: '⏱️', name: 'Five-Second Challenge', text: 'Give someone a category and five seconds to name three things in it. Make the categories increasingly ridiculous as the drive gets longer.' },
    { icon: '🔎', name: 'Same-Letter Hunt', text: 'Choose a letter. Everyone races to spot five things outside the car beginning with that letter. Signs count, but the same object cannot be claimed twice.' },
    { icon: '🎤', name: 'Three-Clue Song Guess', text: 'Describe a song using only three clues about its title, artist, era, vibe, or where you first heard it. No singing the melody and no quoting lyrics.' },
    { icon: '🧩', name: 'Categories', text: 'Pick a category and go around naming unique answers. No repeats and no long pauses. Last person standing chooses the next category.' }
  ];

  let lastGameName = '';
  let homeObserver = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const safe = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  function selectedOriginId() {
    const value = localStorage.getItem(ORIGIN_KEY);
    return ORIGINS[value] ? value : 'madison';
  }

  function houseDestination() {
    return localStorage.getItem(HOUSE_ADDRESS_KEY)?.trim() || 'West Grand Traverse Bay, Traverse City, MI';
  }

  function fullRouteUrl() {
    const origin = ORIGINS[selectedOriginId()] || ORIGINS.madison;
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin.address)}&destination=${encodeURIComponent(houseDestination())}&travelmode=driving`;
  }

  function gameLog() {
    try { return JSON.parse(localStorage.getItem(GAME_LOG_KEY) || '[]'); }
    catch { return []; }
  }

  function gameSummaryMarkup() {
    const log = gameLog();
    if (!log.length) return '<span>No road games logged yet. Your future prize committee has a clean slate.</span>';
    const last = log[0];
    return `<span><strong>${log.length}</strong> game${log.length === 1 ? '' : 's'} logged · last: ${safe(last.game)}</span><small>${safe((last.players || []).join(' + '))}</small>`;
  }

  function pickGame() {
    let choices = GAMES.filter(game => game.name !== lastGameName);
    if (!choices.length) choices = GAMES;
    const game = choices[Math.floor(Math.random() * choices.length)];
    lastGameName = game.name;
    return game;
  }

  function ensureDialog() {
    let dialog = $('#tcRoadGameDeckDialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'tcRoadGameDeckDialog';
    dialog.className = 'road-game-deck-dialog';
    dialog.innerHTML = '<button type="button" class="road-game-close" data-road-game-close aria-label="Close">×</button><div id="tcRoadGameDeckBody"></div>';
    document.body.appendChild(dialog);
    dialog.querySelector('[data-road-game-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    return dialog;
  }

  function openGame() {
    const dialog = ensureDialog();
    const game = pickGame();
    const body = $('#tcRoadGameDeckBody');
    body.innerHTML = `
      <div class="road-game-icon">${game.icon}</div>
      <p class="eyebrow dark">Road-trip game drawer · ${GAMES.length} ideas</p>
      <h2>${safe(game.name)}</h2>
      <p class="road-game-rules">${safe(game.text)}</p>
      <div class="road-game-player-picker">
        <strong>Who is playing?</strong>
        <div>${FAMILY.map(name => `<label><input type="checkbox" value="${safe(name)}" checked><span>${safe(name)}</span></label>`).join('')}</div>
      </div>
      <p class="road-game-error" hidden>Pick at least one player so the log knows who joined.</p>
      <div class="road-game-actions">
        <button type="button" data-road-game-another>Different game</button>
        <button type="button" class="road-game-primary" data-road-game-log>Log this game</button>
      </div>`;
    body.querySelector('[data-road-game-another]').addEventListener('click', openGame);
    body.querySelector('[data-road-game-log]').addEventListener('click', () => logGame(game));
    if (!dialog.open) dialog.showModal();
  }

  async function logGame(game) {
    const dialog = ensureDialog();
    const players = $$('input[type="checkbox"]:checked', dialog).map(input => input.value);
    if (!players.length) {
      const error = $('.road-game-error', dialog);
      if (error) error.hidden = false;
      return;
    }
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      game: game.name,
      icon: game.icon,
      players,
      startedAt: new Date().toISOString()
    };
    const log = [entry, ...gameLog()].slice(0, 100);
    localStorage.setItem(GAME_LOG_KEY, JSON.stringify(log));
    try { await window.TCShared?.write?.(GAME_SHARED_KEY, log); } catch {}
    dialog.close();
    refreshGameSummary();
  }

  function refreshGameSummary() {
    const target = $('#roadGameSummary');
    if (target) target.innerHTML = gameSummaryMarkup();
  }

  function reshapeHome() {
    const home = $('[data-panel="home"]');
    if (!home) return false;
    const vacationHome = $('.tc-vacation-home', home);
    const combined = $('.vacay-favorites-map', home);
    if (!vacationHome || !combined) return false;
    if (vacationHome.dataset.mapGamesPass === VERSION) {
      refreshGameSummary();
      return true;
    }

    vacationHome.dataset.mapGamesPass = VERSION;
    const favorites = $('.vacay-favorites-side', combined);
    const map = $('.vacay-map-side', combined);
    if (!favorites || !map) return false;

    $('.vacay-game-button', map)?.remove();
    $('.vacay-game-log', map)?.remove();

    combined.classList.add('road-trip-map-block');
    favorites.classList.add('road-trip-favorites-strip');
    map.classList.add('road-trip-map-main');

    const mapHead = $('.vacay-card-head', map);
    if (mapHead) {
      const actions = document.createElement('div');
      actions.className = 'road-trip-map-actions';
      actions.innerHTML = `
        <a href="${fullRouteUrl()}" target="_blank" rel="noopener">Open full driving route ↗</a>
        <span>🍴 In Google Maps, use <strong>Search along route → Restaurants</strong> to hunt for food without leaving the drive corridor.</span>`;
      mapHead.insertAdjacentElement('afterend', actions);
    }

    const gameSection = document.createElement('section');
    gameSection.className = 'vacay-card road-game-section';
    gameSection.innerHTML = `
      <div class="road-game-copy">
        <p class="vacay-label">Car games</p>
        <h2>Need a distraction? Open the glovebox.</h2>
        <p>${GAMES.length} road-trip games are hiding in here, from My Cows and HORSE to Contact, Ghost, mystery stories, song games, geography, and pure nonsense.</p>
        <div class="road-game-summary" id="roadGameSummary">${gameSummaryMarkup()}</div>
      </div>
      <div class="road-game-cta-wrap">
        <span class="road-game-dice">🎲</span>
        <button type="button" class="road-game-cta" data-road-game-open>Give us a random game</button>
        <small>Pick players, log the game, award ridiculous prizes later.</small>
      </div>`;

    combined.insertAdjacentElement('afterend', gameSection);
    gameSection.querySelector('[data-road-game-open]').addEventListener('click', openGame);
    return true;
  }

  function observeHome() {
    const home = $('[data-panel="home"]');
    if (!home || homeObserver) return;
    homeObserver = new MutationObserver(() => {
      const vacationHome = $('.tc-vacation-home', home);
      if (vacationHome && vacationHome.dataset.mapGamesPass !== VERSION) requestAnimationFrame(reshapeHome);
    });
    homeObserver.observe(home, { childList: true, subtree: true });
  }

  async function hydrateGameLog() {
    try {
      const remote = await window.TCShared?.read?.(GAME_SHARED_KEY);
      if (!Array.isArray(remote) || !remote.length) return;
      const merged = [...remote, ...gameLog()].reduce((map, item) => {
        if (item?.id) map.set(item.id, item);
        return map;
      }, new Map());
      const log = [...merged.values()]
        .sort((a, b) => String(b.startedAt).localeCompare(String(a.startedAt)))
        .slice(0, 100);
      localStorage.setItem(GAME_LOG_KEY, JSON.stringify(log));
      refreshGameSummary();
    } catch {}
  }

  function init() {
    const home = $('[data-panel="home"]');
    if (!home) {
      window.setTimeout(init, 150);
      return;
    }

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = `road-trip-games-map.css?v=${VERSION}`;
    document.head.appendChild(style);

    reshapeHome();
    observeHome();
    hydrateGameLog();
    document.addEventListener('tc-shared-ready', hydrateGameLog);
    document.addEventListener('tc-trip-companion-ready', () => window.setTimeout(reshapeHome, 150));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => window.setTimeout(init, 950));
  else window.setTimeout(init, 950);
})();
