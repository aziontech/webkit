---
name: stat-tile
category: chart
structure: monolithic
status: approved
checksum: 3cfa7c53908150ed06032ab08d7a6fe4f71ee360ba253203fc157ff0c696f3aa
spec_version: 1
created: 2026-10-20
last_updated: 2026-10-20
---

# StatTile — Component Spec

## Purpose

A KPI tile: a label, one big figure that counts up into place, an optional delta against a named period, and an optional sparkline. The delta reads good or bad for the metric, not merely up or down: `inverse` flips the polarity for metrics where a rise is bad (threats, errors, latency). A row of tiles sits above a dashboard's charts.

## When to use

- The headline numbers of a dashboard: total requests, blocked threats, cache hit ratio, error rate.
- A single value whose change matters more than its history; the sparkline adds the shape of that history.

## When NOT to use

- The history itself is the point → use `chart`.
- A share of a whole → use `donut-chart`.
- Marketing figures on a site band → use `big-numbers`.

## Related

- `chart` — the full history behind a tile.
- `chart-card` — the box for a chart; a tile is its own small surface and does not sit in one.
- `big-numbers` — the marketing figure band, with no delta and no live data.

## Best practices

- Name the comparison period in `deltaLabel` ("vs previous 24 hours"); a bare percentage is ambiguous.
- Set `inverse` on every metric where a rise is bad, so a growing threat count reads as a regression.
- Keep the label in sentence case with no trailing colon.
- Give the sparkline the same buckets as the chart below it, about twelve points.

## Usage

```vue
<script setup>
import StatTile from '@aziontech/webkit/stat-tile'
</script>

<template>
  <StatTile
    label="Blocked threats"
    :value="48210"
    :delta="12.4"
    delta-label="vs previous 24 hours"
    inverse
    :trend="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `label` | `string` | `''` | false | Metric name, in sentence case. Fallback for the default slot. |
| `value` | `number \| null` | `null` | false | The current value. It counts up from the previous value on change; null renders a dash. |
| `formatValue` | `(value: number) => string` | `formatCompact` | false | Formats the figure. |
| `delta` | `number \| null` | `null` | false | Signed change against the named period, in percent. Null hides the delta. |
| `deltaLabel` | `string` | `''` | false | The comparison period, read after the delta. |
| `inverse` | `boolean` | `false` | false | A rise is bad for this metric; flips the delta between success and danger. |
| `trend` | `number[]` | `[]` | false | Sparkline values, oldest first. Empty hides the sparkline. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Scale of the figure. |
| `loading` | `boolean` | `false` | false | Renders Skeleton lines in place of the figure, delta and sparkline. |

## Events

_No events — a tile is content; wrap it in a link or button to make it interactive._

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Replaces the label text. |
| `aside` | — | Trailing content beside the label, such as an info icon or a menu. |

## States

- Visual states: `default`, `loading` (Skeleton), `empty value` (a dash when `value` is null)
- `data-size`: `small` | `medium` | `large`
- `data-loading` mirrors `loading`
- `data-trend` on the delta: `good` | `bad` | `flat` — `flat` when the change rounds to zero

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| value change | count-up from the previous value over `slow-01`, eased with `productive-entrance`, driven by `requestAnimationFrame` in `composables/use-count-up.ts` | `slow-01` · `productive-entrance` | skipped under `prefers-reduced-motion`; the final value renders at once |
| sparkline entrance | `transition-[stroke-dashoffset] duration-slow-02 ease-productive-entrance`, `pathLength="1"` on `data-entered` | `slow-02` · `productive-entrance` | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| surface | `var(--bg-surface)`, `var(--border-default)`, `var(--shape-card)` |
| label | `.text-body-sm`, `var(--text-muted)` |
| figure | `.text-big-number-sm`, `.text-big-number-md`, `.text-big-number-lg`, `var(--text-default)` |
| delta | `.text-label-sm`, `var(--success-contrast)`, `var(--danger-contrast)`, `var(--text-muted)` |
| sparkline | `var(--chart-series-other)`, `var(--chart-series-1)` |
| spacing | `var(--spacing-xs)`, `var(--spacing-sm)`, `var(--spacing-md)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- The tile is a `<section>` named by its label (`aria-labelledby`).
- The animated figure is `aria-hidden`; a visually hidden copy holds the final formatted value, so assistive tech never reads a ticking number.
- The delta pairs an arrow icon and a signed value with its period, and a visually hidden word (better / worse), so its meaning never rests on color.
- The sparkline SVG is `aria-hidden`; the figure and delta carry the information.
- Proportional figures on the big number; `tabular-nums` on the delta.
- Text contrast at least 4.5:1 in both themes.

## Stories (Storybook)

- Default — a tile with a delta and a sparkline.
- Deltas — composite: a good rise, a bad rise with `inverse`, a flat change, no delta.
- Sizes — composite: `small`, `medium`, `large`.
- CountUp — a value that changes on a button press; excluded from visual regression because the count-up is timer driven, Default is its static sibling.
- Loading — `loading`.

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
