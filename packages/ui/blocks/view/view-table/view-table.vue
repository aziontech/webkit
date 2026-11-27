<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import DataTable, {
    type DropdownMenuItemValue,
    type TableColumn,
    type TableExposed
  } from '@aziontech/ui/data-table'
  import DataTablePagination from '@aziontech/ui/data-table-pagination'
  import DropdownMenuGroup from '@aziontech/ui/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/ui/dropdown-menu-item'
  import EmptyState from '@aziontech/ui/empty-state'
  import PageHeader from '@aziontech/ui/page-header'
  import TableCellActions from '@aziontech/ui/table-cell-actions'
  import TableCellId from '@aziontech/ui/table-cell-id'
  import TableCellLink from '@aziontech/ui/table-cell-link'
  import TableCellStatus from '@aziontech/ui/table-cell-status'
  import TableCellTime from '@aziontech/ui/table-cell-time'
  import { type FilteringProperty, useCollection } from '@aziontech/ui/use-collection'
  import { computed, ref, watch } from 'vue'

  import CollectionControls from './parts/collection-controls.vue'
  import { sampleResources } from './sample'

  /** Whether a resource serves traffic. */
  export type TableViewResourceStatus = 'Live' | 'Inactive'

  /** One row of the table. */
  export interface TableViewResource {
    /** Stable key, shown in the hidden ID column. */
    id: string
    /** Display name, linked to the resource page. */
    name: string
    /** The first domain, shown in the row. */
    domain: string
    /** Every domain, the first one included; the rest open from the row's more link. */
    domains: string[]
    /** Whether the resource serves traffic. */
    status: TableViewResourceStatus
    /** Who changed it last. */
    owner: string
    /** When it changed last. */
    modifiedAt: Date
  }

  export interface TableViewProps {
    /** The resources to list; filtered, sorted and paged in the browser. Left out, the sample renders. */
    resources?: TableViewResource[]
    /** A request is in flight: with no rows it is the first load, with rows a refresh. */
    loading?: boolean
    /** Why the resources could not load; a danger alert with Retry replaces the table. */
    error?: string
  }

  const props = withDefaults(defineProps<TableViewProps>(), {
    resources: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    create: [event: MouseEvent]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'row-action': [
      event: Event,
      payload: { value: DropdownMenuItemValue; resource: TableViewResource }
    ]
    delete: [event: Event, resource: TableViewResource]
  }>()

  const source = computed<TableViewResource[]>(
    () => props.resources ?? (props.loading || props.error ? [] : sampleResources)
  )
  const items = ref<TableViewResource[]>([])
  watch(
    source,
    (next) => {
      items.value = [...next]
    },
    { immediate: true }
  )

  const firstLoad = computed(() => props.loading && items.value.length === 0)
  const blocked = computed(() => firstLoad.value || props.error !== '')

  const properties = computed<FilteringProperty[]>(() => [
    { key: 'name', label: 'Name' },
    {
      key: 'owner',
      label: 'Author',
      options: [...new Set(items.value.map((item) => item.owner))].map((value) => ({ value }))
    },
    { key: 'status', label: 'Status', options: [{ value: 'Live' }, { value: 'Inactive' }] },
    { key: 'domain', label: 'Domain' }
  ])

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 104 },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'domain', header: 'Domains', grow: 2 },
    { accessorKey: 'modifiedAt', header: 'Last modified', sortable: true, minWidth: 80 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const {
    paginationProps,
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
    filtering: { fields: ['name', 'id', 'domain', 'owner', 'status'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'resources-table',
      defaults: { columns: [{ id: 'id', visible: false }] }
    },
    url: true
  })

  const resourcesTableEl = ref<TableExposed<TableViewResource> | null>(null)
  const exportCsv = () => resourcesTableEl.value?.exportCsv({ filename: 'resources.csv' })

  const pending = ref<TableViewResource | null>(null)
  const deleteOpen = ref(false)

  const askDelete = (row: TableViewResource) => {
    pending.value = row
    deleteOpen.value = true
  }

  const onRowOpen = (event: MouseEvent | KeyboardEvent, row: TableViewResource) => {
    if (event instanceof KeyboardEvent) emit('row-action', event, { value: 'view', resource: row })
  }

  const onRowAction = (event: Event, value: DropdownMenuItemValue, row: TableViewResource) => {
    if (value !== 'delete') {
      emit('row-action', event, { value, resource: row })
      return
    }
    askDelete(row)
  }

  const confirmDelete = (event: Event) => {
    const resource = pending.value
    if (!resource) return
    items.value = items.value.filter((item) => item.id !== resource.id)
    deleteOpen.value = false
    emit('delete', event, resource)
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
            aria-label="Documentation (opens in a new tab)"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/resources"
            target="_blank"
          />
          <Button
            v-if="error || loading || status !== 'empty'"
            label="Create Resource"
            icon="az az-plus"
            variant="primary"
            size="medium"
            @click="(event: MouseEvent) => emit('create', event)"
          />
        </template>
      </PageHeader>
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <CollectionControls
            :property-filter-props="propertyFilterProps"
            :preferences-props="preferencesProps"
            label="Filter resources"
            :loading="loading"
            :disabled="blocked"
            :download-disabled="blocked || !matchingItems.length"
            @refresh="(event: MouseEvent) => emit('refresh', event)"
            @download="exportCsv"
          />
          <section class="flex min-h-0 flex-col">
            <Alert
              v-if="error"
              severity="danger"
              :label="error"
              action-label="Retry"
              @action="(event: MouseEvent) => emit('retry', event)"
            />
            <Card
              key="card-1"
              v-else-if="status === 'empty' && !loading"
              :padded="false"
            >
              <template #default>
                <EmptyState
                  size="medium"
                  icon="az az-box"
                  title="No resources yet"
                  description="Create a resource to start serving traffic on your domains."
                >
                  <template #actions>
                    <Button
                      label="Create Resource"
                      icon="az az-plus"
                      variant="primary"
                      size="medium"
                      @click="(event: MouseEvent) => emit('create', event)"
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
                  ref="resourcesTableEl"
                  v-bind="tableProps"
                  :loading="loading || fetching"
                  sortable
                  :bordered="false"
                  @row-click="onRowOpen"
                  @row-remove="(_event, row) => askDelete(row)"
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
                      @select="(event, value) => onRowAction(event, value, row)"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          value="deploy"
                          label="Deploy"
                        >
                          <template #leading
                            ><i
                              class="az az-cloud-upload"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
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
                          value="duplicate"
                          label="Clone"
                        >
                          <template #leading
                            ><i
                              class="az az-copy"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          value="delete"
                          label="Delete"
                          severity="danger"
                        >
                          <template #leading
                            ><i
                              class="az az-trash"
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
                  <template #footer>
                    <DataTablePagination
                      v-bind="paginationProps"
                      manual
                    />
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
      confirm-label="Delete resource"
      :confirmation-phrase="pending?.name ?? ''"
      @confirm="confirmDelete"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          severity="warning"
          label="Once confirmed, this action can't be reversed."
        />
        <p class="m-0 text-body-sm text-(--text-muted)">
          The selected resource will be deleted, along with its domains and settings.
        </p>
      </div>
    </ConfirmDialog>
  </div>
</template>
