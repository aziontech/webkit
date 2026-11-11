---
name: webkit-lists
description: The list page — the one shape every resource index takes on @aziontech/webkit, and the collection model behind it. Every list runs on `useCollection` (`@aziontech/webkit/use-collection`), in client mode (in-memory items) or server mode (a `fetch` that returns one page and the total) — it owns the text and property filters, sorting, pagination, selection across pages, the empty vs no-match states, the filter, sort and page in the URL and the saved preferences, and hands back props to bind on `Table`, `Pagination`, `PropertyFilter`, `CollectionPreferences` and `Cards`. Fixes the page skeleton (shell → page heading carrying the create action → controls row with the PropertyFilter and CollectionPreferences → card-wrapped Table, or Cards), which columns become filter properties, and the two empty states. Use when building or reviewing any resource index, list, card view or "all X" page. The page-level companion to /webkit-tables (which owns the Table and its cell recipes).
status: active
last_updated: 2026-11-11
scope: general
enforced_by: [webkit-prefer-over-custom, webkit-component-states, webkit-styling, ui-verify, review]
---

# Skill: webkit-lists

## Purpose

A product's list pages are the screens people spend the most time on and the ones that drift the fastest.
Each one is built by whoever needed it, so one index puts a row of Selects above the table, the next hides
the same job behind a badged funnel button, a third filters in the page and pages in the table so a filter
lands on an empty page 4 — and none of them keep the filter when the link is shared or remember the page
size someone picked yesterday.

They are all the same page, and they all hold the same state. This skill fixes that page: **one
skeleton**, **one collection model** (`useCollection`), and **one rule for which columns become filter
properties**. `/webkit-tables` owns what happens inside the `Table` — the column model and the cell
recipes. This skill owns everything around it: the page's structure, the controls row, and the state
that connects them.

Find the components named here through the `webkit` MCP (`suggest_component` / `get_component`) or
`node_modules/@aziontech/webkit/catalog.json`.

## How to use

- `/webkit-lists` — build any index page in this conversation to the shape below.
- `/webkit-lists <file>` — review that page against the patterns; per gap report the exact line/element
  (quoted), which pattern it breaks (one sentence), and the concrete fix.

Related: `/webkit-tables` (the Table, columns, cells) · `/webkit-navigation` (the app shell the page sits
in) · `/webkit-ui-states` (the empty and loading states a filtered list must render) ·
`/webkit-microcopy` (field labels, the empty-state sentence).

## When to invoke

- Building any "all X" / resource index / management list page.
- Adding filtering to an existing table, or being asked "how do I filter this".
- Reviewing a page whose controls row has grown a third `Select`.
- The user says the filters look different from the other pages, the table jumps to an empty page after
  filtering, or the search and the filters fight each other.

---

## 1. The list page, one shape

A heading, then one band holding the controls and the rows they narrow, and nothing else. The state of
the band is one `useCollection` call:

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Table from '@aziontech/webkit/table'
  import { useCollection } from '@aziontech/webkit/use-collection'

  const { tableProps, propertyFilterProps, preferencesProps, status, clearFilters } = useCollection({
    items: applications, // client mode; server mode passes `fetch` instead
    columns,
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: { storageKey: 'applications-table' },
    url: true
  })
</script>

<template>
  <AppShell
    active="applications"
    :breadcrumb="[{ label: 'Applications' }]"
  >
    <main class="layout-column flex min-h-full flex-col">
      <!-- THE PAGE HEADING. At first level this is the only place the module's name
           appears. The create action lives HERE, and it is the page's one `large` control. -->
      <PageHeader
        size="medium"
        title="Applications"
        description="Build, deploy, and manage your applications."
      >
        <template #actions>
          <Button
            label="Create application"
            kind="primary"
            size="large"
            icon="pi pi-plus"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <!-- ONE band: the controls and the rows they narrow -->
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header class="flex items-start gap-(--layout-group-gap)">
            <div class="flex min-w-0 grow">
              <PropertyFilter
                v-bind="propertyFilterProps"
                placeholder="Filter applications"
                aria-label="Filter applications"
              />
            </div>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
              <!-- Refresh · Download CSV · then the preferences, always last -->
              <CollectionPreferences v-bind="preferencesProps" />
            </div>
          </header>

          <section class="flex min-h-0 flex-col">
            <Card :padded="false">
              <template #content>
                <Table
                  v-bind="tableProps"
                  :bordered="false"
                  @row-click="open"
                >
                  <template #empty>
                    <!-- status === 'no-match' here; 'empty' renders the first-use state instead -->
                  </template>
                </Table>
              </template>
            </Card>
          </section>
        </section>
      </section>
    </main>
  </AppShell>
