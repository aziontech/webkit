<script setup>
  import DocCodeGroup from '@aziontech/ui/doc-code-group'

  const samples = [
    { label: 'npm', language: 'bash', code: 'npm install @aziontech/ui' },
    { label: 'pnpm', language: 'bash', code: 'pnpm add @aziontech/ui' },
    { label: 'yarn', language: 'bash', code: 'yarn add @aziontech/ui' }
  ]
</script>

<template>
  <DocCodeGroup :samples="samples" />
</template>
