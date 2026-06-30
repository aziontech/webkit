---
name: calendar
category: inputs
structure: composition
status: approved
spec_version: 3
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5087-17336
  node_id: 5087:17336
checksum: b1d756030feb2361958413f5d39fbddfebb9a8f652a8e5a98e7074eaf06d2894
created: 2026-06-25
last_updated: 2026-06-30
---

# Calendar — Component Spec

## Purpose

Date-range picker. A trigger button opens a popover that holds a one-click presets rail, one or more month grids, Start/End date + time fields, an optional timezone selector, and an Apply action; it also offers a "Select Period" mode whose text input parses relative spans (`45m`, `12 hours`, `last month`, `yesterday`, `1/1 - 1/2`). Selection is staged in a draft inside the popover and committed to `v-model` only on Apply (or immediately when `show-apply` is false). Date math uses the native `Date` API only — no date library; timezone is a selectable IANA label used for display formatting via `Intl` (the picker does not re-interpret `Date` objects across zones).

## Usage

```vue
<script setup>
import { ref } from 'vue'

import Calendar from '@aziontech/webkit/calendar'

const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })

const presets = [
  { label: 'Last 7 days', value: { start: new Date(2026, 9, 13), end: new Date(2026, 9, 19) } },
  { label: 'Last 30 days', value: { start: new Date(2026, 8, 20), end: new Date(2026, 9, 19) } }
]
</script>

<template>
  <Calendar
    v-model="range"
    mode="range"
    :number-of-months="2"
    :presets="presets"
    show-time
    show-timezone
    clearable
  />
</template>
```

The root renders the complete picker from props. For custom presets you may compose `<Calendar.Preset>` in the `presets` slot and a `<Calendar.Clear>` in the `footer` slot:

```vue
<script setup>
import Calendar from '@aziontech/webkit/calendar'
</script>

<template>
  <Calendar v-model="range" mode="range">
    <template #presets>
      <Calendar.Preset :value="{ start: new Date(2026, 9, 13), end: new Date(2026, 9, 19) }">Last 7 days</Calendar.Preset>
    </template>
    <template #footer>
      <Calendar.Clear>Clear</Calendar.Clear>
    </template>
  </Calendar>
</template>
```

Tree-shaking alternative — the standalone root + each sub-component from its own entry (no `Object.assign` compound pulled in):

```vue
<script setup>
import Calendar from '@aziontech/webkit/calendar-root'
import CalendarPreset from '@aziontech/webkit/calendar-preset'
import CalendarClear from '@aziontech/webkit/calendar-clear'
</script>
```

## Sub-components

