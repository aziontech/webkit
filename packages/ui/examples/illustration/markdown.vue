<script setup>
  import DocMarkdown from '@aziontech/ui/doc-markdown'
  import DocProse from '@aziontech/ui/doc-prose'

  const source = ['## Modern frontends', '', '<Illustration name="modern-frontends" />'].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
