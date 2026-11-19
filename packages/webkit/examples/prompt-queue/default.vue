<script setup>
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import PromptQueue from '@aziontech/webkit/prompt-queue'
  import { ref } from 'vue'

  const prompt = ref('')
  const status = ref('streaming')
  const queue = ref([
    { id: 'q1', text: 'Also purge the cache for app.example.com' },
    { id: 'q2', text: 'Then show me the error rate for the last hour', attachmentCount: 1 }
  ])

  function cancelQueued(id) {
    queue.value = queue.value.filter((item) => item.id !== id)
  }

  function stop() {
    status.value = 'ready'
    queue.value = []
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--layout-group-gap)">
    <PromptQueue
      :items="queue"
      @remove="(event, item) => cancelQueued(item.id)"
    />
    <PromptInput
      v-model="prompt"
      :status="status"
      @stop="stop"
    />
  </div>
</template>
