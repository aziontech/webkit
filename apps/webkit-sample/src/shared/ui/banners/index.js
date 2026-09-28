// The banner registry — the page artwork a Site/Hub/Docs band can stand on. These
// are pictures with structure (a world map, its network mesh, a globe), not
// tileable surfaces: the surfaces are the design system's, and a band composes one
// into its `#background` slot straight from the package.
//
//   <Hero kind="screen">
//     <template #background><TextureMaterial kind="dots" /></template>
//     …
//   </Hero>
//
// To add a banner (including a pasted HTML one):
//
//   1. Create `<Name>Banner.vue` in this folder. Paste the HTML into its
//      <template>, keeping the layer contract from CONTAINERS.md § Hero: a
//      full-bleed `pointer-events-none absolute inset-0 z-0` root marked
//      `aria-hidden="true"`, a radial mask, and an opacity below 1 so the
//      texture never competes with the copy. Swap any hex/rgb value for the
//      matching theme token (`var(--bg-canvas)`, `var(--color-orange-500)`, …).
//   2. Register it below under a short kebab key and add it to the named
//      exports, which is what a page imports.
//
// BANNERS/BANNER_NAMES stay the keyed index of what exists, for anything that
// has to offer the set rather than pick one from it.
import GlobeBanner from './GlobeBanner.vue'
import MapBanner from './MapBanner.vue'
import NetworkBanner from './NetworkBanner.vue'

export const BANNERS = {
  globe: GlobeBanner,
  map: MapBanner,
  // The same artwork, full bleed and carrying traffic — the map is the page's
  // ground rather than the illustration beside its copy. See NetworkBanner.
  network: NetworkBanner
}

export const BANNER_NAMES = Object.keys(BANNERS)

export { GlobeBanner, MapBanner, NetworkBanner }
