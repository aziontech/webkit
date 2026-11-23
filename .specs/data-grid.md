---
name: data-grid
category: data
structure: monolithic
status: implemented
spec_version: 9
template: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2053-7649
  node_id: 2053:7649
checksum: 9879d9c6084f8e9d7106adb313ce2155bcc13a128f5d055fb1f9012b5cd3cc10
created: 2026-11-15
last_updated: 2026-11-20
---

# DataGrid — Component Spec

## Purpose

An editable, spreadsheet-like grid: rows of records and typed columns where people move a cell cursor with the keyboard, edit cells in place, select ranges, copy them and paste a block of cells from a spreadsheet, the way an SQL editor's results and a database table editor work. It shares the table's visual language (header band, row dividers, row selection, a pinned first column, the same tokens) but renders the WAI-ARIA **grid** pattern (`role="grid"`, `gridcell`, one roving tab stop), not a read-only table.

**Why a component of its own.** DataGrid is not an `editable` mode of `data-table` and is not composed from `table`'s parts, for three reasons. Table's parts render the **table** pattern (`role="table"`, `cell`, every link and button its own tab stop), while a grid needs `gridcell`s inside one roving tab stop with a cell cursor; switching the roles and the focus model inside the same parts would make every read-only table pay for it. In-cell editors must be borderless and fill the cell, so they are a bare `input` and `select` styled with the tokens, not the package's `Input` and `Select`, whose frames and overlays fight a 40 px cell. And DataGrid needs no sorting, filtering or paging engine: it loads no `@tanstack/vue-table` and no virtualization library, so an editing screen stays at about 9 KB.

**The rows are the edited value.** Where `data-table` takes `data` and only emits `update:data` when rows are reordered, DataGrid's rows are what the person edits, so they are its `v-model`: every committed edit writes a new array with a copy of the edited row, and `change` reports the cell, the new value and the previous one. A paste is the same edit over many cells: one new array for the whole paste, one `change` per changed cell. Adding and deleting rows are hooks: the grid emits `row-add` and `row-remove` and the app changes the rows. Thousands of rows scroll natively inside `maxHeight`, each row is laid out lazily with CSS `content-visibility: auto`, and each row re-renders only when its cells, its cursor or its range change.

## When to use

- Use DataGrid only when people edit many cells of many records in place, spreadsheet-style; for a short list of rows in a form use AttributeEditor, for read-and-act lists use DataTable (a hand-composed Table for small static ones).
- A database table editor or the editable results of a query: typed cells (text, number, boolean, a choice), keyboard-first editing, copy of a cell range and paste of a block copied from a spreadsheet.
- Bulk corrections across rows, where opening a drawer per record would be slower than editing the cells.

## When NOT to use

- People read, sort, filter, select and act on records but do not edit cells → use `data-table` (or a hand-composed `table`).
- A short list of same-field rows added and removed inside a form (environment variables, headers) → use `attribute-editor`.
- One record edited field by field → use a form with `field` controls.
- Key and value pairs shown for reading → use `key-value-list`.

## Related

- `data-table` — the read-and-act table (sorting, filters, paging, toolbar parts); DataGrid is its editable counterpart.
- `table` — the parts and tokens DataGrid shares its look with.
- `attribute-editor` — a few rows of the same fields inside a form.
- `collection-preferences` — the display preferences of a list; DataGrid's column widths are dragged in place instead.

## Best practices

