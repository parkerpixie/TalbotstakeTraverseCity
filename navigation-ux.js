(() => {
  const loadStyle = (href) => {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = href;
    document.head.appendChild(style);
  };

  const loadScript = (src) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.body.appendChild(script);
  };

  loadStyle('discover-field-guide.css?v=20260730-2');
  loadStyle('choose-explorer.css?v=20260803-3');
  loadStyle('your-adventure.css?v=20260730-6');
  loadStyle('places-hub.css?v=20260730-2');
  loadStyle('favorite-attribution.css?v=20260730-3');
  loadStyle('heart-rating-dashboard.css?v=20260730-1');
  loadStyle('adventure-rating-clarity.css?v=20260730-1');
  loadStyle('desktop-rating-fix.css?v=20260731-1');
  loadStyle('install-guide.css?v=20260803-3');
  loadStyle('completion-polish.css?v=20260803-1');
  loadStyle('brand-final.css?v=20260803-1');
  loadStyle('brand-opening-fix.css?v=20260803-1');
  loadStyle('rating-visibility.css?v=20260803-1');
  loadStyle('compact-rating-grid.css?v=20260803-1');
  loadStyle('mani-guide.css?v=20260813-1');

  loadScript('discover-field-guide.js?v=20260730-2');
  loadScript('choose-explorer.js?v=20260803-3');
  loadScript('missing-places-restoration.js?v=20260731-1');
  loadScript('your-adventure.js?v=20260730-6');
  loadScript('places-hub.js?v=20260730-2');
  loadScript('adventure-rating-clarity.js?v=20260730-1');
  loadScript('desktop-rating-fix.js?v=20260731-2');
  loadScript('install-guide.js?v=20260803-5');
  loadScript('brand-final.js?v=20260803-1');
  loadScript('brand-opening-fix.js?v=20260803-1');
  loadScript('rating-visibility.js?v=20260803-1');
  loadScript('rating-flow-fix.js?v=20260803-2');
  loadScript('mani-guide.js?v=20260813-1');
  loadScript('trip-companion-overhaul.js?v=20260820-1');

  const appShell = document.getElementById('appShell');
  const appHeader = document.querySelector('.app-header');
  const nav = document.querySelector('.bottom-nav');
  const enterButton = document.getElementById('enterApp');

  if (nav) {
    const houseButton = nav.querySelector('[data-tab="house"]');
    const planButton = nav.querySelector('[data-tab="planner"]');
    if (houseButton && planButton) nav.insertBefore(houseButton, planButton);
  }

  if (appHeader && nav) {
    appHeader.insertAdjacentElement('afterend', nav);
  }

  const scrollToActivePanel = () => {
    const activePanel = document.querySelector('.tab-panel.active');
    if (!activePanel || appShell?.hidden) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        activePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  document.querySelectorAll('[data-tab]').forEach(button => {
    button.addEventListener('click', scrollToActivePanel);
  });

  enterButton?.addEventListener('click', () => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();
