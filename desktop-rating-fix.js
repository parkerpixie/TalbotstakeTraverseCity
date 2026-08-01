(() => {
  const ratingSelector = '[data-save], [data-dashboard-rate], .family-top-rate';

  const placeIdFor = (button) =>
    button.dataset.save ||
    button.dataset.dashboardRate ||
    button.closest('.family-top-card')?.querySelector('[data-place-open]')?.dataset.placeOpen ||
    '';

  const activate = (button, event) => {
    const id = placeIdFor(button);
    if (!id || !window.TCHeartRatings?.open) return;
    event?.preventDefault();
    event?.stopPropagation();
    window.TCHeartRatings.open(id);
  };

  const wire = (root = document) => {
    root.querySelectorAll(ratingSelector).forEach((button) => {
      if (button.dataset.desktopRatingWired === 'yes') return;
      button.dataset.desktopRatingWired = 'yes';
      button.removeAttribute('disabled');
      button.setAttribute('role', 'button');
      if (!button.hasAttribute('tabindex')) button.tabIndex = 0;

      button.addEventListener('pointerdown', (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        activate(button, event);
      });

      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') activate(button, event);
      });
    });
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.matches?.(ratingSelector)) wire(node.parentElement || document);
      else wire(node);
    }));
  });

  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('tc-ratings-changed', () => wire());
  document.addEventListener('tc-shared-ready', () => wire());
  wire();
})();