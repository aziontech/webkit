<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import DrawerBody from '@aziontech/webkit/drawer-body'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerHeader from '@aziontech/webkit/drawer-header'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import IconButton from '@aziontech/webkit/icon-button'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { sampleHistory, sampleHistoryNow, sampleProjects } from '../blocks/ai-chat.sample'

  const route = useRoute()
  const router = useRouter()

  const consoleLinks = [
    { id: 'home', label: 'Home', icon: 'az az-home', href: '/onboarding' },
    { id: 'resources', label: 'Resources', icon: 'az az-box', href: '/resources' },
    { id: 'settings', label: 'Settings', icon: 'az az-settings', href: '/settings' }
  ]

  const openKeys = ref<string[]>(['storefront'])
  const projectSort = ref<'recent' | 'name'>('recent')
  const drawerOpen = ref(false)

  const active = computed<string | null>({
    get: () => (route.params.chatId as string | undefined) ?? null,
    set: (id) => {
      drawerOpen.value = false
      router.push(id ? `/assistant/c/${id}` : '/assistant')
    }
  })

  function newChat() {
    drawerOpen.value = false
    router.push('/assistant')
  }
</script>

<template>
  <div class="flex h-(--demo-viewport-height) min-h-0 w-full bg-(--bg-canvas)">
    <aside
      aria-label="AI Copilot chats"
      class="flex w-(--container-3xs) shrink-0 flex-col border-e border-(--border-default) bg-(--bg-surface) max-md:hidden"
    >
      <div class="flex h-14 shrink-0 items-center px-(--spacing-sm)">
        <RouterLink
          to="/resources"
          aria-label="Back to the Azion console"
          class="flex h-10 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) focus-visible:ring-2 focus-visible:ring-(--ring-color)"
        >
          <Brand
            variant="reduced"
            size="small"
          />
          <span class="text-label-lg text-(--text-default)">AI Copilot</span>
        </RouterLink>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto p-(--spacing-xs)">
        <ConversationHistory
          v-model="active"
          :items="sampleHistory"
          v-model:open-keys="openKeys"
          v-model:project-sort="projectSort"
          :now="sampleHistoryNow"
          :projects="sampleProjects"
          creatable
          project-creatable
          searchable
          @create="newChat"
        />
      </div>
    </aside>

    <main class="relative flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="absolute start-(--spacing-sm) top-(--spacing-sm) z-3 md:hidden">
        <IconButton
          icon="az az-menu"
          aria-label="Open chats and menu"
          variant="outline"
          size="medium"
          @click="drawerOpen = true"
        />
      </div>
      <slot />
    </main>

    <Drawer
      v-model:open="drawerOpen"
      side="start"
      size="small"
    >
      <DrawerContent>
        <DrawerHeader class="w-full">
          <DrawerTitle>AI Copilot</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <ConversationHistory
              v-model="active"
              :items="sampleHistory"
              v-model:open-keys="openKeys"
              v-model:project-sort="projectSort"
              :now="sampleHistoryNow"
              :projects="sampleProjects"
              creatable
              project-creatable
              searchable
              @create="newChat"
            />
            <div
              class="flex flex-col gap-(--spacing-2xs) border-t border-(--border-default) pt-(--spacing-sm)"
            >
              <Button
                v-for="item in consoleLinks"
                :key="item.id"
                :label="item.label"
                :icon="item.icon"
                variant="ghost"
                size="medium"
                class="justify-start"
                @click="router.push(item.href)"
              />
            </div>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  </div>
</template>
