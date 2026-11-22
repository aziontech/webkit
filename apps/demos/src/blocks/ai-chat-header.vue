<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'

  defineProps<{ empty: boolean; historyOpen: boolean }>()

  const emit = defineEmits<{
    'new-chat': [event: MouseEvent]
    'open-history': [event: MouseEvent]
    'toggle-history': [event: MouseEvent]
  }>()

  const HEADER_CLASS =
    'pointer-events-none absolute inset-x-0 top-0 z-2 flex items-center justify-between gap-(--spacing-sm) p-(--spacing-sm) ' +
    'md:bg-[linear-gradient(to_bottom,var(--bg-canvas)_55%,transparent)] md:px-(--spacing-md)'

  const FLOATING_CLASS =
    'pointer-events-auto inline-flex overflow-hidden rounded-(--shape-button) border border-(--border-default) ' +
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
        class="sr-only text-label-md text-(--text-default) md:not-sr-only"
      >
        AI assistant
      </h1>
      <span class="inline-flex max-md:hidden">
        <Tag
          label="Preview"
          severity="info"
          size="small"
        />
      </span>
    </div>
    <span :class="FLOATING_CLASS">
      <IconButton
        icon="az az-square-pen"
        aria-label="New chat"
        variant="ghost"
        :disabled="empty"
        @click="emit('new-chat', $event)"
      />
    </span>
    <span class="pointer-events-auto inline-flex max-md:hidden">
      <Button
        label="New chat"
        variant="ghost"
        size="small"
        icon="az az-square-pen"
        :disabled="empty"
        @click="emit('new-chat', $event)"
      />
    </span>
  </header>
</template>
