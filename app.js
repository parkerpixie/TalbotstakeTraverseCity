const travelers = [
  { name: 'Jen', icon: '🛍️', note: 'Curious shops, coffee, kayaking, art, and beautiful detours.', priorities: ['shopping','food','scenic','outdoors'] },
  { name: 'Blake', icon: '🍔', note: 'Great food, low-stress scenery, house time, and friendly competition.', priorities: ['food','games','scenic'] },
  { name: 'Porter', icon: '🎮', note: 'Games, unusual stops, sweet treats, animals, and clear plans.', priorities: ['games','food','shopping'] },
  { name: 'Mark', icon: '🚤', note: 'Waterfront views, scenic drives, local history, and relaxed exploring.', priorities: ['scenic','outdoors','food'] },
  { name: 'Nancy', icon: '🍒', note: 'Shopping, gardens, handmade finds, scenic towns, and memorable meals.', priorities: ['shopping','scenic','food'] },
  { name: 'Everyone', icon: '⚓', note: 'Show the full family adventure menu.', priorities: [] }
];

const activities = [
  { id:'suttons', title:'Wander Suttons Bay', category:'shopping', energy:'low', area:'Suttons Bay', icon:'🛍️', description:'A relaxed little-town browse with shops, art, snacks, and plenty of room for spontaneous treasure hunting.', people:['Jen','Nancy','Mark'] },
  { id:'sleeping-bear', title:'Sleeping Bear Dunes Overlook', category:'outdoors', energy:'medium', area:'Glen Arbor', icon:'🌊', description:'The dramatic Lake Michigan view that earns a permanent spot in the family camera roll.', people:['Jen','Blake','Porter','Mark','Nancy'] },
  { id:'cherry-stop', title:'The Great Cherry Taste Test', category:'food', energy:'low', area:'Traverse City', icon:'🍒', description:'Cherry salsa, cherry soda, cherry candy, and possibly one cherry product that should never have escaped the laboratory.', people:['Jen','Blake','Porter','Nancy'] },
  { id:'kayak', title:'Morning Kayak on West Bay', category:'outdoors', energy:'high', area:'West Bay', icon:'🛶', description:'A calm early paddle before the day gets busy, with the house as home base and the bay doing all the decorating.', people:['Jen','Porter','Mark'] },
  { id:'bookshop', title:'Independent Bookstore Detour', category:'shopping', energy:'low', area:'Traverse City', icon:'📚', description:'A cool, quiet browse with local books, gifts, and the very real possibility of leaving with a tote bag.', people:['Jen','Porter','Nancy'] },
  { id:'shuffleboard', title:'Family Shuffleboard Championship', category:'games', energy:'low', area:'The House', icon:'🎯', description:'Official brackets. Questionable officiating. A trophy that may be invented five minutes before the final.', people:['Blake','Porter','Mark'] },
  { id:'peninsula-drive', title:'Old Mission Peninsula Scenic Drive', category:'scenic', energy:'low', area:'Old Mission Peninsula', icon:'🚗', description:'Water views, orchards, lighthouse energy, and stops whenever somebody says, “Wait, pull over.”', people:['Blake','Mark','Nancy','Jen'] },
  { id:'ice-cream', title:'Find the Best Ice Cream', category:'food', energy:'low', area:'Anywhere', icon:'🍦', description:'A rigorous and completely scientific family investigation conducted one scoop at a time.', people:['Porter','Blake','Nancy'] },
  { id:'leland', title:'Explore Historic Fishtown', category:'scenic', energy:'medium', area:'Leland', icon:'⚓', description:'Weathered shanties, water, local shops, and Northern Michigan atmosphere turned all the way up.', people:['Jen','Mark','Nancy','Blake'] }
];

let selectedTraveler = localStorage.getItem('tcTraveler') || 'Everyone';
let favorites = JSON.parse(localStorage.getItem('tcFavorites') || '[]');

const dialog = document.getElementById('travelerDialog');
const grid = document.getElementById('activityGrid');
const toast = document.getElementById('toast');

function renderTravelers(){
  const markup = travelers.map(t => `<button class="traveler-option" data-traveler="${t.name}"><span>${t.icon}</span><strong>${t.name}</strong><small>${t.note}</small></button>`).join('');
  document.getElementById('travelerGrid').innerHTML = markup;
  document.getElementById('travelerStrip').innerHTML = travelers.map(t => `<button class="traveler-chip ${selectedTraveler===t.name?'active':''}" data-traveler="${t.name}">${t.icon} ${t.name}</button>`).join('');
  document.getElementById('profilePill').textContent = selectedTraveler === 'Everyone' ? 'Choose traveler' : `${selectedTraveler}'s view`;
  document.querySelectorAll('[data-traveler]').forEach(btn => btn.addEventListener('click', () => chooseTraveler(btn.dataset.traveler)));
}

