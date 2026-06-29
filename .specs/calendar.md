---
name: calendar
category: inputs
structure: monolithic
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5087-17336
  node_id: 5087:17336
checksum: b12599fa9619bc2e9b19e5e6011c7620099b2be7d92b9ff60e2ce8771bc425b1
created: 2026-06-25
last_updated: 2026-06-25
---

# Calendar — Component Spec

## Purpose

Inline date picker that renders a month grid for selecting a single date or a date range. Unlike a popover-anchored datepicker, Calendar is always-visible (no overlay, no positioning) and is the standalone surface a consumer embeds in a form, panel, or popover body. Date math uses the native `Date` API only — no date library.

## Usage

```vue
<script setup>
import { ref } from 'vue'

import Calendar from '@aziontech/webkit/calendar'

const selected = ref(new Date(2026, 9, 8))
</script>

<template>
  <Calendar v-model="selected" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `Date \| null \| CalendarRange` | `null` | no | Selected value for v-model. A `Date` (or null) in single mode; a `{ start, end }` range object in range mode. |
| `mode` | `'single' \| 'range'` | `'single'` | no | Selection mode. Single picks one date; range picks a start and end date. |
| `min` | `Date \| undefined` | `undefined` | no | Earliest selectable date; earlier days render disabled. |
| `max` | `Date \| undefined` | `undefined` | no | Latest selectable date; later days render disabled. |
| `disabled` | `boolean` | `false` | no | Disables the whole grid and navigation, applying disabled tokens. |
| `showHeader` | `boolean` | `true` | no | Shows the month/year label and previous/next month navigation. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `Date \| null \| CalendarRange` | v-model. The selected `Date` (single) or `{ start, end }` (range). |
| `month-change` | `CalendarMonth` | Emitted when the visible month changes via navigation or keyboard paging. Payload is `{ year, month }` (month is 0-indexed). |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `selected`, `in-range`, `disabled`, `today`, `outside` (adjacent-month)
- `data-selected` mirrors a fully-selected day cell (single value, or a range endpoint)
- `data-band` on each day cell drives the connected range highlight: `none` | `single` | `start` | `middle` | `end` (endpoints round the outer edge; `middle` paints the in-range band edge-to-edge)
- `data-today` marks the current date
- `data-outside` marks an adjacent-month day cell
- `data-disabled` mirrors the `disabled` prop on the root and unselectable day cells

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover/focus state change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| panel surface | `var(--bg-surface-raised)` |
| panel border | `var(--border-default)` |
| panel shape | `var(--shape-button)` |
| day cell shape | `var(--shape-elements)` |
| header typography | `.text-body-sm` |
| weekday typography | `.text-label-sm` |
| day typography | `.text-body-sm` |
| header text | `var(--text-default)` |
| weekday text | `var(--text-muted)` |
| day text (current month) | `var(--text-default)` |
| day text (adjacent month / disabled) | `var(--text-disabled)` |
| selected day surface | `var(--secondary)` |
| selected day text | `var(--secondary-contrast)` |
| in-range band | `var(--bg-mask)` |
| hover surface | `var(--bg-hover)` |
| nav button hover surface | `var(--bg-hover)` |
| spacing (padding) | `var(--spacing-sm)` |
| spacing (gap) | `var(--spacing-xxs)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `Typography/Heading/xss` (14px regular) | `.text-body-sm` (0.875rem / 14px regular — matches the Figma size and weight) | `TODO: catalogar` — no heading-named token exists at 14px; `.text-body-sm` matches the size/weight, so the gap is naming-only. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface-raised)]`
- Keyboard map: `Tab` enters the grid at the focused day; `Arrow` keys move focus one day (left/right) or one week (up/down) with roving tabindex; `Enter`/`Space` selects the focused day; `PageUp`/`PageDown` navigate to the previous/next month; previous/next nav buttons are reachable by `Tab`.
- ARIA: grid uses `role="grid"` with `role="row"` and `role="gridcell"` descendants; selected cells set `aria-selected="true"`; the current date sets `aria-current="date"`; navigation buttons carry `aria-label` (previous month / next month); decorative chevron icons are `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none` on animated states.
- Touch target ≥40×40 px (or justified deviation): day cells use a 36×36 px hit area matching the Figma `--size-9` token; this is a justified deviation for dense month-grid layouts.

## Stories (Storybook)

- Default — single mode with a preselected date.
- Range — range mode showing a selected start/end with the in-range band. Justified: range selection is a distinct, mutually-exclusive mode (`mode="range"`) with its own visual state (`data-band`) that the Default single-mode story cannot demonstrate.

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
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
