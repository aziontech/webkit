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
