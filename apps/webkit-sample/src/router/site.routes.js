// The public website's routes — the azion.com-style landing pages and the
// developer documentation, everything that renders in SiteLayout's sidebar-less
// shell rather than the console's. Mounted under `/site`.
//
// The Hub lives under the same `/site` prefix but is its own area (its own shell,
// its own navigation): see ./hub.routes.js.

import { agentBySlug } from '@site/docs/lib/docs-agent-setup.js'
import { hasDocsPage } from '@site/docs/lib/docs-pages.js'
import AzionDocs from '@site/docs/views/AzionDocs.vue'
import AzionDocsAgentPage from '@site/docs/views/AzionDocsAgentPage.vue'
import AzionDocsAgentSetup from '@site/docs/views/AzionDocsAgentSetup.vue'
import AzionDocsPage from '@site/docs/views/AzionDocsPage.vue'
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
  // ONE SETUP PAGE PER AGENT, from one route and one view — the index's card grid opens
  // these. Composed rather than written as MDX for the same reason the index is: the
  // closing "Other agents" grid draws six other companies' real logos, which are inline
  // SVG and therefore a slot. A slug with no agent behind it would render an empty page,
  // so it goes back to the index rather than to a blank column with a full rail beside it.
  {
    path: '/site/docs/agent-setup/:agent',
    name: 'site-docs-agent-page',
    component: AzionDocsAgentPage,
    beforeEnter: (to) => (agentBySlug(String(to.params.agent)) ? true : '/site/docs/agent-setup')
  },
  // EVERY OTHER DOCS PAGE, from one route and one view. A reading page is `.mdx` rendered by
  // @aziontech/webkit-docs — the other half of the docs example, and the way most of a real
  // documentation site is written — so the pages are files in `site/docs/content/` and the
  // route resolves the slug against that folder (see docs-pages.js). Adding a page is adding
  // the file and giving its row in the rail an `href`; no route, no view, no wiring.
  //
  // The static routes above win over this one regardless of order (Vue Router ranks static
  // segments higher), so the two hand-composed pages keep their own views. An unknown slug
  // has no file behind it and would render an empty page, so it goes to the docs home
  // instead of a blank column with a full rail beside it.
  {
    path: '/site/docs/:page',
    name: 'site-docs-page',
    component: AzionDocsPage,
    beforeEnter: (to) => (hasDocsPage(String(to.params.page)) ? true : '/site/docs')
  }
]
