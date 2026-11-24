<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'

  import type { TicketInboxTicket } from '../view-ticket-inbox.vue'

  export interface TicketAssigneeCellProps {
    /** The ticket the row shows. */
    ticket: TicketInboxTicket
  }

  defineProps<TicketAssigneeCellProps>()
</script>

<template>
  <div
    v-if="ticket.assignee"
    class="flex min-w-0 items-center gap-(--spacing-xs)"
  >
    <Avatar
      :label="ticket.assignee"
      :alt="ticket.assignee"
      :presence="ticket.assigneePresence"
      size="small"
    />
    <span
      class="truncate"
      dir="auto"
      aria-hidden="true"
      >{{ ticket.assignee }}</span
    >
  </div>
  <span
    v-else
    class="text-(--text-muted)"
    >Unassigned</span
  >
</template>
