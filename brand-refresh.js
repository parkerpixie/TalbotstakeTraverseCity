(() => {
  const assets = {
    icon: 'tttc-icon-only-t3c-otter-transparent-1600x1600.png',
    mascotLockup: 'tttc-mascot-lockup-full-color-transparent-2400x1400.png',
    favicon: 'tttc-favicon.ico',
    favicon32: 'tttc-favicon-transparent-32x32.png',
    favicon16: 'tttc-favicon-transparent-16x16.png',
    appleTouch: 'tttc-apple-touch-icon-180x180.png'
  };

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

  const mark = className => `<span class="${className}" aria-hidden="true"></span>`;

  const applyVisibleBranding = () => {
    document.querySelectorAll('.mini-brand').forEach(button => {
      if (button.dataset.tttcBrandVersion === '2') return;
      button.innerHTML = `${mark('mini-brand-mark')}<strong>Talbot's Take TC</strong>`;
      button.dataset.tttcBrandVersion = '2';
      button.setAttribute('aria-label', "Talbot's Take Traverse City home");
    });

    document.querySelectorAll('.explorer-gate-mark').forEach(container => {
      const isWelcome = Boolean(container.closest('.explorer-welcome-card'));
      const version = isWelcome ? 'welcome-2' : 'switcher-2';
      if (container.dataset.tttcBrandVersion === version) return;
      container.innerHTML = isWelcome
        ? mark('explorer-mascot-lockup')
        : mark('explorer-icon-mark');
      container.dataset.tttcBrandVersion = version;
    });

    document.querySelectorAll('.explorer-welcome-card h1').forEach(heading => {
      heading.innerHTML = "Talbot's Take<br><em>Traverse City</em>";
      heading.classList.add('brand-accessible-heading');
    });

    document.querySelectorAll('.explorer-welcome-card .capyqueue-company').forEach(line => line.remove());
  };

  applyHeadBranding();
  applyVisibleBranding();

  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      applyVisibleBranding();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
