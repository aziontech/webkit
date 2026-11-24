<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { ref } from 'vue'

  const emit = defineEmits<{
    send: [event: MouseEvent, text: string]
  }>()

  const spoken = ref('')

  function simulateSpeak(event: MouseEvent) {
    spoken.value = 'Why is storefront answering with 502 errors?'
    emit('send', event, spoken.value)
  }

  const VOICE_CLASS =
    'flex flex-wrap items-center justify-between gap-(--spacing-sm) rounded-(--shape-card) ' +
    'border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs)'
</script>

<template>
  <div
    role="region"
    aria-label="Live voice conversation"
    data-testid="ai-chat-voice"
    :class="VOICE_CLASS"
  >
    <div class="flex min-w-0 items-center gap-(--spacing-sm)">
      <i
        class="az az-audio-lines shrink-0 text-(--text-default)"
        aria-hidden="true"
      />
      <StatusIndicator
        severity="info"
        label="Listening…"
        loading
      />
      <span
        v-if="spoken"
        class="truncate text-body-xs text-(--text-muted)"
        >{{ spoken }}</span
      >
    </div>
    <Button
      label="Try sample question"
      icon="az az-sparkles"
      variant="outline"
      size="small"
      @click="simulateSpeak"
    />
  </div>
</template>
