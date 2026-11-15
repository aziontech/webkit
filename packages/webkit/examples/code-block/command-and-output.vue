<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'

  const command = [
    {
      label: 'Shell',
      value: 'command',
      language: 'bash',
      code: '$ curl -I https://<your-azion-domain>'
    }
  ]

  const output = [
    {
      label: 'Output',
      value: 'output',
      language: 'text',
      code: 'HTTP/2 200\ncontent-type: text/html; charset=utf-8\nx-cache: HIT'
    }
  ]
</script>

<template>
  <div class="flex max-w-[692px] flex-col gap-(--spacing-xs)">
    <CodeBlock
      :tabs="command"
      :show-line-numbers="false"
      show-label
    />
    <CodeBlock
      :tabs="output"
      kind="output"
      :show-line-numbers="false"
    />
  </div>
</template>
