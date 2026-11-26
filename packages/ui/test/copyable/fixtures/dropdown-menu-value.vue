<script setup lang="ts">
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/ui/dropdown-menu'
  import { type DropdownMenuItemValue as TableActionValue } from '@aziontech/ui/table'
  import TableCellActions from '@aziontech/ui/table-cell-actions'
  import { ref } from 'vue'

  const chosen = ref<DropdownMenuItemValue>('')
  const lastAction = ref<TableActionValue>(0)
  const onSelect = (_event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue): void => {
    chosen.value = value
  }
  const onAction = (_event: MouseEvent | KeyboardEvent, value: TableActionValue): void => {
    lastAction.value = value
  }
</script>

<template>
  <DropdownMenu @select="onSelect">
    <DropdownMenu.Trigger><button type="button">Open</button></DropdownMenu.Trigger>
    <DropdownMenu.Group>
      <DropdownMenu.Item value="edit">Edit</DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu>
  <TableCellActions
    name="storefront"
    @select="onAction"
  >
    <DropdownMenu.Group>
      <DropdownMenu.Item :value="1">Delete</DropdownMenu.Item>
    </DropdownMenu.Group>
  </TableCellActions>
  <!-- @vue-expect-error the select payload is a string or a number, never a boolean -->
  <DropdownMenu @select="(_event, value: boolean) => value" />
</template>
