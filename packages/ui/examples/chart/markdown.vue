<script setup>
  import DocMarkdown from '@aziontech/ui/doc-markdown'
  import DocProse from '@aziontech/ui/doc-prose'

  const source = [
    '## Threats vs requests',
    '',
    'Requests the firewall allowed, blocked and flagged as threats, every five minutes.',
    '',
    '<Chart',
    '  aria-label="Threats vs requests"',
    '  labels={["13:30", "13:35", "13:40", "13:45", "13:50", "13:55", "14:00"]}',
    '  series={[',
    '    { "id": "allowed", "name": "WAF requests allowed", "values": [1460, 1610, 1580, 1720, 1690, 1810, 1760] },',
    '    { "id": "blocked", "name": "WAF requests blocked", "values": [430, 610, 580, 540, 690, 650, 720] },',
    '    { "id": "threat", "name": "WAF requests threat", "values": [90, 140, 130, 115, 160, 150, 170] }',
    '  ]}',
    '>',
    '  <ChartGrid />',
    '  <ChartAxis type="y" />',
    '  <ChartAxis type="x" />',
    '  <ChartArea ids={["allowed"]} />',
    '  <ChartLine ids={["blocked", "threat"]} />',
    '  <ChartCrosshair />',
    '  <ChartTooltip />',
    '  <ChartLegend total />',
    '</Chart>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
