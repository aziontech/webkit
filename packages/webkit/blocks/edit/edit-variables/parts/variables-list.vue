<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import type { TableColumn, TableExposed } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  import { SECRET_MASK, type VariablesRow } from '../lib/variables-rows'
  import { scopeSummary } from '../lib/variables-scope'

  export interface VariablesListProps {
    /** The rows to list; filtered, sorted and paged in the browser. */
    rows: VariablesRow[]
    /** The list is loading or refreshing. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<VariablesListProps>(), { loading: false })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    create: []
    'row-action': [event: Event, value: DropdownMenuItemValue, row: VariablesRow]
  }>()

  const columns: TableColumn[] = [
    { accessorKey: 'key', header: 'Key', sortable: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'scope', header: 'Scope', minWidth: 80 },
    { accessorKey: 'lastModified', header: 'Last modified', sortable: true, minWidth: 80 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const properties = computed(() => [
    { key: 'key', label: 'Key' },
    {
      key: 'lastEditor',
      label: 'Author',
      options: [...new Set(props.rows.map((variable) => variable.lastEditor))].map((value) => ({
        value
      }))
    },
    { key: 'type', label: 'Type', options: [{ value: 'Plain' }, { value: 'Secret' }] }
  ])

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
    items: () => props.rows,
    columns,
    filtering: { fields: ['key', 'id', 'lastEditor', 'type'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'variables-table',
      defaults: { columns: [{ id: 'id', visible: false }] }
    },
    url: true
  })

  const tableEl = ref<TableExposed<VariablesRow> | null>(null)
  const exportCsv = () => tableEl.value?.exportCsv({ filename: 'variables.csv' })

  const displayValue = (row: VariablesRow) => (row.secret ? SECRET_MASK : row.value)

  const onRowOpen = (event: MouseEvent | KeyboardEvent, row: VariablesRow) => {
    if (event instanceof KeyboardEvent) emit('row-action', event, 'edit', row)
  }
</script>

<template>
  <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
    <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
      <header class="flex items-start gap-(--layout-group-gap)">
        <div class="flex min-w-0 grow">
          <PropertyFilter
            v-bind="propertyFilterProps"
            placeholder="Filter variables"
            aria-label="Filter variables"
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
              @click="(event) => emit('refresh', event)"
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
          v-if="status === 'empty' && !loading"
          key="first-use"
          :padded="false"
        >
          <template #default>
            <EmptyState
              size="medium"
              icon="az az-key"
              title="No variables yet"
              description="Create a variable to store a value your services read at runtime."
            >
              <template #actions>
                <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                  <Button
                    label="Create Variable"
                    icon="az az-plus"
                    variant="secondary"
                    size="small"
                    @click="emit('create')"
                  />
                  <Button
                    label="Documentation"
                    aria-label="Documentation (opens in a new tab)"
                    icon="az az-book"
                    variant="outline"
                    size="small"
                    href="https://example.com/docs/variables"
                    target="_blank"
                  />
                </div>
              </template>
            </EmptyState>
          </template>
        </Card>
        <Card
          v-else
          key="table"
          :padded="false"
        >
          <template #default>
            <DataTable
              ref="tableEl"
              v-bind="tableProps"
              :loading="loading || fetching"
              sortable
              :bordered="false"
              @row-click="onRowOpen"
              @row-remove="(event, row) => emit('row-action', event, 'delete', row)"
            >
              <template #cell-key="{ value }">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    class="az az-key shrink-0 text-body-lg text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="min-w-0 truncate">{{ value }}</span>
                </div>
              </template>

              <template #cell-id="{ value }">
                <TableCellId
                  :value="value"
                  resource="variable"
                />
              </template>

              <template #cell-value="{ row }">
                <TableCellLink
                  :label="displayValue(row)"
                  :copyable="!row.secret"
                  :copy-value="row.value"
                />
              </template>

              <template #cell-lastModified="{ row, value }">
                <div
                  v-if="value"
                  class="flex min-w-0 items-center gap-(--spacing-xs)"
                >
                  <Tooltip
                    v-if="row.lastEditor"
                    :content="row.lastEditor"
                  >
                    <Avatar
                      :src="row.lastEditorAvatar || undefined"
                      :alt="row.lastEditor"
                      :label="row.lastEditor"
                      size="small"
                      variant="square"
                    />
                  </Tooltip>
                  <span class="truncate text-body-sm text-(--text-muted)">{{ value }}</span>
                </div>
              </template>

              <template #cell-scope="{ value }">
                <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                  <span
                    v-for="item in scopeSummary(value)"
                    :key="item.label"
                    class="truncate whitespace-nowrap"
                  >
                    {{ item.label }}
                    <span
                      v-if="item.detail"
                      class="text-(--text-muted)"
                      >{{ item.detail }}</span
                    >
                  </span>
                </div>
              </template>

              <template #cell-actions="{ row }">
                <TableCellActions
                  :name="row.key"
                  @select="(event, value) => emit('row-action', event, value, row)"
                >
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="edit"
                      label="Edit"
                    >
                      <template #leading>
                        <i
                          class="az az-pencil"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      value="duplicate"
                      label="Clone"
                    >
                      <template #leading>
                        <i
                          class="az az-copy"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>

                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="delete"
                      label="Delete"
                    >
                      <template #leading>
                        <i
                          class="az az-trash"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </TableCellActions>
              </template>

              <template #empty>
                <EmptyState
                  size="medium"
                  icon="az az-filter-off"
                  title="No matching variables"
                  description="No variable matches these filters."
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
</template>
