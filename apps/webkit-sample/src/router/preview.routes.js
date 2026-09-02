// The deck preview's route — `/preview`, its own area.
//
// A fourth area beside site / hub / console, and not a page of any of them: it has its own
// shell (a fixed 1920x1080 artboard scaled to fit, plus its own chrome), it pins the dark
// theme while mounted, and it exists to be read off rather than navigated. Keeping it here
// means adding or renaming a deck route touches this file and nothing else.

import DeckPreview from '@preview/views/DeckPreview.vue'

export const previewRoutes = [{ path: '/preview', name: 'preview', component: DeckPreview }]
