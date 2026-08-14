(() => {
  const ARRIVAL_RESTAURANTS = [
    { id: 'west-end', minutes: 15 },
    { id: 'slabtown', minutes: 18 },
    { id: 'boones', minutes: 15 },
    { id: 'vi-grill', minutes: 15 }
  ];
  const FAMILY = ['Parker','Blake','Porter','Mark','Nancy'];

  const safe = value => String(value ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;');

  function ratings(place) {
    const stats = window.TCHeartRatings?.stats?.(place.id) || { entries: [], count: 0, average: 0 };
    const vals = stats.entries.map(x => Number(x.rating) || 0);
    const high = vals.filter(x => x >= 4).length;
    const big = stats.entries.find(x => Number(x.rating) === 5);
    return {
      stats,
      high,
      big,
      everybody: stats.count === FAMILY.length && vals.every(x => x >= 4),
      score: (Number(stats.average) || 0) + (big ? 2 : 0) + (high >= 3 ? 1 : 0)
    };
  }

  function ratingLabel(place) {
    const info = ratings(place);
    if (!info.stats.count) return 'Not rated yet';
    if (info.everybody) return `❤️ Everybody loves it · ${info.stats.average.toFixed(1)}`;
    if (info.big) return `⭐ ${info.big.name}'s big pick · ${info.stats.average.toFixed(1)}`;
    if (info.high >= 3) return `💛 Strong majority · ${info.stats.average.toFixed(1)}`;
    return `${info.stats.average.toFixed(1)} hearts · ${info.stats.count} rated`;
  }

  function planned(day, slot) {
    return (plan?.[day]?.[slot] || []).map(id => allPlaces.find(p => p.id === id)).filter(Boolean);
  }

  function isScheduled(id) {
    return Object.values(plan || {}).some(day => Object.values(day || {}).some(slot => Array.isArray(slot) && slot.includes(id)));
  }

  function cluster(place) {
    const t = `${place?.area || ''} ${place?.town || ''}`.toLowerCase();
    if (t.includes('at the house')) return 'house';
    if (t.includes('grand traverse commons')) return 'commons';
    if (t.includes('boardman river')) return 'boardman';
    if (t.includes('old mission')) return 'old_mission';
    if (t.includes('suttons bay')) return 'suttons';
    if (t.includes('fishtown') || t.includes('leland')) return 'leland';
    if (t.includes('sleeping bear') || t.includes('empire')) return 'sleeping_bear';
    if (t.includes('glen arbor')) return 'glen_arbor';
    if (t.includes('south side')) return 'south_tc';
    if (t.includes('east side')) return 'east_tc';
    if (t.includes('west side') || t.includes('west bay')) return 'west_tc';
    if (t.includes('downtown')) return 'downtown';
    return 'traverse';
  }

  const NEIGHBORS = {
    west_tc: ['downtown','traverse','commons'],
    downtown: ['west_tc','traverse','commons','south_tc'],
    traverse: ['west_tc','downtown','commons','south_tc','east_tc'],
    commons: ['downtown','west_tc','traverse','south_tc'],
    suttons: ['old_mission'],
    glen_arbor: ['sleeping_bear','leland'],
    sleeping_bear: ['glen_arbor'],
    leland: ['glen_arbor'],
    south_tc: ['downtown','traverse','commons'],
    east_tc: ['downtown','traverse']
  };

  function candidateScore(place) {
    const info = ratings(place);
    const favoriteBoost = typeof favorites !== 'undefined' && favorites.includes(place.id) ? 1.25 : 0;
    return info.score + favoriteBoost;
  }

  function dialog() {
    return document.getElementById('plannerDecisionDialog');
  }

  function closeButtonMarkup() {
    return '<button class="planner-dialog-close" data-guided-close aria-label="Close">×</button>';
  }

  function addTo(day, slot, id) {
    activeDay = day;
    localStorage.setItem('tcActiveDay', day);
    addToPlan(id, slot);
  }

  function arrivalDinnerDone() {
    return planned('sun23','evening').some(p => p.kind === 'restaurant');
  }

  function mondayAnchor() {
    return ['morning','afternoon'].flatMap(slot => planned('mon24',slot).map(place => ({ place, slot })))
      .find(x => x.place.kind === 'activity' && !String(x.place.id).startsWith('wander-')) || null;
  }

  function renderArrivalDinner() {
    const dlg = dialog();
    if (!dlg) return;
    const options = ARRIVAL_RESTAURANTS
      .map(item => ({ ...item, place: allPlaces.find(p => p.id === item.id) }))
      .filter(x => x.place && !isScheduled(x.place.id) && ['$', '$$'].includes(x.place.price))
      .sort((a,b) => candidateScore(b.place) - candidateScore(a.place));

    dlg.innerHTML = `${closeButtonMarkup()}
      <p class="eyebrow dark">Let's Decide · Step 1</p>
      <h3>First problem: feed everybody.</h3>
      <p>You are arriving after very long drives. These are casual, solid choices roughly 20 minutes or less from the house. No tasting-menu nonsense. No scenic detour disguised as dinner.</p>
      <div class="guided-decision-list">
        ${options.map(({place,minutes}) => `<article class="guided-choice restaurant-choice">
          <div class="guided-choice-main">
            <span class="guided-choice-icon">${place.icon || '🍴'}</span>
            <div><strong>${safe(place.name)}</strong><small>≈${minutes} min from the house · ${safe(place.price)} · ${safe(place.area || place.town)}</small></div>
          </div>
          <p>${safe(place.summary || '')}</p>
          <div class="guided-choice-foot"><span>${safe(ratingLabel(place))}</span><button data-arrival-dinner="${safe(place.id)}">Pick for Sunday dinner</button></div>
        </article>`).join('')}
      </div>`;

    dlg.querySelectorAll('[data-arrival-dinner]').forEach(button => button.onclick = () => {
      addTo('sun23','evening',button.dataset.arrivalDinner);
      window.setTimeout(renderMondayAnchor, 120);
    });
    dlg.querySelector('[data-guided-close]').onclick = () => dlg.close();
    if (!dlg.open) dlg.showModal();
  }

  function renderMondayAnchor() {
    const dlg = dialog();
    if (!dlg) return;
    const options = allPlaces
      .filter(p => p.kind === 'activity' && !p.virtual && !isScheduled(p.id))
      .filter(p => {
        const info = ratings(p);
        return info.stats.count > 0 || (typeof favorites !== 'undefined' && favorites.includes(p.id));
      })
      .sort((a,b) => candidateScore(b) - candidateScore(a))
      .slice(0,10);

    dlg.innerHTML = `${closeButtonMarkup()}
      <p class="eyebrow dark">Let's Decide · Step 2</p>
      <h3>Now give Monday a spine.</h3>
      <p>Pick the main activity you want Monday to revolve around. Once this is anchored, I'll narrow the rest of the day to things that make sense nearby.</p>
      <div class="guided-decision-list">
        ${options.map(place => `<article class="guided-choice activity-choice">
          <div class="guided-choice-main">
            <span class="guided-choice-icon">${place.icon || '🧭'}</span>
            <div><strong>${safe(place.name)}</strong><small>${safe(place.area || place.town)}</small></div>
          </div>
          <p>${safe(place.summary || '')}</p>
          <div class="guided-choice-rating">${safe(ratingLabel(place))}</div>
          <div class="guided-anchor-actions"><button data-monday-anchor="${safe(place.id)}" data-anchor-slot="morning">☀️ Make it the morning anchor</button><button data-monday-anchor="${safe(place.id)}" data-anchor-slot="afternoon">🌤️ Make it the afternoon anchor</button></div>
        </article>`).join('')}
      </div>`;

    dlg.querySelectorAll('[data-monday-anchor]').forEach(button => button.onclick = () => {
      addTo('mon24',button.dataset.anchorSlot,button.dataset.mondayAnchor);
      window.setTimeout(renderBuildMonday, 120);
    });
    dlg.querySelector('[data-guided-close]').onclick = () => dlg.close();
    if (!dlg.open) dlg.showModal();
  }

  function renderBuildMonday() {
    const dlg = dialog();
    if (!dlg) return;
    const anchor = mondayAnchor();
    if (!anchor) return renderMondayAnchor();
    const anchorCluster = cluster(anchor.place);
    const acceptedClusters = new Set([anchorCluster, ...(NEIGHBORS[anchorCluster] || [])]);
    const options = allPlaces
      .filter(p => !p.virtual && p.id !== anchor.place.id && !isScheduled(p.id))
      .filter(p => acceptedClusters.has(cluster(p)))
      .filter(p => {
        const info = ratings(p);
        return info.stats.count > 0 || (typeof favorites !== 'undefined' && favorites.includes(p.id));
      })
      .sort((a,b) => {
        const sameA = cluster(a) === anchorCluster ? 2 : 0;
        const sameB = cluster(b) === anchorCluster ? 2 : 0;
        return (candidateScore(b)+sameB) - (candidateScore(a)+sameA);
      })
      .slice(0,12);

    const groups = {
      restaurant: options.filter(p => p.kind === 'restaurant').slice(0,4),
      activity: options.filter(p => p.kind === 'activity').slice(0,4),
      shop: options.filter(p => p.kind === 'shop').slice(0,4)
    };

    function cards(items, kind) {
      if (!items.length) return '<p class="guided-none">Nothing strong in this category nearby yet.</p>';
      return items.map(place => `<button class="guided-mini-choice kind-${kind}" data-build-monday="${safe(place.id)}">
        <strong>${place.icon || '📍'} ${safe(place.name)}</strong>
        <small>${safe(place.area || place.town)} · ${safe(ratingLabel(place))}</small>
      </button>`).join('');
    }

    dlg.innerHTML = `${closeButtonMarkup()}
      <p class="eyebrow dark">Let's Decide · Step 3</p>
      <h3>Build Monday around ${safe(anchor.place.name)}.</h3>
      <p>Your anchor is in <strong>${safe(anchor.place.area || anchor.place.town)}</strong>. These are the stronger choices in the same general area or an adjacent cluster, so Monday grows outward without becoming a windshield tour.</p>
      <section class="guided-build-section"><h4>🍴 Eat nearby</h4><div class="guided-mini-grid">${cards(groups.restaurant,'restaurant')}</div></section>
      <section class="guided-build-section"><h4>🧭 Add another thing</h4><div class="guided-mini-grid">${cards(groups.activity,'activity')}</div></section>
      <section class="guided-build-section"><h4>🛍️ Wander into a shop</h4><div class="guided-mini-grid">${cards(groups.shop,'shop')}</div></section>
      <div class="guided-build-footer"><button class="planner-primary-action" data-finish-monday>Monday looks good for now</button></div>`;

    dlg.querySelectorAll('[data-build-monday]').forEach(button => button.onclick = () => {
      const place = allPlaces.find(p => p.id === button.dataset.buildMonday);
      if (!place) return;
      let slot = 'afternoon';
      if (place.kind === 'restaurant') slot = anchor.slot === 'morning' ? 'afternoon' : 'evening';
      else if (anchor.slot === 'afternoon') slot = 'morning';
      else slot = 'afternoon';
      addTo('mon24',slot,place.id);
      window.setTimeout(renderBuildMonday, 120);
    });
    dlg.querySelector('[data-finish-monday]').onclick = () => dlg.close();
    dlg.querySelector('[data-guided-close]').onclick = () => dlg.close();
    if (!dlg.open) dlg.showModal();
  }

  function openGuidedDecision() {
    if (!arrivalDinnerDone()) return renderArrivalDinner();
    if (!mondayAnchor()) return renderMondayAnchor();
    return renderBuildMonday();
  }

  function applyPlannerKinds() {
    document.querySelectorAll('.plan-stop-card[data-plan-stop]').forEach(card => {
      const place = allPlaces.find(p => p.id === card.dataset.planStop);
      if (!place) return;
      card.classList.remove('kind-restaurant','kind-shop','kind-activity');
      card.classList.add(`kind-${place.kind || 'activity'}`);
    });
  }

  function wire() {
    const button = document.getElementById('openDecidePreview');
    if (!button || button.dataset.guidedPlannerReady === 'true') return false;
    button.dataset.guidedPlannerReady = 'true';
    button.textContent = '🦦 Let\'s Decide';
    button.onclick = openGuidedDecision;
    applyPlannerKinds();
    const calendar = document.getElementById('planCalendar');
    if (calendar) new MutationObserver(() => requestAnimationFrame(applyPlannerKinds)).observe(calendar,{childList:true,subtree:true});
    return true;
  }

  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (wire() || tries > 200) clearInterval(timer);
  }, 50);
})();
