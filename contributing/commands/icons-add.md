---
description: Add one or more icons to `@aziontech/icons` — decides monochrome (font) vs colored (`az-color az-<name>`), picks its group and category, normalizes names, places the SVGs, documents each in `src/icons.json`, rebuilds, and verifies they surface in the catalog, CSS, gallery, and docs site.
argument-hint: [svg file(s) / pasted svg / names]
---

You are running `/icons-add`. Bring new icon SVGs into the `@aziontech/icons` package the right way, then prove they render. **Never** open a PR here — that is `/pr-open`'s job.

**User input:** $ARGUMENTS

## Source of truth

- Package + workflow: [`packages/icons/README.md`](../../packages/icons/README.md) (§ How the icons are organised, § Adding a new Azion icon).
- Icon list (one documented entry per icon, checked by the build): [`packages/icons/src/icons.json`](../../packages/icons/src/icons.json); the grouped reference generated from it is [`packages/icons/docs/ICONS.md`](../../packages/icons/docs/ICONS.md).
- Build orchestrator: [`packages/icons/scripts/build-icons.mjs`](../../packages/icons/scripts/build-icons.mjs). Font config: [`packages/icons/fantasticon.config.mjs`](../../packages/icons/fantasticon.config.mjs).
- Consumers: [`apps/icons-gallery`](../../apps/icons-gallery) (catalog + `color-catalog`) and the docs site (`apps/docs`), which loads `@aziontech/icons` for every example.

## The one decision that drives everything: monochrome vs colored

An icon **font glyph is single-color** — it physically cannot carry gradients or multiple fills. So every icon is one of two kinds:

| Kind           | When                                                                      | Goes to                 | Delivered as                                                                                                                  | Used as                                                                            |
| -------------- | ------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Monochrome** | one color, meant to inherit `currentColor` (UI icons, single-color logos) | `src/svg-raw/az/`       | woff2 **font** glyph + `catalog.json`                                                                                         | `<i class="az az-<name>">` (recolorable)                                           |
| **Colored**    | multicolor brand/framework logo (gradients, ≥2 fills)                     | `src/svg-raw/az-color/` | `azionicons-color.css` (`.az-color.az-<name>` background-image) **+** `color-catalog.json` (inline SVG). **Not** in the font. | `<i class="az-color az-<name>">` (keeps its palette) or inline via `color-catalog` |

Detect colored automatically: the SVG has `<linearGradient>`/`<radialGradient>`, `<clipPath>`, or **more than one distinct** `fill="#…"` / `fill="white"` (i.e. a real palette). If it is a single solid shape that should theme with text, it is monochrome. **If genuinely unsure which the user wants, ask** — the choice is not reversible without redoing the work.

## Steps

