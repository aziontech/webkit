<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DropdownMenuGroup from '@aziontech/ui/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/ui/dropdown-menu-item'
  import DropdownMenu from '@aziontech/ui/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/ui/dropdown-menu-trigger'
  import IconButton from '@aziontech/ui/icon-button'
  import { computed, ref } from 'vue'

  import { sampleThreads } from './ai-chat.sample'
  import AiChatRemoveDialog from './ai-chat-remove-dialog.vue'

  export type AiChatHeaderAction = 'share' | 'rename' | 'archive' | 'remove'

  const props = defineProps<{
    empty: boolean
    historyOpen: boolean
    conversationKey: string | null
  }>()

  const emit = defineEmits<{
    'new-chat': [event: MouseEvent]
    'open-history': [event: MouseEvent]
    'toggle-history': [event: MouseEvent]
    action: [event: MouseEvent | KeyboardEvent, action: AiChatHeaderAction]
  }>()

  const title = computed(
    () => sampleThreads.find((thread) => thread.id === props.conversationKey)?.title ?? 'Agent'
  )

  const actions: { value: AiChatHeaderAction; label: string; severity?: 'danger' }[] = [
    { value: 'share', label: 'Share' },
    { value: 'rename', label: 'Rename' },
    { value: 'archive', label: 'Archive' },
    { value: 'remove', label: 'Delete', severity: 'danger' }
  ]

  const removeOpen = ref(false)

  function onAction(event: MouseEvent | KeyboardEvent, value: string | number) {
    if (value === 'remove') removeOpen.value = true
    else emit('action', event, value as AiChatHeaderAction)
  }

  const HEADER_CLASS =
    'pointer-events-none absolute inset-x-0 top-0 z-2 flex items-center justify-between gap-(--spacing-sm) p-(--spacing-sm) ' +
    'md:bg-[linear-gradient(to_bottom,var(--bg-canvas)_55%,transparent)] md:px-(--spacing-md)'

  const FLOATING_CLASS =
    'pointer-events-auto inline-flex items-center overflow-hidden rounded-(--shape-button) border border-(--border-default) ' +
    'bg-[color-mix(in_srgb,var(--bg-surface-raised)_80%,transparent)] shadow-(--shadow-md) backdrop-blur-md md:hidden'
</script>

<template>
  <header :class="HEADER_CLASS">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <h1
        id="ai-chat-title"
        class="pointer-events-auto min-w-0 truncate px-(--spacing-xs) text-label-lg text-(--text-default) max-md:sr-only"
      >
        {{ title }}
      </h1>
    </div>
    <div class="flex items-center gap-(--spacing-2xs)">
      <span class="pointer-events-auto inline-flex max-md:hidden">
        <Button
          label="Share"
          variant="ghost"
          size="small"
          icon="az az-share"
          :disabled="empty"
          @click="emit('action', $event, 'share')"
        />
      </span>
      <span :class="FLOATING_CLASS">
        <IconButton
          icon="az az-square-pen"
          aria-label="New chat"
          variant="ghost"
          :disabled="empty"
          @click="emit('new-chat', $event)"
        />
        <DropdownMenu
          side="bottom"
          align="end"
          :disabled="empty"
          @select="onAction"
        >
          <DropdownMenuTrigger>
            <IconButton
              icon="az az-ellipsis"
              aria-label="More conversation actions"
              variant="ghost"
              :disabled="empty"
            />
          </DropdownMenuTrigger>
          <DropdownMenuGroup>
            <DropdownMenuItem
              v-for="action in actions"
              :key="action.value"
              :value="action.value"
              :label="action.label"
              :severity="action.severity"
            />
          </DropdownMenuGroup>
        </DropdownMenu>
      </span>
      <span
        v-if="!historyOpen"
        class="pointer-events-auto inline-flex max-md:hidden"
      >
        <IconButton
          icon="az az-square-pen"
          aria-label="New chat"
          variant="ghost"
          size="medium"
          :disabled="empty"
          @click="emit('new-chat', $event)"
        />
      </span>
      <span class="pointer-events-auto inline-flex max-md:hidden">
        <DropdownMenu
          side="bottom"
          align="end"
          :disabled="empty"
          @select="onAction"
        >
          <DropdownMenuTrigger>
            <IconButton
              icon="az az-ellipsis"
              aria-label="More conversation actions"
              variant="ghost"
              size="medium"
              :disabled="empty"
            />
          </DropdownMenuTrigger>
          <DropdownMenuGroup>
            <DropdownMenuItem
              v-for="action in actions.slice(1)"
              :key="action.value"
              :value="action.value"
              :label="action.label"
              :severity="action.severity"
            />
          </DropdownMenuGroup>
        </DropdownMenu>
      </span>
    </div>
    <AiChatRemoveDialog
      v-model:open="removeOpen"
      :conversation-key="conversationKey"
      @confirm="(event: MouseEvent) => emit('action', event, 'remove')"
    />
  </header>
</template>
