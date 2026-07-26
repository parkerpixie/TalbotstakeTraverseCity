(() => {
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
