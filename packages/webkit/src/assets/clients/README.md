# Client marks

Every file here resolves to an asset URL, so a mark is one `<img src>`. Two registries index them:

- **`registry.ts`** — `CLIENTS`, the trust-strip form of each client (a `logo` wordmark).
- **`symbols/registry.ts`** — `CLIENT_SYMBOLS`, the square 24px form for avatars.

Both key on `normalizeClientName` (NFD, accents folded, non-alphanumerics dropped), so
"Caixa Econômica Federal" → `caixaeconomicafederal` and "Itaú" → `itau` with no spelling table.

## Placing a wordmark on a theme

1. **Two assets.** `dark/…` is the white version for a dark background, `light/…` the full-colour
   one for a light background. Set `logo` + `logoLight`; the surface swaps by theme and no filter
   touches either file.
2. **One asset + `artwork`**, classified by the fills the file actually declares:
   - `light` — white artwork, inverted on the light theme.
   - `dark` — black artwork, or `fill="currentColor"` (black inside an `<img>`), inverted on dark.
   - `color` — carries its own brand colours, never filtered (`invert()` would misrepresent them).

The folder a file sits in says where it was exported from; `artwork` says what it draws. Caixa lives
in `dark/clients/` but fills `#1A1A1A`, so it is `dark`. NZN ships two files because its blue diamond
is the same in both — inverting one would turn it orange.

## Filters

`ARTWORK_FILTER` reads the theme from `[data-theme=dark]` on the document root, not Tailwind's
`dark:` (which follows `prefers-color-scheme`, not the theme the app chose).

- `MONOCHROME_FILTER` — `brightness(0)` then `invert()` on dark: every mark becomes the same
  silhouette in the page's ink, for a strip where brand colours would compete.
- `KNOCKOUT_FILTER` — `brightness(0)` alone, the flat black silhouette for a mark on a coloured fill
  such as `--primary` (black on #F3652B is 6.71:1, white 3.0:1).

Both need an alpha channel — a mark on an opaque white background flattens to a black box. Every file
here, including the rasters `itau-logo.webp` and `magalu-symbol.png`, is transparent.

## Story clients

HeroSpark, Magalu, MadeiraMadeira and Renner also carry `symbol` (centred on the card), `wordmark`
(bottom-start edge) and `brand` (`base` fill + `glow` ellipses, read off the Figma `Illustrations`
node 456:140792). Three of those symbols are white silhouettes that need `brand.base` painted behind
them; Magalu's is a raster that already is the tile.

## Symbols

Each file in `symbols/` is a complete 24×24 tile — a `<rect>` in the brand colour with the mark on top
— so it is correct on both themes with no filter. Add a square mark there, never a squeezed wordmark.

## Adding a mark

Drop the file, add its `./assets/clients/<path>` key to `packages/webkit/package.json#exports`, and
add its entry to the registry.
