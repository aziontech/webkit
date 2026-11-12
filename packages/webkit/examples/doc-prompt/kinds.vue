<script setup>
  import DocPrompt from '@aziontech/webkit/doc-prompt'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <DocPrompt
      kind="block"
      title="AI Assistant"
    >
      Deploy this repository to Azion and show me the edge URL when it is live.
    </DocPrompt>
    <DocPrompt
      kind="line"
      title="AI Assistant"
    >
      Deploy this repository to Azion and show me the edge URL when it is live. Then open the
      deployment log, find the cold-start figure, and summarise it for me.
    </DocPrompt>
  </div>
</template>
