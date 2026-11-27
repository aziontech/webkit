<script setup lang="ts">
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import { computed } from 'vue'

  import { sampleThreads } from './ai-chat.sample'

  const props = defineProps<{ conversationKey: string | null }>()

  const emit = defineEmits<{
    confirm: [event: MouseEvent]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  const title = computed(() => {
    const name = sampleThreads.find((thread) => thread.id === props.conversationKey)?.title
    return name ? `Delete “${name}”?` : 'Delete this conversation?'
  })
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    :title="title"
    description="The conversation and its messages are removed from your history. This cannot be undone."
    confirm-label="Delete"
    @confirm="(event: MouseEvent) => emit('confirm', event)"
  />
</template>
