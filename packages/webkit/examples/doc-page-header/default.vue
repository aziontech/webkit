<script setup>
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
</script>

<template>
  <DocPageHeader
    title="Deploy an application"
    description="Go from a template to a live application in a few clicks."
    :breadcrumbs="[{ label: 'Docs', href: '/docs' }, { label: 'Deploy an application' }]"
    last-updated="2026-06-30"
    :meta-actions="[
      {
        value: 'copy',
        label: 'Copy as Markdown',
        icon: 'az az-copy',
        tip: 'Copy this page as Markdown, ready to paste into an assistant.'
      },
      {
        value: 'markdown',
        label: 'View as Markdown',
        icon: 'az az-eye',
        tip: 'Open this page as plain Markdown in a new tab.'
      },
      {
        value: 'agent-setup',
        label: 'Agent setup',
        icon: 'az az-microchip-ai',
        href: '/docs/agent-setup',
        tip: 'Set up your coding agent to build on Azion.'
      }
    ]"
  />
</template>
