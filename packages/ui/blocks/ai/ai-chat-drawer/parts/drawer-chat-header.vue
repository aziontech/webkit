<script setup lang="ts">
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import IconButton from '@aziontech/ui/icon-button'
  import PanelHeader from '@aziontech/ui/panel-header'
  import Tag from '@aziontech/ui/tag'

  defineProps<{ empty: boolean }>()

  const emit = defineEmits<{ 'new-chat': [event: MouseEvent] }>()
</script>

<template>
  <PanelHeader class="w-full">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <DrawerTitle>AI assistant</DrawerTitle>
      <Tag
        label="Preview"
        severity="info"
        size="small"
      />
    </div>
    <div class="flex items-center gap-(--spacing-2xs)">
      <IconButton
        icon="az az-square-pen"
        aria-label="New chat"
        variant="ghost"
        size="medium"
        :disabled="empty"
        @click="emit('new-chat', $event)"
      />
    </div>
  </PanelHeader>
</template>
