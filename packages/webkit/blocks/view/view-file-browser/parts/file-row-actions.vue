<script setup lang="ts">
  import type { DropdownMenuItemValue } from '@aziontech/webkit/data-table'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'

  import type { FileRow } from '../lib/file-rows'

  defineProps<{ item: FileRow; movable: boolean }>()

  const emit = defineEmits<{
    select: [event: Event, payload: { value: DropdownMenuItemValue; item: FileRow }]
  }>()
</script>

<template>
  <TableCellActions
    v-if="item.kind !== 'parent'"
    :name="item.name"
    @select="(event, value) => emit('select', event, { value, item })"
  >
    <DropdownMenuGroup>
      <DropdownMenuItem
        v-if="item.kind === 'folder'"
        key="open"
        value="open"
        label="Open"
      >
        <template #leading
          ><i
            class="az az-folder-open"
            aria-hidden="true"
        /></template>
      </DropdownMenuItem>
      <DropdownMenuItem
        v-else
        key="download"
        value="download"
        label="Download"
      >
        <template #leading
          ><i
            class="az az-download"
            aria-hidden="true"
        /></template>
      </DropdownMenuItem>
      <DropdownMenuItem
        v-if="movable && item.kind === 'file'"
        key="move"
        value="move"
        label="Move"
      >
        <template #leading
          ><i
            class="az az-arrow-right-left"
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
