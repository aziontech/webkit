<script setup lang="ts">
  import DataTable, { type TableColumn } from '@aziontech/ui/data-table'
  import EmptyState from '@aziontech/ui/empty-state'
  import SeverityTag from '@aziontech/ui/severity-tag'
  import Tag from '@aziontech/ui/tag'
  import { computed } from 'vue'

  import type { AlertsDashboardEntity } from '../dashboard-alerts.vue'

  export interface EntityTableProps {
    /** The entities with the highest risk score; the first six show. */
    entities: AlertsDashboardEntity[]
    /** The period is loading. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<EntityTableProps>(), { loading: false })

  const TOP_ENTITIES = 6

  const rows = computed<AlertsDashboardEntity[]>(() =>
    props.loading && !props.entities.length
      ? Array.from({ length: TOP_ENTITIES }, (_, index) => ({
          id: `loading-${index}`,
          name: '',
          type: '',
          score: 0,
          level: 'info',
          alerts: 0
        }))
      : props.entities.slice(0, TOP_ENTITIES)
  )

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
    :data="rows"
    :columns="entityColumns"
    aria-label="Highest risk"
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
