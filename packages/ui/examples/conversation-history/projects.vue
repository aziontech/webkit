<script setup>
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import { ref } from 'vue'

  const now = '2026-11-11T15:00:00Z'
  const projects = ref([
    { id: 'p1', title: 'storefront' },
    { id: 'p2', title: 'docs-site' },
    { id: 'p3', title: 'Security review' }
  ])
  const items = ref([
    {
      id: 'c1',
      title: 'Why does storefront return 502 errors?',
      updatedAt: '2026-11-11T14:20:00Z',
      projectId: 'p1'
    },
    {
      id: 'c2',
      title: 'Cache the product images at the edge',
      updatedAt: '2026-11-09T10:00:00Z',
      projectId: 'p1'
    },
    {
      id: 'c3',
      title: 'Redirect the old docs.example.com links',
      updatedAt: '2026-11-04T16:10:00Z',
      projectId: 'p2'
    },
    {
      id: 'c4',
      title: 'A WAF rule for login attempts',
      updatedAt: '2026-11-10T18:40:00Z',
      projectId: 'p3'
    },
    { id: 'c5', title: 'Purge the cache after a deploy', updatedAt: '2026-11-11T09:05:00Z' },
    { id: 'c6', title: 'Image optimization query parameters', updatedAt: '2026-11-07T11:00:00Z' },
    { id: 'c7', title: 'Move DNS records to Azion', updatedAt: '2026-10-28T16:30:00Z' }
  ])
  const active = ref('c1')
  const openKeys = ref(['p1'])
  const projectSort = ref('recent')

  const createProject = () => {
    const id = `p${projects.value.length + 1}`
    projects.value = [...projects.value, { id, title: `New project ${projects.value.length + 1}` }]
    openKeys.value = [...openKeys.value, id]
  }

  const startChat = () => {
    active.value = null
  }
</script>

<template>
  <aside
    class="flex h-96 w-full max-w-(--container-3xs) flex-col overflow-y-auto rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-xs)"
  >
    <ConversationHistory
      v-model="active"
      v-model:open-keys="openKeys"
      v-model:project-sort="projectSort"
      :items="items"
      :projects="projects"
      :now="now"
      creatable
      searchable
      project-creatable
      @create="startChat"
      @project-create="createProject"
    />
  </aside>
</template>
