// The specifications a workload is written against — the third registry, and the one that is
// not a company list.
//
// `clients/index.js` is who runs on us and `tools.js` is what a workload is built with; both
// are lists of VENDORS. This one is standards bodies and formats: nobody here is a customer,
// nobody is a supplier, and the claim a mark makes on a slide is "this is somebody else's
// specification, so what you write against it runs elsewhere too". Same entry shape as the
// other two ({ name, logo, artwork }), read by the same `ClientMark`, so the deck resolves all
// three registries as one array — it is stated separately for the reason `tools.js` gives
// about ITS split: a list is a claim a specific surface makes, and widening the tools strip
// with the W3C would change a page nobody asked to change.
//
// PROVENANCE. Every file is the body's own artwork, fetched from the source named beside it,
// geometry untouched. `artwork` classifies each by the fills it actually declares, exactly as
// the other two registries do:
//   'dark'  — one black path on transparency, which has no inherited colour inside an <img>;
//             inverted on the dark theme.
//   'color' — the mark ships its own palette and is never filtered.
//
// THESE ARE MEANT TO BE PLACED MONOCHROME. Four of the six are tiles or wordmarks that read as
// one silhouette, and the two that carry a palette (IETF's yellow-and-grey mesh) only sit
// beside the others honestly when every mark in the row is flattened to one ink. The deck's
// `reasons` slide is the surface that does that.
import ietf from './clients/ietf.svg'
import javascript from './clients/javascript.svg'
import onnx from './clients/onnx.svg'
import tc39 from './clients/tc39.svg'
import w3c from './clients/w3c.svg'
import webassembly from './clients/webassembly.svg'

export const STANDARDS = [
  // static.ietf.org/logos/ietf.svg — the body's own lockup, three flat fills (#221e1f lettering,
  // a #fdd34f/#bbbcc1 diamond mesh). Dark-inked, so it needs a light surface or the flatten.
  { name: 'IETF', logo: ietf, artwork: 'color' },
  // tc39.es/assets/img/logo.svg, NORMALIZED TO A KNOCKOUT. The published file is an opaque
  // #fc7c00 square with the glyphs painted black ON it, which is two opaque colours — and one
  // ink collapses both to the same silhouette, so the mark flattens to a blank square (it did,
  // first pass). The square and the four glyph paths are combined here into ONE path with
  // `fill-rule="evenodd"`, so the glyphs are HOLES in the tile rather than a second colour.
  // Nothing is redrawn: same viewBox, same path data, same shape at any size — it is the
  // vendor's mark expressed as a silhouette, which is what `WebAssembly` and `JavaScript`
  // below already ship as, and what the reference render shows.
  { name: 'TC39', logo: tc39, artwork: 'dark' },
  // The remaining four are simple-icons (CC0) — the maintained single-path silhouette of each
  // body's mark, which is the form this row wants and the form each vendor's own brand page
  // publishes for one-colour use.
  { name: 'W3C', logo: w3c, artwork: 'dark' },
  { name: 'JavaScript', logo: javascript, artwork: 'dark' },
  { name: 'WebAssembly', logo: webassembly, artwork: 'dark' },
  { name: 'ONNX', logo: onnx, artwork: 'dark' }
]
