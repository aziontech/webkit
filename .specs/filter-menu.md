---
name: filter-menu
category: data
structure: composition
status: implemented
spec_version: 1
template: 2
checksum: e27b74113ef7853c921da889388a10c5cca37ea8722afa13e76b19aa3c384e66
created: 2026-11-14
last_updated: 2026-11-14
---

# FilterMenu — Component Spec

## Purpose

The list filter of a console list: a Filter button that carries the number of applied filters and
opens a drill-in menu. The first level lists the fields, each with a summary of what is applied to
it; picking a field slides to its values (check rows for a `multi` field, radio rows for a `single`
one, an optional avatar per value, a search box and a no-match line), and a `date` field offers
periods plus a custom range on a `Calendar`. Back returns to the fields, Clear removes the field's
filter, and the panel's height follows each level. `FilterMenu.Chips` shows the applied fields as
chips under the controls row: the field label in muted ink, an avatar stack, the first value and
`+N`; activating a chip reopens the menu at that field, removing it clears the field. The value is a
`Record<fieldId, values[]>` bound with `v-model`; the menu never filters anything itself.
`Table.Filter` and `Table.AppliedFilters` render it with `kind="menu"` and map it onto the table's
`filters` model.

It differs from `property-filter` (one text field that builds `property operator value` tokens and
combines them with and/or) and from the `table-filter` builder (a field + operator + value form):
this menu offers only the values a field has, one click each, which is what most lists need.

## When to use

- A resource list or table filtered by a few closed-set fields (status, owner, region, type) and a modification date.
- A catalog or listing page (marketplace, templates, posts) that narrows by category, author or date, outside a table.
- Filters people pick rather than type, where each field has a short list of values.

## When NOT to use

- Filters typed as text, with operators or and/or logic, or a query people keep as text → use `property-filter`.
- A table that needs comparisons on numbers or free-text conditions → use `table-filter` with its builder.
- Two to four fixed choices always on screen → use `toggle-group` or selectable `chip`s.
- A single search over names → use `input`, or `table-search` inside a table.

## Related

- `table` — `Table.Filter` and `Table.AppliedFilters` with `kind="menu"` render this menu and its chips over the table's `filters` model.
- `property-filter` — the token-based filter field for typed queries.
- `popover` — the overlay the menu opens in.
- `calendar` — the range picker the custom date period uses.
- `chip` — each applied filter in `FilterMenu.Chips`.

## Best practices

- Put the Filter button first in the controls row, before the search field, and `FilterMenu.Chips` on its own row below the controls.
- Pass the same `fields` array and the same `v-model` to the menu and to its chips: chips reopen the menu that shares their `fields`.
- Give people-like values an `avatar` (an image URL, or `''` for initials) so the chip shows who is filtered.
- Keep each field to the values that exist in the data; a field with no values is noise.
- Filter the data in the page (or on the server) from the model; read a date preset value (`24h`, `7d`, `30d`, `3m`) as a window ending now and a range value as its `start` and `end`.

## Usage

```vue
<script setup>
  import FilterMenu from '@aziontech/webkit/filter-menu'
  import { ref } from 'vue'

  const fields = [
    {
      id: 'owner',
      label: 'Author',
      options: [
        { value: 'jane', label: 'Jane Doe', avatar: '' },
        { value: 'john', label: 'John Smith', avatar: '' }
      ]
    },
    {
      id: 'status',
      label: 'Status',
      kind: 'single',
      options: [
        { value: 'live', label: 'Live' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    { id: 'modified', label: 'Last modified', kind: 'date' }
  ]
  const filters = ref({ status: ['live'] })
</script>

<template>
  <FilterMenu
    v-model="filters"
    :fields="fields"
  />
  <FilterMenu.Chips
    v-model="filters"
    :fields="fields"
  />
</template>
```

Tree-shaking alternative — the standalone root and the chips from their own entries:

```vue
<script setup>
  import FilterMenu from '@aziontech/webkit/filter-menu-root'
  import FilterMenuChips from '@aziontech/webkit/filter-menu-chips'
</script>
```

## Sub-components

