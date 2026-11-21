<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import type { TableColumn, TableExposed } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag, { type TagSeverity, type TagVariant } from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'versions', label: 'Versions' },
    { value: 'build', label: 'Build' },
    { value: 'deployments', label: 'Deployments' }
  ]

  const activeTab = ref('versions')
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')

  const columns: TableColumn[] = [
    {
      accessorKey: 'name',
      header: 'Version',
      sortable: true,
      principal: true,
      hideable: false
    },
    { accessorKey: 'description', header: 'Description', grow: 2 },
    { accessorKey: 'state', header: 'Status', sortable: true, minWidth: 104 },
    { accessorKey: 'createdAt', header: 'Created', sortable: true, minWidth: 80 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const versions = [
    {
      id: 'ANWDC7RA',
      name: 'ANWDC7RA',
      state: 'active',
      description: 'Reorder rules',
      author: 'Chris Taylor',
      createdAt: '2026-11-05T17:37:18.145Z'
    },
    {
      id: 'APA7237R',
      name: 'APA7237R',
      state: 'ready',
      description: 'Add rule"Security headers"',
      author: 'Riley Carter',
      createdAt: '2026-11-03T14:37:18.145Z'
    },
    {
      id: 'AQO0RYO8',
      name: 'AQO0RYO8',
      state: 'ready',
      description: 'Bypass cache for /api/*',
      author: 'Ethan Brooks',
      createdAt: '2026-11-02T14:37:18.145Z'
    },
    {
      id: 'AS1UHU4P',
      name: 'AS1UHU4P',
      state: 'ready',
      description: 'Add rule"Redirect /blog to docs"',
      author: 'Jordan Kim',
      createdAt: '2026-11-01T14:37:18.145Z'
    },
    {
      id: 'ATFO7PL6',
      name: 'ATFO7PL6',
      state: 'ready',
      description: 'Add function"image-resize"',
      author: 'Taylor Reed',
      createdAt: '2026-10-31T14:37:18.145Z'
    },
    {
      id: 'AUTHXL1N',
      name: 'AUTHXL1N',
      state: 'ready',
      description: 'Reorder rules',
      author: 'John Smith',
      createdAt: '2026-10-30T14:37:18.145Z'
    },
    {
      id: 'AW7BNGI4',
      name: 'AW7BNGI4',
      state: 'ready',
      description: 'Add rule"Security headers"',
      author: 'Sam Lee',
      createdAt: '2026-10-29T14:37:18.145Z'
    },
    {
      id: 'AXL5DBYL',
      name: 'AXL5DBYL',
      state: 'ready',
      description: 'Bypass cache for /api/*',
      author: 'Priya Patel',
      createdAt: '2026-10-28T14:37:18.145Z'
    },
    {
      id: 'AYYZ37F2',
      name: 'AYYZ37F2',
      state: 'ready',
      description: 'Add rule"Redirect /blog to docs"',
      author: 'Chris Taylor',
      createdAt: '2026-10-27T14:37:18.145Z'
    },
    {
      id: 'A1CST2VJ',
      name: 'A1CST2VJ',
      state: 'ready',
      description: 'Add function"image-resize"',
      author: 'Riley Carter',
      createdAt: '2026-10-26T14:37:18.145Z'
    },
    {
      id: 'A2QMIYC0',
      name: 'A2QMIYC0',
      state: 'ready',
      description: 'Reorder rules',
      author: 'Ethan Brooks',
      createdAt: '2026-10-24T14:37:18.145Z'
    },
    {
      id: 'A44G8TSH',
      name: 'A44G8TSH',
      state: 'ready',
      description: 'Add rule"Security headers"',
      author: 'Jordan Kim',
      createdAt: '2026-10-24T14:37:18.145Z'
    },
    {
      id: 'A5I9YP8Y',
      name: 'A5I9YP8Y',
      state: 'archived',
      description: 'Bypass cache for /api/*',
      author: 'Taylor Reed',
      createdAt: '2026-10-22T14:37:18.145Z'
    }
  ]

  const versionStates: Record<
    string,
    { label: string; severity?: TagSeverity; variant?: TagVariant }
  > = {
    active: { label: 'Deployed', variant: 'primary' },
    ready: { label: 'Ready', severity: 'success' },
    archived: { label: 'Archived', severity: 'neutral' }
  }

  const deployable = ['ready', 'active']
  const latestId = 'ANWDC7RA'

  const search = ref('')
  const page = ref(1)
  const tableEl = ref<TableExposed | null>(null)
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

  const relativeTime = useLocale().formatRelativeTime
  const ago = (value: Date | string) => (value ? relativeTime(new Date(value)) : '')
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>
    </div>

    <div
      v-if="activeTab === 'versions'"
      class="relative flex min-h-0 flex-1 flex-col"
    >
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
                  icon="az az-plus"
                  variant="outline"
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
                      variant="outline"
                      size="medium"
                      icon="az az-filter"
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
                      <template #leading>
                        <i
                          class="az az-search"
                          aria-hidden="true"
                        />
                      </template>
                    </Input>
                  </div>
                </div>
                <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                  <Tooltip
                    content="Refresh"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="az az-refresh"
                      variant="outline"
                      size="medium"
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
                      icon="az az-download"
                      variant="outline"
                      size="medium"
                      :disabled="!tableEl"
                      aria-label="Download CSV"
                      @click="tableEl?.exportCsv({ filename: 'analytics-app-versions.csv' })"
                    />
                  </Tooltip>
                  <Tooltip
                    content="Columns"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="az az-columns-3"
                      variant="outline"
                      size="medium"
                      aria-label="Columns"
                    />
                  </Tooltip>
                </div>
              </header>

              <Card :padded="false">
                <template #default>
                  <DataTable
                    ref="tableEl"
                    v-model:page="page"
                    v-model:globalFilter="search"
                    v-model:columnVisibility="columnVisibility"
                    :data="versions"
                    :columns="columns"
                    row-key="id"
                    sortable
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
                        :variant="versionStates[value].variant"
                        :severity="versionStates[value].severity"
                        size="medium"
                      />
                    </template>

                    <template #cell-createdAt="{ row }">
                      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <Tooltip :content="row.author">
                          <Avatar
                            :alt="row.author"
                            :label="row.author"
                            size="small"
                            variant="square"
                          />
                        </Tooltip>
                        <span class="truncate text-body-sm text-(--text-muted)">{{
                          ago(row.createdAt)
                        }}</span>
                      </div>
                    </template>

                    <template #cell-actions="{ row }">
                      <DropdownMenu
                        side="bottom"
                        align="end"
                      >
                        <DropdownMenu.Trigger>
                          <Tooltip content="Version actions">
                            <IconButton
                              icon="az az-ellipsis"
                              variant="outline"
                              size="small"
                              aria-label="Version actions"
                            />
                          </Tooltip>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Group>
                          <DropdownMenu.Item
                            value="open"
                            label="Open configuration"
                          >
                            <template #leading>
                              <i
                                class="az az-eye"
                                aria-hidden="true"
                              />
                            </template>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            value="deploy"
                            label="Deploy"
                            :disabled="!deployable.includes(row.state)"
                          >
                            <template #leading>
                              <i
                                class="az az-cloud-upload"
                                aria-hidden="true"
                              />
                            </template>
                          </DropdownMenu.Item>
                        </DropdownMenu.Group>
                      </DropdownMenu>
                    </template>
                  </DataTable>
                </template>
              </Card>
            </section>
          </div>
        </div>
      </section>
    </div>
    <div
      v-else
      class="relative flex min-h-0 flex-1 flex-col"
    >
      <div class="layout-column layout-boundary flex min-w-0 flex-col">
        <div class="layout-section-start">
          <EmptyState
            size="medium"
            icon="az az-external-link"
            :title="tabLabel"
            :description="`${tabLabel} opens on its own page.`"
          >
            <template #actions>
              <Button
                :label="`Open ${tabLabel}`"
                variant="outline"
                size="small"
                :href="`/resources/analytics-app/${activeTab}`"
              />
            </template>
          </EmptyState>
        </div>
      </div>
    </div>
  </div>
</template>
