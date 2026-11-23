<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import type { PromptInputMenuOption } from '@aziontech/webkit/prompt-input'
  import { computed } from 'vue'

  export type AiChatHeaderAction = 'share' | 'rename' | 'archive' | 'remove'

  const props = defineProps<{
    empty: boolean
    historyOpen: boolean
    models: PromptInputMenuOption[]
  }>()

  const emit = defineEmits<{
    'new-chat': [event: MouseEvent]
    'open-history': [event: MouseEvent]
    'toggle-history': [event: MouseEvent]
    action: [event: MouseEvent | KeyboardEvent, action: AiChatHeaderAction]
  }>()

  const modelKey = defineModel<string>('modelKey', { required: true })

  const modelLabel = computed(
    () => props.models.find((option) => option.value === modelKey.value)?.label ?? ''
  )

  const actions: { value: AiChatHeaderAction; label: string }[] = [
    { value: 'share', label: 'Share' },
    { value: 'rename', label: 'Rename' },
    { value: 'archive', label: 'Archive' },
    { value: 'remove', label: 'Delete' }
  ]

  function onModel(_event: MouseEvent | KeyboardEvent, value: string | number) {
    modelKey.value = String(value)
  }

  function onAction(event: MouseEvent | KeyboardEvent, value: string | number) {
    emit('action', event, value as AiChatHeaderAction)
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
      <span :class="FLOATING_CLASS">
        <IconButton
          icon="az az-menu"
          aria-label="Open conversation history"
          variant="ghost"
          @click="emit('open-history', $event)"
        />
      </span>
      <span class="pointer-events-auto inline-flex max-md:hidden">
        <IconButton
          icon="az az-history"
          :aria-label="historyOpen ? 'Hide conversation history' : 'Show conversation history'"
          :aria-expanded="historyOpen"
          aria-controls="ai-chat-history"
          variant="ghost"
          size="medium"
          @click="emit('toggle-history', $event)"
        />
      </span>
      <h1
        id="ai-chat-title"
        class="sr-only"
      >
        AI assistant
      </h1>
      <span class="pointer-events-auto inline-flex min-w-0 max-md:hidden">
        <DropdownMenu
          side="bottom"
          align="start"
          :disabled="!models.length"
          @select="onModel"
        >
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="medium"
              icon="az az-chevron-down"
              icon-position="trailing"
              :disabled="!models.length"
              class="min-w-0"
            >
              <span class="truncate text-label-lg">AI assistant</span>
              <span
                v-if="modelLabel"
                class="truncate text-(--text-muted)"
                >{{ modelLabel }}</span
              >
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuGroup label="Model">
            <DropdownMenuItem
              v-for="option in models"
              :key="option.value"
              :value="option.value"
              type="radio"
              :selected="option.value === modelKey"
              :label="option.label"
            >
              <template
                v-if="option.description"
                #trailing
              >
                <span class="max-w-48 truncate text-body-xs text-(--text-muted)">{{
                  option.description
                }}</span>
              </template>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenu>
      </span>
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
            />
          </DropdownMenuGroup>
        </DropdownMenu>
      </span>
    </div>
  </header>
</template>
