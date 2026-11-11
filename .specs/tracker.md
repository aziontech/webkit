---
name: tracker
category: chart
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-11
checksum: 7c9821a30bc727a4a72ba1e50874d6c4d1930c49e39fadfb0ae4934e89f522b3
---

# Tracker — Component Spec

## Purpose

A status strip: one block per period — a day, an hour, a deployment — colored by its severity, with a readout of the period's label on hover or keyboard focus. It shows the history of a state at a glance (uptime, health checks, build results), where a `chart` would plot a measure.

## When to use

- Uptime and availability history: ninety days of a service, a region or an origin.
- Pass/fail history: health checks, scheduled jobs, deployments.
- Any discrete sequence where each period has one state and the pattern of failures matters.

## When NOT to use

- A measured value over time → use `chart` or `spark-chart`.
- The current state of one thing → use `status-indicator`.
- A ranking across categories → use `bar-list`.

## Related

- `status-indicator` — the current state; a Tracker is that state's history.
- `spark-chart` — a measured trend rather than a sequence of states.
- `chart-card` — the box a Tracker sits in, with the uptime figure in its header.

## Best practices

- Write each `label` as period plus state ("Nov 3 · Partial outage"), so the readout stands alone.
- Leave periods with no data without a severity; they render neutral rather than pretending to be healthy.
- Keep the period count fixed for a given view (90 days, 24 hours) so strips stacked in a list line up.
- Put the summary figure (99.98% uptime) beside the strip; the strip shows where, the figure shows how much.

## Usage

```vue
<script setup>
  import Tracker from '@aziontech/webkit/tracker'
</script>

<template>
  <Tracker
    aria-label="Edge Application uptime, last 7 days"
    :items="[
      { severity: 'success', label: 'Nov 4 · Operational' },
      { severity: 'success', label: 'Nov 5 · Operational' },
      { severity: 'warning', label: 'Nov 6 · Degraded performance' },
      { severity: 'success', label: 'Nov 7 · Operational' },
      { severity: 'danger', label: 'Nov 8 · Partial outage' },
      { severity: 'success', label: 'Nov 9 · Operational' },
      { label: 'Nov 10 · No data' }
    ]"
  />
</template>
```

## Props

| Prop        | Type            | Default | Required | JSDoc                                                                                                                                                   |
| ----------- | --------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`     | `TrackerItem[]` | `[]`    | false    | One block per period, oldest first; each item is `{ id?: string; severity?: ChartStatus; label: string }`. No severity renders a neutral no-data block. |
| `loading`   | `boolean`       | `false` | false    | Renders a Skeleton strip in place of the blocks.                                                                                                        |
| `ariaLabel` | `string`        | `''`    | false    | Accessible name of the strip.                                                                                                                           |

## Events

_No events — the strip is a readout; the active block is reached by pointer or keyboard and announced._

## Slots

_No slots._

## States

- Visual states: `default`, `active block` (pointer or keyboard; the others dim), `loading` (Skeleton strip), `empty` (one neutral strip announced as No data)
- `data-loading` mirrors `loading`
- `data-severity` on each block: `success` | `warning` | `danger` | `info` | `none`
- `data-active` on the active block; `data-dimmed` on every other block while one is active
- `data-visible` on the readout while a block is active; `data-moving` while it follows from one block to the next

## Motion & Animations

| Trigger             | Animation / Transition                                                     | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| active block change | blocks `transition-opacity duration-fast-02 ease-productive-entrance`      | `fast-02` · `productive-entrance`                 | `motion-reduce:transition-none` |
| readout follow      | `transition-[translate,opacity] duration-fast-02 ease-productive-entrance` | `fast-02` · `productive-entrance`                 | `motion-reduce:transition-none` |

## Tokens

| Region          | Token (DESIGN.md)                                                                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| blocks          | `var(--chart-status-success)`, `var(--chart-status-warning)`, `var(--chart-status-danger)`, `var(--chart-status-info)`, `var(--chart-series-other)` (no data)                |
| readout         | `var(--chart-tooltip-bg)`, `var(--chart-tooltip-text)`, `var(--chart-tooltip-border)`, `.text-label-md`, `var(--shape-elements)`, `var(--shadow-sm)`, `var(--container-3xs)` |
| readout spacing | `var(--spacing-xs)`, `var(--spacing-sm)`                                                                                                                                     |
| strip           | 32px tall, 2px gap, `var(--shape-elements)` on the outer corners                                                                                                             |
| ring            | `var(--ring-color)`                                                                                                                                                          |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The strip is one tab stop: `role="group"` named by `ariaLabel`, with `aria-roledescription="status history"`.
- Keyboard map: Left / Right move the active block, Home / End jump to the ends, Escape clears.
- A polite live region reads the active block's `label`; the visual readout is `aria-hidden`.
- Severity never rests on color alone: the label names the state.
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-surface)` on the strip (the offset takes the surface color, so it never shows as a white gap in the dark theme).
- Status colors clear 3:1 against the chart surfaces in both themes.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none.
- Keyboard: `ArrowRight`/`ArrowLeft` move the active bar later/earlier, swapped under `dir="rtl"` (`logicalArrowKey`); the oldest bar sits at the start edge.
- Pointer: the hovered bar is measured from the start edge (`rect.right - clientX` under `rtl`), and the readout is anchored with a physical `left: 0` plus the mirrored bar center.
- User data: dates in the readout are printed by `Intl` in the active locale.

## Stories (Storybook)

- Default — ninety days of uptime with a degraded day and an outage.
- Loading — `loading`.
- Empty — `items` empty.

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
