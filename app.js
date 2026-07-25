const travelers=[
{name:'Jen',icon:'🛍️',note:'Shops, coffee, art, pasta, waterfront wandering.'},
{name:'Blake',icon:'🍔',note:'Burgers, records, low-stress meals, scenery, easy parking.'},
{name:'Porter',icon:'🎮',note:'Comics, games, cards, clear plans, sweets, unusual stops.'},
{name:'Mark',icon:'🚤',note:'Water views, local favorites, relaxed exploring.'},
{name:'Nancy',icon:'🍒',note:'Boutiques, handmade finds, scenic towns, memorable meals.'},
{name:'Everyone',icon:'⚓',note:'Show the full family shortlist.'}
];

const restaurants=[
{id:'west-end',name:'West End Tavern',town:'Traverse City',price:'$$',icon:'🌊',url:'https://www.westendtaverntc.com/',tags:['waterfront','burgers','patio','family','local-favorite'],fit:['Blake','Mark','Nancy','Jen'],summary:'A polished but comfortable West Bay option with broad appeal and a real water view.',menu:'Gourmet burgers, artisan pizzas, steaks, fresh fish, comforting entrées.'},
{id:'slabtown',name:'Slabtown Burgers',town:'Traverse City',price:'$',icon:'🍔',url:'https://www.slabtownburgers.com/',tags:['burgers','quick','family','local-favorite','hidden-gem'],fit:['Blake','Porter','Jen'],summary:'Casual, homemade, hand-pattied burgers with patio seating and almost no ceremony.',menu:'Burgers, fries, soups, wraps, salads, hot dogs, chicken sandwiches, veggie burgers.'},
{id:'lil-bo',name:'Lil Bo',town:'Traverse City',price:'$$',icon:'🕵️',url:'https://www.lilbotc.com/',tags:['burgers','hidden-gem','local-favorite','quick'],fit:['Blake','Jen','Mark'],summary:'A tiny neighborhood bar with old-school Traverse City character and playful burgers.',menu:'Olive burger, Cowboy Kicker, Smurf & Turf, cheese curds, sandwiches.'},
{id:'modern-bird',name:'Modern Bird',town:'Traverse City',price:'$$$',icon:'✨',url:'https://modernbirdtc.com/menu',tags:['special','hidden-gem','local-favorite'],fit:['Jen','Nancy','Mark'],summary:'Seasonal, chef-driven plates for the night when dinner itself is the activity.',menu:'Seasonal vegetables, breads, creative small plates, meat and seafood entrées; menu changes often.'},
{id:'stella',name:'Trattoria Stella',town:'Traverse City',price:'$$$',icon:'🍝',url:'https://stellatc.com/menu',tags:['pasta','special','local-favorite','hidden-gem'],fit:['Jen','Nancy','Mark'],summary:'Atmospheric Italian inside the historic Grand Traverse Commons. Reservations are the smart move.',menu:'Burrata, housemade pasta such as maltagliati, rotating farm-to-table Italian dishes, extensive wine.'},
{id:'boones',name:"Boone's Prime Time Pub",town:'Suttons Bay',price:'$$',icon:'🍔',url:'https://www.boonesprimetimepub.com/',tags:['burgers','family','patio','local-favorite'],fit:['Blake','Porter','Mark','Nancy'],summary:'Classic Up North pub energy with a rooftop deck and a menu built to keep a whole family happy.',menu:'M22 Burger, Great Lakes perch basket, steaks, fresh fish, Massive Mary.'},
{id:'vi-grill',name:'V.I. Grill',town:'Suttons Bay',price:'$$',icon:'📍',url:'https://www.vigrill.com/',tags:['burgers','pasta','local-favorite','family','hidden-gem'],fit:['Blake','Jen','Nancy','Porter'],summary:'A dependable Suttons Bay local favorite with burgers and a Thursday pasta tradition.',menu:'Villager Burger, custom burgers, quesadillas; Thursday pasta may include chicken Alfredo or Cajun salmon pasta.'},
{id:'arts',name:"Art's Tavern",town:'Glen Arbor',price:'$',icon:'🏕️',url:'https://artsglenarbor.com/lunch-dinner-menu/',tags:['burgers','local-favorite','hidden-gem','family','quick'],fit:['Blake','Porter','Mark','Jen'],summary:'The beloved, cash-or-check Glen Arbor institution for tots, burgers, whitefish, and local personality.',menu:"Art's Burger, olive cheddar burger, smoked wings, whitefish sandwich, perch, chicken jalapeño soup."},
{id:'boonedocks',name:'Boonedocks',town:'Glen Arbor',price:'$$',icon:'🌲',url:'https://www.boonedocksga.com/',tags:['burgers','family','patio','local-favorite'],fit:['Blake','Porter','Mark','Nancy'],summary:'A rustic, family-friendly stop only a couple of miles from Sleeping Bear Dunes.',menu:'Half-pound Black Angus burgers, local whitefish, perch, sandwiches, salads, appetizers, ice cream nearby.'},
{id:'cherry-public',name:'Cherry Public House',town:'Glen Arbor',price:'$$',icon:'🍒',url:'https://www.cherryrepublic.com/cherry-public-house',tags:['burgers','family','patio','local-favorite'],fit:['Porter','Blake','Jen','Nancy'],summary:'A fun Glen Arbor stop when the family wants Michigan flavor without a formal dinner.',menu:'Cherry bacon marmalade burger, pulled pork sliders, smoked whitefish dip, cherry salsa, pretzels.'},
{id:'blu',name:'Blu',town:'Glen Arbor',price:'$$$',icon:'🌅',url:'https://www.glenarborblu.com/menu',tags:['waterfront','special','pasta','patio'],fit:['Jen','Nancy','Mark'],summary:'Lakeside fine dining with Sleeping Bear Bay views and a highly seasonal menu.',menu:'Ricotta gnocchi, scallops, wagyu, salmon, lamb, composed vegetable dishes.'},
{id:'upriver',name:'Upriver Pizza',town:'Leland',price:'$$',icon:'🍕',url:'https://upriverpizza.com/menu/',tags:['burgers','pasta','family','hidden-gem','local-favorite'],fit:['Porter','Blake','Jen','Mark'],summary:'A casual Leland-area wildcard for pizza, pasta, and a Thursday smash burger people drive for.',menu:'Pizza, kiddo pasta, Thursday smash burger with hand-cut fries, doughnuts and cinnastix.'}
];

