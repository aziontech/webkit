---
name: date-range-picker
category: inputs
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 1fa6f2c8e67c406d8b6dfad9ce44b2633a10a7b8ec927c2c58bfe9ca090c44a4
created: 2026-11-11
last_updated: 2026-11-11
---

# DateRangePicker — Component Spec

## Purpose

A time range for queries over time: logs, events, traces and metrics. After the Console Kit date-time range (quick ranges, absolute range with times, previous and next) and Cloudscape's date range picker. The value is either **relative** (`{ type: 'relative', amount: 15, unit: 'minute' }`, read as "the last 15 minutes" and re-resolved against the clock on every query, so a live view keeps moving) or **absolute** (`{ type: 'absolute', start, end }`, two ISO 8601 instants). The trigger prints `Last 15 minutes` or the absolute range in the selected time zone with its UTC offset. The panel switches between Relative range (the quick ranges and a custom duration) and Absolute range (the `Calendar` month grid, start and end date and time fields, and the time zone selector) and commits only on Apply; Cancel and Escape drop the draft. Absolute boundaries are typed as wall-clock time in the selected zone and stored as instants, so the same value reads correctly in every zone. With `showStep`, Previous and Next move the range by its own length. Date math uses `Intl` and the native `Date` only.

## When to use

- Filtering events, logs, traces or metrics by time, where "the last N minutes" must stay relative.
- Any range that needs times of day and a time zone, not only dates.
- Investigations that page through time window by window (`show-step`).

## When NOT to use

- Picking whole days for a report or a billing period, with day presets → use `calendar`.
- A single date or a date and time → use `calendar` with `mode="single"`.
- A fixed list of named intervals and nothing custom → use `select` or `toggle-group`.

## Related

- `calendar` — the month grid, the date and time fields and the time zone selector come from it, so both pickers look and behave the same.
- `property-filter` — the query bar it sits next to in an events toolbar.
- `chart` — the histogram whose brush usually writes an absolute range back into this picker.

## Best practices

- Keep relative values relative: resolve them to instants when the query runs (`now - amount × unit` to `now`), never when the user picks them.
- Pass `now` in tests, demos and server-rendered pages so labels and step limits are deterministic.
- Bind `v-model:time-zone` to the user's saved preference, and show times elsewhere on the page in the same zone.
- Set `max` (usually now) and `min` (the retention limit) instead of validating after Apply.
- Name the picker after what it filters (`aria-label="Events time range"`).

## Usage

```vue
<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const range = ref({ type: 'relative', amount: 15, unit: 'minute', key: 'last-15-minutes' })
  const timeZone = ref('America/Sao_Paulo')
</script>

<template>
  <DateRangePicker
    v-model="range"
    v-model:time-zone="timeZone"
    show-step
    aria-label="Events time range"
  />
</template>
```

## Props

| Prop                | Type                                              | Default                          | Required | JSDoc                                                                                                              |
| ------------------- | ------------------------------------------------- | -------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `modelValue`        | `DateRangeValue \| null`                          | `null`                           | false    | The committed range: relative (last N units, re-resolved against now) or absolute (ISO instants). Supports v-model. |
| `relativeOptions`   | `RelativeOption[]`                                | 5m, 15m, 1h, 6h, 24h, 7d, 30d    | false    | Quick ranges listed on the Relative tab.                                                                           |
| `timeZone`          | `string`                                          | `''`                             | false    | IANA time zone the absolute range is typed and shown in. Empty uses the local zone. Supports v-model:timeZone.     |
| `timeZones`         | `string[]`                                        | `[]`                             | false    | Zones offered by the selector. Empty falls back to the zones `Intl` supports.                                      |
| `showTimeZone`      | `boolean`                                         | `true`                           | false    | Shows the time zone selector in the panel.                                                                         |
| `showStep`          | `boolean`                                         | `false`                          | false    | Shows Previous and Next buttons that move the range back or forward by its own length.                             |
| `rangeSelectorMode` | `'default' \| 'relative-only' \| 'absolute-only'` | `'default'`                      | false    | Which kinds of range the panel offers.                                                                             |
| `min`               | `Date`                                            | undefined                        | false    | Earliest instant an absolute range may start at.                                                                   |
| `max`               | `Date`                                            | undefined                        | false    | Latest instant an absolute range may end at.                                                                       |
| `now`               | `Date`                                            | undefined                        | false    | Reference clock for relative ranges and stepping. Unset reads the real clock.                                      |
| `placeholder`       | `string`                                          | `''`                             | false    | Trigger text with no range. Empty uses the locale catalog.                                                         |
| `ariaLabel`         | `string`                                          | `''`                             | false    | Accessible name of the trigger. Empty uses the locale catalog.                                                     |
| `disabled`          | `boolean`                                         | `false`                          | false    | Disables the trigger and the step buttons.                                                                         |
| `size`              | `'small' \| 'medium' \| 'large'`                  | `'medium'`                       | false    | Size token of the trigger and the panel controls.                                                                  |