</template>
```

**A first-level module index opens with a `PageHeader` (`@aziontech/webkit/page-header`), and the module's
create action lives in it.** The shell draws the breadcrumb only from the **second** crumb up
(`/webkit-navigation`), so the heading is the only place the module's name appears in the content. Title,
one line of what the module is, `size="medium"`, and the create button in `#actions`.

**The size ladder is what makes the two rows read as two rows.** The heading's action is the page's only
`large` (40px) control; **everything** on the controls row is `medium` (32px) — the property filter, the
icon buttons beside it. What the page is _for_ reads first, what _narrows_ the list reads second.

**Where each action goes.** The page's create action is the heading's. An action on the **listing** — a
bulk operation over the selected rows — sits in the controls row beside the preferences. Never move the
create button onto the controls row. The label reads `Create <object>` for a list the sidebar routes to,
`Add <Product Module>` for a list that is a tab inside a resource (`/webkit-microcopy`).

**The controls and the table are ONE band**, joined by the group step (`--layout-group-gap`), not the
section step. Pushing the filter a full section step away from the rows it narrows is the single most
common version of this page done wrong.

**The card is unpadded and the table is unbordered** (`:padded="false"` + `:bordered="false"`), so the card
frames the table edge to edge.

The canonical blocks are `platform/view/table-view` (rows) and `platform/view/card-view` (cards): copy
one of them before writing a list from scratch.

---

## 2. `useCollection` is the default for every list

A list is a set of items plus five pieces of state — filter, sort, page, selection, preferences — and
every page that keeps them in loose refs gets one of them wrong (a filter that leaves you on page 4, a
selection that forgets the other pages, a sort the URL does not carry). `useCollection` holds all five
and returns props for every component that shows them:

| Return               | Bind on                 | Carries                                                                  |
| -------------------- | ----------------------- | ------------------------------------------------------------------------ |
| `tableProps`         | `Table`                 | one page of rows, ordered/visible columns, sorting, pagination, selection, density, wrap, stripes |
| `paginationProps`    | `Pagination`            | page, total, page size and its options                                   |
| `propertyFilterProps`| `PropertyFilter`        | the query, the properties, the match count                               |
| `filterProps`        | `Input`                 | free text only (`v-model`), for a list too small for properties          |
| `preferencesProps`   | `CollectionPreferences` | the saved preferences, the columns, the page sizes                       |
| `cardsProps`         | `Cards`                 | one page of items, the selection mode and keys                           |

Plus `status`, `totalCount`, `selectedCount`, `selectedItems`, `allMatchingSelected`, and the actions
(`setQuery`, `clearFilters`, `setPage`, `selectPage`, `selectAllMatching`, `clearSelection`, `refresh`, …).

**Client mode** — pass `items` (an array, ref or getter). Filtering, sorting and paging run in memory.

**Server mode** — pass `fetch` instead. It receives `{ filteringText, filter, sort, page, pageSize,
signal }` and resolves `{ items, total }`; the composable tracks `loading` and `error`, debounces the
text (`filtering.debounce`, 300 ms), aborts the previous request through `signal` when a newer one
starts, and ignores a late answer. The page passes the query straight to its API.

**Export** — `tableProps` also binds `exportRows`, so `Table.Export` and the Table's `exportCsv()`
write every match, not the one page the Table holds. In client mode that is the matching items; in
server mode pass `exportAll` (it receives `{ filteringText, filter, sort, scope }` and resolves every
item to write), or the export holds the loaded page only. `exportItems(scope?)` returns the same rows
for a custom export. A Download CSV button outside the Table calls `tableRef.value.exportCsv()`.

