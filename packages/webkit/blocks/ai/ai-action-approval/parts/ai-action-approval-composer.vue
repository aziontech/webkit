<script setup lang="ts">
  import type { PromptInputFile, PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import PromptInputAttachButton from '@aziontech/webkit/prompt-input-attach-button'
  import PromptInputDictateButton from '@aziontech/webkit/prompt-input-dictate-button'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import { type AiChatSendContent, contentOf } from '@aziontech/webkit/utils/ai-chat'
  import { ref } from 'vue'

  const props = defineProps<{
    state: PromptInputStatus
    attachable: boolean
  }>()

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, content: AiChatSendContent]
    stop: [event: MouseEvent]
  }>()

  const prompt = ref('')
  const files = ref<PromptInputFile[]>([])

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
    @submit="(event, { value }) => send(event, value)"
    @stop="emit('stop', $event)"
  >
    <template
      v-if="attachable"
      #actions
    >
      <PromptInputAttachButton />
    </template>
    <template #end>
      <PromptInputDictateButton />
    </template>
    <template #hint>
      The AI assistant can make mistakes. Check important information before you act on it. It runs
      nothing in your account without your approval.
    </template>
  </PromptInput>
</template>