function chooseTraveler(name){
  selectedTraveler = name;
  localStorage.setItem('tcTraveler', name);
  renderTravelers();
  renderActivities();
  const t = travelers.find(x => x.name === name);
  document.getElementById('personalizedMessage').textContent = name === 'Everyone' ? 'Showing a little bit of everything for everyone.' : `${name}'s view puts ${t.priorities.join(', ')} ideas near the front.`;
  if(dialog.open) dialog.close();
  showToast(name === 'Everyone' ? 'Showing the whole family adventure menu.' : `Welcome aboard, ${name}. Your picks are now up front.`);
}

function filteredActivities(){
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const category = document.getElementById('categoryFilter').value;
  const energy = document.getElementById('energyFilter').value;
  const traveler = travelers.find(t => t.name === selectedTraveler);
  return activities
    .filter(a => category === 'all' || a.category === category)
    .filter(a => energy === 'all' || a.energy === energy)
    .filter(a => `${a.title} ${a.description} ${a.area} ${a.category}`.toLowerCase().includes(query))
    .sort((a,b) => {
      if(selectedTraveler === 'Everyone') return 0;
      const aScore = (a.people.includes(selectedTraveler)?3:0) + (traveler.priorities.includes(a.category)?1:0);
      const bScore = (b.people.includes(selectedTraveler)?3:0) + (traveler.priorities.includes(b.category)?1:0);
      return bScore-aScore;
    });
}

function renderActivities(){
  const results = filteredActivities();
  grid.innerHTML = results.length ? results.map(a => `
    <article class="activity-card">
      <button class="heart ${favorites.includes(a.id)?'active':''}" data-favorite="${a.id}" aria-label="Save ${a.title}">♥</button>
      <div class="activity-image dummy-image"><span>Future photo: ${a.title}</span></div>
      <div class="activity-content">
        <div class="activity-meta"><span class="tag">${a.area}</span><span class="tag">${a.energy} energy</span></div>
        <h3>${a.icon} ${a.title}</h3>
        <p>${a.description}</p>
      </div>
    </article>`).join('') : '<p>No matches yet. Try widening the filters a little.</p>';
  document.querySelectorAll('[data-favorite]').forEach(btn => btn.addEventListener('click', () => toggleFavorite(btn.dataset.favorite)));
}

function toggleFavorite(id){
  favorites = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites,id];
  localStorage.setItem('tcFavorites', JSON.stringify(favorites));
  renderActivities();
  renderFavorites();
  showToast(favorites.includes(id) ? 'Saved to the family shortlist.' : 'Removed from the shortlist.');
}

function renderFavorites(){
  const container = document.getElementById('favoriteList');
  const saved = activities.filter(a => favorites.includes(a.id));
  container.innerHTML = saved.length ? saved.map(a => `<div class="favorite-item">${a.icon} <strong>${a.title}</strong> · ${a.area}</div>`).join('') : '<p class="empty-state">Nothing saved yet. Go heart something delightful.</p>';
}

function updateCountdown(){
  const target = new Date('2026-08-23T16:00:00');
  const diff = Math.max(0,target-new Date());
  document.getElementById('days').textContent = Math.floor(diff/86400000);
  document.getElementById('hours').textContent = Math.floor(diff%86400000/3600000);
  document.getElementById('minutes').textContent = Math.floor(diff%3600000/60000);
}

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function openTraveler(){ dialog.showModal(); }

document.getElementById('openTraveler').addEventListener('click', openTraveler);
document.getElementById('bottomTraveler').addEventListener('click', openTraveler);
document.getElementById('profilePill').addEventListener('click', openTraveler);
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('.menu-toggle').addEventListener('click', e => {
  const header = document.querySelector('.site-header');
  header.classList.toggle('nav-open');
  e.currentTarget.setAttribute('aria-expanded', header.classList.contains('nav-open'));
});
['searchInput','categoryFilter','energyFilter'].forEach(id => document.getElementById(id).addEventListener('input', renderActivities));
document.querySelectorAll('.mood-card').forEach(btn => btn.addEventListener('click', () => {
  const map = {relax:'scenic',eat:'food',shop:'shopping',adventure:'outdoors'};
  document.getElementById('categoryFilter').value = map[btn.dataset.mood];
  renderActivities();
  document.getElementById('explore').scrollIntoView();
}));
document.querySelectorAll('[data-toast]').forEach(btn => btn.addEventListener('click', () => showToast(btn.dataset.toast)));

renderTravelers();
renderActivities();
renderFavorites();
updateCountdown();
setInterval(updateCountdown,60000);