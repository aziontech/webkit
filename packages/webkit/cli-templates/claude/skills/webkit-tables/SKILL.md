---
name: webkit-tables
description: Data tables on @aziontech/webkit — one data-driven <Table :data :columns row-key> with a column model (principal, grow, enableSorting, kind:'action', hideable) and a fixed toolbar (Filter · Search · RefreshButton · Export · ColumnSelector) + AppliedFilters, scrolling its body internally via the h-full/min-h-0 chain. Ships a fixed set of cell recipes so every table reads the same — principal name cell, Tag/status-severity cell (one chip per row, a category chip one rounded severity), actions Dropdown cell, copy-value cell, "+N" overflow Popover, a Last Modified cell (Avatar + relative time in one column), the cross-resource link (the name, a 12px pi-external-link, and a tooltip naming the destination) and the domain cell built from it, with its copy button pinned to the cell's right edge for common-width alignment. The tabular companion to /webkit-form and /webkit-ui-states.
status: active
last_updated: 2026-09-19
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
    :border="false"
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
- `paginated` + `:page-size` paginates client-side; `:border="false"` for a flush table inside a `CardBox`.

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

### Scroll the body internally — never the page

A full-height index scrolls its own **body** while the toolbar/header stay pinned. Do it with a height
chain, not a fixed pixel height:

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

<template #cell-status="{ value }">
  <Tag
    :label="value"
    :severity="value === 'Active' ? 'success' : 'secondary'"
    size="medium"
  />
</template>
```

### Cross-resource link — one name that leaves the screen

A name that opens **something other than this row** — the workload a deployment belongs to, the
function an instance runs, the site a domain serves — is the same component everywhere, in a table
cell and in a detail panel alike. Three rules, and each is a real bug when skipped:

1. **Every external mark says where it goes.** The glyph announces the name leaves; the **tooltip
   names what it leaves for**, so the reader decides before the click instead of after. In-app reads
   `Open <name> in <Module>`; off-app reads `Open <name> in a new tab`.
2. **The mark is a fixed 12px `pi-external-link`** (`text-body-xs leading-none shrink-0`) — never
   sized from the text around it. `text-[length:inherit]` inside a heading renders a heading-sized
   arrow, and `text-[0.85em]` is the same 12px written as a number nobody can grep for.
3. **No destination, no mark, no tooltip.** A glyph that leads nowhere is worse than no glyph, and a
   tooltip promising a destination on a name that opens nothing is worse than silence. That leg
   renders as plain truncating text.

Build it **once** as a shared component and compose it; do not re-type the markup per call site. It
drifts on every axis at once — glyph, icon size, underline-at-rest vs on-hover, and whether there is
a tooltip at all.

```vue
<!-- the shared component's body -->
<Tooltip :text="tooltipText" :disabled="!isLink" class="min-w-0 shrink!">
  <component
    :is="tag"
    :to="tag === 'router-link' ? to : undefined"
    :href="href || undefined"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
    class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline"
    @click.stop
  >
    <span
      class="truncate underline-offset-2"
      :class="isLink ? 'group-hover/link:underline' : ''"
      >{{ label }}</span
    >
    <span
      v-if="href"
      class="sr-only"
      >{{ ' (opens in a new tab)' }}</span
    >
    <i
      v-if="isLink"
      class="pi pi-external-link shrink-0 text-body-xs leading-none"
      aria-hidden="true"
    />
  </component>
