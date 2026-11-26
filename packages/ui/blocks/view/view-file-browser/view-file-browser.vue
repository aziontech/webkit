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
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, nextTick, ref, watch } from 'vue'

  import {
    addToFilesActions,
    destinationOptionsOf,
    fileColumns,
    type FileRow,
    folderPathsIn,
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

  const { formatFileSize } = useLocale()

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

  const rows = computed<FileRow[]>(() =>
    listRows(items.value, folderPath.value.length > 0, formatFileSize)
  )

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

  const destinationOptions = computed(() =>
    destinationOptionsOf(
      props.destinations ??
        (props.entries
          ? folderPathsIn(props.entries, path.value)
          : Object.keys(sampleFolders).filter(Boolean))
    )
  )

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
