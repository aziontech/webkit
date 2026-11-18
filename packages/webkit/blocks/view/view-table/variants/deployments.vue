<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import DataTable, {
    type DropdownMenuItemValue,
    type TableColumn,
    type TableExposed
  } from '@aziontech/webkit/data-table'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { ref } from 'vue'

  type DeploymentStatus = 'Ready' | 'Building' | 'Failed' | 'Queued' | 'Canceled'

  type Deployment = {
    id: string
    version: string
    current: boolean
    status: DeploymentStatus
    duration: string
    project: string
    projectId: string
    environment: string
    author: string
    deployedAt: Date
  }

  const STATUS: Record<DeploymentStatus, { severity: StatusIndicatorSeverity; loading: boolean }> =
    {
      Ready: { severity: 'success', loading: false },
      Building: { severity: 'info', loading: true },
      Failed: { severity: 'danger', loading: false },
      Queued: { severity: 'neutral', loading: false },
      Canceled: { severity: 'neutral', loading: false }
    }

  const environmentSeverity = (environment: string): TagSeverity =>
    environment === 'Production' ? 'info' : 'neutral'

  const authors = ['Jane Doe', 'John Smith', 'Alex Morgan', 'Sam Lee', 'Priya Patel']

  const properties: FilteringProperty[] = [
    { key: 'version', label: 'Version' },
    {
      key: 'status',
      label: 'Status',
      options: (Object.keys(STATUS) as DeploymentStatus[]).map((value) => ({ value }))
    },
    { key: 'project', label: 'Project' },
    {
      key: 'environment',
      label: 'Environment',
      options: [{ value: 'Production' }, { value: 'Staging' }, { value: 'Preview' }]
    },
    { key: 'author', label: 'Author', options: authors.map((value) => ({ value })) }
  ]

  const columns: TableColumn[] = [
    {
      accessorKey: 'version',
      header: 'Version',
      sortable: true,
      principal: true,
      hideable: false
    },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 128 },
    { accessorKey: 'project', header: 'Project', sortable: true, grow: 2 },
    { accessorKey: 'environment', header: 'Environment', sortable: true, minWidth: 104 },
    { accessorKey: 'deployedAt', header: 'Deployed', sortable: true, minWidth: 120 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const referenceTime = Date.UTC(2026, 10, 10, 12)
  const minutesAgo = (minutes: number) => new Date(referenceTime - minutes * 60_000)

  const rows: Deployment[] = [
    {
      id: '1048213',
      version: 'AWPT11GA',
      current: false,
      status: 'Building',
      duration: '',
      project: 'acme-store',
      projectId: '1020655',
      environment: 'Preview',
      author: 'Jane Doe',
      deployedAt: minutesAgo(2)
    },
    {
      id: '1048207',
      version: 'AY3MQWWR',
      current: true,
      status: 'Ready',
      duration: '48s',
      project: 'acme-store',
      projectId: '1020655',
      environment: 'Production',
      author: 'John Smith',
      deployedAt: minutesAgo(95)
    },
    {
      id: '1048199',
      version: 'AZHGGSD8',
      current: false,
      status: 'Failed',
      duration: '1m 12s',
      project: 'docs-site',
      projectId: '1020711',
      environment: 'Staging',
      author: 'Alex Morgan',
      deployedAt: minutesAgo(260)
    },
    {
      id: '1048184',
      version: 'A1VA6NTP',
      current: true,
      status: 'Ready',
      duration: '36s',
      project: 'docs-site',
      projectId: '1020711',
      environment: 'Production',
      author: 'Sam Lee',
      deployedAt: minutesAgo(1_440)
    },
    {
      id: '1048172',
      version: 'A393WJA6',
      current: false,
      status: 'Queued',
      duration: '',
      project: 'site-assets',
      projectId: '1020734',
      environment: 'Preview',
      author: 'Priya Patel',
      deployedAt: minutesAgo(1_445)
    },
    {
      id: '1048160',
      version: 'ATNSEE8Y',
      current: false,
      status: 'Canceled',
      duration: '9s',
      project: 'site-assets',
      projectId: '1020734',
      environment: 'Staging',
      author: 'Jane Doe',
      deployedAt: minutesAgo(2_900)
    },
    {
      id: '1048151',
      version: 'AV1M49PF',
      current: true,
      status: 'Ready',
      duration: '52s',
      project: 'site-assets',
      projectId: '1020734',
      environment: 'Production',
      author: 'John Smith',
      deployedAt: minutesAgo(4_320)
    }
  ]

  const items = ref<Deployment[]>(rows)

  const {
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters,
    loading: fetching
  } = useCollection({
    items,
    columns,
    filtering: { fields: ['version', 'id', 'project', 'environment', 'author', 'status'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'deployments-table',
      defaults: { columns: [{ id: 'id', visible: false }] }
    },
    url: true
  })

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

  const deploymentsTableEl = ref<TableExposed<Deployment> | null>(null)
  const exportCsv = () => deploymentsTableEl.value?.exportCsv({ filename: 'deployments.csv' })

  const openDeployment = (row: Deployment) => {
    window.location.assign(`/deployments/${row.id}`)
  }

  const onRowAction = (value: DropdownMenuItemValue, row: Deployment) => {
    if (value === 'view') openDeployment(row)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Deployments"
        description="Every deployment of your projects, newest first."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/deployments"
            target="_blank"
          />
        </template>
      </PageHeader>
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header class="flex items-start gap-(--layout-group-gap)">
            <div class="flex min-w-0 grow">
              <PropertyFilter
                v-bind="propertyFilterProps"
                placeholder="Filter deployments"
                aria-label="Filter deployments"
              />
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
                  :disabled="!matchingItems.length"
                  aria-label="Download CSV"
                  @click="exportCsv"
                />
              </Tooltip>
              <CollectionPreferences
                v-bind="preferencesProps"
                title="Table preferences"
              />
            </div>
          </header>
          <section class="flex min-h-0 flex-col">
            <Card
              key="card-1"
              v-if="status === 'empty'"
              :padded="false"
            >
              <template #default>
                <EmptyState
                  size="medium"
                  icon="az az-cloud-upload"
                  title="No deployments yet"
                  description="Deploy a project and every run shows up here, with its version, status and environment."
                >
                  <template #actions>
                    <Button
                      label="Documentation"
                      icon="az az-book"
                      variant="outline"
                      size="small"
                      href="https://example.com/docs/deployments"
                      target="_blank"
                    />
                  </template>
                </EmptyState>
              </template>
            </Card>
            <Card
              key="card-2"
              v-else
              :padded="false"
            >
              <template #default>
                <DataTable
                  ref="deploymentsTableEl"
                  v-bind="tableProps"
                  :loading="loading || fetching"
                  sortable
                  :bordered="false"
                  @row-click="(_event, row) => openDeployment(row)"
                >
                  <template #cell-version="{ row }">
                    <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                      <span class="truncate tabular-nums text-body-sm text-(--text-default)">
                        {{ row.version }}
                      </span>
                      <Tag
                        v-if="row.current"
                        label="Current"
                        severity="info"
                        size="small"
                        icon="az az-circle-arrow-up"
                        class="shrink-0"
                      />
                    </span>
                  </template>
                  <template #cell-id="{ value }">
                    <TableCellId
                      :value="value"
                      resource="deployment"
                    />
                  </template>
                  <template #cell-status="{ row }">
                    <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <StatusIndicator
                        :severity="STATUS[row.status].severity"
                        :loading="STATUS[row.status].loading"
                        :label="row.status"
                      />
                      <span
                        v-if="row.duration"
                        class="shrink-0 tabular-nums text-body-xs text-(--text-muted)"
                      >
                        {{ row.duration }}
                      </span>
                    </span>
                  </template>
                  <template #cell-project="{ row }">
                    <TableCellLink
                      :label="row.project"
                      :to="`/projects/${row.projectId}`"
                      destination="Projects"
                      icon="az az-box"
                    />
                  </template>
                  <template #cell-environment="{ value }">
                    <Tag
                      :label="value"
                      :severity="environmentSeverity(value)"
                      size="medium"
                      rounded
                    />
                  </template>
                  <template #cell-deployedAt="{ row }">
                    <TableCellTime
                      :value="row.deployedAt"
                      :author="row.author"
                    />
                  </template>
                  <template #cell-actions="{ row }">
                    <TableCellActions
                      :name="row.version"
                      @select="(_event, value) => onRowAction(value, row)"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          value="view"
                          label="View details"
                        >
                          <template #leading
                            ><i
                              class="az az-eye"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          value="redeploy"
                          label="Redeploy"
                        >
                          <template #leading
                            ><i
                              class="az az-refresh"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          value="promote"
                          label="Promote to production"
                          :disabled="row.environment === 'Production' || row.status !== 'Ready'"
                        >
                          <template #leading
                            ><i
                              class="az az-circle-arrow-up"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </TableCellActions>
                  </template>
                  <template #empty>
                    <EmptyState
                      size="medium"
                      icon="az az-filter-off"
                      title="No matching deployments"
                      description="No deployment matches these filters."
                    >
                      <template #actions>
                        <Button
                          label="Clear filters"
                          variant="outline"
                          size="small"
                          @click="clearFilters"
                        />
                      </template>
                    </EmptyState>
                  </template>
                </DataTable>
              </template>
            </Card>
          </section>
        </section>
      </section>
    </div>
  </div>
</template>
