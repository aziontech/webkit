<script setup>
  import CodeBlock from '@aziontech/ui/code-block'

  const original = `{
  "name": "acme-store",
  "cache": {
    "ttl": 60,
    "bypass": false
  },
  "origin": "https://origin.example.com"
}`

  const code = `{
  "name": "acme-store",
  "cache": {
    "ttl": 300,
    "bypass": false,
    "stale": true
  },
  "origin": "https://origin.example.com"
}`

  const tabs = [
    {
      label: 'Settings',
      value: 'settings',
      language: 'json',
      fileName: 'cache.json',
      code,
      original
    }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <CodeBlock :tabs="tabs" />
    <CodeBlock
      :tabs="tabs"
      diff-view="split"
    />
  </div>
</template>
