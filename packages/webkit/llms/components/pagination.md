# Pagination

> Pagination controls for tables and lists, pixel-perfect to Figma, in two modes. **Composition mode** (default): a three-region landmark — page-info text, navigation buttons (Previous / page numbers / overflow / Next), and a rows-per-page selector — wired by hand through slots, with the consumer owning the current page, total, and page-size state. **Data-driven mode**: pass `total` (and optionally `page` / `pageSize`) and the Pagination renders its own info text, Previous / windowed page numbers / overflow ellipsis / Next, and the rows-per-page selector, emitting `update:page` / `update:pageSize` so the consumer can bind state via `v-model`. This component owns markup, tokens, and a11y; the data engine is a small internal page-window calculation — **no external pagination library**. Pairs with the [`Table`](table.md) component.

- Import: `import PaginationRoot from '@aziontech/webkit/pagination-root'`
- Compound import (dot notation, not tree-shakeable): `import Pagination from '@aziontech/webkit/pagination'`
- Category: data · Surface: product · Structure: composition
- API as JSON: [pagination.json](https://github.com/aziontech/webkit/blob/main/.specs/pagination.json)

## When to use

- A list or table outside `table`'s own footer needs page navigation and a rows-per-page selector.
- You know the item count — pass `total` and bind `v-model:page` / `v-model:page-size`; the component renders the info text, the windowed page numbers and the selector.
- The page strip needs custom content (a different info line, extra controls) — compose `Pagination.Info`, `Pagination.Button` and `Pagination.PageSize` through the slots.

## Do

- Prefer data-driven mode (`total` set); in composition mode the root emits nothing and you own every button's `selected` / `disabled` state and every click.
- page` is 1-based. Changing the page size through the selector emits `update:pageSize` and resets the page to `1`.
- Keep `page-size-options` aligned with what your data source accepts; the default is `[10, 25, 50, 100]`.
- Tune `sibling-count` (default `1`) instead of hiding buttons — it controls how many numbers sit on each side of the current page before the overflow ellipsis.
- Set `aria-label` when a page carries more than one pagination, so each navigation landmark has a distinct name.

## Don’t

- The rows live in a data-driven `table` → set `paginated` on the table; it renders this pagination in its footer and wires it for you.
- It is the previous / next pair at the end of a documentation page → use `doc-pagination`.
- The content loads more as the reader scrolls or clicks "Load more" → use a `button` at the end of the list.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [table](table.md) — renders a wired pagination in its footer when `paginated` is set.
- [doc-pagination](doc-pagination.md) — previous / next links between documentation pages, not numbered pages of a list.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `page` | `number` | `1` | false | Current page, 1-based (data-driven mode). Supports `v-model:page`. |
| `total` | `number` | `undefined` | false | Total item count. When set, the Pagination runs in data-driven mode and renders its own controls. |
| `pageSize` | `number` | `10` | false | Rows per page (data-driven mode). Supports `v-model:page-size`. |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | false | Page-size options offered in the rows-per-page selector. |
| `siblingCount` | `number` | `1` | false | Page numbers shown on each side of the current page before collapsing into an overflow ellipsis. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the navigation landmark. Empty uses the locale catalog (`Pagination`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:page` | `[page: number]` | Current page changed in data-driven mode (Previous / Next / page number). Supports `v-model:page`. |
| `update:pageSize` | `[pageSize: number]` | Rows-per-page changed via the internal selector. Supports `v-model:page-size`. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `info` | — | Left region: page-info text (typically PaginatorInfo). In data-driven mode, overrides the default "Showing X to Y of Z entries" text. |
| `default` | — | Center region: pagination navigation buttons (composition mode only — ignored in data-driven mode, where the buttons are rendered internally). |
| `controls` | — | Right region: rows-per-page selector (PaginatorPageSize). In data-driven mode, overrides the internally-rendered selector. |

## Sub-component imports

- `@aziontech/webkit/pagination-button`
- `@aziontech/webkit/pagination-info`
- `@aziontech/webkit/pagination-page-size`

## Sub-components

- `pagination-button/pagination-button.vue` — one segment of the numbers strip, 28px tall with a 28px minimum width and no horizontal padding; it carries no radius of its own except the outer corners at the two ends of the strip (`var(--shape-elements)`). Props `kind?: 'previous' | 'next' | 'number' | 'more'`, `selected?: boolean` (current-page treatment), `disabled?: boolean`. Emits `click: [event: MouseEvent]`. `previous` renders `pi pi-chevron-left`; `next` renders `pi pi-chevron-right`; `more` renders `pi pi-ellipsis-h`; only `number` renders the default slot — `previous` / `next` are icon-only and take their accessible name from `aria-label`; `more` renders as an inert `span` with `aria-hidden="true"` (not focusable, no state layers, never emits `click`). `number` and `more` carry `var(--bg-surface)`; `previous` and `next` have no surface of their own and read against the strip. Hover/active use the DESIGN.md ghost-layer surfaces and are mutually exclusive (pressing replaces the hover layer rather than stacking on it); `selected` uses `var(--bg-selected)` + border; `disabled` keeps the kind's own surface and mutes the foreground to `var(--text-disabled)`.
- `pagination-info/pagination-info.vue` — muted page-info text container (default slot), `.text-body-xs` / `var(--text-muted)`.
- `pagination-page-size/pagination-page-size.vue` — rows-per-page selector (native `<select>`), 64×28 (same height as the numbers strip), `var(--shape-elements)` radius, `var(--bg-canvas)` frame over a `var(--bg-surface)` field with `var(--border-default)` border, value `.text-label-sm` muted, `pi pi-chevron-down`. Props `modelValue?: number`, `options?: number[]` (default `[10, 25, 50, 100]`). Emits `update:modelValue: [value: number]`. Placed in the Pagination `controls` slot.

## States

- Visual states: `default`, `hover`, `active`, `focus-visible`, `selected`, `disabled`
- The page buttons render as one **segmented strip**: a single container carrying the `var(--border-default)` border and the `var(--shape-elements)` radius, with the buttons butted against each other at zero gap. Only the two end buttons round their outer corners.
- `data-kind` on PaginationButton: `previous` | `next` | `number` | `more`. `number` and `more` carry `var(--bg-surface)`; `previous` and `next` have no surface of their own.
- `hover` and `active` are mutually exclusive: pressing a button drops the hover layer and shows the `var(--bg-active)` layer alone, so the pressed surface reads one step below hover.
- `data-selected` on PaginationButton mirrors the current-page `selected` prop; `aria-current="page"` set when selected.
- `data-disabled` on PaginationButton mirrors the `disabled` prop; `disabled` attribute and `aria-disabled` set.
- Data-driven mode: `Previous` is disabled on the first page, `Next` on the last; the current page button is `selected` (`aria-current="page"`); the overflow ellipsis (`more`) is non-interactive: an `aria-hidden` `span`, out of the tab order, that emits nothing.
- Responsive: the root is the `@container/pagination`. Below `@sm` of its box only Previous, the current page and Next stay visible (the other page numbers and the ellipsis hide); the page-size control wraps under them.
- Touch: on a coarse pointer (`pointer-coarse:`) every page button and the page-size select grow to 44 px.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on every pagination button.
- Keyboard map: `Tab` moves across buttons and the rows-per-page selector; `Enter`/`Space` activates a button; disabled buttons and the overflow ellipsis are skipped. In data-driven mode, `ArrowRight`/`ArrowLeft` inside the button group go to the next/previous page, swapped under `dir="rtl"` (`useDirection`).
- ARIA: root `<nav>` with `aria-label` (the `ariaLabel` prop); current-page button sets `aria-current="page"`; disabled buttons set the `disabled` attribute and `aria-disabled`; icon glyphs and the overflow ellipsis are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target: each button is 28×28, a justified deviation from 44×44 — the design is a compact segmented strip sized to sit inside a table footer, and the buttons are butted with no gap, so there is no room to pad the hit area without breaking the strip.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the previous/next chevrons mirror (`rtl:-scale-x-100`).
- Keyboard: in data-driven mode `ArrowRight`/`ArrowLeft` go to the next/previous page, swapped under `dir="rtl"` (`logicalArrowKey`).
- User data: none.

## Examples

### Default

```vue
<script setup>
  import Pagination from '@aziontech/webkit/pagination'
</script>

<template>
  <Pagination>
    <template #info>
      <Pagination.Info>Showing 1 to 10 of 20 entries</Pagination.Info>
    </template>

    <Pagination.Button
      kind="previous"
      aria-label="Previous page"
      disabled
    />
    <Pagination.Button
      kind="number"
      selected
      >1</Pagination.Button
    >
    <Pagination.Button kind="number">2</Pagination.Button>
    <Pagination.Button kind="number">3</Pagination.Button>
    <Pagination.Button kind="more" />
    <Pagination.Button
      kind="next"
      aria-label="Next page"
    />

    <template #controls>
      <Pagination.PageSize
        :model-value="10"
        :options="[10, 25, 50, 100]"
      />
    </template>
  </Pagination>
</template>
```

### Buttons

```vue
<script setup>
  import Pagination from '@aziontech/webkit/pagination'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <Pagination aria-label="Pagination kinds">
      <Pagination.Button
        kind="previous"
        aria-label="Previous page"
      />
      <Pagination.Button kind="number">1</Pagination.Button>
      <Pagination.Button
        kind="number"
        selected
        >2</Pagination.Button
      >
      <Pagination.Button kind="more" />
      <Pagination.Button
        kind="next"
        aria-label="Next page"
      />
    </Pagination>
    <Pagination aria-label="Pagination disabled states">
      <Pagination.Button
        kind="previous"
        aria-label="Previous page"
        disabled
      />
      <Pagination.Button
        kind="number"
        disabled
        >1</Pagination.Button
      >
      <Pagination.Button
        kind="next"
        aria-label="Next page"
        disabled
      />
    </Pagination>
  </div>
</template>
```

### DataDriven

```vue
<script setup>
  import Pagination from '@aziontech/webkit/pagination'
  import { ref } from 'vue'

  const page = ref(1)
  const pageSize = ref(10)
</script>

<template>
  <Pagination
    v-model:page="page"
    v-model:page-size="pageSize"
    :total="200"
    :page-size-options="[10, 25, 50, 100]"
    :sibling-count="1"
  />
</template>
```
