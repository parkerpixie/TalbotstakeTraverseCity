(() => {
  const TAGS_BY_ID = {
    'house-water': ['outdoor', 'low-energy'],
    'clinch-park': ['outdoor', 'low-energy'],
    'commons-trails': ['outdoor'],
    'old-mission-drive': ['outdoor', 'low-energy'],
    'mission-point': ['outdoor', 'low-energy', 'unique-offbeat'],
    'suttons-bay-walk': ['outdoor', 'low-energy'],
    'fishtown-walk': ['outdoor', 'low-energy', 'unique-offbeat'],
    'empire-bluff': ['outdoor'],
    'pyramid-point': ['outdoor'],
    'dune-climb': ['outdoor', 'unique-offbeat'],
    'pierce-stocking': ['outdoor', 'low-energy'],
    'rainy-commons': ['indoor', 'rainy-day', 'low-energy', 'unique-offbeat'],
    'commons-botanic': ['outdoor', 'low-energy'],
    'commons-tunnel-tour': ['indoor', 'rainy-day', 'interactive', 'unique-offbeat'],
    'commons-arboretum': ['outdoor', 'low-energy'],
    'music-house': ['indoor', 'rainy-day', 'interactive', 'unique-offbeat'],
    'glen-haven-beach': ['outdoor', 'low-energy'],
    'brys-secret-garden': ['outdoor', 'low-energy'],
    'raven-hill-discovery': ['indoor', 'outdoor', 'rainy-day', 'interactive', 'animals-nature', 'science-discovery', 'low-energy', 'unique-offbeat'],
    'boardman-river-nature-center': ['indoor', 'outdoor', 'rainy-day', 'interactive', 'animals-nature', 'science-discovery', 'low-energy']
  };

  let imageWrapperInstalled = false;

  const mergeTags = (place, extraTags) => {
    if (!place || !extraTags?.length) return;
    place.tags = [...new Set([...(place.tags || []), ...extraTags])];
  };

  function applyPhaseATags() {
    if (typeof activities !== 'undefined' && Array.isArray(activities)) {
      activities.forEach(place => mergeTags(place, TAGS_BY_ID[place.id]));
    }
    if (typeof allPlaces !== 'undefined' && Array.isArray(allPlaces)) {
      allPlaces.forEach(place => mergeTags(place, TAGS_BY_ID[place.id]));
    }
  }

  const assetPath = filename => `Assets/${String(filename).split('/').map(encodeURIComponent).join('/')}`;

  function installExplicitImageRenderer() {
    if (imageWrapperInstalled || typeof placeCard !== 'function') return;
    if (!document.querySelector('[data-panel="places"]')) return;

    const originalPlaceCard = placeCard;
    placeCard = function phaseAPlaceCard(place) {
      const markup = originalPlaceCard(place);
      if (!place?.image) return markup;
      const src = assetPath(place.image);
      return markup.replace(
        /(<div class="place-card-media">\s*<img src=")[^"]*(")/,
        `$1${src}$2`
      );
    };
    imageWrapperInstalled = true;
    if (typeof renderActivities === 'function') renderActivities();
  }

  function refresh() {
    applyPhaseATags();
    installExplicitImageRenderer();
    if (typeof renderActivities === 'function') renderActivities();
  }

  applyPhaseATags();
  if (typeof renderActivities === 'function') renderActivities();

  document.addEventListener('tc-places-ready', () => window.setTimeout(refresh, 30));
  window.setTimeout(refresh, 350);
})();
