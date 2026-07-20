---
name: tables
description: Data tables on @aziontech/webkit — one data-driven <Table :data :columns row-key> with a column model (principal, grow, enableSorting, kind:'action', hideable) and a fixed toolbar (Filter · Search · RefreshButton · Export · ColumnSelector) + AppliedFilters, scrolling its body internally via the h-full/min-h-0 chain. Ships a fixed set of cell recipes so every table reads the same: principal name cell, Tag/chip cell, status-severity cell, actions Dropdown cell, copy-value cell, "+N" overflow Popover, the Last Modified cell (avatar + relative time — one column, name on the avatar tooltip, no separate author column), and the canonical domain cell (link + external arrow, copy button pinned to the cell's right edge for common-width alignment). The tabular companion to /form (forms) and /ux-heuristics (states).
status: active
last_updated: 2026-07-20
---

# Skill: tables

## Purpose

A table is where a product shows the most data with the least room, so it is where inconsistency shows
most: one table right-pins its actions and another left-floats them, one domain cell puts a copy button
flush against the text so it lands at a different x on every row, one table overflows the page instead of
scrolling its own body. This skill fixes the **structure** of a data table built on `@aziontech/webkit`
(`@aziontech/webkit/table`) and the **cell recipes** it composes, so every table in the app reads the
same and every recurring cell type (name, status, domain, actions, copy) looks identical across screens.

It is the tabular companion to `/form` (which owns form layout) and `/ux-heuristics` (which owns the
loading / empty / error states a table must render). This skill owns **the Table setup, the column
model, the toolbar, internal scroll, and the cell recipes** — including the aligned domain cell.

The canonical, richest reference in this app is
[`components/Applications.vue`](../../../src/components/Applications.vue); the other domain tables are
[`components/Workloads.vue`](../../../src/components/Workloads.vue) and
[`components/Dashboard.vue`](../../../src/components/Dashboard.vue).

## How to use

- `/tables`
  Apply the structure + cell recipes below to any table you build in this conversation.
- `/tables <file>`
  Review the file's table against the patterns and output, per gap:
  - the exact line / element (quoted),
  - which pattern it breaks (1 short sentence),
  - the concrete fix, naming the webkit component to use.

## When to invoke

- Building or reviewing any list/index page, resource table, or any `<Table>` with cell slots.
- The user asks "the copy button is misaligned", "how do I lay out this cell", "the table overflows the
  page", "which toolbar controls", "how do actions/status/domain cells look".
- After `/ux-heuristics` establishes the empty/loading/error states and before `/impeccable-polish`.

## The Table — data-driven, one shape

Tables are **data-driven**, not hand-authored rows: pass `:data` + `:columns` and render each column
through a `#cell-<accessorKey>` slot. Never build `<tr>`/`<td>` by hand.

```vue
<Table
  :data="applications"
  :columns="columns"
  :filter-fields="filterFields"
  row-key="id"
  enable-sorting
  paginated
  :page-size="8"
  :border="false"
  max-height="100%"
  class="h-full"
  @row-click="openApp"
>
  <!-- toolbar · filters · #cell-* slots -->
</Table>
```

- `row-key` is the stable id accessor; `@row-click` opens the detail view (see the `@click.stop`
  discipline below so cell controls don't trigger it).
- `enable-sorting` + per-column `enableSorting: true` turns on the sort affordance for that column.
- `paginated` + `:page-size` paginates client-side; `:border="false"` for a flush table inside a
  `CardBox`.

### Column model

One flat `columns` array. Each column is `{ accessorKey, header }` plus the options it needs:

```js
const columns = [
  { accessorKey: "name", header: "Name", enableSorting: true, principal: true },
  { accessorKey: "repository", header: "Repository", grow: 2 },
  { accessorKey: "id", header: "ID", enableSorting: true },
  { accessorKey: "domainName", header: "Domain Name", grow: 3 },
  { accessorKey: "status", header: "Status", enableSorting: true },
  { accessorKey: "lastModified", header: "Last Modified", enableSorting: true, grow: 2 },
  { id: "actions", kind: "action", hideable: false }, // auto-pinned to the right edge
];
```

- **`principal: true`** marks the emphasized identity column (the name) — one per table.
- **`grow: N`** gives a flexible column a larger share of the width (default share is `1`). Use it for
  columns whose content is long (repository, domain, timestamps).
- **`kind: "action"`** is the trailing actions column; it auto-pins to the right edge. Pair with
  `hideable: false` so the column selector can't hide it.
- **`enableSorting: true`** per sortable column (with `enable-sorting` on the root).

### Toolbar + applied filters

The toolbar is a fixed, ordered set of compound `Table.*` controls in the `#toolbar` slot, and the
applied-filter chips render in `#filters` via `Table.AppliedFilters`. `filterFields` (`{ id, label,
type, options? }`) drives the `Table.Filter` builder.

```vue
<template #toolbar>
  <div class="flex w-full items-center gap-[var(--spacing-xs)]">
    <Table.Filter :fields="filterFields" />
    <Table.Search size="large" placeholder="Search..." class="flex-1" />
    <Table.RefreshButton />
    <Table.Export />
    <Table.ColumnSelector />
  </div>
</template>

<template #filters>
  <Table.AppliedFilters />
</template>
```

Order left→right: **Filter · Search (flex-1) · Refresh · Export · ColumnSelector**. `Table.Search`
drives the global filter through the injected table context — it takes no `v-model` (compound API).

### Scroll the body internally — never the page

A full-height index scrolls its own **body** while the toolbar/header stay pinned. Do it with a
height chain, not a fixed pixel height:

```vue
<section class="flex min-h-0 flex-1 flex-col">
  <CardBox :padded="false" class="h-full">
    <template #content>
      <Table … max-height="100%" class="h-full">…</Table>
    </template>
  </CardBox>
</section>
```

`min-h-0` on the flex parent (so it can shrink), `h-full` down the chain (`CardBox` → `Table`), and
`max-height="100%"` on the `Table` — the body scrolls inside, the toolbar and column headers don't move.

## Cell recipes

Render each column with `#cell-<accessorKey>` (`#cell-actions` for the action column). Reuse these
recipes verbatim so a cell type looks identical across every table.

### Principal / name cell — icon + truncate + hover-underline

```vue
<template #cell-name="{ value, row }">
  <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
    <i :class="`ai-cor ${presetIcon(row.preset)}`" class="shrink-0 text-[1.15em]" aria-hidden="true" />
    <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
  </div>
</template>
```

`min-w-0` on the wrapper + `truncate` on the label so a long name ellipsizes instead of overflowing;
the leading glyph is `shrink-0`.

### Tag / chip cell + status-severity cell

Use `Tag` for a chip; for status, map the value to a semantic `severity` (never a raw color).

```vue
<template #cell-repository="{ value }">
  <Tag severity="secondary" size="medium" icon="pi pi-github" rounded class="max-w-full">
    <span class="min-w-0 truncate">{{ value }}</span>
  </Tag>
</template>

<template #cell-status="{ value }">
  <Tag :label="value" :severity="value === 'Active' ? 'success' : 'secondary'" size="medium" />
</template>
```

### Domain cell — link + arrow, copy button pinned to the cell's right edge

**The rule that fixes misalignment:** the copy button never sits flush against the domain text (its
x-position would then vary per row with the domain length). It is **pinned to the cell's right edge**
with `ml-auto shrink-0`, the domain link **truncates** (`min-w-0` + inner `truncate`), and the cell
fills its column (`w-full`) — so every copy button lines up vertically no matter how long the domain is.

```vue
<template #cell-domainName="{ value }">
  <!-- Domain link (truncates) + external-redirect arrow; copy button pinned right so it aligns across rows. -->
  <div class="flex w-full min-w-0 items-center gap-[var(--spacing-xs)]">
    <a
      :href="`https://${value}`"
      target="_blank"
      rel="noopener noreferrer"
      class="flex min-w-0 items-center gap-[var(--spacing-xxs)] hover:underline"
      @click.stop
    >
      <span class="truncate">{{ value }}</span>
      <i class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
    </a>
    <CopyButton kind="outlined" :value="value" aria-label="Copy domain name" class="ml-auto shrink-0" />
  </div>
</template>
```

The three tables use exactly this:

- [`Applications.vue`](../../../src/components/Applications.vue) — single domain (`#cell-domainName`).
- [`Dashboard.vue`](../../../src/components/Dashboard.vue) — same, in the resources table (`#cell-domain`).
- [`Workloads.vue`](../../../src/components/Workloads.vue) — same, plus a `+N` overflow Popover **between**
  the link and the copy button; the copy button still `ml-auto`s to the right edge.

Do **not**:

- put `CopyButton` immediately after the text with no `ml-auto` (the disalignment this recipe fixes);
- use `whitespace-nowrap` on the link instead of `truncate` (a long domain then shoves the button off);
- omit `@click.stop` on the link/button when the row has `@row-click` (the click would open the row).

### "+N" overflow cell — Popover, not a wrapped list

When a cell holds a primary value plus overflow (multiple domains, tags), show the primary + a `+N`
`Tag` that opens a `Popover` listing the rest. The `+N` tag is `shrink-0` and sits right after the
primary; copy (if any) still pins right.

```vue
<Popover v-if="row.domainCount" placement="bottom-start" width="medium">
  <Popover.Trigger @click.stop>
    <Tag :label="`+${row.domainCount}`" severity="secondary" size="small" class="shrink-0 cursor-pointer" />
  </Popover.Trigger>
  <Popover.Content @click.stop>
    <div class="flex max-h-[var(--container-xs)] flex-col overflow-auto p-[var(--spacing-xxs)]">
      <p class="px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-overline-sm text-[var(--text-muted)]">
        {{ row.domains.length }} domains
      </p>
      <span v-for="d in row.domains" :key="d" class="truncate px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-body-sm">
        {{ d }}
      </span>
    </div>
  </Popover.Content>
</Popover>
```

### Copy-value cell — text + CopyButton at the end

Any cell that exposes a copyable value (token, ID, variable value) uses the same **text-then-copy**
shape, copy pinned to the right edge:

```vue
<template #cell-value="{ value }">
  <div class="flex w-full min-w-0 items-center gap-[var(--spacing-xs)]">
    <span class="min-w-0 truncate">{{ value }}</span>
    <CopyButton kind="outlined" :value="value" aria-label="Copy value" class="ml-auto shrink-0" />
  </div>
</template>
```

### Last Modified cell — avatar + relative time (one column, not two)

A "Last Modified" / "Updated" / "Deployed" column shows **the modifier's avatar + a relative
timestamp** ("3 days ago", "2 min ago") — never a raw absolute date, and never a *separate* "Last
Modified By" / "Author" column. The person is conveyed by the avatar (name on its tooltip), so the two
former columns **fold into one**. This keeps every table's time column identical and removes the
duplicate-avatar-per-row problem.

The app wraps the recipe as [`ui/LastModifiedCell.vue`](../../../src/components/ui/LastModifiedCell.vue),
backed by the relative-time formatter [`lib/relative-time.js`](../../../src/lib/relative-time.js):

```vue
<!-- ui/LastModifiedCell.vue — avatar (tooltip = name) + relative time -->
<div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
  <Tooltip v-if="displayName" :text="displayName">
    <Avatar :label="displayName" size="small" />
  </Tooltip>
  <span class="truncate text-body-sm text-[var(--text-muted)]">{{ relative }}</span>
</div>
```

```vue
<!-- In the table: pass the row's modifier + timestamp -->
<template #cell-lastModified="{ value, row }">
  <LastModifiedCell :author="row.author" :date="value" />
</template>
```

- **`relativeTime(date)`** ([`lib/relative-time.js`](../../../src/lib/relative-time.js)) turns an absolute
  timestamp into "just now" / "N min ago" / "N hours ago" / "N days ago" / "N weeks/months/years ago"
  (returns `""` for empty/unparseable input, so a missing date renders nothing).
- **The avatar identifies the modifier**; the name (from `owner` / `author` / `lastEditor`, an email is
  humanized: `maria.silva@azion.com` → `Maria Silva`) lives on the `Tooltip`, so no separate name column.
- Used by `Applications`, `Workloads`, `Variables`, `Dashboard`, and `WorkloadDetail` (deployments). In
  `Workloads`/`WorkloadDetail`/`Variables` the old `owner`/`author`/`lastEditor` column was **removed** and
  folded here.

Do **not**: render the raw absolute date; keep a separate "Last Modified By"/"Author" column beside this
cell (two avatars per row); or hand-roll a per-table avatar+`<span>` when `LastModifiedCell` exists.

### Actions cell — Dropdown + ellipsis IconButton

The trailing `kind:'action'` column renders a `Dropdown` triggered by an ellipsis `IconButton`.
Group destructive actions in their own `Dropdown.Group`.

```vue
<template #cell-actions="{ row }">
  <Dropdown placement="bottom-end" @select="(event, value) => onRowAction(event, value, row)">
    <Dropdown.Trigger>
      <IconButton icon="pi pi-ellipsis-h" kind="outlined" size="small" aria-label="Row actions" />
    </Dropdown.Trigger>
    <Dropdown.Group>
      <Dropdown.Option value="view" label="View details">
        <template #left><i class="pi pi-eye" aria-hidden="true" /></template>
      </Dropdown.Option>
      <!-- edit, clone … -->
    </Dropdown.Group>
    <Dropdown.Group>
      <Dropdown.Option value="delete" label="Delete">
        <template #left><i class="pi pi-trash" aria-hidden="true" /></template>
      </Dropdown.Option>
    </Dropdown.Group>
  </Dropdown>
</template>
```

`@select` follows the webkit event contract `(event, value)` — event first, value second. The
in-cell IconButton is inside the action column, so it doesn't need `@click.stop`; any interactive
control in a **non-action** cell of a row-clickable table does (`@click.stop`).

## Checklist

- [ ] Table is data-driven: `:data` + `:columns` + `row-key`, rows via `#cell-<key>` — no hand-built `<tr>`.
- [ ] Exactly one `principal: true` column; the actions column is `{ kind: 'action', hideable: false }`.
- [ ] `grow: N` on long columns (repository, domain, timestamps); no fixed pixel widths.
- [ ] Toolbar order: Filter · Search (`flex-1`) · Refresh · Export · ColumnSelector; `#filters` → `Table.AppliedFilters`.
- [ ] Body scrolls internally: `min-h-0 flex-1` parent → `CardBox h-full` → `Table max-height="100%" class="h-full"` — the page doesn't scroll.
- [ ] Domain cell = link + arrow + `CopyButton` with `ml-auto shrink-0`; link `min-w-0` + `truncate`; cell `w-full`. Copy buttons align across rows.
- [ ] Every copyable cell uses text-then-copy with the copy button pinned right (`ml-auto shrink-0`), never flush against the text.
- [ ] "Last Modified" cell = `LastModifiedCell` (avatar + relative time via `relativeTime`), name on the avatar tooltip; no raw absolute date and no separate "Last Modified By"/"Author" column beside it.
- [ ] Overflow shown as a `+N` `Tag` opening a `Popover`, not a wrapped inline list.
- [ ] Status via `Tag :severity`, never a raw color; long text `truncate`s inside `min-w-0`.
- [ ] Interactive controls in non-action cells use `@click.stop` when the table has `@row-click`.

## Related skills

- `/form` — form layout & accessibility (the create/edit page a table's "New" button opens).
- `/ux-heuristics` — the loading / empty / error states a table must render.
- `/usability` — locking + toast feedback for row actions that hit an API.
- `/impeccable-polish` — final rhythm/alignment pass over the assembled table.
