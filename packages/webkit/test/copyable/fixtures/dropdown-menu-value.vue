<script setup lang="ts">
  import DropdownMenu, { type DropdownMenuOptionValue } from '@aziontech/webkit/dropdown-menu'
  import Table, { type DropdownMenuOptionValue as TableActionValue } from '@aziontech/webkit/table'
  import { ref } from 'vue'

  const chosen = ref<DropdownMenuOptionValue>('')
  const lastAction = ref<TableActionValue>(0)
  const onSelect = (_event: MouseEvent | KeyboardEvent, value: DropdownMenuOptionValue): void => {
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
      <DropdownMenu.Option value="edit">Edit</DropdownMenu.Option>
    </DropdownMenu.Group>
  </DropdownMenu>
  <Table.CellActions
    name="storefront"
    @select="onAction"
  >
    <DropdownMenu.Group>
      <DropdownMenu.Option :value="1">Delete</DropdownMenu.Option>
    </DropdownMenu.Group>
  </Table.CellActions>
  <!-- @vue-expect-error the select payload is a string or a number, never a boolean -->
  <DropdownMenu @select="(_event, value: boolean) => value" />
</template>
