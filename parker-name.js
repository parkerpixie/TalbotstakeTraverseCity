// Keep Parker's family-facing name consistent throughout the trip app.
const jenTraveler = travelers.find((traveler) => traveler.name === 'Jen');
if (jenTraveler) jenTraveler.name = 'Parker';

restaurants.forEach((restaurant) => {
  if (Array.isArray(restaurant.fit)) {
    restaurant.fit = restaurant.fit.map((name) => name === 'Jen' ? 'Parker' : name);
  }
});

shops.forEach((shop) => {
  if (Array.isArray(shop.fit)) {
    shop.fit = shop.fit.map((name) => name === 'Jen' ? 'Parker' : name);
  }
});

const foldedLeafIndex = shops.findIndex((shop) => shop.id === 'folded-leaf');
if (foldedLeafIndex !== -1) shops.splice(foldedLeafIndex, 1);

const requestedArtShops = [
  {
    id: 'tinker-studio',
    name: 'Tinker Studio',
    town: 'Traverse City',
    type: 'art',
    icon: '🎨',
    url: 'https://www.tinkerstudiotc.com/',
    fit: ['Parker', 'Nancy', 'Porter'],
    summary: 'An Old Mission Peninsula studio and gallery representing more than 50 local artists, with pottery, jewelry, felt flowers, greeting cards, fine art, functional art, and creative classes.'
  },
  {
    id: 'my-secret-stash',
    name: 'My Secret Stash',
    town: 'Traverse City',
    type: 'art',
    icon: '🪩',
    url: 'https://www.mysecretstash.com/',
    fit: ['Parker', 'Nancy', 'Porter'],
    summary: 'A downtown bohemian boutique showcasing Michigan makers, local art, handcrafted leather goods, apparel, bath and body items, and delightfully uncommon gifts.'
  },
  {
    id: 'laughing-fish-gallery',
    name: 'Laughing Fish Gallery',
    town: 'Traverse City',
    type: 'art',
    icon: '🐟',
    url: 'https://www.laughingfishmi.com/',
    fit: ['Parker', 'Porter', 'Nancy'],
    summary: 'A whimsical mother-and-daughter gallery at the Grand Traverse Commons featuring hand-carved wooden fish, colorful northern-Michigan art, and an Art Café where visitors can paint their own project.'
  },
  {
    id: 'sanctuary-goods',
    name: 'Sanctuary Goods',
    town: 'Traverse City',
    type: 'art',
    icon: '🌿',
    url: 'https://www.traversecity.com/listings/sanctuary-goods/1815/',
    fit: ['Parker', 'Nancy'],
    summary: 'An eclectic shop inside the historic Grand Traverse Commons with nature- and science-inspired jewelry, regional fine art, handcrafted goods, and unusual home accents.'
  }
];

requestedArtShops.forEach((shop) => {
  if (!shops.some((existing) => existing.id === shop.id)) shops.push(shop);
});

if (selectedTraveler === 'Jen') {
  selectedTraveler = 'Parker';
  localStorage.setItem('tcTraveler', 'Parker');
}

renderTravelers();
renderRestaurants();
renderShops();
