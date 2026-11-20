---
name: table
category: data
structure: composition
status: implemented
spec_version: 23
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2053-7649
  node_id: 2053:7649
checksum: f9b95dd9a88c7377f2db4d1135cf044a94272948cfcaa411a8e34f757348595c
created: 2026-06-16
last_updated: 2026-11-20
---

# Table — Component Spec

## Purpose

The table's parts and its markup-only root. Compose the anatomy by hand (`Table.Header` / `Table.Body` / `Table.Row` / `Table.HeadCell` / `Table.Cell`): the component owns markup, tokens, accessibility, column sizing (an emphasized principal column), sortable headers, selectable rows and a **freeze system** for sticky columns (an actions column) and a sticky header. The root is light: it frames the scroll viewport, the toolbar band (`title` / `toolbar` slots) and the `footer`, and loads no table engine. For repeated records pass `data` + `columns` to [`data-table`](./data-table.md) instead: DataTable renders through these same parts, and the context-aware toolbar parts (`TableSearch`, `TableFilter`, `TableExportButton`, `TableRefreshButton`, `TableLiveButton`) and the cell presets (`TableCellLink`, `TableCellId`, `TableCellStatus`, `TableCellTags`, `TableCellTime`, `TableCellActions`) go in its slots. Inside a hand-composed `Table` the toolbar parts have no rows to act on.

**What the compound carries.** `@aziontech/webkit/table` attaches only the structural parts (`Header`, `Body`, `Footer`, `Caption`, `Row`, `HeadCell`, `Cell`, `SortButton`, `Toolbar`), so a hand-composed table costs what its parts cost. The toolbar controls and the cell presets compose `Tooltip`, `DropdownMenu`, `Popover`, `Input` and `CopyButton`; each is imported from its own entry (`@aziontech/webkit/table-search`, `@aziontech/webkit/table-cell-status`, …) and is not attached to the compound, so a screen pays only for the ones it renders.

