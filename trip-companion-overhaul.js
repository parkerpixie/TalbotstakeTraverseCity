(() => {
  const VERSION = '20260820-1';
  const PARTS = [
    'trip-companion-overhaul.part-01.txt',
    'trip-companion-overhaul.part-02.txt',
    'trip-companion-overhaul.part-03.txt',
    'trip-companion-overhaul.part-04.txt',
    'trip-companion-overhaul.part-05.txt',
    'trip-companion-overhaul.part-06.txt',
    'trip-companion-overhaul.part-07.txt'
  ];

  Promise.all(PARTS.map(async path => {
    const response = await fetch(`${path}?v=${VERSION}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    return response.text();
  }))
    .then(chunks => {
      const url = URL.createObjectURL(new Blob([chunks.join('')], { type: 'text/javascript' }));
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => URL.revokeObjectURL(url);
      script.onerror = () => {
        URL.revokeObjectURL(url);
        console.error('Trip companion overhaul failed to execute.');
      };
      document.body.appendChild(script);
    })
    .catch(error => console.error('Trip companion overhaul failed to load:', error));
})();
