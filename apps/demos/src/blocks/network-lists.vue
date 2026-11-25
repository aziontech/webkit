<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DataTable, {
    type DropdownMenuItemValue,
    type TableColumn,
    type TableExposed
  } from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PageHeader from '@aziontech/webkit/page-header'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTags from '@aziontech/webkit/table-cell-tags'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref, watch } from 'vue'

  import type { NetworkListRecord, NetworkListType } from './network-lists.sample'
  import CollectionControls from './table-view-collection-controls.vue'

  export type NetworkListStatus = 'Active' | 'Inactive'

  export interface NetworkListRow {
    id: string
    name: string
    type: string
    listType: NetworkListType
    items: string[]
    status: NetworkListStatus
    owner: string
    modifiedAt: Date
  }

  export interface NetworkListsProps {
    lists?: NetworkListRecord[]
    loading?: boolean
    error?: string
  }

  const props = withDefaults(defineProps<NetworkListsProps>(), {
    lists: () => [],
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    create: [event: MouseEvent]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'row-action': [event: Event, payload: { value: DropdownMenuItemValue; list: NetworkListRow }]
    delete: [event: Event, list: NetworkListRow]
  }>()

  const TYPE_LABELS: Record<NetworkListType, string> = {
    ip_cidr: 'IP/CIDR',
    asn: 'ASN',
    countries: 'Countries'
  }

  const TYPE_NOUNS: Record<NetworkListType, { one: string; other: string }> = {
    ip_cidr: { one: 'address', other: 'addresses' },
    asn: { one: 'ASN', other: 'ASNs' },
    countries: { one: 'country', other: 'countries' }
  }

  const toRow = (record: NetworkListRecord): NetworkListRow => ({
    id: String(record.id),
    name: record.name,
    type: TYPE_LABELS[record.type],
    listType: record.type,
    items: record.items,
    status: record.active ? 'Active' : 'Inactive',
    owner: record.last_editor,
    modifiedAt: new Date(record.last_modified)
  })

  const items = ref<NetworkListRow[]>([])
  watch(
    () => props.lists,
    (next) => {
      items.value = next.map(toRow)
    },
    { immediate: true }
  )

  const firstLoad = computed(() => props.loading && items.value.length === 0)
  const blocked = computed(() => firstLoad.value || props.error !== '')

  const properties = computed<FilteringProperty[]>(() => [
    { key: 'name', label: 'Name' },
    {
      key: 'type',
      label: 'Type',
      options: [{ value: 'IP/CIDR' }, { value: 'ASN' }, { value: 'Countries' }]
    },
    { key: 'status', label: 'Status', options: [{ value: 'Active' }, { value: 'Inactive' }] },
    {
      key: 'owner',
      label: 'Last editor',
      options: [...new Set(items.value.map((item) => item.owner))].map((value) => ({ value }))
    }
  ])

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', sortable: true, minWidth: 80 },
    { accessorKey: 'type', header: 'Type', sortable: true, minWidth: 104 },
    { accessorKey: 'items', header: 'Entries', grow: 2 },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 104 },
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
    filtering: { fields: ['name', 'id', 'type', 'owner', 'status'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: { storageKey: 'network-lists-table' },
    url: true
  })

  const listsTableEl = ref<TableExposed<NetworkListRow> | null>(null)
  const exportCsv = () => listsTableEl.value?.exportCsv({ filename: 'network-lists.csv' })

  const pending = ref<NetworkListRow | null>(null)
  const deleteOpen = ref(false)

  const askDelete = (row: NetworkListRow) => {
    pending.value = row
    deleteOpen.value = true
  }

  const onRowOpen = (event: MouseEvent | KeyboardEvent, row: NetworkListRow) => {
    if (event instanceof KeyboardEvent) emit('row-action', event, { value: 'edit', list: row })
  }

  const onRowAction = (event: Event, value: DropdownMenuItemValue, row: NetworkListRow) => {
    if (value !== 'delete') {
      emit('row-action', event, { value, list: row })
      return
    }
    askDelete(row)
  }

  const confirmDelete = (event: Event) => {
    const list = pending.value
    if (!list) return
    items.value = items.value.filter((item) => item.id !== list.id)
    deleteOpen.value = false
    emit('delete', event, list)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Network Lists"
        description="Create lists of IP addresses, ASNs or countries to use in your firewall rules."
      >
        <template #actions>
          <Button
            label="Documentation"
            aria-label="Documentation (opens in a new tab)"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://www.azion.com/en/documentation/products/secure/firewall/network-lists/"
            target="_blank"
          />
          <Button
            v-if="error || loading || status !== 'empty'"
            label="Create Network List"
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
            label="Filter network lists"
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
              key="card-empty"
              v-else-if="status === 'empty' && !loading"
              :padded="false"
            >
              <template #default>
                <EmptyState
                  size="medium"
                  icon="az az-network-lists"
                  title="No network lists yet"
                  description="Create a network list to allow or block traffic by IP address, ASN or country."
                >
                  <template #actions>
                    <Button
                      label="Create Network List"
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
              key="card-table"
              v-else
              :padded="false"
            >
              <template #default>
                <DataTable
                  ref="listsTableEl"
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
                      :to="`/network-lists/${row.id}`"
                      destination="Network Lists"
                    />
                  </template>
                  <template #cell-id="{ value }">
                    <TableCellId
                      :value="value"
                      resource="network list"
                    />
                  </template>
                  <template #cell-items="{ row }">
                    <TableCellTags
                      :items="row.items"
                      :noun="TYPE_NOUNS[row.listType as NetworkListType]"
                    />
                  </template>
                  <template #cell-status="{ value }">
                    <TableCellStatus
                      :label="value"
                      :severity="value === 'Active' ? 'success' : 'neutral'"
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
                          value="edit"
                          label="Edit"
                        >
                          <template #leading
                            ><i
                              class="az az-pencil"
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
                      title="No matching network lists"
                      description="No network list matches these filters."
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
      title="Delete network list"
      size="medium"
      confirm-label="Delete network list"
      :confirmation-phrase="pending?.name ?? ''"
      @confirm="confirmDelete"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          severity="warning"
          label="Once confirmed, this action can't be reversed."
        />
        <p class="m-0 text-body-sm text-(--text-muted)">
          Firewall rules that use this network list stop matching its entries.
        </p>
      </div>
    </ConfirmDialog>
  </div>
</template>
