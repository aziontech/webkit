<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Countdown from '@aziontech/webkit/countdown'
  import PriorityTag from '@aziontech/webkit/priority-tag'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'

  import { slaPaused, statusSeverity } from '../lib/ticket-fields'
  import type { TicketInboxTicket } from '../view-ticket-inbox.vue'

  export interface TicketSubjectCellProps {
    /** The ticket the row shows. */
    ticket: TicketInboxTicket
  }

  defineProps<TicketSubjectCellProps>()
</script>

<template>
  <div
    class="flex min-w-0 items-start gap-(--spacing-xs) max-sm:w-[60vw] sm:max-w-(--container-xs)"
  >
    <span
      class="mt-(--spacing-xs) size-2 shrink-0 rounded-full data-[unread]:bg-(--info-mark)"
      :data-unread="ticket.unread || null"
      aria-hidden="true"
    />
    <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
      <div class="flex min-w-0 items-center">
        <span
          v-if="ticket.unread"
          class="sr-only"
          >Unread:</span
        >
        <TableCellLink
          :label="ticket.subject"
          :to="`/tickets/${ticket.id}`"
          destination="Tickets"
        />
      </div>
      <div class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)">
        <Avatar
          :label="ticket.requester"
          size="small"
          aria-hidden="true"
        />
        <span
          class="truncate"
          dir="auto"
          >{{ ticket.requester }}</span
        >
        <span
          class="shrink-0 tabular-nums"
          dir="ltr"
          >#{{ ticket.id }}</span
        >
      </div>
      <div
        data-testid="ticket-triage"
        class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs) sm:hidden"
      >
        <TableCellStatus
          :label="ticket.status"
          :severity="statusSeverity[ticket.status]"
        />
        <PriorityTag
          v-if="ticket.priority !== 'none'"
          :priority="ticket.priority"
          size="small"
        />
        <Countdown
          v-if="ticket.slaDueAt && !slaPaused(ticket)"
          :deadline="ticket.slaDueAt"
          size="small"
        />
      </div>
    </div>
  </div>
</template>
