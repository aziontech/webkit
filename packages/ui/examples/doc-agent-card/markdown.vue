<script setup>
  import DocMarkdown from '@aziontech/ui/doc-markdown'
  import DocProse from '@aziontech/ui/doc-prose'

  const source = [
    '## Set up with an agent',
    '',
    '<AgentCard prompt="Set up the Azion CLI, connect the Azion docs over MCP and link this project to my Azion account." action-href="#" />'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
