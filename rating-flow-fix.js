(() => {
  const RATING_TRIGGER = '[data-save], [data-dashboard-rate], .family-top-rate';
  const renderers = ['renderRestaurants', 'renderShops', 'renderActivities'];
  let originals = {};
  let guardActive = false;
  let savedView = null;
  let committed = false;

  const valueOf = id => document.getElementById(id)?.value ?? '';

  const captureView = () => {
    const activePanel = document.querySelector('.tab-panel.active');
    const placesPanel = document.querySelector('[data-panel="places"]');
    return {
      activePanel: activePanel?.dataset.panel || '',
      activeMode: placesPanel?.dataset.activeMode || localStorage.getItem('tcPlacesMode') || '',
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      fields: {
        restaurantSearch: valueOf('restaurantSearch'),
        restaurantTown: valueOf('restaurantTown'),
        restaurantPrice: valueOf('restaurantPrice'),
        shopSearch: valueOf('shopSearch'),
        shopTown: valueOf('shopTown'),
        shopType: valueOf('shopType'),
        activitySearch: valueOf('activitySearch'),
        activityTown: valueOf('activityTown'),
        activityType: valueOf('activityType')
      },
      restaurantTags: Array.from(document.querySelectorAll('#restaurantChips button.active')).map(button => button.dataset.tag),
      activityTags: Array.from(document.querySelectorAll('#activityChips button.active')).map(button => button.dataset.tag)
    };
  };

  const suppressListRenders = () => {
    if (guardActive) return;
    guardActive = true;
    committed = false;
    savedView = captureView();

    renderers.forEach(name => {
      try {
        const fn = window[name];
        if (typeof fn === 'function') {
          originals[name] = fn;
          window[name] = () => {};
        }
      } catch {}
    });
  };

  const restoreRendererFunctions = () => {
    Object.entries(originals).forEach(([name, fn]) => {
      try { window[name] = fn; } catch {}
    });
    originals = {};
    guardActive = false;
  };

  const restoreField = (id, value) => {
    const node = document.getElementById(id);
    if (node && value !== undefined) node.value = value;
  };

  const restoreView = () => {
    const view = savedView;
    restoreRendererFunctions();
    if (!view) return;

    Object.entries(view.fields).forEach(([id, value]) => restoreField(id, value));

    try {
      if (typeof activeRestaurantTags !== 'undefined') activeRestaurantTags = view.restaurantTags.slice();
      document.querySelectorAll('#restaurantChips button').forEach(button => {
        button.classList.toggle('active', view.restaurantTags.includes(button.dataset.tag));
      });
    } catch {}

    try {
      if (typeof activeActivityTags !== 'undefined') activeActivityTags = view.activityTags.slice();
      document.querySelectorAll('#activityChips button').forEach(button => {
        button.classList.toggle('active', view.activityTags.includes(button.dataset.tag));
      });
    } catch {}

    if (view.activePanel === 'places') {
      window.TCPlaces?.setMode?.(view.activeMode || 'explore');
      try {
        if (view.activeMode === 'eat' && typeof renderRestaurants === 'function') renderRestaurants();
        else if (view.activeMode === 'shop' && typeof renderShops === 'function') renderShops();
        else if (typeof renderActivities === 'function') renderActivities();
      } catch (error) {
        console.warn('The place list will refresh on the next visit:', error?.message);
      }
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ left: view.scrollX, top: view.scrollY, behavior: 'auto' });
      });
    });

    savedView = null;
  };

  const scheduleRestore = delay => {
    window.setTimeout(() => {
      if (guardActive) restoreView();
    }, delay);
  };

  const beginFromEvent = event => {
    const trigger = event.target instanceof Element ? event.target.closest(RATING_TRIGGER) : null;
    if (trigger) suppressListRenders();
  };

  window.addEventListener('pointerdown', beginFromEvent, true);
  window.addEventListener('click', beginFromEvent, true);
  window.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') beginFromEvent(event);
  }, true);

  const wrapApiWhenReady = () => {
    const api = window.TCHeartRatings;
    if (!api?.open || api.__returnFixWrapped) return Boolean(api?.__returnFixWrapped);
    const originalApiOpen = api.open;
    api.open = id => {
      suppressListRenders();
      return originalApiOpen(id);
    };
    api.__returnFixWrapped = true;
    return true;
  };

  if (!wrapApiWhenReady()) {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (wrapApiWhenReady() || attempts > 80) window.clearInterval(timer);
    }, 50);
  }

  document.addEventListener('tc-ratings-changed', () => {
    committed = true;
    const dialog = document.getElementById('heartRatingDialog');
    if (!dialog?.open) scheduleRestore(60);
  });

  document.addEventListener('close', event => {
    if (event.target?.id !== 'heartRatingDialog' || !guardActive) return;
    scheduleRestore(committed ? 60 : 350);
  }, true);
})();