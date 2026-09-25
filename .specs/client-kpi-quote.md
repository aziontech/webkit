---
name: client-kpi-quote
category: marketing
structure: monolithic
status: implemented
spec_version: 1
checksum: 01e99f64d89e814e2890b8019a77165cc5a75595ae68341fa82dd2ee3de53207
created: 2026-09-24
last_updated: 2026-09-24
---

# Client KPI Quote — Component Spec

## Purpose

One cell of customer proof: the client's mark, the result that client got, and the sentence stating it. It is how a marketing page signs a number — the figure leads the claim in the default ink, the rest of the line runs muted behind it, and the mark above says whose workload it came from.

## When to use

- To state one customer's measured result on a marketing page, signed with that customer's mark.
- As the cell of a success-story or proof grid — one per client, inside a `card-grid`.
- Wherever a figure needs an owner: the mark is the attribution a bare number cannot carry.

## When NOT to use

- For the platform's own figures, with no client behind them → use `big-numbers`.
- For something a customer said → use `quote`, which owns the blockquote and the attribution.
- For a wall or a strip of customer marks with no claim attached → use `logo-wall` or `brand-carousel`.
- For a product capability stated as a benefit → use `feature-card`.

## Related

- `big-numbers` — the same proof band unsigned: the platform's figures rather than one client's.
- `quote` — a customer's words; this component is a customer's result.
- `brand-carousel` — the mark registry this component names; a strip states the client list, a cell states one client's outcome.
- `card-grid` — the hairline grid a row of these cells sits in; its `gap-px` seams are the rules between them.

## Best practices

- Lead with the result, not with the client: the mark already says who, so `kpi` is the first thing read.
- Keep `kpi` to two or three words — a figure and its direction (`86% faster`, `4M+ threats`, `90% lower`).
- Never invent a figure to fill the lead. A client whose published story states no number leads with its own words (`Automated security`) and the cell still reads as proof.
- Write `text` as the continuation of `kpi`: the two are set in one paragraph and read as one sentence.
- The cell draws no frame of its own — the rule and the corner marks belong to the `card-grid` or `frame-box` the page assembles it into.
- Prefer `href` over a link in `actions`: the whole cell becomes the target, so a grid of stories is one click each and nothing has to be aimed at.
- Give every linked cell an `ariaLabel` that names the destination (`Dafiti success story: 86% faster load times…`). Without a visible link label, the claim alone never says where the cell goes.
- Reach for `actions` only on an unlinked cell — a cell that is its own link cannot nest a second one, and the slot is dropped.

## Usage

```vue
<script setup>
import ClientKpiQuote from '@aziontech/webkit/client-kpi-quote'
</script>

<template>
  <ClientKpiQuote
    client="dafiti"
    client-name="Dafiti"
    kpi="86% faster"
    text="load times, with a 45% cost reduction in data transfer."
    href="https://www.azion.com/en/success-case/dafiti/"
    aria-label="Dafiti success story: 86% faster load times, with a 45% cost reduction in data transfer."
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `client` | `string` | `''` | false | Registry name of the client's brand mark, as `brand-carousel` names one; a name the registry does not carry falls back to the typographic wordmark. |
| `clientName` | `string` | `''` | false | The client's name in prose — the mark's accessible name, and the wordmark drawn when the registry has no artwork; falls back to the registry's own label for `client`. |
| `kpi` | `string` | `''` | false | The result itself — the figure or short phrase the claim leads with, set in the default ink. |
| `text` | `string` | `''` | false | The rest of the claim, set muted after the `kpi` and read as one sentence with it. |
| `href` | `string` | `''` | false | When set, the whole cell renders as an anchor link to this URL and takes hover and focus states; the `actions` slot is then not rendered, since a link cannot nest another. |
| `ariaLabel` | `string` | `''` | false | Accessible name of a linked cell, replacing the claim read as the link text; use it to state the destination, since a cell that is its own link shows no link label. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `mark` | — | The client's mark; replaces the registry artwork, for a page that owns the file. |
| `actions` | — | A trailing control under the claim, floored so a row of cells aligns on it. Not rendered when `href` makes the cell itself the link. |

## States

- Visual states: `default` — an unlinked cell is static copy, and every interactive state belongs to the control passed to `actions`.
- Linked (`href`): the cell carries `data-linked` and becomes an anchor — `hover` lays `var(--bg-mask)` over the surface and `focus-visible` draws an inset ring, so a cell on a hairline grid never paints over its neighbour's seam. The mask is the faint hover veil the system's own controls use, not the heavier `var(--bg-hover)`: a whole cell is a large area, and a lift that reads right on a 32px button reads as a highlighted block at card size.
- No artwork: a `client` the mark registry does not carry renders as a typographic wordmark, so a row of cells never loses a name.
- Empty: with no `client`, no `clientName` and no `mark` slot the signature band is absent and the claim starts the cell.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover / focus on a linked cell | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (claim) | `.text-heading-xs` |
| typography (wordmark fallback) | `.text-heading-xxs` |
| claim lead (`kpi`) | `var(--text-default)` |
| claim body | `var(--text-muted)` |
| client mark ink | `var(--text-default)` |
| cell surface | `var(--bg-canvas)` |
| cell surface (linked, hover) | `var(--bg-mask)` |
| focus ring (linked) | `var(--ring-color)` |
| spacing (cell padding) | `var(--spacing-xl)` |
| spacing (stack) | `var(--spacing-md)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: a linked cell carries `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)` and raises itself on `focus-visible:z-10`. The ring is **inset** rather than offset because these cells tile a `card-grid` whose seams are one pixel wide — an offset ring would be clipped by the next cell. An unlinked cell holds no control of its own; a control passed to `actions` brings its own ring.
- Keyboard map: a linked cell is reached by `Tab` and followed by `Enter` — native anchor behaviour, no key handler of its own, so nothing has to be re-implemented for the keyboard. An unlinked cell contains no focusable element and is skipped unless `actions` is filled.
- ARIA: an unlinked cell is a `<figure>` whose `<figcaption>` carries the signature, so the mark and the claim are one unit for a screen reader. A linked cell is an `<a>` — `<figcaption>` is legal only inside a `<figure>`, so the signature band follows the root and becomes a plain element rather than emitting invalid markup. The link's accessible name is `ariaLabel` when the page states one, and otherwise the cell's own text (the client's name followed by the claim), so a linked cell is never announced as a bare URL. Registry artwork is `aria-hidden` by construction, so the client's name is always in the caption — visible as the wordmark when there is no artwork, and screen-reader-only beside the mark when there is.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the `kpi` and the mark are `var(--text-default)` (17.65:1 light, 20.12:1 dark). The claim body is `var(--text-muted)` at body scale — 5.32:1 on the dark canvas, but **3.78:1 on the light canvas, under AA for normal text**. This is a system-wide property of `--text-muted`, not of this component; it is carried as a theme-level follow-up and is not worked around here with an off-token colour.
- `motion-reduce:transition-none` on the hover/focus colour transition; an unlinked cell is static and animates nothing.
- Touch target ≥40×40 px: a linked cell's target is the whole cell, well past the minimum. On an unlinked cell the only target is the control passed to `actions`, which owns its own.

## Stories (Storybook)

- Default
- Row — three cells in a `card-grid`, the shape the component is used in and the only one where the floored `actions` row can be seen to align across cells of different claim lengths
- Wordmark — a `client` the mark registry does not carry, showing the typographic fallback that keeps a row complete
- Linked — a `card-grid` of cells that are their own links, the only story where the hover surface, the inset focus ring and the `ariaLabel` naming the destination can be exercised

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