Types (exported from the component): `DateRangeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'`; `DateRangeValue = { type: 'relative'; amount: number; unit: DateRangeUnit; key?: string } | { type: 'absolute'; start: string; end: string }`; `RelativeOption = { key: string; amount: number; unit: DateRangeUnit; label?: string }` (an empty `label` prints `Last {count} {unit}` from the catalog).

## Events

| Event               | Payload                  | Notes                                                                                     |
| ------------------- | ------------------------ | ----------------------------------------------------------------------------------------- |
| `update:modelValue` | `DateRangeValue \| null` | Apply with a valid draft, or Previous / Next (always an absolute range).                  |
| `update:timeZone`   | `string`                 | Apply after the zone changed in the panel.                                                |

## Slots

_none_ — the trigger, the panel and its two tabs are fixed parts.

## States

- Visual states: `default`, `hover`, `focus-visible`, `open`, `disabled`; the panel shows an inline error after an Apply that the draft cannot satisfy.
- `data-state="open|closed"` on the root and the panel; `data-size`; `data-disabled`; `data-empty` on the trigger with no value; `data-selected` on the chosen quick range.
- The Next button is disabled while the range is relative (it already ends now) or when the step would pass `max` (or now); Previous is disabled when the step would pass `min`.

## Behaviour

- Opening seeds the draft from the committed value: a relative value opens the Relative tab with its option (or Custom range) selected; an absolute value opens the Absolute tab with its boundaries as wall-clock time in the zone.
- Changing the zone in the panel keeps the same instants and re-expresses the draft in the new zone; the trigger of a committed absolute range re-labels when `timeZone` changes.
- Apply validates: a custom duration must be a whole number above 0; an absolute range needs a start and an end, the end after the start, and both inside `min` and `max`. The message is announced (`role="alert"`) and the panel stays open.
- Previous and Next resolve the current value (relative values against `now`) and emit the absolute range shifted by its length.

## Motion & Animations

| Trigger         | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| --------------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| panel open      | `animate-popup-scale-in`                  | semantic (150ms · cubic-bezier)                   | `motion-reduce:animate-none`    |
| panel close     | `animate-popup-scale-out`                 | semantic (110ms · cubic-bezier)                   | `motion-reduce:animate-none`    |
| chevron         | `transition-transform duration-150 ease-out` | inline (matches `calendar`)                    | `motion-reduce:transition-none` |
| hover / options | `transition-colors duration-150 ease-out` | inline (matches `calendar`)                       | `motion-reduce:transition-none` |

## Tokens

