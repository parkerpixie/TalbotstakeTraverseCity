// Correct house photo categorization after the main app data loads.
const exteriorGallery = houseGalleryData.find(g => g.id === 'exterior');
const kitchenGallery = houseGalleryData.find(g => g.id === 'kitchen-living');
const bedroomGallery = houseGalleryData.find(g => g.id === 'bedrooms');
const patioGallery = houseGalleryData.find(g => g.id === 'patio-hot-tub');

const removeFrom = (gallery, filenames) => {
  gallery.images = gallery.images.filter(image => !filenames.includes(image));
};

const addUnique = (gallery, filenames) => {
  filenames.forEach(filename => {
    if (!gallery.images.includes(filename)) gallery.images.push(filename);
  });
};

// Keep bedroom photographs out of the exterior gallery.
removeFrom(exteriorGallery, ['IMG_9768.jpeg', 'IMG_9770.jpeg', 'IMG_9798.jpeg']);
addUnique(bedroomGallery, ['IMG_9770.jpeg']);

// Keep porch, dock-walkway, patio and hot-tub images together in outdoor living.
removeFrom(kitchenGallery, ['IMG_9768.jpeg', 'IMG_9798.jpeg']);
removeFrom(exteriorGallery, ['IMG_9795.jpeg', 'IMG_9796.jpeg']);
addUnique(patioGallery, ['IMG_9768.jpeg', 'IMG_9798.jpeg', 'IMG_9795.jpeg', 'IMG_9796.jpeg']);

renderHouseGalleries();