import { suppressEntranceMotion } from '@console/lib/behavior/interaction'
import { createRouter, createWebHistory } from 'vue-router'

// One route module per area, in the same order they were declared when this was a
// single file — site first, then the hub that shares its `/site` prefix, then the
// console. Splitting them this way is what keeps an area's pages reachable from
// exactly one place: adding a console screen touches ./console.routes.js and
// nothing else, and a route that imports across areas is visible as an `@site` /
// `@hub` / `@console` line in the wrong file.
import { consoleRoutes } from './console.routes'
import { hubRoutes } from './hub.routes'
import { siteRoutes } from './site.routes'

const routes = [{ path: '/', redirect: '/login' }, ...siteRoutes, ...hubRoutes, ...consoleRoutes]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  // Section deep links. SectionHeading's `anchor` copy button hands out URLs like
  // /applications/1784552864?tab=build#build-configuration, and opening one has to
  // land ON that section. Returning `{ el }` is what makes that work here: the
  // console never scrolls the window (body/#app are overflow-hidden) — it scrolls a
  // nested container — and vue-router resolves `el` through `scrollIntoView()`,
  // which scrolls the nearest scrollable ancestor whatever that happens to be.
  //
  // Only hash navigations are handled; everything else returns `false` (no scroll),
  // which is exactly what the router did before this option existed. The guard
  // keeps a stale or hand-typed hash from logging vue-router's "couldn't find
  // element" warning, and `matchMedia` honours prefers-reduced-motion, since a
  // smooth scroll is motion like any other.
  scrollBehavior(to) {
    if (!to.hash) return false
    try {
      if (!document.querySelector(to.hash)) return false
    } catch {
      return false // not a valid selector
    }
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    return { el: to.hash, behavior: reduced ? 'auto' : 'smooth' }
  }
})

// A NAVIGATION IS AN ENTRANCE. Every routed page mounts fresh, and the click that
// started the navigation is a real input event — so without this the bands on the
// arriving page would each read their own mount as "the reader just revealed me" and
// grow from nothing, on top of the page entrance already playing. Heights animate for
// answers taking effect, never for arrivals (see src/lib/interaction.js).
router.beforeEach(() => {
  suppressEntranceMotion()
  return true
})
