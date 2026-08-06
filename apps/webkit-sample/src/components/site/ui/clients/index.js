// Client marks for the site's trust strip.
//
// Vite resolves each import to an asset URL, so a mark is one `<img src>` — no
// inline SVG, no sprite. Placing a mark on either theme takes one of two routes,
// and the folders in here already encode which:
//
// 1. TWO ASSETS — `dark/…` is the white version drawn for a dark background,
//    `light/…` is the full-color version for a light one (compare
//    `light/agibank-logo.svg`, which is green/blue, with `dark/clients/agibank-logo.svg`,
//    which is flat white). When both exist, set `logo` + `logoLight` and the
//    carousel swaps the file by theme. No filter touches them, so the light theme
//    gets the real brand colors — always preferable to a filtered approximation.
//
// 2. ONE ASSET + `artwork` — when only one version exists, the carousel inverts it
//    on the theme where it would disappear:
//      'light' — white/near-white artwork → inverted on the LIGHT theme.
//      'dark'  — black artwork, or `fill="currentColor"` (which resolves to black
//                inside an `<img>`, there being no inherited color) → inverted on DARK.
//      'color' — carries its own brand colors → never filtered, on either theme.
//                `invert()` is lossless on pure black/white but would misrepresent a
//                multicolor mark, so a brand's real colors are left alone.
//
// The values below are not guesses: every file was read and classified by the fills
// it actually declares. To add a client, drop the asset in this folder (or point at
// one of the sub-folders), check its fills, and set `artwork` — or add a `logoLight`
// if the mark ships a light-theme variant too.
import americamovil from './americamovil.svg'
import agibank from './dark/clients/agibank-logo.svg'
import cocacola from './dark/clients/cocacola-logo.svg'
import dafiti from './dark/clients/dafiti-logo.svg'
import fourbank from './dark/clients/fourbank-logo.svg'
import gfg from './dark/clients/gfg-global-fashion-group.svg'
import gpa from './dark/clients/gpa-logo.svg'
import herospark from './dark/clients/herospark.svg'
import itau from './dark/clients/itau-logo.webp'
import magalu from './dark/clients/magalu-logo.svg'
import netshoes from './dark/clients/netshoes-logo.svg'
import primevideo from './dark/clients/primevideo-logo.svg'
import radware from './dark/clients/radware-logo.svg'
import renner from './dark/clients/renner-logo.svg'
import herosparkWordmark from './herospark-logo.svg'
import herosparkSymbol from './herospark-symbol.svg'
import agibankColor from './light/agibank-logo.svg'
import magaluColor from './light/magalu-logo.svg'
import madeiraWordmark from './madeira-logo.svg'
import madeiraSymbol from './madeira-symbol.svg'
import magaluWordmark from './magalu-logo.svg'
import magaluSymbol from './magalu-symbol.png'
import rennerWordmark from './renner-logo.svg'
import rennerSymbol from './renner-symbol.svg'

// The per-theme filter each artwork needs, shared by every surface that paints a
// client mark (the hero trust strip, the client-story cards) so the two can never
// disagree. The theme is read from `[data-theme=dark]` on the document root — the
// attribute the theme package keys its own variables off. Tailwind's stock `dark:`
// variant is NOT usable here: it follows `prefers-color-scheme`, which says nothing
// about the theme the app actually chose.
export const ARTWORK_FILTER = {
  light: 'invert [[data-theme=dark]_&]:invert-0',
  dark: '[[data-theme=dark]_&]:invert',
  color: ''
}

/** The filter classes for one client entry; `color` (no filter) when unset. */
export const artworkFilter = (client) => ARTWORK_FILTER[client?.artwork] ?? ARTWORK_FILTER.color

// ── The story card: a client's own brand, not ours ──────────────────────────
// The story cards in Figma (`Illustrations` node 456:140792) paint each card in the
// CLIENT's brand colour — Renner red, MadeiraMadeira orange, HeroSpark pink, Magalu
// blue — with the client's symbol centred and its wordmark on the bottom-start edge.
//
// These hexes are the one deliberate exception to "tokens only", and they live HERE,
// in the client registry, rather than in a component: a client's brand red is a FACT
// ABOUT THE CLIENT, like its logo file — not a colour decision of this design system,
// and not something that could ever be a semantic token of ours. Components read them
// from this data; no component hard-codes one.
//
//   base    the card's flat fill — the brand colour as the design darkens it
//           (Figma layers a 40% black over the brand for Renner and HeroSpark;
//           MadeiraMadeira and Magalu are painted flat).
//   glow    the brand colour at full strength, used for the two 354px ellipses the
//           design floats over the fill (top-left and bottom-centre).
//
// Values read off the Figma fills and verified against the frame's own render.
const BRAND = {
  renner: { base: '#7a0202', glow: '#ef0000' },
  madeira: { base: '#ae3d00', glow: '#f0801c' },
  herospark: { base: '#a31e3a', glow: '#ff305c' },
  magalu: { base: '#00264b', glow: '#0f88ff' }
}

export const CLIENTS = [
  // Two assets: white on dark, real brand colors on light.
  { name: 'Agibank', logo: agibank, logoLight: agibankColor },
  { name: 'Radware', logo: radware, artwork: 'light' },
  // Multicolor mark (blues + the yellow-green sphere) — never filtered.
  { name: 'América Móvil', logo: americamovil, artwork: 'color' },
  { name: 'GPA', logo: gpa, artwork: 'light' },
  { name: 'Fourbank', logo: fourbank, artwork: 'light' },
  { name: 'Global Fashion Group', logo: gfg, artwork: 'light' },
  // ── Story clients ─────────────────────────────────────────────────────────
  // The four the design tells a story for. They carry three extra fields the trust
  // strip never reads: `symbol` (the mark, centred on the card), `wordmark` (the
  // white lockup on the card's bottom-start edge) and `brand` (above). Everything
  // else here is a trust-strip-only entry and stays exactly as it was.
  {
    name: 'HeroSpark',
    logo: herospark,
    artwork: 'light',
    symbol: herosparkSymbol,
    wordmark: herosparkWordmark,
    brand: BRAND.herospark
  },
  { name: 'Itaú', logo: itau, artwork: 'light' },
  {
    name: 'Magalu',
    logo: magalu,
    logoLight: magaluColor,
    // The one raster symbol: Magalu's mark is its "Lu" avatar, a photo.
    symbol: magaluSymbol,
    wordmark: magaluWordmark,
    brand: BRAND.magalu
  },
  {
    name: 'MadeiraMadeira',
    logo: madeiraWordmark,
    artwork: 'light',
    symbol: madeiraSymbol,
    wordmark: madeiraWordmark,
    brand: BRAND.madeira
  },
  {
    name: 'Renner',
    logo: renner,
    artwork: 'light',
    symbol: rennerSymbol,
    wordmark: rennerWordmark,
    brand: BRAND.renner
  },
  { name: 'Netshoes', logo: netshoes, artwork: 'light' },
  { name: 'Coca-Cola', logo: cocacola, artwork: 'light' },
  { name: 'Prime Video', logo: primevideo, artwork: 'light' },
  // `fill="currentColor"` → black inside an <img>, so this one inverts on dark.
  { name: 'Dafiti', logo: dafiti, artwork: 'dark' }
]