- Give every row a stable id under `row-key` (default `'id'`): the cursor, the selection and the edits follow it.
- Type each column (`text`, `number`, `boolean`, `select`) so the editor matches the value; mark computed or key columns `editable: false`.
- Freeze the first column (`frozen-first-column`) when it names the row and the grid scrolls sideways.
- Keep adding and deleting in the app: handle `row-add` and `row-remove`, then write the new rows to the `v-model`. Confirm a delete of more than a few rows in a `confirm-dialog`.
- Use `readonly` while saving or for people who may not edit; the cursor, selection and copy still work, and a paste writes nothing.
- Save on `change`, not on `update:modelValue`, when each cell is stored on its own: a paste fires one `change` per changed cell, so a per-cell save keeps working.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import DataGrid from '@aziontech/webkit/data-grid'
  import { ref } from 'vue'

  const rows = ref([
    { id: '1', name: 'Acme Inc.', plan: 'business', seats: 12, active: true },
    { id: '2', name: 'Jane Doe', plan: 'free', seats: 1, active: false }
  ])
  const columns = [
    { id: 'name', header: 'Name', type: 'text' },
    {
      id: 'plan',
      header: 'Plan',
      type: 'select',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Business', value: 'business' }
      ]
    },
    { id: 'seats', header: 'Seats', type: 'number', align: 'end' },
    { id: 'active', header: 'Active', type: 'boolean' }
  ]
  const selection = ref([])
  let next = 3
  const addRow = () => {
    rows.value = [
      ...rows.value,
      { id: String(next++), name: '', plan: 'free', seats: 1, active: true }
    ]
  }
  const removeRows = (event, removed) => {
    const ids = new Set(removed.map((row) => row.id))
    rows.value = rows.value.filter((row) => !ids.has(row.id))
    selection.value = []
  }
</script>

<template>
  <DataGrid
    v-model="rows"
    v-model:selected-keys="selection"
    :columns="columns"
    aria-label="Customers"
    selectable
    frozen-first-column
    max-height="24rem"
    @row-add="addRow"
    @row-remove="removeRows"
  >
    <template #toolbar="{ add, remove, selectedCount }">
      <Button
        label="Add row"
        variant="outline"
        size="small"
        @click="add"
      />
      <Button
        label="Delete rows"
        variant="outline"
        size="small"
        :disabled="selectedCount === 0"
        @click="remove"
      />
    </template>
  </DataGrid>
