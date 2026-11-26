<script setup>
  import Button from '@aziontech/ui/button'
  import CopyPromptButton from '@aziontech/ui/copy-prompt-button'

  const prompt =
    'Set up the Azion CLI, connect the Azion docs over MCP and link this project to my Azion account.'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-sm)">
    <Button
      label="Get started"
      variant="primary"
      size="large"
      href="#"
    />
    <CopyPromptButton :value="prompt" />
  </div>
</template>
