<script setup lang="ts">
  import { useChat } from '@tanstack/ai-vue'
  import { computed } from 'vue'

  import AiChat, { type AiChatMessage } from '../blocks/ai-chat.vue'
  import { answerFor } from '../lib/assistant'
  import { assistantConnection, assistantTools, deployWorkload } from '../lib/assistant-model'

  const { messages, isLoading, error, interrupts, sendMessage, stop, reload, clear } = useChat({
    connection: assistantConnection,
    threadId: 'demo-assistant',
    tools: [deployWorkload]
  })

  const questionBefore = (index: number) => {
    const question = messages.value
      .slice(0, index)
      .reverse()
      .find((message) => message.role === 'user')
    return question?.parts.map((part) => (part.type === 'text' ? part.content : '')).join('') ?? ''
  }

  const withSources = computed<AiChatMessage[]>(() =>
    messages.value.map((message, index) =>
      message.role === 'assistant' && !message.parts.some((part) => part.type === 'tool-call')
        ? {
            ...message,
            metadata: { ...message.metadata, sources: answerFor(questionBefore(index)).sources }
          }
        : message
    )
  )

  const followUps = computed(() => {
    const last = withSources.value[withSources.value.length - 1]
    if (isLoading.value || last?.role !== 'assistant' || !last.metadata?.sources) return []
    return answerFor(questionBefore(withSources.value.length - 1)).followUps
  })
</script>

<template>
  <AiChat
    :messages="withSources"
    :follow-ups="followUps"
    :loading="isLoading"
    :error="error"
    :tools="assistantTools"
    :interrupts="interrupts"
    @send="(_event, text) => sendMessage(text)"
    @stop="stop()"
    @retry="reload()"
    @new-chat="clear()"
  />
</template>
