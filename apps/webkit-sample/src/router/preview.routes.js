// The deck preview's routes — `/preview`, its own area.
//
// A fourth area beside site / hub / console, and not a page of any of them: it has its own
// shell (a fixed 1920x1080 artboard scaled to fit, plus its own chrome), it pins the dark
// theme while mounted, and it exists to be read off rather than navigated. Keeping it here
// means adding or renaming a deck route touches this file and nothing else.
//
// TWO ROUTES, not one view with a mode. Reviewing and presenting are different surfaces with
// different jobs, and giving the presentation its own URL is what makes a slide addressable
// (`/preview/present/14` opens on slide 14), what lets a reload come back to it, and what gives
// Escape somewhere to go — back to the deck — instead of unwinding a boolean the browser's own
// back button knows nothing about.

import DeckPresent from '@preview/views/DeckPresent.vue'
import DeckPreview from '@preview/views/DeckPreview.vue'

export const previewRoutes = [
  { path: '/preview', name: 'preview', component: DeckPreview },
  // The slide number is 1-BASED, because it is read and typed by people: it matches the number
  // printed under the slide in the grid. `/preview/present` with no number opens on the first.
  { path: '/preview/present', redirect: '/preview/present/1' },
  { path: '/preview/present/:slide', name: 'preview-present', component: DeckPresent }
]
