<script setup>
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
</script>

<template>
  <DocPageHeader
    title="Deploy an application"
    description="Go from a template to a live edge application in a few clicks."
    :breadcrumb="[{ label: 'Docs', href: '/docs' }, { label: 'Deploy an application' }]"
    last-updated="2026-06-30"
    :meta-actions="[
      {
        value: 'copy',
        label: 'Copy as Markdown',
        icon: 'pi pi-copy',
        tip: 'Copy this page as Markdown, ready to paste into an assistant.'
      },
      {
        value: 'markdown',
        label: 'View as Markdown',
        icon: 'pi pi-eye',
        tip: 'Open this page as plain Markdown in a new tab.'
      },
      {
        value: 'agent-setup',
        label: 'Agent setup',
        icon: 'pi pi-microchip-ai',
        href: '/docs/agent-setup',
        tip: 'Set up your coding agent to build on Azion.'
      }
    ]"
  />
</template>
