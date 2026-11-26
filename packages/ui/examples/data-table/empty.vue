<script setup>
  import Button from '@aziontech/webkit/button'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const rows = []

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'id', header: 'ID', sortable: false },
    { accessorKey: 'editor', header: 'Last Editor', sortable: false, grow: 2 },
    { accessorKey: 'modified', header: 'Last Modified', grow: 2 },
    { id: 'actions', header: '', type: 'action', sortable: false }
  ]

  const sorting = ref([])

  const rowActionGroups = [
    [
      { value: 'view', label: 'View details', icon: 'az az-eye' },
      { value: 'edit', label: 'Edit', icon: 'az az-pencil' },
      { value: 'duplicate', label: 'Duplicate', icon: 'az az-copy' }
    ],
    [{ value: 'delete', label: 'Delete', icon: 'az az-trash', severity: 'danger' }]
  ]

  const statusSeverity = (status) =>
    status === 'Active' ? 'success' : status === 'Degraded' ? 'warning' : 'danger'

  const onRowClick = (_row) => {}
  const onRowAction = (_payload) => {}
</script>

<template>
  <DataTable
    :data="rows"
    :columns="columns"
    row-key="id"
    sortable
    bordered
    v-model:sorting="sorting"
    @row-click="onRowClick"
  >
    <template #empty>
      <EmptyState
        title="No workloads yet"
        description="Create a workload to serve your application from Azion."
        icon="az az-inbox"
        size="small"
      >
        <template #actions>
          <Button
            label="Create workload"
            icon="az az-plus"
          />
        </template>
      </EmptyState>
    </template>
    <template #cell-name="{ row, value }">
      <TableCellLink
        :label="value"
        :to="`/workloads/${row.id}`"
        destination="Workloads"
      />
    </template>
    <template #cell-status="{ value }">
      <Tag :severity="statusSeverity(value)">{{ value }}</Tag>
    </template>
    <template #header-actions>
      <span class="sr-only">Actions</span>
    </template>
    <template #cell-actions="{ row }">
      <DropdownMenuRoot @select="({ value }) => onRowAction({ id: row.id, action: { value } })">
        <DropdownMenuTrigger>
          <IconButton
            icon="az az-ellipsis-vertical"
            :aria-label="`Actions for ${row.name}`"
            variant="ghost"
            size="small"
          />
        </DropdownMenuTrigger>
        <DropdownMenuGroup
          v-for="(group, gi) in rowActionGroups"
          :key="gi"
        >
          <DropdownMenuItem
            v-for="option in group"
            :key="option.value"
            :value="option.value"
            :label="option.label"
            :severity="option.severity"
          >
            <template #leading
              ><i
                :class="option.icon"
                aria-hidden="true"
            /></template>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuRoot>
    </template>
  </DataTable>
</template>
