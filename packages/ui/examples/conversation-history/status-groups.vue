<script setup>
  import ConversationHistory from '@aziontech/ui/conversation-history'
  import { ref } from 'vue'

  const now = '2026-11-11T15:00:00Z'
  const items = [
    {
      id: 't1',
      title: 'Migrate acme-store to the new runtime',
      updatedAt: '2026-11-11T14:50:00Z',
      status: 'running',
      description: 'feat/runtime-upgrade'
    },
    {
      id: 't2',
      title: 'Write the cache tests',
      updatedAt: '2026-11-11T14:35:00Z',
      status: 'running',
      description: 'test/cache'
    },
    {
      id: 't3',
      title: 'Fix the login redirect',
      updatedAt: '2026-11-11T11:00:00Z',
      status: 'success',
      description: 'fix/login-redirect'
    },
    {
      id: 't4',
      title: 'Bump the image optimizer',
      updatedAt: '2026-11-10T18:20:00Z',
      status: 'error',
      description: 'chore/image-optimizer'
    },
    {
      id: 't5',
      title: 'Draft the docs-site navigation',
      updatedAt: '2026-11-04T09:30:00Z',
      archived: true
    }
  ]
  const active = ref('t1')
  const openSections = ref(['working'])
</script>

<template>
  <aside
    class="flex h-96 w-full max-w-(--container-3xs) flex-col overflow-y-auto rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-xs)"
  >
    <ConversationHistory
      v-model="active"
      v-model:open-section-keys="openSections"
      :items="items"
      :now="now"
      group-by="status"
      show-time
    />
  </aside>
</template>
