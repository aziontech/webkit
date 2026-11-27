<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import type {
    PromptInputFile,
    PromptInputMenuOption,
    PromptInputStatus
  } from '@aziontech/ui/prompt-input'
  import PromptInputAccessPicker from '@aziontech/ui/prompt-input-access-picker'
  import PromptInputAttachButton from '@aziontech/ui/prompt-input-attach-button'
  import PromptInputContextPicker from '@aziontech/ui/prompt-input-context-picker'
  import PromptInputDictateButton from '@aziontech/ui/prompt-input-dictate-button'
  import PromptInputModelPicker from '@aziontech/ui/prompt-input-model-picker'
  import PromptInput from '@aziontech/ui/prompt-input-root'
  import ToggleGroup from '@aziontech/ui/toggle-group'
  import { ref } from 'vue'

  import { sampleAccessModes, sampleProviders, sampleSpeeds } from '../sample'

  defineProps<{
    state: PromptInputStatus
    queueable: boolean
    hydrating: boolean
    empty: boolean
    accept: string
    maxFiles: number
    maxFileSize: number
    attachable: boolean
    voice: boolean
    models: PromptInputMenuOption[]
    modes: PromptInputMenuOption[]
    contexts: PromptInputMenuOption[]
    tools: PromptInputMenuOption[]
  }>()

  const emit = defineEmits<{
    submit: [event: MouseEvent | KeyboardEvent, value: string]
    stop: [event: MouseEvent]
    'voice-start': [event: MouseEvent]
  }>()

  const prompt = defineModel<string>({ required: true })
  const files = defineModel<PromptInputFile[]>('files', { required: true })
  const modelKey = defineModel<string>('modelKey', { required: true })
  const modeKey = defineModel<string>('modeKey', { required: true })
  const contextKey = defineModel<string>('contextKey', { required: true })
  const toolKeys = defineModel<string[]>('toolKeys', { required: true })

  const accessKey = ref('full')
  const speedKey = ref('standard')
  const ultracode = ref(false)
  const favoriteKeys = ref<string[]>(['gemini-4-neon', 'claude-opus-4-5'])

  const inputEl = ref<InstanceType<typeof PromptInput> | null>(null)
  const voiceActive = ref(false)

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
    :voice="voice"
    :voice-active="voiceActive"
    placeholder="Ask about storefront"
    @submit="(event, { value }) => emit('submit', event, value)"
    @stop="emit('stop', $event)"
    @voice-start="
      (event) => {
        voiceActive = true
        emit('voice-start', event)
      }
    "
    @voice-end="voiceActive = false"
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
      <PromptInputModelPicker
        v-if="models.length"
        v-model="modelKey"
        v-model:mode="modeKey"
        v-model:favorite-keys="favoriteKeys"
        :providers="sampleProviders"
        :models="models"
        :modes="modes"
        mode-label="Thinking Level"
      >
        <template #footer>
          <ToggleGroup
            v-model="speedKey"
            :options="sampleSpeeds"
            size="small"
            aria-label="Response speed"
          />
          <Button
            label="Ultracode"
            icon="az az-sparkles"
            :variant="ultracode ? 'secondary' : 'ghost'"
            size="small"
            :aria-pressed="ultracode"
            @click="ultracode = !ultracode"
          />
          <PromptInputAccessPicker
            v-model="accessKey"
            :options="sampleAccessModes"
          />
        </template>
      </PromptInputModelPicker>
      <PromptInputDictateButton />
    </template>
    <template
      v-if="contexts.length"
      #footer
    >
      <PromptInputContextPicker
        v-if="contexts.length"
        v-model="contextKey"
        :options="contexts"
        placeholder="Choose project"
      />
    </template>
    <template
      v-if="empty"
      #hint
      >The AI assistant can make mistakes. Check important information before you act on
      it.</template
    >
  </PromptInput>
</template>
