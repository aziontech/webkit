<script setup>
  import PromptInput from '@aziontech/ui/prompt-input-root'
  import PromptQueue from '@aziontech/ui/prompt-queue'
  import { ref } from 'vue'

  const prompt = ref('Then list the five slowest paths')
  const queue = ref([{ id: 'q1', text: 'Also purge the cache for app.example.com' }])
  let next = 2

  function enqueue(_event, { value }) {
    queue.value = [...queue.value, { id: `q${next++}`, text: value }]
    prompt.value = ''
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--layout-group-gap)">
    <PromptQueue
      :items="queue"
      @remove="(_event, item) => (queue = queue.filter((entry) => entry.id !== item.id))"
    />
    <PromptInput
      v-model="prompt"
      status="streaming"
      queueable
      @submit="enqueue"
    >
      <template #hint>Messages you send now wait in the queue until the response ends.</template>
    </PromptInput>
  </div>
</template>
