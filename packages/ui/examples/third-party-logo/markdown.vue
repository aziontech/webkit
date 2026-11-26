<script setup>
  import claudeSymbol from '@aziontech/ui/assets/claude-symbol-color.svg'
  import DocMarkdown from '@aziontech/ui/doc-markdown'
  import DocProse from '@aziontech/ui/doc-prose'

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
