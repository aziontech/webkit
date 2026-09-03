// THE CLIENT WALL — one entry per mark, and the mark is the entry.
//
// The `clients` slide states "these companies run on us", and the only honest way to state it
// is with each company's own logo, in each company's own colours. So this file is a REGISTRY,
// not content: a name and the file that draws it, in one tuple, so a client cannot appear on
// the wall without a mark and a mark cannot sit in the folder unlisted. The deck's own rule is
// that no asset path is written in a content file — the same split `versus` follows, where the
// gazetteer owns the coordinates and `deck.js` only names the places.
//
// ── WHY THESE ARE THE `light/` ASSETS ───────────────────────────────────────────────────────
//
// The shared client registry (`@shared/ui/brand/clients/index.js`) already encodes the two
// routes a mark can take: `dark/…` is the WHITE artwork drawn for a dark background, `light/…`
// is the FULL-COLOUR artwork for a light one. The wall sits on `--bg-contrast`, which on this
// deck's dark theme is #FAFAFA — so every mark here is a `light/` asset, and every one of them
// carries its own brand colours. Nothing is filtered, inverted, or recoloured to fit: the wall
// is the one surface in this app where the honest route and the pretty one are the same route.
//
// That is also the whole reason the panel is contrasted rather than dark. On black, a wall of
// thirty brands can only be a wall of thirty white silhouettes (that is what the trust strip's
// `MONOCHROME_FILTER` is for, and why it exists) — which says "logos" but not WHOSE. Flipping
// the panel to the contrast token is what buys back Itaú's orange, iFood's red and Magalu's
// blue, and those are the part a room recognises.
//
// ── PROVENANCE, AND THE ONE RECOLOUR ────────────────────────────────────────────────────────
//
// Every file is real vector artwork — no raster embed, no traced bitmap — sourced from the
// brand's own site or from Wikimedia Commons, and each was rendered at this wall's own cell
// size before being accepted. `stone-logo.svg` is StoneCo's own SVG with one change: the
// vendor publishes it as flat `fill="white"` (it is drawn for a dark header), so the fill is
// set to #00DA00 — Stone's green, MEASURED off the PNG the same site serves rather than picked
// by eye. It is a colour correction to the brand's own value, not a colour decision of ours.
//
// ── THE TWO CLIENTS THAT ARE NOT HERE ───────────────────────────────────────────────────────
//
// **Linx** and **Sólides** are absent, and deliberately so: neither publishes its current mark
// as SVG anywhere reachable (Linx's site ships PNG only; Sólides ships WebP only, and the one
// Linx SVG in circulation is the retired lockup on an opaque purple box). A logo wall is the
// wrong place for the registry's typographic fallback — a wordmark set in Sora between
// twenty-eight real marks reads as a broken image, not as a client — so they wait for a file.
// Adding either is one asset in `clients/light/` plus one line below, and the grid re-solves
// its own rows from the count.
//
// The two backers are the OTHER route — white artwork, because they sit on the slide's dark
// half rather than on the wall. `qualcoom-logo.svg` is spelled that way in the repository; the
// import is by the file's real name and the company's real name is in the data below.
import monashees from '@shared/ui/brand/clients/dark/clients/monashees-logo.svg'
import qualcomm from '@shared/ui/brand/clients/dark/clients/qualcoom-logo.svg'
import agi from '@shared/ui/brand/clients/light/agi-logo.svg'
import alpargatas from '@shared/ui/brand/clients/light/alpargatas-logo.svg'
import arezzo from '@shared/ui/brand/clients/light/arezzo-logo.svg'
import caixa from '@shared/ui/brand/clients/light/caixa-logo.svg'
import cobasi from '@shared/ui/brand/clients/light/cobasi-logo.svg'
import contabilizei from '@shared/ui/brand/clients/light/contabilizei-logo.svg'
import csuDigital from '@shared/ui/brand/clients/light/csu-digital-logo.svg'
import gfg from '@shared/ui/brand/clients/light/gfg-logo.svg'
import grendene from '@shared/ui/brand/clients/light/grendene-logo.svg'
import gruAirport from '@shared/ui/brand/clients/light/gru-airport-logo.svg'
import ifood from '@shared/ui/brand/clients/light/ifood-logo.svg'
import itau from '@shared/ui/brand/clients/light/itau-logo.svg'
import locaweb from '@shared/ui/brand/clients/light/locaweb-logo.svg'
import magalu from '@shared/ui/brand/clients/light/magalu-logo.svg'
import marisa from '@shared/ui/brand/clients/light/marisa-logo.svg'
import meliuz from '@shared/ui/brand/clients/light/meliuz-logo.svg'
import neogrid from '@shared/ui/brand/clients/light/neogrid-logo.svg'
import neon from '@shared/ui/brand/clients/light/neon-logo.svg'
import netshoes from '@shared/ui/brand/clients/light/netshoes-logo.svg'
import nzn from '@shared/ui/brand/clients/light/nzn-logo.svg'
import panvel from '@shared/ui/brand/clients/light/panvel-logo.svg'
import portobello from '@shared/ui/brand/clients/light/portobello-logo.svg'
import primevideo from '@shared/ui/brand/clients/light/primevideo-logo.svg'
import radware from '@shared/ui/brand/clients/light/radware-logo.svg'
import rbs from '@shared/ui/brand/clients/light/rbs-logo.svg'
import renner from '@shared/ui/brand/clients/light/renner-logo.svg'
import stone from '@shared/ui/brand/clients/light/stone-logo.svg'
import unicred from '@shared/ui/brand/clients/light/unicred-logo.svg'

