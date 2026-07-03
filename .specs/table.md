---
name: table
category: data
structure: composition
status: approved
spec_version: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2053-7649
  node_id: 2053:7649
checksum: 65064bad34d82a4d9b15c32acf5e2bca933f38af5c5b5944b89cc9ce605f8718
created: 2026-06-16
last_updated: 2026-07-01
---

# Table — Component Spec

## Purpose

Composition primitives for building accessible, pixel-perfect data tables, in two modes. **Composition mode** (default): compose the anatomy by hand (header / body / rows / cells) — the component owns markup, tokens, a11y, configurable column sizing (an emphasized first column), sortable headers, selectable rows, and a **freeze system** for sticky columns (e.g. an actions column) and a sticky header. **Data-driven mode**: pass `data` + `columns` and the table renders itself via the headless **`@tanstack/vue-table`** engine, still rendering through the same primitives (our markup/tokens/a11y, pixel-perfect to Figma). Pairs with the [`Paginator`](./paginator.md) component (rendered automatically in the footer when `paginated`). A top **toolbar band** (`title` / `toolbar` / `filters` slots) sits above the scroll viewport in both modes for a title, search / filter / export / column-selector actions, and removable filter chips; the `toolbar` and `filters` slots are scoped with the TanStack `table` instance (in data-driven mode) so the consumer can drive filtering, global search, and column visibility through the table's own methods.

**Engine.** Data-driven mode is driven by **`@tanstack/vue-table`** (`useVueTable` + `getCoreRowModel` / `getSortedRowModel` / `getFilteredRowModel` / `getPaginationRowModel`), covering sorting, pagination, row selection, column visibility, and global filtering — client- and server-side (`manualSorting` / `manualPagination` / `manualFiltering`). It is a pure-logic library (no markup/styles/positioning/animation), granted narrowly to this single component per [`.claude/rules/dependencies.md`](../.claude/rules/dependencies.md) § Exceptions; rendering stays 100% in our primitives. State is exposed via v-model (`sorting`, `rowSelection`, `columnVisibility`, `globalFilter`, `pagination`, plus the structured `filters` model and the aggregate `state` snapshot below). `@tanstack/virtual` remains forbidden.