The root ships a compound API: `index.ts` attaches `Chips` to the root and re-exports the types. The
menu and its chips are siblings in the page (the controls row and the row below it), so they share
no provider: chips and a menu that receive the **same `fields` array** are linked through a
per-array channel (`composables/use-filter-menu-channel.ts`, module scope, keyed by the raw array),
so activating a chip opens that menu at the chip's field with no wiring. When the arrays differ (as
in `Table.AppliedFilters`, which links through the table context), the consumer calls the root's
exposed `open(fieldId)`.

- `filter-menu-chips/filter-menu-chips.vue` — One filled, clickable, removable `Chip` per applied field, in `fields` order, inside a `role="group"` named `Applied filters`. Each chip reads `<field label>` (muted) + up to three option avatars (when the picked options carry `avatar`) + the first value's label + `+N` (muted) when more values are picked. Chips enter, leave and reflow with a `TransitionGroup`. Renders nothing when no field is applied.
  - Props: `fields?: FilterMenuField[]` (default `[]` — the same array the menu receives).
  - v-model: `Record<string, FilterMenuValue[]>` (default `{}`); removing a chip deletes the field's key.
  - Events: `edit: [event: MouseEvent | KeyboardEvent, field: FilterMenuField]` (a chip was activated; the linked menu opens at the field), `remove: [event: MouseEvent, field: FilterMenuField]` (a chip's remove button was pressed; the model loses the field).
  - Slots: none.
  - `data-testid` fallback: `data-filter-menu-chips`; each chip `<testid>__chip-<fieldId>`.

Resulting layout:

```
packages/webkit/src/components/data/filter-menu/
├── filter-menu.vue
├── filter-menu.test.ts
├── index.ts
├── types.ts                         (FilterMenuField, FilterMenuOption, FilterMenuValue, FilterMenuRange, FilterMenuModel)
├── summarize.ts                     (field summaries shared by the menu rows and the chips)
├── composables/
│   ├── use-filter-menu-channel.ts   (open requests from chips to the menu sharing their fields)
│   ├── use-filter-menu-labels.ts    (period options, range and summary text from the locale)
│   └── use-animated-height.ts       (height transition between levels; cleans up on scope dispose)
└── filter-menu-chips/
    └── filter-menu-chips.vue
```

Exports:

```jsonc
"./filter-menu": "./src/components/data/filter-menu/index.ts",
"./filter-menu-root": "./src/components/data/filter-menu/filter-menu.vue",
"./filter-menu-chips": "./src/components/data/filter-menu/filter-menu-chips/filter-menu-chips.vue"
```

Exported types (from `index.ts`):

- `FilterMenuOption = { value: string | number; label: string; avatar?: string }` — `avatar` present (an image URL, or `''` for initials from `label`) draws an `Avatar` on the row and in the chip.
- `FilterMenuField = { id: string; label: string; kind?: 'multi' | 'single' | 'date'; options?: FilterMenuOption[] }` — `kind` defaults to `multi`. A `date` field without `options` offers the built-in periods (`24h`, `7d`, `30d`, `3m`); with `options` it offers those instead. Every `date` field ends with a Custom range row.
- `FilterMenuRange = { start: Date | null; end: Date | null }` — a custom date range.
- `FilterMenuValue = string | number | FilterMenuRange`.
- `FilterMenuModel = Record<string, FilterMenuValue[]>` — a field with no key (or an empty array) is not applied.

Imperative API (root, `defineExpose`): `open(fieldId?: string, returnFocus?: HTMLElement | null)` — opens the menu, at the given field's values when `fieldId` names a field, and returns focus to `returnFocus` (when still in the document) instead of the trigger when it closes.

## Props

| Prop     | Type                             | Default    | Required | JSDoc                                                                 |
| -------- | -------------------------------- | ---------- | -------- | --------------------------------------------------------------------- |
| `fields` | `FilterMenuField[]`              | `[]`       | false    | Fields the menu lists, in order, each with its kind and values.       |
| `label`  | `string`                         | `''`       | false    | Text of the trigger button. Empty uses the locale catalog (`Filter`). |
| `size`   | `'small' \| 'medium' \| 'large'` | `'medium'` | false    | Size token of the trigger button.                                     |

## v-model

| Model     | Type              | Default | Emits               | Notes                                                                                                                     |
| --------- | ----------------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `FilterMenuModel` | `{}`    | `update:modelValue` | Applied values per field id. Every pick emits a new object; clearing a field (Clear, or a chip's remove) deletes its key. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: trigger `default`, `hover`, `focus-visible`, `active`; rows `hover`, `focus-visible`, checked (a check glyph at the end edge).
- `data-state` on the root and the trigger: `open` | `closed` (from `Popover`).
- `data-level` on the panel's level: `fields`, `values:<fieldId>`, `custom:<fieldId>`.
- `data-applied` on a field row when the field has values.
- Count: the trigger shows a small primary `Badge` with the number of applied fields and drops it at 0.
- Empty: a level with no rows matching the search shows `No match for “<query>”.`; a menu with no `fields` shows the same line for the empty query.
- `loading`, `error`, `disabled`, `readonly`, `invalid`: not states of this component — the page owns the data, and the trigger is always available.

## Motion & Animations

| Trigger                                 | Animation / Transition                                                                                   | Token                                                                                                  | Reduced-motion fallback                                                                    |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| open / close the panel                  | `Popover` owns its open and close motion on `Popover.Content`                                            | semantic                                                                                               | handled by `Popover`                                                                       |
| count badge appears / goes              | `transition-[transform,scale,opacity]` from `scale-75 opacity-0`                                         | `duration-fast-02` · `ease-productive-entrance` / `ease-productive-exit`                               | `motion-reduce:transition-none`                                                            |
| level change (fields ↔ values ↔ custom) | `transition-[translate,opacity]`, entering from 12 % toward the direction of travel (mirrored under rtl) | `duration-moderate-01` · `ease-productive-entrance`; leave `duration-fast-02` · `ease-productive-exit` | `motion-reduce:transition-none`                                                            |
| panel height between levels             | `transition-[height]` on the level region                                                                | `duration-moderate-01` · `ease-productive-entrance`                                                    | `motion-reduce:transition-none`; the composable skips the measurement under reduced motion |
| row hover / focus                       | `transition-colors`                                                                                      | `duration-fast-02` · `ease-productive-entrance`                                                        | `motion-reduce:transition-none`                                                            |
| chip enters / leaves / reflows          | `TransitionGroup`: `transition-[transform,translate,scale,opacity]` from `scale-90 opacity-0`            | `duration-moderate-01` · `ease-productive-entrance`; leave `duration-fast-02` · `ease-productive-exit` | `motion-reduce:transition-none`                                                            |

## Tokens

| Region                       | Token (DESIGN.md)       |
| ---------------------------- | ----------------------- |
| row and chip text            | `.text-label-sm`        |
| row text                     | `var(--text-default)`   |
| summary, field label in chip | `var(--text-muted)`     |
| row hover                    | `var(--bg-hover)`       |
| level dividers               | `var(--border-default)` |
| row shape                    | `var(--shape-elements)` |
| row padding                  | `var(--spacing-sm)`     |
| gaps, search padding         | `var(--spacing-xs)`     |
| list padding, avatar gap     | `var(--spacing-xxs)`    |
| custom range padding         | `var(--spacing-md)`     |
| focus ring                   | `var(--ring-color)`     |
| avatar ring in the chip      | `var(--bg-surface)`     |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | none      |

## Accessibility (WCAG 2.1 AA)

- Pattern: a disclosure button that opens a non-modal dialog (`Popover`, named by a visually hidden `Popover.Title` with the trigger label). Fields are buttons; a `multi` field's values are `role="checkbox"` buttons with `aria-checked` inside a `role="group"` named by the field; a `single` or `date` field's values are `role="radio"` buttons with `aria-checked` inside a `role="radiogroup"`. The Custom range row is a plain button.
- Trigger name: the label, plus the count when filters apply (`Filter, 2 applied`); the badge is `aria-hidden`. Field rows read `<field> <summary>`.
- Keyboard map: `Enter` / `Space` on the trigger toggles the panel; `ArrowDown` / `ArrowUp` move between the rows of the current level and wrap; `Enter` / `Space` on a field row opens its values, on a value row toggles it; focus moves to the first row of every new level; `Tab` / `Shift+Tab` cycle the search box, rows, Back and Clear inside the panel (Popover's trap); `Escape` closes the panel and returns focus to the trigger, or to the chip that opened it while that chip still exists. While the custom range calendar is open, `Escape` closes the calendar first. On a chip, `Enter` / `Space` reopen the menu at its field and the remove button clears it.
- Visible focus: rows and Back use `focus-visible:ring-2 focus-visible:ring-(--ring-color)`; the trigger, search box, chips and calendar carry their own rings.
- Contrast: row text `--text-default` and muted summaries `--text-muted` on the raised surface meet 4.5:1; the check glyph and chevrons are text-colored (3:1 or more).
- `motion-reduce:transition-none` on every transition above.
- Touch target: rows are full-width and at least 32 px tall; on `pointer: coarse` they grow to 44 px (`pointer-coarse:min-h-11`).

## Internationalization

| Key                            | English source                    | Override prop      |
| ------------------------------ | --------------------------------- | ------------------ |
| `filterMenu.label`             | Filter                            | `label`            |
| `filterMenu.triggerCount`      | {label}, {count} applied (plural) | —                  |
| `filterMenu.searchFields`      | Filter by…                        | —                  |
| `filterMenu.searchFieldsLabel` | Search filter fields              | —                  |
| `filterMenu.searchValues`      | Filter {field}…                   | —                  |
| `filterMenu.searchValuesLabel` | Search {field} values             | —                  |
| `filterMenu.back`              | Back to all filters               | —                  |
| `filterMenu.backToPeriods`     | Back to date periods              | —                  |
| `filterMenu.noMatch`           | No match for “{query}”.           | —                  |
| `filterMenu.clear`             | Clear {field}                     | —                  |
| `filterMenu.last24Hours`       | Last 24 hours                     | `fields[].options` |
| `filterMenu.last7Days`         | Last 7 days                       | `fields[].options` |
| `filterMenu.last30Days`        | Last 30 days                      | `fields[].options` |
| `filterMenu.last3Months`       | Last 3 months                     | `fields[].options` |
| `filterMenu.customRange`       | Custom range…                     | —                  |
| `filterMenu.pickRange`         | Pick a range                      | —                  |
| `filterMenu.rangeBetween`      | {start} – {end}                   | —                  |
| `filterMenu.rangeSince`        | Since {date}                      | —                  |
| `filterMenu.rangeUntil`        | Until {date}                      | —                  |
| `filterMenu.more`              | +{count}                          | —                  |
| `filterMenu.applied`           | Applied filters                   | —                  |

- Formatting: custom range dates through `formatDate` from `useLocale` (`Intl.DateTimeFormat`, `{ month: 'short', day: 'numeric' }`) with the provider locale; `+N` and the trigger count through the catalog's plural forms. The field label inside the search placeholder is lower-cased with the provider locale (`toLocaleLowerCase`).

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `-end-2` for the badge, `text-start`).
- Icons: the Back chevron (`pi pi-angle-left`) and the row chevrons (`pi pi-angle-right`) mirror under rtl (`rtl:-scale-x-100`; IconButton mirrors its own directional icons); the funnel, search, check and filter-slash glyphs do not.
- Keyboard: `ArrowUp` / `ArrowDown` are vertical and unchanged. The level slide enters from the inline end going forward and from the inline start going back, so it mirrors with the direction from `WebkitProvider`.
- User data: field labels, value labels and summaries render in `<bdi>` so an author name or a domain keeps its own direction.

## Responsive

- Container queries: none; the trigger is a fixed-size button and the panel is sized by `Popover` (between `--container-3xs` and `--container-xs`).
- Narrow (≤ 640 px or a narrow container): the panel keeps its width and `Popover` keeps it inside the viewport; long labels truncate with the full text in the accessible name; the value list scrolls inside a height cap. Chips wrap to new lines.
- Touch: rows ≥ 32 px (44 px on `pointer: coarse`); the chips and the trigger use their components' targets; nothing is hover-only.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: 22.1 KB gzip for `./filter-menu-root` and 24.9 KB for `./filter-menu` (root and chips), both measured on the initial chunk (`entryOnly`) because the `Calendar` loads only when a custom range is opened (`defineAsyncComponent`); 20 KB for `./filter-menu-chips`, most of it `Chip` and `Avatar`. All in `.size-limit.json`.
- Runtime budget: 200 values in a field open and filter by search within one frame; a pick re-renders only the open level.
- Heavy parts: `Calendar`, lazy-loaded.

## Examples

- Default — a menu with an author field (avatars), a status field (`single`) and a date field, with its chips below and one filter applied.
- Sizes — composite example rendering the trigger at every `size` side by side.

The table pairing (`Table.Filter` / `Table.AppliedFilters` with `kind="menu"`) is shown by the table's Filter Menu example.

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
