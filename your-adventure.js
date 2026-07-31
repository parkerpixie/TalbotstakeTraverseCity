(() => {
  const home = document.querySelector('[data-panel="home"]');
  if (!home) return;

  const discoveries = [
    {type:'New activity',name:'The Botanic Garden at Historic Barns Park',image:'Assets/Assets/Images/IMG_9814.jpeg',tab:'explore'},
    {type:'New activity',name:'Grand Traverse Commons Walking Trails',image:'Assets/Assets/Images/IMG_9799.jpeg',tab:'explore'},
    {type:'Family favorite',name:'Fishtown & Leland Harbor',image:'Assets/Assets/Images/IMG_9814.jpeg',tab:'explore'}
  ];
  const topPicks = [
    {type:'Scenic adventure',name:'Sleeping Bear Dunes',image:'Assets/Assets/Images/IMG_9799.jpeg',tab:'explore',hearts:5},
    {type:'Historic wandering',name:'Grand Traverse Commons',image:'Assets/Assets/Images/IMG_9814.jpeg',tab:'explore',hearts:4},
    {type:'At the house',name:'West Bay Water Day',image:'Assets/Assets/Images/IMG_9799.jpeg',tab:'house',hearts:4}
  ];
  const facts = [
    'The dunes at Sleeping Bear rise hundreds of feet above Lake Michigan and are still moving grain by grain.',
    'The Grand Traverse Commons grounds combine preserved historic buildings with trails, gardens, shops and restaurants.',
    'Power Island, visible from West Bay, has long been part of the cultural and natural landscape of the bay.',
    'Northern Michigan cherries thrive because Lake Michigan softens temperature swings around the growing season.'
  ];

  function traveler(){
    const saved = localStorage.getItem('tcTraveler');
    return saved && saved !== 'Everyone' ? saved : 'Explorer';
  }
  function greeting(){
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  }
  function daysUntilTrip(){
    return Math.max(0, Math.ceil((new Date('2026-08-23T16:00:00') - new Date()) / 86400000));
  }
  function savedCount(){
    const number = Number(document.getElementById('favoriteCount')?.textContent || 0);
    return Number.isFinite(number) ? number : 0;
  }
  function plannedCount(){
    const number = Number(document.getElementById('plannedCount')?.textContent || 0);
    return Number.isFinite(number) ? number : 0;
  }
  function card(item){
    return `<button class="adventure-card" type="button" data-tab="${item.tab}"><img src="${item.image}" alt=""><span class="adventure-card-overlay"><small>${item.type}</small><strong>${item.name}</strong>${item.hearts ? `<span class="hearts">${'♥'.repeat(item.hearts)}${'♡'.repeat(5-item.hearts)}</span>` : ''}</span></button>`;
  }
  function render(){
    const name = traveler();
    const fact = facts[new Date().getDate() % facts.length];
    const remaining = Math.max(0, 18 - savedCount());
    home.className = 'tab-panel active your-adventure';
    home.innerHTML = `
      <section class="adventure-welcome">
        <img src="Assets/Assets/Images/IMG_9814.jpeg" alt="West Bay from the Traverse City house">
        <div class="adventure-welcome-copy">
          <p class="eyebrow">Your personalized Traverse City guide</p>
          <h2>${greeting()}, ${name}.</h2>
          <p>Your adventure is taking shape. Discover places, leave your heart rating, and help the family build a trip everyone is genuinely excited about.</p>
          <div class="adventure-countdown"><span>⏳ ${daysUntilTrip()} days to go</span><span>♥ ${savedCount()} saved</span><span>🗓 ${plannedCount()} planned</span></div>
        </div>
      </section>

      <section class="adventure-action">
        <button class="continue-card" type="button" data-tab="explore">
          <span class="continue-icon">♥</span><span><span class="new-badge">Your next step</span><h3>Continue rating adventures</h3><p>Every rating helps reveal where the family's interests overlap.</p></span><strong class="continue-number">${remaining}</strong>
        </button>
        <article class="discovery-card"><span class="new-badge">Today's discovery</span><h3>Did you know?</h3><p class="discovery-fact">${fact}</p></article>
      </section>

      <section class="adventure-section">
        <div class="adventure-section-head"><div><h3>Your Top Picks</h3><p>The places rising to the top of ${name}'s list.</p></div><button class="adventure-link" type="button" data-tab="explore">See all places →</button></div>
        <div class="adventure-grid">${topPicks.map(card).join('')}</div>
      </section>

      <section class="adventure-section">
        <div class="adventure-section-head"><div><h3>New Discoveries</h3><p>Fresh additions waiting for a family verdict.</p></div><button class="adventure-link" type="button" data-tab="explore">Start exploring →</button></div>
        <div class="adventure-grid">${discoveries.map(card).join('')}</div>
      </section>

      <section class="dashboard-mini-grid">
        <button class="house-card" type="button" data-tab="house"><span class="house-card-icon">🏡</span><span><span class="new-badge">House basecamp</span><h3>Sunrise Shores Retreat</h3><p>Explore the rooms, waterfront, hot tub and bedroom options.</p></span></button>
        <button class="house-card" type="button" data-tab="planner"><span class="house-card-icon">🧭</span><span><span class="new-badge">Family adventure</span><h3>See what everyone loves</h3><p>Turn shared favorites into five days without the windshield zigzag.</p></span></button>
      </section>`;

    home.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => {
      const target = button.dataset.tab;
      document.querySelectorAll(`[data-tab="${target}"]`)[0]?.click();
    }));
  }

  render();
  const profile = document.getElementById('profilePill');
  profile?.addEventListener('click', () => setTimeout(render, 250));
  window.addEventListener('storage', event => { if (event.key === 'tcTraveler') render(); });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-explorer-name]')) setTimeout(render, 100);
  });
})();
