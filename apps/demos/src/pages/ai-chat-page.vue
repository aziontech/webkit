<script setup lang="ts">
  import type { AiChatMessage } from '@aziontech/webkit/utils/ai-chat'
  import { useChat } from '@tanstack/ai-vue'
  import { computed, ref } from 'vue'

  import AiChat from '../blocks/ai-chat.vue'
  import { answerFor } from '../lib/assistant'
  import { assistantConnection, assistantTools, deployWorkload } from '../lib/assistant-model'

  const {
    messages,
    isLoading,
    error,
    interrupts,
    interruptErrors,
    queue,
    hasOlderMessages,
    connectionStatus,
    resuming,
    isHydrating,
    sessionGenerating,
    sendMessage,
    addToolResult,
    retryInterrupts,
    stop,
    reload,
    clear,
    cancelQueued,
    loadOlderMessages
  } = useChat({
    connection: assistantConnection,
    threadId: 'demo-assistant',
    tools: [deployWorkload]
  })

  const loadingOlder = ref(false)

  async function loadOlder() {
    if (loadingOlder.value) return
    loadingOlder.value = true
    try {
      await loadOlderMessages()
    } finally {
      loadingOlder.value = false
    }
  }

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
    :queue="queue"
    :more-messages="hasOlderMessages"
    :loading-more="loadingOlder"
    :connection="connectionStatus"
    :resuming="resuming"
    :interrupt-errors="interruptErrors"
    :hydrating="isHydrating"
    :session-generating="sessionGenerating"
    attachable
    @send="(_event, content) => sendMessage(content)"
    @answer-tool="(_event, answer) => addToolResult(answer)"
    @retry-interrupts="retryInterrupts()"
    @remove-queued="(_event, item) => cancelQueued(item.id)"
    @load-more="loadOlder()"
    @stop="stop()"
    @retry="reload()"
    @new-chat="clear()"
  />
</template>
