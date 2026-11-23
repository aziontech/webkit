<script setup lang="ts">
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import SeverityTag from '@aziontech/webkit/severity-tag'
  import Tag from '@aziontech/webkit/tag'

  import type { AlertsDashboardEntity } from '../dashboard-alerts.vue'

  export interface EntityTableProps {
    /** The entities with the highest risk score. */
    entities: AlertsDashboardEntity[]
    /** The period is loading. */
    loading?: boolean
  }

  withDefaults(defineProps<EntityTableProps>(), { loading: false })

  const entityColumns: TableColumn[] = [
    {
      accessorKey: 'name',
      header: 'Entity',
      align: 'start',
      principal: true,
      grow: 2
    },
    {
      accessorKey: 'type',
      header: 'Type',
      align: 'start',
      minWidth: 136
    },
    {
      accessorKey: 'score',
      header: 'Risk score',
      align: 'start',
      sortable: true,
      minWidth: 160
    },
    {
      accessorKey: 'alerts',
      header: 'Open alerts',
      align: 'end',
      sortable: true,
      minWidth: 104
    }
  ]
</script>

<template>
  <DataTable
    v-if="loading || entities.length"
    :data="entities"
    :columns="entityColumns"
    row-key="id"
    sortable
    density="compact"
    stackable
    bordered
    :loading="loading"
  >
    <template #cell-type="{ row }">
      <Tag
        :label="row.type"
        severity="neutral"
        size="small"
      />
    </template>
    <template #cell-score="{ row }">
      <div class="flex min-w-0 items-center gap-(--spacing-sm)">
        <span class="w-8 shrink-0 text-end tabular-nums">{{ row.score }}</span>
        <SeverityTag
          :severity="row.level"
          size="small"
        />
      </div>
    </template>
    <template #cell-alerts="{ row }">
      <span class="tabular-nums">{{ row.alerts }}</span>
    </template>
  </DataTable>
  <EmptyState
    v-else
    size="small"
    icon="az az-users"
    title="No entities at risk yet"
    description="Entities appear here once an alert names them."
  />
</template>
