<script setup>
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
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
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'id', header: 'ID', sortable: false },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'editor', header: 'Last Editor', sortable: false, grow: 2 },
    { accessorKey: 'modified', header: 'Last Modified', grow: 2 },
    { id: 'actions', header: '', type: 'action', sortable: false }
  ]

  const sorting = ref([])
  const selectedKeys = ref([])

  const rowActionGroups = [
    [
      { value: 'view', label: 'View details', icon: 'az az-eye' },
      { value: 'edit', label: 'Edit', icon: 'az az-pencil' },
      { value: 'duplicate', label: 'Duplicate', icon: 'az az-copy' }
    ],
    [{ value: 'delete', label: 'Delete', icon: 'az az-trash' }]
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
    selectable
    paginated
    :page-size="5"
    v-model:selected-keys="selectedKeys"
    v-model:sorting="sorting"
    @row-click="onRowClick"
  >
    <template #cell-name="{ row, value }">
      <a
        :href="'/workloads/' + row.id"
        class="cursor-pointer truncate text-(--text-default) no-underline hover:underline active:underline"
        >{{ value }}</a
      >
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
            aria-label="Row actions"
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
