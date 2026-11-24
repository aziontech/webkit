<script setup lang="ts">
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { sampleHistory, sampleHistoryNow, sampleProjects } from '../blocks/ai-chat.sample'

  const route = useRoute()
  const router = useRouter()

  const openKeys = ref<string[]>(['storefront'])
  const projectSort = ref<'recent' | 'name'>('recent')

  const active = computed<string | null>({
    get: () => (route.params.chatId as string | undefined) ?? null,
    set: (id) => {
      router.push(id ? `/assistant/c/${id}` : '/assistant')
    }
  })
</script>

<template>
  <ConversationHistory
    v-model="active"
    v-model:open-keys="openKeys"
    v-model:project-sort="projectSort"
    aria-label="AI Copilot chats"
    :items="sampleHistory"
    :now="sampleHistoryNow"
    :projects="sampleProjects"
    creatable
    project-creatable
    @create="router.push('/assistant')"
  />
</template>
