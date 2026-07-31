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
    script.defer = true;
    document.body.appendChild(script);
  };

  loadStyle('discover-field-guide.css?v=20260730-2');
  loadStyle('choose-explorer.css?v=20260730-2');
  loadStyle('your-adventure.css?v=20260730-3');
  loadScript('discover-field-guide.js?v=20260730-2');
  loadScript('choose-explorer.js?v=20260730-2');
  loadScript('your-adventure.js?v=20260730-3');

  const appShell = document.getElementById('appShell');
  const appHeader = document.querySelector('.app-header');
  const nav = document.querySelector('.bottom-nav');
  const enterButton = document.getElementById('enterApp');

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
