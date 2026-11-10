<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'

  const tabs = [
    {
      label: 'Shell',
      value: 'single',
      language: 'bash',
      code: 'npx azion deploy --local'
    }
  ]
</script>

<template>
  <div class="max-w-[692px]">
    <CodeBlock
      :tabs="tabs"
      :show-line-numbers="false"
    />
  </div>
</template>
