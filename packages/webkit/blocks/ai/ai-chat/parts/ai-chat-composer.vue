<script setup lang="ts">
  import type {
    PromptInputFile,
    PromptInputMenuOption,
    PromptInputStatus
  } from '@aziontech/webkit/prompt-input'
  import PromptInputAccessPicker from '@aziontech/webkit/prompt-input-access-picker'
  import PromptInputAttachButton from '@aziontech/webkit/prompt-input-attach-button'
  import PromptInputContextPicker from '@aziontech/webkit/prompt-input-context-picker'
  import PromptInputDictateButton from '@aziontech/webkit/prompt-input-dictate-button'
  import PromptInputModelPicker from '@aziontech/webkit/prompt-input-model-picker'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import { nextTick, ref } from 'vue'

  import { sampleAccessModes, sampleContexts, sampleModes, sampleProviders } from '../sample'
  import AiChatVoice from './ai-chat-voice.vue'

  defineProps<{
    state: PromptInputStatus
    queueable: boolean
    hydrating: boolean
    accept: string
    maxFiles: number
    maxFileSize: number
    attachable: boolean
    voice: boolean
    models: PromptInputMenuOption[]
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
  const toolKeys = defineModel<string[]>('toolKeys', { required: true })

  const modeKey = ref('medium')
  const contextKey = ref('')
  const accessKey = ref('supervised')
  const favoriteKeys = ref<string[]>([])
  const modes = sampleModes
  const contexts = sampleContexts

  const inputEl = ref<InstanceType<typeof PromptInput> | null>(null)
  const voiceActive = ref(false)

  function startVoice(event: MouseEvent) {
    voiceActive.value = true
    emit('voice-start', event)
  }

  function endVoice() {
    voiceActive.value = false
    void nextTick(() => inputEl.value?.focus())
  }

  defineExpose({ focus: () => inputEl.value?.focus() })
</script>

<template>
  <AiChatVoice
    v-if="voiceActive"
    @send="(event, text) => emit('submit', event, text)"
  />
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
    :voice-active="voiceActive"
    @submit="(event, { value }) => emit('submit', event, value)"
    @stop="emit('stop', $event)"
    @voice-start="startVoice"
    @voice-end="endVoice"
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
  </PromptInput>
</template>