</template>
```

## Props

| Prop                | Type               | Default | Required | JSDoc                                                                                                                              |
| ------------------- | ------------------ | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `columns`           | `DataGridColumn[]` | `[]`    | false    | Columns in order: `{ id, header, type?, options?, editable?, width?, minWidth?, align? }`; `type` picks the editor (default text). |
| `rowKey`            | `string`           | `'id'`  | false    | Field used as the stable row id (cursor, selection and edits follow it).                                                           |
| `selectable`        | `boolean`          | `false` | false    | Adds a leading checkbox column with Select all.                                                                                    |
| `frozenFirstColumn` | `boolean`          | `false` | false    | Pins the first data column to the inline start edge while the grid scrolls sideways.                                               |
| `readonly`          | `boolean`          | `false` | false    | No cell can be edited; the cursor, range selection and copy still work.                                                            |
| `maxHeight`         | `string`           | `''`    | false    | Max height (CSS length) of the scrolling viewport; the header stays on top.                                                        |
| `ariaLabel`         | `string`           | `''`    | false    | Accessible name of the grid when no visible heading names it.                                                                      |

`DataGridColumn` = `{ id: string; header: string; type?: DataGridColumnType; options?: { label: string; value: string | number }[]; editable?: boolean; width?: number; minWidth?: number; align?: 'start' | 'end' }`, `DataGridColumnType` = `'text' | 'number' | 'boolean' | 'select'`. `DataGridColumnAlign` = `'start' | 'end'`. `width` (px) is the starting width (160 when unset); every header carries a resize handle that drags the width between `minWidth` (64 when unset) and 960 px. The component is generic over its row (`generic="TRow extends object"`), inferred from `v-model`.

## v-model

| Model                   | Type       | Default | Emits                 | Notes                                                                                                                                                         |
| ----------------------- | ---------- | ------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`               | `TRow[]`   | `[]`    | `update:modelValue`   | The rows. A committed edit writes a new array with a copy of the edited row; a paste writes one new array for the whole block, copying only the changed rows. |
| `v-model:selected-keys` | `string[]` | `[]`    | `update:selectedKeys` | Keys of the selected rows, read from `rowKey` (the same shape as DataTable's `selectedKeys`). Space on the checkbox column and Select all change it.          |

## Events

| Event        | Payload                                  | Notes                                                                                                                                                                          |
| ------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `change`     | `(event: Event, edit: DataGridCellEdit)` | A cell edit was committed (Enter, Tab, blur, a toggle), or once per changed cell of a paste (`event` is the `ClipboardEvent`); `edit` is `{ row, columnId, value, previous }`. |
| `row-add`    | `(event: Event)`                         | The `add` function of the toolbar slot ran; the app appends a row to the `v-model`.                                                                                            |
| `row-remove` | `(event: Event, rows: TRow[])`           | The `remove` function of the toolbar slot ran with rows selected; the app removes them from the `v-model`.                                                                     |
| `copy`       | `(event: ClipboardEvent, text: string)`  | Ctrl+C or Cmd+C copied the selected cell range as tab-separated text (rows by line), written to the clipboard through the `copy` event's `clipboardData`.                      |

## Slots

| Slot      | Scope                                                                                                          | Notes                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `toolbar` | `{ selectedRows: TRow[]; selectedCount: number; add: (event: Event) => void; remove: (event: Event) => void }` | Action band above the grid (add and delete buttons); `add` and `remove` emit the row hooks. |
| `empty`   | —                                                                                                              | Shown in place of the rows when there are none. Defaults to a small `EmptyState`.           |

## States

- Visual states: `default`, `hover` (row), `focus-visible` (the cursor ring on the active cell or header), `selected` (cells in a range of two or more cells: `data-selected`, `aria-selected="true"`; the cursor cell alone is shown by its focus ring and is not painted as selected, so a grid nobody touched shows no selection; rows checked: `data-state="selected"`), `editing` (`data-editing` on the cell with the editor open), `readonly` (`data-readonly` on the root; non-editable cells carry `aria-readonly`).
- `invalid`: a number cell whose text is not a number stays in its editor on Enter or Tab, with `data-invalid` on the cell and the editor, `aria-invalid="true"` and `aria-describedby` pointing to a message (`dataGrid.invalidNumber`, `role="alert"`) under the cell; nothing is committed until the text parses or Escape restores the value. Blur with an invalid text discards it and keeps the previous value.
- `paste`: Ctrl+V or Cmd+V on the cell cursor reads the `paste` event's `text/plain` (no clipboard permission prompt) as tab-separated text: rows by line break (CRLF or LF), cells by tab, one trailing line break ignored, and a cell wrapped in double quotes may hold tabs and line breaks (`""` is a quote), the way Excel and Google Sheets copy. The block is written from the top-left cell of the selected range (the cursor cell when there is no range), clipped at the last row and column (a paste never adds rows; rows are the app's, through `row-add`); a single value with a range of several cells selected fills every cell of the range. Each value is read the way an in-cell edit commits it: `number` parses a number (empty clears it), `boolean` takes `true` / `false`, `1` / `0`, `yes` / `no` or the localized Yes / No (case-insensitive), `select` takes an option value or an option label (case-insensitive), `text` takes the text as is (empty clears it). A value that does not fit, a cell of a non-editable column and every cell of a `readonly` grid are skipped and keep their value. Afterwards the selected range is the pasted area, the cursor on its top-left cell, and a polite status announces the result (`dataGrid.pasted`, `dataGrid.pastedSkipped`, `dataGrid.pasteReadonly`). While an in-cell editor is open the grid does not handle the paste, so the editor's native paste inserts the text; on the header row a paste does nothing.
- `copy`: Ctrl+C or Cmd+C on the cell cursor writes the selected range to the native `copy` event's `clipboardData` as `text/plain` and cancels the event, so it needs no clipboard permission and works on an insecure (plain http) origin. When the browser fires no `copy` event for the shortcut, the grid runs the copy command itself. Rows go by `\n`, cells by tab, and a cell holding a tab, a line break or a double quote is wrapped in double quotes with each quote doubled, the way Excel and Google Sheets copy, so a copied range pastes back into the grid cell for cell. While an in-cell editor is open the grid does not handle the copy, so the editor's native copy takes its selected text.
- `empty`: no rows, the `empty` slot (default `EmptyState`, `dataGrid.emptyTitle`) under the header, outside the grid's rows; the header and toolbar stay.
- No `disabled` state: a grid people may not edit is `readonly` (the cursor, ranges and copy keep working). No `loading` or `error` state of its own: the app shows a `Skeleton` or an `Alert` around the grid while it loads; DataGrid never fetches.
- `data-frozen="start"` on the first column's cells with `frozenFirstColumn`; `data-resizing` on a header while its width is dragged.
- Scroll cue: the viewport sits in a `__scroll` frame that sets `data-overflow-start` / `data-overflow-end` from the scroll position (re-measured on scroll and on resize). While content is hidden past an inline edge, an `aria-hidden` gradient as wide as the hidden distance (at most 24 px, none when 4 px or less, so it never sits over text that is otherwise in view) (`__fade-start` / `__fade-end`, `from-transparent` to `var(--bg-surface)`, pointer events off) covers that edge; the start fade begins after the frozen columns. It follows the inline direction under `dir="rtl"`, has no motion, and keeps its gradient under forced colors (fading to `Canvas`).