</Tooltip>
```

- **Underline on hover, not at rest.** A list is mostly links; underlining all of them at rest turns
  the column into noise.
- **`@click.stop`** so opening the link never also fires the row's `@row-click`.
- **`sr-only` for the new-tab fact.** The tooltip is pointer- and focus-only, so the one thing a
  screen reader cannot otherwise learn is said in text. Bind the string (`{{ ' (…)' }}`) to keep its
  leading space — written as markup the formatter strips it and it runs into the name.
- **`shrink!` is load-bearing, not decoration.** `Tooltip`'s trigger wrapper is a flat
  `inline-flex w-fit shrink-0`, and a consumer class merges into it **by concatenation, not through
  `cn`** — so a plain `shrink` and the component's own `shrink-0` set the same property at the same
  specificity, and stylesheet order decides. Without the `!` the wrapper refuses to shrink in a flex
  cell, the name never reaches its `truncate`, and **the cell overflows instead**. This is silent:
  nothing errors, and at a wide viewport it looks correct. Measure it at a narrow one — assert zero
  cells where `scrollWidth > clientWidth`.

### Domain cell — the link above, copy button pinned to the cell's right edge

**The rule that fixes misalignment:** the copy button never sits flush against the domain text (its
x-position would then vary per row with the domain length). It is **pinned to the cell's right edge** with
`ml-auto shrink-0`, the link **truncates**, and the cell fills its column (`w-full`) — so every copy
button lines up vertically no matter how long the domain is.

```vue
<template #cell-domainName="{ value }">
  <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
    <ResourceLink
      :label="value"
      :href="`https://${value}`"
    />
    <CopyButton
      kind="outlined"
      :value="value"
      aria-label="Copy domain name"
      class="ml-auto shrink-0"
    />
  </div>
</template>
```

Extract this whole cell as a component too, and use it on **every** list that shows a domain. Four
lists having their own copy of it is how one of them ends up without the copy button — and the
copies are indistinguishable until you diff them.

Do **not**:

- put `CopyButton` immediately after the text with no `ml-auto` (the misalignment this recipe fixes);
- use `whitespace-nowrap` on the link instead of `truncate` (a long domain then shoves the button off);
- omit `@click.stop` on the link/button when the row has `@row-click` (the click would open the row).

### "+N" overflow cell — Popover, not a wrapped list

When a cell holds a primary value plus overflow (multiple domains, tags), show the primary + a `+N` `Tag`
that opens a `Popover` listing the rest. The `+N` tag is `shrink-0` and sits right after the primary;
copy (if any) still pins right.

```vue
<Popover v-if="row.domainCount" placement="bottom-start" width="medium">
  <Popover.Trigger @click.stop>
    <Tag :label="`+${row.domainCount}`" severity="secondary" size="small" class="shrink-0 cursor-pointer" />
  </Popover.Trigger>
  <Popover.Content @click.stop>
    <div class="flex max-h-(--container-xs) flex-col overflow-auto p-(--spacing-xxs)">
      <p class="px-(--spacing-xs) py-(--spacing-xxs) text-overline-sm text-(--text-muted)">
        {{ row.domains.length }} domains
      </p>
      <span v-for="d in row.domains" :key="d" class="truncate px-(--spacing-xs) py-(--spacing-xxs) text-body-sm">
        {{ d }}
      </span>
    </div>
  </Popover.Content>
</Popover>
```

### Copy-value cell — text + CopyButton at the end

Any cell that exposes a copyable value (token, ID, variable value) uses the same **text-then-copy** shape,
copy pinned to the right edge:

```vue
<template #cell-value="{ value }">
  <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
    <span class="min-w-0 truncate">{{ value }}</span>
    <CopyButton
      kind="outlined"
      :value="value"
      aria-label="Copy value"
      class="ml-auto shrink-0"
    />
  </div>
</template>
```

### Last Modified cell — Avatar + relative time (one column, not two)

A "Last Modified" / "Updated" / "Deployed" column shows **the modifier's `Avatar` + a relative timestamp**
("3 days ago", "2 min ago") — never a raw absolute date, and never a _separate_ "Last Modified By" /
"Author" column. The person is conveyed by the avatar (name on its `Tooltip`), so the two former columns
**fold into one**. Extract the recipe into your own small cell component so every table's time column is
identical:

```vue
<!-- your own LastModifiedCell — Avatar (tooltip = name) + relative time -->
<template #cell-lastModified="{ value, row }">
  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
    <Tooltip
      v-if="row.author"
      :text="row.author"
    >
      <Avatar
        :label="row.author"
        size="small"
      />
    </Tooltip>
    <span class="truncate text-body-sm text-(--text-muted)">{{ relativeTime(value) }}</span>
  </div>
