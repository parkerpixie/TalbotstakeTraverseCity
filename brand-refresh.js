(() => {
  const assets = {
    horizontal: 'brand/logo-horizontal.svg',
    stacked: 'brand/logo-stacked.svg',
    icon: 'brand/icon-t3c-otter.svg',
    mascot: 'brand/mascot-lockup.svg',
    badge: 'brand/badge.svg',
    wordmark: 'brand/wordmark.svg',
    logoOnDark: 'brand/logo-on-dark.svg',
    logoOnLight: 'brand/logo-on-light.svg',
    watermark: 'brand/watermark.svg',
    appIcon: 'brand/app-icon.svg',
    favicon: 'tttc-favicon.ico',
    favicon32: 'tttc-favicon-transparent-32x32.png',
    favicon16: 'tttc-favicon-transparent-16x16.png',
    appleTouch: 'tttc-apple-touch-icon-180x180.png'
  };

  const image = (src, className, alt = '') =>
    `<img src="${src}" class="${className}" alt="${alt}">`;

  const ensureLink = (rel, href, sizes, type) => {
    let link = document.querySelector(`link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ''}`);
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      if (sizes) link.sizes = sizes;
      document.head.appendChild(link);
    }
    link.href = href;
    if (type) link.type = type;
  };

  const applyHeadBranding = () => {
    document.documentElement.classList.add('tttc-brand-ready');
    document.title = "Talbot's Take Traverse City";

    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.content = '#0b080d';

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.content = "Talbot's Take Traverse City, a CapyQueue Company family trip planner.";
    }

    const appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (appleTitle) appleTitle.content = "Talbot's Take TC";

    document.querySelectorAll('link[href="app-icon.svg"]').forEach(link => link.remove());
    ensureLink('icon', assets.favicon, null, 'image/x-icon');
    ensureLink('icon', assets.favicon32, '32x32', 'image/png');
    ensureLink('icon', assets.favicon16, '16x16', 'image/png');
    ensureLink('apple-touch-icon', assets.appleTouch, '180x180', 'image/png');
  };

  const applyHeaderBrand = () => {
    document.querySelectorAll('.mini-brand').forEach(button => {
      if (button.dataset.tttcBrandVersion === '4') return;
      button.innerHTML = image(assets.logoOnDark, 'mini-brand-logo');
      button.dataset.tttcBrandVersion = '4';
      button.setAttribute('aria-label', "Talbot's Take Traverse City home");
    });
  };

  const applyExplorerBrand = () => {
    document.querySelectorAll('.explorer-gate-mark').forEach(container => {
      const welcome = Boolean(container.closest('.explorer-welcome-card'));
      const version = welcome ? 'welcome-4' : 'switcher-4';
      if (container.dataset.tttcBrandVersion === version) return;
      container.innerHTML = welcome
        ? image(assets.mascot, 'explorer-mascot-lockup', "Talbot's Take Traverse City")
        : image(assets.badge, 'explorer-badge', "Talbot's Take Traverse City badge");
      container.dataset.tttcBrandVersion = version;
    });

    document.querySelectorAll('.explorer-welcome-card h1').forEach(heading => {
      heading.innerHTML = "Talbot's Take Traverse City";
      heading.classList.add('brand-accessible-heading');
    });

    document.querySelectorAll('.explorer-welcome-card .capyqueue-company').forEach(line => line.remove());
  };

  const applySectionBranding = () => {
    document.querySelectorAll('.page-heading, .house-intro').forEach(section => {
      if (section.querySelector(':scope > .brand-section-swoosh')) return;
      const flourish = document.createElement('div');
      flourish.className = 'brand-section-swoosh';
      flourish.setAttribute('aria-hidden', 'true');
      section.appendChild(flourish);
    });

    document.querySelectorAll('.quick-card, .place-card, .idea-tray, .day-board, .gallery-section').forEach(card => {
      card.classList.add('tttc-branded-surface');
    });
  };

  const applyDialogBranding = () => {
    const travelerDialog = document.getElementById('travelerDialog');
    if (travelerDialog && !travelerDialog.querySelector('.traveler-dialog-brand')) {
      travelerDialog.insertAdjacentHTML(
        'afterbegin',
        image(assets.badge, 'traveler-dialog-brand', "Talbot's Take Traverse City badge")
      );
    }
  };

  const applyFooter = () => {
    const appShell = document.getElementById('appShell');
    const main = appShell?.querySelector('main');
    if (!appShell || !main || appShell.querySelector('.brand-footer')) return;

    const footer = document.createElement('footer');
    footer.className = 'brand-footer';
    footer.innerHTML = `
      <div class="brand-footer-art">
        ${image(assets.horizontal, 'brand-footer-logo', "Talbot's Take Traverse City")}
      </div>
      <div class="brand-footer-copy">
        <strong>Otterly curious. Endlessly exploring.</strong>
        <span>A CapyQueue Company</span>
      </div>
      <button type="button" class="brand-install-link" data-open-install-guide>
        Save this app on Android
      </button>`;
    main.insertAdjacentElement('afterend', footer);
  };

  const applyBranding = () => {
    applyHeaderBrand();
    applyExplorerBrand();
    applySectionBranding();
    applyDialogBranding();
    applyFooter();
  };

  applyHeadBranding();
  applyBranding();

  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      applyBranding();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
