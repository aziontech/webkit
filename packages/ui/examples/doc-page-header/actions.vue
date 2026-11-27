<script setup>
  import DocPageHeader from '@aziontech/ui/doc-page-header'

  const onActionClick = (event, action) => action
</script>

<template>
  <DocPageHeader
    title="Deploy an application"
    description="Three entries, three shapes: a button that acts on the page, an in-app link, and a link that leaves the documentation."
    last-updated="2026-06-30"
    :meta-actions="[
      {
        value: 'copy',
        label: 'Copy as Markdown',
        icon: 'az az-copy',
        tip: 'Copy this page as Markdown, ready to paste into an assistant.'
      },
      {
        value: 'agent-setup',
        label: 'Agent setup',
        icon: 'az az-microchip-ai',
        href: '/docs/agent-setup',
        tip: 'Set up your coding agent to build on Azion.'
      },
      {
        value: 'source',
        label: 'Edit this page',
        icon: 'az az-pencil',
        href: 'https://github.com/aziontech/docs',
        target: '_blank',
        tip: 'Open this page in the repository and propose a change.'
      }
    ]"
    @action-click="onActionClick"
  />
</template>
