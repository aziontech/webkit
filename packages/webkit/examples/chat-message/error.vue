<script setup>
  import ChatMessage from '@aziontech/webkit/chat-message-root'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import { ref } from 'vue'

  const state = ref('error')
  const content = ref('Your workload storefront has two domains. The first one,')

  function retry() {
    state.value = 'pending'
    content.value = ''
    setTimeout(() => {
      content.value =
        'Your workload storefront has two domains: **www.example.com** and **shop.example.com**.'
      state.value = 'complete'
    }, 1200)
  }
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ChatMessage
      :state="state"
      error-message="The connection was interrupted before the response finished."
      @retry="retry"
    >
      <StreamingResponse :content="content" />
    </ChatMessage>
  </div>
</template>
