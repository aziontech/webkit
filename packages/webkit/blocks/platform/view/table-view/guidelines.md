# Table view

The first-level index of one resource type, in rows. The user lands here from the sidebar to find a resource among many, narrow the list by its attributes, compare records column by column, and act on one: open it, deploy it, clone it, delete it, or create a new one. One `useCollection` call holds the filter, the sort, the page and the saved preferences, so the page is one heading over one band: the controls row and the table it narrows.

## When to use

- The module the sidebar routes to lists resources of one type (applications, workloads, users, tokens, environments, activity history).
- Users compare many records by the same few attributes (status, domain, owner, last change) and need to sort, filter and page through them.
- The filtered list must survive a reload or a shared link, and each person's page size and columns must survive the next visit.
- The list must survive its last row being deleted: the page keeps its heading and controls and the table gives way to an empty state.

## When not to use

- Resources people recognise by a few fields or a picture rather than compare column by column: use `platform/view/card-view`.
- A list nested inside one resource (a tab of a details page): use the table inside `platform/detail/details-page` or `platform/detail/record-table`, with `Add <Module>` instead of `Create`.
- Files and folders of a storage resource: use `platform/view/file-browser`.
- Events or logs explored over time with a chart and a document pane: use `platform/view/split-view`.
- An account that has never created the resource: use `platform/states/first-use`, which teaches the module before any list exists.
- Choosing one existing resource inside a form: use `platform/create/resource-picker`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

`PageHeader` at its medium size carries the module name as the title and one sentence of purpose as the description. Its actions slot holds the outlined medium Documentation button, which opens the docs in a new tab, and the primary `Create <Object>` button at `size="large"`, the page's only large control, as `skills/webkit-lists` asks; everything on the controls row stays medium. On a phone the actions stack below the copy at full width. At first level this heading is the only place the module name appears; the breadcrumb starts at the second level.

### B. Property filter — `PropertyFilter` (required)

One `PropertyFilter` bound with `v-bind="propertyFilterProps"` grows to fill the controls row. Typing suggests a property, then an operator, then a value, and each choice becomes a removable token (`Status = Live`); text typed without a property is a free-text token over the `filtering.fields` (name, ID, domain, owner, status). Enumerable columns (Status, Author) are properties with `options`; free-text columns people name (Name, Domain) are plain properties. Two tokens or more offer Match all or Match any; the row ends on Clear filters and the match count. Every change rewinds to the first page. It replaces the search field, the filter popover, the chip row and any row of `Select`s.

### C. Listing actions — `Tooltip`, `IconButton` (optional)

Beside the filter, outlined medium `IconButton`s for Refresh (the button and the table show their loading state) and Download CSV (every matching row across all pages, not only the visible page; disabled when nothing matches), each named by a `Tooltip` and an `aria-label` with the same words. They act on the listing, never on one row.

### D. Table preferences — `CollectionPreferences` (required)

The last control of the row. `CollectionPreferences` bound with `v-bind="preferencesProps"` opens a dialog that edits a draft and applies it on Confirm: the page size (10, 25, 50), the columns (shown, hidden and reordered), wrapped lines, striped rows and density. The Name and actions columns are `hideable: false`, so the panel locks them. `preferences.storageKey` saves the choice in localStorage per list; `defaults.columns` hides the ID column until someone shows it.

### E. Resource table — `Card`, `TableRoot` (required)

`Card :padded="false"` around `TableRoot :bordered="false"` bound with `v-bind="tableProps"`, which hands it one page of rows, the ordered and visible columns, the sort, the pagination footer, density, wrap and stripes; the table renders and never filters or slices on its own. `enable-sorting` makes Name, Status and Last Modified sortable; `:loading` joins Refresh with the collection's own fetch. The Name column is `principal`; the actions column is `kind: 'action'`. Below the container width the rows stack into label and value cards instead of scrolling sideways.

### F. Cell recipes — `CopyButton`, `Tag`, `Tooltip`, `Avatar`, `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `Input`, `Skeleton`, `Button` (optional)

The name cell pairs the resource glyph with a truncated, underline-on-hover name. ID and domain cells end with a `CopyButton`. The domain is a link that opens in a new tab, named by a `Tooltip`; a resource with more domains adds a `+N` `Tag` that opens a popover with its own count, a search `Input` past ten domains, a `Skeleton` per row while more load and a Load more `Button`. Status is a `Tag`. Last Modified pairs the author `Avatar`, named in a `Tooltip`, with the relative time in one column.

### G. Row actions — `DropdownMenuRoot`, `DropdownMenuTrigger`, `DropdownMenuGroup`, `DropdownMenuOption`, `IconButton`, `Tooltip` (required)

An ellipsis `IconButton` named Row actions opens a menu placed `bottom-end`: the everyday actions (Deploy, View details, Clone) in one group, Delete alone in the last group. The root's `select` event hands the option value and the row to the page; Delete opens the confirmation below.

### H. Delete confirmation — `ConfirmDialog`, `Alert`, `Input` (required)

