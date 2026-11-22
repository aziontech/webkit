# File browser

The contents of one storage resource. The user opens a bucket to find a file, walk into a folder and back out, upload something or add a folder, and download or delete what is there. The table's toolbar is the whole page header, so the storage name, search, the folder path and Add to files all sit on the one surface the files live on.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- A storage resource (an Object Storage bucket, a build output) opens on its files and folders.
- Users move through a folder tree and need to know where they are and how to go back up.
- Files are compared by name, size and last change, and acted on one at a time: open, download, delete.

## When not to use

- A first-level list of resources of one type: use `view/view-table`.
- Rows of one resource that are records, not files (database rows, variables): use `detail/detail-dns-zone`.
- Events or logs explored over time: use `view/view-events-explorer`.
- Tables and queries of a database: use `view/view-query-editor`.
- Picking an existing resource inside a create form: use `create/create-resource-picker`.

## Building blocks

### A. Surface — `Card`, `DataTable` (required)

One `Card :padded="false"` around a `DataTable :bordered="false"` with `row-key`, `sortable` with `manual-sorting` and `v-model:sorting` (the block orders the rows so `..` and the folders stay first: Size sorts on a numeric `bytes` field and Last modified on the `modifiedAt` timestamp, within folders and within files), `v-model:global-filter`, `paginated` at 50 rows (25, 50, 100), `:loading` and an `export-filename`. Name is the `principal` column; actions are `type: 'action'` and not hideable. Everything above the rows lives in the table's `#toolbar` slot, so there is no separate page heading.

### B. Storage title and search — `TableSearch` (required)

The toolbar opens with the storage glyph and the storage name, the page's `h1`, truncated on one line. Below it a large `TableSearch` fills the row, searching inside the table with the placeholder "Search in folder"; it searches the current folder, not the whole bucket.

### C. Toolbar actions — `Tooltip`, `IconButton` (optional)

Large outlined `IconButton`s for Refresh (`:loading` while the listing reloads) and Download CSV (`exportCsv` on the table ref), each named by a `Tooltip` and an `aria-label` with the same words. They sit on the search row and act on the listing.

### D. Columns — `CollectionPreferences` (optional)

The last toolbar control is `CollectionPreferences` with only its columns section (`:sections="['columns']"`), which reads the table's columns from context: one switch per column with its order, Name locked, and Confirm writes them back to the table. Do not build a popover of `Switch`es by hand.

### E. Path and create — `Breadcrumb`, `SplitButton` (required)

A `Breadcrumb` of the folder path starts at the storage name; each crumb jumps back to that depth. Beside it the primary medium Add to files `SplitButton` offers Upload file and Add folder. It is the page's only primary action.

### F. Cell recipes — `TableCellTime` (optional)

Folders sort first with a link-coloured folder glyph; the folder name is a `Button variant="link"` that opens it (a row click does the same for a pointer), and the `..` name is a link button named Go up to the parent folder; a `..` row leads back up once inside a folder; files take a glyph by extension. Size is muted. Last modified is `TableCellTime`: the editor's avatar and a relative time that updates every minute, with the absolute time in its tooltip.

### G. Row actions — `TableCellActions`, `DropdownMenuGroup`, `DropdownMenuItem` (required)

`TableCellActions`, named after the file ("Actions for logo.svg"), opens a menu placed `bottom-end`: Open for a folder or Download for a file in the first group, Delete alone in the last group. The `..` row has no menu.

### H. Delete confirmation — `ConfirmDialog`, `Alert` (required)

The root's `select` event hands the option and the row to the page: Open enters the folder, Delete opens the `edit/edit-delete-dialog` dialog without a trigger of its own. A medium `ConfirmDialog` titled `Delete file` or `Delete folder`, a warning `Alert` (`Once confirmed, this action can't be reversed.`), one sentence of consequence (a folder goes with all its files), and the typed confirmation `ConfirmDialog` draws from `confirmation-phrase` (`Type <name> to confirm.`, exact and case-sensitive); the danger confirm repeats the title and enables only when the typed text matches the name. The typed text resets each time it opens.

### I. Empty folder — `EmptyState`, `SplitButton` (required)

When the search is set, the table's `#empty` slot holds a medium `EmptyState`, No matching files, with an outlined Clear search; otherwise it holds a medium `EmptyState` with one sentence and a secondary Add to files `SplitButton` with the same options as the toolbar's. Inside a folder the `..` row always remains, so the user can still go back up.

