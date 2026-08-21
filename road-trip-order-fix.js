(() => {
  let observer = null;

  function moveGamesAboveFavorites() {
    const home = document.querySelector('[data-panel="home"]');
    if (!home) return false;
    const games = home.querySelector('.road-game-section');
    const favoritesMap = home.querySelector('.vacay-favorites-map');
    if (!games || !favoritesMap) return false;
    if (games.nextElementSibling === favoritesMap) return true;
    favoritesMap.insertAdjacentElement('beforebegin', games);
    return true;
  }

  function init() {
    const home = document.querySelector('[data-panel="home"]');
    if (!home) {
      window.setTimeout(init, 150);
      return;
    }

    moveGamesAboveFavorites();
    observer = new MutationObserver(() => requestAnimationFrame(moveGamesAboveFavorites));
    observer.observe(home, { childList: true, subtree: true });
    document.addEventListener('tc-trip-companion-ready', () => window.setTimeout(moveGamesAboveFavorites, 150));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => window.setTimeout(init, 1100));
  else window.setTimeout(init, 1100);
})();