| Region           | Token (DESIGN.md)                                   |
| ---------------- | --------------------------------------------------- |
| trigger surface  | `var(--bg-surface)`, `var(--border-default)`, hover `var(--border-strong)` |
| panel surface    | `var(--bg-surface-raised)`, `var(--shadow-sm)`, `var(--shape-card)` |
| selected option  | `var(--bg-selected)`; hover `var(--bg-hover)`       |
| muted text       | `var(--text-muted)`                                 |
| error message    | `var(--danger-contrast)`                            |
| gaps             | `var(--spacing-xxs)`, `var(--spacing-xs)`, `var(--spacing-sm)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: a 2 px `--ring-color` ring inset on each trigger segment; the quick ranges ring their row when the radio inside has focus.
- Keyboard map: `Enter`/`Space` on the trigger opens the panel and the focus trap moves into it; `Tab` cycles inside the panel; the range type is a `ToggleGroup` (arrow keys); the quick ranges are native radios (`ArrowUp`/`ArrowDown` move and select); the grid keeps the `calendar` keyboard map; `Escape` closes without committing and returns focus to the trigger.
- ARIA: the trigger has `aria-haspopup="dialog"`, `aria-expanded` and a name that starts with the picker's label and contains the visible range; the panel is a named `dialog`; the quick ranges are a `fieldset` with a `legend`; the custom duration and unit have visible labels; the error is `role="alert"` and described from the duration field; Previous and Next are named buttons.
- Targets: options are 32 px high (44 px on `pointer: coarse`).
- Contrast ≥4.5:1 from the semantic text tokens.

## Internationalization

| Key                                       | English source                                    | Override prop |
| ----------------------------------------- | ------------------------------------------------- | ------------- |
| `dateRangePicker.label`                   | Time range                                        | `ariaLabel`   |
| `dateRangePicker.placeholder`             | Select a time range                               | `placeholder` |
| `dateRangePicker.dialog`                  | Choose a time range                               | —             |
| `dateRangePicker.rangeType`               | Range type                                        | —             |
| `dateRangePicker.relative` / `absolute`   | Relative range / Absolute range                   | —             |
| `dateRangePicker.quickRanges`             | Quick ranges                                      | —             |
| `dateRangePicker.custom`                  | Custom range                                      | —             |
| `dateRangePicker.amount` / `unit`         | Duration / Unit                                   | —             |
| `dateRangePicker.second` … `year`         | Last second / Last {count} seconds … (plural)     | `RelativeOption.label` |
| `dateRangePicker.unitSecond` … `unitYear` | Seconds … Years                                   | —             |
| `dateRangePicker.apply` / `cancel`        | Apply / Cancel                                    | —             |
| `dateRangePicker.previous` / `next`       | Previous range / Next range                       | —             |
| `dateRangePicker.incomplete`              | Choose a start and an end.                        | —             |
| `dateRangePicker.order`                   | The end must be after the start.                  | —             |
| `dateRangePicker.outOfBounds`             | Choose a range inside the allowed dates.          | —             |
| `dateRangePicker.invalidAmount`           | Enter a whole number greater than 0.              | —             |

- Formatting: the absolute range goes through `Intl.DateTimeFormat` in the active locale; the relative labels through the plural rules of the active locale; the grid, the date and time fields and the time zone selector use the `calendar` keys.

## Right-to-left

- Layout: logical utilities only (`border-s`, `border-e`, `ps-`/`pe-`, `end-`, `text-start`); the panel anchors to the start edge of the trigger.
- Icons: the Previous and Next chevrons mirror (`rtl:-scale-x-100`); the clock and calendar glyphs do not.
- Keyboard: the grid's arrow keys follow the reading direction (from `calendar`).
- User data: the range text sits in `<bdi>`.
- Teleported content: the panel binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`).

## Responsive

- Container queries: none; the trigger is inline and truncates its text inside the available width (`max-w-full`).
- Narrow (≤ 640 px): the panel is at most `min(90vw, 24rem)` wide and scrolls inside itself when taller than the viewport.
- Touch: options are 44 px high on `pointer: coarse`; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: 26 KB gzip for `./date-range-picker` (it carries the `calendar` grid, fields and time zone selector, `toggle-group`, `button`, `input` and the placement and focus-trap composables) in `.size-limit.json`.
- Runtime budget: zone conversion is two `Intl.DateTimeFormat#formatToParts` calls per boundary; nothing runs per frame.
- Heavy parts: none; the panel renders only while open.

## Stories (Storybook)

- Default — a relative range.
- Absolute, RelativeOnly, WithStep, TimeZone — justified: each documents one of the range modes or the time zone contract, which have no `kind`/`size` axis.

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
