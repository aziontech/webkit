<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import Combobox from '@aziontech/webkit/combobox'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DataTable, {
    type DropdownMenuItemValue,
    type TableColumn,
    type TableExposed
  } from '@aziontech/webkit/data-table'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup, { type FileTokenGroupItem } from '@aziontech/webkit/file-token-group'
  import IconButton from '@aziontech/webkit/icon-button'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SplitButton, { type SplitButtonItem } from '@aziontech/webkit/split-button'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import TableSearch from '@aziontech/webkit/table-search'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import UploadProgress, { type UploadProgressItem } from '@aziontech/webkit/upload-progress'
  import { useFilePicker } from '@aziontech/webkit/use-file-picker'
  import { computed, nextTick, ref, watch } from 'vue'

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

  type RowKind = FileBrowserEntryKind | 'parent'

  interface FileRow {
    name: string
    id: string
    kind: RowKind
    icon?: string
    size: string
    bytes: number
    modifiedAt?: string
    author?: string
    entry?: FileBrowserEntry
  }

  type UploadMode = 'files' | 'folder'

  type PickedFile = FileTokenGroupItem & { file: File }

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

  const columns: TableColumn[] = [
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

  const addToFilesActions = [
    { label: 'Upload file', value: 'upload', icon: 'az az-upload' },
    { label: 'Upload folder', value: 'upload-folder', icon: 'az az-folder-open' },
    { label: 'Add folder', value: 'folder', icon: 'az az-folder-plus' }
  ]

  const LIMIT = 300 * 1024 * 1024
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Number((bytes / 1024).toFixed(2))} KB`
    return `${Number((bytes / 1024 / 1024).toFixed(2))} MB`
  }
  const extensionOf = (name: string) => name.split('.').pop()?.toLowerCase() ?? ''
  const folderName = (name: string) => (name.endsWith('/') ? name : `${name}/`)

  const toRow = (kind: RowKind, name: string, entry?: FileBrowserEntry): FileRow => {
    const file = kind === 'file'
    return {
      name,
      id: name,
      kind,
      icon: file ? (GLYPHS[extensionOf(name)] ?? 'az az-file') : undefined,
      size: file ? formatBytes(entry?.bytes ?? 0) : '-',
      bytes: file ? (entry?.bytes ?? 0) : 0,
      modifiedAt: file ? entry?.modifiedAt : undefined,
      author: file ? entry?.editor : undefined,
      entry
    }
  }

  const rows = computed<FileRow[]>(() => {
    const ofKind = (kind: FileBrowserEntryKind) =>
      items.value
        .filter((entry) => entry.kind === kind)
        .map((entry) => toRow(kind, kind === 'folder' ? folderName(entry.name) : entry.name, entry))
        .sort((a, b) => a.name.localeCompare(b.name))
    const list: FileRow[] = [...ofKind('folder'), ...ofKind('file')]
    if (folderPath.value.length) list.unshift(toRow('parent', '..'))
    return list
  })

  const sorting = ref<{ desc: boolean; id: string }[]>([])
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
        .filter((item) => item.kind === kind)
        .sort((a, b) => direction * compareFiles(id)(a, b))
    return [
      ...rows.value.filter((item) => item.kind === 'parent'),
      ...ordered('folder', sort.id === 'name' ? 'name' : ''),
      ...ordered('file', sort.id)
    ]
  })

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
    ...folderPath.value.map((segment, index) => ({ label: segment, href: String(index + 1) }))
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
  const destination = ref('')
  const destinationError = ref('')
  const selectionHostEl = ref<HTMLElement | null>(null)

  const moveTitle = computed(() =>
    moving.value.length === 1 ? `Move ${moving.value[0].name}` : `Move ${moving.value.length} files`
  )
  const movingSize = computed(() =>
    formatBytes(moving.value.reduce((sum, item) => sum + item.bytes, 0))
  )

  const openMove = (selected: FileRow[]) => {
    moving.value = selected.filter((item) => item.kind === 'file')
    if (!moving.value.length) return
    destination.value = ''
    destinationError.value = ''
    moveOpen.value = true
  }
  const hasSelectedFiles = (selectedRows: FileRow[]) =>
    selectedRows.some((item) => item.kind === 'file')

  const normalize = (raw: string) => {
    const target = raw.trim().replace(/\/+/g, '/').replace(/^\//, '')
    return target && !target.endsWith('/') ? `${target}/` : target
  }

  const validate = () => {
    const raw = destination.value.trim()
    const target = normalize(raw)
    if (/[^ -~]/.test(raw)) {
      destinationError.value = 'Use letters, numbers, dots, hyphens and slashes only.'
    } else if (target.split('/').includes('..')) {
      destinationError.value = 'A destination cannot go up with "..". Type the full path.'
    } else if (target === path.value) {
      destinationError.value = 'The files are already in this folder. Pick another one.'
    } else {
      destinationError.value = ''
    }
    return destinationError.value ? null : target
  }

  const confirmMove = (event: Event) => {
    const target = validate()
    if (target === null) return
    const entries = moving.value.flatMap((item) => (item.entry ? [item.entry] : []))
    emit('move', event, { entries, destination: target })
    selectedKeys.value = []
    moveOpen.value = false
  }

  const uploadOpen = ref(false)
  const picked = ref<PickedFile[]>([])
  const filePicker = useFilePicker({ multiple: true })
  const folderPicker = useFilePicker({ directory: true })
  const uploadMode = ref<UploadMode>('files')
  const addHostEl = ref<HTMLElement | null>(null)

  const toPicked = (file: File): PickedFile => ({
    file,
    error: file.size > LIMIT ? 'Larger than 300 MB, the limit per file' : undefined,
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
  const openUpload = (mode: UploadMode = 'files') => {
    picked.value = []
    uploadMode.value = mode
    uploadOpen.value = true
  }
  const onAddClick = () => openUpload()
  const onAddItem = (event: MouseEvent | KeyboardEvent, item: SplitButtonItem) => {
    if (item.value === 'upload') openUpload()
    if (item.value === 'upload-folder') openUpload('folder')
    if (item.value === 'folder') emit('add-folder', event)
  }

  const startUpload = (event: MouseEvent) => {
    if (!pickable.value.length) return
    emit('upload', event, { files: pickable.value.map((item) => item.file), path: path.value })
    uploadOpen.value = false
  }

  const onPageDrop = (event: DragEvent, files: File[]) => {
    const accepted = files.filter((file) => file.size <= LIMIT)
    if (accepted.length) emit('upload', event, { files: accepted, path: path.value })
    const refused = files.filter((file) => file.size > LIMIT)
    if (refused.length) {
      toast.error(`${refused[0].name} is larger than 300 MB.`, {
        description: 'Files over the limit per file were left out of the upload.',
        position: 'top-end'
      })
    }
  }

  const transferItems = computed<FileBrowserTransfer[]>(() => props.transfers ?? [])
  const transferExpanded = ref(true)
  const lastTarget = computed(
    () => transferItems.value.find((item) => item.status === 'success')?.target ?? ''
  )

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
        <Card>
          <template #default>
            <div class="flex w-full flex-col gap-(--spacing-sm)">
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="az az-database shrink-0 text-body-lg text-(--text-muted)"
                  aria-hidden="true"
                />
                <h1 class="min-w-0 truncate text-heading-2xs text-(--text-default)">
                  {{ rootName }}
                </h1>
              </div>
              <div class="flex w-full items-center justify-between gap-(--spacing-xs)">
                <div class="min-w-0">
                  <Breadcrumb
                    :items="pathCrumbs"
                    class="w-full"
                    @navigate="onCrumb"
                  />
                </div>
                <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                  <Tooltip content="Refresh">
                    <IconButton
                      icon="az az-refresh"
                      variant="outline"
                      size="medium"
                      aria-label="Refresh"
                      @click="refresh"
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
              v-model:global-filter="search"
              v-model:selected-keys="selectedKeys"
              :selectable="movable"
              :row-selectable="isFile"
              :data="sortedRows"
              :columns="columns"
              row-key="id"
              sortable
              manual-sorting
              paginated
              :page-size="50"
              :page-size-options="[25, 50, 100]"
              :bordered="false"
              :loading="loading"
              export-filename="files.csv"
              @row-click="onRowClick"
              @row-remove="onRowRemove"
            >
              <template #toolbar="{ selectedRows, selectedCount, clearSelection }">
                <div
                  ref="selectionHostEl"
                  class="flex w-full flex-col gap-(--spacing-sm)"
                >
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="az az-database shrink-0 text-body-lg text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <h1 class="min-w-0 truncate text-heading-2xs text-(--text-default)">
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
                      content="Refresh"
                      class="shrink-0"
                    >
                      <IconButton
                        icon="az az-refresh"
                        variant="outline"
                        size="large"
                        :loading="loading"
                        aria-label="Refresh"
                        @click="refresh"
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
                        :disabled="!tableEl"
                        aria-label="Download CSV"
                        @click="tableEl?.exportCsv({ filename: 'files.csv' })"
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

                  <div
                    v-if="movable && selectedCount"
                    class="flex w-full flex-wrap items-center gap-(--spacing-xs) rounded-(--shape-control) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
                  >
                    <span class="text-label-sm text-(--text-default)"
                      >{{ selectedCount }} selected</span
                    >
                    <Button
                      label="Clear selection"
                      variant="ghost"
                      size="small"
                      @click="clearSelection()"
                    />
                    <div class="ms-auto flex items-center gap-(--spacing-xs)">
                      <Button
                        label="Move"
                        icon="az az-arrow-right-left"
                        variant="outline"
                        size="small"
                        :disabled="!hasSelectedFiles(selectedRows)"
                        @click="openMove(selectedRows)"
                      />
                    </div>
                  </div>
                </div>
              </template>

              <template #cell-name="{ value, row: item }">
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
                    @click.stop="goUp"
                  />
                  <Button
                    key="button-2"
                    v-else-if="item.kind === 'folder'"
                    variant="link"
                    :label="value"
                    class="min-w-0"
                    @click.stop="(event: MouseEvent) => openEntry(event, item)"
                  />
                  <span
                    v-else
                    class="truncate"
                    >{{ value }}</span
                  >
                </div>
              </template>

              <template #cell-bytes="{ row: item }">
                <span class="text-(--text-muted)">{{ item.size }}</span>
              </template>

              <template #cell-modifiedAt="{ row: item }">
                <TableCellTime
                  v-if="item.modifiedAt"
                  :value="item.modifiedAt"
                  :author="item.author"
                />
              </template>

              <template #cell-actions="{ row: item }">
                <TableCellActions
                  v-if="item.kind !== 'parent'"
                  :name="item.name"
                  @select="(event, value) => onRowAction(event, value, item)"
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

              <template #empty>
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
                      icon="az az-plus"
                      variant="secondary"
                      size="medium"
                      :items="addToFilesActions"
                      @click="onAddClick"
                      @item-click="onAddItem"
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
      :confirm-label="pending?.kind === 'folder' ? 'Delete folder' : 'Delete file'"
      :confirmation-phrase="pending?.name ?? ''"
      @confirm="confirmDelete"
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
    <Dialog
      v-model:open="uploadOpen"
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
              @click="uploadOpen = false"
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
    <Dialog
      v-model:open="moveOpen"
      size="medium"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DialogTitle>{{ moveTitle }}</DialogTitle>
            <DialogDescription>
              {{ moving.length === 1 ? '1 file' : `${moving.length} files` }}, {{ movingSize }},
              from {{ path || rootName }}. Pick a folder or type a new path; leave it empty for the
              storage root.
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
              @click="moveOpen = false"
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
    <UploadProgress
      v-if="transferItems.length"
      v-model:open="transferExpanded"
      :items="transferItems"
      :operation="transferOperation"
      :cancelable="transferOperation === 'upload'"
      @cancel="(event, id) => emit('cancel-transfer', event, id)"
      @retry="(event, id) => emit('retry-transfer', event, id)"
      @close="closeTransfer"
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
          @click="openFolder(lastTarget)"
        />
      </template>
    </UploadProgress>
  </div>
</template>
