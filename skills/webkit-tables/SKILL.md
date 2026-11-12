---
name: webkit-tables
description: Data tables on @aziontech/webkit — one data-driven <Table> bound to `useCollection` (`v-bind="tableProps"`, client or server mode) or given :data :columns row-key directly, with virtual rows for thousands of records, reorderable rows (drag or keyboard, `v-model:data`) when the order is the data, and the density / wrap / stripe preferences, with a column model (principal, grow, enableSorting, kind:'action', hideable), a fixed toolbar (Filter · Search · RefreshButton · Export · ColumnSelector) + AppliedFilters and the refresh pattern (keep rows while refreshing, an Updated time, auto-refresh rules), scrolling its body internally via the h-full/min-h-0 chain. Ships the cell presets every table shares — Table.CellLink (cross-resource link with its destination tooltip; the domain cell with `+N` OverflowCount and an end-pinned copy button), Table.CellId, Table.CellStatus (one chip per row), Table.CellTags, Table.CellTime (avatar + relative time) and Table.CellActions (row menu named after the row). The tabular companion to /webkit-form and /webkit-ui-states.
status: active
last_updated: 2026-11-11
scope: general
enforced_by: [webkit-prefer-over-custom, webkit-component-states, webkit-tokens, ui-verify]
---

# Skill: webkit-tables

## Purpose

A table is where a product shows the most data in the least room, so it is where inconsistency shows
most: one table right-pins its actions and another left-floats them, one domain cell puts a copy button
flush against the text so it lands at a different x on every row, one table overflows the page instead of
scrolling its own body. This skill fixes the **structure** of a data table built on the webkit `Table`
(`@aziontech/webkit/table`) and the **cell recipes** it composes, so every table in the app reads the
same and every recurring cell type (name, status, domain, actions, copy) looks identical across screens.

It is the tabular companion to `/webkit-form` (form layout) and `/webkit-ui-states` (the loading / empty /
error states a table must render). This skill owns **the Table setup, the column model, the toolbar,
internal scroll, and the cell recipes** — including the aligned domain cell.

Find the `Table` and its sub-components through the `webkit` MCP (`suggest_component` / `get_component`)
or `node_modules/@aziontech/webkit/catalog.json` — never by reading a component source path.

## How to use

- `/webkit-tables` — apply the structure + cell recipes below to any table you build in this conversation.
- `/webkit-tables <file>` — review the file's table against the patterns; per gap report the exact
  line/element (quoted), which pattern it breaks (one sentence), and the concrete fix naming the webkit
  component to use.

## When to invoke

- Building or reviewing any list/index page, resource table, or any `<Table>` with cell slots.
- The user asks "the copy button is misaligned", "how do I lay out this cell", "the table overflows the
  page", "which toolbar controls", "how do actions/status/domain cells look".
- After `/webkit-ui-states` establishes the empty/loading/error states, and before `/webkit-impeccable-polish`.

## The Table — data-driven, one shape

Tables are **data-driven**, not hand-authored rows: pass `:data` + `:columns` and render each column
through a `#cell-<accessorKey>` slot. Never build `<tr>`/`<td>` by hand, and never restyle the Table's
internals — compose inside its slots.

`@aziontech/webkit/table-root` is the same data-driven root without the compound parts attached, so a
file that only renders `:data` + `:columns` imports it to stay small; `TableRoot :data :columns` is the
data-driven `Table`, not a hand-composed one. The parts (`Table.Header`, `Table.Row`, `Table.Cell`, or
`table-row` / `table-cell` imports) are for a component author building a new table primitive. A screen
or block never composes rows from them, even a short static list: a hand-composed table loses the
stacked layout, the column model and the cell slots.

### Bind it to `useCollection` — the default for any list

A table that lists records is a collection: bind it to `useCollection`
(`@aziontech/webkit/use-collection`, see `/webkit-lists`) and let the composable own the filter, the
sort, the page, the selection and the saved preferences. One `v-bind` carries all of it:

