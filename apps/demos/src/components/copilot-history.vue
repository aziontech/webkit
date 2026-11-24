<script setup lang="ts">
  import type { ConversationHistoryItem } from '@aziontech/webkit/conversation-history'
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import { useConsoleLayout } from '@aziontech/webkit/use-console-layout'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { sampleHistoryNow } from '../blocks/ai-chat.sample'
  import { copilotChats, copilotOpenKeys, copilotProjects } from '../lib/copilot-chats'

  const route = useRoute()
  const router = useRouter()
  const layout = useConsoleLayout({ optional: true })

  const items = copilotChats
  const projects = copilotProjects
  const openKeys = copilotOpenKeys
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

  function removeChat(id: string) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  function pinProject(id: string) {
    projects.value = projects.value.map((entry) =>
      entry.id === id ? { ...entry, pinned: !entry.pinned } : entry
    )
  }

  function removeProject(id: string) {
    projects.value = projects.value.filter((entry) => entry.id !== id)
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
    @remove="(_event, id) => removeChat(id)"
    @project-pin="(_event, project) => pinProject(project.id)"
    @project-remove="(_event, project) => removeProject(project.id)"
    @project-chat-create="newChat"
  />
</template>
