// The public website's routes — the azion.com-style landing pages and the
// developer documentation, everything that renders in SiteLayout's sidebar-less
// shell rather than the console's. Mounted under `/site`.
//
// The Hub lives under the same `/site` prefix but is its own area (its own shell,
// its own navigation): see ./hub.routes.js.

import AzionDocs from '@site/docs/views/AzionDocs.vue'
import LandingAzion from '@site/views/LandingAzion.vue'
import LandingFunctions from '@site/views/LandingFunctions.vue'

export const siteRoutes = [
  // Segregated marketing router: landing-page examples that render in the
  // sidebar-less SiteLayout (azion.com-style website nav + footer), separate
  // from the console app shell used by every other route.
  { path: '/site', redirect: '/site/home' },
  { path: '/site/home', name: 'site-home', component: LandingAzion },
  // A product page in the same shell: one product's argument, where /site/home is the
  // platform's. The Products mega-menu's Functions entry points here.
  { path: '/site/functions', name: 'site-functions', component: LandingFunctions },
  { path: '/site/docs', name: 'site-docs', component: AzionDocs }
]