### J. Upload — `Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`, `PanelHeader`, `PanelBody`, `PanelFooter`, `FileDropzone`, `FileTokenGroup` (required)

Add to files and its Upload file option open a medium `Dialog` titled Upload files whose description names the destination folder and that a file with the same name is replaced. Inside: an inline `FileDropzone` (`Up to 300 MB per file.`) with a secondary Browse files `Button` that opens the system picker through `useFilePicker` (several files; Browse folder picks a folder), then a `FileTokenGroup` (`limit` 5) of the picked files. A file over the limit stays in the group with its reason (`Larger than 300 MB, the limit per file`), an empty file with a warning, and both are left out of the count: the primary button reads `Upload 3 files` and is disabled while nothing can be sent. Upload emits `upload` with the files and the folder path and closes the dialog; the dialog does not wait for the transfer. Upload folder opens the same dialog titled Upload folder, a `FileDropzone` with `directories` (a dropped folder is walked) and a Browse folder `Button` wired to a hidden `<input type="file" webkitdirectory>`; each file keeps its path inside the folder in `webkitRelativePath` (`site/css/main.css`). Add folder emits `add-folder`; the page asks for the name.

A second `FileDropzone variant="overlay"` sits inside the `section` that holds the card (made `relative`), so dragging files anywhere over the page shows `Drop files to upload them to <folder>` over the listing; a drop emits `upload` for the folder in view and refuses files over the limit with a danger toast.

### K. Transfer card — `UploadProgress`, `Button` (optional)

Shown while `transfers` holds files; `transferOperation` says whether they upload or move.

Every transfer (upload, move) runs in one floating `UploadProgress` at the inline-end bottom corner, so the person can keep browsing, change folder or open another resource while it runs. The header counts finished files over one overall bar (`Uploading 2 of 5 files`), each row carries its bar, Cancel while it runs or waits (uploads only), Retry when it failed with the reason under the name; Cancel, Retry and Close emit `cancel-transfer`, `retry-transfer` and `close-transfer`, and the page updates `transfers`. Files land in the table as the page adds them to `entries`, not at the end. Close appears when everything finished and returns focus to Add to files (or to the toolbar, after a move). After an upload the card offers Open folder, which opens the `target` of the finished files.

When a transfer finishes the page reports it with a toast as well as the card, because the card may be collapsed or the person may be elsewhere. Its actions fit the files, never a deploy action: after a clean upload or move, `Open folder` (sets `path` to the destination); after a partial upload, a danger toast `1 of 5 files weren't uploaded.` that says where the rest went and offers `Retry failed`. Storage objects are not deployed, so the state-async-submit Edit and Redeploy pair does not apply. Each of these toasts passes `position: 'top-end'` so it never covers the transfer card, whatever corner the app's region defaults to.

### L. Selection and Move — `DataTable`, `DropdownMenuItem`, `Field`, `Combobox` (optional)

With `movable`, `selectable` with `v-model:selected-keys` adds the checkbox column, and `:row-selectable="(row) => row.kind === 'file'"` keeps it to files: folders and the `..` row draw no checkbox and Select all skips them; the toolbar slot's `selectedCount`, `selectedRows` and `clearSelection` drive a selection bar (`2 selected`, Clear selection, Move), and the selected names are the `selection` model. Every file's row menu gains Move between Download and Delete. Move opens a medium `Dialog` titled `Move index.html` or `Move 2 files`; its description gives the count, the total size and the folder they leave, the files are listed by name and size, and one `Field` holds a large clearable `Combobox` of the `destinations` (the root first, as `/`) that also accepts a new path (`A folder that does not exist yet is created with the move.`). On Move the path is normalised (one slash between segments, no leading slash, a trailing slash) and validated: printable ASCII only, no `..`, not the folder the files are in; each failure is a `Field.Error` under the field and nothing moves. A valid path emits `move` with the files and the destination.

## Data

