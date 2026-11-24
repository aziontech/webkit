<script setup lang="ts">
  import IconButton from '../../../action/icon-button/icon-button.vue'

  defineOptions({ name: 'PromptInputSend', inheritAttrs: false })

  interface Props {
    /** A response is being generated: Stop shows. */
    busy: boolean
    /** Submit stays beside Stop while busy. */
    queueable: boolean
    /** There is something valid to send. */
    canSubmit: boolean
    /** Start voice shows in place of Submit. */
    showVoice: boolean
    /** Disables every control. */
    disabled: boolean
    /** Accessible names from the locale catalog. */
    labels: { stop: string; submit: string; voice: string }
    /** Test id of the owning PromptInput; each control appends its own part. */
    testId: string
  }

  defineProps<Props>()

  const emit = defineEmits<{
    stop: [event: MouseEvent]
    submit: [event: MouseEvent]
    'voice-start': [event: MouseEvent]
  }>()
</script>

<template>
  <IconButton
    v-if="busy"
    key="stop"
    icon="az az-stop"
    variant="secondary"
    size="large"
    :ariaLabel="labels.stop"
    :disabled="disabled"
    :data-testid="`${testId}__stop`"
    @click="(event: MouseEvent) => emit('stop', event)"
  />
  <IconButton
    v-if="busy && queueable && canSubmit"
    key="queue"
    icon="az az-arrow-up"
    variant="primary"
    size="large"
    :ariaLabel="labels.submit"
    :data-testid="`${testId}__submit`"
    @click="(event: MouseEvent) => emit('submit', event)"
  />
  <IconButton
    v-else-if="showVoice"
    key="voice"
    icon="az az-wave-pulse"
    variant="secondary"
    size="large"
    :ariaLabel="labels.voice"
    :disabled="disabled"
    :data-testid="`${testId}__voice`"
    @click="(event: MouseEvent) => emit('voice-start', event)"
  />
  <IconButton
    v-else-if="!busy"
    key="submit"
    icon="az az-arrow-up"
    variant="primary"
    size="large"
    :ariaLabel="labels.submit"
    :disabled="!canSubmit"
    :data-testid="`${testId}__submit`"
    @click="(event: MouseEvent) => emit('submit', event)"
  />
</template>