const shops=[
{id:'rpm-records',name:'RPM Records',town:'Traverse City',type:'records',icon:'💿',url:'https://www.rpmrecordstc.com/',fit:['Blake','Porter'],summary:'Northern Michigan’s largest record store, with new and used vinyl, CDs, tapes, turntables, stereo equipment, speakers, accessories, and repair service.'},
{id:'eugenes-records',name:"Eugene's Record Co-op",town:'Traverse City',type:'records',icon:'🎵',url:'https://www.eugenesrecordcoop.com/',fit:['Blake','Porter'],summary:'A downtown co-op carrying new and used vinyl across decades and genres, plus turntables, accessories, repair, tape conversion, and listening-station energy.'},
{id:'top-comics',name:'Top Comics',town:'Traverse City',type:'comics',icon:'💥',url:'https://www.thetopcomics.com/',fit:['Porter','Blake'],summary:'Northern Michigan’s long-running comic and collectibles shop, with new issues, vintage comics, collected editions, posters, figures, shirts, and collecting supplies.'},
{id:'fun-factory',name:'Fun Factory TC',town:'Traverse City',type:'games',icon:'🎲',url:'https://www.thefunfactorytc.com/',fit:['Porter','Blake'],summary:'Trading card games, distinctive board games, tabletop supplies, play tables, weekly events, and tournaments.'},
{id:'m22-tc',name:'M22 Traverse City',town:'Traverse City',type:'gifts',icon:'🌊',url:'https://m22.com/',fit:['Jen','Nancy','Mark'],summary:'Northern Michigan apparel and gifts tied to the road, lakes, and local conservation.'},
{id:'wilson',name:'Wilson Antiques',town:'Traverse City',type:'antiques',icon:'🕰️',url:'https://wilsonantiques.com/',fit:['Jen','Nancy'],summary:'A large downtown antique destination for vintage treasure hunting and rainy-day wandering.'},
{id:'horizon',name:'Horizon Books',town:'Traverse City',type:'books',icon:'📚',url:'https://www.horizonbooks.com/',fit:['Jen','Porter','Nancy'],summary:'A long-loved independent bookstore downtown with books, gifts, and plenty of browsing room.'},
{id:'folded-leaf',name:'The Folded Leaf',town:'Traverse City',type:'books',icon:'☕',url:'https://www.thefoldedleafnomi.com/',fit:['Jen','Porter','Nancy'],summary:'A nonprofit new-and-used bookshop, local-art supporter, community gathering space, and coffee-and-tea stop.'},
{id:'cherry-republic-tc',name:'Cherry Republic',town:'Traverse City',type:'food',icon:'🍒',url:'https://www.cherryrepublic.com/',fit:['Porter','Jen','Nancy'],summary:'Cherry salsa, candy, preserves, drinks, gifts, and edible souvenirs with maximum Michigan energy.'},
{id:'m22-sb',name:'M22 Suttons Bay',town:'Suttons Bay',type:'gifts',icon:'🧢',url:'https://m22.com/',fit:['Mark','Nancy','Jen'],summary:'A natural stop while walking St. Joseph Street for apparel and Up North gifts.'},
{id:'nykamping',name:'Nykamping',town:'Suttons Bay',type:'boutique',icon:'🧵',url:'https://nykamping.com/',fit:['Jen','Nancy'],summary:'Handmade apparel and thoughtfully selected pre-loved textiles with a distinctive local point of view.'},
{id:'m22-leland',name:'M22 Leland',town:'Leland',type:'gifts',icon:'⚓',url:'https://m22.com/',fit:['Mark','Nancy','Jen'],summary:'Easy to pair with Fishtown and the rest of Leland’s compact downtown shopping.'},
{id:'benjamin-maier',name:'Benjamin Maier Ceramics',town:'Leland',type:'art',icon:'🏺',url:'https://benjaminmaierceramics.com/',fit:['Jen','Nancy'],summary:'Elevated handmade ceramics that feel like a true piece of northern Michigan rather than a generic souvenir.'},
{id:'m22-glen',name:'M22 Glen Arbor',town:'Glen Arbor',type:'gifts',icon:'🏕️',url:'https://m22.com/',fit:['Mark','Nancy','Jen'],summary:'The flagship-feeling Glen Arbor stop for road-trip apparel and outdoor-minded gifts.'},
{id:'cottage-book',name:'The Cottage Book Shop',town:'Glen Arbor',type:'books',icon:'📖',url:'https://www.cottagebooks.com/',fit:['Jen','Porter','Nancy'],summary:'A cozy independent bookstore that pairs perfectly with coffee, lunch, and a Sleeping Bear day.'},
{id:'cherry-republic-ga',name:'Cherry Republic Glen Arbor',town:'Glen Arbor',type:'food',icon:'🍒',url:'https://www.cherryrepublic.com/',fit:['Porter','Jen','Nancy'],summary:'The full cherry wonderland: food, gifts, samples, and an easy family stop.'},
{id:'fishtown',name:'Fishtown Shops',town:'Leland',type:'art',icon:'🎣',url:'https://www.fishtownmi.org/',fit:['Jen','Nancy','Mark'],summary:'A cluster of shanty shops, local goods, art, food, and waterfront atmosphere in one walkable stop.'}
];

