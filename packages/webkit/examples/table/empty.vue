<script setup>
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const rows = []

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
  <TableRoot
    :data="rows"
    :columns="columns"
    row-key="id"
    enable-sorting
    bordered
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
            icon="pi pi-ellipsis-v"
            aria-label="Row actions"
            kind="transparent"
            size="small"
          />
        </DropdownMenuTrigger>
        <DropdownMenuGroup
          v-for="(group, gi) in rowActionGroups"
          :key="gi"
        >
          <DropdownMenuOption
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
          </DropdownMenuOption>
        </DropdownMenuGroup>
      </DropdownMenuRoot>
    </template>
  </TableRoot>
</template>
