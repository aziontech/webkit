<script setup>
  import DocMarkdown from '@aziontech/ui/doc-markdown'
  import DocProse from '@aziontech/ui/doc-prose'

  const source = [
    '## How a request reaches your origin',
    '',
    'Every request stops at the nearest Azion location before it reaches your origin.',
    '',
    '<FlowDiagram',
    '  aria-label="Request path"',
    '  uniform',
    '  nodes={[',
    '    { "id": "you", "eyebrow": "Client", "icon": "az az-user", "title": "You", "description": "Browser" },',
    '    { "id": "azion", "eyebrow": "Application", "icon": "az az-globe", "title": "Azion", "description": "San Francisco, US", "status": "Working", "severity": "success" },',
    '    { "id": "origin", "eyebrow": "Origin", "icon": "az az-server", "title": "api.example.com", "description": "Ashburn, US", "status": "Working", "severity": "success" }',
    '  ]}',
    '  edges={[',
    '    { "from": "you", "to": "azion", "label": "18 ms" },',
    '    { "from": "azion", "to": "origin", "label": "42 ms" }',
    '  ]}',
    '/>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
