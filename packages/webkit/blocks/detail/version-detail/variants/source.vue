<script setup lang="ts">
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable, { type TableColumn, type TableExposed } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import VersionDetail from '../version-detail.vue'

  type FileEntry = { size: string; ext: string; modifiedAt: string; author: string }
  type FolderEntry = { children: FolderTree }
  type TreeEntry = FileEntry | FolderEntry
  interface FolderTree {
    [name: string]: TreeEntry
  }
  type FileRow = {
    id: string
    name: string
    kind: 'folder' | 'file' | 'parent'
    icon: string
    size: string
    modifiedAt: string
    author: string
  }

  const bucket = 'web-app-assets'
  const file = (size: string, ext: string, author: string): FileEntry => ({
    size,
    ext,
    modifiedAt: '2026-11-12T14:02:38Z',
    author
  })
  const tree: FolderTree = {
    'assets/': {
      children: {
        'index-4f2a91.js': file('182.4 KB', 'js', 'Jane Doe'),
        'index-8c03de.css': file('24.1 KB', 'css', 'Jane Doe'),
        'logo.svg': file('3.2 KB', 'svg', 'Sam Lee')
      }
    },
    'images/': {
      children: {
        'hero.webp': file('412.7 KB', 'webp', 'Sam Lee'),
        'og-card.png': file('96.3 KB', 'png', 'Sam Lee')
      }
    },
    '404.html': file('4.8 KB', 'html', 'Jane Doe'),
    'favicon.svg': file('1.2 KB', 'svg', 'Jane Doe'),
    'index.html': file('6.0 KB', 'html', 'Jane Doe'),
    'robots.txt': file('64 B', 'txt', 'Alex Morgan')
  }
  const GLYPHS: Record<string, string> = {
    js: 'ai ai-code',
    css: 'ai ai-palette',
    html: 'ai ai-code',
    svg: 'ai ai-image',
    webp: 'ai ai-image',
    png: 'ai ai-image',
    txt: 'ai ai-file'
  }

  const fileColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false, grow: 3 },
    { accessorKey: 'size', header: 'Size', minWidth: 80 },
    { accessorKey: 'modifiedAt', header: 'Last modified', minWidth: 160 }
  ]

  const folderPath = ref<string[]>([])
  const isFolder = (entry: TreeEntry | undefined): entry is FolderEntry =>
    Boolean(entry && 'children' in entry)
  const currentFolder = computed<FolderTree>(() => {
    let node: FolderTree = tree
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
        icon: 'ai ai-folder',
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
              icon: GLYPHS[entry.ext] ?? 'ai ai-file',
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
            icon: 'ai ai-folder-open',
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
  <VersionDetail tab="source">
    <template #source>
      <ScrollArea
        aria-label="Version settings"
        fade
      >
        <div class="flex min-h-full flex-col">
          <div
            class="layout-column layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Source"
              :description="`Files this version serves, stored in the ${bucket} bucket.`"
              size="small"
            >
              <template #actions>
                <Button
                  label="Upload Files"
                  variant="outline"
                  size="medium"
                  icon="ai ai-upload"
                  @click="upload"
                />
              </template>
            </PageHeader>

            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
              <header class="flex items-center gap-(--layout-group-gap)">
                <div class="flex min-w-36 grow basis-(--container-2xs)">
                  <Input
                    v-model="search"
                    size="medium"
                    placeholder="Search in folder"
                    aria-label="Search in folder"
                    class="w-full"
                  >
                    <template #leading>
                      <i
                        class="ai ai-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </div>
                <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                  <Tooltip
                    content="Refresh"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="ai ai-refresh"
                      variant="outline"
                      size="medium"
                      aria-label="Refresh"
                    />
                  </Tooltip>
                  <Tooltip
                    content="Download CSV"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="ai ai-download"
                      variant="outline"
                      size="medium"
                      :disabled="!tableEl"
                      aria-label="Download CSV"
                      @click="tableEl?.exportCsv({ filename: 'web-app-source.csv' })"
                    />
                  </Tooltip>
                  <Tooltip
                    content="Columns"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="ai ai-column"
                      variant="outline"
                      size="medium"
                      aria-label="Columns"
                    />
                  </Tooltip>
                  <Tooltip
                    content="Open in Object Storage"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="ai ai-external-link"
                      variant="outline"
                      size="medium"
                      :href="`/object-storage/${bucket}`"
                      aria-label="Open in Object Storage"
                    />
                  </Tooltip>
                </div>
              </header>
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
                        icon="ai ai-search"
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
                        icon="ai ai-edge-storage"
                        title="No source files yet"
                        :description="`${bucket} is empty. Build this version to publish its files here, or upload them directly.`"
                      >
                        <template #actions>
                          <Button
                            label="Upload Files"
                            variant="outline"
                            size="medium"
                            icon="ai ai-upload"
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
  </VersionDetail>
</template>
