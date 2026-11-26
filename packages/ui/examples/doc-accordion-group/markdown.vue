<script setup>
  import DocMarkdown from '@aziontech/ui/doc-markdown'

  const source = [
    '<AccordionGroup>',
    '  <Accordion title="Why does my first request miss the cache?">',
    '    Each location warms up on its own first request.',
    '  </Accordion>',
    '  <Accordion title="Can I purge a single path?">',
    '    Yes. Purge by URL for one object, or by wildcard for a folder.',
    '  </Accordion>',
    '</AccordionGroup>'
  ].join('\n')
</script>

<template>
  <DocMarkdown :source="source" />
</template>
