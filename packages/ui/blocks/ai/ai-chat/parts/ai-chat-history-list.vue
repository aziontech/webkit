<script setup lang="ts">
  import ConversationHistory, {
    type ConversationHistoryItem
  } from '@aziontech/ui/conversation-history'

  import { type AiChatProject, type AiChatThread, sampleHistoryNow } from '../sample'
  import AiChatHistoryActions from './ai-chat-history-actions.vue'
  import AiChatHistoryRow from './ai-chat-history-row.vue'

  defineProps<{
    items: ConversationHistoryItem[]
    threadMap: Map<string, AiChatThread>
    projectMap: Map<string, AiChatProject>
    viewMode: 'detailed' | 'compact'
  }>()

  const emit = defineEmits<{
    snooze: [event: MouseEvent | KeyboardEvent, id: string]
    settle: [event: MouseEvent | KeyboardEvent, id: string]
    discard: [event: MouseEvent | KeyboardEvent, id: string]
  }>()

  const active = defineModel<string | null>({ required: true })
</script>

<template>
  <ConversationHistory
    v-model="active"
    :items="items"
    :now="sampleHistoryNow"
  >
    <template #item="{ item }">
      <AiChatHistoryRow
        v-if="threadMap.get(item.id)"
        :thread="threadMap.get(item.id)!"
        :project="projectMap.get(threadMap.get(item.id)!.projectId)"
        :view-mode="viewMode"
      />
    </template>
    <template #item-actions="{ item }">
      <AiChatHistoryActions
        v-if="threadMap.get(item.id)"
        :thread="threadMap.get(item.id)!"
        @snooze="(event, id) => emit('snooze', event, id)"
        @settle="(event, id) => emit('settle', event, id)"
        @discard="(event, id) => emit('discard', event, id)"
      />
    </template>
  </ConversationHistory>
</template>
