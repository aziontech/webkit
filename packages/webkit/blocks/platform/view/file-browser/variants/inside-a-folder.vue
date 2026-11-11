<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
  import SplitButton from '@aziontech/webkit/split-button'
  import Switch from '@aziontech/webkit/switch'
  import TableRoot from '@aziontech/webkit/table-root'
  import TableSearch from '@aziontech/webkit/table-search'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

  const folderPath = ref(['20260622162046/'])
  const rootName = 'acme-assets'

  const file = (size, ext) => ({ size, ext, lastModified: 'Jun 22, 2026, 07:21:21 PM' })

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
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, minWidth: 80 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const addToFilesActions = [
    { label: 'Upload file', value: 'upload', icon: 'pi pi-upload' },
    { label: 'Add folder', value: 'folder', icon: 'pi pi-folder-plus' }
  ]

  const relativeTime = (input) => {
    const days = Math.round((Date.now() - new Date(input).getTime()) / 86_400_000)
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
    const entries = Object.entries(currentFolder.value)
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
  </div>
</template>