```vue
<script setup>
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Table from '@aziontech/webkit/table'
  import { useCollection } from '@aziontech/webkit/use-collection'

  const { tableProps, propertyFilterProps } = useCollection({
    items: applications, // or fetch: ({ filter, sort, page, pageSize, signal }) => api(…)
    columns,
    propertyFiltering: { properties },
    pagination: { pageSize: 10 },
    selection: {},
    preferences: { storageKey: 'applications-table' },
    url: true
  })
</script>

<template>
  <PropertyFilter v-bind="propertyFilterProps" />
  <Table
    v-bind="tableProps"
    :bordered="false"
  >
    <!-- #cell-* slots -->
  </Table>
</template>
```

`tableProps` sets `manualSorting` / `manualFiltering` / `manualPagination`, so the table renders the one
page it is given; the header checkbox selects that page and the selection survives paging. The columns
arrive ordered and hidden per the saved preferences, with `density`, `wrapLines` and `striped`. Pass
`:data` + `paginated` by hand only for a short, static table with no filter (a settings sub-list).

```vue
<script setup>
  import Table from '@aziontech/webkit/table'
</script>

<template>
  <Table
    :data="applications"
    :columns="columns"
    :filter-fields="filterFields"
    row-key="id"
    enable-sorting
    paginated
    :page-size="8"
    :bordered="false"
    max-height="100%"
    class="h-full"
    @row-click="openApp"
  >
    <!-- toolbar · filters · #cell-* slots -->
  </Table>
</template>
```

