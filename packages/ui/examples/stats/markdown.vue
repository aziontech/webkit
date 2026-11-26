<script setup>
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = [
    '## The network in numbers',
    '',
    '<Stats items={[',
    '  { "value": "120", "suffix": "+", "label": "Data centers" },',
    '  { "value": "99.99", "suffix": "%", "label": "Availability" },',
    '  { "prefix": "<", "value": "15", "suffix": "ms", "label": "Median latency" },',
    '  { "value": "4.5", "suffix": "Tbps", "label": "Network capacity" }',
    ']} />'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