// The order is READING ORDER, not ranking. A logo wall invites the room to look for whoever it
// knows, and the fastest way to make that a scan rather than a search is one rule anybody can
// see: alphabetical. Any other order (by size, by sector, by contract value) is an argument the
// slide is not making, and it is the order somebody will read into it anyway.
//
// `name` is the accessible name — it is what a screen reader says and what the `alt` carries,
// so it is the company's own spelling, accents and casing included.
export const CLIENT_WALL = [
  { name: 'agi', mark: agi },
  { name: 'Alpargatas', mark: alpargatas },
  { name: 'Arezzo&Co', mark: arezzo },
  { name: 'Caixa', mark: caixa },
  { name: 'Cobasi', mark: cobasi },
  { name: 'Contabilizei', mark: contabilizei },
  { name: 'CSU Digital', mark: csuDigital },
  { name: 'Global Fashion Group', mark: gfg },
  { name: 'Grendene', mark: grendene },
  { name: 'GRU Airport', mark: gruAirport },
  { name: 'Grupo RBS', mark: rbs },
  { name: 'iFood', mark: ifood },
  { name: 'Itaú', mark: itau },
  { name: 'Locaweb', mark: locaweb },
  { name: 'Magalu', mark: magalu },
  { name: 'Marisa', mark: marisa },
  { name: 'Méliuz', mark: meliuz },
  { name: 'NeoGrid', mark: neogrid },
  { name: 'Neon', mark: neon },
  { name: 'Netshoes', mark: netshoes },
  { name: 'NZN', mark: nzn },
  { name: 'Panvel', mark: panvel },
  { name: 'Portobello', mark: portobello },
  { name: 'Prime Video', mark: primevideo },
  { name: 'Radware', mark: radware },
  { name: 'Renner', mark: renner },
  { name: 'Stone', mark: stone },
  { name: 'Unicred', mark: unicred }
]

// The investors named on the slide's dark half, in the order the reference lists them. They are
// not clients and they are not on the wall: a backer is a different claim from a customer, so
// it sits under its own label in the copy column, at the smaller of the two mark sizes.
//
// `name` is what the ARTWORK says, not the shortest name for the company: the file in this
// repository is the Qualcomm VENTURES lockup, which is also the entity that actually invested,
// so the alt text says so rather than tidying it to "Qualcomm".
export const BACKER_MARKS = [
  { name: 'Qualcomm Ventures', mark: qualcomm },
  { name: 'monashees+', mark: monashees }
]
