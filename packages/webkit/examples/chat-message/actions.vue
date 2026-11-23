<script setup>
  import ChatMessage from '@aziontech/webkit/chat-message'
  import ResponseBranches from '@aziontech/webkit/response-branches'
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
  const versions = ref(['first'])
  const version = ref(0)

  function retry() {
    versions.value = [...versions.value, 'next']
    version.value = versions.value.length - 1
  }
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ChatMessage timestamp="10:44">
      <StreamingResponse
        :content="answer"
        :sources="sources"
      />
      <template #actions>
        <ChatMessage.Actions
          v-model:feedback="feedback"
          copyable
          show-feedback
          show-read-aloud
          shareable
          retryable
          branchable
          @retry="retry"
        >
          <template
            v-if="versions.length > 1"
            #leading
          >
            <ResponseBranches
              v-model="version"
              :count="versions.length"
            />
          </template>
          <template #trailing>
            <Sources :items="sources" />
          </template>
        </ChatMessage.Actions>
      </template>
    </ChatMessage>
  </div>
</template>
