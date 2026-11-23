<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import type {
    DropdownMenuItemValue,
    TableColumn,
    TableExposed
  } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import type { UseCollectionReturn } from '@aziontech/webkit/use-collection'
  import { ref } from 'vue'

  import type { DnsZoneDetailRecord, DnsZoneDetailZone } from '../detail-dns-zone.vue'
  import { dnsZonePolicyLabel as policyLabel } from '../dns-zone-policy'

  export interface DnsZoneRecordsTabProps {
    /** The zone the records belong to. */
    zone: DnsZoneDetailZone
    /** The records collection: filters, preferences and table state. */
    collection: UseCollectionReturn<DnsZoneDetailRecord, TableColumn>
    /** The records request is in flight. */
    loading: boolean
    /** Why the records failed to load. */
    error: string
    /** Shows Import zone file in the Records heading. */
    importable: boolean
    /** The controls are locked while nothing can be filtered. */
    blocked: boolean
  }

  const props = defineProps<DnsZoneRecordsTabProps>()

  const emit = defineEmits<{
    create: [event: MouseEvent]
    import: [event: MouseEvent]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'row-action': [
      event: Event,
      payload: { value: DropdownMenuItemValue; record: DnsZoneDetailRecord }
    ]
  }>()

  const {
    tableProps,
    paginationProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters,
    loading: fetching
  } = props.collection

  const onRowAction = (event: Event, value: DropdownMenuItemValue, record: DnsZoneDetailRecord) =>
    emit('row-action', event, { value, record })

  const tableEl = ref<TableExposed<DnsZoneDetailRecord> | null>(null)
</script>

<template>
  <section class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1">
    <div class="layout-column layout-boundary flex min-w-0 flex-col">
      <PageHeader
        title="Records"
        description="The authoritative records this zone answers with."
        size="small"
      >
        <template #actions>
          <Button
            label="Documentation"
            aria-label="Documentation (opens in a new tab)"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/records"
            target="_blank"
          />
          <Button
            v-if="importable"
            label="Import zone file"
            icon="az az-file-import"
            variant="outline"
            size="medium"
            @click="(event: MouseEvent) => emit('import', event)"
          />
          <Button
            label="Add Record"
            icon="az az-plus"
            variant="outline"
            size="medium"
            @click="(event: MouseEvent) => emit('create', event)"
          />
        </template>
      </PageHeader>
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header class="flex items-start gap-(--layout-group-gap)">
            <div class="flex min-w-0 grow">
              <PropertyFilter
                v-bind="propertyFilterProps"
                placeholder="Filter records"
                aria-label="Filter records"
                :disabled="blocked"
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
                  @click="(event: MouseEvent) => emit('refresh', event)"
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
                  :disabled="blocked || !matchingItems.length"
                  aria-label="Download CSV"
                  @click="tableEl?.exportCsv({ filename: 'records.csv' })"
                />
              </Tooltip>
              <CollectionPreferences
                v-bind="preferencesProps"
                title="Table preferences"
                :disabled="blocked"
              />
            </div>
          </header>
          <Alert
            v-if="error"
            severity="danger"
            :label="error"
            action-label="Retry"
            @action="(event: MouseEvent) => emit('retry', event)"
          />
          <Card
            v-else
            :padded="false"
          >
            <template #default>
              <DataTable
                ref="tableEl"
                v-bind="tableProps"
                :loading="loading || fetching"
                sortable
                :bordered="false"
              >
                <template #cell-name="{ value }">
                  <span class="min-w-0 truncate">{{ value }}</span>
                </template>
                <template #cell-id="{ value }">
                  <TableCellId
                    :value="value"
                    resource="record"
                  />
                </template>
                <template #cell-type="{ value }">
                  <Tag
                    :label="value"
                    severity="neutral"
                    size="medium"
                  />
                </template>
                <template #cell-value="{ value }">
                  <TableCellLink
                    :label="value"
                    copyable
                    @click.stop
                  />
                </template>
                <template #cell-policy="{ value }">
                  <span class="min-w-0 truncate">{{ policyLabel(value) }}</span>
                </template>
                <template #cell-weight="{ value }">
                  <span class="min-w-0 truncate">{{ value ?? '' }}</span>
                </template>
                <template #cell-description="{ value }">
                  <span class="min-w-0 truncate">{{ value }}</span>
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
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        value="delete"
                        label="Delete"
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
                    key="empty-state-1"
                    v-if="status === 'no-match'"
                    size="medium"
                    icon="az az-filter-off"
                    title="No matching records"
                    description="No record matches these filters."
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
                  <EmptyState
                    key="empty-state-2"
                    v-else
                    size="medium"
                    icon="az az-list"
                    title="No records yet"
                    :description="`Add a record, or import a zone file, so this zone starts answering for ${zone.domain}.`"
                  >
                    <template #actions>
                      <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                        <Button
                          label="Add Record"
                          icon="az az-plus"
                          variant="secondary"
                          size="small"
                          @click="(event: MouseEvent) => emit('create', event)"
                        />
                        <Button
                          label="Import zone file"
                          icon="az az-upload"
                          variant="outline"
                          size="small"
                          @click="(event: MouseEvent) => emit('import', event)"
                        />
                      </div>
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
    </div>
  </section>
</template>
