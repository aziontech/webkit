<script setup>
  import ChatMessage from '@aziontech/webkit/chat-message'
  import CopyButton from '@aziontech/webkit/copy-button'
  import IconButton from '@aziontech/webkit/icon-button'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import { ref } from 'vue'

  const answer =
    'Set **Cache by query string** to *Allowlist* and keep only `page` and `lang`. Campaign parameters such as `utm_source` stop creating new cache keys.'
  const feedback = ref(null)
  const sending = ref(false)

  function send(value) {
    feedback.value = value
    sending.value = true
    setTimeout(() => (sending.value = false), 800)
  }
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ChatMessage timestamp="10:44">
      <StreamingResponse :content="answer" />
      <template #actions>
        <ChatMessage.Actions>
          <CopyButton :value="answer" />
          <IconButton
            icon="pi pi-refresh"
            aria-label="Regenerate response"
            kind="transparent"
            size="small"
          />
          <ChatMessage.Feedback
            :model-value="feedback"
            :loading="sending"
            @update:model-value="send"
          />
        </ChatMessage.Actions>
      </template>
    </ChatMessage>
  </div>
</template>
