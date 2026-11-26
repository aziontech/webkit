<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import type { TableColumn } from '@aziontech/ui/data-table'
  import DataTable from '@aziontech/ui/data-table'
  import DataTablePagination from '@aziontech/ui/data-table-pagination'
  import EmptyState from '@aziontech/ui/empty-state'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/ui/status-indicator'
  import Subheader from '@aziontech/ui/subheader'
  import TableCellTime from '@aziontech/ui/table-cell-time'

  /** One deployment row of the Deployments tab. */
  export interface ApplicationDeploymentRow {
    /** The deployment id. */
    id: string
    /** The version it deployed. */
    version: string
    /** The environment it went to. */
    environment: string
    /** The status label, a key of the severity map. */
    status: string
    /** When it ran, as ISO 8601. */
    createdAt: string
  }

  export interface ApplicationDeploymentsTabProps {
    /** The deployments of the application. */
    deployments: ApplicationDeploymentRow[]
    /** The status color, by status label. */
    severity: Record<string, StatusIndicatorSeverity>
  }

  defineProps<ApplicationDeploymentsTabProps>()

  const deploymentColumns: TableColumn[] = [
    { accessorKey: 'id', header: 'Deployment', principal: true, hideable: false },
    { accessorKey: 'version', header: 'Version' },
    { accessorKey: 'environment', header: 'Environment' },
    { accessorKey: 'status', header: 'Status', minWidth: 104 },
    { accessorKey: 'createdAt', header: 'Created', minWidth: 96 }
  ]
</script>

<template>
  <section
    class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap) pb-(--layout-section-gap)"
  >
    <Subheader
      title="Deployments"
      size="small"
    />
    <Card :padded="false">
      <template #default>
        <DataTable
          :data="deployments"
          :columns="deploymentColumns"
          row-key="id"
          :bordered="false"
          aria-label="Deployments"
        >
          <template #cell-createdAt="{ value }">
            <TableCellTime :value="value" />
          </template>
          <template #cell-status="{ value }">
            <StatusIndicator
              :severity="severity[value]"
              :label="value"
            />
          </template>
          <template #empty>
            <EmptyState
              size="medium"
              icon="az az-cloud-upload"
              title="No deployments yet"
              description="Deploy this application and each run lands here."
            />
          </template>
          <template #footer>
            <DataTablePagination :page-size="10" />
          </template>
        </DataTable>
      </template>
    </Card>
  </section>
</template>