const houseGalleryData=[
{id:'exterior',title:'Exterior, shoreline and water',kicker:'Outside first',description:'The house sits directly on West Bay along scenic M-22, with a large yard, shoreline views, dock access, patio space and several places to linger outside.',images:['IMG_9768.jpeg','IMG_9769.jpeg','IMG_9770.jpeg','IMG_9797.jpeg','IMG_9798.jpeg','IMG_9799.jpeg','IMG_9800.jpeg','IMG_9814.jpeg','IMG_9817.jpeg']},
{id:'game-room',title:'Garage game room',kicker:'Rainy-day headquarters',description:'The converted garage adds shuffleboard, television, games and an open-door view toward the bay. It gives everyone a second living zone when the main room needs breathing space.',images:['IMG_9771.jpeg','IMG_9772.jpeg','IMG_9773.jpeg']},
{id:'kitchen-living',title:'Kitchen, dining and living spaces',kicker:'The gathering zone',description:'An open floor plan with high-end finishes, quartz countertops, stainless appliances and a roughly ten-foot island designed for meals, coffee and sprawling vacation conversations.',images:['IMG_9775.jpeg','IMG_9777.jpeg','IMG_9778.jpeg','IMG_9779.jpeg','IMG_9780.jpeg','IMG_9781.jpeg','IMG_9782.jpeg','IMG_9783.jpeg']},
{id:'bathrooms',title:'Bathrooms',kicker:'Two full baths',description:'The listing confirms two full bathrooms, including one with a bathtub or shower and another with a shower-only setup.',images:['IMG_9784.jpeg','IMG_9785.jpeg','IMG_9786.jpeg']},
{id:'bedrooms',title:'Queen bedrooms',kicker:'Sleep spaces',description:'The property has three bedrooms, each with a queen bed and closet. These photographs show the two clearly documented queen rooms and their nautical details.',images:['IMG_9787.jpeg','IMG_9788.jpeg','IMG_9789.jpeg','IMG_9790.jpeg','IMG_9791.jpeg','IMG_9792.jpeg','IMG_9793.jpeg','IMG_9794.jpeg','IMG_9795.jpeg','IMG_9796.jpeg']},
{id:'patio-hot-tub',title:'Patio, hot tub and outdoor hangouts',kicker:'After the day trip',description:'A private seven-person hot tub, fire pit, outdoor furniture, grill and deck or patio give the house several ways to end the day without driving anywhere else.',images:['IMG_9806.png','IMG_9807.jpeg','IMG_9815.png']}
];

