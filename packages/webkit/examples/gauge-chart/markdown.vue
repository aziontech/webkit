<script setup>
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = [
    '## Cache hit ratio',
    '',
    'The share of requests served from cache in the last hour, out of 100.',
    '',
    '<GaugeChart',
    '  aria-label="Cache hit ratio"',
    '  value={74}',
    '  label="Cache hit ratio, %"',
    '  thresholds={[',
    '    { "value": 0, "severity": "danger" },',
    '    { "value": 50, "severity": "warning" },',
    '    { "value": 70, "severity": "success" }',
    '  ]}',
    '/>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
