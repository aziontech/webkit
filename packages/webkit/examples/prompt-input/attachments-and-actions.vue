<script setup>
  import Chip from '@aziontech/webkit/chip'
  import IconButton from '@aziontech/webkit/icon-button'
  import PromptInput from '@aziontech/webkit/prompt-input'
  import { ref } from 'vue'

  const prompt = ref('Explain the errors in this log')
  const files = ref(['access-log-14h.txt'])
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <PromptInput v-model="prompt">
      <template #attachments>
        <Chip
          v-for="file in files"
          :key="file"
          :label="file"
          removable
          @remove="files = files.filter((name) => name !== file)"
        />
      </template>
      <template #actions>
        <IconButton
          icon="pi pi-paperclip"
          aria-label="Attach a file"
          kind="transparent"
          size="medium"
        />
      </template>
    </PromptInput>
  </div>
</template>
