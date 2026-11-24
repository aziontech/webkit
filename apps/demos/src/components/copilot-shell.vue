<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import DrawerBody from '@aziontech/webkit/drawer-body'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerHeader from '@aziontech/webkit/drawer-header'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { sampleHistory, sampleHistoryNow } from '../blocks/ai-chat.sample'
  import { account } from '../lib/navigation'

  const route = useRoute()
  const router = useRouter()

  const rail = [
    { id: 'home', label: 'Home', icon: 'az az-home', href: '/onboarding' },
    { id: 'copilot', label: 'AI Copilot', icon: 'az az-ask-azion', href: '/assistant' },
    { id: 'resources', label: 'Resources', icon: 'az az-box', href: '/resources' },
    { id: 'domains', label: 'Domains', icon: 'az az-globe', href: '' },
    { id: 'metrics', label: 'Metrics', icon: 'az az-chart-bar', href: '' },
    { id: 'settings', label: 'Settings', icon: 'az az-settings', href: '/settings' }
  ]

  const panelOpen = ref(true)
  const drawerOpen = ref(false)

  const active = computed<string | null>({
    get: () => (route.params.chatId as string | undefined) ?? null,
    set: (id) => {
      drawerOpen.value = false
      router.push(id ? `/assistant/c/${id}` : '/assistant')
    }
  })

  function onRail(id: string, href: string) {
    if (id === 'copilot') {
      panelOpen.value = !panelOpen.value
      return
    }
    if (href) router.push(href)
  }

  function newChat() {
    drawerOpen.value = false
    router.push('/assistant')
  }
</script>

<template>
  <div class="flex h-(--demo-viewport-height) min-h-0 w-full bg-(--bg-canvas)">
    <nav
      aria-label="Main navigation"
      class="flex w-14 shrink-0 flex-col items-center gap-(--spacing-2xs) border-e border-(--border-default) bg-(--bg-surface) py-(--spacing-sm) max-md:hidden"
    >
      <RouterLink
        to="/resources"
        aria-label="Azion home"
        class="mb-(--spacing-sm) flex h-10 items-center rounded-(--shape-button) focus-visible:ring-2 focus-visible:ring-(--ring-color)"
      >
        <Brand
          variant="reduced"
          size="small"
        />
      </RouterLink>
      <Tooltip
        v-for="item in rail"
        :key="item.id"
        :content="item.id === 'copilot' ? (panelOpen ? 'Hide chats' : 'Show chats') : item.label"
        side="end"
      >
        <IconButton
          :icon="item.icon"
          :aria-label="item.label"
          :aria-current="item.id === 'copilot' ? 'page' : undefined"
          :variant="item.id === 'copilot' ? 'secondary' : 'ghost'"
          :disabled="item.id !== 'copilot' && !item.href"
          size="medium"
          @click="onRail(item.id, item.href)"
        />
      </Tooltip>
      <div class="mt-auto">
        <Avatar
          :label="account.name"
          :alt="account.name"
          size="small"
          variant="square"
        />
      </div>
    </nav>

    <aside
      v-if="panelOpen"
      aria-label="AI Copilot chats"
      class="flex w-(--container-3xs) shrink-0 flex-col border-e border-(--border-default) bg-(--bg-surface) max-md:hidden"
    >
      <div class="flex h-14 shrink-0 items-center justify-between px-(--spacing-sm)">
        <span class="px-(--spacing-xs) text-label-lg text-(--text-default)">AI Copilot</span>
        <Tooltip
          content="Hide chats"
          side="bottom"
        >
          <IconButton
            icon="az az-history"
            aria-label="Hide chats"
            variant="ghost"
            size="medium"
            @click="panelOpen = false"
          />
        </Tooltip>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto p-(--spacing-xs)">
        <ConversationHistory
          v-model="active"
          :items="sampleHistory"
          :now="sampleHistoryNow"
          creatable
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
              :now="sampleHistoryNow"
              creatable
              searchable
              @create="newChat"
            />
            <div class="flex flex-col gap-(--spacing-2xs) border-t border-(--border-default) pt-(--spacing-sm)">
              <Button
                v-for="item in rail.filter((entry) => entry.href && entry.id !== 'copilot')"
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
