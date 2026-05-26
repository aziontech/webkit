---
name: data-table
category: data
structure: composition
status: implemented
spec_version: 1
created: 2026-05-22
last_updated: 2026-05-22
checksum: 3dcb1a858556ea3dbb0ecc50481128baea0d457069fc8da30a031db7c79d4033
---


# DataTable — Component Spec

## Purpose

Composition-based data table for listing, filtering, sorting, and acting on tabular records. Mirrors the `core/list-data-table` API (toolbar + column slots) using webkit primitives instead of PrimeVue. Supports headerless list rows (workloads layout) and full column-header grid mode. No TanStack Table dependency.

## Sub-components

- `data-table.vue` — Root shell, table engine, empty/loading logic, CSV export.
- `data-table-column.vue` — Column registration with `#header` and `#body` scoped slots.
- `data-table-toolbar.vue` — Two-line toolbar with `first-line` and `second-line` slots.
- `data-table-search.vue` — Debounced search input bound to global filter.
- `data-table-actions.vue` — Trailing toolbar action cluster slot wrapper.
- `data-table-export.vue` — Export/CSV trigger button.
- `data-table-column-selector.vue` — Toggle column visibility panel.
- `data-table-filter.vue` — Anchored filter panel with field picker and `filter-field` slot.
- `data-table-filter-chips.vue` — Removable applied-filter chips row.
- `data-table-row-actions.vue` — Per-row kebab menu or inline action.
- `data-table-batch-actions.vue` — Bulk selection action bar.
- `data-table-breadcrumb.vue` — Path navigation above the table.
- `data-table-inline-create.vue` — Inline create row form.
- `data-table-position-input.vue` — Row order position input.
- `data-table-refresh-button.vue` — Table refresh control.
- `data-table-review-changes.vue` — Pending reorder/edit review footer.
- `data-table-view-toggle.vue` — View mode switcher.
- `data-table-view-all-footer.vue` — View-all footer CTA.
- `data-table-last-modified-popup.vue` — Hover popup for last-modified metadata.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `data` | `Record<string, unknown>[]` | `[]` | no | Row records to render. |
| `dataKey` | `string` | `'id'` | no | Unique row identifier field. |
| `columns` | `ColumnDefinition[]` | `[]` | no | Column metadata for skeleton, export, and column selector. |
| `loading` | `boolean` | `false` | no | Shows loading skeleton rows when true. |
| `totalRecords` | `number` | `0` | no | Total record count for lazy pagination. |
| `lazy` | `boolean` | `false` | no | When true, pagination and sort emit events for server fetch. |
| `first` | `number` | `0` | no | Zero-based index of the first row on the current page. |
| `hideHeader` | `boolean` | `false` | no | Hides column headers; renders headerless list rows. |
| `rowHover` | `boolean` | `true` | no | Applies hover surface token on rows. |
| `scrollable` | `boolean` | `false` | no | Wraps the table body in a scroll area. |
| `scrollHeight` | `string` | `''` | no | Max height when scrollable is true. |
| `showGridlines` | `boolean` | `false` | no | Shows row/column divider borders. |
| `filters` | `Record<string, unknown>` | `{}` | no | Active filter state including global search. |
| `sortField` | `string` | `''` | no | Current sort field name. |
| `sortOrder` | `number` | `1` | no | Sort direction: 1 ascending, -1 descending. |
| `sortMode` | `'single' \| 'multiple'` | `'single'` | no | Single or multi-column sort mode. |
| `globalFilterFields` | `string[]` | `[]` | no | Fields included in global text search. |
| `searchValue` | `string` | `''` | no | Bound search input value for empty-state logic. |
| `appliedFilters` | `FilterDefinition[]` | `[]` | no | Applied filter chips shown below the toolbar. |
| `paginator` | `boolean` | `false` | no | Enables pagination controls. |
| `rows` | `number` | `10` | no | Rows per page. |
| `rowsPerPageOptions` | `number[]` | `[10, 25, 50, 100]` | no | Page size options in the paginator. |
| `selection` | `Record<string, unknown> \| Record<string, unknown>[] \| null` | `null` | no | Selected row or rows. |
| `selectable` | `boolean` | `false` | no | Enables row selection checkboxes. |
| `editMode` | `'row' \| 'cell'` | `'row'` | no | Row or cell edit mode. |
| `editingRows` | `Record<string, unknown>[]` | `[]` | no | Rows currently in edit state. |
| `exportFilename` | `string` | `'export'` | no | Default CSV export filename. |
| `exportFunction` | `(options: { data: Record<string, unknown>[]; fields: string[] }) => void \| null` | `null` | no | Custom export handler; null uses built-in CSV. |
| `emptyListMessage` | `string` | `'No data available'` | no | In-table empty message when filtered with no rows. |
| `emptyBlock` | `EmptyBlockConfig` | `{ title: 'No data has been created', description: 'No data has been created.', createButtonLabel: 'Create' }` | no | Full-page empty block configuration. |
| `notShowEmptyBlock` | `boolean` | `false` | no | Always renders the table shell even when data is empty. |
| `hasEmptyBlockSlot` | `boolean` | `false` | no | Uses the emptyBlock slot instead of the default block. |
| `skeletonRows` | `number` | `5` | no | Skeleton placeholder row count while loading. |
| `frozenValue` | `Record<string, unknown>[]` | `[]` | no | Frozen rows pinned above the scroll body. |
| `resizableColumns` | `boolean` | `false` | no | Reserved; column resize deferred in v1. |
| `rowClass` | `(row: Record<string, unknown>) => string \| null` | `null` | no | Returns extra classes for a row. |
| `expandableRowGroups` | `boolean` | `false` | no | Enables expandable row groups. |
| `rowGroupMode` | `'subheader' \| 'rowspan'` | `'subheader'` | no | Row group rendering mode. |
| `groupRowsBy` | `string` | `''` | no | Field used to group rows. |
| `expandedRowGroups` | `string[]` | `[]` | no | Currently expanded group keys. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:filters` | `value: Record<string, unknown>` | v-model:filters. |
| `update:sortField` | `value: string` | v-model:sortField. |
| `update:sortOrder` | `value: number` | v-model:sortOrder. |
| `update:selection` | `value: Record<string, unknown> \| Record<string, unknown>[] \| null` | v-model:selection. |
| `update:editingRows` | `value: Record<string, unknown>[]` | v-model:editingRows. |
| `update:expandedRowGroups` | `value: string[]` | v-model:expandedRowGroups. |
| `update:first` | `value: number` | v-model:first. |
| `page` | `event: PageEvent` | Fires on page change. |
| `sort` | `event: SortEvent` | Fires on sort change. |
| `filter` | `event: Record<string, unknown>` | Fires when filters change. |
| `row-click` | `event: { data: Record<string, unknown>; originalEvent: MouseEvent }` | Fires on row click. |
| `row-reorder` | `event: RowOrderingResult` | Fires when rows are reordered. |
| `row-edit-save` | `event: RowEditEvent` | Fires when a row edit is saved. |
| `row-edit-cancel` | `event: RowEditEvent` | Fires when a row edit is cancelled. |
| `click-to-create` | `void` | Fires from the empty block create action. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | DataTableColumn children. |
| `header` | — | Toolbar area; typically DataTableToolbar. |
| `footer` | — | Table footer content. |
| `empty` | — | Custom in-table empty state. |
| `emptyBlock` | — | Full-page empty block replacement. |
| `emptyBlockButton` | — | Trailing action in the empty block. |
| `illustration` | — | Illustration in the empty block. |
| `loading` | — | Custom loading overlay. |
| `expansion` | `{ data: Record<string, unknown>; index: number }` | Row expansion content. |
| `groupheader` | `{ data: Record<string, unknown> }` | Row group header content. |
| `groupfooter` | `{ data: Record<string, unknown> }` | Row group footer content. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`
- `data-state` values: `selected` | `unselected` on rows when selectable
- `data-disabled` mirrors disabled controls in toolbar sub-components
- `data-loading` mirrors the root `loading` prop

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| row hover | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |
| filter chip remove | `transition-opacity duration-150 ease-out` | inline | `motion-reduce:transition-none` |
| loading skeleton | `animate-blink` | semantic | `motion-reduce:animate-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (primary cell) | `.text-body-sm` |
| typography (secondary cell) | `.text-body-xs` |
| typography (header) | `.text-body-sm` |
| surface | `var(--bg-surface)` |
| surface hover | `var(--bg-surface-hover)` |
| text | `var(--text-default)` |
| text muted | `var(--text-muted)` |
| border | `var(--border-default)` |
| spacing | `var(--spacing-3)` |
| spacing row | `var(--spacing-4)` |
| shape | `var(--shape-elements)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` focuses interactive controls; `Enter`/`Space` activates buttons and sortable headers; `Escape` closes filter panel and row menus; arrow keys navigate paginator when focused.
- ARIA: root uses `role="table"` or `role="grid"`; header cells use `scope="col"`; selectable rows use `aria-selected`; sortable headers use `aria-sort`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px on toolbar and row action controls.

## Stories (Storybook)

- Default — basic three-column table with headers.
- WithFilters — workloads-like layout (filter toggle, search, chips, headerless rows); justified because filter/search/chip interaction is the primary UX differentiator.
- WithLazyLoad — server-driven pagination with lazy prop; justified because lazy + totalRecords is a distinct data-fetch path.
- Empty — empty block vs in-table empty; justified because root visibility logic is non-trivial.

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
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
