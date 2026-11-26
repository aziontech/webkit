<script setup>
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = [
    '## Workload details',
    '',
    'What the console shows for a workload after it is created.',
    '',
    '<KeyValueList aria-label="Workload details" columns={2}>',
    '  <KeyValueListItem label="Workload ID">1752167890</KeyValueListItem>',
    '  <KeyValueListItem label="Status"><StatusIndicator severity="success" label="Active" /></KeyValueListItem>',
    '  <KeyValueListItem label="Created">Nov 10, 2026, 2:32 PM</KeyValueListItem>',
    '  <KeyValueListItem label="Region">US East (Virginia)</KeyValueListItem>',
    '  <KeyValueListItem label="Domain">[shop.example.com](https://shop.example.com)</KeyValueListItem>',
    '  <KeyValueListItem label="Custom certificate"></KeyValueListItem>',
    '</KeyValueList>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
