# ViewFileBrowser (`view/view-file-browser`)

> The file browser a storage resource opens on: one flush `Card` holding a borderless `DataTable` whose toolbar is the whole page header. The toolbar stacks the storage name beside the storage glyph, a large row of the table’s own search plus the refresh and download IconButtons and the `CollectionPreferences` (columns section), then a `Breadcrumb` of the folder path beside the Add to files `SplitButton` (Upload file, Add folder). Folders stay first under any sort with a link-coloured folder glyph and a link-button name that opens them, a .. row leads back up once inside a folder, Size sorts on bytes and Last modified on the timestamp, the rows page at 50, files take a glyph by extension, Size is muted and Last modified is `TableCellTime` (the editor's avatar and a relative time); folders carry Open and files Download in their row menu, with Delete below, which opens a `ConfirmDialog` (a warning `Alert` and its typed confirmation phrase, the name). An empty folder renders the table’s empty slot: an `EmptyState` (This folder is empty) with a secondary Add to files split button, and a search that matches nothing shows No matching files with Clear search; inside a folder the .. row always remains. Built from `Card`, `DataTable` with `TableSearch`, `IconButton`, `Tooltip`, `CollectionPreferences` (columns section), `Breadcrumb`, `SplitButton`, `TableCellTime`, `TableCellActions` and `EmptyState`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/view/view-file-browser/view-file-browser.vue` in `@aziontech/webkit`
- MCP: `get_block("view/view-file-browser")`
- Components: [Alert](../../components/alert.md), [Breadcrumb](../../components/breadcrumb.md), [Button](../../components/button.md), [Card](../../components/card.md), [CollectionPreferences](../../components/collection-preferences.md), [Combobox](../../components/combobox.md), [ConfirmDialog](../../components/confirm-dialog.md), [DataTable](../../components/data-table.md), `DataTablePagination`, `DialogContent`, `DialogDescription`, [Dialog](../../components/dialog.md), `DialogTitle`, `DropdownMenuGroup`, `DropdownMenuItem`, [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), [FileDropzone](../../components/file-dropzone.md), [FileTokenGroup](../../components/file-token-group.md), [IconButton](../../components/icon-button.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [SplitButton](../../components/split-button.md), `TableCellActions`, `TableCellTime`, `TableSearch`, [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), [UploadProgress](../../components/upload-progress.md), `use-file-picker`
- Skills: `webkit-tables`, `webkit-lists`, `webkit-ui-states`

## Asked as

file browser; file manager; storage browser; bucket browser; object storage; folders and files; upload files; navegador de arquivos; gerenciador de arquivos; arquivos do bucket; upload progress; move files; move objects; drag and drop upload; enviar arquivos; mover arquivos; file preview; preview a file; object preview; visualizar arquivo

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

### A. Surface — `Card`, `DataTable`, `DataTablePagination` (required)

One `Card :padded="false"` around a `DataTable :bordered="false"` with `row-key`, `sortable` with `manual-sorting` and `v-model:sorting` (the block orders the rows so `..` and the folders stay first: Size sorts on a numeric `bytes` field and Last modified on the `modifiedAt` timestamp, within folders and within files), the search text bound to the toolbar `TableSearch` `v-model` (through `FolderSearchRow` `v-model:search`), `DataTablePagination` in the `footer` slot at 50 rows (25, 50, 100), and `:loading`; Download CSV calls `exportCsv({ filename: 'files.csv' })`. Name is the `principal` column; actions are `type: 'action'` and not hideable. Everything above the rows lives in the table's `#toolbar` slot, so there is no separate page heading.

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

The block takes the open folder through props and emits every action; it fetches nothing. `FileBrowserEntry`, `FileBrowserTransfer` and `FileBrowserProps` are exported from `view-file-browser.vue`, and `sample.ts` holds a sample storage the block browses when `entries` is left out (and never while `loading` or `error` is set). `azion-storage.ts` maps an Azion Object Storage listing to entries. `lib/file-rows.ts` turns entries into table rows (glyph, size, sort, folders first) and checks a Move destination; the regions are private parts in `parts/`: the storage title, the search row, the selection bar, the name cell, the row menu, the empty folder, the error card, the upload, move and delete dialogs and the transfer card.

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

## Variants

- `Default` — primary (the code below)
- `InsideAFolder` — Inside a build folder: the crumb gains the folder, a .. row leads back up, and the files carry their glyph, size, editor and age.
- `Uploading` — An upload into the storage root is running: the floating `UploadProgress` card counts finished files over one bar, gives each file its bar, Cancel and, when a file fails, Retry, and finished files join the table as they land. Add to files opens the Upload files dialog (`FileDropzone` plus a `FileTokenGroup` that keeps files over 300 MB in the list with the reason and leaves them out of the upload); dragging files anywhere over the page shows the drop overlay for the folder in view. Upload folder opens the same dialog for a folder (`FileDropzone directories` and a Browse folder picker); each file keeps its path and its folders appear in the table as files land. The outcome is reported by a toast whose actions fit the files: Open folder after a clean upload, Retry failed after a partial one.
- `Empty` — An empty folder inside a build: the crumb names it, the .. row stays, and the table's empty slot holds This folder is empty with a secondary Add to files split button.
- `Error` — The folder could not load: the storage name, the path and Refresh stay, Add to files is disabled, and a danger Alert with Retry takes the table's place.
- `MoveObject` — Two files of a build folder are selected and the Move dialog is open: it names the files, their total size and the folder they leave, and the Destination folder `Combobox` offers every folder in the storage and accepts a new path. A path with characters outside printable ASCII, with `..`, or equal to the current folder is refused under the field. Move runs in the floating `UploadProgress` card (`operation="move"`) and ends in a toast with Open folder. Selecting rows shows a selection bar with Move, and every file's row menu has Move.

Each variant is the same screen in another state: `get_block("view/view-file-browser", { variant })`, or the file under `blocks/view/view-file-browser/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Card from '@aziontech/webkit/card'
  import DataTable, {
    type DropdownMenuItemValue,
    type TableExposed
  } from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import SplitButton, { type SplitButtonItem } from '@aziontech/webkit/split-button'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import { toast } from '@aziontech/webkit/toast'
  import type { UploadProgressItem } from '@aziontech/webkit/upload-progress'
  import { computed, nextTick, ref, watch } from 'vue'

  import {
    addToFilesActions,
    fileColumns,
    type FileRow,
    folderName,
    listRows,
    sortRows,
    UPLOAD_LIMIT
  } from './lib/file-rows'
  import DeleteEntryDialog from './parts/delete-entry-dialog.vue'
  import FileNameCell from './parts/file-name-cell.vue'
  import FileRowActions from './parts/file-row-actions.vue'
  import FolderEmpty from './parts/folder-empty.vue'
  import FolderErrorCard from './parts/folder-error-card.vue'
  import FolderSearchRow from './parts/folder-search-row.vue'
  import MoveDialog from './parts/move-dialog.vue'
  import SelectionBar from './parts/selection-bar.vue'
  import StorageTitle from './parts/storage-title.vue'
  import TransferCard from './parts/transfer-card.vue'
  import UploadDialog from './parts/upload-dialog.vue'
  import { sampleFolders, sampleStorageName } from './sample'

  /** Whether an entry is a folder or a file. */
  export type FileBrowserEntryKind = 'folder' | 'file'

  /** One entry of the open folder. */
  export interface FileBrowserEntry {
    /** Name inside the open folder; a folder name ends in a slash. */
    name: string
    /** Whether the entry is a folder or a file. */
    kind: FileBrowserEntryKind
    /** Size of a file in bytes; Size sorts on it. */
    bytes?: number
    /** When a file changed last, as an ISO time. */
    modifiedAt?: string
    /** Who changed a file last, shown beside the time. */
    editor?: string
  }

  /** One file in the transfer card. */
  export interface FileBrowserTransfer extends UploadProgressItem {
    /** The folder path the file goes to; Open folder opens it. */
    target?: string
  }

  /** What the transfer card is running. */
  export type FileBrowserTransferOperation = 'upload' | 'move'

  /** What the upload dialog or a page drop sends. */
  export interface FileBrowserUpload {
    /** The files to send; a folder upload keeps each path in webkitRelativePath. */
    files: File[]
    /** The folder path they go to. */
    path: string
  }

  /** What the Move dialog sends. */
  export interface FileBrowserMove {
    /** The files to move, all in the open folder. */
    entries: FileBrowserEntry[]
    /** The normalised destination folder path; empty is the storage root. */
    destination: string
  }

  export interface FileBrowserProps {
    /** The storage name, the page heading and the first crumb. Left out, the sample name. */
    storageName?: string
    /** The entries of the open folder. Left out, the sample folder at the path renders. */
    entries?: FileBrowserEntry[]
    /** Every folder path the Move dialog offers. Left out, the folders among the entries. */
    destinations?: string[]
    /** The listing is loading: the table shows its loading rows and Refresh spins. */
    loading?: boolean
    /** Why the folder could not load; a danger alert with Retry replaces the table. */
    error?: string
    /** Files can be selected and moved: a checkbox column, a selection bar and Move in the row menu. */
    movable?: boolean
    /** Opens the Move dialog on mount for the selected files. */
    defaultMoveOpen?: boolean
    /** The files in the floating transfer card; empty hides it. */
    transfers?: FileBrowserTransfer[]
    /** What the transfer card is running. */
    transferOperation?: FileBrowserTransferOperation
  }

  type UploadMode = 'files' | 'folder'

  const props = withDefaults(defineProps<FileBrowserProps>(), {
    storageName: undefined,
    entries: undefined,
    destinations: undefined,
    loading: false,
    error: '',
    movable: false,
    defaultMoveOpen: false,
    transfers: undefined,
    transferOperation: 'upload'
  })

  const emit = defineEmits<{
    open: [event: Event, entry: FileBrowserEntry]
    download: [event: Event, entry: FileBrowserEntry]
    delete: [event: Event, entry: FileBrowserEntry]
    upload: [event: Event, payload: FileBrowserUpload]
    'add-folder': [event: MouseEvent | KeyboardEvent]
    move: [event: Event, payload: FileBrowserMove]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'cancel-transfer': [event: MouseEvent, id?: string]
    'retry-transfer': [event: MouseEvent, id?: string]
    'close-transfer': [event: MouseEvent]
  }>()

  const path = defineModel<string>('path', { default: '' })
  const selectedKeys = defineModel<string[]>('selectedKeys', { default: () => [] })

  const rootName = computed(() => props.storageName ?? sampleStorageName)
  const folderPath = computed(() => path.value.match(/[^/]+\//g) ?? [])

  const source = computed<FileBrowserEntry[]>(
    () => props.entries ?? (props.loading || props.error ? [] : (sampleFolders[path.value] ?? []))
  )
  const items = ref<FileBrowserEntry[]>([])
  watch(
    source,
    (next) => {
      items.value = [...next]
    },
    { immediate: true }
  )

  const rows = computed<FileRow[]>(() => listRows(items.value, folderPath.value.length > 0))

  const sorting = ref<{ desc: boolean; id: string }[]>([])
  const sortedRows = computed<FileRow[]>(() => sortRows(rows.value, sorting.value[0]))

  const search = ref('')
  const tableEl = ref<TableExposed<FileRow> | null>(null)

  const isFile = (item: FileRow) => item.kind === 'file'

  const openFolder = (target: string) => {
    path.value = target
    selectedKeys.value = []
  }
  const goUp = () => openFolder(folderPath.value.slice(0, -1).join(''))
  const openEntry = (event: Event, item: FileRow) => {
    if (!item.entry) return
    if (item.kind === 'folder') openFolder(path.value + item.name)
    emit('open', event, item.entry)
  }
  const onRowClick = (event: MouseEvent | KeyboardEvent, item: FileRow) => {
    if (item.kind === 'parent') goUp()
    else openEntry(event, item)
  }

  const pathCrumbs = computed(() => [
    { label: rootName.value, href: '0' },
    ...folderPath.value.map((segment, index) => ({
      label: segment.replace(/\/$/, ''),
      href: String(index + 1)
    }))
  ])
  const onCrumb = (event: MouseEvent, href: string) => {
    event.preventDefault()
    const depth = Number(href)
    if (Number.isFinite(depth)) openFolder(folderPath.value.slice(0, depth).join(''))
  }

  const refresh = (event: MouseEvent) => {
    if (!props.loading) emit('refresh', event)
  }

  const pending = ref<FileRow | null>(null)
  const deleteOpen = ref(false)

  const onRowAction = (event: Event, value: DropdownMenuItemValue, item: FileRow) => {
    if (value === 'open') openEntry(event, item)
    if (value === 'download' && item.entry) emit('download', event, item.entry)
    if (value === 'move') openMove([item])
    if (value !== 'delete') return
    pending.value = item
    deleteOpen.value = true
  }

  const onRowRemove = (event: KeyboardEvent, item: FileRow) => {
    if (item.kind !== 'parent') onRowAction(event, 'delete', item)
  }

  const confirmDelete = (event: Event) => {
    const entry = pending.value?.entry
    if (!entry) return
    items.value = items.value.filter((item) => item !== entry)
    deleteOpen.value = false
    emit('delete', event, entry)
  }

  const destinationPaths = computed(
    () =>
      props.destinations ??
      (props.entries
        ? props.entries
            .filter((entry) => entry.kind === 'folder')
            .map((entry) => path.value + folderName(entry.name))
        : Object.keys(sampleFolders).filter(Boolean))
  )
  const destinationOptions = computed(() => [
    { value: '/', label: '/', description: 'Storage root' },
    ...destinationPaths.value.map((value) => ({ value }))
  ])

  const moveOpen = ref(false)
  const moving = ref<FileRow[]>([])
  const selectionHostEl = ref<HTMLElement | null>(null)

  const openMove = (selected: FileRow[]) => {
    moving.value = selected.filter((item) => item.kind === 'file')
    if (!moving.value.length) return
    moveOpen.value = true
  }
  const hasSelectedFiles = (selectedRows: FileRow[]) =>
    selectedRows.some((item) => item.kind === 'file')

  const confirmMove = (event: Event, target: string) => {
    const entries = moving.value.flatMap((item) => (item.entry ? [item.entry] : []))
    emit('move', event, { entries, destination: target })
    selectedKeys.value = []
    moveOpen.value = false
  }

  const uploadOpen = ref(false)
  const uploadMode = ref<UploadMode>('files')
  const addHostEl = ref<HTMLElement | null>(null)

  const openUpload = (mode: UploadMode = 'files') => {
    uploadMode.value = mode
    uploadOpen.value = true
  }
  const onAddClick = () => openUpload()
  const onAddItem = (event: MouseEvent | KeyboardEvent, item: SplitButtonItem) => {
    if (item.value === 'upload') openUpload()
    if (item.value === 'upload-folder') openUpload('folder')
    if (item.value === 'folder') emit('add-folder', event)
  }

  const startUpload = (event: MouseEvent, files: File[]) => {
    emit('upload', event, { files, path: path.value })
    uploadOpen.value = false
  }

  const onPageDrop = (event: DragEvent, files: File[]) => {
    const accepted = files.filter((file) => file.size <= UPLOAD_LIMIT)
    if (accepted.length) emit('upload', event, { files: accepted, path: path.value })
    const refused = files.filter((file) => file.size > UPLOAD_LIMIT)
    if (refused.length) {
      toast.error(`${refused[0].name} is larger than 300 MB.`, {
        description: 'Files over the limit per file were left out of the upload.',
        position: 'top-end'
      })
    }
  }

  const transferItems = computed<FileBrowserTransfer[]>(() => props.transfers ?? [])

  const closeTransfer = async (event: MouseEvent) => {
    const moved = props.transferOperation === 'move'
    emit('close-transfer', event)
    await nextTick()
    const host = moved ? selectionHostEl.value : addHostEl.value
    host?.querySelector<HTMLElement>(moved ? 'input, button' : 'button')?.focus()
  }

  if (props.defaultMoveOpen) {
    openMove(selectedKeys.value.flatMap((name) => rows.value.filter((item) => item.id === name)))
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="flex h-full min-h-0 flex-col">
      <section
        key="section-error"
        v-if="error"
        class="flex min-h-0 flex-col"
      >
        <FolderErrorCard
          :root-name="rootName"
          :crumbs="pathCrumbs"
          :error="error"
          @navigate="onCrumb"
          @refresh="refresh"
          @retry="(event) => emit('retry', event)"
        />
      </section>
      <section
        key="section-files"
        v-else
        class="relative flex min-h-0 flex-col"
      >
        <FileDropzone
          variant="overlay"
          :title="`Drop files to upload them to ${folderPath.length ? folderPath.at(-1) : rootName}`"
          description="Up to 300 MB per file."
          @drop="onPageDrop"
        />
        <Card :padded="false">
          <template #default>
            <DataTable
              ref="tableEl"
              v-model:sorting="sorting"
              v-model:selected-keys="selectedKeys"
              :selectable="movable"
              :row-selectable="isFile"
              :data="sortedRows"
              :columns="fileColumns"
              row-key="id"
              sortable
              manual-sorting
              :bordered="false"
              :loading="loading"
              @row-click="onRowClick"
              @row-remove="onRowRemove"
            >
              <template #toolbar="{ selectedRows, selectedCount, clearSelection }">
                <div
                  ref="selectionHostEl"
                  class="flex w-full flex-col gap-(--spacing-sm)"
                >
                  <StorageTitle :name="rootName" />

                  <FolderSearchRow
                    v-model:search="search"
                    :loading="loading"
                    :exportable="!!tableEl"
                    @refresh="refresh"
                    @download="tableEl?.exportCsv({ filename: 'files.csv' })"
                  />

                  <div class="flex w-full items-center justify-between gap-(--spacing-xs)">
                    <div class="min-w-0 flex-1">
                      <Breadcrumb
                        :items="pathCrumbs"
                        class="w-full"
                        @navigate="onCrumb"
                      />
                    </div>
                    <div
                      ref="addHostEl"
                      class="shrink-0"
                    >
                      <SplitButton
                        label="Add to files"
                        icon="az az-plus"
                        variant="primary"
                        size="medium"
                        :items="addToFilesActions"
                        @click="onAddClick"
                        @item-click="onAddItem"
                      />
                    </div>
                  </div>

                  <SelectionBar
                    v-if="movable && selectedCount"
                    :selected-count="selectedCount"
                    :movable-selection="hasSelectedFiles(selectedRows)"
                    @clear="clearSelection()"
                    @move="openMove(selectedRows)"
                  />
                </div>
              </template>

              <template #cell-name="{ value, row: item }">
                <FileNameCell
                  :item="item"
                  :value="value"
                  @go-up="goUp"
                  @open="openEntry"
                />
              </template>

              <template #cell-bytes="{ row: item }">
                <span
                  dir="ltr"
                  class="text-(--text-muted)"
                  >{{ item.size }}</span
                >
              </template>

              <template #cell-modifiedAt="{ row: item }">
                <TableCellTime
                  v-if="item.modifiedAt"
                  :value="item.modifiedAt"
                  :author="item.author"
                />
              </template>

              <template #cell-actions="{ row: item }">
                <FileRowActions
                  :item="item"
                  :movable="movable"
                  @select="(event, { value }) => onRowAction(event, value, item)"
                />
              </template>

              <template #empty>
                <FolderEmpty
                  :search="search"
                  @clear-search="search = ''"
                  @add="onAddClick"
                  @add-item="onAddItem"
                />
              </template>
              <template #footer>
                <DataTablePagination
                  :page-size="50"
                  :page-size-options="[25, 50, 100]"
                />
              </template>
            </DataTable>
          </template>
        </Card>
      </section>
    </div>
    <DeleteEntryDialog
      v-model:open="deleteOpen"
      :pending="pending"
      @confirm="confirmDelete"
    />
    <UploadDialog
      v-model:open="uploadOpen"
      :upload-mode="uploadMode"
      :path="path"
      :root-name="rootName"
      @upload="startUpload"
    />
    <MoveDialog
      v-model:open="moveOpen"
      :moving="moving"
      :path="path"
      :root-name="rootName"
      :destination-options="destinationOptions"
      @move="confirmMove"
    />
    <TransferCard
      v-if="transferItems.length"
      :transfer-items="transferItems"
      :transfer-operation="transferOperation"
      @cancel="(event, id) => emit('cancel-transfer', event, id)"
      @retry="(event, id) => emit('retry-transfer', event, id)"
      @close="closeTransfer"
      @open-folder="(_event, target) => openFolder(target)"
    />
  </div>
</template>
```

## `sample.ts`

```ts
import type { FileBrowserEntry, FileBrowserTransfer } from './view-file-browser.vue'

const KB = 1024
const MB = 1024 * 1024
const modifiedAt = '2026-06-22T19:21:21Z'

const editors = [
  'Ethan Brooks',
  'Jordan Kim',
  'Taylor Reed',
  'John Smith',
  'Sam Lee',
  'Priya Patel',
  'Chris Taylor',
  'Riley Carter'
]

const folder = (name: string): FileBrowserEntry => ({ name, kind: 'folder' })

const files = (sizes: Record<string, number>): FileBrowserEntry[] =>
  Object.keys(sizes)
    .sort((a, b) => a.localeCompare(b))
    .map((name, index) => ({
      name,
      kind: 'file',
      bytes: Math.round(sizes[name]),
      modifiedAt,
      editor: editors[index % editors.length]
    }))

const BUILD_FOLDERS = ['assets/', 'css/', 'images/', 'js/']

const build: FileBrowserEntry[] = [
  ...BUILD_FOLDERS.map(folder),
  ...files({
    'favicon.svg': 1.25 * KB,
    '404.html': 17.75 * KB,
    'index.html': 6.03 * KB,
    'index.json': 183.1 * KB,
    'nunito-sans-bold-italic.woff2': 49.46 * KB,
    'nunito-sans-bold.woff2': 47.14 * KB,
    'nunito-sans-italic.woff2': 49.62 * KB,
    'nunito-sans-regular.woff2': 47.07 * KB,
    'project.json': 1.01 * KB
  })
]

const buildFolders = (prefix: string): Record<string, FileBrowserEntry[]> => ({
  [prefix]: build,
  ...Object.fromEntries(BUILD_FOLDERS.map((name) => [prefix + name, []]))
})

export const sampleStorageName = 'acme-assets'

export const sampleFolders: Record<string, FileBrowserEntry[]> = {
  '': [
    folder('20260622162046/'),
    folder('20260610093012/'),
    folder('logs/'),
    ...files({ 'robots.txt': 64 })
  ],
  ...buildFolders('20260622162046/'),
  ...buildFolders('20260610093012/'),
  'logs/': files({ 'access.log': 2.4 * MB, 'error.log': 128 * KB })
}

export const sampleTransfers: FileBrowserTransfer[] = [
  { id: 'u-1', name: 'index.html', size: 6175, status: 'success', target: '' },
  { id: 'u-2', name: 'app.js', size: 248_320, status: 'running', progress: 46, target: '' },
  { id: 'u-3', name: 'styles.css', size: 52_100, status: 'running', progress: 12, target: '' },
  { id: 'u-4', name: 'intro.mp4', size: 96_400_000, status: 'pending', target: '' },
  { id: 'u-5', name: 'hero.webp', size: 1_482_000, status: 'pending', target: '' }
]
```

## `azion-storage.ts`

```ts
import type { FileBrowserEntry } from './view-file-browser.vue'

/** One object of a bucket listing; the key is its full path. */
export interface AzionStorageObject {
  /** Full path of the object; a folder key ends in a slash. */
  key: string
  /** When the object changed last, as an ISO time. */
  last_modified: string
  /** Size in bytes. */
  size: number
  /** Whether the key is a folder marker. */
  is_folder?: boolean
}

/** The body of GET /v4/storage/buckets/{bucket}/objects. */
export interface AzionStorageObjectsResponse {
  /** Pass it back as continuation_token for the next page; null on the last page. */
  continuation_token: string | null
  /** The objects of this page. */
  results: AzionStorageObject[]
}

export const toFileBrowserEntries = (
  listing: AzionStorageObjectsResponse | AzionStorageObject[],
  prefix = ''
): FileBrowserEntry[] => {
  const objects = Array.isArray(listing) ? listing : listing.results
  const folders = new Set<string>()
  const files: FileBrowserEntry[] = []
  for (const object of objects) {
    if (!object.key.startsWith(prefix)) continue
    const rest = object.key.slice(prefix.length)
    if (!rest) continue
    const slash = rest.indexOf('/')
    if (slash >= 0) folders.add(rest.slice(0, slash + 1))
    else if (object.is_folder) folders.add(`${rest}/`)
    else
      files.push({
        name: rest,
        kind: 'file',
        bytes: object.size,
        modifiedAt: object.last_modified
      })
  }
  return [...[...folders].map((name): FileBrowserEntry => ({ name, kind: 'folder' })), ...files]
}
```

## `lib/file-rows.ts`

```ts
import type { TableColumn } from '@aziontech/webkit/data-table'

import type { FileBrowserEntry, FileBrowserEntryKind } from '../view-file-browser.vue'

/** What a row of the listing is: an entry, or the parent folder link. */
export type FileRowKind = FileBrowserEntryKind | 'parent'

/** One row of the listing table. */
export interface FileRow {
  /** The name shown; a folder ends in a slash, the parent link is two dots. */
  name: string
  /** The row key. */
  id: string
  /** Entry or parent link. */
  kind: FileRowKind
  /** The file glyph. */
  icon?: string
  /** The size as shown. */
  size: string
  /** The size in bytes, for sorting. */
  bytes: number
  /** When the file changed last. */
  modifiedAt?: string
  /** Who changed the file last. */
  author?: string
  /** The entry the row shows. */
  entry?: FileBrowserEntry
}

const GLYPHS: Record<string, string> = {
  svg: 'az az-image',
  webp: 'az az-image',
  png: 'az az-image',
  mp4: 'az az-video',
  html: 'az az-code',
  js: 'az az-code',
  css: 'az az-code',
  json: 'az az-database',
  woff2: 'az az-star',
  log: 'az az-align-left',
  txt: 'az az-file'
}

export const fileColumns: TableColumn[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    sortable: true,
    principal: true,
    hideable: false,
    grow: 3
  },
  { accessorKey: 'bytes', header: 'Size', sortable: true, minWidth: 80 },
  { accessorKey: 'modifiedAt', header: 'Last modified', sortable: true, minWidth: 80 },
  { id: 'actions', type: 'action', hideable: false }
]

export const addToFilesActions = [
  { label: 'Upload file', value: 'upload', icon: 'az az-upload' },
  { label: 'Upload folder', value: 'upload-folder', icon: 'az az-folder-open' },
  { label: 'Add folder', value: 'folder', icon: 'az az-folder-plus' }
]

export const UPLOAD_LIMIT = 300 * 1024 * 1024

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Number((bytes / 1024).toFixed(2))} KB`
  return `${Number((bytes / 1024 / 1024).toFixed(2))} MB`
}

const extensionOf = (name: string) => name.split('.').pop()?.toLowerCase() ?? ''

export const folderName = (name: string) => (name.endsWith('/') ? name : `${name}/`)

const fileRow = (name: string, entry?: FileBrowserEntry): FileRow => {
  const bytes = entry?.bytes ?? 0
  return {
    name,
    id: name,
    kind: 'file',
    icon: GLYPHS[extensionOf(name)] ?? 'az az-file',
    size: formatBytes(bytes),
    bytes,
    modifiedAt: entry?.modifiedAt,
    author: entry?.editor,
    entry
  }
}

const toRow = (kind: FileRowKind, name: string, entry?: FileBrowserEntry): FileRow => {
  if (kind === 'file') return fileRow(name, entry)
  return {
    name,
    id: name,
    kind,
    icon: undefined,
    size: '-',
    bytes: 0,
    modifiedAt: undefined,
    author: undefined,
    entry
  }
}

export const listRows = (entries: FileBrowserEntry[], nested: boolean): FileRow[] => {
  const ofKind = (kind: FileBrowserEntryKind) =>
    entries
      .filter((entry) => entry.kind === kind)
      .map((entry) => toRow(kind, kind === 'folder' ? folderName(entry.name) : entry.name, entry))
      .sort((a, b) => a.name.localeCompare(b.name))
  const list: FileRow[] = [...ofKind('folder'), ...ofKind('file')]
  if (nested && list.length) list.unshift(toRow('parent', '..'))
  return list
}

const compareFiles = (id: string) => (a: FileRow, b: FileRow) => {
  if (id === 'bytes') return a.bytes - b.bytes
  if (id === 'modifiedAt') return Date.parse(a.modifiedAt ?? '') - Date.parse(b.modifiedAt ?? '')
  return a.name.localeCompare(b.name)
}

export const sortRows = (rows: FileRow[], sort?: { desc: boolean; id: string }): FileRow[] => {
  if (!sort) return rows
  const direction = sort.desc ? -1 : 1
  const ordered = (kind: FileRowKind, id: string) =>
    rows.filter((item) => item.kind === kind).sort((a, b) => direction * compareFiles(id)(a, b))
  return [
    ...rows.filter((item) => item.kind === 'parent'),
    ...ordered('folder', sort.id === 'name' ? 'name' : ''),
    ...ordered('file', sort.id)
  ]
}

export const normalizeDestination = (raw: string) => {
  const target = raw.trim().replace(/\/+/g, '/').replace(/^\//, '')
  return target && !target.endsWith('/') ? `${target}/` : target
}

export const destinationProblem = (raw: string, path: string) => {
  const target = normalizeDestination(raw)
  if (/[^ -~]/.test(raw.trim())) return 'Use letters, numbers, dots, hyphens and slashes only.'
  if (target.split('/').includes('..'))
    return 'A destination cannot go up with "..". Type the full path.'
  if (target === path) return 'The files are already in this folder. Pick another one.'
  return ''
}
```

## `parts/delete-entry-dialog.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'

  import type { FileRow } from '../lib/file-rows'

  defineProps<{ pending: FileRow | null }>()

  const emit = defineEmits<{
    confirm: [event: Event]
  }>()

  const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    :title="pending?.kind === 'folder' ? 'Delete folder' : 'Delete file'"
    size="medium"
    :confirm-label="pending?.kind === 'folder' ? 'Delete folder' : 'Delete file'"
    :confirmation-phrase="pending?.name ?? ''"
    @confirm="(event: Event) => emit('confirm', event)"
  >
    <div class="flex flex-col gap-(--spacing-md)">
      <Alert
        severity="warning"
        label="Once confirmed, this action can't be reversed."
      />
      <p class="m-0 text-body-sm text-(--text-muted)">
        {{
          pending?.kind === 'folder'
            ? 'The selected folder will be deleted, along with all its files.'
            : 'The selected file will be deleted.'
        }}
      </p>
    </div>
  </ConfirmDialog>
</template>
```

## `parts/file-name-cell.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'

  import type { FileRow } from '../lib/file-rows'

  defineProps<{ item: FileRow; value: string }>()

  const emit = defineEmits<{
    'go-up': [event: MouseEvent]
    open: [event: MouseEvent, item: FileRow]
  }>()
</script>

<template>
  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
    <i
      v-if="item.kind === 'parent'"
      class="az az-folder-open shrink-0 text-body-lg text-(--text-muted)"
      aria-hidden="true"
    />
    <i
      v-else-if="item.kind === 'folder'"
      class="az az-folder shrink-0 text-body-lg text-(--text-link)"
      aria-hidden="true"
    />
    <i
      v-else
      :class="item.icon"
      class="shrink-0 text-body-lg text-(--text-muted)"
      aria-hidden="true"
    />
    <Button
      key="button-1"
      v-if="item.kind === 'parent'"
      variant="link"
      label=".."
      aria-label="Go up to the parent folder"
      @click.stop="(event: MouseEvent) => emit('go-up', event)"
    />
    <Button
      key="button-2"
      v-else-if="item.kind === 'folder'"
      variant="link"
      :label="value"
      dir="ltr"
      class="min-w-0"
      @click.stop="(event: MouseEvent) => emit('open', event, item)"
    />
    <span
      v-else
      dir="ltr"
      class="truncate"
      >{{ value }}</span
    >
  </div>
</template>
```

## `parts/file-row-actions.vue`

```ts
<script setup lang="ts">
  import type { DropdownMenuItemValue } from '@aziontech/webkit/data-table'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'

  import type { FileRow } from '../lib/file-rows'

  defineProps<{ item: FileRow; movable: boolean }>()

  const emit = defineEmits<{
    select: [event: Event, payload: { value: DropdownMenuItemValue; item: FileRow }]
  }>()
</script>

<template>
  <TableCellActions
    v-if="item.kind !== 'parent'"
    :name="item.name"
    @select="(event, value) => emit('select', event, { value, item })"
  >
    <DropdownMenuGroup>
      <DropdownMenuItem
        v-if="item.kind === 'folder'"
        key="open"
        value="open"
        label="Open"
      >
        <template #leading
          ><i
            class="az az-folder-open"
            aria-hidden="true"
        /></template>
      </DropdownMenuItem>
      <DropdownMenuItem
        v-else
        key="download"
        value="download"
        label="Download"
      >
        <template #leading
          ><i
            class="az az-download"
            aria-hidden="true"
        /></template>
      </DropdownMenuItem>
      <DropdownMenuItem
        v-if="movable && item.kind === 'file'"
        key="move"
        value="move"
        label="Move"
      >
        <template #leading
          ><i
            class="az az-arrow-right-left"
            aria-hidden="true"
        /></template>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuGroup>
      <DropdownMenuItem
        value="delete"
        label="Delete"
      >
        <template #leading
          ><i
            class="az az-trash"
            aria-hidden="true"
        /></template>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </TableCellActions>
</template>
```

## `parts/folder-empty.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import SplitButton, { type SplitButtonItem } from '@aziontech/webkit/split-button'

  import { addToFilesActions } from '../lib/file-rows'

  defineProps<{ search: string }>()

  const emit = defineEmits<{
    'clear-search': [event: MouseEvent]
    add: [event: MouseEvent]
    'add-item': [event: MouseEvent | KeyboardEvent, item: SplitButtonItem]
  }>()
</script>

<template>
  <EmptyState
    key="empty-state-1"
    v-if="search"
    size="medium"
    icon="az az-search"
    title="No matching files"
    :description="`Nothing in this folder matches “${search}”.`"
  >
    <template #actions>
      <Button
        label="Clear search"
        variant="outline"
        size="small"
        @click="(event: MouseEvent) => emit('clear-search', event)"
      />
    </template>
  </EmptyState>
  <EmptyState
    key="empty-state-2"
    v-else
    size="medium"
    title="This folder is empty"
    description="Upload files or create a folder to get started."
  >
    <template #actions>
      <SplitButton
        label="Add to files"
        icon="az az-plus"
        variant="secondary"
        size="medium"
        :items="addToFilesActions"
        @click="(event: MouseEvent) => emit('add', event)"
        @item-click="(event, item) => emit('add-item', event, item)"
      />
    </template>
  </EmptyState>
</template>
```

## `parts/folder-error-card.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Card from '@aziontech/webkit/card'
  import IconButton from '@aziontech/webkit/icon-button'
  import SplitButton from '@aziontech/webkit/split-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  import { addToFilesActions } from '../lib/file-rows'
  import StorageTitle from './storage-title.vue'

  defineProps<{
    rootName: string
    crumbs: { label: string; href: string }[]
    error: string
  }>()

  const emit = defineEmits<{
    navigate: [event: MouseEvent, href: string]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
  }>()
</script>

<template>
  <Card>
    <template #default>
      <div class="flex w-full flex-col gap-(--spacing-sm)">
        <StorageTitle :name="rootName" />
        <div class="flex w-full items-center justify-between gap-(--spacing-xs)">
          <div class="min-w-0 flex-1">
            <Breadcrumb
              :items="crumbs"
              class="w-full"
              @navigate="(event: MouseEvent, href: string) => emit('navigate', event, href)"
            />
          </div>
          <div class="flex shrink-0 items-center gap-(--spacing-xs)">
            <Tooltip content="Refresh">
              <IconButton
                icon="az az-refresh"
                variant="outline"
                size="medium"
                aria-label="Refresh"
                @click="(event: MouseEvent) => emit('refresh', event)"
              />
            </Tooltip>
            <SplitButton
              label="Add to files"
              icon="az az-plus"
              variant="primary"
              size="medium"
              :items="addToFilesActions"
              disabled
            />
          </div>
        </div>
        <Alert
          severity="danger"
          :label="error"
          action-label="Retry"
          @action="(event) => emit('retry', event)"
        />
      </div>
    </template>
  </Card>
</template>
```

## `parts/folder-search-row.vue`

```ts
<script setup lang="ts">
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableSearch from '@aziontech/webkit/table-search'
  import Tooltip from '@aziontech/webkit/tooltip'

  defineProps<{ loading: boolean; exportable: boolean }>()

  const search = defineModel<string>('search', { default: '' })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    download: [event: MouseEvent]
  }>()
</script>

<template>
  <div class="flex w-full items-center gap-(--spacing-xs)">
    <div class="flex flex-1">
      <TableSearch
        v-model="search"
        size="large"
        placeholder="Search in folder"
        class="w-full"
      />
    </div>
    <Tooltip
      content="Refresh"
      class="shrink-0"
    >
      <IconButton
        icon="az az-refresh"
        variant="outline"
        size="large"
        :loading="loading"
        aria-label="Refresh"
        @click="(event: MouseEvent) => emit('refresh', event)"
      />
    </Tooltip>
    <Tooltip
      content="Download CSV"
      class="shrink-0"
    >
      <IconButton
        icon="az az-download"
        variant="outline"
        size="large"
        :disabled="!exportable"
        aria-label="Download CSV"
        @click="(event: MouseEvent) => emit('download', event)"
      />
    </Tooltip>
    <CollectionPreferences
      :sections="['columns']"
      class="shrink-0"
    />
  </div>
</template>
```

## `parts/move-dialog.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Combobox from '@aziontech/webkit/combobox'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import Field from '@aziontech/webkit/field'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { computed, ref, watch } from 'vue'

  import {
    destinationProblem,
    type FileRow,
    formatBytes,
    normalizeDestination
  } from '../lib/file-rows'

  const props = defineProps<{
    moving: FileRow[]
    path: string
    rootName: string
    destinationOptions: { value: string; label?: string; description?: string }[]
  }>()

  const emit = defineEmits<{
    move: [event: Event, destination: string]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  const destination = ref('')
  const destinationError = ref('')

  const moveTitle = computed(() =>
    props.moving.length === 1 ? `Move ${props.moving[0].name}` : `Move ${props.moving.length} files`
  )
  const movingSize = computed(() =>
    formatBytes(props.moving.reduce((sum, item) => sum + item.bytes, 0))
  )

  watch(open, (now) => {
    if (!now) return
    destination.value = ''
    destinationError.value = ''
  })

  const confirmMove = (event: Event) => {
    destinationError.value = destinationProblem(destination.value, props.path)
    if (destinationError.value) return
    emit('move', event, normalizeDestination(destination.value))
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    size="medium"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <DialogTitle>{{ moveTitle }}</DialogTitle>
          <DialogDescription>
            {{ moving.length === 1 ? '1 file' : `${moving.length} files` }}, {{ movingSize }}, from
            {{ path || rootName }}. Pick a folder or type a new path; leave it empty for the storage
            root.
          </DialogDescription>
        </div>
      </PanelHeader>
      <PanelBody>
        <form
          class="flex flex-col gap-(--spacing-md)"
          novalidate
          @submit.prevent="confirmMove"
        >
          <ul
            aria-label="Files to move"
            class="m-0 flex list-none flex-col gap-(--spacing-2xs) p-0"
          >
            <li
              v-for="item in moving"
              :key="item.name"
              class="flex min-w-0 items-center gap-(--spacing-xs) text-body-sm text-(--text-default)"
            >
              <i
                class="az az-file shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="min-w-0 truncate">{{ item.name }}</span>
              <span class="ms-auto shrink-0 text-(--text-muted)">{{ item.size }}</span>
            </li>
          </ul>
          <Field :invalid="!!destinationError">
            <Field.Label>Destination folder</Field.Label>
            <Combobox
              v-model="destination"
              :options="destinationOptions"
              placeholder="/ (storage root)"
              size="large"
              clearable
              @update:model-value="destinationError = ''"
            />
            <Field.Description
              >A folder that does not exist yet is created with the move.</Field.Description
            >
            <Field.Error v-if="destinationError">{{ destinationError }}</Field.Error>
          </Field>
        </form>
      </PanelBody>
      <PanelFooter>
        <div class="flex w-full justify-end gap-(--spacing-xs)">
          <Button
            label="Cancel"
            variant="outline"
            size="medium"
            @click="open = false"
          />
          <Button
            :label="moving.length === 1 ? 'Move file' : `Move ${moving.length} files`"
            variant="primary"
            size="medium"
            @click="confirmMove"
          />
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>
```

## `parts/selection-bar.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'

  defineProps<{ selectedCount: number; movableSelection: boolean }>()

  const emit = defineEmits<{
    clear: [event: MouseEvent]
    move: [event: MouseEvent]
  }>()
</script>

<template>
  <div
    class="flex w-full flex-wrap items-center gap-(--spacing-xs) rounded-(--shape-control) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
  >
    <span class="text-label-sm text-(--text-default)">{{ selectedCount }} selected</span>
    <Button
      label="Clear selection"
      variant="ghost"
      size="small"
      @click="(event: MouseEvent) => emit('clear', event)"
    />
    <div class="ms-auto flex items-center gap-(--spacing-xs)">
      <Button
        label="Move"
        icon="az az-arrow-right-left"
        variant="outline"
        size="small"
        :disabled="!movableSelection"
        @click="(event: MouseEvent) => emit('move', event)"
      />
    </div>
  </div>
</template>
```

## `parts/storage-title.vue`

```ts
<script setup lang="ts">
  defineProps<{ name: string }>()
</script>

<template>
  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
    <i
      class="az az-database shrink-0 text-body-lg text-(--text-muted)"
      aria-hidden="true"
    />
    <h1 class="min-w-0 truncate text-heading-2xs text-(--text-default)">
      {{ name }}
    </h1>
  </div>
</template>
```

## `parts/transfer-card.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import UploadProgress from '@aziontech/webkit/upload-progress'
  import { computed, ref } from 'vue'

  import type { FileBrowserTransfer, FileBrowserTransferOperation } from '../view-file-browser.vue'

  const props = defineProps<{
    transferItems: FileBrowserTransfer[]
    transferOperation: FileBrowserTransferOperation
  }>()

  const emit = defineEmits<{
    cancel: [event: MouseEvent, id?: string]
    retry: [event: MouseEvent, id?: string]
    close: [event: MouseEvent]
    'open-folder': [event: MouseEvent, target: string]
  }>()

  const transferExpanded = ref(true)
  const lastTarget = computed(
    () => props.transferItems.find((item) => item.status === 'success')?.target ?? ''
  )
</script>

<template>
  <UploadProgress
    v-model:open="transferExpanded"
    :items="transferItems"
    :operation="transferOperation"
    :cancelable="transferOperation === 'upload'"
    @cancel="(event, id) => emit('cancel', event, id)"
    @retry="(event, id) => emit('retry', event, id)"
    @close="(event) => emit('close', event)"
  >
    <template
      v-if="transferOperation === 'upload'"
      #actions
    >
      <Button
        v-if="transferItems.some((item) => item.status === 'success')"
        label="Open folder"
        variant="secondary"
        size="small"
        @click="(event: MouseEvent) => emit('open-folder', event, lastTarget)"
      />
    </template>
  </UploadProgress>
</template>
```

## `parts/upload-dialog.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup, { type FileTokenGroupItem } from '@aziontech/webkit/file-token-group'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { useFilePicker } from '@aziontech/webkit/use-file-picker'
  import { computed, ref, watch } from 'vue'

  import { UPLOAD_LIMIT } from '../lib/file-rows'

  type PickedFile = FileTokenGroupItem & { file: File }

  defineProps<{
    uploadMode: 'files' | 'folder'
    path: string
    rootName: string
  }>()

  const emit = defineEmits<{
    upload: [event: MouseEvent, files: File[]]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  const picked = ref<PickedFile[]>([])
  const filePicker = useFilePicker({ multiple: true })
  const folderPicker = useFilePicker({ directory: true })

  const toPicked = (file: File): PickedFile => ({
    file,
    error: file.size > UPLOAD_LIMIT ? 'Larger than 300 MB, the limit per file' : undefined,
    warning: file.size === 0 ? 'This file is empty' : undefined
  })
  const pickable = computed(() => picked.value.filter((item) => !item.error))
  const addPicked = (files: FileList | File[]) => {
    picked.value = [...picked.value, ...Array.from(files).map(toPicked)]
  }
  const pickFrom = async (picker: typeof filePicker) => addPicked(await picker.open())
  const removePicked = (index: number) => {
    picked.value = picked.value.filter((_, position) => position !== index)
  }

  watch(open, (now) => {
    if (now) picked.value = []
  })

  const startUpload = (event: MouseEvent) => {
    if (!pickable.value.length) return
    emit(
      'upload',
      event,
      pickable.value.map((item) => item.file)
    )
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    size="medium"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <DialogTitle>{{
            uploadMode === 'folder' ? 'Upload folder' : 'Upload files'
          }}</DialogTitle>
          <DialogDescription>
            {{ uploadMode === 'folder' ? 'The folder and its subfolders go' : 'Files go' }} to
            {{ path || rootName }}. A file with the same path is replaced.
          </DialogDescription>
        </div>
      </PanelHeader>
      <PanelBody>
        <div class="flex flex-col gap-(--spacing-md)">
          <FileDropzone
            :directories="uploadMode === 'folder'"
            :title="uploadMode === 'folder' ? 'Drop a folder to upload' : undefined"
            description="Up to 300 MB per file."
            @drop="(_event, files) => addPicked(files)"
          >
            <Button
              key="button-1"
              v-if="uploadMode === 'folder'"
              label="Browse folder"
              variant="secondary"
              size="medium"
              icon="az az-folder-open"
              @click="pickFrom(folderPicker)"
            />
            <Button
              key="button-2"
              v-else
              label="Browse files"
              variant="secondary"
              size="medium"
              @click="pickFrom(filePicker)"
            />
          </FileDropzone>
          <FileTokenGroup
            v-if="picked.length"
            :items="picked"
            :limit="5"
            aria-label="Files to upload"
            @remove="(_event, { index }) => removePicked(index)"
          />
        </div>
      </PanelBody>
      <PanelFooter>
        <div class="flex w-full justify-end gap-(--spacing-xs)">
          <Button
            label="Cancel"
            variant="outline"
            size="medium"
            @click="open = false"
          />
          <Button
            :label="pickable.length > 1 ? `Upload ${pickable.length} files` : 'Upload file'"
            variant="primary"
            size="medium"
            icon="az az-upload"
            :disabled="!pickable.length"
            @click="startUpload"
          />
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>
```
