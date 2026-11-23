# Data Table

> The data-driven table: pass `data` + `columns` and it renders the header, rows, selection, sorting, empty / loading / error states itself, through the same `Table` parts (`Table.Header`, `Table.Row`, `Table.HeadCell`, `Table.Cell`), so its markup, tokens and accessibility are those of [`table`](table.md). The headless **`@tanstack/vue-table`** engine lives here and only here: a hand-composed `Table` never loads it. A top **toolbar band** (`title` / `toolbar` / `filters` slots) sits above the scroll viewport for a title, the context-aware `Table.*` toolbar parts (search, filter, export, refresh, live) and removable filter chips; the `toolbar` and `filters` slots are scoped with the TanStack `table` instance so the consumer can drive filtering, global search and column visibility through the table's own methods. Optional features are **companion parts** that read the table's context (`compound-api.md`, CODE_QUALITY 3.4): `DataTablePagination` in the `footer` slot pages the rows with [`Pagination`](pagination.md), `DataTableLoadMore` in the `load-more` slot asks for the next rows, and the toolbar parts own the search text, the structured filters, the live tail and the export rows. A root-only table loads none of them. **Engine.** DataTable is driven by **`@tanstack/vue-table`** (`useVueTable` + `getCoreRowModel` / `getSortedRowModel` / `getFilteredRowModel` / `getPaginationRowModel`), covering sorting, pagination, row selection, column visibility, and global filtering — client- and server-side (`manualSorting` / `manualFiltering` on the root, `manual` on `DataTablePagination`). It is a pure-logic library (no markup/styles/positioning/animation), granted narrowly to the table family (this component and the editable `data-grid` that builds on it) per [`.claude/rules/dependencies.md`](https://github.com/aziontech/webkit/blob/main/.claude/rules/dependencies.md) § Exceptions; rendering stays 100% in our primitives. State is exposed via v-model in webkit shapes: `sorting`, `selectedKeys`, `columnVisibility` and `openKeys` on the root, `page` + `pageSize` on `DataTablePagination`, the search text on `TableSearch`, the structured filters on `TableFilter` and the live tail on `TableLiveButton`; the component adapts them to the engine internally, and `getSnapshot()` / `setSnapshot()` read and write all of them at once. `@tanstack/virtual` remains forbidden: the opt-in `virtual` mode windows the rows itself (spacer padding above and below the rendered slice, sized from a height index: each rendered row is measured with a `ResizeObserver`, rows not yet rendered take the average of the first rows measured (48 px before the first row is measured), and when a row above the rows in view changes height the scroll position moves by the same amount so the rows in view stay still). Without `virtual`, a list of more than 200 rows renders its first 50 rows and mounts the rest as a spacer below them nears the viewport (an `IntersectionObserver`), so a long page costs what is on screen. **Toolbar & imperative API.** The toolbar band composes context-aware controls that drive the table through the injected context with no wiring: `TableFilter` (the slot that hosts `FilterMenu` with `type="menu"`, or `PropertyFilter` with `type="property"`, over its `fields`), `FilterMenu.ChipGroup` with no `fields` in the `filters` slot (the applied fields of the menu type, labelled by the fields the mounted `TableFilter` registers), `CollectionPreferences` with no `columns` (visible columns and their order, written back on Confirm), `TableSearch` (the global text filter, `v-model`), `TableExportButton` (CSV download, `rows` for every match), `TableRefreshButton` and `TableLiveButton` (the live tail, `v-model`). Structured filters are a first-class model (`TableFilter` `v-model`, a `TableAppliedFilter[]` distinct from the free-text search) mapped to the TanStack column filters client-side, or emitted for a server refetch under `manualFiltering`. A `loading` prop renders skeleton rows for dynamic (server-side) data. The root exposes a **curated imperative API** via `defineExpose` (`reload`, `clearFilters`, `exportCsv`, `getSnapshot`, `setSnapshot`) so controls or logic outside the table can drive it through a template ref, and a serializable `TableStateSnapshot` (`sorting` / `page` / `pageSize` / `columnVisibility` / `columnOrder` / `globalFilter` / `filters`) is read with `getSnapshot()` and written back with `setSnapshot()` — the component stays router-agnostic, so the consuming app owns any URL / localStorage persistence. CSV serialization lives in a pure util at [`@aziontech/webkit/utils/csv`](https://github.com/aziontech/webkit/blob/main/packages/webkit/src/utils/csv.ts) (`toCsv` + `downloadCsv`). **Types** (declared in `injection-key.ts`, re-exported for consumers): `TableFilterOperator` = `'eq' | 'neq' | 'contains' | 'not-contains' | 'starts-with' | 'ends-with' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not-in' | 'is-empty' | 'is-not-empty' | 'within' | 'between'` (`within` holds a period id — `24h`, `7d`, `30d`, `3m` — and matches dates inside that window ending now; `between` holds `[start, end]` epoch milliseconds, either one `''` for an open bound; both read the cell as a `Date`, a timestamp or a parseable date string); `TableFilterType` = `'menu' | 'property'`; `TableFilterField` = `{ id: string; label: string; type: 'text' | 'number' | 'select' | 'multi-select' | 'boolean' | 'date'; operators?: TableFilterOperator[]; options?: { label: string; value: string | number | boolean }[] }`; `TableAppliedFilter` = `{ field: string; operator: TableFilterOperator; value: string | number | boolean | Array<string | number>; label?: string }`; `TableStateSnapshot` = `{ sorting?: SortingState; page?: number; pageSize?: number; columnVisibility?: VisibilityState; columnOrder?: string[]; globalFilter?: string; filters?: TableAppliedFilter[] }` (every field optional so `setSnapshot` accepts a partial; JSON-serializable). **Collections.** `useCollection` (`@aziontech/webkit/use-collection`) drives DataTable in both client and server modes: `tableProps` binds `data` (one page), `columns` (ordered by the saved preferences), `rowKey`, `loading`, `sorting`, `manualSorting` / `manualFiltering`, `selectable`, `selectedKeys`, `columnVisibility` and the three display preferences (`density`, `wrapLines`, `striped`) together with their update handlers, in one `v-bind`; `paginationProps` binds `DataTablePagination` (`v-bind="paginationProps" manual`: `page`, `total`, `pageSize`, `pageSizeOptions` and their handlers). The table keeps rendering one page; the composable owns filtering, sorting, paging and selection across pages, so `exportItems` given to `TableExportButton` `rows` hands the export every match rather than the page: in client mode the matching items (or every item for the `all` scope), in server mode what the collection's `exportAll` callback loads (the loaded page when there is none). **Cell presets and reordering.** The six `TableCell*` presets (each its own import, `@aziontech/webkit/table-cell-<name>`) render the cells every list repeats, each inside a `#cell-<id>` slot: `TableCellLink` (a name that leaves the screen: an optional muted leading glyph (`icon`) for the provider or resource type, a 12 px external mark, a tooltip naming the destination, underline on hover, no mark without a destination; optional `+N` overflow through `OverflowCount` and a copy button pinned to the end edge), `TableCellId` (an identifier with its copy button), `TableCellStatus` (one semantic `Tag`), `TableCellTags` (as many tags as fit, the rest behind `+N`), `TableCellTime` (avatar of the author plus a relative time that updates every minute, or counts from the nearest `ConfigProvider`'s `now`, the absolute time on the tooltip and for screen readers) and `TableCellActions` (the row menu named after the row). `reorderable` adds a leading grip column: drag a grip with the pointer, or focus it and press Arrow Up, Arrow Down, Home or End; the table emits `update:data` with the reordered records and `reorder` with `{ from, to, row }`, announces every move in a polite status region and locks while a sort is applied; `rowReorderable` keeps chosen rows (a pinned default) in place.

- Import: `import DataTable from '@aziontech/webkit/data-table'`
- Category: data · Surface: app · Structure: monolithic
- API as JSON: [data-table.json](data-table.json)

## When to use

- Use DataTable for records that share columns — any console list of resources people scan, sort and act on.
- Records with the same fields shown in rows and columns, where the reader compares, sorts, selects or acts on rows (resource lists, logs, usage breakdowns): use DataTable for read-and-act lists of repeated records.
- A list needs a toolbar for search, structured filters, column visibility, CSV export or refresh — the `Table.*` toolbar parts drive the DataTable through context.
- Server-backed data that pages, sorts or filters on the API: `manual-sorting`, `manual-filtering` and a `manual` `DataTablePagination` emit the state instead of slicing locally.
- Thousands of rows (`virtual`), tree rows (`get-sub-rows`), reorderable rows, infinite loading or a live tail.

## Do

- For repeated data, pass `data` + `columns` and customize cells with the `cell-<columnId>` / `header-<columnId>` slots instead of composing N rows by hand. Compose `Table` by hand only for small, static tables.
- Give rows a stable id under `row-key` (default `'id'`); selection and `v-model:selected-keys` are keyed by it.
- Mark the row-actions column `type: 'action'` so it pins to the trailing edge; give chip or short-token columns a `minWidth` rather than a fixed `width`.
- Give `TableCellTime` dates from your data. Where the text must not depend on when it renders (an example, a test, a server render the browser hydrates), set `now` on the app's `ConfigProvider` and count sample dates back from that constant; never build them from `Date.now()` / `new Date()` in setup.
- Drive loading through the `loading` prop (skeleton rows, `aria-busy`) and keep the `empty` slot for no-data copy — do not swap the table for a spinner.
- On a phone a console list keeps its grid and scrolls sideways (the default). Set `stackable` only for a short list read one record at a time on a narrow, phone-first surface (a marketing listing, a summary in a side panel), where a card per row reads better than a scroll; never on a resource index, a log or a list compared across columns.
- Type the rows, not the slot: pass a typed `data` (`ref<Domain[]>([])`, or a literal array) and destructure `#cell-name="{ row, value }"` — `row` is a `Domain` and `value` is `Domain['name']`. Keep a column's `id` equal to its `accessorKey` (or leave `id` out) so the typed `value` is the field the cell shows. Do not annotate the slot scope by hand or cast `row as Domain`; a wrong field (`row.nmae`) should be a type error.
- Place `TableSearch`, `TableFilter`, `CollectionPreferences`, `TableExportButton` and `TableRefreshButton` in the `toolbar` slot with no `v-model` wiring — they read the table from context. Import each from its own entry (`@aziontech/webkit/table-search`); they are not attached to the `table` compound.

## Don’t

- A small, static table or one whose cells need a layout the column model cannot express → compose it by hand with `table` (no engine in the bundle).
- People edit many cells of many records in place, spreadsheet-style → use `data-grid`.
- A short list of same-field rows added and removed inside a form (environment variables, headers) → use `attribute-editor`.
- A short titled preview of a longer listing on a marketing page → use `listing-table-section`.
- A feature-by-feature comparison of Azion with a competitor → use `competitor-comparison-section`.
- Rows of mixed content (media, title, description, actions) that do not share columns → use `item`.
- The same records as a grid of cards → use `card-list` (same collection, card layout).
- In a docs Markdown page or the site's page JSON. DataTable is app-only (decision RV-C2-1, rule `webkit-content-channels`): it drives app state (sorting, selection, paging, filters) through its engine, so it has no `DocMarkdown` tag and no page JSON entry. A docs page writes a Markdown pipe table; the site uses `listing-table-section`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [table](table.md) — the parts DataTable renders through, and the hand-composed table for small static content; its toolbar parts and cell presets go in DataTable's slots.
- [data-grid](data-grid.md) — the editable, spreadsheet-like grid; use it when cells are edited in place.
- [pagination](pagination.md) — the page strip; `DataTablePagination` in the `footer` slot renders and wires it.
- [listing-table-section](listing-table-section.md) — marketing section that composes `table` for a linked preview of a list.
- [empty-state](empty-state.md) — the pattern behind the table's default `empty` slot; override the slot for resource-specific copy and actions.
- [item](item.md) — list rows without a column structure.
- [filter-menu](filter-menu.md) — Use FilterMenu when people filter by picking known values per field (status, region, owner) and see them as chips — the default console list filter; `TableFilter` hosts it by default.
- [property-filter](property-filter.md) — Use PropertyFilter when people type queries with operators (Status = Active, Requests > 100) or free text they want to keep; `TableFilter type="property"` hosts it wired to the table (AND only).
- [collection-preferences](collection-preferences.md) — Use CollectionPreferences for every 'how this list looks' setting: page size, visible and ordered columns, density, wrap; with no `columns` inside the toolbar it edits this table's columns.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `maxHeight` | `string` | `''` | false | Max height (CSS length). The viewport scrolls dynamically: horizontal scroll appears automatically when columns overflow the width; vertical scroll appears only when `maxHeight` is set smaller than the content (under the sticky header). |
| `bordered` | `boolean` | `false` | false | Draw the outer card border around the table. Off by default (the table is typically framed by a surrounding surface); set `bordered` / `:bordered="…"` to draw the `var(--border-default)` outline. The internal row dividers are unaffected. |
| `columns` | `TableColumn[]` | `[]` | false | column definitions (`{ id?, accessorKey?, header?, label?, sortable?, grow?, principal?, frozen?, width?, minWidth?, align?, type?, resizable?, hideable?, orderable? }`; `width` (px) sets a fixed pixel column (also needed when a frozen column precedes another frozen column on the same edge, so sticky offsets can be summed); **`minWidth`** (px) sets a **floor** instead: the table measures the column's own content — its header, including the sort affordance, and every rendered body cell — and pins the column to the larger of the two, as **one** width applied to the header and every body cell (a per-cell `min-width` would let each row size to its own content and drift the header away from the body). It is for a column whose content is a chip or a short token: a fixed `width` there is a bet in both directions — too generous and it reserves space the rest of the row needs, too tight and the chip inside it truncates. The measured width tracks the **rendered page**, so a column can change width when paging or sorting brings longer content into view; `width` wins when both are set, and a user resize wins over both. a `grow` column without `width` keeps a shared fixed basis so the header and body stay aligned and the cell never wraps. A column with no `grow` defaults to weight `2` for the **principal** column and `1` for the rest, so the columns fill the available space proportionally. The principal column is the one flagged `principal: true`, or — when none is flagged — the first non-action column. A `type: 'action'` column is automatically pinned to the trailing (right) edge — staying reachable while the rest scrolls horizontally — and is never resizable. **`resizable: true`** opts a column into a live mouse/touch drag-to-resize handle on its header (native pointer events; the `@tanstack/vue-table` exception covers sorting/pagination/selection/visibility, not sizing). On the first drag of any divider every flexible column freezes at its current rendered width; from then on dragging changes **only that column** and the table grows (horizontal scroll) — the others are untouched. The drag floor is the column's own content width (header label + visible body cells), so a column never shrinks past its content. Frozen and action columns ignore `resizable`. **`label`** names the column in `CollectionPreferences` when `header` is not a string; **`hideable: false`** lists the column locked in `CollectionPreferences`; **`orderable: true`** opts the column into `columnOrder`. |
| `rowKey` | `string` | `'id'` | false | Field used as the stable row id (for selection). |
| `sortable` | `boolean` | `false` | false | Sorts every column on header click; a column's own `sortable` overrides. |
| `selectable` | `boolean` | `false` | false | Adds a leading selection-checkbox column. |
| `rowSelectable` | `(row: TRow) => boolean` | `undefined` | false | decides per row whether it can be selected (`(row) => row.type === 'file'`). A row it rejects draws no checkbox, ignores row clicks and stays out of Select all. |
| `selectOnRowClick` | `boolean` | `false` | false | clicking a row toggles its selection (requires `selectable`); interactive cells still own their own click. |
| `manualSorting` | `boolean` | `false` | false | Server-side sorting: emit events, do not sort locally. |
| `manualFiltering` | `boolean` | `false` | false | Server-side filtering: emit events, do not filter locally. |
| `loading` | `boolean` | `false` | false | render skeleton rows in the body (aligned to the visible columns) and set `aria-busy`; `TableRefreshButton` disables/spins while true. Precedence: `loading` → skeleton, else rows, else `empty`. |
| `error` | `string` | `''` | false | message of a failed load, shown in place of the rows in an `alert` region (an `EmptyState` with the error mark and `table.errorTitle`, the message as its description); the `error` slot replaces it. `loading` wins over it. Empty shows the rows. |
| `stackable` | `boolean` | `false` | false | opt in to stacked rows. When the table's own box is narrower than `--container-lg`, each row renders as a card of label and value pairs instead of the horizontally scrolling grid. Off by default: a console list scrolls sideways on a phone. |
| `wrapLines` | `boolean` | `false` | false | cell text wraps onto several lines instead of truncating. |
| `striped` | `boolean` | `false` | false | every other body row takes the raised surface. |
| `density` | `'comfortable' \| 'compact'` | `'comfortable'` | false | Density of the header and the body rows: `compact` shrinks their height and padding (the header through `Table.Header`'s `density`). A saved `CollectionPreferences` density therefore covers the whole table. |
| `virtual` | `boolean` | `false` | false | render only the rows in view, for thousands of rows. The viewport scrolls vertically within `maxHeight` (40rem when empty). Ignored in the stacked layout. |
| `reorderable` | `boolean` | `false` | false | a leading grip column lets people drag rows, or move the focused grip's row with Arrow Up, Arrow Down, Home and End, into a new order. Emits `update:data` (bind `v-model:data`) and `reorder`; locked while a sort is applied. |
| `rowReorderable` | `(row: TRow) => boolean` | `undefined` | false | With `reorderable`: decides per row whether it can move (`(row) => !row.locked`). A rejected row keeps its place: its grip is disabled, and no row is dropped onto it or moved past it with the keys. |
| `getSubRows` | `(row: TRow) => TRow[] \| undefined` | `undefined` | false | tree rows. Returns a row's children (`(row) => row.children`); a row with children gets an expand toggle in the principal column, its children render under it indented one step (`--spacing-md`) per level, and the grid element takes `role="treegrid"`. Sorting and filtering keep each child under its parent; selection is per row (selecting a parent does not select its children). `reorderable` is ignored in tree mode. |
| `data` | `TRow[]` | `() => []` | false | Two-way value (`v-model:data`). |
| `sorting` | `SortingState` | `undefined` | false | Two-way value (`v-model:sorting`). |
| `selectedKeys` | `string[]` | `undefined` | false | Two-way value (`v-model:selectedKeys`). |
| `columnVisibility` | `VisibilityState` | `undefined` | false | Two-way value (`v-model:columnVisibility`). |
| `openKeys` | `string[]` | `undefined` | false | Two-way value (`v-model:openKeys`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `row-click` | `(event: MouseEvent \| KeyboardEvent, row: TRow)` | Fires when a rendered row is clicked, or when `Enter` is pressed on a focused row (keyboard rows, below). `event` is the click or the key press; `row` is the record. |
| `row-remove` | `(event: KeyboardEvent, row: TRow)` | `Delete` (or `Backspace`, which a Mac keyboard's delete key sends) was pressed on a focused row. The table removes nothing: the app asks first (a `ConfirmDialog`) and then drops the record from `data`. |
| `filter-apply` | `(event: Event, filters: TableAppliedFilter[])` | `TableFilter` committed a pick or a token — the explicit re-query signal for `manualFiltering`. |
| `filter-remove` | `(event: Event, filter: TableAppliedFilter)` | One applied filter was removed (a `FilterMenu.ChipGroup` chip). |
| `refresh` | `(event: Event)` | Refresh requested; the app refetches. `event` is the click of `TableRefreshButton`, or `new Event('refresh')` when `reload()` is called. |
| `export` | `(event: Event, rows: TRow[])` | Export requested with the resolved rows; `event` is the click of `TableExportButton`, or `new Event('export')` when `exportCsv()` is called; a consumer may handle it server-side (otherwise the built-in CSV util downloads). |
| `reorder` | `(event: KeyboardEvent \| PointerEvent, payload: { from: number; to: number; row: TRow })` | `reorderable`: a row moved from index `from` to index `to` of `data`. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `caption` | — | caption content (wrapped in TableCaption), fixed above the scroll viewport. |
| `title` | — | Title text shown at the start of the toolbar band, fixed above the scroll viewport. |
| `toolbar` | { table, selectedRows, selectedCount, clearSelection, loading } | Action band (search, filter, refresh, export, column preferences) above the scroll viewport, end-aligned beside the title. `table` is the TanStack instance; `selectedRows` / `selectedCount` / `clearSelection` expose the selection for bulk-action toolbars, and `loading` mirrors the prop. |
| `filters` | { table, selectedRows, selectedCount, clearSelection, loading } | Active-filter chips row below the toolbar; same scope as `toolbar`. |
| `empty` | — | shown when there are no rows. Defaults to an empty-state block (illustration + title + description) following Figma; override the slot for custom copy/actions. |
| `error` | { message: string } | shown in place of the rows while `error` is set; `message` is the `error` prop. Defaults to a small `EmptyState` with the error mark, `table.errorTitle` and the message. |
| `load-more` | — | content after the last row that scrolls with the rows, inside the viewport: `DataTableLoadMore`. |
| `footer` | — | band below the scroll viewport, outside `role="table"`: `DataTablePagination`. |

## Sub-component imports

- `@aziontech/webkit/data-table-pagination`
- `@aziontech/webkit/data-table-load-more`

## Sub-components

- `data-table-pagination/data-table-pagination.vue` — **companion part** (`@aziontech/webkit/data-table-pagination`), placed in the `footer` slot. Pages the rows and renders `Pagination` in a `TableFooter` band under the viewport; while it is mounted the table renders one page, without it every row. Props `pageSizeOptions?: number[]` (default `[10, 25, 50, 100]`, the same name as `Pagination`), `total?: number` (default `undefined`; the rows across every page of a `manual` table, else the table counts its own rows) and `manual?: boolean` (default `false`; the app pages the rows itself, as a server does: the table renders `data` as one page and only reports the page). Models `v-model:page` (`number`, 1-based, default `1`, emits `update:page`) and `v-model:page-size` (`number`, default `10`, emits `update:pageSize`; a new size returns to the first page). The page and size it names apply from the first render, the server render included. Loading: with no rows yet it shows one `Skeleton` line (`__loading`) in place of the `Pagination`; with a known total it keeps the page controls and shows the `Skeleton` in place of the `Showing … of …` text. `useCollection().paginationProps` binds it (`v-bind="paginationProps" manual`). Test id `data-table-pagination`.
- `data-table-load-more/data-table-load-more.vue` — **companion part** (`@aziontech/webkit/data-table-load-more`), placed in the `load-more` slot. Infinite loading: props `moreRows?: boolean` (default `false`; more rows exist after the last one) and `loading?: boolean` (default `false`; the next rows are loading). Emits `load-more: [event: Event]` as the end of the rows nears the viewport (`new Event('load-more')`, also in `virtual` mode) or when its Load more button is pressed (the click); the app appends the next rows and sets `loading` meanwhile, and no request repeats while `loading` is true. An `aria-hidden` sentinel (`__sentinel`) is observed with an `IntersectionObserver` 600 px ahead of the scroll container and re-arms when the row count changes; a `role="status"` line shows a Load more button (`__load`) while `moreRows`, a spinner with `Loading more rows` (`__loading`) while `loading` (the table sets `aria-busy`), and `No more rows` (`__end`) once more rows were requested and `moreRows` turns false. Hidden while the table is `loading` or has no rows, and while the first rows of a long list are still mounting. Test id `data-table-load-more`.

## v-model

| Model                       | Type              | Default     | Emits                     | Notes                                                                                                                                                                              |
| --------------------------- | ----------------- | ----------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:data`              | `TRow[]`          | `[]`        | `update:data`             | Row records (`defineModel`, default `[]`). One-way `:data` is the common case; `reorderable` writes the records in their new order back, so bind `v-model:data` to keep the order. |
| `v-model:sorting`           | `SortingState`    | `undefined` | `update:sorting`          | TanStack `SortingState` (`defineModel`). Uncontrolled it starts unsorted; `setSnapshot()` writes it too.                                                                           |
| `v-model:selected-keys`     | `string[]`        | `undefined` | `update:selectedKeys`     | Keys of the selected rows, read from `rowKey` (`defineModel`), the same shape as DataGrid, Tree and CardList.                                                                      |
| `v-model:column-visibility` | `VisibilityState` | `undefined` | `update:columnVisibility` | TanStack `VisibilityState` (`defineModel`).                                                                                                                                        |
| `v-model:open-keys`         | `string[]`        | `undefined` | `update:openKeys`         | Tree rows: keys of the open rows (`defineModel`), the same shape as Tree and SidebarMenu. Uncontrolled it starts collapsed; written after a toggle by pointer or keyboard.         |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `selected`
- Data states: `loading` (skeleton rows, `aria-busy`; `DataTablePagination` states no count it does not know, see Sub-components), `error` (the `error` prop set: rows replaced by the `error` slot in an `alert` region, `__error`), `empty` (no rows: the `empty` slot, `__empty`). Precedence: loading, then error, then empty.
- The viewport is always a scroll container (`overflow: auto`): horizontal scroll is automatic when columns overflow; vertical scroll engages only when `maxHeight` constrains the content.
- `data-frozen` on TableHeader (`true`), TableHeadCell / TableCell (`start` | `end`), and TableRow (`true`). A frozen head/body cell renders a CSS-only fade (gradient pseudo-element) just outside its inner edge that dissolves the horizontally scrolling content into the row background (`from-transparent` → `var(--table-row-bg)`, the row-published color, so it matches the row on hover/selected) — `frozen=start` fades on the right, `frozen=end` on the left. The fade tints nothing; it only masks the content sliding under the pinned column.
- Scroll cue: the scroll viewport sits in a `__scroll` frame that sets `data-overflow-start` / `data-overflow-end` from the scroll position (re-measured on scroll and on resize). While content is hidden past an inline edge, an `aria-hidden` gradient as wide as the hidden distance (at most 24 px, none when 4 px or less, so it never sits over text that is otherwise in view) (`__fade-start` / `__fade-end`, `from-transparent` to `var(--bg-surface)`, pointer events off) covers that edge of the viewport, so a phone shows that columns continue; it follows the inline direction under `dir="rtl"`, has no motion, and keeps its gradient under forced colors (fading to `Canvas`). A frozen column on that edge draws its own fade and paints over the cue, which sits below frozen cells and the sticky header (`z-5`).
- `data-state` on TableRow: `selected` | `unselected`; `data-selected` mirrors the `selected` prop; `aria-selected` set when selected.
- `data-type` on TableHeadCell (`default` | `checkbox` | `action` | `slot`) and TableCell (`default` | `checkbox` | `action`).
- `data-align` on head/body cells: `start` | `center` | `end`.
- `data-grow` on head/body cells: `1` | `2` | `3` (flex weight).
- `data-sortable` and `data-sort` (`none` | `ascending` | `descending`) on TableHeadCell; `aria-sort` mirrors `data-sort`.
- `data-sort` (`none` | `ascending` | `descending`) on TableSortButton.
- `data-clickable` on TableCell mirrors the `clickable` prop.
- Stacked rows (opt-in `stackable`): by default the grid scrolls sideways at every width, as the console does on a phone. With `stackable`, the table measures its own box; below `--container-lg` (552 px) it sets `data-stacked` and each body row becomes a bordered card. The checkbox, the principal column and the action column share the first line; every other column takes its own line as a label (the column `label` or `header`, `aria-hidden`) and its value. The header row stays in the DOM visually hidden, so screen readers keep the column headers; frozen offsets and fades are dropped. A hand-composed table never stacks.
- Stacked select-all (`selectable`): in the stacked layout the header checkbox is not rendered; a visible, labelled **Select all rows** checkbox sits above the stacked rows (`__stacked-select-all`) and toggles the page, with the same indeterminate state.
- Per-row selectability (`rowSelectable`): a row the function rejects renders an empty selection cell, ignores `selectOnRowClick` and is skipped by Select all; the header checkbox reads `all` when every selectable row is selected.
- Density and wrapping: `data-density="compact"` on the root shrinks the header (through `Table.Header`'s `density`) and the body cells (`min-h-9`, `--spacing-2xs` block padding); `data-wrap` lets cell text (and any `.truncate` inside a cell) wrap. `striped` shades odd body rows with `var(--bg-surface-raised)` (selected and hover still win).
- Virtual rows (`virtual`): only the rows in view plus 8 above and below render; the slice starts on an even row so stripes stay put; rows of different heights (`wrapLines` with long text) are measured as they render and the rows in view do not shift while scrolling; the root sets `aria-rowcount` and each row `aria-rowindex`. Skeleton and stacked layouts render every row.
- Long lists (more than 200 rows, not `virtual`): the first 50 rows render, a spacer (`__lazy-rows`, `aria-hidden`) stands in for the rest and more rows mount as it nears the viewport, until every row is in the DOM; while rows are still missing the root sets `aria-rowcount` and each row `aria-rowindex`. When `data`, the sort or a filter changes, the mounted rows drop back to the ones within reach of the viewport (at least 50), so a sort after scrolling to the end and back does not patch every row.
- Infinite loading: `DataTableLoadMore` in the `load-more` slot (see Sub-components).
- Live tail (`TableLiveButton` `v-model`): turning it on scrolls the viewport to the top and remembers the first row; once newer rows arrive above it, that row carries `data-live-boundary` and draws a 2 px success-coloured line on its top edge. While live and scrolled to the top, new rows keep the viewport at the newest row; scrolled down, the rows in view stay still. Turning it off clears the boundary.
- Responsive toolbar: the root is the `@container/table`; the toolbar wraps, and below `@md` of the table the `toolbar` slot moves under the title and starts at the start edge. `Table.Toolbar` wraps its controls.
- Hover-free devices: a sortable header shows its sort affordance where the pointer cannot hover (`@media (hover: none)`).
- Reorderable rows (`reorderable`): a 40 px leading column holds a grip `IconButton` per row (`data-reorder-handle`), frozen at the start edge when other columns are; the row being dragged sets `data-dragging` (dashed accent outline, 60% opacity) and the row under the pointer `data-drop="before" | "after"` (a 2 px accent line on that edge). While a sort is applied every grip is disabled and its description says to clear the sort.
- Tree rows (`getSubRows`): the grid element is `role="treegrid"` and sets `data-tree`. Each body row carries `aria-level` (1-based depth), `aria-setsize` and `aria-posinset` among its siblings, `aria-expanded` when it has children, and `data-depth`; the principal cell starts with one `aria-hidden` gutter (`data-tree-gutter`) `calc(var(--spacing-md) * depth + var(--size-7))` wide, which holds the 28 px chevron toggle (`__expand-toggle`, `az-chevron-right` mirrored in RTL, `az-chevron-down` when open) at its end on rows with children, so the content of every row at one depth starts on one column and each level shifts it by exactly one step. Rows use a roving tab stop (one row has `tabindex="0"`, the rest `-1`) and draw an inset `var(--ring-color)` outline on `focus-visible`.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the sort button and any interactive cell content.
- Keyboard map: `Tab` focuses the sort button of each sortable column (one tab stop per column, as in the APG sortable table: the header cell itself is not focusable and carries `aria-sort`) and interactive cell content; `Enter`/`Space` on the sort button toggles the sort; row click is mouse/touch (no keyboard trap). The principal column still carries a real link or button (`TableCellLink`, or the `cell-<id>` slot with an anchor, as the Default example does), which keyboard and screen-reader users reach with `Tab` (WCAG 2.1.1).
- Keyboard rows (the console keyboard standard, `rules/webkit-keyboard.md`): when the table has a `row-click` or a `row-remove` listener (or tree rows), body rows become one roving tab stop (one row `tabindex="0"`, the rest `-1`, the last focused row kept as the stop) with the same inset ring as tree rows. `Arrow Down` / `Arrow Up` move between rows, `Home` / `End` go to the first / last row, `Enter` emits `row-click` with the key press, `Space` toggles the row's selection when `selectable` allows it, and `Delete` / `Backspace` emits `row-remove` (never with `⌘`, `Ctrl`, `Alt` or `Shift` held). Keys pressed on a control inside the row (a checkbox, the row menu) belong to that control. When the row that held focus leaves `data` and focus fell to the page (the delete was confirmed in a dialog that closed, or the row itself was focused), focus moves to the row now at its index, else the previous row, else the table element (`tabindex="-1"`, ring on `focus-visible`); it waits while a modal layer is open, and leaves focus alone when the person moved it elsewhere. Without those listeners body rows are not focusable. Tests: `data-table.test.ts` › keyboard rows.
- ARIA: `role="table"` sits on the grid element inside the scroll viewport (testid `<testid>__table`), not on the root: the root also holds the toolbar, applied filters, the focusable scroll viewport, the stacked select-all, the empty state and the pagination, and any of those inside a `table` is an unallowed child (`aria-required-children`). Every `aria-*` attribute passed to `DataTable` (`aria-label`, `aria-labelledby`, `aria-describedby`…) is forwarded to that element, as are `aria-busy` (loading) and `aria-rowcount` (windowed); every other attribute stays on the root. The pagination is a plain region under the viewport (`DataTablePagination`, a `TableFooter`), not a `rowgroup`, and the `caption` slot renders as the table's first child. `table-caption` is a plain element (no `role`) that names the table through `aria-labelledby` unless the consumer names it with `aria-label`/`aria-labelledby`. `table-header`/`table-body` `role="rowgroup"`; `table-footer` has no role (it hosts pagination or an action, not rows); `table-row` `role="row"`; `table-head-cell` `role="columnheader"` with `aria-sort` when sortable; `table-cell` `role="cell"`; selected rows set `aria-selected`.
- Virtual rows keep their position for assistive technology: `aria-rowcount` on the `role="table"` element (rows + header) and `aria-rowindex` on each rendered row.
- Reorderable rows: each grip is a button named `Reorder <row name>, position <n> of <total>` and described by a visually hidden hint (`Drag, or press Arrow Up or Arrow Down to move.`, or the lock reason). Arrow Up / Arrow Down / Home / End move the row and keep focus on its grip; `Esc` cancels a drag. A polite `role="status"` region announces `Moved <name> to position <n> of <total>.` (keyboard) or `Dropped …` (pointer). Dragging is never the only way to reorder (WCAG 2.5.7).
- Tree rows follow the APG treegrid row-focus pattern: `Tab` enters the grid on one row (the last one focused, else the first); `Arrow Down` / `Arrow Up` move between visible rows; `Home` / `End` go to the first / last row; `Arrow Right` (inline end, mirrored in RTL) opens a closed row or moves to the first child of an open one; `Arrow Left` closes an open row or moves to the parent; `Enter` toggles the row; `Space` toggles its selection when `selectable` allows it. Interactive content inside the row (checkbox, menus) stays reachable with `Tab`. The pointer toggle is `aria-hidden` (the row's `aria-expanded` is the accessible state), and when a row collapses while one of its descendants holds focus, focus moves to that row.
- Stacked layout: the select-all is a visible checkbox with a `<label>`, not a screen-reader-only header cell (WCAG 2.5.3, label in name).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including muted header text.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px on the sort button and row action controls.

## Right-to-left

- Layout: logical utilities only (`start-` / `end-`, `ps-` / `pe-`, `text-start`); frozen columns pin to the inline start and end edges, so `frozen: 'start'` pins to the right under `dir="rtl"`, and the edge fades follow. Sticky offsets of stacked frozen columns are written as `inset-inline-start` / `inset-inline-end`, so two end columns keep their places in both directions; the viewport scroll cue sits on the inline edges too.
- Icons: the tree chevron mirrors (it points to the inline end when closed); the sort glyph and the reorder grip do not mirror.
- Keyboard: tree rows read `Arrow Right` / `Arrow Left` as inline end / inline start (`logicalArrowKey`), so `Arrow Left` opens a row under `rtl`; reorder keys are vertical and do not change.
- User data: cells render the app's content; `TableCellId` wraps identifiers in `dir="ltr"`.

## Internationalization

| Key                                                                                                                                    | English source                                                               | Override prop |
| -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------- |
| `table.selectAll`                                                                                                                      | `Select all rows`                                                            | —             |
| `table.selectRow`                                                                                                                      | `Select row`                                                                 | —             |
| `table.emptyTitle`                                                                                                                     | `No results yet`                                                             | `empty` slot  |
| `table.emptyDescription`                                                                                                               | `Get started by creating your first resource.`                               | `empty` slot  |
| `table.errorTitle`                                                                                                                     | `Could not load the data`                                                    | `error` slot  |
| `dataTable.reorderColumn` / `reorderHandle` / `reorderHint` / `reorderLocked` / `reorderMoved` / `reorderDropped` / `reorderCancelled` | `Order`, the grip name, the hint, the lock reason and the move announcements | —             |
| `dataTable.loadMore` / `dataTable.loadingMore` / `dataTable.noMoreRows`                                                                | `Load more` · `Loading more rows` · `No more rows`                           | —             |

- The strings come from the locale catalog through `useTranslate` (`table` and `dataTable` groups) with the locale of the nearest `ConfigProvider`; the footer `Pagination` and the toolbar parts carry their own keys.
- Formatting: none in the root; cell values render as the app formats them (`TableCellTime` formats dates with `Intl.DateTimeFormat` / `Intl.RelativeTimeFormat`).

## Responsive

- Container queries: the root is `@container/table`; below `@md` of the table the `toolbar` slot moves under the title. With `stackable`, below `--container-lg` of the table each row becomes a card.
- Narrow (≤ 640 px or a narrow container): the grid keeps its columns and scrolls sideways (a console list on a phone), with the scroll cue on the edge that hides columns; `stackable` opts a short list into cards.
- Touch: sort buttons, checkboxes, grips and row action buttons are at least 40 × 40 px; the sort affordance shows without hover under `@media (hover: none)`.
- Reflow: a data table is the WCAG 1.4.10 exception for two-dimensional content: the viewport scrolls horizontally inside the table, never the page.

## Examples

### Default

```vue
<script setup>
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
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
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'id', header: 'ID', sortable: false },
    { accessorKey: 'editor', header: 'Last Editor', sortable: false, grow: 2 },
    { accessorKey: 'modified', header: 'Last Modified', grow: 2 },
    { id: 'actions', header: '', type: 'action', sortable: false }
  ]

  const sorting = ref([])

  const rowActionGroups = [
    [
      { value: 'view', label: 'View details', icon: 'az az-eye' },
      { value: 'edit', label: 'Edit', icon: 'az az-pencil' },
      { value: 'duplicate', label: 'Duplicate', icon: 'az az-copy' }
    ],
    [{ value: 'delete', label: 'Delete', icon: 'az az-trash' }]
  ]

  const statusSeverity = (status) =>
    status === 'Active' ? 'success' : status === 'Degraded' ? 'warning' : 'danger'

  const onRowClick = (_row) => {}
  const onRowAction = (_payload) => {}
</script>

<template>
  <DataTable
    :data="rows"
    :columns="columns"
    row-key="id"
    sortable
    bordered
    v-model:sorting="sorting"
    @row-click="onRowClick"
  >
    <template #cell-name="{ row, value }">
      <TableCellLink
        :label="value"
        :to="`/workloads/${row.id}`"
        destination="Workloads"
      />
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
            icon="az az-ellipsis-vertical"
            :aria-label="`Actions for ${row.name}`"
            variant="ghost"
            size="small"
          />
        </DropdownMenuTrigger>
        <DropdownMenuGroup
          v-for="(group, gi) in rowActionGroups"
          :key="gi"
        >
          <DropdownMenuItem
            v-for="option in group"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          >
            <template #leading
              ><i
                :class="option.icon"
                aria-hidden="true"
            /></template>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuRoot>
    </template>
    <template #footer>
      <DataTablePagination :page-size="5" />
    </template>
  </DataTable>
</template>
```

### WithCheckboxes

```vue
<script setup>
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
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
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'id', header: 'ID', sortable: false },
    { accessorKey: 'editor', header: 'Last Editor', sortable: false, grow: 2 },
    { accessorKey: 'modified', header: 'Last Modified', grow: 2 },
    { id: 'actions', header: '', type: 'action', sortable: false }
  ]

  const sorting = ref([])
  const selectedKeys = ref([])

  const rowActionGroups = [
    [
      { value: 'view', label: 'View details', icon: 'az az-eye' },
      { value: 'edit', label: 'Edit', icon: 'az az-pencil' },
      { value: 'duplicate', label: 'Duplicate', icon: 'az az-copy' }
    ],
    [{ value: 'delete', label: 'Delete', icon: 'az az-trash' }]
  ]

  const statusSeverity = (status) =>
    status === 'Active' ? 'success' : status === 'Degraded' ? 'warning' : 'danger'

  const onRowClick = (_row) => {}
  const onRowAction = (_payload) => {}
</script>

<template>
  <DataTable
    :data="rows"
    :columns="columns"
    row-key="id"
    sortable
    selectable
    v-model:selected-keys="selectedKeys"
    v-model:sorting="sorting"
    @row-click="onRowClick"
  >
    <template #cell-name="{ row, value }">
      <TableCellLink
        :label="value"
        :to="`/workloads/${row.id}`"
        destination="Workloads"
      />
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
            icon="az az-ellipsis-vertical"
            :aria-label="`Actions for ${row.name}`"
            variant="ghost"
            size="small"
          />
        </DropdownMenuTrigger>
        <DropdownMenuGroup
          v-for="(group, gi) in rowActionGroups"
          :key="gi"
        >
          <DropdownMenuItem
            v-for="option in group"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          >
            <template #leading
              ><i
                :class="option.icon"
                aria-hidden="true"
            /></template>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuRoot>
    </template>
    <template #footer>
      <DataTablePagination :page-size="5" />
    </template>
  </DataTable>
</template>
```

### CompactHeader

```vue
<script setup>
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
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
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'id', header: 'ID', sortable: false },
    { accessorKey: 'editor', header: 'Last Editor', sortable: false, grow: 2 },
    { accessorKey: 'modified', header: 'Last Modified', grow: 2 },
    { id: 'actions', header: '', type: 'action', sortable: false }
  ]

  const sorting = ref([])

  const rowActionGroups = [
    [
      { value: 'view', label: 'View details', icon: 'az az-eye' },
      { value: 'edit', label: 'Edit', icon: 'az az-pencil' },
      { value: 'duplicate', label: 'Duplicate', icon: 'az az-copy' }
    ],
    [{ value: 'delete', label: 'Delete', icon: 'az az-trash' }]
  ]

  const statusSeverity = (status) =>
    status === 'Active' ? 'success' : status === 'Degraded' ? 'warning' : 'danger'

  const onRowClick = (_row) => {}
  const onRowAction = (_payload) => {}
</script>

<template>
  <DataTable
    :data="rows"
    :columns="columns"
    row-key="id"
    sortable
    density="compact"
    v-model:sorting="sorting"
    @row-click="onRowClick"
  >
    <template #cell-name="{ row, value }">
      <TableCellLink
        :label="value"
        :to="`/workloads/${row.id}`"
        destination="Workloads"
      />
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
            icon="az az-ellipsis-vertical"
            :aria-label="`Actions for ${row.name}`"
            variant="ghost"
            size="small"
          />
        </DropdownMenuTrigger>
        <DropdownMenuGroup
          v-for="(group, gi) in rowActionGroups"
          :key="gi"
        >
          <DropdownMenuItem
            v-for="option in group"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          >
            <template #leading
              ><i
                :class="option.icon"
                aria-hidden="true"
            /></template>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuRoot>
    </template>
  </DataTable>
</template>
```
