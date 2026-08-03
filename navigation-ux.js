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
  loadStyle('choose-explorer.css?v=20260730-2');
  loadStyle('your-adventure.css?v=20260730-6');
  loadStyle('places-hub.css?v=20260730-2');
  loadStyle('favorite-attribution.css?v=20260730-3');
  loadStyle('heart-rating-dashboard.css?v=20260730-1');
  loadStyle('adventure-rating-clarity.css?v=20260730-1');
  loadStyle('desktop-rating-fix.css?v=20260731-1');
  loadStyle('brand-refresh.css?v=20260802-5');
  loadStyle('install-guide.css?v=20260802-1');

  loadScript('discover-field-guide.js?v=20260730-2');
  loadScript('choose-explorer.js?v=20260730-2');
  loadScript('missing-places-restoration.js?v=20260731-1');
  loadScript('your-adventure.js?v=20260730-6');
  loadScript('places-hub.js?v=20260730-2');
  loadScript('adventure-rating-clarity.js?v=20260730-1');
  loadScript('desktop-rating-fix.js?v=20260731-2');
  loadScript('brand-refresh.js?v=20260802-5');
  loadScript('install-guide.js?v=20260802-1');

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