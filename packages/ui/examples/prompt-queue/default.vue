<script setup>
  import PromptInput from '@aziontech/ui/prompt-input-root'
  import PromptQueue from '@aziontech/ui/prompt-queue'
  import { ref } from 'vue'

  const prompt = ref('')
  const queue = ref([
    { id: 'q1', text: 'Also purge the cache for app.example.com' },
    { id: 'q2', text: 'Then show me the error rate for the last hour', attachmentCount: 1 }
  ])
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--layout-group-gap)">
    <PromptQueue
      :items="queue"
      @remove="(event, item) => (queue = queue.filter((entry) => entry.id !== item.id))"
    />
    <PromptInput
      v-model="prompt"
      status="streaming"
    />
  </div>
</template>
