<script setup>
  import ChatMessage from '@aziontech/webkit/chat-message'
  import CopyButton from '@aziontech/webkit/copy-button'
  import IconButton from '@aziontech/webkit/icon-button'
  import ResponseBranches from '@aziontech/webkit/response-branches'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import { ref } from 'vue'

  const versions = ref([
    'Purge the cache from **Edge Cache › Purge**: choose *URL*, paste the paths and confirm.',
    'Use a **wildcard purge** (`/assets/*`) when many files changed at once; it clears every match in one request.',
    'If the files change on every deploy, add a **version to the file name** instead of purging: the new name is a new cache entry.'
  ])
  const active = ref(2)
  const regenerating = ref(false)

  const regenerate = () => {
    if (regenerating.value) return
    regenerating.value = true
    setTimeout(() => {
      versions.value = [
        ...versions.value,
        'Purge by **cache key** from the API (`POST /purge/cachekey`) to automate it in your pipeline.'
      ]
      active.value = versions.value.length - 1
      regenerating.value = false
    }, 800)
  }
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ChatMessage timestamp="10:44">
      <ResponseBranches
        v-model="active"
        :count="versions.length"
        :disabled="regenerating"
      >
        <template #default="{ index }">
          <StreamingResponse :content="versions[index]" />
        </template>
      </ResponseBranches>
      <template #actions>
        <ChatMessage.Actions>
          <CopyButton :value="versions[active]" />
          <IconButton
            icon="pi pi-refresh"
            aria-label="Regenerate response"
            kind="transparent"
            size="small"
            :loading="regenerating"
            @click="regenerate"
          />
        </ChatMessage.Actions>
      </template>
    </ChatMessage>
  </div>
</template>
