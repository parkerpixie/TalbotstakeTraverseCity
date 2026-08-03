(() => {
  const OPENING_ART = 'tttc-mani-west-bay-scene-transparent-1536x1024.png';

  const buildOpeningHero = () => {
    const card = document.querySelector('.explorer-welcome-card');
    const mark = card?.querySelector('.explorer-gate-mark');
    if (!card || !mark || mark.dataset.openingSplit === 'true') return;

    mark.innerHTML = `
      <section class="tttc-opening-split" aria-label="Talbot's Take Traverse City">
        <div class="tttc-opening-copy-block">
          <p class="tttc-opening-overline">Talbot's Take</p>
          <h1 class="tttc-opening-title"><span>Traverse</span><span>City</span></h1>
          <div class="tttc-opening-rule" aria-hidden="true">
            <span></span><span class="tttc-opening-cherries">🍒</span><span></span>
          </div>
          <p class="tttc-opening-tagline">Otterly curious.<br>Endlessly exploring.</p>
          <p class="tttc-opening-company">A CapyQueue Company</p>
        </div>
        <div class="tttc-opening-art-wrap" aria-hidden="true">
          <img class="tttc-opening-art" src="${OPENING_ART}" alt="">
        </div>
      </section>`;

    mark.dataset.openingSplit = 'true';
  };

  buildOpeningHero();

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      buildOpeningHero();
    });
  }).observe(document.body, { childList: true, subtree: true });
})();
