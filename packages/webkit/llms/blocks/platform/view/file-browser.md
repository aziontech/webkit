# FileBrowser (`platform/view/file-browser`)

> The file browser a storage resource opens on: one flush `Card` holding a borderless `TableRoot` whose toolbar is the whole page header. The toolbar stacks the storage name beside the storage glyph, a large row of the table’s own search plus the refresh, download and columns IconButtons, then a `Breadcrumb` of the folder path beside the Add to files `SplitButton` (Upload file, Add folder). Folders sort first with a link-coloured folder glyph and open on click, a .. row leads back up once inside a folder, files take a glyph by extension, Size is muted and Last modified pairs the editor `Avatar` (named in a `Tooltip`) with the relative time; folders carry Open and files Download in their row menu, with Delete below, which opens a `ConfirmDialog` (a warning `Alert` and an `Input` that must match the name). Storage with nothing at its root renders the table’s empty slot: an `EmptyState` (This folder is empty) with a secondary Add to files split button; inside a folder the .. row always remains. Built from `Card`, `TableRoot` with `TableSearch`, `IconButton`, `Tooltip`, `PopoverRoot`, `Switch`, `Breadcrumb`, `SplitButton`, `Avatar`, `DropdownMenuRoot` and `EmptyState`.

- Surface: product
- Source: `blocks/platform/view/file-browser/file-browser.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/view/file-browser")`
- Components: [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Breadcrumb](../../../components/breadcrumb.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [Combobox](../../../components/combobox.md), [ConfirmDialog](../../../components/confirm-dialog.md), [Dialog](../../../components/dialog.md), `DialogContent`, `DialogDescription`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DropdownMenuGroup`, `DropdownMenuOption`, `DropdownMenuRoot`, `DropdownMenuTrigger`, [EmptyState](../../../components/empty-state.md), [Field](../../../components/field.md), [FileDropzone](../../../components/file-dropzone.md), [FileTokenGroup](../../../components/file-token-group.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), `PanelContent`, `PanelFooter`, `PanelHeader`, `PopoverContent`, `PopoverRoot`, `PopoverTrigger`, [SplitButton](../../../components/split-button.md), [Switch](../../../components/switch.md), `TableRoot`, `TableSearch`, [Toast](../../../components/toast.md), [Tooltip](../../../components/tooltip.md), [UploadProgress](../../../components/upload-progress.md)
- Skills: `webkit-tables`, `webkit-lists`, `webkit-ui-states`

## Asked as

file browser; file manager; storage browser; bucket browser; object storage; folders and files; upload files; navegador de arquivos; gerenciador de arquivos; arquivos do bucket; upload progress; move files; move objects; drag and drop upload; enviar arquivos; mover arquivos

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

Folders sort first with a link-coloured folder glyph and open on row click; a `..` row leads back up once inside a folder; files take a glyph by extension. Size is muted. Last modified pairs the editor's small square `Avatar`, named in a `Tooltip`, with the relative time.

### G. Row actions — `DropdownMenuRoot`, `DropdownMenuTrigger`, `DropdownMenuGroup`, `DropdownMenuOption`, `IconButton`, `Tooltip` (required)

A small ellipsis `IconButton` named File actions opens a menu placed `bottom-end`: Open for a folder or Download for a file in the first group, Delete alone in the last group. The `..` row has no menu.

### H. Delete confirmation — `ConfirmDialog`, `Alert`, `Input` (required)

The root's `select` event hands the option and the row to the page: Open enters the folder, Delete opens the `platform/delete/delete-with-confirmation` dialog without a trigger of its own. A medium `ConfirmDialog` titled `Delete file` or `Delete folder`, a warning `Alert` (`Once confirmed, this action can't be reversed.`), one sentence of consequence (a folder goes with all its files), and an `Input` labelled by `Type <name> to confirm.`; the danger confirm repeats the title and enables only when the typed text matches the name. The typed text resets each time it opens.

### I. Empty folder — `EmptyState`, `SplitButton` (required)

The table's `#empty` slot holds a medium `EmptyState` with one sentence and a secondary Add to files `SplitButton` with the same options as the toolbar's. Inside a folder the `..` row always remains, so the user can still go back up.

### J. Upload — `Dialog`, `FileDropzone`, `FileTokenGroup`, `Button` (Uploading)

Add to files and its Upload file option open a medium `Dialog` titled Upload files whose description names the destination folder and that a file with the same name is replaced. Inside: an inline `FileDropzone` (`Up to 300 MB per file.`) with a secondary Browse files `Button` wired to a hidden `<input type="file" multiple>`, then a `FileTokenGroup` (`limit` 5) of the picked files. A file over the limit stays in the group with its reason (`Larger than 300 MB, the limit per file`), an empty file with a warning, and both are left out of the count: the primary button reads `Upload 3 files` and is disabled while nothing can be sent. Upload closes the dialog and starts the transfer; the dialog does not wait for it.

A second `FileDropzone kind="overlay"` sits inside the `section` that holds the card (made `relative`), so dragging files anywhere over the page shows `Drop files to upload them to <folder>` over the listing; a drop uploads straight into the folder in view and refuses files over the limit with a danger toast.

### K. Transfer card — `UploadProgress` (Uploading, MoveObject)

Every transfer (upload, move) runs in one floating `UploadProgress` at the inline-end bottom corner, so the person can keep browsing, change folder or open another resource while it runs. The header counts finished files over one overall bar (`Uploading 2 of 5 files`), each row carries its bar, Cancel while it runs or waits, Retry when it failed with the reason under the name. Files land in the table as each finishes, not at the end. Close appears when everything finished and returns focus to Add to files (or to the toolbar, after a move). At most two files upload at a time; the rest wait.

### L. Outcome toast — `Toaster`, `toast` (Uploading, MoveObject)

When a transfer finishes the page reports it with a toast as well as the card, because the card may be collapsed or the person may be elsewhere. Its actions fit the files, never a deploy action: after a clean upload or move, `Open folder` (goes to the destination); after a partial upload, a danger toast `1 of 5 files weren't uploaded.` that says where the rest went and offers `Retry failed`. Storage objects are not deployed, so the async-submit Edit and Redeploy pair does not apply. The `Toaster` sits at `top-right` so it never covers the transfer card.

### M. Selection and Move — `TableRoot` selection, `Dialog`, `Field`, `Combobox` (MoveObject)

`enable-row-selection` with `v-model:row-selection` adds the checkbox column; the toolbar slot's `selectedCount`, `selectedRows` and `clearSelection` drive a selection bar (`2 selected`, Clear selection, Move). Every file's row menu gains Move between Download and Delete. Move opens a medium `Dialog` titled `Move index.html` or `Move 2 files`; its description gives the count, the total size and the folder they leave, the files are listed by name and size, and one `Field` holds a large clearable `Combobox` of every folder in the storage (the root first, as `/`) that also accepts a new path (`A folder that does not exist yet is created with the move.`). On Move the path is normalised (one slash between segments, no leading slash, a trailing slash) and validated: printable ASCII only, no `..`, not the folder the files are in; each failure is a `Field.Error` under the field and nothing moves.

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
- **Row menu:** one verb per option, e.g. "Open", "Download", "Delete"; the trigger is named "File actions".
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
- The `Avatar` carries the author name as `alt`, repeated by its `Tooltip`.
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

## Variants

- `Default` — primary (the code below)
- `InsideAFolder` — Inside a build folder: the crumb gains the folder, a .. row leads back up, and the files carry their glyph, size, editor and age.
- `Uploading` — An upload into the storage root is running: the floating `UploadProgress` card counts finished files over one bar, gives each file its bar, Cancel and, when a file fails, Retry, and finished files join the table as they land. Add to files opens the Upload files dialog (`FileDropzone` plus a `FileTokenGroup` that keeps files over 300 MB in the list with the reason and leaves them out of the upload); dragging files anywhere over the page shows the drop overlay for the folder in view. The outcome is reported by a toast whose actions fit the files: Open folder after a clean upload, Retry failed after a partial one.
- `MoveObject` — Two files of a build folder are selected and the Move dialog is open: it names the files, their total size and the folder they leave, and the Destination folder `Combobox` offers every folder in the storage and accepts a new path. A path with characters outside printable ASCII, with `..`, or equal to the current folder is refused under the field. Move runs in the floating `UploadProgress` card (`operation="move"`) and ends in a toast with Open folder. Selecting rows shows a selection bar with Move, and every file's row menu has Move.

Each variant is the same screen in another state: `get_pattern("platform/view/file-browser", { variant })`, or the file under `blocks/platform/view/file-browser/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
  import SplitButton from '@aziontech/webkit/split-button'
  import Switch from '@aziontech/webkit/switch'
  import TableRoot from '@aziontech/webkit/table-root'
  import TableSearch from '@aziontech/webkit/table-search'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, useId, watch } from 'vue'

  const folderPath = ref([])
  const rootName = 'acme-assets'

  const file = (size, ext) => ({ size, ext, lastModified: '2026-06-22T19:21:21Z' })

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
  }

  const tree = {
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
    'Robson Junior',
    'Isaque Böck',
    'Rafael Garbinatto',
    'Herbert Júlio',
    'Rafael Umman',
    'Marcus Grando',
    'Bruno Germano',
    'Gab Lisboa'
  ]

  const GLYPHS = {
    svg: 'pi pi-image',
    html: 'pi pi-code',
    json: 'pi pi-database',
    woff2: 'pi pi-star',
    log: 'pi pi-align-left',
    txt: 'pi pi-file'
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      principal: true,
      hideable: false,
      grow: 3
    },
    { accessorKey: 'size', header: 'Size', enableSorting: true, minWidth: 80 },
    { accessorKey: 'lastModified', header: 'Last modified', enableSorting: true, minWidth: 80 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const addToFilesActions = [
    { label: 'Upload file', value: 'upload', icon: 'pi pi-upload' },
    { label: 'Add folder', value: 'folder', icon: 'pi pi-folder-plus' }
  ]

  const referenceTime = Date.UTC(2026, 10, 10, 12)

  const relativeTime = (input) => {
    const days = Math.round((referenceTime - Date.parse(input)) / 86_400_000)
    if (days < 1) return 'today'
    if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`
    if (days < 30) {
      const weeks = Math.round(days / 7)
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
    }
    const months = Math.round(days / 30)
    if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`
    const years = Math.round(days / 365)
    return `${years} ${years === 1 ? 'year' : 'years'} ago`
  }

  const removed = ref([])
  const pending = ref(null)
  const deleteOpen = ref(false)
  const confirmation = ref('')
  const confirmLabelId = useId()
  const entryPath = (name) => [...folderPath.value, name].join('')
  const canDelete = computed(
    () => Boolean(pending.value) && confirmation.value.trim() === pending.value.name
  )

  const onRowAction = (value, row) => {
    if (value === 'open') enterFolder(row.name)
    if (value !== 'delete') return
    pending.value = row
    confirmation.value = ''
    deleteOpen.value = true
  }

  const confirmDelete = () => {
    if (!canDelete.value) return
    removed.value = [...removed.value, entryPath(pending.value.name)]
    deleteOpen.value = false
  }

  const tableRef = ref(null)
  const isFolder = (entry) => Boolean(entry && entry.children)

  const currentFolder = computed(() => {
    let node = tree
    for (const segment of folderPath.value) {
      node = node?.[segment]?.children
      if (!node) return {}
    }
    return node
  })

  const rows = computed(() => {
    const entries = Object.entries(currentFolder.value).filter(
      ([name]) => !removed.value.includes(entryPath(name))
    )
    const folders = entries
      .filter(([, entry]) => isFolder(entry))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name]) => ({ id: name, name, kind: 'folder', size: '-', lastModified: '' }))
    const files = entries
      .filter(([, entry]) => !isFolder(entry))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, entry], index) => ({
        id: name,
        name,
        kind: 'file',
        icon: GLYPHS[entry.ext] ?? 'pi pi-file',
        size: entry.size,
        lastModified: relativeTime(entry.lastModified),
        author: people[index % people.length]
      }))
    const list = [...folders, ...files]
    if (folderPath.value.length) {
      list.unshift({ id: '..', name: '..', kind: 'parent', size: '-', lastModified: '' })
    }
    return list
  })

  const enterFolder = (name) => {
    folderPath.value = [...folderPath.value, name]
  }
  const goUp = () => {
    folderPath.value = folderPath.value.slice(0, -1)
  }
  const onRowClick = (event, row) => {
    if (row.kind === 'parent') goUp()
    if (row.kind === 'folder') enterFolder(row.name)
  }

  const pathCrumbs = computed(() => [
    { label: rootName, href: '0' },
    ...folderPath.value.map((segment, index) => ({ label: segment, href: String(index + 1) }))
  ])
  const onCrumb = (event, href) => {
    event.preventDefault()
    const depth = Number(href)
    if (Number.isFinite(depth)) folderPath.value = folderPath.value.slice(0, depth)
  }

  const loading = ref(false)
  let refreshTimer
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const listedColumns = columns
    .filter((column) => column.kind !== 'action')
    .map((column) => ({
      id: column.id ?? column.accessorKey,
      label: column.label ?? column.header,
      locked: column.hideable === false
    }))
  const columnsOpen = ref(false)
  const columnsTipOpen = ref(false)
  watch(columnsOpen, (open) => {
    if (open) columnsTipOpen.value = false
  })
  const columnVisibility = ref({})
  const isVisible = (id) => columnVisibility.value[id] !== false
  const setVisible = (id, visible) => {
    const next = { ...columnVisibility.value }
    if (visible) delete next[id]
    else next[id] = false
    columnVisibility.value = next
  }
  const hiddenCount = computed(() => listedColumns.filter((column) => !isVisible(column.id)).length)
  const showAll = () => {
    columnVisibility.value = {}
  }
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="flex h-full min-h-0 flex-col">
      <section class="flex min-h-0 flex-col">
        <Card :padded="false">
          <template #content>
            <TableRoot
              ref="tableRef"
              v-model:columnVisibility="columnVisibility"
              :data="rows"
              :columns="columns"
              row-key="id"
              enable-sorting
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
                    <span class="min-w-0 truncate text-heading-xxs text-(--text-default)">{{
                      rootName
                    }}</span>
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
                    <PopoverRoot
                      v-model:open="columnsOpen"
                      placement="bottom-end"
                      class="shrink-0"
                    >
                      <PopoverTrigger>
                        <Tooltip
                          v-model:open="columnsTipOpen"
                          text="Columns"
                          :disabled="columnsOpen"
                        >
                          <IconButton
                            icon="ai ai-column"
                            kind="outlined"
                            size="large"
                            aria-label="Columns"
                          />
                        </Tooltip>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div class="flex flex-col">
                          <div
                            class="border-b border-(--border-default) px-(--spacing-md) py-(--spacing-xs)"
                          >
                            <p class="text-label-md text-(--text-default)">Columns</p>
                          </div>
                          <div
                            class="flex max-h-(--container-xs) flex-col gap-(--spacing-xxs) overflow-y-auto overscroll-contain p-(--spacing-xxs)"
                          >
                            <label
                              v-for="column in listedColumns"
                              :key="column.id"
                              class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
                              :class="
                                column.locked
                                  ? 'cursor-default text-(--text-muted)'
                                  : 'cursor-pointer text-(--text-default) hover:bg-(--bg-hover)'
                              "
                            >
                              <Switch
                                :model-value="isVisible(column.id)"
                                :disabled="column.locked"
                                @update:model-value="(value) => setVisible(column.id, !!value)"
                              />
                              <span class="min-w-0 truncate">{{ column.label }}</span>
                              <span
                                v-if="column.locked"
                                class="ms-auto shrink-0 text-label-xs text-(--text-muted)"
                                >Always shown</span
                              >
                            </label>
                          </div>
                          <div
                            v-if="hiddenCount"
                            class="border-t border-(--border-default) p-(--spacing-xxs)"
                          >
                            <Button
                              label="Show all columns"
                              kind="transparent"
                              size="small"
                              class="w-full"
                              @click="showAll"
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </PopoverRoot>
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
                      :model="addToFilesActions"
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
                  <span
                    class="truncate"
                    :class="row.kind !== 'file' ? 'cursor-pointer hover:underline' : ''"
                    >{{ value }}</span
                  >
                </div>
              </template>

              <template #cell-size="{ value }">
                <span class="text-(--text-muted)">{{ value }}</span>
              </template>

              <template #cell-lastModified="{ value, row }">
                <div
                  v-if="row.author || value"
                  class="flex min-w-0 items-center gap-(--spacing-xs)"
                >
                  <Tooltip
                    v-if="row.author"
                    :text="row.author"
                  >
                    <Avatar
                      :alt="row.author"
                      :label="row.author"
                      size="small"
                      kind="square"
                    />
                  </Tooltip>
                  <span class="truncate text-body-sm text-(--text-muted)">{{ value }}</span>
                </div>
              </template>

              <template #cell-actions="{ row }">
                <DropdownMenuRoot
                  v-if="row.kind !== 'parent'"
                  placement="bottom-end"
                  @select="(event, value) => onRowAction(value, row)"
                >
                  <DropdownMenuTrigger>
                    <Tooltip text="File actions">
                      <IconButton
                        icon="pi pi-ellipsis-h"
                        kind="outlined"
                        size="small"
                        aria-label="File actions"
                      />
                    </Tooltip>
                  </DropdownMenuTrigger>
                  <DropdownMenuGroup>
                    <DropdownMenuOption
                      v-if="row.kind === 'folder'"
                      key="open"
                      value="open"
                      label="Open"
                    >
                      <template #left
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
                      <template #left
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
                      <template #left
                        ><i
                          class="pi pi-trash"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenuOption>
                  </DropdownMenuGroup>
                </DropdownMenuRoot>
              </template>

              <template #empty>
                <EmptyState
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
                      :model="addToFilesActions"
                    />
                  </template>
                </EmptyState>
              </template>
            </TableRoot>
          </template>
        </Card>
      </section>
    </main>
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