The block takes the open folder through props and emits every action; it fetches nothing. `FileBrowserEntry`, `FileBrowserTransfer` and `FileBrowserProps` are exported from `view-file-browser.vue`, and `sample.ts` holds a sample storage the block browses when `entries` is left out (and never while `loading` or `error` is set). `azion-storage.ts` maps an Azion Object Storage listing to entries.

| Prop / model            | Type                    | What it does                                                                                                            |
| ----------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `storageName`           | `string`                | The storage name: the page heading, the first crumb and the default destination in the dialogs.                         |
| `v-model:path`          | `string`                | The open folder as a key prefix (`site/css/`, empty for the root). The block sets it; the page loads that folder.       |
| `entries`               | `FileBrowserEntry[]`    | The open folder's folders (name ending in `/`) and files (`bytes`, `modifiedAt`, `editor`). Pass `[]` for an empty one. |
| `loading`               | `boolean`               | The listing is loading: the table shows its loading rows and Refresh spins.                                             |
| `error`                 | `string`                | Why the folder could not load, shown in the danger `Alert` with Retry that replaces the table.                          |
| `destinations`          | `string[]`              | Every folder path the Move dialog offers; left out, the folders among `entries`.                                        |
| `movable`               | `boolean`               | Files can be selected and moved.                                                                                        |
| `v-model:selected-keys` | `string[]`              | The selected file names.                                                                                                |
| `defaultMoveOpen`       | `boolean`               | Opens the Move dialog on mount for the selected files.                                                                  |
| `transfers`             | `FileBrowserTransfer[]` | The files in the transfer card (`UploadProgressItem` plus the `target` folder); empty hides it.                         |
| `transferOperation`     | `'upload' \| 'move'`    | What the transfer card is running.                                                                                      |

| Event             | Payload                             | When                                                                     |
| ----------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| `open`            | `(event, entry)`                    | A folder is opened (after `path` changes) or a file row is clicked.      |
| `download`        | `(event, entry)`                    | Download in a file's row menu.                                           |
| `delete`          | `(event, entry)`                    | The delete dialog was confirmed; the row is already gone from the table. |
| `upload`          | `(event, { files, path })`          | Upload in the upload dialog, or files dropped on the page.               |
| `add-folder`      | `(event)`                           | Add folder in Add to files.                                              |
| `move`            | `(event, { entries, destination })` | Move in the Move dialog, with a valid destination.                       |
| `refresh`         | `(event)`                           | Refresh.                                                                 |
| `retry`           | `(event)`                           | Retry in the error alert.                                                |
| `cancel-transfer` | `(event, id?)`                      | Cancel on one file, or on the whole card without an id.                  |
| `retry-transfer`  | `(event, id?)`                      | Retry on one file, or on the whole card without an id.                   |
| `close-transfer`  | `(event)`                           | Close on the finished card; clear `transfers`.                           |

A file's object key is `path + entry.name`. To go live on Azion Object Storage, the page fetches `GET /v4/storage/buckets/{bucket}/objects` with its own client and passes the entries:

```vue
<script setup lang="ts">
  import { ref, watch } from 'vue'

  import { type AzionStorageObject, toFileBrowserEntries } from './azion-storage'
  import ViewFileBrowser, { type FileBrowserEntry } from './view-file-browser.vue'

  const bucket = 'acme-assets'
  const path = ref('')
  const entries = ref<FileBrowserEntry[]>([])
  const loading = ref(false)
  const error = ref('')

  const load = async () => {
    loading.value = true
    error.value = ''
    try {
      const objects: AzionStorageObject[] = []
      let token: string | null = null
      do {
        const query = new URLSearchParams({ prefix: path.value, max_object_count: '1000' })
        if (token) query.set('continuation_token', token)
        const body = await api.listObjects(bucket, query)
        objects.push(...body.results)
        token = body.continuation_token
      } while (token)
      entries.value = toFileBrowserEntries(objects, path.value)
    } catch {
      entries.value = []
      error.value = "Couldn't load the files in this folder. Check your connection and retry."
    } finally {
      loading.value = false
    }
  }

  watch(path, load, { immediate: true })
</script>

<template>
  <ViewFileBrowser
    v-model:path="path"
    :storage-name="bucket"
    :entries="entries"
    :loading="loading"
    :error="error"
    @refresh="load"
    @retry="load"
  />
</template>
```

