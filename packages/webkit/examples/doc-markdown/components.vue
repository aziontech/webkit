<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import DocMarkdown, { parseDocMarkdown } from '@aziontech/webkit/doc-markdown'
  import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'
  import DocProse from '@aziontech/webkit/doc-prose'

  const components = { Alert }

  const source = [
    '## Maintenance',
    '',
    '<Alert severity="warning" label="Deploys pause on March 9, 2026, from 02:00 to 03:00 UTC." />',
    '',
    'Requests keep being served during the window; only new deploys wait.',
    '',
    '## Changelog',
    '',
    '<Update label="March 2, 2026" description="v2.4.0" tags={["CLI"]}>Deploys start 30% faster.</Update>'
  ].join('\n')

  const { headings } = parseDocMarkdown(source, components)
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-lg) md:flex-row">
    <DocProse class="min-w-0 flex-1">
      <DocMarkdown
        :source="source"
        :components="components"
      />
    </DocProse>
    <DocOnThisPage
      :items="headings"
      class="md:w-(--container-3xs)"
    />
  </div>
</template>
