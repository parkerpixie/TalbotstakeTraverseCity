(() => {
  const ASSETS = {
    horizontalLight: '10-tttc-logo-horizontal-light-background-2400x800.png',
    iconQ: '02-tttc-icon-only-q-transparent-1600x1600.png',
    favicon: '03-tttc-favicon-master-q-transparent-256x256.png',
    monogram: '05-tttc-monogram-t3c-transparent-1200x1200.png',
    badge: '06-tttc-badge-circular-transparent-1600x1600.png',
    appIcon: '07-tttc-app-icon-full-bleed-1024x1024.png',
    socialAvatar: '08-tttc-social-avatar-q-transparent-1200x1200.png',
    mascotScene: '11-tttc-mascot-scene-transparent-2400x1400.png',
    maniMichigan: 'tttc-mani-michigan-guide-transparent-1536x1024.png',
    maniWestBay: 'tttc-mani-west-bay-scene-transparent-1536x1024.png'
  };

  const image = (src, className, alt) => {
    const img = document.createElement('img');
    img.src = src;
    img.className = className;
    img.alt = alt || '';
    if (!alt) img.setAttribute('aria-hidden', 'true');
    img.decoding = 'async';
    return img;
  };

  const updateHead = () => {
    document.title = "Talbot's Take Traverse City";
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f7f5f0');
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      "Talbot's Take Traverse City, a CapyQueue Company family field guide for Traverse City and Sleeping Bear Dunes."
    );
    document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute('content', "Talbot's Take TC");

    document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(link => link.remove());
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    favicon.href = ASSETS.favicon;
    document.head.appendChild(favicon);

    const apple = document.createElement('link');
    apple.rel = 'apple-touch-icon';
    apple.href = ASSETS.appIcon;
    document.head.appendChild(apple);
  };

  const buildOpening = () => {
    const card = document.querySelector('.explorer-welcome-card');
    if (!card || card.dataset.finalBrand === 'true') return;

    const mark = card.querySelector('.explorer-gate-mark');
    if (mark) {
      mark.replaceChildren(
        image(
          ASSETS.horizontalLight,
          'tttc-opening-logo',
          "Talbot's Take Traverse City. Otterly curious. Endlessly exploring."
        )
      );
    }

    const existingIntro = card.querySelector('.mani-intro');
    if (existingIntro) {
      const wrap = document.createElement('section');
      wrap.className = 'tttc-mani-welcome';
      wrap.appendChild(
        image(
          ASSETS.mascotScene,
          'tttc-mani-welcome-art',
          'Mani the otter beside Traverse City waterfront scenery'
        )
      );

      const copy = document.createElement('div');
      copy.className = 'tttc-mani-welcome-copy';
      copy.innerHTML = `
        <p class="explorer-kicker">Meet Captain Manitou, Mani for short</p>
        <p><strong>Hi, I’m Mani.</strong> I’m your otter guide for comparing places, sharing five-heart rankings, and turning five different opinions into one excellent northern Michigan adventure.</p>`;
      wrap.appendChild(copy);
      existingIntro.replaceWith(wrap);
    }

    card.dataset.finalBrand = 'true';
  };

  const buildHeader = () => {
    const button = document.querySelector('.app-header .mini-brand');
    if (!button || button.dataset.finalBrand === 'true') return;

    button.replaceChildren();
    button.appendChild(image(ASSETS.iconQ, 'tttc-header-icon', 'Mani the otter logo'));

    const copy = document.createElement('span');
    copy.className = 'tttc-header-copy';
    copy.innerHTML = `<small>Talbot's Take</small><strong>Traverse City</strong>`;
    button.appendChild(copy);
    button.setAttribute('aria-label', "Talbot's Take Traverse City home");
    button.dataset.finalBrand = 'true';
  };

  const buildSwitcher = () => {
    document.querySelectorAll('.explorer-gate-card .explorer-gate-mark').forEach(mark => {
      if (mark.dataset.finalBrand === 'true') return;
      mark.replaceChildren(image(ASSETS.socialAvatar, 'tttc-switcher-avatar', 'Mani the otter'));
      mark.dataset.finalBrand = 'true';
    });
  };

  const buildHomeFeature = () => {
    const panel = document.querySelector('[data-panel="home"]');
    if (!panel || panel.querySelector('.tttc-home-mani')) return;

    const feature = document.createElement('section');
    feature.className = 'tttc-home-mani';
    feature.innerHTML = `
      <img src="${ASSETS.maniWestBay}" alt="Mani the otter at West Bay with a sailboat, reeds, cherries, and a red waterfront building">
      <div>
        <p class="eyebrow dark">Mani’s Traverse City compass</p>
        <h3>Start with the place, then build the day.</h3>
        <p>Mani is here to keep the bays, dunes, towns, food stops, and family rankings from turning into one giant northern-Michigan tab explosion.</p>
      </div>`;

    const quickGrid = panel.querySelector('.quick-grid');
    if (quickGrid) quickGrid.before(feature);
    else panel.appendChild(feature);
  };

  const buildFieldGuide = () => {
    const page = document.querySelector('.field-guide-page');
    if (!page) return;

    const hero = page.querySelector('.field-guide-hero');
    if (hero && hero.dataset.finalBrand !== 'true') {
      const heroImage = hero.querySelector('img');
      if (heroImage) {
        heroImage.src = ASSETS.maniWestBay;
        heroImage.alt = 'Mani the otter introducing the Traverse City waterfront and West Bay';
      }
      const kicker = hero.querySelector('.field-guide-kicker');
      if (kicker) kicker.textContent = 'Northern Michigan Field Guide';
      hero.dataset.finalBrand = 'true';
    }

    if (!page.querySelector('.tttc-michigan-intro')) {
      const intro = document.createElement('section');
      intro.className = 'tttc-michigan-intro';
      intro.innerHTML = `
        <img src="${ASSETS.maniMichigan}" alt="Mani the otter gesturing toward a map of Michigan and the Great Lakes">
        <div>
          <p class="eyebrow">Mani explains Michigan</p>
          <h3>Two peninsulas, enormous freshwater, and a landscape built by ice.</h3>
          <p>Mani’s job in this guide is to translate the geography behind the adventure: why the bays look the way they do, how glaciers built the land, why cherries thrive here, and why Sleeping Bear’s dunes are still moving.</p>
        </div>`;
      hero?.insertAdjacentElement('afterend', intro);
    }
  };

  const addSubtleMarks = () => {
    ['.dashboard-hero', '.day-board', '.house-intro'].forEach(selector => {
      document.querySelectorAll(selector).forEach(container => {
        if (container.querySelector('.tttc-corner-monogram')) return;
        container.appendChild(image(ASSETS.monogram, 'tttc-corner-monogram', ''));
      });
    });
  };

  const buildFooter = () => {
    const shell = document.getElementById('appShell');
    if (!shell || shell.querySelector('.tttc-final-footer')) return;

    shell.querySelectorAll('.brand-footer').forEach(footer => footer.remove());

    const footer = document.createElement('footer');
    footer.className = 'tttc-final-footer';
    footer.innerHTML = `
      <img src="${ASSETS.badge}" alt="Talbot's Take Traverse City circular otter badge">
      <div>
        <strong>Talbot’s Take Traverse City</strong>
        <span>Otterly curious. Endlessly exploring. · A CapyQueue Company</span>
      </div>
      <button type="button" class="tttc-install-link" data-open-install-guide>Save this app on Android</button>`;
    shell.appendChild(footer);
  };

  const updateInstallGuide = () => {
    document.querySelectorAll('.install-guide-icon').forEach(img => {
      img.src = ASSETS.appIcon;
      img.alt = "Talbot's Take Traverse City app icon";
    });
  };

  const apply = () => {
    updateHead();
    buildOpening();
    buildHeader();
    buildSwitcher();
    buildHomeFeature();
    buildFieldGuide();
    addSubtleMarks();
    buildFooter();
    updateInstallGuide();
  };

  apply();

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
