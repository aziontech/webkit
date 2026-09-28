/**
 * Build Color CSS Script
 *
 * Colored brand icons (gradients + multiple fills) cannot be woff2 font glyphs
 * (a glyph is single-color). To make them usable the same way as font icons —
 * `<i class="ai ai-google-cor"></i>` — each is emitted as a CSS class that paints
 * the SVG as a `background-image` data-URI. The icon sizes to `1em`, so it scales
 * with `font-size`/`color`-adjacent typography just like a font glyph's box.
 *
 * ── currentColor, AND WHY IT NEEDS RESOLVING HERE ──
 *
 * Some brand logos are only PARTLY colored: Astro is a fixed red→magenta gradient
 * swoosh under an "A" that is the brand's INK — black on a light background, white
 * on a dark one. Such a part is authored as `fill="currentColor"`, which is also what
 * validate-svg.mjs asks for, and it resolves correctly wherever the SVG is INLINED
 * (dist/color-catalog.json → the gallery, Storybook).
 *
 * A `background-image` is a separate document, so it inherits nothing from the element
 * painting it: `currentColor` there resolves against the SVG's own root — NOT the
 * consumer's text color — and no amount of `color` on the `<i>` reaches it. Left alone
 * it lands on the UA default and the icon disappears in one of the two themes. That is
 * exactly how Astro's white "A" shipped invisible on every light-mode surface.
 *
 * So this generator resolves it: an icon containing `currentColor` is emitted TWICE —
 * the base rule with the LIGHT ink, and an override with the DARK ink under the same
 * selectors @aziontech/theme uses for its dark tokens. The inks are the theme's own
 * `--text-default` values (they cannot be `var()`: same document isolation), so the
 * part matches the text beside it in both themes.
 *
 * Reads:  src/svg-raw/ai-cor/*.svg
 * Writes: dist/azionicons-color.css  (.ai-<name>-cor { background-image: ... })
 *
 * Usage: node scripts/build-color-css.mjs
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const CHARSET = 'utf-8'
const DIST_DIR = './dist'
const COLOR_DIR = './src/svg-raw/ai-cor'

// The ink `currentColor` stands in for, per theme — @aziontech/theme's own
// `--text-default` in each. Literal values by necessity: a data-URI SVG is its own
// document, so a `var()` in it resolves against nothing.
const INK_LIGHT = '#141414'
const INK_DARK = '#FAFAFA'

// The selectors @aziontech/theme ships for its dark tokens
// (`[data-theme=dark], .dark, .azion.azion-dark`), so an icon's ink flips with the
// theme by the same switch and never needs a second class at the call site.
const DARK_SELECTORS = ['[data-theme=dark]', '.dark', '.azion.azion-dark']

mkdirSync(DIST_DIR, { recursive: true })

// Compact, CSS-safe data-URI encoding (mini-svg-data-uri approach): keep the SVG
// readable, single-quote attributes, and percent-encode only what breaks url().
function svgToDataUri(svg) {
  const cleaned = svg
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/> </g, '><')
    .replace(/"/g, "'")
    .trim()

  const encoded = cleaned
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')

  return `data:image/svg+xml,${encoded}`
}

const files = readdirSync(COLOR_DIR)
  .filter((f) => f.endsWith('.svg'))
  .sort()

const names = files.map((f) => f.replace('.svg', ''))

// Shared box for every colored icon — one selector list keeps it DRY.
// const sharedSelector = names.map((n) => `.${n}`).join(',\n')
const sharedSelector = 'ai-cor'
const sharedRule = `.${sharedSelector} {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  vertical-align: -0.125em;
}`

// `currentColor` is matched case-insensitively (Figma exports vary) and replaced
// wholesale — an icon either declares ink parts or it does not.
const withInk = (svg, ink) => svg.replace(/currentColor/gi, ink)

const paint = (selector, svg) =>
  `${selector} {\n  background-image: url("${svgToDataUri(svg)}");\n}`

let inkIcons = 0

const perIconRules = files
  .map((file) => {
    const name = file.replace('.svg', '')
    const svg = readFileSync(join(COLOR_DIR, file), CHARSET)
    const base = `.${sharedSelector}.${name}`

    // A fully-colored logo (no ink parts) is one rule, as before.
    if (!/currentColor/i.test(svg)) return paint(base, svg)

    // An icon with ink parts gets the light ink in the base rule and the dark ink in a
    // theme override. The override's extra selector out-specifies the base, so source
    // order does not decide the winner.
    inkIcons += 1
    const darkSelector = DARK_SELECTORS.map((scope) => `${scope} ${base}`).join(',\n')
    return `${paint(base, withInk(svg, INK_LIGHT))}\n\n${paint(darkSelector, withInk(svg, INK_DARK))}`
  })
  .join('\n\n')

const css = `/* azionicons-color — colored brand icons (ai-*-cor) as background-image.
 * These are multicolor logos that cannot live in the woff2 font; use them exactly
 * like a font icon: <i class="ai ai-google-cor"></i>. Sizes with font-size (1em).
 * An icon whose SVG uses currentColor for its ink parts is emitted twice — light ink
 * in the base rule, dark ink under the theme's dark selectors — because a
 * background-image cannot inherit color from the element painting it.
 * Generated by scripts/build-color-css.mjs — do not edit by hand. */

${sharedRule}

${perIconRules}
`

writeFileSync(join(DIST_DIR, 'azionicons-color.css'), css, CHARSET)

console.log(
  `  ✔ dist/azionicons-color.css created (${files.length} colored icons, ${inkIcons} theme-aware)`
)
