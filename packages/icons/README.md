# @aziontech/icons

> Icon font library for Azion — **azionicons** (`az`) delivered as CSS + woff2, plus colour logos (`az-color`).

[![Publish Icons](https://github.com/aziontech/webkit/actions/workflows/publish-icons.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/publish-icons.yml)
[![npm version](https://badge.fury.io/js/%40aziontech%2Ficons.svg)](https://badge.fury.io/js/%40aziontech%2Ficons)
[![npm downloads](https://img.shields.io/npm/dm/@aziontech/icons)](https://www.npmjs.com/package/@aziontech/icons)
[![npm unpacked size](https://img.shields.io/npm/unpacked-size/@aziontech/icons)](https://www.npmjs.com/package/@aziontech/icons)
[![npm last publish](https://img.shields.io/npm/last-update/@aziontech/icons)](https://www.npmjs.com/package/@aziontech/icons)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Overview

| Set                   | Base class | Icons | What it holds                                                      |
| --------------------- | ---------- | ----- | ------------------------------------------------------------------ |
| **azionicons**        | `az`       | 418   | Azion products and platform, interface glyphs, single-colour logos |
| **azionicons colour** | `az-color` | 35    | Third-party logos in their own colours                             |

Monochrome icons ship as a **woff2 icon font** with matching CSS classes, so they take the text colour and work in plain HTML, Vue, React or any web project. A woff2 glyph has one colour, so multicolour logos ship separately as `background-image` CSS classes (`<i class="az-color az-google"></i>`) and as inline SVG strings. See [Colored icons](#colored-icons).

Every icon is documented in [`src/icons.json`](src/icons.json): its group and category, what the drawing shows, what it stands for, the Azion product it belongs to, and the old classes `webkit migrate` rewrites to it. The build fails when an icon has no entry or an entry breaks a naming rule. The full reference generated from it is [`docs/ICONS.md`](docs/ICONS.md); it ships as `dist/ICONS.md`, and the JSON as `@aziontech/icons/manifest`. The docs site shows the same groups on its Icons page.

---

## How the icons are organised

Every icon belongs to one of three groups, so it is always clear whether an icon is Azion's own, a generic interface glyph, or a third party's:

| Group         | Categories                                                                                                  | Use it for                                                                                                                                    |
| ------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Azion**     | Products, Product features, Platform, Solutions, Services                                                   | An Azion product (`az az-functions`), a part of one (`az az-domains`), the Azion brand and tools (`az az-azion-cli`), a solution or a service |
| **Interface** | Arrows, Actions, Status, Files, Media, Communication, Commerce, People, Devices, Data, Layout, Objects, Git | A generic action, object or state (`az az-trash`, `az az-chevron-down`, `az az-git-branch`)                                                   |
| **External**  | Frameworks, AI models, Developer tools, Languages, Online services                                          | A third party, named by its own logo (`az az-react`, `az-color az-openai`)                                                                    |

Rules that keep the names honest (checked by `scripts/check-manifest.mjs` on every build):

- **A product icon is named after the product**, as WebKit and the console name it: `functions` for Functions, `sql-database` for SQL Database, `waf` for WAF.
- **`edge-` stays only where the name still carries it**: the products Edge DNS and Edge Pulse, and the Orchestrator features Edge Nodes, Edge Services and Edge Libraries. Edge Orchestrator is now Orchestrator (`az-orchestrator`).
- **A feature names its product**: Domains belongs to Workloads, Rules Engine to Applications, Tiered Cache to Cache.
- **Every official Azion product and Solution has an icon; CI blocks otherwise.** The lists come from azioncorp's `product-naming.md` (Product Catalog) and `solutions.md`, stored as [`azion-products.json`](../webkit/test/catalog/azion-products.json) and [`azion-solutions.json`](../webkit/test/catalog/azion-solutions.json). The `toolkit` CI job (it runs on every PR, also one that touches only this package) fails when one of them has no SVG in `src/svg-raw/az/`, no entry in `src/icons.json` with that product or Solution name, or no `az az-<name>` glyph in a fresh font build. When the taxonomy changes, update the JSON first, then add the icon. Official abbreviations are allowed where the catalog gives one (`waf` for Web Application Firewall (WAF)), and an icon may not name a deprecated product (Edge Orchestrator is Orchestrator).
- **Every drawing keeps its proportions on the 14×14 canvas; the build blocks otherwise.** An SVG is `width="14" height="14"` with no other `viewBox`, no `preserveAspectRatio`, no transform that scales x and y differently, and nothing drawn outside the canvas. A drawing whose bounding box is less than 0.6 as wide as tall (or the reverse) fails unless it is listed with its reason in `INTENTIONALLY_NON_SQUARE` ([`scripts/lib/svg-geometry.mjs`](scripts/lib/svg-geometry.mjs)): a minus, an ellipsis, a caret. `check-svg.mjs` runs it on every build and `test/svg-geometry.test.mjs` in CI. A shape it cannot judge, such as a shield drawn narrower than `az-shield`, still needs a look on the Icons page.
- **Interface glyphs take [Lucide](https://lucide.dev/icons) names** (`az-x`, `az-menu`, `az-settings`, `az-chevron-down`); brands are spelled out (`az-javascript`, `az-x-brand`).
- **Names say what the icon is**, never how the file was made: no `-alt`, `-logo`, `-icon`, and no class prefix inside the name.
- **Pick an icon by what it stands for.** For a generic idea (a database, a route, a table) use an Interface icon, not a product's. Never use an External logo to stand for an Azion product.

---

## Installation

```bash
npm install @aziontech/icons
```

---

## Usage

```js
// The icon font (az az-<name>), once at the app entry
import '@aziontech/icons'
```

The colour logos (`az-color az-<name>`) are not in the default entry: they are SVG images inlined in CSS, about 85 KB gzip for the whole set, so an app pays only for the logos it uses.

- **With WebKit** (Tailwind v4 and `@aziontech/webkit/styles`, as `npx @aziontech/webkit init` sets up): nothing to add. The WebKit stylesheet imports `@aziontech/icons/azionicons-color-utilities`, where each logo is a Tailwind utility, so Tailwind compiles a logo only when your sources or the WebKit files you import name its class.
- **Any other Tailwind v4 app:** `@import '@aziontech/icons/azionicons-color-utilities';` in the stylesheet Tailwind compiles.
- **Without Tailwind, or to show every logo** (an icon gallery, logos named only in fetched data): `import '@aziontech/icons/azionicons-color'`, the whole set. With Tailwind, a logo named only in runtime data can also be listed with `@source inline("az-google az-react");`.

```html
<i class="az az-functions"></i>
<!-- an Azion product -->
<i class="az az-settings"></i>
<!-- an interface glyph -->
<i class="az-color az-react"></i>
<!-- a colour logo -->
```

### Package exports

Every target is a built file in `dist/`:

```js
import '@aziontech/icons' // → dist/index.css (the azionicons font)
import '@aziontech/icons/azionicons' // → dist/azionicons.css (the same font)
import '@aziontech/icons/azionicons-color' // → dist/azionicons-color.css (every `.az-color.az-<name>` logo)
// in a Tailwind v4 stylesheet: @import '@aziontech/icons/azionicons-color-utilities'
//   → dist/azionicons-color-utilities.css (one Tailwind utility per logo; only the used ones compile)
import catalog from '@aziontech/icons/catalog' // → dist/catalog.json (font icons with group, category and description)
import colorIcons from '@aziontech/icons/color-catalog' // → dist/color-catalog.json (colour SVGs)
import manifest from '@aziontech/icons/manifest' // → dist/icons.json (the documented list of every icon)
```

---

## Old names (WebKit 5)

Until WebKit 6 the classes were `ai ai-<name>`, `ai-cor ai-<name>` and the PrimeIcons `pi pi-<name>`. In 6.0, the one clean break, they are all gone: `ai` read as "artificial intelligence" and `cor` is Portuguese, so the base classes are `az` and `az-color`; product icons take today's product names (`ai ai-edge-functions` → `az az-functions`, `ai ai-edge-storage` → `az az-object-storage`); interface glyphs take Lucide names (`pi pi-times` → `az az-x`). Run `npx @aziontech/webkit migrate` to rewrite an app; the full map is `src/cli/migrations/v6-icons.json` in `@aziontech/webkit`, and the renames are listed in [`docs/ICONS.md`](docs/ICONS.md) (section "Old names").

---

## Icon reference

See [`docs/ICONS.md`](docs/ICONS.md) for every icon by group and category, with what it shows and what it stands for. To browse the drawings, open the docs site's Icons page or run the icons gallery (`apps/icons-gallery`).

---

## Colored icons

Some icons — third-party brand and framework logos — are inherently multicolor (gradients, multiple fills). An icon **font** glyph is single-color, so these cannot ship in the woff2 fonts above. They are delivered two ways instead, under the `az-color` base class and the same `az-<name>` name as the logo (`az-color az-react`, `az-color az-vue`, `az-color az-nextjs`, …). There is no `az-<name>-color` class.

### How it works

Each `src/svg-raw/az-color/az-<name>.svg` is compiled into **two** artifacts — never into the woff2 font:

| Output                      | Generated by              | Shape                                                                                                  |
| --------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------ |
| `dist/azionicons-color.css` | `build-color-css.mjs`     | a `.az-color.az-<name>` rule that paints the SVG as a `background-image`                               |
| `dist/azionicons-color-utilities.css` | `build-color-css.mjs` | the same rule as a Tailwind v4 `@utility az-<name>`, so Tailwind emits only the logos an app names |
| `dist/color-catalog.json`   | `build-color-catalog.mjs` | `{ icon: 'az-color az-<name>', name: 'az-<name>', colored: true, svg }` with the raw inline SVG string |

The CSS is **not** a font glyph and **not** base64. Each SVG is inlined as a **percent-encoded (URL-encoded) `data:image/svg+xml` URI** — smaller than base64, gzip-friendly, and human-readable in the output. The generated stylesheet is one shared box rule plus one `background-image` rule per icon:

```css
/* shared box — applies to every colored icon */
.az-color {
  width: 1em; /* scales with font-size, like a glyph's box */
  height: 1em;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  vertical-align: -0.125em;
}

/* display sits in a cascade layer under Tailwind utilities, so hidden, block and sm:block win */
@layer components {
  .az-color {
    display: inline-block;
  }
}

/* one rule per icon — the vector, percent-encoded (not base64) */
.az-color.az-google {
  background-image: url("data:image/svg+xml,%3Csvg width='14' … %3E%3C/svg%3E");
}
```

A colored icon needs **two** classes, exactly like a monochrome one: the base class (`az-color` instead of `az`) carries the box, and `az-<name>` picks the image. Never write `az az-<name>` for a colored logo (that is the monochrome glyph, when one exists) and never `az-<name>-color` (no such class). A logo can exist in both sets with the same name: `az az-svelte` is the single-color glyph, `az-color az-svelte` the brand-color one.

### 1. As a CSS class (recommended — use it like a font icon)

Importing `@aziontech/icons/azionicons-color` registers an `.az-color.az-<name>` rule for each colored icon; with WebKit's stylesheet (or `azionicons-color-utilities` in a Tailwind v4 stylesheet) Tailwind registers the rule of each logo your sources name ([Usage](#usage)). It sizes to `1em`, so it drops into the same `<i>` markup as a font icon:

```html
<i class="az-color az-google"></i>
<i
  class="az-color az-react"
  style="font-size: 32px;"
></i>
```

The `font-size` controls the box (1em); the icon keeps its own palette regardless of `color`.

### 2. As inline SVG (when you need the raw markup)

The same icons are also available as inline SVG strings at [`@aziontech/icons/color-catalog`](#package-exports) — useful when you can't load the CSS, or want to manipulate the markup directly:

```vue
<template>
  <!-- size via a wrapper; the SVG keeps its own brand palette -->
  <span
    style="width: 32px; height: 32px"
    v-html="reactIcon.svg"
  />
</template>

<script setup>
  import colorIcons from '@aziontech/icons/color-catalog'
  const reactIcon = colorIcons.find((i) => i.name === 'az-react')
</script>
```

> Colored icons are **not** recolored by `color` / `currentColor` — that is the whole point. For a themeable, single-color version of a framework logo, use the monochrome font icon instead (`az az-react`, `az az-vue`, `az az-nextjs`, `az az-svelte`, `az az-nitro`, `az az-stencil`, …).

Available colored icons: `az-color az-angular`, `az-color az-astro`, `az-color az-azure-devops`, `az-color az-bitbucket`, `az-color az-claude`, `az-color az-cursor`, `az-color az-deepseek`, `az-color az-discord`, `az-color az-flutter`, `az-color az-gemini`, `az-color az-gitlab`, `az-color az-google`, `az-color az-graphql`, `az-color az-grok`, `az-color az-html`, `az-color az-javascript`, `az-color az-kotlin`, `az-color az-meta`, `az-color az-microsoft-copilot`, `az-color az-mistral`, `az-color az-nextjs`, `az-color az-nuxt`, `az-color az-openai`, `az-color az-perplexity`, `az-color az-qwen`, `az-color az-react`, `az-color az-redwood`, `az-color az-solidjs`, `az-color az-svelte`, `az-color az-terraform`, `az-color az-typescript`, `az-color az-vue`, `az-color az-windsurf`, `az-color az-x-brand`, `az-color az-youtube`.

---

## Sizing & Theming

Icons inherit color via `currentColor`, making them trivially themeable with CSS:

```css
.my-icon {
  font-size: 14px; /* control size */
  color: #f97316; /* control color */
}
```

```html
<i
  class="az az-azion"
  style="font-size: 32px; color: var(--brand-color);"
></i>
```

The generated CSS base class sets the following properties on the icon prefix (`.az`):

```css
.az {
  font-family: 'azionicons';
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* display sits in a cascade layer under Tailwind utilities, so hidden, block and sm:block win */
@layer components {
  .az {
    display: inline-block;
  }
}
```

---

## Designing

### Drawing Icons

Use the [Figma template file to draw](https://www.figma.com/design/aerxJReCkLz3x3z29IERE9/Azion-Icons?node-id=937-361) and turn new icons avaiable in [Icon Library](https://www.figma.com/design/aerxJReCkLz3x3z29IERE9/Azion-Icons?node-id=933-65) across design files in Figma.

<img width="192" height="192" alt="image" src="https://github.com/user-attachments/assets/6616ec55-a7eb-4517-8dd4-de0593d549d6" />

Follow these rules when drawing icons:

- Tam: 90x90
- Stroke: 6pt
- Grid: 4px
- Grid 2: 2px
- Color: #000000 or text-color
- Layer name: Vector

After the icon is finished move to the Library page, put in the right category in 14x14px size and organize the layer follow this sample above:

<img width="422" height="303" alt="image" src="https://github.com/user-attachments/assets/e4d9feb1-4c6b-411c-b86b-afff689f9561" />

_Always use the Union feature to convert strokes into a unified path._

### Preparing SVG files for export

To ensure compatibility with our icon font pipeline (fantasticon + validation script), all SVGs must be properly cleaned and normalized before being added to src/svg-raw/.

We recommend using the Figma [SVG Export plugin](https://www.figma.com/community/plugin/814345141907543603/svg-export) with the linked preset (Icons Library) to automatically prepare icons according to our standards.

Preset reference file: [`presets/preset-svg-export.json`](presets/svg-export.json)

- Convert all shapes to `<path>`
- Remove unnecessary metadata and attributes
- Merge paths when possible
- Remove strokes
- Normalize fills
- Minify + optimize path data (multipass)
- Convert `black` to `currentColor`
- Remove hard-coded fills and strokes

### Checking the SVG

Here's how that your SVG needs to looks in code:

```
<svg width="14" height="14" fill="currentColor">
  <path d="M6.882.032a.581.581 0 0 1 .35.036l6.4 2.8a.58.58 0 0 1 .348.532v7.2a.58.58 0 0 1-.348.531l-6.4 2.8a.58.58 0 0 1-.464 0l-6.4-2.8A.58.58 0 0 1 .02 10.6V3.4a.58.58 0 0 1 .348-.532l6.4-2.8.114-.036ZM1.18 10.22l5.24 2.293V6.579L1.18 4.286v5.934Zm6.4-3.64v5.932l5.24-2.292V4.286L7.58 6.58ZM2.047 3.4 7 5.566 11.953 3.4 7 1.233 2.046 3.4Z"/>
</svg>
```

---

## Development

### Project structure

```
@aziontech/icons/
├── dist/                     # npm publishable output (gitignored)
│   ├── azionicons.css
│   ├── azionicons-color.css  # colour .az-color.az-<name> rules (background-image)
│   ├── azionicons-color-utilities.css  # the same logos as Tailwind v4 utilities
│   ├── azionicons.woff2
│   ├── index.css
│   ├── catalog.json          # font icons with group, category and description
│   ├── color-catalog.json    # colour icons as inline SVG (az-color az-<name>)
│   ├── icons.json            # copy of src/icons.json (@aziontech/icons/manifest)
│   └── ICONS.md              # copy of docs/ICONS.md
├── docs/
│   └── ICONS.md              # grouped icon reference, generated from src/icons.json
├── src/
│   ├── icons.json            # one documented entry per icon (source of truth)
│   └── svg-raw/
│       ├── az/               # monochrome SVG sources (418 icons → font)
│       └── az-color/         # colour logos (inline SVG, NOT fonted)
├── scripts/
│   ├── build-icons.mjs       # Build orchestrator: validate → fonts → docs → catalogs
│   ├── build-woff2.mjs       # Font generation via fantasticon
│   ├── build-catalog.mjs     # Generates dist/catalog.json
│   ├── build-color-catalog.mjs # Generates dist/color-catalog.json (colour SVGs)
│   ├── build-color-css.mjs   # Generates dist/azionicons-color.css and -utilities.css (colour classes)
│   ├── build-docs.mjs        # Generates docs/ICONS.md from src/icons.json
│   ├── check-manifest.mjs    # Fails when an icon has no entry or breaks a naming rule
│   ├── check-svg.mjs         # SVG validation script
│   └── lib/                  # icons-manifest.mjs (reads src/icons.json), icon-keywords.mjs
├── fantasticon.config.mjs    # Font generation configuration
├── templates/
│   └── css.hbs               # Handlebars CSS template for generated font files
└── jsconfig.json             # JS/TS path aliases (@/ → src/)
```

### Build pipeline (`build`)

The [`scripts/build-icons.mjs`](scripts/build-icons.mjs) orchestrator runs these steps:

1. **Validate SVGs and the manifest** — runs `scripts/check-svg.mjs` and `scripts/check-manifest.mjs` (blocks on errors)
2. **Clean `dist/`** — removes and recreates the output directory
3. **Generate fonts** — runs `scripts/build-woff2.mjs` (fantasticon for `az`; the colored `az-color` folder is not a font input)
4. **Create `index.css` and the docs** — barrel file importing `azionicons.css` (the colour logos are opt-in, see [Usage](#usage)); writes `docs/ICONS.md` and copies it and `src/icons.json` into `dist/`
5. **Generate catalogs & colored CSS** — `dist/catalog.json` (font icons, via `build-catalog.mjs`), `dist/color-catalog.json` (colored SVGs, via `build-color-catalog.mjs`), and `dist/azionicons-color.css` + `dist/azionicons-color-utilities.css` (colored `.az-color.az-<name>` rules and their Tailwind utilities, via `build-color-css.mjs`)

### Publishing

The package is published from this folder. `package.json#files` limits the tarball to `dist/`,
`LICENSE` and `README.md`, so the SVG sources, the build scripts and fantasticon's `tmp/` logs never
ship, and fantasticon is a dev dependency: installing `@aziontech/icons` adds no other package.

```bash
# Build the package
npm run build

# Preview package contents
npm run pack:dry

# Publish to npm
npm run publish
```

---

## Tech stack

| Tool                                                   | Purpose                          |
| ------------------------------------------------------ | -------------------------------- |
| [fantasticon](https://github.com/tancredi/fantasticon) | SVG → woff2 icon font generation |
| [ESLint](https://eslint.org/)                          | Linting                          |
| [Prettier](https://prettier.io/)                       | Code formatting                  |

---

## License

[MIT](LICENSE) © 2026 Azion Technologies

### Third-party marks

Brand glyphs are trademarks of their owners and are included only to refer to their products. Where each one comes from, and under which terms, is recorded in `packages/webkit/src/assets/logos/SOURCES.md` in the WebKit repository.

- `az az-nitro` is drawn from the Nitro icon (https://github.com/nitrojs/nitro), MIT License:

  > Copyright (c) Pooya Parsa <pooya@pi0.io> and Nitro contributors
  >
  > Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  >
  > The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  >
  > THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

- `az az-stencil` is the Stencil logo from Ionicons (https://github.com/ionic-team/ionicons), MIT License, Copyright (c) 2015-present Ionic (http://ionic.io/), under the same permission notice and disclaimer as above.