- `row-key` is the stable id accessor; `@row-click` opens the detail view (see the `@click.stop`
  discipline below so cell controls don't trigger it).
- `enable-sorting` + per-column `enableSorting: true` turns on the sort affordance for that column.
- `paginated` + `:page-size` paginates client-side; `:bordered="false"` for a flush table inside a `Card`.

### Column model

One flat `columns` array. Each column is `{ accessorKey, header }` plus the options it needs:

```js
const columns = [
  { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
  { accessorKey: 'repository', header: 'Repository', grow: 2 },
  { accessorKey: 'id', header: 'ID', enableSorting: true },
  { accessorKey: 'domainName', header: 'Domain Name', grow: 3 },
  { accessorKey: 'status', header: 'Status', enableSorting: true },
  { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
  { id: 'actions', kind: 'action', hideable: false } // auto-pinned to the right edge
]
```

- **`principal: true`** marks the emphasized identity column (the name) — one per table.
- **`grow: N`** gives a flexible column a larger share of the width (default share is `1`). Use it for
  long-content columns (repository, domain, timestamps).
- **`kind: 'action'`** is the trailing actions column; it auto-pins to the right edge. Pair with
  `hideable: false` so the column selector can't hide it.
- **`enableSorting: true`** per sortable column (with `enable-sorting` on the root).

### Toolbar + applied filters

A list page puts its `PropertyFilter` and `CollectionPreferences` **above** the card, bound to
`useCollection` (`/webkit-lists`). The in-table toolbar below is for a table that is its own small
surface (a drawer, a panel) and does not page through a collection.

The toolbar is a fixed, ordered set of compound `Table.*` controls in the `#toolbar` slot; the
applied-filter chips render in `#filters` via `Table.AppliedFilters`. `filterFields` (`{ id, label,
type, options? }`) drives the `Table.Filter` builder.

```vue
<template #toolbar>
  <div class="flex w-full items-center gap-(--spacing-xs)">
    <Table.Filter :fields="filterFields" />
    <Table.Search
      size="large"
      placeholder="Search..."
      class="flex-1"
    />
    <Table.RefreshButton />
    <Table.Export />
    <Table.ColumnSelector />
  </div>
</template>

<template #filters>
  <Table.AppliedFilters />
</template>
```

Order left→right: **Filter · Search (`flex-1`) · Refresh · Export · ColumnSelector**. `Table.Search`
drives the global filter through the injected table context — it takes no `v-model` (compound API).

### Refresh — the button, when it last updated, and auto-refresh

A list whose rows change on their own (deployments, purges, certificates being issued) offers a
refresh, says when it last loaded, and only refreshes by itself when the reader would expect it to.

```vue
<template #toolbar>
  <div class="flex min-w-0 items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)">
    <span class="shrink-0">Updated</span>
    <Table.CellTime :value="updatedAt" />
  </div>
  <Table.RefreshButton :loading="refreshing" />
</template>
```

1. **Keep the rows on screen while refreshing.** Pass `loading` to `Table.RefreshButton` (it spins
   and cannot fire twice) and keep the table's own `loading` for a first load with nothing to show;
   the skeleton replacing rows the reader was reading is a jump, not feedback.
2. **Say when it last updated**, relative, beside the button: `Updated` plus `Table.CellTime`. It
   re-renders every minute and carries the absolute time on its tooltip.
3. **Auto-refresh is off by default on a list** and the reader turns it on (a `Switch` in the toolbar
   or in `CollectionPreferences`). Turn it on by default only on a live view (a deploy in progress,
   real-time events). Interval: 30 seconds or more for a list, 10 seconds for a live view.
4. **Never disturb the reader.** Skip a tick while the tab is hidden
   (`document.visibilityState`), while a row menu, a popover or an edit is open, or while rows are
   selected. A refresh never moves focus, resets the scroll, the page, the sort or the selection.
5. **Refresh once after the reader's own change** (create, delete, a bulk action), then fall back to
   the rules above.
6. **A failed refresh keeps the stale rows** and says so in an `Alert` above the table
   (`Couldn't refresh. Showing data from 2 minutes ago.`) with **Retry**; auto-refresh stops until a
   refresh succeeds. A failure is the only refresh outcome a screen reader hears.

`examples/table/refresh.vue` is the reference.

### Scroll the body internally — never the page

A full-height index scrolls its own **body** while the toolbar/header stay pinned. Do it with a height
chain, not a fixed pixel height:

```vue
<section class="flex min-h-0 flex-1 flex-col">
  <Card :padded="false" class="h-full">
    <template #content>
      <Table … max-height="100%" class="h-full">…</Table>
    </template>
  </Card>
</section>
```

`min-h-0` on the flex parent (so it can shrink), `h-full` down the chain (`Card` → `Table`), and
`max-height="100%"` on the `Table` — the body scrolls inside, the toolbar and column headers don't move.

### Narrow boxes — stacked rows, not a sideways scroll

A data-driven `Table` measures its own box. Below `--container-lg` (552 px: a phone, a drawer, one
pane of a split view) it sets `data-stacked` and renders each row as a card: the checkbox, the
principal column and the actions share the first line, and every other column becomes a line of
**label · value** (the label is the column `label` or `header`). The column headers stay in the DOM,
visually hidden, so screen readers keep them. Nothing to configure:

```vue
<Table :data="rows" :columns="columns" row-key="id" />
```

- Keep `principal: true` on the column that names the row: it is the card title.
- Give a column `label` when its `header` is a slot, so the stacked line has a label.
- `:stackable="false"` keeps the horizontally scrolling grid at every width. Use it only where
  rows are compared across columns (a pricing grid, a diff), never just to avoid the cards.
- The toolbar is a container too (`@container/table`): below `@md` of the table the toolbar slot
  drops under the title and wraps. Keep `Table.Search` `flex-1` so it takes the free line.
- A hand-composed table (`Table.Header` / `Table.Row` without `columns`) never stacks; prefer the
  data-driven API in anything that can be narrow.

### Thousands of rows — `virtual`

A table that must show every row at once (a log, an export preview) with more than a few hundred rows
sets `virtual`: only the rows in view (plus 8 above and below) render, the rest are space, so 10,000 rows
mount and scroll fast. The viewport scrolls within `max-height` (40rem when unset); `estimate-row-height`
(48) is the first guess until a row is measured. The root keeps `aria-rowcount` and every row its
`aria-rowindex`. A paged list does not need it — page instead.

```vue
<Table :data="logLines" :columns="columns" virtual max-height="32rem" />
```

### Density, wrapped lines and stripes

`density="compact"` shrinks the body rows, `wrap-lines` lets cell text (and any `truncate` inside a
cell) wrap instead of ellipsizing, `striped` shades every other body row. They are the person's choice,
not the page's: let `CollectionPreferences` set them through `useCollection` instead of hard-coding them.

### Selection in a narrow box

In the stacked layout the column headers are hidden, so the table renders a visible, labelled **Select
all rows** checkbox above the stacked rows. Nothing to configure; do not add your own.

### Order that matters — `reorderable`

When the order of the rows **is** the data (rules that run top to bottom, a fallback list, steps), set
`reorderable` and bind `v-model:data`. Each row gets a grip: drag it, or focus it and press Arrow Up,
Arrow Down, Home or End. Every move is announced (`Moved Block unknown bots to position 2 of 5.`),
focus stays on the moved row's grip, and the table emits `reorder` with `{ from, to, row }` for the
save call.

```vue
<Table
  v-model:data="rules"
  :columns="columns"
  row-key="id"
  reorderable
  aria-label="Rules, in the order they run"
/>
```

- Reordering a sorted view means nothing, so the grips lock while a sort is applied and say why.
  Do not offer a sort on a table whose order is the data.
- Save the order the way the rest of the screen saves (a `SaveBar`, or at once with the async-submit
  toast), not silently on every move.
- Name the table after the order (`Rules, in the order they run`), so the position in each grip's
  name has a meaning.

## Cell recipes

Render each column with `#cell-<accessorKey>` (`#cell-actions` for the action column). The recurring
cells are **presets** on the `Table` compound (`Table.CellLink`, `Table.CellId`, `Table.CellStatus`,
`Table.CellTags`, `Table.CellTime`, `Table.CellActions`; also importable one by one as
`@aziontech/webkit/table-cell-<name>`): use them instead of re-typing the markup, so a cell type looks
identical across every table. `examples/table/cell-presets.vue` shows all of them in one table.

### Principal / name cell — icon + truncate + hover-underline

```vue
<template #cell-name="{ value, row }">
  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
    <i
      :class="presetIcon(row.preset)"
      class="shrink-0 text-[1.15em]"
      aria-hidden="true"
    />
    <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
  </div>
</template>
```

`min-w-0` on the wrapper + `truncate` on the label so a long name ellipsizes instead of overflowing; the
leading glyph is `shrink-0`.

**Name the whole, not one of its parts.** The principal column carries the unit a reader owns,
recognises and can open — the workload, the project, the account. It does **not** name an artifact
that unit happens to contain, with a second column beside it chipping that artifact's kind: that
spends two columns and two chips to say what the reader was not looking for. The contained thing
belongs on the record's own page, and its kind stays available as a **filter field**.

**A leading glyph that is the same on every row names the COLUMN; one that varies names the VALUE.**
Both are legitimate and they do different jobs — a per-row product mark tells rows apart, a constant
mark tells the reader what the column holds. What is never legitimate is a constant glyph you cannot
explain: if it varies with nothing and identifies nothing, it is decoration in the row's most
valuable space. A decorative glyph is `aria-hidden`; when it is the only thing carrying a fact (the
row's kind, say), that fact also needs a visually-hidden label, or it exists for sighted readers
only.

### Tag / chip cell + status-severity cell

Use `Tag` for a chip; for status, map the value to a semantic `severity` — **never a raw color**.

**One chip per row.** A row where three columns are chips has no emphasis left to spend on the one
fact a reader scans the list for. Chip the thing that is genuinely a _status_ — what happened, what
is live — and render every other enumerable value as a glyph plus plain text. If two chips both
survive that test, check whether they are restating one fact.

**A CATEGORY chip is one `rounded` tag in one severity.** A category says _which kind_, not _how it
is going_ — an environment, a type, a tier. Branching its colour (`Production` blue, everything else
grey) makes the tag carry a second meaning the reader has to learn, and it competes with the status
colour that earned the row's attention. The tag's **name** is what distinguishes the values, so the
severity is a constant. Keep that constant in **one shared helper** rather than per call site: the
moment two lists map the same category themselves, they drift into two palettes.

Reserve the branching severity for genuine status (`success` / `danger` / `warning`), where the
colour _is_ the information.

```vue
<template #cell-repository="{ value }">
  <Tag
    severity="secondary"
    size="medium"
    icon="pi pi-github"
    rounded
    class="max-w-full"
  >
    <span class="min-w-0 truncate">{{ value }}</span>
  </Tag>
</template>
```

A status cell is `Table.CellStatus` (below).
### Cross-resource link — `Table.CellLink`

A name that opens **something other than this row** — the workload a deployment belongs to, the
function an instance runs, the site a domain serves — is `Table.CellLink`, in a table cell and in a
detail panel alike. It carries three rules, and each is a real bug when a hand-made copy skips one:

1. **Every external mark says where it goes.** The glyph announces the name leaves; the **tooltip
   names what it leaves for**, so the reader decides before the click. In-app (`to` plus
   `destination`) reads `Open <name> in <Module>`; off-app (`href`) reads `Open <name> in a new tab`
   and adds a visually hidden `(opens in a new tab)`.
2. **The mark is a fixed 12px `pi-external-link`**, never sized from the text around it.
3. **No destination, no mark, no tooltip.** Without `href` or `to` it renders plain truncating text.

```vue
<template #cell-workload="{ row }">
  <Table.CellLink
    :label="row.workload.name"
    :to="`/workloads/${row.workload.id}`"
    destination="Workloads"
  />
</template>
```

- `to` renders the app's registered `RouterLink`; with no router it falls back to a plain `href`.
- It underlines on hover, not at rest, and stops the click so the row's `@row-click` does not fire.
- Do not re-type its markup per call site. The hand-made copies drift on every axis at once (glyph,
  icon size, underline at rest, tooltip or none), and a `Tooltip` trigger in a flex cell needs
  `shrink!` to let the name truncate, which the preset already sets.

### Domain cell — `Table.CellLink` with `more` and `copyable`

The copy button never sits flush against the domain (its x-position would then vary per row with
the domain's length). `copyable` pins it to the cell's end edge, the link truncates and the cell
fills its column, so every copy button lines up. `more` puts the other domains behind a `+N`
`OverflowCount`:

```vue
<template #cell-domains="{ row }">
  <Table.CellLink
    :label="row.domains[0]"
    :href="`https://${row.domains[0]}`"
    :more="row.domains.slice(1).map((label) => ({ label, href: `https://${label}` }))"
    :more-noun="{ one: 'domain', other: 'domains' }"
    copyable
  />
</template>
```

The value keeps its order under `dir="rtl"` (`dir="auto"` on the name). Use this on **every** list
that shows a domain; four lists each with their own copy is how one ends up without the copy button.

### "+N" overflow — `OverflowCount`, not a wrapped list

When a cell holds a primary value plus more of the same kind, show the primary and an
`OverflowCount` (`@aziontech/webkit/overflow-count`) with the hidden ones. It is the overflow rule of
`/webkit-ux-heuristics` built once: a chip named `Show all <n> <noun>`, a popover with the summary
(`12 domains`, `10 of 34 domains`), a search box past 7 items, Load more in batches of 10, a no-match
line quoting the query, a polite status region, and a reset when it closes. Pass only the hidden items
and a `noun`; an item with `href` opens in a new tab, and the `item` slot takes a router link.
`Table.CellLink` (`more`) and `Table.CellTags` already use it.

### Tags — `Table.CellTags`

A list of tags shows as many as fit the cell and moves the rest behind `+N`; it measures itself, so
the same column reads well at every width. Tags are rounded and secondary (a category, not a status).

```vue
<template #cell-tags="{ value }">
  <Table.CellTags :items="value" />
</template>
```

### Identifier — `Table.CellId`

An ID, token or other copyable value uses the **text-then-copy** shape with the copy button pinned to
the end edge, named after what it copies (`resource="workload"` → `Copy workload ID`):

```vue
<template #cell-id="{ value }">
  <Table.CellId
    :value="value"
    resource="workload"
  />
</template>
```

### Status — `Table.CellStatus`

```vue
<template #cell-status="{ value }">
  <Table.CellStatus
    :label="value"
    :severity="statusSeverity(value)"
  />
</template>
```

`statusSeverity` is one shared helper per status set (see the chip rules above). An empty value
renders a muted dash.

### Last modified — `Table.CellTime` (one column, not two)

A "Last modified" / "Updated" / "Deployed" column shows **the author's avatar and a relative time**
("2 hours ago"), never a raw absolute date and never a separate "Author" column. The name is on the
avatar's tooltip (an email reads as a name: `maria.silva@example.com` → `Maria Silva`); the absolute
time is on the time's tooltip and in visually hidden text, so a screen reader hears both. Every
mounted cell shares one minute clock, so "just now" turns into "1 minute ago" without a reload.

```vue
<template #cell-updatedAt="{ row }">
  <Table.CellTime
    :value="row.updatedAt"
    :author="row.updatedBy"
  />
</template>
```

### Actions — `Table.CellActions`

The trailing `kind: 'action'` column renders `Table.CellActions`: an outlined ellipsis trigger named
`Actions for <row name>` (so a screen reader's button list tells the rows apart) opening a
`DropdownMenu`. Destructive options go in their own last `DropdownMenu.Group`. Give the column a
visually hidden header (`#header-actions` → `<span class="sr-only">Actions</span>`).

```vue
<template #cell-actions="{ row }">
  <Table.CellActions
    :name="row.name"
    @select="(event, value) => onRowAction(event, value, row)"
  >
    <DropdownMenu.Group>
      <DropdownMenu.Option value="edit" label="Edit" />
      <DropdownMenu.Option value="clone" label="Clone" />
    </DropdownMenu.Group>
    <DropdownMenu.Group>
      <DropdownMenu.Option value="delete" label="Delete" />
    </DropdownMenu.Group>
  </Table.CellActions>
</template>
```

`@select` follows the webkit event contract `(event, value)`. Any interactive control in a
**non-action** cell of a row-clickable table needs `@click.stop`; the presets already stop theirs.

## Checklist

- [ ] Table is data-driven: `:data` + `:columns` + `row-key`, rows via `#cell-<key>` — no hand-built `<tr>`.
- [ ] A table that lists a collection is bound with `v-bind="tableProps"` from `useCollection`; filters, sort, page and selection are not kept in loose refs.
- [ ] More than a few hundred rows on one screen → `virtual` with a `max-height`; otherwise paginate.
- [ ] Density, wrap and stripes come from the saved preferences, not hard-coded per page.
- [ ] Exactly one `principal: true` column; the actions column is `{ kind: 'action', hideable: false }`.
- [ ] `grow: N` on long columns (repository, domain, timestamps); no fixed pixel widths.
- [ ] Toolbar order: Filter · Search (`flex-1`) · Refresh · Export · ColumnSelector; `#filters` → `Table.AppliedFilters`.
- [ ] Body scrolls internally: `min-h-0 flex-1` parent → `Card h-full` → `Table max-height="100%" class="h-full"` — the page doesn't scroll.
- [ ] Principal column names the **whole** (the unit a reader owns and opens), not an artifact inside it with a second column chipping that artifact's kind.
- [ ] Every name that leaves the screen is `Table.CellLink` (12px `pi-external-link`, a tooltip naming the destination, underline on hover, **no mark** without a destination); no hand-made copy.
- [ ] Only **one** chip per row, and a category chip is one `rounded` tag in one severity from a shared helper — branching colour is reserved for real status.
- [ ] Domain cell = `Table.CellLink` with `copyable` (and `more` for the other domains); copy buttons align across rows.
- [ ] In a 320 px box the rows stack into label/value cards (no `:stackable="false"` without a reason) and the toolbar wraps.
- [ ] Measured at a narrow viewport: **zero** cells where `scrollWidth > clientWidth` (catches a link wrapper that cannot shrink, which looks fine when wide).
- [ ] Every copyable ID or token is `Table.CellId`: text then a copy button pinned to the end, named after what it copies.
- [ ] "Last modified" cell = `Table.CellTime` (avatar + relative time in one column); no raw absolute date and no separate "Author" column beside it.
- [ ] Overflow is an `OverflowCount` (`+N` with summary, search past 7, Load more), or `Table.CellTags` for tags; never a wrapped inline list.
- [ ] Status via `Table.CellStatus :severity` from one shared helper, never a raw color; long text `truncate`s inside `min-w-0`.
- [ ] Row actions are `Table.CellActions :name` (trigger named after the row), destructive options in their own last group.
- [ ] A list whose rows change on their own: `Table.RefreshButton :loading` keeps the rows, an `Updated` time sits beside it, and auto-refresh follows the six refresh rules.
- [ ] Order that is data → `reorderable` + `v-model:data`; no sort offered on that table.
- [ ] Interactive controls in non-action cells use `@click.stop` when the table has `@row-click`.

## Related skills

- `/webkit-form` — form layout & accessibility (the create/edit view a table's "New" button opens).
- `/webkit-ui-states` — the loading / empty / error states a table must render.
- `/webkit-impeccable-polish` — final rhythm/alignment pass over the assembled table.
