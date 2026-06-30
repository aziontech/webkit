# @aziontech/icons

> Icon font library for Azion — **azionicons** (`ai`) + **primeicons** (`pi`) delivered as CSS + woff2.

[![Package Icons](https://github.com/aziontech/webkit/actions/workflows/package-icons.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/package-icons.yml)
[![npm version](https://badge.fury.io/js/%40aziontech%2Ficons.svg)](https://badge.fury.io/js/%40aziontech%2Ficons)
[![npm downloads](https://img.shields.io/npm/dm/@aziontech/icons)](https://www.npmjs.com/package/@aziontech/icons)
[![npm unpacked size](https://img.shields.io/npm/unpacked-size/@aziontech/icons)](https://www.npmjs.com/package/@aziontech/icons)
[![npm last publish](https://img.shields.io/npm/last-update/@aziontech/icons)](https://www.npmjs.com/package/@aziontech/icons)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Overview

`@aziontech/icons` is a dual icon font package that bundles:

| Font | Prefix | Icons | Description |
|------|--------|-------|-------------|
| **azionicons** | `ai` | 87 | Azion product, platform, and ecosystem icons |
| **primeicons** | `pi` | 315 | General-purpose UI icons (PrimeIcons set) |

Icons are distributed as **woff2 icon fonts** with matching CSS class utilities, making them framework-agnostic — usable in plain HTML, Vue, React, or any web project.

In addition, a set of **colored brand icons** (`ai-*-cor`) ships separately. Because an icon-font glyph is single-color, multicolor logos (gradients, multiple fills) cannot live in the woff2 font — they are delivered both as `background-image` CSS classes (usable like a font icon: `<i class="ai ai-google-cor"></i>`) and as a manifest of inline SVG strings. See [Colored icons](#colored-icons).

---

## Installation

```bash
npm install @aziontech/icons
```

---

## Usage

### Import via CSS / bundler

```js
// Import both icon sets (recommended)
import '@aziontech/icons'

// Or import individually
import '@aziontech/icons/azionicons'
import '@aziontech/icons/primeicons'
```

### Import via HTML `<link>`

```html
<!-- All icons -->
<link rel="stylesheet" href="node_modules/@aziontech/icons/dist/index.css" />

<!-- Or individually -->
<link rel="stylesheet" href="node_modules/@aziontech/icons/dist/azionicons.css" />
<link rel="stylesheet" href="node_modules/@aziontech/icons/dist/primeicons.css" />
```

### Use in HTML

```html
<!-- Azion icons (prefix: ai) -->
<i class="ai ai-azion"></i>
<i class="ai ai-edge-application"></i>
<i class="ai ai-edge-functions"></i>

<!-- PrimeIcons (prefix: pi) -->
<i class="pi pi-home"></i>
<i class="pi pi-cog"></i>
<i class="pi pi-search"></i>
```

### Package exports

The package exposes the following named exports (defined in the generated `dist/package.json`):

```js
import '@aziontech/icons'                              // → dist/index.css (all sets + colored classes)
import '@aziontech/icons/azionicons'                   // → dist/azionicons.css
import '@aziontech/icons/azionicons-color'             // → dist/azionicons-color.css (colored .ai-*-cor classes)
import '@aziontech/icons/primeicons'                   // → dist/primeicons.css
import catalog from '@aziontech/icons/catalog'         // → dist/catalog.json (font icon list)
import colorIcons from '@aziontech/icons/color-catalog' // → dist/color-catalog.json (colored SVGs)
```

---

## Icon Reference

### Azion Icons (`ai`)

Azion-specific product and ecosystem icons. All use the `.ai` base class plus a modifier:

```html
<i class="ai ai-azion"></i>
<i class="ai ai-edge-application"></i>
<i class="ai ai-edge-functions"></i>
<i class="ai ai-edge-firewall"></i>
<i class="ai ai-edge-dns"></i>
<i class="ai ai-edge-kv"></i>
<i class="ai ai-edge-sql"></i>
<i class="ai ai-edge-storage"></i>
<i class="ai ai-data-stream"></i>
<i class="ai ai-real-time-metrics"></i>
<i class="ai ai-real-time-events"></i>
<i class="ai ai-marketplace"></i>
<i class="ai ai-domains"></i>
<i class="ai ai-digital-certificates"></i>
```

Notable category groupings:

- **Platform pillars** — `ai-ai-pillar`, `ai-build-pillar`, `ai-deploy-pillar`, `ai-secure-pillar`, `ai-observe-pillar`
- **Products** — `ai-edge-application`, `ai-edge-functions`, `ai-edge-firewall`, `ai-edge-dns`, `ai-gateway`, `ai-load-balancer`, `ai-waf-rules`, `ai-tiered-cache`, `ai-origin-shield`, `ai-edge-ai`, `ai-edge-connectors`, `ai-edge-libraries`, `ai-edge-nodes`, `ai-edge-orchestrator`, `ai-edge-pulse`, `ai-edge-services`, `ai-workloads`
- **Storage & Data** — `ai-edge-kv`, `ai-edge-sql`, `ai-edge-storage`, `ai-data-stream`, `ai-variables`
- **Observability** — `ai-real-time-metrics`, `ai-real-time-events`, `ai-real-time-purge`, `ai-live-ingest`
- **Security** — `ai-edge-firewall`, `ai-waf-rules`, `ai-network-lists`, `ai-digital-certificates`, `ai-custom-pages`
- **Networking** — `ai-domains`, `ai-load-balancer`, `ai-origin-shield`, `ai-tiered-cache`
- **Azion Tools** — `ai-azion-api`, `ai-azion-cli`, `ai-ask-azion`, `ai-marketplace`, `ai-configuration-service`, `ai-integration-services`
- **Frameworks** — `ai-angular`, `ai-astro`, `ai-docusaurus`, `ai-eleventy`, `ai-gatsby`, `ai-hexo`, `ai-hono`, `ai-hugo`, `ai-jekyll`, `ai-next`, `ai-nuxt`, `ai-preact`, `ai-qwik`, `ai-react`, `ai-remix`, `ai-vite`, `ai-vitepress`, `ai-vue`, `ai-vuepress`
- **Integrations** — `ai-terraform`, `ai-graphql`, `ai-redis`, `ai-turso`, `ai-lora`, `ai-instructor`
- **Support & Services** — `ai-professional-services`, `ai-technical-support`, `ai-business-support`, `ai-security-team`, `ai-technical-account`, `ai-pratices-review`
- **UI & Utility** — `ai-home`, `ai-filter-alt`, `ai-column`, `ai-layers`, `ai-json`, `ai-open`, `ai-sparkles`, `ai-scizors`, `ai-datasheet`, `ai-store`
- **Social & Media** — `ai-medium`, `ai-rss`, `ai-twitch`, `ai-x`

### PrimeIcons (`pi`)

A comprehensive general-purpose UI icon set. All use the `.pi` base class:

```html
<i class="pi pi-home"></i>
<i class="pi pi-cog"></i>
<i class="pi pi-check"></i>
<i class="pi pi-times"></i>
<i class="pi pi-search"></i>
<i class="pi pi-user"></i>
```

---

## Colored icons

Some icons — third-party brand and framework logos — are inherently multicolor (gradients, multiple fills). An icon **font** glyph is single-color, so these cannot ship in the woff2 fonts above. They are delivered two ways instead, named with a `-cor` suffix (`ai-react-cor`, `ai-vue-cor`, `ai-next-cor`, …).

### 1. As a CSS class (recommended — use it like a font icon)

Importing `@aziontech/icons` (or `@aziontech/icons/azionicons-color`) registers a `.ai-<name>-cor` class for each colored icon. It paints the SVG as a `background-image` and sizes to `1em`, so it drops into the same `<i>` markup as a font icon:

```html
<i class="ai ai-google-cor"></i>
<i class="ai ai-react-cor" style="font-size: 32px;"></i>
```

The `font-size` controls the box (1em); the icon keeps its own palette regardless of `color`.

### 2. As inline SVG (when you need the raw markup)

The same icons are also available as inline SVG strings at [`@aziontech/icons/color-catalog`](#package-exports) — useful when you can't load the CSS, or want to manipulate the markup directly:

```vue
<template>
  <!-- size via a wrapper; the SVG keeps its own brand palette -->
  <span style="width: 32px; height: 32px" v-html="reactIcon.svg" />
</template>

<script setup>
  import colorIcons from '@aziontech/icons/color-catalog'
  const reactIcon = colorIcons.find((i) => i.name === 'ai-react-cor')
</script>
```

> Colored icons are **not** recolored by `color` / `currentColor` — that is the whole point. For a themeable, single-color version of a framework logo, use the monochrome font icon instead (`ai-react`, `ai-vue`, `ai-next`, …).

Available colored icons: `ai-angular-cor`, `ai-astro-cor`, `ai-azuredevops-cor`, `ai-bitbucket-cor`, `ai-flutter-cor`, `ai-gitlab-cor`, `ai-google-cor`, `ai-js-cor`, `ai-kotlin-cor`, `ai-next-cor`, `ai-nuxt-cor`, `ai-react-cor`, `ai-redwood-cor`, `ai-solidjs-cor`, `ai-svelte-cor`, `ai-ts-cor`, `ai-vue-cor`.

---

## Sizing & Theming

Icons inherit color via `currentColor`, making them trivially themeable with CSS:

```css
.my-icon {
  font-size: 14px;  /* control size */
  color: #f97316;   /* control color */
}
```

```html
<i class="ai ai-azion" style="font-size: 32px; color: var(--brand-color);"></i>
```

The generated CSS base class sets the following properties on each icon prefix (`.ai`, `.pi`):

```css
.ai {
  font-family: 'azionicons';
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

*Always use the Union feature to convert strokes into a unified path.*

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
│   ├── azionicons-color.css  # colored .ai-*-cor classes (background-image)
│   ├── azionicons.woff2
│   ├── primeicons.css
│   ├── primeicons.woff2
│   ├── index.css
│   ├── catalog.json          # font icon list (ai + pi)
│   ├── color-catalog.json    # colored icons as inline SVG (ai-*-cor)
│   ├── package.json          # generated for npm publish
│   ├── LICENSE
│   └── README.md
├── src/
│   └── svg-raw/
│       ├── ai/               # Azion SVG source files (87 icons, monochrome → font)
│       ├── ai-cor/           # Azion colored brand icons (inline SVG, NOT fonted)
│       └── pi/               # PrimeIcons SVG source files (315 icons → font)
├── scripts/
│   ├── build.mjs             # Build orchestrator: validate → fonts → catalogs → assemble
│   ├── build-woff2.mjs       # Font generation via fantasticon
│   ├── build-catalog.mjs     # Generates dist/catalog.json (font icons only)
│   ├── build-color-catalog.mjs # Generates dist/color-catalog.json (colored SVGs)
│   ├── build-color-css.mjs   # Generates dist/azionicons-color.css (colored classes)
│   └── validate-svg.mjs      # SVG validation script
├── fantasticon.config.mjs    # Font generation configuration (two font configs)
├── templates/
│   └── css.hbs               # Handlebars CSS template for generated font files
└── jsconfig.json             # JS/TS path aliases (@/ → src/)
```

### Available scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Validate SVGs → generate fonts → assemble `dist/` for npm |
| `npm run validate` | Run SVG validation only (`node scripts/validate.mjs`) |
| `npm run pack:dry` | Preview the npm package contents (`cd dist && npm pack --dry-run`) |
| `npm run publish` | Publish to npm from `dist/` (`cd dist && npm publish`) |
| `npm run lint` | Lint source files with ESLint |
| `npm run format` | Format `scripts/` and `src/` with Prettier |

### Adding a new Azion icon

1. Place the SVG file in [`src/svg-raw/ai/`](src/svg-raw/ai/) following the naming convention `ai-<icon-name>.svg`
2. Ensure the SVG meets the [requirements](#svg-requirements) below
3. Run `npm run build` to regenerate the font files
4. Verify the icon appears correctly in the generated CSS

### Adding a new PrimeIcon

Follow the same steps above but place the SVG in [`src/svg-raw/pi/`](src/svg-raw/pi/) using the `pi-` prefix.

### Adding a new colored Azion icon

Colored brand icons bypass the font (a glyph is single-color) and ship as a `.ai-*-cor` CSS class (`dist/azionicons-color.css`) plus an inline-SVG manifest (`dist/color-catalog.json`).

1. Place the **multicolor** SVG in [`src/svg-raw/ai-cor/`](src/svg-raw/ai-cor/) using the naming convention `ai-<icon-name>-cor.svg` (kebab-case, no spaces or dots — e.g. `ai-next-cor.svg`).
2. Keep a square `viewBox` (`0 0 14 14`). **Do not** convert fills to `currentColor` — the colors are the point.
3. Run `npm run build`. The icon is picked up by `build-color-catalog.mjs` (→ `dist/color-catalog.json`) and `build-color-css.mjs` (→ a `.ai-<name>-cor` class in `dist/azionicons-color.css`, also imported by the `index.css` barrel). It is intentionally **excluded** from the woff2 font and from `dist/catalog.json`.
4. Verify `<i class="ai ai-<name>-cor"></i>` renders in color, and that it appears in the icons gallery (`apps/icons-gallery`).

### Validate the SVG

All SVG source files are validated by [`scripts/validate.mjs`](scripts/validate.mjs) before font generation. SVGs must:

Run the validation script at any time:

```bash
node scripts/validate.mjs
```

The report shows ❌ errors (blocking — build will fail), ⚠️ warnings (may affect rendering), and ℹ️ info messages.

**Error-level checks** (block build):
- Placeholder / incomplete SVGs
- Missing `<path>` element
- Filenames with spaces

**Warning-level checks** (non-blocking):
- Stroke-based paths
- `fill="black"` / `fill="#000"` / `fill="#000000"` (should use `currentColor`)
- `<clipPath>` usage
- Non-square viewBox

**Info-level checks**:
- Non-standard viewBox size (anything other than 14x14)

---

## Font generation

Fonts are generated using [**fantasticon**](https://github.com/tancredi/fantasticon) configured in [`fantasticon.config.mjs`](fantasticon.config.mjs):

- **Input**: `src/svg-raw/ai/` and `src/svg-raw/pi/`
- **Output format**: `woff2` only
- **Asset types**: `css` only
- **Output**: `dist/` (CSS + woff2)
- **Font height**: 1000 units (normalized)
- **CSS template**: [`templates/css.hbs`](templates/css.hbs) — generates `@font-face` declaration + `.prefix.icon-name::before` rules

```bash
npm run build
```

### Build pipeline (`build`)

The [`scripts/build.mjs`](scripts/build.mjs) orchestrator runs 7 steps:

1. **Validate SVGs** — runs `scripts/validate-svg.mjs` (blocks on errors)
2. **Clean `dist/`** — removes and recreates the output directory
3. **Generate fonts** — runs `scripts/build-woff2.mjs` (fantasticon for both `ai` and `pi`; the colored `ai-cor` folder is not a font input)
4. **Create `index.css`** — barrel file importing `azionicons.css`, `azionicons-color.css`, and `primeicons.css`
5. **Generate `dist/package.json`** — creates a clean package manifest with exports for npm
6. **Copy LICENSE & README.md** — into `dist/` for npm
7. **Generate catalogs & colored CSS** — `dist/catalog.json` (font icons, via `build-catalog.mjs`), `dist/color-catalog.json` (colored SVGs, via `build-color-catalog.mjs`), and `dist/azionicons-color.css` (colored `.ai-*-cor` classes, via `build-color-css.mjs`)

### Publishing

The package is published from the `dist/` directory, which contains its own generated `package.json`:

```bash
# Build the package
npm run build

# Preview package contents
npm run pack:dry

# Publish to npm
npm run publish
```

> **Note:** The root `package.json` has `"private": true` to prevent accidental publishing from the root. The generated `dist/package.json` is the actual publishable manifest.

---

## Tech stack

| Tool | Purpose |
|------|---------|
| [fantasticon](https://github.com/tancredi/fantasticon) | SVG → woff2 icon font generation |
| [ESLint](https://eslint.org/) | Linting |
| [Prettier](https://prettier.io/) | Code formatting |

---

## License

[MIT](LICENSE) © 2026 Azion Technologies
