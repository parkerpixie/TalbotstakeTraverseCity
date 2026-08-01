(() => {
  const activityAdditions = [
    {
      id: 'gt-butterfly-bug-zoo',
      name: 'GT Butterfly House & Bug Zoo',
      town: 'Williamsburg',
      area: 'Williamsburg / East of Traverse City',
      type: 'family',
      icon: '🦋',
      url: 'https://www.gtbutterflyzoo.com/',
      tags: ['family', 'rainy-day', 'low-energy', 'unusual'],
      fit: ['Porter', 'Parker', 'Blake'],
      dog: 'No pets inside; service animals only',
      summary: 'A close-up butterfly and insect experience with strong Porter potential and an excellent rainy-day backup.'
    },
    {
      id: 'music-house',
      name: 'Music House Museum',
      town: 'Acme',
      area: 'Acme / East Bay',
      type: 'history',
      icon: '🎶',
      url: 'https://musichouse.org/',
      tags: ['family', 'rainy-day', 'low-energy', 'history', 'unusual'],
      fit: ['Porter', 'Blake', 'Mark'],
      dog: 'No pets inside; service animals only',
      summary: 'A wonderfully unusual museum of automated music machines, antique instruments, music boxes, and mechanical orchestras.'
    },
    {
      id: 'grand-traverse-lighthouse',
      name: 'Grand Traverse Lighthouse Museum',
      town: 'Northport',
      area: 'Leelanau State Park / Northport',
      type: 'history',
      icon: '🗼',
      url: 'https://www.grandtraverselighthouse.com/',
      tags: ['history', 'scenic', 'family', 'low-energy'],
      fit: ['Mark', 'Nancy', 'Porter', 'Parker'],
      dog: 'Leashed dogs allowed in the state park; not inside museum buildings',
      summary: 'The historic lighthouse museum at the tip of the Leelanau Peninsula, with keeper history, lake views, and state-park grounds.'
    }
  ];

  const fishtownUrl = 'https://www.fishtownmi.org/visit/shops-and-charters/';
  const shopAdditions = [
    {
      id: 'bead-hut',
      name: 'The Bead Hut',
      town: 'Leland',
      area: 'Leland / Fishtown',
      type: 'art',
      icon: '💎',
      url: fishtownUrl,
      fit: ['Parker', 'Nancy', 'Porter'],
      summary: 'Handcrafted jewelry featuring Leland blue, Petoskey stone, beach glass, semi-precious gemstones, anklets, toe rings, and colorful upcycled bags.'
    },
    {
      id: 'carlsons-fishery',
      name: 'Carlson’s Fishery',
      town: 'Leland',
      area: 'Leland / Fishtown',
      type: 'food',
      icon: '🐟',
      url: fishtownUrl,
      fit: ['Mark', 'Blake', 'Nancy'],
      summary: 'A five-generation Fishtown tradition for fresh fish, jerky, smoked fish, and classic harbor flavor.'
    },
    {
      id: 'dam-candy-store',
      name: 'Dam Candy Store',
      town: 'Leland',
      area: 'Leland / Fishtown',
      type: 'food',
      icon: '🍬',
      url: fishtownUrl,
      fit: ['Porter', 'Parker', 'Nancy'],
      summary: 'A cheerful Fishtown sweet stop stocked with candy, ice cream, and chocolates.'
    },
    {
      id: 'diversions-leland',
      name: 'Diversions Leland',
      town: 'Leland',
      area: 'Leland / Fishtown',
      type: 'gifts',
      icon: '🧢',
      url: fishtownUrl,
      fit: ['Blake', 'Porter', 'Mark'],
      summary: 'Hats and caps from classic makers, plus toys, clothing, jewelry, and upbeat souvenirs in a compact Fishtown shop.'
    },
    {
      id: 'mega-bite-charters',
      name: 'Mega-Bite Charter Fishing',
      town: 'Leland',
      area: 'Leland / Fishtown',
      type: 'gifts',
      icon: '🎣',
      url: fishtownUrl,
      fit: ['Mark', 'Blake', 'Porter'],
      summary: 'A charter-fishing option departing from Leland with experienced captains and equipment provided.'
    },
    {
      id: 'haystacks-alices-closet',
      name: 'Haystacks – Alice’s Closet',
      town: 'Leland',
      area: 'Leland / Fishtown',
      type: 'boutique',
      icon: '👗',
      url: fishtownUrl,
      fit: ['Parker', 'Nancy'],
      summary: 'Small-batch northern Michigan clothing in signature prints, plus vintage and handmade treasures inside the historic Ice House Shanty.'
    },
    {
      id: 'leelanau-artisan-pottery',
      name: 'Leelanau Artisan Pottery',
      town: 'Leland',
      area: 'Leland / Fishtown',
      type: 'art',
      icon: '🏺',
      url: fishtownUrl,
      fit: ['Parker', 'Nancy', 'Porter'],
      summary: 'Locally made pottery, prints, photography, jewelry, books, bath goods, maple syrup, honey, dried cherries, and other Leelanau County creations.'
    },
    {
      id: 'leelanau-goods',
      name: 'Leelanau Goods',
      town: 'Leland',
      area: 'Leland / Fishtown',
      type: 'boutique',
      icon: '🪡',
      url: fishtownUrl,
      fit: ['Parker', 'Nancy'],
      summary: 'Slow-fashion clothing with nostalgic designs, custom prints, natural textiles, and a tightly edited collection of independent makers.'
    },
    {
      id: 'tug-stuff',
      name: 'Tug Stuff',
      town: 'Leland',
      area: 'Leland / Fishtown',
      type: 'gifts',
      icon: '🚤',
      url: fishtownUrl,
      fit: ['Mark', 'Blake', 'Porter'],
      summary: 'Fishtown tug-logo merchandise inspired by the historic fishing tugs of 1900.'
    },
    {
      id: 'village-cheese-shanty',
      name: 'Village Cheese Shanty',
      town: 'Leland',
      area: 'Leland / Fishtown',
      type: 'food',
      icon: '🧀',
      url: fishtownUrl,
      fit: ['Everyone'],
      summary: 'Fresh made-to-order sandwiches, imported cheeses, and a famously unfussy Fishtown lunch stop.'
    },
    {
      id: 'wild-lettie',
      name: 'Wild Lettie',
      town: 'Leland',
      area: 'Leland / Fishtown',
      type: 'gifts',
      icon: '🏕️',
      url: fishtownUrl,
      fit: ['Parker', 'Porter', 'Blake'],
      summary: 'Outdoorsy goods and functional adventure gear designed to bring a little wild energy into everyday life.'
    }
  ];

  const addUnique = (collection, records) => {
    records.forEach(record => {
      if (!collection.some(item => item.id === record.id)) collection.push(record);
    });
  };

  addUnique(activities, activityAdditions);
  addUnique(shops, shopAdditions);

  activityAdditions.forEach(record => {
    if (!allPlaces.some(item => item.id === record.id)) allPlaces.push({ ...record, kind: 'activity', price: '', tags: record.tags || [] });
  });
  shopAdditions.forEach(record => {
    if (!allPlaces.some(item => item.id === record.id)) allPlaces.push({ ...record, kind: 'shop', price: '', tags: [record.type] });
  });

  if (typeof renderActivities === 'function') renderActivities();
  if (typeof renderShops === 'function') renderShops();
  if (typeof renderPlanner === 'function') renderPlanner();
  if (typeof updateStats === 'function') updateStats();

  window.TCRestoredPlaces = {
    activities: activityAdditions.map(item => item.id),
    shops: shopAdditions.map(item => item.id)
  };
})();
