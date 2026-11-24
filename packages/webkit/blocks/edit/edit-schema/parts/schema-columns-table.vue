<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import type { SchemaEditorTable } from '../edit-schema.vue'

  const props = defineProps<{ table: SchemaEditorTable | undefined }>()

  const emit = defineEmits<{
    'add-column': []
    'insert-row': []
    'table-action': [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
    'column-action': [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue, name: string]
  }>()

  const definitionColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Column', principal: true, hideable: false },
    { accessorKey: 'type', header: 'Type', minWidth: 120 },
    { accessorKey: 'constraints', header: 'Constraints', grow: 2 },
    { id: 'actions', type: 'action', hideable: false }
  ]
  const definitionRows = computed(() =>
    (props.table?.columns ?? []).map((column) => ({
      name: column.name,
      id: column.name,
      type: column.type,
      constraints: [
        column.primaryKey ? 'PRIMARY KEY' : '',
        column.notNull ? 'NOT NULL' : '',
        column.defaultValue ? `DEFAULT ${column.defaultValue}` : ''
      ]
        .filter(Boolean)
        .join(', ')
    }))
  )
</script>

<template>
  <Card :padded="false">
    <template #default>
      <DataTable
        :data="definitionRows"
        :columns="definitionColumns"
        row-key="id"
        :bordered="false"
        :aria-label="`Columns of ${table?.name ?? ''}`"
      >
        <template #toolbar>
          <div class="flex w-full flex-wrap items-center gap-(--spacing-xs)">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <i
                class="az az-table shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="truncate text-heading-2xs text-(--text-default)">{{ table?.name }}</span>
              <Tag
                :label="`${table?.rowCount ?? 0} ${table?.rowCount === 1 ? 'row' : 'rows'}`"
                severity="neutral"
                size="small"
              />
            </div>
            <div class="ms-auto flex flex-wrap items-center gap-(--spacing-xs)">
              <Button
                label="Add column"
                variant="outline"
                size="medium"
                icon="az az-plus"
                @click="emit('add-column')"
              />
              <Button
                label="Insert row"
                variant="primary"
                size="medium"
                icon="az az-plus"
                @click="emit('insert-row')"
              />
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(event, value) => emit('table-action', event, value)"
              >
                <DropdownMenu.Trigger>
                  <Tooltip content="Table actions">
                    <IconButton
                      icon="az az-ellipsis"
                      variant="outline"
                      size="medium"
                      aria-label="Table actions"
                    />
                  </Tooltip>
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="create"
                    label="Create table"
                  >
                    <template #leading
                      ><i
                        class="az az-plus"
                        aria-hidden="true"
                    /></template>
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="truncate"
                    label="Truncate table"
                  >
                    <template #leading
                      ><i
                        class="az az-eraser"
                        aria-hidden="true"
                    /></template>
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
              </DropdownMenu>
            </div>
          </div>
        </template>
        <template #cell-name="{ value }">
          <span class="min-w-0 truncate font-code text-label-code-sm">{{ value }}</span>
        </template>
        <template #cell-type="{ value }">
          <Tag
            :label="value"
            severity="neutral"
            size="medium"
          />
        </template>
        <template #cell-constraints="{ value }">
          <span class="text-body-sm text-(--text-muted)">{{ value || 'None' }}</span>
        </template>
        <template #cell-actions="{ row }">
          <TableCellActions
            :name="row.name"
            @select="(event, value) => emit('column-action', event, value, row.name)"
          >
            <DropdownMenu.Group>
              <DropdownMenu.Item
                value="alter"
                label="Change type"
              >
                <template #leading
                  ><i
                    class="az az-pencil"
                    aria-hidden="true"
                /></template>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </TableCellActions>
        </template>
      </DataTable>
    </template>
  </Card>
</template>
