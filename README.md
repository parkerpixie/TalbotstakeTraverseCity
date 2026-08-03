# Talbot's Take Traverse City

A private family trip-planning app for the Talbots' August 23–27, 2026 getaway on West Bay. Part of the CapyQueue app family.

## Current features

- Live countdown to check-in
- Traveler personalization for Parker, Blake, Porter, Mark, and Nancy
- Searchable and filterable restaurants, shops, and activities
- Shared favorites and heart rankings
- House and bedroom galleries
- Flexible morning, afternoon, and evening itinerary planning
- Responsive mobile-first design
- Installable PWA experience

## Brand system

The app now uses the T³C otter identity for Talbot's Take Traverse City, including:

- Horizontal and stacked logos
- T³C otter monogram and app icon
- PWA, maskable, Apple touch, and favicon exports
- Mascot lockup, ecosystem pattern, watermark, and swoosh divider
- Ink Black, Ivory, Slate, and Cherry Red visual styling

Brand assets are stored at the repository root using the `tttc-` filename prefix. The asset inventory is documented in `tttc-asset-manifest.csv`.

## Primary application files

- `index.html` — page structure and content
- `styles.css` — core responsive design
- `app.js` — countdown, filters, personalization, and favorites
- `navigation-ux.js` — navigation and progressive enhancement loader
- `brand-refresh.js` — T³C otter identity integration
- `brand-refresh.css` — T³C colors and brand presentation
- `manifest.webmanifest` — installable app metadata and icons
- `service-worker.js` — offline cache and asset updates