const allPlaces=[...restaurants.map(x=>({...x,kind:'restaurant'})),...shops.map(x=>({...x,kind:'shop',price:'',tags:[x.type]}))];
let selectedTraveler=localStorage.getItem('tcTraveler')||'Everyone';
let favorites=JSON.parse(localStorage.getItem('tcFavoritesV2')||'[]');
let plan=JSON.parse(localStorage.getItem('tcPlanV2')||'{"morning":[],"afternoon":[],"evening":[]}');
let activeRestaurantTags=[];
const dialog=document.getElementById('travelerDialog');
const toast=document.getElementById('toast');

function showTab(name){document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===name));document.querySelectorAll('.bottom-nav [data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.preset){activeRestaurantTags=[b.dataset.preset];renderRestaurantChips();renderRestaurants();}showTab(b.dataset.tab);}));
document.getElementById('enterApp').addEventListener('click',()=>{document.getElementById('landing').hidden=true;document.getElementById('appShell').hidden=false;showTab('home');});

function renderTravelers(){document.getElementById('travelerGrid').innerHTML=travelers.map(t=>`<button class="traveler-option" data-traveler="${t.name}"><span>${t.icon}</span><strong>${t.name}</strong><small>${t.note}</small></button>`).join('');document.getElementById('travelerStrip').innerHTML=travelers.map(t=>`<button class="traveler-chip ${selectedTraveler===t.name?'active':''}" data-traveler="${t.name}">${t.icon} ${t.name}</button>`).join('');document.getElementById('profilePill').textContent=selectedTraveler==='Everyone'?'Choose traveler':`${selectedTraveler}'s view`;document.querySelectorAll('[data-traveler]').forEach(btn=>btn.addEventListener('click',()=>chooseTraveler(btn.dataset.traveler)));}
function chooseTraveler(name){selectedTraveler=name;localStorage.setItem('tcTraveler',name);renderTravelers();renderRestaurants();renderShops();if(dialog.open)dialog.close();showToast(name==='Everyone'?'Showing choices for everyone.':`Showing stronger matches for ${name}.`);}

function renderRestaurantChips(){document.querySelectorAll('#restaurantChips button').forEach(btn=>btn.classList.toggle('active',activeRestaurantTags.includes(btn.dataset.tag)));}
document.querySelectorAll('#restaurantChips button').forEach(btn=>btn.addEventListener('click',()=>{const tag=btn.dataset.tag;activeRestaurantTags=activeRestaurantTags.includes(tag)?activeRestaurantTags.filter(x=>x!==tag):[...activeRestaurantTags,tag];renderRestaurantChips();renderRestaurants();}));

function placeCard(p){const isSaved=favorites.includes(p.id);const fits=selectedTraveler!=='Everyone'&&p.fit?.includes(selectedTraveler);const tagMarkup=(p.tags||[p.type]).slice(0,5).map(t=>`<span class="tag">${t.replaceAll('-',' ')}</span>`).join('');return `<article class="place-card"><div class="icon-badge">${p.icon}</div><h3>${p.name}</h3><div class="place-sub">${p.town}${p.price?` · ${p.price}`:''}${fits?' · Strong match':''}</div><p>${p.summary}</p><div class="tag-row">${tagMarkup}</div>${p.menu?`<div class="menu-examples"><strong>Menu examples:</strong> ${p.menu}<br><small>Menus and prices can change. Check the official site before going.</small></div>`:''}<div class="card-actions"><a href="${p.url}" target="_blank" rel="noopener">Official site ↗</a><button class="save-place ${isSaved?'active':''}" data-save="${p.id}">${isSaved?'♥ Saved':'♡ Save'}</button></div></article>`;}
function renderRestaurants(){const q=document.getElementById('restaurantSearch').value.toLowerCase().trim();const town=document.getElementById('restaurantTown').value;const price=document.getElementById('restaurantPrice').value;let results=restaurants.filter(r=>town==='all'||r.town===town).filter(r=>price==='all'||r.price===price).filter(r=>activeRestaurantTags.every(tag=>r.tags.includes(tag))).filter(r=>`${r.name} ${r.town} ${r.summary} ${r.menu} ${r.tags.join(' ')}`.toLowerCase().includes(q));if(selectedTraveler!=='Everyone')results.sort((a,b)=>Number(b.fit.includes(selectedTraveler))-Number(a.fit.includes(selectedTraveler)));document.getElementById('restaurantResultsNote').textContent=`${results.length} restaurant${results.length===1?'':'s'} match your current filters.`;document.getElementById('restaurantGrid').innerHTML=results.length?results.map(placeCard).join(''):'<p>No exact matches. Remove one filter and the dinner universe will reopen.</p>';attachSaveButtons();}
function renderShops(){const q=document.getElementById('shopSearch').value.toLowerCase().trim();const town=document.getElementById('shopTown').value;const type=document.getElementById('shopType').value;let results=shops.filter(s=>town==='all'||s.town===town).filter(s=>type==='all'||s.type===type).filter(s=>`${s.name} ${s.town} ${s.type} ${s.summary}`.toLowerCase().includes(q));if(selectedTraveler!=='Everyone')results.sort((a,b)=>Number(Boolean(b.fit?.includes(selectedTraveler)))-Number(Boolean(a.fit?.includes(selectedTraveler))));document.getElementById('shopGrid').innerHTML=results.length?results.map(placeCard).join(''):'<p>No matches yet. Try another town or treasure type.</p>';attachSaveButtons();}
function attachSaveButtons(){document.querySelectorAll('[data-save]').forEach(btn=>btn.addEventListener('click',()=>toggleFavorite(btn.dataset.save)));}
function toggleFavorite(id){favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];localStorage.setItem('tcFavoritesV2',JSON.stringify(favorites));renderRestaurants();renderShops();renderPlanner();updateStats();showToast(favorites.includes(id)?'Saved to the family shortlist.':'Removed from saved places.');}

