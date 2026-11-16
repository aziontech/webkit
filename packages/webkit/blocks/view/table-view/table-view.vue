<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DataTable, {
    type DropdownMenuItemValue,
    type TableColumn,
    type TableExposed
  } from '@aziontech/webkit/data-table'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref, useId } from 'vue'

  type ResourceStatus = 'Live' | 'Inactive'

  type Resource = {
    id: string
    name: string
    domain: string
    domains: string[]
    status: ResourceStatus
    owner: string
    modifiedAt: Date
  }

  const owners = [
    'Ethan Brooks',
    'Jordan Kim',
    'Taylor Reed',
    'John Smith',
    'Sam Lee',
    'Priya Patel',
    'Chris Taylor',
    'Riley Carter'
  ]

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    {
      key: 'owner',
      label: 'Author',
      options: owners.map((owner) => ({ value: owner }))
    },
    { key: 'status', label: 'Status', options: [{ value: 'Live' }, { value: 'Inactive' }] },
    { key: 'domain', label: 'Domain' }
  ]

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'domain', header: 'Domains', grow: 2 },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 104 },
    { accessorKey: 'modifiedAt', header: 'Last modified', sortable: true, minWidth: 80 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const referenceTime = Date.UTC(2026, 10, 10, 12)
  const daysAgo = (days: number) => new Date(referenceTime - days * 86_400_000)

  const resource = (
    n: number,
    owner: string,
    days: number,
    status: ResourceStatus = 'Live'
  ): Resource => {
    const name = `resource-${String(n).padStart(2, '0')}`
    const domain = `${name}.example.com`
    return {
      id: `10${20482 + n * 173}`,
      name,
      domain,
      domains: [
        domain,
        ...Array.from({ length: n * 7 }, (_, j) => `${name}-alias-${j + 1}.example.com`)
      ],
      status,
      owner,
      modifiedAt: daysAgo(days)
    }
  }

  const rows: Resource[] = [
    resource(1, 'Ethan Brooks', 0),
    resource(2, 'Jordan Kim', 18),
    resource(3, 'Taylor Reed', 36),
    resource(4, 'John Smith', 54),
    resource(5, 'Sam Lee', 72),
    resource(6, 'Priya Patel', 90),
    resource(7, 'Chris Taylor', 108),
    resource(8, 'Riley Carter', 126),
    resource(9, 'Ethan Brooks', 144, 'Inactive'),
    resource(10, 'Jordan Kim', 162)
  ]

  const items = ref<Resource[]>(rows)

  const {
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters,
    refresh: retry,
    loading: fetching
  } = useCollection({
    items,
    columns,
    filtering: { fields: ['name', 'id', 'domain', 'owner', 'status'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'resources-table',
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

  const resourcesTableEl = ref<TableExposed<Resource> | null>(null)
  const exportCsv = () => resourcesTableEl.value?.exportCsv({ filename: 'resources.csv' })

  const pending = ref<Resource | null>(null)
  const deleteOpen = ref(false)
  const confirmation = ref('')
  const confirmLabelId = useId()
  const canDelete = computed(
    () => pending.value !== null && confirmation.value.trim() === pending.value.name
  )

  const onRowAction = (value: DropdownMenuItemValue, row: Resource) => {
    if (value !== 'delete') return
    pending.value = row
    confirmation.value = ''
    deleteOpen.value = true
  }

  const confirmDelete = () => {
    if (!canDelete.value) return
    items.value = items.value.filter((item) => item.id !== pending.value?.id)
    deleteOpen.value = false
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Resources"
        description="View and manage your resources."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="ai ai-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/resources"
            target="_blank"
          />
          <Button
            label="Create Resource"
            icon="ai ai-plus"
            variant="primary"
            size="large"
          />
        </template>
      </PageHeader>
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header class="flex items-start gap-(--layout-group-gap)">
            <div class="flex min-w-0 grow">
              <PropertyFilter
                v-bind="propertyFilterProps"
                placeholder="Filter resources"
                aria-label="Filter resources"
              />
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
                  icon="ai ai-download"
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
                  icon="ai ai-box"
                  title="No resources yet"
                  description="Create a resource to start serving traffic on your domains."
                >
                  <template #actions>
                    <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                      <Button
                        label="Create Resource"
                        icon="ai ai-plus"
                        variant="secondary"
                        size="small"
                      />
                      <Button
                        label="Documentation"
                        icon="ai ai-book"
                        variant="outline"
                        size="small"
                        href="https://example.com/docs/resources"
                        target="_blank"
                      />
                    </div>
                  </template>
                </EmptyState>
              </template>
            </Card>
            <Alert
              v-else-if="status === 'error'"
              severity="danger"
              label="Couldn't load the resources. Check your connection and retry."
              action-label="Retry"
              @action="retry"
            />
            <Card
              key="card-2"
              v-else
              :padded="false"
            >
              <template #default>
                <DataTable
                  ref="resourcesTableEl"
                  v-bind="tableProps"
                  :loading="loading || fetching"
                  sortable
                  :bordered="false"
                >
                  <template #cell-name="{ row }">
                    <TableCellLink
                      :label="row.name"
                      :to="`/resources/${row.id}`"
                      destination="Resources"
                    />
                  </template>
                  <template #cell-id="{ value }">
                    <TableCellId
                      :value="value"
                      resource="resource"
                    />
                  </template>
                  <template #cell-domain="{ row }">
                    <TableCellLink
                      :label="row.domain"
                      :href="`https://${row.domain}`"
                      :more="
                        row.domains.slice(1).map((label) => ({ label, href: `https://${label}` }))
                      "
                      :noun="{ one: 'domain', other: 'domains' }"
                      copyable
                    />
                  </template>
                  <template #cell-status="{ value }">
                    <TableCellStatus
                      :label="value"
                      :severity="value === 'Live' ? 'success' : 'neutral'"
                    />
                  </template>
                  <template #cell-modifiedAt="{ row }">
                    <TableCellTime
                      :value="row.modifiedAt"
                      :author="row.owner"
                    />
                  </template>
                  <template #cell-actions="{ row }">
                    <TableCellActions
                      :name="row.name"
                      @select="(_event, value) => onRowAction(value, row)"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          value="deploy"
                          label="Deploy"
                        >
                          <template #leading
                            ><i
                              class="ai ai-cloud-upload"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          value="view"
                          label="View details"
                        >
                          <template #leading
                            ><i
                              class="ai ai-eye"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          value="duplicate"
                          label="Clone"
                        >
                          <template #leading
                            ><i
                              class="ai ai-copy"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          value="delete"
                          label="Delete"
                        >
                          <template #leading
                            ><i
                              class="ai ai-trash"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </TableCellActions>
                  </template>
                  <template #empty>
                    <EmptyState
                      size="medium"
                      icon="ai ai-filter-off"
                      title="No matching resources"
                      description="No resource matches these filters."
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
    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete resource"
      size="medium"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          severity="warning"
          label="Once confirmed, this action can't be reversed."
        />
        <p class="m-0 text-body-sm text-(--text-muted)">
          The selected resource will be deleted, along with its domains and settings.
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
          variant="outline"
          size="medium"
          @click="close"
        />
        <Button
          label="Delete resource"
          variant="danger"
          size="medium"
          :disabled="!canDelete"
          @click="confirmDelete"
        />
      </template>
    </ConfirmDialog>
  </div>
</template>