**Cell presets.** Six presets render the cells every list repeats, each inside a cell (or a DataTable `#cell-<id>` slot): `TableCellLink` (a name that leaves the screen: an optional muted leading glyph (`icon`) for the provider or resource type, a 12 px external mark on an address outside the app only (never on an in-app route), a tooltip naming the destination, underline on hover; optional `+N` overflow through `OverflowCount` and a copy button pinned to the end edge), `TableCellId` (an identifier with its copy button), `TableCellStatus` (one semantic `Tag`), `TableCellTags` (as many tags as fit, the rest behind `+N`), `TableCellTime` (avatar of the author plus a relative time that updates every minute, or counts from the nearest `ConfigProvider`'s `now`, the absolute time on the tooltip and for screen readers) and `TableCellActions` (the row menu named after the row).

**Types** (declared in `injection-key.ts`, re-exported by `./table`): the column and slot types DataTable takes (`TableColumn`, `TableCellSlotProps`, `TableHeaderSlotProps`, `TableToolbarSlotProps`, `TableStateSnapshot`, `TableExposed`, `TableAppliedFilter`, `TableFilterField`, `TableDensity`), so a page can type its columns from the compound it already imports. Their shapes are documented in [`data-table`](./data-table.md).

## When to use

- Use Table for records that share columns when you compose the rows by hand; for any console list of resources people scan, sort and act on, pass `data` + `columns` to DataTable, which renders through these parts.
- A small, static table, or one whose cells need a layout the column model cannot express: compose `Table.Header` / `Table.Row` / `Table.Cell` by hand. The root loads no engine.
- The parts of a DataTable: the toolbar controls and cell presets go in its slots, each imported from its own entry (`@aziontech/webkit/table-search`, `@aziontech/webkit/table-cell-status`).
- Use Table for read-and-act content; for repeated records pass `data` + `columns` to `data-table`, and when people edit cells in place use `data-grid`.

## When NOT to use

- Repeated records with sorting, selection, paging, filtering, virtual rows or tree rows → use `data-table` (`data` + `columns`).
- People edit many cells of many records in place, spreadsheet-style → use `data-grid`.
- A short list of same-field rows added and removed inside a form (environment variables, headers) → use `attribute-editor`.
- A short titled preview of a longer listing on a marketing page → use `listing-table-section`.
- A feature-by-feature comparison of Azion with a competitor → use `competitor-comparison-section`.
- Rows of mixed content (media, title, description, actions) that do not share columns → use `item`.
- A grid of selectable cards or options → use `radio-group` with `type="card"`.
- The same records as a grid of cards → use `card-list` (same collection, card layout).

## Related

- `data-table` — the data-driven table (`data` + `columns`, TanStack engine) that renders through these parts.
- `data-grid` — the editable, spreadsheet-like grid; a separate grid (`role="grid"`, one roving tab stop, in-cell editors) that shares these tokens, not built on these parts.
- `pagination` — the page strip; put it in a `Table.Footer` in the `footer` slot.
- `empty-state` — compose it in a full-width row when a hand-composed table has no rows.
- `item` — list rows without a column structure.
- `listing-table-section` — marketing section that composes a DataTable for a linked preview of a list.

## Best practices

- Compose `Table` by hand only for small, static tables; for repeated data use `data-table`, which renders through these parts.
- Mark the row-actions cell `type="action"` with `frozen="end"` so it pins to the trailing edge, and give the principal cell `principal` (or `grow="2"`).
- Name the table: a `Table.Caption` labels it (`aria-labelledby`), or pass `aria-label` on the root.
- Give `TableCellTime` dates from your data. Where the text must not depend on when it renders (an example, a test, a server render the browser hydrates), set `now` on the app's `ConfigProvider` and count sample dates back from that constant; never build them from `Date.now()` / `new Date()` in setup.
- Import the root alone from `table-root`, or each part from its own entry (`table-row`), when only a few parts are used.

## Usage

One import of the root; every structural part is reached via dot-notation (`<Table.Row>`, `<Table.Cell>`, …). The cell presets and toolbar controls are separate imports (`import TableCellStatus from '@aziontech/webkit/table-cell-status'`). The root binding must be PascalCase (`Table`); `table` lowercase collides with the native element.

```vue
<script setup>
  import Table from '@aziontech/webkit/table'
</script>

<template>
  <Table max-height="480px">
    <Table.Caption>Workloads</Table.Caption>

    <Table.Header frozen>
      <Table.Row>
        <Table.HeadCell
          :grow="2"
          sortable
          sort-direction="ascending"
          >Name</Table.HeadCell
        >
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell
          type="action"
          frozen="end"
          ><span class="sr-only">Actions</span></Table.HeadCell
        >
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row selected>
        <Table.Cell :grow="2">acme-prod</Table.Cell>
        <Table.Cell>Active</Table.Cell>
        <Table.Cell
          type="action"
          frozen="end"
          >…</Table.Cell
        >
      </Table.Row>
    </Table.Body>

    <template #footer>
      <Table.Footer>
        <!-- Pagination goes here; rendered below the scroll viewport, so it never scrolls -->
      </Table.Footer>
    </template>
  </Table>
</template>
```

Each sub-component is also a standalone import (`import TableRow from '@aziontech/webkit/table-row'`, …) — the tree-shaking path when only a few parts are used.

**Three ways in** (decision RV-K2-1, rule `webkit-content-channels`). A docs page writes a Markdown pipe table, and `DocMarkdown` renders it as this `Table` (`Table.Header`, `Table.Row`, `Table.HeadCell`, `Table.Body`, `Table.Cell`; bordered, lines wrapping, column alignment from `:---:` / `---:`, inline Markdown in the cells), loaded as an async chunk, so a docs table looks like an app table. The site places a table through `listing-table-section`. Sorting, toolbars, the cell presets and the data-driven `DataTable` stay Vue.

## Sub-components

<!-- Each sub-component lives in its own folder under the root.
     The shared injection-key.ts sits one directory up from each sub-component.
     Per-sub-component props/events are listed here (the root Props/Events/Slots tables
     below describe ONLY the root Table element).
     Compound API: index.ts (Object.assign; vue-tsc emits the adjacent index.d.ts at publish time) attaches the structural sub-components
     (header through toolbar below) to the root as `Table.Header` / `Table.Row` / `Table.Cell` / … (PascalCase root required).
     The toolbar controls and cell presets (table-search through table-cell-actions) are companion parts: standalone
     imports only, not attached, because each composes an overlay or input component.
     No per-component package.json — the root packages/webkit/package.json#exports map points each
     public path directly at its source file. See `.claude/rules/compound-api.md`. -->

- `table-header/table-header.vue` — `role="rowgroup"` header band. Props `frozen?: boolean` → sticky top within the scroll container; `density?: 'comfortable' | 'compact'` (default `undefined`) → `compact` shrinks the header cells' height and padding (published to the head cells through the row-group context, so the consumer sets it once on the header); DataTable passes its own `density`.
- `table-body/table-body.vue` — `role="rowgroup"` body band.
- `table-footer/table-footer.vue` — footer band below the viewport, outside `role="table"` (hosts the Pagination); muted text.
- `table-caption/table-caption.vue` — caption / title line that names the table (`aria-labelledby`); `text-label-sm` muted.
- `table-row/table-row.vue` — `role="row"`, flex container. Props `selected?: boolean`, `frozen?: boolean`. Forwards native listeners (e.g. `@click`) to its root via attribute fallthrough. Bottom divider `var(--border-width-default)` / `var(--border-default)`; hover `var(--bg-canvas)`; selected `var(--bg-selected)`. The row publishes its resolved background as the `--table-row-bg` custom property so frozen cells (and their edge fade) track the row hover/selected color instead of drifting against it.
- `table-head-cell/table-head-cell.vue` — `role="columnheader"`, height 44px. Props `type?: 'default' | 'checkbox' | 'action' | 'slot'` (`checkbox`/`action` are 40px fixed-width so the header aligns with the body's checkbox/action cells), `sortable?: boolean`, `sortDirection?: 'none' | 'ascending' | 'descending'`, `align?: 'start' | 'center' | 'end'`, `grow?: 1 | 2 | 3` (flex weight), `principal?: boolean` (defaults the weight to `grow: 2` when `grow` is unset — the principal/emphasized column), `frozen?: 'start' | 'end'`. Emits `sort: [direction: 'ascending' | 'descending']`. Renders `table-sort-button` when `sortable`; the header cell itself is not a tab stop (a pointer click anywhere on it still toggles the sort), and the button is named with the column through `aria-labelledby` (`tableHeadCell.sortBy` + the header text: `Sort by Name`), so the direction is read from the header's `aria-sort`. When `resizable`, renders a drag-to-resize handle on the right edge (`resizing` reflects the active drag; `resizeHandler` is the pointer handler DataTable supplies). `resizing` and `resizeHandler` are internal plumbing DataTable passes to its own head cells; they are not part of the composition API (a composed table resizes nothing).
- `table-cell/table-cell.vue` — `role="cell"`, min height 48px. Props `type?: 'default' | 'checkbox' | 'action'`, `align?: 'start' | 'center' | 'end'`, `grow?: 1 | 2 | 3`, `principal?: boolean` (defaults the weight to `grow: 2` when `grow` is unset — the principal/emphasized column), `frozen?: 'start' | 'end'`, `clickable?: boolean` (underlines the cell text). Cell text stays on one line and truncates, unless the root sets `wrapLines`. A cell is never wider than the table itself (`max-w-[100cqi]` against the `@container/table` root), so one value longer than the visible table ends in an ellipsis inside the frame instead of widening the table past it; the cap never binds while the value fits, so other columns keep their widths. The consumer keeps the full value available on the truncated element (a `title`, as the version-detail tables do). A `grow` column carries a fixed, content-independent flex basis (`flex: <grow> 0 5rem`) identical to its header cell, so the column resolves to the same width in the header and in every body row; when the table overflows it shrinks to that minimum and the viewport scrolls horizontally — instead of each row sizing the column to its own content, which misaligned the header from the body. A `width` column overrides the basis with a fixed pixel width; a `minWidth` column is measured and pinned to one resolved width (the larger of that floor and the widest of its header and rendered cells), so it reserves nothing it is not using and never truncates the chip inside it. Content (avatar, tag, icon, description, copy, "+99") is composed by the consumer via the default slot using existing primitives.
- `table-sort-button/table-sort-button.vue` — sort control used inside `table-head-cell`, rendered as the webkit `IconButton` (`variant="ghost"`, `size="small"` → 28×28) so size, padding, and alignment match the design system. Prop `sortDirection?: 'none' | 'ascending' | 'descending'` (the same name as `table-head-cell`). Emits `sort: [direction: 'ascending' | 'descending']` (the same event as `table-head-cell`). To hide it while keeping its space, pass `class="invisible"`. Glyphs via `az az-sort` (none) / `az az-arrow-up-wide-narrow` (ascending) / `az az-arrow-down-wide-narrow` (descending). Attributes (`aria-labelledby`, `class`) are forwarded to the `IconButton`; its own label (`Sort column`, `Sorted ascending`, `Sorted descending`) applies only when nothing names it.
- `table-toolbar/table-toolbar.vue` — flex container (end-aligned) for toolbar actions placed in the `toolbar` slot; injects the table context for its testId.
- `table-search/table-search.vue` — Use TableSearch for one free-text search over the table's rows. A context-aware search input. Reads and drives the TanStack `globalFilter` of the enclosing DataTable through the injected context, so it needs no wiring. Props `placeholder?: string` (default `''`; empty uses the locale catalog, `Search` in English) and `ariaLabel?: string` (default `''`; empty uses `tableSearch.label`, `Search the table`), so the field is never named only by its placeholder. While mounted it registers `/` with `useShortcuts` (listed as `tableSearch.focusShortcut`, Focus search): the key focuses the field from anywhere on the page except while typing in another field, with a modifier held, or from inside a modal layer that does not hold the search (the console keyboard standard). Rendered outside a DataTable it has no rows to search and warns once in the console.
- `table-filter/table-filter.vue` — Use TableFilter only as the toolbar slot that hosts FilterMenu (`type="menu"`) or PropertyFilter (`type="property"`) wired to the table; it is not a third filter. `type?: 'menu' | 'property'` (default `'menu'`) picks the host by data shape: `menu` renders [`FilterMenu`](./filter-menu.md) (facets picked from known values; `select`, `multi-select` and `date` fields) and `property` renders [`PropertyFilter`](./property-filter.md) (typed conditions with operators, `free-text` off and `hide-operations` on, so its tokens combine with AND like the table's `filters`). Both read and write the enclosing DataTable's `filters` model through the context (`v-model:filters`, `filter-apply` with the event first), mapped by `filter-menu-bridge.ts`. Props `fields?: TableFilterField[]` (default `[]`; empty uses the table's `filterFields`) and `title?: string` (default `''`; the menu trigger text, the property filter's accessible name; empty uses each one's catalog). Emits `apply: [event: Event, filters: TableAppliedFilter[]]`. No slots. The applied-filters row of the menu type is `FilterMenu.ChipGroup` with no `fields` in the DataTable `filters` slot; the property type shows its own tokens. Columns are chosen in `CollectionPreferences`, which reads the table's columns from context.
- `table-export-button/table-export-button.vue` — context-aware export control (an `IconButton`, download glyph, its name repeated on a `Tooltip`). Calls the injected `exportCsv(options?)`; the root emits `export` with the resolved rows (a consumer may intercept for server-side export, otherwise the built-in CSV util downloads the visible, ordered columns and filtered rows). Props `filename?: string` (default `''` → falls back to the root `exportFilename`), `scope?: 'page' | 'filtered' | 'all'` (default `'filtered'`). Slot `trigger` (scope `{ export }`).
- `table-refresh-button/table-refresh-button.vue` — context-aware refresh control (an `IconButton`, refresh glyph). Calls the injected `reload()`; the root emits `refresh`. Binds `:disabled` to `disabled || loading` (the injected loading flag), so it can't fire mid-fetch. Props `disabled?: boolean` (default `false`) and `loading?: boolean` (default `false`: spins the glyph and blocks a second press while a refresh runs and the current rows stay on screen — the refresh pattern; the table's own `loading` is for a first load with nothing to show). A `Tooltip` repeats its name for pointer users.
- `table-live-button/table-live-button.vue` — context-aware live-tail toggle (a `Button`, outlined, label from the catalog `Live` with a leading dot that turns success-coloured and pulses while live, `motion-reduce:animate-none`). Reads and drives the root `live` model through the injected context; `aria-pressed` mirrors it. Disabled while the table is `loading`. Prop `disabled?: boolean`. The app starts and stops its stream on `update:live`; the table never fetches.
- `table-cell-link/table-cell-link.vue` — cross-resource link preset. Props `label?: string`, `href?: string` (outside the app: an absolute address with a scheme or a leading `//` opens in a new tab with the external mark and a visually hidden `(opens in a new tab)`; a relative address is an in-app link in the same tab, with no mark), `to?: string | Record<string, unknown>` (in-app; the app's registered `RouterLink`, else a plain `href`; never the external mark), `destination?: string` (tooltip `Open <label> in <destination>`), `icon?: string` (default `''`; a glyph class drawn before the name in `var(--text-muted)`, outside the link and `aria-hidden`, naming the provider or the resource type: `az az-github` for a repository, `az az-workloads` for a workload), `copyable?: boolean`, `copyValue?: string`, `more?: OverflowCountItem[]`, `noun?: OverflowCountNoun` (default `undefined`; what the `more` values are, the same name as `TableCellTags`). Clicks stop at the link so a row click does not also fire. No `href`/`to` renders plain truncating text with no mark and no tooltip.
- `table-cell-id/table-cell-id.vue` — identifier preset: the value (`dir="ltr"`, tabular numbers, truncating) and a `CopyButton` pinned to the end edge named `Copy <resource> ID`. Props `value?: string | number`, `resource?: string`.
- `table-cell-status/table-cell-status.vue` — status preset: one `Tag` (`size="medium"`, truncating). Props `label?: string` (empty renders a muted dash), `severity?: TagSeverity` (default `neutral`), `icon?: string`. Use it over a bare `Tag` in a cell: it is the shared empty-dash rule. Use `status-indicator` for a live dot plus text, and `severity-tag` for a log severity.
- `table-cell-tags/table-cell-tags.vue` — tag list preset: rounded secondary tags, as many as fit the cell (measured with a `ResizeObserver` against a hidden ruler), the rest behind an `OverflowCount`. Props `items?: string[]` (empty renders a muted dash), `icon?: string`, `noun?: OverflowCountNoun` (default `tag` / `tags` from the catalog).
- `table-cell-time/table-cell-time.vue` — last-modified preset: the author's `Avatar` (name on its tooltip; an email reads as a name) and a `<time datetime>` with the relative time (`just now` under 45 s), the absolute time on its tooltip and in visually hidden text. One shared minute clock re-renders every mounted cell; under a `ConfigProvider` with `now` set, every cell reads that reference time instead, so an example, a test or a server render prints the same text wherever and whenever it renders. Props `value?: string | number | Date` (an epoch with 15 digits or more reads as microseconds, like `Timestamp`, with which it shares parsing and relative phrasing; empty or unparseable renders a muted dash), `author?: string`, `avatarSrc?: string`.
- `table-cell-actions/table-cell-actions.vue` — row actions preset: a `DropdownMenu` (`side="bottom"` + `align="end"`) triggered by an outlined ellipsis `IconButton` named `Actions for <name>`. Props `name?: string`, `disabled?: boolean`. Emits `select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]`; `DropdownMenuItemValue` (`string | number`) is re-exported by `./table`. Default slot: `DropdownMenu.Group`s of `DropdownMenu.Item`s.

<!-- Resulting layout:

  packages/webkit/src/components/data/table/
  ├── table.vue
  ├── index.ts              (compound: Object.assign attaches the structural parts; vue-tsc emits index.d.ts at publish)
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
  ├── table-export-button/            { table-export-button.vue }
  ├── table-refresh-button/    { table-refresh-button.vue }
  ├── table-live-button/       { table-live-button.vue }
  ├── table-cell-link/         { table-cell-link.vue }
  ├── table-cell-id/           { table-cell-id.vue }
  ├── table-cell-status/       { table-cell-status.vue }
  ├── table-cell-tags/         { table-cell-tags.vue }
  ├── table-cell-time/         { table-cell-time.vue, minute-clock.ts }
  └── table-cell-actions/      { table-cell-actions.vue }

  No per-component package.json. Public exports stay flat: ./table (→ index.ts), ./table-header, … ./table-search, ./table-filter, ./table-export-button, ./table-refresh-button, ./table-live-button, ./table-cell-link, ./table-cell-id, ./table-cell-status, ./table-cell-tags, ./table-cell-time, ./table-cell-actions, plus the CSV util ./utils/csv -->

## Props

<!-- Root Table element only. Sub-component props are listed in the Sub-components section. -->

| Prop        | Type                         | Default         | Required | JSDoc                                                                                                                                                                                                                                      |
| ----------- | ---------------------------- | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `maxHeight` | `string`                     | `''`            | false    | Max height (CSS length). The viewport scrolls dynamically: horizontal scroll appears automatically when columns overflow the width; vertical scroll appears only when `maxHeight` is set smaller than the content (under a frozen header). |
| `bordered`  | `boolean`                    | `false`         | false    | Draw the outer card border around the table. Off by default (the table is typically framed by a surrounding surface); the internal row dividers are unaffected.                                                                            |
| `density`   | `'comfortable' \| 'compact'` | `'comfortable'` | false    | Density of the body cells: `compact` shrinks their height and padding. Set `density` on `Table.Header` too for a compact header.                                                                                                           |
| `wrapLines` | `boolean`                    | `false`         | false    | Cell text wraps onto several lines instead of truncating. Identifiers stay on one line and truncate: `code`, `kbd`, `samp`, a `dir="ltr"` span (the `TableCellId` value) and code-typography text (`text-label-code-*`).                   |

## Events

_none_ — sort comes from `Table.HeadCell` (`sort`) and row clicks fall through on `Table.Row`.

## Slots

| Slot      | Scope | Notes                                                                                                                |
| --------- | ----- | -------------------------------------------------------------------------------------------------------------------- |
| `default` | —     | The scrollable region: `Table.Caption`, `Table.Header`, `Table.Body`.                                                |
| `title`   | —     | Title text shown at the start of the toolbar band, fixed above the scroll viewport.                                  |
| `toolbar` | —     | Action band above the scroll viewport, end-aligned beside the title.                                                 |
| `footer`  | —     | Footer region rendered below the scroll viewport (`Table.Footer` + `Pagination`), so it never scrolls with the body. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `selected`
- The viewport is always a scroll container (`overflow: auto`): horizontal scroll is automatic when columns overflow; vertical scroll engages only when `maxHeight` constrains the content.
- `data-frozen` on TableHeader (`true`), TableHeadCell / TableCell (`start` | `end`), and TableRow (`true`). A frozen head/body cell renders a CSS-only fade (gradient pseudo-element) just outside its inner edge that dissolves the horizontally scrolling content into the row background (`from-transparent` → `var(--table-row-bg)`, the row-published color, so it matches the row on hover/selected) — `frozen=start` fades on the right, `frozen=end` on the left. The fade tints nothing; it only masks the content sliding under the pinned column.
- Scroll cue: the scroll viewport sits in a `__scroll` frame that sets `data-overflow-start` / `data-overflow-end` from the scroll position (re-measured on scroll and on resize). While content is hidden past an inline edge, an `aria-hidden` gradient as wide as the hidden distance (at most 24 px, none when 4 px or less, so it never sits over text that is otherwise in view) (`__fade-start` / `__fade-end`, `from-transparent` to `var(--bg-surface)`, pointer events off) covers that edge of the viewport, so a phone shows that columns continue; it follows the inline direction under `dir="rtl"`, has no motion, and keeps its gradient under forced colors (fading to `Canvas`). A frozen column on that edge draws its own fade and paints over the viewport cue: the cue sits below the frozen cells and the sticky header (`z-5`, frozen cells `z-10`, sticky header `z-20`), so it shows only over the scrolling body cells. The stacking order does this, never a `:has()` on the frame, so scrolling virtual rows restyles only the rows it mounts.
- `data-state` on TableRow: `selected` | `unselected`; `data-selected` mirrors the `selected` prop; `aria-selected` set when selected.
- `data-type` on TableHeadCell (`default` | `checkbox` | `action` | `slot`) and TableCell (`default` | `checkbox` | `action`).
- `data-align` on head/body cells: `start` | `center` | `end`.
- `data-grow` on head/body cells: `1` | `2` | `3` (flex weight).
- `data-sortable` and `data-sort` (`none` | `ascending` | `descending`) on TableHeadCell; `aria-sort` mirrors `data-sort`.
- `data-sort` (`none` | `ascending` | `descending`) on TableSortButton.
- `data-clickable` on TableCell mirrors the `clickable` prop.
- Density and wrapping: `data-density="compact"` on the root shrinks the body cells (`min-h-9`, `--spacing-2xs` block padding); `data-wrap` lets cell text (and any `.truncate` inside a cell) wrap, except identifiers: `code`, `kbd`, `samp`, `[dir=ltr]` and `text-label-code-*` elements, and any `.truncate` inside them, keep `white-space: nowrap`, so a token such as `p-(--spacing-2xl)` or an ID never splits at a hyphen; they truncate instead. A compact header is `Table.Header density="compact"`.
- Responsive toolbar: the root is the `@container/table`; the toolbar wraps, and below `@md` of the table the `toolbar` slot moves under the title and starts at the start edge. `Table.Toolbar` wraps its controls.
- Hover-free devices: a touch screen shows the sort glyph only on the sorted column, as on a pointer screen with no hover; tapping a sortable header sorts it, and keyboard focus reveals the sort button.

## Motion & Animations

| Trigger                            | Animation / Transition                     | Token  | Reduced-motion fallback         |
| ---------------------------------- | ------------------------------------------ | ------ | ------------------------------- |
| row hover / selected               | `transition-colors duration-150 ease-out`  | inline | `motion-reduce:transition-none` |
| sort glyph reveal on header hover  | `transition-opacity duration-150 ease-out` | inline | `motion-reduce:transition-none` |
| live dot (`TableLiveButton`, live) | `animate-pulse`                            | inline | `motion-reduce:animate-none`    |

The root itself is static. `TableFilter` animates through the `FilterMenu` or `PropertyFilter` it hosts (owned by those specs); DataTable's own motion (body enter, row drag) is in [`data-table`](./data-table.md).

## Tokens

| Region                                                                  | Token (DESIGN.md)                                               |
| ----------------------------------------------------------------------- | --------------------------------------------------------------- |
| header typography                                                       | `.text-label-sm`                                                |
| toolbar title typography                                                | `.text-label-md`                                                |
| body cell typography                                                    | `.text-label-md`                                                |
| secondary / description typography                                      | `.text-label-sm`                                                |
| surface                                                                 | `var(--bg-surface)`                                             |
| outer border (card edge)                                                | `var(--border-default)`                                         |
| outer border width                                                      | `var(--border-width-default)`                                   |
| frozen column surface / edge fade (follow the row via `--table-row-bg`) | `var(--bg-surface)` · `var(--bg-canvas)` · `var(--bg-selected)` |
| frozen column edge fade (dissolves scrolling content)                   | `var(--bg-surface)`                                             |
| viewport scroll cue (edge fade over the hidden inline edge)             | `var(--bg-surface)`                                             |
| row hover                                                               | `var(--bg-canvas)`                                              |
| row selected                                                            | `var(--bg-selected)`                                            |
| text                                                                    | `var(--text-default)`                                           |
| text muted (header / description)                                       | `var(--text-muted)`                                             |
| divider                                                                 | `var(--border-default)`                                         |
| divider width                                                           | `var(--border-width-default)`                                   |
| cell padding x                                                          | `var(--spacing-sm)`                                             |
| gap                                                                     | `var(--spacing-xs)`                                             |
| shape (cells / surface)                                                 | `var(--shape-control)`                                          |
| shape (sort button)                                                     | `var(--shape-button)`                                           |
| ring                                                                    | `var(--ring-color)`                                             |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the sort button and any interactive cell content.
- Keyboard map: `Tab` focuses the sort button of each sortable column (one tab stop per column, as in the APG sortable table: the header cell itself is not focusable and carries `aria-sort`) and interactive cell content; `Enter`/`Space` on the sort button toggles the sort; row click is mouse/touch (no keyboard trap). Body rows are not focusable, so `row-click` is never the only way to open a record: the principal column carries a real link or button (`TableCellLink`, or the `cell-<id>` slot with an anchor, as the Default example does), which keyboard and screen-reader users reach instead (WCAG 2.1.1).
- ARIA: `role="table"` sits on the grid element inside the scroll viewport (testid `<testid>__table`), not on the root: the root also holds the toolbar band, the focusable scroll viewport and the footer, and any of those inside a `table` is an unallowed child (`aria-required-children`). Every `aria-*` attribute passed to `Table` (`aria-label`, `aria-labelledby`, `aria-describedby`…) is forwarded to that element; every other attribute stays on the root. `table-caption` is a plain element (no `role`) that names the table through `aria-labelledby` unless the consumer names it with `aria-label`/`aria-labelledby`. The default slot is the table's content, so it holds rowgroups (and a caption) only; anything else goes in `footer` or around the `Table`. `table-header`/`table-body` `role="rowgroup"`; `table-footer` has no role (it hosts pagination or an action, not rows); `table-row` `role="row"`; `table-head-cell` `role="columnheader"` with `aria-sort` when sortable; `table-cell` `role="cell"`; selected rows set `aria-selected`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including muted header text.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Pause, Stop, Hide (WCAG 2.2.2): the `TableLiveButton` dot pulses for as long as the live tail runs. The pulse is an essential status signal (it shows the stream is running, and stops when the stream stops), so it keeps `animate-pulse`; the user stops it with the same button, and `motion-reduce:animate-none` keeps it still.
- Touch target ≥40×40 px on the sort button and row action controls.
- Filter names: `TableFilter` hosts `FilterMenu` (its trigger counts the applied fields in its name) or `PropertyFilter` (a combobox named by `title`); see their specs.

## Examples

This component has no `type`/`size` on its root, so the canonical Types/Sizes examples do not apply. The data-driven scenarios live under [`data-table`](./data-table.md).

- Default — the compound dot-notation form built by hand (`<Table.Header>` / `<Table.Row>` / `<Table.HeadCell>` / `<Table.Body>` / `<Table.Cell>`); justified as the baseline of the hand-composed API.
- Cell Presets — every preset in one table (link with destination, domain with `+N` and copy, ID, status, tags, last modified, actions), inside a `ConfigProvider` whose fixed `now` the sample dates count back from, so the relative times read the same on every render; justified because the presets are the shared cell vocabulary every list uses.

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
- Do not add examples beyond Default + per `type` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export and the root `package.json` main/module point at `index.ts`, `types` at `index.d.ts`. Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