function plannerCard(p){return `<div class="planner-card" draggable="true" data-id="${p.id}"><strong>${p.icon} ${p.name}</strong><small>${p.town}${p.price?` · ${p.price}`:''}</small></div>`;}
function renderPlanner(){const planned=Object.values(plan).flat();const available=allPlaces.filter(p=>favorites.includes(p.id)&&!planned.includes(p.id));document.getElementById('plannerIdeas').innerHTML=available.length?available.map(plannerCard).join(''):'<small>Save restaurants or shops to fill this tray.</small>';['morning','afternoon','evening'].forEach(slot=>{document.getElementById(slot).innerHTML=plan[slot].map(id=>allPlaces.find(p=>p.id===id)).filter(Boolean).map(plannerCard).join('');});attachDrag();updateStats();}
function attachDrag(){document.querySelectorAll('.planner-card').forEach(card=>card.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',card.dataset.id)));document.querySelectorAll('.drop-zone').forEach(zone=>{zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('drag-over')});zone.addEventListener('dragleave',()=>zone.classList.remove('drag-over'));zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('drag-over');const id=e.dataTransfer.getData('text/plain');Object.keys(plan).forEach(k=>plan[k]=plan[k].filter(x=>x!==id));plan[zone.id].push(id);savePlan();});});document.getElementById('plannerIdeas').addEventListener('dragover',e=>e.preventDefault());document.getElementById('plannerIdeas').addEventListener('drop',e=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain');Object.keys(plan).forEach(k=>plan[k]=plan[k].filter(x=>x!==id));savePlan();});}
function savePlan(){localStorage.setItem('tcPlanV2',JSON.stringify(plan));renderPlanner();showToast('Day plan updated.');}
function updateStats(){document.getElementById('favoriteCount').textContent=favorites.length;document.getElementById('plannedCount').textContent=Object.values(plan).flat().length;}
function updateCountdown(){const diff=Math.max(0,new Date('2026-08-23T16:00:00')-new Date());document.getElementById('days').textContent=Math.floor(diff/86400000);document.getElementById('hours').textContent=Math.floor(diff%86400000/3600000);document.getElementById('minutes').textContent=Math.floor(diff%3600000/60000);}
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2300);}

