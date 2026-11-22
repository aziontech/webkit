<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import SeverityTag from '@aziontech/webkit/severity-tag'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'

  import type { ActorActivityRow, ActorOutcome } from '../sample'

  export interface ActorRequestsCardProps {
    /** The rows left by the filters. */
    rows: ActorActivityRow[]
    /** A filter or the destination search is set. */
    filtering: boolean
  }

  defineProps<ActorRequestsCardProps>()

  const emit = defineEmits<{ clear: [event: MouseEvent] }>()

  const column = (id: string, header: string, sortable: boolean): TableColumn => ({
    id,
    accessorKey: id,
    header,
    align: 'start',
    sortable,
    principal: id === 'time'
  })

  const columns: TableColumn[] = [
    column('time', 'Time', true),
    column('actor', 'Actor', true),
    column('outcome', 'Outcome', false),
    column('category', 'Category', false),
    column('severity', 'Severity', false),
    column('destination', 'Destination', true),
    column('method', 'Method', false),
    column('rule', 'Rule', false)
  ]

  const outcomeTags: Record<ActorOutcome, { label: string; severity: TagSeverity }> = {
    allowed: { label: 'Allowed', severity: 'success' },
    blocked: { label: 'Blocked', severity: 'danger' },
    held: { label: 'Held', severity: 'warning' },
    approved: { label: 'Approved', severity: 'neutral' },
    denied: { label: 'Denied', severity: 'neutral' }
  }

  const outcomeTag = (outcome: ActorOutcome) => outcomeTags[outcome]
</script>

<template>
  <ChartCard :span="12">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
        <ChartCard.Title>Requests</ChartCard.Title>
        <Hint content="The latest requests, newest first, with the rule that decided each one." />
      </span>
      <ChartCard.Action>
        <Tag
          v-if="rows.length"
          :label="rows.length + ' requests'"
          severity="neutral"
          size="small"
        />
      </ChartCard.Action>
    </ChartCard.Header>
    <ChartCard.Content>
      <DataTable
        v-if="rows.length"
        :data="rows"
        :columns="columns"
        row-key="id"
        sortable
        density="compact"
        bordered
      >
        <template #cell-outcome="{ row }">
          <TableCellStatus
            :label="outcomeTag(row.outcome).label"
            :severity="outcomeTag(row.outcome).severity"
          />
        </template>
        <template #cell-severity="{ row }">
          <SeverityTag
            :severity="row.severity"
            size="small"
          />
        </template>
        <template #cell-method="{ row }">
          <span class="font-mono text-body-sm">{{ row.method }}</span>
        </template>
        <template #footer>
          <DataTablePagination
            :page-size="10"
            :page-size-options="[10, 25, 50]"
          />
        </template>
      </DataTable>
      <EmptyState
        key="empty-state-1"
        v-else-if="filtering"
        size="small"
        icon="az az-filter-off"
        title="No requests match these filters"
        description="Clear the filters or pick other values."
      >
        <template #actions>
          <Button
            label="Clear filters"
            variant="outline"
            size="small"
            @click="(event: MouseEvent) => emit('clear', event)"
          />
        </template>
      </EmptyState>
      <EmptyState
        key="empty-state-2"
        v-else
        size="small"
        icon="az az-list"
        title="No requests in this time range"
        description="Requests the rules evaluate appear here. Widen the time range to see older ones."
      />
    </ChartCard.Content>
  </ChartCard>
</template>
