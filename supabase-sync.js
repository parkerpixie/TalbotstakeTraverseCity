(() => {
  const SUPABASE_URL = 'https://xqqywlkgojhriyfpsuhv.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_d4EhZHskbDMR_cVMu5eIMA_NEDP1fLz';

  if (!window.supabase?.createClient) {
    console.warn('Supabase client did not load. The app will continue using this phone only.');
    return;
  }

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const TABLE = 'trip_app_state';
  const listeners = new Map();
  let ready = false;

  const notify = (key, value) => {
    (listeners.get(key) || []).forEach(listener => listener(value));
  };

  const read = async key => {
    const { data, error } = await client
      .from(TABLE)
      .select('state_value')
      .eq('state_key', key)
      .maybeSingle();
    if (error) throw error;
    return data?.state_value;
  };

  const write = async (key, value) => {
    const { error } = await client
      .from(TABLE)
      .upsert({ state_key: key, state_value: value, updated_at: new Date().toISOString() });
    if (error) throw error;
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
