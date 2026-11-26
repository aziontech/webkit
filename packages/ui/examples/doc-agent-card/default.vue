<script setup>
  import DocAgentCard from '@aziontech/webkit/doc-agent-card'

  const prompt =
    'Set up the Azion CLI, connect the Azion docs over MCP and link this project to my Azion account.'
</script>

<template>
  <DocAgentCard
    :prompt="prompt"
    action-href="#"
  />
</template>
