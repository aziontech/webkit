<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import type { DropdownMenuItemValue } from '@aziontech/webkit/data-table'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'

  import type {
    TicketInboxAgent,
    TicketInboxBulkAction,
    TicketInboxStatus
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
  }

  defineProps<TicketBulkActionsProps>()

  const emit = defineEmits<{
    'select-all': [event: MouseEvent]
    clear: [event: MouseEvent]
    action: [event: Event, action: TicketInboxBulkAction, value: string]
  }>()

  const pick =
    (action: TicketInboxBulkAction) =>
    (event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) =>
      emit('action', event, action, String(value))
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
      <Button
        :label="`Merge (${selectedCount})`"
        icon="az az-git-merge"
        variant="outline"
        size="small"
        :disabled="selectedCount < 2"
        disabled-reason="Select two or more tickets to merge them."
        @click="(event: MouseEvent) => emit('action', event, 'merge', '')"
      />
      <Button
        :label="`Close (${selectedCount})`"
        icon="az az-circle-check"
        variant="outline"
        size="small"
        @click="(event: MouseEvent) => emit('action', event, 'close', '')"
      />
    </div>
  </div>
</template>
