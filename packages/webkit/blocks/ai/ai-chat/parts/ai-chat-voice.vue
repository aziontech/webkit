<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { ref } from 'vue'

  const emit = defineEmits<{
    send: [event: MouseEvent, text: string]
    end: [event: MouseEvent]
  }>()

  const muted = ref(false)
  const spoken = ref('')

  function simulateSpeak(event: MouseEvent) {
    spoken.value = 'Why is storefront answering with 502 errors?'
    emit('send', event, spoken.value)
  }

  const VOICE_CLASS =
    'flex flex-wrap items-center justify-between gap-(--spacing-sm) rounded-(--shape-card) ' +
    'border border-(--border-input) bg-(--bg-surface-raised) px-(--spacing-md) py-(--spacing-sm) shadow-(--shadow-lg)'
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
        class="az az-wave-pulse shrink-0 text-(--text-default)"
        aria-hidden="true"
      />
      <div class="flex min-w-0 flex-col gap-(--spacing-3xs)">
        <StatusIndicator
          :severity="muted ? 'neutral' : 'info'"
          :label="muted ? 'Microphone muted' : 'Listening…'"
          :loading="!muted"
        />
        <span
          v-if="spoken"
          class="truncate text-body-xs text-(--text-muted)"
          >{{ spoken }}</span
        >
      </div>
    </div>
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <Button
        :label="muted ? 'Unmute' : 'Mute'"
        :icon="muted ? 'az az-volume-off' : 'az az-microphone'"
        variant="ghost"
        size="small"
        @click="muted = !muted"
      />
      <Button
        label="Try sample question"
        icon="az az-sparkles"
        variant="outline"
        size="small"
        :disabled="muted"
        @click="simulateSpeak"
      />
      <Button
        label="End voice"
        icon="az az-x"
        variant="secondary"
        size="small"
        @click="emit('end', $event)"
      />
    </div>
  </div>
</template>
