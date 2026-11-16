<script setup lang="ts">
  import type { SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
  import { computed, onBeforeUnmount, ref } from 'vue'

  import AiChat, { type AiChatMessage } from '../blocks/ai-chat.vue'
  import { answerFor } from '../lib/assistant'

  const messages = ref<AiChatMessage[]>([])
  const followUps = ref<SuggestionGroupItem[]>([])
  const loading = ref(false)
  let nextId = 1
  let timer: ReturnType<typeof setTimeout> | undefined

  const clock = () =>
    new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date())

  const stopTimers = () => {
    clearTimeout(timer)
    clearInterval(timer)
  }

  const lastAssistant = computed(() => {
    const last = messages.value[messages.value.length - 1]
    return last?.from === 'assistant' ? last : undefined
  })

  const update = (patch: Partial<AiChatMessage>) => {
    const target = lastAssistant.value
    if (!target) return
    messages.value = messages.value.map((message) =>
      message.id === target.id ? { ...message, ...patch } : message
    )
  }

  const finish = () => {
    stopTimers()
    loading.value = false
  }

  const respond = (question: string) => {
    const answer = answerFor(question)
    followUps.value = []
    loading.value = true
    update({ content: '', stopped: false })
    timer = setTimeout(() => {
      update({ reasoning: answer.reasoning, reasoningSeconds: 1, sources: answer.sources })
      let index = 0
      timer = setInterval(() => {
        index = Math.min(answer.content.length, index + 6)
        update({ content: answer.content.slice(0, index) })
        if (index < answer.content.length) return
        followUps.value = answer.followUps
        finish()
      }, 30)
    }, 1400)
  }

  const questionBefore = (message: AiChatMessage) => {
    const index = messages.value.findIndex((item) => item.id === message.id)
    return messages.value
      .slice(0, index)
      .reverse()
      .find((item) => item.from === 'user')?.content
  }

  const onSend = (_event: Event, text: string) => {
    const time = clock()
    messages.value = [
      ...messages.value,
      { id: String(nextId++), from: 'user', content: text, time },
      { id: String(nextId++), from: 'assistant', content: '', time }
    ]
    respond(text)
  }

  const onStop = () => {
    finish()
    update({ stopped: true })
  }

  const onRetry = (_event: Event, message: AiChatMessage) => {
    respond(questionBefore(message) ?? '')
  }

  const onNewChat = () => {
    finish()
    messages.value = []
    followUps.value = []
  }

  onBeforeUnmount(stopTimers)
</script>

<template>
  <AiChat
    :messages="messages"
    :follow-ups="followUps"
    :loading="loading"
    @send="onSend"
    @stop="onStop"
    @retry="onRetry"
    @new-chat="onNewChat"
  />
</template>
