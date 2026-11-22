<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Tag from '@aziontech/webkit/tag'

  defineProps<{ empty: boolean }>()

  const emit = defineEmits<{ 'new-chat': [event: MouseEvent] }>()
</script>

<template>
  <header
    class="flex items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
  >
    <div class="flex items-center gap-(--spacing-xs)">
      <h1
        id="ai-chat-title"
        class="text-heading-xs text-(--text-default)"
      >
        AI assistant
      </h1>
      <Tag
        label="Preview"
        severity="info"
        size="small"
      />
    </div>
    <Button
      label="New chat"
      variant="ghost"
      size="small"
      icon="az az-plus"
      :disabled="empty"
      @click="emit('new-chat', $event)"
    />
  </header>
</template>
