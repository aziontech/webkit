# Table view

The first-level index of one resource type. The user lands here from the sidebar to find a resource among many, narrow the list by its attributes, scan its state at a glance and act on it: open it, deploy it, clone it, delete it, or create a new one. Search, filters, columns, refresh and export all act on the same table, so the page is one heading over one band.

## When to use

- The module the sidebar routes to lists resources of one type (applications, workloads, users, tokens, environments, activity history).
- Users compare many records by a few attributes (status, owner, last change) and need to sort, search and filter them.
- The list must survive its last row being deleted: the page keeps its heading and controls and the table gives way to an empty state.

## When not to use

- A list nested inside one resource (a tab of a details page): use the table inside `platform/detail/details-page` or `platform/detail/record-table`, with `Add <Module>` instead of `Create`.
- Files and folders of a storage resource: use `platform/view/file-browser`.
- Events or logs explored over time with a chart and a document pane: use `platform/view/split-view`.
- An account that has never created the resource: use `platform/states/first-use`, which teaches the module before any list exists.
- Choosing one existing resource inside a form: use `platform/create/resource-picker`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

`PageHeader` at `size="medium"` carries the module name as the title and one sentence of purpose as the description. Its actions slot holds the outlined Documentation button and the primary `Create <Object>` button, the page's only large control. On a phone the actions stack below the copy at full width. At first level this heading is the only place the module name appears; the breadcrumb starts at the second level.

### B. Filter popover — `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `Badge`, `IconButton`, `CalendarRoot`, `Avatar` (optional)

The outlined Filter button opens one popover with a field list on the first page and the values of the chosen field on the second. A `Badge` on the trigger counts applied fields, not values. Date fields offer presets plus a `CalendarRoot` range; people fields show an `Avatar` per option. Filters narrow `:data` outside the table and rewind pagination to the first page. A free-text column gets no field: search covers it.

### C. Search — `Input` (required)

A medium `Input` with a search icon, a placeholder and a matching `aria-label`. It is bound to the table's `v-model:globalFilter`, so it searches inside the table, never through a filter field.

### D. Toolbar actions — `Tooltip`, `IconButton` (optional)

Outlined medium `IconButton`s for Refresh (puts the table in its loading state) and Download CSV (`exportCsv` on the table ref), each named by a `Tooltip` and an `aria-label`. They act on the listing, not on one row.

### E. Columns panel — `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `Switch`, `Button` (optional)

A Columns `IconButton` opens a popover with one `Switch` per hideable column bound to `v-model:columnVisibility`, and a Show all columns `Button`. The name and actions columns are not hideable.

### F. Applied filters — `Chip`, `Avatar` (optional)

One wrapping row of `Chip`s under the controls, in field-catalog order, one per applied field. Each chip summarizes its values (avatars for people, `+N` for the rest), reopens the popover on its field and can be removed. The row wraps; it never scrolls sideways.

### G. Resource table — `Card`, `TableRoot` (required)

`Card :padded="false"` around `TableRoot :bordered="false"` with `row-key`, sorting, `paginated` at 10 rows and `:loading`. The name column is `principal` and not hideable; the actions column is `kind: 'action'`. Below the container width the rows stack into label and value cards instead of scrolling sideways.

### H. Cell recipes — `CopyButton`, `Tag`, `Tooltip`, `Avatar`, `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `Input`, `Skeleton`, `Button` (optional)

The name cell pairs the resource glyph with a truncated, underline-on-hover name. ID and domain cells end with a `CopyButton`. Status is a `Tag`. A list value shows its first item and a `+N` `Tag` that opens a popover with its own search, a `Skeleton` while more load and a Load more `Button`. Last Modified pairs the author `Avatar`, named in a `Tooltip`, with the relative time in one column.

### I. Row actions — `DropdownMenuRoot`, `DropdownMenuTrigger`, `DropdownMenuGroup`, `DropdownMenuOption`, `IconButton` (required)

An ellipsis `IconButton` named Row actions opens a menu placed `bottom-end`: the everyday actions (Deploy, View details, Clone) in one group, Delete alone in the last group.

### J. Empty listing — `EmptyState`, `Button` (required)

The table's `#empty` slot holds a medium `EmptyState` with the resource glyph, one sentence and two small buttons: the secondary `Create <Object>`, with the same label as the heading's create action, and an outlined Docs.

## Do

- Keep the controls row, the filter chips and the table in one band at the group gap; the heading sits one section step above.
- Bind search to `v-model:globalFilter` and filters to `:data`, and rewind `pageIndex` to 0 when either changes.
- Keep the create action in the heading, large and primary, and every control in the toolbar medium.
- Give every icon-only control a `Tooltip` and an `aria-label` with the same words.
- Put Delete last in the row menu, in its own group.
- Keep the heading and controls when the list empties, so the user can clear a filter or create again.

## Don't

- Don't put a row of `Select`s above the table or hide filters behind several buttons; one Filter popover and one chip row.
- Don't wrap a bordered table in a padded card, or let the page scroll sideways for a wide table.
- Don't add a second primary action to the heading, or a create button inside the toolbar.
- Don't float applied chips to the front; they keep the field order.
- Don't replace the heading and controls with a full-page empty state when the rows run out; only the table area changes.

## Copy

- **Title:** the module name as the sidebar shows it, e.g. "Workloads". Description: one sentence with a period, e.g. "View and manage your workloads."
- **Create action:** `Create <Object>` with the entity's capitalization, e.g. "Create Workload"; never "New" or a bare noun. The empty state repeats the same label.
- **Search:** placeholder and `aria-label` name what is searched, e.g. "Search workloads".
- **Icon buttons:** a verb or noun in sentence case, e.g. "Refresh", "Download CSV", "Columns", "Row actions".
- **Column headers:** short fragments without punctuation, e.g. "Name", "Status", "Domains", "Last Modified".
- **Empty state:** title states the fact, e.g. "No workloads yet"; description is one sentence with what to do, e.g. "Create a workload to start serving traffic on your domains."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- One `main` landmark; the `PageHeader` title is the page's only `h1`.
- Every icon-only button has an `aria-label`; decorative icons carry `aria-hidden="true"`; the filter `Badge` is hidden from assistive technology because the trigger label carries the count.
- Search has an `aria-label` that matches its placeholder; placeholder text is never the only label.
- Focus order follows reading order: heading actions, Filter, search, Refresh, Download CSV, Columns, chips, table, pagination.
- Sorting is announced by the table header; the row menu is reachable by keyboard and closes back to its trigger.
- Copy buttons announce what they copied, e.g. "Copy resource ID".

## States

- Default: resources exist; the table shows them with search, filters, columns, refresh and export wired.
- Empty: every resource was deleted on an account that is not new; the heading and controls stay and the table shows the empty listing with Create and Docs.

## Related

- `platform/create/single-page-create` — where the Create action leads for a short form.
- `platform/create/create-in-drawer` — create without leaving the list when the form is three fields or fewer.
- `platform/detail/details-page` — where a row name leads.
- `platform/delete/delete-with-confirmation` — the dialog behind the row menu's Delete.
- `platform/states/first-use` — the module before its first resource.
- `TableRoot` — the data-driven table this page wraps; see `skills/webkit-tables`.
