<script setup>
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import IconButton from '@aziontech/webkit/icon-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
  import DropdownGroup from '@aziontech/webkit/dropdown-group'
  import DropdownOption from '@aziontech/webkit/dropdown-option'
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
    { accessorKey: 'id', header: 'ID', enableSorting: false },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'editor', header: 'Last Editor', enableSorting: false, grow: 2 },
    { accessorKey: 'modified', header: 'Last Modified', grow: 2 },
    { id: 'actions', header: '', kind: 'action', enableSorting: false }
  ]

  const sorting = ref([])

  const rowActionGroups = [
    [
      { value: 'view', label: 'View details', icon: 'pi pi-eye' },
      { value: 'edit', label: 'Edit', icon: 'pi pi-pencil' },
      { value: 'duplicate', label: 'Duplicate', icon: 'pi pi-copy' }
    ],
    [{ value: 'delete', label: 'Delete', icon: 'pi pi-trash' }]
  ]

  const statusSeverity = (status) =>
    status === 'Active' ? 'success' : status === 'Degraded' ? 'warning' : 'danger'

  const onRowClick = (row) => {}
  const onRowAction = ({ action }) => {}
</script>

<template>
  <Table
    :data="rows"
    :columns="columns"
    row-key="id"
    enable-sorting
    header-kind="compact"
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
      <Dropdown @select="({ value }) => onRowAction({ id: row.id, action: { value } })">
        <DropdownTrigger>
          <IconButton
            icon="pi pi-ellipsis-v"
            aria-label="Row actions"
            kind="transparent"
            size="small"
          />
        </DropdownTrigger>
        <DropdownGroup
          v-for="(group, gi) in rowActionGroups"
          :key="gi"
        >
          <DropdownOption
            v-for="option in group"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          >
            <template #left
              ><i
                :class="option.icon"
                aria-hidden="true"
            /></template>
          </DropdownOption>
        </DropdownGroup>
      </Dropdown>
    </template>
  </Table>
</template>
