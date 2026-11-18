<script setup>
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = [
    '## Top paths',
    '',
    'The paths that served the most requests in the last 24 hours.',
    '',
    '<BarList',
    '  aria-label="Top paths"',
    '  items={[',
    '    { "name": "/home", "value": 843 },',
    '    { "name": "/documentation", "value": 384 },',
    '    { "name": "/blocks", "value": 108 },',
    '    { "name": "/imprint", "value": 46 },',
    '    { "name": "/cancellation", "value": 3 }',
    '  ]}',
    '/>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
