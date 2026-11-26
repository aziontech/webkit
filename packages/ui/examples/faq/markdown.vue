<script setup>
  import DocMarkdown from '@aziontech/ui/doc-markdown'
  import DocProse from '@aziontech/ui/doc-prose'

  const source = [
    '## Billing',
    '',
    '<Faq',
    '  title="Frequently asked questions"',
    '  items={[',
    '    { "value": "pricing", "question": "How does pricing work?", "answer": "You pay for what you use: requests, data transfer and compute time, with no seats and no upfront commitment." },',
    '    { "value": "free-tier", "question": "Is there a free tier?", "answer": "Yes. Every core product has a monthly free allowance, and billing starts only once you pass it." },',
    '    { "value": "support", "question": "What support do I get?", "answer": "Every account has documentation, community and email support. Paid plans add a 24/7 incident channel." }',
    '  ]}',
    '/>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
