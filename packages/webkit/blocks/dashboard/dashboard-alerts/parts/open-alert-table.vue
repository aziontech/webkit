<script setup lang="ts">
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import SeverityTag from '@aziontech/webkit/severity-tag'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import type { TagSeverity } from '@aziontech/webkit/tag'

  import type { AlertsDashboardAlert, AlertsDashboardAlertStatus } from '../dashboard-alerts.vue'

  export interface OpenAlertTableProps {
    /** Every open alert, most severe first. */
    alerts: AlertsDashboardAlert[]
    /** The period is loading. */
    loading?: boolean
  }

  withDefaults(defineProps<OpenAlertTableProps>(), { loading: false })

  const alertColumns: TableColumn[] = [
    {
      accessorKey: 'rank',
      id: 'severity',
      header: 'Severity',
      align: 'start',
      sortable: true,
      minWidth: 120
    },
    {
      accessorKey: 'title',
      header: 'Alert',
      align: 'start',
      principal: true,
      grow: 2
    },
    {
      accessorKey: 'entity',
      header: 'Entity',
      align: 'start',
      minWidth: 160
    },
    {
      accessorKey: 'opened',
      header: 'Opened',
      align: 'start',
      minWidth: 136
    },
    {
      accessorKey: 'status',
      header: 'Status',
      align: 'start',
      minWidth: 128
    }
  ]

  const statusSeverity: Record<AlertsDashboardAlertStatus, TagSeverity> = {
    Open: 'neutral',
    Investigating: 'info'
  }
</script>

<template>
  <DataTable
    v-if="loading || alerts.length"
    :data="alerts"
    :columns="alertColumns"
    row-key="id"
    sortable
    paginated
    :page-size="10"
    :page-size-options="[10, 25, 50]"
    density="compact"
    bordered
    :loading="loading"
  >
    <template #cell-severity="{ row }">
      <SeverityTag
        :severity="row.level"
        size="small"
      />
    </template>
    <template #cell-status="{ row }">
      <TableCellStatus
        :label="row.status"
        :severity="statusSeverity[row.status]"
      />
    </template>
  </DataTable>
  <EmptyState
    v-else
    size="small"
    icon="az az-bell"
    title="No open alerts"
    description="Alerts appear here when a detection rule matches. Select a longer period to see closed ones."
  />
</template>
