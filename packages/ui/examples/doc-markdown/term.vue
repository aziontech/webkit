<script setup lang="ts">
  import DocMarkdown from '@aziontech/ui/doc-markdown'
  import DocProse from '@aziontech/ui/doc-prose'

  const source = [
    'Every response leaves the',
    '<Tooltip title="Origin shield"',
    'tip="One cache layer between the edge and your origin, so a miss asks the origin once instead of once per location."',
    'href="https://example.com/docs/cache/origin-shield" linkLabel="Learn more">origin shield</Tooltip>',
    'before it reaches your server, so the origin sees a fraction of the traffic.'
  ].join(' ')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
