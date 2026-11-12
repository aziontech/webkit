<script setup lang="ts">
  import Table from '@aziontech/webkit/table'
  import TableRoot, { type TableColumn } from '@aziontech/webkit/table-root'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { ref } from 'vue'

  interface Domain {
    id: string
    name: string
    hits: number
    tags: string[]
    kind: 'file' | 'folder'
  }

  const domains = ref<Domain[]>([
    { id: 'd1', name: 'storefront', hits: 3, tags: ['edge'], kind: 'file' }
  ])
  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'hits', header: 'Hits' },
    { accessorKey: 'tags', header: 'Tags' },
    { id: 'actions', kind: 'action' }
  ]
  const literalRows = [
    { id: 'r1', status: 'active', size: 12 },
    { id: 'r2', status: 'paused', size: 4 }
  ]
  const literalColumns = [{ accessorKey: 'status' }, { accessorKey: 'size' }]

  const collection = useCollection<Domain>({ items: domains.value })

  const opened = ref<string>('')
  const open = (id: string): void => {
    opened.value = id
  }
  const severityOf = (status: string): 'success' | 'warning' =>
    status === 'active' ? 'success' : 'warning'
</script>

<template>
  <Table
    :data="domains"
    :columns="columns"
    :row-selectable="(row) => row.kind === 'file'"
    @row-click="(_event, row) => open(row.id)"
    @update:data="(next) => (domains = next)"
  >
    <template #toolbar="{ selectedRows, selectedCount, clearSelection }">
      <button type="button" @click="clearSelection">
        {{ selectedCount }} {{ selectedRows.map((row) => row.name).join(', ') }}
      </button>
    </template>
    <template #header-name="{ column }">{{ column.id }}</template>
    <template #cell-name="{ row, value }">
      <span :title="row.name.toUpperCase()">{{ value.toUpperCase() }}</span>
      <span>
        <!-- @vue-expect-error a field the row does not have -->
        {{ row.missing }}
      </span>
    </template>
    <template #cell-hits="{ value }">{{ value.toFixed(0) }}</template>
    <template #cell-tags="{ value }">{{ value.slice(0, 2).join(', ') }}</template>
    <template #cell-actions="{ row, value }">
      <button type="button" @click="open(row.id)">Open</button>
      <span>
        <!-- @vue-expect-error a column that is not a row field has an unknown value -->
        {{ value.toUpperCase() }}
      </span>
    </template>
  </Table>

  <TableRoot :data="literalRows" :columns="literalColumns">
    <template #cell-status="{ row, value }">
      <span :data-severity="severityOf(value)">{{ row.size + 1 }}</span>
      <span>
        <!-- @vue-expect-error the value of status is a string -->
        {{ value.toFixed(0) }}
      </span>
    </template>
  </TableRoot>

  <Table v-bind="collection.tableProps.value">
    <template #cell-name="{ row }">{{ row.hits.toFixed(0) }}</template>
  </Table>
</template>
