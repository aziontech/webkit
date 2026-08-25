// The public website's routes — the azion.com-style landing pages and the
// developer documentation, everything that renders in SiteLayout's sidebar-less
// shell rather than the console's. Mounted under `/site`.
//
// The Hub lives under the same `/site` prefix but is its own area (its own shell,
// its own navigation): see ./hub.routes.js.

import AzionDocs from '@site/docs/views/AzionDocs.vue'
import AzionDocsAgentSetup from '@site/docs/views/AzionDocsAgentSetup.vue'
import AzionDocsFirstDeploy from '@site/docs/views/AzionDocsFirstDeploy.vue'
import LandingAzion from '@site/views/LandingAzion.vue'
import LandingFunctions from '@site/views/LandingFunctions.vue'
import LandingPricing from '@site/views/LandingPricing.vue'

export const siteRoutes = [
  // Segregated marketing router: landing-page examples that render in the
  // sidebar-less SiteLayout (azion.com-style website nav + footer), separate
  // from the console app shell used by every other route.
  { path: '/site', redirect: '/site/home' },
  { path: '/site/home', name: 'site-home', component: LandingAzion },
  // A product page in the same shell: one product's argument, where /site/home is the
  // platform's. The Products mega-menu's Functions entry points here.
  { path: '/site/functions', name: 'site-functions', component: LandingFunctions },
  // The pricing page in the same shell: the three tiers, the full feature matrix, and the
  // FAQ. The website nav's `Pricing` entry points here.
  { path: '/site/pricing', name: 'site-pricing', component: LandingPricing },
  { path: '/site/docs', name: 'site-docs', component: AzionDocs },
  // A docs reading page COMPOSED in Vue: prose, but with a filtering tool picker and
  // cards carrying other vendors' real marks — neither of which MDX can express. Every
  // block in it still comes from @aziontech/webkit-docs.
  {
    path: '/site/docs/agent-setup',
    name: 'site-docs-agent-setup',
    component: AzionDocsAgentSetup
  },
  // A docs READING page, written as `.mdx` and rendered by @aziontech/webkit-docs —
  // the other half of the docs example. /site/docs is the hand-composed landing.
  {
    path: '/site/docs/first-deploy',
    name: 'site-docs-first-deploy',
    component: AzionDocsFirstDeploy
  }
]
