<script setup lang="ts">
  import type { AiChatMessage } from '@aziontech/webkit/utils/ai-chat'
  import { useChat } from '@tanstack/ai-vue'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { sampleLongThread } from '../blocks/ai-chat.sample'
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
    setMessages,
    clear,
    cancelQueued,
    loadOlderMessages
  } = useChat({
    connection: assistantConnection,
    threadId: 'demo-assistant',
    tools: [deployWorkload]
  })

  const loadingOlder = ref(false)

  type ChatMessages = Parameters<typeof setMessages>[0]

  function toChat(list: readonly AiChatMessage[]): ChatMessages {
    return list as unknown as ChatMessages
  }

  const route = useRoute()
  watch(
    () => route.params.chatId,
    (chatId) => setMessages(chatId ? toChat(sampleLongThread) : []),
    { immediate: true }
  )
  const modelKey = ref('auto')
  const toolKeys = ref<string[]>([])

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

  function edit(message: AiChatMessage, text: string) {
    const at = messages.value.findIndex((entry) => entry.id === message.id)
    setMessages(messages.value.slice(0, at))
    void sendMessage(text, { body: { model: modelKey.value, tools: toolKeys.value } })
  }

  const followUps = computed(() => {
    const last = withSources.value[withSources.value.length - 1]
    if (isLoading.value || last?.role !== 'assistant' || !last.metadata?.sources) return []
    return answerFor(questionBefore(withSources.value.length - 1)).followUps
  })
</script>

<template>
  <AiChat
    class="max-md:[&_span:has(>button[aria-label='Open_conversation_history'])]:hidden"
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
    :voice="false"
    v-model:model-key="modelKey"
    v-model:tool-keys="toolKeys"
    @send="
      (_event, content) => sendMessage(content, { body: { model: modelKey, tools: toolKeys } })
    "
    @answer-tool="(_event, answer) => addToolResult(answer)"
    @retry-interrupts="retryInterrupts()"
    @remove-queued="(_event, item) => cancelQueued(item.id)"
    @load-more="loadOlder()"
    @stop="stop()"
    @retry="reload()"
    @edit="(_event, message, text) => edit(message, text)"
    @version-change="(next) => setMessages(toChat(next))"
    @new-chat="clear()"
  />
</template>
