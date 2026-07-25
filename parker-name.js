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

if (selectedTraveler === 'Jen') {
  selectedTraveler = 'Parker';
  localStorage.setItem('tcTraveler', 'Parker');
}

renderTravelers();
renderRestaurants();
renderShops();
