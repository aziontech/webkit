<script setup lang="ts">
  import type {
    ConversationHistoryItem,
    ConversationHistoryProject
  } from '@aziontech/webkit/conversation-history'
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import { useConsoleLayout } from '@aziontech/webkit/use-console-layout'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { sampleHistory, sampleHistoryNow, sampleProjects } from '../blocks/ai-chat.sample'

  const route = useRoute()
  const router = useRouter()
  const layout = useConsoleLayout({ optional: true })

  const items = ref<ConversationHistoryItem[]>(sampleHistory.map((item) => ({ ...item })))
  const projects = ref<ConversationHistoryProject[]>(
    sampleProjects.map((project) => ({ ...project }))
  )
  const openKeys = ref<string[]>(['storefront'])
  const projectSort = ref<'recent' | 'name'>('recent')

  const active = computed<string | null>({
    get: () => (route.params.chatId as string | undefined) ?? null,
    set: (id) => {
      router.push(id ? `/assistant/c/${id}` : '/assistant')
    }
  })

  function update(id: string, patch: Partial<ConversationHistoryItem>) {
    items.value = items.value.map((item) => (item.id === id ? { ...item, ...patch } : item))
  }

  function newChat() {
    router.push('/assistant')
  }
</script>

<template>
  <ConversationHistory
    v-model="active"
    v-model:open-keys="openKeys"
    v-model:project-sort="projectSort"
    aria-label="AI Copilot chats"
    :items="items"
    :now="sampleHistoryNow"
    :projects="projects"
    :item-actions="['pin', 'rename', 'share', 'lock', 'move', 'archive']"
    :project-actions="['pin', 'settings', 'remove', 'chat-create']"
    group-by="status"
    creatable
    project-creatable
    removable
    show-toolbar
    show-time
    @create="newChat"
    @search-open="layout?.openSearch()"
    @item-pin="(_event, item) => update(item.id, { pinned: !item.pinned })"
    @item-lock="(_event, item) => update(item.id, { locked: !item.locked })"
    @item-archive="(_event, item) => update(item.id, { archived: !item.archived })"
    @item-rename="(_event, { item, title }) => update(item.id, { title })"
    @item-move="(_event, { item, project }) => update(item.id, { projectId: project.id })"
    @remove="(_event, id) => (items = items.filter((item) => item.id !== id))"
    @project-pin="
      (_event, project) =>
        (projects = projects.map((entry) =>
          entry.id === project.id ? { ...entry, pinned: !entry.pinned } : entry
        ))
    "
    @project-remove="
      (_event, project) => (projects = projects.filter((entry) => entry.id !== project.id))
    "
    @project-chat-create="newChat"
  />
</template>
