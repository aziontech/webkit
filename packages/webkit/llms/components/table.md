# Table

> The table's parts and its markup-only root. Compose the anatomy by hand (`Table.Header` / `Table.Body` / `Table.Row` / `Table.HeadCell` / `Table.Cell`): the component owns markup, tokens, accessibility, column sizing (an emphasized principal column), sortable headers, selectable rows and a **freeze system** for sticky columns (an actions column) and a sticky header. The root is light: it frames the scroll viewport, the toolbar band (`title` / `toolbar` slots) and the `footer`, and loads no table engine. For repeated records pass `data` + `columns` to [`data-table`](data-table.md) instead: DataTable renders through these same parts, and the context-aware toolbar parts (`Table.Search`, `Table.Filter`, `Table.Export`, `Table.RefreshButton`, `Table.LiveButton`) and the cell presets (`Table.CellLink`, `Table.CellId`, `Table.CellStatus`, `Table.CellTags`, `Table.CellTime`, `Table.CellActions`) go in its slots. Inside a hand-composed `Table` the toolbar parts have no rows to act on. **Cell presets.** Six presets render the cells every list repeats, each inside a cell (or a DataTable `#cell-<id>` slot): `Table.CellLink` (a name that leaves the screen: an optional muted leading glyph (`icon`) for the provider or resource type, a 12 px external mark, a tooltip naming the destination, underline on hover, no mark without a destination; optional `+N` overflow through `OverflowCount` and a copy button pinned to the end edge), `Table.CellId` (an identifier with its copy button), `Table.CellStatus` (one semantic `Tag`), `Table.CellTags` (as many tags as fit, the rest behind `+N`), `Table.CellTime` (avatar of the author plus a relative time that updates every minute, or counts from the nearest `WebkitProvider`'s `now`, the absolute time on the tooltip and for screen readers) and `Table.CellActions` (the row menu named after the row). **Types** (declared in `injection-key.ts`, re-exported by `./table`): the column and slot types DataTable takes (`TableColumn`, `TableCellSlotProps`, `TableHeaderSlotProps`, `TableToolbarSlotProps`, `TableStateSnapshot`, `TableExposed`, `AppliedFilter`, `FilterField`, `TableDensity`), so a page can type its columns from the compound it already imports. Their shapes are documented in [`data-table`](data-table.md).

