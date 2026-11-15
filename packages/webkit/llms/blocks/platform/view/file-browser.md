# FileBrowser (`platform/view/file-browser`)

> The file browser a storage resource opens on: one flush `Card` holding a borderless `DataTable` whose toolbar is the whole page header. The toolbar stacks the storage name beside the storage glyph, a large row of the table’s own search plus the refresh and download IconButtons and the `CollectionPreferences` (columns section), then a `Breadcrumb` of the folder path beside the Add to files `SplitButton` (Upload file, Add folder). Folders stay first under any sort with a link-coloured folder glyph and a link-button name that opens them, a .. row leads back up once inside a folder, Size sorts on bytes and Last modified on the timestamp, the rows page at 50, files take a glyph by extension, Size is muted and Last modified is `Table.CellTime` (the editor's avatar and a relative time); folders carry Open and files Download in their row menu, with Delete below, which opens a `ConfirmDialog` (a warning `Alert` and an `Input` that must match the name). An empty folder renders the table’s empty slot: an `EmptyState` (This folder is empty) with a secondary Add to files split button, and a search that matches nothing shows No matching files with Clear search; inside a folder the .. row always remains. Built from `Card`, `DataTable` with `TableSearch`, `IconButton`, `Tooltip`, `CollectionPreferences` (columns section), `Breadcrumb`, `SplitButton`, `Table.CellTime`, `Table.CellActions` and `EmptyState`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/view/file-browser/file-browser.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/view/file-browser")`
- Components: [Alert](../../../components/alert.md), [Breadcrumb](../../../components/breadcrumb.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [CollectionPreferences](../../../components/collection-preferences.md), [Combobox](../../../components/combobox.md), [ConfirmDialog](../../../components/confirm-dialog.md), [DataTable](../../../components/data-table.md), `DialogContent`, `DialogDescription`, [Dialog](../../../components/dialog.md), `DialogTitle`, `DropdownMenuGroup`, `DropdownMenuOption`, [EmptyState](../../../components/empty-state.md), [Field](../../../components/field.md), [FileDropzone](../../../components/file-dropzone.md), [FileTokenGroup](../../../components/file-token-group.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [SplitButton](../../../components/split-button.md), [Table](../../../components/table.md), `TableSearch`, [Toast](../../../components/toast.md), [Tooltip](../../../components/tooltip.md), [UploadProgress](../../../components/upload-progress.md)
- Skills: `webkit-tables`, `webkit-lists`, `webkit-ui-states`

## Asked as

file browser; file manager; storage browser; bucket browser; object storage; folders and files; upload files; navegador de arquivos; gerenciador de arquivos; arquivos do bucket; upload progress; move files; move objects; drag and drop upload; enviar arquivos; mover arquivos

The contents of one storage resource. The user opens a bucket to find a file, walk into a folder and back out, upload something or add a folder, and download or delete what is there. The table's toolbar is the whole page header, so the storage name, search, the folder path and Add to files all sit on the one surface the files live on.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

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

### A. Surface — `Card`, `DataTable` (required)

One `Card :padded="false"` around a `DataTable :bordered="false"` with `row-key`, `enable-sorting` with `manual-sorting` and `v-model:sorting` (the block orders the rows so `..` and the folders stay first: Size sorts on a numeric `bytes` field and Last modified on the `modifiedAt` timestamp, within folders and within files), `v-model:global-filter`, `paginated` at 50 rows (25, 50, 100), `:loading` and an `export-filename`. Name is the `principal` column; actions are `kind: 'action'` and not hideable. Everything above the rows lives in the table's `#toolbar` slot, so there is no separate page heading.

### B. Storage title and search — `TableSearch` (required)

The toolbar opens with the storage glyph and the storage name, the page's `h1`, truncated on one line. Below it a large `TableSearch` fills the row, searching inside the table with the placeholder "Search in folder"; it searches the current folder, not the whole bucket.

### C. Toolbar actions — `Tooltip`, `IconButton` (optional)

Large outlined `IconButton`s for Refresh (`:loading` while the listing reloads) and Download CSV (`exportCsv` on the table ref), each named by a `Tooltip` and an `aria-label` with the same words. They sit on the search row and act on the listing.

### D. Columns — `CollectionPreferences` (optional)

The last toolbar control is `CollectionPreferences` with only its columns section (`:sections="['columns']"`), which reads the table's columns from context: one switch per column with its order, Name locked, and Confirm writes them back to the table. Do not build a popover of `Switch`es by hand.

### E. Path and create — `Breadcrumb`, `SplitButton` (required)

A `Breadcrumb` of the folder path starts at the storage name; each crumb jumps back to that depth. Beside it the primary medium Add to files `SplitButton` offers Upload file and Add folder. It is the page's only primary action.

### F. Cell recipes — `Table.CellTime` (optional)

Folders sort first with a link-coloured folder glyph; the folder name is a `Button kind="link"` that opens it (a row click does the same for a pointer), and the `..` name is a link button named Go up to the parent folder; a `..` row leads back up once inside a folder; files take a glyph by extension. Size is muted. Last modified is `Table.CellTime`: the editor's avatar and a relative time that updates every minute, with the absolute time in its tooltip.

### G. Row actions — `Table.CellActions`, `DropdownMenuGroup`, `DropdownMenuOption` (required)

`Table.CellActions`, named after the file ("Actions for logo.svg"), opens a menu placed `bottom-end`: Open for a folder or Download for a file in the first group, Delete alone in the last group. The `..` row has no menu.

### H. Delete confirmation — `ConfirmDialog`, `Alert`, `Input` (required)

The root's `select` event hands the option and the row to the page: Open enters the folder, Delete opens the `platform/delete/delete-with-confirmation` dialog without a trigger of its own. A medium `ConfirmDialog` titled `Delete file` or `Delete folder`, a warning `Alert` (`Once confirmed, this action can't be reversed.`), one sentence of consequence (a folder goes with all its files), and an `Input` labelled by `Type <name> to confirm.`; the danger confirm repeats the title and enables only when the typed text matches the name. The typed text resets each time it opens.

### I. Empty folder — `EmptyState`, `SplitButton` (required)

When the search is set, the table's `#empty` slot holds a medium `EmptyState`, No matching files, with an outlined Clear search; otherwise it holds a medium `EmptyState` with one sentence and a secondary Add to files `SplitButton` with the same options as the toolbar's. Inside a folder the `..` row always remains, so the user can still go back up.

### J. Upload — `SplitButton` (optional)

Variant Uploading only; it adds `Dialog` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `FileDropzone` and `FileTokenGroup` to the page.

Add to files and its Upload file option open a medium `Dialog` titled Upload files whose description names the destination folder and that a file with the same name is replaced. Inside: an inline `FileDropzone` (`Up to 300 MB per file.`) with a secondary Browse files `Button` wired to a hidden `<input type="file" multiple>`, then a `FileTokenGroup` (`limit` 5) of the picked files. A file over the limit stays in the group with its reason (`Larger than 300 MB, the limit per file`), an empty file with a warning, and both are left out of the count: the primary button reads `Upload 3 files` and is disabled while nothing can be sent. Upload closes the dialog and starts the transfer; the dialog does not wait for it. In the Uploading variant Add to files also offers Upload folder: the same dialog titled Upload folder, a `FileDropzone` with `directories` (a dropped folder is walked) and a Browse folder `Button` wired to a hidden `<input type="file" webkitdirectory>`; the tokens and the transfer rows name each file by its path inside the folder (`site/css/main.css`), and as files finish their folders appear in the table under the folder in view.

A second `FileDropzone kind="overlay"` sits inside the `section` that holds the card (made `relative`), so dragging files anywhere over the page shows `Drop files to upload them to <folder>` over the listing; a drop uploads straight into the folder in view and refuses files over the limit with a danger toast.

### K. Transfer card and outcome toast — `Button` (optional)

Variants Uploading and MoveObject only; they add `UploadProgress` and raise their toasts with `toast`.

Every transfer (upload, move) runs in one floating `UploadProgress` at the inline-end bottom corner, so the person can keep browsing, change folder or open another resource while it runs. The header counts finished files over one overall bar (`Uploading 2 of 5 files`), each row carries its bar, Cancel while it runs or waits, Retry when it failed with the reason under the name. Files land in the table as each finishes, not at the end. Close appears when everything finished and returns focus to Add to files (or to the toolbar, after a move). At most two files upload at a time; the rest wait.

When a transfer finishes the page reports it with a toast as well as the card, because the card may be collapsed or the person may be elsewhere. Its actions fit the files, never a deploy action: after a clean upload or move, `Open folder` (goes to the destination); after a partial upload, a danger toast `1 of 5 files weren't uploaded.` that says where the rest went and offers `Retry failed`. Storage objects are not deployed, so the async-submit Edit and Redeploy pair does not apply. Each of these toasts passes `position: 'top-right'` so it never covers the transfer card, whatever corner the app's region defaults to.

### L. Selection and Move — `DataTable`, `DropdownMenuOption` (optional)

Variant MoveObject only; it adds `Dialog` and its parts, `Field` and `Combobox`.

`enable-row-selection` with `v-model:row-selection` adds the checkbox column, and `:row-selectable="(row) => row.kind === 'file'"` keeps it to files: folders and the `..` row draw no checkbox and Select all skips them; the toolbar slot's `selectedCount`, `selectedRows` and `clearSelection` drive a selection bar (`2 selected`, Clear selection, Move). Every file's row menu gains Move between Download and Delete. Move opens a medium `Dialog` titled `Move index.html` or `Move 2 files`; its description gives the count, the total size and the folder they leave, the files are listed by name and size, and one `Field` holds a large clearable `Combobox` of every folder in the storage (the root first, as `/`) that also accepts a new path (`A folder that does not exist yet is created with the move.`). On Move the path is normalised (one slash between segments, no leading slash, a trailing slash) and validated: printable ASCII only, no `..`, not the folder the files are in; each failure is a `Field.Error` under the field and nothing moves.

## Do

- Keep the storage name, search, path and Add to files inside the table toolbar, on the same surface as the rows.
- Sort folders before files, keep `..` first under any sort, and sort Size and Last modified on numbers, never on display strings.
- Show the path as a `Breadcrumb` and keep the `..` row while inside a folder.
- Use one Add to files `SplitButton` for every way of adding content.
- Put Delete last in the row menu, in its own group, and confirm it with `platform/delete/delete-with-confirmation`.
- Give every icon-only control a `Tooltip` and an `aria-label` with the same words.
- Keep refused files in the upload dialog with their reason, and leave them out of the upload count.
- Run every transfer in the one floating `UploadProgress` card and let the person keep working.
- End every transfer with a toast whose action fits the files: Open folder or Retry failed.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so this page body never renders a `Toaster`.

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
- `Table.CellTime` names the author and reads the absolute time to screen readers.
- The drop overlay is `aria-hidden`: dragging is a pointer path, and Add to files with Browse files is the keyboard path to the same upload.
- `UploadProgress` is a region named File transfers with a polite status that announces each file finishing and the outcome; percentages are not announced. The toast repeats the outcome for people who collapsed the card.
- In the upload dialog each refused file's reason is the `aria-describedby` of its Remove button, and removing a file moves focus to the next one.
- The Move dialog's `Field` wires the label, description and error to the `Combobox`; the error is read when focus returns to it.

## States

- Default: the storage root with folders first, then files, and the full toolbar.
- InsideAFolder: inside a build folder the crumb gains the folder, a `..` row leads back up and files show glyph, size, editor and age.
- Uploading: a transfer is running in the floating card; one file fails once and can be retried; the upload dialog and the page drop overlay add more.
- Empty: an empty folder (`assets/` of a build); the `..` row stays and the empty state offers Add to files.
- Failed: the folder could not load; the storage name, the path and Refresh stay, Add to files is disabled and a danger `Alert` with Retry takes the table's place.
- MoveObject: two files selected inside a build folder with the Move dialog open; moving runs in the card and ends in a toast.

## Related

- `platform/view/table-view` — the first-level list a storage resource is opened from.
- `platform/delete/delete-with-confirmation` — the dialog behind Delete on a file or folder.
- `platform/detail/details-page` — the storage resource's own details and settings.
- `platform/detail/record-table` — records of a resource, not files.
- `FileTokenGroup`, `FileDropzone` and `UploadProgress` — the upload pieces; see their component docs.
- `platform/states/async-submit` — the rule for long actions; storage transfers follow it with item actions instead of Edit and Redeploy.
- `DataTable` — the data-driven table this page wraps; see `skills/webkit-tables` and `skills/webkit-lists`.

## Variants

- `Default` — primary (the code below)
- `InsideAFolder` — Inside a build folder: the crumb gains the folder, a .. row leads back up, and the files carry their glyph, size, editor and age.
- `Uploading` — An upload into the storage root is running: the floating `UploadProgress` card counts finished files over one bar, gives each file its bar, Cancel and, when a file fails, Retry, and finished files join the table as they land. Add to files opens the Upload files dialog (`FileDropzone` plus a `FileTokenGroup` that keeps files over 300 MB in the list with the reason and leaves them out of the upload); dragging files anywhere over the page shows the drop overlay for the folder in view. Upload folder opens the same dialog for a folder (`FileDropzone directories` and a Browse folder picker); each file keeps its path and its folders appear in the table as files land. The outcome is reported by a toast whose actions fit the files: Open folder after a clean upload, Retry failed after a partial one.
- `Empty` — An empty folder inside a build: the crumb names it, the .. row stays, and the table's empty slot holds This folder is empty with a secondary Add to files split button.
- `Failed` — The folder could not load: the storage name, the path and Refresh stay, Add to files is disabled, and a danger Alert with Retry takes the table's place.
- `MoveObject` — Two files of a build folder are selected and the Move dialog is open: it names the files, their total size and the folder they leave, and the Destination folder `Combobox` offers every folder in the storage and accepts a new path. A path with characters outside printable ASCII, with `..`, or equal to the current folder is refused under the field. Move runs in the floating `UploadProgress` card (`operation="move"`) and ends in a toast with Open folder. Selecting rows shows a selection bar with Move, and every file's row menu has Move.

Each variant is the same screen in another state: `get_pattern("platform/view/file-browser", { variant })`, or the file under `blocks/platform/view/file-browser/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DataTable, {
    type DropdownMenuOptionValue,
    type TableColumn,
    type TableExposed
  } from '@aziontech/webkit/data-table'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import SplitButton from '@aziontech/webkit/split-button'
  import Table from '@aziontech/webkit/table'
  import TableSearch from '@aziontech/webkit/table-search'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, useId } from 'vue'

  type FileEntry = { size: string; ext: string; lastModified: string }
  type FolderEntry = { children: FolderTree }
  type TreeEntry = FileEntry | FolderEntry

  interface FolderTree {
    [name: string]: TreeEntry
  }

  type RowKind = 'folder' | 'file' | 'parent'

  interface FileRow {
    id: string
    name: string
    kind: RowKind
    icon?: string
    size: string
    bytes: number
    modifiedAt?: string
    author?: string
  }

  const folderPath = ref<string[]>([])
  const rootName = 'acme-assets'

  const file = (size: string, ext: string): FileEntry => ({
    size,
    ext,
    lastModified: '2026-06-22T19:21:21Z'
  })

  const SITE_BUILD = {
    'assets/': { children: {} },
    'css/': { children: {} },
    'images/': { children: {} },
    'js/': { children: {} },
    'favicon.svg': file('1.25 KB', 'svg'),
    '404.html': file('17.75 KB', 'html'),
    'index.html': file('6.03 KB', 'html'),
    'index.json': file('183.1 KB', 'json'),
    'nunito-sans-bold-italic.woff2': file('49.46 KB', 'woff2'),
    'nunito-sans-bold.woff2': file('47.14 KB', 'woff2'),
    'nunito-sans-italic.woff2': file('49.62 KB', 'woff2'),
    'nunito-sans-regular.woff2': file('47.07 KB', 'woff2'),
    'project.json': file('1.01 KB', 'json')
  } satisfies FolderTree

  const tree: FolderTree = {
    '20260622162046/': { children: SITE_BUILD },
    '20260610093012/': { children: SITE_BUILD },
    'logs/': {
      children: {
        'access.log': file('2.4 MB', 'log'),
        'error.log': file('128 KB', 'log')
      }
    },
    'robots.txt': file('64 B', 'txt')
  }

  const people = [
    'Ethan Brooks',
    'Jordan Kim',
    'Taylor Reed',
    'John Smith',
    'Sam Lee',
    'Priya Patel',
    'Chris Taylor',
    'Riley Carter'
  ]

  const GLYPHS: Record<string, string> = {
    svg: 'pi pi-image',
    html: 'pi pi-code',
    json: 'pi pi-database',
    woff2: 'pi pi-star',
    log: 'pi pi-align-left',
    txt: 'pi pi-file'
  }

  const columns: TableColumn[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      principal: true,
      hideable: false,
      grow: 3
    },
    { accessorKey: 'bytes', header: 'Size', enableSorting: true, minWidth: 80 },
    { accessorKey: 'modifiedAt', header: 'Last modified', enableSorting: true, minWidth: 80 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const addToFilesActions = [
    { label: 'Upload file', value: 'upload', icon: 'pi pi-upload' },
    { label: 'Add folder', value: 'folder', icon: 'pi pi-folder-plus' }
  ]

  const sizeBytes = (size: string) => {
    const match = /^([\d.]+)\s*(B|KB|MB)$/.exec(size)
    if (!match) return 0
    const unit: Record<string, number> = { B: 1, KB: 1024, MB: 1024 * 1024 }
    return Number(match[1]) * unit[match[2]]
  }

  const removed = ref<string[]>([])
  const pending = ref<FileRow | null>(null)
  const deleteOpen = ref(false)
  const confirmation = ref('')
  const confirmLabelId = useId()
  const entryPath = (name: string) => [...folderPath.value, name].join('')
  const canDelete = computed(
    () => pending.value !== null && confirmation.value.trim() === pending.value.name
  )

  const onRowAction = (value: DropdownMenuOptionValue, row: FileRow) => {
    if (value === 'open') enterFolder(row.name)
    if (value !== 'delete') return
    pending.value = row
    confirmation.value = ''
    deleteOpen.value = true
  }

  const confirmDelete = () => {
    if (!canDelete.value || !pending.value) return
    removed.value = [...removed.value, entryPath(pending.value.name)]
    deleteOpen.value = false
  }

  const tableRef = ref<TableExposed<FileRow> | null>(null)
  const isFolder = (entry: TreeEntry | undefined): entry is FolderEntry =>
    Boolean(entry && 'children' in entry)
  const isFileEntry = (pair: [string, TreeEntry]): pair is [string, FileEntry] => !isFolder(pair[1])
  const childrenOf = (entry: TreeEntry | undefined) =>
    isFolder(entry) ? entry.children : undefined

  const currentFolder = computed<FolderTree>(() => {
    let node: FolderTree | undefined = tree
    for (const segment of folderPath.value) {
      node = childrenOf(node?.[segment])
      if (!node) return {}
    }
    return node
  })

  const rows = computed<FileRow[]>(() => {
    const entries = Object.entries(currentFolder.value).filter(
      ([name]) => !removed.value.includes(entryPath(name))
    )
    const folders = entries
      .filter(([, entry]) => isFolder(entry))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name]): FileRow => ({ id: name, name, kind: 'folder', size: '-', bytes: 0 }))
    const files = entries
      .filter(isFileEntry)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, entry], index): FileRow => ({
        id: name,
        name,
        kind: 'file',
        icon: GLYPHS[entry.ext] ?? 'pi pi-file',
        size: entry.size,
        bytes: sizeBytes(entry.size),
        modifiedAt: entry.lastModified,
        author: people[index % people.length]
      }))
    const list: FileRow[] = [...folders, ...files]
    if (folderPath.value.length) {
      list.unshift({ id: '..', name: '..', kind: 'parent', size: '-', bytes: 0 })
    }
    return list
  })

  const sorting = ref<{ id: string; desc: boolean }[]>([])
  const compareFiles = (id: string) => (a: FileRow, b: FileRow) => {
    if (id === 'bytes') return a.bytes - b.bytes
    if (id === 'modifiedAt') return Date.parse(a.modifiedAt ?? '') - Date.parse(b.modifiedAt ?? '')
    return a.name.localeCompare(b.name)
  }
  const sortedRows = computed<FileRow[]>(() => {
    const [sort] = sorting.value
    if (!sort) return rows.value
    const direction = sort.desc ? -1 : 1
    const ordered = (kind: RowKind, id: string) =>
      rows.value
        .filter((row) => row.kind === kind)
        .sort((a, b) => direction * compareFiles(id)(a, b))
    return [
      ...rows.value.filter((row) => row.kind === 'parent'),
      ...ordered('folder', sort.id === 'name' ? 'name' : ''),
      ...ordered('file', sort.id)
    ]
  })

  const search = ref('')

  const enterFolder = (name: string) => {
    folderPath.value = [...folderPath.value, name]
  }
  const goUp = () => {
    folderPath.value = folderPath.value.slice(0, -1)
  }
  const onRowClick = (_event: MouseEvent, row: FileRow) => {
    if (row.kind === 'parent') goUp()
    if (row.kind === 'folder') enterFolder(row.name)
  }

  const pathCrumbs = computed(() => [
    { label: rootName, href: '0' },
    ...folderPath.value.map((segment, index) => ({ label: segment, href: String(index + 1) }))
  ])
  const onCrumb = (event: MouseEvent, href: string) => {
    event.preventDefault()
    const depth = Number(href)
    if (Number.isFinite(depth)) folderPath.value = folderPath.value.slice(0, depth)
  }

  const loading = ref(false)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="flex h-full min-h-0 flex-col">
      <section class="flex min-h-0 flex-col">
        <Card :padded="false">
          <template #content>
            <DataTable
              ref="tableRef"
              v-model:sorting="sorting"
              v-model:global-filter="search"
              :data="sortedRows"
              :columns="columns"
              row-key="id"
              enable-sorting
              manual-sorting
              paginated
              :page-size="50"
              :page-size-options="[25, 50, 100]"
              :bordered="false"
              :loading="loading"
              export-filename="files.csv"
              @row-click="onRowClick"
            >
              <template #toolbar>
                <div class="flex w-full flex-col gap-(--spacing-sm)">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="pi pi-database shrink-0 text-body-lg text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <h1 class="min-w-0 truncate text-heading-xxs text-(--text-default)">
                      {{ rootName }}
                    </h1>
                  </div>

                  <div class="flex w-full items-center gap-(--spacing-xs)">
                    <div class="flex flex-1">
                      <TableSearch
                        size="large"
                        placeholder="Search in folder"
                        class="w-full"
                      />
                    </div>
                    <Tooltip
                      text="Refresh"
                      class="shrink-0"
                    >
                      <IconButton
                        icon="pi pi-refresh"
                        kind="outlined"
                        size="large"
                        :loading="loading"
                        aria-label="Refresh"
                        @click="refresh"
                      />
                    </Tooltip>
                    <Tooltip
                      text="Download CSV"
                      class="shrink-0"
                    >
                      <IconButton
                        icon="pi pi-download"
                        kind="outlined"
                        size="large"
                        :disabled="!tableRef"
                        aria-label="Download CSV"
                        @click="tableRef?.exportCsv({ filename: 'files.csv' })"
                      />
                    </Tooltip>
                    <CollectionPreferences
                      :sections="['columns']"
                      class="shrink-0"
                    />
                  </div>

                  <div class="flex w-full items-center justify-between gap-(--spacing-xs)">
                    <div class="min-w-0">
                      <Breadcrumb
                        :items="pathCrumbs"
                        class="w-full"
                        @navigate="onCrumb"
                      />
                    </div>
                    <SplitButton
                      label="Add to files"
                      icon="pi pi-plus"
                      kind="primary"
                      size="medium"
                      :items="addToFilesActions"
                      class="shrink-0"
                    />
                  </div>
                </div>
              </template>

              <template #cell-name="{ value, row }">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    v-if="row.kind === 'parent'"
                    class="pi pi-folder-open shrink-0 text-body-lg text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <i
                    v-else-if="row.kind === 'folder'"
                    class="pi pi-folder shrink-0 text-body-lg text-(--text-link)"
                    aria-hidden="true"
                  />
                  <i
                    v-else
                    :class="row.icon"
                    class="shrink-0 text-body-lg text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <Button
                    key="button-1"
                    v-if="row.kind === 'parent'"
                    kind="link"
                    label=".."
                    aria-label="Go up to the parent folder"
                    @click.stop="goUp"
                  />
                  <Button
                    key="button-2"
                    v-else-if="row.kind === 'folder'"
                    kind="link"
                    :label="value"
                    class="min-w-0"
                    @click.stop="enterFolder(row.name)"
                  />
                  <span
                    v-else
                    class="truncate"
                    >{{ value }}</span
                  >
                </div>
              </template>

              <template #cell-bytes="{ row }">
                <span class="text-(--text-muted)">{{ row.size }}</span>
              </template>

              <template #cell-modifiedAt="{ row }">
                <Table.CellTime
                  v-if="row.modifiedAt"
                  :value="row.modifiedAt"
                  :author="row.author"
                />
              </template>

              <template #cell-actions="{ row }">
                <Table.CellActions
                  v-if="row.kind !== 'parent'"
                  :name="row.name"
                  @select="(_event, value) => onRowAction(value, row)"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuOption
                      v-if="row.kind === 'folder'"
                      key="open"
                      value="open"
                      label="Open"
                    >
                      <template #leading
                        ><i
                          class="pi pi-folder-open"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenuOption>
                    <DropdownMenuOption
                      v-else
                      key="download"
                      value="download"
                      label="Download"
                    >
                      <template #leading
                        ><i
                          class="pi pi-download"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenuOption>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuOption
                      value="delete"
                      label="Delete"
                    >
                      <template #leading
                        ><i
                          class="pi pi-trash"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenuOption>
                  </DropdownMenuGroup>
                </Table.CellActions>
              </template>

              <template #empty>
                <EmptyState
                  key="empty-state-1"
                  v-if="search"
                  size="medium"
                  icon="pi pi-search"
                  title="No matching files"
                  :description="`Nothing in this folder matches “${search}”.`"
                >
                  <template #actions>
                    <Button
                      label="Clear search"
                      kind="outlined"
                      size="small"
                      @click="search = ''"
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
                      icon="pi pi-plus"
                      kind="secondary"
                      size="medium"
                      :items="addToFilesActions"
                    />
                  </template>
                </EmptyState>
              </template>
            </DataTable>
          </template>
        </Card>
      </section>
    </div>
    <ConfirmDialog
      v-model:open="deleteOpen"
      :title="pending?.kind === 'folder' ? 'Delete folder' : 'Delete file'"
      size="medium"
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
        <p
          :id="confirmLabelId"
          class="m-0 text-body-sm text-(--text-default)"
        >
          Type <code class="text-label-code-sm">{{ pending?.name }}</code> to confirm.
        </p>
        <Input
          v-model="confirmation"
          :aria-labelledby="confirmLabelId"
          autocomplete="off"
          class="w-full"
          @keydown.enter="confirmDelete"
        />
      </div>
      <template #actions="{ close }">
        <Button
          label="Cancel"
          kind="outlined"
          size="medium"
          @click="close"
        />
        <Button
          :label="pending?.kind === 'folder' ? 'Delete folder' : 'Delete file'"
          kind="danger"
          size="medium"
          :disabled="!canDelete"
          @click="confirmDelete"
        />
      </template>
    </ConfirmDialog>
  </div>
</template>
```
