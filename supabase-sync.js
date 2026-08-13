(() => {
  const SUPABASE_URL = 'https://xqqywlkgojhriyfpsuhv.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_d4EhZHskbDMR_cVMu5eIMA_NEDP1fLz';

  if (!window.supabase?.createClient) {
    console.warn('Supabase client did not load. The app will continue using this phone only.');
    return;
  }

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const TABLE = 'trip_app_state';
  const HEART_KEY = 'heart_ratings';
  const HEART_LOCAL_KEY = 'tcHeartRatings';
  const HEART_BACKUP_KEY = 'tcHeartRatingsSafetyBackup';
  const FAMILY = ['Parker', 'Blake', 'Porter', 'Mark', 'Nancy'];
  const listeners = new Map();
  let ready = false;

  const notify = (key, value) => {
    (listeners.get(key) || []).forEach(listener => listener(value));
  };

  const cleanHeartState = value => {
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const clean = {};
    Object.entries(source).forEach(([placeId, people]) => {
      if (!people || typeof people !== 'object' || Array.isArray(people)) return;
      FAMILY.forEach(person => {
        const score = Number(people[person]);
        if (!Number.isInteger(score) || score < 1 || score > 5) return;
        clean[placeId] ||= {};
        clean[placeId][person] = score;
      });
    });
    return clean;
  };

  const localHeartState = () => {
    try { return cleanHeartState(JSON.parse(localStorage.getItem(HEART_LOCAL_KEY) || '{}')); }
    catch { return {}; }
  };

  const mergeHeartStates = (...states) => {
    const merged = {};
    states.forEach(state => {
      const clean = cleanHeartState(state);
      Object.entries(clean).forEach(([placeId, people]) => {
        merged[placeId] ||= {};
        Object.entries(people).forEach(([person, score]) => {
          merged[placeId][person] = score;
        });
      });
    });
    return merged;
  };

  const preserveHeartBackup = state => {
    const clean = cleanHeartState(state);
    if (!Object.keys(clean).length) return;
    let previous = {};
    try { previous = JSON.parse(localStorage.getItem(HEART_BACKUP_KEY) || '{}'); }
    catch { previous = {}; }
    localStorage.setItem(HEART_BACKUP_KEY, JSON.stringify(mergeHeartStates(previous, clean)));
  };

  const readRaw = async key => {
    const { data, error } = await client
      .from(TABLE)
      .select('state_value')
      .eq('state_key', key)
      .maybeSingle();
    if (error) throw error;
    return data?.state_value;
  };

  const read = async key => {
    const remote = await readRaw(key);
    if (key !== HEART_KEY) return remote;
    const local = localHeartState();
    const backup = (() => {
      try { return JSON.parse(localStorage.getItem(HEART_BACKUP_KEY) || '{}'); }
      catch { return {}; }
    })();
    const merged = mergeHeartStates(remote, backup, local);
    preserveHeartBackup(merged);
    return merged;
  };

  const write = async (key, value) => {
    let nextValue = value;
    if (key === HEART_KEY) {
      const remote = await readRaw(HEART_KEY);
      const local = localHeartState();
      const backup = (() => {
        try { return JSON.parse(localStorage.getItem(HEART_BACKUP_KEY) || '{}'); }
        catch { return {}; }
      })();
      nextValue = mergeHeartStates(remote, backup, local, value);
      preserveHeartBackup(nextValue);
      localStorage.setItem(HEART_LOCAL_KEY, JSON.stringify(nextValue));
    }

    const { error } = await client
      .from(TABLE)
      .upsert({ state_key: key, state_value: nextValue, updated_at: new Date().toISOString() });
    if (error) throw error;
    return nextValue;
  };

  const subscribe = (key, listener) => {
    if (!listeners.has(key)) listeners.set(key, []);
    listeners.get(key).push(listener);
    return () => listeners.set(key, (listeners.get(key) || []).filter(item => item !== listener));
  };

  window.TCShared = {
    get ready() { return ready; },
    read,
    write,
    subscribe,
    async saveBedClaims(value) {
      localStorage.setItem('tcBedClaims', JSON.stringify(value));
      try { await write('bed_claims', value); }
      catch (error) { console.warn('Bedroom claims saved locally only:', error.message); }
    }
  };

  const applyFavorites = value => {
    if (!Array.isArray(value)) return;
    favorites = value;
    localStorage.setItem('tcFavoritesV3', JSON.stringify(value));
    renderRestaurants();
    renderShops();
    renderActivities();
    renderPlanner();
    updateStats();
  };

  const applyPlan = value => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;
    const hasDays = tripDays.some(day => value[day.id]);
    if (!hasDays) return;
    plan = value;
    tripDays.forEach(day => {
      if (!plan[day.id]) plan[day.id] = emptyDay();
    });
    localStorage.setItem('tcPlanV3', JSON.stringify(plan));
    renderPlanner();
  };

  const originalToggleFavorite = toggleFavorite;
  toggleFavorite = id => {
    originalToggleFavorite(id);
    write('favorites', favorites).catch(error => console.warn('Favorite saved locally only:', error.message));
  };

  const originalSavePlan = savePlan;
  savePlan = () => {
    originalSavePlan();
    write('plan', plan).catch(error => console.warn('Plan saved locally only:', error.message));
  };

  client
    .channel('talbots-trip-shared-state')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, payload => {
      const row = payload.new;
      if (!row?.state_key) return;
      if (row.state_key === 'favorites') applyFavorites(row.state_value);
      if (row.state_key === 'plan') applyPlan(row.state_value);
      if (row.state_key === HEART_KEY) {
        const merged = mergeHeartStates(row.state_value, localHeartState());
        preserveHeartBackup(merged);
        localStorage.setItem(HEART_LOCAL_KEY, JSON.stringify(merged));
        notify(row.state_key, merged);
        return;
      }
      notify(row.state_key, row.state_value);
    })
    .subscribe();

  Promise.all([read('favorites'), read('plan'), read('bed_claims')])
    .then(([sharedFavorites, sharedPlan, sharedClaims]) => {
      if (Array.isArray(sharedFavorites) && sharedFavorites.length === 0 && favorites.length) {
        write('favorites', favorites);
      } else {
        applyFavorites(sharedFavorites);
      }

      const sharedPlanHasStops = sharedPlan && Object.values(sharedPlan).some(day =>
        day && Object.values(day).some(slot => Array.isArray(slot) && slot.length)
      );
      const localPlanHasStops = Object.values(plan).some(day =>
        day && Object.values(day).some(slot => Array.isArray(slot) && slot.length)
      );
      if (!sharedPlanHasStops && localPlanHasStops) write('plan', plan);
      else applyPlan(sharedPlan);

      const localClaims = JSON.parse(localStorage.getItem('tcBedClaims') || '{}');
      const sharedClaimsEmpty = !sharedClaims || !Object.values(sharedClaims).some(names => Array.isArray(names) && names.length);
      const localClaimsUsed = Object.values(localClaims).some(names => Array.isArray(names) && names.length);
      if (sharedClaimsEmpty && localClaimsUsed) write('bed_claims', localClaims);
      else if (sharedClaims && typeof sharedClaims === 'object') {
        localStorage.setItem('tcBedClaims', JSON.stringify(sharedClaims));
        notify('bed_claims', sharedClaims);
      }

      ready = true;
      document.documentElement.dataset.sync = 'connected';
      document.dispatchEvent(new CustomEvent('tc-shared-ready'));
    })
    .catch(error => {
      console.warn('Shared sync is not ready yet. Run supabase-setup.sql in Supabase:', error.message);
      document.documentElement.dataset.sync = 'local';
    });
})();
