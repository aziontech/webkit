<script setup lang="ts">
  import DataTable, { type TableColumn } from '@aziontech/ui/data-table'
  import DataTablePagination from '@aziontech/ui/data-table-pagination'
  import EmptyState from '@aziontech/ui/empty-state'
  import SeverityTag from '@aziontech/ui/severity-tag'
  import TableCellStatus from '@aziontech/ui/table-cell-status'
  import type { TagSeverity } from '@aziontech/ui/tag'

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
    density="compact"
    stackable
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
    <template #footer>
      <DataTablePagination
        :page-size="10"
        :page-size-options="[10, 25, 50]"
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
