<script setup>
  import DocMarkdown from '@aziontech/ui/doc-markdown'
  import DocProse from '@aziontech/ui/doc-prose'

  const source = [
    '## Threats by country',
    '',
    'Where the firewall blocked the most threat requests this week.',
    '',
    '<DonutChart',
    '  aria-label="Top WAF threat requests by country"',
    '  total-label="Blocked threats"',
    '  series={[',
    '    { "id": "United States", "name": "United States", "values": [48210] },',
    '    { "id": "United Kingdom", "name": "United Kingdom", "values": [31620] },',
    '    { "id": "Germany", "name": "Germany", "values": [18930] },',
    '    { "id": "India", "name": "India", "values": [12480] },',
    '    { "id": "Netherlands", "name": "Netherlands", "values": [9370] },',
    '    { "id": "Singapore", "name": "Singapore", "values": [6120] }',
    '  ]}',
    '/>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
