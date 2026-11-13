<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup, { type FileTokenGroupItem } from '@aziontech/webkit/file-token-group'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
  import SplitButton, { type SplitButtonItem } from '@aziontech/webkit/split-button'
  import Switch from '@aziontech/webkit/switch'
  import Table from '@aziontech/webkit/table'
  import TableRoot, {
    type DropdownMenuOptionValue,
    type TableColumn,
    type TableExposed
  } from '@aziontech/webkit/table-root'
  import TableSearch from '@aziontech/webkit/table-search'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import UploadProgress, { type UploadProgressItem } from '@aziontech/webkit/upload-progress'
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

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
    lastModified: string
    modifiedAt?: string
    author?: string
  }

  type UploadMode = 'files' | 'folder'

  type PickedFile = FileTokenGroupItem & { file: File }

  interface TransferItem extends UploadProgressItem {
    size: number
    target: string
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
    webp: 'pi pi-image',
    png: 'pi pi-image',
    mp4: 'pi pi-video',
    js: 'pi pi-code',
    css: 'pi pi-code',
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
    { accessorKey: 'size', header: 'Size', enableSorting: true, minWidth: 80 },
    { accessorKey: 'lastModified', header: 'Last modified', enableSorting: true, minWidth: 80 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const addToFilesActions = [
    { label: 'Upload file', value: 'upload', icon: 'pi pi-upload' },
    { label: 'Upload folder', value: 'upload-folder', icon: 'pi pi-folder-open' },
    { label: 'Add folder', value: 'folder', icon: 'pi pi-folder-plus' }
  ]

  const referenceTime = Date.UTC(2026, 10, 10, 12)

  const relativeTime = (input: string) => {
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

  const added = ref<Record<string, FolderTree>>({})
  const folderKey = computed(() => folderPath.value.join(''))

  const rows = computed<FileRow[]>(() => {
    const extra = added.value[folderKey.value] ?? {}
    const entries = Object.entries({ ...currentFolder.value, ...extra }).filter(
      ([name]) => !removed.value.includes(entryPath(name))
    )
    const folders = entries
      .filter(([, entry]) => isFolder(entry))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name]): FileRow => ({ id: name, name, kind: 'folder', size: '-', lastModified: '' }))
    const files = entries
      .filter(isFileEntry)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, entry], index): FileRow => ({
        id: name,
        name,
        kind: 'file',
        icon: GLYPHS[entry.ext] ?? 'pi pi-file',
        size: entry.size,
        lastModified: relativeTime(entry.lastModified),
        modifiedAt: entry.lastModified,
        author: people[index % people.length]
      }))
    const list: FileRow[] = [...folders, ...files]
    if (folderPath.value.length) {
      list.unshift({ id: '..', name: '..', kind: 'parent', size: '-', lastModified: '' })
    }
    return list
  })

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

  const listedColumns = columns
    .filter((column) => column.kind !== 'action')
    .map((column) => ({
      id: column.id ?? column.accessorKey ?? '',
      label: column.label ?? column.header,
      locked: column.hideable === false
    }))
  const columnsOpen = ref(false)
  const columnsTipOpen = ref(false)
  watch(columnsOpen, (open) => {
    if (open) columnsTipOpen.value = false
  })
  const columnVisibility = ref<Record<string, boolean>>({})
  const isVisible = (id: string) => columnVisibility.value[id] !== false
  const setVisible = (id: string, visible: boolean) => {
    const next = { ...columnVisibility.value }
    if (visible) delete next[id]
    else next[id] = false
    columnVisibility.value = next
  }
  const hiddenCount = computed(() => listedColumns.filter((column) => !isVisible(column.id)).length)
  const showAll = () => {
    columnVisibility.value = {}
  }

  const LIMIT = 300 * 1024 * 1024
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }
  const extensionOf = (name: string) => name.split('.').pop()?.toLowerCase() ?? ''

  const uploadOpen = ref(false)
  const picked = ref<PickedFile[]>([])
  const pickerInput = ref<HTMLInputElement | null>(null)
  const folderInput = ref<HTMLInputElement | null>(null)
  const uploadMode = ref<UploadMode>('files')
  const addHost = ref<HTMLElement | null>(null)

  const toPicked = (file: File): PickedFile => ({
    file,
    error: file.size > LIMIT ? 'Larger than 300 MB, the limit per file' : undefined,
    warning: file.size === 0 ? 'This file is empty' : undefined
  })
  const pickable = computed(() => picked.value.filter((item) => !item.error))
  const addPicked = (files: FileList | File[]) => {
    picked.value = [...picked.value, ...Array.from(files).map(toPicked)]
  }
  const onPick = (event: Event) => {
    const input = event.target as HTMLInputElement
    addPicked(input.files ?? [])
    input.value = ''
  }
  const removePicked = (index: number) => {
    picked.value = picked.value.filter((_, position) => position !== index)
  }
  const openUpload = (mode: UploadMode = 'files') => {
    picked.value = []
    uploadMode.value = mode
    uploadOpen.value = true
  }
  const onAddClick = () => openUpload()
  const onAddItem = (_event: MouseEvent | KeyboardEvent, item: SplitButtonItem) => {
    if (item.value === 'upload') openUpload()
    if (item.value === 'upload-folder') openUpload('folder')
  }

  const transfer = ref<TransferItem[]>([
    { id: 'u-1', name: 'index.html', size: 6175, status: 'done', target: '' },
    { id: 'u-2', name: 'app.js', size: 248_320, status: 'running', progress: 46, target: '' },
    { id: 'u-3', name: 'styles.css', size: 52_100, status: 'running', progress: 12, target: '' },
    { id: 'u-4', name: 'intro.mp4', size: 96_400_000, status: 'queued', target: '' },
    { id: 'u-5', name: 'hero.webp', size: 1_482_000, status: 'queued', target: '' }
  ])
  const transferCollapsed = ref(false)
  const retried = new Set<string>()
  let seq = 5
  let timer = 0

  const settle = (item: TransferItem): TransferItem => {
    const failsOnce = item.name.endsWith('.mp4') && !retried.has(item.id)
    if (failsOnce) return { ...item, status: 'error', error: 'Connection lost at 82%' }
    const folders = item.name.split('/')
    const fileName = folders.pop() ?? ''
    const next = { ...added.value }
    let key = item.target
    for (const folder of folders) {
      next[key] = { [`${folder}/`]: { children: {} }, ...next[key] }
      key += `${folder}/`
    }
    next[key] = {
      ...next[key],
      [fileName]: {
        size: formatSize(item.size),
        ext: extensionOf(fileName),
        lastModified: new Date(referenceTime).toISOString()
      }
    }
    added.value = next
    return { ...item, status: 'done', progress: 100 }
  }

  const openFolder = (target: string) => {
    folderPath.value = target ? (target.match(/[^/]+\//g) ?? []) : []
  }
  const lastTarget = computed(
    () => transfer.value.find((item) => item.status === 'done')?.target ?? ''
  )

  const isActive = (item: TransferItem) => item.status === 'running' || item.status === 'queued'

  const report = () => {
    const done = transfer.value.filter((item) => item.status === 'done').length
    const failed = transfer.value.filter((item) => item.status === 'error').length
    if (!done && !failed) return
    const where = transfer.value.find((item) => item.status === 'done')?.target ?? ''
    const folder = where || rootName
    if (failed) {
      toast.error(`${failed} of ${done + failed} files weren't uploaded.`, {
        id: 'file-browser-upload',
        position: 'top-right',
        description: `The other ${done} are in ${folder}. Retry sends only the failed ones.`,
        actions: [{ label: 'Retry failed', onClick: () => retry() }]
      })
      return
    }
    toast.success(`${done} ${done === 1 ? 'file' : 'files'} uploaded to ${folder}.`, {
      id: 'file-browser-upload',
      position: 'top-right',
      actions: [{ label: 'Open folder', onClick: () => openFolder(where) }]
    })
  }

  const tick = () => {
    let starting = 2 - transfer.value.filter((item) => item.status === 'running').length
    transfer.value = transfer.value.map((item): TransferItem => {
      if (item.status === 'running') {
        const progress = Math.min(100, (item.progress ?? 0) + 14)
        return progress >= 100 ? settle(item) : { ...item, progress }
      }
      if (item.status === 'queued' && starting > 0) {
        starting -= 1
        return { ...item, status: 'running', progress: 0 }
      }
      return item
    })
    if (!transfer.value.some(isActive)) {
      clearInterval(timer)
      timer = 0
      report()
    }
  }
  const run = () => {
    if (!timer) timer = setInterval(tick, 700)
  }

  const enqueue = (files: File[]) => {
    const target = folderKey.value
    const next = Array.from(files).map((file): TransferItem => ({
      id: `u-${(seq += 1)}`,
      name: file.webkitRelativePath || file.name,
      size: file.size,
      status: 'queued',
      target
    }))
    const kept = transfer.value.some(isActive) ? transfer.value : []
    transfer.value = [...kept, ...next]
    transferCollapsed.value = false
    run()
  }

  const startUpload = () => {
    if (!pickable.value.length) return
    enqueue(pickable.value.map((item) => item.file))
    uploadOpen.value = false
  }

  const onPageDrop = (_event: DragEvent, files: File[]) => {
    enqueue(files.filter((file) => file.size <= LIMIT))
    const refused = files.filter((file) => file.size > LIMIT)
    if (refused.length) {
      toast.error(`${refused[0].name} is larger than 300 MB.`, {
        description: 'Files over the limit per file were left out of the upload.',
        position: 'top-right'
      })
    }
  }

  const cancel = (id?: string) => {
    transfer.value = transfer.value.map((item): TransferItem =>
      (id === undefined || item.id === id) && isActive(item)
        ? { ...item, status: 'canceled' }
        : item
    )
    if (!transfer.value.some(isActive)) {
      clearInterval(timer)
      timer = 0
    }
  }

  const retry = (id?: string) => {
    transfer.value = transfer.value.map((item): TransferItem => {
      if (item.status !== 'error' || (id !== undefined && item.id !== id)) return item
      retried.add(item.id)
      return { ...item, status: 'queued', error: undefined, progress: 0 }
    })
    toast.dismiss('file-browser-upload')
    run()
  }

  const closeTransfer = async () => {
    transfer.value = []
    await nextTick()
    addHost.value?.querySelector('button')?.focus()
  }

  onMounted(run)
  onBeforeUnmount(() => {
    clearInterval(timer)
    toast.dismiss('file-browser-upload')
  })
</script>

<template>
  <div class="layout-boundary">
    <div class="flex h-full min-h-0 flex-col">
      <section class="relative flex min-h-0 flex-col">
        <FileDropzone
          kind="overlay"
          :title="`Drop files to upload them to ${folderPath.length ? folderPath.at(-1) : rootName}`"
          description="Up to 300 MB per file."
          @drop="onPageDrop"
        />
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
                            <div
                              v-for="column in listedColumns"
                              :key="column.id"
                              class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
                              :class="
                                column.locked
                                  ? 'cursor-default'
                                  : 'cursor-pointer hover:bg-(--bg-hover)'
                              "
                            >
                              <Field
                                orientation="horizontal"
                                :disabled="column.locked"
                              >
                                <Switch
                                  :model-value="isVisible(column.id)"
                                  @update:model-value="(value) => setVisible(column.id, !!value)"
                                />
                                <Field.Label>
                                  <span class="min-w-0 truncate">{{ column.label }}</span>
                                </Field.Label>
                                <span
                                  v-if="column.locked"
                                  class="shrink-0 text-label-xs text-(--text-muted)"
                                  >Always shown</span
                                >
                              </Field>
                            </div>
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
                    <div
                      ref="addHost"
                      class="shrink-0"
                    >
                      <SplitButton
                        label="Add to files"
                        icon="pi pi-plus"
                        kind="primary"
                        size="medium"
                        :model="addToFilesActions"
                        @click="onAddClick"
                        @item-click="onAddItem"
                      />
                    </div>
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

              <template #cell-lastModified="{ row }">
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
                </Table.CellActions>
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
                      @click="onAddClick"
                      @item-click="onAddItem"
                    />
                  </template>
                </EmptyState>
              </template>
            </TableRoot>
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
    <Dialog
      v-model:open="uploadOpen"
      size="medium"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DialogTitle>{{
                uploadMode === 'folder' ? 'Upload folder' : 'Upload files'
              }}</DialogTitle>
              <DialogDescription>
                {{ uploadMode === 'folder' ? 'The folder and its subfolders go' : 'Files go' }} to
                {{ folderPath.length ? folderPath.join('') : rootName }}. A file with the same path
                is replaced.
              </DialogDescription>
            </div>
          </PanelHeader>
          <PanelContent>
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
                  kind="secondary"
                  size="medium"
                  icon="pi pi-folder-open"
                  @click="folderInput?.click()"
                />
                <Button
                  key="button-2"
                  v-else
                  label="Browse files"
                  kind="secondary"
                  size="medium"
                  @click="pickerInput?.click()"
                />
              </FileDropzone>
              <input
                ref="pickerInput"
                type="file"
                multiple
                class="hidden"
                aria-hidden="true"
                tabindex="-1"
                @change="onPick"
              />
              <input
                ref="folderInput"
                type="file"
                webkitdirectory
                class="hidden"
                aria-hidden="true"
                tabindex="-1"
                @change="onPick"
              />
              <FileTokenGroup
                v-if="picked.length"
                :items="picked"
                :limit="5"
                aria-label="Files to upload"
                @dismiss="removePicked"
              />
            </div>
          </PanelContent>
          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                label="Cancel"
                kind="outlined"
                size="medium"
                @click="uploadOpen = false"
              />
              <Button
                :label="pickable.length > 1 ? `Upload ${pickable.length} files` : 'Upload file'"
                kind="primary"
                size="medium"
                icon="pi pi-upload"
                :disabled="!pickable.length"
                @click="startUpload"
              />
            </div>
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
    <UploadProgress
      v-if="transfer.length"
      v-model:collapsed="transferCollapsed"
      :items="transfer"
      @cancel="cancel"
      @retry="retry"
      @close="closeTransfer"
    >
      <template #actions>
        <Button
          v-if="transfer.some((item) => item.status === 'done')"
          label="Open folder"
          kind="secondary"
          size="small"
          @click="openFolder(lastTarget)"
        />
      </template>
    </UploadProgress>
  </div>
</template>
