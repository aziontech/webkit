<script setup>
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = [
    '## What Pro includes',
    '',
    '<PlanFeatureList aria-label="Pro plan features" items={[',
    '  { "label": "Unlimited Applications" },',
    '  { "label": "Unlimited Workloads" },',
    '  { "label": "Custom Domains" },',
    '  { "label": "Priority Support" }',
    ']} />'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
