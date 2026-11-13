# Table

> Composition primitives for building accessible, pixel-perfect data tables, in two modes. **Composition mode** (default): compose the anatomy by hand (header / body / rows / cells) — the component owns markup, tokens, a11y, configurable column sizing (an emphasized first column), sortable headers, selectable rows, and a **freeze system** for sticky columns (e.g. an actions column) and a sticky header. **Data-driven mode**: pass `data` + `columns` and the table renders itself via the headless **`@tanstack/vue-table`** engine, still rendering through the same primitives (our markup/tokens/a11y, pixel-perfect to Figma). Pairs with the [`Pagination`](pagination.md) component (rendered automatically in the footer when `paginated`). A top **toolbar band** (`title` / `toolbar` / `filters` slots) sits above the scroll viewport in both modes for a title, search / filter / export / column-selector actions, and removable filter chips; the `toolbar` and `filters` slots are scoped with the TanStack `table` instance (in data-driven mode) so the consumer can drive filtering, global search, and column visibility through the table's own methods. **Engine.** Data-driven mode is driven by **`@tanstack/vue-table`** (`useVueTable` + `getCoreRowModel` / `getSortedRowModel` / `getFilteredRowModel` / `getPaginationRowModel`), covering sorting, pagination, row selection, column visibility, and global filtering — client- and server-side (`manualSorting` / `manualPagination` / `manualFiltering`). It is a pure-logic library (no markup/styles/positioning/animation), granted narrowly to this single component per [`.claude/rules/dependencies.md`](https://github.com/aziontech/webkit/blob/main/.claude/rules/dependencies.md) § Exceptions; rendering stays 100% in our primitives. State is exposed via v-model (`sorting`, `rowSelection`, `columnVisibility`, `globalFilter`, `pagination`, plus the structured `filters` model and the aggregate `state` snapshot below). `@tanstack/virtual` remains forbidden: the opt-in `virtual` mode windows the rows itself (spacer padding above and below the rendered slice, sized from a height index: each rendered row is measured with a `ResizeObserver`, rows not yet rendered take the average of the first rows measured, and when a row above the rows in view changes height the scroll position moves by the same amount so the rows in view stay still). Without `virtual`, a list of more than 200 rows renders its first 50 rows and mounts the rest as a spacer below them nears the viewport (an `IntersectionObserver`), so a long page costs what is on screen. **Toolbar & imperative API.** The toolbar band composes context-aware controls that drive the table through the injected context with no wiring: `Table.Filter` (a structured field/operator/value builder that commits removable/editable filter chips, with an escape slot to plug a custom builder such as the console's AQL), `Table.AppliedFilters` (the chips), `Table.ColumnSelector` (a column-visibility picker over the existing `columnVisibility` state), `Table.Export` (CSV download), and `Table.RefreshButton`. Structured filters are a first-class model (`v-model:filters`, an `AppliedFilter[]` distinct from the free-text `globalFilter`) mapped to the TanStack column filters client-side, or emitted for a server refetch under `manualFiltering`. A `loading` prop renders skeleton rows for dynamic (server-side) data. The root exposes a **curated imperative API** via `defineExpose` (`reload`, `clearFilters`, `exportCsv`, `getState`, `setState`) so controls or logic outside the table can drive it through a template ref, and a serializable `TableStateSnapshot` (`sorting` / `pagination` / `columnVisibility` / `columnOrder` / `globalFilter` / `filters`) is exposed via `v-model:state` + `getState()` / `setState()` + an `initialState` seed — the component stays router-agnostic, so the consuming app owns any URL / localStorage persistence. CSV serialization lives in a pure util at [`@aziontech/webkit/utils/csv`](https://github.com/aziontech/webkit/blob/main/packages/webkit/src/utils/csv.ts) (`toCsv` + `downloadCsv`). **Types** (declared in `injection-key.ts`, re-exported for consumers): `FilterOperator` = `'eq' | 'neq' | 'contains' | 'not-contains' | 'starts-with' | 'ends-with' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not-in' | 'is-empty' | 'is-not-empty'`; `FilterField` = `{ id: string; label: string; type: 'text' | 'number' | 'select' | 'multi-select' | 'boolean' | 'date'; operators?: FilterOperator[]; options?: { label: string; value: string | number | boolean }[] }`; `AppliedFilter` = `{ field: string; operator: FilterOperator; value: string | number | boolean | Array<string | number>; label?: string }`; `TableStateSnapshot` = `{ sorting?: SortingState; pagination?: PaginationState; columnVisibility?: VisibilityState; columnOrder?: string[]; globalFilter?: string; filters?: AppliedFilter[] }` (every field optional so `setState` / `initialState` accept a partial; JSON-serializable). **Collections.** `useCollection` (`@aziontech/webkit/use-collection`) drives the data-driven mode in both client and server modes: `tableProps` binds `data` (one page), `columns` (ordered by the saved preferences), `rowKey`, `loading`, `sorting`, `manualSorting` / `manualFiltering` / `manualPagination`, `paginated`, `pagination`, `rowCount`, `rowsPerPageOptions`, `enableRowSelection`, `rowSelection`, `columnVisibility` and the three display preferences (`density`, `wrapLines`, `striped`) together with their update handlers, and `exportRows`, in one `v-bind`. The table keeps rendering one page; the composable owns filtering, sorting, paging and selection across pages, so `exportRows` hands `Table.Export` and `exportCsv()` every match rather than the page: in client mode the matching items (or every item for the `all` scope), in server mode what the collection's `exportAll` callback loads (the loaded page when there is none). **Cell presets and reordering.** Six presets render the cells every list repeats, each inside a `#cell-<id>` slot: `Table.CellLink` (a name that leaves the screen: an optional muted leading glyph (`icon`) for the provider or resource type, a 12 px external mark, a tooltip naming the destination, underline on hover, no mark without a destination; optional `+N` overflow through `OverflowCount` and a copy button pinned to the end edge), `Table.CellId` (an identifier with its copy button), `Table.CellStatus` (one semantic `Tag`), `Table.CellTags` (as many tags as fit, the rest behind `+N`), `Table.CellTime` (avatar of the author plus a relative time that updates every minute, or counts from the nearest `WebkitProvider`'s `now`, the absolute time on the tooltip and for screen readers) and `Table.CellActions` (the row menu named after the row). `reorderable` adds a leading grip column: drag a grip with the pointer, or focus it and press Arrow Up, Arrow Down, Home or End; the table emits `update:data` with the reordered records and `reorder` with `{ from, to, row }`, announces every move in a polite status region and locks while a sort is applied; `rowReorderable` keeps chosen rows (a pinned default) in place.

- Import: `import TableRoot from '@aziontech/webkit/table-root'`
- Compound import (dot notation, not tree-shakeable): `import Table from '@aziontech/webkit/table'`
- Category: data · Surface: product · Structure: composition
- API as JSON: [table.json](https://github.com/aziontech/webkit/blob/main/.specs/table.json)

## When to use

- Records with the same fields shown in rows and columns, where the reader compares, sorts, selects or acts on rows (resource lists, logs, usage breakdowns).
- A list needs a toolbar for search, structured filters, column visibility, CSV export or refresh — the `Table.*` toolbar parts drive the table through context.
- Server-backed data that pages, sorts or filters on the API: `manual-pagination`, `manual-sorting` and `manual-filtering` emit the state instead of slicing locally.

## Do

- For repeated data, use data-driven mode: pass `data` + `columns` (any non-empty `columns` switches it on) and customize cells with the `cell-<columnId>` / `header-<columnId>` slots instead of composing N rows by hand. Compose `Table.Header` / `Table.Body` / `Table.Row` / `Table.Cell` only for small, static tables.
- Give rows a stable id under `row-key` (default `'id'`); selection and `v-model:row-selection` are keyed by it.
- Mark the row-actions column `kind: 'action'` so it pins to the trailing edge; give chip or short-token columns a `minWidth` rather than a fixed `width`.
- Give `Table.CellTime` dates from your data. Where the text must not depend on when it renders (an example, a test, a server render the browser hydrates), set `now` on the app's `WebkitProvider` and count sample dates back from that constant; never build them from `Date.now()` / `new Date()` in setup.
- Drive loading through the `loading` prop (skeleton rows, `aria-busy`) and keep the `empty` slot for no-data copy — do not swap the table for a spinner.
- On a phone a console list keeps its grid and scrolls sideways (the default). Set `stackable` only for a short list read one record at a time on a narrow, phone-first surface (a marketing listing, a summary in a side panel), where a card per row reads better than a scroll; never on a resource index, a log or a list compared across columns.
- Type the rows, not the slot: pass a typed `data` (`ref<Domain[]>([])`, or a literal array) and destructure `#cell-name="{ row, value }"` — `row` is a `Domain` and `value` is `Domain['name']`. Keep a column's `id` equal to its `accessorKey` (or leave `id` out) so the typed `value` is the field the cell shows. Do not annotate the slot scope by hand or cast `row as Domain`; a wrong field (`row.nmae`) should be a type error.
- Place `Table.Search`, `Table.Filter`, `Table.ColumnSelector`, `Table.Export` and `Table.RefreshButton` in the `toolbar` slot with no `v-model` wiring — they read the table from context. `Table.Search` and `Table.ColumnSelector` act on the TanStack instance, so they need data-driven mode.

## Don’t

- A short titled preview of a longer listing on a marketing page → use `listing-table`.
- A feature-by-feature comparison of Azion with a competitor → use `comparison-table`.
- Rows of mixed content (media, title, description, actions) that do not share columns → use `item`.
- A grid of selectable cards or options → use `radio-cards`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [pagination](pagination.md) — the page strip; a data-driven table with `paginated` renders and wires it in the footer.
- [listing-table](listing-table.md) — marketing section that composes `table` for a linked preview of a list.
- [empty-state](empty-state.md) — the pattern behind the table's default `empty` slot; override the slot for resource-specific copy and actions.
- [item](item.md) — list rows without a column structure.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `maxHeight` | `string` | `''` | false | Max height (CSS length). The viewport scrolls dynamically: horizontal scroll appears automatically when columns overflow the width; vertical scroll appears only when `maxHeight` is set smaller than the content (under the sticky header). |
| `bordered` | `boolean` | `false` | false | Draw the outer card border around the table. Off by default (the table is typically framed by a surrounding surface); set `bordered` / `:bordered="…"` to draw the `var(--border-default)` outline. The internal row dividers are unaffected. |
| `data` | `TRow[]` | `[]` | false | Data-driven mode: row records. |
| `columns` | `TableColumn[]` | `[]` | false | Data-driven mode: column definitions (`{ id?, accessorKey?, header?, label?, enableSorting?, grow?, principal?, frozen?, width?, minWidth?, align?, kind?, resizable?, hideable?, orderable? }`; `width` (px) sets a fixed pixel column (also needed when a frozen column precedes another frozen column on the same edge, so sticky offsets can be summed); **`minWidth`** (px) sets a **floor** instead: the table measures the column's own content — its header, including the sort affordance, and every rendered body cell — and pins the column to the larger of the two, as **one** width applied to the header and every body cell (a per-cell `min-width` would let each row size to its own content and drift the header away from the body). It is for a column whose content is a chip or a short token: a fixed `width` there is a bet in both directions — too generous and it reserves space the rest of the row needs, too tight and the chip inside it truncates. The measured width tracks the **rendered page**, so a column can change width when paging or sorting brings longer content into view; `width` wins when both are set, and a user resize wins over both. a `grow` column without `width` keeps a shared fixed basis so the header and body stay aligned and the cell never wraps. A column with no `grow` defaults to weight `2` for the **principal** column and `1` for the rest, so the columns fill the available space proportionally. The principal column is the one flagged `principal: true`, or — when none is flagged — the first non-action column. A `kind: 'action'` column is automatically pinned to the trailing (right) edge — staying reachable while the rest scrolls horizontally — and is never resizable. **`resizable: true`** opts a column into a live mouse/touch drag-to-resize handle on its header (native pointer events; the `@tanstack/vue-table` exception covers sorting/pagination/selection/visibility, not sizing). On the first drag of any divider every flexible column freezes at its current rendered width; from then on dragging changes **only that column** and the table grows (horizontal scroll) — the others are untouched. The drag floor is the column's own content width (header label + visible body cells), so a column never shrinks past its content. Frozen and action columns ignore `resizable`. **`label`** overrides the `Table.ColumnSelector` label when `header` is not a string; **`hideable: false`** excludes the column from `Table.ColumnSelector` (e.g. the actions column); **`orderable: true`** opts the column into `columnOrder`. When non-empty, the table renders itself via TanStack. |
| `rowKey` | `string` | `'id'` | false | Field used as the stable row id (for selection). |
| `enableSorting` | `boolean` | `false` | false | Enable sorting globally; per-column `enableSorting` overrides. |
| `enableRowSelection` | `boolean` | `false` | false | Add a leading selection-checkbox column. |
| `rowSelectable` | `(row: TRow) => boolean` | `undefined` | false | Data-driven mode: decides per row whether it can be selected (`(row) => row.kind === 'file'`). A row it rejects draws no checkbox, ignores row clicks and stays out of Select all. |
| `selectOnRowClick` | `boolean` | `false` | false | Data-driven mode: clicking a row toggles its selection (requires `enableRowSelection`); interactive cells still own their own click. |
| `headerKind` | `'default' \| 'compact'` | `'default'` | false | Header density (data-driven): `compact` shrinks the column-header row's height and padding. Forwarded to the `TableHeader`'s `kind`. |
| `paginated` | `boolean` | `false` | false | Render a Pagination in the footer. |
| `pageSize` | `number` | `10` | false | Rows per page when paginated. |
| `sorting` | `SortingState` | `undefined` | false | v-model:sorting (TanStack SortingState). |
| `rowSelection` | `RowSelectionState` | `undefined` | false | v-model:rowSelection (TanStack RowSelectionState). |
| `columnVisibility` | `VisibilityState` | `undefined` | false | v-model:columnVisibility (TanStack VisibilityState). |
| `globalFilter` | `string` | `undefined` | false | v-model:globalFilter text. |
| `pagination` | `PaginationState` | `undefined` | false | v-model:pagination (TanStack PaginationState). |
| `manualSorting` | `boolean` | `false` | false | Server-side sorting: emit events, do not sort locally. |
| `manualPagination` | `boolean` | `false` | false | Server-side pagination: emit events, do not slice locally. |
| `manualFiltering` | `boolean` | `false` | false | Server-side filtering: emit events, do not filter locally. |
| `rowCount` | `number` | `undefined` | false | Total row count for manual pagination. |
| `rowsPerPageOptions` | `number[]` | `[10, 25, 50, 100]` | false | Rows-per-page options shown in the footer selector. |
| `loading` | `boolean` | `false` | false | Data-driven mode: render skeleton rows in the body (aligned to the visible columns) and set `aria-busy`; `Table.RefreshButton` disables/spins while true. Precedence: `loading` → skeleton, else rows, else `empty`. |
| `filters` | `AppliedFilter[]` | `undefined` | false | v-model:filters — structured applied conditions committed by `Table.Filter`, distinct from `globalFilter`. Client-side they map to TanStack column filters; under `manualFiltering` they are emitted for a server refetch. |
| `filterFields` | `FilterField[]` | `[]` | false | Field catalog the built-in `Table.Filter` builder offers (id, label, value type, allowed operators, select options). Omit and use `Table.Filter`'s default slot to plug a custom builder. |
| `state` | `TableStateSnapshot` | `undefined` | false | v-model:state — an aggregate serializable snapshot layered over the per-concern models. A bound per-concern v-model (e.g. `v-model:sorting`) wins over `state` for that concern. |
| `initialState` | `Partial<TableStateSnapshot>` | `undefined` | false | Uncontrolled seed applied once on mount; seeds only concerns that are not bound to their own v-model. |
| `exportRows` | `(scope: 'filtered' \| 'all') => TRow[] \| Promise<TRow[]>` | `undefined` | false | Rows `Table.Export` and `exportCsv()` write for the `filtered` and `all` scopes in place of the rows the table holds (the `page` scope always writes the rendered page). `useCollection` binds it so an export covers every match, not only the page; a promise is awaited before the `export` event and the download. |
| `exportFilename` | `string` | `'export.csv'` | false | Default filename for `Table.Export` and `exportCsv()` when no per-call filename is given. |
| `stackable` | `boolean` | `false` | false | Data-driven mode: opt in to stacked rows. When the table's own box is narrower than `--container-lg`, each row renders as a card of label and value pairs instead of the horizontally scrolling grid. Off by default: a console list scrolls sideways on a phone. |
| `wrapLines` | `boolean` | `false` | false | Data-driven mode: cell text wraps onto several lines instead of truncating. |
| `striped` | `boolean` | `false` | false | Data-driven mode: every other body row takes the raised surface. |
| `density` | `'comfortable' \| 'compact'` | `'comfortable'` | false | Row density: `compact` shrinks body rows and cell padding. |
| `virtual` | `boolean` | `false` | false | Data-driven mode: render only the rows in view, for thousands of rows. The viewport scrolls vertically within `maxHeight` (40rem when empty). Ignored in the stacked layout. |
| `estimateRowHeight` | `number` | `48` | false | Row height (px) assumed in `virtual` mode until a row is measured. |
| `reorderable` | `boolean` | `false` | false | Data-driven mode: a leading grip column lets people drag rows, or move the focused grip's row with Arrow Up, Arrow Down, Home and End, into a new order. Emits `update:data` (bind `v-model:data`) and `reorder`; locked while a sort is applied. |
| `rowReorderable` | `(row: TRow) => boolean` | `undefined` | false | With `reorderable`: decides per row whether it can move (`(row) => !row.locked`). A rejected row keeps its place: its grip is disabled, and no row is dropped onto it or moved past it with the keys. |
| `getSubRows` | `(row: TRow) => TRow[] \| undefined` | `undefined` | false | Data-driven mode: tree rows. Returns a row's children (`(row) => row.children`); a row with children gets an expand toggle in the principal column, its children render under it indented one step (`--spacing-md`) per level, and the grid element takes `role="treegrid"`. Sorting and filtering keep each child under its parent; selection is per row (selecting a parent does not select its children). `reorderable` is ignored in tree mode. |
| `expanded` | `ExpandedState` | `undefined` | false | v-model:expanded (TanStack ExpandedState: `true` for every row, or `{ [rowId]: true }`). Uncontrolled it starts collapsed. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:sorting` | `value: SortingState` | v-model:sorting. |
| `update:rowSelection` | `value: RowSelectionState` | v-model:rowSelection. |
| `update:columnVisibility` | `value: VisibilityState` | v-model:columnVisibility. |
| `update:globalFilter` | `value: string` | v-model:globalFilter. |
| `update:pagination` | `value: PaginationState` | v-model:pagination. |
| `row-click` | `(event: MouseEvent, row: TRow)` | Fires when a rendered row is clicked (data-driven mode). `event` is the click; `row` is the clicked record. |
| `update:filters` | `value: AppliedFilter[]` | v-model:filters. |
| `update:state` | `value: TableStateSnapshot` | v-model:state; debounced so bursts of changes coalesce. |
| `filter-apply` | `(event: Event, filters: AppliedFilter[])` | The filter builder was committed (Apply) — the explicit re-query signal for `manualFiltering`. |
| `filter-remove` | `(event: Event, filter: AppliedFilter)` | One applied filter/chip was removed. |
| `refresh` | `—` | Refresh requested (`Table.RefreshButton` or `reload()`); the app refetches. |
| `export` | `rows: TRow[]` | Export requested with the resolved rows; a consumer may handle it server-side (otherwise the built-in CSV util downloads). |
| `update:data` | `value: TRow[]` | reorderable`: the records in their new order; bind `v-model:data`. |
| `reorder` | `payload: { from: number; to: number; row: TRow }` | reorderable`: a row moved from index `from` to index `to` of `data`. |
| `update:expanded` | `value: ExpandedState` | Tree rows: v-model:expanded, after a toggle by pointer or keyboard. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Composition mode: the scrollable region (TableCaption, TableHeader, TableBody). |
| `footer` | — | Footer region rendered below the scroll viewport (e.g. TableFooter + Pagination), so it never scrolls with the body. In data-driven mode it renders automatically when `paginated`. |
| `caption` | — | Data-driven mode: caption content (wrapped in TableCaption), fixed above the scroll viewport. |
| `title` | — | Title text shown at the start of the toolbar band, fixed above the scroll viewport (both modes). |
| `toolbar` | { table, selectedRows, selectedCount, clearSelection, loading } | Action band (search, filter trigger, refresh, export, column-selector) above the scroll viewport, end-aligned beside the title. `table` is the TanStack instance in data-driven mode, `undefined` in composition mode; `selectedRows` / `selectedCount` / `clearSelection` expose the selection for bulk-action toolbars, and `loading` mirrors the prop. |
| `filters` | { table, selectedRows, selectedCount, clearSelection, loading } | Active-filter chips row below the toolbar (both modes); same scope as `toolbar`. |
| `empty` | — | Data-driven mode: shown when there are no rows. Defaults to an empty-state block (illustration + title + description) following Figma; override the slot for custom copy/actions. |

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
- `@aziontech/webkit/table-applied-filters`
- `@aziontech/webkit/table-column-selector`
- `@aziontech/webkit/table-export`
- `@aziontech/webkit/table-refresh-button`

## Sub-components

- `table-header/table-header.vue` — `role="rowgroup"` header band. Props `frozen?: boolean` → sticky top within the scroll container; `variant?: 'default' | 'compact'` → `compact` shrinks the header cells' height and padding (published to the head cells through the row-group context, so the consumer sets it once on the header).
- `table-body/table-body.vue` — `role="rowgroup"` body band.
- `table-footer/table-footer.vue` — footer band below the viewport, outside `role="table"` (hosts the Pagination); muted text.
- `table-caption/table-caption.vue` — caption / title line that names the table (`aria-labelledby`); `text-label-sm` muted.
- `table-row/table-row.vue` — `role="row"`, flex container. Props `selected?: boolean`, `frozen?: boolean`. Forwards native listeners (e.g. `@click`) to its root via attribute fallthrough. Bottom divider `var(--border-width-default)` / `var(--border-default)`; hover `var(--bg-canvas)`; selected `var(--bg-selected)`. The row publishes its resolved background as the `--table-row-bg` custom property so frozen cells (and their edge fade) track the row hover/selected color instead of drifting against it.
- `table-head-cell/table-head-cell.vue` — `role="columnheader"`, height 44px. Props `kind?: 'default' | 'checkbox' | 'action' | 'slot'` (`checkbox`/`action` are 40px fixed-width so the header aligns with the body's checkbox/action cells), `sortable?: boolean`, `sortDirection?: 'none' | 'ascending' | 'descending'`, `align?: 'start' | 'center' | 'end'`, `grow?: 1 | 2 | 3` (flex weight), `principal?: boolean` (defaults the weight to `grow: 2` when `grow` is unset — the principal/emphasized column), `frozen?: 'start' | 'end'`. Emits `sort: [direction: 'ascending' | 'descending']`. Renders `table-sort-button` when `sortable`. When `resizable`, renders a drag-to-resize handle on the right edge (`resizing` reflects the active drag; `resizeHandler` is the pointer handler supplied by the data-driven root).
- `table-cell/table-cell.vue` — `role="cell"`, min height 48px. Props `kind?: 'default' | 'checkbox' | 'action'`, `align?: 'start' | 'center' | 'end'`, `grow?: 1 | 2 | 3`, `principal?: boolean` (defaults the weight to `grow: 2` when `grow` is unset — the principal/emphasized column), `frozen?: 'start' | 'end'`, `clickable?: boolean` (underlines the cell text). Cell text never wraps (single line, truncates) — there is no wrap option. A `grow` column carries a fixed, content-independent flex basis (`flex: <grow> 0 5rem`) identical to its header cell, so the column resolves to the same width in the header and in every body row; when the table overflows it shrinks to that minimum and the viewport scrolls horizontally — instead of each row sizing the column to its own content, which misaligned the header from the body. A `width` column overrides the basis with a fixed pixel width; a `minWidth` column is measured and pinned to one resolved width (the larger of that floor and the widest of its header and rendered cells), so it reserves nothing it is not using and never truncates the chip inside it. Content (avatar, tag, icon, description, copy, "+99") is composed by the consumer via the default slot using existing primitives.
- `table-sort-button/table-sort-button.vue` — sort control used inside `table-head-cell`, rendered as the webkit `IconButton` (`kind="transparent"`, `size="small"` → 28×28) so size, padding, and alignment match the design system. Props `direction?: 'none' | 'ascending' | 'descending'`, `visible?: boolean` (default `true`). Emits `toggle: [direction: 'ascending' | 'descending']`. Glyphs via `pi pi-sort-alt` (none) / `pi pi-sort-amount-up` (ascending) / `pi pi-sort-amount-down` (descending).
- `table-toolbar/table-toolbar.vue` — flex container (end-aligned) for toolbar actions placed in the `toolbar` slot; injects the table context for its testId.
- `table-search/table-search.vue` — context-aware search input. Reads and drives the TanStack `globalFilter` through the injected table context, so it needs no wiring. Prop `placeholder?: string` (default `''`; empty uses the locale catalog, `Search` in English).
- `table-filter/table-filter.vue` — context-aware advanced-filter control. An `IconButton` funnel trigger opens an anchored **popover** — a floating panel positioned by the `use-placement` composable, Teleported to `body`, dismissed on outside-click or `Escape` (no Drawer, no invented overlay part). The built-in builder is rendered from `fields: FilterField[]` (default `[]`) as a field + operator + value composer (field and operator via `Select`, value via a tokenized `Input`; typed value editors come through the escape `default` slot) with an Apply button; committing writes `AppliedFilter[]` through the injected context (and the root `v-model:filters`). Applied conditions are surfaced as `Table.AppliedFilters` chips, never rendered inside the popover. Props `title?: string` (default `''`; empty uses the locale catalog, `Filters` in English) and `count?: number` (default `0`): the number of applied filters shown on the trigger. `0` counts the table's applied filters (`Table.AppliedFilters`), so the built-in builder needs no wiring; set it when the filters live outside the table context (a custom builder in the `default` slot, server-side filters). The trigger shows the count as a small primary `Badge` (`aria-hidden`) on its top end corner and drops it at 0; the count is part of the trigger's accessible name instead (`tableFilter.triggerCount`: `Filters, 3 applied`). This is the WebKit filter button with a count (M2.10 row 64): `Button` takes no count. Emits `apply: [event: Event, filters: AppliedFilter[]]`, `clear: [event: Event]` (DOM event first). Slots: `default` (scope `{ fields, applied, apply, clear, remove }`, where `apply(event)`, `clear(event)` and `remove(event, filter)` take the DOM event of the consumer's own control first, so the table's `filter-apply` / `filter-remove` carry it) is the **escape hatch** — provide a custom builder (e.g. the console's AQL) and the built-in body is not rendered; `trigger` (scope `{ open, count }`, where `count` is the shown count) replaces the trigger visual, badge included. Motion: `animate-popup-scale-in` / `animate-popup-scale-out` paired with `motion-reduce:animate-none`.
- `table-applied-filters/table-applied-filters.vue` — context-aware chip row for the committed structured filters. Renders one webkit `Chip` (`removable`) per `AppliedFilter` (label = `label`, else a formatted `field operator value`), read from the injected context. Emits `remove: [event: MouseEvent, filter: AppliedFilter]` and `edit: [event: MouseEvent | KeyboardEvent, filter: AppliedFilter]` (re-opens the builder pre-filled). Slot `chip` (scope `{ filter, remove }`, where `remove(event)` takes the activation event) overrides one chip. Placed in the `filters` slot.
- `table-column-selector/table-column-selector.vue` — context-aware column-visibility picker (the UI over the already-wired `columnVisibility`). An `IconButton` trigger opens an anchored **popover** (the same `use-placement` pattern as `Table.Filter`) listing each hideable leaf column with a `Checkbox`, toggling visibility through the injected `table`. Respects `column.getCanHide()` / the column's `hideable`. Prop `title?: string` (default `''`; empty uses the locale catalog, `Columns` in English). Slot `trigger` (scope `{ open }`). Motion: `animate-popup-scale-in` / `animate-popup-scale-out` paired with `motion-reduce:animate-none`.
- `table-export/table-export.vue` — context-aware export control (an `IconButton`, download glyph, its name repeated on a `Tooltip`). Calls the injected `exportCsv(options?)`; the root emits `export` with the resolved rows (a consumer may intercept for server-side export, otherwise the built-in CSV util downloads the visible, ordered columns and filtered rows). Props `filename?: string` (default `''` → falls back to the root `exportFilename`), `scope?: 'page' | 'filtered' | 'all'` (default `'filtered'`). Slot `trigger` (scope `{ export }`).
- `table-refresh-button/table-refresh-button.vue` — context-aware refresh control (an `IconButton`, refresh glyph). Calls the injected `reload()`; the root emits `refresh`. Binds `:disabled` to `disabled || loading` (the injected loading flag), so it can't fire mid-fetch. Props `disabled?: boolean` (default `false`) and `loading?: boolean` (default `false`: spins the glyph and blocks a second press while a refresh runs and the current rows stay on screen — the refresh pattern; the table's own `loading` is for a first load with nothing to show). A `Tooltip` repeats its name for pointer users.
- `table-cell-link/table-cell-link.vue` — cross-resource link preset. Props `label?: string`, `href?: string` (outside the app; new tab with a visually hidden `(opens in a new tab)`), `to?: string | Record<string, unknown>` (in-app; the app's registered `RouterLink`, else a plain `href`), `destination?: string` (tooltip `Open <label> in <destination>`), `icon?: string` (default `''`; a glyph class drawn before the name in `var(--text-muted)`, outside the link and `aria-hidden`, naming the provider or the resource type: `ai ai-github` for a repository, `ai ai-workloads` for a workload), `copyable?: boolean`, `copyValue?: string`, `more?: OverflowCountItem[]`, `moreNoun?: OverflowCountNoun`. Clicks stop at the link so a row click does not also fire. No `href`/`to` renders plain truncating text with no mark and no tooltip.
- `table-cell-id/table-cell-id.vue` — identifier preset: the value (`dir="ltr"`, tabular numbers, truncating) and a `CopyButton` pinned to the end edge named `Copy <resource> ID`. Props `value?: string | number`, `resource?: string`.
- `table-cell-status/table-cell-status.vue` — status preset: one `Tag` (`size="medium"`, truncating). Props `label?: string` (empty renders a muted dash), `severity?: TagSeverity` (default `secondary`), `icon?: string`.
- `table-cell-tags/table-cell-tags.vue` — tag list preset: rounded secondary tags, as many as fit the cell (measured with a `ResizeObserver` against a hidden ruler), the rest behind an `OverflowCount`. Props `items?: string[]` (empty renders a muted dash), `icon?: string`, `noun?: OverflowCountNoun` (default `tag` / `tags` from the catalog).
- `table-cell-time/table-cell-time.vue` — last-modified preset: the author's `Avatar` (name on its tooltip; an email reads as a name) and a `<time datetime>` with the relative time (`just now` under 45 s), the absolute time on its tooltip and in visually hidden text. One shared minute clock re-renders every mounted cell; under a `WebkitProvider` with `now` set, every cell reads that reference time instead, so an example, a test or a server render prints the same text wherever and whenever it renders. Props `value?: string | number | Date` (empty or unparseable renders a muted dash), `author?: string`, `avatarSrc?: string`.
- `table-cell-actions/table-cell-actions.vue` — row actions preset: a `DropdownMenu` (`placement="bottom-end"`) triggered by an outlined ellipsis `IconButton` named `Actions for <name>`. Props `name?: string`, `disabled?: boolean`. Emits `select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuOptionValue]`; `DropdownMenuOptionValue` (`string | number`) is re-exported by `./table` and `./table-root`. Default slot: `DropdownMenu.Group`s of `DropdownMenu.Option`s.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `selected`
- The viewport is always a scroll container (`overflow: auto`): horizontal scroll is automatic when columns overflow; vertical scroll engages only when `maxHeight` constrains the content.
- `data-frozen` on TableHeader (`true`), TableHeadCell / TableCell (`start` | `end`), and TableRow (`true`). A frozen head/body cell renders a CSS-only fade (gradient pseudo-element) just outside its inner edge that dissolves the horizontally scrolling content into the row background (`from-transparent` → `var(--table-row-bg)`, the row-published color, so it matches the row on hover/selected) — `frozen=start` fades on the right, `frozen=end` on the left. The fade tints nothing; it only masks the content sliding under the pinned column.
- `data-state` on TableRow: `selected` | `unselected`; `data-selected` mirrors the `selected` prop; `aria-selected` set when selected.
- `data-kind` on TableHeadCell (`default` | `checkbox` | `action` | `slot`) and TableCell (`default` | `checkbox` | `action`).
- `data-align` on head/body cells: `start` | `center` | `end`.
- `data-grow` on head/body cells: `1` | `2` | `3` (flex weight).
- `data-sortable` and `data-sort` (`none` | `ascending` | `descending`) on TableHeadCell; `aria-sort` mirrors `data-sort`.
- `data-direction` (`none` | `ascending` | `descending`) and `data-visible` on TableSortButton.
- `data-clickable` on TableCell mirrors the `clickable` prop.
- Stacked rows (data-driven, opt-in `stackable`): by default the grid scrolls sideways at every width, as the console does on a phone. With `stackable`, the table measures its own box; below `--container-lg` (552 px) it sets `data-stacked` and each body row becomes a bordered card. The checkbox, the principal column and the action column share the first line; every other column takes its own line as a label (the column `label` or `header`, `aria-hidden`) and its value. The header row stays in the DOM visually hidden, so screen readers keep the column headers; frozen offsets and fades are dropped. A hand-composed table never stacks.
- Stacked select-all (data-driven, `enableRowSelection`): in the stacked layout the header checkbox is not rendered; a visible, labelled **Select all rows** checkbox sits above the stacked rows (`__stacked-select-all`) and toggles the page, with the same indeterminate state.
- Per-row selectability (data-driven, `rowSelectable`): a row the function rejects renders an empty selection cell, ignores `selectOnRowClick` and is skipped by Select all; the header checkbox reads `all` when every selectable row is selected.
- Density and wrapping: `data-density="compact"` on the root shrinks body cells (`min-h-9`, `--spacing-xxs` block padding); `data-wrap` lets cell text (and any `.truncate` inside a cell) wrap. `striped` shades odd body rows with `var(--bg-surface-raised)` (selected and hover still win).
- Virtual rows (`virtual`): only the rows in view plus 8 above and below render; the slice starts on an even row so stripes stay put; rows of different heights (`wrapLines` with long text) are measured as they render and the rows in view do not shift while scrolling; the root sets `aria-rowcount` and each row `aria-rowindex`. Skeleton and stacked layouts render every row.
- Long lists (more than 200 rows, not `virtual`): the first 50 rows render, a spacer (`__lazy-rows`, `aria-hidden`) stands in for the rest and more rows mount as it nears the viewport, until every row is in the DOM; while rows are still missing the root sets `aria-rowcount` and each row `aria-rowindex`.
- Responsive toolbar: the root is the `@container/table`; the toolbar wraps, and below `@md` of the table the `toolbar` slot moves under the title and starts at the start edge. `Table.Toolbar` wraps its controls.
- Hover-free devices: a sortable header shows its sort affordance where the pointer cannot hover (`@media (hover: none)`).
- Reorderable rows (`reorderable`): a 40 px leading column holds a grip `IconButton` per row (`data-reorder-handle`), frozen at the start edge when other columns are; the row being dragged sets `data-dragging` (dashed accent outline, 60% opacity) and the row under the pointer `data-drop="before" | "after"` (a 2 px accent line on that edge). While a sort is applied every grip is disabled and its description says to clear the sort.
- Tree rows (`getSubRows`): the grid element is `role="treegrid"` and sets `data-tree`. Each body row carries `aria-level` (1-based depth), `aria-setsize` and `aria-posinset` among its siblings, `aria-expanded` when it has children, and `data-depth`; the principal cell starts with one `aria-hidden` gutter (`data-tree-gutter`) `calc(var(--spacing-md) * depth + var(--size-7))` wide, which holds the 28 px chevron toggle (`__expand-toggle`, `pi-chevron-right` mirrored in RTL, `pi-chevron-down` when open) at its end on rows with children, so the content of every row at one depth starts on one column and each level shifts it by exactly one step. Rows use a roving tab stop (one row has `tabindex="0"`, the rest `-1`) and draw an inset `var(--ring-color)` outline on `focus-visible`.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the sort button and any interactive cell content.
- Keyboard map: `Tab` focuses sortable headers and interactive cell content; `Enter`/`Space` toggles a sortable header; row click is mouse/touch (no keyboard trap).
- ARIA: `role="table"` sits on the grid element inside the scroll viewport (testid `<testid>__table`), not on the root: the root also holds the toolbar, applied filters, the focusable scroll viewport, the stacked select-all, the empty state and the pagination, and any of those inside a `table` is an unallowed child (`aria-required-children`). Every `aria-*` attribute passed to `Table` (`aria-label`, `aria-labelledby`, `aria-describedby`…) is forwarded to that element, as are `aria-busy` (loading) and `aria-rowcount` (windowed); every other attribute stays on the root. The data-driven pagination is a plain region under the viewport (`<testid>__footer`), not a `rowgroup`, and the `caption` slot renders as the table's first child. `table-caption` is a plain element (no `role`) that names the table through `aria-labelledby` unless the consumer names it with `aria-label`/`aria-labelledby`. In composition mode the default slot is the table's content, so it holds rowgroups (and a caption) only; anything else goes in `footer` or around the `Table`. `table-header`/`table-body` `role="rowgroup"`; `table-footer` has no role (it hosts pagination or an action, not rows); `table-row` `role="row"`; `table-head-cell` `role="columnheader"` with `aria-sort` when sortable; `table-cell` `role="cell"`; selected rows set `aria-selected`.
- Virtual rows keep their position for assistive technology: `aria-rowcount` on the `role="table"` element (rows + header) and `aria-rowindex` on each rendered row.
- Reorderable rows: each grip is a button named `Reorder <row name>, position <n> of <total>` and described by a visually hidden hint (`Drag, or press Arrow Up or Arrow Down to move.`, or the lock reason). Arrow Up / Arrow Down / Home / End move the row and keep focus on its grip; `Esc` cancels a drag. A polite `role="status"` region announces `Moved <name> to position <n> of <total>.` (keyboard) or `Dropped …` (pointer). Dragging is never the only way to reorder (WCAG 2.5.7).
- Tree rows follow the APG treegrid row-focus pattern: `Tab` enters the grid on one row (the last one focused, else the first); `Arrow Down` / `Arrow Up` move between visible rows; `Home` / `End` go to the first / last row; `Arrow Right` (inline end, mirrored in RTL) opens a closed row or moves to the first child of an open one; `Arrow Left` closes an open row or moves to the parent; `Enter` toggles the row; `Space` toggles its selection when `enableRowSelection` allows it. Interactive content inside the row (checkbox, menus) stays reachable with `Tab`. The pointer toggle is `aria-hidden` (the row's `aria-expanded` is the accessible state), and when a row collapses while one of its descendants holds focus, focus moves to that row.
- Stacked layout: the select-all is a visible checkbox with a `<label>`, not a screen-reader-only header cell (WCAG 2.5.3, label in name).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including muted header text.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px on the sort button and row action controls.
- Filter count: `Table.Filter`'s trigger is named `Filters` with no filter applied and `Filters, <n> applied` (`tableFilter.triggerCount`, plural in pt-BR and es) otherwise; the count badge is `aria-hidden`, so the number is read once.
- Teleported content: the `Table.Filter` and `Table.ColumnSelector` panels, teleported to `body`, bind `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so they keep the provider's direction and language. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

### Default

```vue
<script setup>
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const rows = [
    {
      id: '1001',
      name: 'Workload Alpha',
      status: 'Active',
      editor: 'user1@example.com',
      modified: 'Jan 1, 2026, 09:00 AM',
      protocol: 'HTTP & HTTPS',
      domains: 2,
      origins: 1,
      created: 'Dec 1, 2025, 10:00 AM'
    },
    {
      id: '1002',
      name: 'Workload Bravo',
      status: 'Inactive',
      editor: 'user2@example.com',
      modified: 'Jan 2, 2026, 09:00 AM',
      protocol: 'HTTP',
      domains: 1,
      origins: 2,
      created: 'Dec 2, 2025, 10:00 AM'
    },
    {
      id: '1003',
      name: 'Workload Charlie',
      status: 'Degraded',
      editor: 'user3@example.com',
      modified: 'Jan 3, 2026, 09:00 AM',
      protocol: 'gRPC',
      domains: 3,
      origins: 1,
      created: 'Dec 3, 2025, 10:00 AM'
    }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'id', header: 'ID', enableSorting: false },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'editor', header: 'Last Editor', enableSorting: false, grow: 2 },
    { accessorKey: 'modified', header: 'Last Modified', grow: 2 },
    { id: 'actions', header: '', kind: 'action', enableSorting: false }
  ]

  const sorting = ref([])

  const rowActionGroups = [
    [
      { value: 'view', label: 'View details', icon: 'pi pi-eye' },
      { value: 'edit', label: 'Edit', icon: 'pi pi-pencil' },
      { value: 'duplicate', label: 'Duplicate', icon: 'pi pi-copy' }
    ],
    [{ value: 'delete', label: 'Delete', icon: 'pi pi-trash' }]
  ]

  const statusSeverity = (status) =>
    status === 'Active' ? 'success' : status === 'Degraded' ? 'warning' : 'danger'

  const onRowClick = (_row) => {}
  const onRowAction = (_payload) => {}
</script>

<template>
  <TableRoot
    :data="rows"
    :columns="columns"
    row-key="id"
    enable-sorting
    paginated
    :page-size="5"
    bordered
    v-model:sorting="sorting"
    @row-click="onRowClick"
  >
    <template #cell-name="{ row, value }">
      <a
        :href="'/workloads/' + row.id"
        class="cursor-pointer truncate text-(--text-default) no-underline hover:underline active:underline"
        >{{ value }}</a
      >
    </template>
    <template #cell-status="{ value }">
      <Tag :severity="statusSeverity(value)">{{ value }}</Tag>
    </template>
    <template #header-actions>
      <span class="sr-only">Actions</span>
    </template>
    <template #cell-actions="{ row }">
      <DropdownMenuRoot @select="({ value }) => onRowAction({ id: row.id, action: { value } })">
        <DropdownMenuTrigger>
          <IconButton
            icon="pi pi-ellipsis-v"
            aria-label="Row actions"
            kind="transparent"
            size="small"
          />
        </DropdownMenuTrigger>
        <DropdownMenuGroup
          v-for="(group, gi) in rowActionGroups"
          :key="gi"
        >
          <DropdownMenuOption
            v-for="option in group"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          >
            <template #left
              ><i
                :class="option.icon"
                aria-hidden="true"
            /></template>
          </DropdownMenuOption>
        </DropdownMenuGroup>
      </DropdownMenuRoot>
    </template>
  </TableRoot>
</template>
```

### Composition

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

### WithCheckboxes

```vue
<script setup>
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const rows = [
    {
      id: '1001',
      name: 'Workload Alpha',
      status: 'Active',
      editor: 'user1@example.com',
      modified: 'Jan 1, 2026, 09:00 AM',
      protocol: 'HTTP & HTTPS',
      domains: 2,
      origins: 1,
      created: 'Dec 1, 2025, 10:00 AM'
    },
    {
      id: '1002',
      name: 'Workload Bravo',
      status: 'Inactive',
      editor: 'user2@example.com',
      modified: 'Jan 2, 2026, 09:00 AM',
      protocol: 'HTTP',
      domains: 1,
      origins: 2,
      created: 'Dec 2, 2025, 10:00 AM'
    },
    {
      id: '1003',
      name: 'Workload Charlie',
      status: 'Degraded',
      editor: 'user3@example.com',
      modified: 'Jan 3, 2026, 09:00 AM',
      protocol: 'gRPC',
      domains: 3,
      origins: 1,
      created: 'Dec 3, 2025, 10:00 AM'
    }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'id', header: 'ID', enableSorting: false },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'editor', header: 'Last Editor', enableSorting: false, grow: 2 },
    { accessorKey: 'modified', header: 'Last Modified', grow: 2 },
    { id: 'actions', header: '', kind: 'action', enableSorting: false }
  ]

  const sorting = ref([])
  const rowSelection = ref({})

  const rowActionGroups = [
    [
      { value: 'view', label: 'View details', icon: 'pi pi-eye' },
      { value: 'edit', label: 'Edit', icon: 'pi pi-pencil' },
      { value: 'duplicate', label: 'Duplicate', icon: 'pi pi-copy' }
    ],
    [{ value: 'delete', label: 'Delete', icon: 'pi pi-trash' }]
  ]

  const statusSeverity = (status) =>
    status === 'Active' ? 'success' : status === 'Degraded' ? 'warning' : 'danger'

  const onRowClick = (_row) => {}
  const onRowAction = (_payload) => {}
</script>

<template>
  <TableRoot
    :data="rows"
    :columns="columns"
    row-key="id"
    enable-sorting
    enable-row-selection
    paginated
    :page-size="5"
    v-model:row-selection="rowSelection"
    v-model:sorting="sorting"
    @row-click="onRowClick"
  >
    <template #cell-name="{ row, value }">
      <a
        :href="'/workloads/' + row.id"
        class="cursor-pointer truncate text-(--text-default) no-underline hover:underline active:underline"
        >{{ value }}</a
      >
    </template>
    <template #cell-status="{ value }">
      <Tag :severity="statusSeverity(value)">{{ value }}</Tag>
    </template>
    <template #header-actions>
      <span class="sr-only">Actions</span>
    </template>
    <template #cell-actions="{ row }">
      <DropdownMenuRoot @select="({ value }) => onRowAction({ id: row.id, action: { value } })">
        <DropdownMenuTrigger>
          <IconButton
            icon="pi pi-ellipsis-v"
            aria-label="Row actions"
            kind="transparent"
            size="small"
          />
        </DropdownMenuTrigger>
        <DropdownMenuGroup
          v-for="(group, gi) in rowActionGroups"
          :key="gi"
        >
          <DropdownMenuOption
            v-for="option in group"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          >
            <template #left
              ><i
                :class="option.icon"
                aria-hidden="true"
            /></template>
          </DropdownMenuOption>
        </DropdownMenuGroup>
      </DropdownMenuRoot>
    </template>
  </TableRoot>
</template>
```
