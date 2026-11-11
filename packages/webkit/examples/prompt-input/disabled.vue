<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import PromptInput from '@aziontech/webkit/prompt-input'
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <PromptInput
      placeholder="The AI assistant is unavailable"
      disabled
    >
      <template #actions>
        <IconButton
          icon="pi pi-paperclip"
          aria-label="Attach a file"
          kind="transparent"
          size="medium"
          disabled
        />
      </template>
    </PromptInput>
  </div>
</template>
