# File browser

The contents of one storage resource. The user opens a bucket to find a file, walk into a folder and back out, upload something or add a folder, and download or delete what is there. The table's toolbar is the whole page header, so the storage name, search, the folder path and Add to files all sit on the one surface the files live on.

## When to use

- A storage resource (an Object Storage bucket, a build output) opens on its files and folders.
- Users move through a folder tree and need to know where they are and how to go back up.
- Files are compared by name, size and last change, and acted on one at a time: open, download, delete.

## When not to use

- A first-level list of resources of one type: use `platform/view/table-view`.
- Rows of one resource that are records, not files (database rows, variables): use `platform/detail/record-table`.
- Events or logs explored over time: use `platform/view/split-view`.
- Tables and queries of a database: use `platform/view/query-editor`.
- Picking an existing resource inside a create form: use `platform/create/resource-picker`.

## Building blocks

### A. Surface — `Card`, `TableRoot` (required)

One `Card :padded="false"` around a `TableRoot :bordered="false"` with `row-key`, `enable-sorting`, `:loading`, `v-model:columnVisibility` and an `export-filename`. Name is the `principal` column; actions are `kind: 'action'` and not hideable. Everything above the rows lives in the table's `#toolbar` slot, so there is no separate page heading.

### B. Storage title and search — `TableSearch` (required)

The toolbar opens with the storage glyph and the storage name, truncated on one line. Below it a large `TableSearch` fills the row, searching inside the table with the placeholder "Search in folder"; it searches the current folder, not the whole bucket.

### C. Toolbar actions — `Tooltip`, `IconButton` (optional)

Large outlined `IconButton`s for Refresh (`:loading` while the listing reloads) and Download CSV (`exportCsv` on the table ref), each named by a `Tooltip` and an `aria-label` with the same words. They sit on the search row and act on the listing.

### D. Columns panel — `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `Switch`, `Button` (optional)

A Columns `IconButton` opens a popover placed `bottom-end` with one `Switch` per column; locked columns show disabled with "Always shown". A transparent Show all columns `Button` appears only while a column is hidden. The column's `Tooltip` is suppressed while the popover is open.

### E. Path and create — `Breadcrumb`, `SplitButton` (required)

A `Breadcrumb` of the folder path starts at the storage name; each crumb jumps back to that depth. Beside it the primary medium Add to files `SplitButton` offers Upload file and Add folder. It is the page's only primary action.

### F. Cell recipes — `Avatar`, `Tooltip` (optional)

Folders sort first with a link-coloured folder glyph and open on row click; a `..` row leads back up once inside a folder; files take a glyph by extension. Size is muted. Last Modified pairs the editor's small square `Avatar`, named in a `Tooltip`, with the relative time.

### G. Row actions — `DropdownMenuRoot`, `DropdownMenuTrigger`, `DropdownMenuGroup`, `DropdownMenuOption`, `IconButton`, `Tooltip` (required)

A small ellipsis `IconButton` named File actions opens a menu placed `bottom-end`: Open for a folder or Download for a file in the first group, Delete alone in the last group. The `..` row has no menu.

### H. Empty folder — `EmptyState`, `SplitButton` (required)

The table's `#empty` slot holds a medium `EmptyState` with one sentence and a secondary Add to files `SplitButton` with the same options as the toolbar's. Inside a folder the `..` row always remains, so the user can still go back up.

## Do

- Keep the storage name, search, path and Add to files inside the table toolbar, on the same surface as the rows.
- Sort folders before files and open a folder on row click.
- Show the path as a `Breadcrumb` and keep the `..` row while inside a folder.
- Use one Add to files `SplitButton` for every way of adding content.
- Put Delete last in the row menu, in its own group, and confirm it with `platform/delete/delete-with-confirmation`.
- Give every icon-only control a `Tooltip` and an `aria-label` with the same words.

## Don't

- Don't add a `PageHeader` above the card; the toolbar is the header.
- Don't split Upload file and Add folder into two primary buttons.
- Don't give the `..` row a row menu, a size or an author.
- Don't let the table scroll the page sideways; narrow widths stack the rows.
- Don't replace the toolbar with a full-page empty state when a folder is empty; only the table area changes.

## Copy

- **Storage name:** the resource name as created, e.g. "acme-assets"; never prefixed with the type.
- **Search:** placeholder names the scope, e.g. "Search in folder".
- **Add action:** "Add to files", with options "Upload file" and "Add folder".
- **Row menu:** one verb per option, e.g. "Open", "Download", "Delete"; the trigger is named "File actions".
- **Column headers:** short fragments, e.g. "Name", "Size", "Last Modified".
- **Empty folder:** title states the fact, e.g. "This folder is empty"; description is one sentence, e.g. "Upload files or create a folder to get started."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- One `main` landmark holds the card; the storage name is the visible title of the surface.
- Every icon-only button has an `aria-label`; file and folder glyphs carry `aria-hidden="true"`, so the name cell reads as the name alone.
- The `Breadcrumb` crumbs are links the keyboard reaches in order; the last crumb is the current folder.
- Folder rows open on click and the Open option in the row menu gives the same action to keyboard users.
- Focus order follows reading order: search, Refresh, Download CSV, Columns, path, Add to files, the rows.
- The `Avatar` carries the author name as `alt`, repeated by its `Tooltip`.

## States

- Default: the storage root with folders first, then files, and the full toolbar.
- InsideAFolder: inside a build folder the crumb gains the folder, a `..` row leads back up and files show glyph, size, editor and age.

## Related

- `platform/view/table-view` — the first-level list a storage resource is opened from.
- `platform/delete/delete-with-confirmation` — the dialog behind Delete on a file or folder.
- `platform/detail/details-page` — the storage resource's own details and settings.
- `platform/detail/record-table` — records of a resource, not files.
- `TableRoot` — the data-driven table this page wraps; see `skills/webkit-tables` and `skills/webkit-lists`.
