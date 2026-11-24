<script setup lang="ts">
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import DrawerBody from '@aziontech/webkit/drawer-body'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerHeader from '@aziontech/webkit/drawer-header'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import { watch } from 'vue'

  import { sampleHistory, sampleHistoryNow } from './ai-chat.sample'

  defineProps<{ panelOpen: boolean }>()

  const emit = defineEmits<{ create: [event: MouseEvent] }>()

  const active = defineModel<string | null>({ required: true })
  const drawerOpen = defineModel<boolean>('drawerOpen', { required: true })

  watch(active, () => {
    drawerOpen.value = false
  })

  function create(event: MouseEvent) {
    drawerOpen.value = false
    emit('create', event)
  }
</script>

<template>
  <aside
    v-if="panelOpen"
    id="ai-chat-history"
    aria-label="Conversation history"
    class="flex w-(--container-3xs) shrink-0 flex-col overflow-y-auto bg-(--bg-surface) p-(--spacing-xs) max-md:hidden"
  >
    <ConversationHistory
      v-model="active"
      :items="sampleHistory"
      :now="sampleHistoryNow"
      creatable
      searchable
      @create="create"
    />
  </aside>
  <Drawer
    v-model:open="drawerOpen"
    side="start"
    size="small"
  >
    <DrawerContent>
      <DrawerHeader class="w-full">
        <DrawerTitle>Conversation history</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <ConversationHistory
          v-model="active"
          :items="sampleHistory"
          :now="sampleHistoryNow"
          creatable
          searchable
          @create="create"
        />
      </DrawerBody>
    </DrawerContent>
  </Drawer>
</template>
