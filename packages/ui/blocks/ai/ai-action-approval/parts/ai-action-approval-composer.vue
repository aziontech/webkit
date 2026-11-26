<script setup lang="ts">
  import type {
    PromptInputFile,
    PromptInputMenuOption,
    PromptInputStatus
  } from '@aziontech/ui/prompt-input'
  import PromptInputAttachButton from '@aziontech/ui/prompt-input-attach-button'
  import PromptInputContextPicker from '@aziontech/ui/prompt-input-context-picker'
  import PromptInputDictateButton from '@aziontech/ui/prompt-input-dictate-button'
  import PromptInputModelPicker from '@aziontech/ui/prompt-input-model-picker'
  import PromptInput from '@aziontech/ui/prompt-input-root'
  import { type AiChatSendContent, contentOf } from '@aziontech/ui/utils/ai-chat'
  import { ref } from 'vue'

  const props = defineProps<{
    state: PromptInputStatus
    attachable: boolean
  }>()

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, content: AiChatSendContent]
    stop: [event: MouseEvent]
    'voice-start': [event: MouseEvent]
  }>()

  const prompt = ref('')
  const files = ref<PromptInputFile[]>([])
  const modelKey = ref('auto')
  const modeKey = ref('medium')
  const contextKey = ref('storefront')
  const toolKeys = ref<string[]>([])
  const voiceActive = ref(false)

  const models: PromptInputMenuOption[] = [
    { value: 'auto', label: 'Auto', description: 'Decides how long to think' },
    { value: 'fast', label: 'Fast', description: 'Answers right away' },
    { value: 'thinking', label: 'Thinking', description: 'Thinks longer for harder questions' }
  ]
  const modes: PromptInputMenuOption[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]
  const contexts: PromptInputMenuOption[] = [
    { value: 'storefront', label: 'storefront', description: 'Workload · Production' },
    { value: 'docs-site', label: 'docs-site', description: 'Product documentation' }
  ]
  const tools: PromptInputMenuOption[] = [
    { value: 'web-search', label: 'Web search', icon: 'az az-globe' },
    { value: 'deep-research', label: 'Deep research', icon: 'az az-lightbulb' },
    { value: 'create-image', label: 'Create image', icon: 'az az-image' }
  ]

  async function send(event: MouseEvent | KeyboardEvent, text: string) {
    const attached = files.value
    const picked = attached.flatMap((item) => (item.file instanceof File ? [item.file] : []))
    if ((!text.trim() && !picked.length) || props.state !== 'ready') return
    prompt.value = ''
    files.value = []
    try {
      emit('send', event, await contentOf(text, picked))
    } catch {
      prompt.value = text
      files.value = attached
    }
  }
</script>

<template>
  <PromptInput
    v-model="prompt"
    v-model:files="files"
    :status="state"
    :max-files="4"
    :max-file-size="10485760"
    accept="image/*,application/pdf"
    voice
    :voice-active="voiceActive"
    @submit="(event, { value }) => send(event, value)"
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
        v-model="modelKey"
        v-model:mode="modeKey"
        :models="models"
        :modes="modes"
        mode-label="Effort"
      />
      <PromptInputDictateButton />
    </template>
    <template #footer>
      <PromptInputContextPicker
        v-model="contextKey"
        :options="contexts"
        placeholder="Choose project"
      />
    </template>
    <template #hint>
      The AI assistant can make mistakes. Check important information before you act on it. It runs
      nothing in your account without your approval.
    </template>
  </PromptInput>
</template>
