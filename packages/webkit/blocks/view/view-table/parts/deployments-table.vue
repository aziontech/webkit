<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DataTable, {
    type DropdownMenuItemValue,
    type TableColumn,
    type TableExposed
  } from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import EmptyState from '@aziontech/webkit/empty-state'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag from '@aziontech/webkit/tag'
  import type {
    CollectionPaginationProps,
    CollectionTableProps
  } from '@aziontech/webkit/use-collection'
  import { ref } from 'vue'

  import { type Deployment, DEPLOYMENT_STATUS, environmentSeverity } from '../lib/deployments'

  defineProps<{
    tableProps: CollectionTableProps<Deployment, TableColumn>
    paginationProps: CollectionPaginationProps
    loading: boolean
  }>()

  const emit = defineEmits<{
    open: [event: MouseEvent | KeyboardEvent, row: Deployment]
    action: [event: Event, payload: { value: DropdownMenuItemValue; row: Deployment }]
    'clear-filters': [event: MouseEvent]
  }>()

  const tableEl = ref<TableExposed<Deployment> | null>(null)

  defineExpose({
    exportCsv: (filename: string) => tableEl.value?.exportCsv({ filename })
  })
</script>

<template>
  <DataTable
    ref="tableEl"
    v-bind="tableProps"
    :loading="loading"
    sortable
    :bordered="false"
    @row-click="(event, row) => emit('open', event, row)"
  >
    <template #cell-version="{ row }">
      <span class="flex min-w-0 flex-wrap items-center gap-(--spacing-2xs)">
        <span
          data-testid="deployment-version"
          class="shrink-0 tabular-nums text-body-sm text-(--text-default)"
        >
          {{ row.version }}
        </span>
        <Tag
          v-if="row.current"
          label="Current"
          severity="info"
          size="small"
          icon="az az-circle-arrow-up"
          class="shrink-0"
        />
      </span>
    </template>
    <template #cell-id="{ value }">
      <TableCellId
        :value="value"
        resource="deployment"
      />
    </template>
    <template #cell-status="{ row }">
      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
        <StatusIndicator
          :severity="DEPLOYMENT_STATUS[row.status].severity"
          :loading="DEPLOYMENT_STATUS[row.status].loading"
          :label="row.status"
        />
        <span
          v-if="row.duration"
          class="shrink-0 tabular-nums text-body-xs text-(--text-muted)"
        >
          {{ row.duration }}
        </span>
      </span>
    </template>
    <template #cell-project="{ row }">
      <TableCellLink
        :label="row.project"
        :to="`/projects/${row.projectId}`"
        destination="Projects"
        icon="az az-box"
      />
    </template>
    <template #cell-environment="{ value }">
      <Tag
        :label="value"
        :severity="environmentSeverity(value)"
        size="medium"
        rounded
      />
    </template>
    <template #cell-deployedAt="{ row }">
      <TableCellTime
        :value="row.deployedAt"
        :author="row.author"
      />
    </template>
    <template #cell-actions="{ row }">
      <TableCellActions
        :name="row.version"
        @select="(event, value) => emit('action', event, { value, row })"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            value="view"
            label="View details"
          >
            <template #leading
              ><i
                class="az az-eye"
                aria-hidden="true"
            /></template>
          </DropdownMenuItem>
          <DropdownMenuItem
            value="redeploy"
            label="Redeploy"
          >
            <template #leading
              ><i
                class="az az-refresh"
                aria-hidden="true"
            /></template>
          </DropdownMenuItem>
          <DropdownMenuItem
            value="promote"
            label="Promote to production"
            :disabled="row.environment === 'Production' || row.status !== 'Ready'"
          >
            <template #leading
              ><i
                class="az az-circle-arrow-up"
                aria-hidden="true"
            /></template>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </TableCellActions>
    </template>
    <template #empty>
      <EmptyState
        size="medium"
        icon="az az-filter-off"
        title="No matching deployments"
        description="No deployment matches these filters."
      >
        <template #actions>
          <Button
            label="Clear filters"
            variant="outline"
            size="small"
            @click="(event: MouseEvent) => emit('clear-filters', event)"
          />
        </template>
      </EmptyState>
    </template>
    <template #footer>
      <DataTablePagination
        v-bind="paginationProps"
        manual
      />
    </template>
  </DataTable>
</template>