1. **Collect the SVGs.** From `$ARGUMENTS` (file paths, pasted SVG markup, or names) gather each icon's raw SVG. Every new glyph goes in the `az` (Azion) set; there is no other font.
2. **Classify** each SVG monochrome vs colored using the rule above, and pick its **group** and category: Azion (product, feature, platform, solution, service), Interface (arrow, action, status, file, media, communication, commerce, person, device, data, layout, object, git) or External (framework, ai-model, developer-tool, language, online-service). An Azion product icon is named after the product as Azion UI spells it (`sql-database`); `edge-` only for Edge DNS, Edge Pulse and the Orchestrator features (Edge Nodes, Edge Services, Edge Libraries). A new official product or Solution goes in `packages/ui/test/catalog/azion-products.json` or `azion-solutions.json` too; CI fails until it has an icon.
3. **Normalize the name** → lowercase **kebab-case**, no spaces, **no dots**, no capitals. Map to the framework's real name, spelled out. Examples: `Kotlin`→`kotlin`, `next.js`→`nextjs`, `JS`→`javascript`, `Azure DevOps`→`azure-devops`, `svelt`→`svelte`. A UI glyph takes its [Lucide](https://lucide.dev/icons) name when Lucide has the shape: shape first (`circle-check`, `square-pen`), `-off` for a crossed-out glyph, no Font Awesome suffixes (`-alt`, `-o`, `-h`, `-v`) and no `times`/`cog`/`bars` (`x`, `settings`, `menu`). A brand that collides with a glyph name gets `-brand` (`x-brand`). Monochrome file: `ai-<name>.svg`. Colored file: also `ai-<name>.svg` (the `ai-color/` folder marks it colored; there is no `-cor` suffix anywhere). The same logo may exist in both sets under one name (`az az-svelte` and `az-color az-svelte`). Refuse names that collide with an existing icon of the same kind (pick a distinct name).
4. **Prepare each SVG** (rewrite to our conventions — never paste a foreign SVG as-is):
   - Square `viewBox` (`0 0 14 14` for the colored set; keep the source's square viewBox otherwise).
   - **Monochrome:** strip hardcoded fills/strokes and set `fill="currentColor"`; remove `<clipPath>`/strokes; merge to filled `<path>`s. It must pass [`check-svg.mjs`](../../packages/icons/scripts/check-svg.mjs) (no `fill="#000"`, no strokes, has a `<path>`).
   - **Colored:** keep the palette exactly — **do not** convert to `currentColor`. Gradients/`clipPath` are allowed (they are not run through the font validator).
5. **Place** the files as `az-<name>.svg`: monochrome → `packages/icons/src/svg-raw/az/`; colored → `packages/icons/src/svg-raw/az-color/`. Then **document** each in `packages/icons/src/icons.json`: `name`, `set`, `group`, `category`, `product` (products and features), `shows` (what the drawing is), `means` (what it stands for), `status: "stable"`, `legacy: []`.
6. **Build:** `cd packages/icons && npm run build`. It fails when an icon has no entry in `src/icons.json` or the entry breaks a naming rule, and regenerates the font, `catalog.json`, `color-catalog.json`, `azionicons-color.css` and `docs/ICONS.md` (commit `docs/ICONS.md`). (`dist/` is gitignored — it is a build artifact; never edit it by hand.)
7. **Verify** (state results plainly — counts, not vibes):
   - **Monochrome:** the name is in `dist/catalog.json` as `{ icon: "az az-<name>", group, category, means, … }`; it is **not** in `color-catalog.json`.
   - **Colored:** the name is in `dist/color-catalog.json` (well-formed `<svg>`; `currentColor` only for ink parts, which the build emits per theme) **and** has a `.az-color.az-<name>` rule in `dist/azionicons-color.css` whose data-URI decodes to the colored SVG; it is **not** in `catalog.json` and **not** in the woff2 font.
   - **Apps:** rebuild the gallery (`apps/icons-gallery`) and confirm the icon appears in the grid; run `pnpm dev:docs` to see it in an example if one uses it. For colored, confirm `<i class="az-color az-<name>">` paints the logo (the `azionicons-color.css` class is bundled via the `index.css` barrel).
8. **Report** what you added (names, kind), how to use each (`<i class="az az-<name>">` or `<i class="az-color az-<name>">`), and the verification outcome.

## Rules (hard)

- **Icon fonts are monochrome.** Never drop a multicolor SVG into `az/` — fantasticon flattens it into a one-color blob. Colored icons live only in `az-color/`.
- **Never rename or delete a shipped icon outside a major.** In a major, map the old class in `packages/ui/src/cli/migrations/v<major>-icons.json` and list it in the entry's `legacy`.
- **Never strip a brand logo's colors** when the intent is the colored set. Conversely, a monochrome icon must be `currentColor`, never a hardcoded hex.
- **Rewrite, don't inherit.** Foreign SVGs (Figma export, another library) are normalized to our conventions and naming first — see [`contributing/rules/migration.md`](../rules/migration.md).
- **Names are one canonical kebab string** on every surface (file, class, catalog, `src/icons.json`). No dots, capitals, or spaces.
- **Do not edit `dist/`** (gitignored, generated), `docs/ICONS.md` or any catalog/CSS by hand — only edit sources under `src/svg-raw/` and `src/icons.json`, and rerun the build.
- **Do not change Azion UI components** to consume an icon — an Azion UI `<i class="az …">` already works once the icon exists in the package and the consumer loads `@aziontech/icons`.
- **Do not open a PR or commit** here. Stop after verification; use `/pr-open` when the user asks.
