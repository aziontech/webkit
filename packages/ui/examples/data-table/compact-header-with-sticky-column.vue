<script setup>
  import DataTable from '@aziontech/ui/data-table'
  import DropdownMenuGroup from '@aziontech/ui/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/ui/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/ui/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/ui/dropdown-menu-trigger'
  import IconButton from '@aziontech/ui/icon-button'
  import TableCellLink from '@aziontech/ui/table-cell-link'
  import Tag from '@aziontech/ui/tag'
  import { ref } from 'vue'

  const rows = [
    {
      id: '1001',
      name: 'Workload Alpha',
      status: 'Active',
      editor: 'user1@example.com',
      modified: 'Jan 1, 2026, 09:00 AM',
      protocol: 'HTTP & HTTPS',
      domains: 2,
      origins: 1,
      created: 'Dec 1, 2025, 10:00 AM'
    },
    {
      id: '1002',
      name: 'Workload Bravo',
      status: 'Inactive',
      editor: 'user2@example.com',
      modified: 'Jan 2, 2026, 09:00 AM',
      protocol: 'HTTP',
      domains: 1,
      origins: 2,
      created: 'Dec 2, 2025, 10:00 AM'
    },
    {
      id: '1003',
      name: 'Workload Charlie',
      status: 'Degraded',
      editor: 'user3@example.com',
      modified: 'Jan 3, 2026, 09:00 AM',
      protocol: 'gRPC',
      domains: 3,
      origins: 1,
      created: 'Dec 3, 2025, 10:00 AM'
    }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name', frozen: 'start', width: 160 },
    { accessorKey: 'status', header: 'Status', width: 140 },
    { accessorKey: 'id', header: 'ID', sortable: false, width: 170 },
    { accessorKey: 'protocol', header: 'Protocol', sortable: false, width: 170 },
    { accessorKey: 'domains', header: 'Domains', align: 'end', width: 130 },
    { accessorKey: 'origins', header: 'Origins', align: 'end', width: 130 },
    { accessorKey: 'editor', header: 'Last Editor', sortable: false, width: 280 },
    { accessorKey: 'created', header: 'Created', width: 220 },
    { accessorKey: 'modified', header: 'Last Modified', width: 220 },
    { id: 'actions', header: '', type: 'action', frozen: 'end', sortable: false }
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
    density="compact"
    v-model:sorting="sorting"
    @row-click="onRowClick"
  >
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
