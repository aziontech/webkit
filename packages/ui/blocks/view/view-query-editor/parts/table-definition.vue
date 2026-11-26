<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import DataTable, { type TableColumn } from '@aziontech/ui/data-table'
  import Tag from '@aziontech/ui/tag'
  import { computed } from 'vue'

  import type { QueryEditorTable } from '../types'

  export interface TableDefinitionProps {
    /** The table whose columns the view lists. */
    table: QueryEditorTable
  }

  const props = defineProps<TableDefinitionProps>()

  const emit = defineEmits<{
    'add-column': [event: MouseEvent, table: QueryEditorTable]
  }>()

  const schemaColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Column', principal: true, hideable: false },
    { accessorKey: 'type', header: 'Type', minWidth: 104 },
    { accessorKey: 'constraints', header: 'Constraints', grow: 2 }
  ]
  const schemaRows = computed(() => {
    return props.table.columns.map((column) => ({
      name: column.name,
      id: column.id,
      type: column.type,
      constraints: [column.primaryKey ? 'PRIMARY KEY' : '', column.notNull ? 'NOT NULL' : '']
        .filter(Boolean)
        .join(', ')
    }))
  })
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-(--layout-group-gap) overflow-auto p-(--spacing-md)">
    <div class="flex items-center justify-between gap-(--spacing-sm)">
      <p class="text-heading-2xs text-(--text-default)">Columns</p>
      <Button
        label="Add column"
        variant="outline"
        size="medium"
        icon="az az-plus"
        @click="(event: MouseEvent) => emit('add-column', event, table)"
      />
    </div>
    <Card :padded="false">
      <template #default>
        <DataTable
          :data="schemaRows"
          :columns="schemaColumns"
          row-key="id"
          :bordered="false"
        >
          <template #cell-name="{ value }">
            <span class="min-w-0 truncate">{{ value }}</span>
          </template>
          <template #cell-type="{ value }">
            <Tag
              :label="value"
              severity="neutral"
              size="medium"
            />
          </template>
          <template #cell-constraints="{ value }">
            <span class="text-body-sm text-(--text-muted)">{{ value || '—' }}</span>
          </template>
        </DataTable>
      </template>
    </Card>
  </div>
</template>
