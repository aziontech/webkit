<script setup>
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import Drawer from '@aziontech/webkit/drawer'
  import IconButton from '@aziontech/webkit/icon-button'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  const now = '2026-11-11T15:00:00Z'
  const items = ref([
    { id: 'c1', title: 'Purge the cache after a deploy', updatedAt: '2026-11-11T14:20:00Z' },
    { id: 'c2', title: 'Why is my function returning 502?', updatedAt: '2026-11-11T09:05:00Z' },
    { id: 'c3', title: 'Set up a WAF rule for login attempts', updatedAt: '2026-11-10T18:40:00Z' },
    { id: 'c4', title: 'Image optimization query parameters', updatedAt: '2026-11-07T11:00:00Z' },
    {
      id: 'c5',
      title: 'Migrate DNS records from another provider',
      updatedAt: '2026-10-28T16:30:00Z'
    },
    { id: 'c6', title: 'Edge storage pricing', updatedAt: '2026-08-02T10:00:00Z' }
  ])
  const active = ref('c2')
  const historyOpen = ref(false)
  const narrow = ref(false)

  let narrowQuery = null
  const onNarrowChange = () => {
    narrow.value = !!narrowQuery?.matches
  }
  onMounted(() => {
    narrowQuery = globalThis.matchMedia?.('(max-width: 767px)') ?? null
    onNarrowChange()
    narrowQuery?.addEventListener('change', onNarrowChange)
  })
  onBeforeUnmount(() => narrowQuery?.removeEventListener('change', onNarrowChange))

  watch(active, () => {
    historyOpen.value = false
  })

  const activeTitle = computed(
    () => items.value.find((item) => item.id === active.value)?.title ?? 'New chat'
  )

  const startChat = () => {
    active.value = null
    historyOpen.value = false
  }

  const pendingId = ref(null)
  const confirmOpen = ref(false)
  const pendingTitle = computed(
    () => items.value.find((item) => item.id === pendingId.value)?.title ?? ''
  )

  const remove = (event, id) => {
    pendingId.value = id
    confirmOpen.value = true
  }

  const confirmRemove = () => {
    const id = pendingId.value
    items.value = items.value.filter((item) => item.id !== id)
    if (active.value === id) active.value = null
    confirmOpen.value = false
  }
</script>

<template>
  <div
    class="flex h-96 w-full overflow-hidden rounded-(--shape-card) border border-(--border-default)"
  >
    <aside
      v-if="!narrow"
      class="flex w-(--container-3xs) shrink-0 flex-col overflow-y-auto border-e border-(--border-default) bg-(--bg-surface) p-(--spacing-xs)"
    >
      <ConversationHistory
        v-model="active"
        :items="items"
        :now="now"
        creatable
        searchable
        removable
        @create="startChat"
        @remove="remove"
      />
    </aside>
    <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs) p-(--spacing-sm)">
      <div class="flex items-center gap-(--spacing-xs)">
        <IconButton
          v-if="narrow"
          icon="az az-menu"
          aria-label="Open conversation history"
          variant="ghost"
          @click="historyOpen = true"
        />
        <p class="m-0 truncate text-label-md text-(--text-default)">{{ activeTitle }}</p>
      </div>
    </div>
    <Drawer
      v-if="narrow"
      v-model:open="historyOpen"
      side="start"
      size="small"
    >
      <Drawer.Content>
        <Drawer.Header class="w-full">
          <Drawer.Title>Conversation history</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <ConversationHistory
            v-model="active"
            :items="items"
            :now="now"
            creatable
            searchable
            removable
            @create="startChat"
            @remove="remove"
          />
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Delete conversation"
      :description="`${pendingTitle} and its messages are deleted. This can't be undone.`"
      confirm-label="Delete conversation"
      size="small"
      @confirm="confirmRemove"
    />
  </div>
</template>
