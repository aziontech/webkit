<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import type { TableColumn, TableExposed } from '@aziontech/webkit/table-root'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'versions', label: 'Versions' },
    { value: 'build', label: 'Build' },
    { value: 'deployments', label: 'Deployments' }
  ]

  const activeTab = ref('versions')

  const columns: TableColumn[] = [
    {
      accessorKey: 'name',
      header: 'Version',
      enableSorting: true,
      principal: true,
      hideable: false
    },
    { accessorKey: 'description', header: 'Description', grow: 2 },
    { accessorKey: 'state', header: 'Status', enableSorting: true, minWidth: 104 },
    { accessorKey: 'createdAt', header: 'Created', enableSorting: true, minWidth: 80 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const versions = [
    {
      id: 'ANWDC7RA',
      name: 'ANWDC7RA',
      state: 'active',
      description: 'Reorder rules',
      author: 'Bruno Germano',
      createdAt: '2026-11-05T17:37:18.145Z',
      createdAgo: '21 hours ago'
    },
    {
      id: 'APA7237R',
      name: 'APA7237R',
      state: 'ready',
      description: 'Add rule"Security headers"',
      author: 'Gab Lisboa',
      createdAt: '2026-11-03T14:37:18.145Z',
      createdAgo: '3 days ago'
    },
    {
      id: 'AQO0RYO8',
      name: 'AQO0RYO8',
      state: 'ready',
      description: 'Bypass cache for /api/*',
      author: 'Robson Junior',
      createdAt: '2026-11-02T14:37:18.145Z',
      createdAgo: '4 days ago'
    },
    {
      id: 'AS1UHU4P',
      name: 'AS1UHU4P',
      state: 'ready',
      description: 'Add rule"Redirect /blog to docs"',
      author: 'Isaque Böck',
      createdAt: '2026-11-01T14:37:18.145Z',
      createdAgo: '5 days ago'
    },
    {
      id: 'ATFO7PL6',
      name: 'ATFO7PL6',
      state: 'ready',
      description: 'Add function"image-resize"',
      author: 'Rafael Garbinatto',
      createdAt: '2026-10-31T14:37:18.145Z',
      createdAgo: '6 days ago'
    },
    {
      id: 'AUTHXL1N',
      name: 'AUTHXL1N',
      state: 'ready',
      description: 'Reorder rules',
      author: 'Herbert Júlio',
      createdAt: '2026-10-30T14:37:18.145Z',
      createdAgo: '1 week ago'
    },
    {
      id: 'AW7BNGI4',
      name: 'AW7BNGI4',
      state: 'ready',
      description: 'Add rule"Security headers"',
      author: 'Rafael Umman',
      createdAt: '2026-10-29T14:37:18.145Z',
      createdAgo: '1 week ago'
    },
    {
      id: 'AXL5DBYL',
      name: 'AXL5DBYL',
      state: 'ready',
      description: 'Bypass cache for /api/*',
      author: 'Marcus Grando',
      createdAt: '2026-10-28T14:37:18.145Z',
      createdAgo: '1 week ago'
    },
    {
      id: 'AYYZ37F2',
      name: 'AYYZ37F2',
      state: 'ready',
      description: 'Add rule"Redirect /blog to docs"',
      author: 'Bruno Germano',
      createdAt: '2026-10-27T14:37:18.145Z',
      createdAgo: '1 week ago'
    },
    {
      id: 'A1CST2VJ',
      name: 'A1CST2VJ',
      state: 'ready',
      description: 'Add function"image-resize"',
      author: 'Gab Lisboa',
      createdAt: '2026-10-26T14:37:18.145Z',
      createdAgo: '2 weeks ago'
    },
    {
      id: 'A2QMIYC0',
      name: 'A2QMIYC0',
      state: 'ready',
      description: 'Reorder rules',
      author: 'Robson Junior',
      createdAt: '2026-10-24T14:37:18.145Z',
      createdAgo: '2 weeks ago'
    },
    {
      id: 'A44G8TSH',
      name: 'A44G8TSH',
      state: 'ready',
      description: 'Add rule"Security headers"',
      author: 'Isaque Böck',
      createdAt: '2026-10-24T14:37:18.145Z',
      createdAgo: '2 weeks ago'
    },
    {
      id: 'A5I9YP8Y',
      name: 'A5I9YP8Y',
      state: 'archived',
      description: 'Bypass cache for /api/*',
      author: 'Rafael Garbinatto',
      createdAt: '2026-10-22T14:37:18.145Z',
      createdAgo: '2 weeks ago'
    }
  ]

  const versionStates: Record<string, { label: string; severity: TagSeverity }> = {
    active: { label: 'Deployed', severity: 'primary' },
    ready: { label: 'Ready', severity: 'success' },
    archived: { label: 'Archived', severity: 'secondary' }
  }

  const deployable = ['ready', 'active']
  const latestId = 'ANWDC7RA'

  const search = ref('')
  const pagination = ref({ pageIndex: 0, pageSize: 10 })
  const tableRef = ref<TableExposed | null>(null)
  const columnVisibility = ref({})

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
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>
    </div>

    <div class="relative flex min-h-0 flex-1 flex-col">
      <section class="min-h-0 flex-1">
        <div class="flex min-h-full flex-col">
          <div class="layout-column layout-boundary flex min-w-0 flex-col">
            <PageHeader
              title="Versions"
              description="Each version is an isolated snapshot of this resource's configuration. Open one to view it, or deploy a Ready version."
              size="small"
            >
              <template #actions>
                <Button
                  label="Add Version"
                  icon="pi pi-plus"
                  kind="outlined"
                  size="medium"
                />
              </template>
            </PageHeader>

            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
              <header class="flex items-center gap-(--layout-group-gap)">
                <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
                  <div class="flex shrink-0 items-center">
                    <Button
                      label="Filter"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-filter"
                    />
                  </div>
                  <div class="flex min-w-36 grow basis-(--container-2xs)">
                    <Input
                      v-model="search"
                      size="medium"
                      placeholder="Search versions"
                      aria-label="Search versions"
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
                      @click="tableRef?.exportCsv({ filename: 'analytics-app-versions.csv' })"
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
                </div>
              </header>

              <Card :padded="false">
                <template #content>
                  <TableRoot
                    ref="tableRef"
                    v-model:pagination="pagination"
                    v-model:globalFilter="search"
                    v-model:columnVisibility="columnVisibility"
                    :data="versions"
                    :columns="columns"
                    row-key="id"
                    enable-sorting
                    paginated
                    :page-size="10"
                    :bordered="false"
                    :loading="loading"
                  >
                    <template #cell-name="{ value, row }">
                      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <span
                          class="cursor-pointer truncate font-(family-name:--font-code) text-body-sm text-(--text-default) hover:underline"
                        >
                          {{ value }}
                        </span>
                        <span
                          v-if="row.id === latestId"
                          class="shrink-0 text-body-sm text-(--text-muted)"
                        >
                          Latest
                        </span>
                      </div>
                    </template>

                    <template #cell-description="{ value }">
                      <span class="truncate text-body-sm text-(--text-muted)">{{ value }}</span>
                    </template>

                    <template #cell-state="{ value }">
                      <Tag
                        :label="versionStates[value].label"
                        :severity="versionStates[value].severity"
                        size="medium"
                      />
                    </template>

                    <template #cell-createdAt="{ row }">
                      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <Tooltip :text="row.author">
                          <Avatar
                            :alt="row.author"
                            :label="row.author"
                            size="small"
                            kind="square"
                          />
                        </Tooltip>
                        <span class="truncate text-body-sm text-(--text-muted)">{{
                          row.createdAgo
                        }}</span>
                      </div>
                    </template>

                    <template #cell-actions="{ row }">
                      <DropdownMenu placement="bottom-end">
                        <DropdownMenu.Trigger>
                          <Tooltip text="Version actions">
                            <IconButton
                              icon="pi pi-ellipsis-h"
                              kind="outlined"
                              size="small"
                              aria-label="Version actions"
                            />
                          </Tooltip>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Group>
                          <DropdownMenu.Option
                            value="open"
                            label="Open configuration"
                          >
                            <template #left>
                              <i
                                class="pi pi-eye"
                                aria-hidden="true"
                              />
                            </template>
                          </DropdownMenu.Option>
                          <DropdownMenu.Option
                            value="deploy"
                            label="Deploy"
                            :disabled="!deployable.includes(row.state)"
                          >
                            <template #left>
                              <i
                                class="pi pi-cloud-upload"
                                aria-hidden="true"
                              />
                            </template>
                          </DropdownMenu.Option>
                        </DropdownMenu.Group>
                      </DropdownMenu>
                    </template>
                  </TableRoot>
                </template>
              </Card>
            </section>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
