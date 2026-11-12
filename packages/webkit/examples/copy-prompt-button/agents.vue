<script setup>
  import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'

  const prompt = 'Deploy this repository to Azion with the Azion CLI.'
  const agents = [
    { name: 'Claude', icon: 'ai ai-claude' },
    { name: 'GitHub Copilot', icon: 'ai ai-microsoft-copilot' },
    { name: 'Windsurf', icon: 'ai ai-windsurf' }
  ]
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-sm)">
    <CopyPromptButton
      :value="prompt"
      :agents="agents"
    />
    <CopyPromptButton
      :value="prompt"
      :agents="[]"
    />
  </div>
</template>
