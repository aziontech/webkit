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

### F. Cell recipes — `Table.CellTime` (optional)

Folders sort first with a link-coloured folder glyph and open on row click; a `..` row leads back up once inside a folder; files take a glyph by extension. Size is muted. Last modified is `Table.CellTime`: the editor's avatar and a relative time that updates every minute, with the absolute time in its tooltip.

### G. Row actions — `Table.CellActions`, `DropdownMenuGroup`, `DropdownMenuOption` (required)

`Table.CellActions`, named after the file ("Actions for logo.svg"), opens a menu placed `bottom-end`: Open for a folder or Download for a file in the first group, Delete alone in the last group. The `..` row has no menu.

### H. Delete confirmation — `ConfirmDialog`, `Alert`, `Input` (required)

The root's `select` event hands the option and the row to the page: Open enters the folder, Delete opens the `platform/delete/delete-with-confirmation` dialog without a trigger of its own. A medium `ConfirmDialog` titled `Delete file` or `Delete folder`, a warning `Alert` (`Once confirmed, this action can't be reversed.`), one sentence of consequence (a folder goes with all its files), and an `Input` labelled by `Type <name> to confirm.`; the danger confirm repeats the title and enables only when the typed text matches the name. The typed text resets each time it opens.

### I. Empty folder — `EmptyState`, `SplitButton` (required)

The table's `#empty` slot holds a medium `EmptyState` with one sentence and a secondary Add to files `SplitButton` with the same options as the toolbar's. Inside a folder the `..` row always remains, so the user can still go back up.

### J. Upload — `SplitButton` (optional)

Variant Uploading only; it adds `Dialog` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `FileDropzone` and `FileTokenGroup` to the page.

Add to files and its Upload file option open a medium `Dialog` titled Upload files whose description names the destination folder and that a file with the same name is replaced. Inside: an inline `FileDropzone` (`Up to 300 MB per file.`) with a secondary Browse files `Button` wired to a hidden `<input type="file" multiple>`, then a `FileTokenGroup` (`limit` 5) of the picked files. A file over the limit stays in the group with its reason (`Larger than 300 MB, the limit per file`), an empty file with a warning, and both are left out of the count: the primary button reads `Upload 3 files` and is disabled while nothing can be sent. Upload closes the dialog and starts the transfer; the dialog does not wait for it. In the Uploading variant Add to files also offers Upload folder: the same dialog titled Upload folder, a `FileDropzone` with `directories` (a dropped folder is walked) and a Browse folder `Button` wired to a hidden `<input type="file" webkitdirectory>`; the tokens and the transfer rows name each file by its path inside the folder (`site/css/main.css`), and as files finish their folders appear in the table under the folder in view.

A second `FileDropzone kind="overlay"` sits inside the `section` that holds the card (made `relative`), so dragging files anywhere over the page shows `Drop files to upload them to <folder>` over the listing; a drop uploads straight into the folder in view and refuses files over the limit with a danger toast.

### K. Transfer card and outcome toast — `Button` (optional)

Variants Uploading and MoveObject only; they add `UploadProgress` and the `Toaster` with `toast`.

Every transfer (upload, move) runs in one floating `UploadProgress` at the inline-end bottom corner, so the person can keep browsing, change folder or open another resource while it runs. The header counts finished files over one overall bar (`Uploading 2 of 5 files`), each row carries its bar, Cancel while it runs or waits, Retry when it failed with the reason under the name. Files land in the table as each finishes, not at the end. Close appears when everything finished and returns focus to Add to files (or to the toolbar, after a move). At most two files upload at a time; the rest wait.

When a transfer finishes the page reports it with a toast as well as the card, because the card may be collapsed or the person may be elsewhere. Its actions fit the files, never a deploy action: after a clean upload or move, `Open folder` (goes to the destination); after a partial upload, a danger toast `1 of 5 files weren't uploaded.` that says where the rest went and offers `Retry failed`. Storage objects are not deployed, so the async-submit Edit and Redeploy pair does not apply. The `Toaster` sits at `top-right` so it never covers the transfer card.

### L. Selection and Move — `TableRoot`, `DropdownMenuOption` (optional)

Variant MoveObject only; it adds `Dialog` and its parts, `Field` and `Combobox`.

`enable-row-selection` with `v-model:row-selection` adds the checkbox column, and `:row-selectable="(row) => row.kind === 'file'"` keeps it to files: folders and the `..` row draw no checkbox and Select all skips them; the toolbar slot's `selectedCount`, `selectedRows` and `clearSelection` drive a selection bar (`2 selected`, Clear selection, Move). Every file's row menu gains Move between Download and Delete. Move opens a medium `Dialog` titled `Move index.html` or `Move 2 files`; its description gives the count, the total size and the folder they leave, the files are listed by name and size, and one `Field` holds a large clearable `Combobox` of every folder in the storage (the root first, as `/`) that also accepts a new path (`A folder that does not exist yet is created with the move.`). On Move the path is normalised (one slash between segments, no leading slash, a trailing slash) and validated: printable ASCII only, no `..`, not the folder the files are in; each failure is a `Field.Error` under the field and nothing moves.

