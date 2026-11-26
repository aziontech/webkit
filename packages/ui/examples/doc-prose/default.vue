<script setup>
  import DocMarkdown from '@aziontech/ui/doc-markdown'
  import DocProse from '@aziontech/ui/doc-prose'

  const source = [
    '## Deploy an application',
    '',
    "Templates are ready-made projects that go live in a few clicks. You don't need any local tooling, and the [template's guide](https://www.azion.com/en/documentation/) lists what each one needs.",
    '',
    '### What you get',
    '',
    '- A **workload** bound to its own Azion domain',
    '- An edge application built from your `azion.config.js`',
    '- A certificate issued and renewed for you',
    '',
    '1. Pick a template',
    '2. Fill in the fields it asks for',
    '3. Deploy',
    '',
    '> The first request to a location is a cache miss. Warm-up is per location, not global.',
    '',
    '#### Build command',
    '',
    'An h4 is a label inside a section rather than a new section, so it shares the base gap of the prose around it and carries its level on weight instead.',
    '',
    '---',
    '',
    'A section break above resets the reader before the next part of the page.'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
