<script setup>
  import DocAgentCard from '@aziontech/webkit/doc-agent-card'

  const prompt = 'Set up the Azion CLI and link this project to my Azion account.'
</script>

<template>
  <div class="w-full max-w-(--container-sm)">
    <DocAgentCard
      :prompt="prompt"
      action-href="#"
    />
  </div>
</template>
