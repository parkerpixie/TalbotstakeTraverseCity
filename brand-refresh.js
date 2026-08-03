(() => {
  const ASSETS = {
    mascot: 'tttc-mascot-lockup-full-color-transparent-2400x1400.png',
    icon: 'tttc-icon-only-t3c-otter-transparent-1600x1600.png',
    appIcon: 'tttc-app-icon-display-rounded-1024x1024.png',
    favicon: 'tttc-favicon.ico',
    favicon32: 'tttc-favicon-transparent-32x32.png',
    favicon16: 'tttc-favicon-transparent-16x16.png',
    appleTouch: 'tttc-apple-touch-icon-180x180.png'
  };

  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const croppedArtwork = ({ src, width, height, viewBox, className, label = '' }) => `
    <svg class="${className}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet"
      ${label ? `role="img" aria-label="${escapeHtml(label)}"` : 'aria-hidden="true"'}>
      <image href="${src}" width="${width}" height="${height}" preserveAspectRatio="none"></image>
    </svg>`;

  const otterScene = className => croppedArtwork({
    src: ASSETS.mascot,
    width: 2400,
    height: 1400,
    viewBox: '70 225 1030 1015',
    className,
    label: "Illustrated otter beside West Bay, cherries, reeds, a sailboat, and a red waterfront building"
  });

  const t3cMark = (className, label = '') => croppedArtwork({
    src: ASSETS.icon,
    width: 1600,
    height: 1600,
    viewBox: '590 480 625 650',
    className,
    label
  });

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

  const installHeadBranding = () => {
    document.title = "Talbot's Take Traverse City";
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f7f5f0');
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      "Talbot's Take Traverse City, a CapyQueue Company family field guide for Traverse City and Sleeping Bear Dunes."
    );
    document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute('content', "Talbot's Take TC");
    document.querySelectorAll('link[href="app-icon.svg"]').forEach(link => link.remove());
    ensureLink('icon', ASSETS.favicon, null, 'image/x-icon');
    ensureLink('icon', ASSETS.favicon32, '32x32', 'image/png');
    ensureLink('icon', ASSETS.favicon16, '16x16', 'image/png');
    ensureLink('apple-touch-icon', ASSETS.appleTouch, '180x180', 'image/png');
  };

  const installRescueStyles = () => {
    if (document.getElementById('tttc-clean-brand-styles')) return;
    const style = document.createElement('style');
    style.id = 'tttc-clean-brand-styles';
    style.textContent = `
      :root {
        --tttc-ink: #0b080d;
        --tttc-charcoal: #1a1b1e;
        --tttc-slate: #3a3d44;
        --tttc-ivory: #f7f5f0;
        --tttc-pearl: #e6e4e0;
        --tttc-taupe: #dcd6cc;
        --tttc-cherry: #b80e1a;
        --tttc-oxblood: #43060d;
      }

      html, body { background: var(--tttc-ivory) !important; color: var(--tttc-charcoal) !important; }

      .explorer-welcome-card,
      .explorer-gate-card {
        background: rgba(247,245,240,.985) !important;
        color: var(--tttc-charcoal) !important;
        border: 1px solid rgba(11,8,13,.13) !important;
        box-shadow: 0 30px 90px rgba(11,8,13,.28) !important;
      }

      .explorer-welcome-card::after,
      .explorer-gate-card::after,
      .tab-panel::before,
      .house-intro::before,
      .quick-card::after,
      .place-card::after,
      .gallery-section::after,
      .idea-tray::after,
      .day-board::after,
      .dashboard-hero::before {
        background-image: none !important;
      }

      .explorer-welcome-card .explorer-gate-mark {
        width: min(1040px, 100%) !important;
        height: auto !important;
        margin: 0 auto 8px !important;
        background: none !important;
      }

      .tttc-hero-lockup {
        display: grid;
        grid-template-columns: minmax(290px, .92fr) minmax(360px, 1.08fr);
        align-items: center;
        gap: clamp(18px, 4vw, 52px);
        width: 100%;
        padding: 4px clamp(2px, 2vw, 18px) 8px;
        text-align: left;
      }

      .tttc-hero-art {
        width: 100%;
        max-height: 430px;
        overflow: visible;
        filter: drop-shadow(0 18px 28px rgba(11,8,13,.13));
      }

      .tttc-hero-copy { min-width: 0; text-align: center; }
      .tttc-hero-kicker {
        margin: 0 0 8px;
        color: var(--tttc-ink);
        font-size: clamp(.72rem, 1.3vw, .96rem);
        font-weight: 800;
        letter-spacing: .28em;
        text-transform: uppercase;
      }
      .tttc-hero-title {
        margin: 0;
        color: var(--tttc-ink);
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(3.4rem, 7.2vw, 7.6rem);
        font-weight: 600;
        line-height: .78;
        letter-spacing: -.055em;
        text-transform: uppercase;
      }
      .tttc-hero-title span { display: block; }
      .tttc-hero-city-row {
        display: grid;
        grid-template-columns: minmax(42px,1fr) auto minmax(42px,1fr);
        align-items: center;
        gap: 14px;
        margin-top: 9px;
      }
      .tttc-hero-city-row::before,
      .tttc-hero-city-row::after {
        content: '';
        height: 2px;
        background: var(--tttc-cherry);
      }
      .tttc-cherries {
        position: relative;
        width: 52px;
        height: 34px;
        margin: 0 auto;
      }
      .tttc-cherries::before,
      .tttc-cherries::after {
        content: '';
        position: absolute;
        bottom: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle at 32% 28%, #ff5b63 0 10%, #c71322 35%, #7f0610 100%);
        box-shadow: inset -2px -3px 4px rgba(67,6,13,.28);
      }
      .tttc-cherries::before { left: 7px; }
      .tttc-cherries::after { right: 7px; }
      .tttc-cherry-stem {
        position: absolute;
        left: 24px;
        top: 0;
        width: 2px;
        height: 19px;
        background: #3a3d44;
        transform: rotate(-28deg);
        transform-origin: bottom;
      }
      .tttc-cherry-stem::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 19px;
        height: 2px;
        background: #3a3d44;
        transform: rotate(58deg);
        transform-origin: left;
      }
      .tttc-hero-tagline {
        margin: 12px 0 0;
        color: var(--tttc-cherry);
        font-size: clamp(.73rem, 1.25vw, 1rem);
        font-weight: 900;
        letter-spacing: .105em;
        line-height: 1.45;
        text-transform: uppercase;
      }
      .tttc-company-line {
        margin: 10px 0 0;
        color: var(--tttc-slate);
        font-size: clamp(.62rem, 1vw, .78rem);
        font-weight: 800;
        letter-spacing: .22em;
        text-transform: uppercase;
      }

      .brand-accessible-heading {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0,0,0,0) !important;
        white-space: nowrap !important;
      }

      .app-header .mini-brand {
        min-width: 0 !important;
        margin-right: auto !important;
        padding: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 11px !important;
        color: var(--tttc-ink) !important;
      }
      .tttc-header-mark {
        width: 60px;
        height: 60px;
        flex: 0 0 auto;
        overflow: visible;
      }
      .tttc-header-wordmark {
        display: grid;
        gap: 1px;
        text-align: left;
      }
      .tttc-header-wordmark small {
        color: var(--tttc-slate);
        font-size: .58rem;
        font-weight: 900;
        letter-spacing: .2em;
        text-transform: uppercase;
      }
      .tttc-header-wordmark strong {
        color: var(--tttc-ink);
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(1.02rem, 2vw, 1.55rem);
        font-weight: 700;
        line-height: .95;
      }

      .explorer-gate-card .explorer-gate-mark {
        width: 156px !important;
        height: 156px !important;
        background: none !important;
      }
      .tttc-switcher-mark,
      .tttc-dialog-mark {
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      .explorer-divider,
      .brand-section-swoosh {
        background: none !important;
      }
      .explorer-divider::before,
      .brand-section-swoosh::before {
        content: '';
        display: block;
        width: 100%;
        height: 18px;
        background:
          radial-gradient(ellipse at 50% 0, transparent 62%, rgba(11,8,13,.78) 64% 66%, transparent 68%) center/100% 22px no-repeat,
          linear-gradient(90deg, transparent, var(--tttc-cherry) 28% 72%, transparent) center bottom/45% 2px no-repeat;
        opacity: .85;
      }

      .tttc-brand-watermark {
        position: absolute;
        right: 20px;
        bottom: 12px;
        width: clamp(120px, 18vw, 240px);
        height: clamp(120px, 18vw, 240px);
        opacity: .1;
        pointer-events: none;
        z-index: 1;
      }

      .tttc-card-mark {
        position: absolute;
        right: -13px;
        bottom: -15px;
        width: 105px;
        height: 105px;
        opacity: .035;
        pointer-events: none;
        z-index: 0;
      }

      .brand-footer {
        background: var(--tttc-ink) !important;
        color: #fff !important;
        grid-template-columns: minmax(210px, 1fr) minmax(220px, 1fr) auto !important;
      }
      .tttc-footer-brand {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .tttc-footer-mark { width: 90px; height: 90px; flex: 0 0 auto; }
      .tttc-footer-title { display: grid; gap: 2px; }
      .tttc-footer-title small {
        color: var(--tttc-pearl);
        font-size: .58rem;
        font-weight: 800;
        letter-spacing: .2em;
        text-transform: uppercase;
      }
      .tttc-footer-title strong {
        color: #fff;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(1.25rem, 2vw, 1.8rem);
        line-height: .95;
      }

      @media (max-width: 820px) {
        .tttc-hero-lockup { grid-template-columns: 1fr; gap: 4px; }
        .tttc-hero-art { max-height: 300px; }
        .tttc-hero-title { font-size: clamp(3rem, 13vw, 5.4rem); }
        .tttc-header-wordmark small { display: none; }
        .tttc-header-mark { width: 48px; height: 48px; }
        .brand-footer { grid-template-columns: 1fr !important; text-align: center; }
        .tttc-footer-brand { justify-content: center; }
      }

      @media (max-width: 560px) {
        .explorer-welcome-card { padding: 18px 14px !important; }
        .tttc-hero-art { max-height: 245px; }
        .tttc-hero-kicker { letter-spacing: .18em; }
        .tttc-hero-title { font-size: clamp(2.65rem, 15vw, 4.35rem); }
        .tttc-hero-tagline { letter-spacing: .07em; }
        .tttc-header-wordmark strong { font-size: .9rem; }
        .tttc-header-mark { width: 42px; height: 42px; }
      }
    `;
    document.head.appendChild(style);
  };

  const applyOpeningBrand = () => {
    document.querySelectorAll('.explorer-welcome-card').forEach(card => {
      const mark = card.querySelector('.explorer-gate-mark');
      if (mark && mark.dataset.cleanBrand !== 'true') {
        mark.innerHTML = `
          <div class="tttc-hero-lockup">
            ${otterScene('tttc-hero-art')}
            <div class="tttc-hero-copy">
              <p class="tttc-hero-kicker">Talbot's Take</p>
              <h1 class="tttc-hero-title"><span>Traverse</span><span>City</span></h1>
              <div class="tttc-hero-city-row" aria-hidden="true">
                <span></span><span class="tttc-cherries"><i class="tttc-cherry-stem"></i></span><span></span>
              </div>
              <p class="tttc-hero-tagline">Otterly curious.<br>Endlessly exploring.</p>
              <p class="tttc-company-line">A CapyQueue Company</p>
            </div>
          </div>`;
        mark.dataset.cleanBrand = 'true';
      }

      card.querySelectorAll('h1').forEach(heading => {
        if (heading.closest('.tttc-hero-lockup')) return;
        heading.textContent = "Talbot's Take Traverse City";
        heading.classList.add('brand-accessible-heading');
      });
      card.querySelectorAll('.capyqueue-company').forEach(node => node.remove());
    });
  };

  const applyHeaderBrand = () => {
    document.querySelectorAll('.mini-brand').forEach(button => {
      if (button.dataset.cleanBrand === 'true') return;
      button.innerHTML = `
        ${t3cMark('tttc-header-mark')}
        <span class="tttc-header-wordmark">
          <small>Talbot's Take</small>
          <strong>Traverse City</strong>
        </span>`;
      button.dataset.cleanBrand = 'true';
      button.setAttribute('aria-label', "Talbot's Take Traverse City home");
    });
  };

  const applySwitcherBrand = () => {
    document.querySelectorAll('.explorer-gate-card .explorer-gate-mark').forEach(mark => {
      if (mark.dataset.cleanBrand === 'true') return;
      mark.innerHTML = t3cMark('tttc-switcher-mark', "Talbot's Take Traverse City");
      mark.dataset.cleanBrand = 'true';
    });

    const dialog = document.getElementById('travelerDialog');
    if (dialog) {
      dialog.querySelectorAll('.traveler-dialog-brand').forEach(node => node.remove());
      if (!dialog.querySelector('.tttc-dialog-mark')) {
        dialog.insertAdjacentHTML('afterbegin', t3cMark('tttc-dialog-mark', "Talbot's Take Traverse City"));
      }
    }
  };

  const applyDecorativeBrand = () => {
    document.querySelectorAll('.dashboard-hero').forEach(hero => {
      if (!hero.querySelector('.tttc-brand-watermark')) {
        hero.insertAdjacentHTML('beforeend', t3cMark('tttc-brand-watermark'));
      }
    });

    document.querySelectorAll('.quick-card, .place-card, .gallery-section').forEach(card => {
      if (card.querySelector('.tttc-card-mark')) return;
      card.insertAdjacentHTML('beforeend', t3cMark('tttc-card-mark'));
    });
  };

  const applyFooterBrand = () => {
    document.querySelectorAll('.brand-footer').forEach(footer => {
      if (footer.dataset.cleanBrand === 'true') return;
      const installButton = footer.querySelector('[data-open-install-guide]')?.outerHTML ||
        '<button type="button" class="brand-install-link" data-open-install-guide>Save this app on Android</button>';
      footer.innerHTML = `
        <div class="tttc-footer-brand">
          ${t3cMark('tttc-footer-mark')}
          <span class="tttc-footer-title">
            <small>Talbot's Take</small>
            <strong>Traverse City</strong>
          </span>
        </div>
        <div class="brand-footer-copy">
          <strong>Otterly curious. Endlessly exploring.</strong>
          <span>A CapyQueue Company</span>
        </div>
        ${installButton}`;
      footer.dataset.cleanBrand = 'true';
    });
  };

  const applyAll = () => {
    installHeadBranding();
    installRescueStyles();
    applyOpeningBrand();
    applyHeaderBrand();
    applySwitcherBrand();
    applyDecorativeBrand();
    applyFooterBrand();
  };

  applyAll();
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      applyAll();
    });
  }).observe(document.body, { childList: true, subtree: true });
})();