- `calendar-preset/calendar-preset.vue` — context-aware shortcut button; applies its `value` (a `Date` in single mode or a `{ start, end }` range) to the popover's draft selection through injected context and reflects a `data-selected` state when its value matches. Placed in the `presets` slot.
- `calendar-clear/calendar-clear.vue` — context-aware button that clears the draft selection through injected context; disabled when there is no selection. Placed in the `footer` slot.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `Date \| null \| CalendarRange` | `null` | no | Committed selection for v-model. A `Date` (or null) in single mode; a `{ start, end }` range in range mode. Only updated on Apply (or immediately when `showApply` is false). |
| `mode` | `'single' \| 'range'` | `'range'` | no | Selection mode. Single picks one date; range picks a start and end date. |
| `numberOfMonths` | `number` | `1` | no | Number of month grids rendered side-by-side; one shared previous/next pair pages the whole view by a month. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Size token; affects the trigger, day-cell hit-area, and typography. |
| `min` | `Date \| undefined` | `undefined` | no | Earliest selectable date; earlier days render disabled. |
| `max` | `Date \| undefined` | `undefined` | no | Latest selectable date; later days render disabled. |
| `disabled` | `boolean` | `false` | no | Disables the trigger, grid, and all controls, applying disabled tokens. |
| `open` | `boolean \| undefined` | `undefined` | no | Controlled open state of the popover. Use with v-model:open; omit for uncontrolled. |
| `placeholder` | `string` | `'Select a Date Range'` | no | Trigger text shown when there is no selection. |
| `presets` | `CalendarPresetItem[]` | `[]` | no | Data-driven shortcuts rendered in the presets rail; each is `{ label, value }` where value is a `Date` or range. |
| `showTime` | `boolean` | `false` | no | Shows Start/End time fields alongside the date fields. |
| `showTimezone` | `boolean` | `false` | no | Shows the timezone selector below the fields. |
| `timezone` | `string` | `''` | no | Selected IANA timezone for display formatting (v-model:timezone). Empty resolves to the local zone. |
| `timezones` | `string[]` | `[]` | no | Timezone options for the selector; empty falls back to a curated list derived from `Intl`. |
| `horizontal` | `boolean` | `false` | no | Lays the fields/apply column beside the calendar instead of below it. |
| `clearable` | `boolean` | `false` | no | Shows a clear control on the trigger that empties the committed selection. |
| `showApply` | `boolean` | `true` | no | Stages edits in a draft and requires Apply to commit; when false, every edit commits immediately. |
| `period` | `boolean` | `false` | no | Enables the "Select Period" relative-time mode: a relative-preset list plus a text input that parses spans like `45m` or `last month`. |
| `split` | `boolean` | `false` | no | Renders the trigger as a split control with a separate chevron affordance. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `Date \| null \| CalendarRange` | v-model. The committed `Date` (single) or `{ start, end }` (range); empty value on clear. |
| `update:open` | `boolean` | v-model:open. Emitted when the popover opens or closes. |
| `update:timezone` | `string` | v-model:timezone. Emitted when the timezone selection changes. |
| `month-change` | `CalendarMonth` | Emitted when the first visible month changes via navigation or keyboard paging. Payload is `{ year, month }` (month is 0-indexed). |
| `apply` | `Date \| null \| CalendarRange` | Emitted when the draft selection is committed via Apply. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `trigger` | `{ open, value, displayValue }` | Replaces the default trigger button; scope exposes the open state, raw value, and formatted label. |
| `presets` | — | Custom presets rail content (e.g. `<Calendar.Preset>`); overrides the `presets` prop rendering. |
| `footer` | — | Custom footer/action-bar content (e.g. `<Calendar.Clear>`) alongside Apply. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `selected`, `in-range`, `disabled`, `today`, `outside` (adjacent-month), popover `open` / `closed`
- `data-state` on the root and trigger mirrors the popover open state (`open` | `closed`)
- `data-size` mirrors the `size` prop on the root, trigger, and each day cell (`small` | `medium` | `large`)
- `data-selected` mirrors a fully-selected day cell (single value, or a range endpoint) and an active preset
- `data-band` on each day cell drives the connected range highlight: `none` | `single` | `start` | `middle` | `end`
- `data-today` marks the current date; `data-outside` marks an adjacent-month day cell
- `data-disabled` mirrors the `disabled` prop on the root, unselectable day cells, and the clear control when there is no selection

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| popover open | `animate-popup-scale-in` | semantic (150ms · cubic-bezier) | `motion-reduce:animate-none` (instant) |
| popover close | `animate-popup-scale-out` | semantic (110ms · cubic-bezier) | `motion-reduce:animate-none` (instant) |
| hover/focus state change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| popover surface | `var(--bg-surface-raised)` |
| popover border | `var(--border-default)` |
| popover shape | `var(--shape-card)` |
| popover elevation | `var(--shadow-md)` |
| trigger / field surface | `var(--bg-surface)` |
| trigger / field border | `var(--border-default)` |
| trigger / field shape | `var(--shape-elements)` |
| section divider | `var(--border-default)` |
| label typography | `.text-label-sm` |
| weekday typography | `.text-label-sm` |
| day typography (small) | `.text-body-xs` |
| day typography (medium) | `.text-body-sm` |
| day typography (large) | `.text-body-md` |
| body / value typography | `.text-body-sm` |
| header / muted text | `var(--text-muted)` |
| default text | `var(--text-default)` |
| disabled text | `var(--text-disabled)` |
| selected day surface | `var(--secondary)` |
| selected day text | `var(--secondary-contrast)` |
| in-range band | `var(--bg-mask)` |
| hover surface | `var(--bg-hover)` |
| spacing (padding) | `var(--spacing-sm)` |
| spacing (gap) | `var(--spacing-xxs)` |
| spacing (sections) | `var(--spacing-md)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `Typography/Heading/xss` (14px regular) | `.text-body-sm` (0.875rem / 14px regular — matches the Figma size and weight) | `TODO: catalogar` — no heading-named token exists at 14px; `.text-body-sm` matches the size/weight, so the gap is naming-only. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` on the trigger and `focus-visible:ring-offset-[var(--bg-surface-raised)]` inside the popover.
- Keyboard map: the trigger toggles the popover with `Enter`/`Space` and exposes `aria-haspopup`/`aria-expanded`; `Escape` and click-outside close it and return focus to the trigger; focus is trapped in the open popover. In the grid, `Tab` enters at the focused day, `Arrow` keys move focus (paging the visible window when crossing its first/last month), `Enter`/`Space` selects, `PageUp`/`PageDown` change month. Apply, Clear, presets, fields, and the timezone control are all reachable by `Tab`.
- ARIA: each month grid uses `role="grid"` with `role="row"` and `role="gridcell"` descendants; selected cells set `aria-selected="true"`; the current date sets `aria-current="date"`; navigation buttons carry `aria-label`; the popover is labelled by the trigger; decorative icons are `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:animate-none` on the popover and `motion-reduce:transition-none` on animated states.
- Touch target ≥40×40 px (or justified deviation): day cells use a 32×32 px (`small`), 36×36 px (`medium`), or 40×40 px (`large`) hit area; `small`/`medium` are a justified deviation for dense month-grid layouts, `large` meets the 40 px target.

## Stories (Storybook)

- Default — range picker with a preselected range (trigger + popover). Justified: shows the baseline trigger→popover→grid flow.
- Sizes — composite story rendering every `size` value side-by-side (canonical, the component declares a `size` prop).
- Single — single-date mode (`mode="single"`). Justified: single is a distinct, mutually-exclusive mode the range default cannot show.
- MultiMonth — two months side-by-side (`number-of-months="2"`). Justified: a structural layout axis (shared nav, band across a month boundary) no other story exercises.
- Horizontal — `horizontal` layout with fields beside the calendar. Justified: a distinct layout the default vertical story cannot show.
- WithPresets — a `presets` rail of shortcuts. Justified: the data-driven preset behavior (one-click range + active state) cannot be shown without it.
- WithTime — `show-time` Start/End time fields. Justified: the time-field round-trip is a distinct capability.
- WithTimezone — `show-timezone` selector. Justified: the timezone control is a distinct capability.
- SelectPeriod — `period` relative-time mode (preset list + parsed text input). Justified: the relative-time parsing mode is mutually exclusive with the absolute calendar flow.
- Clearable — `clearable` trigger that empties the committed selection. Justified: the clear affordance and disabled-when-empty behavior cannot be shown without it.

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
