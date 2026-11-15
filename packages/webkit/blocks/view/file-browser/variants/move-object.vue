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
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SplitButton from '@aziontech/webkit/split-button'
  import Table from '@aziontech/webkit/table'
  import TableSearch from '@aziontech/webkit/table-search'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import UploadProgress, { type UploadProgressItem } from '@aziontech/webkit/upload-progress'
  import { computed, nextTick, onBeforeUnmount, ref, useId } from 'vue'

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

  interface MovingItem {
    name: string
    size: string
  }

  const folderPath = ref<string[]>(['20260622162046/'])
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
    { label: 'Add folder', value: 'folder', icon: 'ai ai-folder-plus' }
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

  const onRowAction = (value: DropdownMenuItemValue, row: FileRow) => {
    if (value === 'open') enterFolder(row.name)
    if (value === 'move') openMove([row])
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

  const isFile = (row: FileRow) => row.kind === 'file'
  const rowSelection = ref<Record<string, boolean>>({ 'index.html': true, '404.html': true })
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
    rowSelection.value = {}
  }
  const goUp = () => {
    folderPath.value = folderPath.value.slice(0, -1)
    rowSelection.value = {}
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
    rowSelection.value = {}
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

  const folderPaths = (node: FolderTree, prefix = ''): string[] =>
    Object.entries(node).flatMap(([name, entry]) =>
      isFolder(entry) ? [prefix + name, ...folderPaths(entry.children, prefix + name)] : []
    )
  const destinationOptions = [
    { value: '/', label: '/', description: 'Storage root' },
    ...folderPaths(tree).map((path) => ({ value: path }))
  ]

  const toBytes = (size: string | undefined) => {
    const match = /^([\d.]+)\s*(B|KB|MB)$/.exec(size ?? '')
    if (!match) return 0
    const unitBytes: Record<string, number> = { B: 1, KB: 1024, MB: 1024 * 1024 }
    return Number(match[1]) * unitBytes[match[2]]
  }
  const formatSize = (bytes: number) =>
    bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`

  const moveOpen = ref(true)
  const moving = ref<MovingItem[]>(
    (['index.html', '404.html'] as const).map((name) => ({ name, size: SITE_BUILD[name].size }))
  )
  const destination = ref('')
  const destinationError = ref('')
  const selectionHostEl = ref<HTMLElement | null>(null)

  const moveTitle = computed(() =>
    moving.value.length === 1 ? `Move ${moving.value[0].name}` : `Move ${moving.value.length} files`
  )
  const movingSize = computed(() =>
    formatSize(moving.value.reduce((sum, item) => sum + toBytes(item.size), 0))
  )

  const openMove = (items: FileRow[]) => {
    moving.value = items
      .filter((item) => item.kind === 'file')
      .map((item) => ({ name: item.name, size: item.size }))
    if (!moving.value.length) return
    destination.value = ''
    destinationError.value = ''
    moveOpen.value = true
  }
  const openMoveSelection = (selectedRows: FileRow[]) => openMove(selectedRows)
  const hasSelectedFiles = (selectedRows: FileRow[]) =>
    selectedRows.some((row) => row.kind === 'file')

  const normalize = (raw: string) => {
    const path = raw.trim().replace(/\/+/g, '/').replace(/^\//, '')
    return path && !path.endsWith('/') ? `${path}/` : path
  }

  const validate = () => {
    const raw = destination.value.trim()
    const target = normalize(raw)
    if (/[^\u0020-\u007E]/.test(raw)) {
      destinationError.value = 'Use letters, numbers, dots, hyphens and slashes only.'
    } else if (target.split('/').includes('..')) {
      destinationError.value = 'A destination cannot go up with "..". Type the full path.'
    } else if (target === folderKey.value) {
      destinationError.value = 'The files are already in this folder. Pick another one.'
    } else {
      destinationError.value = ''
    }
    return destinationError.value ? null : target
  }

  const transfer = ref<UploadProgressItem[]>([])
  let timer = 0
  let moveSeq = 0

  const runMove = (target: string, from: string, items: MovingItem[]) => {
    transfer.value = items.map((item): UploadProgressItem => ({
      id: `m-${(moveSeq += 1)}`,
      name: from + item.name,
      size: toBytes(item.size),
      status: 'running',
      progress: 0
    }))
    clearInterval(timer)
    timer = setInterval(() => {
      transfer.value = transfer.value.map((item): UploadProgressItem => {
        const progress = Math.min(100, (item.progress ?? 0) + 34)
        return progress >= 100 ? { ...item, status: 'success', progress } : { ...item, progress }
      })
      if (transfer.value.every((item) => item.status === 'success')) {
        clearInterval(timer)
        removed.value = [...removed.value, ...items.map((item) => from + item.name)]
        const bucket = added.value[target] ?? {}
        added.value = {
          ...added.value,
          [target]: {
            ...bucket,
            ...Object.fromEntries(
              items.map((item) => [
                item.name,
                {
                  size: item.size,
                  ext: item.name.split('.').pop() ?? '',
                  lastModified: '2026-11-10T12:00:00Z'
                }
              ])
            )
          }
        }
        const where = target || rootName
        toast.success(
          `${items.length} ${items.length === 1 ? 'file' : 'files'} moved to ${where}.`,
          {
            id: 'file-browser-move',
            position: 'top-right',
            actions: [{ label: 'Open folder', onClick: () => openFolder(target) }]
          }
        )
      }
    }, 500)
  }

  const confirmMove = () => {
    const target = validate()
    if (target === null) return
    const items = moving.value
    runMove(target, folderKey.value, items)
    rowSelection.value = {}
    moveOpen.value = false
  }

  const openFolder = (target: string) => {
    folderPath.value = target ? (target.match(/[^/]+\//g) ?? []) : []
    rowSelection.value = {}
  }

  const closeTransfer = async () => {
    transfer.value = []
    await nextTick()
    selectionHostEl.value?.querySelector<HTMLElement>('input, button')?.focus()
  }

  onBeforeUnmount(() => {
    clearInterval(timer)
    toast.dismiss('file-browser-move')
  })
</script>

<template>
  <div class="layout-boundary">
    <div class="flex h-full min-h-0 flex-col">
      <section class="flex min-h-0 flex-col">
        <Card :padded="false">
          <template #default>
            <DataTable
              ref="tableEl"
              v-model:sorting="sorting"
              v-model:global-filter="search"
              v-model:row-selection="rowSelection"
              selectable
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
            >
              <template #toolbar="{ selectedRows, selectedCount, clearSelection }">
                <div
                  ref="selectionHostEl"
                  class="flex w-full flex-col gap-(--spacing-sm)"
                >
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

                  <div
                    v-if="selectedCount"
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
                        icon="ai ai-arrow-right-left"
                        variant="outline"
                        size="small"
                        :disabled="!hasSelectedFiles(selectedRows)"
                        @click="openMoveSelection(selectedRows)"
                      />
                    </div>
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
                      icon="ai ai-plus"
                      variant="primary"
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
                    <DropdownMenuItem
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
                    </DropdownMenuItem>
                    <DropdownMenuItem
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
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      v-if="row.kind === 'file'"
                      key="move"
                      value="move"
                      label="Move"
                    >
                      <template #leading
                        ><i
                          class="ai ai-arrow-right-left"
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
                          class="ai ai-trash"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenuItem>
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
      v-model:open="moveOpen"
      size="medium"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DialogTitle>{{ moveTitle }}</DialogTitle>
            <DialogDescription>
              {{ moving.length === 1 ? '1 file' : `${moving.length} files` }}, {{ movingSize }},
              from {{ folderKey || rootName }}. Pick a folder or type a new path; leave it empty for
              the storage root.
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
                  class="ai ai-file shrink-0 text-(--text-muted)"
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
      v-if="transfer.length"
      :items="transfer"
      operation="move"
      :cancelable="false"
      @close="closeTransfer"
    />
  </div>
</template>
