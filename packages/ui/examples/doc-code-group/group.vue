<script setup>
  import DocCodeGroup from '@aziontech/webkit/doc-code-group'

  const samples = [
    { label: 'npm', language: 'bash', code: 'npm install @aziontech/webkit' },
    { label: 'pnpm', language: 'bash', code: 'pnpm add @aziontech/webkit' },
    { label: 'yarn', language: 'bash', code: 'yarn add @aziontech/webkit' }
  ]
</script>

<template>
  <DocCodeGroup :samples="samples" />
</template>
