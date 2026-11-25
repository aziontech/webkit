<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import type { DropdownMenuItemValue } from '@aziontech/webkit/data-table'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { ref, watch } from 'vue'

  import type {
    TicketInboxAgent,
    TicketInboxBulkAction,
    TicketInboxStatus,
    TicketInboxTicket
  } from './view-ticket-inbox.vue'

  export interface TicketBulkActionsProps {
    /** How many tickets are selected. */
    selectedCount: number
    /** How many tickets match the filters. */
    totalCount: number
    /** The whole page is selected and more tickets match: offer Select all. */
    canSelectAll: boolean
    /** The agents Assign offers. */
    agents: TicketInboxAgent[]
    /** The statuses Change status offers. */
    statuses: TicketInboxStatus[]
    /** The selected tickets, which Merge lists to pick the one to keep. */
    tickets: TicketInboxTicket[]
  }

  const props = defineProps<TicketBulkActionsProps>()

  const emit = defineEmits<{
    'select-all': [event: MouseEvent]
    clear: [event: MouseEvent]
    action: [event: Event, action: TicketInboxBulkAction, value: string]
  }>()

  const pick =
    (action: TicketInboxBulkAction) =>
    (event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) =>
      emit('action', event, action, String(value))

  const mergeOpen = ref(false)
  const closeOpen = ref(false)
  const kept = ref('')

  watch(mergeOpen, (open) => {
    if (open) kept.value = props.tickets[0]?.id ?? ''
  })

  const confirmMerge = (event: MouseEvent) => {
    mergeOpen.value = false
    emit('action', event, 'merge', kept.value)
  }

  const confirmClose = (event: MouseEvent) => {
    closeOpen.value = false
    emit('action', event, 'close', '')
  }
</script>

<template>
  <div
    class="flex w-full flex-wrap items-center gap-(--spacing-xs) rounded-(--shape-control) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
    role="group"
    aria-label="Bulk actions"
  >
    <span
      class="text-label-sm text-(--text-default)"
      role="status"
      >{{ selectedCount }} selected</span
    >
    <Button
      v-if="canSelectAll"
      :label="`Select all ${totalCount} tickets`"
      variant="ghost"
      size="small"
      @click="(event: MouseEvent) => emit('select-all', event)"
    />
    <Button
      label="Clear selection"
      variant="ghost"
      size="small"
      @click="(event: MouseEvent) => emit('clear', event)"
    />
    <div class="ms-auto flex flex-wrap items-center gap-(--spacing-xs)">
      <DropdownMenuRoot
        side="bottom"
        align="end"
        @select="pick('assign')"
      >
        <DropdownMenuTrigger>
          <Button
            :label="`Assign (${selectedCount})`"
            icon="az az-chevron-down"
            icon-position="trailing"
            variant="outline"
            size="small"
          />
        </DropdownMenuTrigger>
        <DropdownMenuItem
          v-for="agent in agents"
          :key="agent.name"
          :value="agent.name"
          :label="agent.name"
        >
          <template #leading>
            <Avatar
              :label="agent.name"
              :alt="agent.name"
              :presence="agent.presence"
              size="small"
              aria-hidden="true"
            />
          </template>
        </DropdownMenuItem>
      </DropdownMenuRoot>
      <DropdownMenuRoot
        side="bottom"
        align="end"
        @select="pick('status')"
      >
        <DropdownMenuTrigger>
          <Button
            :label="`Change status (${selectedCount})`"
            icon="az az-chevron-down"
            icon-position="trailing"
            variant="outline"
            size="small"
          />
        </DropdownMenuTrigger>
        <DropdownMenuItem
          v-for="status in statuses"
          :key="status"
          :value="status"
          :label="status"
        />
      </DropdownMenuRoot>
      <ConfirmDialog
        v-model:open="mergeOpen"
        :title="`Merge ${selectedCount} tickets`"
        description="The other tickets close and their messages move into the ticket you keep."
        :confirm-label="`Merge ${selectedCount} tickets`"
        variant="primary"
        size="medium"
        :disabled="!kept"
        @confirm="confirmMerge"
      >
        <template #trigger>
          <Button
            :label="`Merge (${selectedCount})`"
            icon="az az-git-merge"
            variant="outline"
            size="small"
            :disabled="selectedCount < 2"
            disabled-reason="Select two or more tickets to merge them."
          />
        </template>
        <RadioGroup
          v-model="kept"
          name="ticket-to-keep"
          aria-label="Ticket to keep"
        >
          <RadioGroup.Item
            v-for="ticket in tickets"
            :key="ticket.id"
            :value="ticket.id"
          >
            <bdi dir="ltr">#{{ ticket.id }}</bdi> {{ ticket.subject }}
          </RadioGroup.Item>
        </RadioGroup>
      </ConfirmDialog>
      <ConfirmDialog
        v-model:open="closeOpen"
        :title="`Close ${selectedCount} tickets`"
        description="They leave the open views. A reply from the requester opens a ticket again."
        :confirm-label="`Close ${selectedCount} tickets`"
        variant="primary"
        size="small"
        @confirm="confirmClose"
      >
        <template #trigger>
          <Button
            :label="`Close (${selectedCount})`"
            icon="az az-circle-check"
            variant="outline"
            size="small"
          />
        </template>
      </ConfirmDialog>
    </div>
  </div>
</template>
