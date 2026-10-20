# Client marks

Every file here resolves to an asset URL, so a mark is one `<img src>`. `registry.ts` indexes them:

- **`CLIENTS`** — the trust-strip form of each client (an `extended` logo).
- **`CLIENT_SYMBOLS`** — the square 24px tile for avatars.

Both key on `normalizeClientName` (NFD, accents folded, non-alphanumerics dropped), so
"Caixa Econômica Federal" → `caixaeconomicafederal` and "Itaú" → `itau` with no spelling table.

## Naming

Every logo in `logos/` is `<brand>-<type>-<colormode>.<ext>`, one file per combination:

- **type** — `extended` (the full logo) or `symbol` (the mark alone).
- **colormode** — classified by the fills the file actually declares:
  - `color` — the brand's own colours, for a light surface.
  - `reversed` — for a dark surface: white artwork, or the brand's own dark lockup.
  - `mono` — one dark ink, or `fill="currentColor"` (black inside an `<img>`).

`caixa-extended-mono.svg` is Caixa's `#1A1A1A` wordmark; `nzn-extended-reversed.svg` and
`nzn-extended-color.svg` share the blue diamond, because inverting one would turn it orange.

## Placing a logo on a theme

Show the `-color` file on a theme only when it has contrast there: at least 80% of its silhouette edge
must clear 3:1 against that canvas (`#F5F5F5` light, `#000000` dark). Measure the edge rather than
the whole area, because a badge is separated from the page by its outline, not by the text inside its
own fill. Where colour fails, use `-mono` on light and `-reversed` on dark.

1. **Two assets.** Set `logo` to the `-reversed` file and `logoLight` to the `-color` one; the surface
   swaps by theme and no filter touches either file.
2. **One asset + `artwork`**, which follows the colormode:
   - `light` — a `-reversed` file, inverted on the light theme.
   - `dark` — a `-mono` file, inverted on dark.
   - `color` — a `-color` file, never filtered (`invert()` would misrepresent it).

## Filters

`ARTWORK_FILTER` reads the theme from `[data-theme=dark]` on the document root, not Tailwind's
`dark:` (which follows `prefers-color-scheme`, not the theme the app chose).

- `MONOCHROME_FILTER` — `brightness(0)` then `invert()` on dark: every mark becomes the same
  silhouette in the page's ink, for a strip where brand colours would compete.
- `KNOCKOUT_FILTER` — `brightness(0)` alone, the flat black silhouette for a mark on a coloured fill
  such as `--primary` (black on #F3652B is 6.71:1, white 3.0:1).

Both need an alpha channel — a mark on an opaque white background flattens to a black box. Every file
here, including the rasters `itau-extended-reversed.webp` and `magalu-symbol-color.png`, is transparent.

## Story clients

HeroSpark, Magalu, MadeiraMadeira and Renner also carry `symbol` (centred on the card) and `brand`
(`base` fill + `glow` ellipses, read off the Figma `Illustrations` node 456:140792). Three of those
symbols are `-symbol-reversed` white silhouettes that need `brand.base` painted behind them; Magalu's
is a raster that already is the tile.

## Tiles

Each `CLIENT_SYMBOLS` entry is a complete 24×24 tile — a `<rect>` in the brand colour with the mark on
top — so it is correct on both themes with no filter, and is named `-symbol-color`. Add a square mark,
never a squeezed wordmark.

## Importing

The public path is the file's name and nothing else; the folder lives only in the export's target,
so a mark can move between folders without breaking an import.

```js
import caixa from '@aziontech/webkit/assets/caixa-extended-color.svg'
import { CLIENTS, clientSymbolFor } from '@aziontech/webkit/assets/client-registry'
```

## Adding a mark

Name the file by the rule above and add a flat `"./assets/<file>"` key to
`packages/webkit/package.json#exports`, pointing at the file; then add its entry to the registry.

## Source

The Figma `Assets` file (`aerxJReCkLz3x3z29IERE9`, node `1457:45`, "list") is the source of truth: one
row per brand, variants `Default` / `Black` / `White`. They map to `color` / `mono` / `reversed`, with
the colormode decided by the fills each variant actually declares:

- A `Default` drawn in one dark ink is the same file as `Black`, so only `-mono` ships.
- A `Black` that is not one ink (Netshoes, Uninter, Loja Integrada) ships no `-mono`.
- Each file is cropped to its rendered ink, like every other mark here.

Export one row at a time: a whole-list export comes back scaled to 4096px tall and loses precision.

Some files deliberately differ from Figma, so a re-sync must not overwrite them:

- `madeiramadeira-extended-color` / `-reversed` keep the orange house; Figma's colour lettering is blue.
- `mobiauto-extended-color` / `-reversed` and `nzn-extended-reversed` keep their brand-colour dark lockups.
  Figma's `White` versions are greyscale.
- `caixa-extended-mono` stays one ink. Figma's grey X drops to low contrast under the `dark` invert.
- `arezzo-extended-color` is the Arezzo&Co lockup, which is a different mark from Figma's Arezzo.
- The analyst marks keep their optical box: the ink is sized by eye inside a 32-unit-tall viewBox. Their
  `-mono` files use the same box, so all three colormodes swap at the same size.

Figma's second `petz-logo` row is Neon (`neon-*`), the two Radware rows are the same drawing, and Linx is
left out because both of its variants are a PNG on an opaque grey box. Incognia, Kroton and the Petz
colour logo exist only as rasters, so they ship as `.png`. Petz is cropped above its tagline, as in Figma.
