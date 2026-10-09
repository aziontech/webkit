<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import SplitButton from '@aziontech/webkit/split-button'
  import Table from '@aziontech/webkit/table'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { authorAt } from '@shared/lib/people'
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'

  import ColumnsButton from '../../components/list/ColumnsButton.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import ExportButton from '../../components/list/ExportButton.vue'
  import LastModifiedCell from '../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { useListRefresh } from '../../lib/behavior/list-state'
  import { FIT_COLUMN } from '../../lib/behavior/table-columns'
  import { storageTree } from '../../lib/data/application-source'
  import { glyphForExtension } from '../../lib/format/file-glyph'

  const route = useRoute()

  const bucketId = computed(() => route.params.bucket)
  const bucketName = computed(() => route.query.name || bucketId.value)

  const tree = computed(() => storageTree(String(bucketId.value)))

  const folderPath = ref([])

  const currentFolder = computed(() => {
    let node = tree.value
    for (const segment of folderPath.value) {
      node = node?.[segment]?.children
      if (!node) return {}
    }
    return node
  })

  const isFolder = (entry) => Boolean(entry && entry.children)

  const fileIcon = (ext) => glyphForExtension(ext)

  const rows = computed(() => {
    const entries = Object.entries(currentFolder.value)
    const folders = entries
      .filter(([, entry]) => isFolder(entry))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name]) => ({ id: name, name, kind: 'folder', size: '-', lastModified: '' }))
    const files = entries
      .filter(([, entry]) => !isFolder(entry))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, entry], index) => {
        const person = authorAt(index)
        return {
          id: name,
          name,
          kind: 'file',
          ext: entry.ext,
          size: entry.size,
          lastModified: entry.lastModified,
          author: person.name,
          authorAvatar: person.avatar
        }
      })

    const list = [...folders, ...files]
    if (folderPath.value.length) {
      list.unshift({ id: '..', name: '..', kind: 'parent', size: '-', lastModified: '' })
    }
    return list
  })

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      principal: true,
      hideable: false,
      grow: 3
    },
    { accessorKey: 'size', header: 'Size', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const columnVisibility = ref({})

  const { loading, refresh } = useListRefresh()

  const tableRef = ref(null)

  const enterFolder = (name) => {
    folderPath.value = [...folderPath.value, name]
  }

  const goUp = () => {
    folderPath.value = folderPath.value.slice(0, -1)
  }

  const onRowClick = (event, row) => {
    if (row.kind === 'parent') {
      goUp()
      return
    }
    if (row.kind === 'folder') {
      enterFolder(row.name)
      return
    }
    toast.info(`Downloading ${row.name}`, { description: row.size })
  }

  const pathCrumbs = computed(() => [
    { label: bucketName.value, href: '0' },
    ...folderPath.value.map((segment, index) => ({ label: segment, href: String(index + 1) }))
  ])

  const onCrumb = (event, href) => {
    event.preventDefault()
    const depth = Number(href)
    if (Number.isFinite(depth)) folderPath.value = folderPath.value.slice(0, depth)
  }

  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    toast.success(`Deleted "${row.name}".`)
    pendingDelete.value = null
  }

  const onRowAction = (event, value, row) => {
    if (value === 'open') {
      onRowClick(event, row)
      return
    }
    if (value === 'download') {
      toast.info(`Downloading ${row.name}`, { description: row.size })
      return
    }
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    toast.info(`${row.name}`, { description: `Object in ${bucketName.value}` })
  }

  const addToFilesActions = [
    { label: 'Upload file', value: 'upload', icon: 'pi pi-upload' },
    { label: 'Add folder', value: 'folder', icon: 'pi pi-folder-plus' }
  ]

  const runAddAction = (value) => {
    if (value === 'folder') {
      toast.info('Add a folder', { description: `New folder in ${bucketName.value}` })
      return
    }
    toast.info('Upload a file', { description: `Upload into ${bucketName.value}` })
  }

  const onAddPrimary = () => runAddAction('upload')
  const onAddAction = (event, item) => runAddAction(item.value)
</script>

