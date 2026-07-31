(() => {
  const MODES = ['explore', 'eat', 'shop'];
  const modeMeta = {
    explore: {
      eyebrow: 'Explore',
      title: 'Choose the kind of day you want.',
      description: 'Dunes, beaches, trails, museums, gardens, and low-key scenic stops, all in one place.',
      image: 'Sleeping Bear Dunes Nataional Lakeshore Ariel Image.jpg',
      alt: 'Aerial view of Sleeping Bear Dunes National Lakeshore',
      icon: '🧭'
    },
    eat: {
      eyebrow: 'Eat',
      title: 'Find the meal that fits the moment.',
      description: 'Casual burgers, local favorites, memorable dinners, and food stops grouped by where you will already be.',
      image: 'Art Tavern Building.jpeg',
      alt: "Art's Tavern in Glen Arbor",
      icon: '🍴'
    },
    shop: {
      eyebrow: 'Shop',
      title: 'Build a wandering route around the good stuff.',
      description: 'Books, records, comics, art, Michigan gifts, and the full Grand Traverse Commons directory.',
      image: 'Downtown Traverse City Shopping.jpeg',
      alt: 'Downtown Traverse City shopping district',
      icon: '🛍️'
    }
  };

  const exactImages = {
    'arts': 'Art Tavern Building.jpeg',
    'cherry-public': 'Cherry Republic - Cherry Public House and Great Hall of the Repbulic Glen Arbor.webp',
    'rpm-records': 'RPM Records.jpeg',
    'top-comics': 'Top Comics Outside.jpeg',
    'horizon': 'Horizon Books.jpeg',
    'laughing-fish': 'Laughing Fish Gallery.jpeg',
    'cherry-republic-tc': 'Cherry Republic Traverse City.jpg',
    'cherry-republic-ga': 'Cherry Republic Glen Arbor.jpg',
    'fishtown': 'Fishtown - Leelanau Artisan - Local goods.webp',
    'house-water': 'Traverse City - Pier and Beach access.webp',
    'clinch-park': 'Clinch Park Beach at Sunset.jpg',
    'commons-trails': 'Grand Traverse Commons - Scenic Walking Trail.webp',
    'old-mission-drive': 'Cherry Orchard 1.jpeg',
    'mission-point': 'Mission Point Lighthouse.webp',
    'suttons-bay-walk': 'Suttons Bay Marina.jpeg',
    'fishtown-walk': 'Fishtown - Shantys on Canal.jpg',
    'empire-bluff': 'Sleeping Bear Dunes from the Lake View.jpeg',
    'pyramid-point': 'Sleeping Bear Dunes Steep Dune Blue Water.webp',
    'dune-climb': 'Sleeping Bear Dunes - Dune Climb.webp',
    'pierce-stocking': 'Pierce Stocking Scenic Drive.jpg',
    'rainy-commons': 'Grand Traverse Commons 1.jpg',
    'commons-botanic': 'Grand Traverse Commons - Botanical Garden 1.jpg',
    'commons-tunnel-tour': 'Grand Traverse Common Tunnel.webp',
    'commons-arboretum': 'Grand Traverse Commons Historic image.webp',
    'music-house': 'The Music House Museum Outside Image.jpeg',
    'moomers': 'Moomers Ice Cream Building.jpg',
    'sara-hardy-market': 'Sara Hardy Farmers Market.jpeg',
    'glen-haven-beach': 'Glen Haven Beach 1.jpeg',
    'brys-secret-garden': 'Brys Estate - Secret Garden Lavender.webp',
    'village-store': 'Grand Travese Commons - The Village Store.webp'
  };

  const areaImages = {
    commons: [
      'Grand Traverse Common Shopping.jpg',
      'Grand Traverse Commons 1.jpg',
      'Grand Traverse Commons from Above.webp',
      'Grand Travese Commons - The Village Store.webp'
    ],
    traverseShop: [
      'Downtown Traverse City Shopping.jpeg',
      'Horizon Books.jpeg',
      'Cherry Republic Traverse City.jpg'
    ],
    traverseEat: [
      'Downtown Traverse City From Above.jpeg',
      'Clinch Park Beach at Sunset.jpg',
      'Cherry in Orchard close up.jpeg'
    ],
    suttons: ['Suttons Bay Marina.jpeg'],
    leland: [
      'Fishtown - Shantys on Canal 2.webp',
      'Leland - Local Downtown Boutiques.webp',
      'Fishtown - Village Cheese Shanty.webp'
    ],
    glenArbor: [
      'Sleeping Bear Dunes Sunset Cloudy Sky.jpg',
      'Cherry Republic Glen Arbor.jpg',
      'Sleeping Bear Dunes 1.jpg'
    ],
    sleepingBear: [
      'Sleeping Bear Dunes Nataional Lakeshore Ariel Image.jpg',
      'Sleeping Bear Dunes Steep Dune Blue Water 2.webp',
      'Sleeping Bear Dunes from the Lake View.jpeg'
    ],
    oldMission: [
      'Cherry Orchard 1.jpeg',
      'Mission Point Lighthouse - Hidden SANDBAR.webp',
      'Mission Point Lighthouse.webp'
    ],
    default: [
      'Downtown Traverse City From Above.jpeg',
      'Traverse City - Pier and Beach access.webp',
      'Cherry in Orchard close up.jpeg'
    ]
  };

  const supplementalShops = [
    { id: 'premier-floral', name: 'Premier Floral Design & Gift Emporium', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'gifts', icon: '💐', url: 'https://www.thevillagetc.com/shop', fit: ['Parker', 'Nancy'], summary: 'Floral design, gifts, and decorative finds inside the Village at Grand Traverse Commons.' },
    { id: 'landmark-books', name: 'Landmark Books', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'books', icon: '📚', url: 'https://www.thevillagetc.com/shop', fit: ['Parker', 'Porter', 'Nancy'], summary: 'A Commons book stop for browsing between the historic buildings, cafés, and galleries.' },
    { id: 'crystal-lake-alpaca', name: 'Crystal Lake Alpaca Boutique', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'boutique', icon: '🦙', url: 'https://www.thevillagetc.com/shop', fit: ['Parker', 'Nancy'], summary: 'Soft alpaca clothing, accessories, and giftable northern Michigan coziness.' },
    { id: 'moonstruck-gardens', name: 'Moonstruck Gardens', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'gifts', icon: '🌙', url: 'https://www.thevillagetc.com/shop', fit: ['Parker', 'Nancy'], summary: 'Garden-inspired goods and a dreamy browse inside the Commons.' },
    { id: 'high-five-threads', name: 'High Five Threads', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'boutique', icon: '✋', url: 'https://www.thevillagetc.com/shop', fit: ['Parker', 'Porter', 'Blake'], summary: 'Michigan-made apparel and graphics with local personality.' },
    { id: 'haberdashery', name: 'The Haberdashery', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'boutique', icon: '🎩', url: 'https://www.thevillagetc.com/shop', fit: ['Blake', 'Mark'], summary: 'Menswear and accessories in the Village shopping district.' },
    { id: 'haven-clothing', name: 'Haven: A Clothing Market', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'boutique', icon: '👗', url: 'https://www.thevillagetc.com/shop', fit: ['Parker', 'Nancy'], summary: 'A clothing boutique tucked into the walkable Commons storefronts.' },
    { id: 'silver-fox-jewelry', name: 'Silver Fox Jewelry', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'art', icon: '💍', url: 'https://www.thevillagetc.com/shop', fit: ['Parker', 'Nancy'], summary: 'Jewelry and wearable treasures inside the historic Village.' },
    { id: 'refillery-tc', name: 'The Refillery Traverse City', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'gifts', icon: '♻️', url: 'https://www.thevillagetc.com/shop', fit: ['Parker', 'Nancy'], summary: 'Low-waste household and personal-care goods for a practical browse.' },
    { id: 'baby-dill', name: 'Baby Dill', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'boutique', icon: '🧸', url: 'https://www.thevillagetc.com/shop', fit: ['Nancy', 'Parker'], summary: 'Children’s clothing and gifts in the Village shopping collection.' },
    { id: 'bohmey-lifestyle', name: 'Bohmey Lifestyle Boutique', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'boutique', icon: '✨', url: 'https://www.thevillagetc.com/shop', fit: ['Parker', 'Nancy'], summary: 'Clothing, accessories, and lifestyle pieces in the Commons.' },
    { id: 'underground-toys', name: 'Underground Toys', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'games', icon: '🧩', url: 'https://www.thevillagetc.com/shop', fit: ['Porter', 'Blake'], summary: 'Toys, collectibles, and curious finds with strong Porter potential.' },
    { id: 'sweet-asylum', name: 'Sweet Asylum', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'food', icon: '🍬', url: 'https://www.thevillagetc.com/shop', fit: ['Porter', 'Parker', 'Nancy'], summary: 'Candy and sweet treats for the “we wandered into this on purpose” portion of the day.' },
    { id: 'village-store', name: 'B50 The Village Store', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'gifts', icon: '🏛️', url: 'https://www.thevillagetc.com/shop', fit: ['Everyone'], summary: 'Village and Commons gifts, local history, and a natural souvenir stop.' },
    { id: 'sara-hardy-market', name: 'Sara Hardy Downtown Farmers Market', town: 'Traverse City', area: 'Traverse City / Downtown', type: 'food', icon: '🥕', url: 'https://www.downtowntc.com/sara-hardy-downtown-farmers-market/', fit: ['Parker', 'Nancy', 'Mark'], summary: 'A downtown market stop for local produce, makers, flowers, and edible souvenirs.' }
  ];

  const supplementalRestaurants = [
    { id: 'barrel-room', name: 'The Barrel Room', town: 'Traverse City', area: 'Grand Traverse Commons', price: '$$', icon: '🍇', url: 'https://www.thevillagetc.com/dine/', tags: ['winery', '21-plus', 'commons'], fit: [], summary: 'A wine-tasting experience listed in the Commons dining directory, included for directory completeness.', menu: 'Wine-focused tasting experience; verify current offerings directly.' },
    { id: 'cuppa-joe', name: 'Cuppa Joe', town: 'Traverse City', area: 'Grand Traverse Commons', price: '$', icon: '☕', url: 'https://www.thevillagetc.com/dine/', tags: ['coffee', 'quick', 'commons'], fit: ['Parker', 'Blake', 'Nancy'], summary: 'Coffee and a quick pause inside the Commons.', menu: 'Coffee, café drinks, and light café fare.' },
    { id: 'higher-grounds', name: 'Higher Grounds Trading Company', town: 'Traverse City', area: 'Grand Traverse Commons', price: '$', icon: '☕', url: 'https://www.thevillagetc.com/dine/', tags: ['coffee', 'quick', 'commons'], fit: ['Parker', 'Blake', 'Nancy'], summary: 'A Commons coffee stop that fits naturally into a walking-and-shopping block.', menu: 'Coffee and café drinks.' },
    { id: 'pepenero-ballaro', name: 'Pepenero / Ballaro Wine Lounge', town: 'Traverse City', area: 'Grand Traverse Commons', price: '$$$', icon: '🇮🇹', url: 'https://www.thevillagetc.com/dine/', tags: ['pasta', 'wine', '21-plus', 'commons'], fit: [], summary: 'Southern Italian dining paired with a wine-lounge concept, included for directory completeness.', menu: 'Italian dishes and wine-lounge service; verify the current menu directly.' },
    { id: 'pleasanton-bakery', name: 'Pleasanton Brick Oven Bakery', town: 'Traverse City', area: 'Grand Traverse Commons', price: '$', icon: '🥖', url: 'https://www.thevillagetc.com/dine/', tags: ['bakery', 'quick', 'commons'], fit: ['Everyone'], summary: 'Brick-oven bread and bakery fare, ideal for a low-ceremony Commons stop.', menu: 'Bread, baked goods, and rotating bakery fare.' },
    { id: 'red-spire', name: 'Red Spire Brunch House', town: 'Traverse City', area: 'Grand Traverse Commons', price: '$$', icon: '🍳', url: 'https://www.thevillagetc.com/dine/', tags: ['brunch', 'family', 'commons'], fit: ['Parker', 'Nancy', 'Mark'], summary: 'A brunch-focused Commons option for the beginning of a Village day.', menu: 'Brunch and breakfast-style dishes.' },
    { id: 'sugar-2-salt', name: 'S2S Sugar 2 Salt', town: 'Traverse City', area: 'Grand Traverse Commons', price: '$$', icon: '🥞', url: 'https://www.thevillagetc.com/dine/', tags: ['brunch', 'local-favorite', 'commons'], fit: ['Parker', 'Nancy', 'Mark'], summary: 'A creative daytime meal inside the Commons.', menu: 'Seasonal brunch and lunch fare.' },
    { id: 'spanglish', name: 'Spanglish', town: 'Traverse City', area: 'Grand Traverse Commons', price: '$', icon: '🌮', url: 'https://www.thevillagetc.com/dine/', tags: ['quick', 'family', 'commons'], fit: ['Porter', 'Blake', 'Parker'], summary: 'Casual Mexican food that keeps the Commons day flexible.', menu: 'Tacos, burritos, and casual Mexican dishes.' },
    { id: 'earthen-ales', name: 'Earthen Ales Taproom & Brewery', town: 'Traverse City', area: 'Grand Traverse Commons', price: '$$', icon: '🍺', url: 'https://www.thevillagetc.com/dine/', tags: ['brewery', '21-plus', 'commons'], fit: [], summary: 'A brewery and taproom listed in the Commons dining directory.', menu: 'Beer-focused stop; verify food and hours directly.' },
    { id: 'left-foot-charley', name: 'Left Foot Charley Winery', town: 'Traverse City', area: 'Grand Traverse Commons', price: '$$', icon: '🍇', url: 'https://www.thevillagetc.com/dine/', tags: ['winery', '21-plus', 'commons'], fit: [], summary: 'A wine-focused Commons storefront included for directory completeness.', menu: 'Wine tasting; verify current offerings directly.' },
    { id: 'obrien-vineyards', name: 'ŌBrien Vineyards', town: 'Traverse City', area: 'Grand Traverse Commons', price: '$$', icon: '🍇', url: 'https://www.thevillagetc.com/dine/', tags: ['winery', '21-plus', 'commons'], fit: [], summary: 'A wine-focused Village listing included for directory completeness.', menu: 'Wine tasting; verify current offerings directly.' },
    { id: 'moomers', name: 'Moomers Homemade Ice Cream', town: 'Traverse City', area: 'Traverse City / West Side', price: '$', icon: '🍦', url: 'https://moomers.com/', tags: ['dessert', 'family', 'local-favorite'], fit: ['Porter', 'Parker', 'Nancy', 'Blake', 'Mark'], summary: 'A classic local ice-cream stop with enough visual charm to count as a tiny activity.', menu: 'Homemade ice cream and rotating flavors.' }
  ];

  const supplementalActivities = [
    { id: 'commons-botanic', name: 'The Botanic Garden at Historic Barns Park', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'relax', icon: '🌸', url: 'https://thebotanicgarden.org/', tags: ['free', 'low-energy', 'scenic', 'dog-friendly'], fit: ['Parker', 'Nancy', 'Mark'], dog: 'Leashed dogs are welcome outdoors where posted rules allow', summary: 'Gardens, historic barns, and an easy outdoor pause beside the Commons.' },
    { id: 'commons-tunnel-tour', name: 'Grand Traverse Commons Historic & Tunnel Tour', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'history', icon: '🔦', url: 'https://www.thevillagetc.com/tour/', tags: ['history', 'rainy-day', 'active'], fit: ['Parker', 'Blake', 'Porter', 'Mark', 'Nancy'], dog: 'Dogs would stay home for the indoor guided tour', summary: 'A guided look at the preserved buildings and underground tunnel system.' },
    { id: 'commons-arboretum', name: 'Front Lawn & Historic Arboretum', town: 'Traverse City', area: 'Grand Traverse Commons', type: 'relax', icon: '🌳', url: 'https://www.thevillagetc.com/explore/', tags: ['free', 'low-energy', 'scenic', 'dog-friendly'], fit: ['Everyone'], dog: 'Leashed dogs can join the outdoor wander', summary: 'A gentle historic-campus walk that connects naturally with the Village shops and food.' },
    { id: 'music-house', name: 'The Music House Museum', town: 'Williamsburg', area: 'East of Traverse City', type: 'history', icon: '🎹', url: 'https://www.musichouse.org/', tags: ['rainy-day', 'history', 'family'], fit: ['Porter', 'Blake', 'Parker', 'Mark'], dog: 'Dogs would stay home for the museum visit', summary: 'Mechanical instruments, music machines, and wonderfully strange sound-making history.' },
    { id: 'glen-haven-beach', name: 'Glen Haven Beach', town: 'Glen Arbor', area: 'Glen Haven / Sleeping Bear', type: 'beach', icon: '🏖️', url: 'https://www.nps.gov/slbe/planyourvisit/glenhaven.htm', tags: ['free', 'water', 'scenic', 'low-energy'], fit: ['Everyone'], dog: 'Follow current National Lakeshore pet restrictions for this beach area', summary: 'A Lake Michigan shoreline stop near Glen Haven’s preserved historic village.' },
    { id: 'brys-secret-garden', name: 'Brys Estate Secret Garden', town: 'Old Mission Peninsula', area: 'Old Mission Peninsula', type: 'relax', icon: '🪻', url: 'https://www.brysestate.com/secret-garden', tags: ['scenic', 'low-energy'], fit: ['Parker', 'Nancy', 'Mark'], dog: 'Verify current pet rules before visiting', summary: 'Lavender, gardens, and a photogenic peninsula pause.' }
  ];

  const asset = (filename) => `Assets/${filename.split('/').map(encodeURIComponent).join('/')}`;
  const pickFrom = (items, seed) => items[Math.abs(seed) % items.length];
  const hash = (text) => [...String(text)].reduce((total, char) => total + char.charCodeAt(0), 0);

  function placeKind(place) {
    if (place.kind) return place.kind;
    if (restaurants.includes(place)) return 'restaurant';
    if (shops.includes(place)) return 'shop';
    return 'activity';
  }

  function imageFilenameFor(place) {
    if (exactImages[place.id]) return exactImages[place.id];
    const area = `${place.area || ''} ${place.town || ''}`.toLowerCase();
    const seed = hash(place.id || place.name);
    if (area.includes('grand traverse commons')) return pickFrom(areaImages.commons, seed);
    if (area.includes('suttons bay')) return pickFrom(areaImages.suttons, seed);
    if (area.includes('leland') || area.includes('fishtown')) return pickFrom(areaImages.leland, seed);
    if (area.includes('glen arbor')) return pickFrom(areaImages.glenArbor, seed);
    if (area.includes('sleeping bear') || area.includes('empire')) return pickFrom(areaImages.sleepingBear, seed);
    if (area.includes('old mission')) return pickFrom(areaImages.oldMission, seed);
    const kind = placeKind(place);
    if (kind === 'shop') return pickFrom(areaImages.traverseShop, seed);
    if (kind === 'restaurant') return pickFrom(areaImages.traverseEat, seed);
    return pickFrom(areaImages.default, seed);
  }

  function safeText(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }

  function addSupplementalPlaces() {
    const known = new Set(allPlaces.map((place) => place.id));
    const add = (source, place, kind) => {
      if (known.has(place.id)) return;
      const record = kind === 'shop'
        ? { ...place, kind, price: '', tags: [place.type] }
        : kind === 'restaurant'
          ? { ...place, kind }
          : { ...place, kind: 'activity', price: '', tags: place.tags || [] };
      source.push(place);
      allPlaces.push(record);
      known.add(place.id);
    };

    supplementalShops.forEach((place) => add(shops, place, 'shop'));
    supplementalRestaurants.forEach((place) => add(restaurants, place, 'restaurant'));
    supplementalActivities.forEach((place) => add(activities, place, 'activity'));
  }

  function enhancedPlaceCard(place) {
    const kind = placeKind(place);
    const saved = favorites.includes(place.id);
    const fits = selectedTraveler !== 'Everyone' && (place.fit || []).includes(selectedTraveler);
    const rawTags = place.tags || [place.type];
    const tags = rawTags.slice(0, 6).map((tag) => `<span class="tag">${safeText(String(tag).replaceAll('-', ' '))}</span>`).join('');
    const dog = kind === 'activity'
      ? `<div class="dog-status ${rawTags.includes('dog-friendly') ? 'yes' : 'no'}">🐾 ${safeText(place.dog)}</div>`
      : '';
    const menu = place.menu ? `<div class="menu-examples"><strong>Good to know:</strong> ${safeText(place.menu)}</div>` : '';
    const media = asset(imageFilenameFor(place));
    const type = kind === 'restaurant' ? 'Restaurant' : kind === 'shop' ? 'Shopping' : 'Activity';

    return `<article class="place-card visual-place-card kind-${kind}" data-place-id="${safeText(place.id)}">
      <div class="place-card-media">
        <img src="${media}" alt="Northern Michigan scene for ${safeText(place.name)}" loading="lazy">
        <span class="place-card-media-shade"></span>
        <div class="card-type">${type}</div>
        <div class="icon-badge">${place.icon}</div>
      </div>
      <div class="place-card-body">
        <h3>${safeText(place.name)}</h3>
        <div class="place-sub">📍 ${safeText(place.area)}${place.price ? ` · ${safeText(place.price)}` : ''}${fits ? ' · Strong match' : ''}</div>
        <p>${safeText(place.summary)}</p>
        ${dog}
        <div class="tag-row">${tags}</div>
        ${menu}
        <div class="card-actions">
          ${place.url === '#' ? '' : `<a href="${safeText(place.url)}" target="_blank" rel="noopener">Official info ↗</a>`}
          <button class="save-place ${saved ? 'active' : ''}" data-save="${safeText(place.id)}">${saved ? '♥ Saved' : '♡ Save'}</button>
        </div>
      </div>
    </article>`;
  }

  function buildPlacesPanel() {
    const stage = document.querySelector('.tab-stage');
    const sourcePanels = Object.fromEntries(MODES.map((mode) => [mode, document.querySelector(`[data-panel="${mode}"]`)]));
    if (!stage || MODES.some((mode) => !sourcePanels[mode])) return null;

    const activeSource = MODES.find((mode) => sourcePanels[mode].classList.contains('active'));
    const panel = document.createElement('section');
    panel.className = `tab-panel places-hub${activeSource ? ' active' : ''}`;
    panel.dataset.panel = 'places';
    panel.innerHTML = `
      <section class="places-hero">
        <img id="placesHeroImage" src="${asset(modeMeta.explore.image)}" alt="${modeMeta.explore.alt}">
        <span class="places-hero-shade"></span>
        <div class="places-hero-copy">
          <p class="eyebrow">Places</p>
          <h2 id="placesHeroTitle">${modeMeta.explore.title}</h2>
          <p id="placesHeroDescription">${modeMeta.explore.description}</p>
        </div>
      </section>
      <nav class="places-mode-nav" aria-label="Choose a type of place">
        ${MODES.map((mode) => {
          const meta = modeMeta[mode];
          return `<button type="button" data-place-mode="${mode}" aria-pressed="false">
            <img src="${asset(meta.image)}" alt="">
            <span></span>
            <strong>${meta.icon} ${meta.eyebrow}<small>${mode === 'explore' ? 'Things to do' : mode === 'eat' ? 'Restaurants & treats' : 'Stores & treasures'}</small></strong>
          </button>`;
        }).join('')}
      </nav>
      <div class="places-mode-stage"></div>`;

    const modeStage = panel.querySelector('.places-mode-stage');
    MODES.forEach((mode) => {
      const body = document.createElement('div');
      body.className = 'places-mode-panel';
      body.dataset.placesModePanel = mode;
      while (sourcePanels[mode].firstChild) body.appendChild(sourcePanels[mode].firstChild);
      modeStage.appendChild(body);
      sourcePanels[mode].remove();
    });

    const plannerPanel = stage.querySelector('[data-panel="planner"]');
    stage.insertBefore(panel, plannerPanel || null);
    return { panel, activeMode: activeSource || localStorage.getItem('tcPlacesMode') || 'explore' };
  }

  function rebuildNavigation() {
    const nav = document.querySelector('.bottom-nav');
    if (!nav) return;
    const eatButton = nav.querySelector('[data-tab="eat"]');
    if (eatButton) {
      eatButton.dataset.tab = 'places';
      eatButton.innerHTML = '<span>◉</span><small>Places</small>';
      eatButton.setAttribute('aria-label', 'Places');
    }
    nav.querySelector('[data-tab="explore"]')?.remove();
    nav.querySelector('[data-tab="shop"]')?.remove();
  }

  function clearSpecificFilters(mode) {
    if (mode === 'eat') {
      document.getElementById('restaurantTown').value = 'all';
      document.getElementById('restaurantPrice').value = 'all';
      activeRestaurantTags = [];
      document.querySelectorAll('#restaurantChips button').forEach((button) => button.classList.remove('active'));
    } else if (mode === 'shop') {
      document.getElementById('shopTown').value = 'all';
      document.getElementById('shopType').value = 'all';
    } else {
      document.getElementById('activityTown').value = 'all';
      document.getElementById('activityType').value = 'all';
      activeActivityTags = [];
      renderActivityChips();
    }
  }

  function modeForPlace(place) {
    return place?.kind === 'restaurant' ? 'eat' : place?.kind === 'shop' ? 'shop' : 'explore';
  }

  function dashboardInferredId(trigger) {
    const text = trigger.textContent.toLowerCase();
    if (text.includes('botanic garden')) return 'commons-botanic';
    if (text.includes('music house')) return 'music-house';
    return '';
  }

  function initialize() {
    if (document.querySelector('[data-panel="places"]')) return true;
    if (typeof allPlaces === 'undefined' || typeof restaurants === 'undefined' || typeof showTab === 'undefined') return false;

    addSupplementalPlaces();
    placeCard = enhancedPlaceCard;
    renderRestaurants();
    renderShops();
    renderActivities();

    const built = buildPlacesPanel();
    if (!built) return false;
    rebuildNavigation();

    const { panel } = built;
    const originalShowTab = showTab;
    let activeMode = MODES.includes(built.activeMode) ? built.activeMode : 'explore';

    const updateMode = (mode) => {
      activeMode = MODES.includes(mode) ? mode : 'explore';
      localStorage.setItem('tcPlacesMode', activeMode);
      const meta = modeMeta[activeMode];
      panel.querySelector('#placesHeroImage').src = asset(meta.image);
      panel.querySelector('#placesHeroImage').alt = meta.alt;
      panel.querySelector('#placesHeroTitle').textContent = meta.title;
      panel.querySelector('#placesHeroDescription').textContent = meta.description;
      panel.querySelectorAll('[data-place-mode]').forEach((button) => {
        const isActive = button.dataset.placeMode === activeMode;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
      panel.querySelectorAll('[data-places-mode-panel]').forEach((body) => {
        body.hidden = body.dataset.placesModePanel !== activeMode;
      });
      panel.dataset.activeMode = activeMode;
    };

    const openPlaces = (mode = activeMode, options = {}) => {
      updateMode(mode);
      originalShowTab('places');
      document.querySelectorAll('.bottom-nav [data-tab]').forEach((button) => {
        button.classList.toggle('active', button.dataset.tab === 'places');
      });

      if (!options.placeId) return;
      const place = allPlaces.find((item) => item.id === options.placeId);
      if (!place) return;
      const trueMode = modeForPlace(place);
      if (trueMode !== activeMode) updateMode(trueMode);
      clearSpecificFilters(trueMode);
      const searchIds = { explore: 'activitySearch', eat: 'restaurantSearch', shop: 'shopSearch' };
      const renderers = { explore: renderActivities, eat: renderRestaurants, shop: renderShops };
      const field = document.getElementById(searchIds[trueMode]);
      if (field) field.value = place.name;
      renderers[trueMode]();
      window.setTimeout(() => {
        const card = panel.querySelector(`[data-place-id="${CSS.escape(place.id)}"]`);
        (card || field)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 90);
    };

    showTab = (name) => {
      if (MODES.includes(name)) return openPlaces(name);
      if (name === 'places') return openPlaces(activeMode);
      return originalShowTab(name);
    };

    panel.querySelectorAll('[data-place-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        updateMode(button.dataset.placeMode);
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    document.addEventListener('click', (event) => {
      const target = event.target.closest('[data-tab-target], [data-tab]');
      if (!target) return;
      const requested = target.dataset.tabTarget || target.dataset.tab;
      if (!MODES.includes(requested)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const placeId = target.dataset.placeId || dashboardInferredId(target);
      openPlaces(requested, { placeId });
    }, true);

    updateMode(activeMode);
    if (built.activeMode && MODES.includes(built.activeMode) && panel.classList.contains('active')) {
      originalShowTab('places');
    }

    window.TCPlaces = { open: openPlaces, setMode: updateMode };
    document.dispatchEvent(new CustomEvent('tc-shared-ready'));
    document.dispatchEvent(new CustomEvent('tc-places-ready'));
    return true;
  }

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (initialize() || attempts > 80) window.clearInterval(timer);
  }, 50);
})();