- Import: `import TableRoot from '@aziontech/webkit/table-root'`
- Compound import (dot notation, not tree-shakeable): `import Table from '@aziontech/webkit/table'`
- Category: data · Surface: app · Structure: composition
- API as JSON: [table.json](https://github.com/aziontech/webkit/blob/main/.specs/table.json)

## When to use

- Use Table for records that share columns when you compose the rows by hand; for any console list of resources people scan, sort and act on, pass `data` + `columns` to DataTable, which renders through these parts.
- A small, static table, or one whose cells need a layout the column model cannot express: compose `Table.Header` / `Table.Row` / `Table.Cell` by hand. The root loads no engine.
- The parts of a DataTable: the toolbar parts and cell presets go in its slots, imported from this compound (`Table.Search`, `Table.CellStatus`).
- Use Table for read-and-act content; for repeated records pass `data` + `columns` to `data-table`, and when people edit cells in place use `data-grid`.

## Do

- Compose `Table` by hand only for small, static tables; for repeated data use `data-table`, which renders through these parts.
- Mark the row-actions cell `kind="action"` with `frozen="end"` so it pins to the trailing edge, and give the principal cell `principal` (or `grow="2"`).
- Name the table: a `Table.Caption` labels it (`aria-labelledby`), or pass `aria-label` on the root.
- Give `Table.CellTime` dates from your data. Where the text must not depend on when it renders (an example, a test, a server render the browser hydrates), set `now` on the app's `WebkitProvider` and count sample dates back from that constant; never build them from `Date.now()` / `new Date()` in setup.
- Import the root alone from `table-root`, or each part from its own entry (`table-row`), when only a few parts are used.

## Don’t

- Repeated records with sorting, selection, paging, filtering, virtual rows or tree rows → use `data-table` (`data` + `columns`).
- People edit many cells of many records in place, spreadsheet-style → use `data-grid`.
- A short list of same-field rows added and removed inside a form (environment variables, headers) → use `attribute-editor`.
- A short titled preview of a longer listing on a marketing page → use `listing-table`.
- A feature-by-feature comparison of Azion with a competitor → use `comparison-table`.
- Rows of mixed content (media, title, description, actions) that do not share columns → use `item`.
- A grid of selectable cards or options → use `radio-group` with `kind="card"`.
- The same records as a grid of cards → use `card-list` (same collection, card layout).
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [data-table](data-table.md) — the data-driven table (`data` + `columns`, TanStack engine) that renders through these parts.
- [data-grid](data-grid.md) — the editable, spreadsheet-like grid; a separate grid (`role="grid"`, one roving tab stop, in-cell editors) that shares these tokens, not built on these parts.
- [pagination](pagination.md) — the page strip; put it in a `Table.Footer` in the `footer` slot.
- [empty-state](empty-state.md) — compose it in a full-width row when a hand-composed table has no rows.
- [item](item.md) — list rows without a column structure.
- [listing-table](listing-table.md) — marketing section that composes a DataTable for a linked preview of a list.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `maxHeight` | `string` | `''` | false | Max height (CSS length). The viewport scrolls dynamically: horizontal scroll appears automatically when columns overflow the width; vertical scroll appears only when `maxHeight` is set smaller than the content (under a frozen header). |
| `bordered` | `boolean` | `false` | false | Draw the outer card border around the table. Off by default (the table is typically framed by a surrounding surface); the internal row dividers are unaffected. |
| `density` | `'comfortable' \| 'compact'` | `'comfortable'` | false | Density of the body cells: `compact` shrinks their height and padding. Set `density` on `Table.Header` too for a compact header. |
| `wrapLines` | `boolean` | `false` | false | Cell text wraps onto several lines instead of truncating. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The scrollable region: `Table.Caption`, `Table.Header`, `Table.Body`. |
| `title` | — | Title text shown at the start of the toolbar band, fixed above the scroll viewport. |
| `toolbar` | — | Action band above the scroll viewport, end-aligned beside the title. |
| `footer` | — | Footer region rendered below the scroll viewport (`Table.Footer` + `Pagination`), so it never scrolls with the body. |

## Sub-component imports

- `@aziontech/webkit/table-header`
- `@aziontech/webkit/table-body`
- `@aziontech/webkit/table-footer`
- `@aziontech/webkit/table-caption`
- `@aziontech/webkit/table-row`
- `@aziontech/webkit/table-head-cell`
- `@aziontech/webkit/table-cell`
- `@aziontech/webkit/table-cell-status`
- `@aziontech/webkit/table-cell-link`
- `@aziontech/webkit/table-cell-id`
- `@aziontech/webkit/table-cell-time`
- `@aziontech/webkit/table-cell-tags`
- `@aziontech/webkit/table-cell-actions`
- `@aziontech/webkit/table-sort-button`
- `@aziontech/webkit/table-toolbar`
- `@aziontech/webkit/table-search`
- `@aziontech/webkit/table-filter`
- `@aziontech/webkit/table-export`
- `@aziontech/webkit/table-refresh-button`
- `@aziontech/webkit/table-live-button`

## Sub-components

- `table-header/table-header.vue` — `role="rowgroup"` header band. Props `frozen?: boolean` → sticky top within the scroll container; `density?: 'comfortable' | 'compact'` (default `undefined`) → `compact` shrinks the header cells' height and padding (published to the head cells through the row-group context, so the consumer sets it once on the header); DataTable passes its own `density`.
- `table-body/table-body.vue` — `role="rowgroup"` body band.
- `table-footer/table-footer.vue` — footer band below the viewport, outside `role="table"` (hosts the Pagination); muted text.
- `table-caption/table-caption.vue` — caption / title line that names the table (`aria-labelledby`); `text-label-sm` muted.
- `table-row/table-row.vue` — `role="row"`, flex container. Props `selected?: boolean`, `frozen?: boolean`. Forwards native listeners (e.g. `@click`) to its root via attribute fallthrough. Bottom divider `var(--border-width-default)` / `var(--border-default)`; hover `var(--bg-canvas)`; selected `var(--bg-selected)`. The row publishes its resolved background as the `--table-row-bg` custom property so frozen cells (and their edge fade) track the row hover/selected color instead of drifting against it.
- `table-head-cell/table-head-cell.vue` — `role="columnheader"`, height 44px. Props `kind?: 'default' | 'checkbox' | 'action' | 'slot'` (`checkbox`/`action` are 40px fixed-width so the header aligns with the body's checkbox/action cells), `sortable?: boolean`, `sortDirection?: 'none' | 'ascending' | 'descending'`, `align?: 'start' | 'center' | 'end'`, `grow?: 1 | 2 | 3` (flex weight), `principal?: boolean` (defaults the weight to `grow: 2` when `grow` is unset — the principal/emphasized column), `frozen?: 'start' | 'end'`. Emits `sort: [direction: 'ascending' | 'descending']`. Renders `table-sort-button` when `sortable`; the header cell itself is not a tab stop (a pointer click anywhere on it still toggles the sort), and the button is named with the column through `aria-labelledby` (`tableHeadCell.sortBy` + the header text: `Sort by Name`), so the direction is read from the header's `aria-sort`. When `resizable`, renders a drag-to-resize handle on the right edge (`resizing` reflects the active drag; `resizeHandler` is the pointer handler DataTable supplies). `resizing` and `resizeHandler` are internal plumbing DataTable passes to its own head cells; they are not part of the composition API (a composed table resizes nothing).
- `table-cell/table-cell.vue` — `role="cell"`, min height 48px. Props `kind?: 'default' | 'checkbox' | 'action'`, `align?: 'start' | 'center' | 'end'`, `grow?: 1 | 2 | 3`, `principal?: boolean` (defaults the weight to `grow: 2` when `grow` is unset — the principal/emphasized column), `frozen?: 'start' | 'end'`, `clickable?: boolean` (underlines the cell text). Cell text never wraps (single line, truncates) — there is no wrap option. A `grow` column carries a fixed, content-independent flex basis (`flex: <grow> 0 5rem`) identical to its header cell, so the column resolves to the same width in the header and in every body row; when the table overflows it shrinks to that minimum and the viewport scrolls horizontally — instead of each row sizing the column to its own content, which misaligned the header from the body. A `width` column overrides the basis with a fixed pixel width; a `minWidth` column is measured and pinned to one resolved width (the larger of that floor and the widest of its header and rendered cells), so it reserves nothing it is not using and never truncates the chip inside it. Content (avatar, tag, icon, description, copy, "+99") is composed by the consumer via the default slot using existing primitives.
- `table-sort-button/table-sort-button.vue` — sort control used inside `table-head-cell`, rendered as the webkit `IconButton` (`kind="transparent"`, `size="small"` → 28×28) so size, padding, and alignment match the design system. Prop `sortDirection?: 'none' | 'ascending' | 'descending'` (the same name as `table-head-cell`). Emits `sort: [direction: 'ascending' | 'descending']` (the same event as `table-head-cell`). To hide it while keeping its space, pass `class="invisible"`. Glyphs via `ai ai-sort` (none) / `ai ai-arrow-up-wide-narrow` (ascending) / `ai ai-arrow-down-wide-narrow` (descending). Attributes (`aria-labelledby`, `class`) are forwarded to the `IconButton`; its own label (`Sort column`, `Sorted ascending`, `Sorted descending`) applies only when nothing names it.
- `table-toolbar/table-toolbar.vue` — flex container (end-aligned) for toolbar actions placed in the `toolbar` slot; injects the table context for its testId.
- `table-search/table-search.vue` — Use Table.Search for one free-text search over the table's rows. A context-aware search input. Reads and drives the TanStack `globalFilter` of the enclosing DataTable through the injected context, so it needs no wiring. Props `placeholder?: string` (default `''`; empty uses the locale catalog, `Search` in English) and `ariaLabel?: string` (default `''`; empty uses `tableSearch.label`, `Search the table`), so the field is never named only by its placeholder. Rendered outside a DataTable it has no rows to search and warns once in the console.
- `table-filter/table-filter.vue` — Use Table.Filter only as the toolbar slot that hosts FilterMenu (`kind="menu"`) or PropertyFilter (`kind="property"`) wired to the table; it is not a third filter. `kind?: 'menu' | 'property'` (default `'menu'`) picks the host by data shape: `menu` renders [`FilterMenu`](filter-menu.md) (facets picked from known values; `select`, `multi-select` and `date` fields) and `property` renders [`PropertyFilter`](property-filter.md) (typed conditions with operators, `free-text` off and `hide-operations` on, so its tokens combine with AND like the table's `filters`). Both read and write the enclosing DataTable's `filters` model through the context (`v-model:filters`, `filter-apply` with the event first), mapped by `filter-menu-bridge.ts`. Props `fields?: FilterField[]` (default `[]`; empty uses the table's `filterFields`) and `title?: string` (default `''`; the menu trigger text, the property filter's accessible name; empty uses each one's catalog). Emits `apply: [event: Event, filters: AppliedFilter[]]`. No slots. The applied-filters row of the menu kind is `FilterMenu.Chips` with no `fields` in the DataTable `filters` slot; the property kind shows its own tokens. Columns are chosen in `CollectionPreferences`, which reads the table's columns from context.
- `table-export/table-export.vue` — context-aware export control (an `IconButton`, download glyph, its name repeated on a `Tooltip`). Calls the injected `exportCsv(options?)`; the root emits `export` with the resolved rows (a consumer may intercept for server-side export, otherwise the built-in CSV util downloads the visible, ordered columns and filtered rows). Props `filename?: string` (default `''` → falls back to the root `exportFilename`), `scope?: 'page' | 'filtered' | 'all'` (default `'filtered'`). Slot `trigger` (scope `{ export }`).
- `table-refresh-button/table-refresh-button.vue` — context-aware refresh control (an `IconButton`, refresh glyph). Calls the injected `reload()`; the root emits `refresh`. Binds `:disabled` to `disabled || loading` (the injected loading flag), so it can't fire mid-fetch. Props `disabled?: boolean` (default `false`) and `loading?: boolean` (default `false`: spins the glyph and blocks a second press while a refresh runs and the current rows stay on screen — the refresh pattern; the table's own `loading` is for a first load with nothing to show). A `Tooltip` repeats its name for pointer users.
- `table-live-button/table-live-button.vue` — context-aware live-tail toggle (a `Button`, outlined, label from the catalog `Live` with a leading dot that turns success-coloured and pulses while live, `motion-reduce:animate-none`). Reads and drives the root `live` model through the injected context; `aria-pressed` mirrors it. Disabled while the table is `loading`. Prop `disabled?: boolean`. The app starts and stops its stream on `update:live`; the table never fetches.
- `table-cell-link/table-cell-link.vue` — cross-resource link preset. Props `label?: string`, `href?: string` (outside the app; new tab with a visually hidden `(opens in a new tab)`), `to?: string | Record<string, unknown>` (in-app; the app's registered `RouterLink`, else a plain `href`), `destination?: string` (tooltip `Open <label> in <destination>`), `icon?: string` (default `''`; a glyph class drawn before the name in `var(--text-muted)`, outside the link and `aria-hidden`, naming the provider or the resource type: `ai ai-github` for a repository, `ai ai-workloads` for a workload), `copyable?: boolean`, `copyValue?: string`, `more?: OverflowCountItem[]`, `noun?: OverflowCountNoun` (default `undefined`; what the `more` values are, the same name as `Table.CellTags`). Clicks stop at the link so a row click does not also fire. No `href`/`to` renders plain truncating text with no mark and no tooltip.
- `table-cell-id/table-cell-id.vue` — identifier preset: the value (`dir="ltr"`, tabular numbers, truncating) and a `CopyButton` pinned to the end edge named `Copy <resource> ID`. Props `value?: string | number`, `resource?: string`.
- `table-cell-status/table-cell-status.vue` — status preset: one `Tag` (`size="medium"`, truncating). Props `label?: string` (empty renders a muted dash), `severity?: TagSeverity` (default `neutral`), `icon?: string`. Use it over a bare `Tag` in a cell: it is the shared empty-dash rule. Use `status-indicator` for a live dot plus text, and `severity-tag` for a log severity.
- `table-cell-tags/table-cell-tags.vue` — tag list preset: rounded secondary tags, as many as fit the cell (measured with a `ResizeObserver` against a hidden ruler), the rest behind an `OverflowCount`. Props `items?: string[]` (empty renders a muted dash), `icon?: string`, `noun?: OverflowCountNoun` (default `tag` / `tags` from the catalog).
- `table-cell-time/table-cell-time.vue` — last-modified preset: the author's `Avatar` (name on its tooltip; an email reads as a name) and a `<time datetime>` with the relative time (`just now` under 45 s), the absolute time on its tooltip and in visually hidden text. One shared minute clock re-renders every mounted cell; under a `WebkitProvider` with `now` set, every cell reads that reference time instead, so an example, a test or a server render prints the same text wherever and whenever it renders. Props `value?: string | number | Date` (an epoch with 15 digits or more reads as microseconds, like `Timestamp`, with which it shares parsing and relative phrasing; empty or unparseable renders a muted dash), `author?: string`, `avatarSrc?: string`.
- `table-cell-actions/table-cell-actions.vue` — row actions preset: a `DropdownMenu` (`placement="bottom-end"`) triggered by an outlined ellipsis `IconButton` named `Actions for <name>`. Props `name?: string`, `disabled?: boolean`. Emits `select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuOptionValue]`; `DropdownMenuOptionValue` (`string | number`) is re-exported by `./table`. Default slot: `DropdownMenu.Group`s of `DropdownMenu.Item`s.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `selected`
- The viewport is always a scroll container (`overflow: auto`): horizontal scroll is automatic when columns overflow; vertical scroll engages only when `maxHeight` constrains the content.
- `data-frozen` on TableHeader (`true`), TableHeadCell / TableCell (`start` | `end`), and TableRow (`true`). A frozen head/body cell renders a CSS-only fade (gradient pseudo-element) just outside its inner edge that dissolves the horizontally scrolling content into the row background (`from-transparent` → `var(--table-row-bg)`, the row-published color, so it matches the row on hover/selected) — `frozen=start` fades on the right, `frozen=end` on the left. The fade tints nothing; it only masks the content sliding under the pinned column.
- `data-state` on TableRow: `selected` | `unselected`; `data-selected` mirrors the `selected` prop; `aria-selected` set when selected.
- `data-kind` on TableHeadCell (`default` | `checkbox` | `action` | `slot`) and TableCell (`default` | `checkbox` | `action`).
- `data-align` on head/body cells: `start` | `center` | `end`.
- `data-grow` on head/body cells: `1` | `2` | `3` (flex weight).
- `data-sortable` and `data-sort` (`none` | `ascending` | `descending`) on TableHeadCell; `aria-sort` mirrors `data-sort`.
- `data-sort` (`none` | `ascending` | `descending`) on TableSortButton.
- `data-clickable` on TableCell mirrors the `clickable` prop.
- Density and wrapping: `data-density="compact"` on the root shrinks the body cells (`min-h-9`, `--spacing-2xs` block padding); `data-wrap` lets cell text (and any `.truncate` inside a cell) wrap. A compact header is `Table.Header density="compact"`.
- Responsive toolbar: the root is the `@container/table`; the toolbar wraps, and below `@md` of the table the `toolbar` slot moves under the title and starts at the start edge. `Table.Toolbar` wraps its controls.
- Hover-free devices: a sortable header shows its sort affordance where the pointer cannot hover (`@media (hover: none)`).

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the sort button and any interactive cell content.
- Keyboard map: `Tab` focuses the sort button of each sortable column (one tab stop per column, as in the APG sortable table: the header cell itself is not focusable and carries `aria-sort`) and interactive cell content; `Enter`/`Space` on the sort button toggles the sort; row click is mouse/touch (no keyboard trap). Body rows are not focusable, so `row-click` is never the only way to open a record: the principal column carries a real link or button (`Table.CellLink`, or the `cell-<id>` slot with an anchor, as the Default example does), which keyboard and screen-reader users reach instead (WCAG 2.1.1).
- ARIA: `role="table"` sits on the grid element inside the scroll viewport (testid `<testid>__table`), not on the root: the root also holds the toolbar band, the focusable scroll viewport and the footer, and any of those inside a `table` is an unallowed child (`aria-required-children`). Every `aria-*` attribute passed to `Table` (`aria-label`, `aria-labelledby`, `aria-describedby`…) is forwarded to that element; every other attribute stays on the root. `table-caption` is a plain element (no `role`) that names the table through `aria-labelledby` unless the consumer names it with `aria-label`/`aria-labelledby`. The default slot is the table's content, so it holds rowgroups (and a caption) only; anything else goes in `footer` or around the `Table`. `table-header`/`table-body` `role="rowgroup"`; `table-footer` has no role (it hosts pagination or an action, not rows); `table-row` `role="row"`; `table-head-cell` `role="columnheader"` with `aria-sort` when sortable; `table-cell` `role="cell"`; selected rows set `aria-selected`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including muted header text.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px on the sort button and row action controls.
- Filter names: `Table.Filter` hosts `FilterMenu` (its trigger counts the applied fields in its name) or `PropertyFilter` (a combobox named by `title`); see their specs.

## Examples

### Default

```vue
<script setup>
  import Table from '@aziontech/webkit/table'

  const items = [
    { id: '1001', name: 'Workload Alpha', status: 'Active', editor: 'user1@example.com' },
    { id: '1002', name: 'Workload Bravo', status: 'Inactive', editor: 'user2@example.com' },
    { id: '1003', name: 'Workload Charlie', status: 'Degraded', editor: 'user3@example.com' },
    { id: '1004', name: 'Workload Delta', status: 'Active', editor: 'user4@example.com' },
    { id: '1005', name: 'Workload Echo', status: 'Inactive', editor: 'user5@example.com' }
  ]
</script>

<template>
  <Table bordered>
    <Table.Header>
      <Table.Row>
        <Table.HeadCell principal>Name</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>Last Editor</Table.HeadCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row
        v-for="item in items"
        :key="item.id"
      >
        <Table.Cell principal
          ><span class="min-w-0 flex-1 truncate">{{ item.name }}</span></Table.Cell
        >
        <Table.Cell
          ><span class="min-w-0 flex-1 truncate">{{ item.status }}</span></Table.Cell
        >
        <Table.Cell
          ><span class="min-w-0 flex-1 truncate">{{ item.editor }}</span></Table.Cell
        >
      </Table.Row>
    </Table.Body>
  </Table>
</template>
```

### CellPresets

```vue
<script setup>
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Table from '@aziontech/webkit/table'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'

  const HOUR = 3_600_000
  const NOW = Date.UTC(2026, 10, 10, 12)

  const statusSeverity = (status) =>
    ({ Active: 'success', Failed: 'danger', Pending: 'warning' })[status] ?? 'neutral'

  const rows = [
    {
      id: '1726504',
      name: 'storefront',
      repository: 'example/storefront',
      status: 'Active',
      domains: ['shop.example.com', 'www.shop.example.com', 'm.shop.example.com'],
      tags: ['production', 'checkout', 'payments', 'europe'],
      updatedAt: new Date(NOW - 2 * HOUR),
      updatedBy: 'jane.doe@example.com'
    },
    {
      id: '1726511',
      name: 'image-optimizer',
      repository: 'example/image-optimizer',
      status: 'Pending',
      domains: ['img.example.com'],
      tags: ['media'],
      updatedAt: new Date(NOW - 26 * HOUR),
      updatedBy: 'jonas.weber@example.com'
    },
    {
      id: '1726530',
      name: 'docs-portal',
      repository: '',
      status: 'Failed',
      domains: ['docs.example.com', 'help.example.com'],
      tags: [],
      updatedAt: new Date(NOW - 9 * 24 * HOUR),
      updatedBy: 'john.smith@example.com'
    }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true },
    { accessorKey: 'id', header: 'ID', minWidth: 140 },
    { accessorKey: 'repository', header: 'Repository', grow: 2 },
    { accessorKey: 'status', header: 'Status', minWidth: 96 },
    { accessorKey: 'domains', header: 'Domain', grow: 2 },
    { accessorKey: 'tags', header: 'Tags', grow: 2 },
    { accessorKey: 'updatedAt', header: 'Last modified', minWidth: 160 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const onAction = (_event, _value, _row) => {}
</script>

<template>
  <WebkitProvider :now="NOW">
    <DataTable
      :data="rows"
      :columns="columns"
      row-key="id"
      aria-label="Workloads"
    >
      <template #cell-name="{ row }">
        <Table.CellLink
          :label="row.name"
          :to="`/workloads/${row.id}`"
          destination="Workloads"
        />
      </template>
      <template #cell-id="{ value }">
        <Table.CellId
          :value="value"
          resource="workload"
        />
      </template>
      <template #cell-repository="{ value }">
        <Table.CellLink
          v-if="value"
          icon="ai ai-github"
          :label="value"
          :href="`https://github.com/${value}`"
        />
        <span
          v-else
          class="text-body-sm text-(--text-muted)"
          >—</span
        >
      </template>
      <template #cell-status="{ value }">
        <Table.CellStatus
          :label="value"
          :severity="statusSeverity(value)"
        />
      </template>
      <template #cell-domains="{ row }">
        <Table.CellLink
          :label="row.domains[0]"
          :href="`https://${row.domains[0]}`"
          :more="row.domains.slice(1).map((label) => ({ label, href: `https://${label}` }))"
          :noun="{ one: 'domain', other: 'domains' }"
          copyable
        />
      </template>
      <template #cell-tags="{ value }">
        <Table.CellTags :items="value" />
      </template>
      <template #cell-updatedAt="{ row }">
        <Table.CellTime
          :value="row.updatedAt"
          :author="row.updatedBy"
        />
      </template>
      <template #header-actions>
        <span class="sr-only">Actions</span>
      </template>
      <template #cell-actions="{ row }">
        <Table.CellActions
          :name="row.name"
          @select="(event, value) => onAction(event, value, row)"
        >
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="edit"
              label="Edit"
            />
            <DropdownMenu.Item
              value="clone"
              label="Clone"
            />
          </DropdownMenu.Group>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="delete"
              label="Delete"
            />
          </DropdownMenu.Group>
        </Table.CellActions>
      </template>
    </DataTable>
  </WebkitProvider>
</template>
```