**Toolbar & imperative API.** The toolbar band composes context-aware controls that drive the table through the injected context with no wiring: `Table.Filter` (a structured field/operator/value builder that commits removable/editable filter chips, with an escape slot to plug a custom builder such as the console's AQL), `Table.AppliedFilters` (the chips), `Table.ColumnSelector` (a column-visibility picker over the existing `columnVisibility` state), `Table.Export` (CSV download), and `Table.RefreshButton`. Structured filters are a first-class model (`v-model:filters`, an `AppliedFilter[]` distinct from the free-text `globalFilter`) mapped to the TanStack column filters client-side, or emitted for a server refetch under `manualFiltering`. A `loading` prop renders skeleton rows for dynamic (server-side) data. The root exposes a **curated imperative API** via `defineExpose` (`reload`, `clearFilters`, `exportCsv`, `getState`, `setState`) so controls or logic outside the table can drive it through a template ref, and a serializable `TableStateSnapshot` (`sorting` / `pagination` / `columnVisibility` / `columnOrder` / `globalFilter` / `filters`) is exposed via `v-model:state` + `getState()` / `setState()` + an `initialState` seed — the component stays router-agnostic, so the consuming app owns any URL / localStorage persistence. CSV serialization lives in a pure util at [`@aziontech/webkit/utils/csv`](../packages/webkit/src/utils/csv.ts) (`toCsv` + `downloadCsv`).

**Types** (declared in `injection-key.ts`, re-exported for consumers): `FilterOperator` = `'eq' | 'neq' | 'contains' | 'not-contains' | 'starts-with' | 'ends-with' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not-in' | 'is-empty' | 'is-not-empty'`; `FilterField` = `{ id: string; label: string; type: 'text' | 'number' | 'select' | 'multi-select' | 'boolean' | 'date'; operators?: FilterOperator[]; options?: { label: string; value: string | number | boolean }[] }`; `AppliedFilter` = `{ field: string; operator: FilterOperator; value: string | number | boolean | Array<string | number>; label?: string }`; `TableStateSnapshot` = `{ sorting?: SortingState; pagination?: PaginationState; columnVisibility?: VisibilityState; columnOrder?: string[]; globalFilter?: string; filters?: AppliedFilter[] }` (every field optional so `setState` / `initialState` accept a partial; JSON-serializable).

## Usage

Composition mode — one import of the root; every part is reached via dot-notation (`<Table.Row>`, `<Table.Cell>`, …). The root binding must be PascalCase (`Table`); `table` lowercase collides with the native element.

```vue
<script setup>
import Table from '@aziontech/webkit/table'
</script>

<template>
  <Table max-height="480px">
    <Table.Caption>Workloads</Table.Caption>

    <Table.Header frozen>
      <Table.Row>
        <Table.HeadCell :grow="2" sortable sort-direction="ascending">Name</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell kind="action" frozen="end"><span class="sr-only">Actions</span></Table.HeadCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row selected>
        <Table.Cell :grow="2">acme-prod</Table.Cell>
        <Table.Cell>Active</Table.Cell>
        <Table.Cell kind="action" frozen="end">…</Table.Cell>
      </Table.Row>
    </Table.Body>

    <template #footer>
      <Table.Footer>
        <!-- Paginator goes here; rendered below the scroll viewport, so it never scrolls -->
      </Table.Footer>
    </template>
  </Table>
</template>
```

Each sub-component is also a standalone import (`import TableRow from '@aziontech/webkit/table-row'`, …) — the tree-shaking path when only a few parts are used.

Data-driven mode (TanStack engine renders the table from `data` + `columns`):

```vue
<script setup>
import { ref } from 'vue'
import Table from '@aziontech/webkit/table'

const sorting = ref([])
const rowSelection = ref({})
const data = ref([{ id: '1', name: 'acme-prod', status: 'Active' }])
const columns = [
  { accessorKey: 'name', header: 'Name', enableSorting: true, grow: 2, frozen: 'start' },
  { accessorKey: 'status', header: 'Status', enableSorting: true }
]
</script>

<template>
  <Table
    :data="data"
    :columns="columns"
    enable-sorting
    enable-row-selection
    paginated
    max-height="480px"
    v-model:sorting="sorting"
    v-model:row-selection="rowSelection"
    @row-click="(row) => console.log(row)"
  >
    <template #title>Workloads</template>
    <template #toolbar>
      <!-- Context-aware: reads/drives the TanStack globalFilter via inject — no wiring -->
      <Table.Search placeholder="Search" />
    </template>
    <template #filters="{ table }">
      <Chip
        v-if="table.getState().globalFilter"
        :label="table.getState().globalFilter"
        removable
        @remove="() => table.setGlobalFilter('')"
      />
    </template>
    <template #cell-status="{ value }">
      <Tag>{{ value }}</Tag>
    </template>
  </Table>
</template>
```

Full DataTable — the toolbar controls are context-aware (they read the injected table), so they need no wiring; the app persists `state` and refetches on `@refresh`:

```vue
<script setup>
import { ref } from 'vue'
import Table from '@aziontech/webkit/table'

const tableRef = ref()
const filters = ref([])
const state = ref()
const data = ref([{ id: '1', name: 'acme-prod', status: 'active' }])
const columns = [
  { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
  { accessorKey: 'status', header: 'Status', enableSorting: true },
  { id: 'actions', kind: 'action', hideable: false }
]
const filterFields = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'status', label: 'Status', type: 'select', options: [{ label: 'Active', value: 'active' }] }
]
</script>

<template>
  <Table
    ref="tableRef"
    :data="data"
    :columns="columns"
    :filter-fields="filterFields"
    enable-sorting
    enable-row-selection
    paginated
    export-filename="workloads.csv"
    v-model:filters="filters"
    v-model:state="state"
    @refresh="refetch"
  >
    <template #title>Workloads</template>
    <template #toolbar>
      <Table.Search placeholder="Search" />
      <Table.Filter :fields="filterFields" />
      <Table.ColumnSelector />
      <Table.Export />
      <Table.RefreshButton />
    </template>
    <template #filters>
      <Table.AppliedFilters />
    </template>
    <template #cell-status="{ value }">
      <Tag>{{ value }}</Tag>
    </template>
  </Table>
</template>
```

Plug a custom filter builder (e.g. AQL) through `Table.Filter`'s `default` slot; drive the table imperatively through the ref (`tableRef.value.clearFilters()`, `tableRef.value.exportCsv()`, `tableRef.value.getState()` / `setState(snapshot)`). The app owns URL / localStorage persistence — encode `state` where it wants; the component never touches the router.

## Sub-components

<!-- Each sub-component lives in its own folder under the root.
     The shared injection-key.ts sits one directory up from each sub-component.
     Per-sub-component props/events are listed here (the root Props/Events/Slots tables
     below describe ONLY the root Table element).
     Compound API: index.ts (Object.assign; vue-tsc emits the adjacent index.d.ts at publish time) attaches every sub-component
     to the root as `Table.Header` / `Table.Row` / `Table.Cell` / … (PascalCase root required).
     No per-component package.json — the root packages/webkit/package.json#exports map points each
     public path directly at its source file. See `.claude/rules/compound-api.md`. -->

- `table-header/table-header.vue` — `role="rowgroup"` header band. Props `frozen?: boolean` → sticky top within the scroll container; `variant?: 'default' | 'compact'` → `compact` shrinks the header cells' height and padding (published to the head cells through the row-group context, so the consumer sets it once on the header).
- `table-body/table-body.vue` — `role="rowgroup"` body band.
- `table-footer/table-footer.vue` — `role="rowgroup"` footer band (hosts the Paginator); muted text.
- `table-caption/table-caption.vue` — accessible caption / title line; `text-label-sm` muted.
- `table-row/table-row.vue` — `role="row"`, flex container. Props `selected?: boolean`, `frozen?: boolean`. Forwards native listeners (e.g. `@click`) to its root via attribute fallthrough. Bottom divider `var(--border-width-default)` / `var(--border-default)`; hover `var(--bg-canvas)`; selected `var(--bg-selected)`. The row publishes its resolved background as the `--table-row-bg` custom property so frozen cells (and their edge fade) track the row hover/selected color instead of drifting against it.
- `table-head-cell/table-head-cell.vue` — `role="columnheader"`, height 44px. Props `kind?: 'default' | 'checkbox' | 'action' | 'slot'` (`checkbox`/`action` are 40px fixed-width so the header aligns with the body's checkbox/action cells), `sortable?: boolean`, `sortDirection?: 'none' | 'ascending' | 'descending'`, `align?: 'start' | 'center' | 'end'`, `grow?: 1 | 2 | 3` (flex weight), `principal?: boolean` (defaults the weight to `grow: 2` when `grow` is unset — the principal/emphasized column), `frozen?: 'start' | 'end'`. Emits `sort: [direction: 'ascending' | 'descending']`. Renders `table-sort-button` when `sortable`. When `resizable`, renders a drag-to-resize handle on the right edge (`resizing` reflects the active drag; `resizeHandler` is the pointer handler supplied by the data-driven root).
- `table-cell/table-cell.vue` — `role="cell"`, min height 48px. Props `kind?: 'default' | 'checkbox' | 'action'`, `align?: 'start' | 'center' | 'end'`, `grow?: 1 | 2 | 3`, `principal?: boolean` (defaults the weight to `grow: 2` when `grow` is unset — the principal/emphasized column), `frozen?: 'start' | 'end'`, `clickable?: boolean` (underlines the cell text). Cell text never wraps (single line, truncates) — there is no wrap option. A `grow` column carries a fixed, content-independent flex basis (`flex: <grow> 0 5rem`) identical to its header cell, so the column resolves to the same width in the header and in every body row; when the table overflows it shrinks to that minimum and the viewport scrolls horizontally — instead of each row sizing the column to its own content, which misaligned the header from the body. A `width` column overrides the basis with a fixed pixel width. Content (avatar, tag, icon, description, copy, "+99") is composed by the consumer via the default slot using existing primitives.
- `table-sort-button/table-sort-button.vue` — sort control used inside `table-head-cell`, rendered as the webkit `IconButton` (`kind="transparent"`, `size="small"` → 28×28) so size, padding, and alignment match the design system. Props `direction?: 'none' | 'ascending' | 'descending'`, `hidden?: boolean`. Emits `toggle: [direction: 'ascending' | 'descending']`. Glyphs via `pi pi-sort-alt` (none) / `pi pi-sort-amount-up` (ascending) / `pi pi-sort-amount-down` (descending).
- `table-toolbar/table-toolbar.vue` — flex container (end-aligned) for toolbar actions placed in the `toolbar` slot; injects the table context for its testId.
- `table-search/table-search.vue` — context-aware search input. Reads and drives the TanStack `globalFilter` through the injected table context, so it needs no wiring. Prop `placeholder?: string` (default `'Search'`).
- `table-filter/table-filter.vue` — context-aware advanced-filter control. An `IconButton` funnel trigger opens an anchored **popover** — a floating panel positioned by the `use-placement` composable, Teleported to `body`, dismissed on outside-click or `Escape` (no Drawer, no invented overlay part). The built-in builder is rendered from `fields: FilterField[]` (default `[]`) as a field + operator + value composer (field and operator via `Select`, value via a tokenized `InputText`; typed value editors come through the escape `default` slot) with an Apply button; committing writes `AppliedFilter[]` through the injected context (and the root `v-model:filters`). Applied conditions are surfaced as `Table.AppliedFilters` chips, never rendered inside the popover. Prop `title?: string` (default `'Filters'`). Emits `apply: [filters: AppliedFilter[]]`, `clear: []`. Slots: `default` (scope `{ fields, applied, apply, clear, remove }`) is the **escape hatch** — provide a custom builder (e.g. the console's AQL) and the built-in body is not rendered; `trigger` (scope `{ open, count }`) customizes the trigger visual. Motion: `animate-popup-scale-in` / `animate-popup-scale-out` paired with `motion-reduce:animate-none`.
- `table-applied-filters/table-applied-filters.vue` — context-aware chip row for the committed structured filters. Renders one webkit `Chip` (`removable`) per `AppliedFilter` (label = `label`, else a formatted `field operator value`), read from the injected context. Emits `remove: [filter: AppliedFilter]` and `edit: [filter: AppliedFilter]` (re-opens the builder pre-filled). Slot `chip` (scope `{ filter, remove }`) overrides one chip. Placed in the `filters` slot.
- `table-column-selector/table-column-selector.vue` — context-aware column-visibility picker (the UI over the already-wired `columnVisibility`). An `IconButton` trigger opens an anchored **popover** (the same `use-placement` pattern as `Table.Filter`) listing each hideable leaf column with a `Checkbox`, toggling visibility through the injected `table`. Respects `column.getCanHide()` / the column's `hideable`. Prop `title?: string` (default `'Columns'`). Slot `trigger` (scope `{ open }`). Motion: `animate-popup-scale-in` / `animate-popup-scale-out` paired with `motion-reduce:animate-none`.
- `table-export/table-export.vue` — context-aware export control (an `IconButton`, download glyph). Calls the injected `exportCsv(options?)`; the root emits `export` with the resolved rows (a consumer may intercept for server-side export, otherwise the built-in CSV util downloads the visible, ordered columns and filtered rows). Props `filename?: string` (default `''` → falls back to the root `exportFilename`), `scope?: 'page' | 'filtered' | 'all'` (default `'filtered'`). Slot `trigger` (scope `{ export }`).
- `table-refresh-button/table-refresh-button.vue` — context-aware refresh control (an `IconButton`, refresh glyph). Calls the injected `reload()`; the root emits `refresh`. Binds `:disabled` to `disabled || loading` (the injected loading flag), so it can't fire mid-fetch. Prop `disabled?: boolean` (default `false`). No bespoke animation — the loading feedback is the skeleton body.

<!-- Resulting layout:

  packages/webkit/src/components/data/table/
  ├── table.vue
  ├── index.ts              (compound: Object.assign attaches sub-components; vue-tsc emits index.d.ts at publish)
  ├── injection-key.ts
  ├── table-header/         { table-header.vue }
  ├── table-body/           { table-body.vue }
  ├── table-footer/         { table-footer.vue }
  ├── table-caption/        { table-caption.vue }
  ├── table-row/            { table-row.vue }
  ├── table-head-cell/      { table-head-cell.vue }
  ├── table-cell/           { table-cell.vue }
  ├── table-sort-button/    { table-sort-button.vue }
  ├── table-toolbar/        { table-toolbar.vue }
  ├── table-search/         { table-search.vue }
  ├── table-filter/            { table-filter.vue }
  ├── table-applied-filters/   { table-applied-filters.vue }
  ├── table-column-selector/   { table-column-selector.vue }
  ├── table-export/            { table-export.vue }
  └── table-refresh-button/    { table-refresh-button.vue }

  No per-component package.json. Public exports stay flat: ./table (→ index.ts), ./table-header, … ./table-search, ./table-filter, ./table-applied-filters, ./table-column-selector, ./table-export, ./table-refresh-button, plus the CSV util ./utils/csv -->

## Props

<!-- Root <Table> element only. Sub-component props are listed in the Sub-components section. -->

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `maxHeight` | `string` | `''` | no | Max height (CSS length). The viewport scrolls dynamically: horizontal scroll appears automatically when columns overflow the width; vertical scroll appears only when `maxHeight` is set smaller than the content (under the sticky header). |
| `border` | `boolean` | `false` | no | Draw the outer card border around the table. Off by default (the table is typically framed by a surrounding surface); set `border` / `:border="…"` to draw the `var(--border-default)` outline. The internal row dividers are unaffected. |
| `data` | `Record<string, unknown>[]` | `[]` | no | Data-driven mode: row records. |
| `columns` | `TableColumn[]` | `[]` | no | Data-driven mode: column definitions (`{ id?, accessorKey?, header?, label?, enableSorting?, grow?, principal?, frozen?, width?, align?, kind?, resizable?, hideable?, orderable? }`; `width` (px) sets a fixed pixel column (also needed when a frozen column precedes another frozen column on the same edge, so sticky offsets can be summed); a `grow` column without `width` keeps a shared fixed basis so the header and body stay aligned and the cell never wraps. A column with no `grow` defaults to weight `2` for the **principal** column and `1` for the rest, so the columns fill the available space proportionally. The principal column is the one flagged `principal: true`, or — when none is flagged — the first non-action column. A `kind: 'action'` column is automatically pinned to the trailing (right) edge — staying reachable while the rest scrolls horizontally — and is never resizable. **`resizable: true`** opts a column into a live mouse/touch drag-to-resize handle on its header (native pointer events; the `@tanstack/vue-table` exception covers sorting/pagination/selection/visibility, not sizing). On the first drag of any divider every flexible column freezes at its current rendered width; from then on dragging changes **only that column** and the table grows (horizontal scroll) — the others are untouched. The drag floor is the column's own content width (header label + visible body cells), so a column never shrinks past its content. Frozen and action columns ignore `resizable`. **`label`** overrides the `Table.ColumnSelector` label when `header` is not a string; **`hideable: false`** excludes the column from `Table.ColumnSelector` (e.g. the actions column); **`orderable: true`** opts the column into `columnOrder`. When non-empty, the table renders itself via TanStack. |
| `rowKey` | `string` | `'id'` | no | Field used as the stable row id (for selection). |
| `enableSorting` | `boolean` | `false` | no | Enable sorting globally; per-column `enableSorting` overrides. |
| `enableRowSelection` | `boolean` | `false` | no | Add a leading selection-checkbox column. |
| `selectOnRowClick` | `boolean` | `false` | no | Data-driven mode: clicking a row toggles its selection (requires `enableRowSelection`); interactive cells still own their own click. |
| `headerVariant` | `'default' \| 'compact'` | `'default'` | no | Header density (data-driven): `compact` shrinks the column-header row's height and padding. Forwarded to the `TableHeader`'s `variant`. |
| `paginated` | `boolean` | `false` | no | Render a Paginator in the footer. |
| `pageSize` | `number` | `10` | no | Rows per page when paginated. |
| `sorting` | `SortingState` | `undefined` | no | v-model:sorting (TanStack SortingState). |
| `rowSelection` | `RowSelectionState` | `undefined` | no | v-model:rowSelection (TanStack RowSelectionState). |
| `columnVisibility` | `VisibilityState` | `undefined` | no | v-model:columnVisibility (TanStack VisibilityState). |
| `globalFilter` | `string` | `undefined` | no | v-model:globalFilter text. |
| `pagination` | `PaginationState` | `undefined` | no | v-model:pagination (TanStack PaginationState). |
| `manualSorting` | `boolean` | `false` | no | Server-side sorting: emit events, do not sort locally. |
| `manualPagination` | `boolean` | `false` | no | Server-side pagination: emit events, do not slice locally. |
| `manualFiltering` | `boolean` | `false` | no | Server-side filtering: emit events, do not filter locally. |
| `rowCount` | `number` | `undefined` | no | Total row count for manual pagination. |
| `rowsPerPageOptions` | `number[]` | `[10, 25, 50, 100]` | no | Rows-per-page options shown in the footer selector. |
| `loading` | `boolean` | `false` | no | Data-driven mode: render skeleton rows in the body (aligned to the visible columns) and set `aria-busy`; `Table.RefreshButton` disables/spins while true. Precedence: `loading` → skeleton, else rows, else `empty`. |
| `filters` | `AppliedFilter[]` | `undefined` | no | v-model:filters — structured applied conditions committed by `Table.Filter`, distinct from `globalFilter`. Client-side they map to TanStack column filters; under `manualFiltering` they are emitted for a server refetch. |
| `filterFields` | `FilterField[]` | `[]` | no | Field catalog the built-in `Table.Filter` builder offers (id, label, value type, allowed operators, select options). Omit and use `Table.Filter`'s default slot to plug a custom builder. |
| `state` | `TableStateSnapshot` | `undefined` | no | v-model:state — an aggregate serializable snapshot layered over the per-concern models. A bound per-concern v-model (e.g. `v-model:sorting`) wins over `state` for that concern. |
| `initialState` | `Partial<TableStateSnapshot>` | `undefined` | no | Uncontrolled seed applied once on mount; seeds only concerns that are not bound to their own v-model. |
| `exportFilename` | `string` | `'export.csv'` | no | Default filename for `Table.Export` and `exportCsv()` when no per-call filename is given. |

## Events

<!-- Root events fire only in data-driven mode. In composition mode, sort comes from
     table-head-cell (`sort`) and row clicks fall through on table-row. -->

| Event | Payload | Notes |
|---|---|---|
| `update:sorting` | `value: SortingState` | v-model:sorting. |
| `update:rowSelection` | `value: RowSelectionState` | v-model:rowSelection. |
| `update:columnVisibility` | `value: VisibilityState` | v-model:columnVisibility. |
| `update:globalFilter` | `value: string` | v-model:globalFilter. |
| `update:pagination` | `value: PaginationState` | v-model:pagination. |
| `row-click` | `row: Record<string, unknown>` | Fires when a rendered row is clicked (data-driven mode). |
| `update:filters` | `value: AppliedFilter[]` | v-model:filters. |
| `update:state` | `value: TableStateSnapshot` | v-model:state; debounced so bursts of changes coalesce. |
| `filter-apply` | `filters: AppliedFilter[]` | The filter builder was committed (Apply) — the explicit re-query signal for `manualFiltering`. |
| `filter-remove` | `filter: AppliedFilter` | One applied filter/chip was removed. |
| `refresh` | `—` | Refresh requested (`Table.RefreshButton` or `reload()`); the app refetches. |
| `export` | `rows: Record<string, unknown>[]` | Export requested with the resolved rows; a consumer may handle it server-side (otherwise the built-in CSV util downloads). |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Composition mode: the scrollable region (TableCaption, TableHeader, TableBody). |
| `footer` | — | Footer region rendered below the scroll viewport (e.g. TableFooter + Paginator), so it never scrolls with the body. In data-driven mode it renders automatically when `paginated`. |
| `caption` | — | Data-driven mode: caption content (wrapped in TableCaption), fixed above the scroll viewport. |
| `title` | — | Title text shown at the start of the toolbar band, fixed above the scroll viewport (both modes). |
| `toolbar` | `{ table, selectedRows, selectedCount, clearSelection, loading }` | Action band (search, filter trigger, refresh, export, column-selector) above the scroll viewport, end-aligned beside the title. `table` is the TanStack instance in data-driven mode, `undefined` in composition mode; `selectedRows` / `selectedCount` / `clearSelection` expose the selection for bulk-action toolbars, and `loading` mirrors the prop. |
| `filters` | `{ table, selectedRows, selectedCount, clearSelection, loading }` | Active-filter chips row below the toolbar (both modes); same scope as `toolbar`. |
| `empty` | — | Data-driven mode: shown when there are no rows. Defaults to an empty-state block (illustration + title + description) following Figma; override the slot for custom copy/actions. |

Per-column slots (data-driven mode) are name-computed at runtime, one per column id, so they are documented here rather than as enumerable `defineSlots` rows: `cell-<columnId>` (scope `{ row, value }`) renders custom body-cell content; `header-<columnId>` (scope `{ column }`) renders custom header content.

**Imperative API (via `defineExpose`).** The root also exposes `reload()`, `clearFilters()`, `exportCsv(options?)`, `getState()`, and `setState(partial)` on its instance, so controls or app logic rendered outside the root can drive the table through a template ref (`t.clearFilters()` on `<Table ref="t" />`). Mutating methods are no-ops while `loading`. `reload()` emits `refresh` — the table is data-agnostic, so the app performs the refetch. `getState()` returns a deep-cloned `TableStateSnapshot`; `setState(partial)` writes the same per-concern models that back `v-model:state` (it does not call TanStack's `setState`). The raw TanStack instance is intentionally not on the ref — reach it through the `toolbar`/`filters` slot scope when needed. `Table.Filter` / `Table.AppliedFilters` / `Table.ColumnSelector` / `Table.Export` / `Table.RefreshButton` read this same state through the injected context, so they need no wiring.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `selected`
- The viewport is always a scroll container (`overflow: auto`): horizontal scroll is automatic when columns overflow; vertical scroll engages only when `maxHeight` constrains the content.
- `data-frozen` on TableHeader (`true`), TableHeadCell / TableCell (`start` | `end`), and TableRow (`true`). A frozen head/body cell renders a CSS-only fade (gradient pseudo-element) just outside its inner edge that dissolves the horizontally scrolling content into the row background (`from-transparent` → `var(--table-row-bg)`, the row-published color, so it matches the row on hover/selected) — `frozen=start` fades on the right, `frozen=end` on the left. The fade tints nothing; it only masks the content sliding under the pinned column.
- `data-state` on TableRow: `selected` | `unselected`; `data-selected` mirrors the `selected` prop; `aria-selected` set when selected.
- `data-kind` on TableHeadCell (`default` | `checkbox` | `action` | `slot`) and TableCell (`default` | `checkbox` | `action`).
- `data-align` on head/body cells: `start` | `center` | `end`.
- `data-grow` on head/body cells: `1` | `2` | `3` (flex weight).
- `data-sortable` and `data-sort` (`none` | `ascending` | `descending`) on TableHeadCell; `aria-sort` mirrors `data-sort`.
- `data-direction` (`none` | `ascending` | `descending`) and `data-hidden` on TableSortButton.
- `data-clickable` on TableCell mirrors the `clickable` prop.

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| row hover / selected | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |
| sort glyph reveal on header hover | `transition-opacity duration-150 ease-out` | inline | `motion-reduce:transition-none` |
| filter / column-selector popover open | `animate-popup-scale-in` | `semantic/animations.js` | `motion-reduce:animate-none` |
| filter / column-selector popover close | `animate-popup-scale-out` | `semantic/animations.js` | `motion-reduce:animate-none` |
| data body enter (initial load / reload) | `transition-[opacity,transform] duration-300 ease-out` — enter `opacity-0 translate-y-2` → `opacity-100 translate-y-0` | inline | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| header typography | `.text-label-sm` |
| toolbar title typography | `.text-label-md` |
| body cell typography | `.text-label-md` |
| secondary / description typography | `.text-label-sm` |
| surface | `var(--bg-surface)` |
| outer border (card edge) | `var(--border-default)` |
| outer border width | `var(--border-width-default)` |
| frozen column surface / edge fade (follow the row via `--table-row-bg`) | `var(--bg-surface)` · `var(--bg-canvas)` · `var(--bg-selected)` |
| frozen column edge fade (dissolves scrolling content) | `var(--bg-surface)` |
| row hover | `var(--bg-canvas)` |
| row selected | `var(--bg-selected)` |
| text | `var(--text-default)` |
| text muted (header / description) | `var(--text-muted)` |
| divider | `var(--border-default)` |
| divider width | `var(--border-width-default)` |
| cell padding x | `var(--spacing-sm)` |
| gap | `var(--spacing-xs)` |
| shape (cells / surface) | `var(--shape-elements)` |
| shape (sort button) | `var(--shape-button)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` on the sort button and any interactive cell content.
- Keyboard map: `Tab` focuses sortable headers and interactive cell content; `Enter`/`Space` toggles a sortable header; row click is mouse/touch (no keyboard trap).
- ARIA: root `role="table"`; `table-header`/`table-body`/`table-footer` `role="rowgroup"`; `table-row` `role="row"`; `table-head-cell` `role="columnheader"` with `aria-sort` when sortable; `table-cell` `role="cell"`; selected rows set `aria-selected`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including muted header text.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px on the sort button and row action controls.

## Stories (Storybook)

This component has no `kind`/`size` on its root, so the canonical Types/Sizes stories do not apply. Instead there is one story per scenario (the component's value is the behaviors, not root variants) plus a Full reference; each wires its events to the Actions panel.

Most stories use the data-driven API (`<Table :data :columns>` via the TanStack engine, the granted `@tanstack/vue-table` exception) with per-column `cell-<id>` slots and a shared row-action menu; one story (Composition) instead hand-composes the compound dot-notation form (`<Table.Header>` / `<Table.Row>` / `<Table.HeadCell>` / `<Table.Body>` / `<Table.Cell>`) to document the composition writing style the `## Usage` block leads with. Every story uses a small, generic dataset (≤10 anonymous rows, no real names/emails). Per the toolbar policy, **only Full Example renders the `#toolbar` / `#filters` band** — every other story omits it so the table opens straight onto its compact column-header row.

- Composition — the compound dot-notation form built by hand (`<Table.Header>` / `<Table.Row>` / `<Table.HeadCell>` / `<Table.Body>` / `<Table.Cell>`, no `data`/`columns`); justified because the composition writing style is the primary documented API and needs a worked example separate from the data-driven mode.
- With Checkboxes — selection scenario; `enable-row-selection` adds the leading checkbox column with a select-all header (all / none / indeterminate) and per-row selection via `v-model:row-selection`; justified because the selection surface (`kind="checkbox"` cell + select-all) is a distinct behavior.
- Compact Header — a denser header via `header-variant="compact"` (reduced header-row height and padding), with no toolbar band so the table opens straight onto that header row; justified because the compact header density is a distinct presentation.
- Bordered — the outer card border drawn via the `border` prop (`<Table border>`); justified because the opt-in surface border (off by default) is a distinct presentation toggle.
- Selected Row — a pre-selected row (the `var(--bg-selected)` surface + `aria-selected`) seeded through `v-model:row-selection`, with `select-on-row-click` toggling selection on inert row clicks; justified because the selected-row state and row-click selection are distinct behaviors.
- Fixed Layout with Column Sizes — every column declares an explicit pixel `width` (fixed layout, columns keep their declared size and scroll horizontally past the surface); justified because explicit column sizing is distinct from the grow-to-fill default.
- Resizable Columns — a simple table whose columns opt into drag-to-resize via per-column `resizable: true`; dragging a header divider resizes only that column (the others freeze) and the table grows; justified because the per-column resize affordance is a distinct behavior.
- Sticky Column — freeze scenario; a frozen start column (Name) and a frozen actions (end) column inside a horizontally scrollable container, with the CSS-only edge fade; justified because the freeze system is the primary differentiator of this component.
- Compact Header with Sticky Column — the compact header density (`header-variant="compact"`) combined with frozen start/end columns inside a horizontally scrollable container; justified because combining the compact header with frozen columns is a distinct composite scenario.
- Full Example — the complete data table over the same generic ≤10-row dataset, paginated with a small `page-size` so the paginator spans a couple of pages: the only story with the toolbar band — a composed `#toolbar` (`Table.Filter` / context-aware `Table.Search` / `Table.RefreshButton` / `Table.Export` / `Table.ColumnSelector`) with a removable `#filters` row (`Table.AppliedFilters` beside the search chip) — plus select-all + sortable headers, status Tags, per-row actions, frozen Name + actions columns, every other column `resizable`, the `border` prop, and a paginator; justified because the assembled page is the canonical real-world usage.
- Advanced Filter — the `Table.Filter` builder (field/operator/value) committing removable/editable `Table.AppliedFilters` chips over the generic dataset; justified because the structured-filter flow (build → apply → chip → edit/remove) is the headline new behavior.
- Column Selector — `Table.ColumnSelector` toggling column visibility over the same dataset; justified because the visibility-picker UI is a distinct new affordance over the existing `columnVisibility` state.
- Export — `Table.Export` downloading the visible / ordered / filtered rows as CSV; justified because CSV export is a distinct new capability and documents the `exportFilename` / `scope` surface.
- Loading — `:loading="true"` rendering skeleton rows aligned to the columns, plus the empty-vs-loading precedence; justified because the dynamic / server-side loading state is a distinct presentation.
- Serializable State — round-trips `getState()` → `setState()` (and mirrors `v-model:state`) to demonstrate save / restore without a router; justified because the state-snapshot API is the mechanism the app uses for URL / localStorage persistence and needs a worked example.

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
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export and the root `package.json` main/module point at `index.ts`, `types` at `index.d.ts`. Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