```js
const { tableProps } = useCollection({
  fetch: ({ filter, sort, page, pageSize, signal }) =>
    api.listApplications({ filter, sort, page, pageSize }, { signal }),
  columns,
  propertyFiltering: { properties },
  pagination: { pageSize: 25 },
  selection: {}
})
```

The table stays a renderer: `tableProps` sets `manualSorting`, `manualFiltering` and `manualPagination`,
so it never filters or slices the page it is given. Never also pass `:data` + `paginated` +
`v-model:globalFilter` by hand beside it.

---

## 3. The property filter — the columns decide the properties

One `PropertyFilter` replaces the search field and every per-column Select. Typing suggests a property,
then an operator, then a value; each choice is a removable token (`Status = Active`); text typed without
a property is a free-text token that searches every text field. The page declares the properties:

```js
const properties = [
  { key: 'name', label: 'Name' },
  {
    key: 'status',
    label: 'Status',
    options: [{ value: 'Active' }, { value: 'Inactive' }]
  },
  { key: 'owner', label: 'Author', options: owners.map((value) => ({ value })) },
  { key: 'requests', label: 'Requests', type: 'number' }
]
```

**Which columns become properties:**

- **Enumerable column → a property with `options`.** Status, type, environment, runtime, author. Options
  are suggested and printed by label in the token.
- **Number or date column → a property with `type: 'number'` / `'date'`**, which offers `>`, `<`, `>=`,
  `<=` as well as `=` and `!=`.
- **Free-text column → a plain property** (name, domain) — the free-text token covers it too, so keep
  only the ones people name ("Name contains api").
- **A column with two values that are never both interesting → nothing.**
- A property does not have to be a column: "Author" can be the avatar on the Last Modified cell.

**Order the options the way the domain does**, not alphabetically, when the domain has an order
(Production · Staging · Development).

Tokens combine with **Match all** (and) by default; **Match any** (or) appears with two tokens or more.
Bind `totalCount` (it comes in `propertyFilterProps`) so the count is announced after each change.

---

## 4. Empty is not no-match

`status` is `loading`, `error`, `empty` (the source has no items), `no-match` (filters hide every item) or
`ready`. They need different screens, and only the composable knows which one it is:

- **`empty`** — the account has none: the first-use state. Keep the heading and the controls, and show a
  flush `Card` with a medium `EmptyState` and the create action instead of the table.
- **`no-match`** — the filters hide everything: the table's `#empty` slot with an `EmptyState` that says
  so ("No applications match these filters") and a **Clear filters** button bound to `clearFilters`.
- **`error`** — an `Alert` above the table with a retry bound to `refresh` (`/webkit-ui-states`).

---

## 5. Filters in the URL, preferences saved

- **`url: true`** keeps the text (`q`), the tokens (`filter`, `op`), the sort (`sort=-requests,name`),
  the page (`page`) and the page size (`size`) in the query string through `history.replaceState`, and
  reads them back on load and on back/forward. Other query keys are left alone. Two lists on one page
  pass `url: { prefix: 'domains.' }`. With Vue Router, pass `url: { adapter: routerAdapter(useRouter()) }`
  (`routerAdapter` from `@aziontech/webkit/use-collection`), which also works during server rendering.
- **`preferences: { storageKey }`** saves the page size, the visible columns and their order, wrapped
  lines, striped rows and density in `localStorage` under that key, read after mount so server and
  client render the same first page. `defaults.columns` hides columns until someone shows them.
- `CollectionPreferences` edits a draft and confirms it; it is the only place those settings change.
  Lock the column that names the row (`hideable: false` on the column → `locked` in the panel).

---

## 6. Selection across pages

`selection: {}` (multi) or `selection: { mode: 'single' }`. Selection is a set of keys (`trackBy`, `id` by
default), so it survives paging, sorting and filtering (a filter drops the keys it hides unless
`keepSelection: true`).

- The table's header checkbox (and the visible **Select all rows** above stacked rows) selects the
  **current page**.
- After the page is selected, offer **Select all N items** bound to `selectAllMatching()`: in client mode
  it selects every match; in server mode it sets `allMatchingSelected`, counts `totalCount` minus the
  rows unticked since, and the bulk action sends the query instead of a list of keys.
- The bulk action's label counts the selection (`Delete (3)`) and is disabled at zero.

