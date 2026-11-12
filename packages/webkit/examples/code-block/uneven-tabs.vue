<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'

  const tabs = [
    {
      label: 'Shell',
      value: 'shell',
      language: 'bash',
      code: 'npx azion deploy --local'
    },
    {
      label: 'Javascript',
      value: 'js',
      language: 'javascript',
      code: "const response = await fetch('https://api.azion.com/v4/workspace/workloads', {\n  headers: { Authorization: `Token ${token}` }\n})\n\nconst { results } = await response.json()"
    }
  ]
</script>

<template>
  <div class="max-w-[692px]">
    <CodeBlock
      :tabs="tabs"
      default-value="shell"
      :show-line-numbers="false"
    />
  </div>
</template>
