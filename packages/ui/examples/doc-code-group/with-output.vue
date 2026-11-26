<script setup>
  import DocCodeGroup from '@aziontech/ui/doc-code-group'

  const samples = [
    {
      language: 'bash',
      code: 'curl -I https://<your-azion-domain>',
      output: 'HTTP/2 200'
    }
  ]
</script>

<template>
  <DocCodeGroup :samples="samples" />
</template>
