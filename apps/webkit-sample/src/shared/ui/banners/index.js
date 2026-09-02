// The banner registry — every hero backdrop the Site/Hub/Docs pages can choose
// from, keyed by name. A page never imports a backdrop directly: it names one on
// the container and the container resolves it here.
//
//   <BannerContainer hero banner="map">…</BannerContainer>
//
// To add a banner (including a pasted HTML one):
//
//   1. Create `<Name>Banner.vue` in this folder. Paste the HTML into its
//      <template>, keeping the layer contract from CONTAINERS.md § Hero: a
//      full-bleed `pointer-events-none absolute inset-0 z-0` root marked
//      `aria-hidden="true"`, a radial mask, and an opacity below 1 so the
//      texture never competes with the copy. Swap any hex/rgb value for the
//      matching theme token (`var(--bg-canvas)`, `var(--color-orange-500)`, …).
//   2. Register it below under a short kebab key.
//   3. Select it from any page with `banner="<key>"`.
//
// BANNER_NAMES is what BannerContainer validates the `banner` prop against, so a
// typo fails loudly in dev instead of rendering an empty band.
import DitherBanner from './DitherBanner.vue'
import DotGridBanner from './DotGridBanner.vue'
import MapBanner from './MapBanner.vue'
import PixelateBanner from './PixelateBanner.vue'

export const BANNERS = {
  dither: DitherBanner,
  'dot-grid': DotGridBanner,
  map: MapBanner,
  pixelate: PixelateBanner
}

export const BANNER_NAMES = Object.keys(BANNERS)

export { DitherBanner, DotGridBanner, MapBanner, PixelateBanner }
