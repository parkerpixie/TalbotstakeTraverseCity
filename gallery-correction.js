// Replace the original listing-photo galleries with the newly labeled house photos.
const galleryById = id => houseGalleryData.find(gallery => gallery.id === id);

const exteriorGallery = galleryById('exterior');
const kitchenGallery = galleryById('kitchen-living');
const bedroomGallery = galleryById('bedrooms');
const bathroomGallery = galleryById('bathrooms');
const gameRoomGallery = galleryById('game-room');
const patioGallery = galleryById('patio-hot-tub');

exteriorGallery.title = 'House, yard and waterfront';
exteriorGallery.description = 'Front and back views of Sunrise Shores Retreat, the porch, shoreline, pier and the walk from the front porch to West Bay.';
exteriorGallery.images = [
  'Front of House.avif',
  'Front of House 2.avif',
  'Front of House - Porch.avif',
  'Back of House 1.webp',
  'Back of House 2.webp',
  'From Front Porch to Lake.avif',
  'Pier 1.webp',
  'Pier 2.avif',
  'Pier 3.avif',
  'Pier 4.avif',
  'Lake off Pier.avif'
];

kitchenGallery.title = 'Kitchen, dining and living spaces';
kitchenGallery.description = 'Multiple views of the kitchen, dining room and the connected living spaces where everyone can gather.';
kitchenGallery.images = [
  'Kitchen.avif',
  'Kitchen - Dinning 1.webp',
  'Kitchen - Dinning 2.avif',
  'Dinning Room.webp',
  'Living Room.avif',
  'Living Room 2.avif',
  'Full Living Area.webp',
  'Full Living Area 2.webp'
];

bedroomGallery.title = 'Three queen bedrooms';
bedroomGallery.description = 'Harbor View, Blue Deco and Wave rooms. The Wave Room photos also include its attached bathroom.';
bedroomGallery.images = [
  'Natutical Room - Front of House.avif',
  'Blue Deco Bedroom - Side of house.avif',
  'Blue Deco Bedroom - Font of House 2.avif',
  'Wave Bedroom - Back of House.avif',
  'Wave bedroom - Attached bathroom.avif'
];

bathroomGallery.title = 'Bathrooms';
bathroomGallery.description = 'Both full bathrooms, plus the attached-bathroom view from the Wave Room.';
bathroomGallery.images = [
  'Full Bathroom 1.avif',
  'Full Bathroom 2.avif',
  'Wave bedroom - Attached bathroom.avif'
];

gameRoomGallery.title = 'Garage game room';
gameRoomGallery.description = 'Two views of the garage game room plus the garage exterior.';
gameRoomGallery.images = [
  'Game Room Garage 1.avif',
  'Game Room Garage 2.avif',
  'Garage Exterior.avif'
];

patioGallery.title = 'Hot tub, fire pit and outdoor hangouts';
patioGallery.description = 'The hot tub, backyard fire pit and porch spaces for winding down after a day around the bay.';
patioGallery.images = [
  'Hot Tub 1.avif',
  'Hot Tub 2.avif',
  'Backyard Fire Pit.avif',
  'Backyard Fire Pit 2.avif',
  'Front of House - Porch.avif'
];

renderHouseGalleries();