---

## 7. Cards — the same collection, as cards

When items are recognised by a few fields or a picture rather than compared column by column, render
`Cards` (`@aziontech/webkit/cards`) with `cardsProps` and a `Pagination` with `paginationProps`. The same
`useCollection` call drives it; the preferences panel then offers `sections: ['page-size', 'columns']`,
the "columns" being the fields each card shows. Name each card in the `header` slot with a link to the
item. Four cards a row in a wide container, one in a narrow one — the grid uses container queries.

---

## Hard rules

- **Every list runs on `useCollection`.** No loose `ref`s for filter, sort, page or selection, no
  `computed` that filters rows outside the table, no `watch` that rewinds the page — the composable does
  all three.
- The controls row and the table are **one band** at the group step — never a section step between the
  filter and the rows it narrows.
- A first-level module index **opens with a `PageHeader`** (`size="medium"`) carrying the create action.
- **The heading's action is the page's only `large` control; the whole controls row is `medium`.**
- `Card :padded="false"` + `Table :bordered="false"` — never a padded card around a bordered table.
- **One `PropertyFilter`** narrows the list — no row of Selects, no separate search field beside it, no
  badged funnel button.
- `CollectionPreferences` is the **last** control of the row.
- **`empty` and `no-match` render different states**, and `no-match` always offers Clear filters.
- A list whose state matters after a reload or a shared link sets **`url: true`**; a list with
  preferences sets a **`storageKey`** unique to that list.

## Review output

Per gap:

```
✗ ApplicationsList.vue:38
  quoted: <section class="layout-section-start flex flex-col gap-(--layout-section-gap)">
  rule:   the controls row and the table it narrows are one band, joined at the group step
  fix:    gap-(--layout-group-gap) — keep the section step for the gap ABOVE the band

✗ WorkloadsIndex.vue:71
  quoted: const visibleRows = computed(() => rows.value.filter((r) => r.status === status.value))
  rule:   every list runs on useCollection; filtering outside it loses the page rewind, the URL
          and the no-match state
  fix:    useCollection({ items: rows, propertyFiltering: { properties } }) and bind
          propertyFilterProps on a PropertyFilter, tableProps on the Table

✗ ConnectorsList.vue:22
  quoted: <EmptyState title="Create your first connector" /> in the #empty slot
  rule:   a filtered-to-nothing list is no-match, not empty
  fix:    branch on status: 'empty' → first-use state; 'no-match' → "No connectors match
          these filters" with Clear filters bound to clearFilters
```

Close with `List sound` or `N gaps — fix before polish`.

## References

- `/webkit-tables` — the `Table`, the column model and the cell recipes inside the card.
- `/webkit-navigation` — the shell the page sits in and how its nav row is activated.
- `/webkit-ui-states` — the loading skeleton, the error alert, and the empty vs no-match states.
- `/webkit-microcopy` — property labels, the empty-state sentences, the filter placeholder.
- Blocks: `platform/view/table-view` (rows) and `platform/view/card-view` (cards).
- Resolvable through the MCP or the catalog: `useCollection`, `PropertyFilter`, `CollectionPreferences`,
  `Table`, `Cards`, `Pagination`, `Card`, `EmptyState`, `Button`.

## Definition of Done

- [ ] Page is shell → column → heading → section → one band holding the controls and the card.
- [ ] First-level index carries a `size="medium"` `PageHeader` with the create action in `#actions`.
- [ ] Heading action `large`; every control on the controls row `medium`.
- [ ] One `useCollection` call holds filter, sort, page, selection and preferences; `tableProps` /
      `cardsProps`, `propertyFilterProps` and `preferencesProps` are bound with `v-bind`.
- [ ] Server lists pass `fetch` and forward `signal` to the request.
- [ ] Every enumerable column is a property with `options`; ordered columns carry `type`.
- [ ] `empty` and `no-match` render different states; `no-match` offers Clear filters.
- [ ] `url: true` (or a router adapter) on any list someone will share or reload.
- [ ] `preferences.storageKey` unique to the list; the naming column is locked.
- [ ] Bulk actions count the selection; "Select all N items" uses `selectAllMatching`.
- [ ] Verified in both themes with `/webkit-ui-verify`.
