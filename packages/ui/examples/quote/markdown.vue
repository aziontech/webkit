<script setup>
  import DocMarkdown from '@aziontech/ui/doc-markdown'
  import DocProse from '@aziontech/ui/doc-prose'

  const source = [
    '## What customers say',
    '',
    'How a platform team describes the move.',
    '',
    '<Quote',
    '  text="Acme keeps hundreds of storefront applications available through every launch week and holiday sale, with no capacity planning."',
    '  name="Priya Patel"',
    '  job-title="CTO at Acme Inc."',
    '/>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
