<script setup>
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = [
    '## Plans',
    '',
    'Pro adds custom domains and priority support.',
    '',
    '<PricingCard',
    '  title="Pro"',
    '  pricing-details="Billed annually or $25/mo billed monthly."',
    '  variant="contained"',
    '  value="20"',
    '  prefix="$"',
    '  suffix="/ month"',
    '  action-label="Start trial"',
    '/>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
