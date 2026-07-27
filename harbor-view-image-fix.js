(() => {
  const harborImage = 'Assets/Assets/Images/Nautical%20Room%20-%20Front%20of%20House.avif';

  const applyHarborImage = () => {
    document.querySelectorAll('.bed-claim-card').forEach(card => {
      const title = card.querySelector('.bed-title-row h3')?.textContent?.trim();
      if (title !== 'Harbor View Room') return;

      const main = card.querySelector('.room-main-photo, :scope > img');
      if (main && main.getAttribute('src') !== harborImage) {
        main.src = harborImage;
        main.alt = 'Harbor View Room';
      }

      card.querySelectorAll('.room-photo-thumb img').forEach(image => {
        if (image.getAttribute('src') !== harborImage) image.src = harborImage;
      });
    });
  };

  const observer = new MutationObserver(applyHarborImage);
  const start = () => {
    applyHarborImage();
    const grid = document.getElementById('bedClaimGrid');
    if (grid) observer.observe(grid, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();