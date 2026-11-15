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
          icon="ai ai-paperclip"
          aria-label="Attach a file"
          variant="ghost"
          size="medium"
          disabled
        />
      </template>
    </PromptInput>
  </div>
</template>
