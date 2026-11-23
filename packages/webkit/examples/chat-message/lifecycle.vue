<script setup>
  import Button from '@aziontech/webkit/button'
  import ChatMessage from '@aziontech/webkit/chat-message'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const full =
    'The 502 responses started at 14:05, when the **origin certificate** expired. Upload the renewed certificate and the errors stop.'
  const status = ref('pending')
  const content = ref('')
  let timer

  function play() {
    clearTimeout(timer)
    clearInterval(timer)
    status.value = 'pending'
    content.value = ''
    timer = setTimeout(() => {
      status.value = 'streaming'
      let index = 0
      timer = setInterval(() => {
        index = Math.min(full.length, index + 3)
        content.value = full.slice(0, index)
        if (index >= full.length) {
          clearInterval(timer)
          status.value = 'success'
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
    <ChatMessage :status="status">
      <StreamingResponse
        :content="content"
        :streaming="status === 'streaming'"
      />
      <template #actions>
        <ChatMessage.Actions
          copyable
          :copy-text="full"
        />
      </template>
    </ChatMessage>
    <Button
      label="Replay"
      variant="outline"
      size="small"
      icon="az az-refresh"
      :disabled="status !== 'success'"
      @click="play"
    />
  </div>
</template>
