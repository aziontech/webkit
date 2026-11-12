<script setup>
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import { ref } from 'vue'

  const now = '2026-11-11T15:00:00'
  const items = ref([
    { id: 'c1', title: 'Purge the cache after a deploy', updatedAt: '2026-11-11T14:20:00' },
    { id: 'c2', title: 'Why is my function returning 502?', updatedAt: '2026-11-11T09:05:00' },
    { id: 'c3', title: 'Set up a WAF rule for login attempts', updatedAt: '2026-11-10T18:40:00' },
    { id: 'c4', title: 'Image optimization query parameters', updatedAt: '2026-11-07T11:00:00' },
    {
      id: 'c5',
      title: 'Migrate DNS records from another provider',
      updatedAt: '2026-10-28T16:30:00'
    },
    { id: 'c6', title: 'Edge storage pricing', updatedAt: '2026-08-02T10:00:00' }
  ])
  const active = ref('c2')

  const remove = (id) => {
    items.value = items.value.filter((item) => item.id !== id)
    if (active.value === id) active.value = null
  }
</script>

<template>
  <div class="w-full max-w-(--container-3xs)">
    <ConversationHistory
      v-model="active"
      :items="items"
      :now="now"
      removable
      @remove="remove"
    />
  </div>
</template>
