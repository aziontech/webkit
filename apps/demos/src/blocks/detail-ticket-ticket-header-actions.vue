<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'
  import Button from '@aziontech/ui/button'
  import type { DropdownMenuItemValue } from '@aziontech/ui/dropdown-menu'
  import DropdownMenuGroup from '@aziontech/ui/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/ui/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/ui/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/ui/dropdown-menu-trigger'
  import IconButton from '@aziontech/ui/icon-button'
  import { computed } from 'vue'

  import type { DetailTicketAction, DetailTicketAgent } from './detail-ticket.vue'

  export interface TicketHeaderActionsProps {
    /** Other agents who have the ticket open now. */
    viewers: DetailTicketAgent[]
  }

  const props = defineProps<TicketHeaderActionsProps>()

  const emit = defineEmits<{
    merge: [event: MouseEvent]
    action: [event: MouseEvent | KeyboardEvent, action: DetailTicketAction]
  }>()

  const shown = computed(() => props.viewers.slice(0, 3))

  const viewing = computed(() => {
    const [first, ...rest] = props.viewers
    if (!first) return ''
    if (!rest.length) return `${first.name} is viewing`
    return `${first.name} and ${rest.length} ${rest.length === 1 ? 'other' : 'others'} are viewing`
  })

  const onSelect = (event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) =>
    emit('action', event, String(value) as DetailTicketAction)
</script>

<template>
  <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)">
    <div
      v-if="viewers.length"
      class="flex min-w-0 items-center gap-(--spacing-xs)"
    >
      <div
        class="flex shrink-0 items-center gap-(--spacing-2xs)"
        aria-hidden="true"
      >
        <Avatar
          v-for="viewer in shown"
          :key="viewer.email"
          :label="viewer.name"
          :alt="viewer.name"
          :presence="viewer.presence"
          size="small"
        />
      </div>
      <span
        class="truncate text-body-sm text-(--text-muted) max-sm:sr-only"
        role="status"
        >{{ viewing }}</span
      >
    </div>
    <Button
      label="Merge"
      icon="az az-git-merge"
      variant="outline"
      size="medium"
      @click="(event: MouseEvent) => emit('merge', event)"
    />
    <DropdownMenuRoot
      side="bottom"
      align="end"
      @select="onSelect"
    >
      <DropdownMenuTrigger>
        <IconButton
          icon="az az-ellipsis"
          variant="outline"
          size="medium"
          aria-label="More ticket actions"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuItem
          value="copy-link"
          label="Copy link"
        >
          <template #leading
            ><i
              class="az az-link"
              aria-hidden="true"
          /></template>
        </DropdownMenuItem>
        <DropdownMenuItem
          value="print"
          label="Print"
        >
          <template #leading
            ><i
              class="az az-print"
              aria-hidden="true"
          /></template>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuGroup>
        <DropdownMenuItem
          value="spam"
          label="Mark as spam"
        >
          <template #leading
            ><i
              class="az az-ban"
              aria-hidden="true"
          /></template>
        </DropdownMenuItem>
        <DropdownMenuItem
          value="delete"
          label="Delete ticket"
          severity="danger"
        >
          <template #leading
            ><i
              class="az az-trash text-(--danger-mark)"
              aria-hidden="true"
          /></template>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuRoot>
  </div>
</template>
