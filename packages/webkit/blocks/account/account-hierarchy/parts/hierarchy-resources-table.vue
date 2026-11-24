<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Card from '@aziontech/webkit/card'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import Hint from '@aziontech/webkit/hint'
  import { type TableColumn } from '@aziontech/webkit/table'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTags from '@aziontech/webkit/table-cell-tags'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import type { AccountHierarchyResource } from '../account-hierarchy.vue'
  import { initials, type ResourceNode, statusSeverity, types } from '../hierarchy-model'

  export interface HierarchyResourcesTableProps {
    /** The tree the table shows, pruned by the search. */
    visibleTree: ResourceNode[]
    /** The id of the workspace the person is in. */
    currentId: string
    /** A request is in flight. */
    loading: boolean
    /** The id of the heading that names the table. */
    labelledby: string
  }

  defineProps<HierarchyResourcesTableProps>()

  const tableExpanded = defineModel<string[]>('openKeys', { required: true })
  const selectedKeys = defineModel<string[]>('selectedKeys', { required: true })

  const emit = defineEmits<{
    'row-action': [value: DropdownMenuItemValue, row: AccountHierarchyResource]
  }>()

  const onRowAction = (value: DropdownMenuItemValue, row: AccountHierarchyResource) =>
    emit('row-action', value, row)

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', principal: true, grow: 3 },
    { accessorKey: 'id', header: 'ID', minWidth: 128 },
    { accessorKey: 'type', header: 'Type', minWidth: 136 },
    { accessorKey: 'lastAccessed', header: 'Last accessed', minWidth: 120 },
    { accessorKey: 'status', header: 'Status', minWidth: 112 },
    { accessorKey: 'charges', header: 'Charges', align: 'end', minWidth: 112 },
    { accessorKey: 'labels', header: 'Labels', minWidth: 120 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const { formatNumber } = useLocale()

  const money = (value: number) => formatNumber(value, { style: 'currency', currency: 'USD' })
</script>

<template>
  <Card :padded="false">
    <template #default>
      <DataTable
        v-model:open-keys="tableExpanded"
        v-model:selected-keys="selectedKeys"
        :data="visibleTree"
        :columns="columns"
        :get-sub-rows="(row) => row.children"
        :loading="loading"
        row-key="id"
        selectable
        :bordered="false"
        :aria-labelledby="labelledby"
        @row-remove="(_event, row) => onRowAction('delete', row)"
      >
        <template #cell-name="{ row }">
          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
            <Avatar
              v-if="row.type !== 'workspace'"
              :label="initials(row.name)"
              size="small"
              variant="square"
            />
            <i
              v-else
              :class="types[row.type].icon"
              class="shrink-0 text-body-sm text-(--text-muted)"
              aria-hidden="true"
            />
            <span class="truncate text-label-sm text-(--text-default)">{{ row.name }}</span>
            <Tooltip
              v-if="row.id === currentId"
              content="Current workspace"
            >
              <i
                class="az az-check shrink-0 text-body-xs text-(--text-muted)"
                aria-label="Current workspace"
                role="img"
              />
            </Tooltip>
          </span>
        </template>
        <template #cell-id="{ row, value }">
          <TableCellId
            v-if="row.type === 'workspace'"
            :value="value"
            resource="workspace"
          />
          <span
            v-else
            class="text-body-sm text-(--text-muted)"
            >{{ value }}</span
          >
        </template>
        <template #cell-type="{ value }">
          <Tag
            :label="types[value].label"
            :icon="types[value].icon"
            :variant="types[value].variant"
            :severity="types[value].severity"
            size="small"
          />
        </template>
        <template #cell-lastAccessed="{ value }">
          <TableCellTime :value="value" />
        </template>
        <template #cell-status="{ value }">
          <TableCellStatus
            :label="value"
            :severity="statusSeverity(value)"
          />
        </template>
        <template #cell-charges="{ value }">
          <span
            class="tabular-nums text-(--text-default) data-[empty]:text-(--text-muted)"
            :data-empty="!value || null"
            >{{ value ? money(value) : '—' }}</span
          >
        </template>
        <template #header-charges>
          <span class="inline-flex items-center gap-(--spacing-2xs)">
            Charges
            <Hint
              content="Estimated month-to-date charges."
              aria-label="About charges"
            />
          </span>
        </template>
        <template #cell-labels="{ value }">
          <TableCellTags
            :items="value ?? []"
            icon="az az-tag"
            :noun="{ one: 'label', other: 'labels' }"
          />
        </template>
        <template #header-actions>
          <span class="sr-only">Actions</span>
        </template>
        <template #cell-actions="{ row }">
          <TableCellActions
            :name="row.name"
            @select="(_event, value) => onRowAction(value, row)"
          >
            <DropdownMenu.Group>
              <DropdownMenu.Item
                value="details"
                label="View details"
              />
              <DropdownMenu.Item
                value="move"
                label="Move"
              />
              <DropdownMenu.Item
                value="labels"
                label="Edit labels"
              />
            </DropdownMenu.Group>
            <DropdownMenu.Group>
              <DropdownMenu.Item
                value="delete"
                label="Delete"
              />
            </DropdownMenu.Group>
          </TableCellActions>
        </template>
        <template #footer>
          <DataTablePagination :page-size="25" />
        </template>
      </DataTable>
    </template>
  </Card>
</template>
