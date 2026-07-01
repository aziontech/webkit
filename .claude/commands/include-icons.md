---
description: Add one or more icons to `@aziontech/icons` — decides monochrome (font) vs colored (`ai-*-cor`), normalizes names, places the SVGs, rebuilds, and verifies they surface in the catalog, CSS, gallery, and Storybook.
argument-hint: [svg file(s) / pasted svg / names] [ai|pi]
---

You are running `/include-icons`. Bring new icon SVGs into the `@aziontech/icons` package the right way, then prove they render. **Never** open a PR here — that is `/open-pr`'s job.

**User input:** $ARGUMENTS

## Source of truth

- Package + workflow: [`packages/icons/README.md`](../../packages/icons/README.md) (§ Adding a new icon / colored icon).
- Build orchestrator: [`packages/icons/scripts/build.mjs`](../../packages/icons/scripts/build.mjs). Font config: [`packages/icons/fantasticon.config.mjs`](../../packages/icons/fantasticon.config.mjs).
- Consumers: [`apps/icons-gallery`](../../apps/icons-gallery) (catalog + `color-catalog`), Storybook [`Foundations/Icons`](../../apps/storybook/src/stories/foundations/Icons.stories.js).

## The one decision that drives everything: monochrome vs colored

An icon **font glyph is single-color** — it physically cannot carry gradients or multiple fills. So every icon is one of two kinds:

| Kind | When | Goes to | Delivered as | Used as |
|---|---|---|---|---|
| **Monochrome** | one color, meant to inherit `currentColor` (UI icons, single-color logos) | `src/svg-raw/ai/` (or `pi/`) | woff2 **font** glyph + `catalog.json` | `<i class="ai ai-<name>">` (recolorable) |
| **Colored** | multicolor brand/framework logo (gradients, ≥2 fills) | `src/svg-raw/ai-cor/` | `azionicons-color.css` (`.ai-<name>-cor` background-image) **+** `color-catalog.json` (inline SVG). **Not** in the font. | `<i class="ai ai-<name>-cor">` (keeps its palette) or inline via `color-catalog` |

Detect colored automatically: the SVG has `<linearGradient>`/`<radialGradient>`, `<clipPath>`, or **more than one distinct** `fill="#…"` / `fill="white"` (i.e. a real palette). If it is a single solid shape that should theme with text, it is monochrome. **If genuinely unsure which the user wants, ask** — the choice is not reversible without redoing the work.

## Steps

1. **Collect the SVGs.** From `$ARGUMENTS` (file paths, pasted SVG markup, or names) gather each icon's raw SVG. Default set is `ai` (Azion); use `pi` only if the user says so.
2. **Classify** each SVG monochrome vs colored using the rule above.
3. **Normalize the name** → lowercase **kebab-case**, no spaces, **no dots**, no capitals. Map to the framework's real name. Examples: `Kotlin`→`kotlin`, `next.js`→`next`, `svelt`→`svelte`. Monochrome file: `ai-<name>.svg`. Colored file: `ai-<name>-cor.svg`. Refuse names that collide with an existing icon of the same kind (pick a distinct name).
4. **Prepare each SVG** (rewrite to our conventions — never paste a foreign SVG as-is):
   - Square `viewBox` (`0 0 14 14` for the colored set; keep the source's square viewBox otherwise).
   - **Monochrome:** strip hardcoded fills/strokes and set `fill="currentColor"`; remove `<clipPath>`/strokes; merge to filled `<path>`s. It must pass [`validate-svg.mjs`](../../packages/icons/scripts/validate-svg.mjs) (no `fill="#000"`, no strokes, has a `<path>`).
   - **Colored:** keep the palette exactly — **do not** convert to `currentColor`. Gradients/`clipPath` are allowed (they are not run through the font validator).
5. **Place** the files: monochrome → `packages/icons/src/svg-raw/ai/` (or `pi/`); colored → `packages/icons/src/svg-raw/ai-cor/`.
6. **Build:** `cd packages/icons && npm run build`. This regenerates the font, `catalog.json`, `color-catalog.json`, and `azionicons-color.css`. (`dist/` is gitignored — it is a build artifact; never edit it by hand.)
7. **Verify** (state results plainly — counts, not vibes):
   - **Monochrome:** the name is in `dist/catalog.json` as `{ icon: "ai ai-<name>", … }`; it is **not** in `color-catalog.json`.
   - **Colored:** the name is in `dist/color-catalog.json` (well-formed `<svg>`, no `currentColor`) **and** has a `.ai-<name>-cor` rule in `dist/azionicons-color.css` whose data-URI decodes to the colored SVG; it is **not** in `catalog.json` and **not** in the woff2 font.
   - **Apps:** rebuild the gallery (`apps/icons-gallery`) and Storybook (`apps/storybook`) and confirm the icon appears in the grid / `Foundations/Icons`. For colored, confirm `<i class="ai ai-<name>-cor">` paints the logo (the `azionicons-color.css` class is bundled via the `index.css` barrel).
8. **Report** what you added (names, kind), how to use each (`<i class="ai ai-<name>">` or `<i class="ai ai-<name>-cor">`), and the verification outcome.

## Rules (hard)

- **Icon fonts are monochrome.** Never drop a multicolor SVG into `ai/`/`pi/` — fantasticon flattens it into a one-color blob. Colored icons live only in `ai-cor/`.
- **Never strip a brand logo's colors** when the intent is the colored set. Conversely, a monochrome icon must be `currentColor`, never a hardcoded hex.
- **Rewrite, don't inherit.** Foreign SVGs (Figma export, another library) are normalized to our conventions and naming first — see [`.claude/rules/migration.md`](../rules/migration.md).
- **Names are one canonical kebab string** on every surface (file, class, catalog). No dots, capitals, or spaces.
- **Do not edit `dist/`** (gitignored, generated) or hand-write any catalog/CSS — only edit sources under `src/svg-raw/` and rerun the build.
- **Do not change webkit components** to consume an icon — a webkit `<i class="ai …">` already works once the icon exists in the package and the consumer loads `@aziontech/icons`.
- **Do not open a PR or commit** here. Stop after verification; use `/open-pr` when the user asks.
