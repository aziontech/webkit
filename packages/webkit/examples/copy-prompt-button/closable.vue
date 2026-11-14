<script setup>
  import claudeSymbol from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import codexSymbol from '@aziontech/webkit/assets/codex-symbol-mono.svg'
  import cursorSymbol from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
  import geminiSymbol from '@aziontech/webkit/assets/gemini-symbol-color.svg'
  import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'
  import { ref } from 'vue'

  const prompt = 'Set up the Azion CLI, connect the Azion docs over MCP and link this project.'
  const agents = [
    { name: 'Claude', logo: claudeSymbol },
    { name: 'Codex', logo: codexSymbol },
    { name: 'Gemini', logo: geminiSymbol },
    { name: 'Cursor', logo: cursorSymbol }
  ]
  const dismissed = ref(false)
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-sm)">
    <CopyPromptButton
      :value="prompt"
      label="Onboard your agent"
      :agents="agents"
      closable
      @close="dismissed = true"
    />
    <p
      v-if="dismissed"
      class="m-0 text-body-sm text-(--text-muted)"
    >
      Dismissed. Reload the example to bring it back.
    </p>
  </div>
</template>