<template>
  <AppLayout
    active="object-storage"
    :breadcrumb="[{ label: 'Object Storage', href: '/object-storage' }, { label: bucketName }]"
  >
    <main class="flex h-full min-h-0 flex-col">
      <section class="flex min-h-0 flex-col">
        <CardBox :padded="false">
          <template #content>
            <Table
              ref="tableRef"
              v-model:columnVisibility="columnVisibility"
              :data="rows"
              :columns="columns"
              row-key="id"
              enable-sorting
              :border="false"
              :loading="loading"
              export-filename="objects.csv"
              @row-click="onRowClick"
            >
              <template #toolbar>
                <div class="flex w-full flex-col gap-(--spacing-sm)">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="ai ai-edge-storage shrink-0 text-body-lg text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="min-w-0 truncate text-heading-xxs text-(--text-default)">
                      {{ bucketName }}
                    </span>
                  </div>

                  <div class="flex w-full items-center gap-(--spacing-xs)">
                    <Table.Search
                      size="large"
                      placeholder="Search in folder"
                      class="flex-1"
                    />
                    <RefreshButton
                      size="large"
                      :loading="loading"
                      @refresh="refresh"
                    />
                    <ExportButton
                      :table="tableRef"
                      size="large"
                      filename="objects.csv"
                    />
                    <ColumnsButton
                      v-model="columnVisibility"
                      :columns="columns"
                      size="large"
                    />
                  </div>

                  <div class="flex w-full items-center justify-between gap-(--spacing-xs)">
                    <Breadcrumb
                      :items="pathCrumbs"
                      class="min-w-0"
                      @navigate="onCrumb"
                    />
                    <SplitButton
                      label="Add to files"
                      icon="pi pi-plus"
                      kind="primary"
                      size="medium"
                      :model="addToFilesActions"
                      class="shrink-0"
                      @click="onAddPrimary"
                      @item-click="onAddAction"
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
                    :class="fileIcon(row.ext)"
                    class="shrink-0 text-body-lg text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span
                    class="truncate"
                    :class="row.kind !== 'file' ? 'cursor-pointer hover:underline' : ''"
                  >
                    {{ value }}
                  </span>
                </div>
              </template>

              <template #cell-size="{ value }">
                <span class="text-(--text-muted)">{{ value }}</span>
              </template>

              <template #cell-lastModified="{ value, row }">
                <LastModifiedCell
                  :author="row.author"
                  :avatar-src="row.authorAvatar"
                  :date="value"
                />
              </template>

              <template #cell-actions="{ row }">
                <Dropdown
                  v-if="row.kind !== 'parent'"
                  placement="bottom-end"
                  @select="(event, value) => onRowAction(event, value, row)"
                >
                  <Dropdown.Trigger>
                    <Tooltip text="Object actions">
                      <IconButton
                        icon="pi pi-ellipsis-h"
                        kind="outlined"
                        size="small"
                        aria-label="Object actions"
                      />
                    </Tooltip>
                  </Dropdown.Trigger>

                  <Dropdown.Group>
                    <Dropdown.Option
                      key="dropdown.option-1"
                      v-if="row.kind === 'folder'"
                      value="open"
                      label="Open"
                    >
                      <template #left
                        ><i
                          class="pi pi-folder-open"
                          aria-hidden="true"
                      /></template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      key="dropdown.option-2"
                      v-else
                      value="download"
                      label="Download"
                    >
                      <template #left
                        ><i
                          class="pi pi-download"
                          aria-hidden="true"
                      /></template>
                    </Dropdown.Option>
                  </Dropdown.Group>

                  <Dropdown.Group>
                    <Dropdown.Option
                      value="delete"
                      label="Delete"
                    >
                      <template #left
                        ><i
                          class="pi pi-trash"
                          aria-hidden="true"
                      /></template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                </Dropdown>
              </template>

              <template #empty>
                <EmptyState
                  size="medium"
                  title="This folder is empty"
                  description="Upload objects or create a folder to get started."
                >
                  <template #actions>
                    <SplitButton
                      label="Add to files"
                      icon="pi pi-plus"
                      kind="secondary"
                      size="medium"
                      :model="addToFilesActions"
                      @click="onAddPrimary"
                      @item-click="onAddAction"
                    />
                  </template>
                </EmptyState>
              </template>
            </Table>
          </template>
        </CardBox>
      </section>

      <DeleteDialog
        v-model:open="deleteOpen"
        kind="Object"
        :name="pendingDelete?.name ?? ''"
        description="The selected object will be removed from this bucket, and any URL serving it will stop resolving. Check the"
        @confirm="confirmDelete"
      />
    </main>
  </AppLayout>
</template>