The `platform/delete/delete-with-confirmation` dialog, opened from the row menu without a trigger of its own: a medium `ConfirmDialog` titled `Delete resource`, a warning `Alert` (`Once confirmed, this action can't be reversed.`), one sentence of consequence, and an `Input` labelled by `Type <name> to confirm.` The danger `Delete resource` enables only when the typed text matches the row's name; confirming removes the row. The typed text resets each time the dialog opens.

### I. No matching resources — `EmptyState`, `Button` (required)

When `status` is `no-match`, the table's `#empty` slot holds a medium `EmptyState` with the filter-slash glyph, "No matching resources", one sentence, and an outlined small Clear filters `Button` bound to `clearFilters`. The heading, the filter tokens and the table header stay, so the user can see and undo what hid the rows.

### J. Empty listing — `Card`, `EmptyState`, `Button` (required)

When `status` is `empty`, the table and its header and footer give way to a flush `Card :padded="false"` holding only a medium `EmptyState`: the resource glyph, one sentence, then a small secondary `Create <Object>` with the heading's label and a small outlined Documentation on one row.

## Do

- Run the whole list on one `useCollection` call and bind its props with `v-bind`; let it own the filter, sort, page and preferences.
- Keep the controls row and the table in one band at the group gap; the heading sits one section step above.
- Set `url: true` so the tokens, the sort and the page live in the query string and a filtered list can be shared or reloaded.
- Give the list a `storageKey` of its own and lock the column that names the row.
- Keep `CollectionPreferences` the last control of the row and every control on it medium.
- Branch on `status`: `empty` swaps the table for the empty listing, `no-match` fills the table's `#empty` slot with Clear filters.
- Give every icon-only control a `Tooltip` and an `aria-label` with the same words.
- Put Delete last in the row menu, in its own group, and always behind the confirmation dialog.

## Don't

- Don't add a search `Input`, a filter popover, a chip row or a row of `Select`s beside the `PropertyFilter`; one control narrows the list.
- Don't filter, sort or page rows in a `computed` outside the collection, or pass `:data`, `paginated` and `v-model:globalFilter` by hand beside `tableProps`.
- Don't build a columns popover of `Switch`es; column visibility and order belong to `CollectionPreferences`.
- Don't wrap a bordered table in a padded card, or let the page scroll sideways for a wide table.
- Don't add a second create button to the controls row.
- Don't show the first-use empty state when filters hide every row, or Clear filters when the account has none.
- Don't replace the heading and controls with a full-page empty state when the rows run out; only the table area changes.

## Copy

- **Title:** the module name as the sidebar shows it, e.g. "Resources". Description: one sentence with a period, e.g. "View and manage your resources."
- **Create action:** `Create <Object>` with the entity's capitalization, e.g. "Create Resource"; never "New" or a bare noun. The empty state repeats the same label.
- **Filter:** placeholder and `aria-label` name what is filtered, e.g. "Filter resources".
- **Properties:** the column header's words, e.g. "Name", "Author", "Status", "Domain".
- **Icon buttons:** a verb or noun in sentence case, e.g. "Refresh", "Download CSV", "Row actions". Preferences title: "Table preferences".
- **Column headers:** one or two words without punctuation, e.g. "Name", "ID", "Domains", "Status", "Last Modified".
- **No match:** "No matching resources", then "No resource matches these filters.", and the action "Clear filters".
- **Empty:** title states the fact, e.g. "No resources yet"; description is one sentence with what to do, e.g. "Create a resource to start serving traffic on your domains."
- **Copy buttons:** name what they copy, e.g. "Copy resource ID", "Copy domain name".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- One `main` landmark; the `PageHeader` title is the page's only `h1`.
- The `PropertyFilter` has an `aria-label` that matches its placeholder; each token's remove button names the token, and the match count is announced after each change.
- Every icon-only button has an `aria-label`; decorative icons carry `aria-hidden="true"`.
- Focus order follows reading order: heading actions, filter, Refresh, Download CSV, Preferences, table, pagination.
- The delete dialog traps focus, is named by its title and labels its input by the prompt.
- The preferences dialog traps focus, is named by its title and returns focus to its trigger when it closes.
- Sorting is announced by the table header; the row menu is reachable by keyboard and closes back to its trigger.
- Links that open a new tab add "(opens in a new tab)" in visually hidden text; the domain popover announces its count and its loading in a `status` region.

## States

- Default: resources exist; the table shows them with the property filter, refresh, export, preferences, sorting and pagination wired, and filtering to nothing shows No matching resources with Clear filters.
- Empty: every resource was deleted on an account that is not new; `useCollection` reports `empty`, the heading and controls stay, and a flush card with Create Resource and Documentation replaces the table.

## Related

- `platform/view/card-view` — the same collection, rendered as selectable cards.
- `platform/create/single-page-create` — where the Create action leads for a short form.
- `platform/create/create-in-drawer` — create without leaving the list when the form is three fields or fewer.
- `platform/detail/details-page` — where a row name leads.
- `platform/delete/delete-with-confirmation` — the dialog behind the row menu's Delete.
- `platform/states/first-use` — the module before its first resource.
- `TableRoot` and `useCollection` — the table this page wraps and the state behind it; see `skills/webkit-tables` and `skills/webkit-lists`.
