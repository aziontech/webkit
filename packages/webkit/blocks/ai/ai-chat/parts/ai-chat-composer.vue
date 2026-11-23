<script setup lang="ts">
  import type {
    PromptInputFile,
    PromptInputMenuOption,
    PromptInputStatus
  } from '@aziontech/webkit/prompt-input'
  import PromptInputAttachButton from '@aziontech/webkit/prompt-input-attach-button'
  import PromptInputDictateButton from '@aziontech/webkit/prompt-input-dictate-button'
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
    voice: boolean
    tools: PromptInputMenuOption[]
  }>()

  const emit = defineEmits<{
    submit: [event: MouseEvent | KeyboardEvent, value: string]
    stop: [event: MouseEvent]
    'voice-start': [event: MouseEvent]
  }>()

  const prompt = defineModel<string>({ required: true })
  const files = defineModel<PromptInputFile[]>('files', { required: true })
  const toolKeys = defineModel<string[]>('toolKeys', { required: true })

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
    :max-length="4000"
    :voice="voice"
    @submit="(event, { value }) => emit('submit', event, value)"
    @stop="emit('stop', $event)"
    @voice-start="emit('voice-start', $event)"
  >
    <template
      v-if="attachable"
      #actions
    >
      <PromptInputAttachButton
        v-model="toolKeys"
        :tools="tools"
      />
    </template>
    <template #end>
      <PromptInputDictateButton />
    </template>
    <template #hint>
      <span class="max-md:sr-only">
        The AI assistant can make mistakes. Check important information before you act on it.
      </span>
    </template>
  </PromptInput>
</template>