## Motion & Animations

| Trigger                 | Animation / Transition                    | Token  | Reduced-motion fallback         |
| ----------------------- | ----------------------------------------- | ------ | ------------------------------- |
| row hover / cell select | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

## Tokens

| Region                         | Token (DESIGN.md)             |
| ------------------------------ | ----------------------------- |
| surface                        | `var(--bg-surface)`           |
| scroll cue (edge fade)         | `var(--bg-surface)`           |
| header surface                 | `var(--bg-surface-raised)`    |
| header typography              | `.text-label-sm`              |
| cell typography                | `.text-body-sm`               |
| invalid message typography     | `.text-label-sm`              |
| text                           | `var(--text-default)`         |
| text muted (header, read-only) | `var(--text-muted)`           |
| divider                        | `var(--border-default)`       |
| divider width                  | `var(--border-width-default)` |
| invalid ring and message edge  | `var(--danger-border)`        |
| row hover                      | `var(--bg-canvas)`            |
| selected cells / rows          | `var(--bg-selected)`          |
| active cell and focus ring     | `var(--ring-color)`           |
| cell padding x                 | `var(--spacing-sm)`           |
| gap                            | `var(--spacing-xs)`           |
| message padding / offset       | `var(--spacing-2xs)`          |
| shape (frame, editor)          | `var(--shape-control)`        |

Fixed sizes (no token exists for them): cell and header height `min-h-10` (40 px), `pointer-coarse:min-h-11` (44 px) on touch screens; the selection column 40 px; column width 160 px by default, 64–960 px when resized, 16 px per resize key press; the resize hit area `w-6` (24 px), `pointer-coarse:w-11` (44 px), centred on the column edge (`-end-3`), its visible rule `after:w-px` inset `after:inset-y-2`; stacking `z-1` (frozen cells, resize handle), `z-2` (sticky header), `z-3` (invalid message).

## Theme gaps

| Figma variable         | Temporary primitive                                                                 | Follow-up                                           |
| ---------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------- |
| border width (default) | `var(--border-width-default)` (theme `primitives/shape/shape.js`, not in DESIGN.md) | add it to DESIGN.md through an approved docs change |

## Accessibility (WCAG 2.1 AA)

