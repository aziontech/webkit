<script setup>
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = [
    '## Integrations',
    '',
    '<IntegrationCard',
    '  title="Request Signer"',
    '  vendor="Acme Inc."',
    '  logo="az az-key"',
    '  description="Sign every request at the edge with a rotating key, so the origin only answers traffic that passed through."',
    '  badges={[{ "label": "Firewall" }]}',
    '/>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
