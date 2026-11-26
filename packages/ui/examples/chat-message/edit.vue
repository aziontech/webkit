<script setup>
  import ChatMessage from '@aziontech/webkit/chat-message'
  import ResponseBranches from '@aziontech/webkit/response-branches'
  import { ref } from 'vue'

  const prompts = ref(['How do I purge the cache of one URL?'])
  const version = ref(0)

  function edit(event, text) {
    prompts.value = [...prompts.value, text]
    version.value = prompts.value.length - 1
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col">
    <ChatMessage
      from="user"
      timestamp="10:41"
      @edit="edit"
    >
      {{ prompts[version] }}
      <template #actions>
        <ChatMessage.Actions
          copyable
          editable
        >
          <template
            v-if="prompts.length > 1"
            #leading
          >
            <ResponseBranches
              v-model="version"
              :count="prompts.length"
              aria-label="Prompt versions"
            />
          </template>
        </ChatMessage.Actions>
      </template>
    </ChatMessage>
  </div>
</template>
