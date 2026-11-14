<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import DropdownMenu, { type DropdownMenuOptionValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Resizable from '@aziontech/webkit/resizable'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import SplitButton from '@aziontech/webkit/split-button'
  import Table from '@aziontech/webkit/table'
  import type { TableColumn, TableExposed } from '@aziontech/webkit/table-root'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, ref } from 'vue'

  type VersionEntry = {
    id: string
    name: string
    state: string
    tag: { label: string; severity: TagSeverity; icon: string }
    comment: string
    author: string
    createdAgo: string
  }

  const tabs = [
    { value: 'main-settings', label: 'Settings' },
    { value: 'source', label: 'Source' },
    { value: 'device-groups', label: 'Device Groups' },
    { value: 'cache-settings', label: 'Cache Settings' },
    { value: 'functions-instances', label: 'Functions Instances' },
    { value: 'rules-engine', label: 'Rules Engine' }
  ]
  const versions: VersionEntry[] = [
    {
      id: 'ADA8FMMR',
      name: 'ADA8FMMR',
      state: 'draft',
      tag: { label: 'Draft', severity: 'warning', icon: 'pi pi-file-edit' },
      comment: 'Cache static assets for 30 days',
      author: 'John Smith',
      createdAgo: '14 hours ago'
    },
    {
      id: 'AEO25I38',
      name: 'AEO25I38',
      state: 'active',
      tag: { label: 'Deployed', severity: 'primary', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Sam Lee',
      createdAgo: '1 day ago'
    },
    {
      id: 'AG1VVDJP',
      name: 'AG1VVDJP',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Enable image optimization',
      author: 'Priya Patel',
      createdAgo: '3 days ago'
    },
    {
      id: 'AHFPL906',
      name: 'AHFPL906',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Update function"ab-test" arguments',
      author: 'Chris Taylor',
      createdAgo: '3 days ago'
    },
    {
      id: 'AITJB4GN',
      name: 'AITJB4GN',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Add variable"API_URL"',
      author: 'Riley Carter',
      createdAgo: '4 days ago'
    },
    {
      id: 'AK7D0ZX4',
      name: 'AK7D0ZX4',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Cache static assets for 30 days',
      author: 'Ethan Brooks',
      createdAgo: '6 days ago'
    },
    {
      id: 'ALL6QVDL',
      name: 'ALL6QVDL',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Jordan Kim',
      createdAgo: '1 week ago'
    }
  ]
  const version: VersionEntry = {
    id: 'ADA8FMMR',
    name: 'ADA8FMMR',
    state: 'draft',
    tag: { label: 'Draft', severity: 'warning', icon: 'pi pi-file-edit' },
    comment: 'Cache static assets for 30 days',
    author: 'John Smith',
    createdAgo: '14 hours ago'
  }
  const earlier: VersionEntry[] = [
    {
      id: 'AEO25I38',
      name: 'AEO25I38',
      state: 'active',
      tag: { label: 'Deployed', severity: 'primary', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Sam Lee',
      createdAgo: '1 day ago'
    },
    {
      id: 'AG1VVDJP',
      name: 'AG1VVDJP',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Enable image optimization',
      author: 'Priya Patel',
      createdAgo: '3 days ago'
    },
    {
      id: 'AHFPL906',
      name: 'AHFPL906',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Update function"ab-test" arguments',
      author: 'Chris Taylor',
      createdAgo: '3 days ago'
    },
    {
      id: 'AITJB4GN',
      name: 'AITJB4GN',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Add variable"API_URL"',
      author: 'Riley Carter',
      createdAgo: '4 days ago'
    },
    {
      id: 'AK7D0ZX4',
      name: 'AK7D0ZX4',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Cache static assets for 30 days',
      author: 'Ethan Brooks',
      createdAgo: '6 days ago'
    },
    {
      id: 'ALL6QVDL',
      name: 'ALL6QVDL',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Jordan Kim',
      createdAgo: '1 week ago'
    }
  ]
  const saveOptions = [
    { label: 'Save and deploy', value: 'deploy' },
    { label: 'Save and build', value: 'build' },
    { label: 'Save', value: 'save' }
  ]

  const versionId = ref('ADA8FMMR')
  const query = ref('')
  const activeTab = ref('source')
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')
  const saveAction = ref<string | undefined>('deploy')

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
    js: 'pi pi-code',
    css: 'pi pi-palette',
    html: 'pi pi-code',
    svg: 'pi pi-image',
    webp: 'pi pi-image',
    png: 'pi pi-image',
    txt: 'pi pi-file'
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
        icon: 'pi pi-folder',
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
              icon: GLYPHS[entry.ext] ?? 'pi pi-file',
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
            icon: 'pi pi-folder-open',
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
  const tableRef = ref<TableExposed | null>(null)
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
  onBeforeUnmount(() => clearTimeout(refreshTimer))

  const upload = () =>
    toast.info('Upload Files', {
      description: `Files you upload land in ${bucket} and ship with the next build of this version.`
    })
  const historyCollapsed = ref(true)
  const historyBasis = ref(348)
  const description = ref('Cache static assets for 30 days')
  const draftText = ref('')
  const editing = ref(false)
  const shown = ref(5)

  const matches = computed(() =>
    versions.filter((entry) => entry.name.toLowerCase().includes(query.value.trim().toLowerCase()))
  )

  const openHistory = (_event: MouseEvent | KeyboardEvent, value: DropdownMenuOptionValue) => {
    if (value === 'history' && !historyCollapsed.value) {
      historyCollapsed.value = true
      return
    }
    editing.value = value === 'edit'
    if (editing.value) draftText.value = description.value
    historyCollapsed.value = false
  }
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <ConsoleLayout.Breadcrumbs
      :items="[
        { label: 'Resources', href: '/resources' },
        { label: 'web-app', href: '/resources/1784552864' }
      ]"
    >
      <Select
        kind="transparent"
        size="small"
        :model-value="versionId"
        :display-value="(id) => versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')"
        @update:open="
          (open) => {
            if (!open) query = ''
          }
        "
      >
        <Select.Trigger aria-label="Switch version" />
        <Select.Content>
          <template #search>
            <Input
              v-model="query"
              size="small"
              placeholder="Search versions"
              aria-label="Search versions"
              @keydown.stop
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </template>
          <Select.Group label="Versions">
            <Select.Option
              v-for="entry in matches"
              :key="entry.id"
              :value="entry.id"
            >
              {{ entry.name }}
              <template #tag>
                <Tag
                  :label="entry.tag.label"
                  :severity="entry.tag.severity"
                  :icon="entry.tag.icon"
                  size="small"
                />
              </template>
            </Select.Option>
            <p
              v-if="!matches.length"
              class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
            >
              No versions match"{{ query }}".
            </p>
          </Select.Group>
          <template #footer>
            <Select.Option
              value="__create-version__"
              class="w-full"
            >
              <span class="flex items-center gap-(--spacing-xs)">
                <i
                  class="pi pi-plus-circle"
                  aria-hidden="true"
                />
                Add Version
              </span>
            </Select.Option>
          </template>
        </Select.Content>
      </Select>
    </ConsoleLayout.Breadcrumbs>
    <nav
      aria-label="Breadcrumb"
      class="flex min-w-0 items-center gap-(--spacing-xs) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs) md:hidden"
    >
      <Tooltip text="Back to web-app versions">
        <IconButton
          icon="pi pi-arrow-left"
          kind="transparent"
          size="medium"
          href="/resources/1784552864?tab=versions"
          aria-label="Back to web-app versions"
        />
      </Tooltip>
      <div class="min-w-0 flex-1">
        <Select
          :model-value="versionId"
          :display-value="
            (id) => versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')
          "
          class="w-full"
          @update:open="
            (open) => {
              if (!open) query = ''
            }
          "
        >
          <Select.Trigger aria-label="Switch version" />
          <Select.Content>
            <template #search>
              <Input
                v-model="query"
                size="small"
                placeholder="Search versions"
                aria-label="Search versions"
                @keydown.stop
              >
                <template #iconLeft>
                  <i
                    class="pi pi-search"
                    aria-hidden="true"
                  />
                </template>
              </Input>
            </template>
            <Select.Group label="Versions">
              <Select.Option
                v-for="entry in matches"
                :key="entry.id"
                :value="entry.id"
              >
                {{ entry.name }}
                <template #tag>
                  <Tag
                    :label="entry.tag.label"
                    :severity="entry.tag.severity"
                    :icon="entry.tag.icon"
                    size="small"
                  />
                </template>
              </Select.Option>
              <p
                v-if="!matches.length"
                class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
              >
                No versions match"{{ query }}".
              </p>
            </Select.Group>
            <template #footer>
              <Select.Option
                value="__create-version__"
                class="w-full"
              >
                <span class="flex items-center gap-(--spacing-xs)">
                  <i
                    class="pi pi-plus-circle"
                    aria-hidden="true"
                  />
                  Add Version
                </span>
              </Select.Option>
            </template>
          </Select.Content>
        </Select>
      </div>
    </nav>
    <div class="grid min-h-0 flex-1">
      <Resizable
        orientation="horizontal"
        aria-label="Version workspace"
      >
        <Resizable.Pane aria-label="Version settings">
          <div class="flex min-h-0 min-w-0 flex-1 flex-col">
            <PageTabs v-model="activeTab">
              <Tabs.Item
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :label="tab.label"
              />
              <template #actions>
                <Tag
                  label="Draft"
                  severity="warning"
                  icon="pi pi-file-edit"
                  size="medium"
                />
                <DropdownMenu
                  placement="bottom-end"
                  @select="openHistory"
                >
                  <DropdownMenu.Trigger>
                    <IconButton
                      icon="pi pi-ellipsis-h"
                      kind="transparent"
                      size="small"
                      aria-label="Version actions"
                    />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="edit"
                      label="Edit version info"
                    >
                      <template #left>
                        <i
                          class="pi pi-pencil"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="history"
                      :label="historyCollapsed ? 'Show version history' : 'Hide version history'"
                    >
                      <template #left>
                        <i
                          class="pi pi-history"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                </DropdownMenu>
              </template>
            </PageTabs>

            <section
              v-if="activeTab === 'source'"
              class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
            >
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
                          kind="outlined"
                          size="medium"
                          icon="pi pi-upload"
                          @click="upload"
                        />
                      </template>
                    </PageHeader>

                    <section
                      class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)"
                    >
                      <header class="flex items-center gap-(--layout-group-gap)">
                        <div class="flex min-w-36 grow basis-(--container-2xs)">
                          <Input
                            v-model="search"
                            size="medium"
                            placeholder="Search in folder"
                            aria-label="Search in folder"
                            class="w-full"
                          >
                            <template #iconLeft>
                              <i
                                class="pi pi-search"
                                aria-hidden="true"
                              />
                            </template>
                          </Input>
                        </div>
                        <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                          <Tooltip
                            text="Refresh"
                            class="shrink-0"
                          >
                            <IconButton
                              icon="pi pi-refresh"
                              kind="outlined"
                              size="medium"
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
                              size="medium"
                              :disabled="!tableRef"
                              aria-label="Download CSV"
                              @click="tableRef?.exportCsv({ filename: 'web-app-source.csv' })"
                            />
                          </Tooltip>
                          <Tooltip
                            text="Columns"
                            class="shrink-0"
                          >
                            <IconButton
                              icon="ai ai-column"
                              kind="outlined"
                              size="medium"
                              aria-label="Columns"
                            />
                          </Tooltip>
                          <Tooltip
                            text="Open in Object Storage"
                            class="shrink-0"
                          >
                            <IconButton
                              icon="pi pi-external-link"
                              kind="outlined"
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
                        <template #content>
                          <TableRoot
                            ref="tableRef"
                            v-model:globalFilter="search"
                            :data="rows"
                            :columns="fileColumns"
                            row-key="id"
                            paginated
                            :page-size="10"
                            :bordered="false"
                            :loading="loading"
                            aria-label="Source files"
                          >
                            <template #cell-name="{ row }">
                              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                                <i
                                  :class="row.icon"
                                  class="shrink-0 text-body-lg text-(--text-muted)"
                                  aria-hidden="true"
                                />
                                <button
                                  v-if="row.kind !== 'file'"
                                  type="button"
                                  class="truncate rounded-(--shape-button) text-start text-body-sm text-(--text-default) underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                                  :aria-label="
                                    row.kind === 'parent' ? 'Up one folder' : `Open ${row.name}`
                                  "
                                  @click="openRow(row)"
                                >
                                  {{ row.name }}
                                </button>
                                <span
                                  v-else
                                  class="truncate text-body-sm text-(--text-default)"
                                  >{{ row.name }}</span
                                >
                              </div>
                            </template>
                            <template #cell-size="{ value }">
                              <span class="text-body-sm text-(--text-muted)">{{ value }}</span>
                            </template>
                            <template #cell-modifiedAt="{ row }">
                              <Table.CellTime
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
                                icon="pi pi-search"
                                title="No matching source files"
                                :description="`Nothing matches ${search.trim()}.`"
                              >
                                <template #actions>
                                  <Button
                                    label="Clear search"
                                    kind="outlined"
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
                                    kind="outlined"
                                    size="medium"
                                    icon="pi pi-upload"
                                    @click="upload"
                                  />
                                  <Button
                                    label="Open Bucket"
                                    kind="transparent"
                                    size="medium"
                                    :href="`/object-storage/${bucket}`"
                                  />
                                </template>
                              </EmptyState>
                            </template>
                          </TableRoot>
                        </template>
                      </Card>
                    </section>
                  </div>
                </div>
              </ScrollArea>
            </section>
            <section
              v-else
              class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
            >
              <div class="layout-column layout-boundary flex min-w-0 flex-col">
                <div class="layout-section-start">
                  <EmptyState
                    size="medium"
                    icon="pi pi-external-link"
                    :title="tabLabel"
                    :description="`${tabLabel} opens on its own page.`"
                  >
                    <template #actions>
                      <Button
                        :label="`Open ${tabLabel}`"
                        kind="outlined"
                        size="small"
                        :href="`/resources/web-app/${activeTab}`"
                      />
                    </template>
                  </EmptyState>
                </div>
              </div>
            </section>

            <Transition
              appear
              enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
              enter-from-class="translate-y-2 opacity-0"
            >
              <footer
                class="flex min-h-14 shrink-0 flex-col border-t border-(--border-default) bg-(--bg-surface)"
                data-testid="version-detail-bar"
              >
                <div
                  class="layout-boundary-inline flex min-w-0 flex-1 items-center gap-(--spacing-sm) py-(--spacing-xs)"
                >
                  <span
                    class="hidden size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) md:flex"
                    aria-hidden="true"
                  >
                    <i class="pi pi-file-edit text-body-sm text-(--text-default)" />
                  </span>
                  <div
                    class="flex min-w-0 flex-1 flex-col"
                    role="status"
                  >
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-body-sm text-(--text-default)">Draft</span>
                      <span class="hidden shrink-0 sm:inline-flex">
                        <Tag
                          label="Editable"
                          severity="info"
                          size="small"
                        />
                      </span>
                    </div>
                    <p
                      class="hidden truncate text-body-xs text-(--text-muted) data-dirty:text-(--text-default) md:block"
                      title="This version is open for editing. Deploy it when ready."
                    >
                      This version is open for editing. Deploy it when ready.
                    </p>
                  </div>

                  <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                    <SplitButton
                      :label="saveOptions.find((option) => option.value === saveAction)?.label"
                      :icon="saveAction === 'deploy' ? 'pi pi-cloud-upload' : ''"
                      kind="primary"
                      size="medium"
                      :model="saveOptions"
                      @item-click="(_event, item) => (saveAction = item.value)"
                    />
                  </div>
                </div>
              </footer>
            </Transition>
          </div>
        </Resizable.Pane>
        <Resizable.Handle
          v-if="!historyCollapsed"
          aria-label="Resize the version history"
        />
        <Resizable.Pane
          v-model:basis="historyBasis"
          v-model:collapsed="historyCollapsed"
          collapsible
          :min="280"
          :max="560"
          aria-label="Version history"
        >
          <aside
            :inert="historyCollapsed"
            aria-labelledby="version-history-title"
            class="flex min-h-0 min-w-0 flex-1 flex-col bg-(--bg-surface)"
            data-testid="version-detail-history"
            @keydown.esc="historyCollapsed = true"
          >
            <header
              class="flex min-h-14 shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) py-(--spacing-xs) ps-(--spacing-lg) pe-(--spacing-sm)"
            >
              <h2
                id="version-history-title"
                class="truncate text-label-lg text-(--text-default)"
              >
                Version history
              </h2>
              <IconButton
                icon="pi pi-times"
                kind="transparent"
                size="small"
                aria-label="Close version history"
                @click="historyCollapsed = true"
              />
            </header>
            <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-(--spacing-lg)">
              <ol class="flex flex-col">
                <li class="relative flex gap-(--spacing-sm) pb-(--spacing-lg)">
                  <span
                    class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                    aria-hidden="true"
                  />
                  <span
                    class="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-contrast)"
                    aria-hidden="true"
                  >
                    <i class="pi pi-file-edit text-body-xs" />
                  </span>
                  <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-label-md text-(--text-default)">
                        {{ version.name }}
                      </span>
                      <span class="flex shrink-0">
                        <Tag
                          :label="version.tag.label"
                          :severity="version.tag.severity"
                          size="small"
                        />
                      </span>
                      <span
                        v-if="!editing"
                        class="ms-auto shrink-0"
                      >
                        <IconButton
                          icon="pi pi-pencil"
                          kind="transparent"
                          size="small"
                          aria-label="Edit version info"
                          @click="
                            () => {
                              draftText = description
                              editing = true
                            }
                          "
                        />
                      </span>
                    </div>
                    <p class="text-label-sm text-(--text-muted)">Current version</p>

                    <div
                      v-if="editing"
                      class="flex flex-col gap-(--spacing-sm) pt-(--spacing-xs)"
                    >
                      <Field>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                          v-model="draftText"
                          placeholder="What changed in this version?"
                        />
                        <Field.Description
                          >Shows in the version list and on the deployment.</Field.Description
                        >
                      </Field>
                      <div class="flex justify-end gap-(--spacing-xs)">
                        <Button
                          label="Cancel"
                          kind="outlined"
                          size="small"
                          @click="editing = false"
                        />
                        <Button
                          label="Save"
                          kind="primary"
                          size="small"
                          @click="
                            () => {
                              description = draftText.trim()
                              editing = false
                            }
                          "
                        />
                      </div>
                    </div>
                    <template v-else>
                      <p
                        :data-empty="!description || null"
                        class="text-body-sm text-(--text-default) data-empty:text-(--text-muted)"
                      >
                        {{ description || 'No description' }}
                      </p>
                      <span
                        class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                      >
                        <span class="flex shrink-0">
                          <Avatar
                            :alt="version.author"
                            :label="version.author"
                            size="small"
                            kind="square"
                          />
                        </span>
                        <span class="truncate"
                          >{{ version.author }} · {{ version.createdAgo }}</span
                        >
                      </span>
                    </template>
                  </div>
                </li>

                <li class="relative flex flex-col pb-(--spacing-lg)">
                  <span
                    class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                    aria-hidden="true"
                  />
                  <p class="flex gap-(--spacing-sm)">
                    <span
                      class="relative flex size-7 shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <span
                        class="size-2 rounded-full border border-(--border-strong) bg-(--bg-surface)"
                      />
                    </span>
                    <span class="pt-1 text-body-sm text-(--text-muted)">
                      No changes yet. Each change you save shows up here.
                    </span>
                  </p>
                </li>

                <li
                  v-for="(entry, index) in earlier.slice(0, shown)"
                  :key="entry.id"
                  class="relative flex pb-(--spacing-lg) last:pb-0"
                >
                  <span
                    v-if="index < earlier.slice(0, shown).length - 1"
                    class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                    aria-hidden="true"
                  />
                  <a
                    :href="`/resources/web-app/versions/${entry.name}`"
                    class="group flex w-full min-w-0 gap-(--spacing-sm) rounded-(--shape-button) text-start no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                  >
                    <span
                      class="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-(--border-default) bg-(--bg-surface) text-(--text-default)"
                      aria-hidden="true"
                    >
                      <i class="pi pi-code text-body-xs" />
                    </span>
                    <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
                      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <span
                          class="truncate text-label-md text-(--text-default) group-hover:underline"
                        >
                          {{ entry.name }}
                        </span>
                        <span class="flex shrink-0">
                          <Tag
                            :label="entry.tag.label"
                            :severity="entry.tag.severity"
                            size="small"
                          />
                        </span>
                      </span>
                      <span class="line-clamp-2 text-body-sm text-(--text-muted)">
                        {{ entry.comment }}
                      </span>
                      <span
                        class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                      >
                        <span class="flex shrink-0">
                          <Avatar
                            :alt="entry.author"
                            :label="entry.author"
                            size="small"
                            kind="square"
                          />
                        </span>
                        <span class="truncate">{{ entry.author }} · {{ entry.createdAgo }}</span>
                      </span>
                    </span>
                  </a>
                </li>
              </ol>

              <div
                v-if="earlier.length > shown"
                class="pt-(--spacing-sm)"
              >
                <Button
                  label="Show older"
                  kind="transparent"
                  size="small"
                  @click="shown += 5"
                />
              </div>
            </div>
          </aside>
        </Resizable.Pane>
      </Resizable>
    </div>
  </div>
</template>
