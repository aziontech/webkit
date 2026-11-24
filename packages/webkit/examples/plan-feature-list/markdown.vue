<script setup>
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = [
    '## What Pro includes',
    '',
    '<PlanFeatureList aria-label="Pro plan features" items={[',
    '  { "label": "Unlimited applications" },',
    '  { "label": "Unlimited workloads" },',
    '  { "label": "Custom domains" },',
    '  { "label": "Priority support" }',
    ']} />'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
