<script setup lang="ts">
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { AiChatThread } from '../sample'

  const props = defineProps<{ thread: AiChatThread }>()

  const emit = defineEmits<{
    snooze: [event: MouseEvent | KeyboardEvent, id: string]
    settle: [event: MouseEvent | KeyboardEvent, id: string]
    discard: [event: MouseEvent | KeyboardEvent, id: string]
  }>()

  function onSelect(event: MouseEvent | KeyboardEvent, value: string | number) {
    if (value === 'snooze') emit('snooze', event, props.thread.id)
    else if (value === 'settle') emit('settle', event, props.thread.id)
    else if (value === 'discard') emit('discard', event, props.thread.id)
  }
</script>

<template>
  <span class="flex items-center gap-0.5 pointer-coarse:hidden">
    <Tooltip
      v-if="thread.draft"
      key="discard"
      content="Discard draft"
    >
      <IconButton
        icon="az az-x"
        aria-label="Discard draft"
        variant="ghost"
        size="small"
        @click="emit('discard', $event, thread.id)"
      />
    </Tooltip>
    <Tooltip
      key="snooze"
      :content="thread.snoozed ? 'Unsnooze' : 'Snooze'"
    >
      <IconButton
        icon="az az-clock"
        :aria-label="thread.snoozed ? 'Unsnooze thread' : 'Snooze thread'"
        variant="ghost"
        size="small"
        @click="emit('snooze', $event, thread.id)"
      />
    </Tooltip>
    <Tooltip
      key="settle"
      :content="thread.settled ? 'Reopen' : 'Settle'"
    >
      <IconButton
        icon="az az-check"
        :aria-label="thread.settled ? 'Reopen thread' : 'Settle thread'"
        variant="ghost"
        size="small"
        @click="emit('settle', $event, thread.id)"
      />
    </Tooltip>
  </span>
  <span class="hidden pointer-coarse:flex">
    <DropdownMenu
      side="bottom"
      align="end"
      data-testid="ai-chat-history-actions__menu"
      @select="onSelect"
    >
      <DropdownMenuTrigger>
        <IconButton
          icon="az az-ellipsis"
          aria-label="Thread actions"
          variant="ghost"
          size="small"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuItem
          value="snooze"
          :label="thread.snoozed ? 'Unsnooze' : 'Snooze'"
        />
        <DropdownMenuItem
          value="settle"
          :label="thread.settled ? 'Reopen' : 'Settle'"
        />
      </DropdownMenuGroup>
      <DropdownMenuGroup v-if="thread.draft">
        <DropdownMenuItem
          value="discard"
          severity="danger"
          label="Discard draft"
        />
      </DropdownMenuGroup>
    </DropdownMenu>
  </span>
</template>
