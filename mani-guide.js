(() => {
  const ASSETS = {
    guide: 'Assets/Mani-Guide.png',
    thinking: 'Assets/Mani-Thinking.png',
    nearby: 'Assets/Mani-Nearby.png',
    warning: 'Assets/Mani-Warning.png',
    celebrate: 'Assets/Mani-Celebrate.png',
    rainy: 'Assets/Mani-Rainy-Day.png',
    schedule: 'Assets/Mani-Schedule.png'
  };

  const COPY = {
    guide: {
      title: 'Start with one thing that gives the day a shape.',
      body: 'Pick an anchor or a wander zone first. Once that lands, I can help the easier nearby choices fall into place.',
      action: 'Show wander zones',
      actionType: 'wander'
    },
    thinking: {
      title: 'Let’s make one decision, not eighty-eight.',
      body: 'I’m surfacing the strongest unrouted choices without averaging away somebody’s big pick. Choose one, place it, then we’ll keep going.',
      action: 'Open Let’s Decide',
      actionType: 'decide'
    },
    nearby: {
      title: 'You already paid the driving cost to be here.',
      body: 'There are lower-pressure options near this day’s plans. A 2-heart shop can absolutely earn twenty minutes when it is practically next door.',
      action: 'Show nearby options',
      actionType: 'nearby'
    },
    warning: {
      title: 'This day is starting to zigzag.',
      body: 'Nothing is forbidden, but the route is getting windshield-heavy. Check the nearby shelf before adding another long hop.',
      action: 'Find closer options',
      actionType: 'nearby'
    },
    celebrate: {
      title: 'This day is taking shape beautifully.',
      body: 'You have multiple stops that cluster well. Lock the pieces you love and leave a little breathing room for vacation to be vacation.',
      action: 'See family favorites',
      actionType: 'family'
    },
    rainy: {
      title: 'This day leans pretty heavily outdoors.',
      body: 'No need to change it now. I can see indoor or rainy-day-rated possibilities still waiting if the weather decides to rewrite the script.',
      action: 'See rainy-day ideas',
      actionType: 'rainy'
    },
    schedule: {
      title: 'One person has a schedule wrinkle here.',
      body: 'That does not have to block the whole family. Adjust who is attending the overlapping stop, or move it to another part of the day.',
      action: 'Review this day',
      actionType: 'day'
    }
  };

  let lastRenderKey = '';
  let frame = 0;

  const safe = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

  function panel() {
    return document.querySelector('[data-panel="planner"]');
  }

  function activeColumn() {
    return panel()?.querySelector('.plan-day-column.is-active') || null;
  }

  function activeDayId() {
    return activeColumn()?.querySelector('[data-plan-focus-day]')?.dataset.planFocusDay || '';
  }

  function activeDayLabel() {
    const button = activeColumn()?.querySelector('[data-plan-focus-day]');
    const strong = button?.querySelector('strong')?.textContent?.trim();
    return strong || 'this day';
  }

  function placeFor(id) {
    try {
      return typeof allPlaces !== 'undefined' && Array.isArray(allPlaces)
        ? allPlaces.find(place => place.id === id)
        : null;
    } catch {
      return null;
    }
  }

  function scheduledIds() {
    return new Set([...document.querySelectorAll('.plan-stop-card[data-plan-stop]')]
      .map(card => card.dataset.planStop)
      .filter(Boolean));
  }

  function ratingWorthConsidering(place) {
    if (!place) return false;
    const stats = window.TCHeartRatings?.stats?.(place.id);
    if (!stats?.entries?.length) return false;
    return stats.entries.some(entry => Number(entry.rating) >= 2) || Number(stats.average) >= 2;
  }

  function hasRainyBackup() {
    try {
      if (typeof allPlaces === 'undefined' || !Array.isArray(allPlaces)) return false;
      const planned = scheduledIds();
      return allPlaces.some(place => {
        if (!place || place.virtual || planned.has(place.id)) return false;
        const tags = Array.isArray(place.tags) ? place.tags : [];
        return (tags.includes('rainy-day') || tags.includes('indoor')) && ratingWorthConsidering(place);
      });
    } catch {
      return false;
    }
  }

  function outdoorHeavy(column) {
    if (!column) return false;
    const ids = [...column.querySelectorAll('.plan-stop-card[data-plan-stop]')]
      .map(card => card.dataset.planStop)
      .filter(Boolean);
    if (ids.length < 2) return false;
    let outdoor = 0;
    let indoor = 0;
    ids.forEach(id => {
      const place = placeFor(id);
      const tags = Array.isArray(place?.tags) ? place.tags : [];
      if (tags.includes('outdoor')) outdoor += 1;
      if (tags.includes('indoor') || tags.includes('rainy-day')) indoor += 1;
    });
    return outdoor >= 2 && outdoor > indoor;
  }

  function nearbyCount() {
    return panel()?.querySelectorAll('#planShelfList .plan-nearby').length || 0;
  }

  function stateForPlanner() {
    const p = panel();
    const column = activeColumn();
    if (!p || !column) return { state: 'guide', ...COPY.guide };

    const decisionDialog = document.getElementById('plannerDecisionDialog');
    if (decisionDialog?.open) return { state: 'thinking', ...COPY.thinking };

    if (column.querySelector('.plan-conflict')) {
      return { state: 'schedule', ...COPY.schedule };
    }

    const routeBad = column.querySelector('.plan-route-score.bad');
    if (routeBad) {
      const detail = routeBad.querySelector('small')?.textContent?.trim();
      return {
        state: 'warning',
        ...COPY.warning,
        body: detail ? `${COPY.warning.body} ${detail}.` : COPY.warning.body
      };
    }

    const stops = column.querySelectorAll('.plan-stop-card').length;
    const hasWander = !!column.querySelector('.plan-stop-card.is-wander');
    const nearby = nearbyCount();

    if ((hasWander || stops > 0) && nearby > 0) {
      return {
        state: 'nearby',
        ...COPY.nearby,
        body: `${COPY.nearby.body} I can see ${nearby} nearby option${nearby === 1 ? '' : 's'} in the current shelf.`
      };
    }

    const goodRoute = !!column.querySelector('.plan-route-score.good');
    const locked = column.querySelectorAll('.plan-stop-card.is-locked').length;
    if (stops >= 2 && (goodRoute || locked >= 2)) {
      return { state: 'celebrate', ...COPY.celebrate };
    }

    if (outdoorHeavy(column) && hasRainyBackup()) {
      return { state: 'rainy', ...COPY.rainy };
    }

    if (stops === 0) {
      const availability = column.querySelector('.availability-card');
      if (availability) {
        return {
          state: 'schedule',
          ...COPY.schedule,
          title: `${activeDayLabel()} already has a personal availability block.`,
          body: 'That time belongs to one person, not automatically the whole family. You can still build plans for everyone else around it.'
        };
      }
      return { state: 'guide', ...COPY.guide };
    }

    return {
      state: 'thinking',
      ...COPY.thinking,
      title: `${activeDayLabel()} has a start. What deserves the next slot?`,
      body: 'Use hearts for priority and geography for convenience. One person’s 5-heart pick still matters even when the average is quieter.'
    };
  }

  function ensureCard() {
    const p = panel();
    const hero = p?.querySelector('.plan-trip-hero');
    if (!p || !hero) return null;
    let card = p.querySelector('#maniPlannerGuide');
    if (card) return card;

    card = document.createElement('section');
    card.id = 'maniPlannerGuide';
    card.className = 'mani-guide-card';
    card.setAttribute('aria-live', 'polite');
    hero.insertAdjacentElement('afterend', card);
    return card;
  }

  function renderCard() {
    const p = panel();
    if (!p || !p.querySelector('.plan-trip-hero')) return;
    const info = stateForPlanner();
    const key = JSON.stringify({
      state: info.state,
      title: info.title,
      body: info.body,
      action: info.action,
      day: activeDayId(),
      stops: activeColumn()?.querySelectorAll('.plan-stop-card').length || 0,
      conflicts: activeColumn()?.querySelectorAll('.plan-conflict').length || 0,
      nearby: nearbyCount()
    });

    const card = ensureCard();
    if (!card || (key === lastRenderKey && card.dataset.maniState === info.state)) return;
    lastRenderKey = key;
    card.dataset.maniState = info.state;
    card.className = `mani-guide-card mani-state-${info.state}`;
    card.innerHTML = `
      <div class="mani-guide-art" aria-hidden="true">
        <img src="${ASSETS[info.state] || ASSETS.guide}" alt="" />
      </div>
      <div class="mani-guide-copy">
        <p class="mani-guide-kicker">Mani’s field note · ${safe(activeDayLabel())}</p>
        <h3>${safe(info.title)}</h3>
        <p>${safe(info.body)}</p>
        ${info.action ? `<button type="button" class="mani-guide-action" data-mani-action="${safe(info.actionType)}">${safe(info.action)}</button>` : ''}
      </div>`;
  }

  function decorateDecisionDialog() {
    const dialog = document.getElementById('plannerDecisionDialog');
    if (!dialog?.open || dialog.querySelector('.mani-dialog-mascot')) return;
    const close = dialog.querySelector('.planner-dialog-close');
    const wrap = document.createElement('div');
    wrap.className = 'mani-dialog-mascot mani-dialog-thinking';
    wrap.innerHTML = `<img src="${ASSETS.thinking}" alt="Mani thinking about the family’s choices" />`;
    if (close) close.insertAdjacentElement('afterend', wrap);
    else dialog.prepend(wrap);
  }

  function decorateAvailabilityDialog() {
    const dialog = document.getElementById('plannerAvailabilityDialog');
    if (!dialog?.open || dialog.querySelector('.mani-dialog-mascot')) return;
    const close = dialog.querySelector('.planner-dialog-close');
    const wrap = document.createElement('div');
    wrap.className = 'mani-dialog-mascot mani-dialog-schedule';
    wrap.innerHTML = `<img src="${ASSETS.schedule}" alt="Mani holding a schedule" />`;
    if (close) close.insertAdjacentElement('afterend', wrap);
    else dialog.prepend(wrap);
  }

  function run() {
    renderCard();
    decorateDecisionDialog();
    decorateAvailabilityDialog();
  }

  function requestRun() {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = 0;
      run();
    });
  }

  function handleAction(type) {
    if (type === 'decide') {
      document.getElementById('openDecidePreview')?.click();
      return;
    }
    if (type === 'wander' || type === 'nearby' || type === 'family') {
      const shelf = type === 'wander' ? 'wander' : type === 'nearby' ? 'nearby' : 'family';
      panel()?.querySelector(`[data-shelf="${shelf}"]`)?.click();
      return;
    }
    if (type === 'rainy') {
      const explore = document.querySelector('[data-tab="explore"]');
      explore?.click();
      window.setTimeout(() => {
        document.querySelector('#activityChips [data-tag="rainy-day"]')?.click();
      }, 120);
      return;
    }
    if (type === 'day') {
      activeColumn()?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }

  document.addEventListener('click', event => {
    const action = event.target.closest('[data-mani-action]');
    if (action) {
      event.preventDefault();
      handleAction(action.dataset.maniAction);
      requestRun();
      return;
    }

    if (event.target.closest('[data-plan-add],[data-plan-remove],[data-plan-lock],[data-plan-details],[data-add-slot],[data-save-details],[data-save-av],[data-remove-block],[data-shelf],[data-plan-focus-day],#openDecidePreview,#addAvailabilityBlock')) {
      window.setTimeout(requestRun, 40);
    }
  });

  document.addEventListener('tc-ratings-changed', requestRun);
  document.addEventListener('tc-shared-ready', requestRun);

  const start = () => {
    const p = panel();
    if (!p) return false;
    const observer = new MutationObserver(requestRun);
    observer.observe(p, { childList: true, subtree: true, attributes: true, attributeFilter: ['open', 'class'] });
    requestRun();
    return true;
  };

  if (!start()) {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (start() || attempts > 40) window.clearInterval(timer);
    }, 150);
  }

  window.TCManiGuide = {
    refresh: requestRun,
    assets: { ...ASSETS }
  };
})();