- Pattern: the WAI-ARIA APG **data grid**. The grid element is `role="grid"` with `aria-rowcount` (rows + header) and `aria-colcount`, named by `ariaLabel`, or by an `aria-labelledby` / `aria-describedby` passed to DataGrid (both are forwarded to the grid element, not the frame), `aria-multiselectable="true"` (a cell range can always be selected) and `aria-readonly="true"` while `readonly`. Rows are `role="row"` with `aria-rowindex` (1-based, header is 1) and `aria-selected` when row selection is on; header cells `role="columnheader"`, body cells `role="gridcell"`, each with `aria-colindex`; every gridcell carries `aria-selected` (`true` in a range of two or more cells, `false` outside it and on a lone cursor cell) and a cell that cannot be edited `aria-readonly="true"`. The empty state renders outside the grid's rows, so `aria-rowcount` stays exact.
- One tab stop: exactly one cell of the grid has `tabindex="0"` (the active cell, the first body cell at start; the header row is part of the cursor), every other cell, checkbox and resize handle `-1`. `Tab` enters the grid on the active cell and `Tab` / `Shift+Tab` leave it. The editor inside a cell takes focus while editing and returns it to the cell when it closes.
- Keyboard map (cell cursor): `Arrow` keys move one cell, up into the header row and back (inline arrows follow the reading direction); `Home` / `End` the first / last cell of the row; `Ctrl+Home` / `Ctrl+End` the first / last cell of the grid; `PageUp` / `PageDown` ten rows; `Shift` with an arrow, `Home` or `End` extends the range over body cells; `Tab` / `Shift+Tab` leave the grid. `Enter` or `F2` opens the editor of a body cell and, on a header cell, moves focus to its resize handle; typing a character opens a text or number editor with that character (select and boolean cells do not open on typing); `Space` toggles a boolean cell, the row checkbox, or Select all on its header; `Delete` / `Backspace` clears an editable text or number cell; `Ctrl+C` / `Cmd+C` copies the range; `Ctrl+V` / `Cmd+V` pastes a tab-separated block from the top-left cell of the range, or fills the range with a single value (see States); `Ctrl+A` / `Cmd+A` selects every cell.
- Keyboard map (editing): `Enter` commits and moves down; `Tab` / `Shift+Tab` commit and move to the next / previous cell (wrapping across rows), the one case where Tab moves inside the grid; `Escape` cancels and restores the value; blur commits. A select editor is a native `select`: its arrow keys change the choice without committing, and Enter, Tab or blur commit it. An invalid number keeps the editor open (see States).
- Paste result: a visually hidden `role="status"` `aria-live="polite"` region outside the grid's rows announces `Pasted {count} cells`, `Pasted {count} cells, {skipped} skipped`, or `Read-only, nothing pasted`.
- Row checkboxes are named after the row: `dataGrid.selectRow` (`Select row {row}`) filled with the first column's text, else the row key.
- Resize handles are `role="separator"` with `aria-orientation="vertical"`, `aria-valuenow` (the width in px), `aria-valuemin` (`minWidth`, 64 by default), `aria-valuemax` (960) and a name (`dataGrid.resize`: `Resize Name`); they are reached with Enter from their header cell, `Arrow Left` / `Arrow Right` change the width by 16 px, and `Escape` or `Enter` return focus to the header cell.
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` inset on the active cell or header; the editor uses the same ring (`--danger-border` while invalid).
- Contrast ≥ 4.5:1 for text (muted header text included); the selected surface keeps the text contrast.
- `motion-reduce:transition-none` on every transition.
- Touch: cells and headers are 40 px high, 44 px under `pointer: coarse`; tapping a cell moves the cursor there, a second tap opens the editor; the resize handle has a 24 px hit area, 44 px under `pointer: coarse`.

## Internationalization

| Key                         | English source                                                                               | Override prop |
| --------------------------- | -------------------------------------------------------------------------------------------- | ------------- |
| `dataGrid.selectAll`        | `Select all rows`                                                                            | —             |
| `dataGrid.selectRow`        | `Select row`                                                                                 | —             |
| `dataGrid.resize`           | `Resize {column}`                                                                            | —             |
| `dataGrid.invalidNumber`    | `Enter a number`                                                                             | —             |
| `dataGrid.emptyTitle`       | `No rows yet`                                                                                | `empty` slot  |
| `dataGrid.emptyDescription` | `Add a row to start editing.`                                                                | `empty` slot  |
| `dataGrid.pasted`           | `Pasted {count} cells` (plural: `Pasted {count} cell`)                                       | —             |
| `dataGrid.pastedSkipped`    | `Pasted {count} cells, {skipped} skipped` (plural: `Pasted {count} cell, {skipped} skipped`) | —             |
| `dataGrid.pasteReadonly`    | `Read-only, nothing pasted`                                                                  | —             |
| `dataGrid.true`             | `Yes`                                                                                        | —             |
| `dataGrid.false`            | `No`                                                                                         | —             |

- Formatting: `number` cells render with `Intl.NumberFormat` in the locale of the nearest `ConfigProvider`; the editor and the copied text use the raw number. Strings come from the locale catalog through `useTranslate` (`dataGrid` group).

## Right-to-left

- Layout: logical utilities only (`start-0`, `ps-` / `pe-`, `text-start` / `text-end`, `border-e`); the frozen first column pins to the inline start edge, the scroll cue sits on the inline edges, and the resize handle sits on the inline end edge of each header.
- Icons: none of its own; the row checkbox and the empty state are the package's components.
- Keyboard: `Arrow Left` / `Arrow Right` follow the reading direction (`logicalArrowKey`): under `dir="rtl"` `Arrow Left` moves to the next cell; a resize handle's `Arrow Right` widens under `ltr` and `Arrow Left` widens under `rtl`.
- User data: cell text renders in a `<bdi>`, so ids, domains and numbers keep their own direction.

## Responsive

- Container queries: none: the grid is a two-dimensional surface that keeps its columns at every width.
- Narrow (≤ 640 px or a narrow container): the viewport scrolls sideways inside the grid, with the frozen first column still in view and the scroll cue on the edge that hides columns; the toolbar wraps.
- Touch: cells and headers are 44 px high under `pointer: coarse` (40 px otherwise); the resize handle's hit area is 44 px under `pointer: coarse` (24 px otherwise); editing opens on a second tap; nothing is hover-only.
- Reflow: a data grid is the WCAG 1.4.10 exception for two-dimensional content: the grid scrolls horizontally inside its frame, never the page.
- Touch: on coarse pointers (`pointer-coarse:`) the cell editor's text, the text field and the native `select` alike, steps up to 16 px (`text-body-md`), so iOS Safari does not zoom the page while editing a cell.

## Performance

- Bundle budget: the `data-grid` entry in `.size-limit.json` (10.25 KB gzip; paste added about 0.9 KB); it imports no table engine, so it does not add `@tanstack/vue-table` to a page, and a hand-composed `table` does not import it.
- Runtime budget: the `data-grid-1k` scenario of `perf-budgets.json` (1,000 rows × 8 columns): mount, and 40 cursor moves with the arrow keys. Each body row is memoized (`v-memo` on its record, its selection, its cursor, range and editor state, the column widths and the columns), so a cursor move re-renders only the rows it leaves and enters.
- Heavy parts: none: rows lay out lazily with `content-visibility: auto` and `contain-intrinsic-size`; no virtualization library.

## Examples

This component has no `variant`/`size`, so the canonical Types/Sizes examples do not apply.

- Default — a customers grid with text, select, number and boolean columns, the first column frozen, where a range is copied with Ctrl+C and pasted elsewhere with Ctrl+V (or a block pasted from a spreadsheet); justified as the baseline.
- Row Selection — `selectable` with the toolbar's Add row and Delete rows wired to `row-add` / `row-remove`; justified because the add and delete hooks and the checkbox column are distinct behaviours.
- Readonly — `readonly` while a save runs: the cursor and copy work, no editor opens; justified because `readonly` is a state the grid owns.

## Constraints — DO NOT

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
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
