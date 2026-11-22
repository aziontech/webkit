<script setup lang="ts">
  import type { PromptInputFile, PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import PromptInputAttachButton from '@aziontech/webkit/prompt-input-attach-button'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import { ref } from 'vue'

  defineProps<{
    state: PromptInputStatus
    queueable: boolean
    hydrating: boolean
    accept: string
    maxFiles: number
    maxFileSize: number
    attachable: boolean
  }>()

  const emit = defineEmits<{
    submit: [event: MouseEvent | KeyboardEvent, value: string]
    stop: [event: MouseEvent]
  }>()

  const prompt = defineModel<string>({ required: true })
  const files = defineModel<PromptInputFile[]>('files', { required: true })

  const inputEl = ref<InstanceType<typeof PromptInput> | null>(null)

  defineExpose({ focus: () => inputEl.value?.focus() })
</script>

<template>
  <PromptInput
    ref="inputEl"
    v-model="prompt"
    v-model:files="files"
    :status="state"
    :queueable="queueable"
    :disabled="hydrating"
    :accept="accept"
    :max-files="maxFiles"
    :max-file-size="maxFileSize"
    :max-rows="4"
    placeholder="Ask about storefront"
    @submit="(event, { value }) => emit('submit', event, value)"
    @stop="emit('stop', $event)"
  >
    <template
      v-if="attachable"
      #actions
    >
      <PromptInputAttachButton />
    </template>
    <template #hint>The AI assistant can make mistakes. Check important information.</template>
  </PromptInput>
</template>