`api.listObjects` stands for the app's own authenticated client (it returns the response body, `AzionStorageObjectsResponse`). Then delete `sample.ts` and its import.

## Do

- Keep the storage name, search, path and Add to files inside the table toolbar, on the same surface as the rows.
- Sort folders before files, keep `..` first under any sort, and sort Size and Last modified on numbers, never on display strings.
- Show the path as a `Breadcrumb` and keep the `..` row while inside a folder.
- Use one Add to files `SplitButton` for every way of adding content.
- Put Delete last in the row menu, in its own group, and confirm it with `edit/edit-delete-dialog`.
- Give every icon-only control a `Tooltip` and an `aria-label` with the same words.
- Keep refused files in the upload dialog with their reason, and leave them out of the upload count.
- Run every transfer in the one floating `UploadProgress` card and let the person keep working.
- End every transfer with a toast whose action fits the files: Open folder or Retry failed.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so this page body never renders a `Toaster`.

## Don't

- Don't add a `PageHeader` above the card; the toolbar is the header.
- Don't split Upload file and Add folder into two primary buttons.
- Don't give the `..` row a row menu, a size or an author.
- Don't let the table scroll the page sideways; on a phone the grid scrolls sideways inside its card, never the page.
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

- The card sits in the layout's one `main` landmark; the storage name is the page's `h1`.
- Every icon-only button has an `aria-label`; file and folder glyphs carry `aria-hidden="true"`, so the name cell reads as the name alone.
- The `Breadcrumb` crumbs are links the keyboard reaches in order; the last crumb is the current folder.
- Folder and `..` names are buttons, so a keyboard user opens a folder or goes up with Tab and Enter; the row click is the pointer shortcut and the Open option in the row menu repeats it.
- Focus order follows reading order: search, Refresh, Download CSV, Columns, path, Add to files, the rows.
- `/` focuses the folder search from anywhere on the page, except while typing in a field.
- The rows are one tab stop: Arrow Up and Arrow Down move between rows, Home and End jump to the first and last, Enter opens the focused folder or file (or goes up from `..`), Space selects a file when moving is on, and Delete or Backspace opens the delete dialog for a file or folder. After a delete, focus lands on the next row.
- `TableCellTime` names the author and reads the absolute time to screen readers.
- The drop overlay is `aria-hidden`: dragging is a pointer path, and Add to files with Browse files is the keyboard path to the same upload.
- `UploadProgress` is a region named File transfers with a polite status that announces each file finishing and the outcome; percentages are not announced. The toast repeats the outcome for people who collapsed the card.
- In the upload dialog each refused file's reason is the `aria-describedby` of its Remove button, and removing a file moves focus to the next one.
- The Move dialog's `Field` wires the label, description and error to the `Combobox`; the error is read when focus returns to it.

## States

- Default: the storage root (`path` is empty) with folders first, then files, and the full toolbar.
- InsideAFolder: `path` is a build folder; the crumb gains the folder, a `..` row leads back up and files show glyph, size, editor and age.
- Uploading: `transfers` holds a running upload in the floating card; Add to files opens the upload dialog and the page drop overlay adds more.
- Empty: `entries` is `[]` inside `assets/` of a build; the `..` row stays and the empty state offers Add to files.
- Error: `error` is set; the storage name, the path and Refresh stay, Add to files is disabled and a danger `Alert` with the message and Retry takes the table's place.
- MoveObject: `movable` with two files in `selectedKeys` and `defaultMoveOpen`; the Move dialog is open and Move emits `move`.

## Related

- `view/view-table` — the first-level list a storage resource is opened from.
- `edit/edit-delete-dialog` — the dialog behind Delete on a file or folder.
- `detail/detail-resource` — the storage resource's own details and settings.
- `detail/detail-dns-zone` — records of a resource, not files.
- `FileTokenGroup`, `FileDropzone` and `UploadProgress` — the upload pieces; see their component docs.
- `state/state-async-submit` — the rule for long actions; storage transfers follow it with item actions instead of Edit and Redeploy.
- `DataTable` — the data-driven table this page wraps; see `skills/webkit-tables` and `skills/webkit-lists`.
