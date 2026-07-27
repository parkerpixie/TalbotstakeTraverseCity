(() => {
  const exactHarborImage = 'Assets/Assets/Images/Natutical Room - Front of House.avif';

  const applyExactHarborImage = () => {
    document.querySelectorAll('[data-room-card="bed-three"] .room-main-photo, [data-room-card="bed-three"] .room-photo-thumb img').forEach(img => {
      if (img.getAttribute('src') !== exactHarborImage) img.setAttribute('src', exactHarborImage);
    });
  };

  applyExactHarborImage();

  const roomGrid = document.getElementById('bedClaimGrid');
  if (roomGrid) {
    new MutationObserver(applyExactHarborImage).observe(roomGrid, { childList: true, subtree: true });
  }
})();