## Do

- Keep the storage name, search, path and Add to files inside the table toolbar, on the same surface as the rows.
- Sort folders before files and open a folder on row click.
- Show the path as a `Breadcrumb` and keep the `..` row while inside a folder.
- Use one Add to files `SplitButton` for every way of adding content.
- Put Delete last in the row menu, in its own group, and confirm it with `platform/delete/delete-with-confirmation`.
- Give every icon-only control a `Tooltip` and an `aria-label` with the same words.
- Keep refused files in the upload dialog with their reason, and leave them out of the upload count.
- Run every transfer in the one floating `UploadProgress` card and let the person keep working.
- End every transfer with a toast whose action fits the files: Open folder or Retry failed.

## Don't

- Don't add a `PageHeader` above the card; the toolbar is the header.
- Don't split Upload file and Add folder into two primary buttons.
- Don't give the `..` row a row menu, a size or an author.
- Don't let the table scroll the page sideways; narrow widths stack the rows.
- Don't replace the toolbar with a full-page empty state when a folder is empty; only the table area changes.
- Don't block the page with a modal progress dialog while files upload or move.
- Don't offer View deployments, Edit or Redeploy after a storage transfer; nothing is deployed.
- Don't drop a refused file silently, and don't send a file the dialog marked as refused.

## Copy

- **Storage name:** the resource name as created, e.g. "acme-assets"; never prefixed with the type.
- **Search:** placeholder names the scope, e.g. "Search in folder".
- **Add action:** "Add to files", with options "Upload file" and "Add folder".
- **Row menu:** one verb per option, e.g. "Open", "Download", "Delete"; the trigger is named "Actions for <file>".
- **Delete dialog:** title and confirm `Delete file` or `Delete folder`, consequence `The selected folder will be deleted, along with all its files.`, prompt `Type <name> to confirm.`
- **Column headers:** short fragments, e.g. "Name", "Size", "Last modified".
- **Empty folder:** title states the fact, e.g. "This folder is empty"; description is one sentence, e.g. "Upload files or create a folder to get started."
- **Upload dialog:** title `Upload files`, primary `Upload file` or `Upload 3 files`, refusal `Larger than 300 MB, the limit per file`.
- **Drop overlay:** `Drop files to upload them to <folder>`, description `Up to 300 MB per file.`
- **Move dialog:** title `Move <name>` or `Move 2 files`, field `Destination folder`, placeholder `/ (storage root)`, errors `Use letters, numbers, dots, hyphens and slashes only.`, `A destination cannot go up with "..". Type the full path.`, `The files are already in this folder. Pick another one.`
- **Toasts:** `5 files uploaded to acme-assets.` with Open folder; `1 of 5 files weren't uploaded.` with Retry failed; `2 files moved to logs/.` with Open folder.
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- One `main` landmark holds the card; the storage name is the visible title of the surface.
- Every icon-only button has an `aria-label`; file and folder glyphs carry `aria-hidden="true"`, so the name cell reads as the name alone.
- The `Breadcrumb` crumbs are links the keyboard reaches in order; the last crumb is the current folder.
- Folder rows open on click and the Open option in the row menu gives the same action to keyboard users.
- Focus order follows reading order: search, Refresh, Download CSV, Columns, path, Add to files, the rows.
- `Table.CellTime` names the author and reads the absolute time to screen readers.
- The drop overlay is `aria-hidden`: dragging is a pointer path, and Add to files with Browse files is the keyboard path to the same upload.
- `UploadProgress` is a region named File transfers with a polite status that announces each file finishing and the outcome; percentages are not announced. The toast repeats the outcome for people who collapsed the card.
- In the upload dialog each refused file's reason is the `aria-describedby` of its Remove button, and removing a file moves focus to the next one.
- The Move dialog's `Field` wires the label, description and error to the `Combobox`; the error is read when focus returns to it.

## States

- Default: the storage root with folders first, then files, and the full toolbar.
- InsideAFolder: inside a build folder the crumb gains the folder, a `..` row leads back up and files show glyph, size, editor and age.
- Uploading: a transfer is running in the floating card; one file fails once and can be retried; the upload dialog and the page drop overlay add more.
- MoveObject: two files selected inside a build folder with the Move dialog open; moving runs in the card and ends in a toast.

## Related

- `platform/view/table-view` — the first-level list a storage resource is opened from.
- `platform/delete/delete-with-confirmation` — the dialog behind Delete on a file or folder.
- `platform/detail/details-page` — the storage resource's own details and settings.
- `platform/detail/record-table` — records of a resource, not files.
- `FileTokenGroup`, `FileDropzone` and `UploadProgress` — the upload pieces; see their component docs.
- `platform/states/async-submit` — the rule for long actions; storage transfers follow it with item actions instead of Edit and Redeploy.
- `TableRoot` — the data-driven table this page wraps; see `skills/webkit-tables` and `skills/webkit-lists`.
