<script setup>
  import PromptQueue from '@aziontech/ui/prompt-queue'
  import { ref } from 'vue'

  const queue = ref([
    {
      id: 'q1',
      text:
        'After this finishes, compare the cache hit ratio of the production and staging applications over the last ' +
        'seven days, list the five paths with the most misses in each, and suggest a TTL for every one of them'
    },
    {
      id: 'q2',
      text: 'Check https://app.example.com/assets/images/products/acme-store/summer-collection/hero-banner-large-retina.webp'
    },
    { id: 'q3', text: 'Thanks' }
  ])
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <PromptQueue
      :items="queue"
      @remove="(event, item) => (queue = queue.filter((entry) => entry.id !== item.id))"
    />
  </div>
</template>
