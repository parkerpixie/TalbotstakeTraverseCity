(() => {
  const additions = [
    {
      id: 'raven-hill-discovery',
      name: 'Raven Hill Discovery Center',
      town: 'East Jordan',
      area: 'East Jordan / Charlevoix County',
      type: 'family',
      icon: '🔬',
      url: 'https://miravenhill.org/',
      image: 'Raven HIll Discovery Center.jpeg',
      duration: '2–3 hours',
      tags: ['indoor', 'outdoor', 'rainy-day', 'interactive', 'animals-nature', 'science-discovery', 'low-energy', 'unique-offbeat'],
      fit: ['Porter', 'Parker', 'Blake'],
      dog: 'Pet policy not confirmed — check before bringing Luna and Ozzy',
      summary: 'Hands-on science, history and art with interactive museum exhibits, an animal room, outdoor exhibits and nature trails. Typical visits run about 2–3 hours. Summer hours during our trip: weekdays 10–4, Saturday noon–4, Sunday 2–4. Admission is $10 per person.'
    },
    {
      id: 'boardman-river-nature-center',
      name: 'Boardman River Nature Center',
      town: 'Traverse City',
      area: 'Traverse City / Boardman River',
      type: 'family',
      icon: '🦦',
      url: 'https://natureiscalling.org/boardman-river-nature-center',
      image: 'Boardman Nature River Center.jpeg',
      duration: '1–2 hours',
      tags: ['indoor', 'outdoor', 'rainy-day', 'interactive', 'animals-nature', 'science-discovery', 'low-energy'],
      fit: ['Porter', 'Parker', 'Mark', 'Nancy'],
      dog: 'Pet policy not confirmed — check before bringing Luna and Ozzy',
      summary: 'Interactive Michigan wildlife and plant exhibits beside the Boardman River, plus a nature playscape and access to the surrounding Natural Education Reserve. Open Tuesday–Friday 10–4 with a suggested $5 donation. Some reserve trails remain closed after the April 2026 flooding, so check current trail status before planning a longer walk.'
    },
    {
      id: 'guntzviller-spirit-woods',
      name: "Guntzviller's Spirit of the Woods Museum",
      town: 'Williamsburg',
      area: 'Williamsburg / 2 miles south of Elk Rapids',
      type: 'history',
      icon: '🦌',
      url: 'http://www.northernmichigantaxidermy.com/',
      image: 'GuntzViller Taxidery Museum.jpg',
      duration: '1–1.5 hours',
      tags: ['indoor', 'rainy-day', 'animals-nature', 'low-energy', 'unique-offbeat', 'history'],
      fit: ['Porter', 'Parker', 'Blake', 'Mark'],
      dog: 'Pet policy not confirmed — check before bringing Luna and Ozzy',
      summary: 'A wonderfully oddball northern Michigan stop with taxidermy dioramas of Michigan wildlife, a large collection of regional Native American artifacts, antique hunting and fishing gear, and a gift shop. Listed summer hours are Monday–Saturday 9–5.'
    }
  ];

  if (typeof activities === 'undefined' || !Array.isArray(activities) || typeof allPlaces === 'undefined' || !Array.isArray(allPlaces)) return;

  additions.forEach(place => {
    if (!activities.some(existing => existing.id === place.id)) activities.push(place);
    if (!allPlaces.some(existing => existing.id === place.id)) {
      allPlaces.push({ ...place, kind: 'activity', price: '', tags: place.tags || [] });
    }
  });

  const townFilter = document.getElementById('activityTown');
  ['East Jordan', 'Williamsburg'].forEach(town => {
    if (townFilter && ![...townFilter.options].some(option => option.value === town)) {
      const option = document.createElement('option');
      option.value = town;
      option.textContent = town;
      townFilter.appendChild(option);
    }
  });

  if (typeof renderActivities === 'function') renderActivities();
  if (typeof renderPlanner === 'function') renderPlanner();
  if (typeof updateStats === 'function') updateStats();

  document.dispatchEvent(new CustomEvent('tc-places-ready', { detail: { source: 'porter-place-additions' } }));
})();
