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
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup, { type FileTokenGroupItem } from '@aziontech/webkit/file-token-group'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SplitButton, { type SplitButtonItem } from '@aziontech/webkit/split-button'
  import Table from '@aziontech/webkit/table'
  import TableSearch from '@aziontech/webkit/table-search'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import UploadProgress, { type UploadProgressItem } from '@aziontech/webkit/upload-progress'
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'

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
    svg: 'ai ai-image',
    webp: 'ai ai-image',
    png: 'ai ai-image',
    mp4: 'ai ai-video',
    js: 'ai ai-code',
    css: 'ai ai-code',
    html: 'ai ai-code',
    json: 'ai ai-database',
    woff2: 'ai ai-star',
    log: 'ai ai-align-left',
    txt: 'ai ai-file'
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
    { label: 'Upload file', value: 'upload', icon: 'ai ai-upload' },
    { label: 'Upload folder', value: 'upload-folder', icon: 'ai ai-folder-open' },
    { label: 'Add folder', value: 'folder', icon: 'ai ai-folder-plus' }
  ]

  const referenceTime = Date.UTC(2026, 10, 10, 12)

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

  const tableEl = ref<TableExposed<FileRow> | null>(null)
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
      .map(([name]): FileRow => ({ id: name, name, kind: 'folder', size: '-', bytes: 0 }))
    const files = entries
      .filter(isFileEntry)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, entry], index): FileRow => ({
        id: name,
        name,
        kind: 'file',
        icon: GLYPHS[entry.ext] ?? 'ai ai-file',
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

  const LIMIT = 300 * 1024 * 1024
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }
  const extensionOf = (name: string) => name.split('.').pop()?.toLowerCase() ?? ''

  const uploadOpen = ref(false)
  const picked = ref<PickedFile[]>([])
  const pickerInputEl = ref<HTMLInputElement | null>(null)
  const folderInputEl = ref<HTMLInputElement | null>(null)
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
    { id: 'u-1', name: 'index.html', size: 6175, status: 'success', target: '' },
    { id: 'u-2', name: 'app.js', size: 248_320, status: 'running', progress: 46, target: '' },
    { id: 'u-3', name: 'styles.css', size: 52_100, status: 'running', progress: 12, target: '' },
    { id: 'u-4', name: 'intro.mp4', size: 96_400_000, status: 'pending', target: '' },
    { id: 'u-5', name: 'hero.webp', size: 1_482_000, status: 'pending', target: '' }
  ])
  const transferExpanded = ref(true)
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
    return { ...item, status: 'success', progress: 100 }
  }

  const openFolder = (target: string) => {
    folderPath.value = target ? (target.match(/[^/]+\//g) ?? []) : []
  }
  const lastTarget = computed(
    () => transfer.value.find((item) => item.status === 'success')?.target ?? ''
  )

  const isActive = (item: TransferItem) => item.status === 'running' || item.status === 'pending'

  const report = () => {
    const done = transfer.value.filter((item) => item.status === 'success').length
    const failed = transfer.value.filter((item) => item.status === 'error').length
    if (!done && !failed) return
    const where = transfer.value.find((item) => item.status === 'success')?.target ?? ''
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
      if (item.status === 'pending' && starting > 0) {
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
      status: 'pending',
      target
    }))
    const kept = transfer.value.some(isActive) ? transfer.value : []
    transfer.value = [...kept, ...next]
    transferExpanded.value = true
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
      return { ...item, status: 'pending', error: undefined, progress: 0 }
    })
    toast.dismiss('file-browser-upload')
    run()
  }

  const closeTransfer = async () => {
    transfer.value = []
    await nextTick()
    addHostEl.value?.querySelector('button')?.focus()
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
            >
              <template #toolbar>
                <div class="flex w-full flex-col gap-(--spacing-sm)">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="ai ai-database shrink-0 text-body-lg text-(--text-muted)"
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
                        icon="ai ai-refresh"
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
                        icon="ai ai-download"
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
                        icon="ai ai-plus"
                        variant="primary"
                        size="medium"
                        :items="addToFilesActions"
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
                    class="ai ai-folder-open shrink-0 text-body-lg text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <i
                    v-else-if="row.kind === 'folder'"
                    class="ai ai-folder shrink-0 text-body-lg text-(--text-link)"
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
                    variant="link"
                    label=".."
                    aria-label="Go up to the parent folder"
                    @click.stop="goUp"
                  />
                  <Button
                    key="button-2"
                    v-else-if="row.kind === 'folder'"
                    variant="link"
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
                          class="ai ai-folder-open"
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
                          class="ai ai-download"
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
                          class="ai ai-trash"
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
                  icon="ai ai-search"
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
                      icon="ai ai-plus"
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
          variant="outline"
          size="medium"
          @click="close"
        />
        <Button
          :label="pending?.kind === 'folder' ? 'Delete folder' : 'Delete file'"
          variant="danger"
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
      <DialogContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DialogTitle>{{
              uploadMode === 'folder' ? 'Upload folder' : 'Upload files'
            }}</DialogTitle>
            <DialogDescription>
              {{ uploadMode === 'folder' ? 'The folder and its subfolders go' : 'Files go' }} to
              {{ folderPath.length ? folderPath.join('') : rootName }}. A file with the same path is
              replaced.
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
                variant="secondary"
                size="medium"
                icon="ai ai-folder-open"
                @click="folderInputEl?.click()"
              />
              <Button
                key="button-2"
                v-else
                label="Browse files"
                variant="secondary"
                size="medium"
                @click="pickerInputEl?.click()"
              />
            </FileDropzone>
            <input
              ref="pickerInputEl"
              type="file"
              multiple
              class="hidden"
              aria-hidden="true"
              tabindex="-1"
              @change="onPick"
            />
            <input
              ref="folderInputEl"
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
              @remove="(_event, { index }) => removePicked(index)"
            />
          </div>
        </PanelContent>
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
              icon="ai ai-upload"
              :disabled="!pickable.length"
              @click="startUpload"
            />
          </div>
        </PanelFooter>
      </DialogContent>
    </Dialog>
    <UploadProgress
      v-if="transfer.length"
      v-model:open="transferExpanded"
      :items="transfer"
      @cancel="(_event, id) => cancel(id)"
      @retry="(_event, id) => retry(id)"
      @close="closeTransfer"
    >
      <template #actions>
        <Button
          v-if="transfer.some((item) => item.status === 'success')"
          label="Open folder"
          variant="secondary"
          size="small"
          @click="openFolder(lastTarget)"
        />
      </template>
    </UploadProgress>
  </div>
</template>
