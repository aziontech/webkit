<script setup lang="ts">
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable, { type TableColumn, type TableExposed } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'

  import {
    isSourceFolder as isFolder,
    sampleBucket as bucket,
    sampleSourceTree as tree,
    type SourceTree
  } from '../sample'
  import ListControls from './list-controls.vue'
  import ListTabHeader from './list-tab-header.vue'

  type FileRow = {
    id: string
    name: string
    kind: 'folder' | 'file' | 'parent'
    icon: string
    size: string
    modifiedAt: string
    author: string
  }

  const GLYPHS: Record<string, string> = {
    js: 'az az-code',
    css: 'az az-palette',
    html: 'az az-code',
    svg: 'az az-image',
    webp: 'az az-image',
    png: 'az az-image',
    txt: 'az az-file'
  }

  const fileColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false, grow: 3 },
    { accessorKey: 'size', header: 'Size', minWidth: 80 },
    { accessorKey: 'modifiedAt', header: 'Last modified', minWidth: 160 }
  ]

  const folderPath = ref<string[]>([])
  const currentFolder = computed<SourceTree>(() => {
    let node: SourceTree = tree
    for (const segment of folderPath.value) {
      const next = node[segment]
      if (!isFolder(next)) return {}
      node = next.children
    }
    return node
  })
  const rows = computed<FileRow[]>(() => {
    const entries = Object.entries(currentFolder.value).sort(([a], [b]) => a.localeCompare(b))
    const folders = entries
      .filter(([, entry]) => isFolder(entry))
      .map(([name]): FileRow => ({
        id: name,
        name,
        kind: 'folder',
        icon: 'az az-folder',
        size: '-',
        modifiedAt: '',
        author: ''
      }))
    const files = entries.flatMap(([name, entry]): FileRow[] =>
      isFolder(entry)
        ? []
        : [
            {
              id: name,
              name,
              kind: 'file',
              icon: GLYPHS[entry.ext] ?? 'az az-file',
              size: entry.size,
              modifiedAt: entry.modifiedAt,
              author: entry.author
            }
          ]
    )
    const parent: FileRow[] = folderPath.value.length
      ? [
          {
            id: '..',
            name: '..',
            kind: 'parent',
            icon: 'az az-folder-open',
            size: '-',
            modifiedAt: '',
            author: ''
          }
        ]
      : []
    return [...parent, ...folders, ...files]
  })
  const openRow = (row: FileRow) => {
    if (row.kind === 'parent') folderPath.value = folderPath.value.slice(0, -1)
    if (row.kind === 'folder') folderPath.value = [...folderPath.value, row.name]
  }
  const pathCrumbs = computed(() => [
    { label: bucket, href: '0' },
    ...folderPath.value.map((segment, index) => ({ label: segment, href: String(index + 1) }))
  ])
  const onCrumb = (event: MouseEvent, href: string) => {
    event.preventDefault()
    folderPath.value = folderPath.value.slice(0, Number(href))
  }

  const search = ref('')
  const tableEl = ref<TableExposed | null>(null)

  const upload = () =>
    toast.info('Upload Files', {
      description: `Files you upload land in ${bucket} and ship with the next build of this version.`
    })
</script>

<template>
  <ScrollArea
    aria-label="Version settings"
    fade
  >
    <div class="flex min-h-full flex-col">
      <div
        class="layout-column layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
      >
        <ListTabHeader
          title="Source"
          :description="`Files this version serves, stored in the ${bucket} bucket.`"
          action-label="Upload Files"
          action-icon="az az-upload"
          @action="upload"
        />

        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ListControls
            v-model:search="search"
            search-label="Search in folder"
            :table="tableEl"
            csv-filename="web-app-source.csv"
            :storage-href="`/object-storage/${bucket}`"
          />
          <Breadcrumb
            :items="pathCrumbs"
            class="w-full"
            @navigate="onCrumb"
          />
          <Card :padded="false">
            <template #default>
              <DataTable
                ref="tableEl"
                v-model:globalFilter="search"
                :data="rows"
                :columns="fileColumns"
                row-key="id"
                paginated
                :page-size="10"
                :bordered="false"
                aria-label="Source files"
              >
                <template #cell-name="{ row }">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      :class="row.icon"
                      class="shrink-0 text-body-lg text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <Button
                      v-if="row.kind !== 'file'"
                      variant="link"
                      class="min-w-0 max-w-full"
                      :title="row.name"
                      :aria-label="row.kind === 'parent' ? 'Up one folder' : `Open ${row.name}`"
                      @click="openRow(row)"
                    >
                      <span class="truncate">{{ row.name }}</span>
                    </Button>
                    <span
                      v-else
                      class="truncate text-body-sm text-(--text-default)"
                      :title="row.name"
                      >{{ row.name }}</span
                    >
                  </div>
                </template>
                <template #cell-size="{ value }">
                  <span class="text-body-sm text-(--text-muted)">{{ value }}</span>
                </template>
                <template #cell-modifiedAt="{ row }">
                  <TableCellTime
                    v-if="row.modifiedAt"
                    :value="row.modifiedAt"
                    :author="row.author"
                  />
                </template>
                <template #empty>
                  <EmptyState
                    key="empty-state-1"
                    v-if="search.trim()"
                    size="medium"
                    icon="az az-search"
                    title="No matching source files"
                    :description="`Nothing matches ${search.trim()}.`"
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
                    icon="az az-object-storage"
                    title="No source files yet"
                    :description="`${bucket} is empty. Build this version to publish its files here, or upload them directly.`"
                  >
                    <template #actions>
                      <Button
                        label="Upload Files"
                        variant="outline"
                        size="medium"
                        icon="az az-upload"
                        @click="upload"
                      />
                      <Button
                        label="Open Bucket"
                        variant="ghost"
                        size="medium"
                        :href="`/object-storage/${bucket}`"
                      />
                    </template>
                  </EmptyState>
                </template>
              </DataTable>
            </template>
          </Card>
        </section>
      </div>
    </div>
  </ScrollArea>
</template>
