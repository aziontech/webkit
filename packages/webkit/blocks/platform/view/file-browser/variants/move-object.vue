<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Combobox from '@aziontech/webkit/combobox'
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
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
  import SplitButton from '@aziontech/webkit/split-button'
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
  import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

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
    { accessorKey: 'size', header: 'Size', enableSorting: true, minWidth: 80 },
    { accessorKey: 'lastModified', header: 'Last modified', enableSorting: true, minWidth: 80 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const addToFilesActions = [
    { label: 'Upload file', value: 'upload', icon: 'pi pi-upload' },
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

  const isFile = (row: FileRow) => row.kind === 'file'
  const rowSelection = ref<Record<string, boolean>>({ 'index.html': true, '404.html': true })
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
  const selectionHost = ref<HTMLElement | null>(null)

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
        return progress >= 100 ? { ...item, status: 'done', progress } : { ...item, progress }
      })
      if (transfer.value.every((item) => item.status === 'done')) {
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
    selectionHost.value?.querySelector<HTMLElement>('input, button')?.focus()
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
          <template #content>
            <TableRoot
              ref="tableRef"
              v-model:columnVisibility="columnVisibility"
              v-model:row-selection="rowSelection"
              enable-row-selection
              :row-selectable="isFile"
              :data="rows"
              :columns="columns"
              row-key="id"
              enable-sorting
              :bordered="false"
              :loading="loading"
              export-filename="files.csv"
              @row-click="onRowClick"
            >
              <template #toolbar="{ selectedRows, selectedCount, clearSelection }">
                <div
                  ref="selectionHost"
                  class="flex w-full flex-col gap-(--spacing-sm)"
                >
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

                  <div
                    v-if="selectedCount"
                    class="flex w-full flex-wrap items-center gap-(--spacing-xs) rounded-(--shape-elements) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
                  >
                    <span class="text-label-sm text-(--text-default)"
                      >{{ selectedCount }} selected</span
                    >
                    <Button
                      label="Clear selection"
                      kind="transparent"
                      size="small"
                      @click="clearSelection()"
                    />
                    <div class="ms-auto flex items-center gap-(--spacing-xs)">
                      <Button
                        label="Move"
                        icon="pi pi-arrow-right-arrow-left"
                        kind="outlined"
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
                    <DropdownMenuOption
                      v-if="row.kind === 'file'"
                      key="move"
                      value="move"
                      label="Move"
                    >
                      <template #left
                        ><i
                          class="pi pi-arrow-right-arrow-left"
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
      v-model:open="moveOpen"
      size="medium"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DialogTitle>{{ moveTitle }}</DialogTitle>
              <DialogDescription>
                {{ moving.length === 1 ? '1 file' : `${moving.length} files` }}, {{ movingSize }},
                from {{ folderKey || rootName }}. Pick a folder or type a new path; leave it empty
                for the storage root.
              </DialogDescription>
            </div>
          </PanelHeader>
          <PanelContent>
            <form
              class="flex flex-col gap-(--spacing-md)"
              novalidate
              @submit.prevent="confirmMove"
            >
              <ul
                aria-label="Files to move"
                class="m-0 flex list-none flex-col gap-(--spacing-xxs) p-0"
              >
                <li
                  v-for="item in moving"
                  :key="item.name"
                  class="flex min-w-0 items-center gap-(--spacing-xs) text-body-sm text-(--text-default)"
                >
                  <i
                    class="pi pi-file shrink-0 text-(--text-muted)"
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
          </PanelContent>
          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                label="Cancel"
                kind="outlined"
                size="medium"
                @click="moveOpen = false"
              />
              <Button
                :label="moving.length === 1 ? 'Move file' : `Move ${moving.length} files`"
                kind="primary"
                size="medium"
                @click="confirmMove"
              />
            </div>
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
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
