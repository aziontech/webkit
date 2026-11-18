<script setup>
  import claudeSymbol from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = [
    '## Works with Claude',
    '',
    'Connect the Azion docs to Claude over MCP.',
    '',
    `<ThirdPartyLogo name="Claude" src="${claudeSymbol}" size="large" />`
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
