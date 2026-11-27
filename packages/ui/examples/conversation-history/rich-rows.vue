<script setup>
  import Button from '@aziontech/ui/button'
  import ConversationHistory from '@aziontech/ui/conversation-history'
  import { ref } from 'vue'

  const now = '2026-11-11T15:00:00Z'
  const projects = ref([
    { id: 'p1', title: 'acme-store', pinned: true },
    { id: 'p2', title: 'docs-site' }
  ])
  const items = ref([
    {
      id: 'c1',
      title: 'Fix the checkout 502 errors',
      updatedAt: '2026-11-11T14:50:00Z',
      status: 'running',
      tag: 'Bug',
      description: 'fix/checkout-timeout',
      pinned: true
    },
    {
      id: 'c2',
      title: 'Cache the product images at the edge',
      updatedAt: '2026-11-11T13:10:00Z',
      projectId: 'p1',
      description: 'feat/image-cache'
    },
    {
      id: 'c3',
      title: 'Redirect the old docs.example.com links',
      updatedAt: '2026-11-10T16:10:00Z',
      projectId: 'p2',
      status: 'error'
    },
    {
      id: 'c4',
      title: 'Purge the cache after a deploy',
      updatedAt: '2026-11-11T09:05:00Z',
      locked: true
    },
    {
      id: 'c5',
      title: 'A WAF rule for login attempts',
      updatedAt: '2026-11-08T11:00:00Z',
      tag: 'Security',
      description: 'acme-store'
    },
    { id: 'c6', title: 'Move DNS records to Azion', updatedAt: '2026-10-28T16:30:00Z' }
  ])
  const active = ref('c2')
  const openKeys = ref(['p1'])
  const note = ref('')
  const removed = ref(null)

  const update = (id, patch) => {
    items.value = items.value.map((chat) => (chat.id === id ? { ...chat, ...patch } : chat))
  }
  const pin = (event, item) => update(item.id, { pinned: !item.pinned })
  const lock = (event, item) => update(item.id, { locked: !item.locked })
  const archive = (event, item) => update(item.id, { archived: !item.archived })
  const rename = (event, { item, title }) => update(item.id, { title })
  const move = (event, { item, project }) => {
    update(item.id, { projectId: project.id })
    openKeys.value = [...new Set([...openKeys.value, project.id])]
  }
  const pinProject = (event, project) => {
    projects.value = projects.value.map((p) =>
      p.id === project.id ? { ...p, pinned: !p.pinned } : p
    )
  }
  const remove = (event, id) => {
    removed.value = items.value.find((chat) => chat.id === id) ?? null
    items.value = items.value.filter((chat) => chat.id !== id)
    note.value = `Deleted “${removed.value?.title}”.`
  }
  const undo = () => {
    if (removed.value) items.value = [...items.value, removed.value]
    removed.value = null
    note.value = ''
  }
  const say = (text) => {
    removed.value = null
    note.value = text
  }
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-sm)">
    <aside
      class="flex h-112 w-full max-w-(--container-3xs) flex-col overflow-y-auto rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-xs)"
    >
      <ConversationHistory
        v-model="active"
        v-model:open-keys="openKeys"
        :items="items"
        :projects="projects"
        :now="now"
        :item-actions="['pin', 'rename', 'share', 'lock', 'move', 'archive']"
        :project-actions="['pin', 'settings', 'remove', 'chat-create']"
        show-toolbar
        show-time
        creatable
        project-creatable
        removable
        @create="active = null"
        @search-open="say('The app opens its search palette.')"
        @project-create="say('The app asks for a project name.')"
        @item-pin="pin"
        @item-rename="rename"
        @item-share="(event, item) => say(`Share “${item.title}”.`)"
        @item-lock="lock"
        @item-move="move"
        @item-archive="archive"
        @remove="remove"
        @project-pin="pinProject"
        @project-settings-open="(event, project) => say(`Settings of ${project.title}.`)"
        @project-remove="(event, project) => say(`The app confirms deleting ${project.title}.`)"
        @project-chat-create="(event, project) => say(`New chat in ${project.title}.`)"
      />
    </aside>
    <p
      class="m-0 flex min-h-8 items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)"
      aria-live="polite"
    >
      {{ note }}
      <Button
        v-if="removed"
        label="Undo"
        variant="ghost"
        size="small"
        @click="undo"
      />
    </p>
  </div>
</template>
