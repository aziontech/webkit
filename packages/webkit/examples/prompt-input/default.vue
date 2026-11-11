<script setup>
  import PromptInput from '@aziontech/webkit/prompt-input'
  import { ref } from 'vue'

  const prompt = ref('')
  const last = ref('')

  function send(text) {
    last.value = text
    prompt.value = ''
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <PromptInput
      v-model="prompt"
      @submit="send"
    >
      <template #hint>The AI assistant can make mistakes. Check important information.</template>
    </PromptInput>
    <p
      v-if="last"
      class="text-body-sm text-(--text-muted)"
    >
      Submitted: {{ last }}
    </p>
  </div>
</template>
