<script setup>
  import ChatMessage from '@aziontech/webkit/chat-message'
  import CopyButton from '@aziontech/webkit/copy-button'
  import IconButton from '@aziontech/webkit/icon-button'
  import Sources from '@aziontech/webkit/sources'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import { ref } from 'vue'

  const sources = [
    { title: 'Cache settings', href: 'https://www.azion.com/en/documentation/' },
    { title: 'aziontech/azion', href: 'https://github.com/aziontech/azion', icon: 'az az-github' },
    { title: 'HTTP Caching', href: 'https://www.w3.org/Protocols/' }
  ]
  const answer =
    'Set **Cache by query string** to *Allowlist* and keep only `page` and `lang` [1]. Campaign parameters such as `utm_source` stop creating new cache keys [3].'
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
      <StreamingResponse
        :content="answer"
        :sources="sources"
        anchor="cache-answer"
      />
      <template #actions>
        <ChatMessage.Actions show-read-aloud>
          <CopyButton
            size="large"
            :value="answer"
          />
          <ChatMessage.Feedback
            :model-value="feedback"
            :loading="sending"
            @update:model-value="send"
          />
          <IconButton
            icon="az az-refresh"
            aria-label="Regenerate response"
            variant="ghost"
            size="large"
          />
          <template #trailing>
            <Sources
              :items="sources"
              anchor="cache-answer"
            />
          </template>
        </ChatMessage.Actions>
      </template>
    </ChatMessage>
  </div>
</template>
