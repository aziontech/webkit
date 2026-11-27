<script setup>
  import CopyPromptButton from '@aziontech/ui/copy-prompt-button'

  const prompt = 'Deploy this repository to Azion with the Azion CLI.'
  const agents = [
    { name: 'Claude', icon: 'az az-claude' },
    { name: 'GitHub Copilot', icon: 'az az-microsoft-copilot' },
    { name: 'Windsurf', icon: 'az az-windsurf' }
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
