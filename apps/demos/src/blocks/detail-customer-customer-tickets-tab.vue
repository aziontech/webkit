<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Countdown from '@aziontech/ui/countdown'
  import DataTable, { type TableColumn } from '@aziontech/ui/data-table'
  import EmptyState from '@aziontech/ui/empty-state'
  import Link from '@aziontech/ui/link'
  import PriorityTag from '@aziontech/ui/priority-tag'
  import TableCellStatus from '@aziontech/ui/table-cell-status'
  import TableCellTime from '@aziontech/ui/table-cell-time'
  import type { TagSeverity } from '@aziontech/ui/tag'

  import type { DetailCustomerTicket, DetailCustomerTicketStatus } from './detail-customer.vue'

  export interface CustomerTicketsTabProps {
    /** The customer's tickets, open ones first. */
    tickets: DetailCustomerTicket[]
    /** The customer's name, for the caption and the empty state. */
    name?: string
    /** Skeleton rows stand in for the tickets. */
    loading?: boolean
  }

  withDefaults(defineProps<CustomerTicketsTabProps>(), { name: '', loading: false })

  const emit = defineEmits<{
    'open-ticket': [event: MouseEvent, ticket: DetailCustomerTicket]
    'new-ticket': [event: MouseEvent]
  }>()

  const columns: TableColumn[] = [
    { id: 'subject', accessorKey: 'subject', header: 'Subject', principal: true },
    { id: 'status', accessorKey: 'status', header: 'Status', minWidth: 96 },
    { id: 'priority', accessorKey: 'priority', header: 'Priority', minWidth: 120 },
    { id: 'sla', accessorKey: 'dueAt', header: 'Next reply', minWidth: 144 },
    { id: 'updated', accessorKey: 'updatedAt', header: 'Updated', minWidth: 120 }
  ]

  const statuses: Record<DetailCustomerTicketStatus, { label: string; severity: TagSeverity }> = {
    open: { label: 'Open', severity: 'info' },
    pending: { label: 'Pending', severity: 'warning' },
    solved: { label: 'Solved', severity: 'success' },
    closed: { label: 'Closed', severity: 'neutral' }
  }

  const running = (ticket: DetailCustomerTicket) =>
    ticket.dueAt !== '' && (ticket.status === 'open' || ticket.status === 'pending')
</script>

<template>
  <DataTable
    :data="tickets"
    :columns="columns"
    row-key="id"
    bordered
    stackable
    :loading="loading"
  >
    <template #caption>
      <span class="sr-only">{{ name ? `Tickets from ${name}` : 'Tickets' }}</span>
    </template>
    <template #cell-subject="{ row }">
      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
        <span class="shrink-0 text-body-sm text-(--text-muted)">#{{ row.id }}</span>
        <Link
          class="min-w-0"
          :label="row.subject"
          :href="`/tickets/${row.id}`"
          size="small"
          @click="(event: MouseEvent) => emit('open-ticket', event, row)"
        />
      </span>
    </template>
    <template #cell-status="{ row }">
      <TableCellStatus
        :label="statuses[row.status as DetailCustomerTicketStatus].label"
        :severity="statuses[row.status as DetailCustomerTicketStatus].severity"
      />
    </template>
    <template #cell-priority="{ row }">
      <PriorityTag
        :priority="row.priority"
        size="small"
      />
    </template>
    <template #cell-sla="{ row }">
      <Countdown
        v-if="running(row)"
        :deadline="row.dueAt"
        :paused="row.status === 'pending'"
        size="small"
      />
      <template v-else>
        <span
          class="text-(--text-muted)"
          aria-hidden="true"
          >—</span
        >
        <span class="sr-only">No SLA running</span>
      </template>
    </template>
    <template #cell-updated="{ row }">
      <TableCellTime :value="row.updatedAt" />
    </template>
    <template #empty>
      <EmptyState
        size="small"
        icon="az az-ticket"
        title="No tickets yet"
        :description="`${name || 'This customer'} has not contacted support yet.`"
      >
        <template #actions>
          <Button
            label="New ticket"
            icon="az az-plus"
            variant="secondary"
            size="small"
            @click="(event: MouseEvent) => emit('new-ticket', event)"
          />
        </template>
      </EmptyState>
    </template>
  </DataTable>
</template>
