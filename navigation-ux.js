(() => {
  const fieldGuideStyle = document.createElement('link');
  fieldGuideStyle.rel = 'stylesheet';
  fieldGuideStyle.href = 'discover-field-guide.css?v=20260730-2';
  document.head.appendChild(fieldGuideStyle);

  const fieldGuideScript = document.createElement('script');
  fieldGuideScript.src = 'discover-field-guide.js?v=20260730-2';
  fieldGuideScript.defer = true;
  document.body.appendChild(fieldGuideScript);

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