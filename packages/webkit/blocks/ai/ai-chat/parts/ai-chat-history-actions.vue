<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { AiChatThread } from '../sample'

  defineProps<{ thread: AiChatThread }>()

  const emit = defineEmits<{
    snooze: [event: MouseEvent, id: string]
    settle: [event: MouseEvent, id: string]
    discard: [event: MouseEvent, id: string]
  }>()
</script>

<template>
  <span class="flex items-center gap-0.5">
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
</template>
