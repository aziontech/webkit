# Filter Menu

> The list filter of a console list: a Filter button that carries the number of applied filters and opens a drill-in menu. The first level lists the fields, each with a summary of what is applied to it; picking a field slides to its values (check rows for a `multi` field, radio rows for a `single` one, an optional avatar per value, a search box and a no-match line), and a `date` field offers periods plus a custom range on a `Calendar`. Back returns to the fields, Clear removes the field's filter, and the panel's height follows each level. `FilterMenu.Chips` shows the applied fields as chips under the controls row: the field label in muted ink, an avatar stack, the first value and `+N`; activating a chip reopens the menu at that field, removing it clears the field. The value is a `Record<fieldId, values[]>` bound with `v-model`; the menu never filters anything itself. `Table.Filter` and `Table.AppliedFilters` render it with `kind="menu"` and map it onto the table's `filters` model. It differs from `property-filter` (one text field that builds `property operator value` tokens and combines them with and/or) and from the `table-filter` builder (a field + operator + value form): this menu offers only the values a field has, one click each, which is what most lists need.

- Import: `import FilterMenuRoot from '@aziontech/webkit/filter-menu-root'`
- Compound import (dot notation, not tree-shakeable): `import FilterMenu from '@aziontech/webkit/filter-menu'`
- Category: data · Surface: product · Structure: composition
- API as JSON: [filter-menu.json](https://github.com/aziontech/webkit/blob/main/.specs/filter-menu.json)

## When to use

- A resource list or table filtered by a few closed-set fields (status, owner, region, type) and a modification date.
- A catalog or listing page (marketplace, templates, posts) that narrows by category, author or date, outside a table.
- Filters people pick rather than type, where each field has a short list of values.

## Do

- Put the Filter button first in the controls row, before the search field, and `FilterMenu.Chips` on its own row below the controls.
- Pass the same `fields` array and the same `v-model` to the menu and to its chips: chips reopen the menu that shares their `fields`.
- Give people-like values an `avatar` (an image URL, or `''` for initials) so the chip shows who is filtered.
- Keep each field to the values that exist in the data; a field with no values is noise.
- Filter the data in the page (or on the server) from the model; read a date preset value (`24h`, `7d`, `30d`, `3m`) as a window ending now and a range value as its `start` and `end`.

## Don’t

- Filters typed as text, with operators or and/or logic, or a query people keep as text → use `property-filter`.
- A table that needs comparisons on numbers or free-text conditions → use `table-filter` with its builder.
- Two to four fixed choices always on screen → use `toggle-group` or selectable `chip`s.
- A single search over names → use `input`, or `table-search` inside a table.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [table](table.md) — `Table.Filter` and `Table.AppliedFilters` with `kind="menu"` render this menu and its chips over the table's `filters` model.
- [property-filter](property-filter.md) — the token-based filter field for typed queries.
- [popover](popover.md) — the overlay the menu opens in.
- [calendar](calendar.md) — the range picker the custom date period uses.
- [chip](chip.md) — each applied filter in `FilterMenu.Chips`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `fields` | `FilterMenuField[]` | `[]` | false | Fields the menu lists, in order, each with its kind and values. |
| `label` | `string` | `''` | false | Text of the trigger button. Empty uses the locale catalog (`Filter`). |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token of the trigger button. |
| `modelValue` | `FilterMenuModel` | `—` | false | Two-way value (`v-model`). |

## Sub-component imports

- `@aziontech/webkit/filter-menu-chips`

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

## v-model

| Model     | Type              | Default | Emits               | Notes                                                                                                                     |
| --------- | ----------------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `FilterMenuModel` | `{}`    | `update:modelValue` | Applied values per field id. Every pick emits a new object; clearing a field (Clear, or a chip's remove) deletes its key. |

## States

- Visual states: trigger `default`, `hover`, `focus-visible`, `active`; rows `hover`, `focus-visible`, checked (a check glyph at the end edge).
- `data-state` on the root and the trigger: `open` | `closed` (from `Popover`).
- `data-level` on the panel's level: `fields`, `values:<fieldId>`, `custom:<fieldId>`.
- `data-applied` on a field row when the field has values.
- Count: the trigger shows a small primary `Badge` with the number of applied fields and drops it at 0.
- Empty: a level with no rows matching the search shows `No match for “<query>”.`; a menu with no `fields` shows the same line for the empty query.
- `loading`, `error`, `disabled`, `readonly`, `invalid`: not states of this component — the page owns the data, and the trigger is always available.

## Accessibility

- Pattern: a disclosure button that opens a non-modal dialog (`Popover`, named by a visually hidden `Popover.Title` with the trigger label). Fields are buttons; a `multi` field's values are `role="checkbox"` buttons with `aria-checked` inside a `role="group"` named by the field; a `single` or `date` field's values are `role="radio"` buttons with `aria-checked` inside a `role="radiogroup"`. The Custom range row is a plain button.
- Trigger name: the label, plus the count when filters apply (`Filter, 2 applied`); the badge is `aria-hidden`. Field rows read `<field> <summary>`.
- Keyboard map: `Enter` / `Space` on the trigger toggles the panel; `ArrowDown` / `ArrowUp` move between the rows of the current level and wrap; `Enter` / `Space` on a field row opens its values, on a value row toggles it; focus moves to the first row of every new level; `Tab` / `Shift+Tab` cycle the search box, rows, Back and Clear inside the panel (Popover's trap); `Escape` closes the panel and returns focus to the trigger, or to the chip that opened it while that chip still exists. While the custom range calendar is open, `Escape` closes the calendar first. On a chip, `Enter` / `Space` reopen the menu at its field and the remove button clears it.
- Visible focus: rows and Back use `focus-visible:ring-2 focus-visible:ring-(--ring-color)`; the trigger, search box, chips and calendar carry their own rings.
- Contrast: row text `--text-default` and muted summaries `--text-muted` on the raised surface meet 4.5:1; the check glyph and chevrons are text-colored (3:1 or more).
- `motion-reduce:transition-none` on every transition above.
- Touch target: rows are full-width and at least 32 px tall; on `pointer: coarse` they grow to 44 px (`pointer-coarse:min-h-11`).

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `-end-2` for the badge, `text-start`).
- Icons: the Back chevron (`pi pi-angle-left`) and the row chevrons (`pi pi-angle-right`) mirror under rtl (`rtl:-scale-x-100`; IconButton mirrors its own directional icons); the funnel, search, check and filter-slash glyphs do not.
- Keyboard: `ArrowUp` / `ArrowDown` are vertical and unchanged. The level slide enters from the inline end going forward and from the inline start going back, so it mirrors with the direction from `WebkitProvider`.
- User data: field labels, value labels and summaries render in `<bdi>` so an author name or a domain keeps its own direction.

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

## Responsive

- Container queries: none; the trigger is a fixed-size button and the panel is sized by `Popover` (between `--container-3xs` and `--container-xs`).
- Narrow (≤ 640 px or a narrow container): the panel keeps its width and `Popover` keeps it inside the viewport; long labels truncate with the full text in the accessible name; the value list scrolls inside a height cap. Chips wrap to new lines.
- Touch: rows ≥ 32 px (44 px on `pointer: coarse`); the chips and the trigger use their components' targets; nothing is hover-only.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

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
        { value: 'john', label: 'John Smith', avatar: '' },
        { value: 'priya', label: 'Priya Patel', avatar: '' }
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

  const filters = ref({ owner: ['jane', 'priya'] })
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <FilterMenu
      v-model="filters"
      :fields="fields"
    />
    <FilterMenu.Chips
      v-model="filters"
      :fields="fields"
    />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import FilterMenu from '@aziontech/webkit/filter-menu-root'
  import { ref } from 'vue'

  const fields = [
    {
      id: 'status',
      label: 'Status',
      options: [
        { value: 'live', label: 'Live' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ]

  const small = ref({ status: ['live'] })
  const medium = ref({ status: ['live'] })
  const large = ref({ status: ['live'] })
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <FilterMenu
      v-model="small"
      :fields="fields"
      size="small"
    />
    <FilterMenu
      v-model="medium"
      :fields="fields"
      size="medium"
    />
    <FilterMenu
      v-model="large"
      :fields="fields"
      size="large"
    />
  </div>
</template>
```
