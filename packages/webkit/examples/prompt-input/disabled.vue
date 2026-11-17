<script setup>
  import PromptInput from '@aziontech/webkit/prompt-input'
  import { ref } from 'vue'

  const model = ref('sol')
  const models = [{ value: 'sol', label: 'Sol 6.1' }]
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <PromptInput
      placeholder="The AI assistant is unavailable"
      voice
      disabled
    >
      <template #actions>
        <PromptInput.AttachButton />
      </template>
      <template #end>
        <PromptInput.ModelPicker
          v-model="model"
          :models="models"
        />
        <PromptInput.DictateButton transcriber="app" />
      </template>
    </PromptInput>
  </div>
</template>
