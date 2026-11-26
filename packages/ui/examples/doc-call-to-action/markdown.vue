<script setup>
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = [
    '## Next steps',
    '',
    '<CallToAction title="Ready to build?" primary-action={{ "label": "Start for free", "href": "/signup" }}>',
    '  Deploy your first application in minutes.',
    '</CallToAction>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