</template>
```

- **`relativeTime(date)`** is a small formatter you own in your app — "just now" / "N min ago" /
  "N hours ago" / "N days ago" / "N weeks/months/years ago" (return `''` for empty/unparseable input so a
  missing date renders nothing). It is app logic, not a webkit component.
- **The avatar identifies the modifier**; the name (humanize an email: `maria.silva@azion.com` →
  `Maria Silva`) lives on the `Tooltip`, so there is no separate name column.
- Do **not**: render the raw absolute date; keep a separate "Last Modified By"/"Author" column beside this
  cell (two avatars per row).

### Actions cell — Dropdown + ellipsis IconButton

The trailing `kind:'action'` column renders a `Dropdown` triggered by an ellipsis `IconButton`. Group
destructive actions in their own `Dropdown.Group`.

```vue
<template #cell-actions="{ row }">
  <Dropdown
    placement="bottom-end"
    @select="(event, value) => onRowAction(event, value, row)"
  >
    <Dropdown.Trigger>
      <IconButton
        icon="pi pi-ellipsis-h"
        kind="outlined"
        size="small"
        aria-label="Row actions"
      />
    </Dropdown.Trigger>
    <Dropdown.Group>
      <Dropdown.Option
        value="view"
        label="View details"
      >
        <template #left
          ><i
            class="pi pi-eye"
            aria-hidden="true"
        /></template>
      </Dropdown.Option>
      <!-- edit, clone … -->
    </Dropdown.Group>
    <Dropdown.Group>
      <Dropdown.Option
        value="delete"
        label="Delete"
      >
        <template #left
          ><i
            class="pi pi-trash"
            aria-hidden="true"
        /></template>
      </Dropdown.Option>
    </Dropdown.Group>
  </Dropdown>
</template>
```

`@select` follows the webkit event contract `(event, value)` — event first, value second. The in-cell
`IconButton` is inside the action column, so it doesn't need `@click.stop`; any interactive control in a
**non-action** cell of a row-clickable table does (`@click.stop`).

## Checklist

- [ ] Table is data-driven: `:data` + `:columns` + `row-key`, rows via `#cell-<key>` — no hand-built `<tr>`.
- [ ] Exactly one `principal: true` column; the actions column is `{ kind: 'action', hideable: false }`.
- [ ] `grow: N` on long columns (repository, domain, timestamps); no fixed pixel widths.
- [ ] Toolbar order: Filter · Search (`flex-1`) · Refresh · Export · ColumnSelector; `#filters` → `Table.AppliedFilters`.
- [ ] Body scrolls internally: `min-h-0 flex-1` parent → `CardBox h-full` → `Table max-height="100%" class="h-full"` — the page doesn't scroll.
- [ ] Principal column names the **whole** (the unit a reader owns and opens), not an artifact inside it with a second column chipping that artifact's kind.
- [ ] Every name that leaves the screen uses the one shared cross-resource link: 12px `pi-external-link`, a tooltip naming the destination, underline on hover, and **no mark at all** when there is no destination.
- [ ] Only **one** chip per row, and a category chip is one `rounded` tag in one severity from a shared helper — branching colour is reserved for real status.
- [ ] Domain cell = the shared link + `CopyButton` with `ml-auto shrink-0`; cell `w-full`. Copy buttons align across rows.
- [ ] Measured at a narrow viewport: **zero** cells where `scrollWidth > clientWidth` (catches a link wrapper that cannot shrink, which looks fine when wide).
- [ ] Every copyable cell uses text-then-copy with the copy button pinned right (`ml-auto shrink-0`), never flush against the text.
- [ ] "Last Modified" cell = `Avatar` + relative time in one column, name on the avatar tooltip; no raw absolute date and no separate "Last Modified By"/"Author" column beside it.
- [ ] Overflow shown as a `+N` `Tag` opening a `Popover`, not a wrapped inline list.
- [ ] Status via `Tag :severity`, never a raw color; long text `truncate`s inside `min-w-0`.
- [ ] Interactive controls in non-action cells use `@click.stop` when the table has `@row-click`.

## Related skills

- `/webkit-form` — form layout & accessibility (the create/edit view a table's "New" button opens).
- `/webkit-ui-states` — the loading / empty / error states a table must render.
- `/webkit-impeccable-polish` — final rhythm/alignment pass over the assembled table.
