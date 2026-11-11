<script setup>
  import Button from '@aziontech/webkit/button'
  import ChatMessage from '@aziontech/webkit/chat-message'
  import CopyButton from '@aziontech/webkit/copy-button'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const full =
    'The 502 responses started at 14:05, when the **origin certificate** expired. Upload the renewed certificate and the errors stop.'
  const state = ref('pending')
  const content = ref('')
  let timer

  function play() {
    clearTimeout(timer)
    clearInterval(timer)
    state.value = 'pending'
    content.value = ''
    timer = setTimeout(() => {
      state.value = 'streaming'
      let index = 0
      timer = setInterval(() => {
        index = Math.min(full.length, index + 3)
        content.value = full.slice(0, index)
        if (index >= full.length) {
          clearInterval(timer)
          state.value = 'complete'
        }
      }, 40)
    }, 1500)
  }

  onMounted(play)
  onBeforeUnmount(() => {
    clearTimeout(timer)
    clearInterval(timer)
  })
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col items-start gap-(--spacing-md)">
    <ChatMessage :state="state">
      <StreamingResponse
        :content="content"
        :streaming="state === 'streaming'"
      />
      <template #actions>
        <ChatMessage.Actions>
          <CopyButton :value="full" />
        </ChatMessage.Actions>
      </template>
    </ChatMessage>
    <Button
      label="Replay"
      kind="outlined"
      size="small"
      icon="pi pi-refresh"
      :disabled="state !== 'complete'"
      @click="play"
    />
  </div>
</template>
