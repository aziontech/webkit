// The Webkit Hub's routes — the design-system reference at `/site/hub`. Its own
// area rather than a page of the site: it has its own shell (HubSidebar + a view
// per section) and the URL is the only thing it shares with ./site.routes.js.

import WebkitHub from '@hub/views/WebkitHub.vue'

export const hubRoutes = [
  { path: '/site/hub', name: 'site-hub', component: WebkitHub },
  // The sample's changelog, rendered as a HIDDEN Hub view: no HubSidebar entry and
  // nothing in the Hub links to it, so it exists only for whoever gets the URL.
  // `props` seeds the shell's opening view (see WebkitHub.vue).
  {
    path: '/site/hub/changelog',
    name: 'site-hub-changelog',
    component: WebkitHub,
    props: { view: 'changelog' }
  }
]
