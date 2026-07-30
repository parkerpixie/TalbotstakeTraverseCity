(() => {
  const stage = document.querySelector('.tab-stage');
  const nav = document.querySelector('.bottom-nav');
  if (!stage || !nav || document.querySelector('[data-panel="discover"]')) return;

  const panel = document.createElement('section');
  panel.className = 'tab-panel';
  panel.dataset.panel = 'discover';
  panel.innerHTML = `
    <div class="field-guide-page">
      <section class="field-guide-hero">
        <img src="Assets/Assets/Images/IMG_9799.jpeg" alt="West Grand Traverse Bay shoreline" />
        <div class="field-guide-hero-copy">
          <span class="field-guide-kicker">🧭 Northern Michigan Field Guide</span>
          <h2>The landscape has a plot.</h2>
          <p>This is not merely a lake town with a large pile of sand. Northern Michigan is a living collision of glacial engineering, freshwater physics, Anishinaabe homelands, fossil seas, maritime danger, logging booms, experimental agriculture, working fisheries, and dunes that are still walking across the land.</p>
        </div>
      </section>

      <section class="guide-section porter-hook">
        <div>
          <p class="eyebrow">For Porter + Blake</p>
          <h3>What are we actually going there to see?</h3>
          <p>Evidence. The trip is a field investigation. The bays are flooded glacial basins. The high bluffs are piles of debris left by ice. The dune sand is being sorted grain by grain by wind. The islands preserve ancient travel routes and shipwreck stories. The blue stones at Leland are industrial waste turned regional treasure. Even the cherry orchards are a climate experiment conducted by the lake.</p>
        </div>
        <div class="mission-list">
          <div class="mission">🧊 Spot a glacial moraine</div>
          <div class="mission">🪨 Identify quartz or magnetite in dune sand</div>
          <div class="mission">🌊 Compare shallow and deep-water color</div>
          <div class="mission">🎣 See a working commercial fish tug</div>
          <div class="mission">🔵 Find authentic Leland Blue slag</div>
          <div class="mission">🌳 Find a forest growing on old dunes</div>
          <div class="mission">🚢 Learn one local shipwreck story</div>
          <div class="mission">🍒 Explain the lake-effect orchard climate</div>
        </div>
      </section>

      <section class="guide-section">
        <div class="guide-section-head"><div><p class="eyebrow dark">Deep time</p><h3>Before Michigan had dunes, it had a tropical sea</h3></div><p>The area's youngest landforms sit on top of a much older geological story. Northern Michigan has been radically different worlds at different points in Earth history.</p></div>
        <div class="guide-card-grid">
          <article class="guide-card"><span class="guide-icon">🪸</span><h4>About 350 million years ago</h4><p>During the Devonian Period, the region lay beneath a warm, shallow sea. Colonial coral called <em>Hexagonaria percarinata</em> lived there. Its fossilized skeletons became Petoskey stones, Michigan's state stone.</p></article>
          <article class="guide-card"><span class="guide-icon">🧊</span><h4>The last 2 million years</h4><p>Continental ice sheets repeatedly advanced and retreated. They did not simply scrape the surface. They widened older river valleys into the Great Lakes basins and transported rock from far away.</p></article>
          <article class="guide-card"><span class="guide-icon">📏</span><h4>Ice roughly 1,200 feet thick</h4><p>The National Park Service estimates ice over the Sleeping Bear area reached about 1,200 feet thick. The weight depressed Earth's crust while the moving base acted like a conveyor belt full of stone.</p></article>
          <article class="guide-card"><span class="guide-icon">🌱</span><h4>A geologically newborn coast</h4><p>The last glacier left this area about 11,800 years ago. Nearly every bluff, inland lake, beach, dune, and drainage channel you see is younger than human civilization.</p></article>
        </div>
      </section>

      <section class="guide-section">
        <div class="guide-section-head"><div><p class="eyebrow dark">Glacial engineering</p><h3>How ice assembled the map</h3></div><p>A glacier flows under its own weight. Rock frozen into its underside grinds the landscape, while debris released during melting forms ridges, hills, and irregular terrain.</p></div>
        <div class="ice-story">
          <div class="ice-visual"><img src="Assets/Assets/Images/IMG_9814.jpeg" alt="Grand Traverse Bay and glacial terrain" /></div>
          <div class="timeline">
            <div class="timeline-step"><strong>1 · Excavation</strong><p>Flowing ice deepened pre-existing river valleys. When the ice melted, those excavated basins filled with meltwater and became the Great Lakes.</p></div>
            <div class="timeline-step"><strong>2 · Transport</strong><p>The glacier carried clay, sand, gravel, cobbles, and boulders. Some local stones therefore began their journey hundreds of miles north.</p></div>
            <div class="timeline-step"><strong>3 · Moraines</strong><p>When ice movement and melting briefly balanced, debris accumulated along the glacier's edge. These ridges are moraines. Empire Bluff, Pyramid Point, and the Sleeping Bear Plateau are built on them.</p></div>
            <div class="timeline-step"><strong>4 · Kettles</strong><p>Detached ice blocks were buried in sediment. When those blocks eventually melted, the ground collapsed into bowl-shaped depressions called kettles.</p></div>
            <div class="timeline-step"><strong>5 · Stranded lakes</strong><p>North Bar, South Bar, Glen, and Platte Lakes were once connected more directly to ancestral Lake Michigan. Shore currents moved sand across their openings as water levels changed.</p></div>
            <div class="timeline-step"><strong>6 · Ongoing rebound</strong><p>The Great Lakes region is still slowly responding to the disappearance of the ice load. Earth's crust continues adjusting, a process called glacial isostatic rebound.</p></div>
          </div>
        </div>
      </section>

      <section class="guide-section">
        <div class="guide-section-head"><div><p class="eyebrow dark">Dune mechanics</p><h3>Sleeping Bear is a moving machine</h3></div><p>The famous dunes are not one uniform sand pile. They include beach dunes, perched dunes, falling dunes, and de-perched dunes, each produced by a different relationship among lake, bluff, wind, and gravity.</p></div>
        <div class="guide-card-grid">
          <article class="guide-card"><span class="guide-icon">🏔️</span><h4>Perched dunes</h4><p>A relatively thin mantle of windblown sand sits on top of a much thicker glacial moraine. That is why some dune viewpoints rise roughly 450 to 460 feet above Lake Michigan.</p></article>
          <article class="guide-card"><span class="guide-icon">💨</span><h4>Saltation</h4><p>Most sand moves by bouncing. Wind lifts a grain, it strikes another grain, and the collision launches the next one. The chain reaction creates a low haze of moving sand.</p></article>
          <article class="guide-card"><span class="guide-icon">📐</span><h4>34-degree limit</h4><p>Dry loose sand naturally piles to an angle of about 34 degrees, called the angle of repose. Add more sand and the slope sheds grains in miniature avalanches.</p></article>
          <article class="guide-card"><span class="guide-icon">🚶</span><h4>About four feet per year</h4><p>NPS measurements say the active dune near the Dune Climb has advanced at an average of roughly four feet per year in recent years. It can bury vegetation, roads, and even utility poles.</p></article>
          <article class="guide-card"><span class="guide-icon">🧲</span><h4>Sand is a mineral collection</h4><p>Quartz dominates because it resists weathering. Look closely for black magnetite and hornblende, pink or white feldspar, red garnet, and green epidote.</p></article>
          <article class="guide-card"><span class="guide-icon">👻</span><h4>Ghost forests</h4><p>Moving dunes can swallow mature trees. Later erosion exposes their dead trunks and buried soil layers, recording alternating periods of stability and movement.</p></article>
          <article class="guide-card"><span class="guide-icon">🌾</span><h4>Plants are dune engineers</h4><p>Beachgrass slows wind and traps sand. Cottonwood, sand cherry, and other pioneer plants help build soil. Given enough stability, an entire forest can establish on former open dune.</p></article>
          <article class="guide-card"><span class="guide-icon">🌊</span><h4>The lake feeds the bluff</h4><p>Waves erode the base of moraine headlands. Wind then sorts the exposed material, carrying lighter sand upward while heavier stones roll toward the beach.</p></article>
        </div>
      </section>

      <section class="guide-section">
        <div class="guide-section-head"><div><p class="eyebrow dark">Freshwater optics</p><h3>Why does Lake Michigan sometimes look Caribbean?</h3></div><p>The color is real, but it is not caused by tropical reef water. It is the combined result of light, depth, weather, suspended particles, and the color of the lake bottom.</p></div>
        <div class="water-lab">
          <div class="water-photo"><img src="Assets/Assets/Images/IMG_9799.jpeg" alt="Clear blue water of West Grand Traverse Bay" /><span class="photo-label">Same lake, different light</span></div>
          <div class="water-facts">
            <div class="water-fact"><strong>Shallow sand reflects light</strong><p>Pale sand sends more light back toward your eyes, making nearshore water appear aqua or turquoise.</p></div>
            <div class="water-fact"><strong>Water absorbs red first</strong><p>As light travels through water, longer red wavelengths disappear sooner. More blue and green light remains to be scattered back.</p></div>
            <div class="water-fact"><strong>Depth darkens the palette</strong><p>Deep water absorbs more total light and may appear navy. A sharp color boundary can simply mark an underwater drop-off.</p></div>
            <div class="water-fact"><strong>Weather changes everything</strong><p>Sun angle, clouds, waves, algae, sediment, and wind can turn the same shoreline from glassy turquoise to steel gray within hours.</p></div>
            <div class="water-fact"><strong>Fresh water, ocean scale</strong><p>Lake Michigan is the only Great Lake entirely within the United States. Its surface is so large that you cannot see the opposite shore from most beaches.</p></div>
          </div>
        </div>
      </section>

      <section class="guide-section">
        <div class="guide-section-head"><div><p class="eyebrow dark">People before parks</p><h3>Anishinaabe homeland, not an empty wilderness</h3></div><p>Human history here does not begin with lumber camps or resort towns. Anishinaabe peoples, including Odawa, Ojibwe, and Potawatomi communities, have relationships with these lands and waters reaching back thousands of years.</p></div>
        <div class="bear-split">
          <article class="bear-card story"><p class="eyebrow dark">The Sleeping Bear story</p><h4>Mother bear and the islands</h4><p>In Anishinaabe oral tradition, a mother bear waits atop the bluff after crossing Lake Michigan. Her two exhausted cubs do not reach shore; the Manitou Islands mark them in the water. The story is not decorative branding. It locates the dunes inside a sacred cultural landscape and a continuing Indigenous homeland.</p></article>
          <article class="bear-card science"><p class="eyebrow dark">Treaty history</p><h4>1836 changed the map</h4><p>Odawa and Ojibwe leaders signed the Treaty of Washington amid intense pressure for their land and threats of removal west. They retained hunting, fishing, and gathering rights. The Grand Traverse Band's contemporary presence is continuity, not a historical footnote.</p></article>
        </div>
        <div class="guide-card-grid" style="margin-top:16px">
          <article class="guide-card"><span class="guide-icon">🛶</span><h4>Water was the highway</h4><p>Bays, rivers, islands, and shoreline routes connected communities long before modern roads. Fishing, maple sugaring, hunting, gathering, farming, and trade followed seasonal cycles.</p></article>
          <article class="guide-card"><span class="guide-icon">🧺</span><h4>Long-distance trade</h4><p>Archaeological evidence includes copper, flint, and shell from distant regions, showing that Great Lakes communities were part of continent-spanning exchange networks.</p></article>
          <article class="guide-card"><span class="guide-icon">🌽</span><h4>Food systems</h4><p>Anishinaabe communities cultivated corn, beans, and squash, gathered berries and maple sap, and maintained fisheries. Europeans later learned from and depended on Indigenous knowledge.</p></article>
          <article class="guide-card"><span class="guide-icon">🪶</span><h4>Living nations</h4><p>Use present tense. The Grand Traverse Band of Ottawa and Chippewa Indians remains a sovereign tribal nation with cultural, governmental, environmental, and treaty-reserved responsibilities in the region.</p></article>
        </div>
      </section>

      <section class="guide-section">
        <div class="guide-section-head"><div><p class="eyebrow dark">Boom, cut, move</p><h3>How logging remade the coast</h3></div><p>In the 1800s, forests became fuel and building material. Steamships burned cordwood, sawmills processed timber, and temporary settlements rose around docks. When the trees or markets disappeared, many communities disappeared too.</p></div>
        <div class="timeline">
          <div class="timeline-step"><strong>1826</strong><p>The Erie Canal helps turn the Great Lakes into a major route for westward migration and commerce.</p></div>
          <div class="timeline-step"><strong>1838</strong><p>A permanent Euro-American settlement develops on South Manitou Island, where its protected deepwater harbor makes it a strategic refueling and refuge stop.</p></div>
          <div class="timeline-step"><strong>1850s–1870s</strong><p>Docks, mills, tramways, and logging villages spread around Glen Haven, Port Oneida, the islands, and the mainland shore. Ships purchase wood for boilers and carry lumber to growing cities.</p></div>
          <div class="timeline-step"><strong>After 1871</strong><p>Sand and gravel from South Manitou Island help supply rebuilding after the Great Chicago Fire.</p></div>
          <div class="timeline-step"><strong>1880s–1890s</strong><p>Coal replaces cordwood on many steamships and local forests are depleted. Some lumber settlements collapse; others shift toward farming, fishing, or tourism.</p></div>
          <div class="timeline-step"><strong>Ghost towns</strong><p>Places such as Aral and Good Harbor leave foundations, roads, orchards, and stories rather than thriving town centers. The forest has reclaimed much of the industrial landscape.</p></div>
        </div>
      </section>

      <section class="guide-section">
        <div class="guide-section-head"><div><p class="eyebrow dark">Danger on the water</p><h3>The Manitou Passage was a maritime bottleneck</h3></div><p>Ships favored the protected route between the mainland and the Manitou Islands, but traffic, storms, fog, and shallow shoals made it hazardous.</p></div>
        <div class="guide-card-grid">
          <article class="guide-card"><span class="guide-icon">🗺️</span><h4>A shipping shortcut</h4><p>The passage offered a shorter, more sheltered route along Lake Michigan. South Manitou's harbor was an unusually valuable refuge for ships caught in bad weather.</p></article>
          <article class="guide-card"><span class="guide-icon">⚓</span><h4>Shipwreck coast</h4><p>Unmarked sand and gravel shoals, heavy traffic, and sudden storms wrecked many vessels. The lake can generate ocean-like waves despite being fresh water.</p></article>
          <article class="guide-card"><span class="guide-icon">🛟</span><h4>Life-Saving Service</h4><p>After severe Great Lakes losses, Congress created the U.S. Life-Saving Service in 1871. Shore crews launched rescue boats and fired lines to stranded ships with Lyle guns.</p></article>
          <article class="guide-card"><span class="guide-icon">🔦</span><h4>Lighthouses as infrastructure</h4><p>Lighthouses at strategic points did more than create scenic postcards. Their signals helped ships locate passages, avoid shoals, and identify safe harbors.</p></article>
        </div>
      </section>

      <section class="guide-section">
        <div class="guide-section-head"><div><p class="eyebrow dark">Fishtown decoded</p><h3>Those weathered shanties are industrial archaeology</h3></div><p>Fishtown survives because it remains connected to commercial fishing. Its buildings, docks, smokehouses, nets, and tugs show how a Great Lakes fishing port actually functioned.</p></div>
        <div class="guide-card-grid">
          <article class="guide-card"><span class="guide-icon">🎣</span><h4>Fishing predates the shanties</h4><p>Anishinaabe people fished here before Euro-American settlement. White settlers arrived in the early 1850s; surviving shanties date from roughly 1900 through the late twentieth century.</p></article>
          <article class="guide-card"><span class="guide-icon">⛵</span><h4>From sail to engine</h4><p>Early commercial fishers set nets from open wooden Mackinaw boats. By about 1905, gasoline engines and cabins let crews travel farther and work in rougher weather.</p></article>
          <article class="guide-card"><span class="guide-icon">🚤</span><h4>Janice Sue is not a prop</h4><p>The steel fish tug was built in Wisconsin in 1958 for Leland fisherman Louis Steffens. It remains an operational commercial vessel preserved as part of the town's working heritage.</p></article>
          <article class="guide-card"><span class="guide-icon">🐟</span><h4>Why tug cabins are enclosed</h4><p>Great Lakes fish tugs often have enclosed working decks. Crews can lift nets and handle fish with protection from cold spray, wind, and sudden weather.</p></article>
          <article class="guide-card"><span class="guide-icon">🔵</span><h4>Leland Blue is slag</h4><p>Leland operated an iron-smelting furnace from 1870 to 1885. The glassy blue-green material prized today is industrial slag, a waste product of smelting iron ore with charcoal.</p></article>
          <article class="guide-card"><span class="guide-icon">🔥</span><h4>Why the furnace failed</h4><p>High operating costs and the lack of an ideal harbor undermined the ironworks. The failed industry nevertheless changed the village and left its most collectible geological impostor.</p></article>
          <article class="guide-card"><span class="guide-icon">🧀</span><h4>Modern shops, historic shells</h4><p>Food and retail now occupy many shanties, but the compact arrangement follows the needs of fishing: boats, nets, catch processing, storage, and direct access to the river and harbor.</p></article>
          <article class="guide-card"><span class="guide-icon">👀</span><h4>What to look for</h4><p>Find net reels, weathered siding, smokehouse details, the dam, tug silhouettes, working docks, and the transition from river current to Lake Michigan harbor.</p></article>
        </div>
      </section>

      <section class="guide-section">
        <div class="guide-section-head"><div><p class="eyebrow dark">Orchard science</p><h3>Why cherries thrive near a giant cold lake</h3></div><p>Traverse City's cherry identity is not random boosterism. The peninsulas sit inside a climate buffer created by Lake Michigan and Grand Traverse Bay.</p></div>
        <div class="guide-card-grid">
          <article class="guide-card"><span class="guide-icon">❄️</span><h4>Spring delay</h4><p>Cold lake water slows spring warming near shore. Fruit buds may open later, reducing the chance that one early warm spell followed by frost destroys the crop.</p></article>
          <article class="guide-card"><span class="guide-icon">🍂</span><h4>Fall extension</h4><p>Water releases stored summer heat slowly, moderating early fall cold. This can lengthen the useful growing season around the bays.</p></article>
          <article class="guide-card"><span class="guide-icon">🏞️</span><h4>Air drainage</h4><p>Orchards on slopes can benefit when dense cold air drains downhill into lower pockets rather than settling around blossoms.</p></article>
          <article class="guide-card"><span class="guide-icon">🚂</span><h4>Technology made a crop famous</h4><p>In the 1910s, improved fertilizers and sprayers increased yields while refrigerated rail cars allowed fresh cherries to reach distant markets.</p></article>
          <article class="guide-card"><span class="guide-icon">🏭</span><h4>Glen Haven's farm experiment</h4><p>D.H. Day operated a 5,000-tree orchard, a large dairy herd, and a cannery. Processing created a dependable outlet for cherries, peaches, and raspberries.</p></article>
          <article class="guide-card"><span class="guide-icon">🧬</span><h4>Island seed laboratory</h4><p>Michigan Agricultural College used isolated South Manitou farms to grow genetically pure seed. Rosen rye and Michelite navy beans grown there spread across the Midwest.</p></article>
          <article class="guide-card"><span class="guide-icon">🫘</span><h4>Beans for wartime</h4><p>Michelite navy beans grown from island seed were distributed to farms across the region and helped feed troops during World War II.</p></article>
          <article class="guide-card"><span class="guide-icon">🚜</span><h4>A landscape of adaptation</h4><p>Many farms began on cutover logging land. Families moved among subsistence crops, potatoes, grains, dairy, orchard fruit, and outside work as markets changed.</p></article>
        </div>
      </section>

      <section class="guide-section">
        <div class="guide-section-head"><div><p class="eyebrow dark">A park made from lived-in land</p><h3>Sleeping Bear was established in 1970</h3></div><p>The National Lakeshore protects roughly 71,000 acres and about 65 miles of Lake Michigan shoreline, but its boundary includes farms, villages, docks, cemeteries, roads, and island settlements as well as dunes and forest.</p></div>
        <div class="fact-ribbon">
          <div class="fact-pill"><span>📅</span><strong>October 21, 1970</strong><small>Congress established Sleeping Bear Dunes National Lakeshore.</small></div>
          <div class="fact-pill"><span>📐</span><strong>About 71,210 acres</strong><small>Mainland units plus North and South Manitou Islands.</small></div>
          <div class="fact-pill"><span>🌊</span><strong>About 65 shoreline miles</strong><small>Beaches, bluffs, bays, river mouths, and island coast.</small></div>
          <div class="fact-pill"><span>⬆️</span><strong>Up to about 460 feet</strong><small>Some dune bluffs rise dramatically above Lake Michigan.</small></div>
        </div>
        <p class="field-guide-note">The park's creation was controversial because preservation required acquiring private property. Today's protected landscape is therefore both a conservation achievement and a place carrying memories of families who lived, worked, and farmed there.</p>
      </section>

      <section class="guide-section">
        <div class="guide-section-head"><div><p class="eyebrow dark">Look closer</p><h3>Field clues to notice during the trip</h3></div><p>Once you know the clues, the entire region becomes readable.</p></div>
        <div class="guide-card-grid">
          <article class="guide-card"><span class="guide-icon">🪨</span><h4>Rounded beach stones</h4><p>Repeated wave collisions smooth edges. Different colors reveal different source rocks transported by glaciers.</p></article>
          <article class="guide-card"><span class="guide-icon">🌲</span><h4>Forest-age changes</h4><p>Open dunes, scrub, young pine, and mature beech-maple forest can represent stages in ecological succession.</p></article>
          <article class="guide-card"><span class="guide-icon">〰️</span><h4>Sand ripples</h4><p>The gentle side faces into the wind; the steeper slip face lies downwind. A ripple is a tiny map of recent airflow.</p></article>
          <article class="guide-card"><span class="guide-icon">🕳️</span><h4>Kettle topography</h4><p>Odd depressions and small lakes may mark places where buried blocks of glacial ice melted.</p></article>
          <article class="guide-card"><span class="guide-icon">🏚️</span><h4>Orchards in the woods</h4><p>Rows of old apple trees, lilacs, foundations, and stone piles can reveal a former farm even after forest returns.</p></article>
          <article class="guide-card"><span class="guide-icon">🌬️</span><h4>Flagged trees</h4><p>Branches growing mainly on one side expose the direction and persistence of shoreline winds.</p></article>
          <article class="guide-card"><span class="guide-icon">🦅</span><h4>Freshwater food web</h4><p>Watch for gulls, terns, bald eagles, waterfowl, fish, insects, and dune plants connected through the lake-edge ecosystem.</p></article>
          <article class="guide-card"><span class="guide-icon">🏘️</span><h4>Town geometry</h4><p>Docks, river mouths, rail lines, sheltered harbors, and road bends often explain why a settlement formed exactly where it did.</p></article>
        </div>
      </section>

      <section class="guide-section">
        <div class="guide-section-head"><div><p class="eyebrow dark">Primary sources</p><h3>Keep digging</h3></div><p>These official and preservation sources support the field guide and offer deeper dives for the family history-and-science brain trust.</p></div>
        <div class="source-links">
          <a href="https://www.nps.gov/slbe/learn/nature/sand-dune-geology.htm" target="_blank" rel="noopener">NPS · Sand dune geology</a>
          <a href="https://www.nps.gov/slbe/learn/nature/glaciers.htm" target="_blank" rel="noopener">NPS · Glacial features</a>
          <a href="https://www.nps.gov/slbe/learn/historyculture/story-of-sleeping-bear-dunes.htm" target="_blank" rel="noopener">NPS · Sleeping Bear story</a>
          <a href="https://www.nps.gov/slbe/learn/historyculture/index.htm" target="_blank" rel="noopener">NPS · History and culture</a>
          <a href="https://www.nps.gov/articles/000/evolution-of-agriculture-at-sleeping-bear-dunes.htm" target="_blank" rel="noopener">NPS · Agriculture</a>
          <a href="https://www.nps.gov/slbe/learn/historyculture/pohistory.htm" target="_blank" rel="noopener">NPS · Port Oneida</a>
          <a href="https://www.fishtownmi.org/what-is-fishtown/faq/" target="_blank" rel="noopener">Fishtown Preservation · FAQ</a>
          <a href="https://www.fishtownmi.org/visit/tugs/" target="_blank" rel="noopener">Fishtown Preservation · Fish tugs</a>
          <a href="https://www.fishtownmi.org/2024/04/leland-blue-and-the-iron-works-history/" target="_blank" rel="noopener">Fishtown · Leland Blue</a>
          <a href="https://www.gtbindians.org/" target="_blank" rel="noopener">Grand Traverse Band</a>
        </div>
      </section>
    </div>`;

  const planner = stage.querySelector('[data-panel="planner"]');
  stage.insertBefore(panel, planner || null);

  const button = document.createElement('button');
  button.dataset.tab = 'discover';
  button.innerHTML = '<span>🧊</span><small>Field Guide</small>';
  const plannerButton = nav.querySelector('[data-tab="planner"]');
  nav.insertBefore(button, plannerButton || null);

  const openDiscover = (event) => {
    const trigger = event.target.closest('[data-tab="discover"]');
    if (!trigger) return;
    document.querySelectorAll('.tab-panel').forEach(item => item.classList.toggle('active', item.dataset.panel === 'discover'));
    document.querySelectorAll('.bottom-nav [data-tab]').forEach(item => item.classList.toggle('active', item.dataset.tab === 'discover'));
    requestAnimationFrame(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  document.addEventListener('click', openDiscover);
})();