function renderHouseGalleries(){
  const root=document.getElementById('houseGalleries');
  root.innerHTML=houseGalleryData.map(g=>`<section class="gallery-section" data-gallery="${g.id}" data-index="0"><div class="gallery-head"><div><p class="eyebrow dark">${g.kicker}</p><h3>${g.title}</h3><p>${g.description}</p></div><span class="gallery-count">1 / ${g.images.length}</span></div><div class="gallery-stage"><img src="Assets/Assets/Images/${g.images[0]}" alt="${g.title} photo 1" data-open-photo><button class="gallery-control prev" aria-label="Previous photo">‹</button><button class="gallery-control next" aria-label="Next photo">›</button><div class="gallery-caption"><strong>${g.title}</strong><small>Swipe or use arrows</small></div></div><div class="gallery-thumbs">${g.images.map((img,i)=>`<button class="gallery-thumb ${i===0?'active':''}" data-thumb="${i}" aria-label="View ${g.title} photo ${i+1}"><img src="Assets/Assets/Images/${img}" alt=""></button>`).join('')}</div></section>`).join('');
  root.querySelectorAll('.gallery-section').forEach(section=>{
    const id=section.dataset.gallery;
    const gallery=houseGalleryData.find(g=>g.id===id);
    const stage=section.querySelector('.gallery-stage');
    const update=(nextIndex)=>{
      const count=gallery.images.length;
      const normalized=(nextIndex+count)%count;
      section.dataset.index=normalized;
      const img=section.querySelector('.gallery-stage img');
      img.src=`Assets/Assets/Images/${gallery.images[normalized]}`;
      img.alt=`${gallery.title} photo ${normalized+1}`;
      section.querySelector('.gallery-count').textContent=`${normalized+1} / ${count}`;
      section.querySelectorAll('.gallery-thumb').forEach((thumb,i)=>thumb.classList.toggle('active',i===normalized));
      section.querySelector('.gallery-thumbs').children[normalized]?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    };
    section.querySelector('.prev').addEventListener('click',()=>update(Number(section.dataset.index)-1));
    section.querySelector('.next').addEventListener('click',()=>update(Number(section.dataset.index)+1));
    section.querySelectorAll('[data-thumb]').forEach(btn=>btn.addEventListener('click',()=>update(Number(btn.dataset.thumb))));
    let startX=0;
    stage.addEventListener('touchstart',e=>startX=e.changedTouches[0].clientX,{passive:true});
    stage.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-startX;if(Math.abs(delta)>45)update(Number(section.dataset.index)+(delta<0?1:-1));},{passive:true});
    section.querySelector('[data-open-photo]').addEventListener('click',()=>openPhoto(gallery,Number(section.dataset.index)));
  });
}
function openPhoto(gallery,index){const photoDialog=document.getElementById('photoDialog');document.getElementById('dialogPhoto').src=`Assets/Assets/Images/${gallery.images[index]}`;document.getElementById('dialogCaption').textContent=`${gallery.title} · photo ${index+1} of ${gallery.images.length}`;photoDialog.showModal();}

document.getElementById('profilePill').addEventListener('click',()=>dialog.showModal());
document.querySelector('#travelerDialog .dialog-close').addEventListener('click',()=>dialog.close());
document.querySelector('.photo-close').addEventListener('click',()=>document.getElementById('photoDialog').close());
document.getElementById('clearPlan').addEventListener('click',()=>{plan={morning:[],afternoon:[],evening:[]};savePlan();});
['restaurantSearch','restaurantTown','restaurantPrice'].forEach(id=>document.getElementById(id).addEventListener('input',renderRestaurants));
['shopSearch','shopTown','shopType'].forEach(id=>document.getElementById(id).addEventListener('input',renderShops));
renderTravelers();renderRestaurantChips();renderRestaurants();renderShops();renderPlanner();renderHouseGalleries();updateStats();updateCountdown();setInterval(updateCountdown,60000);