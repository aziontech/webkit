<script setup>
  import DocMarkdown from '@aziontech/ui/doc-markdown'
  import DocProse from '@aziontech/ui/doc-prose'

  const source = [
    '## Requests per minute',
    '',
    'The last twelve minutes of requests, oldest first.',
    '',
    '<SparkChart',
    '  aria-label="Requests per minute, last 12 minutes"',
    '  size="large"',
    '  values={[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]}',
    '/>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
